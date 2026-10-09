<!-- cSpell:ignore NxtWave devPort Teja Maggi Samosa -->
# Tuples and Sequences · session notes

Python course, Programming Foundations session 26. Built on 2026-10-08 from the
pedagogy team's session spec: `Reference ppt's/26_tuples_and_sequences_session_spec.json`
(the data) and `…_spec.html` (the reading page, with 34 thumbnails of the
original deck's kept slides). The plan is at
`../session_plans/26_tuples_and_sequences/plan.md`. The scaffold was copied
from session 24 (session 25 was being built by another session at the time and
was not touched). Course rules and the feedback log are in
`../workflow/skills/python-course/SKILL.md`.

The deck has 34 slides, one per spec card. `devPort` is 5256: run
`npx vite --port 5256 --strictPort --open false`. The deck file is
`src/decks/tuplesDeck.tsx`.

## Decisions specific to this deck

1. **One slide per spec card, all 34, in the spec's order**, the four
   dividers (C1, C5, C12, C14) included. Every card with presses carries
   `data-spec` and `data-presses` equal to the spec's `press_count`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` from the JSON: `SPEC` (the cards) and `NOTES` (each
   press's say line and what the room does, which are the speaker notes).
   78 programs, rounds, walks, X1's options and the recap chips ran on
   CPython 3.12.3 and match, except T2's notes version, where 3.12 adds
   `Did you mean: 'round'?`; the spec's wording is kept.
3. **One picture** (spec note 5), `figures/rows.tsx`: `Row` (cells with the
   index under each; a list has handles, a tuple a lock), `NameBox` (C15,
   E1, G2, C16, C17), `CountBar`, and `flyFrom`, which animates a value from
   where it was (a cell into a name box, a letter into a new row).
4. **One world**: Teja's UPI payments at the Sri Sai Canteen. `figures/Upi.tsx`
   draws a generic UPI app (purple header, green tick, details layout) with
   no product name or logo (content rule 12); its colours are the screen's
   own (rule 37). The phones have no island.
5. **Cards**: `Recap.tsx` (S-RECAP, and `Bins` reused on C9),
   `PaymentHook.tsx` (H1), `NoneCards.tsx` (C1 to C4, `HandBack`),
   `TupleCards.tsx` (C6 to C11), `Membership.tsx` (C13), `Tasks.tsx` (T1, T2),
   `Impostor.tsx` (G1), `ReceiptHook.tsx` (H2), `Unpack.tsx` (C15, E1),
   `FillBoxes.tsx` (G2), `Pack.tsx` (C16, C17), `Exit.tsx` (X1),
   `Takeaways.tsx` (K1).
6. **K1's results**: the spec gives one press per example and says the result
   waits for the room. A press fills the slot's code; a click on its result
   (the `?` slot) fills the result once the room has said it, and the next
   press fills it too, so a clicker never leaves one behind. The sixth result
   needs the click. Autoplay is off on K1.
7. **Controls and autoplay**: session 23's `controls.tsx` and `autoplay.ts`;
   the ON list is in decision 13.
8. **Movement inside one press**: `figures/phase.ts`. `usePhase` (from 21)
   for a fixed press, `useStepPhase` for "whichever press is on screen",
   derived during render so a new press never flashes the last one's end.
9. **`OutPanel` shrinks a line's type until the longest line fits**
   (`pieces.tsx`), so a TypeError never clips or wraps into what looks like a
   second output line. This was the commonest defect in 23 and 24.
10. **The agenda is static** (content rule 44) and shows all four stops.
    **The quiz** is `ClassroomQuiz`. **The feedback slide** is the standard
    one (rule 41).
11. **Reveal-step map**: measured against `http://localhost:5256/?nav=slide&x=`
    with a scratch copy of the measurer (MAX 30, slug-tolerant hash test);
    33 and 34 appended by hand. Every card count is `press_count - 1`.
12. **Git is not touched.** The shared checkout carries other sessions' work.

13. **Fix pass, 2026-10-08 (user's G1 to G4 and slides 3 to 26).**
    - Carried from 24: `figures/Code.tsx` (the code panel eases a changed
      line in, tints at 420ms, `________` drawn as a fill-in blank),
      `trace.tsx` (captions cross-fade, centred options). From 25: `Fresh`.
    - `Swap` (pieces.tsx) is the one way content is replaced on a press:
      old out, new in, never a cut; `DrawBox` (pieces.tsx) is the
      path-drawn square highlight (G4), used on C1's None and C8's comma.
    - No `CodePane` is keyed by program any more, so a program change eases
      line by line instead of remounting.
    - Slide 3: the last chip used to fly from the page's top-left (its tray
      had already unmounted); the tray now stays until the flight lands,
      then cross-fades to the program, and `flyFrom` refuses a detached
      source. Slide 4: the hand is gone; Pay shows a tap ripple, and app
      screens push in from the right. Slide 7: chip rises, a square draws
      round its None, then the title rises None first. Slide 19: the waiting
      program travels into the code box's place when the question changes.
      Slide 21: tokens are dealt per round, the running token lifts with an
      accent rim, its output rises into its slot. Slides 25 and 26: the
      `order` tag is the Row's own (`name`), on the cells' centre line.
    - Questions stay on screen once asked (C8, C9, C11, C13, C15, C16, C17).
    - Autoplay ON: 3, 4, 8, 12, 13, 14, 15, 16, 17, 21, 23, 25 (not 26).

14. **Carry-forward standard applied (generate-slides 2b), 2026-10-08.**
    - From 25: `Code.tsx` (a blank is three or more underscores, so X1's
      `___` and T2's lines 8 and 11 draw as the amber fill-in slot),
      `trace.tsx` (a new option set eases in), `Option` (letter and text on
      one centre line), `Phone.tsx` (`LiveClock`), `ClassroomQuiz.tsx`
      (session 14's quiz motion), `box-overflow-check.mjs`; `Group` and
      `Focus` into `common.tsx`.
    - Every concept card is two groups of equal height (program and output;
      the picture); games, tasks and the exit group their parts. A group
      lights (`active`) for the part the room is working on; `Focus` rings
      the program being asked until its answer shows. A vote that is a group
      on its own (E1, X1) is a still container (rule 43).
    - One size per role: `CODE_FS` 15, `OUT_FS` 16, `CODE_REF_FS` 13 for a
      program shown for reference (C2's corner, the recap's closing program,
      C13's waiting question). K1 keeps its grid sizes.
    - Arrows draw themselves: C3/C4's hand-back line over a faint guide,
      C10's operation arrows, C1's chip arrow.
    - Phones 196 x 404 (1 : 2.06), live clock, no `truncate` anywhere.
    - `box-overflow-check`: only the four dividers, where the kit's
      breaker section clips its decorative blobs (no text leaves it;
      checked).

## Verification, 2026-10-08

- `video-safe` CLEAN; `qa` flags only slide 1 (the Welcome baseline); its
  type-floor warnings are code, drawn-screen text and K1's small examples.
- `align-check` and `mixed-align-check`: 0 slides.
- `controls-clear-check`: CLEAR at every step of all 32 card slides.
- `overlap-check`: slide 1's sparkle (baseline) and two frames on C11 where a
  letter is caught mid-flight 0.7s after the press (the motion itself).
- `spec-check`, `feedback-check`, `gesture-check`, `agenda-check`,
  `ligature-check`, `autoplay-check`: pass (the first two adapted to 26).
- Every step of every card was screenshotted and looked at.
- `nav-stress-check` and WebKit were not run.
