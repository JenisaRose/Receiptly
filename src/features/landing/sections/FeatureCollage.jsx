import { motion } from 'framer-motion'
import { useReveal } from '../motion'

const BIG = [
  {
    label: 'Safe-to-spend',
    emoji: '🏠',
    blurb: "today's number, always current",
    bg: 'bg-yellow',
    text: 'text-ink',
  },
  {
    label: 'Wrapped',
    emoji: '🌙',
    blurb: 'your month, replayed as a story',
    bg: 'bg-ink',
    text: 'text-bg',
  },
]

const MEDIUM = [
  { label: 'Spending insights', emoji: '💡', blurb: 'patterns you’d otherwise miss', bg: 'bg-white' },
  { label: 'Envelopes', emoji: '🫙', blurb: 'budgets that flex with you', bg: 'bg-lilac' },
  { label: 'Trends', emoji: '📊', blurb: 'months, compared at a glance', bg: 'bg-white' },
  { label: 'Bills', emoji: '🔁', blurb: 'recurring costs, tracked & tamed', bg: 'bg-mint' },
]

const SMALL = [
  { label: 'Search & filter', emoji: '🔎' },
  { label: 'Savings goals', emoji: '🎯' },
  { label: 'Split expenses', emoji: '🔀' },
  { label: 'Quick-add presets', emoji: '⚡' },
]

export default function FeatureCollage() {
  const reveal = useReveal()

  return (
    <section className="bg-bg px-5 py-24 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-[1100px]">
        <motion.h2
          {...reveal(0)}
          className="text-center font-display text-[clamp(1.9rem,4.6vw,2.6rem)] leading-tight"
        >
          Everything a budget app should be.
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {BIG.map((f, i) => (
            <motion.div
              key={f.label}
              {...reveal(0.05 * i)}
              className={`flex flex-col justify-between gap-6 rounded-3xl p-7 lg:col-span-3 ${f.bg} ${f.text} min-h-[150px] sm:min-h-[190px]`}
            >
              <span className="text-[34px]">{f.emoji}</span>
              <div>
                <p className="font-display text-[22px]">{f.label}</p>
                <p className="mt-1 text-[13px] font-semibold opacity-70">{f.blurb}</p>
              </div>
            </motion.div>
          ))}

          {MEDIUM.map((f, i) => (
            <motion.div
              key={f.label}
              {...reveal(0.05 * i + 0.15)}
              className={`rounded-2xl p-5 lg:col-span-3 ${f.bg} ${
                f.bg === 'bg-white' ? 'border-2 border-ink/10' : ''
              }`}
            >
              <span className="text-[22px]">{f.emoji}</span>
              <p className="mt-2.5 font-display text-[16px]">{f.label}</p>
              <p className="mt-0.5 text-[12px] font-semibold opacity-60">{f.blurb}</p>
            </motion.div>
          ))}
        </div>

        <motion.div {...reveal(0.4)} className="mt-6 flex flex-wrap justify-center gap-2.5">
          {SMALL.map((f) => (
            <span
              key={f.label}
              className="rounded-full border-2 border-ink/15 bg-white px-4 py-2 text-[12.5px] font-semibold"
            >
              {f.emoji} {f.label}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
