import { motion, useReducedMotion } from 'framer-motion'

const SPARKS = [
  { cls: 'absolute -right-5 -top-8 text-[46px]', rest: 12, delay: 0 },
  { cls: 'absolute -bottom-6 -left-5 text-[34px]', rest: -10, delay: 0.9 },
  { cls: 'absolute -left-7 top-1/3 text-[22px]', rest: 6, delay: 1.6 },
]

export default function WelcomeStep({ onStart, onDemo }) {
  const reduced = useReducedMotion()
  const spring = { type: 'spring', stiffness: 220, damping: 18 }

  return (
    <div className="relative w-full max-w-[560px]">
      {SPARKS.map((s, idx) => (
        <motion.span
          key={idx}
          aria-hidden
          className={s.cls}
          style={{ rotate: s.rest }}
          animate={reduced ? undefined : { scale: [1, 1.22, 1], rotate: [s.rest, s.rest + 10, s.rest] }}
          transition={
            reduced ? undefined : { duration: 2.6, repeat: Infinity, ease: 'easeInOut', delay: s.delay }
          }
        >
          ✦
        </motion.span>
      ))}

      <div className="border-[3px] border-ink bg-lilac p-9 text-center shadow-hard-lg sm:p-12">
        <motion.span
          className="inline-block -rotate-2 border-[3px] border-ink bg-ink px-4 py-1.5 font-display text-[12px] uppercase tracking-[0.24em] text-yellow shadow-hard-xs"
          initial={reduced ? false : { y: -20, rotate: 8 }}
          animate={{ y: 0, rotate: -2 }}
          transition={{ type: 'spring', stiffness: 300, damping: 14 }}
        >
          welcome
        </motion.span>

        <motion.h1
          className="mt-6 font-display text-[clamp(2.5rem,10.5vw,4.2rem)] leading-[0.92] tracking-[-0.02em]"
          initial={reduced ? false : { scale: 0.5 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 13, delay: 0.06 }}
        >
          meet
          <br />
          receipt
          <motion.span
            className="inline-block bg-yellow px-1"
            initial={reduced ? false : { rotate: -8, scale: 0.7 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 12, delay: 0.4 }}
          >
            ly
          </motion.span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-4 max-w-[17rem] font-hand text-[22px] font-bold"
          initial={reduced ? false : { y: 14 }}
          animate={{ y: 0 }}
          transition={{ ...spring, delay: 0.24 }}
        >
          your money, understood. 🧾
        </motion.p>

        <motion.div
          className="mt-9 space-y-3"
          initial={reduced ? false : { y: 18 }}
          animate={{ y: 0 }}
          transition={{ ...spring, delay: 0.34 }}
        >
          <motion.button
            onClick={onStart}
            whileHover={reduced ? undefined : { x: 3 }}
            className="press w-full border-[3px] border-ink bg-ink py-4 font-display text-[16px] text-yellow shadow-[7px_7px_0_var(--color-pink)]"
            style={{ '--press-x': '7px', '--press-y': '7px' }}
          >
            set up Receiptly →
          </motion.button>
          <motion.button
            onClick={onDemo}
            whileHover={reduced ? undefined : { x: 3 }}
            className="press w-full border-[3px] border-ink bg-white py-3.5 font-display text-[15px] shadow-hard-sm"
            style={{ '--press-x': '4px', '--press-y': '4px' }}
          >
            explore the demo →
          </motion.button>
        </motion.div>

        <p className="mt-5 text-[12px] font-semibold opacity-55">
          about a minute · nothing leaves your device
        </p>
      </div>
    </div>
  )
}
