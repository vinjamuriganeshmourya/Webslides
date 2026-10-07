<!-- cSpell:ignore NxtWave devPort Ravi UPI PhonePe lucide -->
# Python · Session 17 "Loop Control Statements" · plan revision 1

**STATUS: SIGNED OFF 2026-10-06** (user: *"do what ever needed"*, after the
plan and decisions A to H were presented; every decision below is taken as
proposed). The changes below are folded into `plan.md` as the deck is
rebuilt from them.

| | |
|---|---|
| Source of the changes | `Reference ppt's/Loop Control Statements FEEDBACK.pdf` (pedagogy, 2026-10-06) |
| Deck | `Outputs/python/17_loop_control_statements/`, `src/decks/loopControlDeck.tsx`, 32 slides today |
| After this revision | **33 slides**: one reworked, three new, two removed |
| Out of scope, on the user's word | the two student-view HTML files, the student handout, and the task 2 note in the instructor guide (the feedback's last paragraph). Everything else in the feedback is in scope |
| Also not touched | the instructor guide's minute marks (feedback section 5). The guide is not in this repo: it is `~/Downloads/Programming_Foundations_LP/Plans/17 - Loop Control Statements/17_loop_control_statements_instructor_guide.html`. Nothing in the deck carries minute marks, so section 5 changes nothing here except the slide count. Say if the guide should be edited where it is |

Slide numbers below are **deck indices** (Welcome = 1, so the feedback's
"slide 3" is deck slide 4). Ids are the deck's.

## The four changes, and what moves

| # | Change | Slide | Where | Clicks |
|---|---|---|---|---|
| 1 | Rework | `pin-that-keeps-asking` (4) | same place | 5 (was 5) |
| 2 | New | `pin-fix-it`, *Fix it with what you know* | after 4, before the title slide | 4 |
| 3 | New | `break-pin-replay`, *The PIN, with break* | after `divider-break` (9), before `break-shape` | 4 |
| 3b | Notes only | `break-shape` (new index 11) | | |
| 4 | New | `pass-runs-or-crashes`, *Runs or crashes?* | after `pass-shape` (new index 26), before `pass-in-loop` | 12 |
| 5 | Remove | `pass-growth`, `pass-empty-blocks` | folded into rounds 1 and 2 of the game | |

New deck order: 1 welcome · 2 recap · 3 recap-bug · **4 pin-that-keeps-asking**
· **5 pin-fix-it** · 6 todays-session · 7 agenda · 8 control-statements ·
9 divider-break · **10 break-pin-replay** · 11 break-shape · 12 break-in-if ·
13 follow-the-break · 14 break-first-line · 15 break-outside-a-loop ·
16 break-nested · 17 task-1 · 18 task-2 · 19 classroom-quiz · 20 reel ·
21 divider-continue · 22 continue-shape · 23 continue-in-if · 24 machine ·
25 divider-pass · 26 pass-shape · **27 pass-runs-or-crashes** · 28 pass-in-loop ·
29 task-3 · 30 exit-question · 31 takeaways · 32 feedback · 33 thank-you.

Every other slide stays exactly as it is.

## Rules this revision is held to

- **Plan gate** (generate-slides §0, `SLIDE_WORKFLOW.md` stage 4): this file,
  signed off, before a line of the deck changes.
- **Every output is a real run** (course rule R3): every program in the
  feedback was run on CPython 3.12.3 on 2026-10-06; the table at the end is
  what the slides show. The feedback's stated results all agree.
- **The copy is the feedback's** (course rule R2) with content rule 36 on
  every line (no trailing full stop, two sentences on two lines), rule 26
  (literal English, 20 words, two commas), rule 22 (no slide-position words
  on screen; speaker notes are exempt), rule 31 (every code panel says
  `Python`), rule 37 (template colours only), rule 38 (one alignment per
  slide: all three new slides are code explanations, left-aligned at x 64),
  rule 40 (`==`, `!=`, `>=` never a ligature: the kit's `index.css` already
  does it; `ligature-check.mjs` re-run).
