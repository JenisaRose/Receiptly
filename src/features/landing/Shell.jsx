import Grain from './Grain'
import { DARK_BG, LIGHT_BG } from './texture'

/** Shared section wrapper. Keeps vertical rhythm tight (the point of the
 *  redesign) and hangs an oversized faint watermark in the background so
 *  large sections never read as empty. */
export function Section({ id, dark = false, className = '', watermark, children }) {
  return (
    <section
      id={id}
      style={{ background: dark ? DARK_BG : LIGHT_BG }}
      className={`relative scroll-mt-16 overflow-hidden px-5 py-16 sm:py-20 lg:px-8 ${
        dark ? 'text-bg' : 'text-ink'
      } ${className}`}
    >
      <Grain dark={dark} />
      {watermark && (
        <span
          aria-hidden
          className={`pointer-events-none absolute -right-4 bottom-2 select-none font-display text-[22vw] leading-none tracking-tighter sm:text-[16vw] ${
            dark ? 'text-bg/[0.04]' : 'text-ink/[0.04]'
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
