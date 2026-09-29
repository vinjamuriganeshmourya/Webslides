---
name: generate-slides
description: The complete, mandatory procedure for generating or regenerating slides in a NxtWave session deck. Use whenever the user says generate slides, build the deck, make the slides, create the deck, turn the plan into slides, add slides, or regenerate a deck, and whenever slides are produced from a slide-wise plan. Covers the plan gate and its required path, reusing the base template instead of writing new markup, choosing slide types, illustrations and figures, icons, transitions and reveal steps, when a new component is justified, the full render-based verification sweep, and the rule that durable user feedback is offered to a named skill file before it is applied. The user should never have to restate any of this.
---
<!-- cSpell:ignore colour colours neighbouring lucide deployement NxtWave devPort -->

# Generating slides

This is the whole procedure. The user asks for slides; **you** supply
everything below without being told. Never ask them to re-specify what is
written here.

---

## 0. Gate: is there a signed-off plan?

Slides are generated **from a plan**, never from a conversation.

The plan is at, and only at:

```
<course>/session_plans/<session_name>/plan.md
```

- **No plan there?** Stop. Do not generate a single slide. Write the plan
  first, following `slide-kit/workflow/SLIDE_WORKFLOW.md` stages 1 and 2, put
  it at that exact path, and hand it to the user for sign-off.
- **Plan exists but is not signed off?** Stop and ask for sign-off. Say plainly
  that you are holding at the gate.
- **User says "just generate, skip the plan"?** Say once that reordering after
  slides exist means rebuilding screenshots, animations and step counts, then
  do as they ask. Their call, not yours.

**Three things to check in the plan before generating**, all hard rules that are
cheapest to catch here (`PEDAGOGY_GUIDELINES.md` sections 2, 2b and 3):

1. **Two opening slides per concept, and a named framework.** The plan says
   which of STAR, 4MAT, SCQA or Merrill each concept runs, and the pick matches
   the kind of concept. One opening slide means the cost beat is missing and the
   mechanism will arrive cold. This is the single most common defect. **Never
   name a new framework at this stage** — the set grows at plan time, with the
   user's confirmation, or not at all.
2. **A term ledger, and no term used above its own introduction.**
3. **No artefact shown assembled on its first appearance.**

If the plan fails one of these, say which and fix the plan before generating —
re-cutting a generated deck costs screenshots, animations and step counts.

Re-read the plan in full at the start of every generation run, even one you
wrote yourself earlier in the session. Generate what the plan says, not what
you remember of it.

---

## 1. Load the rules before writing copy

Read these, in this order, and treat them as binding:

| File | Governs |
|---|---|
| `.claude/skills/slide-content-rules/SKILL.md` | **hard rules.** Banned punctuation and words, terminals, the STAR shape of a concept, prerequisite order, one element per slide, problem sequencing, one idea per slide, parallel reveal, chrome colour, illustration honesty |
| `slide-kit/workflow/TEXT_GUIDELINES.md` | titles, kickers, how a line should read |
| `slide-kit/workflow/PEDAGOGY_GUIDELINES.md` | **narrative flow.** Sections 2, 2b and 3 are hard rules: one named framework per concept opening on a need and closing on proof, nothing used before it is introduced, nothing shown assembled |
| `slide-kit/workflow/STYLE_GUIDE.md` | colour, type, which slide type suits which content |
| the session's own `CLAUDE.md`, and any skill in `<course>/workflow/skills/` | decisions already made for this specific deck |

The hard rules win over everything, including the user's phrasing in a
one-line request. If a rule blocks what was asked, say so and propose the
compliant version.

---

## 2. Reuse the template. Do not write new markup.

The kit already renders every slide shape this deck needs. **Compose existing
components; do not hand-roll layout, spacing or colour.**

Start from `slide-kit/slide-template/src/decks/sampleDeck.tsx` — the exhaustive
gallery of every slide type and figure. Whatever you are about to build is
probably in there already.

**Slide types** (`src/slides/`), one per shape of content:

