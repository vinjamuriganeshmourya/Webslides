# CI/CD reach lab

**DECISION OPEN. A human picks.** Nothing here is approved and nothing has been
promoted to the kit. Four candidates are rendered on one fixture; the table
below says what each is best at and what each is WORST at, which is the half a
future reader needs when they want to change whichever one wins.

**Not a session.** A lab inside the kit whose only job is to choose one figure
for session 7's `c2` concept.

```bash
npx vite --port 5233 --strictPort
npx tsc -b --noEmit
npm run build:html            # -> dist-single/cicd-reach-lab.html
export CHROME_PATH=/opt/google/chrome/chrome
node qa.mjs && node video-safe.mjs && node align-check.mjs
```

`node_modules` is a symlink to `../slide-template/node_modules`. The scaffold
was copied from `slide-kit/slide-template` and **not** from another lab, on
purpose: `comparison-lab` froze an old kit and three labs cut from it silently
inherited a 92-line `Terminal` with no `err` kind and no `powershell` chrome
against the shipping 166-line version. A lab is cut from the template.

## The design question

> CI, Continuous Delivery and Continuous Deployment differ ONLY in how far the
> automation reaches along one pipeline. Draw that.

Session 7 currently teaches the three terms as four consecutive slides: `c2-ci`
defines Continuous Integration, `c2-cd-delivery` defines Continuous Delivery,
`c2-cd-deployment` defines Continuous Deployment, and `c2-three-terms` then
compares all three in a `DataTable` because the three preceding slides did not
make the distinction stick. Four abstract definitions in a row, for a room
meeting the idea for the first time, before any picture exists.
`PEDAGOGY_GUIDELINES.md` section 2 forbids introducing a concept by its
definition. Slide 2 of this gallery is that incumbent table, verbatim, so the
comparison is against what ships rather than against an idea of what good looks
like.

### The two scored criteria

**ONE, containment.** The relationship is

```
Continuous Integration  ⊂  Continuous Delivery  ⊂  Continuous Deployment
```

Each term is the previous one plus more automation. Three definition slides can
only assert that; a figure can draw it. Every candidate is judged first on
whether a viewer sees the nesting **without being told**.

**TWO, the one human step.** Every published definition of the two CDs
separates them on one thing: continuous delivery needs a person to approve the
release into production, and the deployment itself is then automatic;
continuous deployment removes that step and changes nothing else. Reach length
alone cannot say it. On a five-stage chain "reaches 4" versus "reaches 5" is a
true statement of the difference but it hides the reason, and the reason is the
teaching. So the Delivery row carries `ApprovalMark` at its boundary and the
Deployment row is drawn **identically without it**. Two rows differing in
exactly one mark say "the only difference is the button" in a way two rows of
different length do not.

This criterion was missing from the lab's first brief and was added after the
research pass. It is why `ApprovalMark.tsx` exists as a shared component rather
than as four separate drawings.

## Why no registered figure fits

`slide-kit/slide-types/README.md` lists six flow figures and not one of them can
draw a VARIANT that stops early:

| Registered figure | Why it cannot do this |
|---|---|
| `SpineFlow` | one happy path with exceptions hanging off it. An `alt` branch is a DIFFERENT route, not a shorter version of the same route. It has no notion of reach at all |
| `TrackSwitch` | for a loop rejoining the journey. There is no loop here |
| `GateFlow` | for a single check being the point of the slide. Three practices are not a check |
| `LaneFlow` | about WHO owns each step. The owner is the same machine in all three terms right up to the last stage, so lanes drawn by owner would be identical and say nothing |
| `StepLedger` | words only, and the containment is exactly the part words cannot carry |
| `CircuitMap` | a conventional flow-chart dialect: one graph, one path |

That gap is why this lab exists. `SpineFlow` is the closest precedent and
`ReachChain.tsx` borrows its slot arithmetic and its stated-geometry
convention, but nothing in the family expresses nesting.

## The fixture, and why it is the deck's own

`stages` is `PIPELINE` from session 7's `src/decks/deckShared.tsx`, already
taught on `c2-our-pipeline`. A fixture invented for the lab would be judged on
how well it suits the lab.

