import Win from './Win'

const STATS = [
  { label: 'Spent so far', value: '₹6,420', bg: 'bg-pink' },
  { label: 'Left to spend', value: '₹8,680', bg: 'bg-mint' },
  { label: 'Days left', value: '11', bg: 'bg-lilac' },
  { label: 'Daily pace', value: '₹790', bg: 'bg-sky' },
]

export default function TodayScreen({ className = '' }) {
  return (
    <Win title="RECEIPTLY · TODAY" className={className}>
      <div className="mb-3 flex items-center justify-between">
        <p className="font-display text-[15px]">Today</p>
        <span className="flex h-7 w-7 items-center justify-center rounded-full border-2 border-ink bg-pink text-[9px] font-bold">
          RP
        </span>
      </div>

      <div className="flex justify-center py-2">
        <div className="flex h-[150px] w-[150px] flex-col items-center justify-center rounded-full border-[3px] border-ink bg-yellow text-center shadow-hard-sm">
          <span className="px-6 font-hand text-[13px] font-bold leading-tight">
            today you can spend
          </span>
          <span className="my-1 font-display text-[30px] leading-none">
            <span className="text-[15px]">₹</span>340
          </span>
          <span className="rounded-full bg-ink px-2.5 py-[3px] text-[9px] font-bold text-yellow">
            go easy 👀
          </span>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2.5">
        {STATS.map((s) => (
          <div key={s.label} className={`border-[2.5px] border-ink p-2.5 shadow-hard-xs ${s.bg}`}>
            <p className="text-[8px] font-bold uppercase tracking-wide opacity-70">{s.label}</p>
            <p className="mt-0.5 font-display text-[15px]">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 border-[2.5px] border-ink bg-white p-3 shadow-hard-xs">
        <div className="flex items-baseline justify-between">
          <span className="font-hand text-[15px] font-bold">headed for</span>
          <span className="rounded-full border-2 border-ink bg-mint px-2 py-[1px] text-[9px] font-bold">
            ₹5 spare
          </span>
        </div>
        <p className="font-display text-[19px] leading-tight">₹9,995</p>
        <svg viewBox="0 0 240 40" className="mt-1 w-full">
          <line x1="0" y1="34" x2="240" y2="34" stroke="var(--color-ink)" strokeWidth="2" />
          <polyline
            points="0,32 60,24 120,20 180,14"
            fill="none"
            stroke="var(--color-mint)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M180 14 L240 8"
            fill="none"
            stroke="var(--color-mint)"
            strokeWidth="2.5"
            strokeDasharray="4 3"
          />
        </svg>
      </div>

      <div className="mt-3 border-[2.5px] border-ink bg-lilac/50 p-3 shadow-hard-xs">
        <div className="flex items-center justify-between text-[11px] font-bold">
          <span>🎯 Goa trip fund</span>
          <span className="opacity-60">₹9,000 / ₹15,000</span>
        </div>
        <div className="mt-2 h-2.5 border-2 border-ink bg-white">
          <div className="h-full bg-pink" style={{ width: '60%' }} />
        </div>
      </div>
    </Win>
  )
}
