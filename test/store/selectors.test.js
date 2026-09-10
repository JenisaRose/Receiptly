import { beforeEach, describe, expect, it } from 'vitest'
import {
  availableMonths,
  billSummary,
  budgetForMonth,
  categoryBreakdown,
  categoryUsage,
  envelopes,
  financials,
  monthContext,
  monthTransactions,
  safeToSpend,
  totalOut,
} from '../../src/store/selectors'
import { bill, goal, income, makeState, normalMonth, resetIds, tx } from '../fixtures'

beforeEach(resetIds)

describe('monthContext', () => {
  it('describes the current month', () => {
    const m = monthContext(normalMonth())
    expect(m).toMatchObject({
      key: '2026-09',
      year: 2026,
      monthNum: 9,
      label: 'September',
      longLabel: 'September 2026',
      daysInMonth: 30,
      isCurrent: true,
      isPast: false,
      dayOfMonth: 10,
      daysLeft: 20,
      goalSetAside: 1500,
    })
  })

  it('treats an earlier selected month as fully elapsed', () => {
    const m = monthContext(makeState({ today: '2026-09-10', selectedMonth: '2026-08' }))
    expect(m.isPast).toBe(true)
    expect(m.dayOfMonth).toBe(31) // August
    expect(m.daysLeft).toBe(0)
  })

  it('treats a later selected month as not started', () => {
    const m = monthContext(makeState({ today: '2026-09-10', selectedMonth: '2026-12' }))
    expect(m.isFuture).toBe(true)
    expect(m.dayOfMonth).toBe(0)
    expect(m.daysLeft).toBe(31) // December
  })

  it('never lets daysLeft hit zero for the current month (end of month)', () => {
    const m = monthContext(makeState({ today: '2026-02-28', selectedMonth: '2026-02' }))
    expect(m.daysInMonth).toBe(28)
    expect(m.daysLeft).toBe(1)
  })

  it('sums the monthly set-aside across every goal', () => {
    const state = makeState({
      goals: [goal({ monthly: 1000 }), goal({ monthly: 500 }), goal({ monthly: 250, target: 0 })],
    })
    expect(monthContext(state).goalSetAside).toBe(1750)
  })

  it('is zero with no goals', () => {
    expect(monthContext(makeState()).goalSetAside).toBe(0)
  })
})

describe('financials', () => {
  it('separates income from spending', () => {
    const f = financials(normalMonth())
    expect(f.income).toBe(20000)
    expect(f.spentSoFar).toBe(2520)
  })

  it('is all zero with no transactions', () => {
    const f = financials(makeState())
    expect(f.income).toBe(0)
    expect(f.spentSoFar).toBe(0)
    expect(f.spends).toHaveLength(0)
  })

  it('only counts the selected month', () => {
    const state = makeState({
      today: '2026-09-10',
      transactions: [
        tx('2026-08-20', 'food', 999),
        tx('2026-09-05', 'food', 100),
        tx('2026-10-01', 'food', 500),
      ],
    })
    expect(financials(state).spentSoFar).toBe(100)
  })
})

describe('safeToSpend', () => {
  it('is income minus upcoming bills, goal set-aside and spend, over days left', () => {
    const s = safeToSpend(normalMonth())
    // 20000 income − 500 upcoming wifi − 1500 goals = 18000 spendable
    expect(s.spendable).toBe(18000)
    // 18000 − 2520 spent = 15480 left, ÷ 20 days left ≈ 774
    expect(s.leftToSpend).toBe(15480)
    expect(s.safeToday).toBe(774)
  })

  it('is zero across the board with no data', () => {
    const s = safeToSpend(makeState())
    expect(s.spendable).toBe(0)
    expect(s.leftToSpend).toBe(0)
    expect(s.safeToday).toBe(0)
  })

  it('never goes negative when spending is over budget', () => {
    const state = makeState({
      transactions: [income('2026-09-01', 10000), tx('2026-09-05', 'food', 12000)],
    })
    const s = safeToSpend(state)
    expect(s.leftToSpend).toBe(-2000)
    expect(s.safeToday).toBe(0)
  })

  it('has no daily figure for a past month', () => {
    const state = makeState({
      today: '2026-09-10',
      selectedMonth: '2026-08',
      transactions: [income('2026-08-01', 15000), tx('2026-08-14', 'food', 4000)],
    })
    expect(safeToSpend(state).safeToday).toBeNull()
    expect(safeToSpend(state).leftToSpend).toBe(11000)
  })

  it('divides by the full month when a future month is selected', () => {
    const state = makeState({
      today: '2026-09-10',
      selectedMonth: '2026-11',
      transactions: [income('2026-11-01', 30000)],
    })
    const s = safeToSpend(state)
    expect(s.safeToday).toBeNull()
    expect(s.leftToSpend).toBe(30000)
  })
})

