# Uplora: 1B Quest — System Architecture

## 1. System Topology

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│  - React 19 SPA (Vite) + Tailwind CSS                       │
│  - Strategic Command HUD & RPG Level System                 │
│  - 10-Stage Sales CRM & WhatsApp Direct Action Launchers    │
│  - Mobile Bottom Dock (Android Ergonomics)                  │
│  - AI COO Chat Console & Human Approval Gatekeeper          │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON API (Port 3000)
┌──────────────────────────────▼──────────────────────────────┐
│                    Express API Gateway                      │
│  - Middleware validation & input sanitization               │
│  - Vite Middleware mounted in Dev / Static bundle in Prod   │
│  - Controlled Tool Calling Layer with Function Declarations │
│  - Human Approval Gatekeeper (`/api/actions/execute`)       │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼─────────────┐ ┌──────────────▼──────────────┐
│   Google Gen AI SDK        │ │    Local Database Service   │
│   (`@google/genai`)        │ │    (`server/db.ts`)         │
│   - Model: gemini-3.8-flash│ │  - Safe atomic file writes  │
│   - Google Search Grounding│ │  - Auto-backup on startup   │
│   - Controlled AI Tools    │ │  - Dynamic health scoring   │
│   - System Prompt Persona  │ │  - Schema migration support │
│     (Uplora COO)           │ │  - SQLite-ready interface   │
└────────────────────────────┘ └─────────────────────────────┘
```

---

## 2. Key Subsystems

### A. The Dynamic Metric & Health Engine
* **Health Scores**: No hardcoded static values. All 7 dimensions (Revenue, Sales, Delivery, Lead Gen, Product, Marketing, Team) are computed dynamically from actual task completion logs, lead conversion ratios, and live calendar month revenue.
* **Multi-Scenario ETA**: Dynamic compound monthly growth modeling (Worst-Case, Base-Case +12% MoM, Best-Case +25% MoM SaaS inflection).

### B. Controlled AI Tool Layer & Human Approval Gate
* Gemini is initialized on the server with strict `FunctionDeclaration` tools.
* Read tools query the database and summarize insights without data mutation.
* Write/strategic tools format structured `ProposedAction` objects marked `requiresApproval: true`.
* The founder reviews proposed actions in the AI COO console and authorizes execution with 1 click via `/api/actions/execute`.

### C. Safe Persistence Layer
* Database mutations write atomically: `uplora_db.tmp.json` ➔ `uplora_db.json`.
* Automated backup snapshot `uplora_db.bak.json` is preserved on server startup.
* Normalized entities allow dropping in SQLite (e.g. `better-sqlite3`) in the future without changing frontend or API contracts.
