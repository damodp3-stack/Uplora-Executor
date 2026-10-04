# Uplora: Controlled AI Actions & Human Approval Gate Architecture

## 1. Principles of Controlled AI Execution
Gemini operates as Uplora's autonomous Chief Operating Officer (COO). To maintain strict commercial integrity, prevent unauthorized state mutations, and preserve founder control:
1. **Zero Raw SQL / Unrestricted Access**: Gemini cannot execute raw code or database commands.
2. **Schema-Enforced Tools**: The model is presented with strict typed `FunctionDeclaration` objects using `@google/genai`.
3. **Backend Validation**: Every action parameter is validated against strict business rules before processing.
4. **Mandatory Human Approval Workflow**:
   * Gemini NEVER mutates the database directly during `/api/gemini/chat`.
   * For mutating tools, the backend converts the tool call into a `PendingAction` stored with `status: 'pending'`.
   * The backend returns a structured message to Damo: *"Proposed action created. Founder approval required."*
   * Damo explicitly approves or rejects the action via dedicated endpoints.
   * Execution requires valid founder authorization (`actor: 'damo'`) and verifies parameter integrity.
5. **Replay & Tamper Prevention**:
   * Executed actions cannot be re-executed (replay attack prevention).
   * Submitted parameters during execution must match the approved snapshot (parameter tamper detection).
   * Actions expire after their lifetime (default 48 hours).
6. **Immutable Audit Trail**: Every stage—proposal, founder approval, rejection, and final execution—is recorded in the `audit_logs` collection.

---

## 2. The Pending Action Model
```typescript
export interface PendingAction {
  id: string;                                          // Unique action identifier
  tool: string;                                        // Whitelisted mutating tool
  params: any;                                         // Deep-cloned parameter snapshot
  explanation: string;                                 // Human-readable rationale
  risk: string;                                        // Risk assessment
  proposedBy: 'ai_coo' | 'damo' | 'partner' | 'assistant';
  proposedAt: string;                                  // ISO timestamp
  status: 'pending' | 'approved' | 'rejected' | 'executed' | 'expired';
  approvedBy?: string;                                 // Set to 'damo' upon founder authorization
  approvedAt?: string;                                 // ISO timestamp
  rejectedBy?: string;                                 // Set if dismissed
  rejectedAt?: string;
  rejectionReason?: string;
  executedAt?: string;                                 // Populated upon execution
  executedBy?: string;
  resultId?: string;                                   // Entity ID created/modified in DB
  expiresAt?: string;                                  // Auto-expiry deadline
}
```

---

## 3. Dedicated API Endpoints
* `POST /api/actions/propose`: Proposes an action and stores it in `pending_actions` (status: `pending`).
* `GET /api/actions/pending`: Retrieves pending actions, auto-expiring overdue items.
* `POST /api/actions/:id/approve`: Authorizes a pending action. Strictly requires `actor: 'damo'`.
* `POST /api/actions/:id/reject`: Rejects a pending action. Strictly requires `actor: 'damo'`.
* `POST /api/actions/:id/execute`: Executes an approved action. Validates status (`approved`), authentic founder authorization (`damo`), and parameters match the snapshot.
* `POST /api/actions/execute`: Legacy/compatibility gateway. Strictly requires valid approved `actionId` and founder actor. Direct execution of unapproved arbitrary actions is blocked (HTTP 400).

---

## 4. AI Tools Catalog

### Read-Only Tools (Direct Execution Loop)
Gemini calls tool ➔ Backend executes read ➔ Backend returns `functionResponse` ➔ Gemini produces final response:
* `get_company_status`: Retrieves live cash collected, monthly target, active pipeline value, health scores, and dynamic ETA projections.
* `get_revenue_analytics`: Returns deal sizes, service breakdowns, and runway calculations.
* `get_tasks(ownerId, status, layer)`: Queries tasks filtered by character or execution layer.
* `get_leads(status, onlyHotLeads, onlyOverdue)`: Queries CRM pipeline leads with deal values and follow-up deadlines.
* `get_company_memory(category)`: Fetches organizational rules, historical pricing brackets, and past lessons learned.

### Mutating Tools (Always Route Through Pending Action Gate)
Gemini calls tool ➔ Backend generates `PendingAction` ➔ Founder approves ➔ Backend executes:
* `create_task(title, ownerId, layer, category, priority, xpReward, revenueRelation)`:
  * Proposes tactical quests, missions, or battles with commercial revenue linkage.
* `adapt_task_difficulty(taskId, newTargetTitle, newXp, reason)`:
  * De-escalates unachieved targets into stepped-down 3-day sprint challenges when workload conflict is detected.
* `create_lead(businessName, contactName, phone, whatsapp, problemIdentified, proposedSolution, estimatedValue)`:
  * Logs newly discovered prospects into the Sales CRM.
* `create_idea(title, problem, targetCustomer, proposedSolution, potentialRevenue)`:
  * Enters a new product or dropshipping concept into the 7-day Idea Quarantine.
* `create_experiment(title, hypothesis, durationDays, metricsTracked, successCriteria)`:
  * Launches a 7-day validation pilot with testable commercial metrics.
* `create_strategic_decision(title, rationale, expectedOutcome, revenueImpact, customerRisk)`:
  * Formulates a company policy shift with 6-dimension risk audit.
* `complete_task(taskId, resultNote)`:
  * Proposes completing a task and minting XP with a debrief note.
* `update_lead_stage(leadId, status, notes)`:
  * Proposes moving a lead through pipeline stages (e.g. to Won or Proposal).
