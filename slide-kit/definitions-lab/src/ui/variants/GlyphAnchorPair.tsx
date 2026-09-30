import { FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { resolveDefinitions, type DefinitionFigureProps } from './definitionFigure'
import {
  cardSurface,
  Definition,
  ExampleBlock,
  Gloss,
  GlyphWell,
  ProblemPanel,
  SetCaption,
  Term,
  toneOf,
} from './definitionChrome'

/**
 * GLYPH ANCHOR, PAIR — `GlyphAnchor`'s design at TWO definitions. The glyph
 * leaves the header and becomes a rail down the left of each card, so the term
 * sits beside it and the definition runs under the term rather than under both.
 *
 * WHY TWO IS NOT THREE WITH ONE CARD REMOVED
 *
 * `GlyphAnchor` stacks a 56px header row above a full-width definition, and that
 * is the right call at a third of the well: 336px of inner card is too narrow to
 * give a glyph a column and still leave the prose a measure, so the glyph has to
 * spend the card's height instead of its width.
 *
 * At two terms the card is 564px wide and that constraint is simply gone. The
 * header stack is now paying 56px of height, plus its gap, for an arrangement
 * that only existed because there was no width. Two things go wrong if it is
 * kept:
 *
 *   1. **The definition indents under nothing.** A full-width definition under a
 *      full-width header gives the card one left edge, which is fine when the
 *      card is narrow and the header is the whole top of it. At 564px the header
 *      is a 56px mark with 400px of white beside it, and the row reads as a card
 *      with a hole in its top-right corner.
 *   2. **The height is spent in the wrong place.** Header stack plus gap is 70px
 *      of a card that also has to carry a four-line definition and a three-line
 *      example. Moved to a rail, the same glyph costs zero height, and the 70px
 *      goes to the example, which is the part a two-term frame has finally got
 *      room for.
 *
 * So the glyph turns ninety degrees, exactly as it does in `GlyphAnchorSolo`,
 * and for the same reason: at this count the spare axis is width.
 *
 * WHAT IS KEPT FROM SLIDE 2, EXACTLY
 *
 * Same `cardSurface` with `accent: 'none'` and the tone living in the glyph
 * well. Same glyph-then-term reading order. Same `Gloss` in the tone under the
 * term. Same `mt-auto` example on the card's floor, which is the trick that
 * matters most here. Same equal-height row, same tone ramp, same timings, one
 * click per card.
 *
 * WHAT IS ADAPTED, AND THE NUMBER BEHIND EACH
 *
 *   **A 72px rail, not a 56px header.** 564px of card less 48 of padding is 516
 *   inside; the rail takes 72 and a 20px gutter, leaving 424px of measure for
 *   everything to its right. 424px at 16.5px is about 59 characters a line, which
 *   is inside the comfortable band, so the indent costs the prose nothing it
 *   needed.
 *
 *   **The term goes to `lg` (28px) from `md` (22px).** "Race Condition" at 28px
 *   is about 190px against a 424px column, so the 28-character ceiling still
 *   sits on one line with room, and the pair's terms read as the headline of the
 *   frame rather than as two card titles.
 *
 *   **The definition stays at `md` (16.5px).** This is the one place the pair
 *   does NOT follow `GlyphAnchorSolo`, which goes to 20px. At one term the prose
 *   has no competition; at two it does, and 20px in a 424px column is 51
 *   characters a line, which turns the 236-character definition into five lines
 *   and one card visibly taller in its text than the other.
 *
 *   **The example always renders.** `GlyphAnchor` gates it at 420px of inner
 *   card and gets 336 at three terms. Here the column is 424, which clears the
 *   50-character line the fixture's longest example needs, so the gate never
 *   fires. This is the count at which slide 2's design first gets to show the
 *   thing itself, and it is most of why two terms is worth its own arrangement.
 *
 * THE EQUAL-HEIGHT ROW IS THE WHOLE TEST AT THIS COUNT
 *
 * The pair fixture is the fixture's 236-character definition beside its
 * 71-character one, which is the widest spread the lab holds. `items-stretch`
 * plus `h-full` on the card plus `mt-auto` on the example is what makes the two
 * examples land on one line across the frame while the prose above them is two
 * lines on one side and four on the other. Drop any one of the three and the
 * short card's example floats in the middle of its own card, which reads as a
 * layout that failed rather than as a definition that was shorter.
 *
 * WHAT IT IS WORST AT
 *
 * **Two cards is the most symmetrical arrangement there is, and symmetry says
 * the two terms are equal.** That is a claim, and it is usually wrong: a pair is
 * normally a thing and the thing it gets confused with. The tone ramp is the only
 * answer here, and one `new` card beside one `neutral` card is a quieter
 * difference than it should be at this size. A slide whose point is "this one,
 * not that one" wants `SidePanel`, whose painted third states it loudly.
 *
 * Second, **the rail is dead space when the glyph is a fallback initial.** At
 * three terms a lettered box at least sits in a header that has other things in
 * it; a 72px column holding one letter for the height of the whole card is a
 * column asking what it is for.
 */
export function GlyphAnchorPair({
  terms,
  caption,
  width = 1152,
  className = '',
}: DefinitionFigureProps) {
  const g = resolveDefinitions({ terms })
  const n = g.terms.length

  const CAPTION = n
  const shown = useBeats(CAPTION + 1)

  const problems = [...g.problems]
  if (n !== 2) {
    problems.push(
      `${n} terms; this is the two-definition arrangement. One term is GlyphAnchorSolo, three is GlyphAnchor, and a 72px rail plus a 20px gutter leaves ${Math.round(width / Math.max(n, 1)) - 140}px of measure at this count`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  const GAP = 24
  const RAIL = 72
  const PAD = 24

  return (
    <figure className={`mx-auto ${className}`} style={{ width }}>
      <div
        className="grid items-stretch"
        style={{ gridTemplateColumns: `repeat(${n}, 1fr)`, gap: GAP }}
      >
        {g.terms.map((t, i) => {
          const paint = toneOf(t.tone)
          return (
            <FcNodeIn key={t.id} at={i} shown={shown[i]} className="relative">
              <div
                className="grid h-full items-start rounded-card"
                style={{
                  ...cardSurface(paint, 'none'),
                  padding: PAD,
                  gridTemplateColumns: `${RAIL}px minmax(0, 1fr)`,
                  columnGap: 20,
                }}
              >
                {/*
                  The glyph sits at the top of the rail rather than centred down
                  it. Centred, it drifts to a different height on each card as
                  soon as the definitions differ in length, and two glyphs at two
                  heights is the row of marks this variant is built to keep level.
                */}
                <GlyphWell icon={t.icon} paint={paint} size={RAIL} fallback={t.term} />

                {/* `h-full` here and not on the grid: the column has to be the
                    card's full height for `mt-auto` to have a floor to push the
                    example to. */}
                <div className="flex h-full min-w-0 flex-col">
                  <Term size="lg">{t.term}</Term>
                  {t.gloss && (
                    <span className="mt-1 block">
                      <Gloss paint={paint}>{t.gloss}</Gloss>
                    </span>
                  )}
                  <span className="mt-3.5 block">
                    <Definition>{t.definition}</Definition>
                  </span>
                  {t.example && (
                    <ExampleBlock
                      example={t.example}
                      note={t.exampleNote}
                      paint={paint}
                      className="mt-auto pt-4"
                    />
                  )}
                </div>
              </div>
            </FcNodeIn>
          )
        })}
      </div>

      {caption && (
        <FcEdgeLabel at={CAPTION} shown={shown[CAPTION]} className="block">
          <SetCaption width={width}>{caption}</SetCaption>
        </FcEdgeLabel>
      )}
    </figure>
  )
}
