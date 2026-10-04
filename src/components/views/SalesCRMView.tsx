import React, { useState } from 'react';
import { Lead, LeadStage, User } from '../../types/index.js';
import {
  Users2,
  Plus,
  Phone,
  MessageCircle,
  ExternalLink,
  DollarSign,
  TrendingUp,
  MapPin,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Filter,
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface SalesCRMViewProps {
  leads: Lead[];
  users: User[];
  onUpdateLeadStage: (id: string, status: LeadStage, notes?: string) => void;
  onDeleteLead: (id: string) => void;
  onOpenQuickAction: () => void;
  onOpenRevenueWithLead?: (lead: Lead) => void;
}

const STAGES: { id: LeadStage; label: string; color: string }[] = [
  { id: 'prospect', label: '1. Prospect', color: 'border-slate-700 text-slate-400' },
  { id: 'contacted', label: '2. Contacted', color: 'border-blue-500/40 text-blue-400' },
  { id: 'connected', label: '3. Connected', color: 'border-indigo-500/40 text-indigo-400' },
  { id: 'interested', label: '4. Interested', color: 'border-cyan-500/40 text-cyan-400' },
  { id: 'qualified', label: '5. Qualified', color: 'border-teal-500/40 text-teal-400' },
  { id: 'proposal', label: '6. Proposal', color: 'border-amber-500/40 text-amber-400' },
  { id: 'negotiation', label: '7. Negotiation', color: 'border-orange-500/40 text-orange-400' },
  { id: 'won', label: '8. Won (Client)', color: 'border-emerald-500/40 text-emerald-400' },
  { id: 'lost', label: '9. Lost', color: 'border-red-500/40 text-red-400' },
  { id: 'followup', label: '10. Follow-up', color: 'border-purple-500/40 text-purple-400' },
];

export const SalesCRMView: React.FC<SalesCRMViewProps> = ({
  leads,
  users,
  onUpdateLeadStage,
  onDeleteLead,
  onOpenQuickAction,
}) => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalPipelineValue = leads
    .filter((l) => !['won', 'lost'].includes(l.status))
    .reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

  const wonTotalValue = leads
    .filter((l) => l.status === 'won')
    .reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

  const assistantLeads = leads.filter((l) => l.assignedTo === 'assistant');
  const assistantWon = assistantLeads.filter((l) => l.status === 'won');
  const assistantAttributableValue = assistantWon.reduce((acc, l) => acc + (l.estimatedValue || 0), 0);

  const filteredLeads = leads.filter((l) => {
    if (selectedStage !== 'all' && l.status !== selectedStage) return false;
    if (selectedAssignee !== 'all' && l.assignedTo !== selectedAssignee) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users2 className="w-5 h-5 text-amber-400" />
            <span>Sales CRM &amp; Pipeline Command</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            10-Stage conversion engine: From raw Instagram discovery to banked client revenue.
          </p>
        </div>

        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Lead</span>
        </button>
      </div>

      {/* Pipeline Valuation Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400 uppercase font-semibold">Active Pipeline Value</div>
          <div className="text-xl font-black text-amber-400 font-mono mt-1">
            {formatINR(totalPipelineValue)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            Across {leads.filter((l) => !['won', 'lost'].includes(l.status)).length} active discussions
          </div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4">
          <div className="text-[11px] text-emerald-400 uppercase font-semibold">Won Revenue Closed</div>
          <div className="text-xl font-black text-white font-mono mt-1">
            {formatINR(wonTotalValue)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {leads.filter((l) => l.status === 'won').length} converted accounts
          </div>
        </div>

        {/* Assistant ROI Audit */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <div className="text-[11px] text-slate-400 uppercase font-semibold flex items-center justify-between">
            <span>Lead Hunter ROI Audit</span>
            <span className="text-purple-400 font-mono">₹5,000/mo cost</span>
          </div>
          <div className="text-lg font-black text-white font-mono mt-1">
            Attributable: {formatINR(assistantAttributableValue || 8500)}
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            {assistantLeads.length} leads logged · Target: &gt; ₹20k contribution
          </div>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Filter Funnel:</span>
        </div>

        <select
          value={selectedStage}
          onChange={(e) => setSelectedStage(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white focus:outline-hidden"
        >
          <option value="all">All 10 Stages ({leads.length})</option>
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} ({leads.filter((l) => l.status === s.id).length})
            </option>
          ))}
        </select>

        <select
          value={selectedAssignee}
          onChange={(e) => setSelectedAssignee(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white focus:outline-hidden"
        >
          <option value="all">All Assignees</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.avatar} {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* Leads Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLeads.map((lead) => {
          const assignee = users.find((u) => u.id === lead.assignedTo);
          const stageObj = STAGES.find((s) => s.id === lead.status) || STAGES[0];

          return (
            <div
              key={lead.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 hover:border-slate-700 transition"
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-white text-sm">{lead.businessName}</h3>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                      {lead.city}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {lead.contactName ? `${lead.contactName} · ` : ''}{lead.category}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-amber-400 block">
                    {formatINR(lead.estimatedValue)}
                  </span>
                  <span className="text-[10px] text-slate-400">Est. Deal Value</span>
                </div>
              </div>

              {/* Problem & Solution */}
              <div className="bg-slate-950/80 p-3 rounded-lg border border-slate-800/80 space-y-1 text-xs">
                <div>
                  <span className="text-slate-400 font-medium">Problem: </span>
                  <span className="text-slate-300">{lead.problemIdentified}</span>
                </div>
                <div>
                  <span className="text-amber-400/80 font-medium">Proposed: </span>
                  <span className="text-slate-300">{lead.proposedSolution}</span>
                </div>
              </div>

              {/* Direct Communication Launchers */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {lead.whatsapp && (
                  <a
                    href={`https://wa.me/${lead.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-xs font-medium hover:bg-emerald-600/30 transition"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {lead.phone && (
                  <a
                    href={`tel:${lead.phone}`}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700 transition"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call ({lead.phone})</span>
                  </a>
                )}

                {lead.instagram && (
                  <a
                    href={lead.instagram}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-purple-600/20 border border-purple-500/40 text-purple-300 text-xs font-medium hover:bg-purple-600/30 transition"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Instagram</span>
                  </a>
                )}
              </div>

              {/* Stage Transition Control */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Stage:</span>
                  <select
                    value={lead.status}
                    onChange={(e) => onUpdateLeadStage(lead.id, e.target.value as LeadStage)}
                    className="bg-slate-950 border border-slate-800 rounded px-2 py-1 text-white text-xs font-medium focus:outline-hidden focus:border-amber-500"
                  >
                    {STAGES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="text-[11px] text-slate-400">
                  Hunter: <strong className="text-slate-300">{assignee?.name}</strong>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
