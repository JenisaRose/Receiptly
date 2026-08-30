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
