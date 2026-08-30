import { createContext, useContext } from 'react'

export const BudgetContext = createContext(null)

export function useBudget() {
  const ctx = useContext(BudgetContext)
  if (!ctx) throw new Error('useBudget must be used inside <BudgetProvider>')
  return ctx
}
