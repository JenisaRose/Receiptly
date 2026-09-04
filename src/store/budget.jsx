import { useCallback, useEffect, useMemo, useState } from 'react'
import { DEFAULT_PRESETS, makeEmpty, makeSeed } from '../data/seed'
import { buildOnboardedState } from '../features/onboarding/buildState'
import { todayISO } from '../lib/dates'
import { slugId } from '../lib/slug'
import { dayOfWeekSpend, monthReflection, trendsByMonth, trendsByWeek } from './analytics'
import { envelopeForecast, monthForecast } from './forecast'
import { runInsights } from './insights/engine'
import { persistence } from './persistence'
import { filterTransactions } from './search'
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

const NEW_CATEGORY_BUDGET = 1000

const without = (obj, key) => {
  const copy = { ...obj }
  delete copy[key]
  return copy
}

/** Normalise a preset payload (used by add + update). */
const cleanPreset = (p) => ({
  emoji: (p.emoji || '⚡').trim() || '⚡',
  label: (p.label || '').trim() || 'Quick add',
  categoryId: p.categoryId,
  amount: Math.max(1, Math.round(Number(p.amount) || 0)),
})

/** Normalise a bill payload (used by add + update). */
const cleanBill = (b) => ({
  emoji: (b.emoji || '🧾').trim() || '🧾',
  name: (b.name || '').trim() || 'Bill',
  amount: Math.max(1, Math.round(Number(b.amount) || 0)),
  dueDay: Math.min(28, Math.max(1, Math.round(Number(b.dueDay)) || 1)),
  freq: 'monthly',
  autopay: !!b.autopay,
})

/** Build a spend transaction, dated into the selected month. */
function buildTx(s, { date, categoryId, name, amount }) {
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
  }
}

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

/** Real "now", or an `?today=YYYY-MM-DD` override for demos and screenshots. */
function resolveToday() {
  try {
    const q = new URLSearchParams(window.location.search).get('today')
    if (/^\d{4}-\d{2}-\d{2}$/.test(q)) return q
  } catch {
    /* no window / bad URL */
  }
  return todayISO()
}

/**
 * Autopay bills mark themselves paid once their due day arrives in the real
 * current month — no tap required. Pure; returns `s` unchanged if nothing is
 * newly due. Applied at load (so time passing while the app was closed is
 * caught up) and again whenever a bill is added or edited.
 */
