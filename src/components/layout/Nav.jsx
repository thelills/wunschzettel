import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function LogoMark() {
  return (
    <div className="nav-logo-mark">
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path d="M7 1.5C7 1.5 3 3.2 3 7c0 2.2 1.8 4 4 4s4-1.8 4-4C11 3.2 7 1.5 7 1.5z" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M7 5.5v5" stroke="#3f3f46" strokeWidth="1.2" strokeLinecap="round"/>
      </svg>
    </div>
  )
}

export default function Nav() {
  const { user, signOut, userName } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className="app-nav">
      <div className="nav-logo" onClick={() => navigate(user ? '/dashboard' : '/')}>
        <LogoMark />
        <span className="nav-logo-text">Dein Wunsch</span>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <span style={{ fontSize: '.76rem', color: 'var(--muted)' }}>{userName}</span>
            <button className="btn btn-ghost btn-sm" onClick={async () => { await signOut(); navigate('/') }}>Abmelden</button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/login')}>Anmelden</button>
            <button className="btn btn-dark btn-sm" onClick={() => navigate('/register')}>Kostenlos starten</button>
          </>
        )}
      </div>
    </nav>
  )
}
