import { FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { resolveComparison, type ComparisonFigureProps } from './comparisonFigure'
import {
  Attribute,
  Cell,
  ProblemPanel,
  SetCaption,
  SideHead,
  panelSurface,
  toneOf,
} from './comparisonChrome'
import { colors } from '@/design/tokens'

/**
 * HEAD TO HEAD — two whole panels either side of a seam, each read top to
 * bottom as one thing.
 *
 * THE ARGUMENT, AND WHY IT IS NOT "THE SAME BUT PRETTIER"
 *
 * `AttributeSpine` is the better comparison and this variant has to justify
 * itself against it rather than against a blank slide.
 *
 * It does, on one case: **the comparison where the two subjects are not
 * parallel.** A spine writes every row as one question asked of both, which is
 * exactly right when the two things are alternatives for the same job, and
 * forced when they are not. Sometimes the honest answer is "here is what this
 * one is, and here is what that one is", and the reader is meant to take each in
 * as a whole before setting them against each other. A spine cannot say that:
 * its structure insists that every claim be a matched pair.
 *
 * So this variant keeps the attribute on each side rather than in a gutter. The
 * row still exists in the data and the resolver still refuses a dangling claim,
 * because the contract is shared, but the reading order is down and then across
 * instead of across and then down.
 *
 * THE ATTRIBUTE REPEATS ON BOTH SIDES, WHICH LOOKS LIKE DUPLICATION AND IS NOT
 *
 * The first pass put the attribute on the left panel only and let the right
 * panel's cells line up against it. That is a spine with extra steps, and worse
 * than the spine, because the label sat inside one of the two things being
 * compared and quietly belonged to it. Repeating the label on both sides is what
 * lets each panel be read alone, which is the entire point of the variant.
 *
 * WHY THE SEAM IS A HAIRLINE AND NEVER AN ARROW
 *
 * A heavy divider makes two documents out of one comparison, and a tone-tinted
 * 2px rule was tried and did exactly that. An arrow is worse than heavy: it
 * claims one side turns into the other, which is a before/after figure and a
 * different lab with a different contract. See the note on `Seam` in
 * `comparisonChrome.tsx`.
 *
 * THE PANELS ARE EQUAL WIDTH, ALWAYS
 *
 * Deckary recommends a 60/40 split to emphasise the recommended option. This
 * kit does not have a recommended option: a lecture comparing two commands is
 * usually recommending neither, and a figure that defaults to arguing for one is
 * a figure that argues by accident. Emphasis is `tone: 'lead'` on one side, which
 * paints the accent and nothing else, and the geometry stays symmetric.
 *
 * WHAT IT IS WORST AT
 *
 * **Nothing aligns across the seam.** Two panels whose cells are different
 * heights drift apart as they descend, so by the fourth row the reader is again
 * holding one column in memory. That is the failure `AttributeSpine` exists to
 * fix, and it is why this variant caps at three rows rather than at the shared
 * contract's six.
 *
 * Second, **two equal panels claim the two sides are equally good.** Symmetry is
 * a statement. For a pair where one genuinely is the answer, the symmetry has to
 * be argued against in the title or with `lead`, and neither is as strong as the
 * geometry saying it.
 */
export function HeadToHead({
  a,
  b,
  rows,
  caption,
  width = 1152,
  className = '',
}: ComparisonFigureProps) {
  const g = resolveComparison({ a, b, rows })
  const n = g.rows.length

  /*
    BEAT 0 IS THE TWO HEADS, then one beat per row, then the caption. A row's
    two halves land together: landing the left panel whole and then the right
    would show every one of A's answers before any of B's, which is the failure
    the contract exists to prevent, reintroduced in time. See `motion.tsx`.
  */
  const CAPTION = n + 1
  const shown = useBeats(CAPTION + 1)

  const SEAM = 1
  const GAP = 56
  const half = Math.round((width - SEAM - GAP * 2) / 2)

  const problems = [...g.problems]
  /*
    THREE ROWS, NOT THE CONTRACT'S SIX, AND THE NUMBER IS THIS VARIANT'S OWN.

    With nothing in the middle to align against, two panels of unequal cell
    heights drift. At three rows the drift is small enough that the eye still
    pairs them; past that it is reading two lists. The shared resolver caps at
    six because six is where no arrangement helps; this is where THIS
    arrangement stops helping.
  */
  if (n > 3) {
    problems.push(
      `${n} rows with nothing in the gutter to align them; past three the two panels drift, so this set wants AttributeSpine`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  const sides = [
    { side: a, paint: toneOf(a.tone), get: (r: (typeof g.rows)[number]) => r.a },
    { side: b, paint: toneOf(b.tone), get: (r: (typeof g.rows)[number]) => r.b },
  ]

  return (
    <figure className={`mx-auto ${className}`} style={{ width }}>
      <div
        className="grid items-stretch"
        style={{ gridTemplateColumns: `${half}px ${GAP}px ${SEAM}px ${GAP}px ${half}px` }}
      >
        {sides.map(({ side, paint, get }, s) => (
          <div
            key={side.id}
            /* Column 1 is the left panel, column 5 the right. The seam and its
               two gaps occupy 2 to 4. */
            style={{ gridColumn: s === 0 ? 1 : 5, gridRow: 1 }}
            className="flex h-full flex-col"
          >
            {/*
              THE HEADER SLOT NEEDS `height: auto` FOR THE SAME REASON THE ROWS
              DO, AND IT IS THE ONE THAT ACTUALLY CAUSED THE 25px.

              The two panels are stretched to equal height by the grid. Their
              content is not equal: this fixture's right panel has a two-line
              cell and the left does not, so the left panel has more leftover
              space. `h-full` on the first flex item hands that leftover to the
              HEADER, so the left card grew and pushed its rows down past the
              right panel's by 25px.

              It looked like a rows problem and was not, which is worth recording:
              in a stretched flex column, any `h-full` child silently becomes the
              place the slack goes.
            */}
            <FcNodeIn at={0} shown={shown[0]} className="relative" style={{ height: 'auto' }}>
              <div className="rounded-card px-6 pb-5 pt-5" style={panelSurface(paint, 'top')}>
                <SideHead
                  label={side.label}
                  gloss={side.gloss}
                  icon={side.icon}
                  paint={paint}
                  size="lg"
                />
              </div>
            </FcNodeIn>

            {/*
              A PLAIN BLOCK, NOT `flex flex-1 flex-col`, AND THE SCREENSHOT IS
              THE ONLY REASON THIS IS KNOWN.

              `FcNodeIn` carries `h-full`, which it needs in `AttributeSpine`
              where its slots sit in a stretching grid. Inside a flex column
              every row then claimed 100% of the container, so flex distributed
              the leftover space between them, and it distributed it DIFFERENTLY
              in each panel because each panel's cells wrap to different heights.
              The result was the two panels' first rows starting 25px apart, on a
              figure whose entire job is putting two things side by side.

              All three harnesses passed it: every box was inside the frame, out
              of the video rectangle and clear of the controls, and the figure
              was still wrong. Content rule 17, exactly.

              With a block parent the children's `height: 100%` resolves against
              an auto height and comes out as auto, so the rows stack from the
              top of both panels and the first row of each lands level.
            */}
            <div className="mt-4">
              {g.rows.map((r, i) => (
                <FcNodeIn
                  key={r.id}
                  at={i + 1}
                  shown={shown[i + 1]}
                  className="relative"
                  /*
                    `height: auto` AS AN INLINE STYLE, AND IT HAS TO BE INLINE.

                    `FcNodeIn` hard-codes `h-full` in its own className because
                    `AttributeSpine`'s slots sit in a stretching grid and need
                    it. Here the rows are stacked, and a row claiming the full
                    height of the panel makes the two panels distribute their
                    leftover space differently and their rows stop lining up.

                    Passing `h-auto` in `className` does not fix it: both classes
                    have the same specificity, so which wins depends on the order
                    Tailwind happens to emit them in, not on the order they are
                    written. An inline style beats both and says what is meant.
                  */
                  style={{ height: 'auto' }}
                >
                  <div
                    className="py-4"
                    style={{
                      borderBottom: i === n - 1 ? 'none' : `1px solid ${colors.line}`,
                    }}
                  >
                    {/* Left-aligned, not centred: the attribute is repeated on
                        both sides and a centred label above left-set prose makes
                        the eye hunt for the start of each cell. */}
                    <Attribute align="left">{r.attribute}</Attribute>
                    <span className="mt-2 block">
                      <Cell emphasis={Boolean(r.pivot)}>{get(r)}</Cell>
                    </span>
                  </div>
                </FcNodeIn>
              ))}
            </div>
          </div>
        ))}

        {/* THE SEAM. Its own grid column so it spans the full height of the
            taller panel without either panel having to know about it. */}
        <span
          aria-hidden
          style={{ gridColumn: 3, gridRow: 1, background: colors.line }}
          className="block w-px"
        />
      </div>

      {caption && (
        <FcEdgeLabel at={CAPTION} shown={shown[CAPTION]} className="block">
          <SetCaption width={width}>{caption}</SetCaption>
        </FcEdgeLabel>
      )}
    </figure>
  )
}
