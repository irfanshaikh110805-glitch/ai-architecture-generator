import { useState } from 'react';
import { Globe, Copy, Check } from 'lucide-react';

const METHOD_STYLES = {
  GET:    'method-get',
  POST:   'method-post',
  PUT:    'method-put',
  PATCH:  'method-patch',
  DELETE: 'method-delete',
};

const METHOD_COLORS = {
  GET:    { from: '#10b981', to: '#34d399' },
  POST:   { from: '#3b82f6', to: '#60a5fa' },
  PUT:    { from: '#f59e0b', to: '#fcd34d' },
  PATCH:  { from: '#06b6d4', to: '#67e8f9' },
  DELETE: { from: '#ef4444', to: '#f87171' },
};

function APIsSection({ apis }) {
  const [copied, setCopied] = useState(false);
  const [filter, setFilter] = useState('ALL');

  if (!apis?.length) return null;

  const methods = ['ALL', ...new Set(apis.map(a => a.method))];
  const filtered = filter === 'ALL' ? apis : apis.filter(a => a.method === filter);

  const handleCopy = () => {
    const text = apis.map(api => `${api.method} ${api.endpoint} — ${api.description}`).join('\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="card-premium p-6 fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="section-icon">
            <Globe size={16} />
          </div>
          <div>
            <h2 className="section-title">
              REST APIs
              <span className="text-gray-400 font-normal text-sm ml-1.5">({apis.length} endpoints)</span>
            </h2>
            {/* Method filter pills */}
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {methods.map(m => {
                const c = METHOD_COLORS[m];
                const isActive = filter === m;
                return (
                  <button
                    key={m}
                    onClick={() => setFilter(m)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all duration-200 ${
                      isActive && m !== 'ALL'
                        ? 'text-white shadow-sm'
                        : isActive
                        ? 'bg-gray-900 text-white'
                        : 'bg-surface-100 text-gray-500 hover:bg-surface-200'
                    }`}
                    style={isActive && c ? { background: `linear-gradient(135deg, ${c.from}, ${c.to})` } : {}}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all border border-transparent hover:border-brand-200"
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* API list */}
      <div className="space-y-2 stagger">
        {filtered.map((api, idx) => (
          <div
            key={idx}
            className="group flex items-start gap-3 p-3.5 rounded-xl border border-surface-200 bg-white hover:border-brand-200 hover:shadow-sm transition-all duration-200 hover:-translate-y-0.5 fade-in"
          >
            <span className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs flex-shrink-0 uppercase tracking-wide ${METHOD_STYLES[api.method] || METHOD_STYLES.GET}`}>
              {api.method}
            </span>
            <div className="flex-1 min-w-0">
              <code className="text-brand-600 font-mono text-sm font-semibold block truncate group-hover:text-brand-700 transition-colors">
                {api.endpoint}
              </code>
              <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{api.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default APIsSection;
