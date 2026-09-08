# Project code explanation lab

**AWAITING A DECISION.** Candidate designs for explaining real code spread across
real files. The user picks what is worth keeping and those get promoted into
`slide-kit/slide-template`; the rest stay here as the record of what lost.

**Not a session.** The fifth lab inside the kit, built to the same rules as
`flow-lab`, `flowchart-lab`, `features-lab` and `pseudocode-lab`.

```bash
npx vite --port 5225 --strictPort
npx tsc -b --noEmit
export CHROME_PATH=/opt/google/chrome/chrome
node qa.mjs && node video-safe.mjs && node align-check.mjs
```

`node_modules` is a symlink to `../slide-template/node_modules`.

---

## Why this lab is separate from `pseudocode-lab`

They look like one problem and are two. **Pseudocode explanation is about ONE
algorithm**: what does this logic do, and what happens when it runs.
**Project-code explanation is about MANY FILES**: where does this live, what calls
it, what must be true elsewhere for this line to make sense.

A trace table answers the first and is useless for the second. A file map answers
the second and is useless for the first.

## What the kit cannot do today

`CodeBlock` shows one file. `CodeBuildSlide` shows one file growing. `FileTree`
shows the shape of a directory. **Nothing connects them**, so a walkthrough of four
files is four slides with no thread, and the room is asked to remember where
`serializers.py` sat while looking at `views.py`.

`CodeBlock` also cannot be reused here for a specific reason worth recording: its
gutter is hardcoded to `{i + 1}`, so a snippet from the middle of a file is
numbered from 1 and the figure tells the room the code sits at the top of its file.
Every variant here renders line numbers from `snippet().from`.

## What the literature asks for

The target form is **walkthrough documentation**: a guided tour of the codebase,
using snippets as points of interest on a map, and its named value is filling the
gap between low-level and high-level documentation. Its three needs are annotation,
consistent colour per module or layer, and the ability to move between levels of
abstraction.

So the unit of the contract is a **STOP ON A TOUR**, not a file. `files` is the
map; `stops` is the route.

## The variants

Layer colour is identical across all three: routing blue, request handling info,
translation teal, data amber, indexed off `resolveProject().layers` order.

| Variant | The argument | Worst at |
|---|---|---|
| `TourStops` | a map that stays put, one snippet at a time beside it, so the room never loses track of where a snippet LIVES | the handover: `via` is drawn nowhere, so a room can name all four files and still not say what calls what |
| `CallFlow` | the handover is the subject, with the mechanism named on every line | it shows no code. See below |
| `LayerMap` | some questions are "where does this live", not "what happens next" | teaches no code at all, and collapses when every layer holds one file and one stop |

## `CallFlow` gave up its code, and that was the fix

Its first version put a snippet in each of five 200px cards. `align-check.mjs`
reported **28 wrapped tokens on that one slide**, and
`price = models.DecimalField(max_digits=8, decimal_places=2)` came out over four
visual lines.

Wrapping was the right call against clipping, because a clipped line silently
claims the code ends where the card does. But the honest conclusion from the
measurement is that **five snippets do not fit side by side on a 1280px stage at
any legible size**, and a figure showing code the room cannot read is not showing
code.

So it now does what its own argument says it is for: file, claim, line range, and
the mechanism on the line between. `TourStops` is the variant that shows the lines
themselves. Two figures, two jobs, rather than one figure doing both badly.

## The fixture breaks the neutral-fixture rule on purpose

The sibling labs use deliberately neutral fixtures so a familiar subject cannot
bias the judgement. This lab is the opposite case: **what is being judged IS how
well a layout explains real code across real files**, and invented code cannot test
that. So it is a four-file Django API slice, the stack this course teaches, and the
code is minimal but correct rather than a reconstruction.

The route is the **request's** path, not the order the files were written. Reading
order and execution order are different, and a walkthrough should follow the one
that answers the question a learner actually has.

Two consecutive stops sit in the SAME file (`views.py`, stops 2 and 3) on purpose,
because a layout that implies a file boundary where there is none is a specific
failure worth testing. `CallFlow` handles it three ways and its doc comment says
how.

## A padded pill is not wrapped text

`align-check.mjs` infers a wrap by comparing an element's height to its
line-height, so a pill with `py-1` and a border measures 27px against a 16.5px line
and is reported as two lines. It happened twice here, on `TourStops`'s file chip
and `CallFlow`'s `via` labels, and the flow-chart lab hit the identical false
positive on its token chips.

**The fix is to give the text its own tight-leading span** so the padded box
carries no direct text and the harness measures the span. Worth knowing before
chasing a wrap that is not there: measure the element, do not trust the label.

## Verification

All three harnesses, three slides: video-safe CLEAN, qa ALL CLEAN, align-check
0 of 3.
