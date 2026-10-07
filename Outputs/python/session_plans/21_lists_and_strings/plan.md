<!-- cSpell:ignore NxtWave devPort Hampi Ooty Priya Kiran margorP progr mming ngu idli vada dosa -->
# Python · Session 21: "Lists and Strings"

**STATUS: SIGNED OFF 2026-10-07** (user: *"Create the slide deck for Session 21
(Lists and Strings), following the same approach, structure, and design
standards used for Sessions 19 and 20 … Proceed directly to generation after
the plan. Do not wait for approval unless the spec has a blocking
ambiguity."*). No ambiguity below is blocking; each is decided and flagged.
The deck was generated from this plan in the same run.

| | |
|---|---|
| `SESSION_NAME` | `Lists and Strings` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/21_lists_and_strings_session_spec.json` (every program, output, press, run step and game round) and `21_lists_and_strings_session_spec.html` (the same spec as a reading page, with 35 thumbnails of the original deck's slides 13 to 53). A spec from the pedagogy team, not a finished deck: **22 beats, 31 cards, 75 minutes** |
| Project | `Outputs/python/21_lists_and_strings/` |
| Deck file | `src/decks/listsStringsDeck.tsx` |
| Slide count | **31**, one per card, in the spec's order |
| `devPort` | `5250` |
| `htmlName` | `python-session-21-lists-and-strings` |

## The one idea

`split()` cuts one string into a list of pieces and `join()` glues a list of
strings back into one. A negative index counts from the end, and a negative
step walks a list or a string backwards.

## Decisions

All carried from sessions 19 and 20 unless marked new.

1. **One slide per spec card, all 31, in the spec's order.** Spine cards are
   kit slide types (`BrandSlide`, `RecapBrand`, `WelcomeSlide minimal`,
   `AgendaSlide`, `SectionBreakerSlide`, `QuizTimeSlide lesson`,
   `FeedbackEmbedSlide`, `ThankYouSlide`); every other card is a session
   figure on `Panel` whose presses are the kit's build steps, with `Next` /
   `Replay`. Each content slide's body carries `data-spec` and
   `data-presses` with the spec's `press_count`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` from the JSON; every program, output, run step, caption,
   option, why line and takeaway comes from it.
3. **The spec's keys work** (build contract 3): `figures/keys.ts` (→ / ← one
   press, F, A, End, vote keys 1 to 4), unchanged from session 20.
4. **The agenda is static** (content rule 44): the spec's "stop n lights up"
   presses are not carried. The four stops and their lines are the spec's.
5. **The feedback slide is the standard one** (content rule 41). It is the one
   network request in the file; build contract 1 does not foresee it and rule
   41 wins, as in 19 and 20.
6. **Exact words, content rule 36**: the spec's words kept, the trailing full
   stop dropped, a two-sentence line split onto two lines. Code, outputs and
   error text keep their own punctuation. Python's single quotes are kept
   (spec note 5).
7. **Every code panel says `Python`** (content rule 31); the spec's file names
   (`split.py`, `run1.py`, …) are not shown, which also keeps spec rule 4.
8. **Template colours only** (content rule 37). The two drawn apps keep their
   own screen colours inside the phone (Keep's note yellow, the chat app's
   green and wallpaper), as session 20 kept Spotify's.
9. **Two pictures, two engines (new, spec note).** First half: a string is a
   row of letter tiles; `split()` cuts where the separator sits, the cut tile
   vanishes, each piece drops into a list box, an empty piece as an empty box
   holding `''` (`figures/tiles21.tsx`: `Tiles`, `PieceBoxes`). Second half:
   a row of boxes with TWO position rows under it, `0 1 2 3 4` and
   `-5 -4 -3 -2 -1`, and a cursor in its own lane above (`figures/rows.tsx`:
   `TwoRowBoxes`). The cuts and walks are derived from the spec's `steps`
   (`cut_at`, `pieces`, `at`, `take`, `result`, `grey`), never retyped.
10. **Votes are clickable, keys 1 to 4 mark them, `Next` is never gated.**
    Confetti when the marked pick was right. Timers are the kit's
    `Countdown`, started by the instructor: 5:00 (T1), 6:00 (T2), 2:30 (X1).
11. **Takeaways are the spec's six examples** (K1, "examples, not a concept
    map"), as 19 and 20.
12. **The recap card carries three points** from session 20's content.
13. **Every output is a real run** on CPython 3.12.3, table below.
14. **Git is not touched**: the shared checkout carries another session's
    staged work on the current branch; this folder and its plan folder stay
    untracked until the user says.

