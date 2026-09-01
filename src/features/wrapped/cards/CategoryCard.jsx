import { motion } from 'framer-motion'
import { rupee } from '../../../lib/format'
import { BG } from '../../../lib/theme'
import CardShell from './CardShell'

export default function CategoryCard({ w }) {
  const c = w.category
  return (
    <CardShell accent="bg-lilac">
      <div className="mb-3 flex items-center gap-2.5">
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-[3px] border-ink text-xl ${BG[c.color]}`}
        >
          {c.emoji}
        </span>
        <p className="font-hand text-[21px] font-bold leading-tight">{c.label} led your month</p>
      </div>

      <p className="font-display text-[34px] leading-none">{rupee(c.amount)}</p>
      <p className="mb-3 mt-1 text-[13px] font-semibold">{c.pct}% of everything you spent</p>

      <div className="relative h-7 overflow-hidden border-[3px] border-ink bg-white">
        <motion.div
          className={`absolute inset-y-0 left-0 ${BG[c.color]}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, c.pct)}%` }}
          transition={{ duration: 1, delay: 0.35, ease: [0.2, 0.8, 0.3, 1] }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] font-bold opacity-45">
        <span>0%</span>
        <span>100%</span>
      </div>
    </CardShell>
  )
}
