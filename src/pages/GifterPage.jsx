import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useToast } from '../hooks/useToast'
import { getAmazonImageUrl } from '../lib/affiliate'

const AMAZON_TAG = 'dein-wunsch-21'
const OCC_LBL = { wedding:'Hochzeit', birthday:'Geburtstag', baby:'Babyparty', christmas:'Weihnachten', housewarming:'Einzug', other:'Sonstiges' }

// Fortschrittsbalken für Gruppengeschenke
function GroupProgress({ raised, target, contributions = [] }) {
  const pct = Math.min(Math.round((raised / target) * 100), 100)
  const remaining = Math.max(target - raised, 0)
  const done = pct >= 100
  return (
    <div style={{ marginTop:8 }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:6 }}>
        <span style={{ fontSize:'.78rem', fontWeight:700, color: done ? '#16a34a' : '#6366f1' }}>
          {done ? '✓ Vollständig erfüllt!' : `€${raised.toFixed(2)} von €${target.toFixed(2)}`}
        </span>
        <span style={{ fontSize:'.72rem', color:'#aeaeb2' }}>{pct}%</span>
      </div>
      <div style={{ height:8, background:'#f0f0f0', borderRadius:4, overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${pct}%`, background: done ? '#16a34a' : 'linear-gradient(90deg,#6366f1,#8b5cf6)', borderRadius:4, transition:'width .5s ease' }} />
      </div>
      {!done && <div style={{ fontSize:'.72rem', color:'#aeaeb2', marginTop:4 }}>Noch €{remaining.toFixed(2)} bis zum Ziel</div>}
      {contributions.length > 0 && (
        <div style={{ marginTop:8, display:'flex', flexWrap:'wrap', gap:4 }}>
          {contributions.map((c, i) => (
            <span key={i} style={{ fontSize:'.68rem', background:'rgba(99,102,241,.08)', color:'#6366f1', padding:'2px 8px', borderRadius:100 }}>
              {c.name} · €{c.amount}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function GifterPage() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { toast, ToastEl } = useToast()
  const [list, setList] = useState(null)
  const [wishes, setWishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [resModal, setResModal] = useState(null) // single gift
  const [groupModal, setGroupModal] = useState(null) // group gift
  const [resName, setResName] = useState('')
  const [groupAmount, setGroupAmount] = useState('')
  const [reserving, setReserving] = useState(false)
  const [showUpsell, setShowUpsell] = useState(false)

  useEffect(() => { load() }, [slug])

  async function load() {
    const { data: l } = await supabase.from('registries').select('*').eq('slug', slug).eq('is_public', true).single()
    if (!l) { setLoading(false); return }
    const { data: w } = await supabase.from('wishes').select('*').eq('registry_id', l.id).order('priority')
    setList(l); setWishes(w || []); setLoading(false)
  }

  // Normal reserve (single gift)
  async function reserve() {
    if (!resName.trim()) { toast('Bitte deinen Namen eingeben'); return }
    setReserving(true)
    const { error } = await supabase.from('wishes').update({
      is_reserved: true,
      reserved_by: resName.trim()
    }).eq('id', resModal.id)
    setReserving(false)
    if (error) { toast('Fehler — bitte nochmal'); return }
    setWishes(w => w.map(x => x.id === resModal.id ? { ...x, is_reserved: true, reserved_by: resName } : x))
    setResModal(null); setResName('')
    toast('✓ Reserviert — viel Freude beim Schenken!')
    setTimeout(() => setShowUpsell(true), 2000)
  }

  // Group gift contribution
  async function contribute() {
    if (!resName.trim()) { toast('Bitte deinen Namen eingeben'); return }
    const amount = parseFloat(groupAmount)
    if (!amount || amount <= 0) { toast('Bitte einen Betrag eingeben'); return }
    setReserving(true)

    const w = groupModal
    const currentRaised = Number(w.group_raised || 0)
    const target = Number(w.group_target || 0)
    const newRaised = currentRaised + amount
    const contributions = [...(w.group_contributions || []), { name: resName.trim(), amount, date: new Date().toISOString().split('T')[0] }]
    const isFulfilled = newRaised >= target

    const { error } = await supabase.from('wishes').update({
      group_raised: newRaised,
      group_contributions: contributions,
      ...(isFulfilled ? { is_reserved: true, reserved_by: 'Gruppengeschenk' } : {}),
    }).eq('id', w.id)

    setReserving(false)
    if (error) { toast('Fehler: ' + error.message); return }

    setWishes(ws => ws.map(x => x.id === w.id ? {
      ...x,
      group_raised: newRaised,
      group_contributions: contributions,
      ...(isFulfilled ? { is_reserved: true } : {}),
    } : x))

    setGroupModal(null); setResName(''); setGroupAmount('')
    toast(isFulfilled ? '🎉 Ziel erreicht! Wunsch ist erfüllt.' : `✓ Beitrag von €${amount} eingetragen!`)
    setTimeout(() => setShowUpsell(true), 2000)
  }

  const singleWishes = wishes.filter(w => w.type !== 'group')
  const groupWishes = wishes.filter(w => w.type === 'group')
  const open = singleWishes.filter(w => !w.is_reserved)
  const reserved = singleWishes.filter(w => w.is_reserved)

  if (loading) return <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'system-ui', color:'#aeaeb2' }}>Lädt…</div>

  if (!list) return (
    <div style={{ minHeight:'100vh', fontFamily:'system-ui', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:20 }}>
      <div style={{ fontSize:'2rem' }}>😕</div>
      <h1 style={{ fontFamily:"'DM Serif Display',serif", fontWeight:400 }}>Liste nicht gefunden</h1>
      <p style={{ color:'#aeaeb2', fontSize:'.84rem' }}>Der Link ist ungültig oder die Liste wurde entfernt.</p>
      <button onClick={() => navigate('/')} style={{ padding:'8px 18px', borderRadius:8, border:'1px solid #ebebeb', background:'#fff', cursor:'pointer', fontFamily:'inherit' }}>Zur Startseite</button>
    </div>
  )

  const WishCard = ({ w }) => {
    const isGroup = w.type === 'group'
    const affLink = w.affiliate_url || null
    const asinFromUrl = w.affiliate_url?.match(/\/dp\/([A-Z0-9]{10})/i)?.[1]
    const imgSrc = w.image_url || (asinFromUrl ? getAmazonImageUrl(asinFromUrl) : null)
    const raised = Number(w.group_raised || 0)
    const target = Number(w.group_target || 0)
    const contributions = w.group_contributions || []
    const isFulfilled = w.is_reserved || (isGroup && raised >= target && target > 0)

    return (
      <div style={{ background:'#fff', border:`1px solid ${isGroup ? 'rgba(99,102,241,.2)' : '#ebebeb'}`, borderRadius:16, overflow:'hidden', display:'flex', flexDirection:'column', position:'relative', minWidth:0 }}>
        {/* Image */}
        <div style={{ height:160, background:'#f9f9f9', position:'relative', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', cursor: affLink ? 'pointer' : 'default' }}
          onClick={() => affLink && !isFulfilled && window.open(affLink, '_blank', 'noopener')}
        >
          {imgSrc ? (
            <img src={imgSrc} alt={w.name} style={{ width:'100%', height:'100%', objectFit:'contain', padding:8 }}
              onError={e => {
                const asin = w.affiliate_url?.match(/\/dp\/([A-Z0-9]{10})/i)?.[1]
                if (asin && !e.target.dataset.tried) {
                  e.target.dataset.tried = '1'
                  e.target.src = `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`
                } else { e.target.style.display='none'; e.target.nextSibling.style.display='flex' }
              }}
            />
          ) : null}
          <div style={{ fontSize:'2.5rem', display: imgSrc?'none':'flex', position:'absolute', inset:0, alignItems:'center', justifyContent:'center' }}>🎁</div>
          {isGroup && <div style={{ position:'absolute', top:8, left:8, fontSize:'.62rem', fontWeight:700, background:'rgba(99,102,241,.9)', color:'#fff', padding:'2px 8px', borderRadius:100 }}>⟡ Gruppengeschenk</div>}
          {affLink && !isFulfilled && <div style={{ position:'absolute', bottom:6, right:6, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)', color:'#fff', fontSize:'.62rem', fontWeight:600, padding:'2px 7px', borderRadius:5 }}>Amazon →</div>}
        </div>

        {/* Body */}
        <div style={{ padding:'12px 14px 8px', flex:1 }}>
          <div style={{ fontWeight:600, color:'#1d1d1f', fontSize:'.9rem', lineHeight:1.35, marginBottom:4, cursor: affLink?'pointer':'default' }}
            onClick={() => affLink && !isFulfilled && window.open(affLink, '_blank', 'noopener')}
          >{w.name}</div>
          {w.note && <div style={{ fontSize:'.74rem', color:'#6e6e73', lineHeight:1.5, marginBottom:6 }}>{w.note}</div>}
          {w.price && !isGroup && <div style={{ fontWeight:700, color:'#1d1d1f', fontSize:'.95rem' }}>€{Number(w.price).toFixed(2)}</div>}
          {isGroup && target > 0 && <GroupProgress raised={raised} target={target} contributions={contributions} />}
        </div>

        {/* Footer */}
        <div style={{ padding:'10px 14px 12px', borderTop:'1px solid #f5f5f5' }}>
          {isFulfilled ? (
            <div style={{ textAlign:'center', fontSize:'.78rem', fontWeight:600, color:'#16a34a', padding:'4px 0' }}>
              ✓ {isGroup ? 'Ziel erreicht' : 'Bereits reserviert'}
            </div>
          ) : isGroup ? (
            <button onClick={() => { setGroupModal(w); setGroupAmount(String(Math.round(target/4))) }}
              style={{ width:'100%', padding:'9px 0', borderRadius:9, border:'none', cursor:'pointer', background:'#6366f1', color:'#fff', fontSize:'.84rem', fontWeight:600, fontFamily:'inherit' }}>
              ⟡ Mitschenken →
            </button>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
              <div style={{ display:'flex', gap:6 }}>
                <button onClick={() => setResModal(w)}
                  style={{ flex:1, padding:'9px 0', borderRadius:9, border:'none', cursor:'pointer', background:'#1d1d1f', color:'#fff', fontSize:'.8rem', fontWeight:600, fontFamily:'inherit' }}>
                  Ich schenke es ganz →
                </button>
                {w.price && Number(w.price) >= 20 && (
                  <button onClick={() => {
                    setGroupModal({
                      ...w,
                      type: 'group',
                      group_target: Number(w.price),
                      group_raised: Number(w.group_raised || 0),
                      group_contributions: w.group_contributions || [],
                      _adhoc: true,
                    })
                    setGroupAmount(String(Math.round(Number(w.price) / 3)))
                  }}
                    style={{ padding:'9px 12px', borderRadius:9, border:'1px solid rgba(99,102,241,.25)', cursor:'pointer', background:'rgba(99,102,241,.06)', color:'#6366f1', fontSize:'.76rem', fontWeight:600, fontFamily:'inherit', whiteSpace:'nowrap' }}>
                    ⟡ Anteilig
                  </button>
                )}
              </div>
              {affLink && (
                <a href={affLink} target="_blank" rel="noopener"
                  style={{ textAlign:'center', fontSize:'.72rem', color:'#aeaeb2', textDecoration:'none', padding:'2px 0' }}>
                  Bei Amazon ansehen ↗
                </a>
              )}
            </div>
          )}
        </div>
          )}
        </div>

        {/* Reserved veil for single gifts */}
        {!isGroup && isFulfilled && (
          <div style={{ position:'absolute', inset:0, background:'rgba(255,255,255,.88)', backdropFilter:'blur(3px)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:6, borderRadius:16 }}>
            <span style={{ fontSize:'1.5rem' }}>✓</span>
            <div style={{ fontSize:'.78rem', fontWeight:600, color:'#16a34a' }}>Bereits reserviert</div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ minHeight:'100vh', background:'#fafaf8', fontFamily:"-apple-system,'Geist',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background:'#fff', borderBottom:'1px solid #ebebeb', padding:'24px 32px' }}>
        <div style={{ maxWidth:860, margin:'0 auto' }}>
          <div style={{ fontSize:'.75rem', color:'#aeaeb2', marginBottom:6 }}>{OCC_LBL[list.occasion]||'Wunschliste'} · Dein Wunsch</div>
          <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'clamp(1.6rem,4vw,2.2rem)', fontWeight:400, color:'#1d1d1f', marginBottom:6 }}>{list.name}</h1>
          {list.event_date && <div style={{ fontSize:'.82rem', color:'#aeaeb2' }}>📅 {new Date(list.event_date).toLocaleDateString('de-DE')}</div>}
          <div style={{ display:'flex', gap:28, marginTop:14, paddingTop:14, borderTop:'1px solid #ebebeb' }}>
            {[['Verfügbar', open.length], ['Reserviert', reserved.length], ['Gesamt', wishes.length]].map(([lbl, val]) => (
              <div key={lbl}>
                <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:'1.4rem', color:'#1d1d1f' }}>{val}</div>
                <div style={{ fontSize:'.65rem', color:'#aeaeb2', fontWeight:500, textTransform:'uppercase', letterSpacing:'.06em' }}>{lbl}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:860, margin:'0 auto', padding:'28px 32px 80px' }}>

        {/* Gruppengeschenke zuerst */}
        {groupWishes.length > 0 && (
          <div style={{ marginBottom:32 }}>
            <div style={{ fontSize:'.72rem', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'#6366f1', marginBottom:14 }}>⟡ Gruppengeschenke</div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:14 }}>
              {groupWishes.map(w => <WishCard key={w.id} w={w} />)}
            </div>
          </div>
        )}

        {/* Einzelwünsche */}
        {singleWishes.length > 0 && (
          <div>
            {groupWishes.length > 0 && <div style={{ fontSize:'.72rem', fontWeight:600, letterSpacing:'.1em', textTransform:'uppercase', color:'#aeaeb2', marginBottom:14 }}>Einzelwünsche</div>}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
              {singleWishes.map(w => <WishCard key={w.id} w={w} />)}
            </div>
          </div>
        )}

        {wishes.length === 0 && (
          <div style={{ textAlign:'center', padding:'64px 20px' }}>
            <div style={{ fontSize:'2rem', marginBottom:12 }}>🎁</div>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'1.3rem', color:'#1d1d1f', marginBottom:8 }}>Noch keine Wünsche</h2>
            <p style={{ fontSize:'.84rem', color:'#6e6e73' }}>Diese Liste ist noch leer.</p>
          </div>
        )}

        <div style={{ marginTop:40, padding:'12px 16px', background:'#fff', border:'1px solid #ebebeb', borderRadius:10, fontSize:'.73rem', color:'#aeaeb2', lineHeight:1.6 }}>
          Produktlinks sind Affiliate-Links zu Amazon.de. Beim Kauf erhalten wir eine kleine Provision — ohne Mehrkosten für dich.
        </div>
      </div>

      {/* Single Reserve Modal */}
      {resModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.4)', backdropFilter:'blur(8px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={e => e.target===e.currentTarget && setResModal(null)}>
          <div style={{ background:'#fff', borderRadius:20, padding:28, width:'100%', maxWidth:380 }}>
            <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'1.3rem', fontWeight:400, color:'#1d1d1f', marginBottom:6 }}>Wunsch reservieren</h2>
            <p style={{ fontSize:'.84rem', color:'#6e6e73', marginBottom:16 }}>Damit kein anderer dasselbe schenkt.</p>
            <div style={{ background:'#f9f9f9', borderRadius:10, padding:'12px 14px', marginBottom:16 }}>
              <div style={{ fontWeight:600, fontSize:'.88rem', color:'#1d1d1f' }}>{resModal.name}</div>
              {resModal.price && <div style={{ fontSize:'.8rem', color:'#6e6e73', marginTop:2 }}>€{Number(resModal.price).toFixed(2)}</div>}
            </div>
            <div className="field" style={{ marginBottom:16 }}>
              <label>Dein Name</label>
              <input value={resName} onChange={e => setResName(e.target.value)} placeholder="z.B. Tante Helga" onKeyDown={e => e.key==='Enter'&&reserve()} autoFocus />
            </div>
            <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
              <button onClick={() => setResModal(null)} style={{ padding:'7px 16px', borderRadius:8, border:'1px solid #ebebeb', background:'#fff', cursor:'pointer', fontSize:'.8rem', fontFamily:'inherit', color:'#6e6e73' }}>Abbrechen</button>
              <button onClick={reserve} disabled={reserving} style={{ padding:'7px 20px', borderRadius:8, border:'none', cursor:'pointer', background:'#1d1d1f', color:'#fff', fontSize:'.8rem', fontWeight:600, fontFamily:'inherit' }}>{reserving?'…':'Reservieren →'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Group Gift Modal — mit Slider */}
      {groupModal && (() => {
        const target = Number(groupModal.group_target || 0)
        const alreadyRaised = Number(groupModal.group_raised || 0)
        const remaining = Math.max(target - alreadyRaised, 0)
        const sliderAmount = parseFloat(groupAmount) || Math.round(remaining / 4)
        const previewRaised = alreadyRaised + sliderAmount
        const previewPct = target > 0 ? Math.min(Math.round((previewRaised / target) * 100), 100) : 0
        const maxSlider = Math.min(remaining, target)

        return (
          <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.4)', backdropFilter:'blur(8px)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:20 }} onClick={e => e.target===e.currentTarget && setGroupModal(null)}>
            <div style={{ background:'#fff', borderRadius:20, padding:28, width:'100%', maxWidth:420 }}>
              {/* Header */}
              <div style={{ display:'inline-flex', alignItems:'center', gap:6, background:'rgba(99,102,241,.08)', border:'1px solid rgba(99,102,241,.2)', borderRadius:100, padding:'4px 12px', marginBottom:16 }}>
                <span style={{ fontSize:'.7rem', fontWeight:600, color:'#6366f1' }}>⟡ Gruppengeschenk</span>
              </div>
              <h2 style={{ fontFamily:"'DM Serif Display',serif", fontSize:'1.3rem', fontWeight:400, color:'#1d1d1f', marginBottom:4 }}>
                {groupModal._adhoc ? 'Anteilig schenken' : 'Mitschenken'}
              </h2>
              <p style={{ fontSize:'.84rem', color:'#6e6e73', marginBottom:20 }}>{groupModal.name}</p>

              {/* Visual progress */}
              <div style={{ background:'#f9f9f9', borderRadius:14, padding:'16px', marginBottom:20 }}>
                {/* Amount display */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:10 }}>
                  <div>
                    <span style={{ fontSize:'1.6rem', fontWeight:700, color:'#6366f1', fontFamily:"'DM Serif Display',serif" }}>€{sliderAmount}</span>
                    <span style={{ fontSize:'.84rem', color:'#aeaeb2', marginLeft:4 }}>von €{target.toFixed(0)}</span>
                  </div>
                  <span style={{ fontSize:'.78rem', fontWeight:600, color: previewPct >= 100 ? '#16a34a' : '#6366f1' }}>{previewPct}%</span>
                </div>

                {/* Progress bar with preview */}
                <div style={{ position:'relative', height:10, background:'#e8e8e8', borderRadius:5, overflow:'hidden', marginBottom:8 }}>
                  {/* Already raised */}
                  <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${Math.min(100*alreadyRaised/target,100)}%`, background:'#c7c7ff', borderRadius:5 }} />
                  {/* My contribution preview */}
                  <div style={{ position:'absolute', left:0, top:0, height:'100%', width:`${previewPct}%`, background:'linear-gradient(90deg,#818cf8,#6366f1)', borderRadius:5, transition:'width .15s ease' }} />
                </div>

                <div style={{ display:'flex', justifyContent:'space-between', fontSize:'.72rem', color:'#aeaeb2' }}>
                  <span>Bereits: €{alreadyRaised.toFixed(0)}</span>
                  <span>Noch: €{Math.max(remaining - sliderAmount, 0).toFixed(0)}</span>
                  <span>Ziel: €{target.toFixed(0)}</span>
                </div>
              </div>

              {/* SLIDER */}
              <div style={{ marginBottom:20 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                  <label style={{ fontSize:'.78rem', fontWeight:600, color:'#1d1d1f', fontFamily:'inherit' }}>Mein Beitrag</label>
                  <span style={{ fontSize:'.78rem', color:'#6e6e73' }}>€1 – €{maxSlider}</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max={maxSlider || 100}
                  step="1"
                  value={sliderAmount}
                  onChange={e => setGroupAmount(e.target.value)}
                  style={{ width:'100%', accentColor:'#6366f1', cursor:'pointer' }}
                />
                {/* Quick amounts */}
                <div style={{ display:'flex', gap:6, marginTop:10, flexWrap:'wrap' }}>
                  {[10, 20, 25, 50, Math.round(remaining/2), remaining].filter((v,i,a) => v > 0 && v <= maxSlider && a.indexOf(v) === i).map(a => (
                    <button key={a} onClick={() => setGroupAmount(String(a))} style={{ padding:'4px 12px', borderRadius:100, border: Math.round(sliderAmount) === a ? '2px solid #6366f1' : '1px solid #ebebeb', background: Math.round(sliderAmount) === a ? 'rgba(99,102,241,.1)' : '#f9f9f9', color: Math.round(sliderAmount) === a ? '#6366f1' : '#6e6e73', fontSize:'.74rem', fontWeight:600, cursor:'pointer', fontFamily:'inherit', transition:'all .15s' }}>
                      €{a}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name input */}
              <div className="field" style={{ marginBottom:20 }}>
                <label>Dein Name</label>
                <input value={resName} onChange={e => setResName(e.target.value)} placeholder="z.B. Markus" autoFocus />
              </div>

              {/* CTA */}
              <div style={{ display:'flex', gap:8, justifyContent:'flex-end' }}>
                <button onClick={() => setGroupModal(null)} style={{ padding:'7px 16px', borderRadius:8, border:'1px solid #ebebeb', background:'#fff', cursor:'pointer', fontSize:'.8rem', fontFamily:'inherit', color:'#6e6e73' }}>Abbrechen</button>
                <button onClick={contribute} disabled={reserving} style={{ flex:1, padding:'10px 0', borderRadius:10, border:'none', cursor:'pointer', background:'#6366f1', color:'#fff', fontSize:'.9rem', fontWeight:600, fontFamily:'inherit' }}>
                  {reserving ? '…' : groupModal?._adhoc ? `€${sliderAmount} anteilig schenken →` : `€${sliderAmount} beitragen →`}
                </button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Upsell */}
      {showUpsell && (
        <div style={{ position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)', background:'#1d1d1f', color:'#fff', padding:'14px 18px', borderRadius:14, maxWidth:400, width:'calc(100% - 32px)', zIndex:999, boxShadow:'0 12px 48px rgba(0,0,0,.2)', display:'flex', alignItems:'center', gap:14 }}>
          <div style={{ flex:1 }}>
            <div style={{ fontSize:'.85rem', fontWeight:600, marginBottom:3 }}>Eigene Liste erstellen?</div>
            <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.45)', lineHeight:1.5 }}>Kostenlos · KI-Vorschläge · Für jeden Anlass</div>
          </div>
          <button onClick={() => navigate('/register')} style={{ background:'#fff', color:'#1d1d1f', border:'none', padding:'8px 14px', borderRadius:8, fontWeight:600, fontSize:'.78rem', cursor:'pointer', flexShrink:0 }}>Jetzt starten</button>
          <button onClick={() => setShowUpsell(false)} style={{ background:'transparent', border:'none', color:'rgba(255,255,255,.3)', cursor:'pointer', fontSize:'1.2rem', padding:'0 4px' }}>×</button>
        </div>
      )}

      {ToastEl}
    </div>
  )
}
