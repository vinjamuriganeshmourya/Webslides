import { useEffect } from 'react'

/**
 * Which thing the PLAIN arrow keys do.
 *
 *   `slides`  →  whole slide, as a cut. Ctrl+→ steps the build. The original.
 *   `steps`   →  one build step. Ctrl+→ jumps a whole slide.
 *
 * The two are a straight swap, so there is exactly one key that changes and
 * nothing is unreachable in either mode.
 */
export type ArrowMode = 'slides' | 'steps'

interface Handlers {
  /** One build step forward, crossing into the next slide with the transition. */
  next: () => void
  /** One build step back, crossing into the previous slide with the transition. */
  prev: () => void
  /** Previous slide as a cut, landing fully revealed. */
  prevSlide: () => void
  /** Next slide as a cut, landing fully revealed. */
  nextSlide: () => void
  arrowMode: ArrowMode
  toggleArrowMode: () => void
  openPicker: () => void
  /** False while something else owns the keyboard, e.g. the slide picker. */
  enabled?: boolean
}

/**
 * Presentation navigation, and the two keys that are not arrows.
 *
 *   →  /  ←        depends on the mode below
 *   Ctrl+→ / ←     the other one
 *   PageDown / Up  same as the plain arrows, because that is what a clicker sends
 *   G              jump to a slide
 *   S              swap what the arrows do
 *
 * WHY THE ARROW BINDING IS NOW A TOGGLE
 *
 * The original binding was fixed: plain arrows changed slide, Ctrl+arrow stepped
 * the build. That is the right default, because the plain arrows are what gets
 * tapped every few seconds while presenting and one press should mean one slide,
 * with no half-built state.
 *
 * It is the wrong default for a deck whose slides are mostly BUILDS. Six of the
 * figures in the labs step eight or nine times, so on those slides the presenter
 * holds Ctrl for the whole slide and reaches for a plain arrow only once. Worse,
 * a hardware clicker cannot send Ctrl at all, so a build-heavy deck could not be
 * presented from a clicker: it would skip every build in the deck.
 *
 * So the pair swaps, on one key, and the control cluster shows which way round it
 * currently is. It is a swap and not a third mode because both jobs have to stay
 * reachable: an instructor mid-session must be able to skip a slide as well as
 * step one, whichever they chose.
 *
 * PageDown and PageUp follow the PLAIN arrows rather than being pinned to slides,
 * for the clicker reason above: a clicker should do what the presenter just chose,
 * not something a third binding decided for them.
 */
export function useKeyboardNav(h: Handlers) {
  useEffect(() => {
    if (h.enabled === false) return
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack typing in inputs.
      const t = e.target as HTMLElement
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.isContentEditable))
        return

      /* Never on a modified key beyond Ctrl: Alt+arrow is the browser's history
         and Meta+arrow belongs to the window manager. */
      if (e.altKey || e.metaKey) return

      const stepping = h.arrowMode === 'steps'
      const fwd = stepping ? h.next : h.nextSlide
      const back = stepping ? h.prev : h.prevSlide
      const ctrlFwd = stepping ? h.nextSlide : h.next
      const ctrlBack = stepping ? h.prevSlide : h.prev

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          if (e.ctrlKey) ctrlFwd()
          else fwd()
          break
        case 'ArrowLeft':
          e.preventDefault()
          if (e.ctrlKey) ctrlBack()
          else back()
          break
        case 'PageDown':
          e.preventDefault()
          fwd()
          break
        case 'PageUp':
          e.preventDefault()
          back()
          break
        case 'g':
        case 'G':
          if (e.ctrlKey) return
          e.preventDefault()
          h.openPicker()
          break
        case 's':
        case 'S':
          /* Ctrl+S is save. Taking it would train an instructor to lose a file. */
          if (e.ctrlKey) return
          e.preventDefault()
          h.toggleArrowMode()
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [h])
}

/**
 * THE MODE THE DECK OPENS IN, AND WHY THE HARNESSES OVERRIDE IT.
 *
 * Read in this order:
 *
 *   1. `?nav=slides` or `?nav=steps` in the URL. An explicit instruction wins.
 *   2. `?all`, the harness flag, forces `slides`. `preview.mjs` and
 *      `continuity-check.mjs` both press a PLAIN ArrowRight and expect the next
 *      SLIDE. A stored preference of `steps` would have them stepping builds
 *      instead, which under `?all` are already all revealed, so they would press
 *      79 times and never leave slide 1 while reporting cheerfully. A harness must
 *      never be able to read a human's preference.
 *   3. What this browser last chose, from `localStorage`.
 *   4. `slides`, the original binding.
 *
 * The read is wrapped, and so is the write. The deliverable is a single HTML file
 * an instructor opens by double-click, which is a `file://` origin, and
 * `localStorage` on `file://` throws outright in some browser configurations
 * rather than returning null. An exception here would take the whole deck down on
 * load, which is the one failure this repo cannot ship.
 */
const KEY = 'nxtwave.deck.arrowMode'

export function initialArrowMode(): ArrowMode {
  if (typeof window === 'undefined') return 'slides'
  const params = new URLSearchParams(window.location.search)
  const asked = params.get('nav')
  if (asked === 'slides' || asked === 'steps') return asked
  if (params.has('all')) return 'slides'
  try {
    const saved = window.localStorage.getItem(KEY)
    if (saved === 'slides' || saved === 'steps') return saved
  } catch {
    /* file:// with site data blocked. The default is the answer. */
  }
  return 'slides'
}

export function rememberArrowMode(mode: ArrowMode) {
  try {
    window.localStorage.setItem(KEY, mode)
  } catch {
    /* Not remembering is a lost convenience. Throwing is a blank slide. */
  }
}
