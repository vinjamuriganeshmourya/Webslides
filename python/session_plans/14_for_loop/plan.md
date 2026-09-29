<!-- cSpell:ignore NxtWave devPort Cricbuzz isdigit startswith Riya's -->
# Python · Session 14: "For Loop"

**STATUS: SIGNED OFF 2026-09-29** (approved on the §7 defaults)

All five §7 items carry their defaults: three new components, Quiz Time kept where
the source puts it, `range(start, end)` introduced on the dial, Feedback and
Thank you as two slides, portal slides not redrawn. Final count **36**, after the duplicate session-name card was removed (see the generation record).

**GENERATED 2026-09-29.** The deck is at `python/14_for_loop/`, 37 slides, all
harnesses at baseline. Five things were done differently from the text below,
and the session's own `CLAUDE.md` carries them too:

1. **§4's slides 10 and 31 are `ContentSlide`s, not `QuestionSlide`s.** Both need
   code on the frame to be answerable, and content rule 16 says a `QuestionSlide`
   carries the question and nothing else. That rule names this exact fallback: a
   `ContentSlide` whose lead ends in a question mark. The `range` question is a
   true `QuestionSlide` and carries nothing else.
2. **Key Takeaways restates the four agenda items word for word**, not the six
   free-written statements §4 lists. Content rule 20. Only `The One Mistake`'s
   sub differs from the agenda's, because "the one everybody makes" states no
   fact.
3. **The hook and the story are drawn as the real objects**, not as the abstract
   `SequenceWalk` §5 specified: `PhonePlaylist` (a phone with a real playlist on
   it, carrying the asset library's own Spotify mark) and `PiggyBank` (a week of
   coins and a bank that fills). Asked for on 2026-09-29 and recorded as course
   rule **R5**. `SequenceWalk` survives for the string walk, where the items
   really are characters.
4. **Five session-local figures, not three**, for the same reason, over a shared
   beat engine. All still session-local: the kit lab owns their promotion.
5. **The "same job, in two lines" frame puts the for loop in the LEFT pane.** The
   while pane is 514px tall and the deck's control cluster owns x18..409 below
   y=660, so the tall pane has to be the right-hand one.

| | |
|---|---|
| `SESSION_NAME` | `For Loop` |
| `COURSE` | `Python` |
| Source | `prog_foundations_LP/14 - For Loop/14_for_loop_student_view_new_design.html`, a lesson plan with 24 stages and 14 redrawn portal slides, read in full |
| Project | `python/14_for_loop/` |
| Deck file | `src/decks/forLoopDeck.tsx` |
| Slide count | **37** on the §7 defaults (34 + quiz + next-up + the Feedback/Thank-you split; see §2) |
| `devPort` | `5232` |
| `htmlName` | `python-session-14-for-loop` |
| `NEXT_UP` | `String Methods` (session 15) |

## 0. What the source is, and what we take from it

The source is **not a deck.** It is an instructor lesson plan: a sidebar of
timed checkpoints, 17 teaching blocks, and a printable worksheet in a second
file. Slides sit inside it in two kinds, and only one kind is ours:

| In the source | Here |
|---|---|
| 24 `pcard` stages the pedagogy team authored | **this deck**, all 24 |
| 14 `.slide` blocks that redraw existing **portal** slides (`Slide 8 · Identify the Mistake`) | **not rebuilt.** They already exist on the portal. This deck refers to them by number where the teaching depends on one |
| the block structure, the timings, the worksheet | stays in the lesson plan, which is the instructor's document, not the deck |

Confirmed with the user: decks only.

The source stages are **interactive**: a step button and a Replay on most of
them (`data-anim`, `data-rcp-steps`). That maps exactly onto the kit's reveal
steps, one click per `data-anim-label`, so the room sees the same beats in the
same order. Nothing is compressed into a static frame.

**Every code panel in this deck is labelled `Python`.** Not `main.py`, not
`riya.py`, not `seats.py`. The source invented 12 file names for a session
where the learner types into a playground and presses Run; content rule **31a**
(added for this course) says the tab names the language when there is no
project on disk.

**Outputs are real runs.** Every snippet below was run on CPython 3.12.3 before
this plan was written, and the source's own stated outputs agreed in all cases.

## 1. Narrative frameworks, one per concept

Three concepts, three named frameworks (PEDAGOGY §2). Each opens on a **cost**
and closes on **proof**, so no mechanism arrives cold.

