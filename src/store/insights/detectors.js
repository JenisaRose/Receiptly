/**
 * Each detector is `(ctx) => Insight | null`.
 *
 * Insight = { id, family?, tone: 'watch'|'good'|'neutral', emoji, headline,
 *             detail, score }  — score in ~0..1, used only for ranking.
 *
 * `family` groups mutually-redundant insights (e.g. two findings about the same
 * category); the engine keeps only the top-scoring one per family.
 */

import { longestRun } from '../analyticsCore'

const clamp01 = (n) => Math.max(0, Math.min(1, n))
const pct = (part, whole) => (whole ? Math.round((part / whole) * 100) : 0)

export const DETECTORS = [
  function weekendHeavy(ctx) {
    const { dowAvg, rupee } = ctx
    const weekday = (dowAvg[0] + dowAvg[1] + dowAvg[2] + dowAvg[3] + dowAvg[4]) / 5
    const weekend = (dowAvg[5] + dowAvg[6]) / 2
    if (!weekday) return null
    const ratio = weekend / weekday
    if (ratio < 1.3) return null
    return {
      id: 'weekend-heavy',
      tone: 'watch',
      emoji: '🔥',
      headline: `Weekends cost ${ratio.toFixed(1)}× your weekdays`,
      detail: `a typical Sat or Sun runs ${rupee(Math.round(weekend))}`,
      score: clamp01((ratio - 1) * 0.7),
    }
  },

  function categoryTrend(ctx) {
    const { categoryMonthly, catLabel, rupee } = ctx
    let best = null
    for (const [id, series] of Object.entries(categoryMonthly)) {
      if (series.length < 4) continue
      let rising = 0
      let falling = 0
      for (let i = series.length - 1; i > 0; i--) {
        if (series[i] > series[i - 1] * 1.02) rising++
        else break
      }
      for (let i = series.length - 1; i > 0; i--) {
        if (series[i] < series[i - 1] * 0.98) falling++
        else break
      }
      const streak = Math.max(rising, falling)
      if (streak < 3) continue
      const up = rising >= falling
      const delta = Math.abs(series.at(-1) - series[series.length - 1 - streak])
      if (delta < 400) continue
      const score = clamp01(0.35 + streak * 0.12)
      if (!best || score > best.score) {
        best = {
          id: 'category-trend',
          family: `cat:${id}`,
          tone: up ? 'watch' : 'good',
          emoji: up ? '📈' : '📉',
          headline: `${catLabel[id] ?? id} has ${up ? 'climbed' : 'dropped'} ${streak} months running`,
          detail: `${up ? 'up' : 'down'} ${rupee(Math.round(delta))} over that stretch`,
          score,
        }
      }
    }
    return best
  },

  function categorySpike(ctx) {
    const { categoryMonthly, catLabel, rupee, monthName } = ctx
    let best = null
    for (const [id, series] of Object.entries(categoryMonthly)) {
      if (series.length < 4) continue
      const now = series.at(-1)
      const prior = (series[series.length - 2] + series[series.length - 3] + series[series.length - 4]) / 3
      if (prior <= 0) continue
      if (now < prior * 1.45 || now - prior < 500) continue
      const score = clamp01(0.4 + (now / prior - 1) * 0.4)
      if (!best || score > best.score) {
        best = {
          id: 'category-spike',
          family: `cat:${id}`,
          tone: 'watch',
          emoji: '⚡',
          headline: `${catLabel[id] ?? id} jumped in ${monthName}`,
          detail: `${rupee(Math.round(now))} vs a usual ${rupee(Math.round(prior))}`,
          score,
        }
      }
    }
    return best
  },

  function looksLikeSubscription(ctx) {
    const { nameMonths, billNames, rupee } = ctx
    let best = null
    for (const { display, hits } of Object.values(nameMonths)) {
      if (hits.length < 3) continue
      if (billNames.has(display.toLowerCase())) continue
      const avg = hits.reduce((s, v) => s + v, 0) / hits.length
      const spread = Math.max(...hits) - Math.min(...hits)
      if (spread > avg * 0.2 || avg < 60) continue
      const score = clamp01(0.45 + hits.length * 0.08)
      if (!best || score > best.score) {
        best = {
          id: 'looks-like-sub',
          family: `sub:${display.toLowerCase()}`,
          tone: 'neutral',
          emoji: '🔁',
          headline: `“${display}” looks like a subscription`,
          detail: `${rupee(Math.round(avg))} a month, ${hits.length} months in a row — add it to Bills?`,
          score,
        }
      }
    }
    return best
  },

  function bigSingleDay(ctx) {
    const { dayTotals, monthTotal, monthName, rupee } = ctx
    if (!monthTotal) return null
    const max = Math.max(...dayTotals)
    const day = dayTotals.indexOf(max) + 1
    const share = max / monthTotal
    if (share < 0.22) return null
    return {
      id: 'big-single-day',
      tone: 'watch',
      emoji: '💥',
      headline: `${monthName} ${day} alone was ${rupee(Math.round(max))}`,
      detail: `${pct(max, monthTotal)}% of the whole month in one day`,
      score: clamp01(0.3 + share),
    }
  },

  function smallTapsDrain(ctx) {
    const { monthSpends, monthName, rupee } = ctx
    const small = monthSpends.filter((t) => Math.abs(t.amount) <= 120)
    const sum = small.reduce((s, t) => s + Math.abs(t.amount), 0)
    if (small.length < 12 || sum < 1200) return null
    return {
      id: 'small-taps',
      tone: 'watch',
      emoji: '🫧',
      headline: `${small.length} small taps added up to ${rupee(Math.round(sum))}`,
      detail: `little buys under ₹120 across ${monthName}`,
      score: clamp01(0.25 + sum / 6000),
    }
  },

  function noSpendStreak(ctx) {
    const { dayTotals, monthName } = ctx
    const run = longestRun(dayTotals)
    const noSpend = dayTotals.filter((v) => v === 0).length
    if (run < 3) return null
    return {
      id: 'no-spend-streak',
      tone: 'good',
      emoji: '🧊',
      headline: `You had a ${run}-day no-spend streak`,
      detail: `${noSpend} no-spend days in ${monthName} overall`,
      score: clamp01(0.3 + run * 0.08),
    }
  },

  function priciestWeek(ctx) {
    const { dayTotals, rupee, monthName } = ctx
    const weeks = []
    for (let i = 0; i < dayTotals.length; i += 7) {
      weeks.push(dayTotals.slice(i, i + 7).reduce((s, v) => s + v, 0))
    }
    if (weeks.length < 3) return null
    const max = Math.max(...weeks)
    const idx = weeks.indexOf(max)
    const others = weeks.filter((_, i) => i !== idx)
    const othersAvg = others.reduce((s, v) => s + v, 0) / others.length
    if (!othersAvg || max < othersAvg * 1.7 || max - othersAvg < 1100) return null
    return {
      id: 'priciest-week',
      tone: 'watch',
      emoji: '📅',
      headline: `Week ${idx + 1} of ${monthName} ran hot at ${rupee(Math.round(max))}`,
      detail: `about ${rupee(Math.round(max - othersAvg))} over your other weeks`,
      score: clamp01(0.3 + (max / othersAvg - 1) * 0.35),
    }
  },

  function frequentCategory(ctx) {
    const { byCategory, catLabel, monthName } = ctx
    let best = null
    for (const [id, g] of Object.entries(byCategory)) {
      if (g.count < 15) continue
      if (!best || g.count > best.count) best = { id, count: g.count }
    }
    if (!best) return null
    return {
      id: 'frequent-category',
      family: `cat:${best.id}`,
      tone: 'neutral',
      emoji: '🔂',
      headline: `You logged ${catLabel[best.id] ?? best.id} ${best.count} times in ${monthName}`,
      detail: 'that’s roughly every other day',
      score: clamp01(0.25 + best.count / 40),
    }
  },

  function monthVsAverage(ctx) {
    const { monthlyTotals, monthName, rupee } = ctx
    if (monthlyTotals.length < 3) return null
    const prior = monthlyTotals.slice(0, -1).map((m) => m.total).filter((t) => t > 0)
    if (prior.length < 2) return null
    const avg = prior.reduce((s, v) => s + v, 0) / prior.length
    const now = monthlyTotals.at(-1).total
    if (!now) return null
    const delta = now - avg
    if (Math.abs(delta) < avg * 0.06) {
      return {
        id: 'month-vs-average',
        tone: 'neutral',
        emoji: '📊',
        headline: `${monthName} landed right on your average`,
        detail: `within ${rupee(Math.round(Math.abs(delta)))} of your recent months`,
        score: 0.28,
      }
    }
    const under = delta < 0
    return {
      id: 'month-vs-average',
      tone: under ? 'good' : 'watch',
      emoji: under ? '👍' : '👀',
      headline: `${monthName} came in ${rupee(Math.round(Math.abs(delta)))} ${under ? 'under' : 'over'} your average`,
      detail: `vs ${rupee(Math.round(avg))} a month recently`,
      score: clamp01(0.3 + Math.abs(delta) / avg),
    }
  },

  function spendingDirection(ctx) {
    const withData = ctx.monthlyTotals.filter((m) => m.total > 0)
    if (withData.length < 6) return null
    const { rupee } = ctx
    const first = withData.slice(0, 3).reduce((s, m) => s + m.total, 0) / 3
    const last = withData.slice(-3).reduce((s, m) => s + m.total, 0) / 3
    if (!first) return null
    const change = last / first - 1
    if (Math.abs(change) < 0.1) return null
    const down = change < 0
    return {
      id: 'spending-direction',
      tone: down ? 'good' : 'watch',
      emoji: down ? '🍃' : '🌶️',
      headline: `Spending has ${down ? 'cooled' : 'crept up'} ~${Math.abs(Math.round(change * 100))}% over six months`,
      detail: `${rupee(Math.round(first))}/mo back then → ${rupee(Math.round(last))}/mo now`,
      score: clamp01(0.28 + Math.abs(change)),
    }
  },
]
