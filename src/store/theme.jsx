import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { THEME_KEY, ThemeContext, readStoredTheme } from './themeContext'

const META_LIGHT = '#ECE6FF'
const META_DARK = '#151320'

const prefersDark = () => {
  try {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  } catch {
    return false
  }
}
const prefersReducedMotion = () => {
  try {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  } catch {
    return false
  }
}

/** Write `data-theme` on <html> and keep the browser-chrome colour in step. */
function applyTheme(mode) {
  const root = document.documentElement
  root.setAttribute('data-theme', mode)
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', mode === 'dark' ? META_DARK : META_LIGHT)
}

/**
 * Owns the Light / Dark / System preference.
 *
 * - The preference persists in localStorage (`receiptly.theme`), separate
 *   from all budget data. No stored value → Light.
 * - "System" is an explicit choice that then tracks `prefers-color-scheme`
 *   live; it is never the default.
 * - The public marketing landing page (any route that isn't `/app…`) always
 *   renders light — it's a separate presentation experience.
 * - An explicit Light↔Dark switch gets a ~120ms colour cross-fade (never on
 *   load, never on a route change, and not at all under reduced-motion).
 */
export function ThemeProvider({ children }) {
  const { pathname } = useLocation()
  const inApp = pathname === '/app' || pathname.startsWith('/app/')

  const [pref, setPrefState] = useState(readStoredTheme)
  const [systemDark, setSystemDark] = useState(prefersDark)
  const animateNextRef = useRef(false)

  // keep "system" honest while the app is open
  useEffect(() => {
    let mq
    try {
      mq = window.matchMedia('(prefers-color-scheme: dark)')
    } catch {
      return
    }
    const onChange = (e) => setSystemDark(e.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  const resolved = !inApp ? 'light' : pref === 'system' ? (systemDark ? 'dark' : 'light') : pref

  useEffect(() => {
    if (animateNextRef.current && !prefersReducedMotion()) {
      const root = document.documentElement
      root.classList.add('theme-anim')
      const t = setTimeout(() => root.classList.remove('theme-anim'), 220)
      animateNextRef.current = false
      applyTheme(resolved)
      return () => clearTimeout(t)
    }
    animateNextRef.current = false
    applyTheme(resolved)
  }, [resolved])

  const setPref = useCallback((next) => {
    animateNextRef.current = true
    // self-clear if this change didn't move `resolved` (e.g. System→Dark while
    // the OS is already dark) so a later route change can't inherit the fade
    setTimeout(() => {
      animateNextRef.current = false
    }, 250)
    setPrefState(next)
    try {
      localStorage.setItem(THEME_KEY, next)
    } catch {
      /* private mode / storage blocked — still applies for this session */
    }
  }, [])

  const value = useMemo(() => ({ pref, resolved, setPref }), [pref, resolved, setPref])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
