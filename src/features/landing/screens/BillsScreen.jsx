import Win from './Win'

const BILLS = [
  { emoji: '💡', label: 'Electricity', when: 'due the 5th', amt: '₹1,200', badge: 'TODAY', auto: false },
  { emoji: '🦉', label: 'Duolingo Super', when: 'pays itself', amt: '₹160', badge: '7 DAYS', auto: true },
  { emoji: '🏋️', label: 'Gym', when: 'due the 20th', amt: '₹461', badge: '15 DAYS', auto: false },
  { emoji: '🎧', label: 'Spotify', when: 'pays itself', amt: '₹119', badge: '17 DAYS', auto: true },
]

export default function BillsScreen({ className = '' }) {
  return (
    <Win title="RECEIPTLY · BILLS" className={className}>
      <p className="font-display text-[15px]">₹6,500 in bills this month</p>
      <p className="mt-0.5 text-[10px] font-semibold opacity-60">
        ₹1,660 in the next 7 days · subtracted before safe-to-spend
      </p>

      <div className="mt-3 space-y-2">
        {BILLS.map((b) => (
          <div
            key={b.label}
            className="flex items-center gap-2.5 border-[2.5px] border-ink bg-white p-2 shadow-hard-xs"
          >
            <span className="flex h-8 w-9 shrink-0 flex-col items-center justify-center border-2 border-ink bg-lilac/60 text-[7px] font-bold leading-none">
              {b.badge}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex items-center gap-1 text-[10.5px] font-bold">
                {b.emoji} {b.label}
                {b.auto && (
                  <span className="rounded-full border border-ink bg-mint px-1 text-[7px]">
                    🔁 auto
                  </span>
                )}
              </span>
              <span className="text-[8.5px] opacity-55">{b.when}</span>
            </span>
            <span className="font-display text-[11px]">{b.amt}</span>
          </div>
        ))}
      </div>
    </Win>
  )
}
