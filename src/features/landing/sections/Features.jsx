import { motion } from 'framer-motion'
import FeatureRow from '../FeatureRow'
import { useReveal } from '../motion'
import { Eyebrow, Section } from '../Shell'
import BillsScreen from '../screens/BillsScreen'
import EnvelopesScreen from '../screens/EnvelopesScreen'
import TodayScreen from '../screens/TodayScreen'
import TrendsScreen from '../screens/TrendsScreen'

const MORE = [
  { emoji: '🎯', label: 'Savings goals', line: 'as many as you like, each with its own monthly set-aside' },
  { emoji: '🔀', label: 'Split expenses', line: 'log the total, keep only your share against the budget' },
  { emoji: '🔎', label: 'Search & filter', line: 'find any transaction by name, category or amount' },
  { emoji: '⚡', label: 'Quick-add presets', line: 'one-tap chips for the spends you log every day' },
  { emoji: '🗓️', label: 'Multi-month', line: 'past months recap, future months plan' },
  { emoji: '🎬', label: 'Wrapped', line: 'a Spotify-style story of your month, printed as a receipt' },
]

export default function Features() {
  const reveal = useReveal()

  return (
    <Section id="features" watermark="features">
      <div className="max-w-[36rem]">
        <Eyebrow>04 · what's inside</Eyebrow>
        <h2 className="mt-3 font-display text-[clamp(2.2rem,5.6vw,3.6rem)] leading-[1.02]">
          A real, working product — not a concept.
        </h2>
      </div>

      <div className="mt-16 space-y-24">
        <FeatureRow
          number="4.1"
          eyebrow="safe-to-spend + forecast"
          title="Know today's number, and where the month lands."
          body="The Today screen leads with one figure and backs it with a live month-end forecast — a burn-down line that tells you the date you'll cross your plan, if you keep this pace."
          points={[
            'recalculates on every logged rupee',
            '"headed for ₹X · over by the 24th"',
            'a what-if slider for the rest of the month',
          ]}
          tilt={-2}
        >
          <TodayScreen />
        </FeatureRow>

        <FeatureRow
          number="4.2"
          eyebrow="envelopes"
          title="Budgets that bend with your month."
          body="Split your spendable money into envelopes — food, transport, fun — and Receiptly shows each one's pace, warns before you blow it, and rolls the leftover into next month."
          points={['on-pace / close / over, at a glance', 'tap to rebalance between envelopes', 'buffer rollover carries the slack forward']}
          flip
          tilt={2}
        >
          <EnvelopesScreen />
        </FeatureRow>

        <FeatureRow
          number="4.3"
          eyebrow="trends + insights"
          title="The patterns you'd never spot yourself."
          body="Six months of spending as one chart, plus a detector engine that reads it for you — category creep, weekend blowouts, subscriptions hiding in plain sight, no-spend streaks worth keeping."
          points={['~11 detectors, ranked by what matters now', 'day-of-week spending rhythm', 'month-vs-average, at a glance']}
          tilt={-3}
        >
          <TrendsScreen />
        </FeatureRow>

        <FeatureRow
          number="4.4"
          eyebrow="bills + autopay"
          title="Recurring costs, handled before they hit."
          body="Every subscription and fixed cost lives on one screen, subtracted from your safe-to-spend before you ever see it. Flag one as autopay and it marks itself paid the day it's due."
          points={['due-day countdown badges', 'autopay catches up after time away', 'never silently touches your safe-to-spend math']}
          flip
          tilt={2}
        >
          <BillsScreen />
        </FeatureRow>
      </div>

      <div className="mt-24">
        <Eyebrow>and everything else</Eyebrow>
        <div className="mt-6 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
          {MORE.map((m, i) => (
            <motion.div key={m.label} {...reveal(i * 0.04)} className="flex gap-3">
              <span className="text-[24px] leading-none">{m.emoji}</span>
              <div>
                <p className="font-display text-[15px]">{m.label}</p>
                <p className="mt-0.5 text-[12.5px] font-semibold leading-snug opacity-55">{m.line}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
