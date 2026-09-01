import { motion, useReducedMotion } from 'framer-motion'
import Money from '../../../components/ui/Money'
import { BG } from '../../../lib/theme'
import Bleed from '../Bleed'

/**
 * CARD 3 — the leaderboard. The full top-4 ranking, not one bar. #1 gets a big
 * medallion, a badge and a fat bar; #2–4 shrink down the list. Rows fly in from
 * alternating sides, staggered; amounts count up.
 */
export default function LeaderboardCard({ w }) {
  const reduced = useReducedMotion()
  const rows = w.ranking
  const max = rows[0]?.amount || 1

  return (
    <Bleed accent="bg-lilac" className="flex flex-col justify-center px-4 pb-14 pt-20">
      <motion.p
        className="mb-6 px-1 font-display text-[clamp(1.7rem,7.5vw,2.3rem)] leading-tight"
        initial={reduced ? false : { x: -34 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      >
        where it all went
      </motion.p>

      <div className="space-y-3">
        {rows.map((c, idx) => {
          const first = idx === 0
          const fromLeft = idx % 2 === 0
          return (
            <motion.div
              key={c.id}
              className={`border-[3px] border-ink ${
                first ? 'bg-yellow p-3.5 shadow-hard' : 'bg-white p-2.5 shadow-hard-sm'
              }`}
              initial={reduced ? false : { x: fromLeft ? -380 : 380 }}
              animate={{ x: 0 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22, delay: 0.15 + idx * 0.13 }}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`flex shrink-0 items-center justify-center rounded-full border-[3px] border-ink ${
                    BG[c.color]
                  } ${first ? 'h-16 w-16 text-[30px]' : 'h-9 w-9 text-[15px]'}`}
                >
                  {c.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={`flex min-w-0 items-baseline gap-1.5 font-display ${
                        first ? 'text-[19px]' : 'text-[13px]'
                      }`}
                    >
                      <span className={first ? 'bg-ink px-1 text-yellow' : 'opacity-40'}>
                        #{idx + 1}
                      </span>
                      <span className="truncate">{c.label}</span>
                    </span>
                    <span
                      className={`shrink-0 font-display ${first ? 'text-[19px]' : 'text-[13px]'}`}
                    >
                      <Money value={c.amount} duration={1 + idx * 0.15} />
                    </span>
                  </div>
                  <div
                    className={`mt-2 w-full overflow-hidden border-2 border-ink bg-bg ${
                      first ? 'h-4' : 'h-2.5'
                    }`}
                  >
                    <div
                      className={`h-full ${BG[c.color]}`}
                      style={{ width: `${Math.max(3, (c.amount / max) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <motion.p
        className="mt-6 px-1 font-hand text-[18px] font-bold"
        initial={reduced ? false : { y: 16 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3 + rows.length * 0.13 }}
      >
        {w.category.label.toLowerCase()} took {w.category.pct}% of the month
      </motion.p>
    </Bleed>
  )
}
