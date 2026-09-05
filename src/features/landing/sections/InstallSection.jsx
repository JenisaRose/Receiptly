import { motion } from 'framer-motion'
import { useState } from 'react'
import InstallButton from '../InstallButton'
import { useReveal } from '../motion'

const INSTALL_CTA =
  'press inline-flex items-center justify-center border-[3px] border-ink bg-ink px-8 py-4 font-display text-[15px] text-yellow shadow-hard-lg focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink'

export default function InstallSection() {
  const reveal = useReveal()
  const [dismissed, setDismissed] = useState(false)

  return (
    <section className="bg-yellow px-5 py-24 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-[640px] text-center">
        <motion.h2
          {...reveal(0)}
          className="font-display text-[clamp(2rem,5.5vw,3rem)] leading-[1.05]"
        >
          Take Receiptly with you.
        </motion.h2>
        <motion.p {...reveal(0.08)} className="mx-auto mt-5 max-w-[26rem] text-[14.5px] font-semibold opacity-70">
          Install Receiptly on your phone or computer and open it like an app — one tap, no
          browser bar, straight to your money.
        </motion.p>

        <motion.div
          {...reveal(0.16)}
          className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <InstallButton className={INSTALL_CTA} noteClassName="mt-2 text-[12px] font-semibold opacity-60" />
          {!dismissed && (
            <button
              onClick={() => setDismissed(true)}
              className="text-[13px] font-bold underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100"
            >
              keep using it in your browser
            </button>
          )}
          {dismissed && (
            <p className="text-[13px] font-semibold opacity-60">
              great — no changes needed, Receiptly already works right here.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
