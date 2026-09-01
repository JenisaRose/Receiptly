import FormPanel from '../FormPanel'
import RupeeInput from '../RupeeInput'

const KINDS = [
  { value: 'monthly', label: 'about the same' },
  { value: 'irregular', label: 'it varies' },
]

export default function IncomeStep({ data, set, onBack, onContinue }) {
  return (
    <FormPanel
      n={1}
      accent="mint"
      eyebrow="section one"
      title="What comes in each month?"
      onBack={onBack}
      onContinue={onContinue}
      canContinue={data.income > 0}
    >
      <div className="border-[3px] border-ink bg-mint/25 px-4 py-6">
        <RupeeInput
          value={data.income}
          onChange={(income) => set({ income })}
          placeholder="25,000"
          ariaLabel="Monthly income in rupees"
        />
      </div>

      <p className="mt-5 text-[12px] font-bold uppercase tracking-wide opacity-55">
        month to month it's…
      </p>
      <div className="mt-2 flex gap-2">
        {KINDS.map((k) => (
          <button
            key={k.value}
            onClick={() => set({ incomeKind: k.value })}
            aria-pressed={data.incomeKind === k.value}
            className={`press flex-1 border-[3px] border-ink px-3 py-2.5 text-[13px] font-semibold shadow-hard-xs ${
              data.incomeKind === k.value ? 'bg-mint' : 'bg-white'
            }`}
            style={{ '--press-x': '3px', '--press-y': '3px' }}
          >
            {k.label}
          </button>
        ))}
      </div>

      <p className="mt-4 font-hand text-[16px] font-bold opacity-60">
        a rough number is fine — you can change it anytime.
      </p>
    </FormPanel>
  )
}
