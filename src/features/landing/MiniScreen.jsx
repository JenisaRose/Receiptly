export default function MiniScreen({ title, className = '', children }) {
  return (
    <div className={`rounded-2xl border-[2.5px] border-ink bg-white shadow-hard-sm ${className}`}>
      <div className="border-b-2 border-ink px-3 py-1.5">
        <span className="text-[8.5px] font-bold uppercase tracking-wide opacity-45">{title}</span>
      </div>
      <div className="p-3">{children}</div>
    </div>
  )
}
