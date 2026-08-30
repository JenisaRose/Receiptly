export default function Wordmark({ className = '' }) {
  return (
    <span className={`font-display text-[22px] leading-none ${className}`}>
      receipt
      <span className="ml-0.5 inline-block -rotate-3 border-[3px] border-ink bg-yellow px-1.5 shadow-hard-sm">
        ly
      </span>
    </span>
  )
}
