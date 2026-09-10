import { motion } from 'framer-motion'
import { useDialog } from '../hooks/useDialog'
import { useBudget } from '../store/budgetContext'
import BillManager from './BillManager'
import CategoryManager from './CategoryManager'
import GoalManager from './GoalManager'
import PresetManager from './PresetManager'
import ResetDemo from './ResetDemo'
import ThemeToggle from './ThemeToggle'

/** Slide-over opened from the avatar. Rendered inside <AnimatePresence>. */
export default function SettingsSheet({ onClose }) {
  const { restartOnboarding } = useBudget()
  const dialogRef = useDialog(onClose) // focus in/out + trap + Escape

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-scrim"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.aside
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Settings"
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-full max-w-[400px] flex-col border-l-[3px] border-ink bg-bg"
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 32 }}
      >
        <header className="flex items-center justify-between border-b-[3px] border-ink px-5 py-4">
          <h2 className="font-display text-lg">settings</h2>
          <button
            onClick={onClose}
            aria-label="Close settings"
            className="flex h-8 w-8 items-center justify-center border-[2.5px] border-ink bg-surface text-[13px] font-bold active:bg-pink"
          >
            ✕
          </button>
        </header>

        <div className="flex-1 space-y-7 overflow-y-auto p-5">
          <section>
            <h3 className="mb-2 font-hand text-[19px] font-bold">appearance</h3>
            <p className="mb-2.5 text-[11.5px] opacity-60">
              light, dark, or follow your device. changes right away.
            </p>
            <ThemeToggle />
          </section>

          <CategoryManager />

          <PresetManager />

          <BillManager />

          <GoalManager />

          <section>
            <h3 className="mb-2 font-hand text-[19px] font-bold">demo data</h3>
            <p className="mb-2.5 text-[11.5px] opacity-60">
              starts a fresh demo month. anything you logged is cleared.
            </p>
            <ResetDemo className="text-[12px]" />
          </section>

          <section>
            <h3 className="mb-2 font-hand text-[19px] font-bold">redo setup</h3>
            <p className="mb-2.5 text-[11.5px] opacity-60">
              run the intro again — re-enter your income, bills and a goal, or switch to the demo.
              your current data stays until you finish.
            </p>
            <button
              onClick={() => {
                if (confirm('Run setup again? Your data stays until you finish the flow.')) {
                  onClose()
                  restartOnboarding()
                }
              }}
              className="border-[3px] border-ink bg-surface px-3.5 py-2 font-display text-[12px] shadow-hard-xs"
            >
              ↻ run setup again
            </button>
          </section>

          <p className="pt-2 text-center text-[10.5px] opacity-45">
            Receiptly · saved on this device · keys 1–6, n
          </p>
        </div>
      </motion.aside>
    </motion.div>
  )
}
