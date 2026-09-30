---
name: session-7-deck
description: Build rules and feedback log for Deployment Session 7, "Introduction to Jenkins". Use when generating, editing or reviewing any slide in django_deployement_course/deployement_session_7, its plan at session_plans/deployement_session_7/plan.md, or the four process-flow figures prototyped in slide-kit/cicd-lab.
---

# Session 7 deck — build rules

Session 7 is "Introduction to Jenkins": 59 slides, four concepts,
devPort 5218, `htmlName` `deployment-session-7`, TR
`/home/nxtwave/docker_jenkins_aws/07_introduction_to_jenkins_and_cicd.md`
(437 lines after the three patches in §6 of the plan).

**R1 to R13 are session 6's, carried forward unchanged**, and they are not
restated here: read `workflow/skills/session-6-deck/SKILL.md` first. Titles
topic-bare at two to four words, the same artifact keeps the same title,
`CodeBlock`'s `language` is also the chip label, a wide child means the slide
carries a `lead`, nothing is captured, a definition names what and why and where,
every named technology carries its PNG, and motion runs at the explanatory tier.

The rules below are new, and each one exists because of something this session
hit that no previous one did.

## R14 Two quiz frames, and the standing no-quiz instruction is retired

Sessions 5 and 6 shipped under "no quiz frames anywhere". On 2026-08-31 the user
asked for **two** in this deck, and hard rule 18 in
`.claude/skills/slide-content-rules/SKILL.md` was rewritten to match rather than
given an exception. Session 8 does not need to ask.

- Slide 35 is the mid-deck quiz, at the concept 2 / concept 3 boundary.
  `PEDAGOGY_GUIDELINES.md` §8: after the concept the rest of the session depends
  on. Everything from Jenkins onward assumes the room can read pipeline, stage
  and gate.
- Slide 56 is the closing quiz, immediately before Key Takeaways.

Neither frame carries a question, options or an answer. The question is asked
from the quiz tool, so the deck never holds a second copy that can drift.

## R15 Every point is readable by an absolute beginner

Asked for on 2026-08-31, and recorded as `TEXT_GUIDELINES.md` §3b, which is the
full text. What it means while writing this deck specifically:

- **No unexplained jargon in a bullet.** `webhook`, `executor`, `workspace`,
  `gate`, `automation server`, `poll SCM` and `Jenkinsfile` each get a defining
  line on or before the slide that first uses them. §4 of the plan is the
  checkable list, and the slide numbers in it are a promise.
- **Expand CI/CD on slide 22**, then use the letters.
- **Never "simply", "just", "obviously", "of course".** They tell a stuck learner
  that being stuck is unusual.
- **Concrete before abstract**: the assembly line lands before the pipeline, the
  teammate who never ran the tests lands before "continuous integration".
- Every procedural step says what the learner will SEE.

## R16 `SpineFlow` has exactly five slots, and that is geometry

`slide-kit/slide-template/src/ui/flowchart/SpineFlow.tsx` is a fixed 1100px stage
with **five** spine slots of 180px on 230px centres. The first pass of slide 30
made `git push` a sixth node and `5 DEPLOY` rendered as a sliver hanging off the
right edge of the frame. All three harnesses would have passed it.

So: five spine nodes, never six. On slide 30 that means the five numbered stages
and no trigger node, which is also what the TR's own ASCII draws, an arrow coming
down into stage 1 rather than a box in the row. A trigger is not a stage, and it
belongs in the lead.

## R17 An `alt` branch needs a `decision` node or it renders off-canvas

`SpineFlow` positions the exception at `left(gateIdx)`, and `gateIdx` is the index
of the node whose `kind` is `'decision'`. With no decision in the graph it is
`-1`, so the exception card and its label are drawn at a negative x and bleed off
the left of the frame.

This is why slide 30 carries no failure branch and slide 32 does. It was decided
on the honesty argument first (a branch drawn from TEST cannot claim to be about
every stage) and the renderer turned out to agree.

## R18 The architecture chain is a sequence, not a machine boundary

`BoundaryBridge` was tried for the architecture chain and rejected on what it
CLAIMS, not on how it looks. It groups every `source` station inside one dashed
machine boundary and every `target` inside another, so on slide 40:

- Developer and GitHub landed inside a box captioned ONE COMPUTER, contradicting
  the ten slides of concept 1 whose entire job is to say GitHub is not on your
  computer.
