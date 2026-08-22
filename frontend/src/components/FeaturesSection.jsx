import { useState } from 'react';
import { Sparkles, Copy, Check } from 'lucide-react';

const PRIORITY_STYLES = {
  'Must':   { pill: 'priority-must',   dot: 'bg-red-500',    bar: 'bg-red-400' },
  'Should': { pill: 'priority-should', dot: 'bg-orange-500', bar: 'bg-orange-400' },
  'Could':  { pill: 'priority-could',  dot: 'bg-amber-500',  bar: 'bg-amber-400' },
  "Won't":  { pill: 'priority-wont',   dot: 'bg-gray-400',   bar: 'bg-gray-300' },
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
    <div className="card-premium p-4 sm:p-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="section-icon">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="section-title text-base sm:text-lg">
              Features
              <span className="text-gray-400 font-normal text-xs sm:text-sm ml-1.5">(MoSCoW)</span>
            </h2>
            <div className="flex items-center gap-2 sm:gap-3 mt-0.5 flex-wrap">
              {Object.entries(counts).map(([priority, count]) => {
                const st = PRIORITY_STYLES[priority];
                return (
                  <span key={priority} className="flex items-center gap-1 text-[11px] sm:text-xs text-gray-500">
                    <span className={`inline-block w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${st?.dot || 'bg-gray-400'}`} />
                    {count} {priority}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {/* Filter pills */}
          <div className="flex items-center gap-1 bg-surface-50 rounded-xl p-1 border border-surface-200 overflow-x-auto scrollbar-hide touch-pan-x max-w-[calc(100vw-120px)] sm:max-w-none">
            {priorities.map(p => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                  filter === p
                    ? 'bg-white text-brand-600 shadow-xs border border-brand-200/60'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-600 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 border border-surface-200 hover:border-brand-200 flex-shrink-0"
          >
            {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 stagger">
        {filtered.map((feature, idx) => {
          const st = PRIORITY_STYLES[feature.priority] || PRIORITY_STYLES["Won't"];
          return (
            <div
              key={idx}
              className="group flex items-center gap-2.5 sm:gap-3 px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border bg-white hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5 fade-in"
              style={{ borderColor: 'rgba(66,99,235,0.08)' }}
            >
              <span className={`w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full flex-shrink-0 ${st.dot}`} />
              <span className="font-medium text-gray-800 text-xs sm:text-sm flex-1 leading-snug break-words group-hover:text-brand-700 transition-colors">{feature.name}</span>
              <span className={`badge text-[10px] sm:text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${st.pill}`}>{feature.priority}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeaturesSection;
