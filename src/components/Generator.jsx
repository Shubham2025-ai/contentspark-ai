import { useState, useRef, useCallback, useEffect } from 'react'
import { PLATFORMS, TONES, CONTENT_TYPES, CTAS, EMOJI_PREFS, GROQ_API, MODEL, buildPrompt, computeQualityScore, scoreLabel } from '../utils.js'
import styles from './Generator.module.css'

// ── Toast ────────────────────────────────────────────────────
let _tt = null
function showToast(msg, type = 'success') {
  let el = document.getElementById('cs-toast')
  if (!el) {
    el = document.createElement('div')
    el.id = 'cs-toast'
    Object.assign(el.style, {
      position: 'fixed', bottom: '32px', left: '50%',
      transform: 'translateX(-50%) translateY(20px)',
      padding: '11px 24px', borderRadius: '100px',
      fontSize: '13px', fontWeight: '600',
      fontFamily: 'var(--font-body)', zIndex: '99999',
      pointerEvents: 'none', opacity: '0',
      transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
      letterSpacing: '-0.01em', whiteSpace: 'nowrap',
    })
    document.body.appendChild(el)
  }
  const isSuccess = type === 'success'
  el.textContent = msg
  el.style.background = isSuccess ? '#08080f' : 'rgba(248,113,113,0.15)'
  el.style.border = isSuccess ? '1px solid rgba(245,200,66,0.4)' : '1px solid rgba(248,113,113,0.4)'
  el.style.color = isSuccess ? 'var(--accent)' : 'var(--red)'
  el.style.opacity = '1'
  el.style.transform = 'translateX(-50%) translateY(0)'
  clearTimeout(_tt)
  _tt = setTimeout(() => {
    el.style.opacity = '0'
    el.style.transform = 'translateX(-50%) translateY(10px)'
  }, 2400)
}

// ── Chip ─────────────────────────────────────────────────────
function Chip({ label, active, onClick, desc }) {
  return (
    <button className={`${styles.chip} ${active ? styles.chipActive : ''}`} onClick={onClick}>
      {label}
      {desc && <span className={styles.chipDesc}>{desc}</span>}
    </button>
  )
}

// ── Typing text animation ─────────────────────────────────────
function TypedText({ text, speed = 8 }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    setDisplayed('')
    setDone(false)
    if (!text) return
    let i = 0
    const tick = () => {
      i += Math.ceil(text.length / 120) // adaptive speed
      setDisplayed(text.slice(0, i))
      if (i < text.length) setTimeout(tick, speed)
      else setDone(true)
    }
    setTimeout(tick, 80)
  }, [text])
  return (
    <span>
      {displayed}
      {!done && <span className={styles.cursor}>|</span>}
    </span>
  )
}

