import { useState, useRef, useCallback } from 'react'
import { PLATFORMS, TONES, CONTENT_TYPES, CTAS, EMOJI_PREFS, GROQ_API, MODEL, buildPrompt, computeQualityScore, scoreLabel } from '../utils.js'


import styles from './Generator.module.css'

function Chip({ label, active, onClick, desc }) {
  return (
    <button
      className={`${styles.chip} ${active ? styles.chipActive : ''}`}
      onClick={onClick}
    >
      {label}
      {desc && <span className={styles.chipDesc}>{desc}</span>}
    </button>
  )
}

// Global toast
let toastTimer = null
function showToast(msg) {
  let el = document.getElementById('cs-toast')
  if (!el) {
    el = document.createElement('div')
    el.id = 'cs-toast'
    el.style.cssText = `
      position:fixed;bottom:32px;left:50%;transform:translateX(-50%) translateY(20px);
      background:#08080f;border:1px solid rgba(245,200,66,0.35);color:var(--accent);
      padding:10px 24px;border-radius:100px;font-size:13px;font-weight:600;
      font-family:var(--font-body);z-index:9999;pointer-events:none;
      transition:all 0.3s cubic-bezier(0.16,1,0.3,1);opacity:0;
      box-shadow:0 8px 32px rgba(0,0,0,0.5),0 0 20px rgba(245,200,66,0.1);
      letter-spacing:-0.01em;
    `
    document.body.appendChild(el)
  }
  el.textContent = msg
  el.style.opacity = '1'
  el.style.transform = 'translateX(-50%) translateY(0)'
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    el.style.opacity = '0'
    el.style.transform = 'translateX(-50%) translateY(8px)'
  }, 2000)
}

