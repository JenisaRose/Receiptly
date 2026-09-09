/** A big soft light-bloom — a radial-gradient disc positioned freely inside
 *  a section. Size is capped to the viewport so it never swamps a phone. */
export default function Glow({
  color = 'var(--color-lilac)',
  size = 640,
  x = '50%',
  y = '40%',
  opacity = 0.3,
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute"
      style={{
        width: `min(${size}px, 88vw)`,
        height: `min(${size}px, 88vw)`,
        left: x,
        top: y,
        translate: '-50% -50%',
        background: `radial-gradient(closest-side, ${color}, transparent 72%)`,
        opacity,
      }}
    />
  )
}
