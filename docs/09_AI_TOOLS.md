# Uplora: AI Tools & Function Calling Specification

## 1. Principles of Controlled AI Execution
The Gemini model interacts with the Uplora operating system strictly through controlled function definitions. The AI cannot execute arbitrary SQL or tamper with data without structured validation.

---

## 2. Function Declarations (Tool Catalog)

### 1. `get_company_status()`
* **Purpose**: Retrieves executive overview (cash collected, target, active leads, tasks due today, streak, health score).
* **Parameters**: None.

### 2. `get_revenue_analytics(timeframe: string)`
* **Purpose**: Returns monthly/cumulative revenue breakdown, deal sizes, and ETA calculations.
* **Parameters**: `timeframe` ('month' | 'quarter' | 'year' | 'all').

### 3. `get_tasks(owner?: string, status?: string, priority?: string)`
* **Purpose**: Fetches active, completed, or missed tasks filtered by team member or category.
* **Parameters**: Optional filters for owner (`damo`, `partner`, `assistant`), status (`pending`, `completed`, `missed`), and priority.

### 4. `create_task(title: string, owner: string, priority: string, xp: number, dueDate?: string)`
* **Purpose**: Proposes a new daily quest, weekly mission, or side quest.
* **Parameters**: Strict types with default priority levels.

### 5. `adapt_task_difficulty(taskId: string, newTarget: string, reason: string)`
* **Purpose**: Steps down or adjusts an uncompleted quota based on founder performance trends.

### 6. `get_pipeline_summary()`
* **Purpose**: Returns lead counts per stage, total pipeline value, and stale deals requiring follow-up.

### 7. `create_lead(businessName: string, phone: string, whatsapp?: string, problem?: string, estimatedValue?: number)`
* **Purpose**: Logs a newly discovered prospect into the CRM.

### 8. `create_idea(title: string, problem: string, solution: string, potentialRevenue: number, priority: string)`
* **Purpose**: Records a raw idea into the Idea Engine quarantine.

### 9. `create_strategic_decision(title: string, rationale: string, reviewDate: string, riskAssessment: string)`
* **Purpose**: Records a strategic decision requiring founder confirmation.

### 10. `search_market_news(query: string, sector: string)`
* **Purpose**: Triggers Google Search grounding to discover real-time trends in WhatsApp commerce, Indian MSME policies, and e-commerce tooling.
