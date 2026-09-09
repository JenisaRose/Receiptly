/** A gradient band that straddles the join between two sections so their
 *  colours melt into each other instead of meeting at a hard edge. Sits
 *  above both via z-index + negative margins. */
export default function Seam({ from, to, h = 160 }) {
  return (
    <div
      aria-hidden
      className="pointer-events-none relative z-[3]"
      style={{
        height: h,
        marginTop: -h / 2,
        marginBottom: -h / 2,
        background: `linear-gradient(180deg, ${from} 0%, ${to} 100%)`,
      }}
    />
  )
}
