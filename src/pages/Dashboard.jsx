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
  // Rename/share modal
  const [renameList, setRenameList] = useState(null) // {id, name}
  const [renameName, setRenameName] = useState('')
  const [shareList, setShareList] = useState(null)   // list object

  useEffect(() => { loadLists() }, [user])

  async function loadLists() {
    if (!user) return
    const { data } = await supabase
      .from('registries').select('*').eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setLists(data || [])
    if (data && data.length > 0) {
      const ids = data.map(l => l.id)
      const { data: wishes } = await supabase.from('wishes').select('registry_id, is_reserved').in('registry_id', ids)
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

  async function deleteList(list) {
    if (!confirm(`"${list.name}" wirklich löschen? Alle Wünsche werden entfernt.`)) return
    await supabase.from('wishes').delete().eq('registry_id', list.id)
    await supabase.from('registries').delete().eq('id', list.id)
    setLists(ls => ls.filter(l => l.id !== list.id))
    toast('Liste gelöscht')
  }

  async function doRename() {
    if (!renameName.trim()) return
    const { error } = await supabase.from('registries').update({ name: renameName.trim() }).eq('id', renameList.id)
    if (error) { toast('Fehler'); return }
    setLists(ls => ls.map(l => l.id === renameList.id ? { ...l, name: renameName.trim() } : l))
    setRenameList(null)
    toast('✓ Umbenennt')
  }

  function copyShareLink(list) {
    const url = `${window.location.origin}/r/${list.slug}`
    navigator.clipboard?.writeText(url)
    toast('✓ Link kopiert!')
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Nav />
      <div className="shell animate-lift" style={{ flex:1 }}>

        <div className="page-head">
          <div>
            <h1 className="ph-title">Hallo, {userName} 👋</h1>
            <p className="ph-sub">Deine Wunschlisten</p>
          </div>
          <button className="btn btn-dark" onClick={() => setShowNew(true)}>+ Neue Liste</button>
        </div>

        <div className="stats-row">
          {[
            [lists.length, 'Listen'],
            [totalWishes, 'Wünsche'],
            [totalReserved, 'Reserviert'],
            [0, 'Sammlungen'],
          ].map(([val, lbl]) => (
            <div key={lbl} className="stat-card">
              <div className="stat-val">{val}</div>
              <div className="stat-lbl">{lbl}</div>
            </div>
          ))}
        </div>

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
              <div key={list.id} className="card" style={{ padding:20 }}>
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
                {/* Action row */}
                <div style={{ marginTop:14, paddingTop:12, borderTop:'1px solid var(--border)', display:'flex', gap:6, flexWrap:'wrap' }}>
                  <button className="btn btn-dark btn-sm" style={{ flex:1 }} onClick={() => navigate(`/list/${list.id}`)}>
                    Öffnen
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Teilen" onClick={() => setShareList(list)}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="10.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="10.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="2.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M4 5.8l5-2.6M4 7.2l5 2.6" stroke="currentColor" strokeWidth="1.1"/></svg>
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Umbenennen" onClick={() => { setRenameList(list); setRenameName(list.name) }}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 9.5l1.5-1.5 5-5 1.5 1.5-5 5L2 11v-1.5z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.5 4L9 5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                  </button>
                  <button className="btn btn-ghost btn-sm" title="Löschen" style={{ color:'#ef4444' }} onClick={() => deleteList(list)}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2.5h3v1M4 3.5l.5 7h4L9 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* ── Neue Liste Modal ── */}
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

      {/* ── Umbenennen Modal ── */}
      {renameList && (
        <div className="modal-bg open" onClick={e => e.target === e.currentTarget && setRenameList(null)}>
          <div className="modal">
            <h2>Liste umbenennen</h2>
            <div className="field" style={{ marginTop:12 }}>
              <label>Neuer Name</label>
              <input value={renameName} onChange={e => setRenameName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && doRename()} autoFocus />
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost btn-sm" onClick={() => setRenameList(null)}>Abbrechen</button>
              <button className="btn btn-dark btn-sm" onClick={doRename}>Speichern</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Teilen Modal ── */}
      {shareList && (
        <div className="modal-bg open" onClick={e => e.target === e.currentTarget && setShareList(null)}>
          <div className="modal">
            <h2>Liste teilen</h2>
            <p className="sub" style={{ marginBottom:16 }}>Dieser Link kann von jedem geöffnet werden — ohne App, ohne Konto.</p>
            <div style={{ display:'flex', gap:8 }}>
              <input
                readOnly
                value={`${window.location.origin}/r/${shareList.slug}`}
                style={{ flex:1, fontSize:'.82rem', color:'var(--muted)' }}
                onClick={e => e.target.select()}
              />
              <button className="btn btn-dark btn-sm" onClick={() => { copyShareLink(shareList); setShareList(null) }}>
                Kopieren
              </button>
            </div>
            <div style={{ marginTop:16, padding:12, background:'var(--surface)', borderRadius:10, fontSize:'.78rem', color:'var(--muted)', lineHeight:1.5 }}>
              💡 Teile diesen Link per WhatsApp, E-Mail oder einfach kopieren. Schenkende können Wünsche reservieren — du siehst nicht wer was kauft.
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost btn-sm" onClick={() => setShareList(null)}>Schließen</button>
            </div>
          </div>
        </div>
      )}

      {ToastEl}
    </div>
  )
}
