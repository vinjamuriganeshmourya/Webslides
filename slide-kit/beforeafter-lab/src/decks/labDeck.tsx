import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import {
  brokenFixture,
  deployFixture,
  migrationFixture,
  refusedFixture,
} from '@/ui/variants/fixture'
import { StateArrow } from '@/ui/variants/StateArrow'
import { DeltaRows } from '@/ui/variants/DeltaRows'

/**
 * BEFORE AND AFTER DESIGNS — a lab, not a session.
 *
 * Second of the six comparison labs. Read `comparison-lab/CLAUDE.md` first: this
 * lab is shaped against that one, and the differences are the reason it is
 * separate rather than two more variants over there.
 *
 * WHY IT IS NOT `comparison-lab` WITH DIFFERENT LABELS
 *
 * An A-vs-B figure has two SUBJECTS. This one has one subject at two TIMES, and
 * three things follow that a comparison contract cannot express:
 *
 *   **It is directional.** `docker run` does not become `docker compose up`, so
 *   a comparison must never draw an arrow. Deploying by hand does become
 *   deploying from a pipeline, so this one must. `FcEdgeDraw` was deleted from
 *   `comparison-lab`'s motion module with a note saying this lab would need it
 *   back, and it is back. That primitive is the line between the two labs.
 *
 *   **The two sides are not equals.** Symmetry is honest in a comparison and
 *   dishonest here: equal treatment says "two states, pick one".
 *
 *   **A row can carry a delta.** Forty minutes against six has a third fact in
 *   it that neither cell states.
 *
 * WHAT THE TWO VARIANTS ARE ARGUING ABOUT
 *
 * **Whether the change is one thing or a list of things**, and both readings are
 * true of different content:
 *
 *   `StateArrow` says one thing. Two panels read as wholes, with the sentence
 *   that captures what KIND of thing each state was as the largest text in each.
 *   The rows are supporting evidence underneath.
 *
 *   `DeltaRows` says a list. Every dimension is its own row carrying its own
 *   before, its own arrow and its own after, so the pairing is done by the
 *   layout instead of by the reader, and there is finally somewhere to put the
 *   number.
 *
 * Slides 1 and 2 render the IDENTICAL fixture through both, which is what makes
 * them a comparison. Slides 3 and 4 then show the two edges: the content
 * `DeltaRows` exists for, and `StateArrow` refusing it by name.
 *
 * THE BEFORE STATE IS MUTED, NOT RED, and it is the rule this lab most exists to
 * enforce. Every template house paints this figure green and red. In a lecture
 * the before state is usually what the previous slide taught, and painting it
 * red says the last lesson was a mistake. `risk` needs `beforeWasBroken`, and
 * slide 3 is the case where it is earned.
 *
 * NOTHING BUT VARIANTS IS IN HERE, following the sibling labs.
 */

