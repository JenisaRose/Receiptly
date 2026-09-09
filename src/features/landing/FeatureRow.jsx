import { motion } from 'framer-motion'
import Glow from './Glow'
import { useFloat } from './motion'
import { Label } from './Shell'

/** A floating annotation pill that sits around a feature mockup — fills the
 *  space next to the text and reinforces what the screen shows. */
function Chip({ text, cls, delay, float }) {
  return (
    <motion.span
      {...float}
      initial={{ opacity: 0, scale: 0.7 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-10% 0px' }}
      transition={{ type: 'spring', stiffness: 220, damping: 15, delay }}
      className={`absolute z-20 whitespace-nowrap rounded-full border-[2.5px] border-ink bg-white px-3 py-1.5 text-[11px] font-bold shadow-hard-sm ${cls}`}
    >
      {text}
    </motion.span>
  )
}

/** One feature "chapter" — headline + explanation on one side, a live-looking
 *  product mockup wrapped in a full stage (glow, big number, floating
 *  callouts) on the other, sides alternating down the page. */
export default function FeatureRow({
  number,
  eyebrow,
  title,
  body,
  points = [],
  chips = [],
  accent = 'var(--color-pink)',
  flip = false,
  dark = false,
  tilt = -2,
  children,
}) {
  const f1 = useFloat(7, 4)
  const f2 = useFloat(6, 3.4)
  const f3 = useFloat(8, 4.6)
  const floats = [f1, f2, f3]
  const rise = (delay = 0) => ({
    initial: { opacity: 0, y: 28 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-12% 0px' },
    transition: { type: 'spring', stiffness: 210, damping: 24, delay },
  })

  return (
    <div
      className={`grid items-center gap-14 lg:grid-cols-2 lg:gap-10 ${
        flip ? 'lg:[&>*:first-child]:order-2' : ''
      }`}
    >
      <motion.div {...rise(0)}>
        <Label dark={dark}>
          <span className={dark ? 'text-yellow' : 'text-pink'}>{number}</span>
          <span className={dark ? 'text-yellow/40' : 'text-ink/25'}>/</span> {eyebrow}
        </Label>
        <h3 className="mt-4 font-display text-[clamp(2rem,4.8vw,3.1rem)] leading-[1]">{title}</h3>
        <p
          className={`mt-5 max-w-[30rem] text-[16px] font-semibold leading-snug ${
            dark ? 'text-bg/70' : 'opacity-70'
          }`}
        >
          {body}
        </p>
        {points.length > 0 && (
          <ul className="mt-6 space-y-2.5">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-2.5 text-[14px] font-semibold">
                <span className={`mt-1 text-[11px] ${dark ? 'text-mint' : 'text-pink'}`}>◆</span>
                <span className={dark ? 'text-bg/85' : ''}>{p}</span>
              </li>
            ))}
          </ul>
        )}
      </motion.div>

      <div className="relative mx-auto flex min-h-[440px] w-full max-w-[420px] items-center justify-center py-6">
        <Glow color={accent} size={720} x="50%" y="48%" opacity={dark ? 0.28 : 0.4} />
        <span
          aria-hidden
          className={`pointer-events-none absolute select-none font-display leading-none ${
            flip ? 'left-0 -top-2' : 'right-0 -top-2'
          } text-[9rem] ${dark ? 'text-bg/[0.06]' : 'text-ink/[0.06]'}`}
        >
          {number}
        </span>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: flip ? -tilt - 3 : tilt + 3 }}
          whileInView={{ opacity: 1, y: 0, rotate: flip ? -tilt : tilt }}
          viewport={{ once: true, margin: '-15% 0px' }}
          transition={{ type: 'spring', stiffness: 150, damping: 20 }}
          className="relative z-10 w-[300px] sm:w-[330px]"
        >
          {children}
        </motion.div>

        {chips.map((c, i) => (
          <Chip key={c.text} {...c} delay={0.4 + i * 0.12} float={floats[i % 3]} />
        ))}
      </div>
    </div>
  )
}
