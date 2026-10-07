<!-- cSpell:ignore NxtWave devPort Teja Rahul Priya Amma -->
# Python · Session 22: "Functions"

**STATUS: SIGNED OFF 2026-10-07** (user: *"Create the slide deck for Session 22
(Functions), following the same approach, structure, and design standards used
for Sessions 19, 20, and 21 … Proceed directly to generation after the plan. Do
not wait for approval unless the spec has a blocking ambiguity"*, and *"go
ahead and create don't wait for me"*). No ambiguity below is blocking; each is
decided and flagged. The deck was generated from this plan in the same run.

| | |
|---|---|
| `SESSION_NAME` | `Functions` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/22_functions_session_spec.json` (every program, output, press, trace step and game round) and `22_functions_session_spec.html` (the same spec as a reading page, with 35 thumbnails of the original deck's slides 12 to 48). **24 beats, 28 cards, 75 minutes** |
| Quiz reference | `prog_foundations_LP/17 - Loop Control Statements/…_student_view_new_design.html`, card 17 ("Classroom Quiz"), rendered and looked at |
| Project | `Outputs/python/22_functions/` (copied from session 21's project, its kit and player files unchanged) |
| Deck file | `src/decks/functionsDeck.tsx` |
| Slide count | **28**, one per card, in the spec's order |
| `devPort` | `5251` |
| `htmlName` | `python-session-22-functions` |

## The one idea

A function is a named block written once. `def` only stores it; a call runs
it, by jumping into the block and coming back. An argument sends a value in,
and `return` hands a value back out.

## Decisions

All carried from sessions 19 to 21 unless marked new.

1. **One slide per spec card, all 28, in the spec's order.** Spine cards are
   kit slide types (`BrandSlide`, `RecapBrand`, `WelcomeSlide minimal`,
   `AgendaSlide`, `ClassroomQuiz`, `FeedbackEmbedSlide`, `ThankYouSlide`);
   every other card is a session figure on `Panel` whose presses are the
   build steps, with `Next`. Each content slide carries `data-spec` and
   `data-presses` with the spec's `press_count`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` from the JSON; every program, output, trace step,
   caption, option, why line and takeaway comes from it.
3. **The spec's keys work**: `figures/keys.ts` (→ / ← one press, F, A, End,
   vote keys 1 to 4), unchanged from 21.
4. **The agenda is static** (content rule 44). The four stops and their lines
   are the spec's.
5. **The feedback slide is the standard one** (content rule 41).
6. **Exact words, content rule 36**: the spec's words kept, the trailing full
   stop dropped, a two-sentence line split onto two lines. Code, outputs and
   error text keep their own punctuation.
7. **Every code panel says `Python`** (content rule 31); the spec's file names
   are not shown, which also keeps spec rule 4.
8. **Template colours only** (content rule 37). The drawn video call keeps its
   own screen green inside the phone, as 21 kept the chat app's.
9. **One picture for the whole session (new, spec note 5)**: `figures/call.tsx`.
   A call is a jump: an orange dashed arrow in the code's left gutter from the
   call line up to the `def` header, and on the way back a second arrow from
   the block down to the call line. The call line stays marked (amber,
   `waiting`) while the block runs. A call opens the function's own area
   (dashed, named `greet`) beside the program's area; boxes made in the call
   live there and vanish the moment the call ends, with no ghost. The same
   engine drives E1, C8, C9, C11, C12 and G1, from the spec's `steps`.
10. **Votes are clickable, keys 1 to 4 mark them, `Next` is never gated.**
    Confetti when the marked pick was right. Timers are the kit's
    `Countdown`, started by the instructor: 5:00 (T1), 6:00 (T2), 2:30 (X1).
