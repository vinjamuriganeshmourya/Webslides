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
| `QuestionSlide` | the pause beat: one question, hero scale, centred, nothing else. `choices` adds the two or three answers the room picks between, drawn identically so the slide never hints |
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

### `ContentSlide`'s two-column mode now has a width and an alignment

Pass BOTH `points` and children and `ContentSlide` puts the bullets and the figure
side by side. Two props govern that mode and nothing else:

| Prop | Values | What it is for |
|---|---|---|
| `split` | `text-wide` (default) · `even` · `figure-wide` | which column gets the extra width: 649/463, 556/556, or 463/649 |
| `columnAlign` | `center` (default) · `top` | whether each column centres itself independently, or the two lock to a shared top edge |

`split="even"` exists because **463px is not enough for a figure with lines in
it.** `Terminal` carries `break-words`, so at 463px it does not shear a long line,
it breaks an IMAGE NAME MID-TOKEN: session 6 shipped `ravi123/nxttrendz-` on one
line and `backend:v1` on the next, and a learner retyping a broken image name is a
worse outcome than a slide with one bullet fewer. 556px is the width three figure
labs independently settled on as the floor for 16px type in a side column.
`figure-wide` is for the slide whose figure IS the teaching and whose bullets are
captions on it.

**Worst at:** `even` and `figure-wide` both buy the figure width with the prose,
and the prose is where the wrapping cost lands — a bullet past about nine words
wraps a line earlier at 556px than at 649px, and `figure-wide`'s 463px text column
wraps nearly every bullet. If the slide has five long points, the answer is fewer
points, not a wider figure column. And **there is no fourth width, deliberately**:
session 6 hand-rolled five figure widths by hand and no two of its figure-bearing
slides lined up with each other.

`columnAlign="top"` fixes a defect rather than adding a style. Under `center` each
column centres in the row INDEPENDENTLY, so the figure's top edge sits wherever the
difference in the two columns' heights puts it — labs measured 87px, 100px and
139px of drift on real fixtures, and two figures of different heights on
consecutive slides of one concept land at two different y values. **Worst at:** a
short block, where the shared top edge gathers all the slack under the figure
instead of splitting it above and below, so the figure can read as unfinished
rather than as centred. Centre the block, never the columns.

**Both defaults reproduce the pre-existing rendering exactly, and that was
mandatory.** `sync-kit.mjs --apply` pushes this file into sessions that are already
signed off and frozen, so a deck that passes neither prop has to render
pixel-identical to what it rendered before the props existed. Verified by
measurement, not by reading: the gallery's default fixture measures
`648.656px 463.328px` with `align-items: center`, the bullets at x=64 y=368 and the
figure column at x=753 y=351, both before and after. The two gallery slides are
`content-split-default` and `content-split-even`, adjacent on purpose.

The same change also closed a live bug in that file: the well centred its body with
`justify-content: center`, which distributes NEGATIVE free space symmetrically, so
a block taller than the well spilled past the START edge and ignored the video
guard's padding — a 703px block in the 439px well put its top at y=85, inside the
instructor-video reserve. The well now centres with `my-auto`, which resolves to
zero on negative free space: it centres while the block fits and pins to the well's
top edge when it does not, overflowing downward only. The same block now measures
y=217. A block that FITS does not move, which is what made this safe to sync.

### The lead is content, so it is drawn in the content well

Every content type above takes a `lead`, the sentence that says what the slide is
for. It used to be rendered inside `SlideHeader`, under the title. It is now the
FIRST thing in the content well, through `SlideLead`, because the kicker and title
NAME the slide and the lead makes its argument: in the header it read as a subtitle
of the heading, above the body it belongs to.

Nothing changes for a deck. `lead` is still a prop of the slide, still authored the
same way, and `src/motion/continuity.ts` still compares it so an unchanged lead
does not replay its entrance. What changed is where it is drawn, plus two
consequences worth knowing before writing a new type:

- **`SlideHeader` does not accept a `lead` any more.** Passing one is a compile
  error, on purpose. A prop still declared but ignored would be passed by the next
  type somebody writes and the sentence would vanish with no error.