function applyAutopay(s) {
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

/** "today" is always real-now, never whatever was frozen into storage. */
function initState() {
  const today = resolveToday()
  const loaded = persistence.loadSync()
  // nothing stored yet → a blank slate that routes straight into setup
  const base = loaded ?? makeEmpty(today)
  const currentMonth = today.slice(0, 7)
  const months = availableMonths({ ...base, clock: { todayISO: today } })
  return applyAutopay({
    ...base,
    // backfill for blobs saved before quick-add presets existed
    presets: base.presets ?? DEFAULT_PRESETS.map((p) => ({ ...p })),
    clock: { ...base.clock, todayISO: today },
    ui: {
      ...base.ui,
      selectedMonth: months.includes(base.ui.selectedMonth)
        ? base.ui.selectedMonth
        : currentMonth,
    },
  })
}

export function BudgetProvider({ children }) {
  const [state, setState] = useState(initState)

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

  const addTransaction = useCallback((entry) => {
    setState((s) => ({ ...s, transactions: [buildTx(s, entry), ...s.transactions] }))
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

  const addCategory = useCallback(({ label, emoji, color }) => {
    setState((s) => {
      const id = slugId(label, s.categories)
      const cat = {
        id,
        label: label.trim() || 'New category',
        emoji: emoji || '🏷️',
        color: color || 'lilac',
      }
      const normal = s.categories.filter((c) => !c.kind)
      const system = s.categories.filter((c) => c.kind)
      return {
        ...s,
        categories: [...normal, cat, ...system],
        budgets: {
          ...s.budgets,
          default: { ...s.budgets.default, [id]: NEW_CATEGORY_BUDGET },
        },
      }
    })
  }, [])

  const renameCategory = useCallback(({ id, label, emoji, color }) => {
    setState((s) => ({
      ...s,
      categories: s.categories.map((c) =>
        c.id === id
          ? {
              ...c,
              label: label?.trim() || c.label,
              emoji: emoji || c.emoji,
              color: color || c.color,
            }
          : c,
      ),
    }))
  }, [])

  const deleteCategory = useCallback(({ id, reassignToId }) => {
    setState((s) => {
      const cat = s.categories.find((c) => c.id === id)
      if (!cat || cat.isDefault || cat.kind) return s
      const inUse = s.transactions.some((t) => t.categoryId === id)
      if (inUse && !reassignToId) return s
      return {
        ...s,
        transactions: inUse
          ? s.transactions.map((t) =>
              t.categoryId === id ? { ...t, categoryId: reassignToId } : t,
            )
          : s.transactions,
        categories: s.categories.filter((c) => c.id !== id),
        budgets: {
          ...s.budgets,
          default: without(s.budgets.default, id),
          byMonth: Object.fromEntries(
            Object.entries(s.budgets.byMonth).map(([k, v]) => [k, without(v, id)]),
          ),
        },
      }
    })
  }, [])

  // --- quick-add presets ---------------------------------------------------
  const addPreset = useCallback((p) => {
    setState((s) => ({
      ...s,
      presets: [...(s.presets ?? []), { id: `p${Date.now()}`, ...cleanPreset(p) }],
    }))
  }, [])

  const updatePreset = useCallback(({ id, ...patch }) => {
    setState((s) => ({
      ...s,
      presets: (s.presets ?? []).map((p) =>
        p.id === id ? { ...p, ...cleanPreset({ ...p, ...patch }) } : p,
      ),
    }))
  }, [])

  const deletePreset = useCallback((id) => {
    setState((s) => ({ ...s, presets: (s.presets ?? []).filter((p) => p.id !== id) }))
  }, [])

  const logPreset = useCallback((id) => {
    setState((s) => {
      const p = (s.presets ?? []).find((x) => x.id === id)
      if (!p) return s
      const tx = buildTx(s, { categoryId: p.categoryId, name: p.label, amount: p.amount })
      return { ...s, transactions: [tx, ...s.transactions] }
    })
  }, [])

  // --- recurring bills -------------------------------------------------------
  const addBill = useCallback((bill) => {
    setState((s) =>
      applyAutopay({
        ...s,
        bills: [...s.bills, { id: `bill${Date.now()}`, ...cleanBill(bill) }],
      }),
    )
  }, [])

  const updateBill = useCallback(({ id, ...patch }) => {
    setState((s) =>
      applyAutopay({
        ...s,
        bills: s.bills.map((b) => (b.id === id ? { ...b, ...cleanBill({ ...b, ...patch }) } : b)),
      }),
    )
  }, [])

  const deleteBill = useCallback((id) => {
    setState((s) => ({
      ...s,
      bills: s.bills.filter((b) => b.id !== id),
      billPayments: Object.fromEntries(
        Object.entries(s.billPayments).map(([k, ids]) => [k, ids.filter((x) => x !== id)]),
      ),
    }))
  }, [])

  /** Toggle a bill's paid status for the month currently being viewed. */
  const toggleBillPaid = useCallback((id) => {
    setState((s) => {
      const key = s.ui.selectedMonth
      const paid = new Set(s.billPayments[key] ?? [])
      if (paid.has(id)) paid.delete(id)
      else paid.add(id)
      return { ...s, billPayments: { ...s.billPayments, [key]: [...paid] } }
    })
  }, [])

  const resetDemo = useCallback(() => setState(makeSeed(resolveToday())), [])

  const completeOnboarding = useCallback(
    (answers) => setState(buildOnboardedState(answers, resolveToday())),
    [],
  )

  const restartOnboarding = useCallback(
    () => setState((s) => ({ ...s, onboarded: false })),
    [],
  )

  const value = useMemo(
    () => ({
      ...state,
      ...derive(state),
      addTransaction,
      deleteTransaction,
      adjustEnvelope,
      addCategory,
      renameCategory,
      deleteCategory,
      addPreset,
      updatePreset,
      deletePreset,
      logPreset,
      addBill,
      updateBill,
      deleteBill,
      toggleBillPaid,
      setSelectedMonth,
      stepMonth,
      goToCurrentMonth,
      resetDemo,
      completeOnboarding,
      restartOnboarding,
    }),
    [
      state,
      addTransaction,
      deleteTransaction,
      adjustEnvelope,
      addCategory,
      renameCategory,
      deleteCategory,
      addPreset,
      updatePreset,
      deletePreset,
      logPreset,
      addBill,
      updateBill,
      deleteBill,
      toggleBillPaid,
      setSelectedMonth,
      stepMonth,
      goToCurrentMonth,
      resetDemo,
      completeOnboarding,
      restartOnboarding,
    ],
  )

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}
