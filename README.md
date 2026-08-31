# Receiptly

**A personal budget tracker that answers one question: _"is my spending okay right now?"_ — instantly, without making you do the math.**

Most budget apps show you a pile of numbers and leave you to work out whether you're fine. Receiptly leads with the answer: a single "safe to spend today" figure, and every screen is built to communicate status at a glance.

> **Status:** Live at **[receiptly-rho.vercel.app](https://receiptly-rho.vercel.app)**. All six screens, multi-month, editable categories, PNG export. Next up: a real insights engine and a first-run onboarding flow — see [Roadmap](#roadmap).

---

## What it does

Receiptly takes your income, your locked-in bills, and what you've set aside for goals, subtracts what you've already spent, and divides what's left by the days remaining in the month. That's your **safe-to-spend-today** number. Log an expense and every screen recalculates on the spot.

Navigate between months with the `‹ August 2026 ›` switcher — every screen answers for the selected month. Past months show a read-only recap; future months show the plan.

### Screens

| Screen | What it does |
| --- | --- |
| **Today** | Hero "safe to spend" figure. A tap reveals the full working — `income − bills − goals − spent ÷ days left` — so the number is never a black box. A **"what if I spend ₹X/day" slider** projects where you'll land at month-end. |
| **Receipts** | Spending broken down by category, week/month toggle, tap a category to expand (and delete) its transactions. |
| **Trends** | 6-month / 8-week bar chart with a running average line, tap-a-bar detail, computed spending patterns, and a day-of-week breakdown. |
| **Envelopes** | The "give every rupee a job" method as visual budget jars — on-track / getting-close / over states, with live rebalancing. |
| **Bills** | Recurring payments on a timeline with a day countdown; the next 7 days are flagged, and the total feeds the safe-to-spend calculation. |
| **Reflect** | Month-end recap — biggest category, no-spend days, priciest day, a calendar spend heatmap — and a **shareable PNG receipt**. |

The standout features — the transparent calculation, the what-if simulator, and envelope budgeting — are what set it apart from a standard expense-logger. Categories are user-editable (add / rename / recolour, delete with reassignment) from the settings sheet behind the avatar.

---

## Design system: neubrutalism

Deliberately not the default "AI app" look. The whole UI runs on:

- Flat, saturated colours — **no gradients, no blur, no glassmorphism**
- Hard offset shadows only (`box-shadow: 6px 6px 0` — never soft/blurred)
- Thick black borders, rotated "sticker" elements, washi-tape accents, a dotted-grid background
- Buttons that physically press down on click (shadow collapses, block shifts)
- Depth built from stacked rotated colour blocks, not drop shadows

**Palette:** lavender `#ECE6FF` · near-black `#14121F` · yellow `#F4FF5A` · pink `#FF6FB0` · mint `#79F2C0` · lilac `#C9B8FF` · orange `#FFA84D` · sky `#6FD8FF`

**Type:** Archivo Black (headers / numbers) · Space Grotesk (body) · Caveat (handwritten annotations)

The tokens live in [`src/index.css`](src/index.css) as Tailwind theme variables.

---

## Tech

- **React 19** + **Vite**
- **Tailwind CSS v4** (CSS-first `@theme` config)
- **Framer Motion** for entrances, count-ups and layout animation (respects `prefers-reduced-motion`)
- **React Router** for the six screens
- **modern-screenshot** for the PNG receipt export (code-split, loaded on demand)
- **localStorage** for persistence — a normalised store ([`src/store/`](src/store)) where `transactions` is the single source of truth and per-month config falls back to defaults, so nothing is duplicated per month. `src/store/persistence.js` is the one seam the backend will replace
- **Planned (v2):** MERN backend (Node / Express / MongoDB) with auth

The app seeds a realistic demo (March–August 2026) on first run; March–July are generated deterministically so Trends and Reflect have real history. `↺ reset demo data` (settings sheet, behind the avatar) puts it back.

---

## Roadmap

- [x] Design system + standalone screen prototypes
- [x] Vite + React + Tailwind app shell, all six screens as components
- [x] Normalised store + `localStorage` persistence, deployed to Vercel
- [x] Multiple months · editable categories · delete transactions · reduced-motion
- [x] Trends & Reflect computed from real data · shareable PNG receipt
- [ ] Real insights engine (from actual spending, not templated)
- [ ] Spending forecast / month-end projection
- [ ] Reflect "Wrapped" story mode
- [ ] First-run onboarding wizard
- [ ] Then: quick-add presets · search · recurring · split · multiple goals · receipt scan · PWA · dark mode · tests + CI
- [ ] MERN backend + auth + multi-device sync

---

## Running it

```bash
npm install
npm run dev
```

Then open the printed localhost URL. Keyboard: `1`–`6` switch screens, `n` opens the log-expense modal. Narrow the window to see the mobile layout (sidebar → bottom nav + FAB).

```bash
npm run build     # production build to dist/
npm run preview   # serve the production build
npm run lint      # oxlint
```

The earlier standalone prototypes still open straight in a browser — see [`prototypes/`](prototypes).

---

## Project structure

```
Receiptly/
├── src/
│   ├── components/
│   │   ├── layout/      AppShell, Sidebar, BottomNav
│   │   ├── ui/          Card, Money, ProgressBar, SegmentedToggle
│   │   ├── MonthSwitcher · SettingsSheet · CategoryManager
│   │   ├── LogExpenseModal · ConfirmDialog · EmptyState · WhatIf
│   ├── screens/         Today, Receipts, Trends, Envelopes, Bills, Reflect
│   ├── store/
│   │   ├── budget.jsx        provider — composes selectors, holds actions
│   │   ├── selectors.js      pure read models (all answer for selectedMonth)
│   │   ├── analytics.js      Trends / Reflect / pattern computation
│   │   └── persistence.js    load / save / migrate — the backend seam
│   ├── features/export/  ReceiptCard, exporters registry, share modal
│   ├── data/seed.js      normalised first-run demo (Mar–Aug 2026)
│   ├── hooks/            useCountUp
│   ├── lib/              formatting · dates · slug · theme class maps
│   └── index.css         Tailwind theme tokens + base styles
├── prototypes/           pre-React HTML explorations
└── index.html
```

---

## Screenshots

_Run the app, screenshot the Today / Envelopes / Reflect screens, drop the images in a `docs/` folder and link them below._

<!--
![Today](docs/today.png)
![Envelopes](docs/envelopes.png)
![Reflect](docs/reflect.png)
-->

---

Built by [@JenisaRose](https://github.com/JenisaRose).
