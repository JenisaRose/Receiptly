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

const GROUND =
  'fixed inset-0 z-[60] flex justify-center overflow-y-auto overflow-x-hidden bg-bg px-4 py-10'
const GROUND_STYLE = {
  backgroundImage: 'radial-gradient(var(--color-ink) 1px, transparent 1px)',
  backgroundSize: '22px 22px',
}

const DECOR = [
  { cls: 'left-[6%] top-[12%] text-[64px]', dur: 26 },
  { cls: 'right-[8%] top-[18%] text-[44px]', dur: 32 },
  { cls: 'left-[10%] bottom-[14%] text-[52px]', dur: 30 },
  { cls: 'right-[7%] bottom-[10%] text-[72px]', dur: 22 },
  { cls: 'left-[46%] top-[4%] text-[32px]', dur: 28 },
]

/** Slow, faint sparkles on the ground so the flow feels like an occasion
 *  without the panels having to fill a whole widescreen monitor. */
function GroundDecor({ reduced }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden text-ink/15">
      {DECOR.map((d, i) => (
        <motion.span
          key={i}
          className={`absolute ${d.cls}`}
          animate={reduced ? undefined : { rotate: 360 }}
          transition={reduced ? undefined : { duration: d.dur, repeat: Infinity, ease: 'linear' }}
        >
          ✦
        </motion.span>
      ))}
    </div>
  )
}

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

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  const openFresh = () => {
    navigate('/app')
    completeOnboarding(data)
  }
  const openDemo = () => {
    navigate('/app')
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
    <div className={GROUND} style={GROUND_STYLE}>
      <GroundDecor reduced={reduced} />
      {/* keyed remount — each step plays its own entrance; no exit animation so
          a backgrounded tab can never strand two layers on top of each other */}
      <motion.div
        key={step}
        className="flex w-full items-center justify-center"
        initial={reduced ? false : { x: dir * 44, scale: 0.985 }}
        animate={{ x: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 30 }}
      >
        {content}
      </motion.div>
    </div>
  )
}
