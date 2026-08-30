/**
 * Tailwind can only see class names that appear as complete literals, so the
 * per-category colour classes are spelled out here rather than built at runtime.
 */

export const BG = {
  yellow: 'bg-yellow',
  pink: 'bg-pink',
  mint: 'bg-mint',
  lilac: 'bg-lilac',
  orange: 'bg-orange',
  sky: 'bg-sky',
}

export const NAV_ACTIVE_BG = {
  today: 'bg-lilac',
  receipts: 'bg-mint',
  trends: 'bg-sky',
  envelopes: 'bg-orange',
  bills: 'bg-pink',
  reflect: 'bg-yellow',
}

export const ENVELOPE_STATUS = {
  ok: { tag: 'bg-mint', label: 'on track', fill: 'bg-mint' },
  close: { tag: 'bg-yellow', label: 'getting close', fill: 'bg-yellow' },
  over: { tag: 'bg-pink', label: 'over', fill: 'stripes-over' },
}

export const HEAT_LEVELS = ['bg-white', 'bg-mint', 'bg-yellow', 'bg-orange', 'bg-pink']

export function heatLevel(value) {
  if (value === 0) return 0
  if (value < 200) return 1
  if (value < 500) return 2
  if (value < 1000) return 3
  return 4
}
