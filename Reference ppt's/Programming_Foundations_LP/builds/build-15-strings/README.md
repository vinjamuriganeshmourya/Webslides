# Session 15: String Methods

The finished plan is **generated**, never hand-edited.

| Path | Is |
|---|---|
| `build.py` | The generator. Writes all three files and copies them to `Plans/` |
| `cards.py` | Every card, in presentation order |
| `hook.py` | The hook: the chat message the search box cannot find |
| `slicing.py` | Slides 12 and 17, redrawn so the characters actually move |
| `why.py` | The second hook: the PIN screen, the long way, the short way |
| `method.py` | All five method cards: the line, then the answer, then what it does |
| `codecard.py` | The one editor card. White, file tab, line numbers, coloured keywords |
| `machine.py` | The slice machine, activity template 21 |
| `walker.py` | The strip explainer, and worksheet task 3's reveal |
| `takeaways.py` | The two takeaway boards. **Replaced `maps.py`, which is gone** |
| `agenda.py` | The deck's agenda ribbon, one stop per press |
| `panels.py` | The data every answer is derived from. No typed answers |
| `guide.py` | One entry per card, plus the bands and the short-of-time lines |
| `styles.py` | `{{EXTRA_CSS}}`, assembled from `_css_kept/_css_rest/_css_hook` |
| `worksheet.py` | The digital handout |
| `work/beats.json` | The beat table `plan_shape.py` was run against |
| `media/`, `originals/` | The kept deck slides. Nothing was edited, so both match |

```
python build.py              # all three, into out/ and then into Plans/
python build.py --no-shots   # skip the browser pass, reuse out/thumbs/
```

Order matters: the presenter is written first, `render_thumbs.py` photographs
**that** file, and the guide is built from the photographs.

## Shape

6 deck slides + 20 panels + 5 fixed spine cards = **31 cards, 20 blocks, 6
checkpoint bands, 75 minutes**. 32 is the ceiling; `verify_plan.py` fails at 33.

Slides kept: 13, 15, 30, 35, 36, 38. Not one of them is a definition slide.

**`plan_shape.py` reports two deliberate failures**, and they are the same
decision counted twice:

    deck cut to 14-18 slides       6 kept of 59
    panel budget is 8 to 12        15 panels

Every definition slide is out (26, 31, 39, 42, 48) because each one stated in
the deck's words what the method card beside it had just shown: the room read
the sentence before it was said and heard it again after. Press 3 of each
method card carries that wording now, and every method is one built card, so
what used to be `.slide` is `.pcard`. Three of the deck's flat pictures are
redrawn as animated panels as well (12, 17, 18), and the two Key Takeaways
slides are now two boards of worked examples.

Both floors exist to stop a plan being a list of slides. This plan is the
opposite of that, and the deck slides it does keep are all scenes or examples
that set up the card after them. Everything else in both linters passes.

The minutes are not free to move. `plan_shape` wants the classroom quiz
between 38% and 66% of the session, and the quiz is the join: everything before
it is slicing. 29 of 75 minutes is 38.7%, so a minute taken out of the slicing
half fails that check. If you need a minute, take it from after the quiz.

## The one idea

A string method never changes your string. It hands you back a new one, and
the only thing you have to get right is **where it stops**. `[start:end:step]`
stops before `end`; `strip` works in from each end and stops at the first
character that is not in the set, so anything in the middle is never even
looked at.

## The order

**The classroom quiz is the join.** Everything before it is slicing;
everything after it is string methods. `check_browser.mjs` asserts that no
method name appears on a teaching card before the quiz, and that all five
appear after it.

The second half, card by card:

    14  why a method at all          the PIN screen, the loop, the two lines
    15  isdigit                      the line, the ticks, the shape
    16  slide 30                     two numbers that are not equal
    17  strip                        the line, the spaces falling, the shape
    18  the explainer                where does strip stop
    19  slide 35                     the dot in the middle stays
    20  slide 36                     a set of characters, not a word
    21  worksheet task 3             trace it, then check it
    22  slide 38                     the same typo in a long document
    23  replace                      one of them, or both
    24  startswith                   the line, the frame, the shape
    25  worksheet task 4             they write endswith
    26  upper and lower              one card, both directions

`strip` gets the most room of the five because the exit question turns on it:
the method card, the explainer, two deck examples and the paper trace.

## The two hooks

There are two, one per half, because the two halves are two different
arguments. `feedback-hook-never-reused` is about not reusing a hook between
sessions; it does not mean a session gets one.

### The chat hook, card 4

