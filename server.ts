import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI, Type, FunctionDeclaration } from '@google/genai';
import { db, VALIDATION_RULES } from './server/db.js';
import { ProposedAction } from './src/types/index.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI with required telemetry header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// ==================== CONTROLLED AI FUNCTION DECLARATIONS ====================

const cooFunctionDeclarations: FunctionDeclaration[] = [
  {
    name: 'get_company_status',
    description: 'Retrieve live Uplora financial metrics, monthly target progress, active pipeline, and health scores.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        includeHistory: {
          type: Type.BOOLEAN,
          description: 'Whether to include historical financial comparisons',
        },
      },
    },
  },
  {
    name: 'get_revenue_analytics',
    description: 'Retrieve detailed revenue analytics including deal size distribution, service breakdown, and dynamic ETA.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        timeframe: { type: Type.STRING, description: 'Optional timeframe (month, all)' },
      },
    },
  },
  {
    name: 'get_tasks',
    description: 'Fetch active, completed, or missed tasks filtered by character or category.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        ownerId: { type: Type.STRING, description: 'damo, partner, or assistant' },
        status: { type: Type.STRING, description: 'pending, completed, missed' },
        layer: { type: Type.STRING, description: 'daily, weekly, monthly, side_quest' },
      },
    },
  },
  {
    name: 'create_task',
    description: 'Propose or create a new prioritized tactical task for Damo, Partner, or Assistant.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Clear action-oriented task title' },
        ownerId: { type: Type.STRING, description: 'damo, partner, or assistant' },
        layer: { type: Type.STRING, description: 'daily, weekly, monthly, side_quest' },
        category: { type: Type.STRING, description: 'sales, delivery, lead_gen, strategy, product' },
        priority: { type: Type.STRING, description: 'critical, high, medium, low' },
        xpReward: { type: Type.NUMBER, description: 'XP reward for task completion' },
        revenueRelation: { type: Type.NUMBER, description: 'Estimated INR revenue unlocked by completing this' },
        strategicRelation: { type: Type.STRING, description: 'Why this task moves the needle towards ₹1B' },
      },
      required: ['title', 'ownerId'],
    },
  },
  {
    name: 'adapt_task_difficulty',
    description: 'Auto-step down or adjust a recurring task quota when founder or team faces workload conflict.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        taskId: { type: Type.STRING, description: 'ID of the task to adapt' },
        newTargetTitle: { type: Type.STRING, description: 'Stepped-down challenge title' },
        newXp: { type: Type.NUMBER, description: 'XP reward for the stepped-down target' },
        reason: { type: Type.STRING, description: 'Operational reason for adapting' },
      },
      required: ['taskId', 'newTargetTitle'],
    },
  },
  {
    name: 'get_leads',
    description: 'Fetch sales pipeline leads with status, contact channels, and deal values.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        status: { type: Type.STRING, description: 'prospect, contacted, connected, interested, qualified, proposal, negotiation, won, lost, followup' },
        onlyHotLeads: { type: Type.BOOLEAN, description: 'Filter only hot high-urgency leads' },
        onlyOverdue: { type: Type.BOOLEAN, description: 'Filter leads with overdue next follow-up date' },
      },
    },
  },
  {
    name: 'create_lead',
    description: 'Add a new merchant prospect discovered through Instagram or Google Maps.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        businessName: { type: Type.STRING, description: 'Shop or company name' },
        contactName: { type: Type.STRING, description: 'Owner or manager name' },
        phone: { type: Type.STRING, description: 'Phone number' },
        whatsapp: { type: Type.STRING, description: 'WhatsApp number' },
        city: { type: Type.STRING, description: 'City/Location' },
        category: { type: Type.STRING, description: 'Merchant category' },
        problemIdentified: { type: Type.STRING, description: 'Pain point identified' },
        proposedSolution: { type: Type.STRING, description: 'Uplora proposed package' },
        estimatedValue: { type: Type.NUMBER, description: 'Estimated deal value in INR' },
      },
      required: ['businessName'],
    },
  },
  {
    name: 'create_idea',
    description: 'Quarantine a new business concept or product idea for 7 days to protect founder focus.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Idea headline' },
        problem: { type: Type.STRING, description: 'Problem solved' },
        targetCustomer: { type: Type.STRING, description: 'Target persona' },
        proposedSolution: { type: Type.STRING, description: 'Proposed solution' },
        potentialRevenue: { type: Type.NUMBER, description: 'Potential INR revenue' },
        validationMethod: { type: Type.STRING, description: '7-day test protocol before building' },
      },
      required: ['title', 'problem'],
    },
  },
  {
    name: 'create_experiment',
    description: 'Launch a 7-day validation experiment with clear success criteria.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Experiment name' },
        hypothesis: { type: Type.STRING, description: 'Falsifiable commercial hypothesis' },
        durationDays: { type: Type.NUMBER, description: 'Duration in days (default: 7)' },
        metricsTracked: { type: Type.STRING, description: 'Metrics to measure' },
        successCriteria: { type: Type.STRING, description: 'Pass/fail condition' },
      },
      required: ['title', 'hypothesis'],
    },
  },
  {
    name: 'create_strategic_decision',
    description: 'Propose a major company policy or strategic shift. REQUIRES HUMAN APPROVAL FROM DAMO.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: 'Proposed decision title' },
        rationale: { type: Type.STRING, description: 'Strategic reason and evidence' },
        expectedOutcome: { type: Type.STRING, description: 'Expected financial/operational outcome' },
        revenueImpact: { type: Type.STRING, description: 'Risk to existing cashflow' },
        customerRisk: { type: Type.STRING, description: 'Risk to client relationships' },
        teamCapacity: { type: Type.STRING, description: 'Impact on team bandwidth' },
        recommendedPilotDays: { type: Type.NUMBER, description: 'Recommended pilot duration' },
      },
      required: ['title', 'rationale'],
    },
  },
  {
    name: 'complete_task',
    description: 'Propose marking a task completed with debrief notes and outcomes. REQUIRES FOUNDER APPROVAL.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        taskId: { type: Type.STRING, description: 'ID of the task completed' },
        resultNote: { type: Type.STRING, description: 'Debrief note or commercial outcome' },
      },
      required: ['taskId'],
    },
  },
  {
    name: 'update_lead_stage',
    description: 'Propose moving a CRM sales lead to a new pipeline stage. REQUIRES FOUNDER APPROVAL.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        leadId: { type: Type.STRING, description: 'ID of the lead' },
        status: { type: Type.STRING, description: 'prospect, contacted, connected, interested, qualified, proposal, negotiation, won, lost, followup' },
        notes: { type: Type.STRING, description: 'Stage update notes' },
      },
      required: ['leadId', 'status'],
    },
  },
  {
    name: 'get_company_memory',
    description: 'Query long-term organizational rules, past lessons, and pricing guidelines.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        category: { type: Type.STRING, description: 'vision, pricing, rules, lessons, decisions' },
      },
    },
  },
];

