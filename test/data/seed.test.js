import { describe, expect, it } from 'vitest'
import { SCHEMA_VERSION, makeEmpty, makeSeed } from '../../src/data/seed'
import { financials, monthContext } from '../../src/store/selectors'

describe('makeSeed — the first-run demo', () => {
  const state = makeSeed('2026-09-10')

  it('is a complete, current-schema demo state', () => {
    expect(state.schemaVersion).toBe(SCHEMA_VERSION)
    expect(state.demo).toBe(true)
    expect(state.onboarded).toBe(true)
    expect(state.clock.todayISO).toBe('2026-09-10')
    expect(state.ui.selectedMonth).toBe('2026-09')
  })

  it('ships categories, presets, bills and goals', () => {
    expect(state.categories.length).toBeGreaterThanOrEqual(6)
    expect(state.presets.length).toBe(4)
    expect(state.bills.length).toBeGreaterThan(0)
    expect(state.goals.length).toBe(2)
    expect(Object.keys(state.budgets.default).length).toBeGreaterThan(0)
  })

  it('has twelve months of history plus the current month in progress', () => {
    const months = new Set(state.transactions.map((t) => t.date.slice(0, 7)))
    expect(months.size).toBeGreaterThanOrEqual(12)
    // the in-progress month stops before today
    const septDays = state.transactions
      .filter((t) => t.date.startsWith('2026-09'))
      .map((t) => Number(t.date.slice(-2)))
    expect(Math.max(...septDays)).toBeLessThan(10)
  })

  it('is deterministic — same date in, identical state out', () => {
    expect(makeSeed('2026-09-10')).toEqual(makeSeed('2026-09-10'))
  })

  it('produces a sensible current-month picture', () => {
    const f = financials(state)
    expect(f.income).toBeGreaterThan(0)
    expect(f.spentSoFar).toBeGreaterThan(0)
    expect(monthContext(state).isCurrent).toBe(true)
  })
})

describe('makeEmpty — the pre-onboarding blank slate', () => {
  const state = makeEmpty('2026-09-10')

  it('routes to setup with nothing logged', () => {
    expect(state.onboarded).toBe(false)
    expect(state.demo).toBe(false)
    expect(state.transactions).toEqual([])
    expect(state.bills).toEqual([])
    expect(state.goals).toEqual([])
  })

  it('still satisfies every selector', () => {
    expect(financials(state).income).toBe(0)
    expect(monthContext(state).goalSetAside).toBe(0)
    expect(Object.values(state.budgets.default).every((v) => v === 0)).toBe(true)
  })
})
