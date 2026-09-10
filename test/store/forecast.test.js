import { beforeEach, describe, expect, it } from 'vitest'
import { envelopeForecast, monthForecast } from '../../src/store/forecast'
import { income, makeState, resetIds, tx } from '../fixtures'

beforeEach(resetIds)

/** day-`d` of a 30-day month, ₹`total` spent evenly-ish so `daily = total/d`. */
function midMonth({ day = 10, spent = 0, spends, budget, income: inc = 30000, goals } = {}) {
  return makeState({
    today: `2026-09-${String(day).padStart(2, '0')}`,
    selectedMonth: '2026-09',
    budget: budget ?? { food: 5000, transport: 2000, home: 1000 },
    goals,
    transactions: [
      income('2026-09-01', inc, 'Stipend'),
      ...(spends ?? [tx('2026-09-02', 'food', spent)]),
    ],
  })
}

describe('monthForecast', () => {
  it('projects month-end spend from the pace so far', () => {
    const f = monthForecast(midMonth({ day: 10, spent: 2000 }))
    expect(f.daily).toBe(200) // 2000 / 10
    expect(f.projected).toBe(6000) // 200 * 30
    expect(f.daysInMonth).toBe(30)
    expect(f.elapsed).toBe(10)
  })

  it('classifies a low pace as "under" plan', () => {
    // plan = 5000+2000+1000 = 8000; projected 6000 → 2000 under
    const f = monthForecast(midMonth({ day: 10, spent: 2000 }))
    expect(f.target).toBe(8000)
    expect(f.status).toBe('under')
    expect(f.delta).toBe(-2000)
  })

  it('classifies a high pace as "over" plan', () => {
    const f = monthForecast(midMonth({ day: 10, spent: 4000 })) // projected 12000 vs 8000
    expect(f.projected).toBe(12000)
    expect(f.status).toBe('over')
    expect(f.delta).toBe(4000)
  })

  it('classifies a pace landing near plan as "on-track"', () => {
    const f = monthForecast(midMonth({ day: 10, spent: 2700 })) // projected 8100 vs 8000
    expect(f.projected).toBe(8100)
    expect(f.status).toBe('on-track')
  })

  it('returns null in the first two days (not enough signal)', () => {
    expect(monthForecast(midMonth({ day: 2, spent: 500 }))).toBeNull()
  })

  it('returns null for a month that is not the current one', () => {
    const past = makeState({
      today: '2026-09-15',
      selectedMonth: '2026-08',
      transactions: [income('2026-08-01', 20000), tx('2026-08-10', 'food', 5000)],
    })
    expect(monthForecast(past)).toBeNull()
  })

  it('falls back to what is left to spend when there is no category plan', () => {
    const f = monthForecast(
      midMonth({ day: 10, spent: 1000, budget: { food: 0, transport: 0, home: 0 } }),
    )
    // no plan → target = spendable = income (no bills / goals)
    expect(f.target).toBe(30000)
  })

  it('reports the day the pace would cross the plan, or null if it never does', () => {
    // daily 400, target 8000 → crosses on day 20
    expect(monthForecast(midMonth({ day: 10, spent: 4000 })).crossDay).toBe(20)
    // daily 200, target 8000 → would cross on day 40, past month-end
    expect(monthForecast(midMonth({ day: 10, spent: 2000 })).crossDay).toBeNull()
  })

  it('builds a cumulative running total, one entry per elapsed day', () => {
    const f = monthForecast(
      midMonth({ day: 10, spends: [tx('2026-09-05', 'food', 500), tx('2026-09-08', 'food', 300)] }),
    )
    expect(f.cumulative).toHaveLength(10)
    expect(f.cumulative).toEqual([0, 0, 0, 0, 500, 500, 500, 800, 800, 800])
  })
})

describe('envelopeForecast', () => {
  it('projects each funded envelope forward at its current rate', () => {
    const out = envelopeForecast(
      midMonth({
        day: 10,
        budget: { food: 4000, transport: 2000 },
        spends: [tx('2026-09-02', 'food', 2000), tx('2026-09-03', 'transport', 300)],
      }),
    )
    // food: 2000 in 10 days → factor 3 → projected 6000, over 4000
    expect(out.food).toMatchObject({ projected: 6000, willOverspend: true, crossDay: 20 })
    // transport: 300 → projected 900, well under 2000
    expect(out.transport).toMatchObject({ projected: 900, willOverspend: false })
  })

  it('ignores categories with no allocation', () => {
    const out = envelopeForecast(
      midMonth({
        day: 10,
        budget: { food: 0 },
        spends: [tx('2026-09-02', 'food', 2000)],
      }),
    )
    expect(out.food).toBeUndefined()
  })

  it('is empty before day 3 and for non-current months', () => {
    expect(envelopeForecast(midMonth({ day: 2, spent: 500 }))).toEqual({})
  })
})
