import { useEffect } from 'react'

interface Handlers {
  next: () => void
  prev: () => void
  /** ←: previous slide as a cut, landing fully revealed. */
  prevSlide: () => void
  /** →: next slide as a cut, landing fully revealed. */
  nextSlide: () => void
}

/**
 * Arrow-key-only presentation navigation.
 *
 *   →  /  ←        whole slide, as a CUT, landing fully revealed
 *   Ctrl+→ / ←     step through the slide's build, WITH the transition
 *
 * The plain arrows are what gets tapped every few seconds while presenting, so
 * they do the simple thing: one press, one slide, no animation and no half-built
 * state. Ctrl is the deliberate move — walk the reveals one at a time and let
 * the slide transition play.
 *
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
          if (e.ctrlKey) h.next()
          else h.nextSlide()
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (e.ctrlKey) h.prev()
          else h.prevSlide()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [h])
}
