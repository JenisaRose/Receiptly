import { beforeEach, describe, expect, it } from 'vitest'
import { dayOfWeekSpend, monthReflection, trendsByMonth, trendsByWeek } from '../../src/store/analytics'
import { income, makeState, resetIds, tx } from '../fixtures'

beforeEach(resetIds)

/** A finished month (August 2026, 31 days) with a known spending shape. */
function augustRecap(over = {}) {
  return makeState({
    today: '2026-09-15',
    selectedMonth: '2026-08',
    budget: { food: 3000, transport: 2000, home: 1500, fun: 1000, other: 500 },
    transactions: [
      income('2026-08-01', 20000, 'Stipend'),
      tx('2026-08-03', 'food', 500),
      tx('2026-08-05', 'food', 800),
      tx('2026-08-06', 'transport', 200),
      tx('2026-08-10', 'food', 700),
      tx('2026-08-14', 'fun', 1500),
      ...(over.transactions ?? []),
    ],
    ...over,
  })
}

describe('monthReflection — a finished month', () => {
  const r = monthReflection(augustRecap())

  it('totals the month and finds the top category', () => {
    expect(r.total).toBe(3700)
    expect(r.raw.topCategory).toMatchObject({ label: 'Food', amount: 2000, pct: 54 })
  })

  it('finds the priciest single day', () => {
    expect(r.raw.priciestDay).toEqual({ day: 14, amount: 1500 })
  })

  it('counts no-spend days and the longest no-spend streak', () => {
    // spent on the 3rd, 5th, 6th, 10th, 14th → 5 active days of 31
    expect(r.raw.noSpendDays).toBe(26)
    // days 15–31 = a 17-day run
    expect(r.raw.bestRun).toBe(17)
  })

  it('builds a heat array one entry per day of the month', () => {
    expect(r.heat).toHaveLength(31)
    expect(r.heat[13]).toBe(1500) // the 14th
    expect(r.heat[0]).toBe(0)
  })

  it('exposes the vs-previous-month comparison', () => {
    // no July spend in this fixture → "first month with data"
    expect(r.vsPrev).toMatch(/first month/)
  })
})

describe('monthReflection — an empty month', () => {
  const r = monthReflection(makeState({ selectedMonth: '2026-08', today: '2026-09-10' }))

  it('reports zero without throwing', () => {
    expect(r.total).toBe(0)
    expect(r.raw.priciestDay).toBeNull()
    expect(r.raw.topCategory).toBeNull()
  })
})

describe('monthReflection — weekly cap held, current month', () => {
  it('only judges weeks that have started', () => {
    // day 10 of September → 2 weeks in progress (ceil 10/7)
    const state = makeState({
      today: '2026-09-10',
      selectedMonth: '2026-09',
      budget: { food: 7000 }, // weeklyCap = 7000 / ceil(30/7) = 7000/5 = 1400
      transactions: [
        income('2026-09-01', 20000),
        tx('2026-09-02', 'food', 500), // week 1 total 500  (≤ 1400) held
        tx('2026-09-09', 'food', 2000), // week 2 (days 8–10) total 2000
      ],
    })
    const r = monthReflection(state)
    // week 2's cap is pro-rated to its 3 elapsed days: 1400 * 3/7 = 600 → 2000 > 600, not held
    expect(r.raw.weeksInMonth).toBe(2)
    expect(r.raw.weeksUnder).toBe(1)
  })
})

describe('trendsByMonth', () => {
  it('returns six months ending at the selected one', () => {
    const rows = trendsByMonth(augustRecap())
    expect(rows).toHaveLength(6)
    expect(rows.at(-1)).toMatchObject({ key: '2026-08', label: 'Aug', total: 3700 })
    expect(rows[0].key).toBe('2026-03')
    expect(rows[0].total).toBe(0)
  })
})

describe('trendsByWeek', () => {
  it('returns eight 7-day windows ending at the reference day', () => {
    const rows = trendsByWeek(augustRecap())
    expect(rows).toHaveLength(8)
    const grandTotal = rows.reduce((s, w) => s + w.total, 0)
    // the 14th, 10th, 6th, 5th, 3rd all land inside the trailing 8 weeks of August
    expect(grandTotal).toBe(3700)
  })
})

describe('dayOfWeekSpend', () => {
  it('averages spend per weekday over the trailing weeks', () => {
    const state = makeState({
      today: '2026-09-30',
      selectedMonth: '2026-09',
      transactions: [tx('2026-09-07', 'food', 700)], // a Monday, inside the window
    })
    const dow = dayOfWeekSpend(state) // Mon … Sun
    expect(dow[0]).toBe(88) // 700 spread over 8 Mondays ≈ 88
    expect(dow.slice(1).every((v) => v === 0)).toBe(true)
  })

  it('is all zero for a month with no spending', () => {
    expect(dayOfWeekSpend(makeState())).toEqual([0, 0, 0, 0, 0, 0, 0])
  })
})
