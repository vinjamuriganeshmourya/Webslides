import { colors } from '@/design/tokens'
import { FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { resolveDefinitions, type DefinitionFigureProps } from './definitionFigure'
import { Definition, Gloss, ProblemPanel, SetCaption, Term, toneOf } from './definitionChrome'

/**
 * TERM LEDE — no card at all. The term is the biggest thing on the slide and the
 * definition is set as prose under it, with a hairline between one term and the
 * next.
 *
 * THE ARGUMENT
 *
 * A definition is prose, and a box around prose adds nothing to it. What a box
 * DOES add is four borders, a shadow and 24px of padding on each side, and on a
 * three-term row that is 144px of the slide's width spent on the containers
 * rather than on the words. This variant spends all of it on the words, so the
 * definition gets the widest measure in the lab and the term gets to be set at
 * display size instead of at heading size.
 *
 * That is the real claim: **a term the room has to carry out of the door should
 * be the largest thing on the frame.** A card cannot do that, because a card
 * that is mostly one large word looks empty. Remove the card and the same word
 * at the same size reads as a title, which is what it is.
 *
 * The hairlines are load-bearing and they are the only chrome. Three columns of
 * type with nothing between them read as one paragraph in three pieces; a 1px
 * rule is enough to say "these are three separate things" without claiming they
 * are three objects. `colors.line` at 1px, the same rule `Card` and `DataTable`
 * use, so the frame belongs to the deck.
 *
 * WHAT IT IS WORST AT
 *
 * **It has nowhere to put an example.** The fixture carries one for all three
 * terms and this variant renders none of them: with no container there is no
 * inset zone to hold a mono snippet, and dropping a grey well into open prose
 * would reintroduce the box through the back door on the one variant whose
 * argument is not having one. Use `WorkedExample` when the example is the point.
 *
 * Second, **it cannot carry a glyph** for the same reason. There is no header
 * zone for one to anchor, and a 44px icon floating over open type reads as a
 * bullet.
 *
 * Third, and measured: **the definitions do not end level.** Cards in a row can
 * be stretched to equal height; three columns of prose cannot, so the 71-
 * character definition stops two lines above the 236-character one and the row
 * has a ragged bottom edge. It is the honest look for prose and it is still a
 * ragged edge, which is why the terms are top-aligned: at least the tops line up
 * on the thing the room is reading.
 *
 * GEOMETRY
 *
 * `grid-cols-<n>` across the passed width, hairline-divided, 28px of gutter
 * either side of each rule. The term steps down from 40px to 28px past one term,
 * because 40px only fits a 14-character term at a third of the well and the
 * fixture's longest is exactly 14: sizing for that is sizing for the fixture,
 * which is what `resolveDefinitions` guards at 28 characters.
 */
export function TermLede({
  terms,
  caption,
  width = 1152,
  className = '',
}: DefinitionFigureProps) {
  const g = resolveDefinitions({ terms })
  const n = g.terms.length

  /* Claimed before any early return: a hook behind a `ProblemPanel` appears and
     disappears with the props. */
  const CAPTION = n
  const shown = useBeats(CAPTION + 1)

  const problems = [...g.problems]
  /*
    THIS VARIANT'S OWN LIMIT. Three columns of prose at a third of the well is
    about 340px of measure, which holds the fixture's longest definition in four
    lines. A fourth column takes it to 250px and six lines, at which point the
    room is reading a column of a newspaper from twelve metres away.
  */
  if (n > 3) {
    problems.push(
      `${n} terms in open columns gives each about ${Math.round(width / n)}px of measure; past three this needs cards or a grid`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  return (
    <figure className={`mx-auto ${className}`} style={{ width }}>
      <div className="grid items-start" style={{ gridTemplateColumns: `repeat(${n}, 1fr)` }}>
        {g.terms.map((t, i) => {
          const paint = toneOf(t.tone)
          return (
            <FcNodeIn
              key={t.id}
              at={i}
              shown={shown[i]}
              className="relative"
              style={{
                paddingLeft: i === 0 ? 0 : 28,
                paddingRight: i === n - 1 ? 0 : 28,
                borderLeft: i === 0 ? undefined : `1px solid ${colors.line}`,
              }}
            >
              {/* The tone is a short rule over the term rather than an edge on a
                  box, because there is no box. It is the one mark this variant
                  allows itself. */}
              <span
                aria-hidden
                className="mb-4 block rounded-pill"
                style={{ width: 40, height: 3, background: paint }}
              />
              <Term size={n === 1 ? 'xl' : 'lg'}>{t.term}</Term>
              {t.gloss && (
                <span className="mt-1.5 block">
                  <Gloss paint={paint}>{t.gloss}</Gloss>
                </span>
              )}
              <span className="mt-3 block">
                <Definition>{t.definition}</Definition>
              </span>
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
