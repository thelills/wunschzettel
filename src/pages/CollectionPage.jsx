import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Nav from '../components/layout/Nav'
import { useToast } from '../hooks/useToast.jsx'
import { fetchProductData, getAmazonImageUrl, genAffiliateLink, extractAsin } from '../lib/affiliate'

const btn = (dark) => ({ display:'inline-flex', alignItems:'center', gap:5, padding:'7px 16px', borderRadius:8, border:dark?'none':'1px solid #ebebeb', cursor:'pointer', background:dark?'#1d1d1f':'#fff', color:dark?'#fff':'#6e6e73', fontSize:'.78rem', fontWeight:dark?600:500, fontFamily:'inherit', whiteSpace:'nowrap', flexShrink:0 })

// Klickbare Produkt-Karte — ganzer Bereich öffnet Amazon-Link
function ItemCard({ item, onDelete }) {
  const affUrl = item.affiliate_url || item.url
  const imgSrc = item.image_url

  const cardContent = (
    <div style={{ background:'#fff', border:'1px solid #ebebeb', borderRadius:16, overflow:'hidden', display:'flex', flexDirection:'column', minWidth:0, transition:'all .15s', cursor: affUrl ? 'pointer' : 'default' }}
      onClick={() => affUrl && window.open(affUrl, '_blank', 'noopener')}
    >
      {/* Image area */}
      <div style={{ height:160, background:'#f9f9f9', position:'relative', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {imgSrc ? (
          <img src={imgSrc} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'contain', padding:8 }}
            onError={e => {
              const asin = item.affiliate_url?.match(/\/dp\/([A-Z0-9]{10})/i)?.[1]
              if (asin && !e.target.dataset.tried) {
                e.target.dataset.tried = '1'
                e.target.src = `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`
              } else { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }
            }}
          />
        ) : null}
        <div style={{ fontSize:'2.2rem', display: imgSrc?'none':'flex', position:'absolute', inset:0, alignItems:'center', justifyContent:'center' }}>🎁</div>
        {affUrl && <div style={{ position:'absolute', bottom:6, right:6, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)', color:'#fff', fontSize:'.62rem', fontWeight:600, padding:'2px 7px', borderRadius:5 }}>Amazon →</div>}
      </div>
      {/* Body */}
      <div style={{ padding:'12px 14px 8px', flex:1 }}>
        <div style={{ fontWeight:600, color:'#1d1d1f', fontSize:'.88rem', lineHeight:1.35, marginBottom:4 }}>{item.name}</div>
        {item.note && <div style={{ fontSize:'.74rem', color:'#6e6e73', lineHeight:1.5, marginBottom:6 }}>{item.note}</div>}
        {item.price && <div style={{ fontWeight:700, color:'#1d1d1f', fontSize:'.95rem' }}>€{Number(item.price).toFixed(2)}</div>}
      </div>
      {/* Footer */}
      <div style={{ padding:'8px 14px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid #f5f5f5' }}
        onClick={e => e.stopPropagation()} // prevent card click when deleting
      >
        <div style={{ fontSize:'.72rem', color:'#aeaeb2' }}>{item.category || 'Idee'}</div>
        {onDelete && (
          <button onClick={() => onDelete(item.id)} style={{ width:28, height:28, borderRadius:7, border:'1px solid #ebebeb', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#ef4444' }}>
            <svg width="11" height="11" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2.5h3v1M4 3.5l.5 7h4L9 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        )}
      </div>
    </div>
  )

  return cardContent
}

export default function CollectionPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast, ToastEl } = useToast()

  const [col, setCol] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name:'', url:'', price:'', note:'', category:'' })
  const [saving, setSaving] = useState(false)
  const [fetching, setFetching] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => { load() }, [id])

  async function load() {
    const { data: c } = await supabase.from('collections').select('*').eq('id', id).single()
    const { data: its } = await supabase.from('collection_items').select('*').eq('collection_id', id).order('created_at', { ascending: false })
    setCol(c); setItems(its || []); setLoading(false)
  }

  async function autoFetch() {
    if (!form.url?.startsWith('http')) return
    setFetching(true)
    const data = await fetchProductData(form.url)
    if (data) {
      if (data.name) setForm(f => ({ ...f, name: data.name }))
      if (data.price) setForm(f => ({ ...f, price: String(data.price) }))
      window._colPendingImg = data.imgUrl || null
    }
    setFetching(false)
  }

  async function addItem() {
    if (!form.name.trim()) { toast('Name fehlt'); return }
    setSaving(true)
    const aff = genAffiliateLink(form.url)
    const asin = extractAsin(form.url)
    const insertData = {
      collection_id: id,
      name: form.name.trim(),
      url: form.url || null,
      affiliate_url: aff.url,
      affiliate_id: aff.id,
      image_url: window._colPendingImg || (asin ? getAmazonImageUrl(asin) : null),
      price: parseFloat(form.price) || null,
      note: form.note || null,
    }
    if (form.category) insertData.category = form.category
    const { error } = await supabase.from('collection_items').insert(insertData)
    setSaving(false)
    window._colPendingImg = null
    if (error) { toast('Fehler: ' + error.message); return }
    setForm({ name:'', url:'', price:'', note:'', category:'' })
    setShowAdd(false)
    toast('✓ Idee gespeichert')
    load()
  }

  async function deleteItem(itemId) {
    await supabase.from('collection_items').delete().eq('id', itemId)
    setItems(is => is.filter(i => i.id !== itemId))
    toast('Entfernt')
  }

  function share() {
    navigator.clipboard?.writeText(`${window.location.origin}/c/${col?.slug}`)
    toast('✓ Link kopiert')
  }

  if (loading) return <div style={{ background:'#fafaf8', minHeight:'100vh' }}><Nav /><div style={{ padding:'48px 32px', color:'#aeaeb2' }}>Lädt…</div></div>
  if (!col) return <div style={{ background:'#fafaf8', minHeight:'100vh' }}><Nav /><div style={{ padding:'48px 32px' }}>Nicht gefunden.</div></div>

  return (
    <div style={{ background:'#fafaf8', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Nav />
      <div style={{ flex:1, maxWidth:1040, margin:'0 auto', padding:'28px 32px 80px', width:'100%', boxSizing:'border-box' }}>

        <button onClick={() => navigate('/collections')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'.78rem', color:'#aeaeb2', display:'flex', alignItems:'center', gap:4, padding:0, marginBottom:10, fontFamily:'inherit' }}>
          ← Sammlungen
        </button>
        <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:20 }}>
          <div>
            <h1 style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:'1.75rem', fontWeight:400, color:'#1d1d1f', letterSpacing:'-.02em', marginBottom:4 }}>{col.name}</h1>
            {col.description && <p style={{ fontSize:'.82rem', color:'#aeaeb2' }}>{col.description}</p>}
          </div>
          <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
            <button style={btn(true)} onClick={() => setShowAdd(s => !s)}>+ Idee hinzufügen</button>
            <button style={btn(false)} onClick={share}>Teilen</button>
          </div>
        </div>

        {/* Add Form */}
        {showAdd && (
          <div style={{ background:'#fff', border:'1px solid #ebebeb', borderRadius:16, padding:20, marginBottom:20 }}>
            <div style={{ fontWeight:600, fontSize:'.9rem', marginBottom:14, color:'#1d1d1f' }}>Idee hinzufügen</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="field" style={{ gridColumn:'1/-1' }}>
                <label>Produkt-URL (optional)</label>
                <div style={{ display:'flex', gap:8 }}>
                  <input type="url" value={form.url} onChange={set('url')} placeholder="https://amazon.de/dp/…" style={{ flex:1 }} />
                  <button style={btn(false)} onClick={autoFetch} disabled={!form.url?.startsWith('http')||fetching}>{fetching?'…':'Laden'}</button>
                </div>
              </div>
              <div className="field" style={{ gridColumn:'1/-1' }}>
                <label>Produktname *</label>
                <input value={form.name} onChange={set('name')} placeholder="z.B. Kaffeemaschine De'Longhi" onKeyDown={e => e.key==='Enter' && addItem()} autoFocus />
              </div>
              <div className="field">
                <label>Preis (€)</label>
                <input type="number" value={form.price} onChange={set('price')} placeholder="99" />
              </div>
              <div className="field">
                <label>Kategorie</label>
                <input value={form.category} onChange={set('category')} placeholder="z.B. Küche, Technik…" />
              </div>
              <div className="field" style={{ gridColumn:'1/-1' }}>
                <label>Notiz (optional)</label>
                <textarea value={form.note} onChange={set('note')} placeholder="z.B. Lieblingsfarbe ist Rot" style={{ minHeight:56 }} />
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <button style={btn(true)} onClick={addItem} disabled={saving}>{saving?'Speichert…':'Speichern'}</button>
              <button style={btn(false)} onClick={() => setShowAdd(false)}>Abbrechen</button>
            </div>
          </div>
        )}

        {/* Items Grid */}
        {items.length === 0 && !showAdd ? (
          <div style={{ textAlign:'center', padding:'64px 20px' }}>
            <div style={{ fontSize:'2rem', marginBottom:14 }}>💡</div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'1.3rem', color:'#1d1d1f', marginBottom:8 }}>Noch keine Ideen</h2>
            <p style={{ fontSize:'.84rem', color:'#6e6e73', marginBottom:20 }}>Füge eine Amazon-URL ein oder trage eine Idee manuell ein.</p>
            <button style={btn(true)} onClick={() => setShowAdd(true)}>+ Idee hinzufügen</button>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
            {items.map(item => (
              <ItemCard key={item.id} item={item} onDelete={deleteItem} />
            ))}
          </div>
        )}
      </div>

      <footer style={{ borderTop:'1px solid #ebebeb', padding:'20px 32px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12, background:'#fff' }}>
        <span style={{ fontSize:'.74rem', color:'#aeaeb2' }}>© Dein Wunsch 2026 · Niklas Lill</span>
      </footer>
      {ToastEl}
    </div>
  )
}
