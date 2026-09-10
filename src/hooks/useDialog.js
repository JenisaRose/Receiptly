import { useEffect, useRef } from 'react'

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])'

/**
 * Modal-dialog keyboard + screen-reader plumbing, shared by the log-expense
 * sheet, the settings sheet and the confirm dialog:
 *
 * - moves focus into the dialog on open (an `autoFocus` field wins; otherwise
 *   the container, so put the returned ref on an element with `tabIndex={-1}`)
 * - keeps Tab / Shift+Tab cycling inside the dialog
 * - closes on Escape
 * - restores focus to whatever was focused before, when the dialog unmounts
 *
 * `onClose` is read through a ref, so an inline arrow from the parent won't
 * re-run the effect and steal focus on every render.
 */
export function useDialog(onClose) {
  const ref = useRef(null)
  const closeRef = useRef(onClose)
  useEffect(() => {
    closeRef.current = onClose
  })

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const opener = document.activeElement

    if (!node.contains(document.activeElement)) {
      const first = node.querySelector(FOCUSABLE)
      ;(first ?? node).focus?.()
    }

    function onKey(e) {
      if (e.key === 'Escape') {
        e.preventDefault()
        closeRef.current?.()
        return
      }
      if (e.key !== 'Tab') return
      const items = [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }

    node.addEventListener('keydown', onKey)
    return () => {
      node.removeEventListener('keydown', onKey)
      opener?.focus?.()
    }
  }, [])

  return ref
}
