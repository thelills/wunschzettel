import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import CookieBanner from '../ui/CookieBanner'

export default function Nav() {
  const { user, signOut, userName } = useAuth()
  const navigate = useNavigate()

  return (
    <>
      <nav className="app-nav">
        <div className="nav-logo" onClick={() => navigate('/')}>
          {/* Logo hat weißen Hintergrund — passt direkt zur hellen Nav */}
          <img src="/logo.png" alt="Dein Wunsch" style={{ height:34, width:'auto', display:'block' }} />
        </div>
        <div className="nav-right">
          {user ? (
            <>
              <button className="btn btn-ghost btn-sm nav-hide-sm" onClick={() => navigate('/dashboard')}>Meine Listen</button>
              <span className="nav-username">{userName?.split(' ')[0]}</span>
              <button className="btn btn-ghost btn-sm" onClick={async () => { await signOut(); navigate('/') }}>Abmelden</button>
            </>
          ) : (
            <>
              <button className="btn btn-ghost btn-sm nav-hide-sm" onClick={() => navigate('/login')}>Anmelden</button>
              <button className="btn btn-dark btn-sm" onClick={() => navigate('/register')}>Starten</button>
            </>
          )}
        </div>
      </nav>
      <CookieBanner />
    </>
  )
}
