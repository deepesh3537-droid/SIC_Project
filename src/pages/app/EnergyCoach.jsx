import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Bot, 
  Send, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle, 
  Calendar, 
  Lightbulb, 
  ArrowRight, 
  CheckCircle2, 
  Info,
  Loader2,
  RefreshCw,
  Zap,
  Clock,
  TrendingDown
} from 'lucide-react';
import api from '../../services/api.js';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Badge from '../../components/ui/Badge.jsx';
import LoadingState from '../../components/ui/LoadingState.jsx';
import ErrorState from '../../components/ui/ErrorState.jsx';

export default function EnergyCoach() {
  const [searchParams] = useSearchParams();
  const alertIdParam = searchParams.get('alertId');
  const queryParam = searchParams.get('q');

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [coachStatus, setCoachStatus] = useState(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Fetch coach status (Ollama vs Deterministic Fallback)
  const fetchStatus = async () => {
    try {
      const res = await api.get('/coach/status');
      setCoachStatus(res.data);
    } catch (err) {
      console.warn('Failed to load coach status; defaulting to deterministic', err);
      setCoachStatus({
        status: 'online',
        activeEngine: 'deterministic_fallback',
        isLlmActive: false,
        ollama: { available: false, reason: 'Ollama unreachable' }
      });
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // Initial welcome message or alert explanation
  useEffect(() => {
    if (messages.length === 0) {
      if (alertIdParam) {
        handleSendMessage('Why did I get this alert?', { contextId: alertIdParam, contextType: 'alert' });
      } else if (queryParam) {
        handleSendMessage(queryParam);
      } else {
        setMessages([
          {
            id: 'welcome',
            sender: 'coach',
            text: "Hello James! I am your WattWise AI Energy Coach. I analyze verified telemetry from your household (HOME-JAMES-001) to help you understand your energy use, eliminate peak surcharges, and optimize appliance runtimes.\n\nAsk me anything about your energy bill, recent alerts, appliance breakdowns, or weekly performance!",
            source: 'deterministic_fallback',
            disclaimer: 'Grounded strictly in verified telemetry facts. Zero unverified claims.',
            factsUsed: [
              { metric: 'Household ID', value: 'HOME-JAMES-001', type: 'Measured' },
              { metric: 'Verified Records', value: '5,832 hourly intervals', type: 'Measured' },
              { metric: 'Current Efficiency', value: '84 / 100 (Good)', type: 'Estimated' }
            ],
            suggestedQuestions: [
              'What uses the most energy in my home?',
              'When is peak electricity pricing?',
              'How can I lower my electricity bill?',
              'Give me a weekly energy summary.'
            ]
          }
        ]);
      }
    }
  }, [alertIdParam, queryParam]);

  const handleSendMessage = async (userText, extraContext = {}) => {
    const textToSend = userText || inputValue;
    if (!textToSend.trim() || loading) return;

    const userMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await api.post('/coach/ask', {
        question: textToSend,
        ...extraContext
      });

      const coachMessage = {
        id: `coach-${Date.now()}`,
        sender: 'coach',
        text: res.data.answer,
        category: res.data.category,
        source: res.data.source,
        modelName: res.data.modelName,
        disclaimer: res.data.disclaimer,
        factsUsed: res.data.factsUsed || [],
        actionableSteps: res.data.actionableSteps || [],
        suggestedQuestions: res.data.suggestedQuestions || [],
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, coachMessage]);
    } catch (err) {
      console.error('Coach ask failed:', err);
      const errorMessage = {
        id: `error-${Date.now()}`,
        sender: 'coach',
        text: "I was temporarily unable to reach the analytics service. In accordance with our Evidence-First principle, here is your deterministic baseline:\n\n• Your household has consumed 3,337.29 kWh ($452.83).\n• HVAC represents 91.83% of your electricity use.\n• Peak TOU hours run 06:00–09:00 and 17:00–21:00 at $0.1878/kWh.",
        source: 'deterministic_fallback',
        disclaimer: 'Offline emergency fallback active.',
        factsUsed: [
          { metric: 'Total Consumption', value: '3,337.29 kWh', type: 'Measured' },
          { metric: 'HVAC Share', value: '91.83%', type: 'Measured' }
        ],
        suggestedQuestions: [
          'What uses the most energy in my home?',
          'When is peak electricity pricing?'
        ]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleWeeklySummary = () => {
    handleSendMessage('Give me a weekly energy summary.', { contextType: 'summary' });
  };

  const starterChips = [
    { label: 'Highest Energy Load', query: 'What uses the most energy in my home?', icon: Zap },
    { label: 'Peak Tariff Windows', query: 'When is peak electricity pricing?', icon: Clock },
    { label: 'Reduce My Bill', query: 'How can I lower my electricity bill?', icon: TrendingDown },
    { label: 'Weekly Summary', query: 'Give me a weekly energy summary.', icon: Calendar },
    { label: 'Efficiency Score', query: 'How is my efficiency score calculated?', icon: ShieldCheck }
  ];

  const isLlmActive = coachStatus?.isLlmActive;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <PageHeader
        title="AI Energy Coach"
        subtitle="Conversational energy intelligence grounded in verified household telemetry with prompt injection defense"
        badge={
          isLlmActive ? (
            <Badge variant="Simulated" label={`Ollama LLM (${coachStatus?.ollama?.modelConfigured || 'Local'})`} />
          ) : (
            <Badge variant="Measured" label="Deterministic Mode (Zero Hallucination)" />
          )
        }
        actions={
          <button
            onClick={handleWeeklySummary}
            disabled={loading}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-2 hover:bg-surface border border-border text-xs font-mono font-medium text-text hover:border-primary/40 transition-colors disabled:opacity-50"
          >
            <Calendar className="w-3.5 h-3.5 text-primary" />
            <span>Weekly Summary</span>
          </button>
        }
      />

      {/* Engine Status Banner */}
      <div className="bg-surface border border-border rounded-card p-4 flex items-center justify-between flex-wrap gap-3 shadow-sm">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl border ${
            isLlmActive 
              ? 'bg-secondary/10 text-secondary border-secondary/30' 
              : 'bg-primary/10 text-primary border-primary/30 shadow-[0_0_12px_rgba(34,211,238,0.15)]'
          }`}>
            <Bot className="w-5 h-5" />
          </div>
          <div className="text-xs">
            <p className="font-semibold text-text flex items-center gap-2">
              <span>Active Engine: {isLlmActive ? `Local LLM (${coachStatus?.ollama?.modelConfigured})` : 'Deterministic Fact & Rule Engine'}</span>
              <span className={`w-2 h-2 rounded-full ${isLlmActive ? 'bg-secondary animate-pulse' : 'bg-primary animate-pulse'}`} />
            </p>
            <p className="text-muted text-[11px] mt-0.5">
              {isLlmActive
                ? 'Responses generated by local Ollama model bounded by strict telemetry guardrails.'
                : '100% offline deterministic fallback active. Grounded exclusively in verified EDA analytics.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-muted bg-surface-2 px-3 py-1.5 rounded-xl border border-border">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Evidence First Principle Enforced</span>
        </div>
      </div>

      {/* Recommended Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
        <span className="text-muted text-[11px] font-medium shrink-0 flex items-center gap-1 mr-1 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-primary" /> Prompts:
        </span>
        {starterChips.map((chip, idx) => {
          const Icon = chip.icon;
          return (
            <button
              key={idx}
              onClick={() => handleSendMessage(chip.query)}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-surface border border-border hover:border-primary/40 hover:bg-surface-2 text-text transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0 text-xs shadow-sm"
            >
              <Icon className="w-3 h-3 text-primary" />
              <span>{chip.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Chat Stream Container */}
      <div className="bg-surface border border-border rounded-card p-5 shadow-sm min-h-[480px] flex flex-col justify-between">
        {/* Messages Stream */}
        <div className="space-y-5 overflow-y-auto max-h-[580px] pr-2 scrollbar-thin">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {/* Message Bubble */}
              <div
                className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-black font-semibold rounded-tr-none shadow-[0_0_15px_rgba(34,211,238,0.2)]'
                    : 'bg-surface-2 border border-border text-text rounded-tl-none shadow-sm space-y-3'
                }`}
              >
                {/* Header for Coach */}
                {msg.sender === 'coach' && (
                  <div className="flex items-center justify-between pb-2 border-b border-border/60 text-[11px] font-mono">
                    <div className="flex items-center gap-2">
                      <Bot className="w-3.5 h-3.5 text-primary" />
                      <span className="font-bold text-text">WattWise Coach</span>
                      <span className="text-muted">
                        ({msg.source === 'ollama' ? 'Local LLM' : 'Deterministic Ground Truth'})
                      </span>
                    </div>
                    {msg.timestamp && <span className="text-muted">{msg.timestamp}</span>}
                  </div>
                )}

                {/* Formatted Text */}
                <div className="whitespace-pre-wrap font-sans text-xs leading-relaxed">
                  {msg.text}
                </div>

                {/* Facts Used Section */}
                {msg.factsUsed && msg.factsUsed.length > 0 && (
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted font-semibold mb-1.5 flex items-center gap-1">
                      <Info className="w-3 h-3 text-primary" /> Verified Telemetry Facts Cited:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.factsUsed.map((f, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-surface border border-border text-[10px] font-mono text-muted flex items-center gap-1.5"
                        >
                          <span className="text-text font-medium">{f.metric}:</span>
                          <span className="text-primary font-bold">{f.value}</span>
                          <Badge variant={f.type || 'Measured'} className="text-[9px] py-0 px-1" />
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Actionable Steps Section */}
                {msg.actionableSteps && msg.actionableSteps.length > 0 && (
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-primary font-semibold mb-1">
                      Recommended Next Actions:
                    </p>
                    <ul className="space-y-1 text-muted text-xs">
                      {msg.actionableSteps.map((step, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Suggested Questions Pills */}
                {msg.suggestedQuestions && msg.suggestedQuestions.length > 0 && (
                  <div className="pt-2 border-t border-border/60">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-muted font-semibold mb-1.5">
                      Suggested Follow-up:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedQuestions.map((sq, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(sq)}
                          disabled={loading}
                          className="px-2.5 py-1 rounded-md bg-surface hover:bg-surface-2 border border-border hover:border-primary/40 text-[11px] text-primary transition-colors text-left font-mono"
                        >
                          &rarr; {sq}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Source & Disclaimer Footer */}
                {msg.disclaimer && (
                  <p className="text-[10px] font-mono text-muted/70 italic pt-1">
                    &bull; {msg.disclaimer}
                  </p>
                )}
              </div>
            </div>
          ))}

          {/* Loading Bubble */}
          {loading && (
            <div className="flex items-start">
              <div className="bg-surface-2 border border-border rounded-2xl rounded-tl-none p-4 text-xs flex items-center gap-2 text-muted shadow-sm">
                <Loader2 className="w-4 h-4 text-primary animate-spin" />
                <span className="font-mono">Grounding response in deterministic telemetry facts...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="mt-4 pt-3 border-t border-border flex items-center gap-3"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask your Energy Coach (e.g., 'Why did I get an alert?' or 'How can I lower my bill?')..."
            aria-label="Ask your Energy Coach"
            disabled={loading}
            className="flex-1 bg-surface-2 border border-border focus:border-primary focus:ring-1 focus:ring-primary/30 focus:outline-none rounded-xl px-4 py-2.5 text-xs text-text placeholder:text-muted/60 transition-colors"
          />
          <button
            type="submit"
            aria-label="Send question to Energy Coach"
            disabled={loading || !inputValue.trim()}
            className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary-hover disabled:opacity-50 text-black font-semibold text-xs transition-colors flex items-center gap-1.5 min-h-[44px] shadow-[0_0_12px_rgba(34,211,238,0.25)]"
          >
            <Send className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
