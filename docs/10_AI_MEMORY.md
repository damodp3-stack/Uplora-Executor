# Uplora: Long-Term Company Memory System

## 1. Architectural Need
LLM chat sessions are ephemeral. Without persistent company memory, the AI repeatedly forgets past lessons, previous client disputes, validated pricing thresholds, and strategic commitments.

Uplora 1B Quest incorporates a structured **Company Memory Bank**:
1. **Core Identity & Thesis**: Vision, mission, values, brand architecture (Uplora vs Akyzer vs StoreIK).
2. **Catalog & Unit Economics**: Historical pricing brackets, profit margins, cost of goods, developer delivery hours.
3. **Personnel & Roles**: Team strengths, historical performance bottlenecks, salary/commission agreements.
4. **Historical Decision Ledger**: Every major pivot, price change, and technology choice with its original rationale.
5. **Post-Mortem Lessons**: Documented outcomes of failed experiments, difficult client negotiations, and missed targets.

---

## 2. Decision Log & Review Lifecycle
Every strategic decision stored in memory includes:
* **Timestamp & Author**: Who made the call.
* **Hypothesis**: What we expected to happen.
* **Commitment**: Resources, time, or revenue risked.
* **Scheduled Review Date**: Mandatory check-in (e.g., 30 days or 90 days out).
* **Actual Outcome & Post-Mortem**: What actually occurred when reviewed.
* **Permanent Rule Extracted**: The durable organizational rule created from this experience.

---

## 3. Dynamic Memory Injection into Prompts
Whenever the AI Manager answers strategic prompts, relevant memory vectors and decision records are concatenated into the prompt context:
```
[COMPANY CONTEXT]
Uplora Monthly Run-Rate: ₹40,000 (Target: ₹1,00,000)
Decisions in force: 
- 2026-01-15: Website projects require minimum 50% deposit before design kickoff.
- 2026-02-10: StoreIK beta requires merchants to have active Instagram > 500 followers.
Lessons in force:
- Avoid multi-vendor marketplace scopes under ₹50k; leads to timeline blowouts.
```
This guarantees continuity across months of execution.
