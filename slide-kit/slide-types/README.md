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
`ContainerJourney` · `FanOut` · `GateFlow` · `LaneFlow` · `SpineFlow` ·
`StepLedger` · `TrackSwitch` ·
`DataTable` · `FileTree` · `FlowChart` · `HandRitual` · `JourneyRoadmap` ·
`LayerStack` · `MachineBoundary` · `Nova` · `OneProcessRule` · `Orchestra` ·
`SocketBridge` · `TunnelPath` ·
`ScenarioCard` · `StackUp` · `StatusList` · `StepList` · `SyntaxBreakdown` ·
`Terminal` · `Shot` · `TwoRuntimes` · `VolumeSurvival` · `YamlNesting`

`SyntaxBreakdown` builds its specimen line FROM its `parts` array, so the diagram
and the legend under it cannot drift apart. The first draft took a separate
`command` string and they disagreed within one session.

| Figure | Reach for it when | Worst at |
|---|---|---|
| `FanOut` | ONE artefact is the origin of SEVERAL live things and does not change or divide when they are made: one image and many containers, one build and many environments, one template and many generated files. The source is drawn quiet on purpose, dashed and tinted with no live dot, because the mistake the figure prevents is reading the source as one of the running things. `live` is per copy, so "three containers, one of them stopped" is sayable | ANY relationship between the copies. They are peers with no connectors between them, so balanced traffic, a shared volume, or copy 2 made from copy 1 are claims the presenter is making and the figure is not. It also has no room for a second source |

`FanOut` is confusable with two figures either side of it. `BoundaryBridge` is two
MACHINES with a shared hub between them, and `FlowChart` is a SEQUENCE; reach for
`FanOut` only when one thing becomes several at once. Its height is derived from the
copy count rather than declared, so a fourth copy can never overlap a third: three
copies is the design point at 258px including the caption, four fits at 300px, and
five at 378px is the ceiling before the honest edit is two slides. Promoted out of
`deployement_session_1_v2`, where it was a deck-local `ImageFanout` hardcoded to one
image and three containers; nothing Docker-specific survived into the contract.

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
  is a build step, so `Ctrl+arrow` walks the process one piece at a time, or the
  plain arrows do once `S` has swapped the pair. **The implementation now lives at
  `@/ui/figures/motion`** and is shared by all five figure families below;
  `src/ui/flowchart/motion.tsx` is a re-export of it. Five labs each carried a
  byte-identical copy, which is the drift the labs exist to prevent: families that
  differ in GEOMETRY must not also differ in tempo, or comparing them compares the
  wrong thing. Every variant in every family is click-gated through `useBeats`,
  whose **beat 0 is free**, so a slide never opens on an empty stage and no click
  does nothing.
- **Every label is a DOM element, never an SVG `<text>`.** Content rule 17. An
  `<svg>` is one rectangle to all four harnesses, so they will pass a figure whose
  labels overlap and whose connectors end in mid-air. Both happened here.

`useClaimedSteps` in `src/motion/Stepper.tsx` exists for these: `useReveal()`
called in a loop claims the same order for every beat, so the whole figure lands
on the first click and the slide reports one step.

Not on the barrel, import by path: `TwoApps`, `RequestFlow`.

### Pseudocode figures

Three designs for one contract, `PseudoFigureProps` in
`src/ui/pseudocode/pseudoFigure.ts`, answering **what does this algorithm do, and
what happens when it runs**. Identical props, so choosing between them is a rename
at the call site. From `slide-kit/pseudocode-lab`, where **the winner was not
picked**, so all three are registered on purpose and the lab stays the record of
the comparison.

