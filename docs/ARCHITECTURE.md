# Uplora: 1B Quest — System Architecture

## 1. System Topology

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│  - React 19 SPA (Vite) + Tailwind CSS                       │
│  - Strategic Command HUD & RPG Level Progression            │
│  - 10-Stage Sales CRM & WhatsApp Direct Action Launchers    │
│  - Mobile Bottom Navigation Dock (Android Viewport Support) │
│  - AI COO Chat Console & Human Approval Gate UI             │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON API (Port 3000)
┌──────────────────────────────▼──────────────────────────────┐
│                    Express API Gateway                      │
│  - Input sanitization & backend validation (4xx handling)   │
│  - Controlled Gemini Function Calling Loop                  │
│  - Real Human Approval Gatekeeper (`/api/actions/*`)        │
│  - Strategic Decision Founder Governance (`/api/decisions`) │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
┌──────────────▼─────────────┐ ┌──────────────▼──────────────┐
│   Google Gen AI SDK        │ │    Local Database Service   │
│   (`@google/genai`)        │ │    (`server/db.ts`)         │
│   - Model: gemini-3.8-flash│ │  - Safe atomic file writes  │
│   - Controlled Read Tools  │ │  - Auto-backup on startup   │
│   - Controlled Action Gate │ │  - Dynamic health scoring   │
│   - Search Grounding Radar │ │  - Replay & tamper checks   │
│   - System Prompt Persona  │ │  - Benchmark vs Live split  │
│     (Uplora COO)           │ │  - SQLite-ready interface   │
└────────────────────────────┘ └─────────────────────────────┘
```

---

## 2. Key Subsystems

### A. The Dynamic Metric & Health Engine
* **Health Scores**: 100% dynamic calculations across Revenue, Sales, Delivery, Lead Gen, Product, Marketing, and Team Execution.
* **Multi-Scenario ETA**: Dynamic compound monthly growth modeling (Worst-Case linear, Base-Case +12% MoM, Best-Case +25% MoM SaaS inflection).
* **Benchmark vs Live Revenue**: Seeded ₹40k baseline is explicitly tagged as demo data (`isBenchmark: true`). Live verified cash is tracked separately (`verifiedLiveRevenue`).

### B. Controlled AI Tool Layer & Human Approval Gate
* Gemini is initialized on the server with strict `FunctionDeclaration` tools.
* **Read Tools**: Direct read loop returns data to Gemini, which generates analytical advice with zero database mutation.
* **Mutating Tools**: Converted into pending actions stored in `pending_actions` (`status: 'pending'`).
* **Human Approval Gate**:
  * Founder explicitly approves (`POST /api/actions/:id/approve`) or rejects (`POST /api/actions/:id/reject`).
  * Non-founder approval attempts are rejected (HTTP 403).
  * Execution (`POST /api/actions/:id/execute`) validates approved status, authentic founder authorization, parameter integrity, and prevents replay attacks.
  * Audit logs record all 3 steps: proposal, approval, and execution.

### C. Strategic Decision Governance
* Policy shifts require a 6-dimension risk impact audit.
* State transitions follow strict lifecycle rules: `proposed` ➔ `pilot_first` / `rejected` / `approved` ➔ `executed` / `reviewed`.
* Approval strictly requires explicit founder authorization as Damo (HTTP 403 for unauthorized actors).
* Every transition is logged in the permanent audit trail.

### D. Safe Persistence & Data Sovereignty
* Database mutations write atomically: `uplora_db.tmp.json` ➔ `uplora_db.json`.
* Automated backup snapshot `uplora_db.bak.json` is preserved on startup.
* Clear paths provided to reset benchmark data, start with clean company data, export snapshots, and restore from backups.
