<!-- cSpell:ignore NxtWave devPort Teja Maggi Sneha Vamsi Pooja Kiran -->
# Sets · session notes

Python course, Programming Foundations session 27. Built on 2026-10-08 from the
pedagogy team's session spec: `Reference ppt's/27_sets_session_spec.json` (the
data) and `…_spec.html` (the reading page, with thumbnails of the original
deck's kept slides 15 to 31). The plan is at
`../session_plans/27_sets/plan.md`. The scaffold was copied from session 26
(which carries the generate-slides 2b standard); `Cast.tsx` and `cast/` came
from session 25. Course rules and the feedback log are in
`../workflow/skills/python-course/SKILL.md`.

The deck has 31 slides, one per spec card (29, plus DS2 and DS3 from the
change spec of 2026-10-09, decision 15). `devPort` is 5257: run
`npx vite --port 5257 --strictPort --open false`. The deck file is
`src/decks/setsDeck.tsx`.

## Decisions specific to this deck

1. **One slide per spec card, all 29, in the spec's order.** No divider cards
   in this spec. Every card with presses carries `data-spec` and
   `data-presses` equal to the spec's `press_count`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` (`SPEC` and `NOTES`, the say lines) from the JSON. 55
   programs and G2's five rounds ran on CPython 3.12.3 and match, except C3's
   third run, whose order depends on the hash seed; the spec's text is kept.
3. **One picture, the bag** (`figures/bag.tsx`, spec note 5). A set is a round
   bag of chips with no numbers. A chip's place is fixed by its index in
   `universe`, so nothing inside moves when another chip joins, bounces or
   leaves; `drift` moves them on purpose (C1). Four movements, each played
   only when the press is reached going forward (`useForward`, phase.ts):
   join (from the door, or from `origin`), bounce (`visitor` mode `bounce`,
   greyed, `already in`, its twin lights), leave (exit to the door), check
   (`finger`, a magnifier that visits the chips). The name tag sits at the
   bag's bottom-left corner, clear of every chip. Lists and tuples stay
   session 26's `Row` (`rows.tsx`).
4. **`walk.ts`**: several items walking to the bag inside one press (C8, C9),
   two phases each (arrive, then join or bounce).
5. **People are lab faces** (`people.tsx`, `Face`): Teja (26's), Ravi, Anu,
   Kiran, Sneha, Pooja, Vamsi; a small-letter `ravi` wears Ravi's face. No
   beards.
6. **The drawn app** (`Insta.tsx`): feed with the gradient story ring, the
   dark story screen with a drawn plate of Maggi, the white viewer sheet (eye
   and count, one row per person), phones 196 x 404 with a live clock. No
   product name or logo on the drawn screen (course rule, session 14's
   player). The spec's own caption words that name the app are kept (spec
   rule 5). Close Friends green is the app's colour (`STAR_GREEN`).
7. **Cards**: `RecapMatch.tsx` (S-RECAP, path-drawn join lines),
   `StoryHook.tsx` (H1), `SetCards.tsx` (C1 to C7), `Converter.tsx` (E1, the
   list/string/tuple switch), `Tasks.tsx` (T1, T2), `Classify.tsx` (G1),
   `SeenByHook.tsx` (H2), `Changing.tsx` (C8 to C11), `WhoGetsIn.tsx` (G2),
   `SetOps.tsx` (C12), `Exit.tsx` (X1), `Takeaways.tsx` (K1, from 26).
8. **K1's results**: as 26. A press fills the slot's code; a click on the `?`
   fills the result, and the next press fills it too. The sixth needs the
   click. Autoplay is off on K1.
9. **Controls and autoplay**: session 23's `controls.tsx` and `autoplay.ts`;
   ON when slides 3, 4, 8, 10, 11, 20, 23 and 26 open (no vote, no timer;
   renumbered 2026-10-09 when DS2 and DS3 went in).
10. **`Code.tsx` blanks**: the minimum width is now three characters (was
    six), so C2's two bracket slots fit the line. `Ask` and `Note` drop a
    plain sentence's closing full stop and set one sentence per line
    (content rule 36), so a raw spec line can be passed straight in.
11. **Reveal-step map**: each card's `press_count - 1` (agenda static, spine
    0), written from the spec and confirmed against the dev server with
    `.measure.mjs` (a scratch copy of the measurer, `?nav=slide&x=`, MAX 30).
12. **Git is not touched.** The shared checkout carries other sessions' work.

