import { useDeck } from '@/deck/DeckContext'
import { PanelButton } from '@/ui'

/**
 * Session-local override of slide-template/src/ui/panels/beats.tsx. Remove
 * when the kit PR lands.
 *
 * Same markup and classes as the kit's `StepControls`, with two changes the
 * user asked for (2026-10-01): at the last beat the Next and Replay buttons
 * looked inactive, Next because it was disabled and Replay because it is
 * always drawn in the quiet ghost style.
 *
 *   - Next stays ENABLED at the last beat. It is the deck's own `next()`, so
 *     the press moves the deck on, the same as the arrow key, which is what
 *     the kit's own comment on `StepControls` already promised.
 *   - Replay takes the brand style once every beat has been shown, and stays
 *     ghost while the panel is still building, so the active look arrives
 *     at the moment Replay is the thing to press.
 *
 * `useBeats`, `useCount`, `useTween` and `PanelButton` are still the kit's.
 * Only this component is overridden, so a swap back is one import line per
 * figure.
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
  const complete = at >= total
  return (
    <div className="absolute inset-x-0 z-20 flex justify-center gap-2" style={{ bottom: 29 }}>
      <PanelButton onClick={deck.next}>{nextLabel}</PanelButton>
      <PanelButton
        ghost={!complete}
        onClick={() => {
          for (let i = at; i > first; i--) deck.prev()
        }}
      >
        Replay
      </PanelButton>
    </div>
  )
}
