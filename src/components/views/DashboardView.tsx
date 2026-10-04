import React from 'react';
import { 
  CompanyStatus, 
  Task, 
  User, 
  Lead,
  RevenueEntry,
  MarketOpportunity
} from '../../types/index.js';
import {
  Flame,
  TrendingUp,
  Target,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Users2,
  Calendar,
  Compass,
  CheckCircle2,
  Clock,
  Radar,
  Play
} from 'lucide-react';

interface DashboardViewProps {
  status: CompanyStatus | null;
  tasks: Task[];
  users: User[];
  leads: Lead[];
  revenue: RevenueEntry[];
  opportunities: MarketOpportunity[];
  onCompleteTask: (id: string) => void;
  onMissTask: (task: Task) => void;
  onNavigate: (view: any) => void;
  onOpenCheckin: () => void;
  onOpenQuickAction: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  status,
  tasks,
  users,
  leads,
  revenue,
  opportunities,
  onCompleteTask,
  onMissTask,
  onNavigate,
  onOpenCheckin,
  onOpenQuickAction,
}) => {
  const questTarget = status?.questTarget || 1000000000;
  const cumulativeRev = status?.cumulativeRevenue || 0;
  const currentMonthRev = status?.currentMonthlyRevenue || 0;
  const monthlyTarget = status?.monthlyTarget || 100000;
  const progressPct = (cumulativeRev / questTarget) * 100;
  const monthPct = Math.min(100, Math.round((currentMonthRev / monthlyTarget) * 100));

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const todayDailyTasks = tasks.filter((t) => t.layer === 'daily');
  const missedTasks = tasks.filter((t) => t.status === 'missed');
  const activePipelineLeads = leads.filter((l) => !['won', 'lost'].includes(l.status));

  return (
    <div className="space-y-6">
      {/* Top Banner: 1B Quest Core HUD */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 p-6 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded">
                MISSION CODE: 1B QUEST
              </span>
              <span className="text-xs text-slate-400">·</span>
              <span className="text-xs text-slate-400">Founded Dec 2025 · Coimbatore / Chennai</span>
            </div>

            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              UPLORA: {formatINR(cumulativeRev)} <span className="text-slate-500 font-normal">➔</span> {formatINR(questTarget)}
            </h1>

            <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
              Ascending from a ₹40k/month website agency into an industrial Commerce-Tech powerhouse. Powered by daily execution discipline, StoreIK platform scaling, and autonomous AI COO guidance.
            </p>
          </div>

          {/* Quick HUD Metrics */}
          <div className="flex items-center gap-3">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 text-center min-w-[110px]">
              <div className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">Level {status?.level || 1}</div>
              <div className="text-lg font-black text-cyan-400">Startup Survivor</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{status?.overallXp || 720} XP</div>
            </div>

            <div className="bg-slate-900/90 border border-amber-500/30 rounded-xl p-3 text-center min-w-[110px]">
              <div className="text-[10px] uppercase font-bold text-amber-400 mb-0.5 flex items-center justify-center gap-1">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                Streak
              </div>
              <div className="text-xl font-black text-white">{status?.streakDays || 4} Days</div>
              <div className="text-[10px] text-amber-300/80 mt-0.5">Execution Multiplier</div>
            </div>
          </div>
        </div>

        {/* Quest Mega Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-800/80">
          <div className="flex justify-between items-center text-xs mb-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">Cumulative Quest Progression</span>
              <span className="font-mono text-amber-400 font-bold">({progressPct.toFixed(4)}%)</span>
            </div>
            <div className="text-slate-400 font-mono text-xs">
              Remaining: <span className="text-white font-medium">{formatINR(Math.max(0, questTarget - cumulativeRev))}</span>
            </div>
          </div>
          <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 p-0.5">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-emerald-400 rounded-full transition-all duration-700 shadow-sm shadow-amber-500/30"
              style={{ width: `${Math.max(1, Math.min(100, progressPct * 200))}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
            <span>₹0 (Inception)</span>
            <span>Milestone 1: ₹1,00,000/mo</span>
            <span>Milestone 2: ₹10,00,000/mo</span>
            <span>Target: ₹100 Crore (₹1B)</span>
          </div>
        </div>
      </div>

      {/* Dynamic 3-Scenario ETA Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Worst Case */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Worst-Case ETA</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">Linear Run-Rate</span>
          </div>
          <div className="text-lg font-bold text-slate-200">
            {status?.eta.worstCaseDate ? new Date(status.eta.worstCaseDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '2045+'}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Assumes static ₹40k/month agency revenue without tech leverage or software compounding.
          </p>
        </div>

        {/* Base Case */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Base-Case ETA</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">+12% MoM</span>
          </div>
          <div className="text-lg font-bold text-cyan-300">
            {status?.eta.baseCaseDate ? new Date(status.eta.baseCaseDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '2033'}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Requires team stabilization, daily hunter quotas, and steady client retention.
          </p>
        </div>

        {/* Best Case (StoreIK Flywheel) */}
        <div className="bg-slate-900/70 border border-amber-500/30 rounded-xl p-4 space-y-2 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs">
            <span className="text-amber-400 font-medium">Best-Case ETA (StoreIK Inflection)</span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">SaaS Flywheel</span>
          </div>
          <div className="text-lg font-bold text-amber-300">
            {status?.eta.bestCaseDate ? new Date(status.eta.bestCaseDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '2029'}
          </div>
          <p className="text-[11px] text-slate-400 leading-tight">
            Assumes StoreIK captures 1,000+ paying Indian merchants selling via WhatsApp &amp; Instagram.
          </p>
        </div>
      </div>

      {/* Main Split: Today's Quests & Company Health Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Character Missions */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
                <Target className="w-4 h-4" />
              </span>
              <h2 className="text-sm font-bold text-white tracking-wide">Today's Tactical Quests (3 Characters)</h2>
            </div>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 transition"
            >
              <span>View All Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {todayDailyTasks.map((t) => {
              const owner = users.find((u) => u.id === t.ownerId);
              const isCompleted = t.status === 'completed';
              const isMissed = t.status === 'missed';

              return (
                <div
                  key={t.id}
                  className={`bg-slate-900 border rounded-xl p-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCompleted
                      ? 'border-emerald-500/30 bg-emerald-950/10 opacity-75'
                      : isMissed
                      ? 'border-red-500/30 bg-red-950/10'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl p-2 bg-slate-950 rounded-lg border border-slate-800">
                      {owner?.avatar || '🧑‍🚀'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-xs font-bold text-white">{t.title}</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                          {owner?.name} ({owner?.title})
                        </span>
                        <span className="text-[10px] font-mono text-amber-400 font-bold">
                          +{t.xpReward} XP
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-2">
                        {t.description}
                      </p>
                      {isMissed && t.missedReason && (
                        <div className="mt-1 text-[10px] text-red-400 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Debrief: {t.missedReason}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    {!isCompleted && !isMissed ? (
                      <>
                        <button
                          onClick={() => onCompleteTask(t.id)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-sm shadow-emerald-600/20"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Done</span>
                        </button>
                        <button
                          onClick={() => onMissTask(t)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-300 text-xs transition cursor-pointer"
                        >
                          Missed
                        </button>
                      </>
                    ) : (
                      <span className={`text-xs font-bold px-2 py-1 rounded ${isCompleted ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
                        {isCompleted ? '✓ Completed' : '✕ Missed'}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Monthly Boss Battle Card */}
          <div className="bg-gradient-to-r from-red-950/30 via-slate-900 to-slate-900 border border-red-500/30 rounded-xl p-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/30 flex items-center justify-center text-xl">
                👹
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-red-400 uppercase tracking-wider">MONTHLY BOSS BATTLE</span>
                  <span className="text-[10px] text-slate-400">Ends in 27 Days</span>
                </div>
                <div className="text-sm font-bold text-white">Slay the ₹1,00,000 Target Benchmark</div>
                <div className="text-[11px] text-slate-400 mt-0.5">
                  Current: {formatINR(currentMonthRev)} / {formatINR(monthlyTarget)} ({monthPct}%)
                </div>
              </div>
            </div>

            <div className="text-right">
              <button
                onClick={() => onNavigate('revenue')}
                className="px-3 py-1.5 rounded-lg bg-red-600/80 hover:bg-red-500 text-white text-xs font-bold transition"
              >
                Inspect Ledger
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Company Health Score & AI Diagnostics */}
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400">
                  <ShieldCheck className="w-4 h-4" />
                </span>
                <h3 className="text-sm font-bold text-white">Uplora Health Composite</h3>
              </div>
              <span className="text-lg font-black text-amber-400 font-mono">
                {status?.healthScores.composite || 65}/100
              </span>
            </div>

            {/* Radar Dimensions */}
            <div className="space-y-2 text-xs">
              {[
                { label: 'Revenue & Cashflow', val: status?.healthScores.revenue || 40, weight: '25%' },
                { label: 'Sales Conversion', val: status?.healthScores.sales || 48, weight: '20%' },
                { label: 'Delivery & QA', val: status?.healthScores.delivery || 80, weight: '15%' },
                { label: 'Lead Hunter Quota', val: status?.healthScores.leadGen || 55, weight: '15%' },
                { label: 'Product & StoreIK', val: status?.healthScores.product || 40, weight: '10%' },
                { label: 'Team Discipline', val: status?.healthScores.teamExecution || 70, weight: '10%' },
              ].map((dim) => (
                <div key={dim.label}>
                  <div className="flex justify-between text-[11px] mb-0.5">
                    <span className="text-slate-400">{dim.label}</span>
                    <span className="font-mono text-slate-200">{dim.val}/100</span>
                  </div>
                  <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        dim.val >= 70 ? 'bg-emerald-400' : dim.val >= 45 ? 'bg-amber-400' : 'bg-red-400'
                      }`}
                      style={{ width: `${dim.val}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Primary Bottleneck Prescription */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-red-400">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>🚨 Primary Bottleneck</span>
              </div>
              <p className="text-[11px] font-semibold text-slate-200">
                {status?.primaryBottleneck || 'Sales Conversion Velocity'}
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                {status?.aiPrescription}
              </p>
            </div>

            <button
              onClick={() => onNavigate('ai_manager')}
              className="w-full py-2 rounded-lg bg-purple-600/20 border border-purple-500/40 text-purple-300 hover:bg-purple-600/30 text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Consult Uplora AI COO</span>
            </button>
          </div>

          {/* Market Radar Sneak Peek */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radar className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold text-white">Live Market Radar</span>
              </div>
              <button
                onClick={() => onNavigate('market_radar')}
                className="text-[11px] text-cyan-400 hover:text-cyan-300"
              >
                Scan Now ➔
              </button>
            </div>
            {opportunities.slice(0, 2).map((opp) => (
              <div key={opp.id} className="text-xs p-2.5 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1">
                <div className="font-semibold text-white line-clamp-1">{opp.headline}</div>
                <div className="text-[10px] text-slate-400 line-clamp-2">{opp.whyItMatters}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
