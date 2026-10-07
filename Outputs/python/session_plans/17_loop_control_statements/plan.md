<!-- cSpell:ignore NxtWave devPort Ravi UPI Maggi popt -->
# Python · Session 17: "Loop Control Statements"

**STATUS: DRAFT, GENERATED UNDER THE USER'S BRIEF OF 2026-10-05, NOT
SEPARATELY SIGNED OFF.** The brief ("convert the reference deck into our
template, every interactive element carried over, built the way sessions 15
and 16 were built, output under `Outputs/`") fixes every decision a sign-off
would normally fix: one slide per reference frame, in the reference's order,
the reference's copy, the reference's controls, session 15's motion register.
The deck was generated in the same pass so the user reviews the plan and the
deck together. Anything below marked **confirm** is a judgement the brief did
not make and is the first thing to raise in review.

**Revision 1, 2026-10-06, signed off and built** (`plan.rev1.md` beside this
file holds the full slide specs): the pedagogy team's feedback on the deck
reworked the PIN hook, added three slides and folded two pass frames into a
game. The deck is **33 slides**. The sections below are the 2026-10-05 plan
with revision 1's changes marked where they land; the foot of the file has
the revision's record.

| | |
|---|---|
| `SESSION_NAME` | `Loop Control Statements` |
| `COURSE` | `Python` |
| Source | `Reference ppt's/17_loop_control_statements_student_view_new_design.html`: its presenter walks **32 cards** (`.slide, .pcard`), 20 activity panels and 12 of the original deck's own slides, 102 presenter states, rendered and captured card by card and state by state on 2026-10-05 |
| Project | `Outputs/python/17_loop_control_statements/` |
| Deck file | `src/decks/loopControlDeck.tsx` |
| Slide count | **33** since revision 1: the reference's 32 cards, less the two pass frames folded into the game, plus three slides from the 2026-10-06 feedback (was 32, one per reference card) |
| `devPort` | `5246` (free: the course uses 5228 to 5233, 5244, 5245) |
| `htmlName` | `python-session-17-loop-control-statements` |

## Decisions

1. **Every reference card is a slide, nothing dropped, nothing added** (as
   generated on 2026-10-05; revision 1 then added three slides and folded two
   away on the pedagogy team's own feedback, see the foot of this file). The
   reference's presenter list is `.slide, .pcard`: 20 activity panels and 12
   of the original deck's own slides (the dividers for Break, Continue and
   Pass; the six syntax frames; the three pass frames). **The first cut
   carried the 20 panels only**, because the capture enumerated `.pcard`
   alone, and the user caught it the same day ("you have missed these slides
   from the reference ppt: 8, 9, 10, 14, 19, 20, 21, 23, 24, 25, 26, 27").
   The lesson, for every reference from now on: **render from the presenter's
   own card list** (`document.querySelectorAll('.slide, .pcard')`, the list
   its `p-cell` grid is built from), compare the count against its own
   counter (`n / 32`), and never filter on one card class. The dividers are
   the reference's, so this deck has them; no next-session frame, because the
   reference has none.
2. **Every code panel says `Python`** (content rule 31). The reference's
   invented file names (`break.py`, `first_line.py`, `outside.py`,
   `outside2.py`, `task1.py`, `first_word.py`, `level1.py` to `level6.py`,
   `task3.py`, `results.py`) are not carried. Where the reference names a
   file in a sentence ("outside.py prints") the panel is named by its content
   instead ("With break", "With continue").
3. **Content rule 36 on every rendered line**: no line of slide copy ends in a
   full stop; a two-sentence caption is two lines in one box. Not a word
   changes. Code, output and the drawn phones' own copy are exempt.
4. **Template colours only, on every slide, from `src/design/tokens.ts`.** The
   reference paints its recap frame in green (kicker and bars) and its
   takeaway pills in its own grey, amber, red, purple and blue. Here the recap
   header takes the brand tone like every other slide (session 16's
   `RecapBrand` override of the kit's `RecapSlide`, which hard-codes the
   success tone), and the takeaway pills are `muted`, `warning`, `danger`,
   `brandDark` and `brand`. No hex literal from the reference enters the deck.
   The user set this on 2026-10-05 for every deck from now on; see the
   feedback note at the foot of this file.
5. **The reference's controls stay, press for press, and every interactive
   element is carried.** Plain `Next` beats are the kit's build steps (arrow
   key and on-slide button press the same step). The walkers' button is the
   same step labelled `One step`; the recap's is `Show me`. The two things the
   reference plays beyond Next are carried as local state: the **range slider
   on slide 8** (`break when i ==`, 0 to 10) that re-computes the walk, and the
   **timers** (`Countdown`: nothing starts until the instructor presses play).
   The machine (15) and the exit question (17) have static A to D text on the
   reference; here they are clickable so the room's vote is locked in and the
   confetti can fire, and `Next` is **not** gated on a pick (session 16,
   decision 5).
6. **Mobile mockup, not the reference's tablet-shaped one.** The reference
   draws both hooks on a 300 x 450 frame (1 : 1.5). Both screens are phone
   screens: a UPI pay sheet and a 3 x 4 PIN keypad on slide 4, a reels feed on
   slide 14. Session 15's `Phone` (232 x 478, 1 : 2.06, island, status bar,
   home bar) held exactly this PIN keypad on its slide 14, so it holds these.
   The phone is drawn at that size; nothing on either screen needed the
   wider frame.
7. **Added motion, in session 15's register, and not more.** `Press` on every
   button, `Glow` on an output panel when a line lands, slide-wide `Confetti`
   when the room's pick is right (15, 17). Nothing self-advances (course rule
   R5c item 4).
8. **No product mark.** The reels screen is drawn without the app's wordmark or
   glyphs (content rule 12 and course rule R5: a hand-drawn copy of a logo is
   not the fetched asset). The pay sheet draws a neutral bank glyph instead of
   the reference's hand-drawn bank badge; the bank's name stays as text in the
   screen's copy, where the reference has it. **Confirm.**
9. **Navigation: touchpad and touch, deck-wide, session-local.** The brief asks
   for two-finger horizontal swipe (touchpad) and left/right swipe (touch) on
   every deck from now on. The player (`src/deck/`) is kit-owned and a kit
   change is a PR, so this session carries `src/decks/figures/gestures.ts`,
   installed once from the deck file, which turns a gesture into the same
   plain arrow press the keyboard sends. Details under "Navigation" below.
   The kit PR note is in the session's `CLAUDE.md`.
10. **Git is not touched** (as sessions 15 and 16: the working tree is on
    `deck/state-behaviour-constructor` with thousands of staged files that are
    not this work).
