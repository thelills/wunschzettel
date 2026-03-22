// Premium animated gift box — CSS only, no external deps
export default function GiftHero() {
  const items = [
    { emoji:'💎', angle:-60, dist:170, delay:.5,  size:'1.8rem' },
    { emoji:'✈️', angle:-25, dist:185, delay:.62, size:'1.7rem' },
    { emoji:'⌚', angle: 10, dist:178, delay:.74, size:'1.8rem' },
    { emoji:'💐', angle: 45, dist:168, delay:.56, size:'1.6rem' },
    { emoji:'🍾', angle:-85, dist:155, delay:.8,  size:'1.5rem' },
    { emoji:'📱', angle: 75, dist:160, delay:.68, size:'1.6rem' },
  ]

  return (
    <div style={{ position:'relative', width:260, height:260, margin:'0 auto 0', flexShrink:0 }}>
      <style>{`
        @keyframes dw-lid {
          0%   { transform:translateX(-50%) translateY(0)    rotateX(0deg); }
          40%  { transform:translateX(-50%) translateY(-28px) rotateX(-28deg); }
          100% { transform:translateX(-50%) translateY(-26px) rotateX(-26deg); }
        }
        @keyframes dw-lid-float {
          0%,100% { transform:translateX(-50%) translateY(-26px) rotateX(-26deg); }
          50%     { transform:translateX(-50%) translateY(-33px) rotateX(-28deg); }
        }
        @keyframes dw-glow {
          0%,100% { opacity:.5; transform:translate(-50%,-50%) scale(1); }
          50%     { opacity:.9; transform:translate(-50%,-50%) scale(1.2); }
        }
        @keyframes dw-fly {
          0%   { opacity:0; transform:translate(-50%,-50%) translate(0,0) scale(.2); }
          20%  { opacity:1; }
          80%  { opacity:1; }
          100% { opacity:0; transform:translate(-50%,-50%) translate(var(--ex),var(--ey)) scale(1); }
        }
        @keyframes dw-bob {
          0%,100% { transform:translate(-50%,-50%) translate(var(--ex),var(--ey)) scale(1); }
          50%     { transform:translate(-50%,-50%) translate(calc(var(--ex)*1.06),calc(var(--ey)*1.06)) scale(1.08); }
        }
        @keyframes dw-shine {
          0%   { opacity:0; transform:translateX(-100%); }
          50%  { opacity:.4; }
          100% { opacity:0; transform:translateX(200%); }
        }
      `}</style>

      {/* Glow */}
      <div style={{ position:'absolute', top:'58%', left:'50%', width:140, height:80, borderRadius:'50%', background:'radial-gradient(ellipse,rgba(255,255,255,.12) 0%,transparent 70%)', transform:'translate(-50%,-50%)', animation:'dw-glow 2.8s ease-in-out 1s infinite', pointerEvents:'none' }} />

      {/* Flying emoji items */}
      {items.map((it, i) => {
        const r = it.angle * Math.PI / 180
        const ex = `${Math.round(Math.cos(r) * it.dist)}px`
        const ey = `${Math.round(-Math.sin(r) * it.dist * .85)}px`
        return (
          <div key={i} style={{
            position:'absolute', top:'55%', left:'50%',
            fontSize: it.size, lineHeight:1,
            '--ex': ex, '--ey': ey,
            animation: `dw-fly .65s cubic-bezier(.15,1.4,.4,1) ${it.delay}s both, dw-bob 2.8s ease-in-out ${it.delay+.65}s infinite`,
            pointerEvents:'none', userSelect:'none',
          }}>{it.emoji}</div>
        )
      })}

      {/* Box body */}
      <div style={{
        position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)',
        width:108, height:76,
        background:'linear-gradient(160deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',
        borderRadius:10,
        boxShadow:'0 12px 40px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.08), inset 0 1px 0 rgba(255,255,255,.12)',
        overflow:'hidden',
      }}>
        {/* Shine sweep */}
        <div style={{ position:'absolute', inset:0, background:'linear-gradient(105deg,transparent 30%,rgba(255,255,255,.15) 50%,transparent 70%)', animation:'dw-shine 3s ease-in-out 1.5s infinite', borderRadius:10 }} />
        {/* Ribbon V */}
        <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', width:14, top:0, bottom:0, background:'rgba(255,255,255,.1)', borderRadius:2 }} />
        {/* Ribbon H */}
        <div style={{ position:'absolute', top:'50%', transform:'translateY(-50%)', left:0, right:0, height:14, background:'rgba(255,255,255,.1)', borderRadius:2 }} />
      </div>

      {/* Box lid */}
      <div style={{
        position:'absolute', bottom:96, left:'50%',
        width:120, height:32, transformOrigin:'50% 100%',
        animation:'dw-lid .7s cubic-bezier(.4,0,.2,1) .2s both, dw-lid-float 2.8s ease-in-out .95s infinite',
      }}>
        <div style={{
          width:'100%', height:'100%',
          background:'linear-gradient(160deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)',
          borderRadius:'10px 10px 4px 4px',
          boxShadow:'0 -6px 24px rgba(0,0,0,.4), 0 0 0 1px rgba(255,255,255,.08), inset 0 1px 0 rgba(255,255,255,.15)',
          overflow:'hidden', position:'relative',
        }}>
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(105deg,transparent 30%,rgba(255,255,255,.12) 50%,transparent 70%)', animation:'dw-shine 3s ease-in-out 2s infinite' }} />
          {/* Ribbon V on lid */}
          <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', width:14, top:0, bottom:0, background:'rgba(255,255,255,.1)', borderRadius:2 }} />
        </div>
        {/* Bow */}
        <div style={{ position:'absolute', top:-20, left:'50%', transform:'translateX(-50%)', fontSize:'1.4rem', lineHeight:1, filter:'drop-shadow(0 2px 8px rgba(0,0,0,.4))' }}>🎀</div>
      </div>
    </div>
  )
}
