import { beforeEach, describe, expect, it } from 'vitest'
import { EMPTY_FILTERS, filterTransactions, filtersActive, shortDate } from '../../src/store/search'
import { income, makeState, resetIds, tx } from '../fixtures'

beforeEach(resetIds)

const state = () =>
  makeState({
    today: '2026-09-15',
    selectedMonth: '2026-09',
    transactions: [
      income('2026-09-01', 20000),
      tx('2026-09-02', 'food', 250, { name: 'Zomato lunch' }),
      tx('2026-09-05', 'food', 1200, { name: 'Groceries' }),
      tx('2026-09-07', 'transport', 90, { name: 'Auto' }),
      tx('2026-08-20', 'food', 400, { name: 'Zomato dinner' }),
    ],
  })

describe('filtersActive', () => {
  it('is false for the empty filter set', () => {
    expect(filtersActive(EMPTY_FILTERS)).toBe(false)
  })
  it('is true once any filter is set', () => {
    expect(filtersActive({ ...EMPTY_FILTERS, query: 'z' })).toBe(true)
    expect(filtersActive({ ...EMPTY_FILTERS, categoryIds: ['food'] })).toBe(true)
    expect(filtersActive({ ...EMPTY_FILTERS, min: '100' })).toBe(true)
    expect(filtersActive({ ...EMPTY_FILTERS, allMonths: true })).toBe(true)
  })
})

describe('filterTransactions', () => {
  it('matches on the transaction name (this month only by default)', () => {
    const { rows, count, total } = filterTransactions(state(), { query: 'zomato' })
    expect(count).toBe(1) // August's Zomato dinner is excluded
    expect(rows[0].name).toBe('Zomato lunch')
    expect(total).toBe(250)
  })

  it('matches on the category label', () => {
    const { count } = filterTransactions(state(), { query: 'transport' })
    expect(count).toBe(1)
  })

  it('searches every month when allMonths is set', () => {
    const { count, total } = filterTransactions(state(), { query: 'zomato', allMonths: true })
    expect(count).toBe(2)
    expect(total).toBe(650)
  })

  it('filters by category', () => {
    const { count } = filterTransactions(state(), { categoryIds: ['food'] })
    expect(count).toBe(2) // this month's two food spends
  })

  it('filters by amount range (inclusive)', () => {
    const { rows } = filterTransactions(state(), { min: '100', max: '1000' })
    expect(rows.map((r) => r.name)).toEqual(['Zomato lunch']) // 250 only; 90 and 1200 excluded
  })

  it('never returns income, only spends', () => {
    const { rows } = filterTransactions(state(), { allMonths: true })
    expect(rows.every((r) => r.amount < 0)).toBe(true)
  })

  it('returns newest first and attaches the resolved category', () => {
    const { rows } = filterTransactions(state(), { categoryIds: ['food'] })
    expect(rows.map((r) => r.date)).toEqual(['2026-09-05', '2026-09-02'])
    expect(rows[0].cat.label).toBe('Food')
  })
})

describe('shortDate', () => {
  it('drops the year when it matches, keeps it otherwise', () => {
    expect(shortDate('2026-09-03', 2026)).toBe('3 Sep')
    expect(shortDate('2025-12-31', 2026)).toBe("31 Dec '25")
  })
})
