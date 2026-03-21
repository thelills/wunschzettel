import { useState, useEffect } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (!consent) setTimeout(() => setVisible(true), 1500)
  }, [])

  const accept = () => { localStorage.setItem('cookie-consent', 'accepted'); setVisible(false) }
  const decline = () => { localStorage.setItem('cookie-consent', 'declined'); setVisible(false) }

  if (!visible) return null

  return (
    <div style={{
      position:'fixed', bottom:24, left:'50%', transform:'translateX(-50%)',
      background:'#18181b', border:'1px solid rgba(255,255,255,.1)',
      borderRadius:16, padding:'18px 24px', maxWidth:560, width:'calc(100% - 32px)',
      zIndex:9000, boxShadow:'0 8px 40px rgba(0,0,0,.4)',
      display:'flex', alignItems:'center', gap:16, flexWrap:'wrap',
    }}>
      <div style={{ flex:1, minWidth:200 }}>
        <div style={{ fontSize:'.84rem', fontWeight:600, color:'#fff', marginBottom:4 }}>
          🍪 Diese Website verwendet Cookies
        </div>
        <div style={{ fontSize:'.76rem', color:'rgba(255,255,255,.45)', lineHeight:1.55 }}>
          Wir nutzen Affiliate-Links zu Amazon und anderen Shops. Beim Klick werden Cookies der jeweiligen Anbieter gesetzt.{' '}
          <a href="/datenschutz.html" style={{ color:'rgba(255,255,255,.6)', textDecoration:'underline' }}>Datenschutz</a>
        </div>
      </div>
      <div style={{ display:'flex', gap:8, flexShrink:0 }}>
        <button onClick={decline} style={{ fontFamily:'inherit', fontSize:'.78rem', fontWeight:500, padding:'7px 14px', borderRadius:8, cursor:'pointer', background:'transparent', color:'rgba(255,255,255,.4)', border:'1px solid rgba(255,255,255,.12)' }}>Ablehnen</button>
        <button onClick={accept} style={{ fontFamily:'inherit', fontSize:'.78rem', fontWeight:600, padding:'7px 14px', borderRadius:8, cursor:'pointer', background:'#fff', color:'#09090b', border:'none' }}>Akzeptieren</button>
      </div>
    </div>
  )
}
