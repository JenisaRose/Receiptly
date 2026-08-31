import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import Card from '../components/ui/Card'
import Money from '../components/ui/Money'
import ProgressBar from '../components/ui/ProgressBar'
import WhatIf from '../components/WhatIf'
import { useCountUp } from '../hooks/useCountUp'
import { inr, rupee } from '../lib/format'
import { BG } from '../lib/theme'
import { useBudget } from '../store/budgetContext'

function safeTag(safe) {
  if (safe >= 700) return { text: 'on pace 🔥', bg: 'bg-ink text-yellow' }
  if (safe >= 350) return { text: 'go easy 👀', bg: 'bg-ink text-yellow' }
  return { text: 'tight — chill week 🧊', bg: 'bg-ink text-yellow' }
}

export default function Today({ onLogExpense }) {
  const b = useBudget()
  const [open, setOpen] = useState(false)
  const tag = safeTag(b.safeToday)

  return (
    <div className="space-y-4">
      {/* hero */}
      <div className="relative flex justify-center pb-6 pt-2">
        <div className="absolute top-[-4px] z-10 h-6 w-24 -rotate-[5deg] border-[2.5px] border-ink bg-mint opacity-90" />
        <motion.div
          initial={{ scale: 0.6, opacity: 0, rotate: -4 }}
          animate={{ scale: 1, opacity: 1, rotate: -4 }}
          transition={{ type: 'spring', stiffness: 260, damping: 16 }}
          className="relative flex h-[230px] w-[230px] flex-col items-center justify-center rounded-full border-4 border-ink bg-yellow text-center shadow-hard-lg"
        >
          <span className="absolute right-1.5 top-1.5 text-xl">✦</span>
          <span className="absolute bottom-2 left-0 text-xl">✦</span>
          <span className="font-hand text-[18px] font-bold">today you can spend</span>
          <span className="my-0.5 font-display text-[48px] leading-none">
            <span className="text-[22px]">₹</span>
            <SafeNumber value={b.safeToday} />
          </span>
          <span className={`rounded-full px-2.5 py-[3px] text-[11.5px] font-bold ${tag.bg}`}>
            {tag.text}
          </span>
        </motion.div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 gap-3">
        <Stat label="Spent so far" value={<Money value={b.spentSoFar} />} bg="bg-pink" />
        <Stat label="Left to spend" value={<Money value={b.leftToSpend} />} bg="bg-mint" />
        <Stat label="Days left" value={b.daysLeft} bg="bg-lilac" />
        <Stat label="Your daily pace" value={<Money value={b.safeToday} />} bg="bg-sky" />
      </div>

      {/* transparent breakdown */}
      <Card
        as="button"
        className="w-full p-4 text-left"
        onClick={() => setOpen((v) => !v)}
      >
        <div className="flex items-center justify-between">
          <span className="font-hand text-[21px] font-bold">
            how we got {rupee(b.safeToday)}
          </span>
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

      <WhatIf
        key={b.safeToday}
        safeToday={b.safeToday}
        spentSoFar={b.spentSoFar}
        daysLeft={b.daysLeft}
        spendable={b.spendable}
      />

      {/* goal */}
      <div className="border-[3px] border-ink bg-lilac p-4 shadow-hard-sm">
        <div className="mb-2 flex justify-between text-[12px] font-bold">
          <span>
            {b.goal.emoji} {b.goal.name}
          </span>
          <span>
            {rupee(b.goal.saved)} / {rupee(b.goal.target)}
          </span>
        </div>
        <ProgressBar
          value={b.goal.saved / b.goal.target}
          fill="stripes-lilac"
          height={18}
        />
      </div>

      {/* recent */}
      <div>
        <h2 className="mb-2.5 inline-block -rotate-2 font-hand text-[22px] font-bold">
          recent taps 💸
        </h2>
        <div className="space-y-2">
          {b.thisMonthEntries.slice(0, 6).map((e) => (
            <EntryRow
              key={e.id}
              entry={e}
              cat={b.categoryMap[e.categoryId]}
              monthAbbr={b.month.label.slice(0, 3)}
            />
          ))}
        </div>
        <button
          onClick={onLogExpense}
          className="press mt-4 w-full border-[3px] border-ink bg-ink py-3.5 font-display text-sm text-yellow shadow-[6px_6px_0_var(--color-pink)]"
          style={{ '--press-x': '6px', '--press-y': '6px' }}
        >
          + log an expense
        </button>
      </div>
    </div>
  )
}

function SafeNumber({ value }) {
  return <>{inr(useCountUp(value, { duration: 0.8 }))}</>
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
          <p className="text-[13px] font-semibold">{entry.name}</p>
          <p className="text-[10.5px] opacity-60">
            {day} {monthAbbr}
          </p>
        </div>
      </div>
      <span className={`text-[13.5px] font-bold ${out ? 'text-[#d6335a]' : 'text-[#1f9a5a]'}`}>
        {out ? '– ' : '+ '}₹{inr(Math.abs(entry.amount))}
      </span>
    </motion.div>
  )
}
