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

const OCCASIONS = [
  { emoji: '💍', label: 'Hochzeit' }, { emoji: '🎂', label: 'Geburtstag' },
  { emoji: '🍼', label: 'Babyparty' }, { emoji: '🎄', label: 'Weihnachten' },
  { emoji: '🏠', label: 'Einzug' }, { emoji: '🎓', label: 'Abschluss' },
]

const FEATURES = [
  { icon: '✦', title: 'KI-Geschenkberater', body: 'Keine Ideen? Die KI schlägt dir passende Wünsche vor — nach Anlass, Alter und Budget. Sofort, ohne Wartezeit.' },
  { icon: '◎', title: 'Keine Doppelkäufe', body: 'Schenkende reservieren Wünsche — für andere unsichtbar. Die Überraschung bleibt garantiert.' },
  { icon: '◈', title: 'Sammlungen', body: 'Ideen das ganze Jahr sammeln — für Papa, die beste Freundin, für dich. Nie mehr improvisiert schenken.' },
  { icon: '⟡', title: 'Gruppengeschenke', body: 'Teure Wünsche gemeinsam erfüllen — ohne Geld einzusammeln. Per Gutschein-Code, ohne Aufwand.' },
  { icon: '◻', title: 'Gäste ohne App', body: 'Schenkende brauchen kein Konto, keine App. Einfach den Link öffnen — und kaufen.' },
  { icon: '○', title: 'Kostenlos & werbefrei', body: 'Kein Abo, keine Werbung, kein Tracking. Finanziert durch Affiliate-Links beim Kauf.' },
]