People stretch text out in chat. `S O R R Y`. Everyone in the room has done it
or had it done at them. Then you search the chat for SORRY and it finds
nothing, and the letters are right there on the screen.

Six presses: the fight, her search failing, the message from Tuesday, the nine
boxes, a run of five side by side (which drags the spaces along), and the turn.

**Two story rails, and exactly one is up.** While the phone is the card the
three lines are large and centred (`.hkrailbig`); once the boxes arrive on
press 4 the same three lines shrink to a strip above them (`.hkrailsm`). They
sit at different y values, so leaving both visible paints one straight through
the other. That is what it did before the rules for `.hkrail` existed.

**The 640ms delay belongs to the colour, not to the element.** `transition-delay`
on `.hkcell.hkd .hkch` delayed `opacity` along with `fill`, so jumping straight
to the last press left nine empty boxes on screen for two thirds of a second.
The delay is written into the `fill` transition now.

### The PIN hook, card 14

The second half used to open on `isdigit` out of nowhere. A method arriving
with no reason is a name to memorise, so card 14 is the transcript's own
scenario: an app takes a 4 digit PIN and has to know every character is a
digit.

Five presses: the PIN screen with a keypad; somebody types `47a8` and the app
refuses it; the long way, a loop with ten comparisons inside it; the count, 40
comparisons and 9 lines; then two lines, and only then the name.

**The long program is real and it runs.** `panels.why_long_out` is the same
loop in the same order, and `check_answers.py` asserts its answer agrees with
`isdigit`. The argument is the length of the two programs, so the numbers on
press 4 are computed, never typed.

The phone is drawn once and reacts to the press through `.an-N`: the digits
land in boxes that were already there and the refusal fades in under them.

**One moving group.** `.hkcomb` carries five marks and four jump arcs drawn on
boxes 0 to 4. `scaleX(2)` about the first mark sends them to 0, 2, 4, 6 and 8,
which is the step, drawn rather than named. 900ms on `--ease-in-out`. The
characters never move. The origin is written into the transform as arithmetic
(`translate(-412px,0) scale(2,1)`); `hook.SHIFT` computes the number and
`styles.py` substitutes it, so the geometry and the CSS cannot drift apart.

The hook also does the session's other half without naming it: a space is a
character, which is exactly why two phone numbers that look identical are not
equal on card 16.

## The animated cards

**Card 7, the pull-out** (slide 12 redrawn). **It opens on indexing, not on a
slice**, because that is the question the slice is the answer to: press 2 is
`message[0]` giving `H`, and only then is the room asked how to get `Ravi` out.
A card that opens on `message[3:7]` has answered it before anybody wondered.

Five presses: the string in numbered boxes; one number and one character; a
window over the four the name sits in, **with no line written yet**; the line,
big, and the box it never reaches arriving with it; then the copy. On press 5
the four characters are **copied** into the result and the row keeps all seven:
a version that lifted them out would teach the opposite of the one idea.

**The expression is the biggest text on both slicing cards, and it sits one
line under the string.** It used to be 30px at the very bottom edge, smaller
than the captions: the one line the card exists to teach was the one line
nobody could read from the back row. `check_browser.mjs` measures it against
the caption's font size and against the top of the box row.

**Card 10, the jump** (slides 17 and 18 redrawn). The line is at the top from
press 1: this card is a walk, not a reveal, so the room knows what is being
traced. One marker hops the step, one landing per press, and the room says the
sum before each press. On press 6 the boxes it never landed on go dashed and
stay that way.

**Its second caption line used to be drawn outside the viewBox.** `CAP_Y + 30`
was 482 in a 470 high box, so *The next one would be 9, and we stop before 8*
was clipped at 100% zoom and nobody in the room ever saw it. Both cards are 512
high now and `check_browser.mjs` measures every caption's bbox against the
viewBox.

**Card 11, the slice machine** (template 21). Five levels; the first three are
the three slices the room has just written on the worksheet. Run is disabled
until an option is picked, and that gate is the activity. Level 5 lands
nowhere at all.

**Cards 15, 17, 23, 24 and 26, the method cards.** All five methods run in the
same rhythm and each gets exactly one card. Press 1 is the line and an empty
output box. Press 2 runs it, and the mechanism runs with it. Press 3 is the
shape and the sentence, and **there is no deck slide behind it saying the same
thing**, so press 3 cannot be skipped.

The mechanism is always the thing the method actually does:

