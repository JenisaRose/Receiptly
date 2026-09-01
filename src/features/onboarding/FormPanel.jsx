import { motion, useReducedMotion } from 'framer-motion'
import { BG } from '../../lib/theme'

/**
 * The shared "intake form on a clipboard" shell for the three form steps.
 * Accent-topped, a section-number tab that stamps in, contents that cascade.
 */
export default function FormPanel({
  n,
  total = 5,
  accent = 'mint',
  eyebrow,
  title,
  children,
  onBack,
  onContinue,
  onSkip,
  canContinue = true,
  continueLabel = 'continue →',
}) {
  const reduced = useReducedMotion()
  const spring = { type: 'spring', stiffness: 240, damping: 20 }
  const rise = (delay) =>
    reduced
      ? {}
      : { initial: { y: 20 }, animate: { y: 0 }, transition: { ...spring, delay } }

  return (
    <div className="relative w-full max-w-[560px]">
      {/* clipboard clip — clamps down on arrival */}
      <motion.div
        className="absolute left-1/2 top-[-17px] z-10 h-7 w-28 -translate-x-1/2 rounded-sm border-[3px] border-ink bg-ink"
        initial={reduced ? false : { y: -12, rotate: -9 }}
        animate={{ y: 0, rotate: -2 }}
        transition={{ ...spring, delay: 0.04 }}
      />

      <div className="relative border-[3px] border-ink bg-white shadow-hard-lg">
        {/* accent header */}
        <div
          className={`flex items-center justify-between border-b-[3px] border-ink px-6 py-3 ${BG[accent]}`}
        >
          <span className="font-display text-[12px] uppercase tracking-[0.22em]">setup</span>
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, idx) => (
              <motion.span
                key={idx}
                className={`h-2.5 w-2.5 rounded-full border-2 border-ink ${
                  idx < n ? 'bg-ink' : 'bg-white'
                }`}
                initial={reduced || idx !== n - 1 ? false : { scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 12, delay: 0.34 }}
              />
            ))}
          </div>
        </div>

        {/* section number tab — stamps in with an overshoot */}
        <motion.span
          className={`absolute left-[-12px] top-[58px] grid h-12 w-12 place-items-center border-[3px] border-ink font-display text-[24px] shadow-hard-xs ${BG[accent]}`}
          initial={reduced ? false : { scale: 0, rotate: 28 }}
          animate={{ scale: 1, rotate: -6 }}
          transition={{ type: 'spring', stiffness: 330, damping: 13, delay: 0.12 }}
        >
          {n}
        </motion.span>

        <div className="px-7 pb-7 pt-9 sm:px-11">
          {eyebrow && (
            <motion.p className="mb-1 font-hand text-[18px] font-bold opacity-60" {...rise(0.16)}>
              {eyebrow}
            </motion.p>
          )}
          <motion.h2
            className="font-display text-[clamp(1.7rem,5.5vw,2.25rem)] leading-tight"
            initial={reduced ? false : { x: -24 }}
            animate={{ x: 0 }}
            transition={{ ...spring, delay: 0.2 }}
          >
            {title}
          </motion.h2>
          <motion.div className="mt-7" {...rise(0.28)}>
            {children}
          </motion.div>
        </div>

        {/* footer nav */}
        <motion.div
          className="flex items-center gap-3 border-t-[3px] border-ink px-6 py-4"
          {...rise(0.36)}
        >
          <motion.button
            onClick={onBack}
            whileHover={reduced ? undefined : { x: -2 }}
            className="press border-[3px] border-ink bg-white px-4 py-2.5 font-display text-[13px] shadow-hard-xs"
            style={{ '--press-x': '3px', '--press-y': '3px' }}
          >
            ‹ back
          </motion.button>
          {onSkip && (
            <button
              onClick={onSkip}
              className="font-hand text-[17px] font-bold underline decoration-dotted underline-offset-2 opacity-55 hover:opacity-100"
            >
              skip for now
            </button>
          )}
          <motion.button
            onClick={onContinue}
            disabled={!canContinue}
            whileHover={reduced || !canContinue ? undefined : { x: 3 }}
            className="press ml-auto border-[3px] border-ink bg-ink px-6 py-2.5 font-display text-[14px] text-yellow shadow-[5px_5px_0_var(--color-pink)] disabled:opacity-40 disabled:shadow-none"
            style={{ '--press-x': '5px', '--press-y': '5px' }}
          >
            {continueLabel}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
