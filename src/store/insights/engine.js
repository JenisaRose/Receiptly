import { buildContext } from './context'
import { DETECTORS } from './detectors'

/** Colour each tone maps to in the neubrutalist palette. */
export const INSIGHT_TONE = {
  watch: 'pink',
  good: 'mint',
  neutral: 'sky',
}

/**
 * Run every detector over the analysed month, rank by score, keep the top
 * `limit` — one per `family` so we don't show two findings about one category.
 */
export function runInsights(state, limit = 4) {
  const ctx = buildContext(state)
  if (ctx.monthTotal === 0) return []

  const found = []
  for (const detect of DETECTORS) {
    try {
      const insight = detect(ctx)
      if (insight) found.push(insight)
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
