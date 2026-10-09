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
5. **Autoplay** (session 21's switch, `figures/autoplay.ts`): first shipped
   off everywhere (the spec's rule 1), then turned ON by default on slides 3,
   4, 7, 8, 10, 16, 18, 24 and 26 at the user's request (2026-10-07). Every
   other slide opens off.
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
12. **The people on slides 4 and 20 come from the Character Lab** (user,
    2026-10-07). `figures/cast/` is the lab's `rig/`, `skins/` and `actions/`
    vendored unchanged (its README says how); `figures/Cast.tsx` holds the
    cast (Rahul = the lab's Arjun, Riya, and lab configs for Teja, Amma and
    the baker, whose cap and apron are added props) and `Posed`, which plays
    a lab gesture once on the press and holds one frame, cropped to half body.
    Slide 4: Rahul, Teja, Riya in the room (they clap and sing on the song),
    Amma waving on the call, Teja on the self tile. Slide 20: Rahul and the
    baker at the counter, then shouting / shrugging (way A) and handing over
    / carrying the cake box (way B). The old drawn `Person` is no longer used.
13. **Slide 20's step change** is one cross-dissolve: the counter scene fades
    out over 420ms while the two ways fade up over 520ms from 120ms in, both on
    `easing.soft`; way B and the question use the same 520ms curve.
14. **Slide 4's birthday-scene people idle** (user, 2026-10-07): Rahul, Teja
    and Riya are `Idling` (`figures/Cast.tsx`), one base pose (the lab's rest
    pose, `happy`) for the whole slide, no gesture and no pose change between
    presses. They move only by the lab's idle layer (breathing, blinks, eye
    movement, a slow weight-shift sway, liveliness 0.7) and `handDrift`, a
    seamless 6 to 8 s loop of in-out keys around rest. Measured over 20 s at
    20 Hz: shoulders 8 +/- 2 deg, elbows 4.5 to 8.4 deg (bending only the
    natural way), wrists +/- 3 deg, body sway +/- 2.4 px, head tilt +/- 1.3
    deg, no step over 1 deg per 50 ms. They register as `scene-<name>` in
    `window.__actors` for that measurement. The phone's Amma and Teja are
    still `Posed` and unchanged (0 differing pixels).
15. **Step controls and pace follow the global rule** (generate-slides section
    2, user 2026-10-07): `figures/controls.tsx` is Python 23's, copied
    unchanged (small Next, round icon-only Autoplay with ▶ / ⏸, 34px high, at
    `CONTROLS_BOTTOM` 14px); `figures/autoplay.ts` is Python 23's with only
    this deck's on-by-default list (3, 4, 7, 8, 10, 16, 18, 24, 26). Autoplay
    holds each step 2.5s (`STEP_MS`), longer only while a step's own motion
    runs. Checked on every press of every stepped card: the buttons touch no
    content, the player bar or the logo.
