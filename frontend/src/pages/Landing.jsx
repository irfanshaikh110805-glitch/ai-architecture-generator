import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import {
  Zap, Layers, Database, Globe, Code, BarChart, GitMerge, Clock,
  ArrowRight, CheckCircle, Star, ChevronRight, Sparkles, Cpu, Rocket, Menu, X,
} from 'lucide-react';
import Mascot from '../components/Mascot';

/* ─── Static Data ─────────────────────────────────────────── */

const FEATURES = [
  { icon: Layers,   title: 'Architecture Design',   desc: 'Auto-generate scalable system architectures with component diagrams and data flow.',    color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
  { icon: Database, title: 'DB Schema Generation',  desc: 'Complete database schemas with tables, relationships, and indexes — ready to use.',    color: '#059669', bg: '#ecfdf5', border: '#6ee7b7' },
  { icon: Globe,    title: 'REST API Design',        desc: 'Full RESTful API spec with endpoints, methods, request/response bodies, and auth.',    color: '#d97706', bg: '#fffbeb', border: '#fcd34d' },
  { icon: Code,     title: 'Code Generation',        desc: 'Boilerplate code scaffolding for your chosen stack, ready to copy and customize.',    color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
  { icon: BarChart, title: 'Cost Estimation',        desc: 'Realistic cloud cost estimates before you write a single line of production code.',   color: '#dc2626', bg: '#fef2f2', border: '#fca5a5' },
  { icon: GitMerge, title: 'ER Diagrams',            desc: 'Auto-rendered entity-relationship diagrams for your entire data model in seconds.',  color: '#0891b2', bg: '#ecfeff', border: '#67e8f9' },
  { icon: Clock,    title: 'Project Roadmap',        desc: 'Prioritized development roadmap with milestones, phases, and estimated timelines.',  color: '#db2777', bg: '#fdf2f8', border: '#f9a8d4' },
  { icon: Cpu,      title: 'Tech Recommendations',  desc: 'Expert-curated tech stack picks based on your project requirements and scale.',       color: '#0d9488', bg: '#f0fdfa', border: '#99f6e4' },
];

const STEPS = [
  { num: '01', icon: Sparkles, title: 'Describe Your Idea',       desc: 'Type a plain-English description of what you want to build — as short or as detailed as you like.' },
  { num: '02', icon: Cpu,      title: 'AI Generates Architecture', desc: 'Our AI analyzes your idea and produces a complete, production-ready architecture plan instantly.'   },
  { num: '03', icon: Rocket,   title: 'Export & Start Building',   desc: 'Download or copy your architecture specs and start building immediately — no guesswork needed.'    },
];

const TESTIMONIALS = [
  {
    quote: "ArchitechAI saved my team weeks of planning. We described our SaaS idea and had a complete architecture in under a minute. Absolutely mind-blowing.",
    name: 'Sarah Chen',      role: 'CTO, NovaSoft',      avatar: '#2563eb', stars: 5,
  },
  {
    quote: "The DB schema and API spec it generated were production-quality. I used it directly for our fintech MVP. Zero wasted time on boilerplate decisions.",
    name: 'Marcus Williams', role: 'Lead Engineer, PayFlow', avatar: '#059669', stars: 5,
  },
  {
    quote: "I'm a solo indie hacker. This tool lets me compete with full teams. I can ship features 10x faster using the generated architecture as my blueprint.",
    name: 'Priya Patel',     role: 'Indie Developer',    avatar: '#d97706', stars: 5,
  },
];

/* ─── NavBar ─────────────────────────────────────────────── */
function NavBar({ onCTA }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(37,99,235,0.08)',
      boxShadow: '0 1px 24px rgba(37,99,235,0.06)',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '64px' }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.jpg" alt="ArchitechAI" style={{ width: '50px', height: '50px', borderRadius: '12px', objectFit: 'contain', boxShadow: '0 4px 12px rgba(37,99,235,0.3)', padding: '4px', background: 'white' }} />
          <span style={{ fontFamily: "'Outfit',sans-serif", fontWeight: 800, fontSize: '1.25rem', color: '#0f172a', letterSpacing: '-0.03em' }}>
            Architech<span style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>AI</span>
          </span>
        </div>

        {/* Desktop Links */}
        <div className="nav-links-desktop" style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          {[['Features','#features'],['How it Works','#how-it-works'],['Testimonials','#testimonials']].map(([l, h]) => (
            <a key={l} href={h} style={{ color: '#64748b', fontSize: '0.9rem', fontWeight: 600, textDecoration: 'none', transition: 'color 0.2s' }}
              onMouseOver={e => e.target.style.color = '#2563eb'}
              onMouseOut={e => e.target.style.color = '#64748b'}
            >{l}</a>
          ))}
        </div>

        {/* Right Side: Login + Signup + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Login Button */}
          <button 
            onClick={() => navigate('/login')} 
            className="nav-login-desktop" 
            style={{ 
              background: 'transparent', 
              color: '#64748b', 
              border: 'none', 
              borderRadius: '10px', 
              padding: '0.5rem 1rem', 
              fontSize: '0.9rem', 
              fontWeight: 600, 
              cursor: 'pointer', 
              transition: 'all 0.2s' 
            }}
            onMouseOver={e => { e.currentTarget.style.color = '#2563eb'; e.currentTarget.style.background = '#eff6ff'; }}
            onMouseOut={e => { e.currentTarget.style.color = '#64748b'; e.currentTarget.style.background = 'transparent'; }}
          >
            Log In
          </button>

          {/* Signup Button */}
          <button 
            onClick={() => navigate('/signup')} 
            className="nav-signup-desktop" 
            style={{ 
              background: 'white', 
              color: '#2563eb', 
              border: '2px solid #2563eb', 
              borderRadius: '11px', 
              padding: '0.5rem 1.2rem', 
              fontSize: '0.9rem', 
              fontWeight: 700, 
              cursor: 'pointer', 
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(37,99,235,0.15)'
            }}
            onMouseOver={e => { e.currentTarget.style.background = '#eff6ff'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseOut={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            Sign Up
          </button>

          {/* Desktop CTA */}
          <button onClick={onCTA} className="nav-cta-desktop" style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)', color: 'white', border: 'none', borderRadius: '11px', padding: '0.55rem 1.3rem', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', boxShadow: '0 4px 14px rgba(37,99,235,0.28)', transition: 'all 0.2s' }}
            onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,99,235,0.38)'; }}
            onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 14px rgba(37,99,235,0.28)'; }}
          >
            Start Free <ArrowRight size={15} />
          </button>
        </div>

        {/* Hamburger */}
        <button
          className="nav-hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '8px', color: '#334155' }}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="nav-mobile-menu" style={{
          background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(37,99,235,0.08)',
          padding: '1rem 1.25rem 1.5rem',
          display: 'flex', flexDirection: 'column', gap: '0.5rem',
        }}>
          {[['Features','#features'],['How it Works','#how-it-works'],['Testimonials','#testimonials']].map(([l, h]) => (
            <a key={l} href={h} onClick={() => setMenuOpen(false)} style={{ color: '#334155', fontSize: '1rem', fontWeight: 600, textDecoration: 'none', padding: '0.65rem 0.75rem', borderRadius: '10px', transition: 'background 0.15s' }}
              onMouseOver={e => e.currentTarget.style.background = '#eff6ff'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >{l}</a>
          ))}
          <button onClick={() => { setMenuOpen(false); navigate('/login'); }} style={{ marginTop: '0.5rem', background: 'white', color: '#2563eb', border: '2px solid #2563eb', borderRadius: '12px', padding: '0.75rem 1.25rem', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
            Log In
          </button>
          <button onClick={() => { setMenuOpen(false); navigate('/signup'); }} style={{ background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: '12px', padding: '0.75rem 1.25rem', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
            Sign Up
          </button>
          <button onClick={() => { setMenuOpen(false); onCTA(); }} style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)', color: 'white', border: 'none', borderRadius: '12px', padding: '0.75rem 1.25rem', fontSize: '0.95rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '7px' }}>
            Start Free <ArrowRight size={16} />
          </button>
        </div>
      )}
    </nav>
  );
}

