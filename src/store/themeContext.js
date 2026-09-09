import { createContext, useContext } from 'react'

/** localStorage key — kept well away from the budget blob (`receiptly.v1`)
 *  so a theme change never touches financial data. */
export const THEME_KEY = 'receiptly.theme'

/** The three things the user can pick in Settings → Appearance. */
export const THEME_OPTIONS = ['light', 'dark', 'system']

/** No saved preference → Light. Receiptly's light theme is the primary
 *  brand/design experience, so a first-time visitor sees it regardless of
 *  their device theme. `system` stays a deliberate, explicit opt-in. */
export const DEFAULT_THEME = 'light'

export const ThemeContext = createContext(null)

/**
 * `pref`      — what the user chose: 'light' | 'dark' | 'system' (default 'light')
 * `resolved`  — what's actually on screen right now: 'light' | 'dark'
 * `setPref`   — change it; applies immediately and persists
 */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}

/** Read the stored preference (safe on private-mode / blocked storage).
 *  Anything not explicitly one of the three options — including no value
 *  at all — falls back to the default (Light). */
export function readStoredTheme() {
  try {
    const v = localStorage.getItem(THEME_KEY)
    return THEME_OPTIONS.includes(v) ? v : DEFAULT_THEME
  } catch {
    return DEFAULT_THEME
  }
}
