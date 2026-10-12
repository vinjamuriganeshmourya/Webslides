<!-- cSpell:ignore NxtWave devPort Teja Ravi Kiran Anna Anu Maggi maggi samosa dosa -->
# Dictionaries · session notes

Python course, Programming Foundations session 29. Built on 2026-10-12 from the
pedagogy team's session spec: `Reference ppt's/29_dictionaries_session_spec.json`
(the data) and `…_spec.html` (the reading page, with 19 thumbnails of the
original deck's kept slides). The plan is at
`../session_plans/29_dictionaries/plan.md`. The scaffold was copied from
session 27 (which carries the 2b standard, the DS cards, the lab faces and the
2026-10-09 view fixes). Course rules and the feedback log are in
`../workflow/skills/python-course/SKILL.md`.

The deck has 36 slides, one per spec card. `devPort` is 5259: run
`npx vite --port 5259 --strictPort --open false`. The deck file is
`src/decks/dictDeck.tsx` (`activeDeck.ts` points at it).

**Leftovers from the copy, on purpose.** Session 27's set figures
(`bag.tsx`, `walk.ts`, `SetCards`, `Changing`, `Classify`, `Converter`,
`RecapMatch`, `SeenByHook`, `SetOps`, `StoryHook`, `WhoGetsIn`, `Insta.tsx`)
and `src/decks/setsDeck.tsx` are still in this folder. The live deck imports
none of them (`DataStructures.tsx` imports `Insta.tsx` for its palette); the
user asked that nothing be deleted during a build. `Exit.tsx` exports its
component under 27's old name too, so the leftover deck file still compiles.

## Decisions specific to this deck

1. **One slide per spec card, all 36, in the spec's order.** D1, D2 and D3
   are `SectionBreakerSlide` 01, 02, 03, each wrapped in a `data-spec`
   marker. Every card with presses carries `data-spec` and `data-presses`
   equal to the spec's `press_count`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` (`SPEC` and `NOTES`, the say lines, as speaker notes).
   It merges `change_ds.json` and `change_fixes.json` beside the plan when
   they exist, the way 27 and 28 did; this spec already holds DS2 and DS3,
   so neither exists yet. 47 programs, 20 proofs, 7 rounds, X1's 4 options
   and C14's 6 examples ran on CPython 3.12.3 and match.
