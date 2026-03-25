import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Nav from '../components/layout/Nav'
import { useToast } from '../hooks/useToast.jsx'
import { fetchProductData, getAmazonImageUrl, genAffiliateLink, extractAsin } from '../lib/affiliate'

const btn = (dark) => ({ display:'inline-flex', alignItems:'center', gap:5, padding:'7px 16px', borderRadius:8, border:dark?'none':'1px solid #ebebeb', cursor:'pointer', background:dark?'#1d1d1f':'#fff', color:dark?'#fff':'#6e6e73', fontSize:'.78rem', fontWeight:dark?600:500, fontFamily:'inherit', whiteSpace:'nowrap', flexShrink:0 })

export default function Collections() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast, ToastEl } = useToast()
  const [cols, setCols] = useState([])
  const [loading, setLoading] = useState(true)
  const [showNew, setShowNew] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => { load() }, [user])

  async function load() {
    if (!user) return
    const { data } = await supabase
      .from('collections')
      .select('*, collection_items(count)')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
    setCols(data || [])
    setLoading(false)
  }

  async function createCol() {
    if (!newName.trim()) { toast('Name fehlt'); return }
    setCreating(true)
    const slug = newName.toLowerCase()
      .replace(/[äöüß]/g, c => ({ ä:'ae', ö:'oe', ü:'ue', ß:'ss' }[c] || c))
      .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 40)
      + '-' + Date.now().toString(36)
    const { data, error } = await supabase.from('collections').insert({
      user_id: user.id,
      name: newName.trim(),
      description: newDesc.trim() || null,
      slug,
      is_public: true,
    }).select().single()
    setCreating(false)
    if (error) { toast('Fehler: ' + error.message); return }
    setShowNew(false); setNewName(''); setNewDesc('')
    navigate(`/collections/${data.id}`)
  }

  async function deleteCol(col) {
    if (!confirm(`"${col.name}" wirklich löschen?`)) return
    await supabase.from('collection_items').delete().eq('collection_id', col.id)
    await supabase.from('collections').delete().eq('id', col.id)
    setCols(cs => cs.filter(c => c.id !== col.id))
    toast('Sammlung gelöscht')
  }

  function copyLink(col) {
    navigator.clipboard?.writeText(`${window.location.origin}/c/${col.slug}`)
    toast('✓ Link kopiert')
  }

  return (
    <div style={{ background:'#fafaf8', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Nav />
      <div style={{ flex:1, maxWidth:1040, margin:'0 auto', padding:'28px 32px 80px', width:'100%', boxSizing:'border-box' }}>

        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24, flexWrap:'wrap', gap:12 }}>
          <div>
            <h1 style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:'1.7rem', fontWeight:400, color:'#1d1d1f', letterSpacing:'-.02em' }}>Sammlungen</h1>
            <p style={{ fontSize:'.82rem', color:'#aeaeb2', marginTop:2 }}>Geschenkideen für andere sammeln — übers Jahr</p>
          </div>
          <button onClick={() => setShowNew(true)} style={btn(true)}>+ Neue Sammlung</button>
        </div>

        {loading ? (
          <div style={{ color:'#aeaeb2', padding:'48px 0', textAlign:'center' }}>Lädt…</div>
        ) : cols.length === 0 ? (
          <div style={{ textAlign:'center', padding:'64px 20px' }}>
            <div style={{ fontSize:'2.5rem', marginBottom:16 }}>🗂️</div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'1.3rem', color:'#1d1d1f', marginBottom:8 }}>Noch keine Sammlung</h2>
            <p style={{ fontSize:'.84rem', color:'#6e6e73', marginBottom:20, maxWidth:300, margin:'0 auto 20px' }}>
              Sammle Geschenkideen für Papa, die beste Freundin oder wen auch immer — das ganze Jahr über.
            </p>
            <button onClick={() => setShowNew(true)} style={btn(true)}>Erste Sammlung erstellen</button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:14 }}>
            {cols.map(col => {
              const count = col.collection_items?.[0]?.count || 0
              return (
                <div key={col.id} style={{ background:'#fff', border:'1px solid #ebebeb', borderRadius:16, padding:20, minWidth:0 }}>
                  <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:12 }}>
                    <span style={{ fontSize:'1.6rem' }}>🗂️</span>
                    <span style={{ fontSize:'.68rem', fontWeight:600, padding:'3px 9px', borderRadius:100, background:'rgba(99,102,241,.08)', color:'#6366f1' }}>
                      {count} {count === 1 ? 'Idee' : 'Ideen'}
                    </span>
                  </div>
                  <div style={{ fontWeight:600, color:'#1d1d1f', marginBottom:4 }}>{col.name}</div>
                  {col.description && <div style={{ fontSize:'.8rem', color:'#aeaeb2', marginBottom:4 }}>{col.description}</div>}
                  <div style={{ display:'flex', gap:6, marginTop:14, paddingTop:12, borderTop:'1px solid #ebebeb', alignItems:'center' }}>
                    <button onClick={() => navigate(`/collections/${col.id}`)} style={{ flex:1, padding:'8px 0', borderRadius:10, border:'none', cursor:'pointer', background:'#1d1d1f', color:'#fff', fontSize:'.8rem', fontWeight:600, fontFamily:'inherit' }}>
                      Öffnen
                    </button>
                    <button style={{ width:34, height:34, borderRadius:8, border:'1px solid #ebebeb', background:'#fff', cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center', color:'#6e6e73' }} title="Teilen" onClick={() => copyLink(col)}>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><circle cx="10.5" cy="2.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="10.5" cy="10.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><circle cx="2.5" cy="6.5" r="1.5" stroke="currentColor" strokeWidth="1.1"/><path d="M4 5.8l5-2.6M4 7.2l5 2.6" stroke="currentColor" strokeWidth="1.1"/></svg>
                    </button>
                    <button style={{ width:34, height:34, borderRadius:8, border:'1px solid #ebebeb', background:'#fff', cursor:'pointer', display:'inline-flex', alignItems:'center', justifyContent:'center', color:'#ef4444' }} title="Löschen" onClick={() => deleteCol(col)}>
                      <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2.5h3v1M4 3.5l.5 7h4L9 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <footer style={{ borderTop:'1px solid #ebebeb', padding:'20px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, background:'#fff' }}>
        <span style={{ fontSize:'.74rem', color:'#aeaeb2' }}>© Dein Wunsch 2026 · Niklas Lill</span>
        <div style={{ display:'flex', gap:20 }}>
          {[['Impressum','/impressum.html'],['Datenschutz','/datenschutz.html']].map(([l,h]) => (
            <a key={l} href={h} style={{ fontSize:'.74rem', color:'#aeaeb2', textDecoration:'none' }}>{l}</a>
          ))}
        </div>
      </footer>

      {/* Neue Sammlung Modal */}
      {showNew && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.35)', backdropFilter:'blur(8px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={e => e.target===e.currentTarget && setShowNew(false)}>
          <div style={{ background:'#fff', borderRadius:20, padding:28, width:'100%', maxWidth:400 }}>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'1.4rem', fontWeight:400, color:'#1d1d1f', marginBottom:6 }}>Neue Sammlung</h2>
            <p style={{ fontSize:'.84rem', color:'#6e6e73', marginBottom:18 }}>Für wen sammelst du Ideen?</p>
            <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
              <div className="field">
                <label>Name *</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="z.B. Papa, Mama, Beste Freundin…" onKeyDown={e => e.key==='Enter' && createCol()} autoFocus />
              </div>
              <div className="field">
                <label>Beschreibung (optional)</label>
                <input value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="z.B. Ideen für Geburtstag 2026" />
              </div>
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end', marginTop:20 }}>
              <button style={btn(false)} onClick={() => setShowNew(false)}>Abbrechen</button>
              <button style={btn(true)} onClick={createCol} disabled={creating}>{creating?'Erstellt…':'Sammlung erstellen'}</button>
            </div>
          </div>
        </div>
      )}
      {ToastEl}
    </div>
  )
}