`BrandSlide` · `WelcomeSlide` · `AgendaSlide` · `SectionBreakerSlide` ·
`SectionBreakerImageSlide` · `ContentSlide` · `ContentNoteSlide` ·
`ContentLeftImageSlide` · `ContentRightImageSlide` · `ContentTopImageSlide` ·
`ContentBottomImageSlide` · `OnlyImageSlide` · `CodeBuildSlide` ·
`CodeSyntaxSlide` · `CommandSyntaxSlide` · `ProceduralStepsSlide` ·
`FlowChartSlide` · `StatusPointsSlide` · `ScenarioSlide` · `ConversationSlide` ·
`ChatSlide` · `ChatCharacterSlide` · `QuestionSlide` · `QuestionPointsSlide` ·
`QuizTimeSlide` · `PracticeSlide` · `RecapSlide` · `KeyTakeawaysSlide` ·
`FeedbackSlide` · `ThankYouSlide`

**Four pairs are easy to confuse, and picking the wrong one is the commonest way
this content ships wrong.** The registry has the full text; the short version:

| If the content is | Use | Not |
|---|---|---|
| the SHAPE of a construct or command | `CodeSyntaxSlide` / `CommandSyntaxSlide` | `CodeBuildSlide`, `Terminal` |
| a real file built up, or a real command run | `CodeBuildSlide`, `ContentSlide` + `Terminal` | the syntax types |
| a list where rows carry verdicts | `StatusPointsSlide` | four stacked `Callout`s |
| an exchange, up to four short turns | `ChatSlide` | `ConversationSlide` |
| an exchange, five or more turns | `ConversationSlide` | `ChatSlide` |
| a question whose answer is the next slide | `QuestionSlide` | `QuestionPointsSlide` |
| a question answered by 2 to 3 points on the same frame | `QuestionPointsSlide` | `ContentSlide` |

**Building blocks** (`src/ui/`, all via the `@/ui` barrel):

`SlideBase` · `SlideHeader` · `Kicker` · `Chip` · `NumberBadge` · `BulletList` ·
`Card` · `CardGrid` · `StatTile` · `Callout` · `ChatThread` · `CodeBlock` ·
`Terminal` · `Shot` · `DataTable` · `FileTree` · `StepList` · `FlowChart` ·
`StatusList` · `SyntaxBreakdown` · `AnalogyMap` · `JourneyRoadmap` ·
`LayerStack` · `StackUp` · `ScenarioCard` · `Illustration` · `Nova` · `Reveal` ·
`RevealGroup` · `Decor` (`DotGrid`, `Blob`, `Orb`, `WaveArc`)

`Callout` takes five kinds plus `error`. `error` means "this does not work";
`warning` means "this can bite you". They were one colour until a deck needed to
say both on one slide.

Colour comes from `src/design/tokens.ts`. **Never write a hex literal in a
deck file.** If a colour you need is missing, that is a tokens change, raised
as such.

Anything under `src/design/`, `src/ui/`, `src/slides/`, `src/motion/` or
`src/deck/` is **kit-owned and gets overwritten by `sync-kit.mjs`**. Your deck
is `src/decks/<session>Deck.tsx` and nothing else. See
`slide-kit/slide-template/KIT.md`.

---

## 3. Illustrations and figures

A figure earns its place by making an argument a sentence cannot. Decorative
graphics are worse than none.

**Look for an existing figure first.** The kit already has domain figures, all
on the `@/ui` barrel: `ContainerJourney` · `TwoRuntimes` · `OneProcessRule` ·
`MachineBoundary` · `ComposeNetwork` · `VolumeSurvival` · `YamlNesting` ·
`Orchestra` · `HandRitual` · `AnalogyMap` · `LayerStack` · `JourneyRoadmap` ·
`StackUp` · `FileTree` · `FlowChart` · `Nova` (the character, with poses).

`TwoApps` and `RequestFlow` exist in `src/ui/` but are **not** on the barrel;
import them by path (`@/ui/TwoApps`) if you need them.

**The figure must depict this slide's own concept**, not the topic in general
(hard rule 8). A container diagram on a slide about networking is a decoration.

**Screenshots** go through `Shot`, from `public/shots/`, cropped to the point
being made with the relevant output highlighted (hard rule 11). Never a
full-window screenshot where a crop would do.

**Terminals** go through `Terminal`: one panel per terminal, with the folder
path shown (hard rule 3).

**Never invent output.** A terminal transcript, a file tree or a screenshot
must match what the command actually prints. If you have not run it, say so
rather than composing plausible output.

---

## 4. Icons

