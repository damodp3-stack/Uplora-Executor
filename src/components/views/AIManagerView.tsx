import React, { useState, useRef, useEffect } from 'react';
import { CompanyStatus, User } from '../../types/index.js';
import { 
  Bot, 
  Send, 
  Sparkles, 
  AlertTriangle, 
  Database, 
  RotateCcw, 
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface AIManagerViewProps {
  status: CompanyStatus | null;
  currentUser: User | null;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AIManagerView: React.FC<AIManagerViewProps> = ({ status, currentUser }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Greetings, Commander Damo. I am Uplora's autonomous Chief Operating Officer. 

I'm inspecting live company records:
- Current Monthly Run-Rate: ₹40,000 (Target: ₹1,00,000)
- Cumulative Progress: ₹37,500 towards ₹1,00,00,00,000 Quest
- Active Pipeline: ₹42,500 across 4 prospects
- Primary Bottleneck: Sales conversion velocity & follow-up lag.

I will not flatter you. Ask me what must be executed today or challenge me with strategic questions.`,
    },
  ]);

  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showLiveContext, setShowLiveContext] = useState(false);
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
        setMessages([...newMessages, { role: 'assistant', content: data.reply }]);
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

  const QUICK_PROMPTS = [
    'How is Uplora doing right now?',
    'Why are we stuck around ₹40k?',
    'Give me 3 ways to generate ₹20k this week.',
    'Audit the Assistant\'s lead performance.',
    'What should Damo prioritize today?',
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
            Direct, data-grounded AI COO powered by Gemini. Zero sycophancy, anti-idea-hopping, focused on cashflow and closing.
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
              <span className="text-slate-400 block">Streak Days:</span>
              <span className="text-white font-bold">{status?.streakDays} Days</span>
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

              <div
                className={`max-w-2xl p-4 rounded-2xl whitespace-pre-wrap ${
                  isUser
                    ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-xs'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-xs shadow-md'
                }`}
              >
                {m.content}
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
            <span className="animate-pulse">Uplora COO is analyzing database state &amp; drafting tactical recommendations...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

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
          placeholder="Ask COO: 'How do we close Velan Silks this week?' or 'Challenge my pricing strategy'..."
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
