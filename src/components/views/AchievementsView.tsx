import React from 'react';
import { Achievement } from '../../types/index.js';
import { Award, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

interface AchievementsViewProps {
  achievements: Achievement[];
}

export const AchievementsView: React.FC<AchievementsViewProps> = ({ achievements }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Trophy Vault &amp; Commercial Milestones</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real commercial victories only. Vanity tasks award zero trophies; banked cash and product breakthroughs unlock glory.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-right">
          <div className="text-[10px] text-slate-400 uppercase font-semibold">Trophies Conquered</div>
          <div className="text-lg font-black text-amber-400 font-mono">
            {unlockedCount} / {achievements.length}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {achievements.map((ach) => {
          return (
            <div
              key={ach.id}
              className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition ${
                ach.unlocked
                  ? 'bg-slate-900 border-amber-500/40 shadow-lg shadow-amber-500/5'
                  : 'bg-slate-950/40 border-slate-800/80 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="text-3xl p-3 bg-slate-950 rounded-xl border border-slate-800">
                    {ach.icon}
                  </div>
                  {ach.unlocked ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Unlocked</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="font-bold text-white text-sm">{ach.title}</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <span className="text-amber-400 font-bold">+{ach.xpReward} XP</span>
                {ach.unlockedAt && (
                  <span className="text-[10px] text-slate-500">
                    {new Date(ach.unlockedAt).toLocaleDateString()}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
