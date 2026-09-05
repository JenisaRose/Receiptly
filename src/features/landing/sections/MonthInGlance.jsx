import { motion } from 'framer-motion'
import CountUpOnView from '../CountUpOnView'
import { useReveal } from '../motion'

const STATS = [
  { label: 'no-spend days', value: '16', accent: 'text-mint' },
  { label: 'top category', value: 'Transport', accent: 'text-sky' },
  { label: 'priciest day', value: 'Fri 14 · ₹1,349', accent: 'text-pink' },
]

export default function MonthInGlance() {
  const reveal = useReveal()

  return (
    <section className="bg-ink px-5 py-24 text-bg sm:py-28 lg:px-8">
      <div className="mx-auto max-w-[1000px]">
        <motion.p
          {...reveal(0)}
          className="text-center text-[11px] font-bold uppercase tracking-[0.22em] text-yellow/70"
        >
          every month, wrapped up
        </motion.p>

        <div className="mt-10 flex flex-col items-center gap-12 lg:flex-row lg:items-end lg:justify-between lg:gap-6">
          <motion.div {...reveal(0.08)} className="text-center lg:text-left">
            <p className="font-hand text-[16px] font-bold text-bg/50">spent in September</p>
            <p className="mt-1 font-display text-[clamp(3rem,9vw,5.2rem)] leading-none text-yellow">
              ₹<CountUpOnView value={8389} />
            </p>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 text-center sm:grid-cols-3 lg:gap-10 lg:text-right">
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...reveal(0.12 + i * 0.06)}>
                <p className={`font-display text-[22px] ${s.accent}`}>{s.value}</p>
                <p className="mt-1 text-[11px] font-bold uppercase tracking-wide text-bg/45">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div {...reveal(0.3)} className="mt-16 border-t border-bg/15 pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4 text-[11px] font-bold uppercase tracking-wide text-bg/40">
            <span>every day this month</span>
            <span>less · more</span>
          </div>
          <div className="mt-3 grid grid-cols-[repeat(15,minmax(0,1fr))] gap-1 sm:grid-cols-[repeat(30,minmax(0,1fr))]">
            {Array.from({ length: 30 }, (_, i) => (
              <span
                key={i}
                className={`h-3 w-full rounded-[2px] ${
                  [1, 5, 9, 14, 18, 22, 27].includes(i)
                    ? 'bg-bg/10'
                    : i % 4 === 0
                      ? 'bg-pink'
                      : i % 3 === 0
                        ? 'bg-yellow/70'
                        : 'bg-mint/50'
                }`}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
