# Figure-beside-content lab

**DECISION OPEN. Nothing here has been chosen and nothing here has been
approved.** Four candidates plus one documented alternative, one fixture, one
shared contract. A human picks off
the gallery; this file exists so that the pick is made on what each candidate is
WORST at rather than on which screenshot looks nicest.

**Not a session.** A lab inside the kit whose only job is to choose the slide
type the kit does not have.

```bash
npx vite --port 5229 --strictPort
npx tsc -b --noEmit
npm run build:html            # -> dist-single/figure-side-lab.html
export CHROME_PATH=/opt/google/chrome/chrome
node qa.mjs && node video-safe.mjs && node align-check.mjs
```

`node_modules` is a symlink to `../slide-template/node_modules`.

## The design question

**The kit's ONE way of putting a live figure beside content uses a bad ratio and
centres its columns independently, and a caller can change neither.** A live
figure is a `Terminal`, `DataTable`, `BoundaryBridge`, `LayerStack` or
`CodeBlock`: a thing the kit draws, not a picture of one.

That is a sharper statement than "the kit has no such slide type", and it is the
correct one. `ContentSlide` given BOTH `points` and `children` already renders a
figure-beside-points mode:

```tsx
<div className="grid grid-cols-[1.4fr_1fr] items-center gap-10">
```

Both halves of that line are the defect, and neither is expressible as a prop:

- **`1.4fr_1fr`** gives the figure a **463px** column against **649px** for the
  prose — measured on gallery slide 2. That is backwards on a slide whose subject
  is the terminal, and it is what squeezes a figure until its text has to shrink
  toward illegibility.
- **`items-center`** centres each column independently, so the shorter column's
  position is decided by the taller one's content. On this fixture the terminal's
  top edge is **16px** below the first bullet, which looks nearly aligned and is
  not: the number is a coincidence of these two columns being a similar height.
  Change the copy and it moves. The same `items-center` on the first pass of this
  lab's own candidates produced 75px, and `FigureLede`, which keeps centring on
  purpose, measures **139px**. A value that only happens to be small is not a
  datum.

The two near misses either side of it:

- **`ContentImageSlideProps`** (`src/slides/types.ts`) demands
  `media: SlideMedia`, which is a URL or a named illustration, and wraps it in
  `MediaFrame`'s white image card. A `Terminal` is not media and does not want
  that card. Worse, its `children` render in the TEXT column, so passing a figure
  as `children` to `ContentRightImageSlide` puts the figure on the wrong side of
  the slide.
- **`ContentSlide` with `children` and NO `points`** takes the other branch and
  stacks the figure under the copy in the leftover height, centred, so the
  figure's vertical position is again a by-product of the copy's length.

**What that cost, measured.** Deployment session 6 hand-rolls figure placement
with 23 wrappers of the form `<div className="mx-auto w-full max-w-[980px]">` at
FIVE arbitrary widths: 980px x15, 860px x4, 760px x2, 880px, 1010px. Over a
51-slide render sweep that produced

- **vertical float on 10 slides** — the figure in the middle band with dead space
  above AND below it,
- **a left-aligned figure with an empty right half on 4**.

**Gallery slide 2 is the incumbent, and it is the real incumbent:** the fixture
through plain `ContentSlide` with `points` + `children`, wrapper included, which
is exactly what session 6 slide 32 renders today. Judge every candidate against
that slide, not against an idea of what good looks like, and not against the
hand-rolled wrapper alone.

## The fixture, and why that fixture

**Session 6 slide 19, `c2-login`, verbatim** — its title, its lead, its two
points and its four terminal lines, out of
`django_deployement_course/deployement_session_6/src/decks/partC2C3.tsx`. It is
one of the 23 slides with a hand-rolled wrapper, and it is the slide the defect
was measured on. A fixture invented for the lab would be judged on how well it
suits the lab.

Reproduced in `src/decks/figureSideLabDeck.tsx` rather than imported, so the lab
is self-contained. Session 6 is another writer's file and nothing here touches it.

Two further fixtures, both also session 6's own content:

- **The wide fixture**, slide 21 `c2-push-denied`: a four-line `docker push`
  refusal whose longest line is 96 monospace characters and needs about 900px at
  fontSize 14. Gallery slides 7 and 8, once through the candidate that survives
  it and once through one that does not, because a candidate that only works for
  a small figure is a finding worth SHOWING.
