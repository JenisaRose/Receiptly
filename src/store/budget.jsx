import { useCallback, useEffect, useMemo, useState } from 'react'
import { DEFAULT_PRESETS, makeEmpty, makeSeed } from '../data/seed'
import { buildOnboardedState } from '../features/onboarding/buildState'
import { todayISO } from '../lib/dates'
import { slugId } from '../lib/slug'
import { persistence } from './persistence'
import { BudgetContext } from './budgetContext'
import { availableMonths } from './selectors'
import {
  applyAutopay,
  buildTx,
  cleanBill,
  cleanGoal,
  cleanPreset,
  derive,
  legacyGoals,
} from './budgetCore'

const NEW_CATEGORY_BUDGET = 1000

const without = (obj, key) => {
  const copy = { ...obj }
  delete copy[key]
  return copy
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
    // backfill for blobs saved before multiple goals existed
    goals: base.goals ?? legacyGoals(base),
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

  // --- savings goals ----------------------------------------------------------
  const addGoal = useCallback((goal) => {
    setState((s) => ({
      ...s,
      goals: [...(s.goals ?? []), { id: `goal${Date.now()}`, ...cleanGoal(goal) }],
    }))
  }, [])

  const updateGoal = useCallback(({ id, ...patch }) => {
    setState((s) => ({
      ...s,
      goals: (s.goals ?? []).map((g) => (g.id === id ? { ...g, ...cleanGoal({ ...g, ...patch }) } : g)),
    }))
  }, [])

  const deleteGoal = useCallback((id) => {
    setState((s) => ({ ...s, goals: (s.goals ?? []).filter((g) => g.id !== id) }))
  }, [])

  /** Add (or, with a negative delta, withdraw) money from a goal's saved total. */
  const contributeToGoal = useCallback((id, delta) => {
    setState((s) => ({
      ...s,
      goals: (s.goals ?? []).map((g) =>
        g.id === id ? { ...g, saved: Math.max(0, g.saved + delta) } : g,
      ),
    }))
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
      addGoal,
      updateGoal,
      deleteGoal,
      contributeToGoal,
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
      addGoal,
      updateGoal,
      deleteGoal,
      contributeToGoal,
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
