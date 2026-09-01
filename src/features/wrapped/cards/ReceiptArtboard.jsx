import { forwardRef } from 'react'
import { ordinal, rupee } from '../../../lib/format'
import { BG, HEAT_LEVELS, heatLevel } from '../../../lib/theme'

// warm thermal-paper stock — bright enough that near-black text stays crisp
const PAPER = '#f6f0e1'
const MONO =
  'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'

function Row({ k, children }) {
  return (
    <div className="flex gap-2 border-b border-dashed border-ink/30 py-[7px] last:border-b-0">
      <span className="mt-[1px] shrink-0 text-[9px] font-bold uppercase tracking-[0.1em] text-ink/50">
        {k}
      </span>
      <span className="flex-1 text-right font-semibold leading-snug">{children}</span>
    </div>
  )
}

/**
 * The collectible monthly receipt — the finale of the story and the thing you
 * download. Styled like a real till receipt (clean warm paper, monospace) so
 * the numbers read easily. Fixed 360px wide so the on-screen copy and the
 * off-screen PNG capture render identically. All values come from `w`.
 */
const ReceiptArtboard = forwardRef(function ReceiptArtboard({ w }, ref) {
  const streak = w.streakRange
  const noSpendLine =
    streak && streak.length >= 2
      ? `${w.noSpendCount} days · run of ${streak.length} (${w.monthLabel.slice(0, 3)} ${streak.start}–${streak.end})`
      : `${w.noSpendCount} day${w.noSpendCount === 1 ? '' : 's'}`
  const receiptNo = `${(w.monthKey ?? '').replace('-', '')}-${String(Math.round(w.total)).padStart(5, '0')}`

  return (
    <div
      ref={ref}
      className="w-[360px] border-4 border-ink text-[12px] text-ink"
      style={{ background: PAPER, fontFamily: MONO }}
    >
      {/* perforated top edge — fresh off the printer */}
      <div className="flex justify-around px-1 pt-1">
        {Array.from({ length: 16 }).map((_, idx) => (
          <span
            key={idx}
            className="h-2 w-2 rounded-full border border-ink/60"
            style={{ background: PAPER }}
          />
        ))}
      </div>

      <div className="px-5 pb-5 pt-3">
        {/* store header */}
        <div className="text-center">
          <span className="font-display text-[17px] tracking-tight">
            receipt<span className="bg-yellow px-1">ly</span>
          </span>
          <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.32em] text-ink/60">
            monthly statement
          </p>
        </div>

        <div className="my-2.5 border-t-2 border-dashed border-ink/50" />

        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wide">
          <span>
            {w.monthLabel} {w.year}
          </span>
          <span className="text-ink/50">No. {receiptNo}</span>
        </div>

        {/* total */}
        <div className="my-3 border-y-2 border-ink py-3 text-center">
          <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-ink/60">
            total flowed out
          </p>
          <p className="font-display text-[38px] leading-none tracking-tight">{rupee(w.total)}</p>
          <p className="mt-1 text-[10px] text-ink/60">
            {w.activeDays} active day{w.activeDays === 1 ? '' : 's'} · {w.txCount} tap
            {w.txCount === 1 ? '' : 's'}
          </p>
        </div>

        <div>
          {w.category && (
            <Row k="category">
              {w.category.label} — {rupee(w.category.amount)} ({w.category.pct}%)
            </Row>
          )}
          {w.priciest && (
            <Row k="priciest day">
              {w.priciest.weekday} {ordinal(w.priciest.day)} — {rupee(w.priciest.amount)}
            </Row>
          )}
          <Row k="no-spend days">{noSpendLine}</Row>
          {w.insight && <Row k="spotted">{w.insight.headline}</Row>}
          {w.forecast && <Row k="on pace for">{rupee(w.forecast.projected)} by month-end</Row>}
        </div>

        {/* mini spending heatmap for the whole month */}
        <div className="mt-3 border-t-2 border-dashed border-ink/50 pt-3">
          <p className="mb-1.5 text-[9px] font-bold uppercase tracking-[0.1em] text-ink/55">
            every day in {w.monthLabel}
          </p>
          <div className="grid grid-cols-7 gap-[3px]">
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
              <span key={`hd-${idx}`} className="text-center text-[7px] font-bold text-ink/45">
                {d}
              </span>
            ))}
            {Array.from({ length: w.firstWeekday }).map((_, idx) => (
              <span key={`pad-${idx}`} />
            ))}
            {w.heat.map((v, idx) => {
              const counted = idx + 1 <= w.countUpTo
              const lvl = counted ? heatLevel(v) : 0
              return (
                <span
                  key={idx}
                  className={`aspect-square border ${
                    lvl === 0 ? 'border-ink/25' : `border-ink ${HEAT_LEVELS[lvl]}`
                  }`}
                  style={lvl === 0 ? { background: PAPER } : undefined}
                />
              )
            })}
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-[8px] font-bold text-ink/55">
            <span>less</span>
            {HEAT_LEVELS.map((c, idx) => (
              <span
                key={idx}
                className={`inline-block h-2.5 w-2.5 border border-ink ${idx === 0 ? '' : c}`}
                style={idx === 0 ? { background: PAPER } : undefined}
              />
            ))}
            <span>more</span>
          </div>
        </div>

        <div className="my-3 border-t-2 border-dashed border-ink/50" />

        <p className="text-center font-hand text-[17px] font-bold">{w.closing}</p>

        {/* barcode */}
        <div className="mt-3 flex justify-center gap-[2px]">
          {'▮▯▮▮▯▮▯▯▮▮▯▮▮▯▮▯▮▯▮▮▯▮▯▮▮▯▮▯▮▮▯'.split('').map((c, idx) => (
            <span
              key={idx}
              className={`inline-block h-9 w-[2px] ${c === '▮' ? 'bg-ink' : ''}`}
              style={c === '▮' ? undefined : { background: PAPER }}
            />
          ))}
        </div>
        <p className="mt-1 text-center text-[8.5px] tracking-[0.18em] text-ink/50">{receiptNo}</p>
        <p className="mt-2 text-center text-[9px] text-ink/45">
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
