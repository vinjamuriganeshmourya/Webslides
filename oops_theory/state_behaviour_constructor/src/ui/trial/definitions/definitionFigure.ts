import type { ReactNode } from 'react'

/**
 * ONE CONTRACT FOR EVERY DEFINITION-CARD FIGURE.
 *
 * Same principle as the sibling labs: it describes **meaning** and never
 * geometry, so picking a winner is a rename at the call site.
 *
 * WHY THIS LAB EXISTS
 *
 * "Here is a word, and here is what it means" is the second most frequent thing
 * a deck in this course does, after stating a set of points. Every session has
 * them: `image`, `container`, `volume`, `port` in session 1; `stage`, `gate`,
 * `pipeline` in session 7. And the kit has never designed for it. Today a
 * definition is written one of three ways, and all three are the absence of a
 * decision:
 *
 *   1. **A `BulletList` item**, with the term folded into the claim. The set then
 *      has no scannable left edge, and the term, the one string the learner has
 *      to carry out of the room, is set at the same weight as the prose around it.
 *   2. **A `Card` with `title`.** Closest to right, and it treats the term as a
 *      heading, which is a different thing: a heading names a section, a term is
 *      a thing being defined. It also has no place for the example, which for an
 *      operational term IS the definition.
 *   3. **A `DataTable` with two columns.** Used on 27 slides across 5 sessions,
 *      and some of those are a glossary that reached for the only structured
 *      thing available. A table says "these rows are data"; a definition is prose.
 *
 * WHY `term` AND `definition` ARE SEPARATE FIELDS, AND `example` IS A THIRD
 *
 * `PointsFigureProps` next door carries `label` (the claim) with an optional
 * `term`, because half its sets are plain claims. Here it is the other way
 * round: the term is mandatory and it is the subject, not a decoration on a
 * claim. Splitting them lets a variant align the terms down a gutter, put them
 * on a band, or set them at display size, and it stops the commonest authoring
 * failure outright: a definition that opens by repeating its own term
 * ("Polymorphism is when polymorphism..."), which the resolver reports.
 *
 * `example` is a third field rather than part of the definition because for a
 * whole class of terms it is not an illustration OF the definition, it is the
 * definition, and the prose is the caption. "Idempotent" is three sentences of
 * philosophy or one line of `PUT /users/7` twice. A contract that folded the
 * example into the body would force the second into prose.
 *
 * WHAT THIS LAB DOES DIFFERENTLY FROM ITS SIBLINGS: HEIGHT
 *
 * `points-lab`, `flowchart-lab` and `pseudocode-lab` all compute their stage
 * height in pixels from the fixture's longest string, and every one of them
 * states the arithmetic in its doc comment. That is right for a figure laid out
 * on an absolute stage, where a box's height has to be known before its
 * neighbours can be placed.
 *
 * It is the wrong tool here, and the requirement that says so is this lab's own:
 * **a definition card has to survive a one-line definition and a three-sentence
 * one without breaking.** An estimate from `label.length * 9.4` cannot promise
 * that, and every sibling lab's doc comment records a case where the estimate
 * was out. So these variants lay out in CSS grid and flex, with `items-stretch`
 * doing the equal-height work the browser is actually able to do, and the
 * resolver's job is to refuse content that would not fit rather than to guess how
 * tall it is.
 *
 * The sibling rule that DOES carry over is the one behind the arithmetic:
 * **padding is a floor, not a declaration.** Every card here declares its padding
 * in tokens and nothing subtracts from it, because nothing is fighting a fixed
 * height for room.
 */

/**
 * What a defined term IS, in paint.
 *
 * Deliberately narrower than the points lab's four-tone ramp. A definition is
 * not a claim, so there is no `risk` and no `good`: a term is not a warning and
 * it is not good news, it is a word. What varies is whether the room is meeting
 * it for the FIRST time, which is the one distinction that earns paint here.
 */
export type DefinitionTone = 'neutral' | 'new' | 'contrast'

export interface DefinedTerm {
  id: string
  /** The word being defined. One or two words. Never a phrase. */
  term: string
  /**
   * What it means, in the deck's own voice.
   *
   * One sentence or three. Every variant in this lab takes both, and the fixture
   * carries both on purpose, because a definition set with one of each is the
   * only thing that tests the layout.
   */
  definition: ReactNode
  /**
   * The short form the room says out loud: a synonym, a category, or the
   * five-word version. Set beside the term, never instead of it.
   */
  gloss?: string
  /**
   * The example, when the term is operational. Rendered in the mono face by the
   * variants that have room, so it must be literal: a snippet, a call, a URL,
   * two lines of pseudocode. Never a sentence.
   */
  example?: string
  /** One line saying what the example shows. Optional, and never the definition. */
  exampleNote?: string
  /** A name from the kit's icon set, for the glyph-led variants. */
  icon?: string
  tone?: DefinitionTone
}

export interface DefinitionFigureProps {
  terms: DefinedTerm[]
  /** One line under the set. Optional: most slides have a title already. */
  caption?: ReactNode
  /**
   * The width of the slot this figure is standing in.
   *
   * Same accommodation `PeerCards` and `RuleStack` were given after session 1 v3
   * hit it: these figures are built against a full 1152px content well, and a
   * `ContentSlide` that pairs a figure with a points column hands one about half
   * of that. Pass the width of the slot, and the variant divides it.
   */
  width?: number
  className?: string
}

export interface ResolvedDefinitions {
  terms: DefinedTerm[]
  /** Longest term and definition, in characters. */
  maxTerm: number
  maxDefinition: number
  /** True when every term carries the field, which some variants require. */
  allExampled: boolean
  allIconed: boolean
  allGlossed: boolean
  problems: string[]
}

