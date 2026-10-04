# Uplora: Controlled AI Actions & Tool Declarations

## 1. Principles of Controlled AI Execution
Gemini operates as Uplora's autonomous Chief Operating Officer (COO). To maintain strict commercial integrity and prevent data corruption:
1. **Zero Raw SQL / Unrestricted Access**: Gemini cannot execute raw code or database commands.
2. **Schema-Enforced Tools**: The model is presented with strict typed `FunctionDeclaration` objects using `@google/genai`.
3. **Backend Validation**: Every action parameter is validated against business rules before processing.
4. **Human Approval Gatekeeper**: Any mutating or strategic operation (creating tasks, logging decisions, launching pilots, altering quotas) is delivered to Commander Damo as an actionable proposal requiring explicit authorization (`Authorize & Execute` or `Dismiss`).
5. **Audit Logging**: Every invocation is stored in the `audit_logs` collection with actor, timestamp, parameters, and status.

---

## 2. Declared AI Tools Catalog

### Read-Only Tools (Information Retrieval)
* `get_company_status`: Retrieves live cash collected, monthly target, active pipeline value, health scores, and dynamic ETA projections.
* `get_revenue_analytics`: Returns deal sizes, service breakdowns, and runway calculations.
* `get_tasks(ownerId, status, layer)`: Queries tasks filtered by character or execution layer.
* `get_leads(status, onlyHotLeads, onlyOverdue)`: Queries CRM pipeline leads with deal values and follow-up deadlines.
* `get_company_memory(category)`: Fetches organizational rules, historical pricing brackets, and past lessons learned.

### Mutating & Strategic Tools (Requires Human Approval)
* `create_task(title, ownerId, layer, category, priority, xpReward, revenueRelation)`:
  * Proposes a new daily quest, weekly mission, or side quest.
  * Links task to estimated INR revenue and commercial leverage.
* `adapt_task_difficulty(taskId, newTargetTitle, newXp, reason)`:
  * De-escalates unachieved targets into stepped-down 3-day sprint challenges when workload conflict is detected.
* `create_lead(businessName, contactName, phone, whatsapp, problemIdentified, proposedSolution, estimatedValue)`:
  * Logs newly discovered prospects into the CRM.
* `create_idea(title, problem, targetCustomer, proposedSolution, potentialRevenue)`:
  * Enters a new product or dropshipping concept into the 7-day Idea Quarantine.
* `create_experiment(title, hypothesis, durationDays, metricsTracked, successCriteria)`:
  * Launches a 7-day validation pilot with testable commercial metrics.
* `create_strategic_decision(title, rationale, expectedOutcome, revenueImpact, customerRisk)`:
  * Formulates a company policy shift with a 6-dimension risk audit.
