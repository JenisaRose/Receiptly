# Receiptly

**A personal budget tracker that answers one question — _"is my spending okay right now?"_ — and gives you a single "safe to spend today" number instead of a wall of transactions.**

Most budget apps hand you a pile of figures and let you work out whether you're fine. Receiptly leads with the answer: it takes your income, subtracts your locked-in bills and what you've set aside for goals, subtracts what you've already spent, and divides what's left by the days remaining in the month. Log an expense and every screen recalculates on the spot.

**[Live demo → receiptly-rho.vercel.app](https://receiptly-rho.vercel.app)** &nbsp;·&nbsp; local-first, works offline, your data never leaves the device.

---

## Features

Everything below is implemented and on the live site.

| | |
| --- | --- |
| **Safe-to-spend-today** | The hero number on every visit. Tap it to see the full working — `income − bills − goals − spent ÷ days left` — so it's never a black box. |
| **Monthly budgeting** | A `‹ September 2026 ›` switcher; every screen answers for the selected month. Past months are a read-only recap, future months show the plan. |
| **Transactions** | Log, delete (with confirm), one-tap **quick-add presets**, and **split expenses** — your share is stored as the amount, the full bill is kept as metadata. |
| **Editable categories** | Add, rename, recolour; delete a custom category and reassign its transactions. |
| **Search & filtering** | Free-text (name or category), category multi-select, amount range, this-month vs all-months. |
| **Recurring bills** | Rent, subscriptions and the like on a due-day timeline; optional **autopay** marks a bill paid the day it's due. Bills feed the safe-to-spend calculation but stay their own ledger. |
| **Multiple savings goals** | Each with its own target and monthly set-aside; contribute or withdraw; open-ended goals (target 0) are allowed. |
| **Envelope budgeting** | Per-category allocations as budget "jars" — on-track / getting-close / over — with live rebalancing. |
| **Forecasts** | A month-end projection from your pace so far (over / under / on-track), plus a per-envelope projection of which jars are heading over. |
| **Spending insights** | A rule-based engine (~12 detectors) surfaces patterns — a big single day, subscription-like spend, a no-spend streak, weekend-heavy weeks, month-vs-average. **Deterministic and fully local — no LLM, no API.** |
| **Monthly recap ("Wrapped")** | A seven-card story — total, category leaderboard, priciest day, no-spend days, an insight, and a collectible **PNG receipt** you can share. |
| **Onboarding** | A one-minute first-run wizard (income → bills → goal → start fresh or explore the demo). Not required to use the app. |
| **PWA + offline** | Installable as a standalone app where the browser supports it; works with no connection thanks to the local-first store and a service-worker cached shell. |
| **Light / Dark / System themes** | A deliberately designed dark theme (not an inversion), picked in Settings. New users default to Light. |
| **Local-first storage** | Everything lives in `localStorage`. Nothing is sent anywhere; there is no account and no backend. |

---

## Tech stack

| Area | Choice |
| --- | --- |
| UI | **React 19**, **React Router 7** (`/` marketing page, `/app/*` the app) |
| Build | **Vite 8** |
| Styling | **Tailwind CSS v4** — CSS-first `@theme` tokens, no config file |
| Animation | **Framer Motion** — entrances, count-ups, the Wrapped story; respects `prefers-reduced-motion` |
| PWA | **vite-plugin-pwa** / Workbox — `generateSW`, `navigateFallback`, runtime font caching |
| Export | **modern-screenshot** — the shareable PNG receipt, code-split and loaded on demand |
| Persistence | **`localStorage`** behind a single seam (`src/store/persistence.js`) |
| Tests | **Vitest 5**, **@testing-library/react**, **jsdom** |
| Lint | **oxlint** |
| CI | **GitHub Actions** — tests, lint, build on every push and PR |

Requires **Node ≥ 22.12** (`.nvmrc` pins 22).

---

## Architecture

```
src/
├── App.jsx                routes: "/" → Landing, "/app/*" → the app
├── components/
│   ├── layout/            AppShell · Sidebar · BottomNav
│   ├── ui/                Card · Money · ProgressBar · SegmentedToggle
│   └── …                  MonthSwitcher · SettingsSheet · LogExpenseModal · ConfirmDialog · …
├── screens/               Today · Receipts · Trends · Envelopes · Bills · Reflect
├── store/
│   ├── budget.jsx         the React provider — state + actions
│   ├── budgetCore.js      pure logic behind the provider (payload cleaners, buildTx, derive, migrations)
│   ├── selectors.js       pure read-models — every selector answers for the selected month
│   ├── analytics.js       Trends / Reflect computation
│   ├── forecast.js        month-end + per-envelope projections
│   ├── insights/          the rule-based insight engine (context → detectors → ranked output)
│   ├── search.js          transaction filtering
│   ├── theme.jsx          Light / Dark / System provider
│   └── persistence.js     load / save / migrate — the one place a backend would slot in
├── features/
│   ├── onboarding/        first-run wizard (pure `buildState.js` turns answers into a store state)
│   ├── wrapped/           the monthly recap story + PNG receipt
│   ├── export/            the exporter registry
│   └── landing/           the marketing page — its own editorial visual system
├── data/seed.js           deterministic first-run demo (12 months of history + the month so far)
└── index.css              Tailwind theme tokens + base styles
```

**Local-first, one source of truth.** `transactions` is the only ledger — a transaction belongs to a month purely by its `date`, nothing is duplicated per month, and per-month config (`billPayments`, month budget overrides) falls back to a default so adding a month needs no migration. Every screen reads through the pure selectors in `src/store/`, so the whole app is a function of one state object. All the money math runs client-side.

---

## Running locally

```bash
npm install
npm run dev        # start the dev server, open the printed localhost URL
```

Keyboard in the app: `1`–`6` switch screens, `n` opens the log-expense modal. Narrow the window to see the mobile layout (sidebar → bottom nav + FAB).

```bash
npm test           # run the unit tests once (Vitest)
npm run test:watch # …in watch mode
npm run build      # production build to dist/
npm run preview    # serve the production build
npm run lint       # oxlint (warnings fail)
```

The pre-React HTML explorations still open straight in a browser — see [`prototypes/`](prototypes).

---

## Testing

**162 unit tests** (`npm test`) covering the logic that actually moves money:

- **selectors** — income, spend, safe-to-spend, daily pace, days-left, bill splits, category totals, envelopes, month context (past / current / future, month lengths)
- **forecast** — mid-month projection, over / under / on-track classification, the cross-the-plan day, the day-3 and past-month guards
- **analytics** — category ranking, no-spend days, longest streak, priciest day, weekly-cap-held, per-week and per-day-of-week series
- **insights** — each detector's triggering and non-triggering conditions; the "only count days that have happened" rule for the current month
- **goals** — one / many goals, combined set-aside, target-0 open-ended goals, the legacy single-goal migration, contribute / withdraw / delete, and that goals never touch unrelated budget math
- **split expenses** — total ÷ parts, uneven shares, and that budgets count the share (₹400) not the bill (₹1,200)
- **persistence** — schema-version and staleness migration
- **onboarding** — answers → store state, the leftover-into-envelopes split
- **provider integration** — logging / deleting an expense, rebalancing, month stepping, all via the real `<BudgetProvider>` (`@testing-library/react`)

Fixtures are deterministic (`test/fixtures.js`); the clock is frozen where a test needs "now". Everything runs offline in a plain Node environment — no API key, no network.

---

## CI

[`.github/workflows/ci.yml`](.github/workflows/ci.yml) runs on every push and pull request:

```
npm ci  →  npm test  →  npm run lint  →  npm run build
```

Any failing test, lint warning, or build error fails the check.

---

## Accessibility

A dedicated pass covering all six screens plus onboarding, Wrapped, the modals and navigation:

- **Landmarks & semantics** — one `<main>`, labelled `<nav>`s, real `<button>`/`<a>` elements (no clickable `<div>`s), `<h1>` per screen
- **Labelled controls** — every input and icon-only button has an accessible name; disclosure buttons expose `aria-expanded`; toggle buttons expose `aria-pressed`; the month display is an `aria-live` region
- **Modals** — `role="dialog"` + `aria-modal`, focus moves in on open, Tab / Shift+Tab stay inside, Escape closes, and focus returns to the trigger on close (shared `useDialog` hook)
- **Focus** — one consistent, always-visible `:focus-visible` ring, in both themes
- **Colour** — contrast checked in light and dark for body text, secondary text, labels, disabled controls and the focus ring; the dark theme lifts the muted-text opacity steps so nothing drops below AA
- **Motion** — `prefers-reduced-motion` is respected app-wide (Framer `MotionConfig` + a global CSS rule); the theme cross-fade and all entrance animations reduce

Not independently WCAG-audited.

---

## PWA / offline

Receiptly is a standard installable PWA. Where the browser supports it — Chrome, Edge, Android — an **Install Receiptly** button triggers the native prompt; on iOS Safari it's *Share → Add to Home Screen*; Firefox doesn't install web apps and the app just runs in the tab.

Offline works because the store is local-first: the service worker precaches the app shell and serves it for any in-scope route, and all data and calculations are on-device, so a fully offline session behaves identically to an online one. Installation is always optional.

---

## Deployment

Auto-deploys to **[Vercel](https://receiptly-rho.vercel.app)** on every push to `main`. `vercel.json` sets the SPA rewrite (with a negative lookahead so it can't swallow the manifest, service worker or icons) and the manifest / SW content-type headers.

---

## Design

Deliberately **neubrutalist**, not the default product-app look:

- flat, saturated colour — **no gradients, no blur, no glassmorphism**
- hard offset shadows only (`box-shadow: 6px 6px 0` — never soft)
- thick borders, rotated "sticker" elements, washi-tape accents, a dotted-grid background
- buttons that physically press down on click (the shadow collapses, the block shifts)
- depth from stacked rotated colour blocks, not drop shadows

**Type:** Archivo Black (headers / numbers) · Space Grotesk (body) · Caveat (handwritten annotations) · Fraunces (the landing page's editorial accents).

**Dark mode** re-points the same semantic tokens rather than inverting: a deep charcoal-purple ground, warm off-white ink, cards a step up in lightness, accents slightly desaturated, and hard shadows lifted off pure black so the edges stay crisp. The marketing landing page keeps its own atmospheric system and doesn't follow the toggle.

Tokens live in [`src/index.css`](src/index.css).

---

## Screenshots

The [live demo](https://receiptly-rho.vercel.app) is the quickest way to see it. To add stills to this README, drop them in a `docs/` folder and uncomment:

<!--
| Today — safe to spend | Envelopes | Reflect (Wrapped) |
| --- | --- | --- |
| ![Today](docs/today.png) | ![Envelopes](docs/envelopes.png) | ![Reflect](docs/reflect.png) |
-->

---

## Roadmap

Everything in **Features** is done. Not planned: receipt-photo scanning, and any hosted-LLM / paid-API feature — the insight and recap text is generated locally by design.

- [ ] Vitest coverage of the remaining screen components
- [ ] A backend (auth + multi-device sync) behind the existing `persistence.js` seam

---

Built by [@JenisaRose](https://github.com/JenisaRose).
