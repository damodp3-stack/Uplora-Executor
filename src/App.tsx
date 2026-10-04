import React, { useState, useEffect } from 'react';
import { 
  CompanyStatus, 
  User, 
  Task, 
  Lead, 
  RevenueEntry, 
  Idea, 
  Experiment,
  StrategicDecision, 
  MarketOpportunity, 
  Achievement 
} from './types/index.js';
import { Header } from './components/Header.js';
import { Sidebar, NavView } from './components/Sidebar.js';
import { QuickActionModal } from './components/QuickActionModal.js';
import { MissedTaskModal } from './components/MissedTaskModal.js';
import { DailyCheckinModal } from './components/DailyCheckinModal.js';

// Views
import { DashboardView } from './components/views/DashboardView.js';
import { TaskEngineView } from './components/views/TaskEngineView.js';
import { SalesCRMView } from './components/views/SalesCRMView.js';
import { RevenueView } from './components/views/RevenueView.js';
import { TeamView } from './components/views/TeamView.js';
import { AIManagerView } from './components/views/AIManagerView.js';
import { MarketRadarView } from './components/views/MarketRadarView.js';
import { IdeaEngineView } from './components/views/IdeaEngineView.js';
import { DecisionsView } from './components/views/DecisionsView.js';
import { AchievementsView } from './components/views/AchievementsView.js';
import { DocsReaderView } from './components/views/DocsReaderView.js';
import { BackupView } from './components/views/BackupView.js';

