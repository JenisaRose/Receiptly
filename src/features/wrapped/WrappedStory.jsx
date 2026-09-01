import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import EmptyState from '../../components/EmptyState'
import { useBudget } from '../../store/budgetContext'
import FinalReceiptCard from './cards/FinalReceiptCard'
import InsightCard from './cards/InsightCard'
import LeaderboardCard from './cards/LeaderboardCard'
import NoSpendCard from './cards/NoSpendCard'
import OpeningCard from './cards/OpeningCard'
import PriciestDayCard from './cards/PriciestDayCard'
import TotalCard from './cards/TotalCard'
import { buildWrapped } from './wrappedData'

const CARD_MS = 5200

const CARD = {
  opening: OpeningCard,
  total: TotalCard,
  leaderboard: LeaderboardCard,
  priciest: PriciestDayCard,
  nospend: NoSpendCard,
  insight: InsightCard,
  final: FinalReceiptCard,
}

const ANNOUNCE = {
  opening: (w) => `${w.monthLabel} ${w.year}, wrapped`,
  total: (w) => `you spent ${Math.round(w.total)} rupees in ${w.monthLabel}`,
  leaderboard: (w) => `${w.category?.label} led your month at ${w.category?.pct} percent`,
  priciest: (w) => `priciest day: ${w.priciest?.weekday} the ${w.priciest?.day}`,
  nospend: (w) =>
    `${w.noSpendCount} no-spend days${
      w.streakRange ? `, longest run ${w.streakRange.length}` : ''
    }`,
  insight: (w) => w.insight?.headline,
  final: () => 'your receipt for the month — save it or share it',
}

