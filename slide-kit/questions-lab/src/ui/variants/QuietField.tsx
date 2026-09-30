import { SlideBase } from '@/ui/SlideBase'
import { AskIn } from './motion'
import { resolveAsk, type AskFigureProps } from './askFigure'
import { AskKicker, paintOf, ProblemPanel, Qualifier, Stem } from './askChrome'

/**
 * QUIET FIELD — the question at display size on the deck's ordinary ground, with
 * no card, no mark and no device of any kind.
 *
 * THIS IS THE CONTROL, AND EVERY COMPARISON NEEDS ONE.
 *
 * The other three variants each spend something to mark the pause: a whole dark
 * ground, a third of the canvas, or a second panel. None of those costs is
 * knowable without a frame that spends nothing, so this one exists to answer the
 * question the lab is actually asking, which is not "which device is best" but
 * "does a question frame need a device at all".
 *
 * It is a real candidate and not a straw man. Read it as the strongest form of
 * the argument against the other three.
 *
 * THE ARGUMENT
 *
 * Rule 16 says a question slide carries the question and nothing else, and every
 * other frame in this lab meets that rule by putting the question in a container
 * and then arguing that the container is not content. This one meets it
 * literally. The room sees a sentence, at a size nothing else in the deck is set
 * at, on the ground it has been reading all session, and there is nothing to look
 * at instead of thinking.
 *
 * That last clause is the whole of it. A card has an edge, a corner radius and a
 * shadow; a 520px mark has a shape; a code panel has six lines in it. Each is
 * something the eye can go to while the brain avoids the question, and a room
 * looking for somewhere to put its attention that is not the question will find
 * one.
 *
 * WHY THE TYPE IS THE LARGEST IN THE LAB
 *
 * `xl`, 48px, is only available to this variant, and it is available because
 * nothing else is competing for the canvas. The other three set the same sentence
 * at 40, 36 and 32, and the reason is arithmetic rather than taste: every one of
 * them has given part of the frame away.
 *
 * It is also the only stop in the lab that deliberately BUYS a fourth line. The
 * other three are sized to land the fixture in three, because a frame that is
 * also carrying a ground, a mark or a panel cannot afford a wall of type. This
 * one has nothing else to afford, so it spends the room on size, which is the
 * only thing it has to spend it on.
 *
 * THE RISK THIS VARIANT CARRIES, WHICH IS WHY THE KIT HAS A CARD
 *
 * `QuestionSlide`'s own note records it: the first version of that type was a
 * centred sentence on an empty canvas, and on a projector it read as an
 * unfinished slide rather than as a deliberate pause. Nothing on screen said
 * "this frame is a different kind of frame". The card was added to fix exactly
 * that, and this variant is the argument that the card was the wrong fix.
 *
 * Two things say deliberate here instead, and neither is a container:
 *
 *   **The kicker, pinned at the frame's own datum** at x=64, y=48, carrying the
 *   concept and the ordinal. A slide that failed to render does not number
 *   itself. This is the piece `QuestionSlide` does not have at the datum, because
 *   it folds its kicker into the card.
 *
 *   **The type size.** 48px appears nowhere else in a session deck; a content
 *   slide's title is 34, the large one is 44, and a lead is 22. A sentence at
 *   48px on an empty frame is not a slide that lost its bullets, because bullets
 *   are never that size.
 *
 * Whether those two are enough is the thing to look at on the render, and it is
 * the single most useful judgement this lab is asking for.
 *
 * WHAT IT IS WORST AT
 *
 * **The sixth question in a deck.** This is the frame's real ceiling and it is
 * the ceiling the whole lab was opened over. A device that never varies stops
 * being read, and this variant has no device to vary: six of these in one session
 * are six pale frames with a sentence on them, and by the fourth the room has
 * stopped registering that a question is being asked at all. The other three can
 * at least be alternated. This one can only be repeated.
 *
 * Second, **it is the frame most easily mistaken for a heading.** Give it a short
 * question and generous air and it is visually indistinguishable from a section
 * divider on the light ground, which is a frame that asks for nothing.
 */

/** Shared across the lab: content from x=64 capped at 840 ends at x=904, clear of
    the video rectangle at x=913 at any height. See the note in `SpotlightAsk`. */
const MEASURE = 840

/**
 * 800, NOT THE FULL 840, AND IT IS THE ONLY DELIBERATE NARROWING IN THE LAB.
 *
 * MEASURED. The first pass narrowed to 760 and set the question at 52px, on the
 * reasoning that a shorter measure gives the ragged right edge a shape. On the
 * render that was five lines, the last one reading `changes?` alone: a wall of
 * type on the one frame in the lab whose argument is restraint.
 *
 * 48px at 800 is four lines, which is one more than the three the narrower
 * frames manage and is the thing this variant is buying with its whole canvas.
 * The 40px difference from the lab's shared 840 cap costs nothing in height and
 * still buys what the narrowing was for: the block reads as a considered column
 * rather than as text that filled whatever it was given, and no line runs to
 * within 9px of the video rectangle.
 */
const QUIET_MEASURE = 800

export function QuietField({
  kicker,
  question,
  qualifier,
  ordinal,
  tone,
  className = '',
}: AskFigureProps) {
  const a = resolveAsk({ question, qualifier, ordinal })
  const paint = paintOf(tone)

  if (a.problems.length) {
    return (
      <SlideBase variant="light">
        <ProblemPanel problems={a.problems} />
      </SlideBase>
    )
  }

  return (
    /*
      `light`, WITH ITS DECOR LEFT ON.

      The wash and the two orbit arcs are the ground every content slide in the
      deck sits on, and leaving them is the point: this variant's claim is that a
      question needs no frame of its own, and switching the background off to
      make the sentence feel special would be quietly building one. The arcs are
      hairlines under 18% alpha and the lower one's flank is masked away before it
      reaches the text column, so nothing here is fighting the question.
    */
    <SlideBase variant="light" className={className}>
      <AskIn at={0}>
        <AskKicker ordinal={ordinal} paint={paint}>
          {kicker}
        </AskKicker>
      </AskIn>

      {/* `data-align-exempt`: the air under the question is the pause, not tail
          drift. See the named opt-out in `align-check.mjs`. */}
      <div
        data-align-exempt="centred"
        className="relative z-10 flex flex-1 flex-col justify-center"
        style={{ maxWidth: MEASURE }}
      >
        <AskIn at={1} style={{ maxWidth: QUIET_MEASURE }}>
          <Stem size="xl">{a.question}</Stem>
        </AskIn>
        {a.qualifier && (
          /*
            mt-10, which is more air than any other variant gives its qualifier.

            On a frame with a container, the container's own padding is already
            holding the constraint apart from the question. There is no container
            here, so the only thing separating a 48px sentence from a 22px line
            under it is the gap and the rule inside `Qualifier`. At the mt-9 the
            dark variant uses, the constraint sat close enough to read as the
            question's fourth line.
          */
          <AskIn at={2} className="mt-10">
            <Qualifier paint={paint}>{a.qualifier}</Qualifier>
          </AskIn>
        )}
      </div>
    </SlideBase>
  )
}