## Controls, from the spec

| Slide | Card | Control | Presses |
|---|---|---|---|
| 3 | S-RECAP | `Next` / `Replay` | 7: three line 3s, each asked then answered |
| 4 | H1 | `Next` / `Replay` | 6 |
| 8 | C2 | `Next` / `Replay` | 3 |
| 9 | C3 | `Next` / `Replay`, A / B | 4 |
| 10 | C4 | `Next` / `Replay` | 2 |
| 11 | E1 | `Next` / `Replay`, A / B per run | 18: run 1 asked, 6 cuts, output; run 2 asked, 8 cuts, output |
| 12 | T1 | `Next` / `Replay`, timer 5:00 | 4 |
| 14 | C6 | `Next` / `Replay` | 4 |
| 15 | C7 | `Next` / `Replay`, A / B | 2 |
| 16 | G1 | `Next` / `Replay`, A to D clickable or keys 1 to 4 | 18: three rounds of question, four tries, verdict |
| 18 | H2 | `Next` / `Replay` | 5 |
| 20 | C9 | `Next` / `Replay` | 3 |
| 21 | C10 | `Next` / `Replay`, A / B | 4 |
| 22 | C11 | `Next` / `Replay`, A / B | 2 |
| 23 | E2 | `Next` / `Replay` | 15: three runs, each asked, walked, output |
| 24 | C12 | `Next` / `Replay` | 4 |
| 26 | C14 | `Next` / `Replay` | 4 |
| 27 | T2 | `Next` / `Replay`, timer 6:00 | 4 |
| 28 | X1 | `Next` / `Replay`, timer 2:30, A to D | 2 |
| 29 | K1 | `Next` / `Replay` | 6 |

## Frameworks (gate check 1)

One chain, four agenda stops. Each stop opens on something the room already
does (a note, a chat) or a question it answers, and closes on a real run.

| Agenda stop | Framework | S / Why | T / What | A | R / close |
|---|---|---|---|---|---|
| 1 Split a string | **STAR** | slide 4 (one note, four lines: how do you tick each?) and slide 8 press 1 (what will this print?) | slides 8, 9 (`split()` cuts at whitespace, a run is one cut), 10 (a separator in the brackets) | slide 11 (the split machine, empty pieces), slide 12 (task 1) | slide 12's `len` gives 4 for 3 dishes |
| 2 Join a list | **STAR** | slide 14 press 2 (we cut at every a: can we get the sentence back?) | slide 14 (`sep.join(list)`) | slide 15 (numbers refuse), slide 16 (make it print this) | slide 16's verdicts, the quiz |
| 3 Count from the end | **STAR** | slide 18 (which message is the latest? a new one moves it) and slide 18 press 3 (the long way, run) | slide 20 (two position rows), slide 21 (`[-1]`, `[-4]`) | slide 22 (a slice from the end) | slide 22's `[3, 2]`, the stop never taken |
| 4 Walk backwards | **STAR** | slide 23 press 1 (decide what `[8:1:-2]` gives) | slide 23 (a negative step walks left), slide 24 (`[::-1]`) | slide 26 (a string), slide 27 (task 2) | slide 28 exit, slide 29 the six examples |

## Term ledger (gate check 2)

| Term | Introduced | Plain words given there |
|---|---|---|
| one long text cut into pieces, glued back | 4, press 6 | tiles cut into boxes, boxes back into tiles (not yet named) |
| `str_var.split()` | 8, press 3 | cuts at the spaces, you get a list of strings |
| whitespace: `\n`, `\t` | 9, press 3 | new line and tab count as a space |
| separator in the brackets, `split(",")` | 10, press 2 | put the separator in the brackets |
| empty piece `''` | 11, press 8 | nothing between two cuts is still a piece |
| `len()` | carried in (lists) | used on 12 |
| `sep.join(list)` | 14, press 3 | the string goes between every two items |
| `TypeError` from join | 15, press 2 | join needs every item to be a string |
| `list(range(4))` | carried in (loops, lists) | used on 15 |
| negative index | 18, press 5 | -1 is always the last one |
| two position rows | 20 | from the front 0 to 4, from the end -5 to -1 |
| slice `[start:stop]` | carried in (lists) | re-read on 22: the stop is never taken |
| negative step | 23 | walks left; the start must be right of the stop |
| `[::]`, `[::-1]` | 24 | no start, no stop: the whole list; -1 reverses |
| `input()`, `int()`, `for` | carried in | used on 27 |

