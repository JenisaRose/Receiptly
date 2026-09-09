import { motion } from 'framer-motion'
import { useState } from 'react'
import { DriftWord, Grain } from '../Atmosphere'
import Glow from '../Glow'
import InstallButton from '../InstallButton'
import { BG } from '../palette'
import { useReveal } from '../motion'
import { Label } from '../Shell'

const INSTALL_CTA =
  'press inline-flex items-center justify-center border-[3px] border-ink bg-ink px-8 py-4 font-display text-[15px] text-yellow shadow-hard-lg focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-ink'

export default function InstallSection() {
  const reveal = useReveal()
  const [dismissed, setDismissed] = useState(false)

  return (
    <section
      id="install"
      style={{ background: BG.install }}
      className="relative isolate overflow-hidden px-5 py-24 sm:py-28 lg:px-8"
    >
      <Glow color="#ffffff" size={900} x="8%" y="-12%" opacity={0.5} />
      <Glow color="var(--color-mint)" size={820} x="104%" y="110%" opacity={0.4} />
      <Glow color="var(--color-orange)" size={620} x="50%" y="130%" opacity={0.22} />
      <DriftWord className="right-[-6%] bottom-[-10%] text-[30vw] leading-none sm:text-[18vw]">
        LOCAL
      </DriftWord>
      <Grain />

      <div className="relative z-[1] mx-auto grid max-w-[1180px] items-center gap-10 lg:grid-cols-[1fr_auto] lg:gap-20">
        <div>
          <Label>06 / 06 · take it with you</Label>
          <h2 className="mt-5 font-display text-[clamp(2.4rem,6.4vw,4rem)] leading-[0.98]">
            Install it like
          </h2>
          <p className="mt-1 font-serif text-[clamp(2rem,5.4vw,3.4rem)] italic leading-tight opacity-70">
            a real app.
          </p>
          <p className="mt-6 max-w-[30rem] text-[15.5px] font-semibold opacity-70">
            Runs in your browser. Install it when you want the app — its own window, an icon on
            your home screen or dock, and it opens offline. Same Receiptly, same data, still 100%
            on your device.
          </p>
          <p className="mt-4 max-w-[30rem] text-[12.5px] font-semibold opacity-45">
            On a laptop, right-click Receiptly on the taskbar afterwards → “Pin to taskbar” to keep
            it one click away. On a phone it lands on your home screen automatically.
          </p>
        </div>

        <motion.div {...reveal(0.1)} className="flex flex-col items-start gap-3">
          <InstallButton
            className={INSTALL_CTA}
            noteClassName="mt-2 max-w-[24rem] text-[12px] font-semibold leading-snug opacity-65"
          />
          {!dismissed ? (
            <button
              onClick={() => setDismissed(true)}
              className="text-[12.5px] font-bold underline decoration-2 underline-offset-4 opacity-65 hover:opacity-100"
            >
              or just keep using it in the browser
            </button>
          ) : (
            <p className="text-[12.5px] font-semibold opacity-60">
              nothing to do — Receiptly already works right here.
            </p>
          )}
        </motion.div>
      </div>
    </section>
  )
}
