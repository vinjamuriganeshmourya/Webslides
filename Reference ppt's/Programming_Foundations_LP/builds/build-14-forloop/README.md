# Session 14: For Loop

The finished plan is **generated**, never hand-edited.

| Path | Is |
|---|---|
| `build.py` | The generator. Writes all three files and copies them to `Plans/` |
| `cards.py` | Every card, in presentation order |
| `hook.py` | The Spotify hook, and the three everyday machines on the card after it |
| `agenda.py` | The deck's agenda ribbon, redrawn and stepped |
| `walker.py` | Worksheet task 1's answer walk, and the animated explainer |
| `panels.py` | The data every answer is derived from. Nothing here is a typed answer |
| `guide.py` | One entry per card, plus the bands and the short-of-time lines |
| `styles.py` | All of `{{EXTRA_CSS}}` |
| `worksheet.py` | The digital handout |
| `deck_surgery.py` | Re-heads slide 40 from the deck's own type. Run before `build.py` |
| `work/beats.json` | The beat table `plan_shape.py` was run against |
| `media/`, `out/thumbs/` | Deck slides; the card photographs the guide uses |

```
python deck_surgery.py       # only after work/slides is re-extracted
python build.py              # all three, into out/ and then into Plans/
python build.py --no-shots   # skip the browser pass, reuse out/thumbs/
```

Order matters in `build.py`: the presenter is written first, `render_thumbs.py`
photographs **that** file, and the guide is built from the photographs.

## Shape

14 deck slides + 13 designed panels + the 5 fixed spine cards = **32 cards, 16
blocks, 5 checkpoint bands, 75 minutes**. That is the ceiling: `verify_plan.py`
fails at 33 cards and `plan_shape.py` holds a floor of 14 deck slides, so
anything added from here has to replace something.

Slides kept: 8, 11, 15, 16, 17, 18, 33, 34, 35, 36, 37, 40, 42, 45.

## The fixed spine

Cards 1, 2, 3, 6, 17, 31 and 32 are not designed here. They come from
`~/.claude/skills/prog-lesson-plan/assets/standard_slides.py`, so every plan in
every subject opens and closes the same way.

| Card | From |
|---|---|
| 1 Welcome | `S.welcome()` |
| 2 Recap | `S.recap_title()` |
| 3 Recap activity | `S.recap('match', ...)` |
| 6 Today | `S.title_card('For Loop')` |
| 17 Classroom quiz | `S.quiz()` |
| 31, 32 Feedback, Thank you | `S.feedback()`, `S.thankyou()` |

The file names come from `standard_slides.file_names(SESSION)`. Nothing spells
one by hand, and `verify_plan.py` fails a name with a space or a capital in it.
The old `14 - For Loop_*.html` files are in
`Plans/Programming Foundations/_archive/14 - For Loop (old names)/`.

**The title card comes after the hook**, so nothing before card 6 prints the
words For Loop. `check_browser.mjs` asserts that cards 1 to 4 do not carry them.

**The recap is `match`, not `bug`.** Session 12 used `bug`, and the room does not
meet the same shape two sessions running. The three pairs are the three parts of
a while loop, because card 13 is about which of those three the for loop drops.
The count on the condition pair, four checks and not three, is derived by
running the loop in `panels.recap_checks()`, never typed.

**The classroom quiz runs on the portal**, at minute 39 of 75. The card is the
picture and nothing else.

## The hook, and the card after it

**Card 4 is the phone**, and it is Spotify: the room recognises the screen before
it reads a word of it, and a near miss reads as a fake. The album tiles and the
playlist cover carry the beamed-quaver glyph every music app uses, drawn once in
`hook._note()`. **Nowhere on the phone does it say five**, which is the whole
point of the card, and `check_browser.mjs` asserts that neither the word five nor
any song count is anywhere in the SVG's text. Song durations are not counts, so
the check names the shapes a count would take rather than banning the digit.

Six presses, and the song story is told all the way through before the room is
asked anything: the list, one tap, it moves on its own, right to the end and it
stops, add one song, **your turn**. Every line is on the card from press 1,
ghosted until its turn, so the column is the same height on every press and the
first line never rides up under the card heading.

**Card 5 is where their answers go.** Three slots, each with its machine already
drawn pale inside, so the question is never asked at a blank half of a card. The
room's own examples come out first; press 2 fills the slots with ours, at a size
worth looking at: the attendance register, Instagram stories, the billing
counter. Each runs at its own period (2600, 3000 and 3400ms) so three loops never
beat in unison. **Press 3 is the construct**, and press 4 is the line under it:
*Nowhere does it say six.*

## The agenda, redrawn

Card 7 is deck slide 12's own chevron ribbon, redrawn so it arrives one stop at a
time. The flat slide lands all at once and the room reads stop three while the
instructor is still on stop one. All three stops are outlined in dashes from
press 1. The fourth press adds the line the deck leaves off, and it is the line
half the back half of the session is about: *and the one mistake everybody
makes.*

## The explainer, on card 14

