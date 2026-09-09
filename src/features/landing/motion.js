import { useReducedMotion } from 'framer-motion'

/** Scroll-triggered "fade + rise" reveal, respecting prefers-reduced-motion.
 *  `reveal(delay)` spreads onto a motion element's props. */
export function useReveal() {
  const reduced = useReducedMotion()
  return (delay = 0, distance = 28) => ({
    initial: reduced ? false : { opacity: 0, y: distance },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-12% 0px' },
    transition: { type: 'spring', stiffness: 210, damping: 26, delay },
  })
}

/** A slow, gentle vertical float loop for stickers/mockups — off entirely
 *  under reduced motion. */
export function useFloat(range = 8, duration = 4) {
  const reduced = useReducedMotion()
  if (reduced) return {}
  return {
    animate: { y: [0, -range, 0] },
    transition: { duration, repeat: Infinity, ease: 'easeInOut' },
  }
}
