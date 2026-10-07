import { FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { cellChars, resolveComparison, type ComparisonFigureProps } from './comparisonFigure'
import {
  Attribute,
  Cell,
  ProblemPanel,
  SetCaption,
  SideHead,
  pivotWash,
  toneOf,
} from './comparisonChrome'
import { colors } from '@/design/tokens'

/**
 * ATTRIBUTE SPINE — the attribute sits in a centre gutter and the two answers
 * hang off it left and right, one row per question.
 *
 * THE ARGUMENT
 *
 * This is the only arrangement in the lab where a row-wise reading is guaranteed
 * rather than hoped for, and that is the finding the whole lab turns on.
 *
 * Every comparison template in the wild draws option A's points in the left box
 * and option B's in the right. Nothing in that arrangement guarantees that A's
 * third point and B's third point are about the same thing, and the moment the
 * two texts differ in length they stop sharing a line. The reader ends up
 * holding one column in memory while scanning the other, which is the work the
 * figure was supposed to do for them.
 *
 * Putting the attribute in the middle fixes it structurally rather than by
 * discipline. The row becomes the unit, the eye crosses the seam because there
 * is something in the middle telling it what it is crossing, and a cell that is
 * two lines pushes its own row taller rather than sliding out of alignment with
 * its partner.
 *
 * WHY THE GUTTER IS 200px AND FIXED
 *
 * The attribute is capped at 32 characters by `resolveComparison`, which is
 * about four words. At 12px uppercase with 0.06em tracking that sets to roughly
 * 180px, so 200 holds the longest legal attribute on two lines with air. Fixed
 * rather than proportional because a gutter that grows with the figure's width
 * would put 280px of white between the two answers on a full-well figure, and
 * the answers are the thing being compared: past about 200px apart the eye stops
 * making the comparison and reads two columns.
 *
 * On a 1152px well that leaves 476px a side. The 110-character cell ceiling is
 * derived from exactly this number: 110 characters of 16.5px Inter wraps to two
 * lines at 476px, and two lines is the ceiling before the rows stop scanning.
 *
 * WHY THE ATTRIBUTE IS THE QUIETEST TEXT ON THE FIGURE
 *
 * It looks like it should be the loudest, being the spine. It is scaffolding: it
 * tells the eye what is being compared and then gets out of the way, because the
 * things the room is reading are the two answers. Set at cell weight, the row
 * read as three equal columns, which is a table, and a table says these rows are
 * data. See the note on `Attribute` in `comparisonChrome.tsx`.
 *
 * WHAT IT IS WORST AT
 *
 * **It asserts that both subjects HAVE the attribute.** A spine writes every row
 * as a question asked of both, so comparing a thing against the absence of a
 * thing produces rows that are false. `resolveComparison` refuses the empty cell
 * outright for this reason, and the honest figure for "only A has this" is a
 * three-region similarities-and-differences layout.
 *
 * Second, **it is not worth its gutter at two rows.** A spine earns 200px by
 * being the thing several rows hang off; at two, a third of the figure is spent
 * on two short labels and `HeadToHead` says the same thing with the room going
 * to the words. It renders that case rather than refusing it, because two rows
 * is still legible, but the lab's CLAUDE.md records which variant that count
 * belongs to.
 */
export function AttributeSpine({
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
    BEAT 0 IS THE TWO SIDE HEADS, so the slide opens having said what is being
    compared. Then one beat per row, then the caption. Count is derived from
    props and never from state, per the note in `motion.tsx`, and the hook is
    claimed BEFORE the early return below.
  */
  const CAPTION = n + 1
  const shown = useBeats(CAPTION + 1)

  const GUTTER = 200
  const half = Math.round((width - GUTTER) / 2)

  const problems = [...g.problems]
  /*
    The spine needs a readable measure on BOTH sides of a fixed gutter. Below
    about 760px the halves fall under 280px each, where a 110-character cell is
    four lines and the row-height argument collapses.
  */
  if (width < 760) {
    problems.push(
      `a spine needs about 760px; at ${width}px the two halves are ${half}px each, which is four lines for a full cell`,
    )
  }
  /*
    THIS VARIANT'S OWN CELL CEILING, TIGHTER THAN THE SHARED 140.

    A fixed 200px gutter leaves 476px a side on a full well, which is about 58
    characters of 16.5px Inter per line. 110 is two lines; 125 is three, and a
    three-line cell makes its row half again as tall as the row under it, at
    which point the rows stop scanning and the spine has lost the only thing it
    has. Content in that range is what `LabelBand` exists for: it spends a line
    of height on the label instead of a column of width, and hands the same cell
    552px.
  */
  /*
    THE BAND IS 111 TO 140, NOT "ANYTHING OVER 110", SO EXACTLY ONE MESSAGE
    FIRES PER CELL.

    Past 140 the shared resolver has already refused it on behalf of the whole
    lab, and a cell reported twice, once for being too long and once for being
    too long for this variant, reads as two faults and sends the author looking
    for the second one. This check speaks only for the range where the
    distinction is real: too long HERE, and fine on `LabelBand`.
  */
  const over = g.rows.filter((r) => {
    const longest = Math.max(cellChars(r.a), cellChars(r.b))
    return longest > 110 && longest <= 140
  })
  for (const r of over) {
    problems.push(
      `row "${r.attribute}" has a cell over 110 characters, which is three lines at ${half}px; this set wants LabelBand`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  const paintA = toneOf(a.tone)
  const paintB = toneOf(b.tone)
  /* The pivot wash takes the lead side's paint when there is one, so the
     emphasis on the frame is one colour rather than two. */
  const pivotPaint = b.tone === 'lead' ? paintB : a.tone === 'lead' ? paintA : colors.brand

  return (
    <figure className={`mx-auto ${className}`} style={{ width }}>
      {/* THE HEADS. Not inside a row, because they label the columns rather
          than answering anything, and giving them an attribute cell in the
          gutter would have put a fourth kind of text on the spine. */}
      <FcNodeIn at={0} shown={shown[0]} className="relative">
        <div
          /*
            `pt-4` IS CLEARING THE INSTRUCTOR VIDEO, NOT BALANCING THE FIGURE.

            `video-safe.mjs` reserves x913..1280, y0..220 for the presenter's
            camera feed. A figure that runs the full 1152px well has its right
            column under that rectangle by definition, so the only thing it can
            do is start below it. Without this the `docker compose up` head sat
            at y211 and intruded 101px wide by 9px tall, which is a head the room
            never sees because there is a face over it.

            16px rather than the 9 the harness asked for, because the head's own
            descenders and its 4px rule sit under the measured text box and a
            9px clearance leaves them touching.
          */
          className="grid items-end pb-3 pt-4"
          style={{ gridTemplateColumns: `${half}px ${GUTTER}px ${half}px` }}
        >
          <div style={{ borderBottom: `4px solid ${paintA}`, paddingBottom: 12 }}>
            <SideHead label={a.label} gloss={a.gloss} icon={a.icon} paint={paintA} size="md" />
          </div>
          <div aria-hidden />
          <div style={{ borderBottom: `4px solid ${paintB}`, paddingBottom: 12 }}>
            <SideHead label={b.label} gloss={b.gloss} icon={b.icon} paint={paintB} size="md" />
          </div>
        </div>
      </FcNodeIn>

      <div>
        {g.rows.map((r, i) => (
          <FcNodeIn key={r.id} at={i + 1} shown={shown[i + 1]} className="relative">
            <div
              className="grid items-center"
              style={{
                gridTemplateColumns: `${half}px ${GUTTER}px ${half}px`,
                /* A hairline per row and none between columns: the row is the
                   unit, and a vertical rule would cut it in half. The last row
                   has none, so the figure does not end on a line. */
                borderBottom: i === n - 1 ? 'none' : `1px solid ${colors.line}`,
              }}
            >
              {/*
                `py-3` AND NOT `py-4`, AND THE 8px A ROW GIVES BACK IS SPENT AT
                THE TOP OF THE FIGURE.

                At six rows, which is the contract's cap, 16px of padding either
                side put the caption's bottom edge at exactly y660, which is the
                first pixel of the deck's own controls: `align-check.mjs`
                reported the caption as CHROME, in the DOM and unreadable behind
                the slide counter. Twelve keeps a two-line cell comfortable, and
                five rows of 8px is the 40px that pays for the video clearance
                above with room left over.
              */}
              <div className="py-3 pr-6">
                <Cell emphasis={Boolean(r.pivot)}>{r.a}</Cell>
              </div>
              <div
                className="px-4 py-3"
                style={r.pivot ? pivotWash(pivotPaint) : undefined}
              >
                <Attribute>{r.attribute}</Attribute>
              </div>
              <div className="py-3 pl-6">
                <Cell emphasis={Boolean(r.pivot)}>{r.b}</Cell>
              </div>
            </div>
          </FcNodeIn>
        ))}
      </div>

      {caption && (
        <FcEdgeLabel at={CAPTION} shown={shown[CAPTION]} className="block">
          <SetCaption width={width}>{caption}</SetCaption>
        </FcEdgeLabel>
      )}
    </figure>
  )
}
