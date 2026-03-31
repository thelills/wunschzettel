import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  'https://fhvsxmywxsvoeonbcftj.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZodnN4bXl3eHN2b2VvbmJjZnRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4NzY2NjEsImV4cCI6MjA4OTQ1MjY2MX0.wWFi-L_gJi1OzcnRIpiKN0YXAXl2Nz7qNvY6vaqaU7s'
)

const STEPS = ['Wer bist du?', 'Bewertung', 'Features', 'Feedback']

function Star({ filled, onClick }) {
  return (
    <svg onClick={onClick} width="32" height="32" viewBox="0 0 32 32" fill="none" style={{ cursor:'pointer', transition:'transform .1s' }}
      onMouseEnter={e => e.currentTarget.style.transform='scale(1.15)'}
      onMouseLeave={e => e.currentTarget.style.transform='scale(1)'}
    >
      <path d="M16 3l3.9 7.9 8.7 1.3-6.3 6.1 1.5 8.7L16 23l-7.8 4.1L9.7 18.3 3.4 12.2l8.7-1.3L16 3z"
        fill={filled ? '#44CCB2' : 'none'} stroke={filled ? '#44CCB2' : '#d1d5db'} strokeWidth="1.5"
        strokeLinejoin="round" />
    </svg>
  )
}

function Rating({ label, value, onChange }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ fontSize:'.84rem', fontWeight:600, color:'#1d1d1f', marginBottom:8 }}>{label}</div>
      <div style={{ display:'flex', gap:6, alignItems:'center' }}>
        {[1,2,3,4,5].map(n => (
          <Star key={n} filled={n <= value} onClick={() => onChange(n)} />
        ))}
        <span style={{ fontSize:'.78rem', color:'#aeaeb2', marginLeft:8 }}>
          {value === 0 ? '' : ['','Schlecht','Naja','Ok','Gut','Super!'][value]}
        </span>
      </div>
    </div>
  )
}