- **The stress fixtures**, gallery slides 9 to 11: the same login slide at ONE
  point and at FIVE, the extra three lifted from session 6 slide 49
  `c3-push-denied-again`. A datum that holds on one fixture is a coincidence.

## The shared contract

`src/ui/figureSide.ts`. All four candidates take the identical `FigureSideProps`
(`kicker`, `title`, `lead`, `points`, `figure`, `caption`), so swapping one for
another in a deck is a rename. `comparison-lab` and `flow-lab` established that
pattern and it is what makes choosing cheap.

Two things the contract owns, and they are the point of the lab as much as the
four drawings are:

**ONE WIDTH TOKEN, NOT FIVE.** `FIGURE_MAX` is 980px, which is not a new number:
it is the width session 6 reached for 15 times out of 23 by hand, so it is the
measured house width rather than a taste. A deck author never writes a px width
again, and no two slides in a deck can put their figure at two different widths.

**ONE VERTICAL RULE: THE BLOCK IS CENTRED, CLAMPED OFF THE VIDEO RESERVE.**
`figureClamp(lead)` and `my-auto`, applied once in `FigureSideShell` so every
candidate inherits the same behaviour.

There are TWO vertical questions here and only one of them is "centred". Keeping
them apart is the whole subtlety of the lab:

1. **Where the BLOCK sits in the well — centred.** The prose and the figure
   together are one object, and that object is centred vertically under the lead.
2. **How the figure and the prose sit RELATIVE TO EACH OTHER — locked to a common
   top edge,** at any copy length, on every candidate but the one that trades it
   away on purpose.

`ContentSlide` answers the second question with `items-center`, which centres each
COLUMN independently, so the shorter column's position is a function of the taller
one's content. **Centre the block, never the columns.** `items-start` on each
candidate's row locks the pair; the shell centres the locked pair. Going back to
`items-center` on a row would reintroduce the original defect, and on this fixture
it would look almost right, which is what makes it dangerous.

### The clamp, and why `my-auto` rather than `justify-center`

x 913..1280, y 0..220 is held for the instructor video. Centring is free to move a
block UPWARD, so centring alone is unsafe: `CaptionRail` landed at y=217 and
failed `video-safe.mjs` by three pixels the first time it was allowed to place
itself. `figureClamp` is padding on the container — `pt-[7px]` with a lead,
`pt-[56px]` without, being 224 minus the well's top edge of 217 or 168 — so it
shrinks the box the block may be centred within and the block's top cannot be
above y=224.

**That padding only holds if the centring mechanism respects it, and
`justify-center` does not.** When the block is TALLER than the box,
`justify-content: center` distributes the negative free space symmetrically and
spills past the START edge, ignoring the padding. Measured: with `justify-center`,
`FigureLede` at five points put its block top at **y=222** — two pixels inside the
reserve, on a container whose padding said 224. A clamp that fails precisely when
the block is tall is no clamp at all, because tall is when it is needed.

Auto margins resolve to ZERO when free space is negative. So `my-auto` centres
while the block fits and pins it to y=224 the moment it does not, overflowing
downward only. No branch, no measurement, no state where the guard is skipped.
**Verified: the same slide now measures a block top of exactly 224.**

The residual asymmetry, stated rather than hidden: because the padding sits inside
the centred box, the block rests half the padding below the well's true centre —
**7px** with a lead, 56px without. Every slide type in this kit that carries a
figure also carries a lead (session 6's own rule D says so, for this same
rectangle), so 7px is the number that matters and nothing reads as off-centre at
that size.

**ONE WIDTH TOKEN AND ONE CLAMP, BOTH IN ONE FILE.** `src/ui/figureSide.ts` holds
the arithmetic and the reasoning; a candidate that took the padding string and
forgot the condition is the failure mode both are shaped to prevent.

The header is NOT in the well. `kicker` + `title` stay at the slide's own
top-left datum on every candidate, drawn once in `FigureSideShell`, because
`align-check.mjs` measures against the header's left edge and
`ContentImageSlides.tsx` records what happened when the header did live inside a
column: it started at x=664 on the left-media layout, six hundred pixels right of
the previous slide's.

## The four candidates

