import React from 'react';
import { User, Task } from '../../types/index.js';
import { 
  Users2, 
  Crown, 
  Swords, 
  Target, 
  Flame, 
  AlertTriangle, 
  TrendingUp, 
  CheckCircle2, 
  Clock 
} from 'lucide-react';

interface TeamViewProps {
  users: User[];
  tasks: Task[];
}

export const TeamView: React.FC<TeamViewProps> = ({ users, tasks }) => {
  const formatINR = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Users2 className="w-5 h-5 text-amber-400" />
          <span>Team Command &amp; Role Architecture</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          3-Character RPG Roster: Operational quotas, attributable output, and execution discipline.
        </p>
      </div>

      {/* 3 Character Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {users.map((user) => {
          const userTasks = tasks.filter((t) => t.ownerId === user.id);
          const completedTasks = userTasks.filter((t) => t.status === 'completed');
          const missedTasks = userTasks.filter((t) => t.status === 'missed');
          const completionRate = userTasks.length > 0 ? Math.round((completedTasks.length / userTasks.length) * 100) : 0;

          const isDamo = user.id === 'damo';
          const isPartner = user.id === 'partner';
          const isAssistant = user.id === 'assistant';

          return (
            <div
              key={user.id}
              className={`bg-slate-900 border rounded-2xl p-5 flex flex-col justify-between space-y-4 relative overflow-hidden ${
                isDamo
                  ? 'border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : isPartner
                  ? 'border-cyan-500/40'
                  : 'border-purple-500/40'
              }`}
            >
              <div className="space-y-3">
                {/* Character Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl p-3 bg-slate-950 rounded-xl border border-slate-800">
                      {user.avatar}
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                        <span>{user.name}</span>
                        {isDamo && <Crown className="w-4 h-4 text-amber-400" />}
                        {isPartner && <Swords className="w-4 h-4 text-cyan-400" />}
                        {isAssistant && <Target className="w-4 h-4 text-purple-400" />}
                      </h2>
                      <p className="text-xs text-slate-400">{user.title}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                      Lv.{user.level}
                    </span>
                    <div className="text-[10px] text-slate-400 font-mono mt-1">{user.xp} XP</div>
                  </div>
                </div>

                {/* Quota & Performance Tracker */}
                <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-medium">Daily Quota Goal:</span>
                    <span className="text-white font-mono font-bold">{user.dailyQuota} {isDamo ? 'calls' : isPartner ? 'deliverables' : 'leads'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Today Completed:</span>
                    <span className="text-emerald-400 font-mono font-bold">{user.dailyCompleted} / {user.dailyQuota}</span>
                  </div>
                  <div className="h-1.5 bg-slate-900 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-amber-500 to-emerald-400 rounded-full"
                      style={{ width: `${Math.min(100, (user.dailyCompleted / user.dailyQuota) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Role Specific Diagnoses */}
                {isDamo && (
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <div className="font-semibold text-amber-400">Growth Commander Mandate:</div>
                    <ul className="list-disc pl-4 text-[11px] text-slate-400 space-y-0.5">
                      <li>Sales calls, merchant demos, closing deals</li>
                      <li>StoreIK &amp; Akyzer strategic direction</li>
                      <li>Pricing negotiations &amp; cash collection</li>
                    </ul>
                  </div>
                )}

                {isPartner && (
                  <div className="text-xs space-y-1.5 text-slate-300">
                    <div className="font-semibold text-cyan-400">CTO Architecture Mandate:</div>
                    <ul className="list-disc pl-4 text-[11px] text-slate-400 space-y-0.5">
                      <li>High-converting client website builds</li>
                      <li>WhatsApp automation &amp; Flows integration</li>
                      <li>StoreIK scalable codebase architecture</li>
                    </ul>
                  </div>
                )}

                {isAssistant && (
                  <div className="space-y-2">
                    <div className="p-2.5 bg-purple-950/30 border border-purple-500/30 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between items-center text-purple-300 font-semibold">
                        <span>Financial Audit</span>
                        <span className="font-mono">{formatINR(user.monthlyCost || 5000)}/mo cost</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        Attributable Value: <strong className="text-emerald-400">{formatINR(user.monthlyAttributableRevenue || 8500)}</strong>
                      </div>
                      <div className="text-[10px] text-red-400 flex items-center gap-1 mt-1">
                        <AlertTriangle className="w-3 h-3 shrink-0" />
                        <span>Attributable yield &lt; ₹10k benchmark. Requires lead quality enforcement.</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Character Footer Stats */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1 text-amber-400">
                  <Flame className="w-3.5 h-3.5 fill-amber-400" />
                  <span>{user.streak} Day Streak</span>
                </span>
                <span>{completedTasks.length} Done · {missedTasks.length} Missed</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
