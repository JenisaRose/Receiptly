/**
 * Pure read models over the store state. Every selector answers for
 * `state.ui.selectedMonth`, so switching months needs no other change.
 */

import { MONTH_NAMES, daysInMonth as daysIn, monthRange, shiftMonth } from '../lib/dates'

/** "2026-08" -> { year, monthNum, daysInMonth, isCurrent, dayOfMonth, daysLeft, ... } */
export function monthContext(state) {
  const key = state.ui.selectedMonth
  const [year, monthNum] = key.split('-').map(Number)
  const daysInMonth = daysIn(key)

  const todayISO = state.clock.todayISO
  const currentKey = todayISO.slice(0, 7)
  const isCurrent = key === currentKey
  const isPast = key < currentKey
  const isFuture = key > currentKey

  const dayOfMonth = isCurrent ? Number(todayISO.slice(8, 10)) : isPast ? daysInMonth : 0
  const daysLeft = isCurrent ? Math.max(1, daysInMonth - dayOfMonth) : isPast ? 0 : daysInMonth

  return {
    key,
    year,
    monthNum,
    label: MONTH_NAMES[monthNum - 1],
    longLabel: `${MONTH_NAMES[monthNum - 1]} ${year}`,
    daysInMonth,
    isCurrent,
    isPast,
    isFuture,
    dayOfMonth,
    daysLeft,
    // total set aside across every savings goal this month; monthSettings can
    // still override the total for a given month if that's ever wired up
    goalSetAside:
      state.monthSettings[key]?.setAside ??
      (state.goals ?? []).reduce((sum, g) => sum + (g.monthly || 0), 0),
  }
}

/** Months the switcher can reach: earliest data → three months ahead of "now". */
export function availableMonths(state) {
  const currentKey = state.clock.todayISO.slice(0, 7)
  const earliest = state.transactions.reduce(
    (min, t) => (t.date.slice(0, 7) < min ? t.date.slice(0, 7) : min),
    currentKey,
  )
  return monthRange(earliest, shiftMonth(currentKey, 3))
}

export function categoryMap(state) {
  return Object.fromEntries(state.categories.map((c) => [c.id, c]))
}

/** Categories a user can actually assign a spend to (not Income / Buffer). */
export function spendableCategories(state) {
  return state.categories.filter((c) => !c.kind)
}

export function monthTransactions(state) {
  const prefix = state.ui.selectedMonth
  return state.transactions
    .filter((t) => t.date.startsWith(prefix))
    .sort((a, b) => b.date.localeCompare(a.date))
}

export function financials(state) {
  const txs = monthTransactions(state)
  const spends = txs.filter((t) => t.amount < 0)
  const credits = txs.filter((t) => t.amount > 0)
  return {
    txs,
    spends,
    credits,
    income: credits.reduce((s, t) => s + t.amount, 0),
    spentSoFar: spends.reduce((s, t) => s + Math.abs(t.amount), 0),
  }
}

export function billsForMonth(state) {
  const m = monthContext(state)
  const paid = new Set(state.billPayments[m.key] ?? [])
  return state.bills
    .map((b) => ({ ...b, paid: paid.has(b.id), daysAway: b.dueDay - m.dayOfMonth }))
    .sort((a, b) => Number(a.paid) - Number(b.paid) || a.dueDay - b.dueDay)
}

export function billSummary(state) {
  const m = monthContext(state)
  const bills = billsForMonth(state)
  const upcoming = bills.filter((b) => !b.paid && (!m.isCurrent || b.dueDay >= m.dayOfMonth))
  return {
    bills,
    upcoming,
    upcomingTotal: upcoming.reduce((s, b) => s + b.amount, 0),
    billsTotal: bills.reduce((s, b) => s + b.amount, 0),
    next7Total: bills
      .filter((b) => !b.paid && b.daysAway >= 0 && b.daysAway <= 7)
      .reduce((s, b) => s + b.amount, 0),
  }
}

export function budgetForMonth(state) {
  const m = monthContext(state)
  return { ...state.budgets.default, ...(state.budgets.byMonth[m.key] ?? {}) }
}

function groupByCategory(list) {
  const map = {}
  for (const t of list) {
    const g = (map[t.categoryId] ??= { spent: 0, txs: [] })
    g.spent += Math.abs(t.amount)
    g.txs.push(t)
  }
  return map
}

/** scope: 'month' | 'week' (week = the trailing 7 days inside the selected month) */
export function categoryBreakdown(state, scope = 'month') {
  const m = monthContext(state)
  const cats = categoryMap(state)
  const { spends } = financials(state)
  const weekStart = m.dayOfMonth - 6
  const list =
    scope === 'week'
      ? spends.filter((t) => Number(t.date.slice(-2)) >= weekStart)
      : spends
  return Object.entries(groupByCategory(list))
    .map(([id, g]) => ({
      id,
      label: cats[id]?.label ?? id,
      emoji: cats[id]?.emoji ?? '📦',
      color: cats[id]?.color ?? 'lilac',
      spent: g.spent,
      count: g.txs.length,
      txs: [...g.txs].sort((a, b) => b.date.localeCompare(a.date)),
    }))
    .sort((a, b) => b.spent - a.spent)
}

export function totalOut(state, scope = 'month') {
  return categoryBreakdown(state, scope).reduce((s, c) => s + c.spent, 0)
}

export function envelopes(state) {
  const cats = categoryMap(state)
  const budget = budgetForMonth(state)
  const spendByCat = groupByCategory(financials(state).spends)
  return Object.entries(budget)
    .map(([id, allocated]) => {
      const meta = cats[id] ?? {}
      const spent = spendByCat[id]?.spent ?? 0
      const ratio = allocated > 0 ? spent / allocated : 0
      return {
        id,
        label: meta.label ?? id,
        emoji: meta.emoji ?? '📦',
        color: meta.color ?? 'lilac',
        allocated,
        spent,
        remaining: allocated - spent,
        ratio,
        status: ratio > 1 ? 'over' : ratio >= 0.85 ? 'close' : 'ok',
        rolledOver: id === 'buffer' ? state.budgets.bufferRollover ?? 0 : 0,
      }
    })
    .sort((a, b) => b.ratio - a.ratio)
}

export function safeToSpend(state) {
  const m = monthContext(state)
  const { income, spentSoFar } = financials(state)
  const { upcomingTotal } = billSummary(state)
  const setAside = m.goalSetAside
  const spendable = income - upcomingTotal - setAside
  const leftToSpend = spendable - spentSoFar
  return {
    setAside,
    spendable,
    leftToSpend,
    safeToday: m.isCurrent ? Math.max(0, Math.round(leftToSpend / m.daysLeft)) : null,
  }
}

/** How many transactions reference a category (for the delete-category guard). */
export function categoryUsage(state, categoryId) {
  return state.transactions.filter((t) => t.categoryId === categoryId).length
}
