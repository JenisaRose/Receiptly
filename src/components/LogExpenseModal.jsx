import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { rupee } from '../lib/format'
import { slugId } from '../lib/slug'
import { PALETTE } from '../lib/theme'
import { useBudget } from '../store/budgetContext'

/**
 * Rendered only while open (via <AnimatePresence> in AppShell), so it always
 * mounts with fresh form state.
 */
export default function LogExpenseModal({ onClose }) {
  const b = useBudget()
  const { addTransaction, addCategory, addPreset, categories, categoryMap, spendableCategories } = b
  const presets = (b.presets ?? []).filter((p) => categoryMap[p.categoryId])

  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState(spendableCategories[0]?.id ?? 'food')
  const [note, setNote] = useState('')
  const [error, setError] = useState(false)
  const [newCat, setNewCat] = useState('')
  const [addingCat, setAddingCat] = useState(false)
  const [saveAsPreset, setSaveAsPreset] = useState(false)
  const [splitOn, setSplitOn] = useState(false)
  const [splitTotal, setSplitTotal] = useState('')
  const [splitParts, setSplitParts] = useState(2)

  function onSplitTotalChange(v) {
    setSplitTotal(v)
    const t = Number(v)
    if (t > 0) setAmount(String(Math.round(t / splitParts)))
  }
  function onSplitPartsChange(v) {
    const n = Math.max(2, Number(v) || 2)
    setSplitParts(n)
    const t = Number(splitTotal)
    if (t > 0) setAmount(String(Math.round(t / n)))
  }
  function toggleSplit(on) {
    setSplitOn(on)
    if (!on) {
      setSplitTotal('')
      setSplitParts(2)
    }
  }

  function applyPreset(p) {
    setAmount(String(p.amount))
    setCategory(p.categoryId)
    setNote(p.label)
    setError(false)
  }

  function createCategory() {
    const label = newCat.trim()
    if (!label) return
    const color = PALETTE[categories.length % PALETTE.length]
    addCategory({ label, emoji: '🏷️', color })
    setCategory(slugId(label, categories))
    setNewCat('')
    setAddingCat(false)
  }

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
    const split =
      splitOn && Number(splitTotal) > 0 ? { total: Number(splitTotal), parts: splitParts } : undefined
    addTransaction({ amount: value, categoryId: category, name: note.trim(), split })
    if (saveAsPreset) {
      addPreset({
        emoji: categoryMap[category]?.emoji ?? '⚡',
        label: note.trim() || categoryMap[category]?.label || 'Quick add',
        categoryId: category,
        amount: value,
      })
    }
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
        className="max-h-[92vh] w-full max-w-[380px] overflow-y-auto border-4 border-ink bg-bg p-5 shadow-hard-lg"
        initial={{ scale: 0.8, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22 }}
      >
        <h2 className="mb-3.5 font-display text-xl">log an expense ✏️</h2>

        {presets.length > 0 && (
          <>
            <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide">
              quick picks
            </label>
            <div className="mb-4 flex flex-wrap gap-1.5">
              {presets.map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="border-[2.5px] border-ink bg-white px-2 py-1 text-[11.5px] font-bold active:bg-yellow"
                >
                  {p.emoji} {p.label} · {rupee(p.amount)}
                </button>
              ))}
            </div>
          </>
        )}

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
          className={`mb-1.5 w-full border-[3px] bg-white px-3 py-2.5 font-display text-[22px] ${
            error ? 'border-pink' : 'border-ink'
          }`}
        />

        <label className="mb-3.5 flex cursor-pointer items-center gap-2 text-[12px] font-semibold">
          <input
            type="checkbox"
            checked={splitOn}
            onChange={(e) => toggleSplit(e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          🔀 split this with others
        </label>

        {splitOn && (
          <div className="mb-3.5 space-y-1.5 border-[2.5px] border-dashed border-ink/40 p-2.5">
            <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-semibold">
              <span className="opacity-60">total bill</span>
              <span className="opacity-50">₹</span>
              <input
                type="number"
                inputMode="numeric"
                value={splitTotal}
                onChange={(e) => onSplitTotalChange(e.target.value)}
                placeholder="1,200"
                className="w-20 border-2 border-ink bg-white px-2 py-1"
              />
              <span className="opacity-60">split</span>
              <input
                type="number"
                inputMode="numeric"
                min={2}
                value={splitParts}
                onChange={(e) => onSplitPartsChange(e.target.value)}
                className="w-12 border-2 border-ink bg-white px-2 py-1"
              />
              <span className="opacity-60">ways</span>
            </div>
            <p className="text-[11px] font-semibold opacity-65">
              your share: {amount ? rupee(Number(amount)) : '—'} — tweak the amount above if it
              isn't an even split
            </p>
          </div>
        )}

        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide">category</label>
        <div className="mb-2 flex flex-wrap gap-1.5">
          {spendableCategories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setCategory(c.id)}
              className={`flex items-center gap-1.5 border-[2.5px] border-ink px-2.5 py-1.5 text-[12px] font-bold ${
                category === c.id ? 'bg-yellow shadow-hard-xs' : 'bg-white'
              }`}
            >
              {c.emoji} {c.label}
            </button>
          ))}
          {!addingCat && (
            <button
              type="button"
              onClick={() => setAddingCat(true)}
              className="border-[2.5px] border-dashed border-ink px-2.5 py-1.5 text-[12px] font-bold"
            >
              ＋ new
            </button>
          )}
        </div>
        {addingCat && (
          <div className="mb-2 flex gap-1.5">
            <input
              autoFocus
              value={newCat}
              onChange={(e) => setNewCat(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  createCategory()
                }
              }}
              placeholder="category name"
              className="min-w-0 flex-1 border-[2.5px] border-ink bg-white px-2.5 py-1.5 text-[12px] font-semibold"
            />
            <button
              type="button"
              onClick={createCategory}
              className="border-[2.5px] border-ink bg-ink px-3 font-display text-[11px] text-yellow"
            >
              add
            </button>
          </div>
        )}
        <p className="mb-4 text-[10.5px] opacity-45">manage categories in settings</p>

        <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wide">note</label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="what was it?"
          className="mb-3 w-full border-[3px] border-ink bg-white px-3 py-2.5 text-[15px] font-semibold"
        />

        <label className="mb-4 flex cursor-pointer items-center gap-2 text-[12px] font-semibold">
          <input
            type="checkbox"
            checked={saveAsPreset}
            onChange={(e) => setSaveAsPreset(e.target.checked)}
            className="h-4 w-4 accent-ink"
          />
          save this as a quick-add ⚡
        </label>

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
