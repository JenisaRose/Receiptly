import { BG } from '../../lib/theme'

/**
 * The shared "intake form on a clipboard" shell for the three form steps.
 * Accent-topped, a rotated section-number tab poking out, sticky footer nav.
 */
export default function FormPanel({
  n,
  total = 5,
  accent = 'mint',
  eyebrow,
  title,
  children,
  onBack,
  onContinue,
  onSkip,
  canContinue = true,
  continueLabel = 'continue →',
}) {
  return (
    <div className="relative w-full max-w-[440px]">
      {/* clipboard clip */}
      <div className="absolute left-1/2 top-[-14px] z-10 h-6 w-24 -translate-x-1/2 rotate-[-2deg] rounded-sm border-[3px] border-ink bg-ink" />

      <div className="relative border-[3px] border-ink bg-white shadow-hard-lg">
        {/* accent header */}
        <div
          className={`flex items-center justify-between border-b-[3px] border-ink px-5 py-2.5 ${BG[accent]}`}
        >
          <span className="font-display text-[11px] uppercase tracking-[0.2em]">setup</span>
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, idx) => (
              <span
                key={idx}
                className={`h-2.5 w-2.5 rounded-full border-2 border-ink ${
                  idx < n ? 'bg-ink' : 'bg-white'
                }`}
              />
            ))}
          </div>
        </div>

        {/* section number tab */}
        <span
          className={`absolute left-[-10px] top-[52px] grid h-11 w-11 -rotate-6 place-items-center border-[3px] border-ink font-display text-[22px] shadow-hard-xs ${BG[accent]}`}
        >
          {n}
        </span>

        <div className="px-6 pb-6 pt-7 sm:px-8">
          {eyebrow && (
            <p className="mb-1 font-hand text-[17px] font-bold opacity-60">{eyebrow}</p>
          )}
          <h2 className="font-display text-[clamp(1.5rem,6vw,1.9rem)] leading-tight">{title}</h2>
          <div className="mt-6">{children}</div>
        </div>

        {/* footer nav */}
        <div className="flex items-center gap-3 border-t-[3px] border-ink px-5 py-3.5">
          <button
            onClick={onBack}
            className="press border-[3px] border-ink bg-white px-3.5 py-2 font-display text-[12px] shadow-hard-xs"
            style={{ '--press-x': '3px', '--press-y': '3px' }}
          >
            ‹ back
          </button>
          {onSkip && (
            <button
              onClick={onSkip}
              className="font-hand text-[16px] font-bold underline decoration-dotted underline-offset-2 opacity-55 hover:opacity-100"
            >
              skip for now
            </button>
          )}
          <button
            onClick={onContinue}
            disabled={!canContinue}
            className="press ml-auto border-[3px] border-ink bg-ink px-5 py-2 font-display text-[13px] text-yellow shadow-[4px_4px_0_var(--color-pink)] disabled:opacity-40 disabled:shadow-none"
            style={{ '--press-x': '4px', '--press-y': '4px' }}
          >
            {continueLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
