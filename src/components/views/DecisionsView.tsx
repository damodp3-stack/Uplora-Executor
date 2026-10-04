import React, { useState } from 'react';
import { StrategicDecision } from '../../types/index.js';
import { 
  Scale, 
  Plus, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Compass, 
  Calendar,
  AlertTriangle 
} from 'lucide-react';

interface DecisionsViewProps {
  decisions: StrategicDecision[];
  onUpdateDecisionStatus: (id: string, status: StrategicDecision['status'], outcomeNote?: string) => void;
  onOpenQuickAction: () => void;
}

export const DecisionsView: React.FC<DecisionsViewProps> = ({
  decisions,
  onUpdateDecisionStatus,
  onOpenQuickAction,
}) => {
  const [selectedOutcomeNote, setSelectedOutcomeNote] = useState<string>('');
  const [activeDecisionForNote, setActiveDecisionForNote] = useState<string | null>(null);

  const handleApplyStatus = (id: string, status: StrategicDecision['status']) => {
    onUpdateDecisionStatus(id, status, selectedOutcomeNote || undefined);
    setActiveDecisionForNote(null);
    setSelectedOutcomeNote('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Scale className="w-5 h-5 text-amber-400" />
            <span>Strategic Decision Ledger &amp; Governance</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Founder gatekeeper against pivot whiplash. Requires 6-dimension risk impact audit and explicit human authorization.
          </p>
        </div>

        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20 cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Propose Policy Shift</span>
        </button>
      </div>

      {/* Governance Banner */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3 text-xs">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <div className="font-bold text-white">AI Cannot Autonomously Pivot the Company</div>
          <p className="text-slate-400 leading-relaxed">
            The AI COO advises on strategic shifts (e.g. altering pricing, phasing out services, reallocating payroll). However, execution requires explicit authorization by Commander Damo: <strong>APPROVE</strong>, <strong>REJECT</strong>, or <strong>PILOT FIRST</strong>.
          </p>
        </div>
      </div>

      {/* Decisions List */}
      <div className="space-y-4">
        {decisions.map((dec) => {
          const isApproved = dec.status === 'approved';
          const isPilot = dec.status === 'in_pilot';
          const isRejected = dec.status === 'rejected';

          return (
            <div
              key={dec.id}
              className={`bg-slate-900 border rounded-xl p-5 space-y-4 transition ${
                isApproved
                  ? 'border-emerald-500/40'
                  : isPilot
                  ? 'border-cyan-500/40'
                  : isRejected
                  ? 'border-red-500/40 opacity-70'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${
                        isApproved
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : isPilot
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : isRejected
                          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}
                    >
                      Status: {dec.status}
                    </span>
                    <span className="text-xs text-slate-400">
                      Author: <strong className="text-slate-300">{dec.authorName}</strong>
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white leading-snug">{dec.title}</h2>
                </div>

                <div className="text-right text-xs shrink-0">
                  <span className="text-slate-400 block text-[11px]">Scheduled Review:</span>
                  <span className="font-mono text-amber-400 font-bold">{dec.reviewDate}</span>
                </div>
              </div>

              {/* Rationale & Expected Outcome */}
              <div className="text-xs space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800/80">
                <div>
                  <span className="text-amber-400 font-semibold block mb-0.5">Strategic Rationale:</span>
                  <p className="text-slate-300 leading-relaxed">{dec.rationale}</p>
                </div>
                <div>
                  <span className="text-cyan-400 font-semibold block mb-0.5">Expected Commercial Outcome:</span>
                  <p className="text-slate-300 leading-relaxed">{dec.expectedOutcome}</p>
                </div>
              </div>

              {/* Risk Impact Analysis */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-950/60 p-3 rounded-lg border border-slate-800">
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Cashflow Impact:</span>
                  <span className="text-slate-200">{dec.riskAssessment.revenueImpact}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Customer Risk:</span>
                  <span className="text-slate-200">{dec.riskAssessment.customerRisk}</span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] uppercase font-bold block">Team Capacity Shift:</span>
                  <span className="text-slate-200">{dec.riskAssessment.teamCapacity}</span>
                </div>
              </div>

              {/* Permanent Rule Extracted */}
              {dec.permanentRule && (
                <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/30 text-xs text-emerald-300">
                  <strong>Permanent Organization Rule Extracted:</strong> "{dec.permanentRule}"
                </div>
              )}

              {/* Founder Approval Controls */}
              {dec.status === 'proposed' && (
                <div className="pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-400">Founder Authorization Required:</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApplyStatus(dec.id, 'rejected')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-300 transition"
                    >
                      Reject Proposal
                    </button>
                    <button
                      onClick={() => handleApplyStatus(dec.id, 'in_pilot')}
                      className="px-3.5 py-1.5 rounded-lg bg-cyan-600/30 border border-cyan-500/40 text-cyan-300 font-bold hover:bg-cyan-600/40 transition"
                    >
                      Initiate 14-Day Pilot First
                    </button>
                    <button
                      onClick={() => handleApplyStatus(dec.id, 'approved')}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-md shadow-emerald-600/20"
                    >
                      Approve Full Policy Shift
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
