<!-- cSpell:ignore NxtWave devPort Teja Amma Appa Kiran -->
# Python · Session 24: "Built-in Functions"

**STATUS: SIGNED OFF 2026-10-07** (user: *"genrate the slides as you genrtaed
like 19,20,21 … plan it and procceed with it and also don't wait for me just
do it"*). Nothing below blocks. Each open question is decided here and marked.
The deck was generated from this plan in the same run.

**REVISION 2026-10-07 (spec revision, `…_spec 1(new).json` / `.html`).** The
user asked for the deck to be brought in sync with the revised spec: missing
content added, changed wording updated to the spec exactly, everything else
kept. What changed: the world is now exam week for Ravi (H1 is Ravi's notebook
and Priya's xerox, six presses; every first-half program uses `add_unit`,
`ravi` and the units; the second half uses Ravi's screen time minutes); a new
card **G2, Inside the built-in** (27 presses) sits between C6 and T2, so the
deck has **23 slides**; K1 is now **12 presses** (code, then result); C3 gains
the new-phone analogy; C4 to C6 gain the pointer, the keeping box and the new
row. The tables below describe the first build; where they name Teja, Ram,
contacts or `add_item`, the revised spec and the deck win.

| | |
|---|---|
| `SESSION_NAME` | `Built-in Functions` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/24_built_in_functions_session_spec.json` (every program, output, press, trace step and game round) and `24_built_in_functions_session_spec.html` (the same spec as a reading page, with 16 thumbnails of the original deck's kept slides). The pedagogy team's spec, not a finished deck: **22 beats, 22 cards, 75 minutes** |
| Project | `Outputs/python/24_built_in_functions/` (scaffold copied from session 21) |
| Deck file | `src/decks/builtInsDeck.tsx` |
| Slide count | **22**, one per card, in the spec's order |
| `devPort` | `5254` |
| `htmlName` | `python-session-24-built-in-functions` |

## The one idea

A function handed a list works on that same list, so `+=` inside it changes
your list. Python's ready-made functions `min`, `max`, `sum` and `sorted` give
back a new answer and leave your list alone.

## Decisions

These carry over from sessions 19 to 22 unless marked new.

1. **One slide per spec card, all 22, in the spec's order.** The spec has no
   divider cards, so none are added (as in 22). Spine cards use kit slide
   types: `BrandSlide`, `RecapBrand`, `WelcomeSlide minimal`, the static
   `AgendaSlide`, `ClassroomQuiz`, `FeedbackEmbedSlide` and `ThankYouSlide`.
   Every other card is a session figure on `Panel`, and its presses are build
   steps. Each body carries `data-spec` and `data-presses` set to the spec's
   `press_count`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` from the JSON.
3. **The spec's keys work** (`figures/keys.ts`): → and ← move one press, F is
   full screen, A shows all cards, End shows the whole card, and keys 1 to 4
   mark a vote.
4. **The agenda is static** (content rule 44). It has three stops, using the
   spec's words.
5. **The feedback slide is the standard one** (content rule 41).
6. **Exact words, content rule 36.** The spec's words are kept. The full stop
   at the end of a line is dropped, and a line with two sentences is split
   into two lines. Code, outputs and error text keep their own punctuation.
7. **Every code panel says `Python`** (content rule 31). The spec's file names
   are not shown.
8. **Template colours only** (content rule 37). The drawn Contacts app, the
   screen time chart and the number plate keep their own screen colours
   inside the phone or plate.
9. **One picture for the first half (spec note 5, new engine
   `figures/scope.tsx` on session 20's `memory.tsx`).**
   - A name is a dark tag with an arrow to a list.
   - The call opens an area named `Inside add_item` beside the code. Its tag
     (`list_x`) lives there and goes when the call ends.
   - Lists sit in one shared column named `lists`, outside both areas.
   - A list that no arrow points at vanishes at once, with no grey ghost.
   - A default list sits on the def's own shelf (`add_item's default`) from
     the def press on, and never leaves.
   - Every frame is read from the spec's `steps` (`names`, `lists`,
     `defaults`, `printed`).
10. **Votes are clickable, keys 1 to 4 mark them, and `Next` is never gated.**
    Confetti plays when the marked pick was right. The timers are the kit's
    `Countdown`, started by the instructor: 6:00 (T1), 7:00 (T2) and 2:30
    (X1).
11. **Controls and autoplay follow generate-slides section 2** (a standing
    rule recorded on 2026-10-07, during this build, from session 23). Session
    23's `controls.tsx` and `autoplay.ts` are copied unchanged: Next plus an
    icon-only Autoplay button, small and low, pacing 2.5s per step. Autoplay
    opens ON for slides 3, 4, 7, 13, 14, 15 and 20 (8, 11, 16 and 17 turned
    off on the user's word, 2026-10-07) (the recap,
    both hooks, the walks, the concept cards and the takeaways), which are the
    kinds of card session 23 opens on, overriding the spec's rule 1 as the
    user did there. The tasks, the game and the exit (9, 10, 18, 19) open
    off. Phones are drawn without the island (the same revision).
12. **The quiz slide** is session 21's `figures/ClassroomQuiz.tsx`, unchanged.
13. **Takeaways are the spec's six examples** (K1). The first three carry the
    arrow picture from C1, small.
14. **The recap card** carries three points from session 23: a default fills
    an argument we leave out, one value by position goes to the first
    parameter, and a function gets its own copy of a number.
15. **Spoken-only content from the cut slides** goes in the notes: the
    practice set and the daily challenge (squares with `sorted`) as homework.
    The next session is not named (spec defect: slide 50 names a session the
    timetable does not have).
16. **Git is not touched.** The shared checkout carries other sessions' work
    on the current branch (22 and 23 are in progress), so this folder and its
    plan folder stay untracked until the user says otherwise.

## Slides, controls and presses

| # | Card | Slide | Built from | Presses |
|---|---|---|---|---|
| 1 | S-WELCOME | Welcome | `BrandSlide` | 0 |
| 2 | S-RECAP-CARD | Where We Left Off | `RecapBrand`, three points | 0 |
| 3 | S-RECAP | What will it print? | three face-down tiles, each lit and then turned | 7 |
| 4 | H1 | Give me your phone. | Teja's phone, Contacts app; Ram's phone; two labels on one phone | 5 |
| 5 | S-TITLE | Built-in Functions | `WelcomeSlide minimal` | 0 |
| 6 | S-AGENDA | Agenda | static `AgendaSlide`, three stops | 0 (spec 3, rule 44) |
| 7 | C1 | Passing a list | code, then the scope picture, then six walked steps, then output; vote A / B | 9 |
| 8 | C2 | One change on line 2 | same picture, and a second list appears; vote A / B | 8 |
| 9 | T1 | Ram saves his number | story, code, three steps, 6:00 timer, then three results on a small Contacts screen | 6 |
| 10 | G1 | Does Teja's list change? | `save_number` with blank line 2, six case chips, two bins with small Contacts screens; intro and then six rounds of ask, sort and verdict | 19 |
| 11 | E1 | A list as a default value | code, the def's shelf, the call area and the shared lists; vote A to D; 13 steps; final ring | 15 |
| 12 | S-QUIZ | Classroom Quiz | `ClassroomQuiz` | 0 |
| 13 | H2 | Teja's screen time | phone screen time bars; a finger scans the bars; the long program; it collapses to one line | 4 |
| 14 | C3 | Built-in functions | four known functions, the label, four new ones with arrows | 3 |
| 15 | C4 | Finding the smallest | the two forms of min, then four programs in turns, each output after the room says it, ord values lit, then max | 10 |
| 16 | C5 | Finding the total | the form of sum, vote 5 / 9 / -2, the TypeError, then Teja's week with the bars | 5 |
| 17 | C6 | Ordering list items | form, vote, two lists side by side, `reverse=False` labelled Default value, then reverse | 5 |
| 18 | T2 | The lucky number plate | Indian plate, lines 1 to 5 with 6 to 8 dashed, steps, 7:00 timer; reveal | 6 |
| 19 | X1 | Teja plans a no-phone day | `plan.py`, blank line 2, four options, 2:30; then every option's output and why | 2 |
| 20 | K1 | Today, in six examples | six slots, empty from press 1 | 6 |
| 21 | S-FEEDBACK | Feedback | `FeedbackEmbedSlide` | 0 |
| 22 | S-THANKYOU | Thank you | `ThankYouSlide` | 0 |

The agenda's spec press count (3) is not carried, because content rule 44
wins. That slide carries `data-spec="S-AGENDA"` with `data-presses="0"`, as
in 20 and 21.

## Frameworks (gate check 1)

The session has two halves, which are the agenda's stops 1 and 2. Stop 3 is
the task that applies both.

| Agenda stop | Framework | S / Why | T / What | A | R / close |
|---|---|---|---|---|---|
| 1 Passing a list | **STAR** | slide 4 (hand your phone to a friend: does the change come back? a copy does not) and slide 7 press 2 (what will it print?) | slide 7 (two names, one list, `+=` changes it in place), slide 8 (`+` makes a new list and only `list_x` moves) | slide 9 (task 1), slide 10 (sort six line 2s), slide 11 (a default list made once) | slide 11's `[3, 3]`, then the quiz |
| 2 Built-in functions | **STAR** | slide 13 (busiest day the long way: 5 lines for one number) | slide 14 (functions Python already wrote), 15 (`min`, `max`), 16 (`sum`), 17 (`sorted`, `reverse=True`) | slide 16's Teja's week, slide 17's two lists | slide 17's unchanged `list_a` |
| 3 Code walkthrough | **Merrill** (apply, integrate) | slide 18 (an uncle's plate digits for luck) | the three built-ins on a list the program collects | slide 18 (task 2, my notes' bug), slide 19 (exit: both halves) | slide 20, the six examples |

## Term ledger (gate check 2)

| Term | Introduced | Plain words given there |
|---|---|---|
| two names, one thing | 4, press 5 | one phone, two hands on it (no code word) |
| a name points at a list | carried in (session 20) | re-drawn on 7, press 1 |
| passing a list to a function | 7 | `list_x` points at the caller's own list |
| mutable | 7, press 9 (said once) | a list can change in place |
| `+` makes a new list | carried in (session 20) | re-read on 8 |
| default argument | carried in (session 23) | re-used on 11 and 17 |
| default list made once | 11 | made when the def runs, not every call |
| built-in function | 14, press 2 | ready in Python, just call them |
| `min`, `max` | 15 | the smallest, the largest |
| Unicode value, `ord` | carried in (session 18) | used on 15: P 80, J 74, T 84, r 114 |
| `sum` | 16 | the total of all items in a list |
| `TypeError` | carried in | used on 16 and 18 |
| `sorted`, `reverse=True` | 17 | a new list in increasing order; biggest first |
| `input()`, `for`, `isdigit()`, `int()` | carried in | used on 18 |

Nothing arrives assembled (gate check 3). Every trace draws one step per
press (C1, C2, E1). The call area opens on the call line and closes when the
call ends. The long program collapses to one line in a single movement (H2).
The new built-ins arrive one press after the four known ones (C3). Lines 6 to
8 of the plate program fill only on the reveal (T2).

## Outputs, all real runs (CPython 3.12.3, 2026-10-07)

All 31 programs in the JSON match their stated outputs. The recap's three
tiles print `Hi Teja`, `Teja Ram` and `5`. G1's six line 2s print what each
caption says. X1's four options print `0 0`, `0 30`, `0 0` and `30 30`. The
hook's guide programs print `['Amma', 'Appa', 'Kiran', 'Ram']` and
`['Amma', 'Appa', 'Kiran']`. `ord`: P 80, J 74, T 84, r 114.

## Verification

Run `typecheck`, `build:html`, `video-safe`, `qa`, `align-check`,
`mixed-align-check`, `overlap-check`, `spec-check`, `feedback-check`,
`gesture-check` and `agenda-check`. Then screenshot every built card at step
0, mid-run and fully revealed.
