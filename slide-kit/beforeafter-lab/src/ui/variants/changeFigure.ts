import type { ReactNode } from 'react'
import { iconByName } from '@/ui/icons'

/**
 * ONE CONTRACT FOR EVERY BEFORE-AND-AFTER FIGURE.
 *
 * Second of the six comparison labs. `comparison-lab` is the sibling to read
 * first: this contract is deliberately shaped against it, and the differences
 * are the whole reason it is a separate lab rather than two more variants over
 * there.
 *
 * WHY THIS IS NOT `comparison-lab` WITH DIFFERENT LABELS
 *
 * An A-vs-B figure has two SUBJECTS. A before-and-after figure has one subject
 * at two TIMES, and everything follows from that:
 *
 *   1. **It is directional.** `docker run` does not become `docker compose up`,
 *      so a comparison must never draw an arrow between its two sides.
 *      "Deploying by hand" does become "deploying from a pipeline", so this one
 *      must. The arrow is the contract, not decoration.
 *   2. **The two sides are not equals.** In a comparison, symmetry is honest:
 *      neither option is the answer. Here the after state is where the room is
 *      being taken, and a layout that gives both states identical weight has
 *      said "two states, pick one", which is a comparison.
 *   3. **A row can carry a delta.** "40 minutes" against "6 minutes" has a
 *      third fact in it that neither cell states, and the delta field is where
 *      it goes.
 *
 * WHY THE BEFORE STATE IS MUTED AND NOT RED
 *
 * Every template house paints this figure green and red. Linia's colour-coded
 * variant is explicit about it: *"Red (release) vs. Green (adopt)"*.
 *
 * In a lecture that is usually a lie, and an expensive one. The before state is
 * generally not WRONG. It is earlier, or simpler, or what you do before you know
 * about the better tool, and half the time it is what the previous slide taught.
 * Painting it red says the last lesson was a mistake.
 *
 * So `muted` is the default and the only way to get `risk` on a before state is
 * to pass `beforeWasBroken`, which is a claim the author makes on purpose. The
 * resolver refuses the paint without the claim.
 *
 * HEIGHT IS CSS, NOT ARITHMETIC
 *
 * Same as both siblings. These variants lay out in CSS grid and flex, and the
 * resolver's job is to refuse content that will not fit rather than to guess how
 * tall it is.
 */

/**
 * What a state IS, in paint.
 *
 *   `muted`  the before state, and the default. Grey ground, body text. It is
 *            not being criticised, it is being left behind.
 *   `brand`  the after state, and its default. Brand blue, white surface, the
 *            weight on the frame.
 *   `risk`   the before state WAS broken, and the slide is saying so. Requires
 *            `beforeWasBroken` on the props.
 */
export type PhaseTone = 'muted' | 'brand' | 'risk'

export interface Phase {
  id: string
  /**
   * What this state is called.
   *
   * Not "Before" and "After" where a real name exists. "Deploying by hand" and
   * "Deploying from a pipeline" tell the room what changed; "Before" and "After"
   * make them read the cells to find out.
   */
  label: string
  /** The five-word version, beside the label. */
  gloss?: string
  /**
   * One line about the state AS A WHOLE, rather than about any one dimension.
   *
   * This is what `StateArrow` is built around: the sentence that captures what
   * kind of thing this state was. "A deploy is an event someone schedules"
   * against "a deploy is a consequence of merging" is the entire lesson, and no
   * row of the table contains it.
   */
  note?: ReactNode
  icon?: string
  tone?: PhaseTone
}

export interface ChangeRow {
  id: string
  /**
   * What changed. A noun phrase, not a sentence: "How long it takes", "Who can
   * do it", "Where the config lives".
   */
  dimension: string
  before: ReactNode
  after: ReactNode
  /**
   * The size of the change, as a literal.
   *
   * `-34 min`, `3 steps to 1`, `x12`. Never a sentence and never a claim: it is
   * the arithmetic the two cells imply and do not state. Optional, because most
   * dimensions do not have one, and the resolver refuses a set where only some
   * rows carry it for the same reason the sibling labs do.
   */
  delta?: string
}