export const labDeck: SlideDef[] = [
  {
    id: 'v1-state-arrow',
    label: '1 · StateArrow',
    section: 'Variants',
    notes:
      'THE DIRECTION IS DRAWN, NOT IMPLIED, AND THAT IS THE WHOLE VARIANT. Left-to-right ordering alone does not say "this became that", it says "these two things, in this order", which is also what a comparison says, and a room that has just seen a comparison slide will read the next one the same way. Two things make it explicit and neither is decoration. The arrow draws itself from the before panel toward the after panel over 600ms on its own click, and it is the one element comparison-lab is forbidden to have, which is why these are two labs: an arrow between two options claims one turns into the other, false of docker run and docker compose up and true of this. And the tone step: the before panel is flat, a tinted ground with no shadow and no accent, while the after panel is white with an accent edge and a soft shadow, so it sits above the surface the before panel is part of. Weight carries the direction even in a photograph of the slide with the arrow cropped out. THE PANELS ARE THE SAME WIDTH AND NOT THE SAME WEIGHT: equal width is right because both states have the same amount to say and shrinking the before panel would make the change look bigger than it is, and equal treatment is what makes most before-and-after templates read as "two states, pick one". The state note is the biggest thing in each panel because this variant carries the change as a whole, and "a deploy is an event someone schedules" against "a deploy is a consequence of merging" is the entire lesson and appears in none of the rows. Worst at: three dimensions is the ceiling, since rows stack inside a 528px panel; and it has nowhere to put a per-dimension delta, because the two values sit in different boxes and the number belongs between them.',
    element: (
      <ContentSlide
        kicker="Showing a change"
        title="StateArrow"
        lead="Two states, one arrow, and the weight moving from left to right."
      >
        <StateArrow {...deployFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v2-delta-rows',
    label: '2 · DeltaRows',
    section: 'Variants',
    notes:
      'THE SAME CHANGE AS SLIDE 1, KEPT NEXT TO THE THING THAT CHANGED. StateArrow reads the two states as wholes, which is right when the lesson is what KIND of thing each state was and wrong the moment the lesson is the inventory. Put five dimensions in two panels and every before sits in one column while its own after sits 500px away in the other with four unrelated facts in between, so the reader does the pairing: the same failure comparison-lab was built around, and the same answer, which is to make the row the unit so a dimension\'s before, its arrow and its after are one object. THIS IS THE ONLY FIGURE IN EITHER LAB WITH SOMEWHERE TO PUT THE DELTA. Forty minutes against six implies a third fact neither cell states, usually the most persuasive thing on the slide, and in a two-panel layout there is nowhere for it because the number belongs between two values that are in different boxes. Here every row ends in a chip. The delta is deliberately not required on every row: most dimensions have no number and demanding one is how a deck ends up with x1.4 beside a claim about who is allowed to deploy, so this is the one place these labs break their own all-or-none rule, and only an empty delta string is refused. Each row gets its own small drawn arrow rather than one large one, because there is no single moment of change to point at, and the arrows land WITH their row rather than after it since a row\'s three parts are each other\'s support. Worst at: it shows no overall shape, so five individually small changes read as five small changes even when the point is that the whole thing is now a different kind of system, and that sentence lives on the contract as the state note which this variant has nowhere to put.',
    element: (
      <ContentSlide
        kicker="Showing a change"
        title="DeltaRows"
        lead="The same change, one row per dimension, with the number between the two values."
      >
        <DeltaRows {...deployFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v3-earned-risk',
    label: '3 · When risk is earned',
    section: 'The rule',
    notes:
      'THE ONE CASE WHERE THE BEFORE STATE IS PAINTED AS A RISK. This lab\'s central rule is that the before state is muted and not red, because in a lecture the before state is usually not wrong: it is earlier, or simpler, or what you do before you know about the better tool, and half the time it is exactly what the previous slide taught. Painting it red says the last lesson was a mistake. Every template house gets this wrong by default, and Linia\'s colour-coded variant is explicit about it: red for release, green for adopt. But the rule is not that the before state is never bad. Storing passwords in plain text is not "what we did before we knew better" in the way deploying by hand is: it was wrong at the time, it is wrong now, and a slide that paints it neutral grey is being polite about something that should not be treated politely. So the tone is available and it has a gate: passing beforeWasBroken is what unlocks tone risk, and resolveChange refuses the paint without it, saying that earlier is not the same as wrong. The flag is separate from the tone deliberately, because the paint is a claim and a claim should be made once, on purpose, at the call site where a reviewer can see it rather than buried in a tone string. Note what stays unchanged even here: the after panel is brand blue and not green, the arrow is the same arrow, and the only green anywhere in the lab is the delta chip, which is arithmetic rather than a verdict.',
    element: (
      <ContentSlide
        kicker="Showing a change"
        title="When risk is earned"
        lead="The before state painted red, once, because the author claimed it in the props."
      >
        <StateArrow {...brokenFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v4-five-dimensions',
    label: '4 · Five dimensions',
    section: 'Counts',
    notes:
      'THE COUNT THAT SPLITS THE TWO VARIANTS, RENDERED BY THE ONE THAT SURVIVES IT. Five dimensions is a change whose lesson is genuinely the inventory rather than the summary: five separate things moved, and the room needs to see each one move. DeltaRows holds it because its rows are horizontal, so a sixth dimension costs one more row of about 52px. StateArrow cannot, and refuses by name: its rows stack INSIDE a 528px panel, which is already about 400px once the head, the note and the padding are counted, so five would put the caption behind the deck controls. That refusal is not a guess, it is the same arithmetic written into the variant, and slide 5 renders it. THREE OF THE FIVE ROWS CARRY A DELTA AND TWO DO NOT, which is the realistic shape and the reason the delta column is allowed to be ragged: query time and column count are measurable, and who owns the schema is not. A figure that looked broken with a partial delta column would be a figure pushing authors to invent numbers, which is the exact failure the delta field\'s own check is written to catch. Also worth seeing here: the five rows land one per click and each row\'s arrow draws with its own row rather than after it, so at no point is a before on screen with its after missing.',
    element: (
      <ContentSlide
        kicker="Showing a change"
        title="Five dimensions"
        lead="The inventory case. Rows are cheap here and expensive inside a panel."
      >
        <DeltaRows {...migrationFixture} />
      </ContentSlide>
    ),
  },
  {
    id: 'v5-refusal',
    label: '5 · The refusal',
    section: 'Counts',
    notes:
      'FOUR MISTAKES THAT RENDER AS SOMETHING PLAUSIBLE, WHICH IS THE ONLY KIND WORTH CHECKING. None of the four would be caught by any of the three harnesses, because all four produce a tidy figure sitting comfortably inside the frame with real text in every box. FIRST AND MOST IMPORTANT: a row that says the same thing on both sides. It draws two cells and an arrow between them, and the room reads "this changed too" because the entire frame says change, while nothing about the output disagrees. It is the single most likely mistake in a before-and-after table, it comes from copying a cell across while editing, and it is the reason this resolver exists. The check compares trimmed lowercase strings so it catches the copy-paste rather than only the exact duplicate. Second: a delta that is prose. "Much faster now" is an opinion wearing a number\'s clothes and it is what gets typed when the author does not have the number, so the check refuses anything over three words or ending in a full stop. Third: the before state painted as a risk without beforeWasBroken, which is this lab\'s central rule enforced rather than documented. Fourth: a dimension written as a question with a question mark, which is a sentence, and a sentence in a 220px label column turns it into a third column of prose. The refusal is rendered rather than described because a refusal nobody has seen is a refusal nobody trusts.',
    element: (
      <ContentSlide
        kicker="Showing a change"
        title="What it refuses"
        lead="Four mistakes, and the first one is the reason this resolver exists at all."
      >
        <DeltaRows {...refusedFixture} />
      </ContentSlide>
    ),
  },
]

export const labDeckMeta: DeckMeta = {
  title: 'Before and After Designs',
  course: 'Slide kit · figure lab',
  lesson: 'Before and after designs',
}
