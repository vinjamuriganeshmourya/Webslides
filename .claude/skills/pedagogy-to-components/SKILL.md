---
name: pedagogy-to-components
description: The bridge between a teaching move and the figure that renders it. Use when planning or reviewing a slide, when choosing which kit component a beat should use, when a plan says what the room must understand but not what goes on the frame, when deciding whether a slide gets a picture at all and WHAT that picture is made of (a phone screen, a character, coins, a map, an abstract strip), and whenever building a foundations session (a first programming course, where the learner types into a playground rather than a project). Covers the eleven recurring teaching moves, the component each one maps to, the six questions a figure must answer before it is drawn, where its elements come from, the reveal shape each move needs, the pairs of moves that may not be separated, and the ways a correct component still teaches the wrong thing.
---
<!-- cSpell:ignore NxtWave Cricbuzz isdigit startswith endswith Riya pedagogies PhonePe Unicode Zampa -->

# Pedagogy to components

## Why this file exists

Four documents in this repo each hold a part of one decision and none of them
holds the join:

| | Says |
|---|---|
| `slide-kit/workflow/PEDAGOGY_GUIDELINES.md` | what the teaching must **do** — the frameworks, prerequisite order, nothing arrives assembled |
| `slide-kit/workflow/STYLE_GUIDE.md` §8, §9 | that the form comes from the argument, and that a surface is lit |
| `slide-kit/slide-types/` and `sampleDeck.tsx` | what components **exist** |
| a session plan | what this slide is **about** |

Nobody had written down which component renders which teaching move, or what a
figure is made OF. So the move was re-decided every time, and the same beat
shipped as four different shapes across four decks: a check for understanding as
a `ContentSlide` with an empty body, then as a `QuestionSlide`, then as a
`Callout`, then as a quiz.

This file is that join. **It does not repeat `PEDAGOGY_GUIDELINES.md`** — read
that first for the frameworks and the invariant. This one starts after the
framework is chosen and answers: *this beat, on this frame, in what?*

## Where the evidence comes from

The moves and the rules below were read out of the five `prog_foundations_LP`
lesson plans (sessions 14 to 18: For Loop, String Methods, Nested Loops, Loop
Control Statements, Comparing Strings and Naming Variables) written by the
pedagogy team, plus the 23-deck corpus already analysed in
`PEDAGOGY_GUIDELINES.md`. A move is listed only if it appears in **at least
three of the five** sessions. Counts are stated so a future reader can argue
with the evidence rather than with taste.

The headline count, and the reason section 2 exists: across those five sessions
there are **17 distinct real-world analogies, 13 of them drawn as a pictorial
object** and only 4 left as a sentence. **Every hook slide in all five sessions
is a hand-drawn picture of a real app screen. Not one is text-only.**

---

# Part I — The six questions, in order

A figure is not chosen. It is **derived**, by answering six questions in this
order. Answer them out of order and you get a picture that decorates.

Write the answers into the plan, one line each. A slide whose plan cannot answer
question 2 does not get a figure.

## 1. WHY does this beat need a picture at all?

There are exactly three reasons, and "the slide looks empty" is not one.

| The reason | What it buys | Test |
|---|---|---|
| **To create a need** | the room wants the mechanism before it has a name | could the room state the problem after seeing only this? |
| **To make a hidden process visible** | execution, state, order, time | is the thing being shown invisible on a real screen? |
| **To force a commitment** | a prediction made before the answer exists | does the frame withhold something? |

Everything else is a sentence. `PEDAGOGY_GUIDELINES.md` §4's *"Software is a set
of instructions to the hardware"* needs no figure, and the Python course's R1
retired a deck's worth of pictures that had none of these three jobs.

**The corollary that gets missed:** a beat with reason 1 needs a picture *of the
world*, and a beat with reason 2 needs a picture *of the machine*. They are not
interchangeable, and section 4 is entirely about that split.

## 2. WHAT IS THE OUTCOME? Name it as a sentence the room could say.

**This is the question the whole file turns on.** Not "the room understands
loops". A sentence, in the room's own words, that a learner could say out loud
the moment the beat ends.

The five sessions' outcomes, taken from the beat that follows each analogy:

