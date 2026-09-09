import { motion, useReducedMotion } from 'framer-motion'
import Glow from './Glow'
import { GRAIN_URL } from './palette'

/* ---------- individual layers ---------- */

export function Grain({ dark = false }) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 bg-repeat [background-size:220px_220px] ${
        dark ? 'opacity-[0.16] mix-blend-screen' : 'opacity-[0.55] mix-blend-overlay'
      }`}
      style={{ backgroundImage: GRAIN_URL }}
    />
  )
}

/** Radial edge-darkening for dark sections — cinematic depth. */
export function Vignette({ strength = 0.55 }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background: `radial-gradient(120% 90% at 50% 40%, transparent 42%, rgba(8,7,12,${strength}) 100%)`,
      }}
    />
  )
}

/** Abstract "paper" field — overlapping translucent receipt shapes with
 *  line-item strokes. Reads as an atmospheric texture, not a photo, and
 *  needs no external asset. */
export function PaperField({ dark = false, className = '' }) {
  const stroke = dark ? '#ffffff' : '#14121f'
  const receipts = [
    { x: 60, y: 40, w: 190, h: 300, r: -13 },
    { x: 320, y: 120, w: 210, h: 340, r: 9 },
    { x: 150, y: 260, w: 170, h: 260, r: 22 },
    { x: 470, y: 30, w: 160, h: 250, r: -6 },
  ]
  return (
    <svg
      aria-hidden
      viewBox="0 0 640 520"
      preserveAspectRatio="xMidYMid meet"
      className={`pointer-events-none absolute left-1/2 top-1/2 h-[130%] w-[130%] -translate-x-1/2 -translate-y-1/2 opacity-[0.05] ${className}`}
    >
      {receipts.map((p, i) => (
        <g key={i} transform={`rotate(${p.r} ${p.x + p.w / 2} ${p.y + p.h / 2})`}>
          <rect
            x={p.x}
            y={p.y}
            width={p.w}
            height={p.h}
            fill="none"
            stroke={stroke}
            strokeWidth="2.5"
          />
          {Array.from({ length: Math.floor(p.h / 26) }, (_, k) => (
            <line
              key={k}
              x1={p.x + 16}
              y1={p.y + 24 + k * 26}
              x2={p.x + p.w - 16 - (k % 3) * 22}
              y2={p.y + 24 + k * 26}
              stroke={stroke}
              strokeWidth="3"
            />
          ))}
        </g>
      ))}
    </svg>
  )
}

/** Faint graph-paper grid — for the trends / insights mood. */
export function GridField({ dark = false }) {
  const c = dark ? 'rgba(255,255,255,0.05)' : 'rgba(20,18,31,0.05)'
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        backgroundImage: `linear-gradient(${c} 1px, transparent 1px), linear-gradient(90deg, ${c} 1px, transparent 1px)`,
        backgroundSize: '68px 68px',
        maskImage: 'radial-gradient(120% 80% at 50% 50%, #000 30%, transparent 85%)',
      }}
    />
  )
}

/** Huge low-opacity background word/symbol that drifts slowly. */
export function DriftWord({ children, dark = false, className = '', from = -18, drift = 26 }) {
  const reduced = useReducedMotion()
  return (
    <motion.span
      aria-hidden
      className={`pointer-events-none absolute select-none font-display leading-none tracking-tighter ${
        dark ? 'text-white/[0.045]' : 'text-ink/[0.05]'
      } ${className}`}
      initial={{ x: from }}
      animate={reduced ? undefined : { x: [from, from + drift, from] }}
      transition={reduced ? undefined : { duration: 22, repeat: Infinity, ease: 'easeInOut' }}
    >
      {children}
    </motion.span>
  )
}

/** A faint oversized ring — echoes the safe-to-spend circle. */
export function Ring({ size = 520, x = '50%', y = '50%', dark = false, stroke = 3 }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute rounded-full"
      style={{
        width: `min(${size}px, 120vw)`,
        height: `min(${size}px, 120vw)`,
        left: x,
        top: y,
        translate: '-50% -50%',
        border: `${stroke}px solid ${dark ? 'rgba(255,255,255,0.06)' : 'rgba(20,18,31,0.06)'}`,
      }}
    />
  )
}

/* ---------- slow-moving glow wrapper ---------- */

export function MovingGlow({ path = [-30, 30, -30], axis = 'x', ...glow }) {
  const reduced = useReducedMotion()
  const anim = reduced ? undefined : { [axis]: path }
  return (
    <motion.div
      className="absolute"
      style={{ left: glow.x ?? '50%', top: glow.y ?? '40%', translate: '-50% -50%' }}
      animate={anim}
      transition={reduced ? undefined : { duration: 26, repeat: Infinity, ease: 'easeInOut' }}
    >
      <Glow {...glow} x="50%" y="50%" />
    </motion.div>
  )
}
