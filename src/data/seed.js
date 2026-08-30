/**
 * First-run demo data. Written to localStorage on first load, then owned by the
 * user. A real month of activity so every screen has something to show.
 *
 * Month context: it is the 18th of a 30-day month (August 2026 in the demo).
 */

export const MONTH = {
  label: 'August',
  year: 2026,
  monthNum: 8, // 1-based
  dayOfMonth: 18,
  daysInMonth: 30,
  goalSetAside: 1500, // committed to savings this month
}

export const GOAL = {
  name: 'Goa trip fund',
  emoji: '🎯',
  saved: 9000,
  target: 15000,
}

/** category id -> display metadata */
export const CATEGORIES = {
  food: { label: 'Food', emoji: '🍜', color: 'orange' },
  transport: { label: 'Transport', emoji: '🚕', color: 'mint' },
  home: { label: 'Home & bills', emoji: '🏠', color: 'sky' },
  fun: { label: 'Fun', emoji: '✨', color: 'pink' },
  other: { label: 'Other', emoji: '📦', color: 'lilac' },
  income: { label: 'Income', emoji: '💰', color: 'yellow' },
}

/** amount < 0 = money out, amount > 0 = money in. dates are ISO (YYYY-MM-DD). */
export const ENTRIES = [
  { id: 'e01', date: '2026-08-01', category: 'income', name: 'Stipend', amount: 18000 },
  { id: 'e02', date: '2026-08-01', category: 'transport', name: 'Metro card top-up', amount: -500 },
  { id: 'e03', date: '2026-08-02', category: 'food', name: 'Groceries', amount: -520 },
  { id: 'e04', date: '2026-08-03', category: 'transport', name: 'Auto fare', amount: -90 },
  { id: 'e05', date: '2026-08-04', category: 'food', name: 'Campus canteen', amount: -180 },
  { id: 'e06', date: '2026-08-04', category: 'other', name: 'Printouts', amount: -60 },
  { id: 'e07', date: '2026-08-05', category: 'home', name: 'Wifi split', amount: -300 },
  { id: 'e08', date: '2026-08-05', category: 'home', name: 'Electricity split', amount: -1200 },
  { id: 'e09', date: '2026-08-06', category: 'transport', name: 'Cab home', amount: -210 },
  { id: 'e10', date: '2026-08-07', category: 'food', name: 'Zomato', amount: -260 },
  { id: 'e11', date: '2026-08-08', category: 'transport', name: 'Fuel share', amount: -600 },
  { id: 'e12', date: '2026-08-08', category: 'other', name: 'Stationery', amount: -160 },
  { id: 'e13', date: '2026-08-09', category: 'food', name: 'Chai + snacks', amount: -140 },
  { id: 'e14', date: '2026-08-09', category: 'fun', name: 'Movie ticket', amount: -350 },
  { id: 'e15', date: '2026-08-10', category: 'transport', name: 'Auto fare', amount: -80 },
  { id: 'e16', date: '2026-08-11', category: 'food', name: 'Dinner out', amount: -840 },
  { id: 'e17', date: '2026-08-12', category: 'income', name: 'Freelance gig', amount: 6000 },
  { id: 'e18', date: '2026-08-12', category: 'transport', name: 'Metro card top-up', amount: -500 },
  { id: 'e19', date: '2026-08-13', category: 'food', name: 'Groceries', amount: -430 },
  { id: 'e20', date: '2026-08-14', category: 'transport', name: 'Cab (rain)', amount: -300 },
  { id: 'e21', date: '2026-08-14', category: 'other', name: 'Medicines', amount: -240 },
  { id: 'e22', date: '2026-08-15', category: 'food', name: 'Bakery', amount: -180 },
  { id: 'e23', date: '2026-08-16', category: 'transport', name: 'Auto fares', amount: -400 },
  { id: 'e24', date: '2026-08-16', category: 'home', name: 'Cleaning supplies', amount: -250 },
  { id: 'e25', date: '2026-08-17', category: 'food', name: 'Zomato', amount: -450 },
]

/** Monthly budget plan. `spent` is derived from ENTRIES at runtime. */
export const ENVELOPES = [
  { id: 'food', allocated: 5000 },
  { id: 'transport', allocated: 2500 },
  { id: 'home', allocated: 2000 },
  { id: 'fun', allocated: 1500 },
  { id: 'other', allocated: 1500 },
  { id: 'buffer', allocated: 3500, label: 'Buffer', emoji: '🛟', rolledOver: 500 },
]

/** Recurring commitments. `paid` bills already left the account this month. */
export const BILLS = [
  { id: 'b1', name: 'Electricity split', emoji: '💡', amount: 1200, dueDay: 5, freq: 'monthly', paid: true },
  { id: 'b2', name: 'Wifi split', emoji: '📶', amount: 300, dueDay: 5, freq: 'monthly', paid: true },
  { id: 'b3', name: 'Duolingo Super', emoji: '🦉', amount: 160, dueDay: 12, freq: 'monthly', paid: true },
  { id: 'b4', name: 'Gym membership', emoji: '🏋️', amount: 461, dueDay: 20, freq: 'monthly', paid: false },
  { id: 'b5', name: 'Spotify', emoji: '🎧', amount: 119, dueDay: 22, freq: 'monthly', paid: false },
  { id: 'b6', name: 'Phone recharge', emoji: '📱', amount: 260, dueDay: 24, freq: 'monthly', paid: false },
  { id: 'b7', name: 'PG room rent', emoji: '🏠', amount: 4000, dueDay: 28, freq: 'monthly', paid: false },
]
