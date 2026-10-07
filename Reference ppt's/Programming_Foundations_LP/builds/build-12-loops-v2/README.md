# Session 12: Loops (while)

The finished plan is **generated**, never hand-edited.

| Path | Is |
|---|---|
| `build.py` | The generator. Writes all three files |
| `plan-template.html` | A copy of the skill's presenter shell |
| `parts/` | hook SVG, walker, session CSS/JS, worksheet CSS/JS |
| `media/`, `work/thumbs/` | Deck slides; the card photographs the guide uses |
| `work/beats.json` | The beat table `plan_shape.py` was run against |
| `patches/` | The scripts that moved this build onto the fixed spine, kept as a record |
| `check_answers.py` | Recomputes every answer the plan states, then greps the guide for it |
| `check_browser.mjs` | Drives all three files in Chromium over `file://` |

## Three files

```
python build.py                # all three, into ../../Plans/Programming Foundations/12 - Loops/
python build.py --no-thumbs    # skip the browser pass, reuse work/thumbs/
```

| File | KB | For |
|---|---|---|
| `12_loops_student_view.html` | 1314 | the projector |
| `12_loops_instructor_guide.html` | 396 | the instructor |
| `12_loops_student_handout.html` | 8 | the students |

The names come from `standard_slides.file_names(SESSION)`. Nothing spells one by hand, and
`verify_plan.py` fails a name with a space or a capital in it. The old
`12 - Loops_*.html` files are in `Plans/Programming Foundations/_archive/12 - Loops (old names)/`.

**Nothing links to anything.** The worksheet goes to the room, the guide never does.

Order matters in `build.py`: the presenter is written first, `render_thumbs.py` photographs
*that* file, and the guide is built from the photographs. Guide entries are assembled before any
of it exists, so each leaves a `@@Tn@@` token where its picture goes.

## Shape

14 deck slides + 13 panels + 5 fixed spine cards = **32 cards, 21 blocks, 5 checkpoint bands,
75 minutes**. That is the hard ceiling: `plan_shape.py` holds a floor of 14 deck slides and
`verify_plan.py` a ceiling of 32 cards, so anything added from here has to replace something.

Slides kept: 9, 10, 11, 12, 13, 14, 16, 24, 42, 44, 45, 46, 47, 50.

## The fixed spine

Cards 1, 2, 5, 31 and 32 are not designed here. They come from
`~/.claude/skills/prog-lesson-plan/assets/standard_slides.py`, so every plan in every subject
opens and closes the same way:

| Card | From |
|---|---|
| 1 Welcome | `S.welcome()` |
| 2 Recap | `S.recap_title()` |
| 3 Recap activity | `S.recap('bug', ...)` |
| 5 Today | `S.title_card('Loops')` |
| 19 Classroom quiz | `S.quiz()` |
| 31, 32 Feedback, Thank you | `S.feedback()`, `S.thankyou()` |

`SPINE_CSS` and `SPINE_JS` are appended to `{{EXTRA_CSS}}` and `{{EXTRA_JS}}`. The builder
rewrites the one `inset:0` in `SPINE_CSS` to its long-hand, which is the only thing it changes.

**The title card comes after the hook**, so nothing before card 5 prints the word Loops. The
hook's eyebrow reads `Programming Foundations · Session 12`, and `check_browser.mjs` asserts
that cards 1 to 4 do not carry the topic's name.

**The recap is session 11's own content**, in the `bug` format: a nested `if` whose last line
sits at the left edge, so it prints `Pass` when it should print nothing. That last idea is the
one the exit question turns on, and the exit's guide entry says so out loud.

**The classroom quiz runs on the portal**, at minute 38 of 75. The card is the picture and
nothing else. What to say, how long they get and what an early finisher does are in its guide
entry.

## The hook carries the your-turn beat

Eight presses on one card, not two cards:

1. the shop · 2. inside the machine · 3. one job, forty times ·
4. **where else have you seen this?** · 5. the ATM · 6. the attendance SMS · 7. the lift ·
8. one line, forty copies

**Press 1 shows the shop and an empty dashed slot labelled "inside the machine", and nothing
else.** The card asks what is going on in there, so the column of forty jobs cannot already be
on screen when the question is asked. It arrives on press 2, which is the answer to what the
instructor just asked the room.

Presses 4 to 7 stand the machine down and put the question in its place, so the card never grows
past its own height, and press 8 brings it back for the collapse. That ordering is deliberate:
**the construct is still the last thing the card draws**, and our three examples only appear
after the room has offered theirs. No timer on this card.

The collapse is still one CSS transform on one SVG group, `translate(0,218.6px) scale(1,.0592)`,
900ms. It moved from `.an-3` to `.an-8`; nothing else about it changed.

