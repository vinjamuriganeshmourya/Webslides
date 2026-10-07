# Activity Library

The fixed pool of active-learning templates the Lesson Plan Builder picks from.

**Two are fixed and always present:** a **Recap** opens the session (whenever a previous
session's deck exists — omitted entirely for a first session, never substituted), and a
**closing Exit Activity** ends it, in place of a plain Q&A exit ticket.

**Everything between is chosen from this pool as the material requires.** The original rule was
"exactly two pool-selected activities per session". In practice a 75-minute session built to
the "commit before you run" and "given → edited → authored" progressions needs more: typically
two or three worksheet beats and two or three playground beats. Read the two-activity rule as a floor on
*activities with a share-out*, not a ceiling on active learning.

Every activity slot is short by design (see below) — the chosen template must genuinely fit in its minutes: one prompt, one short burst of work, one fast reveal.

## The worksheet is the medium, and nothing is printed

Sessions run offline with 50 to 60 students in the room, every one with a laptop. **Nothing
is printed.** The worksheet is a downloadable HTML file the room opens and types into, and it
saves as they type. There are no pen-and-paper beats.

What paper was there for still has to happen, so the worksheet has to do it: **a student
commits to an answer before anything reveals it**, and what they typed is still on their
screen when the reveal contradicts it. That is the whole mechanism. A task the room does in
the playground first and records afterwards is a transcript, not a prediction.

Each template below carries an **In the worksheet** line: what the student types, and into
what. Three templates are deliberately not in it (Recap, Rapid-Fire Poll Chain, Human
Graph) because they exist to make the room's spread visible fast; they stay live.

**A pen instruction becomes a typed one.** *Circle the initialization* becomes *type the line
number of the initialization*: same commitment, and it survives being sent to whoever was
absent. *Tick the box* stays a tick. Nothing asks a student to draw.

**Laptops are shut except on a worksheet beat.** The guide says *worksheet tab open* on the
first step of a task card and *worksheet closed* on the first step of the card after it. The
room watches the projector the rest of the time.

**Fingers stop at ten.** Any count above that — lines of code, rows in a table — is written in
the margin and the sheet held up, or asked as a threshold ("hands up if more than 15"). Never
"hold up that many fingers".

**Where the playground earns its place:** as the thing that *tests* a commitment already
typed into the worksheet, never as a replacement for it. They write what it will print, then
run it and see whether they were right. Running first loses the commitment, and nothing on
screen afterwards can put it back. Every template used this way keeps its worksheet step.

## Short beats vs. full activities

Two different things, both drawn from this pool:

- **Full activities** — the mid-session activity and the closing Exit Activity. Exactly two per session, selected as described above, with a share-out or reveal step.
- **Micro-beats** — 30 to 90 seconds, slotted between slides wherever attention drops, no share-out, never collected. These are *compressed instances of the same templates*, not a separate system. Templates 2, 6, 7, 9, 17 and 18 compress well; 3, 4, 5, 8, 11 generally don't and should stay full-length.

A session may run several micro-beats. They do not count against the activity budget.

This list is the single source of truth for `lib/prompt.ts`'s `ACTIVITY_LIBRARY` — if you add, remove, or reword a template, update both places.

| # | Template | Best for |
|---|---|---|
| 1 | Recap | Fixed opener, cards 2 and 3 (not pool-selected) |
| 2 | Predict–Observe–Explain | Mid-session |
| 3 | Spot the Error | Mid-session |
| 4 | Sequence Reordering | Mid-session |
| 5 | Think–Pair–Share | Either |
| 6 | Create-an-Analogy | Mid-session |
| 7 | Explain-the-Why | Mid-session |
| 8 | Concept Sort | Mid-session |
| 9 | Micro-Practice Variation | Mid-session |
| 10 | Rapid-Fire Poll Chain | Mid-session |
| 11 | Worked-Example Fade | Mid-session |
| 12 | Real-World Callout | Either |
| 13 | Human Graph / Stand-and-Vote | Either |
| 14 | Muddiest Point | Closing |
| 15 | 3-2-1 Summary | Closing |
| 16 | One-Sentence Summary | Closing |
| 17 | Annotate the Artifact | Mid-session |
| 18 | Trace Table | Mid-session |
| 19 | Type–Edit–Discover | Mid-session |
| 20 | Program Tracing | Mid-session |
| 21 | Predict-then-run machine | Mid-session, the bespoke panel |
| 22 | One operation per press | Revealing any worksheet trace |
| 23 | Tap to classify | Mid-session, the bespoke panel |

---

## 1. Recap

**Best for:** Fixed opener, cards 2 and 3 of every plan (not pool-selected)
**Purpose:** Retrieval on the *previous* session. The room commits to an answer before anything
is shown, which is what makes it stick, and the instructor gets a live read on what actually
landed.
**When to use:** Always, when a previous session exists. Omitted entirely for a first session,
never replaced by a substitute such as a "readiness check". Four to five minutes for both cards.
**In the worksheet:** nothing. This one stays live.
**How it runs:**
1. Card one is the Recap card, `spine_cards()["recap_card"]` (`ndt_theme.spine()`): the green RECAP kicker, "Where We Left Off" and the mascot, nothing else. The instructor says
   which session it is recapping.
2. Card two is `S.recap(fmt, ...)`, one of four shipped formats: `rapid` (three question tiles, turned over one per press), `sort` (chips flown into
one of two bins), `bug` (a worked thing that prints the wrong answer, and one line is to blame)
and `match` (six tiles, three pairs, joined one press at a time).
3. Every item comes from the previous session's real content. Three items in `rapid` and
   `match`, four to six chips in `sort`, one wrong line in `bug`.
4. The room writes or says its answer, hands down, and **then** the instructor presses.
5. Rotate the format across the module. Never name a student, never score anybody.

`references/standard-slides.md` has the calls and what each format fits.

---

## 2. Predict–Observe–Explain

**Best for:** Mid-session
**Purpose:** Surfaces a student's actual mental model *before* correcting it — a wrong prediction, corrected live, sticks far better than a fact stated cold.
**When to use:** Right after introducing a rule, formula, or mechanism that has a non-obvious outcome.
**In the worksheet:** a two-column grid, the case on the left, an empty field on the right for the prediction. Hands off keyboards before anything is revealed. Then they run it and compare against what they typed. Compresses to a micro-beat by dropping the explain step.
**How it runs:**
1. Present a specific case (a problem, an input, a scenario) and ask students to commit to a prediction *before* revealing the answer.
2. Reveal the actual outcome.
3. Ask students to explain the gap between what they predicted and what actually happened.
**Example (generic):** "Before I show you the result — if we double the input here, does the output double too? Vote yes/no." Reveal it doesn't (e.g. it quadruples), then ask why.

---

## 3. Spot the Error

> **Prefer template 20, Program Tracing, in most cases.** Spot the Error plants a flaw and asks
> students to find it, which pushes them to *scan* code. Tracing asks them to follow it, which is
> the skill actually missing (Lister et al. 2004). Where a flaw is the point, have them create it
> themselves — see template 19, Type–Edit–Discover.


**Best for:** Mid-session
**Purpose:** Tests whether students can *recognize* a specific failure mode, not just execute the correct procedure — a different and often harder skill.
**When to use:** After teaching a procedure or rule that has known, distinct ways to get it wrong.
**In the worksheet:** the flawed example with its lines numbered, one field for the line number of the faulty step and one for the error type. The line number is the commitment; do not accept a description of the line.
**How it runs:**
1. Present a worked example or statement with one deliberate, realistic error planted in it.
2. Students find the error and name exactly what's wrong (not just "this is wrong").
3. Reveal the correct version and name the error type explicitly.
**Example (generic):** Show a solved problem with one flawed step; ask "which step is wrong, and why?" rather than "is this right?"

---

## 4. Sequence Reordering

**Best for:** Mid-session
**Purpose:** Confirms students understand the *order* and *dependency* of a multi-step process, not just its individual steps.
**When to use:** Right after teaching a procedure, workflow, or algorithm with a fixed step order.
**In the worksheet:** the shuffled steps listed, a narrow field beside each for its position. Include one step that does not belong and give it the position field too: they type `x` for it. The distractor is what makes this diagnostic rather than a puzzle.
**How it runs:**
1. List the correct steps of a process, but shuffled.
2. Students reorder them correctly.
3. For 1-2 students, ask them to justify why a particular step must come before another.
**Example (generic):** Give the steps of a method out of order; students number them 1 through N and explain one dependency.

---

## 5. Think–Pair–Share

**Best for:** Either
**Purpose:** Gets every student to commit to an answer (not just the fastest hand), then exposes reasoning through peer discussion before a public share.
**When to use:** Any question with room for genuine disagreement or multiple valid approaches.
**In the worksheet:** the think step becomes *type* — one line, alone, before any talking. A student who has typed something has committed to it and will defend it in the pair; a student who only thought it adopts their neighbour's answer.
**How it runs:**
1. Pose one sharp, specific question.
2. Students think alone, briefly (30-60s).
3. Students discuss with a neighbor (1-2 min).
4. Call on 2-3 pairs to share out.
**Example (generic):** "Which of these two approaches would you use here, and why?" — think alone, discuss, then share.

---

## 6. Create-an-Analogy

**Best for:** Mid-session
**Purpose:** Forces active reconstruction of an abstract concept in the student's own terms — a much deeper test of understanding than recognition or recall.
**When to use:** Right after defining an abstract concept that has a natural real-world parallel.
**In the worksheet:** three short fields in a row, labelled to read as one sentence: *___ is like ___ because ___*. The blanks do the work; one open field gets blank stares.
**How it runs:**
1. Ask students to complete "X is like Y because..." for the concept just taught.
2. Take 2-3 analogies out loud.
3. Point out where each analogy holds and where it breaks down.
**Example (generic):** "A [concept] is like a ________ because..." — accept any real-world comparison, then probe its limits.

---

## 7. Explain-the-Why

**Best for:** Mid-session
**Purpose:** Separates students who can state a rule from students who understand the reasoning behind it.
**When to use:** When introducing a rule, constraint, or result that isn't self-evident from its statement alone.
**In the worksheet:** one single-line field, and say out loud that one line is the limit. The constraint is the activity: a paragraph lets them restate the rule instead of justifying it. Never a textarea.
**How it runs:**
1. State a rule or result students just learned.
2. Ask them to justify, in one sentence, *why* it holds — not just restate it.
3. Contrast a surface-level restatement with a real justification, using a real student answer.
**Example (generic):** "We just said X is true. In one sentence — why?" Reject answers that just repeat the rule.

---

## 8. Concept Sort

**Best for:** Mid-session
**Purpose:** Tests whether students can correctly categorize new examples, not just recognize the category definitions.
**When to use:** After teaching 2+ categories, types, or cases that are easy to confuse.
**In the worksheet:** the mixed items listed, a one-character field beside each for the bin's letter. A letter typed beside an item sorts just as well as moving a card and costs nothing.
**How it runs:**
1. Give a mixed set of examples or terms spanning the categories just taught.
2. Students sort each into the correct bucket.
3. Review the 1-2 trickiest items together.
**Example (generic):** Give 6-8 mixed examples; students classify each into one of the categories covered today.

---

## 9. Micro-Practice Variation

**Best for:** Mid-session
**Purpose:** Immediate, low-stakes application right after a worked example — closes the gap between "I watched it" and "I can do it" while the example is still fresh.
**When to use:** Directly after any worked example.
**In the worksheet:** the original worked example shown with the one changed value marked, and a field for just the part that changes. Compresses to a micro-beat easily.
**How it runs:**
1. Take the worked example just shown.
2. Change one small detail (a number, a condition, a word).
3. Students solve just that one changed piece, not the whole problem again.
**Example (generic):** "Same setup as before, but now [one value] is different — what changes in the answer?"

---

## 10. Rapid-Fire Poll Chain

**Best for:** Mid-session
**Purpose:** Builds momentum and confidence quickly, while giving the instructor a live read on the room's grasp before moving on.
**When to use:** Right after a concept where difficulty can be layered in small steps.
**In the worksheet:** nothing. This one stays live. Its value is the speed and the visible read on the room.
**How it runs:**
1. Ask a live MCQ on the concept just taught.
2. Immediately follow with a slightly harder variant.
3. Repeat for 3-4 questions total, voting on each before revealing the answer.
**Example (generic):** Three quick MCQs in a row on the same idea, each a notch harder, live vote after each.

---

## 11. Worked-Example Fade

**Best for:** Mid-session
**Purpose:** A gentler on-ramp to independent practice than starting cold — students take over exactly where the scaffolding stops.
**When to use:** For a multi-step problem where the last step is the one testing real understanding.
**In the worksheet:** the solution shown up to the fade point, then the fields. Where it stops is the design decision: stop before the step that tests understanding, not before the easy arithmetic.
**How it runs:**
1. Instructor solves most of a problem live, narrating each step.
2. Stop deliberately before the final step(s).
3. Students complete the remaining step(s) themselves.
4. Reveal and compare.
**Example (generic):** Solve 80% of a problem on the board, then: "You finish it — what's the last step?"

---

## 12. Real-World Callout

**Best for:** Either
**Purpose:** Makes an abstract or seemingly academic topic personal — students supply their own evidence that it matters, rather than being told it does.
**When to use:** When a concept has broad but underappreciated real-world reach.
**In the worksheet:** two short fields for their own instance, then take a few out loud. The weakest of the worksheet forms: the value is in the callouts, so keep the typing step short.
**How it runs:**
1. Ask students to name their own real-world instance of the concept — not one from the deck.
2. Capture callouts (board, chat).
3. Debrief: point out how what they named already fits a pattern from today's session.
**Example (generic):** "Name a place you've personally seen this show up — doesn't have to be from today's slides."

---

## 13. Human Graph / Stand-and-Vote

**Best for:** Either
**Purpose:** Makes a spread of opinions or confidence levels visible instantly, and gives quieter students a low-friction way to take a position before speaking.
**When to use:** Judgment calls, "which approach is better," or confidence-calibration questions.
**In the worksheet:** nothing. This one stays live and physical. The point is that the spread is visible in the room.
**How it runs:**
1. Pose a question with a spectrum or small set of positions.
2. Students vote (show of hands, poll, or physically stand on a spectrum if in-room).
3. Call on a few from different positions to justify their pick.
**Example (generic):** "On a scale of confident to unsure, where are you on this?" then ask a couple from each end to explain.

---

## 14. Muddiest Point

**Best for:** Closing
**Purpose:** Surfaces exactly what's still unclear while it's fresh, cheaply and safely — students are more honest here than during a checkpoint mid-lecture.
**When to use:** As the closing activity of any session.
**In the worksheet:** one field, and say plainly that nobody reads their file. Anonymity is the whole mechanism; students type the real confusion and say a safe one out loud.
**How it runs:**
1. Ask: "Which part of today was the least clear to you?"
2. Collect them in the worksheet field, or as a quick show of hands on the two you expect.
3. Scan for a common thread and note it for a follow-up next session.
**Example (generic):** One-line prompt at the very end: "What's the one thing from today you're still fuzzy on?"

---

## 15. 3-2-1 Summary

**Best for:** Closing
**Purpose:** Forces active retrieval and self-assessment in one pass, covering both what landed and what didn't.
**When to use:** As the closing activity, especially for content-dense sessions.
**In the worksheet:** three short fields, then two, then one, each its own slot. Never one big box: the structure is what produces three distinct takeaways instead of one restated three ways.
**How it runs:**
1. Ask students to write: 3 takeaways, 2 lingering questions, 1 "aha" moment.
2. Collect a few examples out loud or in chat.
3. Address any question that comes up more than once.
**Example (generic):** "Before you go: 3 things you learned, 2 questions you still have, 1 moment that clicked."

---

## 16. One-Sentence Summary

**Best for:** Closing
**Purpose:** Tests genuine compression of understanding — students who only half-understood a topic struggle to compress it cleanly.
**When to use:** As the closing activity for a session built around one central idea.
**In the worksheet:** a single short field with a visible character limit. It reads as a joke and it works: nobody types three sentences into a field that visibly ends.
**How it runs:**
1. Ask students to summarize today's core idea in exactly one sentence.
2. Take 2-3 out loud.
3. Contrast a vague summary with a precise one to model the difference.
**Example (generic):** "In exactly one sentence — what was today actually about?"

---

## 17. Annotate the Artifact

**Best for:** Mid-session
**Purpose:** Makes terminology stick by attaching every new term to a specific mark on a specific object. Recognising a definition on a slide and finding all four leaves on a diagram in front of you are different skills, and only the second one survives to the exam.
**When to use:** Right after introducing terminology, parts, properties, or keywords — the vocabulary-heavy stretch of a session, where students otherwise sit still for ten minutes.
**In the worksheet:** the only form. A clean, unlabelled version of the diagram or code the deck just used, drawn in the worksheet with its lines or parts numbered, and a field per label. Nothing to copy out: the artifact is already there. **Every mark is a number typed into a named field**, never a place on a picture.
**How it runs:**
1. Show the structure the deck just taught from, stripped of labels.
2. Give an exhaustive marking instruction using a verb they can act on — circle every X, shade every Y, box everything you did not shade, number the levels, label each part.
3. Give a **self-check rule** they apply to their own marks, so a wrong answer is visible without being told: "every circle should have exactly one line going up," or "nothing on the page should be left unmarked."
4. Ten to ninety seconds. Never collected. Walk the rows and look, but do not correct individuals.
**Why it's separate from Spot the Error:** Spot the Error plants one flaw and asks students to find it. This asks for exhaustive coverage of a correct artifact — every instance, no exceptions — which is what forces a student to apply the definition repeatedly rather than once.
**Example (generic):** "Shade every [category] on this diagram. Then box every one you didn't shade. Anything left unmarked means you've missed something — check it."

---

## 18. Trace Table

**Best for:** Mid-session
**Purpose:** Builds the systematic step-through that students are widely missing. Multi-national testing found novices weak at predicting what short code does and at completing near-complete code — a fragile grasp of tracing, not a general inability to problem-solve. Tracing is the prerequisite, and it is teachable directly.
**When to use:** As soon as a session has anything that executes in sequence and changes state — assignments, loops, conditionals, accumulating values. Also for any multi-step procedure where an intermediate value matters.
**In the worksheet:** the only form. A table, one row per line executed, one column per thing that changes, plus a column for anything printed. The table structure is the scaffolding: students given an empty box type prose and get lost.
**How it runs:**
1. Show the code or procedure, numbered by line, beside the empty trace table.
2. Fill the first one or two rows together, out loud, saying what the machine does at each line before saying what the line means. If rows are pre-filled, say which row is the first one you fill aloud: "fill the first two rows together" contradicts a worksheet where rows 1 and 2 are already done.
3. Students complete the remaining rows alone.
4. Reveal the completed table one row at a time, not all at once — students find their own divergence point, which is the useful information.
**Why it's separate from Predict–Observe–Explain:** prediction asks for the endpoint. A trace asks for every intermediate state, and the row where a student first goes wrong is more diagnostic than a wrong final answer. Use prediction for a surprising result; use a trace when the process is the thing being learned.
**Example (generic):** Four lines of code, numbered, with a table headed *line · [each variable] · printed*. Fill row 1 together, they finish rows 2 to 4.

---

## 19. Type–Edit–Discover

**Best for:** Mid-session, on any construct with a syntax or ordering rule whose failure is
non-obvious.
**Purpose:** A rule a student breaks themselves cannot be dismissed as a trick, and the error
message becomes evidence rather than an assertion. The highest-value laptop beat available, and
the only one that reliably produces "wait, *nothing* printed?"
**When to use:** Immediately after a worked example is on screen and working. Never before —
they must have something correct to break.
**In the worksheet:** the prediction only. The point is the interpreter's response, so what they type first is what it gets to contradict.
**How it runs:**
1. They type the working program from the slide and check two or three inputs.
2. **Ask them to add or move something, framed as your own mistake, and do not warn them.**
   "I forgot grade E, for 51 to 60 — add it at the bottom, after the else."
3. They run it. Let them react before you say anything.
4. Then: where does it belong? They fix it and re-test.

**Why the framing matters:** presenting it as *your* omission rather than a test removes the
sense of a trap, and they will do it willingly and at speed.

**Choose a failure with a surprise in it,** not just a failure. A rung added after `else` gives a
`SyntaxError` and **nothing prints at all** — not even the cases that worked a moment earlier.
Students expect a partial run; that gap is the lesson.

**Example (generic):** "Add one more case to the chain — put it after the `else`." Then: where
does it actually belong, and why?

---

## 20. Program Tracing

**Best for:** Mid-session, on any program with more than one branch.
**Purpose:** Builds the systematic step-through students are widely missing, and it is the
prerequisite for everything else. Replaces Spot the Error where the goal is following code
rather than scanning it.
**When to use:** On a *correct* program, before any faulty version exists. They decide for
themselves whether it does what it claims.
**In the worksheet:** the only form. The program with numbered lines beside a trace table that has
**one row per line of the program**, the line numbers already filled in and everything else empty.
**How it runs:**
1. Show the program, numbered. State what it is *meant* to do and ask whether it does.
2. Fill the first two rows aloud together, saying what the machine does at each line before
   saying what the line means. If those rows are pre-printed, the aloud row is the first blank
   one — name it.
3. They complete the trace alone.
4. Take the verdict, then send them to type it and check.

**The self-check is the row count.** A student fills a row only if that line actually runs, so
the blank rows are exactly the lines the input never reaches. "Exactly two of your twelve rows
should be empty" is a check they can apply in five seconds, and a student who filled all twelve
knows immediately they traced intent rather than execution.

**Never state the purpose before a tracing task where the purpose gives away the answer.**
"This prints the greatest of three numbers" and an input of `3 2 1` means they write `3` and
trace nothing. Either withhold the purpose and reveal it after, or choose inputs whose answers
are not guessable from the goal.

**Choose inputs that walk different paths and give different answers.** For a nested if/else
finding the greatest of three, `1 2 9` falls to the `else`, into the inner `if`, out to the inner
`else` — the deep path, answer 9. `3 2 1` only walks the shallow branch.

**Why it's separate from Trace Table (18):** template 18 traces a fragment to teach tracing.
This traces a whole program to answer a question about the program — "does it do what it
claims?" — and hands the verdict to the room.

---

## The three bespoke panels

A plan whose pedagogy was sound and whose panels were text was rejected as "horrible, very
dull". These three are the answer, and at least one belongs in every plan. They are bespoke
HTML inside a panel, not a text card with a heading, and they are paid for by **replacing** a
beat, never by extending the clock.

## 21. Predict-then-run machine

**Best for:** Mid-session, right after the idea has been named and before the room traces
anything alone.
**Purpose:** Makes being wrong cheap, private and immediate. The room commits, the machine runs
the thing in front of them, and the verdict says why each wrong option was tempting.
**In the worksheet:** nothing. This one lives on the projector; the worksheet task that follows
it is where they commit on their own.
**How it runs:**
1. One concept per level. The card shows the starting state and the operation it is about to
   run, and asks one question.
2. The room votes on **concrete values**, never English paraphrases. "`count = 3`, nothing
   printed" is an option; "the loop ends early" is not, because a paraphrase does the first
   step for them.
3. **Run is disabled until an option is picked.** That gate is the whole activity.
4. It runs, one visible movement at a time, at reading pace.
5. The verdict names every option, not only the right one, and then the next level arrives.
6. An illegal operation is refused out loud: the machine shakes, says what it cannot do, and
   nothing moves.

Six levels take about five minutes. A second instance with a tighter bound (a list with room
for three, a counter that cannot go below zero) runs the boundary cases in two more.

**Every answer is derived from `start` + `ops` by the checker**, never typed into the level.
`assets/predict-machine-reference.py` is the worked copy: keep the engine, replace the
furniture.

## 22. One operation per press

**Best for:** Revealing any worksheet trace. This is *how* a reveal happens, not a beat of its
own.
**Purpose:** The room checks their own line against one change at a time, and finds the exact
step where they went wrong instead of learning only that the final answer differs.
**In the worksheet:** the task itself, already filled in by the student before this starts.
**How it runs:**
1. Hands off keyboards. Say it, and wait for it.
2. Press. One operation runs: one line of the program, one change to the state, one thing
   printed or not printed. Then it stops.
3. About five seconds. They check that one row on their own screen.
4. Press again. Never two at once, and never a table of the whole answer.

**The walker runs the task's own sequence and nothing else.** No picker, no second example, no
"try your own" box on the card. Those move the room off the thing they just committed to, and
the beat stops being a check.

**What is consumed, vanishes.** See `references/motion-craft.md`.

## 23. Tap to classify

**Best for:** Mid-session, when the distinction is the lesson: this runs or it does not, this
is a definition or a call, this belongs to the loop body or to the code after it.
**Purpose:** A vote the whole room can see, on cases specific enough that a wrong bin is
informative.
**In the worksheet:** a one-character field per case, filled before any tap.
**How it runs:**
1. Six to eight concrete cases on screen: a line of code, a value, an operation. Two or three
   bins, named plainly.
2. The room types a bin per case in the worksheet first. That is the commitment.
3. The instructor takes a show of hands per case, then taps it into the bin it was voted into.
   It snaps home, or it bounces out and the card says in one short sentence why.
4. The cases that bounced are the ones worth the next two minutes.

Built on the machine's engine (21). Keep the bins to three: four bins is a sorting puzzle, not
a check.
