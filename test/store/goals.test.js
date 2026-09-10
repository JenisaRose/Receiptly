import { beforeEach, describe, expect, it } from 'vitest'
import { cleanGoal, legacyGoals } from '../../src/store/budgetCore'
import { monthContext, safeToSpend } from '../../src/store/selectors'
import { goal, income, makeState, resetIds } from '../fixtures'

beforeEach(resetIds)

describe('cleanGoal — payload normalisation', () => {
  it('fills sensible defaults', () => {
    expect(cleanGoal({})).toEqual({
      emoji: '🎯',
      name: 'Savings',
      saved: 0,
      target: 0,
      monthly: 0,
    })
  })

  it('trims, rounds and clamps negatives to zero', () => {
    expect(cleanGoal({ name: '  Bike  ', target: '39999.7', monthly: -100, saved: 'x' })).toEqual({
      emoji: '🎯',
      name: 'Bike',
      target: 40000,
      monthly: 0,
      saved: 0,
    })
  })

  it('keeps target: 0 as a valid open-ended goal', () => {
    expect(cleanGoal({ name: 'Cushion', target: 0, monthly: 1500 }).target).toBe(0)
    expect(cleanGoal({ name: 'Cushion', target: 0, monthly: 1500 }).monthly).toBe(1500)
  })
})

describe('legacyGoals — single-goal migration', () => {
  it('folds an old goal + defaultSetAside into the goals array', () => {
    const migrated = legacyGoals({
      goal: { name: 'New laptop', emoji: '💻', target: 70000, saved: 12000 },
      defaultSetAside: 3000,
    })
    expect(migrated).toEqual([
      { id: 'goal1', name: 'New laptop', emoji: '💻', saved: 12000, target: 70000, monthly: 3000 },
    ])
  })

  it('migrates an open-ended goal that only had a monthly set-aside', () => {
    const migrated = legacyGoals({ goal: { name: 'Savings' }, defaultSetAside: 1500 })
    expect(migrated[0]).toMatchObject({ target: 0, monthly: 1500 })
  })

  it('returns [] when there is nothing to migrate', () => {
    expect(legacyGoals({})).toEqual([])
    expect(legacyGoals({ goal: null })).toEqual([])
    expect(legacyGoals({ goal: { target: 0 }, defaultSetAside: 0 })).toEqual([])
  })
})

describe('goals and the budget', () => {
  it('the combined monthly set-aside is the sum of every goal', () => {
    const state = makeState({
      goals: [goal({ monthly: 1000 }), goal({ monthly: 500 }), goal({ monthly: 250, target: 0 })],
    })
    expect(monthContext(state).goalSetAside).toBe(1750)
  })

  it('a goal reduces safe-to-spend by exactly its monthly amount', () => {
    const txns = [income('2026-09-01', 20000)]
    const withoutGoal = safeToSpend(makeState({ transactions: txns }))
    const withGoal = safeToSpend(makeState({ transactions: txns, goals: [goal({ monthly: 2000 })] }))
    expect(withoutGoal.spendable - withGoal.spendable).toBe(2000)
  })

  it('an open-ended goal (target 0) still sets money aside', () => {
    const state = makeState({
      transactions: [income('2026-09-01', 20000)],
      goals: [goal({ target: 0, monthly: 1200 })],
    })
    expect(safeToSpend(state).spendable).toBe(18800)
  })

  it('goals never touch category totals or envelopes', () => {
    const txns = [income('2026-09-01', 20000)]
    const a = makeState({ transactions: txns, budget: { food: 3000 } })
    const b = makeState({ transactions: txns, budget: { food: 3000 }, goals: [goal({ monthly: 5000 })] })
    // adding a ₹5000 goal changes only spendable, not the plan
    expect(a.budgets.default).toEqual(b.budgets.default)
  })
})