`src/ui/icons.tsx` is the house set: line icons on a 24-grid, `currentColor`,
`strokeWidth: 2`, dependency-free. **Use it.** `iconByName` on the `@/ui`
barrel resolves one by its `IconName`, which is how a plan or a data structure
names an icon without importing it. `lucide-react` is installed and available
for a genuine gap.

Icons inherit colour from context, so never colour one directly. An icon that
does not clarify what the label already says should be dropped, not chosen more
carefully.

---

## 4b. The vendored craft skills in `.agents/skills`

`.agents/skills/` holds third-party skills installed with `npx skills add`, and
`.claude/skills/` symlinks the ones relevant to a deck so Claude Code loads them
by description. `skills-lock.json` pins every one. **Do not edit a file under
`.agents/skills/`** — it is upstream content and the next `skills add` overwrites
it. Add a repo-specific rule to this file instead.

Reach for them by job:

| The job in front of you | Skill |
|---|---|
| authoring a reveal, a transition or a figure's entrance | `animate` |
| deciding whether something should animate at all | `animate`, `find-animation-opportunities` |
| reviewing motion you or another agent just wrote | `review-animations`, `12-principles-of-animation` |
| auditing a whole deck's motion and planning fixes | `improve-animations` |
| a figure that reads as flat, generic or off | `emil-design-eng`, `baseline-ui` |
| spacing, hierarchy and type on a slide that looks "almost right" | `baseline-ui` |
| auditing a deck's visual system against itself | `improve-ui` |
| motion that stutters on the projector or in the exported HTML | `fixing-motion-performance` |
| naming an effect so the user and you mean the same thing | `animation-vocabulary` |
| trying several designs for one figure before choosing | `prototype` |
| gesture, depth, materials, optical type | `apple-design`, `interaction-design` |
| an abstract divider or section illustration | `signal-geometry` |

**Two of these skills disagree with this repo, and the repo wins.**

1. **Durations.** `animate` caps UI animation at ~300ms with 30 to 80ms
   staggers, and it is right, for a control a person triggers dozens of times a
   day where the animation sits between them and what they came for. **A slide
   figure is that skill's own explanatory tier**: nobody triggers it, and it is
   read once from the back of a room while an instructor talks over it. This deck
   runs roughly double the UI numbers. Entrances 520ms, staggers 130ms, line
   draws 860ms, a whole figure assembled in about 2.4s. Session 6's figures were
   first built at UI speed and the user rejected them as too fast.

   Dividers stay a crossfade: a frame the room sees five times in one deck does
   belong in the "near-imperceptible or nothing" tier.

2. **Web-app assumptions.** These skills are written for interactive product UI.
   A deck has no hover, no drag, no routing and one viewport. Ignore everything
   about `:active` states, pointer capture, momentum, `prefers-reduced-motion`
   media queries (`src/index.css` already has one) and touch targets. Keep what
   is about perception: easing direction, never animating from `scale(0)`,
   transform-and-opacity only, stagger, and reviewing with fresh eyes.

`animate-expo`, `write-swift` and `ask-sonner` are installed but irrelevant here:
React Native, Swift and a toast library. There are no toasts in a deck.

Anything that hand-animates must still read `useInstant()` and mount at its final
state when true, or it will be the only thing moving during a Ctrl+arrow jump.

---

## 5. Transitions and reveal steps

Motion lives in `src/motion/`: `Reveal`, `Stepper`, `presets.ts`,
`continuity.ts`, `instant.ts`. Use the presets; do not write bespoke timings.

Two rules that cost real rework when missed:

- **Text and its supporting visual reveal together** (hard rule 6). A bullet
  arriving before the part of the figure it describes forces the room to read
  ahead and look back.
- **`continuity.ts` exists so an element shared by consecutive slides does not
  jump.** Check it before animating something that also appears on the
  neighbouring slide.

After the slide count is final, regenerate the step map:

```bash
node workflow/export/build-reveal-steps.mjs http://localhost:<devPort> <slideCount>
```

`src/export/revealSteps.ts` is generated. Never hand-edit it.

---

## 6. A new component goes back into the kit, and reaches it through a PR

Prefer composing. Build a new component **only** when the plan calls for an
argument no existing figure makes, and it will be reused or is too complex to
inline.

### It does not stay in the session

