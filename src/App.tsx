import React, { useState, useEffect } from 'react';
import { 
  CompanyStatus, 
  User, 
  Task, 
  Lead, 
  RevenueEntry, 
  Idea, 
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

import { Sparkles, X } from 'lucide-react';

export default function App() {
  const [status, setStatus] = useState<CompanyStatus | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [revenue, setRevenue] = useState<RevenueEntry[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [decisions, setDecisions] = useState<StrategicDecision[]>([]);
  const [opportunities, setOpportunities] = useState<MarketOpportunity[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  // Navigation & Modals
  const [currentView, setCurrentView] = useState<NavView>('dashboard');
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isCheckinOpen, setIsCheckinOpen] = useState(false);
  const [missedTaskTarget, setMissedTaskTarget] = useState<Task | null>(null);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
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
      setDecisions(decisionsRes);
      setOpportunities(oppsRes);
      setAchievements(achsRes);
    } catch (e) {
      console.error('Failed to load application data:', e);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const handleSelectUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      showToast(`Switched persona to ${user.name} (${user.title})`);
    }
  };

  // Task Handlers
  const handleCompleteTask = async (id: string) => {
    try {
      const res = await fetch(`/api/tasks/${id}/complete`, { method: 'PATCH' });
      const data = await res.json();
      showToast(`🎉 Mission Completed! +${data.xpAwarded} XP awarded to ${currentUser?.name || 'Commander'}`);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleConfirmMissed = async (taskId: string, reason: string, notes: string) => {
    try {
      await fetch(`/api/tasks/${taskId}/missed`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, notes }),
      });
      showToast('Mission debrief recorded. Strategy adjusted.');
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAdaptTask = async (taskId: string, newTitle: string, newXp: number) => {
    try {
      await fetch('/api/tasks/adapt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ taskId, newTitle, newXp }),
      });
      showToast(`Difficulty auto-adapted! New challenge: "${newTitle}"`);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateTask = async (taskData: any) => {
    try {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData),
      });
      showToast('New Quest Objective successfully dispatched!');
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  // Lead Handlers
  const handleCreateLead = async (leadData: any) => {
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(leadData),
      });
      showToast('Prospect logged! +5 XP minted.');
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateLeadStage = async (id: string, status: any, notes?: string) => {
    try {
      await fetch(`/api/leads/${id}/stage`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, notes }),
      });
      if (status === 'won') {
        showToast('🏆 DEAL WON! +250 XP Minted. Remember to record the advance!');
      } else {
        showToast(`Lead stage progressed to ${status}`);
      }
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteLead = async (id: string) => {
    try {
      await fetch(`/api/leads/${id}`, { method: 'DELETE' });
      showToast('Lead archived.');
      loadAllData();
    } catch (e) {
      console.error(e);
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
      showToast(`💰 ₹${entry.amount.toLocaleString('en-IN')} Banked! +${data.xpAwarded} XP awarded &amp; ETA updated.`);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTarget = async (questTarget: number, monthlyTarget: number) => {
    try {
      await fetch('/api/company/target', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questTarget, monthlyTarget }),
      });
      showToast('Company targets customized! ETA recalculated.');
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  // Check-in
  const handleSubmitCheckin = async (checkinData: any) => {
    try {
      await fetch('/api/checkins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkinData),
      });
      showToast('🔥 Operational Check-in Completed! Streak incremented &amp; +25 XP awarded.');
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  // Ideas & Decisions
  const handleCreateIdea = async (ideaData: any) => {
    try {
      await fetch('/api/ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ideaData),
      });
      showToast('Idea registered in 7-day quarantine.');
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateIdeaStatus = async (id: string, status: any) => {
    try {
      await fetch(`/api/ideas/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      showToast(`Idea status updated to ${status}`);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateDecision = async (decisionData: any) => {
    try {
      await fetch('/api/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(decisionData),
      });
      showToast('Strategic policy shift submitted for founder review.');
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateDecisionStatus = async (id: string, status: any, outcomeNote?: string) => {
    try {
      await fetch(`/api/decisions/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, outcomeNote }),
      });
      showToast(`Decision authorization updated to ${status}.`);
      loadAllData();
    } catch (e) {
      console.error(e);
    }
  };

  // Market Radar
  const handleTriggerMarketScan = async () => {
    try {
      const res = await fetch('/api/gemini/market-radar', { method: 'POST' });
      const data = await res.json();
      showToast(`Radar scan complete! ${data.opportunities?.length || 0} commercial opportunities discovered.`);
      loadAllData();
    } catch (e) {
      showToast('Radar scan failed to connect to Gemini Search Grounding.');
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
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-500 text-slate-950 px-4 py-2.5 rounded-xl font-bold text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
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
        {/* Sidebar Nav */}
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
            <AIManagerView status={status} currentUser={currentUser} />
          )}

          {currentView === 'market_radar' && (
            <MarketRadarView
              opportunities={opportunities}
              onTriggerScan={handleTriggerMarketScan}
              onConvertToIdea={handleConvertToIdea}
              onDismissOpportunity={handleDismissOpportunity}
            />
          )}

          {currentView === 'ideas' && (
            <IdeaEngineView
              ideas={ideas}
              onUpdateIdeaStatus={handleUpdateIdeaStatus}
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
        </main>
      </div>

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