// ── Score breakdown ────────────────────────────────────────────
function ScoreBreakdown({ text, platformId }) {
  const p = PLATFORMS.find(x => x.id === platformId)
  const limit = p?.limit || 280
  const charScore = text.length > 0 && text.length <= limit ? 25 : text.length <= limit * 1.1 ? 12 : 0
  const ctaScore = /shop|buy|get|order|book|visit|learn|start|claim|try|grab|discover|join/i.test(text) ? 20 : 0
  const emojiScore = (text.match(/\p{Emoji}/gu) || []).length >= 1 ? 10 : 5
  const hashCount = (text.match(/#\w+/g) || []).length
  const hashScore = p?.hashtags && hashCount >= 2 ? 15 : (!p?.hashtags && hashCount === 0) ? 15 : 5
  const sentences = text.split(/[.!?]+/).filter(Boolean)
  const avgWords = sentences.reduce((a, s) => a + s.trim().split(/\s+/).length, 0) / (sentences.length || 1)
  const readScore = avgWords >= 5 && avgWords <= 18 ? 15 : 7
  const emoScore = /amazing|incredible|love|perfect|best|exclusive|limited|free|now|today|transform|secret/i.test(text) ? 15 : 0
  const dims = [
    { label: 'Char limit', score: charScore, max: 25 },
    { label: 'CTA strength', score: ctaScore, max: 20 },
    { label: 'Readability', score: readScore, max: 15 },
    { label: 'Hashtags', score: hashScore, max: 15 },
    { label: 'Emotion', score: emoScore, max: 15 },
    { label: 'Emojis', score: emojiScore, max: 10 },
  ]
  return (
    <div className={styles.scoreBreakdown}>
      {dims.map(d => (
        <div key={d.label} className={styles.scoreDim}>
          <div className={styles.scoreDimLabel}>{d.label}</div>
          <div className={styles.scoreDimBar}>
            <div className={styles.scoreDimFill} style={{
              width: `${(d.score / d.max) * 100}%`,
              background: d.score === d.max ? 'var(--green)' : d.score > d.max * 0.5 ? 'var(--accent)' : 'var(--red)',
            }} />
          </div>
          <div className={styles.scoreDimVal}>{d.score}/{d.max}</div>
        </div>
      ))}
    </div>
  )
}

// ── Variant card ──────────────────────────────────────────────
function VariantCard({ text, index, platformId, tone, isError, isBest, isNew }) {
  const [copied, setCopied] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)
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
      <span>⚠</span>
      <p className={styles.varError}>{text}</p>
    </div>
  )

  return (
    <div className={`${styles.varCard} ${isBest ? styles.varCardBest : ''} ${isNew ? styles.varCardNew : ''}`}>
      {/* Header */}
      <div className={styles.varHeader}>
        <div className={styles.varHeaderLeft}>
          <span className={styles.varNum}>#{index + 1}</span>
          {isBest && <span className={styles.bestBadge}>✦ Best</span>}
          {overLimit && <span className={styles.overLimit}>Over limit</span>}
        </div>
        <div className={styles.varActions}>
          <button
            className={styles.breakdownBtn}
            onClick={() => setShowBreakdown(s => !s)}
            title="Score breakdown"
          >
            {showBreakdown ? 'Hide breakdown' : `${sc} pts`}
          </button>
          <button className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`} onClick={copy}>
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className={styles.varBody}>
        {isNew
          ? <p className={styles.varText}><TypedText text={text} /></p>
          : <p className={styles.varText}>{text}</p>}
      </div>

      {/* Score row */}
      <div className={styles.varFooter}>
        <span className={styles.charCount} style={{ color: overLimit ? 'var(--red)' : 'var(--text3)' }}>
          {text.length}<span style={{ opacity: 0.4 }}>/{p?.limit}</span>
        </span>
        <div className={styles.scoreRow}>
          <div className={styles.scoreBar}>
            <div className={styles.scoreFill} style={{ width: `${sc}%`, background: color }} />
          </div>
          <span className={styles.scoreNum} style={{ color }}>{sc}</span>
          <span className={styles.scoreLabel} style={{ color }}>{slabel}</span>
        </div>
      </div>

      {/* Expandable breakdown */}
      {showBreakdown && <ScoreBreakdown text={text} platformId={platformId} />}
    </div>
  )
}

// ── Skeleton ──────────────────────────────────────────────────
function SkeletonCard({ delay = 0 }) {
  return (
    <div className={styles.skeleton} style={{ animationDelay: `${delay}s` }}>
      {[92, 100, 78, 55, 40].map((w, i) => (
        <div key={i} className={styles.skeletonLine} style={{ width: `${w}%`, animationDelay: `${i * 0.06}s` }} />
      ))}
      <div className={styles.skeletonFooter}>
        <div className={styles.skeletonLine} style={{ width: '30%', height: 3 }} />
        <div className={styles.skeletonLine} style={{ width: '40%', height: 3 }} />
      </div>
    </div>
  )
}

// ── Download ──────────────────────────────────────────────────
function downloadAll(results, productName) {
  const lines = ['CONTENTSPARK AI — Generated Content', `Product: ${productName}`, `Generated: ${new Date().toLocaleString()}`, '='.repeat(60), '']
  Object.entries(results).forEach(([key, variants]) => {
    const [platId, ct] = key.split('__')
    const pl = PLATFORMS.find(x => x.id === platId)
    lines.push(`▸ ${pl?.label} — ${ct}`, '-'.repeat(40))
    variants.forEach((v, i) => { lines.push(`Variant ${i + 1}:`, v, '') })
    lines.push('')
  })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain' }))
  a.download = `contentspark-${productName.replace(/\s+/g, '-').toLowerCase()}.txt`
  a.click()
}

// ── Results section ────────────────────────────────────────────
function ResultsSection({ results, tone, productName, isNew }) {
  const [activeTab, setActiveTab] = useState(() => Object.keys(results)[0] || null)
  const tabs = Object.keys(results)
  const [platId, ct] = activeTab ? activeTab.split('__') : []
  const variants = activeTab ? results[activeTab] || [] : []
  const p = PLATFORMS.find(x => x.id === platId)

  const scores = variants.filter(v => !v.startsWith('Error:')).map(v => computeQualityScore(v, platId, tone))
  const bestIdx = scores.length ? scores.indexOf(Math.max(...scores)) : -1
  const totalVariants = Object.values(results).flat().length

  return (
    <div className={styles.results}>
      {/* Results header */}
      <div className={styles.resultsHeader}>
        <div>
          <h2 className={styles.resultsTitle}>
            Generated Content
          </h2>
          <p className={styles.resultsSub}>
            <span style={{ color: 'var(--green)', fontWeight: 700 }}>{totalVariants} variants</span>
            {' '}across {tabs.length} combination{tabs.length > 1 ? 's' : ''} · Click score to see breakdown
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => downloadAll(results, productName)}
            className={styles.downloadBtn}
          >
            ↓ Download .txt
          </button>
          <span className={styles.groqBadge}>
            <span className={styles.groqDot} />
            Groq · LLaMA 3.3 70B
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(key => {
          const [pid, ctype] = key.split('__')
          const pl = PLATFORMS.find(x => x.id === pid)
          const tabVars = results[key] || []
          const tabScores = tabVars.filter(v => !v.startsWith('Error:')).map(v => computeQualityScore(v, pid, tone))
          const avg = tabScores.length ? Math.round(tabScores.reduce((a, b) => a + b, 0) / tabScores.length) : 0
          const { color } = scoreLabel(avg)
          return (
            <button key={key}
              className={`${styles.tab} ${key === activeTab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(key)}
            >
              <span>{pl?.icon}</span>
              <span>{pl?.label}</span>
              <span className={styles.tabSep}>·</span>
              <span>{ctype}</span>
              <span className={styles.tabScore} style={{ color }}>{avg}</span>
            </button>
          )
        })}
      </div>

      {/* Platform info */}
      {p && (
        <div className={styles.platformInfo}>
          <span>{p.icon} {p.label}</span>
          <span className={styles.platformDivider} />
          <span>Max {p.limit} chars</span>
          <span className={styles.platformDivider} />
          <span>Tone: {tone}</span>
          <span className={styles.platformDivider} />
          <span>{ct}</span>
        </div>
      )}

      {/* Variant grid */}
      <div className={styles.varGrid}>
        {variants.map((v, i) => (
          <VariantCard
            key={`${activeTab}_${i}`}
            text={v}
            index={i}
            platformId={platId}
            tone={tone}
            isError={v.startsWith('Error:')}
            isBest={i === bestIdx && !v.startsWith('Error:')}
            isNew={isNew}
          />
        ))}
      </div>
    </div>
  )
}

