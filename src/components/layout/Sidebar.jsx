import { NavLink } from 'react-router-dom'
import { NAV_ACTIVE_BG } from '../../lib/theme'
import { NAV } from './navItems'
import Wordmark from './Wordmark'

export default function Sidebar({ onLogExpense }) {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[232px] flex-col border-r-[3px] border-ink bg-white p-4 lg:flex">
      <div className="mb-6 px-1">
        <Wordmark />
      </div>

      <nav className="flex flex-col gap-1.5">
        {NAV.map((item) => (
          <NavLink
            key={item.key}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 border-[3px] px-2.5 py-2 text-sm font-semibold transition-transform ${
                isActive
                  ? `${NAV_ACTIVE_BG[item.key]} border-ink shadow-hard-sm`
                  : 'border-transparent hover:border-ink hover:bg-bg'
              }`
            }
          >
            <span className="w-5 text-center text-base">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="flex-1" />

      <button
        onClick={onLogExpense}
        className="press flex w-full items-center justify-center gap-2 border-[3px] border-ink bg-ink py-3 font-display text-[13px] text-yellow shadow-[5px_5px_0_var(--color-pink)]"
        style={{ '--press-x': '5px', '--press-y': '5px' }}
      >
        + log expense
        <kbd className="rounded border-2 border-[#4a4560] bg-[#2c2839] px-1 text-[10px] font-bold text-yellow">
          N
        </kbd>
      </button>
      <p className="mt-3 text-center text-[10.5px] opacity-50">
        v1 · saved on this device · settings in the avatar
      </p>
    </aside>
  )
}
