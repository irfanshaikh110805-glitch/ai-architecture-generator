import { useState } from 'react';
import { Database, Copy, Check, Link } from 'lucide-react';

function DatabaseSection({ database }) {
  const [copied, setCopied] = useState(false);

  if (!database?.length) return null;

  const handleCopy = () => {
    const text = database.map(table => {
      let str = `Table: ${table.table}\nFields: ${table.fields?.join(', ')}`;
      if (table.relationships?.length) str += `\nRelationships: ${table.relationships.join(', ')}`;
      return str;
    }).join('\n\n');
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="card-premium p-4 sm:p-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="section-icon" style={{ background: 'linear-gradient(135deg, #10b981, #0ea5e9)' }}>
            <Database size={16} />
          </div>
          <div>
            <h2 className="section-title text-base sm:text-lg">
              Database Schema
              <span className="text-gray-400 font-normal text-xs sm:text-sm ml-1.5">(3NF)</span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">{database.length} tables</p>
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

      {/* Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3.5 sm:gap-4 stagger">
        {database.map((table, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-xl border border-surface-200 bg-white hover:border-brand-200 hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 fade-in"
          >
            {/* Table color accent */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{
                background: `linear-gradient(90deg, hsl(${(idx * 47) % 360}, 70%, 55%), hsl(${(idx * 47 + 60) % 360}, 70%, 65%))`,
              }}
            />

            <div className="p-3.5 sm:p-4 pt-4 sm:pt-5">
              {/* Table name */}
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <div
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center text-white flex-shrink-0"
                  style={{
                    background: `linear-gradient(135deg, hsl(${(idx * 47) % 360}, 70%, 55%), hsl(${(idx * 47 + 60) % 360}, 70%, 65%))`,
                  }}
                >
                  <Database size={12} />
                </div>
                <h3 className="font-bold text-gray-800 font-mono text-xs sm:text-sm group-hover:text-brand-600 transition-colors break-words">
                  {table.table}
                </h3>
              </div>

              {/* Fields */}
              <div className="mb-3">
                <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Fields</p>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {table.fields?.map((field, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-[11px] sm:text-xs font-mono text-brand-700 border break-all"
                      style={{ background: '#f0f4ff', borderColor: '#c3d3ff' }}
                    >
                      {field}
                    </span>
                  ))}
                </div>
              </div>

              {/* Relationships */}
              {table.relationships?.length > 0 && (
                <div>
                  <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5">Relationships</p>
                  <div className="space-y-1 sm:space-y-1.5">
                    {table.relationships.map((rel, i) => (
                      <div key={i} className="flex items-center gap-1.5 text-[11px] sm:text-xs text-emerald-700 bg-emerald-50 border border-emerald-200/70 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg font-mono break-all">
                        <Link size={10} className="flex-shrink-0 text-emerald-600" />
                        <span>{rel}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DatabaseSection;
