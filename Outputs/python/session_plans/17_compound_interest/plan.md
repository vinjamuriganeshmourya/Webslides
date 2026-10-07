# Compound Interest · slide-wise plan

STATUS: generated in the same run as the plan, on the user's brief of
2026-10-07 ("plan it and proceed, don't wait for my approval"). Not separately
signed off.

| | |
|---|---|
| Course | Python course folder (`Outputs/python/`), Programming Foundations aptitude session 17 |
| Source | `Reference ppt's/17_compound_interest_student_view_new_design 4.html`, the pedagogy team's presenter deck: 27 `.pcard`s, no `.slide` frames, counter `n / 27`, 118 press states |
| Session project | `Outputs/python/17_compound_interest/`, deck `src/decks/compoundInterestDeck.tsx`, devPort 5252 |
| Deliverable | `dist-single/17_compound_interest_converted.html`, copied to `Outputs/python/17_compound_interest_converted.html` as the user asked |
| Models | Python sessions 18 (converted from the same kind of reference) and 19 (scaffold, player fix, harnesses) |

## The brief

Convert the source deck to this repo's rules. Its content is correct and
complete: every slide, heading, sentence, formula, example, table, diagram,
note and step is carried, in its order. Only the formatting changes: kit
components, template colours, zones, the house controls and the house motion.
Where a hard rule in this repo forbids something the source does, the rule
wins and the change is listed under "Flagged" below.

## Decisions

1. **One slide per source card, all 27, in the source's order.** Nothing
   added, nothing dropped.
2. **Every press is a build step**, with session 18's `Next` / `Replay`
   (`figures/controls.tsx`). The button keeps the source's own label where it
   had one (`Reveal next`, `Show me`, `Reveal answer`). The source's `Reset`
   is the house `Replay`, which does the same thing.
3. **The source's "Reveal answer" clicks are build steps too** (slides 9 and
   13), so one forward key walks every state, as the source's presenter did,
   and the export knows the step count.
4. **Votes are clickable, the press is never gated** (session 16 decision 5,
   kept by 18 and 19). Confetti fires when the room's pick was right, and
   nowhere else.
5. **Timers are the kit's `Countdown`**, started by the instructor (session 18
   decision 5): 0:20 per question on slide 9, 2:00 and 1:30 on slide 13, 1:00
   on slide 15. The source started the 0:20 ones by itself.
6. **Template colours only** (content rule 37). The source's green, amber and
   blue cell fills map to `success`, `warning` and `brandDark`. The phone's
   dark frame is the object's own colour.
7. **Content rule 36**: no line of slide copy ends in a full stop; a line with
   two sentences is two lines. Formulas and worked arithmetic are not copy and
   keep their own form.
8. **Problem statements are the slide's lead** (content rule 32: the lead is
   the first block of the body, in Space-3), with the given values in bold
   brand blue as the source marks them.
9. **Every number is a real calculation**, re-run in Python 3 (course rule R3):
   table below.
10. **Git is not touched** (shared checkout, another session's staged work on
    the current branch). The folders stay untracked until the user says.

## Narrative frameworks (content rule 23)

The source's order is kept; the plan names what each concept runs on.

| Concept (agenda item) | Framework | Opening (two slides) | Close |
|---|---|---|---|
| 1 Understanding how compound interest works | STAR | the hook (4), the year table (7) | slide 10, the graph and the predicted ₹464.10 |
| 2 Deriving the compound interest formula | 4MAT | the multiplier (11 row 1), after 1 year (11 row 2) | `CI = A − P` on ₹1,000 (11) |
| 3 Calculating the amount and the interest | Merrill | direct question (12), the race rules (13) | the race rounds and task 4 (13, 15) |
| 4 Finding the principal, rate or time | Merrill | slide 16's problem, the rearranged formula | slides 17, 18 worked by the room |
| 5 Solving placement question models | Merrill | slide 20's problem, its timeline | slides 21 to 24 |

