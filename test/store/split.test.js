import { beforeEach, describe, expect, it } from 'vitest'
import { buildTx } from '../../src/store/budgetCore'
import { splitNote } from '../../src/lib/format'
import { categoryBreakdown, envelopes, financials } from '../../src/store/selectors'
import { makeState, resetIds, tx } from '../fixtures'

beforeEach(resetIds)

describe('buildTx — split metadata', () => {
  const s = makeState({ today: '2026-09-10', selectedMonth: '2026-09' })

  it('stores the user’s share as a negative amount', () => {
    // ₹1,200 split 3 ways → the caller passes the ₹400 share as `amount`
    const t = buildTx(s, { categoryId: 'food', amount: 400, split: { total: 1200, parts: 3 } })
    expect(t.amount).toBe(-400)
    expect(t.split).toEqual({ total: 1200, parts: 3 })
  })

  it('keeps the total-bill metadata separate from the amount', () => {
    const t = buildTx(s, { categoryId: 'fun', amount: 500, split: { total: 2000, parts: 4 } })
    expect(t.amount).toBe(-500) // even though the bill was ₹2,000
    expect(t.split.total).toBe(2000)
  })

  it('allows an uneven share (amount need not equal total / parts)', () => {
    const t = buildTx(s, { categoryId: 'food', amount: 700, split: { total: 1800, parts: 3 } })
    expect(t.amount).toBe(-700) // paid a bigger share than 600
    expect(t.split).toEqual({ total: 1800, parts: 3 })
  })

  it('drops split metadata that is not a real ≥2-way split', () => {
    expect(buildTx(s, { categoryId: 'food', amount: 400, split: { total: 400, parts: 1 } }).split)
      .toBeUndefined()
    expect(buildTx(s, { categoryId: 'food', amount: 400, split: { total: 0, parts: 3 } }).split)
      .toBeUndefined()
  })
})

describe('splitNote', () => {
  it('formats the metadata for display', () => {
    expect(splitNote({ split: { parts: 4, total: 2400 } })).toBe('split ×4 · ₹2,400 total')
  })
})

describe('budget calculations use the share, not the full bill', () => {
  const state = makeState({
    today: '2026-09-10',
    selectedMonth: '2026-09',
    budget: { food: 3000 },
    transactions: [
      // your ₹400 share of a ₹1,200 dinner
      tx('2026-09-05', 'food', 400, { name: 'Dinner', split: { total: 1200, parts: 3 } }),
      tx('2026-09-06', 'food', 200, { name: 'Chai' }),
    ],
  })

  it('counts ₹400, not ₹1,200, toward spent-so-far', () => {
    expect(financials(state).spentSoFar).toBe(600)
  })

  it('counts ₹400 toward the category total', () => {
    expect(categoryBreakdown(state, 'month')[0]).toMatchObject({ id: 'food', spent: 600 })
  })

  it('counts ₹400 against the food envelope', () => {
    const [food] = envelopes(state)
    expect(food.spent).toBe(600)
    expect(food.remaining).toBe(2400)
  })
})
