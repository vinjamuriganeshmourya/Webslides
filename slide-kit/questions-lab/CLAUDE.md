<!-- cSpell:ignore NxtWave nwblue -->
# Question frame lab

Four ways of posing one question to a room, behind one prop contract, so the user
can pick what is worth keeping and the winner gets promoted into the kit. Nothing
in here is a session. The deck renders variants and nothing else.

First of three question labs. The other two are `mcq-lab` and `truefalse-lab`,
and the split is deliberate: see **Why this is three labs and not one** below.

## Why this lab exists

The kit has exactly one design for the pause beat, `QuestionSlide`, added in
session 4, and **it has never been compared against anything**. It was the first
thing better than a `ContentSlide` with an empty well, it was adopted on that
basis, and eight decks later it is still the only answer to a frame that does
five different jobs:

1. **Opening a concept.** Nobody can answer yet, and that is the point: the guess
   is what makes the answer land two slides later.
2. **Checking one just taught.** Everybody should be able to answer, and the
   instructor needs to find out whether they can.
3. **Asking about a thing on screen.** "What does this print" is not a question
   without the code, and the kit's answer today is a `ContentSlide` whose lead
   ends in a question mark, which sets the question at lead size under a larger
   heading that is not the question.
4. **Marking the switch from listen to answer.** `QuizTimeSlide` does this and
   carries no question at all.
5. **Being the sixth question slide in one deck**, where the identical card and
   the identical oversized mark have stopped registering as a beat.

Item 5 is the one that shows. A device that never varies stops being read.

## The variants

| Variant | The argument | Worst at |
|---|---|---|
| `SpotlightAsk` | the GROUND changes, so the frame is noticed before it is read. A room half-watching pale blue content slides looks up when the wall goes dark, and it looks up before reading a word; the other three announce themselves in ink, and ink has to be read to be noticed. A scrim pulls the deck's night ground down, and one pool of light falls on the question | it cannot follow the slide it belongs to: a question landing mid-explanation wants attention to continue, and this resets it. And the deck's dark ground is already spent on welcome, the session name, every divider, practice, feedback and thank you, so questions there too means the room stops reading navy as a boundary |
| `QuietField` | **the control.** No card, no mark, no device. The only frame that meets rule 16 literally rather than by arguing that its container is not content, and the only one with room for the largest type in the deck | the sixth question in a deck. It has no device to vary, so six of these are six pale frames with a sentence on them. It is also the frame most easily mistaken for a light-ground section divider, which asks for nothing |
| `MarkCut` | the mark is the COMPOSITION, not a watermark behind one. A ring with an opaque glyph, cut by the right edge, is the only frame in the deck identifiable at 120px wide, which is the size a slide is seen at in the picker, in a scrubbed recording and in a thumbnail rail | it costs the question a line: 36px on a 736px measure against `QuietField`'s 48 on 800, with only 62px of gutter in hand. And the mark says "question" and nothing else, so the room has been told the genre before reading a word |
| `AskWithSubject` | the question next to the artefact it is ABOUT. A proposal to amend hard rule 16, not an exception to it | the question is the smallest in the lab at 32px, and it is the only frame that breaks the lab's 840px cap, so it is legal only because its block is vertically centred and short |

Slides 1 to 3 render the **identical fixture**, which is what makes them a
comparison rather than four demos. Slide 4 renders the same question with its
subject attached and its qualifier removed, and both changes are results.

## What every variant agrees on, which is almost nothing and is deliberate

Three things only, so that everything else the room sees is the design.

**1. The kicker is pinned at the frame's own datum**, x=64 and y=48, per hard
content rule 19. `QuestionSlide` in the kit folds it into the centred card, so
the room's answer to *"where am I in this session"* moves down the frame every
time a question is asked. That is a finding about the kit, and holding it
constant here keeps it from also being a variable.

**2. Content is capped at 840px from x=64**, ending at x=904 and clearing the
instructor video rectangle at x=913 **at any height**. The kit's `QuestionSlide`
arrived at the same number the same way. `AskWithSubject` is the one exception
and states it at length.

