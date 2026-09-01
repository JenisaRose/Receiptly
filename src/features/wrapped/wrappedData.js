import { WEEKDAYS, weekdayMon0 } from '../../lib/dates'
import { INSIGHT_TONE } from '../../store/insights/engine'

const p2 = (n) => String(n).padStart(2, '0')

/** Longest run of zeros in arr[0..upTo), returned as 1-indexed day numbers. */
function longestZeroRun(arr, upTo) {
  let best = null
  let start = -1
  for (let i = 0; i < upTo; i++) {
    if (arr[i] === 0) {
      if (start < 0) start = i
      const length = i - start + 1
      if (!best || length > best.length) best = { start: start + 1, end: i + 1, length }
    } else {
      start = -1
    }
  }
  return best
}

/**
 * Everything the seven Wrapped cards need for the currently selected month —
 * assembled from existing selectors (reflection, categoryBreakdown, insights,
 * forecast). Nothing here is hardcoded.
 */
export function buildWrapped(b) {
  const r = b.reflection
  if (r.total === 0) return { available: false, monthLabel: r.monthLabel }

  const breakdown = b.categoryBreakdown('month')
  const ranking = breakdown.slice(0, 4).map((c) => ({
    id: c.id,
    label: c.label,
    emoji: c.emoji,
    color: c.color,
    amount: c.spent,
    pct: Math.round((c.spent / r.total) * 100),
  }))
  const top = ranking[0] ?? null

  const pd = r.raw.priciestDay
  const priciest = pd
    ? {
        day: pd.day,
        amount: pd.amount,
        weekday: WEEKDAYS[weekdayMon0(`${r.monthKey}-${p2(pd.day)}`)],
        pctOfMonth: Math.round((pd.amount / r.total) * 100),
      }
    : null

  const rawInsight = b.insightsForMonth(b.month.key)[0]
  const insight = rawInsight ? { ...rawInsight, color: INSIGHT_TONE[rawInsight.tone] } : null

  const forecast = b.month.isCurrent && b.forecast ? b.forecast : null

  const daysInMonth = r.heat.length
  const countUpTo = b.month.isCurrent ? b.month.dayOfMonth : daysInMonth
  const noSpendDays = []
  for (let d = 1; d <= countUpTo; d++) if (r.heat[d - 1] === 0) noSpendDays.push(d)
  const streakRange = longestZeroRun(r.heat, countUpTo)

  const cards = ['opening', 'total']
  if (top) cards.push('leaderboard')
  if (priciest) cards.push('priciest')
  cards.push('nospend')
  if (insight) cards.push('insight')
  cards.push('final')

  return {
    available: true,
    monthLabel: r.monthLabel,
    monthLong: b.month.longLabel,
    year: r.year,
    total: r.total,
    txCount: r.txCount,
    activeDays: r.heat.filter((v) => v > 0).length,

    ranking,
    category: top,
    priciest,
    insight,
    forecast,

    heat: r.heat,
    firstWeekday: r.firstWeekday,
    daysInMonth,
    countUpTo,
    noSpendDays,
    noSpendCount: noSpendDays.length,
    streakRange,

    closing: pickClosing(r.raw, top, forecast, streakRange),
    cards,
  }
}

function pickClosing({ diffVsPrev }, category, forecast, streak) {
  if (forecast?.status === 'over') return 'worth easing off before month-end.'
  if (category && category.pct >= 40) return `${category.label.toLowerCase()} really ran the show.`
  if (diffVsPrev != null && diffVsPrev < 0) return 'quieter than last month. nice.'
  if (streak && streak.length >= 4) return `${streak.length} no-spend days straight — keep it going.`
  return 'that was your month. see you next one.'
}
