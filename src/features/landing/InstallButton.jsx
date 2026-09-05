import { useState } from 'react'
import { useInstallPrompt } from './useInstallPrompt'

/** Secondary CTA on the landing page. Uses the real native install prompt
 *  where the browser supports it; everywhere else it explains — never
 *  blocks — that Receiptly already works fine without installing. */
export default function InstallButton({ className }) {
  const { canInstall, installed, promptInstall } = useInstallPrompt()
  const [note, setNote] = useState('')

  async function handleClick() {
    if (installed) {
      setNote("already installed — look for Receiptly on your home screen ✓")
      return
    }
    if (!canInstall) {
      setNote('no install needed — Receiptly already runs right here in your browser.')
      return
    }
    const outcome = await promptInstall()
    setNote(
      outcome === 'accepted'
        ? 'installing… look for Receiptly on your home screen shortly.'
        : 'no worries — Receiptly works great in the browser too.',
    )
  }

  return (
    <div>
      <button
        onClick={handleClick}
        className={className}
        aria-describedby={note ? 'install-note' : undefined}
      >
        {installed ? 'installed ✓' : 'install Receiptly ⤓'}
      </button>
      {note && (
        <p id="install-note" role="status" className="mt-2 text-[11.5px] font-semibold opacity-60">
          {note}
        </p>
      )}
    </div>
  )
}
