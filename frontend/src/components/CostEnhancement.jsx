import { useState } from 'react';
import { Cloud, DollarSign, TrendingUp, ChevronDown, ChevronUp, Clock, Users, Receipt } from 'lucide-react';

const PROVIDERS = {
  aws: {
    name: 'Amazon Web Services',
    color: 'orange',
    logo: '☁️',
    multiplier: 1.0,
    services: { compute: 'EC2', database: 'RDS', storage: 'S3', cdn: 'CloudFront', auth: 'Cognito' },
  },
  azure: {
    name: 'Microsoft Azure',
    color: 'blue',
    logo: '🔷',
    multiplier: 0.95,
    services: { compute: 'App Service', database: 'Azure SQL', storage: 'Blob Storage', cdn: 'Azure CDN', auth: 'Azure AD B2C' },
  },
  gcp: {
    name: 'Google Cloud Platform',
    color: 'emerald',
    logo: '🟢',
    multiplier: 0.9,
    services: { compute: 'Cloud Run', database: 'Cloud SQL', storage: 'Cloud Storage', cdn: 'Cloud CDN', auth: 'Firebase Auth' },
  },
};

function parseCost(costStr) {
  const matches = costStr.match(/[\d,]+/g);
  if (!matches) return 20000;
  const nums = matches.map(n => parseInt(n.replace(/,/g, ''), 10));
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

const colorMap = {
  orange:  { bg: 'bg-orange-50',  border: 'border-orange-200',  text: 'text-orange-800', badge: 'bg-orange-100 text-orange-700',   btn: 'bg-orange-500 hover:bg-orange-600' },
  blue:    { bg: 'bg-blue-50',    border: 'border-blue-200',    text: 'text-blue-800',   badge: 'bg-blue-100 text-blue-700',     btn: 'bg-blue-500 hover:bg-blue-600' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-800', badge: 'bg-emerald-100 text-emerald-700', btn: 'bg-emerald-500 hover:bg-emerald-600' },
};

function CostEnhancement({ estimation }) {
  const [activeProvider, setActiveProvider] = useState('aws');
  const [period, setPeriod] = useState('monthly');
  const [teamSize, setTeamSize] = useState(3);
  const [expanded, setExpanded] = useState(false);

  const baseCost = parseCost(estimation.cost || '20000');
  const provider = PROVIDERS[activeProvider];
  const adjusted = baseCost * provider.multiplier;
  const monthly = adjusted / 12;
  const annual = adjusted;
  const displayCost = period === 'monthly' ? monthly : annual;
  const scaledCost = displayCost * (teamSize / 3);

  const infraBreakdown = [
    { label: provider.services.compute, pct: 35 },
    { label: provider.services.database, pct: 25 },
    { label: provider.services.storage, pct: 15 },
    { label: provider.services.cdn, pct: 10 },
    { label: provider.services.auth, pct: 8 },
    { label: 'Monitoring & Logging', pct: 7 },
  ];

  const c = colorMap[provider.color];

  return (
    <div className="card-premium overflow-hidden stagger">
      <div className="bg-gradient-to-r from-blue-700 to-cyan-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-display font-bold text-white flex items-center gap-3">
              <Receipt size={22} className="text-white/80" /> Budgetary Analysis
            </h2>
            <p className="text-blue-100 text-sm mt-1.5 font-medium">Global infrastructure & development cost forecasts</p>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-xl text-xs font-bold hover:bg-white/30 transition-all active:scale-95 border border-white/20"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {expanded ? 'Fewer Details' : 'View Full Matrix'}
          </button>
        </div>
      </div>

      <div className="p-7 space-y-8">
        {/* Core Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="bg-surface-50 border border-surface-200 p-5 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-white hover:border-brand-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
               <Clock size={20} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Development Time</p>
            <p className="text-2xl font-display font-bold text-gray-900">{estimation.hours}</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 p-5 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-white hover:border-emerald-200 transition-all">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
               <Users size={20} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Project Squad</p>
            <p className="text-2xl font-display font-bold text-gray-900">{estimation.team_size} Units</p>
          </div>
          <div className="bg-surface-50 border border-surface-200 p-5 rounded-2xl flex flex-col items-center justify-center text-center group hover:bg-white hover:border-brand-200 transition-all ring-2 ring-brand-500 ring-offset-4 ring-offset-white">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
               <DollarSign size={20} />
            </div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Project Budget</p>
            <p className="text-2xl font-display font-bold text-brand-700">{estimation.cost}</p>
          </div>
        </div>

        {/* Cloud selection */}
        <div>
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Select Infrastructure Platform</h3>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(PROVIDERS).map(([key, p]) => (
              <button
                key={key}
                onClick={() => setActiveProvider(key)}
                className={`flex items-center gap-3 px-5 py-2.5 rounded-2xl text-xs font-bold border-2 transition-all duration-300 ${
                  activeProvider === key
                    ? `${colorMap[p.color].bg} ${colorMap[p.color].border} ${colorMap[p.color].text} shadow-lg shadow-surface-200 scale-105`
                    : 'border-surface-100 bg-white text-gray-400 hover:border-surface-300 hover:text-gray-600'
                }`}
              >
                <span className="text-lg">{p.logo}</span>
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-8 items-center bg-surface-50/50 p-6 rounded-3xl border border-surface-100">
          <div className="space-y-3">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Billing Cycle</label>
             <div className="flex items-center gap-1 bg-white border border-surface-200 rounded-xl p-1 shadow-sm">
                <button
                  onClick={() => setPeriod('monthly')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${period === 'monthly' ? 'bg-brand-600 text-white shadow-brand-500/20 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setPeriod('annual')}
                  className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${period === 'annual' ? 'bg-brand-600 text-white shadow-brand-500/20 shadow-md' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  Annual
                </button>
             </div>
          </div>
          
          <div className="flex-1 space-y-3">
             <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Team Scale: {teamSize} Experts</label>
                <span className="text-[10px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">Intensity: {Math.round((teamSize/20)*100)}%</span>
             </div>
             <input
               type="range" min={1} max={20} value={teamSize}
               onChange={e => setTeamSize(Number(e.target.value))}
               className="w-full h-1.5 bg-brand-100 rounded-full appearance-none cursor-pointer accent-brand-600"
             />
          </div>
        </div>

        {/* Dynamic Cost Board */}
        <div className={`relative overflow-hidden group p-8 rounded-[2rem] border-2 transition-all duration-500 ${c.bg} ${c.border} shadow-xl hover:shadow-2xl`}>
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-white/30 transition-all" />
          
          <div className="relative flex items-center justify-between flex-wrap gap-6 text-center md:text-left">
            <div>
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${c.text} opacity-60 mb-2`}>
                {provider.name} • {period} Forecast
              </p>
              <p className={`text-5xl font-display font-bold ${c.text} tracking-tight`}>
                <span className="text-2xl align-top mr-1 opacity-70 cursor-default">$</span>
                {scaledCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </p>
              <div className="flex items-center gap-2 mt-4">
                 <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${c.badge} border border-current/10`}>
                   {provider.multiplier < 1 ? `Profit Delta: -${Math.round((1 - provider.multiplier) * 100)}%` : 'Baseline Ratio'}
                 </div>
              </div>
            </div>
            
            <div className="flex flex-col items-center bg-white/40 p-5 rounded-2xl border border-white/50 backdrop-blur-sm">
              <TrendingUp size={24} className={`${c.text} mb-2`} />
              <p className={`text-[10px] font-bold uppercase tracking-widest ${c.text} opacity-60`}>Load Factor</p>
              <p className={`text-2xl font-black ${c.text}`}>{teamSize}x</p>
            </div>
          </div>
        </div>

        {/* Breakdown Matrix */}
        {expanded && (
          <div className="animate-fade-in px-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Service Deployment Matrix</h3>
            <div className="space-y-5">
              {infraBreakdown.map((item, idx) => {
                const itemCost = (scaledCost * item.pct) / 100;
                return (
                  <div key={item.label} className="flex items-center gap-6 group">
                    <div className="w-40 flex-shrink-0">
                       <p className="text-xs font-bold text-gray-700">{item.label}</p>
                       <p className="text-[10px] font-medium text-gray-400">Allocated: {item.pct}%</p>
                    </div>
                    <div className="flex-1 bg-surface-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-600 to-cyan-500 group-hover:scale-x-105 origin-left transition-transform duration-700"
                        style={{ width: `${item.pct}%`, transitionDelay: `${idx * 100}ms` }}
                      />
                    </div>
                    <div className="w-32 text-right">
                       <p className="text-xs font-bold text-gray-900">${itemCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                       <p className="text-[10px] font-bold text-gray-400 uppercase">{period === 'monthly' ? 'mo' : 'yr'}</p>
                    </div>
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

export default CostEnhancement;
