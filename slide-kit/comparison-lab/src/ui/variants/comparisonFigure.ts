import type { ReactNode } from 'react'

/**
 * ONE CONTRACT FOR EVERY A-VS-B FIGURE.
 *
 * Same principle as the sibling labs: it describes **meaning** and never
 * geometry, so picking a winner is a rename at the call site.
 *
 * WHY THIS LAB EXISTS
 *
 * "Here are two things, and here is how they differ" is everywhere in this
 * course: `docker run` against `docker compose up`, a bind mount against a
 * volume, `let` against `const`, a list against a tuple. Today every one of them
 * is written as a two-column `DataTable`, or as two `Card`s side by side, and
 * both are the absence of a decision.
 *
 * The `DataTable` is the closer one and it is still wrong: a table says "these
 * rows are data", and a comparison is an argument. The two `Card`s are worse,
 * for the reason below, and they are the commoner choice because they look
 * better in review.
 *
 * WHY THE CONTRACT IS ROWS OF ATTRIBUTES AND NOT TWO LISTS
 *
 * This is the finding the whole lab turns on, and it is the thing none of the
 * dozen reference sources says.
 *
 * **Two independent columns cannot be compared row-wise.** Every comparison
 * template in the wild draws option A's bullets in the left box and option B's
 * in the right and calls the result a comparison. Nothing guarantees that A's
 * third bullet and B's third bullet are about the same thing, and the moment the
 * two texts differ in length they stop sharing a line. The reader is being asked
 * to hold one list in memory while scanning the other, which is exactly the work
 * the figure was supposed to do for them.
 *
 * So the unit here is the **attribute**, not the option. A row is one question
 * asked of both subjects, and the contract cannot express a dangling point that
 * belongs to only one side. That is a real constraint and it is the point: a
 * claim that applies to only one of the two is not a comparison, it is a fact
 * about that one, and it belongs in prose or in a `simdiff` figure with a
 * three-region contract that can say "only A".
 *
 * WHY THERE IS NO `recommended` FLAG
 *
 * Every reference source has one. Deckary: *"bold the column for the recommended
 * option"*, *"use a 60/40 split to emphasize the recommended option"*. That is
 * advice for a sales deck, where the slide exists to move the reader toward a
 * purchase.
 *
 * A lecture comparing two commands is usually recommending neither: it is
 * teaching that they are different and when each applies. Emphasis is available
 * through `tone: 'lead'` on one side, it is off by default, and the resolver
 * refuses both sides carrying it, because two leads is no lead. A kit-wide
 * default of "highlight the winner" would have every comparison figure in every
 * deck quietly arguing for something the author never decided.
 *
 * HEIGHT IS CSS, NOT ARITHMETIC
 *
 * Same departure `definitions-lab` made and for the same reason. A comparison row
 * has to survive a two-word cell beside a two-line one, and an estimate from
 * `label.length * 9.4` cannot promise that. These variants lay out in CSS grid
 * with `items-stretch`, and the resolver's job is to refuse content that will not
 * fit rather than to guess how tall it is.
 *
 * The sibling rule that does carry over: **padding is a floor, not a
 * declaration.** Nothing subtracts from a declared padding, because nothing is
 * fighting a fixed height for room.
 */

/**
 * What a side IS, in paint.
 *
 * Three stops, and deliberately not `definitions-lab`'s three. There a term is a
 * word and the only question is whether the room is meeting it for the first
 * time. Here the two sides exist to be told apart, so the ramp is about
 * opposition:
 *
 *   `neutral`   an ordinary side. Brand blue.
 *   `contrast`  the other one. Teal, the style guide's secondary, so the pair
 *               reads as two things rather than as two weights of one thing.
 *   `lead`      the side this frame is arguing for. Deepest brand blue. Opt-in,
 *               never defaulted, and only one side may carry it.
 *
 * No `good` and no `risk`. A comparison is not a verdict: `docker run` is not
 * the bad one. When a slide genuinely IS weighing something, the figure for that
 * is `proscons-lab`'s, whose contract carries a verdict and whose tones are
 * valenced on purpose.
 */
export type ComparisonTone = 'neutral' | 'contrast' | 'lead'

export interface ComparisonSide {
  id: string
  /** What the thing is called. One or two words, the way it is typed or said. */
  label: string
  /** The five-word version, set beside the label. Never instead of it. */
  gloss?: string
  /** A name from the kit's icon set. All sides or none. */
  icon?: string
  tone?: ComparisonTone
}

