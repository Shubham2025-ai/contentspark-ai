import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth.jsx'
import { getDrafts, deleteDraft, updateDraft, togglePublished } from '../lib/supabase.js'
import { PLATFORMS, scoreLabel } from '../utils.js'
import styles from './Drafts.module.css'

function DraftCard({ draft, onDelete, onUpdate, onTogglePublish }) {
  const [editing, setEditing] = useState(false)
  const [note, setNote] = useState(draft.note || '')
  const [copied, setCopied] = useState(false)
  const p = PLATFORMS.find(x => x.id === draft.platform)
  const { label, color } = scoreLabel(draft.quality_score || 0)

  const copy = () => {
    navigator.clipboard.writeText(draft.content).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000)
    })
  }

  const saveNote = async () => {
    await onUpdate(draft.id, { note })
    setEditing(false)
  }

  return (
    <div className={`${styles.card} ${draft.is_published ? styles.cardPublished : ''}`}>
      {/* Card header */}
      <div className={styles.cardHeader}>
        <div className={styles.cardMeta}>
          <span className={styles.platform}>{p?.icon} {p?.label}</span>
          <span className={styles.sep}>·</span>
          <span className={styles.type}>{draft.content_type}</span>
          <span className={styles.sep}>·</span>
          <span className={styles.tone}>{draft.tone}</span>
        </div>
        <div className={styles.cardActions}>
          <span className={styles.score} style={{ color }}>{draft.quality_score} <span style={{ fontSize: 10, opacity: 0.8 }}>{label}</span></span>
          <button
            className={`${styles.publishBtn} ${draft.is_published ? styles.publishBtnActive : ''}`}
            onClick={() => onTogglePublish(draft.id, draft.is_published)}
            title={draft.is_published ? 'Mark unpublished' : 'Mark as published'}
          >
            {draft.is_published ? '✓ Published' : 'Mark published'}
          </button>
          <button className={styles.deleteBtn} onClick={() => onDelete(draft.id)}>✕</button>
        </div>
      </div>

      {/* Product name */}
      <div className={styles.productName}>{draft.product_name}</div>

      {/* Content */}
      <p className={styles.content}>{draft.content}</p>

      {/* Note */}
      <div className={styles.noteSection}>
        {editing ? (
          <div className={styles.noteEdit}>
            <textarea
              className={styles.noteInput}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note..."
              rows={2}
            />
            <div className={styles.noteEditActions}>
              <button className={styles.noteSave} onClick={saveNote}>Save</button>
              <button className={styles.noteCancel} onClick={() => setEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <div className={styles.noteDisplay} onClick={() => setEditing(true)}>
            {draft.note
              ? <span className={styles.noteText}>📝 {draft.note}</span>
              : <span className={styles.notePlaceholder}>+ Add note</span>}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={styles.cardFooter}>
        <span className={styles.date}>
          {new Date(draft.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
        </span>
        <button
          className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`}
          onClick={copy}
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}

export default function DraftsPage() {
  const { user } = useAuth()
  const [drafts, setDrafts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all | published | unpublished
  const [platformFilter, setPlatformFilter] = useState('all')
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (!user) return
    setLoading(true)
    getDrafts(user.id).then(({ data }) => {
      setDrafts(data || [])
      setLoading(false)
    })
  }, [user])

  const handleDelete = async (id) => {
    await deleteDraft(id)
    setDrafts(prev => prev.filter(d => d.id !== id))
  }

  const handleUpdate = async (id, updates) => {
    const { data } = await updateDraft(id, updates)
    if (data) setDrafts(prev => prev.map(d => d.id === id ? data : d))
  }

  const handleTogglePublish = async (id, current) => {
    const { data } = await togglePublished(id, current)
    if (data) setDrafts(prev => prev.map(d => d.id === id ? data : d))
  }

  const platforms = ['all', ...new Set(drafts.map(d => d.platform))]

  const filtered = drafts.filter(d => {
    if (filter === 'published' && !d.is_published) return false
    if (filter === 'unpublished' && d.is_published) return false
    if (platformFilter !== 'all' && d.platform !== platformFilter) return false
    if (search && !d.content.toLowerCase().includes(search.toLowerCase()) &&
        !d.product_name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  const publishedCount = drafts.filter(d => d.is_published).length

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>Saved Drafts</h1>
            <p className={styles.pageSub}>
              {drafts.length} draft{drafts.length !== 1 ? 's' : ''} · {publishedCount} published
            </p>
          </div>
        </div>

        {/* Search + filters */}
        <div className={styles.toolbar}>
          <input
            className={styles.search}
            placeholder="Search drafts…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <div className={styles.filters}>
            {['all', 'published', 'unpublished'].map(f => (
              <button
                key={f}
                className={`${styles.filterBtn} ${filter === f ? styles.filterBtnActive : ''}`}
                onClick={() => setFilter(f)}
              >
                {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
          <div className={styles.filters}>
            {platforms.map(p => {
              const pl = PLATFORMS.find(x => x.id === p)
              return (
                <button
                  key={p}
                  className={`${styles.filterBtn} ${platformFilter === p ? styles.filterBtnActive : ''}`}
                  onClick={() => setPlatformFilter(p)}
                >
                  {p === 'all' ? 'All platforms' : `${pl?.icon} ${pl?.label}`}
                </button>
              )
            })}
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <div className={styles.empty}>
            <span className={styles.spinner} />
            <p>Loading drafts…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyIcon}>📂</span>
            <p>{drafts.length === 0 ? 'No drafts yet. Generate content and save your favourites!' : 'No drafts match your filters.'}</p>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(d => (
              <DraftCard
                key={d.id}
                draft={d}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onTogglePublish={handleTogglePublish}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