| Candidate | The bet | Worst at |
|---|---|---|
| **`SplitWell`** | The fault is that there is no split at all. Give the figure a column of its own, lock both columns to a common top edge, and neither the figure nor the prose can be positioned by the other's length. 50/50, the most conservative candidate on purpose | A WIDE figure: half the well is 546px, and `Terminal` carries `whitespace-pre-wrap break-words`, so it does not shear the line, it BREAKS IT MID-TOKEN (`nxttrendz-` / `backend]`). A learner reading a broken image name off the projector retypes a broken image name. Also NO points, where it draws an empty left half — the session 6 defect, faithfully. Also A SHORT SLIDE, and the cost changed shape when the block became centred: at one point the block sits with **146px above it and 139px below**, so instead of one dead band at the bottom there are two, and the content floats away from the lead that introduces it. Measured on slide 9. Centring is what was asked for and this is what it costs on a thin slide; the honest edit there is a bigger figure, not a different layout |
| **`FigureLede`** | Two asymmetries, deliberately different ones. 58/42 says which of the two is the slide, where `ContentSlide` gives the PROSE 1.4fr and the figure 1fr and gets it backwards. The points sit at the block's top edge; the figure is OPTICALLY CENTRED IN ITS OWN CELL | THE SHARED TOP EDGE. It is the one candidate that trades it away on purpose: the figure's cell is as tall as the PROSE, so as the copy grows the figure slides down away from it — delta 15px at two points, 142px at five. Two figures of different heights on consecutive slides of one concept also sit at two different y values. Also it runs out of height a bullet earlier than `SplitWell`, because a 42% column wraps more: at five points the last bullet lands under the control bar (`align-check` CHROME, slide 11). Also it is the ONLY candidate that overflows the well: at five points its block is 437px against the clamp's 432px allowance, so it is pushed to the y=224 floor and runs 5px past the well's bottom edge. Safe (the frame and the reserve both hold) but it is the candidate with no vertical headroom left. Also the same width ceiling, barely relieved: 636px still wraps a wide `Terminal` |
| **`FigureBleed`** | Every other candidate leaves 64px of empty ground down the right edge, because `SlideBase` pads the content region. Spend it. The figure cancels the padding, lands flush with the stage edge, gives up its width cap, and is unmistakably the subject | A FIGURE THAT CANNOT GIVE UP ITS RIGHT RADIUS. `Terminal`, `CodeBlock` and `DataTable` all carry `rounded-card` on their own outermost div with no prop to drop it, so the panel bleeds with both right corners rounded and reads as shoved off the slide rather than continuing past it. Adopting this means a `bleed` prop on five signed-off kit figures. Also A TRUE BLEED CANNOT PASS `qa.mjs`: that harness measures overflow against `sr.right - 4`, a deliberate 4px inset, so anything flush with x=1280 reports `overRight: 4`. The candidate therefore stops at x=1276, which is invisible but is a harness constraint shaping the design rather than the reverse. Also the caption is 32px off-axis, the bled edge's drop shadow is clipped away by `SlideBase` so the surface loses its lighting where it is largest, and 34% of the well is 371px, so a bullet over eight words reads as a paragraph |
| **`CaptionRail`** (+ `CaptionRailDatum`, the alternative) | Refuse the side-by-side premise. For a wide figure there is no column arrangement that gives it 900px AND leaves room for prose, so the figure takes the well at the datum and the points become a rail of captions beneath. This is what session 6 was reaching for with all 23 wrappers, minus the float | THE COPY. It is the only candidate where the prose is width-constrained by the NUMBER of points: three cells are 355px, so anything past about twelve words wraps to four lines and the rail becomes a second body. Adopting it changes how a deck author WRITES a slide, which is the largest cost of any candidate here. Also a TALL figure, where the rail is squeezed into 90px and its captions collide with the control bar; and a SHORT figure, where ~200px of well sits empty with nothing beside the figure to occupy the height. Centring now splits that band above and below (105px / 98px on slide 6) rather than dropping it all at the bottom, which reads better and is the same missing content either way |

## Could this be props on `ContentSlide` instead of a new slide type?

**For two of the four, yes, and that is probably the right answer.** A new slide
type has to be discovered: every deck author must know to reach for it, and the
23 slides in session 6 and every slide like them in sessions 1 to 5 keep the old
behaviour until someone rewrites them by hand. Two additive props on
`ContentSlide` would improve every deck that already uses its two-column mode.