export interface ComparisonRow {
  id: string
  /**
   * The question this row asks of both sides.
   *
   * A noun phrase, not a sentence and not a claim: "Startup cost", "Survives a
   * restart", "Who writes it". The attribute is the spine of the figure, and it
   * has to be short enough to sit in a gutter between two columns.
   */
  attribute: string
  /** What the left side's answer is. */
  a: ReactNode
  /** What the right side's answer is. */
  b: ReactNode
  /**
   * The one row the frame is actually about, if there is one.
   *
   * At most one row per figure. It is how a slide says "they differ in four
   * ways and this is the one that matters" without the other three having to
   * shrink.
   */
  pivot?: boolean
}

export interface ComparisonFigureProps {
  a: ComparisonSide
  b: ComparisonSide
  rows: ComparisonRow[]
  /** One line under the set. Optional: most slides have a title already. */
  caption?: ReactNode
  /**
   * The width of the slot this figure is standing in.
   *
   * Same accommodation the sibling labs give: these are built against a full
   * 1152px content well, and a `ContentSlide` pairing a figure with a points
   * column hands one about half of that. Pass the width, and the variant divides
   * it.
   */
  width?: number
  className?: string
}

export interface ResolvedComparison {
  a: ComparisonSide
  b: ComparisonSide
  rows: ComparisonRow[]
  /** Longest attribute and longest cell, in characters. */
  maxAttribute: number
  maxCell: number
  /** True when both sides carry the field, which some variants require. */
  allIconed: boolean
  allGlossed: boolean
  /** The pivot row's index, or -1. */
  pivotAt: number
  problems: string[]
}

/** Cells may be `ReactNode`, and a node cannot be measured. Assume the worst. */
const NODE_CHARS = 120

/**
 * Exported because a variant applies its OWN cell ceiling against its own
 * measure, and it has to count the same way the shared resolver does.
 */
export const cellChars = (n: ReactNode | undefined): number =>
  n === undefined || n === null ? 0 : typeof n === 'string' ? n.length : NODE_CHARS

const chars = cellChars

/**
 * Resolve once, so the variants disagree about geometry only.
 *
 * Every check below is an authoring mistake that renders as something
 * PLAUSIBLE, which is the only kind worth checking. A comparison with seven rows
 * draws seven rows; it just stops being an argument and becomes a specification
 * sheet, and nothing about the output says so.
 */