import { 
  Sparkles, 
  X, 
  LayoutDashboard, 
  CheckSquare, 
  Users2, 
  Bot, 
  Plus,
  AlertTriangle
} from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState<CompanyStatus | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [revenue, setRevenue] = useState<RevenueEntry[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [decisions, setDecisions] = useState<StrategicDecision[]>([]);
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Navigation & Modals
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [missedTaskTarget, setMissedTaskTarget] = useState<Task | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; isError?: boolean } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const showToast = (text: string, isError: boolean = false) => {
    setToastMessage({ text, isError });
    setTimeout(() => setToastMessage(null), 4500);
  };

  const loadAllData = async () => {
    try {
      const [
        statusRes,
        usersRes,
        tasksRes,
        leadsRes,
        revenueRes,
        ideasRes,
        expsRes,
        decisionsRes,
        oppsRes,
        achsRes,
      ] = await Promise.all([
        fetch('/api/company/status').then((r) => r.json()),
        fetch('/api/users').then((r) => r.json()),
        fetch('/api/tasks').then((r) => r.json()),
        fetch('/api/leads').then((r) => r.json()),
        fetch('/api/revenue').then((r) => r.json()),
        fetch('/api/ideas').then((r) => r.json()),
        fetch('/api/experiments').then((r) => r.json()),
        fetch('/api/decisions').then((r) => r.json()),
        fetch('/api/opportunities').then((r) => r.json()),
        fetch('/api/achievements').then((r) => r.json()),
      ]);

      setStatus(statusRes);
      setUsers(usersRes);
      if (!currentUser && usersRes.length > 0) {
        setCurrentUser(usersRes[0]); // Default to Damo
      } else if (currentUser) {
        const updated = usersRes.find((u: User) => u.id === currentUser.id);
        if (updated) setCurrentUser(updated);
      }
      setTasks(tasksRes);
      setLeads(leadsRes);
      setRevenue(revenueRes);
      setIdeas(ideasRes);
      setExperiments(Array.isArray(expsRes) ? expsRes : []);
      setDecisions(decisionsRes);
      setOpportunities(oppsRes);
      setAchievements(achsRes);
    } catch (e: any) {
      console.error('Failed to load application data:', e);
      showToast(`Error syncing database: ${e.message}`, true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSelectUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      showToast(`Switched active persona to ${user.name} (${user.title})`);
    }
  };

  // Task Handlers
  const handleCompleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}/complete`, { method: 'PATCH' });
      const data = await res.json();
      if (res.ok) {
        showToast(`🎉 Mission Completed! +${data.xpAwarded} XP awarded to ${currentUser?.name || 'Commander'}`);
        loadAllData();
      } else {
        showToast(`Task update error: ${data.error}`, true);
      }
    } catch (e: any) {
      showToast(`Network error completing task: ${e.message}`, true);
    }
  };

  const handleConfirmMissed = async (taskId: string, reason: string, notes: string) => {
    try {
      const res = await fetch(`/api/tasks/${taskId}/missed`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, notes }),
      });
      if (res.ok) {
        showToast('Mission debrief logged. Strategy and difficulty analyzed.');
        loadAllData();
      } else {
        showToast('Failed to log missed task.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  const handleAdaptTask = async (taskId: string, newTitle: string, newXp: number) => {
    try {
      const res = await fetch('/api/tasks/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, newTitle, newXp }),
      });
      if (res.ok) {
        showToast(`Difficulty auto-adapted! New challenge: "${newTitle}"`);
        loadAllData();
      } else {
        showToast('Failed to adapt task difficulty.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      if (res.ok) {
        showToast('New Quest Objective successfully dispatched!');
        loadAllData();
      } else {
        showToast('Failed to dispatch task.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  // Lead Handlers
  const handleCreateLead = async (leadData: any) => {
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      if (res.ok) {
        showToast('Prospect logged! +5 XP minted.');
        loadAllData();
      } else {
        showToast('Failed to log lead.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  const handleUpdateLeadStage = async (id: string, status: any, notes?: string) => {
    try {
      const res = await fetch(`/api/leads/${id}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (res.ok) {
        if (status === 'won') {
          showToast('🏆 DEAL WON! +250 XP Minted. Remember to record the advance!');
        } else {
          showToast(`Lead stage progressed to ${status}`);
        }
        loadAllData();
      } else {
        showToast('Failed to update stage.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      const res = await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Lead record archived.');
        loadAllData();
      } else {
        showToast('Failed to archive lead.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  // Revenue Handlers
  const handleAddRevenue = async (entry: any) => {
    try {
      const res = await fetch('/api/revenue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`💰 ₹${Number(entry.amount).toLocaleString('en-IN')} Banked! +${data.xpAwarded} XP awarded & ETA updated.`);
        loadAllData();
      } else {
        showToast('Failed to log payment.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  const handleUpdateTarget = async (questTarget: number, monthlyTarget: number) => {
    try {
      const res = await fetch('/api/company/target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questTarget, monthlyTarget }),
      });
      if (res.ok) {
        showToast('Company targets customized! ETA recalculated dynamically.');
        loadAllData();
      } else {
        showToast('Failed to update targets.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  // Check-in
  const handleSubmitCheckin = async (checkinData: any) => {
    try {
      const res = await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkinData),
      });
      if (res.ok) {
        showToast('🔥 Operational Check-in Completed! Streak incremented & +25 XP awarded.');
        loadAllData();
      } else {
        showToast('Failed to submit check-in.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  // Ideas & Experiments
  const handleCreateIdea = async (ideaData: any) => {
    try {
      const res = await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ideaData),
      });
      if (res.ok) {
        showToast('Idea registered in 7-day quarantine.');
        loadAllData();
      } else {
        showToast('Failed to register idea.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  const handleUpdateIdeaStatus = async (id: string, status: any) => {
    try {
      const res = await fetch(`/api/ideas/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        showToast(`Idea status updated to ${status}`);
        loadAllData();
      } else {
        showToast('Failed to update idea status.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  const handleLaunchExperiment = async (expData: Partial<Experiment>) => {
    try {
      const res = await fetch('/api/experiments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expData),
      });
      if (res.ok) {
        showToast('🚀 7-Day Validation Experiment Launched!');
        loadAllData();
      } else {
        showToast('Failed to launch experiment.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  const handleUpdateExperimentStatus = async (id: string, outcome: Experiment['outcome'], lessonsLearned?: string) => {
    try {
      const res = await fetch(`/api/experiments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ outcome, lessonsLearned }),
      });
      if (res.ok) {
        showToast(`Experiment outcome marked as ${outcome.toUpperCase()}`);
        loadAllData();
      } else {
        showToast('Failed to update experiment status.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  // Strategic Decisions
  const handleCreateDecision = async (decisionData: any) => {
    try {
      const res = await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(decisionData),
      });
      if (res.ok) {
        showToast('Strategic policy shift submitted for founder review.');
        loadAllData();
      } else {
        showToast('Failed to submit decision.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  const handleUpdateDecisionStatus = async (id: string, status: any, outcomeNote?: string) => {
    try {
      const actor = currentUser?.id || 'damo';
      const res = await fetch(`/api/decisions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, outcomeNote, actor }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(`Decision authorization updated to ${status}.`);
        loadAllData();
      } else {
        showToast(data.error || 'Failed to update decision authorization.', true);
      }
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  // Market Radar
  const handleTriggerMarketScan = async () => {
    try {
      const res = await fetch('/api/gemini/market-radar', { method: 'POST' });
      const data = await res.json();
      if (res.ok) {
        showToast(`Radar scan complete! ${data.opportunities?.length || 0} commercial opportunities discovered.`);
        loadAllData();
      } else {
        showToast(`Radar scan failed: ${data.error}`, true);
      }
    } catch (e: any) {
      showToast('Radar scan failed to connect to Gemini Search Grounding.', true);
    }
  };

  const handleConvertToIdea = async (opp: MarketOpportunity) => {
    try {
      await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: opp.potentialService,
          problem: opp.whyItMatters,
          targetCustomer: 'Indian SMBs in Tamil Nadu / Bangalore',
          proposedSolution: opp.headline,
          potentialRevenue: opp.potentialRevenueEst || 40000,
          difficulty: 'medium',
          costEstimate: 5000,
          validationMethod: 'Offer service to 3 existing website clients',
        }),
      });
      await fetch(`/api/opportunities/${opp.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'converted_to_idea' }),
      });
      showToast('Market opportunity converted into quarantined Idea!');
      loadAllData();
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  const handleConvertToExperiment = async (opp: MarketOpportunity) => {
    try {
      await handleLaunchExperiment({
        title: `Pilot: ${opp.potentialService}`,
        hypothesis: `Pitching ${opp.potentialService} will convert at least 2 retail merchants.`,
        durationDays: 7,
        metricsTracked: 'Outreach calls, WhatsApp pitch messages, closed advance checks',
        successCriteria: 'Bank at least ₹8,000 from pilot offer',
      });
      await fetch(`/api/opportunities/${opp.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'converted_to_experiment' }),
      });
      showToast('Opportunity converted into running 7-Day Experiment!');
      loadAllData();
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  const handleDismissOpportunity = async (id: string) => {
    try {
      await fetch(`/api/opportunities/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'dismissed' }),
      });
      showToast('Opportunity dismissed.');
      loadAllData();
    } catch (e: any) {
      showToast(`Error: ${e.message}`, true);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 pb-16 md:pb-0">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div
          className={`fixed bottom-20 md:bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce ${
            toastMessage.isError
              ? 'bg-red-600 text-white shadow-red-600/30'
              : 'bg-amber-500 text-slate-950 shadow-amber-500/20'
          }`}
        >
          {toastMessage.isError ? (
            <AlertTriangle className="w-4 h-4" />
          ) : (
            <Sparkles className="w-4 h-4" />
          )}
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="ml-2 hover:opacity-75">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Top Progress & Command Header */}
      <Header
        status={status}
        currentUser={currentUser}
        onOpenQuickAction={() => setIsQuickActionOpen(true)}
        onOpenCheckin={() => setIsCheckinOpen(true)}
        onToggleSidebarMobile={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Desktop Sidebar Nav */}
        <Sidebar
          currentView={currentView}
          onSelectView={setCurrentView}
          currentUser={currentUser}
          onSelectUser={handleSelectUser}
          users={users}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {isLoading ? (
            <div className="py-24 text-center space-y-3">
              <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <div className="text-xs text-slate-400 font-mono">Synchronizing Uplora Command Database...</div>
            </div>
          ) : (
            <>
              {currentView === 'dashboard' && (
                <DashboardView
                  status={status}
                  tasks={tasks}
                  users={users}
                  leads={leads}
                  revenue={revenue}
                  opportunities={opportunities}
                  onCompleteTask={handleCompleteTask}
                  onMissTask={(t) => setMissedTaskTarget(t)}
                  onNavigate={setCurrentView}
                  onOpenCheckin={() => setIsCheckinOpen(true)}
                  onOpenQuickAction={() => setIsQuickActionOpen(true)}
                />
              )}

              {currentView === 'tasks' && (
                <TaskEngineView
                  tasks={tasks}
                  users={users}
                  onCompleteTask={handleCompleteTask}
                  onMissTask={(t) => setMissedTaskTarget(t)}
                  onOpenQuickAction={() => setIsQuickActionOpen(true)}
                />
              )}

              {currentView === 'crm' && (
                <SalesCRMView
                  leads={leads}
                  users={users}
                  onUpdateLeadStage={handleUpdateLeadStage}
                  onDeleteLead={handleDeleteLead}
                  onOpenQuickAction={() => setIsQuickActionOpen(true)}
                />
              )}

              {currentView === 'revenue' && (
                <RevenueView
                  status={status}
                  revenue={revenue}
                  onAddRevenue={handleAddRevenue}
                  onUpdateTarget={handleUpdateTarget}
                  onOpenQuickAction={() => setIsQuickActionOpen(true)}
                />
              )}

              {currentView === 'team' && (
                <TeamView users={users} tasks={tasks} />
              )}

              {currentView === 'ai_manager' && (
                <AIManagerView
                  status={status}
                  currentUser={currentUser}
                  onRefreshData={loadAllData}
                />
              )}

              {currentView === 'market_radar' && (
                <MarketRadarView
                  opportunities={opportunities}
                  onTriggerScan={handleTriggerMarketScan}
                  onConvertToIdea={handleConvertToIdea}
                  onConvertToExperiment={handleConvertToExperiment}
                  onDismissOpportunity={handleDismissOpportunity}
                />
              )}

              {currentView === 'ideas' && (
                <IdeaEngineView
                  ideas={ideas}
                  experiments={experiments}
                  onUpdateIdeaStatus={handleUpdateIdeaStatus}
                  onLaunchExperiment={handleLaunchExperiment}
                  onUpdateExperimentStatus={handleUpdateExperimentStatus}
                  onOpenQuickAction={() => setIsQuickActionOpen(true)}
                />
              )}

              {currentView === 'decisions' && (
                <DecisionsView
                  decisions={decisions}
                  onUpdateDecisionStatus={handleUpdateDecisionStatus}
                  onOpenQuickAction={() => setIsQuickActionOpen(true)}
                />
              )}

              {currentView === 'achievements' && (
                <AchievementsView achievements={achievements} />
              )}

              {currentView === 'docs' && (
                <DocsReaderView />
              )}

              {currentView === 'backup' && (
                <BackupView status={status} onRefreshData={loadAllData} />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Ergonomic Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-3 py-2 flex items-center justify-around text-[10px]">
        <button
          onClick={() => setCurrentView('dashboard')}
          className={`flex flex-col items-center gap-1 transition ${
            currentView === 'dashboard' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>HUD</span>
        </button>

        <button
          onClick={() => setCurrentView('tasks')}
          className={`flex flex-col items-center gap-1 transition ${
            currentView === 'tasks' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>Quests</span>
        </button>

        {/* Center Quick Action */}
        <button
          onClick={() => setIsQuickActionOpen(true)}
          className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/30 -mt-4 border-2 border-slate-950"
        >
          <Plus className="w-5 h-5" />
        </button>

        <button
          onClick={() => setCurrentView('crm')}
          className={`flex flex-col items-center gap-1 transition ${
            currentView === 'crm' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Users2 className="w-4 h-4" />
          <span>CRM</span>
        </button>

        <button
          onClick={() => setCurrentView('ai_manager')}
          className={`flex flex-col items-center gap-1 transition ${
            currentView === 'ai_manager' ? 'text-purple-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>COO</span>
        </button>
      </nav>

      {/* Global Modals */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        users={users}
        onTaskCreated={handleCreateTask}
        onLeadCreated={handleCreateLead}
        onRevenueAdded={handleAddRevenue}
        onIdeaCreated={handleCreateIdea}
        onDecisionCreated={handleCreateDecision}
      />

      <MissedTaskModal
        task={missedTaskTarget}
        isOpen={!!missedTaskTarget}
        onClose={() => setMissedTaskTarget(null)}
        onConfirmMissed={handleConfirmMissed}
        onAdaptTask={handleAdaptTask}
      />

      <DailyCheckinModal
        isOpen={isCheckinOpen}
        onClose={() => setIsCheckinOpen(false)}
        currentUser={currentUser}
        onSubmitCheckin={handleSubmitCheckin}
      />
    </div>
  );
}
