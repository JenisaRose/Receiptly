import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import LogExpenseModal from '../LogExpenseModal'
import MonthSwitcher from '../MonthSwitcher'
import SettingsSheet from '../SettingsSheet'
import Today from '../../screens/Today'
import Receipts from '../../screens/Receipts'
import Trends from '../../screens/Trends'
import Envelopes from '../../screens/Envelopes'
import Bills from '../../screens/Bills'
import Reflect from '../../screens/Reflect'
import BottomNav from './BottomNav'
import Sidebar from './Sidebar'
import { NAV } from './navItems'

export default function AppShell() {
  const location = useLocation()
  const navigate = useNavigate()
  const [logOpen, setLogOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)

  const openLog = useCallback(() => setLogOpen(true), [])

  // keyboard: 1–6 jump between screens, n opens the log-expense modal
  useEffect(() => {
    function onKey(e) {
      const t = e.target
      if (t instanceof Element && t.matches('input, textarea, [contenteditable]')) return
      if (e.key === 'n' && !logOpen) {
        e.preventDefault()
        setLogOpen(true)
      }
      const i = Number(e.key)
      if (i >= 1 && i <= NAV.length) navigate(NAV[i - 1].to)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [navigate, logOpen])

  const current = NAV.find((n) => n.to === location.pathname) ?? NAV[0]

  return (
    <div className="min-h-screen">
      <Sidebar onLogExpense={openLog} />

      <main className="mx-auto flex max-w-[640px] flex-col px-4 pb-40 pt-6 lg:ml-[232px] lg:max-w-none lg:items-center lg:px-8 lg:pb-16 lg:pt-9">
        <div className="w-full lg:max-w-[620px]">
          <header className="mb-6 flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] opacity-45">RECEIPTLY</p>
              <h1 className="mt-0.5 font-display text-[26px] lg:text-[28px]">{current.label}</h1>
            </div>
            <button
              onClick={() => setSettingsOpen(true)}
              aria-label="Settings"
              className="press flex h-10 w-10 items-center justify-center rounded-full border-[3px] border-ink bg-pink text-sm font-bold shadow-hard-xs"
              style={{ '--press-x': '3px', '--press-y': '3px' }}
            >
              RP
            </button>
          </header>

          <MonthSwitcher />

          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
            >
              <Routes location={location}>
                <Route path="/" element={<Today onLogExpense={openLog} />} />
                <Route path="/receipts" element={<Receipts />} />
                <Route path="/trends" element={<Trends />} />
                <Route path="/envelopes" element={<Envelopes />} />
                <Route path="/bills" element={<Bills />} />
                <Route path="/reflect" element={<Reflect />} />
                <Route path="*" element={<Today onLogExpense={openLog} />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      <BottomNav />

      <button
        onClick={openLog}
        aria-label="Log an expense"
        className="press fixed bottom-[84px] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-ink bg-ink font-display text-2xl text-yellow shadow-[4px_4px_0_var(--color-pink)] lg:hidden"
        style={{ '--press-x': '4px', '--press-y': '4px' }}
      >
        +
      </button>

      <AnimatePresence>
        {logOpen && <LogExpenseModal onClose={() => setLogOpen(false)} />}
      </AnimatePresence>

      <AnimatePresence>
        {settingsOpen && <SettingsSheet onClose={() => setSettingsOpen(false)} />}
      </AnimatePresence>
    </div>
  )
}
