import { WEEKDAYS, weekdayMon0 } from '../../lib/dates'
import { ordinal, rupee } from '../../lib/format'
import { INSIGHT_TONE } from '../../store/insights/engine'

const p2 = (n) => String(n).padStart(2, '0')

/**
 * Assemble everything the Wrapped story needs for the currently selected month,
 * entirely from existing selectors (reflection, categoryBreakdown, insights,
 * forecast). The story adapts to whichever cards actually have data.
 */
export function buildWrapped(b) {
  const r = b.reflection
  const monthLabel = r.monthLabel
  const monthLong = b.month.longLabel

  if (r.total === 0) {
    return { available: false, monthLabel, monthLong }
  }

  const top = b.categoryBreakdown('month')[0] ?? null
  const category = top
    ? {
        label: top.label,
        emoji: top.emoji,
        color: top.color,
        amount: top.spent,
        pct: Math.round((top.spent / r.total) * 100),
      }
    : null

  const pd = r.raw.priciestDay
  const priciest = pd
    ? {
        day: pd.day,
        amount: pd.amount,
        weekday: WEEKDAYS[weekdayMon0(`${r.monthKey}-${p2(pd.day)}`)],
        label: `${WEEKDAYS[weekdayMon0(`${r.monthKey}-${p2(pd.day)}`)]} the ${ordinal(pd.day)}`,
      }
    : null

  const raw = b.insightsForMonth(b.month.key)[0]
  const insight = raw ? { ...raw, color: INSIGHT_TONE[raw.tone] } : null

  const forecast = b.month.isCurrent && b.forecast ? b.forecast : null
  const streak = { noSpendDays: r.raw.noSpendDays, bestRun: r.raw.bestRun }
  const achievement = pickAchievement(r.raw, forecast, monthLabel)
  const closing = pickClosing(r.raw, category, forecast)

  const cards = ['opening', 'total']
  if (category) cards.push('category')
  if (priciest) cards.push('priciest')
  if (insight) cards.push('insight')
  if (achievement) cards.push('streak')
  cards.push('final')

  return {
    available: true,
    monthLabel,
    monthLong,
    year: r.year,
    total: r.total,
    txCount: r.txCount,
    activeDays: r.heat.filter((v) => v > 0).length,
    category,
    priciest,
    insight,
    forecast,
    streak,
    achievement,
    closing,
    cards,
  }
}

function pickAchievement({ noSpendDays, bestRun, weeksUnder, weeksInMonth, diffVsPrev }, forecast, monthLabel) {
  if (bestRun >= 3) {
    return {
      emoji: '🧊',
      headline: `${bestRun}-day no-spend streak`,
      detail: `${noSpendDays} no-spend day${noSpendDays === 1 ? '' : 's'} in ${monthLabel} all up`,
      color: 'mint',
    }
  }
  if (noSpendDays >= 6) {
    return {
      emoji: '🧊',
      headline: `${noSpendDays} no-spend days`,
      detail: 'more than a full week left untouched',
      color: 'mint',
    }
  }
  if (weeksInMonth >= 3 && weeksUnder >= weeksInMonth) {
    return {
      emoji: '🎯',
      headline: 'every week under your cap',
      detail: `all ${weeksInMonth} weeks stayed under budget`,
      color: 'sky',
    }
  }
  if (weeksInMonth >= 3 && weeksUnder >= weeksInMonth - 1) {
    return {
      emoji: '🎯',
      headline: `${weeksUnder} of ${weeksInMonth} weeks under cap`,
      detail: 'mostly held the line',
      color: 'sky',
    }
  }
  if (diffVsPrev != null && diffVsPrev < -300) {
    return {
      emoji: '📉',
      headline: `${rupee(-diffVsPrev)} less than last month`,
      detail: 'the trend’s going the right way',
      color: 'mint',
    }
  }
  if (forecast?.status === 'under') {
    return {
      emoji: '👍',
      headline: 'tracking under your plan',
      detail: `about ${rupee(Math.abs(forecast.delta))} of room to spare`,
      color: 'mint',
    }
  }
  if (noSpendDays >= 2) {
    return {
      emoji: '🧊',
      headline: `${noSpendDays} no-spend days`,
      detail: 'small wins add up',
      color: 'mint',
    }
  }
  return null
}

function pickClosing({ topCategory, diffVsPrev, bestRun }, category, forecast) {
  if (forecast?.status === 'over') return 'worth easing off before month-end.'
  if (category && category.pct >= 40) return `${category.label.toLowerCase()} really ran the show.`
  if (diffVsPrev != null && diffVsPrev < 0) return 'quieter than last month. nice.'
  if (bestRun >= 4) return 'those no-spend days are becoming a habit.'
  if (topCategory && topCategory.pct >= 40) return 'one category did most of the talking.'
  return 'steady hands this month.'
}
