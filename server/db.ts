import fs from 'fs';
import path from 'path';
import {
  User,
  Task,
  Lead,
  RevenueEntry,
  DailyCheckin,
  Idea,
  Experiment,
  StrategicDecision,
  MarketOpportunity,
  CompanyMemoryItem,
  AuditLog,
  CompanyStatus,
  Achievement,
  CRMAnalytics,
  PendingAction,
  ActionStatus,
  DecisionStatus,
} from '../src/types/index.js';

export const VALIDATION_RULES = {
  OWNER_IDS: ['damo', 'partner', 'assistant'] as const,
  TASK_LAYERS: ['daily', 'weekly', 'monthly', 'side_quest'] as const,
  TASK_CATEGORIES: ['sales', 'delivery', 'lead_gen', 'strategy', 'product'] as const,
  TASK_PRIORITIES: ['critical', 'high', 'medium', 'low'] as const,
  TASK_DIFFICULTIES: ['easy', 'medium', 'hard', 'boss'] as const,
  LEAD_STAGES: [
    'prospect',
    'contacted',
    'connected',
    'interested',
    'qualified',
    'proposal',
    'negotiation',
    'won',
    'lost',
    'followup',
  ] as const,
  SERVICE_TYPES: ['website', 'whatsapp_automation', 'storeik', 'ecommerce', 'maintenance', 'other'] as const,
  DECISION_STATUSES: ['proposed', 'in_pilot', 'approved', 'rejected', 'executed', 'reviewed'] as const,
  READ_TOOLS: [
    'get_company_status',
    'get_revenue_analytics',
    'get_tasks',
    'get_leads',
    'get_company_memory',
  ] as const,
  MUTATING_TOOLS: [
    'create_task',
    'adapt_task_difficulty',
    'create_lead',
    'create_idea',
    'create_experiment',
    'create_strategic_decision',
    'complete_task',
    'update_lead_stage',
  ] as const,
};

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'uplora_db.json');
const BAK_FILE = path.join(DATA_DIR, 'uplora_db.bak.json');
const TMP_FILE = path.join(DATA_DIR, 'uplora_db.tmp.json');

export interface DatabaseSchema {
  schemaVersion: number;
  company: {
    name: string;
    questTarget: number;
    monthlyTarget: number;
    currentRunRate: number;
    streakDays: number;
  };
  users: User[];
  tasks: Task[];
  leads: Lead[];
  revenue: RevenueEntry[];
  checkins: DailyCheckin[];
  ideas: Idea[];
  experiments: Experiment[];
  decisions: StrategicDecision[];
  opportunities: MarketOpportunity[];
  company_memory: CompanyMemoryItem[];
  achievements: Achievement[];
  audit_logs: AuditLog[];
  pending_actions: PendingAction[];
}

