import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader, Sparkles, ChevronDown } from 'lucide-react';
import { generateArchitecture } from '../services/api';
import toast from 'react-hot-toast';

const SUGGESTIONS = [
  '✨ Add security layer',
  '📈 Make it scalable',
  '📱 Optimize for mobile',
  '💸 Reduce costs',
  '⚡ Add real-time features',
  '🚀 Improve performance',
];

function AIAssistant({ idea, onUpdate }) {
  const [open, setOpen]       = useState(false);
  const [minimized, setMin]   = useState(false);
  const [messages, setMsgs]   = useState([
    { role: 'assistant', text: 'Hi! 👋 I can help refine your architecture. Ask me anything or pick a suggestion below.' },
  ]);
  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef             = useRef(null);

  useEffect(() => {
    if (open && !minimized) bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open, minimized]);

  const handleSend = async (text) => {
    const query = text || input;
    if (!query.trim()) return;

    setMsgs(m => [...m, { role: 'user', text: query }]);
    setInput('');
    setLoading(true);

    try {
      const refinedPrompt = `${idea}\n\nUser's follow-up request: ${query}\n\nPlease generate an updated architecture addressing this request.`;
      const result = await generateArchitecture(refinedPrompt);
      setMsgs(m => [...m, {
        role: 'assistant',
        text: `Done! ✅ I've updated the architecture based on: "${query}"`,
        hasUpdate: true,
        result,
      }]);
      if (onUpdate) onUpdate(result, `${idea} (${query})`);
      toast.success('Architecture updated!', { icon: '✨' });
    } catch (err) {
      console.error('[AIAssistant] Error:', err);
      setMsgs(m => [...m, {
        role: 'assistant',
        text: '😕 Sorry, I ran into an error. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  /* ── Closed state: floating pill ── */
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI assistant"
        className="fixed bottom-6 right-6 z-50 group flex items-center gap-2.5 px-5 py-3.5 text-white rounded-2xl font-semibold text-sm shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-brand-500/30"
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
          boxShadow: '0 8px 24px rgba(37,99,235,0.35), 0 2px 8px rgba(37,99,235,0.2)',
        }}
      >
        {/* Ping ring */}
        <span className="absolute top-0 right-0 flex h-3 w-3 -translate-y-1 translate-x-1">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400" />
        </span>

        <Sparkles size={17} className="group-hover:rotate-12 transition-transform duration-300" />
        <span>AI Assistant</span>
      </button>
    );
  }

  /* ── Open state: chat panel ── */
  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex flex-col rounded-2xl overflow-hidden scale-in"
      style={{
        width: 340,
        height: minimized ? 56 : 500,
        boxShadow: '0 24px 64px rgba(66,99,235,0.2), 0 8px 24px rgba(66,99,235,0.12), 0 0 0 1px rgba(66,99,235,0.1)',
        transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        background: 'white',
      }}
    >
      {/* ── Panel Header ── */}
      <div
        className="flex items-center justify-between px-4 py-3 flex-shrink-0 cursor-pointer"
        style={{ background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)' }}
        onClick={() => setMin(m => !m)}
      >
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Bot size={15} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-white text-sm">AI Architecture Assistant</p>
            <p className="text-white/60 text-xs">{loading ? 'Thinking...' : 'Ready to help'}</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={e => { e.stopPropagation(); setMin(m => !m); }}
            aria-label={minimized ? "Expand AI assistant" : "Minimize AI assistant"}
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <ChevronDown size={16} className={`transition-transform duration-300 ${minimized ? 'rotate-180' : ''}`} />
          </button>
          <button
            onClick={e => { e.stopPropagation(); setOpen(false); }}
            aria-label="Close AI assistant"
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* ── Body (hidden when minimized) ── */}
      {!minimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {messages.map((msg, i) => (
              <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'} fade-in`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-xl flex-shrink-0 flex items-center justify-center mb-0.5"
                       style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}>
                    <Bot size={11} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'text-white rounded-br-md'
                      : 'bg-surface-50 text-gray-700 rounded-bl-md border border-surface-200'
                  }`}
                  style={msg.role === 'user' ? { background: 'linear-gradient(135deg, #2563eb, #0ea5e9)' } : {}}
                >
                  {msg.text}
                  {msg.hasUpdate && (
                    <span className="flex items-center gap-1 mt-1.5 text-xs font-semibold text-emerald-500">
                      <span>✓</span> Architecture updated above
                    </span>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex items-end gap-2">
                <div className="w-6 h-6 rounded-xl flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}>
                  <Bot size={11} className="text-white" />
                </div>
                <div className="bg-surface-50 border border-surface-200 px-4 py-3 rounded-2xl rounded-bl-md">
                  <div className="flex gap-1.5 items-center">
                    {[0,1,2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-bounce"
                            style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick Suggestions */}
          <div className="px-3 py-2.5 border-t border-surface-100">
            <p className="text-xs font-semibold text-gray-400 mb-2">Quick suggestions</p>
            <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => handleSend(s)}
                  disabled={loading}
                  className="flex-shrink-0 px-3 py-1.5 bg-brand-50 text-brand-600 border border-brand-200/60 rounded-lg text-xs font-medium hover:bg-brand-100 hover:border-brand-300 disabled:opacity-50 transition-all whitespace-nowrap"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-3 border-t border-surface-100 bg-surface-50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !loading && handleSend()}
                placeholder="Ask to refine architecture..."
                disabled={loading}
                className="flex-1 px-3.5 py-2.5 text-sm bg-white border border-surface-200 rounded-xl focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-400/10 text-gray-700 placeholder-gray-300 transition-all"
              />
              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                aria-label="Send message"
                className="flex-shrink-0 px-3 py-2 rounded-xl text-white disabled:opacity-50 transition-all hover:scale-105 active:scale-95"
                style={{ background: 'linear-gradient(135deg, #2563eb, #06b6d4)' }}
              >
                {loading ? <Loader size={15} className="animate-spin" /> : <Send size={15} />}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AIAssistant;
