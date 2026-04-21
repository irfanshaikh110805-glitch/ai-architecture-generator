import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateArchitecture } from '../services/api';
import {
  Zap, Clock, Layers, GitMerge, Database, Globe, Code, BarChart,
  ArrowRight, Sparkles, ChevronRight, Star, ChevronLeft
} from 'lucide-react';
import TemplateSelector from '../components/TemplateSelector';
import VersionHistory from '../components/VersionHistory';

import useAppStore from '../store/useAppStore';
import toast from 'react-hot-toast';

const FEATURES_LIST = [
  { icon: Layers,   label: 'Architecture Design', color: 'from-blue-500 to-indigo-600' },
  { icon: Database, label: 'DB Schema',            color: 'from-emerald-500 to-teal-600' },
  { icon: Globe,    label: 'REST APIs',             color: 'from-orange-500 to-amber-600' },
  { icon: Code,     label: 'Code Generation',       color: 'from-brand-500 to-accent-500' },
  { icon: BarChart, label: 'Cost Estimation',       color: 'from-rose-500 to-pink-600' },
  { icon: GitMerge, label: 'ER Diagrams',           color: 'from-violet-500 to-purple-600' },
  { icon: Clock,    label: 'Roadmap',               color: 'from-cyan-500 to-sky-600' },
  { icon: Zap,      label: 'Tech Recs',             color: 'from-amber-500 to-yellow-600' },
];

const PLACEHOLDER_IDEAS = [
  'A social media platform for pet owners with photo sharing, vet appointments, and a marketplace for pet supplies...',
  'A real-time collaborative code editor with AI pair programming, syntax highlighting, and one-click deployment...',
  'An e-commerce platform for handmade goods with seller analytics, integrated payments, and AI-powered recommendations...',
  'A fitness tracking app with wearable integration, workout planning, nutrition tracking, and social challenges...',
];