export function resolveComparison({
  a,
  b,
  rows,
}: Pick<ComparisonFigureProps, 'a' | 'b' | 'rows'>): ResolvedComparison {
  const problems: string[] = []

  if (rows.length === 0) problems.push('no rows, so there is nothing being compared')

  /*
    SIX IS THE CAP, AND THE NUMBER IS A TEACHING ONE RATHER THAN A GEOMETRIC ONE.

    Every variant here can physically draw ten rows. Deckary puts the readable
    limit for a two-column comparison at "3-6 criteria" and its decision-matrix
    guidance at "4-8", and both are written for a reader holding a mouse and a
    printout. In a room, past six rows nobody is comparing any more, they are
    reading a table, and the deck's own rule is one idea per slide.

    Past six the honest edit is to cut the rows that do not separate the two
    sides, which is almost always most of them.
  */
  if (rows.length > 6) {
    problems.push(
      `${rows.length} rows; past six this is a specification sheet, so it is fewer rows or two slides`,
    )
  }

  if (a.label.trim().toLowerCase() === b.label.trim().toLowerCase()) {
    problems.push('both sides have the same label, so there is nothing to tell apart')
  }

  for (const [which, side] of [
    ['a', a],
    ['b', b],
  ] as const) {
    /*
      A SIDE IS A NAME, NOT A DESCRIPTION. 24 characters holds "docker compose up"
      and "Class Component" comfortably. Past that the author is describing the
      option rather than naming it, and the description belongs in `gloss`, which
      is set smaller and does not have to fit in a column header.
    */
    if (side.label.length > 24) {
      problems.push(
        `side ${which} is ${side.label.length} characters ("${side.label}"); a side is named in about 24`,
      )
    }
    if (side.label.trim().length === 0) problems.push(`side ${which} has no label`)
  }

  /*
    TWO LEADS IS NO LEAD.

    `lead` is the one way this contract lets a slide argue for a side, and it
    works by being the only painted thing on the frame. Both sides carrying it
    paints the whole figure and says nothing, which is the failure it exists to
    prevent.
  */
  if (a.tone === 'lead' && b.tone === 'lead') {
    problems.push('both sides are marked lead; the emphasis only reads when one side has it')
  }

  const seen = new Set<string>()
  let pivotAt = -1
  let pivots = 0

  for (const [i, r] of rows.entries()) {
    const n = i + 1

    if (seen.has(r.attribute.toLowerCase())) problems.push(`row ${n} repeats "${r.attribute}"`)
    seen.add(r.attribute.toLowerCase())

    /*
      AN ATTRIBUTE IS A QUESTION, NOT A CLAIM. 32 characters holds "Survives a
      container restart". Past that it is a sentence, and a sentence in the
      gutter turns the spine into a third column of prose, which is the one thing
      `AttributeSpine` cannot afford: the gutter is 200px.
    */
    if (r.attribute.length > 32) {
      problems.push(
        `row ${n}'s attribute is ${r.attribute.length} characters ("${r.attribute}"); it is a question, and a question is about 32`,
      )
    }
    if (/[.!?]\s*$/.test(r.attribute)) {
      problems.push(`row ${n}'s attribute ends in punctuation, so it is a sentence and not a label`)
    }

    /*
      A ROW WITH ONE SIDE EMPTY IS NOT A COMPARISON.

      It is the commonest thing authors reach for when a point applies to only one
      option, and it renders as a perfectly tidy row with a blank cell, which
      reads as an oversight rather than as a claim. What it actually means is
      "only A has this", and the figure for that is a three-region
      similarities-and-differences layout, not this one.
    */
    if (chars(r.a) === 0 || chars(r.b) === 0) {
      problems.push(
        `row ${n} ("${r.attribute}") is empty on one side; a claim about only one of the two is not a comparison`,
      )
    }

    /*
      140 IS THE LOOSEST CEILING IN THE LAB, AND EACH VARIANT TIGHTENS IT.

      The shared resolver's job is to refuse what NO arrangement here can hold;
      the per-variant limit belongs to the variant, because it is the variant's
      own geometry. Straight from `definitions-lab`, where the shared cap is 340
      characters and `TermGrid` applies its own 120.

      140 is the widest measure any variant offers: `LabelBand` puts a cell on a
      552px column, which is about 67 characters of 16.5px Inter per line, so 140
      is two lines with a little room. Past that no arrangement in this lab holds
      it in two lines and a cell has become a paragraph.

      `AttributeSpine` checks its own 110 against its 476px half-column, and
      `PairGrid` checks 60 against its 312px card.
    */
    if (chars(r.a) > 140 || chars(r.b) > 140) {
      problems.push(
        `row ${n} ("${r.attribute}") has a cell over 140 characters; a cell is a phrase, not a paragraph`,
      )
    }

    if (r.pivot) {
      pivots += 1
      pivotAt = i
    }
  }

  /*
    ONE PIVOT, OR NONE.

    The pivot exists so a slide can say "and this is the one that matters". Two
    pivots is two of those, which is a slide that has not decided, and three is
    an unpainted figure with extra steps.
  */
  if (pivots > 1) {
    problems.push(`${pivots} rows are marked pivot; at most one row is the one that matters`)
  }

  /*
    A HALF-FILLED FIELD IS THE MISTAKE, NOT AN EMPTY ONE.

    One side with an icon and the other without reads as an edit somebody
    abandoned, and every variant has to leave a hole where the missing one goes.
    All or none. Straight from `points-lab`, which found it the same way.
  */
  const iconed = [a, b].filter((s) => Boolean(s.icon)).length
  if (iconed === 1) problems.push('one side carries an icon and the other does not; it is both or neither')
  const glossed = [a, b].filter((s) => Boolean(s.gloss)).length
  if (glossed === 1) problems.push('one side carries a gloss and the other does not; it is both or neither')

  return {
    a,
    b,
    rows,
    maxAttribute: Math.max(0, ...rows.map((r) => r.attribute.length)),
    maxCell: Math.max(0, ...rows.flatMap((r) => [chars(r.a), chars(r.b)])),
    allIconed: iconed === 2,
    allGlossed: glossed === 2,
    pivotAt,
    problems,
  }
}
