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
 * Everything the Install button needs. `deferredPrompt` is the real
 * `beforeinstallprompt` event where the browser fires it (Chrome / Edge /
 * Android). Safari and Firefox never fire it — the caller falls back to a
 * short explanation, with a platform-specific "Add to Home Screen" hint on
 * iOS. Nothing here ever blocks using Receiptly in the browser.
 */
export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [installed, setInstalled] = useState(isStandalone)
  const { platform, browser } = detect()

  useEffect(() => {
    function onBeforeInstallPrompt(e) {
      e.preventDefault()
      setDeferredPrompt(e)
    }
    function onInstalled() {
      setInstalled(true)
      setDeferredPrompt(null)
    }
    const standalone = window.matchMedia('(display-mode: standalone)')
    const onDisplayChange = (e) => e.matches && setInstalled(true)

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.addEventListener('appinstalled', onInstalled)
    standalone.addEventListener?.('change', onDisplayChange)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
      window.removeEventListener('appinstalled', onInstalled)
      standalone.removeEventListener?.('change', onDisplayChange)
    }
  }, [])

  async function promptInstall() {
    if (!deferredPrompt) return 'unavailable'
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
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
