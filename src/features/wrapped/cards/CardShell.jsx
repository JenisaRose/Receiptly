/**
 * A Wrapped card: an accent-coloured sticker block on the story's lavender
 * ground. The entrance animation is applied by WrappedStory, not here.
 */
export default function CardShell({ accent = 'bg-yellow', className = '', children }) {
  return (
    <div
      className={`w-full max-w-[340px] border-4 border-ink ${accent} p-6 shadow-hard-lg ${className}`}
    >
      {children}
    </div>
  )
}