const INITIAL_BENCHMARK: DatabaseSchema = {
  schemaVersion: 2,
  company: {
    name: 'Uplora',
    questTarget: 1000000000, // ₹1B = ₹100 Crore
    monthlyTarget: 100000,   // ₹1,00,000 Near-term goal
    currentRunRate: 40000,   // ₹40k Current baseline
    streakDays: 4,
  },
  users: [
    {
      id: 'damo',
      name: 'Damo',
      role: 'ceo',
      title: 'CEO & Growth Commander',
      avatar: '👑',
      xp: 720,
      level: 1,
      streak: 4,
      dailyGoal: '15 qualified sales calls & closing meetings',
      dailyQuota: 15,
      dailyCompleted: 9,
    },
    {
      id: 'partner',
      name: 'Partner',
      role: 'cto',
      title: 'CTO & Delivery Commander',
      avatar: '⚔️',
      xp: 480,
      level: 1,
      streak: 4,
      dailyGoal: 'Client deliverables & StoreIK architecture',
      dailyQuota: 3,
      dailyCompleted: 2,
    },
    {
      id: 'assistant',
      name: 'Assistant',
      role: 'lead_hunter',
      title: 'Lead Hunter & Prospect Scout',
      avatar: '🎯',
      xp: 210,
      level: 1,
      streak: 2,
      dailyGoal: '30 qualified merchant leads enriched',
      dailyQuota: 30,
      dailyCompleted: 18,
      monthlyCost: 5000,
      monthlyAttributableRevenue: 8500,
    },
  ],
  tasks: [
    {
      id: 'task-1',
      title: 'Damo: 15 Qualified Sales Calls to Retail Merchants',
      description: 'Call fashion, jewelry, and gourmet food sellers with unoptimized Instagram bios. Offer custom storefront + WhatsApp integration.',
      ownerId: 'damo',
      layer: 'daily',
      category: 'sales',
      priority: 'critical',
      difficulty: 'hard',
      xpReward: 120,
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0],
      relatedRevenueTarget: 100000,
      revenueRelation: 15000,
      strategicRelation: 'Outbound merchant closing velocity',
      estimatedEffortMinutes: 120,
    },
    {
      id: 'task-2',
      title: 'Partner: Finish Client X Website Responsive Polish',
      description: 'Deliver mobile layout verification, SSL configuration, and WhatsApp floating contact button for Tirupur Apparel client.',
      ownerId: 'partner',
      layer: 'daily',
      category: 'delivery',
      priority: 'high',
      difficulty: 'medium',
      xpReward: 90,
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0],
      revenueRelation: 10000,
      strategicRelation: 'On-time delivery SLA & client satisfaction',
      estimatedEffortMinutes: 180,
    },
    {
      id: 'task-3',
      title: 'Assistant: Log 30 Qualified Prospects with Verified WhatsApp',
      description: 'Search local Coimbatore & Chennai merchants selling via Instagram only; gather owner direct phone numbers.',
      ownerId: 'assistant',
      layer: 'daily',
      category: 'lead_gen',
      priority: 'high',
      difficulty: 'medium',
      xpReward: 75,
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0],
      revenueRelation: 0,
      strategicRelation: 'Top-of-funnel pipeline volume',
      estimatedEffortMinutes: 240,
    },
    {
      id: 'task-4',
      title: 'Weekly Mission: Close 2 Website Projects & Pitch StoreIK to 3 Boutiques',
      description: 'Generate ₹20k+ in fresh advances while validating StoreIK early interest with merchant pain points.',
      ownerId: 'damo',
      layer: 'weekly',
      category: 'sales',
      priority: 'critical',
      difficulty: 'boss',
      xpReward: 300,
      status: 'pending',
      dueDate: '2026-10-10',
      revenueRelation: 20000,
      strategicRelation: 'Secure weekly cash baseline',
      estimatedEffortMinutes: 300,
    },
    {
      id: 'task-5',
      title: 'Monthly Boss Battle: Slay the ₹1,00,000 Monthly Revenue Boss 👹',
      description: 'Push total banked cash receipts beyond ₹1 Lakh. Transition Uplora from survival to predictable momentum.',
      ownerId: 'damo',
      layer: 'monthly',
      category: 'strategy',
      priority: 'critical',
      difficulty: 'boss',
      xpReward: 750,
      status: 'pending',
      dueDate: '2026-10-31',
      revenueRelation: 100000,
      strategicRelation: 'Phase 1 commercial baseline milestone',
      estimatedEffortMinutes: 600,
    },
    {
      id: 'task-6',
      title: 'Side Quest: Audit 5 Competitor WhatsApp Storefront Pricing Models',
      description: 'Analyze how Shopify, Bikayi, Dukaan, and local web agencies price WhatsApp automation in India.',
      ownerId: 'damo',
      layer: 'side_quest',
      category: 'product',
      priority: 'medium',
      difficulty: 'easy',
      xpReward: 60,
      status: 'completed',
      dueDate: '2026-10-08',
      completedAt: '2026-10-03T18:30:00.000Z',
      completionResult: 'Documented 5 competitor pricing structures. Found sweet spot at ₹4,999 setup + ₹999/mo.',
      revenueRelation: 5000,
      strategicRelation: 'Competitive positioning for StoreIK',
      estimatedEffortMinutes: 60,
    },
  ],
  leads: [
    {
      id: 'lead-1',
      businessName: 'Velan Silks & Sarees',
      contactName: 'Mr. Velan',
      phone: '+919842100001',
      whatsapp: '919842100001',
      instagram: 'https://instagram.com/velansilks_cbe',
      city: 'Coimbatore',
      category: 'Ethnic Wear',
      problemIdentified: 'Takes saree orders through Instagram DMs manually; frequently misses customer messages and loses sales.',
      proposedSolution: 'StoreIK Storefront + Automated WhatsApp Catalog with UPI QR generation.',
      estimatedValue: 14000,
      leadSource: 'Instagram',
      assignedTo: 'damo',
      status: 'proposal',
      lastContactDate: '2026-10-02',
      nextFollowupDate: '2026-10-04',
      isHotLead: true,
      dealCycleDays: 6,
      notes: 'Sent quote for ₹14,000 (site + catalog). Interested, reviewing payment structure.',
      createdAt: '2026-09-28T10:00:00.000Z',
    },
    {
      id: 'lead-2',
      businessName: 'Annapoorna Homemade Spices',
      contactName: 'Lakshmi Narayanan',
      phone: '+919443200002',
      whatsapp: '919443200002',
      instagram: 'https://instagram.com/annapoornaspices',
      city: 'Madurai',
      category: 'Organic Foods',
      problemIdentified: 'Has 12,000 Instagram followers but no website; orders captured via messy Google Form.',
      proposedSolution: 'E-commerce website with Razorpay & Shiprocket courier auto-dispatch.',
      estimatedValue: 12500,
      leadSource: 'Instagram',
      assignedTo: 'damo',
      status: 'interested',
      lastContactDate: '2026-10-03',
      nextFollowupDate: '2026-10-06',
      isHotLead: true,
      dealCycleDays: 4,
      notes: 'Very excited about automated courier label generation. Follow up Tuesday.',
      createdAt: '2026-09-30T14:30:00.000Z',
    },
    {
      id: 'lead-3',
      businessName: 'Kaveri Dental Care',
      contactName: 'Dr. S. Kaveri',
      phone: '+919894000003',
      whatsapp: '919894000003',
      city: 'Chennai',
      category: 'Healthcare & Clinic',
      problemIdentified: 'No Google Maps presence or website; relying strictly on walk-ins.',
      proposedSolution: 'Local SEO + Clean 5-page Responsive Clinic Site with WhatsApp appointment booking.',
      estimatedValue: 8500,
      leadSource: 'Google Maps',
      assignedTo: 'assistant',
      status: 'won',
      lastContactDate: '2026-10-01',
      isHotLead: false,
      dealCycleDays: 9,
      notes: 'Deal closed! Advance of ₹5,000 received. Partner currently developing.',
      createdAt: '2026-09-22T09:15:00.000Z',
    },
    {
      id: 'lead-4',
      businessName: 'Urban Trendz Menswear',
      contactName: 'Karthik Raja',
      phone: '+919789000004',
      whatsapp: '919789000004',
      city: 'Tirupur',
      category: 'Fashion Retail',
      problemIdentified: 'Slow website on Wix; loading takes 7 seconds, mobile layout broken.',
      proposedSolution: 'Custom fast React/Vite storefront + WhatsApp cart.',
      estimatedValue: 10000,
      leadSource: 'Referral',
      assignedTo: 'damo',
      status: 'connected',
      lastContactDate: '2026-10-04',
      nextFollowupDate: '2026-10-07',
      isHotLead: false,
      dealCycleDays: 3,
      notes: 'Conducted audit. Promised to send speed comparison video.',
      createdAt: '2026-10-01T16:00:00.000Z',
    },
  ],
  revenue: [
    {
      id: 'rev-1',
      clientName: 'Kaveri Dental Care',
      serviceType: 'website',
      amount: 5000,
      paymentDate: '2026-10-01',
      notes: '50% project advance for 5-page appointment website.',
      xpAwarded: 50,
      isBenchmark: true,
    },
    {
      id: 'rev-2',
      clientName: 'Apex Logistics Coimbatore',
      serviceType: 'website',
      amount: 12000,
      paymentDate: '2026-09-24',
      notes: 'Full payment for logistics tracking landing page.',
      xpAwarded: 120,
      isBenchmark: true,
    },
    {
      id: 'rev-3',
      clientName: 'Sri Balaji Bakery & Sweets',
      serviceType: 'whatsapp_automation',
      amount: 8500,
      paymentDate: '2026-09-18',
      notes: 'Festival sweet pre-booking WhatsApp automation bot.',
      xpAwarded: 85,
      isBenchmark: true,
    },
    {
      id: 'rev-4',
      clientName: 'Studio Aura Photography',
      serviceType: 'website',
      amount: 15000,
      paymentDate: '2026-09-08',
      notes: 'Portfolio website + wedding package booking engine.',
      xpAwarded: 150,
      isBenchmark: true,
    },
  ],
  checkins: [
    {
      id: 'chk-1',
      userId: 'damo',
      date: '2026-10-03',
      completedSummary: 'Completed 9 calls, delivered Kaveri Dental demo to Dr. Kaveri, audited competitor pricing.',
      missedSummary: 'Missed 6 calls out of 15 quota.',
      missedReasonCategory: 'Higher priority came',
      biggestWin: 'Velan Silks agreed to review proposal; deal size ₹14,000.',
      blockers: 'Assistant gave 8 numbers with dead WhatsApp channels.',
      keyOutcome: 'Validated that local merchants want instant UPI QR in WhatsApp.',
      revenueLogged: 0,
      tomorrowFocus: 'Follow up with Velan Silks and enforce stricter lead qualification for Assistant.',
      createdAt: '2026-10-03T19:00:00.000Z',
    },
  ],
  ideas: [
    {
      id: 'idea-1',
      title: 'StoreIK: Instant WhatsApp & Instagram DM Checkout Bot',
      problem: 'Merchants spend 4 hours daily copying bank details and taking payment screenshots in DMs.',
      targetCustomer: 'Indian boutique clothing, organic foods, and handmade craft merchants selling on Instagram.',
      proposedSolution: 'Lightweight catalog link where customers tap "Buy on WhatsApp", auto-generating pre-filled cart messages with instant UPI QR.',
      potentialRevenue: 250000,
      difficulty: 'medium',
      costEstimate: 15000,
      status: 'validating',
      quarantineDaysRemaining: 4,
      validationMethod: 'Test with 3 existing website clients (Velan Silks, Annapoorna) before building full SaaS.',
      createdAt: '2026-10-01T12:00:00.000Z',
    },
    {
      id: 'idea-2',
      title: 'Akyzer: Premium Linen Shirt D2C Test Drop',
      problem: 'Founder wants to test e-commerce dropshipping brand under Akyzer brand.',
      targetCustomer: 'Urban young professionals in Bangalore / Chennai.',
      proposedSolution: 'Small batch of 50 shirts manufactured locally in Tirupur, marketed via Instagram reels.',
      potentialRevenue: 60000,
      difficulty: 'high',
      costEstimate: 35000,
      status: 'quarantine',
      quarantineDaysRemaining: 6,
      validationMethod: 'Pre-order landing page with 10 paid deposits before buying inventory.',
      createdAt: '2026-10-03T10:00:00.000Z',
    },
  ],
  experiments: [
    {
      id: 'exp-1',
      ideaId: 'idea-1',
      title: '7-Day WhatsApp Flow Form Pilot for Velan Silks',
      hypothesis: 'Providing a 3-tap WhatsApp Flow catalog will increase order conversion by 25% compared to manual Instagram DM chat.',
      durationDays: 7,
      startDate: '2026-10-02',
      endDate: '2026-10-09',
      metricsTracked: 'Catalog views, initiated chats, completed UPI payments.',
      successCriteria: 'At least 5 completed customer orders through the pilot catalog.',
      outcome: 'running',
      createdAt: '2026-10-02T10:00:00.000Z',
    },
  ],
  decisions: [
    {
      id: 'dec-1',
      title: 'Focus Uplora on Commerce-Tech while Preserving Website Cash Engine',
      rationale: 'Dropping website projects immediately would kill current ₹40k cashflow. We will fund StoreIK R&D purely from client website profits.',
      authorId: 'damo',
      authorName: 'Damo',
      expectedOutcome: 'Reach ₹1,00,000/month in website services within 60 days, then channel 30% of engineering time to StoreIK.',
      status: 'approved',
      reviewDate: '2026-11-05',
      riskAssessment: {
        revenueImpact: 'Preserves 100% of current cashflow; eliminates insolvency risk.',
        customerRisk: 'Existing website clients remain well-serviced.',
        teamCapacity: 'Partner spends 70% time on client sites, 30% on StoreIK modules.',
        recommendedPilotDays: 14,
      },
      permanentRule: 'Never discontinue a profitable service until new product generates at least 1.5x equivalent recurring margin.',
      createdAt: '2026-10-01T08:00:00.000Z',
    },
  ],
  opportunities: [
    {
      id: 'opp-1',
      headline: 'Meta expands WhatsApp Flows and In-Chat UPI for Indian Merchants',
      sector: 'WhatsApp Commerce',
      sourceDomain: 'techcrunch.com',
      whyItMatters: 'Indian SMBs can now take customer details directly inside WhatsApp without external websites. Uplora can package this as a high-margin setup service.',
      potentialService: 'Turnkey WhatsApp Flow Appointment & Catalog Setup (₹4,999 setup + ₹999/mo).',
      potentialRevenueEst: 45000,
      status: 'saved',
      createdAt: '2026-10-02T11:20:00.000Z',
    },
    {
      id: 'opp-2',
      headline: 'Instagram pushes Creator Marketplaces & Direct DM Selling Tools in Tier-2 India',
      sector: 'Instagram Selling',
      sourceDomain: 'economictimes.indiatimes.com',
      whyItMatters: 'Coimbatore, Surat, and Jaipur regional sellers are moving aggressively to Instagram. They lack professional order management.',
      potentialService: 'StoreIK Merchant Starter Kit: Bio Link + Live Inventory + WhatsApp CRM.',
      potentialRevenueEst: 80000,
      status: 'saved',
      createdAt: '2026-10-03T15:45:00.000Z',
    },
  ],
  company_memory: [
    {
      id: 'mem-1',
      category: 'vision',
      key: 'structure',
      content: 'Uplora is the parent Commerce-Tech engine. Akyzer is the proprietary D2C e-commerce brand. StoreIK is the core merchant platform product.',
      updatedAt: '2026-10-01T08:00:00.000Z',
    },
    {
      id: 'mem-2',
      category: 'pricing',
      key: 'website_tier',
      content: 'Standard responsive website: ₹6,000–₹10,000. E-commerce / catalog storefront: ₹12,000–₹25,000. Minimum 50% upfront payment required before design starts.',
      updatedAt: '2026-10-01T08:00:00.000Z',
    },
    {
      id: 'mem-3',
      category: 'lessons',
      key: 'scope_creep',
      content: 'Never accept multi-vendor marketplace scopes under ₹50,000; it creates timeline blowouts and strains Partner capacity.',
      updatedAt: '2026-10-01T08:00:00.000Z',
    },
    {
      id: 'mem-4',
      category: 'rules',
      key: 'idea_quarantine',
      content: 'Any new business or dropshipping concept must remain in 7-day quarantine with customer validation before any development commences.',
      updatedAt: '2026-10-01T08:00:00.000Z',
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      code: 'FIRST_RUPEE',
      title: 'The First Rupee',
      description: 'Bank first ₹1,000 from a commercial client.',
      icon: '🌱',
      xpReward: 100,
      unlocked: true,
      unlockedAt: '2025-12-15T12:00:00.000Z',
    },
    {
      id: 'ach-2',
      code: 'TEN_K_CLUB',
      title: 'Ten-K Milestone',
      description: 'Generate over ₹10,000 in a single month.',
      icon: '🥉',
      xpReward: 250,
      unlocked: true,
      unlockedAt: '2026-01-20T12:00:00.000Z',
    },
    {
      id: 'ach-3',
      code: 'STREAK_4',
      title: 'Iron Executioner (4-Day Streak)',
      description: 'Execute core company check-ins 4 days in a row.',
      icon: '🔥',
      xpReward: 150,
      unlocked: true,
      unlockedAt: '2026-10-04T08:00:00.000Z',
    },
    {
      id: 'ach-4',
      code: 'HALF_CENTURY',
      title: 'Half-Century Run (₹50k Month)',
      description: 'Collect ₹50,000 in customer cash in one month.',
      icon: '🥈',
      xpReward: 500,
      unlocked: false,
    },
    {
      id: 'ach-5',
      code: 'LAKH_BOSS',
      title: 'Six-Figure Operator (₹1L Month)',
      description: 'Slay the ₹1,00,000 Monthly Boss Battle.',
      icon: '🥇',
      xpReward: 1000,
      unlocked: false,
    },
    {
      id: 'ach-6',
      code: 'FIRST_STOREIK',
      title: 'StoreIK Pioneer',
      description: 'Onboard the very first merchant on StoreIK.',
      icon: '🚀',
      xpReward: 750,
      unlocked: false,
    },
    {
      id: 'ach-7',
      code: 'CRORE_CLUB',
      title: 'The ₹1 Crore Milestone',
      description: 'Reach ₹10,000,000 in cumulative revenue.',
      icon: '💎',
      xpReward: 10000,
      unlocked: false,
    },
    {
      id: 'ach-8',
      code: 'ONE_BILLION_CONQUEST',
      title: '₹1 Billion Empire S-Tier',
      description: 'Attain the ultimate ₹1,000,000,000 Quest Conquest.',
      icon: '👑',
      xpReward: 100000,
      unlocked: false,
    },
  ],
  audit_logs: [
    {
      id: 'log-1',
      timestamp: new Date().toISOString(),
      actor: 'damo',
      action: 'INITIAL_BOOTSTRAP',
      details: 'Database initialized with Uplora seed benchmark v2.',
    },
  ],
  pending_actions: [],
};

