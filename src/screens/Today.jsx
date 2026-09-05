import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Card from '../components/ui/Card'
import Money from '../components/ui/Money'
import ProgressBar from '../components/ui/ProgressBar'
import DeleteTxButton from '../components/DeleteTxButton'
import EmptyState from '../components/EmptyState'
import Forecast from '../components/Forecast'
import QuickAdd from '../components/QuickAdd'
import WhatIf from '../components/WhatIf'
import { useCountUp } from '../hooks/useCountUp'
import { inr, rupee, splitNote } from '../lib/format'
import { BG } from '../lib/theme'
import { useBudget } from '../store/budgetContext'

function safeTag(safe) {
  if (safe >= 700) return 'on pace 🔥'
  if (safe >= 350) return 'go easy 👀'
  return 'tight — chill week 🧊'
}

export default function Today({ onLogExpense }) {
  const b = useBudget()
  const { isCurrent, isPast, label } = b.month

  const topCat = b.categoryBreakdown('month')[0]
  const cameUnder = b.spentSoFar <= b.spendable

  let hero
  if (isCurrent) {
    hero = { eyebrow: 'today you can spend', value: b.safeToday, tag: safeTag(b.safeToday), bg: 'bg-yellow' }
  } else if (isPast) {
    hero = {
      eyebrow: `${label}, wrapped`,
      value: b.spentSoFar,
      tag: cameUnder ? 'came in under 💚' : 'went over 😬',
      bg: 'bg-mint',
    }
  } else {
    hero = {
      eyebrow: `planned for ${label}`,
      value: Math.round(b.allocatedTotal / b.month.daysInMonth),
      tag: 'not started · planning 📅',
      bg: 'bg-lilac',
    }
  }

  return (
    <div className="space-y-4">
      {/* hero */}
      <div className="relative flex justify-center pb-6 pt-2">
        <div className="absolute top-[-4px] z-10 h-6 w-24 -rotate-[5deg] border-[2.5px] border-ink bg-mint opacity-90" />
        <motion.div
          key={hero.eyebrow}
          initial={{ scale: 0.6, opacity: 0, rotate: -4 }}
          animate={{ scale: 1, opacity: 1, rotate: -4 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className={`relative flex h-[230px] w-[230px] flex-col items-center justify-center rounded-full border-4 border-ink text-center shadow-hard-lg ${hero.bg}`}
        >
          <span className="absolute right-1.5 top-1.5 text-xl">✦</span>
          <span className="absolute bottom-2 left-0 text-xl">✦</span>
          <span className="px-6 font-hand text-[18px] font-bold leading-tight">{hero.eyebrow}</span>
          <span className="my-0.5 font-display text-[46px] leading-none">
            <span className="text-[22px]">₹</span>
            <SafeNumber value={hero.value} />
          </span>
          <span className="rounded-full bg-ink px-2.5 py-[3px] text-[11.5px] font-bold text-yellow">
            {hero.tag}
          </span>
        </motion.div>
      </div>

      {/* stats */}
      {isCurrent && (
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Spent so far" value={<Money value={b.spentSoFar} />} bg="bg-pink" />
          <Stat label="Left to spend" value={<Money value={b.leftToSpend} />} bg="bg-mint" />
          <Stat label="Days left" value={b.daysLeft} bg="bg-lilac" />
          <Stat label="Your daily pace" value={<Money value={b.safeToday} />} bg="bg-sky" />
        </div>
      )}
      {isPast && (
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Spent" value={<Money value={b.spentSoFar} />} bg="bg-pink" />
          <Stat label="Money in" value={<Money value={b.income} />} bg="bg-mint" />
          <Stat label="Top category" value={topCat?.label ?? '—'} bg="bg-lilac" />
          <Stat label="Logged" value={`${b.thisMonthEntries.length} taps`} bg="bg-sky" />
        </div>
      )}
      {b.month.isFuture && (
        <div className="grid grid-cols-2 gap-3">
          <Stat label="Budgeted" value={<Money value={b.allocatedTotal} />} bg="bg-pink" />
          <Stat label="Bills due" value={<Money value={b.billsTotal} />} bg="bg-mint" />
          <Stat label="Days in month" value={b.month.daysInMonth} bg="bg-lilac" />
          <Stat label="Logged" value={`${b.thisMonthEntries.length} taps`} bg="bg-sky" />
        </div>
      )}

      {isCurrent && <QuickAdd />}

      {/* transparent breakdown — current & past only */}
      {isCurrent && <CurrentBreakdown b={b} />}
      {isPast && <PastBreakdown b={b} />}

      {isCurrent && b.forecast && <Forecast f={b.forecast} />}
      {isCurrent && !b.forecast && (
        <div className="-rotate-[0.6deg] border-[3px] border-ink bg-mint p-4 shadow-hard-sm">
          <p className="font-hand text-[19px] font-bold">{label}’s just getting started 🌱</p>
          <p className="mt-0.5 text-[12px] font-semibold">
            your pace and month-end forecast kick in once there are a few days of spending to
            read.
          </p>
        </div>
      )}

      {isCurrent && (
        <WhatIf
          key={b.safeToday}
          safeToday={b.safeToday}
          spentSoFar={b.spentSoFar}
          daysLeft={b.daysLeft}
          spendable={b.spendable}
        />
      )}

      {/* goals */}
      {b.goals.length > 0 ? (
        <div className="space-y-3">
          {b.goals.map((g) => (
            <GoalCard key={g.id} goal={g} onContribute={b.contributeToGoal} />
          ))}
        </div>
      ) : (
        <div className="-rotate-[0.5deg] border-[3px] border-dashed border-ink/45 bg-lilac/60 p-4">
          <p className="font-hand text-[18px] font-bold">🎯 no savings goals yet</p>
          <p className="mt-0.5 text-[12px] font-semibold opacity-70">
            add one in settings and track your progress here.
          </p>
        </div>
      )}

      {/* recent */}
      <div>
        <h2 className="mb-2.5 inline-block -rotate-2 font-hand text-[22px] font-bold">
          {isCurrent ? 'recent taps 💸' : `${label} taps 💸`}
        </h2>
        {b.thisMonthEntries.length > 0 ? (
          <div className="space-y-2">
            {b.thisMonthEntries.slice(0, 6).map((e) => (
              <EntryRow
                key={e.id}
                entry={e}
                cat={b.categoryMap[e.categoryId]}
                monthAbbr={label.slice(0, 3)}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            emoji="🗓️"
            title={`nothing logged for ${label} yet`}
            hint="tap ＋ to plan an expense ahead"
          />
        )}
        <button
          onClick={onLogExpense}
          className="press mt-4 w-full border-[3px] border-ink bg-ink py-3.5 font-display text-sm text-yellow shadow-[6px_6px_0_var(--color-pink)]"
          style={{ '--press-x': '6px', '--press-y': '6px' }}
        >
          {isCurrent ? '+ log an expense' : `+ add to ${label}`}
        </button>
      </div>
    </div>
  )
}

function CurrentBreakdown({ b }) {
  const [open, setOpen] = useState(false)
  return (
    <Card as="button" className="w-full p-4 text-left" onClick={() => setOpen((v) => !v)}>
      <div className="flex items-center justify-between">
        <span className="font-hand text-[21px] font-bold">how we got {rupee(b.safeToday)}</span>
        <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-sm">
          ▾
        </motion.span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <dl className="mt-3 text-[13.5px]">
              <Line k="Money in this month" v={rupee(b.income)} />
              <Line k="− Locked-in bills" v={rupee(b.upcomingBillsTotal)} minus />
              <Line k="− Set aside for goals" v={rupee(b.month.goalSetAside)} minus />
              <Line k="− Already spent" v={rupee(b.spentSoFar)} minus />
              <div className="mt-1 flex justify-between border-t-[3px] border-ink pt-2.5 font-display text-[15px]">
                <span>Left for {b.daysLeft} days</span>
                <span>{rupee(b.leftToSpend)}</span>
              </div>
              <div className="flex justify-between pt-2 opacity-70">
                <span>÷ days left</span>
                <span>= {rupee(b.safeToday)} / day</span>
              </div>
            </dl>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

function PastBreakdown({ b }) {
  const leftover = b.income - b.billsTotal - b.spentSoFar
  return (
    <Card className="p-4">
      <p className="mb-2 font-hand text-[21px] font-bold">where {b.month.label}’s money went</p>
      <dl className="text-[13.5px]">
        <Line k="Money in" v={rupee(b.income)} />
        <Line k="− Bills" v={rupee(b.billsTotal)} minus />
        <Line k="− Spent" v={rupee(b.spentSoFar)} minus />
        <div className="mt-1 flex justify-between border-t-[3px] border-ink pt-2.5 font-display text-[15px]">
          <span>{leftover >= 0 ? 'Left over' : 'Short by'}</span>
          <span>{rupee(Math.abs(leftover))}</span>
        </div>
      </dl>
    </Card>
  )
}

/** A savings goal card — tap to expand a +/- stepper for adding to (or
 *  withdrawing from) how much you've saved. `target: 0` is a valid
 *  open-ended goal: just money set aside with nothing specific to hit. */
function GoalCard({ goal, onContribute }) {
  const [open, setOpen] = useState(false)
  const hasTarget = goal.target > 0

  return (
    <div className="border-[3px] border-ink bg-lilac p-4 shadow-hard-sm">
      <button onClick={() => setOpen((v) => !v)} className="w-full text-left">
        <div className="mb-2 flex items-center justify-between text-[12px] font-bold">
          <span>
            {goal.emoji} {goal.name}
          </span>
          <span>{hasTarget ? `${rupee(goal.saved)} / ${rupee(goal.target)}` : rupee(goal.saved)}</span>
        </div>
        {hasTarget ? (
          <ProgressBar value={goal.saved / goal.target} fill="stripes-lilac" height={18} />
        ) : (
          <p className="text-[11px] font-semibold opacity-60">
            open-ended · setting aside {rupee(goal.monthly)}/mo
          </p>
        )}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="mt-3 flex items-center gap-2 border-t-[2.5px] border-dashed border-ink/30 pt-3 text-[12px] font-semibold">
              add to savings
              <span className="ml-auto flex items-center gap-1.5">
                <Step onClick={() => onContribute(goal.id, -250)}>–</Step>
                <span>{rupee(goal.saved)}</span>
                <Step onClick={() => onContribute(goal.id, 250)}>+</Step>
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Step({ onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="h-[26px] w-[26px] border-[2.5px] border-ink bg-white font-display text-[13px] leading-none active:bg-yellow"
    >
      {children}
    </button>
  )
}

function SafeNumber({ value }) {
  return <>{inr(useCountUp(value ?? 0, { duration: 0.8 }))}</>
}

function Stat({ label, value, bg }) {
  return (
    <div className={`border-[3px] border-ink p-3.5 shadow-hard-sm ${bg}`}>
      <p className="text-[10.5px] font-bold uppercase tracking-wide opacity-70">{label}</p>
      <p className="mt-1 font-display text-[19px]">{value}</p>
    </div>
  )
}

function Line({ k, v, minus }) {
  return (
    <div className="flex justify-between border-b border-dashed border-[#d3ccf2] py-[7px]">
      <span>{k}</span>
      <span className={minus ? 'text-[#d6335a]' : ''}>{v}</span>
    </div>
  )
}

function EntryRow({ entry, cat, monthAbbr }) {
  const meta = cat ?? { emoji: '📦', color: 'lilac' }
  const out = entry.amount < 0
  const day = Number(entry.date.slice(-2))
  return (
    <motion.div
      initial={entry.fresh ? { scale: 0.9, x: -10, opacity: 0 } : false}
      animate={{ scale: 1, x: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="flex items-center justify-between border-[2.5px] border-ink bg-white px-3 py-2.5"
    >
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-ink text-sm ${BG[meta.color]}`}
        >
          {meta.emoji}
        </span>
        <div>
          <p className="text-[13px] font-semibold">
            {entry.name}
            {entry.split && (
              <span className="ml-1.5 rounded-full border-2 border-ink bg-lilac px-1.5 align-middle text-[9px] font-bold">
                🔀 ×{entry.split.parts}
              </span>
            )}
          </p>
          <p className="text-[10.5px] opacity-60">
            {day} {monthAbbr}
            {entry.split ? ` · ${splitNote(entry)}` : ''}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-[13.5px] font-bold ${out ? 'text-[#d6335a]' : 'text-[#1f9a5a]'}`}>
          {out ? '– ' : '+ '}₹{inr(Math.abs(entry.amount))}
        </span>
        <DeleteTxButton tx={entry} monthAbbr={monthAbbr} />
      </div>
    </motion.div>
  )
}
