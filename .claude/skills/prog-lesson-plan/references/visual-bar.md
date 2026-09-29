# The visual bar

Shared by all three lesson-plan skills. The worked examples are from the Stacks
session because that is the plan the bar was set by; every rule here is
subject-independent and applies to a programming or an aptitude plan unchanged.

`Plans/DSA/Module 3 - Stacks & Queues/01 - Introduction to Stacks/` is the bar.
The user stated it plainly: *"visual elements in Intro to stacks lesson plan are
top notch. I want that quality everywhere going forward."*

This page says what "that quality" is made of, so it can be reached on session
two without seven rounds of feedback. Read it at Stop 2, when the panels are
budgeted, and again at §7 when the screenshots come back.

---

## 1. Inherit the components, design the content

The panels are in `assets/plan_panels/`. They are the Stacks build's own, lifted out
of it, so a new session does not rebuild a stepper, a walker or a deck chrome:

| Component | Import | Is |
|---|---|---|
| Card shell | `panels.cards` | `pcard`, `step`, `ctl`, `tmr`, `slhead`, `block` |
| Deck slide | `panels.deckslide` | the deck's chrome, with the body redrawn and stepped |
| Walker | `panels.walker` | the reveal: one operation per press, forwards and back |
| Machine | `panels.machine` | predict, commit, then run |
| Concept map | `panels.conceptmap` | key takeaways as a map, revealed a box per press |
| Spine | `assets/standard_slides.py` | the six shipped slides |

Run `python3 assets/plan_panels/smoke.py <work/slides/sl3.html> out.html` after any
edit to that package, open the page and press through it.

**What is never inherited** is in §2.

## 2. The hook is built new every session

The hook is the one card that is designed from nothing each time, and it is the
card the user reacts to first. The Stacks phone hook is **not a template**.
Copying it into a session on queues, or on trees, is the most visible sign a
plan was assembled rather than designed, and it will be rejected.

What carries over is the craft, not the artwork:

- **One everyday object the students actually touch**, and it has to fit *this*
  session's idea. Stacks got the phone's Back button because Back really does
  take the newest screen. A queue session gets something that really is a queue:
  the canteen line, the print queue, the autorickshaw stand. If the object does
  not behave like the structure, the hook teaches the wrong thing, and no amount
  of animation saves it.
- **A realistic mock UI, not a diagram.** Real app chrome, real tiles, real
  avatars, the brand name if it is the real app (the user settled that:
  Instagram, with its tile, is fine). A hook that looks like a textbook figure
  gets the reaction the first Stacks attempt got: *"rubbish"*. The one that
  looked like a phone got *"so coool. this is what i was talking about"*.
- **One continuous story, stepped by the instructor.** No autoplay, no loop, and
  the room's eyes stay on the projector. Ask-first moments live in the guide
  entry, never as a widget on the card.
- **No questions inside the hook.** It is not a quiz and it does not check
  anything. It sets up the problem the session answers.
- **It never names the topic.** The title card comes after it, and the room
  guesses the name first. A hook that says "stack" has spent the title card.
- **Build it standalone and show the user before integrating.** A hook rebuilt
  inside the full plan costs a full rebuild per attempt. This is the single
  biggest time sink the Stacks rounds found.

`assets/stacks-reference/hookphone.py (shipped in dsa-lesson-plan)` is worth reading for *how* it is put
together, and worth nothing as a thing to copy.

## 3. The rules that make a card look finished

Every one of these was a rejection before it was a rule.

- **No white space on a card.** A card that is half empty at press 1 is a
  defect, not a reveal. Put up the ghost skeleton, the step rail and every slot
  from the first press, and let the presses fill them in. The slide shows; the
  instructor tells.
- **No text panels.** A panel whose content is paragraphs was rejected as
  *"horrible, very dull"* even after the pedagogy was approved. If a panel has
  nothing to move, it should not be a panel.
- **Reveals are per-operation animations, never a table.** One operation per
  press. A table of states is the thing the walker exists to replace.
- **A value that has left is out of the structure, not struck through.** It
  stays readable with an `OUT` tag. Strikethrough reads as "gone" and teaches
  the opposite of what a popped value is.
- **Popped boxes vanish.** `.gone`, and they leave. No grey ghosts outside the
  hook.
- **No black code slabs.** Code on a slide is a white editor card with a file
  tab, line numbers and coloured keywords.
- **Deck slides are redrawn in the new design** (`ndt_theme.light()` and its
  pieces, `divider()` for a one-word slide), not under the deck's own chrome. A
  slide whose points arrive one per press is a panel, which the theme makes look
  the same.
- **Sizes inside a deck slide are `cqh`.** A px size only misbehaves on the
  projector, which is the one screen nobody checks.
- **The New Design Template look only** (`New Design Template.html`): Sora
  800 titles, Inter text, JetBrains Mono code; lavender ground `#EEF3FF` to
  `#F5F8FF`; blue `#2D63FB` kicker and accents, deep blue `#0146C7`, navy
  `#00254B` for the dark slides, ink `#0B1A2B`, body `#4A5B6B`, muted
  `#8A99A8`, rule `#D8E3F5`, green `#16A34A` for the recap and "right",
  `#C2255C` for keywords and "wrong". The old deck cyan `#3FB5E5` and blue
  `#006DAF` are gone. `ndt_theme.theme()` applies it; never restyle a panel
  back to the deck's colours.
- **No em-dashes anywhere**, `<title>` included, and simple school English in
  every student-facing sentence. Short sentences, one idea each, everyday verbs.

## 4. What a screenshot catches and a script never will

Take them. Presenter view and the document view, every stepped card at its first
and last step, the hook at its deepest step. Then *look at every one*, and write
in the round file what each one showed.

Every item here was found by a picture, after the code had been read:

- a title sitting on top of the accent bar;
- a label printed over the points it labels;
- a figure clipped at the slide edge once the caption band was in;
- a map whose text overflowed its box;
- the machine's own header printing the word `undefined`, through three passes
  of reading the code;
- a deck slide with no sizes at all, because the renderer's `slides.css` had not
  been carried into the file.

A caption band is reserved with `padding-bottom` on the body, never by writing a
shorter body. Doc-view shots need `html{scroll-behavior:auto}` or they come out
blank.

## 5. The three tests, before anything is added

- **Subtraction.** Take it out. If the idea still lands, it was decoration.
- **Commitment.** Does a student have to write an answer before the thing tells
  them?
- **Wrongness.** Can a student find out they were wrong without being told? Here
  that is a returned value that is not the one they typed, or a box the machine
  refuses to push.
