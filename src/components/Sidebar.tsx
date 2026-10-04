import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Users2,
  IndianRupee,
  Bot,
  Radar,
  Lightbulb,
  Scale,
  Award,
  BookOpen,
  Database,
  UserCheck,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { User } from '../types/index.js';

export type NavView =
  | 'dashboard'
  | 'tasks'
  | 'crm'
  | 'revenue'
  | 'team'
  | 'ai_manager'
  | 'market_radar'
  | 'ideas'
  | 'decisions'
  | 'achievements'
  | 'docs'
  | 'backup';

interface SidebarProps {
  currentView: NavView;
  onSelectView: (view: NavView) => void;
  currentUser: User | null;
  onSelectUser: (userId: string) => void;
  users: User[];
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  currentUser,
  onSelectUser,
  users,
  isMobileOpen,
  onCloseMobile,
}) => {
  const navItems: { id: NavView; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string }[] = [
    { id: 'dashboard', label: 'Command HUD', icon: LayoutDashboard },
    { id: 'tasks', label: 'Quest Engine', icon: CheckSquare, badge: 'Daily' },
    { id: 'crm', label: 'Sales CRM', icon: Users2 },
    { id: 'revenue', label: 'Revenue & ETA', icon: IndianRupee },
    { id: 'team', label: 'Team Command', icon: UserCheck },
    { id: 'ai_manager', label: 'AI COO (Gemini)', icon: Bot, badge: 'Active' },
    { id: 'market_radar', label: 'Market Radar', icon: Radar, badge: 'Live' },
    { id: 'ideas', label: 'Idea Engine', icon: Lightbulb },
    { id: 'decisions', label: 'Decision Ledger', icon: Scale },
    { id: 'achievements', label: 'Trophy Vault', icon: Award },
    { id: 'docs', label: 'Blueprints (21 Docs)', icon: BookOpen },
    { id: 'backup', label: 'Data & Backup', icon: Database },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:sticky top-0 md:top-[61px] left-0 h-screen md:h-[calc(100vh-61px)] w-64 bg-slate-950 border-r border-slate-800 flex flex-col z-50 md:z-20 transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* User Switcher / Current Persona */}
        <div className="p-3.5 border-b border-slate-800/80">
          <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Active Persona
          </div>
          <div className="flex gap-1 bg-slate-900/90 p-1 rounded-lg border border-slate-800">
            {users.map((u) => {
              const isSelected = currentUser?.id === u.id;
              return (
                <button
                  key={u.id}
                  onClick={() => onSelectUser(u.id)}
                  className={`flex-1 py-1.5 px-2 rounded-md text-xs font-medium transition flex items-center justify-center gap-1 cursor-pointer ${
                    isSelected
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                  title={`${u.name} (${u.title})`}
                >
                  <span>{u.avatar}</span>
                  <span className="truncate">{u.name}</span>
                </button>
              );
            })}
          </div>
          {currentUser && (
            <div className="mt-2 text-[11px] text-slate-400 flex items-center justify-between">
              <span>{currentUser.title}</span>
              <span className="text-amber-400 font-mono">Lv.{currentUser.level}</span>
            </div>
          )}
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectView(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      item.badge === 'Live'
                        ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                        : item.badge === 'Active'
                        ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Strategic Guardrail / Anti-Hopping Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2 text-[11px] text-amber-400 font-medium mb-1">
            <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
            <span>Anti-Distraction Rule</span>
          </div>
          <p className="text-[10px] text-slate-400 leading-relaxed">
            No shiny pivots until ₹1,00,000 monthly cash baseline is secured. Protect founder focus.
          </p>
        </div>
      </aside>
    </>
  );
};
