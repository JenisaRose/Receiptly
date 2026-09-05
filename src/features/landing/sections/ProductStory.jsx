import { motion, useReducedMotion } from 'framer-motion'
import CountUpOnView from '../CountUpOnView'
import { useFloat } from '../motion'
import { Eyebrow, Section } from '../Shell'

const LABELS = [
  { text: '🍜 Food · ₹4,200', cls: 'left-0 top-2', delay: 0.3 },
  { text: '🚕 Transport · ₹2,180', cls: 'right-0 top-16', delay: 0.42 },
  { text: '✨ Fun · ₹900', cls: 'left-2 bottom-4', delay: 0.54 },
  { text: '🏠 Bills · ₹6,500', cls: 'right-2 bottom-14', delay: 0.66 },
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
    <Section id="idea" dark watermark="₹340">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-8">
        <div>
          <Eyebrow dark>02 · the core idea</Eyebrow>
          <h2 className="mt-3 font-display text-[clamp(2.4rem,6vw,3.8rem)] leading-[1] text-yellow">
            One number that
            <br />
            actually means something.
          </h2>
          <p className="mt-5 max-w-[30rem] text-[16px] font-semibold leading-snug text-bg/70">
            Every other app shows you what you <em>spent</em>. Receiptly shows you what's{' '}
            <em>safe to spend</em> — your income, minus bills, minus what you're setting aside,
            divided across the days you have left. It recalculates the instant you log anything.
          </p>
          <ul className="mt-6 space-y-2 text-[13.5px] font-semibold text-bg/80">
            <li className="flex gap-2.5">
              <span className="text-mint">◆</span> updates live as you spend
            </li>
            <li className="flex gap-2.5">
              <span className="text-mint">◆</span> a month-end forecast from day three
            </li>
            <li className="flex gap-2.5">
              <span className="text-mint">◆</span> a "what if I spend ₹X/day" slider
            </li>
          </ul>
        </div>

        <div className="relative mx-auto flex h-[320px] w-[320px] items-center justify-center">
          {LABELS.map((l, i) => (
            <motion.span
              key={l.text}
              {...floats[i]}
              initial={{ opacity: 0, scale: 0.6 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: l.delay }}
              className={`absolute z-10 whitespace-nowrap rounded-full border-2 border-bg/25 bg-ink px-3 py-1.5 text-[11px] font-bold text-bg shadow-[3px_3px_0_rgba(244,255,90,0.3)] ${l.cls}`}
            >
              {l.text}
            </motion.span>
          ))}

          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="100" cy="100" r={R} fill="none" stroke="#2c2839" strokeWidth="16" />
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
            <span className="font-display text-[52px] leading-none text-yellow">
              <span className="text-[24px]">₹</span>
              <CountUpOnView value={340} />
            </span>
            <span className="mt-1 text-[11px] font-bold text-bg/45">for the rest of today</span>
          </div>
        </div>
      </div>
    </Section>
  )
}
