import { rupee } from '../lib/format'

const CACHE_KEY = 'receiptly.ai.v1'

function loadCache() {
  try {
    return JSON.parse(localStorage.getItem(CACHE_KEY)) ?? {}
  } catch {
    return {}
  }
}

function saveCache(cache) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache))
  } catch {
    /* storage full or unavailable — summary just won't be cached */
  }
}

/** Small stable hash so the same inputs always pick the same phrasing. */
function hashSeed(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) | 0
  return Math.abs(h)
}

function pick(variants, seed, offset) {
  return variants[(seed + offset) % variants.length]
}

function paceSentence(b, seed) {
  const f = b.forecast
  if (!f) {
    return pick(
      [
        `It's early days in ${b.month.longLabel} — ${rupee(b.spentSoFar)} logged so far.`,
        `${b.month.longLabel} is just getting started, with ${rupee(b.spentSoFar)} spent in the first few days.`,
      ],
      seed,
      0,
    )
  }
  const delta = rupee(Math.abs(f.delta))
  const projected = rupee(f.projected)
  const target = rupee(f.target)
  if (f.status === 'over') {
    return pick(
      [
        `You're on pace to land around ${projected} this month — about ${delta} over your ${target} plan.`,
        `Heads up: at this rate ${b.month.longLabel} finishes near ${projected}, roughly ${delta} past plan.`,
        `${b.month.longLabel} is running hot, projected to close around ${projected} — about ${delta} over your ${target} plan.`,
      ],
      seed,
      0,
    )
  }
  if (f.status === 'under') {
    return pick(
      [
        `You're pacing well this month — heading for about ${projected}, roughly ${delta} under your ${target} plan.`,
        `Nice control on spending — ${b.month.longLabel} looks set to land near ${projected}, about ${delta} under plan.`,
        `You're on track to underspend ${b.month.longLabel} by about ${delta}, landing close to ${projected}.`,
      ],
      seed,
      0,
    )
  }
  return pick(
    [
      `${b.month.longLabel} is running almost exactly on plan, projected to land right around ${projected}.`,
      `You're tracking your ${target} plan closely this month — expect to land near ${projected}.`,
    ],
    seed,
    0,
  )
}

function detailSentence(b, seed) {
  if (b.insights.length > 0) {
    const headline = pick(
      b.insights,
      seed,
      1,
    ).headline
    return pick(
      [`Worth noting: ${headline}.`, `One thing stands out this month — ${headline}.`, `${headline}, which is shaping how the month's gone.`],
      seed,
      1,
    )
  }
  const top = b.categoryBreakdown('month')[0]
  if (!top) return ''
  return pick(
    [
      `${top.label} is your biggest category so far at ${rupee(top.spent)}.`,
      `Most of that's going to ${top.label} — ${rupee(top.spent)} and counting.`,
      `${top.label} leads the month at ${rupee(top.spent)}.`,
    ],
    seed,
    1,
  )
}

function closingSentence(b, seed) {
  if (b.goals.length > 0) {
    const totalMonthly = b.goals.reduce((sum, g) => sum + g.monthly, 0)
    const top = [...b.goals].sort((a, z) => z.monthly - a.monthly)[0]
    return pick(
      [
        `Keep going and you'll add ${rupee(totalMonthly)} to your goals this month.`,
        `${top.name} is sitting at ${rupee(top.saved)}${top.target > 0 ? ` of ${rupee(top.target)}` : ''} — ${rupee(top.monthly)}/mo keeps it moving.`,
      ],
      seed,
      2,
    )
  }
  return pick(
    [
      `You've got about ${rupee(b.safeToday)} a day to work with for the next ${b.daysLeft} days.`,
      `That leaves roughly ${rupee(b.safeToday)}/day for the rest of ${b.month.longLabel}.`,
    ],
    seed,
    2,
  )
}

/** Compose a short, varied recap from data Receiptly already computes — the
 *  insights engine, forecast, category breakdown, and goals. Pure and fully
 *  local: same inputs + variant always produce the same text, no network
 *  call, nothing to configure. `variant` lets "regenerate" cycle through
 *  different (still true) phrasings of the same numbers. */
export function composeAiSummary(b, variant = 0) {
  const seed = hashSeed(`${b.month.key}:${b.spentSoFar}:${b.income}`) + variant
  const sentences = [paceSentence(b, seed), detailSentence(b, seed), closingSentence(b, seed)].filter(Boolean)
  return sentences.join(' ')
}

/** Cached AI summary + variant for this month, if one exists. */
export function cachedAiSummary(monthKey) {
  return loadCache()[monthKey] ?? null
}

/** Generate (or regenerate) the summary for this month and cache it. */
export function generateAiSummary(monthKey, b, { regenerate = false } = {}) {
  const cache = loadCache()
  const variant = regenerate ? ((cache[monthKey]?.variant ?? 0) + 1) % 100 : (cache[monthKey]?.variant ?? 0)
  const text = composeAiSummary(b, variant)
  cache[monthKey] = { text, variant }
  saveCache(cache)
  return text
}
