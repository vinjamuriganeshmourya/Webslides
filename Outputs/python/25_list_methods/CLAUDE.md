<!-- cSpell:ignore NxtWave devPort Teja Chuttamalle -->
# List Methods · session notes

Python course, Programming Foundations session 25. Built 2026-10-08 from the
pedagogy team's session spec, `Reference ppt's/25_list_methods_session_spec.json`
(the data) and `…_spec.html` (the reading page, 17 thumbnails of the original
deck's slides 15 to 32). Plan: `../session_plans/25_list_methods/plan.md`.
Scaffold copied from session 24. Course rules: `../workflow/skills/python-course/SKILL.md`.

27 slides, one per spec card. `devPort` 5255: run
`npx vite --port 5255 --strictPort --open false`. Deck file
`src/decks/listMethodsDeck.tsx`.

## Decisions specific to this deck

1. **One slide per spec card, all 27, in order.** `data-spec` and
   `data-presses` on every built card; `spec-check.mjs` (adapted) asserts it.
2. **The spec is read, never retyped**: `scripts/build-spec-data.mjs` writes
   `src/decks/figures/spec.ts`. 41 programs and rounds run on CPython 3.12.3
   and match.
3. **One picture for lists**, `figures/cells.tsx` (`CellRow`, `cellsOf`,
   `Shape`). Cells are absolutely placed and keyed by identity, so a cell
   slides to its new place and its index changes with it; a removed cell
   fades where it stands, then the rest close up. E1 keys the two Peelings
   separately so the second one slides while the first vanishes.
4. **One world**, `figures/Music.tsx`: the music app (dark, red accent, Up
   next, three-dot sheet). No product name. The closed sheet is unmounted,
   not parked off-screen (align-check measured the parked one).
5. **Cards**: `Hooks.tsx` (S-RECAP, H1, C1, H2), `Methods.tsx` (C2 to C10,
   E1), `Tasks.tsx` (T1, T2), `Games.tsx` (G1 DJ's desk, G2 Does Ram see
   it?), `Close.tsx` (X1, K1).
6. **One size per role** (the S23/S24 audit found 9.6 to 20px code card to
   card): `CODE_FS` 15 and `OUT_FS` 16 in `Methods.tsx`, used by every
   content card; 15 is the size at which every spec line fits its column
   unclipped. The takeaways grid is the one exception (13px code, 11px
   mini cells), as in every earlier deck's K1.
7. **No movable content.** A drag-to-move feature was built on 2026-10-08
   and removed the same day on the user's word. It is archived at
   `../workflow/archive/movable-content/`. Do not add it back unless the
   user asks.
8. **Autoplay** opens ON on slides 4, 7, 8, 9, 17, 19, 20, 21 and 25 (user,
   2026-10-08); `autoplay-check.mjs` adapted.
9. **K1 has six presses** (spec): press n opens example n and fills n − 1's
   result; the last result fills on a tap of its box, or End.
10. **Agenda static** (rule 44); **quiz** session 21's `ClassroomQuiz`;
    **feedback** the standard slide (rule 41, its Google Form is the only
    network host; harnesses on the dev server run with a count of 26).
11. **Reveal-step map** measured with a patched scratch copy of
    `build-reveal-steps.mjs` (MAX_PRESSES 30, `load`, `#/n-slug`) at
    `"http://localhost:5255/?nav=slide&x=" 26`; slide 27's 0 appended. Every
    count is `press_count - 1`.
12. **Git is not touched** (shared checkout, as 23 and 24).

13. **Fix pass, 2026-10-08 (user's G1 to G5 and slide list).**
    - Characters are the character lab's (G4): `figures/cast/` and
      `figures/Cast.tsx` copied from PF 22. Teja the DJ (slide 12) wears
      `HEADPHONES` (head-local, cups bob 2.5px); Ram's chat avatar (slide 4)
      is a lab face. No beards. `Idling` cuts the svg to its crop so the
      harnesses measure what the room sees.
    - Slide 4: phone 209 x 430 (1 : 2.06), `LiveClock` in the status bar,
      covers with a sound wave (`Cover wave="live" | "calm"`). Slide 17's
      phone 210 x 432.
    - Slide 7: the dot is marked by a rectangle that path-draws (`DotMark`).
    - Slide 16: session 14's quiz motion (card swings from -9 to -3 degrees,
      steps slide in, mascot grows in, the timer breathes and sweeps); the
      slide sits 40px higher, the card at 0.80 and the mascot at 150px.
    - Slide 23: the Fibonacci arrows redrawn (`SumArrow`: feed lines, a sum
      pill, one curve that path-draws into the term, a filled head).
    - G5: `Option` centres its letter and text on one line with equal
      padding. G1: `Fresh` eases in any swapped program or vote, `Appear`
      any swapped layout (C8, C10, T2); the cursor, the empty brackets and
      H2's scan mark fade in.

14. **Session 24's review improvements applied, 2026-10-08.** `Group` and
    `Focus` (common.tsx, from 24): each cluster sits in one group (concept
    cards: both columns; G1, G2, T1, T2 groups light `active` for the part in
    use); Focus rings the asked program on slides 3, 21 and 24. 24's `Code.tsx`
    draws the blanks (T2 line 4, X1's `___`; threshold three underscores here)
    and fades a changed line; 24's `StepCaption` cross-fades, `Vote` takes
    `nowrap`/`template` (plus this deck's `Fresh`). Layout changes to keep
    every card clear of the controls: concept columns 598/530 with cells at
    13px, X1 restacked (options in four columns, timer in the question box),
    T1's rule beside its output, C8's list beside its question, E1's shape
    mounts on press 7, G1's group at 6px padding.

## Verification, 2026-10-08

typecheck clean; `video-safe` CLEAN; `qa` only slide 1 (baseline);
`align-check` and `mixed-align-check` 0 slides; `controls-clear-check`
CLEAR at every step; `overlap-check` only slide 1's sparkle (baseline);
`spec-check`, `feedback-check`, `gesture-check`, `agenda-check`,
`ligature-check`, `autoplay-check` and `box-overflow-check` pass (last run after item 14). Not run: `preview.mjs` contact sheet (slides were
screenshotted step by step instead), `nav-stress-check`, Firefox, WebKit.
