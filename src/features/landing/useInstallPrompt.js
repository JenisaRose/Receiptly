import { useEffect, useState } from 'react'

function detect() {
  if (typeof navigator === 'undefined') return { platform: 'other', browser: 'other' }
  const ua = navigator.userAgent || ''
  const isIOS =
    /iphone|ipad|ipod/i.test(ua) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const isAndroid = /android/i.test(ua)
  const isFirefox = /firefox|fxios/i.test(ua)
  const isSafari = /safari/i.test(ua) && !/chrome|crios|android|edg/i.test(ua)
  const isChromium = /chrome|crios|chromium|edg/i.test(ua) && !isFirefox

  return {
    platform: isIOS ? 'ios' : isAndroid ? 'android' : 'desktop',
    browser: isFirefox ? 'firefox' : isSafari ? 'safari' : isChromium ? 'chromium' : 'other',
  }
}

function isStandalone() {
  try {
    return (
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: minimal-ui)').matches ||
      window.navigator.standalone === true
    )
  } catch {
    return false
  }
}

/**
 * Everything the Install button needs. The real `beforeinstallprompt` event
 * (Chrome / Edge / Android) is captured by an inline script in index.html
 * *before* this bundle loads — Chrome fires it early and only once — and
 * parked on `window.__pwa`. This hook reads it on mount and also listens
 * for later events. Safari / Firefox never fire it; the caller falls back
 * to a short explanation. Nothing here ever blocks using Receiptly.
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(
    () => (typeof window !== 'undefined' && window.__pwa?.deferredPrompt) || null,
  )
  const [installed, setInstalled] = useState(
    () => isStandalone() || (typeof window !== 'undefined' && !!window.__pwa?.installed),
  )
  const { platform, browser } = detect()

  useEffect(() => {
    function syncFromGlobal() {
      setDeferredPrompt(window.__pwa?.deferredPrompt ?? null)
    }
    // catch an event captured in the gap between render and this effect
    if (window.__pwa?.deferredPrompt) queueMicrotask(syncFromGlobal)

    function onBeforeInstallPrompt(e) {
      e.preventDefault()
      if (window.__pwa) window.__pwa.deferredPrompt = e
      setDeferredPrompt(e)
    }
    function onInstalled() {
      if (window.__pwa) window.__pwa.deferredPrompt = null
      setInstalled(true)
      setDeferredPrompt(null)
    }
    const standalone = window.matchMedia('(display-mode: standalone)')
    const onDisplayChange = (e) => e.matches && setInstalled(true)

    window.addEventListener('pwa:installable', syncFromGlobal)
    window.addEventListener('pwa:installed', onInstalled)
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)
    standalone.addEventListener?.('change', onDisplayChange)
    return () => {
      window.removeEventListener('pwa:installable', syncFromGlobal)
      window.removeEventListener('pwa:installed', onInstalled)
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      standalone.removeEventListener?.('change', onDisplayChange)
    }
  }, [])

  async function promptInstall() {
    const dp = deferredPrompt || window.__pwa?.deferredPrompt
    if (!dp) return 'unavailable'
    dp.prompt()
    const { outcome } = await dp.userChoice
    if (window.__pwa) window.__pwa.deferredPrompt = null
    setDeferredPrompt(null)
    return outcome
  }

  // a short instruction for browsers that can't be prompted programmatically
  let manualHint = null
  if (!installed && !deferredPrompt) {
    if (platform === 'ios' && browser === 'safari') {
      manualHint = 'On iPhone or iPad: tap the Share button, then “Add to Home Screen”.'
    } else if (platform === 'android' && browser === 'firefox') {
      manualHint = 'In Firefox: open the menu (⋮), then “Install” or “Add to Home Screen”.'
    } else if (browser === 'firefox') {
      manualHint = "Firefox doesn't install web apps — Receiptly still works normally in the tab."
    }
  }

  return {
    canInstall: !!deferredPrompt,
    installed,
    promptInstall,
    platform,
    browser,
    manualHint,
  }
}
