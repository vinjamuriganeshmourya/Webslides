# updated_template — decisions

Read before editing anything here. `README.md` is the manual; this is why
things are the way they are.

## What this is

The six chrome slides (all the best, agenda, section breaker, welcome, next
session, thank you — numbered in that order, which is how the review of
2026-10-09 numbered them) rebuilt from the layered references in
`slidestraining/` as a standalone deck project. It shares no code with
`slide-kit/slide-template` and is not synced by `sync-kit.mjs`.

## The rules this deck is held to (decided 2026-10-09)

1. **The references are the source of truth** for sizes, weights, positions,
   colours (including colours outside the style guide's palette), grounds,
   rings, glass and grain. Every number was MEASURED off the reference
   pixels — text ink boxes, ring centres (two circles of radius 790, 3px
   stroke, on every slide), stroke alpha against angle, glass alpha and blur
   σ, grain standard deviation and autocorrelation — and the measurement is
   recorded next to the number in the component comment. Change a number
   only with a measurement.
2. **Typefaces come from the style guide**: Sora SemiBold for the big words
   and titles, DM Sans for everything else. The references were set in other
   faces (the hero words match Inter Tight SemiBold, the old section breaker
   is Poppins ExtraBold, the agenda numerals match no Google face); the
   style-guide faces were chosen over them. Each text style is sized so its
   ink HEIGHT equals the reference's; widths therefore differ a little (Sora
   is wider than Inter Tight), which is expected and accepted.
3. **Static.** No framer-motion, no transitions, no reveal steps.
4. **Canvas is 1920×1080**, the frame the references were exported at.

## How the grounds are made

- **Everything on every slide is live HTML/CSS/SVG** (decision of the second
  review, 2026-10-09). The only bitmap in the deck is the brand mark.
- The two dark grounds (welcome/next-session mesh, closing gradient) are
  stacks of CSS radial-gradients in `src/design/grounds.ts`, FITTED to the
  de-grained reference background layers by least squares with
  `scripts/fit-grounds.py` (numpy + scipy; the init JSON is one row per
  layer). Error against the reference, 8-bit levels: mesh 16 layers rmse 5.0
  / mean 3.5 / p99 16.8 (the residual is the hard rim of the dark pool);
  gradient 6 layers rmse 1.9 / mean 1.5 / p99 6.1. In the built deck the
  per-pixel median error is 3.7 (mesh) and 1.3 (gradient). An earlier version
  used 320×180 PNGs of the reference art (error 0.3); they were retired
  because they were bitmaps.
- Grain is synthesised on top with an SVG filter (`Stage` in
  `src/ui/shared.tsx`): monochrome fractal noise ADDED to the ground with a
  zero-mean arithmetic composite, tuned in a headless render to the
  reference's statistics (σ=2 high-pass std and lag-1 autocorrelation: mesh
  2.7/0.54 against 2.85/0.55 measured; gradient 1.6/0.33 against 1.5/0.33).
- The agenda ground is a plain CSS wash and carries NO grain: the reference
  has none (0.5/255, which is dithering). Decision of the review.
- The section breaker uses the new gradient ground with the closing frames'
  two rings (decision of the review), the old frame's text positions and
  sizes, and the corner mark.

## The hero words and their slabs

The second review asked for the hero words (Welcome, Thank You!, All The
Best) to be smaller and their slabs to shrink with them. They are now sized
so the word is as WIDE as the reference's (Sora is wider than the reference
face, so at the reference's ink height it ran ~10% too wide): Welcome 192px,
closing 150px. The slab is a function of the font (`heroSlab` in
`src/ui/shared.tsx`): height 1.2·fs, side padding 0.62·fs, full radius —
the reference's own proportions (slab 1.6× the ink height, 0.83× past it
either side). Each slab is centred on the reference slab's centre line
(welcome y=687, closing y=667). Measured in the built deck: welcome slab x
375–1604 vs reference 375–1603; thank-you 450–1472 vs 439–1481.

## Known, accepted differences from the references

- Text heights (typeface, rule 2 + width matching): the hero words are ~10%
  shorter than the reference's ink (welcome 142 vs 157px), with the same
  width and centre line.
- Agenda bodies under a two-line title sit 10px higher than the reference's
  (the reference's gap under "Challenges & Applications" is 10px larger than
  under one-line titles; the first column, which is the one that is checked,
  is exact).
- The next-session chip is 12px wider (DM Sans at the matched height is 10px
  wider than the reference face).

## Slide 7: the orbit-mark agenda (added 2026-10-12)

The Python course's agenda (`Outputs/python/27_sets/src/decks/figures/
Agenda.tsx`: navy mark, orbit ring, one Bézier sweep, numbered points) on
THIS deck's agenda ground, the one `slidestraining/agendaslides/Agenda_layer4
copy.png` shows. Asked for on the user's word as a new slide: slide 2 is
untouched, and the six keep their numbers. `src/slides/AgendaOrbitSlide.tsx`
holds it; the kit's numbers are kept verbatim on a 1280×720 box scaled ×1.5.
Static (rule 3) and in this folder's faces (rule 2); colours are the kit's.
Measured in the built deck against the reference PNG where the agenda puts
nothing: right 40% of the frame mean 1.9/255, bottom-left strip 0.5/255.

## Slide 8: the content header in the new design (added 2026-10-12)

`src/slides/ContentSlide.tsx`: kicker, the style guide's GRADIENT DIVIDER,
heading; the Python course's edge rail (two bars at the frame's edge,
`Reference ppt's/image copy.png`) is gone and the divider sits between the
two lines of text instead. The kicker and heading keep the kit's boxes
(user: same positions and sizes as now): reference kicker ink y 82..98,
heading caps top y 135, left edge x=96; built deck kicker y 81..96, heading
caps top y 134. Divider 4px at y 115, 600px from x=96, the agenda rule's
gradient. Heading in Sora SemiBold 51px, kicker DM Sans 700 at 22.5px
tracked 0.14em in brand blue. `src/slides/SetOperationsFigure.tsx` is the
reference frame's body, static, measured off its pixels, so the header is
judged on a real slide; `index.html` now also loads JetBrains Mono 600 for
the two set names.

## Housekeeping

- `deck.config.json` → `slideCount` must match `src/decks/templateDeck.tsx`.
- `devPort` 5259 is the next free port after the Python course's 5258.
- `npm run render-check` writes one 1920×1080 PNG per slide to
  `workflow/qa-shots/` from the built file; hold them against
  `slidestraining/`.
- The root `.gitignore` ignores everything under `dist-single/` except named
  decks, so `dist-single/updated-template.html` is not tracked unless a
  `!**/dist-single/updated-template.html` line is added there (a root-file
  change, so ask first).
