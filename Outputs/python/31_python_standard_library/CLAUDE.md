<!-- cSpell:ignore NxtWave devPort Teja Ravi Kiran Divya Ludo Zomato functools randint biryani samosa noauto -->
# Python Standard Library · session notes

Python course, Programming Foundations session 31. Built on 2026-10-13 from the
pedagogy team's session spec: `Reference ppt's/31_python_standard_library_session_spec.json`
(the data) and `…_spec.html` (the reading page, with 30 thumbnails of the
original deck's kept slides). The plan is at
`../session_plans/31_python_standard_library/plan.md`. The scaffold was
copied from session 30 (the carry-forward standard, the 2026-10-09 view fixes,
the 2026-10-12 fixed box heights and re-entry autoplay), with session 29's
auto-play menu option merged in (the standing rule of SLIDE_WORKFLOW Stage 5).
Course rules and the feedback log are in
`../workflow/skills/python-course/SKILL.md`.

The deck has 33 slides, one per spec card. `devPort` is 5262: run
`npx vite --port 5262 --strictPort --open false`. The deck file is
`src/decks/stdlibDeck.tsx` (`activeDeck.ts` points at it).

**Leftovers from the copy, on purpose.** Session 30's figures (`sheet.tsx`,
`boxes.tsx`, `SheetHook`, `DictCards`, `Loop`, `ChangeOrMove`, `DhabaHook`,
`ArgCards`, `Lands`, `Bins`), session 28's and 26's (`venn.tsx`, `OpCards`,
`Gate`, `Regions`, `Inside`, `Compare`, `PollHook`, `GroupHook`,
`DataStructures`, `Insta`, `NoneCards`, `TupleCards`, `Impostor`, `FillBoxes`,
`Pack`, `Unpack`, `Upi`, `PaymentHook`, `ReceiptHook`, `Membership`, `Recap`),
with `dictsDeck.tsx`, `setOpsDeck.tsx` and `tuplesDeck.tsx`, are still in this
folder. The live deck imports none of them; the user asked that nothing be
deleted during a build. `rows.tsx` must stay (`flyFrom`, the recap's chips),
as must `Phone.tsx`, `people.tsx`, `Cast.tsx` and `cast/`. `RecapSort.tsx`,
`Tasks.tsx`, `Exit.tsx` and `Takeaways.tsx` were rewritten for this deck and
keep the export names the leftover decks import, so everything still compiles.

## Decisions specific to this deck

1. **One slide per spec card, all 33, in the spec's order.** No kit divider:
   the spec's three marker cards (C4, C9, C12) are `figures/Breakers.tsx`, a
   night stage with the title arriving the way the card says (keys flying in,
   a dice rolling, three tiles), each wrapped in its `data-spec` marker. Every
   other card with presses carries `data-spec` and `data-presses`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` (`SPEC` and `NOTES`, the say lines, as speaker notes);
   it merges `../session_plans/31_python_standard_library/change.json` when
   that exists (none yet). 88 programs, tries, rounds, options and examples
   ran on CPython 3.12.3 and match the spec, except that 3.12.3 appends
   `Did you forget to import 'math'?` to the seven NameError lines for a
   missing `math`; the deck shows the spec's line.
3. **Press counts (plan decision 8).** C10 is eight presses (spec five), C11
   five (spec three), K1 seven (spec six): every output waits for its own
   press (the 2026-10-09 view fixes carried). `spec-check` carries these three
   overrides; the reveal-step map is each card's count minus one.
4. **The import picture** (spec note 5): `Code.tsx` takes `marks`, named
   tokens underlined per line in the brand colour (`a`), the teal (`b`), the
   amber (`c`) or the danger tone (`bad`, which also paints the token red);
   the underline draws itself in. `figures/imports.tsx`: `HowTable` (the
   growing table, rows already added shown from a card's first press),
   `MathBox` (the module box; a tool lifts out, with a new label for `as`;
   the lid opens for the dot), `NameTags` (which name reaches what: the tags
   slide between owners with framer `layout`; a name that reaches nothing is
   red with `not there`).
5. **The calculator** (`figures/Calculator.tsx`): a 180 x 371 phone (1 : 2.06)
   on a square stage its own height wide, turned a quarter turn about its
   centre on its press (700ms); the sideways screen is laid out at 355 x 164
   and turned back upright inside the turned frame; the two layouts
   cross-fade. The app's own colours (near-black keypad, grey function row,
   accent operators) stay inside the phone. `TwoCalcs` draws the two small
   ones with CSS `zoom`, never a transform. `Notebook` is the homework page.
6. **The food app** (`figures/FoodHook.tsx`): a 156 x 321 phone with the caption
   in a fixed 70px box under it (three lines step the type down to 12px), so
   the right column (783px) holds the eleven-line `buttons.py` at `CODE_FS`
   15 in `dense` rows (`Code.tsx` `dense`: line height 1.4, 12px padding) with
   its two output rows. The places disappear with `AnimatePresence` (never
   greyed); the big table beside the phone drops the same rows. The cart
   lines on the phone take two lines each (one line collided at 8px).
7. **The Ludo board** (`figures/RandomCards.tsx`, `LudoPhone`): four coloured
   homes with lab faces, the cross of squares, the dice under the board
   rolling in with a full turn on each run; `Dice` is drawn in `Breakers.tsx`
   and shared.
