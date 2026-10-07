<!-- cSpell:ignore NxtWave devPort Meera Arjun PhonePe -->
# Compound Interest · session notes

Python course folder, Programming Foundations aptitude session 17. Built
2026-10-07 from the pedagogy team's presenter deck
`Reference ppt's/17_compound_interest_student_view_new_design 4.html` under the
plan at `../session_plans/17_compound_interest/plan.md` (plan and deck in one
run, on the user's brief). Course-wide rules are in
`../workflow/skills/python-course/SKILL.md`.

27 slides, one per reference card. `devPort` 5252. Deck file
`src/decks/compoundInterestDeck.tsx`. Deliverable
`dist-single/17_compound_interest_converted.html`, also copied to
`Outputs/python/17_compound_interest_converted.html` as the user asked.

## Decisions specific to this deck

1. **One slide per reference card, all 27, in its order** (27 `.pcard`s, no
   `.slide` frames; its counter reads `n / 27`). Nothing added, nothing dropped.
2. **Every press is a build step** (`useBeats` / `useCount`), with session
   18's `Next` / `Replay` (`figures/controls.tsx`) carrying the reference's own
   button words: `Reveal next`, `Show me`, `Reveal answer`. The reference's
   `Reveal answer` clicks on slides 9 and 13 are build steps too, so one
   forward key walks every reference state.
3. **Votes are clickable, the press is never gated**; confetti only on a right
   pick. Timers are the kit's `Countdown`, started by the instructor.
4. **Template colours only** (content rule 37): principal `success`,
   interest `warning`, amount `brandDark`. The phone frame is the object's own.
5. **Every block is left-aligned** (content rule 38): problem statements are
   the slide's lead (content rule 32), and every figure starts at the body's
   left edge.
6. **Session-local figures** in `src/decks/figures/`: `ci.tsx` (the money
   chips, `Insight`, `Band`, `StepCard`, `Calc`, `GapArrow`, `Worksheet`),
   `Hook.tsx` (`RecapBug`, `SavingsHook`), `Concepts.tsx` (`YearTable`,
   `BasicTerms`, `GrowthGraph`, `FormulaBuild`, `Frequency`, `SplitRate`),
   `Worked.tsx` (`WorkedSteps`, `Timeline`, `TwoMethods`, `Installments`),
   `Activities.tsx` (`PrincipalOrAmount`, `PascalRace`, `Takeaways`), over
   pieces carried from sessions 18 and 19 (`common`, `controls`, `motion`,
   `pieces`, `Phone`, `RecapBrand`, `Agenda`, `FeedbackForm`, `gestures`).
   None is in the kit; `WorkedSteps` (the four-step solution) is the first
   kit candidate for the aptitude sessions.
7. **The player files** are session 19's, with its slide-mode stacking fix
   (`src/motion/presets.ts`, `src/deck/Deck.tsx`); `sync-kit --apply` would
   undo it until the kit carries the fix.
8. **Git is not touched**: the shared checkout carries another session's
   staged work on the current branch.

## Where a rule changed the reference

The plan's "Flagged" table is the full list: the drawn app says `Savings`, not
`PhonePe · Savings`; the agenda mark reads `Agenda`; the quiz frame is the Simple Interest deck's (user, 2026-10-07, overriding content rule 28); two titles shortened to one line (slide 8 `Principal, rate,
time, interest and amount`, slide 22 `The difference between CI and SI`);
`Reset` is `Replay`; trailing full stops dropped and two-sentence lines split.

## Layout changes, 2026-10-07 (user)

`Panel centered` on 7, 8, 10, 11, 14 (centred between y 221 and 635, clear of the controls); `Panel drop={28}` on 16 to 18 and 22 to 24. See the plan's change note.

## Running it

```bash
npx vite --port 5252 --strictPort --open false
node video-safe.mjs "http://localhost:5252/?all" 25 & node qa.mjs "http://localhost:5252/?all" 25 &
node align-check.mjs "http://localhost:5252/?all" 25 & node mixed-align-check.mjs "http://localhost:5252/?all" 25 & wait
npm run build:html
```

Harnesses stop at 25: the feedback slide's Google Form frame never lets the
page go network-idle (session 20's note). Leave `CHROME_PATH` unset; there is
no `/opt/google/chrome` on this machine.
