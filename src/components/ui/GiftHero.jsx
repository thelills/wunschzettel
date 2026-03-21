export default function GiftHero() {
  const items = [
    { emoji:'💎', angle:-55, dist:180, delay:0,    size:2.2 },
    { emoji:'✈️', angle:-20, dist:200, delay:.08,  size:2.0 },
    { emoji:'⌚', angle: 15, dist:190, delay:.16,  size:2.1 },
    { emoji:'💐', angle: 50, dist:175, delay:.06,  size:1.9 },
    { emoji:'🍾', angle:-80, dist:160, delay:.2,   size:1.8 },
    { emoji:'📱', angle: 75, dist:165, delay:.12,  size:1.8 },
    { emoji:'👟', angle:-35, dist:210, delay:.24,  size:1.7 },
    { emoji:'🎸', angle: 35, dist:205, delay:.18,  size:1.9 },
  ]

  return (
    <div style={{ position:'relative', width:220, height:220, margin:'0 auto 8px', flexShrink:0 }}>
      <style>{`
        @keyframes boxOpen {
          0%   { transform: rotateX(0deg); }
          30%  { transform: rotateX(-35deg); }
          60%  { transform: rotateX(-40deg); }
          100% { transform: rotateX(-35deg); }
        }
        @keyframes lidFloat {
          0%,100% { transform: translateY(0) rotateX(-35deg); }
          50%     { transform: translateY(-8px) rotateX(-38deg); }
        }
        @keyframes glow {
          0%,100% { opacity:.6; transform:scale(1); }
          50%     { opacity:1;  transform:scale(1.15); }
        }
        @keyframes flyOut {
          0%   { opacity:0; transform:translate(0,0) scale(.3) rotate(0deg); }
          15%  { opacity:1; }
          70%  { opacity:1; }
          100% { opacity:0; transform:translate(var(--tx),var(--ty)) scale(1.1) rotate(var(--rot)); }
        }
        @keyframes floatBob {
          0%,100% { transform: translate(var(--tx),var(--ty)) scale(1) rotate(var(--rot)); }
          50%     { transform: translate(calc(var(--tx) + 4px), calc(var(--ty) - 6px)) scale(1.05) rotate(calc(var(--rot) + 5deg)); }
        }
        .gift-item {
          position:absolute; top:50%; left:50%;
          font-size:var(--sz);
          animation:
            flyOut .7s cubic-bezier(.2,1.4,.4,1) var(--dl) both,
            floatBob 3s ease-in-out calc(var(--dl) + .7s) infinite;
          transform-origin:center;
          pointer-events:none;
          line-height:1;
          margin:-0.5em 0 0 -0.5em;
        }
      `}</style>

      {/* Glow */}
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:160, height:160, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,.35) 0%,transparent 70%)', animation:'glow 2.5s ease-in-out 1s infinite', pointerEvents:'none' }} />

      {/* Flying items */}
      {items.map((item, i) => {
        const rad = (item.angle * Math.PI) / 180
        const tx = Math.cos(rad) * item.dist
        const ty = Math.sin(rad) * item.dist * -1
        const rot = item.angle * 0.3
        return (
          <div key={i} className="gift-item" style={{
            '--tx': `${tx}px`,
            '--ty': `${ty}px`,
            '--rot': `${rot}deg`,
            '--dl': `${item.delay + 0.4}s`,
            '--sz': `${item.size}rem`,
          }}>
            {item.emoji}
          </div>
        )
      })}

      {/* Box body */}
      <div style={{ position:'absolute', bottom:20, left:'50%', transform:'translateX(-50%)', width:110, height:80, borderRadius:12, background:'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)', boxShadow:'0 8px 32px rgba(79,70,229,.5), inset 0 1px 0 rgba(255,255,255,.2)' }}>
        {/* Ribbon vertical */}
        <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', width:16, top:0, bottom:0, background:'rgba(255,255,255,.2)', borderRadius:2 }} />
        {/* Ribbon horizontal */}
        <div style={{ position:'absolute', top:'50%', transform:'translateY(-50%)', left:0, right:0, height:16, background:'rgba(255,255,255,.2)', borderRadius:2 }} />
      </div>

      {/* Box lid */}
      <div style={{
        position:'absolute', bottom:92, left:'50%',
        width:124, height:36,
        transformOrigin:'bottom center',
        transform:'translateX(-50%)',
        animation:'boxOpen .6s cubic-bezier(.4,0,.2,1) .1s both, lidFloat 3s ease-in-out .8s infinite',
      }}>
        <div style={{ width:'100%', height:'100%', borderRadius:'10px 10px 4px 4px', background:'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)', boxShadow:'0 -4px 20px rgba(99,102,241,.4), inset 0 1px 0 rgba(255,255,255,.25)' }}>
          {/* Bow */}
          <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', fontSize:'1.6rem', lineHeight:1 }}>🎀</div>
        </div>
      </div>

      {/* Light burst from box */}
      <div style={{ position:'absolute', bottom:60, left:'50%', transform:'translateX(-50%)', width:60, height:60, borderRadius:'50%', background:'radial-gradient(circle,rgba(255,255,255,.3) 0%,transparent 70%)', animation:'glow 2s ease-in-out .5s infinite', pointerEvents:'none' }} />
    </div>
  )
}
