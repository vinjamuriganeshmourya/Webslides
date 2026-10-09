<!-- cSpell:ignore NxtWave devPort Teja Ravi Kiran Sneha Pooja Divya Vamsi Arjun Harsha Manoj Meena Lakshmi -->
# Set Operations · session notes

Python course, Programming Foundations session 28. Built on 2026-10-08 from the
pedagogy team's session spec: `Reference ppt's/28_set_operations_session_spec.json`
(the data) and `…_spec.html` (the reading page, with 18 thumbnails of the
original deck's kept slides). The plan is at
`../session_plans/28_set_operations/plan.md`. The scaffold was copied from
session 26 (which carries 24's and 25's carry-forward standard); session 27 was
being built by another session at the time and was not touched. Course rules
and the feedback log are in `../workflow/skills/python-course/SKILL.md`.

The deck has 28 slides, one per spec card (27, plus DS3 from the change spec of 2026-10-09, item 14). `devPort` is 5258: run
`npx vite --port 5258 --strictPort --open false`. The deck file is
`src/decks/setOpsDeck.tsx` (`activeDeck.ts` points at it).

**Leftovers from the copy, on purpose.** Session 26's tuple figures
(`NoneCards`, `TupleCards`, `Impostor`, `FillBoxes`, `Pack`, `Unpack`, `Upi`,
`PaymentHook`, `ReceiptHook`, `Membership`, `Recap`) and
`src/decks/tuplesDeck.tsx` are still in this folder. The live deck imports
none of them; the user asked that nothing be deleted during the build. They
can be removed by hand later. `rows.tsx` must stay (`flyFrom`).

## Decisions specific to this deck

1. **One slide per spec card, all 27, in the spec's order**, D1 (Set
   Comparisons) as the one divider. Every card with presses carries
   `data-spec` and `data-presses` equal to the spec's `press_count`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` (`SPEC` and `NOTES`, the say lines, as speaker notes).
   60 programs, rounds, X1's options and the recap chips ran on CPython
   3.12.3 and match; C4's printed set comes out in another order, which spec
   note 6 allows.
3. **One picture** (spec note 5), `figures/venn.tsx`: `Venn` (two circles of
   name chips from explicit geometry: overlapping, apart, touching, nested),
   `Pool` (the NEW circle copies fly into; grey slots for E1), `OpIcon` (the
   original deck's operation icon, C1 and K1), `DrawArrow`, `Chip`, `pack`.
   Chips are placed by region, centre-out, widest first. **When a geometry
   changes, check it fits first**: a name that does not fit lands on the
   region's centre, on top of another chip. Overlapping circles draw a
   shared name once (the right circle's copy fades out where it lands).
4. **One world**: Teja's chat groups, CSE-A gang (8) and Hostel cricket (7)
   sharing Teja, Ravi, Kiran. The phone is session 26's `Phone.tsx` with its
   `CHAT` palette: a generic chat app, no product name or logo (rule 12).
5. **Cards**: `RecapSort.tsx` (S-RECAP), `GroupHook.tsx` (H1),
   `OpCards.tsx` (C1 to C6, and `OpFrame`, the shared two-group layout),
   `Gate.tsx` (E1), `Tasks.tsx` (T1, T2), `Regions.tsx` (G1, and
   `RoundFrame`/`WhyLines`, shared with G2), `PollHook.tsx` (H2),
   `Compare.tsx` (C7 to C9), `Inside.tsx` (G2), `Exit.tsx` (X1),
   `Takeaways.tsx` (K1).
6. **Layout**: the body box is y 221 to about 652 (Next at 661). Every
   concept card is two groups: the program with its question and vote on top
   (code column 730px: `cse = {...}` is 72 characters at 15px), the picture
   with its output and the original deck's sentence under it.
7. **K1** is six full-width rows (number, heading and rule; the operation
   icon; code and result), because three columns could not hold the
   46-character lines and the 62-character TypeError at a readable size. A
   result fills on a click or on the next press.
8. **T2**: the spec's "Harsha and Meena light outside cse" is drawn on the
   poll 2 input line (the names turn red, "not in cse"), not as a circle:
   the picture would not fit beside the code.
9. **Controls and autoplay**: session 23's `controls.tsx` and `autoplay.ts`;
   Autoplay opens ON on 3, 4, 7, 13, 17 and 25 (25 on the user's word, 2026-10-08);
   since DS3 went in at 7 these are 3, 4, 8, 14, 18 and 26.
10. **`sentences()`** (pieces.tsx) splits at a `?` only before a capital, so
    "in cse? yes" stays one clause (E1's walk captions).
11. **Reveal-step map**: measured against `http://localhost:5258/?nav=slide&x=`
    with a scratch copy of the measurer (MAX 30, slug-tolerant hash test);
    26 and 27 appended by hand. Every card count is `press_count - 1`.
12. **Git is not touched.** The shared checkout carries other sessions' work.

13. **Fix pass, 2026-10-08 (user's G1 to G4, slides 3, 4, 8, 10, 13, 14, 17, 23, 25 only).**
    - Control-safe zone: every listed card ends at least 21px above Next and
      Autoplay on every step (measured by `.gap.mjs`, a scratch probe in the
      session root; `controls-clear-check` skips boxes wider than 1000px, so
      it never saw slides 8 and 10's full-width picture group).
    - Fixed containers: slide 3's top row 226 and bins 172; slide 4's and 17's
      panel 404 (the phone's height, phones now 196 x 404); slides 8 and 10
      use `OpFrame safe` (rows 199 and 212; slides 9, 11, 12 are unchanged on
      the user's word); slide 23's row 400; slide 13's walk caption box 76.
    - Slide 4: lab faces (`people.tsx` and `cast/` copied from PF 27, six
      contacts added) on individual contacts only, groups keep the group
      icon; unread counts in their own column; the tick beside the face, not
      on it.
    - Slide 13: the result circles are 56 tall (was 52), so all 11 names fit.
    - Slides 14 and 23: the timer at 70% inside the Worksheet box, on its right.
    - Slide 25: Autoplay ON.
    - Code panels ease their height when a program's line count changes.

14. **Change spec, 2026-10-09** ("28 Set Operations: recall what a set is",
    `Reference ppt's/28_set_operations_change_spec_data_structures 1.html`).
    DS3 is slide 7, after the agenda: session 27's `figures/DataStructures.tsx`
    copied unchanged (with `Insta.tsx`, which its unused `DataFamily` needs),
    `WhatItIs` on the deck, kicker `Recap`, autoplay off. The card's JSON is
    `../session_plans/28_set_operations/change_ds.json`, merged by
    `scripts/build-spec-data.mjs` (new beat, two minute changes, a 75-minute
    check). Nothing else on the deck changed; every slide from C1 on moved
    up one, and the reveal map, autoplay set and harness slide numbers with it.
