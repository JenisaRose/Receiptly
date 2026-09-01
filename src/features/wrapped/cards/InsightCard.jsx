import { motion, useReducedMotion } from 'framer-motion'
import { BG } from '../../../lib/theme'
import Bleed from '../Bleed'

const TONE_LABEL = { watch: 'worth a look', good: 'nice one', neutral: 'fyi' }

/**
 * CARD 6 — the "it gets me" moment. Bottom-anchored text stack (unlike every
 * other card), an oversized insight emoji spilling off the top-right corner,
 * the generated headline as the hero.
 */
export default function InsightCard({ w }) {
  const reduced = useReducedMotion()
  const ins = w.insight

  return (
    <Bleed accent={BG[ins.color]} className="flex flex-col justify-end px-6 pb-16 pt-20">
      <motion.span
        aria-hidden
        className="pointer-events-none absolute right-[-8vw] top-[3%] leading-none"
        style={{ fontSize: 'clamp(8rem, 44vw, 15rem)' }}
        initial={reduced ? false : { scale: 0.2, rotate: -36, x: 70 }}
        animate={{ scale: 1, rotate: -8, x: 0 }}
        transition={{ type: 'spring', stiffness: 190, damping: 12, delay: 0.1 }}
      >
        {ins.emoji}
      </motion.span>

      <motion.p
        className="relative font-hand text-[20px] font-bold"
        initial={reduced ? false : { x: -32 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 20, delay: 0.25 }}
      >
        Receiptly noticed…
      </motion.p>

      <motion.p
        className="relative mt-2 font-display leading-[1.02] tracking-[-0.02em]"
        style={{ fontSize: 'clamp(1.9rem, 8.5vw, 3.2rem)' }}
        initial={reduced ? false : { y: 54 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 22, delay: 0.35 }}
      >
        {ins.headline}
      </motion.p>

      <motion.p
        className="relative mt-3 max-w-[300px] font-hand text-[19px] font-bold"
        initial={reduced ? false : { y: 18 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.62 }}
      >
        {ins.detail}
      </motion.p>

      <motion.span
        className="relative mt-4 inline-block w-fit -rotate-1 border-[3px] border-ink bg-white px-3 py-0.5 font-display text-[11px] uppercase tracking-wide shadow-hard-xs"
        initial={reduced ? false : { scale: 0, rotate: 16 }}
        animate={{ scale: 1, rotate: -1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 16, delay: 0.82 }}
      >
        {TONE_LABEL[ins.tone] ?? 'noticed'}
      </motion.span>
    </Bleed>
  )
}
