import { buildContext } from './context'
import { DETECTORS } from './detectors'

/** Colour each tone maps to in the neubrutalist palette. */
export const INSIGHT_TONE = {
  watch: 'pink',
  good: 'mint',
  neutral: 'sky',
}

/**
 * Insights that are only meaningful once the month is over — a month-vs-average
 * comparison, a multi-month trend, a "you did X N times this month" tally. When
 * the analysed month is still in progress (Wrapped for the current month) these
 * are held back rather than comparing a third of a month against full ones.
 */
const RETROSPECTIVE = new Set([
  'month-vs-average',
  'spending-direction',
  'category-trend',
  'category-spike',
  'frequent-category',
])

/**
 * Run every detector over the analysed month, rank by score, keep the top
 * `limit` — one per `family` so we don't show two findings about one category.
 * `monthKey` forces a specific month (default: the last complete one).
 */
export function runInsights(state, { limit = 4, monthKey } = {}) {
  const ctx = buildContext(state, monthKey)
  if (ctx.monthTotal === 0) return []

  const found = []
  for (const detect of DETECTORS) {
    try {
      const insight = detect(ctx)
      if (!insight) continue
      if (ctx.partialMonth && RETROSPECTIVE.has(insight.id)) continue
      found.push(insight)
    } catch {
      /* a detector throwing must never break the screen */
    }
  }

  found.sort((a, b) => b.score - a.score)

  const seen = new Set()
  const picked = []
  for (const insight of found) {
    const family = insight.family ?? insight.id
    if (seen.has(family)) continue
    seen.add(family)
    picked.push(insight)
    if (picked.length >= limit) break
  }
  return picked
}