function VariantCard({ text, index, platformId, tone, isError, isBest }) {
  const [copied, setCopied] = useState(false)
  const sc = computeQualityScore(text, platformId, tone)
  const { label: slabel, color } = scoreLabel(sc)
  const p = PLATFORMS.find(x => x.id === platformId)
  const overLimit = text.length > (p?.limit || 999)

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      showToast('✓ Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (isError) return (
    <div className={`${styles.varCard} ${styles.varCardError}`}>
      <p className={styles.varError}>{text}</p>
    </div>
  )

  return (
    <div className={`${styles.varCard} ${isBest ? styles.varCardBest : ''}`}>
      <div className={styles.varHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span className={styles.varNum}>Variant {index + 1}</span>
          {isBest && <span className={styles.bestBadge}>✦ Best</span>}
        </div>
        <div className={styles.varActions}>
          {overLimit && <span className={styles.overLimit}>Over limit</span>}
          <button className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`} onClick={copy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
      <p className={styles.varText}>{text}</p>
      <div className={styles.varFooter}>
        <span className={styles.charCount} style={{ color: overLimit ? 'var(--red)' : 'var(--text3)' }}>
          {text.length}/{p?.limit} chars
        </span>
        <div className={styles.scoreRow}>
          <div className={styles.scoreBar}>
            <div className={styles.scoreFill} style={{ width: `${sc}%`, background: color }} />
          </div>
          <span className={styles.scoreNum} style={{ color }}>{sc}</span>
          <span className={styles.scoreLabel} style={{ color }}>{slabel}</span>
        </div>
      </div>
    </div>
  )
}

function SkeletonCard() {
  return (
    <div style={{
      background: 'var(--bg2)', border: '1px solid var(--border)',
      borderRadius: 14, padding: 20, display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      {[100, 85, 60, 40].map((w, i) => (
        <div key={i} style={{
          height: i === 0 ? 10 : 12, borderRadius: 6, width: `${w}%`,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.4s infinite',
          animationDelay: `${i * 0.1}s`,
        }} />
      ))}
      <div style={{ marginTop: 8, height: 4, borderRadius: 2, width: '70%', background: 'rgba(255,255,255,0.06)' }} />
    </div>
  )
}

function downloadAllVariants(results, productName) {
  const lines = []
  lines.push(`CONTENTSPARK AI — Generated Content`)
  lines.push(`Product: ${productName}`)
  lines.push(`Generated: ${new Date().toLocaleString()}`)
  lines.push('='.repeat(60))
  lines.push('')

  Object.entries(results).forEach(([key, variants]) => {
    const [platId, ct] = key.split('__')
    const pl = PLATFORMS.find(x => x.id === platId)
    lines.push(`▸ ${pl?.label} — ${ct}`)
    lines.push('-'.repeat(40))
    variants.forEach((v, i) => {
      lines.push(`Variant ${i + 1}:`)
      lines.push(v)
      lines.push('')
    })
    lines.push('')
  })

  const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `contentspark-${productName.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.txt`
  a.click()
  URL.revokeObjectURL(url)
}

function ResultsSection({ results, tone, productName }) {
  const [activeTab, setActiveTab] = useState(() => Object.keys(results)[0] || null)

  const tabs = Object.keys(results)
  const [platId, ct] = activeTab ? activeTab.split('__') : []
  const variants = activeTab ? results[activeTab] || [] : []
  const p = PLATFORMS.find(x => x.id === platId)

  return (
    <div className={styles.results}>
      <div className={styles.resultsHeader}>
        <div>
          <h2 className={styles.resultsTitle}>Generated Content</h2>
          <p className={styles.resultsSub}>
            {tabs.length} combination{tabs.length > 1 ? 's' : ''} · 3 variants each
          </p>
        </div>
        <div className={styles.resultsMeta} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => downloadAllVariants(results, productName)}
            style={{
              padding: '7px 14px', borderRadius: 8, cursor: 'pointer', fontSize: 12, fontWeight: 600,
              border: '1px solid var(--border2)', background: 'var(--surface2)',
              color: 'var(--text2)', fontFamily: 'var(--font-body)', transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--text2)' }}
          >
            ↓ Download .txt
          </button>
          <span className={styles.groqBadge}>
            <span className={styles.groqDot} />
            Generated with Groq
          </span>
        </div>
      </div>

      <div className={styles.tabs}>
        {tabs.map(key => {
          const [pid, ctype] = key.split('__')
          const pl = PLATFORMS.find(x => x.id === pid)
          return (
            <button
              key={key}
              className={`${styles.tab} ${key === activeTab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(key)}
            >
              <span>{pl?.icon}</span>
              <span>{pl?.label}</span>
              <span className={styles.tabSep}>·</span>
              <span>{ctype}</span>
            </button>
          )
        })}
      </div>

      {p && (
        <div className={styles.platformInfo}>
          <span className={styles.platformIcon}>{p.icon}</span>
          <span>{p.label}</span>
          <span className={styles.platformDivider} />
          <span>Max {p.limit} chars</span>
          <span className={styles.platformDivider} />
          <span>Tone: {tone}</span>
          <span className={styles.platformDivider} />
          <span>Content: {ct}</span>
        </div>
      )}

      <div className={styles.varGrid}>
        {variants.map((v, i) => {
          const sc = computeQualityScore(v, platId, tone)
          const scores = variants.map(x => computeQualityScore(x, platId, tone))
          const bestIdx = scores.indexOf(Math.max(...scores))
          return (
            <VariantCard
              key={i}
              text={v}
              index={i}
              platformId={platId}
              tone={tone}
              isError={v.startsWith('Error:')}
              isBest={i === bestIdx && !v.startsWith('Error:')}
            />
          )
        })}
      </div>
    </div>
  )
}

const DEMO_EXAMPLES = [
  {
    label: '🕯️ Soy Candles',
    productName: 'Hand-poured Soy Candles',
    description: 'Small-batch soy candles in seasonal scents — pumpkin spice, cedarwood, and vanilla oak. Made by hand in limited quantities. Perfect as gifts or a cozy home treat.',
    platform: 'instagram',
    tone: 'Playful',
    contentType: 'Social Post',
    cta: 'Shop Now',
    emojiPref: 'On',
  },
  {
    label: '🍔 Food Truck',
    productName: 'Spice Route Food Truck',
    description: 'South Asian street food truck serving authentic butter chicken wraps, masala fries, and mango lassi. Operating in downtown Mumbai. Fresh, fast, and full of flavour.',
    platform: 'twitter',
    tone: 'Urgent',
    contentType: 'Social Post',
    cta: 'Visit Us',
    emojiPref: 'On',
  },
  {
    label: '🧶 Etsy Shop',
    productName: 'Knitted Goods by Sandra',
    description: 'Hand-knitted scarves, beanies, and baby blankets made from premium merino wool. Each piece takes 4–8 hours to craft. Warm, personal, and unique — no two items are identical.',
    platform: 'facebook',
    tone: 'Conversational',
    contentType: 'Product Description',
    cta: 'Shop Now',
    emojiPref: 'Minimal',
  },
]

