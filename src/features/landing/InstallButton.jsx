import { useState } from 'react'
import { useInstallPrompt } from './useInstallPrompt'

/**
 * The landing-page install CTA. Three honest states:
 *  - installable  → the real browser install prompt
 *  - installed    → says so; a tap explains how to pin / open it
 *  - unavailable  → a short, calm explanation (plus an "Add to Home
 *                   Screen" hint on iOS) — never an error, never a block
 */
export default function InstallButton({ className, label = 'Install Receiptly', noteClassName }) {
  const { canInstall, installed, promptInstall, platform, manualHint } = useInstallPrompt()
  const [note, setNote] = useState('')

  const accessHint =
    platform === 'ios'
      ? 'Open Receiptly from your home screen.'
      : platform === 'android'
        ? 'Open Receiptly from your home screen or app drawer.'
        : 'Open it from the Start menu — or keep it one click away: right-click Receiptly on the taskbar and choose “Pin to taskbar”.'

  const installedHint = (outcome) =>
    platform === 'desktop'
      ? outcome === 'accepted'
        ? 'Installed — it’s opening now. To keep it handy, right-click Receiptly on the taskbar → “Pin to taskbar”.'
        : accessHint
      : 'Installed — look for Receiptly on your home screen.'

  async function handleClick() {
    if (installed) {
      setNote(accessHint)
      return
    }
    if (!canInstall) {
      setNote(
        manualHint ??
          "Installation isn't available in this browser right now. You can still use Receiptly normally.",
      )
      return
    }
    const outcome = await promptInstall()
    if (outcome === 'accepted') {
      setNote(installedHint('accepted'))
    } else if (outcome === 'dismissed') {
      setNote('No problem — Receiptly keeps working right here in your browser.')
    }
  }

  return (
    <div>
      <button
        onClick={handleClick}
        aria-describedby={note ? 'install-note' : undefined}
        className={`${className} ${installed ? 'opacity-75' : ''}`}
      >
        {installed ? 'Receiptly is installed ✓' : label}
      </button>
      {note && (
        <p
          id="install-note"
          role="status"
          className={
            noteClassName ?? 'mt-2 max-w-[24rem] text-[11.5px] font-semibold leading-snug opacity-60'
          }
        >
          {note}
        </p>
      )}
    </div>
  )
}
