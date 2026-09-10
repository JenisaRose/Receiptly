/**
 * The pure budget logic behind the provider — payload normalisers, the
 * transaction builder, the load-time migrations, and `derive()` which composes
 * every selector into the object screens read via `useBudget()`.
 *
 * Split out from `budget.jsx` so it's unit-testable without rendering React.
 * `budget.jsx` is now just the provider: state + actions that call these.
 */

import { trendsByMonth, trendsByWeek, dayOfWeekSpend, monthReflection } from './analytics'
import { envelopeForecast, monthForecast } from './forecast'
import { runInsights } from './insights/engine'
import { filterTransactions } from './search'
import {
  availableMonths,
  billSummary,
  budgetForMonth,
  categoryBreakdown,
  categoryMap,
  categoryUsage,
  envelopes,
  financials,
  monthContext,
  monthTransactions,
  safeToSpend,
  spendableCategories,
  totalOut,
} from './selectors'

const pad = (n) => String(n).padStart(2, '0')

/** Normalise a preset payload (used by add + update). */
export const cleanPreset = (p) => ({
  emoji: (p.emoji || '⚡').trim() || '⚡',
  label: (p.label || '').trim() || 'Quick add',
  categoryId: p.categoryId,
  amount: Math.max(1, Math.round(Number(p.amount) || 0)),
})

/** Normalise a bill payload (used by add + update). */
export const cleanBill = (b) => ({
  emoji: (b.emoji || '🧾').trim() || '🧾',
  name: (b.name || '').trim() || 'Bill',
  amount: Math.max(1, Math.round(Number(b.amount) || 0)),
  dueDay: Math.min(28, Math.max(1, Math.round(Number(b.dueDay)) || 1)),
  freq: 'monthly',
  autopay: !!b.autopay,
})

/** Normalise a savings-goal payload (used by add + update). `target: 0` is a
 *  valid, open-ended goal — just money set aside with nothing specific to hit. */
export const cleanGoal = (g) => ({
  emoji: (g.emoji || '🎯').trim() || '🎯',
  name: (g.name || '').trim() || 'Savings',
  saved: Math.max(0, Math.round(Number(g.saved) || 0)),
  target: Math.max(0, Math.round(Number(g.target) || 0)),
  monthly: Math.max(0, Math.round(Number(g.monthly) || 0)),
})

/** Build a spend transaction, dated into the selected month. `split`, when
 *  given, is just remembered for display — `amount` is always your own share
 *  and is what every selector (envelopes, forecast, search…) already reads. */
export function buildTx(s, { date, categoryId, name, amount, split }) {
  const m = monthContext(s)
  const iso =
    date ??
    (m.isCurrent
      ? s.clock.todayISO
      : `${m.year}-${pad(m.monthNum)}-${pad(Math.min(m.dayOfMonth || 1, m.daysInMonth))}`)
  return {
    id: `t${Date.now()}`,
    date: iso,
    categoryId,
    name: name || s.categories.find((c) => c.id === categoryId)?.label || 'Expense',
    amount: -Math.abs(amount),
    fresh: true,
    ...(split && split.total > 0 && split.parts >= 2 ? { split } : {}),
  }
}

/** Compose the pure selectors into the object screens read via useBudget(). */
export function derive(state) {
  const month = monthContext(state)
  const { income, spentSoFar } = financials(state)
  const bills = billSummary(state)
  const safe = safeToSpend(state)
  const budget = budgetForMonth(state)

  return {
    month,
    availableMonths: availableMonths(state),
    goals: state.goals ?? [],
    categories: state.categories,
    categoryMap: categoryMap(state),
    spendableCategories: spendableCategories(state),

    thisMonthEntries: monthTransactions(state),
    income,
    spentSoFar,
    daysLeft: month.daysLeft,
    ...safe,

    bills: bills.bills,
    upcomingBills: bills.upcoming,
    upcomingBillsTotal: bills.upcomingTotal,
    billsTotal: bills.billsTotal,
    next7Total: bills.next7Total,

    categoryBreakdown: (scope) => categoryBreakdown(state, scope),
    totalOut: (scope) => totalOut(state, scope),
    searchTransactions: (filters) => filterTransactions(state, filters),

    envelopesResolved: envelopes(state),
    allocatedTotal: Object.values(budget).reduce((s, n) => s + n, 0),

    categoryUsage: (id) => categoryUsage(state, id),

    trends: { months: trendsByMonth(state), weeks: trendsByWeek(state) },
    dayOfWeekSpend: dayOfWeekSpend(state),
    insights: runInsights(state),
    insightsForMonth: (monthKey) => runInsights(state, { monthKey, limit: 3 }),
    reflection: monthReflection(state),
    forecast: monthForecast(state),
    envelopeForecast: envelopeForecast(state),
  }
}

/**
 * Autopay bills mark themselves paid once their due day arrives in the real
 * current month — no tap required. Pure; returns `s` unchanged if nothing is
 * newly due. Applied at load (so time passing while the app was closed is
 * caught up) and again whenever a bill is added or edited.
 */
export function applyAutopay(s) {
  const curKey = s.clock.todayISO.slice(0, 7)
  const dayOfMonth = Number(s.clock.todayISO.slice(8, 10))
  const paid = new Set(s.billPayments[curKey] ?? [])
  let changed = false
  for (const bill of s.bills) {
    if (bill.autopay && bill.dueDay <= dayOfMonth && !paid.has(bill.id)) {
      paid.add(bill.id)
      changed = true
    }
  }
  return changed ? { ...s, billPayments: { ...s.billPayments, [curKey]: [...paid] } } : s
}

/**
 * Blobs saved before multiple goals existed had a single `goal` object plus a
 * flat `defaultSetAside`. Fold that into the new `goals` array once; nothing
 * is lost, and it's the only place this old shape gets read.
 */
export function legacyGoals(base) {
  if (!base.goal || !(base.goal.target > 0 || base.defaultSetAside > 0)) return []
  return [
    {
      id: 'goal1',
      name: base.goal.name || 'Savings',
      emoji: base.goal.emoji || '🎯',
      saved: base.goal.saved || 0,
      target: base.goal.target || 0,
      monthly: base.defaultSetAside || 0,
    },
  ]
}
