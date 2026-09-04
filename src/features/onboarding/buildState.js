import { DEFAULT_CATEGORIES, DEFAULT_PRESETS, SCHEMA_VERSION } from '../../data/seed'

/** How leftover discretionary money is split into starter envelopes. */
const ENVELOPE_SPLIT = {
  food: 0.32,
  transport: 0.2,
  home: 0.1,
  fun: 0.14,
  other: 0.12,
  buffer: 0.12,
}
const round50 = (n) => Math.max(0, Math.round(n / 50) * 50)
const num = (v) => {
  const n = Math.round(Number(v) || 0)
  return n > 0 ? n : 0
}

/**
 * Turn the answers collected in the setup flow into a full store state.
 * Pure — the provider just drops the result into `setState`.
 *
 * @param answers.income        monthly income (₹)
 * @param answers.incomeKind    'monthly' | 'irregular'
 * @param answers.bills         [{ name, emoji, amount, dueDay }]
 * @param answers.goal          { name, emoji, target } | null
 * @param answers.monthlySave   ₹ set aside each month
 */
export function buildOnboardedState(answers, today) {
  const income = num(answers.income)
  const monthlySave = num(answers.monthlySave)
  const bills = (answers.bills ?? []).filter((b) => b.name && num(b.amount) > 0)
  const billTotal = bills.reduce((s, b) => s + num(b.amount), 0)
  const curMonth = today.slice(0, 7)

  const leftover = Math.max(0, income - billTotal - monthlySave)
  const budgetDefault = {}
  for (const [id, w] of Object.entries(ENVELOPE_SPLIT)) budgetDefault[id] = round50(leftover * w)

  const stamp = Date.now()
  const billRows = bills.map((b, i) => ({
    id: `b${stamp}${i}`,
    name: b.name.trim(),
    emoji: b.emoji || '🧾',
    amount: num(b.amount),
    dueDay: Math.min(28, Math.max(1, Number(b.dueDay) || 1)),
    freq: 'monthly',
  }))

  const transactions =
    income > 0
      ? [
          {
            id: `t${stamp}`,
            date: `${curMonth}-01`,
            categoryId: 'income',
            name: answers.incomeKind === 'irregular' ? 'Income' : 'Monthly income',
            amount: income,
          },
        ]
      : []

  // one goal from setup, if they named one; more can be added later in settings
  const goals =
    answers.goal && num(answers.goal.target) > 0
      ? [
          {
            id: `goal${stamp}`,
            name: answers.goal.name?.trim() || 'My goal',
            emoji: answers.goal.emoji || '🎯',
            saved: 0,
            target: num(answers.goal.target),
            monthly: monthlySave,
          },
        ]
      : monthlySave > 0
        ? [{ id: `goal${stamp}`, name: 'Savings', emoji: '🐷', saved: 0, target: 0, monthly: monthlySave }]
        : []

  return {
    schemaVersion: SCHEMA_VERSION,
    demo: false,
    onboarded: true,
    clock: { todayISO: today },
    ui: { selectedMonth: curMonth },

    categories: DEFAULT_CATEGORIES.map((c) => ({ ...c })),
    transactions,
    presets: DEFAULT_PRESETS.map((p) => ({ ...p })),

    bills: billRows,
    billPayments: { [curMonth]: [] },

    budgets: { default: budgetDefault, byMonth: {}, bufferRollover: 0 },

    goals,
    profile: { monthlyIncome: income, incomeKind: answers.incomeKind || 'monthly' },

    monthSettings: {},
  }
}

/** For the "you're all set" summary. */
export function onboardingSummary(answers) {
  const income = num(answers.income)
  const monthlySave = num(answers.monthlySave)
  const billTotal = (answers.bills ?? [])
    .filter((b) => b.name && num(b.amount) > 0)
    .reduce((s, b) => s + num(b.amount), 0)
  return {
    income,
    billTotal,
    monthlySave,
    freeToSpend: Math.max(0, income - billTotal - monthlySave),
    goal: answers.goal && num(answers.goal.target) > 0 ? answers.goal : null,
  }
}
