import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, loadEnv } from 'vite'
import aiInsightsHandler from './api/insights.js'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  if (env.ANTHROPIC_API_KEY) process.env.ANTHROPIC_API_KEY = env.ANTHROPIC_API_KEY

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        // mirrors the /api/insights Vercel serverless function so `npm run
        // dev` can exercise it too, without needing `vercel dev`
        name: 'ai-insights-dev-middleware',
        configureServer(server) {
          server.middlewares.use('/api/insights', aiInsightsHandler)
        },
      },
    ],
  }
})
