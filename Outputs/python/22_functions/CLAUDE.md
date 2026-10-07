<!-- cSpell:ignore NxtWave devPort Teja Rahul Amma -->
# Functions · session notes

Python course, Programming Foundations session 22. Built 2026-10-07 from the
pedagogy team's session spec, `Reference ppt's/22_functions_session_spec.json`
(the data) and `…_spec.html` (the reading page, with thumbnails of the original
deck's slides 12 to 48), under the plan at
`../session_plans/22_functions/plan.md`, the same way sessions 19 to 21 were
built. The project was copied from session 21's (kit, player and harness files
unchanged). Course rules and the feedback log:
`../workflow/skills/python-course/SKILL.md`.

28 slides, one per spec card. `devPort` 5251 (run `npx vite --port 5251`; the
kit's `vite.config.ts` says 5173). Deck file `src/decks/functionsDeck.tsx`.

## Decisions specific to this deck

1. **One slide per spec card, all 28, in the spec's order.** Every card with
   presses carries `data-spec` and `data-presses` equal to the spec's
   `press_count` (`spec-check.mjs` asserts it on the built file). The spec has
   no card C6 and no divider cards; none were invented.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `src/decks/figures/spec.ts` from the JSON, and now also lifts each vote's
   options out of its first press (`vote`). `scripts/run-spec-programs.py`
   runs every program with its input: 36 of 36 match on CPython 3.12.3.
3. **One picture for the whole session** (spec note 5), `figures/call.tsx`:
   `CallCode` (the kit's `CodeBlock` with the jump-in arrow in orange and the
   way back in green, both in a gutter LEFT of the box so no arrow crosses
   code; the call line waits in amber), `Areas` (`Inside greet` exists only
   while the call runs; its boxes vanish with it, no ghost), `IoBox`,
   `traceOf` (reads a spec `steps` list into frames), `usePhase` (movement
   inside one press, C8 and T2), `TokenRing` (a ring on one word of a code
   line, found by text across the highlighter's spans).
4. **One world** (spec note 2): `figures/People.tsx` (people, the cake, the
   cake box, speech bubbles), `figures/Hooks.tsx` (H1 hostel room, phone lock
   screen and video call; H2; C10 bakery), `figures/Game.tsx` (G1's party TV;
   each option is drawn as a small TV screen, its must line).
5. **Autoplay is off on every slide.** Session 21's switch stays in the control
   bar so the decks match, with `AUTOPLAY_ON_BY_DEFAULT` empty: the spec's rule
   1 is "No autoplay".
6. **The quiz slide** is session 21's `figures/ClassroomQuiz.tsx` (the lesson
   plan's card 17), unchanged. `video-safe.mjs` reports its tilted quiz card
   inside the instructor-video rectangle (slide 15): that is the reference's
   own placement, kept on purpose.
7. **`sentences()`** (`figures/pieces.tsx`) now ends a sentence at `!` only
   before a capital, so `Cake time! printed` and `Hurray! comes` stay one line.
8. **C12's `greeting` box** is drawn from the way-back step on, from that
   step's caption (`greeting = 'Hello Teja'`); the spec's `main` leaves it out.
9. **The standard feedback slide** (content rule 41); `feedback-check.mjs`
   reports an exact copy of session 18's. Its Google Form frame never lets a
   page go network-idle, so the dev-server harnesses run with a count of 27.
10. **Reveal-step map**: measured with `build-reveal-steps.mjs` at
    `"http://localhost:5251/?nav=slide&x=" 27`, `MAX_PRESSES` 40 (G1 has 34
    steps) and a hash check that accepts `#/n-slug`; slide 28's 0 appended.
11. **Git is not touched**: the shared checkout is mid-merge on another
    branch; this folder and its plan folder stay untracked until the user says.
