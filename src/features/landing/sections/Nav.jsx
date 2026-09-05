import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const LINKS = [
  { href: '#idea', label: 'The idea' },
  { href: '#method', label: 'How it works' },
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
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-200 ${
        scrolled ? 'border-b-[2.5px] border-ink bg-bg' : 'border-b-2 border-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1180px] items-center justify-between px-5 py-3 lg:px-8">
        <span className="font-display text-[17px] leading-none">
          receipt
          <span className="ml-0.5 inline-block -rotate-3 border-2 border-ink bg-yellow px-1 shadow-hard-xs">
            ly
          </span>
        </span>

        <nav className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-[12.5px] font-bold tracking-wide opacity-60 hover:opacity-100"
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
