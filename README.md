<div align="center">

# Receiptly

### Your money. Made clearer.

A local-first personal budget tracker built around one question — **_"is my spending okay right now?"_** Most apps tell you where the money went; Receiptly tells you what's safe to spend **today**, and recalculates the moment you log anything.

🌐 **[Live Demo](https://receiptly-rho.vercel.app/)** &nbsp;·&nbsp; 💻 **[GitHub](https://github.com/JenisaRose/Receiptly)**

`React 19` · `Vite 8` · `Tailwind CSS v4` · `Framer Motion` · `PWA` · `Vitest` · `GitHub Actions` · `Vercel`

[![CI](https://github.com/JenisaRose/Receiptly/actions/workflows/ci.yml/badge.svg)](https://github.com/JenisaRose/Receiptly/actions/workflows/ci.yml)

</div>

---

## ✦ The Product

> **"Is my spending okay right now?"**

Every budget app can add up receipts. The hard part is the answer to that question — and Receiptly leads with it. One number on every screen: the money that's genuinely free to spend right now, after rent, savings and everything already logged this month, spread across the days that are left.

```
   Income
     −  Bills                (recurring, locked in)
     −  Savings goals        (monthly set-aside)
     −  Spent so far         (this month's expenses)
   ──────────────────────
     ÷  Days remaining
   ──────────────────────
     →  SAFE TO SPEND TODAY
```

The calculation is pure and re-runs on every change. Log a coffee and the number drops — across all six screens, instantly. Tap it and Receiptly shows the full working, so it's never a black box.

---

## ✦ Features

### 💰 Budget

- **Safe-to-Spend Today** — the headline number, with a one-tap breakdown
- **Monthly budgeting** — per-category plan (envelopes)
- **Envelopes** — visual "jars" with live rebalancing and on-track / over status
- **Multiple savings goals** — targets + monthly set-aside, contribute or withdraw
- **What-if simulator** — a slider that projects where the month ends
- **Month switching** — past months recap, future months plan

### 🧾 Spending

- **Transactions** — log, edit, delete (with confirm)
- **Quick-add presets** — one-tap shortcuts for frequent buys
- **Split expenses** — your share counts toward the budget, not the whole bill
- **Search & filtering** — text, category, amount range, this-month / all-months
- **Editable categories** — add, rename, recolour, delete + reassign
- **Recurring bills** — due-day timeline, optional autopay

### 📊 Insights

- **Trends** — 6-month / 8-week chart with a running average
- **Month-end forecast** — projected total + per-envelope "heading over" flags
- **Spending insights** — ~11 rule-based, time-aware detectors (no LLM, no API)
- **Day-of-week analysis** — when the money actually leaves
- **Wrapped** — a seven-card monthly recap story
- **Spending heatmap** — every day shaded by amount
- **Shareable PNG receipt** — the Wrapped finale, exported

### 📱 App

- **PWA installation** — standalone app where supported
- **Offline support** — the store is on-device; the shell is cached
- **Responsive** — sidebar on desktop, bottom nav + FAB on mobile
- **Light / Dark / System** — a designed dark theme, not an inversion
- **Onboarding** — a one-minute first-run wizard (skippable)
- **Reduced motion** — animations collapse under `prefers-reduced-motion`
- **Keyboard & focus** — `1`–`6` / `n` shortcuts, visible focus rings, focus-trapped modals

---

## ✦ The Experience

| Screen | Purpose |
| --- | --- |
| **Today** | Safe-to-spend, daily pace, month-end forecast, what-if simulator |
| **Receipts** | Transactions by category, with search and filtering |
| **Trends** | Multi-month spending, patterns, day-of-week breakdown |
| **Envelopes** | Visual category budgets, rebalanced live |
| **Bills** | Recurring payments on a countdown, next 7 days flagged |
| **Reflect** | Monthly Wrapped, spend heatmap, shareable receipt |

---

## ✦ Built With

| Layer | Technology |
| --- | --- |
| Frontend | React 19 |
| Routing | React Router 7 |
| Build | Vite 8 |
| Styling | Tailwind CSS v4 (`@theme` tokens) |
| Animation | Framer Motion |
| PWA | vite-plugin-pwa / Workbox |
| Persistence | `localStorage` |
| PNG export | modern-screenshot |
| Testing | Vitest + Testing Library |
| Linting | oxlint |
| CI | GitHub Actions |
| Deployment | Vercel |

---

## ✦ Under the Hood

- **`transactions` is the single source of truth** — a transaction belongs to a month by its `date`; nothing is duplicated per month, so adding a month needs no migration.
- **Every financial value is derived** — pure selectors that each answer _for the selected month_. Analytics, forecasts and insights read the same state.
- **Pure logic is separated from React** — the provider holds state; calculations live in plain modules, which is why 165 tests cover the money math without rendering a component.
- **Persistence is one file** — `persistence.js` is the only thing that touches `localStorage`. Its interface is backend-shaped, so swapping in an API is a one-file change.

```
   Screens  ──read──▶  Budget Provider
                              │  composes
              ┌───────────────┼───────────────┐
              ▼               ▼               ▼
          selectors       analytics       forecast + insights
              └───────────────┼───────────────┘
                              ▼
                        persistence.js   ◀── future-backend seam
                              ▼
                         localStorage
```

---

## ✦ Engineering Quality

> **165 tests · 16 files · green CI · accessibility pass · verified offline**

- **165 deterministic unit + integration tests** — no network, no API key, clock frozen where "now" matters
- Covers **budget selectors and safe-to-spend** (over-budget, zero-income, past / future months, month lengths), **forecasts**, **analytics**, the **insight engine** (each detector, triggering and not), **search**, **goals**, **split expenses**, **persistence migration** and **onboarding**
- An **integration test over the real provider** for logging / deleting expenses, rebalancing and every goal action
- **GitHub Actions** runs `test → lint → build` on every push and PR
- **Accessibility pass** — landmarks, labelled controls, `aria-expanded` / `aria-pressed`, a shared focus-trap hook, one consistent focus ring, AA contrast in both themes
- **Reduced motion** respected app-wide; **PWA / offline** behaviour verified

---

## ✦ Local-First

- No account. No backend. Nothing to sign up for.
- Financial data lives in `localStorage` — it is **not sent to a server**.
- Every calculation runs on-device; the app works fully offline.
- Persistence is isolated so a future backend can slot in without a rewrite.

---

## ✦ Take It With You

Receiptly runs in any browser tab, and where the browser supports it, installs as an app:

- **Standalone desktop app** (Chrome, Edge)
- **Mobile home screen** — Android via the install prompt, iOS via _Share → Add to Home Screen_
- **Launches straight into the app**, and **works offline** after the first load

_Firefox doesn't install web apps — it just runs Receiptly in the tab._

---

## ✦ The Design

Deliberately **neubrutalist** — flat saturated colour, thick black borders, hard offset shadows (never soft), rotated sticker and washi-tape elements, a dotted-grid background, and buttons that physically press down on click. Depth comes from stacked colour blocks, not blur. Fully responsive, with an **intentionally designed dark mode** that re-points the same tokens rather than inverting.

**Type** — Archivo Black · Space Grotesk · Caveat · Fraunces

_The public landing page has its own editorial visual system and does not follow the app's theme._

---

## ✦ Screenshots

The [live demo](https://receiptly-rho.vercel.app/) seeds twelve months of demo data on first load, so every screen is populated. Stills go in [`docs/screenshots/`](docs/screenshots/) — the checklist there lists what to capture.

<!-- once docs/screenshots/*.png exist, replace this comment with:
| Today | Trends | Wrapped |
| :---: | :---: | :---: |
| ![Today](docs/screenshots/today.png) | ![Trends](docs/screenshots/trends.png) | ![Wrapped](docs/screenshots/wrapped.png) |

| Dark mode | Mobile |
| :---: | :---: |
| ![Dark mode](docs/screenshots/dark-mode.png) | ![Mobile](docs/screenshots/mobile.png) |
-->

---

## ✦ Run Locally

Requires **Node ≥ 22.12** (`.nvmrc` pins 22).

```bash
npm install
npm run dev
```

**Quality checks**

```bash
npm test            # unit + integration tests (Vitest)
npm run test:watch  # …in watch mode
npm run lint        # oxlint — warnings fail
npm run build       # production build
npm run preview     # serve the production build
```

In the app: `1`–`6` switch screens, `n` opens the log-expense modal.

---

## ✦ Project Structure

```
src/
├── screens/       the six screens
├── components/    layout, UI primitives, modals
├── store/         state + pure financial logic (selectors, analytics, forecast, insights, persistence)
├── features/      onboarding · wrapped · export · landing (each self-contained)
├── data/          the deterministic first-run demo
├── hooks/         useCountUp · useDialog
└── lib/           dates · formatting · slug

test/              deterministic fixtures + 16 spec files
```

---

## ✦ What's Next

Everything in **Features** is built and live. The one direction from here:

- **Backend API** behind the existing `persistence.js` seam
- **Authentication**
- **Multi-device synchronization**
- **Cloud backup**

---

## ✦ Built By

**Rohini Pal** · [@JenisaRose](https://github.com/JenisaRose)

**[Live Demo](https://receiptly-rho.vercel.app/)** &nbsp;·&nbsp; **[GitHub](https://github.com/JenisaRose/Receiptly)**