11. **Pass gets no opening of its own, because the reference gives it none.**
    Flagged under the frameworks table. **Confirm** whether that stands.

## Controls, measured on the reference

| Frame | Control | Behaviour |
|---|---|---|
| 3 | `Show me` / `Replay` | 3 presses: what it prints; the wrong line and why; what it should print |
| 4, 14 | `Next` / `Replay` | 5 beats each |
| 7 | `Next` / `Replay` | 4 beats, one card per press |
| 8 | `One step` / `Replay`, **range slider** `break when i ==` 0..10 | 11 states at 2 (1 + 10 events); the slider re-computes the walk and returns it to its first state |
| 9 | `One step` / `Replay` | 5 states (1 + 4 events) |
| 10 | `Next` / `Replay` | 4 beats |
| 11 | `One step` / `Replay`, timer 5:00 | 18 states (1 + 17 events); the brief and timer on state 1 only |
| 12 | `Next` / `Replay`, timer 6:00 | 4 beats: the task; step 1; step 2; step 3 |
| 15 | `Next` / `Replay`, options A to D static | 12 beats: vote, run, six levels |
| 16 | `Next` / `Replay`, timer 5:00 | 4 beats: the task; pass; continue; break |
| 17 | `Next` / `Replay`, timer 2:30, options static | 2 beats: vote, answer |
| 18 | `Next` / `Replay` | 5 beats, one row per press |

## Frameworks (gate check 1)

| Concept (agenda item) | Framework | S / Activation | T | A | R / close |
|---|---|---|---|---|---|
| 1 Break | **STAR** | (revision 1) slide 4: the app running from its code (clicks 1 to 3), then the break: it pays twice (clicks 4, 5); slide 5 clicks 1 to 3: the fixes the room already has and what each costs (move 4) | slide 5 click 4: the plan, *leave straight away*, no syntax; slide 8 (where `break` sits among the control statements) | slide 10 click 1: the one new line; 11, 12 (the syntax), 13, 14, 15 (the walk, break as the first line, break outside a loop), 16 (in a nested loop) | slide 10 clicks 2 to 4: the hook's own program pays once and never asks again; slides 17 and 18: the room traces, then types and runs; slide 19 quiz |
| 2 Continue | **STAR** | slide 18 beats 1 to 3 (a reel swiped away) **and** beat 4 (*"Did the feed stop? No"*) | slide 18 beat 5 (the shape) | slides 20, 21 (the syntax), 22 levels 3 to 6, vote then run | slide 28 beat 3 (continue, typed and run); slide 29 exit question |
| 3 Pass | **4MAT** | (revision 1) rounds 1 and 2 of the game on slide 27 (the half-written program crashes; `pass` fills the block), after the definition on 26 | slide 26 (*pass holds the place of a block*), 28 (pass in a loop changes nothing) | slide 29 (the room types the three versions) | slide 31 row 1 |

Concept 3's two opening beats were the reference's own slides 25 and 26 and
are now rounds 1 and 2 of the game; the reference puts the definition before
the need and the feedback keeps that order (decision 1; revision 1 decision E,
still **confirm**).

## Term ledger (gate check 2)

| Term | Introduced | Plain words given there |
|---|---|---|
| control statement | 7 | *Control statements change the order your lines run in*; `if`, `while`/`for`, and today's `break`, `continue` |
| break | (revision 1) the plan's words *leave straight away* on 5 click 4; named on 8 (card 4) and the divider; first on screen on 10 click 1, chipped `new`; defined on 11 | 10 click 3: *leave now*; 11: *break makes the program leave a loop early*; 13: *Leave the loop right now* |
| continue | 7 (named beside break), 18 beat 5 (the shape), defined on 20 | *continue skips the rest of this pass. The loop starts its next pass* |
| pass | 24 | *pass holds the place of a block. When it runs, nothing happens* |
| SyntaxError | 13 | *Python checks the whole file before line 1 runs. It finds the mistake and runs nothing* |
| IndentationError | (revision 1) 27, round 1 | *Every colon needs a block under it* |
| `while … and …`, `!=`, `False`, a flag variable | carried in (conditions and loops); revision 1's slide 5 fixes are the room's own knowledge | |
| inner loop, outer loop, pass of a loop | carried in (nested loops, recap on 2) | |
| `range`, `while`, `for`, `if`, `input`, `str`, `.upper()` | carried in (loops, strings) | |

Nothing arrives assembled (gate check 3): every walk shows its program first
and runs it one line per press; every machine level shows code and options
before its run; the control-statements frame adds one card per press.

## Outputs, all real runs (CPython 3.12.3, 2026-10-05)

| Program | Output |
|---|---|
| recap, n = 3, line 4 `seq_num = row_num` | `` (empty) · `1` · `21` |
| recap fixed, `seq_num = n - row_num` | `321` · `21` · `1` |
| break when i == 2 (slide 8) | `0` `1` `End`; i == 0 gives `End`; i == 10 gives `0` to `9` then `End` (the break never fires) |
| break as the first line (9) | `End` |
| break at the left edge (10) | `SyntaxError: 'break' outside loop`; with continue: `SyntaxError: 'continue' not properly in loop` |
| task 1 (11; since 2026-10-06 line 6 prints `"inner : "` with no leading space) | `outer : 0` · `inner : 0` · `outer : 1` · `inner : 0` |
| task 2 (12), `Python is fun` | `PYTHON`; without lines 4 and 5: `PYTHON IS FUN`; `Hello`: `HELLO` |
| machine levels 1 to 6 (15) | `0 1 End` · SyntaxError, nothing prints · `0 2 End` · `End` · `0` then it never stops (killed after 1.5 s) · `0 0 / 0 2 / 1 0 / 1 2` |
| task 3 (16), input 5 | pass `0 1 2 3 4` · continue `0 1 2 4` · break `0 1 2` |
| exit (29) | A `50` · B `40` · C nothing · D `35` |
| growth-stage program with empty blocks (revision 1: slide 27 round 1) | `IndentationError: expected an indented block after 'if' statement on line 3` |
| pass in a loop, input 5 (28) | `0` `1` `2` `3` `4` |
| the PIN bug (4), inputs 1111, 4821, 4821 (revision 1, 2026-10-06) | `Incorrect PIN` · `Payment successful` · `Payment successful` |
| fix A, a while with two conditions (5), 1111, 4821 | `Incorrect PIN` · `Payment successful`, then it ends |
| fix B, a paid variable (5), 1111, 4821 | `Incorrect PIN` · `Payment successful`, then it ends |
| the PIN with break (10), 1111, 4821 | `Incorrect PIN` · `Payment successful`, then it ends |
| game round 2, pass in all three blocks, input 25 (27) | a blank line |
| game round 3, a comment under the if (27) | `IndentationError: expected an indented block after 'if' statement on line 2` |
| game round 4, pass in a loop, then Done (27) | `Done` |
| game round 5, pass on line 1 (27) | `Hi` |
| game round 6, pass at the left edge (27) | `IndentationError: expected an indented block after 'if' statement on line 2` |

