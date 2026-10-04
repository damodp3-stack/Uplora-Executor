import React, { useState } from 'react';
import { X, CheckCircle2, Flame, Award, Sparkles } from 'lucide-react';
import { User } from '../types/index.js';

interface DailyCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onSubmitCheckin: (checkinData: any) => void;
}

export const DailyCheckinModal: React.FC<DailyCheckinModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSubmitCheckin,
}) => {
  const [formData, setFormData] = useState({
    completedSummary: '',
    missedSummary: '',
    missedReasonCategory: 'Didn\'t have time',
    biggestWin: '',
    blockers: '',
    keyOutcome: '',
    revenueLogged: 0,
    tomorrowFocus: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmitCheckin({
      ...formData,
      userId: currentUser?.id || 'damo',
      date: new Date().toISOString().split('T')[0],
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-sm font-bold text-white tracking-wide">Daily Execution Check-in (8 Questions)</h2>
              <p className="text-[11px] text-slate-400">Nightly operational alignment · Awards +25 XP &amp; builds streak</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Streak banner */}
        <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-medium">
            <Flame className="w-4 h-4 fill-amber-400" />
            <span>Current Streak: {currentUser?.streak || 4} Days</span>
          </div>
          <span className="text-[11px] text-amber-300/80 font-mono">Streak multiplier: 1.4x XP</span>
        </div>

        {/* 8-Question Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Q1 & Q2 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                1. What did you complete today? *
              </label>
              <textarea
                required
                rows={2}
                placeholder="e.g. 11 client pitch calls, Kaveri Dental demo shipped"
                value={formData.completedSummary}
                onChange={(e) => setFormData({ ...formData, completedSummary: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                2. What did you miss today?
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Missed 4 calls out of 15 quota"
                value={formData.missedSummary}
                onChange={(e) => setFormData({ ...formData, missedSummary: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* Q3: Why */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              3. If you missed, what was the primary reason?
            </label>
            <select
              value={formData.missedReasonCategory}
              onChange={(e) => setFormData({ ...formData, missedReasonCategory: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-amber-500"
            >
              <option value="Didn't have time">Didn't have time / focus window</option>
              <option value="Couldn't reach prospects">Couldn't reach prospects / numbers dead</option>
              <option value="Higher priority came">Higher priority fire came</option>
              <option value="Technical problem">Technical problem / tooling broke</option>
              <option value="Didn't know how">Didn't know how / needed guidance</option>
              <option value="Lost motivation">Felt resistance / motivation dip</option>
              <option value="N/A - Completed Everything">N/A - Completed 100% of Missions!</option>
            </select>
          </div>

          {/* Q4 & Q5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                4. What was your biggest win today? *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Velan Silks requested formal ₹14k quote"
                value={formData.biggestWin}
                onChange={(e) => setFormData({ ...formData, biggestWin: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                5. What blocked or slowed you down?
              </label>
              <input
                type="text"
                placeholder="e.g. Assistant lead list had outdated contacts"
                value={formData.blockers}
                onChange={(e) => setFormData({ ...formData, blockers: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          {/* Q6 & Q7 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                6. Today's most important commercial outcome
              </label>
              <input
                type="text"
                placeholder="e.g. Advance cleared or validated StoreIK pitch"
                value={formData.keyOutcome}
                onChange={(e) => setFormData({ ...formData, keyOutcome: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-medium mb-1">
                7. Cash collected today (₹ INR)
              </label>
              <input
                type="number"
                min={0}
                placeholder="0"
                value={formData.revenueLogged}
                onChange={(e) => setFormData({ ...formData, revenueLogged: Number(e.target.value) })}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-amber-500 font-mono font-bold text-amber-400"
              />
            </div>
          </div>

          {/* Q8 */}
          <div>
            <label className="block text-slate-300 font-medium mb-1">
              8. What single mission requires absolute focus tomorrow? *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Close Velan Silks and enforce 30 leads quota for Assistant"
              value={formData.tomorrowFocus}
              onChange={(e) => setFormData({ ...formData, tomorrowFocus: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Modal Footer */}
          <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Submitting updates streak &amp; mints +25 XP
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
              >
                Close
              </button>
              <button
                type="submit"
                className="px-5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-md shadow-emerald-600/20"
              >
                Complete Check-in
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