8. **Games.** `figures/game.tsx` carries `GameFrame`, `OutRow`, `WhyLines`
   (with `dense`), `RoundHead` and `schedule` from session 30's
   `ChangeOrMove.tsx`, so neither game imports a leftover. G1
   (`FixImport.tsx`) lays itself out without `GameFrame`: the top group 200
   (the code with the fill-in blank, the round, the target, the 2 x 2 vote),
   the bottom 207 (the tries list 660 wide so the longest error line fits,
   the caption beside it at a fixed 121, the why lines under both in three
   columns). G2 (`InsideBuiltin.tsx`): top 228 (seven dense rows for round
   3), bottom 182 (48px payment tiles under a 16px pointer lane, the keeping
   box, a 34px caption row with the output chip, three dense why lines).
9. **E1** (`WhoCalls.tsx`): the arrow lives in a 60px lane left of the code
   panel; the code panel's header is 46px, so a row's centre is
   `46 + 16 + (line - 1) * 23 + 11.5` (the first cut used 37 and sat the
   arrow half a row high).
10. **Layout**: the body box is y 221 to 652 (Next at 661). Concept cards are
    `TwoCols` (`figures/cards.tsx`) at a fixed 400 (H2 413, H1 391,
    S-RECAP 222 + 176), ending at least 20px above Next on every press.
11. **Autoplay**: this deck's own list in `figures/autoplay.ts` (the hooks,
    the explainer, the concept cards without a vote: 4, 7, 8, 11, 12, 14, 21,
    23, 24, 25, 26, 27), under the slide menu's deck-wide setting (On when
    the deck first loads, kept in localStorage per deck path) and restarting
    on every re-entry. Every harness and probe opens the deck with `noauto`
    or `all`.
12. **`sentences()`** (pieces.tsx) no longer splits after an ellipsis: K1's
    `from ... import brings in one name.` is one line.
13. **Reveal-step map**: measured with `.rs.mjs` (MAX_PRESSES 40) against
    `http://localhost:5262/?nav=slide&noauto&x=`; 32 and 33 appended by hand.
14. **Harnesses edited for this deck**: `spec-check.mjs` (file name, 33
    slides, the three overrides, G1 at 16, the recap's why line),
    `autoplay-check.mjs` (31 slides, the list, the re-entry on slide 4, the
    switch on G1, the menu option on slides 7, 8, 9). `.keys.mjs` (new scratch)
    prints every console error with its slide: a duplicate React key hides
    behind a truncated console line otherwise.
15. **Git is not touched.** The shared checkout carries other sessions' work.

16. **Corrections, 2026-10-13 (the user's list after the first build).**
    - **No Dynamic Island on any mockup**: the calculator's island spans are
      gone (`Calculator.tsx`), the Ludo and food-app phones pass `island={null}`.
    - **Autoplay opens On on 3, 13 and 31 as well** (the recap sort, C7, K1);
      `autoplay-check` lists them, and `spec-check` opens slide 3 with `noauto`.
    - **The sideways calculator screen fills itself** (slides 4, 7, 9 and the
      small one on 4): seven equal columns, three scientific on the left and
      four basic on the right, five rows of one height in both blocks, one
      8px gap between the blocks, equal margins at both edges (`Landscape` in
      `Calculator.tsx`). The spec's twelve scientific keys plus three the real
      app has (`x³`, `10ˣ`, `1/x`) make the three columns by five rows; the
      three the spec lights still glow. The phone frame and the upright
      screen are unchanged.
    - **The quiz slide is the reference deck's** (`new-template-slide-generation`,
      its slide 19): `figures/QuizRef.tsx`, the `Your Turn` pill, the 88px
      `Quiz Time!`, the gradient rule, the four-layer brain art with the bulb
      glow, on this deck's light stage with its fonts and ink (the user's
      constraint: fonts, colours and spacing consistent with the deck). The
      user's list named it slide 13; the quiz is slide 17 here and 13 is C7.
      `ClassroomQuiz.tsx` stays in the folder, unused.

## Verification, 2026-10-13 (built file `dist-single/python-session-31-python-standard-library.html`, 4.27 MB after the corrections; the quiz art is inlined now)

Run in full on the first build and again on the corrected one; every result below held both times.

- typecheck clean; 88 programs, tries, rounds, options and examples run on
  CPython 3.12.3 and match the spec (item 2 for the NameError suffix); the
  reveal-step map measured on the dev server equals every card's press count
  minus one (C10 7, C11 4, K1 6).
- Every card screenshotted at every press on the dev server (`.shots2.mjs`)
  and the press count checked by the hash leaving the slide; every frame read
  by eye; `.keys.mjs` reports no console error on any slide at any press.
- `spec-check` (the three overrides), `autoplay-check` (the list with 3, 13
  and 31, the re-entry on slide 4, the switch on G1, the menu option on 7, 8
  and 9, `?all`),
  `feedback-check` (an exact copy of session 18's), `gesture-check`,
  `agenda-check`, `ligature-check` (25, 26, 29, 31), `video-safe` CLEAN,
  `align-check` 0 of 31, `mixed-align-check` 0 of 31: pass.
- `qa`: only slide 1 (the Welcome baseline, NO LOGO); the 16px type-floor list
  is informational, as before.
- `controls-clear-check` CLEAR at every step of all 31 slides; every group
  ends at least 20px above Next (`.gap.mjs`: 20px on G2, 23 on G1, 27 on H2,
  40 elsewhere).
- `box-overflow-check` NO OVERFLOW, with the group rule active (`Group`
  carries `data-group`).
- `overlap-check`: only slide 1's decorative sparkle (the baseline).
- The contact sheet is `workflow/preview/index.html`. The harnesses stop at
  slide 31: the feedback frame never goes network-idle.
- Not run: `nav-stress-check`, WebKit. Browser: `CHROME_PATH=/usr/bin/brave-browser`.
