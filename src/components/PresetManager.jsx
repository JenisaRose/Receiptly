import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { rupee } from '../lib/format'
import { BG } from '../lib/theme'
import { useBudget } from '../store/budgetContext'

/** Add / edit / remove the one-tap expense shortcuts. */
export default function PresetManager() {
  const b = useBudget()
  const presets = b.presets ?? []
  const cats = b.spendableCategories
  const [editingId, setEditingId] = useState(null)
  const [adding, setAdding] = useState(false)

  return (
    <section>
      <h3 className="mb-2 font-hand text-[19px] font-bold">quick-add presets ⚡</h3>
      <p className="mb-3 text-[11.5px] opacity-60">
        one-tap shortcuts for the expenses you log all the time. they show up on Today and in
        the log sheet.
      </p>

      <div className="space-y-2">
        {presets.map((p) => {
          const cat = b.categoryMap[p.categoryId]
          const isEditing = editingId === p.id
          return (
            <div key={p.id} className="border-[2.5px] border-ink bg-white">
              <div className="flex items-center gap-2.5 px-3 py-2.5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink text-sm ${
                    BG[cat?.color] ?? 'bg-white'
                  }`}
                >
                  {p.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold">{p.label}</p>
                  <p className="text-[10.5px] opacity-55">
                    {rupee(p.amount)} · {cat?.label ?? 'unknown category'}
                  </p>
                </div>
                <button
                  onClick={() => setEditingId(isEditing ? null : p.id)}
                  className="border-2 border-ink bg-white px-2 py-1 text-[11px] font-bold active:bg-yellow"
                >
                  {isEditing ? 'close' : 'edit'}
                </button>
                <button
                  aria-label={`Delete ${p.label}`}
                  onClick={() => {
                    setEditingId(null)
                    b.deletePreset(p.id)
                  }}
                  className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink bg-white text-[11px] font-bold leading-none active:bg-pink"
                >
                  ✕
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isEditing && (
                  <Expand>
                    <PresetForm
                      initial={p}
                      cats={cats}
                      onCancel={() => setEditingId(null)}
                      onSave={(patch) => {
                        b.updatePreset({ id: p.id, ...patch })
                        setEditingId(null)
                      }}
                    />
                  </Expand>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <AnimatePresence initial={false}>
        {adding ? (
          <Expand>
            <div className="mt-2 border-[2.5px] border-ink bg-white">
              <PresetForm
                initial={{ emoji: cats[0]?.emoji ?? '⚡', label: '', categoryId: cats[0]?.id, amount: '' }}
                cats={cats}
                saveLabel="add it"
                onCancel={() => setAdding(false)}
                onSave={(patch) => {
                  b.addPreset(patch)
                  setAdding(false)
                }}
              />
            </div>
          </Expand>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="press mt-2 w-full border-[2.5px] border-dashed border-ink bg-white py-2.5 font-display text-[12px]"
            style={{ '--press-x': '3px', '--press-y': '3px' }}
          >
            ＋ new preset
          </button>
        )}
      </AnimatePresence>
    </section>
  )
}

function Expand({ children }) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      {children}
    </motion.div>
  )
}

function PresetForm({ initial, cats, onSave, onCancel, saveLabel = 'save' }) {
  const [emoji, setEmoji] = useState(initial.emoji)
  const [label, setLabel] = useState(initial.label)
  const [categoryId, setCategoryId] = useState(initial.categoryId ?? cats[0]?.id)
  const [amount, setAmount] = useState(String(initial.amount ?? ''))

  const valid = label.trim() && Number(amount) > 0 && categoryId

  return (
    <div className="space-y-2.5 border-t-[2.5px] border-dashed border-ink/25 p-3">
      <div className="flex gap-2">
        <input
          value={emoji}
          onChange={(e) => setEmoji([...e.target.value].slice(-2).join(''))}
          aria-label="emoji"
          className="w-12 border-[2.5px] border-ink bg-white text-center text-lg"
        />
        <input
          autoFocus
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="what is it?"
          aria-label="preset label"
          className="min-w-0 flex-1 border-[2.5px] border-ink bg-white px-2.5 py-1.5 text-[13px] font-semibold"
        />
        <input
          type="number"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="₹"
          aria-label="preset amount"
          className="w-16 border-[2.5px] border-ink bg-white px-2 py-1.5 text-[13px] font-semibold"
        />
      </div>
      <div className="flex flex-wrap gap-1.5">
        {cats.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setCategoryId(c.id)
              if (!emoji.trim() || emoji === '⚡' || cats.some((x) => x.emoji === emoji)) {
                setEmoji(c.emoji)
              }
            }}
            className={`border-[2px] border-ink px-2 py-1 text-[11px] font-bold ${
              categoryId === c.id ? 'bg-yellow shadow-hard-xs' : 'bg-white'
            }`}
          >
            {c.emoji} {c.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 pt-0.5">
        <button
          onClick={onCancel}
          className="flex-1 border-[2.5px] border-ink bg-white py-1.5 font-display text-[11px]"
        >
          cancel
        </button>
        <button
          onClick={() => valid && onSave({ emoji, label, categoryId, amount: Number(amount) })}
          disabled={!valid}
          className="flex-1 border-[2.5px] border-ink bg-ink py-1.5 font-display text-[11px] text-yellow disabled:opacity-40"
        >
          {saveLabel}
        </button>
      </div>
    </div>
  )
}
