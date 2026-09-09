import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const LINKS = [
  { href: '#idea', label: 'The idea' },
  { href: '#method', label: 'How it works' },
  { href: '#features', label: 'Features' },
  { href: '#wrapped', label: 'Wrapped' },
]

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-ink/10 bg-[#efeafb]' : 'border-b border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-3.5 lg:px-8">
        <span className="font-display text-[17px] leading-none">
          receipt
          <span className="ml-0.5 inline-block -rotate-3 border-2 border-ink bg-yellow px-1 shadow-hard-xs">
            ly
          </span>
        </span>

        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[11px] font-bold uppercase tracking-[0.16em] opacity-45 transition-opacity hover:opacity-100"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <Link
          to="/app"
          className="press border-[2.5px] border-ink bg-ink px-4 py-2 font-display text-[12px] text-yellow shadow-hard-xs focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          Explore Receiptly →
        </Link>
      </div>
    </div>
  )
}
