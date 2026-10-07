<!-- cSpell:ignore NxtWave devPort strictPort Starc Zampa Rohit -->
# Nested Loops · session notes

Python course, Programming Foundations session 16. Built from the pedagogy
team's lesson plan `prog_foundations_LP/16 - Nested Loops` (the `fianl` cut,
23 frames) under the plan at `../session_plans/16_nested_loops/plan.md`,
signed off 2026-10-01. Course-wide rules and the feedback log are in
`../workflow/skills/python-course/SKILL.md`; read that and
`.claude/skills/pedagogy-to-components/SKILL.md` before editing.

23 slides. `devPort` 5245. Deck file `src/decks/nestedLoopsDeck.tsx`.

## Decisions specific to this deck

1. **One slide per reference frame, all 23, in the reference's order.** No
   dividers or next-session frame, because the reference has none.
2. **Every code panel says `Python`** (content rule 31). The drawn Code
   Playground on slide 15 keeps its `main.py` tab: the picture is of the portal.
3. **Content rule 36 everywhere**: no line of slide copy ends in a full stop;
   a two-sentence caption is two lines in one box (`Lines` in `common.tsx`).
4. **One sentence changed** for content rule 2b, slide 15 beat 2: "Last
   session's trick repeats a string" is "The * trick repeats a string".
   Commented where it sits in `PlaygroundStory.tsx`.
5. **The reference's controls stay.** `Next` beats are build steps; slide 8's
   is labelled `One step`; slide 3's `Turn it over` flips one card per press
   (local state). The reference's A to D options on slides 9, 19 and 20 are
   static text and `Next` runs regardless; here they are clickable so the
   confetti can fire, and `Next` is still not gated (plan decision 5).
6. **Session-local figures** in `src/decks/figures/`: `FlipCards`,
   `CricketHook`, `TwoOversWalk`, `NestedTrace`, `LoopMachine`,
   `PlaygroundStory`, `LineByLine`, `TwoPrograms`, `Closing` (`ExitVote`,
   `Takeaways`), `Tasks` (`SolveFirst`), over pieces carried from session 15
   (`common.tsx`, `motion.tsx`, `Phone.tsx`) and session 14 (`BeatList`,
   `IoPanels`). None is in the kit; promoting one is a kit PR with the user's
   approval. `Phone` is now in two sessions and is the first candidate.
7. **Every output is a real run** on CPython 3.12.3; the plan lists them.
8. **Motion** is session 15's register: `Press`, `Glow`, slide-wide
   `Confetti` on a right pick, the card flip, the machine's marks arriving at
   reading pace, the cricket plan's arrow travelling back up. Nothing
   self-advances.
9. **Git is not touched** (plan decision 9).
10. **`qa.mjs`'s type-floor warnings that stay.** Slides 4, 7 and 15 draw
    product screens (the live-score card, the app on the phone, the Code
    Playground) and their chrome is small by nature, as session 15's phone
    screens were. Slide 21's six takeaway cards are dense by the reference's
    own design (code, result and sentence in a 360 x 200 card). Everything
    else sits at or above 16px.

11. **Review 2, 2026-10-01**, layout and motion only, no content change except
    slide 17's kicker (`Worksheet Task-2`, and the brief loses its heading, as
    asked). `figures/controls.tsx` is a **session-local override of the kit's
    `StepControls` and `PanelButton`** (remove when the kit PR lands): at the
    last beat the step button goes grey and Replay takes the filled style. Slide
    3's flips are build steps now, so the arrow key turns a card. Slide 4 draws
    the reference's bowling: the ball leaves the bowler, lands, goes where the
    shot sends it, and the result pops beside the batter (1700ms, the reference's
    own); the plan has its dashed flow arrows and a red ball marker on the line
    that is running. Slide 7 is the reference's layout: Block chips inside the
    code panel, the caption over the phone and the output, the output coloured
    (numbers ink, sentences orange). Slide 8's right column has fixed heights so
    the output never moves and shows all six lines. Slides 9 and 19 run their
    marks in one second. Slide 17's timer sits above the code, right-aligned.
12. **Review 3, 2026-10-01.** `figures/RecapBrand.tsx` is a **session-local
    override of the kit's `RecapSlide`** (remove when the kit PR lands): the
    kit paints the recap header in the success tone, so slide 2 was the one
    slide with a green bar and kicker; the override takes the brand tone and
    changes nothing else (green ticks, mascot). Slide 7 relaid: the caption
    under the code it narrates, the phone at real proportions (190 x 384,
    1 : 2.02) with the app's foot visible, the output panel's fixed 384px
    holding all 17 lines at 15px x 1.25 with nothing scrolled off. Slide 7's
    phone has no island (`island={null}`).
13. **The ball on slide 4 flies on the main thread.** It left the pitch in the
    built file in a real browser window and nowhere else: a `will-change:
    transform` WAAPI animation is composited, and under the stage's CSS `zoom`
    the GPU can draw the layer at the unzoomed offset, which no headless
    measurement sees (`SlideStage.tsx` records the same compositor caveat). The
    flight now animates `left`, `top`, `width`, `height`, and the result pill
    fades without a transform. **Rule for this deck:** nothing inside the zoomed
    stage animates `transform` on its own layer; confetti is exempt because it
    is portaled to `body`, outside the zoom.

## Running it

`vite.config.ts` is a kit file and hardcodes port 5173, so start on the port
the harnesses read:

```bash
npx vite --port 5245 --strictPort
export CHROME_PATH=/usr/bin/brave-browser   # /opt/google/chrome/chrome is not on this machine
node video-safe.mjs & node qa.mjs & node align-check.mjs & wait
npm run build:html && node preview.mjs && node scripts/build-preview-page.mjs
```
