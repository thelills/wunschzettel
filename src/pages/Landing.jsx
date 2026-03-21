import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const REVIEWS = [
  { text: 'Endlich keine peinlichen „Was wünschst du dir eigentlich?"-Gespräche mehr. Meine Familie war begeistert.', name: 'Emma K.', occasion: 'Hochzeit 2024' },
  { text: 'Die KI-Vorschläge haben mir in 2 Minuten genau das gegeben was ich mir nicht selbst ausdenken konnte.', name: 'Marcus T.', occasion: 'Geburtstag 2024' },
  { text: 'Gruppengeschenk für den Kinderwagen — zwölf Leute koordiniert ohne einen Euro anzufassen.', name: 'Laura & Ben', occasion: 'Babyparty 2024' },
]

const STEPS = [
  { n: '01', title: 'Liste erstellen', body: 'Wähle einen Anlass. Füge Wünsche hinzu — manuell oder mit dem KI-Berater. Dauert 3 Minuten.' },
  { n: '02', title: 'Link teilen', body: 'Ein Link, fertig. Familie und Freunde öffnen ihn ohne App, ohne Konto — einfach im Browser.' },
  { n: '03', title: 'Freude erleben', body: 'Wünsche werden reserviert. Kein Doppelkauf. Du öffnest Geschenke die du wirklich willst.' },
]

const FEATURES = [
  { icon: '✦', title: 'KI-Geschenkberater', body: 'Keine Ideen? Die KI schlägt dir passende Wünsche vor — nach Anlass, Alter und Budget. Sofort.' },
  { icon: '◎', title: 'Keine Doppelkäufe', body: 'Schenkende reservieren Wünsche — für andere unsichtbar. Die Überraschung bleibt garantiert.' },
  { icon: '◈', title: 'Sammlungen', body: 'Ideen das ganze Jahr sammeln — für Papa, die beste Freundin, für dich. Nie mehr improvisiert schenken.' },
  { icon: '⟡', title: 'Gruppengeschenke', body: 'Teure Wünsche gemeinsam erfüllen — ohne Geld einzusammeln. Per Gutschein-Code, ohne Aufwand.' },
  { icon: '◻', title: 'Gäste ohne App', body: 'Schenkende brauchen kein Konto, keine App. Einfach den Link öffnen — und kaufen.' },
  { icon: '○', title: 'Kostenlos & werbefrei', body: 'Kein Abo, keine Werbung, kein Tracking. Finanziert durch Affiliate-Links beim Kauf.' },
]

