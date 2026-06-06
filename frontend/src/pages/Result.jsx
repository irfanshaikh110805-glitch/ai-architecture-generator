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
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-xl border-b border-surface-200"
              style={{ boxShadow: '0 1px 20px rgba(66,99,235,0.07)' }}>
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center gap-3">
          {/* Logo + Brand */}
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-brand-50 transition-all duration-200 group flex-shrink-0"
          >
            <img src="/logo.jpg" alt="ArchitechAI" className="w-10 h-10 rounded-lg object-cover shadow-sm" />
            <span className="font-display font-800 text-lg tracking-tight text-gray-900 hidden sm:block">
              Architech<span className="gradient-text">AI</span>
            </span>
          </button>
          
          <div className="w-px h-6 bg-surface-200 hidden sm:block" />

          {/* Project title */}
          <div className="flex-1 min-w-0 hidden md:block">
            <div className="flex items-center gap-2">
              <Sparkles size={12} className="text-brand-400 flex-shrink-0" />
              <p className="text-sm font-medium text-gray-600 truncate">{idea.substring(0, 70)}{idea.length > 70 ? '…' : ''}</p>
            </div>
          </div>

          {/* Section nav pills (scrollable) */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-hide flex-1 mx-2">
            {/* eslint-disable-next-line no-unused-vars */}
            {NAV_SECTIONS.map(({ id, label, icon: NavIcon }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  activeSection === id
                    ? 'bg-brand-50 text-brand-600 border border-brand-200'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-surface-100'
                }`}
              >
                <NavIcon size={11} />
                {label}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => setShowHistory(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 border border-transparent hover:border-brand-200"
            >
              <Clock size={14} />
              <span className="hidden sm:block">History</span>
            </button>
            <button
              onClick={() => setShowShare(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 border border-transparent hover:border-brand-200"
            >
              <Share2 size={14} />
              <span className="hidden sm:block">Share</span>
            </button>
            <ExportMenu result={result} idea={idea} />

          </div>
        </div>
      </header>

      {/* ── Project Hero Card ── */}
      <div className="max-w-7xl mx-auto px-4 pt-6 pb-2">
        <div
          className="rounded-2xl p-6 overflow-hidden relative"
          style={{
              background: 'linear-gradient(135deg, #2563eb 0%, #0ea5e9 50%, #06b6d4 100%)',
              boxShadow: '0 8px 32px rgba(37,99,235,0.25), 0 2px 8px rgba(37,99,235,0.1)',
          }}
        >
          {/* Background decorations */}
          <div className="absolute top-0 right-0 w-72 h-72 opacity-10"
               style={{ background: 'radial-gradient(circle, white, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 opacity-10"
               style={{ background: 'radial-gradient(circle, white, transparent 70%)', transform: 'translateY(50%)' }} />

          <div className="relative z-10 flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                  <Sparkles size={12} className="text-white" />
                  <span className="text-xs font-semibold text-white/90">Generated Architecture</span>
                </div>
              </div>
              <h2 className="text-xl md:text-2xl font-display font-700 text-white mb-4 leading-snug">
                {idea.substring(0, 100)}{idea.length > 100 ? '…' : ''}
              </h2>
              <div className="flex items-center gap-2 flex-wrap">
                {[
                  { label: result.architecture?.type, bg: 'bg-white/20' },
                  { label: `${result.features?.length || 0} features`, bg: 'bg-emerald-400/20' },
                  { label: `${result.apis?.length || 0} APIs`, bg: 'bg-blue-400/20' },
                  { label: `${result.database?.length || 0} tables`, bg: 'bg-cyan-400/20' },
                ].filter(b => b.label).map((badge, i) => (
                  <span key={i} className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold text-white border border-white/20 ${badge.bg} backdrop-blur-sm`}>
                    {badge.label}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content with Lazy Loading ── */}
      <main className="max-w-7xl mx-auto px-4 py-5 space-y-5">
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
