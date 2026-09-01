import { inr } from '../../lib/format'

/**
 * Rupee entry that shows a grouped number and reports a plain integer.
 * `size="hero"` is the giant centred one; `size="row"` fits inside a bill row.
 */
export default function RupeeInput({
  value,
  onChange,
  placeholder = '0',
  size = 'hero',
  ariaLabel,
}) {
  const digits = value ? String(Math.round(value)) : ''
  const display = digits ? inr(Number(digits)) : ''
  const hero = size === 'hero'

  return (
    <div className={`flex items-baseline ${hero ? 'gap-2' : 'gap-1'}`}>
      <span
        className={`font-display ${hero ? 'text-[clamp(1.7rem,6vw,2.3rem)]' : 'text-[13px]'} opacity-60`}
      >
        ₹
      </span>
      <input
        type="text"
        inputMode="numeric"
        aria-label={ariaLabel}
        value={display}
        placeholder={placeholder}
        onChange={(e) => {
          const d = e.target.value.replace(/\D/g, '').slice(0, 9)
          onChange(d ? Number(d) : 0)
        }}
        className={`min-w-0 flex-1 bg-transparent font-display tabular-nums outline-none placeholder:opacity-25 ${
          hero ? 'w-full text-[clamp(2.9rem,13vw,4rem)] leading-none' : 'w-full text-[15px]'
        }`}
      />
    </div>
  )
}
