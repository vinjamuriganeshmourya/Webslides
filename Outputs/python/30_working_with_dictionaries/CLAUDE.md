<!-- cSpell:ignore NxtWave devPort Teja Ravi Kiran Divya Sai Ooty dhaba kwargs -->
# Working with Dictionaries · session notes

Python course, Programming Foundations session 30. Built on 2026-10-12 from the
pedagogy team's session spec: `Reference ppt's/30_working_with_dictionaries_session_spec.json`
(the data) and `…_spec.html` (the reading page, with 18 thumbnails of the
original deck's kept slides). The plan is at
`../session_plans/30_working_with_dictionaries/plan.md`. The scaffold was
copied from session 28 (which carries the carry-forward standard and the
2026-10-09 view fixes). Course rules and the feedback log are in
`../workflow/skills/python-course/SKILL.md`.

The deck has 27 slides, one per spec card. `devPort` is 5260: run
`npx vite --port 5260 --strictPort --open false`. The deck file is
`src/decks/dictsDeck.tsx` (`activeDeck.ts` points at it).

**Leftovers from the copy, on purpose.** Session 28's figures (`venn.tsx`,
`OpCards`, `Gate`, `Regions`, `Inside`, `Compare`, `PollHook`, `GroupHook`,
`RecapSort`, `DataStructures`, `Insta`) and session 26's (`NoneCards`,
`TupleCards`, `Impostor`, `FillBoxes`, `Pack`, `Unpack`, `Upi`, `PaymentHook`,
`ReceiptHook`, `Membership`, `Recap`), with `setOpsDeck.tsx` and
`tuplesDeck.tsx`, are still in this folder. The live deck imports none of
them; the user asked that nothing be deleted during a build. `rows.tsx` must
stay (`flyFrom`), as must `Phone.tsx`, `people.tsx`, `Cast.tsx` and `cast/`.

## Decisions specific to this deck

1. **One slide per spec card, all 27, in the spec's order**, D1 (Arbitrary
   Function Arguments) as the one divider. Every card with presses carries
   `data-spec` and `data-presses` equal to the spec's `press_count`, except
   K1 (item 9).
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` (`SPEC` and `NOTES`, the say lines, as speaker notes);
   it takes an optional change file beside the plan (`change.json`, the
   shape sessions 27 and 28 used) and merges it when present. 45 programs,
   rounds, X1's four calls and K1's six examples ran on CPython 3.12.3 and
   match. `ids.py` prints a different id on every laptop, which the spec
   says itself; C1 shows the spec's own two equal numbers (`data.id_example`).
3. **Two pictures.** `figures/sheet.tsx` (spec note 5): a dictionary is
   Divya's Google Sheet (`Sheet`, with `board` and `card` looks for Anna's
   canteen and the hostel room card), a variable is a `Tag` with a straight
   arrow DOWN to its sheet (`Board` lays tags over sheets; two tags on one
   sheet sit side by side above it; a re-pointed tag slides to its new
   sheet). Tags sit above, not beside, so a far tag's arrow never crosses the
   near sheet (rule 42). `figures/boxes.tsx` (spec note 6): parameters as
   boxes (`ParamBox`: named, tuple `()`, dictionary `{}` that grows into a
   mini sheet), the call as chips (`CallStrip`), and each value travels from
   its chip into its box (`flyFrom`, session 26's).
4. **One world**: CR Divya's Ooty trip money sheet (Teja 1500, Ravi 800,
   Kiran 0), the dhaba bill on the way, hostel room cards. The chat app keeps
   session 28's `CHAT` palette, the sheet app its own green and grid, both
   inside the screens only (rule 37); no product name, no logo (rule 12). Sai
   is new in `people.tsx`.
5. **Cards**: `RecapBug.tsx` (S-RECAP), `SheetHook.tsx` (H1: the chat phone,
   Divya's laptop from session 20's `Laptop.tsx`, Ravi's and Kiran's phones
   at 150 x 309, `SheetScreen` with the rows its screen has room for, the
   overflow menu as a bottom sheet over the empty rows), `DictCards.tsx` (C1
   to C3, and `TwoCols`, `DeckLine`, `usePick` shared by the concept cards),
   `Loop.tsx` (E1, the dot in a lane left of the sheet), `Tasks.tsx` (T1 with
   the sheet picture, T2), `ChangeOrMove.tsx` (G1, and `GameFrame`,
   `WhyLines`, `RoundHead`, `schedule` shared with G2), `DhabaHook.tsx` (H2:
   the night road, the bus, the dhaba, lab faces at the table, the fold of
   a, b, c into `*friends`), `ArgCards.tsx` (C4 to C8), `Lands.tsx` (G2),
   `Bins.tsx` (C9), `Exit.tsx` (X1), `Takeaways.tsx` (K1).
6. **Layout**: the body box is y 221 to about 652 (Next at 661). Every
   concept card is two groups side by side: the program with its output on
   the left (560 wide; C1 590, C3 600, E1 610 for their longest lines), the
   caption, picture and vote on the right. Every group ends at least 20px
   above Next on every press (`.gap.mjs`, a scratch probe in the root).
