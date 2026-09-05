import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useReveal } from '../motion'

const CTA =
  'press inline-flex items-center justify-center border-[3px] border-bg bg-bg px-9 py-4 font-display text-[16px] text-ink shadow-[7px_7px_0_var(--color-pink)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-bg'

export default function FinalCta() {
  const reveal = useReveal()

  return (
    <section className="bg-ink px-5 py-28 text-center text-bg sm:py-32 lg:px-8">
      <motion.h2
        {...reveal(0)}
        className="mx-auto max-w-[26rem] font-display text-[clamp(2.2rem,6.5vw,3.6rem)] leading-[1.05]"
      >
        Ready to understand your money?
      </motion.h2>
      <motion.div {...reveal(0.1)} className="mt-9">
        <Link to="/app" className={CTA}>
          Explore Receiptly →
        </Link>
      </motion.div>
    </section>
  )
}
