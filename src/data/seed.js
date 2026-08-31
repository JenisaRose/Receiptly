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
 * Demo context: it is the 18th of August 2026. Sept 2025 – July 2026 are
 * generated (deterministic RNG) so Trends, Reflect and the insights engine
 * have a full year of real history to compute from; August is hand-written.
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

const BILLS = [
  { id: 'b1', name: 'Electricity split', emoji: '💡', amount: 1200, dueDay: 5, freq: 'monthly' },
  { id: 'b2', name: 'Wifi split', emoji: '📶', amount: 300, dueDay: 5, freq: 'monthly' },
  { id: 'b3', name: 'Duolingo Super', emoji: '🦉', amount: 160, dueDay: 12, freq: 'monthly' },
  { id: 'b4', name: 'Gym membership', emoji: '🏋️', amount: 461, dueDay: 20, freq: 'monthly' },
  { id: 'b5', name: 'Spotify', emoji: '🎧', amount: 119, dueDay: 22, freq: 'monthly' },
  { id: 'b6', name: 'Phone recharge', emoji: '📱', amount: 260, dueDay: 24, freq: 'monthly' },
  { id: 'b7', name: 'PG room rent', emoji: '🏠', amount: 4000, dueDay: 28, freq: 'monthly' },
]

/** amount < 0 = money out, amount > 0 = money in. dates are ISO (YYYY-MM-DD). */
const AUGUST = [
  { date: '2026-08-01', categoryId: 'income', name: 'Stipend', amount: 18000 },
  { date: '2026-08-01', categoryId: 'transport', name: 'Metro card top-up', amount: -500 },
  { date: '2026-08-02', categoryId: 'food', name: 'Groceries', amount: -520 },
  { date: '2026-08-03', categoryId: 'transport', name: 'Auto fare', amount: -90 },
  { date: '2026-08-04', categoryId: 'food', name: 'Campus canteen', amount: -180 },
  { date: '2026-08-04', categoryId: 'other', name: 'Printouts', amount: -60 },
  { date: '2026-08-05', categoryId: 'home', name: 'Wifi split', amount: -300 },
  { date: '2026-08-05', categoryId: 'home', name: 'Electricity split', amount: -1200 },
  { date: '2026-08-06', categoryId: 'transport', name: 'Cab home', amount: -210 },
  { date: '2026-08-07', categoryId: 'food', name: 'Zomato', amount: -260 },
  { date: '2026-08-08', categoryId: 'transport', name: 'Fuel share', amount: -600 },
  { date: '2026-08-08', categoryId: 'other', name: 'Stationery', amount: -160 },
  { date: '2026-08-09', categoryId: 'food', name: 'Chai + snacks', amount: -140 },
  { date: '2026-08-09', categoryId: 'fun', name: 'Movie ticket', amount: -350 },
  { date: '2026-08-10', categoryId: 'transport', name: 'Auto fare', amount: -80 },
  { date: '2026-08-11', categoryId: 'food', name: 'Dinner out', amount: -840 },
  { date: '2026-08-12', categoryId: 'income', name: 'Freelance gig', amount: 6000 },
  { date: '2026-08-12', categoryId: 'transport', name: 'Metro card top-up', amount: -500 },
  { date: '2026-08-13', categoryId: 'food', name: 'Groceries', amount: -430 },
  { date: '2026-08-14', categoryId: 'transport', name: 'Cab (rain)', amount: -300 },
  { date: '2026-08-14', categoryId: 'other', name: 'Medicines', amount: -240 },
  { date: '2026-08-15', categoryId: 'food', name: 'Bakery', amount: -180 },
  { date: '2026-08-16', categoryId: 'transport', name: 'Auto fares', amount: -400 },
  { date: '2026-08-16', categoryId: 'home', name: 'Cleaning supplies', amount: -250 },
  { date: '2026-08-17', categoryId: 'food', name: 'Zomato', amount: -450 },
]

// --- generated history -------------------------------------------------------

