import { MONTH_NAMES } from '../lib/dates'
import { categoryMap } from './selectors'

export const EMPTY_FILTERS = {
  query: '',
  categoryIds: [],
  min: '',
  max: '',
  allMonths: false,
}

/** Is anything actually being searched / filtered? */
export function filtersActive(f) {
  return (
    f.query.trim() !== '' ||
    f.categoryIds.length > 0 ||
    f.min !== '' ||
    f.max !== '' ||
    f.allMonths
  )
}

/** "2026-09-03" -> "3 Sep"; add `'25` when the year isn't `thisYear`. */
export function shortDate(iso, thisYear) {
  const d = `${Number(iso.slice(8, 10))} ${MONTH_NAMES[Number(iso.slice(5, 7)) - 1].slice(0, 3)}`
  return String(thisYear) === iso.slice(0, 4) ? d : `${d} '${iso.slice(2, 4)}`
}

/**
 * Flat list of spend transactions matching the filters, newest first, each
 * enriched with its resolved category. Pure — reads only from state.
 */
export function filterTransactions(state, filters = EMPTY_FILTERS) {
  const { query, categoryIds, min, max, allMonths } = { ...EMPTY_FILTERS, ...filters }
  const cats = categoryMap(state)
  const q = query.trim().toLowerCase()
  const catSet = categoryIds.length ? new Set(categoryIds) : null
  const lo = min === '' ? null : Number(min)
  const hi = max === '' ? null : Number(max)
  const monthPrefix = state.ui.selectedMonth

  const rows = state.transactions
    .filter((t) => t.amount < 0)
    .filter((t) => allMonths || t.date.startsWith(monthPrefix))
    .filter((t) => !catSet || catSet.has(t.categoryId))
    .filter((t) => {
      const amt = Math.abs(t.amount)
      if (lo != null && amt < lo) return false
      if (hi != null && amt > hi) return false
      return true
    })
    .filter((t) => {
      if (!q) return true
      const label = cats[t.categoryId]?.label ?? t.categoryId
      return t.name.toLowerCase().includes(q) || label.toLowerCase().includes(q)
    })
    .map((t) => ({
      ...t,
      cat: cats[t.categoryId] ?? { label: t.categoryId, emoji: '📦', color: 'lilac' },
    }))
    .sort((a, b) => b.date.localeCompare(a.date))

  return {
    rows,
    count: rows.length,
    total: rows.reduce((s, t) => s + Math.abs(t.amount), 0),
  }
}
