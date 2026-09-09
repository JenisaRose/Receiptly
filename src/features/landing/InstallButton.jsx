import { useState } from 'react'
import { useInstallPrompt } from './useInstallPrompt'

/**
 * The landing-page install CTA. Three honest states:
 *  - installable  → the real browser install prompt
 *  - installed    → says so, and stops offering
 *  - unavailable  → a short, calm explanation (plus an "Add to Home
 *                   Screen" hint on iOS) — never an error, never a block
 */
export default function InstallButton({ className, label = 'Install Receiptly', noteClassName }) {
  const { canInstall, installed, promptInstall, manualHint } = useInstallPrompt()
  const [note, setNote] = useState('')

  async function handleClick() {
    if (installed) return
    if (!canInstall) {
      setNote(
        manualHint ??
          "Installation isn't available in this browser right now. You can still use Receiptly normally.",
      )
      return
    }
    const outcome = await promptInstall()
    if (outcome === 'accepted') {
      setNote('Installing — Receiptly will appear on your home screen shortly.')
    } else if (outcome === 'dismissed') {
      setNote('No problem — Receiptly keeps working right here in your browser.')
    }
  }

  const text = installed ? 'Receiptly is installed ✓' : label

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={installed}
        aria-describedby={note ? 'install-note' : undefined}
        className={`${className} ${installed ? 'cursor-default opacity-70' : ''}`}
      >
        {text}
      </button>
      {note && (
        <p
          id="install-note"
          role="status"
          className={noteClassName ?? 'mt-2 max-w-[22rem] text-[11.5px] font-semibold leading-snug opacity-60'}
        >
          {note}
        </p>
      )}
    </div>
  )
}
