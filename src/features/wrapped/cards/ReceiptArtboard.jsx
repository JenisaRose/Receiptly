import { forwardRef } from 'react'
import { ordinal, rupee } from '../../../lib/format'
import { BG } from '../../../lib/theme'

function Row({ k, children }) {
  return (
    <div className="border-b border-dashed border-ink/40 py-1.5 last:border-b-0">
      <p className="text-[9.5px] font-bold uppercase tracking-wide opacity-55">{k}</p>
      <p className="font-bold leading-snug">{children}</p>
    </div>
  )
}

/**
 * The collectible monthly receipt. Fixed 360px so the PNG capture is exact —
 * the on-screen copy and the off-screen capture copy render identically.
 */
const ReceiptArtboard = forwardRef(function ReceiptArtboard({ w }, ref) {
  const streakLine =
    w.streak.bestRun >= 3
      ? `${w.streak.noSpendDays} days · best run ${w.streak.bestRun}`
      : `${w.streak.noSpendDays} day${w.streak.noSpendDays === 1 ? '' : 's'}`

  return (
    <div
      ref={ref}
      className="w-[360px] border-4 border-ink bg-white p-5 font-body text-[12px] text-ink"
      style={{
        backgroundImage: 'radial-gradient(var(--color-ink) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }}
    >
      <div className="flex items-baseline justify-between border-b-[3px] border-dashed border-ink pb-2">
        <span className="font-display text-[15px]">
          receipt<span className="bg-yellow px-1">ly</span>
        </span>
        <span className="font-hand text-[13px] font-bold opacity-70">monthly receipt</span>
      </div>

      <p className="mt-2 font-hand text-[24px] font-bold">
        {w.monthLabel} {w.year}
      </p>

      <div className="my-3 border-y-[3px] border-dashed border-ink py-3 text-center">
        <p className="text-[10px] font-bold uppercase tracking-wide opacity-60">total flowed out</p>
        <p className="font-display text-[40px] leading-none">{rupee(w.total)}</p>
        <p className="mt-1 text-[10px] font-semibold opacity-60">
          {w.activeDays} active day{w.activeDays === 1 ? '' : 's'} · {w.txCount} taps
        </p>
      </div>

      <div className="space-y-0">
        {w.category && (
          <Row k="🥇 biggest category">
            {w.category.label} · {rupee(w.category.amount)} · {w.category.pct}% of the month
          </Row>
        )}
        {w.priciest && (
          <Row k="💥 priciest day">
            {w.priciest.weekday} the {ordinal(w.priciest.day)} · {rupee(w.priciest.amount)}
          </Row>
        )}
        <Row k="🧊 no-spend days">{streakLine}</Row>
        {w.insight && <Row k="💡 Receiptly spotted">{w.insight.headline}</Row>}
        {w.forecast && (
          <Row k="📈 on pace for">{rupee(w.forecast.projected)} by month-end</Row>
        )}
      </div>

      <p className="mt-3 border-t-[3px] border-dashed border-ink pt-3 text-center font-hand text-[16px] font-bold">
        {w.closing}
      </p>

      <div className="mt-2 flex justify-center gap-[3px]">
        {'▮▯▮▮▯▮▯▯▮▮▯▮▮▯▮▯▮▯▮▮▯▮▯▮'.split('').map((c, i) => (
          <span
            key={i}
            className={`inline-block h-4 w-[3px] ${c === '▮' ? 'bg-ink' : 'bg-transparent'}`}
          />
        ))}
      </div>
      <p className="mt-1 text-center text-[9px] opacity-45">
        made with Receiptly · receiptly-rho.vercel.app
      </p>

      {/* tiny colour flourish so it reads as "Receiptly" at a glance */}
      <div className="mt-2 flex gap-1">
        {['orange', 'mint', 'sky', 'pink', 'lilac', 'yellow'].map((col) => (
          <span key={col} className={`h-1.5 flex-1 border border-ink ${BG[col]}`} />
        ))}
      </div>
    </div>
  )
})

export default ReceiptArtboard
