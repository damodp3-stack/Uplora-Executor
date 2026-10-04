# Uplora: 1B Quest — Data Model & Entity Specifications

The data layer is local-first, normalized, and schema-versioned (Version 2). It currently persists safely to JSON via atomic temp-writes and is architected for seamless migration to SQLite.

---

## 1. Schema Entity Definitions

### `company`
```typescript
{
  name: string;               // 'Uplora'
  questTarget: number;        // ₹1,000,000,000 (Configurable: ₹10L, ₹1Cr, ₹100Cr)
  monthlyTarget: number;      // e.g. ₹1,00,000 Near-term goal
  currentRunRate: number;     // Baseline monthly run rate
  streakDays: number;         // Continuous daily check-in streak
}
```

### `users` (Team Characters)
```typescript
{
  id: string;                 // 'damo', 'partner', 'assistant'
  name: string;
  role: 'ceo' | 'cto' | 'lead_hunter';
  title: string;
  avatar: string;             // '👑', '⚔️', '🎯'
  xp: number;                 // Cumulative XP
  level: number;              // 1 to 10
  streak: number;
  dailyGoal: string;
  dailyQuota: number;
  dailyCompleted: number;
  monthlyCost?: number;       // e.g. ₹5,000 for Assistant
  monthlyAttributableRevenue?: number;
}
```

### `tasks` (Quests)
```typescript
{
  id: string;
  title: string;
  description: string;
  ownerId: string;            // FK -> users.id
  layer: 'daily' | 'weekly' | 'monthly' | 'side_quest';
  category: 'sales' | 'delivery' | 'lead_gen' | 'strategy' | 'product';
  priority: 'critical' | 'high' | 'medium' | 'low';
  difficulty: 'easy' | 'medium' | 'hard' | 'boss';
  xpReward: number;
  status: 'pending' | 'completed' | 'missed';
  dueDate: string;            // YYYY-MM-DD
  completedAt?: string;
  completionResult?: string;
  missedReason?: string;
  missedNotes?: string;
  adaptedFromTaskId?: string;
  revenueRelation?: number;   // Estimated commercial value in INR
  strategicRelation?: string;
  estimatedEffortMinutes?: number;
}
```

### `leads` (Sales CRM)
```typescript
{
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  whatsapp: string;           // Formatted for direct wa.me chat
  instagram?: string;
  website?: string;
  city: string;
  category: string;
  problemIdentified: string;
  proposedSolution: string;
  estimatedValue: number;     // INR
  leadSource: 'Instagram' | 'Google Maps' | 'Referral' | 'Walk-in' | 'Other';
  assignedTo: string;         // 'damo' | 'assistant'
  status: 'prospect' | 'contacted' | 'connected' | 'interested' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost' | 'followup';
  lastContactDate?: string;
  nextFollowupDate?: string;  // Compared against today to detect overdue deals
  isHotLead?: boolean;
  dealCycleDays?: number;
  notes: string;
  createdAt: string;
}
```

### `revenue` (Financial Ledger)
```typescript
{
  id: string;
  clientName: string;
  serviceType: 'website' | 'whatsapp_automation' | 'storeik' | 'ecommerce' | 'maintenance' | 'other';
  amount: number;             // Banked cash in INR
  paymentDate: string;        // YYYY-MM-DD
  notes: string;
  xpAwarded: number;          // 1 XP per ₹100
  isBenchmark?: boolean;      // Distinguishes initial benchmark data from real cash
}
```

### `experiments` (7-Day Pilots)
```typescript
{
  id: string;
  ideaId?: string;            // Optional link to quarantined idea
  title: string;
  hypothesis: string;
  durationDays: number;       // Default: 7
  startDate: string;
  endDate: string;
  metricsTracked: string;
  successCriteria: string;
  outcome: 'running' | 'success' | 'failed' | 'inconclusive';
  lessonsLearned?: string;
  createdAt: string;
}
```

### `decisions` (Governance Ledger)
```typescript
{
  id: string;
  title: string;
  rationale: string;
  authorId: string;
  authorName: string;
  expectedOutcome: string;
  status: 'proposed' | 'approved' | 'rejected' | 'in_pilot';
  reviewDate: string;
  riskAssessment: {
    revenueImpact: string;
    customerRisk: string;
    teamCapacity: string;
    recommendedPilotDays: number;
  };
  actualOutcome?: string;
  permanentRule?: string;
  createdAt: string;
}
```

### `company_memory`
```typescript
{
  id: string;
  category: 'vision' | 'services' | 'pricing' | 'team' | 'lessons' | 'decisions' | 'rules';
  key: string;
  content: string;
  updatedAt: string;
}
```

### `audit_logs`
```typescript
{
  id: string;
  timestamp: string;
  actor: 'damo' | 'partner' | 'assistant' | 'ai_coo';
  action: string;
  details?: string;
  requiresApproval?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}
```
