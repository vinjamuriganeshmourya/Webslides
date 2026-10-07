<!-- cSpell:ignore NxtWave devPort Chuttamalle Hukum Kaavaalaa Kesariya Kissik Naatu Arjun Bhavya Charan Divya Maggi pushups -->
# Python · Session 19: "Lists"

**STATUS: SIGNED OFF 2026-10-06** (user: *"do what ever need to generate it
our slides make sure the content is not missed with no overlaps or any
misalignments and corrections"*, given on the nine defaults listed under
Decisions). The deck was generated from this plan in the same run, as
sessions 17 and 18 were.

| | |
|---|---|
| `SESSION_NAME` | `Lists` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/19_lists_session_spec.json` (the data: every program, output, press and trace) and `19_lists_session_spec.html` (the same spec as a reading page, with 18 thumbnails of the kept deck slides). A spec from the pedagogy team, not a finished deck: **23 beats, 29 cards, 75 minutes** |
| Project | `Outputs/python/19_lists/` |
| Deck file | `src/decks/listsDeck.tsx` |
| Slide count | **29**, one per card, in the spec's order |
| `devPort` | `5248` |
| `htmlName` | `python-session-19-lists` |

## The one idea

A list keeps many values under one name, in order. You reach each value by
its position, positions start at 0, and a slice stops just before its stop
number.

## Decisions (confirmed by the user's go-ahead)

1. **One slide per spec card, all 29, in the spec's order.** Spine cards are
   kit slide types (`BrandSlide`, `RecapBrand`, `WelcomeSlide minimal`,
   `AgendaSlide`, `QuizTimeSlide`, `FeedbackSlide`, `ThankYouSlide`); every
   other card is a session figure on `Panel` whose presses are the kit's build
   steps, with session 18's `Next` / `Replay` controls. Each content slide's
   body carries `data-spec` and `data-presses` for the team's review script.
2. **Exact words, with content rule 36 applied**: the spec's words are kept,
   the trailing full stop is dropped, and a two-sentence caption is two lines.
   Not a word changes. Code, outputs and error text keep their punctuation.
3. **The Spotify screen is drawn as the real thing** (course rules R5, R5b):
   a desktop screen in a monitor frame, dark shell, green accent, cover art,
   the table with `#`, `Title`, `Album`, `time`, a player bar. The object's
   own colours stay inside the object with a comment (content rule 37); the
   slide around it is on tokens. The mark is the library's
   `companies/spotify.png` (rules 12 and 13), never drawn by hand. No
   `Playlist` label anywhere before the title card (spec rule 4).
4. **The agenda stays the kit's** (content rule 39, `figures/Agenda.tsx`):
   `Agenda` large over `Lists` small, four points on the arc. The spec's
   "one stop lights per press" is not carried because the template is off
   limits for this build.
5. **Arrow keys stay the kit's**: a plain arrow moves a slide, `?nav=steps`
   or Ctrl+arrow steps a build, the on-slide `Next` button is the press. The
   spec's "right arrow is one press" is a build-contract line for the team's
   own HTML builder and is recorded here, not implemented.
6. **Key takeaways are the spec's six examples** ("Examples, not a concept
   map"), as session 18 kept its reference's cards (course rule R2), not the
   agenda strings content rule 20 asks for. Flagged, not hidden.
7. **The recap card carries three points** from session 18's content, since
   the kit's recap slide needs points and the spec's spine card has none.
8. **Feedback is Python session 18's slide, copied exactly** (content rule
   41; user, 2026-10-06, replacing the kit's `FeedbackSlide` this deck first
   shipped with). `figures/FeedbackForm.tsx` and `public/assets/feedback-qr.png`
   are session 18's files unchanged; `feedback-check.mjs` finds the rendered
   slide identical to the source built file.
9. **Task 3's timer is 5:00**: its exact words say `5 minutes`, its data says
   240 seconds, and the words win (spec rule 5).
10. **Every output is a real run** on CPython 3.12.3 (course rule R3), see the
    table below. The slice walker and the detective game derive their steps
    from the data in the JSON, which was checked against Python.