## Slides

| # | id | Type | Source card | Presses |
|---|---|---|---|---|
| 1 | welcome | `BrandSlide` | Welcome | 0 |
| 2 | recap | `RecapBrand` (stepped) | Where We Left Off | 3 points |
| 3 | recap-bug | `Panel` + `RecapBug` | Recap of simple interest | 3, `Show me` |
| 4 | hook | `Panel` + `SavingsHook` (phone) | Two friends, the same money, the same rate | 5 |
| 5 | todays-session | `WelcomeSlide minimal` | Compound Interest | 0 |
| 6 | agenda | `AgendaSlide` (static, rule 44) | Agenda, 5 points | 0 |
| 7 | how-it-works | `Panel` + `YearTable` | The interest is added to the principal every year | 4 |
| 8 | basic-terms | `Panel` + `BasicTerms` | Principal, rate, time, compound interest and amount | 6 |
| 9 | pia | `Panel` + `PrincipalOrAmount` | Principal, interest or amount? | 8 (question, answer, ×4) |
| 10 | interest-time | `Panel` + `GrowthGraph` | Compound interest grows faster every year | 6 |
| 11 | formula | `Panel` + `FormulaBuild` | Building the formula | 5 |
| 12 | direct | `Panel` + `WorkedSteps` | Calculating compound interest and the amount | 6 |
| 13 | race | `Panel` + `PascalRace` | Multiplier method vs. Pascal's triangle method | 8 |
| 14 | frequency | `Panel` + `Frequency` | Half-yearly and quarterly compounding | 4 |
| 15 | split-rate | `Panel` + `SplitRate` | Half-yearly and quarterly compounding (task 4) | 8 |
| 16 | find-p | `Panel` + `WorkedSteps` | Rearrange the formula to find P | 6 |
| 17 | find-r | `Panel` + `WorkedSteps` | Rearrange the formula to find R | 6 |
| 18 | find-t | `Panel` + `WorkedSteps` | Find T from the multiplier | 6 |
| 19 | classroom-quiz | `QuizTimeSlide` | Classroom Quiz | 0 |
| 20 | changing-rates | `Panel` + `Timeline` | A different rate for each year | 6 |
| 21 | years-months | `Panel` + `Timeline` | When the time is not a whole number of years | 5 |
| 22 | ci-si | `Panel` + `TwoMethods` | The difference between compound and simple interest | 6 |
| 23 | sum-first | `Panel` + `TwoMethods` | Find the sum from the CI, then use it | 6 |
| 24 | installments | `Panel` + `Installments` | Paying back a loan in equal installments | 6 |
| 25 | takeaways | `Panel` + `Takeaways` | Six key takeaways: compound interest | 7 |
| 26 | feedback | `FeedbackEmbedSlide` (rule 41) | Feedback | 0 |
| 27 | thank-you | `ThankYouSlide` | Thank you | 0 |

## Real calculations (Python 3, 2026-10-07)