```
1 FETCH    get the code
2 TEST     add tests here
3 BUILD    build the image
4 PUSH     image to Hub
5 DEPLOY   run on server
```

**Stage 2 is deliberately a NAMED EMPTY SLOT, not work already done.** The
caption is `add tests here`, never `run the tests`. This course never teaches a
test: session 5's Makefile is build, up, down, logs, migrate, superuser and
shell, and session 6 adds push. `make test` was never written by any session,
and `jenkinsCicdDeck.tsx` already carries a comment recording one caption
corrected for exactly this reason. The stage stays, because a CI pipeline with
no test stage is a poor example of one, but the room must not be credited with
work they have not done. **Do not "improve" this caption back into the
over-claim.**

For the same reason the word **`passing`** appears nowhere in the fixture.
Without tests, a stage fails when its COMMAND fails, and `make build` genuinely
can, so "a change that gets through" is honest where "every passing change"
quietly asserts a suite that does not exist.

The mapping, from session 7's own copy:

| Term | Reaches | Then what |
|---|---|---|
| Continuous Integration | stage 2 | every push is fetched and checked automatically, and tests go here when you add them |
| Continuous Delivery | stage 4 | the image is built and pushed, then it waits for a person |
| Continuous Deployment | stage 5 | no button: a change that gets through reaches the live server on its own |

**The stage names are local; the chain is not.** The literature's canonical
vocabulary is source → build → test → release → production. `1 FETCH`,
`2 TEST`, `3 BUILD`, `4 PUSH`, `5 DEPLOY` is one project's instance of that same
chain: FETCH is source, PUSH is release, DEPLOY is production. The deck's names
stay, because the room met them on `c2-our-pipeline` and content rule 24 forbids
a second name for a thing already named. A reader of this lab should know the
figure is conventional even though its labels are the project's own.

## The reveal requirement, which is what makes the idea legal

Content rule 25 wants one new element per slide. Collapsing four slides into one
is only allowed if the figure **builds**, so every candidate supports four
click-gated beats through `useBeats` / `useClaimedSteps`:

```
beat 0  the chain, on entry, free           (the room already met it)
beat 1  Continuous Integration
beat 2  Continuous Delivery, and the person standing at its boundary
beat 3  Continuous Deployment, the same row with the person gone
```

`useBeats` leaves beat 0 unclaimed on purpose: a slide that opens on an empty
stage looks like a figure that failed to render. Intermediate states are
screenshotted, not just the finished figure. Note the deck's arrow keys default
to SLIDE mode, so a harness or a screenshot script must pass `?nav=steps` or
the arrows walk the deck instead of building the figure.

## The four candidates

All four take the identical `CicdReachProps` from `src/ui/cicdReach.ts`, so
swapping one for another in a deck is a rename. All four draw their stage cards
through the shared `ReachChain.tsx` and their approval mark through the shared
`ApprovalMark.tsx`, so the only variable across the gallery is the drawing of
the REACH. `NodeShell.tsx` records what happens otherwise: six variants each
grew their own copy of a card and the declared padding had drifted by the
second one.

