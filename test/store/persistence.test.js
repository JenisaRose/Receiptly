import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { SCHEMA_VERSION } from '../../src/data/seed'
import { migrate, persistence } from '../../src/store/persistence'

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2026-09-10T12:00:00'))
})
afterEach(() => vi.useRealTimers())

const base = (over) => ({
  schemaVersion: SCHEMA_VERSION,
  onboarded: true,
  demo: false,
  transactions: [],
  ...over,
})

describe('migrate', () => {
  it('rejects a non-object', () => {
    expect(migrate(null)).toBeNull()
    expect(migrate('nope')).toBeNull()
    expect(migrate(42)).toBeNull()
  })

  it('rejects an older schema version (forces a reseed)', () => {
    expect(migrate({ schemaVersion: 1, onboarded: true })).toBeNull()
    expect(migrate({ onboarded: true })).toBeNull() // missing → treated as v1
  })

  it('keeps a user’s own data no matter how old', () => {
    const raw = base({ transactions: [{ date: '2019-01-01', amount: -100 }] })
    expect(migrate(raw)).toBe(raw)
  })

  it('keeps demo data that is still fresh', () => {
    const raw = base({ demo: true, transactions: [{ date: '2026-09-05', amount: -100 }] })
    expect(migrate(raw)).toBe(raw)
  })

  it('drops stale demo data (nothing logged in ~45+ days)', () => {
    const raw = base({ demo: true, transactions: [{ date: '2026-06-01', amount: -100 }] })
    expect(migrate(raw)).toBeNull()
  })

  it('treats a legacy blob with no onboarded flag as demo', () => {
    const raw = { schemaVersion: SCHEMA_VERSION, transactions: [{ date: '2026-06-01', amount: -100 }] }
    expect(migrate(raw)).toBeNull() // stale demo
  })

  it('accepts a demo blob with no transactions yet', () => {
    const raw = base({ demo: true, transactions: [] })
    expect(migrate(raw)).toBe(raw)
  })
})

describe('persistence load/save round-trip', () => {
  it('saves and reloads a fresh blob', () => {
    const state = base({ transactions: [{ date: '2026-09-09', amount: -50 }] })
    persistence.save(state)
    expect(persistence.loadSync()).toEqual(state)
  })

  it('clear removes the blob', () => {
    persistence.save(base())
    persistence.clear()
    expect(persistence.loadSync()).toBeNull()
  })

  it('returns null when nothing is stored', () => {
    expect(persistence.loadSync()).toBeNull()
  })
})
