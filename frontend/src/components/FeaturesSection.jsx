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
    <div className="card-premium p-6 fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="section-icon">
            <Sparkles size={16} />
          </div>
          <div>
            <h2 className="section-title">
              Features
              <span className="text-gray-400 font-normal text-sm ml-1.5">(MoSCoW Prioritization)</span>
            </h2>
            <div className="flex items-center gap-3 mt-0.5">
              {Object.entries(counts).map(([priority, count]) => {
                const st = PRIORITY_STYLES[priority];
                return (
                  <span key={priority} className="flex items-center gap-1 text-xs text-gray-500">
                    <span className={`inline-block w-2 h-2 rounded-full ${st?.dot || 'bg-gray-400'}`} />
                    {count} {priority}
                  </span>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter pills */}
          <div className="flex items-center gap-1 bg-surface-50 rounded-xl p-1 border border-surface-200">
            {priorities.map(p => (
              <button
                key={p}
                onClick={() => setFilter(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
                  filter === p
                    ? 'bg-white text-brand-600 shadow-sm border border-brand-200/50'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 border border-transparent hover:border-brand-200"
          >
            {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Feature Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 stagger">
        {filtered.map((feature, idx) => {
          const st = PRIORITY_STYLES[feature.priority] || PRIORITY_STYLES["Won't"];
          return (
            <div
              key={idx}
              className="group flex items-center gap-3 px-4 py-3 rounded-xl border bg-white hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5 fade-in"
              style={{ borderColor: 'rgba(66,99,235,0.06)' }}
            >
              <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${st.dot}`} />
              <span className="font-medium text-gray-700 text-sm flex-1 group-hover:text-gray-900 transition-colors">{feature.name}</span>
              <span className={`badge text-xs flex-shrink-0 ${st.pill}`}>{feature.priority}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default FeaturesSection;
