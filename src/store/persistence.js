import { SCHEMA_VERSION } from '../data/seed'
import { addDays, todayISO } from '../lib/dates'

/**
 * The storage seam. Today this wraps localStorage; a later phase swaps the body
 * for an API client with the same interface without touching the store or the
 * screens.
 */

const KEY = 'receiptly.v1'
const STALE_AFTER_DAYS = 45

/**
 * Bring a persisted blob up to the current schema, or return null to force a
 * reseed — when the schema is too old, or when the demo data has gone stale
 * (nothing logged in weeks) so it always feels current.
 */
export function migrate(raw) {
  if (!raw || typeof raw !== 'object') return null
  if ((raw.schemaVersion ?? 1) < SCHEMA_VERSION) return null

  // Seeded demo data reseeds once it goes stale so it always feels current.
  // A user's own data (they've been through onboarding) is never auto-wiped;
  // legacy blobs with no `onboarded` flag were auto-seeded, so treat as demo.
  const isDemo = raw.demo ?? raw.onboarded === undefined
  if (isDemo) {
    const newest = (raw.transactions ?? []).reduce((max, t) => (t.date > max ? t.date : max), '')
    if (newest && newest < addDays(todayISO(), -STALE_AFTER_DAYS)) return null
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
