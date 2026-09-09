import { MotionConfig } from 'framer-motion'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { registerSW } from 'virtual:pwa-register'
import App from './App.jsx'
import { BudgetProvider } from './store/budget.jsx'
import './index.css'

// no-op outside of a production build (dev has the service worker disabled)
registerSW({ immediate: true })

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <BudgetProvider>
          <App />
        </BudgetProvider>
      </BrowserRouter>
    </MotionConfig>
  </StrictMode>,
)
