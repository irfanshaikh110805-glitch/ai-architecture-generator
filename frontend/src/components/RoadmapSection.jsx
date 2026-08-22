import { useState } from 'react';
import { Map, Copy, Check, CheckCircle2 } from 'lucide-react';

const PHASE_CONFIGS = [
  { from: '#4263eb', to: '#7c5cbf', bg: '#f0f4ff', border: '#c3d3ff', label_bg: '#e0e9ff', label_text: '#2a3faa' },
  { from: '#0ea5e9', to: '#8b5cf6', bg: '#f0f9ff', border: '#bae6fd', label_bg: '#e0f2fe', label_text: '#0369a1' },
  { from: '#10b981', to: '#0ea5e9', bg: '#f0fdf4', border: '#bbf7d0', label_bg: '#dcfce7', label_text: '#065f46' },
  { from: '#f59e0b', to: '#f97316', bg: '#fffbeb', border: '#fde68a', label_bg: '#fef3c7', label_text: '#92400e' },
  { from: '#ec4899', to: '#8b5cf6', bg: '#fdf4ff', border: '#e9d5ff', label_bg: '#fce7f3', label_text: '#9d174d' },
];

function RoadmapSection({ roadmap }) {
  const [copied, setCopied]       = useState(false);
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
    <div className="card-premium p-4 sm:p-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="section-icon" style={{ background: 'linear-gradient(135deg, #f59e0b, #ef4444)' }}>
            <Map size={16} />
          </div>
          <div>
            <h2 className="section-title text-base sm:text-lg">Development Roadmap</h2>
            <p className="text-xs text-gray-400 mt-0.5">{roadmap.length} phases</p>
          </div>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-all border border-surface-200 hover:border-brand-200 flex-shrink-0"
        >
          {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      {/* Phase Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 stagger">
        {roadmap.map((phase, idx) => {
          const cfg = PHASE_CONFIGS[idx % PHASE_CONFIGS.length];
          const totalTasks = phase.tasks?.length || 0;
          const doneTasks  = Object.keys(checkedTasks).filter(k => k.startsWith(`${idx}-`) && checkedTasks[k]).length;
          const progress   = totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0;

          return (
            <div
              key={idx}
              className="rounded-xl border overflow-hidden hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 fade-in"
              style={{ borderColor: cfg.border, background: cfg.bg }}
            >
              {/* Phase header */}
              <div
                className="px-3.5 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between gap-2"
                style={{ borderBottom: `1px solid ${cfg.border}` }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-white text-[11px] sm:text-xs font-bold flex-shrink-0"
                    style={{ background: `linear-gradient(135deg, ${cfg.from}, ${cfg.to})` }}
                  >
                    {idx + 1}
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-gray-800 break-words">{phase.phase}</h3>
                </div>
                <span
                  className="text-[11px] sm:text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0"
                  style={{ background: cfg.label_bg, color: cfg.label_text }}
                >
                  {doneTasks}/{totalTasks}
                </span>
              </div>

              {/* Progress bar */}
              <div className="h-1 bg-white/70">
                <div
                  className="h-full transition-all duration-500 rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: `linear-gradient(90deg, ${cfg.from}, ${cfg.to})`,
                  }}
                />
              </div>

              {/* Tasks */}
              <ul className="p-3 sm:p-4 space-y-2">
                {phase.tasks?.map((task, taskIdx) => {
                  const key  = `${idx}-${taskIdx}`;
                  const done = checkedTasks[key];
                  return (
                    <li
                      key={taskIdx}
                      className="flex items-start gap-2.5 cursor-pointer group py-1 active:bg-black/5 rounded-lg px-1 transition-colors select-none"
                      onClick={() => toggleTask(idx, taskIdx)}
                    >
                      <CheckCircle2
                        size={16}
                        className={`flex-shrink-0 mt-0.5 transition-all duration-200 ${
                          done ? 'text-emerald-500' : 'text-gray-300 group-hover:text-gray-400'
                        }`}
                        fill={done ? 'currentColor' : 'none'}
                      />
                      <span className={`text-xs sm:text-sm leading-relaxed transition-all duration-200 break-words ${done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
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
