<!-- cSpell:ignore NxtWave devPort Teja Ameerpet Kukatpally Charminar Rapido -->
# Python · Session 23: "Function Arguments"

**STATUS: SIGNED OFF 2026-10-07** (user: *"genrate a slides as you created with
the session 19,20,21 … read and plan and procced with the creation don't wait
for me"*). No ambiguity below is blocking; each is decided and flagged. The deck
was generated from this plan in the same run.

| | |
|---|---|
| `SESSION_NAME` | `Function Arguments` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/23_function_arguments_session_spec.json` (every program, output, press, step and round) and `23_function_arguments_session_spec(1).html` (the same spec as a reading page, with 17 thumbnails of the original deck's kept slides 10 to 47, looked at). **23 beats, 25 cards, 75 minutes** |
| Quiz reference | session 22's `figures/ClassroomQuiz.tsx` (the lesson plan's card 17), unchanged |
| Project | `Outputs/python/23_function_arguments/` (copied from session 22's project, its kit, player and harness files unchanged) |
| Deck file | `src/decks/argumentsDeck.tsx` |
| Slide count | **25**, one per card, in the spec's order |
| `devPort` | `5253` |
| `htmlName` | `python-session-23-function-arguments` |

## The one idea (the spec's)

A call fills a function's arguments by position unless we name them. A default
fills the ones we leave out. An argument is the function's own box, so
changing it does not change the variable outside.

## Decisions

All carried from sessions 19 to 22 unless marked new.

1. **One slide per spec card, all 25, in the spec's order.** Spine cards are
   kit slide types (`BrandSlide`, `RecapBrand`, `WelcomeSlide minimal`,
   `AgendaSlide`, `ClassroomQuiz`, `FeedbackEmbedSlide`, `ThankYouSlide`);
   every other card is a session figure on `Panel` whose presses are the
   build steps, with `Next`. Each content slide carries `data-spec` and
   `data-presses` with the spec's `press_count`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` from the JSON; every program, output, step, caption,
   option, why line and takeaway comes from it.
3. **The spec's keys work**: `figures/keys.ts` (→ / ← one press, F, A, End,
   vote keys 1 to 4), unchanged from 22.
4. **The agenda is static** (content rule 44): the spec's four stops and lines.
5. **The feedback slide is the standard one** (content rule 41).
6. **Exact words, content rule 36**: the spec's words kept, the trailing full
   stop dropped, a two-sentence line split onto two lines. Code, outputs and
   error text keep their own punctuation.
7. **Every code panel says `Python`** (content rule 31); the spec's file names
   are not shown (spec rule 4).
8. **Template colours only** (content rule 37). The Maps screens are drawn in
   tokens: white boxes, the brand blue for the route, the danger red for the
   pin. No Google or Rapido logo (content rule 12: not in the asset library).
9. **One picture for the whole session (new, spec note 5)**: `figures/slots.tsx`.
   An argument is a slot in the def's header. A value travels from the call
   line into its slot: it starts on its own word in the call line and flies up
   to the slot. Sent by name it wears its label (`arg_1=`, orange, dashed, as
   the deck's labels); sent by position it wears its number (`1st`, `2nd`,
   blue); filled by the def it wears `default` (grey). An empty slot that
   needs a value turns red. The same engine draws C1, C2, C3, C5, E1, C6, C7,
   C8 and the hook's last press.
10. **E2 uses session 22's call picture** (`call.tsx`, `Areas`): the call opens
    `Inside increment` with its own box `a`; it vanishes with its 6 when the
    call ends; no arrow between the two boxes (its must_not). Numbers show
    without quotes.
11. **Votes are clickable, keys 1 to 4 mark them, `Next` is never gated.**
    Confetti when the marked pick was right. Timers are the kit's
    `Countdown`, started by the instructor: 5:00 (T1), 6:00 (T2), 2:30 (X1).
12. **One world (spec note 2)**: `figures/Maps.tsx`, Teja's phone with the
    directions screen (start box with a hollow circle, end box with a red pin,
    the swap button, the bike chip, the route). H1, G1 and H2 use the same
    component, so "the app looks exactly like the hook's app" (G1 must).
    T2's fares sit on a ride card.
13. **Autoplay is off on every slide**, as 22 (spec rule 1).
14. **The quiz slide is session 22's `ClassroomQuiz`**, unchanged.
15. **Git is not touched**, as 21 and 22: the shared checkout belongs to
    another branch's work; this folder and its plan folder stay untracked
    until the user says.

## Frameworks (gate check 1)

