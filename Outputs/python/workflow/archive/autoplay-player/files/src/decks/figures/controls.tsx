import type { ReactNode } from 'react'
import { colors } from '@/design/tokens'
import { useDeck } from '@/deck/DeckContext'
import { Press } from './motion'

/**
 * Session-local override of slide-template/src/ui/panels/beats.tsx
 * (`PanelButton` and `StepControls`). Remove when the kit PR lands.
 *
 * WHY. Review, 2026-10-01: "when all steps are complete, the button beside
 * Replay still looks active". The kit's disabled Next is the same brand blue
 * at 40% opacity, which from the back of a room reads as a paler live button.
 * Here a disabled step button turns grey (surface, muted text, no shadow) and
 * Replay takes the filled style, so the one button that still does something
 * is the one that looks like it does. Replay walks the deck back to the
 * panel's first beat, which re-enables the step button.
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
}: {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  ghost?: boolean
}) {
  const look = disabled
    ? { background: colors.surface2, color: colors.muted, boxShadow: `inset 0 0 0 1px ${colors.line}` }
    : ghost
      ? { background: 'rgba(255,255,255,0.85)', color: colors.muted, boxShadow: `inset 0 0 0 1px ${colors.muted}40` }
      : { background: colors.brand, color: colors.white, boxShadow: '0 6px 18px -8px rgba(0,37,75,0.35)' }
  return (
    <Press>
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        /* the deck's arrow keys must not also fire a focused button */
        onKeyDown={(e) => e.key !== 'Enter' && e.key !== ' ' && e.currentTarget.blur()}
        className="rounded-pill px-5 py-2.5 font-body text-body-sm font-semibold disabled:cursor-default"
        style={{ ...look, transition: `background-color 300ms ${HOUSE}, color 300ms ${HOUSE}, box-shadow 300ms ${HOUSE}` }}
      >
        {children}
      </button>
    </Press>
  )
}

/**
 * Next and Replay, centred on one fixed line at the foot of the slide, placed
 * from the bottom of `ZonedFrame`'s body box (y 709) so their bottom edge is
 * always y 680. Next is the deck's own `next()`; Replay walks the deck back to
 * this panel's first beat. On the last beat Next goes grey and Replay is the
 * filled button.
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
  const done = at >= total
  return (
    <div className="absolute inset-x-0 z-20 flex justify-center gap-2" style={{ bottom: 29 }}>
      <PanelButton onClick={deck.next} disabled={done}>
        {nextLabel}
      </PanelButton>
      <PanelButton
        ghost={!done}
        onClick={() => {
          /* In Auto Play a replay is the deck's: the slide restages and plays itself
             again. By hand it walks back to the first beat, as it always did. */
          if (deck.mode === 'auto') deck.replay()
          else for (let i = at; i > first; i--) deck.prev()
        }}
      >
        Replay
      </PanelButton>
    </div>
  )
}