11. **Takeaways are the spec's six examples** (K1).
12. **The recap card carries three points** from session 21's content.
13. **Every output is a real run** on CPython 3.12.3, table below.
14. **Autoplay (new, decided)**: session 21's controls carry an Autoplay
    switch beside Next (user, 2026-10-07, for 21). The spec's rule 1 says
    "No autoplay. Nothing moves on a timer", so this deck keeps the switch
    for a matching control bar and **opens every slide with it off**.
15. **The quiz slide is session 21's `ClassroomQuiz`**, the rebuild of the
    reference's card 17, unchanged: kicker `Quiz time`, title `Classroom
    Quiz`, the line, three numbered steps, the tilted quiz card with B ticked,
    the mascot. Only `S-QUIZ` is the classroom quiz; S-RECAP is a find-the-bug
    card and keeps the spec's bug format.
16. **Git is not touched**: the shared checkout is mid-merge on another
    branch; this folder and its plan folder stay untracked until the user says.

## Frameworks (gate check 1)

| Agenda stop | Framework | S / Why | T / What | A | R / close |
|---|---|---|---|---|---|
| 1 Define | **STAR** | slide 4 (the same song three times in one night) and slide 7 press 2 (12 of 15 lines are the song) | slide 7 press 4 (a function is a reusable block), slide 8 (header, block, name) | slide 9 (defined is not run) | slide 9 press 3: the block runs only when called |
| 2 Call | **STAR** | slide 10 press 1 (how do we start the block?) | slide 10 (`function_name()`), slide 11 (the jump, one move per press) | slide 12 (task 1), slide 13 (define first), slide 14 (the machine) | slide 14's verdicts, the quiz |
| 3 Pass a value | **STAR** | slide 16 (at Rahul's party it sings dear Teja; 180 lines for 60) | slide 17 (`def function_name(args):`, `word=name`) | slide 18 (Teja, then Rahul), slide 19 (msg stays inside) | slide 19's NameError |
| 4 Return a value | **STAR** | slide 20 (shout it or hand it over) | slide 21 (`return value`, the value travels back) | slide 22 (after return), slide 23 (task 2), slide 24 (built-ins) | slide 25 exit, slide 26 the six examples |

## Term ledger (gate check 2)

| Term | Introduced | Plain words given there |
|---|---|---|
| one named block, started by its name | 4, press 6 | the song card (not yet named) |
| function | 7, press 4 | a block of reusable code that does one job |
| `def function_name():`, header, block | 8 | def is short for define; the block is indented 4 spaces |
| call, `function_name()` | 10, press 2 | the name and brackets start the block |
| `NameError` | carried in (session 3 and on); re-met on 12 | Python has not met the name yet |
| argument, `word=name` | 16, press 5; 17 | the slot the value goes into |
| a variable made inside stays inside | 19 | can only be used inside the function |
| `return` | 20 (picture), 21 (code) | hands the value back to the line that called |
| built-in function | 24 | functions Python wrote for us |
| `input()`, `print()`, `len()`, `for`, `if` | carried in | used on 11, 23, 24 |

Nothing arrives assembled (gate check 3): the def shape gains one label per
press (C2), the calls arrive after the shape (C4), every trace is one line per
press, the three defs collapse into one only on H2's last press, and the
takeaways fill one slot per press.

## Outputs, all real runs (CPython 3.12.3, 2026-10-07)

Every program in the JSON with an output, plus G1's five rounds, X1's three
line 8s and T2 at ₹7, was executed with its input: 36 of 36 match
(`scripts/run-spec-programs.py`).

| Program | Output |
|---|---|
| S-RECAP challenge · fixed | `1 6 / 2 6 / 3 6` · `1 6 / 2 5 / 3 4` |
| C1 party_long · C4 party_short | the same 15 lines |
| C3 greet · E1 greet_call · C5 greet_before | `Teja` · `Hello / Teja` · `NameError: name 'greet' is not defined` |
| T1 party · twice · moved | 4 lines · 6 lines · `Cake time!` then `NameError: name 'birthday_song' is not defined` |
| G1 rounds 1 to 5 | as the spec's answers; round 5 prints nothing |
| H2 long and short | the same 6 lines |
| C7/C8 greet_word · greet_twice | `Hello Teja` · `Hello Teja / Hello Rahul` |
| C9 msg_outside | `NameError: name 'msg' is not defined` |
| C11 greet_return · C12 after_return | `Hello Teja` · nothing |
| T2 icing_done (×5 · ×7) | `85 / 35` · `119 / 49` |
| C13 len | `4` |
| X1 three line 8s | `Happy birthday Teja` · nothing · `NameError: name 'msg' is not defined` |

## Slide by slide

`P` = a session figure on `Panel`. The kicker is the agenda stop; the title is
the spec's heading. Q = quiz format from the slide 17 reference.

| # | Card | Title | Content type | Presses |
|---|---|---|---|---|
| 1 | S-WELCOME | Welcome | `BrandSlide` | 0 |
| 2 | S-RECAP-CARD | Where We Left Off | `RecapBrand`, three points from 21 | 0 |
| 3 | S-RECAP | Which line is to blame? | P `RecapBug`: story, program, input, it prints vs we wanted, culprit, fix | 3 |
| 4 | H1 | It is Teja's birthday | P `SongHook`: phone clock, cake, timeline, video call, 12 lines fold into one card | 6 |
| 5 | S-TITLE | Functions | `WelcomeSlide minimal` | 0 |
| 6 | S-AGENDA | Agenda | static `AgendaSlide` | 4 (static) |
| 7 | C1 | Write it once? | P `WriteOnce`: party_long, three lit groups, definition | 4 |
| 8 | C2 | Defining a function | P `DefShape`: header, block, name labels, song.py | 5 |
| 9 | C3 | Defining a function | P `NoHello`: vote A/B, output, line 2 greys | 3 |
| 10 | C4 | Calling a function | P `CallIt`: the shape, two calls with arrows, party_short | 3 |
| 11 | E1 | Follow the call | P `FollowCall`: vote A/B/C, 7 trace moves, the route | 9 |
| 12 | T1 | The party screen | P `Task1`: story, party.py, steps, 5:00, the NameError | 4 |
| 13 | C5 | Defining and calling | P `DefineFirst`: greet_before, line 2 red, NameError | 3 |
| 14 | G1 | What does the party screen show? | P `PartyMachine`: 5 rounds, TV, marker, jumps, verdicts | 35 |
| 15 | S-QUIZ | Classroom Quiz | **Q** `ClassroomQuiz` | 0 |
| 16 | H2 | Next week: Rahul's birthday | P `OneSongHook`: TV, wrong name, three defs, counters, argument | 5 |
| 17 | C7 | Function with arguments | P `Arguments`: `?`, `def function_name(args):`, labels | 3 |
| 18 | C8 | Function with arguments | P `TejaRahul`: two calls, each one move | 3 |
| 19 | C9 | Variables inside a function | P `MsgInside`: vote, 7 moves, rule | 9 |
| 20 | C10 | Shout it, or hand it over? | P `Bakery`: counter, way A, way B, both | 4 |
| 21 | C11 | Returning a value | P `ReturnMsg`: shape, labels, 8 moves | 10 |
| 22 | C12 | Returning a value | P `AfterReturn`: vote, 7 moves, exit arrow, (nothing) | 9 |
| 23 | T2 | The icing bill | P `Task2`: icing.py with gap, 6:00, two cakes, ₹7 | 5 |
| 24 | C13 | Built-in functions | P `BuiltIns`: four slots, len runs | 3 |
| 25 | X1 | The empty party screen | P `ExitWish`: wish.py, three options, 2:30, reveal | 2 |
| 26 | K1 | Today, in six examples | P `Takeaways`: six slots, one per press | 6 |
| 27 | S-FEEDBACK | Feedback | `FeedbackEmbedSlide` | 0 |
| 28 | S-THANKYOU | Thank you | `ThankYouSlide` | 0 |

## Gaps and ambiguities in the spec, and what was decided

None blocks generation.

- **No card C6.** The spec's ids go C5, G1, S-QUIZ, H2, C7: there is no C6.
  The 28 cards are built as listed; nothing is invented to fill the number.
- **No section dividers.** Session 21's spec had divider cards; this spec has
  none, so this deck has none (one slide per card).
- **The agenda's per-press stops** contradict content rule 44; static.
- **Autoplay** (decision 14): the switch is present, off on every slide.
- **Content rule 18** wants the last quiz frame before the takeaways; the spec
  puts the classroom quiz at minute 35. The deck follows the spec, as 19 to 21.
- **Content rule 20** (takeaways restate the agenda) is overridden by the
  spec's example board (K1), as 19 to 21.
- **Build contract 1** (no network) is broken by the feedback frame only.
- **C8 and T2 "as one move"**: a press that plays several small movements
  (a box appears, the output fills, the boxes vanish). Played inside the
  press, only when the press is reached going forward (spec G1 must_not:
  "movement inside one press is fine").
- **H1's video call** is a drawn phone with a green call screen and Amma's
  tile, no app mark (content rule 12: no WhatsApp logo in the asset library).
- **Defect, slide 53** (the daily challenge uses `get_list(string_a)`): not
  projected, per the spec; it belongs to the guide.
- **The `(nothing)` output** (C12, G1 round 5, X1) is drawn as an empty output
  panel carrying the words `(nothing)` in grey, as the spec's defect note asks.
- **C12's `greeting` box**: the spec's way-back step leaves `greeting` out of
  `main` while its caption says `greeting = 'Hello Teja'`; the box is drawn
  from the caption, as on C11.

## Verification, 2026-10-07 (dev server port 5251, built file from `file://`)