| card | method | what moves on press 2 |
|---|---|---|
| 15 | `isdigit` | every character is ticked or crossed in turn |
| 17 | `strip` | the four spaces fall off the two ends |
| 23 | `replace` | the two wrong words flip, and the other three never move |
| 24 | `startswith` | the front of the string is framed, and it stops there |
| 26 | `upper` | every letter turns into its capital, in place |

`isdigit` and `upper` have a fourth press: the input that makes `isdigit`
False, and `lower` on the same row of boxes. The `upper` row holds all three
readings of each character and shows one at a time, so the room watches the
same boxes change rather than a second row appear underneath.

**Card 18, the strip explainer.** `"--Ra-vi--"` with four preset arguments. A
character strip eats vanishes; the one that stopped it gets a green `stop`
tag; and a character in the middle that IS in the set but was never reached
goes dashed, says `never`, and stays that way after the run ends. That
persistence is the finding, and it is what the exit turns on.

The walk comes **before** the paper trace on card 21. An animated walk shown
after they have traced it by hand is a downgrade: the work is already done.

## The two takeaway boards

**These replaced two maps, and `maps.py` is gone.** The map was rejected for
the right reason: a box reading `stop` joined by a line to a box reading
`start` is a picture of vocabulary. It told a student who already understood
slicing nothing, a student who did not could not get in, and there were no
examples on it at all, on the one card a student photographs.

So the takeaway **is** the examples.

**Card 28, the slice board.** One string with its index row, and four slices of
it under it, each with the output it really gives and the one sentence that
explains that output. All four are lines the room has already written or run.
Press 5 is the two rules no single row can say: the stop number is never
reached, and your own string never changes.

**Card 29, the method board.** Six cells, one per press: five methods with the
real line, what that line prints, and which of the two kinds of thing it handed
back; then the split, which is the part no cell says on its own. Two answer a
question, three hand back a new string, and not one of them changes the string
you started with.

Two things about how they are built:

* **HTML, not SVG.** The map's labels had to be measured against their
  rectangles and `check_browser.mjs` had to fail the build when one ran over. A
  box that grows cannot overflow, so that whole class of defect is gone.
* **The row is its own slot.** Every row and cell is drawn as a dashed shell
  from press 1 and only its contents arrive on its press, so the card is never
  one row and a screenful of white, and nothing is drawn twice to hold the
  space open.

The method board's longest line is split into two pieces, the subject over the
call, because as one string it wrapped inside a token: `"htt` on one line and
`ps://"` on the next. `check_browser.mjs` fails the build if any code element
on that board ever paints on more than one line.

## One code style

`codecard.py` is the only way code appears on a card: a white editor card with
a file tab, line numbers and coloured keywords. `codecard.paint` walks the line
rather than running a regex over it, so a keyword inside a string is never
coloured as a keyword.

The typeit card, both task 4 cards and all five method cards use it. The only
code on a card that does not is the exit MCQ, which uses the template's own
`pre.slabcode` and its present-mode scaling.

The output box stays black. That is the deck's own language: every deck slide
with an output pairs a white code card with a black one.

## The exit

```
1  pin = input()
2  pin = pin.strip("-0")
3  if pin.isdigit():
4      if len(pin) == 4:
5          print("Valid")
```

Four typed inputs. Three strip down to `4748` and print `Valid`; `-4-748-`
strips down to `4-748`, so `isdigit` is False and line 4 is never even asked.
A big vote for `-47480-` means the room thinks strip takes one character off
each end and stops.

## Checks

```
PYTHONIOENCODING=utf-8 python  ~/.claude/skills/prog-lesson-plan/scripts/plan_shape.py work/beats.json
PYTHONIOENCODING=utf-8 python  ~/.claude/skills/prog-lesson-plan/scripts/verify_plan.py \
    "../../Plans/Programming Foundations/15 - String Methods/15_string_methods_student_view.html" \
    --stale "For Loop,Nested,slide 25,slide 27,page 1 of,card 31,of 31,Delhi,range dial"
PYTHONIOENCODING=utf-8 python check_answers.py    # 127 answers, all re-derived
PYTHONIOENCODING=utf-8 python audit_motion.py     # the twelve motion blocks
PYTHONIOENCODING=utf-8 python audit_motion.py slow   # the hook at 4x duration
PYTHONIOENCODING=utf-8 python peek.py             # errors, and every panel rendered
PYTHONIOENCODING=utf-8 python sweep.py shots      # every card at EVERY step
node    check_browser.mjs
node    gaps.mjs                  # the biggest empty band per card
node    ../../tools/check_trio.mjs "Plans/Programming Foundations/15 - String Methods"
```

