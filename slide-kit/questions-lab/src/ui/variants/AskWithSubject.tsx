import { SlideBase } from '@/ui/SlideBase'
import { AskIn } from './motion'
import { resolveAsk, type AskFigureProps } from './askFigure'
import {
  AskKicker,
  paintOf,
  ProblemPanel,
  Qualifier,
  Stem,
  SubjectPanel,
} from './askChrome'

/**
 * ASK WITH SUBJECT — the question, and the thing it is about, on one frame.
 *
 * THIS IS THE VARIANT IN TENSION WITH HARD CONTENT RULE 16, AND THE TENSION IS
 * THE POINT OF INCLUDING IT.
 *
 * Rule 16 is unambiguous: a question slide carries the question and nothing else,
 * no bullets, no figure, no callout, and if a slide genuinely needs supporting
 * content it is a `ContentSlide` whose lead ends in a question mark. That rule is
 * right about what it was written about, and what it was written about is a
 * question slide with the ANSWER'S SUPPORTING MATERIAL on it: things to read
 * instead of thinking.
 *
 * "What does this print" is a different shape, and the difference is not a
 * loophole:
 *
 *   **The panel is not support for the question, it is the question's SUBJECT.**
 *   Remove the six lines of code and there is no question left, only the word
 *   "this" with no referent. A callout under a question is optional; this is not.
 *
 *   **It cannot be read instead of thinking.** The failure rule 16 prevents is a
 *   room reading the answer off the frame. The room can read every line of this
 *   panel and still not know what happens, because what happens is not written
 *   anywhere on it. That is the test worth applying: can the answer be READ off
 *   the frame, not is there anything else on it.
 *
 *   **The alternative is worse, and it is the thing the kit does today.** The
 *   code goes on the slide before, the question goes on a bare frame after it,
 *   and the room answers a question about a file it can no longer see. It gets
 *   one of two things wrong: the detail it half-remembers, or the question.
 *
 * SO THIS VARIANT IS A PROPOSAL TO AMEND RULE 16, NOT AN EXCEPTION TO IT. The
 * amendment it proposes: a question frame may carry the artefact the question is
 * about, at most one, capped, and never anything that bears on the answer. The
 * lab's `CLAUDE.md` states the version to be signed off if this one wins.
 *
 * THE CEILINGS ARE WHAT KEEPS THAT HONEST
 *
 * A proposal to loosen a hard rule is worth nothing without the thing that stops
 * it becoming "a question slide may have content on it", so `resolveAsk` refuses
 * a subject past six lines or 54 characters a line, and this variant refuses one
 * that is missing. Those numbers are the amendment. Past them the frame is a
 * `ContentSlide` and rule 16 is simply correct.
 *
 * THE SIDE-BY-SIDE, AND WHY IT IS NOT A STACK
 *
 * Stacking the panel under the question is the obvious layout, it keeps the whole
 * frame inside the lab's shared 840px cap, and it is wrong. Stacked, the panel is
 * the thing the eye lands on last and the question is a heading over it, which is
 * exactly the shape of a `ContentSlide`: a claim at the top and its support
 * underneath. Side by side, the two are peers, which is what they are.
 *
 * The question column is fixed at 560 and the panel hugs its own longest line up
 * to 488, and the ORDER those were decided in is the point. The panel is not
 * given a column, it STATES one: its longest line at a measured 8.0px plus
 * padding, and there is no smaller number, because it does not wrap and a
 * narrower one scrolls sideways inside itself. The question takes a fixed column
 * because a question CAN be given a narrower one and simply run to another line.
 * A layout where both halves are negotiable is a layout where the one that cannot
 * move gets squeezed anyway.
 *
 * IT IS THE ONLY VARIANT HERE THAT BREAKS THE LAB'S 840px CAP
 *
 * MEASURED on the fixture: 560 plus a 44px gutter plus a 266px panel is 870, so
 * from x=64 the block ends at x=934, which is 30px past the cap and 21px inside
 * the instructor video rectangle's x range. At the resolver's 54-character ceiling
 * the panel is 466 and the block ends at x=1134, which is 221px inside it and
 * 82px short of the content well's own right edge.
 *
 * It is legal at either width only because the block is vertically centred and
 * short enough to sit well under the rectangle's y=220 floor.
 *
 * That is a real fragility and it is stated here rather than discovered later:
 * every other frame in this lab is legal at any height, and this one is legal at
 * the height it currently is. A question that grows to five lines, or a panel
 * that grows past six, pushes the block upward from its own centre. Six lines is
 * the ceiling the resolver enforces, and that ceiling is now load-bearing for
 * more than readability. `video-safe.mjs` is the check, and it has to be re-run
 * for this variant specifically whenever the fixture changes.
 *
 * WHAT IT IS WORST AT
 *
 * **The question is the smallest in the lab**, at 32px against `QuietField`'s 48,
 * because it is sharing the frame. On a projector at the back of a long room that
 * is the difference between reading the question and reading the code, and the
 * code is bigger relative to its own normal size than the question is.
 *
 * Second, **it only works when there is a subject.** Handed the shared fixture it
 * refuses outright rather than degrading, and the refusal is deliberate: a
 * two-column frame with one empty column is worse than any single-column frame,
 * and silently collapsing to one column would make this variant a worse
 * `QuietField` wearing the same name.
 */

