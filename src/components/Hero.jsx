import { useState, useEffect, useRef } from 'react'
import styles from './Hero.module.css'

const PLATFORMS_CYCLE = ['Instagram', 'LinkedIn', 'X / Twitter', 'Facebook', 'Google Ads']

const TYPING_VARIANTS = [
  "✨ Fall vibes in a jar. Our pumpkin spice + cedarwood candle is back — and it's everything. Hand-poured in small batches. 🍂 Gift it or keep it (we won't judge). Shop link in bio! #SoyCandles #FallHome",
  "🕯️ Your home deserves better than mass-produced. We hand-pour every candle in small batches — seasonal scents, soy wax, real care. Limited stock this fall. Shop now before they're gone! #HandPoured",
  "Burnt out on boring candles? Same. That's why we make ours by hand — pumpkin spice, cedarwood, vanilla oak. Small batch. Big vibes. 🍂 Link in bio. #SmallBatch #CozyVibes #SoyCandle",
]

const STATS = [
  { value: '< 5s', label: 'Per generation' },
  { value: '3×',   label: 'Variants each' },
  { value: '5',    label: 'Platforms' },
  { value: '₹0',   label: 'Cost forever' },
]

const PERSONAS = [
  { initial: 'M', name: 'Maya, Boutique Owner', quote: '"I used to spend 3 hours on Instagram captions. Now I generate 3 options in seconds and just pick the best one."', tag: 'Instagram · Playful' },
  { initial: 'R', name: 'Raj, Food Truck Owner', quote: '"I post between lunch and dinner service. ContentSpark AI lets me announce specials in 2 minutes flat."', tag: 'X / Twitter · Urgent' },
  { initial: 'S', name: 'Sandra, Etsy Seller', quote: '"I hated writing ads — felt like shouting at people. Now my copy actually sounds like me, not a robot."', tag: 'Facebook · Conversational' },
]

function ScoreRing({ score, size = 56, stroke = 4 }) {
  const r = (size - stroke * 2) / 2
  const circ = 2 * Math.PI * r
  const [drawn, setDrawn] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => {
      let start = null
      const dur = 1200
      const anim = (ts) => {
        if (!start) start = ts
        const p = Math.min((ts - start) / dur, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setDrawn(eased * score)
        if (p < 1) requestAnimationFrame(anim)
      }
      requestAnimationFrame(anim)
    }, 800)
    return () => clearTimeout(t)
  }, [score])

  const offset = circ - (drawn / 100) * circ
  const color = score >= 80 ? '#4ade80' : score >= 65 ? '#a3e635' : '#fbbf24'

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.05s' }}
        filter={`drop-shadow(0 0 4px ${color})`}
      />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        style={{ transform: 'rotate(90deg)', transformOrigin: `${size/2}px ${size/2}px`,
          fontSize: size * 0.26, fontWeight: 700, fill: color, fontFamily: 'var(--font-body)' }}>
        {Math.round(drawn)}
      </text>
    </svg>
  )
}

