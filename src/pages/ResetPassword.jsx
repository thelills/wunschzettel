import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useToast } from '../hooks/useToast'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const navigate = useNavigate()
  const { toast, ToastEl } = useToast()

  // Supabase sends the token as a URL fragment — it handles it automatically via onAuthStateChange
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event) => {
      if (event === 'PASSWORD_RECOVERY') {
        // User is now in recovery mode — we can update password
      }
    })
    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (password.length < 6) { toast('Mind. 6 Zeichen'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { toast('Fehler: ' + error.message); return }
    setDone(true)
    setTimeout(() => navigate('/dashboard'), 2500)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20, background:'var(--surface)' }}>
      <div onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:9, marginBottom:32, cursor:'pointer' }}>
        <div className="nav-logo-mark">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 1.5C7 1.5 3 3.2 3 7c0 2.2 1.8 4 4 4s4-1.8 4-4C11 3.2 7 1.5 7 1.5z" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round"/>
            <path d="M7 5.5v5" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
        </div>
        <span className="nav-logo-text">Dein Wunsch</span>
      </div>

      <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:32, width:'100%', maxWidth:400, boxShadow:'var(--sh-lg)' }}>
        {done ? (
          <div style={{ textAlign:'center', padding:'12px 0' }}>
            <div style={{ fontSize:'2rem', marginBottom:12 }}>✅</div>
            <div style={{ fontWeight:600, color:'var(--black)', marginBottom:8 }}>Passwort geändert!</div>
            <p style={{ fontSize:'.84rem', color:'var(--mid)' }}>Du wirst weitergeleitet…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'1.3rem', color:'var(--black)', marginBottom:6 }}>Neues Passwort</div>
              <p style={{ fontSize:'.84rem', color:'var(--mid)' }}>Wähle ein neues Passwort für dein Konto.</p>
            </div>
            <div className="field">
              <label>Neues Passwort</label>
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="mind. 6 Zeichen" autoFocus />
            </div>
            <button className="btn btn-dark" type="submit" disabled={loading} style={{ width:'100%', justifyContent:'center' }}>
              {loading ? 'Speichert…' : 'Passwort speichern'}
            </button>
          </form>
        )}
      </div>
      {ToastEl}
    </div>
  )
}
