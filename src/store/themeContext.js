import { createContext, useContext } from 'react'

/** localStorage key — kept well away from the budget blob (`receiptly.v1`)
 *  so a theme change never touches financial data. */
export const THEME_KEY = 'receiptly.theme'

/** The three things the user can pick in Settings → Appearance. */
export const THEME_OPTIONS = ['light', 'dark', 'system']

export const ThemeContext = createContext(null)

/**
 * `pref`      — what the user chose: 'light' | 'dark' | 'system' (default 'system')
 * `resolved`  — what's actually on screen right now: 'light' | 'dark'
 * `setPref`   — change it; applies immediately and persists
 */
export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used inside <ThemeProvider>')
  return ctx
}

/** Read the stored preference (safe on private-mode / blocked storage). */
export function readStoredTheme() {
  try {
    const v = localStorage.getItem(THEME_KEY)
    return THEME_OPTIONS.includes(v) ? v : 'system'
  } catch {
    return 'system'
  }
}
