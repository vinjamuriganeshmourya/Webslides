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
 * GLYPH ANCHOR — a card whose header is a 56px glyph with the term beside it,
 * and the definition running the card's full width underneath.
 *
 * THE ARGUMENT
 *
 * This is the only variant in the lab that answers the three-second question.
 * A room looking up from a laptop sees shapes before it reads anything, and
 * three cards of pure type give it nothing to see: it has to start reading to
 * find out what the slide is about. A bolt, a shield and a database are
 * recognised before the eye has focused, so the room arrives at the words
 * already knowing there are three different KINDS of thing here.
 *
 * It is also the variant that makes a term findable again later. An instructor
 * who says "go back to the one with the bolt" is understood; "go back to the
 * second one" is not, because nobody remembers the order.
 *
 * THE TONE LIVES IN THE GLYPH, SO THE CARD HAS NO ACCENT EDGE
 *
 * Every other card variant here carries a 4px accent on its left edge. This one
 * passes `accent: 'none'` and lets the glyph well's tint be the tone, because
 * two coloured marks on one small card is one too many: with both, the row read
 * as three coloured stripes with three coloured squares next to them, and the
 * eye went to the stripes, which carry less.
 *
 * THE GLYPH HAS TO DEPICT THE TERM, AND THERE IS A FALLBACK FOR WHEN IT CANNOT
 *
 * Hard rule 8 is about illustrations and it applies just as hard at 26px: a cog
 * on "Race Condition" is decoration, and decoration on the one variant whose
 * whole argument is recognition is worse than nothing, because the room learns
 * that the glyphs mean nothing and stops looking at them.
 *
 * Plenty of terms have no honest glyph. "Idempotency" only has one because
 * "safe to repeat" happens to map onto a shield. So `GlyphWell` falls back to
 * the term's own initial set in the tone, which is not a picture but is at least
 * a distinct shape per term and tells no lies. `resolveDefinitions` refuses a set
 * where only SOME terms have an icon, so the choice is made once for the set.
 *
 * WHAT IT IS WORST AT
 *
 * **The glyph costs the definition a line.** The header row is 56px and the card
 * is the same height as its neighbours, so on a three-term row the tallest
 * definition gets one line less than it would in `BandSplit`, whose band is 44px.
 * On the fixture that is the difference between four lines and three for the race
 * condition, and it is why this variant renders the example only when there is
 * room for it, at two terms or fewer.
 *
 * Second, **it flatters a set of concrete terms and punishes an abstract one.**
 * Three terms that all fall back to initials look like three lettered boxes, and
 * at that point `TermLede` is saying the same thing with more room for words.
 */
export function GlyphAnchor({
  terms,
  caption,
  width = 1152,
  className = '',
}: DefinitionFigureProps) {
  const g = resolveDefinitions({ terms })
  const n = g.terms.length

  const CAPTION = n
  const shown = useBeats(CAPTION + 1)

  /*
    THE EXAMPLE IS RENDERED ONLY WHEN THE CARD IS WIDE ENOUGH TO HOLD IT.

    An `ExampleBlock` is mono at 13.5px and does not wrap, so the fixture's
    longest example line, 50 characters, needs about 405px of inner width. A card
    at a third of the well has 336px, and the block would scroll sideways inside
    itself: a slide with a horizontal scrollbar on it is a slide nobody can read
    the end of. At two terms a card has 528px and the example fits with room.

    Derived from the width rather than from the term count, so the rule still
    holds when this figure is handed half a slide.
  */
  const cardInner = width / n - 48
  const withExample = g.allExampled && cardInner >= 420

  const problems = [...g.problems]
  if (n > 3) {
    problems.push(
      `${n} glyph cards across ${width}px is ${Math.round(width / n)}px each; a 56px glyph plus a term needs about 300`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  return (
    <figure className={`mx-auto ${className}`} style={{ width }}>
      <div className="grid items-stretch gap-5" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {g.terms.map((t, i) => {
          const paint = toneOf(t.tone)
          return (
            <FcNodeIn key={t.id} at={i} shown={shown[i]} className="relative">
              <div
                className="flex h-full flex-col rounded-card p-6"
                style={cardSurface(paint, 'none')}
              >
                <div className="flex items-center gap-4">
                  <GlyphWell icon={t.icon} paint={paint} size={56} fallback={t.term} />
                  <span className="min-w-0">
                    <Term size="md">{t.term}</Term>
                    {t.gloss && <Gloss paint={paint}>{t.gloss}</Gloss>}
                  </span>
                </div>
                <span className="mt-4 block">
                  <Definition>{t.definition}</Definition>
                </span>
                {withExample && t.example && (
                  /* `mt-auto`: the example sits on the card's floor, so three
                     cards of unequal definition length still have their example
                     zones level with each other. */
                  <ExampleBlock
                    example={t.example}
                    note={t.exampleNote}
                    paint={paint}
                    className="mt-auto pt-4"
                  />
                )}
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
