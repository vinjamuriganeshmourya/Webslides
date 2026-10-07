<!-- cSpell:ignore NxtWave devPort YONO -->
# Simple Interest · session notes

A format conversion, built 2026-10-07, of
`Reference ppt's/16_simple_interest_student_view_new_design 7.html` (the
pedagogy team's student-view deck, not modified) to this repo's rules, with
Python sessions 18 and 19 as the style reference. Plan:
`../session_plans/16_simple_interest/plan.md`. Scaffold: session 19's project
(player, harnesses, `common`, `controls`, `motion`, `pieces`, `Agenda`,
`FeedbackForm`, `gestures`, `RecapBrand`) plus session 18's `Phone.tsx`.

27 slides, one per reference card. `devPort` 5251. Deck file
`src/decks/simpleInterestDeck.tsx`. Deliverable
`dist-single/16_simple_interest_converted.html`, copied to
`Outputs/python/16_simple_interest_converted.html`.

## Decisions specific to this deck

1. **One slide per reference card, all 27, in order** (the presenter's
   `.slide, .pcard` list; its counter reads `n / 27`).
2. **Every reveal carried, in the reference's order and count.** The
   reference walks 121 states; each card's first state is the slide's entry
   and every later state is one `useBeats` build step (its `data-s` markers).
   `revealSteps.ts` reads 0,2,3,3,0,0,4,5,6,4,5,7,5,5,5,0,5,4,5,5,5,4,4,5,6,0,0.
   Card 3's answers sat behind a button the reference's arrow key skipped;
   here they are build steps too, behind `Show answer`.
3. **Words unchanged.** Content rule 36 applied as layout only (no trailing
   full stop; two sentences become two lines). An automated audit matched
   every reference line against the built deck; the only strings not carried
   are the control labels (`Reveal next / Reset` → `Next / Replay`), the
   agenda heading (`What We Will Cover` → `Agenda`, rule 39) and the quiz
   illustration's mock labels (the kit's `QuizTimeSlide` art).
4. **Template colours only** (`figures/si.tsx`): principal `success`,
   interest `accent`, amount `brand`, on every slide.
5. **Figures** in `src/decks/figures/`: `si` (question lead, worked steps,
   tip, band, chip, slot), `Basics` (slides 3, 4, 7 to 10), `Direct` (11 to
   15), `Models` (17 to 25). `RecapBrand` gained `stepped` (one point per
   press, first on entry). None is in the kit.
6. **Flags left to the user** (plan, "Flags"): `YONO · Deposits` on the hook
   phone names a real app (course rule R5); slide 23's note says "the next
   session" (rule 2b); the takeaways are the reference's six, not the agenda
   strings (rule 20); the quiz frame keeps its subtitle (rule 28).
7. **Harness baseline.** `video-safe` CLEAN, `align-check` 0, `mixed-align`
   0, `qa` slide 1 only plus the phone screen's type-floor warning on 4 (all
   run over slides 1 to 25: the feedback form never lets the network idle).
   `overlap-check` reports the kit `BrandSlide` sparkle on slide 1, which
   session 19 reports identically. `gesture`, `agenda`, `feedback`,
   `ligature` and `nav-stress` (Chromium, Firefox) pass.
8. **Git is not touched**: the shared checkout carries another session's
   staged work; this folder and its plan folder stay untracked until the user
   says.
9. **Review 1, 2026-10-07 (user).** Slide 11 title shortened to `Finding SI
   and the amount`; slides 11, 14, 15, 20, 21 and 22 take `mode="center"`
   (content centred in Space-1 instead of rising into Space-3); slide 21's
   tree centred horizontally, so `mixed-align-check` now names slide 21 (left
   question box over a centred tree), accepted on the user's word. Slides 20,
   21, 22 shrunk (box heights, 1px type steps) to stay above Next / Replay.
   Slide 21's title wraps to two lines in Poppins; text unchanged on the
   user's word.
