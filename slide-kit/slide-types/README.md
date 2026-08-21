<!-- cSpell:ignore NxtWave deployement -->
# Approved slide types, figures and transitions

The registry of what has been built and signed off, so the next deck reuses it
instead of reinventing it. **A new slide type or transition is not finished
when it renders — it is finished when it is here and in the kit.**

This file is an index. The components themselves live in the kit and are
propagated by `sync-kit.mjs`; nothing is duplicated here, so nothing can drift.

---

## Slide types

`slide-kit/slide-template/src/slides/`, exported from `src/slides/index.ts`.

| Type | Use for |
|---|---|
| `WelcomeSlide` | the opener |
| `AgendaSlide` | the session's concepts, one line each |
| `SectionBreakerSlide` | one per concept, and only one |
| `SectionBreakerImageSlide` | a divider that carries an image |
| `ContentSlide` | the default: a claim and its support |
| `ContentNoteSlide` | content with a callout that must not be missed |
| `ContentLeftImageSlide` `ContentRightImageSlide` `ContentTopImageSlide` `ContentBottomImageSlide` | content beside a figure or capture |
| `OnlyImageSlide` | the image is the whole argument |
| `CodeBuildSlide` | code assembled step by step |
| `ProceduralStepsSlide` | an ordered procedure the learner will repeat |
| `FlowChartSlide` | a process with branches |
| `ScenarioSlide` | a situation posed before its resolution |
| `QuizTimeSlide` | the quiz announcement frame only |
| `PracticeSlide` | hands-on work |
| `RecapSlide` | what was covered |
| `KeyTakeawaysSlide` | what to remember |
| `FeedbackSlide` `ThankYouSlide` `BrandSlide` | the closing chrome |

`QuizSlide` was **retired**: quizzes are delivered by an external component, so
a deck's only quiz frame is the announcement one. `sync-kit.mjs` deletes it
from any session that still has it.

## Figures

`slide-kit/slide-template/src/ui/`, on the `@/ui` barrel.

`AnalogyMap` · `ComposeNetwork` · `ContainerJourney` · `DataTable` ·
`FileTree` · `FlowChart` · `HandRitual` · `JourneyRoadmap` · `LayerStack` ·
`MachineBoundary` · `Nova` · `OneProcessRule` · `Orchestra` · `ScenarioCard` ·
`StackUp` · `StepList` · `Terminal` · `Shot` · `TwoRuntimes` ·
`VolumeSurvival` · `YamlNesting`

Not on the barrel, import by path: `TwoApps`, `RequestFlow`.

## Transitions and reveals

`slide-kit/slide-template/src/motion/`.

| Kind | Where |
|---|---|
| slide transitions: `slide` `fade` `zoom` `rise` `cover` `flip` `none` | `presets.ts`, `SlideTransition` |
| reveal directions: `up` `down` `left` `right` `scale` `fade` | `presets.ts`, `RevealDirection` |
| stagger for a group of children | `presets.ts`, `staggerContainer()` |
| element-level reveal | `Reveal.tsx` — `Reveal`, `RevealGroup` |
| click-gated build steps | `Stepper.tsx` — `Stepper`, `Step`, `useReveal` |
| shared elements that must not jump between slides | `continuity.ts` |
| the `?all` capture mode that forces every step open | `instant.ts` |

**Use these.** A bespoke timing written inline in a deck is the thing this
registry exists to prevent.

---

## Promoting a new slide type or transition

A one-off arrangement for a single slide stays inline in that deck. Promote
only what the user has approved and a second deck will want.

1. **Get approval.** The user confirms it is worth keeping. Approved means
   they said so, not that it looked fine.
2. **Move it into the kit** — `src/slides/` for a slide type, `src/ui/` for a
   figure, `src/motion/` for a transition — and export it from the barrel.
3. **Add it to `src/decks/sampleDeck.tsx`.** The gallery is how the next person
   discovers it, and it is kit-synced, so a component missing from it is
   invisible.
4. **Add a row here**, saying what it is *for*. A name alone does not tell the
   next person when to reach for it.
5. **Colours from `src/design/tokens.ts`, motion from the presets.** No hex
   literals, no bespoke timings.
6. **Say that you changed the kit**, because `sync-kit.mjs` will push it to
   every other session.

Retiring works the same way: add it to `remove:` in `sync-kit.mjs` with the
reason, and say here that it is retired and why, the way `QuizSlide` is above.
Sessions that still reference it fail their own typecheck, which is intended.
