import fs from 'fs';
import path from 'path';
import {
  User,
  Task,
  Lead,
  RevenueEntry,
  DailyCheckin,
  Idea,
  StrategicDecision,
  MarketOpportunity,
  CompanyStatus,
  Achievement,
} from '../src/types/index.js';

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'uplora_db.json');

export interface DatabaseSchema {
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
  decisions: StrategicDecision[];
  opportunities: MarketOpportunity[];
  achievements: Achievement[];
  logs: { timestamp: string; action: string; details?: any }[];
}

const INITIAL_BENCHMARK: DatabaseSchema = {
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
      nextFollowupDate: '2026-10-05',
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
    },
    {
      id: 'rev-2',
      clientName: 'Apex Logistics Coimbatore',
      serviceType: 'website',
      amount: 12000,
      paymentDate: '2026-09-24',
      notes: 'Full payment for logistics tracking landing page.',
      xpAwarded: 120,
    },
    {
      id: 'rev-3',
      clientName: 'Sri Balaji Bakery & Sweets',
      serviceType: 'whatsapp_automation',
      amount: 8500,
      paymentDate: '2026-09-18',
      notes: 'Festival sweet pre-booking WhatsApp automation bot.',
      xpAwarded: 85,
    },
    {
      id: 'rev-4',
      clientName: 'Studio Aura Photography',
      serviceType: 'website',
      amount: 15000,
      paymentDate: '2026-09-08',
      notes: 'Portfolio website + wedding package booking engine.',
      xpAwarded: 150,
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
  logs: [
    { timestamp: new Date().toISOString(), action: 'INITIAL_BOOTSTRAP', details: 'Database initialized with Uplora seed benchmark.' }
  ],
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
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.db = JSON.parse(raw);
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
      fs.writeFileSync(DB_FILE, JSON.stringify(this.db, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to persist database:', e);
    }
  }

  public getCompanyStatus(): CompanyStatus {
    const cumulativeRev = this.db.revenue.reduce((acc, r) => acc + r.amount, 0);
    
    // Calculate current month's revenue (current year & month)
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const currentMonthRev = this.db.revenue
      .filter((r) => {
        const d = new Date(r.paymentDate);
        return d.getFullYear() === curYear && d.getMonth() === curMonth;
      })
      .reduce((acc, r) => acc + r.amount, 0);

    const totalXp = this.db.users.reduce((acc, u) => acc + u.xp, 0);
    const overallLevel = Math.max(1, Math.floor(totalXp / 1000) + 1);

    const activeLeads = this.db.leads.filter((l) => l.status !== 'lost');
    const pipelineVal = this.db.leads
      .filter((l) => !['won', 'lost'].includes(l.status))
      .reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

    // Health score calculations
    const revScore = Math.min(100, Math.round((currentMonthRev / (this.db.company.monthlyTarget || 100000)) * 100));
    const leadsContacted = this.db.leads.filter((l) => l.status !== 'prospect').length;
    const leadsWon = this.db.leads.filter((l) => l.status === 'won').length;
    const salesScore = leadsContacted > 0 ? Math.min(100, Math.round((leadsWon / leadsContacted) * 100 * 2)) : 45;
    const deliveryScore = 80;
    const leadGenScore = Math.min(100, Math.round((this.db.leads.length / 10) * 50));
    const productScore = 40;
    const marketingScore = 48;
    const teamScore = 70;
    const composite = Math.round(
      revScore * 0.25 + salesScore * 0.2 + deliveryScore * 0.15 + leadGenScore * 0.15 + productScore * 0.1 + marketingScore * 0.05 + teamScore * 0.1
    );

    // Bottleneck diagnosis
    let primaryBottleneck = 'Sales Conversion Velocity';
    let aiPrescription = 'You have prospects in the pipeline but need to close ₹60k to reach the ₹1L monthly boss target. Focus Damo on closing calls rather than research.';
    if (salesScore < 40) {
      primaryBottleneck = 'Lead-to-Proposal Conversion';
      aiPrescription = 'Follow-up cycle is too slow. Follow up within 48 hours with existing proposals.';
    } else if (revScore < 30) {
      primaryBottleneck = 'Cash Generation Shortfall';
      aiPrescription = 'Double down on closing 2 quick website projects at ₹10k each to stabilize the month.';
    }

    // Dynamic ETA calculations
    const questTarget = this.db.company.questTarget || 1000000000;
    const remaining = Math.max(0, questTarget - cumulativeRev);
    const avgMonthly = Math.max(40000, cumulativeRev / 2 || 40000);

    const worstMonths = Math.ceil(remaining / avgMonthly);
    // Base case: 12% compound monthly growth
    const baseMonths = Math.min(240, Math.ceil(Math.log(1 + (remaining * 0.12) / avgMonthly) / Math.log(1.12)) || 96);
    // Best case: 25% compound monthly growth with StoreIK scaling
    const bestMonths = Math.min(120, Math.ceil(Math.log(1 + (remaining * 0.25) / avgMonthly) / Math.log(1.25)) || 48);

    const worstDate = new Date();
    worstDate.setMonth(worstDate.getMonth() + Math.min(600, worstMonths));

    const baseDate = new Date();
    baseDate.setMonth(baseDate.getMonth() + baseMonths);

    const bestDate = new Date();
    bestDate.setMonth(bestDate.getMonth() + bestMonths);

    return {
      name: this.db.company.name,
      questTarget,
      monthlyTarget: this.db.company.monthlyTarget,
      currentMonthlyRevenue: currentMonthRev,
      cumulativeRevenue: cumulativeRev,
      runRateEstimate: this.db.company.currentRunRate,
      overallXp: totalXp,
      level: overallLevel,
      streakDays: this.db.company.streakDays,
      activeLeadsCount: activeLeads.length,
      pipelineValue: pipelineVal,
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
        confidence: this.db.revenue.length < 8 ? 'low' : 'medium',
      },
    };
  }

  public updateCompanyTarget(questTarget?: number, monthlyTarget?: number) {
    if (questTarget !== undefined) this.db.company.questTarget = questTarget;
    if (monthlyTarget !== undefined) this.db.company.monthlyTarget = monthlyTarget;
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

  public createTask(task: Partial<Task>): Task {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: task.title || 'Untitled Mission',
      description: task.description || '',
      ownerId: task.ownerId || 'damo',
      layer: task.layer || 'daily',
      category: task.category || 'sales',
      priority: task.priority || 'medium',
      difficulty: task.difficulty || 'medium',
      xpReward: task.xpReward || 50,
      status: 'pending',
      dueDate: task.dueDate || new Date().toISOString().split('T')[0],
      relatedRevenueTarget: task.relatedRevenueTarget,
    };
    this.db.tasks.unshift(newTask);
    this.persist();
    return newTask;
  }

  public completeTask(taskId: string): { task: Task; xpAwarded: number; newXp: number; level: number } {
    const task = this.db.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.status = 'completed';
    task.completedAt = new Date().toISOString();

    // Award XP to owner
    const user = this.db.users.find((u) => u.id === task.ownerId);
    if (user) {
      user.xp += task.xpReward;
      user.level = Math.max(1, Math.floor(user.xp / 1000) + 1);
      user.dailyCompleted = (user.dailyCompleted || 0) + 1;
    }

    this.checkAchievements();
    this.persist();

    return {
      task,
      xpAwarded: task.xpReward,
      newXp: user ? user.xp : 0,
      level: user ? user.level : 1,
    };
  }

  public missTask(taskId: string, reason: string, notes?: string): { task: Task; needsAdaptation: boolean; suggestion?: string } {
    const task = this.db.tasks.find((t) => t.id === taskId);
    if (!task) throw new Error('Task not found');
    task.status = 'missed';
    task.missedReason = reason;
    task.missedNotes = notes;

    // Check recent missed tasks for this owner to see if adaptive difficulty should trigger
    const userMissed = this.db.tasks.filter((t) => t.ownerId === task.ownerId && t.status === 'missed');
    const needsAdaptation = userMissed.length >= 2;
    let suggestion: string | undefined = undefined;

    if (needsAdaptation) {
      if (reason.toLowerCase().includes('time')) {
        suggestion = 'Cap research and admin work to 45 min in the morning; shift sales calls to 11am-1pm.';
      } else if (reason.toLowerCase().includes('lead') || reason.toLowerCase().includes('reach')) {
        suggestion = 'Step down call target from 15 to 8 qualified conversations for the next 3 days.';
      } else {
        suggestion = 'Convert target to a 3-day sprint: 10 calls/day before returning to 15.';
      }
    }

    this.persist();
    return { task, needsAdaptation, suggestion };
  }

  public adaptTask(taskId: string, newTitle: string, newXp: number): Task {
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
    };
    this.db.tasks.unshift(adaptedTask);
    this.persist();
    return adaptedTask;
  }

  public getLeads(): Lead[] {
    return this.db.leads;
  }

  public createLead(lead: Partial<Lead>): Lead {
    const newLead: Lead = {
      id: `lead-${Date.now()}`,
      businessName: lead.businessName || 'Unnamed Lead',
      contactName: lead.contactName || '',
      phone: lead.phone || '',
      whatsapp: lead.whatsapp || (lead.phone ? lead.phone.replace(/[^0-9]/g, '') : ''),
      instagram: lead.instagram,
      website: lead.website,
      city: lead.city || 'Tamil Nadu',
      category: lead.category || 'Retail',
      problemIdentified: lead.problemIdentified || 'Lacks professional mobile storefront.',
      proposedSolution: lead.proposedSolution || 'Uplora Website + WhatsApp Catalog.',
      estimatedValue: lead.estimatedValue || 8000,
      leadSource: lead.leadSource || 'Instagram',
      assignedTo: lead.assignedTo || 'damo',
      status: lead.status || 'prospect',
      notes: lead.notes || '',
      createdAt: new Date().toISOString(),
    };
    this.db.leads.unshift(newLead);

    // Award 5 XP for qualified lead to creator
    const creator = this.db.users.find((u) => u.id === newLead.assignedTo) || this.db.users[0];
    if (creator) {
      creator.xp += 5;
    }

    this.persist();
    return newLead;
  }

  public updateLeadStage(id: string, status: Lead['status'], notes?: string): Lead {
    const lead = this.db.leads.find((l) => l.id === id);
    if (!lead) throw new Error('Lead not found');
    lead.status = status;
    lead.lastContactDate = new Date().toISOString().split('T')[0];
    if (notes) lead.notes = `${lead.notes ? lead.notes + '\n' : ''}[${lead.lastContactDate}]: ${notes}`;

    if (status === 'won') {
      const owner = this.db.users.find((u) => u.id === lead.assignedTo);
      if (owner) {
        owner.xp += 250; // Won deal bonus!
      }
    }

    this.checkAchievements();
    this.persist();
    return lead;
  }

  public deleteLead(id: string): boolean {
    const idx = this.db.leads.findIndex((l) => l.id === id);
    if (idx !== -1) {
      this.db.leads.splice(idx, 1);
      this.persist();
      return true;
    }
    return false;
  }

  public getRevenue(): RevenueEntry[] {
    return this.db.revenue;
  }

  public addRevenue(entry: Partial<RevenueEntry>): { entry: RevenueEntry; xpAwarded: number } {
    const amount = Number(entry.amount) || 0;
    const xp = Math.max(10, Math.floor(amount / 100)); // 1 XP per ₹100
    const newEntry: RevenueEntry = {
      id: `rev-${Date.now()}`,
      clientName: entry.clientName || 'Private Client',
      serviceType: entry.serviceType || 'website',
      amount,
      paymentDate: entry.paymentDate || new Date().toISOString().split('T')[0],
      notes: entry.notes || '',
      xpAwarded: xp,
    };
    this.db.revenue.unshift(newEntry);

    // Distribute XP to Damo (CEO)
    const damo = this.db.users.find((u) => u.id === 'damo');
    if (damo) {
      damo.xp += xp;
      damo.level = Math.max(1, Math.floor(damo.xp / 1000) + 1);
    }

    this.checkAchievements();
    this.persist();
    return { entry: newEntry, xpAwarded: xp };
  }

  public getCheckins(): DailyCheckin[] {
    return this.db.checkins;
  }

  public addCheckin(chk: Partial<DailyCheckin>): DailyCheckin {
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
      revenueLogged: chk.revenueLogged || 0,
      tomorrowFocus: chk.tomorrowFocus || '',
      createdAt: new Date().toISOString(),
    };
    this.db.checkins.unshift(newChk);

    // Increment streak
    this.db.company.streakDays += 1;
    const user = this.db.users.find((u) => u.id === newChk.userId);
    if (user) {
      user.streak += 1;
      user.xp += 25; // 25 XP for completing check-in
    }

    this.checkAchievements();
    this.persist();
    return newChk;
  }

  public getIdeas(): Idea[] {
    return this.db.ideas;
  }

  public createIdea(idea: Partial<Idea>): Idea {
    const newIdea: Idea = {
      id: `idea-${Date.now()}`,
      title: idea.title || 'Untitled Idea',
      problem: idea.problem || '',
      targetCustomer: idea.targetCustomer || '',
      proposedSolution: idea.proposedSolution || '',
      potentialRevenue: idea.potentialRevenue || 50000,
      difficulty: idea.difficulty || 'medium',
      costEstimate: idea.costEstimate || 5000,
      status: 'quarantine',
      quarantineDaysRemaining: 7,
      validationMethod: idea.validationMethod || '7-day pre-order / customer interviews',
      createdAt: new Date().toISOString(),
    };
    this.db.ideas.unshift(newIdea);
    this.persist();
    return newIdea;
  }

  public updateIdeaStatus(id: string, status: Idea['status']): Idea {
    const idea = this.db.ideas.find((i) => i.id === id);
    if (!idea) throw new Error('Idea not found');
    idea.status = status;
    this.persist();
    return idea;
  }

  public getDecisions(): StrategicDecision[] {
    return this.db.decisions;
  }

  public createDecision(decision: Partial<StrategicDecision>): StrategicDecision {
    const newDecision: StrategicDecision = {
      id: `dec-${Date.now()}`,
      title: decision.title || 'Strategic Policy Shift',
      rationale: decision.rationale || '',
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
    this.persist();
    return newDecision;
  }

  public updateDecisionStatus(id: string, status: StrategicDecision['status'], outcomeNote?: string): StrategicDecision {
    const dec = this.db.decisions.find((d) => d.id === id);
    if (!dec) throw new Error('Decision not found');
    dec.status = status;
    if (outcomeNote) dec.actualOutcome = outcomeNote;
    this.persist();
    return dec;
  }

  public getOpportunities(): MarketOpportunity[] {
    return this.db.opportunities;
  }

  public addOpportunities(opps: MarketOpportunity[]) {
    this.db.opportunities.unshift(...opps);
    this.persist();
    return this.db.opportunities;
  }

  public updateOpportunityStatus(id: string, status: MarketOpportunity['status']) {
    const opp = this.db.opportunities.find((o) => o.id === id);
    if (!opp) throw new Error('Opportunity not found');
    opp.status = status;
    this.persist();
    return opp;
  }

  public getAchievements(): Achievement[] {
    return this.db.achievements;
  }

  private checkAchievements() {
    const cumulative = this.db.revenue.reduce((acc, r) => acc + r.amount, 0);
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth();
    const currentMonthRev = this.db.revenue
      .filter((r) => {
        const d = new Date(r.paymentDate);
        return d.getFullYear() === curYear && d.getMonth() === curMonth;
      })
      .reduce((acc, r) => acc + r.amount, 0);

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

  public exportBackup() {
    return JSON.stringify(this.db, null, 2);
  }

  public importBackup(rawJson: string) {
    const parsed = JSON.parse(rawJson);
    if (!parsed.company || !parsed.users || !parsed.tasks) {
      throw new Error('Invalid Uplora database format');
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
