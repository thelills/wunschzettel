import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEffect } from 'react'

const REVIEWS = [
  { text: 'Endlich keine peinlichen „Was wünschst du dir eigentlich?"-Gespräche mehr. Meine Familie war begeistert.', name: 'Emma K.', occasion: 'Hochzeit 2024' },
  { text: 'Die KI-Vorschläge haben mir in 2 Minuten genau das gegeben was ich mir nicht selbst ausdenken konnte.', name: 'Marcus T.', occasion: 'Geburtstag 2024' },
  { text: 'Gruppengeschenk für den Kinderwagen — zwölf Leute koordiniert ohne einen Euro anzufassen.', name: 'Laura & Ben', occasion: 'Babyparty 2024' },
]

const FEATURES = [
  { icon: '✦', title: 'KI-Geschenkberater', body: 'Keine Ideen? Die KI schlägt passende Wünsche vor — nach Anlass, Alter und Budget. Sofort.' },
  { icon: '◎', title: 'Keine Doppelkäufe', body: 'Schenkende reservieren Wünsche — für andere unsichtbar. Die Überraschung bleibt garantiert.' },
  { icon: '◈', title: 'Sammlungen', body: 'Ideen das ganze Jahr sammeln — für Papa, die beste Freundin, für dich.' },
  { icon: '⟡', title: 'Gruppengeschenke', body: 'Teure Wünsche gemeinsam erfüllen — ohne Geld einzusammeln.' },
  { icon: '◻', title: 'Gäste ohne App', body: 'Schenkende brauchen kein Konto. Einfach den Link öffnen — fertig.' },
  { icon: '○', title: 'Kostenlos & werbefrei', body: 'Kein Abo, keine Werbung. Finanziert durch Affiliate-Links beim Kauf.' },
]

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => { if (user) navigate('/dashboard') }, [user])
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const goReg = () => navigate('/register')
  const goDemo = () => document.getElementById('ln-steps')?.scrollIntoView({ behavior: 'smooth' })

  const btnW = { fontFamily:"'Geist',system-ui,sans-serif", fontSize:'.9rem', fontWeight:600, padding:'13px 28px', borderRadius:100, border:'none', cursor:'pointer', background:'#fff', color:'#09090b', display:'inline-flex', alignItems:'center', gap:6, transition:'all .2s', whiteSpace:'nowrap' }
  const btnO = { fontFamily:"'Geist',system-ui,sans-serif", fontSize:'.9rem', fontWeight:500, padding:'13px 22px', borderRadius:100, cursor:'pointer', background:'transparent', color:'rgba(255,255,255,.75)', border:'1px solid rgba(255,255,255,.22)', transition:'all .2s', whiteSpace:'nowrap' }

  return (
    <div style={{ background:'#09090b', overflowX:'hidden', fontFamily:"'Geist',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Geist:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        @keyframes fadein{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes scalein{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:scale(1)}}
        .ln-hero-img{animation:scalein 1.2s cubic-bezier(.4,0,.2,1) both}
        .ln-hero-text{animation:fadein .8s cubic-bezier(.4,0,.2,1) .3s both}
        .ln-hero-cta{animation:fadein .8s cubic-bezier(.4,0,.2,1) .55s both}
      `}</style>

      {/* ── NAV ── */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', height:60, background: scrolled ? 'rgba(9,9,11,.92)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,.07)' : 'none', transition:'all .35s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width:28, height:28, borderRadius:7, background:'linear-gradient(135deg,#fff 0%,#d4d4dc 35%,#f8f8fc 65%,#c0c0cc 100%)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5C7 1.5 3 3.2 3 7c0 2.2 1.8 4 4 4s4-1.8 4-4C11 3.2 7 1.5 7 1.5z" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round"/><path d="M7 5.5v5" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontSize:'1rem', fontWeight:600, color:'#fff', letterSpacing:'-.025em' }}>Dein Wunsch</span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => navigate('/login')} style={{ ...btnO, padding:'7px 16px', fontSize:'.8rem' }}>Anmelden</button>
          <button onClick={goReg} style={{ ...btnW, padding:'7px 16px', fontSize:'.8rem' }}>Kostenlos starten</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position:'relative', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden' }}>
        {/* Background: deep gradient + floating gift boxes SVG pattern */}
        <div className="ln-hero-img" style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#0f0f1a 0%,#1a0f2e 30%,#0f1a2e 60%,#0a0a0f 100%)' }} />

        {/* Decorative blobs */}
        <div style={{ position:'absolute', top:'15%', left:'10%', width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(99,102,241,.18) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:'20%', right:'8%', width:320, height:320, borderRadius:'50%', background:'radial-gradient(circle,rgba(139,92,246,.12) 0%,transparent 70%)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', top:'40%', right:'20%', width:200, height:200, borderRadius:'50%', background:'radial-gradient(circle,rgba(236,72,153,.08) 0%,transparent 70%)', pointerEvents:'none' }} />

        {/* Floating emoji gifts */}
        {[
          { e:'🎁', x:'8%', y:'20%', s:2.4, op:.18 },
          { e:'🎀', x:'88%', y:'15%', s:1.8, op:.14 },
          { e:'💍', x:'5%', y:'65%', s:1.6, op:.12 },
          { e:'🎂', x:'92%', y:'60%', s:2, op:.15 },
          { e:'🍾', x:'15%', y:'80%', s:1.5, op:.1 },
          { e:'⭐', x:'82%', y:'82%', s:1.4, op:.1 },
        ].map((f,i) => (
          <div key={i} style={{ position:'absolute', left:f.x, top:f.y, fontSize:`${f.s}rem`, opacity:f.op, pointerEvents:'none', userSelect:'none' }}>{f.e}</div>
        ))}

        {/* Subtle grid lines */}
        <div style={{ position:'absolute', inset:0, backgroundImage:'linear-gradient(rgba(255,255,255,.025) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.025) 1px,transparent 1px)', backgroundSize:'80px 80px', pointerEvents:'none' }} />

        {/* Bottom fade */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:200, background:'linear-gradient(to bottom,transparent,#09090b)', pointerEvents:'none' }} />

        {/* Content */}
        <div style={{ position:'relative', textAlign:'center', padding:'100px 24px 80px', maxWidth:760, zIndex:1 }}>
          <div className="ln-hero-text">
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(99,102,241,.12)', border:'1px solid rgba(99,102,241,.25)', borderRadius:100, padding:'6px 16px', marginBottom:28 }}>
              <span style={{ fontSize:'.7rem', fontWeight:600, letterSpacing:'.12em', textTransform:'uppercase', color:'rgba(99,102,241,1)' }}>Kostenlos & werbefrei</span>
            </div>
            <h1 style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:'clamp(2.8rem,6.5vw,5.2rem)', fontWeight:400, color:'#fff', lineHeight:1.08, letterSpacing:'-.03em', marginBottom:24 }}>
              Schluss mit<br />falschen Geschenken —<br /><em style={{ fontStyle:'italic', color:'rgba(255,255,255,.45)' }}>für immer.</em>
            </h1>
            <p style={{ fontSize:'1.1rem', color:'rgba(255,255,255,.6)', lineHeight:1.7, fontWeight:300, maxWidth:520, margin:'0 auto 36px' }}>
              Erstelle deinen Wunschzettel in 3 Minuten. Teile ihn per Link. Erhalte endlich Geschenke die du wirklich willst.
            </p>
          </div>
          <div className="ln-hero-cta" style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
            <button style={btnW} onClick={goReg}>Jetzt kostenlos starten →</button>
            <button style={btnO} onClick={goDemo}>Wie es funktioniert</button>
          </div>
          <div style={{ display:'flex', gap:20, justifyContent:'center', marginTop:28, flexWrap:'wrap' }}>
            {['Kostenlos','Keine App nötig','DSGVO konform','Keine Werbung'].map(t => (
              <span key={t} style={{ fontSize:'.74rem', color:'rgba(255,255,255,.28)', display:'flex', alignItems:'center', gap:5 }}>
                <span style={{ color:'#6366f1' }}>✓</span>{t}
              </span>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{ position:'absolute', bottom:32, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, opacity:.35 }}>
          <svg width="16" height="24" viewBox="0 0 16 24" fill="none"><rect x="1" y="1" width="14" height="22" rx="7" stroke="white" strokeWidth="1.5"/><circle cx="8" cy="7" r="2" fill="white"><animate attributeName="cy" values="7;15;7" dur="1.8s" repeatCount="indefinite"/><animate attributeName="opacity" values="1;0;1" dur="1.8s" repeatCount="indefinite"/></circle></svg>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ padding:'100px 48px', background:'#09090b' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ fontSize:'.72rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(255,255,255,.3)', marginBottom:14 }}>Das Problem</div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(2rem,4vw,3rem)', color:'#fff', fontWeight:400, letterSpacing:'-.03em', marginBottom:12 }}>Kennst du das?</h2>
          <p style={{ color:'rgba(255,255,255,.45)', lineHeight:1.7, maxWidth:460, marginBottom:48 }}>Jedes Jahr dasselbe Theater. Dabei könnte Schenken so schön sein.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
            {[
              { icon:'😬', title:'„Was wünschst du dir eigentlich?"', body:'Diese Frage kommt immer — und jedes Mal weißt du nicht was du sagen sollst. Ergebnis: Geschenke die keiner braucht.' },
              { icon:'📦', title:'Dreimal dasselbe Geschenk', body:'Tante Helga, Oma und dein bester Freund kaufen alle dasselbe — weil niemand weiß was schon bestellt wurde.' },
              { icon:'🤷', title:'Schenken auf gut Glück', body:'Stunden gesucht, trotzdem falsche Farbe, falsche Größe. Geld verschenkt statt Freude gemacht.' },
            ].map(c => (
              <div key={c.title} style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, padding:28 }}>
                <div style={{ fontSize:'1.6rem', marginBottom:14 }}>{c.icon}</div>
                <div style={{ fontWeight:600, color:'rgba(255,255,255,.9)', marginBottom:8 }}>{c.title}</div>
                <div style={{ fontSize:'.84rem', color:'rgba(255,255,255,.4)', lineHeight:1.65 }}>{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section style={{ padding:'100px 48px', background:'#fff' }} id="ln-steps">
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ fontSize:'.72rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:'#a1a1aa', marginBottom:14 }}>So einfach geht's</div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(2rem,4vw,3rem)', color:'#09090b', fontWeight:400, letterSpacing:'-.03em', marginBottom:12 }}>3 Schritte zu mehr Freude<br />beim Schenken.</h2>
          <p style={{ color:'#71717a', lineHeight:1.7, maxWidth:460, marginBottom:56 }}>Kein Konto für Schenkende nötig. Kein Download. Einfach ein Link.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(220px,1fr))', gap:2 }}>
            {[
              { n:'01', title:'Liste erstellen', body:'Wähle einen Anlass. Füge Wünsche hinzu — manuell oder mit dem KI-Berater. Dauert 3 Minuten.' },
              { n:'02', title:'Link teilen', body:'Ein Link, fertig. Familie und Freunde öffnen ihn ohne App, ohne Konto — einfach im Browser.' },
              { n:'03', title:'Freude erleben', body:'Wünsche werden reserviert. Kein Doppelkauf. Du öffnest Geschenke die du wirklich willst.' },
            ].map((s,i) => (
              <div key={i} style={{ background:'#f4f4f5', padding:'36px 28px', borderRadius:i===0?'16px 0 0 16px':i===2?'0 16px 16px 0':0 }}>
                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:'3rem', color:'#e4e4e7', lineHeight:1, marginBottom:16 }}>{s.n}</div>
                <div style={{ fontWeight:600, color:'#09090b', marginBottom:8 }}>{s.title}</div>
                <div style={{ fontSize:'.84rem', color:'#71717a', lineHeight:1.65 }}>{s.body}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign:'center', marginTop:40 }}>
            <button onClick={goReg} style={{ ...btnW, background:'#09090b', color:'#fff' }}>Jetzt Liste erstellen →</button>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:'100px 48px', background:'#fff', borderTop:'1px solid #e4e4e7' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ fontSize:'.72rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:'#a1a1aa', marginBottom:14 }}>Features</div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(2rem,4vw,3rem)', color:'#09090b', fontWeight:400, letterSpacing:'-.03em', maxWidth:500, marginBottom:56 }}>Alles was du brauchst. Nichts was du nicht brauchst.</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:40 }}>
            {FEATURES.map(f => (
              <div key={f.title}>
                <div style={{ width:44, height:44, borderRadius:12, background:'#f4f4f5', border:'1px solid #e4e4e7', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', marginBottom:14 }}>{f.icon}</div>
                <div style={{ fontWeight:600, color:'#09090b', marginBottom:8 }}>{f.title}</div>
                <div style={{ fontSize:'.84rem', color:'#71717a', lineHeight:1.65 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section style={{ padding:'100px 48px', background:'#09090b' }}>
        <div style={{ maxWidth:1000, margin:'0 auto' }}>
          <div style={{ fontSize:'.72rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(255,255,255,.3)', marginBottom:14 }}>Stimmen</div>
          <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(2rem,4vw,3rem)', color:'#fff', fontWeight:400, letterSpacing:'-.03em', maxWidth:460, marginBottom:48 }}>Echte Menschen, echte Freude.</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
            {REVIEWS.map((r,i) => (
              <div key={i} style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, padding:24 }}>
                <div style={{ color:'#f59e0b', marginBottom:12, letterSpacing:2 }}>★★★★★</div>
                <p style={{ fontSize:'.88rem', color:'rgba(255,255,255,.75)', lineHeight:1.65, marginBottom:16, fontStyle:'italic' }}>„{r.text}"</p>
                <div style={{ fontSize:'.76rem', fontWeight:600, color:'rgba(255,255,255,.35)' }}>{r.name} · {r.occasion}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding:'120px 48px', background:'#09090b', borderTop:'1px solid rgba(255,255,255,.06)', textAlign:'center' }}>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(2.2rem,5vw,3.8rem)', color:'#fff', fontWeight:400, letterSpacing:'-.03em', marginBottom:16, lineHeight:1.1 }}>
          Bereit?<br /><em style={{ color:'rgba(255,255,255,.45)' }}>Fang heute an.</em>
        </h2>
        <p style={{ color:'rgba(255,255,255,.4)', marginBottom:36 }}>Kostenlos · Keine Kreditkarte · In 3 Minuten eingerichtet</p>
        <button onClick={goReg} style={{ ...btnW, padding:'14px 40px', fontSize:'.95rem' }}>Kostenlos starten →</button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,.06)', padding:'24px 48px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <span style={{ fontSize:'.74rem', color:'rgba(255,255,255,.2)' }}>© Dein Wunsch 2026 · Niklas Lill · Dachau</span>
        <div style={{ display:'flex', gap:20 }}>
          {[['Impressum','/impressum.html'],['Datenschutz','/datenschutz.html']].map(([l,h]) => (
            <a key={l} href={h} style={{ fontSize:'.74rem', color:'rgba(255,255,255,.2)', textDecoration:'none' }}>{l}</a>
          ))}
        </div>
      </footer>
    </div>
  )
}
