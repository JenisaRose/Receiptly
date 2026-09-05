import { motion } from 'framer-motion'
import { useReveal } from '../motion'

const STEPS = [
  { n: '01', word: 'Track', dot: 'bg-sky', desc: 'log a spend in one tap' },
  { n: '02', word: 'Understand', dot: 'bg-mint', desc: 'patterns surface on their own' },
  { n: '03', word: 'Plan', dot: 'bg-lilac', desc: 'envelopes flex with your month' },
  { n: '04', word: 'Reflect', dot: 'bg-pink', desc: 'a story of where it all went' },
]

export default function HowItThinks() {
  const reveal = useReveal()

  return (
    <section className="bg-white px-5 py-24 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <div className="text-center">
          <motion.h2
            {...reveal(0)}
            className="mx-auto max-w-[30rem] font-display text-[clamp(2rem,5.2vw,3.1rem)] leading-[1.05]"
          >
            Don't just track your money.
            <br />
            <span className="font-hand text-[1.15em] font-bold text-pink">Understand it.</span>
          </motion.h2>
        </div>

        <div className="mt-20 flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.word}
              {...reveal(0.08 * i)}
              className="relative flex-1 text-center sm:text-left"
            >
              {i > 0 && (
                <span className="pointer-events-none absolute right-full top-4 hidden w-10 -translate-y-1/2 text-[20px] opacity-25 sm:block">
                  →
                </span>
              )}
              <div className="flex items-center justify-center gap-2 sm:justify-start">
                <span className={`h-2.5 w-2.5 rounded-full ${s.dot}`} />
                <span className="font-display text-[13px] opacity-35">{s.n}</span>
              </div>
              <p className="mt-2 font-display text-[24px]">{s.word}</p>
              <p className="mt-1 text-[12.5px] font-semibold opacity-55">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
