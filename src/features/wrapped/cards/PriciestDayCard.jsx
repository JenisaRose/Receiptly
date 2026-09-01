import { motion, useReducedMotion } from 'framer-motion'
import { rupee } from '../../../lib/format'
import Bleed from '../Bleed'

/**
 * CARD 4 — the tear-off calendar ticket. Real weekday banner, the date number
 * as the hero, month underneath. The amount stamps on over the date: 2.4× down
 * to 1×, rotated, hard spring.
 */
export default function PriciestDayCard({ w }) {
  const reduced = useReducedMotion()
  const p = w.priciest

  return (
    <Bleed accent="bg-sky" className="flex flex-col items-center justify-center px-6 pb-10 pt-16">
      <motion.p
        className="mb-5 font-hand text-[23px] font-bold"
        initial={reduced ? false : { y: -26 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      >
        your priciest day
      </motion.p>

      <motion.div
        className="relative w-[min(300px,82vw)] border-[4px] border-ink bg-white shadow-hard-lg"
        initial={reduced ? false : { y: 90, rotate: -8 }}
        animate={{ y: 0, rotate: -2 }}
        transition={{ type: 'spring', stiffness: 190, damping: 17, delay: 0.15 }}
      >
        {/* perforated tear-off edge */}
        <div className="flex justify-around px-1 pt-1.5">
          {Array.from({ length: 12 }).map((_, idx) => (
            <span key={idx} className="h-2.5 w-2.5 rounded-full border-[2px] border-ink bg-sky" />
          ))}
        </div>
        <div className="border-b-[3px] border-dashed border-ink" />

        <div className="bg-ink py-2.5 text-center font-display text-[17px] uppercase tracking-[0.18em] text-yellow">
          {p.weekday}
        </div>

        <div className="relative px-4 pb-9 pt-7 text-center">
          <p
            className="font-display leading-none"
            style={{ fontSize: 'clamp(4.5rem, 26vw, 7.5rem)' }}
          >
            {p.day}
          </p>
          <p className="mt-4 font-hand text-[19px] font-bold">
            {w.monthLabel} {w.year}
          </p>

          <motion.span
            className="absolute left-1/2 top-[44%] inline-block whitespace-nowrap border-[3px] border-pink px-3 py-1 font-display text-[24px] text-pink"
            initial={reduced ? false : { scale: 2.4, rotate: -26, x: '-50%' }}
            animate={{ scale: 1, rotate: -12, x: '-50%' }}
            transition={{ type: 'spring', stiffness: 520, damping: 13, delay: 0.85 }}
          >
            {rupee(p.amount)}
          </motion.span>
        </div>
      </motion.div>

      <motion.p
        className="mt-6 text-center font-hand text-[18px] font-bold"
        initial={reduced ? false : { y: 16 }}
        animate={{ y: 0 }}
        transition={{ delay: 1.15 }}
      >
        {p.pctOfMonth}% of the month in one day
      </motion.p>
    </Bleed>
  )
}