7. **G2's output is one labelled row** (`GameFrame compactOut`), not the
   panel: round 2's five-line program over a panel left no room for the
   verdict's why lines. The why cards stack the option over its line.
8. **Autoplay opens off on every slide** and **no output fills on a timer**
   (sessions 27 and 28's view fixes, kept): every output is on screen from
   its press; chips flying, the dot moving, the search word walking and the
   fold are movement inside the press (`useStepPhase`).
9. **K1 is seven presses**, not the spec's six (28's view fixes, kept): the
   seventh fills example 6's result and sentence, so nothing is left at `?`
   once Next goes grey. `spec-check` expects 7 for K1. Its code is drawn in
   two short columns of two lines (a four-line example in a 64px row), one
   block per line so no text node spans two lines (align-check).
10. **`withOps`** (common.tsx) also chips a `=`, `*` or `**` that STARTS a
    sentence (K1's headings, C5's caption); mid-sentence they stay text.
11. **`Group`'s rim is an inset ring** (common.tsx): overlap-check's rule 43
    reads an outside ring on a lit group with one child as a glow wrapper
    around something smaller. Same look, no finding.
12. **`StepCaption` takes pre-split `lines`** (trace.tsx): H1's press 6
    keeps its two questions on one line, so the caption holds three lines.
13. **Reveal-step map**: measured with `.rs.mjs` against
    `http://localhost:5260/?nav=slide&x=`; 26 and 27 appended by hand. Every
    card count is `press_count - 1` (K1 6).
14. **Git is not touched.** The shared checkout carries other sessions' work;
    session 29 was being built by another session at the same time (port
    5259).

15. **Fixed box heights, 2026-10-12 (user's task "box-height fix", slides 4,
    9, 10, 12, 18, 21).** On those cards a group's height no longer follows
    its content: each affected group carries an explicit `height`, chosen for
    the card's tallest press, and the caption box inside it sits at its
    tallest line count, so nothing under it moves either. Slide 4: both
    side-by-side groups 417 (was 381 to 417, the caption's 1 to 3 lines; the
    right group was 357). Slide 9: both 348 (was 330 or 348, the caption's
    second line on press 4). Slide 10: both 401 (was 373 to 401, the walk
    captions' 1 to 3 lines). Slide 12: the bottom group 202 (was 174 to 202,
    the caption and the why lines' count; the top group was already
    constant). Slide 18: both 371 (was 355 to 371, the dictionary box growing
    with its rows and the call strip changing). Slide 21: the top group 213
    with the code panel at five rows on every round (was 209 or 213 with the
    program's line count), the bottom group 194 (was 174 or 194, the caption
    and the strip wrapping in round 3). `TwoCols height`, `GameFrame topH /
    bottomH / captionH`. Measured with `.boxes.mjs` (a scratch probe in the
    root: every group's height per press and the child that changed).
16. **Autoplay opens ON on slides 4, 7, 8, 9, 10, 14, 19 and 22** (user,
    2026-10-12), and starts again on every entry, forward or back:
    `autoplayDefault` returns true for a listed slide on every mount, so a
    switch pressed on it holds only while it stays on screen. The player
    lands a whole-slide move (a plain arrow back, a Ctrl+arrow, a swipe)
    fully revealed by design; on a listed slide `StepControls` reads that
    jump (first step to last, right after the mount) and winds the card back
    to its first step through the deck's own `prev()`, then the run starts
    as on a fresh entry. (The player's Replay was tried first and left a
    stale copy of the card on screen inside a cut landing.) A press within
    that first second still pauses, because it moves one step, not all. The
    player unmounts a departed slide, so its timers are cleared on leaving;
    `autoplay-check` tests leaving slide 4 for 5 and coming back, and every
    entry path was probed (arrow, Ctrl+arrow, trackpad, touch, direct open).
    Item 8's "off on every slide" is superseded for these eight; on 7 and 9
    the vote's answer therefore reveals itself 2.5 s after the question.
    **Every harness and probe must open the deck with `noauto` or `all`**:
    `overlap-check` and `.rs.mjs` carry it now; `controls-clear` and
    `box-overflow` press the switch off themselves.

## Verification, 2026-10-12 (built file `dist-single/python-session-30-working-with-dictionaries.html`, 3.17 MB)

- typecheck clean; every card screenshotted at every press on the dev server
  (`.shots2.mjs`: port, "slide:presses,...", outdir) and the press count
  checked by the hash leaving the slide; every frame read by eye.
- `spec-check`, `autoplay-check` (on for the eight listed slides and off
  elsewhere, re-entry on slide 4, the switch tested on E1), `video-safe` CLEAN, `agenda-check`, `feedback-check`, `gesture-check`,
  `ligature-check`, `align-check` 0 of 25, `mixed-align-check` 0 of 25: pass.
- `qa`: only slide 1 (the Welcome baseline, NO LOGO); the 16px type-floor
  list is informational, as before.
- `controls-clear-check` CLEAR at every step of all 25 content slides.
- `box-overflow-check`: only the baseline, slide 15's divider "02".
- `overlap-check`: only slide 1's decorative sparkle (baseline).
- The harnesses stop at slide 25: the feedback frame never goes network-idle.
- Browser: `CHROME_PATH=/usr/bin/brave-browser`.
