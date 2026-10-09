<!-- cSpell:ignore NxtWave devPort Teja Ameerpet Rapido -->
# Function Arguments · session notes

Python course, Programming Foundations session 23. Built 2026-10-07 from the
pedagogy team's session spec, `Reference ppt's/23_function_arguments_session_spec.json`
(the data) and `…_spec(1).html` (the reading page, with thumbnails of the
original deck's kept slides 10 to 47), under the plan at
`../session_plans/23_function_arguments/plan.md`, the same way sessions 19 to
22 were built. The project was copied from session 22's (kit, player and
harness files unchanged). Course rules: `../workflow/skills/python-course/SKILL.md`.

25 slides, one per spec card. `devPort` 5253 (run `npx vite --port 5253
--strictPort --open false`; the kit's `vite.config.ts` says 5173). Deck file
`src/decks/argumentsDeck.tsx`.

## Decisions specific to this deck

1. **One slide per spec card, all 25, in the spec's order.** Every card with
   presses carries `data-spec` and `data-presses` equal to the spec's
   `press_count` (`spec-check.mjs` asserts it on the built file).
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `src/decks/figures/spec.ts`. `scripts/run-spec-programs.py` runs every
   program: 40 match on CPython 3.12.3, plus 3 SyntaxErrors that 3.12 words
   differently; the deck keeps the spec's 3.11 wording on purpose (spec defect
   note on slides 40, 41) and T2's notes tell the instructor the new wording.
3. **One picture for the whole session** (spec note 5), `figures/slots.tsx`:
   `SlotHeader` (the def's header with a slot per argument; dashed empty, red
   missing, faint default; slots slide when their order changes), `ValueChip`
   (the value wearing `arg_1=`, `1st` or `default`), `useFly` (a value flies
   from its own word in the call line, found by `tokenRect`, into its slot),
   `fillOf` (a spec fill step to a slot fill).
4. **One world** (spec note 2), `figures/Maps.tsx`: Teja's phone on a maps
   app's directions screen (start circle, end pin, swap button, bike chip,
   route that redraws when the boxes swap, crash screen). H1, G1 and H2 use it.
5. **E2 uses session 22's call picture** (`call.tsx` `Areas`), now showing
   numbers without quotes and able to ring a box (`ringMain`); `IoBox` can ring
   a line (`ring`) and wrap an error (`wrap`).
6. **Step controls and autoplay (user, 2026-10-07, after the first build;
   recorded in generate-slides section 2 for every deck).** Next and an
   icon-only round Autoplay button (▶ off, ⏸ running, `aria-label` and tooltip
   `Autoplay`), both 34px tall, their bottom 14px above the frame's foot
   (`CONTROLS_BOTTOM` in `figures/autoplay.ts`); nothing on any card's first or
   last press sits under them. Autoplay opens ON on slides 3, 4, 7, 8, 9, 10,
   13, 17, 18, 20 and 23 (`AUTOPLAY_ON_BY_DEFAULT`), over the spec's rule 1 on
   the user's word, and paces at 2.5s per step (`STEP_MS`; measured 2.55s
   average over those 11 slides, page load included). Slide 3's content is
   lifted 16px. Every phone (`Maps.tsx`) is drawn without a dynamic island.
7. **The quiz slide** is session 22's `ClassroomQuiz`, unchanged;
   `video-safe.mjs` reports its tilted card (slide 16), the reference's own
   placement.
8. **H1's caption** shows only the part of the spec line the heading does not
   already say ("Teja is going home"); **H2** shows its first question only as
   the heading; **T1 and T2's last captions** take the place of the brief or the
   story line, so nothing reaches the Next button.
9. **The standard feedback slide** (content rule 41); exact copy of 18's. Its
   Google Form frame never lets a page go network-idle: dev-server harnesses
   run with a count of 24.
10. **Reveal-step map**: measured with a copy of `build-reveal-steps.mjs`
    (MAX_PRESSES 24, `#/n-slug` accepted, page `load`) at
    `"http://localhost:5253/?nav=slide&x=" 24`; slide 25's 0 appended.
11. **Git is not touched**: the shared checkout belongs to another branch's
    work; this folder and its plan folder stay untracked until the user says.