| Candidate | Height | The bet | Worst at |
|---|---|---|---|
| **`ReachBands`** | **276px** | The convention with the convention's cost removed. The chain once, and three bars from a shared left edge beneath it. Three lengths against a common datum is the one visual judgement people make accurately, and it is the only candidate that draws BOTH criteria in one picture | The bands are an ABSTRACTION on top of the chain, so a viewer has to carry a bar's right end back up to the stage above it. The leaders pay for that, but CI's leader is only 18px long and is nearly invisible on the rendered frame. And a filled bar carrying a white label reads at a glance like a heading or a progress bar rather than like a span |
| `ThreeLanes` | 394px | The chain drawn three times, each lane going dashed after its own stop. The literal answer and the CONVENTIONAL one: Atlassian, Red Hat, AWS, CircleCI, IBM and Bitrise all publish this picture, so a learner who reads any CI/CD article after this session meets it again | Height, and it is paid three times. 394px against a 425px ceiling leaves no room for a caption and none for a two-line consequence, so its consequence lines are locked to ONE inline line forever. Fifteen cards means the chain is repeated three times and a reader has to diff two rows to find the one difference. And each click adds five new cards plus a label, which strains "one new element per slide" harder than any other candidate |
| `NestedSpans` | 356px | Draw containment literally: three brackets, each opening at stage 1 and closing where its automation stops, drawn one inside another, so the nesting is a fact about the picture rather than a claim in the copy | The innermost bracket is the NARROWEST box in the figure and it holds the LONGEST of the three consequence lines, because the term the room meets first is the one needing most words. At 405px wide it takes three lines, and the first pass reserved two and put the third line on top of the chain. It is also the only candidate whose datum is FUDGED: all three brackets open at stage 1, so their left arms would be one line at x=0 of three different heights, and each is inset 9px to make the left edges nest. A viewer reading the figure precisely is reading a left edge that is up to 18px wrong |
| `StopPoints` | 411px | The control in the experiment. Every one of the three starts at the beginning, always, so a figure that redraws that constant three times is spending ink on the part carrying no information. Drop the spans, mark only what differs | **It does not draw containment at all.** On the rendered frame the three badges are three floating cards at three different left edges, and the staircase runs the wrong way: the innermost term's card is lowest and leftmost, the outermost highest and rightmost, which reads as a diagonal progression, not as one set inside another. There is no shared datum for the eye to measure against, because throwing the datum away is precisely what the candidate did. Worse, its Continuous Integration badge is 520px wide and its boundary is at x=405, so the badge OVERHANGS its own marker by 115px and can be misread as CI reaching stage 3, which is a figure that lies. It is also the tallest per unit of information |

### Written verdict

**Containment.** `ReachBands` draws it fastest: three bars from one origin, each
longer, is legible before the eye has focused. `NestedSpans` draws it most
LITERALLY, as actual set containment, and that is a real distinction, but it
asks the viewer to parse three concentric L-shaped brackets and their six arms
first, so it arrives second. `ThreeLanes` is a close third and gets there by the
same shared-left-edge device as `ReachBands`, with the growing run of solid
cards doing what the bar does. `StopPoints` does not get there at all, and that
is the lab's cleanest negative finding: containment is **not** something a
viewer infers from three fenceposts.

**The one human step.** `ThreeLanes` wins this one, and it is not close. Its
bottom two lanes are identical objects differing in exactly one place, so the
disc and the dashed fifth card are the only things to look at. `ReachBands` is
second: the mark is unmistakable but the two bands also differ in length, so
there are two differences to attribute rather than one. In `NestedSpans` and
`StopPoints` the mark sits on the shared chain, where it belongs to no row in
particular and reads as a note about the pipeline rather than about Delivery.

**The build.** `ReachBands` builds best. Each beat adds one bar that extends
from the datum, and the extending IS the reach, so the animation carries the
argument rather than decorating it. `NestedSpans` adds a rail, two arms, a badge
and a text block per beat, which is four objects for one idea. `ThreeLanes` adds
five cards, four connectors and a label per beat, which is the most material per
click of any candidate and the furthest from one new element.

**So the honest reading is a split**, and that is why the decision is left open
rather than closed with a recommendation: `ReachBands` is the better figure for
containment, for the build and by 118px of height, and `ThreeLanes` is the
better figure for the difference between the two CDs and the only one a learner
will recognise from elsewhere. Those are the two things the slide has to do. A
human picks which one the concept is more about.

## Measurements

Rendered at 1280x720, dev server, 2600ms settle before each capture. The
content well of `ContentSlide` with a one-line lead measures y=217, 439px tall,
and a composite over 425px centres its own top edge into the instructor-video
reserve at x 913..1280, y 0..220.

| Candidate | Height | Top | Bottom | Gap top | Gap bottom | Skew |
|---|---|---|---|---|---|---|
| `ReachBands` | 276 | 300 | 576 | 83 | 80 | 0 |
| `NestedSpans` | 356 | 260 | 616 | 43 | 40 | 0 |
| `ThreeLanes` | 394 | 241 | 635 | 24 | 21 | 0 |
| `StopPoints` | 411 | 233 | 640 | 16 | 13 | 0 |

