import { useState, useEffect, useRef } from 'react'
import styles from './Hero.module.css'

const PLATFORMS_CYCLE = ['Instagram', 'LinkedIn', 'X / Twitter', 'Facebook', 'Google Ads']

const TYPING_VARIANTS = [
  "✨ Fall vibes in a jar. Our pumpkin spice + cedarwood candle is back — and it's everything. Hand-poured in small batches. 🍂 Shop link in bio! #SoyCandles #FallHome",
  "🕯️ Limited stock. Hand-poured, seasonal scents, soy wax. Real care — not a conveyor belt. Shop now before they're gone! #HandPoured #CozyVibes",
  "Burnt out on mass-produced? Same. Small-batch soy candles — pumpkin spice, cedarwood, vanilla oak. Big vibes. 🍂 Link in bio. #SmallBatch #SoyCandle",
]

const HOW_STEPS = [
  { n: '1', icon: '📝', title: 'Describe your product', desc: 'Name + a 2-sentence description. Takes 20 seconds.' },
  { n: '2', icon: '⚙️', title: 'Pick platform & tone', desc: 'Instagram, LinkedIn, X, Facebook or Google Ads. Choose your voice.' },
  { n: '3', icon: '⚡', title: 'Get 3 variants instantly', desc: 'Groq generates ready-to-post copy with quality scores in < 5s.' },
]

const WHY_METRIC = {
  stat: '33M+',
  label: 'small businesses',
  detail: 'in the US alone — 60% say marketing is their #1 challenge. None can afford an agency.',
}

const PERSONAS = [
  { initial: 'M', name: 'Maya, Boutique Owner', quote: '"3 hours on captions every week. Now I generate 3 options in seconds."', tag: 'Instagram · Playful' },
  { initial: 'R', name: 'Raj, Food Truck Owner', quote: '"I post between service shifts. ContentSpark takes 2 minutes flat."', tag: 'X / Twitter · Urgent' },
  { initial: 'S', name: 'Sandra, Etsy Seller', quote: '"My copy finally sounds like me — not a robot shouting at people."', tag: 'Facebook · Conversational' },
]

function ScoreRing({ score, size = 52, stroke = 4 }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const [drawn, setDrawn] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      let start = null
      const anim = (ts) => {
        if (!start) start = ts
        const p = Math.min((ts - start) / 1200, 1)
        setDrawn((1 - Math.pow(1 - p, 3)) * score)
        if (p < 1) requestAnimationFrame(anim)
      }
      requestAnimationFrame(anim)
    }, 600)
    return () => clearTimeout(t)
  }, [score])
  const offset = circ - (drawn / 100) * circ
  const color = score >= 80 ? '#4ade80' : '#fbbf24'
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }} aria-label={`Quality score ${score}`}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        filter={`drop-shadow(0 0 4px ${color})`} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ transform: `rotate(90deg) `, transformOrigin: `${size/2}px ${size/2}px`,
          fontSize: size * 0.26, fontWeight: 700, fill: color, fontFamily: 'var(--font-body)' }}>
        {Math.round(drawn)}
      </text>
    </svg>
  )
}

