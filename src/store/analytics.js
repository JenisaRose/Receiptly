/**
 * Read models for Trends and Reflect, computed from real transactions.
 *
 * The pattern detection here is deliberately shallow — a proper insights engine
 * is a later phase. These are the aggregations the two screens need today.
 */

import { MONTH_NAMES, addDays, daysInMonth, shiftMonth, weekdayMon0 } from '../lib/dates'
import { rupee } from '../lib/format'
import { monthContext } from './selectors'

const p2 = (n) => String(n).padStart(2, '0')

function spendsInMonth(state, key) {
  return state.transactions.filter((t) => t.amount < 0 && t.date.startsWith(key))
}

function sumAbs(list) {
  return list.reduce((s, t) => s + Math.abs(t.amount), 0)
}

function topCategory(state, spends) {
  const totals = {}
  for (const t of spends) totals[t.categoryId] = (totals[t.categoryId] ?? 0) + Math.abs(t.amount)
  const entry = Object.entries(totals).sort((a, b) => b[1] - a[1])[0]
  if (!entry) return null
  const cat = state.categories.find((c) => c.id === entry[0])
  return { id: entry[0], label: cat?.label ?? entry[0], amount: entry[1] }
}

/** Reference "last day that counts" for the selected month. */
function referenceISO(state) {
  const m = monthContext(state)
  if (m.isPast) return `${m.key}-${p2(m.daysInMonth)}`
  return state.clock.todayISO
}

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

/** Mon–Sun *average* spend per occurrence over the trailing `weeks` weeks. */
export function dayOfWeekSpend(state, weeks = 8) {
  const ref = referenceISO(state)
  const start = addDays(ref, -(weeks * 7 - 1))
  const totals = [0, 0, 0, 0, 0, 0, 0]
  const counts = [0, 0, 0, 0, 0, 0, 0]
  for (let i = 0; i < weeks * 7; i++) counts[weekdayMon0(addDays(start, i))] += 1
  for (const t of state.transactions) {
    if (t.amount >= 0 || t.date < start || t.date > ref) continue
    totals[weekdayMon0(t.date)] += Math.abs(t.amount)
  }
  return totals.map((sum, i) => (counts[i] ? Math.round(sum / counts[i]) : 0))
}

export function spendingPatterns(state) {
  const m = monthContext(state)
  // always analyse a *complete* month
  const analysed = m.isCurrent ? shiftMonth(m.key, -1) : m.key
  const analysedName = MONTH_NAMES[Number(analysed.slice(5, 7)) - 1]

  const dow = dayOfWeekSpend(state)
  const weekdayAvg = (dow[0] + dow[1] + dow[2] + dow[3] + dow[4]) / 5
  const weekendAvg = (dow[5] + dow[6]) / 2

  const spends = spendsInMonth(state, analysed)
  const total = sumAbs(spends)
  const top = topCategory(state, spends)

  // 4 completed months ending at `analysed`
  const window = []
  let k = analysed
  for (let i = 0; i < 4; i++) {
    window.unshift(sumAbs(spendsInMonth(state, k)))
    k = shiftMonth(k, -1)
  }
  const avg = window.reduce((s, v) => s + v, 0) / window.length

  const out = []

  if (weekdayAvg > 0 && weekendAvg / weekdayAvg >= 1.25) {
    out.push({
      emoji: '🔥',
      color: 'pink',
      text: `Weekends cost ${(weekendAvg / weekdayAvg).toFixed(1)}× your weekdays`,
      note: `a typical Sat or Sun runs ${rupee(weekendAvg)}`,
    })
  }

  if (top && total > 0) {
    const prevTop = topCategory(state, spendsInMonth(state, shiftMonth(analysed, -1)))
    const dir =
      prevTop && prevTop.id === top.id
        ? top.amount > prevTop.amount
          ? `up ${rupee(top.amount - prevTop.amount)} on the month before`
          : `down ${rupee(prevTop.amount - top.amount)} on the month before`
        : `${Math.round((top.amount / total) * 100)}% of ${analysedName}`
    out.push({
      emoji: '🍜',
      color: 'orange',
      text: `${top.label} led ${analysedName} at ${rupee(top.amount)}`,
      note: dir,
    })
  }

  if (avg > 0 && total > 0) {
    const delta = total - avg
    if (Math.abs(delta) < avg * 0.06) {
      out.push({
        emoji: '📊',
        color: 'sky',
        text: `${analysedName} landed right on your average`,
        note: `within ${rupee(Math.abs(delta))} of the last 4 months`,
      })
    } else {
      const under = delta < 0
      out.push({
        emoji: under ? '📉' : '📈',
        color: under ? 'mint' : 'orange',
        text: under
          ? `${analysedName} came in under your average`
          : `${analysedName} ran above your average`,
        note: `${rupee(Math.abs(delta))} ${under ? 'below' : 'over'} the last 4 months`,
      })
    }
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

  // weekly cap = the discretionary budget spread across the month's weeks
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

function longestRun(arr) {
  let best = 0
  let cur = 0
  for (const v of arr) {
    cur = v === 0 ? cur + 1 : 0
    if (cur > best) best = cur
  }
  return best
}
