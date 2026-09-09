import { useEffect, useState } from 'react'
import { useInstallPrompt } from './useInstallPrompt'

/** Hidden on-page PWA diagnostics. Renders only with `?pwadebug` in the URL
 *  — a way to read installability state on a deployment without DevTools.
 *  Not part of the design; safe to leave in. */
export default function PwaDebug() {
  const on =
    typeof window !== 'undefined' && new URLSearchParams(window.location.search).has('pwadebug')
  const { canInstall, installed, promptInstall, platform, browser } = useInstallPrompt()
  const [d, setD] = useState(null)

  useEffect(() => {
    if (!on) return
    let alive = true
    async function run() {
      const out = {}
      out.origin = location.origin
      out.log = window.__pwa?.log ?? ['(inline capture script not present)']
      out.beforeinstallpromptFired = (window.__pwa?.log ?? []).some((l) =>
        l.includes('beforeinstallprompt captured'),
      )
      out.deferredPromptStored = !!window.__pwa?.deferredPrompt
      out.standalone =
        matchMedia('(display-mode: standalone)').matches || navigator.standalone === true
      try {
        const link = document.querySelector('link[rel="manifest"]')?.href
        out.manifestUrl = link
        const r = await fetch(link, { cache: 'no-store' })
        out.manifestStatus = r.status
        out.manifestType = r.headers.get('content-type')
        const text = await r.text()
        try {
          const j = JSON.parse(text)
          out.manifestParsed = true
          out.manifestName = j.name
          out.manifestIcons = (j.icons ?? []).map((i) => `${i.sizes} ${i.type} ${i.purpose ?? ''}`)
        } catch {
          out.manifestParsed = false
          out.manifestBodyStart = text.slice(0, 60)
        }
      } catch (e) {
        out.manifestError = String(e)
      }
      try {
        const reg = await navigator.serviceWorker.getRegistration()
        out.sw = reg
          ? {
              scope: reg.scope,
              active: reg.active?.state,
              controlling: !!navigator.serviceWorker.controller,
              scriptURL: reg.active?.scriptURL,
            }
          : 'no registration'
      } catch (e) {
        out.swError = String(e)
      }
      if (navigator.getInstalledRelatedApps) {
        try {
          out.installedRelatedApps = await navigator.getInstalledRelatedApps()
        } catch (e) {
          out.installedRelatedApps = String(e)
        }
      }
      if (alive) setD(out)
    }
    run()
    const iv = setInterval(run, 2500)
    return () => {
      alive = false
      clearInterval(iv)
    }
  }, [on])

  if (!on) return null

  return (
    <div className="fixed bottom-3 left-3 right-3 z-[9999] max-h-[70vh] overflow-auto rounded-lg border-2 border-ink bg-white p-3 font-mono text-[10.5px] leading-tight text-ink shadow-hard-sm sm:right-auto sm:max-w-[440px]">
      <div className="mb-1 flex items-center justify-between font-bold">
        <span>PWA DEBUG</span>
        <span>
          {platform}/{browser} · canInstall={String(canInstall)} · installed={String(installed)}
        </span>
      </div>
      <button
        onClick={() => promptInstall().then((o) => alert('prompt() outcome: ' + o))}
        className="mb-2 border border-ink bg-yellow px-2 py-0.5 font-bold"
      >
        call prompt() now
      </button>
      <pre className="whitespace-pre-wrap break-all">{JSON.stringify(d, null, 1)}</pre>
    </div>
  )
}