| Slide | Check | Result |
|---|---|---|
| 3 | 6000 × 8 × 0.75 ÷ 100 ; 6000 × 9 × 8 ÷ 100 | 360 ; 4,320 |
| 4, 7 | 1000 × 1.1ⁿ, n = 1..3 ; 1000 × 1.1¹⁰ ; 1000 + 10 × 100 | 1,100 / 1,210 / 1,331 ; 2,593.74 (shown ₹2,594) ; 2,000 |
| 9 | 5000 × 1.21 ; 8000 × 1.05² − 8000 ; 4840 ÷ 1.21 ; 6000 × 1.21 | 6,050 ; 820 ; 4,000 ; 7,260 |
| 10 | 1000 × 1.1⁴ − 1000 | 464.10 |
| 12 | 5000 × 1.08² ; − 5000 ; 5000 × 8 × 2 ÷ 100 | 5,832 ; 832 ; 800 |
| 13 | 1000 × 1.1³ ; 8000 × 1.05³ | 1,331 ; 9,261 |
| 14 | 3000 × 1.2 ; 3000 × 1.1² ; 3000 × 1.05⁴ | 3,600 ; 3,630 ; 3,646.52 |
| 15 | 8000 × 1.05² ; 4000 × 1.1² | 8,820 ; 4,840 |
| 16 | 4840 ÷ 1.21 ; 840 ÷ 0.21 | 4,000 ; 4,000 |
| 17 | 7290 ÷ 6250 ; 1.08² | 1.1664 ; 1.1664 |
| 18 | 6655 ÷ 5000 ; 5000 × 1.1ᵏ | 1.331 ; 5,000 → 5,500 → 6,050 → 6,655 |
| 20 | 10000 × 1.1 × 1.2 | 13,200 |
| 21 | 10000 × 1.21 ; 12100 × 10 × ½ ÷ 100 | 12,100 ; 605 ; 12,705 |
| 22 | CI ; SI ; 10000 × 0.1² | 2,100 ; 2,000 ; 100 |
| 23 | 410 ÷ 0.1025 ; 4000 × 4 × 3 ÷ 100 | 4,000 ; 480 |
| 24 | 2541 ÷ 2.1 ; (2310 − 1210) × 1.1 | 1,210 ; 1,210 |

## Flagged: where a rule changed the source

| Slide | Source | Here | Rule |
|---|---|---|---|
| 4 | app header `PhonePe · Savings` | `Savings`; PhonePe stays in the lead sentence | course R5, content rule 12: no hand-drawn product name or mark in a drawn screen, and the asset library has no PhonePe mark |
| 6 | title `What We Will Cover` under kicker `Agenda` | mark reads `Agenda` over the session name | content rule 39 |
| 6, 25 | 5 agenda items; takeaways are the six examples | both kept as the source has them | content rule 20 (agenda verbatim in the takeaways, at most four items) not applied, as sessions 18 and 19 kept their reference's takeaways |
| 19 | the reference's quiz frame | the Simple Interest deck's quiz slide (`16_simple_interest`, its slide 16): kicker, title, subtitle and three steps | the user's word, 2026-10-07, overriding content rule 28 for this deck |
| 8 | title `Principal, rate, time, compound interest and amount` | `Principal, rate, time, interest and amount` | content rule 35: the title wrapped at 34px Poppins |
| 22 | title `The difference between compound and simple interest` | `The difference between CI and SI` | content rule 35, the same; CI and SI are defined on slide 8 |
| 2 | first point shown on entry | all three points arrive one per press | the kit's stepped `RecapBrand`; same words, one extra press |
| every reveal panel | `Reset` button | `Replay` | session 18's controls |
| 9 | 0:20 timers start by themselves | start on the instructor's press | session 18 decision 5 |
| all | trailing full stops | removed; two-sentence lines split | content rule 36 |
| all | header worksheet tag top-right | first block in the body | content rule 32: the header holds kicker and title only |
| 26 | kit-style feedback card | session 18's feedback slide, copied exactly | content rule 41 |

Wording the source uses that content rule 26 would question, **kept** because
the brief forbids rewording and each is the term the placement questions use:
`per annum`, `p.a.`, `vs.` in slide 13's title. Listed so the user can decide.

## Changes, 2026-10-07 (user)

- Slides 7, 8, 10, 11, 14: body centred vertically between y 221 (the video box's floor) and y 635 (the top of the Next / Replay row), `Panel centered`. The kit's `center` mode centres on y 434 and pushed slides 8 and 10 into the controls, so it was not used.
- Slides 16, 17, 18, 22, 23, 24: lead and body moved 28px down, `Panel drop={28}`; lowest content now ends at y 626 (slide 24), above the controls.
- Slide 19: replaced by the Simple Interest deck's quiz slide.
