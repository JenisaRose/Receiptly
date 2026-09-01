import { motion } from 'framer-motion'
import { BG } from '../../../lib/theme'
import CardShell from './CardShell'

export default function InsightCard({ w }) {
  const ins = w.insight
  return (
    <CardShell accent={BG[ins.color]}>
      <p className="mb-1 font-hand text-[16px] font-bold opacity-70">Receiptly noticed…</p>
      <motion.span
        className="mb-2 inline-block text-[38px]"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.25, type: 'spring', stiffness: 260, damping: 12 }}
      >
        {ins.emoji}
      </motion.span>
      <p className="font-display text-[24px] leading-tight">{ins.headline}</p>
      <p className="mt-2 font-hand text-[17px] font-bold opacity-80">{ins.detail}</p>
    </CardShell>
  )
}
