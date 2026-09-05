import { motion } from 'framer-motion'
import { useReveal } from '../motion'
import { Eyebrow, Section } from '../Shell'

const STEPS = [
  {
    n: '01',
    word: 'Track',
    dot: 'bg-sky',
    line: 'Log a spend in one tap — or one preset chip.',
  },
  {
    n: '02',
    word: 'Understand',
    dot: 'bg-mint',
    line: 'A detector engine surfaces the patterns you’d miss.',
  },
  {
    n: '03',
    word: 'Plan',
    dot: 'bg-lilac',
    line: 'Envelopes and goals flex with the month, not against it.',
  },
  {
    n: '04',
    word: 'Reflect',
    dot: 'bg-pink',
    line: 'Every month closes with a story you can actually read.',
  },
]

export default function HowItThinks() {
  const reveal = useReveal()

  return (
    <Section id="method" watermark="method">
      <div className="max-w-[36rem]">
        <Eyebrow>03 · the method</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2.2rem,5.6vw,3.6rem)] leading-[1.02]">
          Don't just track your money.{' '}
          <span className="font-hand text-[1.15em] text-pink">Understand it.</span>
        </h2>
        <p className="mt-4 text-[15.5px] font-semibold leading-snug opacity-70">
          Receiptly walks the same loop every day — four moves that turn a pile of transactions
          into a decision you can make in a glance.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {STEPS.map((s, i) => (
          <motion.div
            key={s.word}
            {...reveal(i * 0.07)}
            className="relative border-l-[3px] border-ink pl-4"
          >
            <span className={`absolute -left-[7px] top-1 h-3 w-3 rounded-full border-2 border-ink ${s.dot}`} />
            <span className="font-display text-[13px] opacity-30">{s.n}</span>
            <p className="font-display text-[22px]">{s.word}</p>
            <p className="mt-1.5 text-[12.5px] font-semibold leading-snug opacity-60">{s.line}</p>
          </motion.div>
        ))}
      </div>
    </Section>
  )
}
