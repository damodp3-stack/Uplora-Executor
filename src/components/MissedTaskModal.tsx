import React, { useState } from 'react';
import { Task } from '../types/index.js';
import { X, AlertCircle, Compass, ArrowRight, ShieldCheck } from 'lucide-react';

interface MissedTaskModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirmMissed: (taskId: string, reason: string, notes: string) => void;
  onAdaptTask?: (taskId: string, newTitle: string, newXp: number) => void;
}

export const MissedTaskModal: React.FC<MissedTaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onConfirmMissed,
  onAdaptTask,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>('Didn\'t have time');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [showAdaptationPrompt, setShowAdaptationPrompt] = useState<boolean>(false);

  if (!isOpen || !task) return null;

  const REASONS = [
    { label: 'Didn\'t have time / focus blocks', emoji: '😴', val: 'Didn\'t have time' },
    { label: 'Couldn\'t reach prospects / dead contacts', emoji: '📞', val: 'Couldn\'t reach prospects' },
    { label: 'Higher priority fire / client emergency', emoji: '🔥', val: 'Higher priority came' },
    { label: 'Technical problem / tool broken', emoji: '🚧', val: 'Technical problem' },
    { label: 'Uncertain how to execute / skill gap', emoji: '🧠', val: 'Didn\'t know how' },
    { label: 'Felt resistance / lost motivation', emoji: '😕', val: 'Lost motivation' },
    { label: 'Other situational roadblock', emoji: '✍️', val: 'Other' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmMissed(task.id, selectedReason, customNotes);
    
    // Check if adaptation is relevant for quota tasks
    if (task.title.toLowerCase().includes('call') || task.title.toLowerCase().includes('lead')) {
      setShowAdaptationPrompt(true);
    } else {
      onClose();
    }
  };

  const handleApplyAdaptation = () => {
    if (onAdaptTask) {
      const newTitle = task.title.includes('15')
        ? task.title.replace('15', '8 (Adapted Sprint)')
        : `${task.title} - Stepped-Down Sprint`;
      onAdaptTask(task.id, newTitle, Math.max(30, Math.floor(task.xpReward * 0.7)));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400">
              <AlertCircle className="w-4 h-4" />
            </span>
            <h2 className="text-sm font-bold text-white">Mission Debrief: Root Cause</h2>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded">
            <X className="w-4 h-4" />
          </button>
        </div>

        {!showAdaptationPrompt ? (
          <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-1">
                Uncompleted Objective
              </div>
              <div className="text-white font-medium">{task.title}</div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-2">
                Why was this objective missed today?
              </label>
              <div className="space-y-1.5">
                {REASONS.map((r) => {
                  const isSelected = selectedReason === r.val;
                  return (
                    <button
                      key={r.val}
                      type="button"
                      onClick={() => setSelectedReason(r.val)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg border text-left transition cursor-pointer ${
                        isSelected
                          ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 font-medium'
                          : 'bg-slate-950/50 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                      }`}
                    >
                      <span className="text-base">{r.emoji}</span>
                      <span>{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Additional Context / Lessons</label>
              <textarea
                rows={2}
                placeholder="What exactly blocked execution? How will we bypass this tomorrow?"
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition shadow-md shadow-red-600/20"
              >
                Record Debrief
              </button>
            </div>
          </form>
        ) : (
          <div className="p-5 space-y-4 text-xs">
            <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-lg text-amber-300 leading-relaxed flex items-start gap-2">
              <Compass className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>AI Task Adaptation Triggered</strong>: Chronic missed quotas destroy founder morale. The Quest Engine recommends de-escalating this target to rebuild momentum.
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="text-slate-400">Recommended Step-Down Challenge:</div>
              <div className="text-sm font-bold text-white flex items-center gap-2">
                <span>15 calls/day</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-emerald-400">8 calls/day for 3 days</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Once 3 consecutive days of 8 calls are achieved, difficulty will scale automatically to 10 ➔ 12 ➔ 15.
              </p>
            </div>

            <div className="pt-2 flex justify-end gap-2 border-t border-slate-800">
              <button
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Keep Static Target
              </button>
              <button
                onClick={handleApplyAdaptation}
                className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition"
              >
                Apply Adapted Goal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
