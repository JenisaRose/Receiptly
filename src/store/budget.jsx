import { useCallback, useEffect, useMemo, useState } from 'react'
import { BILLS, CATEGORIES, ENTRIES, ENVELOPES, GOAL, MONTH } from '../data/seed'
import { BudgetContext } from './budgetContext'

const STORAGE_KEY = 'receiptly.v1'

const pad = (n) => String(n).padStart(2, '0')

function freshState() {
  return { month: MONTH, goal: GOAL, entries: ENTRIES, envelopes: ENVELOPES, bills: BILLS }
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return { ...freshState(), ...JSON.parse(raw) }
  } catch {
    /* corrupt or unavailable storage — fall back to seed */
  }
  return freshState()
}

/** Everything computed from raw state lives here so screens stay dumb. */
function derive({ month, entries, envelopes, bills }) {
  const monthPrefix = `${month.year}-${pad(month.monthNum)}`
  const todayIso = `${monthPrefix}-${pad(month.dayOfMonth)}`
  const weekStartDay = month.dayOfMonth - 6

  const thisMonth = entries.filter((e) => e.date.startsWith(monthPrefix))
  const spends = thisMonth.filter((e) => e.amount < 0)
  const credits = thisMonth.filter((e) => e.amount > 0)

  const income = credits.reduce((sum, e) => sum + e.amount, 0)
  const spentSoFar = spends.reduce((sum, e) => sum + Math.abs(e.amount), 0)
  const daysLeft = Math.max(1, month.daysInMonth - month.dayOfMonth)

  const upcomingBills = bills
    .filter((b) => !b.paid && b.dueDay >= month.dayOfMonth)
    .sort((a, b) => a.dueDay - b.dueDay)
  const upcomingBillsTotal = upcomingBills.reduce((s, b) => s + b.amount, 0)
  const billsTotal = bills.reduce((s, b) => s + b.amount, 0)
  const next7Total = bills
    .filter((b) => !b.paid && b.dueDay >= month.dayOfMonth && b.dueDay <= month.dayOfMonth + 7)
    .reduce((s, b) => s + b.amount, 0)

  const spendable = income - upcomingBillsTotal - month.goalSetAside
  const leftToSpend = spendable - spentSoFar
  const safeToday = Math.max(0, Math.round(leftToSpend / daysLeft))

  // spend grouped by category (month + week views)
  const groupBy = (list) => {
    const map = {}
    for (const e of list) {
      const g = (map[e.category] ??= { spent: 0, txs: [] })
      g.spent += Math.abs(e.amount)
      g.txs.push(e)
    }
    return map
  }
  const byCategoryMonth = groupBy(spends)
  const byCategoryWeek = groupBy(
    spends.filter((e) => Number(e.date.slice(-2)) >= weekStartDay),
  )

  const categoryBreakdown = (scope) => {
    const src = scope === 'week' ? byCategoryWeek : byCategoryMonth
    return Object.entries(src)
      .map(([id, g]) => ({
        id,
        ...CATEGORIES[id],
        spent: g.spent,
        count: g.txs.length,
        txs: [...g.txs].sort((a, b) => b.date.localeCompare(a.date)),
      }))
      .sort((a, b) => b.spent - a.spent)
  }
  const totalOut = (scope) =>
    Object.values(scope === 'week' ? byCategoryWeek : byCategoryMonth).reduce(
      (sum, g) => sum + g.spent,
      0,
    )

  const envelopesResolved = envelopes
    .map((env) => {
      const meta = CATEGORIES[env.id] ?? {}
      const spent = byCategoryMonth[env.id]?.spent ?? 0
      const ratio = env.allocated > 0 ? spent / env.allocated : 0
      const status = ratio > 1 ? 'over' : ratio >= 0.85 ? 'close' : 'ok'
      return {
        ...env,
        label: env.label ?? meta.label ?? env.id,
        emoji: env.emoji ?? meta.emoji ?? '📦',
        color: env.color ?? meta.color ?? 'lilac',
        spent,
        remaining: env.allocated - spent,
        ratio,
        status,
      }
    })
    .sort((a, b) => b.ratio - a.ratio)
  const allocatedTotal = envelopes.reduce((s, e) => s + e.allocated, 0)

  return {
    todayIso,
    thisMonthEntries: [...thisMonth].sort((a, b) => b.date.localeCompare(a.date)),
    income,
    spentSoFar,
    daysLeft,
    upcomingBills,
    upcomingBillsTotal,
    billsTotal,
    next7Total,
    spendable,
    leftToSpend,
    safeToday,
    categoryBreakdown,
    totalOut,
    envelopesResolved,
    allocatedTotal,
  }
}

export function BudgetProvider({ children }) {
  const [state, setState] = useState(loadState)

  useEffect(() => {
    try {
      // drop the transient `fresh` flag so reloads don't re-animate old rows
      const clean = {
        ...state,
        entries: state.entries.map((e) => {
          const copy = { ...e }
          delete copy.fresh
          return copy
        }),
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
    } catch {
      /* storage full or blocked — the app still works for this session */
    }
  }, [state])

  const addExpense = useCallback(({ amount, category, name }) => {
    setState((s) => {
      const iso = `${s.month.year}-${pad(s.month.monthNum)}-${pad(s.month.dayOfMonth)}`
      const entry = {
        id: `e${Date.now()}`,
        date: iso,
        category,
        name: name || CATEGORIES[category]?.label || 'Expense',
        amount: -Math.abs(amount),
        fresh: true,
      }
      return { ...s, entries: [entry, ...s.entries] }
    })
  }, [])

  const adjustEnvelope = useCallback((id, delta) => {
    setState((s) => ({
      ...s,
      envelopes: s.envelopes.map((e) =>
        e.id === id ? { ...e, allocated: Math.max(0, e.allocated + delta) } : e,
      ),
    }))
  }, [])

  const resetDemo = useCallback(() => setState(freshState()), [])

  const value = useMemo(
    () => ({ ...state, ...derive(state), addExpense, adjustEnvelope, resetDemo }),
    [state, addExpense, adjustEnvelope, resetDemo],
  )

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>
}
