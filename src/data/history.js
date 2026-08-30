/**
 * Historical / aggregate data for Trends and Reflect. A fresh install has no
 * real history, so these screens run on illustrative data until enough months
 * of real entries exist to compute them.
 */

export const TRENDS = {
  months: {
    unit: 'month',
    title: 'spending per month',
    series: [
      { label: 'Mar', total: 9100, top: 'Rent ₹3,000' },
      { label: 'Apr', total: 8600, top: 'Food ₹3,200' },
      { label: 'May', total: 8300, top: 'Food ₹2,900' },
      { label: 'Jun', total: 7900, top: 'Travel ₹2,600' },
      { label: 'Jul', total: 8500, top: 'Food ₹3,100' },
      { label: 'Aug', total: 6800, top: 'Food ₹2,400' },
    ],
  },
  weeks: {
    unit: 'week',
    title: 'spending per week',
    series: [
      { label: 'W1', total: 2300, top: 'Food ₹900' },
      { label: 'W2', total: 1980, top: 'Travel ₹700' },
      { label: 'W3', total: 2450, top: 'Food ₹1,050' },
      { label: 'W4', total: 2100, top: 'Food ₹850' },
      { label: 'W5', total: 1750, top: 'Bills ₹800' },
      { label: 'W6', total: 2200, top: 'Food ₹950' },
      { label: 'W7', total: 1600, top: 'Food ₹600' },
      { label: 'W8', total: 2140, top: 'Food ₹880' },
    ],
  },
}

/** Mon–Sun average spend. */
export const DAY_OF_WEEK = [620, 480, 540, 700, 1180, 1460, 1240]

export const PATTERNS = [
  {
    emoji: '🔥',
    color: 'pink',
    text: 'Weekends run 2.4× your weekdays',
    note: 'Sat + Sun take ₹2,700 of a typical month',
  },
  {
    emoji: '🍜',
    color: 'orange',
    text: "Food's been your #1 for 4 months straight",
    note: 'but it dropped ₹700 vs July — heading the right way',
  },
  {
    emoji: '📉',
    color: 'mint',
    text: '3 of your last 4 months came in under ₹8,500',
    note: "your spending's trending down, nice work",
  },
]

export const REFLECT = {
  month: 'July',
  total: 9240,
  vsPrevLabel: "that's ₹640 more than June",
  cards: [
    { k: 'Biggest category', v: 'Food', sub: '₹3,400 — 37% of the month', tone: 'mint' },
    { k: 'No-spend days', v: '9', sub: 'your best run: 4 in a row', tone: 'sky' },
    { k: 'Priciest day', v: 'Sat 19', sub: '₹1,510 — mostly dining out', tone: 'lilac' },
    { k: 'Weekly cap held', v: '2 / 4 weeks', sub: 'weeks 1 & 3 stayed under', tone: 'pink' },
  ],
  note: 'the weekends keep winning. worth a look. 👀',
  // per-day spend for a 31-day month
  heat: [
    0, 0, 240, 0, 120, 880, 1240, 0, 60, 0, 180, 0, 540, 760, 0, 0, 320, 0, 150,
    1510, 690, 0, 90, 0, 0, 240, 610, 900, 0, 0, 180,
  ],
}
