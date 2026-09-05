import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import InstallButton from '../InstallButton'
import { useFloat } from '../motion'
import TodayScreen from '../screens/TodayScreen'
import Win from '../screens/Win'

const PRIMARY_CTA =
  'press inline-flex items-center justify-center border-[3px] border-ink bg-ink px-8 py-4 font-display text-[15px] text-yellow shadow-[7px_7px_0_var(--color-pink)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink'
const SECONDARY_CTA =
  'press inline-flex items-center justify-center border-[2.5px] border-ink/70 bg-transparent px-6 py-4 font-display text-[14px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink'

export default function Hero() {
  const reduced = useReducedMotion()
  const float = useFloat(9, 5)
  const rise = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'spring', stiffness: 230, damping: 24, delay },
  })

  return (
    <section className="relative overflow-hidden bg-bg px-5 pb-16 pt-24 lg:px-8 lg:pt-28">
      <span
        aria-hidden
        className="pointer-events-none absolute -left-6 top-40 select-none font-display text-[26vw] leading-none text-ink/[0.035] sm:text-[18vw]"
      >
        ₹
      </span>

      <div className="mx-auto grid max-w-[1180px] items-center gap-12 lg:grid-cols-[1fr_0.9fr] lg:gap-6">
        <div>
          <motion.p {...rise(0)} className="text-[11px] font-bold uppercase tracking-[0.26em] opacity-45">
            personal finance / 01
          </motion.p>

          <motion.h1
            {...rise(0.08)}
            className="mt-4 font-display text-[clamp(3.2rem,9vw,6rem)] leading-[0.9] tracking-[-0.03em]"
          >
            Your money.
            <br />
            Made{' '}
            <span className="relative inline-block whitespace-nowrap">
              clearer.
              <motion.span
                aria-hidden
                className="absolute inset-x-0 bottom-1 -z-10 h-[0.38em] origin-left bg-yellow"
                initial={reduced ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.55, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </motion.h1>

          <motion.p
            {...rise(0.16)}
            className="mt-6 max-w-[32rem] text-[17px] font-semibold leading-snug opacity-75"
          >
            Receiptly is a local-first budget tracker that answers one question — <em>is my
            spending okay right now?</em> — and keeps answering it every time you log a rupee.
          </motion.p>

          <motion.div {...rise(0.24)} className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/app" className={PRIMARY_CTA}>
              Explore Receiptly →
            </Link>
            <InstallButton className={SECONDARY_CTA} label="Install Receiptly" />
          </motion.div>

          <motion.div
            {...rise(0.3)}
            className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] font-bold uppercase tracking-wide opacity-40"
          >
            <span>runs in your browser</span>
            <span>·</span>
            <span>nothing to install</span>
            <span>·</span>
            <span>data stays on your device</span>
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px]">
          <div className="absolute inset-0 translate-x-2 translate-y-5 -rotate-6 rounded-[24px] bg-mint sm:translate-x-4" />
          <div className="absolute inset-0 -translate-x-2 translate-y-3 rotate-3 rounded-[24px] bg-pink/60 sm:-translate-x-3" />

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 30, rotate: 5 }}
            animate={{ opacity: 1, y: 0, rotate: -2 }}
            transition={{ type: 'spring', stiffness: 150, damping: 18, delay: 0.3 }}
            className="relative"
          >
            <TodayScreen />
          </motion.div>

          <motion.div
            {...float}
            initial={reduced ? false : { opacity: 0, scale: 0.7, rotate: 12 }}
            animate={{ opacity: 1, scale: 1, rotate: 7 }}
            transition={{ type: 'spring', stiffness: 200, damping: 14, delay: 0.9 }}
            className="absolute -bottom-8 -left-6 w-[190px] sm:-left-14"
          >
            <Win title="LOG">
              <p className="font-hand text-[13px] font-bold">log an expense 🖊️</p>
              <div className="mt-1.5 border-2 border-ink bg-white px-2 py-1.5 font-display text-[16px]">
                ₹40
              </div>
              <div className="mt-1.5 flex gap-1 text-[8px] font-bold">
                <span className="border border-ink bg-yellow px-1 py-0.5">🚕 Transport</span>
              </div>
            </Win>
          </motion.div>
        </div>
      </div>

      <motion.p
        {...rise(0.5)}
        className="mx-auto mt-14 max-w-[1180px] text-[10.5px] font-bold uppercase tracking-[0.22em] opacity-35"
      >
        ↓ scroll to explore
      </motion.p>
    </section>
  )
}
