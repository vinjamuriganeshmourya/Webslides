# Cloud Computing · "Cloud Computing Fundamentals"

The session deck for the first cloud computing session. Read this before
editing it. The kit rules are in `KIT.md` and `../../../slide-kit/slide-template/CLAUDE.md`.

- **Plan:** `../session_plans/cloud_computing_fundamentals/plan.md` (signed off on
  the user's word, 2026-10-14).
- **Source:** `Reference ppt's/cloud-computing-fundamentals 1.html`, content only.
  Every on-slide string is the reference's; its TR speaker notes are the notes.
- **Deck file:** `src/decks/cloudDeck.tsx`, 69 slides (53 until the 2026-10-15 review split eleven; 64 until the 2026-10-16 review split five more). Port 5270
  (`npx vite --port 5270 --strictPort`; the kit's vite.config says 5173).
- **Figures:** `src/decks/figures/`. `scene.tsx` (Card, Stage, Rail, Label,
  Arrow, Slider, useLoop, useCycle), `why.tsx` (slide 5), `art.tsx` (every drawn object), `people.tsx` (the
  cast), `analogy.tsx` (the eleven analogy scenes), one file per section
  (`basics`, `history`, `traits1`, `traits2`, `benefits`), `closing.tsx`
  (takeaways). `cast/` is the character lab's rig, vendored unchanged from
  Python 31, with `Cast.tsx` (Idling, Posed, crops).

## Decisions

1. Eight "continued" pairs from the reference are one slide each.
2. Every figure body is one 1110px box on the left edge (content rule 38).
   Scenes inside it are absolutely placed on fixed stages, so a step never
   moves what is already there.
3. Labels, notes, controls and badges never render under 14px (`scene.tsx`
   floors them). qa still warns about the 16px floor on figure labels; the
   rail bullets and every heading are 16px or more.
4. Arrow svgs are sized to the line and its heads only, because
   `overlap-check.mjs` reads an arrow by its svg box.
5. No autoplay: `AUTOPLAY_ON_BY_DEFAULT` is emptied at the bottom of
   `cloudDeck.tsx` (it ships holding Python 31's numbers).
6. Key Takeaways is `figures/closing.tsx`, not the kit's slide: the kit's ran
   the fifth item under the player bar.
7. Live loops (`useTicker`, CSS spins) hold still on `?all`, `?noauto` and
   `?still`, or harness screenshots stall.
8. No drag-to-move content. Since the 2026-10-16 review spec there are no live
   controls at all: every scene that had a button or a slider runs itself
   (`useLoop`, `useCycle`, `Slider auto`), and `Control` in `scene.tsx` is unused.

## Checks, and the numbers this deck passes them with

```bash
export CHROME_PATH=/usr/bin/brave-browser
U="http://127.0.0.1:5270/?all"
node qa.mjs "$U" 69; node video-safe.mjs "$U" 69; node align-check.mjs "$U" 69; node mixed-align-check.mjs "$U" 69
node box-overflow-check.mjs http://127.0.0.1:5270 69; node controls-clear-check.mjs http://127.0.0.1:5270 69; node .text-audit.mjs 1 69
node workflow/export/build-reveal-steps.mjs "http://127.0.0.1:5270/?nav=slide&x=" 69
AGENDA_SLIDE=3 node agenda-check.mjs; node feedback-check.mjs; node ligature-check.mjs; node overlap-check.mjs
CONTENT_SLIDE=5 node gesture-check.mjs; CONTENT_SLIDE=5 node phone-nav-check.mjs
CONTENT_SLIDE=5 PLAIN_SLIDE=2 node autohide-check.mjs   # no slide has an in-slide button since the 2026-10-16 spec; the tap-on-a-button step reports itself skipped
node nav-stress-check.mjs $PWD/dist-single/cloud-computing-fundamentals.html chromium
```

## 2026-10-15 review: splits, no builds, transitions, picker thumbnails

- **Splits.** A slide whose lead/definition crowded its points and picture is two
  slides: the statement alone in `Statement` (`scene.tsx`, one 1110px box,
  highlighted phrases, a small static picture), then the points and the picture
  with no lead. Slides 6, 18, 21, 24, 38, 39, 41, 42, 44, 46 (old numbers);
  34 splits as chart, then table. Slide 11 and 16 copy is the review's, word for
  word. Slide 47 lost its balances (they repeated the table's six strings); slide
  38's balance lost the pair labels under its pans for the same reason, and
  slide 21 lost the "what cloud inherited" panel (it repeated Cloud Legacy).
- **No builds.** `revealEveryStep()` (kit `Stepper`, session-local change) shows
  every beat on mount and reports 0 steps, so every press is a slide. `Card`
  renders no Next and no Autoplay. `isNow()` in `scene.tsx` returns false, so no
  bullet or row is lit as "the current beat".
- **Transitions.** `player.smooth` (kit `Deck`/`types`, session-local): every
  move, including the plain arrows and the picker, plays the deck's one `slide`
  transition (fade + 120px, 0.6s, `[0.22,1,0.36,1]`, the reference's numbers);
  no held-header cuts; `prefers-reduced-motion` turns it into a plain fade.
- **Element entrances.** `figures/entrance.ts`: on each slide mount (a
  MutationObserver, before first paint) every text block, drawn box and picture
  under the header gets opacity + `translate` 26px, 0.55s, same curve, from
  0.25s, step <= 60ms shrinking with the unit count so the last ends by 1.5s;
  text and boxes before pictures. Kit entrances (agenda, divider number, quiz)
  are sped to end by 1.5s too. Off on `?all/?noauto/?still`.
- **Picker thumbnails.** `player.thumbnails` (kit `SlidePicker`, session-local):
  each card renders its slide live at 1280x720 under InstantContext, scaled,
  lazily (IntersectionObserver, 3 mounts per frame), kept mounted while open.
  Cards are `div role=button` (a slide's own buttons cannot sit in a button).
  `useTicker` and `Idling` hold still under InstantContext, or 64 live rigs drop
  the picker to 12fps.
- **KIT FILES WITH SESSION-LOCAL CHANGES:** `src/motion/Stepper.tsx`,
  `src/deck/Deck.tsx`, `src/deck/types.ts`, `src/deck/SlidePicker.tsx`.
  `sync-kit.mjs --apply` overwrites them; the deck then fails to typecheck on
  `revealEveryStep`, which is the signal. Re-apply from git before shipping.
- **Checks.** autoplay-check no longer applies (nothing autoplays); every slide
  reports 0 reveal steps. Analogy scenes still run their live loops, so a
  `?still` frame and a live frame differ on 30, 37, 47 by design.

## 2026-10-16 review: Character Lab style, no people, no underlines, glide

- **Splits** (old numbers 15, 17, 29, 32, 46): `mainframes-2`, `virtualization-2`,
  `self-service-2`, `pooling-2`, `capex-points-2`, each right after its parent.
- **Clay finish.** `art.tsx` `CLAY`/`ClaySvg`/`mountClayDefs`: the Lab's
  `ClayFilter` at object scale (rim shade away from an upper-left lamp, rim light
  toward it), on every top-level part of every object svg; `data-flat` opts a part
  out. New drawings: `clay-a.tsx` (basics), `clay-b.tsx` (history), `clay-c.tsx`
  (traits), `clay-d.tsx` (benefits), one per section, all on `ClaySvg`.
- **People.** `cast/` re-copied from the Lab's clay restyle (2026-10-16);
  `people.tsx` is the Lab presets (no `rohan`: no beard anywhere; `BAKER` beardless).
  Faces were removed everywhere the review asked; people remain only in the
  reading room (17) and the mess kitchen chef and students (37). Every rig holds
  one frame (`Idling` is always still: no animation unrelated to content).
- **No underlines** (content rule 49): Statement highlights are brand colour,
  semibold; the feedback link underline is off in `src/slides/FeedbackSlide.tsx`
  (kit, session-local). The kicker's gradient divider STAYS (user, same day: part
  of the template, a must on every slide).
- **Sentence case** on every label; `.text-audit.mjs` checks it and underlines.
- **Agenda:** five titles only, no sub lines.
- **Entrances in reading order** (`entrance.ts`): top to bottom, left to right
  within an 18px row; an svg path with `data-draw` draws itself on in its slot
  (the NIST tree's connectors, slide 8).
- **Glide transition** (`src/motion/presets.ts` 'glide', used by `Deck` when
  `player.smooth`): opacity + a literal `transform: translateX(±60px)`, 0.6s,
  `[0.22,1,0.36,1]`, so framer hands both to the compositor (WAAPI) and a heavy
  slide's mount frame cannot jerk it. Reduced motion: fade.
- **KIT FILES WITH SESSION-LOCAL CHANGES** now also: `src/motion/presets.ts`,
  `src/slides/FeedbackSlide.tsx`.

## 2026-10-16 slide 5: the reference render's own illustration

The user supplied a rendered reference for slide 5 ("Cloud Computing: From
Guesswork to Scale.png", a 3D-render infographic of the same content) and,
after two redrawn passes (clay solids, then the render's gradients and glows)
asked for the exact illustration, proportionate to the slide, with the
render's graphics used on the cards. So the cards ARE the render's cards.

- **Pipeline** (PIL, recorded here because the images are derived): the
  render's text (two card titles and notes, the two left chips, the billed
  pill and its stub) is wiped by a horizontal gradient fill across each text
  block; each card is cut six pixels inside its border (714x386 and 756x386)
  and one lit and one frosted tile is cut per column (80x39, cells at x 84,
  189, 294 and y 243, 287, 331 of the right cut). Output in
  `src/decks/figures/img/`, imported as modules so the single-file build
  inlines them. The deck's DOM text sits where the render's did (rule 17).
- **Layout** (`figures/why.tsx`): two stages 522x284 and 558x284 (the cuts'
  proportions, 1% off), each `background: url() / 100% 100%` over the card
  skin's shadow; chips from x=246 on the left (clear of the coins at 231),
  the billed chip centred under the meter at x=414; the crate and calendar
  (clay, the render has none) appear on the left card's lower right when
  short.
- **What moves** (review 2026-10-16 global rule 3): `useLoop` ping-pong, one
  lap every 8s, drives `<Slider auto fill>` (no hand can move it) and the
  picture follows: chip numbers, and nine tile overlays, each the render's
  own lit or frosted cut, cross-faded where a cell's state differs from the
  base (top row lit in the render). Held at demand 0.25 on harness URLs, the
  render's own numbers (2 billed, 4 paid idle). The meter needle and the
  rack's lights are the render's pixels and do not move.
- **Earlier passes kept on disk, unused by the slide:** `depth.tsx`
  (palette and helpers), `rack.tsx` (`IsoRack`), `cloud.tsx` (`GlossCloud`,
  `Cables`, `ServerTile`, `MeterTile`); `card.tsx` (`CARD_SKIN`, the layered
  CSS card: white bloom, blurred brand hill, pale base, inset rim, three
  shadows) is still what `Stage raised` spreads and what slide 5's shadow
  comes from.
- **Scene-kit opt-ins, all off by default:** `Label` `icon`, `iconRound`,
  `raised`, tones `solid` and `lift`; `Slider fill` and `Slider auto`;
  `useLoop` and `useCycle` (every loop holds still on harness URLs and under
  InstantContext).

## 2026-10-16 review spec: title slides, no clipping, loops not hands

The pasted spec ("ROLE / GLOBAL RULES / SLIDE-SPECIFIC CHANGES"): title
slides show only the title (the five section dividers lost their subtitle
in `cloudDeck.tsx`); nothing clipped anywhere; every manual interaction is an
automatic seamless loop (`useLoop`, `useCycle`, `Slider auto` in
`scene.tsx`); motion only where it explains the content; one easing and one
set of durations (state 520ms, arrow draw 860ms, entrance 0.55s, loop lap
8s, step 2400ms). Applied by five parallel agents, one per figure file; their
per-slide changes are listed in the review report given to the user.

- **Per-file hooks the agents added** (candidates for `scene.tsx` if a third
  file wants them): `useDrawn(delay)` in history.tsx and analogy.tsx (true once
  entrances settle, so an `Arrow` draws on mount; true at once on harness
  URLs), `useGo(ms)` in traits1.tsx (the same idea, imported by traits2.tsx),
  `useGrown()` in benefits.tsx (a graph grows along time on open).
- **Cast.tsx** gained `Posed alive` / `Idling alive` (blinks, glances, a
  degree of joint drift, `presentHold` for the chef), still on harness URLs
  and under InstantContext, and `FACE_WHOLE` (a crop that keeps hair). Slide
  37's chef hand and the students' heads were the two clipping defects found
  across the deck; nothing else was clipped.
- **Live-frame screenshots.** Playwright's `page.screenshot` waits on
  `document.fonts.ready`, which never settles on a slide that mutates svg
  attributes every frame (or an `alive` rig); the harness URLs hold every
  loop still so the checks are unaffected, and a live frame is taken through
  CDP (`scratchpad/an/shotcdp.mjs` of that day) or after moving per-frame
  motion onto transforms (slide 40).

## 2026-10-16 motion layer: every visual says what it is

The pasted "Motion & micro-animation layer" spec: on top of the design, every
visual element loops subtly with motion that expresses its meaning (the
catalog: screens type, clouds levitate, LEDs blink, toggles throw, gears
spin, arrows flow, signals ripple, locks lift, ticks pop, alerts shake,
bulbs glow, charts breathe, clocks tick, rockets hover, characters breathe),
and anything without a semantic match gets the default float. Text is never
animated beyond its entrance. This supersedes the earlier review spec's
"nothing decorative" for idle motion; it does not reopen anything the user
asked to keep static (slide 1's background, the logo).

- **The layer** is `figures/motion.ts`: `MOTION_CSS` (keyframes and one class
  per kind, mounted by the deck after `ART_CSS` and `SCENE_CSS`) and
  `mo(kind, seed, { dur, base, knob })`, which returns the class list and a
  per-element negative delay from a golden-ratio seed so a group is never in
  step. Transform, opacity and stroke properties only; `.mo` sets
  `transform-box: fill-box` for svg parts.
- **Off switches** are in the CSS itself: `.cc-still .mo` (harness URLs),
  `.deck-thumb .mo` (picker thumbnails) and `prefers-reduced-motion` all set
  `animation: none`. Inactive slides are unmounted by the deck and a hidden
  tab paints nothing, so nothing else pauses them. Every harness frame is
  therefore the still design; a live frame pair 0.8s apart shows the motion.
- **Placement rule.** A motion class goes on an inner `<g>` or a wrapper,
  never on an element whose inline `transform` or `transition` a state change
  drives (a Fade, a needle, a growing bar), or the loop replaces that
  transform. Where a float's 6px travel has no clearance, `hover` (3px) or
  `pulse` (scale 1.03) is used, so no footprint grows.
- **Arrows** (`scene.tsx` `Arrow`): a lighter dash rides every solid arrow from
  source to target (`mo-dash`), and a dashed arrow's own dash moves.
- **Slide 5** is the reference render's pixels: its rack, cloud and meter
  cannot carry inner motion, and a photographed card floating would read as a
  loose plate, so the two cards stay still (the slider and its chips and
  tiles already loop). Flagged to the user as the one exception.
- Applied by five parallel agents, one file group each; the per-visual list
  of assigned motion is in the report given to the user.

## 2026-10-16 same style for all: slide 5's cards and pictures are the standard

The user: "you have slide 5 for image style reference and boxes reference,
apply that to all slides, same style for all." So:

- **Boxes.** `Stage` is `raised` by default (`CARD_SKIN`, card.tsx): every
  scene card, statement card and analogy card is the same plate as slide 5's.
  Row boxes and inner tiles take `TILE_SKIN` (card.tsx: the same base, rim
  and top highlight, a shorter shadow, no hill): the kit `Rail` rows in
  scene.tsx, and every locally styled point row, era card, device tile,
  table frame and map frame in the section files. A `Stage` nested inside
  another is `raised={false}` with `TILE_SKIN`, so plates never stack.
- **Pictures.** Slide 5's pictures are the render's pixels; no render exists
  for the other slides, so their drawings are restyled to the same look with
  the depth system (`depth.tsx`: palette `R`, `Lin` gradients, `GlowDef`,
  `Shadow` + `BlurDef`): a front face, a lit top, a darker side, a specular
  on the upper left, glows on lights, a blurred cool ground shadow; frosted
  glass for inactive things; gold with a radial highlight. `rack.tsx` and
  `cloud.tsx` are the worked examples. The motion-layer classes, state
  behaviour, props, footprints and DOM labels are untouched by the restyle.
- Applied by five parallel agents, one file group each (art, clay-a+b,
  clay-c+d, analogy, section scene files), after the shared Stage/Rail
  change.