| Concept | Framework | The cost it opens on | The proof it closes on |
|---|---|---|---|
| 1 · The for loop | **SCQA** | the while loop needs three lines that only keep count, and one of them going missing is the commonest bug (portal slides 8, 11, 15) | the same job, in two lines, with no initialization, condition or updation (slide 14) |
| 2 · range | **Merrill** | a for loop needs a sequence, and numbers are not one yet (portal slide 33) | Riya's savings runs for any n, traced day by day to ₹16 (slide 23) |
| 3 · The row that goes missing | **STAR** | `range(1, n)` looks right, starts at 1, and silently drops the last row | `range(1, n + 1)` prints all n rows, and the exit question proves why `range(1, 1)` prints nothing (slides 29, 31) |

Concept 1 is SCQA because the source itself is written that way: situation (the
while loop works), complication (three of its lines only count), question (can
we simplify this?), answer (`for`). Concept 3 is STAR because it is a single
concrete bug with a result the room can check.

## 2. Where 24 stages become 34 slides

| Source | Becomes | Why |
|---|---|---|
| `Welcome`, `Today`, `The plan`, `Classroom quiz`, `Key takeaways`, `Feedback`, `Thank you` | `WelcomeSlide`, `SectionBreakerSlide`, `AgendaSlide`, `QuizTimeSlide`, `KeyTakeawaysSlide`, `FeedbackSlide`, `ThankYouSlide` | these are already the kit's own frames |
| `Recap` + `Recap: the while loop in three parts` | 2 slides | the second is a matching activity, not a restatement |
| The 6-step Spotify hook, the 4-step "where else" | 2 slides, 6 and 4 reveal steps | one click per source label |
| 3 agenda pills (For Loop · Range · The Star Pattern · The One Mistake) | **3 dividers**, 4 pills | "The One Mistake" is the close of concept 3, not a fourth concept |
| `Task 2, step 1 / 2 / 3` | 3 slides | rule 5: three separate runs, three frames |
| no front frame, no dividers, no next-session frame | `BrandSlide`, 3 `SectionBreakerSlide`s, a `NEXT_UP` breaker | every deck in this course carries them |
| 14 redrawn portal slides | **dropped** | §0 |

24 − 14 dropped + 1 brand + 3 dividers + 1 next-up + 5 split = **34**, and
the three §7 defaults take it to **37**. The slide numbers in §4 are the 34;
they are renumbered once §7 is answered, before anything is generated.

## 3. Term ledger

No term is used above the slide that introduces it.

| Term | Introduced | Assumed known from |
|---|---|---|
| `while`, condition, initialization, updation | — | session 13, recapped on 3 and 4 |
| sequence | 12 | — |
| for loop, `for … in …:` | 13 | — |
| character | 12 | session 12, strings |
| `range(n)` | 19 | — |
| `range(start, end)` | 28 | — |
| `%`, odd and even | 22, in the hint | session 11 |
| `int(input())` | — | session 10 |

`range(start, end)` is deliberately **below** the two-argument use on slide 21
(the range dial) — the dial is the slide that introduces it visually, and 28 is
the portal's formal statement of it, which this deck no longer carries. Fixed:
slide 21 introduces both forms, and the ledger row moves to 21. See §7, item 3.

## 4. Slide-by-slide

`C` = `ContentSlide`, `Div` = `SectionBreakerSlide`, `Q` = `QuestionSlide`.
Every code panel: `location="Python"`.

### Front frame and recap

| # | Type | Title · lead | Visual | Steps |
|---|---|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` | | |
| 2 | `WelcomeSlide` | For Loop | | |
| 3 | `RecapSlide` | **Where We Left Off** · A while loop repeats a block of code, as long as its condition is True · It needs three lines to work · Miss the update and it never stops | | |
| 4 | `C` | kicker **Recap** · **The while loop, in three parts** · lead: Three parts on the left, three jobs on the right. Call out which two go together, then we join them | `MatchPairs` (§5): `counter = 0` ↔ Sets the starting value, runs once before the loop · `while counter < 3:` ↔ The question asked before every pass · `counter = counter + 1` ↔ Moves the counter on, so the question can turn false. Each join reveals its why | 3 |

### Hook

| # | Type | Title · lead | Visual | Steps |
|---|---|---|---|---|
| 5 | `C` | kicker **Before we start** · **One tap, and it keeps going** | `SequenceWalk` (§5) over five songs: the list · one tap · it moves on its own · to the end, and it stops · one more song, and it plays six · your turn. Source words verbatim | 6 |
| 6 | `C` | kicker **Your turn** · **Where else does this happen?** · lead: One action, and it keeps going by itself until a list runs out | three `Card`s, one per beat: the attendance register · Instagram stories · the billing counter, then the shape: *Take a list. Do one job. Once for each item in it. You never say how many* | 4 |
| 7 | `Div` | **For Loop** · kicker `Today's topic` | | |
| 8 | `AgendaSlide` | For Loop · Range · The Star Pattern · The One Mistake, with the source's four subs | | |

