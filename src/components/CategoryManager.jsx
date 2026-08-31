import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { BG, PALETTE } from '../lib/theme'
import { useBudget } from '../store/budgetContext'
import ConfirmDialog from './ConfirmDialog'

export default function CategoryManager() {
  const b = useBudget()
  const cats = b.spendableCategories
  const [editingId, setEditingId] = useState(null)
  const [adding, setAdding] = useState(false)
  const [confirmDel, setConfirmDel] = useState(null)
  const [reassignId, setReassignId] = useState(null)

  return (
    <section>
      <h3 className="mb-2 font-hand text-[19px] font-bold">categories</h3>
      <p className="mb-3 text-[11.5px] opacity-60">
        rename or recolour any of these. the ones you add can be deleted.
      </p>

      <div className="space-y-2">
        {cats.map((c) => {
          const count = b.categoryUsage(c.id)
          const isEditing = editingId === c.id
          const isReassigning = reassignId === c.id
          return (
            <div key={c.id} className="border-[2.5px] border-ink bg-white">
              <div className="flex items-center gap-2.5 px-3 py-2.5">
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink text-sm ${BG[c.color]}`}
                >
                  {c.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold">{c.label}</p>
                  <p className="text-[10.5px] opacity-55">
                    {count} transaction{count === 1 ? '' : 's'}
                    {c.isDefault ? ' · default' : ''}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingId(isEditing ? null : c.id)
                    setReassignId(null)
                  }}
                  className="border-2 border-ink bg-white px-2 py-1 text-[11px] font-bold active:bg-yellow"
                >
                  {isEditing ? 'close' : 'edit'}
                </button>
                {!c.isDefault && (
                  <button
                    aria-label={`Delete ${c.label}`}
                    onClick={() => {
                      setEditingId(null)
                      if (count > 0) setReassignId(isReassigning ? null : c.id)
                      else setConfirmDel(c)
                    }}
                    className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink bg-white text-[11px] font-bold leading-none active:bg-pink"
                  >
                    ✕
                  </button>
                )}
              </div>

              <AnimatePresence initial={false}>
                {isEditing && (
                  <Expand>
                    <CatForm
                      initial={c}
                      onCancel={() => setEditingId(null)}
                      onSave={(patch) => {
                        b.renameCategory({ id: c.id, ...patch })
                        setEditingId(null)
                      }}
                    />
                  </Expand>
                )}
                {isReassigning && (
                  <Expand>
                    <Reassign
                      category={c}
                      count={count}
                      options={cats.filter((o) => o.id !== c.id)}
                      onCancel={() => setReassignId(null)}
                      onConfirm={(toId) => {
                        b.deleteCategory({ id: c.id, reassignToId: toId })
                        setReassignId(null)
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
              <CatForm
                initial={{ label: '', emoji: '🏷️', color: 'lilac' }}
                onCancel={() => setAdding(false)}
                onSave={(patch) => {
                  b.addCategory(patch)
                  setAdding(false)
                }}
                saveLabel="add it"
              />
            </div>
          </Expand>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="press mt-2 w-full border-[2.5px] border-dashed border-ink bg-white py-2.5 font-display text-[12px]"
            style={{ '--press-x': '3px', '--press-y': '3px' }}
          >
            ＋ new category
          </button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmDel && (
          <ConfirmDialog
            title={`Delete ${confirmDel.label}?`}
            body="It has no transactions, so nothing gets reassigned."
            confirmLabel="delete"
            onConfirm={() => {
              b.deleteCategory({ id: confirmDel.id })
              setConfirmDel(null)
            }}
            onCancel={() => setConfirmDel(null)}
          />
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

function CatForm({ initial, onSave, onCancel, saveLabel = 'save' }) {
  const [label, setLabel] = useState(initial.label)
  const [emoji, setEmoji] = useState(initial.emoji)
  const [color, setColor] = useState(initial.color)

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
          placeholder="category name"
          aria-label="category name"
          className="min-w-0 flex-1 border-[2.5px] border-ink bg-white px-2.5 py-1.5 text-[13px] font-semibold"
        />
      </div>
      <div className="flex gap-1.5">
        {PALETTE.map((p) => (
          <button
            key={p}
            type="button"
            aria-label={p}
            onClick={() => setColor(p)}
            className={`h-7 w-7 border-[2.5px] ${BG[p]} ${
              color === p ? 'border-ink shadow-hard-xs' : 'border-ink/30'
            }`}
          />
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
          onClick={() => label.trim() && onSave({ label, emoji, color })}
          className="flex-1 border-[2.5px] border-ink bg-ink py-1.5 font-display text-[11px] text-yellow"
        >
          {saveLabel}
        </button>
      </div>
    </div>
  )
}

function Reassign({ category, count, options, onConfirm, onCancel }) {
  const [toId, setToId] = useState(options[0]?.id ?? null)
  return (
    <div className="space-y-2.5 border-t-[2.5px] border-dashed border-ink/25 p-3">
      <p className="text-[12px] font-semibold">
        {category.label} has {count} transaction{count === 1 ? '' : 's'}. Move{' '}
        {count === 1 ? 'it' : 'them'} to:
      </p>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <button
            key={o.id}
            onClick={() => setToId(o.id)}
            className={`border-[2px] border-ink px-2 py-1 text-[11px] font-bold ${
              toId === o.id ? 'bg-yellow shadow-hard-xs' : 'bg-white'
            }`}
          >
            {o.emoji} {o.label}
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
          onClick={() => toId && onConfirm(toId)}
          className="flex-1 border-[2.5px] border-ink bg-pink py-1.5 font-display text-[11px]"
        >
          move &amp; delete
        </button>
      </div>
    </div>
  )
}
