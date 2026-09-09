import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { DriftWord, Grain, MovingGlow, Vignette } from '../Atmosphere'
import Glow from '../Glow'
import { BG } from '../palette'
import { useReveal } from '../motion'

const CTA =
  'press inline-flex items-center justify-center border-[3px] border-bg bg-bg px-10 py-5 font-display text-[17px] text-ink shadow-[8px_8px_0_var(--color-pink)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-bg'

export default function FinalCta() {
  const reveal = useReveal()

  return (
    <section
      style={{ background: BG.final }}
      className="relative isolate overflow-hidden px-5 py-32 text-center text-bg sm:py-40 lg:px-8"
    >
      <MovingGlow color="var(--color-lilac)" size={1100} x="50%" y="12%" opacity={0.24} path={[-40, 40, -40]} />
      <Glow color="var(--color-mint)" size={720} x="2%" y="102%" opacity={0.14} />
      <Glow color="var(--color-pink)" size={720} x="100%" y="96%" opacity={0.14} />
      <DriftWord dark drift={44} className="inset-x-0 bottom-[-4%] text-center text-[32vw] leading-none sm:text-[20vw]">
        receiptly
      </DriftWord>
      <Grain dark />
      <Vignette strength={0.6} />

      <div className="relative z-[1] mx-auto max-w-[860px]">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-bg/40">the last word</p>
        <motion.h2
          {...reveal(0.05)}
          className="mt-6 font-display text-[clamp(2.8rem,8vw,5.2rem)] leading-[0.95] tracking-[-0.02em]"
        >
          Ready to understand
          <br />
          <span className="font-serif italic text-yellow">your money?</span>
        </motion.h2>
        <motion.div {...reveal(0.14)} className="mt-11">
          <Link to="/app" className={CTA}>
            Explore Receiptly →
          </Link>
        </motion.div>
        <motion.p
          {...reveal(0.2)}
          className="mt-6 text-[11px] font-bold uppercase tracking-[0.22em] text-bg/40"
        >
          no signup · opens the demo in one tap
        </motion.p>
      </div>
    </section>
  )
}
