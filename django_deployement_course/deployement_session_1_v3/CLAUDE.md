# `deployement_session_1_v3` — Introduction to Docker

The session's own decisions. Everything about the kit itself is in
`slide-kit/slide-template/CLAUDE.md`; this file is only what is true of THIS deck.

The plan, and the record of every deviation made while building it:
[`session_plans/deployement_session_1_v3/plan.md`](../session_plans/deployement_session_1_v3/plan.md).

## What v3 is

**A structural revamp of v2. The content is v2's, slide for slide, and it is not
reopened.** v2 was the same kind of delta to v1: v1's content on a new rendering
layer. v3 keeps v2's words and re-cuts what surrounds them.

| | v2 | v3 |
|---|---|---|
| Slides | 37 | 47 |
| Concepts | 4 sections, two of them 9 and 8 slides deep | 9 concepts, every one 2 to 4 slides |
| Checkpoints | 1 quiz, at slide 32 | 5, at the end of C1, C2, C4, C6 and C9 |
| Ids | `c1`, `c3`, `c4`, `c5`, `c6`, `c8`, disagreeing with their own sections | `c1` to `c9`, matching the section they are in |
| Dividers | one sat in the middle of its own section | each opens the concept it names |

Nothing was added to the teaching. The nine extra slides are five dividers and
four checkpoints.

## Six rules, inherited from v2 and restated in the deck file

R1 scope is Problem 1 only, R2 Windows-first commands, R3 Problem 2 is named and
never opened, R4 no spaced em dash in a rendered string, R5 no trailing full stop
on a rendered slide string, R6 the top-right 367x220 stays clear for the
instructor video. The deck file's header comment carries them in full, next to the
code that can break them.

## Four slides use the lab figures, and four kit changes were needed first

The plan proposed moving five slides onto figures promoted from the labs. On the
first pass **every one of them failed**, always the same way: each was sized against
a four-item lab fixture on a 1100px frame, so it assumed it owned the stage.
Two-point sets stranded 540px, `RuleStack` was a fixed 386px tall whatever its row
count, and `FanOut` at 900px squeezed a four-point column to 150px and ran it off
the bottom of the frame.

So the figures changed, in the kit, and then the slides did:

- `PeerCards` centres its row and takes a `width`.
- `RuleStack` derives its height from its row count and takes a `width`.
- `FanOut` has a named `half` size, 460px, beside `full`'s 900.
- `StatedPoint` takes a `tag`, so the tone's WORD is this deck's and not the lab
  fixture's. The default for `risk` is "the usual trap", and this deck uses `risk`
  for a problem that is merely later.

Then a third pass, because fitting is not the same as looking right:

- `PeerCards` divides the slot by the card count (clamped 240 to 420) and derives
  the card height from the longest label and body at the real content width. Slide
  8's two cards went from 260x254 to 415x150, slide 40's three to 353x180.
- `RuleStack` derives its row height the same way and collapses its marker column
  from 132px to 46px on a set with no `term`. Slide 21's number now sits beside its
  claim instead of 104px away from it.

One bug fell out of it: `RuleStack` drew its ordinal twice on an untermed set, so
two claims read "1 (1)" and "2 (2)". Fixed in the kit.

## The quiz checkpoints are at 9, 14, 22, 30 and 42

One at the end of each of C1, C2, C4, C6 and C9. Splitting slide 40 moved the last
one from 41 to 42 and moved nothing else: every checkpoint still closes the concept
it belongs to. **Check this after any slide is added or removed**, because a
checkpoint that has drifted into the middle of a concept is worse than no
checkpoint: the room is tested on something it has not been shown yet.

Slides 8, 21, 29 and 40 are on the lab figures now. Slide 28 is not: `SplitCompare`
is a `without` against a `with`, and that slide is a mapping with a code panel.
K1 to K4 and D1 to D9 in the plan have the numbers.

## Two collisions with the deck chrome, both found by rendering

Neither was visible in the source and neither existed in v2's own sweeps, because
the control bar grew when the slide picker and the arrow-mode control were added:

0. **Slide 40 was split in two.** Three `PeerCards` plus v2's two callouts do not
   fit one frame: the second callout ran off the bottom. It is "What You Installed"
   and "Read Your Own Output" now, one idea each, which is why the deck is 47.
1. **Slide 36** put the `Shot` caption "Docker Desktop 4.86.0" under the control
   bar, a 271 by 6px overlap at 64,648. The version moved up into the platform
   chip, where there is room. Anything a slide puts in the bottom-left corner is
   legible only by luck.
2. **Slide 35** rendered each install URL as one string with `break-all`, so
   `docs.docker.com/desktop/setup/install/windows-install` broke mid-word across
   two lines. It splits at the last slash now: a student reading a URL off a
   projector to type it needs the break on a path boundary.

## Assets

The three OS marks (`windows.png`, `macos.png`, `linux.png`) live in
`slide-kit/assets/tech/` and are copied into `public/assets/tech/` from there, per
hard rule 13. They are NOT in the kit template's own `public/`, so scaffolding a
session does not bring them: slides 35 and 36 rendered with three broken images
until they were copied in. Anything a slide shows follows the same route, central
copy first.

## Running it

```bash
npm run dev              # port 5212
npm run typecheck
npm run build:html       # -> dist-single/deployment-session-1-v3.html

export CHROME_PATH=/opt/google/chrome/chrome
node video-safe.mjs      # CLEAN
node qa.mjs              # baseline is two: Welcome and Thank you, both NO LOGO
node align-check.mjs     # 0 slides
```

`slideCount` in `deck.config.json` is **47**. It was 44 for one sweep, taken from a
plan whose own arithmetic had folded three closing slides into one row, and the
harnesses silently measured 44 of 46 slides and reported success. Every harness
reads that number.

## The presenter controls this deck ships with

New in the kit as of this session, and they matter here because this deck is 46
slides and most of its figures are click-built:

- **`G`** opens a filterable slide index. Jumping to slide 12 from slide 40 is a
  keystroke, not thirty presses of the left arrow.
- **`S`** swaps the arrow keys between whole slides and build steps. `LayerStack`,
  `ContainerJourney` and `MachineBoundary` are all click-built here, and a
  hardware clicker cannot send Ctrl.
- The control bar hides until the cursor goes to the bottom of the screen.
