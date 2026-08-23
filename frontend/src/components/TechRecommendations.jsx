import { useState, useMemo } from 'react';
import { Lightbulb, Shield, Zap, Code, Database, Layout, Server, ChevronDown, CheckCircle, AlertTriangle } from 'lucide-react';

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
  { icon: Shield, level: 'medium', label: 'Secrets Management', tip: 'Store secrets in environment variables or vault services (AWS Secrets Manager, HashiCorp Vault).' },
  { icon: Shield, level: 'medium', label: 'Dependency Scanning', tip: 'Run npm audit / pip check in CI/CD. Use Snyk or Dependabot for automated vulnerability monitoring.' },
];

const PERF_TIPS = [
  { label: 'Database Indexing', tip: 'Add indexes on frequently queried columns. Use EXPLAIN ANALYZE to identify slow queries.', impact: 9 },
  { label: 'API Response Caching', tip: 'Cache GET responses with Redis. Implement ETags for conditional requests.', impact: 8 },
  { label: 'Lazy Loading', tip: 'Implement code splitting and lazy loading for frontend bundles. Use React.lazy().', impact: 7 },
  { label: 'CDN for Static Assets', tip: 'Serve images, CSS, and JS through a CDN (CloudFront/Cloudflare) to reduce server load.', impact: 8 },
  { label: 'Connection Pooling', tip: 'Use PgBouncer or built-in pool for database connections to avoid overhead.', impact: 9 },
  { label: 'Horizontal Scaling', tip: 'Design stateless APIs to allow horizontal scaling behind a load balancer.', impact: 10 },
];

