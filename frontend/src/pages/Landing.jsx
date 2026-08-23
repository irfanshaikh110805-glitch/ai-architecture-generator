import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {
  Zap, Layers, Database, Globe, Code, BarChart, GitMerge, Clock,
  ArrowRight, Check, ChevronRight, Sparkles, Cpu, Rocket, Menu, X, Terminal,
} from 'lucide-react';
import Mascot from '../components/Mascot';

/* ─── Static Data ─────────────────────────────────────────── */

const FEATURES = [
  { icon: Layers,   title: 'ARCHITECTURE DESIGN',   tag: 'CORE_ENGINE', desc: 'Auto-generate scalable system architectures with component diagrams and data flow.',    color: '#FF00FF', bg: '#FFFFFF' },
  { icon: Database, title: 'DB SCHEMA GENERATION',  tag: 'SQL_3NF',     desc: 'Complete database schemas with tables, relationships, and indexes — ready to use.',    color: '#00FF00', bg: '#FFFFFF' },
  { icon: Globe,    title: 'REST API DESIGN',        tag: 'OPENAPI_SPEC',desc: 'Full RESTful API spec with endpoints, methods, request/response bodies, and auth.',    color: '#FFE600', bg: '#FFFFFF' },
  { icon: Code,     title: 'CODE GENERATION',        tag: 'SCAFFOLDING', desc: 'Boilerplate code scaffolding for your chosen stack, ready to copy and customize.',    color: '#00FFFF', bg: '#FFFFFF' },
  { icon: BarChart, title: 'COST ESTIMATION',        tag: 'CLOUD_FINOPS',desc: 'Realistic cloud cost estimates before you write a single line of production code.',   color: '#FF5500', bg: '#FFFFFF' },
  { icon: GitMerge, title: 'ER DIAGRAMS',            tag: 'MERMAID_JS',  desc: 'Auto-rendered entity-relationship diagrams for your entire data model in seconds.',  color: '#FF66B2', bg: '#FFFFFF' },
  { icon: Clock,    title: 'PROJECT ROADMAP',        tag: 'MILESTONES',  desc: 'Prioritized development roadmap with milestones, phases, and estimated timelines.',  color: '#00FF00', bg: '#FFFFFF' },
  { icon: Cpu,      title: 'TECH RECOMMENDATIONS',  tag: 'CURATED_STACK',desc: 'Expert-curated tech stack picks based on your project requirements and scale.',       color: '#FF00FF', bg: '#FFFFFF' },
];

const STEPS = [
  { num: '01', icon: Sparkles, title: 'DESCRIBE YOUR IDEA',       badge: 'INPUT',       desc: 'Type a plain-English description of what you want to build — as short or as detailed as you like.' },
  { num: '02', icon: Cpu,      title: 'AI COMPILES SPECS',        badge: 'PROCESSING',  desc: 'Our AI analyzes your idea and produces a complete, production-ready architecture plan instantly.'   },
  { num: '03', icon: Rocket,   title: 'EXPORT & DEPLOY',          badge: 'PRODUCTION',  desc: 'Download or copy your architecture specs and start building immediately — zero guesswork.'    },
];

const TESTIMONIALS = [
  {
    quote: "ArchitechAI saved my team weeks of planning. We described our SaaS idea and had a complete architecture in under a minute. Absolutely mind-blowing.",
    name: 'SARAH CHEN',      role: 'CTO @ NOVASOFT',      tag: 'FINTECH_FOUNDER',
  },
  {
    quote: "The DB schema and API spec it generated were production-quality. I used it directly for our fintech MVP. Zero wasted time on boilerplate decisions.",
    name: 'MARCUS WILLIAMS', role: 'LEAD ENGINEER @ PAYFLOW', tag: 'BACKEND_ARCHITECT',
  },
  {
    quote: "I'm a solo indie hacker. This tool lets me compete with full teams. I can ship features 10x faster using the generated architecture as my blueprint.",
    name: 'PRIYA PATEL',     role: 'INDIE DEVELOPER',    tag: 'SOLO_BUILDER',
  },
];

