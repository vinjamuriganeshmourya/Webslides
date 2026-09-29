# The animated explainer

**Every plan has one.** Not as decoration — as the one place where the session's idea is shown
*happening* instead of asserted. A static slide can say "the second question is never asked".
Only motion can show the room a question sitting there, never reached, greying out.

This is the highest-value element in a plan and the easiest to get wrong in the direction of
spectacle. The rules below exist to keep it on the learning side.

---

## What it is

One panel, styled as a slide (deck header — accent bar, grey eyebrow, blue title, bottom rule),
carrying a small interactive model of the construct being taught. The room can change an input,
step it, and watch what the language actually does.

The reference implementation is **"Follow the Dot"** from session 11: the program on the left,
a flowchart on the right, a slider for the input, and Play / One step / Reset. A red dot walks
one route. Everything it never touches greys out — and stays grey.

A worked copy of the markup, CSS and step engine is in
`assets/execution-walker-reference.txt`. Adapt it; do not start from nothing.

---

## The three tests

Apply all three before you build it. If it fails any one, it is decoration and it goes.

**1. The subtraction test — does removing it lose the idea?**
Take the animation out. If the session's one idea still lands from the slides and the paper
task, the animation was ornament. The walker survives this test: without it, "a question that
is never reached is never asked" is a sentence the instructor says and the room nods at.

**2. The screenshot test — would a still frame do the job?**
If you can screenshot it at the end and lose nothing, you built a diagram with a delay on it.
Use the diagram and save the minutes. What must not survive a screenshot is the *route* —
the order things happened, and what got skipped.

**3. The prediction test — must a student commit before it tells them?**
The instructor sets the input, asks the room to write what prints, *then* presses Play. An
animation the room watches passively teaches nothing. This is why the input is a slider and
not a hard-coded value: the room picks a number, and the dot settles the argument.

**The value they predict must not be one a slide has already answered.** Deck order put
"asks four times" on the slide before session 12's walker, so a walker opening at 3 asked the
room to predict a number it had just been told. Default the input to an unrehearsed value and
come back to the rehearsed one with One step.

---

## Finding the motion in a topic

For a programming session there is always something in motion. The job is to find the one
motion that *is* the session's idea, not merely one that exists.

| Session | What moves | What the motion proves |
|---|---|---|
| Nested conditionals / elif | the interpreter's route through the ladder | a branch never reached is never tested |
| While loops | the counter, and the condition re-asked each pass | the condition is checked *between* passes, not once |
| For loops | the item the variable is currently bound to | the loop does not count, it consumes a sequence |
| Functions | control leaving and returning to the call site | the caller waits; the body is not inline |
| Lists / indexing | the index cursor against the cells | index and value are different things |

Pick one. **Animate one thing.** Two moving parts desynchronise and the room watches the wrong
one. One property on one group is the ceiling for a hook; the walker's one thing is the dot.

---

## Build contract

Copy these; each one cost a round when it was missing.

**Structure.** Code left (`.wcode`), visualisation right (`.wviz`), input below the code,
controls below that, output box last. Flex, not grid — grid `gap` is dropped by the print
pipeline (see `gotchas.md`).

**Steps are computed from the input, not hard-coded.** One step per thing the language actually
does, in order. The room changes the slider and walks it again; if the steps are a fixed list,
the second walk is a lie.

**Three states, and the third is the point.**

```
.wline.ran   /* executed, pale highlight  */
.wline.now   /* executing, stronger       */
.wline.dead  /* never reached, opacity .26 — and it stays that way */
```

The `dead` state persists after the run ends. Do not reset it on completion. It is the finding.

**Controls: Play, One step, Reset.** `One step` is the one instructors use — it lets them stop
on the line the room disagreed about. Reset must restore the dead/visited classes too, not just
the dot position.

**An output box that starts empty**, with placeholder text via `:empty::before`, filling only
as the program prints. An output that appears complete at frame one removes the prediction.

**Palette from the deck**, never a new one. The panel has to be indistinguishable from a slide
at the back of the room.

**Reduced motion and print jump to the end state:**

```css
@media (prefers-reduced-motion:reduce){ .wdot,.wline,.wchart *{transition:none !important} }
```

Print must show the finished route with the dead paths still greyed — that is what makes the
printed plan readable.

**Transform origin-independently.** `transform-origin` on an SVG group is not honoured
everywhere; write the arithmetic instead and pin `transform-box:view-box`. `gotchas.md` has
the formula.

---

## Where it goes in the session

Directly **after** the beat where the room got the idea wrong, or was asked to predict and
split. Not before — an animation shown before the room has a stake in the answer is a cartoon.
In session 11 the walker follows the elif reveal and the trace disagreement, and it lands as
*"so that is why 61 was never looked at."*

Budget **2 to 4 minutes**. It is a reveal, not a lesson. If it needs six, it is doing work the
paper task should have done.

---

## The hook animation is a separate thing

The hook also animates, and it is not this. The hook is **one CSS transform on one SVG group**,
900ms, no controls, no input — a single visual turn that states the problem. The explainer is
interactive and comes later, once the room has tried and failed.

Both are required. They are different beats with different jobs:
the hook makes the room *want* the answer; the explainer shows them the *mechanism*.
`assets/hook-svg-reference.txt` has the worked hook.
