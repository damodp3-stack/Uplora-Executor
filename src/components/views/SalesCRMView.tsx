import React, { useState } from 'react';
import { Lead, LeadStage, User, CRMAnalytics } from '../../types/index.js';
import {
  Users2,
  Plus,
  Phone,
  MessageCircle,
  ExternalLink,
  Flame,
  AlertTriangle,
  Clock,
  Trash2,
  Filter,
  CheckCircle2,
  TrendingUp,
  MapPin
} from 'lucide-react';

interface SalesCRMViewProps {
  leads: Lead[];
  users: User[];
  onUpdateLeadStage: (id: string, status: LeadStage, notes?: string) => void;
  onDeleteLead: (id: string) => void;
  onOpenQuickAction: () => void;
}

const STAGES: { id: LeadStage; label: string }[] = [
  { id: 'prospect', label: '1. Prospect' },
  { id: 'contacted', label: '2. Contacted' },
  { id: 'connected', label: '3. Connected' },
  { id: 'interested', label: '4. Interested' },
  { id: 'qualified', label: '5. Qualified' },
  { id: 'proposal', label: '6. Proposal' },
  { id: 'negotiation', label: '7. Negotiation' },
  { id: 'won', label: '8. Won (Client)' },
  { id: 'lost', label: '9. Lost' },
  { id: 'followup', label: '10. Follow-up' },
];

