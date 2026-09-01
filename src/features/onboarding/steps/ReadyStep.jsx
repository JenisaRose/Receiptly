import { motion, useReducedMotion } from 'framer-motion'
import { rupee } from '../../../lib/format'

// matches the downloadable Wrapped receipt — Receiptly's "on paper" look
const PAPER = '#f6f0e1'
const MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace'

function Line({ k, v, strong }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-dashed border-ink/30 py-1.5 last:border-b-0">
      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-ink/55">{k}</span>
      <span className={`text-right ${strong ? 'font-display text-[15px]' : 'font-semibold text-[13px]'}`}>
        {v}
      </span>
    </div>
  )
}

export default function ReadyStep({ summary, onOpen, onBack }) {
  const reduced = useReducedMotion()
  const { income, billTotal, monthlySave, freeToSpend, goal } = summary

  return (
    <div className="relative w-full max-w-[380px]">
      <motion.p
        className="mb-3 text-center font-display text-[clamp(1.8rem,8vw,2.4rem)]"
        initial={reduced ? false : { y: -14 }}
        animate={{ y: 0 }}
      >
        you're all set. ✨
      </motion.p>

      <motion.div
        className="overflow-hidden border-[3px] border-ink shadow-hard-lg"
        style={{ background: PAPER, fontFamily: MONO }}
        initial={reduced ? false : { y: '-8%', rotate: -1 }}
        animate={{ y: 0, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 16, delay: 0.1 }}
      >
        <div className="flex justify-around px-1 pt-1">
          {Array.from({ length: 14 }).map((_, i) => (
            <span
              key={i}
              className="h-2 w-2 rounded-full border border-ink/60"
              style={{ background: PAPER }}
            />
          ))}
        </div>

        <div className="px-5 pb-5 pt-2 text-ink">
          <p className="text-center font-display text-[15px]">
            receipt<span className="bg-yellow px-1">ly</span>
          </p>
          <p className="mt-1 text-center text-[9px] font-bold uppercase tracking-[0.3em] text-ink/55">
            setup complete
          </p>

          <div className="my-2.5 border-t-2 border-dashed border-ink/50" />

          <Line k="monthly income" v={rupee(income)} />
          <Line k="fixed bills" v={billTotal ? `− ${rupee(billTotal)}` : 'none yet'} />
          <Line k="monthly saving" v={monthlySave ? `− ${rupee(monthlySave)}` : 'none yet'} />
          {goal && (
            <Line k="saving toward" v={`${goal.name || 'a goal'} ${goal.emoji || '🎯'}`} />
          )}

          <div className="my-2 border-t-2 border-ink" />
          <Line k="free to spend" v={`${rupee(freeToSpend)} / mo`} strong />

          <p className="mt-3 border-t-2 border-dashed border-ink/50 pt-3 text-center font-hand text-[16px] font-bold">
            welcome aboard 🧾
          </p>

          <div className="mt-2 flex justify-center gap-[2px]">
            {'▮▯▮▮▯▮▯▯▮▮▯▮▮▯▮▯▮▯▮▮▯▮▯▮▮'.split('').map((c, i) => (
              <span
                key={i}
                className={`inline-block h-7 w-[2px] ${c === '▮' ? 'bg-ink' : ''}`}
                style={c === '▮' ? undefined : { background: PAPER }}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.button
        onClick={onOpen}
        className="press mt-5 w-full border-[3px] border-ink bg-ink py-3.5 font-display text-[15px] text-yellow shadow-[6px_6px_0_var(--color-mint)]"
        style={{ '--press-x': '6px', '--press-y': '6px' }}
        initial={reduced ? false : { y: 16 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.3 }}
      >
        open Receiptly →
      </motion.button>
      <button
        onClick={onBack}
        className="mx-auto mt-3 block font-hand text-[15px] font-bold underline decoration-dotted underline-offset-2 opacity-50 hover:opacity-100"
      >
        ‹ change something
      </button>
    </div>
  )
}
