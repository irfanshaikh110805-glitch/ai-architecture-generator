import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateArchitecture } from '../services/api';
import {
  Zap, Clock, Layers, GitMerge, Database, Globe, Code, BarChart,
  ArrowRight, Sparkles, ChevronRight, Star, ChevronLeft, TrendingUp, Rocket
} from 'lucide-react';
import TemplateSelector from '../components/TemplateSelector';
import VersionHistory from '../components/VersionHistory';

import useAppStore from '../store/useAppStore';
import toast from 'react-hot-toast';

const FEATURES_LIST = [
  { icon: Layers,   label: 'Architecture Design', color: 'from-blue-500 to-blue-600' },
  { icon: Database, label: 'DB Schema',            color: 'from-emerald-500 to-teal-600' },
  { icon: Globe,    label: 'REST APIs',             color: 'from-orange-500 to-amber-600' },
  { icon: Code,     label: 'Code Generation',       color: 'from-brand-500 to-accent-500' },
  { icon: BarChart, label: 'Cost Estimation',       color: 'from-rose-500 to-pink-600' },
  { icon: GitMerge, label: 'ER Diagrams',           color: 'from-cyan-500 to-sky-600' },
  { icon: Clock,    label: 'Roadmap',               color: 'from-indigo-500 to-blue-600' },
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
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const textareaRef                   = useRef(null);
  const cardRef                       = useRef(null);
  const navigate                      = useNavigate();
  const { setCurrentResult, versions } = useAppStore();
  
  // Calculate character count directly from idea (no separate state needed)
  const charCount = idea.length;

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

  // Track mouse position for parallax effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (cardRef.current) {
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
        setMousePosition({ x, y });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
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

      {/* ── Decorative 3D Orbs & Grid ── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating 3D Orbs */}
        <div className="orb-3d orb-brand"  style={{ width: 700, height: 700, top: '-200px', right: '-150px' }} />
        <div className="orb-3d orb-accent" style={{ width: 600, height: 600, bottom: '-150px', left: '-100px', animationDelay: '-5s' }} />
        <div className="orb-3d orb-sky"    style={{ width: 400, height: 400, top: '40%', left: '45%', animationDelay: '-10s' }} />
        <div className="orb-3d orb-emerald" style={{ width: 500, height: 500, top: '10%', left: '-10%', animationDelay: '-15s' }} />

        {/* 3D Perspective Grid */}
        <div className="absolute inset-0 perspective-grid">
          <div className="grid-3d" />
        </div>

        {/* Floating geometric shapes */}
        <div className="floating-shapes">
          <div className="shape-cube" style={{ top: '15%', left: '10%', animationDelay: '0s' }} />
          <div className="shape-cube" style={{ top: '60%', right: '15%', animationDelay: '-3s' }} />
          <div className="shape-sphere" style={{ top: '30%', right: '25%', animationDelay: '-6s' }} />
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

          {/* Badge with pulse animation */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm border border-brand-200/60 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105 cursor-default">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={11} className="text-amber-400 fill-amber-400 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }} />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">AI-Powered Architecture Generator</span>
              <span className="px-2 py-0.5 bg-gradient-to-r from-brand-500 to-accent-500 text-white text-xs font-bold rounded-full animate-pulse">v2.0</span>
            </div>
          </div>

          {/* Headline with gradient animation */}
          <div className="text-center mb-8" style={{ animationDelay: '0.1s' }}>
            <h1 className="font-display font-800 text-5xl md:text-6xl leading-[1.05] tracking-tight text-gray-900 mb-4">
              Build Better Software
              <br />
              <span className="gradient-text-animated">Faster with AI</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-xl mx-auto font-medium">
              Describe your idea and get a complete, production-ready architecture —
              from DB schema to deployment roadmap — in seconds.
            </p>
          </div>

          {/* ── Main Card with 3D Effect & Parallax ── */}
          <div
            ref={cardRef}
            className="card-3d-enhanced bg-white/90 backdrop-blur-xl rounded-3xl shadow-3d border border-white/90 p-8 transform-gpu relative overflow-hidden"
            style={{
              animationDelay: '0.2s',
              transform: `perspective(1000px) rotateX(${mousePosition.y * 2}deg) rotateY(${mousePosition.x * 2}deg)`,
              transition: 'transform 0.1s ease-out',
            }}
          >
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            
            {/* Sparkle effects */}
            <div className="sparkle-container">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="sparkle" style={{ 
                  left: `${20 + i * 30}%`, 
                  top: `${10 + i * 20}%`,
                  animationDelay: `${i * 0.5}s` 
                }} />
              ))}
            </div>
            {/* Card header row with animated icons */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 flex items-center justify-center shadow-lg animate-bounce-gentle">
                  <Rocket size={20} className="text-white" />
                </div>
                <div>
                  <label htmlFor="idea" className="block text-sm font-semibold text-gray-700 mb-0.5">
                    Describe Your Project Idea
                  </label>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <TrendingUp size={12} className="text-emerald-500" />
                    Be as detailed as possible for better results
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowTemplates(true)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-blue-50 to-cyan-50 text-blue-600 hover:from-blue-100 hover:to-cyan-100 rounded-xl text-sm font-semibold transition-all duration-200 border border-blue-200/60 hover:border-blue-300 hover:shadow-md hover:scale-105"
              >
                <Sparkles size={13} className="animate-pulse" />
                Use Template
                <ChevronRight size={13} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Textarea with 3D depth effect and progress bar */}
              <div className="relative">
                <div className={`relative rounded-2xl transition-all duration-300 input-3d ${isFocused ? 'input-3d-focused' : ''}`}>
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
                  {/* Character count with progress indicator */}
                  <div className="absolute bottom-3 right-4 flex items-center gap-3">
                    {/* Progress circle */}
                    <div className="relative w-12 h-12">
                      <svg className="transform -rotate-90" width="48" height="48">
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke="#e5e7eb"
                          strokeWidth="3"
                          fill="none"
                        />
                        <circle
                          cx="24"
                          cy="24"
                          r="20"
                          stroke={charCount >= 10 ? '#10b981' : '#3b82f6'}
                          strokeWidth="3"
                          fill="none"
                          strokeDasharray={`${2 * Math.PI * 20}`}
                          strokeDashoffset={`${2 * Math.PI * 20 * (1 - Math.min(charCount / 100, 1))}`}
                          className="transition-all duration-300"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={`text-xs font-bold transition-colors ${charCount >= 10 ? 'text-emerald-500' : 'text-gray-400'}`}>
                          {charCount}
                        </span>
                      </div>
                    </div>
                    {charCount >= 10 && (
                      <div className="flex items-center gap-1 bg-emerald-50 px-2 py-1 rounded-lg animate-scale-in">
                        <div className="w-4 h-4 rounded-full bg-emerald-500 flex items-center justify-center">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1.5 4L3.5 6L6.5 2.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                        <span className="text-xs font-semibold text-emerald-600">Ready!</span>
                      </div>
                    )}
                  </div>
                </div>
                {/* Typing indicator */}
                {isFocused && charCount > 0 && (
                  <div className="absolute -bottom-6 left-0 flex items-center gap-2 text-xs text-gray-400 animate-fade-in">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                      <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                    </div>
                    <span>AI is ready to analyze...</span>
                  </div>
                )}
              </div>

              {error && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm fade-in">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-red-600 text-xs font-bold">!</span>
                  </div>
                  {error}
                </div>
              )}

              {/* Submit Button with 3D effect and loading animation */}
              <button
                id="generate-btn"
                type="submit"
                disabled={loading || idea.trim().length < 10}
                className="btn-3d-enhanced w-full relative flex items-center justify-center gap-3 py-4 px-6 rounded-2xl text-white font-semibold text-base transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden group"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-r from-brand-600 via-accent-500 to-brand-600 bg-[length:200%_100%] animate-gradient-x" />
                
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                {/* Particle effects on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="particle"
                      style={{
                        left: `${20 * i}%`,
                        animationDelay: `${i * 0.1}s`,
                      }}
                    />
                  ))}
                </div>

                <div className="relative z-10 flex items-center gap-3">
                  {loading ? (
                    <>
                      <div className="relative w-5 h-5">
                        <div className="absolute inset-0 border-2 border-white/30 rounded-full" />
                        <div className="absolute inset-0 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                      <span>Analyzing & Generating Architecture...</span>
                      <div className="flex gap-1">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                      </div>
                    </>
                  ) : (
                    <>
                      <Zap size={18} className="group-hover:rotate-12 group-hover:scale-110 transition-transform duration-300" />
                      <span>Generate Architecture</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform duration-300" />
                    </>
                  )}
                </div>
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
                    className="feature-card-3d flex flex-col items-center gap-2 p-2.5 rounded-xl text-center group cursor-default transition-all duration-300 fade-in"
                  >
                    <div className={`icon-3d w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center shadow-sm group-hover:shadow-md transition-all duration-300`}>
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
