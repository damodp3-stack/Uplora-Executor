import React, { useState } from 'react';
import { Idea, Experiment } from '../../types/index.js';
import { 
  Lightbulb, 
  Plus, 
  ShieldAlert, 
  FlaskConical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface IdeaEngineViewProps {
  ideas: Idea[];
  experiments: Experiment[];
  onUpdateIdeaStatus: (id: string, status: Idea['status']) => void;
  onLaunchExperiment: (expData: Partial<Experiment>) => void;
  onUpdateExperimentStatus: (id: string, outcome: Experiment['outcome'], lessonsLearned?: string) => void;
  onOpenQuickAction: () => void;
}

export const IdeaEngineView: React.FC<IdeaEngineViewProps> = ({
  ideas,
  experiments,
  onUpdateIdeaStatus,
  onLaunchExperiment,
  onUpdateExperimentStatus,
  onOpenQuickAction,
}) => {
  const [activeTab, setActiveTab] = useState<'ideas' | 'experiments'>('ideas');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [newExpModalIdea, setNewExpModalIdea] = useState<Idea | null>(null);
  const [expForm, setExpForm] = useState({
    title: '',
    hypothesis: '',
    durationDays: 7,
    metricsTracked: 'Inquiries, Conversation %, Banked advances',
    successCriteria: 'At least 3 paying customer commitments',
  });

  const filteredIdeas = ideas.filter((i) => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    return true;
  });

  const handleOpenLaunch = (idea: Idea) => {
    setNewExpModalIdea(idea);
    setExpForm({
      title: `7-Day Pilot: ${idea.title}`,
      hypothesis: `At least 3 target merchants (${idea.targetCustomer}) will pay an advance for this solution.`,
      durationDays: 7,
      metricsTracked: 'Merchant meetings, Proposals reviewed, UPI deposits',
      successCriteria: 'At least ₹10,000 in customer commitments within 7 days',
    });
  };

  const handleConfirmLaunch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expForm.title || !newExpModalIdea) return;
    onLaunchExperiment({
      ideaId: newExpModalIdea.id,
      title: expForm.title,
      hypothesis: expForm.hypothesis,
      durationDays: expForm.durationDays,
      metricsTracked: expForm.metricsTracked,
      successCriteria: expForm.successCriteria,
    });
    onUpdateIdeaStatus(newExpModalIdea.id, 'validating');
    setNewExpModalIdea(null);
    setActiveTab('experiments');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-400" />
            <span>Idea Quarantine &amp; 7-Day Experiment Sandbox</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Anti-idea-hopping protocol: 7-day cooling off quarantine and falsifiable commercial experiments.
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
            Whenever a founder gets an exciting sudden business idea (like dropshipping or a new SaaS tool), it must spend 7 days in quarantine. During this time, the only permitted activity is customer validation: pre-orders, discovery calls, or landing page tests. No code may be written until validation succeeds!
          </p>
        </div>
      </div>

      {/* Main Tab Navigation: Ideas vs Experiments */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 p-1 rounded-xl gap-1 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('ideas')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeTab === 'ideas'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Idea Quarantine Bank ({ideas.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('experiments')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
            activeTab === 'experiments'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <FlaskConical className="w-3.5 h-3.5" />
          <span>Active 7-Day Experiments ({experiments.length})</span>
        </button>
      </div>

      {activeTab === 'ideas' ? (
        <>
          {/* Ideas Filter */}
          <div className="flex gap-2 overflow-x-auto text-xs pb-1">
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
                    : 'bg-slate-900 text-slate-400 hover:text-white'
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
                      <button
                        onClick={() => handleOpenLaunch(idea)}
                        className="flex items-center gap-1 px-3 py-1 rounded bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-600/40 font-bold transition"
                      >
                        <FlaskConical className="w-3 h-3" />
                        <span>Launch 7d Pilot</span>
                      </button>
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
        </>
      ) : (
        /* Experiments Tab */
        <div className="space-y-4">
          {experiments.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
              No active validation pilots running. Select an idea from the Quarantine Bank to launch a 7-day experiment.
            </div>
          ) : (
            experiments.map((exp) => {
              const isRunning = exp.outcome === 'running';
              const isSuccess = exp.outcome === 'success';

              return (
                <div
                  key={exp.id}
                  className={`bg-slate-900 border rounded-xl p-5 space-y-3 transition ${
                    isRunning
                      ? 'border-cyan-500/40'
                      : isSuccess
                      ? 'border-emerald-500/40'
                      : 'border-slate-800 opacity-75'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase tracking-wider bg-cyan-950 border border-cyan-500/30 text-cyan-400">
                          {exp.durationDays}-Day Pilot
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                            isRunning
                              ? 'bg-amber-500/20 text-amber-300'
                              : isSuccess
                              ? 'bg-emerald-500/20 text-emerald-300'
                              : 'bg-red-500/20 text-red-300'
                          }`}
                        >
                          {exp.outcome}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-sm">{exp.title}</h3>
                    </div>

                    <div className="text-right text-xs text-slate-400 font-mono">
                      <span>Timeline: </span>
                      <strong className="text-slate-200">{exp.startDate} ➔ {exp.endDate}</strong>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800/80 space-y-2 text-xs">
                    <div>
                      <span className="text-cyan-400 font-semibold block mb-0.5">Commercial Hypothesis:</span>
                      <p className="text-slate-300">{exp.hypothesis}</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-slate-800/80">
                      <div>
                        <span className="text-slate-400 block text-[11px]">Metrics Tracked:</span>
                        <span className="text-slate-300">{exp.metricsTracked}</span>
                      </div>
                      <div>
                        <span className="text-amber-400 block text-[11px]">Success Criteria:</span>
                        <span className="text-slate-300">{exp.successCriteria}</span>
                      </div>
                    </div>
                  </div>

                  {exp.lessonsLearned && (
                    <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs text-emerald-300">
                      <strong>Lessons Documented:</strong> {exp.lessonsLearned}
                    </div>
                  )}

                  {isRunning && (
                    <div className="pt-2 border-t border-slate-800 flex justify-end gap-2 text-xs">
                      <button
                        onClick={() => onUpdateExperimentStatus(exp.id, 'failed', 'Criteria not met within 7 days.')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-red-300 transition"
                      >
                        Mark Failed / Stop
                      </button>
                      <button
                        onClick={() => onUpdateExperimentStatus(exp.id, 'success', 'Validated commercial willingness to pay.')}
                        className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm"
                      >
                        Validate Success ✓
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Launch Experiment Modal */}
      {newExpModalIdea && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <form onSubmit={handleConfirmLaunch} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-lg w-full space-y-4 text-xs shadow-2xl">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <FlaskConical className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-white">Initialize 7-Day Validation Experiment</h2>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Experiment Name</label>
              <input
                type="text"
                required
                value={expForm.title}
                onChange={(e) => setExpForm({ ...expForm, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-medium">Falsifiable Commercial Hypothesis</label>
              <textarea
                rows={2}
                required
                value={expForm.hypothesis}
                onChange={(e) => setExpForm({ ...expForm, hypothesis: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Metrics Tracked</label>
                <input
                  type="text"
                  value={expForm.metricsTracked}
                  onChange={(e) => setExpForm({ ...expForm, metricsTracked: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Success Benchmark</label>
                <input
                  type="text"
                  value={expForm.successCriteria}
                  onChange={(e) => setExpForm({ ...expForm, successCriteria: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white focus:outline-hidden"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setNewExpModalIdea(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold"
              >
                Launch Pilot Now
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
