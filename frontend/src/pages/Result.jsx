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
  Clock, Share2, Sparkles,
  Layout, Database, Globe, Code2, BarChart3, GitMerge, Map, Cpu, ArrowLeft
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

// Loading component for lazy-loaded sections (Neo-Brutalist)
const SectionLoader = () => (
  <div className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] p-6">
    <div className="flex items-center gap-3 mb-4">
      <div className="w-5 h-5 border-2 border-black border-t-transparent animate-spin" />
      <span className="font-mono text-xs font-black uppercase text-black">COMPILING SECTION...</span>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-[#F4ECC8] border border-black w-full" />
      <div className="h-4 bg-[#F4ECC8] border border-black w-5/6" />
      <div className="h-4 bg-[#F4ECC8] border border-black w-3/5" />
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

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.style.backgroundColor = '#FDF6E3';
  }, []);

  useEffect(() => {
    const savedResult = localStorage.getItem('lastResult');
    const savedIdea   = localStorage.getItem('lastIdea');
    if (!savedResult) { 
      navigate('/'); 
      return; 
    }
    const parsedResult = JSON.parse(savedResult);
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
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6E3]">
        <div className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000000] p-8 text-center max-w-sm">
          <div className="w-12 h-12 border-3 border-black border-t-[#FF00FF] border-r-[#00FF00] animate-spin mx-auto mb-4" />
          <p className="font-mono text-sm font-bold uppercase text-black">Loading your architecture...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6E3] text-black font-sans selection:bg-[#00FF00] selection:text-black pb-24">

      {/* ── Sticky Top Bar ── */}
      <header className="sticky top-0 z-30 bg-[#FDF6E3] border-b-[3px] border-black shadow-[0_4px_0px_0px_#000000]">
        {/* Main Header Row */}
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Logo + Back */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={() => navigate('/generate')}
              className="flex items-center gap-1 font-mono text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-2 py-1 hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] transition-all uppercase"
            >
              <ArrowLeft size={14} className="stroke-[3]" />
              <span className="hidden sm:inline">NEW</span>
            </button>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 p-1 hover:bg-[#FFE600] transition-colors"
            >
              <div className="w-8 h-8 border-2 border-black bg-[#FF00FF] p-0.5 shadow-[2px_2px_0px_0px_#000000]">
                <img src="/logo.jpg" alt="ArchitechAI" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-black text-base sm:text-lg tracking-tight text-black">
                ARCHITECH<span className="bg-[#00FF00] px-1 ml-1 text-black border border-black text-xs">AI</span>
              </span>
            </button>
          </div>

          {/* Project title preview */}
          <div className="flex-1 min-w-0 hidden md:flex items-center gap-2 max-w-md bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_#000000]">
            <Sparkles size={13} className="text-[#FF00FF] flex-shrink-0 stroke-[3]" />
            <p className="font-mono text-xs font-bold text-black truncate">{idea}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
            <button
              onClick={() => setShowHistory(true)}
              aria-label="View Version History"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 font-mono text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#00FFFF] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all uppercase"
            >
              <Clock size={14} className="stroke-[2.5]" />
              <span className="hidden sm:inline">HISTORY</span>
            </button>
            
            <button
              onClick={() => setShowShare(true)}
              aria-label="Share Architecture"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 font-mono text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none transition-all uppercase"
            >
              <Share2 size={14} className="stroke-[2.5]" />
              <span className="hidden sm:inline">SHARE</span>
            </button>
            
            <ExportMenu result={result} idea={idea} />
          </div>
        </div>

        {/* Subnav Section Pills */}
        <div className="border-t-2 border-black bg-[#F4ECC8]">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 flex items-center gap-1.5 overflow-x-auto scrollbar-hide touch-pan-x">
            {NAV_SECTIONS.map((sec) => {
              const Icon = sec.icon;
              const isActive = activeSection === sec.id;
              return (
                <button
                  key={sec.id}
                  onClick={() => scrollTo(sec.id)}
                  className={`flex items-center gap-1.5 px-3 py-1 font-mono text-xs font-bold uppercase whitespace-nowrap transition-all flex-shrink-0 border-2 border-black ${
                    isActive
                      ? 'bg-[#FF00FF] text-white shadow-[2px_2px_0px_0px_#000000] transform -translate-y-0.5'
                      : 'bg-white text-black hover:bg-[#00FF00] shadow-[1px_1px_0px_0px_#000000]'
                  }`}
                >
                  <Icon size={12} className="stroke-[2.5]" />
                  {sec.label}
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* ── Project Hero Banner Card ── */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-6 pb-2">
        <div className="bg-[#FFE600] border-3 border-black shadow-[6px_6px_0px_0px_#000000] p-5 sm:p-7 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-mono text-xs font-black bg-black text-[#00FF00] px-2.5 py-0.5 border border-black uppercase tracking-wider">
              SPEC COMPILATION OUTPUT
            </span>
          </div>

          <h1 className="font-display font-black text-xl sm:text-3xl md:text-4xl uppercase tracking-tight text-black mb-4 leading-snug break-words">
            {idea}
          </h1>

          {/* Key Metric Tags */}
          <div className="flex items-center gap-2 flex-wrap font-mono text-xs font-bold">
            <span className="bg-white text-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000000] uppercase">
              ⚡ {result.architecture?.type}
            </span>
            <span className="bg-[#00FF00] text-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000000] uppercase">
              ✓ {result.features?.length || 0} FEATURES
            </span>
            <span className="bg-[#00FFFF] text-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000000] uppercase">
              🌐 {result.apis?.length || 0} APIS
            </span>
            <span className="bg-[#FF00FF] text-white px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000000] uppercase">
              🗄️ {result.database?.length || 0} TABLES
            </span>
          </div>
        </div>
      </div>

      {/* ── Main Content with Lazy Loading ── */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-6 space-y-6">
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
