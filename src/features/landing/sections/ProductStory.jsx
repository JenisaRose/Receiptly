import { motion, useReducedMotion } from 'framer-motion'
import CountUpOnView from '../CountUpOnView'
import { useFloat, useReveal } from '../motion'

const LABELS = [
  { text: '🍜 Food · ₹4,200', cls: 'left-[4%] top-[8%] sm:left-[8%]', delay: 0.3 },
  { text: '🚕 Transport · ₹2,180', cls: 'right-[2%] top-[18%] sm:right-[6%]', delay: 0.45 },
  { text: '✨ Fun · ₹900', cls: 'left-[8%] bottom-[10%] sm:left-[14%]', delay: 0.6 },
]

export default function ProductStory() {
  const reduced = useReducedMotion()
  const reveal = useReveal()
  const float1 = useFloat(9, 4.4)
  const float2 = useFloat(7, 3.7)
  const float3 = useFloat(8, 5)
  const floats = [float1, float2, float3]

  return (
    <section className="bg-ink px-5 py-24 text-bg sm:py-28 lg:px-8">
      <div className="mx-auto grid max-w-[1100px] items-center gap-16 lg:grid-cols-2 lg:gap-10">
        <div className="text-center lg:text-left">
          <motion.p
            {...reveal(0)}
            className="text-[11px] font-bold uppercase tracking-[0.22em] text-yellow/70"
          >
            the core idea
          </motion.p>
          <motion.h2
            {...reveal(0.06)}
            className="mt-4 font-display text-[clamp(2.2rem,5.5vw,3.4rem)] leading-[1.02] text-yellow"
          >
            Know what you can <br className="hidden sm:block" />
            spend today.
          </motion.h2>
          <motion.p
            {...reveal(0.14)}
            className="mx-auto mt-6 max-w-[26rem] text-[15px] font-semibold leading-snug text-bg/70 lg:mx-0"
          >
            One number, recalculated every time you log something — income minus bills minus
            what's already set aside, split across the days you have left.
          </motion.p>
        </div>

        <div className="relative mx-auto flex h-[300px] w-[300px] items-center justify-center sm:h-[340px] sm:w-[340px]">
          {LABELS.map((l, i) => (
            <motion.span
              key={l.text}
              {...floats[i]}
              initial={{ opacity: 0, scale: 0.7 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 200, damping: 16, delay: l.delay }}
              className={`absolute z-10 whitespace-nowrap rounded-full border-2 border-bg/30 bg-ink px-3 py-1.5 text-[11px] font-bold text-bg shadow-[3px_3px_0_rgba(244,255,90,0.35)] ${l.cls}`}
            >
              {l.text}
            </motion.span>
          ))}

          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full -rotate-90">
            <circle cx="100" cy="100" r="88" fill="none" stroke="#2c2839" strokeWidth="14" />
            <motion.circle
              cx="100"
              cy="100"
              r="88"
              fill="none"
              stroke="#f4ff5a"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 88}
              initial={reduced ? false : { strokeDashoffset: 2 * Math.PI * 88 }}
              whileInView={{ strokeDashoffset: 2 * Math.PI * 88 * 0.26 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            />
          </svg>

          <div className="relative flex flex-col items-center text-center">
            <span className="font-hand text-[15px] font-bold text-bg/60">safe to spend</span>
            <span className="font-display text-[46px] leading-none text-yellow sm:text-[54px]">
              <span className="text-[22px]">₹</span>
              <CountUpOnView value={340} />
            </span>
            <span className="mt-1 text-[11px] font-bold text-bg/50">today</span>
          </div>
        </div>
      </div>
    </section>
  )
}
