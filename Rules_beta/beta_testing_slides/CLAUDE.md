<!-- cSpell:ignore NxtWave -->
# Beta testing slides

A throwaway copy for looking at one visual change. **Not a session, not a course,
and nothing here is a rule.**

Ten slides, copied from `oops_theory/state_behaviour_constructor` (57 slides,
OOPs Theory session 2) on 2026-09-22. Slides 1 to 10 of that deck, unchanged:

```
1  Brand              6  Fan, right now
2  Welcome            7  Question: what is this?
3  Where we Left Off  8  State
4  Agenda             9  Examples of state
5  01 State           10 Pseudocode: attributes
```

That source deck's own notes are at
`../../oops_theory/state_behaviour_constructor/CLAUDE.md` and still apply to the
content; nothing on these ten frames was rewritten.

## The changes under test

Two, both in the header, both kit-owned files.

**1. The kicker's leading accent tick is removed.** `src/ui/primitives.tsx` no
longer draws the 3px by 24px solid pill before the uppercase eyebrow label, and
the `gap-2` went with it. The file carries the full note and the exact markup to
restore.

Everything else about the eyebrow is untouched: same 15px, same 700 weight, same
0.14em tracking, same tone colour.

**2. The rail is now a PAIR of bars, shorter, pulled in towards the text.**
`src/ui/SlideHeader.tsx`. The geometry is measured off `../graphics.png` rather
than chosen; that design was sampled pixel by pixel and every number below is one
of its measurements.

| | Kit | Here | Design |
|---|---|---|---|
| bars | one | **two** | two |
| edge bar | none | x 0..24, `w-6`, `rounded-r-sm` | x 0..24 |
| gap between them | none | **8px** | 8px |
| rail | x 0..6, `w-[6px]` | x 32..38, `w-[6px]` | x 32..37 |
| height | 168px, ending at y=220 | **80px** both, y 52..132 | 76 and 74 visible |
| gap to the text datum at x=64 | 58px | **26px** | 26px |

The edge bar's corner radius is **2px, not 6**. A LANCZOS side-by-side made 6
look right, which is what resampling does to a 2px curve; the design's first row
measures 0.8px narrower than its full width, which is a radius of about two. The
row-by-row measurement is the one to trust.

`h-full` is the header block's own height, so the rail ran the full 168px of a
header WITH a lead and, because `top-1` offsets it 4px, finished 4px BELOW the
block it belongs to. At 80px it starts with the kicker at y=52 and ends five
pixels under the title's baseline, so it brackets exactly the pair rule 19 pins
and stops before the description.

`-left-16` is -64px, which cancels `SlideBase`'s px-16 gutter exactly, so it
lands on the frame edge. In the kit that is where the only bar sat, 58px from the
text and reading as unrelated to the heading, with `rounded-pill` on a 6px bar
having its left half cropped by the edge. Here that position belongs to the 24px
edge bar, where bleeding off the canvas is the point, and the rail moves to -32px:
26px off the datum, about four bar-widths, close enough to read as attached.

The 8px seam between the two is the whole idea of the pair. Two marks close
enough to read as one object, with a gap that catches the light. Any wider and
they are two unrelated bars.

The cost: a fixed height no longer adapts to a two-line title, where the rail now
stops level with the first line. The gradient has faded to nothing by then, so it
does not read as short. If it ever does, `h-24` is the next step up.

Slide 4 is unaffected by either change: `AgendaSlide` has its own layout and does
not use `SlideHeader`.

**3. The safe-area frame is GONE.** It was a guide on slide 9 outlining the
canvas minus the 367x220 instructor-video rectangle, built from six divs and
defined in `src/decks/betaTestingDeck.tsx`. Removed on request: the orange lines
had done their job. `video-safe.mjs` still asserts the same rectangle, so nothing
was checking it that is not still checking it, and slide 9 now passes `qa.mjs`
outright, because that full-bleed `inset-0` layer was the one thing it reported.
Git history has the component if it is ever wanted again.

**4. Slide 9 is laid out to the A.png zones.** Session-owned: `ZonedNoteSlide`
is defined in `src/decks/betaTestingDeck.tsx` and slide 9
is the only thing that uses it. `ContentNoteSlide`, `SlideHeader` and `SlideBase`
are untouched, so the other nine slides still render the old way and `sync-kit`
has nothing of this to overwrite.

`../A.png` is a hand-annotated template drawn over this deck's own header. The
zones it names, and what each one now means:

| Zone | Slide coords | Role |
|---|---|---|
| Header | x 0..912, y 0..148 | kicker and title, **and nothing else** |
| Speaker box | x 913..1280, y 0..220 | held empty, same rect `video-safe.mjs` asserts |
| Space-1 | x 64..1159, y 251..709 | the content area, and the default answer |
| Space-2 | x 1159..1214, y 251..658 | 55px of extra width, taken only if Space-1 will not hold it |
| Space-3 | x 64..880, y 162..240 | 78px of extra height, taken last |

**The lead came out of the header.** It used to be a third line under the title;
it is now the first block inside Space-1. That is the one content change: no
wording moved.

Overflow order is width-driven. Space-1 first; then Space-2's 55px if the content
needs a little more measure; then Space-3 if the layout needs more room than that
width can give. Nothing goes above y=162 and nothing in the Space-3 band goes past
x=880, because past that is the speaker box.

