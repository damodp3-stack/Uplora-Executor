# Uplora: Comprehensive Verification & Test Plan

## 1. Test Matrices

### Matrix A: Game System & XP Engine
* Verify adding a ₹15,000 revenue entry awards exactly 150 XP.
* Verify completing a daily task awards the specified XP and increments user cumulative XP.
* Verify streak increases after completing check-in, and resets appropriately if broken.
* Verify Level increments dynamically when XP crosses thresholds (e.g. Level 1 -> Level 2 at 1,000 XP).

### Matrix B: Task Engine & Missed Task Adaptation
* Verify clicking "Missed" opens the root-cause diagnosis modal.
* Verify selecting a reason (e.g., "Didn't have time") records the reason in task history.
* Verify 3 consecutive missed tasks triggers the auto-adaptation prompt to step down quota (e.g. 20 calls -> 10 calls/day).

### Matrix C: Revenue Engine & ETA Calculations
* Verify changing target from ₹1B to ₹10L recalculates percentage completed and remaining amounts.
* Verify ETA calculations show Worst-case, Base-case, and Best-case with transparent assumptions.
* Verify low confidence warning is shown if historical revenue points are few.

### Matrix D: Sales CRM
* Verify adding a lead with WhatsApp number generates a clickable `https://wa.me/` action link.
* Verify moving a lead through stages (Prospect -> Contacted -> Won) recalculates active pipeline value.
* Verify marking a lead "Won" triggers an option to record the associated revenue entry.

### Matrix E: AI COO & Gemini Integration
* Verify AI chat endpoint connects to Gemini (`gemini-3.8-flash`) server-side using `@google/genai`.
* Verify AI prompt includes current company state (revenue, active tasks, pipeline, missed tasks).
* Verify Market Radar queries grounded trends and extracts structured opportunities.
* Verify strategic change questions trigger human approval gatekeeper.

### Matrix F: Backup & Recovery
* Verify JSON export creates a valid downloadable snapshot.
* Verify uploading JSON snapshot restores application state cleanly.
