import FormPanel from '../FormPanel'
import RupeeInput from '../RupeeInput'

const EMOJI = ['💻', '📱', '✈️', '🎓', '🚗', '🏠', '🎁', '📷', '🎮', '🪙']

function etaLabel(target, monthly) {
  if (!target || !monthly) return null
  const months = Math.ceil(target / monthly)
  if (months <= 1) return 'about a month away'
  if (months < 12) return `about ${months} months away`
  const y = Math.floor(months / 12)
  const m = months % 12
  return `about ${y} yr${y > 1 ? 's' : ''}${m ? ` ${m} mo` : ''} away`
}

export default function GoalStep({ data, set, onBack, onContinue, onSkip }) {
  const goal = data.goal ?? { name: '', emoji: '🎯', target: 0 }
  const patch = (p) => set({ goal: { ...goal, ...p } })
  const eta = etaLabel(Number(goal.target) || 0, Number(data.monthlySave) || 0)
  const pct =
    goal.target && data.monthlySave
      ? Math.min(100, Math.round(((Number(data.monthlySave) * 3) / Number(goal.target)) * 100))
      : 8

  return (
    <FormPanel
      n={3}
      accent="yellow"
      eyebrow="section three"
      title="What are you saving toward?"
      onBack={onBack}
      onContinue={onContinue}
      onSkip={onSkip}
      canContinue
    >
      <div className="flex items-center gap-2">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border-[3px] border-ink bg-yellow text-[20px]">
          {goal.emoji}
        </span>
        <input
          value={goal.name}
          onChange={(e) => patch({ name: e.target.value })}
          placeholder="new laptop"
          className="min-w-0 flex-1 border-b-[3px] border-ink bg-transparent pb-1 font-display text-[20px] outline-none placeholder:opacity-30"
        />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {EMOJI.map((e) => (
          <button
            key={e}
            onClick={() => patch({ emoji: e })}
            className={`grid h-8 w-8 place-items-center border-2 border-ink text-[15px] ${
              goal.emoji === e ? 'bg-yellow' : 'bg-white'
            }`}
          >
            {e}
          </button>
        ))}
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <label className="border-[3px] border-ink bg-yellow/25 p-3">
          <span className="text-[10.5px] font-bold uppercase tracking-wide opacity-55">goal</span>
          <RupeeInput
            size="row"
            value={goal.target}
            onChange={(target) => patch({ target })}
            placeholder="70,000"
            ariaLabel="Goal amount"
          />
        </label>
        <label className="border-[3px] border-ink bg-yellow/25 p-3">
          <span className="text-[10.5px] font-bold uppercase tracking-wide opacity-55">
            monthly
          </span>
          <RupeeInput
            size="row"
            value={data.monthlySave}
            onChange={(monthlySave) => set({ monthlySave })}
            placeholder="5,000"
            ariaLabel="Monthly saving"
          />
        </label>
      </div>

      <div className="mt-4">
        <div className="h-3 w-full overflow-hidden border-2 border-ink bg-white">
          <div className="h-full bg-yellow" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-1.5 font-hand text-[16px] font-bold opacity-65">
          {eta ?? 'add a number and a monthly amount to see how close you are'}
        </p>
      </div>
    </FormPanel>
  )
}