Nothing arrives assembled (gate check 3): every split is cut one separator per
press (E1), the join's glue tiles slide in after the line arrives (C6), the
second position row fills one number at a time (C9), and every walk is one
cursor move per press (E2).

## Outputs, all real runs (CPython 3.12.3, 2026-10-07)

All 51 programs and variants in the JSON were executed; every output matches.

| Program | Output |
|---|---|
| recap line 3 = `list_b[0] = 9` · `list_a = list_a + [3]` · `list_a += [3]` | `[9, 2]` · `[1, 2]` · `[1, 2, 3]` |
| C2 `"1 2 3 4".split()` · C3 both | `['1', '2', '3', '4']` (all three) |
| C4 `"1,2,3,4".split(",")` | `['1', '2', '3', '4']` |
| E1 run 1 · run 2 | `['1', '2', '', '3', '4', '']` · `['1', '', '', '2', '', '3', '4', '']` |
| T1 a · fixed · b | `['dosa', 'idli', '', 'vada']` `4` · `3` · `['dosa', ' idli', ' vada']` |
| C6 cut · glue | `['Python is ', ' progr', 'mming l', 'ngu', 'ge']` · `Python is a programming language` |
| C7 | `TypeError: sequence item 0: expected str instance, int found` |
| G1, 12 tries | as the spec's steps; exactly one hit per round |
| H2 long and short, before and after the new message | `Canteen`, `Coming in 5 mins` (both ways) |
| C10 · C11 | `1`, `4` · `[3, 2]` |
| E2 | `[8, 6, 4, 2]` · `[1, 2]` · `[]` |
| C12 · C14 | `[5, 4, 3, 2, 1]`, `[1, 2, 3, 4, 5]` · `m`, `margorP` |
| T2 `[-3:]` · `[-2:]` · `[-3:-1]` | `15100` · `12100` · `10000` |
| X1 four options | `['lunch?', 'ok', 'where?']`, `['canteen', 'where?', 'ok']`, `[]`, `['canteen', 'where?', 'ok', 'lunch?', 'hi']` |
| K1, six examples | `['1', '2', '', '3']`, `['1', '2', '3']`, `10-06-2007`, `1 4`, `[3, 2]`, `margorP` |

## Slide by slide

`P` = a session figure on `Panel`. Copy is the spec's, rule 36 applied. The
kicker is the agenda stop; the title is the spec's heading.

1. **Welcome** · `BrandSlide` (S-WELCOME)
2. **Recap · Where We Left Off** · `RecapBrand`, three points from session 20 (S-RECAP-CARD)
3. **Recap · What does list_b print?** · P `RecapLine3`: the program with
   line 3 blank and three empty dashed output boxes from press 1; each line 3
   fills, then its box shows the output and the why line, and keeps it (S-RECAP)
4. **Programming Foundations · You are packing for a trip** · P `KeepHook`:
   a phone with a Keep note `Trip packing`, four lines; the menu opens and
   `Show checkboxes` is tapped; `ID card` ticks; the tick clears and `Hide
   checkboxes` joins the rows back; the phone fades to a row of letter tiles
   with new-line marks, cut into four boxes, glued back. No code, no topic name (H1)
5. **Today** · `WelcomeSlide minimal`, `Lists and Strings` (S-TITLE)
6. **Agenda** · static `AgendaSlide`: `Split a string` / `cut one text into
   pieces` · `Join a list` / `glue the pieces back` · `Count from the end` /
   `a negative index` · `Walk backwards` / `a negative step` (S-AGENDA)
7. **Splitting a String** · `SectionBreakerSlide` 01 (C1)
8. **Split a string · Cut a string into a list** · P `SplitBasic`: code,
   `"1 2 3 4"` as tiles with space tiles, empty output; the cut, four boxes,
   the output; the shape `str_var.split()` biggest on the card (C2)
9. **Split a string · More spaces. Same list?** · P `SplitSpaces`: vote A / B,
   runs of spaces as one cut; then `"1\n2\t3 4"` with `\n` and `\t` as one
   tile each (C3)
10. **Split a string · Cut at a comma** · P `SplitComma`: `"1,2,3,4"`, line 2
    missing; line 2 arrives biggest, cuts at each comma (C4)
