import { motion } from 'framer-motion'
import { useReveal } from './motion'
import { Eyebrow } from './Shell'

/** One feature "chapter" — an editorial headline + explanation on one side,
 *  a live-looking product mockup on the other, sides alternating down the
 *  page. */
export default function FeatureRow({ number, eyebrow, title, body, points = [], flip = false, dark = false, tilt = -2, children }) {
  const reveal = useReveal()

  return (
    <div
      className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
        flip ? 'lg:[&>*:first-child]:order-2' : ''
      }`}
    >
      <motion.div {...reveal(0)}>
        <div className="flex items-baseline gap-3">
          <span className={`font-display text-[15px] ${dark ? 'text-yellow' : 'text-pink'}`}>
            {number}
          </span>
          <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
        </div>
        <h3 className="mt-3 font-display text-[clamp(1.9rem,4.4vw,2.9rem)] leading-[1.04]">
          {title}
        </h3>
        <p className={`mt-4 max-w-[30rem] text-[15.5px] font-semibold leading-snug ${dark ? 'text-bg/70' : 'opacity-70'}`}>
          {body}
        </p>
        {points.length > 0 && (
          <ul className="mt-5 space-y-2">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[13.5px] font-semibold">
                <span className={`mt-0.5 text-[13px] ${dark ? 'text-mint' : 'text-pink'}`}>◆</span>
                <span className={dark ? 'text-bg/80' : ''}>{p}</span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 40, rotate: flip ? -tilt - 3 : tilt + 3 }}
        whileInView={{ opacity: 1, y: 0, rotate: flip ? -tilt : tilt }}
        viewport={{ once: true, margin: '-15% 0px' }}
        transition={{ type: 'spring', stiffness: 150, damping: 20 }}
        className="mx-auto w-full max-w-[360px]"
      >
        {children}
      </motion.div>
    </div>
  )
}
