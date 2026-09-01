import { forwardRef } from 'react'
import { ordinal, rupee } from '../../../lib/format'
import { BG, HEAT_LEVELS, heatLevel } from '../../../lib/theme'

function Row({ k, children }) {
  return (
    <div className="border-b border-dashed border-ink/40 py-1.5 last:border-b-0">
      <p className="text-[9.5px] font-bold uppercase tracking-wide opacity-55">{k}</p>
      <p className="font-bold leading-snug">{children}</p>
    </div>
  )
}

/**
 * The collectible monthly receipt — the finale of the story and the thing you
 * download. Fixed 360px wide so the on-screen copy and the off-screen PNG
 * capture render identically. Everything is derived from `w` (wrappedData).
 */
const ReceiptArtboard = forwardRef(function ReceiptArtboard({ w }, ref) {
  const streak = w.streakRange
  const noSpendLine =
    streak && streak.length >= 2
      ? `${w.noSpendCount} days · longest run ${streak.length} (${w.monthLabel} ${streak.start}–${streak.end})`
      : `${w.noSpendCount} day${w.noSpendCount === 1 ? '' : 's'}`

  return (
    <div
      ref={ref}
      className="w-[360px] border-4 border-ink bg-white font-body text-[12px] text-ink"
      style={{
        backgroundImage: 'radial-gradient(var(--color-ink) 1px, transparent 1px)',
        backgroundSize: '18px 18px',
      }}
    >
      {/* perforated top edge — fresh off the printer */}
      <div className="flex justify-around px-1 pt-1">
        {Array.from({ length: 16 }).map((_, idx) => (
          <span key={idx} className="h-2 w-2 rounded-full border border-ink bg-white" />
        ))}
      </div>

      <div className="px-5 pb-5 pt-2">
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
            {w.activeDays} active day{w.activeDays === 1 ? '' : 's'} · {w.txCount} tap
            {w.txCount === 1 ? '' : 's'}
          </p>
        </div>

        <div>
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
          <Row k="🧊 no-spend days">{noSpendLine}</Row>
          {w.insight && <Row k="💡 Receiptly spotted">{w.insight.headline}</Row>}
          {w.forecast && <Row k="📈 on pace for">{rupee(w.forecast.projected)} by month-end</Row>}
        </div>

        {/* mini spending heatmap for the whole month */}
        <div className="mt-3 border-t-[3px] border-dashed border-ink pt-3">
          <p className="mb-1.5 text-[9.5px] font-bold uppercase tracking-wide opacity-55">
            every day in {w.monthLabel}
          </p>
          <div className="grid grid-cols-7 gap-[3px]">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
              <span key={`hd-${idx}`} className="text-center text-[7px] font-bold opacity-40">
                {d}
              </span>
            ))}
            {Array.from({ length: w.firstWeekday }).map((_, idx) => (
              <span key={`pad-${idx}`} />
            ))}
            {w.heat.map((v, idx) => {
              const counted = idx + 1 <= w.countUpTo
              const lvl = heatLevel(v)
              return (
                <span
                  key={idx}
                  className={`aspect-square border border-ink ${
                    !counted
                      ? 'bg-white opacity-25'
                      : lvl === 0
                        ? 'bg-white opacity-40'
                        : HEAT_LEVELS[lvl]
                  }`}
                />
              )
            })}
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[8px] font-semibold opacity-55">
            <span>less</span>
            {HEAT_LEVELS.map((c, idx) => (
              <span key={idx} className={`inline-block h-2.5 w-2.5 border border-ink ${c}`} />
            ))}
            <span>more</span>
          </div>
        </div>

        <p className="mt-3 border-t-[3px] border-dashed border-ink pt-3 text-center font-hand text-[16px] font-bold">
          {w.closing}
        </p>

        <div className="mt-2 flex justify-center gap-[3px]">
          {'▮▯▮▮▯▮▯▯▮▮▯▮▮▯▮▯▮▯▮▮▯▮▯▮'.split('').map((c, idx) => (
            <span
              key={idx}
              className={`inline-block h-4 w-[3px] ${c === '▮' ? 'bg-ink' : 'bg-transparent'}`}
            />
          ))}
        </div>
        <p className="mt-1 text-center text-[9px] opacity-45">
          made with Receiptly · receiptly-rho.vercel.app
        </p>

        <div className="mt-2 flex gap-1">
          {['orange', 'mint', 'sky', 'pink', 'lilac', 'yellow'].map((col) => (
            <span key={col} className={`h-1.5 flex-1 border border-ink ${BG[col]}`} />
          ))}
        </div>
      </div>
    </div>
  )
})

export default ReceiptArtboard