const s = {
  body: { margin: 0, padding: 0, fontFamily: "'Geist', system-ui, sans-serif", background: '#09090b', color: '#fff', overflowX: 'hidden' },
  nav: (scrolled) => ({ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 60, background: scrolled ? 'rgba(9,9,11,.85)' : 'transparent', backdropFilter: scrolled ? 'blur(24px)' : 'none', borderBottom: scrolled ? '1px solid rgba(255,255,255,.07)' : '1px solid transparent', transition: 'all .4s' }),
  logoMark: { width: 30, height: 30, borderRadius: 8, background: 'linear-gradient(135deg,#fff 0%,#d4d4dc 35%,#f8f8fc 65%,#c0c0cc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 12px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.8)' },
  progress: (w) => ({ position: 'fixed', top: 0, left: 0, height: 2, background: 'linear-gradient(90deg,rgba(255,255,255,.2),rgba(255,255,255,.7))', width: w + '%', zIndex: 300, transition: 'width .05s linear' }),
}

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const currentFrameRef = useRef(0)
  const [scrolled, setScrolled] = useState(false)
  const [progress, setProgress] = useState(0)
  const [phase2, setPhase2] = useState(0)
  const [mobileCta, setMobileCta] = useState(false)

  useEffect(() => { if (user) navigate('/dashboard') }, [user])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const video = document.createElement('video')
    video.src = '/hero.mp4'; video.muted = true; video.playsInline = true; video.preload = 'auto'
    let frames = []

    const setSize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; drawFrame(frames[currentFrameRef.current]) }
    setSize()
    window.addEventListener('resize', setSize)

    function drawFrame(img) {
      if (!img || !img.complete) return
      const sc = Math.max(canvas.width / img.width, canvas.height / img.height)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, (canvas.width - img.width * sc) / 2, (canvas.height - img.height * sc) / 2, img.width * sc, img.height * sc)
    }

    async function extractFrames() {
      await new Promise(r => { video.onloadedmetadata = r; video.load() })
      const total = Math.floor(video.duration * 24)
      const off = document.createElement('canvas'); off.width = 960; off.height = 540
      const offCtx = off.getContext('2d')
      for (let i = 0; i < total; i++) {
        video.currentTime = i / 24
        await new Promise(r => { video.onseeked = r })
        offCtx.drawImage(video, 0, 0, 960, 540)
        const img = new Image(); img.src = off.toDataURL('image/jpeg', 0.8); frames.push(img)
        if (i === 0) drawFrame(img)
      }
      framesRef.current = frames
    }
    extractFrames().catch(() => {})

    function onScroll() {
      const hero = document.getElementById('ln-hero')
      if (!hero) return
      const p = Math.min(Math.max(window.scrollY / (hero.offsetHeight - window.innerHeight), 0), 1)
      setProgress(p * 100)
      const f = framesRef.current
      if (f.length > 0) {
        const idx = Math.min(Math.floor(p * (f.length - 1)), f.length - 1)
        if (idx !== currentFrameRef.current) { currentFrameRef.current = idx; drawFrame(f[idx]) }
      }
      setScrolled(window.scrollY > 20)
      setPhase2(p > .65 ? Math.min((p - .65) / .2, 1) : 0)
      setMobileCta(window.scrollY > window.innerHeight * 3)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', setSize) }
  }, [])

  const goReg = () => navigate('/register')
  const goDemo = () => document.getElementById('ln-steps')?.scrollIntoView({ behavior: 'smooth' })

  const btnWhite = { fontFamily: "'Geist',sans-serif", fontSize: '.9rem', fontWeight: 600, padding: '13px 32px', borderRadius: 100, border: 'none', cursor: 'pointer', background: '#fff', color: '#09090b', display: 'inline-flex', alignItems: 'center', gap: 6, transition: 'all .2s' }
  const btnOutline = { fontFamily: "'Geist',sans-serif", fontSize: '.9rem', fontWeight: 500, padding: '13px 24px', borderRadius: 100, cursor: 'pointer', background: 'transparent', color: 'rgba(255,255,255,.8)', border: '1px solid rgba(255,255,255,.25)', transition: 'all .2s' }

  return (
    <div style={s.body}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Geist:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* Progress */}
      <div style={s.progress(progress)} />

      {/* Nav */}
      <nav style={s.nav(scrolled)}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <div style={s.logoMark}><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5C7 1.5 3 3.2 3 7c0 2.2 1.8 4 4 4s4-1.8 4-4C11 3.2 7 1.5 7 1.5z" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round"/><path d="M7 5.5v5" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round"/></svg></div>
          <span style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', letterSpacing: '-.025em' }}>Dein Wunsch</span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => navigate('/login')} style={{ ...btnOutline, padding: '7px 16px', fontSize: '.8rem' }}>Anmelden</button>
          <button onClick={goReg} style={{ ...btnWhite, padding: '7px 16px', fontSize: '.8rem' }}>Kostenlos starten</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ position: 'relative', height: '600vh' }} id="ln-hero">
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,.2) 0%,rgba(0,0,0,0) 35%,rgba(0,0,0,.6) 100%)', pointerEvents: 'none' }} />

          {/* Phase 1 */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', width: '100%', maxWidth: 820, padding: '0 24px', pointerEvents: 'none', opacity: progress < 15 ? progress/15 : progress < 35 ? 1 : progress < 55 ? 1-(progress-35)/20 : 0 }}>
            <div style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,.4)', marginBottom: 20 }}>deinwunsch.app</div>
            <h1 style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 'clamp(2.6rem,6vw,5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1, letterSpacing: '-.03em' }}>
              Schluss mit<br />falschen Geschenken —<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.6)' }}>für immer.</em>
            </h1>
          </div>

          {/* Phase 2 */}
          <div style={{ position: 'absolute', bottom: '12%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', width: '100%', maxWidth: 580, padding: '0 24px', opacity: phase2 }}>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,.7)', lineHeight: 1.7, fontWeight: 300, marginBottom: 32 }}>Erstelle deinen Wunschzettel in 3 Minuten. Teile ihn per Link. Erhalte endlich Geschenke die du wirklich willst.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button style={btnWhite} onClick={goReg}>Jetzt kostenlos starten →</button>
              <button style={btnOutline} onClick={goDemo}>Wie es funktioniert</button>
            </div>
          </div>

          {/* Scroll hint */}
          <div style={{ position: 'absolute', bottom: 28, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: progress < 5 ? 1 : Math.max(0, 1-(progress-5)/8) }}>
            <span style={{ fontSize: '.65rem', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)' }}>Scroll</span>
            <div style={{ width: 22, height: 38, border: '1.5px solid rgba(255,255,255,.18)', borderRadius: 11, position: 'relative' }}>
              <style>{`@keyframes dd{0%,100%{top:5px;opacity:1}70%{top:20px;opacity:0}}`}</style>
              <div style={{ width: 4, height: 8, background: 'rgba(255,255,255,.4)', borderRadius: 2, position: 'absolute', left: '50%', transform: 'translateX(-50%)', animation: 'dd 1.8s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── PROBLEM ── */}
      <section style={{ padding: '100px 48px', background: '#09090b' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 14 }}>Das Problem</div>
          <h2 style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, color: '#fff', letterSpacing: '-.03em', marginBottom: 12 }}>Kennst du das?</h2>
          <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,.45)', lineHeight: 1.7, maxWidth: 500, marginBottom: 48 }}>Jedes Jahr dasselbe Theater. Dabei könnte Schenken so schön sein.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
            {[
              { icon: '😬', title: '„Was wünschst du dir eigentlich?"', body: 'Diese Frage kommt immer — und jedes Mal weißt du nicht was du sagen sollst. Ergebnis: Geschenke die keiner braucht.' },
              { icon: '📦', title: 'Dreimal dasselbe Geschenk', body: 'Tante Helga, Oma und dein bester Freund kaufen alle dasselbe — weil niemand weiß was schon bestellt wurde.' },
              { icon: '🤷', title: 'Schenken auf gut Glück', body: 'Stunden gesucht, trotzdem falsche Farbe, falsche Größe. Geld verschenkt statt Freude gemacht.' },
            ].map(c => (
              <div key={c.title} style={{ background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 28 }}>
                <div style={{ fontSize: '1.6rem', marginBottom: 14 }}>{c.icon}</div>
                <div style={{ fontSize: '.95rem', fontWeight: 600, color: 'rgba(255,255,255,.9)', marginBottom: 8 }}>{c.title}</div>
                <div style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.4)', lineHeight: 1.65 }}>{c.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ── */}
      <section style={{ padding: '100px 48px', background: '#fff' }} id="ln-steps">
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a1a1aa', marginBottom: 14 }}>So einfach geht's</div>
          <h2 style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, color: '#09090b', letterSpacing: '-.03em', marginBottom: 12 }}>3 Schritte zu mehr Freude<br />beim Schenken.</h2>
          <p style={{ fontSize: '1rem', color: '#71717a', lineHeight: 1.7, maxWidth: 480, marginBottom: 56 }}>Kein Konto für Schenkende nötig. Kein Download. Einfach ein Link.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 2 }}>
            {STEPS.map((step, i) => (
              <div key={i} style={{ background: '#f4f4f5', padding: '36px 28px', borderRadius: i === 0 ? '16px 0 0 16px' : i === 2 ? '0 16px 16px 0' : 0 }}>
                <div style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: '3rem', fontWeight: 400, color: '#e4e4e7', lineHeight: 1, marginBottom: 16 }}>{step.n}</div>
                <div style={{ fontSize: '1rem', fontWeight: 600, color: '#09090b', marginBottom: 8 }}>{step.title}</div>
                <div style={{ fontSize: '.84rem', color: '#71717a', lineHeight: 1.65 }}>{step.body}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <button onClick={goReg} style={{ ...btnWhite, background: '#09090b', color: '#fff' }}>Jetzt Liste erstellen →</button>
          </div>
        </div>
      </section>

      {/* ── OCCASIONS ── */}
      <section style={{ padding: '0 48px 80px', background: '#fff' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', borderTop: '1px solid #e4e4e7', paddingTop: 56 }}>
          <div style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a1a1aa', marginBottom: 14 }}>Für jeden Anlass</div>
          <h2 style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 'clamp(1.8rem,3vw,2.4rem)', fontWeight: 400, color: '#09090b', letterSpacing: '-.03em', marginBottom: 28 }}>Hochzeit, Geburtstag oder Weihnachten.</h2>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {OCCASIONS.map(o => (
              <div key={o.label} style={{ display: 'flex', alignItems: 'center', gap: 7, background: '#fff', border: '1px solid #e4e4e7', borderRadius: 100, padding: '8px 18px', fontSize: '.84rem', color: '#71717a' }}>
                <span>{o.emoji}</span> {o.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ padding: '100px 48px', background: '#fff', borderTop: '1px solid #e4e4e7' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a1a1aa', marginBottom: 14 }}>Features</div>
          <h2 style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, color: '#09090b', letterSpacing: '-.03em', maxWidth: 520, marginBottom: 56 }}>Alles was du brauchst. Nichts was du nicht brauchst.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 40 }}>
            {FEATURES.map(f => (
              <div key={f.title}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f4f4f5', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: 14 }}>{f.icon}</div>
                <div style={{ fontSize: '.95rem', fontWeight: 600, color: '#09090b', marginBottom: 8 }}>{f.title}</div>
                <div style={{ fontSize: '.84rem', color: '#71717a', lineHeight: 1.65 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMPARISON ── */}
      <section style={{ padding: '100px 48px', background: '#09090b' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 14 }}>Vergleich</div>
          <h2 style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, color: '#fff', letterSpacing: '-.03em', maxWidth: 540, marginBottom: 48 }}>Besser als die Amazon-Liste. Schöner als alles andere.</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  {['Feature', 'Dein Wunsch', 'Amazon Liste', 'Andere Apps'].map((h, i) => (
                    <th key={h} style={{ fontSize: '.75rem', fontWeight: 600, letterSpacing: '.06em', textTransform: 'uppercase', color: i === 1 ? '#fff' : 'rgba(255,255,255,.35)', padding: '14px 20px', textAlign: 'left', borderBottom: '1px solid rgba(255,255,255,.08)', background: i === 1 ? 'rgba(255,255,255,.05)' : 'transparent' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['KI-Geschenkvorschläge', true, false, false],
                  ['Alle Online-Shops', true, false, true],
                  ['Gäste ohne Account', true, false, true],
                  ['Gruppengeschenke', true, false, false],
                  ['Sammlungen', true, false, false],
                  ['Premium Design', true, false, false],
                  ['Keine Werbung', true, false, false],
                  ['Kostenlos', true, true, true],
                ].map(([feat, us, amz, other]) => (
                  <tr key={feat}>
                    <td style={{ fontSize: '.84rem', color: 'rgba(255,255,255,.65)', padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,.05)' }}>{feat}</td>
                    {[us, amz, other].map((v, i) => (
                      <td key={i} style={{ padding: '13px 20px', borderBottom: '1px solid rgba(255,255,255,.05)', background: i === 0 ? 'rgba(255,255,255,.03)' : 'transparent', fontSize: '1rem', color: v ? '#22c55e' : 'rgba(255,255,255,.2)' }}>{v ? '✓' : '✕'}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section style={{ padding: '100px 48px', background: '#09090b', borderTop: '1px solid rgba(255,255,255,.06)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 14 }}>Stimmen</div>
          <h2 style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, color: '#fff', letterSpacing: '-.03em', maxWidth: 480, marginBottom: 48 }}>Echte Menschen, echte Freude.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
            {REVIEWS.map((r, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 16, padding: 24 }}>
                <div style={{ color: '#f59e0b', fontSize: '.85rem', marginBottom: 12, letterSpacing: 2 }}>★★★★★</div>
                <p style={{ fontSize: '.88rem', color: 'rgba(255,255,255,.75)', lineHeight: 1.65, marginBottom: 16, fontStyle: 'italic' }}>„{r.text}"</p>
                <div style={{ fontSize: '.76rem', fontWeight: 600, color: 'rgba(255,255,255,.35)' }}>{r.name} · {r.occasion}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAILURE ── */}
      <section style={{ background: '#18181b', borderTop: '1px solid rgba(255,255,255,.06)', borderBottom: '1px solid rgba(255,255,255,.06)', padding: '72px 48px' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div style={{ fontSize: '.72rem', fontWeight: 600, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.3)', marginBottom: 14 }}>Ohne Dein Wunsch</div>
          <h2 style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 'clamp(1.6rem,3vw,2.2rem)', fontWeight: 400, color: '#fff', letterSpacing: '-.03em', marginBottom: 28 }}>Noch ein Jahr mit Geschenken die keiner braucht?</h2>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {['Wieder Socken, Duschgel oder ein Buch das du schon hast', 'Dreimal dasselbe Spielzeug für die Kinder', 'Stundenlange Suche — und trotzdem das falsche Modell', '„Was wünschst du dir?" — jedes Jahr die gleiche Frage', 'Geld verschenkt statt Freude gemacht'].map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: '.88rem', color: 'rgba(255,255,255,.5)', lineHeight: 1.5 }}>
                <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(220,38,38,.15)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.65rem', flexShrink: 0, marginTop: 1 }}>✕</div>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ padding: '120px 48px', background: '#09090b', textAlign: 'center' }}>
        <h2 style={{ fontFamily: "'DM Serif Display',Georgia,serif", fontSize: 'clamp(2.2rem,5vw,3.8rem)', fontWeight: 400, color: '#fff', letterSpacing: '-.03em', marginBottom: 16, lineHeight: 1.1 }}>
          Bereit?<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.5)' }}>Fang heute an.</em>
        </h2>
        <p style={{ fontSize: '.95rem', color: 'rgba(255,255,255,.4)', marginBottom: 36 }}>Kostenlos · Keine Kreditkarte · In 3 Minuten eingerichtet</p>
        <button onClick={goReg} style={{ ...btnWhite, padding: '14px 40px', fontSize: '.95rem', boxShadow: '0 0 60px rgba(255,255,255,.08)' }}>Kostenlos starten →</button>
        <div style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
          {['Kostenlos für immer', 'Keine Kreditkarte', 'Keine Werbung', 'DSGVO konform'].map(t => (
            <div key={t} style={{ fontSize: '.76rem', color: 'rgba(255,255,255,.3)', display: 'flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: '#22c55e' }}>✓</span> {t}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,.06)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: '.74rem', color: 'rgba(255,255,255,.2)' }}>© Dein Wunsch 2026 · Niklas Lill · Dachau</span>
        <div style={{ display: 'flex', gap: 20 }}>
          {[['Impressum', '/impressum.html'], ['Datenschutz', '/datenschutz.html']].map(([l, h]) => (
            <a key={l} href={h} style={{ fontSize: '.74rem', color: 'rgba(255,255,255,.2)', textDecoration: 'none' }}>{l}</a>
          ))}
        </div>
      </footer>

      {/* ── MOBILE STICKY CTA ── */}
      {mobileCta && (
        <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: 'rgba(9,9,11,.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(255,255,255,.08)', padding: '14px 20px', zIndex: 150, display: 'none' }}>
          <button onClick={goReg} style={{ width: '100%', ...btnWhite, justifyContent: 'center', borderRadius: 12, padding: 13 }}>Kostenlos starten →</button>
        </div>
      )}
    </div>
  )
}