Every composite is 1080px wide in a 1280px stage with 100px either side, so
horizontal skew is 0px, measured. The 3px difference between the top and bottom
gaps in every row is `ContentSlide`'s own `pt-[3px]` video guard, not a
centring error.

Harnesses, all with `CHROME_PATH=/opt/google/chrome/chrome`:

```
node video-safe.mjs   CLEAN: nothing is placed in the reserved video area
node align-check.mjs  0 of 6 slides need attention
node qa.mjs           1 slide with issues (slide 1, the brand slide) ·
                      TYPE FLOOR CLEAN: no text below 16px
npx tsc -b --noEmit   passes
```

Screenshots, including every intermediate beat, are under
`/home/nxtwave/.claude/jobs/170bacfd/tmp/cicdreach/`:
`<candidate>-beat0..3.png` and `<candidate>-greyscale.png`.

### The greyscale check

Run on `ThreeLanes` and `ReachBands`, the two that carry the most colour.
**Both survive completely.** In `ThreeLanes` the reach is carried by DASHED
versus SOLID card borders and by muted versus dark type, which greyscale keeps
intact, and each lane additionally carries its term's name in full. In
`ReachBands` the three bands go to three clearly different greys because
`REACH_PAINT` is a luminance ramp (teal, brand, deep navy) and not three hues at
one value, and the reach is carried by bar length either way. No candidate is
told apart by colour alone.

`REACH_PAINT` also stays clear of the verdict palette. None of these three
terms is a failure or a warning, so green, amber and red are reserved for the
meanings the room has been trained on all session, per
`annotatedSurface.ts`'s own note.

## Three things found while building the lab

**The 16px floor and the innermost box are in direct conflict, and this is the
finding that most affects the choice.** In any figure that nests, the innermost
region is the smallest, and in this content the innermost TERM is the one the
room meets first and therefore the one needing the most words. `NestedSpans`
gives Continuous Integration a 405px box for an 84-character line;
`StopPoints`, capping a badge at its own boundary, gave it the same. Both hit it
and neither can be fixed by making the type smaller, because the most important
sentence on the slide becoming the smallest text on it is not a trade, it is a
bug. `ReachBands` and `ThreeLanes` are immune only because their consequence
lines sit OUTSIDE the reach-marking geometry, in full-width rows. That is an
argument for those two which has nothing to do with how well they draw.

**A clamped figure is not a centred figure, and it fails silently.** The first
pass of `StopPoints` was 445px, so its top edge centred to y=216, four pixels
inside the video reserve. Nothing in the composite was wrong; it was simply
taller than the well, and `justify-center` distributing negative free space is
what pushes an oversized block up past the well's start edge.
`video-safe.mjs` catches it and it is the only harness that does. The fix has to
remove height, which it did: 520px badges instead of 405px ones took Continuous
Integration's line from three lines to two and the composite from 445 to 411.

**Absolute layout plus wrapped text needs a line estimator, and the estimator
must over-reserve.** `NestedSpans` and `StopPoints` both position bands
absolutely, because a bracket's arms run from one band's rail past every band
below it, which is geometry no flow layout expresses. That means band heights
have to be known before anything renders, and the height of wrapped text is not.
`estimateLines` in `cicdReach.ts` carries a 1.3 slack factor for exactly one
reason: a greedy line breaker leaves the tail of every line unused, so character
count over box width UNDER-counts, and under-counting ships an overlap that no
harness in this repo can see, because `qa.mjs`, `video-safe.mjs` and
`align-check.mjs` all measure rectangles and two rectangles are permitted to
overlap. If either of those two candidates wins, replace the estimator with a
measure-then-lay-out second pass, and delete it.

## What happens to the four session 7 slides if a candidate is adopted

Nothing yet, because nothing is adopted. But the intent recorded for whoever
picks: one figure slide with four beats replaces `c2-ci`, `c2-cd-delivery`,
`c2-cd-deployment` and `c2-three-terms`, and `c2-ci-promise` ("Broken code is
found minutes after it is written") stays, because it is a separate idea and
already one line on one frame. The `DataTable` is worth keeping somewhere as the
reference form a learner photographs; what it must stop doing is the
introducing.
