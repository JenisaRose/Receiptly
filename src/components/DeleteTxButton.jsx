import { AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { inr } from '../lib/format'
import { useBudget } from '../store/budgetContext'
import ConfirmDialog from './ConfirmDialog'

/** Small ✕ on a transaction row that confirms before deleting. */
export default function DeleteTxButton({ tx, monthAbbr, className = '' }) {
  const { deleteTransaction } = useBudget()
  const [confirming, setConfirming] = useState(false)

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirming(true)}
        aria-label={`Delete ${tx.name}`}
        className={`flex h-6 w-6 shrink-0 items-center justify-center border-[2px] border-ink bg-white text-[11px] font-bold leading-none transition-colors hover:bg-pink active:bg-pink ${className}`}
      >
        ✕
      </button>
      <AnimatePresence>
        {confirming && (
          <ConfirmDialog
            title="Delete this entry?"
            body={`${tx.name}${tx.split ? ` (your share of ₹${inr(tx.split.total)})` : ''} · ₹${inr(Math.abs(tx.amount))}${
              monthAbbr ? ` on ${Number(tx.date.slice(-2))} ${monthAbbr}` : ''
            }`}
            confirmLabel="delete"
            onConfirm={() => {
              deleteTransaction(tx.id)
              setConfirming(false)
            }}
            onCancel={() => setConfirming(false)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
