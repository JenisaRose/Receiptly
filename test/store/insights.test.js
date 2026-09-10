import { beforeEach, describe, expect, it } from 'vitest'
import { buildContext } from '../../src/store/insights/context'
import { runInsights } from '../../src/store/insights/engine'
import { income, makeState, resetIds, tx } from '../fixtures'

beforeEach(resetIds)

const ids = (list) => list.map((i) => i.id)
const byId = (list, id) => list.find((i) => i.id === id)

/** N spends in one category, spread across the given days of a month. */
function repeatSpend(monthKey, categoryId, name, amount, days) {
  return days.map((d) => tx(`${monthKey}-${String(d).padStart(2, '0')}`, categoryId, amount, { name }))
}

describe('buildContext — elapsed days', () => {
  it('analyses the previous complete month while mid-current-month', () => {
    const state = makeState({ today: '2026-09-10', selectedMonth: '2026-09' })
    const ctx = buildContext(state) // no override
    expect(ctx.monthKey).toBe('2026-08')
    expect(ctx.partialMonth).toBe(false)
  })

  it('marks the forced current month partial and stops the day array at today', () => {
    const state = makeState({
      today: '2026-09-10',
      transactions: [income('2026-09-01', 20000), tx('2026-09-04', 'food', 500)],
    })
    const ctx = buildContext(state, '2026-09')
    expect(ctx.partialMonth).toBe(true)
    expect(ctx.elapsedDays).toBe(10)
    expect(ctx.dayTotals).toHaveLength(10) // not 30 — days 11–30 don't exist yet
    expect(ctx.dayTotals[3]).toBe(500)
  })

  it('treats a completed past month as whole', () => {
    const ctx = buildContext(makeState({ today: '2026-09-10' }), '2026-07')
    expect(ctx.partialMonth).toBe(false)
    expect(ctx.dayTotals).toHaveLength(31)
  })
})

describe('runInsights — no data', () => {
  it('returns nothing for a month with zero spend', () => {
    expect(runInsights(makeState(), { monthKey: '2026-09' })).toEqual([])
  })
})

describe('noSpendStreak detector', () => {
  it('reports the real streak among elapsed days, not future ones', () => {
    // September, today the 10th: spend on the 1st & 2nd, nothing since → an
    // ongoing 8-day streak, NOT the "23 days" a full-month array would give.
    const state = makeState({
      today: '2026-09-10',
      transactions: [
        income('2026-09-01', 20000),
        tx('2026-09-01', 'food', 300),
        tx('2026-09-02', 'food', 300),
      ],
    })
    const insight = byId(runInsights(state, { monthKey: '2026-09' }), 'no-spend-streak')
    expect(insight).toBeDefined()
    expect(insight.headline).toBe("You're on an 8-day no-spend streak")
    expect(insight.detail).toContain('so far')
    expect(insight.detail).toContain('8 no-spend days')
  })

  it('uses past tense and "overall" for a finished month', () => {
    const state = makeState({
      today: '2026-09-15',
      transactions: [
        income('2026-08-01', 20000),
        tx('2026-08-01', 'food', 400),
        tx('2026-08-02', 'food', 400),
        tx('2026-08-31', 'food', 400),
      ],
    })
    const insight = byId(runInsights(state, { monthKey: '2026-08' }), 'no-spend-streak')
    expect(insight.headline).toMatch(/^You had a \d+-day no-spend streak$/)
    expect(insight.detail).toContain('overall')
  })

  it('does not fire when there is spending most days', () => {
    const state = makeState({
      today: '2026-09-15',
      transactions: [
        income('2026-08-01', 20000),
        // spend on every one of August's 31 days → no 3-day gap anywhere
        ...repeatSpend('2026-08', 'food', 'Lunch', 200, Array.from({ length: 31 }, (_, i) => i + 1)),
      ],
    })
    expect(ids(runInsights(state, { monthKey: '2026-08' }))).not.toContain('no-spend-streak')
  })
})

describe('bigSingleDay detector', () => {
  it('fires when one day is a big slice of the month', () => {
    const state = makeState({
      today: '2026-09-15',
      transactions: [
        income('2026-08-01', 20000),
        tx('2026-08-05', 'food', 500),
        tx('2026-08-10', 'fun', 500),
        tx('2026-08-14', 'other', 2000), // 2000 of 3000 = 67%
      ],
    })
    const insight = byId(runInsights(state, { monthKey: '2026-08' }), 'big-single-day')
    expect(insight).toBeDefined()
    expect(insight.headline).toContain('August 14')
    expect(insight.detail).toContain('67%')
  })

  it('does not fire when spending is spread evenly', () => {
    const state = makeState({
      today: '2026-09-15',
      transactions: [
        income('2026-08-01', 20000),
        ...repeatSpend('2026-08', 'food', 'Lunch', 200, [2, 6, 10, 14, 18, 22, 26]),
      ],
    })
    expect(ids(runInsights(state, { monthKey: '2026-08' }))).not.toContain('big-single-day')
  })
})

describe('looksLikeSubscription detector', () => {
  it('spots a fixed amount recurring across months', () => {
    const state = makeState({
      today: '2026-09-15',
      transactions: [
        tx('2026-06-08', 'fun', 199, { name: 'Netflix' }),
        tx('2026-07-08', 'fun', 199, { name: 'Netflix' }),
        tx('2026-08-08', 'fun', 199, { name: 'Netflix' }),
        tx('2026-08-15', 'food', 400, { name: 'Groceries' }),
      ],
    })
    const insight = byId(runInsights(state, { monthKey: '2026-08' }), 'looks-like-sub')
    expect(insight).toBeDefined()
    expect(insight.headline).toContain('Netflix')
  })
})

describe('retrospective insights are held back mid-month', () => {
  it('fires "frequent category" for a finished month', () => {
    const days = Array.from({ length: 16 }, (_, i) => i + 1)
    const state = makeState({
      today: '2026-09-15',
      transactions: [income('2026-08-01', 20000), ...repeatSpend('2026-08', 'food', 'Chai', 40, days)],
    })
    expect(ids(runInsights(state, { monthKey: '2026-08' }))).toContain('frequent-category')
  })

  it('suppresses it for a month still in progress', () => {
    const days = Array.from({ length: 16 }, (_, i) => i + 1) // 16 chais in the first 10 days? no — cap to elapsed
    const state = makeState({
      today: '2026-09-16',
      transactions: [
        income('2026-09-01', 20000),
        ...repeatSpend('2026-09', 'food', 'Chai', 40, days),
      ],
    })
    const result = runInsights(state, { monthKey: '2026-09' })
    expect(ids(result)).not.toContain('frequent-category')
    expect(ids(result)).not.toContain('month-vs-average')
    expect(ids(result)).not.toContain('spending-direction')
  })
})
