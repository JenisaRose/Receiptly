/** Shared primitives for analytics + insights (kept dependency-light). */

import { addDays, weekdayMon0 } from '../lib/dates'
import { monthContext } from './selectors'

export const p2 = (n) => String(n).padStart(2, '0')

export function spendsInMonth(state, key) {
  return state.transactions.filter((t) => t.amount < 0 && t.date.startsWith(key))
}

export function sumAbs(list) {
  return list.reduce((s, t) => s + Math.abs(t.amount), 0)
}

export function topCategory(state, spends) {
  const totals = {}
  for (const t of spends) totals[t.categoryId] = (totals[t.categoryId] ?? 0) + Math.abs(t.amount)
  const entry = Object.entries(totals).sort((a, b) => b[1] - a[1])[0]
  if (!entry) return null
  const cat = state.categories.find((c) => c.id === entry[0])
  return { id: entry[0], label: cat?.label ?? entry[0], amount: entry[1] }
}

/** The last day that "counts" for the selected month. */
export function referenceISO(state) {
  const m = monthContext(state)
  if (m.isPast) return `${m.key}-${p2(m.daysInMonth)}`
  return state.clock.todayISO
}

/** Mon–Sun *average* spend per occurrence over the trailing `weeks` weeks. */
export function dayOfWeekSpend(state, weeks = 8) {
  const ref = referenceISO(state)
  const start = addDays(ref, -(weeks * 7 - 1))
  const totals = [0, 0, 0, 0, 0, 0, 0]
  const counts = [0, 0, 0, 0, 0, 0, 0]
  for (let i = 0; i < weeks * 7; i++) counts[weekdayMon0(addDays(start, i))] += 1
  for (const t of state.transactions) {
    if (t.amount >= 0 || t.date < start || t.date > ref) continue
    totals[weekdayMon0(t.date)] += Math.abs(t.amount)
  }
  return totals.map((sum, i) => (counts[i] ? Math.round(sum / counts[i]) : 0))
}

/** Longest run of zeros in an array. */
export function longestRun(arr) {
  let best = 0
  let cur = 0
  for (const v of arr) {
    cur = v === 0 ? cur + 1 : 0
    if (cur > best) best = cur
  }
  return best
}
