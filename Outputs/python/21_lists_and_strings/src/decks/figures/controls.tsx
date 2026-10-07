import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useDeck } from '@/deck/DeckContext'
import { Press } from './motion'
import { keyFree } from './keys'
import {
  ENTRANCE_MS,
  SETTLE_MAX_MS,
  SETTLE_POLL_MS,
  STEP_START_MS,
  autoplayDefault,
  autoplayDisabled,
  ensureStepMode,
  newReading,
  readingTime,
  rememberAutoplay,
  visibleText,
  type Seen,
} from './autoplay'

/**
 * Session-local override of slide-template/src/ui/panels/beats.tsx
 * (`PanelButton` and `StepControls`). Remove when the kit PR lands.
 *
 * WHY. Review, 2026-10-01: "when all steps are complete, the button beside
 * Replay still looks active". The kit's disabled Next is the same brand blue
 * at 40% opacity, which from the back of a room reads as a paler live button.
 * Here a disabled step button turns grey (surface, muted text, no shadow).
 * Replay's slot now holds the Autoplay switch (2026-10-07, see StepControls).
 *
 * Every button answers the press (`Press`), as the rest of the deck's
 * controls do.
 */
const HOUSE = 'cubic-bezier(0.22, 1, 0.36, 1)'

export function PanelButton({
  children,
  onClick,
  disabled = false,
  ghost = false,
  on,
  label,
}: {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  ghost?: boolean
  /** A switch: `true` draws it lit (brand tint and ring), `false` as the ghost. */
  on?: boolean
  label?: string
}) {
  const look = disabled
    ? { background: colors.surface2, color: colors.muted, boxShadow: `inset 0 0 0 1px ${colors.line}` }
    : on === true
      ? { background: colors.surface2, color: colors.brandDark, boxShadow: `inset 0 0 0 2px ${colors.brand}` }
      : ghost || on === false
      ? { background: 'rgba(255,255,255,0.85)', color: colors.muted, boxShadow: `inset 0 0 0 1px ${colors.muted}40` }
      : { background: colors.brand, color: colors.white, boxShadow: '0 6px 18px -8px rgba(0,37,75,0.35)' }
  return (
    <Press>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-pressed={on}
        aria-label={label}
        /* the deck's arrow keys must not also fire a focused button */
        onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
        className="inline-flex items-center gap-2 rounded-pill px-5 py-2.5 font-body text-body-sm font-semibold disabled:cursor-default"
        style={{ ...look, transition: `background-color 300ms ${HOUSE}, color 300ms ${HOUSE}, box-shadow 300ms ${HOUSE}` }}
      >
        {children}
      </button>
    </Press>
  )
}

/** The switch's glyph: a play triangle while off (press to play), two bars while on (press to pause). */
function AutoGlyph({ on }: { on: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" aria-hidden>
      {on ? (
        <g fill="currentColor">
          <rect x="5" y="4" width="5" height="16" rx="1.5" />
          <rect x="14" y="4" width="5" height="16" rx="1.5" />
        </g>
      ) : (
        <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z" fill="currentColor" />
      )}
    </svg>
  )
}

/**
 * Next and Autoplay, centred on one fixed line at the foot of the slide,
 * placed from the bottom of `ZonedFrame`'s body box (y 709) so their bottom
 * edge is always y 680. Next is the deck's own `next()`.
 *
 * AUTOPLAY TOOK REPLAY'S SLOT (user, 2026-10-07): the same pill, the same size
 * and place. It is a switch that says its state in words, `Autoplay On` lit
 * with a brand ring, `Autoplay Off` as the quiet ghost, and its glyph is what
 * a press will do. While it is on, the card plays its own steps with a
 * reading-time pause after each one (`autoplay.ts`); while it is off, the
 * card is step-wise. A manual press while it runs pauses it; pressing the
 * switch again resumes from the step on screen. It never leaves the slide.
 * Replay itself is still the player's own ⟳ button and the R key.
 */