function Home() {
  const [idea, setIdea]               = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHistory, setShowHistory]     = useState(false);
  const [placeholderIdx, setPlaceholderIdx] = useState(0);
  const [isFocused, setIsFocused]     = useState(false);
  const textareaRef                   = useRef(null);
  const navigate                      = useNavigate();
  const { setCurrentResult, versions } = useAppStore();

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.classList.add('bg-premium-animated');
    return () => { document.body.classList.remove('bg-premium-animated'); };
  }, []);

  // Cycle placeholder text
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIdx(i => (i + 1) % PLACEHOLDER_IDEAS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (idea.trim().length < 10) {
      setError('Please provide at least 10 characters describing your project idea.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const result = await generateArchitecture(idea);
      localStorage.setItem('lastResult', JSON.stringify(result));
      localStorage.setItem('lastIdea', idea);
      setCurrentResult(result, idea);
      toast.success('Architecture generated!', { icon: '✨' });
      navigate('/result');
    } catch (err) {
      const msg = err.message || 'Failed to generate architecture. Please try again.';
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (prompt) => {
    setIdea(prompt);
    setShowTemplates(false);
    textareaRef.current?.focus();
  };

  const handleLoadVersion = (version) => {
    localStorage.setItem('lastResult', JSON.stringify(version.result));
    localStorage.setItem('lastIdea', version.idea);
    setShowHistory(false);
    navigate('/result');
    toast.success(`Loaded: ${version.label}`);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-transparent">

      {/* ── Decorative Orbs ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="orb orb-brand"  style={{ width: 700, height: 700, top: '-200px', right: '-150px', opacity: 0.50 }} />
        <div className="orb orb-accent" style={{ width: 600, height: 600, bottom: '-150px', left: '-100px', opacity: 0.40, animationDelay: '-5s' }} />
        <div className="orb orb-sky"    style={{ width: 400, height: 400, top: '40%', left: '45%', opacity: 0.35, animationDelay: '-10s' }} />
        <div className="orb orb-purple" style={{ width: 500, height: 500, top: '10%', left: '-10%', opacity: 0.30, animationDelay: '-15s' }} />

        {/* Animated Perspective Grid */}
        <div className="absolute inset-0"
             style={{
               perspective: '1000px',
               overflow: 'hidden'
             }}>
          <div className="absolute inset-x-0 bottom-[-20%] top-[10%]"
               style={{
                 backgroundImage: 'linear-gradient(rgba(37,99,235,0.05) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(37,99,235,0.05) 1.5px, transparent 1.5px)',
                 backgroundSize: '60px 60px',
                 transform: 'rotateX(75deg) translateY(0) translateZ(-200px)',
                 transformOrigin: 'top center',
                 animation: 'grid-scroll 3s linear infinite',
                 maskImage: 'linear-gradient(to bottom, transparent, black 10%, black 80%, transparent)',
                 WebkitMaskImage: 'linear-gradient(to bottom, transparent, black 10%, black 80%, transparent)'
               }} />
        </div>
      </div>

      {/* ── Top Navigation ── */}
      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo + Back */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 hover:text-blue-600 transition-colors duration-200"
            >
              <ChevronLeft size={16} />
              Home
            </button>
            <div className="w-px h-5 bg-gray-200" />
            <div className="flex items-center gap-2.5">
              <img src="/logo.jpg" alt="ArchitechAI" className="w-12 h-12 rounded-xl object-cover shadow-btn" />
              <span className="font-display font-800 text-xl tracking-tight text-gray-900">
                Architech<span className="gradient-text">AI</span>
              </span>
            </div>
          </div>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            {versions.length > 0 && (
              <button
                onClick={() => setShowHistory(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white/70 hover:bg-white text-gray-700 rounded-xl text-sm font-medium transition-all duration-200 border border-white/60 hover:border-blue-200 hover:text-blue-600 shadow-sm hover:shadow-md backdrop-blur-sm"
              >
                <Clock size={14} />
                History
                <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-1.5 py-0.5 rounded-md">
                  {versions.length}
                </span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── Hero Content ── */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="w-full max-w-2xl">

          {/* Badge */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-brand-200/60 shadow-sm">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} className="text-amber-400 fill-amber-400" />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">AI-Powered Architecture Generator</span>
              <span className="px-2 py-0.5 bg-brand-500 text-white text-xs font-bold rounded-full">v2.0</span>
            </div>
          </div>

          {/* Headline */}
          <div className="text-center mb-8" style={{ animationDelay: '0.1s' }}>
            <h1 className="font-display font-800 text-5xl md:text-6xl leading-[1.05] tracking-tight text-gray-900 mb-4">
              Build Better Software
              <br />
              <span className="gradient-text">Faster with AI</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto font-medium">
              Describe your idea and get a complete, production-ready architecture —
              from DB schema to deployment roadmap — in seconds.
            </p>
          </div>

          {/* ── Main Card ── */}
          <div
            className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-premium-lg border border-white/90 p-8"
            style={{
              boxShadow: '0 8px 32px rgba(66,99,235,0.1), 0 2px 8px rgba(66,99,235,0.06), 0 0 0 1px rgba(66,99,235,0.06)',
              animationDelay: '0.2s',
            }}
          >
            {/* Card header row */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <label htmlFor="idea" className="block text-sm font-semibold text-gray-700 mb-0.5">
                  Describe Your Project Idea
                </label>
                <p className="text-xs text-gray-400">Be as detailed as possible for better results</p>
              </div>
              <button
                onClick={() => setShowTemplates(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-xl text-sm font-semibold transition-all duration-200 border border-blue-200/60 hover:border-blue-300 hover:shadow-sm"
              >
                <Sparkles size={13} />
                Use Template
                <ChevronRight size={13} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Textarea with gradient border on focus */}
              <div className={`relative rounded-2xl transition-all duration-300 ${isFocused ? 'shadow-[0_0_0_3px_rgba(66,99,235,0.15)]' : ''}`}>
                <textarea
                  id="idea"
                  ref={textareaRef}
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  placeholder={PLACEHOLDER_IDEAS[placeholderIdx]}
                  className="w-full h-44 px-5 py-4 rounded-2xl border-2 resize-none text-sm leading-relaxed bg-white text-gray-800 placeholder-gray-300 transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: isFocused ? '#6b8eff' : '#e8ecf5',
                  }}
                  disabled={loading}
                />
                {/* Character count */}
                <div className="absolute bottom-3 right-4 flex items-center gap-2">
                  <span className={`text-xs font-medium transition-colors ${idea.length >= 10 ? 'text-emerald-500' : 'text-gray-300'}`}>
                    {idea.length} / min 10
                  </span>
                  {idea.length >= 10 && (
                    <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                      <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                        <path d="M1.5 4L3.5 6L6.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm fade-in">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 text-xs font-bold">!</span>
                  </div>
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                id="generate-btn"
                type="submit"
                disabled={loading || idea.trim().length < 10}
                className="w-full relative flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-white font-semibold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
                style={{
                  background: 'linear-gradient(135deg, #2563eb 0%, #06b6d4 100%)',
                  boxShadow: idea.trim().length >= 10 && !loading
                    ? '0 4px 6px rgba(37,99,235,0.25), 0 12px 28px rgba(37,99,235,0.3), 0 0 0 1px rgba(255,255,255,0.15) inset'
                    : 'none',
                }}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                {loading ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Analyzing & Generating Architecture...</span>
                  </>
                ) : (
                  <>
                    <Zap size={18} className="group-hover:rotate-12 transition-transform duration-300" />
                    <span>Generate Architecture</span>
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </button>
            </form>

            {/* Features Grid */}
            <div className="mt-7 pt-7 border-t border-surface-100">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-300 mb-4 text-center">
                What you'll get instantly
              </p>
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2 stagger">
                {/* eslint-disable-next-line no-unused-vars */}
                {FEATURES_LIST.map(({ icon: FeatureIcon, label, color }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center gap-2 p-2.5 rounded-xl text-center group cursor-default transition-all duration-200 hover:bg-surface-50 hover:-translate-y-0.5 fade-in"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow`}>
                      <FeatureIcon size={14} className="text-white" />
                    </div>
                    <span className="text-xs leading-tight text-gray-500 group-hover:text-gray-700 font-medium transition-colors">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mt-6 fade-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex -space-x-2">
              {['#2563eb','#06b6d4','#f59e0b','#10b981'].map((c, i) => (
                <div key={i} className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-white" style={{ background: c }}>
                  {String.fromCharCode(65 + i)}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500">
              <span className="font-bold text-gray-700">2,400+</span> architectures generated this week
            </p>
          </div>
        </div>
      </main>

      {/* ── Modals ── */}
      {showTemplates && (
        <TemplateSelector
          onSelect={handleTemplateSelect}
          onClose={() => setShowTemplates(false)}
        />
      )}
      {showHistory && (
        <VersionHistory
          onClose={() => setShowHistory(false)}
          onLoad={handleLoadVersion}
          onCompare={(a, b) => {
            localStorage.setItem('compareA', JSON.stringify(a));
            localStorage.setItem('compareB', JSON.stringify(b));
            navigate('/compare');
          }}
        />
      )}
    </div>
  );
}

export default Home;
