const STATS = [
  { label: 'Spent so far', value: '₹6,420', bg: 'bg-pink' },
  { label: 'Left to spend', value: '₹8,680', bg: 'bg-mint' },
  { label: 'Days left', value: '11', bg: 'bg-lilac' },
  { label: 'Daily pace', value: '₹790', bg: 'bg-sky' },
]

/** A static, illustrative slice of the Today screen — same borders, shadows
 *  and colour tokens as the real app, hand-authored rather than rendered
 *  live so the landing page stays fully decoupled from app state. */
export default function AppPreviewMockup({ className = '' }) {
  return (
    <div
      aria-hidden
      className={`rotate-[1.2deg] border-4 border-ink bg-bg p-4 shadow-hard-lg sm:p-5 ${className}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-[9px] font-bold tracking-[0.18em] opacity-45">RECEIPTLY</p>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border-[2.5px] border-ink bg-pink text-[10px] font-bold">
          RP
        </span>
      </div>

      <div className="relative mt-3 flex justify-center py-3">
        <span className="absolute right-2 top-0 text-base">✦</span>
        <div className="flex h-[132px] w-[132px] flex-col items-center justify-center rounded-full border-[3px] border-ink bg-yellow text-center shadow-hard-sm">
          <span className="px-4 font-hand text-[11px] font-bold leading-tight">
            today you can spend
          </span>
          <span className="my-0.5 font-display text-[24px] leading-none">
            <span className="text-[12px]">₹</span>790
          </span>
          <span className="rounded-full bg-ink px-2 py-[2px] text-[8px] font-bold text-yellow">
            on track 👍
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2">
        {STATS.map((s) => (
          <div key={s.label} className={`border-[2.5px] border-ink p-2 shadow-hard-xs ${s.bg}`}>
            <p className="text-[7.5px] font-bold uppercase tracking-wide opacity-70">{s.label}</p>
            <p className="mt-0.5 font-display text-[13px]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-2.5 -rotate-[0.6deg] border-[2.5px] border-ink bg-white p-2.5 shadow-hard-xs">
        <p className="font-hand text-[13px] font-bold">💡 Food has dropped 3 months running</p>
      </div>
    </div>
  )
}
