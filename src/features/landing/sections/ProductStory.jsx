import { motion, useReducedMotion } from 'framer-motion'
import CountUpOnView from '../CountUpOnView'
import { useFloat } from '../motion'
import { Label, Section } from '../Shell'

const LABELS = [
  { text: '🍜 Food · ₹4,200', cls: 'left-0 top-2', delay: 0.3 },
  { text: '🚕 Transport · ₹2,180', cls: 'right-0 top-14', delay: 0.42 },
  { text: '✨ Fun · ₹900', cls: 'left-2 bottom-4', delay: 0.54 },
  { text: '🏠 Bills · ₹6,500', cls: 'right-2 bottom-16', delay: 0.66 },
]

export default function ProductStory() {
  const reduced = useReducedMotion()
  const f1 = useFloat(8, 4.2)
  const f2 = useFloat(6, 3.6)
  const f3 = useFloat(7, 4.8)
  const f4 = useFloat(6, 4)
  const floats = [f1, f2, f3, f4]
  const R = 84

  return (
    <Section id="idea" variant="ink">
      <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <Label dark>02 / 06 · the core idea</Label>
          <h2 className="mt-5 font-display text-[clamp(2.6rem,6.4vw,4.2rem)] leading-[0.98] text-yellow">
            One number that
            <br />
            actually means
            <br />
            something.
          </h2>
          <p className="mt-6 font-serif text-[clamp(1.15rem,2.4vw,1.6rem)] italic leading-snug text-bg/55">
            a budget that talks back.
          </p>
          <p className="mt-6 max-w-[30rem] text-[16px] font-semibold leading-snug text-bg/70">
            Every other app shows you what you <em>spent</em>. Receiptly shows what's{' '}
            <em>safe to spend</em> — income, minus bills, minus what you're setting aside, split
            across the days you have left. It recalculates the instant you log anything.
          </p>
          <ul className="mt-7 space-y-2.5 text-[14px] font-semibold text-bg/80">
            <li className="flex gap-2.5">
              <span className="mt-1 text-[11px] text-mint">◆</span> updates live as you spend
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1 text-[11px] text-mint">◆</span> a month-end forecast from day
              three
            </li>
            <li className="flex gap-2.5">
              <span className="mt-1 text-[11px] text-mint">◆</span> a "what if I spend ₹X/day"
              slider
            </li>
          </ul>
        </div>

        <div className="relative mx-auto flex h-[340px] w-[300px] items-center justify-center sm:h-[360px] sm:w-[340px]">
          {LABELS.map((l, i) => (
            <motion.span
              key={l.text}
              {...floats[i]}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: l.delay }}
              className={`absolute z-10 whitespace-nowrap rounded-full border border-white/15 bg-[#211d33] px-3 py-1.5 text-[11px] font-bold text-bg shadow-[0_2px_18px_rgba(0,0,0,0.4)] ${l.cls}`}
            >
              {l.text}
            </motion.span>
          ))}

          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="100" cy="100" r={R} fill="none" stroke="rgba(255,255,255,0.09)" strokeWidth="16" />
            <motion.circle
              cx="100"
              cy="100"
              r={R}
              fill="none"
              stroke="#f4ff5a"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * R}
              initial={reduced ? false : { strokeDashoffset: 2 * Math.PI * R }}
              whileInView={{ strokeDashoffset: 2 * Math.PI * R * 0.24 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>

          <div className="relative flex flex-col items-center text-center">
            <span className="font-hand text-[15px] font-bold text-bg/55">safe to spend</span>
            <span className="font-display text-[56px] leading-none text-yellow drop-shadow-[0_0_26px_rgba(244,255,90,0.35)]">
              <span className="text-[26px]">₹</span>
              <CountUpOnView value={340} />
            </span>
            <span className="mt-1 text-[11px] font-bold uppercase tracking-wide text-bg/45">
              for the rest of today
            </span>
          </div>
        </div>
      </div>
    </Section>
  )
}
