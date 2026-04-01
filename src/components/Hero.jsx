import { useState, useEffect, useRef } from 'react'
import styles from './Hero.module.css'

const ROTATING_WORDS = ['Instagram', 'LinkedIn', 'X / Twitter', 'Facebook', 'Google Ads']

const STATS = [
  { value: 5, suffix: 's', label: 'Generation time', prefix: '< ' },
  { value: 3, suffix: '×', label: 'Variants each', prefix: '' },
  { value: 5, suffix: '', label: 'Platforms', prefix: '' },
  { value: 0, suffix: '₹', label: 'Cost to use', prefix: '' },
]

function CountUp({ target, suffix, prefix, duration = 1200 }) {
  const [current, setCurrent] = useState(0)
  const started = useRef(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true
        if (target === 0) { setCurrent(0); return }
        const steps = 40
        const step = target / steps
        let cur = 0
        const interval = setInterval(() => {
          cur = Math.min(cur + step, target)
          setCurrent(Math.round(cur))
          if (cur >= target) clearInterval(interval)
        }, duration / steps)
      }
    }, { threshold: 0.3 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target, duration])

  if (target === 0) return <span ref={ref}>{prefix}0{suffix}</span>
  return <span ref={ref}>{prefix}{current}{suffix}</span>
}

export default function Hero({ onGetStarted }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const t = setInterval(() => {
      setVisible(false)
      setTimeout(() => { setWordIndex(i => (i + 1) % ROTATING_WORDS.length); setVisible(true) }, 280)
    }, 2400)
    return () => clearInterval(t)
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.beam} />
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.grid} />

      <div className={styles.container}>
        {/* Badge */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          <span className={styles.badgePill}>GenAI</span>
          Powered by Groq · LLaMA 3.3 70B · Free
        </div>

        {/* Headline */}
        <h1 className={styles.headline}>
          Marketing copy for{' '}
          <span className={styles.rotatingWord} style={{ opacity: visible ? 1 : 0 }}>
            {ROTATING_WORDS[wordIndex]}
          </span>
          <br />
          <span className={styles.headlineMuted}>that actually</span>{' '}
          <span className={styles.headlineAccent}>converts.</span>
        </h1>

        <p className={styles.sub}>
          Small businesses spend 3+ hours a week on social content.
          ContentSpark AI writes platform-ready, agency-quality copy
          from a product description — in under 5 seconds.
        </p>

        <div className={styles.ctaRow}>
          <button className={styles.btnPrimary} onClick={onGetStarted}>
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
              <span className={styles.statValue}>
                <CountUp target={s.value} suffix={s.suffix} prefix={s.prefix} />
              </span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Preview card */}
        <div className={styles.previewCard}>
          <div className={styles.previewBar}>
            <div className={styles.previewDots}><span /><span /><span /></div>
            <span className={styles.previewLabel}>contentspark.ai — live output preview</span>
            <span className={styles.previewBadge}>Instagram · Playful</span>
          </div>
          <div className={styles.previewContent}>
            <p className={styles.previewText}>
              ✨ Fall vibes in a jar. Our pumpkin spice + cedarwood candle is
              back — and it's everything. Hand-poured in small batches, because
              some things are worth the extra love. 🍂 Gift it or keep it
              (we won't judge). Shop link in bio!
              <span className={styles.previewHash}> #SoyCandles #FallHome #SmallBatchGoods</span>
            </p>
            <div className={styles.previewFooter}>
              <div className={styles.previewScore}>
                <span className={styles.previewScoreNum}>88</span>
                <div>
                  <div className={styles.previewScoreBar}>
                    <div className={styles.previewScoreFill} style={{ width: '88%' }} />
                  </div>
                  <span className={styles.previewScoreLabel}>Quality Score</span>
                </div>
              </div>
              <div className={styles.previewActions}>
                <span className={styles.previewCharCount}>218 / 2200 chars</span>
                <div className={styles.bestBadgeHero}>✦ Best</div>
                <button className={styles.previewCopy}>Copy</button>
              </div>
            </div>
          </div>
        </div>

        {/* Problem strip */}
        <div className={styles.problemStrip}>
          <div className={styles.problemItem}>
            <span className={styles.problemX}>✕</span>
            <span>Agency: ₹40k–₹4L/mo</span>
          </div>
          <div className={styles.problemItem}>
            <span className={styles.problemX}>✕</span>
            <span>Freelancers: slow &amp; costly</span>
          </div>
          <div className={styles.problemItem}>
            <span className={styles.problemX}>✕</span>
            <span>DIY: 3+ hrs/week wasted</span>
          </div>
          <div className={styles.problemItem} style={{ color: 'var(--text)' }}>
            <span className={styles.problemCheck}>✓</span>
            <span style={{ fontWeight: 600 }}>ContentSpark AI: free &amp; instant</span>
          </div>
        </div>

        {/* Trust line */}
        <p className={styles.trustLine}>
          🔒 Your data never leaves your browser. API key stored in environment variables only.
          Zero server-side logging.
        </p>
      </div>
    </section>
  )
}