import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠ Supabase env vars missing. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env')
}

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
)

// ── Auth helpers ──────────────────────────────────────────────

export async function signInWithGoogle() {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: window.location.origin },
  })
}

export async function signInWithEmail(email, password) {
  return supabase.auth.signInWithPassword({ email, password })
}

export async function signUpWithEmail(email, password, fullName) {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession() {
  const { data } = await supabase.auth.getSession()
  return data.session
}

// ── Generation helpers ────────────────────────────────────────

export async function saveGeneration({ userId, productName, description, platform, contentType, tone, cta, emojiPref, variants, qualityScores }) {
  const avgScore = qualityScores.length
    ? Math.round(qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length)
    : 0

  const { data, error } = await supabase
    .from('generations')
    .insert({
      user_id: userId,
      product_name: productName,
      description,
      platform,
      content_type: contentType,
      tone,
      cta: cta || null,
      emoji_pref: emojiPref,
      variants,
      quality_scores: qualityScores,
      avg_score: avgScore,
    })
    .select()
    .single()

  return { data, error }
}

export async function getGenerations(userId, limit = 50) {
  return supabase
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
}

export async function deleteGeneration(id) {
  return supabase.from('generations').delete().eq('id', id)
}

// ── Draft helpers ─────────────────────────────────────────────

export async function saveDraft({ userId, generationId, productName, platform, contentType, tone, content, qualityScore, tags, note }) {
  const { data, error } = await supabase
    .from('drafts')
    .insert({
      user_id: userId,
      generation_id: generationId || null,
      product_name: productName,
      platform,
      content_type: contentType,
      tone,
      content,
      quality_score: qualityScore || 0,
      tags: tags || [],
      note: note || null,
    })
    .select()
    .single()

  return { data, error }
}

export async function getDrafts(userId) {
  return supabase
    .from('drafts')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
}

export async function updateDraft(id, updates) {
  return supabase
    .from('drafts')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
}

export async function deleteDraft(id) {
  return supabase.from('drafts').delete().eq('id', id)
}

export async function togglePublished(id, current) {
  return supabase
    .from('drafts')
    .update({ is_published: !current })
    .eq('id', id)
    .select()
    .single()
}

// ── Stats helpers ─────────────────────────────────────────────

export async function getUserStats(userId) {
  const [genRes, draftRes] = await Promise.all([
    supabase.from('generations').select('id, platform, tone, avg_score, created_at').eq('user_id', userId),
    supabase.from('drafts').select('id, platform, content_type, quality_score').eq('user_id', userId),
  ])

  const gens = genRes.data || []
  const drafts = draftRes.data || []

  const platformCounts = {}
  gens.forEach(g => { platformCounts[g.platform] = (platformCounts[g.platform] || 0) + 1 })

  const toneCounts = {}
  gens.forEach(g => { toneCounts[g.tone] = (toneCounts[g.tone] || 0) + 1 })

  const avgScore = gens.length
    ? Math.round(gens.reduce((a, g) => a + (g.avg_score || 0), 0) / gens.length)
    : 0

  return {
    totalGenerations: gens.length,
    totalDrafts: drafts.length,
    avgQualityScore: avgScore,
    platformCounts,
    toneCounts,
    recentGenerations: gens.slice(0, 5),
  }
}
