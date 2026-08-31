import { forwardRef } from 'react'
import { inr, rupee } from '../../lib/format'
import { BG } from '../../lib/theme'
import { useBudget } from '../../store/budgetContext'

/**
 * The shareable artefact — a fixed 360px-wide "receipt" for the selected month.
 * Rendered on screen in the share modal and captured to PNG from there.
 */
const ReceiptCard = forwardRef(function ReceiptCard(_props, ref) {
  const b = useBudget()
  const r = b.reflection
  const cats = b.categoryBreakdown('month').slice(0, 4)
  const max = Math.max(1, ...cats.map((c) => c.spent))

  return (
    <div
      ref={ref}
      className="w-[360px] border-4 border-ink bg-white p-5 font-body text-ink"
      style={{
        backgroundImage: 'radial-gradient(var(--color-ink) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }}
    >
      <div className="border-b-[3px] border-dashed border-ink pb-3">
        <p className="font-display text-[15px]">
          receipt<span className="bg-yellow px-1">ly</span>
        </p>
        <p className="mt-1 font-hand text-[20px] font-bold">{r.monthLabel}, wrapped</p>
      </div>

      <div className="border-b-[3px] border-dashed border-ink py-3 text-center">
        <p className="text-[11px] font-bold uppercase tracking-wide opacity-60">total flowed out</p>
        <p className="font-display text-[38px] leading-none">{rupee(r.total)}</p>
        <p className="mt-1 text-[11px] font-semibold">{r.vsPrev}</p>
      </div>

      <div className="space-y-1.5 border-b-[3px] border-dashed border-ink py-3">
        {cats.map((c) => (
          <div key={c.id} className="flex items-center gap-2">
            <span className="w-[70px] shrink-0 text-[11px] font-bold">{c.label}</span>
            <span className="relative h-3.5 flex-1 border-[2px] border-ink bg-bg">
              <span
                className={`absolute inset-y-0 left-0 ${BG[c.color]}`}
                style={{ width: `${(c.spent / max) * 100}%` }}
              />
            </span>
            <span className="w-[52px] shrink-0 text-right text-[11px] font-bold">
              ₹{inr(c.spent)}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 py-3 text-[11px] font-semibold">
        <p>🥇 {r.cards[0].v} led the month</p>
        <p>
          🧊 {r.cards[1].v} no-spend day{r.cards[1].v === '1' ? '' : 's'}
        </p>
        <p>💥 priciest: {r.cards[2].v}</p>
        <p>🎯 cap held {r.cards[3].v}</p>
      </div>

      <p className="border-t-[3px] border-dashed border-ink pt-3 text-center font-hand text-[15px] font-bold">
        {r.note}
      </p>
      <p className="mt-2 text-center text-[9px] opacity-45">made with Receiptly · receiptly-rho.vercel.app</p>
    </div>
  )
})

export default ReceiptCard
