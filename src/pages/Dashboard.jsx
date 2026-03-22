import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Nav from '../components/layout/Nav'
import { useToast } from '../hooks/useToast.jsx'

const OCC = { wedding:'💍', birthday:'🎂', baby:'🍼', christmas:'🎄', housewarming:'🏠', other:'🎁' }
const OCC_LBL = { wedding:'Hochzeit', birthday:'Geburtstag', baby:'Babyparty', christmas:'Weihnachten', housewarming:'Einzug', other:'Sonstiges' }

export default function Dashboard() {
  const { user, userName } = useAuth()
  const navigate = useNavigate()
  const { toast, ToastEl } = useToast()
  const [lists, setLists] = useState([])
  const [loading, setLoading] = useState(true)
  const [totalWishes, setTotalWishes] = useState(0)
  const [totalReserved, setTotalReserved] = useState(0)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newOcc, setNewOcc] = useState('birthday')
  const [newDate, setNewDate] = useState('')
  const [creating, setCreating] = useState(false)
  const [renameList, setRenameList] = useState(null)
  const [renameName, setRenameName] = useState('')
  const [shareList, setShareList] = useState(null)

  useEffect(() => { loadLists() }, [user])

  async function loadLists() {
    if (!user) return
    const { data } = await supabase.from('registries').select('*').eq('user_id', user.id).order('created_at', { ascending: false })
    setLists(data || [])
    if (data?.length > 0) {
      const { data: wishes } = await supabase.from('wishes').select('registry_id, is_reserved').in('registry_id', data.map(l => l.id))
      if (wishes) { setTotalWishes(wishes.length); setTotalReserved(wishes.filter(w => w.is_reserved).length) }
    }
    setLoading(false)
  }

  async function createList() {
    if (!newName.trim()) { toast('Name fehlt'); return }
    setCreating(true)
    const slug = newName.toLowerCase()
      .replace(/[äöüß]/g, c => ({ ä:'ae', ö:'oe', ü:'ue', ß:'ss' }[c] || c))
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40) + '-' + Date.now().toString(36)
    const { data, error } = await supabase.from('registries').insert({
      user_id: user.id, name: newName.trim(), occasion: newOcc,
      event_date: newDate || null, slug, is_public: true
    }).select().single()
    setCreating(false)
    if (error) { toast('Fehler: ' + error.message); return }
    setShowNew(false); setNewName(''); setNewDate('')
    navigate(`/list/${data.id}`)
  }

  async function deleteList(list) {
    if (!confirm(`"${list.name}" wirklich löschen?`)) return
    await supabase.from('wishes').delete().eq('registry_id', list.id)
    await supabase.from('registries').delete().eq('id', list.id)
    setLists(ls => ls.filter(l => l.id !== list.id))
    toast('Liste gelöscht')
  }

  async function doRename() {
    if (!renameName.trim()) return
    await supabase.from('registries').update({ name: renameName.trim() }).eq('id', renameList.id)
    setLists(ls => ls.map(l => l.id === renameList.id ? { ...l, name: renameName.trim() } : l))
    setRenameList(null); toast('✓ Umbenannt')
  }

  function copyLink(list) {
    navigator.clipboard?.writeText(`${window.location.origin}/r/${list.slug}`)
    toast('✓ Link kopiert')
  }

  const s = {
    wrap: { minHeight:'100vh', display:'flex', flexDirection:'column', background:'#fafaf8' },
    inner: { flex:1, maxWidth:1040, margin:'0 auto', padding:'32px 32px 80px', width:'100%', boxSizing:'border-box' },
    statsRow: { display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:24 },
    statCard: { background:'#fff', border:'1px solid #ebebeb', borderRadius:12, padding:'16px 20px', minWidth:0 },
    statVal: { fontFamily:"'DM Serif Display',Georgia,serif", fontSize:'1.8rem', color:'#1d1d1f', lineHeight:1 },
    statLbl: { fontSize:'.65rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'.07em', color:'#aeaeb2', marginTop:4 },
    listsGrid: { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 },
    card: { background:'#fff', border:'1px solid #ebebeb', borderRadius:16, padding:20, minWidth:0 },
    head: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:20 },
    iconBtn: { width:34, height:34, borderRadius:8, border:'1px solid #ebebeb', background:'#fff', cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center', color:'#6e6e73', flexShrink:0 },
  }

  return (
    <div style={s.wrap}>
      <Nav />
      <div style={s.inner}>
        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:'1.7rem', fontWeight:400, color:'#1d1d1f', letterSpacing:'-.02em' }}>
              Hallo, {userName?.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize:'.82rem', color:'#aeaeb2', marginTop:2 }}>Deine Wunschlisten</p>
          </div>
          <button onClick={() => setShowNew(true)} style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'9px 20px', borderRadius:100, border:'none', cursor:'pointer', background:'#1d1d1f', color:'#fff', fontSize:'.84rem', fontWeight:600, fontFamily:'inherit', whiteSpace:'nowrap' }}>
            + Neue Liste
          </button>
        </div>

        {/* Stats */}
        <div style={s.statsRow}>
          {[[lists.length,'Listen'],[totalWishes,'Wünsche'],[totalReserved,'Reserviert'],[0,'Sammlungen']].map(([v,l]) => (
            <div key={l} style={s.statCard}>
              <div style={s.statVal}>{v}</div>
              <div style={s.statLbl}>{l}</div>
            </div>
          ))}
        </div>

        {/* Lists */}
        {loading ? (
          <div style={{ color:'#aeaeb2', padding:'48px 0', textAlign:'center' }}>Lädt…</div>
        ) : lists.length === 0 ? (
          <div style={{ textAlign:'center', padding:'64px 20px' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:16 }}>🎁</div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'1.3rem', color:'#1d1d1f', marginBottom:8 }}>Noch keine Liste</h2>
            <p style={{ fontSize:'.84rem', color:'#6e6e73', marginBottom:20, maxWidth:260, margin:'0 auto 20px' }}>Erstelle deine erste Wunschliste für jeden Anlass.</p>
            <button onClick={() => setShowNew(true)} style={{ padding:'9px 20px', borderRadius:100, border:'none', cursor:'pointer', background:'#1d1d1f', color:'#fff', fontSize:'.84rem', fontWeight:600, fontFamily:'inherit' }}>
              Erste Liste erstellen
            </button>
          </div>
        ) : (
          <div style={s.listsGrid}>
            {lists.map(list => (
              <div key={list.id} style={s.card}>
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                  <span style={{ fontSize:'1.6rem' }}>{OCC[list.occasion] || '🎁'}</span>
                  <span style={{ fontSize:'.68rem', fontWeight:600, padding:'3px 9px', borderRadius:100, background:'#f0fdf4', color:'#15803d' }}>{OCC_LBL[list.occasion] || 'Sonstiges'}</span>
                </div>
                <div style={{ fontWeight:600, color:'#1d1d1f', fontSize:'.95rem', marginBottom:4 }}>{list.name}</div>
                {list.event_date && <div style={{ fontSize:'.75rem', color:'#aeaeb2', marginBottom:8 }}>📅 {new Date(list.event_date).toLocaleDateString('de-DE')}</div>}
                <div style={{ display:'flex', gap:6, marginTop:14, paddingTop:12, borderTop:'1px solid #ebebeb', alignItems:'center' }}>
                  <button onClick={() => navigate(`/list/${list.id}`)} style={{ flex:1, padding:'8px 0', borderRadius:10, border:'none', cursor:'pointer', background:'#1d1d1f', color:'#fff', fontSize:'.8rem', fontWeight:600, fontFamily:'inherit' }}>
                    Öffnen
                  </button>
                  <button style={s.iconBtn} title="Teilen" onClick={() => setShareList(list)}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="10.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="10.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="2.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M4 5.8l5-2.6M4 7.2l5 2.6" stroke="currentColor" strokeWidth="1.1"/></svg>
                  </button>
                  <button style={s.iconBtn} title="Umbenennen" onClick={() => { setRenameList(list); setRenameName(list.name) }}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 9.5l1.5-1.5 5-5 1.5 1.5-5 5L2 11v-1.5z" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/><path d="M7.5 4L9 5.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/></svg>
                  </button>
                  <button style={{ ...s.iconBtn, color:'#ef4444' }} title="Löschen" onClick={() => deleteList(list)}>
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2.5h3v1M4 3.5l.5 7h4L9 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer style={{ borderTop:'1px solid #ebebeb', padding:'20px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, background:'#fff' }}>
        <span style={{ fontSize:'.74rem', color:'#aeaeb2' }}>© Dein Wunsch 2026 · Niklas Lill</span>
        <div style={{ display:'flex', gap:20 }}>
          {[['Impressum','/impressum.html'],['Datenschutz','/datenschutz.html']].map(([l,h]) => (
            <a key={l} href={h} style={{ fontSize:'.74rem', color:'#aeaeb2', textDecoration:'none' }}>{l}</a>
          ))}
        </div>
      </footer>

      {/* Neue Liste Modal */}
      {showNew && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)', backdropFilter:'blur(8px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={e => e.target===e.currentTarget && setShowNew(false)}>
          <div style={{ background:'#fff', borderRadius:20, padding:28, width:'100%', maxWidth:400, boxShadow:'0 24px 80px rgba(0,0,0,.15)' }}>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'1.4rem', fontWeight:400, color:'#1d1d1f', marginBottom:6 }}>Neue Liste</h2>
            <p style={{ fontSize:'.84rem', color:'#6e6e73', marginBottom:18 }}>Wähle einen Anlass und gib der Liste einen Namen.</p>
            <div className="occ-grid" style={{ marginBottom:16 }}>
              {Object.entries(OCC).map(([k, icon]) => (
                <button key={k} className={`occ-btn${newOcc===k?' sel':''}`} onClick={() => setNewOcc(k)}>
                  <span style={{ fontSize:'1.3rem' }}>{icon}</span>
                  <span>{OCC_LBL[k]}</span>
                </button>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div className="field"><label>Listenname *</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="z.B. Mein Geburtstag 2025" onKeyDown={e => e.key==='Enter' && createList()} autoFocus />
              </div>
              <div className="field"><label>Datum (optional)</label>
                <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} />
              </div>
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:20 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowNew(false)}>Abbrechen</button>
              <button className="btn btn-dark btn-sm" onClick={createList} disabled={creating}>{creating?'Erstellt…':'Liste erstellen'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Umbenennen Modal */}
      {renameList && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)', backdropFilter:'blur(8px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={e => e.target===e.currentTarget && setRenameList(null)}>
          <div style={{ background:'#fff', borderRadius:20, padding:28, width:'100%', maxWidth:380 }}>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'1.3rem', fontWeight:400, color:'#1d1d1f', marginBottom:16 }}>Liste umbenennen</h2>
            <div className="field"><label>Neuer Name</label>
              <input value={renameName} onChange={e => setRenameName(e.target.value)} onKeyDown={e => e.key==='Enter' && doRename()} autoFocus />
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:16 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setRenameList(null)}>Abbrechen</button>
              <button className="btn btn-dark btn-sm" onClick={doRename}>Speichern</button>
            </div>
          </div>
        </div>
      )}

      {/* Teilen Modal */}
      {shareList && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)', backdropFilter:'blur(8px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={e => e.target===e.currentTarget && setShareList(null)}>
          <div style={{ background:'#fff', borderRadius:20, padding:28, width:'100%', maxWidth:400 }}>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'1.3rem', fontWeight:400, color:'#1d1d1f', marginBottom:6 }}>Liste teilen</h2>
            <p style={{ fontSize:'.84rem', color:'#6e6e73', marginBottom:16 }}>Jeder mit diesem Link kann die Liste öffnen — ohne App, ohne Konto.</p>
            <div style={{ display:'flex', gap:8 }}>
              <input readOnly value={`${window.location.origin}/r/${shareList.slug}`} style={{ flex:1, fontSize:'.8rem', padding:'9px 13px', border:'1px solid #ebebeb', borderRadius:8, fontFamily:'monospace', color:'#6e6e73' }} onClick={e => e.target.select()} />
              <button className="btn btn-dark btn-sm" onClick={() => { copyLink(shareList); setShareList(null) }}>Kopieren</button>
            </div>
            <div style={{ marginTop:12, padding:12, background:'#fafaf8', borderRadius:10, fontSize:'.76rem', color:'#6e6e73', lineHeight:1.55 }}>
              💡 Schenkende können Wünsche reservieren — du siehst nicht wer was kauft.
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:14 }}>
              <button className="btn btn-ghost btn-sm" onClick={() => setShareList(null)}>Schließen</button>
            </div>
          </div>
        </div>
      )}

      {ToastEl}
    </div>
  )
}
