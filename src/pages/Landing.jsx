import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

// ── Apple-inspired, warm neutral palette ──
// Inspired by: floating luxury objects on white studio bg
// Colors: warm off-white, deep charcoal, gold accent, stone grey

const FEATURES = [
  { icon:'✦', title:'KI-Geschenkberater', body:'Sofort passende Vorschläge nach Anlass, Alter und Budget — keine leere Seite mehr.' },
  { icon:'◎', title:'Kein Doppelkauf', body:'Wünsche werden reserviert — für alle Schenkenden sichtbar, für dich unsichtbar.' },
  { icon:'◈', title:'Sammlungen', body:'Ideen übers Jahr sammeln — für Papa, die beste Freundin, für dich. Nie wieder improvisieren.' },
  { icon:'⟡', title:'Gruppengeschenke', body:'Teure Wünsche gemeinsam erfüllen — ohne Geld einzusammeln.' },
  { icon:'◻', title:'Gäste ohne App', body:'Schenkende brauchen kein Konto. Den Link öffnen — kaufen — fertig.' },
  { icon:'○', title:'Kostenlos & werbefrei', body:'Kein Abo, keine Werbung. Finanziert durch Affiliate-Links beim Kauf.' },
]

const REVIEWS = [
  { text:'Endlich keine peinlichen „Was wünschst du dir?"-Gespräche mehr. Meine Familie war begeistert.', name:'Emma K.', occ:'Hochzeit 2024' },
  { text:'Die KI-Vorschläge haben mir in 2 Minuten genau das gegeben was ich mir nicht ausdenken konnte.', name:'Marcus T.', occ:'Geburtstag 2024' },
  { text:'Gruppengeschenk für den Kinderwagen — zwölf Leute koordiniert ohne einen Euro anzufassen.', name:'Laura & Ben', occ:'Babyparty 2024' },
]

