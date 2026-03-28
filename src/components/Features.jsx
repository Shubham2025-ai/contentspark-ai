import styles from './Features.module.css'

const FEATURES = [
  {
    icon: '⚡',
    title: 'Sub-5 second generation',
    desc: "Groq's LPU inference engine is the fastest in the world. Get 3 high-quality variants before you finish your coffee.",
    tag: 'Groq LPU',
  },
  {
    icon: '🎯',
    title: 'Platform-native copy',
    desc: 'Every output respects platform rules — 280 chars for Twitter, no hashtags for Google Ads. Never get flagged for formatting.',
    tag: '5 platforms',
  },
  {
    icon: '🔬',
    title: 'Quality scoring engine',
    desc: 'Each variant is scored 0–100 across readability, CTA strength, emotional engagement, and platform compliance.',
    tag: 'Local NLP',
  },
  {
    icon: '🎨',
    title: '5 brand tones',
    desc: 'Playful, Professional, Urgent, Inspirational, Conversational. Your voice, applied consistently across every platform.',
    tag: 'Tone engine',
  },
  {
    icon: '📦',
    title: '5 content types',
    desc: 'Social posts, taglines, ad headlines, product descriptions, and promotional offers — all from one input.',
    tag: 'Multi-format',
  },
  {
    icon: '🔒',
    title: 'Your data, your key',
    desc: 'Your Groq API key never leaves your browser. Zero server-side storage. Zero tracking. GDPR compliant by design.',
    tag: 'Privacy-first',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Describe your product',
    desc: 'Enter your product name and a short description. Be specific — better input = better output.',
  },
  {
    num: '02',
    title: 'Configure your output',
    desc: 'Pick your platforms, tone, content type, and CTA preference. Mix and match freely.',
  },
  {
    num: '03',
    title: 'Generate with Groq',
    desc: 'Hit generate. Groq\'s LLaMA 3.3 70B crafts 3 distinct variants per combination in seconds.',
  },
  {
    num: '04',
    title: 'Score, refine, publish',
    desc: 'Review quality scores, copy your best variant, and post directly. Agency work in under a minute.',
  },
]

export default function Features() {
  return (
    <>
      {/* Features grid */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>Why ContentSpark</span>
            <h2 className={styles.heading}>
              Everything a small business needs.
              <br />
              <em>Nothing it doesn't.</em>
            </h2>
            <p className={styles.headSub}>
              Built for founders who move fast and can't afford to sound generic.
            </p>
          </div>

          <div className={styles.featureGrid}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className={styles.featureCard} style={{ animationDelay: `${i * 0.06}s` }}>
                <div className={styles.featureIconRow}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <span className={styles.featureTag}>{f.tag}</span>
                </div>
                <h3 className={styles.featureTitle}>{f.title}</h3>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className={styles.howSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>How it works</span>
            <h2 className={styles.heading}>
              From product description to
              <br />
              <em>publish-ready copy.</em>
            </h2>
          </div>

          <div className={styles.steps}>
            {STEPS.map((s, i) => (
              <div key={s.num} className={styles.step}>
                <div className={styles.stepNumWrap}>
                  <span className={styles.stepNum}>{s.num}</span>
                  {i < STEPS.length - 1 && <div className={styles.stepLine} />}
                </div>
                <div className={styles.stepContent}>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p className={styles.stepDesc}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample output showcase */}
      <section className={styles.showcaseSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>Sample outputs</span>
            <h2 className={styles.heading}>
              See what <em>great copy</em> looks like.
            </h2>
          </div>

          <div className={styles.showcaseGrid}>
            <div className={styles.showcaseCard}>
              <div className={styles.showcaseHeader}>
                <span className={styles.showcasePlatform}>📸 Instagram · Playful</span>
                <span className={styles.showcaseScore} style={{ color: '#34d399' }}>88</span>
              </div>
              <p className={styles.showcaseText}>
                ✨ Fall vibes in a jar. Our pumpkin spice + cedarwood candle is back — and it's everything.
                Hand-poured in small batches, because some things are worth the extra love. 🍂
                Gift it or keep it (we won't judge). Shop link in bio!
                <span className={styles.hash}> #SoyCandles #FallHome #SmallBatchGoods</span>
              </p>
            </div>

            <div className={styles.showcaseCard}>
              <div className={styles.showcaseHeader}>
                <span className={styles.showcasePlatform}>🔍 Google Ads · Urgent</span>
                <span className={styles.showcaseScore} style={{ color: '#a3e635' }}>82</span>
              </div>
              <p className={styles.showcaseText}>
                Limited Stock — Hand-Poured Soy Candles | Shop Now
              </p>
            </div>

            <div className={styles.showcaseCard}>
              <div className={styles.showcaseHeader}>
                <span className={styles.showcasePlatform}>💼 LinkedIn · Professional</span>
                <span className={styles.showcaseScore} style={{ color: '#34d399' }}>85</span>
              </div>
              <p className={styles.showcaseText}>
                Small-batch craftsmanship meets seasonal inspiration. Our hand-poured soy candles
                are made with care — not on a conveyor belt. Because the details matter. Learn More →
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
