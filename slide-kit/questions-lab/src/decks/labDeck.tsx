import type { DeckMeta, SlideDef } from '@/deck/types'
import { printFixture, stateFixture } from '@/ui/variants/fixture'
import { SpotlightAsk } from '@/ui/variants/SpotlightAsk'
import { QuietField } from '@/ui/variants/QuietField'
import { MarkCut } from '@/ui/variants/MarkCut'
import { AskWithSubject } from '@/ui/variants/AskWithSubject'

/**
 * QUESTION FRAME DESIGNS — a lab, not a session.
 *
 * WHY THIS LAB EXISTS
 *
 * The kit has exactly one design for the pause beat, `QuestionSlide`, added in
 * session 4, and it has never been compared against anything. It was the first
 * thing better than a `ContentSlide` with an empty well, it was adopted on that
 * basis, and it is still the only answer to a frame that does five different
 * jobs. `askFigure.ts` lists them. The one that shows is the fifth: a deck that
 * asks six questions has six identical frames, and a device that never varies
 * stops being read.
 *
 * WHAT THE FOUR VARIANTS ARE ARGUING ABOUT
 *
 * Two things, and they are not the same thing:
 *
 *   **Where the "stop and think" signal comes from.** `SpotlightAsk` says from
 *   the ground, by turning the projector dark. `MarkCut` says from one opaque
 *   drawn shape that is identifiable in a thumbnail. `QuietField` says from
 *   nothing at all, and is the control: it is what says whether the other two
 *   devices are worth their cost.
 *
 *   **Whether a question frame may carry its subject.** `AskWithSubject` is the
 *   only one that answers yes, and it is a proposal to amend hard content rule
 *   16 rather than an exception to it. Its own file states the amendment and the
 *   ceilings that keep it honest.
 *
 * WHAT EVERY VARIANT AGREES ON, WHICH IS ALMOST NOTHING AND IS DELIBERATE
 *
 * Three things only, so that everything else the room sees is the design:
 *
 *   1. **The kicker is pinned at the frame's own datum**, x=64 and y=48, per hard
 *      content rule 19. The kit's `QuestionSlide` folds it into the centred card,
 *      so the room's answer to "where am I in this session" moves down the frame
 *      every time a question is asked. That is a finding about the kit, and it is
 *      the same on all four here so it is not also a variable.
 *   2. **Content is capped at 840px from x=64**, which ends at x=904 and clears
 *      the instructor video rectangle at x=913 at any height. `AskWithSubject`
 *      is the one exception and says so at length.
 *   3. **Nothing is a build step.** Every frame arrives complete. `motion.tsx`
 *      has the argument, and it is the sharpest difference between this lab and
 *      its four siblings, which all click-gate everything.
 *
 * SLIDES 1 TO 3 RENDER THE IDENTICAL FIXTURE. Slide 4 renders the same question
 * with its subject attached and its qualifier removed, which are the two changes
 * that variant exists to make. `fixture.ts` explains both, and the removed
 * qualifier is the more interesting of the two.
 *
 * NOTHING BUT VARIANTS IS IN HERE, following the sibling labs.
 */

