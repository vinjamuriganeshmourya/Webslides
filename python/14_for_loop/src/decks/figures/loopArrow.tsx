import { colors } from '@/design/tokens'

/**
 * THE LOOP-BACK ARROW, as one dashed run drawn in a left gutter.
 *
 * Course rule R5c item 7: *"a construct is drawn with its block, its arrow and
 * its indentation"*. The arrow is the half of a loop that no amount of prose
 * replaces: it says the body runs, and then control goes BACK UP. The reference
 * deck draws it on every frame that shows a `for` line over an indented body,
 * and the first rebuild of this session drew none of them.
 *
 * IT IS DOM, NOT SVG. Content rule 17: an `<svg>` is one rectangle to every
 * harness, so a label or a stroke inside it can land on top of its neighbour and
 * all three sweeps still report clean. Here the run is two dashed CSS borders
 * and two glyphs, so the browser's own layout keeps them apart and
 * `align-check.mjs` can see each piece.
 *
 * THE GUTTER IS A COLUMN OF CELLS, ONE PER ROW OF THE THING IT ANNOTATES, so the
 * arrow cannot drift off the line it points at however the font renders: the
 * grid row IS the alignment. `end` turns at the vertical middle of the first row
 * it marks and `start` at the middle of the last, which is what puts the
 * arrowhead on the `for` line and the dot on the last line of the body.
 */

/** Which end of the run this cell carries. `mid` is the plain vertical stretch. */
export type LoopGutterRole = 'start' | 'mid' | 'end' | 'none'

const PAINT = colors.accent

export function LoopGutter({ role, className = '' }: { role: LoopGutterRole; className?: string }) {
  if (role === 'none') return <span className={className} aria-hidden />

  /* `end` is the arrowhead row, so its vertical stroke hangs BELOW the turn;
     `start` is the dot row, so its stroke rises from above the turn. */
  const stem =
    role === 'end'
      ? 'absolute left-0 top-1/2 bottom-0'
      : role === 'start'
        ? 'absolute left-0 top-0 bottom-1/2'
        : 'absolute left-0 inset-y-0'

  return (
    <span className={`relative block ${className}`} aria-hidden>
      <span className={`${stem} border-l-2 border-dashed`} style={{ borderColor: PAINT }} />
      {role !== 'mid' && (
        <>
          <span
            className="absolute left-0 right-[11px] top-1/2 border-t-2 border-dashed"
            style={{ borderColor: PAINT }}
          />
          <span
            className="absolute right-0 top-1/2 -translate-y-1/2 font-body text-[16px] leading-none"
            style={{ color: PAINT }}
          >
            {role === 'end' ? '▶' : '●'}
          </span>
        </>
      )}
    </span>
  )
}

/**
 * The role of row `i` (1-based) in a run that turns into `to` and leaves from
 * `from`. One place decides it, so a figure never has to reason about direction
 * at the call site.
 */
export function loopRole(i: number, run?: { from: number; to: number }): LoopGutterRole {
  if (!run) return 'none'
  if (i === run.to) return 'end'
  if (i === run.from) return 'start'
  return i > run.to && i < run.from ? 'mid' : 'none'
}
