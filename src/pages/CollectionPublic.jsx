import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function CollectionPublic() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [col, setCol] = useState(null)
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: c } = await supabase.from('collections').select('*').eq('slug', slug).eq('is_public', true).single()
      if (!c) { setLoading(false); return }
      const { data: its } = await supabase.from('collection_items').select('*').eq('collection_id', c.id).order('created_at', { ascending: false })
      setCol(c); setItems(its || []); setLoading(false)
    }
    load()
  }, [slug])

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#fafaf8', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ color:'#aeaeb2' }}>Lädt…</div>
    </div>
  )

  if (!col) return (
    <div style={{ minHeight:'100vh', background:'#fafaf8', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:16, padding:32 }}>
      <div style={{ fontSize:'2rem' }}>🔍</div>
      <h1 style={{ fontFamily:"'DM Serif Display',serif", fontWeight:400, color:'#1d1d1f' }}>Sammlung nicht gefunden</h1>
      <button onClick={() => navigate('/')} style={{ padding:'9px 20px', borderRadius:100, border:'none', cursor:'pointer', background:'#1d1d1f', color:'#fff', fontSize:'.84rem', fontWeight:600, fontFamily:'inherit' }}>Zur Startseite</button>
    </div>
  )

  return (
    <div style={{ minHeight:'100vh', background:'#fafaf8', fontFamily:"-apple-system,'Geist',system-ui,sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background:'#fff', borderBottom:'1px solid #ebebeb' }}>
        <div style={{ maxWidth:960, margin:'0 auto', padding:'24px 32px' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12, cursor:'pointer' }} onClick={() => navigate('/')}>
            <div style={{ width:22, height:22, borderRadius:5, background:'#1d1d1f', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.8rem' }}>🎁</div>
            <span style={{ fontSize:'.82rem', fontWeight:600, color:'#aeaeb2' }}>Dein Wunsch</span>
          </div>
          <h1 style={{ fontFamily:"'DM Serif Display',Georgia,serif", fontSize:'clamp(1.8rem,4vw,2.6rem)', fontWeight:400, color:'#1d1d1f', letterSpacing:'-.025em', marginBottom:6 }}>
            {col.name}
          </h1>
          {col.description && <p style={{ fontSize:'.9rem', color:'#6e6e73' }}>{col.description}</p>}
          <div style={{ display:'flex', gap:16, marginTop:14 }}>
            <span style={{ fontSize:'.76rem', color:'#aeaeb2' }}>{items.length} {items.length === 1 ? 'Idee' : 'Ideen'}</span>
          </div>
        </div>
      </div>

      {/* Items */}
      <div style={{ maxWidth:960, margin:'0 auto', padding:'32px 32px 80px' }}>
        {items.length === 0 ? (
          <div style={{ textAlign:'center', padding:'64px 20px', color:'#aeaeb2' }}>Noch keine Ideen in dieser Sammlung.</div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))', gap:14 }}>
            {items.map(item => {
              const affUrl = item.affiliate_url || item.url
              const imgSrc = item.image_url
              return (
                <div key={item.id}
                  onClick={() => affUrl && window.open(affUrl, '_blank', 'noopener')}
                  style={{ background:'#fff', border:'1px solid #ebebeb', borderRadius:16, overflow:'hidden', display:'flex', flexDirection:'column', minWidth:0, cursor: affUrl ? 'pointer' : 'default', transition:'all .15s' }}
                  onMouseEnter={e => { if (affUrl) e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,.08)'; e.currentTarget.style.transform='translateY(-2px)' }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='none' }}
                >
                  {/* Image */}
                  <div style={{ height:180, background:'#f9f9f9', position:'relative', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
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
                    <div style={{ fontSize:'2.5rem', display: imgSrc?'none':'flex', position:'absolute', inset:0, alignItems:'center', justifyContent:'center' }}>🎁</div>
                    {affUrl && <div style={{ position:'absolute', bottom:8, right:8, background:'rgba(0,0,0,.5)', backdropFilter:'blur(4px)', color:'#fff', fontSize:'.62rem', fontWeight:600, padding:'3px 8px', borderRadius:6 }}>Bei Amazon →</div>}
                  </div>
                  {/* Body */}
                  <div style={{ padding:'14px 14px 10px', flex:1 }}>
                    <div style={{ fontWeight:600, color:'#1d1d1f', fontSize:'.9rem', lineHeight:1.35, marginBottom:4 }}>{item.name}</div>
                    {item.note && <div style={{ fontSize:'.76rem', color:'#6e6e73', lineHeight:1.5, marginBottom:6 }}>{item.note}</div>}
                    {item.price && <div style={{ fontWeight:700, color:'#1d1d1f', fontSize:'1rem' }}>€{Number(item.price).toFixed(2)}</div>}
                  </div>
                  {item.category && (
                    <div style={{ padding:'8px 14px 12px', borderTop:'1px solid #f5f5f5' }}>
                      <span style={{ fontSize:'.68rem', color:'#aeaeb2' }}>{item.category}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Affiliate Hinweis */}
        <div style={{ marginTop:40, padding:16, background:'#fff', border:'1px solid #ebebeb', borderRadius:12, fontSize:'.78rem', color:'#aeaeb2', textAlign:'center' }}>
          Produktlinks sind Affiliate-Links zu Amazon.de — bei einem Kauf erhalten wir eine kleine Provision, ohne Mehrkosten für dich.
        </div>
      </div>
    </div>
  )
}
