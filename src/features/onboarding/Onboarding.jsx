import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBudget } from '../../store/budgetContext'
import { onboardingSummary } from './buildState'
import BillsStep from './steps/BillsStep'
import ChoiceStep from './steps/ChoiceStep'
import GoalStep from './steps/GoalStep'
import IncomeStep from './steps/IncomeStep'
import ReadyStep from './steps/ReadyStep'
import WelcomeStep from './steps/WelcomeStep'

const STEPS = ['welcome', 'income', 'bills', 'goal', 'choice', 'ready']

const BLANK = { income: 0, incomeKind: 'monthly', bills: [], goal: null, monthlySave: 0 }

/**
 * The first-run setup flow. Rendered by AppShell in place of the app while
 * `onboarded === false`. Collects a rough financial picture, then either builds
 * a fresh state from it or swaps in the demo.
 */
export default function Onboarding() {
  const { completeOnboarding, resetDemo } = useBudget()
  const navigate = useNavigate()
  const reduced = useReducedMotion()

  const [i, setI] = useState(0)
  const [dir, setDir] = useState(1)
  const [data, setData] = useState(BLANK)
  const step = STEPS[i]

  const go = useCallback((delta) => {
    setDir(delta)
    setI((v) => Math.max(0, Math.min(v + delta, STEPS.length - 1)))
  }, [])
  const set = useCallback((patch) => setData((prev) => ({ ...prev, ...patch })), [])

  // hold the page behind the flow
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const openFresh = () => {
    navigate('/')
    completeOnboarding(data)
  }
  const openDemo = () => {
    navigate('/')
    resetDemo()
  }

  // the choice step owns the whole screen (ink takeover)
  if (step === 'choice') {
    return <ChoiceStep onFresh={() => go(1)} onDemo={openDemo} onBack={() => go(-1)} />
  }

  let content
  if (step === 'welcome') {
    content = <WelcomeStep onStart={() => go(1)} onDemo={openDemo} />
  } else if (step === 'income') {
    content = (
      <IncomeStep data={data} set={set} onBack={() => go(-1)} onContinue={() => go(1)} />
    )
  } else if (step === 'bills') {
    content = (
      <BillsStep
        data={data}
        set={set}
        onBack={() => go(-1)}
        onContinue={() => go(1)}
        onSkip={() => {
          set({ bills: [] })
          go(1)
        }}
      />
    )
  } else if (step === 'goal') {
    content = (
      <GoalStep
        data={data}
        set={set}
        onBack={() => go(-1)}
        onContinue={() => go(1)}
        onSkip={() => {
          set({ goal: null })
          go(1)
        }}
      />
    )
  } else {
    content = (
      <ReadyStep summary={onboardingSummary(data)} onOpen={openFresh} onBack={() => go(-1)} />
    )
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex justify-center overflow-y-auto overflow-x-hidden bg-bg px-4 py-10"
      style={{
        backgroundImage: 'radial-gradient(var(--color-ink) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <motion.div
        key={step}
        className="flex w-full items-center justify-center"
        initial={reduced ? false : { x: dir * 52 }}
        animate={{ x: 0 }}
        transition={{ type: 'spring', stiffness: 260, damping: 26 }}
      >
        {content}
      </motion.div>
    </div>
  )
}
