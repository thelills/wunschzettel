import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Nav from '../components/layout/Nav'
import { useToast } from '../hooks/useToast.jsx'
import { getSuggestions } from '../lib/giftdb'
import { genAffiliateLink, extractAsin, getAmazonImageUrl } from '../lib/affiliate'

const PRIO_LBL = { high:'Muss sein', med:'Sehr gerne', low:'Nice to have' }
const PRIO_BADGE = { high:'badge-high', med:'badge-med', low:'badge-low' }
const AMAZON_TAG = 'dein-wunsch-21'

export default function ListPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { toast, ToastEl } = useToast()

  const [list, setList] = useState(null)
  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [showAI, setShowAI] = useState(false)
  const [aiSugs, setAiSugs] = useState([])
  const [aiParams, setAiParams] = useState({ age: 30, gender: 'u', budgetMax: 150 })
  const [form, setForm] = useState({ name:'', price:'', url:'', note:'', prio:'med' })
  const [saving, setSaving] = useState(false)
  const [fetching, setFetching] = useState(false)
  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  useEffect(() => { load() }, [id])

  async function load() {
    const { data: l } = await supabase.from('registries').select('*').eq('id', id).single()
    const { data: w } = await supabase.from('wishes').select('*').eq('registry_id', id).order('created_at', { ascending: false })
    setList(l); setWishes(w || []); setLoading(false)
  }

  async function addWish() {
    if (!form.name.trim()) { toast('Name fehlt'); return }
    setSaving(true)
    const aff = genAffiliateLink(form.url)
    const asin = extractAsin(form.url)
    const { error } = await supabase.from('wishes').insert({
      registry_id: id, user_id: user.id,
      name: form.name.trim(), price: parseFloat(form.price) || null,
      url: form.url || null, aff_url: aff.url, aff_id: aff.id,
      asin, img_url: asin ? getAmazonImageUrl(asin) : null,
      note: form.note || null, priority: form.prio,
      wish_type: 'single', is_reserved: false, ai_generated: false,
    })
    setSaving(false)
    if (error) { toast('Fehler: ' + error.message); return }
    setForm({ name:'', price:'', url:'', note:'', prio:'med' })
    setShowAdd(false)
    toast(aff.mon ? '✓ Gespeichert mit Affiliate-Link' : '✓ Wunsch gespeichert')
    load()
  }

  async function addAiWish(s) {
    const { error } = await supabase.from('wishes').insert({
      registry_id: id, user_id: user.id,
      name: s.name, price: s.price, note: s.note,
      asin: s.asin, aff_url: s.affUrl, aff_id: s.asin ? 'amazon' : null,
      img_url: s.imgUrl, priority: 'med', wish_type: 'single',
      is_reserved: false, ai_generated: true,
    })
    if (!error) { toast('✓ Hinzugefügt'); load() }
  }

  async function deleteWish(wid) {
    await supabase.from('wishes').delete().eq('id', wid)
    setWishes(w => w.filter(x => x.id !== wid))
    toast('Entfernt')
  }

  async function autoFetch() {
    if (!form.url?.startsWith('http')) return
    setFetching(true)
    try {
      const r = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(form.url)}`, { signal: AbortSignal.timeout(8000) })
      const { contents: h } = await r.json()
      const og = p => h.match(new RegExp(`<meta[^>]+property=["']${p}["'][^>]+content=["']([^"']+)["']`, 'i'))?.[1]
      const title = (og('og:title') || h.match(/<title>([^<]+)<\/title>/i)?.[1] || '').replace(/\s*[|–\-—]\s*(Amazon|Zalando).*/i,'').trim().slice(0,100)
      const price = og('product:price:amount')
      if (title) setForm(f => ({ ...f, name: title }))
      if (price) setForm(f => ({ ...f, price: parseFloat(price.replace(',','.')) }))
    } catch {}
    setFetching(false)
  }

  function loadSuggestions() {
    setAiSugs(getSuggestions({ ...aiParams, occasion: list?.occasion }))
  }

  const shareUrl = `${window.location.origin}/r/${list?.slug}`

  if (loading) return <div><Nav /><div className="shell" style={{ color:'var(--muted)' }}>Lädt…</div></div>
  if (!list) return <div><Nav /><div className="shell">Liste nicht gefunden.</div></div>

  return (
    <div>
      <Nav />
      <div className="shell animate-lift">

        {/* Header */}
        <div className="page-head">
          <div>
            <button onClick={() => navigate('/dashboard')} style={{ fontSize:'.78rem', color:'var(--muted)', background:'none', border:'none', cursor:'pointer', marginBottom:6, display:'flex', alignItems:'center', gap:4 }}>
              ← Listen
            </button>
            <h1 className="ph-title">{list.name}</h1>
            {list.event_date && <p className="ph-sub">📅 {new Date(list.event_date).toLocaleDateString('de-DE')}</p>}
          </div>
          <div className="ph-actions">
            <button className="btn btn-ai btn-sm" onClick={() => { setShowAI(s => !s); if (!showAI) loadSuggestions() }}>✦ KI-Vorschläge</button>
            <button className="btn btn-ghost btn-sm" onClick={() => { navigator.clipboard?.writeText(shareUrl); toast('Link kopiert!') }}>Teilen</button>
            <button className="btn btn-dark btn-sm" onClick={() => setShowAdd(s => !s)}>+ Wunsch</button>
          </div>
        </div>

        {/* AI Panel */}
        {showAI && (
          <div style={{ background:'var(--ai-s)', border:'1px solid var(--ai-b)', borderRadius:16, padding:20, marginBottom:20 }}>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:14 }}>
              <div>
                <div style={{ fontWeight:600, color:'var(--ai)', fontSize:'.9rem' }}>✦ KI-Vorschläge</div>
                <div style={{ fontSize:'.76rem', color:'var(--mid)', marginTop:2 }}>Klick auf eine Karte um sie zur Liste hinzuzufügen</div>
              </div>
              <button className="icon-btn" onClick={() => setShowAI(false)}>×</button>
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:14 }}>
              {[['Alter', <input type="number" value={aiParams.age} onChange={e => setAiParams(p=>({...p,age:+e.target.value}))} style={{ width:70, padding:'6px 10px', border:'1px solid var(--border)', borderRadius:8, fontSize:'.82rem' }} />],
                ['Budget bis', <input type="number" value={aiParams.budgetMax} onChange={e => setAiParams(p=>({...p,budgetMax:+e.target.value}))} style={{ width:80, padding:'6px 10px', border:'1px solid var(--border)', borderRadius:8, fontSize:'.82rem' }} />],
              ].map(([lbl, el]) => (
                <div key={lbl} style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <span style={{ fontSize:'.75rem', color:'var(--mid)', whiteSpace:'nowrap' }}>{lbl}</span>{el}
                </div>
              ))}
              <select value={aiParams.gender} onChange={e => setAiParams(p=>({...p,gender:e.target.value}))} style={{ padding:'6px 10px', border:'1px solid var(--border)', borderRadius:8, fontSize:'.82rem', background:'var(--white)' }}>
                <option value="u">Keine Angabe</option>
                <option value="m">Männlich</option>
                <option value="f">Weiblich</option>
              </select>
              <button className="btn btn-ai btn-sm" onClick={loadSuggestions}>Laden</button>
            </div>
            <div className="ai-grid">
              {aiSugs.map((s, i) => (
                <div key={i} className="ai-card" onClick={() => addAiWish(s)}>
                  {s.popular && <div className="ai-card-pop">Beliebt</div>}
                  {s.imgUrl && <img src={s.imgUrl} alt={s.name} style={{ width:'100%', height:90, objectFit:'cover', borderRadius:8, marginBottom:8 }} onError={e => e.target.style.display='none'} />}
                  <div className="ai-card-name">{s.name}</div>
                  <div className="ai-card-note">{s.note}</div>
                  <div className="ai-card-foot">
                    <div className="ai-card-price">€{s.price}</div>
                    <div className="ai-add-btn">+ Hinzufügen</div>
                  </div>
                  {s.affUrl && (
                    <a href={s.affUrl} target="_blank" rel="noopener" className="ai-amazon-link" onClick={e => e.stopPropagation()}>
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M4 2H2.5A1.5 1.5 0 001 3.5v4A1.5 1.5 0 002.5 9h4A1.5 1.5 0 008 7.5V6M6 1h3v3M9 1L5 5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Amazon
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Form */}
        {showAdd && (
          <div className="card" style={{ padding:20, marginBottom:20 }}>
            <div style={{ fontWeight:600, fontSize:'.9rem', marginBottom:14 }}>Wunsch hinzufügen</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="field" style={{ gridColumn:'1/-1' }}>
                <label>Produkt-URL (optional)</label>
                <div style={{ display:'flex', gap:8 }}>
                  <input type="url" value={form.url} onChange={set('url')} placeholder="https://amazon.de/dp/…" style={{ flex:1 }} />
                  <button className="btn btn-ghost btn-sm" onClick={autoFetch} disabled={!form.url?.startsWith('http')||fetching}>{fetching?'…':'Laden'}</button>
                </div>
              </div>
              <div className="field" style={{ gridColumn:'1/-1' }}>
                <label>Wunschname *</label>
                <input value={form.name} onChange={set('name')} placeholder="z.B. KitchenAid Mixer" onKeyDown={e => e.key==='Enter' && addWish()} />
              </div>
              <div className="field"><label>Preis (€)</label><input type="number" value={form.price} onChange={set('price')} placeholder="99" /></div>
              <div className="field"><label>Priorität</label>
                <select value={form.prio} onChange={set('prio')}>
                  <option value="high">Muss sein</option>
                  <option value="med">Sehr gerne</option>
                  <option value="low">Nice to have</option>
                </select>
              </div>
              <div className="field" style={{ gridColumn:'1/-1' }}>
                <label>Hinweis (optional)</label>
                <textarea value={form.note} onChange={set('note')} placeholder="z.B. Bitte in Rot, Größe M" style={{ minHeight:60 }} />
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <button className="btn btn-dark btn-sm" onClick={addWish} disabled={saving}>{saving?'Speichert…':'Speichern'}</button>
              <button className="btn btn-ghost btn-sm" onClick={() => setShowAdd(false)}>Abbrechen</button>
            </div>
          </div>
        )}

        {/* Wishes Grid */}
        {wishes.length === 0 && !showAdd && !showAI ? (
          <div className="empty-state">
            <div className="empty-icon">✨</div>
            <h2 className="empty-title">Liste ist leer</h2>
            <p className="empty-sub">Füge deinen ersten Wunsch hinzu oder lass die KI Vorschläge machen.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button className="btn btn-dark" onClick={() => setShowAdd(true)}>+ Wunsch hinzufügen</button>
              <button className="btn btn-ai" onClick={() => { setShowAI(true); loadSuggestions() }}>✦ KI-Vorschläge</button>
            </div>
          </div>
        ) : (
          <div className="gift-grid">
            {wishes.map(w => {
              const affLink = w.aff_url || (w.asin ? `https://www.amazon.de/dp/${w.asin}?tag=${AMAZON_TAG}` : null)
              const imgSrc = w.img_url || (w.asin ? getAmazonImageUrl(w.asin) : null)
              return (
                <div key={w.id} className="gift-card">
                  {affLink ? (
                    <a href={affLink} target="_blank" rel="noopener" style={{ textDecoration:'none', color:'inherit' }}>
                      <div className="gc-img">
                        {imgSrc && <img src={imgSrc} alt={w.name} onError={e => e.target.style.display='none'} />}
                        <div className="gc-img-icon" style={{ display: imgSrc?'none':'flex' }}>🎁</div>
                        <div className={`gc-prio-dot ${w.priority}`} />
                        {w.ai_generated && <div className="gc-ai-badge">AI</div>}
                        <div className="gc-shop-badge">Amazon →</div>
                      </div>
                    </a>
                  ) : (
                    <div className="gc-img">
                      <div className="gc-img-icon">🎁</div>
                      <div className={`gc-prio-dot ${w.priority}`} />
                      {w.ai_generated && <div className="gc-ai-badge">AI</div>}
                    </div>
                  )}
                  <div className="gc-body">
                    <div className="gc-name">{w.name}</div>
                    {w.note && <div className="gc-note">{w.note}</div>}
                    {w.price && <div className="gc-price">€{Number(w.price).toFixed(2)}</div>}
                  </div>
                  <div className="gc-foot">
                    <div style={{ display:'flex', gap:4 }}>
                      <span className={`badge ${PRIO_BADGE[w.priority]}`}>{PRIO_LBL[w.priority]}</span>
                      {w.ai_generated && <span className="badge badge-ai">AI</span>}
                    </div>
                    <button className="icon-btn del" onClick={() => deleteWish(w.id)}>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 3h8M4.5 3V2h3v1M5 5.5v3M7 5.5v3M3 3l.5 7h5L9 3" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                  {w.is_reserved && (
                    <div className="res-veil">
                      <span style={{ fontSize:'1.5rem' }}>✓</span>
                      <div className="rv-label">Reserviert</div>
                      {w.reserved_by && <div className="rv-who">{w.reserved_by}</div>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
      {ToastEl}
    </div>
  )
}
