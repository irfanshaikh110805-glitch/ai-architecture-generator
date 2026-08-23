import { useState } from 'react';
import { Cloud, DollarSign, ChevronDown, ChevronUp, Clock, Users, Receipt } from 'lucide-react';

const PROVIDERS = {
  aws: {
    name: 'Amazon Web Services',
    shortName: 'AWS',
    color: 'bg-[#FFE600] text-black',
    logo: '☁️',
    multiplier: 1.0,
    services: { compute: 'EC2 / ECS', database: 'RDS Postgres', storage: 'S3', cdn: 'CloudFront', auth: 'Cognito' },
  },
  azure: {
    name: 'Microsoft Azure',
    shortName: 'Azure',
    color: 'bg-[#00FFFF] text-black',
    logo: '🔷',
    multiplier: 0.95,
    services: { compute: 'App Service', database: 'Azure SQL', storage: 'Blob Storage', cdn: 'Azure CDN', auth: 'Azure AD' },
  },
  gcp: {
    name: 'Google Cloud Platform',
    shortName: 'GCP',
    color: 'bg-[#00FF00] text-black',
    logo: '🟢',
    multiplier: 0.9,
    services: { compute: 'Cloud Run', database: 'Cloud SQL', storage: 'Cloud Storage', cdn: 'Cloud CDN', auth: 'Firebase Auth' },
  },
};

function parseCost(costInput) {
  if (typeof costInput === 'number' && !isNaN(costInput) && costInput > 0) return costInput;
  if (!costInput) return 25000;
  const str = String(costInput);
  const matches = str.match(/\d[\d,]*/g);
  if (!matches || matches.length === 0) return 25000;
  const nums = matches.map(n => parseInt(n.replace(/,/g, ''), 10)).filter(n => !isNaN(n) && n > 0);
  if (nums.length === 0) return 25000;
  const avg = nums.reduce((a, b) => a + b, 0) / nums.length;
  return (!isNaN(avg) && avg > 0) ? avg : 25000;
}

function parseSquad(teamStr = '') {
  if (!teamStr) return { count: '3-5 Developers', breakdown: ['Frontend', 'Backend', 'DevOps'] };
  const str = String(teamStr);
  const match = str.match(/^([^(]+)(?:\(([^)]+)\))?/);
  if (match) {
    const count = match[1].replace(/Units$/i, '').trim();
    const breakdown = match[2]
      ? match[2].split(',').map(s => s.trim()).filter(Boolean)
      : [];
    return { count: count || '3-5 Developers', breakdown };
  }
  return { count: str || '3-5 Developers', breakdown: [] };
}

function parseBudget(budgetStr = '') {
  if (!budgetStr) return { headline: '$25,000 - $45,000', notes: '' };
  const str = String(budgetStr);
  const match = str.match(/^([^(]+)(?:\(([^)]+)\))?/);
  if (match) {
    return {
      headline: match[1].trim() || '$25,000 - $45,000',
      notes: match[2] ? match[2].trim() : '',
    };
  }
  return { headline: str, notes: '' };
}

