<!-- cSpell:ignore NxtWave colour behaviour Updation Ananya Kabir Nikhil Verandah Aarav Diya Ishan Zoya devPort -->
# Python Programming · Session: "For Loop"

**STATUS: SIGNED OFF 2026-09-29 · GENERATED 2026-09-29** (`Outputs/python_programming/for_loop`, 38 slides; video-safe CLEAN, qa at its 2-slide baseline, align-check 0 of 38). D1 (a) port the panels · D2 keep the content as written · D3 add `steps` to `QuizTimeSlide` · D4 the kit's `BrandSlide` default greeting.

| | |
|---|---|
| `SESSION_NAME` | `For Loop` |
| `COURSE` | `Python Programming` (existing course at `Outputs/python_programming/`) |
| Source | `Downloads/Programming_Foundations_LP/Plans/14 - For Loop/14_for_loop_student_view_new_design.html`, 38 cards, extracted in full |
| Project | `Outputs/python_programming/for_loop/` (scaffolded from `slide-kit/slide-template`) |
| Deck file | `src/decks/forLoopDeck.tsx` |
| Slide count | **38**, one per source card, same order |
| `devPort` | `5260` (5211 to 5250 are taken) |
| `htmlName` | `for-loop` |
| Layout | content rule 22 zones (`Rules_beta/A.png`, `Rules_beta/c.png`): header y 0..148, speaker box x 913+ / y 0..220 empty, Space-1 x 64..1159 / y 251..709, Space-2, Space-3 x 64..880 / y 162..240, centring band y 221..647 |

---

## 1. What changes, and what does not

**The content does not change.** Every kicker, title, lead, bullet, code line,
output, caption, step label and button label below is copied from the source
cards. Section 3 is that copy, slide by slide.

What changes is only how it is drawn: the source is a hand-written HTML page;
this is the kit, so every slide goes through `SlideBase` / `SlideHeader` /
`ZonedFrame` and the kit's components, with the house header (rule 23),
Poppins and Inter (rule 24), and zones (rule 22).

Two wording changes are **your own standing rules**, not new decisions:

| Where | Source | Deck | Rule |
|---|---|---|---|
| every code box title | `mistake.py`, `while_loop.py`, `for_loop.py`, `range_loop.py`, `main.py`, `riya.py`, `pattern.py`, `seats.py` | `Python` | 26 |
| pseudocode shapes (slides 11, 12, 20) | no title | `Pseudocode` | your 2026-09-29 choice: dark pseudocode boxes |

**Every output was re-run** on CPython 3.12 on 2026-09-29 and matches the
source exactly (slides 8, 9, 12 to 18, 23, 26, 27, 30, 31, 33, 34, 35). Slide 8
is labelled `Expected output` because that program is the buggy one and does
not print the `n`; it prints `P y t h o`.

## 2. Decisions for sign-off

### D1. The interactive panels. **Recommended: (a).**

Fifteen cards are live panels with their own controls: Join them, Next /
Replay, Play / One step / Reset, the word picker, Split it, the range dial's
− and +, the `n` stepper, Run them both, and the countdown timers. The kit has
none of these; its decks step with the arrow key only.

- **(a) Port them.** Build the controls as kit components (section 4), so each
  panel behaves exactly as it does now. Largest job; the components go into
  the kit and out as a PR, per the generate-slides procedure section 6.
- **(b) Arrow-key steps only.** Every panel becomes a kit step sequence: the
  same captions arrive in the same order on each forward key. Loses the word
  picker (`Go`, `nothing`), the dial, the `n` stepper and the timers.

You asked earlier to keep the interactiveness unchanged, which is (a).

### D2. Rule conflicts where the unchanged content breaks a hard rule. **Recommended: keep the content, as you asked.**

| Slide | Rule | The conflict |
|---|---|---|
| 36 Key takeaways | 20: takeaways restate the agenda verbatim | agenda is *For Loop · Range · The Star Pattern · The One Mistake*; takeaways are seven different lines |
| 19 Classroom quiz | 18: the last quiz frame sits before the takeaways | the quiz is mid-deck; the exit question (34, 35) is what sits before the takeaways |
| 20 Iterate Over Numbers | 16: a question slide carries the question alone | the question shares the slide with the `for each_number` shape |

