export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

const p2 = (n) => String(n).padStart(2, '0')

/** Real "now" as a local ISO date, e.g. "2026-08-31". */
export function todayISO(now = new Date()) {
  return `${now.getFullYear()}-${p2(now.getMonth() + 1)}-${p2(now.getDate())}`
}

/** "2026-08" -> "2026-09" (delta can be negative). */
export function shiftMonth(key, delta) {
  let [y, m] = key.split('-').map(Number)
  m += delta
  y += Math.floor((m - 1) / 12)
  m = ((((m - 1) % 12) + 12) % 12) + 1
  return `${y}-${p2(m)}`
}

/** "2026-08" -> 31 */
export function daysInMonth(key) {
  const [y, m] = key.split('-').map(Number)
  return new Date(y, m, 0).getDate()
}

/** "2026-08" -> "August 2026" */
export function monthLongLabel(key) {
  const [y, m] = key.split('-').map(Number)
  return `${MONTH_NAMES[m - 1]} ${y}`
}

/** "2026-08" -> "August" */
export function monthLabel(key) {
  return MONTH_NAMES[Number(key.split('-')[1]) - 1]
}

/** Inclusive list of "YYYY-MM" keys from `from` to `to`. */
export function monthRange(from, to) {
  const out = []
  let key = from
  while (key <= to) {
    out.push(key)
    key = shiftMonth(key, 1)
  }
  return out
}

/** "2026-08-18" + n days, as an ISO date string (TZ-safe). */
export function addDays(iso, n) {
  const d = new Date(iso + 'T12:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** Weekday of an ISO date with Monday = 0 … Sunday = 6. */
export function weekdayMon0(iso) {
  return (new Date(iso + 'T12:00:00Z').getUTCDay() + 6) % 7
}