- **The header floor is one number now, `min-h-[120px]`**, not 168px with a lead
  and 120px without. The lead-less guards in the layouts (`pt-[52px]` on a side
  visual) still test `lead`, because a lead still fills that same band of the
  well; it is just drawn below the header rather than inside it.

Ported into the kit from `deployement_session_3`, which cut its whole deck this way
first.

`QuizSlide` was **retired**: quizzes are delivered by an external component, so
a deck's only quiz frame is the announcement one. `sync-kit.mjs` deletes it
from any session that still has it.

## Figures

`slide-kit/slide-template/src/ui/`, on the `@/ui` barrel.

`AnalogyMap` · `BoundaryBridge` · `ChatThread` · `CircuitMap` · `ComposeNetwork` ·
`ContainerJourney` · `FanOut` · `GateFlow` · `LaneFlow` · `SpineFlow` · `ThreeLanes` · `TillRow` ·
`StepLedger` · `TrackSwitch` ·
`DataTable` · `FileTree` · `FlowChart` · `HandRitual` · `JourneyRoadmap` ·
`LayerStack` · `LoneHost` · `MachineBoundary` · `NestedBoundary` · `Nova` · `OneProcessRule` · `Orchestra` ·
`SocketBridge` · `TunnelPath` ·
`CountBadge` · `ScenarioCard` · `SlideLead` · `StackUp` · `StatusList` · `StepList` · `SyntaxBreakdown` ·
`SwapRows` · `Terminal` · `Shot` · `TwoRuntimes` · `VolumeSurvival` · `YamlNesting` ·
`CodeOutput` · `LogoWall` · `RadialSpread` · `PromptCard` · `ValueTypeMap` ·
`VariableTrace` · `EvalSteps`

### The three Python-course figures

Promoted from `python/1_programming_with_python` on 2026-09-22. All three are DOM,
never `<svg>` text (content rule 17), and run at the explanatory tier.

| Figure | Reach for it when | Worst at |
|---|---|---|
| `CodeOutput` | a snippet and EXACTLY what it printed, side by side, or two such pairs compared. Every code panel names where it runs via `location` (rule 31), and `output` is never composed: run it, paste it | a command typed at a shell (that is `Terminal`), the SHAPE of a construct (`SyntaxBreakdown`), or a file that grows across slides (`CodeBuildSlide`) |
| `LogoWall` | the claim is scale or familiarity and the marks ARE the argument: "around 700 languages", "the companies you know run on this". Every mark carries its name (rule 12) | decoration. If the marks are not the claim it is pictures filling space, and it cannot say anything about the relationship between them |
| `PromptCard` | text the learner pastes into an AI tool; `location` says where, `[slots]` render dashed | anything that is a file, a shell command or an aside |
| `ValueTypeMap` | two or three values paired with their types, when the pairing is the claim | four or more rows (`DataTable`) |
| `VariableTrace` | a program run one line per click, variables as boxes, output appended | a program with more than three variables, or more than six lines |
| `EvalSteps` | one expression rewritten down to its value, one operation per line | anything that is not the same expression getting shorter |
| `RadialSpread` | one thing reaching into many places: one language, five fields. Draws one spoke after another on entry so the reach is watched, not shown. `STYLE_GUIDE.md` §8's form for "reach" | a sequence (`StepList`), alternatives the room chooses between, or fewer than four spokes, which is a comparison drawn oddly |

`NestedBoundary` draws containment as boxes inside boxes, the innermost solid:
Docker-inside-Docker is its default. It is the PAIR of `SocketBridge`, which draws
the same two things side by side with a socket between; the two share a dashed
boundary style so a deck can show the wrong arrangement then the right one.
Reach for it when the claim is "this is stuck inside that". Not for a stack of
peers, which is `LayerStack`.

`SyntaxBreakdown` builds its specimen line FROM its `parts` array, so the diagram
and the legend under it cannot drift apart. The first draft took a separate
`command` string and they disagreed within one session.

`FileTree` takes an optional `open`, naming the folder that STARTS open. It is an
accordion: every folder row with children is a real `<button>`, clicking one
shuts whatever was open, and there is no all-shut state, so the figure can never
collapse to bare rows in front of the room. The well reserves the tallest
folder's height, so nothing on the slide moves when the open folder changes.
The open folder's children are drawn inside a recessed well that belongs to it,
and every other folder collapses to a row with a shut chevron and a count. **Omitting
`open` keeps the old flat-with-`depth` rendering**, which is what sessions 2 and
3 ship, so the prop is additive and no signed-off deck moves. Reach for `open`
whenever the tree is longer than about six rows: session 4's workspace slide was
nine flat rows of monospace and the review read it as one list rather than as
three folders.

