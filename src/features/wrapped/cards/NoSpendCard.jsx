import { motion, useReducedMotion } from 'framer-motion'
import { useCountUp } from '../../../hooks/useCountUp'
import Bleed from '../Bleed'

const PER_MARK = 0.05 // stagger between each ✓ popping in

/**
 * CARD 5 — the real month calendar. Weekdays aligned, real day count. No-spend
 * days go mint and get a ✓ that pops in one-by-one; the count climbs alongside.
 * The longest no-spend run is outlined in pink.
 */
export default function NoSpendCard({ w }) {
  const reduced = useReducedMotion()
  const order = new Map(w.noSpendDays.map((d, idx) => [d, idx]))
  const streak = w.streakRange
  const shown = useCountUp(w.noSpendCount, {
    duration: Math.max(0.5, w.noSpendCount * PER_MARK),
  })

  return (
    <Bleed accent="bg-mint" className="flex flex-col justify-center px-5 pb-10 pt-16">
      <div className="mb-3">
        <motion.p
          className="font-display leading-none tabular-nums"
          style={{ fontSize: 'clamp(3rem, 16vw, 5rem)' }}
          initial={reduced ? false : { x: -44 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 18 }}
        >
          {reduced ? w.noSpendCount : shown}
        </motion.p>
        <motion.p
          className="font-hand text-[22px] font-bold"
          initial={reduced ? false : { x: -32 }}
          animate={{ x: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.08 }}
        >
          no-spend day{w.noSpendCount === 1 ? '' : 's'} in {w.monthLabel}
        </motion.p>
      </div>

      <motion.div
        className="border-[3px] border-ink bg-white p-3 shadow-hard"
        initial={reduced ? false : { y: 32 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20, delay: 0.15 }}
      >
        <div className="mb-1.5 grid grid-cols-7 gap-1 text-[9px] font-bold opacity-45">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
            <span key={idx} className="text-center">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: w.firstWeekday }).map((_, idx) => (
            <div key={`pad-${idx}`} aria-hidden />
          ))}
          {Array.from({ length: w.daysInMonth }).map((_, idx) => {
            const day = idx + 1
            const counted = day <= w.countUpTo
            const noSpend = order.has(day)
            const inStreak = streak && day >= streak.start && day <= streak.end
            return (
              <div
                key={day}
                className={`relative flex aspect-square items-center justify-center border-2 text-[8px] font-bold ${
                  inStreak ? 'border-pink' : 'border-ink'
                } ${
                  !counted
                    ? 'border-dashed bg-white opacity-30'
                    : noSpend
                      ? 'bg-mint'
                      : 'bg-white'
                }`}
              >
                <span className="absolute right-0.5 top-0 text-[7px] opacity-40">{day}</span>
                {noSpend && (
                  <motion.span
                    className="text-[12px] leading-none"
                    initial={reduced ? false : { scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 520,
                      damping: 15,
                      delay: reduced ? 0 : 0.3 + order.get(day) * PER_MARK,
                    }}
                  >
                    ✓
                  </motion.span>
                )}
              </div>
            )
          })}
        </div>
      </motion.div>

      <motion.p
        className="mt-3 font-hand text-[18px] font-bold"
        initial={reduced ? false : { y: 16 }}
        animate={{ y: 0 }}
        transition={{ delay: reduced ? 0.2 : 0.3 + w.noSpendCount * PER_MARK }}
      >
        {streak && streak.length >= 2
          ? `🔥 longest run: ${streak.length} days straight (${w.monthLabel} ${streak.start}–${streak.end})`
          : w.noSpendCount === 0
            ? 'every day cost something this month 👀'
            : 'every rupee-free day counts'}
      </motion.p>
    </Bleed>
  )
}
