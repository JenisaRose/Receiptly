import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { CATEGORIES } from '../data/seed'
import { useBudget } from '../store/budgetContext'

const PICKABLE = ['food', 'transport', 'home', 'fun', 'other']

/**
 * Rendered only while open (via <AnimatePresence> in AppShell), so it always
 * mounts with fresh form state.
 */
export default function LogExpenseModal({ onClose }) {
  const { addExpense } = useBudget()
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('food')
  const [note, setNote] = useState('')
  const [error, setError] = useState(false)

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  function submit(e) {
    e.preventDefault()
    const value = Number(amount)
    if (!value || value <= 0) {
      setError(true)
      return
    }
    addExpense({ amount: value, category, name: note.trim() })
    onClose()
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.form
        onSubmit={submit}
        className="w-full max-w-[380px] border-4 border-ink bg-bg p-5 shadow-hard-lg"
        initial={{ scale: 0.8, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        <h2 className="mb-3.5 font-display text-xl">log an expense ✏️</h2>

        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide">amount</label>
        <input
          autoFocus
          type="number"
          inputMode="numeric"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value)
            setError(false)
          }}
          placeholder="₹0"
          className={`mb-3.5 w-full border-[3px] bg-white px-3 py-2.5 font-display text-[22px] ${
            error ? 'border-pink' : 'border-ink'
          }`}
        />

        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide">category</label>
        <div className="mb-4 flex flex-wrap gap-1.5">
          {PICKABLE.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setCategory(id)}
              className={`flex items-center gap-1.5 border-[2.5px] border-ink px-2.5 py-1.5 text-[12px] font-bold ${
                category === id ? 'bg-yellow shadow-hard-xs' : 'bg-white'
              }`}
            >
              {CATEGORIES[id].emoji} {CATEGORIES[id].label}
            </button>
          ))}
        </div>

        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide">note</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="what was it?"
          className="mb-4 w-full border-[3px] border-ink bg-white px-3 py-2.5 text-[15px] font-semibold"
        />

        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 border-[3px] border-ink bg-white py-3 font-display text-[13px]"
          >
            cancel
          </button>
          <button
            type="submit"
            className="press flex-1 border-[3px] border-ink bg-ink py-3 font-display text-[13px] text-yellow shadow-[5px_5px_0_var(--color-pink)]"
            style={{ '--press-x': '5px', '--press-y': '5px' }}
          >
            add it
          </button>
        </div>
        {error && (
          <p className="mt-2 text-[12px] font-semibold text-pink">enter an amount above ₹0</p>
        )}
      </motion.form>
    </motion.div>
  )
}
