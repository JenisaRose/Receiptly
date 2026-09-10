// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SCHEMA_VERSION } from '../../src/data/seed'
import { BudgetProvider } from '../../src/store/budget'
import { useBudget } from '../../src/store/budgetContext'

/**
 * Integration tests for the provider's actions — the place state actually
 * mutates. The store loads from localStorage on mount, so we seed a known
 * blob first and freeze the clock to the 10th.
 */

const SEED = {
  schemaVersion: SCHEMA_VERSION,
  demo: false,
  onboarded: true,
  clock: { todayISO: '2026-09-10' },
  ui: { selectedMonth: '2026-09' },
  categories: [
    { id: 'food', label: 'Food', emoji: '🍜', color: 'orange', isDefault: true },
    { id: 'fun', label: 'Fun', emoji: '✨', color: 'pink', isDefault: true },
    { id: 'income', label: 'Income', emoji: '💰', color: 'yellow', isDefault: true, kind: 'income' },
  ],
  transactions: [
    { id: 'aug', date: '2026-08-12', categoryId: 'food', name: 'Old lunch', amount: -200 },
    { id: 'inc', date: '2026-09-01', categoryId: 'income', name: 'Stipend', amount: 20000 },
    { id: 'sp1', date: '2026-09-04', categoryId: 'food', name: 'Groceries', amount: -800 },
  ],
  presets: [{ id: 'p-chai', emoji: '☕', label: 'Chai', categoryId: 'food', amount: 40 }],
  bills: [
    { id: 'rent', name: 'Rent', emoji: '🏠', amount: 6000, dueDay: 1, freq: 'monthly' },
    { id: 'wifi', name: 'Wifi', emoji: '📶', amount: 500, dueDay: 20, freq: 'monthly' },
  ],
  billPayments: { '2026-09': ['rent'] },
  budgets: { default: { food: 4000, fun: 1000 }, byMonth: {}, bufferRollover: 0 },
  goals: [{ id: 'trip', name: 'Trip', emoji: '🎯', saved: 5000, target: 30000, monthly: 1500 }],
  profile: { monthlyIncome: 20000, incomeKind: 'monthly' },
  monthSettings: {},
}

function mount() {
  return renderHook(() => useBudget(), { wrapper: BudgetProvider })
}

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-09-10T12:00:00'))
  localStorage.setItem('receiptly.v1', JSON.stringify(SEED))
})
afterEach(() => vi.useRealTimers())

describe('transactions', () => {
  it('logging an expense adds it and moves spent-so-far / safe-to-spend', () => {
    const { result } = mount()
    expect(result.current.spentSoFar).toBe(800)
    const before = result.current.safeToday

    act(() => result.current.addTransaction({ amount: 350, categoryId: 'food', name: 'Lunch' }))

    expect(result.current.spentSoFar).toBe(1150)
    expect(result.current.thisMonthEntries[0]).toMatchObject({ amount: -350, name: 'Lunch' })
    expect(result.current.safeToday).toBeLessThan(before)
  })

  it('deleting a transaction reverses it', () => {
    const { result } = mount()
    act(() => result.current.deleteTransaction('sp1'))
    expect(result.current.spentSoFar).toBe(0)
    expect(result.current.thisMonthEntries.find((t) => t.id === 'sp1')).toBeUndefined()
  })

  it('a quick-add preset logs its amount', () => {
    const { result } = mount()
    act(() => result.current.logPreset('p-chai'))
    expect(result.current.spentSoFar).toBe(840)
    expect(result.current.thisMonthEntries[0]).toMatchObject({ amount: -40, name: 'Chai' })
  })

  it('a split expense counts only the user’s share', () => {
    const { result } = mount()
    act(() =>
      result.current.addTransaction({
        amount: 400,
        categoryId: 'food',
        name: 'Dinner',
        split: { total: 1200, parts: 3 },
      }),
    )
    expect(result.current.spentSoFar).toBe(1200) // 800 + 400 share, not + 1200
    expect(result.current.thisMonthEntries[0].split).toEqual({ total: 1200, parts: 3 })
  })
})

describe('goals', () => {
  it('adding a goal raises the monthly set-aside and lowers spendable', () => {
    const { result } = mount()
    const spendableBefore = result.current.spendable
    act(() => result.current.addGoal({ name: 'Laptop', target: 60000, monthly: 2000 }))
    expect(result.current.goals).toHaveLength(2)
    expect(result.current.spendable).toBe(spendableBefore - 2000)
  })

  it('contributing and withdrawing move the saved total, clamped at zero', () => {
    const { result } = mount()
    act(() => result.current.contributeToGoal('trip', 1000))
    expect(result.current.goals[0].saved).toBe(6000)
    act(() => result.current.contributeToGoal('trip', -99999))
    expect(result.current.goals[0].saved).toBe(0)
  })

  it('updating a goal re-normalises the payload', () => {
    const { result } = mount()
    act(() => result.current.updateGoal({ id: 'trip', monthly: -50, target: '45000.9' }))
    expect(result.current.goals[0]).toMatchObject({ monthly: 0, target: 45001 })
  })

  it('deleting a goal removes it and its set-aside', () => {
    const { result } = mount()
    act(() => result.current.deleteGoal('trip'))
    expect(result.current.goals).toHaveLength(0)
    expect(result.current.setAside).toBe(0)
  })
})

describe('bills', () => {
  it('toggling a bill paid/unpaid moves the upcoming total', () => {
    const { result } = mount()
    expect(result.current.upcomingBillsTotal).toBe(500) // wifi, due the 20th
    act(() => result.current.toggleBillPaid('wifi'))
    expect(result.current.upcomingBillsTotal).toBe(0)
    act(() => result.current.toggleBillPaid('wifi'))
    expect(result.current.upcomingBillsTotal).toBe(500)
  })

  it('an autopay bill already past its due day is marked paid on add', () => {
    const { result } = mount()
    act(() => result.current.addBill({ name: 'Music', amount: 120, dueDay: 3, autopay: true }))
    const music = result.current.bills.find((b) => b.name === 'Music')
    expect(music.paid).toBe(true) // due day 3 ≤ today 10
  })
})

describe('envelopes & months', () => {
  it('rebalancing an envelope changes its allocation, floored at zero', () => {
    const { result } = mount()
    act(() => result.current.adjustEnvelope('food', 500))
    expect(result.current.envelopesResolved.find((e) => e.id === 'food').allocated).toBe(4500)
    act(() => result.current.adjustEnvelope('food', -99999))
    expect(result.current.envelopesResolved.find((e) => e.id === 'food').allocated).toBe(0)
  })

  it('stepping months stays within the available range', () => {
    const { result } = mount()
    act(() => result.current.stepMonth(-1))
    expect(result.current.month.key).toBe('2026-08')
    act(() => result.current.goToCurrentMonth())
    expect(result.current.month.key).toBe('2026-09')
  })
})

describe('onboarding reset', () => {
  it('restartOnboarding flips the onboarded flag without wiping data', () => {
    const { result } = mount()
    act(() => result.current.restartOnboarding())
    expect(result.current.onboarded).toBe(false)
    expect(result.current.transactions).toHaveLength(3) // data still there
  })
})