| Analogy | The outcome, said by the room |
|---|---|
| Spotify playlist | *"Nothing told it five. It stopped because the list ended."* |
| Riya's piggy bank | *"I cannot add thirty days by hand."* |
| WhatsApp search finds nothing | *"The letters have spaces between them."* |
| The phone PIN screen | *"Checking every character myself would take forever."* |
| Cricbuzz ball counter | *"Six balls, twenty times, is a loop inside a loop."* |
| PhonePe asking for the PIN again | *"It should stop the moment the PIN is right."* |
| Instagram Reels swiped away | *"Only that one was cut short. The feed kept going."* |
| Laptop password with Caps Lock on | *"S and s are different numbers."* |

Three properties every one of these has, and a plan should be checked against
all three:

- **It is one sentence.** Two sentences means two beats.
- **It contains no vocabulary the session has not taught yet.** Not one says
  *sequence*, *iterate*, *accumulator* or *nested*. The outcome is the room's
  words; the term arrives after it.
- **It is a felt cost or a noticed fact, never a definition.** *"I cannot add
  thirty days by hand"* is a cost. *"A loop repeats a block"* is a definition and
  would be the wrong outcome for a hook.

**Write the outcome sentence in the plan, in quotes.** It is the acceptance test
for the figure: if a reviewer looks at the rendered frame and cannot see how the
room gets to that sentence, the figure is wrong, whatever it looks like.

## 3. HOW does the analogy CONNECT to the outcome?

An analogy that is not handed over is a distraction the room enjoyed. The
handover is a **written sentence on the frame**, not something the instructor is
trusted to say.

The source does this the same way every time, and it is three moves:

1. **The analogy ends by naming the shape in ordinary words.** Never in code.
   > *"Same shape all three times. Take a list. Do one job. Once for each item in
   > it. You never say how many."*
   > *"The ball count runs 1 to 6, once for every over."*
   > *"It should stop asking the moment the PIN is right."*
2. **The same shape is restated as indented plain English**, which is pseudocode
   without the word pseudocode. This is the bridge frame, and three of the five
   sessions use it:
   > *"every over, 20 of them: a new bowler comes on / every ball, 1 to 6: bowl
   > one ball, show its number / end of over, show the runs"*
3. **Only then does the syntax arrive**, and it arrives as a shape
   (`CodeSyntaxSlide`), not as a file.

**The mapping must be one-to-one and stated.** Each part of the picture maps to
exactly one part of the code, and the frame says which:

| In the picture | In the code |
|---|---|
| the playlist | the sequence |
| one song | the loop variable |
| the list ending | the loop ending |
| a day Riya skips | the `if` being False |
| the running piggy total | the accumulator |

If a part of the analogy maps to nothing, **cut it from the drawing.** An
analogy that is richer than the concept teaches the extra richness as if it were
part of the concept. The commonest instance: drawing a shuffle button on the
playlist, which claims an order the loop does not have.

**And an analogy that cannot be handed over is the wrong analogy**, however good
it feels. Test it backwards: write the code first, then ask which part of the
picture each line points at.

## 4. WHAT IS THE BEST WAY TO REPRESENT IT?

Two decisions, in this order. Getting the first one wrong is unfixable by doing
the second one well.

### 4a. World picture, or machine picture?

| The beat | Draw | Because |
|---|---|---|
| creates a need (a hook, a story) | **the real object, as it really looks** | the room has to recognise it before it is abstracted |
| explains a mechanism (a trace, a shape, an order) | **an abstract strip, rail, box or table** | the claim is about time and position, which no real object shows |

**This is the rule the source follows most consistently, and it is the one
session 14's first cut broke.** The evidence, session by session:

- S14 draws three little real scenes (register, stories, billing belt) and then,
  on the very next beat labelled `the shape`, drops all product chrome for a
  plain box diagram with one red line: *"Nowhere does it say six."*
- S16 draws a whole Cricbuzz screen, then replaces it with coloured nested boxes
  **the instant counting starts**.
- S17 draws PhonePe and Reels in full, then draws control flow as four code
  blocks with a numeric rail beside each: *"lines run in this order 1 2 4 1 2 3 5."*
- **Strings are always an abstract numbered strip, in every session, even ones
  whose hook was photorealistic**, because a strip can draw the box that is never
  reached and grey it. No real object can show a thing that did not happen.

