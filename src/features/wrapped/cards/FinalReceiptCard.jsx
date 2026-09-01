import { useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { EXPORTERS, canShareFiles, shareReceipt } from '../../export/exporters'
import ReceiptArtboard from './ReceiptArtboard'

export default function FinalReceiptCard({ w, monthKey, monthLabel, onReplay, onClose }) {
  const captureRef = useRef(null)
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(false)
  const showShare = canShareFiles()

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
    <div className="w-full max-w-[380px]">
      {/* off-screen, transform-free copy that the PNG is captured from */}
      {createPortal(
        <div aria-hidden className="pointer-events-none fixed left-[-9999px] top-0">
          <ReceiptArtboard w={w} ref={captureRef} />
        </div>,
        document.body,
      )}

      <p className="mb-2 text-center font-hand text-[18px] font-bold">your receipt for {monthLabel} 🧾</p>

      <div className="max-h-[58vh] overflow-auto border-[2.5px] border-dashed border-ink/40 bg-white/40">
        <div className="flex min-w-[360px] justify-center p-2">
          <ReceiptArtboard w={w} />
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {showShare && (
          <button
            disabled={busy}
            onClick={() =>
              run(() => shareReceipt({ node: captureRef.current, monthKey, monthLabel }), 'share')
            }
            className="press flex-1 border-[3px] border-ink bg-ink py-2.5 font-display text-[13px] text-yellow shadow-[4px_4px_0_var(--color-sky)] disabled:opacity-50"
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
            className="press flex-1 border-[3px] border-ink bg-white py-2.5 font-display text-[13px] shadow-hard-sm disabled:opacity-50"
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
          className="flex-1 border-[3px] border-ink bg-white py-2.5 font-display text-[12px]"
        >
          ↻ replay
        </button>
        <button
          onClick={onClose}
          className="flex-1 border-[3px] border-ink bg-white py-2.5 font-display text-[12px]"
        >
          done
        </button>
      </div>
    </div>
  )
}