| Candidate | Deliverable as props on `ContentSlide`? |
|---|---|
| `SplitWell` | **YES.** It is `grid-cols-[1fr_1fr]` + `items-start` + the anchor. Two props — a column ratio and a vertical alignment — express it exactly. Nothing else about it is new |
| `FigureLede` | **YES**, with the same two props: ratio `[42fr_58fr]`, alignment "points start, figure centred". If the alignment prop is a two-value enum rather than a boolean, this and `SplitWell` are the same change |
| `FigureBleed` | **NO.** The figure has to escape `SlideBase`'s `px-16`, which is a negative margin on a child of a layout that does not know it is happening, and it additionally needs a `bleed` prop on five kit figures so they can drop their right radius. A prop on `ContentSlide` cannot reach either |
| `CaptionRail` / `CaptionRailDatum` | **NO.** The structure differs, not the geometry: the figure is above and the points become a horizontal rail beneath it. `ContentSlide` has one `points` slot and one `children` slot and no way to say "render the points as a caption rail", so this is a genuine new slide type or nothing |

So the honest recommendation this lab makes, for a human to accept or reject: if
the pick is `SplitWell` or `FigureLede`, **do it as props on `ContentSlide`, not
as a new type.** If it is `FigureBleed` or `CaptionRail`, a new type is
unavoidable, and `CaptionRail` is the one that justifies one.

### The propagation constraint that decides the shape

`ContentSlide` is kit-owned, and `sync-kit.mjs --apply` pushes it into every
session including signed-off ones. **Changing the existing two-column defaults
would move slides in decks that are already delivered and frozen.** Session 6
alone has 23 figure slides whose composition was reviewed as it stands.

Therefore: **an ADDITIVE prop with today's `1.4fr_1fr` + `items-center` as the
default is the only acceptable shape.** A changed default is not acceptable
however much better it is, and "we will re-review the old decks" is not a plan
that survives contact with a frozen session. New decks opt in; old decks render
byte-identically.

Nothing under `slide-kit/slide-template/` was touched to write any of this. The
lab proposes; a human decides and a PR carries it.

## Centring, measured

"Is it centred" has a number for an answer, so here are the numbers rather than an
opinion about the screenshots. Produced by evaluating the rects in the page after
a 2600ms settle: the well and the block for the vertical figures, and the
`data-figure-region` / `data-figure-pane` pair for the horizontal ones. Those two
attributes exist in `FigurePane` for exactly this, so the measurement is
reproducible on any candidate at any figure width.

- **v-skew** is the block's top gap minus its bottom gap inside the well. The
  floor is 7px on every slide, which is the clamp padding, not a layout error.
- **h-skew** is the figure's left gap minus its right gap inside its own region.
- **delta** is the figure's top edge minus the first bullet's. **0 means the
  columns share a top edge**, which is the property the lab exists to establish.

| # | Candidate / fixture | well | block | top gap | bottom gap | **v-skew** | **h-skew** | delta |
|---|---|---|---|---|---|---|---|---|
| 2 | incumbent `ContentSlide` (`1.4fr_1fr`), small | 217..656 | 344..529 | 127 | 127 | 0 | 0 | **16** |
| 3 | `SplitWell`, small | 217..656 | 348..533 | 131 | 124 | **7** | **0** | **0** |
| 4 | `FigureLede`, small | 217..656 | 348..533 | 131 | 124 | **7** | **0** | 15 |
| 5 | `FigureBleed`, small | 217..656 | 315..566 | 98 | 91 | **7** | **0** | **0** |
| 6 | `CaptionRail`, small | 217..656 | 322..558 | 105 | 98 | **7** | **0** | n/a |
| 7 | `CaptionRail`, WIDE | 217..656 | 346..534 | 129 | 122 | **7** | **0** | n/a |
| 8 | `SplitWell`, WIDE | 217..656 | 323..557 | 106 | 99 | **7** | **0** | n/a |
| 9 | `SplitWell`, ONE point | 217..656 | 363..517 | 146 | 139 | **7** | **0** | **0** |
| 10 | `SplitWell`, FIVE points | 217..656 | 238..642 | 21 | 14 | **7** | **0** | **0** |
| 11 | `FigureLede`, FIVE points | 217..656 | **224**..661 | **7** | -5 | 12 | **0** | 142 |
| 12 | `CaptionRailDatum`, small | 217..656 | 322..558 | 105 | 98 | **7** | **0** | n/a |

