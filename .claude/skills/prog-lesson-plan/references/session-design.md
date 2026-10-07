# Session design

The patterns that separate a session that works from one that is merely correct.
Read this while designing the beats.

---

## Discovery before instruction

The strongest beat in a session is usually one where the room is handed a problem they cannot
yet solve cleanly, given three minutes, and *then* shown the construct that solves it.

Do this before introducing any keyword that exists to remove an awkwardness — `elif`, loops,
functions. A construct introduced as the answer to a problem the room has already felt is
retained. The same construct introduced as syntax is not.

**How it runs:** pose a concrete problem, do not name the new construct, three minutes quiet,
walk the rows and look at what they produce. Take **two different shapes** from the room, put
them side by side, name what is wrong with each, and only then reveal.

**The design rule that makes it land:** choose a problem where one natural attempt is
**shorter but wrong** and the other is **correct but unreadable**. Then the new construct is the
only thing that is both, and they can see it. If both attempts are merely "long", the reveal
falls flat.

Worked example — print a letter grade from four mark bands (91–100 → A, 81–90 → B, 71–80 → C,
61–70 → D):

- A run of four separate `if`s is short and flat — **and wrong**: 95 marks matches every band
  and prints A, B, C and D.
- A nest of `if/else` is correct — **and four levels deep**, deeper again with one more grade.
- `elif` is the only shape that is short *and* correct.

Do not correct either attempt. The next slide does that.

---

## The typing progression

Across one session, move from **given → given-and-edited → authored**:

| Stage | Beat | What it builds |
|---|---|---|
| given | Type this program and run it | fluency, and a shared artifact |
| given-and-edited | Type it, then make **this one change**, and explain what broke | the actual concept |
| authored | Write the program yourself from the spec on the slide | transfer |

The middle stage is the highest-value beat in the session.

### Let them create the bug

The specific shape that works:

1. They type the working program and check two or three inputs.
2. **You ask them to add or move something, framed as your own mistake, and you do not warn
   them.** "I forgot grade E, for 51 to 60 — add it at the bottom, after the else."
3. They run it. Let them react before you say anything.
4. Then: where does it belong? They fix it and re-test.

Framing it as *your* omission rather than a test removes the sense of a trap, and they will do
it willingly and fast. A bug a student created cannot be dismissed as a trick.

The best of these have a **surprise in the failure mode**, not just a failure. Adding a rung
after the `else` gives a `SyntaxError` and **nothing prints at all** — not even the grades that
worked a moment earlier. Students expect a partial run. That gap is the lesson.

---

## Never state a program's purpose before a tracing task

If you tell them "this prints the greatest of three numbers", they will look at the input
`3 2 1`, write `3`, and never trace a line. It gets worse when the correct answer is the same
for both test inputs — then the purpose statement hands over both answers and the whole
diagnostic value is gone.

**Withhold the purpose.** Ask them to trace it and report what it does. Reveal the purpose at
the end, where it lands as *"and it does work — right up until it doesn't."*

**Audit for leaks.** Check specifically whether any worked example on the panel gives away the
answer to the task. In one build, the activity's own spec slide showed `Input 3 2 1 → Output 3`
while the task asked students to trace exactly that input. The prose was the smaller half of
the leak.

Variable names will still hint at purpose, and that is fine. Inferring "this is about finding
the largest" still requires tracing to fill the boxes; being handed "the answer is 3" does not.

---

## Choosing trace inputs

Pick inputs that **exercise different paths and give different answers**.

For a nested if/else that finds the greatest of three, `3 2 1` and `2 3 1` both print `3` and
one of them only walks the shallow branch. `1 2 9` falls to the `else`, into the inner `if`, out
to the inner `else`, and prints `9` — the deep path, and a different answer. Trace that one on
paper and check the shallow one by running it.

---

## Commitment before reveal

For any checkpoint question: **vote → argue with a neighbour → vote again → reveal.** The peer
argument is the intervention, not the question. Two or three of these per session, no more —
they cost 90 seconds each and lose their force if repeated.

Announce the signal **once**: fingers for the option number, closed fist for unsure, everyone at
the same moment so nobody copies. Say out loud that a fist is a real answer you want to see.

Never name a student. Ask for volunteers who "wrote something different".

---

## Self-checks, and when they become hints

At least one task should let a student see they are wrong **without being told**. But a
self-check printed on the worksheet is read *before* the work, and at that point it stops being
a check and becomes a hint.

All three of these shipped on a worksheet and all three gave the task away:

- *"Two of these four rows print exactly the same thing"* — hands over the finding the beat exists to produce
- *"Exactly two of your twelve rows should be empty"* — turns a twelve-row trace into filling ten and counting
- *"In Program Q, line 4, your middle column must say no"* — states the answer outright

**So the rule is: a self-check is announced after commitment, never printed on the sheet.** Put
it in the instructor's notes, marked critical, phrased so the order is unmissable — *"pens down
first, then say the check: exactly two of the twelve rows should be empty. Not before."*

The mechanism is still worth having. A trace table with **one pre-numbered row per line of the
program** is the best one found: the blank rows are exactly the lines that never ran, and that
is checkable in five seconds — once the instructor names the count.

