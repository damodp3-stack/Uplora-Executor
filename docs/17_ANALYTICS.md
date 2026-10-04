# Uplora: Analytics & Company Health Score Engine

## 1. Company Health Score (Composite Index: 0 – 100)
Rather than vanity metrics, the operating system calculates a composite **Company Health Index** across 7 vital business organs:

| Business Dimension | Weight | Primary Data Source |
| :--- | :--- | :--- |
| **1. Revenue & Cashflow** | 25% | Run-rate vs Monthly Target (e.g. ₹40k/₹100k = 40%) |
| **2. Sales Conversion** | 20% | Qualified Leads $\rightarrow$ Proposal $\rightarrow$ Won ratio |
| **3. Delivery & Quality** | 15% | Partner project SLA on-time completion % |
| **4. Lead Hunter Velocity** | 15% | Assistant daily prospect quota achievement % |
| **5. Product & StoreIK** | 10% | Feature milestones and merchant trial traction |
| **6. Execution Discipline** | 10% | Daily task completion % & streak consistency |
| **7. Strategic Focus** | 5% | Number of quarantined ideas vs validated pilots |

---

## 2. Bottleneck Diagnostics & Automated Prescription
When the composite score drops or an individual dimension scores below 50/100, the system generates:
* **🚨 Primary Bottleneck Flag**: (e.g., *"Sales Conversion is 32/100: You are generating prospects but closing zero proposals."*)
* **🎯 Tactical Remedy**: (e.g., *"Dedicate the next 3 days to structured 48-hour follow-up calls rather than sourcing new cold leads."*)
