import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Nav from '../components/layout/Nav'
import { useToast } from '../hooks/useToast.jsx'

const OCC = { wedding:'💍', birthday:'🎂', baby:'🍼', christmas:'🎄', housewarming:'🏠', other:'🎁' }
const OCC_LBL = { wedding:'Hochzeit', birthday:'Geburtstag', baby:'Babyparty', christmas:'Weihnachten', housewarming:'Einzug', other:'Sonstiges' }

function Footer() {
  return (
    <footer style={{ borderTop:'1px solid var(--border)', padding:'20px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, marginTop:40 }}>
      <span style={{ fontSize:'.74rem', color:'var(--muted)' }}>© Dein Wunsch 2026 · Niklas Lill</span>
      <div style={{ display:'flex', gap:20 }}>
        <a href="/impressum.html" style={{ fontSize:'.74rem', color:'var(--muted)', textDecoration:'none' }}>Impressum</a>
        <a href="/datenschutz.html" style={{ fontSize:'.74rem', color:'var(--muted)', textDecoration:'none' }}>Datenschutz</a>
      </div>
    </footer>
  )
}

export default function Dashboard() {
  const { user, userName } = useAuth()
  const navigate = useNavigate()
  const { toast, ToastEl } = useToast()
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newOcc, setNewOcc] = useState('birthday')
  const [newDate, setNewDate] = useState('')
  const [creating, setCreating] = useState(false)
  const [totalWishes, setTotalWishes] = useState(0)
  const [totalReserved, setTotalReserved] = useState(0)

  useEffect(() => { loadLists() }, [user])

  async function loadLists() {
    if (!user) return
    const { data } = await supabase
      .from('registries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setLists(data || [])

    // Load wish counts separately
    if (data && data.length > 0) {
      const ids = data.map(l => l.id)
      const { data: wishes } = await supabase
        .from('wishes')
        .select('registry_id, is_reserved')
        .in('registry_id', ids)
      if (wishes) {
        setTotalWishes(wishes.length)
        setTotalReserved(wishes.filter(w => w.is_reserved).length)
      }
    }
    setLoading(false)
  }

  async function createList() {
    if (!newName.trim()) { toast('Name fehlt'); return }
    setCreating(true)
    const slug = newName.toLowerCase()
      .replace(/[äöüß]/g, c => ({ ä:'ae', ö:'oe', ü:'ue', ß:'ss' }[c] || c))
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
      + '-' + Date.now().toString(36)
    const { data, error } = await supabase.from('registries').insert({
      user_id: user.id, name: newName.trim(), occasion: newOcc,
      event_date: newDate || null, slug, is_public: true
    }).select().single()
    setCreating(false)
    if (error) { toast('Fehler: ' + error.message); return }
    setShowNew(false); setNewName(''); setNewDate('')
    toast('✓ Liste erstellt!')
    navigate(`/list/${data.id}`)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Nav />
      <div className="shell animate-lift" style={{ flex:1 }}>

        {/* Header */}
        <div className="page-head">
          <div>
            <h1 className="ph-title">Hallo, {userName} 👋</h1>
            <p className="ph-sub">Deine Wunschlisten</p>
          </div>
          <button className="btn btn-dark" onClick={() => setShowNew(true)}>+ Neue Liste</button>
        </div>

        {/* Stats */}
        <div className="stats-row">
          <div className="stat-card">
            <div className="stat-val">{lists.length}</div>
            <div className="stat-lbl">Listen</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{totalWishes}</div>
            <div className="stat-lbl">Wünsche</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">{totalReserved}</div>
            <div className="stat-lbl">Reserviert</div>
          </div>
          <div className="stat-card">
            <div className="stat-val">0</div>
            <div className="stat-lbl">Sammlungen</div>
          </div>
        </div>

        {/* Lists */}
        {loading ? (
          <div style={{ color:'var(--muted)', padding:'40px 0', textAlign:'center' }}>Lädt…</div>
        ) : lists.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎁</div>
            <h2 className="empty-title">Noch keine Liste</h2>
            <p className="empty-sub">Erstelle deine erste Wunschliste — für Hochzeit, Geburtstag oder einfach so.</p>
            <button className="btn btn-dark" onClick={() => setShowNew(true)}>Erste Liste erstellen</button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:14 }}>
            {lists.map(list => (
              <div key={list.id} className="card" style={{ padding:20, cursor:'pointer' }} onClick={() => navigate(`/list/${list.id}`)}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                  <span style={{ fontSize:'1.6rem' }}>{OCC[list.occasion] || '🎁'}</span>
                  <span className="badge badge-low">{OCC_LBL[list.occasion] || 'Sonstiges'}</span>
                </div>
                <div style={{ fontWeight:600, color:'var(--black)', fontSize:'.95rem', marginBottom:4 }}>{list.name}</div>
                {list.event_date && (
                  <div style={{ fontSize:'.76rem', color:'var(--muted)', marginBottom:4 }}>
                    📅 {new Date(list.event_date).toLocaleDateString('de-DE')}
                  </div>
                )}
                <div style={{ fontSize:'.76rem', color:'var(--muted)', marginTop:12, paddingTop:12, borderTop:'1px solid var(--border)', display:'flex', justifyContent:'space-between' }}>
                  <span>Liste öffnen</span>
                  <span style={{ color:'var(--ai)', fontWeight:500 }}>→</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* New List Modal */}
      {showNew && (
        <div className="modal-bg open" onClick={e => e.target === e.currentTarget && setShowNew(false)}>
          <div className="modal">
            <h2>Neue Liste</h2>
            <p className="sub">Wähle einen Anlass und gib deiner Liste einen Namen.</p>
            <div className="occ-grid" style={{ marginBottom:14 }}>
              {Object.entries(OCC).map(([k, icon]) => (
                <button key={k} className={`occ-btn${newOcc === k ? ' sel' : ''}`} onClick={() => setNewOcc(k)}>
                  <span style={{ fontSize:'1.3rem' }}>{icon}</span>
                  <span>{OCC_LBL[k]}</span>
                </button>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div className="field">
                <label>Listenname *</label>
                <input value={newName} onChange={e => setNewName(e.target.value)}
                  placeholder={newOcc === 'wedding' ? 'Emma & James – Hochzeit 2025' : 'Mein Geburtstag 2025'}
                  onKeyDown={e => e.key === 'Enter' && createList()} autoFocus />
              </div>
              <div className="field">
                <label>Datum (optional)</label>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
              </div>
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost btn-sm" onClick={() => setShowNew(false)}>Abbrechen</button>
              <button className="btn btn-dark btn-sm" onClick={createList} disabled={creating}>
                {creating ? 'Erstellt…' : 'Liste erstellen'}
              </button>
            </div>
          </div>
        </div>
      )}

      {ToastEl}
    </div>
  )
}
