/**
 * AnimatedHeroVisual.jsx
 * A fully CSS-animated Neo-Brutalist architecture diagram visual for the hero section.
 * Uses 2-3px solid black borders, hard unblurred offset shadows, and high-vis accents.
 */

export default function AnimatedHeroVisual() {
  const card = (style, children) => (
    <div style={{
      background: '#FFFFFF',
      border: '2.5px solid #000000',
      boxShadow: '4px 4px 0px 0px #000000',
      padding: '12px 14px',
      position: 'absolute',
      fontFamily: 'Space Mono, monospace',
      ...style,
    }}>
      {children}
    </div>
  );

  const dot = (color) => (
    <span style={{ width: 8, height: 8, background: color, border: '1px solid #000000', display: 'inline-block', flexShrink: 0 }} />
  );

  const row = (label, value, color = '#000000') => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
      {dot(color)}
      <span style={{ fontSize: '0.7rem', color: '#000000', fontWeight: 700, flex: 1 }}>{label}</span>
      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#444444', fontFamily: 'monospace' }}>{value}</span>
    </div>
  );

  return (
    <div style={{ position: 'relative', width: '100%', maxWidth: '520px', height: '420px', margin: '0 auto' }}>

      {/* ── Central Architecture Diagram Card ── */}
      {card({
        width: '270px', left: '50%', top: '50%',
        transform: 'translate(-50%,-50%)',
        zIndex: 5,
        animation: 'floatCenter 5s ease-in-out infinite',
        padding: '16px',
        background: '#FFFFFF',
        border: '3px solid #000000',
        boxShadow: '6px 6px 0px 0px #000000',
      },
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '2px solid #000000', paddingBottom: 8, marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 22, height: 22, background: '#00FF00', border: '1.5px solid #000000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '10px', fontWeight: 900 }}>⚡</span>
              </div>
              <span style={{ fontSize: '0.8rem', fontWeight: 900, color: '#000000', textTransform: 'uppercase' }}>SYSTEM TOPOLOGY</span>
            </div>
            <span style={{ background: '#FFE600', border: '1px solid #000', fontSize: '9px', fontWeight: 900, padding: '1px 4px' }}>LIVE</span>
          </div>

          {/* Architecture node graph (Brutalist) */}
          <svg width="234" height="100" viewBox="0 0 234 100" fill="none">
            {/* Hard solid lines */}
            <line x1="40" y1="20" x2="117" y2="50" stroke="#000000" strokeWidth="2"/>
            <line x1="194" y1="20" x2="117" y2="50" stroke="#000000" strokeWidth="2"/>
            <line x1="117" y1="50" x2="40" y2="82" stroke="#000000" strokeWidth="2"/>
            <line x1="117" y1="50" x2="194" y2="82" stroke="#000000" strokeWidth="2"/>
            
            {/* Main node */}
            <rect x="99" y="32" width="36" height="36" fill="#FFE600" stroke="#000000" strokeWidth="2"/>
            <text x="117" y="54" textAnchor="middle" fontSize="10" fill="#000000" fontWeight="900" fontFamily="Space Mono">API</text>
            
            {/* Child nodes */}
            <rect x="22" y="5" width="36" height="30" fill="#00FF00" stroke="#000000" strokeWidth="2"/>
            <text x="40" y="24" textAnchor="middle" fontSize="9" fill="#000000" fontWeight="900" fontFamily="Space Mono">DB</text>
            
            <rect x="176" y="5" width="36" height="30" fill="#00FFFF" stroke="#000000" strokeWidth="2"/>
            <text x="194" y="24" textAnchor="middle" fontSize="9" fill="#000000" fontWeight="900" fontFamily="Space Mono">REDIS</text>
            
            <rect x="22" y="67" width="36" height="30" fill="#FF00FF" stroke="#000000" strokeWidth="2"/>
            <text x="40" y="86" textAnchor="middle" fontSize="9" fill="#FFFFFF" fontWeight="900" fontFamily="Space Mono">AUTH</text>
            
            <rect x="176" y="67" width="36" height="30" fill="#FF5500" stroke="#000000" strokeWidth="2"/>
            <text x="194" y="86" textAnchor="middle" fontSize="9" fill="#FFFFFF" fontWeight="900" fontFamily="Space Mono">CDN</text>
          </svg>

          <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
            {['REST API','PostgreSQL','Redis','CloudFront'].map((t, i) => (
              <span key={t} style={{ fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', background: ['#FFE600','#00FF00','#00FFFF','#FF5500'][i], color: i === 3 ? '#FFFFFF' : '#000000', border: '1.5px solid #000000' }}>
                {t}
              </span>
            ))}
          </div>
        </>
      )}

      {/* ── DB Schema Card (top-left) ── */}
      {card({
        width: '175px', left: '-10px', top: '15px',
        animation: 'floatTL 6s ease-in-out infinite',
        zIndex: 4,
      },
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, borderBottom: '1.5px solid #000', paddingBottom: 4 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#000000' }}>[ DB SCHEMA ]</span>
          </div>
          {row('users', 'id, email, hash', '#00FF00')}
          {row('posts', 'id, author_id', '#FF00FF')}
          {row('orders', 'id, total, status', '#00FFFF')}
        </>
      )}

      {/* ── API Endpoints Card (top-right) ── */}
      {card({
        width: '180px', right: '-15px', top: '10px',
        animation: 'floatTR 7s ease-in-out infinite 1s',
        zIndex: 4,
      },
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, borderBottom: '1.5px solid #000', paddingBottom: 4 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#000000' }}>[ REST APIS ]</span>
          </div>
          {[['GET','/users','#00FF00'],['POST','/posts','#FF00FF'],['PUT','/users/:id','#FFE600'],['DEL','/posts/:id','#FF5500']].map(([m, p, c]) => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 3 }}>
              <span style={{ fontSize: '0.58rem', fontWeight: 900, padding: '1px 3px', border: '1px solid #000', background: c, color: (c === '#FF00FF' || c === '#FF5500') ? '#FFF' : '#000', minWidth: 32, textAlign: 'center' }}>{m}</span>
              <span style={{ fontSize: '0.66rem', color: '#000000', fontWeight: 700 }}>{p}</span>
            </div>
          ))}
        </>
      )}

      {/* ── Cost Estimation Card (bottom-left) ── */}
      {card({
        width: '170px', left: '0px', bottom: '20px',
        animation: 'floatBL 8s ease-in-out infinite 0.5s',
        zIndex: 4,
      },
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, borderBottom: '1.5px solid #000', paddingBottom: 4 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#000000' }}>[ CLOUD COST ]</span>
          </div>
          {[['EC2 micro','$18/mo'],['RDS db','$24/mo'],['CloudFront','$8/mo'],['TOTAL','$50/mo']].map(([l, v], i) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2, borderTop: i === 3 ? '1.5px solid #000' : 'none', paddingTop: i === 3 ? 3 : 0 }}>
              <span style={{ fontSize: '0.68rem', color: '#000000', fontWeight: i === 3 ? 900 : 600 }}>{l}</span>
              <span style={{ fontSize: '0.68rem', fontWeight: 900, color: i === 3 ? '#FF00FF' : '#000000' }}>{v}</span>
            </div>
          ))}
        </>
      )}

      {/* ── Tech Stack Card (bottom-right) ── */}
      {card({
        width: '165px', right: '-5px', bottom: '15px',
        animation: 'floatBR 6.5s ease-in-out infinite 1.5s',
        zIndex: 4,
      },
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6, borderBottom: '1.5px solid #000', paddingBottom: 4 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#000000' }}>[ STACK ]</span>
          </div>
          {[['UI','React + Vite','#FF00FF'],['API','Node.js + Express','#00FF00'],['DATA','PostgreSQL','#00FFFF'],['OPS','Docker + AWS','#FFE600']].map(([l, v, c]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#000' }}>{l}:</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 800, background: c, padding: '0px 4px', border: '1px solid #000', color: c === '#FF00FF' ? '#FFF' : '#000' }}>{v}</span>
            </div>
          ))}
        </>
      )}

      {/* ── Floating generation badge ── */}
      <div style={{
        position: 'absolute', top: '44%', right: '-25px', zIndex: 6,
        background: '#00FF00',
        border: '2.5px solid #000000',
        padding: '6px 10px',
        display: 'flex', alignItems: 'center', gap: 6,
        boxShadow: '3px 3px 0px 0px #000000',
        animation: 'badgeFloat 4s ease-in-out infinite 2s',
        whiteSpace: 'nowrap',
        fontFamily: 'Space Mono, monospace'
      }}>
        <div style={{ width: 8, height: 8, background: '#000000' }} />
        <span style={{ fontSize: '0.72rem', fontWeight: 900, color: '#000000' }}>COMPILED IN 3S ⚡</span>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes floatCenter {
          0%,100% { transform: translate(-50%,-50%) translateY(0px); }
          50%     { transform: translate(-50%,-50%) translateY(-6px); }
        }
        @keyframes floatTL {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-8px); }
        }
        @keyframes floatTR {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-6px); }
        }
        @keyframes floatBL {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-9px); }
        }
        @keyframes floatBR {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-7px); }
        }
        @keyframes badgeFloat {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-4px); }
        }
      `}</style>
    </div>
  );
}