class LocalDatabase {
  private db: DatabaseSchema = INITIAL_BENCHMARK;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        try {
          const raw = fs.readFileSync(DB_FILE, 'utf-8');
          const parsed = JSON.parse(raw);
          // Auto-migrate schema collections if missing
          if (!parsed.experiments) parsed.experiments = INITIAL_BENCHMARK.experiments;
          if (!parsed.company_memory) parsed.company_memory = INITIAL_BENCHMARK.company_memory;
          if (!parsed.audit_logs) parsed.audit_logs = INITIAL_BENCHMARK.audit_logs;
          if (!parsed.pending_actions) parsed.pending_actions = [];
          if (!parsed.schemaVersion) parsed.schemaVersion = 2;
          this.db = parsed;
          // Backup on startup
          fs.writeFileSync(BAK_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
        } catch (readErr) {
          console.error('Database file corrupted, attempting recovery from backup:', readErr);
          if (fs.existsSync(BAK_FILE)) {
            const bakRaw = fs.readFileSync(BAK_FILE, 'utf-8');
            this.db = JSON.parse(bakRaw);
          } else {
            this.db = INITIAL_BENCHMARK;
          }
          this.persist();
        }
      } else {
        this.persist();
      }
    } catch (e) {
      console.error('Error initializing database, using initial benchmark:', e);
      this.db = INITIAL_BENCHMARK;
    }
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      // Safe atomic write pattern
      const content = JSON.stringify(this.db, null, 2);
      fs.writeFileSync(TMP_FILE, content, 'utf-8');
      fs.renameSync(TMP_FILE, DB_FILE);
    } catch (e) {
      console.error('Failed to persist database atomically:', e);
    }
  }

  public getCompanyStatus(): CompanyStatus {
    const cumulativeRev = this.db.revenue.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
    const benchmarkRev = this.db.revenue.filter((r) => r.isBenchmark).reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
    const verifiedLiveRev = this.db.revenue.filter((r) => !r.isBenchmark).reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
    const isBenchmarkBaseline = verifiedLiveRev === 0;
    
    // Calculate current month's revenue (current year & month)
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const currentMonthRev = this.db.revenue
      .filter((r) => {
        const d = new Date(r.paymentDate);
        return d.getFullYear() === curYear && d.getMonth() === curMonth;
      })
      .reduce((acc, r) => acc + (Number(r.amount) || 0), 0);

    const totalXp = this.db.users.reduce((acc, u) => acc + (u.xp || 0), 0);
    const overallLevel = Math.max(1, Math.floor(totalXp / 1000) + 1);

    const activeLeads = this.db.leads.filter((l) => l.status !== 'lost');
    const pipelineVal = this.db.leads
      .filter((l) => !['won', 'lost'].includes(l.status))
      .reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);

    const todayStr = now.toISOString().split('T')[0];
    const hotLeads = this.db.leads.filter((l) => l.isHotLead || ['proposal', 'negotiation'].includes(l.status) || (l.estimatedValue || 0) >= 12000);
    const overdueFollowups = this.db.leads.filter((l) => l.nextFollowupDate && l.nextFollowupDate < todayStr && !['won', 'lost'].includes(l.status));

    // Dynamic Health Scores (No hard-coded values!)
    const monthlyTarget = this.db.company.monthlyTarget || 100000;
    const revScore = Math.min(100, Math.round((currentMonthRev / monthlyTarget) * 100));

    const leadsContacted = this.db.leads.filter((l) => l.status !== 'prospect').length;
    const leadsWon = this.db.leads.filter((l) => l.status === 'won').length;
    const salesScore = leadsContacted > 0 ? Math.min(100, Math.round((leadsWon / leadsContacted) * 100 * 2)) : 50;

    // Delivery score: based on delivery tasks completion rate
    const deliveryTasks = this.db.tasks.filter((t) => t.category === 'delivery');
    const completedDelivery = deliveryTasks.filter((t) => t.status === 'completed').length;
    const deliveryScore = deliveryTasks.length > 0 ? Math.min(100, Math.round((completedDelivery / deliveryTasks.length) * 100)) : 75;

    // Lead Generation score: Assistant quota achievement & lead count
    const assistant = this.db.users.find((u) => u.id === 'assistant');
    const leadGenScore = assistant ? Math.min(100, Math.round(((assistant.dailyCompleted || 0) / (assistant.dailyQuota || 30)) * 100)) : 50;

    // Product score: validation of ideas and active experiments
    const activeExperiments = (this.db.experiments || []).filter((e) => e.outcome === 'running' || e.outcome === 'success').length;
    const productScore = Math.min(100, Math.round(((this.db.ideas.length * 8) + (activeExperiments * 25))));

    // Marketing score: active lead discovery + market radar opportunities saved
    const oppsCount = (this.db.opportunities || []).filter((o) => o.status === 'saved' || o.status === 'converted_to_idea').length;
    const marketingScore = Math.min(100, Math.round((this.db.leads.length * 4) + (oppsCount * 12)));

    // Team score: overall task completion discipline across all members
    const totalTasks = this.db.tasks.length;
    const completedTasks = this.db.tasks.filter((t) => t.status === 'completed').length;
    const teamScore = totalTasks > 0 ? Math.min(100, Math.round((completedTasks / totalTasks) * 100)) : 65;

    const composite = Math.round(
      revScore * 0.25 + salesScore * 0.2 + deliveryScore * 0.15 + leadGenScore * 0.15 + productScore * 0.1 + marketingScore * 0.05 + teamScore * 0.1
    );

    // Dynamic Bottleneck Diagnosis & Prescription
    let primaryBottleneck = 'Sales Conversion Velocity';
    const cashGap = Math.max(0, monthlyTarget - currentMonthRev);
    let aiPrescription = `You have ₹${pipelineVal.toLocaleString('en-IN')} in active pipeline. Close ₹${cashGap.toLocaleString('en-IN')} more to clear the ₹${monthlyTarget.toLocaleString('en-IN')} monthly boss target. Focus Damo on closing calls today.`;

    if (salesScore < 40) {
      primaryBottleneck = 'Lead-to-Proposal Conversion Lag';
      aiPrescription = `${overdueFollowups.length} leads have overdue follow-up dates. Conduct immediate outreach before sourcing new cold leads.`;
    } else if (revScore < 25) {
      primaryBottleneck = 'Cash Generation Shortfall';
      aiPrescription = `Only ₹${currentMonthRev.toLocaleString('en-IN')} collected so far this month. Package a quick website or catalog offer to bank cash advances immediately.`;
    } else if (leadGenScore < 45) {
      primaryBottleneck = 'Lead Hunter Pipeline Input Deficit';
      aiPrescription = 'Assistant daily lead enrichment is falling behind quota. Verify WhatsApp numbers to unblock outbound calls.';
    }

    // Dynamic Multi-Scenario ETA calculations based on real distinct months
    const questTarget = this.db.company.questTarget || 1000000000;
    const remaining = Math.max(0, questTarget - cumulativeRev);

    // Group revenues by YYYY-MM to compute real historical average
    const monthBuckets = new Set<string>();
    this.db.revenue.forEach((r) => {
      if (r.paymentDate) {
        monthBuckets.add(r.paymentDate.substring(0, 7));
      }
    });
    const monthsRecorded = Math.max(1, monthBuckets.size);
    const avgMonthly = Math.max(10000, Math.round(cumulativeRev / monthsRecorded));

    const worstMonths = Math.ceil(remaining / avgMonthly);
    const baseMonths = Math.min(360, Math.ceil(Math.log(1 + (remaining * 0.12) / avgMonthly) / Math.log(1.12)) || 96);
    const bestMonths = Math.min(180, Math.ceil(Math.log(1 + (remaining * 0.25) / avgMonthly) / Math.log(1.25)) || 48);

    const worstDate = new Date();
    worstDate.setMonth(worstDate.getMonth() + Math.min(600, worstMonths));

    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() + baseMonths);

    const bestDate = new Date();
    bestDate.setMonth(bestDate.getMonth() + bestMonths);

    return {
      name: this.db.company.name,
      questTarget,
      monthlyTarget,
      currentMonthlyRevenue: currentMonthRev,
      cumulativeRevenue: cumulativeRev,
      runRateEstimate: this.db.company.currentRunRate,
      overallXp: totalXp,
      level: overallLevel,
      streakDays: this.db.company.streakDays,
      activeLeadsCount: activeLeads.length,
      pipelineValue: pipelineVal,
      hotLeadsCount: hotLeads.length,
      overdueFollowupsCount: overdueFollowups.length,
      benchmarkRevenue: benchmarkRev,
      verifiedLiveRevenue: verifiedLiveRev,
      isBenchmarkBaseline,
      healthScores: {
        revenue: revScore,
        sales: salesScore,
        delivery: deliveryScore,
        leadGen: leadGenScore,
        product: productScore,
        marketing: marketingScore,
        teamExecution: teamScore,
        composite,
      },
      primaryBottleneck,
      aiPrescription,
      eta: {
        worstCaseDate: worstDate.toISOString().split('T')[0],
        baseCaseDate: baseDate.toISOString().split('T')[0],
        bestCaseDate: bestDate.toISOString().split('T')[0],
        worstMonths,
        baseMonths,
        bestMonths,
        confidence: monthsRecorded < 4 ? 'low' : monthsRecorded < 12 ? 'medium' : 'high',
      },
    };
  }

  public updateCompanyTarget(questTarget?: number, monthlyTarget?: number) {
    if (questTarget !== undefined && questTarget > 0) this.db.company.questTarget = questTarget;
    if (monthlyTarget !== undefined && monthlyTarget > 0) this.db.company.monthlyTarget = monthlyTarget;
    this.logAudit('damo', 'UPDATE_TARGETS', { questTarget, monthlyTarget });
    this.persist();
    return this.getCompanyStatus();
  }

  public getUsers(): User[] {
    return this.db.users;
  }

  public getTasks(filter?: { ownerId?: string; layer?: string; status?: string }): Task[] {
    return this.db.tasks.filter((t) => {
      if (filter?.ownerId && t.ownerId !== filter.ownerId) return false;
      if (filter?.layer && t.layer !== filter.layer) return false;
      if (filter?.status && t.status !== filter.status) return false;
      return true;
    });
  }

  public createTask(task: Partial<Task>, actor: AuditLog['actor'] = 'damo'): Task {
    if (!task.title || typeof task.title !== 'string' || !task.title.trim()) {
      throw new Error('Validation Error: Task title is required and cannot be empty.');
    }
    const ownerId = task.ownerId || 'damo';
    if (!VALIDATION_RULES.OWNER_IDS.includes(ownerId as any)) {
      throw new Error(`Validation Error: Invalid ownerId '${ownerId}'. Must be one of: ${VALIDATION_RULES.OWNER_IDS.join(', ')}`);
    }
    const layer = task.layer || 'daily';
    if (!VALIDATION_RULES.TASK_LAYERS.includes(layer as any)) {
      throw new Error(`Validation Error: Invalid task layer '${layer}'. Must be one of: ${VALIDATION_RULES.TASK_LAYERS.join(', ')}`);
    }
    const category = task.category || 'sales';
    if (!VALIDATION_RULES.TASK_CATEGORIES.includes(category as any)) {
      throw new Error(`Validation Error: Invalid task category '${category}'. Must be one of: ${VALIDATION_RULES.TASK_CATEGORIES.join(', ')}`);
    }
    const priority = task.priority || 'medium';
    if (!VALIDATION_RULES.TASK_PRIORITIES.includes(priority as any)) {
      throw new Error(`Validation Error: Invalid task priority '${priority}'. Must be one of: ${VALIDATION_RULES.TASK_PRIORITIES.join(', ')}`);
    }
    const xpReward = Number(task.xpReward !== undefined ? task.xpReward : 50);
    if (isNaN(xpReward) || xpReward < 0 || xpReward > 50000) {
      throw new Error('Validation Error: xpReward must be a positive number up to 50,000.');
    }
    const revenueRelation = Number(task.revenueRelation || 0);
    if (isNaN(revenueRelation) || revenueRelation < 0) {
      throw new Error('Validation Error: revenueRelation must be a non-negative number.');
    }

    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: task.title.trim(),
      description: task.description || '',
      ownerId,
      layer,
      category,
      priority,
      difficulty: task.difficulty || 'medium',
      xpReward,
      status: 'pending',
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
      relatedRevenueTarget: task.relatedRevenueTarget,
      revenueRelation,
      strategicRelation: task.strategicRelation || '',
      estimatedEffortMinutes: Number(task.estimatedEffortMinutes) || 60,
    };
    this.db.tasks.unshift(newTask);
    this.logAudit(actor, 'CREATE_TASK', { taskId: newTask.id, title: newTask.title, ownerId: newTask.ownerId });
    this.persist();
    return newTask;
  }

  public updateTask(id: string, updates: Partial<Task>, actor: AuditLog['actor'] = 'damo'): Task {
    const task = this.db.tasks.find((t) => t.id === id);
    if (!task) throw new Error('Task not found');
    Object.assign(task, updates);
    this.logAudit(actor, 'UPDATE_TASK', { taskId: id, updates });
    this.persist();
    return task;
  }

  public completeTask(taskId: string, resultNote?: string, actor: AuditLog['actor'] = 'damo'): { task: Task; xpAwarded: number; newXp: number; level: number } {
    const task = this.db.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.status = 'completed';
    task.completedAt = new Date().toISOString();
    if (resultNote) task.completionResult = resultNote;

    const user = this.db.users.find((u) => u.id === task.ownerId);
    if (user) {
      user.xp += task.xpReward;
      user.level = Math.max(1, Math.floor(user.xp / 1000) + 1);
      user.dailyCompleted = (user.dailyCompleted || 0) + 1;
    }

    this.checkAchievements();
    this.logAudit(actor, 'COMPLETE_TASK', { taskId, xpReward: task.xpReward, ownerId: task.ownerId });
    this.persist();

    return {
      task,
      xpAwarded: task.xpReward,
      newXp: user ? user.xp : 0,
      level: user ? user.level : 1,
    };
  }

  public missTask(taskId: string, reason: string, notes?: string, actor: AuditLog['actor'] = 'damo'): { task: Task; needsAdaptation: boolean; suggestion?: string } {
    const task = this.db.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.status = 'missed';
    task.missedReason = reason;
    task.missedNotes = notes;

    const userMissed = this.db.tasks.filter((t) => t.ownerId === task.ownerId && t.status === 'missed');
    const needsAdaptation = userMissed.length >= 2;
    let suggestion: string | undefined = undefined;

    if (needsAdaptation) {
      if (reason.toLowerCase().includes('delivery') || reason.toLowerCase().includes('priority')) {
        suggestion = 'Conflict detected: High client delivery workload is cannibalizing sales. Reduce daily calls to 8 and block 11am-1pm strictly for outbound closing.';
      } else if (reason.toLowerCase().includes('time')) {
        suggestion = 'Time deficit: Limit internal research to 45 min in the morning; schedule client calls as non-negotiable blocks.';
      } else if (reason.toLowerCase().includes('lead') || reason.toLowerCase().includes('reach')) {
        suggestion = 'Lead quality bottleneck: Assistant must pre-verify WhatsApp status before calls are initiated.';
      } else {
        suggestion = 'Momentum step-down: Convert target to 8 calls/day for 3 days to rebuild execution confidence.';
      }
    }

    this.logAudit(actor, 'MISS_TASK', { taskId, reason, notes, needsAdaptation });
    this.persist();
    return { task, needsAdaptation, suggestion };
  }

  public adaptTask(taskId: string, newTitle: string, newXp: number, actor: AuditLog['actor'] = 'damo'): Task {
    const oldTask = this.db.tasks.find((t) => t.id === taskId);
    const adaptedTask: Task = {
      id: `task-adapted-${Date.now()}`,
      title: newTitle,
      description: oldTask ? `Adapted from [${oldTask.title}]. Reason: ${oldTask.missedReason || 'Performance pacing'}` : 'Difficulty scaled down for execution momentum.',
      ownerId: oldTask ? oldTask.ownerId : 'damo',
      layer: 'daily',
      category: oldTask ? oldTask.category : 'sales',
      priority: 'high',
      difficulty: 'easy',
      xpReward: newXp,
      status: 'pending',
      dueDate: new Date().toISOString().split('T')[0],
      adaptedFromTaskId: taskId,
      revenueRelation: oldTask?.revenueRelation || 5000,
      strategicRelation: 'Rebuild daily execution streak',
      estimatedEffortMinutes: 60,
    };
    this.db.tasks.unshift(adaptedTask);
    this.logAudit(actor, 'ADAPT_TASK', { fromTaskId: taskId, newTaskId: adaptedTask.id, newTitle });
    this.persist();
    return adaptedTask;
  }

  public getLeads(filter?: { status?: string; assignedTo?: string }): Lead[] {
    return this.db.leads.filter((l) => {
      if (filter?.status && l.status !== filter.status) return false;
      if (filter?.assignedTo && l.assignedTo !== filter.assignedTo) return false;
      return true;
    });
  }

  public createLead(lead: Partial<Lead>, actor: AuditLog['actor'] = 'damo'): Lead {
    if (!lead.businessName || typeof lead.businessName !== 'string' || !lead.businessName.trim()) {
      throw new Error('Validation Error: Business name is required.');
    }
    const assignedTo = lead.assignedTo || 'damo';
    if (!VALIDATION_RULES.OWNER_IDS.includes(assignedTo as any)) {
      throw new Error(`Validation Error: Invalid assignedTo '${assignedTo}'. Must be one of: ${VALIDATION_RULES.OWNER_IDS.join(', ')}`);
    }
    const status = lead.status || 'prospect';
    if (!VALIDATION_RULES.LEAD_STAGES.includes(status as any)) {
      throw new Error(`Validation Error: Invalid lead stage '${status}'. Must be one of: ${VALIDATION_RULES.LEAD_STAGES.join(', ')}`);
    }
    const estimatedValue = Number(lead.estimatedValue !== undefined ? lead.estimatedValue : 8000);
    if (isNaN(estimatedValue) || estimatedValue < 0 || estimatedValue > 1000000000) {
      throw new Error('Validation Error: estimatedValue must be a non-negative number up to ₹100 Crore.');
    }

    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      businessName: lead.businessName.trim(),
      contactName: lead.contactName || '',
      phone: lead.phone || '',
      whatsapp: lead.whatsapp || (lead.phone ? lead.phone.replace(/[^0-9]/g, '') : ''),
      instagram: lead.instagram,
      website: lead.website,
      city: lead.city || 'Tamil Nadu',
      category: lead.category || 'Retail',
      problemIdentified: lead.problemIdentified || 'Lacks professional mobile storefront.',
      proposedSolution: lead.proposedSolution || 'Uplora Website + WhatsApp Catalog.',
      estimatedValue,
      leadSource: lead.leadSource || 'Instagram',
      assignedTo,
      status,
      isHotLead: lead.isHotLead || false,
      dealCycleDays: 0,
      notes: lead.notes || '',
      createdAt: new Date().toISOString(),
    };
    this.db.leads.unshift(newLead);

    // Award 5 XP for qualified lead
    const creator = this.db.users.find((u) => u.id === newLead.assignedTo) || this.db.users[0];
    if (creator) creator.xp += 5;

    this.logAudit(actor, 'CREATE_LEAD', { leadId: newLead.id, businessName: newLead.businessName });
    this.persist();
    return newLead;
  }

  public updateLeadStage(id: string, status: Lead['status'], notes?: string, actor: AuditLog['actor'] = 'damo'): Lead {
    const lead = this.db.leads.find((l) => l.id === id);
    if (!lead) throw new Error('Lead not found');
    const oldStatus = lead.status;
    lead.status = status;
    lead.lastContactDate = new Date().toISOString().split('T')[0];
    if (notes) lead.notes = `${lead.notes ? lead.notes + '\n' : ''}[${lead.lastContactDate}]: ${notes}`;

    if (status === 'won' && oldStatus !== 'won') {
      const owner = this.db.users.find((u) => u.id === lead.assignedTo);
      if (owner) owner.xp += 250; // Won deal bonus
    }

    this.checkAchievements();
    this.logAudit(actor, 'UPDATE_LEAD_STAGE', { leadId: id, oldStatus, newStatus: status });
    this.persist();
    return lead;
  }

  public deleteLead(id: string, actor: AuditLog['actor'] = 'damo'): boolean {
    const idx = this.db.leads.findIndex((l) => l.id === id);
    if (idx !== -1) {
      const lead = this.db.leads[idx];
      this.db.leads.splice(idx, 1);
      this.logAudit(actor, 'DELETE_LEAD', { leadId: id, businessName: lead.businessName });
      this.persist();
      return true;
    }
    return false;
  }

  public getCRMAnalytics(): CRMAnalytics {
    const todayStr = new Date().toISOString().split('T')[0];
    const totalLeads = this.db.leads.length;
    const activeLeads = this.db.leads.filter((l) => !['won', 'lost'].includes(l.status)).length;
    const pipelineValue = this.db.leads
      .filter((l) => !['won', 'lost'].includes(l.status))
      .reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);
    const wonLeads = this.db.leads.filter((l) => l.status === 'won');
    const wonValue = wonLeads.reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);
    const contactedLeads = this.db.leads.filter((l) => l.status !== 'prospect').length;
    const winRate = contactedLeads > 0 ? Math.round((wonLeads.length / contactedLeads) * 100) : 0;
    const avgDealValue = wonLeads.length > 0 ? Math.round(wonValue / wonLeads.length) : 10000;
    const overdueFollowupsCount = this.db.leads.filter((l) => l.nextFollowupDate && l.nextFollowupDate < todayStr && !['won', 'lost'].includes(l.status)).length;
    const hotLeadsCount = this.db.leads.filter((l) => l.isHotLead || ['proposal', 'negotiation'].includes(l.status) || (l.estimatedValue || 0) >= 12000).length;

    const bySource: Record<string, { count: number; won: number; value: number }> = {};
    const stageCounts: any = {};

    this.db.leads.forEach((l) => {
      const src = l.leadSource || 'Other';
      if (!bySource[src]) bySource[src] = { count: 0, won: 0, value: 0 };
      bySource[src].count += 1;
      if (l.status === 'won') {
        bySource[src].won += 1;
        bySource[src].value += Number(l.estimatedValue) || 0;
      }
      stageCounts[l.status] = (stageCounts[l.status] || 0) + 1;
    });

    return {
      totalLeads,
      activeLeads,
      pipelineValue,
      wonValue,
      winRate,
      avgDealValue,
      overdueFollowupsCount,
      hotLeadsCount,
      bySource,
      stageCounts,
    };
  }

  public getRevenue(): RevenueEntry[] {
    return this.db.revenue;
  }

  public addRevenue(entry: Partial<RevenueEntry>, actor: AuditLog['actor'] = 'damo'): { entry: RevenueEntry; xpAwarded: number } {
    const amount = Number(entry.amount);
    if (isNaN(amount) || amount <= 0 || amount > 1000000000) {
      throw new Error('Validation Error: Revenue amount must be a positive number up to ₹100 Crore.');
    }
    if (!entry.clientName || typeof entry.clientName !== 'string' || !entry.clientName.trim()) {
      throw new Error('Validation Error: Client name is required.');
    }
    const serviceType = entry.serviceType || 'website';
    if (!VALIDATION_RULES.SERVICE_TYPES.includes(serviceType as any)) {
      throw new Error(`Validation Error: Invalid serviceType '${serviceType}'. Must be one of: ${VALIDATION_RULES.SERVICE_TYPES.join(', ')}`);
    }

    const xp = Math.max(10, Math.floor(amount / 100)); // 1 XP per ₹100
    const newEntry: RevenueEntry = {
      id: `rev-${Date.now()}`,
      clientName: entry.clientName.trim(),
      serviceType,
      amount,
      paymentDate: entry.paymentDate || new Date().toISOString().split('T')[0],
      notes: entry.notes || '',
      xpAwarded: xp,
      isBenchmark: entry.isBenchmark || false,
    };
    this.db.revenue.unshift(newEntry);

    const damo = this.db.users.find((u) => u.id === 'damo');
    if (damo) {
      damo.xp += xp;
      damo.level = Math.max(1, Math.floor(damo.xp / 1000) + 1);
    }

    this.checkAchievements();
    this.logAudit(actor, 'ADD_REVENUE', { revId: newEntry.id, amount, clientName: newEntry.clientName });
    this.persist();
    return { entry: newEntry, xpAwarded: xp };
  }

  public getCheckins(): DailyCheckin[] {
    return this.db.checkins;
  }

  public addCheckin(chk: Partial<DailyCheckin>, actor: AuditLog['actor'] = 'damo'): DailyCheckin {
    const newChk: DailyCheckin = {
      id: `chk-${Date.now()}`,
      userId: chk.userId || 'damo',
      date: chk.date || new Date().toISOString().split('T')[0],
      completedSummary: chk.completedSummary || '',
      missedSummary: chk.missedSummary || '',
      missedReasonCategory: chk.missedReasonCategory,
      biggestWin: chk.biggestWin || '',
      blockers: chk.blockers || '',
      keyOutcome: chk.keyOutcome || '',
      revenueLogged: Number(chk.revenueLogged) || 0,
      tomorrowFocus: chk.tomorrowFocus || '',
      createdAt: new Date().toISOString(),
    };
    this.db.checkins.unshift(newChk);

    this.db.company.streakDays += 1;
    const user = this.db.users.find((u) => u.id === newChk.userId);
    if (user) {
      user.streak += 1;
      user.xp += 25; // 25 XP for completing check-in
    }

    this.checkAchievements();
    this.logAudit(actor, 'DAILY_CHECKIN', { date: newChk.date, biggestWin: newChk.biggestWin });
    this.persist();
    return newChk;
  }

  public getIdeas(): Idea[] {
    return this.db.ideas;
  }

  public createIdea(idea: Partial<Idea>, actor: AuditLog['actor'] = 'damo'): Idea {
    if (!idea.title || typeof idea.title !== 'string' || !idea.title.trim()) {
      throw new Error('Validation Error: Idea title is required.');
    }
    if (!idea.problem || typeof idea.problem !== 'string' || !idea.problem.trim()) {
      throw new Error('Validation Error: Problem definition is required.');
    }

    const newIdea: Idea = {
      id: `idea-${Date.now()}`,
      title: idea.title.trim(),
      problem: idea.problem.trim(),
      targetCustomer: idea.targetCustomer || '',
      proposedSolution: idea.proposedSolution || '',
      potentialRevenue: Number(idea.potentialRevenue) || 50000,
      difficulty: idea.difficulty || 'medium',
      costEstimate: Number(idea.costEstimate) || 5000,
      status: 'quarantine',
      quarantineDaysRemaining: 7,
      validationMethod: idea.validationMethod || '7-day customer interviews / pre-order tests',
      createdAt: new Date().toISOString(),
    };
    this.db.ideas.unshift(newIdea);
    this.logAudit(actor, 'CREATE_IDEA', { ideaId: newIdea.id, title: newIdea.title });
    this.persist();
    return newIdea;
  }

  public updateIdeaStatus(id: string, status: Idea['status'], actor: AuditLog['actor'] = 'damo'): Idea {
    const idea = this.db.ideas.find((i) => i.id === id);
    if (!idea) throw new Error('Idea not found');
    idea.status = status;
    this.logAudit(actor, 'UPDATE_IDEA_STATUS', { ideaId: id, status });
    this.persist();
    return idea;
  }

  // Experiments
  public getExperiments(): Experiment[] {
    return this.db.experiments || [];
  }

  public createExperiment(exp: Partial<Experiment>, actor: AuditLog['actor'] = 'damo'): Experiment {
    if (!exp.title || typeof exp.title !== 'string' || !exp.title.trim()) {
      throw new Error('Validation Error: Experiment title is required.');
    }
    if (!exp.hypothesis || typeof exp.hypothesis !== 'string' || !exp.hypothesis.trim()) {
      throw new Error('Validation Error: Falsifiable commercial hypothesis is required.');
    }
    const durationDays = Number(exp.durationDays !== undefined ? exp.durationDays : 7);
    if (!Number.isInteger(durationDays) || durationDays <= 0 || durationDays > 365) {
      throw new Error('Validation Error: durationDays must be an integer between 1 and 365.');
    }

    const newExp: Experiment = {
      id: `exp-${Date.now()}`,
      ideaId: exp.ideaId,
      title: exp.title.trim(),
      hypothesis: exp.hypothesis.trim(),
      durationDays,
      startDate: exp.startDate || new Date().toISOString().split('T')[0],
      endDate: exp.endDate || new Date(Date.now() + durationDays * 86400000).toISOString().split('T')[0],
      metricsTracked: exp.metricsTracked || 'Inquiries, Conversion %, Deposits banked',
      successCriteria: exp.successCriteria || 'At least 3 paying customers',
      outcome: exp.outcome || 'running',
      lessonsLearned: exp.lessonsLearned,
      createdAt: new Date().toISOString(),
    };
    if (!this.db.experiments) this.db.experiments = [];
    this.db.experiments.unshift(newExp);
    this.logAudit(actor, 'CREATE_EXPERIMENT', { expId: newExp.id, title: newExp.title });
    this.persist();
    return newExp;
  }

  public updateExperimentStatus(id: string, outcome: Experiment['outcome'], lessonsLearned?: string, actor: AuditLog['actor'] = 'damo'): Experiment {
    const exp = (this.db.experiments || []).find((e) => e.id === id);
    if (!exp) throw new Error('Experiment not found');
    exp.outcome = outcome;
    if (lessonsLearned) exp.lessonsLearned = lessonsLearned;
    this.logAudit(actor, 'UPDATE_EXPERIMENT', { expId: id, outcome, lessonsLearned });
    this.persist();
    return exp;
  }

  // Strategic Decisions
  public getDecisions(): StrategicDecision[] {
    return this.db.decisions;
  }

  public createDecision(decision: Partial<StrategicDecision>, actor: AuditLog['actor'] = 'damo'): StrategicDecision {
    if (!decision.title || typeof decision.title !== 'string' || !decision.title.trim()) {
      throw new Error('Validation Error: Decision title is required.');
    }
    if (!decision.rationale || typeof decision.rationale !== 'string' || !decision.rationale.trim()) {
      throw new Error('Validation Error: Strategic rationale is required.');
    }

    const newDecision: StrategicDecision = {
      id: `dec-${Date.now()}`,
      title: decision.title.trim(),
      rationale: decision.rationale.trim(),
      authorId: decision.authorId || 'damo',
      authorName: decision.authorName || 'Damo',
      expectedOutcome: decision.expectedOutcome || '',
      status: decision.status || 'proposed',
      reviewDate: decision.reviewDate || new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
      riskAssessment: decision.riskAssessment || {
        revenueImpact: 'Moderate risk to short-term runway.',
        customerRisk: 'Requires continuous communication.',
        teamCapacity: 'Requires shift of 30% weekly hours.',
        recommendedPilotDays: 14,
      },
      actualOutcome: decision.actualOutcome,
      permanentRule: decision.permanentRule,
      createdAt: new Date().toISOString(),
    };
    this.db.decisions.unshift(newDecision);
    this.logAudit(actor, 'CREATE_DECISION', { decisionId: newDecision.id, title: newDecision.title });
    this.persist();
    return newDecision;
  }

  public updateDecisionStatus(
    id: string,
    statusInput: string,
    actor?: string,
    outcomeNote?: string,
    permanentRule?: string
  ): StrategicDecision {
    const dec = this.db.decisions.find((d) => d.id === id);
    if (!dec) throw new Error(`Decision with ID '${id}' not found.`);

    if (!actor || actor !== 'damo') {
      throw new Error(`Founder Authorization Required: Only founder Damo can authorize strategic decisions (received: '${actor || 'unspecified'}').`);
    }

    const normalizedStatus = (statusInput === 'pilot_first' ? 'in_pilot' : statusInput) as DecisionStatus;

    if (!VALIDATION_RULES.DECISION_STATUSES.includes(normalizedStatus)) {
      throw new Error(`Invalid decision status '${statusInput}'. Allowed: ${VALIDATION_RULES.DECISION_STATUSES.join(', ')}, pilot_first`);
    }

    const currentStatus = dec.status;

    // Strict founder lifecycle validation:
    // proposed -> pilot_first (in_pilot) / rejected / approved -> executed / reviewed
    if (normalizedStatus === 'approved') {
      if (currentStatus !== 'proposed' && currentStatus !== 'in_pilot') {
        throw new Error(`Invalid transition: cannot approve a decision that is currently '${currentStatus}'. Valid lifecycle: proposed -> pilot_first / approved.`);
      }
      dec.approvedBy = 'damo';
      dec.approvedAt = new Date().toISOString();
    } else if (normalizedStatus === 'in_pilot') {
      if (currentStatus !== 'proposed') {
        throw new Error(`Invalid transition: only proposed decisions can move to in_pilot (current: '${currentStatus}').`);
      }
    } else if (normalizedStatus === 'rejected') {
      if (currentStatus === 'executed') {
        throw new Error('Invalid transition: cannot reject a decision that has already been executed.');
      }
      if (currentStatus === 'reviewed') {
        throw new Error('Invalid transition: cannot reject a decision that has already been reviewed.');
      }
    } else if (normalizedStatus === 'executed') {
      if (currentStatus !== 'approved' && currentStatus !== 'in_pilot') {
        throw new Error(`Invalid transition: cannot execute decision before founder approval or pilot (current: '${currentStatus}').`);
      }
    } else if (normalizedStatus === 'reviewed') {
      if (currentStatus !== 'executed' && currentStatus !== 'approved' && currentStatus !== 'in_pilot') {
        throw new Error(`Invalid transition: cannot mark decision as reviewed before approval or pilot (current: '${currentStatus}').`);
      }
    }

    dec.status = normalizedStatus;
    if (outcomeNote) dec.actualOutcome = outcomeNote;
    if (permanentRule) dec.permanentRule = permanentRule;

    this.logAudit(actor as any || 'damo', `DECISION_${normalizedStatus.toUpperCase()}`, {
      decisionId: id,
      title: dec.title,
      from: currentStatus,
      to: normalizedStatus,
      outcomeNote,
      permanentRule,
    });
    this.persist();
    return dec;
  }

  // Opportunities
  public getOpportunities(): MarketOpportunity[] {
    return this.db.opportunities || [];
  }

  public addOpportunities(opps: MarketOpportunity[]) {
    if (!this.db.opportunities) this.db.opportunities = [];
    this.db.opportunities.unshift(...opps);
    this.persist();
    return this.db.opportunities;
  }

  public updateOpportunityStatus(id: string, status: MarketOpportunity['status']) {
    const opp = (this.db.opportunities || []).find((o) => o.id === id);
    if (!opp) throw new Error('Opportunity not found');
    opp.status = status;
    this.persist();
    return opp;
  }

  // Company Memory
  public getCompanyMemory(category?: string): CompanyMemoryItem[] {
    const items = this.db.company_memory || [];
    if (category) return items.filter((m) => m.category === category);
    return items;
  }

  public createCompanyMemory(category: CompanyMemoryItem['category'], key: string, content: string): CompanyMemoryItem {
    if (!this.db.company_memory) this.db.company_memory = [];
    const item: CompanyMemoryItem = {
      id: `mem-${Date.now()}`,
      category,
      key,
      content,
      updatedAt: new Date().toISOString(),
    };
    this.db.company_memory.unshift(item);
    this.persist();
    return item;
  }

  // Audit Logs
  public getAuditLogs(limit: number = 50): AuditLog[] {
    return (this.db.audit_logs || []).slice(0, limit);
  }

  public logAudit(actor: AuditLog['actor'], action: string, details?: any, requiresApproval: boolean = false): AuditLog {
    if (!this.db.audit_logs) this.db.audit_logs = [];
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      timestamp: new Date().toISOString(),
      actor,
      action,
      details: typeof details === 'string' ? details : JSON.stringify(details),
      requiresApproval,
      approvalStatus: requiresApproval ? 'pending' : undefined,
    };
    this.db.audit_logs.unshift(log);
    // Keep max 200 logs
    if (this.db.audit_logs.length > 200) this.db.audit_logs.pop();
    this.persist();
    return log;
  }

  public getAchievements(): Achievement[] {
    return this.db.achievements;
  }

  private checkAchievements() {
    const cumulative = this.db.revenue.reduce((acc, r) => acc + (Number(r.amount) || 0), 0);
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const currentMonthRev = this.db.revenue
      .filter((r) => {
        const d = new Date(r.paymentDate);
        return d.getFullYear() === curYear && d.getMonth() === curMonth;
      })
      .reduce((acc, r) => acc + (Number(r.amount) || 0), 0);

    const unlock = (code: string) => {
      const ach = this.db.achievements.find((a) => a.code === code);
      if (ach && !ach.unlocked) {
        ach.unlocked = true;
        ach.unlockedAt = new Date().toISOString();
        const damo = this.db.users.find((u) => u.id === 'damo');
        if (damo) damo.xp += ach.xpReward;
      }
    };

    if (currentMonthRev >= 50000) unlock('HALF_CENTURY');
    if (currentMonthRev >= 100000) unlock('LAKH_BOSS');
    if (cumulative >= 10000000) unlock('CRORE_CLUB');
    if (cumulative >= 1000000000) unlock('ONE_BILLION_CONQUEST');
    if (this.db.company.streakDays >= 4) unlock('STREAK_4');
  }

  // ==================== PENDING ACTIONS & APPROVAL GATE ====================

  public proposeAction(actionData: {
    tool: string;
    params: any;
    explanation?: string;
    risk?: string;
    proposedBy?: 'ai_coo' | 'damo' | 'partner' | 'assistant';
    expiresInHours?: number;
  }): PendingAction {
    const { tool, params } = actionData;
    if (!VALIDATION_RULES.MUTATING_TOOLS.includes(tool as any)) {
      throw new Error(`Validation Error: Tool '${tool}' is not an authorized mutating tool. Allowed: ${VALIDATION_RULES.MUTATING_TOOLS.join(', ')}`);
    }

    // Pre-validate tool params
    if (tool === 'create_task') {
      if (!params?.title || typeof params.title !== 'string') {
        throw new Error('Validation Error: create_task requires a title string.');
      }
      if (params.ownerId && !VALIDATION_RULES.OWNER_IDS.includes(params.ownerId)) {
        throw new Error(`Validation Error: create_task ownerId must be one of: ${VALIDATION_RULES.OWNER_IDS.join(', ')}`);
      }
    } else if (tool === 'create_lead') {
      if (!params?.businessName || typeof params.businessName !== 'string') {
        throw new Error('Validation Error: create_lead requires a businessName string.');
      }
    } else if (tool === 'create_idea') {
      if (!params?.title || !params?.problem) {
        throw new Error('Validation Error: create_idea requires title and problem.');
      }
    } else if (tool === 'create_experiment') {
      if (!params?.title || !params?.hypothesis) {
        throw new Error('Validation Error: create_experiment requires title and hypothesis.');
      }
    } else if (tool === 'create_strategic_decision') {
      if (!params?.title || !params?.rationale) {
        throw new Error('Validation Error: create_strategic_decision requires title and rationale.');
      }
    } else if (tool === 'adapt_task_difficulty') {
      if (!params?.taskId || !params?.newTargetTitle) {
        throw new Error('Validation Error: adapt_task_difficulty requires taskId and newTargetTitle.');
      }
    } else if (tool === 'complete_task') {
      if (!params?.taskId) {
        throw new Error('Validation Error: complete_task requires taskId.');
      }
    } else if (tool === 'update_lead_stage') {
      if (!params?.leadId || !params?.status) {
        throw new Error('Validation Error: update_lead_stage requires leadId and status.');
      }
    }

    const proposedBy = actionData.proposedBy || 'ai_coo';
    const isSensitive =
      tool === 'create_strategic_decision' ||
      (tool === 'create_task' && (params.priority === 'critical' || (params.revenueRelation || 0) >= 50000));

    const pendingAction: PendingAction = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      tool,
      params: JSON.parse(JSON.stringify(params || {})), // Deep clone snapshot
      explanation: actionData.explanation || `COO proposes executing [${tool}]: ${params.title || params.businessName || 'operational action'}`,
      risk: actionData.risk || (isSensitive ? 'Strategic shift: requires explicit founder review.' : 'Operational mutation.'),
      proposedBy,
      proposedAt: new Date().toISOString(),
      status: 'pending',
      expiresAt: new Date(Date.now() + (actionData.expiresInHours || 48) * 3600000).toISOString(),
    };

    if (!this.db.pending_actions) this.db.pending_actions = [];
    this.db.pending_actions.unshift(pendingAction);

    this.logAudit(proposedBy, `PROPOSE_ACTION_${tool.toUpperCase()}`, {
      actionId: pendingAction.id,
      tool,
      params: pendingAction.params,
    }, true);

    this.persist();
    return pendingAction;
  }

  public getPendingActions(statusFilter?: ActionStatus): PendingAction[] {
    if (!this.db.pending_actions) this.db.pending_actions = [];
    const now = new Date();

    // Auto-expire outdated pending actions
    for (const act of this.db.pending_actions) {
      if (act.status === 'pending' && act.expiresAt && new Date(act.expiresAt) < now) {
        act.status = 'expired';
      }
    }

    if (statusFilter) {
      return this.db.pending_actions.filter((a) => a.status === statusFilter);
    }
    return this.db.pending_actions;
  }

  public getPendingActionById(id: string): PendingAction | null {
    if (!this.db.pending_actions) this.db.pending_actions = [];
    const act = this.db.pending_actions.find((a) => a.id === id);
    if (!act) return null;
    if (act.status === 'pending' && act.expiresAt && new Date(act.expiresAt) < new Date()) {
      act.status = 'expired';
    }
    return act;
  }

  public approveAction(id: string, actor: string = 'damo'): PendingAction {
    const act = this.getPendingActionById(id);
    if (!act) throw new Error(`Pending action with ID '${id}' not found.`);

    if (actor !== 'damo') {
      throw new Error(`Founder Authorization Required: Only Damo can approve pending actions (received: '${actor}').`);
    }

    if (act.status === 'expired') {
      throw new Error(`Cannot approve action '${id}': action has expired.`);
    }

    if (act.status !== 'pending') {
      throw new Error(`Cannot approve action '${id}': current status is '${act.status}' (expected 'pending').`);
    }

    act.status = 'approved';
    act.approvedBy = 'damo';
    act.approvedAt = new Date().toISOString();

    this.logAudit('damo', 'APPROVE_ACTION', {
      actionId: act.id,
      tool: act.tool,
    });

    this.persist();
    return act;
  }

  public rejectAction(id: string, actor: string = 'damo', reason?: string): PendingAction {
    const act = this.getPendingActionById(id);
    if (!act) throw new Error(`Pending action with ID '${id}' not found.`);

    if (actor !== 'damo') {
      throw new Error(`Founder Authorization Required: Only Damo can reject pending actions.`);
    }

    if (act.status === 'executed') {
      throw new Error(`Cannot reject action '${id}': action has already been executed.`);
    }

    act.status = 'rejected';
    act.rejectedBy = 'damo';
    act.rejectedAt = new Date().toISOString();
    if (reason) act.rejectionReason = reason;

    this.logAudit('damo', 'REJECT_ACTION', {
      actionId: act.id,
      tool: act.tool,
      reason,
    });

    this.persist();
    return act;
  }

  public executeApprovedAction(
    id: string,
    actor: string = 'damo',
    clientParams?: any
  ): { action: PendingAction; result: any } {
    const act = this.getPendingActionById(id);
    if (!act) throw new Error(`Action with ID '${id}' not found.`);

    if (act.status === 'executed') {
      throw new Error(`Replay Attack Prevented: Action '${id}' has already been executed.`);
    }

    if (act.status === 'pending') {
      throw new Error(`Execution Blocked: Action '${id}' is pending and requires founder approval before execution.`);
    }

    if (act.status === 'rejected') {
      throw new Error(`Execution Blocked: Action '${id}' was rejected.`);
    }

    if (act.status === 'expired') {
      throw new Error(`Execution Blocked: Action '${id}' has expired.`);
    }

    if (act.status !== 'approved') {
      throw new Error(`Cannot execute action with status '${act.status}'.`);
    }

    if (act.approvedBy !== 'damo') {
      throw new Error(`Execution Blocked: Action '${id}' lacks authentic founder approval by Damo.`);
    }

    if (!VALIDATION_RULES.MUTATING_TOOLS.includes(act.tool as any)) {
      throw new Error(`Security Violation: Tool '${act.tool}' is not in the approved mutating tool allowlist.`);
    }

    // Tamper detection: if client provides params, they must match the approved params
    if (clientParams !== undefined && clientParams !== null) {
      const approvedStr = JSON.stringify(act.params);
      const clientStr = JSON.stringify(clientParams);
      if (approvedStr !== clientStr) {
        throw new Error('Parameter Tamper Detected: submitted parameters do not match approved action parameters.');
      }
    }

    // Execute through strict internal handlers using the approved params
    let result: any = null;
    const params = act.params;

    if (act.tool === 'create_task') {
      result = this.createTask(params, 'damo');
    } else if (act.tool === 'adapt_task_difficulty') {
      result = this.adaptTask(params.taskId, params.newTargetTitle, params.newXp || 60, 'damo');
    } else if (act.tool === 'create_lead') {
      result = this.createLead(params, 'damo');
    } else if (act.tool === 'create_idea') {
      result = this.createIdea(params, 'damo');
    } else if (act.tool === 'create_experiment') {
      result = this.createExperiment(params, 'damo');
    } else if (act.tool === 'create_strategic_decision') {
      result = this.createDecision(
        {
          title: params.title,
          rationale: params.rationale,
          expectedOutcome: params.expectedOutcome,
          riskAssessment: {
            revenueImpact: params.revenueImpact || 'Moderate impact',
            customerRisk: params.customerRisk || 'Standard',
            teamCapacity: params.teamCapacity || 'Standard shift',
            recommendedPilotDays: params.recommendedPilotDays || 14,
          },
        },
        'damo'
      );
    } else if (act.tool === 'complete_task') {
      result = this.completeTask(params.taskId, params.resultNote, 'damo');
    } else if (act.tool === 'update_lead_stage') {
      result = this.updateLeadStage(params.leadId, params.status, params.notes, 'damo');
    } else {
      throw new Error(`Unknown mutating tool: ${act.tool}`);
    }

    act.status = 'executed';
    act.executedAt = new Date().toISOString();
    act.executedBy = actor || 'damo';
    act.resultId = result?.id;

    this.logAudit(actor as any || 'damo', 'EXECUTE_APPROVED_ACTION', {
      actionId: act.id,
      tool: act.tool,
      resultId: result?.id,
    });

    this.persist();
    return { action: act, result };
  }

  public resetToCleanData(): CompanyStatus {
    this.db = {
      schemaVersion: 2,
      company: {
        name: 'Uplora',
        questTarget: 1000000000,
        monthlyTarget: 100000,
        currentRunRate: 0,
        streakDays: 0,
      },
      users: INITIAL_BENCHMARK.users.map((u) => ({ ...u, xp: 0, level: 1, streak: 0, dailyCompleted: 0 })),
      tasks: [],
      leads: [],
      revenue: [],
      checkins: [],
      ideas: [],
      experiments: [],
      decisions: [],
      opportunities: [],
      company_memory: INITIAL_BENCHMARK.company_memory,
      achievements: INITIAL_BENCHMARK.achievements.map((a) => ({ ...a, unlocked: false, unlockedAt: undefined })),
      audit_logs: [
        {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          actor: 'damo',
          action: 'CLEAN_DATA_INITIALIZATION',
          details: 'Company data reset to clean slate (zero benchmark revenue).',
        },
      ],
      pending_actions: [],
    };
    this.persist();
    return this.getCompanyStatus();
  }

  public exportBackup() {
    return JSON.stringify(this.db, null, 2);
  }

  public importBackup(rawJson: string) {
    const parsed = JSON.parse(rawJson);
    if (!parsed.company || !parsed.users || !parsed.tasks) {
      throw new Error('Invalid Uplora database format: missing core collections.');
    }
    this.db = parsed;
    this.persist();
    return true;
  }

  public resetToBenchmark() {
    this.db = JSON.parse(JSON.stringify(INITIAL_BENCHMARK));
    this.persist();
    return this.getCompanyStatus();
  }

  public getRawData(): DatabaseSchema {
    return this.db;
  }
}

export const db = new LocalDatabase();
