import sys
import asyncio
import time
from pathlib import Path
from typing import Optional
import json

from fastapi import FastAPI, Query, HTTPException, Request
from fastapi.responses import JSONResponse, FileResponse, HTMLResponse, StreamingResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from jinja2 import Environment, FileSystemLoader

from .services_playwright import measure_multiple_runs, simulate_optimizations

# Playwright for PDF generation
try:
    from playwright.async_api import async_playwright
    PLAYWRIGHT_IMPORT_OK = True
except Exception:
    PLAYWRIGHT_IMPORT_OK = False

# Track measurement times for progress simulation
MEASUREMENT_TIMES = {}  # {url: average_measurement_time}

# Ensure Windows has a subprocess-capable event loop when running under built-in servers
if sys.platform == "win32":
    try:
        asyncio.set_event_loop_policy(asyncio.WindowsProactorEventLoopPolicy())
    except Exception:
        # Best effort; if this fails we still handle errors downstream
        pass


app = FastAPI(title="Real Performance Auditor")

BASE_DIR = Path(__file__).parent
TEMPLATES_DIR = BASE_DIR / "templates"
STATIC_DIR = BASE_DIR / "static"

# mount static and templates
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=str(TEMPLATES_DIR))
env = Environment(loader=FileSystemLoader(str(TEMPLATES_DIR)))


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/api/measure")
async def api_measure(
    url: str = Query(...),
    runs: int = 3,
    timeout: int = 30000,
    proxies: Optional[str] = None
):
    if not url:
        raise HTTPException(400, "Missing url")

    proxy_list = proxies.split(",") if proxies else None
    start_time = time.time()
    try:
        result = await measure_multiple_runs(
            url,
            runs=int(runs),
            timeout=int(timeout),
            proxies=proxy_list
        )
        # Calculate measurement duration
        duration = time.time() - start_time
        
        # Update average measurement time for this URL
        if url in MEASUREMENT_TIMES:
            # Simple moving average
            MEASUREMENT_TIMES[url] = (MEASUREMENT_TIMES[url] + duration) / 2
        else:
            MEASUREMENT_TIMES[url] = duration
            
        # Guarantee response shapes used by front-end
        safe = {
            "url": result.get("url", url),
            "runs": result.get("runs", runs),
            "original": result.get("original", {}),
            "optimized": result.get("optimized", {}),
            "phases": result.get("phases", []),
            "raw_results": result.get("raw_results", []),
        }
        return JSONResponse(safe)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, f"Measurement failed: {str(e)}")

@app.get("/api/progress")
async def progress_endpoint(request: Request, url: str = Query(...)):
    # Get average measurement time for this URL or default to 10 seconds
    avg_measurement_time = MEASUREMENT_TIMES.get(url, 10.0)
    
    # Calculate interval based on number of phases
    num_phases = 8
    interval = max(0.5, min(avg_measurement_time / num_phases, 3.0))
    
    async def event_generator():
        # Define progress phases
        progress_steps = [
            (5, "Initializing measurement"),
            (15, "Establishing connection"),
            (25, "Loading page content"),
            (40, "Analyzing resources"),
            (55, "Measuring load performance"),
            (70, "Calculating metrics"),
            (85, "Compiling results"),
            (100, "Measurement complete!")
        ]
        
        for percent, message in progress_steps:
            if await request.is_disconnected():
                break
                
            # Format as proper Server-Sent Event
            data = json.dumps({
                "progress": percent,
                "message": message
            })
            yield f"data: {data}\n\n"
            await asyncio.sleep(interval)
    
    return StreamingResponse(event_generator(), media_type="text/event-stream")


@app.get("/simulate")
async def api_simulate(
    url: str = Query(...),
    tls_warm: bool = False,
    edge_cache: bool = False,
    defer_js: bool = False,
    early_hints: bool = False
):
    """
    Simulate optimizations (keeps same response shape as /api/measure but with 'optimized' adjusted)
    """
    try:
        result = await simulate_optimizations(url, tls_warm, edge_cache, defer_js, early_hints)
        # Build similar shape to /api/measure
        original = result["original"]
        optimized = result["optimized"]
        phases = []
        phase_ids = ["redirect", "dns", "connect", "tls", "http_wait", "download", "client_render"]
        names = ["Redirect", "DNS", "TCP Connect", "TLS Handshake", "HTTP Wait", "Download", "Client Render"]
        for pid, name in zip(phase_ids, names):
            o = float(original.get(pid, 0.0)) or 0.0
            opt = float(optimized.get(pid, 0.0)) or 0.0
            phases.append({
                "id": pid, "name": name,
                "original": round(o, 1),
                "optimized": round(opt, 1),
                "delta": round(opt - o, 1)
            })
        resp = {
            "url": url,
            "original": original,
            "optimized": optimized,
            "phases": phases
        }
        return JSONResponse(resp)
    except Exception as e:
        raise HTTPException(500, f"Simulation failed: {e}")


@app.post("/api/report")
async def api_report(body: dict):
    """
    Generate PDF report from measurement JSON.
    Accepts the JSON produced by /api/measure as POST body and returns a PDF.
    """
    data = body or {}
    template = env.get_template("report.html")
    html = template.render(data=data)

    # On Windows
    # pdf_path = str((BASE_DIR / "report.pdf").resolve())
    pdf_path = r"C:\\Downloads\\report.pdf"

    if not PLAYWRIGHT_IMPORT_OK:
        raise HTTPException(status_code=500, detail="PDF generation failed: Playwright is not installed/importable")

    try:
        async with async_playwright() as pw:
            # Launch Chromium; add --no-sandbox for some environments if needed
            browser = await pw.chromium.launch(headless=True)
            context = await browser.new_context()
            page = await context.new_page()
            await page.set_content(html, wait_until="networkidle")
            await page.pdf(path=pdf_path, format="A4", print_background=True)
            await browser.close()
    except Exception as e:
        # Return a clear error; Windows event loop or missing browsers are common causes
        raise HTTPException(status_code=500, detail=f"PDF generation failed: {e}")

    return FileResponse(pdf_path, media_type="application/pdf", filename="report.pdf")