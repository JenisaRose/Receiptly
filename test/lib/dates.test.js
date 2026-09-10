import { describe, expect, it } from 'vitest'
import {
  addDays,
  daysInMonth,
  monthLabel,
  monthLongLabel,
  monthRange,
  shiftMonth,
  todayISO,
  weekdayMon0,
} from '../../src/lib/dates'

describe('daysInMonth', () => {
  it('knows the length of each month', () => {
    expect(daysInMonth('2026-01')).toBe(31)
    expect(daysInMonth('2026-04')).toBe(30)
    expect(daysInMonth('2026-02')).toBe(28)
  })

  it('handles leap Februaries', () => {
    expect(daysInMonth('2024-02')).toBe(29)
    expect(daysInMonth('2000-02')).toBe(29)
    expect(daysInMonth('2100-02')).toBe(28)
  })
})

describe('shiftMonth', () => {
  it('moves forward and back within a year', () => {
    expect(shiftMonth('2026-08', 1)).toBe('2026-09')
    expect(shiftMonth('2026-08', -1)).toBe('2026-07')
  })

  it('rolls over year boundaries in both directions', () => {
    expect(shiftMonth('2026-12', 1)).toBe('2027-01')
    expect(shiftMonth('2026-01', -1)).toBe('2025-12')
    expect(shiftMonth('2026-06', -12)).toBe('2025-06')
    expect(shiftMonth('2026-06', 18)).toBe('2027-12')
  })
})

describe('monthRange', () => {
  it('is an inclusive list of month keys', () => {
    expect(monthRange('2026-08', '2026-11')).toEqual(['2026-08', '2026-09', '2026-10', '2026-11'])
  })

  it('returns a single month when from === to', () => {
    expect(monthRange('2026-08', '2026-08')).toEqual(['2026-08'])
  })
})

describe('addDays', () => {
  it('crosses month and year boundaries', () => {
    expect(addDays('2026-08-30', 3)).toBe('2026-09-02')
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31')
  })

  it('is timezone-safe (anchors at noon UTC)', () => {
    expect(addDays('2026-03-15', 0)).toBe('2026-03-15')
    expect(addDays('2026-03-15', 30)).toBe('2026-04-14')
  })
})

describe('weekdayMon0', () => {
  it('returns Monday = 0 … Sunday = 6', () => {
    expect(weekdayMon0('2026-09-07')).toBe(0) // a Monday
    expect(weekdayMon0('2026-09-13')).toBe(6) // the following Sunday
  })
})

describe('labels', () => {
  it('formats month keys', () => {
    expect(monthLabel('2026-09')).toBe('September')
    expect(monthLongLabel('2026-09')).toBe('September 2026')
  })
})

describe('todayISO', () => {
  it('formats a Date as YYYY-MM-DD', () => {
    expect(todayISO(new Date(2026, 8, 5))).toBe('2026-09-05')
  })
})