**Anything built while generating a session that a second deck would want is
copied back into `slide-kit/slide-template`.** Not left in the session, not
copied later, not "noted for next time".

This is not a tidiness rule. It is the rule this repo most often broke, and the
cost is measurable in the corpus:

- The syntax-anatomy figure was hand-rolled **three times**: `PortPublish` and
  `ExecAnatomy` in session 4, then `TargetAnatomy` in session 5. Session 5 had to
  rediscover, by shipping the bug, that session 4's SVG version put its labels on
  top of each other invisibly to every harness. It is now `SyntaxBreakdown` in the
  kit.
- A question posed to the room was written as a `ContentSlide` with an empty body
  in three sessions before `QuestionSlide` existed.
- `BrandSlide`, `CodeBuildSlide` and `QuizTimeSlide` sat in the kit, exported and
  working, **missing from the gallery** for several sessions. Decks were written
  as though they did not exist, because as far as the gallery was concerned they
  did not.

The test is the workflow's usual one: *would a different deck, next month, want
this?* A one-off arrangement for a single slide stays inline in the deck file.

### The procedure

`slide-kit/slide-types/README.md` holds the full text. The eight steps in short:

1. **Get approval.** The user says so; "it looked fine" is not approval.
2. **Move it into the kit** — `src/slides/`, `src/ui/` or `src/motion/` — and
   export it from the barrel. The session then imports it from the kit like
   everything else and keeps **no private copy**, or the two drift.
3. **Add it to `src/decks/sampleDeck.tsx`**, with a `notes` string saying what it
   is FOR, what it must not carry, and which type it is confusable with. The
   gallery is the only discovery mechanism there is.
4. **Add a row to the registry**, saying when to reach for it.
5. **Colours from `src/design/tokens.ts`, motion from the presets.**
6. **Verify by rendering**, through all four harnesses, at 1280x720. A new type
   has been tested at one content length on one slide, which is not tested.
7. **Commit it to the kit and raise a PR.** On a branch, never on `main`:

   ```bash
   git checkout -b kit/<the-type-name>
   git add slide-kit/slide-template slide-kit/slide-types/README.md
   git commit -m "feat(kit): <TypeName>, <what it is for>"
   gh pr create --fill
   ```

   The PR exists because `sync-kit.mjs --apply` will push this to **every other
   session**, including signed-off ones. That is a change worth a review before
   it can reach a recorded deck. Name in the PR body which sessions are expected
   to sync.
8. **Say that you changed the kit**, and name the sessions needing
   `sync-kit.mjs --apply`.

### Assets and content, the same way

Hard rule 13 already says every asset lands in `slide-kit/assets/` first and is
then copied into the session. The same holds for anything else a session needs
that is not session-specific: an icon, a tech logo, a figure, a slide type. The
central copy is the real one.

## 6b. Render the reference before you write a line of the deck

**If the session has a pedagogy-team lesson plan, it is a working deck, not a
spec.** `prog_foundations_LP/<session>/*_student_view_new_design.html` opens in
a browser and holds one finished slide per `.pcard` -- 24 of them for session
14. Screenshot every one of them and keep them beside you.

```bash
# ~40 seconds, once, at the start
node - <<'JS'
import { chromium } from 'playwright-core'
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH })
const p = await b.newPage({ viewport: { width: 1280, height: 900 } })
await p.goto('file:///abs/path/to/..._student_view_new_design.html', { waitUntil: 'networkidle' })
await p.waitForTimeout(1500)
for (const [i, c] of (await p.$$('.pcard')).entries())
  await c.screenshot({ path: `/tmp/ref-${String(i + 1).padStart(2, '0')}.png` })
await b.close()
JS
```

**Why this is a numbered step and not a tip.** Session 14 was built by reading
that file's HTML and CSS as text -- extracting its SVG paths, its chip hexes,
its `data-anim-labels` -- and rebuilding each slide from the markup, without
ever rendering it. The result cost the user six to seven hours of sending
screenshots back: the tilted quiz card, the takeaways map, the three-column
trace, the day strip, the IO panel sizes. Every one of those was already
rendered in a file the model had open.

Reading a reference's markup tells you its DOM. It does not tell you what it
looks like, and what it looks like is the brief.

---

## 6c. Iterate on one slide. Sweep the deck once.

