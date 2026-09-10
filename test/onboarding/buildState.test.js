import { describe, expect, it } from 'vitest'
import { buildOnboardedState, onboardingSummary } from '../../src/features/onboarding/buildState'
import { financials, monthContext, safeToSpend } from '../../src/store/selectors'

const answers = {
  income: 25000,
  incomeKind: 'monthly',
  bills: [
    { name: 'Rent', emoji: '🏠', amount: 8000, dueDay: 1 },
    { name: '', amount: 0 }, // blank row — should be dropped
  ],
  goal: { name: 'New laptop', emoji: '💻', target: 70000 },
  monthlySave: 3000,
}

describe('buildOnboardedState', () => {
  const state = buildOnboardedState(answers, '2026-09-05')

  it('produces an onboarded, current-schema state', () => {
    expect(state.onboarded).toBe(true)
    expect(state.demo).toBe(false)
    expect(state.ui.selectedMonth).toBe('2026-09')
  })

  it('records the income as a transaction on the 1st', () => {
    expect(state.transactions).toHaveLength(1)
    expect(state.transactions[0]).toMatchObject({ date: '2026-09-01', amount: 25000, categoryId: 'income' })
    expect(financials(state).income).toBe(25000)
  })

  it('keeps only the valid bills', () => {
    expect(state.bills).toHaveLength(1)
    expect(state.bills[0]).toMatchObject({ name: 'Rent', amount: 8000, dueDay: 1 })
  })

  it('creates one goal carrying the monthly set-aside', () => {
    expect(state.goals).toHaveLength(1)
    expect(state.goals[0]).toMatchObject({ name: 'New laptop', target: 70000, monthly: 3000, saved: 0 })
    expect(monthContext(state).goalSetAside).toBe(3000)
  })

  it('splits the leftover into starter envelopes', () => {
    // 25000 − 8000 bills − 3000 save = 14000 leftover, spread across categories
    // (each envelope rounds to the nearest ₹50, so the sum lands close to 14000)
    const planned = Object.values(state.budgets.default).reduce((s, v) => s + v, 0)
    expect(planned).toBeGreaterThan(13500)
    expect(planned).toBeLessThan(14500)
  })

  it('leaves safe-to-spend positive and sane', () => {
    expect(safeToSpend(state).safeToday).toBeGreaterThan(0)
  })

  it('folds a goal-less monthly save into an open-ended goal', () => {
    const s = buildOnboardedState({ income: 20000, monthlySave: 2000, bills: [], goal: null }, '2026-09-01')
    expect(s.goals).toHaveLength(1)
    expect(s.goals[0]).toMatchObject({ target: 0, monthly: 2000 })
  })

  it('logs no income transaction when income is zero', () => {
    const s = buildOnboardedState({ income: 0, bills: [], goal: null, monthlySave: 0 }, '2026-09-01')
    expect(s.transactions).toEqual([])
    expect(s.goals).toEqual([])
  })
})

describe('onboardingSummary', () => {
  it('summarises the answers for the review screen', () => {
    expect(onboardingSummary(answers)).toEqual({
      income: 25000,
      billTotal: 8000,
      monthlySave: 3000,
      freeToSpend: 14000,
      goal: answers.goal,
    })
  })

  it('never reports a negative free-to-spend', () => {
    const s = onboardingSummary({ income: 5000, bills: [{ name: 'Rent', amount: 8000 }], monthlySave: 0 })
    expect(s.freeToSpend).toBe(0)
  })
})
