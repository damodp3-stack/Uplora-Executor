import React, { useState } from 'react';
import { Task, User, TaskLayer } from '../../types/index.js';
import { 
  CheckSquare, 
  Plus, 
  Flame, 
  Target, 
  AlertTriangle, 
  Sparkles, 
  Calendar, 
  Compass,
  CheckCircle2,
  XCircle,
  Filter
} from 'lucide-react';

interface TaskEngineViewProps {
  tasks: Task[];
  users: User[];
  onCompleteTask: (id: string) => void;
  onMissTask: (task: Task) => void;
  onOpenQuickAction: () => void;
}

export const TaskEngineView: React.FC<TaskEngineViewProps> = ({
  tasks,
  users,
  onCompleteTask,
  onMissTask,
  onOpenQuickAction,
}) => {
  const [activeLayer, setActiveLayer] = useState<TaskLayer | 'all'>('daily');
  const [selectedOwner, setSelectedOwner] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const filteredTasks = tasks.filter((t) => {
    if (activeLayer !== 'all' && t.layer !== activeLayer) return false;
    if (selectedOwner !== 'all' && t.ownerId !== selectedOwner) return false;
    if (selectedStatus !== 'all' && t.status !== selectedStatus) return false;
    return true;
  });

  const layerStats = {
    daily: tasks.filter((t) => t.layer === 'daily').length,
    weekly: tasks.filter((t) => t.layer === 'weekly').length,
    monthly: tasks.filter((t) => t.layer === 'monthly').length,
    side_quest: tasks.filter((t) => t.layer === 'side_quest').length,
  };

  const missedCount = tasks.filter((t) => t.status === 'missed').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-400" />
            <span>Quest Engine &amp; Execution Command</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized 3-layer execution: Daily tactical quotas, Weekly strategic milestones, and Monthly Boss Battles.
          </p>
        </div>

        <button
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition shadow-md shadow-amber-500/20 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Mission</span>
        </button>
      </div>

      {/* Layer Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 p-1 rounded-xl gap-1 overflow-x-auto">
        {[
          { id: 'daily', label: 'Daily Tactical Quests', count: layerStats.daily },
          { id: 'weekly', label: 'Weekly Missions', count: layerStats.weekly },
          { id: 'monthly', label: 'Monthly Boss Battle 👹', count: layerStats.monthly },
          { id: 'side_quest', label: 'Side Quests ⚡', count: layerStats.side_quest },
          { id: 'all', label: 'All Horizons', count: tasks.length },
        ].map((tab) => {
          const isActive = activeLayer === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveLayer(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                isActive
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
              }`}
            >
              <span>{tab.label}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-800 text-slate-300 font-mono">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400">
          <Filter className="w-3.5 h-3.5" />
          <span>Filters:</span>
        </div>

        <select
          value={selectedOwner}
          onChange={(e) => setSelectedOwner(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white focus:outline-hidden"
        >
          <option value="all">All Characters</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.avatar} {u.name} ({u.title})
            </option>
          ))}
        </select>

        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1 text-white focus:outline-hidden"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed ({completedCount})</option>
          <option value="missed">Missed ({missedCount})</option>
        </select>
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
            No missions found matching this filter criteria.
          </div>
        ) : (
          filteredTasks.map((t) => {
            const owner = users.find((u) => u.id === t.ownerId);
            const isCompleted = t.status === 'completed';
            const isMissed = t.status === 'missed';

            return (
              <div
                key={t.id}
                className={`bg-slate-900 border rounded-xl p-4 transition flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isCompleted
                    ? 'border-emerald-500/30 bg-emerald-950/10'
                    : isMissed
                    ? 'border-red-500/30 bg-red-950/10'
                    : 'border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="text-2xl p-2.5 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
                    {owner?.avatar || '🧑‍🚀'}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-white">{t.title}</span>
                      <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {t.category}
                      </span>
                      <span className="text-[10px] font-mono text-amber-400 font-bold">
                        +{t.xpReward} XP
                      </span>
                      {t.priority === 'critical' && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/20 text-red-400 border border-red-500/30">
                          Critical
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                      {t.description}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span>Owner: <strong className="text-slate-300">{owner?.name}</strong></span>
                      <span>·</span>
                      <span>Due: <strong className="text-slate-300">{t.dueDate}</strong></span>
                      {t.adaptedFromTaskId && (
                        <>
                          <span>·</span>
                          <span className="text-cyan-400 flex items-center gap-1">
                            <Compass className="w-3 h-3" />
                            <span>Difficulty Auto-Adapted</span>
                          </span>
                        </>
                      )}
                    </div>

                    {isMissed && t.missedReason && (
                      <div className="mt-2 p-2 rounded bg-red-950/30 border border-red-500/30 text-[11px] text-red-300 flex items-center gap-2">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-400 shrink-0" />
                        <div>
                          <strong>Missed Root Cause:</strong> {t.missedReason}
                          {t.missedNotes && <span className="text-slate-400 ml-1">({t.missedNotes})</span>}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Status & Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                  {!isCompleted && !isMissed ? (
                    <>
                      <button
                        onClick={() => onCompleteTask(t.id)}
                        className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-600/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Complete (+{t.xpReward} XP)</span>
                      </button>
                      <button
                        onClick={() => onMissTask(t)}
                        className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-300 text-xs transition cursor-pointer"
                      >
                        Missed
                      </button>
                    </>
                  ) : (
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 ${
                        isCompleted
                          ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/30'
                          : 'text-red-400 bg-red-500/10 border border-red-500/30'
                      }`}
                    >
                      {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                      <span>{isCompleted ? 'Mission Succeeded' : 'Uncompleted / Debriefed'}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
