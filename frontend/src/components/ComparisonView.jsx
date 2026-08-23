import { useState } from 'react';
import { GitCompare, X, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

function diffValue(a, b) {
  const sa = JSON.stringify(a, null, 2);
  const sb = JSON.stringify(b, null, 2);
  return sa !== sb;
}

const SectionHeader = ({ id, label, changed, openSections, toggle }) => (
  <button
    onClick={() => toggle(id)}
    className={`w-full flex items-center justify-between p-3.5 border-2 border-black font-mono font-black text-xs uppercase tracking-wide transition-all ${
      changed
        ? 'bg-[#FFE600] text-black shadow-[3px_3px_0px_0px_#000000]'
        : 'bg-white text-black shadow-[2px_2px_0px_0px_#000000] hover:bg-[#FDF6E3]'
    }`}
  >
    <span className="flex items-center gap-2">
      <ChevronRight size={16} className={`stroke-[3] transition-transform ${openSections[id] ? 'rotate-90' : ''}`} />
      {label}
      {changed && (
        <span className="flex items-center gap-1 px-2 py-0.2 bg-black text-[#FFE600] text-[9px] font-black uppercase">
          <AlertCircle size={10} className="stroke-[3]" />
          DIFF
        </span>
      )}
    </span>
    {changed ? (
      <span className="text-[10px] font-black text-black bg-[#FF5500] text-white px-2 py-0.2">MODIFIED</span>
    ) : (
      <span className="text-[10px] font-black text-black bg-[#00FF00] px-2 py-0.2 flex items-center gap-1">
        <CheckCircle2 size={10} className="stroke-[3]" /> MATCH
      </span>
    )}
  </button>
);

const TwoCol = ({ valA, valB }) => {
  const changed = String(valA) !== String(valB);
  return (
    <div className={`grid grid-cols-2 gap-3 p-3 border-2 border-black font-mono text-xs ${changed ? 'bg-[#FFE600]/30 shadow-[2px_2px_0px_0px_#000000]' : 'bg-white'}`}>
      <div>
        <span className="text-[10px] font-black text-black uppercase block mb-1">[ REVISION A ]</span>
        <span className={`block leading-relaxed break-words ${changed ? 'text-black font-black' : 'text-gray-800 font-medium'}`}>{String(valA)}</span>
      </div>
      <div className="border-l-2 border-black pl-3">
        <span className="text-[10px] font-black text-black uppercase block mb-1">[ REVISION B ]</span>
        <span className={`block leading-relaxed break-words ${changed ? 'text-black font-black' : 'text-gray-800 font-medium'}`}>{String(valB)}</span>
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
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/60 selection:bg-[#00FF00] selection:text-black">
      <div className="bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000000] w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#00FFFF] border-b-3 border-black text-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-black text-white flex items-center justify-center border-2 border-black">
              <GitCompare size={20} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg sm:text-xl uppercase leading-none">
                STRUCTURAL PERSPECTIVE DIFF
              </h2>
              <div className="flex gap-4 mt-1.5 font-mono text-xs font-bold">
                <span className="bg-[#FF00FF] text-white px-1.5 py-0.2 border border-black">
                  A: {versionA.label}
                </span>
                <span className="bg-[#00FF00] text-black px-1.5 py-0.2 border border-black">
                  B: {versionB.label}
                </span>
              </div>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="p-1 bg-white border-2 border-black hover:bg-[#FF5500] hover:text-white transition-colors"
          >
            <X size={20} className="stroke-[3]" />
          </button>
        </div>

        {/* Labels Header */}
        <div className="grid grid-cols-2 border-b-2 border-black bg-[#F4ECC8]">
          <div className="p-3 text-center border-r-2 border-black font-mono">
            <p className="text-[10px] font-black text-black uppercase">[ REVISION A CONCEPT ]</p>
            <p className="text-xs font-bold text-black truncate px-2">{versionA.idea}</p>
          </div>
          <div className="p-3 text-center font-mono">
            <p className="text-[10px] font-black text-black uppercase">[ REVISION B CONCEPT ]</p>
            <p className="text-xs font-bold text-black truncate px-2">{versionB.idea}</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-[#FDF6E3]">
          
          {/* Architecture Details */}
          <div>
            <SectionHeader id="architecture" label="Pattern & Tech Stack" changed={diffValue(ra.architecture, rb.architecture)} openSections={openSections} toggle={toggle} />
            {openSections.architecture && (
              <div className="mt-2 space-y-2">
                <TwoCol valA={ra.architecture?.type} valB={rb.architecture?.type} />
                <TwoCol valA={ra.architecture?.tech_stack?.frontend} valB={rb.architecture?.tech_stack?.frontend} />
                <TwoCol valA={ra.architecture?.tech_stack?.backend} valB={rb.architecture?.tech_stack?.backend} />
                <TwoCol valA={ra.architecture?.tech_stack?.database} valB={rb.architecture?.tech_stack?.database} />
                <TwoCol valA={ra.architecture?.components?.join(', ')} valB={rb.architecture?.components?.join(', ')} />
              </div>
            )}
          </div>

          {/* Features */}
          <div>
            <SectionHeader id="features" label="Feature Set Comparison" changed={diffValue(ra.features, rb.features)} openSections={openSections} toggle={toggle} />
            {openSections.features && (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  {ra.features?.map((f, i) => (
                    <div key={i} className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                      <span className="font-mono text-[9px] font-black bg-[#FF00FF] text-white px-1 py-0.2 border border-black uppercase">{f.priority}</span>
                      <p className="font-mono text-xs font-bold text-black mt-1">{f.name}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  {rb.features?.map((f, i) => (
                    <div key={i} className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                      <span className="font-mono text-[9px] font-black bg-[#00FF00] text-black px-1 py-0.2 border border-black uppercase">{f.priority}</span>
                      <p className="font-mono text-xs font-bold text-black mt-1">{f.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Estimation */}
          <div>
            <SectionHeader id="estimation" label="Resources & Timeline" changed={diffValue(ra.estimation, rb.estimation)} openSections={openSections} toggle={toggle} />
            {openSections.estimation && (
              <div className="mt-2 space-y-2">
                <TwoCol valA={ra.estimation?.hours} valB={rb.estimation?.hours} />
                <TwoCol valA={ra.estimation?.team_size} valB={rb.estimation?.team_size} />
                <TwoCol valA={ra.estimation?.cost} valB={rb.estimation?.cost} />
              </div>
            )}
          </div>

          {/* APIs */}
          <div>
            <SectionHeader id="apis" label={`API Endpoints (${ra.apis?.length} vs ${rb.apis?.length})`} changed={diffValue(ra.apis, rb.apis)} openSections={openSections} toggle={toggle} />
            {openSections.apis && (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  {ra.apis?.map((api, i) => (
                    <div key={i} className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                      <span className="font-mono text-[9px] font-black px-1.5 py-0.5 border border-black bg-[#FF00FF] text-white">{api.method}</span>
                      <code className="font-mono text-xs font-bold block mt-1 break-all">{api.endpoint}</code>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  {rb.apis?.map((api, i) => (
                    <div key={i} className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                      <span className="font-mono text-[9px] font-black px-1.5 py-0.5 border border-black bg-[#00FF00] text-black">{api.method}</span>
                      <code className="font-mono text-xs font-bold block mt-1 break-all">{api.endpoint}</code>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Database */}
          <div>
            <SectionHeader id="database" label={`Data Entities (${ra.database?.length} vs ${rb.database?.length})`} changed={diffValue(ra.database, rb.database)} openSections={openSections} toggle={toggle} />
            {openSections.database && (
              <div className="mt-2 grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  {ra.database?.map((t, i) => (
                    <div key={i} className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                      <span className="font-mono text-xs font-black uppercase text-black">{t.table}</span>
                      <p className="font-mono text-[10px] text-gray-700 mt-0.5 leading-snug">{t.fields?.join(', ')}</p>
                    </div>
                  ))}
                </div>
                <div className="space-y-1.5">
                  {rb.database?.map((t, i) => (
                    <div key={i} className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                      <span className="font-mono text-xs font-black uppercase text-black">{t.table}</span>
                      <p className="font-mono text-[10px] text-gray-700 mt-0.5 leading-snug">{t.fields?.join(', ')}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F4ECC8] border-t-2 border-black flex items-center justify-between font-mono text-[10px] font-black uppercase">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#FF5500] border border-black" /> MODIFIED
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#00FF00] border border-black" /> IDENTICAL
            </span>
          </div>
          <span>ARCHITECH DIFF COMPILER</span>
        </div>
      </div>
    </div>
  );
}

export default ComparisonView;
