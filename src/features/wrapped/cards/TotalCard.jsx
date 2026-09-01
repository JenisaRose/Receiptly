import { useCountUp } from '../../../hooks/useCountUp'
import { inr } from '../../../lib/format'
import CardShell from './CardShell'

export default function TotalCard({ w }) {
  const shown = useCountUp(w.total, { duration: 1.5 })
  return (
    <CardShell accent="bg-pink" className="text-center">
      <p className="font-hand text-[20px] font-bold">this month you spent</p>
      <p className="my-2 font-display text-[46px] leading-none tabular-nums">₹{inr(shown)}</p>
      <p className="text-[13px] font-semibold">
        across {w.activeDays} day{w.activeDays === 1 ? '' : 's'} · {w.txCount} tap
        {w.txCount === 1 ? '' : 's'}
      </p>
    </CardShell>
  )
}
