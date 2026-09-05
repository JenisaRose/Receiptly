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

/** Compact, aggregate-only snapshot of the month sent to /api/insights — never
 *  individual transactions, to keep the payload small and private. */
export function buildMonthSummary(b) {
  return {
    monthLabel: b.month.longLabel,
    daysLeft: b.daysLeft,
    income: b.income,
    spentSoFar: b.spentSoFar,
    safeToday: b.safeToday,
    topCategories: b
      .categoryBreakdown('month')
      .slice(0, 4)
      .map((c) => ({ label: c.label, spent: c.spent })),
    forecast: b.forecast
      ? { projected: b.forecast.projected, target: b.forecast.target, status: b.forecast.status }
      : null,
    goals: b.goals.map((g) => ({ name: g.name, saved: g.saved, target: g.target, monthly: g.monthly })),
    insightHeadlines: b.insights.map((i) => i.headline),
  }
}

/** Cached AI summary text for this month, if one has already been generated. */
export function cachedAiSummary(monthKey) {
  return loadCache()[monthKey]?.text ?? null
}

/** Ask the serverless endpoint to write a fresh AI summary and cache it for the month. */
export async function fetchAiSummary(monthKey, summary) {
  const res = await fetch('/api/insights', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ summary }),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Could not generate the AI summary.')

  const cache = loadCache()
  cache[monthKey] = { text: data.text, generatedAt: Date.now() }
  saveCache(cache)
  return data.text
}
