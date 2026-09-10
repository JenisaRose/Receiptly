import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { useDialog } from '../hooks/useDialog'

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
  const dialogRef = useDialog(onCancel) // focus in/out + trap + Escape
  const confirmRef = useRef(onConfirm)
  useEffect(() => {
    confirmRef.current = onConfirm
  })

  // Enter confirms from anywhere in the dialog (except when a button is focused —
  // it fires its own click)
  useEffect(() => {
    const node = dialogRef.current
    if (!node) return
    const onKey = (e) => {
      if (e.key === 'Enter' && !(e.target instanceof HTMLButtonElement)) confirmRef.current()
    }
    node.addEventListener('keydown', onKey)
    return () => node.removeEventListener('keydown', onKey)
  }, [dialogRef])

  return (
    <motion.div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-scrim p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onCancel()}
    >
      <motion.div
        ref={dialogRef}
        role="alertdialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
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
            className="flex-1 border-[3px] border-ink bg-surface py-2.5 font-display text-[13px]"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            autoFocus
            onClick={onConfirm}
            className={`press flex-1 border-[3px] border-ink py-2.5 font-display text-[13px] ${
              tone === 'pink' ? 'bg-pink text-on-accent' : 'bg-invert text-yellow'
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
