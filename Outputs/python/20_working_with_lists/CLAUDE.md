<!-- cSpell:ignore NxtWave devPort Chuttamalle Hukum Kaavaalaa Kesariya Naatu Illuminati Kiran -->
# Working with Lists · session notes

Python course, Programming Foundations session 20. Built 2026-10-06 from the
pedagogy team's session spec, `Reference ppt's/20_working_with_lists_session_spec.json`
(the data) and `…_spec.html` (the reading page, with thumbnails of the original
deck's slides 7 to 75), under the plan at
`../session_plans/20_working_with_lists/plan.md`, the same way session 19 was
built. Course rules and the feedback log: `../workflow/skills/python-course/SKILL.md`.

28 slides, one per spec card. `devPort` 5249. Deck file `src/decks/workingListsDeck.tsx`.

## Decisions specific to this deck

1. **One slide per spec card, all 28, in the spec's order.** Every card with
   presses carries `data-spec` and `data-presses` equal to the spec's
   `press_count` (`spec-check.mjs` asserts it on the built file).
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `src/decks/figures/spec.ts` from the JSON; every program, output, trace
   step, caption, option, why line and takeaway sentence on a slide comes from
   it. Re-run the script if the spec changes. All 25 programs and the exit's
   four variants were run on CPython 3.12.3 and match.
3. **One picture, one engine** (`figures/memory.tsx`): tags with arrows,
   rows of boxes, value objects with id labels, cubes, slot arrows, grey
   objects; placed by coordinates, moved by tweening them, so a re-pointed
   tag's arrow lifts and lands. `pictureOf()` turns a spec step (`points`,
   `lists`) into the picture; `usePhase()` plays movement inside one press
   (E1's line 3, the hook's swipe) only when the press went forward by one.
   Layouts keep the arrow that must not move on a fixed path (list_b on C10,
   E1; kiran on T3).
4. **The spec's keys work without touching the player** (`figures/keys.ts`):
   first open adds `?nav=steps` to the address (never to storage, which
   `file://` shares across decks) so → / ← are one press; F clicks the
   player's full-screen button, A its slide picker; End lives in
   `StepControls` (`figures/controls.tsx`), which knows the card's remaining
   presses; `useVoteKeys` gives every vote keys 1 to n. All stand down while
   the marker is open.
5. **The agenda is static**, the plain `AgendaSlide` exactly as session 19's
   (content rule 44): no step-through, no selected point, no Next / Replay.
   The spec's per-press agenda was built, then removed on the user's word.
6. **The standard feedback slide** (content rule 41): `figures/FeedbackForm.tsx`
   from session 17 (session 18's file with the standard header) and
   `public/assets/feedback-qr.png`. Its Google Form frame never lets a page go
   network-idle, so the dev-server harnesses (`video-safe`, `qa`,
   `align-check`, `mixed-align-check`, `build-reveal-steps`) are run with a
   count of 27; slide 28 is the kit's Thank you slide, checked by eye, and its
   0 steps were appended to `src/export/revealSteps.ts` by hand.
7. **Votes are clickable, Next is never gated** (session 16's decision 5);
   confetti when the marked pick was right. Timers: 3:00 (T1), 4:00 (T2,
   T3), 2:30 (X1), started by the instructor.
8. **Ids are the original deck's own example numbers**, always labelled as
   examples. No card uses two equal string literals (spec defect 4).
9. **The quiz frame is `QuizTimeSlide lesson` only** (content rule 28);
   session 19 passed a subtitle, which is not carried.
10. **Session-local figures** in `src/decks/figures/`: `memory`, `trace`
    (`CodePane`, `StepCaption`, `Vote`, `TraceCard`), `RecapBug`, `ShareHook`,
    `Task1`, `ObjectCast`, `Objects`, `ListObjects`, `Task2`, `FreezeFrame`,
    `Moves`, `PlusWalk`, `Task3`, `ExitKeep`, `Takeaways`, `keys`, over pieces carried from sessions 18 and 19 (`common`,
    `controls`, `motion`, `pieces`, `Characters`, `Phone`, `RecapBrand`,
    `Agenda`, `gestures`, `FeedbackForm`, and unused `BeatList`, `IoPanels`,
    `Laptop`, `tiles`). None is in the kit; `memory.tsx` is the strongest
    candidate for a kit PR (any session about names and objects needs it).
11. **The player files** are session 19's (session 18's copies of
    `kit/mobile-nav`, `kit/code-ligatures`); `sync-kit --apply` waits for
    those merges.
    **Player fix, 2026-10-06 (user: "slide" mode showed black screens and
    overlapping slides):** `src/motion/presets.ts` gives the cut a real exit
    (the empty `none` exit never finished, so departed slides were never
    unmounted) and each exit its own timing via `custom={ dir, cut }`;
    `src/deck/Deck.tsx` wraps each slide's inside in `PresenceContext` `null`,
    so a shared-layout element inside a slide can no longer hold the slide's
    exit open (one stuck exit kept EVERY later slide mounted). Kit-owned files,
    so `sync-kit --apply` would undo this until the same fix lands in the kit
    (every deck and the template carry the bug). `nav-stress-check.mjs`
    drives the built file in Chromium, Firefox and WebKit at phone, laptop,
    1080p and 4K sizes.
12. **Git is not touched**: the shared checkout carries another session's
    staged work; this folder and its plan folder stay untracked until the
    user says.
