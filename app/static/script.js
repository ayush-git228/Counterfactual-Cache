document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const measureBtn = document.getElementById('measure-btn');
    const targetUrl = document.getElementById('target-url');
    const errorMessage = document.getElementById('error-message');
    const resultsSection = document.getElementById('results-section');
    const toggleCards = document.querySelectorAll('.toggle-card');
    const originalTotalEl = document.getElementById('original-total');
    const optimizedTotalEl = document.getElementById('optimized-total');
    const timeSavedEl = document.getElementById('time-saved');
    const phaseTableBody = document.querySelector('#phase-table tbody');
    const fullAuditBtn = document.getElementById('full-audit-btn');
    const permalinkEl = document.getElementById('permalink');
    const copyBtn = document.getElementById('copy-btn');

    let currentData = null;       // data returned by /api/measure
    let simData = null;           // data returned by /simulate based on toggles
    let chart = null;
    let currentScenario = {
        tls_warm: false,
        edge_cache: false,
        defer_js: false,
        early_hints: false
    };

    // toggles click behavior
    toggleCards.forEach(card => {
        const checkbox = card.querySelector('input');
        card.addEventListener('click', () => {
            checkbox.checked = !checkbox.checked;
            currentScenario[card.dataset.opt] = checkbox.checked;
            // if we already have data, update visualization using simulation endpoint
            if (currentData) {
                updateVisualization();
            }
        });
    });

    // measure button
    measureBtn.addEventListener('click', async () => {
        const url = targetUrl.value.trim();
        showError('');
        resultsSection.style.display = 'none';
        fullAuditBtn.style.display = 'none';
        currentData = null;
        simData = null;

        if (!url) {
            showError('Please enter a valid URL.');
            return;
        }

        try {
            const res = await fetch(`/api/measure?url=${encodeURIComponent(url)}&runs=3`);
            if (!res.ok) {
                const txt = await res.text();
                throw new Error(txt || `HTTP ${res.status}`);
            }
            const data = await res.json();
            // minimal validation
            if (!data || !data.original) throw new Error('Invalid data from server.');

            currentData = data;
            // immediately compute simulation according to current toggles
            await updateVisualization();

            resultsSection.style.display = 'block';
            fullAuditBtn.style.display = 'inline-block';
            // build permalink
            buildPermalink();

        } catch (err) {
            showError(`Measurement failed: ${err.message}`);
            console.error(err);
        }
    });

    async function updateVisualization() {
        if (!currentData) return;

        try {
            const params = new URLSearchParams({
                url: targetUrl.value,
                tls_warm: currentScenario.tls_warm ? '1' : '0',
                edge_cache: currentScenario.edge_cache ? '1' : '0',
                defer_js: currentScenario.defer_js ? '1' : '0',
                early_hints: currentScenario.early_hints ? '1' : '0'
            });
            const res = await fetch(`/simulate?${params.toString()}`);
            if (!res.ok) {
                console.warn('Simulation endpoint failed, falling back to original');
                simData = {
                    original: currentData.original,
                    optimized: currentData.optimized || currentData.original,
                    phases: currentData.phases || []
                };
            } else {
                simData = await res.json();
            }

            renderMetrics(simData);
            renderPhaseTable(simData);
            renderChart(simData);
            buildPermalink();
        } catch (err) {
            console.error('updateVisualization error:', err);
        }
    }

    function renderMetrics(data) {
        const originalTotal = (data.original && data.original.total) ? data.original.total : 0;
        const optimizedTotal = (data.optimized && data.optimized.total) ? data.optimized.total : originalTotal;
        const timeSaved = originalTotal - optimizedTotal;
        originalTotalEl.textContent = `${originalTotal.toFixed(1)} ms`;
        optimizedTotalEl.textContent = `${optimizedTotal.toFixed(1)} ms`;
        timeSavedEl.textContent = `${timeSaved.toFixed(1)} ms`;
    }

    function renderPhaseTable(data) {
        phaseTableBody.innerHTML = '';
        const phases = data.phases || [];
        phases.forEach(p => {
            const tr = document.createElement('tr');
            const deltaClass = (p.delta < 0) ? 'delta-negative' : 'delta-positive';
            const deltaSign = (p.delta < 0) ? '' : '+';
            tr.innerHTML = `
                <td>${p.name}</td>
                <td>${(p.original||0).toFixed(1)} ms</td>
                <td>${(p.optimized||0).toFixed(1)} ms</td>
                <td class="${deltaClass}">${deltaSign}${(p.delta||0).toFixed(1)} ms</td>
            `;
            phaseTableBody.appendChild(tr);
        });

        // Add totals row if totals exist
        const originalTotal = data.original && data.original.total ? data.original.total : 0;
        const optimizedTotal = data.optimized && data.optimized.total ? data.optimized.total : originalTotal;
        const totalDelta = optimizedTotal - originalTotal;
        const totalDeltaClass = totalDelta < 0 ? 'delta-negative' : 'delta-positive';
        const totalDeltaSign = totalDelta < 0 ? '' : '+';
        const totalRow = document.createElement('tr');
        totalRow.innerHTML = `
            <td><strong>Total Load Time</strong></td>
            <td><strong>${originalTotal.toFixed(1)} ms</strong></td>
            <td><strong>${optimizedTotal.toFixed(1)} ms</strong></td>
            <td class="${totalDeltaClass}"><strong>${totalDeltaSign}${totalDelta.toFixed(1)} ms</strong></td>
        `;
        phaseTableBody.appendChild(totalRow);
    }

    function renderChart(data) {
        const ctx = document.getElementById('phase-chart').getContext('2d');

        const phases = data.phases || [];
        const labels = phases.map(p => p.name);
        const originalData = phases.map(p => p.original || 0);
        const optimizedData = phases.map(p => p.optimized || 0);

        // destroy previous chart if exists
        if (chart) {
            try {
                chart.destroy();
            } catch (e) {
                console.warn('Error destroying chart:', e);
            }
            chart = null;
        }

        chart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [
                    { label: 'Original', data: originalData, backgroundColor: '#4E79A7' },
                    { label: 'Optimized', data: optimizedData, backgroundColor: '#59A14F' }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: { stacked: true },
                    y: { stacked: true, beginAtZero: true }
                }
            }
        });
    }

    // Full Audit -> request larger runs and download PDF
    fullAuditBtn.addEventListener('click', async () => {
        if (!currentData) {
            alert('Run a measurement first.');
            return;
        }
        fullAuditBtn.disabled = true;
        fullAuditBtn.textContent = 'Generating...';

        try {
            // Request more reliable measurement (more runs)
            const res = await fetch(`/api/measure?url=${encodeURIComponent(targetUrl.value)}&runs=5`);
            if (!res.ok) throw new Error(`Measure failed (HTTP ${res.status})`);
            const measured = await res.json();

            // send to report endpoint
            const reportRes = await fetch('/api/report', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(measured)
            });
            if (!reportRes.ok) {
                const text = await reportRes.text();
                throw new Error(text || `HTTP ${reportRes.status}`);
            }

            const blob = await reportRes.blob();
            const blobUrl = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = 'audit_report.pdf';
            document.body.appendChild(a);
            a.click();
            a.remove();
            URL.revokeObjectURL(blobUrl);
        } catch (err) {
            alert(`Error generating report: ${err.message}`);
            console.error(err);
        } finally {
            fullAuditBtn.disabled = false;
            fullAuditBtn.textContent = 'Download Full Audit (PDF)';
        }
    });

    copyBtn.addEventListener('click', () => {
        permalinkEl.select();
        document.execCommand('copy');
        alert('Permalink copied!');
    });

    function buildPermalink() {
        const params = new URLSearchParams({
            url: targetUrl.value,
            tls_warm: currentScenario.tls_warm ? 1 : 0,
            edge_cache: currentScenario.edge_cache ? 1 : 0,
            defer_js: currentScenario.defer_js ? 1 : 0,
            early_hints: currentScenario.early_hints ? 1 : 0
        });
        permalinkEl.value = `${window.location.origin}/?${params.toString()}`;
    }

    function showError(msg) {
        errorMessage.textContent = msg || '';
    }
});