import EmptyState from '../components/EmptyState'
import { ordinal, rupee } from '../lib/format'
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

      {sorted.length === 0 ? (
        <EmptyState
          emoji="🔁"
          title="no recurring bills yet"
          hint="add rent, subscriptions or anything else that repeats every month in settings"
        />
      ) : (
        <div className="space-y-2.5">
          {sorted.map((bill) => {
            const away = bill.dueDay - today
            const soon = !bill.paid && away >= 0 && away <= 7
            let big, small
            if (bill.paid) [big, small] = ['✓', 'paid']
            else if (away <= 0) [big, small] = ['!', 'today']
            else [big, small] = [away, away === 1 ? 'day' : 'days']

            return (
              <button
                key={bill.id}
                type="button"
                onClick={() => b.toggleBillPaid(bill.id)}
                aria-pressed={bill.paid}
                className={`press flex w-full items-center gap-3 border-[3px] border-ink p-3 text-left ${
                  bill.paid
                    ? 'bg-white opacity-55'
                    : soon
                      ? 'bg-yellow shadow-hard-sm'
                      : 'bg-white shadow-hard-sm'
                }`}
                style={{ '--press-x': '3px', '--press-y': '3px' }}
              >
                <div className="flex h-[46px] w-[46px] shrink-0 flex-col items-center justify-center border-[2.5px] border-ink bg-bg leading-none">
                  <b className="font-display text-base">{big}</b>
                  <span className="text-[8.5px] font-bold uppercase">{small}</span>
                </div>
                <div className="flex-1">
                  <p className="text-[13.5px] font-bold">
                    {bill.emoji} {bill.name}
                    {bill.autopay && (
                      <span className="ml-1.5 rounded-full border-2 border-ink bg-mint px-1.5 align-middle text-[9px] font-bold">
                        🔁 auto
                      </span>
                    )}
                  </p>
                  <p className="mt-px text-[10.5px] opacity-65">
                    {bill.paid ? 'paid' : 'due'} on the {ordinal(bill.dueDay)}
                    {bill.autopay && !bill.paid ? ' · pays itself' : ''} · tap to{' '}
                    {bill.paid ? 'undo' : 'mark paid'}
                  </p>
                </div>
                <span className="font-display text-[15px]">{rupee(bill.amount)}</span>
              </button>
            )
          })}
        </div>
      )}

      <p className="text-center text-[11px] opacity-45">manage recurring bills in settings</p>
    </div>
  )
}
