# The Design System

A design document that is itself a deck. **57 slides, port 5241.**

It states every standing rule in this repo and demonstrates each one on the frame
that states it, so a rule and its example cannot drift apart. `RULES.md` already
indexes the rules as text; a rule about type size, chrome colour, reveal timing or
figure choice is only checkable when you are looking at it.

Plan: `../session_plans/design_system/plan.md`, signed off 2026-09-23 on the five
decisions in its §2.

```bash
npm install
npx vite --port 5241 --strictPort
npx tsc --noEmit -p tsconfig.app.json
```

`npm run typecheck` and `npm run build:html` fail on `src/export/slideModule.tsx`
importing two generated files that are gitignored and absent. That is pre-existing
across the whole repo; the `tsc` line above is the correctness check that works.

---

## Where the content comes from

Nothing on a slide was written fresh. Every claim is copied from a file:

| Content | Source |
|---|---|
| the 21 hard rules | `.claude/skills/slide-content-rules/SKILL.md` |
| the rule index, the process rules | `RULES.md` |
| type scale, colour ramps, grounds | `tailwind.config.ts`, `src/design/tokens.ts` |
| text budget, voice, titles | `slide-kit/workflow/TEXT_GUIDELINES.md` |
| form from the argument | `slide-kit/workflow/STYLE_GUIDE.md` §8 |
| slide-type choice, the confusable pairs | `.claude/skills/generate-slides/SKILL.md` §2 |
| the motion tier | same, §4b |
| the canvas and the video rectangle | `video-safe.mjs`, `src/ui/SlideBase.tsx` |

**If a number on a slide and a number in one of those files disagree, the file is
right and the slide is a bug.**

## Two slides verify themselves

This is the nicest property of a deck like this, and both checks are worth
re-running after any edit to those slides.

**Slide 36 is hard rule 16 by being it.** A `QuestionSlide` with no bullets, no
figure, no callout and no answer; the answer is slide 37. Measured without `?all`:
0 lists or tables on the slide, and the full text is the kicker plus the question.
Do not add a figure here to balance the frame.

**Slide 48 is hard rule 6 by being it.** A `ContentSlide` with both `points` and
`children`, which is the kit's parallel path: the bullets get `immediate` and the
figure is wrapped in `Reveal`, never `Step`. Measured without `?all`: all five
bullets rendered, nothing below 0.9 opacity, no leftover build steps. If a later
edit wraps that figure in a `Step`, the slide starts contradicting the rule it
states.

## The one new component

**`CanvasMap`**, in the deck file. The 1280x720 frame drawn to scale with the
reserved video rectangle and the header datum on it, used on slides 5, 7 and 48.

Nothing in the kit draws a coordinate space: `LayerStack` draws depth,
`MachineBoundary` a boundary between machines, `FlowChart` a process,
`JourneyRoadmap` position along a path. Each would be a decoration on those
slides.

It is **DOM divs, never an `<svg>`** (content rule 17), and `pointer-events-none`
on the whole figure, because `video-safe.mjs` skips a decorative layer on exactly
that class. Without it, a figure that DRAWS the reserved rectangle gets reported
as content sitting inside it.

**It has not been promoted to the kit, and it should be.** Generate-slides §6 and
hard rule 14 both say a reusable component goes into `src/ui/`, into
`sampleDeck.tsx`, into `slide-kit/slide-types/README.md`, and out as a PR on a
`kit/` branch, because `sync-kit.mjs --apply` pushes it to every session including
signed-off ones. That last step is a decision for the user, not for whoever is
editing this deck.

**Two of its numbers were fixed by screenshotting it, which is rule 17 working.**
The dimmed state was 0.35 and rendered as an empty box, and the datum was a 34x2
corner tick that read as a stray hairline. Both are noted at the call site.

## Writing about rules while obeying them

Four rules govern the deck file, and the header comment in
`src/decks/designSystemDeck.tsx` carries them in full. The one that will confuse a
future reader:

**Slides 30 and 31 contain the banned em dash on purpose.** The repo's check is
`grep -n "—" src/decks/*.tsx` and on this deck those hits are the subject matter.
Every one sits in a "Do not" column so it cannot be read as the deck's own voice.

## What is deliberately NOT in it

- **The A.png / C.png zone work.** It is under test in
  `../beta_testing_slides` and is not a rule. Putting it in a deck of rules would
  make it look like one. Plan decision D3.
- **Hard rule 4** (name a later problem, never open it). It governs how a course
  sequences problems across sessions, and this deck opens no problem. Covering it
  would mean inventing an example, which is the one thing the deck must not do.
- **A screenshot on slide 50**, the slide about cropping screenshots. There is no
  real capture in this project, and inventing one would break the rule the slide
  states.
- **Rule 15 has no slide of its own.** The plan gave it one; it is a note on slide
  46 instead, which kept the deck at 57 rather than 58. The rule is still stated in
  full.

## Dividers carry no art, on purpose

`slide-kit/assets/illustrations/` holds five drawings: bookshelves, a location
pin, switches, tasks and a setup scene. None depicts the canvas, the token system,
writing, or choosing a form. Hard rule 8: a blank but honest divider beats a
misleading picture.

**Outstanding work: four divider illustrations**, one per concept.

## Verification, as run

```bash
node video-safe.mjs   # CLEAN
node qa.mjs           # slides 1 and 57 only, which is the expected baseline
node align-check.mjs  # 0 of 57
node fit-check.mjs
```

`qa.mjs`'s two flagged slides are the documented baseline: slide 1 `BrandSlide`
(NO LOGO by design, plus its `pointer-events-none` decorative blobs) and slide 57
`ThankYouSlide` (NO LOGO, because it carries the mark on stage). Anything else is
a regression.

Six fixes were needed to reach that, and each is a worked example of the levers in
generate-slides §7:

| Slide | Was | Fix |
|---|---|---|
| 54 | `StatusList`'s verdict chip landed at x 1114, y 205, inside the video rectangle | capped the list at 840px, so it ends before x=913 |
| 9 | the callout block hung 31px below the frame | dropped `ContentNoteSlide` for `ContentSlide`, the note became a fourth `StatusList` row |
| 23, 49 | same overhang | shorter note bodies, and `compact` on the table |
| 15 | nine table rows ran under the control cluster | `compact` |
| 12 | a 28-character mono string wrapped as one token in the narrow column | dropped `points` so the list gets full width |
| 44 | the runserver URL wrapped as one token | `fontSize={12}` and a shorter transcript |

**`video-safe` and `qa` pull in opposite directions.** Every pixel a fix adds at
the top is a pixel lost at the bottom, so re-run them as a pair after any layout
change here.
