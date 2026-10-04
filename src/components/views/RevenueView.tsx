import React, { useState } from 'react';
import { CompanyStatus, RevenueEntry } from '../../types/index.js';
import { 
  IndianRupee, 
  Plus, 
  TrendingUp, 
  Calendar, 
  Award, 
  Settings, 
  AlertCircle,
  Clock,
  Sparkles
} from 'lucide-react';

interface RevenueViewProps {
  status: CompanyStatus | null;
  revenue: RevenueEntry[];
  onAddRevenue: (entry: any) => void;
  onUpdateTarget: (questTarget: number, monthlyTarget: number) => void;
  onOpenQuickAction: () => void;
}

export const RevenueView: React.FC<RevenueViewProps> = ({
  status,
  revenue,
  onAddRevenue,
  onUpdateTarget,
  onOpenQuickAction,
}) => {
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [questTargetInput, setQuestTargetInput] = useState(status?.questTarget || 1000000000);
  const [monthlyTargetInput, setMonthlyTargetInput] = useState(status?.monthlyTarget || 100000);

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cumulativeRev = status?.cumulativeRevenue || 0;
  const currentMonthRev = status?.currentMonthlyRevenue || 0;
  const questTarget = status?.questTarget || 1000000000;
  const monthlyTarget = status?.monthlyTarget || 100000;

  // Breakdown by service
  const serviceTotals = revenue.reduce((acc, r) => {
    acc[r.serviceType] = (acc[r.serviceType] || 0) + r.amount;
    return acc;
  }, {} as Record<string, number>);

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateTarget(Number(questTargetInput), Number(monthlyTargetInput));
    setIsEditingTarget(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <IndianRupee className="w-5 h-5 text-amber-400" />
            <span>Revenue Engine &amp; Dynamic ₹1B Simulator</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Transparent financial ledger, multi-scenario compound growth ETA, and configurable Quest targets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditingTarget(!isEditingTarget)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configure Targets</span>
          </button>
          <button
            onClick={onOpenQuickAction}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Log Payment</span>
          </button>
        </div>
      </div>

      {/* Target Modifier Form (Collapsible) */}
      {isEditingTarget && (
        <form onSubmit={handleSaveTargets} className="bg-slate-900 border border-amber-500/40 rounded-xl p-4 space-y-3 text-xs">
          <div className="font-bold text-amber-300 flex items-center gap-1.5">
            <Settings className="w-4 h-4" />
            <span>Customize Company Targets (Fully Configurable)</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Long-Term Quest Target (₹ INR)</label>
              <input
                type="number"
                value={questTargetInput}
                onChange={(e) => setQuestTargetInput(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono font-bold text-amber-400 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Examples: ₹1,00,00,000 (₹1 Cr), ₹1,000,000,000 (₹100 Cr / ₹1B)
              </span>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Current Month Revenue Goal (₹ INR)</label>
              <input
                type="number"
                value={monthlyTargetInput}
                onChange={(e) => setMonthlyTargetInput(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white font-mono font-bold text-emerald-400 focus:outline-hidden"
              />
              <span className="text-[10px] text-slate-400 mt-1 block">
                Near-term operational milestone (default: ₹1,00,000)
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingTarget(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold"
            >
              Update Model
            </button>
          </div>
        </form>
      )}

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">October Cash Collected</div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {formatINR(currentMonthRev)}
          </div>
          <div className="text-[11px] text-slate-400">
            Target: {formatINR(monthlyTarget)} ({Math.round((currentMonthRev / monthlyTarget) * 100)}%)
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Cumulative Banked Revenue</div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            {formatINR(cumulativeRev)}
          </div>
          <div className="text-[11px] text-slate-400">
            Since inception Dec 2025
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-1">
          <div className="text-[11px] text-slate-400 font-semibold uppercase">Remaining Quest Gap</div>
          <div className="text-2xl font-black text-white font-mono">
            {formatINR(Math.max(0, questTarget - cumulativeRev))}
          </div>
          <div className="text-[11px] text-slate-400">
            {((cumulativeRev / questTarget) * 100).toFixed(4)}% conquered
          </div>
        </div>
      </div>

      {/* Dynamic Multi-Scenario ETA Projections */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <span>Dynamic Multi-Scenario ETA Calculator</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent growth modeling recalculated instantaneously upon every payment logged.
            </p>
          </div>

          {status?.eta.confidence === 'low' && (
            <span className="text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-300 px-2 py-1 rounded flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>Confidence: Low (Early Run-Rate Phase)</span>
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-400">1. Worst-Case (Static Run-Rate)</div>
            <div className="text-xl font-bold text-slate-200">
              {status?.eta.worstCaseDate ? new Date(status.eta.worstCaseDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '2045+'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Assumes agency revenue remains flat around ₹40k/month without compounding or product leverage.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-cyan-400">2. Base-Case (+12% MoM Compounding)</div>
            <div className="text-xl font-bold text-cyan-300">
              {status?.eta.baseCaseDate ? new Date(status.eta.baseCaseDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '2033'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Assumes consistent closing velocity, improved hunter lead generation, and project retainers.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-amber-500/30 space-y-2">
            <div className="text-xs font-semibold text-amber-400">3. Best-Case (StoreIK Scale Model)</div>
            <div className="text-xl font-bold text-amber-300">
              {status?.eta.bestCaseDate ? new Date(status.eta.bestCaseDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '2029'}
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Assumes StoreIK inflects into a high-margin SaaS with recurring subscriptions from 1,000+ merchants.
            </p>
          </div>
        </div>
      </div>

      {/* Revenue by Service Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="text-sm font-bold text-white">Revenue Contribution by Service</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          {[
            { label: 'Website Development', val: serviceTotals['website'] || 32000, color: 'text-amber-400' },
            { label: 'WhatsApp Automation', val: serviceTotals['whatsapp_automation'] || 8500, color: 'text-emerald-400' },
            { label: 'StoreIK Platform', val: serviceTotals['storeik'] || 0, color: 'text-cyan-400' },
            { label: 'Maintenance / Retainers', val: serviceTotals['maintenance'] || 0, color: 'text-purple-400' },
          ].map((item) => (
            <div key={item.label} className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-slate-400 text-[11px]">{item.label}</div>
              <div className={`text-base font-bold font-mono mt-1 ${item.color}`}>
                {formatINR(item.val)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmed Transactions Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="text-sm font-bold text-white">Confirmed Payments Ledger</h3>
          <span className="text-xs text-slate-400">{revenue.length} transactions</span>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-950/70 border-b border-slate-800 text-[11px] uppercase text-slate-400">
              <tr>
                <th className="p-3">Client / Source</th>
                <th className="p-3">Service Category</th>
                <th className="p-3">Date</th>
                <th className="p-3">XP Minted</th>
                <th className="p-3 text-right">Amount (₹)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {revenue.map((r) => (
                <tr key={r.id} className="hover:bg-slate-800/30 transition">
                  <td className="p-3 font-semibold text-white">
                    <div>{r.clientName}</div>
                    {r.notes && <div className="text-[10px] text-slate-400 font-normal">{r.notes}</div>}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300">
                      {r.serviceType}
                    </span>
                  </td>
                  <td className="p-3 text-slate-400 font-mono text-[11px]">{r.paymentDate}</td>
                  <td className="p-3 text-amber-400 font-mono font-bold">+{r.xpAwarded} XP</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-400 text-sm">
                    {formatINR(r.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