/** Definitions may be `ReactNode`, and a node cannot be measured. Assume the worst. */
const NODE_CHARS = 260

const chars = (n: ReactNode | undefined): number =>
  n === undefined || n === null ? 0 : typeof n === 'string' ? n.length : NODE_CHARS

/**
 * Resolve once, so the variants disagree about geometry only.
 *
 * Every check below is an authoring mistake that renders as something
 * PLAUSIBLE, which is the only kind worth checking. A card with a 400-character
 * definition draws a card; it just cannot be read from the back of a room in the
 * twenty seconds an instructor spends on it, and nothing about the output says
 * so. The sibling labs learned this expensively: a figure that looks right and
 * teaches something false is worse than a figure that refuses.
 */
export function resolveDefinitions({
  terms,
}: Pick<DefinitionFigureProps, 'terms'>): ResolvedDefinitions {
  const problems: string[] = []

  if (terms.length === 0) problems.push('no terms, so there is nothing to define')

  /*
    THREE IS THE CAP FOR THE CARD VARIANTS, SIX FOR THE GRID, AND THE NUMBER IS
    A TEACHING ONE RATHER THAN A GEOMETRIC ONE.

    Every variant here can physically draw eight cards. Nobody can meet eight new
    words in one frame and carry any of them out of the room, and the deck's own
    rule is one idea per slide. Past six the honest edit is two slides. The
    per-variant limit is checked by the variant, because it is the variant's own
    geometry; six is the point at which no arrangement helps.
  */
  if (terms.length > 6) {
    problems.push(`${terms.length} terms; past six this is a glossary handout, so it is two slides`)
  }

  const seen = new Set<string>()
  for (const [i, t] of terms.entries()) {
    const n = i + 1

    if (seen.has(t.term.toLowerCase())) problems.push(`term ${n} repeats "${t.term}"`)
    seen.add(t.term.toLowerCase())

    /*
      A TERM IS A WORD, NOT A PHRASE. 28 characters is "Dependency Injection" with
      room to spare and "Cross Origin Resource Sharing" without. Past that the
      author is defining a topic, and every variant here either wraps it onto two
      lines or, on the band variant, pushes the band taller than the definition.
    */
    if (t.term.length > 28) {
      problems.push(`term ${n} is ${t.term.length} characters ("${t.term}"); a term is about 28`)
    }
    if (/[.!?]\s*$/.test(t.term)) {
      problems.push(`term ${n} ends in punctuation, so it is a sentence and not a term`)
    }

    /*
      THE DEFINITION MAY NOT OPEN BY SAYING THE TERM AGAIN.

      "Polymorphism is when polymorphism lets you..." is the single most common
      thing that gets written into a definition field, and it is invisible in
      review because it reads as fluent English. It also wastes the one line the
      room is going to read: the term is already set at display size two
      centimetres above it. This is the check that earns the split contract.
    */
    const def = typeof t.definition === 'string' ? t.definition : ''
    const firstWord = t.term.split(/\s+/)[0].toLowerCase()
    if (def && firstWord.length > 3 && def.toLowerCase().startsWith(firstWord)) {
      problems.push(
        `term ${n}'s definition opens by repeating "${t.term}"; the card already shows the word`,
      )
    }

    /*
      340 CHARACTERS IS ABOUT THREE SENTENCES AT SLIDE SCALE, which is the longest
      thing this lab claims to hold. It is a real ceiling and not a round number:
      the narrowest card in the set is `TermGrid`'s 640px definition column, and
      340 characters of 16px Inter wraps to four lines there, which is the last
      line count that still reads as a definition rather than as a paragraph.
    */
    if (chars(t.definition) > 340) {
      problems.push(
        `term ${n}'s definition is ${chars(t.definition)} characters; three sentences is about 340`,
      )
    }
    if (chars(t.definition) === 0) problems.push(`term ${n} has no definition`)

    /* An example is a literal, and a literal has no prose punctuation at the end.
       An author writing a sentence here wants `exampleNote`. */
    if (t.example && /[.]\s*$/.test(t.example.trim())) {
      problems.push(`term ${n}'s example ends in a full stop, so it is prose and not a literal`)
    }
    if (t.example && t.example.split('\n').length > 4) {
      problems.push(
        `term ${n}'s example is ${t.example.split('\n').length} lines; a card holds about four`,
      )
    }
    if (t.exampleNote && !t.example) {
      problems.push(`term ${n} has a note about an example it does not carry`)
    }
  }

  /*
    A HALF-FILLED FIELD IS THE MISTAKE, NOT AN EMPTY ONE.

    Three cards where two carry an icon and one does not reads as an edit somebody
    abandoned, and every variant here has to leave a hole for the missing third.
    All or none, and the resolver will not guess which was intended. Straight from
    `points-lab`, which found it the same way.
  */
  const count = (f: (t: DefinedTerm) => unknown) => terms.filter((t) => Boolean(f(t))).length
  for (const [field, n] of [
    ['an example', count((t) => t.example)],
    ['an icon', count((t) => t.icon)],
    ['a gloss', count((t) => t.gloss)],
  ] as const) {
    if (n > 0 && n < terms.length) {
      problems.push(`${n} of ${terms.length} terms carry ${field}; a set is all or none`)
    }
  }

  return {
    terms,
    maxTerm: Math.max(0, ...terms.map((t) => t.term.length)),
    maxDefinition: Math.max(0, ...terms.map((t) => chars(t.definition))),
    allExampled: terms.length > 0 && count((t) => t.example) === terms.length,
    allIconed: terms.length > 0 && count((t) => t.icon) === terms.length,
    allGlossed: terms.length > 0 && count((t) => t.gloss) === terms.length,
    problems,
  }
}
