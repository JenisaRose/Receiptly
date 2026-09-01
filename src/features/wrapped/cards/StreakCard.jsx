import { motion } from 'framer-motion'
import { BG } from '../../../lib/theme'
import CardShell from './CardShell'

export default function StreakCard({ w }) {
  const a = w.achievement
  return (
    <CardShell accent={BG[a.color] ?? 'bg-mint'} className="text-center">
      <p className="mb-1 font-hand text-[16px] font-bold opacity-70">a small win</p>
      <motion.span
        className="mb-2 inline-block text-[44px]"
        initial={{ scale: 0, y: 12 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 12 }}
      >
        {a.emoji}
      </motion.span>
      <p className="font-display text-[26px] leading-tight">{a.headline}</p>
      <p className="mt-2 font-hand text-[17px] font-bold opacity-80">{a.detail}</p>
    </CardShell>
  )
}