export interface ChangeFigureProps {
  before: Phase
  after: Phase
  /**
   * The middle phase, for the change that has one.
   *
   * Linia calls this the *"meaningful middle phase: an implementation period"*,
   * and it is real: a migration has a during, where both states are live at
   * once. Optional, and the resolver refuses it without rows, because a middle
   * phase with nothing in it is a decoration that claims a stage exists.
   */
  during?: Phase
  rows?: ChangeRow[]
  /**
   * The author asserting that the before state was genuinely broken, which
   * unlocks `tone: 'risk'` on it.
   *
   * It is a separate flag rather than just letting the tone be set, because the
   * paint is the claim and the claim should be made once, deliberately, at the
   * call site, where a reviewer can see it.
   */
  beforeWasBroken?: boolean
  caption?: ReactNode
  width?: number
  className?: string
}

export interface ResolvedChange {
  before: Phase
  after: Phase
  during?: Phase
  rows: ChangeRow[]
  maxDimension: number
  maxCell: number
  allDelta: boolean
  bothNoted: boolean
  problems: string[]
}

const NODE_CHARS = 120

export const cellChars = (n: ReactNode | undefined): number =>
  n === undefined || n === null ? 0 : typeof n === 'string' ? n.length : NODE_CHARS

const chars = cellChars

/**
 * Resolve once, so the variants disagree about geometry only.
 *
 * Every check is an authoring mistake that renders as something PLAUSIBLE. The
 * first one below is the reason this resolver exists at all.
 */
