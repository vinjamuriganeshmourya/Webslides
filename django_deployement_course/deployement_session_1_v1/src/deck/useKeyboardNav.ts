import { useEffect } from 'react'

interface Handlers {
  next: () => void
  prev: () => void
  /** Ctrl+←: jump straight to the previous slide with no transition. */
  prevSlide: () => void
  /** Ctrl+→: jump straight to the next slide with no transition. */
  nextSlide: () => void
}

/**
 * Arrow-key-only presentation navigation.
 *   →  next fragment / slide      ←  previous fragment / slide
 *   Ctrl+→ jump a whole slide     Ctrl+← jump a whole slide (both instant)
 * No other keys are bound — the deck is intentionally minimal.
 */
export function useKeyboardNav(h: Handlers) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack typing in inputs.
      const t = e.target as HTMLElement
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable))
        return

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          if (e.ctrlKey) h.nextSlide()
          else h.next()
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (e.ctrlKey) h.prevSlide()
          else h.prev()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [h])
}
