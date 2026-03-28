import { useState, useEffect } from 'react'
import styles from './Hero.module.css'

const ROTATING_WORDS = ['Instagram', 'LinkedIn', 'Twitter', 'Facebook', 'Google Ads']
const STATS = [
  { value: '< 5s', label: 'Generation time' },
  { value: '3×', label: 'Variants per request' },
  { value: '100%', label: 'Free tier (Groq)' },
  { value: '5', label: 'Platforms supported' },
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
      {/* Ambient background orbs */}
      <div className={styles.orb1} />
      <div className={styles.orb2} />
      <div className={styles.orb3} />
      {/* Grid overlay */}
      <div className={styles.grid} />

      <div className={styles.container}>
        {/* Badge */}
        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Powered by Groq · LLaMA 3.3 70B · Free tier
        </div>

        {/* Headline */}
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
          Stop staring at a blank screen. Describe your product, choose your
          platform and tone — ContentSpark AI writes 3 high-converting variants
          instantly. No subscription. No agency fees. Just results.
        </p>

        {/* CTA buttons */}
        <div className={styles.ctaRow}>
          <button className={styles.btnPrimary} onClick={onGetStarted}>
            <span className={styles.btnIcon}>✦</span>
            Generate content free
            <span className={styles.btnArrow}>→</span>
          </button>
          <a
            className={styles.btnSecondary}
            href="https://console.groq.com"
            target="_blank"
            rel="noreferrer"
          >
            Get Groq API key ↗
          </a>
        </div>

        {/* Stats strip */}
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
            <div className={styles.previewDots}>
              <span /><span /><span />
            </div>
            <span className={styles.previewLabel}>Live generation preview</span>
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
                <button className={styles.previewCopy}>Copy</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
