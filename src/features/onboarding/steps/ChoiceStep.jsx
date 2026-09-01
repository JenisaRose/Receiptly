import { motion, useReducedMotion } from 'framer-motion'

function Choice({ emoji, title, lines, accent, onClick, delay, reduced }) {
  return (
    <motion.button
      onClick={onClick}
      initial={reduced ? false : { y: 44 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 240, damping: 22, delay }}
      whileHover={reduced ? undefined : { y: -6, rotate: -1 }}
      className={`press flex-1 border-[4px] border-ink ${accent} p-6 text-left shadow-hard-lg`}
      style={{ '--press-x': '5px', '--press-y': '5px' }}
    >
      <span className="text-[44px]">{emoji}</span>
      <p className="mt-2 font-display text-[22px] leading-tight">{title}</p>
      <p className="mt-1.5 text-[12.5px] font-semibold leading-snug">{lines}</p>
    </motion.button>
  )
}

export default function ChoiceStep({ onFresh, onDemo, onBack }) {
  const reduced = useReducedMotion()

  return (
    <div
      className="fixed inset-0 z-[60] flex flex-col items-center justify-center overflow-y-auto bg-ink px-5 py-10"
      style={{
        backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 1px, transparent 1px)',
        backgroundSize: '22px 22px',
      }}
    >
      <motion.p
        className="font-hand text-[20px] font-bold text-yellow"
        initial={reduced ? false : { y: -16 }}
        animate={{ y: 0 }}
      >
        one last thing —
      </motion.p>
      <motion.h2
        className="mb-8 mt-1 text-center font-display text-[clamp(1.8rem,8vw,2.6rem)] leading-tight text-white"
        initial={reduced ? false : { scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 240, damping: 18 }}
      >
        how do you want to start?
      </motion.h2>

      <div className="flex w-full max-w-[440px] flex-col gap-4 sm:flex-row">
        <Choice
          reduced={reduced}
          delay={0.1}
          emoji="🌱"
          accent="bg-mint"
          title="Start fresh"
          lines="A clean Receiptly. Track your own money from today."
          onClick={onFresh}
        />
        <Choice
          reduced={reduced}
          delay={0.2}
          emoji="👀"
          accent="bg-yellow"
          title="Explore the demo"
          lines="See it in action first — 12 months of example data you can clear later."
          onClick={onDemo}
        />
      </div>

      <button
        onClick={onBack}
        className="mt-8 font-hand text-[16px] font-bold text-white/60 underline decoration-dotted underline-offset-2 hover:text-white"
      >
        ‹ back
      </button>
    </div>
  )
}