export const labDeck: SlideDef[] = [
  {
    id: 'v1-spotlight-ask',
    label: '1 · SpotlightAsk',
    section: 'Variants',
    notes:
      'THE ONLY VARIANT THAT IS NOTICED BEFORE IT IS READ. The loudest signal a slide has is not a size or a mark, it is the GROUND: a room half-watching a run of pale blue content slides looks up when the wall changes colour, and it looks up before it has read a word. The other three announce themselves in ink, and ink has to be read to be noticed. THE RENDER TURNED UP THE MOST USEFUL FACT IN THE LAB HERE. `bg-nw-night` is not flat navy, it is a radial with #0146C7 at 18% across and 0% down, so the deck\'s dark ground has a BRIGHT BLUE CORNER exactly where every dark frame puts its heading. The first pass laid a 34% spotlight on top of it and the result was not a dark frame with a light on it, it was a bright blue slide with a sentence on it, and the variant\'s entire argument was false on screen. So the scrim comes first: a flat wash of the palette\'s own deepest navy at 62%, which pulls the whole ground down INCLUDING the hot corner, and the pool of light is then the only light in the frame rather than the second one. It also costs a third less paint, 26% against 34%, because it no longer has anything to compete with. The tone ramp had to move for this frame and only for this frame: brand-dark against navy is about 1.5:1 and the kicker vanishes on a projector, so `paintOnDark` lifts each stop to the lightest member of its own family rather than inventing a second hue. MEASURED: 40px on the shared 840px measure, three full lines at 752, 809 and 792px. 44px, which is the kit\'s own `slide-title-lg` and what `QuestionSlide` uses, was four lines with the fourth reading `changes?` alone. Worst at: it cannot follow the slide it belongs to. A question landing mid-explanation wants the room\'s attention to continue, and this resets it, so for about a second everybody is looking at the change rather than at the sentence. And the deck\'s dark ground is already spent six ways, on welcome, the session name, every divider, practice, feedback and thank you: put questions there too and the room stops reading navy as a boundary, which is what the dividers were relying on. The spotlight is what keeps them apart, and it is a thinner distinction than it looks on one slide in isolation.',
    element: <SpotlightAsk {...stateFixture} />,
  },
  {
    id: 'v2-quiet-field',
    label: '2 · QuietField',
    section: 'Variants',
    notes:
      'THE CONTROL, AND EVERY COMPARISON NEEDS ONE. The other three each spend something to mark the pause: a whole dark ground, a third of the canvas, or a second panel. None of those costs is knowable without a frame that spends nothing, so this one answers the question the lab is actually asking, which is not which device is best but whether a question frame needs a device at all. Read it as the strongest form of the argument against the other three, not as a straw man. It is also the only frame that meets hard rule 16 literally rather than by arguing that its container is not content: a card has an edge and a shadow, a 400px ring has a shape, a code panel has six lines in it, and each is somewhere the eye can go while the brain avoids the question. MEASURED: 48px on an 800px measure, four lines at 688, 626, 794 and 707px. It is the only stop in the lab that deliberately buys a fourth line, because it is the only frame with nothing else to spend the room on; the other three are sized to land the fixture in three. 52px on 760 was five lines with a widow, which is a wall of type on the one frame whose argument is restraint. THE RISK IS THE ONE THE KIT ALREADY PAID FOR: `QuestionSlide`\'s own note records that its first version was a centred sentence on an empty canvas, and on a projector it read as an unfinished slide rather than as a deliberate pause. The card was added to fix exactly that, and this variant is the argument that the card was the wrong fix. Two things say deliberate here instead and neither is a container: the kicker pinned at the datum carrying the concept and the ordinal, because a slide that failed to render does not number itself, and a type size that appears nowhere else in a deck. Whether those two are enough is the single most useful judgement this lab is asking for. Worst at: the sixth question in a deck, which is the ceiling the whole lab was opened over. It has no device to vary, so six of these is six pale frames with a sentence on them and by the fourth the room has stopped noticing that a question is being asked. The other three can at least be alternated; this one can only be repeated.',
    element: <QuietField {...stateFixture} />,
  },
  {
    id: 'v3-mark-cut',
    label: '3 · MarkCut',
    section: 'Variants',
    notes:
      'THE ONLY FRAME IN THE DECK THAT IS RECOGNISABLE AT 120px WIDE. A deck is looked at in a strip as often as one frame at a time: the slide picker, a scrubbed recording, the thumbnail rail while somebody hunts for the bit they missed. Nothing in this deck is identifiable at that size except by its ground, which is why every dark frame looks like every other dark frame. A ring with an opaque mark in it, cut by the right edge, is identifiable with every word in it unreadable. The difference from the kit\'s existing oversized `?` is that this one is OPAQUE and on a ground of its own: the kit\'s is a 10% watermark in the gap beside the card, which is there to be not noticed and succeeds, so it is 300px of canvas doing nothing. Rings rather than a filled plate, because a disc behind an opaque glyph is a badge and a badge is what a product puts on a feature it is proud of; two rings with a soft fill read as a lens, which is closer to pointing at something. Every piece is a rounded div and not an svg, because `video-safe.mjs` reads `pointer-events-none` off a class string and an SVG element\'s `className` is an `SVGAnimatedString` the harness cannot read. The deck\'s own decor is switched off: a 400px ring on top of two 1052px orbit arcs reads as a diagram of orbits, and the eye goes looking for a relationship that is not there. EVERY NUMBER IN THE RING IS A CLEARANCE, NOT A CHOICE. Centre (1062, 448) at 400px across puts the edges at x 862..1262 and y 248..648: the top clears the video rectangle\'s y=220 floor, the bottom clears the NxtWave mark in the footer, the right runs off the frame so the ring is cut rather than floating, and the left is what sets the question\'s 736px measure. Worst at: it costs the question a line. MEASURED at 36px on 736, three lines at 677, 728 and 713px, against QuietField\'s 48px on 800. The 62px gutter between the text and the ring is the whole margin, so a question 15 characters longer takes a fourth line this frame has no room for, and the ring cannot be shrunk to give any of it back without becoming a badge. And the mark says "question" and nothing else, so the frame has told the room the genre before they have read a word, which is worst on the one question that most needed them to think.',
    element: <MarkCut {...stateFixture} />,
  },
  {
    id: 'v4-ask-with-subject',
    label: '4 · AskWithSubject',
    section: 'Variants',
    notes:
      'A PROPOSAL TO AMEND HARD CONTENT RULE 16, NOT AN EXCEPTION TO IT. Rule 16 says a question slide carries the question and nothing else, and it is right about what it was written about, which is a question slide carrying the ANSWER\'S supporting material: things to read instead of thinking. "What does this print" is a different shape. The panel is not support for the question, it is the question\'s SUBJECT: take the six lines away and there is no question left, only the word "this" with nothing to point at. And it cannot be read instead of thinking, because what happens is not written anywhere on it. That is the test worth applying, and it is not the one rule 16 states: can the answer be READ off the frame, rather than is there anything else on it. The alternative is what the kit does today, which is the code on one slide and the question on the next, so the room answers about a file it can no longer see and gets either the detail or the question wrong. The amendment this proposes: a question frame may carry the artefact the question is about, at most one, capped at six lines and 54 characters, and never anything bearing on the answer. The ceilings in `resolveAsk` ARE the amendment; past them the frame is a ContentSlide and rule 16 is simply correct. THE FIXTURE CHANGES HERE AND THE SECOND CHANGE IS THE FINDING: the subject is added, and the qualifier is removed, because with the file on screen the room can SEE that nothing else touches the objects, so the prose version is the frame saying in words something it is simultaneously showing. A subject panel and a qualifier are alternatives, not companions; if a frame needs both, the panel is not showing enough. The panel hugs its own longest line rather than taking a fixed column, which the render forced: at a fixed 488px, sized for the resolver\'s 54-character ceiling, it drew 278px of code and 210px of empty panel, and a box that failed to fill is worse on the one frame arguing that its extra panel is justified. The cost is that two of these in one deck have panels of different widths. Worst at: the question is the smallest in the lab, MEASURED at 32px in a 560px column against QuietField\'s 48px, because it is sharing the frame, and the code is bigger relative to its own normal size than the question is. It is also the one variant that breaks the lab\'s 840px cap: 882px wide on this fixture and 1092 at the resolver\'s ceiling, so it is legal only because its block is vertically centred at y 266..464 and short enough to clear the video rectangle\'s y=220 floor. Five lines of question or seven of code pushes it up into that rectangle, and `video-safe.mjs` has to be re-run for this frame whenever the fixture changes.',
    element: <AskWithSubject {...printFixture} />,
  },
]

export const labDeckMeta: DeckMeta = {
  title: 'Question Frame Designs',
  course: 'Slide kit · figure lab',
  lesson: 'Question frame designs',
}
