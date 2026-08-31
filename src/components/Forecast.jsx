import Money from './ui/Money'
import { ordinal, rupee } from '../lib/format'

const TONE = {
  over: { stroke: 'var(--color-pink)', chip: 'bg-pink' },
  under: { stroke: 'var(--color-mint)', chip: 'bg-mint' },
  'on-track': { stroke: 'var(--color-sky)', chip: 'bg-sky' },
}

const W = 300
const BASE = 66
const TOP = 8

/** Month-end projection with a burn-down: actual spend so far, then a dashed
 *  extension at the current pace, against the plan ceiling. */
export default function Forecast({ f }) {
  const t = TONE[f.status]
  const yMax = Math.max(f.target, f.projected) * 1.12 || 1
  const x = (day) => (day / f.daysInMonth) * W
  const y = (amt) => BASE - (amt / yMax) * (BASE - TOP)

  const actual = [[0, y(0)], ...f.cumulative.map((c, i) => [x(i + 1), y(c)])]
  const here = actual[actual.length - 1]
  const targetY = y(f.target)

  const deltaLabel =
    f.status === 'on-track'
      ? 'right on plan'
      : `${rupee(Math.abs(f.delta))} ${f.status === 'over' ? 'over' : 'under'} plan`

  return (
    <div className="border-[3px] border-ink bg-white p-4 shadow-hard-sm">
      <div className="flex items-baseline justify-between">
        <span className="font-hand text-[20px] font-bold">headed for</span>
        <span
          className={`rounded-full border-2 border-ink px-2 py-[1px] text-[11px] font-bold ${t.chip}`}
        >
          {deltaLabel}
        </span>
      </div>
      <p className="font-display text-[26px] leading-tight">
        <Money value={f.projected} />{' '}
        <span className="font-body text-[12px] opacity-55">by the {ordinal(f.daysInMonth)}</span>
      </p>

      <svg viewBox={`0 0 ${W} 76`} className="mt-1.5 w-full">
        <line
          x1="0"
          y1={targetY}
          x2={W}
          y2={targetY}
          stroke="var(--color-ink)"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          opacity="0.4"
        />
        <line x1="0" y1={BASE} x2={W} y2={BASE} stroke="var(--color-ink)" strokeWidth="2" />
        <polyline
          points={actual.map((p) => p.join(',')).join(' ')}
          fill="none"
          stroke={t.stroke}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        {here[0] < W && (
          <path
            d={`M ${here[0]} ${here[1]} L ${x(f.daysInMonth)} ${y(f.projected)}`}
            fill="none"
            stroke={t.stroke}
            strokeWidth="2.5"
            strokeDasharray="4 3"
            opacity="0.85"
          />
        )}
        <circle
          cx={here[0]}
          cy={here[1]}
          r="3.5"
          fill={t.stroke}
          stroke="var(--color-ink)"
          strokeWidth="1.5"
        />
      </svg>
      <div className="flex justify-between text-[10px] font-bold opacity-45">
        <span>day 1</span>
        <span>plan ≈ {rupee(f.target)}</span>
        <span>the {ordinal(f.daysInMonth)}</span>
      </div>

      <p className="mt-2 text-[12px] font-semibold">
        {rupee(f.spentSoFar)} in {f.elapsed} day{f.elapsed === 1 ? '' : 's'} · about{' '}
        {rupee(f.daily)}/day
      </p>
      {f.crossDay && (
        <p className="text-[12px] font-semibold text-pink">
          at this rate you’ll pass the plan around the {ordinal(f.crossDay)}
        </p>
      )}
    </div>
  )
}
