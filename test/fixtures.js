/**
 * Deterministic store fixtures for the unit tests.
 *
 * `makeState()` returns a complete, valid store state that every selector can
 * read. Override any slice; `transactions`, `bills`, `goals` and `budget`
 * (the default per-category allocation) are the ones tests usually set.
 *
 * Nothing here reads the real clock — pass `today` / `selectedMonth` explicitly.
 */

import { DEFAULT_CATEGORIES, DEFAULT_PRESETS, SCHEMA_VERSION } from '../src/data/seed'

let seq = 0
const nextId = () => `t${String(++seq).padStart(3, '0')}`

/** A spend (`amount` given as a positive number, stored negative) or, with
 *  `income: true`, a credit. `date` is a full ISO date. */
export function tx(date, categoryId, amount, extra = {}) {
  const { income = false, name, split, id } = extra
  return {
    id: id ?? nextId(),
    date,
    categoryId,
    name: name ?? categoryId,
    amount: income ? Math.abs(amount) : -Math.abs(amount),
    ...(split ? { split } : {}),
  }
}

/** Shorthand: an income credit. */
export const income = (date, amount, name = 'Income') =>
  tx(date, 'income', amount, { income: true, name })

export function goal(over = {}) {
  return {
    id: over.id ?? `goal${++seq}`,
    name: over.name ?? 'Goal',
    emoji: over.emoji ?? '🎯',
    saved: over.saved ?? 0,
    target: over.target ?? 0,
    monthly: over.monthly ?? 0,
  }
}

export function bill(over = {}) {
  return {
    id: over.id ?? `bill${++seq}`,
    name: over.name ?? 'Bill',
    emoji: over.emoji ?? '🧾',
    amount: over.amount ?? 0,
    dueDay: over.dueDay ?? 1,
    freq: 'monthly',
    ...(over.autopay ? { autopay: true } : {}),
  }
}

const ZERO_BUDGET = { food: 0, transport: 0, home: 0, fun: 0, other: 0, buffer: 0 }

export function makeState(over = {}) {
  const today = over.today ?? '2026-09-10'
  const selectedMonth = over.selectedMonth ?? today.slice(0, 7)

  return {
    schemaVersion: SCHEMA_VERSION,
    demo: false,
    onboarded: true,
    clock: { todayISO: today },
    ui: { selectedMonth },

    categories: (over.categories ?? DEFAULT_CATEGORIES).map((c) => ({ ...c })),
    transactions: over.transactions ?? [],
    presets: (over.presets ?? DEFAULT_PRESETS).map((p) => ({ ...p })),

    bills: over.bills ?? [],
    billPayments: over.billPayments ?? {},

    budgets: {
      default: { ...ZERO_BUDGET, ...(over.budget ?? {}) },
      byMonth: over.budgetByMonth ?? {},
      bufferRollover: over.bufferRollover ?? 0,
    },

    goals: over.goals ?? [],
    profile: over.profile ?? { monthlyIncome: 0, incomeKind: 'monthly' },
    monthSettings: over.monthSettings ?? {},
  }
}

/**
 * A realistic "normal month" in progress: ₹20,000 stipend on the 1st, a handful
 * of spends through the 10th, two bills, one goal, a per-category plan.
 * Selected month = current month, today = the 10th of a 30-day month.
 */
export function normalMonth() {
  return makeState({
    today: '2026-09-10',
    budget: { food: 4000, transport: 2500, home: 2200, fun: 1000, other: 800 },
    bills: [
      bill({ id: 'rent', name: 'Rent', amount: 6000, dueDay: 1 }),
      bill({ id: 'wifi', name: 'Wifi', amount: 500, dueDay: 15 }),
    ],
    billPayments: { '2026-09': ['rent'] }, // rent already paid, wifi still upcoming
    goals: [goal({ id: 'trip', name: 'Trip', monthly: 1500, target: 30000, saved: 6000 })],
    transactions: [
      income('2026-09-01', 20000, 'Stipend'),
      tx('2026-09-02', 'food', 450, { name: 'Groceries' }),
      tx('2026-09-03', 'transport', 1070, { name: 'Cab' }),
      tx('2026-09-04', 'food', 300, { name: 'Canteen' }),
      tx('2026-09-07', 'fun', 400, { name: 'Movie' }),
      tx('2026-09-10', 'food', 300, { name: 'Dinner' }),
    ],
  })
}

/** Reset the fixture id counter (keep test ids stable within a file). */
export function resetIds() {
  seq = 0
}
