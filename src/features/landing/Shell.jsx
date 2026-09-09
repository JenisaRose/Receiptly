import Grain from './Grain'
import Glow from './Glow'
import { DARK_BG, LIGHT_BG } from './texture'

/** Shared section wrapper. Tight vertical rhythm, an oversized faint
 *  watermark so large sections never read as empty, a tonal gradient
 *  base, and soft light-blooms for atmosphere. Pass `glow` to override
 *  the default blooms. */
export function Section({ id, dark = false, bg, className = '', watermark, glow, children }) {
  const defaultGlow = dark ? (
    <>
      <Glow color="#c9b8ff" size={680} x="12%" y="8%" opacity={0.2} />
      <Glow color="#ff6fb0" size={560} x="100%" y="100%" opacity={0.14} />
    </>
  ) : (
    <>
      <Glow color="#ffffff" size={720} x="82%" y="-4%" opacity={0.5} />
      <Glow color="#79f2c0" size={520} x="2%" y="104%" opacity={0.22} />
      <Glow color="#6fd8ff" size={480} x="100%" y="108%" opacity={0.2} />
    </>
  )

  return (
    <section
      id={id}
      style={{ background: bg ?? (dark ? DARK_BG : LIGHT_BG) }}
      className={`relative scroll-mt-16 overflow-hidden px-5 py-16 sm:py-20 lg:px-8 ${
        dark ? 'text-bg' : 'text-ink'
      } ${className}`}
    >
      {glow ?? defaultGlow}
      <Grain dark={dark} />
      {watermark && (
        <span
          aria-hidden
          className={`pointer-events-none absolute -right-4 bottom-2 select-none font-display text-[22vw] leading-none tracking-tighter sm:text-[16vw] ${
            dark ? 'text-bg/[0.05]' : 'text-ink/[0.05]'
          }`}
        >
          {watermark}
        </span>
      )}
      <div className="relative z-[1] mx-auto max-w-[1180px]">{children}</div>
    </section>
  )
}

/** Small editorial section label — "01 · THE IDEA" */
export function Eyebrow({ children, dark = false }) {
  return (
    <p
      className={`text-[11px] font-bold uppercase tracking-[0.24em] ${
        dark ? 'text-yellow/70' : 'text-ink/45'
      }`}
    >
      {children}
    </p>
  )
}
