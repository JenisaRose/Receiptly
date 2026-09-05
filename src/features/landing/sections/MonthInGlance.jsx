import { motion } from 'framer-motion'
import CountUpOnView from '../CountUpOnView'
import { useReveal } from '../motion'
import { Eyebrow, Section } from '../Shell'
import WrappedScreen from '../screens/WrappedScreen'

const STATS = [
  { label: 'no-spend days', value: '16', accent: 'text-mint' },
  { label: 'top category', value: 'Transport', accent: 'text-sky' },
  { label: 'priciest day', value: 'Fri 14 · ₹1,349', accent: 'text-pink' },
  { label: 'vs August', value: '−₹1,240', accent: 'text-yellow' },
]

export default function MonthInGlance() {
  const reveal = useReveal()

  return (
    <Section id="wrapped" dark watermark="wrapped">
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-10">
        <div>
          <Eyebrow dark>05 · every month, wrapped</Eyebrow>
          <p className="mt-4 font-hand text-[17px] font-bold text-bg/55">you spent, in September</p>
          <p className="font-display text-[clamp(3.4rem,10vw,6rem)] leading-none text-yellow">
            ₹<CountUpOnView value={8389} />
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...reveal(0.08 + i * 0.05)}>
                <p className={`font-display text-[18px] ${s.accent}`}>{s.value}</p>
                <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-bg/45">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="mt-8 max-w-[26rem] text-[14px] font-semibold leading-snug text-bg/60">
            At month-end Receiptly replays it as a full-screen story — biggest category, no-spend
            streaks, your priciest day — and prints it as a receipt you can save or share.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 36, rotate: 4 }}
          whileInView={{ opacity: 1, y: 0, rotate: 2 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          className="mx-auto w-full max-w-[340px]"
        >
          <WrappedScreen />
        </motion.div>
      </div>
    </Section>
  )
}
