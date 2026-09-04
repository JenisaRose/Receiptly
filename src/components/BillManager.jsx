import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { ordinal, rupee } from '../lib/format'
import { useBudget } from '../store/budgetContext'

/** Add / edit / remove recurring bills, and turn autopay on or off. */
export default function BillManager() {
  const b = useBudget()
  const bills = b.bills
  const [editingId, setEditingId] = useState(null)
  const [adding, setAdding] = useState(false)

  return (
    <section>
      <h3 className="mb-2 font-hand text-[19px] font-bold">recurring bills 🔁</h3>
      <p className="mb-3 text-[11.5px] opacity-60">
        rent, subscriptions, anything that repeats monthly. turn on autopay and a bill marks
        itself paid the day it's due — no tap needed.
      </p>

      <div className="space-y-2">
        {bills.map((bill) => {
          const isEditing = editingId === bill.id
          return (
            <div key={bill.id} className="border-[2.5px] border-ink bg-white">
              <div className="flex items-center gap-2.5 px-3 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-sky text-sm">
                  {bill.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold">{bill.name}</p>
                  <p className="text-[10.5px] opacity-55">
                    {rupee(bill.amount)} · due the {ordinal(bill.dueDay)}
                    {bill.autopay ? ' · autopay on' : ''}
                  </p>
                </div>
                <button
                  onClick={() => setEditingId(isEditing ? null : bill.id)}
                  className="border-2 border-ink bg-white px-2 py-1 text-[11px] font-bold active:bg-yellow"
                >
                  {isEditing ? 'close' : 'edit'}
                </button>
                <button
                  aria-label={`Delete ${bill.name}`}
                  onClick={() => b.deleteBill(bill.id)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink bg-white text-[11px] font-bold leading-none active:bg-pink"
                >
                  ✕
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isEditing && (
                  <Expand>
                    <BillForm
                      initial={bill}
                      onCancel={() => setEditingId(null)}
                      onSave={(patch) => {
                        b.updateBill({ id: bill.id, ...patch })
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
              <BillForm
                initial={{ emoji: '🧾', name: '', amount: '', dueDay: 1, autopay: false }}
                saveLabel="add it"
                onCancel={() => setAdding(false)}
                onSave={(patch) => {
                  b.addBill(patch)
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
            ＋ new bill
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

function BillForm({ initial, onSave, onCancel, saveLabel = 'save' }) {
  const [emoji, setEmoji] = useState(initial.emoji)
  const [name, setName] = useState(initial.name)
  const [amount, setAmount] = useState(String(initial.amount ?? ''))
  const [dueDay, setDueDay] = useState(String(initial.dueDay ?? 1))
  const [autopay, setAutopay] = useState(!!initial.autopay)

  const valid = name.trim() && Number(amount) > 0

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
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="what's it for?"
          aria-label="bill name"
          className="min-w-0 flex-1 border-[2.5px] border-ink bg-white px-2.5 py-1.5 text-[13px] font-semibold"
        />
      </div>
      <div className="flex items-center gap-2 text-[13px] font-semibold">
        <span className="opacity-50">₹</span>
        <input
          type="number"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="amount"
          aria-label="bill amount"
          className="w-24 border-2 border-ink bg-white px-2 py-1"
        />
        <span className="opacity-50">due on the</span>
        <input
          type="number"
          inputMode="numeric"
          min={1}
          max={28}
          value={dueDay}
          onChange={(e) => setDueDay(e.target.value)}
          aria-label="due day"
          className="w-14 border-2 border-ink bg-white px-2 py-1"
        />
        <span className="opacity-50">th</span>
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-[12px] font-semibold">
        <input
          type="checkbox"
          checked={autopay}
          onChange={(e) => setAutopay(e.target.checked)}
          className="h-4 w-4 accent-ink"
        />
        autopay — mark itself paid on the due day, no tap needed
      </label>
      <div className="flex gap-2 pt-0.5">
        <button
          onClick={onCancel}
          className="flex-1 border-[2.5px] border-ink bg-white py-1.5 font-display text-[11px]"
        >
          cancel
        </button>
        <button
          onClick={() => valid && onSave({ emoji, name, amount: Number(amount), dueDay: Number(dueDay), autopay })}
          disabled={!valid}
          className="flex-1 border-[2.5px] border-ink bg-ink py-1.5 font-display text-[11px] text-yellow disabled:opacity-40"
        >
          {saveLabel}
        </button>
      </div>
    </div>
  )
}
