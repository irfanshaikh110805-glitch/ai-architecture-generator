/**
 * AnimatedHeroVisual.jsx
 * A fully CSS-animated 3D architecture diagram visual for the hero section.
 * Uses CSS transforms, keyframe animations, and glassmorphism — no libraries needed.
 */

export default function AnimatedHeroVisual() {
  const card = (style, children) => (
    <div style={{
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(37,99,235,0.12)',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(37,99,235,0.1), 0 2px 8px rgba(37,99,235,0.06)',
      padding: '14px 16px',
      position: 'absolute',
      ...style,
    }}>
      {children}
    </div>
  );

  const dot = (color) => (
    <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
  );

  const row = (label, value, color = '#2563eb') => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 5 }}>
      {dot(color)}
      <span style={{ fontSize: '0.72rem', color: '#64748b', flex: 1 }}>{label}</span>
      <span style={{ fontSize: '0.72rem', fontWeight: 700, color, fontFamily: 'monospace' }}>{value}</span>
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '520px', height: '420px', margin: '0 auto' }}>

      {/* ── Central Architecture Diagram Card ── */}
      {card({
        width: '260px', left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)',
        zIndex: 5,
        animation: 'floatCenter 5s ease-in-out infinite',
        padding: '18px',
      },
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#2563eb,#06b6d4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="14" height="14" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 12h18M12 3l9 9-9 9"/></svg>
            </div>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#0f172a' }}>System Architecture</span>
          </div>

          {/* Architecture node graph */}
          <svg width="224" height="100" viewBox="0 0 224 100" fill="none">
            {/* Lines */}
            <line x1="40" y1="20" x2="112" y2="50" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="4 2"/>
            <line x1="184" y1="20" x2="112" y2="50" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="4 2"/>
            <line x1="112" y1="50" x2="40" y2="82" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="4 2"/>
            <line x1="112" y1="50" x2="184" y2="82" stroke="#bfdbfe" strokeWidth="1.5" strokeDasharray="4 2"/>
            {/* Main node */}
            <circle cx="112" cy="50" r="18" fill="#eff6ff" stroke="#2563eb" strokeWidth="2"/>
            <text x="112" y="54" textAnchor="middle" fontSize="8" fill="#2563eb" fontWeight="700">API</text>
            {/* Child nodes */}
            <circle cx="40" cy="20" r="13" fill="#ecfdf5" stroke="#059669" strokeWidth="1.5"/>
            <text x="40" y="24" textAnchor="middle" fontSize="7" fill="#059669" fontWeight="700">DB</text>
            <circle cx="184" cy="20" r="13" fill="#ecfeff" stroke="#0891b2" strokeWidth="1.5"/>
            <text x="184" y="24" textAnchor="middle" fontSize="7" fill="#0891b2" fontWeight="700">Cache</text>
            <circle cx="40" cy="82" r="13" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="1.5"/>
            <text x="40" y="86" textAnchor="middle" fontSize="7" fill="#7c3aed" fontWeight="700">Auth</text>
            <circle cx="184" cy="82" r="13" fill="#fffbeb" stroke="#d97706" strokeWidth="1.5"/>
            <text x="184" y="86" textAnchor="middle" fontSize="7" fill="#d97706" fontWeight="700">CDN</text>
            {/* Animated pulse on main node */}
            <circle cx="112" cy="50" r="18" fill="none" stroke="#2563eb" strokeWidth="1" opacity="0.5">
              <animate attributeName="r" values="18;28;18" dur="2.5s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.5;0;0.5" dur="2.5s" repeatCount="indefinite"/>
            </circle>
          </svg>

          <div style={{ display: 'flex', gap: 6, marginTop: 10 }}>
            {['REST API','PostgreSQL','Redis','CloudFront'].map((t, i) => (
              <span key={t} style={{ fontSize: '0.62rem', fontWeight: 600, padding: '2px 6px', borderRadius: 6, background: ['#eff6ff','#ecfdf5','#ecfeff','#fffbeb'][i], color: ['#2563eb','#059669','#0891b2','#d97706'][i], border: `1px solid ${['#bfdbfe','#6ee7b7','#67e8f9','#fcd34d'][i]}` }}>
                {t}
              </span>
            ))}
          </div>
        </>
      )}

      {/* ── DB Schema Card (top-left) ── */}
      {card({
        width: '170px', left: '-10px', top: '20px',
        animation: 'floatTL 6s ease-in-out infinite',
        zIndex: 4,
      },
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: '#ecfdf5', border: '1px solid #6ee7b7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" fill="none" stroke="#059669" strokeWidth="2" viewBox="0 0 24 24"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a' }}>DB Schema</span>
          </div>
          {row('users', 'id, name, email', '#059669')}
          {row('posts', 'id, userId, title', '#2563eb')}
          {row('comments', 'id, postId, body', '#7c3aed')}
        </>
      )}

      {/* ── API Endpoints Card (top-right) ── */}
      {card({
        width: '175px', right: '-15px', top: '15px',
        animation: 'floatTR 7s ease-in-out infinite 1s',
        zIndex: 4,
      },
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: '#ecfeff', border: '1px solid #67e8f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" fill="none" stroke="#0891b2" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a' }}>REST APIs</span>
          </div>
          {[['GET','/users','#059669'],['POST','/posts','#2563eb'],['PUT','/users/:id','#d97706'],['DELETE','/posts/:id','#dc2626']].map(([m, p, c]) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
              <span style={{ fontSize: '0.6rem', fontWeight: 800, padding: '1px 4px', borderRadius: 4, background: `${c}18`, color: c, fontFamily: 'monospace', minWidth: 36, textAlign: 'center' }}>{m}</span>
              <span style={{ fontSize: '0.68rem', color: '#475569', fontFamily: 'monospace' }}>{p}</span>
            </div>
          ))}
        </>
      )}

      {/* ── Cost Estimation Card (bottom-left) ── */}
      {card({
        width: '165px', left: '0px', bottom: '20px',
        animation: 'floatBL 8s ease-in-out infinite 0.5s',
        zIndex: 4,
      },
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: '#fef2f2', border: '1px solid #fca5a5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" fill="none" stroke="#dc2626" strokeWidth="2" viewBox="0 0 24 24"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a' }}>Cost / Month</span>
          </div>
          {[['EC2 t3.medium','$33'],['RDS postgres','$25'],['CloudFront','$12'],['Total','$70']].map(([l, v], i) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, borderTop: i === 3 ? '1px solid #f1f5f9' : 'none', paddingTop: i === 3 ? 4 : 0 }}>
              <span style={{ fontSize: '0.7rem', color: '#64748b' }}>{l}</span>
              <span style={{ fontSize: '0.7rem', fontWeight: i === 3 ? 800 : 600, color: i === 3 ? '#dc2626' : '#0f172a' }}>{v}</span>
            </div>
          ))}
        </>
      )}

      {/* ── Tech Stack Card (bottom-right) ── */}
      {card({
        width: '160px', right: '-5px', bottom: '15px',
        animation: 'floatBR 6.5s ease-in-out infinite 1.5s',
        zIndex: 4,
      },
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
            <div style={{ width: 20, height: 20, borderRadius: 6, background: '#f5f3ff', border: '1px solid #c4b5fd', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="10" height="10" fill="none" stroke="#7c3aed" strokeWidth="2" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0f172a' }}>Tech Stack</span>
          </div>
          {[['Frontend','React + Vite','#2563eb'],['Backend','Node.js + Express','#059669'],['Database','PostgreSQL','#0891b2'],['Deploy','AWS / Vercel','#7c3aed']].map(([l, v, c]) => (
            <div key={l} style={{ marginBottom: 5 }}>
              <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginBottom: 1 }}>{l}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: 600, color: c }}>{v}</div>
            </div>
          ))}
        </>
      )}

      {/* ── Floating generation badge ── */}
      <div style={{
        position: 'absolute', top: '46%', right: '-30px', zIndex: 6,
        background: 'linear-gradient(135deg,#2563eb,#06b6d4)',
        borderRadius: '12px', padding: '8px 12px',
        display: 'flex', alignItems: 'center', gap: 6,
        boxShadow: '0 8px 24px rgba(37,99,235,0.35)',
        animation: 'badgeFloat 4s ease-in-out infinite 2s',
        whiteSpace: 'nowrap',
      }}>
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', boxShadow: '0 0 6px #34d399', animation: 'blink 1.2s ease-in-out infinite' }} />
        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'white' }}>Generated in 8s ✨</span>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes floatCenter {
          0%,100% { transform: translate(-50%,-50%) translateY(0px);   }
          50%      { transform: translate(-50%,-50%) translateY(-10px);  }
        }
        @keyframes floatTL {
          0%,100% { transform: translateY(0px) rotate(-1deg);  }
          50%      { transform: translateY(-12px) rotate(1deg); }
        }
        @keyframes floatTR {
          0%,100% { transform: translateY(0px) rotate(1deg);   }
          50%      { transform: translateY(-8px) rotate(-1deg); }
        }
        @keyframes floatBL {
          0%,100% { transform: translateY(0px) rotate(1deg);    }
          50%      { transform: translateY(-14px) rotate(-1deg); }
        }
        @keyframes floatBR {
          0%,100% { transform: translateY(0px) rotate(-1deg);  }
          50%      { transform: translateY(-10px) rotate(1deg); }
        }
        @keyframes badgeFloat {
          0%,100% { transform: translateY(0px) scale(1);    }
          50%      { transform: translateY(-6px) scale(1.03); }
        }
        @keyframes blink {
          0%,100% { opacity: 1; }
          50%      { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
