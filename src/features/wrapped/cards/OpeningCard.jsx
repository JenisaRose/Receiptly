import { motion } from 'framer-motion'
import CardShell from './CardShell'

export default function OpeningCard({ w }) {
  return (
    <CardShell accent="bg-yellow" className="relative text-center">
      <motion.span
        className="absolute -right-3 -top-4 inline-block rotate-12 border-[3px] border-ink bg-pink px-2 py-0.5 font-hand text-[15px] font-bold shadow-hard-xs"
        initial={{ scale: 0, rotate: 40 }}
        animate={{ scale: 1, rotate: 12 }}
        transition={{ delay: 0.35, type: 'spring', stiffness: 300, damping: 14 }}
      >
        {w.year}
      </motion.span>

      <p className="font-hand text-[19px] font-bold">here’s</p>
      <p className="my-2 font-display text-[42px] leading-[1.02]">
        {w.monthLabel},<br />
        wrapped.
      </p>
      <p className="font-hand text-[17px] font-bold opacity-75">a look back at your money 👀</p>
    </CardShell>
  )
}
