import { motion, useReducedMotion } from 'framer-motion'

export default function WelcomeStep({ onStart, onDemo }) {
  const reduced = useReducedMotion()
  const spring = { type: 'spring', stiffness: 220, damping: 18 }

  return (
    <div className="relative w-full max-w-[420px]">
      <motion.span
        aria-hidden
        className="absolute -right-3 -top-6 text-[34px]"
        initial={reduced ? false : { scale: 0, rotate: -40 }}
        animate={{ scale: 1, rotate: 12 }}
        transition={{ ...spring, delay: 0.2 }}
      >
        ✦
      </motion.span>
      <motion.span
        aria-hidden
        className="absolute -bottom-5 -left-4 text-[26px]"
        initial={reduced ? false : { scale: 0, rotate: 40 }}
        animate={{ scale: 1, rotate: -10 }}
        transition={{ ...spring, delay: 0.32 }}
      >
        ✦
      </motion.span>

      <div className="border-[3px] border-ink bg-lilac p-7 text-center shadow-hard-lg sm:p-9">
        <motion.span
          className="inline-block -rotate-2 border-[3px] border-ink bg-ink px-3 py-1 font-display text-[11px] uppercase tracking-[0.2em] text-yellow"
          initial={reduced ? false : { y: -16 }}
          animate={{ y: 0 }}
          transition={spring}
        >
          welcome
        </motion.span>

        <motion.h1
          className="mt-4 font-display text-[clamp(2.4rem,13vw,3.4rem)] leading-[0.95]"
          initial={reduced ? false : { scale: 0.6 }}
          animate={{ scale: 1 }}
          transition={{ ...spring, delay: 0.08 }}
        >
          meet
          <br />
          receipt<span className="bg-yellow px-1">ly</span>
        </motion.h1>

        <motion.p
          className="mx-auto mt-3 max-w-[15rem] font-hand text-[20px] font-bold"
          initial={reduced ? false : { y: 12 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.18 }}
        >
          your money, understood. 🧾
        </motion.p>

        <motion.div
          className="mt-7 space-y-2.5"
          initial={reduced ? false : { y: 16 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.26 }}
        >
          <button
            onClick={onStart}
            className="press w-full border-[3px] border-ink bg-ink py-3.5 font-display text-[15px] text-yellow shadow-[6px_6px_0_var(--color-pink)]"
            style={{ '--press-x': '6px', '--press-y': '6px' }}
          >
            set up Receiptly →
          </button>
          <button
            onClick={onDemo}
            className="press w-full border-[3px] border-ink bg-white py-3 font-display text-[14px] shadow-hard-sm"
            style={{ '--press-x': '4px', '--press-y': '4px' }}
          >
            explore the demo →
          </button>
        </motion.div>

        <p className="mt-4 text-[11px] font-semibold opacity-55">
          about a minute · nothing leaves your device
        </p>
      </div>
    </div>
  )
}