So: **a rich picture buys motivation, and it is spent once per teaching move.**
Then it is put away. A deck that keeps the phone on screen during the trace is
asking the room to read product chrome while the instructor talks about line 3.

### 4b. Then pick the form from the argument

`STYLE_GUIDE.md` §8 governs this and is not repeated here. The foundations cases
it does not cover:

| The beat is | Use | Not | Because |
|---|---|---|---|
| a program running, one line at a time | `VariableTrace` | `CodeBuildSlide` | `CodeBuildSlide` builds a *file*; this is time, not text |
| a sequence walked, one item at a time | a walk figure | `VariableTrace` | the argument is *the sequence ran out*, not *the variable changed* |
| a parameter varied to see what comes out | a dial figure | `CodeOutput` | a static pair cannot show the output is a *function* of the dial |
| two candidate programs, one right | `SwapRows` | two bare `CodeBlock`s | the comparison must be same-shape and simultaneous |
| a rule with instances judged against it | `StatusPointsSlide` | four `Callout`s | rows carrying verdicts are a list, not four asides |
| a question the next slide answers | `QuestionSlide` | `QuestionPointsSlide` | content rule 16: the answer may not share the frame |
| a question that needs code to be answerable | `ContentSlide`, lead ends in `?` | `QuestionSlide` | `QuestionSlide` takes no children, by design |
| the shape of a construct | `CodeSyntaxSlide` / `SyntaxBreakdown` | `CodeBlock` | a shape is not a file |

## 5. WHAT ELEMENTS IS IT MADE OF, AND WHERE DO THEY COME FROM?

The question that decides whether a figure looks built or looks assembled.

### The five kinds of element, and what each is for

| Kind | Use it for | In the corpus |
|---|---|---|
| **A device screen** (phone, laptop, app window) | any hook whose object is something the room uses on a screen | **5 of 5 sessions.** Spotify, WhatsApp, the PIN phone, Cricbuzz, PhonePe, Reels, Instagram username, a laptop sign-in |
| **An abstract strip, rail, dial or box diagram** | every mechanism beat, and every string | **5 of 5.** Every session has a "Follow the ..." strip and a "machine" with settings |
| **A character with a speech bubble** | a two-voice exchange where the misunderstanding IS the content | **2 of 5.** Riya; Anu and the Computer |
| **A countable real object** (coins, days, seats, items on a belt) | an accumulator, a count, a quantity that grows | **2 of 5.** ₹1 to ₹7 and a piggy bank; ₹40 |
| **Plain type** | a fact with no moving part, and every exit question | **4 of 5 exit questions are text-only** |

### Answering the obvious questions directly

- **Humans?** Only as a character in a two-voice exchange, and the kit already
  has one: `Nova`, with five poses, on the `@/ui` barrel through `Illustration`.
  A one-off drawn person is almost always the wrong call. Riya works in the
  source because she *says* the constraint (*"I will save only on odd days"*); if
  her lines are already captions on the frame, she is decoration and course rule
  R1 cuts her.
- **Animals?** No. There is no instance in 23 decks, and a mascot animal in a
  programming figure reads as a children's book. The one exception the corpus
  allows is an object that is conventionally an animal shape because the OBJECT
  is: a piggy bank is a piggy bank.
- **Mobile screens?** **Yes, and this is the house form for a hook.** Draw the
  real chrome: a status bar with a time, the app's own header colour, the app's
  real copy, plausible content with real names and real durations. The realism is
  not polish, it is the recognition the beat depends on.
- **Scenery, landscapes, maps?** Only when the concept is genuinely spatial
  (something travelling between places). `BoundaryBridge` and `RadialSpread` are
  the kit's answers. A map behind a concept that is not about places is the exact
  failure content rule 8 names.
- **Photographs or stock illustrations?** **Never.** Course rule R1, and
  `slide-kit/assets/illustrations/` is kept as a record of what a source PPT
  showed, not as slide assets.

### Where each element actually comes from

Four sources, in this order. Go down the list; stop at the first that answers.

1. **A kit component.** `@/ui` and `@/slides`. Most beats end here, and the
   research usually ENDS at the registry (content rule 27).
