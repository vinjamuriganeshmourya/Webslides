---
name: session-6-deck
description: Build rules and feedback log for Deployment Session 6, "Pushing Image to Docker Hub". Use when generating, editing or reviewing any slide in django_deployement_course/deployement_session_6, its plan at session_plans/deployement_session_6/plan.md, or its two session-owned figures.
---

# Session 6 deck — build rules

Session 6 is "Pushing Image to Docker Hub": 53 slides, four concepts, devPort
5217, `htmlName` `deployment-session-6`, TR
`/home/nxtwave/docker_jenkins_aws/06_pushing_docker_images_to_docker_hub.md`.

The rules below are this deck's, on top of the workspace content rules. Each one
exists because of something in the TR, in the guidelines, or in a previous
session that would otherwise be rendered wrong here.

## R1 Titles are topic-bare, two to four words

The kicker on every content slide is the concept name, so a title never restates
which concept it is inside. Session 5's first draft shipped seven-word editorial
headlines on five slides and had to be rewritten before sign-off; this deck was
planned at the right length instead.

## R2 The same artifact keeps the same title

Slides 46 and 48 are both `Makefile`, because they are the same file. The corpus
repeats a title verbatim for a build sequence and never says "continued".

## R3 `CodeBlock`'s `language` prop is also the chip label

It defaults to `'python'`. Every Makefile panel passes `language="makefile"`,
every shell panel `language="bash"`. Omitting it ships a `python` chip on a
Makefile with no type error, which is what session 3 did.

## R4 Every indented Makefile line is a real tab

`MK_SESSION_5` and `MK_WITH_PUSH` in `deckShared.tsx` use `\t`. Session 5 spent
three slides teaching that Make accepts exactly one indentation character, and
this deck must not contradict the one before it.

## R5 A wide child means the slide carries a `lead`

A lead-less slide with a full-width `Terminal`, `CodeBlock`, `DataTable`,
`FlowChart`, `LayerStack` or figure reaches into the instructor-video rectangle
(x 913..1280, y 0..220) and fails `video-safe.mjs`. Ten slides failed exactly
this way on session 4's first sweep.

## R6 Nothing is captured, everything is quoted

Docker Desktop cannot run on the capture machine. This session additionally
needs a real Docker Hub account and a real push, so a capture is impossible
rather than merely inconvenient. Every command, output line, size and digest
comes from the TR verbatim.

The slide this constrains most is 35, the Hub repository page: it is text plus a
`CodeBlock`, never a browser screenshot, and never a reconstruction of one.

## R7 No quiz, no practice, no feedback, and no recap slide

The closing frame is Key Takeaways, Next session, Thank you. Standing user
instruction, given while editing session 5 on 2026-08-25 and restated when this
plan was signed on 2026-08-26.

## R8 Key Takeaways carries the four agenda concepts, verbatim

Not reworded outcomes, and never a fifth item. Session 5 shipped reworded
outcomes and they were replaced with the agenda strings.

## R9 The next-session frame carries `kicker="Next session"` and no `index`

Sessions 2 and 3 both pass that kicker; session 4 dropped it and its handover
frame reads as a sixth section divider. Without the kicker the slide is an
unlabelled navy title, which is exactly what a divider looks like.

## R10 A definition names what, why here, and where they met it

Every term in §3 of the plan is defined in a note or callout carrying all three:
what it is, why it exists at this point in the session, and where the room has
already met it if they have. A bare gloss is not a definition in this course.

## R11 Every technology named on a slide carries its PNG

Through the shared `Tech` component only, and only these five, which are the
ones on disk: `docker`, `python`, `nodejs`, `git`, `makefile`. `TECH_SRC` in
`deckShared.tsx` uses literal paths, not a template literal, because
`scripts/inline-assets.mjs` scans the built HTML for literal `/assets/...`
strings and a template literal ships a broken image in the single-file deck.
Session 3 shipped that bug.

## R12 Motion follows the `animate` skill, at its EXPLANATORY tier

From `.agents/skills/animate` and `.agents/skills/animation-vocabulary`:
entrances are `ease-out` on the kit's `easing.soft`, transform and opacity only
(plus `pathLength` for a line drawing), never `scale(0)` but `0.97`, and every
beat is named from the vocabulary rather than called "fade in".

**Durations come from `figureTiming` and are roughly double that skill's UI
numbers.** Its 300ms cap and 70ms stagger are for a control a person triggers
dozens of times a day, where the animation sits between them and what they came
for. A slide figure is the skill's own explanatory tier, which says plainly that
durations can be longer: nobody triggers it, and it is read once from the back of
a room while an instructor talks over it. The first pass of this deck's figures
ran at UI speed and the user rejected it as too fast. Entrances 520ms, staggers
130ms, line draws 860ms, a whole figure assembled in about 2.4s.

Dividers stay a crossfade, because a frame the room sees five times in one deck
does belong in the "near-imperceptible or nothing" tier.

Anything that hand-animates must read `useInstant()` and mount at its final
state when true, or it will be the only thing moving during a Ctrl+arrow jump.

---

## R13 Slides 20 and 38 use `BoundaryBridge`, not `FlowChart`

`FlowChart` cannot label an edge, so the first version of slide 20 rendered
`docker push` as a pill-shaped NODE: a command drawn as a place. It also draws a
push and a pull as the same left-to-right arrow, and gives the registry the same
weight as the laptop.

`BoundaryBridge` was chosen out of four candidate designs in
`slide-kit/flow-lab` and promoted to the kit. Two rules come with it:

- **Every payload arrow runs along the chain**, `stations[i]` to
  `stations[i+1]`. The image data travels laptop to Hub on a push and Hub to
  machine on a pull, so nothing ever points back up the chain. `issuedBy` says
  who typed the command and is drawn as a subordinate hairline, never as a
  second arrow. The user rejected the first pass for exactly this.
- **Timing comes from `figureTiming`.** Entrances 520ms, staggers 130ms, draws
  860ms, whole figure assembled in about 2.4s. The `animate` skill's 300ms cap
  is for interactive UI; a slide figure is its explanatory tier, and the first
  pass at UI speed was rejected as too fast.

## Generation notes

Filled in as generation proceeds, so a later reader knows what the plan could
not have known.

- The deck is assembled from three part files plus `deckShared.tsx`, because it
  was generated by three agents in parallel. See this session's `CLAUDE.md` for
  what belongs in the shared file and what belongs in a part.

## Feedback log

Durable feedback from the user on this deck, recorded before it is applied.

- (none yet)