Four things this table says that a screenshot does not.

**The block is centred on every candidate, at both fixture widths, at one point
and at five.** v-skew is 7px throughout, and 7px is the clamp padding rather than
a drift: the block is centred in the box the clamp allows it.

**The columns still share a top edge.** `SplitWell` and `FigureBleed` measure
delta **0** on the small fixture, the wide fixture, one point and five points.
Centring the block did not cost the shared edge, which was the risk in this
change: the obvious way to centre — `items-center` on the row — would have shown
0 v-skew and a broken delta, and it is exactly what was avoided.

**Row 11 is the clamp firing, and it is the proof.** `FigureLede` at five points
is the tallest block in the gallery at 437px against a 432px allowance. Its top is
**exactly 224**, four pixels clear of the video reserve, and the overflow goes
downward only (bottom 661 past the well's 656). Under `justify-center` the same
block measured a top of 222 and was inside the reserve. Nothing else in the
gallery is tall enough to trigger it, which is why the five-point fixture exists.

**A SIDE-BY-SIDE LAYOUT CANNOT BE CENTRED AGAINST THE WELL HORIZONTALLY. That is
arithmetic, not a defect.** If the prose occupies the left of the well, the figure
is right of the well's centre by construction: 596px for `SplitWell`, 507px for
`FigureLede`, 473px for `FigureBleed`. Session 6's 24 figure-bearing slides all
measure 0px against the stage for one reason — every one is a FULL-WIDTH figure
with no prose beside it. So "0px stage skew" and "a figure beside content" are
mutually exclusive requirements, and only `CaptionRail` and `CaptionRailDatum`,
which put the prose beneath, satisfy both. **If horizontal stage-centring is a
hard requirement it eliminates three of the four candidates,** before any question
of taste. That is the single most consequential line in this file.

### The two competing left edges, and the alternative answer

A figure centred in the well has its left edge at x=150, while the kicker, the
title and the lead all start at x=64 — the datum `align-check.mjs` measures
against. The slide then has two left edges and the figure reads as inset from the
copy introducing it.

`CaptionRailDatum` (gallery slide 12, beside slide 6) is the alternative: the
same candidate with the width cap released. The figure spans the well, so its
left edge IS the datum, and it is still 0px skew because the well is symmetrical.
**Better on both measures.** It is not the default for one reason: 1152px there
against 980px on the three column candidates is two figure widths in one deck,
which is the defect that produced session 6's five hand-written wrappers.

Centred-in-the-well and one-width-token cannot both be satisfied by a full-width
candidate. Which rule outranks the other is part of the open decision, and both
answers are on the gallery so it can be made by looking rather than by arguing.

### What the stress test says, which is the most useful thing here

Slides 9 and 10 render `SplitWell` at one point and at five. **The figure and the
first bullet share a top edge on both** — delta 0 — while the block itself moves,
because the block is centred and a five-point block is taller. Those are the two
behaviours the lab wants and they are independent: the pair stays locked, the pair
moves as one.

Slide 11 renders `FigureLede` at five. Its figure is centred in its own cell
rather than pinned to the shared edge, so at five points the prose has grown past
it and the two share no axis at all: delta 142px, against 15px on the same
candidate at two points. Compare slide 11 against slide 4.

Three candidates hold the shared edge. One trades it away and says so. That is the
choice in front of whoever picks.

## What was found while building the lab

**`align-check.mjs` NEVER REPORTS DRIFT ON A CONTENT SLIDE.** Its walker measures
from `section > div.relative.z-10`, which is `inset-0` and therefore 1280px wide,
and it descends into a child only when that child spans more than
`contentWidth - 24` (1256px). Every content slide's first child is the
`px-16`-padded column wrapper at 1152px, so the walker classifies the WHOLE SLIDE
as one placed block, calls it ALIGNED because its left edge is the header's, and
never looks inside. Confirmed empirically, not read off the source:
`{contentWidth: 1280, descendThreshold: 1256, firstChildWidth: 1152, descends:
false}`.

So the harness's CHROME, CLIPPED and WRAPPED checks work — they walk every element
independently — and its headline DRIFT verdict, the one its own header comment
says the harness exists for, is inert. The 24px slack was written for a wrapper
that shares its parent's width; `SlideBase`'s padding is 128px. **This is a kit
bug and it belongs in a PR against `slide-kit/slide-template`, not fixed
divergently here.** It also means: do not read "0 DRIFT" from any deck in this
repo as evidence that its columns are placed correctly.

**Centring a flex item is not sizing it.** `FigureLede` wraps its figure in a
`flex items-center` cell for optical centring, and a flex item is sized by its
content, so `w-full max-w-[980px]` inside resolved against the pane's own
shrink-to-fit width: the terminal rendered at 308px inside a 636px column. That
is the 468px-figure-in-a-full-width-block defect `align-check` was written for,
reintroduced by the centring wrapper, and it was caught by looking at the
screenshot rather than at the code (content rules 10 and 17).

**A CLAMP THAT ONLY WORKS WHEN IT IS NOT NEEDED.** `justify-content: center`
spills past the START edge when its content is taller than its box, ignoring the
padding meant to hold the line — so the video-reserve clamp held on every slide
except the one tall enough to need it, where the block landed at y=222, inside the
reserve, on a container whose padding said 224. `my-auto` resolves to zero on
negative free space and pins at the floor instead. The general lesson: a guard
implemented as "centre inside a smaller box" is only as good as the centring
mechanism's overflow behaviour, and the two flex idioms that look interchangeable
differ in exactly the case a guard exists for.

**A LAB MUST BE SCAFFOLDED FROM `slide-template`, NEVER FROM ANOTHER LAB.** This
one was cut from `comparison-lab`, which had frozen an older kit, so it inherited
a 92-line `Terminal` with no `err` line kind and no `powershell` chrome against
the 166-line component that actually ships — plus stale `BoundaryBridge`,
`SwapRows`, `compareFigure.ts`, `QuestionSlide`, `sampleDeck` and `ui/index.ts`,
and no `Tech.tsx` at all. The whole fixture here IS a `Terminal`, so the lab was
briefly judging four layouts against a component no deck renders. Refreshed from
`slide-template/src/` and re-measured; no number changed, because the layouts do
not depend on the figure's internals, but that was luck rather than design.
Three of the four labs cut this day inherited the same stale `Terminal`.

Two related notes for whoever reads this next. The refreshed `Terminal` DOES have
an `err` kind drawn in #F14C4C; session 6's deck header still says it does not,
which was true of an older copy. And the type floor: everything this lab draws is
`text-body-sm` (16px) or larger, the smallest body token in the config. The
fixture's `fontSize={14}` on the `Terminal` is session 6's own value, carried in
verbatim as fixture content rather than chosen here.

**A HARNESS'S TOLERANCE IS A DESIGN CONSTRAINT.** Two of the three sweeps here
have a numeric slack that decides what a layout may do, and neither is documented
anywhere a slide author would look: `qa.mjs`'s 4px frame inset, which forbids a
flush bleed, and `align-check.mjs`'s 24px descend threshold, which is why it
descends into nothing. Both were found by running them, and both changed a
candidate.

## Harness state

Re-run after the vertical rule changed from top-anchored to centred, and after the
kit refresh. Nothing regressed.

- `npx tsc -b --noEmit` clean.
- `node video-safe.mjs` **CLEAN**. This is the one that had to be re-proved:
  centring is free to move a block upward, and the clamp is what stops it.
- `node qa.mjs` at the documented baseline: slide 1 and the last slide only, both
  `NO LOGO` because they carry the mark on stage.
- `node align-check.mjs` reports **2 of 13**, and both are the gallery's own
  demonstrations rather than defects: **slide 8** WRAPPED, the wide fixture
  breaking mid-token in `SplitWell`'s 546px column, which is the point of that
  slide; **slide 11** CHROME, `FigureLede`'s fifth bullet under the control bar,
  recorded as its "worst at". Read the DRIFT note above before trusting the
  absence of a DRIFT verdict.

All 13 slides screenshotted at 1280x720 with a 2600ms settle and read back, which
is how the `justify-center` clamp leak, the 308px flex-item figure and the
mid-token wrap were each found. None of the three was visible in the source.