**Slide 9 fits in Space-1, so Space-2 and Space-3 are both empty here.**

**The vertical margins come from `../C.png`, not from Space-1.** That file is the
same capture with three horizontal lines on it and no vertical ones. Measured by
thresholding the annotation colour and taking the row runs:

| Line | Slide y | Spans | Means |
|---|---|---|---|
| 1 | y = 3 | x 0..912 | the canvas edge, and nothing more |
| 2 | y = 221 | full width | the body's ceiling. The video rect's floor, drawn |
| 3 | y = 647 | full width | the body's floor. **62px tighter than Space-1's 709** |

(a fourth dark band at img y 872..883 is the deck's own `slide-footer-bar`.)

The body is CENTRED BETWEEN LINES 2 AND 3, on y=434, not on Space-1's own
midpoint of 480. **The header is not centred against line 1 and does not move.**
So the body box is Space-1 horizontally (x 64..1159) and the margin band
vertically (y 221..647).

It lifted the group 46px and pulled its bottom back off the floor line: centred on
Space-1 the callout ended at y=662, overhanging 647 by 15px.

**The band does not apply to Space-3, and the geometry is the reason.** Space-3 is
y 162..240, above the band's ceiling. A layout reaching into it has crossed y=221
and is growing upward from a fixed floor, so there is no band left to centre in.

The three object cards were widened 268 -> 346 so the row spans Space-1 exactly
(3 x 346 + 2 x 28 gap = 1094), flush with the callout under it on both edges.

**64, not the measured 61.** A.png is a 1561px capture of a 1280px canvas, so
every number off it is an image pixel over 1.2195 and carries ~3px of rounding.
Its left edge, 61, is the kit's own `px-16` gutter at 64, which is what the
header's accent bars are built around (`-left-16` cancels exactly 64). The header
and the body have to share one left edge or the slide reads ragged. Same on the
right: the measured 1214 is `px-16`'s 1216.

**Two zone boxes, not one full-canvas wrapper.** The obvious build is a single
`RevealGroup` at `h-full w-full` with the zones absolutely placed inside it. It
renders identically and it blinds `qa.mjs`, which reports the OUTERMOST element
failing `sr.right - 4` / `sr.bottom - 8` and then stops descending: a 1280x720
wrapper fails that by construction, so everything inside would go unchecked.
Boxes the size of their own zones keep the sweep able to see the content.

Rendered and measured: header kicker y 52..70 and title y 84..127, both inside
x 0..912, y 0..148. Body container exactly x 64..1159, y 221..647. Content ink
y 252..616, height 364, midpoint y 434.0 against the band's 434. Cards
x 64..1158, callout x 64..1159. Nothing in Space-2, Space-3 or the speaker box,
and nothing across either margin line.

## This is deliberately NOT a rule

Nothing was changed in `RULES.md`, `.claude/skills/`, `slide-kit/` or any other
deck. The kit still draws the tick and every other deck in the repo still shows
it. This folder exists so the two can be compared before anyone decides.

**DO NOT RUN `sync-kit.mjs --apply` ON THIS FOLDER WHILE THE EXPERIMENT IS
RUNNING.** `src/ui/primitives.tsx` is a kit-owned file, so a sync overwrites it
from the template and puts the tick back without reporting anything. That is the
whole hazard of testing a kit change inside a session copy, and it is the reason
this note exists.

## What else came across that is not the source deck's

Three kit files were taken from the current template rather than from the source
session, because the source is behind the kit and a test deck should not
reproduce a bug that is already fixed:

`src/deck/SlideStage.tsx`, `src/deck/Deck.tsx`, `src/index.css`, plus
`fit-check.mjs` and `qa.mjs`.

That is the stage-scaling fix: the deck is fitted with CSS `zoom` rather than
`transform: scale()`, so text is rasterised at the size it is shown at instead of
being stretched as a texture, and the slide is centred by a box CSS alignment can
actually see. Without it this copy would render soft on a GPU-composited browser
and pin itself to the top-left at any aspect ratio that is not 16:9, which would
sit between you and the thing you are trying to look at. The source session's
`index.css` was byte-identical to the kit at HEAD before the swap, so nothing
session-specific was lost.

## Running it

```bash
npm install
npx vite --port 5233 --strictPort
npx tsc --noEmit -p tsconfig.app.json
```

`npm run typecheck` and `npm run build:html` fail on `src/export/slideModule.tsx`
importing two generated files that are gitignored and absent. That is
pre-existing across the whole repo, not something this copy introduced; the
source session's `CLAUDE.md` records the same thing, and the line above is the
correctness check that works.

```bash
node qa.mjs           # slide 1 only, and it is the brand frame, NO LOGO by
                      # design. Slide 9 used to be flagged for the safe-area
                      # guide's full-bleed inset-0 layer; that guide is gone, so
                      # the zone layout reports nothing at all
node video-safe.mjs   # must print CLEAN
node align-check.mjs
node fit-check.mjs    # CENTRED, and LAYOUT STABLE
```

## Throwing it away

Delete the folder. Nothing outside it refers to it, no rule file mentions it, and
no other deck imports from it.
