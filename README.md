# 💹 Projection – 401(k) & Wealth Projection App

**Projection** is a full-stack TypeScript + Python project that forecasts 401(k) and investment growth, visualizes future retirement balances, and lets users compare scenarios across Web, Android, and iOS.

---

## 🧱 Stack Overview

### Frontend
| Platform | Framework | Key UI Libraries |
|-----------|------------|------------------|
| **Web** | **Next.js 14 + TypeScript + React 18** | MUI 6, ag-Grid Community 32, ECharts 5 |
| **Mobile (Android / iOS)** | **Expo SDK 51 + React Native 0.75 + TypeScript** | Tamagui (cross-platform design system), FlashList (Shopify) |
| **Shared Packages** | Pure TypeScript monorepo using pnpm + Turborepo | core (math logic), ui (design system), api-client (OpenAPI) |

### Backend
| Service | Framework | Language | Notes |
|----------|------------|-----------|-------|
| **fastapi-calcs** | **FastAPI 1.x + Uvicorn** | **Python 3.11+** | Handles financial calculations, Monte Carlo projections, and scenario simulations. |

---

## 🧮 Core Tech Highlights
- **Computation**: NumPy, pandas, numpy-financial, SciPy, Numba (for JIT speed-ups)
- **API Docs**: Auto-generated OpenAPI + Swagger from FastAPI
- **Type Safety**: End-to-end via TypeScript + Zod + OpenAPI client
- **Charts**: ECharts (Web) / Victory Native or ECharts WebView (Native)
- **Tables**: ag-Grid (Web) / FlashList (Native)
- **State & Data**: TanStack Query + Zustand
- **Forms**: react-hook-form + zod

---

## 📁 Monorepo Structure

```
projection/
├─ apps/
│  ├─ web/                 → Next.js + MUI + ECharts + ag-Grid
│  └─ mobile/              → Expo React Native + Tamagui + FlashList
├─ packages/
│  ├─ core/                → Shared TS financial math library
│  ├─ ui/                  → Cross-platform design system
│  └─ api-client/          → Typed client generated from FastAPI OpenAPI
└─ services/
   └─ fastapi-calcs/       → FastAPI backend service (Python)
```

---

## 🧰 Tooling

| Tool | Purpose |
|------|----------|
| **pnpm** | Workspace & dependency management |
| **Turborepo** | Monorepo build / dev pipeline |
| **TypeScript 5** | Shared types across all packages |
| **ESLint + Prettier** | Linting & formatting |
| **Expo CLI / EAS Build** | Native build & web export |
| **Uvicorn** | Local FastAPI server |
| **openapi-typescript** | Generate typed TS API client |

---

## 🚀 Quick Start

### 1️⃣ Clone & Install

```bash
git clone https://github.com/<your-org>/projection.git
cd projection
pnpm install
```

### 2️⃣ Run the API (Python)

```bash
cd services/fastapi-calcs
uvicorn app:app --reload --port 8000
```

### 3️⃣ Generate the Typed API Client

```bash
pnpm generate:api
```

### 4️⃣ Start the Web App

```bash
pnpm dev:web
```
Visit **http://localhost:3000**

### 5️⃣ Start the Mobile App (Expo)

```bash
pnpm dev:mobile
```
Scan the QR code with Expo Go or run `pnpm run android` / `ios`.

---

## ▶️ Run the project (detailed)

Use the commands below from the repository root (`projection/`). These commands assume you have pnpm installed and Python 3.11+ available on your PATH.

1) Install dependencies

```bash
pnpm install
```

2) Start the FastAPI backend (development)

Open a terminal and run:

```bash
cd services/fastapi-calcs
# If you use a virtualenv, activate it first (optional):
# python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt  # or the packages listed in the README
uvicorn app:app --reload --port 8000
```

The API will be available at http://localhost:8000 and OpenAPI docs at http://localhost:8000/docs.

3) (Optional) Regenerate the typed API client

If you've changed the backend OpenAPI schema, regenerate the client so the web/mobile apps stay type-safe:

```bash
# from repo root
pnpm generate:api
```

4) Start the web app

```bash
# from repo root
pnpm --filter web dev
```

Visit http://localhost:3000 in your browser.

5) Start the mobile app (Expo)

```bash
# from repo root
pnpm --filter mobile dev
```

Scan the QR code with Expo Go or run the device targets (`pnpm --filter mobile run:android` / `run:ios`) if configured.

Notes
- If you run the backend on a host other than localhost, update the API base URL used by the web/mobile clients (search for `http://localhost:8000` in `packages/api-client` hooks).
- Use a small `n_paths` when developing the Monte Carlo API locally (e.g. 200) to keep response times fast.
- If you see CORS errors, verify the backend's `CORSMiddleware` allows the frontend origin (http://localhost:3000).

---

## 🧮 Financial Formula Reference

**Future Value with Annual Contributions**
```math
FV = PV(1 + r)^t + PMT * ((1 + r)^t - 1) / r
```

**Inflation Adjustment**
```math
Real = Nominal / (1 + inflation)^years
```

---

## 🧩 Recommended Packages to Install

```bash
# Core
pnpm add -w typescript turbo

# Web
pnpm add -F web next react react-dom @mui/material ag-grid-community ag-grid-react echarts echarts-for-react @tanstack/react-query zod react-hook-form zustand

# Mobile
pnpm add -F mobile expo react-native tamagui @shopify/flash-list @tanstack/react-query zod react-hook-form zustand

# Shared
pnpm add -F core @types/node
pnpm add -F api-client openapi-typescript

# Python service
pip install fastapi uvicorn[standard] numpy orjson pydantic
```

---

## ⚙️ VS Code / Copilot Instructions

This README defines the **stack**, **folder layout**, and **package responsibilities**.  
When you open the project in VS Code with GitHub Copilot or Copilot Workbench:

- Copilot will recognize:
  - the **monorepo structure**
  - the **stack keywords** (Next.js, Expo, FastAPI, MUI, ag-Grid, ECharts)
  - generation triggers for each package’s boilerplate
- You can prompt:
  ```
  Copilot: Scaffold project from README
  ```

Copilot will create each folder, package.json, tsconfig, and minimal sample components based on this file.

---

## 🧭 Next Steps

1. Build the **Calculator UI** (inputs → results chart → summary table).
2. Add **TanStack Query** to fetch from `/calculate`.
3. Create scenario comparison & sensitivity analysis pages.
4. Connect mobile app via the shared core + api-client packages.
5. Add authentication if needed (NextAuth.js / Supabase).

---

## 🪪 License

MIT © 2025 Projection Team
