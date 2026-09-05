import { NavLink } from 'react-router-dom'
import { NAV } from './navItems'

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t-[3px] border-ink bg-white px-1 pb-[calc(6px+env(safe-area-inset-bottom))] pt-1.5 lg:hidden">
      {NAV.map((item) => (
        <NavLink
          key={item.key}
          to={item.to}
          end={item.to === '/app'}
          className={({ isActive }) =>
            `flex flex-1 flex-col items-center gap-0.5 px-1 py-1.5 text-[9px] font-bold ${
              isActive ? 'border-[2.5px] border-ink bg-lilac' : 'border-[2.5px] border-transparent'
            }`
          }
        >
          <span className="text-lg leading-none">{item.icon}</span>
          <span className="max-[380px]:hidden">{item.short}</span>
        </NavLink>
      ))}
    </nav>
  )
}
