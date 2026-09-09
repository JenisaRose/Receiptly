const DOTS = ['bg-pink', 'bg-yellow', 'bg-mint']

/** App-window chrome shared by every mockup screen. */
export default function Win({ title, className = '', children }) {
  return (
    <div
      className={`overflow-hidden rounded-[20px] border-[3px] border-ink bg-white shadow-hard-lg ${className}`}
    >
      <div className="flex items-center gap-1.5 border-b-[2.5px] border-ink px-4 py-2.5">
        {DOTS.map((c) => (
          <span key={c} className={`h-2.5 w-2.5 rounded-full border border-ink/40 ${c}`} />
        ))}
        <span className="ml-auto text-[8.5px] font-bold tracking-[0.2em] opacity-40">
          {title}
        </span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  )
}
