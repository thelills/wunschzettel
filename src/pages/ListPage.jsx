import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import Nav from '../components/layout/Nav'
import { useToast } from '../hooks/useToast.jsx'
import { getSuggestions } from '../lib/giftdb'
import { genAffiliateLink, extractAsin, getAmazonImageUrl, getAmazonUrl, fetchProductData } from '../lib/affiliate'

const PRIO = { high:'Muss sein', med:'Sehr gerne', low:'Nice to have' }
const PRIO_C = { high:'#b91c1c', med:'#b45309', low:'#15803d' }
const PRIO_BG = { high:'#fef2f2', med:'#fffbeb', low:'#f0fdf4' }

const btn = (dark) => ({ display:'inline-flex', alignItems:'center', gap:5, padding:'7px 16px', borderRadius:8, border: dark?'none':'1px solid #ebebeb', cursor:'pointer', background: dark?'#1d1d1f':'#fff', color: dark?'#fff':'#6e6e73', fontSize:'.78rem', fontWeight: dark?600:500, fontFamily:'inherit', whiteSpace:'nowrap', flexShrink:0 })
const btnAi = { display:'inline-flex', alignItems:'center', gap:5, padding:'7px 16px', borderRadius:8, border:'1px solid rgba(99,102,241,.25)', cursor:'pointer', background:'rgba(99,102,241,.06)', color:'#6366f1', fontSize:'.78rem', fontWeight:600, fontFamily:'inherit', whiteSpace:'nowrap', flexShrink:0 }

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
  const [aiParams, setAiParams] = useState({ ageGroup:'30-39', gender:'u', budgetMax:150 })
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
      registry_id: id,
      name: form.name.trim(),
      price: parseFloat(form.price) || null,
      url: form.url || null,
      affiliate_url: aff.url,
      affiliate_id: aff.id,
      image_url: window._pendingImgUrl || (asin ? getAmazonImageUrl(asin) : null),
      note: form.note || null,
      priority: form.prio,
      type: 'single',
      is_reserved: false,
      ai_generated: false,
    })
    setSaving(false)
    if (error) { toast('Fehler: ' + error.message); return }
    setForm({ name:'', price:'', url:'', note:'', prio:'med' })
    window._pendingImgUrl = null
    setShowAdd(false)
    toast('✓ Wunsch gespeichert')
    load()
  }

  async function addAiWish(s) {
    const { error } = await supabase.from('wishes').insert({
      registry_id: id,
      name: s.name, price: s.price, note: s.cat,
      affiliate_url: s.affUrl,
      affiliate_id: s.asin ? 'amazon' : null,
      image_url: s.imgUrl,
      url: s.affUrl,
      priority: 'med', type: 'single',
      is_reserved: false, ai_generated: true,
    })
    if (!error) { toast('✓ Hinzugefügt'); load() }
    else toast('Fehler: ' + error.message)
  }

  async function deleteWish(wid) {
    await supabase.from('wishes').delete().eq('id', wid)
    setWishes(w => w.filter(x => x.id !== wid))
    toast('Entfernt')
  }

  async function autoFetch() {
    if (!form.url?.startsWith('http')) return
    setFetching(true)
    // fetchProductData is now synchronous-style (no proxy) — instant result
    const data = await fetchProductData(form.url)
    if (data) {
      if (data.name) setForm(f => ({ ...f, name: data.name }))
      if (data.price) setForm(f => ({ ...f, price: String(data.price) }))
      window._pendingImgUrl = data.imgUrl || null
    }
    setFetching(false)
  }

  function loadSuggestions() {
    const ageMap = {'18-29':24,'30-39':34,'40-49':44,'50-59':54,'60+':65}
    const age = ageMap[aiParams.ageGroup] || 34
    setAiSugs(getSuggestions({ age, gender:aiParams.gender, budgetMax:aiParams.budgetMax, occasion: list?.occasion }))
  }

  const shareUrl = `${window.location.origin}/r/${list?.slug}`

  if (loading) return <div style={{ background:'#fafaf8', minHeight:'100vh' }}><Nav /><div style={{ padding:'48px 32px', color:'#aeaeb2' }}>Lädt…</div></div>
  if (!list) return <div style={{ background:'#fafaf8', minHeight:'100vh' }}><Nav /><div style={{ padding:'48px 32px' }}>Liste nicht gefunden.</div></div>

  return (
    <div style={{ background:'#fafaf8', minHeight:'100vh', display:'flex', flexDirection:'column' }}>
      <Nav />
      <div style={{ flex:1, maxWidth:1040, margin:'0 auto', padding:'28px 32px 80px', width:'100%', boxSizing:'border-box' }}>

        {/* Back + Title */}
        <button onClick={() => navigate('/dashboard')} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'.78rem', color:'#aeaeb2', display:'flex', alignItems:'center', gap:4, padding:0, marginBottom:10, fontFamily:'inherit' }}>
          ← Meine Listen
        </button>
        <h1 style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:'1.75rem', fontWeight:400, color:'#1d1d1f', letterSpacing:'-.02em', marginBottom:4 }}>{list.name}</h1>
        {list.event_date && <p style={{ fontSize:'.8rem', color:'#aeaeb2', marginBottom:0 }}>📅 {new Date(list.event_date).toLocaleDateString('de-DE')}</p>}

        {/* Actions */}
        <div style={{ display:'flex', gap:8, margin:'16px 0 20px', flexWrap:'wrap' }}>
          <button style={btn(true)} onClick={() => setShowAdd(s => !s)}>+ Wunsch</button>
          <button style={btnAi} onClick={() => { setShowAI(s => !s); if (!showAI) loadSuggestions() }}>✦ KI-Vorschläge</button>
          <button style={btn(false)} onClick={() => { navigator.clipboard?.writeText(shareUrl); toast('Link kopiert!') }}>Teilen</button>
        </div>

        {/* AI Panel */}
        {showAI && (
          <div style={{ background:'rgba(99,102,241,.05)', border:'1px solid rgba(99,102,241,.18)', borderRadius:16, padding:20, marginBottom:20 }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
              <div>
                <div style={{ fontWeight:600, color:'#6366f1', fontSize:'.88rem' }}>✦ KI-Vorschläge</div>
                <div style={{ fontSize:'.74rem', color:'#6e6e73', marginTop:2 }}>Klick auf eine Karte um sie hinzuzufügen</div>
              </div>
              <button onClick={() => setShowAI(false)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:'1.2rem', color:'#aeaeb2', padding:'4px 8px' }}>×</button>
            </div>
            <div style={{ display:'flex', gap:10, flexWrap:'wrap', marginBottom:14, alignItems:'center' }}>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:'.74rem', color:'#6e6e73' }}>Altersgruppe</span>
                <select value={aiParams.ageGroup} onChange={e => setAiParams(p => ({ ...p, ageGroup: e.target.value }))} style={{ padding:'5px 9px', border:'1px solid #ebebeb', borderRadius:7, fontSize:'.82rem', fontFamily:'inherit', background:'#fff' }}>
                  <option value="18-29">18–29 Jahre</option>
                  <option value="30-39">30–39 Jahre</option>
                  <option value="40-49">40–49 Jahre</option>
                  <option value="50-59">50–59 Jahre</option>
                  <option value="60+">60+ Jahre</option>
                </select>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                <span style={{ fontSize:'.74rem', color:'#6e6e73' }}>Budget bis €</span>
                <input type="number" value={aiParams.budgetMax} onChange={e => setAiParams(p => ({ ...p, budgetMax: +e.target.value }))} style={{ width:80, padding:'5px 9px', border:'1px solid #ebebeb', borderRadius:7, fontSize:'.82rem', fontFamily:'inherit' }} />
              </div>
              <select value={aiParams.gender} onChange={e => setAiParams(p => ({ ...p, gender: e.target.value }))} style={{ padding:'6px 10px', border:'1px solid #ebebeb', borderRadius:7, fontSize:'.82rem', background:'#fff', fontFamily:'inherit' }}>
                <option value="u">Keine Angabe</option>
                <option value="m">Männlich</option>
                <option value="f">Weiblich</option>
              </select>
              <button style={btnAi} onClick={loadSuggestions}>Neu laden</button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(160px,1fr))', gap:10 }}>
              {aiSugs.map((s, i) => (
                <div key={i} onClick={() => addAiWish(s)} style={{ background:'#fff', border:'1px solid rgba(99,102,241,.2)', borderRadius:12, padding:14, position:'relative', cursor:'pointer', transition:'all .15s' }}>
                  {s.popular && <div style={{ position:'absolute', top:8, right:8, fontSize:'.58rem', fontWeight:700, color:'#6366f1', background:'rgba(99,102,241,.1)', padding:'2px 7px', borderRadius:100 }}>Beliebt</div>}
                  {s.imgUrl && (
                    <img src={s.imgUrl} alt={s.name} style={{ width:'100%', height:80, objectFit:'contain', borderRadius:6, marginBottom:8, background:'#f9f9f9' }} onError={e => e.target.style.display='none'} />
                  )}
                  <div style={{ fontSize:'.82rem', fontWeight:600, color:'#1d1d1f', lineHeight:1.3, marginBottom:4, paddingRight:s.popular?36:0 }}>{s.name}</div>
                  <div style={{ fontSize:'.72rem', color:'#aeaeb2', marginBottom:8 }}>{s.cat}</div>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div style={{ fontWeight:700, color:'#1d1d1f', fontSize:'.88rem' }}>€{s.price}</div>
                    <div style={{ fontSize:'.68rem', fontWeight:600, color:'#6366f1', background:'rgba(99,102,241,.08)', padding:'3px 8px', borderRadius:6 }}>+ Hinzufügen</div>
                  </div>
                  {s.affUrl && (
                    <a href={s.affUrl} target="_blank" rel="noopener" onClick={e => e.stopPropagation()} style={{ display:'inline-flex', alignItems:'center', gap:3, fontSize:'.68rem', color:'#aeaeb2', marginTop:6, textDecoration:'none' }}>
                      <svg width="9" height="9" viewBox="0 0 10 10" fill="none"><path d="M4 2H2.5A1.5 1.5 0 001 3.5v4A1.5 1.5 0 002.5 9h4A1.5 1.5 0 008 7.5V6M6 1h3v3M9 1L5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      Amazon.de
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Add Form */}
        {showAdd && (
          <div style={{ background:'#fff', border:'1px solid #ebebeb', borderRadius:16, padding:20, marginBottom:20 }}>
            <div style={{ fontWeight:600, fontSize:'.9rem', marginBottom:14, color:'#1d1d1f' }}>Wunsch hinzufügen</div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div className="field" style={{ gridColumn:'1/-1' }}>
                <label>Produkt-URL (optional)</label>
                <div style={{ display:'flex', gap:8 }}>
                  <input type="url" value={form.url} onChange={set('url')} placeholder="https://amazon.de/dp/…" style={{ flex:1 }} />
                  <button style={btn(false)} onClick={autoFetch} disabled={!form.url?.startsWith('http')||fetching}>{fetching?'…':'Laden'}</button>
                </div>
              </div>
              <div className="field" style={{ gridColumn:'1/-1' }}>
                <label>Wunschname *</label>
                <input value={form.name} onChange={set('name')} placeholder="z.B. KitchenAid Mixer" onKeyDown={e => e.key==='Enter' && addWish()} autoFocus />
              </div>
              <div className="field">
                <label>Preis (€)</label>
                <input type="number" value={form.price} onChange={set('price')} placeholder="99" />
              </div>
              <div className="field">
                <label>Priorität</label>
                <select value={form.prio} onChange={set('prio')}>
                  <option value="high">Muss sein</option>
                  <option value="med">Sehr gerne</option>
                  <option value="low">Nice to have</option>
                </select>
              </div>
              <div className="field" style={{ gridColumn:'1/-1' }}>
                <label>Hinweis (optional)</label>
                <textarea value={form.note} onChange={set('note')} placeholder="z.B. Bitte in Rot, Größe M" style={{ minHeight:56 }} />
              </div>
            </div>
            <div style={{ display:'flex', gap:8, marginTop:12 }}>
              <button style={btn(true)} onClick={addWish} disabled={saving}>{saving?'Speichert…':'Speichern'}</button>
              <button style={btn(false)} onClick={() => setShowAdd(false)}>Abbrechen</button>
            </div>
          </div>
        )}

        {/* Wishes */}
        {wishes.length === 0 && !showAdd && !showAI ? (
          <div style={{ textAlign:'center', padding:'64px 20px' }}>
            <div style={{ fontSize:'2rem', marginBottom:14 }}>✨</div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'1.3rem', color:'#1d1d1f', marginBottom:8 }}>Liste ist leer</h2>
            <p style={{ fontSize:'.84rem', color:'#6e6e73', marginBottom:20 }}>Füge deinen ersten Wunsch hinzu oder lass die KI Vorschläge machen.</p>
            <div style={{ display:'flex', gap:10, justifyContent:'center' }}>
              <button style={btn(true)} onClick={() => setShowAdd(true)}>+ Wunsch hinzufügen</button>
              <button style={btnAi} onClick={() => { setShowAI(true); loadSuggestions() }}>✦ KI-Vorschläge</button>
            </div>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
            {wishes.map(w => {
              const affLink = w.affiliate_url || w.url
              const imgSrc = w.image_url
              return (
                <div key={w.id} style={{ background:'#fff', border:'1px solid #ebebeb', borderRadius:16, overflow:'hidden', display:'flex', flexDirection:'column', position:'relative', minWidth:0 }}>
                  {/* Image */}
                  <div style={{ height:160, background:'#f9f9f9', position:'relative', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={w.name}
                        style={{ width:'100%', height:'100%', objectFit:'contain', padding:8 }}
                        onError={e => {
                          // Try fallback image formats
                          const asin = w.affiliate_id === 'amazon' && w.affiliate_url
                            ? w.affiliate_url.match(/\/dp\/([A-Z0-9]{10})/i)?.[1]
                            : null
                          if (asin && !e.target.dataset.tried) {
                            e.target.dataset.tried = '1'
                            e.target.src = `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`
                          } else {
                            e.target.style.display='none'
                            e.target.nextSibling.style.display='flex'
                          }
                        }}
                      />
                    ) : null}
                    <div style={{ fontSize:'2.5rem', display: imgSrc ? 'none' : 'flex', position:'absolute', inset:0, alignItems:'center', justifyContent:'center' }}>🎁</div>
                    {/* Priority dot */}
                    <div style={{ position:'absolute', top:10, left:10, width:8, height:8, borderRadius:'50%', background: PRIO_C[w.priority] || '#f59e0b' }} />
                    {w.ai_generated && <div style={{ position:'absolute', top:8, right:8, fontSize:'.58rem', fontWeight:700, background:'#6366f1', color:'#fff', padding:'2px 6px', borderRadius:100 }}>AI</div>}
                    {affLink && <div style={{ position:'absolute', bottom:6, right:6, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)', color:'#fff', fontSize:'.62rem', fontWeight:600, padding:'2px 7px', borderRadius:5 }}>Amazon →</div>}
                  </div>
                  {/* Body */}
                  <div style={{ padding:'12px 14px 8px', flex:1 }}>
                    {affLink ? (
                      <a href={affLink} target="_blank" rel="noopener" style={{ textDecoration:'none' }}>
                        <div style={{ fontWeight:600, color:'#1d1d1f', fontSize:'.88rem', lineHeight:1.35, marginBottom:4 }}>{w.name}</div>
                      </a>
                    ) : (
                      <div style={{ fontWeight:600, color:'#1d1d1f', fontSize:'.88rem', lineHeight:1.35, marginBottom:4 }}>{w.name}</div>
                    )}
                    {w.note && <div style={{ fontSize:'.74rem', color:'#6e6e73', lineHeight:1.5, marginBottom:6 }}>{w.note}</div>}
                    {w.price && <div style={{ fontWeight:700, color:'#1d1d1f', fontSize:'.95rem' }}>€{Number(w.price).toFixed(2)}</div>}
                  </div>
                  {/* Footer */}
                  <div style={{ padding:'8px 14px 12px', display:'flex', alignItems:'center', justifyContent:'space-between', borderTop:'1px solid #f5f5f5' }}>
                    <span style={{ fontSize:'.68rem', fontWeight:600, padding:'3px 8px', borderRadius:100, background: PRIO_BG[w.priority] || '#fffbeb', color: PRIO_C[w.priority] || '#b45309' }}>
                      {PRIO[w.priority] || 'Sehr gerne'}
                    </span>
                    <button onClick={() => deleteWish(w.id)} style={{ width:28, height:28, borderRadius:7, border:'1px solid #ebebeb', background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#ef4444' }}>
                      <svg width="11" height="11" viewBox="0 0 13 13" fill="none"><path d="M2 3.5h9M5 3.5V2.5h3v1M4 3.5l.5 7h4L9 3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    </button>
                  </div>
                  {/* Reserved veil */}
                  {w.is_reserved && (
                    <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,.88)', backdropFilter:'blur(3px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, borderRadius:16 }}>
                      <span style={{ fontSize:'1.5rem' }}>✓</span>
                      <div style={{ fontSize:'.76rem', fontWeight:600, color:'#16a34a' }}>Reserviert</div>
                      {w.reserved_by && <div style={{ fontSize:'.7rem', color:'#6e6e73' }}>{w.reserved_by}</div>}
                    </div>
                  )}
                </div>
              )
            })}
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

      {ToastEl}
    </div>
  )
}