## Nothing opens half empty

Three cards used to show one mark on a blank canvas. Each now draws its own empty skeleton from
press 1 and fills it: the hook's dashed slot, the agenda's full rail with four hollow stops, and
the takeaway map's outlined boxes. The skeletons are plain SVG elements rather than groups, so
the step gating counts `<g>` siblings with `nth-of-type`, not `nth-child`. Getting that wrong
shifts every step by one and nothing errors.

## The bespoke panel

Card 17 is **tap to classify** (activity library template 23), and it replaces what used to be a
plain text prompt for worksheet task 2.

Six real lines from two programs, three bins, one case live at a time. The room commits on the
worksheet first, one letter per line, then the instructor takes a show of hands and taps the
bin **the room voted for**, not the right one. A wrong bin bounces the line, flashes the bin and
says why in one sentence.

Program B counts *down*, which is the point of it: `seats = 3` and `seats = seats - 1` bounce out
of the wrong bins for two real beliefs: that initialization always sets zero, and that updation
always adds one.

The panel is click driven and owns no arrow keys, so the presenter keeps them.

## The build card

**Slides 14, 16, the build panel and slide 24 are one block.** Slide 14 states the example, slide
16 names the block that repeats, the panel assembles the loop in seven presses, and slide 24 is
the abstract shape they will redraw in an exam.

Press 4 is a question and nothing else. The condition arrives as an empty dashed box and the
room fills it. Every part that lands carries the number of times it runs: for
`counter = 0; while counter < 3` the condition is asked **four** times and the body runs three.
`check_answers.py` derives that four rather than trusting it.

## The four common mistakes

Not four slides in a row with nothing between them. Not updating the counter is discovered on the
students' own laptops in the break-it beat; the other three are a worksheet hunt; then slides 42,
44, 45 and 46 reveal all four, one card at a time, with the one they broke themselves last.

Program 1 of the hunt has no wrong line at all, and that is deliberate, and it is why the task also
asks what is *missing*.

## The worksheet

`12_loops_student_handout.html`: three tasks, 21 fields, its own file. Nothing is printed, so a
pen instruction is a typed one: *circle the initialization* is *type the line number*.

Task 2 is now the classify commitment: two programs, six lines, one letter each (`I`, `T`, `U`),
plus how many times line 4 of Program A runs. Typed answers survive a refresh, multi-line
included; `check_browser.mjs` types four lines into task 1, reloads and compares.

## What the guide closes with

Four sections, in the order `references/instructor-guide.md` sets: common guidelines, if they
ask, **every answer in one table**, **source defects**. The answer table has a row per place and
**every row is derived at build time by running the program**, so an answer cannot go stale when
an input changes. Each entry that can be shortened also carries one `Short of time:` bullet, and
every checkpoint band names the cut to take if the room is not there yet.

The `gwhen` line on each entry carries **that card's** minutes, not its block's. Four cards in a
row each claiming eight minutes is how an instructor loses the thread at minute 40.

## Checks

```
python  ~/.claude/skills/prog-lesson-plan/scripts/plan_shape.py work/beats.json
python  ~/.claude/skills/prog-lesson-plan/scripts/verify_plan.py "../../Plans/Programming Foundations/12 - Loops/12_loops_student_view.html"
python  check_answers.py
node    check_browser.mjs
node    ../../tools/check_trio.mjs "Plans/Programming Foundations/12 - Loops"
```

`verify_plan.py` reports one warning, `every deck slide appears`, with 43 numbers. That is the
cut, and it is deliberate: 14 of 57 slides are kept.

## No em-dashes anywhere

Every `&mdash;` is gone from all three files, and the template's own `<title>` no longer ships a
literal one. A label separator became a colon; a dash in prose became a comma or a full stop.
`patches/patch_spine_6.py` is the pass that did it, with the phrases that needed rewriting rather
than replacing listed out.

## Deck defects found in `12 - Loops.pptx`

All four are written into the guide's **Source defects** section, so the instructor sees them too.

- **Slide 51** (Key Takeaways) carries the eyebrow **"Working with File System"** instead of
  "Loops". Cut from this plan in favour of the concept map.
- **Slides 44 and 45 share one title**, "Incorrect Termination Condition", but they are different
  mistakes: 44 stores the answer of the condition in a variable, 45 starts the counter in the
  wrong place. Card 24's guide entry tells the instructor to say why both names are defensible.
- **The exit question uses `a[counter]`.** The strings session covers length, repetition and
  joining; picking one letter by position is not in the transcript. The answer does not depend on
  it, and card 29 carries the sentence to say if anyone asks, but the deck owner should confirm.
- **Slides 19 to 23 and 25 to 41** build and then walk one program over twenty-two slides. Both
  runs are replaced here, because a flat image cannot be predicted against.