Say "keep" and they stay as written; say "fix" and I propose wording per slide
before generating.

### D3. Slide 19's three steps.

`QuizTimeSlide` takes a title and subtitle only; the source adds three numbered
steps. **Recommended:** add an optional `steps` prop to `QuizTimeSlide` in the
kit (same PR as D1). The alternative is a `ContentSlide`, which loses the
quiz-frame look.

### D4. Slide 1.

The source greeting is `Welcome`; the kit's `BrandSlide` default is
`Welcome!`. **Recommended:** `Welcome`, as written. Rule 21 is satisfied either
way (slide 6 carries the only "Welcome to today's session").

---

## 3. Slide by slide

Legend: **Type** is the kit slide type. **Zone** is where the body sits under
rule 22. **Steps** are forward-key beats in order; a panel's own buttons are
listed where D1 (a) keeps them.

The one code box: every code box is x 64, y 221, 560 wide, 20px type on 36px
rows, titled `Python`. Consecutive code slides share one height: slides 8 to 10
six rows; 12 to 14 and 16 to 18 four rows (15 is six and grows down only); 29 and
30 three; 33 to 35 five. Output and input panels are `CodeOutput`'s panel:
white card, header strip, green dot `OUTPUT`, blue dot `INPUT`.

### Opening

**1. Welcome.** `BrandSlide` with the kit's default greeting (D4: "generate it as per kit").

**2. Recap.** `RecapSlide`, kicker `Recap`, title `Where We Left Off`, with the recap illustration.
- A while loop repeats a block of code · *As long as its condition is True*
- It needs three lines to work · *A start value, a condition, and an update*
- Miss the update and it never stops · *The condition stays True for ever*

**3. The while loop, in three parts.** Panel (new: `MatchPairs`). Kicker `Recap`, title `The while loop, in three parts`.
Lead: *Three parts on the left, three jobs on the right. Call out which two go together, then we join them.*
Left cards: `counter = 0` · `while counter < 3:` · `counter = counter + 1`.
Right cards: *Sets the starting value. Runs once, before the loop.* · *Moves the counter on, so the question can turn false.* · *The question asked before every pass.*
Buttons `Join them` / `Replay`, count `0 / 3`. Each press joins one pair (1, 2, 3) and adds its line:
1. *Initialization. Miss it and the name does not exist yet, so line 2 cannot even be asked.*
2. *The condition. For this program it is asked 4 times, not 3: once before each pass, and once more at the end when the answer is finally no.*
3. *Updation. Take this line out and the answer stays yes for ever, and the program never stops.*
Zone: body from y 221, grows down; buttons pinned at the foot.

**4. One tap, and it keeps going.** Panel (new: `PhonePlaylist` figure + `StepLines`). Kicker `Before we start`, title `One tap, and it keeps going`.
Phone: `9:41` · `Spotify` · `PLAYLIST` · `Today's Mix` · `Nxt Studio` · `Play all` · songs *Morning Raag, Ananya Rao, 3:58 · City Lights, The Verandah, 4:12 · Old Road, Kabir Sen, 3:21 · Paper Boats, Meera, 5:04 · Last Bus Home, Nikhil D, 3:47 · One More Song, Ananya Rao, 4:30* · player `Playing · Today's Mix` / `Stopped · The list ended`.
Steps (6), labels *the list | one tap | it moves on | to the end, and it stops | one more song | your turn*:
1. **The list** A Spotify playlist you made. Five songs.
2. **One tap** You tap play once. Song one starts.
3. **It moves on its own** Song one ends. Song two starts. You did not touch the phone.
4. **Right to the end, then it stops** The last song ends and it stops. Nothing says five. So what told it to stop?
5. **Add one song** Now there are six. It plays six. You never typed a number.
6. **Your turn** Where else does one tap keep going till a list runs out?

