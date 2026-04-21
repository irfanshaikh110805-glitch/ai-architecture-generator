import { useState } from 'react';
import { Layout, Copy, Check, Cpu } from 'lucide-react';

const STACK_STYLES = [
  { label: 'Frontend', key: 'frontend', from: '#f97316', to: '#fb923c', icon: '🖥️' },
  { label: 'Backend',  key: 'backend',  from: '#10b981', to: '#34d399', icon: '⚙️' },
  { label: 'Database', key: 'database', from: '#3b82f6', to: '#60a5fa', icon: '🗄️' },
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
    <div className="card-premium p-6 fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="section-icon">
            <Layout size={16} />
          </div>
          <h2 className="section-title">System Architecture</h2>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-gray-500 hover:text-brand-600 hover:bg-brand-50 transition-all duration-200 border border-transparent hover:border-brand-200"
        >
          {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div className="space-y-6">
        {/* Architecture Type */}
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Architecture Pattern</p>
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm text-brand-600 border border-brand-200/60"
            style={{ background: 'linear-gradient(135deg, #eff6ff, #ecfeff)' }}
          >
            <Cpu size={14} />
            {architecture.type}
          </span>
        </div>

        {/* Components */}
        {architecture.components?.length > 0 && (
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Components</p>
            <div className="flex flex-wrap gap-2 stagger">
              {architecture.components.map((component, idx) => (
                <span
                  key={idx}
                  className="tag fade-in hover-lift px-3 py-1.5 font-medium text-xs rounded-xl"
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
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Tech Stack</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 stagger">
              {STACK_STYLES.map(({ label, key, from, to, icon }) => {
                const value = architecture.tech_stack?.[key];
                if (!value) return null;
                return (
                  <div
                    key={label}
                    className="group relative overflow-hidden rounded-xl p-4 border border-transparent hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 fade-in"
                    style={{
                      background: `linear-gradient(145deg, white 0%, rgba(${from === '#f97316' ? '249,115,22' : from === '#10b981' ? '16,185,129' : '59,130,246'},0.04) 100%)`,
                      borderColor: `${from}20`,
                    }}
                  >
                    {/* Gradient accent top border */}
                    <div
                      className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl opacity-60 group-hover:opacity-100 transition-opacity"
                      style={{ background: `linear-gradient(90deg, ${from}, ${to})` }}
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-base">{icon}</span>
                      <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{label}</p>
                    </div>
                    <p className="font-semibold text-sm text-gray-800 group-hover:text-gray-900 transition-colors">{value}</p>
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
