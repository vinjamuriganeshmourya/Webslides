/**
 * AUTOPLAY FOR THIS DECK'S BUILT CARDS (user, 2026-10-07, for session 21;
 * carried to 22 so the control bar matches, and OFF ON EVERY SLIDE: the
 * session 22 spec's rule 1 is "No autoplay. Nothing moves on a timer").
 *
 * Extends the archived Auto Play (`Outputs/python/workflow/archive/autoplay-player/`)
 * from a player-wide mode to a per-slide switch that lives in each card's own
 * `StepControls`, in the slot Replay had:
 *
 *   - ON BY DEFAULT on slides 3, 4, 14, 18, 20, 21, 22, 23, 24, 26 and 29 only;
 *     every other slide opens off, in step-wise mode, and the student can turn
 *     it on with the button.
 *   - A switch the student presses is remembered for that slide while the
 *     deck stays open (never in storage: a `file://` origin is shared by every
 *     deck on the machine).
 *   - Off means step-wise: one step per Next or arrow press. A manual press
 *     while it runs pauses it on that slide; turning it back on resumes from
 *     the step on screen.
 *   - DYNAMIC TIMING: after each step the engine waits for the slide to settle
 *     (its visible text stops changing, so a step that animates inside itself
 *     finishes first), then holds the step on screen for a reading time made
 *     from how much new text the step showed: code counts 1.3 times, because
 *     it is read character by character.
 *   - It never crosses to the next slide.
 *   - `?all` (every harness) and `?noauto` turn it off entirely, so nothing
 *     that counts presses or measures a frame sees a step it did not ask for.
 */

/** Slides (1-based, deck order) whose autoplay is on when they open. */
export const AUTOPLAY_ON_BY_DEFAULT = new Set<number>([])

/** The student's own switches, per slide, for as long as the deck is open. */
const chosen = new Map<number, boolean>()

export function autoplayDisabled(): boolean {
  if (typeof window === 'undefined') return true
  const q = new URLSearchParams(window.location.search)
  return q.has('all') || q.has('noauto')
}

export function autoplayDefault(slide: number): boolean {
  if (autoplayDisabled()) return false
  return chosen.get(slide) ?? AUTOPLAY_ON_BY_DEFAULT.has(slide)
}

export function rememberAutoplay(slide: number, on: boolean) {
  chosen.set(slide, on)
}

/* ------------------------------------------------------------------ timing */

/** The first step waits for the slide's entrance; later steps for the step's own motion to start. */
export const ENTRANCE_MS = 1500
export const STEP_START_MS = 700
/** Polled until the visible text holds still for three polls, or this long. */
export const SETTLE_POLL_MS = 250
export const SETTLE_MAX_MS = 7000
/** Reading time: a base, plus per weighted character, clamped. */
export const READ_BASE_MS = 1400
export const READ_PER_CHAR_MS = 40
export const READ_MIN_MS = 2200
export const READ_MAX_MS = 9000

export function readingTime(weightedChars: number) {
  return Math.min(READ_MAX_MS, Math.max(READ_MIN_MS, READ_BASE_MS + weightedChars * READ_PER_CHAR_MS))
}

/**
 * How much text a reader can see inside `root` right now. A text node counts
 * when every element above it, up to `root`, is at least half opaque and it
 * takes up space; anything under `[data-autoplay-ignore]` (the controls) is
 * left out. Code (`.font-mono`, `pre`, `code`) weighs 1.3.
 */
export function visibleText(root: Element): { chars: number; weighted: number } {
  const seen = new Map<Element, number>()
  const opacityOf = (el: Element | null): number => {
    if (!el || el === root.parentElement) return 1
    const hit = seen.get(el)
    if (hit !== undefined) return hit
    const own = Number(getComputedStyle(el).opacity) || 0
    const v = own * (el === root ? 1 : opacityOf(el.parentElement))
    seen.set(el, v)
    return v
  }
  let chars = 0
  let weighted = 0
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = (n.textContent ?? '').replace(/\s+/g, '')
    if (!text) continue
    const el = n.parentElement
    if (!el || el.closest('[data-autoplay-ignore]')) continue
    if (opacityOf(el) < 0.5) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    chars += text.length
    weighted += text.length * (el.closest('.font-mono, pre, code') ? 1.3 : 1)
  }
  return { chars, weighted }
}

/** Off means step-wise: if the player's plain arrows were set to whole slides, set them back to steps. */
export function ensureStepMode() {
  const btn = document.querySelector<HTMLButtonElement>('button[aria-label^="Plain arrow keys currently move by whole slides"]')
  btn?.click()
}