function CostEnhancement({ estimation = {} }) {
  const est = estimation || {};
  const [activeProvider, setActiveProvider] = useState('gcp');
  const [period, setPeriod] = useState('monthly');
  const [teamSize, setTeamSize] = useState(3);
  const [expanded, setExpanded] = useState(false);

  const baseCost = parseCost(est.cost || est.estimated_cost);
  const provider = PROVIDERS[activeProvider] || PROVIDERS.gcp;
  const multiplier = (provider && typeof provider.multiplier === 'number') ? provider.multiplier : 1.0;
  const adjusted = (baseCost || 25000) * multiplier;
  const monthly = adjusted / 12;
  const annual = adjusted;
  const displayCost = period === 'monthly' ? monthly : annual;
  const safeTeamSize = (typeof teamSize === 'number' && !isNaN(teamSize) && teamSize > 0) ? teamSize : 3;
  const rawScaled = displayCost * (safeTeamSize / 3);
  const scaledCost = (!isNaN(rawScaled) && rawScaled > 0) ? rawScaled : 2200;

  const squad = parseSquad(est.team_size || est.estimation_team_size);
  const budget = parseBudget(est.cost || est.estimated_cost);

  const infraBreakdown = [
    { label: provider.services?.compute || 'Compute & Containers', pct: 35 },
    { label: provider.services?.database || 'Managed Database', pct: 25 },
    { label: provider.services?.storage || 'Object & File Storage', pct: 15 },
    { label: provider.services?.cdn || 'Global CDN & Edge', pct: 10 },
    { label: provider.services?.auth || 'Auth & Security Tokens', pct: 8 },
    { label: 'Monitoring & Logging', pct: 7 },
  ];

  const profitDelta = Math.round((1 - multiplier) * 100);

  return (
    <div className="card-premium overflow-hidden">
      {/* Header */}
      <div className="bg-[#00FF00] border-b-3 border-black p-4 sm:p-5 text-black">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black text-white flex items-center justify-center border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
              <Receipt size={18} className="stroke-[2.5]" />
            </div>
            <div>
              <h2 className="font-display font-black text-base sm:text-lg uppercase">
                BUDGETARY & CLOUD COST ANALYSIS
              </h2>
              <p className="font-mono text-xs font-bold text-gray-800">
                INFRASTRUCTURE SIZING & RUNTIME PROJECTIONS
              </p>
            </div>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="font-mono text-xs font-bold bg-white text-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-3 py-1.5 hover:bg-[#FFE600] active:translate-x-[1px] active:translate-y-[1px] transition-all flex items-center gap-1 uppercase"
          >
            <span>{expanded ? 'LESS' : 'FULL MATRIX'}</span>
            {expanded ? <ChevronUp size={14} className="stroke-[3]" /> : <ChevronDown size={14} className="stroke-[3]" />}
          </button>
        </div>
      </div>

      <div className="p-5 sm:p-6 space-y-5 bg-[#FDF6E3]">
        {/* Top 3 Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Dev Time */}
          <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] p-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-black">
              <Clock size={16} className="text-black stroke-[2.5]" />
              <p className="font-mono text-[10px] font-black text-gray-700 uppercase">[ DEV EFFORT ]</p>
            </div>
            <p className="font-display font-black text-xl text-black uppercase">{est.hours || est.dev_hours || '140-220 HRS'}</p>
          </div>

          {/* Project Squad */}
          <div className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] p-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-black">
              <Users size={16} className="text-black stroke-[2.5]" />
              <p className="font-mono text-[10px] font-black text-gray-700 uppercase">[ PROJECT SQUAD ]</p>
            </div>
            <p className="font-mono font-black text-sm text-black uppercase mb-1">{squad.count}</p>
            {squad.breakdown.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {squad.breakdown.map((role, i) => (
                  <span key={i} className="px-1.5 py-0.5 font-mono text-[9px] font-bold bg-[#FFE600] text-black border border-black">
                    {role}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Project Budget */}
          <div className="bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_0px_#000000] p-4">
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-black">
              <DollarSign size={16} className="text-black stroke-[3]" />
              <p className="font-mono text-[10px] font-black text-black uppercase">[ TOTAL ESTIMATED BUDGET ]</p>
            </div>
            <p className="font-display font-black text-xl text-black uppercase">{budget.headline}</p>
            {budget.notes && (
              <p className="font-mono text-[10px] font-bold text-gray-800 mt-1">{budget.notes}</p>
            )}
          </div>
        </div>

        {/* Cloud Platform & Parameters Controls */}
        <div className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Provider Selector */}
            <div>
              <div className="flex items-center gap-1.5 mb-2 font-mono text-xs font-black uppercase text-black">
                <Cloud size={14} className="stroke-[2.5]" />
                SELECT CLOUD PLATFORM
              </div>
              <div className="grid grid-cols-3 gap-2">
                {Object.entries(PROVIDERS).map(([key, p]) => {
                  const isSelected = activeProvider === key;
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveProvider(key)}
                      className={`p-2.5 font-mono text-xs font-bold uppercase border-2 border-black transition-all flex flex-col items-center gap-1 ${
                        isSelected
                          ? `${p.color} shadow-[3px_3px_0px_0px_#000000] transform -translate-y-0.5`
                          : 'bg-[#FDF6E3] hover:bg-white text-black'
                      }`}
                    >
                      <span className="text-base">{p.logo}</span>
                      <span>{p.shortName}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Billing Cycle */}
            <div>
              <div className="font-mono text-xs font-black uppercase text-black mb-2">
                BILLING CYCLE
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPeriod('monthly')}
                  className={`p-2.5 font-mono text-xs font-bold uppercase border-2 border-black transition-all ${
                    period === 'monthly'
                      ? 'bg-[#FF00FF] text-white shadow-[3px_3px_0px_0px_#000000]'
                      : 'bg-[#FDF6E3] hover:bg-white text-black'
                  }`}
                >
                  MONTHLY
                </button>
                <button
                  onClick={() => setPeriod('annual')}
                  className={`p-2.5 font-mono text-xs font-bold uppercase border-2 border-black transition-all ${
                    period === 'annual'
                      ? 'bg-[#FF00FF] text-white shadow-[3px_3px_0px_0px_#000000]'
                      : 'bg-[#FDF6E3] hover:bg-white text-black'
                  }`}
                >
                  ANNUAL (-10%)
                </button>
              </div>
            </div>
          </div>

          {/* Team Scale Slider */}
          <div className="pt-3 border-t-2 border-black">
            <div className="flex items-center justify-between font-mono text-xs font-bold uppercase mb-2">
              <span>TEAM INTENSITY SCALE: {safeTeamSize} DEVELOPERS</span>
              <span className="bg-black text-[#00FF00] px-2 py-0.5 text-[10px]">
                {Math.round((safeTeamSize / 10) * 100)}% CAPACITY
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={safeTeamSize}
              onChange={e => setTeamSize(Number(e.target.value))}
              className="w-full h-3 bg-[#FDF6E3] border-2 border-black rounded-none appearance-none cursor-pointer accent-[#FF00FF]"
            />
          </div>
        </div>

        {/* Cost Forecast Card */}
        <div className="bg-[#FFE600] border-3 border-black shadow-[6px_6px_0px_0px_#000000] p-6 text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-black text-white font-mono text-xs font-black px-3 py-1 uppercase">
            <span>{provider.logo}</span>
            <span>{provider.name} • {period} FORECAST</span>
          </div>

          <div className="font-display font-black text-4xl sm:text-6xl text-black tracking-tight">
            ${scaledCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </div>
          <p className="font-mono text-xs font-bold text-black uppercase">
            ESTIMATED CLOUD RUNTIME / {period === 'monthly' ? 'MONTH' : 'YEAR'}
          </p>

          <div className="flex items-center justify-center gap-3 pt-2">
            {profitDelta > 0 && (
              <span className="font-mono text-xs font-black bg-[#00FF00] text-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000000] uppercase">
                SAVINGS: -{profitDelta}% vs BASELINE
              </span>
            )}
            <span className="font-mono text-xs font-black bg-white text-black px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000000] uppercase">
              {safeTeamSize}x MULTIPLIER
            </span>
          </div>
        </div>

        {/* Expandable Breakdown */}
        {expanded && (
          <div className="bg-white border-3 border-black shadow-[4px_4px_0px_0px_#000000] p-5 space-y-3">
            <h3 className="font-mono text-xs font-black text-black uppercase pb-2 border-b-2 border-black">
              [ DETAILED RESOURCE ALLOCATION ]
            </h3>
            <div className="space-y-3">
              {infraBreakdown.map((item) => {
                const itemCost = (scaledCost * item.pct) / 100;
                return (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between font-mono text-xs font-bold">
                      <span className="text-black uppercase">{item.label} ({item.pct}%)</span>
                      <span className="text-black font-black">
                        ${itemCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                      </span>
                    </div>
                    <div className="w-full h-2.5 bg-[#FDF6E3] border border-black">
                      <div
                        className="h-full bg-[#00FF00] border-r border-black"
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
