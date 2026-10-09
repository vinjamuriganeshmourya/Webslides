<!-- cSpell:ignore NxtWave devPort Teja -->
# Built-in Functions · session notes

Python course, Programming Foundations session 24. Built on 2026-10-07 from the
pedagogy team's session spec, and re-synced the same day to its revision:
`Reference ppt's/24_built_in_functions_session_spec 1(new).json` (the data) and
`…_spec 1(new).html` (the reading page, with thumbnails of the original
deck's 16 kept slides). The plan is at
`../session_plans/24_built_in_functions/plan.md`, and the build follows
sessions 19 to 23. The scaffold was copied from session 21. Course rules and
the feedback log are in `../workflow/skills/python-course/SKILL.md`.

The deck has 23 slides, one per spec card. `devPort` is 5254: run
`npx vite --port 5254 --strictPort --open false`, because the kit's
`vite.config.ts` says 5173. The deck file is `src/decks/builtInsDeck.tsx`.

## Decisions specific to this deck

1. **One slide per spec card, all 23, in the spec's order.** The spec has no
   divider cards, so none are added. Every card with presses carries
   `data-spec` and `data-presses` equal to the spec's `press_count`.
   `spec-check.mjs`, adapted for this deck, asserts this on the built file,
   along with the keys.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `src/decks/figures/spec.ts` from the JSON. All 31 programs ran on CPython
   3.12.3 and match. So do G2's four rounds, the hook's two guide programs,
   the recap's three tiles, G1's six line 2s and X1's four options.
3. **One picture for the first half** (spec note 5) lives in
   `figures/scope.tsx`, drawn on session 20's `figures/memory.tsx`.
   - `Scope` shows two areas, `Outside add_unit` and `Inside add_unit` (the
     call's area, only while the call runs), plus one shared `Lists` column.
   - When a step lists `defaults`, the column carries the def's own shelf,
     `add_unit's default`.
   - It is read from the spec's steps (`names`, `lists`, `defaults`, `where`).
     A list nothing points at unmounts at once, with no ghost.
   - `MiniScope` is the small form used on the takeaways.
4. **One world** (spec note 2, revised): exam week for Ravi.
   - `figures/NotebookHook.tsx` is H1: Ravi's notebook, Priya, the xerox
     shop. One notebook element moves and is never redrawn; the xerox is a
     second, separate book from press 5. It replaced the phone/Contacts hook
     (`PhoneHook.tsx`, removed) when the spec moved to the notebook world.
   - `figures/ScreenTime.tsx` holds H2's screen time page, plus `ScreenBars`
     (reused on C5) and `AutoHeight` (the one-movement collapse).
   - `figures/Tasks.tsx` has T2's number plate and T1's small notebook pages.
   - These drawn screens keep their own colours. The phones have no island.
5. **Cards**:
   - `Recap.tsx`: S-RECAP, three flip tiles.
   - `PassList.tsx`: C1, C2 and E1.
   - `Tasks.tsx`: T1 and T2.
   - `Classify.tsx`: G1. A case lands in the bin the room voted for, then
     bounces home if that vote was wrong.
   - `Builtins.tsx`: C3 to C6. The `ord` numbers are computed from the
     letters. C3 has the new phone's home screen (the analogy). C4 and C5
     walk the values with a pointer and a keeping box (`WalkStrip`) before
     the output fills; C6 builds the new row one box at a time.
   - `Inside.tsx`: G2, four rounds of the built-in visiting each item, its
     bars in H2's colours, every kept value read from the data.
   - `Exit.tsx`: X1.
   - `Takeaways.tsx`: K1, two presses per example (code, then result), the
     caption inside the empty result box.
6. **Controls and autoplay** follow generate-slides section 2. `controls.tsx`
   and `autoplay.ts` are session 23's, copied unchanged except for the ON
   list: slides 3, 4, 7, 13, 14, 15 and 21 (8, 11, 16 and 17 turned off
   on the user's word, 2026-10-07; K1 moved from 20 to 21 when G2 was
   inserted as slide 18, which opens off like G1).
   `autoplay-check.mjs` was adapted to the icon button and passes.
7. **The agenda is static** (content rule 44). **The quiz** is session 21's
   `ClassroomQuiz`. **The feedback slide** is the standard one (rule 41);
   `feedback-check.mjs` reports an exact copy. Its Google Form frame never
   lets the page go network-idle, so the dev-server harnesses run with a
   count of 22.
8. **Reveal-step map**: re-measured with a patched scratch copy of
   `build-reveal-steps.mjs` at `"http://localhost:5254/?nav=slide&x=" 21`.
   The copy used `MAX_PRESSES` 30 (G2 has 26 steps), longer waits and a hash
   test that accepts `#/n-slug`. Slides 22 and 23's 0s were appended by hand.
   Every count is
   `press_count - 1`.
9. **Rule 38 on three-column grids**: the recap tiles and the takeaways use
   unequal outer columns, so the middle column is not read as a centred
   block.
10. **The player files** are session 21's, with the slide-mode fix.
    `nav-stress-check.mjs` passes in Chromium and Firefox at four sizes.
    WebKit was not run here.
11. **Git is not touched.** The shared checkout carries other sessions' work
    (22 and 23), so this folder and its plan folder stay untracked until the
    user says otherwise.

12. **Review fixes, 2026-10-08** (slides 3, 7 to 11, 15, 16, 19 and rules
    G1 to G4 from the user's list):
    - `figures/Code.tsx` is a session-local override of the kit's
      `CodeBlock` (kit PR note pending): a run of underscores (`BLANK`) is
      drawn as the fill-in blank (dashed amber slot, pencil, slow breathing
      tint), a line whose text changes fades up into place, and line tints
      ease at 420ms. `CodePane` renders through it.
    - `Group` (common.tsx) is the grouping box from the user's reference
      screenshot: near-white wash, 1px rim, soft shadow, one padding.
      `Focus` rings the code panel being asked about (slides 3 and 15).
    - `StepCaption` centres its text and cross-fades captions; `Option`
      centres letter and text and takes `nowrap`; `memory.tsx` and
      `scope.tsx` fade out what leaves.
    - Slide 15 (C4) is one layout for its four questions: the question above,
      the string turns' program and options centred as one unit, sliding
      left as the explanation comes in from the right.
    - C1 and C2's picture is drawn at 0.92 inside its group so every step
      clears Next (controls-clear-check).
    - Re-verified 2026-10-08: video-safe CLEAN, qa only the kit baselines
      (slides 1 and 23), align and mixed-align 0, overlap only slide 1's
      sparkle, controls-clear CLEAR, spec, ligature, autoplay and gesture
      checks pass.

## Verification, last run 2026-10-07 (after the spec revision)

- `video-safe` reports CLEAN.
- `qa` flags only slide 1, the kit Welcome baseline. Its type-floor
  warnings are code and drawn-screen text.
- `align-check` and `mixed-align-check`: 0 slides need attention.
- `overlap-check`: only slide 1's sparkle, the baseline.
- `feedback-check`, `gesture-check`, `agenda-check`, `spec-check`,
  `autoplay-check` and `ligature-check` pass (`spec-check` and
  `autoplay-check` updated for the revision: G1's new title, K1 on 21).
- `nav-stress-check` was not re-run after the revision.
