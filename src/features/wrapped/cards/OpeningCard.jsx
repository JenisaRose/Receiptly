import { motion, useReducedMotion } from 'framer-motion'
import Bleed from '../Bleed'

const SPARKLES = [
  { style: { top: '13%', left: '9%' }, size: 'text-[34px]', from: { scale: 0, rotate: -70 } },
  { style: { top: '20%', right: '13%' }, size: 'text-[22px]', from: { scale: 0, rotate: 55 } },
  { style: { bottom: '24%', left: '15%' }, size: 'text-[26px]', from: { scale: 0, rotate: -30 } },
  { style: { bottom: '15%', right: '11%' }, size: 'text-[32px]', from: { scale: 0, rotate: 44 } },
]

/**
 * CARD 1 — the title sequence. Month drops in from above, "wrapped." slams up
 * with a spring overshoot, the year lands on a tape strip, sparkles + a stray
 * receipt fly in from the corners.
 */
export default function OpeningCard({ w }) {
  const reduced = useReducedMotion()
  const spring = { type: 'spring', stiffness: 210, damping: 15 }

  return (
    <Bleed
      accent="bg-yellow"
      className="flex flex-col items-center justify-center px-6 pb-10 pt-16 text-center"
    >
      {/* a stray receipt, flung in from the right */}
      <motion.div
        aria-hidden
        className="absolute right-[-30px] top-[11%] w-24 rotate-[16deg] border-[3px] border-ink bg-white p-2 shadow-hard"
        initial={reduced ? false : { x: 280, rotate: 66 }}
        animate={{ x: 0, rotate: 16 }}
        transition={{ ...spring, delay: 0.12 }}
      >
        {[92, 62, 100, 46, 80, 38].map((wd, idx) => (
          <div key={idx} className="mb-1 h-1.5 bg-ink/70" style={{ width: `${wd}%` }} />
        ))}
      </motion.div>

      {SPARKLES.map((s, idx) => (
        <motion.span
          key={idx}
          aria-hidden
          className={`absolute ${s.size}`}
          style={s.style}
          initial={reduced ? false : s.from}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ ...spring, delay: 0.45 + idx * 0.09 }}
        >
          ✦
        </motion.span>
      ))}

      <motion.p
        className="font-display text-[clamp(2rem,11vw,3.4rem)] uppercase leading-[0.9] tracking-tight"
        initial={reduced ? false : { y: -170 }}
        animate={{ y: 0 }}
        transition={{ ...spring, delay: 0.15 }}
      >
        {w.monthLabel}
      </motion.p>

      <motion.p
        className="font-display leading-[0.82] tracking-[-0.04em]"
        style={{ fontSize: 'clamp(2.5rem, 17vw, 4.75rem)' }}
        initial={reduced ? false : { scale: 0.12 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 11, delay: 0.4 }}
      >
        wrapped.
      </motion.p>

      <motion.span
        className="mt-6 inline-block -rotate-3 border-[3px] border-ink bg-pink px-5 py-1 font-display text-[19px] shadow-hard-sm"
        initial={reduced ? false : { scale: 0, rotate: 28 }}
        animate={{ scale: 1, rotate: -3 }}
        transition={{ ...spring, delay: 0.78 }}
      >
        {w.year}
      </motion.span>

      <motion.p
        className="mt-5 font-hand text-[19px] font-bold"
        initial={reduced ? false : { y: 16 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.98 }}
      >
        your month in seven cards 👀
      </motion.p>
    </Bleed>
  )
}
