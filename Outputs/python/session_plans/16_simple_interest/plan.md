# Simple Interest · slide-wise plan

STATUS: generated under the user's brief of 2026-10-07 ("plan it and proceed,
don't wait for my confirmation"). Not separately signed off.

| | |
|---|---|
| Source | `Reference ppt's/16_simple_interest_student_view_new_design 7.html` (not modified) |
| Session project | `Outputs/python/16_simple_interest/` (devPort 5251) |
| Deck file | `src/decks/simpleInterestDeck.tsx` |
| Deliverable | `dist-single/16_simple_interest_converted.html`, copied to `Outputs/python/16_simple_interest_converted.html` |
| Style references | Python 18 (`18_comparing_strings_naming_variables`) and 19 (`19_lists`) |

## The brief

A format conversion, not a re-plan. The source's content is correct and
complete: every card, heading, sentence, formula, example, table, diagram,
note and step is carried, in the source's order, with its words unchanged.
Only the formatting changes, to this repo's rules and to sessions 18 and 19.

## Enumeration (generate-slides 6b)

The presenter's own list, `.slide, .pcard`: **27 cards**, matching the
reference counter `n / 27`. Walked with the forward key: **121 states**.
One deck slide per card; every reference state is one build step here.

## Decisions

1. **One slide per reference card, 27, same order.** The reference's
   "Reveal next / Reset" pair becomes session 18 and 19's `Next / Replay`
   (`figures/controls.tsx`), driven by the kit's build steps (`useBeats`), so
   the deck's own arrow keys walk every reveal exactly as the reference's
   forward key did. Recap card 3 keeps its own button name, `Show answer`.
2. **Every reveal keeps the reference's order and count** (its `data-s`
   markers). The first state of each card is the slide's entry state; each
   later state is one press. Nothing self-advances.
3. **Words unchanged; content rule 36 applied as layout only**: a line's
   trailing full stop is dropped and a two-sentence line is set as two lines.
   No word is added, removed or reordered. Formulas, numbers and the ₹ amounts
   are character for character.
4. **Template colours only (rule 37).** The reference's green / orange / blue
   chips map to the kit's `success` / `accent` / `brand` tokens, the same
   meaning on every slide: principal green, interest orange, amount blue.
5. **Kit chrome where the kit has a type**: `BrandSlide` (welcome),
   `RecapBrand` (recap), `WelcomeSlide minimal` (today's topic),
   `AgendaSlide` (rule 39, 44), `QuizTimeSlide` (as session 19 carries it),
   `FeedbackEmbedSlide` (rule 41), `ThankYouSlide`. Every activity panel is
   session 19's `Panel` (the kit's `ZonedFrame`), body in Space-1.
6. **Navigation** keyboard, trackpad and touch (`figures/gestures.ts`).
7. **Session-local figures** in `src/decks/figures/`, one per reference
   panel, sharing `si.tsx` (question lead, worked-step boxes, notes, chips).

## Slides

| # | id | Reference card | Type | States |
|---|---|---|---|---|
| 1 | welcome | Welcome | `BrandSlide` | 1 |
| 2 | recap | Recap · Where We Left Off | `RecapBrand`, one point per press | 3 |
| 3 | recap-discount | Recap of discount | Panel, three question cards, `Show answer` | 4 |
| 4 | bank-hook | Money in the bank for one year | Panel, phone (fixed deposit screen) + beats | 4 |
| 5 | todays-session | Simple Interest | `WelcomeSlide minimal` | 1 |
| 6 | agenda | Agenda, four points | `AgendaSlide` | 1 |
| 7 | year-by-year | The interest is the same every year | Panel, year table | 5 |
| 8 | five-terms | Principal, rate, time, interest and amount | Panel, bar + labels + three cards | 6 |
| 9 | interest-and-time | Interest grows in a straight line with time · Task 1 | Panel, line chart + working | 7 |
| 10 | building-the-formula | Building the formula SI = P × R × T ÷ 100 | Panel, five rows | 5 |
| 11 | si-and-amount | Calculating simple interest and the total amount | Panel, question + four worked steps | 6 |
| 12 | time-in-years | Convert the time into years first · Task 2 | Panel, table + example + your turn + 1:00 timer | 8 |
| 13 | find-p | Rearrange the formula to find P | worked steps | 6 |
| 14 | find-r | Rearrange the formula to find R | worked steps | 6 |
| 15 | find-t | Rearrange the formula to find T | worked steps | 6 |
| 16 | quiz | Classroom Quiz | `QuizTimeSlide` | 1 |
| 17 | two-amounts | Find the principal and rate from two amounts | timeline | 6 |
| 18 | doubles-triples | When a sum doubles or triples | P blocks | 5 |
| 19 | changes | How SI changes when P, R or T changes | table | 6 |
| 20 | difference | The difference between two simple interests | two methods | 6 |
| 21 | splitting | Dividing one principal between two investments | tree + equation | 6 |
| 22 | ratios | Equal interest from two different principals | two investments + working | 5 |
| 23 | changing-rates | Different rates for different periods | timeline | 5 |
| 24 | paying-back | Paying back part of the principal | year table | 6 |
| 25 | takeaways | Six key takeaways: simple interest · Task 3 | banner + six rows | 7 |
| 26 | feedback | Feedback | `FeedbackEmbedSlide` | 1 |
| 27 | thank-you | Thank you! | `ThankYouSlide` | 1 |

## Flags (where a rule and the source disagree, or no direct equivalent)

- **Agenda heading**: the source's mark reads `What We Will Cover`; rule 39
  makes the mark read `Agenda` over the session name. The four points are
  verbatim.
- **Hook phone**: the source's screen title `YONO · Deposits` names a real
  bank app. Course rule R5 keeps product names out of drawn UI; kept verbatim
  here because the brief forbids rewording. The user's call.
- **Slide 23 note** says `compound interest, the next session`; rule 2b
  bans "next session" outside the closing teaser. Kept verbatim; flagged.
- **Takeaways** are the source's six, not the agenda strings (rule 20), as
  sessions 18 and 19 kept their references' cards.
- **Quiz frame** keeps the source's subtitle and three steps, as session 19
  does (rule 28 says no subtitle).
- **Worksheet pills** (`Worksheet · Task 1/2/3`) sat top-right in the
  source, inside the speaker box; here they sit at the top of the slide's own
  side column.
- **Feedback** is the standard slide (rule 41), whose title and line are the
  same as the source's plus the QR, link and form.

## Built (2026-10-07)

27 slides, 124 states (the reference's 121 plus card 3's three `Show answer`
reveals). Typecheck clean; built file opens from `file://` with no console
errors; every step of every slide walked; harness results in the session's
`CLAUDE.md`, decision 7.