export default function WrappedStory({ onClose }) {
  const b = useBudget()
  const reduced = useReducedMotion()
  const w = useMemo(() => buildWrapped(b), [b])

  const cards = w.available ? w.cards : []
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const held = useRef(false)
  const holdTimer = useRef(null)

  const isLast = i >= cards.length - 1

  const go = useCallback(
    (delta) => setI((v) => Math.max(0, Math.min(v + delta, cards.length - 1))),
    [cards.length],
  )
  const restart = useCallback(() => {
    setI(0)
    setPaused(false)
  }, [])

  // lock the page behind the story
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  // auto-advance (timer, so it survives a backgrounded tab; the on-screen fill
  // is a pausable CSS animation, below). Skipped for reduced motion + last card.
  const autoAdvance = w.available && !reduced && !paused && !isLast
  useEffect(() => {
    if (!autoAdvance) return
    const t = setTimeout(() => setI((v) => v + 1), CARD_MS)
    return () => clearTimeout(t)
  }, [autoAdvance, i])

  // keyboard
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') go(1)
      else if (e.key === 'ArrowLeft') go(-1)
      else if (e.key === ' ') {
        e.preventDefault()
        setPaused((p) => !p)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, go])

  // hold-to-pause (a quick tap still counts as a nav tap)
  function pointerDown() {
    held.current = false
    holdTimer.current = setTimeout(() => {
      held.current = true
      setPaused(true)
    }, 220)
  }
  function pointerUp() {
    clearTimeout(holdTimer.current)
    if (held.current) setPaused(false)
  }
  function zoneTap(delta) {
    if (held.current) {
      held.current = false
      return
    }
    go(delta)
  }

  if (!w.available) {
    return (
      <Ground>
        <div className="wrapped-viewer relative flex flex-col items-center justify-center gap-4 overflow-hidden bg-bg p-6">
          <EmptyState
            emoji="🌙"
            title={`nothing to wrap for ${w.monthLabel} yet`}
            hint="log a few days, then play it back"
          />
          <button
            onClick={onClose}
            className="border-[3px] border-ink bg-white px-4 py-2 font-display text-[13px]"
          >
            close
          </button>
        </div>
      </Ground>
    )
  }

  const key = cards[i]
  const Card = CARD[key]

  return (
    <Ground>
      <div className="wrapped-viewer relative flex flex-col overflow-hidden bg-bg">
        {/* floating controls (Instagram-stories style) */}
        <div className="pointer-events-none absolute inset-x-0 top-0 z-40 flex items-start gap-2 p-3">
          <div className="flex flex-1 gap-1 pt-1">
            {cards.map((c, idx) => {
              const done = idx < i || (idx === i && isLast)
              const active = idx === i && !isLast
              return (
                <div
                  key={c}
                  className="h-[4px] flex-1 overflow-hidden border-2 border-ink bg-white/80"
                >
                  <div
                    key={`${idx}-${i}`}
                    className="h-full bg-ink"
                    style={
                      done || (active && reduced)
                        ? { width: '100%' }
                        : active
                          ? {
                              width: 0,
                              animation: `wrapped-fill ${CARD_MS}ms linear forwards`,
                              animationPlayState: paused ? 'paused' : 'running',
                            }
                          : { width: 0 }
                    }
                  />
                </div>
              )
            })}
          </div>
          {!isLast && (
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Resume' : 'Pause'}
              className="pointer-events-auto flex h-8 w-8 shrink-0 items-center justify-center border-[2.5px] border-ink bg-white text-[11px] font-bold"
            >
              {paused ? '▶' : '⏸'}
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="pointer-events-auto flex h-8 w-8 shrink-0 items-center justify-center border-[2.5px] border-ink bg-white text-[13px] font-bold"
          >
            ✕
          </button>
        </div>

        {/* card stage */}
        <motion.div
          className="absolute inset-0"
          drag={!isLast}
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.16}
          dragMomentum={false}
          onDragEnd={(_e, info) => {
            if (info.offset.y > 120) onClose()
            else if (info.offset.x < -70) go(1)
            else if (info.offset.x > 70) go(-1)
          }}
        >
          {/* tap zones — below the floating controls, above the card */}
          {!isLast && (
            <>
              <div
                role="presentation"
                onPointerDown={pointerDown}
                onPointerUp={pointerUp}
                onClick={() => zoneTap(-1)}
                className="absolute inset-y-0 left-0 z-30 w-1/3 cursor-w-resize"
              />
              <div
                role="presentation"
                onPointerDown={pointerDown}
                onPointerUp={pointerUp}
                onClick={() => zoneTap(1)}
                className="absolute inset-y-0 right-0 z-30 w-2/3 cursor-e-resize"
              />
            </>
          )}

          {/* keyed remount → each card plays its own entrance. No wrapper
              animation: the card's own transform-only entrances carry it, so a
              stalled spring still leaves the card readable. */}
          <div key={key} className="absolute inset-0">
            {key === 'final' ? (
              <FinalReceiptCard
                w={w}
                monthKey={b.month.key}
                monthLabel={b.month.longLabel}
                onReplay={restart}
                onClose={onClose}
              />
            ) : (
              <Card w={w} />
            )}
          </div>
        </motion.div>

        {paused && !isLast && (
          <div className="pointer-events-none absolute inset-x-0 bottom-6 z-40 text-center">
            <span className="inline-block -rotate-1 border-2 border-ink bg-white px-3 py-1 font-display text-[11px]">
              paused
            </span>
          </div>
        )}
      </div>

      <p className="sr-only" aria-live="polite">
        Card {i + 1} of {cards.length}. {ANNOUNCE[key]?.(w)}
      </p>
    </Ground>
  )
}

/**
 * The dark ground the viewer sits on. Portalled to <body> so it escapes
 * AppShell's transformed route wrapper (which would otherwise be the containing
 * block for `position: fixed`). Not animated — a stalled see-through backdrop
 * would leave the page usable behind it; the "entrance" is the first card.
 */
function Ground({ children }) {
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Your month, wrapped"
      className="fixed inset-0 z-[70] flex items-stretch justify-center bg-ink md:items-center md:p-6"
      style={{
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
      }}
    >
      {children}
    </div>,
    document.body,
  )
}
