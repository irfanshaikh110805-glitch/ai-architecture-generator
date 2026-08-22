import { useState, useEffect, lazy, Suspense } from 'react';
import { useNavigate } from 'react-router-dom';

// Lazy load heavy components for better performance
const FeaturesSection = lazy(() => import('../components/FeaturesSection'));
const DatabaseSection = lazy(() => import('../components/DatabaseSection'));
const APIsSection = lazy(() => import('../components/APIsSection'));
const ArchitectureSection = lazy(() => import('../components/ArchitectureSection'));
const DiagramSection = lazy(() => import('../components/DiagramSection'));
const RoadmapSection = lazy(() => import('../components/RoadmapSection'));
const CostEnhancement = lazy(() => import('../components/CostEnhancement'));
const TechRecommendations = lazy(() => import('../components/TechRecommendations'));
const CodeGenerator = lazy(() => import('../components/CodeGenerator'));

// Import lightweight components normally
import ExportMenu from '../components/ExportMenu';
import ShareModal from '../components/ShareModal';
import VersionHistory from '../components/VersionHistory';
import ComparisonView from '../components/ComparisonView';
import AIAssistant from '../components/AIAssistant';

import useAppStore from '../store/useAppStore';
import toast from 'react-hot-toast';
import {
  Home as HomeIcon, Clock, Share2, Sparkles, Zap, ChevronRight,
  Layout, Database, Globe, Code2, BarChart3, GitMerge, Map, Cpu,
} from 'lucide-react';

const NAV_SECTIONS = [
  { id: 'features',      label: 'Features',   icon: Sparkles },
  { id: 'database',      label: 'Database',   icon: Database },
  { id: 'apis',          label: 'APIs',       icon: Globe },
  { id: 'architecture',  label: 'Arch',       icon: Layout },
  { id: 'diagrams',      label: 'Diagrams',   icon: GitMerge },
  { id: 'roadmap',       label: 'Roadmap',    icon: Map },
  { id: 'cost',          label: 'Cost',       icon: BarChart3 },
  { id: 'tech',          label: 'Tech',       icon: Cpu },
  { id: 'code',          label: 'Code',       icon: Code2 },
];

// Loading component for lazy-loaded sections
const SectionLoader = () => (
  <div className="bg-white rounded-2xl p-8 shadow-sm border border-surface-200 animate-pulse">
    <div className="h-6 bg-surface-100 rounded w-1/4 mb-4"></div>
    <div className="space-y-3">
      <div className="h-4 bg-surface-100 rounded w-full"></div>
      <div className="h-4 bg-surface-100 rounded w-5/6"></div>
      <div className="h-4 bg-surface-100 rounded w-4/6"></div>
    </div>
  </div>
);

