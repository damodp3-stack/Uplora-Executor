# Uplora: Revenue Engine & ₹1B Dynamic ETA Calculator

## 1. Metric Architecture & Mathematical Model

The Revenue Engine continuously measures:
* **Current Month Revenue**: Sum of all confirmed cash receipts in the active calendar month ($R_{\text{cur}}$).
* **Current Month Target**: Configurable milestone (Baseline: ₹1,00,000).
* **Cumulative Company Revenue**: Total banked receipts since Uplora inception ($R_{\text{total}}$).
* **Ultimate Quest Target**: Default ₹1,000,000,000 (₹100 Crore / ₹1B), configurable to ₹10L, ₹1Cr, etc.
* **Completion Percentage**:
  $$\% \text{ Completed} = \frac{R_{\text{total}}}{\text{Quest Target}} \times 100$$
* **Remaining Capital Required**:
  $$R_{\text{remaining}} = \max(0, \text{Quest Target} - R_{\text{total}})$$

---

## 2. Dynamic Multi-Scenario ETA Projections

Rather than presenting an illusory linear projection, the engine models three transparent business growth scenarios:

### 1. Worst-Case (Static Run-Rate Model)
* Assumes current historical monthly average run-rate ($M_{\text{avg}}$) persists without compounding or technology leverage.
* Formula:
  $$\text{Months}_{\text{worst}} = \frac{R_{\text{remaining}}}{M_{\text{avg}}}$$

### 2. Base-Case (Moderate Compound Growth Model)
* Assumes steady execution discipline, current team stabilization, and an achievable compound monthly growth rate ($g_{\text{base}} = 12\%$ per month):
* Solves for $n$ months where:
  $$\sum_{t=1}^{n} M_{\text{current}} \times (1 + g_{\text{base}})^t \ge R_{\text{remaining}}$$

### 3. Best-Case (Commerce-Tech Scale Model — StoreIK Inflection)
* Assumes StoreIK achieves product-market fit, software subscription margins, and recurring revenue inflection ($g_{\text{best}} = 25\%$ compound monthly growth):
* Modeled over exponential SaaS flywheel curves.

---

## 3. Transparent Confidence Index & Low-Data Warnings
* If total historical logged months $< 6$, the system displays an explicit alert:
  > **Confidence Level: Low (Early Exploration Stage)**  
  > *Projections are indicative. With current monthly run-rate around ₹40,000, focus must remain on the immediate Phase 1 milestone (₹1,00,000/month).*
* Whenever a new transaction is logged, the ETA dates, required daily run-rate, and remaining gap update instantaneously across all connected dashboards.
