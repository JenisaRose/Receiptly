import { BG } from '../palette'
import { Grain } from '../Atmosphere'

export default function Footer() {
  return (
    <footer
      style={{ background: BG.features }}
      className="relative isolate overflow-hidden px-5 py-14 lg:px-8"
    >
      <Grain />
      <div className="relative z-[1] mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <span className="font-display text-[17px] leading-none">
            receipt
            <span className="ml-0.5 inline-block -rotate-3 border-2 border-ink bg-yellow px-1 shadow-hard-xs">
              ly
            </span>
          </span>
          <p className="mt-2 font-serif text-[15px] italic opacity-55">your money, understood.</p>
        </div>
        <div className="flex items-center gap-5 text-[11px] font-bold uppercase tracking-[0.16em]">
          <a
            href="https://github.com/JenisaRose/Receiptly"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-2 underline-offset-4 opacity-70 hover:opacity-100"
          >
            GitHub
          </a>
          <span className="opacity-35">data stays on this device</span>
        </div>
      </div>
    </footer>
  )
}
