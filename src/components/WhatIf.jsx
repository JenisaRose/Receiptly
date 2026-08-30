import { useState } from 'react'
import { inr, rupee } from '../lib/format'

/**
 * "What if I spend ₹X a day from here?" — projects the month-end total and
 * whether it lands under or over budget. Mount with `key={safeToday}` so it
 * re-seeds after an expense changes the safe-to-spend figure.
 */
export default function WhatIf({ safeToday, spentSoFar, daysLeft, spendable }) {
  const [rate, setRate] = useState(safeToday)

  const projectedEnd = spentSoFar + rate * daysLeft
  const diff = spendable - projectedEnd

  return (
    <div className="border-[3px] border-ink bg-ink p-4 text-white shadow-[6px_6px_0_var(--color-lilac)]">
      <h3 className="font-hand text-[20px] text-mint">what if I spend…</h3>
      <p className="mb-3 mt-0.5 font-display text-[22px]">
        ₹{inr(rate)} <span className="text-[13px] text-[#b7b2cc]">a day from here</span>
      </p>
      <input
        type="range"
        min={0}
        max={1400}
        step={20}
        value={rate}
        onChange={(e) => setRate(Number(e.target.value))}
        className="range-brutal"
        aria-label="daily spend"
      />
      <p className="mt-3 text-[13px] font-semibold">
        you’d end the month at <b className="font-display">{rupee(projectedEnd)}</b>
        <span
          className={`ml-1.5 inline-block rounded-full border-2 border-white px-2 py-[1px] text-[12px] font-bold ${
            diff >= 0 ? 'bg-mint text-ink' : 'bg-pink text-ink'
          }`}
        >
          {diff >= 0 ? `${rupee(diff)} spare` : `${rupee(-diff)} over`}
        </span>
      </p>
    </div>
  )
}
