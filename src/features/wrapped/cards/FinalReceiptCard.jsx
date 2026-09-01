import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useReducedMotion } from 'framer-motion'
import { EXPORTERS, canShareFiles, shareReceipt } from '../../export/exporters'
import Bleed from '../Bleed'
import ReceiptArtboard from './ReceiptArtboard'

/**
 * CARD 7 — the finale. The receipt feeds down out of a printer lip, then the
 * Share / Download controls rise in once it's out. The slide + rise are CSS
 * animations (not rAF-driven) so a backgrounded tab still lands them in place.
 * The PNG is captured from an off-screen, transform-free copy so it's always
 * the whole receipt, never whatever's scrolled into view.
 */
export default function FinalReceiptCard({ w, monthKey, monthLabel, onReplay, onClose }) {
  const reduced = useReducedMotion()
  const captureRef = useRef(null)
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(false)
  // just gates the scroll/overflow swap — the motion itself is CSS
  const [printed, setPrinted] = useState(reduced)

  useEffect(() => {
    if (printed) return
    const t = setTimeout(() => setPrinted(true), 1150)
    return () => clearTimeout(t)
  }, [printed])

  async function run(fn, id) {
    setBusy(id)
    setError(false)
    try {
      await fn()
    } catch {
      setError(true)
    } finally {
      setBusy(null)
    }
  }

  return (
    <Bleed accent="bg-bg" className="flex flex-col">
      {/* off-screen, transform-free copy the PNG is captured from */}
      {createPortal(
        <div aria-hidden className="pointer-events-none fixed left-[-9999px] top-0">
          <ReceiptArtboard w={w} ref={captureRef} />
        </div>,
        document.body,
      )}

      {/* printer lip */}
      <div className="relative z-10 flex h-9 shrink-0 items-center justify-center border-b-[4px] border-ink bg-ink">
        <span className="h-1.5 w-24 rounded-full bg-white/30" />
      </div>

      {/* the feed area — clipped while printing, scrollable once out */}
      <div
        className={`relative flex-1 px-4 pt-4 ${
          printed ? 'overflow-y-auto pb-4' : 'overflow-hidden'
        }`}
      >
        <div className={`mx-auto w-full max-w-[360px] ${reduced ? '' : 'wrapped-print'}`}>
          <ReceiptArtboard w={w} />
        </div>
      </div>

      {/* controls rise in once the receipt is out */}
      <div
        className={`shrink-0 border-t-[3px] border-ink bg-bg p-3 ${
          reduced ? '' : 'wrapped-rise'
        }`}
      >
        <div className="flex flex-wrap gap-2">
          {canShareFiles() && (
            <button
              disabled={busy}
              onClick={() =>
                run(
                  () => shareReceipt({ node: captureRef.current, monthKey, monthLabel }),
                  'share',
                )
              }
              className="press min-w-[96px] flex-1 border-[3px] border-ink bg-ink py-2.5 font-display text-[13px] text-yellow shadow-[4px_4px_0_var(--color-sky)] disabled:opacity-50"
              style={{ '--press-x': '4px', '--press-y': '4px' }}
            >
              {busy === 'share' ? '…' : 'share'}
            </button>
          )}
          {EXPORTERS.map((exp) => (
            <button
              key={exp.id}
              disabled={busy}
              onClick={() => run(() => exp.run({ node: captureRef.current, monthKey }), exp.id)}
              className="press min-w-[96px] flex-1 border-[3px] border-ink bg-white py-2.5 font-display text-[13px] shadow-hard-sm disabled:opacity-50"
              style={{ '--press-x': '4px', '--press-y': '4px' }}
            >
              {busy === exp.id ? '…' : exp.label}
            </button>
          ))}
        </div>
        {error && (
          <p className="mt-1.5 text-center text-[12px] font-semibold text-pink">
            couldn’t make the image — try again
          </p>
        )}
        <div className="mt-2 flex gap-2">
          <button
            onClick={onReplay}
            className="flex-1 border-[3px] border-ink bg-white py-2 font-display text-[12px]"
          >
            ↻ replay
          </button>
          <button
            onClick={onClose}
            className="flex-1 border-[3px] border-ink bg-white py-2 font-display text-[12px]"
          >
            done
          </button>
        </div>
      </div>
    </Bleed>
  )
}
