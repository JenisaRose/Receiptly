import { useCallback, useEffect, useMemo, useState } from 'react'
import { makeSeed } from '../data/seed'
import {
  dayOfWeekSpend,
  monthReflection,
  spendingPatterns,
  trendsByMonth,
  trendsByWeek,
} from './analytics'
import { persistence } from './persistence'
import { BudgetContext } from './budgetContext'
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

/** Compose the pure selectors into the object screens read via useBudget(). */
function derive(state) {
  const month = monthContext(state)
  const { income, spentSoFar } = financials(state)
  const bills = billSummary(state)
  const safe = safeToSpend(state)
  const budget = budgetForMonth(state)

  return {
    month,
    availableMonths: availableMonths(state),
    goal: state.goal,
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

    envelopesResolved: envelopes(state),
    allocatedTotal: Object.values(budget).reduce((s, n) => s + n, 0),

    categoryUsage: (id) => categoryUsage(state, id),

    trends: { months: trendsByMonth(state), weeks: trendsByWeek(state) },
    dayOfWeekSpend: dayOfWeekSpend(state),
    patterns: spendingPatterns(state),
    reflection: monthReflection(state),
  }
}

export function BudgetProvider({ children }) {
  const [state, setState] = useState(() => persistence.loadSync() ?? makeSeed())

  useEffect(() => {
    // drop the transient `fresh` flag so reloads don't re-animate old rows
    const clean = {
      ...state,
      transactions: state.transactions.map((t) => {
        const copy = { ...t }
        delete copy.fresh
        return copy
      }),
    }
    persistence.save(clean)
  }, [state])

  const addTransaction = useCallback(({ date, categoryId, name, amount }) => {
    setState((s) => {
      const m = monthContext(s)
      const iso =
        date ??
        (m.isCurrent
          ? s.clock.todayISO
          : `${m.year}-${pad(m.monthNum)}-${pad(Math.min(m.dayOfMonth || 1, m.daysInMonth))}`)
      const tx = {
        id: `t${Date.now()}`,
        date: iso,
        categoryId,
        name: name || s.categories.find((c) => c.id === categoryId)?.label || 'Expense',
        amount: -Math.abs(amount),
        fresh: true,
      }
      return { ...s, transactions: [tx, ...s.transactions] }
    })
  }, [])

  const deleteTransaction = useCallback((id) => {
    setState((s) => ({ ...s, transactions: s.transactions.filter((t) => t.id !== id) }))
  }, [])

  const adjustEnvelope = useCallback((id, delta) => {
    setState((s) => {
      const key = s.ui.selectedMonth
      const current = { ...s.budgets.default, ...(s.budgets.byMonth[key] ?? {}) }
      const next = Math.max(0, (current[id] ?? 0) + delta)
      return {
        ...s,
        budgets: {
          ...s.budgets,
          byMonth: { ...s.budgets.byMonth, [key]: { ...(s.budgets.byMonth[key] ?? {}), [id]: next } },
        },
      }
    })
  }, [])

  const setSelectedMonth = useCallback((key) => {
    setState((s) => {
      if (!availableMonths(s).includes(key)) return s
      return { ...s, ui: { ...s.ui, selectedMonth: key } }
    })
  }, [])

  const stepMonth = useCallback((delta) => {
    setState((s) => {
      const months = availableMonths(s)
      const next = months[months.indexOf(s.ui.selectedMonth) + delta]
      return next ? { ...s, ui: { ...s.ui, selectedMonth: next } } : s
    })
  }, [])

  const goToCurrentMonth = useCallback(() => {
    setState((s) => ({
      ...s,
      ui: { ...s.ui, selectedMonth: s.clock.todayISO.slice(0, 7) },
    }))
  }, [])

  const resetDemo = useCallback(() => setState(makeSeed()), [])

  const value = useMemo(
    () => ({
      ...state,
      ...derive(state),
      addTransaction,
      deleteTransaction,
      adjustEnvelope,
      setSelectedMonth,
      stepMonth,
      goToCurrentMonth,
      resetDemo,
    }),
    [
      state,
      addTransaction,
      deleteTransaction,
      adjustEnvelope,
      setSelectedMonth,
      stepMonth,
      goToCurrentMonth,
      resetDemo,
    ],
  )

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}