### Concept 1 · The for loop (SCQA)

| # | Type | Title · lead | Visual | Steps |
|---|---|---|---|---|
| 9 | `Div` | **For Loop** | | |
| 10 | `Q` | **Can we simplify this?** · qualifier: three lines in this loop only keep count. None of them prints anything | `CodeBlock` `Python`, the while version, the three counting lines marked Initialization · Termination condition · Updation | 3 |
| 11 | `CodeSyntaxSlide` | **For Loop** · lead: `for` goes through each item of a sequence, one at a time | `SyntaxBreakdown` of `for each_item in sequence:` over an indented body | 2 |
| 12 | `C` | kicker **A string is a sequence** · **"Python", one character at a time** · lead: One string, or six characters? Say which, then press Split it | `SequenceWalk` over `"Python"` split to six characters, `ch` shown as it is handed each one, and `print("Done")` reached only after the sequence runs out | 4 |
| 13 | `C` | **The same job, in two lines** | `CodeOutput` two panes, `location="Python"` both: the while version and `word = "Python"` / `for each_char in word:` / `print(each_char)`, same output | 2 |
| 14 | `StatusPointsSlide` | **Not needed any more** | three rows, all `error`: Initialization · Termination condition · Updation | 3 |
| 15 | `C` | kicker **Worksheet task 1** · **Trace it before you run it** · lead: Fill the pass table by hand first. Nothing here moves until pens are down | `VariableTrace` (kit) over `word = "Hi"` / `n = 0` / `for ch in word:` / `n = n + 1` / `print(ch)` / `print(n)`, 11 steps, the source's line labels verbatim | 11 |
| 16 | `C` | kicker **Worksheet task 2** · **Step 1: type it, run it** | `CodeBlock` `Python`, `word = "Rain"` …, lead: Run it as it is. Then tick step 1 on the worksheet | |
| 17 | `C` | kicker **Worksheet task 2** · **Step 2: change the word** | same, `word = "Delhi"`, note: Write first, run second. A guess after the run is not a guess | |
| 18 | `C` | kicker **Worksheet task 2** · **Step 3: an empty word** | same, `word = ""`, note: Does it give an error? Decide before you run | |

### Concept 2 · range (Merrill)

| # | Type | Title · lead | Visual | Steps |
|---|---|---|---|---|
| 19 | `Div` | **Range** | | |
| 20 | `Q` | **How do we make a sequence of numbers?** · qualifier: a for loop needs a sequence. What if we want numbers, like 0, 1, 2, 3? | | |
| 21 | `C` | kicker **Predict, then look** · **The range dial** · lead: Say the two numbers out loud first. Which numbers come out, and how many? | `RangeDial` (§5): start and stop, a number line 0 to 10, the produced numbers lighting on reveal. Introduces `range(n)` and `range(start, end)` together, and *stops before* is the label on the stop end | 3 |
| 22 | `C` | **`for number in range(3)`** · lead: The loop runs once for each number that range gives | `CodeOutput` `location="Python"`, output `0 1 2` | 2 |
| 23 | `C` | kicker **A story** · **Riya's piggy bank** | `SequenceWalk` over seven days, ₹1 ₹3 ₹5 ₹7 landing in the bank, the running total 0 → 1 → 4 → 9 → 16, closing on *What about 30 days? Or a whole year?* Source words verbatim | 6 |
| 24 | `PracticeSlide` | kicker **Coding challenge** · **Riya's savings** · Read a number n. Print the total money Riya saves from day 1 to day n, both days included | input 7 → output 16, input 4 → output 4; hint `day % 2 == 1` is True only when day is odd | 2 |
| 25 | `C` | kicker **Check it together** · **Riya's savings, day by day** | `VariableTrace`, `location="Python"`, the 6-line solution, 10 steps, day / total / piggy bank columns, ending *range stops before 8. The loop ends* | 10 |

### Concept 3 · The row that goes missing (STAR)

