const SYSTEM_PROMPT = `You write a short, personal monthly spending summary for a budgeting app called Receiptly. You are given a compact JSON snapshot of the user's current month: income, amount spent so far, days left, today's safe-to-spend pace, top spending categories, a month-end forecast, savings goals progress, and a few pre-computed observations from a rules engine (insightHeadlines).

Write 2-4 sentences of warm, direct, second-person prose ("you"/"your"). Reference at least two concrete numbers from the data. Do not repeat the insightHeadlines verbatim — synthesize them into something that reads like a person wrote it, not a bulleted list. No generic financial advice, no disclaimers, no "as an AI" language, no markdown. Plain prose only. Currency is Indian Rupees — write amounts like ₹4,200.`

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let data = ''
    req.on('data', (chunk) => {
      data += chunk
    })
    req.on('end', () => {
      try {
        resolve(data ? JSON.parse(data) : {})
      } catch (err) {
        reject(err)
      }
    })
    req.on('error', reject)
  })
}

function sendJson(res, status, payload) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(payload))
}

/** Vercel serverless function (and, via a matching dev-server middleware in
 *  vite.config.js, the local `npm run dev` equivalent) that turns a compact
 *  month summary into a short AI-written recap. Never receives raw
 *  transactions — only aggregated numbers — and never exposes the API key to
 *  the client. */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    sendJson(res, 405, { error: 'Method not allowed.' })
    return
  }

  const apiKey = process.env.ANTHROPIC_API_KEY
  if (!apiKey) {
    sendJson(res, 500, { error: 'AI summaries are not configured on this deployment.' })
    return
  }

  let body
  try {
    body = await readJsonBody(req)
  } catch {
    sendJson(res, 400, { error: 'Invalid request body.' })
    return
  }

  const summary = body?.summary
  if (!summary || typeof summary !== 'object') {
    sendJson(res, 400, { error: 'Missing summary.' })
    return
  }

  try {
    const aiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-5',
        max_tokens: 220,
        temperature: 0.7,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: JSON.stringify(summary) }],
      }),
    })

    if (!aiRes.ok) {
      console.error('Anthropic API error', aiRes.status, await aiRes.text())
      sendJson(res, 502, { error: 'Could not reach the AI summary service.' })
      return
    }

    const data = await aiRes.json()
    const text = data?.content?.[0]?.text?.trim()
    if (!text) {
      sendJson(res, 502, { error: 'The AI summary came back empty.' })
      return
    }

    sendJson(res, 200, { text })
  } catch (err) {
    console.error('AI summary error', err)
    sendJson(res, 500, { error: 'Unexpected error generating the AI summary.' })
  }
}