11. **Split a string · The split machine** · P `SplitMachine`: Run 1, the
    knife over tile 0, vote 4 or 6 items; one cut per press, the cut tile
    vanishes, each piece drops into a new box, `''` for an empty one; the
    output with the empty boxes lit. Run 2 the same with `split(" ")`, ending
    beside `split()`'s result for the same string (E1)
12. **Split a string · Count the canteen orders** · P `Task1`: story, both
    programs, steps, 5:00; then orders_a's cut and `4`, the fix and `3`,
    orders_b with the leading spaces lit (T1)
13. **Joining Strings** · `SectionBreakerSlide` 02 (C5)
14. **Join a list · Glue the pieces back** · P `JoinGlue`: the sentence as
    tiles with every a lit; the cut; glue_a's line biggest; an a slides into
    every gap, none at the ends (C6)
15. **Join a list · Can join glue numbers?** · P `JoinNumbers`: vote A / B;
    the TypeError exactly, item 0 shakes (C7)
16. **Join a list · Make it print this** · P `MakeItPrint`: round n of 3, the
    target, the program with its blank, four options; each press tries one
    option in order A to D, its output drawn under the target, hit or miss;
    the verdict with a why line for every wrong option (G1)
17. **Quiz Time!** · `QuizTimeSlide` (S-QUIZ)
18. **Count from the end · Which message is the latest?** · P `ChatHook`: a
    phone with the group chat `Lunch gang`, positions 0 to 3; a new message,
    position 4; the long way run beside it, both programs; -1 to -5 appear
    from the bottom up; the short way, the same outputs (H2)
19. **Negative Indexing** · `SectionBreakerSlide` 03 (C8)
20. **Count from the end · Every box has two positions** · P `TwoRows`: five
    boxes with `index` 0 to 4; an empty second row; `negative index` fills
    from the right (C9)
21. **Count from the end · Read from the end** · P `ReadEnd`: last.py, cursor
    on -1, the box lifts, `1`; fourth.py, vote A / B, cursor on -4, `4` (C10)
22. **Count from the end · A slice from the end** · P `SliceEnd`: vote A / B;
    the cursor takes 3, takes 2, reaches -1 and stops, 1 greys, `[3, 2]` (C11)
23. **Walk backwards · Walk left** · P `WalkLeft`: three runs, the
    expression biggest, the list with its index row, an empty result row;
    one cursor move per press with the spec's caption, taken boxes drop into
    the result, skipped boxes grey and stay grey; run 3 ends on `[]`, no error (E2)
24. **Walk backwards · Leave the start and stop out** · P `Reverse`: all.py
    and its output; reverse.py, the cursor walks left from the last box,
    `[1, 2, 3, 4, 5]` (C12)
25. **Indexing & Slicing Strings** · `SectionBreakerSlide` 04 (C13)
26. **Walk backwards · The same rules on a string** · P `StringEnd`:
    `Program` as seven tiles with 0 to 6 and -7 to -1; cursor on -1, `m`;
    then the walk from m to P, `margorP` (C14)
27. **Walk backwards · Ravi's last three days** · P `Task2`: story, input,
    steps.py, steps, 6:00; the five counts with both rows, `[-3:]` lit and
    `15100`; `[-2:]` and `12100`; `[-3:-1]`, 5100 greys, `10000` (T2)
28. **Exit · Which one prints []?** · P `ExitChat`: story, chat.py with line
    2's brackets as a blank, the messages with ONLY the index row, four
    options, 2:30; the right one marks and every option shows its print and
    its why line (X1)
29. **Key takeaways · Today, in six examples** · P `Takeaways`: six slots
    from press 1, one filled per press with heading, code, a small tiles or
    boxes picture, result and sentence (K1)
30. **Feedback** · `FeedbackEmbedSlide` (S-FEEDBACK)
31. **Thank you** · `ThankYouSlide` (S-THANKYOU)

## Gaps and ambiguities in the spec, and what was decided

None blocks generation.

- **The agenda's per-press stops** contradict content rule 44; the agenda is
  static (decision 4).
- **Content rule 18** wants the last quiz frame before the takeaways; the spec
  puts the classroom quiz at minute 36 only. The deck follows the spec, as 19
  and 20 did.
- **Content rule 20** (takeaways restate the agenda) is overridden by the
  spec's example board (decision 11).
- **Build contract 1** (no network) is broken by the feedback frame only
  (decision 5).