export default function Generator() {
  const groqApiKey = import.meta.env.VITE_GROQ_API_KEY || ''
  const [productName, setProductName] = useState('')
  const [description, setDescription] = useState('')
  const [selPlatforms, setSelPlatforms] = useState(['instagram'])
  const [tone, setTone] = useState('Playful')
  const [selCTs, setSelCTs] = useState(['Social Post'])
  const [cta, setCta] = useState('')
  const [emojiPref, setEmojiPref] = useState('On')
  const [loading, setLoading] = useState(false)
  const [loadingStatus, setLoadingStatus] = useState('')
  const [error, setError] = useState('')
  const [results, setResults] = useState({})
  const [progress, setProgress] = useState(0)
  const resultsRef = useRef(null)

  const toggleArr = (arr, setArr, val) =>
    setArr(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])

  const fillDemo = (demo) => {
    setProductName(demo.productName)
    setDescription(demo.description)
    setSelPlatforms([demo.platform])
    setTone(demo.tone)
    setSelCTs([demo.contentType])
    setCta(demo.cta)
    setEmojiPref(demo.emojiPref)
    setResults({})
    setError('')
  }

  const validate = () => {
    if (!groqApiKey) { setError('Groq API key not configured. Add VITE_GROQ_API_KEY to your environment variables.'); return false }
    if (!productName.trim()) { setError('Product / Service name is required.'); return false }
    if (!description.trim()) { setError('Description is required.'); return false }
    if (description.trim().length < 10) { setError('Description is too short — add more detail for better results.'); return false }
    if (selPlatforms.length === 0) { setError('Select at least one platform.'); return false }
    if (selCTs.length === 0) { setError('Select at least one content type.'); return false }
    return true
  }

  const generate = useCallback(async () => {
    if (!validate()) return
    setLoading(true)
    setError('')
    setResults({})
    setProgress(0)

    const tasks = []
    for (const p of selPlatforms) for (const ct of selCTs) tasks.push({ p, ct })

    const newResults = {}
    let done = 0

    for (const { p, ct } of tasks) {
      const pl = PLATFORMS.find(x => x.id === p)
      setLoadingStatus(`Generating ${ct} for ${pl?.label}...`)
      const key = `${p}__${ct}`
      try {
        const res = await fetch(GROQ_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: MODEL,
            max_tokens: 1200,
            temperature: 0.88,
            messages: [{ role: 'user', content: buildPrompt(p, ct, { productName, description, tone, cta, emojiPref }) }],
          }),
        })

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData?.error?.message || `HTTP ${res.status} — check your API key`)
        }

        const data = await res.json()
        const raw = data.choices?.[0]?.message?.content || ''
        const variants = raw.split('---VARIANT---').map(v => v.trim()).filter(Boolean).slice(0, 3)
        const scores = variants.map(v => computeQualityScore(v, p, tone))
        newResults[key] = variants.length >= 1 ? variants : ['No content returned. Try again.']
      } catch (e) {
        newResults[key] = [`Error: ${e.message}`]
      }

      done++
      setProgress(Math.round((done / tasks.length) * 100))
      setResults({ ...newResults })
    }

    setLoading(false)
    setLoadingStatus('')
    setTimeout(() => {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }, [productName, description, selPlatforms, tone, selCTs, cta, emojiPref])

  const hasResults = Object.keys(results).length > 0

  return (
    <section id="generator" className={styles.section}>
      {/* Section label */}
      <div className={styles.sectionLabel}>
        <span className={styles.labelLine} />
        <span>Content Generator</span>
        <span className={styles.labelLine} />
      </div>

      <div className={styles.container}>
        {/* Demo examples bar */}
        <div className={styles.demoBar}>
          <span className={styles.demoLabel}>✦ Try an example:</span>
          <div className={styles.demoButtons}>
            {DEMO_EXAMPLES.map(demo => (
              <button
                key={demo.label}
                className={styles.demoBtn}
                onClick={() => fillDemo(demo)}
              >
                {demo.label}
              </button>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className={styles.formCard}>
          {/* Row 1: Name + CTA */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>
                Product / Service Name <span className={styles.req}>*</span>
              </label>
              <input
                className={styles.input}
                value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="e.g. Hand-poured Soy Candles, South Asian Food Truck…"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Call to Action</label>
              <select
                className={styles.input}
                value={cta}
                onChange={e => setCta(e.target.value)}
              >
                <option value="">Auto-detect best CTA</option>
                {CTAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>
              Description <span className={styles.req}>*</span>
              <span className={styles.charCount}>{description.length}/300</span>
            </label>
            <textarea
              className={`${styles.input} ${styles.textarea}`}
              value={description}
              onChange={e => setDescription(e.target.value.slice(0, 300))}
              placeholder="What is it, who is it for, what's the key benefit or differentiator? The more specific, the better the output."
              rows={4}
            />
          </div>

          {/* Platforms */}
          <div className={styles.field}>
            <label className={styles.label}>
              Target Platforms <span className={styles.req}>*</span>
              <span className={styles.fieldHint}>Multi-select</span>
            </label>
            <div className={styles.chipGroup}>
              {PLATFORMS.map(p => (
                <Chip
                  key={p.id}
                  label={`${p.icon} ${p.label}`}
                  active={selPlatforms.includes(p.id)}
                  onClick={() => toggleArr(selPlatforms, setSelPlatforms, p.id)}
                />
              ))}
            </div>
          </div>

          {/* Tone */}
          <div className={styles.field}>
            <label className={styles.label}>
              Brand Tone
              <span className={styles.fieldHint}>Single select</span>
            </label>
            <div className={styles.chipGroup}>
              {TONES.map(t => (
                <Chip
                  key={t.id}
                  label={t.id}
                  desc={t.desc}
                  active={tone === t.id}
                  onClick={() => setTone(t.id)}
                />
              ))}
            </div>
          </div>

          {/* Content Types */}
          <div className={styles.field}>
            <label className={styles.label}>
              Content Types <span className={styles.req}>*</span>
              <span className={styles.fieldHint}>Multi-select</span>
            </label>
            <div className={styles.chipGroup}>
              {CONTENT_TYPES.map(ct => (
                <Chip
                  key={ct.id}
                  label={`${ct.icon} ${ct.id}`}
                  active={selCTs.includes(ct.id)}
                  onClick={() => toggleArr(selCTs, setSelCTs, ct.id)}
                />
              ))}
            </div>
          </div>

          {/* Emoji */}
          <div className={styles.field}>
            <label className={styles.label}>Emoji Usage</label>
            <div className={styles.chipGroup}>
              {EMOJI_PREFS.map(e => (
                <Chip key={e} label={e} active={emojiPref === e} onClick={() => setEmojiPref(e)} />
              ))}
            </div>
          </div>

          {/* Summary preview */}
          <div className={styles.summary}>
            <span className={styles.summaryItem}>
              <strong>{selPlatforms.length}</strong> platform{selPlatforms.length !== 1 ? 's' : ''}
            </span>
            <span className={styles.summaryDot} />
            <span className={styles.summaryItem}>
              <strong>{selCTs.length}</strong> content type{selCTs.length !== 1 ? 's' : ''}
            </span>
            <span className={styles.summaryDot} />
            <span className={styles.summaryItem}>
              <strong>{selPlatforms.length * selCTs.length * 3}</strong> total variants
            </span>
          </div>

          {/* Error */}
          {error && (
            <div className={styles.error}>
              <span>⚠</span> {error}
            </div>
          )}

          {/* Generate button */}
          <button
            className={`${styles.genBtn} ${loading ? styles.genBtnLoading : ''}`}
            onClick={generate}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.loadingInner}>
                <span className={styles.spinner} />
                <span className={styles.loadingText}>{loadingStatus || 'Generating…'}</span>
                <span className={styles.loadingProgress}>{progress}%</span>
              </span>
            ) : (
              <span className={styles.btnInner}>
                <span>✦</span>
                Generate {selPlatforms.length * selCTs.length * 3} variants with Groq
                <span className={styles.btnArrow}>→</span>
              </span>
            )}
          </button>

          {/* Progress bar */}
          {loading && (
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        {/* Results / Skeleton */}
        <div ref={resultsRef}>
          {loading && Object.keys(results).length === 0 && (
            <div style={{ marginTop: 48 }}>
              <div style={{ marginBottom: 20 }}>
                <div style={{ height: 28, width: 220, borderRadius: 8, background: 'rgba(255,255,255,0.05)', marginBottom: 8 }} />
                <div style={{ height: 16, width: 160, borderRadius: 6, background: 'rgba(255,255,255,0.03)' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                <SkeletonCard /><SkeletonCard /><SkeletonCard />
              </div>
            </div>
          )}
          {hasResults && (
            <ResultsSection
              results={results}
              tone={tone}
              productName={productName}
            />
          )}
        </div>
      </div>
    </section>
  )
}