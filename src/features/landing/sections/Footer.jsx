export default function Footer() {
  return (
    <footer className="bg-bg px-5 py-12 lg:px-8">
      <div className="mx-auto flex max-w-[1180px] flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <span className="font-display text-[16px] leading-none">
            receipt
            <span className="ml-0.5 inline-block -rotate-3 border-2 border-ink bg-yellow px-1 shadow-hard-xs">
              ly
            </span>
          </span>
          <p className="mt-2 font-hand text-[14px] font-bold opacity-60">your money, understood. 🧾</p>
        </div>
        <div className="flex items-center gap-5 text-[12px] font-bold">
          <a
            href="https://github.com/JenisaRose/Receiptly"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-2 underline-offset-2 opacity-70 hover:opacity-100"
          >
            GitHub
          </a>
          <span className="opacity-40">your data stays on this device</span>
        </div>
      </div>
    </footer>
  )
}
