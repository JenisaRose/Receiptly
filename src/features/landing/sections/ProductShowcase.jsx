import { motion } from 'framer-motion'
import MiniScreen from '../MiniScreen'
import { useReveal } from '../motion'

const BARS = [40, 65, 50, 80, 58]

function TrendsMini() {
  return (
    <MiniScreen title="Trends">
      <div className="flex h-14 items-end gap-1.5">
        {BARS.map((h, i) => (
          <div
            key={i}
            className={`w-3.5 rounded-t border border-ink ${i === 3 ? 'bg-pink' : 'bg-lilac'}`}
            style={{ height: `${h}%` }}
          />
        ))}
      </div>
      <p className="mt-2 text-[10px] font-bold text-mint">↓ 12% vs last month</p>
    </MiniScreen>
  )
}

function BillsMini() {
  return (
    <MiniScreen title="Bills">
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[10.5px] font-semibold">
          <span>💡 Electricity</span>
          <span className="opacity-60">₹1,200</span>
        </div>
        <div className="flex items-center justify-between text-[10.5px] font-semibold">
          <span>🎧 Spotify 🔁</span>
          <span className="opacity-60">auto ✓</span>
        </div>
      </div>
    </MiniScreen>
  )
}

function ReflectMini() {
  return (
    <MiniScreen title="Reflect">
      <div className="grid grid-cols-10 gap-[3px]">
        {Array.from({ length: 20 }, (_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-[2px] ${
              [2, 5, 9, 13, 16].includes(i) ? 'bg-ink/15' : i % 3 === 0 ? 'bg-mint' : 'bg-pink/60'
            }`}
          />
        ))}
      </div>
      <p className="mt-2 text-[10px] font-bold opacity-60">16 no-spend days</p>
    </MiniScreen>
  )
}

function ReceiptsMini() {
  return (
    <MiniScreen title="Receipts">
      <div className="space-y-1.5 text-[10.5px] font-semibold">
        <div className="flex items-center justify-between">
          <span>🍜 Food</span>
          <span className="opacity-60">₹4,200</span>
        </div>
        <div className="flex items-center justify-between">
          <span>🚕 Transport</span>
          <span className="opacity-60">₹2,180</span>
        </div>
      </div>
    </MiniScreen>
  )
}

function TodayPrimary() {
  return (
    <div className="rounded-[22px] border-[3px] border-ink bg-white p-5 shadow-hard-lg">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[9px] font-bold uppercase tracking-wide opacity-45">Today</span>
        <span className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-ink bg-pink text-[9px] font-bold">
          RP
        </span>
      </div>
      <div className="flex justify-center py-1">
        <div className="flex h-[104px] w-[104px] flex-col items-center justify-center rounded-full border-[2.5px] border-ink bg-yellow text-center">
          <span className="px-3 font-hand text-[10px] font-bold leading-tight">
            safe to spend
          </span>
          <span className="font-display text-[19px] leading-none">₹340</span>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-center gap-2 text-[10px] font-bold">
        <span className="rounded-full border-2 border-ink bg-mint px-2 py-0.5">on track 👍</span>
      </div>
    </div>
  )
}

/** A layered composition of several real screens rather than a row of
 *  identical cards — one primary screen up front, smaller ones fanned out
 *  behind at different rotations. Desktop/tablet get the true layered
 *  version; mobile gets a simple stacked fallback to avoid fragile
 *  absolute-position math at narrow widths. */
export default function ProductShowcase() {
  const reveal = useReveal()

  return (
    <section className="bg-bg px-5 py-24 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-[1100px] text-center">
        <motion.p
          {...reveal(0)}
          className="text-[11px] font-bold uppercase tracking-[0.22em] opacity-45"
        >
          a real, working product
        </motion.p>
        <motion.h2
          {...reveal(0.05)}
          className="mx-auto mt-3 max-w-[26rem] font-display text-[clamp(1.9rem,5vw,2.8rem)] leading-[1.02]"
        >
          Six screens. One clear picture.
        </motion.h2>
      </div>

      {/* desktop / tablet — layered */}
      <div className="relative mx-auto mt-16 hidden h-[420px] max-w-[880px] sm:block">
        <motion.div
          initial={{ opacity: 0, x: -40, rotate: -14 }}
          whileInView={{ opacity: 1, x: 0, rotate: -9 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.05 }}
          className="absolute left-0 top-4 w-[180px]"
        >
          <ReceiptsMini />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -30, rotate: -6 }}
          whileInView={{ opacity: 1, x: 0, rotate: -3 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.15 }}
          className="absolute bottom-2 left-16 w-[180px]"
        >
          <BillsMini />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 170, damping: 20, delay: 0.25 }}
          className="absolute left-1/2 top-1/2 w-[240px] -translate-x-1/2 -translate-y-1/2"
        >
          <TodayPrimary />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30, rotate: 6 }}
          whileInView={{ opacity: 1, x: 0, rotate: 4 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.2 }}
          className="absolute right-14 top-2 w-[180px]"
        >
          <TrendsMini />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40, rotate: 12 }}
          whileInView={{ opacity: 1, x: 0, rotate: 8 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 180, damping: 20, delay: 0.3 }}
          className="absolute bottom-4 right-0 w-[180px]"
        >
          <ReflectMini />
        </motion.div>
      </div>

      {/* mobile — simple stack, no overlap */}
      <div className="mx-auto mt-12 grid max-w-[340px] gap-4 sm:hidden">
        <motion.div {...reveal(0.05)}>
          <TodayPrimary />
        </motion.div>
        <motion.div {...reveal(0.1)}>
          <ReceiptsMini />
        </motion.div>
        <motion.div {...reveal(0.15)}>
          <TrendsMini />
        </motion.div>
        <motion.div {...reveal(0.2)}>
          <BillsMini />
        </motion.div>
        <motion.div {...reveal(0.25)}>
          <ReflectMini />
        </motion.div>
      </div>
    </section>
  )
}
