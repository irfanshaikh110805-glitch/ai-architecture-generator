import { useState, useMemo } from 'react';
import { Lightbulb, Shield, Zap, TrendingUp, Code, Database, Layout, Server, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, Info, Layers } from 'lucide-react';

const ALTERNATIVES = {
  frontend: {
    React: [
      { name: 'Next.js', pros: ['SSR/SSG built-in', 'SEO-friendly', 'File-based routing'], cons: ['More complex setup', 'Opinionated'], perf: 9, security: 8 },
      { name: 'Vue.js', pros: ['Gentle learning curve', 'Great DX', 'Lightweight'], cons: ['Smaller ecosystem', 'Less enterprise adoption'], perf: 8, security: 7 },
      { name: 'SvelteKit', pros: ['No virtual DOM', 'Tiny bundles', 'Fast'], cons: ['Smaller community', 'Less tooling'], perf: 10, security: 7 },
    ],
    'Vue.js': [
      { name: 'React', pros: ['Huge ecosystem', 'Meta-backed', 'React Native'], cons: ['JSX learning curve', 'Verbose'], perf: 8, security: 8 },
      { name: 'Angular', pros: ['Full framework', 'TypeScript native', 'Enterprise-grade'], cons: ['Steep learning curve', 'Heavy'], perf: 7, security: 9 },
    ],
    Angular: [
      { name: 'React', pros: ['More flexible', 'Lighter'], cons: ['Need to pick libraries'], perf: 8, security: 8 },
      { name: 'Vue.js', pros: ['Simpler templates', 'Less boilerplate'], cons: ['Smaller ecosystem'], perf: 8, security: 7 },
    ],
  },
  backend: {
    'Node.js': [
      { name: 'FastAPI (Python)', pros: ['Async-native', 'Auto docs', 'Type hints'], cons: ['GIL limitations', 'Different ecosystem'], perf: 9, security: 8 },
      { name: 'Go (Gin)', pros: ['Compiled speed', 'Concurrency built-in', 'Low memory'], cons: ['Verbose error handling', 'Smaller ecosystem'], perf: 10, security: 9 },
      { name: 'Rust (Actix)', pros: ['Maximum performance', 'Memory safe'], cons: ['Steep learning curve', 'Long compilation'], perf: 10, security: 10 },
    ],
    'Django': [
      { name: 'FastAPI', pros: ['Much faster', 'Modern async', 'Auto OpenAPI'], cons: ['Less batteries-included'], perf: 9, security: 8 },
      { name: 'Node.js/Express', pros: ['Same language as frontend', 'Large npm ecosystem'], cons: ['Callback complexity'], perf: 8, security: 7 },
    ],
    'FastAPI': [
      { name: 'Django', pros: ['ORM included', 'Admin panel', 'Battle-tested'], cons: ['Synchronous by default', 'Heavier'], perf: 7, security: 9 },
      { name: 'Go (Gin)', pros: ['10x faster throughput', 'Static typing'], cons: ['Different language'], perf: 10, security: 9 },
    ],
  },
  database: {
    PostgreSQL: [
      { name: 'MySQL', pros: ['Wide hosting support', 'Familiar syntax', 'Fast reads'], cons: ['Less advanced features', 'Weaker JSON support'], perf: 8, security: 8 },
      { name: 'MongoDB', pros: ['Flexible schema', 'Horizontal scaling', 'JSON-native'], cons: ['No ACID by default', 'Complex joins'], perf: 8, security: 7 },
      { name: 'CockroachDB', pros: ['Distributed SQL', 'Auto-sharding', 'Geo-replication'], cons: ['Higher cost', 'Slower for simple queries'], perf: 7, security: 9 },
    ],
    MongoDB: [
      { name: 'PostgreSQL', pros: ['ACID compliant', 'Powerful queries', 'JSON support'], cons: ['Schema migrations needed'], perf: 9, security: 9 },
      { name: 'DynamoDB', pros: ['Serverless', 'Auto-scaling', 'Managed'], cons: ['AWS lock-in', 'Query limitations'], perf: 10, security: 9 },
    ],
  },
};

const SECURITY_TIPS = [
  { icon: Shield, level: 'critical', label: 'Authentication', tip: 'Implement JWT with short expiry + refresh token rotation. Use HTTPS-only cookies for token storage.' },
  { icon: Shield, level: 'critical', label: 'Input Validation', tip: 'Validate all inputs server-side. Use parameterized queries to prevent SQL injection.' },
  { icon: AlertTriangle, level: 'high', label: 'Rate Limiting', tip: 'Apply rate limiting on all public endpoints. Use Redis-based rate limiter for distributed systems.' },
  { icon: Shield, level: 'high', label: 'CORS Policy', tip: 'Configure strict CORS policies. Never use wildcard (*) origins in production.' },
  { icon: Info, level: 'medium', label: 'Secrets Management', tip: 'Store secrets in environment variables or vault services (AWS Secrets Manager, HashiCorp Vault).' },
  { icon: Info, level: 'medium', label: 'Dependency Scanning', tip: 'Run npm audit / pip check in CI/CD. Use Snyk or Dependabot for automated vulnerability monitoring.' },
];