11. **Votes are clickable, `Next` is not gated** (session 16's decision 5):
    the game's A / B / C and the exit's three options lock the room's pick in
    and the confetti fires when it was right. Timers are the kit's
    `Countdown`, started by the instructor. Nothing self-advances.
12. **Template colours only** (content rule 37); the recap header through
    `RecapBrand`. Agenda mark, three-way navigation (`figures/gestures.ts`),
    ligatures off (`src/index.css`) and `mixed-align-check.mjs` as every deck.
13. **Git is not touched**: the shared checkout carries another session's
    staged work on the current branch, so the folder stays untracked until the
    user says.

## Controls, from the spec

| Slide | Card | Control | Presses |
|---|---|---|---|
| 3 | S-RECAP | `Next` / `Replay` | 6: the tray, then one chip flies per press |
| 4 | H1 | `Next` / `Replay` | 7: screen, question, six boxes, Kissik, glow, the turn, the `?` |
| 7 | C1 | `Next` / `Replay` | 2 |
| 8 | C2 | `Next` / `Replay` | 3: code, line 3's output, line 4's output |
| 9 | C3 | `Next` / `Replay` | 2 |
| 10 | C4 | `Next` / `Replay` | 4 |
| 11 | C5 | `Next` / `Replay` | 5: the row, then one `print` line per press |
| 12 | C6 | `Next` / `Replay` | 5: the question, then one pass per press |
| 13 | T1 | `Next` / `Replay`, timer 4:00 | 6: the task, then one line per press |
| 14 | G1 | `Next` / `Replay`, A / B / C clickable | 14: four rounds (setup, run lines, verdict), then the culprit |
| 16 | C7 | `Next` / `Replay` | 2 |
| 17 | C8 | `Next` / `Replay` | 7: the question, then six steps |
| 18 | C9 | `Next` / `Replay` | 2 |
| 19 | T2 | `Next` / `Replay`, timer 4:00 | 4 |
| 20 | C10 | `Next` / `Replay` | 5 |
| 21 | E1 | `Next` / `Replay`, three sliders | 18: four runs set by the beats, one cursor move per press, then all four results |
| 22 | C11 | `Next` / `Replay` | 2 |
| 23 | C12 | `Next` / `Replay` | 4 |
| 24 | A1 | `Next` / `Replay` | 4 |
| 25 | P1 | `Next` / `Replay`, timer 5:00 | 2 |
| 26 | X1 | `Next` / `Replay`, timer 2:30, A / B / C clickable | 2 |
| 27 | K1 | `Next` / `Replay` | 6, one example per press |

## Frameworks (gate check 1)

One concept chain, four agenda stops. The spec's own shape is the hook, then
the stops in order, each closed by a run.

| Agenda stop | Framework | S / Why | T / What | A | R / close |
|---|---|---|---|---|---|
| 1 Make a list | **STAR** | slide 4 beats 1 to 2 (six songs, one variable each) **and** beats 4 to 5 (a seventh song, and no line knows there are seven) | slide 4 beat 6 (one name, seven songs, in order, not yet named) and slide 7 (a list, positions from 0) | slide 8 (brackets and commas), slide 9 (a list inside a list) | slide 8 and 9 outputs, real runs |
| 2 Reach one item | **STAR** | slide 7 beat 2 (Spotify says 1, Python says 0) and slide 10 (how many items?) | slide 11 beat 1 (the second item is at position 1) | slides 11 to 12 (`list_a[i]`, the loop) | slide 13 (task 1 run, the IndexError), slide 14 (the game), slide 15 quiz |
| 3 Join and repeat | **STAR** | slide 16 beat 1 (what will `list_c` be?) and slide 17 beat 1 (`[]`, what does line 5 print?) | slide 17 beats 2 to 7, one step per press | slide 18 (`*`) | slide 19 (task 2: the bracket mistake, the TypeError) |
| 4 Take a part | **STAR** | slide 20 beats 1 to 2 (one item, then "how do we ask for these two?") | slide 20 beat 3 (start, stop before) | slide 21 (the walker, four runs), slide 22 (the step), slide 23 (`list()`) | slide 24 (spot the error), slide 25 (the canteen week run), slide 26 exit |

## Term ledger (gate check 2)

| Term | Introduced | Plain words given there |
|---|---|---|
| one name, many values, in order | 4, beat 6 | one name, seven songs, in order (not yet called a list) |
| list, position, positions start at 0 | 7 | holds many items, in order, under one name; positions start at 0 |
| square brackets, comma, `type` | 8 | square brackets around it, a comma between items |
| a list inside a list | 9 | an item can itself be a list |
| `len` | 10 | how many items |
| `list_a[position]` | 11 | the second item is at position 1 |
| `for item in list_a` | 12 | one item per pass |
| `IndexError` | 13, line 6 | there is no position 6, so Python stops with an error |
| `+` on lists | 16 | first list, then second, in order |
| `[]`, `+= [i]` | 17 | `[]` is an empty list; puts the item at the end |
| `*` on lists | 18 | the whole list, three times |
| `TypeError: 'int' object is not iterable` | 19 | nothing printed at all, Python stopped at line 3 |
| slice `[start:stop]`, the wall | 20 | start at the first number, stop before the second |
| `[:2]` | 20, beat 5 | no start number means start at 0 |
| step `[start:stop:step]` | 21, run 3 | the third number is the step, jump 2 each time |
| `list()` | 23 | turns a string or a range into a list |
| `range`, `for`, `print`, `type`, `+=`, `input` | carried in (sessions 3, 4, 14, 17) | used from slide 8 |

Nothing arrives assembled (gate check 3): the row is built from separate
boxes on slide 4, the positions drop in one by one on slide 7, outputs land
one line per press, the list grows one box per press on slide 17, the slice
is walked one position per press on slide 21.

## Outputs, all real runs (CPython 3.12.3, 2026-10-06)

| Program | Output |
|---|---|
| recap chips `"a" > "A"`, `"98" <= "123"`, `"BAD" >= "BAT"`, `"9" > "5"`, `"Apple" < "apple"` | `True`, `False`, `False`, `True`, `True` |
| `print(type(list_a))`, `print(list_a)` | `<class 'list'>`, `[5, 'Six', 2, 8.2]` |
| `print(list_b)` with `list_b = [1, list_a]` | `[1, [5, 'Six', 2, 8.2]]` |
| `len(list_a)`, `len(list_b)` | `4`, `2` |
| `list_a[1]`, `list_a[0]`, `list_a[3]`, `list_a[len(list_a) - 1]` | `Six`, `5`, `8.2`, `8.2` |
| `for item in list_a: print(item)` | `5` `Six` `2` `8.2` |
| task 1, lines 2 to 6 | `6`, `Hukum`, `Chuttamalle Kesariya`, `Kesariya`, `IndexError: list index out of range` |
| game clues 1 to 4 | `Arjun`; `Divya` then `Arjun`; `Bhavya`; `IndexError: list index out of range` |
| `list_a + list_b` | `[1, 2, 3, 'a', 'b', 'c']` |
| grow: `[]` then `+= [i]` for 1 to 3 | `[]`, `[1, 2, 3]` |
| `[1, 2] * 3` | `[1, 2, 1, 2, 1, 2]` |
| pushups with brackets · without | `[5, 10, 15, 20, 25]` · `TypeError: 'int' object is not iterable` |
| `list_a[0:2]`, `list_a[:2]` | `[5, 'Six']` both |
| `road_trip[1:4]`, `[2:2]`, `[0:6:2]`, `[4:10]` | `['Hukum', 'Illuminati', 'Naatu Naatu']`, `[]`, `['Chuttamalle', 'Illuminati', 'Kaavaalaa']`, `['Kaavaalaa', 'Kesariya']` |
| `list_a[0:5:3]` on R B G O W | `['R', 'O']` |
| `list("Red")`, `list(range(4))` | `['R', 'e', 'd']`, `[0, 1, 2, 3]` |
| animals `+= wild_animals` · `+= [wild_animals]` | `['cat', 'dog', 'Tiger', 'Fox']` · `['cat', 'dog', ['Tiger', 'Fox']]` |
| canteen week solution | `Weekdays: 270`, `Weekend: 250` |
| exit: `a, b` = `1, 2` · `4, 2` · `5, 6` | `Hukum` · nothing · `Kesariya` |
| takeaways, run as one program | `['Hukum', 'Kissik']`, `2`, `Hukum`, `['Hukum', 'Kissik', 'Kesariya']`, `['Hukum', 'Kissik', 'Kaavaalaa']`, `['Hukum', 'Kissik']` |

## Slide by slide

`P` = a session figure on `Panel` (kit header, body in `top` mode). Copy is
the spec's, rule 36 applied. The kicker is the agenda stop the card belongs
to; the title is the spec's heading.

1. **Welcome** · `BrandSlide`, greeting `Welcome` (S-WELCOME)
2. **Recap · Where We Left Off** · `RecapBrand`, three points on string
   comparison and names (S-RECAP-CARD)
3. **Recap · True or False?** · P `RecapSort`, 6 beats. Lead: `Say True or
   False before the chip moves`. A tray of five chips on the left, two bins
   `Prints True` / `Prints False` on the right. One chip flies per press and
   its why line stays under it (S-RECAP)
4. **Programming Foundations · Your Road Trip songs** · P `PlaylistHook`,
   7 beats. The monitor with the Spotify screen (six rows, `Road Trip`,
   `6 songs, about 21 min`), the caption per beat, six variable boxes
   (beat 3), the seventh (beat 4), the count line glows (beat 5), the turn
   into one row under `road_trip` with empty position slots (beat 6), the
   first slot's `?` and Spotify's row 1 glowing (beat 7). The word `list`
   is not on this frame (H1)
5. **Today** · `WelcomeSlide minimal`, `Lists` (S-TITLE)
6. **Agenda** · `AgendaSlide`: `Make a list` / `many values, one name` ·
   `Reach one item` / `len and the position number` · `Join and repeat` /
   `+, += and *` · `Take a part` / `a slice, and the step` (S-AGENDA)
7. **Make a list · A list** · P `ListRow`, 2 beats: the hook's row of seven
   songs; the positions 0 to 6 drop in one by one; `Spotify said 1, Python
   says 0` (C1)
8. **Make a list · Making a list** · P `MakeList`, 3 beats: the code with
   line 2's brackets and commas marked, then `<class 'list'>`, then
   `[5, 'Six', 2, 8.2]` with the `2` marked (C2)
9. **Make a list · A list inside a list** · P `NestedList`, 2 beats: the
   question, then the output with outer and inner brackets in two colours and
   the box holding a smaller row (C3)
10. **Reach one item · How many items?** · P `LenCount`, 4 beats: `len.py`,
    `4` with the boxes counting up, `len_b.py`, `2` with the inner list as
    one box (C4)
11. **Reach one item · Reaching one item** · P `IndexCursor`, 5 beats: the
    row with positions and a cursor above it, then one `print` line per
    press, biggest text on the card, the cursor dropping onto the position
    and the output showing the value. `list_a[4]` is not shown (C5)
12. **Reach one item · Going through every item** · P `LoopItems`, 5 beats:
    `How many lines will it print?`, then one pass per press (C6)
13. **Worksheet · Task 1 · Predict, then run** · P `Task1`, 6 beats, timer
    4:00: the three steps, the program with line numbers, the six songs as
    boxes with positions 0 to 5, the terminal; lines 2 to 6 light one per
    press with the cursor, the output and the why line. Line 6's cursor goes
    past the last box; the error is Python's own text (T1)
14. **Game · Who took the Maggi?** · P `MaggiCase`, 14 beats: the notice
    board with four suspect cards, the case in two lines; a clue sheet per
    round with its program, `What does this clue print?`, three options;
    one run line per press; the verdict with a why line per wrong option
    and the ruled-out suspect crossed off; round 4 crashes and rules nobody
    out; the last press unmasks Charan (G1)
15. **Quiz Time!** · `QuizTimeSlide` (S-QUIZ)
16. **Join and repeat · Joining two lists** · P `JoinLists`, 2 beats: two
    rows, `What will list_c be?`, the rows slide together (C7)
17. **Join and repeat · Adding items to a list** · P `GrowList`, 7 beats:
    `[] is an empty list`, `What does line 5 print?`, then the six steps of
    the data, a new box joining the end each time, the two print lines (C8)
18. **Join and repeat · Repeating a list** · P `RepeatList`, 2 beats (C9)
19. **Worksheet · Task 2 · Type it, change it, run it** · P `Task2`, 4
    beats, timer 4:00: the gym plan, the program, the steps; the output; the
    changed line 3 with the empty output and the TypeError; line 3 back (T2)
20. **Take a part · Taking part of a list** · P `SliceIntro`, 5 beats: one
    item, the dashed frame round two, the line `list_b = list_a[0:2]`
    biggest on the card with `Start at the first number` / `Stop before the
    second`, the output with position 2 outlined as the wall, then `[:2]`
    with `No start number means start at 0` (C10)
21. **Take a part · Follow the slice** · P `SliceWalker`, 18 beats: the six
    songs with positions, three sliders (start, stop, step), the expression
    big at the top, an empty result row; four runs, one cursor move per
    press; a taken song drops into the result, a skipped song greys and
    stays grey, the stop is a wall, past the end the slice just ends with no
    error; the last press lists all four results (E1)
22. **Take a part · Slicing with a step** · P `StepSlice`, 2 beats: R B G O
    W, `Start 0, stop before 5, jump 3`, the cursor hops 0, 3, then past the
    end; `['R', 'O']` (C11)
23. **Take a part · Making a list with list()** · P `ListFrom`, 4 beats:
    `list("Red")`, one letter per box; `list(range(4))` (C12)
24. **Take a part · Find the mistake** · P `SpotError`, 4 beats: the code and
    the wanted output, the real output with the two differences marked,
    `Change one line so it prints the wanted output`, line 3 fixed (A1)
25. **Your turn · Ravi's canteen week** · P `CanteenWeek`, 2 beats, timer
    5:00: the story, `spend = [60, 45, 80, 30, 55, 140, 110]` drawn with Mon
    to Sun under the boxes, the steps, the output format with dots; then one
    worked solution and its output. `sum()` is not mentioned (P1)
26. **Exit · Which one prints no song?** · P `ExitVote`, 2 beats, timer
    2:30: the story, the program with line numbers, three options as values;
    the right option marks and every option shows what it prints and why (X1)
27. **Key takeaways · Lists, in six examples** · P `Takeaways`, 6 beats: six
    empty slots from press 1, filled one per press with heading, code,
    result and sentence (K1)
28. **Feedback** · session 18's `FeedbackEmbedSlide`, copied exactly (S-FEEDBACK)
29. **Thank you** · `ThankYouSlide` (S-THANKYOU)

## Flags for the reviewer

- Content rule 18 asks for a quiz frame immediately before the takeaways; the
  spec puts the classroom quiz at minute 33 only, as the pedagogy team's
  spine does, and the deck follows the spec (as session 18 did).
- Content rule 20 (takeaways restate the agenda) is overridden by the spec's
  example board, decision 6.
- The spec's agenda presses and arrow-key contract are not implemented,
  decisions 4 and 5.

## Verification, 2026-10-06 (built file and dev server, port 5248)

| Check | Result |
|---|---|
| `npm run typecheck`, `npm run build:html` | clean; `dist-single/python-session-19-lists.html`, 3.85 MB, self-contained |
| `video-safe.mjs` | CLEAN |
| `qa.mjs` | baseline only: slides 1 and 29 (`NO LOGO`). Type-floor warnings on 8 slides are code panels holding the six-song list at 13 to 14px (13, 25, 26, 27), the drawn Spotify screen (4), the kit's line numbers and beat badges (10, 14, 17, 21), and the game's `out` tag |
| `align-check.mjs`, `mixed-align-check.mjs` | 0 of 29 |
| `gesture-check.mjs`, `agenda-check.mjs`, `ligature-check.mjs` | all passed |
| every build step of all 22 panels | stepped and measured against the control bar, the Next / Replay buttons and the footer mark; screenshots looked at for slides 3, 4, 13, 14, 17, 20, 21 at every press, all others at press 1 and fully revealed |
| built file from `file://` | every panel carries `data-spec` and `data-presses` matching the spec's press counts; 0 network requests; 0 page errors |
| `overlap-check.mjs` (content rules 42, 43), after the user's review | no findings on every step of all 29 slides, after fixing the cursor lane (slide 12) and the output glow (slides 11, 16, 17, 18, 22, 23) |
| `feedback-check.mjs` (content rule 41), after the feedback slide was replaced | slide 28's markup identical to session 18's built file; QR loads; link and frame match; only Thank you follows |
