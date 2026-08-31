import { motion } from 'framer-motion'
import { useEffect } from 'react'

/**
 * A neubrutalist confirm modal. Render it inside an <AnimatePresence> so it can
 * animate out. `tone` colours the confirm button.
 */
export default function ConfirmDialog({
  title,
  body,
  confirmLabel = 'confirm',
  cancelLabel = 'cancel',
  tone = 'pink',
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onCancel()
      if (e.key === 'Enter') onConfirm()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onCancel, onConfirm])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/45 p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        role="alertdialog"
        aria-label={title}
        className="w-full max-w-[340px] border-4 border-ink bg-bg p-5 shadow-hard-lg"
        initial={{ scale: 0.8, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        <h2 className="font-display text-lg">{title}</h2>
        {body && <p className="mt-1.5 text-[13px] font-semibold opacity-75">{body}</p>}
        <div className="mt-4 flex gap-2.5">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 border-[3px] border-ink bg-white py-2.5 font-display text-[13px]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            className={`press flex-1 border-[3px] border-ink py-2.5 font-display text-[13px] ${
              tone === 'pink' ? 'bg-pink' : 'bg-ink text-yellow'
            } shadow-hard-sm`}
            style={{ '--press-x': '4px', '--press-y': '4px' }}
          >
            {confirmLabel}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}
