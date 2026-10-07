import { FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { cellChars, resolveComparison, type ComparisonFigureProps } from './comparisonFigure'
import {
  Attribute,
  Cell,
  ProblemPanel,
  SetCaption,
  SideHead,
  toneOf,
} from './comparisonChrome'
import { colors } from '@/design/tokens'

/**
 * LABEL BAND — the attribute on a quiet full-width band, the two answers in
 * equal columns underneath it.
 *
 * THE ARGUMENT: IT BUYS MEASURE WITH HEIGHT
 *
 * `AttributeSpine` spends a 200px COLUMN on the attribute, and that column is
 * taken out of the middle of the figure, so both answers pay for it forever. On
 * a 1152px well each cell gets 476px, about 58 characters a line.
 *
 * This variant spends a LINE OF HEIGHT on the same label instead, and the label
 * is then out of the way. Both cells get 552px, about 67 characters a line. The
 * difference sounds small and is not: a 125-character cell is three lines at 476
 * and two at 552, and a three-line cell makes its row half again as tall as the
 * row under it, which is where a comparison stops scanning.
 *
 * So the two are not alternatives on taste. Short cells belong on the spine,
 * because the spine reads faster and fits more rows. **Cells that need a clause
 * belong here**, and `AttributeSpine` refuses them by name.
 *
 * IT IS ALSO THE MOST SYMMETRIC ARRANGEMENT IN THE LAB, AND THAT IS A CLAIM
 *
 * Nothing sits between the two answers, so neither is nearer the centre, nearer
 * the label, or first. A centred band over two equal columns says the two sides
 * are being asked the same question with equal standing, which is what a
 * comparison usually means and is exactly what `HeadToHead` cannot say, because
 * a left panel and a right panel are read in that order.
 *
 * WHY THE BAND IS A TINT AND NOT A RULE
 *
 * A hairline above each pair would separate the rows, and the rows are already
 * separated by the space between them. What the band has to do is bind the two
 * cells UNDER it into one row, and a filled ground does that where a line does
 * not: everything sitting on the same tint reads as one group. It is
 * `colors.surface` at full strength rather than a tone tint, because the band
 * appears on every row and a tone repeated six times stops being a tone.
 *
 * WHAT IT IS WORST AT
 *
 * **It holds the fewest rows of anything in the lab.** Every row costs a band
 * plus its own gap, roughly 30px more than a spine row, so the same well that
 * takes six spine rows takes four of these, and four only when the cells fit two
 * lines. The refusals below are that arithmetic.
 *
 * Second, **the eye travels further between the two answers.** They are 552px
 * apart edge to edge where the spine puts them 200px apart, so for a set of
 * short cells this variant is strictly worse: it has spread two words across the
 * whole frame and spent a line of height announcing it.
 */
export function LabelBand({
  a,
  b,
  rows,
  caption,
  width = 1152,
  className = '',
}: ComparisonFigureProps) {
  const g = resolveComparison({ a, b, rows })
  const n = g.rows.length

  const CAPTION = n + 1
  const shown = useBeats(CAPTION + 1)

  const GAP = 48
  const half = Math.round((width - GAP) / 2)

  const problems = [...g.problems]

  /*
    FOUR ROWS, AND THREE WHEN THE CELLS ARE LONG.

    Measured against the content well a `ContentSlide` leaves, which is about
    417px once the header and the deck controls are accounted for. A row here is
    a 22px band, an 8px gap, the cells, and a 24px gap to the next row. With
    one-line cells that is 80px, so four rows plus the side heads and the caption
    come to roughly 400. With two-line cells it is 106, and four of those overrun
    the well and put the caption behind the slide counter.

    70 characters is the one-line boundary at 552px. The check is on the cells
    rather than on a measured height because this lab lays out in CSS and does not
    compute geometry; what it can honestly say is which content will not fit.
  */
  const twoLine = g.rows.filter((r) => cellChars(r.a) > 70 || cellChars(r.b) > 70).length
  if (n > 4) {
    problems.push(
      `${n} rows; a band and its gap cost about 30px more per row than a spine, so this arrangement holds four`,
    )
  } else if (n > 3 && twoLine > 0) {
    problems.push(
      `${n} rows with ${twoLine} of them over one line; at two lines a band row is 106px, and four of those overrun the well`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  const paintA = toneOf(a.tone)
  const paintB = toneOf(b.tone)
  const pivotPaint = b.tone === 'lead' ? paintB : a.tone === 'lead' ? paintA : colors.brand

  return (
    <figure className={`mx-auto ${className}`} style={{ width }}>
      {/*
        COMPACT HEADS, WITHOUT THE GLYPH WELL THE SPINE GIVES THEM.

        This variant needs its height for the bands, and a 40px icon tile buys
        recognition that the labels here already have: the side names sit
        directly over their own columns and are repeated by nothing, so there is
        no ambiguity for a glyph to resolve. `pt-4` is the instructor-video
        clearance, same as the spine and for the same reason.
      */}
      <FcNodeIn at={0} shown={shown[0]} className="relative">
        <div
          className="grid pb-4 pt-4"
          style={{ gridTemplateColumns: `${half}px ${GAP}px ${half}px` }}
        >
          <div style={{ borderBottom: `3px solid ${paintA}`, paddingBottom: 8 }}>
            <SideHead label={a.label} gloss={a.gloss} paint={paintA} size="sm" />
          </div>
          <div aria-hidden />
          <div style={{ borderBottom: `3px solid ${paintB}`, paddingBottom: 8 }}>
            <SideHead label={b.label} gloss={b.gloss} paint={paintB} size="sm" />
          </div>
        </div>
      </FcNodeIn>

      {g.rows.map((r, i) => (
        <FcNodeIn key={r.id} at={i + 1} shown={shown[i + 1]} className="relative">
          <div className={i === n - 1 ? '' : 'mb-6'}>
            <div
              className="rounded-lg px-4 py-1.5"
              style={{
                background: r.pivot ? `${pivotPaint}14` : colors.surface,
              }}
            >
              <Attribute>{r.attribute}</Attribute>
            </div>
            <div
              className="mt-2 grid items-start"
              style={{ gridTemplateColumns: `${half}px ${GAP}px ${half}px` }}
            >
              <div>
                <Cell emphasis={Boolean(r.pivot)}>{r.a}</Cell>
              </div>
              <div aria-hidden />
              <div>
                <Cell emphasis={Boolean(r.pivot)}>{r.b}</Cell>
              </div>
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
