/**
 * TOUCHPAD AND TOUCH NAVIGATION, deck-wide. Session-local: the player under
 * `src/deck/` is kit-owned and a kit change is a PR (generate-slides section 6),
 * so this file is the session's copy until that PR lands. Remove it then.
 *
 * WHY. The deck moved only from the keyboard (user, 2026-10-05, for every deck
 * from now on). An instructor on a laptop swipes the trackpad; a reviewer on a
 * phone swipes the screen.
 *
 * HOW. A recognised gesture dispatches the SAME plain `ArrowRight` /
 * `ArrowLeft` the keyboard sends, into `window`, where `useKeyboardNav`
 * listens. So a swipe does exactly what the arrow key does in whichever mode
 * the pill shows (whole slides by default, build steps after `S`), the picker's
 * guard still applies, and the keyboard code is not touched.
 *
 * TOUCHPAD: `wheel` with a horizontal delta that dominates the vertical one.
 * The deltas of one gesture accumulate; at `WHEEL_TRIGGER` the slide changes
 * ONCE and the gesture is locked until no horizontal wheel has arrived for
 * `WHEEL_IDLE` ms AND `WHEEL_COOLDOWN` ms have passed, which swallows a
 * trackpad's inertia tail. The event is cancelled, so the browser cannot read
 * a horizontal swipe as history navigation. Vertical wheel is never touched,
 * and a wheel over an element that can itself scroll sideways is left to it.
 *
 * TOUCH: one finger, start to end: `SWIPE_MIN` px sideways, more than
 * `SWIPE_RATIO` times the vertical travel, inside `SWIPE_TIME` ms. Left is
 * next, right is previous. One gesture, one slide, by construction. Taps,
 * vertical scrolls, two fingers, and anything that starts on a control (a
 * button, a slider, a field, a link), on the marker's ink layer or on the
 * deck's own control bar are ignored, so the slide's interactive panels keep
 * their touches.
 */
const WHEEL_TRIGGER = 60
const WHEEL_IDLE = 300
const WHEEL_COOLDOWN = 650
const SWIPE_MIN = 60
const SWIPE_RATIO = 1.5
const SWIPE_TIME = 800

/** Elements a gesture must never start on or be read over. */
const CONTROL = 'button, input, select, textarea, a, [role="button"], [role="slider"], [contenteditable="true"], svg[class*="z-20"]'

let installed = false

function send(key: 'ArrowRight' | 'ArrowLeft') {
  window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }))
}

/** True when `el` or an ancestor inside the stage can scroll horizontally on its own. */
function scrollsSideways(el: Element | null): boolean {
  for (let n = el; n && n !== document.body; n = n.parentElement) {
    const h = n as HTMLElement
    if (h.scrollWidth > h.clientWidth + 1) {
      const o = getComputedStyle(h).overflowX
      if (o === 'auto' || o === 'scroll') return true
    }
  }
  return false
}

export function installGestures() {
  if (installed || typeof window === 'undefined') return
  /* Once the kit carries `src/deck/useGestureNav.ts` (PR `kit/deck-gestures`)
     and this session has been synced, the kit's hook sets this flag on mount
     and this copy stands down, so a swipe never moves two slides. Delete this
     file after that sync. */
  if ((window as unknown as Record<string, unknown>).__deckGestureNav) return
  installed = true

  /* THE BROWSER'S OWN HORIZONTAL GESTURE IS SWITCHED OFF. Chromium reads a
     horizontal overscroll on a page that cannot scroll as "go back" or "go
     forward" in history (and Android Chrome and iOS Safari read an edge swipe
     the same way). A swipe right on slide 3 then left the deck for the page
     before it, which is exactly the gesture this module gives a meaning to.
     `overscroll-behavior-x: none` turns that navigation off; `touch-action:
     pan-y pinch-zoom` on the body says the page handles horizontal panning
     itself, so the browser never starts its own gesture. Vertical scrolling
     inside a slide and pinch zoom are left alone. */
  if (!document.querySelector('style[data-deck-gestures]')) {
    const el = document.createElement('style')
    el.dataset.deckGestures = ''
    el.textContent = 'html, body { overscroll-behavior-x: none; } body { touch-action: pan-y pinch-zoom; }'
    document.head.appendChild(el)
  }

  /* ------------------------------------------------------------- touchpad */
  let acc = 0
  let locked = false
  let firedAt = 0
  let idle: number | undefined
  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) return // pinch zoom
    const dx = e.deltaX
    const dy = e.deltaY
    if (Math.abs(dx) <= Math.abs(dy)) return // a vertical scroll: not ours
    if (scrollsSideways(e.target as Element)) return
    e.preventDefault()
    window.clearTimeout(idle)
    idle = window.setTimeout(() => {
      acc = 0
      if (Date.now() - firedAt >= WHEEL_COOLDOWN) locked = false
    }, WHEEL_IDLE)
    if (locked) {
      if (Date.now() - firedAt >= WHEEL_COOLDOWN) locked = false
      else return
    }
    acc += dx
    if (Math.abs(acc) >= WHEEL_TRIGGER) {
      send(acc > 0 ? 'ArrowRight' : 'ArrowLeft')
      acc = 0
      locked = true
      firedAt = Date.now()
    }
  }
  window.addEventListener('wheel', onWheel, { passive: false })

  /* ---------------------------------------------------------------- touch */
  let start: { x: number; y: number; t: number } | null = null
  const onStart = (e: TouchEvent) => {
    start = null
    if (e.touches.length !== 1) return
    const t = e.target as Element | null
    if (t && (t.closest(CONTROL) || scrollsSideways(t))) return
    const p = e.touches[0]
    start = { x: p.clientX, y: p.clientY, t: Date.now() }
  }
  const onEnd = (e: TouchEvent) => {
    const s = start
    start = null
    if (!s || e.touches.length > 0) return
    const p = e.changedTouches[0]
    if (!p) return
    const dx = p.clientX - s.x
    const dy = p.clientY - s.y
    if (Date.now() - s.t > SWIPE_TIME) return
    if (Math.abs(dx) < SWIPE_MIN || Math.abs(dx) <= Math.abs(dy) * SWIPE_RATIO) return
    send(dx < 0 ? 'ArrowRight' : 'ArrowLeft')
  }
  const onCancel = () => {
    start = null
  }
  window.addEventListener('touchstart', onStart, { passive: true })
  window.addEventListener('touchend', onEnd, { passive: true })
  window.addEventListener('touchcancel', onCancel, { passive: true })
}
