import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import HeroMockup from '../HeroMockup'
import InstallButton from '../InstallButton'

const PRIMARY_CTA =
  'press inline-flex items-center justify-center border-[3px] border-ink bg-ink px-8 py-4 font-display text-[15px] text-yellow shadow-[7px_7px_0_var(--color-pink)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink'
const SECONDARY_CTA =
  'press inline-flex items-center justify-center border-[2.5px] border-ink/70 bg-transparent px-7 py-4 font-display text-[14px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink'

export default function Hero() {
  const reduced = useReducedMotion()
  const rise = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 22 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'spring', stiffness: 230, damping: 24, delay },
  })

  return (
    <section className="relative overflow-hidden bg-bg px-5 pb-20 pt-14 sm:pt-20 lg:px-8 lg:pt-24">
      <div className="mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
        <div className="text-center lg:text-left">
          <motion.span
            {...rise(0)}
            className="inline-block font-display text-[19px] leading-none"
          >
            receipt
            <span className="ml-0.5 inline-block -rotate-3 border-[3px] border-ink bg-yellow px-1.5 shadow-hard-sm">
              ly
            </span>
          </motion.span>

          <motion.p
            {...rise(0.06)}
            className="mt-6 text-[11.5px] font-bold uppercase tracking-[0.24em] opacity-50"
          >
            personal finance, rethought
          </motion.p>

          <motion.h1
            {...rise(0.12)}
            className="mt-4 font-display text-[clamp(2.8rem,7.4vw,4.6rem)] leading-[0.94] tracking-[-0.02em]"
          >
            Your money.
            <br />
            Made{' '}
            <span className="relative inline-block whitespace-nowrap">
              clearer.
              <motion.span
                aria-hidden
                className="absolute inset-x-0 bottom-1 -z-10 h-[0.4em] origin-left bg-yellow"
                initial={reduced ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.6, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </motion.h1>

          <motion.p
            {...rise(0.2)}
            className="mx-auto mt-6 max-w-[30rem] text-[16px] font-semibold leading-snug opacity-70 lg:mx-0"
          >
            Receiptly shows what you can safely spend today, where it's actually going, and how
            that's changing — no spreadsheets, no guesswork.
          </motion.p>

          <motion.div
            {...rise(0.28)}
            className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start"
          >
            <Link to="/app" className={PRIMARY_CTA}>
              Explore Receiptly →
            </Link>
            <InstallButton className={SECONDARY_CTA} label="Install Receiptly" />
          </motion.div>

          <motion.p {...rise(0.34)} className="mt-5 text-[12px] font-semibold opacity-45">
            free · runs in your browser · nothing to install
          </motion.p>
        </div>

        <div className="lg:pl-4">
          <HeroMockup />
        </div>
      </div>
    </section>
  )
}
