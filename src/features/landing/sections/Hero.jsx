import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { DriftWord, Grain, MovingGlow, Ring } from '../Atmosphere'
import Glow from '../Glow'
import InstallButton from '../InstallButton'
import { BG } from '../palette'
import { useFloat } from '../motion'
import { Label } from '../Shell'
import TodayScreen from '../screens/TodayScreen'
import Win from '../screens/Win'

const PRIMARY_CTA =
  'press inline-flex items-center justify-center border-[3px] border-ink bg-ink px-8 py-4 font-display text-[15px] text-yellow shadow-[7px_7px_0_var(--color-pink)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink'
const SECONDARY_CTA =
  'press inline-flex items-center justify-center border-[2px] border-ink/60 bg-transparent px-6 py-4 font-display text-[14px] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink'

export default function Hero() {
  const reduced = useReducedMotion()
  const float = useFloat(10, 5.5)
  const rise = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 26 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'spring', stiffness: 220, damping: 24, delay },
  })

  return (
    <section
      style={{ background: BG.hero }}
      className="relative isolate overflow-hidden px-5 pb-28 pt-28 lg:px-8 lg:pb-40 lg:pt-32"
    >
      <MovingGlow color="var(--color-yellow)" size={1000} x="76%" y="46%" opacity={0.34} path={[-40, 30, -40]} />
      <Glow color="var(--color-sky)" size={780} x="98%" y="-4%" opacity={0.3} />
      <Glow color="var(--color-pink)" size={720} x="-8%" y="92%" opacity={0.22} />
      <Ring size={760} x="80%" y="52%" />
      <DriftWord className="left-[-6%] top-[24%] text-[40vw] leading-none sm:text-[26vw]">₹</DriftWord>
      <Grain />

      <div className="relative z-[1] mx-auto grid max-w-[1180px] items-center gap-14 lg:grid-cols-[1fr_0.92fr] lg:gap-8">
        <div>
          <Label>personal finance / 01</Label>

          <motion.h1
            {...rise(0.06)}
            className="mt-6 font-display text-[clamp(3.2rem,9.4vw,6.4rem)] leading-[0.88] tracking-[-0.03em]"
          >
            Your money.
            <br />
            Made{' '}
            <span className="relative inline-block whitespace-nowrap">
              clearer.
              <motion.span
                aria-hidden
                className="absolute inset-x-0 bottom-1 -z-10 h-[0.36em] origin-left bg-yellow"
                initial={reduced ? false : { scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.55, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              />
            </span>
          </motion.h1>

          <motion.p
            {...rise(0.14)}
            className="mt-5 font-serif text-[clamp(1.15rem,2.6vw,1.7rem)] italic leading-snug opacity-60"
          >
            finally, a budget that talks back.
          </motion.p>

          <motion.p
            {...rise(0.2)}
            className="mt-6 max-w-[32rem] text-[16.5px] font-semibold leading-snug opacity-70"
          >
            Receiptly is a local-first budget tracker that answers one question — <em>is my
            spending okay right now?</em> — and keeps answering it every time you log a rupee.
          </motion.p>

          <motion.div {...rise(0.28)} className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link to="/app" className={PRIMARY_CTA}>
              Explore Receiptly →
            </Link>
            <InstallButton className={SECONDARY_CTA} label="Install Receiptly" />
          </motion.div>

          <motion.p {...rise(0.32)} className="mt-4 text-[12.5px] font-semibold opacity-45">
            Explore to start now — install any time for the standalone app.
          </motion.p>

          <motion.div
            {...rise(0.38)}
            className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10.5px] font-bold uppercase tracking-[0.2em] opacity-40"
          >
            <span>built local-first</span>
            <span className="h-3 w-px bg-ink/30" />
            <span>nothing to install</span>
            <span className="h-3 w-px bg-ink/30" />
            <span>your money / 2026</span>
          </motion.div>
        </div>

        <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[380px]">
          <div
            aria-hidden
            className="absolute -inset-10"
            style={{ background: 'radial-gradient(closest-side, rgba(244,255,90,0.4), transparent 70%)' }}
          />
          <div className="absolute inset-0 translate-x-2 translate-y-5 -rotate-6 rounded-[24px] bg-mint sm:translate-x-4" />
          <div className="absolute inset-0 -translate-x-2 translate-y-3 rotate-3 rounded-[24px] bg-pink/50 sm:-translate-x-3" />

          <motion.div
            initial={reduced ? false : { opacity: 0, y: 34, rotate: 5 }}
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
            className="absolute -bottom-10 -left-6 w-[190px] sm:-left-16"
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
        className="relative z-[1] mx-auto mt-16 flex max-w-[1180px] items-center gap-3 text-[10px] font-bold uppercase tracking-[0.24em] opacity-35"
      >
        <span className="h-px w-8 bg-ink/25" /> scroll to explore
      </motion.p>
    </section>
  )
}
