import { useState, useEffect } from 'react'
import styles from './Hero.module.css'

const ROTATING_WORDS = ['Instagram', 'LinkedIn', 'Twitter', 'Facebook', 'Google Ads']
const STATS = [
  { value: '< 5s', label: 'Generation time' },
  { value: '3×', label: 'Variants per request' },
  { value: '5', label: 'Platforms supported' },
  { value: '100%', label: 'Free to use' },
]

export default function Hero({ onGetStarted }) {
  const [wordIndex, setWordIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setWordIndex(i => (i + 1) % ROTATING_WORDS.length)
        setVisible(true)
      }, 300)
    }, 2200)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className={styles.hero}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />
      <div className={styles.grid} />

      <div className={styles.container}>
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Powered by Groq · LLaMA 3.3 70B · Free tier
        </div>

        <h1 className={styles.headline}>
          Agency-quality copy for
          <br />
          <span className={styles.rotatingWord} style={{ opacity: visible ? 1 : 0 }}>
            {ROTATING_WORDS[wordIndex]}
          </span>
          <br />
          <em className={styles.headlineItalic}>in under 5 seconds.</em>
        </h1>

        <p className={styles.sub}>
          Small businesses spend 3+ hours a week writing social media content.
          ContentSpark AI turns a product description into platform-ready,
          agency-quality copy — instantly. No copywriting skills needed.
        </p>

        <div className={styles.ctaRow}>
          <button className={styles.btnPrimary} onClick={onGetStarted}>
            <span className={styles.btnIcon}>✦</span>
            Generate content free
            <span className={styles.btnArrow}>→</span>
          </button>
          <button className={styles.btnSecondary} onClick={onGetStarted}>
            See how it works ↓
          </button>
        </div>

        <div className={styles.stats}>
          {STATS.map(s => (
            <div key={s.label} className={styles.stat}>
              <span className={styles.statValue}>{s.value}</span>
              <span className={styles.statLabel}>{s.label}</span>
            </div>
          ))}
        </div>

        <div className={styles.previewCard}>
          <div className={styles.previewBar}>
            <div className={styles.previewDots}>
              <span /><span /><span />
            </div>
            <span className={styles.previewLabel}>Live output preview</span>
            <span className={styles.previewBadge}>Instagram · Playful</span>
          </div>
          <div className={styles.previewContent}>
            <p className={styles.previewText}>
              ✨ Fall vibes in a jar. Our pumpkin spice + cedarwood candle is back — and it's
              everything. Hand-poured in small batches, because some things are worth the extra love.
              🍂 Gift it or keep it (we won't judge). Shop link in bio!
              <span className={styles.previewHash}> #SoyCandles #FallHome #SmallBatchGoods</span>
            </p>
            <div className={styles.previewFooter}>
              <div className={styles.previewScore}>
                <span className={styles.previewScoreNum}>88</span>
                <div className={styles.previewScoreBar}>
                  <div className={styles.previewScoreFill} style={{ width: '88%' }} />
                </div>
                <span className={styles.previewScoreLabel}>Quality Score</span>
              </div>
              <div className={styles.previewActions}>
                <span className={styles.previewCharCount}>218 / 2200 chars</span>
                <button className={styles.previewCopy}>Copy</button>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.problemStrip}>
          <div className={styles.problemItem}>
            <span className={styles.problemX}>✕</span>
            <span>Agency: $500–$5,000/month</span>
          </div>
          <div className={styles.problemItem}>
            <span className={styles.problemX}>✕</span>
            <span>Freelancers: slow turnaround</span>
          </div>
          <div className={styles.problemItem}>
            <span className={styles.problemX}>✕</span>
            <span>DIY: 3+ hours a week wasted</span>
          </div>
          <div className={styles.problemItem} style={{ color: 'var(--accent)' }}>
            <span style={{ color: 'var(--green)', fontWeight: 700 }}>✓</span>
            <span style={{ fontWeight: 600 }}>ContentSpark AI: free, instant</span>
          </div>
        </div>
      </div>
    </section>
  )
}