describe('billSummary', () => {
  it('splits paid, upcoming and next-7-days', () => {
    const b = billSummary(normalMonth())
    expect(b.billsTotal).toBe(6500)
    expect(b.upcomingTotal).toBe(500) // rent paid, wifi still due on the 15th
    expect(b.next7Total).toBe(500) // wifi is 5 days away
    expect(b.upcoming.map((x) => x.id)).toEqual(['wifi'])
  })

  it('counts every unpaid bill as upcoming for a non-current month', () => {
    const state = makeState({
      today: '2026-09-10',
      selectedMonth: '2026-11',
      bills: [bill({ id: 'a', amount: 1000, dueDay: 3 }), bill({ id: 'b', amount: 2000, dueDay: 20 })],
    })
    expect(billSummary(state).upcomingTotal).toBe(3000)
  })

  it('is empty when there are no bills', () => {
    const b = billSummary(makeState())
    expect(b.billsTotal).toBe(0)
    expect(b.next7Total).toBe(0)
  })
})

describe('categoryBreakdown / totalOut', () => {
  it('groups spending by category, biggest first', () => {
    const rows = categoryBreakdown(normalMonth(), 'month')
    expect(rows.map((r) => [r.id, r.spent])).toEqual([
      ['transport', 1070],
      ['food', 1050],
      ['fun', 400],
    ])
    expect(rows[0]).toMatchObject({ label: 'Transport', count: 1 })
    expect(totalOut(normalMonth(), 'month')).toBe(2520)
  })

  it('week scope only counts the trailing 7 days of the month', () => {
    const rows = categoryBreakdown(normalMonth(), 'week') // today = 10th → from the 4th
    expect(rows.map((r) => [r.id, r.spent])).toEqual([
      ['food', 600],
      ['fun', 400],
    ])
    expect(totalOut(normalMonth(), 'week')).toBe(1000)
  })

  it('is empty for a month with no spending', () => {
    expect(categoryBreakdown(makeState(), 'month')).toEqual([])
    expect(totalOut(makeState(), 'month')).toBe(0)
  })
})

describe('envelopes', () => {
  const withBudget = (budget, transactions) =>
    envelopes(makeState({ budget, transactions }))

  it('reports allocated / spent / remaining and an on-track status', () => {
    const [food] = withBudget({ food: 4000 }, [tx('2026-09-02', 'food', 1050)])
    expect(food).toMatchObject({ allocated: 4000, spent: 1050, remaining: 2950, status: 'ok' })
  })

  it('flags an envelope that is over its allocation', () => {
    const [food] = withBudget({ food: 500 }, [tx('2026-09-02', 'food', 1050)])
    expect(food).toMatchObject({ spent: 1050, remaining: -550, status: 'over' })
    expect(food.ratio).toBeCloseTo(2.1)
  })

  it('flags an envelope that is getting close (≥ 85%)', () => {
    const [food] = withBudget({ food: 1200 }, [tx('2026-09-02', 'food', 1050)])
    expect(food.status).toBe('close')
  })

  it('handles a zero allocation without dividing by zero', () => {
    const rows = withBudget({ food: 0 }, [])
    expect(rows[0]).toMatchObject({ allocated: 0, ratio: 0, status: 'ok' })
  })
})

describe('budgetForMonth', () => {
  it('layers a month override on top of the default plan', () => {
    const state = makeState({
      selectedMonth: '2026-09',
      budget: { food: 4000, transport: 2500 },
      budgetByMonth: { '2026-09': { food: 5500 } },
    })
    expect(budgetForMonth(state)).toMatchObject({ food: 5500, transport: 2500 })
  })
})

describe('availableMonths', () => {
  it('spans from the earliest transaction to three months ahead of now', () => {
    const state = makeState({
      today: '2026-09-10',
      transactions: [tx('2026-06-15', 'food', 100)],
    })
    const months = availableMonths(state)
    expect(months[0]).toBe('2026-06')
    expect(months.at(-1)).toBe('2026-12')
  })
})

describe('categoryUsage', () => {
  it('counts every transaction in a category across all months', () => {
    const state = makeState({
      transactions: [
        tx('2026-08-01', 'food', 100),
        tx('2026-09-01', 'food', 200),
        tx('2026-09-02', 'transport', 50),
      ],
    })
    expect(categoryUsage(state, 'food')).toBe(2)
    expect(categoryUsage(state, 'transport')).toBe(1)
    expect(categoryUsage(state, 'fun')).toBe(0)
  })
})

describe('monthTransactions', () => {
  it('returns the selected month newest-first', () => {
    const state = makeState({
      transactions: [tx('2026-09-01', 'food', 1), tx('2026-09-09', 'food', 2), tx('2026-08-30', 'food', 3)],
    })
    expect(monthTransactions(state).map((t) => t.date)).toEqual(['2026-09-09', '2026-09-01'])
  })
})
