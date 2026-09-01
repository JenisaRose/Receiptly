const withTimeout = (promise, ms) =>
  Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error('export timed out')), ms)),
  ])

/**
 * Render a DOM node to a PNG blob at 2× for crisp sharing.
 * modern-screenshot ignores the *root* node's own background-color and fills
 * with `backgroundColor` instead, so callers pass the colour the node paints
 * itself (child backgrounds are captured fine).
 */
export async function nodeToPngBlob(node, backgroundColor = '#ece6ff') {
  const { domToBlob } = await import('modern-screenshot') // code-split: only on export
  if (document.fonts?.ready) await document.fonts.ready
  return withTimeout(
    domToBlob(node, {
      scale: 2,
      backgroundColor,
      // faces are already loaded in the page; skip re-fetching the
      // cross-origin Google Fonts stylesheet
      font: false,
    }),
    12000,
  )
}

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

/**
 * Export targets. New formats (CSV, PDF) slot in here without touching the
 * modal — it just renders whatever this list contains.
 */
export const EXPORTERS = [
  {
    id: 'png',
    label: 'Download PNG',
    async run({ node, monthKey, backgroundColor }) {
      saveBlob(await nodeToPngBlob(node, backgroundColor), `receiptly-${monthKey}.png`)
    },
  },
  // { id: 'csv', label: 'Download CSV', run: ... },
  // { id: 'pdf', label: 'Download PDF', run: ... },
]

/** True when the browser can share image files (mobile Safari / Chrome). */
export function canShareFiles() {
  try {
    return (
      typeof navigator !== 'undefined' &&
      !!navigator.canShare &&
      navigator.canShare({ files: [new File([''], 'x.png', { type: 'image/png' })] })
    )
  } catch {
    return false
  }
}

export async function shareReceipt({ node, monthKey, monthLabel, backgroundColor }) {
  const blob = await nodeToPngBlob(node, backgroundColor)
  const file = new File([blob], `receiptly-${monthKey}.png`, { type: 'image/png' })
  await navigator.share({
    files: [file],
    title: `My ${monthLabel} on Receiptly`,
    text: `${monthLabel}, wrapped.`,
  })
}
