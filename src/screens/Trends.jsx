import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import Money from '../components/ui/Money'
import SegmentedToggle from '../components/ui/SegmentedToggle'
import { MONTH_NAMES } from '../lib/dates'
import { rupee } from '../lib/format'
import { BG } from '../lib/theme'
import { useBudget } from '../store/budgetContext'

export default function Trends() {
  const b = useBudget()
  const [scope, setScope] = useState('months')

  const series = scope === 'months' ? b.trends.months : b.trends.weeks
  const title = scope === 'months' ? 'spending per month' : 'spending per week'
  const [sel, setSel] = useState(series.length - 1)

  const { max, avg, peak } = useMemo(() => {
    const totals = series.map((s) => s.total)
    const top = Math.max(1, ...totals)
    return {
      max: top * 1.1,
      avg: totals.reduce((a, c) => a + c, 0) / totals.length,
      peak: totals.indexOf(top),
    }
  }, [series])

  const idx = Math.min(sel, series.length - 1)
  const picked = series[idx]
  const pickedLabel =
    scope === 'weeks'
      ? `week ${picked.label.slice(1)}`
      : MONTH_NAMES[Number(picked.key.slice(5, 7)) - 1]

  const dow = b.dayOfWeekSpend
  const dowMax = Math.max(1, ...dow) * 1.1
  const dowPeak = dow.indexOf(Math.max(...dow))
  const hasData = series.some((s) => s.total > 0)

  return (
    <div className="space-y-4">
      <SegmentedToggle
        value={scope}
        onChange={(v) => {
          setScope(v)
          setSel((v === 'months' ? b.trends.months : b.trends.weeks).length - 1)
        }}
        options={[
          { value: 'months', label: '6 months' },
          { value: 'weeks', label: '8 weeks' },
        ]}
      />

      {/* chart with stacked-block depth */}
      <div className="relative -rotate-[0.6deg]">
        <div className="absolute inset-0 translate-x-[3px] translate-y-[3px] rotate-2 border-[3px] border-ink bg-lilac" />
        <div className="absolute inset-0 translate-x-[6px] translate-y-[6px] rotate-[4deg] border-[3px] border-ink bg-sky" />
        <div className="relative border-[3px] border-ink bg-white p-4 shadow-hard">
          <div className="mb-3.5 flex items-baseline justify-between">
            <span className="text-sm font-bold">{title}</span>
            <span className="rounded-full bg-ink px-2 py-[2px] text-[11px] font-bold text-yellow">
              avg {rupee(avg)}
            </span>
          </div>

          <div className="relative h-[168px]">
            <div
              className="absolute inset-x-0 z-10 border-t-[2.5px] border-dashed border-ink/50"
              style={{ bottom: `${(avg / max) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-end gap-[7px] border-b-[3px] border-ink">
              {series.map((row, i) => (
                <button
                  key={row.key}
                  onClick={() => setSel(i)}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <motion.div
                    className={`w-full border-[2.5px] border-b-0 border-ink ${
                      idx === i ? 'bg-pink' : i === peak ? 'bg-orange' : 'bg-lilac'
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: `${(row.total / max) * 100}%` }}
                    transition={{ duration: 0.55, delay: i * 0.05, ease: [0.2, 0.8, 0.3, 1] }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mt-1.5 flex gap-[7px]">
            {series.map((row, i) => (
              <span
                key={row.key}
                className={`flex-1 text-center text-[10.5px] font-semibold ${
                  idx === i ? 'underline opacity-100' : 'opacity-65'
                }`}
              >
                {row.label}
              </span>
            ))}
          </div>

          <div className="mt-3.5 flex items-baseline justify-between border-t-[3px] border-ink pt-2.5">
            <span className="font-hand text-[19px] font-bold">{pickedLabel}</span>
            <span className="text-right">
              <span className="block font-display text-[20px]">
                <Money key={`${scope}-${idx}`} value={picked.total} duration={0.45} />
              </span>
              <span className="block text-[11px] opacity-60">
                {picked.total > 0 ? `most on ${picked.top}` : 'nothing logged'}
              </span>
            </span>
          </div>
        </div>
      </div>

      {!hasData && (
        <p className="border-[3px] border-dashed border-ink/40 p-5 text-center font-hand text-[16px] font-bold opacity-65">
          not enough history yet — keep logging and the shape shows up
        </p>
      )}

      {/* patterns */}
      {b.patterns.length > 0 && (
        <>
          <h2 className="inline-block -rotate-1 font-hand text-[21px] font-bold">
            patterns we spotted
          </h2>
          <div className="space-y-3">
            {b.patterns.map((p, i) => (
              <div
                key={p.text}
                className={`flex items-center gap-2.5 border-[3px] border-ink bg-white p-3 shadow-hard-sm ${
                  i % 2 ? 'rotate-[0.8deg]' : '-rotate-[0.8deg]'
                }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-[2.5px] border-ink text-[17px] ${BG[p.color]}`}
                >
                  {p.emoji}
                </span>
                <span className="text-[13px] font-bold leading-tight">
                  {p.text}
                  <span className="block font-hand text-[13.5px] font-semibold opacity-70">
                    {p.note}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* day of week */}
      <div className="border-[3px] border-ink bg-white p-4 shadow-hard-sm">
        <p className="mb-3 inline-block -rotate-1 font-hand text-[18px] font-bold">
          when the money actually leaves
        </p>
        <div className="flex h-[82px] items-end gap-1.5">
          {dow.map((v, i) => (
            <div key={i} className="flex h-full flex-1 items-end">
              <motion.div
                className={`w-full border-[2.5px] border-b-0 border-ink ${
                  i === dowPeak ? 'bg-orange' : 'bg-mint'
                }`}
                initial={{ height: 0 }}
                animate={{ height: `${(v / dowMax) * 100}%` }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.04 }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1.5 flex gap-1.5 text-[10px] font-semibold opacity-60">
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
            <span key={i} className="flex-1 text-center">
              {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
