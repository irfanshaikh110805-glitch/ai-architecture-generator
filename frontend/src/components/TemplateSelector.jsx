import { useState } from 'react';
import { X, Zap, ShoppingCart, Smartphone, Building2, Heart, GraduationCap, BarChart2, Gamepad2, Globe, Lock } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    color: 'orange',
    label: 'E-Commerce',
    category: 'Retail',
    prompt: 'A full-featured e-commerce platform with product catalog, shopping cart, secure checkout, payment gateway integration, order tracking, inventory management, and seller dashboard.',
  },
  {
    id: 'saas',
    icon: Building2,
    color: 'blue',
    label: 'SaaS Platform',
    category: 'Business',
    prompt: 'A multi-tenant SaaS platform with subscription billing, role-based access control, analytics dashboard, API integrations, webhook support, and team collaboration features.',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    color: 'green',
    label: 'Mobile App',
    category: 'Mobile',
    prompt: 'A cross-platform mobile app with offline support, push notifications, user profiles, social features, real-time sync, and native device integrations.',
  },
  {
    id: 'fintech',
    icon: BarChart2,
    color: 'emerald',
    label: 'Fintech App',
    category: 'Finance',
    prompt: 'A fintech application with secure user authentication, transaction processing, bank account linking, spending analytics, budgeting tools, fraud detection, and regulatory compliance (KYC/AML).',
  },
  {
    id: 'healthcare',
    icon: Heart,
    color: 'rose',
    label: 'Healthcare Platform',
    category: 'Healthcare',
    prompt: 'A HIPAA-compliant healthcare platform with patient records management, appointment scheduling, telemedicine video calls, prescription management, and secure messaging between doctors and patients.',
  },
  {
    id: 'edtech',
    icon: GraduationCap,
    color: 'blue',
    label: 'Ed-Tech Platform',
    category: 'Education',
    prompt: 'An e-learning platform with course creation tools, video lectures, quizzes, progress tracking, certificates, student analytics, live sessions, and instructor dashboards.',
  },
  {
    id: 'social',
    icon: Globe,
    color: 'cyan',
    label: 'Social Network',
    category: 'Social',
    prompt: 'A social networking platform with user profiles, news feed, posts and media sharing, messaging, notifications, follow system, groups, and content moderation.',
  },
  {
    id: 'gaming',
    icon: Gamepad2,
    color: 'teal',
    label: 'Gaming Platform',
    category: 'Entertainment',
    prompt: 'An online gaming platform with matchmaking, real-time multiplayer, leaderboards, achievements, in-game chat, virtual economy, game analytics, and anti-cheat systems.',
  },
  {
    id: 'auth',
    icon: Lock,
    color: 'slate',
    label: 'Auth Service',
    category: 'Security',
    prompt: 'A standalone authentication and authorization service with OAuth 2.0, SSO, MFA, JWT tokens, RBAC, audit logs, and enterprise directory integration.',
  },
];

const colorMap = {
  orange:  'bg-orange-50/50  border-orange-100/50  text-orange-700 hover:bg-orange-100/80 hover:border-orange-200',
  blue:    'bg-blue-50/50    border-blue-100/50    text-blue-700   hover:bg-blue-100/80   hover:border-blue-200',
  green:   'bg-green-50/50   border-green-100/50   text-green-700  hover:bg-green-100/80  hover:border-green-200',
  emerald: 'bg-emerald-50/50 border-emerald-100/50 text-emerald-700 hover:bg-emerald-100/80 hover:border-emerald-200',
  rose:    'bg-rose-50/50    border-rose-100/50    text-rose-700   hover:bg-rose-100/80   hover:border-rose-200',
  cyan:    'bg-cyan-50/50    border-cyan-100/50    text-cyan-700   hover:bg-cyan-100/80   hover:border-cyan-200',
  teal:    'bg-teal-50/50    border-teal-100/50    text-teal-700   hover:bg-teal-100/80   hover:border-teal-200',
  slate:   'bg-slate-50/50   border-slate-100/50   text-slate-700  hover:bg-slate-100/80  hover:border-slate-200',
};

const iconColorMap = {
  orange:  'text-orange-500',
  blue:    'text-blue-500',
  green:   'text-green-500',
  emerald: 'text-emerald-500',
  rose:    'text-rose-500',
  cyan:    'text-cyan-500',
  teal:    'text-teal-500',
  slate:   'text-slate-500',
};

function TemplateSelector({ onSelect, onClose }) {
  const [search, setSearch] = useState('');

  const filtered = TEMPLATES.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-3xl shadow-premium-lg w-full max-w-2xl max-h-[85vh] flex flex-col border border-white/20 scale-in overflow-hidden relative">
        
        {/* Decorative backdrop orbs */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-100/30 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent-100/30 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between p-7 border-b border-surface-100 relative bg-white/50 backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-brand-50 flex items-center justify-center text-brand-600 border border-brand-100 shadow-sm">
              <Zap size={22} fill="currentColor" className="opacity-80" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-gray-900 leading-none">Architecture Templates</h2>
              <p className="text-sm text-gray-400 mt-1.5 font-medium">Kickstart your design with curated patterns</p>
            </div>
          </div>
          <button 
            onClick={onClose} 
            className="w-10 h-10 flex items-center justify-center hover:bg-surface-100 text-gray-400 hover:text-gray-600 rounded-xl transition-all border border-transparent hover:border-surface-200 active:scale-90"
          >
            <X size={20} />
          </button>
        </div>

        {/* Search */}
        <div className="px-7 py-4 border-b border-surface-100 bg-surface-50/30 relative">
          <div className="relative group">
            <input
              type="text"
              placeholder="Search by category, platform or feature..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-4 pr-10 py-3 rounded-2xl border-2 border-surface-200 bg-white text-gray-800 text-sm font-medium focus:outline-none focus:border-brand-400 focus:ring-4 focus:ring-brand-400/10 transition-all placeholder:text-gray-300"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-brand-400 transition-colors">
              <Globe size={16} />
            </div>
          </div>
        </div>

        {/* Templates grid */}
        <div className="flex-1 overflow-y-auto p-7 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger">
            {filtered.map(t => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => { onSelect(t.prompt); onClose(); }}
                  className={`group flex flex-col items-start gap-4 p-5 rounded-2xl border-2 transition-all duration-300 text-left hover-lift hover:shadow-lg active:scale-95 ${colorMap[t.color]}`}
                >
                  <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm border border-transparent group-hover:border-current/10 transition-all ${iconColorMap[t.color]}`}>
                    <Icon size={20} />
                  </div>
                  <div>
                    <span className="font-bold text-sm tracking-tight block mb-1">{t.label}</span>
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 block">{t.category}</span>
                    <p className="text-[11px] leading-relaxed opacity-70 line-clamp-3 font-medium">{t.prompt}</p>
                  </div>
                </button>
              );
            })}
          </div>
          {filtered.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-gray-400 font-medium">No templates matching your search.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-7 py-4 bg-surface-50 border-t border-surface-100 flex justify-center">
           <p className="text-[11px] text-gray-400 font-semibold tracking-wide uppercase">Select a template to auto-populate the generator</p>
        </div>
      </div>
    </div>
  );
}

export default TemplateSelector;
