import { beforeEach } from 'vitest'

// A minimal in-memory localStorage for the node-environment tests. Only
// `aiInsights.js` and `persistence.js` touch storage, and only through the
// standard get/set/remove/clear surface. The jsdom-environment tests get
// jsdom's own Storage — either way it's cleared before every test.
class MemoryStorage {
  #map = new Map()
  get length() {
    return this.#map.size
  }
  key(i) {
    return [...this.#map.keys()][i] ?? null
  }
  getItem(k) {
    return this.#map.has(k) ? this.#map.get(k) : null
  }
  setItem(k, v) {
    this.#map.set(String(k), String(v))
  }
  removeItem(k) {
    this.#map.delete(k)
  }
  clear() {
    this.#map.clear()
  }
}

if (!globalThis.localStorage) {
  globalThis.localStorage = new MemoryStorage()
}

beforeEach(() => {
  try {
    globalThis.localStorage.clear()
  } catch {
    /* some environments freeze storage — nothing to clear */
  }
})
