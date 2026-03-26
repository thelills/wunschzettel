import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useToast } from '../hooks/useToast'

export default function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()
  const { toast, ToastEl } = useToast()

  useEffect(() => {
    // Supabase schickt den Token als URL-Fragment: #access_token=...&type=recovery
    // Der Supabase Client verarbeitet das automatisch via onAuthStateChange
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setReady(true)
      }
      if (event === 'SIGNED_IN' && window.location.hash.includes('type=recovery')) {
        setReady(true)
      }
    })

    // Fallback: wenn schon eingeloggt via Hash
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session && window.location.hash.includes('type=recovery')) {
        setReady(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (password.length < 6) { toast('Mind. 6 Zeichen'); return }
    if (password !== confirm) { toast('Passwörter stimmen nicht überein'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { toast('Fehler: ' + error.message); return }
    setDone(true)
    setTimeout(() => navigate('/dashboard'), 2500)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:20, background:'var(--surface)' }}>
      <div onClick={() => navigate('/')} style={{ marginBottom:32, cursor:'pointer', display:'flex', justifyContent:'center' }}>
        <img src="/logo.png" alt="Dein Wunsch" style={{ height:48, width:'auto', display:'block' }} />
      </div>

      <div style={{ background:'var(--white)', border:'1px solid var(--border)', borderRadius:20, padding:32, width:'100%', maxWidth:400, boxShadow:'var(--sh-lg)' }}>
        {done ? (
          <div style={{ textAlign:'center', padding:'12px 0' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:12 }}>✅</div>
            <div style={{ fontFamily:'var(--font-serif)', fontSize:'1.3rem', color:'var(--black)', marginBottom:8 }}>Passwort geändert!</div>
            <p style={{ fontSize:'.84rem', color:'var(--mid)' }}>Du wirst zum Dashboard weitergeleitet…</p>
          </div>
        ) : !ready ? (
          <div style={{ textAlign:'center', padding:'20px 0' }}>
            <div style={{ fontSize:'1.5rem', marginBottom:12 }}>⏳</div>
            <div style={{ fontSize:'.9rem', color:'var(--mid)' }}>Link wird geprüft…</div>
            <p style={{ fontSize:'.78rem', color:'var(--muted)', marginTop:8, lineHeight:1.6 }}>
              Falls der Link nicht funktioniert,{' '}
              <button onClick={() => navigate('/login')} style={{ background:'none', border:'none', cursor:'pointer', color:'var(--ai)', textDecoration:'underline', fontSize:'.78rem' }}>
                hier neuen anfordern
              </button>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <div style={{ fontFamily:'var(--font-serif)', fontSize:'1.3rem', color:'var(--black)', marginBottom:6 }}>Neues Passwort</div>
              <p style={{ fontSize:'.84rem', color:'var(--mid)' }}>Wähle ein sicheres Passwort für dein Konto.</p>
            </div>
            <div className="field">
              <label>Neues Passwort</label>
              <input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} placeholder="mind. 6 Zeichen" autoFocus />
            </div>
            <div className="field">
              <label>Passwort bestätigen</label>
              <input type="password" required value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="Nochmal eingeben" />
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
