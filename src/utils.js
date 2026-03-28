export const GROQ_API = 'https://api.groq.com/openai/v1/chat/completions'
export const MODEL = 'llama-3.3-70b-versatile'

export const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: '📸', limit: 2200, hashtags: true, color: '#E1306C' },
  { id: 'twitter',   label: 'X / Twitter', icon: '𝕏', limit: 280,  hashtags: true, color: '#1DA1F2' },
  { id: 'facebook',  label: 'Facebook',  icon: '📘', limit: 500,  hashtags: false, color: '#1877F2' },
  { id: 'linkedin',  label: 'LinkedIn',  icon: '💼', limit: 700,  hashtags: true, color: '#0A66C2' },
  { id: 'google_ads',label: 'Google Ads',icon: '🔍', limit: 90,   hashtags: false, color: '#EA4335' },
]

export const TONES = [
  { id: 'Playful',        desc: 'Fun, light, energetic' },
  { id: 'Professional',   desc: 'Polished, credible' },
  { id: 'Urgent',         desc: 'FOMO-driven, time-sensitive' },
  { id: 'Inspirational',  desc: 'Uplifting, motivational' },
  { id: 'Conversational', desc: 'Warm, authentic, casual' },
]

export const CONTENT_TYPES = [
  { id: 'Social Post',           icon: '📣' },
  { id: 'Tagline',               icon: '💡' },
  { id: 'Ad Headline',           icon: '🎯' },
  { id: 'Product Description',   icon: '📦' },
  { id: 'Promotional Offer',     icon: '🏷️' },
]

export const CTAS = [
  'Shop Now', 'Book a Table', 'Learn More', 'Get Started',
  'Claim Offer', 'Visit Us', 'Order Now', 'Try Free', 'Join Now',
]

export const EMOJI_PREFS = ['On', 'Minimal', 'Off']

export function buildPrompt(platform, contentType, { productName, description, tone, cta, emojiPref }) {
  const p = PLATFORMS.find(x => x.id === platform)
  const emojiInstr = emojiPref === 'Off'
    ? 'Do not use any emojis whatsoever.'
    : emojiPref === 'Minimal'
    ? 'Use at most 1 emoji per variant, only if it truly adds value.'
    : 'Use 1–4 relevant emojis naturally placed for maximum engagement.'
  const ctaInstr = cta ? `End with a clear call-to-action: "${cta}".` : 'Include a natural, compelling call-to-action.'
  const hashInstr = p?.hashtags
    ? 'End with 3–5 highly relevant, trending hashtags.'
    : 'Do NOT include any hashtags.'

  return `You are a world-class marketing copywriter specializing in small business growth. Your copy converts browsers into buyers.

Generate EXACTLY 3 distinct, high-converting variations of a "${contentType}" for ${p?.label}.

PRODUCT/SERVICE: ${productName}
DESCRIPTION: ${description}
TARGET TONE: ${tone}
PLATFORM: ${p?.label} — strict ${p?.limit} character limit per post
${ctaInstr}
${emojiInstr}
${hashInstr}

CRAFT RULES:
- Every variant MUST be under ${p?.limit} characters (hard limit)
- Each variant must use a DIFFERENT angle: e.g. benefit-led, story-led, curiosity-led
- Tone must be consistently ${tone.toLowerCase()} — not generic
- Write like a human, not a chatbot — no filler phrases
- Small business audience: real, warm, not corporate
- Make someone STOP scrolling and TAKE ACTION

OUTPUT FORMAT: Return ONLY the 3 variants separated by exactly "---VARIANT---" — no labels, no numbering, no preamble, no explanation.`
}

export function computeQualityScore(text, platformId, tone) {
  if (!text || text.startsWith('Error:')) return 0
  let score = 0
  const p = PLATFORMS.find(x => x.id === platformId)
  const limit = p?.limit || 280

  // Character limit adherence (25 pts)
  if (text.length > 0 && text.length <= limit) score += 25
  else if (text.length <= limit * 1.1) score += 10

  // CTA strength (20 pts)
  const ctaWords = /shop|buy|get|order|book|visit|learn|start|claim|try|grab|discover|join|sign up|download/i
  if (ctaWords.test(text)) score += 20

  // Emoji usage (10 pts)
  const emojiCount = (text.match(/\p{Emoji}/gu) || []).length
  if (emojiCount >= 1 && emojiCount <= 5) score += 10
  else if (emojiCount === 0) score += 5 // still ok

  // Hashtag appropriateness (15 pts)
  const hashCount = (text.match(/#\w+/g) || []).length
  if (p?.hashtags && hashCount >= 2 && hashCount <= 6) score += 15
  else if (p?.hashtags && hashCount === 1) score += 8
  else if (!p?.hashtags && hashCount === 0) score += 15
  else if (!p?.hashtags && hashCount > 0) score += 0

  // Readability (15 pts)
  const sentences = text.split(/[.!?]+/).filter(Boolean)
  const avgWords = sentences.reduce((a, s) => a + s.trim().split(/\s+/).length, 0) / (sentences.length || 1)
  if (avgWords >= 5 && avgWords <= 18) score += 15
  else if (avgWords >= 3) score += 7

  // Emotional trigger words (15 pts)
  const emotional = /amazing|incredible|love|perfect|best|exclusive|limited|free|now|today|don.t miss|hurry|last chance|only|transform|secret|proven|guarantee/i
  if (emotional.test(text)) score += 15

  return Math.min(score, 100)
}

export function scoreLabel(score) {
  if (score >= 85) return { label: 'Excellent', color: '#34d399' }
  if (score >= 70) return { label: 'Strong', color: '#a3e635' }
  if (score >= 55) return { label: 'Good', color: '#fbbf24' }
  if (score >= 40) return { label: 'Fair', color: '#fb923c' }
  return { label: 'Weak', color: '#f87171' }
}

export function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }
