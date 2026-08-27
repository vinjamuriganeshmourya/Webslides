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
| `QuestionSlide` | the pause beat: one question, hero scale, centred, nothing else |
| `QuestionPointsSlide` | a question, then the points that answer it, as build steps |
| `CodeSyntaxSlide` | the SHAPE of a language construct, slot by slot |
| `CommandSyntaxSlide` | the SHAPE of a command, slot by slot. Runs nothing |
| `StatusPointsSlide` | points that each carry a verdict: works, careful, fails, note |
| `ConversationSlide` | a two-voice exchange as a transcript. The dense form |
| `ChatSlide` | the same exchange as messages. Up to five short turns |
| `ChatCharacterSlide` | the messages, with Nova beside them |
| `QuizTimeSlide` | the quiz announcement frame only |
| `PracticeSlide` | hands-on work |
| `RecapSlide` | what was covered |
| `KeyTakeawaysSlide` | what to remember |
| `FeedbackSlide` `ThankYouSlide` `BrandSlide` | the closing chrome |

`QuestionSlide` was **added in session 4**. A question posed to the room used to
be written as a `ContentSlide` with a lead and no points, which inherits the
content layout: the question sits top-left at lead size with an empty well
beneath it, so the one thing the room should be thinking about is neither the
largest thing on screen nor centred on it. See content rules 16.

### The four types added for the slide-type gallery

`CodeSyntaxSlide` and `CommandSyntaxSlide` exist because explaining a GRAMMAR had
no home. A one-line `CodeBlock` reads as a file the learner should create, and a
one-line `Terminal` reads as a command that printed nothing. Four types now cover
the two axes, and picking the wrong quadrant is the commonest way this content
ships wrong:

|            | the SHAPE of it      | an INSTANCE of it         |
|------------|----------------------|---------------------------|
| a file     | `CodeSyntaxSlide`    | `CodeBuildSlide`          |
| a command  | `CommandSyntaxSlide` | `ContentSlide` + `Terminal` |

`StatusPointsSlide` exists because a verdict is content, not a colour applied to a
bullet after the fact. `Callout` says "one thing here must not be missed", which
four stacked callouts cannot say. If every row would come out `success`, it is a
`ContentSlide`.

`ConversationSlide`, `ChatSlide` and `ChatCharacterSlide` are one exchange in three
densities. **Pick by length, not by taste:** up to four short turns where the point
is that these are people talking, use `ChatSlide`; five or more turns, or lines past
a dozen words, use `ConversationSlide`; add the character on the ONE slide in a
concept where the exchange is the argument. Two speakers who agree with each other
are a `BulletList` in a costume.

`QuestionPointsSlide` does **not** relax content rule 16. At step 0 it is the
question and nothing else; the points are build steps that land only after the room
has answered. The rule governs what is on screen while the question is open, and an
unrevealed step is not on screen. `QuestionSlide` stays the default: use it whenever
the answer wants its own slide.

`QuizSlide` was **retired**: quizzes are delivered by an external component, so
a deck's only quiz frame is the announcement one. `sync-kit.mjs` deletes it
from any session that still has it.

## Figures

`slide-kit/slide-template/src/ui/`, on the `@/ui` barrel.

`AnalogyMap` · `BoundaryBridge` · `ChatThread` · `CircuitMap` · `ComposeNetwork` ·
`ContainerJourney` · `GateFlow` · `LaneFlow` · `SpineFlow` · `StepLedger` ·
`TrackSwitch` ·
`DataTable` · `FileTree` · `FlowChart` · `HandRitual` · `JourneyRoadmap` ·
`LayerStack` · `MachineBoundary` · `Nova` · `OneProcessRule` · `Orchestra` ·
`ScenarioCard` · `StackUp` · `StatusList` · `StepList` · `SyntaxBreakdown` ·
`Terminal` · `Shot` · `TwoRuntimes` · `VolumeSurvival` · `YamlNesting`

`SyntaxBreakdown` builds its specimen line FROM its `parts` array, so the diagram
and the legend under it cannot drift apart. The first draft took a separate
`command` string and they disagreed within one session.

### Flow chart figures

Six designs for one contract, `FlowchartFigureProps` in
`src/ui/flowchart/flowchartFigure.ts`. **They all take identical props, so
choosing between them is a rename at the call site.** Chosen in
`slide-kit/flowchart-lab`, which keeps all six and records what each is worst at.

| Figure | Reach for it when | Worst at |
|---|---|---|
| `SpineFlow` | the default: one happy path with exceptions hanging off it | one decision only; there is a single row of "below" |
| `LaneFlow` | the point is WHO owns each step, so handoffs are visible | every step having one owner. Needs three lanes to earn its keep |
| `StepLedger` | the words are the content and boxes would add nothing | shape. A loop is a line of text saying so, not a line to point at |
| `CircuitMap` | the room has met flow charts elsewhere and a house dialect would cost more than it buys | the diamond constrains the copy, and the copy is the teaching |
| `GateFlow` | the CHECK is the point of the slide, not one step among several | a second decision, and a question past about six words |
| `TrackSwitch` | the LOOP is the point: rework rejoining the same journey | buys one idea with the whole stage; assumes exactly one loop |

**These do not replace `FlowChart`.** That one draws a straight sequence and is
still right for one. These exist because it takes `nodes` and **no edges**, so it
cannot branch, cannot label an exit, and cannot loop back, while this registry
had been describing `FlowChartSlide` as "a process with branches" the whole time.
Its `shape: 'diamond'` rotates a node and carries on in a straight line, so the
figure looks like it asks a question and shows only one answer.

Three things they share, all in `src/ui/flowchart/`:

- **`NodeShell`** owns the card chrome, ONE padding scale, the hover lift and the
  hover detail popover. `NODE_MIN_H` is the floor a slot must not go below, and
  it is exported so a variant sizes itself from one number. Six independent
  guesses is how the padding came to be 0px in four cards and negative in one.
- **`motion.tsx`** owns the choreography: a figure assembles ALONG THE PATH, and
  the exception only leaves the fork once the happy path is complete. Every part
  is a build step, so `Ctrl+arrow` walks the process one piece at a time.
- **Every label is a DOM element, never an SVG `<text>`.** Content rule 17. An
  `<svg>` is one rectangle to all four harnesses, so they will pass a figure whose
  labels overlap and whose connectors end in mid-air. Both happened here.

`useClaimedSteps` in `src/motion/Stepper.tsx` exists for these: `useReveal()`
called in a loop claims the same order for every beat, so the whole figure lands
on the first click and the slide reports one step.

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

**A slide type built while generating a session does not stay in that session.**
It is copied back into the kit, added to the gallery, registered here, committed
to `slide-kit/slide-template`, and raised as a pull request. A component that
lives in one deck's `src/decks/` is invisible to the next deck and gets rebuilt
from scratch, slightly differently, by whoever needs it next. That is how this
repo ended up with two hand-rolled question layouts before `QuestionSlide`
existed.

A one-off ARRANGEMENT for a single slide still stays inline in that deck. The
test is the same one the workflow uses everywhere: *would a different deck, next
month, want this?*

1. **Get approval.** The user confirms it is worth keeping. Approved means they
   said so, not that it looked fine.
2. **Move it into the kit** — `src/slides/` for a slide type, `src/ui/` for a
   figure, `src/motion/` for a transition — and export it from the barrel. The
   session then imports it from the kit like every other type; it must not keep
   a private copy, or the two drift.
3. **Add it to `src/decks/sampleDeck.tsx`.** Not optional, and not "later": see
   [Every type is in the gallery](#every-type-is-in-the-gallery) below.
4. **Add a row here**, saying what it is *for*. A name alone does not tell the
   next person when to reach for it. If it is easily confused with a type that
   already exists, say which one and how to choose between them.
5. **Colours from `src/design/tokens.ts`, motion from the presets.** No hex
   literals, no bespoke timings.
6. **Verify it by rendering**, at the deck's fixed 1280x720, through all four
   harnesses. A new type has not been tested by the deck that prompted it: it has
   been tested at one content length, on one slide.
7. **Commit it to `slide-kit/slide-template` and raise a PR.** On a branch, not
   on `main`:

   ```bash
   git checkout -b kit/<the-type-name>
   git add slide-kit/slide-template slide-kit/slide-types/README.md
   git commit -m "feat(kit): <TypeName> — <what it is for>"
   gh pr create --fill
   ```

   The PR is what makes a kit change reviewable before it reaches every other
   session, because `sync-kit.mjs --apply` will push it to all of them. Say in
   the PR body which sessions are expected to sync.
8. **Say that you changed the kit**, and name the sessions that will need
   `sync-kit.mjs --apply`.

### Every type is in the gallery

`src/decks/sampleDeck.tsx` must render **every** type exported from
`src/slides/index.ts`. The gallery is the only discovery mechanism there is: the
generate-slides skill sends every author to it first, and a type that is not in it
is a type the next deck will not know exists and will rebuild by hand.

This is checkable, and it was not always true — `BrandSlide`, `CodeBuildSlide` and
`QuizTimeSlide` were each exported and missing from the gallery for several
sessions:

```bash
cd slide-kit/slide-template
diff <(grep -oP "\b[A-Z]\w*Slide\b" src/slides/index.ts | sort -u) \
     <(grep -oP "<\K[A-Z]\w*Slide\b" src/decks/sampleDeck.tsx | sort -u)
```

Left-only lines are types exported but missing from the gallery, which is the
failure. (An early version of this check grepped only `export { ... }` on one
line and silently missed the four `Content*ImageSlide`s, which are exported from a
multi-line block.)

Each gallery entry carries a `notes` string saying what the type is FOR, what it
must not carry, and which type it is confusable with. The notes are the
documentation; the slide is only the proof it renders.

### Retiring

Retiring works the same way: add it to `remove:` in `sync-kit.mjs` with the
reason, and say here that it is retired and why, the way `QuizSlide` is above.
Sessions that still reference it fail their own typecheck, which is intended.