export default function Feedback() {
  const [step, setStep] = useState(0)
  const [done, setDone] = useState(false)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    tester_name: '',
    tester_type: '',
    rating_overall: 0,
    rating_ease: 0,
    rating_design: 0,
    used_ki: false,
    used_share: false,
    used_group: false,
    used_collections: false,
    best_feature: '',
    missing_feature: '',
    would_recommend: null,
    general_comment: '',
  })
  const set = (k, v) => setForm(f => ({...f, [k]: v}))

  async function submit() {
    setSaving(true)
    const { error } = await sb.from('feedback').insert({
      ...form,
      source: 'beta-v1',
    })
    setSaving(false)
    if (!error) setDone(true)
  }

  const canNext = [
    form.tester_type !== '',
    form.rating_overall > 0 && form.rating_ease > 0 && form.rating_design > 0,
    true,
    form.would_recommend !== null,
  ][step]

  if (done) return (
    <div style={page}>
      <div style={card}>
        <div style={{ textAlign:'center', padding:'32px 0' }}>
          <div style={{ fontSize:'3rem', marginBottom:16 }}>🎉</div>
          <h2 style={serif}>Danke für dein Feedback!</h2>
          <p style={{ fontSize:'.9rem', color:'#6e6e73', marginTop:8, lineHeight:1.6 }}>
            Du hilfst uns Dein Wunsch besser zu machen.<br />
            Wir melden uns bald mit Updates.
          </p>
          <a href="https://deinwunsch.app" style={{ display:'inline-block', marginTop:24, padding:'10px 24px', borderRadius:100, background:'#1d1d1f', color:'#fff', textDecoration:'none', fontSize:'.84rem', fontWeight:600 }}>
            Zur App →
          </a>
        </div>
      </div>
    </div>
  )

  return (
    <div style={page}>
      <div style={card}>
        {/* Header */}
        <div style={{ display:'flex', justifyContent:'center', marginBottom:24 }}>
          <img src="https://deinwunsch.app/logo.png" alt="Dein Wunsch" style={{ height:44, width:'auto' }} />
        </div>

        {/* Progress */}
        <div style={{ display:'flex', gap:6, marginBottom:28 }}>
          {STEPS.map((s, i) => (
            <div key={i} style={{ flex:1, height:3, borderRadius:2, background: i <= step ? '#44CCB2' : '#f0f0f0', transition:'background .3s' }} />
          ))}
        </div>

        <h2 style={{ ...serif, marginBottom:4, fontSize:'1.3rem' }}>{STEPS[step]}</h2>
        <p style={{ fontSize:'.8rem', color:'#aeaeb2', marginBottom:24 }}>
          {['Schritt 1 von 4','Schritt 2 von 4','Schritt 3 von 4','Fast geschafft!'][step]}
        </p>

        {/* ── STEP 0: Wer bist du ── */}
        {step === 0 && (
          <div>
            <div style={field}>
              <label style={lbl}>Dein Name (optional)</label>
              <input value={form.tester_name} onChange={e => set('tester_name', e.target.value)} placeholder="z.B. Anna" style={input} />
            </div>
            <div style={field}>
              <label style={lbl}>Ich habe Dein Wunsch als… getestet *</label>
              <div style={{ display:'flex', flexDirection:'column', gap:8, marginTop:4 }}>
                {['Beschenkter (ich habe eine Liste erstellt)', 'Schenkender (ich habe eine Liste geöffnet)', 'Beides'].map(opt => (
                  <button key={opt} onClick={() => set('tester_type', opt)}
                    style={{ padding:'10px 14px', borderRadius:10, border: form.tester_type === opt ? '2px solid #44CCB2' : '1px solid #ebebeb', background: form.tester_type === opt ? 'rgba(68,204,178,.07)' : '#fff', color: form.tester_type === opt ? '#1d1d1f' : '#6e6e73', fontSize:'.84rem', fontWeight: form.tester_type === opt ? 600 : 400, cursor:'pointer', textAlign:'left', fontFamily:'inherit' }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1: Bewertungen ── */}
        {step === 1 && (
          <div>
            <Rating label="Gesamteindruck" value={form.rating_overall} onChange={v => set('rating_overall', v)} />
            <Rating label="Wie einfach war die Bedienung?" value={form.rating_ease} onChange={v => set('rating_ease', v)} />
            <Rating label="Design & Optik" value={form.rating_design} onChange={v => set('rating_design', v)} />
          </div>
        )}

        {/* ── STEP 2: Features ── */}
        {step === 2 && (
          <div>
            <div style={field}>
              <label style={lbl}>Welche Features hast du genutzt?</label>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, marginTop:4 }}>
                {[
                  ['used_ki', '✦ KI-Vorschläge'],
                  ['used_share', '🔗 Liste teilen'],
                  ['used_group', '⟡ Gruppengeschenk'],
                  ['used_collections', '🗂️ Sammlungen'],
                ].map(([key, label]) => (
                  <button key={key} onClick={() => set(key, !form[key])}
                    style={{ padding:'10px 12px', borderRadius:10, border: form[key] ? '2px solid #44CCB2' : '1px solid #ebebeb', background: form[key] ? 'rgba(68,204,178,.08)' : '#fff', color: form[key] ? '#1d1d1f' : '#6e6e73', fontSize:'.82rem', fontWeight: form[key] ? 600 : 400, cursor:'pointer', textAlign:'left', fontFamily:'inherit' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Offene Fragen ── */}
        {step === 3 && (
          <div>
            <div style={field}>
              <label style={lbl}>Was hat dir am besten gefallen?</label>
              <textarea value={form.best_feature} onChange={e => set('best_feature', e.target.value)}
                placeholder="z.B. Die KI-Vorschläge waren super hilfreich…" style={{ ...input, minHeight:72, resize:'vertical' }} />
            </div>
            <div style={field}>
              <label style={lbl}>Was fehlt dir noch / was hat nicht funktioniert?</label>
              <textarea value={form.missing_feature} onChange={e => set('missing_feature', e.target.value)}
                placeholder="z.B. Bilder haben nicht geladen, ich wünschte mir…" style={{ ...input, minHeight:72, resize:'vertical' }} />
            </div>
            <div style={field}>
              <label style={lbl}>Würdest du Dein Wunsch weiterempfehlen? *</label>
              <div style={{ display:'flex', gap:10, marginTop:4 }}>
                {[['Ja, auf jeden Fall! 🙌', true], ['Noch nicht / Nein', false]].map(([label, val]) => (
                  <button key={String(val)} onClick={() => set('would_recommend', val)}
                    style={{ flex:1, padding:'10px 8px', borderRadius:10, border: form.would_recommend === val ? '2px solid #44CCB2' : '1px solid #ebebeb', background: form.would_recommend === val ? 'rgba(68,204,178,.08)' : '#fff', color: form.would_recommend === val ? '#1d1d1f' : '#6e6e73', fontSize:'.82rem', fontWeight: form.would_recommend === val ? 600 : 400, cursor:'pointer', fontFamily:'inherit' }}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div style={field}>
              <label style={lbl}>Sonstige Anmerkungen</label>
              <textarea value={form.general_comment} onChange={e => set('general_comment', e.target.value)}
                placeholder="Alles was dir noch auf dem Herzen liegt…" style={{ ...input, minHeight:60, resize:'vertical' }} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div style={{ display:'flex', gap:10, marginTop:24, justifyContent:'space-between', alignItems:'center' }}>
          {step > 0
            ? <button onClick={() => setStep(s => s-1)} style={{ padding:'9px 20px', borderRadius:8, border:'1px solid #ebebeb', background:'#fff', cursor:'pointer', fontSize:'.84rem', color:'#6e6e73', fontFamily:'inherit' }}>← Zurück</button>
            : <div />
          }
          {step < 3
            ? <button onClick={() => setStep(s => s+1)} disabled={!canNext}
                style={{ padding:'10px 24px', borderRadius:100, border:'none', cursor: canNext ? 'pointer' : 'not-allowed', background: canNext ? '#1d1d1f' : '#e5e7eb', color: canNext ? '#fff' : '#9ca3af', fontSize:'.88rem', fontWeight:600, fontFamily:'inherit' }}>
                Weiter →
              </button>
            : <button onClick={submit} disabled={!canNext || saving}
                style={{ padding:'10px 24px', borderRadius:100, border:'none', cursor: canNext ? 'pointer' : 'not-allowed', background: canNext ? '#44CCB2' : '#e5e7eb', color: canNext ? '#fff' : '#9ca3af', fontSize:'.88rem', fontWeight:600, fontFamily:'inherit' }}>
                {saving ? 'Sendet…' : 'Feedback senden ✓'}
              </button>
          }
        </div>
      </div>

      <p style={{ fontSize:'.72rem', color:'#aeaeb2', textAlign:'center', marginTop:16 }}>
        Dein Feedback wird anonym gespeichert · <a href="https://deinwunsch.app/datenschutz.html" style={{ color:'#aeaeb2' }}>Datenschutz</a>
      </p>
    </div>
  )
}

// Styles
const page = { minHeight:'100vh', background:'#fafaf8', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'24px 16px', fontFamily:"-apple-system,'Geist',system-ui,sans-serif" }
const card = { background:'#fff', border:'1px solid #ebebeb', borderRadius:20, padding:28, width:'100%', maxWidth:460, boxShadow:'0 4px 24px rgba(0,0,0,.06)' }
const serif = { fontFamily:"Georgia,serif", fontWeight:400, color:'#1d1d1f', letterSpacing:'-.02em', margin:0 }
const field = { marginBottom:18 }
const lbl = { fontSize:'.78rem', fontWeight:600, color:'#1d1d1f', display:'block', marginBottom:6 }
const input = { width:'100%', padding:'9px 13px', border:'1px solid #ebebeb', borderRadius:8, fontSize:'.88rem', color:'#1d1d1f', fontFamily:'inherit', boxSizing:'border-box', outline:'none' }
