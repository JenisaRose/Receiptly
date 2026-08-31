import { motion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useBudget } from '../../store/budgetContext'
import { EXPORTERS, canShareFiles, shareReceipt } from './exporters'
import ReceiptCard from './ReceiptCard'

export default function ShareReceiptModal({ onClose }) {
  const b = useBudget()
  const cardRef = useRef(null)
  const [busy, setBusy] = useState(null)
  const [error, setError] = useState(false)
  const showShare = canShareFiles()

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

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
    <>
      {/* The node that actually gets captured: real 360px, off-screen, and
          outside every entrance transform so the PNG is never scaled. */}
      <div aria-hidden className="pointer-events-none fixed left-[-9999px] top-0 -z-10">
        <ReceiptCard ref={cardRef} />
      </div>

      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-ink/45 p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          className="my-auto w-full max-w-[420px] border-4 border-ink bg-bg p-4 shadow-hard-lg sm:p-5"
          initial={{ scale: 0.85, y: 12 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        >
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-display text-lg">share this month 🧾</h2>
            <button
              onClick={onClose}
              aria-label="Close"
              className="flex h-8 w-8 items-center justify-center border-[2.5px] border-ink bg-white text-[13px] font-bold active:bg-pink"
            >
              ✕
            </button>
          </div>

          {/* on-screen preview — free to be scaled/animated by the modal */}
          <div className="mb-4 max-h-[55vh] overflow-auto border-[2.5px] border-dashed border-ink/30">
            <div className="flex min-w-[360px] justify-center p-2">
              <ReceiptCard />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {showShare && (
              <button
                disabled={busy}
                onClick={() =>
                  run(
                    () =>
                      shareReceipt({
                        node: cardRef.current,
                        monthKey: b.month.key,
                        monthLabel: b.month.longLabel,
                      }),
                    'share',
                  )
                }
                className="press flex-1 border-[3px] border-ink bg-ink py-3 font-display text-[13px] text-yellow shadow-[5px_5px_0_var(--color-sky)] disabled:opacity-50"
                style={{ '--press-x': '5px', '--press-y': '5px' }}
              >
                {busy === 'share' ? '…' : 'share'}
              </button>
            )}
            {EXPORTERS.map((exp) => (
              <button
                key={exp.id}
                disabled={busy}
                onClick={() =>
                  run(() => exp.run({ node: cardRef.current, monthKey: b.month.key }), exp.id)
                }
                className="press flex-1 border-[3px] border-ink bg-white py-3 font-display text-[13px] shadow-hard-sm disabled:opacity-50"
                style={{ '--press-x': '4px', '--press-y': '4px' }}
              >
                {busy === exp.id ? '…' : exp.label}
              </button>
            ))}
          </div>
          {error && (
            <p className="mt-2 text-[12px] font-semibold text-pink">
              couldn’t make the image — try again
            </p>
          )}
        </motion.div>
      </motion.div>
    </>
  )
}
