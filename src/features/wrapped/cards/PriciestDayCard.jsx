import { motion } from 'framer-motion'
import { rupee } from '../../../lib/format'
import CardShell from './CardShell'

export default function PriciestDayCard({ w }) {
  const p = w.priciest
  return (
    <CardShell accent="bg-sky" className="text-center">
      <p className="font-hand text-[19px] font-bold">your priciest day was</p>

      <motion.div
        className="mx-auto my-3 flex h-16 w-16 -rotate-6 flex-col items-center justify-center border-[3px] border-ink bg-white shadow-hard-sm"
        initial={{ scale: 0, rotate: 24 }}
        animate={{ scale: 1, rotate: -6 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 15 }}
      >
        <span className="text-[9px] font-bold uppercase">{p.weekday.slice(0, 3)}</span>
        <span className="font-display text-[22px] leading-none">{p.day}</span>
      </motion.div>

      <p className="font-display text-[22px] leading-tight">{p.label}</p>
      <p className="mt-1 font-display text-[30px]">{rupee(p.amount)}</p>
    </CardShell>
  )
}
