/** Format a number as Indian rupees, e.g. 8240 -> "₹8,240". */
export function rupee(n) {
  return '₹' + Math.round(n).toLocaleString('en-IN')
}

/** Format a number with Indian digit grouping, no symbol. */
export function inr(n) {
  return Math.round(n).toLocaleString('en-IN')
}

/** Clamp a number into [min, max]. */
export function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max)
}

/** 1 -> "1st", 2 -> "2nd", 23 -> "23rd". */
export function ordinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] ?? s[v] ?? s[0])
}