// Floating gift items — matches the photo aesthetic
function FloatingItems() {
  const items = [
    { emoji:'✈️', x:'-90px',  y:'-80px',  size:'2.6rem', delay:'0s',   rot:'-18deg' },
    { emoji:'🎧', x: '-70px', y:' 50px',  size:'2.2rem', delay:'.4s',  rot:'  8deg' },
    { emoji:'💎', x:  '85px', y:'-70px',  size:'2.0rem', delay:'.2s',  rot:' 15deg' },
    { emoji:'🌸', x:  '80px', y:' 50px',  size:'2.1rem', delay:'.6s',  rot:' -5deg' },
    { emoji:'⌚', x:'-100px', y:'  5px',  size:'1.8rem', delay:'.8s',  rot:'-12deg' },
    { emoji:'🍾', x:  '95px', y:' -5px',  size:'1.7rem', delay:'1.0s', rot:'  8deg' },
  ]
  return (
    <div style={{ position:'relative', width:200, height:200, margin:'0 auto 48px' }}>
      <style>{`
        @keyframes lp-float{0%,100%{transform:translate(var(--x),var(--y)) rotate(var(--r)) scale(1)}50%{transform:translate(calc(var(--x) + 4px),calc(var(--y) - 8px)) rotate(calc(var(--r) + 3deg)) scale(1.05)}}
        @keyframes lp-in{from{opacity:0;transform:translate(var(--x),var(--y)) rotate(var(--r)) scale(.4)}to{opacity:1;transform:translate(var(--x),var(--y)) rotate(var(--r)) scale(1)}}
      `}</style>
      {/* Center gift */}
      <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', fontSize:'4rem', filter:'drop-shadow(0 8px 24px rgba(0,0,0,.12))' }}>🎁</div>
      {items.map((it, i) => (
        <div key={i} style={{
          position:'absolute', top:'50%', left:'50%',
          fontSize: it.size,
          '--x': it.x, '--y': it.y, '--r': it.rot,
          animation:`lp-in .6s cubic-bezier(.2,1.4,.4,1) ${it.delay} both, lp-float ${2.4+i*.3}s ease-in-out ${it.delay} infinite`,
          filter:'drop-shadow(0 4px 12px rgba(0,0,0,.1))',
          userSelect:'none', pointerEvents:'none',
        }}>{it.emoji}</div>
      ))}
    </div>
  )
}

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => { if (user) navigate('/dashboard') }, [user])
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive:true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const go = path => navigate(path)

  // Apple-style button
  const btnPrimary = { display:'inline-flex', alignItems:'center', gap:6, padding:'12px 28px', borderRadius:100, border:'none', cursor:'pointer', background:'#1d1d1f', color:'#f5f5f7', fontSize:'.92rem', fontWeight:600, letterSpacing:'-.01em', fontFamily:'inherit', transition:'all .2s', whiteSpace:'nowrap' }
  const btnSecondary = { display:'inline-flex', alignItems:'center', gap:6, padding:'12px 24px', borderRadius:100, cursor:'pointer', background:'transparent', color:'#1d1d1f', border:'1.5px solid rgba(0,0,0,.18)', fontSize:'.92rem', fontWeight:500, letterSpacing:'-.01em', fontFamily:'inherit', transition:'all .2s', whiteSpace:'nowrap' }

  const warm = { bg:'#fafaf8', card:'#fff', border:'#ebebeb', text:'#1d1d1f', mid:'#6e6e73', muted:'#aeaeb2', accent:'#b07d4a' }

  return (
    <div style={{ background:warm.bg, color:warm.text, fontFamily:"-apple-system,'SF Pro Display','Geist',system-ui,sans-serif", overflowX:'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadein{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scaleup{from{opacity:0;transform:scale(.96)}to{opacity:1;transform:scale(1)}}
        .lp-animate{animation:fadein .7s ease .1s both}
        .lp-animate2{animation:fadein .7s ease .25s both}
        .lp-animate3{animation:fadein .7s ease .4s both}
        @media(max-width:640px){
          .lp-section{padding:72px 20px !important}
          .lp-hero-inner{padding:80px 20px 60px !important}
          .lp-steps{grid-template-columns:1fr !important}
          .lp-step:first-child{border-radius:16px !important}
          .lp-step:last-child{border-radius:16px !important}
          .lp-features{grid-template-columns:1fr 1fr !important;gap:28px !important}
          .lp-nav{padding:0 16px !important}
          .lp-hero-h1{font-size:clamp(2.4rem,8vw,4rem) !important}
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="lp-nav" style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 40px', height:52, background: scrolled ? 'rgba(250,250,248,.92)' : 'transparent', backdropFilter: scrolled ? 'saturate(180%) blur(20px)' : 'none', borderBottom: scrolled ? `1px solid ${warm.border}` : 'none', transition:'all .3s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer' }} onClick={() => go('/')}>
          <div style={{ width:26, height:26, borderRadius:7, background:'#1d1d1f', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <span style={{ fontSize:'1rem' }}>🎁</span>
          </div>
          <span style={{ fontSize:'.95rem', fontWeight:600, color:warm.text, letterSpacing:'-.02em' }}>Dein Wunsch</span>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <button onClick={() => go('/login')} style={{ ...btnSecondary, padding:'6px 16px', fontSize:'.8rem', border:'none', background:'transparent', color:warm.mid }}>Anmelden</button>
          <button onClick={() => go('/register')} style={{ ...btnPrimary, padding:'7px 18px', fontSize:'.8rem' }}>Kostenlos starten</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', position:'relative', background:`linear-gradient(180deg,${warm.bg} 0%,#f2f0ed 100%)`, overflow:'hidden' }}>
        {/* Subtle dot grid */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'radial-gradient(circle,rgba(0,0,0,.06) 1px,transparent 1px)', backgroundSize:'32px 32px', pointerEvents:'none', opacity:.6 }} />
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:160, background:`linear-gradient(transparent,${warm.bg})`, pointerEvents:'none' }} />

        <div className="lp-hero-inner" style={{ position:'relative', textAlign:'center', padding:'100px 40px 80px', maxWidth:720, zIndex:1 }}>
          <div className="lp-animate">
            <FloatingItems />
          </div>
          <div className="lp-animate2">
            <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(176,125,74,.1)', border:'1px solid rgba(176,125,74,.25)', borderRadius:100, padding:'5px 14px', marginBottom:20 }}>
              <span style={{ fontSize:'.68rem', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:warm.accent }}>Kostenlos · Werbefrei · DSGVO</span>
            </div>
            <h1 className="lp-hero-h1" style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:'clamp(2.8rem,5.5vw,4.8rem)', fontWeight:400, color:warm.text, lineHeight:1.07, letterSpacing:'-.03em', marginBottom:20 }}>
              Schluss mit Geschenken,<br />die keiner braucht.
            </h1>
            <p style={{ fontSize:'1.1rem', color:warm.mid, lineHeight:1.7, maxWidth:480, margin:'0 auto 36px', fontWeight:400 }}>
              Erstelle deinen Wunschzettel in 3 Minuten. Teile ihn per Link. Bekomme Geschenke, die du wirklich willst.
            </p>
          </div>
          <div className="lp-animate3" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button style={btnPrimary} onClick={() => go('/register')}>Jetzt kostenlos starten →</button>
            <button style={btnSecondary} onClick={() => document.getElementById('lp-steps')?.scrollIntoView({ behavior:'smooth' })}>Wie es funktioniert</button>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section className="lp-section" style={{ padding:'100px 60px', background:'#fff' }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ fontSize:'.7rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:warm.muted, marginBottom:14 }}>Das Problem</div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:warm.text, fontWeight:400, letterSpacing:'-.025em', marginBottom:12 }}>Kennst du das?</h2>
          <p style={{ color:warm.mid, lineHeight:1.7, maxWidth:420, marginBottom:48 }}>Jedes Jahr dasselbe Theater. Dabei könnte Schenken so schön sein.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:2 }}>
            {[
              { icon:'😬', title:'„Was wünschst du dir?"', body:'Diese Frage kommt immer — und jedes Mal weißt du nicht was du sagen sollst.' },
              { icon:'📦', title:'Dreimal dasselbe Geschenk', body:'Tante, Oma und Freund kaufen alle dasselbe — weil niemand weiß was schon bestellt wurde.' },
              { icon:'🤷', title:'Schenken auf gut Glück', body:'Stunden gesucht, trotzdem falsche Größe, falsche Farbe. Geld verschenkt statt Freude gemacht.' },
            ].map((c,i) => (
              <div key={i} style={{ background:warm.bg, padding:'32px 28px', borderRadius: i===0?'16px 0 0 16px':i===2?'0 16px 16px 0':0, borderRight:i<2?`1px solid ${warm.border}`:'none' }}>
                <div style={{ fontSize:'1.8rem', marginBottom:16 }}>{c.icon}</div>
                <div style={{ fontWeight:600, color:warm.text, marginBottom:8, fontSize:'.95rem' }}>{c.title}</div>
                <div style={{ fontSize:'.84rem', color:warm.mid, lineHeight:1.65 }}>{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section className="lp-section" style={{ padding:'100px 60px', background:warm.bg }} id="lp-steps">
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ fontSize:'.7rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:warm.muted, marginBottom:14 }}>So einfach geht's</div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:warm.text, fontWeight:400, letterSpacing:'-.025em', marginBottom:12 }}>3 Schritte zu echten Momenten.</h2>
          <p style={{ color:warm.mid, lineHeight:1.7, maxWidth:400, marginBottom:52 }}>Kein Konto für Schenkende. Kein Download. Einfach ein Link.</p>
          <div className="lp-steps" style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:2 }}>
            {[
              { n:'01', t:'Liste erstellen', b:'Wähle einen Anlass, füge Wünsche hinzu — manuell oder mit dem KI-Berater. Dauert 3 Minuten.' },
              { n:'02', t:'Link teilen', b:'Einen Link senden — Familie und Freunde öffnen ihn ohne App, ohne Konto, einfach im Browser.' },
              { n:'03', t:'Freude erleben', b:'Wünsche werden reserviert, kein Doppelkauf. Du öffnest Geschenke die du wirklich wolltest.' },
            ].map((s,i) => (
              <div key={i} className={`lp-step${i===0?' lp-step-first':i===2?' lp-step-last':''}`} style={{ background:'#fff', padding:'36px 28px', borderRadius:i===0?'16px 0 0 16px':i===2?'0 16px 16px 0':0, borderRight:i<2?`1px solid ${warm.border}`:'none' }}>
                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:'3.5rem', color:warm.border, lineHeight:1, marginBottom:16 }}>{s.n}</div>
                <div style={{ fontWeight:600, color:warm.text, marginBottom:8 }}>{s.t}</div>
                <div style={{ fontSize:'.84rem', color:warm.mid, lineHeight:1.65 }}>{s.b}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:40 }}>
            <button style={btnPrimary} onClick={() => go('/register')}>Jetzt Liste erstellen →</button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-section" style={{ padding:'100px 60px', background:'#fff', borderTop:`1px solid ${warm.border}` }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ fontSize:'.7rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:warm.muted, marginBottom:14 }}>Features</div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:warm.text, fontWeight:400, letterSpacing:'-.025em', maxWidth:460, marginBottom:52 }}>Alles was du brauchst. Nichts was du nicht brauchst.</h2>
          <div className="lp-features" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:48 }}>
            {FEATURES.map(f => (
              <div key={f.title}>
                <div style={{ width:40, height:40, borderRadius:10, background:warm.bg, border:`1px solid ${warm.border}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', marginBottom:14, color:warm.mid }}>{f.icon}</div>
                <div style={{ fontWeight:600, color:warm.text, marginBottom:8, fontSize:'.9rem' }}>{f.title}</div>
                <div style={{ fontSize:'.82rem', color:warm.mid, lineHeight:1.65 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section className="lp-section" style={{ padding:'100px 60px', background:warm.bg, borderTop:`1px solid ${warm.border}` }}>
        <div style={{ maxWidth:800, margin:'0 auto' }}>
          <div style={{ fontSize:'.7rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:warm.muted, marginBottom:14 }}>Vergleich</div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:warm.text, fontWeight:400, letterSpacing:'-.025em', marginBottom:40 }}>Besser als die Amazon-Liste.</h2>
          <div style={{ background:'#fff', borderRadius:16, border:`1px solid ${warm.border}`, overflow:'hidden' }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr style={{ borderBottom:`1px solid ${warm.border}` }}>
                  {['Feature','Dein Wunsch','Amazon Liste','Andere Apps'].map((h,i) => (
                    <th key={h} style={{ fontSize:'.72rem', fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:i===1?warm.text:warm.muted, padding:'14px 20px', textAlign:'left', background:i===1?warm.bg:'transparent', borderRight:i<3?`1px solid ${warm.border}`:'none' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['KI-Geschenkvorschläge',true,false,false],
                  ['Alle Online-Shops',true,false,true],
                  ['Gäste ohne Account',true,false,true],
                  ['Gruppengeschenke',true,false,false],
                  ['Sammlungen',true,false,false],
                  ['Keine Werbung',true,false,false],
                  ['Kostenlos',true,true,true],
                ].map(([feat,...vals],ri) => (
                  <tr key={feat} style={{ borderBottom:ri<6?`1px solid ${warm.border}`:'none' }}>
                    <td style={{ fontSize:'.84rem', color:warm.mid, padding:'12px 20px', borderRight:`1px solid ${warm.border}` }}>{feat}</td>
                    {vals.map((v,i) => (
                      <td key={i} style={{ padding:'12px 20px', background:i===0?warm.bg:'transparent', borderRight:i<2?`1px solid ${warm.border}`:'none', fontSize:'.95rem', color:v?'#22c55e':warm.border, fontWeight:v?700:400, textAlign:'left' }}>{v?'✓':'–'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section className="lp-section" style={{ padding:'100px 60px', background:'#fff', borderTop:`1px solid ${warm.border}` }}>
        <div style={{ maxWidth:960, margin:'0 auto' }}>
          <div style={{ fontSize:'.7rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:warm.muted, marginBottom:14 }}>Stimmen</div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(1.8rem,3.5vw,2.8rem)', color:warm.text, fontWeight:400, letterSpacing:'-.025em', maxWidth:440, marginBottom:48 }}>Echte Menschen, echte Freude.</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:16 }}>
            {REVIEWS.map((r,i) => (
              <div key={i} style={{ background:warm.bg, border:`1px solid ${warm.border}`, borderRadius:16, padding:24 }}>
                <div style={{ color:'#f59e0b', marginBottom:12, letterSpacing:2, fontSize:'.85rem' }}>★★★★★</div>
                <p style={{ fontSize:'.88rem', color:warm.mid, lineHeight:1.65, marginBottom:16, fontStyle:'italic' }}>„{r.text}"</p>
                <div style={{ fontSize:'.75rem', fontWeight:600, color:warm.muted }}>{r.name} · {r.occ}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="lp-section" style={{ padding:'120px 60px', background:warm.bg, borderTop:`1px solid ${warm.border}`, textAlign:'center' }}>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(2rem,4.5vw,3.6rem)', color:warm.text, fontWeight:400, letterSpacing:'-.03em', marginBottom:16, lineHeight:1.1 }}>
          Bereit für Geschenke,<br /><em style={{ fontStyle:'italic', color:warm.muted }}>die wirklich passen?</em>
        </h2>
        <p style={{ color:warm.mid, marginBottom:36, fontSize:'.95rem' }}>Kostenlos · Keine Kreditkarte · In 3 Minuten eingerichtet</p>
        <button style={{ ...btnPrimary, padding:'14px 36px', fontSize:'.95rem' }} onClick={() => go('/register')}>Kostenlos starten →</button>
        <div style={{ display:'flex', gap:20, justifyContent:'center', marginTop:24, flexWrap:'wrap' }}>
          {['Kostenlos für immer','Keine Kreditkarte','Keine Werbung','DSGVO konform'].map(t => (
            <span key={t} style={{ fontSize:'.74rem', color:warm.muted, display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ color:'#22c55e' }}>✓</span>{t}
            </span>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:`1px solid ${warm.border}`, padding:'20px 40px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, background:'#fff' }}>
        <span style={{ fontSize:'.74rem', color:warm.muted }}>© Dein Wunsch 2026 · Niklas Lill · Dachau</span>
        <div style={{ display:'flex', gap:20 }}>
          {[['Impressum','/impressum.html'],['Datenschutz','/datenschutz.html']].map(([l,h]) => (
            <a key={l} href={h} style={{ fontSize:'.74rem', color:warm.muted, textDecoration:'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