| Figure | Reach for it when | Worst at |
|---|---|---|
| `TraceTable` | the VALUES are the lesson: one column per variable, one row per executed step, filling a row per click with the pseudocode line lighting at the same instant | it runs out of columns and says so rather than shrinking, and at eight clicks it is the slowest of the three to present |
| `LineAnnotated` | every line needs its reason beside it, which is the thing `CodeBlock` structurally cannot hold | it cannot show a VALUE, so "line 4 is true only once in three" stays a claim in prose |
| `PseudoToReal` | the bridge to real code, with each real line positioned at the y of the pseudocode line it implements | it draws a one-to-one map only, and the right column is mostly air whenever the real code is shorter |

**Do not put pseudocode through `CodeBlock`.** That is a FILE view and two of its
features actively mislead: a filename says "create this file" when pseudocode is
what you write BEFORE there is one, and a language chip names a language when the
whole point is that it is none of them. It also has nowhere to say what a line
MEANS and nowhere to show what happens when the algorithm runs.

Three things an author has to get right:

- **`trace` is authored, and it must be hand-verified.** A fabricated trace table
  is the exact failure this family is designed against: the figure looks right and
  teaches something false, and no harness in this repo can tell.
- **`vars` sets the column order explicitly**, because a table whose columns come
  from `Object.keys` reorders itself the moment a step is edited.
- **`indent` is DRAWN**, at 18px a level, never spaces inside `text`. Spaces are
  part of the string, so they cannot be measured or re-indented.

`pseudoText.tsx` is the shared highlighter and dark ground: keywords by class the
way an editor colours them, control flow apart from declarations, and the author's
declared `vars` coloured as variables so a pseudocode line's prose stays prose.

Not on the barrel, import by path: `@/ui/pseudocode/TraceTable`,
`@/ui/pseudocode/LineAnnotated`, `@/ui/pseudocode/PseudoToReal`.

### Project-code figures

Three designs for one contract, `ProjectFigureProps` in
`src/ui/projectcode/projectFigure.ts`, answering the question a trace table
cannot: **where does this live, what calls it, and what has to be true elsewhere
for this line to make sense**. The unit is a STOP ON A TOUR and not a file, so
`files` is the map and `stops` is the route. From `slide-kit/projectcode-lab`,
where **the winner was not picked**, so all three are registered and the lab stays
the record of the comparison.

| Figure | Reach for it when | Worst at |
|---|---|---|
| `TourStops` | the default: a small map of the files that never leaves, with one snippet at a time large beside it, so the room never loses track of where a snippet lives | the HANDOVER. `via` is drawn nowhere, so a room can finish the tour able to name every file and still not say what calls what. It also shows one snippet, so two stops cannot be compared |
| `CallFlow` | WHAT HANDS TO WHAT is the lesson: the stops as a chain, with the mechanism of each handover named on the line between them | the code. Five 200px cards leave a 106px code column, so the snippets came out entirely and the cards now name line ranges and hand the reading to `TourStops` |
| `LayerMap` | the question is "where does this live" rather than "what happens next": one band per layer, with the tour plotted onto it so a request reads as a descent | the code, almost entirely: no snippet at all. It also collapses when every layer holds one file visited once, because then the band and the chip say the same thing twice |

Two things an author has to get right:

- **When `routes` is used, `routes[0].stops` must be the same array as `stops`**,
  which is what a figure draws when it ignores the toggle, and every route must
  hold the same NUMBER of stops. The resolver reports both. The build-step count a
  slide registers cannot change while the slide is up, and picking a route is a
  click.
- **Each route is authored, never the other one reversed.** `via` names a
  mechanism and a mechanism has a direction, `title` is a claim that changes with
  the direction, and two stops inside one file do not swap: you write the function
  then the line inside it, and the request reaches the function then the line
  inside it.

`routeToggle.tsx` is the shared control: `Request flow` against `Code flow` on one
press, with the numbers and the connectors following. It is a control rather than a
build step, because the room asks "so which do we write first" at an unpredictable
moment and a build step can only be reached in order.

Not on the barrel, import by path: `@/ui/projectcode/TourStops`,
`@/ui/projectcode/CallFlow`, `@/ui/projectcode/LayerMap`.

### Point-stating figures

Three designs for one contract, `PointsFigureProps` in
`src/ui/points/pointsFigure.ts`, for **stating a short set of points**, which is
the most frequent thing any deck in this repo does. From `slide-kit/points-lab`,
where **the winner was not picked**, so all three are registered and the lab stays
the record of the comparison.

| Figure | Reach for it when | Worst at |
|---|---|---|
| `RuleStack` | the default: full-width ordered rows, so a claim gets its own line with its reason under it, and the ordinal states an order a stack otherwise only implies | it states a SEQUENCE whether or not one exists, so genuine peers read as steps, and six rows come to 532px, which does not fit the budget: its honest ceiling is four |
| `PeerCards` | the points are things of one kind and equal geometry is the honest claim, with every claim at one eye height | it flattens the lead, and 224px of content width means a 65-character claim drives the declared 18px of padding to 0 |
| `LeadAndRest` | one point leads and the others support it: the lead takes 440px and 26px type, the rest share a 640px column | it promotes one point whether or not the author meant it and cannot be switched off, and a support row cannot hold a reason past about 86 characters |

**A bullet list is what these replace**, and what it gets wrong is structural: four
bullets claim the four are peers when most sets have a lead; a bullet holds one
string, so the author either states the claim and loses the reason or writes a
sentence too long to read from the back; a list arrives whole, which is not the
same as an instructor arriving at a point; and it invites two ideas per bullet,
which is the hard rule this repo breaks most often.

Three things an author has to get right:

- **A set is ALL OR NONE on `body` and on `term`.** Half the points carrying a
  reason reads as an edit somebody abandoned, and every variant then has to leave
  a hole for the missing half. The resolver reports it rather than guessing which
  was intended.
- **A label is a claim, not a sentence.** Past about 52 characters, or ending in a
  full stop, it is reported: a full stop means the reason has been folded into the
  claim, which is the two-ideas failure arriving through the front door.
- **Six points is the cap.** Past that the honest edit is two slides, and the
  figure says so rather than shrinking its own type.

`pointsChrome.tsx` owns the tone ramp, the term chip and the hover aside. **`risk`
is amber and not red:** `danger` on a slide reads as an error in the deck and the
room looks for what broke, while a risk is a trap the learner is about to walk
into. A non-neutral tone also gets a WORD, because colour carries on a good
projector and nothing on a bad one.

Not on the barrel, import by path: `@/ui/points/RuleStack`,
`@/ui/points/PeerCards`, `@/ui/points/LeadAndRest`.

**They size themselves to the set and to the slot, and they did not always.** As promoted, all three laid out from x=0 on a fixed 1100px stage at a fixed height, both derived from a four-point fixture: a two-point set stranded about 540px of width, and a short set left about 120px of empty card under its text. Session 1 v3 hit both on the same day. What they do now:

- **`PeerCards`** centres its row, divides the slot by the card count (clamped 240 to 420, so two cards come to 420 each and four to 260), and derives the card height from the estimated line counts of the longest label and the longest body at the real content width.
- **`RuleStack`** derives its row height the same way, and collapses its marker column from 132px to 46px when the set carries no `term`, because 132 was sized for a term chip and an untermed set put a 28px badge in it and left 104px of nothing.
- Both take a **`width`**, for the common case of a figure paired with a points column in a `ContentSlide` rather than owning the stage.
- Estimated and not measured, deliberately: the height has to be known before layout, and a measure-then-render pass risks the browser and the exported single file disagreeing. The estimate takes the WORST item, so a card can be too tall by a rounding and never too short, which is what keeps the declared padding a floor.

**A point's `tag` is the tone's word in your language.** The defaults came from the lab fixture, so `risk` says "the usual trap". A deck that means "this one is later" by `risk` must say so, and Session 1 v3 shipped a slide calling a later problem a trap before this existed.

