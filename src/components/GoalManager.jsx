import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { rupee } from '../lib/format'
import { useBudget } from '../store/budgetContext'

/** Add / edit / remove savings goals — each with its own target and monthly set-aside. */
export default function GoalManager() {
  const b = useBudget()
  const goals = b.goals
  const [editingId, setEditingId] = useState(null)
  const [adding, setAdding] = useState(false)

  const totalMonthly = goals.reduce((s, g) => s + g.monthly, 0)

  return (
    <section>
      <h3 className="mb-2 font-hand text-[19px] font-bold">savings goals 🎯</h3>
      <p className="mb-3 text-[11.5px] opacity-60">
        as many as you like — each with its own target and monthly set-aside.
        {goals.length > 0 && ` ${rupee(totalMonthly)}/mo set aside in total right now.`}
      </p>

      <div className="space-y-2">
        {goals.map((goal) => {
          const isEditing = editingId === goal.id
          return (
            <div key={goal.id} className="border-[2.5px] border-ink bg-white">
              <div className="flex items-center gap-2.5 px-3 py-2.5">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 border-ink bg-lilac text-sm">
                  {goal.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-bold">{goal.name}</p>
                  <p className="text-[10.5px] opacity-55">
                    {rupee(goal.saved)}
                    {goal.target > 0 ? ` / ${rupee(goal.target)}` : ' saved · open-ended'} ·{' '}
                    {rupee(goal.monthly)}/mo
                  </p>
                </div>
                <button
                  onClick={() => setEditingId(isEditing ? null : goal.id)}
                  className="border-2 border-ink bg-white px-2 py-1 text-[11px] font-bold active:bg-yellow"
                >
                  {isEditing ? 'close' : 'edit'}
                </button>
                <button
                  aria-label={`Delete ${goal.name}`}
                  onClick={() => b.deleteGoal(goal.id)}
                  className="flex h-6 w-6 shrink-0 items-center justify-center border-2 border-ink bg-white text-[11px] font-bold leading-none active:bg-pink"
                >
                  ✕
                </button>
              </div>

              <AnimatePresence initial={false}>
                {isEditing && (
                  <Expand>
                    <GoalForm
                      initial={goal}
                      onCancel={() => setEditingId(null)}
                      onSave={(patch) => {
                        b.updateGoal({ id: goal.id, ...patch })
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
              <GoalForm
                initial={{ emoji: '🎯', name: '', target: '', monthly: '', saved: '' }}
                saveLabel="add it"
                onCancel={() => setAdding(false)}
                onSave={(patch) => {
                  b.addGoal(patch)
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
            ＋ new goal
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

function GoalForm({ initial, onSave, onCancel, saveLabel = 'save' }) {
  const [emoji, setEmoji] = useState(initial.emoji)
  const [name, setName] = useState(initial.name)
  const [target, setTarget] = useState(String(initial.target ?? ''))
  const [monthly, setMonthly] = useState(String(initial.monthly ?? ''))
  const [saved, setSaved] = useState(String(initial.saved ?? ''))

  const valid = name.trim()

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
          placeholder="what for?"
          aria-label="goal name"
          className="min-w-0 flex-1 border-[2.5px] border-ink bg-white px-2.5 py-1.5 text-[13px] font-semibold"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-semibold">
        <span className="opacity-60">target</span>
        <span className="opacity-50">₹</span>
        <input
          type="number"
          inputMode="numeric"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          placeholder="70,000 (optional)"
          aria-label="goal target"
          className="w-28 border-2 border-ink bg-white px-2 py-1"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-semibold">
        <span className="opacity-60">set aside</span>
        <span className="opacity-50">₹</span>
        <input
          type="number"
          inputMode="numeric"
          value={monthly}
          onChange={(e) => setMonthly(e.target.value)}
          placeholder="1,000"
          aria-label="monthly set-aside"
          className="w-20 border-2 border-ink bg-white px-2 py-1"
        />
        <span className="opacity-60">/mo</span>
      </div>
      <div className="flex flex-wrap items-center gap-2 text-[12.5px] font-semibold">
        <span className="opacity-60">already saved</span>
        <span className="opacity-50">₹</span>
        <input
          type="number"
          inputMode="numeric"
          value={saved}
          onChange={(e) => setSaved(e.target.value)}
          placeholder="0"
          aria-label="already saved"
          className="w-20 border-2 border-ink bg-white px-2 py-1"
        />
      </div>
      <div className="flex gap-2 pt-0.5">
        <button
          onClick={onCancel}
          className="flex-1 border-[2.5px] border-ink bg-white py-1.5 font-display text-[11px]"
        >
          cancel
        </button>
        <button
          onClick={() =>
            valid && onSave({ emoji, name, target: Number(target) || 0, monthly: Number(monthly) || 0, saved: Number(saved) || 0 })
          }
          disabled={!valid}
          className="flex-1 border-[2.5px] border-ink bg-ink py-1.5 font-display text-[11px] text-yellow disabled:opacity-40"
        >
          {saveLabel}
        </button>
      </div>
    </div>
  )
}