function TypingPreview() {
  const [varIdx, setVarIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState('typing')
  const text = TYPING_VARIANTS[varIdx]
  const timerRef = useRef(null)

  useEffect(() => {
    clearTimeout(timerRef.current)
    const i = displayed.length
    if (phase === 'typing') {
      if (i < text.length) {
        timerRef.current = setTimeout(() => setDisplayed(text.slice(0, i + 1)), 16 + Math.random() * 12)
      } else {
        timerRef.current = setTimeout(() => setPhase('pause'), 2600)
      }
    } else if (phase === 'pause') {
      timerRef.current = setTimeout(() => setPhase('erasing'), 100)
    } else {
      if (displayed.length > 0) {
        timerRef.current = setTimeout(() => setDisplayed(d => d.slice(0, -2)), 7)
      } else {
        setVarIdx(v => (v + 1) % TYPING_VARIANTS.length)
        setPhase('typing')
      }
    }
    return () => clearTimeout(timerRef.current)
  }, [displayed, phase, text])

  const score = [88, 82, 79][varIdx]

  return (
    <div className={styles.previewCard} role="region" aria-label="Live AI output preview">
      <div className={styles.previewBar}>
        <div className={styles.previewDots} aria-hidden="true"><span /><span /><span /></div>
        <span className={styles.previewLabel}>contentspark.ai — live AI output</span>
        <div className={styles.previewLivePill} aria-label="Live generation active">
          <span className={styles.previewLiveDot} />live
        </div>
      </div>
      <div className={styles.previewContent}>
        <div className={styles.previewInputRow}>
          <span className={styles.previewInputLabel}>Input</span>
          <span className={styles.previewInputText}>Hand-poured Soy Candles · Instagram · Playful</span>
        </div>
        <div className={styles.previewOutputLabel}>
          <span>Variant {varIdx + 1} of 3</span>
          <div className={styles.previewDotRow} aria-hidden="true">
            {TYPING_VARIANTS.map((_, i) => (
              <span key={i} className={`${styles.previewDotSmall} ${i === varIdx ? styles.previewDotSmallActive : ''}`} />
            ))}
          </div>
        </div>
        <p className={styles.previewText} aria-live="polite">
          {displayed}<span className={styles.cursor} aria-hidden="true" />
        </p>
        <div className={styles.previewFooter}>
          <div className={styles.previewScore}>
            <ScoreRing score={score} />
            <div>
              <div className={styles.previewScoreLabel}>Quality Score</div>
              <div className={styles.previewScoreSub}>{score >= 80 ? 'Excellent' : 'Strong'} · Ready to post</div>
            </div>
          </div>
          <div className={styles.previewActions}>
            <span className={styles.previewCharCount}>{displayed.length} / 2200</span>
            <button className={styles.previewCopy} onClick={() => navigator.clipboard?.writeText(displayed)}>
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Hero({ onGetStarted }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)
  const [personaIdx, setPersonaIdx] = useState(0)
  const [count, setCount] = useState(0)
  const countRef = useRef(null)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setWordIndex(i => (i + 1) % PLATFORMS_CYCLE.length); setVisible(true) }, 280)
    }, 2400)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const pt = setInterval(() => setPersonaIdx(i => (i + 1) % PERSONAS.length), 4500)
    return () => clearInterval(pt)
  }, [])

  useEffect(() => {
    const from = 12447, to = 12847, dur = 2000, st = performance.now()
    const tick = (now) => {
      const e = 1 - Math.pow(1 - Math.min((now - st) / dur, 1), 3)
      setCount(Math.floor(from + e * (to - from)))
      if (e < 1) countRef.current = requestAnimationFrame(tick)
    }
    const d = setTimeout(() => { countRef.current = requestAnimationFrame(tick) }, 400)
    return () => { clearTimeout(d); cancelAnimationFrame(countRef.current) }
  }, [])

  const p = PERSONAS[personaIdx]

  return (
    <section className={styles.hero}>
      <div className={styles.beam} aria-hidden="true" />
      <div className={styles.orb1} aria-hidden="true" />
      <div className={styles.orb2} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />

      <div className={styles.container}>

        {/* ── Social proof badge ── */}
        <div className={styles.liveBadge} aria-live="polite">
          <span className={styles.liveDot} aria-hidden="true" />
          <strong className={styles.liveCount}>{count.toLocaleString('en-IN')}</strong>
          <span className={styles.liveText}>pieces of content generated</span>
        </div>

        {/* ── ONE clear headline ── */}
        <h1 className={styles.headline}>
          Describe your product.<br />
          Get <span className={styles.headlineAccent}>publish-ready copy</span><br />
          <span className={styles.headlineMuted}>for{' '}
            <span className={styles.rotatingWord} style={{ opacity: visible ? 1 : 0 }} aria-live="polite">
              {PLATFORMS_CYCLE[wordIndex]}
            </span>
            {' '}in 5 seconds.
          </span>
        </h1>

        <p className={styles.sub}>
          ContentSpark AI is a free GenAI tool that turns any product description
          into agency-quality social posts, taglines, and ad copy — instantly.
          No copywriting skills. No subscription. Powered by Groq.
        </p>

        {/* ── PRIMARY CTA — single, unmissable ── */}
        <div className={styles.ctaRow}>
          <button
            className={styles.btnPrimary}
            onClick={onGetStarted}
            aria-label="Open the content generator"
          >
            <span aria-hidden="true">✦</span>
            Generate content free
            <span className={styles.btnArrow} aria-hidden="true">→</span>
          </button>
          <button className={styles.btnSecondary} onClick={onGetStarted}>
            See demo ↓
          </button>
        </div>

        {/* ── Trust signals ── */}
        <div className={styles.trustRow} aria-label="Trust signals">
          <span>No signup required</span>
          <span className={styles.trustDot} aria-hidden="true" />
          <span>Free forever</span>
          <span className={styles.trustDot} aria-hidden="true" />
          <span>Results in &lt; 5 seconds</span>
          <span className={styles.trustDot} aria-hidden="true" />
          <span>5 platforms supported</span>
        </div>

        {/* ── HERO VISUAL: live typing preview ── */}
        <TypingPreview />

        {/* ── WHY THIS MATTERS metric card ── */}
        <div className={styles.metricCard} role="complementary" aria-label="Market context">
          <div className={styles.metricStat}>{WHY_METRIC.stat}</div>
          <div className={styles.metricBody}>
            <div className={styles.metricLabel}>{WHY_METRIC.label}</div>
            <p className={styles.metricDetail}>{WHY_METRIC.detail}</p>
          </div>
          <div className={styles.metricVs}>
            <div className={styles.metricVsItem}>
              <span className={styles.metricX} aria-hidden="true">✕</span>
              <span>Agency: ₹40k–₹4L/mo</span>
            </div>
            <div className={styles.metricVsItem}>
              <span className={styles.metricX} aria-hidden="true">✕</span>
              <span>Freelancers: slow</span>
            </div>
            <div className={styles.metricVsItem}>
              <span className={styles.metricX} aria-hidden="true">✕</span>
              <span>DIY: 3+ hrs/week</span>
            </div>
            <div className={`${styles.metricVsItem} ${styles.metricVsWin}`}>
              <span aria-hidden="true">✓</span>
              <strong>ContentSpark: free &amp; instant</strong>
            </div>
          </div>
        </div>

        {/* ── HOW IT WORKS — 3 steps ── */}
        <div className={styles.howStrip} role="list" aria-label="How ContentSpark AI works">
          {HOW_STEPS.map((s, i) => (
            <div key={s.n} className={styles.howStep} role="listitem">
              <div className={styles.howStepNum} aria-hidden="true">{s.n}</div>
              <div className={styles.howStepIcon} aria-hidden="true">{s.icon}</div>
              <div className={styles.howStepTitle}>{s.title}</div>
              <div className={styles.howStepDesc}>{s.desc}</div>
              {i < HOW_STEPS.length - 1 && <div className={styles.howArrow} aria-hidden="true">→</div>}
            </div>
          ))}
        </div>

        {/* ── Persona testimonials ── */}
        <div className={styles.personaCard} role="region" aria-label="User testimonials">
          <div className={styles.personaAvatar} aria-hidden="true">{p.initial}</div>
          <div className={styles.personaBody}>
            <p className={styles.personaQuote}>{p.quote}</p>
            <div className={styles.personaMeta}>
              <span className={styles.personaName}>{p.name}</span>
              <span className={styles.personaTag}>{p.tag}</span>
            </div>
          </div>
          <div className={styles.personaDots} role="tablist" aria-label="Switch testimonial">
            {PERSONAS.map((per, i) => (
              <button key={i} role="tab" aria-selected={i === personaIdx} aria-label={`View ${per.name} testimonial`}
                className={`${styles.personaDot} ${i === personaIdx ? styles.personaDotActive : ''}`}
                onClick={() => setPersonaIdx(i)} />
            ))}
          </div>
        </div>

        {/* ── Tech stack ── */}
        <div className={styles.techRow} aria-label="Technology stack">
          {[
            { label: 'Groq LPU', color: '#f97316' },
            { label: 'LLaMA 3.3 70B', color: '#8b5cf6' },
            { label: 'React 18 + Vite', color: '#06b6d4' },
            { label: 'Supabase', color: '#10b981' },
          ].map(t => (
            <span key={t.label} className={styles.techPill}>
              <span className={styles.techDot} aria-hidden="true" style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }} />
              {t.label}
            </span>
          ))}
        </div>

      </div>
    </section>
  )
}