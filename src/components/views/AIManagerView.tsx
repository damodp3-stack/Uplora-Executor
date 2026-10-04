import React, { useState, useRef, useEffect } from 'react';
import { CompanyStatus, User, ProposedAction } from '../../types/index.js';
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  Database, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  Play
} from 'lucide-react';

interface AIManagerViewProps {
  status: CompanyStatus | null;
  currentUser: User | null;
  onRefreshData?: () => void;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
  proposedActions?: ProposedAction[];
}

export const AIManagerView: React.FC<AIManagerViewProps> = ({ status, currentUser, onRefreshData }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Greetings, Commander Damo. I am Uplora's autonomous Chief Operating Officer.

I am inspecting live company records from our database:
- Monthly Target: ₹${status?.monthlyTarget?.toLocaleString('en-IN') || '1,00,000'} (Collected so far: ₹${status?.currentMonthlyRevenue?.toLocaleString('en-IN') || '0'})
- Active Pipeline: ₹${status?.pipelineValue?.toLocaleString('en-IN') || '0'} across ${status?.activeLeadsCount || 0} active discussions
- Primary Bottleneck: ${status?.primaryBottleneck || 'Sales Conversion Velocity'}
- Execution Prescription: ${status?.aiPrescription || 'Focus on outbound calls today.'}

I will not flatter you. Ask me what must be executed today, challenge me with strategic pivots, or authorize tactical actions below.`,
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLiveContext, setShowLiveContext] = useState(false);
  const [executingActionId, setExecutingActionId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (userPrompt?: string) => {
    const textToSend = userPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: textToSend }];
    setMessages(newMessages);
    if (!userPrompt) setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          conversationHistory: newMessages.slice(-6),
        }),
      });

      const data = await response.json();
      if (data.reply) {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: data.reply,
            proposedActions: data.proposedActions || [],
          },
        ]);
      } else {
        setMessages([
          ...newMessages,
          { role: 'assistant', content: 'Operational uplink delayed. Please repeat your transmission.' },
        ]);
      }
    } catch (e: any) {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: `Error communicating with AI COO: ${e.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExecuteAction = async (action: ProposedAction) => {
    setExecutingActionId(action.id);
    setActionError(null);
    try {
      const actor = currentUser?.id || 'damo';

      // Step 1: Damo explicitly approves if currently pending
      if (action.status === 'pending') {
        const approveRes = await fetch(`/api/actions/${action.id}/approve`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ actor }),
        });
        const approveData = await approveRes.json();
        if (!approveRes.ok) {
          setActionError(`Approval rejected: ${approveData.error}`);
          return;
        }
      }

      // Step 2: Execute the approved action with parameter verification
      const execRes = await fetch(`/api/actions/${action.id}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actor, params: action.params }),
      });
      const data = await execRes.json();
      if (execRes.ok && data.success) {
        // Update local status of action to executed
        setMessages((prev) =>
          prev.map((msg) => ({
            ...msg,
            proposedActions: msg.proposedActions?.map((act) =>
              act.id === action.id ? { ...act, status: 'executed' } : act
            ),
          }))
        );
        if (onRefreshData) onRefreshData();
      } else {
        setActionError(`Execution failed: ${data.error}`);
      }
    } catch (err: any) {
      setActionError(`Failed to execute action: ${err.message}`);
    } finally {
      setExecutingActionId(null);
    }
  };

  const handleDismissAction = async (actionId: string) => {
    try {
      const actor = currentUser?.id || 'damo';
      await fetch(`/api/actions/${actionId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ actor, reason: 'Dismissed by founder' }),
      });
      setMessages((prev) =>
        prev.map((msg) => ({
          ...msg,
          proposedActions: msg.proposedActions?.map((act) =>
            act.id === actionId ? { ...act, status: 'rejected' } : act
          ),
        }))
      );
    } catch (err: any) {
      setActionError(`Failed to dismiss action: ${err.message}`);
    }
  };

  const QUICK_PROMPTS = [
    'What should I prioritize today?',
    'What is our biggest bottleneck right now?',
    'Why are sales conversion rates lagging?',
    'Which leads should I follow up with immediately?',
    'Give me 3 concrete ways to generate ₹25k this week.',
    'Audit the Assistant\'s lead performance.',
    'Should we build a new dropshipping store?',
  ];

  return (
    <div className="space-y-4 max-w-5xl mx-auto flex flex-col h-[calc(100vh-140px)]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Bot className="w-5 h-5 text-purple-400" />
            <span>Uplora Chief Operating Officer (COO)</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Direct, tactical AI COO with controlled tool calling. Uncompromising commercial accountability with Human Approval Gatekeeper.
          </p>
        </div>

        <button
          onClick={() => setShowLiveContext(!showLiveContext)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs transition cursor-pointer"
        >
          <Database className="w-3.5 h-3.5 text-cyan-400" />
          <span>Live Context</span>
          {showLiveContext ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Collapsible Live Company Context Inspector */}
      {showLiveContext && (
        <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-2 shrink-0">
          <div className="font-semibold text-cyan-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Active Live Database State Injected to COO:</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-400 block">October Cash:</span>
              <span className="text-emerald-400 font-bold">₹{status?.currentMonthlyRevenue.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-400 block">Pipeline Value:</span>
              <span className="text-amber-400 font-bold">₹{status?.pipelineValue.toLocaleString('en-IN')}</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-400 block">Hot Leads:</span>
              <span className="text-white font-bold">{status?.hotLeadsCount || 0} active</span>
            </div>
            <div className="p-2 bg-slate-900 rounded border border-slate-800">
              <span className="text-slate-400 block">Health Index:</span>
              <span className="text-cyan-400 font-bold">{status?.healthScores.composite}/100</span>
            </div>
          </div>
        </div>
      )}

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl">
        {messages.map((m, idx) => {
          const isUser = m.role === 'user';
          return (
            <div
              key={idx}
              className={`flex gap-3 text-xs leading-relaxed ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className="space-y-3 max-w-2xl">
                <div
                  className={`p-4 rounded-2xl whitespace-pre-wrap ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-xs shadow-md'
                  }`}
                >
                  {m.content}
                </div>

                {/* Proposed Action Cards with Human Approval Gatekeeper */}
                {m.proposedActions && m.proposedActions.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>COO Proposed Tactical Actions (Approval Required):</span>
                    </div>

                    {m.proposedActions.map((action) => {
                      const isExecuted = action.status === 'executed';
                      const isApproved = action.status === 'approved';
                      const isRejected = action.status === 'rejected';

                      return (
                        <div
                          key={action.id}
                          className={`p-3.5 rounded-xl border transition ${
                            isExecuted
                              ? 'bg-emerald-950/30 border-emerald-500/50'
                              : isApproved
                              ? 'bg-cyan-950/20 border-cyan-500/40'
                              : isRejected
                              ? 'bg-slate-950/40 border-slate-800 opacity-60'
                              : 'bg-slate-950 border-amber-500/30'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-bold">
                                  {action.tool}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  ID: {action.id}
                                </span>
                              </div>
                              <div className="font-bold text-white text-xs mt-1">
                                {action.params.title || action.params.businessName || action.explanation}
                              </div>
                            </div>

                            <span
                              className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                                isExecuted
                                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                  : isApproved
                                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                                  : isRejected
                                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              }`}
                            >
                              {action.status === 'pending' ? 'PENDING APPROVAL' : action.status.toUpperCase()}
                            </span>
                          </div>

                          <div className="mt-2 text-[11px] text-slate-400">
                            <strong>Impact / Risk:</strong> {action.risk}
                          </div>

                          {(action.status === 'pending' || action.status === 'approved') && (
                            <div className="mt-3 pt-2 border-t border-slate-800/80 flex justify-end gap-2">
                              <button
                                onClick={() => handleDismissAction(action.id)}
                                className="px-3 py-1 rounded bg-slate-800 text-slate-400 hover:text-white transition"
                              >
                                Reject / Dismiss
                              </button>
                              <button
                                onClick={() => handleExecuteAction(action)}
                                disabled={executingActionId === action.id}
                                className="flex items-center gap-1.5 px-3.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-sm cursor-pointer disabled:opacity-50"
                              >
                                <Play className="w-3 h-3" />
                                <span>{executingActionId === action.id ? 'Processing...' : 'Authorize & Execute'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shrink-0 font-bold">
                  👑
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3 text-xs text-slate-400 p-2">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-300">
              <Bot className="w-4 h-4 animate-pulse" />
            </div>
            <span className="animate-pulse">Uplora COO is evaluating pipeline data &amp; selecting tactical tools...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {actionError && (
        <div className="p-3 bg-red-950/40 border border-red-500/40 rounded-xl flex items-center justify-between text-xs text-red-300">
          <span>{actionError}</span>
          <button
            onClick={() => setActionError(null)}
            className="text-slate-400 hover:text-white text-xs px-2 py-0.5 rounded bg-slate-800"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tactical Quick Questions Bar */}
      <div className="flex gap-2 overflow-x-auto pb-1 shrink-0">
        {QUICK_PROMPTS.map((qp) => (
          <button
            key={qp}
            onClick={() => handleSend(qp)}
            disabled={isLoading}
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-amber-500/40 text-[11px] whitespace-nowrap transition cursor-pointer disabled:opacity-50"
          >
            {qp}
          </button>
        ))}
      </div>

      {/* Input bar */}
      <div className="flex gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask COO: 'Which lead should I close today?' or 'How do we reach ₹1,00,000 this month?'..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSend();
          }}
          disabled={isLoading}
          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-hidden focus:border-amber-500"
        />
        <button
          onClick={() => handleSend()}
          disabled={isLoading || !input.trim()}
          className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-2 cursor-pointer shadow-md shadow-amber-500/20 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Transmit</span>
        </button>
      </div>
    </div>
  );
};
