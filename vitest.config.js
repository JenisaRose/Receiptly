import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// Kept separate from vite.config.js so the test run doesn't pull in the PWA
// plugin. The store is pure JS/JSX with no DOM or network — a plain node
// environment plus a small localStorage shim (test/setup.js) is all it needs.
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    setupFiles: ['./test/setup.js'],
    include: ['test/**/*.test.{js,jsx}'],
    restoreMocks: true,
  },
})
