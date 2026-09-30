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
 * SIDE PANEL — one box cut vertically into two grounds. The term is reversed out
 * of a solid tone panel on the left, the definition and its example sit on white
 * to the right, and the cut runs the full height of the card.
 *
 * THE BOX TREATMENT, AND HOW IT DIFFERS FROM `BandSplit`
 *
 * `BandSplit` already argues that two grounds say what two type sizes cannot:
 * the term is a LABEL and the definition is content. It is right, and it puts the
 * band across the top, which has one consequence it names as its own worst
 * feature and one it does not:
 *
 *   - A 44px band is a strip. Three of them in a row are three shouts of equal
 *     loudness, and the tone ramp's job of saying which term the frame is about
 *     drowns.
 *   - A horizontal band is sized by the term's line height, so it cannot hold
 *     anything else. The glyph has nowhere to go, and `BandSplit` renders none.
 *
 * Turning the cut ninety degrees fixes both. A panel is sized by the CARD's
 * height, not by the term's, so it has room for a glyph above the term and a
 * gloss under it, and the whole header becomes one painted object instead of a
 * strip with a word in it. And a panel is a third of the card rather than a tenth
 * of it, so at one or two terms the paint is a statement about that term rather
 * than a stripe every card happens to have.
 *
 * WHAT IT TAKES FROM SLIDE 2
 *
 * The reading order and the hierarchy, unchanged: glyph, then term, then gloss,
 * then definition, then example on the floor. Same `GlyphWell` at the same 72px.
 * Same sizes from the same ramp. Same `mt-auto` example floor, same tone ramp,
 * same timings, one click per card. What changes is only which ground each of
 * those things stands on.
 *
 * WHAT IT DOES DIFFERENTLY, AND WHY EACH
 *
 *   **The term reverses to white.** It is on its own paint, so `ink` is the
 *   wrong colour and white is the only legible one. This is the `invert` stop on
 *   the shared `Term`, added for exactly this: `BandSplit` needed the same thing
 *   and hand-rolled its own heading, which is a second place for the face, the
 *   weight and the tracking to drift.
 *
 *   **The glyph well reverses too**, by being handed white as its paint: an 8%
 *   white tint on the tone, with the icon in white. A tone-tinted well on a tone
 *   ground is invisible, and a white filled disc would outweigh the term beside
 *   it.
 *
 *   **The gloss goes to white at 72%.** `BandSplit` sets its gloss at 70% on the
 *   band for the same reason, and the reason is that a gloss is an aside: at full
 *   white it reads as a second line of the term.
 *
 * THE COUNTS, AND THE PANEL IS A DIFFERENT OBJECT AT EACH
 *
 * This is the variant where the count changes the design most, because the panel
 * is the part that does not scale.
 *
 * At **one term** the panel is 440px of a 1152px card: a real zone, holding the
 * glyph, the term at 28px and the gloss, with the definition getting a 600px
 * measure on white beside it, about 67 characters a line at 20px.
 *
 * At **two** the same third would be 188px, and 188 less 72 of padding is 116px
 * of inner width. "Race Condition" at 28px is 190px and wraps to two lines, at
 * which point one panel is taller than the other and the pair stops reading as a
 * pair. So the panel stops trying to hold the term: it becomes an 88px rail
 * carrying the glyph alone, the term moves onto the white beside it in `ink`, and
 * the card keeps the two-ground cut that is the whole point while giving the
 * prose the 424px it needs.
 *
 * That is the honest answer to a narrower card, and it is not a smaller version
 * of the wide one. A layout that only knows how to shrink would have kept the
 * term in a 116px panel and called the wrap a content problem.
 *
 * WHAT IT IS WORST AT
 *
 * **It is the loudest layout in the lab, and loud is a claim.** A third of the
 * card in saturated brand blue says this term is the frame, which is true when
 * the frame is introducing one word and false the moment there are two ordinary
 * ones side by side. At two terms with two different tones it reads as a
 * comparison whether or not one was meant, so a pair of unrelated definitions is
 * better served by `GlyphAnchorPair`.
 *
 * Second, **the panel is dead height when the definition is long.** The panel
 * stretches to the card, so a four-line definition gives a 440x319 block of paint
 * holding 150px of content, and 170px of it is empty colour. It is the price of
 * the full-height cut, and it is why the glyph sits at the top of the panel
 * rather than centred in it: centred, it drifts down as the prose beside it
 * grows, and two cards' glyphs end up at two heights.
 */
export function SidePanel({
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
  /*
    ONE OR TWO. At three, a card is 368px wide, so even the narrow rail form
    leaves 232px of measure once the rail and the paddings are taken: about 32
    characters a line, which sets the fixture's longest definition as eight lines.
    A two-ground card needs width to be two grounds with, and at a third of the
    well there is none to cut.
  */
  if (n > 2) {
    problems.push(
      `${n} panels across ${width}px is ${Math.round((width - 24 * (n - 1)) / n)}px each; an 88px rail then leaves about ${Math.round((width - 24 * (n - 1)) / n) - 136}px of measure, and a definition needs about 380`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  const solo = n === 1
  const GAP = 24
  /* The panel at one term is a zone; at two it is a rail. See the count note. */
  const PANEL = solo ? 440 : 88
  const PAD = solo ? 36 : 24
  const GLYPH = solo ? 72 : 56
  const DEF_MAX = solo ? 600 : undefined

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
                /* `overflow-hidden` is what lets the panel sit flush into the
                   card's 18px corners instead of a square block inside a rounded
                   box, which is the same fix `BandSplit` records for its band. */
                className="grid h-full items-stretch overflow-hidden rounded-card"
                style={{
                  ...cardSurface(paint, 'none'),
                  gridTemplateColumns: `${PANEL}px minmax(0, 1fr)`,
                }}
              >
                <div
                  className={solo ? '' : 'flex items-start justify-center'}
                  style={{ background: paint, padding: solo ? PAD : 16 }}
                >
                  {/* White as the well's paint: an 8% white tint on the tone,
                      icon in white. Handing it the tone would paint tone on tone. */}
                  <GlyphWell
                    icon={t.icon}
                    paint={colors.white}
                    size={GLYPH}
                    fallback={t.term}
                  />
                  {solo && (
                    <>
                      <span className="mt-5 block">
                        <Term size="lg" invert>
                          {t.term}
                        </Term>
                      </span>
                      {t.gloss && (
                        <span className="mt-1 block">
                          {/* White at 72%: an aside on paint, not a second line
                              of the term. */}
                          <Gloss paint={`${colors.white}B8`}>{t.gloss}</Gloss>
                        </span>
                      )}
                    </>
                  )}
                </div>

                <div className="flex h-full min-w-0 flex-col" style={{ padding: PAD }}>
                  {!solo && (
                    <>
                      <Term size="md">{t.term}</Term>
                      {t.gloss && (
                        <span className="mt-1 block">
                          <Gloss paint={paint}>{t.gloss}</Gloss>
                        </span>
                      )}
                    </>
                  )}
                  <span className={solo ? 'block' : 'mt-3.5 block'} style={{ maxWidth: DEF_MAX }}>
                    <Definition size={solo ? 'lg' : 'md'}>{t.definition}</Definition>
                  </span>
                  {t.example && (
                    <span className="mt-auto block" style={{ maxWidth: DEF_MAX }}>
                      <ExampleBlock
                        example={t.example}
                        note={t.exampleNote}
                        paint={paint}
                        className="pt-5"
                      />
                    </span>
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
