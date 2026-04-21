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
    { id: 'alternatives', label: 'Architecture Substitutes', icon: Code },
    { id: 'security', label: 'Defensive Strategy', icon: Shield },
    { id: 'performance', label: 'Optimization Vector', icon: Zap },
  ];

  return (
    <div className="card-premium overflow-hidden transition-all duration-300 stagger">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6">
        <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
          <Lightbulb size={22} className="text-white/80" /> Strategic Intelligence
        </h2>
        <p className="text-emerald-50 text-sm mt-1.5 font-medium">Platform-Specific Guidance • Alternatives • Hardening Tips</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-100 bg-surface-50/30">
        {tabs.map(t => {
          const TabIcon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all duration-300 border-b-2 ${
                isActive
                  ? 'border-brand-500 text-brand-600 bg-white shadow-inner-sm'
                  : 'border-transparent text-gray-400 hover:text-gray-600 hover:bg-surface-50'
              }`}
            >
              <TabIcon size={14} className={isActive ? 'text-brand-500' : 'text-gray-300'} /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="p-7">
        {/* Alternatives tab */}
        {activeTab === 'alternatives' && (
          <div className="space-y-5">
            {Object.entries(altsByLayer).map(([key, layer], idx) => {
              const LayerIcon = layer.icon;
              const isExpanded = expanded[key];
              return (
                <div key={key} className={`border border-surface-200 rounded-3xl overflow-hidden transition-all duration-300 shadow-sm hover:shadow-md hover:border-brand-200 animate-fade-in`} style={{ animationDelay: `${idx * 150}ms` }}>
                  <button
                    onClick={() => toggleExpand(key)}
                    className={`w-full flex items-center justify-between p-5 transition-all duration-300 ${isExpanded ? 'bg-brand-50/30' : 'bg-white hover:bg-surface-50'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-2xl bg-white flex items-center justify-center text-brand-600 shadow-sm border border-brand-100">
                        <LayerIcon size={20} />
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{layer.label}</p>
                        <p className="text-base font-bold text-gray-900 mt-0.5">{layer.current}</p>
                      </div>
                    </div>
                    <div className={`w-8 h-8 rounded-full border border-surface-200 flex items-center justify-center text-gray-400 transition-transform ${isExpanded ? 'rotate-180 bg-white text-brand-600 border-brand-200' : ''}`}>
                       <ChevronDown size={14} />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 border-t border-surface-100 bg-white">
                      {layer.alternatives.length === 0 ? (
                        <div className="col-span-full py-8 text-center bg-surface-50/50 rounded-2xl border border-dashed border-surface-200">
                           <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Default Configuration Optimal</p>
                        </div>
                      ) : layer.alternatives.map((alt) => (
                        <div key={alt.name} className="flex flex-col gap-4 p-5 rounded-2xl border border-surface-100 hover:border-brand-200 hover:bg-brand-50/10 transition-all group scale-in">
                          <p className="text-base font-bold text-gray-900 group-hover:text-brand-600 transition-colors">{alt.name}</p>
                          <div className="space-y-3">
                            <div className="space-y-1.5">
                              <p className="text-[10px] text-emerald-600 font-black uppercase tracking-wider flex items-center gap-1.5">
                                <CheckCircle size={10} /> Pro Factors
                              </p>
                              {alt.pros.map(p => <p key={p} className="text-[11px] text-gray-500 leading-relaxed font-medium">• {p}</p>)}
                            </div>
                            <div className="space-y-1.5 pt-1">
                              <p className="text-[10px] text-rose-500 font-black uppercase tracking-wider flex items-center gap-1.5">
                                <AlertTriangle size={10} /> Constraints
                              </p>
                              {alt.cons.map(c => <p key={c} className="text-[11px] text-gray-500 leading-relaxed font-medium">• {c}</p>)}
                            </div>
                          </div>
                          <div className="space-y-3 pt-3 mt-auto border-t border-surface-100">
                             <div className="space-y-1">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Efficiency Vector</p>
                                <BarMeter value={alt.perf} color="brand" />
                             </div>
                             <div className="space-y-1">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Security Score</p>
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
