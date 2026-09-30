import { colors } from '@/design/tokens'
import { iconByName } from '@/ui/icons'
import { FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { resolveDefinitions, type DefinitionFigureProps } from './definitionFigure'
import {
  Definition,
  ExampleBlock,
  Gloss,
  ProblemPanel,
  SetCaption,
  Term,
  toneOf,
} from './definitionChrome'

/**
 * TAB FRAME — the term leaves the box. It sits on a solid tone tab straddling
 * the frame's top border, and what is left inside the frame is only the
 * definition and the thing itself.
 *
 * THE BOX TREATMENT, WHICH IS THE THING BEING PROPOSED HERE
 *
 * Every other card in this lab holds the term and its definition in one
 * container, and then has to spend paint, type size or a second ground on saying
 * which is which. This one does not have to: the term is not in the container.
 * It is the container's LABEL, set on the boundary, the way a legend sits on a
 * fieldset or a tab on a folder. Nothing inside the frame has to be told apart
 * from anything else inside the frame, because there is only one kind of thing
 * in there.
 *
 * That is what pays for the two features the frame has and the cards do not:
 *
 *   1. **The body can be a two-column layout.** With the header gone from the
 *      frame's inside, one definition on a 1152px frame can put the prose in one
 *      column and the example in another instead of stacking them, which is the
 *      only arrangement in the lab that lets a single definition and a three-line
 *      example come to 255px of height. `GlyphAnchorSolo` stacks them in a column
 *      and needs 329.
 *   2. **The frame reads as open.** A 2px tone border with no shadow and no
 *      accent edge is a boundary rather than a surface. It does not pretend to be
 *      a thing that could be picked up, which is the failure the lab records
 *      against the sibling labs' four-layer cards, and next to a `GlyphAnchor`
 *      card on the previous slide it is visibly a different kind of object rather
 *      than the same card with different paint.
 *
 * WHAT IT TAKES FROM SLIDE 2
 *
 * The glyph and the term stay a unit, in that order, with the glyph first: the
 * recognition argument is slide 2's and it holds anywhere the two sit together.
 * The gloss stays in the tone under them. The definition is the same component
 * at the same sizes, and the example is the same `ExampleBlock` well. The tone
 * ramp and the timings are unchanged, and it is still one click per card.
 *
 * WHAT IT DOES DIFFERENTLY, AND WHY EACH
 *
 *   **The glyph has no well.** Inside a card a glyph needs a tinted tile to stop
 *   it reading as a stray mark next to the prose. On the tab it is already on
 *   paint, with the term beside it, and a tile on a tab is a box inside a box.
 *   So it is a bare white icon at the same 0.46 ratio `GlyphWell` uses, which
 *   keeps it the same size relative to the term as it is on slide 2.
 *
 *   **The frame has no shadow and a 2px tone border**, where every card in the
 *   lab has a 1px `line` hairline and a soft neutral shadow. The border is the
 *   only structure this layout has, so it has to be visible enough to be read as
 *   a boundary at the back of a room, and a shadow under an open frame is a
 *   surface effect on something that is explicitly not a surface.
 *
 *   **The term reverses to white**, through the shared `Term`'s `invert` stop,
 *   because it is on its own paint. Same reason as `SidePanel`.
 *
 * THE COUNTS
 *
 * At **one term** the frame is the full 1152px and the body is two columns: the
 * definition at 20px on a 539px measure, a hairline, then the example in a 460px
 * column. The example does not need to be floored with `mt-auto` here, because it
 * is beside the prose rather than under it, which is the only place in the lab
 * where that is true.
 *
 * At **two** the frames are 564px each and the body goes back to one column: 508
 * px is not two columns, and the example needs 405 of it on its own. The tab
 * shrinks with the frame, 56px to 48 and the term from 28px to 22, so the label
 * stays proportional to the box it is labelling rather than becoming the largest
 * thing on the slide twice over.
 *
 * WHAT IT IS WORST AT
 *
 * **A tab is a corner, so it is asymmetric, and two of them in a row read as a
 * sequence.** Two frames side by side with a tab on each top-left corner look
 * like step one and step two of something, which is a relationship the layout is
 * asserting for free. A pair that is genuinely a pair rather than a progression
 * is better in `GlyphAnchorPair`, whose cards are symmetrical.
 *
 * Second, **the tab's width is the term's width**, so it is the one layout here
 * where a long term changes the shape of the box's chrome rather than its
 * content. At the 28-character ceiling the tab runs to about 380px, which is a
 * third of a full-width frame and starts to read as a title bar rather than as a
 * label.
 *
 * Third, **it wants an example.** With the term outside and no glyph well
 * inside, a frame holding only a gloss and four lines of prose is a rectangle
 * with a paragraph in it, and `TermLede` says that with no rectangle at all.
 */
export function TabFrame({
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
    ONE OR TWO. At three, a frame is 368px and the tab has to carry a glyph plus
    the term inside it: "Race Condition" at even 18px is 125px, so the tab is
    about 200px of a 368px frame and the label stops looking like a label. The
    body is then 312px of measure, eight lines of the fixture's longest
    definition, under a piece of chrome that is over half the width of its own box.
  */
  if (n > 2) {
    problems.push(
      `${n} frames across ${width}px is ${Math.round((width - 24 * (n - 1)) / n)}px each; a tab carrying a glyph and a term needs about 200, and a label that wide is a title bar`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  const solo = n === 1
  const GAP = 24
  const TAB = solo ? 56 : 48
  const PAD_X = solo ? 40 : 28
  const EXAMPLE_COL = 460

  return (
    <figure className={`mx-auto ${className}`} style={{ width }}>
      <div
        className="grid items-stretch"
        style={{ gridTemplateColumns: `repeat(${n}, 1fr)`, gap: GAP }}
      >
        {g.terms.map((t, i) => {
          const paint = toneOf(t.tone)
          const Icon = t.icon ? iconByName[t.icon as keyof typeof iconByName] : undefined
          /* Two columns only when there is a second thing to put in the second
             column. A 539px definition beside 460px of nothing is worse than a
             full-width one. */
          const twoCol = solo && Boolean(t.example)
          return (
            <FcNodeIn
              key={t.id}
              at={i}
              shown={shown[i]}
              className="relative"
              /*
                THE OVERHANG IS RESERVED ON THE WRAPPER, AS PADDING. Half the tab
                is above the frame, and a top margin on the frame itself collapses
                straight through this wrapper, which has no border or padding of
                its own: the wrapper moves down, its height never grows, and the
                frame hangs past the bottom of the figure and over the set caption.
                `MedallionPlate` records the same fix and the same symptom.
              */
              style={{ paddingTop: TAB / 2 }}
            >
              <div
                className="relative h-full rounded-card"
                style={{
                  background: colors.white,
                  /* A boundary, not a surface: 2px of tone at 32%, and no shadow.
                     See the note above. */
                  border: `2px solid ${paint}52`,
                }}
              >
                <span
                  className="absolute inline-flex items-center rounded-pill"
                  style={{
                    top: -TAB / 2,
                    left: PAD_X,
                    height: TAB,
                    paddingLeft: solo ? 22 : 18,
                    paddingRight: solo ? 24 : 20,
                    gap: solo ? 12 : 10,
                    background: paint,
                    color: colors.white,
                  }}
                >
                  {Icon ? (
                    <Icon
                      width={Math.round(TAB * 0.46)}
                      height={Math.round(TAB * 0.46)}
                    />
                  ) : (
                    <span
                      className="font-heading font-bold leading-none"
                      style={{ fontSize: Math.round(TAB * 0.42) }}
                    >
                      {t.term.slice(0, 1).toUpperCase()}
                    </span>
                  )}
                  <Term size={solo ? 'lg' : 'md'} invert>
                    {t.term}
                  </Term>
                </span>

                <div
                  /*
                    `items-stretch` in the two-column case, so the rule between
                    the columns runs the body's full height and the example can
                    centre itself against the prose. Top-aligned, the example's
                    spare height all pooled at the bottom of its column against a
                    full-height rule, which read as a column that had run out
                    rather than as a column with less in it.
                  */
                  className={twoCol ? 'grid items-stretch' : 'flex h-full flex-col'}
                  style={{
                    paddingTop: solo ? 52 : 44,
                    paddingLeft: PAD_X,
                    paddingRight: PAD_X,
                    paddingBottom: solo ? 44 : 28,
                    ...(twoCol
                      ? {
                          gridTemplateColumns: `minmax(0, 1fr) 1px ${EXAMPLE_COL}px`,
                          columnGap: 36,
                        }
                      : null),
                  }}
                >
                  <div className="min-w-0">
                    {t.gloss && (
                      <span className="mb-2.5 block">
                        <Gloss paint={paint}>{t.gloss}</Gloss>
                      </span>
                    )}
                    <Definition size={solo ? 'lg' : 'md'}>{t.definition}</Definition>
                  </div>

                  {twoCol && t.example && (
                    <>
                      <span
                        aria-hidden
                        className="block h-full"
                        style={{ background: colors.line }}
                      />
                      <div className="flex min-w-0 flex-col justify-center">
                        <ExampleBlock example={t.example} note={t.exampleNote} paint={paint} />
                      </div>
                    </>
                  )}

                  {!twoCol && t.example && (
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
