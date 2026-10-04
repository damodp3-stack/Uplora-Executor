import React from 'react';
import { CompanyStatus, User } from '../types/index.js';
import { 
  Flame, 
  Crown, 
  Plus, 
  Sparkles, 
  TrendingUp, 
  CheckCircle2, 
  AlertTriangle,
  Menu
} from 'lucide-react';

interface HeaderProps {
  status: CompanyStatus | null;
  currentUser: User | null;
  onOpenQuickAction: () => void;
  onOpenCheckin: () => void;
  onToggleSidebarMobile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  currentUser,
  onOpenQuickAction,
  onOpenCheckin,
  onToggleSidebarMobile,
}) => {
  const questTarget = status?.questTarget || 1000000000;
  const cumulativeRev = status?.cumulativeRevenue || 0;
  const progressPct = ((cumulativeRev / questTarget) * 100);
  const currentXp = currentUser?.xp || 720;
  const xpNeeded = 1000;
  const xpPct = Math.min(100, Math.round((currentXp % 1000) / 10));

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Mobile menu trigger & Brand */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleSidebarMobile}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20 text-slate-950 font-black text-sm tracking-wider">
              1B
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-white tracking-wide text-sm">UPLORA</span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 border border-amber-500/30 rounded px-1 py-0.2">
                  1B Quest
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">Commerce-Tech Command Center</p>
            </div>
          </div>
        </div>

        {/* Center Progress HUD (Desktop / Tablet) */}
        <div className="hidden lg:flex items-center gap-6 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-1.5">
          {/* ₹1B Progress */}
          <div className="w-48">
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="text-slate-400 font-medium">Quest Progress</span>
              <span className="text-amber-400 font-mono font-semibold">{progressPct.toFixed(4)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(1, Math.min(100, progressPct * 200))}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-400 mt-0.5">
              <span>{formatCurrency(cumulativeRev)}</span>
              <span>Target: {formatCurrency(questTarget)}</span>
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          {/* Level & XP */}
          <div className="w-40">
            <div className="flex justify-between items-center text-[11px] mb-1">
              <span className="text-slate-400 font-medium">Level {currentUser?.level || 1} · {currentUser?.name}</span>
              <span className="text-cyan-400 font-mono font-semibold">{currentXp % 1000}/1000 XP</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${xpPct}%` }}
              />
            </div>
            <div className="text-[10px] text-slate-400 mt-0.5 text-right">
              Total XP: {currentXp}
            </div>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          {/* Streak Indicator */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-400">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-400 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                {status?.streakDays || 4} Day
              </div>
              <div className="text-[10px] text-slate-400">Execution Streak</div>
            </div>
          </div>
        </div>

        {/* Right Action Cluster */}
        <div className="flex items-center gap-2">
          {/* Daily Checkin Trigger */}
          <button
            onClick={onOpenCheckin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium transition cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Daily Check-in</span>
          </button>

          {/* Global Quick Action Button */}
          <button
            onClick={onOpenQuickAction}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md shadow-amber-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Action</span>
          </button>
        </div>
      </div>
    </header>
  );
};
