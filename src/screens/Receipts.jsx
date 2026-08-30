import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Money from '../components/ui/Money'
import SegmentedToggle from '../components/ui/SegmentedToggle'
import { inr } from '../lib/format'
import { BG } from '../lib/theme'
import { useBudget } from '../store/budgetContext'

export default function Receipts() {
  const b = useBudget()
  const [scope, setScope] = useState('month')
  const [openId, setOpenId] = useState(null)

  const cats = b.categoryBreakdown(scope)
  const total = b.totalOut(scope)
  const max = Math.max(1, ...cats.map((c) => c.spent))

  return (
    <div className="space-y-4">
      <SegmentedToggle
        value={scope}
        onChange={(v) => {
          setScope(v)
          setOpenId(null)
        }}
        options={[
          { value: 'week', label: 'this week' },
          { value: 'month', label: 'this month' },
        ]}
      />

      <div className="card-dots flex items-baseline justify-between border-[3px] border-ink p-4 shadow-hard">
        <div>
          <p className="font-hand text-[18px] font-bold text-mint">total flowing out</p>
          <p className="font-display text-[26px] text-yellow">
            <Money key={scope} value={total} />
          </p>
        </div>
        <span className="text-[28px]">💸</span>
      </div>

      <h2 className="inline-block -rotate-1 font-hand text-[21px] font-bold">
        tap a category to open it up
      </h2>

      <div className="space-y-3">
        {cats.map((cat) => {
          const isOpen = openId === cat.id
          return (
            <div
              key={cat.id}
              className="overflow-hidden border-[3px] border-ink bg-white shadow-hard-sm"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : cat.id)}
                className="flex w-full items-center justify-between px-3.5 py-3 text-left"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className={`flex h-[34px] w-[34px] items-center justify-center rounded-full border-[2.5px] border-ink text-base ${BG[cat.color]}`}
                  >
                    {cat.emoji}
                  </span>
                  <span>
                    <span className="block text-sm font-bold">{cat.label}</span>
                    <span className="block text-[11px] opacity-60">
                      {cat.count} transaction{cat.count === 1 ? '' : 's'}
                    </span>
                  </span>
                </span>
                <span className="flex items-center gap-2">
                  <span className="text-sm font-bold">₹{inr(cat.spent)}</span>
                  <motion.span animate={{ rotate: isOpen ? 180 : 0 }} className="text-[13px]">
                    ▾
                  </motion.span>
                </span>
              </button>

              <div className="relative h-2.5 overflow-hidden border-t-[2.5px] border-ink bg-bg">
                <motion.div
                  className={`absolute inset-y-0 left-0 ${BG[cat.color]}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(cat.spent / max) * 100}%` }}
                  transition={{ duration: 0.6, ease: [0.2, 0.8, 0.3, 1] }}
                />
              </div>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden border-t-[3px] border-ink"
                  >
                    {cat.txs.map((t) => (
                      <div
                        key={t.id}
                        className="flex justify-between border-b border-dashed border-[#d8d2f5] px-3.5 py-2.5 text-[12.5px] last:border-b-0"
                      >
                        <span className="opacity-85">{t.name}</span>
                        <span className="font-semibold">₹{inr(Math.abs(t.amount))}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
        {cats.length === 0 && (
          <p className="border-[3px] border-dashed border-ink/40 p-6 text-center text-sm opacity-60">
            nothing logged {scope === 'week' ? 'this week' : 'this month'} yet.
          </p>
        )}
      </div>
    </div>
  )
}