const OCCASIONS = [
  { emoji: '💍', label: 'Hochzeit' }, { emoji: '🎂', label: 'Geburtstag' },
  { emoji: '🍼', label: 'Babyparty' }, { emoji: '🎄', label: 'Weihnachten' },
  { emoji: '🏠', label: 'Einzug' }, { emoji: '🎓', label: 'Abschluss' },
]

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const heroRef = useRef(null)
  const rafRef = useRef(null)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phase, setPhase] = useState(0) // 0=nothing, 1=title, 2=cta
  const [mobileCta, setMobileCta] = useState(false)
  const [videoReady, setVideoReady] = useState(false)

  useEffect(() => { if (user) navigate('/dashboard') }, [user])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // Preload video metadata
    video.load()

    const onReady = () => setVideoReady(true)
    video.addEventListener('loadedmetadata', onReady)
    video.addEventListener('canplay', onReady)

    function onScroll() {
      const hero = heroRef.current
      if (!hero) return
      const scrolled = window.scrollY
      const heroH = hero.offsetHeight - window.innerHeight
      const p = Math.min(Math.max(scrolled / heroH, 0), 1)

      setProgress(p * 100)
      setScrolled(scrolled > 20)
      setMobileCta(scrolled > window.innerHeight * 2.5)

      // Phase: 0=hidden, 1=title visible, 2=CTA visible
      if (p < 0.08) setPhase(0)
      else if (p < 0.55) setPhase(1)
      else if (p < 0.65) setPhase(0)
      else setPhase(2)

      // Direct video currentTime manipulation — no canvas, no CORS needed
      if (video.duration && !isNaN(video.duration)) {
        video.currentTime = p * video.duration
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      video.removeEventListener('loadedmetadata', onReady)
      video.removeEventListener('canplay', onReady)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const goReg = () => navigate('/register')
  const goDemo = () => document.getElementById('ln-steps')?.scrollIntoView({ behavior: 'smooth' })

  const btnW = { fontFamily:"'Geist',sans-serif", fontSize:'.9rem', fontWeight:600, padding:'13px 32px', borderRadius:100, border:'none', cursor:'pointer', background:'#fff', color:'#09090b', display:'inline-flex', alignItems:'center', gap:6, transition:'all .2s' }
  const btnO = { fontFamily:"'Geist',sans-serif", fontSize:'.9rem', fontWeight:500, padding:'13px 24px', borderRadius:100, cursor:'pointer', background:'transparent', color:'rgba(255,255,255,.8)', border:'1px solid rgba(255,255,255,.25)', transition:'all .2s' }
  const sec = (bg, pt=100, pb=100) => ({ padding:`${pt}px 48px ${pb}px`, background:bg, '@media(max-width:640px)':{padding:'60px 20px'} })
  const inner = { maxWidth:1000, margin:'0 auto' }
  const eyebrow = (dark) => ({ fontSize:'.72rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color: dark ? '#a1a1aa' : 'rgba(255,255,255,.35)', marginBottom:14 })
  const h2 = (dark) => ({ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:'clamp(2rem,4vw,3rem)', fontWeight:400, color: dark ? '#09090b' : '#fff', letterSpacing:'-.03em', lineHeight:1.15, marginBottom:12 })
  const lead = (dark) => ({ fontSize:'1rem', color: dark ? '#71717a' : 'rgba(255,255,255,.5)', lineHeight:1.7, maxWidth:480, marginBottom:48 })

  return (
    <div style={{ background:'#09090b', overflowX:'hidden' }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Geist:wght@300;400;500;600&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes dotsink{0%,100%{top:5px;opacity:1}70%{top:18px;opacity:0}}
        @keyframes fadein{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        body{font-family:'Geist',system-ui,sans-serif;margin:0}
        *{box-sizing:border-box}
      `}</style>

      {/* Progress bar */}
      <div style={{ position:'fixed', top:0, left:0, height:2, background:'linear-gradient(90deg,rgba(255,255,255,.15),rgba(255,255,255,.6))', width:progress+'%', zIndex:300, transition:'width .08s linear' }} />

      {/* Nav */}
      <nav style={{ position:'fixed', top:0, left:0, right:0, zIndex:200, display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 48px', height:60, background: scrolled ? 'rgba(9,9,11,.9)' : 'transparent', backdropFilter: scrolled ? 'blur(20px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,.07)' : '1px solid transparent', transition:'all .35s' }}>
        <div style={{ display:'flex', alignItems:'center', gap:9, cursor:'pointer' }} onClick={() => navigate('/')}>
          <div style={{ width:28, height:28, borderRadius:7, background:'linear-gradient(135deg,#fff 0%,#d4d4dc 35%,#f8f8fc 65%,#c0c0cc 100%)', display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 8px rgba(0,0,0,.4),inset 0 1px 0 rgba(255,255,255,.8)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5C7 1.5 3 3.2 3 7c0 2.2 1.8 4 4 4s4-1.8 4-4C11 3.2 7 1.5 7 1.5z" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round"/><path d="M7 5.5v5" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontSize:'1rem', fontWeight:600, color:'#fff', letterSpacing:'-.025em' }}>Dein Wunsch</span>
        </div>
        <div style={{ display:'flex', gap:8 }}>
          <button onClick={() => navigate('/login')} style={{ ...btnO, padding:'7px 16px', fontSize:'.8rem' }}>Anmelden</button>
          <button onClick={goReg} style={{ ...btnW, padding:'7px 16px', fontSize:'.8rem' }}>Kostenlos starten</button>
        </div>
      </nav>

      {/* ── HERO: Video scroll-scrubbing ── */}
      <section ref={heroRef} style={{ position:'relative', height:'550vh' }}>
        <div style={{ position:'sticky', top:0, height:'100vh', overflow:'hidden' }}>

          {/* Video — full screen, scroll-scrubbed via currentTime */}
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', display: videoReady ? 'block' : 'none' }}
          >
            <source src="/hero.mp4" type="video/mp4" />
          </video>

          {/* Fallback gradient when video not ready */}
          {!videoReady && (
            <div style={{ position:'absolute', inset:0, background:'linear-gradient(135deg,#1a1a2e 0%,#16213e 40%,#0f3460 70%,#533483 100%)' }} />
          )}

          {/* Overlay */}
          <div style={{ position:'absolute', inset:0, background:'linear-gradient(to bottom,rgba(0,0,0,.25) 0%,rgba(0,0,0,0) 30%,rgba(0,0,0,.65) 100%)', pointerEvents:'none' }} />

          {/* Title — Phase 1 */}
          {phase === 1 && (
            <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', textAlign:'center', width:'100%', maxWidth:820, padding:'0 24px', pointerEvents:'none', animation:'fadein .4s ease' }}>
              <div style={{ fontSize:'.72rem', fontWeight:600, letterSpacing:'.15em', textTransform:'uppercase', color:'rgba(255,255,255,.4)', marginBottom:20 }}>deinwunsch.app</div>
              <h1 style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:'clamp(2.8rem,6vw,5.2rem)', fontWeight:400, color:'#fff', lineHeight:1.08, letterSpacing:'-.03em', margin:0 }}>
                Schluss mit<br />falschen Geschenken —<br /><em style={{ fontStyle:'italic', color:'rgba(255,255,255,.55)' }}>für immer.</em>
              </h1>
            </div>
          )}

          {/* CTA — Phase 2 */}
          {phase === 2 && (
            <div style={{ position:'absolute', bottom:'14%', left:'50%', transform:'translateX(-50%)', textAlign:'center', width:'100%', maxWidth:560, padding:'0 24px', animation:'fadein .4s ease' }}>
              <p style={{ fontSize:'1.05rem', color:'rgba(255,255,255,.72)', lineHeight:1.7, fontWeight:300, marginBottom:32 }}>
                Erstelle deinen Wunschzettel in 3 Minuten. Teile ihn per Link. Erhalte endlich Geschenke die du wirklich willst.
              </p>
              <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                <button style={btnW} onClick={goReg}>Jetzt kostenlos starten →</button>
                <button style={btnO} onClick={goDemo}>Wie es funktioniert</button>
              </div>
            </div>
          )}

          {/* Scroll hint */}
          {phase === 0 && progress < 5 && (
            <div style={{ position:'absolute', bottom:28, left:'50%', transform:'translateX(-50%)', display:'flex', flexDirection:'column', alignItems:'center', gap:8, animation:'fadein .6s ease .8s both' }}>
              <span style={{ fontSize:'.65rem', fontWeight:600, letterSpacing:'.14em', textTransform:'uppercase', color:'rgba(255,255,255,.3)' }}>Scroll</span>
              <div style={{ width:22, height:38, border:'1.5px solid rgba(255,255,255,.18)', borderRadius:11, position:'relative' }}>
                <div style={{ width:4, height:8, background:'rgba(255,255,255,.4)', borderRadius:2, position:'absolute', left:'50%', transform:'translateX(-50%)', animation:'dotsink 1.8s ease-in-out infinite' }} />
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ padding:'100px 48px', background:'#09090b' }}>
        <div style={inner}>
          <div style={eyebrow(false)}>Das Problem</div>
          <h2 style={h2(false)}>Kennst du das?</h2>
          <p style={lead(false)}>Jedes Jahr dasselbe Theater. Dabei könnte Schenken so schön sein.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16 }}>
            {[
              { icon:'😬', title:'„Was wünschst du dir eigentlich?"', body:'Diese Frage kommt immer — und jedes Mal weißt du nicht was du sagen sollst. Das Ergebnis: Geschenke die keiner braucht.' },
              { icon:'📦', title:'Dreimal dasselbe Geschenk', body:'Tante Helga, Oma und dein bester Freund kaufen alle dasselbe — weil niemand weiß was schon bestellt wurde.' },
              { icon:'🤷', title:'Schenken auf gut Glück', body:'Stunden gesucht, trotzdem falsche Farbe, falsche Größe. Geld verschenkt statt Freude gemacht.' },
            ].map(c => (
              <div key={c.title} style={{ background:'rgba(255,255,255,.04)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, padding:28 }}>
                <div style={{ fontSize:'1.6rem', marginBottom:14 }}>{c.icon}</div>
                <div style={{ fontSize:'.95rem', fontWeight:600, color:'rgba(255,255,255,.9)', marginBottom:8 }}>{c.title}</div>
                <div style={{ fontSize:'.84rem', color:'rgba(255,255,255,.4)', lineHeight:1.65 }}>{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section style={{ padding:'100px 48px', background:'#fff' }} id="ln-steps">
        <div style={inner}>
          <div style={eyebrow(true)}>So einfach geht's</div>
          <h2 style={h2(true)}>3 Schritte zu mehr Freude<br />beim Schenken.</h2>
          <p style={lead(true)}>Kein Konto für Schenkende nötig. Kein Download. Einfach ein Link.</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))', gap:2 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ background:'#f4f4f5', padding:'36px 28px', borderRadius: i===0?'16px 0 0 16px':i===2?'0 16px 16px 0':0 }}>
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

      {/* ── OCCASIONS ── */}
      <section style={{ padding:'0 48px 80px', background:'#fff' }}>
        <div style={{ ...inner, borderTop:'1px solid #e4e4e7', paddingTop:56 }}>
          <div style={eyebrow(true)}>Für jeden Anlass</div>
          <h2 style={{ ...h2(true), fontSize:'clamp(1.8rem,3vw,2.4rem)', marginBottom:28 }}>Hochzeit, Geburtstag oder Weihnachten.</h2>
          <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
            {OCCASIONS.map(o => (
              <div key={o.label} style={{ display:'flex', alignItems:'center', gap:7, background:'#fff', border:'1px solid #e4e4e7', borderRadius:100, padding:'8px 18px', fontSize:'.84rem', color:'#71717a' }}>
                <span>{o.emoji}</span>{o.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding:'100px 48px', background:'#fff', borderTop:'1px solid #e4e4e7' }}>
        <div style={inner}>
          <div style={eyebrow(true)}>Features</div>
          <h2 style={{ ...h2(true), maxWidth:520 }}>Alles was du brauchst. Nichts was du nicht brauchst.</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:40, marginTop:48 }}>
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

      {/* ── COMPARISON ── */}
      <section style={{ padding:'100px 48px', background:'#09090b' }}>
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <div style={eyebrow(false)}>Vergleich</div>
          <h2 style={{ ...h2(false), maxWidth:540 }}>Besser als die Amazon-Liste. Schöner als alles andere.</h2>
          <div style={{ overflowX:'auto', marginTop:48 }}>
            <table style={{ width:'100%', borderCollapse:'collapse' }}>
              <thead>
                <tr>
                  {['Feature','Dein Wunsch','Amazon Liste','Andere Apps'].map((h,i) => (
                    <th key={h} style={{ fontSize:'.75rem', fontWeight:600, letterSpacing:'.06em', textTransform:'uppercase', color:i===1?'#fff':'rgba(255,255,255,.35)', padding:'14px 20px', textAlign:'left', borderBottom:'1px solid rgba(255,255,255,.08)', background:i===1?'rgba(255,255,255,.05)':'transparent' }}>{h}</th>
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
                  ['Premium Design',true,false,false],
                  ['Keine Werbung',true,false,false],
                  ['Kostenlos',true,true,true],
                ].map(([feat,...vals]) => (
                  <tr key={feat}>
                    <td style={{ fontSize:'.84rem', color:'rgba(255,255,255,.65)', padding:'13px 20px', borderBottom:'1px solid rgba(255,255,255,.05)' }}>{feat}</td>
                    {vals.map((v,i) => (
                      <td key={i} style={{ padding:'13px 20px', borderBottom:'1px solid rgba(255,255,255,.05)', background:i===0?'rgba(255,255,255,.03)':'transparent', fontSize:'1rem', color:v?'#22c55e':'rgba(255,255,255,.2)', fontWeight:v?600:400 }}>{v?'✓':'✕'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── REVIEWS ── */}
      <section style={{ padding:'100px 48px', background:'#09090b', borderTop:'1px solid rgba(255,255,255,.06)' }}>
        <div style={inner}>
          <div style={eyebrow(false)}>Stimmen</div>
          <h2 style={{ ...h2(false), maxWidth:480 }}>Echte Menschen, echte Freude.</h2>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))', gap:16, marginTop:48 }}>
            {REVIEWS.map((r,i) => (
              <div key={i} style={{ background:'rgba(255,255,255,.05)', border:'1px solid rgba(255,255,255,.08)', borderRadius:16, padding:24 }}>
                <div style={{ color:'#f59e0b', fontSize:'.85rem', marginBottom:12, letterSpacing:2 }}>★★★★★</div>
                <p style={{ fontSize:'.88rem', color:'rgba(255,255,255,.75)', lineHeight:1.65, marginBottom:16, fontStyle:'italic' }}>„{r.text}"</p>
                <div style={{ fontSize:'.76rem', fontWeight:600, color:'rgba(255,255,255,.35)' }}>{r.name} · {r.occasion}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAILURE ── */}
      <section style={{ background:'#18181b', borderTop:'1px solid rgba(255,255,255,.06)', padding:'72px 48px' }}>
        <div style={{ maxWidth:640, margin:'0 auto' }}>
          <div style={eyebrow(false)}>Ohne Dein Wunsch</div>
          <h2 style={{ ...h2(false), fontSize:'clamp(1.6rem,3vw,2.2rem)' }}>Noch ein Jahr mit Geschenken die keiner braucht?</h2>
          <ul style={{ listStyle:'none', padding:0, display:'flex', flexDirection:'column', gap:12, marginTop:28 }}>
            {['Wieder Socken, Duschgel oder ein Buch das du schon hast','Dreimal dasselbe Spielzeug für die Kinder','Stundenlange Suche — und trotzdem das falsche Modell','„Was wünschst du dir?" — jedes Jahr die gleiche Frage','Geld verschenkt statt Freude gemacht'].map((item,i) => (
              <li key={i} style={{ display:'flex', alignItems:'flex-start', gap:12, fontSize:'.88rem', color:'rgba(255,255,255,.5)', lineHeight:1.5 }}>
                <div style={{ width:20, height:20, borderRadius:'50%', background:'rgba(220,38,38,.15)', color:'#ef4444', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.65rem', flexShrink:0, marginTop:1 }}>✕</div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding:'120px 48px', background:'#09090b', textAlign:'center' }}>
        <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(2.2rem,5vw,3.8rem)', fontWeight:400, color:'#fff', letterSpacing:'-.03em', marginBottom:16, lineHeight:1.1 }}>
          Bereit?<br /><em style={{ fontStyle:'italic', color:'rgba(255,255,255,.5)' }}>Fang heute an.</em>
        </h2>
        <p style={{ fontSize:'.95rem', color:'rgba(255,255,255,.4)', marginBottom:36 }}>Kostenlos · Keine Kreditkarte · In 3 Minuten eingerichtet</p>
        <button onClick={goReg} style={{ ...btnW, padding:'14px 40px', fontSize:'.95rem' }}>Kostenlos starten →</button>
        <div style={{ display:'flex', gap:24, justifyContent:'center', marginTop:28, flexWrap:'wrap' }}>
          {['Kostenlos für immer','Keine Kreditkarte','Keine Werbung','DSGVO konform'].map(t => (
            <div key={t} style={{ fontSize:'.76rem', color:'rgba(255,255,255,.3)', display:'flex', alignItems:'center', gap:5 }}>
              <span style={{ color:'#22c55e' }}>✓</span>{t}
            </div>
          ))}
        </div>
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

      {/* Mobile CTA */}
      {mobileCta && (
        <div style={{ position:'fixed', bottom:0, left:0, right:0, background:'rgba(9,9,11,.95)', backdropFilter:'blur(20px)', borderTop:'1px solid rgba(255,255,255,.08)', padding:'14px 20px', zIndex:150, display:'flex' }}>
          <button onClick={goReg} style={{ ...btnW, width:'100%', justifyContent:'center', borderRadius:12, padding:13 }}>Kostenlos starten →</button>
        </div>
      )}
    </div>
  )
}
