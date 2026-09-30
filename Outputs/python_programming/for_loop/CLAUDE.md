<!-- cSpell:ignore NxtWave devPort Updation -->
# For Loop · session notes

Python Programming. Rebuilt in the kit from the PF 14 "For Loop" lesson-plan
deck (`Downloads/Programming_Foundations_LP/Plans/14 - For Loop/
14_for_loop_student_view_new_design.html`, 38 cards), from the plan at
`../session_plans/for_loop/plan.md` (signed off 2026-09-29).

This file holds the decisions specific to THIS deck. Repo-wide rules are in
`../../../RULES.md`; kit rules are in `KIT.md`, which describes the base
template, not this session.

```bash
npm run dev            # http://localhost:5260
npm run build:html     # dist-single/for-loop.html, the deliverable
node video-safe.mjs && node qa.mjs && node align-check.mjs
```

---

## 1. The content is the source deck's, word for word

The user's instruction for this build: "don't change the content at all". Every
kicker, title, lead, code line, output, step caption and button label is the
source's. Section 3 of the plan is the copy. **Do not reword a line here
without changing the plan first.**

Two changes are the user's own standing rules, not rewording: code boxes say
`Python`, never a file name (content rule 26), and the three pseudocode shapes
are dark boxes titled `Pseudocode`.

Three hard-rule conflicts were kept on purpose (plan D2): the takeaways are not
the agenda strings (rule 20), the quiz is mid-deck (rule 18), and slide 20's
question shares its slide with a diagram (rule 16).

## 2. Every output was produced by running the snippet

CPython 3.12, 2026-09-29, for every code slide and every trace step. Slide 8 is
labelled `Expected output` because that program is the buggy one: it prints
`P y t h o`, not `Python`. **If a snippet changes, run it again.**

## 3. One code box

Every code box is x 64, y 221, 560 wide, 20px type, `filename="Python"
chip={false}`. A run of consecutive code slides shares one `rows`, so the box
never changes size as the deck advances (user, 2026-09-29):

| Slides | `rows` |
|---|---|
| 8 to 10 | 6 |
| 12 to 14, 16 to 18 | 4 (15 is 6, and grows down only) |
| 23 | 2 |
| 27 | 6 |
| 29, 30 | 3 |
| 33 to 35 | 5 |

A code slide's lead sits in Space-3 (`mode="top"` on `ZonedFrame`), which is
what puts the box at y 221. Slide 31's two side-by-side programs are the one
exception; the comparison is the point of that slide.

## 4. Panels

Fifteen source cards were live panels, ported as kit components (plan D1 (a)).
Beats are the kit's build steps, so Ctrl+arrow (or `S`, then the plain arrow)
walks them, and each panel's own Next / Replay press the same key. The buttons
sit on one fixed line, bottom edge y 680, on every panel.

| Slide | Component | Driven by |
|---|---|---|
| 3 | `MatchPairs` | Join them (3 steps) |
| 4 | `BeatStory` + `StoryArt playlist-phone` | Next (6 beats) |
| 5 | `ExamplesToShape` | Next (4 beats) |
| 14 | `StringWalker` | its own Split it, Play, One step, Reset, word picker |
| 15, 27, 35 | `TracePanel` | Next (11, 10, 4 beats) |
| 16 to 18, 29, 34 | `Countdown` | its own play button |
| 24 | `RangeDial` | its own steppers and Show the numbers |
| 25 | `SavingsStory` | Next (6 beats) |
| 26 | `ChallengePanel` | Next (2 beats: the problem, then the hint) |
| 31 | `RunCompare` | its own n stepper and Run them both |
| 36 | `TakeawayTree` | Next (7 beats) |

The per-beat states of 4, 5, 15, 25, 27 and 35 are the source's own CSS state
tables, transcribed. The walker's steps are computed from the word, as the
source's were.

## 5. Open item

`FeedbackSlide`'s default title, "We’d love your feedback", wraps onto two lines
in the kit's layout. That is a kit issue (content rule 25) in every deck using
the default, not this deck's; the title here is the source's own, unchanged.
