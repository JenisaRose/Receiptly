import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Money from '../components/ui/Money'
import ShareReceiptModal from '../features/export/ShareReceiptModal'
import { rupee } from '../lib/format'
import { HEAT_LEVELS, heatLevel } from '../lib/theme'
import { useBudget } from '../store/budgetContext'

const TONE = { mint: 'bg-mint', sky: 'bg-sky', lilac: 'bg-lilac', pink: 'bg-pink' }

export default function Reflect() {
  const b = useBudget()
  const r = b.reflection
  const [sharing, setSharing] = useState(false)

  if (r.total === 0) {
    return (
      <div className="border-[3px] border-dashed border-ink/40 p-8 text-center">
        <p className="font-hand text-[20px] font-bold opacity-70">
          nothing to reflect on for {r.monthLabel} yet
        </p>
        <p className="mt-1 text-[12px] opacity-55">log a few days and the recap fills in</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <motion.div
        initial={{ scale: 0.85, rotate: -1.5, opacity: 0 }}
        animate={{ scale: 1, rotate: -1.5, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 16 }}
        className="relative border-4 border-ink bg-yellow p-5 text-center shadow-hard-lg"
      >
        <span className="absolute right-1.5 top-1.5 text-[22px]">✦</span>
        <p className="font-hand text-[19px] font-bold">your month, wrapped</p>
        <p className="my-1 font-display text-[34px] leading-none">{r.monthLabel}</p>
        <p className="text-[12px] font-semibold">
          <Money value={r.total} /> flowed out · {r.vsPrev}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {r.cards.map((c) => (
          <div key={c.k} className={`border-[3px] border-ink p-3.5 shadow-hard-sm ${TONE[c.tone]}`}>
            <p className="text-[10.5px] font-bold uppercase tracking-wide opacity-70">{c.k}</p>
            <p className="mt-0.5 font-display text-[18px]">{c.v}</p>
            <p className="mt-0.5 text-[11px] font-semibold">{c.sub}</p>
          </div>
        ))}
      </div>

      <p className="block -rotate-1 font-hand text-[20px] font-bold opacity-85">{r.note}</p>

      <div className="border-[3px] border-ink bg-white p-4 shadow-hard-sm">
        <p className="mb-3 text-[13px] font-bold">every day in {r.monthLabel}, by spend</p>
        <motion.div
          className="grid grid-cols-7 gap-1.5"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          {r.heat.map((v, i) => {
            const lvl = heatLevel(v)
            return (
              <div
                key={i}
                title={`${r.monthLabel} ${i + 1} · ${v === 0 ? 'no spend' : rupee(v)}`}
                className={`flex aspect-square items-start justify-end border-2 border-ink p-0.5 text-[8px] font-bold ${
                  lvl === 0 ? 'opacity-35' : ''
                } ${HEAT_LEVELS[lvl]}`}
              >
                {i + 1}
              </div>
            )
          })}
        </motion.div>
        <div className="mt-2.5 flex items-center gap-1.5 text-[10px] font-semibold opacity-70">
          <span>less</span>
          {HEAT_LEVELS.map((c, i) => (
            <span key={i} className={`inline-block h-3.5 w-3.5 border-2 border-ink ${c}`} />
          ))}
          <span>more</span>
        </div>
      </div>

      <button
        onClick={() => setSharing(true)}
        className="press w-full border-[3px] border-ink bg-ink py-3 font-display text-sm text-yellow shadow-[5px_5px_0_var(--color-sky)]"
        style={{ '--press-x': '5px', '--press-y': '5px' }}
      >
        make a shareable receipt 🧾
      </button>

      <AnimatePresence>
        {sharing && <ShareReceiptModal onClose={() => setSharing(false)} />}
      </AnimatePresence>
    </div>
  )
}
