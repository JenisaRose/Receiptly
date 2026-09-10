import { useBudget } from '../store/budgetContext'

/** ‹ August 2026 › — drives ui.selectedMonth, which every screen reads. */
export default function MonthSwitcher() {
  const b = useBudget()
  const months = b.availableMonths
  const i = months.indexOf(b.month.key)

  return (
    <div role="group" aria-label="Selected month" className="mb-5 flex items-center justify-center gap-2">
      <Arrow label="Previous month" disabled={i <= 0} onClick={() => b.stepMonth(-1)}>
        ‹
      </Arrow>

      <span
        aria-live="polite"
        className="min-w-[150px] border-[3px] border-ink bg-surface px-4 py-1.5 text-center font-display text-[14px] shadow-hard-sm"
      >
        {b.month.longLabel}
      </span>

      <Arrow
        label="Next month"
        disabled={i >= months.length - 1}
        onClick={() => b.stepMonth(1)}
      >
        ›
      </Arrow>

      {!b.month.isCurrent && (
        <button
          onClick={b.goToCurrentMonth}
          aria-label="Jump to the current month"
          className="press ml-1 border-[2.5px] border-ink bg-yellow px-2 py-1 text-[11px] font-bold text-on-accent shadow-hard-xs"
          style={{ '--press-x': '2px', '--press-y': '2px' }}
        >
          → today
        </button>
      )}
    </div>
  )
}

function Arrow({ children, label, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="press flex h-9 w-9 items-center justify-center border-[3px] border-ink bg-surface font-display text-lg leading-none shadow-hard-xs disabled:opacity-30 disabled:shadow-none"
      style={{ '--press-x': '3px', '--press-y': '3px' }}
    >
      {children}
    </button>
  )
}
