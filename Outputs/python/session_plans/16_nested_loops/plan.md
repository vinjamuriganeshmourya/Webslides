<!-- cSpell:ignore NxtWave devPort Starc Zampa Rohit Cricbuzz popt isdigit startswith Riya -->
# Python · Session 16: "Nested Loops"

**STATUS: SIGNED OFF 2026-10-01** ("Sign off, generate"), decisions 1 to 9 as
written, including rule 36 deck-wide (3), the one rule-2b sentence (4) and the
clickable, ungated options (5). Generation record at the foot of this file.

| | |
|---|---|
| `SESSION_NAME` | `Nested Loops` |
| `COURSE` | `Python` |
| Source | `prog_foundations_LP/16 - Nested Loops/16_nested_loops_student_view_fianl.html` (23 frames, 109 presenter states) and `16_nested_loops_student_handout.html` (the worksheet) |
| Not the source | `16_nested_loops_student_view_new_design.html`, the older cut: 24 frames, with "Nested loops" and "Follow the dot" as two cards. The final merges them into one "Follow the code: two overs" stage |
| Project | `Outputs/python/16_nested_loops/` |
| Deck file | `src/decks/nestedLoopsDeck.tsx` |
| Slide count | **23**, one per reference frame, in the reference's order |
| `devPort` | `5245` (free: the course uses 5228 to 5232 and 5244) |
| `htmlName` | `python-session-16-nested-loops` |

## Decisions to confirm

1. **Every reference frame is a slide, nothing dropped, nothing added.** No
   section dividers and no next-session frame, because the reference has none
   (as session 15). The four portal frames the reference redraws (Triangular
   Pattern, Input Format, Output Format, Wrong Iteration) are slides.
2. **Every code panel says `Python`** (content rule 31). The reference's
   invented file names (`overs.py`, `task1.py`, `m1.py` to `m4.py`,
   `triangle.py`, `a.py`, `b.py`, `p1.py` to `p3.py`, `highlights.py`) are not
   carried. **One exception to confirm:** slide 15 draws the Code Playground
   itself (Coding Practice · Loops · Question 4), and that product's editor tab
   really reads `main.py`. It stays on the drawn screen the way `notes.txt`
   stayed on session 15's document, because the picture is of the portal.
3. **Content rule 36 applied to every rendered line**: no line of slide copy
   ends in a full stop, and a caption that held two sentences becomes two lines
   in the same caption box. Not a word changes. This is the rule the user set
   on session 15's slide 7, so it is applied everywhere here rather than
   waiting for review. Code, output and the drawn portal's own copy are
   exempt (they are quoted, not slide copy).
4. **One sentence changes for content rule 2b** (never name another session).
   Slide 15, beat 2: *"Last session's trick repeats a string. The rows come out
   wrong."* Proposed: **"The `*` trick repeats a string. The rows come out
   wrong."** It names the operator the room used on the star triangle instead
   of naming when they used it. Commented in the deck file where it sits.
5. **The reference's controls stay, press for press.** Plain `Next` beats are
   the kit's build steps (arrow key and on-slide button press the same step).
   Slide 8's button is the same build step labelled `One step`. Slide 3's
   `Turn it over` flips **one card per press, three presses, then disables**
   (local state, measured on the reference). **On the reference, the options
   on slides 9, 19 and 20 are not clickable**: the A to D choices are static
   text, the room votes by hand, and `Next` runs the level whether or not
   anyone picked (measured). Here the options become clickable so the room's
   vote can be locked in and the confetti has something to fire on, but
   `Next` is **not** gated on a pick, so the instructor's flow is the
   reference's: hands up, press, run. (Session 15's slice machine gated Run;
   its reference did.)
6. **Added motion, in session 15's register, and not more than that.**
   Confetti across the whole slide when the room's pick is right (slides 9, 19,
   20). `Press` on every button. `Glow` on an output panel when a line arrives
   (7, 8, 16, 17). The card flip on slide 3. The cricket plan's "back up the
   arrow" drawn as the arrow travelling. Nothing self-advances; a press is the
   only thing that changes a frame (course rule R5c item 4).
7. **Key takeaways keep the reference's six example cards** (course rule R2),
   not a restatement of the four agenda items (content rule 20), as session 15
   did. Flagged, not hidden.
8. **No product mark.** The reference's app is never named on a frame ("the
   app", "a highlights app"), so content rule 12 does not fire. The phone and
   the scoreboard are drawn from tokens.
9. **Git is not touched** (as session 15). The working tree is on
   `deck/state-behaviour-constructor` with several thousand staged files that
   are not this work, so the branch-from-main procedure cannot run cleanly;
   the session folder stays untracked until the user says otherwise.

## Controls, measured on the reference