| # | Type | Title · lead | Visual | Steps |
|---|---|---|---|---|
| 26 | `Div` | **The Star Pattern** | | |
| 27 | `C` | kicker **Worksheet task 3** · **Write the loop line** · lead: Line 1 is given. Line 2 and the blank on line 3 are yours | `CodeBlock` `Python` with two blanks; note: The two blanks must agree. More than one pair works | |
| 28 | `C` | **Solution** · lead: counter goes 0, 1, 2, 3. Each line prints counter + 1 stars | `CodeOutput` `location="Python"`, input 4, the four-row triangle | 2 |
| 29 | `C` | kicker **Predict, then run** · **Which one is right?** · lead: Both of these start at 1. Which one prints all n rows? Hands up for A, then for B, before you press Run | `SwapRows` (kit): A `range(1, n)` against B `range(1, n + 1)`, n = 4, both outputs revealed together | 3 |
| 30 | `C` | **Simpler with `range(1, n + 1)`** · lead: counter is already the number of stars | `CodeOutput` `location="Python"`, the four-row triangle | 2 |
| 31 | `Q` | kicker **Exit question** · **Which one prints nothing?** · qualifier: read the code. For which pair does the screen show nothing at all? | `CodeBlock` `Python`, the seats program, four option chips | |
| 32 | `C` | kicker **Exit question** · **Why it prints nothing** | `VariableTrace`: seats 4, booked 3, left 1, `range(1, 1)` → no numbers → nothing printed | 4 |

### Closing frame

`QuizTimeSlide` is **not here.** The source puts the classroom quiz straight
after worksheet task 2, and course rule R2 says quiz positions are not moved,
so it sits between 18 and 19. See §7 item 2.

| # | Type | Content |
|---|---|---|
| 33 | `KeyTakeawaysSlide` | the for loop walks a sequence · a string is a sequence of characters · range makes a sequence of numbers · `ch` holds one item per pass · range stops before its end value · an empty sequence means zero passes |
| 34 | `Div` | kicker `Next Session` · **String Methods** |
| 35 | `FeedbackSlide` | |
| 36 | `ThankYouSlide` | `Thank you!` |

## 5. What has to be built

| Component | Slides | Draws | Where it lives |
|---|---|---|---|
| `SequenceWalk` | 5, 12, 23 | a row of items with a pointer that advances one item per click, a slot showing what the loop variable currently holds, and an end state where the pointer runs off and the loop stops. **This is the figure of the whole block**: sessions 15 (follow the strip), 16 (follow both loops) and 18 (follow the pointer) all want it | **kit**, `src/ui/`. PR per generate-slides §6 |
| `MatchPairs` | 4 | two columns, a join per click, the why appearing under the joined pair | **kit**. Every recap in sessions 15 to 18 uses this shape |
| `RangeDial` | 21 | start and stop, a number line, the produced numbers lighting, *stops before* labelled on the stop end | **kit**. Session 15's slice machine is the same figure over a string |
| `VariableTrace` | 15, 25, 32 | already in the kit, from session 4 | kit, unchanged |
| `CodeOutput`, `SwapRows`, `SyntaxBreakdown` | several | already in the kit | kit, unchanged |

DOM, never SVG (rule 17). Colours from `tokens.ts`. Explanatory-tier motion:
entrances 520ms, staggers 130ms.

**Three new kit components is the honest count**, and all three are reused by
sessions 15 to 18, so they are built once here and imported four times. That is
the argument for generating session 14 first and the rest against it.

## 6. What I could not verify

- The **worksheet** is a separate file (`14_for_loop_student_handout.html`) and
  this deck does not reproduce it. Slides 15, 16 to 18 and 27 refer to worksheet
  tasks by number; if the worksheet is not handed out, those references break.
- The **portal slide numbers** (8, 11, 15, 16 to 18, 33 to 37, 40, 42, 45) come
  from the lesson plan. I have not opened the portal to confirm they still point
  at those slides.

## 7. Sign-off

1. **Three new kit components** (`SequenceWalk`, `MatchPairs`, `RangeDial`) on
   one PR, built here and reused by sessions 15 to 18. *Default: yes.*
2. **Quiz Time position.** The source puts the classroom quiz after worksheet
   task 2 (between slides 18 and 19), not in the closing frame. The Python
   course rule R2 says quiz positions are not moved. *Default: keep it at 19,
   which makes the deck 35 slides.*
3. **`range(start, end)` introduced on the dial (21)**, both forms at once, or
   split into two slides as the portal does. *Default: both on the dial.*
4. **Feedback and Thank you** as two slides, as sessions 1 to 4 do, or one.
   *Default: two, making the final count 36.*
5. **The 14 portal slides stay on the portal.** The deck refers to them but
   does not redraw them. *Default: yes, per §0.*