/* ─── NavBar ─────────────────────────────────────────────── */
function NavBar({ onCTA }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#FDF6E3] border-b-[3px] border-black shadow-[0_4px_0px_0px_#000000]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000000] p-1 flex items-center justify-center">
            <img src="/logo.jpg" alt="ArchitechAI" className="w-full h-full object-cover" />
          </div>
          <span className="font-display font-black text-xl tracking-tight text-black flex items-center gap-1">
            ARCHITECH<span className="bg-[#FF00FF] text-white px-1.5 py-0.5 border-2 border-black shadow-[2px_2px_0px_0px_#000000] text-sm">AI</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {[
            ['FEATURES', '#features'],
            ['HOW IT WORKS', '#how-it-works'],
            ['TESTIMONIALS', '#testimonials'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="font-mono text-xs font-bold text-black hover:bg-[#FFE600] px-2.5 py-1 border-2 border-transparent hover:border-black hover:shadow-[2px_2px_0px_0px_#000000] transition-all"
            >
              {label}
            </a>
          ))}
        </div>

        {/* Right Side Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          <button
            onClick={() => navigate('/app')}
            className="font-mono text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-3 py-1.5 hover:bg-[#00FFFF] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase flex items-center gap-1"
          >
            <Clock size={13} className="stroke-[2.5]" />
            HISTORY
          </button>
          <button
            onClick={() => navigate('/login')}
            className="font-mono text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-3 py-1.5 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase"
          >
            LOG IN
          </button>
          <button
            onClick={() => navigate('/signup')}
            className="font-mono text-xs font-bold text-black bg-[#FFE600] border-2 border-black shadow-[2px_2px_0px_0px_#000000] px-3 py-1.5 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all uppercase"
          >
            SIGN UP
          </button>
          <button
            onClick={onCTA}
            className="font-display text-xs font-black text-black bg-[#00FF00] border-2 border-black shadow-[3px_3px_0px_0px_#000000] px-4 py-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[1px_1px_0px_0px_#000000] active:translate-x-[3px] active:translate-y-[3px] active:shadow-none transition-all flex items-center gap-1.5 uppercase"
          >
            START FREE <ArrowRight size={14} className="stroke-[3]" />
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-1.5 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] active:translate-x-[1px] active:translate-y-[1px]"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X size={22} className="stroke-[2.5]" /> : <Menu size={22} className="stroke-[2.5]" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#FDF6E3] border-t-2 border-black p-4 flex flex-col gap-3 shadow-[0_6px_0px_0px_#000000]">
          {[
            ['FEATURES', '#features'],
            ['HOW IT WORKS', '#how-it-works'],
            ['TESTIMONIALS', '#testimonials'],
          ].map(([label, href]) => (
            <a
              key={label}
              href={href}
              onClick={() => setMenuOpen(false)}
              className="font-mono text-sm font-bold text-black p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000]"
            >
              {label}
            </a>
          ))}
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => { setMenuOpen(false); navigate('/login'); }}
              className="flex-1 font-mono text-xs font-bold text-black bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000000] py-2 uppercase text-center"
            >
              LOG IN
            </button>
            <button
              onClick={() => { setMenuOpen(false); navigate('/signup'); }}
              className="flex-1 font-mono text-xs font-bold text-black bg-[#FFE600] border-2 border-black shadow-[2px_2px_0px_0px_#000000] py-2 uppercase text-center"
            >
              SIGN UP
            </button>
          </div>
          <button
            onClick={() => { setMenuOpen(false); onCTA(); }}
            className="w-full font-display text-sm font-black text-black bg-[#00FF00] border-2 border-black shadow-[3px_3px_0px_0px_#000000] py-3 flex items-center justify-center gap-2 uppercase"
          >
            START GENERATING FREE <ArrowRight size={16} className="stroke-[3]" />
          </button>
        </div>
      )}
    </nav>
  );
}

/* ─── Ticker Tape Marquee ─────────────────────────────────── */
function TickerTape() {
  return (
    <div className="ticker-banner select-none">
      <div className="inline-block animate-marquee whitespace-nowrap font-mono font-bold text-sm tracking-wider">
        <span>/// ARCHITECH.AI /// INSTANT FULL-STACK SYSTEM DESIGN /// 3NF DATABASE SCHEMAS /// OPENAPI SPECS /// TERRAFORM & DOCKER COMPOSE /// CLOUD COST FORECAST /// MERMAID ER DIAGRAMS /// 100% PRODUCTION READY /// </span>
        <span>/// ARCHITECH.AI /// INSTANT FULL-STACK SYSTEM DESIGN /// 3NF DATABASE SCHEMAS /// OPENAPI SPECS /// TERRAFORM & DOCKER COMPOSE /// CLOUD COST FORECAST /// MERMAID ER DIAGRAMS /// 100% PRODUCTION READY /// </span>
      </div>
    </div>
  );
}

/* ─── Main Landing Page ───────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const goGenerate = () => navigate('/generate');

  return (
    <div className="min-h-screen bg-[#FDF6E3] text-black font-sans selection:bg-[#00FF00] selection:text-black">
      <NavBar onCTA={goGenerate} />

      {/* ═══════════════════════════════════════
          HERO SECTION (Neo-Brutalist)
         ═══════════════════════════════════════ */}
      <section id="hero" className="pt-28 pb-16 px-4 sm:px-6 relative bg-neo-pattern border-b-[3px] border-black">
        <div className="max-w-5xl mx-auto text-center">
          
          {/* Top Badge Stamp */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#FFE600] border-2 border-black shadow-[3px_3px_0px_0px_#000000] mb-6 transform -rotate-1">
            <span className="w-2.5 h-2.5 bg-[#00FF00] border border-black inline-block animate-ping" />
            <span className="font-mono text-xs font-black uppercase tracking-wider text-black">
              AI ARCHITECTURE GENERATOR V2.0
            </span>
          </div>

          {/* Heavy Display Headline */}
          <h1 className="font-display font-black text-4xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight uppercase mb-6 text-black">
            BUILD BETTER SOFTWARE,
            <br />
            <span className="inline-block bg-[#FF00FF] text-white px-3 sm:px-6 py-1 border-3 border-black shadow-[5px_5px_0px_0px_#000000] transform rotate-1 mt-2">
              FASTER WITH AI
            </span>
          </h1>

          {/* High-Contrast Monospace Subtitle */}
          <p className="font-mono text-sm sm:text-base md:text-lg max-w-2xl mx-auto mb-8 font-bold leading-relaxed text-black bg-white p-4 border-2 border-black shadow-[4px_4px_0px_0px_#000000]">
            Describe your software idea in plain English. Get a <span className="bg-[#00FF00] px-1 text-black">COMPLETE PRODUCTION BLUEPRINT</span> — 3NF DB schema, REST API specs, Terraform configs, cost breakdown, and roadmap in seconds.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <button
              onClick={goGenerate}
              id="hero-cta"
              className="w-full sm:w-auto font-display font-black text-base sm:text-lg bg-[#00FF00] text-black border-3 border-black shadow-[5px_5px_0px_0px_#000000] px-8 py-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all flex items-center justify-center gap-3 uppercase"
            >
              <Zap size={20} className="stroke-[3]" /> START GENERATING FREE <ArrowRight size={20} className="stroke-[3]" />
            </button>
            <a
              href="#how-it-works"
              className="w-full sm:w-auto font-mono font-bold text-sm sm:text-base bg-white text-black border-3 border-black shadow-[5px_5px_0px_0px_#000000] px-6 py-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all flex items-center justify-center gap-2 uppercase"
            >
              <Terminal size={18} /> HOW IT WORKS <ChevronRight size={18} />
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {[
              { label: 'BLUEPRINTS GENERATED', val: '25,000+' },
              { label: 'AVG GENERATION TIME', val: '< 15 SEC' },
              { label: 'STACK ACCURACY', val: '99.4%' },
              { label: 'DEVELOPER COST SAVED', val: '$2.4M+' },
            ].map((stat, i) => (
              <div key={i} className="bg-white border-2 border-black shadow-[3px_3px_0px_0px_#000000] p-3 text-center">
                <div className="font-display font-black text-lg sm:text-xl text-black">{stat.val}</div>
                <div className="font-mono text-[10px] sm:text-xs font-bold text-gray-700">{stat.label}</div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          TICKER MARQUEE BANNER
         ═══════════════════════════════════════ */}
      <TickerTape />

      {/* ═══════════════════════════════════════
          FEATURES SECTION
         ═══════════════════════════════════════ */}
      <section id="features" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-block bg-[#00FFFF] text-black font-mono text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000000] mb-3">
            [ SYSTEM_CAPABILITIES ]
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-black">
            EVERYTHING YOU NEED TO SHIP
          </h2>
          <p className="font-mono text-sm sm:text-base text-gray-800 font-bold max-w-xl mx-auto mt-2">
            No fluff. No placeholders. Full-fidelity architecture outputs tailored to your stack.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000000] p-5 flex flex-col justify-between hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[7px_7px_0px_0px_#000000] transition-all"
              >
                <div>
                  {/* Top Bar inside Card */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 border-2 border-black shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center text-black font-black"
                      style={{ backgroundColor: f.color }}
                    >
                      <Icon size={24} className="stroke-[2.5]" />
                    </div>
                    <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#FDF6E3] border border-black">
                      {f.tag}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-base uppercase text-black mb-2 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="font-mono text-xs text-gray-800 leading-relaxed">
                    {f.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t-2 border-black flex items-center justify-between text-[11px] font-mono font-bold">
                  <span className="text-black">READY TO EXPORT</span>
                  <span className="text-[#FF00FF]">● 100% SPEC</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          HOW IT WORKS
         ═══════════════════════════════════════ */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 bg-[#F4ECC8] border-y-[3px] border-black">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-block bg-[#FF00FF] text-white font-mono text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000000] mb-3">
              [ 3_STEP_WORKFLOW ]
            </div>
            <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-black">
              THREE STEPS TO PRODUCTION
            </h2>
            <p className="font-mono text-sm sm:text-base text-gray-800 font-bold max-w-xl mx-auto mt-2">
              From raw concept to complete engineering blueprint in under 30 seconds.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <div
                  key={i}
                  className="bg-white border-3 border-black shadow-[6px_6px_0px_0px_#000000] p-6 relative hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[8px_8px_0px_0px_#000000] transition-all"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-display font-black text-2xl text-black bg-[#FFE600] px-3 py-1 border-2 border-black shadow-[2px_2px_0px_0px_#000000]">
                      {step.num}
                    </span>
                    <span className="font-mono text-xs font-bold bg-[#00FF00] text-black px-2 py-0.5 border border-black uppercase">
                      {step.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 border-2 border-black bg-[#00FFFF] shadow-[2px_2px_0px_0px_#000000] flex items-center justify-center text-black mb-4">
                    <Icon size={24} className="stroke-[2.5]" />
                  </div>

                  <h3 className="font-display font-black text-lg uppercase text-black mb-2">
                    {step.title}
                  </h3>
                  <p className="font-mono text-xs text-gray-800 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          TESTIMONIALS
         ═══════════════════════════════════════ */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <div className="inline-block bg-[#FFE600] text-black font-mono text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000000] mb-3">
            [ VERIFIED_FEEDBACK ]
          </div>
          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-black">
            LOVED BY BUILDERS WORLDWIDE
          </h2>
          <p className="font-mono text-sm sm:text-base text-gray-800 font-bold max-w-xl mx-auto mt-2">
            Join thousands of CTOs, backend architects, and indie hackers shipping faster.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="bg-white border-3 border-black shadow-[5px_5px_0px_0px_#000000] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <span key={idx} className="w-5 h-5 bg-[#FFE600] border border-black text-black font-mono font-bold text-xs flex items-center justify-center">
                        ★
                      </span>
                    ))}
                  </div>
                  <span className="font-mono text-[10px] font-black uppercase px-2 py-0.5 bg-[#FDF6E3] border border-black">
                    {t.tag}
                  </span>
                </div>
                <p className="font-mono text-xs text-black font-bold leading-relaxed mb-6">
                  "{t.quote}"
                </p>
              </div>

              <div className="pt-4 border-t-2 border-black flex items-center gap-3">
                <div className="w-10 h-10 border-2 border-black bg-[#FF00FF] text-white font-display font-black text-base flex items-center justify-center shadow-[2px_2px_0px_0px_#000000]">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <div className="font-display font-black text-xs uppercase text-black">{t.name}</div>
                  <div className="font-mono text-[11px] text-gray-600 font-bold">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          CTA BANNER (High-Energy Magenta)
         ═══════════════════════════════════════ */}
      <section id="cta" className="py-16 px-4 sm:px-6 bg-[#FDF6E3] border-t-[3px] border-black">
        <div className="max-w-4xl mx-auto bg-[#FF00FF] border-4 border-black shadow-[8px_8px_0px_0px_#000000] p-8 sm:p-12 text-center text-white">
          <div className="inline-block bg-[#00FF00] text-black font-mono text-xs font-black uppercase px-3 py-1 border-2 border-black shadow-[3px_3px_0px_0px_#000000] mb-4">
            NO CREDIT CARD REQUIRED
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tight text-white mb-4 leading-tight">
            READY TO BUILD YOUR NEXT ARCHITECTURE?
          </h2>

          <p className="font-mono text-sm sm:text-base font-bold text-white max-w-xl mx-auto mb-8 bg-black/30 p-3 border-2 border-black">
            Join thousands of developers using ArchitechAI to design, spec, and ship production systems with 100% confidence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <button
              onClick={goGenerate}
              id="bottom-cta"
              className="w-full sm:w-auto font-display font-black text-base sm:text-lg bg-[#00FF00] text-black border-3 border-black shadow-[5px_5px_0px_0px_#000000] px-8 py-4 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0px_0px_#000000] active:translate-x-[5px] active:translate-y-[5px] active:shadow-none transition-all flex items-center justify-center gap-2 uppercase"
            >
              <Zap size={20} className="stroke-[3]" /> GENERATE YOUR ARCHITECTURE NOW <ArrowRight size={20} className="stroke-[3]" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono text-xs font-bold text-black">
            {['FREE TO START', 'RESULTS IN <15 SECONDS', 'EXPORT TO CODE & DIAGRAMS'].map((txt, idx) => (
              <span key={idx} className="bg-white border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_0px_#000000] flex items-center gap-1.5">
                <Check size={14} className="stroke-[3] text-black" /> {txt}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER (Neo-Brutalist)
         ═══════════════════════════════════════ */}
      <footer className="bg-[#FFFFFF] border-t-[3px] border-black py-12 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b-2 border-black">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 border-2 border-black bg-[#00FF00] shadow-[2px_2px_0px_0px_#000000] p-1 flex items-center justify-center">
                <img src="/logo.jpg" alt="ArchitechAI" className="w-full h-full object-cover" />
              </div>
              <span className="font-display font-black text-xl tracking-tight text-black">
                ARCHITECH<span className="bg-[#FF00FF] text-white px-1.5 py-0.5 border-2 border-black ml-1 text-sm">AI</span>
              </span>
            </div>

            {/* Quick Links */}
            <div className="flex flex-wrap gap-4 font-mono text-xs font-bold">
              <a href="#features" className="hover:bg-[#FFE600] px-2 py-1 border border-black">FEATURES</a>
              <a href="#how-it-works" className="hover:bg-[#FFE600] px-2 py-1 border border-black">WORKFLOW</a>
              <a href="#testimonials" className="hover:bg-[#FFE600] px-2 py-1 border border-black">TESTIMONIALS</a>
              <button onClick={goGenerate} className="hover:bg-[#00FF00] px-2 py-1 border border-black">GENERATE</button>
            </div>
          </div>

          {/* Developer Card */}
          <div className="mt-8 bg-[#FDF6E3] border-3 border-black shadow-[4px_4px_0px_0px_#000000] p-6 max-w-md mx-auto text-center">
            <div className="inline-block bg-[#FFE600] text-black font-mono text-[10px] font-black uppercase px-2.5 py-0.5 border border-black mb-2">
              DEVELOPED BY
            </div>
            <div className="font-display font-black text-xl text-black mb-3">
              IRFAN SHEKH
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 font-mono text-xs font-bold">
              <a
                href="mailto:irfanshaikh110805@gmail.com"
                className="bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#000000] hover:bg-[#00FFFF] transition-colors"
              >
                📧 irfanshaikh110805@gmail.com
              </a>
              <a
                href="tel:+919964264412"
                className="bg-white border-2 border-black px-3 py-1.5 shadow-[2px_2px_0px_0px_#000000] hover:bg-[#00FF00] transition-colors"
              >
                📱 +91 99642 64412
              </a>
            </div>
          </div>

          <div className="mt-8 text-center font-mono text-xs text-gray-700 font-bold">
            © 2026 ARCHITECH.AI · POWERED BY ADVANCED AI ARCHITECT MODELS
          </div>
        </div>
      </footer>

      {/* Mascot */}
      <Mascot />
    </div>
  );
}