/**
 * THE PANEL'S CEILING, NOT ITS WIDTH. IT HUGS ITS OWN LONGEST LINE.
 *
 * MEASURED: the mono face sets at **8.4px per character at 14px**. The resolver's
 * ceiling is 54 characters a line, so a panel at the ceiling needs 454px of text
 * plus its own px-4 padding on both sides, which is 486. 488 is that with two
 * pixels of slack, and it is a `maxWidth`.
 *
 * IT WAS 8.0 AND 466 UNTIL THE STAGE STARTED ZOOMING. `SlideStage` now fits the
 * canvas with CSS `zoom` rather than `transform: scale()`, which is what stopped
 * the deck rendering soft on a projector, and `.slide-stage` carries
 * `text-rendering: geometricPrecision` so the layout is identical at every zoom.
 * Unrounded advances are slightly wider than hinted ones: 8.4 against 8.0, which
 * is 5%, which is 22px across a 54-character line. The old 466 would now scroll
 * at the ceiling. This is content rule 9, chase the dependents, arriving from an
 * unexpected direction: a rendering fix moved a measured constant three
 * directories away, and `measure.mjs` is what caught it.
 *
 * THE FIRST PASS MADE IT A FIXED WIDTH AND THE RENDER SAID NO. The fixture's
 * longest line is 29 characters, so a fixed 488px panel drew a 278px panel's
 * worth of code and 210px of empty panel, which does not read as a file with short lines in it. It
 * reads as a box that failed to fill, and a broken-looking box is worse on this
 * frame than on any other, because this is the variant arguing that its extra
 * panel is justified.
 *
 * So the panel is `fit-content` capped at 466, and the cost is stated rather than
 * hidden: **two of these frames in one deck will have panels of different
 * widths**, because each hugs its own code. That is a real inconsistency and it
 * is the better of the two, since the frames are separated by other slides and
 * nobody compares them side by side, while the empty third of a panel is visible
 * on the one frame it is on.
 *
 * What is NOT adjustable is the cap. The panel does not wrap, by design, because
 * a snippet that wraps has stopped being readable as code; so a panel narrower
 * than its longest line does not set smaller, it scrolls sideways inside itself,
 * and a slide with a horizontal scrollbar is a slide nobody can read the end of.
 */
const PANEL_MAX = 488
/**
 * The question's column, which is what the panel and the gutter left over.
 *
 * MEASURED, twice, and the second measurement is the one worth keeping. At 430
 * the fixture came out in five lines, in a 430px column, which read as a narrow
 * grey paragraph rather than as a question. At 500 it was STILL five: the column
 * was wide enough on the arithmetic, 29 characters a line against the 28.5
 * needed, and then the actual word breaks fell at 410 to 464px inside a 500px
 * column, so the slack went into the ragged edge rather than into a line. That is
 * the gap between a character-count estimate and a render, and it is why every
 * sibling lab's doc comment records one.
 *
 * 560 is four lines. Four is the floor for this frame and `askChrome` says why:
 * three lines at this measure would need 28px type, which is smaller than the
 * deck's own body text, and a question set smaller than the body around it has
 * stopped being the thing on the slide.
 */
const STEM_COL = 560
/** The gutter. 44 is the smallest gap at which the two read as two columns rather
    than as a panel that failed to clear the text. */
const GUTTER = 44

export function AskWithSubject({
  kicker,
  question,
  qualifier,
  subject,
  ordinal,
  tone,
  className = '',
}: AskFigureProps) {
  const a = resolveAsk({ question, qualifier, subject, ordinal })
  const paint = paintOf(tone)

  const problems = [...a.problems]
  if (!subject) {
    problems.push(
      'this frame is the question next to the thing it is about, and there is no subject to show',
    )
  }
  if (problems.length || !subject) {
    return (
      <SlideBase variant="light">
        <ProblemPanel problems={problems} />
      </SlideBase>
    )
  }

  return (
    <SlideBase variant="light" className={className}>
      {/* Pinned at the frame's datum, x=64 and y=48, like every variant here.
          See the note in `SpotlightAsk`. */}
      <AskIn at={0}>
        <AskKicker ordinal={ordinal} paint={paint}>
          {kicker}
        </AskKicker>
      </AskIn>

      {/* `data-align-exempt`: the air under the block is the pause, not tail
          drift. See the named opt-out in `align-check.mjs`. */}
      <div
        data-align-exempt="centred"
        className="relative z-10 flex flex-1 items-center"
        style={{ gap: GUTTER }}
      >
        <div className="shrink-0" style={{ width: STEM_COL }}>
          <AskIn at={1}>
            <Stem size="sm">{a.question}</Stem>
          </AskIn>
          {a.qualifier && (
            <AskIn at={2} className="mt-7">
              <Qualifier paint={paint}>{a.qualifier}</Qualifier>
            </AskIn>
          )}
        </div>

        {/*
          THE PANEL LANDS WITH THE QUESTION, NOT AFTER IT.

          One beat later in the stagger, which is 130ms and is reading order
          rather than sequence. It is emphatically NOT a build step, and this is
          the frame where that decision costs the most and matters the most: the
          obvious move is to show the question, let the room read it, then bring
          the code in. That gives the room 20 seconds with a question containing
          the word "this" and nothing for "this" to point at, so they answer a
          question the frame has not asked yet. `motion.tsx` makes the general
          argument; this is the case that proves it.
        */}
        <AskIn at={2} className="shrink-0" style={{ maxWidth: PANEL_MAX }}>
          <SubjectPanel subject={subject} />
        </AskIn>
      </div>
    </SlideBase>
  )
}
