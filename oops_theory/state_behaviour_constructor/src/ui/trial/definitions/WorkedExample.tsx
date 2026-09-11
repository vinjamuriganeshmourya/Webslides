import { colors } from '@/design/tokens'
import { FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { resolveDefinitions, type DefinitionFigureProps } from './definitionFigure'
import {
  cardSurface,
  Definition,
  ExampleBlock,
  Gloss,
  ProblemPanel,
  SetCaption,
  Term,
  toneOf,
} from './definitionChrome'

/**
 * WORKED EXAMPLE — full-width rows, each split into the words on the left and
 * the thing itself on the right.
 *
 * THE ARGUMENT
 *
 * For a whole class of terms the example is not an illustration OF the
 * definition, it IS the definition, and the prose is a caption. "Idempotent" is
 * either three sentences of philosophy or it is `PUT /users/7` twice with the
 * same response, and the room understands the second one first. Same for a race
 * condition: two threads reading 100 and one write vanishing is the concept;
 * "interleaved operations produce a lost update" is a sentence you can recite
 * without understanding.
 *
 * So this is the only variant that gives the example real estate rather than
 * whatever is left over, and the reason it is the ROW variant rather than a card
 * variant is arithmetic, not taste. An `ExampleBlock` is mono at 13.5px and does
 * not wrap. The fixture's longest example line is 50 characters, which needs about
 * 405px. A third of the content well is 384px, so in a three-card row the example
 * has to scroll sideways inside its own box, and a slide with a horizontal
 * scrollbar is a slide nobody reads the end of. A full-width row hands the example
 * 45% of 1152px, which is 518px, and it fits with 100px spare.
 *
 * THE SPLIT IS 55/45 AND THE PROSE GETS THE LARGER HALF
 *
 * Not 50/50, and not the other way round. The prose column carries a term at
 * 22px, a gloss and up to three lines of definition; the example carries two or
 * three mono lines and a note. Sized evenly, the definition wrapped to four lines
 * beside an example that had 100px of empty space to its right, which reads as
 * the example being padded out.
 *
 * THE GLOSS RIDES ON THE TERM'S LINE, AND THAT IS A HEIGHT DECISION
 *
 * Every other variant in this lab puts the gloss on its own line under the term.
 * Here it sits inline, after the term, separated by a middot. The reason is
 * measured: three rows with the gloss on its own line came to 512px against a
 * 440px content well, and `ContentSlide` centres its body, so the figure
 * overflowed at BOTH ends. It printed over the slide's own lead and pushed the
 * caption under the control bar. Inline, the same three rows are 415px.
 *
 * The trade is real and it is the right way round: the gloss is the least of the
 * three fields, and a row that fits is worth more than a gloss on its own line.
 *
 * WHAT IT IS WORST AT
 *
 * **It is the tallest variant in the lab, and three rows is the ceiling.**
 * Measured, after the fixes above: 415px for three rows against a 440px well,
 * which is 25px of headroom, and a fourth row is 553px and does not fit at all.
 * The honest edit at four terms is two slides. `resolveDefinitions` will not
 * catch it, because four terms is legal for every other variant here, so this
 * variant refuses it itself.
 *
 * Second, **it demands an example for every term, and most sets do not have
 * one.** A row whose right half is empty is worse than a card: the split is the
 * layout, so a missing example leaves a visible hole rather than a shorter card.
 * The shared resolver refuses a half-filled field, and this variant additionally
 * refuses a set with no examples at all, because then it is `RuleStack` with
 * different type.
 *
 * Third, **it cannot be scanned.** Three stacked full-width rows are read one at
 * a time, top to bottom, which is right for three worked examples and wrong for
 * three terms the room is meant to compare. Comparison is a horizontal act; use
 * `BandSplit` or `GlyphAnchor`.
 */
export function WorkedExample({
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
    THIS VARIANT'S TWO OWN LIMITS, both of them the kind that render as something
    plausible: four rows draws four rows and simply runs off the bottom of the
    frame, and an exampleless set draws rows with an empty right half that looks
    like a figure still loading.
  */
  if (!g.allExampled) {
    problems.push(
      'no examples on this set, and the example is this variant\'s whole argument; use GlyphAnchor or BandSplit',
    )
  }
  if (n > 3) {
    problems.push(
      `${n} rows at about 138px each is ${n * 138 + (n - 1) * 12}px, and a slide's content well is about 440; this is two slides`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  return (
    <figure className={`mx-auto ${className}`} style={{ width }}>
      <div className="flex flex-col gap-2">
        {g.terms.map((t, i) => {
          const paint = toneOf(t.tone)
          return (
            <FcNodeIn key={t.id} at={i} shown={shown[i]} className="relative">
              <div
                className="grid items-start gap-7 rounded-card px-5 py-3"
                /* 55/45: the prose carries more words than the example carries
                   characters. See the note above. */
                style={{ ...cardSurface(paint, 'left'), gridTemplateColumns: '1.22fr 1fr' }}
              >
                <div>
                  {/* The term and its gloss on one line: see the height note. */}
                  <span className="flex flex-wrap items-baseline gap-2">
                    <Term size="md">{t.term}</Term>
                    {t.gloss && (
                      <span className="flex items-baseline gap-2">
                        <span aria-hidden style={{ color: colors.muted }}>
                          ·
                        </span>
                        <Gloss paint={paint}>{t.gloss}</Gloss>
                      </span>
                    )}
                  </span>
                  <span className="mt-2 block">
                    <Definition size="sm">{t.definition}</Definition>
                  </span>
                </div>
                {t.example && (
                  <ExampleBlock example={t.example} note={t.exampleNote} paint={paint} />
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