`Terminal` takes **two chromes**. `vscode` (the default) draws the integrated
panel with its tab strip, which is right for the commands this course runs from
inside the editor. `chrome="powershell"` draws a STANDALONE Windows PowerShell
window with a title bar, for the few slides that tell the room to open one: a
slide saying "Administrator PowerShell" while drawing VS Code's panel is telling
the room two different things, and the one it draws is the one that wins. It also
takes an `err` line kind, in red, because a console error is red and rendering it
in the same grey as ordinary output loses the one cue a learner scans for.

Every surface in every figure here is lit from the top-left, per
`STYLE_GUIDE.md` section 9. A DOM figure gets it from `background` and
`boxShadow`; an SVG figure gets it from `SurfaceDefs` and `surface(tone)` in
`svgDepth.tsx`, because an SVG `<rect>` can express none of it as a property.
**A new figure that ships flat is a bug, not a style choice** — session 4 shipped
three flat SVG figures and the review's one-line verdict was "the container depth
is missing, all are very flat".

| Figure | Reach for it when | Worst at |
|---|---|---|
| `SwapRows` | A comparison where one side STANDS IN FOR the other: a phone's speed dial and a Makefile's targets, a Python function and a Makefile, a manual ritual and an automated one. Each pairing is one object divided internally, familiar side recessed and new side raised, so it reads as "this stands in for that" with no arrow. `code` sets a pairing in monospace. Chosen in `slide-kit/comparison-lab` over three other candidates; that lab's `CLAUDE.md` says what each was worse at | TWO PEERS. The recessed-to-raised inversion asserts a direction, so two alternatives being weighed against each other are misrepresented by it (rule 8) — use `DataTable` with identical row labels. Also more than four pairings, because each row is a drawn object rather than a line of text. It carries no emphasis flag by design |
| `CountBadge` | A RUN OF LINES IN TERMINAL OUTPUT that belong together, where the claim is about the GROUP: "count the lines between the first and the last". Draws a box around the run INSIDE the panel with the derived count on its edge, so nothing hangs off the figure and its bounding box stays the panel on both axes. The count comes from the run's members and cannot be passed in, so it cannot go stale when real output gains a line. A line marked `role: 'exception'` sits outside the box and outside the count. Chosen in `slide-kit/annotated-output-lab` over four others; that lab records that a numbered gutter and margin leader lines both annotate "from the end" and shove the panel off centre by their own furniture | SAYING WHY an excepted line is out. Nothing sits on it, so a learner who notices the gap must be told out loud. Use it where the NEXT slide explains the exception, and reach for the lab's `TwoEnclosures` when the exception has to be named on the same frame. Also: it needs the panel at FULL WIDTH — inside `ContentSlide`'s `points` + `children` two-column mode the figure gets 463px and `Terminal` breaks an image name mid-token |
| `LoneHost` | ONE machine holds a thing and the others CANNOT GET IT. Four identical frames with a slot in the same place, and the only difference is that one slot has something in it: no dimming, no crossing out, no connectors. A severed connector still draws a relationship where an empty slot draws none. Chosen in `slide-kit/isolation-lab` over three others; that lab's `CLAUDE.md` says what each was worse at, and records that `BlockedFan` proved inverting `FanOut`'s connectors does NOT invert its composition — three curves leaving one box still read as distribution | MORE THAN THREE recipients: a fourth leaves the frames too short for a machine name at the 16px text floor. Also PEERS — three equal frames claim a teammate's laptop, an automation server and a production host are the same kind of thing at the same stakes, and they are not. Its height is a constant, so a narrower `width` does not buy vertical room. Do NOT reach for `FanOut` here: it argues "one thing becomes many", which is the opposite claim (content rule 8) |
| `SlideLead` | ALWAYS, in a slide type that takes a `lead`. It draws that sentence as the first thing in the content well, one tone-coloured arrow and the deck's body-lg type, and owns both the gap below it and the width cap that keeps the line clear of the instructor-video rectangle. `SlideHeader` no longer accepts a `lead`, so a new type that forgets this one is a TypeScript error rather than a silently missing sentence | Anything that INTERRUPTS. It is deliberately the lighter register: no ground, no label line, no border. The warning, the gotcha and the aside are `Callout`, and a lead dressed as one competes with the real callout on the same slide |
| `ThreeLanes` | THREE NAMED PRACTICES that differ only in HOW FAR each reaches along one shared chain, where the relationship between them is CONTAINMENT. Built for CI, Continuous Delivery and Continuous Deployment; the contract names none of them. The chain is drawn once per term, each lane going dashed after its own stop point, so every lane states its own outcome for every stage IN PLACE and the viewer never carries a bracket's end back up to a stage above it. `reaches` is the 1-based stage the automation covers THROUGH, inclusive, and every span, dim boundary and marker derives from that one number, so no two parts of the figure can disagree about where a term stops. `approval` draws the human decision at a term's own boundary, which is the only thing separating the two CDs in every published definition. `terms` is INNERMOST FIRST and that order IS the containment claim. Tones are ROLES, not hexes, so a caller cannot reach a verdict hue, and the ramp doubles as luminance so the three survive a greyscale projector. Reveals one lane per click, which is what lets it replace four definition slides without breaking content rule 25. Chosen in `slide-kit/cicd-reach-lab` over `StopPoints`, `NestedSpans` and `ReachBands` because it is the shape Atlassian, Red Hat, AWS, CircleCI, IBM and Bitrise all publish, so the room meets it again in the first article they read | TERMS THAT DO NOT CONTAIN EACH OTHER. Three peer options, or three alternatives, are not this figure and drawing them here claims a nesting that is not there (content rule 8). Also A SLIDE WITH `points`: it is 394px tall against the 425px ceiling where a composite's top edge starts centring into the video reserve, so it needs the full well and a one-line lead. Four terms do not fit. `ReachBands` in the lab is the same convention in 276px if the height is needed back |
| `TillRow` | ONE WAITING LINE and a FIXED NUMBER OF WORKER SLOTS that take from the front of it. Built for a Jenkins job, its build queue and its two executors; the contract names none of them, so any claim of the form "one trigger creates work, the work waits in order, and a counted set of workers consumes it one at a time" fits. The line is a column with the FRONT AT THE BOTTOM, nearest the desks, and `queue` is FRONT OF THE LINE FIRST, so the array order IS the queue discipline. Capacity is the `executors` array length and nothing else, and a slot with no `running` is drawn as an EMPTY FRAME the same size as a busy one rather than a dimmed copy, which is the `LoneHost` lesson: opacity reads as present but unimportant and only a hole in the picture reads as nothing here, so free slots can be counted at a glance. THE FAN IS THE FIGURE: one connector leaves the front of the line, runs along a rail under the desks and rises into EVERY desk with its own arrowhead, so "the next ticket goes to whichever slot frees up first" is geometry rather than a caption, and a single arrow into one desk would teach a wrong discipline. Reveals in five beats, six with `done`, and busy and free arrive as ONE beat because a contrast cannot be revealed in halves. Keeps Jenkins' own panel titles, so the room meets the same picture on the real dashboard (content rule 27). Chosen in `slide-kit/queue-lab` over `QueueBelt` and `DashboardPanels` because it is the only candidate that draws the MECHANISM rather than the parts | A SEQUENCE. A queue and a worker are not two steps in a row, and a chain hides the only fact that matters, that the line exists because there are two slots and not four; reach for `SpineFlow` or `FlowChart` when the claim really is a sequence. Also ANYTHING THAT HAS TO MOVE: it draws one instant, and the run stepping out of the line into a freed slot is the instructor saying so, not the drawing. MORE THAN FOUR WAITING TICKETS, since height is a function of queue length and five puts the rail past the well. And A LONG NOTE ON A BUSY SLOT: the column spends 268px of width, so a slot's note gets one short line and anything longer wraps and eats the run card. `QueueBelt` in the lab is the same claim read left to right, and `DashboardPanels` is Jenkins' two panels without the flow between them |
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
