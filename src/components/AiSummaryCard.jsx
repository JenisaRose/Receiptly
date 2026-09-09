import { useState } from 'react'
import { cachedAiSummary, generateAiSummary } from '../store/aiInsights'

/** A short, locally-generated recap of the current month, woven from
 *  Receiptly's own insights engine, forecast, categories, and goals — no
 *  network call, nothing to configure. Cached per month so it reads the same
 *  on every visit; "regenerate" cycles through a different true phrasing of
 *  the same numbers. */
export default function AiSummaryCard({ b }) {
  const monthKey = b.month.key
  const [text, setText] = useState(
    () => cachedAiSummary(monthKey)?.text ?? generateAiSummary(monthKey, b),
  )

  function regenerate() {
    setText(generateAiSummary(monthKey, b, { regenerate: true }))
  }

  return (
    <div className="rotate-[0.4deg] border-[3px] border-ink bg-white p-4 shadow-hard-sm">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-hand text-[19px] font-bold">🤖 your month, summarized</span>
        <button
          onClick={regenerate}
          className="shrink-0 border-2 border-ink bg-white px-2 py-0.5 text-[10.5px] font-bold active:bg-yellow"
        >
          ↻ regenerate
        </button>
      </div>
      <p className="mt-2 text-[13px] font-semibold leading-snug">{text}</p>
    </div>
  )
}
