import { motion, useReducedMotion } from 'framer-motion'

function Choice({ emoji, title, lines, accent, onClick, delay, reduced }) {
  return (
    <motion.button
      onClick={onClick}
      initial={reduced ? false : { y: 52, rotate: delay > 0.15 ? 3 : -3 }}
      animate={{ y: 0, rotate: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 20, delay }}
      whileHover={reduced ? undefined : { y: -8, rotate: -1.5, transition: { type: 'spring', stiffness: 400, damping: 18 } }}
      className={`press flex-1 border-[4px] border-ink ${accent} p-8 text-left shadow-hard-lg`}
      style={{ '--press-x': '6px', '--press-y': '6px' }}
    >
      <motion.span
        className="inline-block text-[56px]"
        animate={reduced ? undefined : { rotate: [0, -8, 0, 8, 0] }}
        transition={reduced ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.6 }}
      >
        {emoji}
      </motion.span>
      <p className="mt-3 font-display text-[26px] leading-tight">{title}</p>
      <p className="mt-2 text-[13.5px] font-semibold leading-snug">{lines}</p>
    </motion.button>
  )
}

export default function ChoiceStep({ onFresh, onDemo, onBack }) {
  const reduced = useReducedMotion()

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-y-auto bg-ink px-5 py-12"
      style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <motion.p
        className="font-hand text-[22px] font-bold text-yellow"
        initial={reduced ? false : { y: -18 }}
        animate={{ y: 0 }}
      >
        one last thing —
      </motion.p>
      <motion.h2
        className="mb-10 mt-1 text-center font-display text-[clamp(2rem,7vw,3rem)] leading-tight text-white"
        initial={reduced ? false : { scale: 0.75 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 15 }}
      >
        how do you want to start?
      </motion.h2>

      <div className="flex w-full max-w-[680px] flex-col gap-5 sm:flex-row">
        <Choice
          reduced={reduced}
          delay={0.12}
          emoji="🌱"
          accent="bg-mint"
          title="Start fresh"
          lines="A clean Receiptly. Track your own money from today."
          onClick={onFresh}
        />
        <Choice
          reduced={reduced}
          delay={0.22}
          emoji="👀"
          accent="bg-yellow"
          title="Explore the demo"
          lines="See it in action first — 12 months of example data you can clear later."
          onClick={onDemo}
        />
      </div>

      <button
        onClick={onBack}
        className="mt-10 font-hand text-[17px] font-bold text-white/60 underline decoration-dotted underline-offset-2 hover:text-white"
      >
        ‹ back
      </button>
    </div>
  )
}