2. **The central asset library, `slide-kit/assets/`.** A named product carries
   its real mark (content rule 12), and the mark is copied from there into the
   session's `public/assets/`, byte-identical, never fetched straight into a
   session (content rule 13). It already holds 16 company marks, 45 technology
   logos and the brand mark. **Look before you conclude a mark is unavailable:**
   session 14 first shipped a hand-drawn green circle on the ground that copying
   a trademark was wrong, while `companies/spotify.png` had been in the library
   the whole time. Copying the real file is both more honest and less work.
3. **Drawn from tokens, in DOM.** Panels, rows, tiles, rails, dials, strips,
   device chrome. Colours from `src/design/tokens.ts`, never a hex literal;
   surfaces lit per `STYLE_GUIDE.md` §9; motion from `@/ui/figureTiming`.
4. **An `<svg>`, and only for a shape that carries no text.** A piggy bank's
   body, a play triangle, a connector. **The moment a label is involved it is
   DOM** (content rule 17): an `<svg>` is one rectangle to all three harnesses,
   so a figure whose `<text>` labels sit on each other passes every sweep.

**Nothing is invented that a file could supply, and nothing is fetched that the
library could.**

### What makes a drawn screen read as real

From the source, and cheap to copy:

- a status bar with a plausible time (`9:41`, `7:42`, `12:48`)
- the app's own header colour, and its own eyebrow typography
  (`PLAYLIST` at `letter-spacing: .14em` in grey)
- **real-looking content, invented but specific**: `Morning Raag / Ananya Rao /
  3:58` beats `Song 1`. Names from the room's own world
- the app's real copy where it exists: *"Usernames can only use letters,
  numbers, underscores and periods."*
- exactly one state that is different, and it is the one the beat is about

## 6. WHAT IS THE FLOW? Beats, and one outcome per beat.

A figure is not a picture, it is **4 to 6 named beats**. This is the most
consistent finding in the source: twelve analogy stages, every one of them 4 to
6 beats. Never 2 or 3. Never more than 6.

### The beat contract

| Position | What it does | Labels from the source |
|---|---|---|
| **Beat 1** | the object in its ordinary state, named by the NOUN, never by the concept | `the list` · `the fight` · `your password` · `Rs 40 for lunch` · `the plan` · `ravi kumar` |
| **Middle** | one observable event each, in real-world words with real values | `one tap` · `she searches` · `4.5, 4.6, then what?` · `try 2: paid` · `swipe up` · `show the password` |
| **Last** | exactly one of three moves (below) | `your turn` · `the shape` · `the numbers` |

**The last beat is one of exactly three, and picking the wrong one is how a hook
fails:**

| Move | Use when | Labels |
|---|---|---|
| **hand the question back** | the room has more instances than you do | `your turn` |
| **name the abstraction** | the shape is the point | `the shape`, `the shape behind it`, `nowhere does it say six` |
| **state the mechanism** | the code is next | `the jump`, `the short way`, `the numbers`, `Python is stricter` |

### Step-by-step outcome: one beat, one thing the room now knows

**Every beat has its own outcome sentence, and they chain into question 2's.**
Write them in the plan as a column. Riya, in full:

| Beat | Label | The room now knows |
|---|---|---|
| 1 | the plan | she saves only on odd days |
| 2 | day 1 | an odd day puts money in |
| 3 | day 2 | an even day puts nothing in |
| 4 | day 3 | the total grows; it is not replaced |
| 5 | up to day 7 | seven days gives ₹16 |
| 6 | your turn | *"I cannot add thirty days by hand"* |

**The test for a beat sequence: cover the captions and read only the picture. If
the room cannot say what changed between beat n and beat n+1, two things landed
at once** — the same test content rule 25 applies to a build, applied to a
figure.

### Three flow rules that are not negotiable

1. **The end of a sequence is a DRAWN beat, not the absence of one.** Every one
   of these five sessions turns on *"what told it to stop?"*. A walk that simply
   stops has not made the argument: the frame must show the pointer asking for a
   next item and being refused. Session 14 draws `No songs left. It stops.` as a
   real element.
2. **Nothing is run before it is predicted.** The source repeats one sentence
   across four sessions: *"Do not run it yet. The playground is where you check,
   not where you start."* A frame that hands over code and output in the same
   reveal has skipped the prediction.
3. **"Vote, then run" is strictly two beats.** See move 6.

### When the analogy comes back

**Bring the object back beside the code only when the NUMBERS in it are the
numbers in the trace.** That is the whole test, and the source obeys it:

