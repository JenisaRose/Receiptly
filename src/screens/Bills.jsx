import { rupee } from '../lib/format'
import { useBudget } from '../store/budgetContext'

export default function Bills() {
  const b = useBudget()
  const today = b.month.dayOfMonth

  const sorted = [...b.bills].sort(
    (a, c) => Number(a.paid) - Number(c.paid) || a.dueDay - c.dueDay,
  )

  return (
    <div className="space-y-4">
      <div className="border-[3px] border-ink bg-pink p-4 shadow-hard">
        <p className="font-display text-[20px]">{rupee(b.billsTotal)} in bills this month</p>
        <p className="mt-0.5 text-[12px] font-semibold">
          {rupee(b.next7Total)} lands in the next 7 days · all subtracted before your safe-to-spend
        </p>
      </div>

      <h2 className="inline-block -rotate-1 font-hand text-[21px] font-bold">what’s coming up</h2>

      <div className="space-y-2.5">
        {sorted.map((bill) => {
          const away = bill.dueDay - today
          const soon = !bill.paid && away >= 0 && away <= 7
          let big, small
          if (bill.paid) [big, small] = ['✓', 'paid']
          else if (away <= 0) [big, small] = ['!', 'today']
          else [big, small] = [away, away === 1 ? 'day' : 'days']

          return (
            <div
              key={bill.id}
              className={`flex items-center gap-3 border-[3px] border-ink p-3 ${
                bill.paid
                  ? 'bg-white opacity-55'
                  : soon
                    ? 'bg-yellow shadow-hard-sm'
                    : 'bg-white shadow-hard-sm'
              }`}
            >
              <div className="flex h-[46px] w-[46px] shrink-0 flex-col items-center justify-center border-[2.5px] border-ink bg-bg leading-none">
                <b className="font-display text-base">{big}</b>
                <span className="text-[8.5px] font-bold uppercase">{small}</span>
              </div>
              <div className="flex-1">
                <p className="text-[13.5px] font-bold">
                  {bill.emoji} {bill.name}
                  <span className="ml-1.5 rounded-full border-2 border-ink px-1.5 align-middle text-[9px] font-bold">
                    {bill.freq}
                  </span>
                </p>
                <p className="mt-px text-[10.5px] opacity-65">
                  {bill.paid ? 'paid' : 'due'} on the {bill.dueDay}th
                </p>
              </div>
              <span className="font-display text-[15px]">{rupee(bill.amount)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
