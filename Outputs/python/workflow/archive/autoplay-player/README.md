# Auto Play for the deck player (built, then removed)

Built for Python session 17 on 2026-10-06 at the user's request, then removed
from that session the same day on the user's word ("remove the auto play
button ... just remember how you implemented it"). Kept here so it can be put
back, into one session or the kit, without being designed again.

## What it did

- Three mutually exclusive modes: **Auto Play** (default on load), step-wise,
  slide-wise. Replay's slot in the control bar became a play-triangle button,
  lit while Auto Play is on; the mode pill lit while a manual mode is on.
- Auto Play: on entering a slide at step 0 the build plays itself. The first
  step comes 900ms after the entrance, then one every 2000ms
  (`AUTO_FIRST_MS`, `AUTO_STEP_MS`; `DeckMeta.player.autoPlayStepMs`
  overrides). The build never crosses to the next slide. Plain arrows move
  slides, and any press stops the clock (each tick checks the step is where it
  left it).
- `SlideDef.autoPlay: false` makes a slide start paused. The first press shows
  step 1 and starts the rest playing. Session 17 flagged 5, 17, 18, 24, 27,
  29 and 30, the slides where the room works, votes or predicts first.
- Keys: `A` toggles Auto Play, and `S` leaves it for the last manual mode.
  Any mode switch restages the slide at step 0 (`switchMode` → `replaySlide`).
- `?all` still opened slide-wise. `build-reveal-steps.mjs` and
  `continuity-check.mjs` loaded `?nav=slides`, so the clock never ran beside
  a press count.
- The clock had to be armed at mount as well as in `gotoSlide`, because the
  first load never passes `gotoSlide`.

## Files

- `autoplay-player.patch`: unified diff from the pre-Auto-Play player (the
  same files as session 18's `src/deck/` and `figures/controls.tsx`) to the
  Auto Play version. Apply from a session root with `patch -p1 <
  autoplay-player.patch`.
- `files/`: the full Auto Play versions of `src/deck/{Deck,DeckControls,
  types,DeckContext,useKeyboardNav}`, `figures/controls.tsx`, the deck file
  with its `autoPlay: false` flags, `autoplay-check.mjs` (37 assertions on
  the built file), and the two harnesses with `?nav=slides`.

Not part of it, and still live in session 17: the `motionSpeed` token (0.65,
faster motion) and task 1's output alignment.
