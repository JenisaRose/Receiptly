import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import Grain from '../Grain'
import Glow from '../Glow'
import { useReveal } from '../motion'
import { DARK_BG } from '../texture'

const CTA =
  'press inline-flex items-center justify-center border-[3px] border-bg bg-bg px-10 py-5 font-display text-[17px] text-ink shadow-[8px_8px_0_var(--color-pink)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-bg'

export default function FinalCta() {
  const reveal = useReveal()

  return (
    <section
      style={{ background: DARK_BG }}
      className="relative overflow-hidden px-5 py-24 text-center text-bg sm:py-28 lg:px-8"
    >
      <Glow color="#c9b8ff" size={820} x="50%" y="16%" opacity={0.24} />
      <Glow color="#79f2c0" size={620} x="8%" y="100%" opacity={0.18} />
      <Glow color="#ff6fb0" size={620} x="94%" y="94%" opacity={0.18} />
      <Grain dark />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 select-none text-center font-display text-[26vw] leading-none text-bg/[0.04] sm:text-[18vw]"
      >
        receiptly
      </span>
      <div className="relative z-[1] mx-auto max-w-[820px]">
        <motion.h2
          {...reveal(0)}
          className="font-display text-[clamp(2.6rem,7.5vw,4.6rem)] leading-[1] tracking-[-0.02em]"
        >
          Ready to understand
          <br />
          your money?
        </motion.h2>
        <motion.div {...reveal(0.1)} className="mt-10">
          <Link to="/app" className={CTA}>
            Explore Receiptly →
          </Link>
        </motion.div>
        <motion.p {...reveal(0.16)} className="mt-5 text-[12px] font-bold uppercase tracking-[0.2em] text-bg/40">
          no signup · opens the demo in one tap
        </motion.p>
      </div>
    </section>
  )
}
