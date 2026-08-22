import { useState } from 'react';
import { Cloud, DollarSign, TrendingUp, ChevronDown, ChevronUp, Clock, Users, Receipt, Sparkles, TrendingDown } from 'lucide-react';

const PROVIDERS = {
  aws: {
    name: 'Amazon Web Services',
    shortName: 'AWS',
    color: 'slate',
    logo: '☁️',
    multiplier: 1.0,
    services: { compute: 'EC2 / ECS', database: 'RDS Postgres', storage: 'S3', cdn: 'CloudFront', auth: 'Cognito' },
  },
  azure: {
    name: 'Microsoft Azure',
    shortName: 'Azure',
    color: 'blue',
    logo: '🔷',
    multiplier: 0.95,
    services: { compute: 'App Service', database: 'Azure SQL', storage: 'Blob Storage', cdn: 'Azure CDN', auth: 'Azure AD' },
  },
  gcp: {
    name: 'Google Cloud Platform',
    shortName: 'GCP',
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
  slate:   { 
    bg: 'bg-slate-50', 
    border: 'border-slate-200', 
    text: 'text-slate-700', 
    badge: 'bg-slate-100 text-slate-700',
    cardBg: 'bg-gradient-to-br from-slate-50 to-slate-100/50',
    selectedBg: 'bg-slate-50',
    icon: 'text-slate-600'
  },
  blue:    { 
    bg: 'bg-blue-50', 
    border: 'border-blue-200', 
    text: 'text-blue-700', 
    badge: 'bg-blue-100 text-blue-700',
    cardBg: 'bg-gradient-to-br from-blue-50 to-blue-100/50',
    selectedBg: 'bg-blue-50',
    icon: 'text-blue-600'
  },
  emerald: { 
    bg: 'bg-emerald-50', 
    border: 'border-emerald-200', 
    text: 'text-emerald-700', 
    badge: 'bg-emerald-100 text-emerald-700',
    cardBg: 'bg-gradient-to-br from-emerald-50 to-emerald-100/50',
    selectedBg: 'bg-emerald-50',
    icon: 'text-emerald-600'
  },
};

function parseSquad(teamStr = '') {
  if (!teamStr) return { count: 'Engineering Team', breakdown: [] };
  // Check if has parenthesis breakdown e.g. "6 Software Engineers (1 Architect, 2 Backend...)"
  const match = teamStr.match(/^([^(]+)(?:\(([^)]+)\))?/);
  if (match) {
    const count = match[1].replace(/Units$/i, '').trim();
    const breakdown = match[2]
      ? match[2].split(',').map(s => s.trim()).filter(Boolean)
      : [];
    return { count, breakdown };
  }
  return { count: teamStr, breakdown: [] };
}

function parseBudget(budgetStr = '') {
  if (!budgetStr) return { headline: '$20,000 - $40,000', notes: '' };
  const match = budgetStr.match(/^([^(]+)(?:\(([^)]+)\))?/);
  if (match) {
    return {
      headline: match[1].trim(),
      notes: match[2] ? match[2].trim() : '',
    };
  }
  return { headline: budgetStr, notes: '' };
}

function CostEnhancement({ estimation }) {
  const [activeProvider, setActiveProvider] = useState('gcp');
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

  const squad = parseSquad(estimation.team_size);
  const budget = parseBudget(estimation.cost);

  const infraBreakdown = [
    { label: provider.services.compute, pct: 35 },
    { label: provider.services.database, pct: 25 },
    { label: provider.services.storage, pct: 15 },
    { label: provider.services.cdn, pct: 10 },
    { label: provider.services.auth, pct: 8 },
    { label: 'Monitoring & Logging', pct: 7 },
  ];

  const c = colorMap[provider.color];
  const profitDelta = Math.round((1 - provider.multiplier) * 100);

  return (
    <div className="card-premium overflow-hidden fade-in">
      {/* Header - Minimal & Clean */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 px-4 py-3 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20">
              <Receipt size={16} />
            </div>
            <div>
              <h2 className="text-sm font-bold">Budgetary Analysis</h2>
              <p className="text-blue-100 text-[10px]">Global infrastructure & development cost forecasts</p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[10px] font-medium backdrop-blur-sm transition-all border border-white/20"
          >
            <span>View Full Matrix</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      <div className="p-4 space-y-4 bg-gradient-to-b from-surface-50 to-white">
        {/* Top 3 Key Metrics - Horizontal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Development Time */}
          <div className="bg-white border border-surface-200 rounded-xl p-4 hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
                <Clock size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Development Time</p>
                <p className="text-base font-bold text-gray-900">{estimation.hours}</p>
              </div>
            </div>
          </div>

          {/* Project Squad */}
          <div className="bg-white border border-surface-200 rounded-xl p-4 hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Users size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-1">Project Squad</p>
                <p className="text-sm font-bold text-gray-900 leading-tight mb-1.5">{squad.count}</p>
                {squad.breakdown.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {squad.breakdown.slice(0, 2).map((role, i) => (
                      <span key={i} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {role}
                      </span>
                    ))}
                    {squad.breakdown.length > 2 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-gray-50 text-gray-600 border border-gray-100">
                        +{squad.breakdown.length - 2} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Project Budget */}
          <div className="bg-gradient-to-br from-brand-50 to-brand-100/30 border border-brand-200 rounded-xl p-4 hover:shadow-md transition-all">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/80 text-brand-600 flex items-center justify-center flex-shrink-0 shadow-sm">
                <DollarSign size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-semibold text-brand-700 uppercase tracking-wide mb-1">Project Budget</p>
                <p className="text-base font-bold text-brand-900 leading-tight">{budget.headline}</p>
                {budget.notes && (
                  <p className="text-[9px] text-brand-600/80 mt-0.5">{budget.notes}</p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Cloud Platform Selector - Clean Design */}
        <div className="bg-white rounded-xl border border-surface-200 p-4">
          <div className="space-y-4">
            {/* Platform Pills */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Cloud size={14} className="text-gray-400" />
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Cloud Platform</p>
              </div>
              <div className="space-y-2">
                {Object.entries(PROVIDERS).map(([key, p]) => {
                  const isSelected = activeProvider === key;
                  const c = colorMap[p.color];
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveProvider(key)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 border-2 ${
                        isSelected
                          ? `${c.selectedBg} ${c.border} shadow-sm`
                          : 'bg-white border-surface-100 hover:border-surface-200 hover:bg-surface-50'
                      }`}
                    >
                      <span className="text-xl">{p.logo}</span>
                      <span className={`text-sm font-semibold flex-1 text-left ${isSelected ? c.text : 'text-gray-600'}`}>
                        {p.name}
                      </span>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center flex-shrink-0">
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Billing Cycle Toggle */}
            <div className="pt-3 border-t border-surface-100">
              <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-2.5">Billing Cycle</p>
              <div className="flex bg-surface-50 p-1 rounded-lg border border-surface-200">
                <button
                  onClick={() => setPeriod('monthly')}
                  className={`flex-1 px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                    period === 'monthly' 
                      ? 'bg-white text-brand-700 shadow-sm border border-brand-200' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Monthly
                </button>
                <button
                  onClick={() => setPeriod('annual')}
                  className={`flex-1 px-4 py-2 rounded-md text-xs font-semibold transition-all ${
                    period === 'annual' 
                      ? 'bg-white text-brand-700 shadow-sm border border-brand-200' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Annual
                </button>
              </div>
            </div>

            {/* Team Scale Slider */}
            <div className="pt-3 border-t border-surface-100">
              <div className="flex items-center justify-between mb-2.5">
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Team Scale: {teamSize} Experts</p>
                <span className="text-xs font-bold text-brand-600">Intensity: {Math.round((teamSize / 10) * 100)}%</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={teamSize}
                onChange={e => setTeamSize(Number(e.target.value))}
                className="w-full h-2 bg-gradient-to-r from-brand-100 to-brand-200 rounded-full appearance-none cursor-pointer accent-brand-600"
                style={{
                  background: `linear-gradient(to right, #2563eb 0%, #2563eb ${(teamSize / 10) * 100}%, #e0e7ff ${(teamSize / 10) * 100}%, #e0e7ff 100%)`
                }}
              />
            </div>
          </div>
        </div>

        {/* Cost Forecast Card - Large & Prominent */}
        <div className={`${c.cardBg} border-2 ${c.border} rounded-2xl p-6 shadow-lg`}>
          <div className="text-center space-y-3">
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">{provider.logo}</span>
              <p className={`text-xs font-semibold ${c.text} uppercase tracking-wider`}>
                {provider.name} • {period} Forecast
              </p>
            </div>
            
            <div className="space-y-1">
              <div className={`text-5xl font-black ${c.text} font-display tracking-tight`}>
                ${scaledCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
              </div>
              <p className="text-sm font-medium text-gray-500">per {period === 'monthly' ? 'month' : 'year'}</p>
            </div>

            {/* Metrics Row */}
            <div className="flex items-center justify-center gap-4 pt-2">
              {profitDelta > 0 && (
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${c.badge}`}>
                  <TrendingDown size={14} />
                  <span className="text-xs font-bold">Profit Delta: -{profitDelta}%</span>
                </div>
              )}
              {profitDelta === 0 && (
                <div className="px-3 py-1.5 rounded-full bg-gray-100 text-gray-700">
                  <span className="text-xs font-bold">Baseline</span>
                </div>
              )}
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-surface-200">
                <TrendingUp size={14} className="text-brand-600" />
                <span className="text-xs font-bold text-gray-700">Load Factor</span>
              </div>
            </div>

            <div className="text-center pt-2">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-surface-200">
                <span className={`text-3xl font-black ${c.text}`}>{teamSize}x</span>
              </div>
            </div>
          </div>
        </div>

        {/* Service Breakdown - Expandable */}
        {expanded && (
          <div className="bg-white rounded-xl border border-surface-200 p-4 animate-fade-in">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">Service Cost Distribution</h3>
            <div className="space-y-3">
              {infraBreakdown.map((item) => {
                const itemCost = (scaledCost * item.pct) / 100;
                return (
                  <div key={item.label} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-gray-800">{item.label}</p>
                        <p className="text-[10px] text-gray-500">{item.pct}% of total infrastructure</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">
                        ${itemCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </p>
                    </div>
                    <div className="w-full bg-surface-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${c.icon === 'text-slate-600' ? 'from-slate-400 to-slate-500' : c.icon === 'text-blue-600' ? 'from-blue-400 to-blue-500' : 'from-emerald-400 to-emerald-500'}`}
                        style={{ width: `${item.pct}%` }}
                      />
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
