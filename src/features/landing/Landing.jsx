import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'
import AppPreviewMockup from './AppPreviewMockup'
import InstallButton from './InstallButton'

const FEATURES = [
  { emoji: '🏠', label: 'Safe-to-spend', blurb: "today's number, at a glance" },
  { emoji: '💡', label: 'Spending insights', blurb: 'patterns you’d otherwise miss' },
  { emoji: '🫙', label: 'Envelopes', blurb: 'budgets that flex with you' },
  { emoji: '📊', label: 'Trends', blurb: 'months, compared at a glance' },
  { emoji: '🔁', label: 'Bills', blurb: 'recurring costs, tracked & tamed' },
  { emoji: '🌙', label: 'Wrapped', blurb: 'your month, replayed as a story' },
  { emoji: '🔎', label: 'Search & filter', blurb: 'find any expense in seconds' },
  { emoji: '🎯', label: 'Savings goals', blurb: 'as many as you like, each tracked' },
]

const PRIMARY_CTA =
  'press inline-flex items-center justify-center border-[3px] border-ink bg-ink px-7 py-4 font-display text-[15px] text-yellow shadow-[7px_7px_0_var(--color-pink)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink'
const SECONDARY_CTA =
  'press inline-flex items-center justify-center border-[3px] border-ink bg-white px-7 py-4 font-display text-[15px] shadow-hard-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink'

export default function Landing() {
  const reduced = useReducedMotion()
  const fadeUp = (delay = 0) => ({
    initial: reduced ? false : { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { type: 'spring', stiffness: 260, damping: 24, delay },
  })

  return (
    <div className="min-h-screen overflow-x-hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-50 focus:border-[3px] focus:border-ink focus:bg-yellow focus:px-3 focus:py-2 focus:font-display focus:text-[12px]"
      >
        Skip to content
      </a>

      <main id="main">
        {/* hero */}
        <section className="mx-auto flex max-w-[1100px] flex-col items-center gap-10 px-5 pb-16 pt-10 sm:pt-14 lg:flex-row lg:items-center lg:gap-14 lg:px-8 lg:pt-20">
          <motion.div className="w-full max-w-[560px] text-center lg:text-left" {...fadeUp(0)}>
            <span className="font-display text-[20px] leading-none">
              receipt
              <span className="ml-0.5 inline-block -rotate-3 border-[3px] border-ink bg-yellow px-1.5 shadow-hard-sm">
                ly
              </span>
            </span>

            <h1 className="mt-5 font-display text-[clamp(2.4rem,7vw,3.6rem)] leading-[0.95] tracking-[-0.02em]">
              Your money.
              <br />
              Made <span className="bg-yellow px-1.5">clearer.</span>
            </h1>

            <p className="mx-auto mt-5 max-w-[30rem] text-[15px] font-semibold leading-snug opacity-75 lg:mx-0">
              Receiptly shows what you can safely spend today, where it's actually going, and how
              that's changing — no spreadsheets, no guesswork.
            </p>

            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <Link to="/app" className={PRIMARY_CTA}>
                explore Receiptly →
              </Link>
              <InstallButton className={SECONDARY_CTA} />
            </div>

            <p className="mt-4 text-[11.5px] font-semibold opacity-50">
              free · runs in your browser · nothing to install
            </p>
          </motion.div>

          <motion.div className="w-full max-w-[340px] shrink-0" {...fadeUp(0.15)}>
            <AppPreviewMockup className="mx-auto w-full" />
          </motion.div>
        </section>

        {/* features */}
        <section className="mx-auto max-w-[1100px] px-5 pb-20 lg:px-8">
          <h2 className="mb-6 text-center font-hand text-[26px] font-bold sm:text-left">
            everything a budget app should be 🧾
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.label}
                {...fadeUp(Math.min(i * 0.04, 0.3))}
                className="border-[3px] border-ink bg-white p-3.5 shadow-hard-sm sm:p-4"
              >
                <span className="text-[22px]">{f.emoji}</span>
                <p className="mt-1.5 font-display text-[12.5px] leading-tight">{f.label}</p>
                <p className="mt-1 text-[11px] font-semibold leading-snug opacity-60">{f.blurb}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* closing CTA */}
        <section className="mx-auto max-w-[720px] px-5 pb-20 lg:px-8">
          <div className="-rotate-[0.4deg] border-[3px] border-ink bg-lilac p-8 text-center shadow-hard-lg sm:p-10">
            <p className="font-hand text-[22px] font-bold">ready when you are 🧾</p>
            <p className="mx-auto mt-2 max-w-[26rem] text-[13.5px] font-semibold opacity-70">
              Jump straight into the demo, or set up with your own numbers — both take about a
              minute, and nothing leaves your device.
            </p>
            <div className="mt-6 flex justify-center">
              <Link to="/app" className={PRIMARY_CTA}>
                explore Receiptly →
              </Link>
            </div>
          </div>
        </section>

        <footer className="pb-10 text-center text-[11px] font-semibold opacity-45">
          Receiptly · a portfolio project · your data stays on this device
        </footer>
      </main>
    </div>
  )
}
