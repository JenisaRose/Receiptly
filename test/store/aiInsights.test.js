import { beforeEach, describe, expect, it } from 'vitest'
import { composeAiSummary, generateAiSummary, cachedAiSummary } from '../../src/store/aiInsights'
import { derive } from '../../src/store/budgetCore'
import { goal, income, makeState, resetIds, tx } from '../fixtures'

beforeEach(resetIds)

/** The object screens pass to composeAiSummary — state + derived selectors. */
function budgetView(state) {
  return { ...state, ...derive(state) }
}

describe('composeAiSummary — a local, deterministic recap (no LLM)', () => {
  const b = budgetView(
    makeState({
      today: '2026-09-10',
      budget: { food: 5000, transport: 3000 },
      goals: [goal({ name: 'Trip', monthly: 1500, target: 30000, saved: 6000 })],
      transactions: [income('2026-09-01', 20000), tx('2026-09-03', 'food', 2700)],
    }),
  )

  it('returns a non-empty string synchronously', () => {
    const text = composeAiSummary(b)
    expect(typeof text).toBe('string')
    expect(text.length).toBeGreaterThan(20)
  })

  it('is stable for the same inputs + variant', () => {
    expect(composeAiSummary(b, 0)).toBe(composeAiSummary(b, 0))
    expect(composeAiSummary(b, 3)).toBe(composeAiSummary(b, 3))
  })

  it('mentions the forecast framing when the month is running hot', () => {
    const hot = budgetView(
      makeState({
        today: '2026-09-10',
        budget: { food: 5000, transport: 3000 },
        transactions: [income('2026-09-01', 20000), tx('2026-09-03', 'food', 5000)],
      }),
    )
    // projected ≈ 15000 vs an 8000 plan
    expect(composeAiSummary(hot)).toMatch(/over your .* plan|running hot|past plan/)
  })

  it('speaks about "early days" before there is a forecast', () => {
    const early = budgetView(
      makeState({
        today: '2026-09-02',
        transactions: [income('2026-09-01', 20000), tx('2026-09-02', 'food', 300)],
      }),
    )
    expect(composeAiSummary(early)).toMatch(/early days|just getting started/)
  })

  it('closes on goal progress when goals exist', () => {
    expect(composeAiSummary(b)).toMatch(/goals|Trip/)
  })
})

describe('generateAiSummary — per-month cache', () => {
  const b = budgetView(
    makeState({ today: '2026-09-10', transactions: [income('2026-09-01', 20000), tx('2026-09-03', 'food', 900)] }),
  )

  it('caches the text for the month', () => {
    const text = generateAiSummary('2026-09', b)
    expect(cachedAiSummary('2026-09')).toEqual({ text, variant: 0 })
  })

  it('regenerate advances the variant', () => {
    generateAiSummary('2026-09', b)
    generateAiSummary('2026-09', b, { regenerate: true })
    expect(cachedAiSummary('2026-09').variant).toBe(1)
  })
})
