import React, { useState } from 'react';
import { MarketOpportunity } from '../../types/index.js';
import { 
  Radar, 
  Search, 
  Sparkles, 
  Lightbulb, 
  TrendingUp, 
  CheckCircle2, 
  ExternalLink,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

interface MarketRadarViewProps {
  opportunities: MarketOpportunity[];
  onTriggerScan: () => Promise<void>;
  onConvertToIdea: (opp: MarketOpportunity) => void;
  onDismissOpportunity: (id: string) => void;
}

export const MarketRadarView: React.FC<MarketRadarViewProps> = ({
  opportunities,
  onTriggerScan,
  onConvertToIdea,
  onDismissOpportunity,
}) => {
  const [isScanning, setIsScanning] = useState(false);
  const [activeSector, setActiveSector] = useState<string>('all');

  const handleScan = async () => {
    setIsScanning(true);
    try {
      await onTriggerScan();
    } finally {
      setIsScanning(false);
    }
  };

  const filtered = opportunities.filter((o) => {
    if (activeSector !== 'all' && o.sector !== activeSector) return false;
    return o.status !== 'dismissed';
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Radar className="w-5 h-5 text-cyan-400" />
            <span>Market Radar &amp; Grounded Opportunity Engine</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time web grounded scanning powered by Gemini with Google Search. Translates macro commerce shifts into actionable Uplora offerings.
          </p>
        </div>

        <button
          onClick={handleScan}
          disabled={isScanning}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition shadow-md shadow-cyan-500/20 cursor-pointer disabled:opacity-50 self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
          <span>{isScanning ? 'Scanning Live Grounding...' : 'Scan Market Radar'}</span>
        </button>
      </div>

      {/* Grounding Explanation Banner */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-start gap-3 text-xs">
        <span className="p-1.5 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-cyan-400 shrink-0">
          <ShieldCheck className="w-4 h-4" />
        </span>
        <div className="space-y-1">
          <div className="font-bold text-white">Uplora Strict Relevance Filter</div>
          <p className="text-slate-400 leading-relaxed">
            The Market Radar forbids dumping irrelevant tech news. Every event is filtered through one ruthless question: <em>"Does this create cashflow or software opportunities for Uplora's local merchants or StoreIK?"</em>
          </p>
        </div>
      </div>

      {/* Sector Filter Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 p-1 rounded-xl gap-1 overflow-x-auto text-xs">
        {[
          { id: 'all', label: 'All Sectors' },
          { id: 'WhatsApp Commerce', label: 'WhatsApp Commerce' },
          { id: 'Instagram Selling', label: 'Instagram Selling' },
          { id: 'Indian MSME & E-Commerce', label: 'Indian MSME & Retail' },
          { id: 'AI & Automation', label: 'AI & Automation' },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSector(sec.id)}
            className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer whitespace-nowrap ${
              activeSector === sec.id
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {sec.label}
          </button>
        ))}
      </div>

      {/* Opportunities List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
            No opportunities recorded in this sector. Tap "Scan Market Radar" to execute a live scan.
          </div>
        ) : (
          filtered.map((opp) => (
            <div
              key={opp.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30 text-cyan-400 font-bold">
                      {opp.sector}
                    </span>
                    {opp.sourceDomain && (
                      <span className="text-[11px] text-slate-500 font-mono">
                        Source: {opp.sourceDomain}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{opp.headline}</h3>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-mono font-bold text-amber-400 block">
                    ₹{opp.potentialRevenueEst.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-slate-400">Est. Opportunity Value</span>
                </div>
              </div>

              {/* Translation to Uplora */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-950 p-3.5 rounded-lg border border-slate-800/80">
                <div>
                  <span className="text-cyan-400 font-semibold block mb-0.5">Why this matters to Uplora:</span>
                  <p className="text-slate-300 leading-relaxed">{opp.whyItMatters}</p>
                </div>
                <div>
                  <span className="text-amber-400 font-semibold block mb-0.5">Potential Service Offering:</span>
                  <p className="text-slate-300 leading-relaxed">{opp.potentialService}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-2 border-t border-slate-800/80 flex justify-end gap-2 text-xs">
                <button
                  onClick={() => onDismissOpportunity(opp.id)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 transition"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => onConvertToIdea(opp)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 font-bold transition"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Convert to Idea (7-Day Quarantine)</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
