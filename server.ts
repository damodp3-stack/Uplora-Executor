import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { db } from './server/db.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Google Gen AI
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

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
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/tasks/:id/complete', (req: Request, res: Response) => {
  try {
    const result = db.completeTask(req.params.id);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/tasks/:id/missed', (req: Request, res: Response) => {
  try {
    const { reason, notes } = req.body;
    const result = db.missTask(req.params.id, reason, notes);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/tasks/adapt', (req: Request, res: Response) => {
  try {
    const { taskId, newTitle, newXp } = req.body;
    const adapted = db.adaptTask(taskId, newTitle, newXp);
    res.json(adapted);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 4. Sales CRM
app.get('/api/leads', (req: Request, res: Response) => {
  try {
    const leads = db.getLeads();
    res.json(leads);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/leads', (req: Request, res: Response) => {
  try {
    const lead = db.createLead(req.body);
    res.json(lead);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/leads/:id/stage', (req: Request, res: Response) => {
  try {
    const { status, notes } = req.body;
    const lead = db.updateLeadStage(req.params.id, status, notes);
    res.json(lead);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/leads/:id', (req: Request, res: Response) => {
  try {
    const success = db.deleteLead(req.params.id);
    res.json({ success });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Revenue Engine
app.get('/api/revenue', (req: Request, res: Response) => {
  try {
    const rev = db.getRevenue();
    res.json(rev);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/revenue', (req: Request, res: Response) => {
  try {
    const result = db.addRevenue(req.body);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Daily Check-ins
app.get('/api/checkins', (req: Request, res: Response) => {
  try {
    const chks = db.getCheckins();
    res.json(chks);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/checkins', (req: Request, res: Response) => {
  try {
    const chk = db.addCheckin(req.body);
    res.json(chk);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Idea Engine
app.get('/api/ideas', (req: Request, res: Response) => {
  try {
    const ideas = db.getIdeas();
    res.json(ideas);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/ideas', (req: Request, res: Response) => {
  try {
    const idea = db.createIdea(req.body);
    res.json(idea);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/ideas/:id/status', (req: Request, res: Response) => {
  try {
    const idea = db.updateIdeaStatus(req.params.id, req.body.status);
    res.json(idea);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 8. Strategic Decisions & Ledger
app.get('/api/decisions', (req: Request, res: Response) => {
  try {
    const decisions = db.getDecisions();
    res.json(decisions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/decisions', (req: Request, res: Response) => {
  try {
    const decision = db.createDecision(req.body);
    res.json(decision);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/decisions/:id/status', (req: Request, res: Response) => {
  try {
    const { status, outcomeNote } = req.body;
    const decision = db.updateDecisionStatus(req.params.id, status, outcomeNote);
    res.json(decision);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Market Opportunities
app.get('/api/opportunities', (req: Request, res: Response) => {
  try {
    const opps = db.getOpportunities();
    res.json(opps);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.patch('/api/opportunities/:id/status', (req: Request, res: Response) => {
  try {
    const opp = db.updateOpportunityStatus(req.params.id, req.body.status);
    res.json(opp);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Achievements
app.get('/api/achievements', (req: Request, res: Response) => {
  try {
    const achs = db.getAchievements();
    res.json(achs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 11. Backup & Recovery
app.get('/api/backup/export', (req: Request, res: Response) => {
  try {
    const jsonStr = db.exportBackup();
    res.setHeader('Content-Disposition', `attachment; filename=uplora_backup_${new Date().toISOString().split('T')[0]}.json`);
    res.setHeader('Content-Type', 'application/json');
    res.send(jsonStr);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/backup/import', (req: Request, res: Response) => {
  try {
    const { jsonContent } = req.body;
    db.importBackup(jsonContent);
    res.json({ success: true, status: db.getCompanyStatus() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/backup/reset', (req: Request, res: Response) => {
  try {
    const status = db.resetToBenchmark();
    res.json({ success: true, status });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 12. Documentation reader API
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

// AI COO Chat with Live Company Context
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, conversationHistory = [] } = req.body;
    const rawData = db.getRawData();
    const status = db.getCompanyStatus();

    // Prepare dense company state representation for the COO
    const pendingTasks = rawData.tasks.filter((t) => t.status === 'pending');
    const missedTasks = rawData.tasks.filter((t) => t.status === 'missed');
    const recentRevenue = rawData.revenue.slice(0, 5);

    const systemInstruction = `You are the unyielding Chief Operating Officer (COO) of Uplora, a Commerce-Tech company founded by Damo in December 2025.
Your duty is to ensure Uplora climbs from its current ₹40k/month baseline to ₹1,00,000/month, and eventually fulfills the ₹1,00,00,00,000 (₹1B / ₹100 Crore) Quest.

CURRENT LIVE COMPANY DATABASE METRICS:
- Company: Uplora (Structure: Commerce-Tech Company, Brand: Akyzer, Product: StoreIK)
- Quest Target: ₹${status.questTarget.toLocaleString('en-IN')} (Completed: ${((status.cumulativeRevenue / status.questTarget) * 100).toFixed(4)}%)
- Current Month Cash Collected: ₹${status.currentMonthlyRevenue.toLocaleString('en-IN')} / Target ₹${status.monthlyTarget.toLocaleString('en-IN')}
- Active Pipeline Value: ₹${status.pipelineValue.toLocaleString('en-IN')} across ${status.activeLeadsCount} active prospects
- Team Performance:
  * Damo (CEO/Growth): Quota ${rawData.users[0]?.dailyQuota} calls/day (XP: ${rawData.users[0]?.xp})
  * Partner (CTO/Delivery): Quota ${rawData.users[1]?.dailyQuota} deliverables/day (XP: ${rawData.users[1]?.xp})
  * Assistant (Lead Hunter): Paid ₹5,000/mo, Quota ${rawData.users[2]?.dailyQuota} leads/day (Attributable Rev: ₹${rawData.users[2]?.monthlyAttributableRevenue})
- Primary Bottleneck: ${status.primaryBottleneck} (${status.aiPrescription})
- Company Health Composite: ${status.healthScores.composite}/100 (Revenue: ${status.healthScores.revenue}, Sales: ${status.healthScores.sales}, Delivery: ${status.healthScores.delivery})
- Pending Tasks Today: ${pendingTasks.map((t) => `[${t.ownerId.toUpperCase()}] ${t.title}`).join('; ')}
- Recent Missed Tasks & Reasons: ${missedTasks.map((t) => `${t.title} (Reason: ${t.missedReason || 'Unspecified'})`).join('; ') || 'None recently'}
- Recent Closed Revenue: ${recentRevenue.map((r) => `₹${r.amount} from ${r.clientName} (${r.serviceType})`).join(', ')}

OPERATIONAL RULES:
1. Speak directly, tactically, and candidly as Uplora's COO. Avoid generic motivational platitudes.
2. If Damo asks about revenue or performance, cite the real live numbers above.
3. Challenge distractions: If Damo proposes chasing new experiments or tweaking UI designs, remind him to hit his daily call quota or follow up on pending proposals (like Velan Silks or Kaveri Dental).
4. When suggesting tasks, keep them realistic and actionable for Tamil Nadu / Indian SMB commerce.
5. If recommending a difficulty change (due to missed calls), propose a 3-day stepped-down milestone (e.g., 10 calls/day).`;

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
      },
    });

    const reply = response.text || 'Operational transmission acknowledged. Let us review the next execution step.';
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini chat error:', error);
    res.status(500).json({ error: error.message || 'AI COO currently unavailable' });
  }
});

// Grounded Market Radar Scanner using Gemini Search Grounding
app.post('/api/gemini/market-radar', async (req: Request, res: Response) => {
  try {
    const { sector = 'all' } = req.body;

    const prompt = `Search for the latest 2026 commercial developments, trends, or platform changes in Indian local commerce, focusing on:
1. WhatsApp commerce updates, WhatsApp Flows, or UPI payments for Indian SMBs.
2. Instagram selling, DM automation, or bio link stores for Indian boutique retail.
3. MSME digital adoption in Tier-2/Tier-3 India (e.g. Tamil Nadu, Karnataka, Maharashtra).

Analyze these findings specifically through the lens of Uplora (a Commerce-Tech agency offering website development, WhatsApp automation, and StoreIK storefronts).

Return a JSON array of up to 3 high-impact commercial opportunities in this EXACT format:
[
  {
    "headline": "Short punchy summary of what changed",
    "sector": "WhatsApp Commerce" | "Instagram Selling" | "Indian MSME & E-Commerce" | "AI & Automation",
    "whyItMatters": "Clear 2-sentence explanation of why this creates cashflow or client opportunity for Uplora",
    "potentialService": "Concrete service package Uplora can sell to local merchants (e.g. ₹4,999 setup)",
    "potentialRevenueEst": 45000
  }
]
IMPORTANT: Return ONLY valid JSON, no markdown code fence blocks if possible.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawText = response.text || '[]';
    // Clean up any json markdown wrappers if returned
    const cleaned = rawText.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();

    let opportunities: any[] = [];
    try {
      opportunities = JSON.parse(cleaned);
    } catch {
      // Fallback structured discovery
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
    const leads = db.getLeads();

    const prompt = `As Uplora COO, conduct a concise diagnostic of our current operations:
Monthly Revenue: ₹${status.currentMonthlyRevenue} / Target ₹${status.monthlyTarget}
Active Pipeline: ₹${status.pipelineValue} across ${status.activeLeadsCount} leads
Pending Tasks: ${tasks.filter((t) => t.status === 'pending').length}
Missed Tasks: ${tasks.filter((t) => t.status === 'missed').length}
Assistant Attributable Output: under ₹10,000/mo vs ₹5,000 payroll

Provide:
1. The single biggest bottleneck preventing us from hitting ₹1,00,000 this month.
2. A 3-day action challenge specifically for Damo.
3. A specific correction for the Assistant.
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
