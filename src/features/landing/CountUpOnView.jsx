import { useInView } from 'framer-motion'
import { useRef } from 'react'
import { useCountUp } from '../../hooks/useCountUp'

/** Renders a number that counts up from 0 the first time it scrolls into
 *  view, reusing the same animation the app itself uses on Today. */
export default function CountUpOnView({ value, duration = 1.1, format = (n) => n, className }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-10% 0px' })
  const display = useCountUp(inView ? value : 0, { duration })
  return (
    <span ref={ref} className={className}>
      {format(display)}
    </span>
  )
}
