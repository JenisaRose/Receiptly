import { Route, Routes } from 'react-router-dom'
import Landing from './features/landing/Landing'
import AppShell from './components/layout/AppShell'
import { ThemeProvider } from './store/theme'

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app/*" element={<AppShell />} />
        <Route path="*" element={<Landing />} />
      </Routes>
    </ThemeProvider>
  )
}
