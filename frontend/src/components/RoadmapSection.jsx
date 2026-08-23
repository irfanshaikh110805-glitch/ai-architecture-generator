import { useState } from 'react';
import { Map, Copy, Check, CheckSquare, Square } from 'lucide-react';

const PHASE_COLORS = [
  { header: 'bg-[#FF00FF] text-white', badge: 'bg-[#FFE600] text-black' },
  { header: 'bg-[#00FF00] text-black', badge: 'bg-[#00FFFF] text-black' },
  { header: 'bg-[#FFE600] text-black', badge: 'bg-[#FF00FF] text-white' },
  { header: 'bg-[#00FFFF] text-black', badge: 'bg-[#00FF00] text-black' },
  { header: 'bg-[#FF5500] text-white', badge: 'bg-[#FFE600] text-black' },
];

function RoadmapSection({ roadmap }) {
  const [copied, setCopied]        = useState(false);
  const [checkedTasks, setChecked] = useState({});

  if (!roadmap?.length) return null;

  const handleCopy = () => {
    const text = roadmap.map(phase =>
      `${phase.phase}\n${phase.tasks?.map(t => `  - ${t}`).join('\n')}`
    ).join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const toggleTask = (phaseIdx, taskIdx) => {
    const key = `${phaseIdx}-${taskIdx}`;
    setChecked(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="card-premium p-5 sm:p-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <div className="section-icon bg-[#FF5500] text-white">
            <Map size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="section-title text-base sm:text-xl">DEVELOPMENT ROADMAP</h2>
            <p className="font-mono text-xs font-bold text-gray-600 mt-0.5">
              {roadmap.length} EXECUTION PHASES
            </p>
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

      {/* Phase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roadmap.map((phase, idx) => {
          const cfg = PHASE_COLORS[idx % PHASE_COLORS.length];
          const totalTasks = phase.tasks?.length || 0;
          const doneTasks  = Object.keys(checkedTasks).filter(k => k.startsWith(`${idx}-`) && checkedTasks[k]).length;
          const progress   = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

          return (
            <div
              key={idx}
              className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_0px_#000000] transition-all"
            >
              {/* Phase header */}
              <div className="p-3.5 border-b-2 border-black flex items-center justify-between gap-2 bg-[#FDF6E3]">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={`w-7 h-7 border-2 border-black flex items-center justify-center font-mono font-black text-xs ${cfg.header}`}>
                    P{idx + 1}
                  </div>
                  <h3 className="font-mono font-black text-xs sm:text-sm text-black break-words uppercase">
                    {phase.phase}
                  </h3>
                </div>
                <span className={`font-mono text-xs font-black px-2 py-0.5 border border-black shadow-[1px_1px_0px_0px_#000000] ${cfg.badge}`}>
                  {doneTasks}/{totalTasks}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-2 bg-[#F4ECC8] border-b-2 border-black">
                <div
                  className="h-full bg-[#00FF00] border-r-2 border-black transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Tasks */}
              <ul className="p-4 space-y-2 bg-[#FDF6E3]/40">
                {phase.tasks?.map((task, taskIdx) => {
                  const key  = `${idx}-${taskIdx}`;
                  const done = checkedTasks[key];
                  return (
                    <li
                      key={taskIdx}
                      className="flex items-start gap-2.5 cursor-pointer py-1 select-none hover:bg-white transition-colors p-1 border border-transparent hover:border-black"
                      onClick={() => toggleTask(idx, taskIdx)}
                    >
                      {done ? (
                        <CheckSquare size={16} className="text-black stroke-[2.5] flex-shrink-0 mt-0.5" />
                      ) : (
                        <Square size={16} className="text-black stroke-[2.5] flex-shrink-0 mt-0.5" />
                      )}
                      <span className={`font-mono text-xs leading-relaxed break-words font-medium ${done ? 'text-gray-400 line-through' : 'text-black font-bold'}`}>
                        {task}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default RoadmapSection;
