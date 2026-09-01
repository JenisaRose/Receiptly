import { motion, useReducedMotion } from 'framer-motion'
import { useCountUp } from '../../../hooks/useCountUp'
import { inr } from '../../../lib/format'
import Bleed from '../Bleed'

// how many tally strokes ring the number once it lands
const MARK_TARGET = 45

/**
 * CARD 2 — the big number. "you spent" sits small up top; the total dominates
 * the card, digits rolling up from zero while tally strokes pile up beneath it.
 * It shudders once when it lands.
 */
export default function TotalCard({ w }) {
  const reduced = useReducedMotion()
  const shown = useCountUp(w.total, { duration: 1.9 })
  const marks = reduced
    ? MARK_TARGET
    : Math.min(MARK_TARGET, Math.round((shown / w.total) * MARK_TARGET))

  // keep the number filling the card without overflowing it, whatever its length
  const len = inr(w.total).length
  const numFont =
    len >= 8
      ? 'clamp(2.75rem, 15vw, 4rem)'
      : len >= 6
        ? 'clamp(3.25rem, 19vw, 5rem)'
        : 'clamp(3.5rem, 24vw, 6.25rem)'

  return (
    <Bleed accent="bg-pink" className="flex flex-col px-6 pb-12 pt-20">
      <motion.p
        className="font-hand text-[24px] font-bold"
        initial={reduced ? false : { x: -44 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        in {w.monthLabel}, you spent
      </motion.p>

      <div className="flex flex-1 flex-col justify-center">
        <motion.p
          className="-ml-1 font-display leading-[0.82] tracking-[-0.05em] tabular-nums"
          style={{ fontSize: numFont }}
          initial={reduced ? false : { x: -56 }}
          animate={reduced ? {} : { x: 0, y: [0, 0, -9, 7, -4, 0] }}
          transition={{
            x: { type: 'spring', stiffness: 200, damping: 18, delay: 0.15 },
            y: { duration: 2.3, times: [0, 0.82, 0.87, 0.92, 0.96, 1] },
          }}
        >
          <span className="align-top text-[0.36em]">₹</span>
          {inr(shown)}
        </motion.p>

        <div className="mt-7 max-w-[300px]">
          <Tally n={marks} />
        </div>
      </div>

      <motion.p
        className="font-hand text-[18px] font-bold"
        initial={reduced ? false : { y: 16 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5 }}
      >
        across {w.activeDays} day{w.activeDays === 1 ? '' : 's'} · {w.txCount} tap
        {w.txCount === 1 ? '' : 's'}
      </motion.p>
    </Bleed>
  )
}

function Tally({ n }) {
  const groups = []
  let left = Math.max(0, n)
  while (left > 0) {
    groups.push(Math.min(5, left))
    left -= 5
  }
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-3.5">
      {groups.map((count, idx) => (
        <span key={idx} className="relative inline-flex gap-[4px]">
          {Array.from({ length: Math.min(count, 4) }).map((_, k) => (
            <span key={k} className="block h-9 w-[3px] bg-ink" />
          ))}
          {count === 5 && (
            <span className="absolute left-[-16%] top-1/2 h-[3px] w-[132%] -rotate-[24deg] bg-ink" />
          )}
        </span>
      ))}
    </div>
  )
}
