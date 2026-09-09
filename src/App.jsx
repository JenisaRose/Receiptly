import { Route, Routes } from 'react-router-dom'
import Landing from './features/landing/Landing'
import AppShell from './components/layout/AppShell'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/app/*" element={<AppShell />} />
      <Route path="*" element={<Landing />} />
    </Routes>
  )
}
