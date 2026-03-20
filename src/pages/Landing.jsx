import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const FEATURES = [
  { icon: '✦', title: 'KI-Geschenkberater', body: 'Sofort passende Vorschläge nach Anlass, Alter und Budget — keine leere Seite mehr.' },
  { icon: '◈', title: 'Sammlungen', body: 'Ideen übers Jahr sammeln — für Papa, für die beste Freundin, für dich. Nie mehr improvisieren.' },
  { icon: '◎', title: 'Gruppengeschenke', body: 'Koordiniere Gruppengeschenke ohne Geld einzusammeln — per Gutschein, ohne Aufwand.' },
  { icon: '⟡', title: 'Kein Doppelkauf', body: 'Wünsche werden reserviert — sichtbar für alle Schenkenden, unsichtbar für dich.' },
  { icon: '◻', title: 'Jeder Anlass', body: 'Hochzeit, Geburtstag, Babyparty, Weihnachten — eine App für alle Momente.' },
  { icon: '○', title: 'Kostenlos & werbefrei', body: 'Finanziert durch Affiliate-Links — du zahlst nichts extra, siehst keine Werbung.' },
]

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const canvasRef = useRef(null)
  const framesRef = useRef([])
  const currentFrameRef = useRef(0)

  useEffect(() => {
    if (user) navigate('/dashboard')
  }, [user])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    // Load video and extract frames via offscreen video
    const video = document.createElement('video')
    video.src = '/hero.mp4'
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'

    let frames = []
    let totalFrames = 0

    function setSize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    setSize()
    window.addEventListener('resize', setSize)

    function drawFrame(img) {
      if (!img) return
      const scale = Math.max(canvas.width / img.width, canvas.height / img.height)
      const w = img.width * scale
      const h = img.height * scale
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(img, (canvas.width - w) / 2, (canvas.height - h) / 2, w, h)
    }

    // Seek-based frame extraction
    async function extractFrames() {
      await new Promise(r => { video.onloadedmetadata = r; video.load() })
      const duration = video.duration
      const fps = 24
      totalFrames = Math.floor(duration * fps)
      const offscreen = document.createElement('canvas')
      offscreen.width = 960
      offscreen.height = 540
      const offCtx = offscreen.getContext('2d')

      for (let i = 0; i < totalFrames; i++) {
        video.currentTime = i / fps
        await new Promise(r => { video.onseeked = r })
        offCtx.drawImage(video, 0, 0, 960, 540)
        const img = new Image()
        img.src = offscreen.toDataURL('image/jpeg', 0.82)
        frames.push(img)
        if (i === 0) drawFrame(img) // show first frame immediately
      }
      framesRef.current = frames
    }

    extractFrames().catch(console.error)

    // Scroll handler
    const hero = document.getElementById('scroll-hero')
    const phase1 = document.getElementById('text-phase1')
    const phase2 = document.getElementById('text-phase2')
    const scrollHint = document.getElementById('scroll-hint')
    const progressBar = document.getElementById('progress-bar')
    const nav = document.getElementById('main-nav')

    function onScroll() {
      if (!hero) return
      const heroHeight = hero.offsetHeight - window.innerHeight
      const progress = Math.min(Math.max(window.scrollY / heroHeight, 0), 1)
      const f = framesRef.current
      if (f.length > 0) {
        const idx = Math.min(Math.floor(progress * (f.length - 1)), f.length - 1)
        if (idx !== currentFrameRef.current) {
          currentFrameRef.current = idx
          drawFrame(f[idx])
        }
      }
      if (progressBar) progressBar.style.width = (progress * 100) + '%'
      if (phase1) {
        const p = progress < 0.15 ? progress / 0.15 : progress < 0.35 ? 1 : progress < 0.55 ? 1 - (progress - 0.35) / 0.2 : 0
        phase1.style.opacity = p
      }
      if (phase2) phase2.style.opacity = progress > 0.65 ? Math.min((progress - 0.65) / 0.2, 1) : 0
      if (scrollHint) scrollHint.style.opacity = progress < 0.05 ? 1 : Math.max(0, 1 - (progress - 0.05) / 0.08)
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 20)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', setSize)
    }
  }, [])

  return (
    <div style={{ background: '#09090b' }}>
      {/* Progress bar */}
      <div id="progress-bar" style={{ position: 'fixed', top: 0, left: 0, height: 2, background: 'linear-gradient(90deg,rgba(255,255,255,.3),rgba(255,255,255,.8))', width: 0, zIndex: 200, transition: 'width .05s linear' }} />

      {/* Nav */}
      <nav id="main-nav" style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 48px', height: 58, background: 'transparent', transition: 'background .4s, backdrop-filter .4s' }}>
        <style>{`.scrolled { background: rgba(9,9,11,.7) !important; backdrop-filter: blur(20px) !important; border-bottom: 1px solid rgba(255,255,255,.06) !important; }`}</style>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#fff 0%,#d4d4dc 35%,#f8f8fc 65%,#c0c0cc 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,.3)' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5C7 1.5 3 3.2 3 7c0 2.2 1.8 4 4 4s4-1.8 4-4C11 3.2 7 1.5 7 1.5z" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round"/><path d="M7 5.5v5" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round"/></svg>
          </div>
          <span style={{ fontSize: '.95rem', fontWeight: 600, color: '#fff', letterSpacing: '-.025em' }}>Dein Wunsch</span>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/login')} style={{ background: 'transparent', color: 'rgba(255,255,255,.6)', border: '1px solid rgba(255,255,255,.12)', padding: '7px 16px', borderRadius: 9, fontSize: '.8rem', fontWeight: 500, cursor: 'pointer' }}>Anmelden</button>
          <button onClick={() => navigate('/register')} style={{ background: '#fff', color: '#09090b', border: 'none', padding: '7px 16px', borderRadius: 9, fontSize: '.8rem', fontWeight: 500, cursor: 'pointer' }}>Kostenlos starten</button>
        </div>
      </nav>

      {/* SCROLL HERO */}
      <section id="scroll-hero" style={{ position: 'relative', height: '600vh' }}>
        <div style={{ position: 'sticky', top: 0, height: '100vh', overflow: 'hidden' }}>
          <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom,rgba(0,0,0,.15) 0%,rgba(0,0,0,.0) 40%,rgba(0,0,0,.5) 100%)', pointerEvents: 'none' }} />

          {/* Phase 1 text */}
          <div id="text-phase1" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', textAlign: 'center', opacity: 0, transition: 'opacity .1s', width: '100%', maxWidth: 800, padding: '0 32px', pointerEvents: 'none' }}>
            <div style={{ fontSize: '.75rem', fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,.5)', marginBottom: 18 }}>Dein Wunsch · deinwunsch.app</div>
            <h1 style={{ fontFamily: 'var(--font-serif, "DM Serif Display",Georgia,serif)', fontSize: 'clamp(2.8rem,6vw,5rem)', fontWeight: 400, color: '#fff', lineHeight: 1.1, letterSpacing: '-.03em' }}>
              Schenken und<br />gewünscht werden —<br /><em style={{ fontStyle: 'italic', color: 'rgba(255,255,255,.7)' }}>neu gedacht</em>
            </h1>
          </div>

          {/* Phase 2 text */}
          <div id="text-phase2" style={{ position: 'absolute', bottom: '15%', left: '50%', transform: 'translateX(-50%)', textAlign: 'center', opacity: 0, transition: 'opacity .1s', width: '100%', maxWidth: 600, padding: '0 32px' }}>
            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,.75)', lineHeight: 1.65, fontWeight: 300, marginBottom: 28 }}>Erstelle Wunschlisten für jeden Anlass. Teile sie mit Familie und Freunden. Lass die KI helfen — kostenlos, ohne Werbung.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/register')} style={{ background: '#fff', color: '#09090b', border: 'none', padding: '12px 28px', borderRadius: 100, fontSize: '.9rem', fontWeight: 500, cursor: 'pointer' }}>Kostenlos starten</button>
              <button onClick={() => document.getElementById('features').scrollIntoView({ behavior: 'smooth' })} style={{ background: 'transparent', color: '#fff', border: '1px solid rgba(255,255,255,.3)', padding: '12px 24px', borderRadius: 100, fontSize: '.9rem', fontWeight: 500, cursor: 'pointer' }}>Mehr entdecken</button>
            </div>
          </div>

          {/* Scroll hint */}
          <div id="scroll-hint" style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, transition: 'opacity .3s' }}>
            <span style={{ fontSize: '.7rem', fontWeight: 500, letterSpacing: '.12em', textTransform: 'uppercase', color: 'rgba(255,255,255,.35)' }}>Scroll</span>
            <div style={{ width: 24, height: 40, border: '1.5px solid rgba(255,255,255,.2)', borderRadius: 12, position: 'relative' }}>
              <style>{`@keyframes sd{0%,100%{top:5px;opacity:1}70%{top:22px;opacity:0}}`}</style>
              <div style={{ width: 4, height: 8, background: 'rgba(255,255,255,.5)', borderRadius: 2, position: 'absolute', left: '50%', transform: 'translateX(-50%)', animation: 'sd 1.8s ease-in-out infinite' }} />
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ background: '#fff', color: '#09090b', padding: '100px 48px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ fontSize: '.75rem', fontWeight: 500, letterSpacing: '.14em', textTransform: 'uppercase', color: '#a1a1aa', marginBottom: 20 }}>Warum Dein Wunsch</div>
          <h2 style={{ fontFamily: 'var(--font-serif,"DM Serif Display",Georgia,serif)', fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 400, color: '#09090b', letterSpacing: '-.03em', maxWidth: 540, marginBottom: 64 }}>
            Alles was du brauchst, um Schenken einfach zu machen.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 40 }}>
            {FEATURES.map(f => (
              <div key={f.title}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#f4f4f5', border: '1px solid #e4e4e7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', marginBottom: 16 }}>{f.icon}</div>
                <div style={{ fontWeight: 600, color: '#09090b', marginBottom: 8, fontSize: '.95rem' }}>{f.title}</div>
                <div style={{ fontSize: '.84rem', color: '#71717a', lineHeight: 1.65 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: '#09090b', padding: '120px 48px', textAlign: 'center' }}>
        <h2 style={{ fontFamily: 'var(--font-serif,"DM Serif Display",Georgia,serif)', fontSize: 'clamp(2.2rem,5vw,3.5rem)', fontWeight: 400, color: '#fff', letterSpacing: '-.03em', marginBottom: 16 }}>
          Bereit?<br /><em>Fang heute an.</em>
        </h2>
        <p style={{ fontSize: '.95rem', color: 'rgba(255,255,255,.5)', marginBottom: 36 }}>Kostenlos · Keine Kreditkarte · In 2 Minuten eingerichtet</p>
        <button onClick={() => navigate('/register')} style={{ background: '#fff', color: '#09090b', border: 'none', padding: '14px 36px', borderRadius: 100, fontSize: '.95rem', fontWeight: 500, cursor: 'pointer' }}>Kostenlos starten →</button>
      </section>

      <footer style={{ borderTop: '1px solid rgba(255,255,255,.07)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.25)' }}>© Dein Wunsch 2026 · Niklas Lill</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <a href="/impressum.html" style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.25)' }}>Impressum</a>
          <a href="/datenschutz.html" style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.25)' }}>Datenschutz</a>
        </div>
      </footer>
    </div>
  )
}