### Feature figures

Ten designs for one contract, `FeaturesFigureProps` in
`src/ui/features/featuresFigure.ts`, for **"here are the things it can do"**. From
`slide-kit/features-lab`, where **the winner was not picked**, so all ten are
registered on purpose and the lab stays the record of the comparison and of what
each is worst at.

They exist because the kit's answer was `CardGrid`: n cards of identical size,
identical white, identical tone. The verdict on exactly that slide was "all cards
having same design, it is not visually appealing", and then the more useful
version, "why should we be constrained to cards?", which became section 8 of
`STYLE_GUIDE.md`. A modular grid whose cards are all one size defeats the point of
a modular grid, because nothing leads and the eye is given no anchor to enter on.

| Figure | Reach for it when | Worst at |
|---|---|---|
| `BentoGrid` | one capability leads: unequal tiles, the hero spanning two columns at exactly twice the area and the only one carrying its outcome | a set with no real leader, where it asserts a hierarchy the content does not have |
| `Spotlight` | one feature should be legible at a time, and a click MOVES the light rather than adding a tile | its own final frame. A screenshot or a PDF gets one feature and four headings |
| `AlternatingRows` | the what and the why belong side by side, sides swapping so each pair reads as a pair | comparison, because labels never line up in a column |
| `RadialSpread` | BREADTH is the claim, which is the one thing a grid states but cannot show | mechanism: the body has to move into the hover, which a projector audience cannot reach |
| `EditorialList` | the NAMES are the content, and a card around each costs the name its size | it draws nothing but a list, so a set whose items relate to each other is misdrawn as unrelated names. It drops `icon` and `logo`, so it cannot satisfy hard rule 12 |
| `SplitCompare` | a list would assert value where a comparison demonstrates it | `body` has nowhere to live, and half the stage states the bad case, which is wasted if the room already recognises it |
| `MetricLed` | the figure leads, because a number is the one thing the eye finds unprompted | it needs COMMENSURABLE numbers, and says so rather than pretending |
| `LayerAnatomy` | the set is one thing with parts, which a grid lies about by drawing them as peers | a set with no real ordering: it invents an architecture, which is a worse lie than drawing them flat |
| `FeatureFocus` | one capability per frame, at the size of the only thing on the slide | it can never show the SET, so breadth and comparison are unanswerable, and the cost lands in the deck as N slides |
| `AnnotatedShot` | show the thing itself, with each claim pinned to the part that proves it | it has no degraded mode at all, cannot pin an abstract capability, and rots the first time the product screen is redesigned |

Two things an author has to get right:

- **`weight: 'hero'` on at most one item.** The resolver reports more than one
  rather than letting a variant pick silently, and a set with no hero is what
  `BentoGrid` is worst at.
- **`outcome` is what the feature BUYS, kept separate from `body`, which is what
  it IS.** A variant can then place them differently, or admit it has nowhere to
  put one. `without` is the cost of not having it and only `SplitCompare` reads it.

**Three of the ten have an ENTRY REQUIREMENT**, which is the most useful thing the
lab produced. `SplitCompare` needs `without`, because without it both columns read
the same words with one struck through, which demonstrates nothing. `MetricLed`
needs figures that are readings of the same instrument, because setting them at one
size in one colour asserts exactly that and no unit text repairs it. `AnnotatedShot`
needs a real capture: hard rule 11 forbids inventing a screenshot and hard rule 8
forbids annotating an unrelated one. **A variant that can only be drawn by
degrading the content is telling you the contract is short a field, or that the
design has an entry requirement.**

Not on the barrel, import by path: `@/ui/features/BentoGrid` and the nine beside
it.

**These own the stage.** Each is a full 1100px frame at a fixed height, so none of them fits beside a points column in a `ContentSlide`. `SplitCompare` is also a `without` against a `with` and not a mapping: for a correspondence, reach for `AnalogyMap`.

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
