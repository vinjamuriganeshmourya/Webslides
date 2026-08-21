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

Re-read the plan in full at the start of every generation run, even one you
wrote yourself earlier in the session. Generate what the plan says, not what
you remember of it.

---

## 1. Load the rules before writing copy

Read these, in this order, and treat them as binding:

| File | Governs |
|---|---|
| `.claude/skills/slide-content-rules/SKILL.md` | **hard rules.** Banned punctuation and words, terminals, problem sequencing, one idea per slide, parallel reveal, chrome colour, illustration honesty |
| `slide-kit/workflow/TEXT_GUIDELINES.md` | titles, kickers, how a line should read |
| `slide-kit/workflow/PEDAGOGY_GUIDELINES.md` | how a concept is taught across consecutive slides |
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

`WelcomeSlide` · `AgendaSlide` · `SectionBreakerSlide` ·
`SectionBreakerImageSlide` · `ContentSlide` · `ContentNoteSlide` ·
`ContentLeftImageSlide` · `ContentRightImageSlide` · `ContentTopImageSlide` ·
`ContentBottomImageSlide` · `OnlyImageSlide` · `CodeBuildSlide` ·
`ProceduralStepsSlide` · `FlowChartSlide` · `ScenarioSlide` · `QuizTimeSlide` ·
`PracticeSlide` · `RecapSlide` · `KeyTakeawaysSlide` · `FeedbackSlide` ·
`ThankYouSlide` · `BrandSlide`

**Building blocks** (`src/ui/`, all via the `@/ui` barrel):

`SlideBase` · `SlideHeader` · `Kicker` · `Chip` · `NumberBadge` · `BulletList` ·
`Card` · `CardGrid` · `StatTile` · `Callout` · `CodeBlock` · `Terminal` ·
`Shot` · `DataTable` · `FileTree` · `StepList` · `FlowChart` · `AnalogyMap` ·
`JourneyRoadmap` · `LayerStack` · `StackUp` · `ScenarioCard` · `Illustration` ·
`Nova` · `Reveal` · `RevealGroup` · `Decor` (`DotGrid`, `Blob`, `Orb`,
`WaveArc`)

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

## 6. When a new component is justified

Prefer composing. Build a new component **only** when the plan calls for an
argument no existing figure makes, and it will be reused or is too complex to
inline.

If you do:

1. It goes in `src/ui/`, exported from `src/ui/index.ts`.
2. Colours from `src/design/tokens.ts`. No hex literals.
3. Animation through `src/motion/` primitives, so it settles with everything else.
4. It renders correctly at the deck's fixed slide size, not just in isolation.
5. Say clearly that you added to the **kit**, since `sync-kit.mjs` will push it
   to every other session.

A one-off arrangement for a single slide belongs inline in the deck file, not
in `src/ui/`.

---

## 7. Verify by rendering. Never by reading.

Hard rule 10, and the one most often skipped. Reading your own JSX is not
verification.

```bash
npm run typecheck
npm run build:html

export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs      # must print CLEAN
node qa.mjs              # only slide 1 should be flagged
node preview.mjs && node scripts/build-preview-page.mjs
```

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
figures that argue, icons from the house set, motion from presets → build →
render and sweep → offer durable feedback to a named skill file → update the
dependents and the plan.