The three harnesses in section 7 settle **2600ms on every slide**. On a
44-slide deck that is two to four minutes per run, and it reports the same known
baseline nearly every time. Running it after each edit is the single largest
waste of wall clock in this repo.

- **While working on a frame:** screenshot that frame alone and look at it.
  Navigate by hash (`http://localhost:<devPort>/#/31`), not a query parameter.
- **Before committing a block of work:** run the full sweep once.

Look at every build at **step 0, mid-run and fully revealed.** Most of session
14's layout defects existed at exactly one of the three: variable boxes that
appeared mid-run and pushed the controls under the player bar, a caption row
that was empty until the first press and shifted the column into the lead, a
week strip whose running totals vanished on the last step.

**And know what the harnesses cannot see.** They catch collisions with the
instructor-video rectangle and the player bar. They do not catch a recap that
renders empty, an OUTPUT panel tinted the danger colour, a frozen animation, or
a figure that is simply ugly. On session 14 the user caught all four. Looking at
the PNG is the review; the harnesses are the gate.

---

## 6d. Fix the class, not the instance

A correction on one slide is almost always a correction on every slide of that
shape. Before replying, grep for the construct and fix all of it, then say which
slides were swept so the user does not have to check.

| What was asked | What it actually was |
|---|---|
| "slide 16 centre the code box" | every code-plus-panel frame: 16, 35, 38, 40 |
| "slides 35 and 38 are too small" | one component, two call sites |
| an OUTPUT header reading as an error | `IoPanels` `TONE.out = colors.danger`, every IO frame in the deck |

Three separate user rounds were spent on the first row alone.

---

## 6e. One deck, one worker

**Do not split a single deck across parallel agents by slide range.** Slides
look independent and are not: they share figures, the kit, the step engine and
the visual system, so two agents given "18 to 30" and "31 to 44" both edit
`VariableTrace`, `DayStrip` and `dailyChallenge.tsx`.

Session 14 was split three ways. One agent's entire slide-31 rebuild was
superseded and never merged, because the same slide had been rebuilt
independently an hour later; another's `DayStrip` change conflicted and had to
be hand-merged, and contradicted an explicit user instruction. The coordination
cost lands on the merge, which is the most expensive place for it to land.

Agents are for genuinely separate artefacts: another session, a lab, a research
pass, a skill write-up. If the user asks for parallel progress on one deck, say
plainly why the ranges are not separable and offer the alternative.

---

## 7. Verify by rendering. Never by reading.

Hard rule 10, and the one most often skipped. Reading your own JSX is not
verification.

```bash
npm run typecheck
npm run build:html

export CHROME_PATH=/opt/google/chrome/chrome
# The three sweeps are independent processes against the same dev server.
# Run them in PARALLEL: sequentially they take three times as long for nothing.
node video-safe.mjs  > /tmp/vs.txt 2>&1 &   # must print CLEAN
node qa.mjs          > /tmp/qa.txt 2>&1 &   # baseline is TWO flagged slides
node align-check.mjs > /tmp/al.txt 2>&1 &   # misplaced-but-inside-the-frame
wait

node preview.mjs && node scripts/build-preview-page.mjs
```

Each harness settles 2600ms per slide before measuring, because `AgendaSlide`
cues its items off a curve that takes ~2.38s to draw. On a 79-slide deck that
is 3.4 minutes of deliberate waiting per harness, so the parallel run matters.
Do not lower the settle time to speed it up: `KIT.md` records a signed-off
preview that shipped with every agenda captured two items in.

**Then look at the figures.** The three harnesses measure DOM rectangles, so an
`<svg>` is one box to them and a figure whose internal labels collide passes
every sweep. Screenshot each slide carrying a custom figure and inspect the
image, or read the contact sheet `build-preview-page.mjs` writes. Content rule
17 has the detail and the two collisions that prompted it.

**All four, every time. `align-check.mjs` is not optional.** `qa.mjs` only
catches content that leaves the 1280x720 frame and `video-safe.mjs` only
catches content that enters the instructor-video rectangle. Neither has any
opinion about content that is comfortably inside the frame and still wrong: a
narrow figure stranded in a full-width block, two blocks overlapping, a column
hard against an edge. Session 4 was reported clean by the first two and the
user still opened it to find overlapping slides, because this harness was
skipped.

