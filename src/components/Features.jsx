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

export function AIArchSection() {
  const PIPELINE = [
    { step: '01', label: 'System context', desc: 'Platform rules, character limits, hashtag policies, format constraints', color: '#8b5cf6' },
    { step: '02', label: 'User input block', desc: 'Product name, description, tone, CTA preference, emoji setting', color: '#f5c842' },
    { step: '03', label: 'Quality constraints', desc: 'Prohibited patterns, brand safety rules, engagement benchmarks', color: '#06b6d4' },
    { step: '04', label: 'Few-shot examples', desc: '2–3 high-scoring examples per platform/tone combination injected', color: '#f97316' },
    { step: '05', label: 'LLaMA 3.3 70B', desc: 'Groq LPU inference — 300+ tokens/sec — 3 distinct variants returned', color: '#4ade80' },
    { step: '06', label: 'NLP scoring', desc: 'Local quality score: readability + CTA strength + platform fit + engagement', color: '#f87171' },
  ]

  return (
    <section style={{ padding: '100px 0', borderTop: '1px solid var(--border)', background: 'linear-gradient(180deg, rgba(245,200,66,0.015) 0%, transparent 100%)' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <span style={{
            display: 'inline-block', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 20,
            padding: '0 16px', position: 'relative',
          }}>
            <span style={{ position: 'absolute', top: '50%', right: '100%', width: 32, height: 1, background: 'rgba(245,200,66,0.4)', transform: 'translateY(-50%)' }} />
            <span style={{ position: 'absolute', top: '50%', left: '100%', width: 32, height: 1, background: 'rgba(245,200,66,0.4)', transform: 'translateY(-50%)' }} />
            Under the hood
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 300, letterSpacing: '-0.03em', color: 'var(--text)', lineHeight: 1.08, marginBottom: 16 }}>
            How the AI <em style={{ fontStyle: 'italic', color: 'var(--text2)' }}>thinks.</em>
          </h2>
          <p style={{ fontSize: 16, color: 'var(--text2)', maxWidth: 480, margin: '0 auto', fontWeight: 300, lineHeight: 1.7 }}>
            Every generation runs through a 6-stage prompt pipeline engineered for small business marketing.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 1, background: 'var(--border)', borderRadius: 24, overflow: 'hidden', border: '1px solid var(--border)' }}>
          {PIPELINE.map((item, i) => (
            <div key={item.step}
              style={{
                background: 'var(--bg2)', padding: '32px 28px',
                position: 'relative', overflow: 'hidden', transition: 'background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg2)' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${item.color}55, transparent)` }} />
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{
                  width: 36, height: 36, borderRadius: 10,
                  background: `${item.color}15`, border: `1px solid ${item.color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 800, color: item.color, letterSpacing: '0.04em',
                }}>{item.step}</div>
                {i < PIPELINE.length - 1 && (
                  <span style={{ fontSize: 18, color: 'var(--text4)', marginTop: 6 }}>→</span>
                )}
                {i === PIPELINE.length - 1 && (
                  <span style={{ fontSize: 14, color: 'var(--green)', fontWeight: 700 }}>✓</span>
                )}
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)', marginBottom: 8, letterSpacing: '-0.01em' }}>{item.label}</div>
              <div style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.65, fontWeight: 300 }}>{item.desc}</div>
            </div>
          ))}
        </div>

        {/* Groq speed callout */}
        <div style={{
          marginTop: 20, padding: '24px 32px',
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: var_r_lg, display: 'flex', alignItems: 'center',
          gap: 24, flexWrap: 'wrap',
        }}>
          {[
            { val: '300+', unit: 'tokens/sec', label: 'Groq inference speed' },
            { val: '70B', unit: 'parameters', label: 'LLaMA 3.3 model size' },
            { val: '< 5s', unit: 'end-to-end', label: 'From click to results' },
            { val: '0', unit: 'extra APIs', label: 'Quality scoring is local' },
          ].map(s => (
            <div key={s.val} style={{ flex: 1, minWidth: 120, textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, color: 'var(--accent)', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {s.val} <span style={{ fontSize: 14, color: 'var(--text3)', fontFamily: 'var(--font-body)', fontWeight: 500 }}>{s.unit}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text3)', marginTop: 4, fontWeight: 300 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const var_r_lg = '18px'