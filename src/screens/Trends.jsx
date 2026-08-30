import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import Money from '../components/ui/Money'
import SegmentedToggle from '../components/ui/SegmentedToggle'
import { DAY_OF_WEEK, PATTERNS, TRENDS } from '../data/history'
import { rupee } from '../lib/format'
import { BG } from '../lib/theme'

const MONTH_NAMES = {
  Mar: 'March', Apr: 'April', May: 'May', Jun: 'June', Jul: 'July', Aug: 'August',
}

export default function Trends() {
  const [scope, setScope] = useState('months')
  const data = TRENDS[scope]
  const series = data.series
  const [sel, setSel] = useState(series.length - 1)

  const { max, avg, peak } = useMemo(() => {
    const totals = series.map((s) => s.total)
    return {
      max: Math.max(...totals) * 1.1,
      avg: totals.reduce((a, c) => a + c, 0) / totals.length,
      peak: totals.indexOf(Math.max(...totals)),
    }
  }, [series])

  const picked = series[Math.min(sel, series.length - 1)]
  const pickedLabel =
    picked.label[0] === 'W' ? `week ${picked.label.slice(1)}` : MONTH_NAMES[picked.label] ?? picked.label

  const dowMax = Math.max(...DAY_OF_WEEK) * 1.1
  const dowPeak = DAY_OF_WEEK.indexOf(Math.max(...DAY_OF_WEEK))

  return (
    <div className="space-y-4">
      <SegmentedToggle
        value={scope}
        onChange={(v) => {
          setScope(v)
          setSel(TRENDS[v].series.length - 1)
        }}
        options={[
          { value: 'months', label: '6 months' },
          { value: 'weeks', label: '8 weeks' },
        ]}
      />

      {/* chart with stacked-block depth */}
      <div className="relative -rotate-[0.6deg]">
        <div className="absolute inset-0 rotate-2 translate-x-[3px] translate-y-[3px] border-[3px] border-ink bg-lilac" />
        <div className="absolute inset-0 rotate-[4deg] translate-x-[6px] translate-y-[6px] border-[3px] border-ink bg-sky" />
        <div className="relative border-[3px] border-ink bg-white p-4 shadow-hard">
          <div className="mb-3.5 flex items-baseline justify-between">
            <span className="text-sm font-bold">{data.title}</span>
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
                  key={row.label}
                  onClick={() => setSel(i)}
                  className="flex h-full flex-1 flex-col justify-end"
                >
                  <motion.div
                    className={`w-full border-[2.5px] border-b-0 border-ink ${
                      sel === i ? 'bg-pink' : i === peak ? 'bg-orange' : 'bg-lilac'
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
                key={row.label}
                className={`flex-1 text-center text-[10.5px] font-semibold ${
                  sel === i ? 'underline opacity-100' : 'opacity-65'
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
                <Money key={`${scope}-${sel}`} value={picked.total} duration={0.45} />
              </span>
              <span className="block text-[11px] opacity-60">most on {picked.top}</span>
            </span>
          </div>
        </div>
      </div>

      {/* patterns */}
      <h2 className="inline-block -rotate-1 font-hand text-[21px] font-bold">patterns we spotted</h2>
      <div className="space-y-3">
        {PATTERNS.map((p, i) => (
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

      {/* day of week */}
      <div className="border-[3px] border-ink bg-white p-4 shadow-hard-sm">
        <p className="mb-3 inline-block -rotate-1 font-hand text-[18px] font-bold">
          when the money actually leaves
        </p>
        <div className="flex h-[82px] items-end gap-1.5">
          {DAY_OF_WEEK.map((v, i) => (
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
