/**
 * Everything a detector might need, computed once. Detectors are pure functions
 * of this object — no state access, no recomputation.
 *
 * The analysed month is always a *complete* one: the previous month while we're
 * mid-way through the current month, otherwise the selected month itself.
 */

import { MONTH_NAMES, daysInMonth, shiftMonth } from '../../lib/dates'
import { rupee } from '../../lib/format'
import { dayOfWeekSpend, spendsInMonth } from '../analyticsCore'
import { monthContext } from '../selectors'

const abs = (t) => Math.abs(t.amount)

export function buildContext(state) {
  const m = monthContext(state)
  const monthKey = m.isCurrent ? shiftMonth(m.key, -1) : m.key
  const monthName = MONTH_NAMES[Number(monthKey.slice(5, 7)) - 1]
  const dim = daysInMonth(monthKey)

  const catLabel = Object.fromEntries(state.categories.map((c) => [c.id, c.label]))
  const billNames = new Set(state.bills.map((b) => b.name.trim().toLowerCase()))

  const monthSpends = spendsInMonth(state, monthKey)
  const monthTotal = monthSpends.reduce((s, t) => s + abs(t), 0)

  const byCategory = {}
  for (const t of monthSpends) {
    const g = (byCategory[t.categoryId] ??= { spent: 0, count: 0 })
    g.spent += abs(t)
    g.count += 1
  }

  const dayTotals = Array.from({ length: dim }, () => 0)
  for (const t of monthSpends) dayTotals[Number(t.date.slice(-2)) - 1] += abs(t)

  // 6 completed months ending at monthKey
  const months = []
  let k = monthKey
  for (let i = 0; i < 6; i++) {
    months.unshift(k)
    k = shiftMonth(k, -1)
  }
  const monthlyTotals = months.map((key) => ({
    key,
    name: MONTH_NAMES[Number(key.slice(5, 7)) - 1],
    total: spendsInMonth(state, key).reduce((s, t) => s + abs(t), 0),
  }))

  // per-category totals for each of those months, aligned with `months`
  const categoryMonthly = {}
  months.forEach((key, i) => {
    for (const t of spendsInMonth(state, key)) {
      const arr = (categoryMonthly[t.categoryId] ??= Array(months.length).fill(0))
      arr[i] += abs(t)
    }
  })

  // transaction names that recur across the last 4 months
  const nameMonths = {}
  months.slice(-4).forEach((key) => {
    const seen = new Set()
    for (const t of spendsInMonth(state, key)) {
      const norm = t.name.trim().toLowerCase()
      if (seen.has(norm)) continue
      seen.add(norm)
      ;(nameMonths[norm] ??= { display: t.name.trim(), hits: [] }).hits.push(abs(t))
    }
  })

  return {
    monthKey,
    monthName,
    dim,
    monthSpends,
    monthTotal,
    byCategory,
    dayTotals,
    months,
    monthlyTotals,
    categoryMonthly,
    nameMonths,
    billNames,
    catLabel,
    dowAvg: dayOfWeekSpend(state),
    rupee,
  }
}
