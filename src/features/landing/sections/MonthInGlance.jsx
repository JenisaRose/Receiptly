import { motion } from 'framer-motion'
import CountUpOnView from '../CountUpOnView'
import { useReveal } from '../motion'
import { Label, Section } from '../Shell'
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
    <Section id="wrapped" variant="wrapped">
      <div className="grid items-center gap-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        <div>
          <Label dark>05 / 06 · month in review</Label>
          <p className="mt-6 font-serif text-[clamp(1.1rem,2.4vw,1.5rem)] italic text-bg/50">
            you spent, in September
          </p>
          <p className="font-display text-[clamp(3.6rem,11vw,7rem)] leading-[0.85] text-yellow drop-shadow-[0_0_40px_rgba(244,255,90,0.25)]">
            ₹<CountUpOnView value={8389} />
          </p>

          <div className="mt-9 grid grid-cols-2 gap-x-10 gap-y-7 sm:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div key={s.label} {...reveal(0.08 + i * 0.05)}>
                <p className={`font-display text-[19px] ${s.accent}`}>{s.value}</p>
                <p className="mt-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-bg/40">
                  {s.label}
                </p>
              </motion.div>
            ))}
          </div>

          <p className="mt-9 max-w-[27rem] text-[14.5px] font-semibold leading-snug text-bg/60">
            At month-end Receiptly replays it as a full-screen story — biggest category, no-spend
            streaks, your priciest day — and prints it as a receipt you can save or share.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 44, rotate: 5 }}
          whileInView={{ opacity: 1, y: 0, rotate: 2 }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          className="relative mx-auto w-full max-w-[340px] lg:-my-16"
        >
          <div
            aria-hidden
            className="absolute -inset-16"
            style={{ background: 'radial-gradient(closest-side, rgba(255,111,176,0.28), transparent 70%)' }}
          />
          <div className="relative">
            <WrappedScreen />
          </div>
        </motion.div>
      </div>
    </Section>
  )
}
