import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../hooks/useToast.jsx'

export default function Auth({ mode = 'login' }) {
  const [tab, setTab] = useState(mode)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const { signIn, signUp } = useAuth()
  const navigate = useNavigate()
  const { toast, ToastEl } = useToast()
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    const { error } = await signIn(form.email, form.password)
    setLoading(false)
    if (error) { toast('Fehler: ' + error.message); return }
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

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20, background: 'var(--surface)' }}>
      <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 32, cursor: 'pointer' }}>
        <div className="nav-logo-mark"><svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 1.5C7 1.5 3 3.2 3 7c0 2.2 1.8 4 4 4s4-1.8 4-4C11 3.2 7 1.5 7 1.5z" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round"/><path d="M7 5.5v5" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round"/></svg></div>
        <span className="nav-logo-text">Dein Wunsch</span>
      </div>

      <div style={{ background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 20, padding: '32px', width: '100%', maxWidth: 400, boxShadow: 'var(--sh-lg)' }}>
        <div className="tabs">
          <button className={`tab${tab === 'login' ? ' active' : ''}`} onClick={() => setTab('login')}>Anmelden</button>
          <button className={`tab${tab === 'register' ? ' active' : ''}`} onClick={() => setTab('register')}>Konto erstellen</button>
        </div>

        {tab === 'login' ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: '.84rem', color: 'var(--mid)', marginBottom: 4 }}>Willkommen zurück.</p>
            <div className="field"><label>E-Mail</label><input type="email" required value={form.email} onChange={set('email')} placeholder="deine@email.de" autoComplete="email" /></div>
            <div className="field"><label>Passwort</label><input type="password" required value={form.password} onChange={set('password')} placeholder="••••••••" autoComplete="current-password" /></div>
            <button className="btn btn-dark" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>{loading ? 'Lädt…' : 'Anmelden'}</button>
          </form>
        ) : (
          <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <p style={{ fontSize: '.84rem', color: 'var(--mid)', marginBottom: 4 }}>Kostenlos, für immer.</p>
            <div className="field"><label>Dein Name</label><input type="text" required value={form.name} onChange={set('name')} placeholder="z.B. Emma" autoComplete="name" /></div>
            <div className="field"><label>E-Mail</label><input type="email" required value={form.email} onChange={set('email')} placeholder="deine@email.de" autoComplete="email" /></div>
            <div className="field"><label>Passwort</label><input type="password" required minLength={6} value={form.password} onChange={set('password')} placeholder="mind. 6 Zeichen" autoComplete="new-password" /></div>
            <button className="btn btn-dark" type="submit" disabled={loading} style={{ width: '100%', justifyContent: 'center', marginTop: 4 }}>{loading ? 'Lädt…' : 'Konto erstellen'}</button>
          </form>
        )}
      </div>
      <p style={{ fontSize: '.76rem', color: 'var(--muted)', marginTop: 16, textAlign: 'center' }}>
        Mit der Registrierung stimmst du unserer <a href="/datenschutz.html" style={{ textDecoration: 'underline' }}>Datenschutzerklärung</a> zu.
      </p>
      {ToastEl}
    </div>
  )
}
