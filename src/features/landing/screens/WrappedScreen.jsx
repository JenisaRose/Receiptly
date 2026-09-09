import Win from './Win'

const HEAT = Array.from({ length: 30 }, (_, i) =>
  [1, 4, 8, 12, 15, 19, 23, 27].includes(i)
    ? 'bg-ink/10'
    : i % 4 === 0
      ? 'bg-pink'
      : i % 3 === 0
        ? 'bg-yellow/70'
        : 'bg-mint/60',
)

export default function WrappedScreen({ className = '' }) {
  return (
    <Win title="RECEIPTLY · REFLECT" className={className}>
      <p className="font-hand text-[16px] font-bold">your month, wrapped</p>
      <p className="font-display text-[24px] leading-none">September</p>
      <p className="mt-0.5 text-[9.5px] font-semibold opacity-55">
        ₹8,389 flowed out · ₹1,240 less than August
      </p>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="border-[2.5px] border-ink bg-mint/60 p-2 shadow-hard-xs">
          <p className="text-[7px] font-bold uppercase tracking-wide opacity-60">Biggest</p>
          <p className="font-display text-[12px]">Transport</p>
        </div>
        <div className="border-[2.5px] border-ink bg-sky/60 p-2 shadow-hard-xs">
          <p className="text-[7px] font-bold uppercase tracking-wide opacity-60">No-spend days</p>
          <p className="font-display text-[12px]">16</p>
        </div>
        <div className="border-[2.5px] border-ink bg-lilac/60 p-2 shadow-hard-xs">
          <p className="text-[7px] font-bold uppercase tracking-wide opacity-60">Priciest day</p>
          <p className="font-display text-[12px]">Fri 14 · ₹1,349</p>
        </div>
        <div className="border-[2.5px] border-ink bg-pink/50 p-2 shadow-hard-xs">
          <p className="text-[7px] font-bold uppercase tracking-wide opacity-60">Weekly cap</p>
          <p className="font-display text-[12px]">5 / 5 held</p>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-[repeat(15,minmax(0,1fr))] gap-[3px]">
        {HEAT.map((c, i) => (
          <span key={i} className={`h-2 rounded-[1.5px] ${c}`} />
        ))}
      </div>

      <div className="mt-3 border-[2.5px] border-ink bg-ink px-3 py-2 text-center text-[10px] font-bold text-yellow">
        ▶ play your month
      </div>
    </Win>
  )
}
