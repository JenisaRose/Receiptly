import { useTheme } from '../store/themeContext'

const OPTIONS = [
  { value: 'light', icon: '☀', label: 'Light' },
  { value: 'dark', icon: '◐', label: 'Dark' },
  { value: 'system', icon: '◌', label: 'System' },
]

/**
 * Light / Dark / System picker for Settings → Appearance. Changing the
 * option applies immediately (no Save) and persists across reloads.
 */
export default function ThemeToggle() {
  const { pref, resolved, setPref } = useTheme()

  return (
    <div>
      <div role="group" aria-label="Theme" className="flex gap-2">
        {OPTIONS.map((o) => {
          const active = pref === o.value
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => setPref(o.value)}
              className={`press flex flex-1 flex-col items-center gap-1 border-[3px] border-ink px-2 py-2.5 text-[12px] font-bold shadow-hard-xs ${
                active ? 'bg-yellow text-on-accent' : 'bg-surface'
              }`}
              style={{ '--press-x': '3px', '--press-y': '3px' }}
            >
              <span className="text-[15px] leading-none" aria-hidden>
                {o.icon}
              </span>
              {o.label}
            </button>
          )
        })}
      </div>
      <p className="mt-2 text-[11px] opacity-55">
        {pref === 'system'
          ? `following your device — currently ${resolved}`
          : `always ${pref}`}
      </p>
    </div>
  )
}