| Agenda stop | Framework | S / Why | T / What | A | R / close |
|---|---|---|---|---|---|
| 1 By name | **STAR** | slide 4 (the swap button: same two places, opposite trip) | slide 7 (two slots, `arg_1=greeting`) | slide 8 (change the order) | slide 8 press 2: by name, the order does not matter |
| 2 By position | **STAR** | slide 9 press 1 (no names: where does each value go?) | slide 9 (1st to the 1st), slide 10 (two names for two ways) | slide 11 (swap), slide 12 (fill the slots), slide 13 (leave one out), slide 14 (task 1) | slide 15 (the app is broken), the quiz |
| 3 Default values | **STAR** | slide 17 (Your location, every time?) | slide 18 (four calls) | slide 19 (task 2) | slide 20 (defaults go last) |
| 4 Same name, two boxes | **STAR** | slide 21 press 1 (5 or 6?) | slide 21 presses 2 to 8 (two boxes named a) | slide 21 press 10 (return) | slide 22 exit, slide 23 the six examples |

## Term ledger (gate check 2)

| Term | Introduced | Plain words given there |
|---|---|---|
| function, `def`, call, argument, `return` | carried in (session 22) | recap, slide 3 |
| two slots in order, 1st and 2nd | 4, press 6 | the start and the end (no code words) |
| more than one argument | 7, press 1 | `def function_name(arg_1, arg_2):` |
| pass by name, `arg_1=greeting` | 7, press 3 | each value by its argument's name |
| by position | 9 | assigned according to their position |
| positional, keyword arguments | 10 | by place, by name |
| `TypeError: … missing … argument` | 13 | every argument needs a value |
| default value | 17, press 4 | a value written in the def |
| non-default after default, `SyntaxError` | 19 (met), 20 (named) | defaults go last |
| immutable, the inside box | 21 | same name, two different boxes |

Nothing arrives assembled (gate check 3): the header shows two empty slots
before any call; each value lands one per press on E1; the takeaways fill one
slot per press.

## Outputs, all real runs (CPython 3.12.3, 2026-10-07)

`scripts/run-spec-programs.py`: **40 of 40 match**, plus the three
`SyntaxError` programs (T2 my notes, C8 bad order, K1 example 5), which CPython
3.12 words `parameter without a default follows parameter with a default`.
The spec keeps 3.11's `non-default argument follows default argument` on
purpose (its defect note on slides 40, 41: the playground prints the old
wording), so the deck shows the spec's text. G1's three rounds and their fixed
programs were also run: round 1 and 2 print `Start: Ameerpet / End: Main
Gate`, round 3 the TypeError naming `start`; every fix prints `Start: Main Gate
/ End: Ameerpet`.

## Slide by slide

`P` = a session figure on `Panel`. The kicker is the agenda stop; the title is
the spec's heading.

| # | Card | Title | Content type | Presses |
|---|---|---|---|---|
| 1 | S-WELCOME | Welcome | `BrandSlide` | 0 |
| 2 | S-RECAP-CARD | Where We Left Off | `RecapBrand`, three points from 22 | 0 |
| 3 | S-RECAP | Prints something, or nothing? | P `SortRecap`: five chips, two bins, one chip per press | 6 |
| 4 | H1 | 5:30 PM. Class is over. | P `SwapHook`: Maps phone, typing replay, swap, two slots 1st 2nd | 6 |
| 5 | S-TITLE | Function Arguments | `WelcomeSlide minimal` | 0 |
| 6 | S-AGENDA | Agenda | static `AgendaSlide` | 4 (static) |
| 7 | C1 | More than one argument | P `TwoArgs`: header slots, greet_by_name, by-name fill | 3 |
| 8 | C2 | Change the order? | P `AnyOrder`: line 7, Same / Different, two equal lines | 2 |
| 9 | C3 | Without the names | P `ByPosition`: 1st, 2nd tags | 2 |
| 10 | C4 | Two ways to pass values | P `TwoWays`: header, two calls, two labelled arrows | 3 |
| 11 | C5 | Now swap them | P `SwapThem`: vote A to C, Ram Good Morning | 2 |
| 12 | E1 | Fill the slots | P `FillSlots`: vote, 16 moves, odd line ringed | 18 |
| 13 | C6 | Leave one out | P `LeaveOneOut`: red empty slot, three TypeErrors | 5 |
| 14 | T1 | The trip program | P `TripTask`: trip.py, steps, 5:00, route cards | 6 |
| 15 | G1 | Why is the trip wrong? | P `AppBroken`: three rounds, code beside the Maps app | 18 |
| 16 | S-QUIZ | Classroom Quiz | `ClassroomQuiz` | 0 |
| 17 | H2 | Does she type her start every time? | P `LocationHook`: Your location, the long way, the short way | 4 |
| 18 | C7 | Default values | P `FourCalls`: faint defaults, four calls, `default` tags | 9 |
| 19 | T2 | Rapido fares | P `FareTask`: fares.py, three steps, 6:00, my notes | 6 |
| 20 | C8 | Default values go last | P `DefaultsLast`: labels, SyntaxError, the slots trade places | 2 |
| 21 | E2 | Passing immutable objects | P `TwoBoxes`: vote, 7 moves, the ring, return | 10 |
| 22 | X1 | Teja is at Ameerpet | P `RightTrip`: trip_default, four options, 2:30 | 2 |
| 23 | K1 | Today, in six examples | P `Takeaways`: six slots | 6 |
| 24 | S-FEEDBACK | Feedback | `FeedbackEmbedSlide` | 0 |
| 25 | S-THANKYOU | Thank you | `ThankYouSlide` | 0 |