- Docker Hub and AWS EC2 landed inside A DIFFERENT COMPUTER, when a registry is
  not the server that pulls from it.
- `issuedBy` printed "the sender types it" under the webhook leg, which is the
  one leg on the slide that nobody types.

The figure is correct for session 6, which is what it was designed against. Slide
40 uses `SpineFlow` with the four commands as edge labels, five stations in
exactly five slots. The rejected version is kept as slide 6 of
`slide-kit/cicd-lab` so the next person does not retry it.

## R19 Figures are prototyped in `slide-kit/cicd-lab` before the deck

This deck's four process-flow figures were built and screenshotted in a
seven-slide lab before a single deck slide was written. That lab found five
faults, every one of which passes `qa.mjs`, `video-safe.mjs` and
`align-check.mjs`, because all three measure DOM rectangles and a figure's
internal labels are invisible to them (hard rule 17).

The lab is `slide-kit/cicd-lab`, devPort 5227, `node_modules` symlinked to
`../slide-template/node_modules`. Change a figure's content there and look at the
picture before changing it in the deck.

## R20 Four kit changes went out with this session

All additive, all on `kit/station-logos-and-flow-labels`, and every session needs
`sync-kit.mjs --apply` to pick them up.

| # | Change | Where | Why |
|---|---|---|---|
| 1 | `StationLogo` gains `'github'` and `'jenkins'` | `src/ui/flowFigure.ts` | It was a closed union of five and the chain on slide 40 needs two more. `git` and `github` stay separate: one is the tool, one is the service, and this session names both |
| 2 | `FcNode` gains `logo?: StationLogo`, rendered by `NodeShell` on a white tile | `src/ui/flowchart/` | The flow-chart family had only `icon`, so three real marks had to be house glyphs. A `<>` glyph is not GitHub to anyone who does not already know |
| 3 | `SpineFlow` main-edge labels lift above the card row | `src/ui/flowchart/SpineFlow.tsx` | They sat inside the card band and started 4px into a 50px gap, so every label past four characters was overprinted: the chain rendered GIT PU, WEBH, DOCK, DOCK |
| 4 | `GateFlow` PASS and FAIL exits move clear of their cards | `src/ui/flowchart/GateFlow.tsx` | PASS rendered as PAS behind the next card and FAIL sat under the exception card. Positional, not editorial: no label short enough to fit exists, which is why shortening the node labels did not move it |

Changes 3 and 4 are the same defect in two variants: an edge pill parked in a gap
narrower than the pill. Worth checking `LaneFlow`, `CircuitMap` and `TrackSwitch`
for it before the next deck reaches for one.

## R21 The session is named "Introduction to Jenkins"

Short, and it matches session 6's handover frame word for word, which is what the
room was promised at the end of the last session. The TR's own title is longer
("Introduction to Jenkins and CI/CD") and the deck deliberately does not use it:
a deck whose name differs from the name the previous deck promised makes a
23-session course read as 23 unrelated topics.

`SESSION` in `src/decks/deckShared.tsx` is the single source. It is the footer
mark on every slide and the `WelcomeSlide` title, so nothing else may type it.
`htmlName` stays `deployment-session-7`, because the file name is addressed by
session number and not by title.

## Generation notes

Filled in as generation proceeds.

- **The deck shipped at 59 slides, not the plan's 54.** Two quiz frames (R14) and
  three slides the beginner rule earned (R15): `c2-gate`, `c3-is-it-running` and
  `c4-the-screen`, each a term that would otherwise have appeared in a bullet
  before it was defined anywhere.
- **Slide 44 taught the lever lesson the hard way.** A single bullet in `points`
  puts a `Terminal` in a half-width column, so the 70-character `docker exec`
  command wrapped at 13px, 11px and 10px in turn. Shrinking type was the wrong
  lever three times running; removing the bullet was the right one.
- **Slide 29 was fixed from a screenshot, not a harness.** Every card carried a
  house icon AND the company mark, and three cards repeated one sentence verbatim.
  No sweep can see either.

## Feedback log

Durable feedback from the user on this deck, recorded before it was applied.

- **2026-08-31, two quiz frames.** Reverses the sessions 5 and 6 standing
  instruction. Recorded in hard rule 18 rather than as a session exception, on
  the user's choice. See R14.
- **2026-08-31, points must be understandable for absolute beginners.** Recorded
  as `TEXT_GUIDELINES.md` §3b, on the user's choice. See R15.