function BarMeter({ value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 bg-[#FDF6E3] border border-black h-2 overflow-hidden">
        <div
          className="h-full bg-[#00FF00] border-r border-black"
          style={{ width: `${value * 10}%` }}
        />
      </div>
      <span className="font-mono text-[10px] font-black text-black w-8">{value}/10</span>
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
    <div className="card-premium overflow-hidden">
      {/* Header */}
      <div className="bg-[#FFE600] border-b-3 border-black p-4 sm:p-5 text-black">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex-shrink-0">
            <Lightbulb size={18} className="stroke-[2.5]" />
          </div>
          <div>
            <h2 className="font-display font-black text-base sm:text-lg uppercase">
              STRATEGIC TECH RECOMMENDATIONS
            </h2>
            <p className="font-mono text-xs font-bold text-gray-800">
              STACK ALTERNATIVES, SECURITY HARDENING & HIGH-THROUGHPUT TUNING
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b-2 border-black bg-[#F4ECC8] p-2 gap-2 overflow-x-auto scrollbar-hide">
        {tabs.map(t => {
          const TabIcon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`flex-1 min-w-[120px] flex items-center justify-center gap-1.5 px-3 py-2 font-mono text-xs font-bold uppercase border-2 border-black transition-all ${
                isActive
                  ? 'bg-[#FF00FF] text-white shadow-[2px_2px_0px_0px_#000000] transform -translate-y-0.5'
                  : 'bg-white text-black hover:bg-[#00FF00]'
              }`}
            >
              <TabIcon size={14} className="stroke-[2.5]" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      <div className="p-5 sm:p-6 bg-[#FDF6E3]">
        {/* Alternatives tab */}
        {activeTab === 'alternatives' && (
          <div className="space-y-4">
            {Object.entries(altsByLayer).map(([key, layer]) => {
              const LayerIcon = layer.icon;
              const isExpanded = expanded[key];
              const parsed = parseTechString(layer.current);

              return (
                <div key={key} className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] overflow-hidden">
                  <button
                    onClick={() => toggleExpand(key)}
                    className="w-full flex items-start sm:items-center justify-between p-4 text-left transition-all hover:bg-[#FDF6E3]"
                  >
                    <div className="flex items-start gap-3 min-w-0 flex-1 pr-2">
                      <div className="w-8 h-8 bg-[#00FF00] text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center flex-shrink-0">
                        <LayerIcon size={16} className="stroke-[2.5]" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-[10px] font-black text-gray-700 uppercase tracking-wider block">
                          [ {layer.label} ]
                        </span>
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {parsed.chips.map((chip, i) => (
                            <span key={i} className="px-2 py-0.5 font-mono text-xs font-bold bg-white text-black border border-black shadow-[1px_1px_0px_0px_#000000]">
                              {chip}
                            </span>
                          ))}
                        </div>
                        {parsed.note && (
                          <p className="font-mono text-xs text-gray-700 mt-1">{parsed.note}</p>
                        )}
                      </div>
                    </div>
                    <div className={`w-7 h-7 bg-white border-2 border-black flex items-center justify-center text-black transition-transform flex-shrink-0 ${
                      isExpanded ? 'rotate-180 bg-[#FFE600]' : ''
                    }`}>
                      <ChevronDown size={14} className="stroke-[3]" />
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 border-t-2 border-black bg-[#FDF6E3]">
                      {layer.alternatives.length === 0 ? (
                        <div className="col-span-full py-4 text-center bg-white border-2 border-dashed border-black">
                          <p className="font-mono text-xs font-bold text-gray-600 uppercase">Selected configuration is already industry standard.</p>
                        </div>
                      ) : layer.alternatives.map((alt) => (
                        <div key={alt.name} className="flex flex-col justify-between p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000000]">
                          <div>
                            <p className="font-mono font-black text-sm text-black mb-2 uppercase">{alt.name}</p>
                            <div className="space-y-2">
                              <div>
                                <p className="font-mono text-[10px] text-black font-black uppercase flex items-center gap-1">
                                  <CheckCircle size={10} className="stroke-[3] text-black" /> [ PROS ]
                                </p>
                                {alt.pros.map(p => <p key={p} className="font-mono text-xs text-gray-800 pl-3 leading-snug font-medium">• {p}</p>)}
                              </div>
                              <div>
                                <p className="font-mono text-[10px] text-black font-black uppercase flex items-center gap-1">
                                  <AlertTriangle size={10} className="stroke-[3] text-black" /> [ CONS ]
                                </p>
                                {alt.cons.map(c => <p key={c} className="font-mono text-xs text-gray-800 pl-3 leading-snug font-medium">• {c}</p>)}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-1.5 pt-3 mt-3 border-t border-black">
                            <p className="font-mono text-[9px] font-black text-gray-700 uppercase">Performance</p>
                            <BarMeter value={alt.perf} />
                            <p className="font-mono text-[9px] font-black text-gray-700 uppercase">Security</p>
                            <BarMeter value={alt.security} />
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
            {SECURITY_TIPS.map((tipItem) => {
              const SecurityIcon = tipItem.icon;
              return (
                <div
                  key={tipItem.label}
                  className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] p-5 space-y-3"
                >
                  <div className="flex items-center justify-between pb-2 border-b-2 border-black">
                    <div className="w-9 h-9 bg-[#00FFFF] text-black border-2 border-black flex items-center justify-center">
                      <SecurityIcon size={18} className="stroke-[2.5]" />
                    </div>
                    <span className={`font-mono text-[10px] font-black px-2.5 py-0.5 border border-black uppercase ${
                      tipItem.level === 'critical' ? 'bg-[#FF5500] text-white' :
                      tipItem.level === 'high' ? 'bg-[#FFE600] text-black' :
                      'bg-[#00FF00] text-black'
                    }`}>
                      {tipItem.level} PRIORITY
                    </span>
                  </div>
                  <div>
                    <p className="font-mono font-black text-sm text-black mb-1 uppercase">{tipItem.label}</p>
                    <p className="font-mono text-xs text-gray-800 font-medium leading-relaxed">{tipItem.tip}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Performance tab */}
        {activeTab === 'performance' && (
          <div className="space-y-4">
            <div className="bg-[#FFE600] border-3 border-black shadow-[4px_4px_0px_0px_#000000] p-4 flex items-start gap-3">
              <div className="w-10 h-10 bg-black text-[#00FF00] flex items-center justify-center border-2 border-black flex-shrink-0">
                <Zap size={20} className="stroke-[3]" />
              </div>
              <div>
                <h4 className="font-mono font-black text-sm text-black uppercase">HIGH VELOCITY OPTIMIZATION</h4>
                <p className="font-mono text-xs text-gray-800 font-medium mt-0.5">
                  Critical performance vectors sorted by system impact. Implement these to maximize throughput and minimize latency.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PERF_TIPS.sort((a, b) => b.impact - a.impact).map(({ label, tip, impact }) => (
                <div key={label} className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] p-5">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-black">
                    <p className="font-mono font-black text-sm text-black uppercase">{label}</p>
                    <span className="font-mono text-xs font-black bg-[#00FF00] text-black px-2 py-0.5 border border-black">
                      IMPACT: {impact}/10
                    </span>
                  </div>
                  <p className="font-mono text-xs text-gray-800 leading-relaxed font-medium mb-3">{tip}</p>
                  <BarMeter value={impact} />
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
