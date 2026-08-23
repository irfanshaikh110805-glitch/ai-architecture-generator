import { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';

const PRIORITY_STYLES = {
  'Must':   { pill: 'priority-must',   dot: 'bg-[#FF00FF]', border: 'border-black' },
  'Should': { pill: 'priority-should', dot: 'bg-[#FFE600]', border: 'border-black' },
  'Could':  { pill: 'priority-could',  dot: 'bg-[#00FFFF]', border: 'border-black' },
  "Won't":  { pill: 'priority-wont',   dot: 'bg-white',     border: 'border-black' },
};

function FeaturesSection({ features }) {
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState('All');

  if (!features?.length) return null;

  const handleCopy = () => {
    const text = features.map(f => `[${f.priority}] ${f.name}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const counts = features.reduce((acc, f) => {
    acc[f.priority] = (acc[f.priority] || 0) + 1;
    return acc;
  }, {});

  const priorities = ['All', ...Object.keys(PRIORITY_STYLES).filter(p => counts[p])];
  const filtered = filter === 'All' ? features : features.filter(f => f.priority === filter);

  return (
    <div className="card-premium p-5 sm:p-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <div className="section-icon bg-[#FF00FF] text-white">
            <Sparkles size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="section-title text-base sm:text-xl">
              SYSTEM FEATURES
              <span className="font-mono text-xs font-bold text-gray-700 ml-2">[MoSCoW]</span>
            </h2>
            <div className="flex items-center gap-2 sm:gap-3 mt-1 flex-wrap">
              {Object.entries(counts).map(([priority, count]) => (
                <span key={priority} className="font-mono text-xs font-bold flex items-center gap-1.5 bg-[#FDF6E3] px-2 py-0.5 border border-black">
                  <span className={`w-2.5 h-2.5 border border-black ${PRIORITY_STYLES[priority]?.dot || 'bg-white'}`} />
                  {count} {priority}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {/* Filter pills */}
          <div className="flex items-center gap-1 bg-[#FDF6E3] p-1 border-2 border-black shadow-[2px_2px_0px_0px_#000000] overflow-x-auto scrollbar-hide">
            {priorities.map(p => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`font-mono text-xs font-bold px-2.5 py-1 uppercase whitespace-nowrap transition-all ${
                  filter === p
                    ? 'bg-[#00FF00] text-black border border-black shadow-[1px_1px_0px_0px_#000000]'
                    : 'text-black hover:bg-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="font-mono text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-3 py-1.5 hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1 flex-shrink-0 uppercase"
          >
            {copied ? <Check size={14} className="stroke-[3]" /> : <Copy size={14} className="stroke-[2.5]" />}
            <span>{copied ? 'COPIED' : 'COPY'}</span>
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((feature, idx) => {
          const st = PRIORITY_STYLES[feature.priority] || PRIORITY_STYLES["Won't"];
          return (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 p-3.5 bg-[#FDF6E3] border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000000] transition-all"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className={`w-3 h-3 border-2 border-black flex-shrink-0 ${st.dot}`} />
                <span className="font-mono text-xs sm:text-sm font-bold text-black leading-snug break-words">
                  {feature.name}
                </span>
              </div>
              <span className={`text-[10px] sm:text-xs px-2 py-0.5 flex-shrink-0 ${st.pill}`}>
                {feature.priority}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeaturesSection;