No slide artwork needed correcting, so `originals/` is empty.

## The claim that was not true

Worksheet task 3 used to say the three broken programs were "each broken in a different part".
They are not: program 1 has no initialization and program 3 has one with the wrong value, so two
of the three are the same part. It was also a self-check sitting on the worksheet, which the
skill forbids outright. The sentence is gone from the worksheet and the card, and card 21's guide
entry now says the honest thing instead.

## Four CSS traps, all in `references/gotchas.md`

- `.tkmap text` and `.tkmap path` beat a presentation attribute, so `fill="#fff"` and a `stroke`
  on the loop's return arrow are both repainted. The exceptions carry classes.
- `.partmap .a1 .ring` is a descendant selector, so the accent goes on a wrapping `<g>`, never on
  the ring itself.
- A staged `<g>` cannot edit what an earlier one drew: the condition arriving on press 5 is a
  white `.cover` rect over the dashed slot.
- No `body.present` font override on SVG text: a `px` clamp is read as user units.

One more, found in this pass: **the agenda's rail has to stop short of both circles**. Drawn
centre to centre, the next stop's rail is painted straight through the number of the one before
it, because a later `<g>` always draws over an earlier one.

## Pass 7: the review in the room

Nine things, after the plan was run on a projector.

1. **The four spine pictures now fill the screen.** Welcome, classroom quiz, feedback and thank
   you are `.pcard`s, and every full-bleed rule in the template was written for `.slide`, so all
   four projected at their natural size with white all round them. Fixed in
   `plan-template.html`; the same four rules cover the two generated title cards.
2. **The title card is centred.** The white panel's middle is y = 450. The CCBP logo sat at
   y = 385, forty pixels low, and the session name was anchored at the left edge of its column,
   so a short name like "Loops" left 350px of white on the right. Both halves are now centred on
   their own column with a hairline between them. Fixed in the skill's `standard_slides.py`, so
   every plan in every subject gets it.
3. **The agenda says it plainly.** "The long way" and "Where it breaks" became "Ten times over"
   and "When it breaks", and each stop gained a small drawing of what happens there.
4. **Sequence of instructions is an animation.** Deck slide 9 is a paragraph beside a grey
   rectangle standing in for "a block of code": it asserts that every line runs once and never
   shows one running. Card 7 is now six presses. A marker walks down a five line program, the box
   called `a` takes a new value with the old one struck out, the console fills a line at a time,
   and the verdict and the session's question land together on press 6. Deck slide 10 stays, and
   its guide entry now says what it adds rather than repeating card 7.
5. **The walker's prompt came off the projector.** "The dot is Python. Set the number..." is
   something the instructor says. It is in card 18's guide entry and nowhere else.
6. **Type it, then break it is one card shorter.** Two panels of prose after the code became one
   panel with the two changes side by side, each with a drawing.
7. **`while` and `for` stand out** on the takeaway map: mono, blue, larger, with the timing in
   plain type beside them.
8. **No card opens on white.** Worksheet task 1, worksheet task 3 and the square pattern each got
   a drawing in a second column. The exit card's answer column carries an outlined slot saying
   where the answer will land. The sequence card's verdict bands are outlined from press 1.
9. **The hook's three examples are machines, not paragraphs.** The ATM pushes out one note, then
   the next; the attendance SMS walks one message down a list of three; the lift climbs one floor
   at a time with the floor lamps lighting behind it. Each animation is paused until the press
   that reveals its box, so three loops never turn at once, and a box not yet revealed shows its
   machine as an outline. The shop itself now feeds one sheet at a time into a tray.

**The lift is a fair example and it stays.** One job, move up one floor; a question asked after
every one of them, have we arrived; and it stops when the answer is no longer true. That is the
same three parts as the program on card 15.

### Two spine defects fixed upstream

Both were in `~/.claude/skills/prog-lesson-plan/assets/standard_slides.py`, so all three subjects
get the fix.

- **The `bug` recap card was half empty until the first press.** `.rcp-o` was `opacity:0`, so the
  whole right side of the card was white while the instructor read the program out. The box, its
  dashed edge and its label are up from the start; only the answer arrives on the press. The two
  boxes also share the column's height rather than stacking at the top of it.
- **The title card's alignment**, above.

### One more CSS trap

**A staged SVG marker has to be painted under what it points at.** The sequence card's highlight
band was emitted after the program text, so on press 1 it covered line 1 completely: the band is
opaque and a later sibling always wins. It is now emitted before the text.

And one specificity trap: `body.present .hkfig{display:flex}` outranks
`:is(.an-4,.an-5,.an-6,.an-7) .hkfig{display:none}`, which put both halves of the hook on the
card at once. Grow rules are scoped to the presses their half is up for.
