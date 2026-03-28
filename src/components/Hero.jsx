import { useState, useEffect } from 'react'
import styles from './Hero.module.css'

const ROTATING_WORDS = ['Instagram', 'LinkedIn', 'X / Twitter', 'Facebook', 'Google Ads']
const STATS = [
  { value: '< 5s', label: 'Per generation' },
  { value: '3×', label: 'Variants each' },
  { value: '5', label: 'Platforms' },
  { value: '0₹', label: 'Cost to use' },
]

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
          <span className={styles.badgePill}>New</span>
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
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Preview card */}
        <div className={styles.previewCard}>
          <div className={styles.previewBar}>
            <div className={styles.previewDots}><span /><span /><span /></div>
            <span className={styles.previewLabel}>contentspark.ai — live output</span>
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
                <button className={styles.previewCopy}>Copy</button>
              </div>
            </div>
          </div>
        </div>

        {/* Problem strip */}
        <div className={styles.problemStrip}>
          <div className={styles.problemItem}>
            <span className={styles.problemX}>✕</span> Agency: ₹40k–₹4L/mo
          </div>
          <div className={styles.problemItem}>
            <span className={styles.problemX}>✕</span> Freelancers: slow
          </div>
          <div className={styles.problemItem}>
            <span className={styles.problemX}>✕</span> DIY: 3+ hrs/week
          </div>
          <div className={styles.problemItem}>
            <span className={styles.problemCheck}>✓</span> ContentSpark: free &amp; instant
          </div>
        </div>
      </div>
    </section>
  )
}