13. **Fix pass, 2026-10-08 (user's list: arrows, chip motion, slides 3, 4, 13,
    18, 19, 20, 23).**
    - Chip motion: one move per chip, ease-out, transform and opacity only.
      `flyFrom` now runs on a node with no transform of its own (it used to
      replace the chip's -50% centring, the "overshoot and snap back") and
      cancels any running flight before measuring (React's development
      double mount measured the chip at the source and wrote a zero flight).
      A joining chip flies straight from its source (cell, line, sheet row,
      door) into its place; a repeat makes one move to the rim and stops grey
      (`already in`), no there-and-back; the C1 drift moves by transform.
      `walk.ts` starts items one after another, each in one move.
    - Arrows (content rule 46, extended): slide 3's join heads are separate
      9px triangles, the line ends with a butt cap at the head's base centre;
      C12's operation arrows the same.
    - Faces: a 150px square crop round the whole head, centred.
    - Slide 4: no background panel behind the phone. Slide 18: the caption
      box has a fixed height (62px). Slide 23: `Panel` center mode, a
      fixed 1064 x 434 block, the right column centred, the door line about
      twice as long (`doorW` 216).
    - Vite served a stale `bag.tsx` during this pass: restart the dev server
      when a change does not show.

14. **Fix pass, 2026-10-09 (user's list: slides 3, 11, 13, 19 to 21, 23).**
    - Slide 3: connectors at 2px, smooth S-curves; each pair bends at its own
      height so the three lines cross at three separate points; heads as before.
    - The dashed door line is drawn only where `lane` is passed (G2, slide 23).
    - A chip outside the bag is anchored by its right edge short of the rim
      (waiting 40px, a repeat 16px); the inner places (`SLOTS`) are pulled in
      from the rim. `.oval-check.mjs` (scratch) checks every press: chips in a
      bag inside the oval with 4px clear, chips outside clear of it. It passes
      on 11, 19, 20, 21 and 23; E1's 250 x 128 bag and H2's 360 x 88 bag still
      have top chips touching the rim (not in the request; left as they are).
    - Slide 23: the right column is top-aligned (the oval stays at one place
      on every press), the output and caption under it ease with a layout
      animation; the intro box is 760px wide so its two sentences sit on two
      lines.

15. **Change spec, 2026-10-09: what a data structure is**
    (`Reference ppt's/27_sets_change_spec_data_structures 1.html`; its JSON
    is `../session_plans/27_sets/change_ds.json`, merged into `spec.ts` by
    `scripts/build-spec-data.mjs`, which also checks C1's old say line before
    replacing it).
    - DS2 (slide 7) and DS3 (slide 9), `figures/DataStructures.tsx`.
      `DataFamily`: four tiles, face down from press 1, one turns per press
      (rotateY, instant on a jump); a drawn phone per tile at 1 : 2.06
      (playlist, ID card, Seen by, Contacts), the mark beside the name.
      `DataGrid`: the shared component for every data structure session,
      columns from `DS_ORDER` up to today's, row heights fixed from the
      longest proof so nothing grows; today's cells dashed, the asked one
      ringed, a filled one keeps its proof beside it.
    - C1: only the speaker notes' press-1 line changed.
    - Minutes are not shown in the view; T1's 6:00 timer was left as it is.
    - Harnesses renumbered: `spec-check` (G1 is slide 18, 31 slides, the
      change file's cards counted), `autoplay-check` (ON set, the pause test
      on slide 8).

16. **Change spec, 2026-10-09: the view fixes** ("27 Sets and 28 Set
    Operations: fixes to the built views",
    `Reference ppt's/27_28_sets_view_fixes_change_spec.html`; its slide
    numbers are this deck's own, its card labels for slides 11 and 14 were
    off by one card). Its data is `../session_plans/27_sets/change_fixes.json`
    (`set` writes a value at a path inside a card), merged by
    `scripts/build-spec-data.mjs` after the DS change file; `spec-check` reads
    press counts from the generated `spec.ts`.
    - **Autoplay opens off on every slide** (item 9 superseded); the switch
      stays. `autoplay-check` tests it by pressing it on E1.
    - **No output on a timer**: C8, C9 and C10 (`Changing.tsx`), C7
      (`SetCards.tsx`), E1's string output, G2's printed line and C12's
      outputs are on screen from the press itself; the chips' walks and the
      finger stay as the movement inside it.
    - **K1** 6 to 7 presses: the seventh fills tile 6 (KeyError: 'Anu', red,
      and its sentence).
    - **C11**: the output sits under the remove column, titled "remove's
      output"; the A / B / C choices dim on press 3.
    - **E1**: no list cell fades, ever; a repeat is tagged "already in" at
      the rim; the walk captions lose "It stays grey in views" (change file).
    - **G1**: rounds 6 and 7's answer lines reworded, and round 6's verdict
      line with the same words; the step badge says `run` on the error
      rounds; a filed case leaves no slot behind, the tray closes up
      (`motion layout`; the round's own case stays unseen through its step
      press, as the flight's source).
    - **T2** step 2: "Teja's notes loop over views."
    - **C5**: `doorW` 220, so the tuple and list chips wait inside the card.
    - **H2**: from press 5 the viewers bag (270 x 160, every chip inside the
      oval) sits beside the code in the right column and the list group goes;
      code at 14px (`H2_CODE_FS`) in a 580px column; the caption box 56.
    - **Slides 11 and 14 (C3, C6)** were the half-empty ones: code 18px,
      output 20px, run lines 20px, bags 240 x 136, the slide in `center`
      mode (`WIDE_LEFT`, `BIG_CODE_FS`, `BIG_OUT_FS`). C4 and C7 unchanged.
    - **DS3**: as 28 (the current row's proof 15px, earlier rows 12px).
    - Reveal map: K1 6. The autoplay set in `autoplay.ts` and
      `autoplay-check` is empty.

## Verification, 2026-10-09 (built file `dist-single/python-session-27-sets.html`, 3.17 MB)

- typecheck clean; every changed card screenshotted at every press on the dev
  server (`.shots2.mjs`, a scratch in the root) and the press count checked by
  the hash leaving the slide.
- `spec-check`, `autoplay-check` (off on every slide, the switch tested on
  E1), `video-safe` CLEAN, `agenda-check`, `feedback-check`, `gesture-check`,
  `ligature-check`, `align-check` 0 of 31, `mixed-align-check` 0 of 31: pass.
- `qa`: only slides 1 and 31 (the Welcome and Thank you baseline, NO LOGO).
- `controls-clear-check` CLEAR at every step of all 31 slides.
- `box-overflow-check`: NO OVERFLOW at every step.
- `overlap-check`: only slide 1's decorative sparkle (baseline).
- Browser: `CHROME_PATH=/usr/bin/brave-browser`.
