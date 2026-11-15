# DevOps System Monitor & CI/CD Pipeline HUD

A futuristic, real‑time dashboard for monitoring infrastructure telemetry, managing Docker containers, and simulating a CI/CD pipeline — all in a single, self‑contained HTML page.

---

## 📋 Overview

This project provides a **DevOps control center HUD** that visualizes:

- Live system telemetry (CPU, RAM, Disk I/O)
- A Docker container fleet with start/kill and spawn capabilities
- A multi‑stage CI/CD pipeline with animated stage transitions and deployment logs

It is built with **vanilla HTML, CSS, and JavaScript** — no frameworks, no build step, no dependencies.

---

## 🚀 Features

### 1. Live System Telemetry
- **CPU Load**, **RAM Usage**, and **Disk I/O** update every 1.5 seconds with randomized realistic values.
- Animated progress bars reflect the current metric values in real time.

### 2. Docker Container Fleet
- Pre‑populated with four containers (Redis, PostgreSQL, Node, Nginx).
- **Toggle** any container between `running` and `stopped` states.
- **Spawn** a new random container (random image and port) with a single click.
- Status badges (green/red) indicate container health at a glance.

### 3. CI/CD Pipeline Runner
- A four‑stage pipeline: **Git Checkout → Unit Tests → Docker Build → K8s Deploy**.
- Click **Trigger Pipeline** to simulate an end‑to‑end build.
- Each stage transitions through `active` (pulsing amber) → `success` (emerald) with realistic timing.
- A detailed **deployment log** displays timestamped messages with color‑coded severity levels (info, success, warn, error).

### 4. HUD‑Style Design
- Dark cyber‑industrial theme with neon cyan, emerald, violet, and rose accents.
- Fully responsive layout that collapses gracefully on smaller screens.
- Sticky table headers and scrollable panels for a desktop‑like experience.

---

## 🗂️ Project Structure

```
├── index.html      # Markup & layout
├── style.css       # HUD styling, animations, responsive grid
└── script.js       # Container simulation, telemetry, pipeline logic
```

---

## 🛠️ Getting Started

1. **Clone or download** the three files into the same directory.
2. **Open `index.html`** in any modern browser (Chrome, Firefox, Edge, Safari).
3. That's it — no server, no installation, no dependencies required.

> 💡 For the best experience, use a desktop browser with a viewport width of at least 900px.

---

## 🎮 Usage

| Action | How |
|--------|-----|
| **Kill / Start a container** | Click the `Kill` or `Start` button in the container table. |
| **Spawn a new container** | Click `+ Spawn` above the container table. |
| **Run the CI/CD pipeline** | Click `Trigger Pipeline`. Watch the stages light up and logs stream in. |
| **Observe telemetry** | Just watch — metrics update automatically every 1.5 seconds. |

---

## 🧪 Simulation Details

### Telemetry
| Metric | Range | Bar Scaling |
|--------|-------|-------------|
| CPU | 15% – 40% | Direct (0–100%) |
| RAM | 5.8 – 7.3 GB | Percentage of 16 GB |
| Disk | 12 – 17 MB/s | `value × 2` (capped visually) |

### Pipeline Stages
| Stage | Duration | Log Outcome |
|-------|----------|-------------|
| Git Checkout | ~1.0 s | Commit SHA reported |
| Unit Tests | ~1.4 s | 48 suites passed |
| Docker Build | ~1.6 s | Image pushed to registry |
| K8s Deploy | ~1.2 s | Pods healthy |

Total simulated pipeline runtime: **~5.2 seconds**.

---

## 🎨 Customization

All theme colors live in `style.css` under `:root`:

```css
:root {
  --bg: #04070d;
  --panel: #0a101d;
  --cyan: #00f0ff;
  --emerald: #10b981;
  --violet: #8b5cf6;
  --rose: #f43f5e;
  --amber: #f59e0b;
  /* ... */
}
```

- **Add container images** → extend the `images` array inside `spawnContainer()` in `script.js`.
- **Change pipeline speed** → adjust the `setTimeout` durations in `triggerPipeline()`.
- **Add a new pipeline stage** → insert a new `.stage-node` in `index.html` and a matching block in `script.js`.

---

## 🌐 Browser Support

| Browser | Status |
|---------|--------|
| Chrome / Edge (recent) | ✅ Fully supported |
| Firefox (recent) | ✅ Fully supported |
| Safari (recent) | ✅ Fully supported |
| Mobile browsers | ⚠️ Functional, layout stacks vertically |

---

## 📄 License

This project is provided as‑is for demonstration and educational purposes. You are free to use, modify, and distribute it.

---

## 🙌 Acknowledgements

Inspired by sci‑fi HUD interfaces and real‑world DevOps dashboards. All data is simulated — no real containers, clusters, or pipelines are affected.