**3. Nothing is a build step.** Every frame arrives complete. This is the
sharpest difference between this lab and its five siblings, which click-gate
everything, and `src/ui/variants/motion.tsx` has the full argument. The short
version: a question frame has three parts at most, and there is no part of it the
room may be allowed to start without. A question revealed before its qualifier is
a different question and the room has begun answering it; a question revealed
before the code it is about is not a question at all. Holding either back means
the room's first guess is against content the frame has since changed, which is
worse than showing everything, because now the instructor has to talk them out of
an answer the slide caused.

## The rule this lab most exists to test: does the kicker give the answer away

Hard rule 19 pins the concept to the top-left of every slide. Hard rule 16 says a
question frame carries nothing that answers it. **On a question frame those two
rules pull against each other**, because the concept very often *is* the answer.

The first draft of `fixture.ts` had the kicker `State lives on the object`, which
is word for word the answer to the question underneath it. The frame composed,
all four harnesses passed, and the pause beat was worthless: anybody who read the
top-left corner never had to think.

**The kicker names the concept and never resolves it.** `Objects and their state`
says where in the session the room is, which is all rule 19 asks for, and answers
nothing. No resolver can check this, because the check is whether two strings mean
the same thing. It is checked in review, and that paragraph in `fixture.ts` is
what it is checked against.

## The one variant that argues with a hard rule

`AskWithSubject` carries a code panel on a question frame, which hard content
rule 16 forbids. It is a **proposal to amend the rule**, not an exception to it,
and the amendment is written so it can be signed off or rejected as one sentence:

> A question frame may carry the ARTEFACT the question is about: at most one,
> capped at six lines and 54 characters a line, and never anything that bears on
> the answer.

The argument, in short: rule 16 was written about a question slide carrying the
**answer's supporting material**, which is something to read instead of thinking.
A subject panel is the question's **subject**. Take the six lines away and there
is no question left, only the word "this" with no referent. And the room can read
every line of it and still not know what happens, because what happens is not
written anywhere on it.

**The better test, if this is accepted:** *can the answer be READ off the frame?*
rather than *is there anything else on it?*

The ceilings in `resolveAsk` are what keep that honest, and they ARE the
amendment. Past six lines or 54 characters the frame is a `ContentSlide` and rule
16 is simply correct.

## What no variant carries, and why there is no field for it

**The answer.** There is no `answer` field on `AskFigureProps`, no `options` and
no `correct`. Not as a build step, not behind a click, not in small grey text at
the bottom. A question frame's entire mechanism is that the room commits out loud
before it finds out, and the answer is the next slide. **A contract that can hold
the answer is a contract somebody will fill in.**

## Why this is three labs and not one

A question, a multiple-choice question and a true/false question look like one
device with more fields. They are three devices, and the contract is where that
shows:

- A **question** has a stem and nothing to choose from. The room answers out
  loud, in its own words, and the frame never finds out whether it was right.
- An **MCQ** has options, distractors and exactly one correct answer, and every
  one of those is a field this contract refuses to have. The distractors are the
  teaching content: which wrong answer somebody picks says what they
  misunderstood, which a spoken answer cannot.
- A **true/false** has two fixed options that are always the same two, so it has
  no option list at all, and it carries a failure mode neither of the others has:
  half the room is right by accident. `resolveAsk` REFUSES a yes/no question
  outright and names that lab, which is the seam between them made mechanical.

Three contracts, three labs, and a variant promoted from one does not have to
carry the other two's fields.

## The checks worth knowing

`resolveAsk` refuses input this lab cannot ask. Each check is an authoring mistake
that renders as something **plausible**, which is the only kind worth checking
for. A 190-character question at display size draws a beautiful frame that nobody
can hold in their head while thinking.

| Check | Why |
|---|---|
| does not end in `?` | it is a statement |
| two `?`, or `and why` / `or which` | hard rule 16 splits a compound question. A room asked two things answers the easy one |
| over 120 characters | a paragraph set large. The number comes off `MarkCut`, the narrowest frame |
| under 24 characters | "What now?" renders beautifully and asks nothing. It is the shorthand the instructor says out loud, with the real question still in their head |
| a yes/no opener | half the room is right by accident. It wants `truefalse-lab` |
| a spaced em dash | hard rule 1, enforced where it is cheapest to enforce |
| `stranger` | hard rule 2 |
| the qualifier ends in `?` | it is a second question |
| the qualifier says `hint`, `remember`, `think about` | rule 16: a constraint, never a hint |
| the qualifier says `answer`, `because`, `in fact` | it is the answer |
| a terminal subject with no label | hard rule 3: a terminal without its folder path is a lie about where it ran |
| a subject over six lines or 54 characters | the amendment's own ceiling. Past it the frame is a `ContentSlide` |