## Gaps and ambiguities in the spec, and what was decided

None blocks generation.

- **25 cards, not 26.** The beat list holds 25 cards; the deck has 25 slides.
- **H1 press 6** places Main Gate in the 1st slot and Ameerpet in the 2nd,
  though press 4 left the phone swapped. The phone swaps back first (Teja taps
  the button again, one movement inside the press), then the two boxes slide
  out into the row. No code words appear on the card.
- **G1's app**: each round opens on the wrong screen the spec describes
  (circled); the run then starts the app empty and fills its boxes only on the
  print steps (its must line); the verdict shows the fixed line and the right
  trip (`game_def.how`: "The verdict fixes the line and the app shows the
  right thing"), from the fixed programs run above.
- **C7's answer press** plays the call's fill steps inside one press (the
  spec's "Passed values land in their slots; … takes its default … The
  output"). The caption shows the two fill captions from the data.
- **C7 press 1** shows the program with line 6 empty: the spec says "line 6
  becomes greet()" on press 2.
- **The SyntaxError wording** is the spec's (3.11), see Outputs.
- **The agenda's per-press stops** contradict content rule 44; static.
- **Content rules 18 and 20** (last quiz before takeaways; takeaways restate
  the agenda) are overridden by the spec's order and its example board, as 19
  to 22.
- **Build contract 1** (no network) is broken by the feedback frame only.
- **S-WELCOME** passes the session name to `BrandSlide` as every deck does;
  no heading, caption or code card before the title names the topic (spec
  rule 4).
- **Defect, slides 6 to 7** (the daily challenge's positional call): not
  projected, per the spec.

## Verification, 2026-10-07 (dev server port 5253, built file from `file://`)

| Check | Result |
|---|---|
| spec programs on CPython 3.12.3 | 40 match; 3 SyntaxErrors in 3.12's newer wording (spec keeps 3.11's, on purpose); G1's rounds and fixes run |
| `npm run typecheck`, `npm run build:html` | clean; `dist-single/python-session-23-function-arguments.html`, 3.0 MB, self-contained |
| `video-safe.mjs` (1 to 24) | 1 of 24: slide 16, the quiz card, the reference's placement (as 22) |
| `qa.mjs` (1 to 24) | slide 1 `NO LOGO` and slide 16's background bleed (baseline); type-floor warnings are the drawn phone screens, recap chips and K1's small code, as 19 to 22 |
| `align-check.mjs` | slides 19, 22, 23: error lines and two-line inputs wrapping on purpose; slide 16: the quiz's decorative glows |
| `mixed-align-check.mjs` | 0 of 24 |
| `spec-check.mjs` | steps mode on first open, → and ← one press, End lands on G1's last press, key 2 marks B, A opens the picker, all 18 cards with presses carry the spec's count, only host `docs.google.com`, 0 page errors |
| `gesture-check`, `agenda-check`, `feedback-check`, `ligature-check` | all passed; feedback is an exact copy of session 18's |
| `overlap-check.mjs` | one finding, slide 1 (the kit's Welcome sparkle), as 21 and 22 |
| `nav-stress-check.mjs` | clean in Chromium and Firefox at 4 sizes; WebKit not run |
| reveal-step map | every card's steps = its press count minus 1 |
| every card | screenshots looked at, at key presses; fixed on the way: the hook's caption repeating the title, the Ameerpet label under the pin, the mode chips wrapping, value tags crowding their slots, C4's calls wrapping, C5's, T1's and T2's captions reaching Next, E1's slots too narrow (and centred, per mixed-align), K1's slots overflowing, H2's code jumping when the question appears |

## Revision, 2026-10-07 (user feedback after the first build)

1. **Controls, every slide**: Autoplay is an icon-only round Play button
   (▶ / ⏸, `aria-label` and tooltip `Autoplay`); it and Next are smaller
   (34px) and lower (bottom 14px above the frame's foot). A scripted check of
   every card at its first and last press finds nothing under either button
   (36 card states).
2. **Autoplay pace**: 2.5s per step, longer only while a step's own motion
   runs. Measured: 2.55s average per step over the 11 autoplay slides.
3. **Slide 3** opens with Autoplay on; its content is lifted 16px.
4. **Autoplay opens ON** on slides 3, 4, 7, 8, 9, 10, 13, 17, 18, 20 and 23,
   overriding the spec's rule 1 ("No autoplay") on the user's word. A press
   still pauses it; every other slide opens off.
5. **"Slide 5"'s phone** (the title slide has none; the user chose every phone
   in the deck): the dynamic island is removed from the shared Maps phone, so
   slides 4, 15 and 17 all lose it.

Items 1 and 2 are recorded as standing rules in
`.claude/skills/generate-slides/SKILL.md` section 2 (the user's choice).
Re-verified after the change: video-safe, qa, align and mixed-align unchanged
from the first build; spec-check, gesture-check all pass; overlap-check only
the slide 1 baseline.
