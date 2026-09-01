import { motion, useReducedMotion } from 'framer-motion'
import { rupee } from '../../../lib/format'

// matches the downloadable Wrapped receipt — Receiptly's "on paper" look
const PAPER = '#f6f0e1'
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

function Line({ k, v, strong, reduced }) {
  return (
    <motion.div
      className="flex items-baseline justify-between gap-3 border-b border-dashed border-ink/30 py-1.5 last:border-b-0"
      variants={
        reduced
          ? undefined
          : { hidden: { x: -14 }, show: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } } }
      }
    >
      <span className="text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink/55">{k}</span>
      <span className={`text-right ${strong ? 'font-display text-[17px]' : 'font-semibold text-[14px]'}`}>
        {v}
      </span>
    </motion.div>
  )
}

export default function ReadyStep({ summary, onOpen, onBack }) {
  const reduced = useReducedMotion()
  const { income, billTotal, monthlySave, freeToSpend, goal } = summary

  return (
    <div className="relative w-full max-w-[440px]">
      <motion.p
        className="mb-4 text-center font-display text-[clamp(2rem,7vw,2.9rem)]"
        initial={reduced ? false : { y: -16 }}
        animate={{ y: 0 }}
      >
        you're all set. ✨
      </motion.p>

      <div className="relative">
        {/* rubber stamp thumps on once the receipt is out */}
        <motion.span
          className="absolute -right-3 top-7 z-10 -rotate-[14deg] border-[3px] border-pink bg-[#f6f0e1] px-2.5 py-1 font-display text-[13px] uppercase tracking-wide text-pink"
          initial={reduced ? false : { scale: 2.6, rotate: -32 }}
          animate={{ scale: 1, rotate: -14 }}
          transition={{ type: 'spring', stiffness: 480, damping: 13, delay: 0.9 }}
        >
          ✓ ready
        </motion.span>

        <motion.div
          className="overflow-hidden border-[3px] border-ink shadow-hard-lg"
          style={{ background: PAPER, fontFamily: MONO }}
          initial={reduced ? false : { y: '-16%', rotate: -1.5 }}
          animate={{ y: 0, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 110, damping: 16, delay: 0.1 }}
        >
          <div className="flex justify-around px-1 pt-1">
            {Array.from({ length: 16 }).map((_, i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full border border-ink/60"
                style={{ background: PAPER }}
              />
            ))}
          </div>

          <div className="px-6 pb-6 pt-3 text-ink">
            <p className="text-center font-display text-[17px]">
              receipt<span className="bg-yellow px-1">ly</span>
            </p>
            <p className="mt-1 text-center text-[9.5px] font-bold uppercase tracking-[0.3em] text-ink/55">
              setup complete
            </p>

            <div className="my-3 border-t-2 border-dashed border-ink/50" />

            <motion.div
              variants={reduced ? undefined : { show: { transition: { staggerChildren: 0.08, delayChildren: 0.5 } } }}
              initial={reduced ? false : 'hidden'}
              animate="show"
            >
              <Line reduced={reduced} k="monthly income" v={rupee(income)} />
              <Line reduced={reduced} k="fixed bills" v={billTotal ? `− ${rupee(billTotal)}` : 'none yet'} />
              <Line
                reduced={reduced}
                k="monthly saving"
                v={monthlySave ? `− ${rupee(monthlySave)}` : 'none yet'}
              />
              {goal && (
                <Line
                  reduced={reduced}
                  k="saving toward"
                  v={`${goal.name || 'a goal'} ${goal.emoji || '🎯'}`}
                />
              )}
              <div className="my-2 border-t-2 border-ink" />
              <Line reduced={reduced} k="free to spend" v={`${rupee(freeToSpend)} / mo`} strong />
            </motion.div>

            <p className="mt-3 border-t-2 border-dashed border-ink/50 pt-3 text-center font-hand text-[18px] font-bold">
              welcome aboard 🧾
            </p>

            <div className="mt-2 flex justify-center gap-[2px]">
              {'▮▯▮▮▯▮▯▯▮▮▯▮▮▯▮▯▮▯▮▮▯▮▯▮▮'.split('').map((c, i) => (
                <span
                  key={i}
                  className={`inline-block h-9 w-[2px] ${c === '▮' ? 'bg-ink' : ''}`}
                  style={c === '▮' ? undefined : { background: PAPER }}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.button
        onClick={onOpen}
        whileHover={reduced ? undefined : { x: 3 }}
        className="press mt-6 w-full border-[3px] border-ink bg-ink py-4 font-display text-[16px] text-yellow shadow-[7px_7px_0_var(--color-mint)]"
        style={{ '--press-x': '7px', '--press-y': '7px' }}
        initial={reduced ? false : { y: 18 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 240, damping: 20, delay: 0.5 }}
      >
        open Receiptly →
      </motion.button>
      <button
        onClick={onBack}
        className="mx-auto mt-3 block font-hand text-[16px] font-bold underline decoration-dotted underline-offset-2 opacity-50 hover:opacity-100"
      >
        ‹ change something
      </button>
    </div>
  )
}
