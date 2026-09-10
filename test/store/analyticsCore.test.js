import { beforeEach, describe, expect, it } from 'vitest'
import {
  longestRun,
  referenceISO,
  spendsInMonth,
  sumAbs,
  topCategory,
} from '../../src/store/analyticsCore'
import { income, makeState, resetIds, tx } from '../fixtures'

beforeEach(resetIds)

describe('longestRun', () => {
  it('finds the longest run of zeros', () => {
    expect(longestRun([1, 0, 0, 1, 0, 0, 0, 1])).toBe(3)
    expect(longestRun([0, 0, 0])).toBe(3)
    expect(longestRun([5, 5, 5])).toBe(0)
    expect(longestRun([])).toBe(0)
  })

  it('counts a trailing run', () => {
    expect(longestRun([1, 0, 0, 0, 0])).toBe(4)
  })
})

describe('spendsInMonth / sumAbs', () => {
  it('returns only that month’s spends (not income, not other months)', () => {
    const state = makeState({
      transactions: [
        income('2026-09-01', 10000),
        tx('2026-09-03', 'food', 400),
        tx('2026-09-20', 'fun', 600),
        tx('2026-08-31', 'food', 999),
      ],
    })
    const spends = spendsInMonth(state, '2026-09')
    expect(spends).toHaveLength(2)
    expect(sumAbs(spends)).toBe(1000)
  })
})

describe('topCategory', () => {
  it('picks the category with the most spend', () => {
    const state = makeState({
      transactions: [
        tx('2026-09-01', 'food', 300),
        tx('2026-09-02', 'transport', 900),
        tx('2026-09-03', 'food', 400),
      ],
    })
    expect(topCategory(state, spendsInMonth(state, '2026-09'))).toMatchObject({
      id: 'transport',
      label: 'Transport',
      amount: 900,
    })
  })

  it('is null with no spends', () => {
    expect(topCategory(makeState(), [])).toBeNull()
  })
})

describe('referenceISO', () => {
  it('is today for the current month', () => {
    expect(referenceISO(makeState({ today: '2026-09-10', selectedMonth: '2026-09' }))).toBe(
      '2026-09-10',
    )
  })

  it('is the last day of the month for a past month', () => {
    expect(referenceISO(makeState({ today: '2026-09-10', selectedMonth: '2026-08' }))).toBe(
      '2026-08-31',
    )
  })
})
