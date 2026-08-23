import { useState } from 'react';
import { Layout, Copy, Check, Cpu } from 'lucide-react';

const STACK_STYLES = [
  { label: 'Frontend', key: 'frontend', color: 'bg-[#FF00FF] text-white', icon: '🖥️' },
  { label: 'Backend',  key: 'backend',  color: 'bg-[#00FF00] text-black', icon: '⚙️' },
  { label: 'Database', key: 'database', color: 'bg-[#00FFFF] text-black', icon: '🗄️' },
];

function ArchitectureSection({ architecture }) {
  const [copied, setCopied] = useState(false);

  if (!architecture) return null;

  const handleCopy = () => {
    const text = `Type: ${architecture.type}\nComponents: ${architecture.components?.join(', ')}\n\nTech Stack:\n- Frontend: ${architecture.tech_stack?.frontend}\n- Backend: ${architecture.tech_stack?.backend}\n- Database: ${architecture.tech_stack?.database}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="card-premium p-5 sm:p-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <div className="section-icon bg-[#00FFFF] text-black">
            <Layout size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="section-title text-base sm:text-xl">SYSTEM ARCHITECTURE</h2>
            <p className="font-mono text-xs font-bold text-gray-600 mt-0.5">HIGH-LEVEL TOPOLOGY & STACK</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="font-mono text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-3 py-1.5 hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1 flex-shrink-0 uppercase"
        >
          {copied ? <Check size={14} className="stroke-[3]" /> : <Copy size={14} className="stroke-[2.5]" />}
          <span>{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>

      <div className="space-y-6">
        {/* Architecture Type */}
        <div>
          <p className="font-mono text-[10px] font-black text-gray-700 uppercase tracking-widest mb-2">
            [ ARCHITECTURE PATTERN ]
          </p>
          <div className="inline-flex items-center gap-2 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_0px_#000000] px-4 py-2 font-mono font-black text-sm uppercase text-black">
            <Cpu size={16} className="stroke-[2.5]" />
            {architecture.type}
          </div>
        </div>

        {/* Components */}
        {architecture.components?.length > 0 && (
          <div>
            <p className="font-mono text-[10px] font-black text-gray-700 uppercase tracking-widest mb-2">
              [ SYSTEM COMPONENTS & MICROSERVICES ]
            </p>
            <div className="flex flex-wrap gap-2">
              {architecture.components.map((component, idx) => (
                <span
                  key={idx}
                  className="bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-3 py-1 font-mono text-xs font-bold text-black uppercase"
                >
                  {component}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Tech Stack */}
        {architecture.tech_stack && (
          <div>
            <p className="font-mono text-[10px] font-black text-gray-700 uppercase tracking-widest mb-2">
              [ CORE TECH STACK ]
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {STACK_STYLES.map(({ label, key, color, icon }) => {
                const value = architecture.tech_stack?.[key];
                if (!value) return null;
                return (
                  <div
                    key={label}
                    className="bg-[#FDF6E3] border-2 border-black shadow-[3px_3px_0px_0px_#000000] p-4"
                  >
                    <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-black">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base">{icon}</span>
                        <p className="font-mono text-xs font-black uppercase text-black">{label}</p>
                      </div>
                      <span className={`font-mono text-[9px] font-black px-1.5 py-0.5 border border-black ${color} uppercase`}>
                        VERIFIED
                      </span>
                    </div>
                    <p className="font-mono text-xs sm:text-sm font-bold text-black break-words">
                      {value}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ArchitectureSection;
