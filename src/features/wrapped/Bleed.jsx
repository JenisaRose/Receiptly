/**
 * A full-bleed Wrapped story card. Fills the whole viewer edge-to-edge and
 * carries its own accent colour + dotted texture — no floating card, no empty
 * margin. Content is laid out by the caller (usually flex + absolute bits).
 */
export default function Bleed({ accent = 'bg-yellow', className = '', children }) {
  return (
    <div
      className={`absolute inset-0 overflow-hidden ${accent} ${className}`}
      style={{
        backgroundImage: 'radial-gradient(rgba(20, 18, 31, 0.16) 1.5px, transparent 1.5px)',
        backgroundSize: '24px 24px',
      }}
    >
      {children}
    </div>
  )
}