export function resolveChange({
  before,
  after,
  during,
  rows = [],
  beforeWasBroken,
}: Pick<ChangeFigureProps, 'before' | 'after' | 'during' | 'rows' | 'beforeWasBroken'>): ResolvedChange {
  const problems: string[] = []

  if (rows.length === 0 && !before.note && !after.note) {
    problems.push('nothing describes the change: no rows, and neither state carries a note')
  }

  /*
    FIVE ROWS, NOT THE COMPARISON LAB'S SIX.

    A comparison can honestly run to six rows because the reader is weighing two
    options and more evidence helps. A transformation with six named dimensions
    is not one change, it is a project plan, and the room will remember none of
    it. The deck's own rule is one idea per slide and the idea here is the
    change, not its inventory.
  */
  if (rows.length > 5) {
    problems.push(
      `${rows.length} dimensions; past five this is a project plan rather than a change, so it is fewer or two slides`,
    )
  }

  if (before.label.trim().toLowerCase() === after.label.trim().toLowerCase()) {
    problems.push('both states have the same label, so nothing is shown to have changed')
  }

  /*
    THE BEFORE STATE IS MUTED UNLESS THE AUTHOR SAYS IT WAS BROKEN.

    See the note at the top. This is the check that stops a deck teaching that
    everything it showed last week was a mistake.
  */
  if (before.tone === 'risk' && !beforeWasBroken) {
    problems.push(
      'the before state is painted as a risk without `beforeWasBroken`; earlier is not the same as wrong',
    )
  }
  if (after.tone === 'risk') {
    problems.push('the after state is painted as a risk; that is a change nobody should be making')
  }
  if (after.tone === 'muted' && before.tone !== 'muted') {
    problems.push('the after state is muted and the before state is not, which draws the change backwards')
  }

  for (const [which, p] of [
    ['before', before],
    ['after', after],
    ...(during ? ([['during', during]] as const) : []),
  ] as const) {
    if (p.label.length > 28) {
      problems.push(
        `the ${which} state's label is ${p.label.length} characters ("${p.label}"); a state is named in about 28`,
      )
    }
    if (p.label.trim().length === 0) problems.push(`the ${which} state has no label`)
    /*
      AN ICON NAME THAT IS NOT IN THE KIT'S SET RENDERS AS NOTHING.

      Found the way everything in these labs gets found, by looking at the
      screenshot: this lab's own fixture asked for `unlock`, the house set has
      `lock` and `unlink` and no `unlock`, and the before panel simply drew no
      glyph. The head still laid out correctly, the text was all real, the box was
      the right size, and all three harnesses passed it. A missing glyph on one of
      two panels reads as an abandoned edit, which is the same failure the
      all-or-none checks exist for, arriving through a typo instead.
    */
    if (p.icon && !(p.icon in iconByName)) {
      problems.push(
        `the ${which} state asks for the icon "${p.icon}", which is not in the kit's set, so it would draw nothing`,
      )
    }
    if (chars(p.note) > 120) {
      problems.push(
        `the ${which} state's note is ${chars(p.note)} characters; it is one line about the whole state, which is about 120`,
      )
    }
  }

  if (during && rows.length === 0) {
    problems.push('a middle state with no rows claims a stage exists and then says nothing about it')
  }

  const seen = new Set<string>()
  for (const [i, r] of rows.entries()) {
    const n = i + 1

    if (seen.has(r.dimension.toLowerCase())) problems.push(`row ${n} repeats "${r.dimension}"`)
    seen.add(r.dimension.toLowerCase())

    if (r.dimension.length > 32) {
      problems.push(
        `row ${n}'s dimension is ${r.dimension.length} characters ("${r.dimension}"); it is a label, and a label is about 32`,
      )
    }
    if (/[.!?]\s*$/.test(r.dimension)) {
      problems.push(`row ${n}'s dimension ends in punctuation, so it is a sentence and not a label`)
    }

    if (chars(r.before) === 0 || chars(r.after) === 0) {
      problems.push(
        `row ${n} ("${r.dimension}") is empty on one side; a state that did not exist before is still a state`,
      )
    }

    /*
      A ROW WHERE NOTHING CHANGED IS THE FAILURE THIS FIGURE IS FOR.

      It draws perfectly. Two cells, a tidy arrow between them, and the same
      words on both sides, which the room reads as "this also changed" because
      the figure's entire frame says change. It is the single most plausible
      mistake in a before-and-after table and no harness will ever see it: every
      box is in the frame and the text is real.

      Compared case-insensitively on trimmed strings, so it catches the copy-paste
      that causes it rather than only the exact duplicate.
    */
    const b = typeof r.before === 'string' ? r.before.trim().toLowerCase() : null
    const a = typeof r.after === 'string' ? r.after.trim().toLowerCase() : null
    if (b && a && b === a) {
      problems.push(
        `row ${n} ("${r.dimension}") says the same thing on both sides, so it is not part of the change`,
      )
    }

    if (chars(r.before) > 110 || chars(r.after) > 110) {
      problems.push(
        `row ${n} ("${r.dimension}") has a cell over 110 characters; a cell is a phrase, not a paragraph`,
      )
    }

    /*
      A DELTA IS ARITHMETIC, NOT A CLAIM.

      "-34 min" is the number the two cells imply. "Much faster now" is an
      opinion wearing a number's clothes, and it is what gets typed here when the
      author does not have the number. 16 characters is `3 steps to 1` with room.
    */
    if (r.delta) {
      if (r.delta.length > 16) {
        problems.push(
          `row ${n}'s delta is ${r.delta.length} characters ("${r.delta}"); a delta is a literal, and a literal is about 16`,
        )
      }
      /*
        A DELTA MUST CONTAIN A DIGIT, AND THAT IS THE CHECK THAT ACTUALLY WORKS.

        The first version refused a trailing full stop or more than three words,
        and "much faster now" walked straight through both: three words, no
        punctuation, fifteen characters. It rendered as a neat green pill that
        looked exactly like a measurement, which is the precise failure the field
        exists to prevent and is worse than no chip at all, because a pill in the
        delta column is read as a number whatever it says.

        Requiring a digit is the honest test. A delta is the arithmetic the two
        cells imply; if the author cannot produce a number, the field comes off.
      */
      if (!/\d/.test(r.delta)) {
        problems.push(
          `row ${n}'s delta ("${r.delta}") has no number in it; a delta is the arithmetic the two cells imply, not a verdict`,
        )
      }
      if (/[.!?]\s*$/.test(r.delta.trim()) || r.delta.trim().split(/\s+/).length > 3) {
        problems.push(`row ${n}'s delta reads as prose; it is the arithmetic the two cells imply`)
      }
    }
  }

  const deltas = rows.filter((r) => Boolean(r.delta)).length
  /*
    A HALF-FILLED FIELD IS THE MISTAKE, NOT AN EMPTY ONE, with ONE exception,
    and the exception is this field.

    The sibling labs refuse a set where some items carry an optional field and
    others do not, because the hole reads as an abandoned edit. A delta is
    different: most dimensions genuinely have no number, and demanding one for
    "Who can do it" is how a deck ends up with `x1.4` next to a claim about
    people. So a partial set is allowed, and only an EMPTY delta string is
    refused, since that is the abandoned edit.
  */
  for (const [i, r] of rows.entries()) {
    if (r.delta !== undefined && r.delta.trim() === '') {
      problems.push(`row ${i + 1} has an empty delta; leave the field off instead`)
    }
  }

  return {
    before,
    after,
    during,
    rows,
    maxDimension: Math.max(0, ...rows.map((r) => r.dimension.length)),
    maxCell: Math.max(0, ...rows.flatMap((r) => [chars(r.before), chars(r.after)])),
    allDelta: rows.length > 0 && deltas === rows.length,
    bothNoted: Boolean(before.note && after.note),
    problems,
  }
}
