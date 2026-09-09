import { Grain, GridField, MovingGlow, PaperField, Ring, Vignette, DriftWord } from './Atmosphere'
import Glow from './Glow'
import { BG } from './palette'

const DARK_VARIANTS = new Set(['ink', 'wrapped', 'final'])

/** Per-variant atmosphere recipe — layered behind the content. */
function Atmosphere({ variant }) {
  const dark = DARK_VARIANTS.has(variant)

  switch (variant) {
    case 'ink':
      return (
        <>
          <MovingGlow color="var(--color-mint)" size={900} x="18%" y="30%" opacity={0.16} path={[-40, 20, -40]} />
          <MovingGlow color="var(--color-lilac)" size={820} x="92%" y="76%" opacity={0.16} axis="y" path={[-30, 30, -30]} />
          <Ring size={640} x="86%" y="30%" dark />
          <DriftWord dark className="right-[-6%] top-[8%] text-[30vw] sm:text-[20vw]">MONEY</DriftWord>
          <Grain dark />
          <Vignette strength={0.5} />
        </>
      )
    case 'insights':
      return (
        <>
          <GridField />
          <Glow color="var(--color-sky)" size={860} x="8%" y="4%" opacity={0.22} />
          <Glow color="var(--color-lilac)" size={760} x="100%" y="100%" opacity={0.2} />
          <DriftWord className="left-[-4%] bottom-[-6%] text-[26vw] sm:text-[17vw]">method</DriftWord>
          <Grain />
        </>
      )
    case 'wrapped':
      return (
        <>
          <MovingGlow color="#ffa84d" size={1200} x="50%" y="118%" opacity={0.3} axis="x" path={[-60, 60, -60]} />
          <Glow color="var(--color-pink)" size={820} x="92%" y="96%" opacity={0.24} />
          <Glow color="var(--color-lilac)" size={720} x="4%" y="-4%" opacity={0.2} />
          <DriftWord dark drift={40} className="left-[-8%] top-1/2 -translate-y-1/2 text-[34vw] sm:text-[22vw]">
            WRAPPED
          </DriftWord>
          <Grain dark />
          <Vignette strength={0.42} />
        </>
      )
    case 'features':
      return (
        <>
          <Glow color="var(--color-mint)" size={780} x="-4%" y="8%" opacity={0.2} />
          <Glow color="var(--color-pink)" size={720} x="102%" y="42%" opacity={0.16} />
          <Glow color="var(--color-sky)" size={720} x="40%" y="104%" opacity={0.16} />
          <PaperField className="opacity-[0.04]" />
          <DriftWord className="right-[-8%] bottom-[-4%] text-[26vw] sm:text-[16vw]">inside</DriftWord>
          <Grain />
        </>
      )
    case 'final':
      return (
        <>
          <MovingGlow color="var(--color-lilac)" size={1100} x="50%" y="14%" opacity={0.24} axis="x" path={[-40, 40, -40]} />
          <Glow color="var(--color-mint)" size={720} x="2%" y="102%" opacity={0.14} />
          <Glow color="var(--color-pink)" size={720} x="100%" y="98%" opacity={0.14} />
          <DriftWord dark drift={44} className="inset-x-0 bottom-[-4%] text-center text-[30vw] sm:text-[19vw]">
            receiptly
          </DriftWord>
          <Grain dark />
          <Vignette strength={0.6} />
        </>
      )
    default:
      return <Grain dark={dark} />
  }
}

/** Shared section wrapper — tight rhythm, its own atmosphere, content on z-[1]. */
export function Section({ id, variant = 'features', className = '', children }) {
  const dark = DARK_VARIANTS.has(variant)
  return (
    <section
      id={id}
      style={{ background: BG[variant] ?? BG.features }}
      className={`relative isolate scroll-mt-16 overflow-hidden px-5 py-20 sm:py-28 lg:px-8 ${
        dark ? 'text-bg' : 'text-ink'
      } ${className}`}
    >
      <Atmosphere variant={variant} />
      <div className="relative z-[1] mx-auto max-w-[1180px]">{children}</div>
    </section>
  )
}

/** Small editorial label with a thin leading rule. */
export function Label({ children, dark = false, className = '' }) {
  return (
    <p
      className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.28em] ${
        dark ? 'text-yellow/70' : 'text-ink/40'
      } ${className}`}
    >
      <span className={`h-px w-8 ${dark ? 'bg-yellow/40' : 'bg-ink/25'}`} />
      {children}
    </p>
  )
}

/** Kept for older imports. */
export function Eyebrow({ children, dark = false }) {
  return <Label dark={dark}>{children}</Label>
}
