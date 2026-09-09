import { motion } from 'framer-motion'
import { useReveal } from '../motion'
import { Label, Section } from '../Shell'

const STEPS = [
  { n: '01', word: 'Track', dot: 'bg-sky', line: 'Log a spend in one tap — or one preset chip.' },
  { n: '02', word: 'Understand', dot: 'bg-mint', line: 'A detector engine surfaces the patterns you’d miss.' },
  { n: '03', word: 'Plan', dot: 'bg-lilac', line: 'Envelopes and goals flex with the month, not against it.' },
  { n: '04', word: 'Reflect', dot: 'bg-pink', line: 'Every month closes with a story you can actually read.' },
]

export default function HowItThinks() {
  const reveal = useReveal()

  return (
    <Section id="method" variant="insights">
      <div className="max-w-[40rem]">
        <Label>03 / 06 · the method</Label>
        <h2 className="mt-5 font-display text-[clamp(2.4rem,6vw,4rem)] leading-[1]">
          Don't just track your money.
        </h2>
        <p className="mt-1 font-serif text-[clamp(2.2rem,5.6vw,3.6rem)] italic leading-[1.05] text-pink">
          Understand it.
        </p>
        <p className="mt-6 max-w-[34rem] text-[16px] font-semibold leading-snug opacity-65">
          Receiptly walks the same loop every day — four moves that turn a pile of transactions
          into a decision you can make in a glance.
        </p>
      </div>

      <div className="relative mt-16">
        <div className="pointer-events-none absolute left-0 right-0 top-[9px] hidden h-px bg-ink/15 lg:block" />
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {STEPS.map((s, i) => (
            <motion.div key={s.word} {...reveal(i * 0.08)} className="relative">
              <span className={`block h-[18px] w-[18px] rounded-full border-2 border-ink ${s.dot}`} />
              <span className="mt-4 block font-display text-[12px] tracking-widest opacity-30">
                {s.n}
              </span>
              <p className="mt-1 font-display text-[clamp(1.5rem,2.6vw,2rem)]">{s.word}</p>
              <p className="mt-2 max-w-[15rem] text-[13px] font-semibold leading-snug opacity-55">
                {s.line}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
