/**
 * Deck progress indicator.
 *
 * Deliberately renders NOTHING. The deck used to carry a gradient bar across the
 * top and a dot per slide along the bottom; on a 36-slide deck the rail became a
 * band of specks that pulled the eye off the content and, in a recording, read
 * as part of the slide rather than as the player. The slide counter in
 * `DeckControls` is the only position indicator now.
 *
 * The component is kept rather than deleted so `Deck` keeps its shape and the
 * rail can come back with one edit if a shorter deck wants it.
 */
export function ProgressBar(_: { index: number; total: number; onDot: (i: number) => void }) {
  return null
}
