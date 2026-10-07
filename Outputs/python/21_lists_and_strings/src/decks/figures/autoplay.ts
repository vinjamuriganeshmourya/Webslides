/**
 * AUTOPLAY FOR THIS DECK'S BUILT CARDS (user, 2026-10-07).
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
export const AUTOPLAY_ON_BY_DEFAULT = new Set([3, 4, 14, 18, 20, 21, 22, 23, 24, 26, 29])

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
export const ENTRANCE_MS = 600
export const STEP_START_MS = 300
/** Polled until the visible text holds still for three polls, or this long. */
export const SETTLE_POLL_MS = 150
export const SETTLE_MAX_MS = 7000
/** Reading time: a base, plus per weighted character, clamped. */
export const READ_BASE_MS = 500
export const READ_PER_CHAR_MS = 13
export const READ_MIN_MS = 1220
export const READ_MAX_MS = 3200

export function readingTime(weightedChars: number) {
  return Math.min(READ_MAX_MS, Math.max(READ_MIN_MS, READ_BASE_MS + weightedChars * READ_PER_CHAR_MS))
}

/**
 * The text a reader can see inside `root` right now, one entry per text node.
 * A node counts when every element above it, up to `root`, is at least half
 * opaque and it takes up space; anything under `[data-autoplay-ignore]` (the
 * controls) is left out. Code (`.font-mono`, `pre`, `code`) weighs 1.3.
 */
export interface Seen {
  /** each visible string, so the next step can tell what is new */
  texts: Set<string>
  items: { text: string; w: number }[]
  weighted: number
}

export function visibleText(root: Element): Seen {
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
  const items: { text: string; w: number }[] = []
  let weighted = 0
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  for (let n = walker.nextNode(); n; n = walker.nextNode()) {
    const text = (n.textContent ?? '').replace(/\s+/g, ' ').trim()
    if (!text) continue
    const el = n.parentElement
    if (!el || el.closest('[data-autoplay-ignore]')) continue
    if (opacityOf(el) < 0.5) continue
    const r = el.getBoundingClientRect()
    if (r.width === 0 || r.height === 0) continue
    const w = text.replace(/ /g, '').length * (el.closest('.font-mono, pre, code') ? 1.3 : 1)
    items.push({ text, w })
    weighted += w
  }
  return { texts: new Set(items.map((i) => i.text)), items, weighted }
}

/** How much of what is visible now was not visible before: the step's own new reading. */
export function newReading(now: Seen, before: Set<string>): number {
  return now.items.reduce((sum, i) => sum + (before.has(i.text) ? 0 : i.w), 0)
}

/** Off means step-wise: if the player's plain arrows were set to whole slides, set them back to steps. */
export function ensureStepMode() {
  const btn = document.querySelector<HTMLButtonElement>('button[aria-label^="Plain arrow keys currently move by whole slides"]')
  btn?.click()
}