**5. Where else does this happen?** Panel (new: `ExampleTrio` + the loop-shape figure). Kicker `Your turn`, title `Where else does this happen?`
Steps (4), labels *your turn | our three | the shape | nowhere does it say six*:
1. Callout **Where else have you seen this?** One action, and it keeps going by itself until a list runs out. Three boxes, each labelled *yours*.
2. The boxes fill: **The attendance register** One name, one tick. It stops when the names run out. (names *Aarav, Diya, Ishan, Riya, Zoya*) · **Instagram stories** One story, then the next. Nobody types how many there are. (`Send message`) · **The billing counter** One item over the scanner, one beep, until the basket is empty. (`beep`). The three share one text size.
3. The shape: `the list` → *take the next one* → `do one job` → *when it ends, go back for the next one*; callout **Same shape all three times.** Take a list. Do one job. Once for each item in it. You never say how many.
4. Adds **Nowhere does it say six.**

**6. For Loop.** `WelcomeSlide` `minimal`, session name `For Loop`. (Its kicker is the kit's own "Welcome to today's session".)

**7. What We Will Cover.** `AgendaSlide`, disc `Agenda` / `What We Will Cover`.
1. For Loop · *Walk through a sequence, one item at a time*
2. Range · *Make a sequence of numbers*
3. The Star Pattern · *Write it yourself*
4. The One Mistake · *The one everybody makes*

### For Loop

**8. Identify the Mistake.** `ZonedFrame` + `CodeBlock` + two panels. Kicker `Daily Challenge`, title `Identify the Mistake`. Lead (Space-3): *The input is Python. Every letter should print on its own line.*
```python
a = input()
counter = 0
length_of_a = len(a)
while counter < (length_of_a - 1):
    print(a[counter])
    counter = counter + 1
```
Loop arrow lines 4 to 6. `INPUT` Python · `EXPECTED OUTPUT` P / y / t / h / o / n.

**9. Identify the Mistake.** Same frame. Lead: *One character, and the last letter comes back.* Code as slide 8 with line 4 `while counter < length_of_a:`, highlighted amber. `INPUT` Python · `OUTPUT` P / y / t / h / o / n.

**10. Can We Simplify This?** Kicker `While Loop`. Lead: *Three lines in this loop only keep count. None of them prints anything.*
```python
a = "Python"
length_of_a = len(a)
counter = 0
while counter < length_of_a:
    print(a[counter])
    counter = counter + 1
```
Lines 3, 4, 6 marked, with labels **Initialization** (3), **Termination condition** (4), **Updation** (6) on filled-triangle arrows.

**11. For Loop.** Kicker `Loops`. Lead: *A new loop that walks through a sequence by itself.* Left: **`for`** goes through each item of a sequence, one at a time; bullets *A string is a sequence* · *A sequence of characters* / *Numbers can be a sequence too* · *And many more kinds*. Right: dark `Pseudocode` box `for each_item in sequence:` over **Repeating block of code**.

**12. For Loop.** Kicker `Iterate Over Characters`. Lead: *The sequence here is a word. The loop takes its characters one by one.* Code box left, pseudocode box right:
```python
word = "Python"
for each_char in word:
    print(each_char)
```

**13. For Loop.** Kicker `Iterate Over Characters`. Lead: *The same job as the while loop, in two lines.* Same code as 12. **Not needed any more:** × Initialization · × Termination condition · × Updation.

**14. "Python", one character at a time.** Panel (new: `CodeWalker`). Kicker `A string is a sequence`.
```python
word = "Python"
for ch in word:
    print(ch)
print("Done")
```
Word picker `word` [`Python`] [`Go`] [`nothing`]; key *already run · running now · never reached, and it stays grey*; `"Python"` chip with `Split it` → boxes P y t h o n, `nothing left`; `ch` *not set yet* → trail of values (earlier values greyed, not struck through); `OUTPUT` panel, fixed height. Buttons `Play` / `One step` / `Reset`, count `0 / 15 steps`. Caption: **One string, or 6 characters?** Say which, then press **Split it**. (The per-step captions the panel writes, such as *Line 3. It prints whatever ch is holding right now.*, are carried over from its script unchanged.)

**15. Trace it before you run it.** Panel (`CodeWalker` in trace mode). Kicker `Worksheet task 1`.
```python
word = "Hi"
n = 0
for ch in word:
    n = n + 1
    print(ch)
print(n)
```
First beat: *Open **worksheet task 1**. Fill the pass table by hand before you run anything.* · Write what **ch** holds on each pass. · Write what **n** is after line 4. · Write what line 5 prints. · Then answer the two questions under the table. · timer `5:00` · **Do not run it yet.** The playground is where you check, not where you start.
Steps (11), labels *worksheet task 1 | line 1 | line 2 | line 3, first pass | line 4 | line 5 | line 3, second pass | line 4 | line 5 | line 3, third try | line 6*, captions:
1. **Worksheet task 1** Fill the table by hand first. Nothing here moves until pens are down.
2. **Line 1** word now holds the two characters H and i.
3. **Line 2** n starts at 0.
4. **Line 3, first pass** The loop takes the first item out of the sequence. ch is H.
5. **Line 4** n goes from 0 to 1.
6. **Line 5** It prints whatever ch is holding right now.
7. **Line 3, second pass** Back to the loop. It takes the next item. ch is i.
8. **Line 4** n goes from 1 to 2.
9. **Line 5** It prints i.
10. **Line 3, third try** The loop asks for the next item. There is none left, so the loop ends.
11. **Line 6** It prints n, which is 2. Two characters, two passes.
State per step: boxes H i / `nothing left`; `ch` and `n` trails as in the source; output H, H i, H i 2.

**16. Step 1: type it, run it.** Panel (new: `Countdown`). Kicker `Worksheet task 2`.
```python
word = "Rain"
for ch in word:
    print(ch)
print("Done")
```
Type this program into the **playground**. · Run it as it is. Then tick **step 1** on the worksheet. · timer `1:00` · caption **Worksheet tab and the playground only.** Nothing else open.

**17. Step 2: change the word.** Kicker `Worksheet task 2`. Code as 16 with line 1 `word = "Delhi"`, line 1 highlighted. Change line 1 to `word = "Delhi"`. · On the worksheet, write **how many lines** it will print. Then run it. · timer `1:30` · caption **Write first, run second.** A guess after the run is not a guess.

**18. Step 3: an empty word.** Kicker `Worksheet task 2`. Line 1 `word = ""`, highlighted. Change line 1 to `word = ""`. Two quote marks, nothing between. · On the worksheet, write **what it will print**. Run it. Then write what it really printed. · timer `2:00` · caption **Write first, run second.** Does it give an error? Decide before you run.

**19. Classroom Quiz.** `QuizTimeSlide` + `steps` (D3); with steps it uses the pinned header, since the 88px title cannot share its half with three steps without wrapping (rule 25). Kicker `Quiz time`, title `Classroom Quiz`, subtitle *Time to check what you have learned so far.*
1. Open the quiz on your portal 2. Answer every question on your own 3. We go through the answers together

### Range

**20. Iterate Over Numbers.** Kicker `For Loop`. Lead: *A for loop needs a sequence. What if we want numbers, like 0, 1, 2, 3?* Left: How do we make a **sequence of numbers**? Right: `Pseudocode` box `for each_number in sequence_of_numbers:` over **Repeating block of code**.

**21. Range.** Kicker `Iterate Over Numbers`. Lead: *range gives us a sequence of whole numbers.* `range(n)` ↓ Stops before **n** (**n** is not included). Callout **What it gives** A sequence of integers, starting from **0**.

**22. Sequence of Integers.** Kicker `Range`. Lead: *range(5) gives five numbers. The count starts at 0.* `range(5)` → 0 1 2 3 4.

**23. Range.** Kicker `Iterate Over Numbers`. Lead: *The loop runs once for each number that range gives.* `CodeOutput`:
```python
for number in range(3):
    print(number)
```
`OUTPUT` 0 / 1 / 2.

**24. The range dial.** Panel (new: `RangeDial`). Kicker `Predict, then look`. `range( 1 , 5 )` with `start` − + and `stop` − +; cells 0 to 10. Button `Show the numbers`, hint *Say which numbers, and how many. Then press.* Caption **Say the two numbers out loud first.** Which numbers come out, and how many? Then press the button.

**25. Riya's piggy bank.** Panel (new: `StoryStrip`). Kicker `A story`. Day strip Day 1 ₹1 · Day 2 skip · Day 3 ₹3 · Day 4 skip · Day 5 ₹5 · Day 6 skip · Day 7 ₹7; Riya; piggy bank *in the piggy bank* ₹0 → ₹16.
Steps (6), labels *the plan | day 1 | day 2 | day 3 | up to day 7 | your turn*, bubbles:
1. I want to save money. But I will save only on odd days. (caption: **Riya's rule:** on an odd day d, she saves ₹d. On an even day, she saves nothing.)
2. Day 1 is odd. I put in ₹1.
3. Day 2 is even. Nothing for me today!
4. Day 3 is odd. I put in ₹3.
5. Day 5 gives ₹5. Day 7 gives ₹7. Now I have ₹16!
6. What about 30 days? Or a whole year? I can't add all that by hand! (caption: **Your turn.** Write a program that works out Riya's money for any number of days.)

**26. Riya's savings.** Panel (`Countdown`). Kicker `Coding challenge`. Card `PROBLEM` **Riya's savings**: Read a number **n**. Print the total money Riya saves from **day 1 to day n**, both days included. On an odd day **d**, she saves ₹d. On an even day, she saves nothing. Examples `INPUT 7 / OUTPUT 16`, `INPUT 4 / OUTPUT 4`. Right: Open the **playground**. Write Riya's program. 1. Run it with **7**. It must print **16**. 2. Then run it with **10**. Keep that answer ready. Timer `4:00`. Steps (2) *the problem | the hint*: step 2 adds **Hint** `day % 2 == 1` is True only when **day** is odd.

**27. Riya's savings, day by day.** Panel (`CodeWalker`). Kicker `Check it together`.
```python
n = int(input())
total = 0
for day in range(1, n + 1):
    if day % 2 == 1:
        total = total + day
print(total)
```
*input: 7*; day tiles 1 +1 · 2 skip · 3 +3 · 4 skip · 5 +5 · 6 skip · 7 +7; `total` trail 0 → 1 → 4 → 9 → 16; piggy ₹0 → ₹16; `OUTPUT` 16.
Steps (10), labels *lines 1 and 2 | day 1 | … | day 7 | no days left | line 6*, captions:
1. **Lines 1 and 2** n is 7. total starts at 0.
2. **Day 1** 1 is odd. total goes from 0 to 1.
3. **Day 2** 2 is even. The if is False, so total stays 1.
4. **Day 3** 3 is odd. total goes from 1 to 4.
5. **Day 4** 4 is even. The if is False, so total stays 4.
6. **Day 5** 5 is odd. total goes from 4 to 9.
7. **Day 6** 6 is even. The if is False, so total stays 9.
8. **Day 7** 7 is odd. total goes from 9 to 16.
9. **No days left** range stops before 8. The loop ends.
10. **Line 6** It prints 16. That is Riya's money after 7 days.

### The Star Pattern

**28. Right Angle Triangular Pattern.** Kicker `Example`. Lead: *Write a program to print a right angle triangle pattern. The number N is the input.* `INPUT` 4 · `OUTPUT` `*` / `* *` / `* * *` / `* * * *`.

**29. Write the loop line.** Panel (`Countdown`). Kicker `Worksheet task 3`.
```python
n = int(input())
___________________________
    print("* " * ______)
```
Line 1 is given. **Line 2 and the blank on line 3 are yours.** · For n = 4 it prints 4 rows. The last row is `* * * *` · *The two blanks must agree. More than one pair works.* · timer `4:00` · caption **Worksheet task 3.** Write line 2 in full, with the colon. Then try it in the playground.

**30. Solution.** Kicker `For Loop`. Lead: *counter goes 0, 1, 2, 3. Each line prints counter + 1 stars.*
```python
n = int(input())
for counter in range(n):
    print("* " * (counter + 1))
```
`INPUT` 4 · `OUTPUT` the four rows.

### The One Mistake

**31. Which one is right?** Panel (new: `RunCompare`). Kicker `Predict, then run`. Question (Space-3): *Both of these start at 1. Which one prints all **n** rows?* `n = 4` with − +.
**A** `range(1, n)`: `n = int(input())` / `for counter in range(1, n):` / `    print("* " * counter)` → 3 rows, and a dashed `* * * *` *the row you wanted* · **3 rows**.
**B** `range(1, n + 1)`: same with `range(1, n + 1)` → 4 rows · **4 rows**.
Button `Run them both`, hint *Count the hands for A, then for B. Then press.* Caption **Hands up for A. Now hands up for B.** Count both before you press Run.

**32. Range.** Kicker `Iterate Over Numbers`. Lead: *range can also start at a number you choose.* Makes a sequence of numbers starting from **start** ↑ `range(start, end)` ↓ Stops before **end** (**end** is not included).

**33. For Loop.** Kicker `Iterate Over Numbers`. Lead: *Simpler with range(1, n + 1). counter is already the number of stars.*
```python
n = int(input())
for counter in range(1, n + 1):
    print("* " * counter)
```
Line 2 marked. `INPUT` 4 · `OUTPUT` the four rows.

### Close

**34. Which one prints nothing?** Panel (`Countdown`). Kicker `Exit question`. Question (Space-3): *Read the code. For which pair does the screen show **nothing at all**?*
```python
seats = int(input())
booked = int(input())
left = seats - booked
for i in range(1, left):
    print("Seat", i)
```
A seats = 5, booked = 3 · B seats = 4, booked = 3 · C seats = 3, booked = 0 · D seats = 6, booked = 2 · timer `2:30`.

**35. Why it prints nothing.** Panel (`CodeWalker`). Kicker `Exit question`. Same code; `seats` 4 · `booked` 3 · `left` 1 · `range(1, 1)` *no numbers* · empty `OUTPUT` · *nothing printed*.
Steps (4), labels *the pair | line 3 | line 4 | nothing*:
1. **Option B.** seats is 4 and booked is 3.
2. **Line 3.** left is 4 minus 3, which is 1.
3. **Line 4.** range(1, 1) starts at 1 and stops before 1. It has no numbers in it.
4. **Nothing is printed.** The loop body never runs, so the screen stays empty.

**36. What we did today.** `KeyTakeawaysSlide` as a network (new layout: `TakeawayTree`), kicker `For loop`, title `What we did today`. Steps (7), one node each (D2 rule 20):
1. `for loop` walks a sequence, one item at a time
2. `string` "Python" is a sequence of 6 characters
3. `range` range makes a sequence of numbers
4. `ch` holds one item. It changes every pass
5. `stop` range(1, 5) gives 1 2 3 4, not 5
6. `how many` the sequence decides how many passes happen
7. `empty` an empty sequence means the body never runs

**37. Feedback.** `FeedbackSlide`, kicker `Feedback`, title `We’d love your feedback` (the kit's own default). It wraps onto two lines in the kit's layout: a kit issue under rule 25, left open.

**38. Thank you.** `ThankYouSlide`, `Thank you!`.

---

## 4. New kit components (D1 (a))

Each is built once, in `slide-kit/slide-template/src/ui/` or `src/slides/`, added
to `sampleDeck.tsx` and the registry, and raised as one PR:

| Component | Used on | What it does |
|---|---|---|
| `MatchPairs` | 3 | two columns of cards, one press joins the next pair and adds its explanation |
| `StepLines` | 4 | lines that light one per step beside a figure |
| `PhonePlaylist` | 4 | the phone and playlist, song highlight per step |
| `ExampleTrio` | 5 | three example boxes that fill on a step, one shared text size |
| `CodeWalker` | 14, 15, 27, 35 | `CodeBlock` + per-line state (run, now, dead) + variable trails + a fixed-height `CodeOutput` panel, driven by steps or by Play / One step / Reset |
| `Countdown` | 15, 16, 17, 18, 26, 29, 34 | the play / ring / time pill |
| `RangeDial` | 24 | start and stop steppers, the 0 to 10 cells, Show the numbers |
| `StoryStrip` | 25 | day strip, character, bubble, piggy bank total |
| `RunCompare` | 31 | two programs, an `n` stepper, Run them both, row counts |
| `TakeawayTree` | 36 | the takeaway nodes on connecting lines, one per step |
| `QuizTimeSlide` `steps` | 19 | the three numbered steps |

## 5. Verification

`npm run typecheck`, `npm run build:html`, then `video-safe.mjs`, `qa.mjs` and
`align-check.mjs` in parallel, `preview.mjs` and the contact sheet. Every panel is
also clicked through step by step: nothing may enter the speaker box, leave the
frame, or move between steps; the code box must measure the same on every code
slide.
