import { animate, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

/**
 * Animate a number towards `target`. Starts from 0 on mount, then from the
 * current displayed value whenever `target` changes. Shows the target instantly
 * when the user prefers reduced motion.
 */
export function useCountUp(target, { duration = 0.7 } = {}) {
  const reduced = useReducedMotion()
  const [display, setDisplay] = useState(0)
  const from = useRef(0)

  useEffect(() => {
    if (reduced) return
    const controls = animate(from.current, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        from.current = v
        setDisplay(v)
      },
    })
    return () => controls.stop()
  }, [target, duration, reduced])

  return reduced ? target : Math.round(display)
}
