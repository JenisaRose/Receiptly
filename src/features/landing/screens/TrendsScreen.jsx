import Win from './Win'

const BARS = [46, 62, 54, 78, 58, 40]
const MONTHS = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']

export default function TrendsScreen({ className = '' }) {
  return (
    <Win title="RECEIPTLY · TRENDS" className={className}>
      <div className="mb-2.5 flex items-baseline justify-between">
        <span className="text-[12px] font-bold">spending per month</span>
        <span className="rounded-full bg-ink px-2 py-[2px] text-[9px] font-bold text-yellow">
          avg ₹9,400
        </span>
      </div>

      <div className="relative h-[110px]">
        <div className="absolute inset-x-0 top-[38%] z-10 border-t-2 border-dashed border-ink/40" />
        <div className="absolute inset-0 flex items-end gap-1.5 border-b-[3px] border-ink">
          {BARS.map((h, i) => (
            <div
              key={i}
              className={`flex-1 border-[2.5px] border-b-0 border-ink ${
                i === 5 ? 'bg-pink' : i === 3 ? 'bg-orange' : 'bg-lilac'
              }`}
              style={{ height: `${h}%` }}
            />
          ))}
        </div>
      </div>
      <div className="mt-1.5 flex gap-1.5 text-[8.5px] font-semibold opacity-60">
        {MONTHS.map((m, i) => (
          <span key={m} className={`flex-1 text-center ${i === 5 ? 'underline opacity-100' : ''}`}>
            {m}
          </span>
        ))}
      </div>

      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2 border-[2.5px] border-ink bg-mint/60 p-2 shadow-hard-xs">
          <span className="text-[15px]">📉</span>
          <span className="text-[10.5px] font-bold leading-tight">
            Food has cooled ~14% over three months
          </span>
        </div>
        <div className="flex items-center gap-2 border-[2.5px] border-ink bg-pink/50 p-2 shadow-hard-xs">
          <span className="text-[15px]">🌗</span>
          <span className="text-[10.5px] font-bold leading-tight">
            Weekends cost 1.8× your weekdays
          </span>
        </div>
      </div>
    </Win>
  )
}
