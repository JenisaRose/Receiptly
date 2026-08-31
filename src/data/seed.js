/**
 * First-run demo data — a normalized snapshot written to localStorage on first
 * load, then owned by the user.
 *
 * Shape notes:
 * - `transactions` is the single source of truth. A transaction belongs to a
 *   month purely by its `date`; nothing is duplicated per month.
 * - Per-month config (`billPayments`, `budgets.byMonth`, `monthSettings`) is
 *   keyed by "YYYY-MM" and falls back to a default, so adding a month needs no
 *   migration.
 * - `clock.todayISO` is the app's notion of "now" (fixed for the demo).
 *
 * Demo context: it is the 18th of August 2026.
 */

export const SCHEMA_VERSION = 2

export const DEFAULT_CATEGORIES = [
  { id: 'food', label: 'Food', emoji: '🍜', color: 'orange', isDefault: true },
  { id: 'transport', label: 'Transport', emoji: '🚕', color: 'mint', isDefault: true },
  { id: 'home', label: 'Home & bills', emoji: '🏠', color: 'sky', isDefault: true },
  { id: 'fun', label: 'Fun', emoji: '✨', color: 'pink', isDefault: true },
  { id: 'other', label: 'Other', emoji: '📦', color: 'lilac', isDefault: true },
  { id: 'buffer', label: 'Buffer', emoji: '🛟', color: 'lilac', isDefault: true, kind: 'buffer' },
  { id: 'income', label: 'Income', emoji: '💰', color: 'yellow', isDefault: true, kind: 'income' },
]

/** amount < 0 = money out, amount > 0 = money in. dates are ISO (YYYY-MM-DD). */
const TRANSACTIONS = [
  { id: 't01', date: '2026-08-01', categoryId: 'income', name: 'Stipend', amount: 18000 },
  { id: 't02', date: '2026-08-01', categoryId: 'transport', name: 'Metro card top-up', amount: -500 },
  { id: 't03', date: '2026-08-02', categoryId: 'food', name: 'Groceries', amount: -520 },
  { id: 't04', date: '2026-08-03', categoryId: 'transport', name: 'Auto fare', amount: -90 },
  { id: 't05', date: '2026-08-04', categoryId: 'food', name: 'Campus canteen', amount: -180 },
  { id: 't06', date: '2026-08-04', categoryId: 'other', name: 'Printouts', amount: -60 },
  { id: 't07', date: '2026-08-05', categoryId: 'home', name: 'Wifi split', amount: -300 },
  { id: 't08', date: '2026-08-05', categoryId: 'home', name: 'Electricity split', amount: -1200 },
  { id: 't09', date: '2026-08-06', categoryId: 'transport', name: 'Cab home', amount: -210 },
  { id: 't10', date: '2026-08-07', categoryId: 'food', name: 'Zomato', amount: -260 },
  { id: 't11', date: '2026-08-08', categoryId: 'transport', name: 'Fuel share', amount: -600 },
  { id: 't12', date: '2026-08-08', categoryId: 'other', name: 'Stationery', amount: -160 },
  { id: 't13', date: '2026-08-09', categoryId: 'food', name: 'Chai + snacks', amount: -140 },
  { id: 't14', date: '2026-08-09', categoryId: 'fun', name: 'Movie ticket', amount: -350 },
  { id: 't15', date: '2026-08-10', categoryId: 'transport', name: 'Auto fare', amount: -80 },
  { id: 't16', date: '2026-08-11', categoryId: 'food', name: 'Dinner out', amount: -840 },
  { id: 't17', date: '2026-08-12', categoryId: 'income', name: 'Freelance gig', amount: 6000 },
  { id: 't18', date: '2026-08-12', categoryId: 'transport', name: 'Metro card top-up', amount: -500 },
  { id: 't19', date: '2026-08-13', categoryId: 'food', name: 'Groceries', amount: -430 },
  { id: 't20', date: '2026-08-14', categoryId: 'transport', name: 'Cab (rain)', amount: -300 },
  { id: 't21', date: '2026-08-14', categoryId: 'other', name: 'Medicines', amount: -240 },
  { id: 't22', date: '2026-08-15', categoryId: 'food', name: 'Bakery', amount: -180 },
  { id: 't23', date: '2026-08-16', categoryId: 'transport', name: 'Auto fares', amount: -400 },
  { id: 't24', date: '2026-08-16', categoryId: 'home', name: 'Cleaning supplies', amount: -250 },
  { id: 't25', date: '2026-08-17', categoryId: 'food', name: 'Zomato', amount: -450 },
]

const BILLS = [
  { id: 'b1', name: 'Electricity split', emoji: '💡', amount: 1200, dueDay: 5, freq: 'monthly' },
  { id: 'b2', name: 'Wifi split', emoji: '📶', amount: 300, dueDay: 5, freq: 'monthly' },
  { id: 'b3', name: 'Duolingo Super', emoji: '🦉', amount: 160, dueDay: 12, freq: 'monthly' },
  { id: 'b4', name: 'Gym membership', emoji: '🏋️', amount: 461, dueDay: 20, freq: 'monthly' },
  { id: 'b5', name: 'Spotify', emoji: '🎧', amount: 119, dueDay: 22, freq: 'monthly' },
  { id: 'b6', name: 'Phone recharge', emoji: '📱', amount: 260, dueDay: 24, freq: 'monthly' },
  { id: 'b7', name: 'PG room rent', emoji: '🏠', amount: 4000, dueDay: 28, freq: 'monthly' },
]

/** Build a fresh copy of the seed state (used on first run and on reset). */
export function makeSeed() {
  return {
    schemaVersion: SCHEMA_VERSION,
    clock: { todayISO: '2026-08-18' },
    ui: { selectedMonth: '2026-08' },

    categories: DEFAULT_CATEGORIES.map((c) => ({ ...c })),
    transactions: TRANSACTIONS.map((t) => ({ ...t })),

    bills: BILLS.map((b) => ({ ...b })),
    billPayments: { '2026-08': ['b1', 'b2', 'b3'] },

    budgets: {
      default: { food: 5000, transport: 2500, home: 2000, fun: 1500, other: 1500, buffer: 3500 },
      byMonth: {},
      bufferRollover: 500,
    },

    goal: { name: 'Goa trip fund', emoji: '🎯', saved: 9000, target: 15000 },

    monthSettings: {},
    defaultSetAside: 1500,
  }
}