function Result() {
  const [result, setResult]           = useState(null);
  const [idea, setIdea]               = useState('');
  const [showShare, setShowShare]     = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [compareData, setCompareData] = useState(null);
  const [activeSection, setActiveSection] = useState('');
  const navigate                      = useNavigate();
  const { setCurrentResult }          = useAppStore();

  // Light theme always
  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.style.background = '#f8f9fc';
  }, []);

  useEffect(() => {
    const savedResult = localStorage.getItem('lastResult');
    const savedIdea   = localStorage.getItem('lastIdea');
    if (!savedResult) { 
      navigate('/'); 
      return; 
    }
    const parsedResult = JSON.parse(savedResult);
    // Load data from localStorage on mount
    Promise.resolve().then(() => {
      setResult(parsedResult);
      setIdea(savedIdea || '');
    });
  }, [navigate]);

  // Track active section
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(e => { if (e.isIntersecting) setActiveSection(e.target.id); });
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
    );
    NAV_SECTIONS.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [result]);

  const handleAIUpdate = (newResult, newIdea) => {
    localStorage.setItem('lastResult', JSON.stringify(newResult));
    localStorage.setItem('lastIdea', newIdea);
    setResult(newResult);
    setIdea(newIdea);
    setCurrentResult(newResult, newIdea);
  };

  const handleLoadVersion = (version) => {
    localStorage.setItem('lastResult', JSON.stringify(version.result));
    localStorage.setItem('lastIdea', version.idea);
    setResult(version.result);
    setIdea(version.idea);
    setShowHistory(false);
    toast.success(`Loaded: ${version.label}`);
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #eff6ff, #ecfeff)' }}>
        <div className="text-center">
          <div className="relative w-20 h-20 mx-auto mb-5">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-400 to-accent-500 animate-ping opacity-20" />
            <img src="/logo.jpg" alt="ArchitechAI" className="relative w-20 h-20 rounded-2xl object-cover shadow-btn" />
          </div>
          <p className="text-gray-500 font-medium">Loading your architecture...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8f9fc' }}>

      {/* ── Sticky Top Bar ── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-surface-200 shadow-sm"
              style={{ boxShadow: '0 2px 16px rgba(37,99,235,0.06)' }}>
        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          {/* Logo + Brand */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-brand-50 transition-all duration-200 flex-shrink-0"
          >
            <img src="/logo.jpg" alt="ArchitechAI" className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg object-cover shadow-sm" />
            <span className="font-display font-bold text-base sm:text-lg tracking-tight text-gray-900">
              Architech<span className="gradient-text">AI</span>
            </span>
          </button>

          {/* Project title preview (desktop/tablet only) */}
          <div className="flex-1 min-w-0 hidden md:flex items-center gap-2 max-w-md">
            <Sparkles size={13} className="text-brand-500 flex-shrink-0" />
            <p className="text-xs font-medium text-gray-600 truncate">{idea}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => setShowHistory(true)}
              aria-label="View Version History"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 border border-surface-200 hover:border-brand-200"
            >
              <Clock size={15} />
              <span className="hidden sm:inline">History</span>
            </button>
            <button
              onClick={() => setShowShare(true)}
              aria-label="Share Architecture"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 border border-surface-200 hover:border-brand-200"
            >
              <Share2 size={15} />
              <span className="hidden sm:inline">Share</span>
            </button>
            <ExportMenu result={result} idea={idea} />
          </div>
        </div>

        {/* Subnav Section Pills (Horizontally scrollable on mobile) */}
        <div className="border-t border-surface-100 bg-surface-50/80">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 flex items-center gap-1 overflow-x-auto scrollbar-hide touch-pan-x">
            {NAV_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 active:scale-95 ${
                    activeSection === sec.id
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-white/80 bg-white/40 border border-surface-200/50'
                  }`}
                >
                  <Icon size={12} />
                  {sec.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Project Hero Card ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-4 sm:pt-6 pb-1 sm:pb-2">
        <div
          className="rounded-2xl p-4 sm:p-6 overflow-hidden relative"
          style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 50%, #06b6d4 100%)',
            boxShadow: '0 8px 32px rgba(37,99,235,0.2), 0 2px 8px rgba(37,99,235,0.1)',
          }}
        >
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-72 h-72 opacity-10 pointer-events-none"
               style={{ background: 'radial-gradient(circle, white, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 opacity-10 pointer-events-none"
               style={{ background: 'radial-gradient(circle, white, transparent 70%)', transform: 'translateY(50%)' }} />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2.5">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10">
                <Sparkles size={12} className="text-white" />
                <span className="text-[11px] sm:text-xs font-semibold text-white/90">Generated Architecture</span>
              </div>
            </div>
            <h2 className="text-base sm:text-xl md:text-2xl font-display font-bold text-white mb-3 sm:mb-4 leading-snug break-words">
              {idea}
            </h2>
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              {[
                { label: result.architecture?.type, bg: 'bg-white/25' },
                { label: `${result.features?.length || 0} features`, bg: 'bg-emerald-400/25' },
                { label: `${result.apis?.length || 0} APIs`, bg: 'bg-blue-400/25' },
                { label: `${result.database?.length || 0} tables`, bg: 'bg-cyan-400/25' },
              ].filter(b => b.label).map((badge, i) => (
                <span key={i} className={`inline-flex items-center px-2.5 sm:px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20 ${badge.bg} backdrop-blur-sm`}>
                  {badge.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content with Lazy Loading ── */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 pb-24 sm:pb-12">
        <Suspense fallback={<SectionLoader />}>
          <div id="features">   <FeaturesSection features={result.features} /> </div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="database">   <DatabaseSection database={result.database} /> </div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="apis">       <APIsSection apis={result.apis} /> </div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="architecture"><ArchitectureSection architecture={result.architecture} /> </div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="diagrams">   <DiagramSection erDiagram={result.erDiagram} architectureDiagram={result.architectureDiagram} /> </div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="roadmap">    <RoadmapSection roadmap={result.roadmap} /> </div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="cost">       <CostEnhancement estimation={result.estimation} /> </div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="tech">       <TechRecommendations architecture={result.architecture} /> </div>
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <div id="code">       <CodeGenerator result={result} /> </div>
        </Suspense>
      </main>

      {/* ── Modals ── */}
      {showShare && <ShareModal result={result} idea={idea} onClose={() => setShowShare(false)} />}
      {showHistory && (
        <VersionHistory
          onClose={() => setShowHistory(false)}
          onLoad={handleLoadVersion}
          onCompare={(a, b) => { setCompareData({ a, b }); setShowHistory(false); }}
        />
      )}
      {compareData && (
        <ComparisonView
          versionA={compareData.a}
          versionB={compareData.b}
          onClose={() => setCompareData(null)}
        />
      )}

      {/* Floating AI Assistant */}
      <AIAssistant idea={idea} onUpdate={handleAIUpdate} />
    </div>
  );
}

export default Result;
