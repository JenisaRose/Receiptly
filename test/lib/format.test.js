import { describe, expect, it } from 'vitest'
import { clamp, inr, ordinal, rupee, splitNote } from '../../src/lib/format'

describe('rupee / inr', () => {
  it('formats with the rupee sign and Indian digit grouping', () => {
    expect(rupee(8240)).toBe('₹8,240')
    expect(rupee(1200000)).toBe('₹12,00,000')
    expect(inr(52340)).toBe('52,340')
  })

  it('rounds to whole rupees', () => {
    expect(rupee(99.6)).toBe('₹100')
    expect(rupee(0)).toBe('₹0')
  })
})

describe('clamp', () => {
  it('keeps a number inside [min, max]', () => {
    expect(clamp(5, 0, 10)).toBe(5)
    expect(clamp(-3, 0, 10)).toBe(0)
    expect(clamp(42, 0, 10)).toBe(10)
  })
})

describe('ordinal', () => {
  it('adds the right suffix', () => {
    expect(ordinal(1)).toBe('1st')
    expect(ordinal(2)).toBe('2nd')
    expect(ordinal(3)).toBe('3rd')
    expect(ordinal(4)).toBe('4th')
    expect(ordinal(11)).toBe('11th')
    expect(ordinal(21)).toBe('21st')
    expect(ordinal(23)).toBe('23rd')
  })
})

describe('splitNote', () => {
  it('describes a split transaction', () => {
    const tx = { split: { parts: 3, total: 1200 } }
    expect(splitNote(tx)).toBe('split ×3 · ₹1,200 total')
  })

  it('is null for a normal transaction', () => {
    expect(splitNote({ amount: -400 })).toBeNull()
  })
})
