import { motion } from 'framer-motion'
import { rupee } from '../lib/format'
import { BG } from '../lib/theme'
import { useBudget } from '../store/budgetContext'

/**
 * One-tap expense shortcuts. Tapping a chip logs the preset straight away —
 * the new row animating into "recent taps" is the confirmation.
 */
export default function QuickAdd() {
  const b = useBudget()
  const presets = (b.presets ?? []).filter((p) => b.categoryMap[p.categoryId])
  if (presets.length === 0) return null

  return (
    <div>
      <h2 className="mb-2 inline-block -rotate-1 font-hand text-[20px] font-bold">quick add ⚡</h2>
      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {presets.map((p) => {
          const cat = b.categoryMap[p.categoryId]
          return (
            <motion.button
              key={p.id}
              type="button"
              onClick={() => b.logPreset(p.id)}
              whileTap={{ scale: 0.92, y: 2 }}
              className="press flex shrink-0 items-center gap-2 border-[3px] border-ink bg-white py-2 pl-2 pr-3 shadow-hard-xs"
              style={{ '--press-x': '2px', '--press-y': '2px' }}
            >
              <span
                className={`grid h-7 w-7 place-items-center rounded-full border-2 border-ink text-[13px] ${BG[cat.color]}`}
              >
                {p.emoji}
              </span>
              <span className="text-left leading-tight">
                <span className="block text-[12px] font-bold">{p.label}</span>
                <span className="block font-display text-[12px]">{rupee(p.amount)}</span>
              </span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