3. **One picture** (spec note 5), `figures/board.tsx`: Anna's board, a
   framed white board with a marker tray; one row per key, the name tag
   (the deck's `key_1`, dark blue) on the left, an arrow, the price card
   (the deck's `value_1`) on the right; rows in the order they were added;
   never a number. `Board` draws: a sticker (a new card stuck over the old
   one, amber rim, the old one gone), a new row at the bottom, a wipe (the
   row's clip closes left to right and the rows under it close up), a lift
   (a copy of the card rises off its row; the row keeps its price), a search
   (`Search`: the word walks the tag column in a lane to the left of the
   tags, stops green on its tag, or past the last tag reports `no tag`, red
   with an alarm pulse for `[ ]` and `del`, grey and quiet for `get`),
   `labels` (key and value over the columns), `boxed` (a path-drawn item
   box), `dimCards`, and `marker` (the hook's handwriting, which cross-fades
   into tags and cards when it turns off). `NoteCard` is Anna's small
   card and notebook page.
4. **One world** (spec note 2): the college canteen. Anna is a new lab
   config (`people.tsx`, `ANNA`) with an apron, a body prop `Cast.tsx` now
   takes as `apron` on `Posed` and `Idling`; Teja is session 26's; Ravi,
   Kiran and Anu are `Face`s.
5. **The frame** (`figures/frame.tsx`, `BoardCard`): the program, its
   question and vote in one group on the left (730px, so the 71-character
   full menu line fits at CODE_FS 15), the output and the deck's sentence
   under it; Anna's board in its own group on the right with the step
   caption under it. Both columns are 431px tall on every press (the body
   box is y 221 to 652, Next at 661). `WhyLines`, `RoundHead`, `Intro` and
   `schedule` are session 28's game pieces, shared by both games.
6. **Cards**: `RecapTiles.tsx` (S-RECAP, three tiles that turn),
   `CanteenHook.tsx` (H1, with `TwoLists`: the two lists in step),
   `DataStructures.tsx` (DS2, DS3: 27's, with the Seen by names made local,
   the four-column widths and row heights from today's proofs only),
   `DictCards.tsx` (C1 to C4), `Lookup.tsx` (C5 to C7), `Ops.tsx` (C8, C9),
   `Bill.tsx` (E1), `Tasks.tsx` (T1, T2), `LookItUp.tsx` (G1),
   `CheapHook.tsx` (H2), `Views.tsx` (C10 to C12), `BeAnna.tsx` (G2),
   `Convert.tsx` (C13, C14), `Exit.tsx` (X1), `Takeaways.tsx` (K1, 27's
   tiles).
7. **Movement inside one press** runs through `useStepPhase` and plays only
   going forward: H1's lighting and the puff slide; C2's tokens flying from
   the board into the line (`flyFrom`); C4's board building; C5, C6, C7,
   C9 and G1's finger walks; E1's price flying into the total; C10's
   strips peeling off; C11's row splitting; C13's pairs snapping on; H2's
   bun joining. Every output and caption is on screen from its press.
8. **G1** (`LookItUp.tsx`, 22 presses) runs one program line per press on
   the board: added, replaced (the sticker stays for the round), removed,
   found (lit and lifted), None (quiet miss), KeyError (alarm, line red).
   **G2** (`BeAnna.tsx`, 42 presses): the row being read lights, the line
   lights, and Anna (`Posed`, keyed per step) plays the lab's `clap`,
   `wave`, `point`, `pointAtScreen` or `chinThink`; on "No more rows" she
   stands still.
9. **Votes**: clickable, keys 1 to 4, Next never gated; `Vote` now takes
   `spans` (C8's 46-character option A takes both columns at 14px);
   `Option` takes a `style`. Confetti when the marked pick is right.
10. **Controls and autoplay**: session 23's `controls.tsx` and `autoplay.ts`;
    Autoplay opens **off on every slide** (the 2026-10-09 view fixes carried;
    the set in `autoplay.ts` and `autoplay-check` is empty).
11. **Type sizes**: CODE_FS 15 and OUT_FS 16 everywhere, except T2's
    terminal at 15, so its five-line step-2 output fits beside the
    worksheet (the plan's layout note), and C10's pair chips at 12.
12. **Idling characters hold still on harness URLs** (`Cast.tsx`, `STILL`):
    an idling character redraws every frame, which keeps Chromium's
    `document.fonts.status` at "loading" and makes every playwright
    screenshot wait for fonts for ever. On `?all` (the harnesses) and
    `?noauto` (the shot scripts) the character shows one frame of its rest
    pose; the instructor's deck is untouched.
13. **Reveal-step map**: each card's `press_count - 1` (agenda static, spine
    0), confirmed against the dev server with `.measure.mjs` (MAX 50 for
    G2's 41).
14. **Harnesses edited for this deck**: `spec-check.mjs` (file name, 36
    slides, G1 at 22, the recap's why line), `autoplay-check.mjs` (34
    slides, the switch tested on E1, slide 20), `.shots2.mjs` (a screenshot
    retry). The rest run unchanged.
15. **Git is not touched.** The shared checkout carries other sessions' work.

16. **Fix pass, 2026-10-12 (the pedagogy team's list: slides 3, 4, 10, 15
    only; nothing else touched).**
    - **Slide 3** (`RecapTiles.tsx`): the flip read as instant in the live
      view. The tile hid its back and showed its face on a fixed 0.38s
      delay, but on the house ease the turn is edge-on by 0.1s, so the room
      saw a blink of the back, a blank, and the face popping in at 7
      degrees. Now both sides stay on the page through the turn
      (backface-visibility culls the one facing away), the side that turned
      away is hidden only once the turn ends, and the turn is 0.7s on a
      symmetric ease (`TURN`, `TURN_EASE`), edge-on at 0.35s. Measured with
      `.flip.mjs` (a scratch in the root) on the dev server and the built
      file: the rotation is on screen from 180 to 0 over the whole 0.7s.
    - **Slide 4** (`CanteenHook.tsx`): the scene above the caption was
      `flex-1`, so a three-line caption (press 4) squeezed it and the board
      stood up over the group's rim. The scene is now a fixed 317px and the
      caption box a fixed 86px (`SCENE_H`, `CAP_H`: three lines at 16px),
      the board's title row is 24px (`board.tsx`, the hook is the only
      caller) and its clearance over the counter 4px, so the 301px board
      fits the scene exactly on every press. `StepCaption` takes `h` (a
      fixed height; type steps down if a caption would run past it,
      `CapText`); every other caption still passes `minH`.
    - **Slide 10** (`DictCards.tsx`): the pointer line's box was 42 / 50 /
      36 and left the group under it 273px, 13 short of menu.py and its
      two-line output. It is 38 / 46 / 30 (`LINE_PT`, `LINE_H`,
      `LINE_PB`; the Item bracket's top follows) and the column gap 8, so
      the output panel ends 3px inside the group's padding.
    - **Slide 15** (`Lookup.tsx`): Kiran's bubble sat beside the board,
      where the column has 14px spare, and ran off the slide's right edge.
      It is under the board now, centred on it, inside the group (2px
      spare under the 44px face).
    - Checked at 1280 x 720 at every press (`.shots2.mjs`) and at phone
      portrait and landscape (`.mobile.mjs`, 390 x 844 and 844 x 390: the
      stage letterboxes, nothing clips); the whole gate re-run on the
      rebuilt file (the verification section below).

17. **Auto-play changes, 2026-10-12 (the pedagogy team's list, and the
    user's clarification that the round ▶ beside Next stays).**
    - **The listed slides open with Autoplay On**: 3, 4, 7, 8, 9, 10, 11, 12,
      19, 20, 27, 28, 30, 31, 34 (`AUTOPLAY_ON_BY_DEFAULT`, `autoplay.ts`);
      every other slide waits for Next. The list is this deck's own; the next
      deck decides its own (SLIDE_WORKFLOW.md, Stage 5).
    - **The slide menu carries the Auto-play On/Off option**: the "Jump to a
      slide" overlay (the grid button, `G`) opens with an `Auto-play` block
      above the slide list, two cards drawn like the slide cards (`ON` /
      `OFF`, the chosen one ringed and tagged `now`), sticky so it is in view
      however far the list has scrolled to the cursor; on a phone held upright
      the cards drop their second line. `src/deck/SlidePicker.tsx` (a kit file,
      session-local edit, kit PR pending) and the new `src/deck/autoplayPref.ts`
      (the setting: On when the deck first loads, kept in localStorage under
      the deck's own path so a reload keeps it and no other deck on the same
      `file://` origin sees it). With the menu closed nothing new shows on a
      slide.
    - **Immediate**: `StepControls` follows the setting (`useAutoplayPref`): On
      starts the listed slide on screen from its current step, Off pauses it
      (`ensureStepMode`); an unlisted slide is step-wise either way. Switching
      the setting clears the per-slide presses remembered before it.
    - **Slide 32 (T2)**: the worksheet rows grew when their input chips
      appeared and pushed the terminal 8px past its group. The worksheet group
      is a fixed 222px (its tallest state, `T2_TOP`; rows `dense`, pad 8,
      gaps 6 and 4) and the terminal group the rest (`T2_BOTTOM`, 199), with
      the terminal held to it by `OutPanel maxH` (more lines than fit step the
      rows and type down; never a clip). `box-overflow-check` now also reports
      a `Group` (`data-group`) whose content runs past its own box, the case
      the text rules could not see.
    - `autoplay-check.mjs` rewritten: the defaults per slide, a listed slide
      plays by itself and an unlisted one holds, the per-slide switch on T1,
      the menu option (immediate, kept over a reload, Off holds a listed
      slide, On plays again), `?all` never plays.
    - Recorded as a standing rule in `slide-kit/workflow/SLIDE_WORKFLOW.md`
      (Stage 5) with a row in `RULES.md`; no skill file was changed.

## Verification, 2026-10-12 (built file `dist-single/python-session-29-dictionaries.html`, 3.18 MB)

- typecheck clean; 86 programs, proofs, rounds and options run on CPython
  3.12.3 and match; the reveal-step map measured on the dev server equals
  the spec's `press_count - 1` on every card.
- `spec-check`, `autoplay-check` (off on every slide, the switch tested on
  E1), `feedback-check` (an exact copy of session 18's), `gesture-check`,
  `agenda-check`, `ligature-check`, `video-safe` CLEAN, `align-check` 0 of
  36, `mixed-align-check` 0 of 36: pass.
- `qa`: only slides 1 and 36 (the Welcome and Thank you baseline, NO LOGO);
  the 16px type-floor list is informational, as before.
- `controls-clear-check` CLEAR at every step of all 36 slides.
- `box-overflow-check`: only the kit's three section breakers (13, 17, 25)
  clipping their decorative numbers, the baseline sessions 26 to 28 carry.
- `overlap-check` at its 700ms sample: slide 1's decorative sparkle
  (baseline) and E1's price copy caught in flight on its way to the total
  box, the movement the spec asks for (the same class as 28's chips in
  flight).
- Every card screenshotted at every press on the dev server (`.shots2.mjs`)
  and looked at; the contact sheet is `workflow/preview/`.
- Browser: `CHROME_PATH=/usr/bin/brave-browser`.
- Re-run in full after the fix pass (item 16) on the rebuilt file, 3.18 MB:
  every result above unchanged (qa 1 and 36; box-overflow the three dividers;
  overlap-check slide 1's sparkle and E1's price copy in flight; the rest
  pass). Slides 3, 4, 10 and 15 screenshotted at every press at 1280 x 720
  and at 390 x 844 and 844 x 390.
- Re-run in full after the auto-play change set (item 17) on the rebuilt
  file, 3.34 MB: `autoplay-check` (the new one: the list, the menu option,
  the reload, `?all`) passes; `box-overflow-check` with its new group rule
  reports only the three dividers (it first caught Teja 9px past the hook's
  group from press 3 and C10's printed list 7px past its group on press 5;
  both fixed, items 16 and 17); every other result unchanged. The menu was
  screenshotted open at 1280 x 720, 390 x 844 and 844 x 390 (`.menu.mjs`).
