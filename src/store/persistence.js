import { SCHEMA_VERSION } from '../data/seed'

/**
 * The storage seam. Today this wraps localStorage; a later phase swaps the body
 * for an API client with the same interface without touching the store or the
 * screens.
 */

const KEY = 'receiptly.v1'

/**
 * Bring a persisted blob up to the current schema, or return null to force a
 * reseed when it is too old to migrate.
 */
export function migrate(raw) {
  if (!raw || typeof raw !== 'object') return null
  if ((raw.schemaVersion ?? 1) < SCHEMA_VERSION) {
    // v1 stored a different, flat shape — cheaper to reseed than to convert
    return null
  }
  return raw
}

export const persistence = {
  /** Synchronous read so the first paint has real data (localStorage is sync). */
  loadSync() {
    try {
      return migrate(JSON.parse(localStorage.getItem(KEY)))
    } catch {
      return null
    }
  },

  save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
    } catch {
      /* storage full or blocked — the app still works for this session */
    }
  },

  clear() {
    try {
      localStorage.removeItem(KEY)
    } catch {
      /* ignore */
    }
  },
}
