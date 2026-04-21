import { useState } from 'react';
import { GitCompare, X, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

function diffValue(a, b) {
  const sa = JSON.stringify(a, null, 2);
  const sb = JSON.stringify(b, null, 2);
  return sa !== sb;
}

// Move components outside render to avoid recreation
const SectionHeader = ({ id, label, changed, openSections, toggle }) => (
    <button
      onClick={() => toggle(id)}
      className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl font-bold text-sm tracking-tight transition-all duration-300 ${
        changed
          ? 'bg-amber-50 text-amber-800 border-2 border-amber-200 shadow-sm'
          : 'bg-surface-50 text-gray-700 border border-surface-200'
      }`}
    >
      <span className="flex items-center gap-3">
        <div className={`transition-transform duration-300 ${openSections[id] ? 'rotate-90' : ''}`}>
          <ChevronRight size={16} />
        </div>
        {label}
        {changed && (
          <span className="flex items-center gap-1.5 px-2.5 py-0.5 bg-amber-200/50 text-amber-800 rounded-full text-[10px] uppercase font-bold tracking-widest border border-amber-200">
            <AlertCircle size={10} />
            Diff
          </span>
        )}
      </span>
      {changed ? (
        <span className="text-[10px] font-bold text-amber-600 opacity-60">MODIFIED</span>
      ) : (
        <span className="text-[10px] font-bold text-emerald-500 flex items-center gap-1">
          <CheckCircle2 size={10} /> MATCH
        </span>
      )}
    </button>
  );

const TwoCol = ({ valA, valB }) => {
    const changed = String(valA) !== String(valB);
    return (
      <div className={`grid grid-cols-2 gap-4 py-3 px-4 rounded-xl text-sm transition-all duration-300 border ${changed ? 'bg-amber-50/30 border-amber-100 scale-[1.01] shadow-sm' : 'border-transparent'}`}>
        <div>
          <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest block mb-1.5">Version A</span>
          <span className={`block leading-relaxed ${changed ? 'text-amber-700 font-bold' : 'text-gray-700 font-medium'}`}>{String(valA)}</span>
        </div>
        <div className="border-l border-surface-100 pl-4">
          <span className="text-[10px] font-bold text-accent-500 uppercase tracking-widest block mb-1.5">Version B</span>
          <span className={`block leading-relaxed ${changed ? 'text-amber-700 font-bold' : 'text-gray-700 font-medium'}`}>{String(valB)}</span>
        </div>
      </div>
    );
};

function ComparisonView({ versionA, versionB, onClose }) {
  const [openSections, setOpenSections] = useState({
    features: true, database: false, apis: false, architecture: true, estimation: true, roadmap: false,
  });

  const toggle = (key) => setOpenSections(s => ({ ...s, [key]: !s[key] }));

  const ra = versionA.result;
  const rb = versionB.result;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-[2.5rem] shadow-premium-lg w-full max-w-4xl max-h-[92vh] flex flex-col border border-white/20 scale-in overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-7 border-b border-surface-100 relative bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center text-white shadow-brand-500/25 shadow-lg">
              <GitCompare size={24} />
            </div>
            <div>
              <h2 className="text-2xl font-display font-bold text-gray-900 tracking-tight leading-none">Perspective Diff</h2>
              <div className="flex gap-6 mt-2.5">
                <span className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <div className="w-2.5 h-2.5 rounded-full bg-brand-500" />
                  <span className="text-brand-600 font-bold">A:</span> {versionA.label}
                </span>
                <span className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent-500" />
                  <span className="text-accent-600 font-bold">B:</span> {versionB.label}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-12 h-12 flex items-center justify-center hover:bg-surface-100 text-gray-400 hover:text-gray-600 rounded-2xl transition-all border border-transparent hover:border-surface-200 active:scale-90"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content Tabs Header (A vs B Labels) */}
        <div className="grid grid-cols-2 gap-0 border-b border-surface-100 bg-surface-50/50">
          <div className="py-4 text-center border-r border-surface-100">
            <p className="text-[10px] font-bold text-brand-600 uppercase tracking-[0.2em] mb-1">Architecture A</p>
            <p className="text-sm font-bold text-gray-900 line-clamp-1 px-4">{versionA.idea}</p>
          </div>
          <div className="py-4 text-center">
            <p className="text-[10px] font-bold text-accent-600 uppercase tracking-[0.2em] mb-1">Architecture B</p>
            <p className="text-sm font-bold text-gray-900 line-clamp-1 px-4">{versionB.idea}</p>
          </div>
        </div>

        {/* Main Side-by-Side Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-thin">
          
          {/* Architecture Details */}
          <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <SectionHeader id="architecture" label="Pattern & Stack Info" changed={diffValue(ra.architecture, rb.architecture)} openSections={openSections} toggle={toggle} />
            {openSections.architecture && (
              <div className="mt-4 grid grid-cols-1 gap-3 px-2">
                <TwoCol valA={ra.architecture?.type} valB={rb.architecture?.type} />
                <TwoCol valA={ra.architecture?.tech_stack?.frontend} valB={rb.architecture?.tech_stack?.frontend} />
                <TwoCol valA={ra.architecture?.tech_stack?.backend} valB={rb.architecture?.tech_stack?.backend} />
                <TwoCol valA={ra.architecture?.tech_stack?.database} valB={rb.architecture?.tech_stack?.database} />
                <TwoCol valA={ra.architecture?.components?.join(', ')} valB={rb.architecture?.components?.join(', ')} />
              </div>
            )}
          </div>

          {/* Business Features */}
          <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <SectionHeader id="features" label="Feature Set Comparison" changed={diffValue(ra.features, rb.features)} openSections={openSections} toggle={toggle} />
            {openSections.features && (
              <div className="mt-4 grid grid-cols-2 gap-5 px-2">
                <div className="space-y-2">
                  {ra.features?.map((f, i) => (
                    <div key={i} className="flex flex-col gap-1 p-3 rounded-xl bg-brand-50/50 border border-brand-100 group hover:border-brand-300 transition-all">
                      <span className="text-[9px] font-black tracking-widest text-brand-600 uppercase mb-1">{f.priority}</span>
                      <span className="text-xs font-bold text-gray-800">{f.name}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {rb.features?.map((f, i) => (
                    <div key={i} className="flex flex-col gap-1 p-3 rounded-xl bg-accent-50/50 border border-accent-100 group hover:border-accent-300 transition-all">
                      <span className="text-[9px] font-black tracking-widest text-accent-600 uppercase mb-1">{f.priority}</span>
                      <span className="text-xs font-bold text-gray-800">{f.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Development Estimation */}
          <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <SectionHeader id="estimation" label="Resources & Timeline" changed={diffValue(ra.estimation, rb.estimation)} openSections={openSections} toggle={toggle} />
            {openSections.estimation && (
              <div className="mt-4 grid grid-cols-1 gap-3 px-2">
                <TwoCol valA={ra.estimation?.hours} valB={rb.estimation?.hours} />
                <TwoCol valA={ra.estimation?.team_size} valB={rb.estimation?.team_size} />
                <TwoCol valA={ra.estimation?.cost} valB={rb.estimation?.cost} />
              </div>
            )}
          </div>

          {/* API Endpoints */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <SectionHeader id="apis" label={`API Infrastructure (${ra.apis?.length} vs ${rb.apis?.length})`} changed={diffValue(ra.apis, rb.apis)} openSections={openSections} toggle={toggle} />
            {openSections.apis && (
              <div className="mt-4 grid grid-cols-2 gap-5 px-2">
                <div className="space-y-2">
                  {ra.apis?.map((api, i) => (
                    <div key={i} className="p-3 rounded-xl bg-brand-50/50 border border-brand-100 flex flex-col gap-1.5 shadow-sm">
                      <span className="text-[10px] font-black font-mono text-brand-600">{api.method}</span>
                      <span className="text-[10px] font-bold text-gray-800 font-mono break-all">{api.endpoint}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {rb.apis?.map((api, i) => (
                    <div key={i} className="p-3 rounded-xl bg-accent-50/50 border border-accent-100 flex flex-col gap-1.5 shadow-sm">
                      <span className="text-[10px] font-black font-mono text-accent-600">{api.method}</span>
                      <span className="text-[10px] font-bold text-gray-800 font-mono break-all">{api.endpoint}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Database Entities */}
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <SectionHeader id="database" label={`Data Entities (${ra.database?.length} vs ${rb.database?.length})`} changed={diffValue(ra.database, rb.database)} openSections={openSections} toggle={toggle} />
            {openSections.database && (
              <div className="mt-4 grid grid-cols-2 gap-5 px-2">
                <div className="space-y-2">
                  {ra.database?.map((t, i) => (
                    <div key={i} className="p-3 rounded-xl bg-brand-50/50 border border-brand-100 flex flex-col gap-1 border-l-4 border-l-brand-400">
                      <span className="text-[10px] font-black text-brand-700 uppercase tracking-tighter">{t.table}</span>
                      <span className="text-[10px] text-gray-500 font-medium leading-relaxed">{t.fields.join(', ')}</span>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  {rb.database?.map((t, i) => (
                    <div key={i} className="p-3 rounded-xl bg-accent-50/50 border border-accent-100 flex flex-col gap-1 border-l-4 border-l-accent-400">
                      <span className="text-[10px] font-black text-accent-700 uppercase tracking-tighter">{t.table}</span>
                      <span className="text-[10px] text-gray-500 font-medium leading-relaxed">{t.fields.join(', ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer info/legend */}
        <div className="px-8 py-5 bg-surface-50 border-t border-surface-100 flex items-center justify-between">
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-amber-400" />
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Modified Field</span>
              </div>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-400" />
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Identical Field</span>
              </div>
           </div>
           <p className="text-[10px] text-gray-300 font-black uppercase tracking-[0.2em]">Architecture Analytics engine v2.0</p>
        </div>
      </div>
    </div>
  );
}

export default ComparisonView;
