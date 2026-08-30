/** Two or more mutually-exclusive options rendered as pressable tabs. */
export default function SegmentedToggle({ options, value, onChange, className = '' }) {
  return (
    <div className={`flex gap-2 ${className}`}>
      {options.map((opt) => {
        const active = opt.value === value
        return (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={`press flex-1 border-[3px] border-ink px-3 py-2.5 text-[13px] font-semibold shadow-hard-sm ${
              active ? 'bg-yellow' : 'bg-white'
            }`}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}
