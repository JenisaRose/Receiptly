/**
 * The house style for "there's nothing here yet" — a dashed sticker with a
 * handwritten line, not a generic dashboard placeholder.
 */
export default function EmptyState({ emoji, title, hint, action }) {
  return (
    <div className="flex flex-col items-center gap-1 border-[3px] border-dashed border-ink/40 px-6 py-8 text-center">
      {emoji && <span className="mb-1 text-[26px]">{emoji}</span>}
      <p className="font-hand text-[18px] font-bold opacity-75">{title}</p>
      {hint && <p className="text-[12px] opacity-55">{hint}</p>}
      {action && <div className="mt-3">{action}</div>}
    </div>
  )
}