`gaps.mjs` is copied from `build-dsa-m3-03-linkedlist`. **This skill's
`plan-template.html` still has `body.present .stage-rule{margin-top:auto}`**,
the trap in `reference-panel-slack-trap`; the fix landed in the DSA template,
not in this one. Every panel in this plan gives its body `flex:1` so the slack
is absorbed, and the worst band on a card built here is 191px. The two above
200px are the title card (392) and the exit MCQ (246): the title card is the
user's own artwork and the exit is unchanged by this round. Both want the
template fix rather than a patch here.

Current: `plan_shape` 39/0/2 (the two documented floors), `verify_plan` 84/1/0,
`check_answers` 115/115, `audit_motion` 12/12, `sweep` no overflow at any step,
`check_browser` 135/135, `check_trio` all three pass.

`audit_motion` reads the hook's press count off `hook.STEPS` rather than
holding a copy of it. It used to assert `.an-4 .hkcomb`, which went stale the
moment the hook grew a beat, and a checker that knows better than the thing it
checks is how a real regression gets a green tick.

Always run the Python checkers with `PYTHONIOENCODING=utf-8`.

## Fixed upstream in the skill, not here

- **The `sort` recap's landed chips had no present-mode type scale at all**, so
  the one card carrying the recap's answers stayed at reading size on a
  projector. `.rcp-landed` now scales and the chip's own value is set a size up
  from the reason under it.
- **`.tmr-btn:active` pressed to `scale(.93)`**, outside the 0.95 to 0.98 band
  in `review-animations/STANDARDS.md`. Now `.96`.

## What this round changed, and why

Six notes from the user, and what each turned into:

1. **The agenda said `Extended slicing` and `take every second one`.** It says
   `String slicing` and `take a part of a string` now, every stop carries a
   plain definition, and *the part people get wrong* is gone: it named a
   feeling, not a thing. The amber band (*and your own string never changes*)
   is gone too, and its claim is on the takeaway board where it belongs. Each
   stop now carries one real line from later in the session, which is also why
   the card is not half white without the band.
2. **`message[3:7]` was 30px at the bottom edge.** It is 44px, one line under
   the string, and the card opens on `message[0]` so the slice is an answer.
3. **A caption was drawn outside the jump card's viewBox**, so the line about
   stopping before 8 was clipped at 100% zoom. Both slicing cards are 512 high
   and the expression is at the top.
4. **`isdigit` arrived out of nowhere after the quiz.** Card 14 is the PIN
   screen, the loop with ten comparisons in it, and the two lines that replace
   it.
5. **Every method was followed by the deck's definition slide saying the same
   thing.** Those five slides are out. Each method is one card in one rhythm,
   with its own worked mechanism and its own output.
6. **The takeaway was two maps with no examples on them.** It is two boards of
   worked examples, in HTML so nothing can overflow.

## Defects only a screenshot caught

- The first hook invented its premise: an OTP arriving with a `#` between every
  character is not a thing anybody has seen. Replaced with stretched chat text,
  which everybody has.
- The takeaway map had a node called `today`, which is a heading with a box
  round it, and its longest label ran out of its rectangle. Two maps now, every
  node a concept, and the label width is measured rather than hoped over.
- The method cards were pinned to the top of the card with a white lower half:
  the stage centres its own header and rule, so the body needed its own box to
  grow into (`.mthbody`).
- The endswith card mixed the two steppers: `.stage-step` belongs to the Back
  and Next stepper, not to `data-anim`, so press 2 never arrived.
- The instruction lists carried an inline `font-size:16px`, which no projector
  rule can beat. They are `.steplist` now.
- The walker's `stops here` and `never reached` tags ran into each other when
  the two boxes were neighbours, and at the width that fixed it the nine boxes
  wrapped onto a second line. Short words, narrower boxes, and
  `check_browser.mjs` counts the rows.
- The hook's digits lit up while the marks were still travelling. Only visible
  at 4x duration; they land on a 640ms delay now.

## Source defects, reported to the deck owner

- **Slide 56 does not belong to this deck.** *Step - 1, Checking System
  Requirements*, with a cogwheel, sitting between Practice and Feedback.
- Slides 27, 32, 34, 37, 40, 43, 46, 49 and 52 are each the slide before them
  with the output added, so the deck shows the answer before it has asked the
  question.
- Every method is introduced definition first and example second. The plan
  turns that round.
- Nothing in the deck states where `strip` stops. The transcript shows the
  instructor explaining it at length from the playground, and that explanation
  is on no slide.