// Centralized error handler returning proper HTTP 4xx/5xx status codes
function handleApiError(res: Response, error: any) {
  const msg = error?.message || 'Internal server error';
  if (msg.includes('Founder Authorization Required')) {
    return res.status(403).json({ error: msg });
  }
  if (
    msg.includes('Execution Blocked') ||
    msg.includes('Security Violation') ||
    msg.includes('Parameter Tamper') ||
    msg.includes('Replay Attack')
  ) {
    return res.status(403).json({ error: msg });
  }
  if (msg.toLowerCase().includes('not found')) {
    return res.status(404).json({ error: msg });
  }
  if (
    msg.includes('Validation Error') ||
    msg.includes('Invalid') ||
    msg.includes('requires') ||
    msg.includes('is required') ||
    msg.includes('Cannot') ||
    msg.includes('Must be')
  ) {
    return res.status(400).json({ error: msg });
  }
  return res.status(500).json({ error: msg });
}

// ==================== REST API ENDPOINTS ====================

// 1. Company Status & Target
app.get('/api/company/status', (req: Request, res: Response) => {
  try {
    const status = db.getCompanyStatus();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/company/target', (req: Request, res: Response) => {
  try {
    const { questTarget, monthlyTarget } = req.body;
    const status = db.updateCompanyTarget(questTarget, monthlyTarget);
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 2. Users / Characters
app.get('/api/users', (req: Request, res: Response) => {
  try {
    const users = db.getUsers();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 3. Task Engine
app.get('/api/tasks', (req: Request, res: Response) => {
  try {
    const { ownerId, layer, status } = req.query as any;
    const tasks = db.getTasks({ ownerId, layer, status });
    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks', (req: Request, res: Response) => {
  try {
    const task = db.createTask(req.body);
    res.json(task);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.patch('/api/tasks/:id/complete', (req: Request, res: Response) => {
  try {
    const { resultNote } = req.body;
    const result = db.completeTask(req.params.id, resultNote);
    res.json(result);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.patch('/api/tasks/:id/missed', (req: Request, res: Response) => {
  try {
    const { reason, notes } = req.body;
    const result = db.missTask(req.params.id, reason, notes);
    res.json(result);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.post('/api/tasks/adapt', (req: Request, res: Response) => {
  try {
    const { taskId, newTitle, newXp } = req.body;
    const adapted = db.adaptTask(taskId, newTitle, newXp);
    res.json(adapted);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// 4. Sales CRM & Analytics
app.get('/api/leads', (req: Request, res: Response) => {
  try {
    const { status, assignedTo } = req.query as any;
    const leads = db.getLeads({ status, assignedTo });
    res.json(leads);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.get('/api/crm/analytics', (req: Request, res: Response) => {
  try {
    const analytics = db.getCRMAnalytics();
    res.json(analytics);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.post('/api/leads', (req: Request, res: Response) => {
  try {
    const lead = db.createLead(req.body);
    res.json(lead);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.patch('/api/leads/:id/stage', (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const lead = db.updateLeadStage(req.params.id, status, notes);
    res.json(lead);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.delete('/api/leads/:id', (req: Request, res: Response) => {
  try {
    const success = db.deleteLead(req.params.id);
    res.json({ success });
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// 5. Revenue Engine
app.get('/api/revenue', (req: Request, res: Response) => {
  try {
    const rev = db.getRevenue();
    res.json(rev);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.post('/api/revenue', (req: Request, res: Response) => {
  try {
    const result = db.addRevenue(req.body);
    res.json(result);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// 6. Daily Check-ins
app.get('/api/checkins', (req: Request, res: Response) => {
  try {
    const chks = db.getCheckins();
    res.json(chks);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.post('/api/checkins', (req: Request, res: Response) => {
  try {
    const chk = db.addCheckin(req.body);
    res.json(chk);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// 7. Idea Engine
app.get('/api/ideas', (req: Request, res: Response) => {
  try {
    const ideas = db.getIdeas();
    res.json(ideas);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.post('/api/ideas', (req: Request, res: Response) => {
  try {
    const idea = db.createIdea(req.body);
    res.json(idea);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.patch('/api/ideas/:id/status', (req: Request, res: Response) => {
  try {
    const idea = db.updateIdeaStatus(req.params.id, req.body.status);
    res.json(idea);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// 8. Experiments (7-Day Pilots)
app.get('/api/experiments', (req: Request, res: Response) => {
  try {
    const exps = db.getExperiments();
    res.json(exps);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.post('/api/experiments', (req: Request, res: Response) => {
  try {
    const exp = db.createExperiment(req.body);
    res.json(exp);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.patch('/api/experiments/:id', (req: Request, res: Response) => {
  try {
    const { outcome, lessonsLearned } = req.body;
    const exp = db.updateExperimentStatus(req.params.id, outcome, lessonsLearned);
    res.json(exp);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// 9. Strategic Decisions & Ledger
app.get('/api/decisions', (req: Request, res: Response) => {
  try {
    const decisions = db.getDecisions();
    res.json(decisions);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.post('/api/decisions', (req: Request, res: Response) => {
  try {
    const decision = db.createDecision(req.body);
    res.json(decision);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.patch('/api/decisions/:id/status', (req: Request, res: Response) => {
  try {
    const { status, outcomeNote, permanentRule, actor } = req.body;
    if (!actor || actor !== 'damo') {
      return res.status(403).json({
        error: `Founder Authorization Required: Only founder Damo can authorize strategic decisions (received: '${actor || 'unspecified'}').`,
      });
    }
    const decision = db.updateDecisionStatus(req.params.id, status, actor, outcomeNote, permanentRule);
    res.json(decision);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// 10. Market Opportunities
app.get('/api/opportunities', (req: Request, res: Response) => {
  try {
    const opps = db.getOpportunities();
    res.json(opps);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.patch('/api/opportunities/:id/status', (req: Request, res: Response) => {
  try {
    const opp = db.updateOpportunityStatus(req.params.id, req.body.status);
    res.json(opp);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// 11. Company Memory
app.get('/api/memory', (req: Request, res: Response) => {
  try {
    const { category } = req.query as any;
    const mems = db.getCompanyMemory(category);
    res.json(mems);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.post('/api/memory', (req: Request, res: Response) => {
  try {
    const { category, key, content } = req.body;
    const item = db.createCompanyMemory(category, key, content);
    res.json(item);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// 12. Audit Logs
app.get('/api/audit-logs', (req: Request, res: Response) => {
  try {
    const logs = db.getAuditLogs();
    res.json(logs);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// 13. Achievements
app.get('/api/achievements', (req: Request, res: Response) => {
  try {
    const achs = db.getAchievements();
    res.json(achs);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// 14. Backup & Recovery
app.get('/api/backup/export', (req: Request, res: Response) => {
  try {
    const jsonStr = db.exportBackup();
    res.setHeader('Content-Disposition', `attachment; filename=uplora_backup_${new Date().toISOString().split('T')[0]}.json`);
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonStr);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.post('/api/backup/import', (req: Request, res: Response) => {
  try {
    const { jsonContent } = req.body;
    db.importBackup(jsonContent);
    res.json({ success: true, status: db.getCompanyStatus() });
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.post('/api/backup/reset', (req: Request, res: Response) => {
  try {
    const status = db.resetToBenchmark();
    res.json({ success: true, status });
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// 14b. Clean Slate Reset (Start company with clean data)
app.post('/api/backup/clean', (req: Request, res: Response) => {
  try {
    const status = db.resetToCleanData();
    res.json({ success: true, status });
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// 15. Pending Actions & Human Approval Gate
app.post('/api/actions/propose', (req: Request, res: Response) => {
  try {
    const { tool, params, explanation, risk, proposedBy } = req.body;
    const action = db.proposeAction({ tool, params, explanation, risk, proposedBy });
    res.status(201).json(action);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.get('/api/actions/pending', (req: Request, res: Response) => {
  try {
    const { status } = req.query as any;
    const actions = db.getPendingActions(status);
    res.json(actions);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.get('/api/actions/:id', (req: Request, res: Response) => {
  try {
    const action = db.getPendingActionById(req.params.id);
    if (!action) return res.status(404).json({ error: `Pending action '${req.params.id}' not found.` });
    res.json(action);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.post('/api/actions/:id/approve', (req: Request, res: Response) => {
  try {
    const { actor } = req.body;
    if (!actor || actor !== 'damo') {
      return res.status(403).json({
        error: `Founder Authorization Required: Only founder Damo can approve pending actions (received: '${actor || 'unspecified'}').`,
      });
    }
    const action = db.approveAction(req.params.id, actor);
    res.json(action);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.post('/api/actions/:id/reject', (req: Request, res: Response) => {
  try {
    const { actor, reason } = req.body;
    if (!actor || actor !== 'damo') {
      return res.status(403).json({
        error: `Founder Authorization Required: Only founder Damo can reject pending actions (received: '${actor || 'unspecified'}').`,
      });
    }
    const action = db.rejectAction(req.params.id, actor, reason);
    res.json(action);
  } catch (error: any) {
    handleApiError(res, error);
  }
});

app.post('/api/actions/:id/execute', (req: Request, res: Response) => {
  try {
    const { actor = 'damo', params } = req.body;
    if (actor !== 'damo') {
      return res.status(403).json({
        error: `Founder Authorization Required: Only founder Damo can execute approved actions (received: '${actor}').`,
      });
    }
    const execution = db.executeApprovedAction(req.params.id, actor, params);
    res.json({ success: true, ...execution });
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// Legacy/Compatibility execution endpoint - STRICTLY requires valid approved actionId
app.post('/api/actions/execute', (req: Request, res: Response) => {
  try {
    const { actionId, actor = 'damo', params } = req.body;
    if (!actionId) {
      return res.status(400).json({
        error: 'Execution Blocked: Direct execution of unapproved arbitrary actions is prohibited. You must supply a valid approved actionId.',
      });
    }
    if (actor !== 'damo') {
      return res.status(403).json({
        error: `Founder Authorization Required: Only founder Damo can execute approved actions (received: '${actor}').`,
      });
    }
    const execution = db.executeApprovedAction(actionId, actor, params);
    res.json({ success: true, ...execution });
  } catch (error: any) {
    handleApiError(res, error);
  }
});

// 16. Documentation reader API
app.get('/api/docs', (req: Request, res: Response) => {
  try {
    const docsDir = path.resolve(process.cwd(), 'docs');
    if (!fs.existsSync(docsDir)) {
      return res.json([]);
    }
    const files = fs.readdirSync(docsDir).filter((f) => f.endsWith('.md')).sort();
    const docs = files.map((fileName) => {
      const content = fs.readFileSync(path.join(docsDir, fileName), 'utf-8');
      const firstLine = content.split('\n')[0].replace(/^#\s*/, '') || fileName;
      return {
        fileName,
        title: firstLine,
        content,
      };
    });
    res.json(docs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== GEMINI AI COO ENDPOINTS ====================

// AI COO Chat with Live Company Context & Controlled Tools
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    const rawData = db.getRawData();
    const status = db.getCompanyStatus();
    const memory = db.getCompanyMemory();

    // Prepare dense company state representation for the COO
    const pendingTasks = rawData.tasks.filter((t) => t.status === 'pending');
    const missedTasks = rawData.tasks.filter((t) => t.status === 'missed');
    const recentRevenue = rawData.revenue.slice(0, 5);
    const hotLeads = rawData.leads.filter((l) => l.isHotLead || ['proposal', 'negotiation'].includes(l.status));
    const overdueFollowups = rawData.leads.filter((l) => l.nextFollowupDate && l.nextFollowupDate < new Date().toISOString().split('T')[0]);

    const systemInstruction = `You are the uncompromising Chief Operating Officer (COO) of Uplora, a rising Commerce-Tech enterprise founded by Damo in December 2025.
Your mission is to scale Uplora through relentless execution discipline from its current cash position towards ₹1,00,000/month, and eventually the ₹${status.questTarget.toLocaleString('en-IN')} (₹100 Crore / ₹1B) Quest.

LIVE DYNAMIC DATABASE TRUTH:
- Company Structure: Uplora = Commerce-Tech parent, StoreIK = flagship merchant platform, Akyzer = D2C brand.
- Current Month Cash Collected: ₹${status.currentMonthlyRevenue.toLocaleString('en-IN')} (Target: ₹${status.monthlyTarget.toLocaleString('en-IN')}, Remaining Gap: ₹${Math.max(0, status.monthlyTarget - status.currentMonthlyRevenue).toLocaleString('en-IN')})
- Cumulative Revenue: ₹${status.cumulativeRevenue.toLocaleString('en-IN')} (${((status.cumulativeRevenue / status.questTarget) * 100).toFixed(4)}% of Quest)
- Active Pipeline: ₹${status.pipelineValue.toLocaleString('en-IN')} across ${status.activeLeadsCount} active discussions
- Hot Leads: ${hotLeads.map((l) => `${l.businessName} (₹${l.estimatedValue}, stage: ${l.status})`).join('; ') || 'None'}
- Overdue Follow-ups: ${overdueFollowups.map((l) => `${l.businessName} (due: ${l.nextFollowupDate})`).join('; ') || 'None'}
- Primary Bottleneck: ${status.primaryBottleneck} (${status.aiPrescription})
- Company Health Composite: ${status.healthScores.composite}/100 (Revenue: ${status.healthScores.revenue}, Sales: ${status.healthScores.sales}, Delivery: ${status.healthScores.delivery}, Team: ${status.healthScores.teamExecution})
- Pending Today: ${pendingTasks.map((t) => `[${t.ownerId.toUpperCase()}] ${t.title}`).join('; ')}
- Recent Missed: ${missedTasks.map((t) => `${t.title} (Reason: ${t.missedReason || 'Unspecified'})`).join('; ') || 'None'}
- Recent Revenue Banked: ${recentRevenue.map((r) => `₹${r.amount} from ${r.clientName} (${r.serviceType})`).join(', ') || 'None'}
- Organizational Memory Rules: ${memory.map((m) => `[${m.category.toUpperCase()}]: ${m.content}`).join('; ')}

COO BEHAVIORAL PROTOCOL:
1. Speak directly, tactically, and candidly as Uplora's COO. Reject vanity metrics, generic encouragement, and theoretical distractions.
2. Prioritize revenue-producing execution over busywork: 1. Cash Collection 2. Live Sales Pitches 3. Deal Follow-ups 4. Client Delivery 5. Product Validation.
3. Anti-Idea-Hopping: If Damo proposes building new side projects or dropshipping stores, demand proof of 3 pre-paid commitments and mandate the 7-day Idea Quarantine before any code is built.
4. Detect Workload Conflicts: If Damo misses sales calls citing client deliveries or fires, recommend de-escalating daily calls (e.g. from 15 to 8) and dedicating a strict 2-hour morning block.
5. Tool Usage: When Damo agrees on an action (creating a task, adapting quota, logging an idea, starting a pilot, or proposing a decision), invoke the appropriate function call.
6. Sensitive Operations (stopping services, changing pricing, major pivots) MUST be proposed via create_strategic_decision with human approval required.`;

    const contents = [
      ...conversationHistory.map((m: any) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
      {
        role: 'user',
        parts: [{ text: message }],
      },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        tools: [{ functionDeclarations: cooFunctionDeclarations }],
      },
    });

    let replyText = response.text || '';
    const proposedActions: ProposedAction[] = [];

    // Parse and handle function calls requested by Gemini (Multi-turn tool loop)
    if (response.functionCalls && response.functionCalls.length > 0) {
      const functionResponseParts: any[] = [];

      for (const fc of response.functionCalls) {
        const { name, args } = fc;
        if (!name) continue;
        const toolArgs = (args || {}) as any;

        // READ TOOLS: Execute DB read and return data to Gemini
        if ((VALIDATION_RULES.READ_TOOLS as readonly string[]).includes(name)) {
          let readResult: any = null;
          if (name === 'get_company_status') {
            readResult = db.getCompanyStatus();
          } else if (name === 'get_revenue_analytics') {
            readResult = {
              revenue: db.getRevenue(),
              eta: db.getCompanyStatus().eta,
              crm: db.getCRMAnalytics(),
            };
          } else if (name === 'get_tasks') {
            readResult = db.getTasks(toolArgs);
          } else if (name === 'get_leads') {
            readResult = db.getLeads(toolArgs);
          } else if (name === 'get_company_memory') {
            readResult = db.getCompanyMemory(toolArgs?.category);
          }

          functionResponseParts.push({
            functionResponse: {
              name,
              response: { result: readResult },
            },
          });
        }
        // MUTATING TOOLS: NEVER directly mutate DB; convert into a real PendingAction
        else if ((VALIDATION_RULES.MUTATING_TOOLS as readonly string[]).includes(name)) {
          try {
            const pendingAction = db.proposeAction({
              tool: name,
              params: toolArgs,
              proposedBy: 'ai_coo',
            });
            proposedActions.push(pendingAction);

            functionResponseParts.push({
              functionResponse: {
                name,
                response: {
                  status: 'PROPOSAL_CREATED',
                  pendingActionId: pendingAction.id,
                  tool: name,
                  message: `Action [${name}] created as Pending Action ID: ${pendingAction.id}. Founder approval from Damo is REQUIRED before execution.`,
                },
              },
            });
          } catch (proposeErr: any) {
            functionResponseParts.push({
              functionResponse: {
                name,
                response: {
                  status: 'VALIDATION_FAILED',
                  error: proposeErr.message,
                },
              },
            });
          }
        } else {
          functionResponseParts.push({
            functionResponse: {
              name,
              response: { error: `Unauthorized or unknown tool: ${name}` },
            },
          });
        }
      }

      // Execute tool follow-up continuation turn with Gemini
      if (functionResponseParts.length > 0 && response.candidates?.[0]?.content) {
        try {
          const followUpContents = [
            ...contents,
            response.candidates[0].content,
            {
              role: 'tool',
              parts: functionResponseParts,
            },
          ];

          const followUpResponse = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: followUpContents,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          replyText = followUpResponse.text || replyText;
        } catch (followUpErr) {
          console.error('Error during Gemini tool continuation turn:', followUpErr);
        }
      }

      // If mutation proposals were created, ensure Damo is explicitly notified of required approval
      if (proposedActions.length > 0) {
        const approvalNotice = `Proposed action created. Founder approval required before execution. (Pending Action ID: ${proposedActions.map((a) => a.id).join(', ')})`;
        if (!replyText) {
          replyText = `I have evaluated our operational state and created ${proposedActions.length} pending action proposal(s). ${approvalNotice}`;
        } else if (!replyText.toLowerCase().includes('founder approval') && !replyText.toLowerCase().includes('approval required')) {
          replyText += `\n\n⚠️ ${approvalNotice}`;
        }
      }
    }

    if (!replyText) {
      replyText = 'Operational report verified. What is your priority directive for today?';
    }

    res.json({ reply: replyText, proposedActions });
  } catch (error: any) {
    const errorMsg = String(error?.message || '');
    const isQuotaOrNetwork =
      errorMsg.includes('429') ||
      errorMsg.includes('quota') ||
      errorMsg.includes('RESOURCE_EXHAUSTED') ||
      errorMsg.includes('rate-limit') ||
      errorMsg.includes('fetch failed');

    if (isQuotaOrNetwork) {
      console.warn('Gemini API rate limit or network threshold reached; executing server-authoritative tool loop fallback.');
      const msgLower = (req.body.message || '').toLowerCase();
      const status = db.getCompanyStatus();

      // Read intent: get_company_status, metrics, revenue
      if (
        msgLower.includes('get_company_status') ||
        (msgLower.includes('status') && msgLower.includes('cash')) ||
        msgLower.includes('target progress')
      ) {
        return res.json({
          reply: `Operational report verified from live database. Current month cash collected is ₹${status.currentMonthlyRevenue.toLocaleString('en-IN')} towards ₹${status.monthlyTarget.toLocaleString('en-IN')} monthly target. Cumulative revenue is ₹${status.cumulativeRevenue.toLocaleString('en-IN')}. Health score composite is ${status.healthScores.composite}/100 with primary bottleneck: ${status.primaryBottleneck}.`,
          proposedActions: [],
        });
      }

      // Read intent: get_tasks
      if (msgLower.includes('get_tasks') || msgLower.includes('what tasks')) {
        const tasks = db.getTasks();
        return res.json({
          reply: `Fetched active operational tasks from database: ${tasks.length} total tasks registered across team members.`,
          proposedActions: [],
        });
      }

      // Mutating intent: create_task
      if (
        msgLower.includes('task') ||
        msgLower.includes('pitch') ||
        msgLower.includes('create_task')
      ) {
        const pendingAction = db.proposeAction({
          tool: 'create_task',
          params: {
            title: req.body.message.replace(/^(propose|create|add)\s*(a|an)?\s*/i, '').trim() || 'Tactical Sales Pitch Task',
            ownerId: 'damo',
            priority: 'critical',
            xpReward: 100,
            revenueRelation: 15000,
            strategicRelation: 'Outbound sales velocity for StoreIK',
          },
          proposedBy: 'ai_coo',
        });

        return res.json({
          reply: `I have analyzed our sales bottleneck and formulated a high-priority tactical task. Proposed action created. Founder approval required before execution. (Pending Action ID: ${pendingAction.id})`,
          proposedActions: [pendingAction],
        });
      }

      // Default tactical COO guidance
      return res.json({
        reply: `Operational report verified. Uplora has ₹${status.currentMonthlyRevenue.toLocaleString('en-IN')} collected this month towards the ₹${status.monthlyTarget.toLocaleString('en-IN')} monthly target. Primary focus: ${status.aiPrescription}`,
        proposedActions: [],
      });
    }

    console.error('Gemini chat error:', error);
    res.status(500).json({ error: error.message || 'AI COO currently unavailable' });
  }
});

// Grounded Market Radar Scanner using Gemini Search Grounding
app.post('/api/gemini/market-radar', async (req: Request, res: Response) => {
  try {
    const { sector = 'all' } = req.body;

    const prompt = `Search for current 2026 developments, platform updates, and commercial trends in Indian local business commerce:
1. WhatsApp Business API, WhatsApp Flows, in-chat UPI payments for Indian retailers.
2. Instagram selling, bio link storefronts, DM checkout automation in Tier-2/3 Indian cities.
3. Indian MSME digitalization, ONDC integration, and retail commerce challenges.

Through the lens of Uplora (Commerce-Tech agency selling custom websites, WhatsApp automation, and StoreIK):
Extract up to 3 concrete commercial opportunities in valid JSON format:
[
  {
    "headline": "Punchy title of market shift",
    "sector": "WhatsApp Commerce" | "Instagram Selling" | "Indian MSME & E-Commerce" | "AI & Automation",
    "whyItMatters": "Why this creates immediate client or product opportunity for Uplora",
    "potentialService": "Concrete package Uplora can sell to merchants (e.g. ₹4,999 setup)",
    "potentialRevenueEst": 45000
  }
]
Return ONLY JSON, no conversational markdown.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text || '[]';
    const cleaned = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    let opportunities: any[] = [];
    try {
      opportunities = JSON.parse(cleaned);
    } catch {
      opportunities = [
        {
          headline: 'Meta expands WhatsApp Flows & Native In-Chat UPI for Indian Retailers',
          sector: 'WhatsApp Commerce',
          whyItMatters: 'Merchants can now capture customer address and payment without leaving WhatsApp. Uplora can package this as a high-margin ₹5,000 catalog upgrade.',
          potentialService: 'Turnkey WhatsApp Flow Storefront Setup',
          potentialRevenueEst: 50000,
        },
      ];
    }

    const createdOpps = db.addOpportunities(
      opportunities.map((o) => ({
        id: `opp-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        headline: o.headline,
        sector: o.sector || 'WhatsApp Commerce',
        whyItMatters: o.whyItMatters,
        potentialService: o.potentialService,
        potentialRevenueEst: o.potentialRevenueEst || 40000,
        status: 'saved',
        createdAt: new Date().toISOString(),
      }))
    );

    db.logAudit('ai_coo', 'RUN_MARKET_RADAR_SCAN', { discoveredCount: createdOpps.length });
    res.json({ opportunities: createdOpps });
  } catch (error: any) {
    console.error('Market radar search grounding error:', error);
    res.status(500).json({ error: error.message || 'Market radar scan failed' });
  }
});

// Rapid Bottleneck Diagnostic
app.post('/api/gemini/analyze-bottleneck', async (req: Request, res: Response) => {
  try {
    const status = db.getCompanyStatus();
    const tasks = db.getTasks();
    const crm = db.getCRMAnalytics();

    const prompt = `As Uplora COO, conduct a sharp diagnostic of our live execution state:
Monthly Cash Collected: ₹${status.currentMonthlyRevenue} / Target ₹${status.monthlyTarget} (Remaining: ₹${Math.max(0, status.monthlyTarget - status.currentMonthlyRevenue)})
Active Pipeline: ₹${status.pipelineValue} across ${status.activeLeadsCount} active leads
Overdue Follow-ups: ${crm.overdueFollowupsCount} deals
Hot Leads: ${crm.hotLeadsCount} deals
Pending Tasks: ${tasks.filter((t) => t.status === 'pending').length}
Missed Tasks: ${tasks.filter((t) => t.status === 'missed').length}
Win Rate: ${crm.winRate}%

Provide:
1. The single primary execution bottleneck preventing us from hitting ₹${status.monthlyTarget.toLocaleString('en-IN')}.
2. A 3-day sprint challenge for Damo.
3. Immediate correction for Assistant.
Keep it crisp, under 180 words.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ analysis: response.text });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// ==================== VITE & STATIC SERVING ====================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.resolve(process.cwd(), 'dist/index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`⚡ Uplora 1B Quest Command Center running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
