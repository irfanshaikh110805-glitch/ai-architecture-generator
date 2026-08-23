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
  GET:    'bg-[#00FF00] text-black',
  POST:   'bg-[#FF00FF] text-white',
  PUT:    'bg-[#FFE600] text-black',
  PATCH:  'bg-[#00FFFF] text-black',
  DELETE: 'bg-[#FF5500] text-white',
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
    <div className="card-premium p-5 sm:p-7">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <div className="section-icon bg-[#FFE600] text-black">
            <Globe size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="section-title text-base sm:text-xl">
              REST APIS
              <span className="font-mono text-xs font-bold text-gray-700 ml-2">[{apis.length} ENDPOINTS]</span>
            </h2>
            <p className="font-mono text-xs font-bold text-gray-600 mt-0.5">
              OPENAPI 3.0 SPECIFICATION
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {/* Method filter pills */}
          <div className="flex items-center gap-1 bg-[#FDF6E3] p-1 border-2 border-black shadow-[2px_2px_0px_0px_#000000] overflow-x-auto scrollbar-hide">
            {methods.map(m => {
              const isActive = filter === m;
              const col = METHOD_COLORS[m] || 'bg-black text-white';
              return (
                <button
                  key={m}
                  onClick={() => setFilter(m)}
                  className={`font-mono text-xs font-bold px-2.5 py-1 uppercase whitespace-nowrap transition-all ${
                    isActive
                      ? `${col} border border-black shadow-[1px_1px_0px_0px_#000000]`
                      : 'text-black hover:bg-white'
                  }`}
                >
                  {m}
                </button>
              );
            })}
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

      {/* API list */}
      <div className="space-y-2.5">
        {filtered.map((api, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 sm:p-4 bg-[#FDF6E3] border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[4px_4px_0px_0px_#000000] transition-all"
          >
            <span className={`px-2.5 py-1 border-2 border-black text-xs font-mono font-black flex-shrink-0 uppercase ${METHOD_STYLES[api.method] || METHOD_STYLES.GET}`}>
              {api.method}
            </span>
            <div className="flex-1 min-w-0">
              <code className="font-mono text-xs sm:text-sm font-bold text-black block break-all">
                {api.endpoint}
              </code>
              <p className="font-mono text-xs text-gray-700 mt-1 leading-relaxed break-words font-medium">
                {api.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default APIsSection;