- The piggy bank is redrawn beside `riya.py`, because `₹0 ₹1 ₹1 ₹4 ₹4 ₹9 ₹9 ₹16`
  is what the trace computes. It earns its second appearance.
- The Instagram username screens sit on the same stage as the three lines that
  use those exact names.
- The PIN phone is **not** redrawn for `isdigit`; it is reopened with a sentence:
  *"It is the one from the phone."* The numbers are not shared, so the picture is
  not.
- Cricbuzz is never redrawn. Its `over.ball` notation comes back as code.

A second appearance that shares no values is the room reading the same picture
twice.

---

# Part II — The eleven moves

| # | Move | In | What it proves | Component | Reveal shape |
|---|---|---|---|---|---|
| 1 | **Recap as a matching activity** | 5/5 | the room still holds the last session, and says so out loud | a match-pairs figure | one join per click, the *why* under the joined pair |
| 2 | **Hook from a named product** | 5/5 | the mechanism already runs in their life, before it has a name | a drawn app screen, 5 to 6 beats | one beat per click; the last beat is one of the three moves above |
| 3 | **"Where else does this happen?"** | 3/5 | the shape generalises, in *their* examples not ours | three small scenes, then one abstract frame | three beats, then the shape stated once |
| 4 | **Cost of the long way** | 4/5 | the shortcut is earned, not announced | `CodeOutput` two panes, or `StatusPointsSlide` | five beats; see below |
| 5 | **Trace before you run** | 5/5 | execution is a sequence in time, not a block of text | `VariableTrace` | one click per executed line |
| 6 | **The machine: vote, then run** | 5/5 | a prediction was committed before the answer appeared | a dial or a two-panel vote | **strictly two beats per level: vote, then run** |
| 7 | **Type it, then change one thing** | 4/5 | which single edit caused which single change | `CodeBlock`, one slide per edit | no reveal; the slide boundary *is* the step |
| 8 | **Story → challenge → check it together** | 3/5 | the problem was worth solving before it was solved | a scene figure → `PracticeSlide` → `VariableTrace` | three consecutive slides, never merged |
| 9 | **Exit question, then the traced answer** | 5/5 | the session's one idea survives without the instructor | `QuestionSlide` → `VariableTrace` | question alone on its frame (rule 16); **text-only, no scaffolding picture** |
| 10 | **Generalise after the specific** | 4/5 | the rule, once the instance has earned it | `ContentSlide`, `StatusPointsSlide` | last, never first |
| 11 | **Plain-English pseudocode as the bridge** | 3/5 | the shape survives without syntax | indented type, no `CodeBlock` chrome | the closing beat of the hook, or its own frame |

### Move 6 is the one that matters most

**"Vote, then run" is the one instrument that makes a wrong answer cheap.** All
five sessions have one, four of them literally titled "machine": the range dial,
the slice machine, the loop counter machine, the break-or-continue machine, the
comparison machine.

The source writes it as pairs of reveal steps and the labels are explicit:

```
data-anim-labels = level 1 vote | level 1 run | level 2 vote | level 2 run | …
```

Six levels, twelve beats, in session 17. Sixteen beats in session 18. The vote
beat shows the code and the options and **nothing else**; the run beat shows what
actually happened.

**Never collapse the pair into one reveal.** A learner who sees the answer
arriving with the question has not predicted anything, and the whole value of the
device is that being wrong costs nothing while the prediction is still private.
The instructor's line in the source is *"Hands up for A. Now hands up for B.
Count both before you press Run"* — the count is the commit.

### Move 4 in full, because it is the one most often skipped

`PEDAGOGY_GUIDELINES.md` §4 says *show the mechanism, then the shortcut*. In a
foundations session that is a five-beat slide, and session 15 is the model. Its
labels are `the PIN screen | the app says no | the long way | how long it is |
the short way`:

| Beat | Frame shows |
|---|---|
| the PIN screen | a real product: you set a PIN on your phone |
| the app says no | somebody types `47a8`, it refuses in under a second |
| the long way | go through the characters one at a time, ask whether each is a digit |
| **how long it is** | *a character is a digit only if it is one of ten things* |
| the short way | `pin.isdigit()` |