The exception is a marking task on a printed diagram, where the rule genuinely cannot leak the
answer: "every circle should have exactly one line going up", "nothing should be left unmarked".

---

## Language traps

Watch for a phrase that means one thing early and the opposite later. In a session on nested
conditionals, **"two ifs"** is fatal:

- the hook shows **an if inside an if** — nested, the second question reached only if the first passed
- the trace table shows **two separate ifs** — both at column zero, both always asked, and this
  is the *wrong* shape

They look almost identical written down, and telling them apart is the whole session. So the
instructor notes say: always "an if inside an if" or "two separate ifs", never just "two ifs" —
and if a student says it, ask which one they mean. That question is worth more than the answer.

Audit the finished plan for the ambiguous phrase, not just for correctness.

---

## Make the hook's artwork and its words agree

A hook that animates is worth building, but check that the picture and the narration describe
the same thing. In one build the phone showed "Incorrect PIN" while the code snippet beside it
had no line that could produce that message — running the snippet across all four true/false
combinations revealed it was silent on failure.

Either fix the artwork, or handle it in the notes explicitly ("this snippet decides whether the
money moves; the app has other code that puts messages on screen"). Do not leave a sharp student
with a question the instructor has no answer to.

**Animate one thing.** The strongest hook found was a single CSS transform on a single SVG
group: two nested check panels collapsing so each panel's left edge lands on a code column.
One property, one group, impossible to desync, cheap on a projector. 900ms is right when the
motion *is* the argument. Blur both sides of the crossfade so the eye reads one thing becoming
another rather than two overlapping drawings. Reduced motion and print both jump to the end state.

---

## Where the room's time goes

Aim for roughly half the session with the room doing something rather than watching. In the
session this reference was written from: three laptop beats, three paper beats, two vote rounds,
one discovery beat — against sixteen deck slides.

Budget typing honestly. **Nine lines with 55 first-years is three minutes, not one.** Say so in
the notes so nobody plans around them being faster, and never claw the time back by rushing the
prediction step, which is the part that works.


## One block is one topic, not one slide

The anti-jumpiness rule — every block is exactly one thing — is easy to over-apply into one
block per deck slide. Session 12's first build did exactly that: 29 blocks, median duration two
minutes, ten blocks of one minute. The sidebar became a list of slides and the plan stopped
reading as a sequence of things to do.

Consecutive slides teaching the same thing share a block, with one `.slide` each inside it, and
the heading names the range: *"Slides 10–12 — The problem, they solve it, then the answer"*.

Targets: **14 to 20 blocks**, median duration **3 minutes or more**, at most **eight** headings
naming a single slide. All three are linted.

And check the ranges by eye. That build emitted *"Slides 15–12"* five times over, pairing the
new slide number with the original deck number it came from.

---

## Three cards worth reusing (session 12)

All three ride the template's `data-anim` controller and all three ship in
`assets/plan-template.html` (the presenter shell); `assets/build-template.py` has
the helpers.

### The recap, two cards — the Recap card (`ndt_theme.spine()`) and `S.recap(fmt, ...)`

Card one is the word `Recap` the size of the room, on white, brand mark, gradient rule, and
nothing else on it. Card two is the retrieval, in one of four shipped formats: `rapid` (three
tiles turned over one per press), `sort` (chips flown into one of two bins), `bug` (a worked
thing that prints the wrong answer, and one line is to blame), `match` (six tiles, three pairs,
joined one press at a time). `references/standard-slides.md` has the calls.

Rotate the format across the module. A room that meets the same shape five weeks running has
been taught to stop looking at minute two.

All four are commit then reveal: the room writes the answer down, or says it, before the press
that shows it. The guide entry says *hands down first, then press*. A recap the room watches
teaches nothing, which is the whole reason the old three-MCQ poll was replaced.

The card is the cue, not the sentence. The instructor still says it: *"last session we learnt
about nested conditional statements. Let us do a quick recap of that."* Call the beat
**Recap**, never Warm-Up Poll.

### Call for examples — `exgrid()`

Three worked examples, one per press, revealed **only after** the room has offered theirs.
No timer: a clock turns an invitation into a test. The instructor nudges ("anything on this
campus with a button on it"), takes three or four, makes each one say *both* halves — the
machine and the one job it repeats — and only then presses. Tie each reveal back to whichever
student answer it matches.

### Build it, name it, count it — `pm_card()` / `pm_ring()`

A program on the left, assembled one press at a time; each new part ringed and tied to a card
on the right that names it **and says how many times it runs**. This replaced a five-slide deck
run that built the same program and then labelled it, and it does two things that static
artwork cannot:

- **One press is a question and nothing else.** The condition arrives as a dashed empty box —
  "so what should the condition be?" — and the instructor stops talking. The answer lands on
  the next press, in the gap.
- **Every part carries its count.** Initialization once; the condition **four** times for three
  passes; the body and the updation three each. Ask for the four before you show it: most of
  the room says three, and that is the misconception the whole session is built to fix.

Reveal in the order the program is *reasoned* out, not the order it is read: initialization,
then updation, then the condition — you cannot decide when to stop until you know what is
changing. Slot the cards by their position in the program, though, so the ties never cross.
