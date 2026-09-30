import { colors } from '@/design/tokens'
import { FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { resolveDefinitions, type DefinitionFigureProps } from './definitionFigure'
import { Definition, ProblemPanel, SetCaption, toneOf } from './definitionChrome'

/**
 * TERM GRID — a compact two-column grid of term-and-definition rows, hairline
 * separated, for the frame that has to carry five or six words at once.
 *
 * THE ARGUMENT
 *
 * The other four variants are all wrong about the same slide. A recap near the
 * end of a session says "here are the six words you met today", and every card
 * variant answers it with six cards, which is either six cards at 190px each or
 * two rows of three at 100px tall. The first is unreadable and the second is a
 * grid of cards pretending not to be a grid.
 *
 * So this variant drops the card entirely and keeps only the two things a dense
 * set actually needs: **a scannable left edge for the terms, and one hairline per
 * row.** The term sits in a fixed 150px gutter so all the terms in a column share
 * a left AND a right edge, which is what lets the eye run down the column reading
 * only the words. The definition starts at the same x in every row, so the prose
 * is a column too rather than a ragged block.
 *
 * The 2-up arrangement is the whole reason it fits. Six rows stacked full width
 * is six lines of prose at 1000px of measure, which is a page of a book; six rows
 * in two columns is three rows per column at 420px of measure, which is a
 * glossary. Reading order is down the left column then down the right, stated by
 * `grid-flow-col` rather than left by the browser to infer.
 *
 * WHY THE TONE IS A DOT AND NOT AN EDGE
 *
 * At this density a 4px accent edge per row is twelve coloured marks on one
 * frame, and the frame is a recap: nothing on it is being introduced, so nothing
 * needs emphasis. A 6px dot beside the term is enough to carry a `new` or a
 * `contrast` for the one or two rows that have one, and disappears on the rest.
 *
 * **THE DOT'S COLUMN IS RESERVED WHETHER OR NOT THERE IS A DOT.** The first pass
 * rendered it inline, so a term with a tone started 14px right of a term without
 * one, and the terms in a column no longer shared a left edge. That is not a
 * blemish on this variant, it is the destruction of the one thing it has: the
 * whole argument is a scannable left edge, and two of the six terms were indented
 * out of it. An empty 14px slot on the neutral rows costs nothing and keeps it.
 *
 * WHAT IT IS WORST AT
 *
 * **It is a handout, and the deck's own rule is one idea per slide.** Six
 * definitions on one frame is six ideas, and this variant makes that look
 * deliberate and tidy, which is exactly what makes it dangerous: it is the
 * easiest way in this lab to ship a slide nobody can absorb. It is legitimate for
 * a RECAP of terms the room has already met one at a time, and it is wrong for
 * introducing anything. The caption on slide five says so on the slide.
 *
 * Second, **there is no room for an example, a glyph or a gloss**, and it does
 * not render them even when the set carries them. At 420px of measure and 15px
 * type, adding a third field per row is how a glossary becomes unreadable.
 *
 * Third, **it cannot hold a long definition.** 340 characters, which the shared
 * resolver allows, is six lines in this column and makes one row twice the height
 * of its neighbours. This variant's own guard is tighter: 120 characters, which is
 * two lines, and the glossary fixture's longest is 62.
 */
export function TermGrid({
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
    THE TERM GUTTER IS 170px, MEASURED FROM THE LONGEST TERM THIS LAB ALLOWS.

    It was 150, and "Race Condition" wrapped onto two lines in it, which made the
    first row of the column half again as tall as the two under it: 14 characters
    of 17px Sora bold is about 131px, plus the reserved 14px dot slot is 145, and
    150 left five pixels for the letter-spacing to eat.

    170 holds a 16-character term with the dot slot, which is the practical
    ceiling here; `resolveDefinitions` allows 28 characters, and a term that long
    belongs in a card variant where it can have a line of its own.
  */
  /* One column up to three terms, two past that. Four terms in one column is
     four full-width rows, which is `WorkedExample`'s shape without its reason. */
  const cols = n > 3 ? 2 : 1
  const rows = Math.ceil(n / cols)

  const problems = [...g.problems]
  for (const [i, t] of g.terms.entries()) {
    const len = typeof t.definition === 'string' ? t.definition.length : 260
    /*
      TIGHTER THAN THE SHARED CEILING, AND DELIBERATELY SO. The resolver allows
      340 characters because a card can hold four lines of it. This column is
      420px wide at 15px, so 120 characters is two lines and 340 is six, which
      makes one row twice the height of the row beside it and breaks the only
      thing this variant has: rows that scan.
    */
    if (len > 120) {
      problems.push(
        `term ${i + 1}'s definition is ${len} characters; a grid row holds about 120, so this set wants cards`,
      )
    }
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  return (
    <figure className={`mx-auto ${className}`} style={{ width }}>
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, auto)`,
          /* Down the first column, then down the second. Stated, not inferred. */
          gridAutoFlow: 'column',
          columnGap: 40,
        }}
      >
        {g.terms.map((t, i) => {
          const paint = toneOf(t.tone)
          /* The first row of each column carries no rule above it. */
          const firstInColumn = i % rows === 0
          return (
            <FcNodeIn
              key={t.id}
              at={i}
              shown={shown[i]}
              className="relative"
              style={{
                borderTop: firstInColumn ? undefined : `1px solid ${colors.line}`,
                paddingTop: firstInColumn ? 0 : 14,
                paddingBottom: 14,
              }}
            >
              <div className="grid items-baseline gap-4" style={{ gridTemplateColumns: '170px 1fr' }}>
                <span className="flex items-baseline">
                  {/* The tone, at recap weight: a dot, and only where it means
                      something. `neutral` draws an empty slot of the same width,
                      so every term in the column keeps one left edge. */}
                  <span aria-hidden className="flex w-3.5 shrink-0 items-baseline">
                    {t.tone && t.tone !== 'neutral' && (
                      <span
                        className="shrink-0 rounded-full"
                        style={{ width: 6, height: 6, background: paint, marginBottom: 3 }}
                      />
                    )}
                  </span>
                  <span
                    className="font-heading font-bold"
                    style={{ color: colors.ink, fontSize: 17, lineHeight: 1.3 }}
                  >
                    {t.term}
                  </span>
                </span>
                <Definition size="sm">{t.definition}</Definition>
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
