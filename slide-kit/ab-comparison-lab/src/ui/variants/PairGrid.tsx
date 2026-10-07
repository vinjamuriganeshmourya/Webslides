import { FcEdgeLabel, FcNodeIn, useBeats } from './motion'
import { cellChars, resolveComparison, type ComparisonFigureProps } from './comparisonFigure'
import {
  Attribute,
  Cell,
  ProblemPanel,
  SetCaption,
  panelSurface,
  toneOf,
} from './comparisonChrome'
import { colors } from '@/design/tokens'

/**
 * PAIR GRID — each attribute becomes a small card holding both answers, and the
 * cards are laid across the frame instead of down it.
 *
 * THE ARGUMENT: IT TURNS THE SET NINETY DEGREES
 *
 * The other three variants are all vertical lists. A vertical list spends HEIGHT
 * on the number of attributes and WIDTH on the length of the answers, which is
 * exactly right when the answers are sentences and exactly wrong when they are
 * not.
 *
 * Six attributes whose answers are a word, a literal or a short phrase is a
 * common and specific shape: `list` against `tuple`, `GET` against `POST`, `let`
 * against `const`. On a spine that set is six rows tall, roughly 390px of figure,
 * carrying about twelve words, with 476px columns holding the word "Yes". The
 * height is spent on the count and the width is spent on nothing.
 *
 * Laid as three cards across and two down, the same six attributes use the width
 * they were being denied and the figure is two rows tall instead of six. It is
 * the only arrangement here that gets BETTER as the attribute count goes up,
 * which is the opposite of every other variant in the lab.
 *
 * WHY THE TWO ANSWERS STACK INSIDE THE CARD, AND WHAT THAT COSTS
 *
 * A 370px card cannot hold two side-by-side cells: 160px each is four words on
 * three lines. So the answers stack, and stacking breaks the one thing the other
 * three variants give for free, which is that the left column is always A.
 *
 * The fix is that **each answer carries its own side label**, in that side's
 * tone, at 11px. It is a repetition, six times over, and it is the same
 * justification `HeadToHead` gives for repeating the attribute: it is what makes
 * each card readable on its own. A reader who starts at the fifth card, which on
 * a grid is a thing that happens, is never left working out which line is which.
 *
 * WHY THE CARDS AND NOT JUST CELLS ON A GRID
 *
 * Without a boundary, a 3x2 grid of text blocks reads as six columns or as two
 * rows depending on which way the eye enters, and both readings are wrong: the
 * unit is the card. A hairline box is the cheapest thing that says "these four
 * pieces of text belong together and the ones next to them do not". Same
 * surface as `HeadToHead`'s panels, so the lab reads as one system.
 *
 * WHAT IT IS WORST AT
 *
 * **The answers are 41 characters, and that is the whole constraint.** A 370px
 * card has 338px inside it, which is about 41 characters of 16.5px Inter on one
 * line. The cap below is 45, allowing a short overhang, and past that the card
 * grows a line, every card in its row grows with it, and two rows of cards
 * overrun the well. Anything needing a clause belongs on `LabelBand`.
 *
 * Second, **a grid implies no order**, and sometimes the attributes have one. A
 * comparison that builds an argument across its rows loses that here, because
 * the reader chooses the path through a grid and there are six of them.
 */
export function PairGrid({
  a,
  b,
  rows,
  caption,
  width = 1152,
  className = '',
}: ComparisonFigureProps) {
  const g = resolveComparison({ a, b, rows })
  const n = g.rows.length

  /*
    NO SEPARATE HEADS ROW, so beat 0 is the first CARD.

    The side names live inside every card, which is what makes a card readable
    alone, so a heading row repeating them a seventh time would be the one piece
    of chrome on the figure that says nothing new. It also buys back the ~48px
    the second row of cards needs.
  */
  const CAPTION = n
  const shown = useBeats(CAPTION + 1)

  const COLS = 3
  const GAP = 20
  const card = Math.round((width - GAP * (COLS - 1)) / COLS)

  const problems = [...g.problems]

  if (n < 4) {
    problems.push(
      `${n} attributes; below four a grid has a hole in it, and a vertical list reads better anyway`,
    )
  }
  /*
    45 CHARACTERS, AND IT IS THIS VARIANT'S ENTIRE PRICE.

    A card is 370px with 32px of padding, so 338px of measure, which is about 41
    characters of 16.5px Inter. 45 allows a short overhang onto a second line
    without the grid deforming. Past that every card in the row grows, both rows
    grow with it, and the pair overruns the content well.
  */
  const over = g.rows.filter((r) => cellChars(r.a) > 45 || cellChars(r.b) > 45)
  for (const r of over) {
    problems.push(
      `"${r.attribute}" has a cell over 45 characters, which is two lines in a ${card}px card; this set wants LabelBand`,
    )
  }
  if (problems.length) return <ProblemPanel problems={problems} width={width} />

  const sides = [
    { side: a, paint: toneOf(a.tone), get: (r: (typeof g.rows)[number]) => r.a },
    { side: b, paint: toneOf(b.tone), get: (r: (typeof g.rows)[number]) => r.b },
  ]

  return (
    <figure className={`mx-auto ${className}`} style={{ width }}>
      {/* `pt-4` is the instructor-video clearance, same as every full-width
          figure in this lab. See the note in `AttributeSpine`. */}
      <div
        className="grid items-stretch pt-4"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: GAP }}
      >
        {g.rows.map((r, i) => {
          /* The pivot card's border. Always the `lead` stop, because the pivot
             is the frame's emphasis whichever side it favours. */
          const accent = toneOf('lead')
          return (
            <FcNodeIn key={r.id} at={i} shown={shown[i]} className="relative">
              <div
                className="flex h-full flex-col rounded-card px-4 py-4"
                style={{
                  ...panelSurface(colors.line, 'none'),
                  /* The pivot card takes a full tone border rather than the
                     wash the other variants use: a wash behind a card reads as
                     a shadow, and the card already has one. */
                  ...(r.pivot ? { border: `1.5px solid ${accent}` } : null),
                }}
              >
                <Attribute align="left">{r.attribute}</Attribute>
                <div className="mt-3">
                  {sides.map(({ side, paint, get }, s) => (
                    <div
                      key={side.id}
                      className={s === 1 ? 'mt-3 pt-3' : ''}
                      style={
                        s === 1 ? { borderTop: `1px solid ${colors.line}` } : undefined
                      }
                    >
                      {/*
                        THE SIDE LABEL, REPEATED IN EVERY CARD.

                        11px, semibold, uppercase, in the side's own tone. It is
                        the price of stacking the two answers, and it is what
                        lets a reader who enters at the fifth card know which
                        line is which without looking anywhere else.
                      */}
                      <span
                        className="block font-heading text-[11px] font-bold uppercase"
                        style={{ color: paint, letterSpacing: '0.06em', lineHeight: 1.4 }}
                      >
                        {side.label}
                      </span>
                      <span className="mt-0.5 block">
                        <Cell emphasis={Boolean(r.pivot)}>{get(r)}</Cell>
                      </span>
                    </div>
                  ))}
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
