<!-- cSpell:ignore NxtWave devPort Teja Ravi Kiran Divya Ludo Zomato functools randint biryani samosa dhaba -->
# Python · Session 31: "Python Standard Library"

**STATUS: SIGNED OFF 2026-10-13** (user: *"you have already created the
sessions for the 27, 28, 29, 30 similarly create the slide deck for the
31 spec … make sure you haven't repeat the same mistakes from the previous
slide deck … just build the deck"*). The spec is the signed-off content; this
plan only maps it onto the kit, as the plans for sessions 24 to 30 did, and
the deck is generated from it in the same run.

| | |
|---|---|
| `SESSION_NAME` | `Python Standard Library` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/31_python_standard_library_session_spec.json` (every program, output, press, walk step and round) and `…_spec.html` (the reading page, with 30 thumbnails of the original deck's kept slides). **24 beats, 33 cards, 75 minutes** |
| Project | `Outputs/python/31_python_standard_library/` (scaffold copied from session 30, which carries the carry-forward standard, the 2026-10-09 view fixes and the 2026-10-12 box-height and re-entry autoplay; session 29's auto-play menu option merged in, the standing rule of SLIDE_WORKFLOW Stage 5) |
| Deck file | `src/decks/stdlibDeck.tsx` |
| Slide count | **33**, one per card, in the spec's order |
| `devPort` | `5262` |
| `htmlName` | `python-session-31-python-standard-library` |

## The one idea

Python comes with many ready-made tools, kept in modules; `import` switches
one on and the dot reaches inside it. `map`, `filter` and `reduce` are loops
Python already wrote: you hand them only the rule.

## Decisions

Carried from sessions 24 to 30 unless marked new.

1. **One slide per spec card, all 33, in the spec's order.** No kit divider:
   the spec's three marker cards (C4 `Math Module`, C9 `Random Module`, C12
   `Map, Filter & Reduce`) are drawn as night breakers whose title arrives the
   way the card says (keys flying in, a dice rolling, three tiles), each with
   `data-spec` and its press count. Spine cards as 30: `BrandSlide`,
   `RecapBrand`, `WelcomeSlide minimal`, the static `AgendaSlide`,
   `ClassroomQuiz`, `FeedbackEmbedSlide`, `ThankYouSlide`. Every other card
   is a figure on `Panel`; its presses are build steps; its body carries
   `data-spec` and `data-presses`.
2. **The spec is read, never retyped.** `scripts/build-spec-data.mjs` writes
   `figures/spec.ts` (`SPEC` and `NOTES`, the say lines, as speaker notes).
3. **Every program was run** on CPython 3.12.3: 88 programs, rounds, tries,
   options and examples. All match the spec, with one difference of Python's
   own: 3.12.3 appends `Did you forget to import 'math'?` to the seven
   `NameError: name 'math' is not defined` lines. The deck shows the spec's
   line (spec rule 6), which is the error's first sentence on every version.
   Random outputs are the spec's sample runs; the cards say so.
4. **Keys** (`figures/keys.ts`): arrows one press, F full screen, A all cards,
   End the whole card, 1 to 4 a vote.
5. **The agenda is static** (content rule 44): the spec's four stops.
6. **Exact words, content rule 36**: a line's closing full stop dropped, two
   sentences become two lines. Code keeps its own punctuation.
7. **Template colours only** (rule 37). The drawn calculator keeps its own
   dark keypad and accent `=` inside the phone, the food app its red accents,
   green rating badges and veg marks inside the screen, the Ludo board its
   four player colours inside the phone; no product name, no logo (rule 12).
   The spec's captions name Zomato and Ludo King in words, as written.
8. **Press counts (new, the 2026-10-09 view fixes carried: every output
   waits for a press, nothing reveals on a timer).** Three cards grow:
   - **C10 is 8 presses** (spec 5): press 4's three sample runs are three
     presses (the dice rolls and a run lands on each), and press 5's vote and
     its `True` are two presses.
   - **C11 is 5 presses** (spec 3): press 2's two runs are two presses, and
     press 3's vote and its sample run are two presses.
   - **K1 is 7 presses** (spec 6, as sessions 28 to 30): the seventh fills
     example 6's result, so nothing is left at `?` once Next goes grey.
   `spec-check` expects these three counts. Movement inside a press (a chip
   flying, a key flying, the arrow going into the function, items dropping
   through `int`, boxes merging) stays movement, through `useStepPhase`.
9. **One picture for the import cards (spec note 5, new `figures/Code.tsx`
   `marks`).** The name line 1 brings in is underlined in the brand colour;
   the name line 2 uses is underlined too: the same name in the same colour
   runs, a different name turns red and the program stops on that line. The
   small table *How you import decides how you call* (`figures/imports.tsx`,
   `HowTable`) grows by one row on C3, C6, C7 and C8; rows already added are
   on screen from the card's first press.
10. **The calculator world (H1, C1, C4).** `figures/Calculator.tsx` draws a
    real phone calculator: round keys, the operators and `=` in the accent
    tone, the display at the top, no camera island (user, 2026-10-13, every
    mockup); turned sideways the scientific keys sit on the left in three
    columns by five rows (the spec's twelve plus `x³`, `10ˣ`, `1/x`) and every
    basic key stays on the right, the seven columns filling the screen with
    equal margins (user, 2026-10-13). The phone turns on its press (a 700ms
    turn about its centre) and never by itself.
11. **The food app world (H2, C13, C16).** `figures/FoodHook.tsx` draws the
    app on a 170 x 350 phone (1 : 2.06, `LiveClock`): location, search, the
    chip row, six places with rating badge, veg mark and price for one; a
    filter chip makes the dropped places disappear (never grey); the cart
    screen holds the three lines and the item total. The caption sits under
    the phone so the right column holds `buttons.py` (11 lines at `CODE_FS`
    15) with its two output rows.
12. **Games.** `figures/game.tsx` carries session 30's `GameFrame`, `OutRow`,
    `WhyLines`, `RoundHead` and `schedule`, so neither game imports a
    leftover figure. G1 (`FixImport.tsx`, 24 presses): the target big, the
    program with line 1 blank (the fill-in slot), the four tries listed in
    order with their real output, hit or miss. G2 (`InsideBuiltin.tsx`, 30
    presses): the spends as payment tiles, a pointer that moves one item per
    press, the keeping box from the data, the print step, the verdict.
13. **E1 (`WhoCalls.tsx`, 15 presses).** The arrow lives in a lane left of
    the code (rule 42): it path-draws from line 5 up into `def is_rated_4`
    carrying the rating, and back from line 2 carrying True or False; ticks
    and crosses stay on the ratings row; copies drop into `kept`.
14. **Votes are clickable, keys 1 to 4 mark them, Next is never gated.**
    Confetti when the marked pick is right. Timers: 6:00 (T1), 5:00 (T2),
    2:30 (X1).
15. **Controls and autoplay.** Session 23's `controls.tsx` and `autoplay.ts`
    with session 29's deck-wide Auto-play option in the slide menu (On when
    the deck first loads, kept per deck) and session 30's restart on every
    re-entry. This deck's own list: the two hooks, the explainer and the
    concept cards without a vote (4, 7, 8, 11, 12, 14, 21, 23, 24, 25, 26,
    27), plus 3, 13 and 31 on the user's word (2026-10-13).
16. **Kickers**: `Python Standard Library` on C1 to T1 and G1 (the original
    deck's own kicker, after the title card so spec rule 4 holds); `Random
    Module` on C10 and C11; `Map, Filter & Reduce` on C13 to T2. The hooks
    and the recap say neither.
17. **People** (2b, item 12): Ravi beside his calculator (`Idling`, the lab
    rig, held still on harness URLs), the Ludo players and Kiran's marks card
    as lab faces (`people.tsx`).
18. **Layout**: the body box is y 221 to 652 (Next at 661). Every concept card
    is two groups side by side with explicit heights chosen for the card's
    tallest press (user, 2026-10-12: a box never grows with its content),
    ending at least 20px above Next on every press (`.gap.mjs`).
19. **Git is not touched.** The shared checkout carries other sessions' work.

## Carry-forward standard (generate-slides 2b), per card

| Item | Where |
|---|---|
| `Group` one cluster, one container; `active` on the part being worked | every content card |
| `Focus` on the asked program until its answer | C3, C5 to C8, C10, C11, C13 to C16, G1 and G2 ask presses, X1 |
| `Code.tsx` blanks (`___`+) | G1's line 1 |
| `StepCaption` cross-fade | S-RECAP, H1, C1 to C3, C5 to C8, C10, C11, H2, C13 to C16, E1, G1, G2 |
| `Option`/`Vote` one centre line, `nowrap` | every vote |
| `CODE_FS` 15, `OUT_FS` 16 | every card |
| `Fresh` / `Appear` / `Swap`: nothing pops | program swaps, rounds, screens |
| Arrows path-draw, filled 9px heads on their own axis | C5's syntax arrows, E1's call arrow |
| Phones 1 : 2.06 with `LiveClock` | H1, C10, C11, H2 |
| Characters from the lab | H1, C6, C10, C11 |
| No box overflow, no drag | gate: `box-overflow-check` |

## Slides

`P` is the card's press count on this deck; a card's build steps are `P - 1`.

| # | Card | P | Slide | What the presses do |
|---|---|---|---|---|
| 1 | S-WELCOME | 0 | `BrandSlide` | Welcome |
| 2 | S-RECAP-CARD | 0 | `RecapBrand` | three points from the dictionaries session: `=` gives a second name, `copy()` makes a second one, `clear()` empties the shared one |
| 3 | S-RECAP | 6 | `RecapSort.tsx` | the trip line, five chips, two bins; one chip per press flies into its bin with `print(backup)` and the why line |
| 4 | H1 | 7 | `CalcHook.tsx` | Ravi's calculator upright and the homework page; it turns, the scientific keys appear; the display answers; two small calculators and `print(7 * 8)`; `sqrt(49)` NameError; `import math` and both answers; six module cards |
| 5 | S-TITLE | 0 | `WelcomeSlide minimal` | Python Standard Library |
| 6 | S-AGENDA | 0 | `AgendaSlide` (static) | the four stops |
| 7 | C1 | 3 | `LibraryCards.tsx` `Library` | the built-in tiles beside the upright calculator; it turns and a shelf of more tools fades in; the two definition lines |
| 8 | C2 | 3 | `Modules` | the shelf sorts into labelled boxes; random opens into `random.py`; files slide into a folder |
| 9 | C3 | 4 | `ImportCards.tsx` `ImportOn` | the line and `import module_name`; sqrt.py with no import, the vote; math turns red, NameError; `import math` slides in, both names in one colour, `7.0`, table row 1 |
| 10 | C4 | 1 | `Breakers.tsx` `MathBreaker` | √, π and x! fly in and settle into `Math Module` |
| 11 | C5 | 4 | `Syntax` | `math.factorial(5)` with its two arrows; photo.py, the question; `120` and pi, the dot opens the math box; pi.py TypeError, the caption |
| 12 | C6 | 4 | `AsCard` | marks.py and Kiran's marks card; line 3 takes the name, AttributeError; marks_fixed.py `120 / 78`, table row 2; old_name.py NameError, the caption |
| 13 | C7 | 4 | `FromCard` | one_tool.py; factorial lifts out, `120`, table row 3; one_tool_dot.py, the vote; math turns red, NameError |
| 14 | C8 | 3 | `FromAsCard` | short_name.py; factorial lifts out as `fact`, `120`, short_name_old.py NameError; the full table, the caption |
| 15 | T1 | 6 | `Tasks.tsx` `Task1` | four programs with their questions, 6:00; one result per press; the two fixes |
| 16 | G1 | 24 | `FixImport.tsx` | four rounds: the vote, four tries, the verdict |
| 17 | S-QUIZ | 0 | `QuizRef.tsx` (the reference deck's quiz slide, user 2026-10-13) | |
| 18 | C9 | 1 | `RandomBreaker` | a dice rolls across and `Random Module` comes out of it |
| 19 | C10 | 8 | `RandomCards.tsx` `Dice` | the Ludo board on Teja's phone; `dice = 4` twice; the line and `random.randint(min, max)`; three runs, one per press; thirty_rolls.py and the vote; `True` |
| 20 | C11 | 5 | `Choice` | `random.choice(seq)`; first.py, a run lights Teja; a run lights Divya; letter.py and the vote; `e` |
| 21 | H2 | 9 | `FoodHook.tsx` | six places; Rating 4.0+ keeps three; Pure Veg keeps two; ten chips; buttons.py and its two lists; the cart with `?`; the amounts and cart.py; the total and total.py; the three labels |
| 22 | C12 | 2 | `MapBreaker` | the three moments shrink into three tiles; the deck's line |
| 23 | C13 | 5 | `MapCards.tsx` `MapCard` | the definition and `map(function, sequence)`; prices.py and the text row; each price drops through int, both outputs; packing.py; prices_called.py TypeError |
| 24 | C14 | 7 | `InputLine` | read_prices.py and the typed line; four pieces from the inside out; the output; read_text.py TypeError |
| 25 | C15 | 3 | `FilterCards.tsx` `FilterCard` | the two lines and `filter(function, sequence)`; the funnel with six ratings, rating.py; the kept ones drop out, both outputs |
| 26 | E1 | 15 | `WhoCalls.tsx` | rating.py and the ratings row; thirteen walk presses, the arrow in and back; the closing line |
| 27 | C16 | 7 | `Reduce.tsx` | the line and the two code cards; total.py and the amounts; two joins; `710` and the note; dice_ways.py `216`; one item, no items, the small print |
| 28 | G2 | 30 | `InsideBuiltin.tsx` | four rounds: the vote, one spend per press, the print step, the verdict |
| 29 | T2 | 4 | `Tasks.tsx` `Task2` | month.py, the input, step 1, 5:00; step 2; step 1's terminal; step 2's terminal |
| 30 | X1 | 2 | `Exit.tsx` | big_orders.py, the question, four inputs, 2:30; every option's result and why |
| 31 | K1 | 7 | `Takeaways.tsx` | six empty rows; one example per press, its result on the press after |
| 32 | S-FEEDBACK | 0 | `FeedbackEmbedSlide` | |
| 33 | S-THANKYOU | 0 | `ThankYouSlide` | |

## Mistakes resolved in sessions 24 to 30, carried here on purpose

- Outputs never on a timer; a press that would reveal two things is two
  presses; the agenda static.
- K1's last result never stuck at `?` (a seventh press).
- A tall phone carries no label under it; every group ends at least 20px
  above Next; a group's height is fixed at its tallest press.
- Arrows: 9px heads in absolute units, the line's butt end at the head's base
  centre, a straight tail into the tip; an arrow in its own lane, never on a
  box; a highlight on its own bounds; a lit group's rim inset.
- Phones at 1 : 2.06 with the live clock; no `truncate`; every name whole; a
  phone's screen draws only the rows it has room for.
- No `transform: scale` on a drawn device (CSS `zoom` instead); nothing
  translated off a clipped screen stays mounted.
- Idling characters hold still on harness URLs, or screenshots never settle.
- Long error lines auto-fit in the output panel; one block per code line for
  align-check; prefixed React keys between sibling lists.
- The harnesses stop before the feedback slide (its frame never goes
  network-idle); the last two slides have no steps and are appended by hand.
- The auto-play menu option (29) and the restart on re-entry (30) both carried.

## Corrections, 2026-10-13

The user's list after the first build: no Dynamic Island on any mockup;
autoplay On on 3, 13 and 31; the sideways calculator screen filled (4, 7, 9);
the quiz slide replaced by the reference deck's (`new-template-working-with-lists`,
slide 19). The list named the quiz slide 13; it is slide 17 here, and 13 (C7)
got the autoplay the list asked for. Nothing else was touched.

## Verification, 2026-10-13 (built file `dist-single/python-session-31-python-standard-library.html`, 4.27 MB after the corrections; the quiz art is inlined now)

Run in full on the first build and again on the corrected one; every result below held both times.

- typecheck clean; reveal-step map measured: every card = its press count - 1
  (C10 7, C11 4, K1 6; agenda 0).
- `video-safe` CLEAN; `qa` flags only slide 1 (the Welcome baseline, NO LOGO).
- `align-check` 0 of 31; `mixed-align-check` 0 of 31.
- `controls-clear-check` CLEAR at every step of all 31 slides; every group
  ends at least 20px above Next (`.gap.mjs`).
- `box-overflow-check` NO OVERFLOW (the group rule active).
- `overlap-check`: only slide 1's decorative sparkle (baseline).
- `spec-check`, `feedback-check` (exact copy of session 18's),
  `gesture-check`, `agenda-check`, `ligature-check`, `autoplay-check` (this
  deck's list, the re-entry restart, the slide menu's option): all pass.
- Every card was screenshotted at every press, and looked at; no console
  error on any slide (`.keys.mjs`).
- Not run: `nav-stress-check`, WebKit. The harnesses stop at slide 31 because
  the feedback frame never goes network-idle.
