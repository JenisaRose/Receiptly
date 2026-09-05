import { AnimatePresence, motion } from 'framer-motion'
import { useState } from 'react'
import { inr, splitNote } from '../lib/format'
import { BG } from '../lib/theme'
import { EMPTY_FILTERS, filtersActive, shortDate } from '../store/search'
import { useBudget } from '../store/budgetContext'
import DeleteTxButton from './DeleteTxButton'
import EmptyState from './EmptyState'

const pill = (on) =>
  `press border-[2.5px] border-ink px-2.5 py-1.5 text-[12px] font-bold ${
    on ? 'bg-yellow shadow-hard-xs' : 'bg-white'
  }`

/**
 * Search + filter over spend transactions. Wraps the Receipts screen: shows its
 * `children` (the category breakdown) until a query or filter is active, then
 * swaps in a flat results list.
 */
export default function TransactionSearch({ children }) {
  const b = useBudget()
  const cats = b.spendableCategories
  const [f, setF] = useState(EMPTY_FILTERS)
  const [showFilters, setShowFilters] = useState(false)

  const active = filtersActive(f)
  const patch = (p) => setF((prev) => ({ ...prev, ...p }))
  const toggleCat = (id) =>
    setF((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((x) => x !== id)
        : [...prev.categoryIds, id],
    }))
  const clearAll = () => {
    setF(EMPTY_FILTERS)
    setShowFilters(false)
  }

  const extraFilters = f.categoryIds.length > 0 || f.min !== '' || f.max !== ''
  const { rows, count, total } = active
    ? b.searchTransactions(f)
    : { rows: [], count: 0, total: 0 }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 border-[3px] border-ink bg-white px-3 py-2.5 shadow-hard-sm">
        <span className="text-[15px] opacity-50">🔍</span>
        <input
          value={f.query}
          onChange={(e) => patch({ query: e.target.value })}
          placeholder="search your expenses…"
          className="min-w-0 flex-1 bg-transparent text-[14px] font-semibold outline-none placeholder:opacity-40"
        />
        {active && (
          <button
            onClick={clearAll}
            className="shrink-0 border-2 border-ink bg-white px-1.5 py-0.5 text-[11px] font-bold active:bg-pink"
          >
            clear ✕
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <button onClick={() => patch({ allMonths: !f.allMonths })} className={pill(f.allMonths)}>
          🗓️ {f.allMonths ? 'all months' : `${b.month.label.toLowerCase()} only`}
        </button>
        <button onClick={() => setShowFilters((v) => !v)} className={pill(extraFilters)}>
          ⚙ filters{extraFilters ? ' · on' : ''}
        </button>
      </div>

      <AnimatePresence initial={false}>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 border-[3px] border-ink bg-white p-3">
              <div>
                <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide opacity-55">
                  category
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cats.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => toggleCat(c.id)}
                      className={`border-2 border-ink px-2 py-1 text-[11px] font-bold ${
                        f.categoryIds.includes(c.id) ? 'bg-yellow shadow-hard-xs' : 'bg-white'
                      }`}
                    >
                      {c.emoji} {c.label}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-[10.5px] font-bold uppercase tracking-wide opacity-55">
                  amount range
                </p>
                <div className="flex items-center gap-2 text-[13px] font-semibold">
                  <span className="opacity-50">₹</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={f.min}
                    onChange={(e) => patch({ min: e.target.value })}
                    placeholder="min"
                    className="w-20 border-2 border-ink bg-white px-2 py-1"
                  />
                  <span className="opacity-50">–</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    value={f.max}
                    onChange={(e) => patch({ max: e.target.value })}
                    placeholder="max"
                    className="w-20 border-2 border-ink bg-white px-2 py-1"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {active ? (
        <div className="space-y-3">
          <p className="font-hand text-[19px] font-bold">
            {count} {count === 1 ? 'match' : 'matches'}
            {count > 0 && <span className="opacity-60"> · ₹{inr(total)}</span>}
          </p>
          {count === 0 ? (
            <EmptyState
              emoji="🕳️"
              title="nothing matches that"
              hint="try another word, or loosen the filters"
            />
          ) : (
            <div className="space-y-2">
              {rows.map((t) => (
                <SearchRow key={t.id} t={t} thisYear={b.month.year} />
              ))}
            </div>
          )}
        </div>
      ) : (
        children
      )}
    </div>
  )
}

function SearchRow({ t, thisYear }) {
  return (
    <div className="flex items-center justify-between gap-2 border-[2.5px] border-ink bg-white px-3 py-2.5">
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className={`flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full border-2 border-ink text-sm ${BG[t.cat.color]}`}
        >
          {t.cat.emoji}
        </span>
        <div className="min-w-0">
          <p className="truncate text-[13px] font-semibold">{t.name}</p>
          <p className="truncate text-[10.5px] opacity-60">
            {t.cat.label} · {shortDate(t.date, thisYear)}
            {t.split ? ` · ${splitNote(t)}` : ''}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <span className="text-[13px] font-bold">₹{inr(Math.abs(t.amount))}</span>
        <DeleteTxButton tx={t} />
      </div>
    </div>
  )
}
