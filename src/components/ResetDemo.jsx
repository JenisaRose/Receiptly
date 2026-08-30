import { useBudget } from '../store/budgetContext'

/** Puts the seeded demo month back — handy after poking at the prototype. */
export default function ResetDemo({ className = '' }) {
  const { resetDemo } = useBudget()
  return (
    <button
      onClick={() => {
        if (confirm('Reset to the demo month? Anything you logged will be cleared.')) {
          resetDemo()
        }
      }}
      className={`text-[10.5px] font-semibold underline decoration-dotted underline-offset-2 opacity-50 hover:opacity-100 ${className}`}
    >
      ↺ reset demo data
    </button>
  )
}