const PERF_TIPS = [
  { label: 'Database Indexing', tip: 'Add indexes on frequently queried columns. Use EXPLAIN ANALYZE to identify slow queries.', impact: 9 },
  { label: 'API Response Caching', tip: 'Cache GET responses with Redis. Implement ETags for conditional requests.', impact: 8 },
  { label: 'Lazy Loading', tip: 'Implement code splitting and lazy loading for frontend bundles. Use React.lazy().', impact: 7 },
  { label: 'CDN for Static Assets', tip: 'Serve images, CSS, and JS through a CDN (CloudFront/Cloudflare) to reduce server load.', impact: 8 },
  { label: 'Connection Pooling', tip: 'Use PgBouncer or built-in pool for database connections to avoid overhead.', impact: 9 },
  { label: 'Horizontal Scaling', tip: 'Design stateless APIs to allow horizontal scaling behind a load balancer.', impact: 10 },
];

function BarMeter({ value, color = 'brand' }) {
  const getGradient = () => {
     if (color === 'emerald') return 'from-emerald-400 to-teal-400';
     if (color === 'red') return 'from-rose-400 to-red-500';
     return 'from-brand-400 to-cyan-400';
  };
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 bg-surface-100 rounded-full h-1.5 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${getGradient()} shadow-sm shadow-brand-500/10 transition-all duration-700`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className="text-[10px] font-black font-mono text-gray-400 w-8">{value}/10</span>
    </div>
  );
}

function TechRecommendations({ architecture }) {
  const [activeTab, setActiveTab] = useState('alternatives');
  const [expanded, setExpanded] = useState({});

  const stack = useMemo(() => architecture?.tech_stack || {}, [architecture]);

  const toggleExpand = (key) => setExpanded(s => ({ ...s, [key]: !s[key] }));

  const altsByLayer = useMemo(() => {
    const result = {};
    const layers = [
      { key: 'frontend', label: 'Layout Layer', icon: Layout, current: stack.frontend },
      { key: 'backend', label: 'Core Engines', icon: Server, current: stack.backend },
      { key: 'database', label: 'Persistent State', icon: Database, current: stack.database },
    ];
    for (const layer of layers) {
      const currentLower = Object.keys(ALTERNATIVES[layer.key] || {}).find(
        k => layer.current?.toLowerCase().includes(k.toLowerCase())
      );
      result[layer.key] = {
        ...layer,
        alternatives: currentLower ? ALTERNATIVES[layer.key][currentLower] : [],
        current: layer.current,
      };
    }
    return result;
  }, [stack]);

  const tabs = [
    { id: 'alternatives', label: 'Alternatives', icon: Code },
    { id: 'security', label: 'Security Hardening', icon: Shield },
    { id: 'performance', label: 'Performance Tips', icon: Zap },
  ];

  const parseTechString = (str = '') => {
    if (!str) return { chips: [], note: '' };
    const parenMatch = str.match(/^([^(]+)(?:\(([^)]+)\))?/);
    const mainPart = parenMatch ? parenMatch[1] : str;
    const note = parenMatch && parenMatch[2] ? parenMatch[2] : '';
    const chips = mainPart.split(/\s*\+\s*|\s*,\s*/).map(s => s.trim()).filter(Boolean);
    return { chips, note };
  };

  return (
    <div className="card-premium overflow-hidden fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-cyan-700 p-4 sm:p-6 text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white border border-white/20 flex-shrink-0">
            <Lightbulb size={20} />
          </div>
          <div>
            <h2 className="text-base sm:text-xl font-bold tracking-tight">Strategic Tech Recommendations</h2>
            <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">Architecture alternatives, security hardening & speed optimization</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-200 bg-surface-50/80 p-1.5 gap-1.5 overflow-x-auto scrollbar-hide touch-pan-x">
        {tabs.map(t => {
          const TabIcon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 min-w-[110px] flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 active:scale-95 ${
                isActive
                  ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200/60'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              <TabIcon size={14} className={isActive ? 'text-emerald-600' : 'text-gray-400'} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-4 sm:p-6">
        {/* Alternatives tab */}
        {activeTab === 'alternatives' && (
          <div className="space-y-3 sm:space-y-4">
            {Object.entries(altsByLayer).map(([key, layer]) => {
              const LayerIcon = layer.icon;
              const isExpanded = expanded[key];
              const parsed = parseTechString(layer.current);

              return (
                <div key={key} className="border border-surface-200 rounded-2xl overflow-hidden bg-white shadow-xs transition-all hover:border-emerald-300">
                  <button
                    onClick={() => toggleExpand(key)}
                    className={`w-full flex items-start sm:items-center justify-between p-3.5 sm:p-4 text-left transition-all ${
                      isExpanded ? 'bg-emerald-50/40 border-b border-surface-200' : 'hover:bg-surface-50/50'
                    }`}
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1 pr-2">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200/60 flex-shrink-0 mt-0.5 sm:mt-0">
                        <LayerIcon size={16} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{layer.label}</span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {parsed.chips.map((chip, i) => (
                            <span key={i} className="px-2 py-0.5 rounded-md text-xs font-semibold bg-surface-100 text-gray-800 border border-surface-200">
                              {chip}
                            </span>
                          ))}
                        </div>
                        {parsed.note && (
                          <p className="text-[11px] text-gray-500 mt-1 leading-snug">{parsed.note}</p>
                        )}
                      </div>
                    </div>
                    <div className={`w-7 h-7 rounded-lg border border-surface-200 flex items-center justify-center text-gray-400 transition-transform flex-shrink-0 ${
                      isExpanded ? 'rotate-180 bg-white text-emerald-600 border-emerald-300' : ''
                    }`}>
                      <ChevronDown size={14} />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-3.5 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 bg-surface-50/30">
                      {layer.alternatives.length === 0 ? (
                        <div className="col-span-full py-6 text-center bg-white rounded-xl border border-dashed border-surface-200">
                          <p className="text-xs text-gray-400 font-medium">Selected configuration is already industry standard.</p>
                        </div>
                      ) : layer.alternatives.map((alt) => (
                        <div key={alt.name} className="flex flex-col justify-between p-3.5 sm:p-4 rounded-xl border border-surface-200 bg-white hover:border-emerald-300 hover:shadow-xs transition-all">
                          <div>
                            <p className="text-sm font-bold text-gray-900 mb-2">{alt.name}</p>
                            <div className="space-y-2">
                              <div className="space-y-1">
                                <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider flex items-center gap-1">
                                  <CheckCircle size={10} /> Advantages
                                </p>
                                {alt.pros.map(p => <p key={p} className="text-xs text-gray-600 pl-3 leading-snug">• {p}</p>)}
                              </div>
                              <div className="space-y-1 pt-1">
                                <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wider flex items-center gap-1">
                                  <AlertTriangle size={10} /> Trade-offs
                                </p>
                                {alt.cons.map(c => <p key={c} className="text-xs text-gray-600 pl-3 leading-snug">• {c}</p>)}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 pt-3 mt-3 border-t border-surface-100">
                            <div className="space-y-0.5">
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Performance</p>
                              <BarMeter value={alt.perf} color="brand" />
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Security</p>
                              <BarMeter value={alt.security} color="emerald" />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Security tab */}
        {activeTab === 'security' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* eslint-disable-next-line no-unused-vars */}
            {SECURITY_TIPS.map(({ icon: SecurityIcon, level, label, tip }, idx) => (
              <div
                key={label}
                className={`flex flex-col gap-4 p-6 rounded-[2rem] border transition-all duration-300 animate-fade-in scale-in ${
                  level === 'critical' ? 'bg-rose-50 border-rose-100' :
                  level === 'high' ? 'bg-amber-50 border-amber-100' :
                  'bg-brand-50 border-brand-100'
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-center justify-between">
                   <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border shadow-sm ${
                      level === 'critical' ? 'bg-white text-rose-500 border-rose-200' :
                      level === 'high' ? 'bg-white text-amber-500 border-amber-200' :
                      'bg-white text-brand-500 border-brand-200'
                   }`}>
                      <SecurityIcon size={20} />
                   </div>
                   <span className={`text-[10px] px-3 py-1 rounded-full font-black uppercase tracking-[0.2em] border ${
                      level === 'critical' ? 'bg-rose-200/50 text-rose-700 border-rose-300/50' :
                      level === 'high' ? 'bg-amber-200/50 text-amber-700 border-amber-300/50' :
                      'bg-brand-200/50 text-brand-700 border-brand-300/50'
                   }`}>{level} Priority</span>
                </div>
                <div>
                   <p className="font-bold text-base text-gray-900 mb-2">{label}</p>
                   <p className="text-xs text-gray-600 font-medium leading-relaxed">{tip}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Performance tab */}
        {activeTab === 'performance' && (
          <div className="space-y-4">
             <div className="bg-brand-50/50 border border-brand-100 p-6 rounded-3xl flex items-start gap-5 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-white border border-brand-200 flex items-center justify-center text-brand-600 shadow-sm flex-shrink-0">
                   <Zap size={24} fill="currentColor" className="opacity-80" />
                </div>
                <div>
                   <h4 className="text-base font-bold text-gray-900">High Velocity Optimization</h4>
                   <p className="text-xs text-gray-600 mt-1 font-medium">Critical performance vectors sorted by system impact. Implement these to maximize throughput and minimize latency.</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PERF_TIPS.sort((a, b) => b.impact - a.impact).map(({ label, tip, impact }, idx) => (
                <div key={label} className="p-6 rounded-[2rem] border border-surface-200 bg-white hover:border-brand-300 hover:shadow-lg transition-all duration-300 group scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="flex items-center justify-between mb-4">
                     <p className="font-bold text-base text-gray-900">{label}</p>
                     <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1.5">Impact: {impact}/10</span>
                        <div className="w-24">
                           <BarMeter value={impact} color="emerald" />
                        </div>
                     </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium group-hover:text-gray-700 transition-colors">{tip}</p>
                </div>
              ))}
             </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TechRecommendations;