function mulberry32(seed) {
  return function () {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

const CATALOG = {
  food: ['Groceries', 'Campus canteen', 'Zomato', 'Swiggy', 'Chai + snacks', 'Bakery', 'Dinner out'],
  transport: ['Auto fare', 'Metro card top-up', 'Cab home', 'Fuel share', 'Bus pass'],
  fun: ['Movie night', 'Arcade', 'New book', 'Gig ticket', 'Bowling'],
  other: ['Printouts', 'Stationery', 'Medicines', 'Small gift', 'Phone case'],
}
const MIX = [
  ['food', 0.44],
  ['transport', 0.3],
  ['fun', 0.12],
  ['other', 0.14],
]
const pad = (n) => String(n).padStart(2, '0')

/** One month of realistic-looking spend totalling roughly `spend`. */
function genMonth(ym, { spend, freelance = 0 }, seed) {
  const rand = mulberry32(seed)
  const [y, m] = ym.split('-').map(Number)
  const daysInMonth = new Date(y, m, 0).getDate()
  const out = []
  const add = (day, categoryId, name, amount) =>
    out.push({ date: `${ym}-${pad(day)}`, categoryId, name, amount: Math.round(amount) })

  add(1, 'income', 'Stipend', 18000)
  if (freelance) add(12, 'income', 'Freelance gig', freelance)

  add(4, 'home', 'Wifi split', -300)
  add(6 + Math.floor(rand() * 16), 'home', 'Electricity split', -(1000 + Math.round(rand() * 500)))

  let placed = out.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0)
  const count = 16 + Math.floor(rand() * 5)
  const draws = []
  for (let i = 0; i < count; i++) {
    const r = rand()
    let acc = 0
    let cat = 'food'
    for (const [c, w] of MIX) {
      acc += w
      if (r <= acc) {
        cat = c
        break
      }
    }
    const day = 1 + Math.floor(rand() * daysInMonth)
    const dow = new Date(y, m - 1, day).getDay()
    const weekend = dow === 0 || dow === 6
    draws.push({
      cat,
      day,
      name: CATALOG[cat][Math.floor(rand() * CATALOG[cat].length)],
      weight: rand() * (weekend ? 2 : 1) + 0.25,
    })
  }
  const wsum = draws.reduce((s, d) => s + d.weight, 0)
  const budget = spend - placed
  for (const d of draws) {
    add(d.day, d.cat, d.name, -Math.max(40, Math.round((budget * d.weight) / wsum / 10) * 10))
  }
  return out.sort((a, b) => a.date.localeCompare(b.date))
}

// A year of history so any 6-month analysis window is full of real data.
// Totals drift gently upward (~₹6.6k → ₹8.5k) to give trends something to say.
const HISTORY_MONTHS = [
  { key: '2025-09', spend: 6600, freelance: 0 },
  { key: '2025-10', spend: 7000, freelance: 2500 },
  { key: '2025-11', spend: 6800, freelance: 0 },
  { key: '2025-12', spend: 8200, freelance: 4000 },
  { key: '2026-01', spend: 7100, freelance: 0 },
  { key: '2026-02', spend: 7400, freelance: 1500 },
  { key: '2026-03', spend: 9100, freelance: 0 },
  { key: '2026-04', spend: 8600, freelance: 2000 },
  { key: '2026-05', spend: 8300, freelance: 0 },
  { key: '2026-06', spend: 7900, freelance: 3500 },
  { key: '2026-07', spend: 8500, freelance: 1500 },
]

const HISTORY = HISTORY_MONTHS.flatMap((m, i) =>
  genMonth(m.key, m, Number(m.key.replace('-', '')) * 7 + i),
)

const ALL_BILL_IDS = BILLS.map((b) => b.id)

/** Build a fresh copy of the seed state (used on first run and on reset). */
export function makeSeed() {
  const transactions = [...HISTORY, ...AUGUST].map((t, i) => ({ id: `t${pad(i + 1)}`, ...t }))

  const billPayments = { '2026-08': ['b1', 'b2', 'b3'] }
  for (const m of HISTORY_MONTHS) billPayments[m.key] = [...ALL_BILL_IDS]

  return {
    schemaVersion: SCHEMA_VERSION,
    clock: { todayISO: '2026-08-18' },
    ui: { selectedMonth: '2026-08' },

    categories: DEFAULT_CATEGORIES.map((c) => ({ ...c })),
    transactions,

    bills: BILLS.map((b) => ({ ...b })),
    billPayments,

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
