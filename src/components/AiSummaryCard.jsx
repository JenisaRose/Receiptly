import { useEffect, useRef, useState } from 'react'
import { buildMonthSummary, cachedAiSummary, fetchAiSummary } from '../store/aiInsights'

/** AI-written 2-4 sentence recap of the current month, backed by /api/insights.
 *  Cached per month in localStorage so opening the app doesn't re-generate it
 *  every time — "regenerate" forces a fresh take. */
export default function AiSummaryCard({ b }) {
  const monthKey = b.month.key
  // always-current snapshot for the fetch calls below, without making the
  // mount effect re-run (and re-fetch) on every store update
  const bRef = useRef(b)
  useEffect(() => {
    bRef.current = b
  })

  const [state, setState] = useState(() => {
    const cached = cachedAiSummary(monthKey)
    return cached ? { status: 'done', text: cached, error: '' } : { status: 'loading', text: '', error: '' }
  })

  useEffect(() => {
    if (cachedAiSummary(monthKey)) return
    let cancelled = false
    fetchAiSummary(monthKey, buildMonthSummary(bRef.current))
      .then((text) => !cancelled && setState({ status: 'done', text, error: '' }))
      .catch((err) => !cancelled && setState({ status: 'error', text: '', error: err.message }))
    return () => {
      cancelled = true
    }
  }, [monthKey])

  function regenerate() {
    setState({ status: 'loading', text: '', error: '' })
    fetchAiSummary(monthKey, buildMonthSummary(bRef.current))
      .then((text) => setState({ status: 'done', text, error: '' }))
      .catch((err) => setState({ status: 'error', text: '', error: err.message }))
  }

  return (
    <div className="rotate-[0.4deg] border-[3px] border-ink bg-white p-4 shadow-hard-sm">
      <div className="flex items-baseline justify-between gap-2">
        <span className="font-hand text-[19px] font-bold">🤖 your month, summarized</span>
        {state.status === 'done' && (
          <button
            onClick={regenerate}
            className="shrink-0 border-2 border-ink bg-white px-2 py-0.5 text-[10.5px] font-bold active:bg-yellow"
          >
            ↻ regenerate
          </button>
        )}
      </div>

      {state.status === 'loading' && (
        <p className="mt-2 animate-pulse text-[12.5px] font-semibold opacity-50">
          writing this month's summary…
        </p>
      )}
      {state.status === 'error' && (
        <p className="mt-2 text-[12.5px] font-semibold opacity-60">
          couldn't reach the AI summary right now —{' '}
          <button onClick={regenerate} className="underline">
            try again
          </button>
        </p>
      )}
      {state.status === 'done' && (
        <p className="mt-2 text-[13px] font-semibold leading-snug">{state.text}</p>
      )}
    </div>
  )
}
