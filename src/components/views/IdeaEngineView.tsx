import React, { useState } from 'react';
import { Idea } from '../../types/index.js';
import { 
  Lightbulb, 
  Plus, 
  ShieldAlert, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Filter 
} from 'lucide-react';

interface IdeaEngineViewProps {
  ideas: Idea[];
  onUpdateIdeaStatus: (id: string, status: Idea['status']) => void;
  onOpenQuickAction: () => void;
}

export const IdeaEngineView: React.FC<IdeaEngineViewProps> = ({
  ideas,
  onUpdateIdeaStatus,
  onOpenQuickAction,
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredIdeas = ideas.filter((i) => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span>Idea Quarantine &amp; Validation Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Protects founder focus against destructive idea-hopping. Mandatory 7-day quarantine buffer before any code is built.
          </p>
        </div>

        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Submit New Idea</span>
        </button>
      </div>

      {/* Principle Banner */}
      <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-amber-300">The 7-Day Idea Quarantine Law</div>
          <p className="text-slate-300 leading-relaxed">
            Whenever a founder gets an exciting sudden business idea (like a new dropshipping store or AI tool), it must spend 7 days in quarantine. During this time, the only permitted activity is customer validation: pre-orders, discovery calls, or landing page signup tests. No production code allowed!
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 p-1 rounded-xl gap-1 overflow-x-auto text-xs">
        {[
          { id: 'all', label: 'All Concepts' },
          { id: 'quarantine', label: 'In Quarantine (Cooling Off)' },
          { id: 'validating', label: 'In Pilot Validation' },
          { id: 'approved', label: 'Approved for Development' },
          { id: 'rejected', label: 'Discarded' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilterStatus(f.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              filterStatus === f.id
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Ideas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredIdeas.map((idea) => {
          const isQuarantine = idea.status === 'quarantine';
          const isValidating = idea.status === 'validating';

          return (
            <div
              key={idea.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-white text-sm">{idea.title}</h3>
                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0 ${
                      isQuarantine
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : isValidating
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isQuarantine ? `Quarantine (${idea.quarantineDaysRemaining}d)` : idea.status}
                  </span>
                </div>

                {/* Problem & Solution */}
                <div className="text-xs space-y-1.5 bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
                  <div>
                    <span className="text-slate-400 font-medium">Merchant Problem: </span>
                    <span className="text-slate-300">{idea.problem}</span>
                  </div>
                  <div>
                    <span className="text-amber-400/80 font-medium">Target Customer: </span>
                    <span className="text-slate-300">{idea.targetCustomer}</span>
                  </div>
                  <div>
                    <span className="text-cyan-400/80 font-medium">Proposed Solution: </span>
                    <span className="text-slate-300">{idea.proposedSolution}</span>
                  </div>
                </div>

                {/* Commercial Metrics */}
                <div className="grid grid-cols-3 gap-2 text-[11px] pt-1 font-mono">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Pot. Revenue</span>
                    <span className="font-bold text-emerald-400">₹{idea.potentialRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Cost Est.</span>
                    <span className="font-bold text-slate-300">₹{idea.costEstimate.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[9px] uppercase">Difficulty</span>
                    <span className="font-bold text-amber-400 uppercase">{idea.difficulty}</span>
                  </div>
                </div>

                {idea.validationMethod && (
                  <div className="text-[11px] text-slate-400 bg-slate-950/60 p-2 rounded border border-slate-800">
                    <strong className="text-cyan-400">Validation Protocol:</strong> {idea.validationMethod}
                  </div>
                )}
              </div>

              {/* Status Controls */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                <span className="text-[10px] text-slate-500 font-mono">
                  Logged: {new Date(idea.createdAt).toLocaleDateString()}
                </span>

                <div className="flex gap-1.5">
                  {isQuarantine && (
                    <button
                      onClick={() => onUpdateIdeaStatus(idea.id, 'validating')}
                      className="px-2.5 py-1 rounded bg-cyan-600/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/30 transition"
                    >
                      Start 7d Pilot
                    </button>
                  )}
                  {isValidating && (
                    <button
                      onClick={() => onUpdateIdeaStatus(idea.id, 'approved')}
                      className="px-2.5 py-1 rounded bg-emerald-600/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/30 transition"
                    >
                      Approve Build
                    </button>
                  )}
                  <button
                    onClick={() => onUpdateIdeaStatus(idea.id, 'rejected')}
                    className="px-2 py-1 rounded bg-slate-800 text-slate-400 hover:text-red-400 transition"
                  >
                    Discard
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
