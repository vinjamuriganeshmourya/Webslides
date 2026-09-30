import { FcEdgeDraw, FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { resolveChange, type ChangeFigureProps } from './changeFigure'
import {
  Cell,
  DeltaChip,
  Dimension,
  PhaseHead,
  ProblemPanel,
  SetCaption,
  toneOf,
} from './changeChrome'
import { colors } from '@/design/tokens'

/**
 * DELTA ROWS — one row per dimension, each carrying its own before, its own
 * arrow, its own after, and the number between them.
 *
 * THE ARGUMENT: THE CHANGE IS KEPT NEXT TO THE THING THAT CHANGED
 *
 * `StateArrow` reads the two states as wholes, which is right when the lesson is
 * what KIND of thing each state was. It is wrong the moment the lesson is the
 * inventory: five dimensions, each of which moved, and the room needs to see
 * each move rather than two summaries.
 *
 * Put those five dimensions in two panels and every before sits in one column
 * and its own after sits 500px away in the other, with four unrelated facts
 * between them. The reader is doing the pairing. This is the same failure
 * `comparison-lab` was built around, and the answer is the same: **make the row
 * the unit**, so a dimension's before, its arrow and its after are one object.
 *
 * WHAT THIS ARRANGEMENT CAN DO THAT NO OTHER FIGURE IN EITHER LAB CAN
 *
 * **It has a place to put the delta.** "40 minutes" and "6 minutes" imply a
 * third fact that neither cell states, and it is usually the most persuasive
 * thing on the slide. In a two-panel layout there is nowhere to put it: the
 * number belongs between the two values and the two values are in different
 * boxes. Here every row ends in a chip.
 *
 * The delta is deliberately NOT required for every row. Most dimensions have no
 * number, and demanding one is how a deck ends up with `x1.4` beside a claim
 * about who is allowed to deploy. `resolveChange` refuses an empty delta string
 * but allows a partial set, which is the one place these labs break their own
 * all-or-none rule and the doc comment there says why.
 *
 * WHY EACH ROW GETS ITS OWN ARROW
 *
 * Twelve pixels of chevron per row rather than one large arrow, because there is
 * no single moment of change to point at: each dimension moved on its own. The
 * arrows are drawn rather than static for the same reason the big one is, and
 * they land WITH their row rather than after it, because a row's three parts are
 * each other's support. Hard rule 6.
 *
 * WHAT IT IS WORST AT
 *
 * **It shows no overall shape.** Five rows of individually small changes read as
 * five small changes, even when the point is that the whole thing is now a
 * different kind of system. That sentence exists on the contract as the state
 * `note`, and this variant has nowhere to put it: `StateArrow` is the one that
 * makes the note the content.
 *
 * Second, **the cells are 351px**, narrower than either panel next door, so a
 * dimension whose value needs a clause wraps to three lines and the row stops
 * scanning.
 */
export function DeltaRows({
  before,
  after,
  during,
  rows = [],
  beforeWasBroken,
  caption,
  width = 1152,
  className = '',
}: ChangeFigureProps) {
  const g = resolveChange({ before, after, during, rows, beforeWasBroken })
  const n = g.rows.length

  /*
    BEAT 0 IS THE TWO COLUMN HEADS, so the slide opens having said what is
    changing into what. Then one beat per row, then the caption. Count derived
    from props, never from state, and the hook is claimed before the early
    return.
  */
  const CAPTION = n + 1
  const shown = useBeats(CAPTION + 1)

  const DIM = 220
  const ARROW = 40
  const DELTA = 110
  const GAP = 20
  const cell = Math.round((width - DIM - ARROW - DELTA - GAP * 4) / 2)

  const problems = [...g.problems]
  if (during) {
    problems.push(
      'a middle state needs a third cell per row, which leaves about 230px each; this variant draws two',
    )
  }
  if (width < 900) {
    problems.push(
      `a delta row needs about 900px; at ${width}px the two cells are ${cell}px each, which is four lines for a full cell`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  const beforePaint = toneOf(before.tone, 'muted')
  const afterPaint = toneOf(after.tone, 'brand')
  const cols = `${DIM}px ${cell}px ${ARROW}px ${cell}px ${DELTA}px`

  return (
    <figure className={`mx-auto ${className}`} style={{ width }}>
      {/* THE HEADS. `pt-4` is the instructor-video clearance: the reserved
          rectangle is x913..1280, y0..220, and a full-width figure's right-hand
          column is under it by definition. */}
      <FcNodeIn at={0} shown={shown[0]} className="relative">
        <div
          className="grid items-end pb-3 pt-4"
          style={{ gridTemplateColumns: cols, columnGap: GAP }}
        >
          <div aria-hidden />
          <div style={{ borderBottom: `3px solid ${colors.line}`, paddingBottom: 8 }}>
            <PhaseHead
              label={before.label}
              gloss={before.gloss}
              icon={before.icon}
              paint={beforePaint}
              dim
              size="sm"
            />
          </div>
          <div aria-hidden />
          <div style={{ borderBottom: `3px solid ${afterPaint}`, paddingBottom: 8 }}>
            <PhaseHead
              label={after.label}
              gloss={after.gloss}
              icon={after.icon}
              paint={afterPaint}
              size="sm"
            />
          </div>
          <div aria-hidden />
        </div>
      </FcNodeIn>

      {g.rows.map((r, i) => (
        <FcNodeIn
          key={r.id}
          at={i + 1}
          shown={shown[i + 1]}
          className="relative"
          /*
            `height: auto`, because these slots are STACKED rather than sitting
            in a stretching grid. `FcNodeIn` hard-codes `h-full` for
            `StateArrow`'s panels, and `comparison-lab` recorded what that costs
            in a stack: the first slot absorbs the leftover space and everything
            below it moves. It has to be an inline style, since `h-auto` in
            `className` has the same specificity as `h-full` and which wins
            depends on Tailwind's emit order.
          */
          style={{ height: 'auto' }}
        >
          <div
            className="grid items-center"
            style={{
              gridTemplateColumns: cols,
              columnGap: GAP,
              borderBottom: i === n - 1 ? 'none' : `1px solid ${colors.line}`,
            }}
          >
            <div className="py-3">
              <Dimension>{r.dimension}</Dimension>
            </div>
            <div className="py-3">
              <Cell state="before">{r.before}</Cell>
            </div>
            <div className="grid place-items-center">
              <FcEdgeDraw at={i + 1} shown={shown[i + 1]} width={ARROW - 8} paint={afterPaint} />
            </div>
            <div className="py-3">
              <Cell state="after">{r.after}</Cell>
            </div>
            <div className="py-3 text-right">
              {r.delta && <DeltaChip>{r.delta}</DeltaChip>}
            </div>
          </div>
        </FcNodeIn>
      ))}

      {caption && (
        <FcEdgeLabel at={CAPTION} shown={shown[CAPTION]} className="block">
          <SetCaption width={width}>{caption}</SetCaption>
        </FcEdgeLabel>
      )}
    </figure>
  )
}
