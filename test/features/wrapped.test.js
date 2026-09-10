import { beforeEach, describe, expect, it } from 'vitest'
import { derive } from '../../src/store/budgetCore'
import { buildWrapped } from '../../src/features/wrapped/wrappedData'
import { income, makeState, resetIds, tx } from '../fixtures'

beforeEach(resetIds)

const wrapped = (state) => buildWrapped({ ...state, ...derive(state) })

describe('buildWrapped', () => {
  it('marks the current month partial and a finished month not', () => {
    const current = wrapped(
      makeState({
        today: '2026-09-10',
        selectedMonth: '2026-09',
        transactions: [income('2026-09-01', 20000), tx('2026-09-03', 'food', 1200), tx('2026-09-05', 'fun', 300)],
      }),
    )
    expect(current.partial).toBe(true)

    const finished = wrapped(
      makeState({
        today: '2026-09-10',
        selectedMonth: '2026-08',
        transactions: [income('2026-08-01', 20000), tx('2026-08-03', 'food', 1200), tx('2026-08-05', 'fun', 300)],
      }),
    )
    expect(finished.partial).toBe(false)
  })

  it('still reports the category and priciest-day shares (calculation unchanged)', () => {
    const w = wrapped(
      makeState({
        today: '2026-09-10',
        selectedMonth: '2026-09',
        transactions: [
          income('2026-09-01', 20000),
          tx('2026-09-03', 'food', 1200), // 1200 of 1500 = 80%
          tx('2026-09-05', 'fun', 300),
        ],
      }),
    )
    expect(w.category.pct).toBe(80)
    expect(w.priciest.pctOfMonth).toBe(80)
  })

  it('is unavailable for a month with no spend', () => {
    expect(wrapped(makeState({ selectedMonth: '2026-09' })).available).toBe(false)
  })
})
