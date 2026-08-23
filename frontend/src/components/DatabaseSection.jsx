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
    <div className="card-premium p-5 sm:p-7">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-black">
        <div className="flex items-center gap-3">
          <div className="section-icon bg-[#00FF00] text-black">
            <Database size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="section-title text-base sm:text-xl">
              DATABASE SCHEMA
              <span className="font-mono text-xs font-bold text-gray-700 ml-2">[3NF]</span>
            </h2>
            <p className="font-mono text-xs font-bold text-gray-600 mt-0.5">
              {database.length} TABLES DEFINED
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

      {/* Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {database.map((table, idx) => (
          <div
            key={idx}
            className="bg-[#FDF6E3] border-3 border-black shadow-[4px_4px_0px_0px_#000000] p-4 sm:p-5 hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[6px_6px_0px_0px_#000000] transition-all"
          >
            {/* Table Name Header */}
            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b-2 border-black">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-black text-[#00FF00] flex items-center justify-center font-mono font-bold text-xs">
                  #
                </div>
                <h3 className="font-mono font-black text-sm sm:text-base text-black break-words">
                  {table.table}
                </h3>
              </div>
              <span className="font-mono text-[10px] font-black bg-[#FFE600] text-black px-2 py-0.5 border border-black uppercase">
                ENTITY
              </span>
            </div>

            {/* Fields */}
            <div className="mb-4">
              <p className="font-mono text-[10px] font-black text-gray-700 uppercase tracking-wider mb-2">
                [ COLUMNS / ATTRIBUTES ]
              </p>
              <div className="flex flex-wrap gap-1.5">
                {table.fields?.map((field, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 bg-white font-mono font-bold text-xs text-black border-2 border-black shadow-[1px_1px_0px_0px_#000000] break-all"
                  >
                    {field}
                  </span>
                ))}
              </div>
            </div>

            {/* Relationships */}
            {table.relationships?.length > 0 && (
              <div>
                <p className="font-mono text-[10px] font-black text-gray-700 uppercase tracking-wider mb-2">
                  [ FOREIGN RELATIONS ]
                </p>
                <div className="space-y-1.5">
                  {table.relationships.map((rel, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-1.5 text-xs font-mono font-bold text-black bg-[#00FFFF] border-2 border-black p-1.5 shadow-[1px_1px_0px_0px_#000000] break-all"
                    >
                      <Link size={12} className="stroke-[3] flex-shrink-0" />
                      <span>{rel}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DatabaseSection;
