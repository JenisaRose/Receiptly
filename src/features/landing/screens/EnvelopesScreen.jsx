import Win from './Win'

const ENV = [
  { emoji: '🍜', label: 'Food', spent: 2400, total: 3800, tag: 'on track', tagBg: 'bg-mint' },
  { emoji: '🚕', label: 'Transport', spent: 2180, total: 2500, tag: 'close', tagBg: 'bg-yellow' },
  { emoji: '✨', label: 'Fun', spent: 1050, total: 900, tag: 'over ₹150', tagBg: 'bg-pink' },
]

export default function EnvelopesScreen({ className = '' }) {
  return (
    <Win title="RECEIPTLY · ENVELOPES" className={className}>
      <div className="border-[2.5px] border-ink bg-orange p-3 shadow-hard-xs">
        <p className="font-display text-[15px]">₹12,900 across 6 envelopes</p>
        <p className="mt-0.5 text-[10px] font-semibold">₹1,120 used · ₹500 rolled over</p>
      </div>

      <div className="mt-3 space-y-2.5">
        {ENV.map((e) => (
          <div key={e.label} className="border-[2.5px] border-ink bg-white p-2.5 shadow-hard-xs">
            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[11px] font-bold">
                {e.emoji} {e.label}
              </span>
              <span
                className={`rounded-full border-2 border-ink px-1.5 py-[1px] text-[8px] font-bold ${e.tagBg}`}
              >
                {e.tag}
              </span>
            </div>
            <p className="my-1.5 text-[9.5px]">
              <b className="font-display text-[10.5px]">₹{e.spent.toLocaleString('en-IN')}</b> of ₹
              {e.total.toLocaleString('en-IN')}
            </p>
            <div className="h-2 border-2 border-ink bg-white">
              <div
                className={e.spent > e.total ? 'h-full bg-pink' : 'h-full bg-mint'}
                style={{ width: `${Math.min(100, (e.spent / e.total) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Win>
  )
}