// ── Demo examples ─────────────────────────────────────────────
const DEMOS = [
  { label: '🕯️ Soy Candles', productName: 'Hand-poured Soy Candles', description: 'Small-batch soy candles in seasonal scents — pumpkin spice, cedarwood, vanilla oak. Hand-poured in limited quantities. Perfect as gifts or a cozy home treat.', platform: 'instagram', tone: 'Playful', contentType: 'Social Post', cta: 'Shop Now', emojiPref: 'On' },
  { label: '🍛 Food Truck', productName: 'Spice Route Food Truck', description: 'South Asian street food truck serving authentic butter chicken wraps, masala fries, mango lassi. Downtown Mumbai. Fresh, fast, full of flavour.', platform: 'twitter', tone: 'Urgent', contentType: 'Social Post', cta: 'Visit Us', emojiPref: 'On' },
  { label: '🧶 Etsy Shop', productName: 'Knitted Goods by Sandra', description: 'Hand-knitted scarves, beanies, baby blankets from premium merino wool. Each piece takes 4–8 hours. Warm, personal, unique — no two identical.', platform: 'facebook', tone: 'Conversational', contentType: 'Product Description', cta: 'Shop Now', emojiPref: 'Minimal' },
]

// ── Main Generator ────────────────────────────────────────────
export default function Generator() {
  const groqKey = import.meta.env.VITE_GROQ_API_KEY || ''
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
  const [isNew, setIsNew] = useState(false)
  const resultsRef = useRef(null)

  const toggle = (arr, set, val) =>
    set(prev => prev.includes(val) ? prev.filter(x => x !== val) : [...prev, val])

  const fillDemo = (d) => {
    setProductName(d.productName); setDescription(d.description)
    setSelPlatforms([d.platform]); setTone(d.tone)
    setSelCTs([d.contentType]); setCta(d.cta)
    setEmojiPref(d.emojiPref); setResults({}); setError('')
    showToast(`✦ Loaded: ${d.label}`)
  }

  const validate = () => {
    if (!groqKey) { setError('Groq API key not configured. Add VITE_GROQ_API_KEY to Vercel env vars.'); return false }
    if (!productName.trim()) { setError('Product name is required.'); return false }
    if (!description.trim() || description.length < 10) { setError('Add a more detailed description for better results.'); return false }
    if (!selPlatforms.length) { setError('Select at least one platform.'); return false }
    if (!selCTs.length) { setError('Select at least one content type.'); return false }
    return true
  }

  const generate = useCallback(async () => {
    if (!validate()) return
    setLoading(true); setError(''); setResults({}); setProgress(0); setIsNew(true)
    const tasks = selPlatforms.flatMap(p => selCTs.map(ct => ({ p, ct })))
    const newResults = {}
    let done = 0

    for (const { p, ct } of tasks) {
      const pl = PLATFORMS.find(x => x.id === p)
      setLoadingStatus(`Writing ${ct} for ${pl?.label}...`)
      const key = `${p}__${ct}`
      try {
        const res = await fetch(GROQ_API, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqKey}` },
          body: JSON.stringify({
            model: MODEL, max_tokens: 1200, temperature: 0.88,
            messages: [{ role: 'user', content: buildPrompt(p, ct, { productName, description, tone, cta, emojiPref }) }],
          }),
        })
        if (!res.ok) {
          const e = await res.json().catch(() => ({}))
          throw new Error(e?.error?.message || `HTTP ${res.status}`)
        }
        const data = await res.json()
        const raw = data.choices?.[0]?.message?.content || ''
        const variants = raw.split('---VARIANT---').map(v => v.trim()).filter(Boolean).slice(0, 3)
        newResults[key] = variants.length ? variants : ['No content returned. Try regenerating.']
      } catch (e) {
        newResults[key] = [`Error: ${e.message}`]
        showToast(`Error on ${pl?.label}`, 'error')
      }
      done++
      setProgress(Math.round((done / tasks.length) * 100))
      setResults({ ...newResults })
    }
    setLoading(false); setLoadingStatus('')
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150)
    showToast(`✦ ${Object.values(newResults).flat().length} variants generated`)
  }, [groqKey, productName, description, selPlatforms, tone, selCTs, cta, emojiPref])

  const hasResults = !!Object.keys(results).length
  const totalVariants = selPlatforms.length * selCTs.length * 3

  return (
    <section id="generator" className={styles.section}>
      <div className={styles.sectionLabel}>
        <span className={styles.labelLine} />
        <span>AI Content Generator</span>
        <span className={styles.labelLine} />
      </div>

      <div className={styles.container}>
        {/* Demo bar */}
        <div className={styles.demoBar}>
          <span className={styles.demoLabel}>✦ Try a demo:</span>
          <div className={styles.demoButtons}>
            {DEMOS.map(d => (
              <button key={d.label} className={styles.demoBtn} onClick={() => fillDemo(d)}>{d.label}</button>
            ))}
          </div>
        </div>

        {/* Form card */}
        <div className={styles.formCard}>
          {/* Top accent */}
          <div className={styles.formCardAccent} />

          {/* Name + CTA */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>Product / Service <span className={styles.req}>*</span></label>
              <input className={styles.input} value={productName}
                onChange={e => setProductName(e.target.value)}
                placeholder="e.g. Hand-poured Soy Candles" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Call to Action</label>
              <select className={styles.input} value={cta} onChange={e => setCta(e.target.value)}>
                <option value="">Auto-detect best CTA</option>
                {CTAS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className={styles.field}>
            <label className={styles.label}>
              Description <span className={styles.req}>*</span>
              <span className={styles.charCount}
                style={{ color: description.length > 250 ? 'var(--accent)' : 'var(--text3)' }}>
                {description.length}/300
              </span>
            </label>
            <textarea className={`${styles.input} ${styles.textarea}`}
              value={description} rows={4}
              onChange={e => setDescription(e.target.value.slice(0, 300))}
              placeholder="What is it, who is it for, what's the key benefit? More detail = better output." />
          </div>

          {/* Platforms */}
          <div className={styles.field}>
            <label className={styles.label}>
              Platforms <span className={styles.req}>*</span>
              <span className={styles.fieldHint}>multi-select</span>
            </label>
            <div className={styles.chipGroup}>
              {PLATFORMS.map(p => (
                <Chip key={p.id} label={`${p.icon} ${p.label}`}
                  active={selPlatforms.includes(p.id)}
                  onClick={() => toggle(selPlatforms, setSelPlatforms, p.id)} />
              ))}
            </div>
          </div>

          {/* Tone + Content type side by side */}
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>Brand Tone <span className={styles.fieldHint}>single</span></label>
              <div className={styles.chipGroup}>
                {TONES.map(t => (
                  <Chip key={t.id} label={t.id} desc={t.desc}
                    active={tone === t.id} onClick={() => setTone(t.id)} />
                ))}
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Content Types <span className={styles.req}>*</span> <span className={styles.fieldHint}>multi</span></label>
              <div className={styles.chipGroup}>
                {CONTENT_TYPES.map(ct => (
                  <Chip key={ct.id} label={`${ct.icon} ${ct.id}`}
                    active={selCTs.includes(ct.id)}
                    onClick={() => toggle(selCTs, setSelCTs, ct.id)} />
                ))}
              </div>
            </div>
          </div>

          {/* Emoji */}
          <div className={styles.field}>
            <label className={styles.label}>Emoji Usage</label>
            <div className={styles.chipGroup}>
              {EMOJI_PREFS.map(e => <Chip key={e} label={e} active={emojiPref === e} onClick={() => setEmojiPref(e)} />)}
            </div>
          </div>

          {/* Summary */}
          <div className={styles.summary}>
            <div className={styles.summaryLeft}>
              <span className={styles.summaryBig}>{totalVariants}</span>
              <span className={styles.summarySmall}>variants will be generated</span>
            </div>
            <div className={styles.summaryRight}>
              <span>{selPlatforms.length} platform{selPlatforms.length !== 1 ? 's' : ''}</span>
              <span className={styles.summaryDot} />
              <span>{selCTs.length} type{selCTs.length !== 1 ? 's' : ''}</span>
              <span className={styles.summaryDot} />
              <span>3 variants each</span>
            </div>
          </div>

          {error && <div className={styles.error}><span>⚠</span> {error}</div>}

          {/* Generate button */}
          <button className={`${styles.genBtn} ${loading ? styles.genBtnLoading : ''}`}
            onClick={generate} disabled={loading}>
            {loading ? (
              <span className={styles.loadingInner}>
                <span className={styles.spinner} />
                <span>{loadingStatus || 'Generating…'}</span>
                <span className={styles.progressPill}>{progress}%</span>
              </span>
            ) : (
              <span className={styles.btnInner}>
                <span className={styles.btnSpark}>✦</span>
                Generate {totalVariants} variants with Groq
                <span className={styles.btnArrow}>→</span>
              </span>
            )}
          </button>

          {loading && (
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
              <div className={styles.progressGlow} style={{ left: `${progress}%` }} />
            </div>
          )}
        </div>

        {/* Skeleton or results */}
        <div ref={resultsRef}>
          {loading && !hasResults && (
            <div className={styles.skeletonWrap}>
              <div className={styles.skeletonHeader}>
                <div className={styles.skeletonTitle} />
                <div className={styles.skeletonSubtitle} />
              </div>
              <div className={styles.varGrid}>
                <SkeletonCard delay={0} /><SkeletonCard delay={0.1} /><SkeletonCard delay={0.2} />
              </div>
            </div>
          )}
          {hasResults && (
            <ResultsSection results={results} tone={tone} productName={productName} isNew={isNew} />
          )}
        </div>
      </div>
    </section>
  )
}