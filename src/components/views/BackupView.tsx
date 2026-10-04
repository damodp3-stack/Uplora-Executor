import React, { useState } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  RotateCcw, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertTriangle,
  ShieldCheck 
} from 'lucide-react';
import { CompanyStatus } from '../../types/index.js';

interface BackupViewProps {
  status: CompanyStatus | null;
  onRefreshData: () => void;
}

export const BackupView: React.FC<BackupViewProps> = ({ status, onRefreshData }) => {
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleDownloadBackup = () => {
    window.location.href = '/api/backup/export';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const content = event.target?.result as string;
        const res = await fetch('/api/backup/import', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ jsonContent: content }),
        });
        const data = await res.json();
        if (data.success) {
          setImportStatus('Backup restored successfully!');
          onRefreshData();
        } else {
          setImportStatus(`Restore error: ${data.error}`);
        }
      } catch (err: any) {
        setImportStatus(`Failed to read backup: ${err.message}`);
      }
    };
    reader.readAsText(file);
  };

  const handleResetBenchmark = async () => {
    if (!confirm('Are you sure you want to reset database to the Uplora benchmark factory state?')) {
      return;
    }
    setIsResetting(true);
    try {
      const res = await fetch('/api/backup/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setImportStatus('Database reset to Uplora benchmark factory state!');
        onRefreshData();
      }
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Database className="w-5 h-5 text-amber-400" />
          <span>Local Data Sovereignty &amp; Backup Center</span>
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Local-first architecture. You own 100% of your financial ledger, CRM pipeline, and decision history.
        </p>
      </div>

      {importStatus && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{importStatus}</span>
        </div>
      )}

      {/* Main Options Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export JSON Backup */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Download className="w-4 h-4 text-emerald-400" />
              <span>Full JSON Database Backup</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Export an encrypted, complete snapshot of all company records: tasks, leads, cash transactions, decisions, and XP logs.
            </p>
          </div>

          <button
            onClick={handleDownloadBackup}
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20"
          >
            <Download className="w-4 h-4" />
            <span>Download Backup (.json)</span>
          </button>
        </div>

        {/* Restore from JSON */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Upload className="w-4 h-4 text-cyan-400" />
              <span>Restore from JSON File</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload a previously exported backup file to restore complete company state seamlessly without loss of history.
            </p>
          </div>

          <label className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer border border-slate-700">
            <Upload className="w-4 h-4 text-cyan-400" />
            <span>Select Backup File...</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Benchmark Reset Zone */}
      <div className="bg-red-950/20 border border-red-500/30 rounded-2xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-red-400">
          <AlertTriangle className="w-4 h-4" />
          <span>Reset to Uplora Benchmark Factory State</span>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed">
          Restores default benchmark data: ₹40,000 monthly baseline, 3 characters (Damo, Partner, Assistant), real initial leads (Velan Silks, Kaveri Dental), and foundational tasks.
        </p>

        <button
          onClick={handleResetBenchmark}
          disabled={isResetting}
          className="px-4 py-2 rounded-xl bg-red-600/80 hover:bg-red-600 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{isResetting ? 'Resetting...' : 'Reset to Benchmark Factory State'}</span>
        </button>
      </div>
    </div>
  );
};
