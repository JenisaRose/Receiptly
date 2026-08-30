import { useCountUp } from '../../hooks/useCountUp'
import { inr } from '../../lib/format'

/** A rupee amount that counts up to its value on mount and on change. */
export default function Money({ value, prefix = '₹', duration }) {
  const shown = useCountUp(value, { duration })
  return (
    <span className="tabular-nums">
      {prefix}
      {inr(shown)}
    </span>
  )
}
