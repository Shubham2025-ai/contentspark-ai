import styles from './Features.module.css'

const FEATURES = [
  { icon: '⚡', title: 'Sub-5 second generation', desc: "Groq's LPU is the fastest inference engine on earth. 3 polished variants before you finish reading this sentence.", tag: 'Groq LPU' },
  { icon: '🎯', title: 'Platform-native limits', desc: '280 chars for X, 2200 for Instagram, no hashtags for Google Ads. Every output is formatted for its platform — automatically.', tag: '5 platforms' },
  { icon: '🔬', title: 'Quality score engine', desc: 'Each variant scores 0–100 on readability, CTA strength, emotional pull, and platform fit. Know which copy wins before you post.', tag: 'Local NLP' },
  { icon: '🎨', title: '5 brand tones', desc: 'Playful, Professional, Urgent, Inspirational, Conversational — your voice applied consistently across every platform and format.', tag: 'Tone model' },
  { icon: '📦', title: '5 content types', desc: 'Social posts, taglines, ad headlines, product descriptions, promotional offers — all from one product description.', tag: 'Multi-format' },
  { icon: '🔒', title: 'Privacy by design', desc: 'API key in env vars, never exposed. Zero server-side storage. Zero tracking. Scores computed locally — no extra API calls.', tag: 'Zero-data' },
]

const STEPS = [
  { num: '01', title: 'Describe your product', desc: 'Name and a 2-sentence description. Be specific — the AI rewards detail with much better output.' },
  { num: '02', title: 'Configure your output', desc: 'Pick platforms, tone, content type, CTA. Mix and match — generate 45 variants in a single click.' },
  { num: '03', title: 'Groq generates instantly', desc: 'LLaMA 3.3 70B via Groq crafts 3 distinct variants per combination. Different angles, same brand voice.' },
  { num: '04', title: 'Score, pick, publish', desc: 'Review quality scores for each variant, copy the winner, and post. Agency work in under 60 seconds.' },
]

const SAMPLES = [
  {
    platform: '📸 Instagram', tone: 'Playful', score: 88, color: '#4ade80',
    text: '✨ Fall vibes in a jar. Our pumpkin spice + cedarwood candle is back — and it\'s everything. Hand-poured in small batches, because some things are worth the extra love. 🍂 Gift it or keep it (we won\'t judge). Shop link in bio!',
    tags: '#SoyCandles #FallHome #SmallBatchGoods',
  },
  {
    platform: '🔍 Google Ads', tone: 'Urgent', score: 82, color: '#a3e635',
    text: 'Limited Stock — Hand-Poured Soy Candles. Shop Before They\'re Gone.',
    tags: null,
  },
  {
    platform: '💼 LinkedIn', tone: 'Professional', score: 85, color: '#4ade80',
    text: 'Small-batch craftsmanship meets seasonal inspiration. Our hand-poured soy candles are made with care — not on a conveyor belt. Because the details matter. Learn More →',
    tags: null,
  },
]

export default function Features() {
  return (
    <>
      {/* Features */}
      <section className={styles.section} id="features">
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
            {FEATURES.map(f => (
              <div key={f.title} className={styles.featureCard}>
                <div className={styles.featureIconRow}>
                  <div className={styles.featureIconWrap}>{f.icon}</div>
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
      <section className={styles.howSection} id="how">
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>How it works</span>
            <h2 className={styles.heading}>
              Product description to
              <br />
              <em>publish-ready copy.</em>
            </h2>
          </div>
          <div className={styles.steps}>
            {STEPS.map((s, i) => (
              <div key={s.num} className={styles.step}>
                <div className={styles.stepNumRow}>
                  <span className={styles.stepNum}>{s.num}</span>
                  {i < STEPS.length - 1 && <div className={styles.stepConnector} />}
                </div>
                <h3 className={styles.stepTitle}>{s.title}</h3>
                <p className={styles.stepDesc}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sample outputs */}
      <section className={styles.showcaseSection}>
        <div className={styles.container}>
          <div className={styles.sectionHead}>
            <span className={styles.eyebrow}>Sample outputs</span>
            <h2 className={styles.heading}>
              See what <em>great copy</em> looks like.
            </h2>
          </div>
          <div className={styles.showcaseGrid}>
            {SAMPLES.map(s => (
              <div key={s.platform} className={styles.showcaseCard}>
                <div className={styles.showcaseHeader}>
                  <span className={styles.showcasePlatform}>{s.platform} · {s.tone}</span>
                  <span className={styles.showcaseScore} style={{ color: s.color }}>{s.score}</span>
                </div>
                <p className={styles.showcaseText}>
                  {s.text}
                  {s.tags && <span className={styles.hash}> {s.tags}</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}