- **H1's ticked item and Keep's real behaviour.** Keep's default setting moves
  a ticked item to a `ticked items` group at the bottom; the spec's must line
  says "the item order never changes". The deck draws the tick in place
  (struck through, grey), which is Keep with "Move ticked items to bottom"
  turned off. The menu words `Show checkboxes` / `Hide checkboxes` are the
  spec's; **the spec asks for them to be checked on a phone today, which was
  not possible here: a reviewer should confirm.**
- **Logos (content rule 12).** Keep and the chat app are named in copy (the
  spec's exact H2 line names WhatsApp), and neither mark is in
  `slide-kit/assets/`. Fetching one means adding to the shared library, which
  this run does not touch; the phones are drawn with the apps' own screen
  colours and no mark.
- **Spec defects.** Slide 42's "start greater than end" is replaced by E2's
  "the start must be right of the stop" (the spec's own fix), and X1 tests
  it. Slide 37 (out of bounds in a slice) and slides 50, 51 (negative slice
  and step on a string) are spoken lines: they are in the speaker notes of
  C11 and C14, with the IndexError for `list_a[-6]` run on CPython.
- **The daily challenge** (original slide 57) belongs to the instructor
  guide, which this run does not build; it is not a slide.
- **T2's picture.** The spec's "the counts can sit on a step counter app
  screen" is an option, not a must; the counts are drawn as the session's
  two-row boxes, which the press 2 to 4 screens describe.

## Verification, 2026-10-07 (dev server port 5250, built file from `file://`)

| Check | Result |
|---|---|
| all 51 spec programs and variants on CPython 3.12.3 | every output matches the spec |
| `npm run typecheck`, `npm run build:html` | clean; `dist-single/python-session-21-lists-and-strings.html`, 3.85 MB, self-contained |
| `video-safe.mjs` (slides 1 to 30) | CLEAN |
| `qa.mjs` (slides 1 to 30) | baseline only: slide 1 (`NO LOGO`). Type-floor warnings are the drawn phones, the code panels and the takeaways' small pictures (10 to 15px), as 19 and 20 accepted |
| `align-check.mjs`, `mixed-align-check.mjs` (1 to 30) | 0 of 30 |
| slide 31, Thank you | kit `ThankYouSlide`, looked at; the harnesses cannot reach it past the feedback frame |
| `spec-check.mjs` | first open is one press per arrow, ← one back, the address restores; End lands on G1's last press; key 2 marks option B; A opens the picker; all 24 cards with presses carry the spec's `data-presses`; only network host `docs.google.com`; 0 page errors |
| `gesture-check`, `agenda-check`, `feedback-check`, `ligature-check` | all passed; feedback is an exact copy of session 18's |
| `overlap-check.mjs` | one finding, slide 1 (the kit's Welcome sparkle), the same on session 20's built deck; nothing on this session's content |
| `nav-stress-check.mjs` | clean in Chromium and Firefox at 4 sizes; WebKit not run |
| reveal-step map | every card's steps = its press count minus 1 |
| every card | screenshots looked at, every press; fixed on the way: piece text wrapping in its box, G1's fourth try under Next, H2's last press under Next and its clipped code, C11 and T2 captions under Next, C9's trailing full stops, the hook's hidden menu under the controls, C6's clipped code, X1's wrapped output, E2's wrapped run label, C14's empty string drawn as a list |

## Change request, 2026-10-07 (user): Autoplay and the quiz slide

| Item | Change | Slides |
|---|---|---|
| Replay → Autoplay | each built card's Replay is an Autoplay switch, `Autoplay On` / `Off`, same pill and place | every card with steps: 3, 4, 8 to 12, 14 to 16, 18, 20 to 24, 26 to 29 |
| Animation | the slides' existing soft fades and small rises; per-step hold from the amount of newly visible text (code weighs more), after the step's own motion settles; steps in the card's reading order | as above |
| Default | on: 3, 4, 14, 18, 20, 21, 22, 23, 24, 26, 29; off everywhere else | |
| Fallback | off is step-wise (Next or arrow); a manual press pauses; the switch resumes from the step on screen | |
| Quiz | slide 17 is the lesson plan's "Classroom quiz on the portal" card (`ClassroomQuiz`), the deck's standard quiz slide | 17 |

Slide count (31), order and every other slide's content unchanged. Verified:
video-safe CLEAN, qa baseline (slide 1), align and mixed-align 0 of 30, spec,
gesture, agenda, feedback, ligature checks pass, overlap-check only the kit
Welcome baseline, nav-stress clean (Chromium, Firefox), `autoplay-check.mjs`
all passed on the built file.
