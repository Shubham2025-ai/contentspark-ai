import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { getGenerations, deleteGeneration, saveDraft } from '../lib/supabase.js'
import { PLATFORMS, scoreLabel } from '../utils.js'
import styles from './History.module.css'

function StatCard({ value, label, icon }) {
  return (
    <div className={styles.statCard}>
      <span className={styles.statIcon}>{icon}</span>
      <span className={styles.statValue}>{value}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  )
}

function GenRow({ gen, onDelete, onSaveDraft, userId }) {
  const [expanded, setExpanded] = useState(false)
  const [saving, setSaving] = useState(null)
  const [saved, setSaved] = useState([])
  const p = PLATFORMS.find(x => x.id === gen.platform)
  const variants = gen.variants || []
  const scores = gen.quality_scores || []

  const handleSaveDraft = async (idx) => {
    setSaving(idx)
    const { error } = await saveDraft({
      userId,
      generationId: gen.id,
      productName: gen.product_name,
      platform: gen.platform,
      contentType: gen.content_type,
      tone: gen.tone,
      content: variants[idx],
      qualityScore: scores[idx] || 0,
    })
    setSaving(null)
    if (!error) setSaved(prev => [...prev, idx])
  }

  return (
    <div className={styles.genRow}>
      <div className={styles.genHeader} onClick={() => setExpanded(e => !e)}>
        <div className={styles.genMeta}>
          <span className={styles.genPlatform}>{p?.icon} {p?.label}</span>
          <span className={styles.genSep}>·</span>
          <span className={styles.genType}>{gen.content_type}</span>
          <span className={styles.genSep}>·</span>
          <span className={styles.genTone}>{gen.tone}</span>
        </div>
        <div className={styles.genRight}>
          <div className={styles.genScore}>
            <span style={{ color: scoreLabel(gen.avg_score || 0).color, fontWeight: 700 }}>
              {gen.avg_score || 0}
            </span>
            <span className={styles.genScoreLabel}>avg</span>
          </div>
          <span className={styles.genDate}>
            {new Date(gen.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </span>
          <button
            className={styles.deleteBtn}
            onClick={e => { e.stopPropagation(); onDelete(gen.id) }}
            title="Delete"
          >✕</button>
          <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}>›</span>
        </div>
      </div>

      <div className={styles.genProduct}>{gen.product_name}</div>

      {expanded && (
        <div className={styles.variantList}>
          {variants.map((v, i) => {
            const sc = scores[i] || 0
            const { label, color } = scoreLabel(sc)
            const isSaved = saved.includes(i)
            return (
              <div key={i} className={styles.variantItem}>
                <div className={styles.variantTop}>
                  <span className={styles.variantNum}>Variant {i + 1}</span>
                  <div className={styles.variantScoreRow}>
                    <span style={{ fontSize: 12, color, fontWeight: 700 }}>{sc} — {label}</span>
                    <button
                      className={`${styles.saveBtn} ${isSaved ? styles.saveBtnDone : ''}`}
                      onClick={() => !isSaved && handleSaveDraft(i)}
                      disabled={saving === i || isSaved}
                    >
                      {saving === i ? '…' : isSaved ? '✓ Saved' : '+ Save draft'}
                    </button>
                  </div>
                </div>
                <p className={styles.variantText}>{v}</p>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function HistoryPage() {
  const { user } = useAuth()
  const [generations, setGenerations] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getGenerations(user.id).then(({ data }) => {
      setGenerations(data || [])
      setLoading(false)
    })
  }, [user])

  const handleDelete = async (id) => {
    await deleteGeneration(id)
    setGenerations(prev => prev.filter(g => g.id !== id))
  }

  const platforms = ['all', ...new Set(generations.map(g => g.platform))]
  const filtered = filter === 'all' ? generations : generations.filter(g => g.platform === filter)

  const totalVariants = generations.length * 3
  const avgScore = generations.length
    ? Math.round(generations.reduce((a, g) => a + (g.avg_score || 0), 0) / generations.length)
    : 0
  const topPlatform = (() => {
    const counts = {}
    generations.forEach(g => counts[g.platform] = (counts[g.platform] || 0) + 1)
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
    return top ? PLATFORMS.find(p => p.id === top[0])?.label : '—'
  })()

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Generation History</h1>
            <p className={styles.pageSub}>Every piece of content you've generated</p>
          </div>
        </div>

        {/* Stats */}
        <div className={styles.statsRow}>
          <StatCard value={generations.length} label="Generations" icon="⚡" />
          <StatCard value={totalVariants} label="Total variants" icon="📝" />
          <StatCard value={avgScore} label="Avg quality score" icon="🎯" />
          <StatCard value={topPlatform} label="Top platform" icon="🏆" />
        </div>

        {/* Filter */}
        <div className={styles.filterRow}>
          {platforms.map(p => {
            const pl = PLATFORMS.find(x => x.id === p)
            return (
              <button
                key={p}
                className={`${styles.filterBtn} ${filter === p ? styles.filterBtnActive : ''}`}
                onClick={() => setFilter(p)}
              >
                {p === 'all' ? 'All platforms' : `${pl?.icon} ${pl?.label}`}
              </button>
            )
          })}
        </div>

        {/* List */}
        {loading ? (
          <div className={styles.empty}>
            <span className={styles.spinner} />
            <p>Loading history…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📭</span>
            <p>No generations yet. Go create some content!</p>
          </div>
        ) : (
          <div className={styles.list}>
            {filtered.map(g => (
              <GenRow
                key={g.id}
                gen={g}
                onDelete={handleDelete}
                userId={user.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
