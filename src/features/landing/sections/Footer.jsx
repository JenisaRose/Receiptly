export default function Footer() {
  return (
    <footer className="bg-bg px-5 py-10 text-center lg:px-8">
      <span className="font-display text-[16px] leading-none">
        receipt
        <span className="ml-0.5 inline-block -rotate-3 border-2 border-ink bg-yellow px-1 shadow-hard-xs">
          ly
        </span>
      </span>
      <p className="mt-2 font-hand text-[14px] font-bold opacity-60">
        your money, understood. 🧾
      </p>
      <p className="mt-3 text-[11px] font-semibold opacity-45">
        a portfolio project ·{' '}
        <a
          href="https://github.com/JenisaRose/Receiptly"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-2 underline-offset-2 hover:opacity-80"
        >
          view on GitHub
        </a>{' '}
        · your data stays on this device
      </p>
    </footer>
  )
}
