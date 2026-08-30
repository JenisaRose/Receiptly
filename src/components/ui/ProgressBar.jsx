import { motion } from 'framer-motion'

/**
 * A bordered track with a fill that animates from 0 to `value` (0–1).
 * `fill` is a Tailwind bg-* class or one of the striped helpers.
 */
export default function ProgressBar({ value, fill = 'bg-lilac', className = '', height = 14 }) {
  return (
    <div
      className={`relative overflow-hidden border-[2.5px] border-ink bg-bg ${className}`}
      style={{ height }}
    >
      <motion.div
        className={`absolute inset-y-0 left-0 ${fill}`}
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(Math.max(value, 0), 1) * 100}%` }}
        transition={{ duration: 0.8, ease: [0.2, 0.8, 0.3, 1], delay: 0.1 }}
      />
    </div>
  )
}
