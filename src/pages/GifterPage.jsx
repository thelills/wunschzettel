import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useToast } from '../hooks/useToast'
import { getAmazonImageUrl } from '../lib/affiliate'

const AMAZON_TAG = 'dein-wunsch-21'
const OCC_LBL = { wedding:'Hochzeit', birthday:'Geburtstag', baby:'Babyparty', christmas:'Weihnachten', housewarming:'Einzug', other:'Sonstiges' }

export default function GifterPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { toast, ToastEl } = useToast()
  const [list, setList] = useState(null)
  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [resModal, setResModal] = useState(null)
  const [resName, setResName] = useState('')
  const [reserving, setReserving] = useState(false)
  const [showUpsell, setShowUpsell] = useState(false)

  useEffect(() => { load() }, [slug])

  async function load() {
    const { data: l } = await supabase.from('registries').select('*').eq('slug', slug).eq('is_public', true).single()
    if (!l) { setLoading(false); return }
    const { data: w } = await supabase.from('wishes').select('*').eq('registry_id', l.id).order('priority')
    setList(l); setWishes(w || []); setLoading(false)
  }

  async function reserve() {
    if (!resName.trim()) { toast('Bitte deinen Namen eingeben'); return }
    setReserving(true)
    const { error } = await supabase.from('wishes').update({ is_reserved: true, reserved_by: resName.trim() }).eq('id', resModal.id)
    setReserving(false)
    if (error) { toast('Fehler — bitte nochmal'); return }
    setWishes(w => w.map(x => x.id === resModal.id ? { ...x, is_reserved: true, reserved_by: resName } : x))
    setResModal(null); setResName('')
    toast('✓ Reserviert — viel Freude beim Schenken!')
    setTimeout(() => setShowUpsell(true), 2000)
  }

  const open = wishes.filter(w => !w.is_reserved)
  const reserved = wishes.filter(w => w.is_reserved)

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', color:'var(--muted)' }}>Lädt…</div>

  if (!list) return (
    <div style={{ minHeight:'100vh', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:20 }}>
      <div style={{ fontSize:'2rem' }}>😕</div>
      <h1 style={{ fontFamily:'var(--font-serif)', fontWeight:400 }}>Liste nicht gefunden</h1>
      <p style={{ color:'var(--muted)', fontSize:'.84rem' }}>Der Link ist ungültig oder die Liste wurde entfernt.</p>
      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/')}>Zur Startseite</button>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'var(--surface)' }}>
      {/* Header */}
      <div style={{ background:'var(--white)', borderBottom:'1px solid var(--border)', padding:'24px 32px' }}>
        <div style={{ maxWidth:760, margin:'0 auto' }}>
          <div style={{ fontSize:'.76rem', color:'var(--muted)', marginBottom:6 }}>{OCC_LBL[list.occasion]||'Wunschliste'} · Dein Wunsch</div>
          <h1 style={{ fontFamily:'var(--font-serif)', fontSize:'1.8rem', fontWeight:400, color:'var(--black)', marginBottom:8 }}>{list.name}</h1>
          {list.event_date && <div style={{ fontSize:'.82rem', color:'var(--mid)' }}>📅 {new Date(list.event_date).toLocaleDateString('de-DE')}</div>}
          <div style={{ display:'flex', gap:28, marginTop:16, paddingTop:16, borderTop:'1px solid var(--border)' }}>
            {[['Verfügbar', open.length], ['Reserviert', reserved.length], ['Gesamt', wishes.length]].map(([lbl, val]) => (
              <div key={lbl} style={{ textAlign:'center' }}>
                <div style={{ fontFamily:'var(--font-serif)', fontSize:'1.4rem' }}>{val}</div>
                <div style={{ fontSize:'.68rem', color:'var(--muted)', fontWeight:500, textTransform:'uppercase', letterSpacing:'.06em' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Wishes */}
      <div style={{ maxWidth:760, margin:'0 auto', padding:'28px 32px 80px' }}>
        {wishes.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎁</div>
            <h2 className="empty-title">Noch keine Wünsche</h2>
            <p className="empty-sub">Diese Liste ist noch leer.</p>
          </div>
        ) : (
          <div className="gift-grid">
            {wishes.map(w => {
              const affLink = w.affiliate_url || (w.asin ? `https://www.amazon.de/dp/${w.asin}?tag=${AMAZON_TAG}` : null)
              const imgSrc = w.image_url || (w.asin ? getAmazonImageUrl(w.asin) : null)
              return (
                <div key={w.id} className="gift-card">
                  <div className="gc-img">
                    {imgSrc && <img src={imgSrc} alt={w.name} onError={e => e.target.style.display='none'} />}
                    <div className="gc-img-icon" style={{ display:imgSrc?'none':'flex' }}>🎁</div>
                    {affLink && !w.is_reserved && <div className="gc-shop-badge">Amazon →</div>}
                  </div>
                  <div className="gc-body">
                    <div className="gc-name">{w.name}</div>
                    {w.note && <div className="gc-note">{w.note}</div>}
                    {w.price && <div className="gc-price">€{Number(w.price).toFixed(2)}</div>}
                  </div>
                  <div className="gc-foot">
                    <div style={{ display:'flex', gap:6 }}>
                      {affLink && !w.is_reserved && (
                        <a href={affLink} target="_blank" rel="noopener" className="btn btn-ghost btn-xs">Bei Amazon</a>
                      )}
                    </div>
                    {!w.is_reserved
                      ? <button className="btn btn-dark btn-xs" onClick={() => setResModal(w)}>Schenken →</button>
                      : <span style={{ fontSize:'.72rem', color:'var(--green)', fontWeight:600 }}>✓ Reserviert</span>
                    }
                  </div>
                  {w.is_reserved && (
                    <div className="res-veil">
                      <span style={{ fontSize:'1.5rem' }}>✓</span>
                      <div className="rv-label">Bereits reserviert</div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div style={{ marginTop:40, padding:'12px 16px', background:'var(--white)', border:'1px solid var(--border)', borderRadius:10, fontSize:'.73rem', color:'var(--muted)', lineHeight:1.6 }}>
          Produktlinks sind Affiliate-Links. Beim Kauf erhalten wir eine kleine Provision — ohne Mehrkosten für dich.
        </div>
      </div>

      {/* Reserve Modal */}
      {resModal && (
        <div className="modal-bg open" onClick={e => e.target===e.currentTarget && setResModal(null)}>
          <div className="modal">
            <h2>Wunsch reservieren</h2>
            <p className="sub">Hinterlasse deinen Namen damit kein anderer dasselbe schenkt.</p>
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:10, padding:'12px 14px', marginBottom:16 }}>
              <div style={{ fontWeight:600, fontSize:'.88rem' }}>{resModal.name}</div>
              {resModal.price && <div style={{ fontSize:'.8rem', color:'var(--mid)', marginTop:2 }}>€{Number(resModal.price).toFixed(2)}</div>}
            </div>
            <div className="field" style={{ marginBottom:16 }}>
              <label>Dein Name</label>
              <input value={resName} onChange={e => setResName(e.target.value)} placeholder="z.B. Tante Helga" onKeyDown={e => e.key==='Enter'&&reserve()} autoFocus />
            </div>
            <div className="modal-foot">
              <button className="btn btn-ghost btn-sm" onClick={() => setResModal(null)}>Abbrechen</button>
              <button className="btn btn-dark btn-sm" onClick={reserve} disabled={reserving}>{reserving?'…':'Reservieren →'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Guest Upsell */}
      {showUpsell && (
        <div className="guest-upsell">
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'.85rem', fontWeight:600, marginBottom:3 }}>Eigene Liste erstellen?</div>
            <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.45)', lineHeight:1.5 }}>Kostenlos · KI-Vorschläge · Für jeden Anlass</div>
          </div>
          <button onClick={() => navigate('/register')} style={{ background:'white', color:'black', border:'none', padding:'8px 14px', borderRadius:8, fontWeight:600, fontSize:'.78rem', cursor:'pointer', flexShrink:0 }}>
            Jetzt starten
          </button>
          <button onClick={() => setShowUpsell(false)} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,.3)', cursor:'pointer', fontSize:'1.2rem', padding:'0 4px' }}>×</button>
        </div>
      )}

      {ToastEl}
    </div>
  )
}