| Check | Result |
|---|---|
| all 36 spec programs and variants on CPython 3.12.3 | every output matches the spec |
| `npm run typecheck`, `npm run build:html` | clean; `dist-single/python-session-22-functions.html`, 3.0 MB, self-contained |
| `video-safe.mjs` (slides 1 to 27) | 1 of 27: slide 15, the quiz card, which sits where the slide 17 reference puts it (decision 15) |
| `qa.mjs` (1 to 27) | slide 1 `NO LOGO` (baseline) and slide 15's background bleed; type-floor warnings are the drawn scenes, the TV options and the takeaways' small code, as 19 to 21 accepted |
| `align-check.mjs` | slides 9, 11, 26: an option or output that is two lines on purpose (`Hello` / `Teja`) and K1's NameError wrapping in its box; slide 15: the quiz slide's decorative glows |
| `mixed-align-check.mjs` (1 to 26) | 0 of 26 |
| `spec-check.mjs` | first open is steps mode, → and ← one press, End lands on G1's last press, key 2 marks B, A opens the picker, all 21 cards with presses carry the spec's `data-presses`, only network host `docs.google.com`, 0 page errors |
| `gesture-check`, `agenda-check`, `feedback-check`, `ligature-check` | all passed; feedback is an exact copy of session 18's |
| `overlap-check.mjs` | one finding, slide 1 (the kit's Welcome sparkle), the same as session 21's |
| `nav-stress-check.mjs` | clean in Chromium and Firefox at 4 sizes; WebKit not run |
| reveal-step map | every card's steps = its press count minus 1 (G1: 34) |
| every card | screenshots looked at, at its key presses; fixed on the way: the hook's lyrics over the candles, its three-line caption under Next and its tag arrows starting short of the tags, figure labels wrapping, C4's caption under Next, G1's verdict lines under Next, T1's and T2's columns under Next, H2's clipped line 3 and counters, the variable boxes overflowing the call area, the token ring missing on first mount and across highlighter spans, C11's labels under the call area, C12's exit arrow over the call area, C10's bubble over Rahul, slide 8's clipped code, K1's sentence overflow, `!` splitting a sentence |
