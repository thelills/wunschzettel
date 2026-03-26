import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast'
import { supabase } from '../lib/supabase'

export default function Auth({ mode = 'login' }) {
  const [tab, setTab] = useState(mode)         // 'login' | 'register' | 'forgot'
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [resetSent, setResetSent] = useState(false)
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const { toast, ToastEl } = useToast()
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (error) { toast('E-Mail oder Passwort falsch'); return }
    navigate('/dashboard')
  }

  const handleRegister = async e => {
    e.preventDefault()
    if (!form.name.trim()) { toast('Bitte Namen eingeben'); return }
    setLoading(true)
    const { error } = await signUp(form.email, form.password, form.name)
    setLoading(false)
    if (error) { toast('Fehler: ' + error.message); return }
    navigate('/dashboard')
  }

  const handleReset = async e => {
    e.preventDefault()
    if (!form.email) { toast('Bitte E-Mail eingeben'); return }
    setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(form.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    setLoading(false)
    if (error) { toast('Fehler: ' + error.message); return }
    setResetSent(true)
  }

  const Logo = () => (
    <div onClick={() => navigate('/')} style={{ marginBottom:32, cursor:'pointer', display:'flex', justifyContent:'center' }}>
      <img src="/logo.png" alt="Dein Wunsch" style={{ height:48, width:'auto', display:'block' }} />
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20, background:'var(--surface)' }}>
      <Logo />

      <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:32, width:'100%', maxWidth:400, boxShadow:'var(--sh-lg)' }}>

        {/* Tabs — nur für login/register */}
        {tab !== 'forgot' && (
          <div className="tabs">
            <button className={`tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Anmelden</button>
            <button className={`tab${tab === 'register' ? ' active' : ''}`} onClick={() => setTab('register')}>Konto erstellen</button>
          </div>
        )}

        {/* ── LOGIN ── */}
        {tab === 'login' && (
          <form onSubmit={handleLogin} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <p style={{ fontSize:'.84rem', color:'var(--mid)', marginBottom:4 }}>Willkommen zurück.</p>
            <div className="field">
              <label>E-Mail</label>
              <input type="email" required value={form.email} onChange={set('email')} placeholder="deine@email.de" autoComplete="email" />
            </div>
            <div className="field">
              <label>Passwort</label>
              <input type="password" required value={form.password} onChange={set('password')} placeholder="••••••••" autoComplete="current-password" />
            </div>
            <button className="btn btn-dark" type="submit" disabled={loading} style={{ width:'100%', justifyContent:'center', marginTop:4 }}>
              {loading ? 'Lädt…' : 'Anmelden'}
            </button>
            <button type="button" onClick={() => setTab('forgot')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'.78rem', color:'var(--muted)', textAlign:'center', marginTop:-6 }}>
              Passwort vergessen?
            </button>
          </form>
        )}

        {/* ── REGISTER ── */}
        {tab === 'register' && (
          <form onSubmit={handleRegister} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <p style={{ fontSize:'.84rem', color:'var(--mid)', marginBottom:4 }}>Kostenlos, für immer.</p>
            <div className="field">
              <label>Dein Name</label>
              <input type="text" required value={form.name} onChange={set('name')} placeholder="z.B. Emma" autoComplete="name" />
            </div>
            <div className="field">
              <label>E-Mail</label>
              <input type="email" required value={form.email} onChange={set('email')} placeholder="deine@email.de" autoComplete="email" />
            </div>
            <div className="field">
              <label>Passwort</label>
              <input type="password" required minLength={6} value={form.password} onChange={set('password')} placeholder="mind. 6 Zeichen" autoComplete="new-password" />
            </div>
            <button className="btn btn-dark" type="submit" disabled={loading} style={{ width:'100%', justifyContent:'center', marginTop:4 }}>
              {loading ? 'Lädt…' : 'Konto erstellen'}
            </button>
          </form>
        )}

        {/* ── PASSWORT VERGESSEN ── */}
        {tab === 'forgot' && (
          <div>
            <button onClick={() => setTab('login')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'.78rem', color:'var(--muted)', display:'flex', alignItems:'center', gap:4, marginBottom:16 }}>
              ← Zurück zum Login
            </button>
            {resetSent ? (
              <div style={{ textAlign:'center', padding:'12px 0' }}>
                <div style={{ fontSize:'2rem', marginBottom:12 }}>📬</div>
                <div style={{ fontWeight:600, color:'var(--black)', marginBottom:8 }}>E-Mail gesendet!</div>
                <p style={{ fontSize:'.84rem', color:'var(--mid)', lineHeight:1.6 }}>
                  Wir haben dir einen Link zum Zurücksetzen deines Passworts geschickt. Schau auch im Spam-Ordner nach.
                </p>
                <button onClick={() => { setTab('login'); setResetSent(false) }} className="btn btn-ghost btn-sm" style={{ marginTop:16 }}>
                  Zum Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleReset} style={{ display:'flex', flexDirection:'column', gap:14 }}>
                <div>
                  <div style={{ fontFamily:"var(--font-serif)", fontSize:'1.2rem', color:'var(--black)', marginBottom:6 }}>Passwort zurücksetzen</div>
                  <p style={{ fontSize:'.84rem', color:'var(--mid)' }}>Wir schicken dir einen Link per E-Mail.</p>
                </div>
                <div className="field">
                  <label>E-Mail</label>
                  <input type="email" required value={form.email} onChange={set('email')} placeholder="deine@email.de" autoFocus />
                </div>
                <button className="btn btn-dark" type="submit" disabled={loading} style={{ width:'100%', justifyContent:'center' }}>
                  {loading ? 'Sendet…' : 'Reset-Link senden'}
                </button>
              </form>
            )}
          </div>
        )}
      </div>

      <p style={{ fontSize:'.76rem', color:'var(--muted)', marginTop:16, textAlign:'center' }}>
        Mit der Registrierung stimmst du unserer{' '}
        <a href="/datenschutz.html" style={{ textDecoration:'underline' }}>Datenschutzerklärung</a> zu.
      </p>
      {ToastEl}
    </div>
  )
}