| Frame | Control | Behaviour |
|---|---|---|
| 3 | `Turn it over` / `Replay` | one card per press, three presses, button disables; local state, no build steps |
| 4, 7 | arrow key only (the stage has a dot rail, no buttons) | 20 build steps each, labelled by the reference's own `data-anim-labels` |
| 8 | `One step` / `Replay` | 16 build steps; the button and the arrow key press the same step |
| 9 | `Next` / `Replay`; options A to D are static text | 8 beats: vote, run, four times. `Next` runs with or without a pick |
| 14, 17, 20 | timer | 5:00, 4:00, 2:30, `Countdown`: nothing starts until the instructor presses play |
| 15, 16, 17, 21 | `Next` / `Replay` | 5, 8, 4, 6 build steps |
| 19 | `Next` / `Replay`; options static | 6 beats: vote, run, three times |
| 20 | `Next` / `Replay`; options static | 2 beats: vote, answer |

## Frameworks (gate check 1)

One framework per concept, the opening on a felt need, the close on something
observable. The reference packs a concept's opening into one 20-beat frame
rather than two slides; the two Situation beats are named below so the gate
can see both.

| Concept (agenda item) | Framework | S / Activation | T / Demonstration | A | R / close |
|---|---|---|---|---|---|
| 1 A Loop Inside a Loop | **STAR** | slide 4 beats 1 to 11 (the app counts an over) **and** beats 12 to 19 (*"after 0.6, what comes next?"*, *"how many balls?"*: a count the room cannot do by feel) | slide 4 beat 20: the shape, no code (*"Take the cricket out of the plan"*) | slide 7 beat 1: the six lines | slide 7 beats 2 to 20: the run, *"Line 4 ran 12 times"* |
| 2 How It Runs | **Merrill** | slide 8 beat 1: the room traces by hand, keyboards off, before any press | slide 8 beats 2 to 16: one line per press | slide 9: vote, then run, four levels | slide 10: the quiz |
| 3 The Number Triangle | **Merrill** | slides 11 to 13: the problem and its formats; slide 14: the room solves it first, 5 minutes | slide 15: why a loop inside a loop (move 4 in full: trick, long way, **what it costs**, shape); slide 16: written one line at a time | slide 14 (done before the demonstration, the reference's own order) | slide 16 beat 8: *"It prints, for 3"* |
| 4 Common Mistakes | **SCQA** | slide 17 beat 1: two programs, both plausible, predict | slide 17 beats 2 to 4 and slide 18: both wrong, and why | slide 19: *"How many stars?"*, three times, options on the frame, no answer | slide 19 runs with verdict and reason; slide 20 exit question; slide 21 takeaways |

## Term ledger (gate check 2)

| Term | Introduced | Plain words given there |
|---|---|---|
| over, ball | 4, beats 2 and 3 | the app counts overs, 20 of them; inside every over it counts balls, 1 to 6 |
| the plan (indented plain English) | 4, beat 1 | every over, 20 of them: a new bowler comes on; every ball, 1 to 6: bowl one ball |
| block | 4, beat 20 | Block 1 to Block 4: the four jobs in the plan, once the cricket is taken out |
| a loop inside a loop | 6 (agenda), drawn on 7 | the cricket plan from the start, now in Python |
| outer loop, inner loop | 16, lines 2 and 4 | one pass for each row; count from 1 up to this row's number |
| pass | 8 ("on every pass") and 21 | one time through the outer loop |
| `range(i)`, the inner range uses the outer variable | 8 | i is 1, so the inner range is range(1) |
| `while` loop | carried in from the loops session (session 14's recap) | used on 19 and 21; *"A while loop starts again only if you reset its counter"* |
| `input()`, `int()`, `str()`, `+` on strings | carried in (sessions 3 and 4) | used from slide 15 on |
| slicing, string methods | carried in (session 15), restated on 2 and 3 | |

Nothing arrives assembled (gate check 3): the six-line program is written one
line per beat on slide 16 before it is shown whole; the cricket plan is built
block by block on slide 4; every machine level shows its code and options first
and its run second.

## Outputs, all real runs (CPython 3.12.3, 2026-10-01)

| Program | Output |
|---|---|
| two overs (slide 7) | `New bowler`, `0 1` to `0 6`, `End of over`, `New bowler`, `1 1` to `1 6`, `End of over`, `2 overs done`: 17 lines, line 4 ran 12 |
| task 1 (slide 8) | `1 0` `2 0` `2 1` `3 0` `3 1` `3 2`: line 3 runs 6 times |
| machine level 1 to 4 (slide 9) | 12 lines · 8 lines · 6 lines (`0 1 2 1 2 2`) · `done` prints 3 times |
| one loop trick `print("1 " * i)`, n=3 (slide 15) | `1 `, `1 1 `, `1 1 1 ` |
| triangle, n=3 and n=4 (slide 16) | `1 `, `1 2 `, `1 2 3 ` (and `1 2 3 4 `); every row ends in a space |
| program A `range(1, num)`, n=3 (slides 17, 18) | `1 `, `1 2 `: two rows |
| program B `range(row_num)`, n=3 (slide 17) | `0 `, `0 1 `, `0 1 2 ` |
| p1, p2, p3 (slide 19) | 6 stars · 6 stars · 2 stars |
| highlights, overs = 2, 3, 7, 13 (slide 20) | 6, **12**, 36, 72 lines |
| six takeaways (slide 21) | 6 lines · 120 · 6 lines `1 0 2 0 2 1 3 0 3 1 3 2` · `done` three times · 2 stars · `1 / 1 2 / 1 2 3` |

The reference's stated numbers agree with every run. 5,050 is the sum 1 to 100.

## Slide by slide

`C` = `ContentSlide`, `P` = a panel on `SlideBase` + `ZonedFrame` (session 15's
`Panel`). Beats are build steps unless marked *local*. Copy is the reference's,
captured from the rendered page at every press (course rule R2), with rule 36
applied as decision 3 says.

### 1 · Welcome

`BrandSlide` greeting `Welcome`.

### 2 · Recap · Where We Left Off

`RecapSlide`, three points with subs:
`Slicing takes a part of a string` / `message[start:end:step] stops before end` ·
`String methods do ready made jobs` / `isdigit, strip, replace, startswith and upper` ·
`strip only touches the two ends` / `The characters in the middle stay`.

### 3 · Recap · Recap of string methods

P, lead `Say your answer first. Then we turn the card over.` Three cards, face
down, each a question; `Turn it over` flips the next one (*local*, 3 presses),
`Replay` turns them all back. The flip is a 3D turn on the card's own axis
(transform only, explanatory tier).

| Card | Question | Answer | Why |
|---|---|---|---|
| 1 | `What does "-R-a-v-i-"[1:8:2] give?` | `'Ravi'` | `Start at 1, jump by 2, stop before 8` |
| 2 | `What does "98.5".isdigit() give?` | `False` | `The dot is not a digit, so the answer is False` |
| 3 | `What does "ravi".upper() give?` | `'RAVI'` | `upper gives back a new string in capital letters` |

### 4 · Programming Foundations · Every ball has a number

P `CricketHook`, **20 beats**. Reason for the picture: to create a need (the
room counts balls the way the app does, before "nested" has a name). Outcome,
in the room's words: *"Six balls, twenty times, is a loop inside a loop."*
World picture, so drawn as the real object: a live-score card (flag, `IND`,
score, over line, `LIVE`, `This over` with six ball slots, `Overs` bar `n/20`)
over a cricket ground (SVG oval, pitch, fielders, no text) with the bowler and
batter named on it. Beside it: the numbered caption for the beat, the plan box
(indented plain English: an orange dashed outer frame for the overs, a blue
dashed inner frame for the balls, side notes `20 times` and `6 times, in every
over`), and four counters `New bowler` · `Balls bowled` · `Over ends` ·
`Innings over`.

| Beat | Label | Caption | What changes |
|---|---|---|---|
| 1 | India batting | `India are batting` / `Every ball gets a number on the app` | `IND 0-0 · Innings not started`, counters 0 0 0 0 |
| 2 | overs | `The app counts overs: 20 of them in a T20 innings` | the outer frame of the plan lights |
| 3 | balls | `Inside every over, it counts balls: 1 to 6` | the inner frame lights |
| 4 | over 1 starts | `Over 1 starts` / `Starc comes on to bowl` | `Over 1 · Starc bowling`, New bowler 1 |
| 5 | ball 0.1 | `Ball 1: 1 run` / `The app shows it as 0.1` | `1-0`, slot `0.1` = 1, Balls bowled 1 |
| 6 | ball 0.2 | `Back up the blue arrow` / `Ball 0.2: no run` | slot `0.2` = dot, Gill on strike, Balls 2 |
| 7 | ball 0.3 | `Back up the blue arrow` / `Ball 0.3: FOUR` | `5-0`, slot `0.3` = 4, Balls 3 |
| 8 | ball 0.4 | `Back up the blue arrow` / `Ball 0.4: 1 run` | `6-0`, Balls 4 |
| 9 | ball 0.5 | `Back up the blue arrow` / `Ball 0.5: no run` | Rohit on strike, Balls 5 |
| 10 | ball 0.6 | `Back up the blue arrow` / `Ball 0.6: 2 runs` | `8-0`, Balls 6 |
| 11 | end of over 1 | `No balls left in this over` / `End of over 1, 8 runs` | banner `End of over 1 · 8 runs`, Overs `1/20`, Over ends 1 |
| 12 | guess: next number | `Your guess: after 0.6, what number does the app show next?` | banner `After 0.6, what comes next?` |
| 13 | over 2 starts | `Back up the orange arrow` / `Over 2 starts: Zampa comes on` / `The balls start again from 1` | `Over 2 · Zampa bowling`, slots cleared, New bowler 2 |
| 14 | balls 1.1 to 1.6 | `Balls 1.1 to 1.6` / `Six balls, one more time` | `17-0`, slots 0 1 6 1 1 0, Balls 12 |
| 15 | end of over 2 | `End of over 2, 9 runs` | banner, Overs `2/20`, Over ends 2 |
| 16 | overs 3 to 20 | `Overs 3 to 20 go the same way: new bowler, six balls, over ends` | `176-5`, `Over 20 · Starc bowling`, slots `19.1` to `19.6`, Overs `20/20`, New bowler 20, Balls `?`, Over ends 20 |
| 17 | innings over | `No overs left` / `Innings over` | banner `Innings over · IND 176-5`, Innings over 1 |
| 18 | guess: how many balls | `Your guess: how many balls were bowled in the whole innings?` | Balls bowled stays `?` |
| 19 | 120 balls | `120 balls: 6 balls in each of the 20 overs` | Balls bowled `120`, `= 20 × 6` |
| 20 | the shape | `Take the cricket out of the plan, and this shape is left` | plan becomes `for item in sequence A:` / `Block 1` / `for item in sequence B:` / `Block 2` / `Block 3` / `Block 4`; counters become `Block 1 ran 20` · `Block 2 ran 120` · `Block 3 ran 20` · `Block 4 ran 1` |

The plan's four lines, verbatim: `every over, 20 of them:` → `a new bowler
comes on` → `every ball, 1 to 6:` → `bowl one ball` → `end of over, show the
runs` → `innings over`. "Back up the blue arrow" is drawn: the arrow inside
the inner frame travels back to its top on those beats; the orange one on
beat 13.

### 5 · Welcome to today's session · Nested Loops

`WelcomeSlide` minimal.

### 6 · Agenda · What We Will Cover

`AgendaSlide`: `A Loop Inside a Loop` / `What a nested loop is` ·
`How It Runs` / `Follow the code, line by line` ·
`The Number Triangle` / `A question you solve` ·
`Common Mistakes` / `Where a range goes wrong`.

### 7 · Code walkthrough · Follow the code: two overs

P `TwoOversWalk`, **20 beats**. Reason: a hidden process made visible. Three
columns: the program (six lines, `Python`), with `Block 1` to `Block 4` badges
on lines 2, 4, 5, 6 that become `ran 2` · `ran 12` · `ran 2` · `ran 1` by the
last beat, a loop-back mark on lines 1 and 3, and two variable boxes `over` and
`ball` under it (`not set yet`, then the value, with earlier values kept
greyed); a phone (session 15's `Phone`) showing the live app (`7:42`,
`IND vs AUS · 3rd T20I · Chennai`, tabs `Info Live Scorecard Squads`, the
score, the over banner, a `Commentary` list, bottom nav
`Home Matches Videos News More`), captioned `What the app shows`; an output
panel `Output · n lines` with a chip `line 4 ran n`, captioned `What the
program prints`. The numbered beat caption sits over the right two columns.

```
for over in range(2):
    print("New bowler")
    for ball in range(1, 7):
        print(over, ball)
    print("End of over")
print("2 overs done")
```

| Beat | Label | Caption | over / ball | App | Output adds |
|---|---|---|---|---|---|
| 1 | same plan in Python | `The cricket plan from the start, now in Python` / `Blocks 1 to 4 are the same` | not set | `0-0 · Waiting for the first ball` | `Nothing printed yet` |
| 2 | two overs | `This program follows two overs` / `Each press runs one print line` | | | |
| 3 | over 0: New bowler | `Line 1: over is 0` / `Line 2 prints New bowler` | 0 / not set | `Over 1 · Starc bowling` | `New bowler` |
| 4 | prints 0 1 | `Line 3: ball is 1` / `Line 4 prints 0 1, the app's 0.1` | 0 / 1 | `1-0`, `0.1 · Starc to Rohit, 1 run` | `0 1` |
| 5 | prints 0 2 | `Back to line 3: ball is 2` / `Line 4 prints 0 2` | 0 / 2 | `0.2 · Starc to Gill, no run` | `0 2` |
| 6 | prints 0 3 | `Back to line 3: ball is 3` / `Line 4 prints 0 3` | 0 / 3 | `5-0`, `0.3 · Starc to Gill, FOUR!` | `0 3` |
| 7 | prints 0 4 | `Back to line 3: ball is 4` / `Line 4 prints 0 4` | 0 / 4 | `6-0`, `0.4 · Starc to Gill, 1 run` | `0 4` |
| 8 | prints 0 5 | `Back to line 3: ball is 5` / `Line 4 prints 0 5` | 0 / 5 | `0.5 · Starc to Rohit, no run` | `0 5` |
| 9 | prints 0 6 | `Back to line 3: ball is 6` / `Line 4 prints 0 6` | 0 / 6 | `8-0`, `0.6 · Starc to Rohit, 2 runs` | `0 6` |
| 10 | End of over | `ball has no value left after 6` / `Line 5 prints End of over` | 0 / 6 | `End of over 1 · 8 runs` | `End of over` |
| 11 | over 1: New bowler | `Back to line 1: over is now 1` / `ball still says 6` / `Line 2 prints New bowler` | 1 / 6 | `Over 2 · Zampa bowling` | `New bowler` |
| 12 | prints 1 1 | `Line 3 starts again: ball is 1 again` / `Line 4 prints 1 1` | 1 / 1 | `1.1 · Zampa to Gill, no run` | `1 1` |
| 13 | prints 1 2 | `Back to line 3: ball is 2` / `Line 4 prints 1 2` | 1 / 2 | `9-0`, `1.2 · Zampa to Gill, 1 run` | `1 2` |
| 14 | prints 1 3 | `Back to line 3: ball is 3` / `Line 4 prints 1 3` | 1 / 3 | `15-0`, `1.3 · Zampa to Rohit, SIX!` | `1 3` |
| 15 | prints 1 4 | `Back to line 3: ball is 4` / `Line 4 prints 1 4` | 1 / 4 | `16-0`, `1.4 · Zampa to Rohit, 1 run` | `1 4` |
| 16 | prints 1 5 | `Back to line 3: ball is 5` / `Line 4 prints 1 5` | 1 / 5 | `17-0`, `1.5 · Zampa to Rohit, 1 run` | `1 5` |
| 17 | prints 1 6 | `Back to line 3: ball is 6` / `Line 4 prints 1 6` | 1 / 6 | `1.6 · Zampa to Rohit, no run` | `1 6` |
| 18 | End of over | `ball has no value left after 6` / `Line 5 prints End of over` | | `End of over 2 · 9 runs` | `End of over` |
| 19 | 2 overs done | `over has no value left after 1` / `Line 6 prints 2 overs done` | | | `2 overs done` |
| 20 | line 4 ran 12 | `Line 4 ran 12 times: 2 overs times 6 balls` | | | badges show `ran 2 · ran 12 · ran 2 · ran 1` |

The output panel glows as each line lands; the commentary row slides in with it.

### 8 · Worksheet · Task 1 · Trace it: the inner range uses i

P, **16 beats**, controls labelled `One step`. Left: the program (`Python`,
three lines) and under it `i` and `j` as value trails. Right on beat 1: the
worksheet brief and a **5:00** timer; from beat 2 the range cells
(`i in range(1, 4)` → `1 2 3`, the taken ones greyed, the current ringed;
`j in range(i)` → the cells for this pass), the output panel, and the caption.

```
for i in range(1, 4):
    for j in range(i):
        print(i, j)
```

Beat 1 brief: `Open Task 1 on your worksheet` · `Fill one row each time line 3
runs: the value of i, the value of j, and what it prints` · `Then type how many
times line 3 runs` · `Do not run it` / `Keyboards off when the timer ends`.

| Beat | Line | i / j | Caption | Prints |
|---|---|---|---|---|
| 2 | 1 | 1 / not reached yet | `i is 1, so the inner range is range(1)` | |
| 3 | 2 | 1 / 0 | `j takes 0` | |
| 4 | 3 | | `It prints` | `1 0` |
| 5 | 1 | 2 | `i is 2, so the inner range is range(2)` | |
| 6 | 2 | 2 / 0 | `j starts again at 0` | |
| 7 | 3 | | `It prints` | `2 0` |
| 8 | 2 | 2 / 1 | `j takes 1` | |
| 9 | 3 | | `It prints` | `2 1` |
| 10 | 1 | 3 | `i is 3, so the inner range is range(3)` | |
| 11 | 2 | 3 / 0 | `j starts again at 0` | |
| 12 | 3 | | `It prints` | `3 0` |
| 13 | 2 | 3 / 1 | `j takes 1` | |
| 14 | 3 | | `It prints` | `3 1` |
| 15 | 2 | 3 / 2 | `j takes 2` | |
| 16 | 3 | | `It prints` | `3 2` |

### 9 · Predict, then run · How many times does it run?

P `LoopMachine`, four levels, **vote then run** (move 6, strictly two beats per
level). The room's pick is *local*; the run is the `Next` press. Each run draws
one row per outer pass (`i = 0` …) and fills it with one dot per inner print
at reading pace, then the total, then the options turn right and wrong with
the reasons under the wrong ones. Confetti when the pick was right.

| Level | Program (`Python`) | Question | Options | Right | Rows | Reasons |
|---|---|---|---|---|---|---|
| 1 of 4 | `for i in range(3):` / `for j in range(4):` / `print(i, j)` | `How many lines does it print?` | A 7 · B 12 · C 3 · D 4 | **B, 12 lines** | i = 0, 1, 2: four dots each | `7: 7 adds 3 and 4. The inner loop runs 4 times on every pass, so it is 3 times 4` · `3: 3 is only the outer loop` · `4: 4 is only one pass of the inner loop` |
| 2 of 4 | `for i in range(2):` / `print("row")` / `for j in range(3):` / `print("*")` | same | A 6 · B 5 · C 8 · D 2 | **C, 8 lines** | i = 0, 1: `row` then three stars (legend `row` · `a star`) | `6: 6 counts the stars and forgets the two row lines` · `5: 5 adds 2 and 3` · `2: 2 is only the row lines` |
| 3 of 4 | `for i in range(4):` / `for j in range(i, 3):` / `print(j)` | same | A 12 · B 9 · C 6 · D 4 | **C, 6 lines** | i = 0 ···, i = 1 ··, i = 2 ·, i = 3 `nothing` | `12: 12 is 4 times 3, but the inner range gets shorter every pass` · `9: 9 forgets that range(3, 3) is empty` · `4: 4 is only the outer loop` |
| 4 of 4 | `for i in range(3):` / `for j in range(2):` / `print("*")` / `print("done")` | `How many times does done print?` | A 1 · B 6 · C 3 · D 2 | **C, 3 times** | i = 0, 1, 2: two stars and one `done` (legend `done` · `a star`) | `1: 1 would be right if done sat at the left edge, after both loops` · `6: 6 would be right if done sat under the inner loop` · `2: 2 is the inner loop's count` |

### 10 · Quiz time · Classroom Quiz

`QuizTimeSlide`, kicker `Quiz time`, subtitle `Time to check what you have
learned so far.`, steps `Open the quiz on your portal` · `Answer every question
on your own` · `We go through the answers together` (the reference's frame,
course rule R5d; rule 28's reason does not apply, as session 15 recorded).

### 11 · Question · Triangular Pattern with Numbers

C, lead `Write a program to print a triangle of numbers in N rows. The number N
is the input.` Two literal panels (session 14's `IoPanels`, copied): `INPUT 4`,
`OUTPUT` the four rows.

### 12 · Question · Input Format

C, lead `The first line has a positive integer.` `INPUT 3` / three rows.

### 13 · Question · Output Format

C, lead `Print a triangle of numbers. There is a space after every number.`
`INPUT 5` / five rows, and a `Note` callout: `Every number is followed by a
space, even the last one in a row`.

### 14 · Your turn · Solve it yourself first

P. Left: `Triangular pattern with numbers`, `INPUT 4` / `OUTPUT` four rows,
`There is a space after every number`. Right: `YOUR TURN · 5 MINUTES`, four
numbered lines (`Open the code playground` · `Write a program that reads N and
prints this triangle` · `Run it with 3, then with 4` · `Stuck? Write the rows
for 3 by hand first, then look for what repeats`), a **5:00** `Countdown`.

### 15 · The solution · Why a loop inside a loop?

P `PlaygroundStory`, **5 beats** (move 4 in full: the fourth beat, *what it
costs*, is the one that must not be cut). Left: the Code Playground drawn as
it looks (`Coding Practice · Loops · Question 4`, `▶ Run`, `Submit`, the
problem card with `SAMPLE INPUT 4` / `SAMPLE OUTPUT`, the `main.py` editor,
`YOUR OUTPUT` / `EXPECTED` panes, two test-case chips). Right: the five beat
lines, all visible, the current one bold (session 14's `BeatList`).

| Beat | Label | Line | Editor | Panes / chips |
|---|---|---|---|---|
| 1 | the question | `The question: print this pattern for any N` | `# write your code here` | chips `?` |
| 2 | the one loop trick | `The * trick repeats a string. The rows come out wrong` (decision 4) | `n = int(input())` / `for i in range(1, n + 1):` / `print("1 " * i)` | YOUR OUTPUT `1 / 1 1 / 1 1 1`, EXPECTED `1 / 1 2 / 1 2 3`, `✗ Test case 1 · input 3`, `? Test case 2 · input 4` |
| 3 | the long way | `Write every row by hand` / `It passes for 3 and fails for 4` | `print("1 ")` / `print("1 2 ")` / `print("1 2 3 ")` | `✓ Test case 1 · input 3`, `✗ Test case 2 · input 4: row 4 is missing` |
| 4 | what it costs | `For N = 100: 100 print lines and 5,050 numbers to type` | the three prints, `...`, `print("1 2 3 4 5 ... 100 ")` | two tiles: `100` `print lines`, `5,050` `numbers typed` |
| 5 | the shape | `Each row is its own count, from 1 up to the row number` | the plan box: `loop over the rows, 1 to N:` / `loop over one row, 1 up to the row number:` / `add the number to the row` / `print the row` | chips `?` |

### 16 · The solution · Writing it, one line at a time

P `LineByLine`, **8 beats**: `start` shows six empty ruled rows and the line
`Watch the program being written, one line at a time`; beats 2 to 7 fill one
line each with its caption; beat 8 `run it` adds `IT PRINTS, FOR 3`:
`1 ` / `1 2 ` / `1 2 3 `.

| Line | Code | Caption |
|---|---|---|
| 1 | `num = int(input())` | `Line 1` / `Read N, the number of rows` |
| 2 | `for row_num in range(1, num + 1):` | `Line 2` / `The outer loop: one pass for each row, from 1 up to N` |
| 3 | `    row_out = ""` | `Line 3` / `Start each row empty` / `This line runs again on every row` |
| 4 | `    for seq_num in range(1, row_num + 1):` | `Line 4` / `The inner loop: count from 1 up to this row's number` |
| 5 | `        row_out = row_out + str(seq_num) + " "` | `Line 5` / `Add the number and a space to the row` |
| 6 | `    print(row_out)` | `Line 6` / `Print the row once it is built` / `It sits under the outer loop only` |

### 17 · Possible mistakes · Predict, then run

P `TwoPrograms`, **4 beats** (predict / program A / program B / the fixes).
Lead `Worksheet task 2` / `Both programs get input 3` / `Type what each one
prints first` / `Then run them`. Two programs side by side, the changed line
marked (A line 2 `range(1, num)`, B line 4 `range(row_num)`), each with an
empty output panel and a **4:00** timer under A.

| Beat | Shows |
|---|---|
| 2 | A prints `1 ` / `1 2 ` and a dashed hole `the row you wanted` |
| 3 | B prints `0 ` / `0 1 ` / `0 1 2 ` |
| 4 | `Fix: range(1, num + 1)` / `range stops before num` under A; `Fix: range(1, row_num + 1)` / `range with one number starts at 0` under B |

### 18 · Possible mistakes · Wrong Iteration

C, lead `The input is 3, but only two rows come out.` The six-line program with
line 2 marked as the error, `INPUT 3` / `OUTPUT` `1 ` / `1 2 `.

### 19 · Any loop inside any loop · (title per program)

P `LoopMachine` again, three programs, **vote then run**, the slide title
changing with the program: `A while loop inside a for loop` →
`A for loop inside a while loop` → `A while loop inside a while loop`. Label
`PROGRAM n OF 3`, question `How many stars?`.

| Program | Code | Options | Right | Rows | Reasons |
|---|---|---|---|---|---|
| 1 | `for i in range(3):` / `j = 0` / `while j < 2:` / `print("*")` / `j = j + 1` | A 6 · B 3 · C 2 · D 5 | **A, 6 stars** | i = 0, 1, 2: two dots each | `3: 3 is only the outer loop` · `2: 2 is only one pass of the while loop` · `5: 5 adds 3 and 2. The while loop runs twice on every pass: 3 times 2` |
| 2 | `i = 0` / `while i < 2:` / `for j in range(3):` / `print("*")` / `i = i + 1` | A 5 · B 6 · C 3 · D 2 | **B, 6 stars** | i = 0, 1: three dots each | `5: 5 adds 2 and 3` · `3: 3 is only one pass of the for loop` · `2: 2 is only the while loop` |
| 3 | `i = 0` / `j = 0` / `while i < 3:` / `while j < 2:` / `print("*")` / `j = j + 1` / `i = i + 1` | A 6 · B 2 · C 3 · D 0 | **B, 2 stars** | i = 0: two dots; i = 1 `nothing`; i = 2 `nothing` | `6: 6 would be right if j = 0 sat inside the outer loop. Here j stays 2` · `3: 3 is only the outer loop` · `0: 0 forgets that j starts at 0, so the first pass does run` |

### 20 · Exit question · Which input prints 12 lines?

P, **2 beats** (vote / answer). Lead `A highlights app prints one line for
every ball it shows.` The program (`Python`, four lines), the question `Which
input prints exactly 12 lines?`, a **2:30** timer, four option cards
`overs = 2` · `overs = 3` · `overs = 7` · `overs = 13`, clickable so the room's
vote is locked in before the press (session 15's exit question). The answer
beat marks **B** and adds the reasons:

`range(1, 2) gives only 1, so one over: 6 lines` ·
`range(1, 3) gives 1 and 2, two overs of 6 balls: 12 lines` ·
`7 counts balls, not overs. range(1, 7) is six overs: 36 lines` ·
`13 treats every line as an over. That is 12 overs: 72 lines`.

Confetti if the pick was B.

### 21 · Key takeaways · Nested loops, in six examples

P, **6 beats**, a 3 × 2 grid of cards, one arriving per beat (the first on
landing), each with a coloured title bar, two or three code lines, the result
in mono and one sentence:

| # | Title | Code | Result | Sentence |
|---|---|---|---|---|
| 1 | `the inner loop restarts` | `for a in range(3):` / `for b in range(7, 9):` | `inner prints 2 lines on each of 3 passes: 6 in all` | `The inner loop runs all the way through on every pass of the outer loop` |
| 2 | `count it` | `for over in range(20):` / `for ball in range(1, 7):` | `120 balls` | `Lines inside both loops run outer count times inner count` |
| 3 | `inner uses outer` | `for i in range(1, 4):` / `for j in range(i):` | `6 lines: 1, then 2, then 3` | `The inner range can use the outer variable, so each pass can be a different length` |
| 4 | `indentation` | `for i in range(3):` / `for j in range(2): ...` / `print("done")` | `done prints 3 times` | `Indentation decides which loop a line belongs to` |
| 5 | `while needs a reset` | `while i < 3:` / `while j < 2:   # no j = 0 here` | `2 stars, not 6` | `A for loop starts again by itself` / `A while loop starts again only if you reset its counter` |
| 6 | `the triangle` | `for row_num in range(1, num + 1):` / `for seq_num in range(1, row_num + 1):` | `1 / 1 2 / 1 2 3` | `One loop for the rows, and a loop inside it to build each row` |

### 22 · Feedback

`FeedbackSlide`, title `We'd love your feedback`.

### 23 · Thank you

`ThankYouSlide`, `Thank you!`.

## Figures

Session-local, in `src/decks/figures/`, over session 15's shared pieces copied
in (`common.tsx`: `Panel`, `Boxes`, `CenteredLead`; `motion.tsx`: `Press`,
`Glow`, `Confetti`; `Phone.tsx`) and session 14's `BeatList` and `IoPanels`:

| Figure | Slides | New? |
|---|---|---|
| `FlipCards` | 3 | new |
| `CricketHook` (scoreboard, ground, plan box, counters) | 4 | new |
| `TwoOversWalk` (code with block badges, phone app, output) | 7 | new |
| `NestedTrace` (code, i/j trails, range cells, output) | 8 | new; `VarTrail`, `TraceCaption`, `OutputPanel` from the kit |
| `LoopMachine` (vote, run with dot rows, verdict) | 9, 19 | new; session 15's `SliceMachine` pattern |
| `PlaygroundStory` (drawn Code Playground) | 15 | new |
| `LineByLine` | 16 | new |
| `TwoPrograms` | 17 | new |
| `ExitVote` | 20 | session 15's `ExitQuestion` pattern |
| `Takeaways` | 21 | session 15's `MethodTakeaways` pattern |

None goes to the kit in this pass; promoting any is a kit PR with the user's
approval (generate-slides section 6). `Phone` is now used by two sessions and
is the first candidate.

## Not added

No dividers, no next-session frame, no quiz beyond the reference's one. If
wanted later: four `SectionBreakerSlide`s from the agenda array.

## Generation record, 2026-10-01

Done as written above. 23 slides, `Outputs/python/16_nested_loops/`, deck file
`src/decks/nestedLoopsDeck.tsx`, deliverable
`dist-single/python-session-16-nested-loops.html` (3.8 MB, self-contained,
no external script or stylesheet).

**Harnesses, final run:** `video-safe` CLEAN · `align-check` 0 of 23 ·
`qa` at its baseline (slides 1 and 23, both `NO LOGO` by design). `qa`'s
type-floor warnings remain on slides 4, 7 and 15 (drawn product screens) and
21 (the six dense takeaway cards); the session's `CLAUDE.md`, item 10,
records the acceptance. Every heading sits on one line (rule 35).

**Looked at, not only measured:** every slide at every build step (136
states), and the local-state panels played in the built file from `file://`
with the network blocked: `Turn it over` flips one card per press and
disables after three; the machines run with or without a pick; confetti
fires on a right pick on slides 9, 19 and 20 and not otherwise; zero page
errors.

**Changes to the reference's words, all recorded above:** rule 36 on every
line (decision 3) and the one rule-2b sentence on slide 15 (decision 4).
Four layout departures from the reference, none to content: on slide 7 the
beat caption sits under the code it narrates rather than over the phone, so
the phone clears the controls; on slide 17 the timer sits beside program A's
output and the fixes beside the outputs, because a row under them ran under
the controls; on slides 9 and 19 the pass labels (`i = 0` …) are visible from
the vote beat, as the reference's are; the recap on slide 2 shows its three
points at once, as the reference frame does.

## Review 2, 2026-10-01

Fixes from the user's slide-by-slide review, applied in the session only
(`Outputs/python/16_nested_loops/`): step controls (grey step button and a
filled Replay at the last beat, a session-local override of the kit's
`beats.tsx`); slide 3 on build steps so the arrow key flips; slide 4's bowling
animation, flow arrows and ball marker as the reference draws them; slide 7 in
the reference's layout with in-panel Block chips and coloured output; slide 8's
output panel pinned and unclipped; the machines' marks run in one second; slide
17's timer above the code, right-aligned, kicker `Worksheet Task-2`. Harnesses
after: `video-safe` CLEAN, `align-check` 0 of 23, `qa` at baseline (slides 1
and 23), the same five type-floor warnings as before (4, 7, 15, 17, 21).
Decision 5 above is amended for slide 3: the flips are build steps, not local
state.

## Review 3, 2026-10-01

Slide 2's header takes the brand tone like every other slide (a session-local
override of the kit's `RecapSlide`, which hardcodes the success tone). Slide 7
relaid for a phone of real proportions, fully visible, and an output panel
whose fixed height holds the whole run. Harnesses: `video-safe` CLEAN,
`align-check` 0 of 23, `qa` at baseline with the same five type-floor slides.
