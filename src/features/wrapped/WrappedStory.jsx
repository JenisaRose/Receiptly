import { motion, useReducedMotion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import EmptyState from '../../components/EmptyState'
import { useBudget } from '../../store/budgetContext'
import CategoryCard from './cards/CategoryCard'
import FinalReceiptCard from './cards/FinalReceiptCard'
import InsightCard from './cards/InsightCard'
import OpeningCard from './cards/OpeningCard'
import PriciestDayCard from './cards/PriciestDayCard'
import StreakCard from './cards/StreakCard'
import TotalCard from './cards/TotalCard'
import { buildWrapped } from './wrappedData'

const CARD_MS = 4600

const CARD = {
  opening: OpeningCard,
  total: TotalCard,
  category: CategoryCard,
  priciest: PriciestDayCard,
  insight: InsightCard,
  streak: StreakCard,
  final: FinalReceiptCard,
}
const ANNOUNCE = {
  opening: (w) => `${w.monthLabel}, wrapped`,
  total: (w) => `you spent ${w.total} rupees`,
  category: (w) => `${w.category?.label} led your month`,
  priciest: (w) => `priciest day: ${w.priciest?.label}`,
  insight: (w) => w.insight?.headline,
  streak: (w) => w.achievement?.headline,
  final: () => 'your shareable receipt',
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
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-6">
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
      {/* progress segments — active one fills via a pausable CSS animation */}
      <div className="flex gap-1 px-4 pt-3">
        {cards.map((c, idx) => {
          const done = idx < i || (idx === i && isLast)
          const active = idx === i && !isLast
          return (
            <div key={c} className="h-[3px] flex-1 overflow-hidden border border-ink bg-white">
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

      <div className="flex items-center justify-between px-4 pb-1 pt-2">
        <span className="font-display text-[13px]">
          {w.monthLabel} · wrapped
        </span>
        <div className="flex gap-1.5">
          {!isLast && (
            <button
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Resume' : 'Pause'}
              className="flex h-7 w-7 items-center justify-center border-[2.5px] border-ink bg-white text-[11px] font-bold"
            >
              {paused ? '▶' : '⏸'}
            </button>
          )}
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-7 w-7 items-center justify-center border-[2.5px] border-ink bg-white text-[13px] font-bold"
          >
            ✕
          </button>
        </div>
      </div>

      {/* card stage */}
      <motion.div
        className="relative flex flex-1 items-center justify-center overflow-hidden px-4 pb-6"
        drag={!isLast}
        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
        dragElastic={0.18}
        dragMomentum={false}
        onDragEnd={(_e, info) => {
          if (info.offset.y > 110) onClose()
          else if (info.offset.x < -70) go(1)
          else if (info.offset.x > 70) go(-1)
        }}
      >
        {/* tap zones (touch/mouse only — keyboard uses arrow keys) */}
        {!isLast && (
          <>
            <div
              role="presentation"
              onPointerDown={pointerDown}
              onPointerUp={pointerUp}
              onClick={() => zoneTap(-1)}
              className="absolute inset-y-0 left-0 z-10 w-1/3 cursor-w-resize"
            />
            <div
              role="presentation"
              onPointerDown={pointerDown}
              onPointerUp={pointerUp}
              onClick={() => zoneTap(1)}
              className="absolute inset-y-0 right-0 z-10 w-2/3 cursor-e-resize"
            />
          </>
        )}

        {/* keyed remount → each card plays its own entrance; no exit needed.
            Transform-only (no opacity) so a stalled spring still leaves the
            card readable rather than invisible. */}
        <motion.div
          key={key}
          className="w-full max-w-[340px]"
          initial={{ scale: 0.92, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
        >
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
        </motion.div>

        <p
          className="pointer-events-none absolute bottom-1.5 left-0 right-0 text-center text-[10px] font-bold opacity-35"
          aria-hidden
        >
          {isLast ? 'save it or share it' : 'tap to skip · hold to pause · swipe down to exit'}
        </p>
      </motion.div>

      <p className="sr-only" aria-live="polite">
        Card {i + 1} of {cards.length}. {ANNOUNCE[key]?.(w)}
      </p>
    </Ground>
  )
}

/**
 * The full-screen lavender ground the story sits on. Portalled to <body> so it
 * escapes AppShell's transformed route wrapper (which would otherwise be the
 * containing block for `position: fixed`). Deliberately not animated — a
 * see-through backdrop from a stalled entrance would leave the page usable
 * behind it; the "entrance" is the first card springing in.
 */
function Ground({ children }) {
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Your month, wrapped"
      className="fixed inset-0 z-[70] flex flex-col bg-bg"
      style={{
        backgroundImage: 'radial-gradient(var(--color-ink) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      {children}
    </div>,
    document.body,
  )
}
