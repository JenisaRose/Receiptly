import { motion } from 'framer-motion'
import FeatureRow from '../FeatureRow'
import Glow from '../Glow'
import { useReveal } from '../motion'
import { Label, Section } from '../Shell'
import BillsScreen from '../screens/BillsScreen'
import EnvelopesScreen from '../screens/EnvelopesScreen'
import TodayScreen from '../screens/TodayScreen'
import TrendsScreen from '../screens/TrendsScreen'

const MORE = [
  { emoji: '🎯', label: 'Savings goals', line: 'as many as you like, each with its own monthly set-aside', bg: 'bg-mint' },
  { emoji: '🔀', label: 'Split expenses', line: 'log the total, keep only your share against the budget', bg: 'bg-lilac' },
  { emoji: '🔎', label: 'Search & filter', line: 'find any transaction by name, category or amount', bg: 'bg-white' },
  { emoji: '⚡', label: 'Quick-add presets', line: 'one-tap chips for the spends you log every day', bg: 'bg-sky' },
  { emoji: '🗓️', label: 'Multi-month', line: 'past months recap, future months plan', bg: 'bg-white' },
  { emoji: '🎬', label: 'Wrapped', line: 'a Spotify-style story of your month, printed as a receipt', bg: 'bg-pink' },
]

export default function Features() {
  const reveal = useReveal()

  return (
    <Section id="features" variant="features">
      <div className="max-w-[42rem]">
        <Label>04 / 06 · what's inside</Label>
        <h2 className="mt-5 font-display text-[clamp(2.4rem,6.4vw,4.4rem)] leading-[0.98]">
          A real, working product —
        </h2>
        <p className="mt-1 font-serif text-[clamp(1.8rem,4.6vw,3rem)] italic leading-tight opacity-55">
          not a concept.
        </p>
      </div>

      <div className="mt-20 space-y-28">
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
          accent="var(--color-yellow)"
          chips={[
            { text: '💸 ₹340 safe today', cls: 'left-0 top-4 sm:-left-14' },
            { text: '📈 headed for ₹9,995', cls: 'right-0 top-1/2 sm:-right-12' },
            { text: '✓ on track', cls: 'bottom-2 left-2 hidden bg-mint sm:block' },
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
          points={[
            'on-pace / close / over, at a glance',
            'tap to rebalance between envelopes',
            'buffer rollover carries the slack forward',
          ]}
          accent="var(--color-mint)"
          chips={[
            { text: '⚠️ Fun over by ₹150', cls: 'right-0 top-6 bg-pink sm:-right-14' },
            { text: '↻ ₹500 rolled over', cls: 'left-0 top-1/2 sm:-left-12' },
            { text: '🍜 Food on track', cls: 'bottom-2 right-2 hidden bg-mint sm:block' },
          ]}
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
          points={[
            '~11 detectors, ranked by what matters now',
            'day-of-week spending rhythm',
            'month-vs-average, at a glance',
          ]}
          accent="var(--color-sky)"
          chips={[
            { text: '🌗 weekends cost 1.8×', cls: 'left-0 top-6 sm:-left-14' },
            { text: '📉 Food ↓ 14%', cls: 'right-0 bottom-12 bg-mint sm:-right-10' },
          ]}
          tilt={-3}
        >
          <TrendsScreen />
        </FeatureRow>

        <FeatureRow
          number="4.4"
          eyebrow="bills + autopay"
          title="Recurring costs, handled before they hit."
          body="Every subscription and fixed cost lives on one screen, subtracted from your safe-to-spend before you ever see it. Flag one as autopay and it marks itself paid the day it's due."
          points={[
            'due-day countdown badges',
            'autopay catches up after time away',
            'never silently touches your safe-to-spend math',
          ]}
          accent="var(--color-lilac)"
          chips={[
            { text: '🔁 auto-paid on the 12th', cls: 'right-0 top-8 bg-mint sm:-right-14' },
            { text: '⏳ Electricity due today', cls: 'left-0 bottom-10 bg-yellow sm:-left-10' },
          ]}
          flip
          tilt={2}
        >
          <BillsScreen />
        </FeatureRow>
      </div>

      <div className="relative mt-28">
        <Glow color="var(--color-pink)" size={780} x="90%" y="60%" opacity={0.22} />
        <Label>and everything else</Label>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MORE.map((m, i) => (
            <motion.div
              key={m.label}
              {...reveal(i * 0.05)}
              className={`rounded-2xl border-[2.5px] border-ink p-5 shadow-hard-sm ${m.bg} ${
                m.bg === 'bg-white' ? '' : ''
              }`}
            >
              <span className="text-[26px]">{m.emoji}</span>
              <p className="mt-2.5 font-display text-[15px]">{m.label}</p>
              <p className="mt-1 text-[12.5px] font-semibold leading-snug opacity-65">{m.line}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </Section>
  )
}
