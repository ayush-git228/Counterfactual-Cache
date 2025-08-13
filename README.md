# Counterfactual Cache: Counterfactual Performance Explorer

Measure once, simulate infinitely: Explore performance optimizations without reloading.

Counterfactual Cache is an interactive web performance analysis tool that allows you to measure website load times with precision, simulate optimization scenarios in real-time, and visualize potential performance improvements.

---
<img width="1920" height="491" alt="ss-ss-1" src="https://github.com/user-attachments/assets/d999e1ea-4050-4e06-b715-193a3ec516c1" />

---
<img width="1885" height="584" alt="ss-ss-2" src="https://github.com/user-attachments/assets/fd9e0849-cbff-435b-8ccc-537e0ed011c7" />

----
<img width="1891" height="691" alt="ss-ss-3" src="https://github.com/user-attachments/assets/9b93c277-95f1-4871-9afb-abf165d55bbe" />

---
<img width="1889" height="800" alt="ss-ss-4" src="https://github.com/user-attachments/assets/7eb284a0-233e-4e2c-bf01-e43b2559f238" />

---
<img width="1909" height="892" alt="ss-ss-5" src="https://github.com/user-attachments/assets/f53dad24-a1d4-4618-aae1-a3b54242f3a2" />

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
git clone https://github.com/ayush-git228/Counterfactual-Cache.git
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