export function StepControls({
  at,
  first = 1,
  total,
  nextLabel = 'Next',
}: {
  /** The beat on screen now. */
  at: number
  /** 1 for `useBeats`, 0 for `useCount`. */
  first?: 0 | 1
  total: number
  nextLabel?: string
}) {
  const deck = useDeck()
  /* the engine reads the deck through a ref: a new context object on a render must not restart its clock */
  const deckRef = useRef(deck)
  deckRef.current = deck
  const done = at >= total
  const slide = deck.index + 1
  const rootRef = useRef<HTMLDivElement>(null)
  /* End shows the whole card at once (the spec's build contract 3): as many
     presses as the card has left. A ref, so the listener is bound once and
     always reads the beat on screen now. */
  const left = useRef(total - at)
  left.current = total - at
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'End' || !keyFree(e)) return
      e.preventDefault()
      for (let i = 0; i < left.current; i++) deck.next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [deck])

  /* ---- autoplay ---- */
  const [on, setOn] = useState(() => autoplayDefault(slide))
  /** The step autoplay itself asked for; any other change of step was a person. */
  const expected = useRef<number | null>(null)
  const lastAt = useRef(at)
  /** What was visible when the last step settled: the next step's reading time counts only what is new. */
  const baseline = useRef<Set<string>>(new Set())
  /** The first wait on a card is the slide's entrance; after a resume it is a short one. */
  const fresh = useRef(true)

  const measure = useCallback(() => {
    const root = rootRef.current?.closest('[data-spec]') ?? rootRef.current?.parentElement
    const empty: Seen = { texts: new Set(), items: [], weighted: 0 }
    return root ? visibleText(root) : empty
  }, [])

  useEffect(() => {
    if (lastAt.current === at) return
    lastAt.current = at
    const mine = expected.current === at
    expected.current = null
    if (!mine && on) setOn(false) /* a person pressed: pause here, step-wise */
  }, [at, on])

  useEffect(() => {
    if (!on || done || autoplayDisabled()) return
    let cancelled = false
    const timers: number[] = []
    const wait = (ms: number) => new Promise<void>((res) => timers.push(window.setTimeout(res, ms)))
    const run = async () => {
      await wait(fresh.current && at === first ? ENTRANCE_MS : STEP_START_MS)
      fresh.current = false
      /* let the step finish its own movement: the visible text holds still for three polls */
      let last = measure()
      let still = 0
      const t0 = Date.now()
      while (!cancelled && still < 3 && Date.now() - t0 < SETTLE_MAX_MS) {
        await wait(SETTLE_POLL_MS)
        const now = measure()
        if (now.weighted === last.weighted) still++
        else {
          still = 0
          last = now
        }
      }
      if (cancelled) return
      const newText = newReading(last, baseline.current)
      baseline.current = last.texts
      await wait(readingTime(newText))
      if (cancelled) return
      expected.current = at + 1
      deckRef.current.next()
    }
    void run()
    return () => {
      cancelled = true
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [on, at, done, first, measure])

  const toggle = () => {
    const nextOn = !on
    rememberAutoplay(slide, nextOn)
    if (nextOn) {
      /* resume from the step on screen: what is already shown has been read */
      baseline.current = measure().texts
      fresh.current = false
    } else ensureStepMode()
    setOn(nextOn)
  }

  return (
    <div ref={rootRef} data-autoplay-ignore className="absolute inset-x-0 z-20 flex justify-center gap-2" style={{ bottom: 29 }}>
      <PanelButton onClick={deck.next} disabled={done}>
        {nextLabel}
      </PanelButton>
      <PanelButton on={on} onClick={toggle} label={on ? 'Autoplay is on: the steps play by themselves. Press to turn it off and go step by step' : 'Autoplay is off: one step per press. Press to play the steps by themselves'}>
        <AutoGlyph on={on} />
        Autoplay
        <span className="rounded-pill px-1.5 py-px text-[11px] font-bold uppercase tracking-wider" style={on ? { background: colors.brand, color: colors.white } : { background: colors.surface2, color: colors.muted }}>
          {on ? 'On' : 'Off'}
        </span>
      </PanelButton>
    </div>
  )
}

/**
 * Keys 1 to n mark the room's choice on a vote (G1's must line: "Keys 1 to
 * 4, or a click, may mark the room's choice. The right arrow works with or
 * without a mark."). Off once the answer is shown, and while the marker is
 * open, whose tools are the same digits.
 */
export function useVoteKeys(n: number, onPick: (i: number) => void, enabled: boolean) {
  const pick = useRef(onPick)
  pick.current = onPick
  useEffect(() => {
    if (!enabled) return
    const onKey = (e: KeyboardEvent) => {
      if (!keyFree(e)) return
      const k = Number(e.key)
      if (Number.isInteger(k) && k >= 1 && k <= n) {
        e.preventDefault()
        pick.current(k - 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [n, enabled])
}
