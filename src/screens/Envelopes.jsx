import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import ProgressBar from '../components/ui/ProgressBar'
import { rupee } from '../lib/format'
import { ENVELOPE_STATUS } from '../lib/theme'
import { useBudget } from '../store/budgetContext'

export default function Envelopes() {
  const b = useBudget()
  const [openId, setOpenId] = useState(null)

  const rolled = b.envelopes.find((e) => e.rolledOver)?.rolledOver ?? 0

  return (
    <div className="space-y-4">
      <div className="border-[3px] border-ink bg-orange p-4 shadow-hard">
        <p className="font-display text-[20px]">
          {rupee(b.allocatedTotal)} across {b.envelopesResolved.length} envelopes
        </p>
        <p className="mt-0.5 text-[12px] font-semibold">
          {rupee(b.spentSoFar)} used so far
          {rolled ? ` · ${rupee(rolled)} rolled over from July` : ''}
        </p>
      </div>

      <h2 className="inline-block -rotate-1 font-hand text-[21px] font-bold">
        tap an envelope to rebalance
      </h2>

      <div className="space-y-3">
        {b.envelopesResolved.map((env) => {
          const s = ENVELOPE_STATUS[env.status]
          const isOpen = openId === env.id
          return (
            <div
              key={env.id}
              className="border-[3px] border-ink bg-white p-3.5 shadow-hard-sm"
            >
              <button
                onClick={() => setOpenId(isOpen ? null : env.id)}
                className="w-full text-left"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm font-bold">
                    {env.emoji} {env.label}
                  </span>
                  <span
                    className={`rounded-full border-2 border-ink px-1.5 py-[2px] text-[10px] font-bold ${s.tag}`}
                  >
                    {env.status === 'over' ? `over ${rupee(-env.remaining)}` : s.label}
                  </span>
                </div>
                <p className="my-2 text-[12px]">
                  <b className="font-display text-[13px]">{rupee(env.spent)}</b> of{' '}
                  {rupee(env.allocated)} ·{' '}
                  {env.remaining >= 0
                    ? `${rupee(env.remaining)} left`
                    : `${rupee(-env.remaining)} over`}
                </p>
                <ProgressBar value={env.ratio} fill={s.fill} />
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 flex items-center gap-2 border-t-[2.5px] border-dashed border-[#d3ccf2] pt-3 text-[12px] font-semibold">
                      move budget
                      <span className="ml-auto flex items-center gap-1.5">
                        <Step onClick={() => b.adjustEnvelope(env.id, -250)}>–</Step>
                        <span>{rupee(env.allocated)}</span>
                        <Step onClick={() => b.adjustEnvelope(env.id, 250)}>+</Step>
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function Step({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="h-[26px] w-[26px] border-[2.5px] border-ink bg-white font-display text-[13px] leading-none active:bg-yellow"
    >
      {children}
    </button>
  )
}