**The fourth beat is the one that gets cut, and cutting it destroys the slide.**
Without *how long it is*, the short way is not a relief, it is just the answer,
and the learner learns a method name rather than why methods exist.

**The test:** if the shortcut beat were deleted, would the room feel the problem?
If not, the cost beat is missing or too weak.

---

# Part III — Pairs that may not be separated

Breaking one of these is how a technically correct deck teaches the wrong thing.

1. **Vote and run** (move 6) are one slide, two beats. Splitting them across
   slides lets the room see the answer while walking back to the question.
2. **Challenge and check-it-together** (move 8) are two slides in immediate
   succession. A quiz, a divider or a break between them means the room has
   stopped holding the problem by the time the answer arrives.
3. **Question and traced answer** (move 9) are consecutive. The exit question is
   the last thing before its answer, never before a takeaways slide.
4. **Analogy and handover** (question 3) are on the same frame or the next one.
   An analogy followed by a divider has been enjoyed and dropped.
5. **Text and its supporting visual** reveal together — hard rule 6, restated
   here because every move above has a visual half.

---

# Part IV — Foundations-specific rules

A foundations session is one where the learner has no project: they type into a
playground or a notebook cell and press Run.

1. **Code panels carry the language name**, never a file name. Content rule
   **31a**. `Python`, not `main.py`. A tab naming a file that is not on the
   learner's screen is a lie about where the code lives.
2. **The end of a sequence is always an explicit beat.** See Part I question 6.
3. **Nothing is run before it is predicted.**
4. **One edit per frame** (move 7). Session 14 changes `word = "Rain"` to
   `"Delhi"` to `""` across three slides, never one. Two edits on one frame and
   the room cannot attribute the change.
5. **The empty case is taught, not mentioned.** `word = ""`, `range(1, 1)`, a
   loop that runs zero times. Each gets its own frame in the source. It is the
   commonest thing a beginner gets wrong and the cheapest thing to show.
6. **An analogy is drawn as the thing it is, not as labelled boxes.** Session
   14's first cut rendered the Spotify hook as five boxes reading `Song 1` to
   `Song 5` and Riya's week as `Day 1 / ₹1`, and it was rejected on sight:
   *"not just text, we had added real life representation."* A box labelled
   `Song 1` is already the diagram, so it asks the room to accept the analogy
   before they have felt it. **The word `sequence` may not appear on a hook
   frame.**

---

# Part V — Review checklist

Run this over a plan before it is signed off, and over a deck before it ships.

**The six questions**

- [ ] Every figure has a stated **reason** from question 1's three
- [ ] Every analogy beat has its **outcome sentence, in quotes, in the plan**
- [ ] No outcome sentence uses a term the session has not yet taught
- [ ] The **handover sentence** is on the frame, not left to the instructor
- [ ] Every part of the analogy **maps to one part of the code**, and nothing maps to nothing
- [ ] World pictures for need, **abstract figures for mechanism**, and the rich picture is put away once spent
- [ ] Every named product carries its **real mark from `slide-kit/assets/`**, copied into the session
- [ ] No hex literals, no stock illustration, no `<text>` inside an `<svg>`
- [ ] Beat counts are **4 to 6**; beat 1 is a noun; the last beat is one of the three moves
- [ ] Each beat has its **own** outcome, and covering the captions still shows what changed

**The moves**

- [ ] Every concept's opening states a **cost** before a mechanism (guidelines §2)
- [ ] Move 4's **fourth beat** (how long the long way is) is present, not implied
- [ ] Every "vote, then run" is **two beats**, not one
- [ ] Every walk figure has an explicit **ran-out** beat
- [ ] The **empty case** has its own frame
- [ ] Code panels say `Python`, not a file name (rule 31a)
- [ ] Moves 6, 8 and 9 are **not split** by a divider or a quiz
- [ ] Exit questions are **text-only**
- [ ] Generalisation (move 10) comes **after** its instance, never before
- [ ] An analogy is re-drawn beside code only when it **shares the numbers**
- [ ] No component from Part I 4b's right-hand column is doing a left-hand column's job

---

# Part VI — Adding a move

The set grows the way the framework set does: **at plan time, with the user's
confirmation, or not at all.** A new move is admitted only when it appears in
three or more sessions and no existing move renders it. Name the sessions in the
row. A move with one occurrence is a slide, not a move.
