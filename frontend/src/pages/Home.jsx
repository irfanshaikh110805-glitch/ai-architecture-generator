import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Zap, 
  Sparkles, 
  Clock, 
  ChevronRight, 
  ChevronLeft, 
  Star, 
  Terminal, 
  TrendingUp, 
  Check, 
  ArrowRight, 
  Layers, 
  Database, 
  DollarSign, 
  Activity, 
  Code2, 
  Server 
} from 'lucide-react';
import { generateArchitecture } from '../services/api';
import useAppStore from '../store/useAppStore';
import TemplateSelector from '../components/TemplateSelector';
import VersionHistory from '../components/VersionHistory';
import ComparisonView from '../components/ComparisonView';
import toast from 'react-hot-toast';

const PLACEHOLDER_IDEAS = [
  'A social media platform for pet owners with real-time photo sharing, vet consultation booking, and community feed',
  'An AI-powered recipe generator that creates custom meal plans based on dietary restrictions and pantry ingredients',
  'A B2B SaaS platform for automated invoice processing with OCR, multi-currency support, and QuickBooks sync',
  'A real-time collaborative code editor with syntax highlighting, live video chat, and git integration',
  'A marketplace for freelance designers with portfolio showcasing, milestone-based escrow payments, and client reviews'
];

function Home() {
  const navigate = useNavigate();
  const { 
    currentIdea, 
    setCurrentResult, 
    versions 
  } = useAppStore();

  const [idea, setIdea] = useState(currentIdea || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [compareVersions, setCompareVersions] = useState(null);

  const textareaRef = useRef(null);

  // Rotate placeholders every 4 seconds if input is empty
  useEffect(() => {
    if (idea) return;
    const interval = setInterval(() => {
      setPlaceholderIdx(prev => (prev + 1) % PLACEHOLDER_IDEAS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [idea]);

  const charCount = idea.trim().length;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (idea.trim().length < 10) {
      setError('Please provide at least 10 characters describing your idea.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await generateArchitecture(idea.trim());
      setCurrentResult(data, idea.trim());
      
      localStorage.setItem('lastResult', JSON.stringify(data));
      localStorage.setItem('lastIdea', idea.trim());

      toast.success('Architecture compiled successfully!');
      navigate('/result');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to generate architecture. Please try again.');
      toast.error(err.message || 'Generation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateText) => {
    setIdea(templateText);
    setError(null);
    setShowTemplates(false);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="min-h-screen bg-[#FDF6E3] bg-neo-pattern text-black font-sans selection:bg-[#00FF00] selection:text-black">
      
      {/* ── Top Navigation ── */}
      <header className="bg-[#FDF6E3] border-b-[3px] border-black shadow-[0_4px_0px_0px_#000000] relative z-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
          {/* Logo + Back */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1 font-mono text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-2.5 py-1.5 hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] transition-all uppercase"
            >
              <ChevronLeft size={16} className="stroke-[3]" />
              HOME
            </button>
            <div className="w-[2px] h-6 bg-black" />
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 border-2 border-black bg-[#FF00FF] p-0.5 shadow-[2px_2px_0px_0px_#000000]">
                <img src="/logo.jpg" alt="ArchitechAI" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-black text-lg sm:text-xl tracking-tight text-black">
                ARCHITECH<span className="bg-[#00FF00] px-1 ml-1 text-black border border-black text-xs">AI</span>
              </span>
            </div>
          </div>

          {/* History trigger */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-1.5 font-mono text-xs font-bold text-black bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] px-3.5 py-1.5 hover:bg-[#00FFFF] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase"
            >
              <Clock size={14} className="stroke-[2.5]" />
              HISTORY
              <span className="bg-[#FF00FF] text-white text-[10px] font-black px-1.5 py-0.2 border border-black">
                {versions.length}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* ── Main Workspace Content ── */}
      <main className="flex items-center justify-center min-h-[calc(100vh-75px)] px-4 py-12">
        <div className="w-full max-w-3xl">

          {/* Neo-Brutalist Top Stamp */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_0px_#000000] px-3.5 py-1.5 transform -rotate-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className="fill-black text-black" />
                ))}
              </div>
              <span className="font-mono text-xs font-black uppercase text-black tracking-wider">
                ENGINEERING SPEC COMPILER
              </span>
              <span className="bg-black text-[#00FF00] font-mono text-[10px] font-black px-1.5 py-0.5">
                V2.0
              </span>
            </div>
          </div>

          {/* Big Uppercase Headline */}
          <div className="text-center mb-8">
            <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-black leading-tight mb-2">
              BUILD BETTER SOFTWARE
              <br />
              <span className="bg-[#FF00FF] text-white px-3 py-0.5 border-2 border-black shadow-[4px_4px_0px_0px_#000000] inline-block mt-1">
                FASTER WITH AI
              </span>
            </h1>
            <p className="font-mono text-xs sm:text-sm font-bold text-gray-800 max-w-lg mx-auto">
              Describe your software concept and generate full production specs in seconds.
            </p>
          </div>

          {/* ── Main Neo-Brutalist Control Card ── */}
          <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000000] p-6 sm:p-8 relative">
            
            {/* Card Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b-2 border-black">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 border-2 border-black bg-[#00FF00] shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center text-black font-black">
                  <Terminal size={20} className="stroke-[2.5]" />
                </div>
                <div>
                  <label htmlFor="idea" className="block font-display font-black text-sm uppercase text-black">
                    DESCRIBE YOUR PROJECT IDEA
                  </label>
                  <p className="font-mono text-[11px] font-bold text-gray-600 flex items-center gap-1">
                    <TrendingUp size={12} className="text-black" />
                    Be as detailed as possible about users, scale, and core requirements
                  </p>
                </div>
              </div>

              {/* Action Buttons: History & Template Selector */}
              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => setShowHistory(true)}
                  className="font-mono text-xs font-bold text-black bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] px-3 py-1.5 hover:bg-[#00FFFF] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5 uppercase"
                >
                  <Clock size={14} className="stroke-[2.5]" />
                  HISTORY ({versions.length})
                </button>

                <button
                  type="button"
                  onClick={() => setShowTemplates(true)}
                  className="font-mono text-xs font-bold text-black bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_0px_#000000] px-3 py-1.5 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-1.5 uppercase"
                >
                  <Sparkles size={14} className="stroke-[2.5]" />
                  USE TEMPLATE
                  <ChevronRight size={14} className="stroke-[2.5]" />
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Textarea Box */}
              <div className="relative">
                <textarea
                  id="idea"
                  ref={textareaRef}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  placeholder={PLACEHOLDER_IDEAS[placeholderIdx]}
                  disabled={loading}
                  className="w-full h-44 p-4 font-mono text-xs sm:text-sm font-bold text-black placeholder-gray-400 bg-[#FDF6E3] border-3 border-black shadow-[4px_4px_0px_0px_#000000] focus:outline-none focus:bg-white focus:shadow-[6px_6px_0px_0px_#000000] transition-all resize-none leading-relaxed"
                />

                {/* Character Count & Ready Badge */}
                <div className="absolute bottom-3 right-3 flex items-center gap-2">
                  <span className={`font-mono text-xs font-bold px-2 py-0.5 border border-black ${charCount >= 10 ? 'bg-[#00FF00] text-black shadow-[1px_1px_0px_0px_#000000]' : 'bg-white text-gray-500'}`}>
                    {charCount} / min 10
                  </span>
                  {charCount >= 10 && (
                    <span className="font-mono text-[10px] font-black bg-[#00FF00] text-black px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_#000000] uppercase flex items-center gap-1">
                      <Check size={12} className="stroke-[3]" />
                      READY
                    </span>
                  )}
                </div>
              </div>

              {/* Error Box */}
              {error && (
                <div className="bg-[#FF5500] text-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] p-3 font-mono text-xs font-bold flex items-center gap-2">
                  <span className="w-5 h-5 bg-black text-white font-mono font-bold flex items-center justify-center text-xs">!</span>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                id="generate-btn"
                type="submit"
                disabled={loading || idea.trim().length < 10}
                className="w-full font-display font-black text-base sm:text-lg bg-[#00FF00] text-black border-3 border-black shadow-[5px_5px_0px_0px_#000000] py-4 px-6 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2.5 uppercase tracking-wide"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-3 border-black border-t-transparent animate-spin inline-block" />
                    <span>ANALYZING & GENERATING ARCHITECTURE...</span>
                  </>
                ) : (
                  <>
                    <Zap size={20} className="stroke-[3]" />
                    <span>GENERATE ARCHITECTURE</span>
                    <ArrowRight size={20} className="stroke-[3]" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Helper Badges */}
            <div className="mt-5 pt-4 border-t-2 border-black flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <span className="font-bold text-gray-700 uppercase">SUGGESTED PLATFORMS:</span>
              <div className="flex flex-wrap gap-2">
                {['E-COMMERCE', 'FINTECH CORE', 'AI COPILOT', 'MICROSERVICES'].map((tag, i) => (
                  <button
                    key={tag}
                    onClick={() => {
                      const prompts = [
                        'A full-featured e-commerce platform with product catalog, cart, checkout, and inventory',
                        'A modern fintech platform with banking integrations, ledger, KYC/AML, and payment gateway',
                        'An AI copilot application with retrieval-augmented generation (RAG), vector DB, and live chat',
                        'A distributed microservices architecture with API Gateway, service mesh, and message broker'
                      ];
                      setIdea(prompts[i]);
                      setError(null);
                    }}
                    className="font-mono text-[11px] font-bold text-black bg-[#FDF6E3] hover:bg-[#FFE600] px-2 py-0.5 border border-black transition-colors uppercase shadow-[1px_1px_0px_0px_#000000]"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Feature Capabilities Grid ── */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-6">
            {[
              { icon: Layers, label: 'MoSCoW FEATURES', bg: 'bg-[#FFE600]' },
              { icon: Database, label: '3NF SCHEMAS', bg: 'bg-[#00FFFF]' },
              { icon: Server, label: 'REST & OPENAPI', bg: 'bg-[#00FF00]' },
              { icon: Code2, label: 'IAC & DOCKER', bg: 'bg-[#FF00FF] text-white' },
              { icon: DollarSign, label: 'CLOUD BUDGETS', bg: 'bg-[#FFE600]' },
              { icon: Activity, label: 'LIVE AI COPILOT', bg: 'bg-[#00FF00]' }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className={`p-3 border-2 border-black ${item.bg} shadow-[3px_3px_0px_0px_#000000] flex items-center gap-2.5`}>
                  <div className="w-7 h-7 bg-white text-black border border-black flex items-center justify-center flex-shrink-0">
                    <Icon size={14} className="stroke-[2.5]" />
                  </div>
                  <span className="font-mono text-xs font-black uppercase tracking-tight text-black">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>

        </div>
      </main>

      {/* ── Auxiliary Drawers & Modals ── */}
      {showTemplates && (
        <TemplateSelector
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}

      {showHistory && (
        <VersionHistory
          onClose={() => setShowHistory(false)}
          onLoad={(v) => {
            localStorage.setItem('lastResult', JSON.stringify(v.result));
            localStorage.setItem('lastIdea', v.idea);
            setCurrentResult(v.result, v.idea);
            setShowHistory(false);
            navigate('/result');
          }}
          onRestore={(res, ideaText) => {
            localStorage.setItem('lastResult', JSON.stringify(res));
            localStorage.setItem('lastIdea', ideaText);
            setCurrentResult(res, ideaText);
            setShowHistory(false);
            navigate('/result');
          }}
          onCompare={(vA, vB) => {
            setCompareVersions({ vA, vB });
            setShowHistory(false);
          }}
        />
      )}

      {compareVersions && (
        <ComparisonView
          versionA={compareVersions.vA}
          versionB={compareVersions.vB}
          onClose={() => setCompareVersions(null)}
        />
      )}
    </div>
  );
}

export default Home;
