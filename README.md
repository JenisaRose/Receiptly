# Receiptly

**A personal budget tracker that answers one question: _"is my spending okay right now?"_ — instantly, without making you do the math.**

Most budget apps show you a pile of numbers and leave you to work out whether you're fine. Receiptly leads with the answer: a single "safe to spend today" figure, and every screen is built to communicate status at a glance.

> **Status:** React app running with all six screens. Persistence, polish and deploy in progress — see [Roadmap](#roadmap).

---

## What it does

Receiptly takes your income, your locked-in bills, and what you've set aside for goals, subtracts what you've already spent, and divides what's left by the days remaining in the month. That's your **safe-to-spend-today** number. Log an expense and every screen recalculates on the spot.

### Screens

| Screen | What it does |
| --- | --- |
| **Today** | Hero "safe to spend" figure. A tap reveals the full working — `income − bills − goals − spent ÷ days left` — so the number is never a black box. A **"what if I spend ₹X/day" slider** projects where you'll land at month-end. |
| **Receipts** | Spending broken down by category, week/month toggle, tap a category to expand its transactions. |
| **Trends** | 6-month / 8-week bar chart with a running average line, tap-a-bar detail, auto-detected spending patterns, and a day-of-week breakdown. |
| **Envelopes** | The "give every rupee a job" method as visual budget jars — on-track / getting-close / over states, with live rebalancing. |
| **Bills** | Recurring payments on a timeline with a day countdown; the next 7 days are flagged, and the total feeds the safe-to-spend calculation. |
| **Reflect** | Month-end recap — a stat collage plus a calendar heatmap of every day's spend. |

The standout features — the transparent calculation, the what-if simulator, and envelope budgeting — are what set it apart from a standard expense-logger.

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
- **Framer Motion** for entrances, count-ups and layout animation
- **React Router** for the six screens
- **localStorage** for persistence — a shared budget store ([`src/store/`](src/store)) that every screen reads from; logging an expense updates Today, Receipts and Envelopes together
- **Planned (v2):** MERN backend (Node / Express / MongoDB) with auth

The app seeds a realistic demo month on first run. `↺ reset demo data` (in the sidebar / below the nav on mobile) puts it back.

---

## Roadmap

- [x] Design system + standalone screen prototypes
- [x] Vite + React + Tailwind app shell — sidebar on desktop, bottom-nav on mobile
- [x] All six screens ported to components
- [x] Shared budget store with `localStorage` persistence
- [ ] Polish: empty states, reduced-motion pass, real "share receipt" export
- [ ] Deploy to Vercel
- [ ] MERN backend + auth + multi-device sync

---

## Running it

```bash
npm install
npm run dev
```

Then open the printed localhost URL. Keyboard: `1`–`6` switch screens, `n` opens the log-expense modal.

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
│   │   ├── LogExpenseModal.jsx
│   │   └── WhatIf.jsx
│   ├── screens/         Today, Receipts, Trends, Envelopes, Bills, Reflect
│   ├── store/           budget store (state + derived selectors + persistence)
│   ├── data/            seed month + historical mock data
│   ├── hooks/           useCountUp
│   ├── lib/             formatting + theme class maps
│   └── index.css        Tailwind theme tokens + base styles
├── prototypes/          pre-React HTML explorations
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
