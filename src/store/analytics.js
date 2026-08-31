/** Read models for Trends and Reflect, computed from real transactions. */

import { MONTH_NAMES, addDays, daysInMonth, shiftMonth } from '../lib/dates'
import { rupee } from '../lib/format'
import {
  dayOfWeekSpend,
  longestRun,
  referenceISO,
  spendsInMonth,
  sumAbs,
  topCategory,
} from './analyticsCore'
import { monthContext } from './selectors'

export { dayOfWeekSpend }

export function trendsByMonth(state, count = 6) {
  const keys = []
  let k = state.ui.selectedMonth
  for (let i = 0; i < count; i++) {
    keys.unshift(k)
    k = shiftMonth(k, -1)
  }
  return keys.map((key) => {
    const spends = spendsInMonth(state, key)
    const top = topCategory(state, spends)
    return {
      key,
      label: MONTH_NAMES[Number(key.slice(5, 7)) - 1].slice(0, 3),
      total: sumAbs(spends),
      top: top ? `${top.label} ${rupee(top.amount)}` : '—',
    }
  })
}

export function trendsByWeek(state, count = 8) {
  const ref = referenceISO(state)
  const out = []
  for (let i = count - 1; i >= 0; i--) {
    const end = addDays(ref, -i * 7)
    const start = addDays(end, -6)
    const spends = state.transactions.filter(
      (t) => t.amount < 0 && t.date >= start && t.date <= end,
    )
    const top = topCategory(state, spends)
    out.push({
      key: end,
      label: `W${count - i}`,
      total: sumAbs(spends),
      top: top ? `${top.label} ${rupee(top.amount)}` : '—',
    })
  }
  return out
}

export function monthReflection(state) {
  const m = monthContext(state)
  const key = m.key
  const spends = spendsInMonth(state, key)
  const total = sumAbs(spends)

  const prevKey = shiftMonth(key, -1)
  const prevTotal = sumAbs(spendsInMonth(state, prevKey))
  const prevName = MONTH_NAMES[Number(prevKey.slice(5, 7)) - 1]
  const diff = total - prevTotal
  const vsPrev =
    prevTotal === 0
      ? 'your first month with data'
      : `${rupee(Math.abs(diff))} ${diff >= 0 ? 'more' : 'less'} than ${prevName}`

  const dim = daysInMonth(key)
  const countUpTo = m.isCurrent ? m.dayOfMonth : dim
  const heat = Array.from({ length: dim }, () => 0)
  for (const t of spends) heat[Number(t.date.slice(-2)) - 1] += Math.abs(t.amount)

  const noSpendDays = heat.slice(0, countUpTo).filter((v) => v === 0).length
  const maxSpend = Math.max(0, ...heat)
  const priciestDay = heat.indexOf(maxSpend) + 1

  const top = topCategory(state, spends)
  const topPct = total > 0 && top ? Math.round((top.amount / total) * 100) : 0

  const discretionary = state.categories
    .filter((c) => !c.kind)
    .reduce((s, c) => s + (state.budgets.default[c.id] ?? 0), 0)
  const weeksInMonth = Math.ceil(dim / 7)
  const weeklyCap = discretionary / weeksInMonth
  let weeksUnder = 0
  for (let w = 0; w < weeksInMonth; w++) {
    const wSpend = heat.slice(w * 7, w * 7 + 7).reduce((s, v) => s + v, 0)
    if (wSpend <= weeklyCap) weeksUnder += 1
  }

  const bestRun = longestRun(heat.slice(0, countUpTo))

  let note = 'a fairly steady month.'
  if (top && topPct >= 35) note = `${top.label.toLowerCase()} ate ${topPct}% of the month 👀`
  else if (diff < 0 && prevTotal > 0) note = "spending's cooling off — keep it going."
  else if (maxSpend > total * 0.2) note = 'one big day did a lot of the damage.'

  return {
    monthLabel: m.label,
    total,
    vsPrev,
    note,
    heat,
    cards: [
      {
        k: 'Biggest category',
        v: top?.label ?? '—',
        sub: top ? `${rupee(top.amount)} — ${topPct}% of the month` : 'nothing logged',
        tone: 'mint',
      },
      {
        k: 'No-spend days',
        v: String(noSpendDays),
        sub: bestRun > 1 ? `best run: ${bestRun} in a row` : 'keep hunting for them',
        tone: 'sky',
      },
      {
        k: 'Priciest day',
        v: maxSpend > 0 ? `${m.label.slice(0, 3)} ${priciestDay}` : '—',
        sub: maxSpend > 0 ? rupee(maxSpend) : 'no spending yet',
        tone: 'lilac',
      },
      {
        k: 'Weekly cap held',
        v: `${weeksUnder} / ${weeksInMonth} weeks`,
        sub: `cap ≈ ${rupee(weeklyCap)} a week`,
        tone: 'pink',
      },
    ],
  }
}
