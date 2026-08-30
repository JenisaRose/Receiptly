import { motion } from 'framer-motion'
import { useState } from 'react'
import Money from '../components/ui/Money'
import { REFLECT } from '../data/history'
import { rupee } from '../lib/format'
import { HEAT_LEVELS, heatLevel } from '../lib/theme'

const TONE = { mint: 'bg-mint', sky: 'bg-sky', lilac: 'bg-lilac', pink: 'bg-pink' }

export default function Reflect() {
  const [toast, setToast] = useState(false)

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
        <p className="my-1 font-display text-[34px] leading-none">{REFLECT.month}</p>
        <p className="text-[12px] font-semibold">
          <Money value={REFLECT.total} /> flowed out · {REFLECT.vsPrevLabel}
        </p>
      </motion.div>

      <div className="grid grid-cols-2 gap-3">
        {REFLECT.cards.map((c) => (
          <div
            key={c.k}
            className={`border-[3px] border-ink p-3.5 shadow-hard-sm ${TONE[c.tone]}`}
          >
            <p className="text-[10.5px] font-bold uppercase tracking-wide opacity-70">{c.k}</p>
            <p className="mt-0.5 font-display text-[18px]">{c.v}</p>
            <p className="mt-0.5 text-[11px] font-semibold">{c.sub}</p>
          </div>
        ))}
      </div>

      <p className="block -rotate-1 font-hand text-[20px] font-bold opacity-85">{REFLECT.note}</p>

      <div className="border-[3px] border-ink bg-white p-4 shadow-hard-sm">
        <p className="mb-3 text-[13px] font-bold">every day in {REFLECT.month}, by spend</p>
        <motion.div
          className="grid grid-cols-7 gap-1.5"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.15 }}
        >
          {REFLECT.heat.map((v, i) => {
            const lvl = heatLevel(v)
            return (
              <div
                key={i}
                title={`${REFLECT.month} ${i + 1} · ${v === 0 ? 'no spend' : rupee(v)}`}
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
        onClick={() => {
          setToast(true)
          setTimeout(() => setToast(false), 2600)
        }}
        className="press w-full border-[3px] border-ink bg-ink py-3 font-display text-sm text-yellow shadow-[5px_5px_0_var(--color-sky)]"
        style={{ '--press-x': '5px', '--press-y': '5px' }}
      >
        make a shareable receipt 🧾
      </button>

      {toast && (
        <motion.p
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 border-[3px] border-ink bg-mint px-4 py-2 text-[13px] font-bold shadow-hard-sm"
        >
          receipt saved to your photos 🧾
        </motion.p>
      )}
    </div>
  )
}