It opens on `"Python"` **whole**, as one thing, and splits it into its six
characters on a press. That split is deck slides 13 and 14 done as a move instead
of as a picture, and it is the idea the rest of the session rests on. Then the
room picks a word and commits to a number before Play is pressed. With the empty
word line 3 is never reached and **stays grey** after the run ends.

It sits **before** worksheet task 1, not after it. Watching a walk after they
have already traced one by hand is a downgrade; watching one before they trace is
the demonstration.

## Worksheet task 1 is one card, not two

Card 15 press 1 is the task: the program on the left, the instructions and the
timer on the right. Presses 2 to 11 walk the answer in the same place. The code
the room traced never leaves the screen, so they check their own row against the
one on screen, and the instructor never changes card mid-check.

## The two bespoke range panels

**Card 22, the range dial.** `range(start, stop)` with a stepper on each number
and a number line from 0 to 10. Press **Show the numbers** and they land one at a
time; the stop value gets a thin red cross on its own tick with the number still
readable through it. **Changing either number hides the numbers again**, so the
room predicts before every reveal, not only the first.

**Card 26, the vote.** Two programs three characters apart on the same n, A and
B, side by side. Hands are counted for each before anything is pressed. **Run
them both** lands the star rows on each side, then a dashed empty outline appears
on the left saying *the row you wanted*, and only then is B marked. Change n and
the gap is always exactly one.

## What was cut, and why

- **Deck slide 12** is redrawn as card 7. See above.
- **Deck slides 13 and 14** are replaced by card 14's split.
- **Deck slides 19 to 32** walk one for loop over `"Python"`, one character per
  slide. Card 14 does the same walk, at a speed the instructor controls, on a
  word the room picks.
- **Deck slide 46**, the possible mistake, is card 26's option A, voted on and
  then run. The answer is withheld until the room has committed.
- **Sort them into bins** (the old worksheet task 4) went when the room's own
  examples card needed the space. The dial and the vote cover the same ground:
  which numbers come out, how many, and the case where none do.
- **Worksheet task 1's `if n > 5: print("long")`** went. It tests nothing about a
  for loop, and an unreached branch in the middle of a first trace is a second
  lesson nobody asked for.

## Deck surgery: slide 40

The deck heads slide 40 *Iterate Over Numbers / Range*. By minute 55 the room has
had range for ten minutes and a card headed Range reads as a step backwards; the
card is the answer to the question the room has just written, so it is headed
**Solution**.

Every slide is a flat image, so there is no text layer. The two words are
therefore **not typed**: `deck_surgery.py` lifts *Solution* out of slide 9's
"Possible Solutions" one pixel before the final s, lifts *For Loop* out of slide
46's eyebrow, and pastes both at slide 40's own heading coordinates. Same face,
same size, same colour, same baseline. It always starts from the untouched
capture in `work/slides`, never from its own output, so it is safe to re-run.

## The guide

The `gwhen` line on each entry carries **that card's** minutes and, once, its
block's. Four cards in a row each claiming the block's six minutes is how an
instructor loses the thread at minute 40.

Every entry that can be shortened carries one `Short of time:` bullet, keyed in
`guide.SHORT` by the card's **title**, not its number, so inserting a card cannot
shift a line on to the wrong entry. Every checkpoint band names the cut to take.

## Checks

```
python  ~/.claude/skills/prog-lesson-plan/scripts/plan_shape.py work/beats.json
python  ~/.claude/skills/prog-lesson-plan/scripts/verify_plan.py "../../Plans/Programming Foundations/14 - For Loop/14_for_loop_student_view.html"
python  check_answers.py
python  audit_motion.py
python  peek.py            # overflow, closed and revealed
python  steps.py           # the stepped states the card list never reaches
node    check_browser.mjs
node    ../../tools/check_trio.mjs "Plans/Programming Foundations/14 - For Loop"
```

`verify_plan.py` reports one warning, `every deck slide appears`, with 31
numbers. That is the cut, and it is deliberate: 14 of 53 slides are kept.

Always run the Python checkers with `PYTHONIOENCODING=utf-8`: `verify_plan.py`
prints an arrow that cp1252 cannot encode and dies half way through otherwise.

## Defects only a screenshot caught

- **`display:flex` on its own lays a column of blocks out in a row.** Worksheet
  task 1's instructions and then its whole answer side arrived sideways, and
  every checker passed.
- **The explainer's terminal took the column.** `.term` is `flex:1`, so a panel
  with nothing printed yet opened as a wall of black. It sizes to its own text
  now.
- **The takeaway rows ran off the right edge** once each line had a chip in front
  of it. The map is 1240 units wide, not 1000.
- **The agenda's dashed ghost showed as a halo** around the chevron that had
  landed on it. The filled path carries its own stroke and covers it.
- **The register's names grew into its own caption**, and the stories phone into
  its own. Both captions were saying what the label under the box already said,
  so both went.
- **The player showed an equaliser on the beat where it had stopped.** `.hk-eq`
  is inside the highlight group, so it survived the stop bar arriving. It fades
  out on beat 4, and `check_browser.mjs` asserts it.