function TypingPreview() {
  const [varIdx, setVarIdx] = useState(0)
  const [displayed, setDisplayed] = useState('')
  const [phase, setPhase] = useState('typing') // typing | pause | erasing
  const text = TYPING_VARIANTS[varIdx]
  const timerRef = useRef(null)

  useEffect(() => {
    let i = displayed.length
    clearTimeout(timerRef.current)

    if (phase === 'typing') {
      if (i < text.length) {
        timerRef.current = setTimeout(() => {
          setDisplayed(text.slice(0, i + 1))
        }, 18 + Math.random() * 14)
      } else {
        timerRef.current = setTimeout(() => setPhase('pause'), 2400)
      }
    } else if (phase === 'pause') {
      timerRef.current = setTimeout(() => setPhase('erasing'), 100)
    } else if (phase === 'erasing') {
      if (displayed.length > 0) {
        timerRef.current = setTimeout(() => {
          setDisplayed(d => d.slice(0, -2))
        }, 8)
      } else {
        setVarIdx(v => (v + 1) % TYPING_VARIANTS.length)
        setPhase('typing')
      }
    }
    return () => clearTimeout(timerRef.current)
  }, [displayed, phase, text])

  const score = [88, 82, 79][varIdx] || 85

  return (
    <div className={styles.previewCard}>
      <div className={styles.previewBar}>
        <div className={styles.previewDots}><span /><span /><span /></div>
        <span className={styles.previewLabel}>contentspark.ai — live AI output</span>
        <div className={styles.previewLivePill}>
          <span className={styles.previewLiveDot} />live
        </div>
      </div>
      <div className={styles.previewContent}>
        <div className={styles.previewInputRow}>
          <span className={styles.previewInputLabel}>Input:</span>
          <span className={styles.previewInputText}>Hand-poured Soy Candles · Instagram · Playful</span>
        </div>
        <div className={styles.previewOutputLabel}>
          <span>Variant {varIdx + 1}</span>
          <div className={styles.previewDotRow}>
            {TYPING_VARIANTS.map((_, i) => (
              <span key={i} className={`${styles.previewDotSmall} ${i === varIdx ? styles.previewDotSmallActive : ''}`} />
            ))}
          </div>
        </div>
        <p className={styles.previewText}>
          {displayed}
          <span className={styles.cursor} />
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
            <button className={styles.previewCopy}>Copy</button>
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
  const BASE = 12847

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
    const from = BASE - 400
    const to = BASE
    const dur = 2000
    const st = performance.now()
    const tick = (now) => {
      const p = Math.min((now - st) / dur, 1)
      const e = 1 - Math.pow(1 - p, 3)
      setCount(Math.floor(from + e * (to - from)))
      if (p < 1) countRef.current = requestAnimationFrame(tick)
    }
    const delay = setTimeout(() => { countRef.current = requestAnimationFrame(tick) }, 400)
    return () => { clearTimeout(delay); cancelAnimationFrame(countRef.current) }
  }, [])

  const p = PERSONAS[personaIdx]

  return (
    <section className={styles.hero}>
      <div className={styles.beam} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.grid} />

      <div className={styles.container}>

        {/* Live counter */}
        <div className={styles.liveBadge} style={{ animation: 'fadeUp 0.6s var(--ease) both' }}>
          <span className={styles.liveDot} />
          <span className={styles.liveCount}>{count.toLocaleString('en-IN')}</span>
          <span className={styles.liveText}>pieces of content generated</span>
        </div>

        {/* Headline */}
        <h1 className={styles.headline}>
          Stop writing copy.<br />
          <span className={styles.headlineAccent}>Start publishing</span>{' '}
          <span className={styles.headlineMuted}>it.</span>
        </h1>

        <p className={styles.sub}>
          ContentSpark AI turns any product description into
          platform-ready marketing copy for{' '}
          <span className={styles.rotatingWord} style={{ opacity: visible ? 1 : 0 }}>
            {PLATFORMS_CYCLE[wordIndex]}
          </span>
          {' '}— in under 5 seconds. Powered by Groq. Free.
        </p>

        {/* Tech pills */}
        <div className={styles.techRow}>
          {[
            { label: 'Groq LPU', color: '#f97316' },
            { label: 'LLaMA 3.3 70B', color: '#8b5cf6' },
            { label: 'React 18', color: '#06b6d4' },
            { label: 'Supabase', color: '#10b981' },
            { label: 'Vite 5', color: '#f5c842' },
          ].map(t => (
            <span key={t.label} className={styles.techPill}>
              <span className={styles.techDot} style={{ background: t.color, boxShadow: `0 0 6px ${t.color}` }} />
              {t.label}
            </span>
          ))}
        </div>

        {/* CTA */}
        <div className={styles.ctaRow}>
          <button className={styles.btnPrimary} onClick={onGetStarted}>
            <span className={styles.btnSparkle}>✦</span>
            Generate content free
            <span className={styles.btnArrow}>→</span>
          </button>
          <button className={styles.btnSecondary} onClick={onGetStarted}>
            See it in action ↓
          </button>
        </div>

        {/* Stats */}
        <div className={styles.stats}>
          {STATS.map(s => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* LIVE TYPING PREVIEW — the WOW moment */}
        <TypingPreview />

        {/* Persona testimonials */}
        <div className={styles.personaCard}>
          <div className={styles.personaAvatar}>{p.initial}</div>
          <div className={styles.personaBody}>
            <p className={styles.personaQuote}>{p.quote}</p>
            <div className={styles.personaMeta}>
              <span className={styles.personaName}>{p.name}</span>
              <span className={styles.personaTag}>{p.tag}</span>
            </div>
          </div>
          <div className={styles.personaDots}>
            {PERSONAS.map((_, i) => (
              <button key={i}
                className={`${styles.personaDot} ${i === personaIdx ? styles.personaDotActive : ''}`}
                onClick={() => setPersonaIdx(i)} />
            ))}
          </div>
        </div>

        {/* Problem strip */}
        <div className={styles.problemStrip}>
          <div className={styles.problemItem}><span className={styles.problemX}>✕</span> Agency: ₹40k–₹4L/mo</div>
          <div className={styles.problemItem}><span className={styles.problemX}>✕</span> Freelancers: slow &amp; costly</div>
          <div className={styles.problemItem}><span className={styles.problemX}>✕</span> DIY: 3+ hrs/week wasted</div>
          <div className={styles.problemItem}><span className={styles.problemCheck}>✓</span> ContentSpark: free &amp; instant</div>
        </div>
      </div>
    </section>
  )
}