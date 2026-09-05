import { motion } from 'framer-motion'
import { useFloat } from './motion'

const DOTS = ['bg-pink', 'bg-yellow', 'bg-mint']

/** The hero's product preview — a floating "app window" with depth (a
 *  colour card stacked behind it) and a couple of independently-floating
 *  sticker chips, rather than the Today screen dropped into another
 *  bordered card. Purely illustrative, hand-authored numbers. */
export default function HeroMockup() {
  const floatSlow = useFloat(10, 5)
  const floatFast = useFloat(7, 3.4)

  return (
    <div className="relative mx-auto w-full max-w-[360px] px-2 sm:max-w-[380px] sm:px-0">
      {/* stacked colour card, peeking out behind */}
      <div className="absolute inset-2 -rotate-6 translate-y-4 rounded-[28px] bg-mint sm:inset-0 sm:translate-x-3" />
      <div className="absolute inset-2 rotate-3 translate-y-6 rounded-[28px] bg-pink/70 sm:inset-0 sm:-translate-x-2" />

      {/* the window itself */}
      <motion.div
        className="relative -rotate-2 rounded-[28px] border-[3px] border-ink bg-white shadow-hard-lg"
        initial={{ opacity: 0, scale: 0.92, rotate: 6 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -2 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 160, damping: 18, delay: 0.15 }}
      >
        <div className="flex items-center gap-1.5 border-b-[2.5px] border-ink px-5 py-3">
          {DOTS.map((c) => (
            <span key={c} className={`h-2.5 w-2.5 rounded-full border border-ink/40 ${c}`} />
          ))}
          <span className="ml-auto text-[9px] font-bold tracking-[0.18em] opacity-40">
            RECEIPTLY
          </span>
        </div>

        <div className="p-6">
          <div className="flex justify-center py-2">
            <div className="flex h-[148px] w-[148px] flex-col items-center justify-center rounded-full border-[3px] border-ink bg-yellow text-center shadow-hard-sm">
              <span className="px-5 font-hand text-[13px] font-bold leading-tight">
                today you can spend
              </span>
              <span className="my-1 font-display text-[28px] leading-none">
                <span className="text-[14px]">₹</span>340
              </span>
              <span className="rounded-full bg-ink px-2.5 py-[3px] text-[9px] font-bold text-yellow">
                on track 👍
              </span>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-2.5">
            <div className="border-[2.5px] border-ink bg-pink p-2.5 shadow-hard-xs">
              <p className="text-[8px] font-bold uppercase tracking-wide opacity-70">Spent</p>
              <p className="mt-0.5 font-display text-[15px]">₹6,420</p>
            </div>
            <div className="border-[2.5px] border-ink bg-sky p-2.5 shadow-hard-xs">
              <p className="text-[8px] font-bold uppercase tracking-wide opacity-70">Left</p>
              <p className="mt-0.5 font-display text-[15px]">₹8,680</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* floating stickers */}
      <motion.div
        {...floatSlow}
        initial={{ opacity: 0, scale: 0.7, rotate: -14 }}
        whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.7 }}
        className="absolute -right-5 -top-6 z-10 rotate-[-8deg] border-[2.5px] border-ink bg-white px-3 py-1.5 text-[11px] font-bold shadow-hard-sm sm:-right-9"
      >
        ✅ 3 goals on track
      </motion.div>

      <motion.div
        {...floatFast}
        initial={{ opacity: 0, scale: 0.7, rotate: 10 }}
        whileInView={{ opacity: 1, scale: 1, rotate: 6 }}
        viewport={{ once: true }}
        transition={{ type: 'spring', stiffness: 220, damping: 14, delay: 0.95 }}
        className="absolute -bottom-5 -left-4 z-10 rotate-[6deg] border-[2.5px] border-ink bg-lilac px-3 py-1.5 text-[11px] font-bold shadow-hard-sm sm:-left-8"
      >
        🔁 bill auto-paid
      </motion.div>
    </div>
  )
}
