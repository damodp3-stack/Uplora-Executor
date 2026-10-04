import React, { useState } from 'react';
import { 
  X, 
  CheckSquare, 
  Users2, 
  IndianRupee, 
  Lightbulb, 
  Scale,
  Sparkles
} from 'lucide-react';
import { User } from '../types/index.js';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  onTaskCreated: (task: any) => void;
  onLeadCreated: (lead: any) => void;
  onRevenueAdded: (rev: any) => void;
  onIdeaCreated: (idea: any) => void;
  onDecisionCreated: (decision: any) => void;
}

type TabType = 'task' | 'lead' | 'revenue' | 'idea' | 'decision';

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  users,
  onTaskCreated,
  onLeadCreated,
  onRevenueAdded,
  onIdeaCreated,
  onDecisionCreated,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('task');

  // Form states
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    ownerId: 'damo',
    layer: 'daily',
    category: 'sales',
    priority: 'high',
    difficulty: 'medium',
    xpReward: 100,
    dueDate: new Date().toISOString().split('T')[0],
  });

  const [leadForm, setLeadForm] = useState({
    businessName: '',
    contactName: '',
    phone: '',
    whatsapp: '',
    instagram: '',
    city: 'Coimbatore',
    category: 'Fashion Retail',
    problemIdentified: '',
    proposedSolution: 'Uplora Custom Website + WhatsApp Catalog',
    estimatedValue: 10000,
    leadSource: 'Instagram',
    assignedTo: 'damo',
  });

  const [revenueForm, setRevenueForm] = useState({
    clientName: '',
    serviceType: 'website',
    amount: 10000,
    paymentDate: new Date().toISOString().split('T')[0],
    notes: 'Advance for web project',
  });

  const [ideaForm, setIdeaForm] = useState({
    title: '',
    problem: '',
    targetCustomer: '',
    proposedSolution: '',
    potentialRevenue: 50000,
    difficulty: 'medium',
    costEstimate: 5000,
    validationMethod: '7-day pre-order pilot with 3 pilot clients',
  });

  const [decisionForm, setDecisionForm] = useState({
    title: '',
    rationale: '',
    expectedOutcome: '',
    reviewDate: new Date(Date.now() + 30 * 86400000).toISOString().split('T')[0],
    revenueImpact: 'Preserves existing website revenue buffer',
    customerRisk: 'Minimal customer friction',
    teamCapacity: 'Requires 4 hours/week allocation',
    recommendedPilotDays: 14,
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'task') {
      if (!taskForm.title) return;
      onTaskCreated(taskForm);
      setTaskForm({ ...taskForm, title: '', description: '' });
    } else if (activeTab === 'lead') {
      if (!leadForm.businessName) return;
      onLeadCreated(leadForm);
      setLeadForm({ ...leadForm, businessName: '', contactName: '', phone: '', whatsapp: '' });
    } else if (activeTab === 'revenue') {
      if (!revenueForm.clientName || !revenueForm.amount) return;
      onRevenueAdded(revenueForm);
      setRevenueForm({ ...revenueForm, clientName: '', amount: 10000 });
    } else if (activeTab === 'idea') {
      if (!ideaForm.title) return;
      onIdeaCreated(ideaForm);
      setIdeaForm({ ...ideaForm, title: '', problem: '', proposedSolution: '' });
    } else if (activeTab === 'decision') {
      if (!decisionForm.title) return;
      onDecisionCreated({
        title: decisionForm.title,
        rationale: decisionForm.rationale,
        expectedOutcome: decisionForm.expectedOutcome,
        reviewDate: decisionForm.reviewDate,
        riskAssessment: {
          revenueImpact: decisionForm.revenueImpact,
          customerRisk: decisionForm.customerRisk,
          teamCapacity: decisionForm.teamCapacity,
          recommendedPilotDays: Number(decisionForm.recommendedPilotDays) || 14,
        },
      });
      setDecisionForm({ ...decisionForm, title: '', rationale: '', expectedOutcome: '' });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-white tracking-wide">Quick Action Dispatch</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-3 pt-2 gap-1 overflow-x-auto">
          {[
            { id: 'task', label: '+ Quest / Task', icon: CheckSquare },
            { id: 'lead', label: '+ Lead', icon: Users2 },
            { id: 'revenue', label: '+ Cash / Revenue', icon: IndianRupee },
            { id: 'idea', label: '+ Idea (Quarantine)', icon: Lightbulb },
            { id: 'decision', label: '+ Strategic Decision', icon: Scale },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg transition border-b-2 cursor-pointer ${
                  isActive
                    ? 'border-amber-400 text-amber-300 bg-slate-900'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* TASK TAB */}
          {activeTab === 'task' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Mission / Task Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Damo: Call 15 retail saree merchants in Coimbatore"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Assignee (Owner)</label>
                  <select
                    value={taskForm.ownerId}
                    onChange={(e) => setTaskForm({ ...taskForm, ownerId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.avatar} {u.name} ({u.title})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Layer Horizon</label>
                  <select
                    value={taskForm.layer}
                    onChange={(e) => setTaskForm({ ...taskForm, layer: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="daily">Daily Tactical Quest</option>
                    <option value="weekly">Weekly Strategic Mission</option>
                    <option value="monthly">Monthly Boss Battle 👹</option>
                    <option value="side_quest">Side Quest ⚡</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Category</label>
                  <select
                    value={taskForm.category}
                    onChange={(e) => setTaskForm({ ...taskForm, category: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="sales">Sales & Closing</option>
                    <option value="delivery">Technical Delivery</option>
                    <option value="lead_gen">Lead Generation</option>
                    <option value="strategy">Strategy</option>
                    <option value="product">StoreIK / Product</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">XP Reward</label>
                  <input
                    type="number"
                    value={taskForm.xpReward}
                    onChange={(e) => setTaskForm({ ...taskForm, xpReward: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Brief Description</label>
                <textarea
                  rows={2}
                  placeholder="Specific measurable outcome for this task..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </>
          )}

          {/* LEAD TAB */}
          {activeTab === 'lead' && (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Business / Shop Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sri Balaji Textiles"
                    value={leadForm.businessName}
                    onChange={(e) => setLeadForm({ ...leadForm, businessName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Contact Person</label>
                  <input
                    type="text"
                    placeholder="e.g. Mr. Sundar"
                    value={leadForm.contactName}
                    onChange={(e) => setLeadForm({ ...leadForm, contactName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">WhatsApp Number (Direct Chat)</label>
                  <input
                    type="text"
                    placeholder="e.g. 919842100000"
                    value={leadForm.whatsapp}
                    onChange={(e) => setLeadForm({ ...leadForm, whatsapp: e.target.value, phone: leadForm.phone || e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Phone Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 9842100000"
                    value={leadForm.phone}
                    onChange={(e) => setLeadForm({ ...leadForm, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">City / Location</label>
                  <input
                    type="text"
                    value={leadForm.city}
                    onChange={(e) => setLeadForm({ ...leadForm, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Category</label>
                  <input
                    type="text"
                    value={leadForm.category}
                    onChange={(e) => setLeadForm({ ...leadForm, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Est. Value (₹)</label>
                  <input
                    type="number"
                    value={leadForm.estimatedValue}
                    onChange={(e) => setLeadForm({ ...leadForm, estimatedValue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Problem Identified</label>
                <input
                  type="text"
                  placeholder="e.g. No catalog link, loses orders in Instagram DMs, slow Wix site"
                  value={leadForm.problemIdentified}
                  onChange={(e) => setLeadForm({ ...leadForm, problemIdentified: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Assigned Prospector</label>
                  <select
                    value={leadForm.assignedTo}
                    onChange={(e) => setLeadForm({ ...leadForm, assignedTo: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="damo">Damo (CEO)</option>
                    <option value="assistant">Assistant (Lead Hunter)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Lead Source</label>
                  <select
                    value={leadForm.leadSource}
                    onChange={(e) => setLeadForm({ ...leadForm, leadSource: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="Instagram">Instagram DM / Bio</option>
                    <option value="Google Maps">Google Maps</option>
                    <option value="Referral">Client Referral</option>
                    <option value="Walk-in">Walk-in / Local visit</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* REVENUE TAB */}
          {activeTab === 'revenue' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Client / Merchant Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kaveri Dental Care"
                  value={revenueForm.clientName}
                  onChange={(e) => setRevenueForm({ ...revenueForm, clientName: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Banked Amount (₹ INR) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={revenueForm.amount}
                    onChange={(e) => setRevenueForm({ ...revenueForm, amount: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 font-mono text-base font-bold text-amber-400"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    Awards {Math.floor(revenueForm.amount / 100)} XP to Damo (1 XP / ₹100)
                  </span>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Service Type</label>
                  <select
                    value={revenueForm.serviceType}
                    onChange={(e) => setRevenueForm({ ...revenueForm, serviceType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  >
                    <option value="website">Custom Website Development</option>
                    <option value="whatsapp_automation">WhatsApp Automation / Chatbot</option>
                    <option value="storeik">StoreIK Platform</option>
                    <option value="ecommerce">E-commerce Store</option>
                    <option value="maintenance">Maintenance / Retainer</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Payment Notes</label>
                <input
                  type="text"
                  placeholder="e.g. 50% project kickoff advance received via UPI"
                  value={revenueForm.notes}
                  onChange={(e) => setRevenueForm({ ...revenueForm, notes: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </>
          )}

          {/* IDEA TAB */}
          {activeTab === 'idea' && (
            <>
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 text-[11px] leading-relaxed">
                🛡️ <strong>7-Day Quarantine Principle</strong>: All new concepts are held in quarantine for 7 days. No code may be written until customer validation or pre-orders are proven.
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Idea Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. StoreIK: Quick UPI QR generator for WhatsApp catalog"
                  value={ideaForm.title}
                  onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Problem Identified</label>
                  <input
                    type="text"
                    placeholder="What specific merchant pain does this solve?"
                    value={ideaForm.problem}
                    onChange={(e) => setIdeaForm({ ...ideaForm, problem: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Target Customer</label>
                  <input
                    type="text"
                    placeholder="e.g. Saree & jewelry sellers on Instagram"
                    value={ideaForm.targetCustomer}
                    onChange={(e) => setIdeaForm({ ...ideaForm, targetCustomer: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Potential Revenue (₹)</label>
                  <input
                    type="number"
                    value={ideaForm.potentialRevenue}
                    onChange={(e) => setIdeaForm({ ...ideaForm, potentialRevenue: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Validation Method (Pilot)</label>
                  <input
                    type="text"
                    value={ideaForm.validationMethod}
                    onChange={(e) => setIdeaForm({ ...ideaForm, validationMethod: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>
            </>
          )}

          {/* DECISION TAB */}
          {activeTab === 'decision' && (
            <>
              <div>
                <label className="block text-slate-400 mb-1 font-medium">Strategic Policy Decision</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mandate 50% upfront deposit before web design kickoff"
                  value={decisionForm.title}
                  onChange={(e) => setDecisionForm({ ...decisionForm, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-medium">Rationale & Strategic Justification</label>
                <textarea
                  rows={2}
                  placeholder="Why is this strategic change required? What data supports it?"
                  value={decisionForm.rationale}
                  onChange={(e) => setDecisionForm({ ...decisionForm, rationale: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Mandatory Review Date</label>
                  <input
                    type="date"
                    value={decisionForm.reviewDate}
                    onChange={(e) => setDecisionForm({ ...decisionForm, reviewDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-medium">Recommended Pilot Duration (Days)</label>
                  <input
                    type="number"
                    value={decisionForm.recommendedPilotDays}
                    onChange={(e) => setDecisionForm({ ...decisionForm, recommendedPilotDays: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-hidden focus:border-amber-500 font-mono"
                  />
                </div>
              </div>
            </>
          )}

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition shadow-md shadow-amber-500/20"
            >
              Save Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
