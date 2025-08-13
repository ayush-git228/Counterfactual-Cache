# Counterfactual Cache: Counterfactual Performance Explorer

Measure once, simulate infinitely: Explore performance optimizations without reloading.

Counterfactual Cache is an interactive web performance analysis tool that allows you to measure website load times with precision, simulate optimization scenarios in real-time, and visualize potential performance improvements.

---
<img width="1917" height="528" alt="ss-ss-4" src="https://github.com/user-attachments/assets/dd7a58fe-ba99-433c-901c-7426f19a34c1" />

---
<img width="1895" height="589" alt="ss-ss-1" src="https://github.com/user-attachments/assets/9dc7e32a-418c-4245-89ee-734945269cf0" />

----
<img width="1891" height="701" alt="ss-ss-2" src="https://github.com/user-attachments/assets/2fb646b5-c1bb-4299-ab7e-83ddcf3d1282" />

---
<img width="1878" height="807" alt="ss-ss-3" src="https://github.com/user-attachments/assets/88e87278-97c9-4fb4-87f3-9f0906c9a22a" />

---
<img width="1894" height="920" alt="ss-ss-5" src="https://github.com/user-attachments/assets/e889f378-e6bb-4d91-9676-9744a441c10e" />

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
```

---

## Run Application

```bash
python run.py
```

Go to  http://127.0.0.1:8000 or your local Url

---

## Usage Guide 🚀

Basic Workflow

1. Enter a URL in the input field

2. Click "Measure" to start analysis

3. View detailed phase breakdown and timing metrics

4. Toggle optimization scenarios to see potential improvements


| Optimization        | Effect                      | Key Benefit                 |
| ------------------- | --------------------------- | --------------------------- |
| TLS Warm Connection | Reduces TLS handshake time  | Faster secure connections   |
| Edge Cache Hit      | Lowers RTT latency          | Improved global performance |
| JS Deferral         | Eliminates render-blocking  | Faster page interactivity   |
| Early Hints         | Enables resource preloading | Parallelized loading        |

---

## Technical Architecture ⚙️


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

## Contributing 🤝

I welcome contributions! Please follow these steps:

```bash
# Fork the repository

# Create a feature branch
git checkout -b feature/your-feature

# Commit your changes
git commit -am 'Add some feature'

# Push to the branch
git push origin feature/your-feature

# Open a pull request
```

---

## Roadmap for future (I think so)🗺️

1. Mobile device simulation

2. Lighthouse integration

3. CI/CD performance tracking

4. Automated optimization suggestions

5. Multi-page analysis

