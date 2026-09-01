/** Month-end projection for the current month, from the pace so far. */

import { spendsInMonth, sumAbs } from './analyticsCore'
import { budgetForMonth, monthContext, safeToSpend } from './selectors'

// projecting a whole month from one or two days is noise, not a forecast
const MIN_DAYS_FOR_FORECAST = 3

export function monthForecast(state) {
  const m = monthContext(state)
  if (!m.isCurrent || m.dayOfMonth < MIN_DAYS_FOR_FORECAST) return null

  const spends = spendsInMonth(state, m.key)
  const spentSoFar = sumAbs(spends)
  const elapsed = Math.max(1, m.dayOfMonth)
  const daily = spentSoFar / elapsed
  const projected = Math.round(daily * m.daysInMonth)

  // the plan: this month's allocations for spendable categories, or — if none —
  // fall back to what's actually left to spend
  const budgetMap = budgetForMonth(state)
  const planned = state.categories
    .filter((c) => !c.kind)
    .reduce((s, c) => s + (budgetMap[c.id] ?? 0), 0)
  const target = planned > 0 ? planned : safeToSpend(state).spendable

  const delta = projected - target
  const status = delta > target * 0.03 ? 'over' : delta < -target * 0.05 ? 'under' : 'on-track'

  // running spend by day, then the day the projection would cross the target
  const dayTotals = Array.from({ length: m.daysInMonth }, () => 0)
  for (const t of spends) dayTotals[Number(t.date.slice(-2)) - 1] += Math.abs(t.amount)
  const cumulative = []
  let run = 0
  for (let i = 0; i < elapsed; i++) {
    run += dayTotals[i]
    cumulative.push(run)
  }
  const crossDay = daily > 0 ? Math.ceil(target / daily) : Infinity

  return {
    isCurrent: true,
    daysInMonth: m.daysInMonth,
    dayOfMonth: m.dayOfMonth,
    elapsed,
    daysLeft: m.daysLeft,
    spentSoFar,
    daily: Math.round(daily),
    projected,
    target,
    delta,
    status,
    cumulative,
    crossDay: crossDay > m.dayOfMonth && crossDay <= m.daysInMonth ? crossDay : null,
  }
}

/** Per-envelope projection — which jars are heading over. */
export function envelopeForecast(state) {
  const m = monthContext(state)
  if (!m.isCurrent || m.dayOfMonth < MIN_DAYS_FOR_FORECAST) return {}
  const elapsed = Math.max(1, m.dayOfMonth)
  const factor = m.daysInMonth / elapsed
  const out = {}
  const budgetMap = budgetForMonth(state)
  const byCat = {}
  for (const t of spendsInMonth(state, m.key)) {
    byCat[t.categoryId] = (byCat[t.categoryId] ?? 0) + Math.abs(t.amount)
  }
  for (const [id, spent] of Object.entries(byCat)) {
    const allocated = budgetMap[id] ?? 0
    if (allocated <= 0) continue
    const projected = Math.round(spent * factor)
    const dailyRate = spent / elapsed
    const crossDay = dailyRate > 0 ? Math.ceil(allocated / dailyRate) : Infinity
    out[id] = {
      projected,
      willOverspend: projected > allocated * 1.03,
      crossDay: crossDay > m.dayOfMonth && crossDay <= m.daysInMonth ? crossDay : null,
    }
  }
  return out
}
