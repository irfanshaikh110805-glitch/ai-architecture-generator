import { useState } from 'react';
import { X, Zap, ShoppingCart, Smartphone, Building2, Heart, GraduationCap, BarChart2, Gamepad2, Globe, Lock } from 'lucide-react';

const TEMPLATES = [
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    accent: 'bg-[#FFE600]',
    label: 'E-COMMERCE',
    category: 'RETAIL',
    prompt: 'A full-featured e-commerce platform with product catalog, shopping cart, secure checkout, payment gateway integration, order tracking, inventory management, and seller dashboard.',
  },
  {
    id: 'saas',
    icon: Building2,
    accent: 'bg-[#00FFFF]',
    label: 'SAAS PLATFORM',
    category: 'BUSINESS',
    prompt: 'A multi-tenant SaaS platform with subscription billing, role-based access control, analytics dashboard, API integrations, webhook support, and team collaboration features.',
  },
  {
    id: 'mobile',
    icon: Smartphone,
    accent: 'bg-[#00FF00]',
    label: 'MOBILE APP',
    category: 'MOBILE',
    prompt: 'A cross-platform mobile app with offline support, push notifications, user profiles, social features, real-time sync, and native device integrations.',
  },
  {
    id: 'fintech',
    icon: BarChart2,
    accent: 'bg-[#FFE600]',
    label: 'FINTECH APP',
    category: 'FINANCE',
    prompt: 'A fintech application with secure user authentication, transaction processing, bank account linking, spending analytics, budgeting tools, fraud detection, and regulatory compliance (KYC/AML).',
  },
  {
    id: 'healthcare',
    icon: Heart,
    accent: 'bg-[#FF00FF] text-white',
    label: 'HEALTHCARE',
    category: 'HEALTHCARE',
    prompt: 'A HIPAA-compliant healthcare platform with patient records management, appointment scheduling, telemedicine video calls, prescription management, and secure messaging between doctors and patients.',
  },
  {
    id: 'edtech',
    icon: GraduationCap,
    accent: 'bg-[#FFE600]',
    label: 'EDTECH LMS',
    category: 'EDUCATION',
    prompt: 'A comprehensive Learning Management System (LMS) with course authoring, video streaming, interactive quizzes, student progress tracking, grading, and certification issuance.',
  },
  {
    id: 'social',
    icon: Globe,
    accent: 'bg-[#00FFFF]',
    label: 'SOCIAL NETWORK',
    category: 'SOCIAL',
    prompt: 'A scalable social network featuring user feeds, direct messaging, media uploads with image optimization, notifications, user following system, and content moderation.',
  },
  {
    id: 'gaming',
    icon: Gamepad2,
    accent: 'bg-[#00FF00]',
    label: 'GAMING PLATFORM',
    category: 'GAMING',
    prompt: 'An online gaming platform with matchmaking, real-time multiplayer, leaderboards, achievements, in-game chat, virtual economy, game analytics, and anti-cheat systems.',
  },
  {
    id: 'auth',
    icon: Lock,
    accent: 'bg-[#FFE600]',
    label: 'AUTH SERVICE',
    category: 'SECURITY',
    prompt: 'A standalone authentication and authorization service with OAuth 2.0, SSO, MFA, JWT tokens, RBAC, audit logs, and enterprise directory integration.',
  },
];

function TemplateSelector({ onSelect, onClose }) {
  const [search, setSearch] = useState('');

  const filtered = TEMPLATES.filter(t =>
    t.label.toLowerCase().includes(search.toLowerCase()) ||
    t.category.toLowerCase().includes(search.toLowerCase()) ||
    t.prompt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 selection:bg-[#00FF00] selection:text-black">
      <div className="bg-white border-3 border-black shadow-[8px_8px_0px_0px_#000000] w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#00FF00] border-b-3 border-black text-black">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black text-[#00FF00] flex items-center justify-center border-2 border-black">
              <Zap size={18} className="stroke-[3]" />
            </div>
            <div>
              <h2 className="font-display font-black text-base sm:text-lg uppercase">
                SELECT A TEMPLATE
              </h2>
              <p className="font-mono text-xs font-bold text-gray-800">
                PROVEN SYSTEM TOPOLOGIES & STARTERS
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 bg-white border-2 border-black hover:bg-[#FF5500] hover:text-white transition-colors"
          >
            <X size={20} className="stroke-[3]" />
          </button>
        </div>

        {/* Search */}
        <div className="p-4 bg-[#FDF6E3] border-b-2 border-black">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="FILTER BLUEPRINTS (E.G. FINTECH, ECOMMERCE, SAAS)..."
            className="w-full px-3.5 py-2 font-mono text-xs font-bold text-black placeholder-gray-500 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] focus:outline-none focus:bg-[#FFE600]/20"
          />
        </div>

        {/* Template Grid */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-[#FDF6E3]">
          {filtered.map(t => {
            const Icon = t.icon;
            return (
              <button
                key={t.id}
                onClick={() => { onSelect(t.prompt); onClose(); }}
                className="text-left p-4 bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] hover:bg-[#FFE600] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-8 h-8 ${t.accent} border-2 border-black flex items-center justify-center`}>
                      <Icon size={16} className="stroke-[2.5]" />
                    </div>
                    <span className="font-mono text-[9px] font-black uppercase px-1.5 py-0.5 bg-[#F4ECC8] border border-black text-black">
                      {t.category}
                    </span>
                  </div>
                  <h3 className="font-display font-black text-sm uppercase text-black group-hover:text-black">
                    {t.label}
                  </h3>
                  <p className="font-mono text-[11px] font-medium text-gray-700 mt-1 line-clamp-2 leading-relaxed">
                    {t.prompt}
                  </p>
                </div>
                <div className="mt-3 pt-2 border-t border-black font-mono text-[10px] font-black text-black flex items-center justify-between uppercase">
                  <span>LOAD BLUEPRINT</span>
                  <span className="group-hover:translate-x-1 transition-transform font-bold">→</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#F4ECC8] border-t-2 border-black flex justify-between items-center font-mono text-[11px] font-bold text-black">
          <span>{filtered.length} STARTER BLUEPRINTS AVAILABLE</span>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white border border-black hover:bg-[#FF5500] hover:text-white uppercase font-black"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
}

export default TemplateSelector;
