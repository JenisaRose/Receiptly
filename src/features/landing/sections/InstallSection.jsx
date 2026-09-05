import { motion } from 'framer-motion'
import { useState } from 'react'
import InstallButton from '../InstallButton'
import { useReveal } from '../motion'
import { Eyebrow } from '../Shell'

const INSTALL_CTA =
  'press inline-flex items-center justify-center border-[3px] border-ink bg-ink px-8 py-4 font-display text-[15px] text-yellow shadow-hard-lg focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink'

export default function InstallSection() {
  const reveal = useReveal()
  const [dismissed, setDismissed] = useState(false)

  return (
    <section id="install" className="relative overflow-hidden bg-yellow px-5 py-16 sm:py-20 lg:px-8">
      <span
        aria-hidden
        className="pointer-events-none absolute -right-6 -bottom-6 select-none font-display text-[24vw] leading-none text-ink/[0.06] sm:text-[15vw]"
      >
        📲
      </span>
      <div className="relative mx-auto grid max-w-[1180px] items-center gap-8 lg:grid-cols-[1fr_auto] lg:gap-16">
        <div>
          <Eyebrow>06 · take it with you</Eyebrow>
          <h2 className="mt-3 font-display text-[clamp(2.2rem,5.6vw,3.4rem)] leading-[1.02]">
            Install it like a real app.
          </h2>
          <p className="mt-4 max-w-[30rem] text-[15px] font-semibold opacity-70">
            Add Receiptly to your phone or computer and open it straight from the home screen — no
            browser bar, works offline, still 100% on your device. Or don't. It's the same app
            either way.
          </p>
        </div>

        <motion.div {...reveal(0.1)} className="flex flex-col items-start gap-3">
          <InstallButton
            className={INSTALL_CTA}
            noteClassName="mt-1 text-[12px] font-semibold opacity-65"
          />
          {!dismissed ? (
            <button
              onClick={() => setDismissed(true)}
              className="text-[12.5px] font-bold underline decoration-2 underline-offset-4 opacity-65 hover:opacity-100"
            >
              keep using it in the browser
            </button>
          ) : (
            <p className="text-[12.5px] font-semibold opacity-60">
              nothing to do — it already works right here.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