- **Reuse, do not write new markup** (generate-slides §2): the kit's
  `CodeBlock` (`lines`, `rows`), `OutputPanel`, `Countdown`, `TraceCaption`,
  `Reveal`; the session's `Phone`, `PlanBox`, `ResultBox`, `Brief`,
  `TaskPill`, `StepControls`, `Glow`, `Confetti`, `Lines`, `BeatFade`. The
  three new figures are session-local arrangements of these in
  `src/decks/figures/` (one-off for this deck, not kit candidates).
- **Controls as the deck has them** (plan decision 5, course rule R5c): every
  click is a build step on `Next` / `Replay`; a vote is a click on an option,
  local state, and `Next` is never gated on it; timers are the kit's
  `Countdown`, which starts on its own play press; a run after a press may
  animate (the machine's register), nothing advances a beat by itself.
- **Motion at the explanatory tier** (generate-slides §4b): entrances 520ms,
  a lit line 360ms, two lights in one click 600ms apart, an arrow drawing
  itself 900ms, the confetti as it is.
- **Pedagogy** (`pedagogy-to-components`): change 1 is move 2 (a hook from a
  named product) with the code beside it; change 2 is **move 4, cost of the
  long way** (fix A is the long way, fix B keeps the loop running, the plan is
  the short way in plain words) and ends on move 11 (plain-English
  pseudocode); change 3 brings the phone back beside the code **because the
  numbers are the same** (1111, 4821, ₹40: the test in Part I §6); change 4 is
  move 6, **vote then run, strictly two beats per round**.

## Canvas geometry the new layouts are planned against

`Panel` (`ZonedFrame`, mode `top`, `wide`): the body box is x 64..1214,
content from y 221 down to 709. `StepControls` (Next, Replay) sit centred at
x 551..727, y 636..680 on every stepped slide. The speaker box is x 913..1280,
y 0..220, so nothing right of x 880 may rise above y 221, and the phone's
`PHONE_LIFT` into Space-3 is **not available on the right side of the slide**.

So on the two phone-and-code slides (changes 1 and 3):

- **left column x 64..540** (476 wide): the code panel, the output pane
  under it. The longest code line is 35 characters, 413px at 17px with the
  gutter, so 476 is enough. The column never reaches x 551, so it can run to
  y 709 without meeting the controls.
- **right column x 740..1214** (474 wide): the phone centred, the three try
  cards in one row under it. The column starts right of the controls, so the
  cards can sit at the foot of the slide.
- **the phone shrinks to fit**: 488px of height holds a 478px phone or the
  cards, not both. The phone keeps its proportions (1 : 2.06) and is drawn at
  **0.84 scale** (195 x 402, `transform: scale` with the scaled footprint
  reserved, so the screens stay as drawn), cards 52px tall: 402 + 10 + 52 =
  464 of 488. **Confirm** (decision A below): the type-floor warnings `qa.mjs`
  already accepts on the phone slides get slightly worse at 0.84.

## Change 1 · slide 4 `pin-that-keeps-asking`: the code next to the phone

Kicker `Programming Foundations`, title `The PIN that keeps asking`, as now.
Section Hook. Figure `PinHook`, rebuilt in place. 5 clicks.

**What the room sees.** Left: the program that runs the app, then its output
pane. Right: the phone (the pay sheet, the PIN keypad, the receipt, as drawn
today), the three try cards under it. The numbered beat list and the app log
go: the code is the narration now, and the output pane and the try cards
accumulate so the whole run stays on screen (R5b). **Confirm** (decision B).

```
correct_pin = "4821"
for attempt in range(3):
    pin = input()
    if pin == correct_pin:
        print("Payment successful")
    else:
        print("Incorrect PIN")
```

`CodeBlock`, `filename="Python"`, `chip={false}`, 17px, `rows={7}`:
y 221..480. `OutputPanel` (`result`, fixed height 132, sized for its three
lines from click 1 so nothing moves): y 492..624. The lit line is the kit's
`now` state and only the lines of the current click are lit; a line that ran
on an earlier click is plain again, because line 3 runs on every try and a
`ran` tint would carry nothing.

| Click | Lines lit | Phone | Output pane | Try cards | Notes say |
|---|---|---|---|---|---|
| 1 | none, whole program | pay sheet `Paying ₹40`, `Ravi Canteen` | empty | all three `not yet` (dashed) | "Which line asks for the PIN? How many times can it ask?" |
| 2 | 3, then 7 (600ms apart) | `Try 1 of 3`, four dots, red `Incorrect UPI PIN. 2 attempts left.` | `Incorrect PIN` lands with the second light, `Glow` | 1 `wrong PIN` (danger) | keep the pace |
| 3 | 3, then 5 | `Try 2 of 3`, four dots, then (700ms) `Payment Successful ₹40` | `+ Payment successful` | 2 `right PIN, paid` (success) | pause two seconds, the room thinks it is over |
| 4 | 3 | `Try 3 of 3`, the cursor in the first box | no change | 3 `asked again` (warning, `?`) | "The money is paid. Why is it asking again?" Three or four answers before the next click |
| 5 | 5 | `Payment Successful ₹40` again | `+ Payment successful` | 3 **`paid again`** (danger, new state) | "Which line should have stopped this? What would you write right after line 5?" |

The `Try 2 of 3` screen is new (today's `PinPad` draws tries 1 and 3; it
takes `2`: four dots, no error line). The money the app has taken is shown
once, as a number, under the output pane: a one-line ledger `Paid ₹0` →
`Paid ₹40` (click 3) → `Paid ₹80` in the danger tone (click 5), x 64..540,
y 632..656. That is the feedback's "₹80 gone from the account" as a drawn
value rather than a sentence. **Confirm** (decision C).

**Removed from this slide:** click 5's plain-English plan (`PlanBox`). It
moves to the end of the new slide 5. The word `break`, `stop early` and
`loop control` are not on this frame.

**Speaker notes** (the feedback's, with the instructor guide's set-up line
carried in, because the deck's notes did not have it):

> Set the story up before click 1: "A junior developer built a new payment
> app. It gives you three tries at your UPI PIN. Let us pay for lunch with
> it." The junior developer is why the app is allowed to do something odd, and
> it stops "PhonePe does not do that". Five clicks. Laptops shut. Click 1: ask
> which line asks for the PIN. Click 4: take answers before the next click.
> Click 5: the app charges twice; ask which line should have stopped the loop.
> Do not say break.

## Change 2 · new slide 5 `pin-fix-it`: Fix it with what you know

Kicker `Hook`, title `Fix it with what you know`. Section Hook. New figure
`PinFix` (`src/decks/figures/PinFix.tsx`). 4 clicks.

**Layout.** Left x 64..600: a 24px label strip (`THE APP'S CODE`, `FIX A ·
A WHILE WITH TWO CONDITIONS`, `FIX B · A PAID VARIABLE`, in the machine's
small uppercase style), then one `CodeBlock` (`Python`, 16px, `rows={10}`,
the tallest program, so the box never changes height: y 249..576) whose
program swaps per click. Right x 640..1214: the brief, then the result and
its caption, then the plan. The left column ends at y 576, well above the
controls.

| Click | Left panel | Right column | Notes say |
|---|---|---|---|
| 1 | the bug code (7 lines) | `TaskPill` `Fix it` · `Brief` lines `Fix it with what you know` / `Pairs, on paper` · `Countdown` 2:00 | run the timer, walk the room |
| 2 | **Fix A**, lines 2, 3 chipped `added`, line 4 chipped `two conditions` (chips on the lines they name, R5c item 6) | `ResultBox` `It prints` → `Incorrect PIN` / `Payment successful` (good) · `TraceCaption` `It works` / `Three new lines, and the test has two conditions` | "It works. What did we have to add?" |
| 3 | **Fix B**, lines 2, 4, 8 chipped `added` | the result box again · three small try cards `Try 1 wrong PIN` (danger) · `Try 2 paid` (success) · `Try 3 runs, does nothing` (faded, dashed) · caption `It works` / `Try 3 still runs, and does nothing` | "It works. Does the loop stop after paying?" No, it still goes round |
| 4 | the bug code again, line 5 marked | `BeatFade` → the line `One line that says leave now, right here` over the `PlanBox` moved from slide 4: `every try, up to 3:` → `ask for the UPI PIN` → `if the PIN is right:` → `pay, then leave straight away` → `show the receipt`, the green arrow `leave now` | then the next click is the title slide |

Click 4 shows the bug code, not fix B, because the plan describes the loop
the app has (line 2 ↔ `every try, up to 3`, line 3 ↔ `ask for the UPI PIN`,
line 4 ↔ `if the PIN is right`, line 5 ↔ `pay, then leave straight away`):
each plan line maps to one code line, and the arrow leaves from the one line
the code is missing (Part I §3, one-to-one and stated).

Fix A and fix B, verbatim from the feedback, both run (see the outputs table):

```
correct_pin = "4821"                  correct_pin = "4821"
attempt = 0                           paid = False
pin = ""                              for attempt in range(3):
while attempt < 3 and pin != correct_pin:     if paid == False:
    pin = input()                             pin = input()
    attempt = attempt + 1                     if pin == correct_pin:
    if pin == correct_pin:                        print("Payment successful")
        print("Payment successful")               paid = True
    else:                                     else:
        print("Incorrect PIN")                    print("Incorrect PIN")
```

**Speaker notes** (the feedback's): "Two minutes, pairs, paper. Accept any fix
that works. Do not say they are wrong. Say: it works, and look what it cost.
If nobody gets there, show A and B as other students' fixes. Never claim it
cannot be done without break: someone will prove you wrong."

With this slide carrying the plan, the title slide and the agenda follow it
with nothing else between.

## Change 3 · new slide 10 `break-pin-replay`: The PIN, with break

Kicker `Loop Control Statements`, title `The PIN, with break`. Section Break.
New figure `PinBreak` (`src/decks/figures/PinBreak.tsx`), the same layout as
slide 4 (left column, right column, phone at 0.84, cards under it). 4 clicks.

```
correct_pin = "4821"
for attempt in range(3):
    pin = input()
    if pin == correct_pin:
        print("Payment successful")
        break
    else:
        print("Incorrect PIN")
```

`CodeBlock` 16px, `rows={8}` (y 221..498); `OutputPanel` fixed height 118
for its two lines (y 510..628); no ledger line here.

| Click | Code | Phone and cards | Output | Notes say |
|---|---|---|---|---|
| 1 (entry) | line 6 `break` slides in from the left (`Reveal`, 520ms), chip `new` (success) on it | pay sheet; cards `not yet` | empty | "One new line, right where you said." |
| 2 | 3, then 8 | `Try 1 of 3` wrong, red line; card 1 `wrong PIN` | `Incorrect PIN` | keep the pace |
| 3 | 3, 5, then 6; a green arrow draws itself (`sm-dash`, 900ms) from line 6's right end down past line 8 and out of the loop, labelled `leave now`, the plan's own words and colour | `Try 2 of 3`, then the receipt `Payment Successful ₹40`; card 2 `right PIN, paid` | `+ Payment successful` | "break: leave the loop now." |
| 4 | nothing lights; the arrow stays | card 3 → `never asked` (dashed, the state the deck already has) | no change | "Does try 3 happen?" Wait for no |

The arrow is drawn in DOM and SVG over the code panel, placed on the panel's
own row grid the way `OutsideLoop` places its chips (`rows`, 16px → 25px
rows): the kit's `CodeBlock` has a loop-back arrow and side labels, not a
jump out, so this is the one piece of drawing in the revision. Its colour is
slide 8's legend, `break: jump out` (success), and its label is the same
`leave now` the plan's arrow carried two slides earlier, so the room sees the
plain-English arrow become the code's arrow.

The feedback's click 3 says "then the Done screen": the receipt the deck
draws already ends in its `Done` button, so the receipt is the Done screen
here and no further screen is drawn. **Confirm** (decision D).

**Speaker notes** (the feedback's): "Four clicks. Click 1: let them see the
new line before it runs. Click 4: ask if try 3 happens. If someone says it
happens but nothing is typed, go back to click 3 and trace the arrow leaving
before try 3 starts."

**Change 3b · `break-shape` (new index 11), notes only**, the feedback's:
"This is the shape of what we just did. Line 6 of the PIN code is the break
here. Trace the green arrow with your hand." The slide itself does not
change.

## Change 4 · new slide 27 `pass-runs-or-crashes`: Runs or crashes?

Kicker `Predict, then run`, title `Runs or crashes?`. Section Pass. New
figure `PassGame` (`src/decks/figures/PassGame.tsx`), built from the same
pieces as `ControlMachine` and in its frame: the round strip on the left,
the code panel, a result panel on the right. 6 rounds, **12 clicks, two per
round** (vote, then run), the machine's own contract.

Why a second machine with different rules, in the feedback's words: the
break-or-continue machine asks "what prints?" with four options; this one
asks one yes-or-no question, so a round takes about 30 seconds and the whole
room answers with thumbs. Two machines with the same rules would feel like a
repeat.

**Layout.** Left x 64..604: `ROUND n OF 6` strip, then `CodeBlock`
(`Python`, 16px, `rows={9}`, the tallest round, so the box is one size:
y 249..551); for round 2 an `OutputPanel kind="input"` `25` sits under the
code (y 563..623). Right x 636..1214: a **round strip** of six slots across
the top (y 221..257), each slot filling after its run with `Runs` (success) or
`Crashes` (danger), so the shape of the game and where the room is in it stay
on screen (R5b); the question `Runs or crashes?` with a `Countdown` 0:05 on
its right; **two big buttons**, `Runs` with a thumbs-up and `Crashes` with a
thumbs-down (lucide `ThumbsUp` / `ThumbsDown`: the house set has no thumbs,
and the glyph is the room's own gesture), each 64px tall, clickable, local
state, `Next` not gated; the `OutputPanel` (fixed height 110; `result` or
`error`); one reason line (`TraceCaption`). Column height 352px, ending at
y 573, clear of the controls.

The vote click shows the code, the question, the two buttons and nothing
else. The run click prints the output a line at a time (or the error, with
the `if` line the message names tinted `error`), turns the right button solid
and fades the wrong one, fills the round's slot, and shows the reason.
Confetti across the slide when the room's pick was right (the machine's
register; the pick is the vote the instructor clicks in after the thumbs).

| Round | Code | Answer | Output or error | Reason on screen |
|---|---|---|---|---|
| 1 | the growth-stage program with its three empty blocks (today's slide 25, 6 lines) | Crashes | `IndentationError: expected an indented block after 'if' statement on line 3`, line 3 tinted | `Every colon needs a block under it` |
| 2 | the same with `pass` in all three blocks (9 lines), input `25` | Runs | one blank line | `pass fills the block and does nothing` |
| 3 | `marks = 72` / `if marks >= 35:` / `    # write this later` / `print("Checked")` | Crashes | `IndentationError: … after 'if' statement on line 2`, line 2 tinted | `Python skips comments, so the block is still empty` |
| 4 | `for i in range(3):` / `    pass` / `print("Done")` | Runs | `Done` | `The loop runs 3 times and does nothing each time` |
| 5 | `pass` / `print("Hi")` | Runs | `Hi` | `Unlike break and continue, pass works outside a loop` |
| 6 | `marks = 72` / `if marks >= 35:` / `pass` / `print("Checked")`, the `pass` at the left edge | Crashes | `IndentationError: … after 'if' statement on line 2`, line 2 tinted | `pass has to be indented to be in the block` |

Round 6 carries `marks = 72` and `print("Checked")` around the feedback's two
lines so the program is a whole program and its error says `on line 2`, the
same shape as round 3; round 3 is written as the feedback spells it out.
Round 2's blank line is shown honestly: the output panel in its result state
with one empty line, and nothing written into the panel that the program did
not print. The reason line says what the room is looking at.

The errors are shown in full (course rule R3, as today's slide 26 does),
wrapped on three lines at 16px in the result panel.

**Not added**, by the feedback's own instruction: no round with `pass`
followed by `print(i)` inside a loop. That is worksheet task 3's finding and
the game must not give it away.

**Speaker notes** (the feedback's): "Six rounds, about 30 seconds each.
Thumbs before every click. Round 3 catches the room: most think a comment
fills the block. Round 5: link back to Break outside a loop."

## Change 5 · remove `pass-growth` and `pass-empty-blocks`

Deck slides 25 and 26 today. Their content is rounds 1 and 2 of the game:
the program, the error in full, and `You cannot leave a block empty`
restated as round 1's reason. `PassGrowth` and `PassEmptyBlocks` leave
`figures/Syntax.tsx`; the `GROWTH` program string moves to `PassGame`.
`pass-shape` (the definition and its `When do we use it?` callout) and
`pass-in-loop` stay as they are.

## Outputs, all real runs (CPython 3.12.3, 2026-10-06)

| Program | Input | Output |
|---|---|---|
| the bug (slide 4) | `1111`, `4821`, `4821` | `Incorrect PIN` · `Payment successful` · `Payment successful` |
| fix A, while with two conditions | `1111`, `4821` | `Incorrect PIN` · `Payment successful`, then it ends |
| fix B, a paid variable | `1111`, `4821` | `Incorrect PIN` · `Payment successful`, then it ends |
| with break (slide 10) | `1111`, `4821` | `Incorrect PIN` · `Payment successful`, then it ends |
| round 1, empty blocks | `25` | `IndentationError: expected an indented block after 'if' statement on line 3` |
| round 2, pass in all three blocks | `25` | a blank line |
| round 3, a comment under the if | | `IndentationError: expected an indented block after 'if' statement on line 2` |
| round 4, pass in a loop, then Done | | `Done` |
| round 5, pass on line 1 | | `Hi` |
| round 6, pass at the left edge | | `IndentationError: expected an indented block after 'if' statement on line 2` |

Every result agrees with the feedback's.

## Frameworks table, after the change (gate check 1)

| Concept | Framework | S | T | A | R / close |
|---|---|---|---|---|---|
| 1 Break | **STAR** | slide 4: the app running (clicks 1 to 3), then the break: it pays twice (clicks 4, 5); slide 5 clicks 1 to 3: the fixes the room already has, and what each costs (move 4) | slide 5 click 4: the plan, `leave straight away`, no syntax | slide 10 click 1: the one new line; 11, 12 the shape; 13 to 16 the walks and the edge cases | slide 10 clicks 2 to 4: the hook's own program, run, pays once and never asks again; then 17, 18 the room types, 19 the quiz |
| 2 Continue | STAR | unchanged | | | |
| 3 Pass | 4MAT | the need is now **rounds 1 and 2 of the game** (the half-written program crashes; pass fills the block), after the definition on 26, as the reference's order already had it (plan decision 11, still **confirm**: decision E) | 26, 28 | 29 (task 3) | 31 row 1 |

Two opening beats for Break: the routine (the app pays) and the break (it
pays twice), both on slide 4, and the cost of the long way on slide 5.

## Term ledger, changes (gate check 2)

| Term | Introduced | Plain words there |
|---|---|---|
| break | first on screen on slide 10 click 1 (chip `new`), named on 8 (card 4) and the divider; the plan's words `leave straight away` on slide 5 click 4 come first | slide 10 click 3: `leave now`; slide 11: *break makes the program leave a loop early* |
| IndentationError | slide 27 round 1 (was slide 26) | `Every colon needs a block under it` |
| `while … and …`, `!=`, `False`, a flag variable | carried in (conditions and loops); the feedback's fixes are the room's own knowledge | |

Nothing new arrives assembled (gate check 3): slide 10 adds one line to a
program the room has read twice; the game shows each round's code before its
run.

## Dependents to chase (generate-slides §9)

- `deck.config.json`: `slideCount` 32 → **33**.
- `src/export/revealSteps.ts`: regenerated for 33 slides, never hand-edited.
- `plan.md`: this revision folded in on sign-off; `CLAUDE.md` of the session:
  decision 1 (no longer "nothing added, nothing dropped"), decision 7 (the
  figures list), decision 12 (the type-floor slides, renumbered), the harness
  baseline and the slide count.
- Agenda, dividers, takeaways, quiz, exit question: unchanged. The agenda's
  three items still match Key Takeaways word for word.
- `continuity.ts`: slides 4 and 5 share the code panel at the same place
  (x 64, y 249 vs 221: the label strip on 5 is the only difference) and slide
  10 brings the phone back at the same spot as slide 4.
- The student-view HTML files and the handout: not touched (the user's word).

## Verification, before this is called done

`npm run typecheck`, `npm run build:html`; then, in parallel against
`npx vite --port 5246 --strictPort` with `CHROME_PATH=/usr/bin/brave-browser`:
`video-safe.mjs` (CLEAN), `qa.mjs` (baseline: slides 1 and 33 `NO LOGO`, plus
the type-floor warnings, renumbered and with slide 10 added for its phone),
`align-check.mjs` (0 of 33), then `mixed-align-check.mjs` (0 of 33),
`preview.mjs` and `build-preview-page.mjs`; `ligature-check.mjs`,
`agenda-check.mjs` and `phone-nav-check.mjs` on the built file; the built
file driven from `file://`: keyboard, trackpad, touch, the two new vote
buttons and the thumbs confetti, the 2:00 and 0:05 timers (still at their
start after 2.5 s untouched), and a swipe starting on a button changing no
slide. Every new or changed slide screenshotted at step 0, mid-run and fully
revealed and looked at, with the heading-on-one-line check (rule 35).

## Decisions to confirm before generation

A. **The phone at 0.84 scale** on slides 4 and 10, proportions unchanged, so
   the three try cards fit under it inside Space-1 (nothing right of x 880
   may rise into Space-3). The alternative that keeps the phone at full size
   is the cards as a column beside the phone, which is not where the
   feedback puts them. `qa.mjs`'s type-floor warnings on the phone screens
   get slightly worse and stay accepted, as decision 12 records.
B. **The beat list and the app log leave slide 4.** The feedback's design has
   no narration column: the lit lines, the phone, the output pane and the
   cards carry the beats, and the pane and cards accumulate so the run stays
   visible. There is no room for both the code and a beat list.
C. **"₹80 gone from the account" as a one-line ledger** under the output pane
   (`Paid ₹0` → `₹40` → `₹80`), not as a sentence and not drawn into the
   receipt, whose copy stays a real receipt's.
D. **The receipt is the "Done screen"** on slide 10 click 3; no extra screen.
E. **Pass still has its need after its definition.** Rounds 1 and 2 of the
   game are the concept's cost beats and they follow `pass-shape`, as the
   reference's order and the feedback both have it. Plan decision 11 flagged
   this and the feedback does not move it; moving `pass-shape` after the game
   would fix the order and is not in the feedback, so it is not planned.
F. **The 0:05 countdown starts on its play press**, like every timer in the
   deck (course rule R5c item 4). The feedback reads as if it starts on the
   click; say so if that is wanted and it becomes the one self-starting timer.
G. **Reason line wording kept as the feedback writes it** (course rule R2),
   including `The loop runs 3 times and does nothing each time`, which opens
   on `The` against `TEXT_GUIDELINES.md` §4a-bis; the machine's existing
   reasons do the same, from the reference. Say the word to rewrite it
   (`Each of the 3 passes does nothing`).
H. **Titles `The PIN that keeps asking` and `The PIN, with break`** keep their
   leading `The`, the feedback's and the reference's wording, as the existing
   hook title does.

## Git

The working tree is shared with another session: the branch
`deck/state-behaviour-constructor` carries that session's staged work, and
this session's folder and plan folder are untracked. The branching rule
(`branch-from-main`) wants a branch cut from main before the first edit; a
checkout here would disturb the other session's index, so, as plan decision
10 records, **git is not touched while building**. When the user asks for a
commit, the two folders go onto a `session/17-pin-story-and-pass-game` branch
in a worktree cut from `origin/main` under the scratchpad, committed by
pathspec, and pushed for a PR. Not before.
