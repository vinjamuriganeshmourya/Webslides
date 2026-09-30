import { colors } from '@/design/tokens'
import { FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { resolveDefinitions, type DefinitionFigureProps } from './definitionFigure'
import { Definition, ProblemPanel, SetCaption, toneOf } from './definitionChrome'

/**
 * BAND SPLIT — two zones per card. The term sits on a solid band in its own
 * tone, the definition sits on white underneath, and the boundary between them
 * is the point.
 *
 * THE ARGUMENT
 *
 * Every other variant here sets the term and the definition on the same ground,
 * which makes them one block of content with two type sizes. This one puts them
 * on different grounds, and that separation says something the type sizes cannot:
 * **the term is a label, and the definition is content.**
 *
 * Two things follow from it, and both are why this variant exists:
 *
 *   1. **A row of bands scans like an index.** The three coloured strips are at
 *      one height, one size and one baseline, so the room can read just the
 *      terms, left to right, without their eye being pulled down into the prose.
 *      No other variant here lets you read the terms alone; in `TermLede` the
 *      definition begins 12px under the word.
 *   2. **It is the only variant where the term cannot be crowded.** The band is
 *      its own zone, so a three-line definition grows the white zone downward and
 *      the term keeps exactly the space it had. In a single-ground card a long
 *      definition eventually forces the term down a size.
 *
 * WHITE ON A SOLID BAND, AND THE BAND IS SOLID
 *
 * No gradient. The style guide has `nw-gradient` and it is for a full-bleed
 * stage; a 44px strip carrying one word is too short a run for a gradient to
 * read as anything but a slightly uneven fill, which is how the sibling labs'
 * lit chips ended up looking like buttons. The gloss goes on the band too, in
 * white at 70%, because it is the term's own aside and it belongs in the term's
 * zone.
 *
 * WHAT IT IS WORST AT
 *
 * **It makes every term look equally important, loudly.** Three saturated bands
 * are three shouts, and the tone ramp's whole job, saying which of the three the
 * frame is actually about, is drowned by the fact that all three are painted. On
 * the fixture the `new` term is the deepest blue and the `contrast` term is teal,
 * and at a glance the row reads as "three coloured things" rather than "this one,
 * then these". `TermLede` and `GlyphAnchor` both state the difference better.
 *
 * Second, **a term that wraps ruins it.** The band's height comes from its
 * content, so a two-line term makes one band taller than the others and the row
 * of labels stops being a row. `resolveDefinitions` caps a term at 28 characters,
 * which is one line at 20px in a card a third of the well wide, so the guard is
 * this variant's guard even though it lives in the shared resolver.
 *
 * Third, **it has no room for an example**, for the same reason `TermLede` does
 * not: a tinted well inside the white zone would be a third ground on a card
 * whose argument is that it has two.
 */
export function BandSplit({
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
  if (n > 4) {
    problems.push(
      `${n} bands across ${width}px is ${Math.round(width / n)}px each; a band that holds one line of term needs about 240`,
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
                /* `overflow-hidden` is what lets the band sit flush into the
                   card's own 18px corners instead of a square strip inside a
                   rounded box, which was the first pass and looked like a bug. */
                className="flex h-full flex-col overflow-hidden rounded-card"
                style={{
                  background: colors.white,
                  border: `1px solid ${colors.line}`,
                  boxShadow: `0 10px 26px -18px ${colors.nwNavy}59`,
                }}
              >
                {/* ZONE ONE: the label. */}
                <div className="px-5 py-3.5" style={{ background: paint }}>
                  <span
                    className="block font-heading font-bold text-white"
                    style={{ fontSize: 20, lineHeight: 1.2, letterSpacing: '-0.01em' }}
                  >
                    {t.term}
                  </span>
                  {t.gloss && (
                    <span className="mt-0.5 block text-body-sm font-medium text-white/70">
                      {t.gloss}
                    </span>
                  )}
                </div>
                {/* ZONE TWO: the content. */}
                <div className="px-5 py-4">
                  <Definition>{t.definition}</Definition>
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
