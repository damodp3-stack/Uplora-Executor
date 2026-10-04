export type UserRole = 'ceo' | 'cto' | 'lead_hunter';

export interface User {
  id: string;
  name: string;
  role: UserRole;
  title: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  dailyGoal: string;
  dailyQuota: number;
  dailyCompleted: number;
  monthlyCost?: number;
  monthlyAttributableRevenue?: number;
}

export type TaskLayer = 'daily' | 'weekly' | 'monthly' | 'side_quest';
export type TaskCategory = 'sales' | 'delivery' | 'lead_gen' | 'strategy' | 'product';
export type TaskPriority = 'critical' | 'high' | 'medium' | 'low';
export type TaskDifficulty = 'easy' | 'medium' | 'hard' | 'boss';
export type TaskStatus = 'pending' | 'completed' | 'missed';

export interface Task {
  id: string;
  title: string;
  description: string;
  ownerId: string;
  layer: TaskLayer;
  category: TaskCategory;
  priority: TaskPriority;
  difficulty: TaskDifficulty;
  xpReward: number;
  status: TaskStatus;
  dueDate: string;
  completedAt?: string;
  completionResult?: string;
  missedReason?: string;
  missedNotes?: string;
  adaptedFromTaskId?: string;
  relatedRevenueTarget?: number;
  revenueRelation?: number;
  strategicRelation?: string;
  estimatedEffortMinutes?: number;
}

export type LeadStage =
  | 'prospect'
  | 'contacted'
  | 'connected'
  | 'interested'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost'
  | 'followup';

export interface Lead {
  id: string;
  businessName: string;
  contactName: string;
  phone: string;
  whatsapp: string;
  instagram?: string;
  website?: string;
  city: string;
  category: string;
  problemIdentified: string;
  proposedSolution: string;
  estimatedValue: number;
  leadSource: 'Instagram' | 'Google Maps' | 'Referral' | 'Walk-in' | 'Other';
  assignedTo: string;
  status: LeadStage;
  lastContactDate?: string;
  nextFollowupDate?: string;
  isHotLead?: boolean;
  dealCycleDays?: number;
  notes: string;
  createdAt: string;
}

export interface RevenueEntry {
  id: string;
  clientName: string;
  serviceType: 'website' | 'whatsapp_automation' | 'storeik' | 'ecommerce' | 'maintenance' | 'other';
  amount: number;
  paymentDate: string;
  notes: string;
  xpAwarded: number;
  isBenchmark?: boolean;
}

export interface DailyCheckin {
  id: string;
  userId: string;
  date: string;
  completedSummary: string;
  missedSummary: string;
  missedReasonCategory?: string;
  biggestWin: string;
  blockers: string;
  keyOutcome: string;
  revenueLogged: number;
  tomorrowFocus: string;
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  problem: string;
  targetCustomer: string;
  proposedSolution: string;
  potentialRevenue: number;
  difficulty: 'low' | 'medium' | 'high';
  costEstimate: number;
  status: 'quarantine' | 'validating' | 'approved' | 'rejected' | 'graduated';
  quarantineDaysRemaining: number;
  validationMethod?: string;
  createdAt: string;
}

export interface Experiment {
  id: string;
  ideaId?: string;
  title: string;
  hypothesis: string;
  durationDays: number;
  startDate: string;
  endDate: string;
  metricsTracked: string;
  successCriteria: string;
  outcome: 'running' | 'success' | 'failed' | 'inconclusive';
  lessonsLearned?: string;
  createdAt: string;
}

export type DecisionStatus = 'proposed' | 'in_pilot' | 'approved' | 'rejected' | 'executed' | 'reviewed';

export interface StrategicDecision {
  id: string;
  title: string;
  rationale: string;
  authorId: string;
  authorName: string;
  expectedOutcome: string;
  status: DecisionStatus;
  reviewDate: string;
  riskAssessment: {
    revenueImpact: string;
    customerRisk: string;
    teamCapacity: string;
    recommendedPilotDays: number;
  };
  approvedBy?: string;
  approvedAt?: string;
  actualOutcome?: string;
  permanentRule?: string;
  createdAt: string;
}

export interface MarketOpportunity {
  id: string;
  headline: string;
  sector: 'WhatsApp Commerce' | 'Instagram Selling' | 'Indian MSME & E-Commerce' | 'AI & Automation';
  sourceUrl?: string;
  sourceDomain?: string;
  whyItMatters: string;
  potentialService: string;
  potentialRevenueEst: number;
  status: 'unreviewed' | 'saved' | 'converted_to_idea' | 'converted_to_experiment' | 'dismissed';
  createdAt: string;
}

export interface CompanyMemoryItem {
  id: string;
  category: 'vision' | 'services' | 'pricing' | 'team' | 'lessons' | 'decisions' | 'rules';
  key: string;
  content: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: 'damo' | 'partner' | 'assistant' | 'ai_coo';
  action: string;
  tool?: string;
  params?: any;
  details?: string;
  requiresApproval?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

export type ActionStatus = 'pending' | 'approved' | 'rejected' | 'executed' | 'expired';

export interface PendingAction {
  id: string;
  tool: string;
  params: any;
  explanation: string;
  risk: string;
  proposedBy: 'ai_coo' | 'damo' | 'partner' | 'assistant';
  proposedAt: string;
  status: ActionStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectedBy?: string;
  rejectedAt?: string;
  rejectionReason?: string;
  executedAt?: string;
  executedBy?: string;
  resultId?: string;
  expiresAt?: string;
}

export type ProposedAction = PendingAction;

export interface CompanyStatus {
  name: string;
  questTarget: number;
  monthlyTarget: number;
  currentMonthlyRevenue: number;
  cumulativeRevenue: number;
  runRateEstimate: number;
  overallXp: number;
  level: number;
  streakDays: number;
  activeLeadsCount: number;
  pipelineValue: number;
  hotLeadsCount: number;
  overdueFollowupsCount: number;
  benchmarkRevenue?: number;
  verifiedLiveRevenue?: number;
  isBenchmarkBaseline?: boolean;
  healthScores: {
    revenue: number;
    sales: number;
    delivery: number;
    leadGen: number;
    product: number;
    marketing: number;
    teamExecution: number;
    composite: number;
  };
  primaryBottleneck: string;
  aiPrescription: string;
  eta: {
    worstCaseDate: string;
    baseCaseDate: string;
    bestCaseDate: string;
    worstMonths: number;
    baseMonths: number;
    bestMonths: number;
    confidence: 'low' | 'medium' | 'high';
  };
}

export interface Achievement {
  id: string;
  code: string;
  title: string;
  description: string;
  icon: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface CRMAnalytics {
  totalLeads: number;
  activeLeads: number;
  pipelineValue: number;
  wonValue: number;
  winRate: number;
  avgDealValue: number;
  overdueFollowupsCount: number;
  hotLeadsCount: number;
  bySource: Record<string, { count: number; won: number; value: number }>;
  stageCounts: Record<LeadStage, number>;
}
