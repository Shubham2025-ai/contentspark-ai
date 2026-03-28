import { useState, useRef, useCallback } from 'react'
import { PLATFORMS, TONES, CONTENT_TYPES, CTAS, EMOJI_PREFS, GROQ_API, MODEL, buildPrompt, computeQualityScore, scoreLabel } from '../utils.js'
import styles from './Generator.module.css'

function Chip({ label, active, onClick, desc }) {
  return (
    <button className={`${styles.chip} ${active ? styles.chipActive : ''}`} onClick={onClick}>
      {label}
      {desc && <span className={styles.chipDesc}>{desc}</span>}
    </button>
  )
}

function VariantCard({ text, index, platformId, tone, isError }) {
  const [copied, setCopied] = useState(false)
  const sc = computeQualityScore(text, platformId, tone)
  const { label: slabel, color } = scoreLabel(sc)
  const p = PLATFORMS.find(x => x.id === platformId)
  const overLimit = text.length > (p?.limit || 999)

  const copy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  if (isError) return (
    <div className={`${styles.varCard} ${styles.varCardError}`}>
      <p className={styles.varError}>{text}</p>
    </div>
  )

  return (
    <div className={styles.varCard}>
      <div className={styles.varHeader}>
        <span className={styles.varNum}>Variant {index + 1}</span>
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

function ResultsSection({ results, tone }) {
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
          <p className={styles.resultsSub}>{tabs.length} combination{tabs.length > 1 ? 's' : ''} · 3 variants each</p>
        </div>
        <div className={styles.resultsMeta}>
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
            <button key={key}
              className={`${styles.tab} ${key === activeTab ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(key)}
            >
              <span>{pl?.icon}</span><span>{pl?.label}</span>
              <span className={styles.tabSep}>·</span><span>{ctype}</span>
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
        {variants.map((v, i) => (
          <VariantCard key={i} text={v} index={i} platformId={platId} tone={tone} isError={v.startsWith('Error:')} />
        ))}
      </div>
    </div>
  )
}

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

  const validate = () => {
    if (!groqApiKey) { setError('Groq API key not configured. Contact the team.'); return false }
    if (!productName.trim()) { setError('Product / Service name is required.'); return false }
    if (!description.trim()) { setError('Description is required.'); return false }
    if (description.trim().length < 10) { setError('Description too short — add more detail.'); return false }
    if (selPlatforms.length === 0) { setError('Select at least one platform.'); return false }
    if (selCTs.length === 0) { setError('Select at least one content type.'); return false }
    return true
  }

  const generate = useCallback(async () => {
    if (!validate()) return
    setLoading(true); setError(''); setResults({}); setProgress(0)
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
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${groqApiKey}` },
          body: JSON.stringify({
            model: MODEL, max_tokens: 1200, temperature: 0.88,
            messages: [{ role: 'user', content: buildPrompt(p, ct, { productName, description, tone, cta, emojiPref }) }],
          }),
        })
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}))
          throw new Error(errData?.error?.message || `HTTP ${res.status}`)
        }
        const data = await res.json()
        const raw = data.choices?.[0]?.message?.content || ''
        const variants = raw.split('---VARIANT---').map(v => v.trim()).filter(Boolean).slice(0, 3)
        newResults[key] = variants.length >= 1 ? variants : ['No content returned. Try again.']
      } catch (e) {
        newResults[key] = [`Error: ${e.message}`]
      }
      done++
      setProgress(Math.round((done / tasks.length) * 100))
      setResults({ ...newResults })
    }

    setLoading(false); setLoadingStatus('')
    setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 200)
  }, [productName, description, selPlatforms, tone, selCTs, cta, emojiPref])

  const hasResults = Object.keys(results).length > 0

  return (
    <section id="generator" className={styles.section}>
      <div className={styles.sectionLabel}>
        <span className={styles.labelLine} /><span>Content Generator</span><span className={styles.labelLine} />
      </div>
      <div className={styles.container}>
        <div className={styles.formCard}>
          <div className={styles.row2}>
            <div className={styles.field}>
              <label className={styles.label}>Product / Service Name <span className={styles.req}>*</span></label>
              <input className={styles.input} value={productName} onChange={e => setProductName(e.target.value)} placeholder="e.g. Hand-poured Soy Candles, South Asian Food Truck…" />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Call to Action</label>
              <select className={styles.input} value={cta} onChange={e => setCta(e.target.value)}>
                <option value="">Auto-detect best CTA</option>
                {CTAS.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>
              Description <span className={styles.req}>*</span>
              <span className={styles.charCount}>{description.length}/300</span>
            </label>
            <textarea className={`${styles.input} ${styles.textarea}`} value={description}
              onChange={e => setDescription(e.target.value.slice(0, 300))}
              placeholder="What is it, who is it for, what's the key benefit?" rows={4} />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Target Platforms <span className={styles.req}>*</span> <span className={styles.fieldHint}>Multi-select</span></label>
            <div className={styles.chipGroup}>
              {PLATFORMS.map(p => <Chip key={p.id} label={`${p.icon} ${p.label}`} active={selPlatforms.includes(p.id)} onClick={() => toggleArr(selPlatforms, setSelPlatforms, p.id)} />)}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Brand Tone <span className={styles.fieldHint}>Single select</span></label>
            <div className={styles.chipGroup}>
              {TONES.map(t => <Chip key={t.id} label={t.id} desc={t.desc} active={tone === t.id} onClick={() => setTone(t.id)} />)}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Content Types <span className={styles.req}>*</span> <span className={styles.fieldHint}>Multi-select</span></label>
            <div className={styles.chipGroup}>
              {CONTENT_TYPES.map(ct => <Chip key={ct.id} label={`${ct.icon} ${ct.id}`} active={selCTs.includes(ct.id)} onClick={() => toggleArr(selCTs, setSelCTs, ct.id)} />)}
            </div>
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Emoji Usage</label>
            <div className={styles.chipGroup}>
              {EMOJI_PREFS.map(e => <Chip key={e} label={e} active={emojiPref === e} onClick={() => setEmojiPref(e)} />)}
            </div>
          </div>

          <div className={styles.summary}>
            <span className={styles.summaryItem}><strong>{selPlatforms.length}</strong> platform{selPlatforms.length !== 1 ? 's' : ''}</span>
            <span className={styles.summaryDot} />
            <span className={styles.summaryItem}><strong>{selCTs.length}</strong> content type{selCTs.length !== 1 ? 's' : ''}</span>
            <span className={styles.summaryDot} />
            <span className={styles.summaryItem}><strong>{selPlatforms.length * selCTs.length * 3}</strong> total variants</span>
          </div>

          {error && <div className={styles.error}><span>⚠</span> {error}</div>}

          <button className={`${styles.genBtn} ${loading ? styles.genBtnLoading : ''}`} onClick={generate} disabled={loading}>
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

          {loading && (
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: `${progress}%` }} />
            </div>
          )}
        </div>

        <div ref={resultsRef}>
          {hasResults && <ResultsSection results={results} tone={tone} />}
        </div>
      </div>
    </section>
  )
}