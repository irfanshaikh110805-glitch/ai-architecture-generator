import { useState, useRef, useEffect } from 'react';
import { Bot, Send, X, Loader, Sparkles, ChevronDown } from 'lucide-react';
import { generateArchitecture } from '../services/api';
import toast from 'react-hot-toast';

const SUGGESTIONS = [
  '⚡ Add security layer',
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
        text: `Done! ⚡ I've updated the architecture based on: "${query}"`,
        hasUpdate: true,
        result,
      }]);
      if (onUpdate) onUpdate(result, `${idea} (${query})`);
      toast.success('Architecture updated!', { icon: '⚡' });
    } catch (err) {
      console.error('[AIAssistant] Error:', err);
      setMsgs(m => [...m, {
        role: 'assistant',
        text: '❌ Error updating architecture. Please try again.',
      }]);
    } finally {
      setLoading(false);
    }
  };

  /* ── Closed state: floating FAB ── */
  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI assistant"
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-40 flex items-center justify-center gap-2 p-3 sm:px-4 sm:py-3 bg-[#FF00FF] text-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-mono text-xs sm:text-sm font-black uppercase"
      >
        <Sparkles size={18} className="stroke-[3]" />
        <span className="hidden sm:inline">AI COPILOT</span>
      </button>
    );
  }

  /* ── Open state: responsive mobile drawer / desktop card ── */
  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="fixed inset-0 bg-black/60 z-50 sm:hidden"
        onClick={() => setOpen(false)}
      />

      <div
        className={`fixed z-50 flex flex-col overflow-hidden bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000000] transition-all ${
          minimized
            ? 'bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-80 h-14'
            : 'inset-x-0 bottom-0 sm:inset-auto sm:bottom-6 sm:right-6 sm:w-96 h-[80vh] sm:h-[500px]'
        }`}
      >
        {/* ── Panel Header ── */}
        <div
          className="flex items-center justify-between px-4 py-3 bg-[#00FF00] border-b-2 border-black flex-shrink-0 cursor-pointer select-none text-black"
          onClick={() => setMin(m => !m)}
        >
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-black text-white border border-black flex items-center justify-center">
              <Bot size={16} className="stroke-[2.5]" />
            </div>
            <div>
              <p className="font-mono font-black text-xs uppercase text-black">AI COPILOT</p>
              <p className="font-mono text-[10px] font-bold text-gray-800">{loading ? 'COMPILING REVISION...' : 'SYSTEM READY'}</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={e => { e.stopPropagation(); setMin(m => !m); }}
              aria-label={minimized ? "Expand AI assistant" : "Minimize AI assistant"}
              className="p-1 bg-white border border-black hover:bg-[#FFE600] text-black"
            >
              <ChevronDown size={16} className={`stroke-[3] transition-transform ${minimized ? 'rotate-180' : ''}`} />
            </button>
            <button
              onClick={e => { e.stopPropagation(); setOpen(false); }}
              aria-label="Close AI assistant"
              className="p-1 bg-white border border-black hover:bg-[#FF5500] hover:text-white text-black"
            >
              <X size={16} className="stroke-[3]" />
            </button>
          </div>
        </div>

        {/* ── Body ── */}
        {!minimized && (
          <>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FDF6E3]">
              {messages.map((msg, i) => (
                <div key={i} className={`flex items-end gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 bg-black text-[#00FF00] border border-black flex-shrink-0 flex items-center justify-center font-mono font-bold text-xs">
                      AI
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] p-3 font-mono text-xs font-bold leading-relaxed border-2 border-black ${
                      msg.role === 'user'
                        ? 'bg-[#FF00FF] text-white shadow-[2px_2px_0px_0px_#000000]'
                        : 'bg-white text-black shadow-[2px_2px_0px_0px_#000000]'
                    }`}
                  >
                    {msg.text}
                    {msg.hasUpdate && (
                      <div className="mt-2 pt-1 border-t border-black text-[10px] text-black bg-[#00FF00] px-1.5 py-0.5 inline-block">
                        ✓ ARCHITECTURE REVISED
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-black text-white flex items-center justify-center font-mono text-xs">AI</div>
                  <div className="bg-white border-2 border-black p-2 font-mono text-xs font-bold flex items-center gap-2">
                    <Loader size={12} className="animate-spin" />
                    COMPILING...
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick Suggestions */}
            <div className="p-2 border-t-2 border-black bg-[#F4ECC8]">
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => handleSend(s)}
                    disabled={loading}
                    className="flex-shrink-0 px-2 py-1 bg-white text-black border border-black font-mono text-[11px] font-bold uppercase hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] disabled:opacity-50 transition-all whitespace-nowrap shadow-[1px_1px_0px_0px_#000000]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t-2 border-black bg-white">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && !loading && handleSend()}
                  placeholder="Ask to modify architecture..."
                  disabled={loading}
                  className="flex-1 px-3 py-2 font-mono text-xs font-bold bg-[#FDF6E3] border-2 border-black shadow-[2px_2px_0px_0px_#000000] focus:outline-none focus:bg-white text-black placeholder-gray-500"
                />
                <button
                  onClick={() => handleSend()}
                  disabled={loading || !input.trim()}
                  aria-label="Send message"
                  className="px-3 py-2 bg-[#00FF00] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-40 transition-all flex items-center justify-center font-bold"
                >
                  {loading ? <Loader size={16} className="animate-spin" /> : <Send size={16} className="stroke-[2.5]" />}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default AIAssistant;
