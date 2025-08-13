# Counterfactual Cache: Counterfactual Performance Explorer

Measure once, simulate infinitely: Explore performance optimizations without reloading.

Counterfactual Cache is an interactive web performance analysis tool that allows you to measure website load times with precision, simulate optimization scenarios in real-time, and visualize potential performance improvements.

---

## Key Features ✨

### 🎯 Precise Performance Measurement
- **Full Load Lifecycle Analysis:**  
  Redirect → DNS → TCP → TLS → HTTP Wait → Download → Client Render  
- **TTFB (Time To First Byte) vs Full Load Time distinction**  
- **Statistical Reliability:**  
  - Multiple measurement runs (3-5x) for accuracy  
  - Outlier detection and filtering  
  - Confidence interval calculation  

### ⚡ Real-time Optimization Simulations
- **Infrastructure Optimizations:**  
  - 🔥 TLS Warm Connection (session reuse)  
  - 🌐 Edge Cache Hit (lower RTT)  
  - 🚀 CDN Optimization (reduced latency)  
- **Content Delivery Optimizations:**  
  - ⏳ Defer Non-Critical JS (reduce render-blocking)  
  - 🚀 Early Hints/Preload (resource preloading)  
  - 🖼️ Image Optimization (faster decoding)  

### 📊 Visual Analytics & Reporting
- **Interactive Dashboards:**  
  - Before/After comparison charts  
  - Phase-by-phase delta analysis  
  - Waterfall visualization  
- **Shareable Results:**  
  - Permalinks for any scenario  
  - One-click copying  
- **Exportable Reports:**  
  - Comprehensive PDF audit reports  
  - Performance improvement recommendations  

### ⚙️ Advanced Capabilities (To be implemented)
- Proxy Support: Test from different geographic locations  
- Historical Analysis: Track performance over time  
- Custom Scenarios: Create and save optimization combinations  
- Network Simulation: 3G, 4G, WiFi conditions  

---

## Installation & Setup 🛠️

### Prerequisites
- Python 3.10+  
- Node.js 18+ (for Playwright)  
- Chromium browser  

### Step-by-Step Installation

```bash
# Clone repository
git clone https://github.com/yourusername/Counterfactual-Cache.git
cd Counterfactual-Cache

# Create virtual environment
python -m venv .venv

# Activate environment
source .venv/bin/activate   # Linux/Mac
.venv\Scripts\activate      # Windows

# Install Python dependencies
pip install -r requirements.txt

# Install Playwright browsers
playwright install chromium

# Install system dependencies for Playwright
playwright install-deps chromium

---

Usage Guide 🚀

Basic Workflow

1. Enter a URL in the input field

2. Click "Measure" to start analysis

3. View detailed phase breakdown and timing metrics

4. Toggle optimization scenarios to see potential improvements

---

| Optimization        | Effect                      | Key Benefit                 |
| ------------------- | --------------------------- | --------------------------- |
| TLS Warm Connection | Reduces TLS handshake time  | Faster secure connections   |
| Edge Cache Hit      | Lowers RTT latency          | Improved global performance |
| JS Deferral         | Eliminates render-blocking  | Faster page interactivity   |
| Early Hints         | Enables resource preloading | Parallelized loading        |

---

Technical Architecture ⚙️


Measurement Methodology


Technology Stack


Backend:

1. FastAPI (Python)

2. Playwright (Browser automation)

3. Pandas (Data analysis)


Frontend:

1. Vanilla JavaScript

2. Chart.js (Visualizations)

3. Jinja2 Templates


Export:

1. Playwright PDF generation

---

