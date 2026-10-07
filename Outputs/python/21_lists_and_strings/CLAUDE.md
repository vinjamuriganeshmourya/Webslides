<!-- cSpell:ignore NxtWave devPort margorP -->
# Lists and Strings · session notes

Python course, Programming Foundations session 21. Built 2026-10-07 from the
pedagogy team's session spec, `Reference ppt's/21_lists_and_strings_session_spec.json`
(the data) and `…_spec.html` (the reading page, with thumbnails of the original
deck's slides 13 to 53), under the plan at
`../session_plans/21_lists_and_strings/plan.md`, the same way sessions 19 and 20
were built. Course rules and the feedback log: `../workflow/skills/python-course/SKILL.md`.

31 slides, one per spec card. `devPort` 5250 (run `npx vite --port 5250`; the
kit's `vite.config.ts` says 5173). Deck file `src/decks/listsStringsDeck.tsx`.

## Decisions specific to this deck

1. **One slide per spec card, all 31, in the spec's order.** Every card with
   presses carries `data-spec` and `data-presses` equal to the spec's
   `press_count` (`spec-check.mjs` asserts it on the built file).
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `src/decks/figures/spec.ts` from the JSON. All 51 programs and variants in
   the JSON were run on CPython 3.12.3 and match.
3. **Two pictures** (spec notes 3 and 4):
   - `figures/tiles21.tsx`: `Tiles` (a string as letter tiles; a space is a
     grey dot, `\n` and `\t` one tile each; a knife in its own lane), `PieceRow`
     (the list `split()` gives; an empty piece is a box holding `''`; join's
     glue drops into every gap and never at the ends), `cutsOf` /
     `splitStates`, and `usePhase` (movement inside ONE press, played only
     when the press was reached going forward; any other arrival shows the end
     state).
   - `figures/pieces.tsx` `ListBoxes` gained `neg` (the second position row,
     -n to -1, empty dashed slots before it fills), `negStagger` (fills from
     the right), `rowLabels` (`index`, `negative index`) and the `xxs` size.
4. **The spec's keys** (`figures/keys.ts`, unchanged from 20): → / ← one
   press, F, A, End, vote keys 1 to 4.
5. **The agenda is static** (content rule 44).
6. **The standard feedback slide** (content rule 41); `feedback-check.mjs`
   reports an exact copy of session 18's. Its Google Form frame never lets a
   page go network-idle, so the dev-server harnesses run with a count of 30.
7. **Reveal-step map**: `build-reveal-steps.mjs` presses Ctrl+→, which in this
   deck's default steps mode jumps a whole card, so it is run with
   `"http://localhost:5250/?nav=slide&x=" 30`, and with `MAX_PRESSES` raised to
   24 (E1 and G1 have 17 steps). Slide 31's 0 was appended by hand.
8. **Drawn apps**: the note app (yellow note, its menu) and the group chat
   (green bar, wallpaper, ticks) keep their own screen colours inside the phone
   and carry no mark: neither logo is in `slide-kit/assets/`. The ticked item
   stays in place, struck through (the spec's "order never changes"); the
   menu words are the spec's and still need a check on a real phone.
9. **Spoken lines in the notes**: C11 carries original slide 37 (a slice can
   run past the end; `list_a[-6]` is `IndexError: list index out of range`),
   C14 carries slides 50 and 51 (`string_1[-4:-1]` is `gra`,
   `string_1[-1:-4:-1]` is `mar`). All run on CPython.
10. **The player files** are session 20's, with its slide-mode fix
    (`src/motion/presets.ts`, `src/deck/Deck.tsx`); `sync-kit --apply` would
    undo it until the kit has the same fix. `nav-stress-check.mjs` passes in
    Chromium and Firefox at four sizes; WebKit was not run here.
11. **Autoplay (user, 2026-10-07).** Each built card's `StepControls`
    (`figures/controls.tsx`) pairs Next with an Autoplay switch in the slot
    Replay had (same pill, same place; it reads `Autoplay On` / `Off`). On by
    default on slides 3, 4, 14, 18, 20, 21, 22, 23, 24, 26, 29 only
    (`figures/autoplay.ts`); off is step-wise (turning it off also puts the
    player's plain arrows back on steps). A manual press pauses it; the switch
    resumes from the step on screen; a student's switch is remembered per
    slide while the deck is open, never in storage. Timing: wait for the
    step's own motion to settle (visible text still for 750ms), then hold for
    500ms + 13ms per newly visible character (code x1.3), 1.22s to 3.2s; about 2.5s per step on average (user, 2026-10-07). It
    never crosses a slide. `?all` and `?noauto` turn it off, so the harnesses
    never see an unrequested step (`overlap-check.mjs` loads `noauto`).
    Replay itself remains the player's own button and R. The archived
    player-wide Auto Play (`../workflow/archive/autoplay-player/`) was the
    starting point. `autoplay-check.mjs` checks it on the built file.
12. **The quiz slide (user, 2026-10-07)** is `figures/ClassroomQuiz.tsx`, the
    lesson plan's card 17 of session 17 ("Classroom quiz on the portal"): its
    words and layout, on the kit's `night` frame (`nw-night` is the
    reference's own gradient), the card drawn at 0.86 and set lower so it stays
    out of the video rectangle. It is the standard for every quiz slide in this
    deck; the kit's `QuizTimeSlide` is no longer used here.
13. **Git is not touched**: the shared checkout carries another session's
    staged work; this folder and its plan folder stay untracked until the
    user says.