**The check the resolver cannot make** is the kicker one above, and the one in
`fixture.ts`'s note about the qualifier: three of the four drafts of that one line
were a hint, an answer or a rephrasing, and only one of the three is catchable by
a regex.

## Verifying a change

```bash
npx vite --port 5231 --strictPort      # the kit's vite.config hardcodes 5173
node qa.mjs          # slides 1 and 3 flagged, both benign: see below
node video-safe.mjs  # must print CLEAN
node align-check.mjs # must print 0 of 4
node fit-check.mjs   # must print LAYOUT STABLE
node measure.mjs     # the one that matters here
```

**The numbers below moved once already and not because anything here changed.**
`SlideStage` switched from `transform: scale()` to CSS `zoom` to stop the deck
rendering soft on a projector, which brought `text-rendering:
geometricPrecision` with it, which makes glyph advances unrounded and therefore
slightly wider: the mono face went from 8.0px a character to 8.4, and
`AskWithSubject`'s panel cap had to go from 466 to 488 or a 54-character line
would scroll. Content rule 9 arriving from three directories away. Re-run
`measure.mjs` after any kit change that touches type.

`measure.mjs` is this lab's own harness and **it is the one the four inherited
ones cannot replace.** They measure whether something is WRONG: off the frame,
inside the video rectangle, off the datum, missing its mark. None of them can see
a sentence set at a size that wraps to five lines, because five lines is not an
overflow, a collision or drift. It is a legal, tidy, unreadable frame, and
`qa.mjs` will report it CLEAN forever.

Every type size in `askChrome.tsx` was guessed from the kit's scale in the first
pass and **was wrong on all four frames.** Current measured state:

```
slide | size | measure | lines | line widths
 1    | 40px |  840    | 3     | 752 809 792
 2    | 48px |  800    | 4     | 688 626 794 707
 3    | 36px |  736    | 3     | 677 728 713
 4    | 32px |  560    | 4     | 542 521 473 340
        mono: 14px, 8.4px per character
        panel: 278px wide, box 668,266,946,464
```

The per-line widths are the part worth having. `AskWithSubject` at a 500px column
was still five lines even though the arithmetic said four: the breaks landed at
410 to 464px inside it, so the slack went into the ragged edge instead of into a
line. A line count says "still wrong"; the rects say "widen it by 60".

### The `qa.mjs` baseline for this lab

Two flagged slides, both benign, and neither is the kit's usual pair (this deck
has no welcome and no thank-you frame):

- **slide 1**, `SpotlightAsk` — its scrim, its spotlight, its `?` and its foot
  hairline are all full-bleed or deliberately cropped `pointer-events-none`
  layers.
- **slide 3**, `MarkCut` — the ring system's `inset-0` wrapper.

`video-safe.mjs` skips all of them correctly and prints CLEAN. Anything else is a
regression.

## If a variant wins

1. Move it to `slide-kit/slide-template/src/ui/` (or `src/slides/` if it stays a
   whole frame, which all four currently are), with `askFigure.ts`,
   `askChrome.tsx` and `motion.tsx` alongside it.
2. Add its props to `src/slides/types.ts`, export it from `src/slides/index.ts`,
   and render it in `sampleDeck.tsx` with the `notes` string from `labDeck.tsx`.
3. Register it in `slide-kit/slide-types/README.md`, with what it is worst at.
4. **If `AskWithSubject` is among the winners, rule 16 has to be amended first**,
   in `.claude/skills/slide-content-rules/SKILL.md`, using the sentence above.
   A variant that ships against a live hard rule is how the rule quietly dies.
5. Raise it as a PR: `sync-kit.mjs --apply` pushes kit changes into signed-off
   sessions.

If no single winner emerges, register all four, as `pseudocode-lab`,
`projectcode-lab`, `points-lab` and `features-lab` all did. Four question frames
that each state what they are worst at is a better outcome than one, and it is the
answer to the fifth job in the list at the top: a deck with six questions can
alternate.