export const SalesCRMView: React.FC<SalesCRMViewProps> = ({
  leads,
  users,
  onUpdateLeadStage,
  onDeleteLead,
  onOpenQuickAction,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('all');
  const [leadToDelete, setLeadToDelete] = useState<Lead | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const totalPipelineValue = leads
    .filter((l) => !['won', 'lost'].includes(l.status))
    .reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);

  const wonLeads = leads.filter((l) => l.status === 'won');
  const wonTotalValue = wonLeads.reduce((acc, l) => acc + (Number(l.estimatedValue) || 0), 0);
  const contactedCount = leads.filter((l) => l.status !== 'prospect').length;
  const winRate = contactedCount > 0 ? Math.round((wonLeads.length / contactedCount) * 100) : 0;
  const avgDealValue = wonLeads.length > 0 ? Math.round(wonTotalValue / wonLeads.length) : 10000;

  const hotLeads = leads.filter(
    (l) => l.isHotLead || ['proposal', 'negotiation'].includes(l.status) || (l.estimatedValue || 0) >= 12000
  );
  const overdueFollowups = leads.filter(
    (l) => l.nextFollowupDate && l.nextFollowupDate < todayStr && !['won', 'lost'].includes(l.status)
  );

  const filteredLeads = leads.filter((l) => {
    if (selectedAssignee !== 'all' && l.assignedTo !== selectedAssignee) return false;
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'hot') return l.isHotLead || ['proposal', 'negotiation'].includes(l.status) || (l.estimatedValue || 0) >= 12000;
    if (selectedFilter === 'overdue') return l.nextFollowupDate && l.nextFollowupDate < todayStr && !['won', 'lost'].includes(l.status);
    return l.status === selectedFilter;
  });

  const confirmDelete = () => {
    if (leadToDelete) {
      onDeleteLead(leadToDelete.id);
      setLeadToDelete(null);
    }
  };

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
            10-Stage conversion engine with automated overdue follow-up flags and hot deal acceleration.
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

      {/* Pipeline Intelligence Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-1">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Active Pipeline</div>
          <div className="text-xl font-black text-amber-400 font-mono">
            {formatINR(totalPipelineValue)}
          </div>
          <div className="text-[10px] text-slate-400">
            {leads.filter((l) => !['won', 'lost'].includes(l.status)).length} deals in flight
          </div>
        </div>

        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-4 space-y-1">
          <div className="text-[10px] text-emerald-400 uppercase font-semibold">Win Rate &amp; Closed</div>
          <div className="text-xl font-black text-white font-mono">
            {winRate}% <span className="text-xs text-emerald-400 font-normal">({formatINR(wonTotalValue)})</span>
          </div>
          <div className="text-[10px] text-slate-400">
            Avg deal: {formatINR(avgDealValue)}
          </div>
        </div>

        <div className="bg-slate-900 border border-red-500/30 rounded-xl p-4 space-y-1">
          <div className="text-[10px] text-red-400 uppercase font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Overdue Follow-ups</span>
          </div>
          <div className="text-xl font-black text-red-400 font-mono">
            {overdueFollowups.length} Deals
          </div>
          <div className="text-[10px] text-slate-400">
            Require immediate merchant call
          </div>
        </div>

        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-4 space-y-1">
          <div className="text-[10px] text-amber-300 uppercase font-semibold flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>Hot High-Value Leads</span>
          </div>
          <div className="text-xl font-black text-amber-300 font-mono">
            {hotLeads.length} Deals
          </div>
          <div className="text-[10px] text-slate-400">
            &gt;= ₹12,000 or in negotiation
          </div>
        </div>
      </div>

      {/* Filter Row with Hot and Overdue Quick Toggles */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-xs">
        <button
          onClick={() => setSelectedFilter('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            selectedFilter === 'all'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          All ({leads.length})
        </button>

        <button
          onClick={() => setSelectedFilter('overdue')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            selectedFilter === 'overdue'
              ? 'bg-red-500/20 text-red-300 border border-red-500/40 font-bold'
              : 'text-red-400 hover:bg-red-950/30'
          }`}
        >
          <AlertTriangle className="w-3 h-3" />
          <span>Overdue ({overdueFollowups.length})</span>
        </button>

        <button
          onClick={() => setSelectedFilter('hot')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            selectedFilter === 'hot'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
              : 'text-amber-400 hover:bg-amber-950/30'
          }`}
        >
          <Flame className="w-3 h-3 fill-amber-400" />
          <span>Hot Deals ({hotLeads.length})</span>
        </button>

        <div className="h-4 w-px bg-slate-800 mx-1 hidden sm:block" />

        <select
          value={selectedFilter.startsWith('hot') || selectedFilter.startsWith('overdue') ? 'all' : selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white focus:outline-hidden text-xs"
        >
          <option value="all">Stage Breakdown</option>
          {STAGES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label} ({leads.filter((l) => l.status === s.id).length})
            </option>
          ))}
        </select>

        <select
          value={selectedAssignee}
          onChange={(e) => setSelectedAssignee(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white focus:outline-hidden text-xs ml-auto"
        >
          <option value="all">All Hunters</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.avatar} {u.name}
            </option>
          ))}
        </select>
      </div>

      {/* Leads Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredLeads.length === 0 ? (
          <div className="md:col-span-2 text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
            No merchant leads match the active filter criteria.
          </div>
        ) : (
          filteredLeads.map((lead) => {
            const assignee = users.find((u) => u.id === lead.assignedTo);
            const isOverdue = lead.nextFollowupDate && lead.nextFollowupDate < todayStr && !['won', 'lost'].includes(lead.status);

            return (
              <div
                key={lead.id}
                className={`bg-slate-900 border rounded-xl p-4 space-y-3 transition ${
                  isOverdue
                    ? 'border-red-500/40 bg-red-950/5'
                    : lead.isHotLead
                    ? 'border-amber-500/40'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-white text-sm">{lead.businessName}</h3>
                      <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">
                        {lead.city}
                      </span>
                      {lead.isHotLead && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                          <Flame className="w-3 h-3 fill-amber-300" />
                          HOT
                        </span>
                      )}
                      {isOverdue && (
                        <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-red-500/20 text-red-300 border border-red-500/30 flex items-center gap-0.5">
                          <AlertTriangle className="w-3 h-3" />
                          OVERDUE
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      {lead.contactName ? `${lead.contactName} · ` : ''}{lead.category} · Source: {lead.leadSource}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
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
                  {lead.nextFollowupDate && (
                    <div className="text-[11px] text-slate-400 pt-1 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-cyan-400" />
                      <span>Next Follow-up: <strong className={isOverdue ? 'text-red-400 font-bold' : 'text-slate-200'}>{lead.nextFollowupDate}</strong></span>
                    </div>
                  )}
                </div>

                {/* Communication Launchers */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <div className="flex items-center gap-2">
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

                  <button
                    onClick={() => setLeadToDelete(lead)}
                    className="p-1 rounded text-slate-500 hover:text-red-400 transition"
                    title="Archive Lead"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
          })
        )}
      </div>

      {/* Lead Deletion Confirmation Dialog */}
      {leadToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 max-w-sm w-full space-y-3">
            <div className="text-sm font-bold text-white flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Confirm Lead Archive</span>
            </div>
            <p className="text-xs text-slate-300">
              Are you sure you want to archive <strong>{leadToDelete.businessName}</strong>?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setLeadToDelete(null)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs"
              >
                Archive
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