/* ─── Main Page ──────────────────────────────────────────── */
export default function Landing() {
  const navigate = useNavigate();
  const goGenerate = () => navigate('/generate');
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 768);

  useEffect(() => {
    document.documentElement.classList.remove('dark');
    document.body.classList.add('bg-premium-animated');
    
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.body.classList.remove('bg-premium-animated');
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const cardHover = (e, on) => {
    e.currentTarget.style.transform = on ? 'translateY(-5px)' : 'translateY(0)';
    e.currentTarget.style.boxShadow = on
      ? '0 20px 60px rgba(37,99,235,0.12), 0 4px 16px rgba(37,99,235,0.08)'
      : '0 1px 4px rgba(37,99,235,0.05), 0 4px 16px rgba(37,99,235,0.05)';
  };

  return (
    <div className="bg-transparent" style={{ fontFamily: "'Plus Jakarta Sans','Outfit',system-ui,sans-serif", color: '#0f172a', overflowX: 'hidden', minHeight: '100vh', position: 'relative' }}>
      {/* ── Fixed Decorative Orbs for whole page ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 0 }}>
        <div className="orb orb-brand"  style={{ width: 800, height: 800, top: '-200px', right: '-150px', opacity: 0.40 }} />
        <div className="orb orb-accent" style={{ width: 600, height: 600, bottom: '-150px', left: '-100px', opacity: 0.35, animationDelay: '-5s' }} />
        <div className="orb orb-sky"    style={{ width: 500, height: 500, top: '40%', left: '40%', opacity: 0.30, animationDelay: '-10s' }} />
        <div className="orb orb-purple" style={{ width: 600, height: 600, top: '60%', right: '10%', opacity: 0.25, animationDelay: '-15s' }} />
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <NavBar onCTA={goGenerate} />

      {/* ═══════════════════════════
          HERO
         ═══════════════════════════ */}
      <section id="hero" style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #311042 100%)' }}>
        {/* GIF Background (All Devices - responsive) */}
        <img
          src="/Image_Animation_and_VFX_Generation.gif"
          alt=""
          aria-hidden="true"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', zIndex: 0, opacity: isDesktop ? 1 : 0.7 }}
        />

        {/* Bottom fade */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '180px', zIndex: 2, background: 'linear-gradient(to bottom, transparent, rgba(15,23,42,0.65))' }} />

        {/* Content */}
        <div className="hero-content" style={{ position: 'relative', zIndex: 3, textAlign: 'center', maxWidth: '820px', padding: '8rem 1.25rem 5rem', animation: 'fadeInUp 0.8s ease both' }}>

          {/* Headline */}
          <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', marginBottom: '2rem' }}>
            <span className="hero-headline" style={{ fontSize: 'clamp(2rem,7vw,4.8rem)', fontWeight: 900, color: 'white', textShadow: '0 4px 12px rgba(0,0,0,0.8), 0 8px 32px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.9)', letterSpacing: '-0.04em', lineHeight: 1.15 }}>
              Build Better Software,
            </span>
            <span className="hero-headline" style={{
              fontSize: 'clamp(2rem,7vw,4.8rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.15,
              background: 'linear-gradient(135deg,#60a5fa 0%,#22d3ee 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.8)) drop-shadow(0 2px 4px rgba(0,0,0,0.9)) drop-shadow(0 0 20px rgba(34,211,238,0.4))',
            }}>
              Faster with AI
            </span>
          </h1>

          {/* CTAs */}
          <div className="hero-ctas" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <button onClick={goGenerate} id="hero-cta"
              style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)', color: 'white', border: 'none', borderRadius: '14px', padding: '0.9rem 1.8rem', fontSize: '1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '7px', boxShadow: '0 4px 8px rgba(37,99,235,0.3), 0 16px 40px rgba(37,99,235,0.4)', transition: 'all 0.3s ease', whiteSpace: 'nowrap' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
            >
              <Zap size={17} /> Start Generating Free <ArrowRight size={17} />
            </button>
            <a href="#how-it-works"
              style={{ display: 'flex', alignItems: 'center', gap: '7px', color: 'white', fontSize: '0.95rem', fontWeight: 700, textDecoration: 'none', padding: '0.9rem 1.5rem', border: '1.5px solid rgba(255,255,255,0.3)', borderRadius: '14px', transition: 'all 0.2s', background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', whiteSpace: 'nowrap', textShadow: '0 2px 6px rgba(0,0,0,0.8), 0 1px 3px rgba(0,0,0,0.9)' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)'; e.currentTarget.style.background = 'rgba(255,255,255,0.22)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
            >
              See how it works <ChevronRight size={16} />
            </a>
          </div>

          {/* Subtitle */}
          <p style={{ fontSize: 'clamp(0.875rem,2.5vw,1.05rem)', color: 'rgba(255,255,255,0.95)', lineHeight: 1.6, maxWidth: '520px', margin: '0 auto', fontWeight: 500, textShadow: '0 2px 8px rgba(0,0,0,0.8), 0 4px 16px rgba(0,0,0,0.6), 0 1px 3px rgba(0,0,0,0.9)' }}>
            Describe your idea and get a <strong style={{ color: 'white', textShadow: '0 2px 8px rgba(0,0,0,0.9), 0 1px 3px rgba(0,0,0,1)' }}>complete architecture</strong> —
            DB schema, APIs, cost estimate, and roadmap.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════
          FEATURES
         ═══════════════════════════ */}
      <section id="features" style={{ padding: 'clamp(4rem,8vw,7rem) 1.25rem', position: 'relative', backgroundImage: 'url(/images/arch_design.png)', backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ display: 'inline-block', background: 'rgba(37,99,235,0.5)', backdropFilter: 'blur(8px)', border: '1px solid rgba(96,165,250,0.5)', borderRadius: '99px', padding: '5px 18px', fontSize: '0.75rem', fontWeight: 800, color: '#bfdbfe', letterSpacing: '0.1em', marginBottom: '1.2rem', textTransform: 'uppercase' }}>Features</span>
            <h2 style={{ fontSize: 'clamp(1.75rem,5vw,3rem)', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 1rem', color: '#ffffff', lineHeight: 1.1, textShadow: '0 3px 10px rgba(0,0,0,0.8), 0 6px 20px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.9)' }}>
              Everything You Need to Ship
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: 'clamp(0.9rem,2.5vw,1.1rem)', maxWidth: '520px', margin: '0 auto', fontWeight: 500, lineHeight: 1.7, textShadow: '0 2px 6px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.8)' }}>
              From idea to a fully specced, production-ready architecture in seconds.
            </p>
          </div>

          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '1rem' }}>
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title}
                  style={{
                    background: 'rgba(0, 0, 0, 0.45)',
                    backdropFilter: 'blur(14px)',
                    borderRadius: '1.25rem',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
                    cursor: 'default',
                    overflow: 'hidden'
                  }}
                  onMouseOver={e => cardHover(e, true)}
                  onMouseOut={e => cardHover(e, false)}
                >
                  <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                    <Icon size={21} color={f.color} />
                  </div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: '0 0 0.4rem', color: '#f1f5f9' }}>{f.title}</h3>
                  <p style={{ fontSize: '0.845rem', color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          HOW IT WORKS
         ═══════════════════════════ */}
      <section id="how-it-works" style={{ padding: 'clamp(4rem,8vw,7rem) 1.25rem', borderTop: '1px solid rgba(37,99,235,0.07)', borderBottom: '1px solid rgba(37,99,235,0.07)', backgroundImage: 'url(/images/db_schema.png)', backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ display: 'inline-block', background: 'rgba(6,182,212,0.35)', backdropFilter: 'blur(8px)', border: '1px solid rgba(34,211,238,0.4)', borderRadius: '99px', padding: '5px 18px', fontSize: '0.75rem', fontWeight: 800, color: '#67e8f9', letterSpacing: '0.1em', marginBottom: '1.2rem', textTransform: 'uppercase' }}>How It Works</span>
            <h2 style={{ fontSize: 'clamp(1.75rem,5vw,3rem)', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 1rem', color: '#ffffff', lineHeight: 1.1, textShadow: '0 3px 10px rgba(0,0,0,0.8), 0 6px 20px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.9)' }}>
              Three Steps to Production-Ready
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: 'clamp(0.9rem,2.5vw,1.1rem)', maxWidth: '460px', margin: '0 auto', fontWeight: 500, lineHeight: 1.7, textShadow: '0 2px 6px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.8)' }}>
              No complex setup. Describe, generate, and start building — that's it.
            </p>
          </div>

          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '1.25rem' }}>
            {STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div key={step.num}
                  style={{ background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(14px)', borderRadius: '1.5rem', padding: '2rem 1.5rem', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', textAlign: 'center', transition: 'all 0.3s ease', cursor: 'default' }}
                  onMouseOver={e => cardHover(e, true)}
                  onMouseOut={e => cardHover(e, false)}
                >
                  <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,#2563eb,#06b6d4)', borderRadius: '10px', padding: '4px 12px', fontSize: '0.7rem', fontWeight: 800, color: 'white', letterSpacing: '0.08em', marginBottom: '1.2rem' }}>
                    STEP {step.num}
                  </div>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.2rem', boxShadow: '0 4px 14px rgba(0,0,0,0.3)' }}>
                    <Icon size={22} color="#60a5fa" />
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.65rem', color: '#f1f5f9' }}>{step.title}</h3>
                  <p style={{ fontSize: '0.845rem', color: '#94a3b8', lineHeight: 1.65, margin: 0 }}>{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          TESTIMONIALS
         ═══════════════════════════ */}
      <section id="testimonials" style={{ padding: 'clamp(4rem,8vw,7rem) 1.25rem', backgroundImage: 'url(/images/code_gen.png)', backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <span style={{ display: 'inline-block', background: 'rgba(109,40,217,0.4)', backdropFilter: 'blur(8px)', border: '1px solid rgba(196,181,253,0.4)', borderRadius: '99px', padding: '5px 18px', fontSize: '0.75rem', fontWeight: 800, color: '#d8b4fe', letterSpacing: '0.1em', marginBottom: '1.2rem', textTransform: 'uppercase' }}>Testimonials</span>
            <h2 style={{ fontSize: 'clamp(1.75rem,5vw,3rem)', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 0.75rem', color: '#ffffff', lineHeight: 1.1, textShadow: '0 3px 10px rgba(0,0,0,0.8), 0 6px 20px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.9)' }}>
              Loved by Developers
            </h2>
            <p style={{ color: '#cbd5e1', fontSize: 'clamp(0.9rem,2.5vw,1.05rem)', margin: 0, fontWeight: 500, textShadow: '0 2px 6px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.8)' }}>Join thousands who ship faster with AI-generated architecture.</p>
          </div>

          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '1.25rem' }}>
            {TESTIMONIALS.map(t => (
              <div key={t.name}
                style={{ background: 'rgba(0, 0, 0, 0.45)', backdropFilter: 'blur(14px)', borderRadius: '1.5rem', padding: '1.75rem', border: '1px solid rgba(255, 255, 255, 0.12)', boxShadow: '0 4px 20px rgba(0,0,0,0.3)', transition: 'all 0.3s ease' }}
                onMouseOver={e => cardHover(e, true)}
                onMouseOut={e => cardHover(e, false)}
              >
                <div style={{ display: 'flex', gap: '2px', marginBottom: '1.1rem' }}>
                  {[...Array(t.stars)].map((_, i) => <Star key={i} size={13} fill="#fbbf24" color="#fbbf24" />)}
                </div>
                <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.75, margin: '0 0 1.25rem', fontStyle: 'italic' }}>
                  "{t.quote}"
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: t.avatar, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: '0.85rem', flexShrink: 0, boxShadow: `0 4px 10px ${t.avatar}55` }}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: '#f1f5f9', fontSize: '0.875rem' }}>{t.name}</div>
                    <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          CTA SECTION
         ═══════════════════════════ */}
      <section id="cta" style={{ padding: 'clamp(4rem,8vw,7rem) 1.25rem', borderTop: '1px solid rgba(37,99,235,0.1)', backgroundImage: 'url(/images/rest_api.png)', backgroundSize: 'cover', backgroundAttachment: 'fixed', backgroundPosition: 'center' }}>
        <div style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: '60px', height: '60px', borderRadius: '18px', background: 'linear-gradient(135deg,#2563eb,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.75rem', boxShadow: '0 8px 24px rgba(37,99,235,0.5)' }}>
            <Rocket size={26} color="white" />
          </div>
          <h2 style={{ fontSize: 'clamp(1.75rem,6vw,3.2rem)', fontWeight: 900, letterSpacing: '-0.04em', margin: '0 0 1.1rem', color: '#ffffff', lineHeight: 1.15, textShadow: '0 3px 12px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.9)' }}>
            Ready to Build Something{' '}
            <span style={{ color: '#60a5fa', textShadow: '0 3px 12px rgba(0,0,0,0.8), 0 6px 24px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.9), 0 0 30px rgba(96,165,250,0.3)' }}>Amazing?</span>
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: 'clamp(0.9rem,2.5vw,1.1rem)', margin: '0 0 2.25rem', lineHeight: 1.75, fontWeight: 500, textShadow: '0 2px 6px rgba(0,0,0,0.7), 0 1px 3px rgba(0,0,0,0.8)' }}>
            Join thousands of engineers who use ArchitechAI to ship faster, smarter, and with full confidence.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.1rem' }}>
            <button onClick={goGenerate} id="bottom-cta"
              style={{ background: 'linear-gradient(135deg,#2563eb,#06b6d4)', color: 'white', border: 'none', borderRadius: '16px', padding: '1rem 2.4rem', fontSize: '1.05rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '9px', boxShadow: '0 4px 8px rgba(37,99,235,0.3), 0 16px 40px rgba(37,99,235,0.45)', transition: 'all 0.3s ease', whiteSpace: 'nowrap' }}
              onMouseOver={e => { e.currentTarget.style.transform = 'translateY(-4px) scale(1.02)'; }}
              onMouseOut={e => { e.currentTarget.style.transform = 'translateY(0) scale(1)'; }}
            >
              <Zap size={19} /> Generate Your Architecture Now <ArrowRight size={19} />
            </button>

            <div className="cta-checks" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap', justifyContent: 'center' }}>
              {['No credit card required', 'Free to start', 'Results in seconds'].map(item => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#e2e8f0', fontSize: '0.845rem', fontWeight: 500 }}>
                  <CheckCircle size={14} color="#34d399" /> {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════
          FOOTER
         ═══════════════════════════ */}
      <footer style={{ padding: '2.5rem 1.25rem 1.75rem', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(5,10,20,0.95)', backdropFilter: 'blur(20px)', color: '#64748b', fontSize: '0.875rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {/* Logo & Brand */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '1.5rem' }}>
            <img src="/logo.jpg" alt="ArchitechAI" style={{ width: '32px', height: '32px', borderRadius: '8px', objectFit: 'contain', padding: '2px', background: 'rgba(255,255,255,0.1)' }} />
            <span style={{ fontWeight: 700, color: '#e2e8f0', fontSize: '1rem' }}>ArchitechAI</span>
          </div>

          {/* Developer Info */}
          <div className="footer-dev-info" style={{ background: 'rgba(37,99,235,0.08)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: '12px', padding: '1.25rem', marginBottom: '1.5rem', maxWidth: '500px', margin: '0 auto 1.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#60a5fa', letterSpacing: '0.05em', marginBottom: '0.75rem', textTransform: 'uppercase', textAlign: 'center' }}>
              Developed By
            </div>
            <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#e2e8f0', marginBottom: '0.5rem' }}>
                Irfan Shekh
              </div>
            </div>
            <div className="footer-contact" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
              <a href="mailto:irfanshaikh110805@gmail.com" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s', wordBreak: 'break-all' }}
                onMouseOver={e => e.currentTarget.style.color = '#60a5fa'}
                onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
              >
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>📧</span>
                <span style={{ textAlign: 'center' }}>irfanshaikh110805@gmail.com</span>
              </a>
              <a href="tel:+919964264412" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94a3b8', textDecoration: 'none', fontSize: '0.875rem', transition: 'color 0.2s' }}
                onMouseOver={e => e.currentTarget.style.color = '#60a5fa'}
                onMouseOut={e => e.currentTarget.style.color = '#94a3b8'}
              >
                <span style={{ fontSize: '1rem' }}>📱</span>
                +91 99642 64412
              </a>
            </div>
          </div>

          {/* Copyright */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.875rem' }}>
              © 2026 ArchitechAI · Built with ❤️ for developers
            </p>
          </div>
        </div>
      </footer>

      {/* ─── Keyframes + Responsive CSS ────────────────────── */}
      <style>{`
        @keyframes fadeInDown { from { opacity:0; transform:translateY(-16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeInUp   { from { opacity:0; transform:translateY(18px); }  to { opacity:1; transform:translateY(0); } }
        @keyframes orbFloat   { 0%,100% { transform:scale(1) translateY(0); } 50% { transform:scale(1.12) translateY(-20px); } }
        html { scroll-behavior: smooth; }

        /* ── Tablet (≤ 768px) ── */
        @media (max-width: 768px) {
          .nav-links-desktop { display: none !important; }
          .nav-cta-desktop   { display: none !important; }
          .nav-login-desktop { display: none !important; }
          .nav-signup-desktop { display: none !important; }
          .nav-badge-desktop { display: none !important; }
          .nav-hamburger     { display: flex !important; }

          .stats-grid        { grid-template-columns: repeat(2, 1fr) !important; }
          .features-grid     { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .steps-grid        { grid-template-columns: 1fr !important; max-width: 480px; margin: 0 auto; gap: 1rem !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .hero-content      { padding: 6rem 1.5rem 4rem !important; }
          
          /* Mobile video visibility - reduce opacity slightly */
          #hero img[aria-hidden="true"] { opacity: 0.7 !important; }
          
          /* Ensure section spacing */
          #features, #how-it-works, #testimonials, #cta {
            padding: 3.5rem 1.5rem !important;
          }
          
          /* Hero buttons full width on tablet */
          .hero-ctas { flex-direction: column !important; width: 100%; }
          .hero-ctas a,
          .hero-ctas button { width: 100%; max-width: 400px; }
          
          #hero-cta, #bottom-cta { 
            width: 100%; 
            max-width: 400px;
            justify-content: center !important; 
            font-size: 0.95rem !important;
            padding: 0.85rem 1.5rem !important;
            white-space: normal !important;
            text-align: center !important;
          }
        }

        /* ── Mobile (≤ 480px) ── */
        @media (max-width: 480px) {
          .features-grid     { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .stats-grid        { grid-template-columns: 1fr !important; }
          .steps-grid        { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
          
          .hero-ctas         { flex-direction: column !important; width: 100%; gap: 0.75rem !important; }
          .hero-ctas a,
          .hero-ctas button  { width: 100%; max-width: 100%; justify-content: center !important; }
          
          .hero-content      { 
            padding: 5rem 1.25rem 3rem !important; 
          }
          
          .hero-headline     { 
            font-size: 2rem !important; 
            line-height: 1.15 !important;
          }
          
          .hero-badge        { padding: 7px 14px !important; font-size: 0.7rem !important; }
          
          #hero-cta, #bottom-cta { 
            width: 100%; 
            max-width: 100%;
            justify-content: center !important; 
            font-size: 0.9rem !important;
            padding: 0.8rem 1.25rem !important;
            white-space: normal !important;
            text-align: center !important;
          }
          
          .cta-checks { 
            flex-direction: column !important;
            gap: 0.5rem !important; 
            align-items: center !important;
          }
          
          /* Sections padding */
          #features, #how-it-works, #testimonials, #cta {
            padding: 3rem 1.25rem !important;
          }
          
          /* Reduce orb sizes */
          .orb { opacity: 0.25 !important; }
          
          /* Footer mobile */
          footer { padding: 2rem 1.25rem 1.5rem !important; }
          
          .footer-dev-info { 
            padding: 1rem !important; 
            margin: 0 0.5rem 1rem !important;
            max-width: 100% !important;
          }
          
          .footer-contact a {
            font-size: 0.8rem !important;
            flex-wrap: wrap;
            justify-content: center;
          }
        }
      `}</style>

      {/* 🤖 Mascot */}
      <Mascot />
      </div>
    </div>
  );
}
