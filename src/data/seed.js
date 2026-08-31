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
 * - `clock.todayISO` is the app's notion of "now".
 *
 * The demo is anchored to the real date: twelve full months of generated
 * history plus the current month up to yesterday, so it always feels live.
 * The generation is deterministic per month key.
 */

import { shiftMonth, todayISO } from '../lib/dates'

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
const ALL_BILL_IDS = BILLS.map((b) => b.id)

// --- deterministic generation ----------------------------------------------

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
const seedFor = (ym) => Number(ym.replace('-', '')) * 7 + 13

/** One month of realistic-looking spend totalling roughly `spend`.
 *  `throughDay` limits it to the first N days (for the in-progress month). */
function genMonth(ym, { spend, freelance = 0, throughDay } = {}, seed = seedFor(ym)) {
  const rand = mulberry32(seed)
  const [y, m] = ym.split('-').map(Number)
  const dim = new Date(y, m, 0).getDate()
  const lastDay = throughDay ? Math.min(throughDay, dim) : dim
  const out = []
  const add = (day, categoryId, name, amount) => {
    if (day <= lastDay) out.push({ date: `${ym}-${pad(day)}`, categoryId, name, amount: Math.round(amount) })
  }

  add(1, 'income', 'Stipend', 18000)
  if (freelance) add(12, 'income', 'Freelance gig', freelance)

  add(4, 'home', 'Wifi split', -300)
  add(6 + Math.floor(rand() * 16), 'home', 'Electricity split', -(1000 + Math.round(rand() * 500)))

  const placed = out.filter((t) => t.amount < 0).reduce((s, t) => s - t.amount, 0)
  const count = Math.round((16 + Math.floor(rand() * 5)) * (lastDay / dim))
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
    const day = 1 + Math.floor(rand() * lastDay)
    const dow = new Date(y, m - 1, day).getDay()
    const weekend = dow === 0 || dow === 6
    draws.push({
      cat,
      day,
      name: CATALOG[cat][Math.floor(rand() * CATALOG[cat].length)],
      weight: rand() * (weekend ? 2 : 1) + 0.25,
    })
  }
  const wsum = draws.reduce((s, d) => s + d.weight, 0) || 1
  const budget = spend * (lastDay / dim) - placed
  for (const d of draws) {
    add(d.day, d.cat, d.name, -Math.max(40, Math.round((budget * d.weight) / wsum / 10) * 10))
  }
  return out.sort((a, b) => a.date.localeCompare(b.date))
}

// Twelve monthly targets, oldest → newest, drifting gently upward so trends
// have something to say. The last entry is scaled for the in-progress month.
const TARGETS = [6600, 7000, 6800, 8200, 7100, 7400, 9100, 8600, 8300, 7900, 8500, 8400]
const FREELANCE = [0, 2500, 0, 4000, 0, 1500, 0, 2000, 0, 3500, 1500, 6000]

/** Build a fresh copy of the seed state (used on first run and on reset). */
export function makeSeed(iso = todayISO()) {
  const today = iso
  const day = Number(today.slice(8, 10))
  const curMonth = today.slice(0, 7)

  const months = []
  let key = shiftMonth(curMonth, -12)
  for (let i = 0; i < 12; i++) {
    months.push(key)
    key = shiftMonth(key, 1)
  }

  const rows = []
  months.forEach((mk, i) => {
    rows.push(...genMonth(mk, { spend: TARGETS[i], freelance: FREELANCE[i] }))
  })
  // current month, day 1 → yesterday
  rows.push(
    ...genMonth(curMonth, {
      spend: 8400,
      freelance: day > 12 ? 6000 : 0,
      throughDay: Math.max(1, day - 1),
    }),
  )

  const transactions = rows.map((t, i) => ({ id: `t${pad(i + 1)}`, ...t }))

  const billPayments = {}
  for (const mk of months) billPayments[mk] = [...ALL_BILL_IDS]
  billPayments[curMonth] = BILLS.filter((b) => b.dueDay < day).map((b) => b.id)

  return {
    schemaVersion: SCHEMA_VERSION,
    clock: { todayISO: today },
    ui: { selectedMonth: curMonth },

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