The reference's stated answers agree with every run, and so do the feedback's.

## Slide by slide

`P` = a panel on `SlideBase` + `ZonedFrame` (session 15's `Panel`). Beats are
build steps unless marked *local*. Copy is the reference's, captured from the
rendered page at every press, with rule 36 applied (decision 3).

**Numbers here are the 2026-10-05 deck's.** Revision 1 (2026-10-06) reworked
4, added 4b, 8b and 24b, and removed 25 and 26; the current order is in the
revision section at the foot. The four revised entries below summarise
`plan.rev1.md`, which has every click.

### 1 · Welcome
`BrandSlide`, greeting `Welcome`.

### 2 · Recap · Where We Left Off
`RecapBrand` (brand tone), three points with subs:
`A nested loop is a loop inside a loop` / `The inner loop runs fully for every outer pass` ·
`The outer loop moves first` / `Then the inner loop starts again from the top` ·
`The end of a range decides the rows` / `A wrong end value gives a missing row`.

### 3 · Recap · Recap of nested loops
P `BugHunt`, 3 beats on `Show me`. Lead `One line is wrong` / `Write down its
number before we look`. The eight-line program (`Python`); two dashed panels
`It prints` and `It should print`.
Press 1: `It prints` fills, `(empty) / 1 / 21`. Press 2: line 4 is marked and
the why line arrives: `Line 4 starts each row at row_num, so the rows count
up: 0, 1, 2` / `It should start at n - row_num`. Press 3: `It should print`
fills, `321 / 21 / 1`.

### 4 · Programming Foundations · The PIN that keeps asking
**Revision 1 (2026-10-06).** P `PinHook` over the shared `PinStory` frame,
5 clicks. Left x 64..540: the seven-line program that runs the app
(`CodeBlock`, `Python`, 16px), the output pane under it (`OutputPanel`, fixed
height), and the ledger line `Paid so far ₹0 → ₹40 → ₹80`. Right x 740..1150:
the phone (`PinPhone`, session 15's `Phone` at 0.84) with the three try cards
in a row under it. The beat list and the app log are gone: the lit lines, the
phone, the pane and the cards carry the beats. A click lights its lines in
turn 600ms apart and the phone, pane and cards change with the line that
changes them.

| Click | Lines lit | Phone | Output pane | Cards |
|---|---|---|---|---|
| 1 | none | pay sheet | empty | `not yet` x3 |
| 2 | 3, then 7 | `Try 1 of 3`, dots, red refusal | `Incorrect PIN` | 1 `wrong PIN` |
| 3 | 3, then 5 | `Try 2 of 3`, then the receipt `₹40` | `+ Payment successful` | 2 `paid` |
| 4 | 3 | `Try 3 of 3`, the cursor | no change | 3 `asked again` |
| 5 | 5 | the receipt again | `+ Payment successful` | 3 `paid again` (danger) |

The plan moved to 4b. Notes carry the instructor guide's junior-developer
set-up line. The table that follows is the 2026-10-05 build, kept for the
record:

| Beat | Label | Line | Phone | Tiles | Log adds |
|---|---|---|---|---|---|
| 1 | Rs 40 for lunch | `₹40 for lunch` / `The app gives you 3 tries at your PIN` | pay sheet: `Ravi Canteen`, `Paying ₹40`, `Lunch`, bank `Savings •• 4821`, `PAY ₹40` | `Try 1` `Try 2` `Try 3`, all `not yet` | `Asked for the UPI PIN, try 1` |
| 2 | try 1: wrong PIN | `Try 1: a wrong PIN` / `It asks again` | PIN screen `Try 1 of 3`, four dots, `Incorrect UPI PIN. 2 attempts left.`, keypad | Try 1 `wrong PIN` (danger) | `Wrong PIN. Asked again, try 2` |
| 3 | try 2: paid | `Try 2: the right PIN` / `The money is paid` | `Payment Successful`, `₹40`, `Paid to Ravi Canteen`, `Done` | Try 2 `right PIN, paid` (success) | `Right PIN. ₹40 paid to Ravi Canteen` |
| 4 | then it asks again | `Then it asks for the PIN again. Why?` | PIN screen `Try 3 of 3`, cursor in the first box | Try 3 `asked again` (warning, `?`) | `Asked for the UPI PIN, try 3` |
| 5 | the shape behind it | `It should stop asking the moment the PIN is right` | the phone fades | Try 3 `never asked` (dashed) | the plan: `every try, up to 3:` → `ask for the UPI PIN` → `if the PIN is right:` → `pay, then leave straight away` → `show the receipt`, the arrow `leave now` |

### 4b · Hook · Fix it with what you know (revision 1, new)
P `PinFix`, 4 clicks. Left x 64..664: a label strip and one `CodeBlock`
(`Python`, 16px, `rows={10}`) whose program swaps per click: the bug; **fix A**
(a while with two conditions, lines 2, 3, 6 chipped `added`, line 4 `two
conditions`); **fix B** (a paid variable, lines 2, 4, 8 chipped `added`); the
bug again with line 5 marked. Right: click 1 `Fix it` pill, `Countdown` 2:00,
`Fix it with what you know` / `Pairs, on paper`; clicks 2 and 3 `ResultBox`
`It prints` → `Incorrect PIN` / `Payment successful` and the caption `It
works` / `Three new lines, and the test has two conditions`, then on 3 the
three try cards (`wrong PIN`, `paid`, `does nothing` faded) and `It works` /
`Try 3 still runs, and does nothing`; click 4 `One line that says leave now,
right here` over the `PlanBox` moved from slide 4 (`every try, up to 3:` →
`ask for the UPI PIN` → `if the PIN is right:` → `pay, then leave straight
away` → `show the receipt`, the arrow `leave now`).

### 5 · Welcome to today's session · Loop Control Statements
`WelcomeSlide` minimal.

### 6 · Agenda · What We Will Cover
`AgendaSlide`, three items: `Break` / `Leave the loop now` · `Continue` /
`Skip the rest of this pass` · `Pass` / `A block that does nothing`.

### 7 · Loops · Control Statements
P `ControlCards`, 4 beats. Lead `Control statements change the order your
lines run in` with the legend `next line` (brand) · `back to the top`
(accent) · `break: jump out` (success). Four cards, one arriving per beat into
its dashed slot: a mono title, a sentence, the numbered code, the flow drawn
beside the lines (SVG: a straight run down, a loop back up, a jump out), and
`lines run in this order` chips.

| Card | Title | Sentence | Code | Order |
|---|---|---|---|---|
| 1 | `plain` | `one line after another` | `print("A")` `print("B")` `print("C")` | 1 2 3 |
| 2 | `if-elif-else` | `picks one block, skips the rest` | `marks = 72` / `if marks >= 35:` / `print("pass")` / `else:` / `print("fail")` (4, 5 dimmed) | 1 2 3 |
| 3 | `while, for` | `goes back up and runs again` | `for i in range(2):` / `print(i)` / `print("done")` | 1 2 1 2 1 3 |
| 4 | `break, continue`, badge `today` | `changes the loop from inside` | `for i in range(5):` / `if i == 1:` / `break` / `print(i)` / `print("End")` | 1 2 4 1 2 3 5 (accent) |

### 8 · Divider · Break
`SectionBreakerSlide`, index 1, kicker `Loop Control Statements`, title `Break`
(reference card 8, the original deck's slide 15).

### 8b · Loop Control Statements · The PIN, with break (revision 1, new)
P `PinBreak` over `PinStory`, slide 4's layout, 4 clicks. The hook's program
with one new line, `break` on line 6, chipped `new` and tinted on click 1
before it runs. Click 2: lines 3, then 8; `Try 1 of 3` refused; `Incorrect
PIN`; card 1 `wrong PIN`. Click 3: lines 3, 5, then 6; `Try 2 of 3`, then the
receipt; `+ Payment successful`; card 2 `paid`; the green arrow draws from
line 6 past the last line, labelled `leave now` (slide 7's legend colour, the
plan's words). Click 4: nothing lights, card 3 `never asked`. The receipt is
the "Done screen" (revision 1 decision D). Slide 9's notes now say: *This is
the shape of what we just did. Line 6 of the PIN code is the break here.
Trace the green arrow with your hand.*

### 9 · Loop Control Statements · Break
`P` + `BreakShape` (`CodeBlock` with `lines`, `loop`, `labels`), centred. Lead
`break makes the program leave a loop early`. The shape:
`while condition_a:` / `statement_1` / `break` (marked) / `statement_2` /
`statement_after_loop` (warm), loop arrow on lines 1 to 2, labels `leave the
loop now` (3) · `never runs` (4) · `runs next` (5). Reference card 9, slide 16.

### 10 · Loop Control Statements · Break
`P` + `BreakInIf`. Lead `Most of the time, break sits inside an if` / `It runs
when the condition is True`. `for item in sequence:` / `statement_1` / `if
condition_b:` / `break` (marked) / `statement_2` / `statement_after_loop`
(warm), loop arrow 1 to 5, labels `is it True?` (3) · `yes: leave the loop`
(4) · `runs next` (6). Reference card 10, slide 17.

### 11 · Code walkthrough · Follow the break
P `BreakWalk`, 1 + N beats on `One step` (N = 10 at the slider's default of 2).
Left: the five-line program, the slider card `break when i ==` (*local*), the
key `ran` · `running now` · `never ran`, `i` as a value trail. Right:
`i in range(10)` as cells (taken ones faded, the one on now ringed; after the
break the cell is marked `break` and every cell after it `never`), the output
panel, the caption. State 1's caption: `Before we press: what will this print?
Say it out loud`. The events are computed from the slider's value, so every
position is a true run; moving the slider returns the walk to state 1.

| Event | Line | Caption | Prints |
|---|---|---|---|
| i takes k (k < n) | 1 | `i takes k` | |
| the test | 2 | `i == n is False, so its block is skipped` | |
| print | 4 | `It prints k` | `k` |
| i takes n | 1 | `i takes n` | |
| the test | 2 | `i == n is True` | |
| break | 3 | `break` / `Leave the loop right now` | |
| end | 5 | `It prints End` | `End` |

### 12 · Code walkthrough · Break as the very first line
P `FirstLineWalk`, 5 states on `One step`. The six-line program, `i` trail,
output, caption. State 1: `break is the first line inside the loop` / `What
will this print?`. Then: line 1 `i is now 0`; line 2 `i < 10 is True, so the
body runs`; line 3 `break is the first line of the body` / `The loop ends
here, before print(i) can run`; line 6 `It prints End` / `Lines 4 and 5 never
ran, and i stays 0`, lines 4 and 5 drawn dead.

### 13 · Loop Control Statements · Break outside a loop
P `OutsideLoop`, 4 beats. Left: two four-line programs, the second dimmed
until beat 4. Right: `Line 3 is break` / `What will this print?`, two dashed
result panels `With break` and `With continue`, the caption.
Beat 2: lines 1 and 2 of the first program chipped `inside the loop`, line 3
`outside the loop` and marked; caption `Line 3 starts at the left edge` / `So
break is not inside the loop`. Beat 3: `SyntaxError: 'break' outside loop`;
caption `Python checks the whole file before line 1 runs` / `It finds the
mistake and runs nothing` / `Not even 0`. Beat 4: the second program lights
with its line 3 marked, `SyntaxError: 'continue' not properly in loop`;
caption `continue is the same` / `break and continue work only inside a loop`.

### 14 · Loop Control Statements · Break in Nested Loop
`P` + `BreakNested`. Lead `break in the inner loop stops only the inner loop` /
`The outer loop goes on`. `for item_a in sequence_a:` / `for item_b in
sequence_b:` / `if condition:` / `break` (marked) / `statement_1` /
`statement_2` (warm), loop arrow 1 to 6, labels `inner loop` (2) · `leave the
inner loop` (4) · `outer loop goes on` (6). Reference card 14, slide 35.

### 15 · Worksheet · Task 1 · Trace it: break inside the inner loop
P `InnerBreakWalk`, 1 + 17 states on `One step`. Left: the six-line program,
`a` and `b` trails. State 1, right: `WORKSHEET · TASK 1`, `Open Task 1 on your
worksheet` · `Fill one row each time line 4 runs: a, b, does the break run,
and what line 6 prints` · `Then type everything it prints, in order` · `Do not
run it` / `Keyboards off when the timer ends`, the empty six-row table (`row
a b break? prints`), a 5:00 `Countdown`. From state 2: `a in range(2)` and
`b in range(4)` as cells, the output panel, the caption. Events, verbatim from
the reference: `a takes 0` · `It prints outer : 0` · `b takes 0` · `b == 1 is
False, so its block is skipped` · `It prints inner : 0` (no leading space
since 2026-10-06, see the foot) · `b takes 1` · `b ==
1 is True` · `break` / `Leave the loop right now` · `a takes 1` · … · `Nothing
is left in the range, so the loop ends`.

### 16 · Worksheet · Task 2 · First word in uppercase
P `FirstWordTask`, 4 beats. Left: the seven-line program, line 5 marked.
Right on beat 1: `WORKSHEET · TASK 2`, `Print the first word of a sentence in
capitals`, `Python is fun → PYTHON`, the three numbered steps (`Type it. Input:
Python is fun` · `Delete lines 4 and 5, the if and the break. Predict, then
run` · `Put them back. Input: Hello. Predict, then run`), `Type your answer
first` / `Then run`, a 6:00 `Countdown`. Beats 2 to 4: the three result
panels fill one per press (`Step 1, as it is` `PYTHON` · `Step 2, no if and no
break` `PYTHON IS FUN`, lines 4 and 5 drawn dead · `Step 3, input Hello`
`HELLO`), and from beat 3 the caption `Without the break, the loop does not
stop at the space, so every letter joins first_word`.

### 17 · Quiz time · Classroom Quiz
`QuizTimeSlide` as sessions 15 and 16 use it (course rule R5d).

### 18 · Before the next word · A reel you swipe away
P `ReelHook`, 5 beats. Left: `Phone` with the reels feed (reel 1 cricket on
green, reel 2 the noodles on orange, reel 3 the cat on blue; the beat-3 swipe
drawn as the screen moving up). Right: `StoryBeats`, three reel tiles with a
progress bar each, `What happened` log; beat 5 the plan.

| Beat | Line | Tiles | Log |
|---|---|---|---|
| 1 | `Instagram Reels` / `Reel 1 plays all the way to the end` | reel 1 full, `watched to the end` | `Reel 1: watched to the end` |
| 2 | `Reel 2 starts` / `At 0:03 you do not like it` | reel 2 bar at 0:03, `playing, 0:03` | `Reel 2: swiped away at 0:03` |
| 3 | `You swipe up` / `The rest of reel 2 never plays` / `Reel 3 starts` | reel 2 `rest of it never played` (dashed rest), reel 3 `playing from 0:00` | `Reel 3: starts from 0:00` |
| 4 | `Did the feed stop? No` / `Only reel 2 was cut short` | reel 3 `watched to the end` | `The app is still open. The feed carries on` / `Closing the app would stop the whole feed` |
| 5 | `Skip the rest of this one` / `Go back to the top for the next` | | the plan: `every reel in the feed:` → `if you do not like it:` → `swipe up, go to the next reel` → `watch the rest of it`; `close the app` outside; the `back to the top` arrow |

### 19 · Divider · Continue
`SectionBreakerSlide`, index 2, `Continue` (reference card 19, slide 57).

### 20 · Loop Control Statements · Continue
`P` + `ContinueShape`. Lead `continue skips the rest of this pass` / `The loop
starts its next pass`. `while condition_a:` / `statement_1` / `continue`
(marked) / `statement_2` / `statement_after_loop`, loop arrow 1 to 3, labels
`back to the top` (3) · `skipped this pass` (4). Reference card 20, slide 58.

### 21 · Loop Control Statements · Continue
`P` + `ContinueInIf`. Lead `Most of the time, continue sits inside an if` / `It
runs when the condition is True`. `for item in sequence:` / `statement_1` /
`if condition:` / `continue` (marked) / `statement_2` / `statement_after_loop`,
loop arrow 1 to 4, labels `is it True?` (3) · `yes: next pass` (4) · `skipped
this pass` (5). Reference card 21, slide 59.

### 22 · Predict, then run · Break or continue: what prints?
P `ControlMachine`, six levels, **vote then run** (move 6). The pick is
*local*; the run is the press. Left: `LEVEL n OF 6 · <name>`, the program.
Right: `What does it print?`, four options in a 2 x 2 grid, the output panel
(error-toned on level 2), then the reasons under the wrong options.

| Level | Name | Program | Options | Right | Output | Reasons |
|---|---|---|---|---|---|---|
| 1 | break in a while loop | `i = 0` / `while i < 10:` / `if i == 2:` / `break` / `print(i)` / `i = i + 1` / `print("End")` | A `0 1 2 End` B `0 1` C `0 1 End` D `0 1 2 3 4 5 6 7 8 9 End` | **C** | `0` `1` `End` | `0 1 2 End: break runs before print(i), so 2 is never printed` · `0 1: break leaves the loop, not the program. End is outside the loop, so it still runs` · `0 1 2 3 4 5 6 7 8 9 End: That is the loop with no break at all` |
| 2 | break outside a loop | `for i in range(10):` / `print(i)` / `break` / `print("End")` | A `0 1 2 3 4 5 6 7 8 9 End` B `0 1 2 3 4 5 6 7 8 9` C `0 End` D `Error. Nothing prints` | **D** | `SyntaxError: 'break' outside loop` | `…End: Line 3 is not inside the loop, so there is no loop for it to leave` · `0 1 2 3 4 5 6 7 8 9: It does not get that far. Python checks the whole file before line 1 runs` · `0 End: break is not inside the loop, so it cannot cut the loop short` |
| 3 | continue | `for a in range(3):` / `if a == 1:` / `continue` / `print(a)` / `print("End")` | A `0 End` B `0 2 End` C `0 1 2 End` D `2 End` | **B** | `0` `2` `End` | `0 End: That is what break would do. continue carries on with 2` · `0 1 2 End: continue skips print(a) when a is 1, so 1 is missing` · `2 End: Only a == 1 is skipped. 0 still prints` |
| 4 | continue comes first | `for a in range(3):` / `continue` / `print(a)` / `print("End")` | A `0 1 2 End` B `nothing` C `Error. Nothing prints` D `End` | **D** | `End` | `0 1 2 End: continue runs first on every pass, so print(a) is never reached` · `nothing: The loop still ends after 3 passes, and then End prints` · `Error. Nothing prints: continue is inside the loop, so this is fine. No error` |
| 5 | continue before the update | `i = 0` / `while i < 3:` / `if i == 1:` / `continue` / `print(i)` / `i = i + 1` | A `0 2` B `0 1 2` C `0, then it never stops` D `0` | **C** | `0` then `… still running. It never stops.` | `0 2: continue jumps back before i = i + 1, so i stays 1 for ever` · `0 1 2: When i is 1, print(i) is skipped` · `0: It prints 0 and then does not stop. The condition keeps being True` |
| 6 | continue in the inner loop | `for a in range(2):` / `for b in range(3):` / `if b == 1:` / `continue` / `print(a, b)` | A `0 0 / 1 0` B `0 0 / 0 2 / 1 0 / 1 2` C `0 0 / 0 2` D `0 0 / 0 1 / 0 2 / 1 0 / 1 1 / 1 2` | **B** | `0 0` `0 2` `1 0` `1 2` | `0 0 / 1 0: That is break. continue carries on with b = 2` · `0 0 / 0 2: continue only skips one pass of the inner loop. The outer loop still runs a = 1` · `…: That is the loop with no continue` |

Confetti across the slide when the pick was right.

### 23 · Divider · Pass
`SectionBreakerSlide`, index 3, `Pass` (reference card 23, slide 75).

### 24 · Empty blocks · Pass
`P` + `PassShape`. Lead `pass holds the place of a block` / `When it runs,
nothing happens`. `if condition_a:` / `block_1` / `elif condition_b:` / `pass`
(marked) / `else:` / `block_3`, beside a `Callout` (note) `When do we use it?`
/ `When we want to test our code before the whole code is written`. Reference
card 24, slide 76.

### 24b · Predict, then run · Runs or crashes? (revision 1, new)
P `PassGame`, six rounds, **12 clicks, two per round** (vote, then run), in
the machine's frame. Left x 64..604: `Round n of 6`, the `CodeBlock`
(`Python`, 16px, `rows={9}`), and for round 2 an `Input` panel `25`. Right: a
six-slot round strip that fills `Runs` / `Crashes` after each run, `Runs or
crashes?` with a `Countdown` 0:05 (press to start), two big buttons `Runs`
(thumbs up) and `Crashes` (thumbs down), clickable, local, `Next` not gated,
the `OutputPanel` (fixed height, `error` with the `if` line the message names
tinted), one reason line. Confetti when the pick was right.

| Round | Code | Answer | Shows | Reason |
|---|---|---|---|---|
| 1 | the growth-stage program, empty blocks (old slide 25) | Crashes | `IndentationError … on line 3` | `Every colon needs a block under it` |
| 2 | the same with `pass` in all three blocks, input `25` (old slide 26's fix) | Runs | a blank line | `pass fills the block and does nothing` |
| 3 | `marks = 72` / `if marks >= 35:` / `    # write this later` / `print("Checked")` | Crashes | `… on line 2` | `Python skips comments, so the block is still empty` |
| 4 | `for i in range(3):` / `    pass` / `print("Done")` | Runs | `Done` | `The loop runs 3 times and does nothing each time` |
| 5 | `pass` / `print("Hi")` | Runs | `Hi` | `Unlike break and continue, pass works outside a loop` |
| 6 | `marks = 72` / `if marks >= 35:` / `pass` / `print("Checked")` | Crashes | `… on line 2` | `pass has to be indented to be in the block` |

### 25, 26 · if-elif-else · Pass (removed in revision 1)
The growth-stage program and its empty-block error (reference cards 25 and 26,
`PassGrowth`, `PassEmptyBlocks`) are rounds 1 and 2 of the game above;
`You cannot leave a block empty` is round 1's reason.

### 27 · Loop Control Statements · Pass
`P` + `PassInLoop`. Lead `pass does nothing, so 3 is still printed`. `n =
int(input())` / `for i in range(n):` / `if i == 3:` / `pass` (marked) /
`print(i)`, loop arrow 2 to 5, beside `Input` `5` and `Output` `0 1 2 3 4`.
Reference card 27, slide 84.

### 28 · Worksheet · Task 3 · One line, three words
P `ThreeWordsTask`, 4 beats. Left: the five-line program, line 4 marked, its
word changing with the beat (`pass`, `continue`, `break`). Right: `WORKSHEET ·
TASK 3`, `Type it. The input is 5` · `Line 4 is pass. Predict, then run` ·
`Change it to continue. Predict, then run` · `Change it to break. Predict,
then run`, a 5:00 `Countdown`, three result rows (`pass`, `continue`, `break`)
filling one per press: `0 1 2 3 4` · `0 1 2 4` · `0 1 2`.

### 29 · Exit question · Which list shows nothing?
P `ExitVote`, 2 beats (vote, answer). Lead `A results app reads marks until it
meets a minus number` / `It shows only the pass marks`. The six-line program,
`Which list makes it show nothing at all?`, a 2:30 `Countdown`, four option
cards `marks = [50, -1, 20]` · `marks = [20, 30, 40]` · `marks = [20, -1, 50]`
· `marks = [35, 10, -1]`, clickable. The answer beat marks **C** and adds the
reasons: `50 prints first. break stops the loop, but it cannot take back what
is already printed` · `continue skips 20 and 30 but the loop carries on, so 40
prints` · `20 is skipped by continue, then -1 hits break. 50 is never read.
Nothing prints` · `35 is not less than 35, so it prints. Then 10 is skipped and
-1 ends the loop`. Confetti if the pick was C.

### 30 · Key takeaways · break, continue and pass, in five examples
P `Takeaways`, 5 beats, one row per press into its dashed slot: a pill, the
code, `→`, the result, the sentence.

| # | Pill (tone) | Code | Result | Sentence |
|---|---|---|---|---|
| 1 | `pass` (muted) | `if i == 3:` / `pass` | `0 1 2 3 4` | `pass does nothing` / `It only fills a block that cannot be empty` |
| 2 | `continue` (warning) | `if i == 3:` / `continue` | `0 1 2 4` | `continue skips the rest of this pass` / `3 is never printed` |
| 3 | `break` (danger) | `if i == 3:` / `break` | `0 1 2` | `break leaves the loop` / `3 and 4 never come` |
| 4 | `break inside` (brandDark) | `for b in range(4):` / `if b == 1: break` | `outer : 0 / inner : 0 / outer : 1 / inner : 0` | `break leaves only the loop it sits in` / `The outer loop carries on` |
| 5 | `outside a loop` (brand) | `for i in range(10):` / `print(i)` / `break` | `SyntaxError: 'break' outside loop` | `break and continue work only inside a loop` / `Nothing runs at all` |

Course rule R2 keeps the reference's five example rows rather than restating
the three agenda items (content rule 20); flagged, as session 16 flagged it.

### 31 · Feedback
`FeedbackSlide`, `We'd love your feedback`.

### 32 · Thank you
`ThankYouSlide`, `Thank you!`.

## Navigation (decision 9)

`src/decks/figures/gestures.ts`, installed once when the deck module loads.
Keyboard is untouched. A recognised gesture dispatches the same plain
`ArrowRight` / `ArrowLeft` the keyboard sends, so it does exactly what the
arrow keys do in whichever mode the pill shows (slides by default), and the
picker's own guard still applies.

- **Touchpad**: a `wheel` event whose horizontal delta dominates its vertical
  one. Deltas accumulate within a gesture; at 60px the slide changes once and
  the gesture is locked until no horizontal wheel has arrived for 300ms and at
  least 650ms have passed, which swallows the trackpad's inertia tail. The
  event is cancelled so the browser cannot read it as history navigation.
  Vertical wheel is never touched. A wheel over an element that can itself
  scroll horizontally (a wide code panel) is left to that element.
- **Touch**: one finger, measured from `touchstart` to `touchend`: at least
  60px horizontally, more than 1.5 times the vertical travel, within 800ms.
  Swipe left is next, swipe right is previous. One gesture, one slide, by
  construction. Taps, vertical scrolls, two-finger touches and anything that
  starts on a button, a slider, a link, a text field, the marker's ink layer
  or the deck's own control bar are ignored.

## Figures

Session-local, in `src/decks/figures/`, over the pieces carried from sessions
15 and 16 (`common.tsx`, `motion.tsx`, `controls.tsx`, `RecapBrand.tsx`,
`Phone.tsx`, `BeatList.tsx`):

| Figure | Slides | New? |
|---|---|---|
| `BugHunt` | 3 | new |
| `StoryBeats`, `PlanBox` (shared by the two hooks) | 4, 14 | new |
| `PinHook` | 4 | new; session 15's `PinStory` keypad |
| `ControlCards` | 7 | new |
| `Walk` (the walker: code, trails, cells, output, caption) with `BreakWalk`, `FirstLineWalk`, `InnerBreakWalk` | 8, 9, 11 | new; session 16's `NestedTrace` pattern |
| `OutsideLoop` | 10 | new |
| `FirstWordTask`, `ThreeWordsTask` | 12, 16 | new |
| `ReelHook` | 14 | new |
| `ControlMachine` | 15 | session 16's `LoopMachine` pattern |
| `ExitVote` | 17 | session 16's `ExitVote` pattern |
| `Takeaways` | 18 | new |
| `Syntax` (`BreakShape`, `BreakInIf`, `BreakNested`, `ContinueShape`, `ContinueInIf`, `PassShape`, `PassInLoop`; `PassGrowth` and `PassEmptyBlocks` until revision 1) | 9, 10, 14, 20, 21, 24, 27 | the kit's `CodeBlock` (`lines`, `loop`, `labels`), `Callout`, `OutputPanel`; nothing new |
| `gestures.ts` | all | new |
| `PinPhone` (the app's six screens on session 15's `Phone`, scaled), `PinStory` (the code-beside-the-phone frame: frames per click, lit lines, output pane, try cards, ledger, jump-out arrow) | 4, 8b | revision 1, new |
| `PinFix` | 4b | revision 1, new |
| `PinBreak` | 8b | revision 1, new |
| `PassGame` | 24b | revision 1, new; `ControlMachine`'s pattern with two buttons and a round strip |

None goes to the kit in this pass; promoting any is a kit PR with the user's
approval. `Phone` is now in three sessions, `controls.tsx` and `RecapBrand`
in two, and `gestures.ts` is wanted on every deck: the four kit PR candidates.

## Not added

No next-session frame and no quiz beyond the reference's one. The dividers
are the reference's own (cards 8, 19, 23).

## Feedback recorded for the user, 2026-10-05

Two instructions in the brief hold for every deck from now on and are not yet
written in a rule file, because recording a rule is the user's call
(`CLAUDE.md`, "Feedback becomes a written rule, with the user's consent"):

1. **Template colours only, never the reference's.** Proposed home:
   `.claude/skills/slide-content-rules/SKILL.md`, as a new rule, with this
   deck's recap header as the reason (the kit's `RecapSlide` paints it green,
   which read as a reference colour).
2. **Touchpad and touch navigation on every deck.** Proposed home: the kit
   (`src/deck/Deck.tsx`, via a `kit/` PR), and one line in
   `.claude/skills/generate-slides/SKILL.md` section 7 asking for the three
   navigation methods to be checked.

## Generation record, 2026-10-05

Done as written above. 20 slides, `Outputs/python/17_loop_control_statements/`,
deck file `src/decks/loopControlDeck.tsx`, deliverable
`dist-single/python-session-17-loop-control-statements.html` (3.8 MB,
self-contained, no external script or stylesheet).

**Harnesses, final run:** `video-safe` CLEAN · `align-check` 0 of 20 · `qa` at
its baseline (slides 1 and 20, both `NO LOGO` by design). `qa`'s type-floor
warnings remain on slides 4, 7, 8, 10, 11, 14, 16 and 18; the session's
`CLAUDE.md`, item 12, says what each is and why it stays. Every heading sits
on one line (rule 35). The reveal-step map was regenerated
(`0 0 3 4 0 0 3 10 4 3 14 0 0 4 11 3 1 4 0 0`).

**Looked at, not only measured:** every slide fully revealed, and the stepped
slides at their first, middle and last beats (the hooks at every beat), from
the dev server; and the built file from `file://` with the network blocked,
driven by a script: the keyboard, a trackpad burst with an inertia tail (one
gesture, one slide, in both directions), a vertical wheel (nothing), a touch
swipe each way, a tap and a vertical scroll (nothing), the slide-8 slider
(recomputes the walk for `i == 0`, resets to state 1, a swipe starting on it
does not change slide), the machine (four clickable options, a right pick
runs and fires 96 pieces of confetti, a swipe starting on an option does not
change slide), the exit question (a wrong pick fires nothing), and a timer
(still 5:00 after 2.5 s untouched). Zero page errors.

**Changes to the reference's words, all recorded above:** rule 36 on every
line (decision 3); file names dropped from the panels (decision 2). Layout
departures, none to content: the walkers' caption sits under the code it
narrates, as session 16's did; the machine's reasons sit under the output
rather than beside it; the takeaways are five rows rather than the
reference's five tiles, so each row's code, result and sentence read at 15px
or more; the hooks' phone is session 15's handset, not the reference's wider
frame (decision 6).

**Deviations from the template:** `src/decks/figures/gestures.ts` injects two
CSS rules into the document head (`overscroll-behavior-x: none` and
`touch-action: pan-y pinch-zoom` on the body) because the kit's `index.css` is
kit-owned; a swipe right otherwise leaves the deck through the browser's own
history gesture. `motion.tsx` and `controls.tsx` are the same session-local
overrides sessions 15 and 16 carry.

## Correction, 2026-10-05 (same day)

The user: *"you have missed these slides from the reference ppt: 8, 9, 10,
14, 19, 20, 21, 23, 24, 25, 26, 27 … don't miss any content or slide from
the reference."* Cause: the capture script enumerated `.pcard` only; the
reference's presenter walks `.slide, .pcard`, and the twelve `.slide` cards
are the original deck's own frames. All twelve added at their positions
(decision 1 above says how to not repeat this). Now 32 slides.

**Harnesses after:** `video-safe` CLEAN · `align-check` 0 of 32 · `qa` at its
baseline (slides 1 and 32); the same eight type-floor slides as before,
renumbered (4, 7, 11, 13, 15, 18, 28, 30), none of them a new frame. Reveal
steps regenerated for 32. The built file re-tested from `file://` (keyboard,
trackpad, touch, the slider on 11, the machine on 22, the exit vote on 29,
the timer on 15): all as before, zero page errors. Every new frame looked at.

## Alignment fix, 2026-10-05

The user, on slides 9, 10, 21, 24 to 27: *"the first line of content is
left-aligned in the content area, but the code boxes and everything below the
first line are centre-aligned."* Cause: `figures/Syntax.tsx` centred its code
figure (`mx-auto`, `w-fit`) under the kit's left-aligned lead. All nine frames
drawn by it (9, 10, 14, 20, 21, 24 to 27) are code explanations, so they are
left-aligned as a whole now, at x 64 like every other code slide; the fix is
in the component, and no other slide, size or spacing changed. Recorded as
content rule 38 with the user's say-so; `mixed-align-check.mjs` (session root,
kit PR `kit/mixed-align-check`) is the sweep that catches it, and it reads
0 of 32. `video-safe` CLEAN, `align-check` 0 of 32, `qa` at baseline with the
same eight type-floor slides. Deliverable rebuilt.

## Revision 1, 2026-10-06: the pedagogy team's feedback, built

Source: `Reference ppt's/Loop Control Statements FEEDBACK.pdf`. Plan:
`plan.rev1.md` beside this file, signed off the same day (user: *"do what
ever needed"*, decisions A to H as proposed). Out of scope on the user's word:
the student-view HTML files, the handout, the task 2 note in the instructor
guide; the guide's minute marks were not edited because the guide is not in
this repo (`~/Downloads/Programming_Foundations_LP/Plans/17 - Loop Control
Statements/`).

**Deck order now (33):** 1 welcome · 2 recap · 3 recap-bug · **4
pin-that-keeps-asking** (reworked) · **5 pin-fix-it** (new) · 6 todays-session
· 7 agenda · 8 control-statements · 9 divider-break · **10 break-pin-replay**
(new) · 11 break-shape (notes) · 12 break-in-if · 13 follow-the-break · 14
break-first-line · 15 break-outside-a-loop · 16 break-nested · 17 task-1 · 18
task-2 · 19 classroom-quiz · 20 reel · 21 divider-continue · 22 continue-shape
· 23 continue-in-if · 24 machine · 25 divider-pass · 26 pass-shape · **27
pass-runs-or-crashes** (new; `pass-growth` and `pass-empty-blocks` removed) ·
28 pass-in-loop · 29 task-3 · 30 exit-question · 31 takeaways · 32 feedback ·
33 thank-you.

**Built as planned, with these recorded differences from `plan.rev1.md`:**
the code panels on 4, 5 and 10 are all 16px (the revision said 17 on slide 4)
so the same program reads the same size across the three slides; the try
cards on 4 and 10 read `paid` rather than `right PIN, paid`, the feedback's
own word, so three cards fit in 410px under the phone; slide 5's left panel is
600px wide (not 536) so the `two conditions` chip clears the end of the while
line; the phone sits at x 850..1045, the cards at x 740..1150, short of the
footer mark (x 1172+).

**Harnesses, 2026-10-06:** `video-safe` CLEAN · `align-check` 0 of 33 ·
`mixed-align-check` 0 of 33 · `qa` at its baseline (slides 1 and 33 `NO
LOGO`), type-floor warnings on 4, 5, 8, 10, 13, 15, 17, 20, 27, 29, 31 (the
old eight renumbered, plus 5 for the plan's 14px chips that used to be on 4,
10 for the second phone, 27 for the 13px round strip) · `ligature-check` every
operator separate, 12 slides with operators · `agenda-check` passes (now
driven at slide 7, `AGENDA_SLIDE` overrides) · `phone-nav-check` passes at all
twelve sizes · `gesture-check` (copied from session 18, touch section started
on slide 4) passes · reveal steps regenerated for 33 (`4:4 5:3 10:3 27:11`) ·
`npm run typecheck` clean · the built file driven from `file://` with the
network blocked (`feedback-check.mjs`): slide 4 prints twice and the ledger
reads ₹80, slide 5's 2:00 timer and slide 27's 0:05 timer wait for their
press, slide 5 ends on the plan, slide 10 pays once with try 3 `never asked`,
a right pick fires confetti and a wrong pick or no pick does not, 12 beats
stay on 27 and the 12th press leaves, a swipe starting on a vote button
changes no slide, zero page errors. Every new or changed slide screenshotted
at every click and looked at.

## 2026-10-06, later: two more changes on the user's word

- **Task 1's inner print lost its leading space.** The user, on slide 17:
  *"the outputs are not aligned, align them according to the output box."*
  The pedagogy team's program printed `" inner : "` with a space, which set
  the inner lines one character in. Line 6 is now `print("inner : " + str(b))`,
  re-run on CPython 3.12.3: `outer : 0` · `inner : 0` · `outer : 1` ·
  `inner : 0`. The captions follow. The student handout still carries the
  space (out of scope on the user's word), so a student who types the
  handout's line sees one leading space the deck does not.
- **The player opens in Auto Play**, with step-wise and slide-wise as the two
  manual modes and worksheet tasks 1 to 3 held step-wise under it (the user's
  spec, pasted with the request; decision 18 in the session's `CLAUDE.md` has
  the whole of it, `autoplay-check.mjs` proves it on the built file). A
  player change, not a slide change: no slide's content, order or steps moved.
  Harnesses after: `video-safe` CLEAN · `align-check` 0 of 33 ·
  `mixed-align-check` 0 of 33 · `qa` at baseline with the same eleven
  type-floor slides · `phone-nav`, `agenda`, `ligature`, `gesture`,
  `feedback` and `autoplay` checks pass · reveal steps unchanged.