`qa.mjs`'s expected baseline is **two** slides, both benign: the Welcome slide
(`NO LOGO`, plus its `pointer-events-none` decorative blobs) and the Thank you
slide (`NO LOGO`, because it carries the mark on stage instead of in the
footer). Anything else is a regression.

**Re-run `video-safe.mjs` and `qa.mjs` as a pair after any layout change.**
They pull in opposite directions: video-safe wants content pushed down out of
the top-right rectangle, qa wants it to fit above the bottom of the frame, and
every pixel a fix adds at the top is a pixel lost at the bottom. Satisfying one
alone will break the other, which happened twice while building session 4.

Three levers fix a slide that trips either one, and picking the wrong one
wastes a sweep:

| Symptom | Lever |
|---|---|
| Content sits too high, into the video rectangle | give the slide a `lead`, which grows the header |
| A panel is genuinely too long | `fontSize` on `CodeBlock` or `Terminal`. **Not `maxHeight`**: that only adds an inner scroll, and the harnesses measure the un-clipped rect, so the number does not move |
| Content is narrow by nature but drawn full width | cap the width and align it left. The rectangle starts at x=913, so a block ending before it can be as tall as the well allows |

Before running any of it, **update `slideCount` in `deck.config.json`** if the
count changed. Every harness reads it, and a stale count makes the sweep stop
early and report success on slides it never looked at.

Then look at the output. `qa.mjs` flagging something is not noise to wave past.
If a captured slide looks mid-animation, the settle time is the suspect —
`KIT.md` explains why the harnesses wait 2600ms.

Report honestly: what passed, what failed, what you did not run.

---

## 8. Feedback: ask whether to record it, then record it before applying

When the user gives feedback on slides, **the fix is the smaller half.** The
same correction arriving a third time means it was never written down.

So, on feedback that is **durable and general**, ask:

> Should I add this to `<the specific file>` so it holds for future decks?

Ask **before** applying it, then apply it. Do not silently record it: the user
decides what becomes a rule.

### Which feedback to ask about

Not every remark is a rule, and asking after each one is its own kind of noise.

| Ask about it | Do not ask |
|---|---|
| a correction that would apply to the next deck too | a typo, a wrong number, a factual fix |
| a stated preference — wording, colour, density, pacing | a one-off "move this box left" |
| "never do X" / "always do Y" | a change the plan already called for |
| the second time the same correction is given | anything already written in a skill |

The test: **would this have changed what I did, on a different deck, next
month?** If yes, ask. If it only makes sense for this slide, just fix it.

When the same correction lands twice, do not ask any more — say that it has now
come up twice and propose the exact wording to record.

### Where it goes

| Scope | File |
|---|---|
| this one session only | `<course>/workflow/skills/<session>/SKILL.md` |
| how slides get generated, anywhere | this file |
| a hard content or wording rule | `.claude/skills/slide-content-rules/SKILL.md` |
| wording and tone | `slide-kit/workflow/TEXT_GUIDELINES.md` |
| teaching structure | `slide-kit/workflow/PEDAGOGY_GUIDELINES.md` |
| colour, type, slide-type choice | `slide-kit/workflow/STYLE_GUIDE.md` |

Name the file when you ask, not just "the skill" — the user should know what
they are agreeing to change.

**Write the reason, not just the rule.** Every rule in
`slide-content-rules/SKILL.md` says which shipped deck it exists because of.
A rule without its reason gets argued away by the next person.

---

## 9. Chase the dependents

Hard rule 9. Changing content changes more than one file. After edits, check:

- `deck.config.json` — `slideCount`
- `src/export/revealSteps.ts` — regenerated, not edited
- the agenda and section dividers — one divider per concept
- recap and takeaways slides — they restate content that may have moved
- the plan at `<course>/session_plans/<session_name>/plan.md` — update it so
  the plan and the deck do not drift apart
- screenshots in `public/shots/` — a changed command means a changed capture

---

## The short version

Plan at `<course>/session_plans/<session_name>/plan.md`, signed off → read the
hard rules and the guidelines → compose kit components, never new markup →
figures that argue, icons from the house set, motion from presets at the
explanatory tier → build → render and sweep all four harnesses → anything new and
reusable goes back into the kit, into the gallery, into the registry, and out as
a PR → offer durable feedback to a named skill file → update the dependents and
the plan.
