import { colors } from '@/design/tokens'
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
 * GLYPH ANCHOR, SOLO — `GlyphAnchor`'s design at ONE definition. The glyph and
 * the term take a column of their own on the left, the definition and its
 * example take the rest, and a hairline runs between them.
 *
 * WHY THIS IS A SEPARATE COMPONENT AND NOT A BRANCH INSIDE `GlyphAnchor`
 *
 * `GlyphAnchor` lays its cards out as `repeat(n, 1fr)`, which is the correct
 * geometry at three and quietly the wrong one at every other count. Handed a
 * single term it draws one card 1152px wide, and two separate things break at
 * once:
 *
 *   1. **The measure goes to 1056px.** That is about 150 characters a line at
 *      16.5px, so the fixture's longest definition sets as two enormous lines
 *      and the eye loses its place on the return sweep. Anything past roughly 75
 *      characters a line stops being readable prose, and this is double it.
 *   2. **The 56px glyph becomes a speck.** The whole argument of the variant is
 *      that the room recognises a shape before it reads a word. A 56px mark on a
 *      1152x330 card is 1.5% of the card, floating in white: it is decoration on
 *      the one layout whose reason for existing is that it is not.
 *
 * Neither is fixable by scaling the same arrangement. A layout that stacks a
 * header above a full-width definition has only one axis to give, and at one
 * term there is 1152px of the wrong axis. So the arrangement turns ninety
 * degrees: the header becomes a column, and the spare width is spent on a second
 * column rather than on a longer line.
 *
 * WHAT IS KEPT FROM SLIDE 2, EXACTLY
 *
 * The design language, which is the point of a variation rather than a new
 * design. Same `cardSurface` with `accent: 'none'`, because the tone still lives
 * in the glyph well and a card with both an accent edge and a tinted glyph is
 * two coloured marks. Same glyph-then-term reading order, same `Gloss` under the
 * term in the tone, same `ExampleBlock` on the floor of its column, same tone
 * ramp, same timings.
 *
 * WHAT IS ADAPTED, AND THE NUMBER BEHIND EACH
 *
 *   **The glyph doubles to 112px.** At one term it is carrying the recognition
 *   job alone, with no second and third glyph beside it to be told apart from,
 *   so it has to hold the left column on its own.
 *
 *   **The term goes to `xl` (40px) from `md` (22px).** It is the only term on
 *   the frame and it has a 440px column to itself, so it can finally be set at
 *   the size the lab's own argument says a term deserves: the largest thing on
 *   the slide after the title. At 40px "Race Condition" is about 250px, so the
 *   28-character ceiling in `resolveDefinitions` still fits this column on one
 *   line.
 *
 *   **The definition goes to `lg` (20px).** 1152 - 88 of padding - 440 of left
 *   column - 88 of gutters - 1 of rule leaves 535px of measure, which is about 62
 *   characters a line at 20px: inside the comfortable band, where the same prose
 *   at the full width was at 150. The fixture's 236-character definition sets as
 *   four lines.
 *
 *   **The example always renders.** `GlyphAnchor` has to gate it on the card
 *   being at least 420px wide inside, and at three terms it is 336 and the block
 *   would scroll sideways. Here the right column is 535px, so the 50-character
 *   line has 130px to spare and the gate is unnecessary.
 *
 * THE BEATS ARE DIFFERENT, AND THAT IS COUNT-SPECIFIC TOO
 *
 * The multi-term variants spend one click per card, because the room meeting
 * three words at once reads ahead. One card is not a sequence, so there is
 * nothing to stagger and a single click would leave the slide with one build
 * step and nothing to do. The split that is actually there is the one the
 * instructor makes with their voice: here is the word and what it means, and
 * then, once that has landed, here is what it looks like. So beat 0 is the card
 * and beat 1 is the example.
 *
 * WHAT IT IS WORST AT
 *
 * **It is a one-term layout and it refuses everything else**, which is the whole
 * bargain: a 440px column of glyph and term beside a 535px column of prose is
 * two cards' worth of width, so a second term has nowhere to go but underneath,
 * and two of these stacked is 660px against a 440px well. `GlyphAnchorPair` is
 * the two-term answer and it is a different arrangement, not this one halved.
 *
 * Second, **a term shorter than about six characters strands the left column.**
 * "Port" at 40px is 90px of a 440px column, so the rule down the middle sits
 * beside a lot of nothing. The glyph carries it, but the balance is honestly
 * better at 11 characters than at 4.
 */
export function GlyphAnchorSolo({
  terms,
  caption,
  width = 1152,
  className = '',
}: DefinitionFigureProps) {
  const g = resolveDefinitions({ terms })
  const n = g.terms.length
  const t = g.terms[0]

  /* Claimed before the `ProblemPanel` return: a hook behind an early return
     appears and disappears with the props. The count cannot depend on `t`
     existing, so it is computed from the props' own length. */
  const hasExample = Boolean(t?.example)
  const CAPTION = hasExample ? 2 : 1
  const shown = useBeats(CAPTION + 1)

  const problems = [...g.problems]
  if (n !== 1) {
    problems.push(
      `${n} terms; this is the one-definition arrangement, and its left column alone is 440px of ${width}. Two terms is GlyphAnchorPair, three is GlyphAnchor`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  const paint = toneOf(t.tone)

  /*
    THE COLUMNS, AND WHY THE RULE IS A GRID TRACK RATHER THAN A BORDER.

    A `borderRight` on the left column is drawn at the column's own height, and
    the two columns are different heights: the glyph and term come to 214px and
    the definition with its example to 241. The rule would stop 27px short of the
    card's floor and read as an unfinished line. A 1px track in a stretched grid
    is full-bleed between the card's paddings, which is what a divider is.
  */
  const COL = 440
  const GUTTER = 44
  const PAD = 44

  return (
    <figure className={`mx-auto ${className}`} style={{ width }}>
      <FcNodeIn at={0} shown={shown[0]} className="relative">
        <div
          className="grid h-full items-stretch rounded-card"
          style={{
            ...cardSurface(paint, 'none'),
            padding: PAD,
            gridTemplateColumns: `${COL}px 1px minmax(0, 1fr)`,
            columnGap: GUTTER,
          }}
        >
          <div>
            <GlyphWell icon={t.icon} paint={paint} size={112} fallback={t.term} />
            <span className="mt-6 block">
              <Term size="xl">{t.term}</Term>
            </span>
            {t.gloss && (
              <span className="mt-2 block">
                <Gloss paint={paint}>{t.gloss}</Gloss>
              </span>
            )}
          </div>

          <span aria-hidden className="block h-full" style={{ background: colors.line }} />

          <div className="flex min-w-0 flex-col">
            <Definition size="lg">{t.definition}</Definition>
            {t.example && (
              /* `height: 'auto'` overrides `FcNodeIn`'s own `h-full`, which is
                 there for the stretched card rows of the multi-term variants and
                 would stretch this block inside the flex column. `mt-auto` puts
                 the example on the column's floor either way. */
              <FcNodeIn
                at={1}
                shown={shown[1]}
                className="mt-auto block"
                style={{ height: 'auto' }}
              >
                <ExampleBlock
                  example={t.example}
                  note={t.exampleNote}
                  paint={paint}
                  className="pt-5"
                />
              </FcNodeIn>
            )}
          </div>
        </div>
      </FcNodeIn>

      {caption && (
        <FcEdgeLabel at={CAPTION} shown={shown[CAPTION]} className="block">
          <SetCaption width={width}>{caption}</SetCaption>
        </FcEdgeLabel>
      )}
    </figure>
  )
}
