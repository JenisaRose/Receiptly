import { rupee } from '../../../lib/format'
import FormPanel from '../FormPanel'
import RupeeInput from '../RupeeInput'

const PRESETS = [
  { emoji: '🏠', name: 'Rent', dueDay: 1 },
  { emoji: '📱', name: 'Phone', dueDay: 5 },
  { emoji: '🎵', name: 'Subscriptions', dueDay: 10 },
  { emoji: '💡', name: 'Electricity', dueDay: 8 },
  { emoji: '🛜', name: 'Wifi', dueDay: 3 },
  { emoji: '💪', name: 'Gym', dueDay: 15 },
]

let seq = 0
const nextId = () => `bill-${Date.now()}-${seq++}`

export default function BillsStep({ data, set, onBack, onContinue, onSkip }) {
  const bills = data.bills
  const total = bills.reduce((s, b) => s + (Number(b.amount) || 0), 0)
  const usedNames = new Set(bills.map((b) => b.name.toLowerCase()))

  const add = (preset) =>
    set({
      bills: [
        ...bills,
        { id: nextId(), emoji: preset?.emoji ?? '🧾', name: preset?.name ?? '', amount: 0, dueDay: preset?.dueDay ?? 1 },
      ],
    })
  const update = (id, patch) =>
    set({ bills: bills.map((b) => (b.id === id ? { ...b, ...patch } : b)) })
  const remove = (id) => set({ bills: bills.filter((b) => b.id !== id) })

  return (
    <FormPanel
      n={2}
      accent="sky"
      eyebrow="section two"
      title="What has to be paid every month?"
      onBack={onBack}
      onContinue={onContinue}
      onSkip={onSkip}
      canContinue
    >
      {/* preset chips */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.filter((p) => !usedNames.has(p.name.toLowerCase())).map((p) => (
          <button
            key={p.name}
            onClick={() => add(p)}
            className="press border-[3px] border-ink bg-white px-2.5 py-1.5 text-[12px] font-semibold shadow-hard-xs"
            style={{ '--press-x': '2px', '--press-y': '2px' }}
          >
            {p.emoji} {p.name} +
          </button>
        ))}
      </div>

      {/* rows */}
      {bills.length > 0 && (
        <div className="mt-4 space-y-2">
          {bills.map((b) => (
            <div key={b.id} className="flex items-center gap-2 border-[3px] border-ink bg-white p-2">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 border-ink bg-sky text-[15px]">
                {b.emoji}
              </span>
              <input
                value={b.name}
                onChange={(e) => update(b.id, { name: e.target.value })}
                placeholder="what for?"
                className="min-w-0 flex-1 bg-transparent text-[13px] font-semibold outline-none placeholder:opacity-35"
              />
              <div className="w-[92px] shrink-0 border-l-2 border-dashed border-ink/30 pl-2">
                <RupeeInput
                  size="row"
                  value={b.amount}
                  onChange={(amount) => update(b.id, { amount })}
                  placeholder="0"
                  ariaLabel={`${b.name || 'bill'} amount`}
                />
              </div>
              <button
                onClick={() => remove(b.id)}
                aria-label={`Remove ${b.name || 'bill'}`}
                className="grid h-7 w-7 shrink-0 place-items-center border-2 border-ink bg-white text-[11px] font-bold active:bg-pink"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={() => add(null)}
        className="press mt-3 w-full border-[3px] border-dashed border-ink/50 py-2 font-hand text-[16px] font-bold"
      >
        + add another
      </button>

      <div className="mt-4 flex items-baseline justify-between border-t-[3px] border-ink pt-3">
        <span className="font-hand text-[17px] font-bold opacity-60">
          {bills.length === 0 ? 'none? skip this step 👇' : 'every month, roughly'}
        </span>
        <span className="font-display text-[18px]">{rupee(total)}</span>
      </div>
    </FormPanel>
  )
}
