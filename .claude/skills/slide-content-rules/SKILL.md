---
name: slide-content-rules
description: Hard content, wording, animation and chrome rules for NxtWave/NIAT session slide decks. Use whenever writing, editing, or reviewing slide copy, deck source under a session project (src/decks/*.tsx), slide plans in <course>/session_plans/<session>/plan.md, slide components in src/ui or src/slides, or terminal/command/table/illustration content on a slide. Covers banned punctuation, banned words, plain literal English for a second-language audience, terminal rendering, the four narrative frameworks and how a concept picks one, prerequisite order and the term ledger, breaking an artefact down one element per slide, problem sequencing, one-idea-per-slide, parallel text-and-visual reveal, deck chrome colour, illustration honesty, technology logos, the central asset library, and registering approved slide types.
---

# Slide content rules

These are **hard rules**, not preferences. Each exists because a deck shipped
breaking it and had to be fixed. Apply them while writing, and check them before
declaring a deck done.

Read alongside `workflow/STYLE_GUIDE.md` (voice, text budget) and
`workflow/SLIDE_WORKFLOW.md` (the plan → sign-off → generate pipeline). Where
this file and the style guide disagree, **this file wins**: it records explicit
user corrections.

---

## 1. Punctuation: never use a spaced em dash

**Banned in every rendered string:** `—` used as a connector (` — `).

Applies to slide titles, leads, bullets, bullet subs, table cells, card bodies,
callouts, captions, chips, component labels and any string a component renders.
JSX comments are fine.

Use instead: a comma, a colon, a full stop, or parentheses.

| Don't | Do |
|---|---|
| `Heavy — RAM/CPU reserved up front` | `Heavy. RAM and CPU reserved up front.` |
| `Be lightweight — megabytes and seconds` | `Be lightweight: megabytes and seconds` |
| `WSL 2 — every container shares it` | `WSL 2. Every container shares it.` |
| `all dependencies — runtime, libraries — into one unit` | `all dependencies (runtime, libraries) into one unit` |

`·` as a separator is fine (`Install · start · verify`). En dashes in numeric
ranges are fine (`items 1–4`). It is the **spaced em dash connector** that is out.

**Check:** `grep -n "—" src/decks/*.tsx src/ui/*.tsx` and confirm every hit is
inside a `{/* comment */}`.

## 2. Words: never call the user's audience a stranger

**Banned:** *stranger* (and *a stranger's browser*). It reads as suspicious or
threatening, which is not the meaning.

Use: **others**, *anyone else*, *someone else*, *another person*.

| Don't | Do |
|---|---|
| `Can a stranger's browser reach it?` | `Can others open it?` |
| `Send it to a stranger` | `Send it to someone else` |

## 2b. Never name another session on a slide

**Banned in every rendered string:** `last session`, `last session's`,
`previous session`, `next session`, `Session 1`/`2`/`3`, `last week`, `today we
will`, and any phrase that positions the content by WHEN it was taught.

Given as review feedback on session 3 (comment `2nv8tp`, "do not use last
session's and session 1 2 3 4 5 wording anywhere in the session"), applied to
that deck, and **never written down** until 2026-09-02, by which point session 4
had shipped fourteen of them. That is the exact failure this file's own preamble
describes: a correction that is fixed once and not recorded is a correction that
gets made again.

Three reasons it is a hard rule, not a preference:

- **A deck is watched out of order and out of time.** Recordings are viewed
  months later, sessions get re-cut and renumbered, and a learner who joins at
  session 4 has no "last session". `Last Session's Locked Door` is a title that
  means nothing to most of the people who will read it.
- **It dates the deck.** A re-order that moves one session invalidates every
  cross-reference in the deck after it, silently, and no harness can see it.
- **It is almost always covering for a missing definition.** `Last session's
  warning, now with teeth` exists because the warning is not restated. Say the
  thing: `node_modules must never enter the image`. The point survives on its
  own, which is what §3c of `TEXT_GUIDELINES.md` demands anyway.

| Don't | Do |
|---|---|
| `Last session's Node Dockerfile with two upgrades` | `The Node Dockerfile, with two upgrades` |
| `Last session's docker-demo folder stays where it is` | `The docker-demo practice folder stays where it is` |
| `This is how the last session ended` | `A container stays unreachable until a port is published` |
| `Last session's iron rule` | `The rule from the container networking section` |

**Speaker notes and JSX comments are exempt**, and are the right home for it: the
instructor is in the room and can say "you saw this last week" out loud. `notes:`
may say it freely.

**The one permitted exception** is the closing teaser, which
`PEDAGOGY_GUIDELINES.md` §1 requires: the final slide names the NEXT session by
its title, under a `Next Session` kicker. That names a session by name, not by
number, and it is the only slide allowed to.

**Check:**

```bash
grep -nE "[Ll]ast [Ss]ession|[Pp]revious [Ss]ession|[Ss]ession [0-9]" src/decks/*.tsx \
  | grep -vE "^\s*[0-9]+: *(\*|//|/\*)" | grep -v "notes:"
```

Every surviving hit is a defect.

## 3. Terminals: one panel per terminal, with the folder path

When a slide shows commands the learner types:

- **Render VS Code's terminal, not a file view.** Use the `Terminal` component
  (panel tab strip `PROBLEMS · OUTPUT · TERMINAL`), not `CodeBlock`. `CodeBlock`
  is for *files* (traffic lights, filename, line numbers).
- **Every command carries its prompt path**: `PS C:\ecommerce\backend> python manage.py runserver`.
  The folder is teaching content: "wrong folder" is the first error learners hit.
- **Two terminals means two panels, side by side.** Never stack two different
  terminals' prompts inside one panel, and never merge them into one command
  list. If the app needs a backend terminal and a frontend terminal, that is two
  `Terminal` components with two different paths and two captions.
- Label each one for what it runs (`Terminal 1 · the API`).
- **Captures come from VS Code's integrated terminal too**, never from a
  standalone PowerShell or Windows Terminal window. This holds for every command
  in the session, including installer and Docker commands, so the deck and the
  learner's screen never diverge. When a command needs elevation
  (`wsl --install`), launch **VS Code itself as administrator** and use its
  integrated terminal: the panel inherits VS Code's privileges. Do not open a
  separate elevated shell.

## 4. Problem sequencing: name a later problem, never open it

When a session solves problem 1 of N:

- **Do not name tools for the later problems.** A tool name means nothing to
  someone who has not felt the problem it solves. Say `Comes later in this
  course`, not `AWS EC2, Nginx, ports, domains, CI/CD`.
- **Do not break a later problem into stages**, and in particular do not name
  its individual stages. Show it as one unopened block. It gets decomposed in
  the session that teaches it.
- **Do not grey out or fade the later problem** on the slide that introduces
  both. It is a real problem of equal weight, just not today's. Fading reads as
  "less important". *Exception:* a "you are here" roadmap may mark it visually
  unopened, because that figure's whole job is showing position.
- **Immediately after the slide that names both problems, state the order out
  loud in a slide of its own**: they are solved in order, you cannot swap them,
  so we solve problem 1 first. Then keep pointing back at it whenever someone
  asks about the later problem.

## 5. One idea per slide, and one item per slide in a list of items

When content is a numbered series the learner must weigh individually (attempts,
options, approaches, failure modes), give **each one its own slide**. Do not put
two on one slide and three on the next.

Shape that works: kicker `Attempt 3 of 5`, a 2–3 word title, the claim as the
lead in quotes, 2 bullets of what it is, and one `Callout` titled `Why it fails`.

This beats the five-content-slides-per-concept floor. Pacing and one-idea-per
-slide outrank the slide count.

## 6. Text and its supporting visual reveal in parallel

A slide's text and the visual that supports it are **one idea**, so they arrive
together on slide entry. They must never be sequenced.

The trap: click-gated bullets (`BulletList` default, which wraps each item in a
`Step`) consume every build step, so a visual wrapped in a further `Step` cannot
appear until the last bullet has been clicked. The slide then reads as two
sequential halves.

How to keep them parallel:

- `BulletList` beside a visual: pass **`immediate`** (staggers on entry via
  `Reveal` instead of gating on `Step`).
- The visual: wrap in `RevealGroup` + `Reveal`, never `Step`.
- Components with their own build: pass **`stepped={false}`** (`LayerStack`) or
  use `Reveal` internally (`MachineBoundary`), so they animate on entry.
- Supporting `Callout`s: pass **`asStep={false}`**.
- `DataTable`, `AnalogyMap` and `JourneyRoadmap` already stagger on entry.

Keep `Step` only for a genuine teaching beat, where the pause is the point:
the "Why it fails" callout after a claim, and `QuizSlide`'s answer reveal.

**Check:** load a paired slide **without** `?all`. Both columns must be fully
visible at step 0, and the counter should show no leftover steps.

## 7. Deck chrome is grey, and never doubles the session name

- The slide counter, nav arrows and dot rail must be **grey on a near-opaque
  light chip**, never white. White chrome is invisible on the light content
  stages, which are most of the deck, and mid-grey alone has too little contrast
  on the night/brand stages. The chip gives one constant background so the same
  grey reads on both families. Grey, not dark: it must not compete with content.
- **The footer carries the NxtWave mark only.** Do not repeat the session name
  there: it sits directly under the bottom-right control cluster and collides
  with the slide counter, and every content slide already shows the session name
  in its kicker. This supersedes `SLIDE_WORKFLOW.md` Stage 6, which still asks
  for the session name in the footer.

## 8. Illustrations must depict the slide's own concept

Never place an available-but-unrelated illustration to fill space. Check what
the asset actually draws, not what its name suggests: an asset built for another
session usually encodes that session's *problem*, and will contradict this one.

If nothing fits: leave the slide typographic and record the missing asset as
outstanding work. A blank-but-honest divider beats a misleading picture.

## 9. When content changes, chase the dependents

Cutting or rewording slide content breaks things that pointed at it. After any
content edit, check and update:

- **Quizzes** that test the removed material. A quiz may only test something the
  deck actually taught.
- **Figures** whose labels cite the removed material.
- **Agenda items, divider subtitles, and key takeaways** that describe a
  structure you just changed (a "five stage journey" that is now three stages).
- **Speaker notes** that reference a slide by its old name or number.

## 10. Verify by rendering, never by reading

A deck is not done until every slide has been rendered and looked at.

- Run the QA script: `node qa.mjs "http://localhost:5173/?all" <slideCount>`.
  It walks every element on every slide and compares its rect to the 1280×720
  frame, and asserts the footer mark is present.
- **`?all` is required.** Without it, `Stepper` fragments are invisible and
  every screenshot looks empty while measuring correctly.
- Expect only `pointer-events-none` decorative blobs to be reported as
  "overflowing"; those bleed off-canvas by design.
- Also confirm: build passes, `tsc -b --noEmit` clean, spoiler rules hold
  (grep the pre-reveal region), and no slide's body exceeds the corpus p90 of
  117 words.

## 11. Screenshots are cropped to the point, and the output is highlighted

A raw capture is evidence, not a slide asset. Never drop a full-desktop or
full-window screenshot onto a slide and rely on the learner to hunt for the part
that matters.

Before a capture goes on a slide:

- **Crop to the region of interest.** A terminal capture becomes the terminal
  panel, not the whole editor with its file tree, tab bar, side panel, taskbar
  and clock. A browser capture becomes the address bar plus the rendered result,
  not the whole desktop.
- **Highlight only when the crop is not enough.** Cropping is mandatory;
  a highlight box is not. If the cropped capture already puts the point in the
  middle of a short frame, adding a box around the command is noise, and a deck
  where every capture wears a box teaches the learner to ignore boxes.
  Add one only when the eye still needs directing: a long output where a single
  line carries the claim (`WARNING: This is a development server`,
  `Unable to find image 'hello-world:latest' locally`), or an address bar inside
  a busy browser chrome. Then use one box, underline or dimming overlay, never
  more than one per capture, matching the slide's one idea.
- **Keep enough frame to stay honest.** Crop to remove noise, never to remove
  context that changes the meaning. A terminal crop keeps its `PS <path>>`
  prompt, because the folder is teaching content (rule 3).
- **Never retouch the output text itself.** If a transcript is wrong or dirty,
  re-run the command and re-capture. Editing pixels to say what you wanted is
  the mockup this workflow forbids.

Capture files keep the full uncropped original alongside the cropped asset, so a
later reviewer can confirm the crop did not distort what happened.

## 12. A technology named on a slide carries its logo

If a slide names or uses a technology — Django, Docker, React, Postgres, npm,
VS Code, an operating system — its mark goes on the slide. A learner scanning a
diagram finds the logo before they finish reading the label, and a stack
diagram with three named boxes and no marks makes them read all three.

- **PNG is the format.** Fetch it as PNG into `public/assets/tech/<name>.png`
  and reference it as `/assets/tech/<name>.png`.
- **An existing SVG satisfies this rule.** Nine logos predate the PNG
  convention and are still referenced; do not re-fetch a PNG of a logo the deck
  already renders from SVG just to comply.
- **Fetch it into the central library first**, never straight into a session.
  See rule 13.
- **Never reference a logo file that is not on disk.** This is not theoretical:
  `TwoRuntimes` and `OneProcessRule` asked for `django.png`, `nodejs.png`,
  `python.png` and `react.png` while only the `.svg` files were present, so
  every deck copied from the base template rendered four broken images. After
  adding a logo reference, confirm the file resolves.
- Name it after the technology, lowercase, no version number. A light-on-dark
  variant takes the `-white` suffix, like `docker-white.png`.

The logo supports the label; it does not replace it. A mark with no name beside
it is a guessing game for anyone who does not already know the technology.

## 13. Every asset lives in the central library first

`slide-kit/assets/` is the one place images are kept: `tech/` for technology
logos, `quiz/` for quiz decorations, `brand/` for the NxtWave mark.

**Look there before fetching anything.** If the asset exists, copy it into the
session's `public/assets/`. If it does not, fetch it into the library, then
copy it across. Never fetch straight into a session, and never keep a
session-only copy of something another deck will want.

A deck cannot read the library at runtime — Vite serves from the project's own
`public/`, and the single-file build inlines from there — so `public/assets/`
is a working copy of library files, byte-identical to them.

This rule exists because the opposite happened: each session kept its own
assets, they drifted, and the base template ended up shipping references to
files that only existed in one session. `slide-kit/assets/README.md` has the
current inventory and the naming convention.

## 14. An approved slide type or transition goes into the kit and the registry

A layout or motion built for one slide, once the user approves it as worth
keeping, is not finished when it renders. It is finished when the next deck can
find it.

- The component moves into the kit — `src/slides/` for a slide type, `src/ui/`
  for a figure, `src/motion/` for a transition — and is exported from the
  barrel, so `sync-kit.mjs` carries it to every session.
- It is added to `src/decks/sampleDeck.tsx`, the gallery the next person
  browses. A component missing from the gallery is invisible.
- It gets a row in `slide-kit/slide-types/README.md` saying **what it is for**,
  not just its name.

**Approved means the user said so.** A one-off arrangement for a single slide
stays inline in that deck; promoting everything turns the kit into a junk
drawer, and a signed-off deck's output changes when the kit does.

Retiring follows the same path in reverse: into `remove:` in `sync-kit.mjs`
with the reason, and marked retired in the registry, the way `QuizSlide` is.

## 15. A backslash in a JSX attribute is literal, so write one

In a JSX attribute string, `\` is **not** an escape character. `root="C:\\app"`
renders on the slide as `C:\\app`, with both backslashes visible.

```tsx
root="C:\nxttrendz"          // renders C:\nxttrendz     correct
root="C:\\nxttrendz"         // renders C:\\nxttrendz    WRONG, and it ships
filename="backend\Dockerfile"                          // correct
```

The confusion is that the doubling **is** correct one line away, inside a
JavaScript string literal, where `\\` is an escaped backslash that renders as
one:

```tsx
const AT_ROOT = 'C:\\nxttrendz'    // correct: a JS string, renders C:\nxttrendz
<Terminal path={AT_ROOT} />        // correct
```

So the rule is by position, not by habit: **doubled inside `{'...'}`, single
inside `"..."`.** Session 4 shipped 19 doubled paths to review because the
constants were right and the attributes were copied from them.

Windows paths appear on every deck in this course, so grep before handing over:

```bash
grep -nE '(lead|title|root|filename|path)="[^"]*\\\\' src/decks/*.tsx
```

## 16. A question slide carries the question and nothing else

When a slide poses a question to the room, use `QuestionSlide`. Not a
`ContentSlide` with a lead and no points: that inherits the content layout, so
the question sits top-left at lead size with an empty well beneath it, and the
one thing the room is meant to think about is neither the largest thing on
screen nor centred on it. It reads as a slide someone forgot to finish.

- **Nothing else on the slide.** No bullets, no figure, no callout, and above
  all no answer. Anything else is something to read instead of think.
- **The answer is the NEXT slide.** That is the whole mechanism: the room
  commits out loud, then sees whether it was right.
- **One question per slide.** Split a compound question, for the same reason a
  slide carries one idea. Asked "does this install the same version today, and
  again next month?", a room answers the easy half and never considers the
  second. Asked as two slides, it has to answer both.
- `qualifier` takes at most one short line, for a constraint needed in order to
  answer. Never a hint.

If a slide genuinely needs supporting content, it is a `ContentSlide` whose
lead ends in a question mark, and that is a different slide with a different
job.

## 17. Screenshot every custom figure and look at it

The three harnesses cannot see inside a figure, and this is a structural blind
spot rather than an oversight in any of them.

`qa.mjs`, `video-safe.mjs` and `align-check.mjs` all measure **DOM element
rectangles**: against the frame, against the reserved video box, and against
each other. An `<svg>` is one DOM element. Every `<text>`, box and arrow drawn
inside it is invisible to all three, so a figure whose labels sit on top of one
another passes every sweep.

That is not hypothetical. Session 4 was reported clean by all three harnesses
and the user opened the deck to find two collisions immediately: in
`PortPublish` the port numbers straddled the zone borders and crowded a title,
and in `BrowserOutsideDocker` both `localhost:` labels rendered across the port
doors and the dashed Docker boundary, which is the one line in that figure the
whole argument depends on.

**So: capture every slide carrying a custom figure and actually look at the
image.** Not the JSX, not the coordinates. The arithmetic looks right in source
right up until a font renders wider than assumed.

```js
// playwright, from inside the session project so the dep resolves
await page.goto(`http://localhost:<devPort>/?all#/<n>`, { waitUntil: 'networkidle' })
await page.waitForTimeout(2600)   // the settle time the harnesses use
await page.screenshot({ path: `slide-${n}.png` })
```

`node preview.mjs && node scripts/build-preview-page.mjs` builds a contact
sheet of the whole deck, which is the cheaper way to do this for every slide at
once. Either way, the check is a human or a model looking at pixels.

Text inside an SVG is the specific hazard, because it has no layout engine
keeping it apart from its neighbours: a label centred on a boundary will
overlap that boundary, and nothing warns you. Give labels their own clear
space rather than trusting a coordinate.

## 18. Every deck carries one or two quiz frames, and the last one sits before the takeaways

A session deck must include **one or two** `QuizTimeSlide`s. They are not
optional chrome: a quiz frame marks the switch from "listen" to "answer", so the
room looks up before anything is asked.

**The last one goes immediately before Key Takeaways.** A second, when there is
one, goes at a concept boundary in the middle of the deck.

**Two is the shape asked for on 2026-08-31, while planning session 7**, and it
supersedes the standing "no quiz frames anywhere" instruction that sessions 5 and
6 shipped under. That instruction is retired: it was given as a preference for
one deck, was carried forward twice by inheritance, and left three consecutive
decks silently contradicting this rule. A future session does not need to ask
again, and does not need an exception recorded for it.

Where the second one goes is the pedagogy question, not a layout one:
`PEDAGOGY_GUIDELINES.md` §8 puts it **after the concept the rest of the session
depends on**, so a misunderstanding is caught before it compounds. Session 7 puts
it after concept 2, because everything from there on assumes the room can already
read the words pipeline, stage and gate.

```
… → Recap → QuizTimeSlide → Key Takeaways → Next session → Thank you
```

That position is the point. The takeaways state what the room should now
believe; the quiz is the last chance to find out whether they actually do,
while the session is still in the room. Put it earlier and the takeaways paper
over whatever the quiz just exposed. Whatever else a deck does, one quiz frame
still holds this slot.

Write the `subtitle` so it names what is being tested, without asking anything:
*"Two Dockerfiles, one Compose file, and one address that broke the rule on
purpose"*. The room should be able to tell which part of the session is about
to be examined.

**The frame carries no question, no options and no answer** (see the component's
own note). The question is asked from the quiz tool, so the deck never holds a
second copy that can drift, and no answer is ever sitting on a slide the room
has already seen. `QuizSlide`, which did render a question with four lettered
options, was retired from the kit for exactly this reason.

---

## 19. The concept and its sub-concept are pinned to the top of every slide

On every slide that carries them, the **kicker** (the concept) and the **title**
(the sub-concept) sit at the slide's own top-left datum: x=64, starting at y=48.
Not beside the figure, not underneath it, not in whichever column the layout
happened to put the text in.

They are the room's answer to *"where am I in this session"*, and an answer that
moves between slides is not an answer.

It used to move. `SlideHeader` lived **inside** the text column of every
`Content*ImageSlide`, so:

- `ContentLeftImageSlide` started its header at x=664, six hundred pixels right
  of where the previous slide's header had been
- `ContentTopImageSlide` drew the media *above* the header, so the concept name
  appeared halfway down the slide, after the picture

`align-check.mjs` measures every slide against "the header left edge" as its
datum and had been reporting both as DRIFT for several sessions before anyone
read the finding. The header is now hoisted out of the column layout in
`ContentImageSlides.tsx`, and `left` / `right` / `top` / `bottom` name where the
media sits relative to the **points**, never relative to the header.

**Applies to any new slide type too.** If it has a kicker and a title, they go
through `SlideHeader` as the first child of the slide's column, before anything
else. A type that needs the header somewhere else needs a different reason than
"it looked better".

## 20. Key Takeaways restates the agenda concepts, verbatim

The Key Takeaways slide carries **the agenda's items, word for word**. Not
reworded as outcomes, not a summary written fresh at the end, and never a fifth
item the agenda never promised.

The room was promised exactly those concepts at the start, and this frame is the
receipt. If the words change, the room cannot tell whether what they got is what
they were promised, and the deck quietly makes a different claim than it opened
with.

**What changes between the two slides is the UI, not the words.** The agenda and
the takeaways deliberately use different components so the frame does not read as
a copy-paste; the strings are identical.

Session 5 shipped reworded outcomes here and they were replaced with the agenda
strings. The sample deck did the same thing for longer, which is worse: it is the
file every new deck is copied from.

Corollary: **at most four agenda items**, and no agenda item that is deck chrome.
"Practice and wrap-up" is not a concept, and putting it on the agenda forces
either a fifth takeaway or a mismatch.

## 21. The welcome line is written once

`WelcomeSlide` hardcodes its own kicker, *"Welcome to today's session"*. Nothing
else in the deck may say it again, and in practice that means `BrandSlide`'s
`greeting` is something else: `"Welcome!"` is the default and it is fine.

The two frames sit one or two slides apart, so the same sentence arrives twice
inside ten seconds and the deck opens by repeating itself. The gallery shipped
exactly that.

`WelcomeSlide` also takes `minimal`, and **`minimal` is the shipping form.** The
workflow specifies the kicker plus the session name, centred, and nothing else in
the body: no course chip, no subtitle, no presenter, no meta, no mascot, and no
body logo, because the footer already carries the one mark. The full-bodied
variant still exists on the props type; no shipping deck uses it.

---

## 22. Rendered copy never names a slide's position

No lead, bullet, callout, caption or table cell says **"the next slide"**, "the
next two slides", "the previous slide", "the slide before" or "as we saw two
slides ago".

Two reasons, and the second is the one that keeps costing.

**Slide order changes.** Every review pass in this repo has inserted, removed or
re-sequenced slides, and copy that names a neighbour is silently wrong the moment
one moves. Nothing fails: the deck builds, every harness passes, and the slide
now points at whatever happens to be beside it. Session 5 shipped
*"The next two slides are the fix"* and a caption reading *"Not on PATH, and the
next slides fix it"*, and both became wrong within the hour, when the success and
error cases were split onto separate frames.

**It is stage direction, not content.** A slide telling the room where to look
next is doing the instructor's job on the instructor's behalf, badly. The room
does not navigate the deck; the presenter does.

**Say what is coming, not where it is.** "Two steps fix it: find where it
installed, then add that folder" survives any re-ordering and tells the room more
than a pointer does.

| Write | Not |
|---|---|
| `Two steps fix it: find where it installed, then add that folder` | `The next two slides are the fix` |
| `Where the container's data lives comes later in this session` | `Slide 52 answers this` |
| `Same file, with your database and your secrets added` | `The same file as the previous slide` |

**Speaker notes are exempt, and deliberately so.** `notes:` is the instructor's
own script, never rendered to the room, and "do not answer it, the next slide is
the answer" is exactly the direction a presenter needs. The rule is about what is
on the screen.

**Naming a later SESSION is also fine** — "later in this course", "next session"
— because a session is a stable unit and content rule 4 already governs how much
of it may be opened. It is slide-level pointers that rot.

---

## 23. Every concept opens on a need and closes on proof, and the deck is one chain

Full text, with all four frameworks and their tests:
[`slide-kit/workflow/PEDAGOGY_GUIDELINES.md`](../../../slide-kit/workflow/PEDAGOGY_GUIDELINES.md)
section 2.

**The invariant, which never varies.** Every concept **opens** on a felt need
(the routine the learner has, then the point it breaks) and **closes** on
something observable (run, seen, chosen with a reason, or done by the learner).
The opening and the close are fixed so a reviewer can check them in seconds.

**The middle varies by what kind of concept it is.** One framework per concept,
named in the plan, never two blended:

| The concept is | Use | Slides | The one-line check |
|---|---|---|---|
| a mechanism, file, command, config | **STAR** *(default)* | 5+ | two Situation slides, and a Result that was run |
| a definition, nothing to run yet | **4MAT** | 4+ | a *Why* slide before the *What* slide |
| a choice between options | **SCQA** | 4+ | the question on its own frame, then a verdict with its reason |
| a skill the learner performs | **Merrill** | 5+ | an *Application* slide where the learner does it |

**When in doubt, STAR.** A concept that seems to need one of the other three
usually needs STAR and a clearer break in its Situation.

**The set is open, and admission has a price.** A fifth framework may be added
when a concept is genuinely explained better by one. It must satisfy the
invariant, make an argument none of the four makes, ship its own one-line review
check, and be **registered before it is used** — a row in
`PEDAGOGY_GUIDELINES.md` section 2, a row in `RULES.md`, added with the user's
confirmation. **Chosen at plan time and named in the plan, never during
generation:** a framework named while slides are being written is almost always
a label applied after the fact to a concept that already broke this rule. A new
framework replaces the middle and never touches the opening or the close.

STAR's movements: **S** Situation, **two slides** (the routine running, then the
break) · **T** Task, the capability in plain words with **no syntax** ·
**A** Action, the instruction · **R** Result, the run with its `→ expected` line.

**Four or five slides is the floor for a concept.** Fewer means it is not a
concept; it is a line on an existing slide.

**The one check that catches most violations: count the opening slides.**
There are two, in every framework. The cost beat is the one that vanishes, and a
single opening slide is a preamble followed by a mechanism introduced cold. That
is the exact defect this rule exists to stop.

**A framework is not an escape hatch.** Picking 4MAT because a concept has no
Result does not excuse a cold opening: 4MAT's *Why* is the same two slides as
STAR's Situation.

**Task holds no syntax.** A Task slide carrying a command is an Action slide
mislabelled, and the learner never got told what problem the command solves.

**The close is mandatory, and each framework has its own.** STAR closes on a
Result the room watched happen (a command run, a page rendered, a log line, a
status code); 4MAT on *What if*, a named consequence in the learner's own work;
SCQA on a verdict with its reason; Merrill on the learner doing it. Rule 11
governs how a capture is cropped; content rule 6 governs how it reveals.

**Then chain them.** Concept N's close is concept N+1's opening, and the
divider inherits it. Four concepts that each pass their own framework alone still read as four
unrelated topics; the join is what makes a 60-slide deck one build. Bounded by
rule 4: a cost named inside a concept is resolved inside that concept, so
chaining forward is a handoff, never an opened problem left hanging.

**Why this rule exists.** Session 4 (`Running the Real App with Docker`) shipped
`ENV PYTHONUNBUFFERED=1`, `.dockerignore`, published ports and the database move
as bare instructions on slides 14, 26, 31, 44 and 57. All five review comments
said the same thing: *give the problem first, then provide this as the solution.*
Each re-cut cost two slides the original plan should have carried. The rule was
written as four unnamed beats after that session and still got skipped, because
an unnamed rule is not a rule anyone can check. These are checkable: count the
opening slides, look for syntax in the Task, look for the close.

---

## 24. Nothing appears before it is introduced, and an introduction says why here

Full text, with the term ledger and the placement test:
[`PEDAGOGY_GUIDELINES.md`](../../../slide-kit/workflow/PEDAGOGY_GUIDELINES.md)
section 2b.

**Every session here is taught to absolute beginners**, assuming a learner who
does not grasp quickly. That assumption buys **order**, not repetition.

1. **No term, tool, file or concept appears on a slide before the slide that
   introduces it** — leads, bullets, callouts, terminal comments, table cells
   and figure labels all included.
2. **An introduction says why it is arriving here.** STAR's Situation and Task
   are that "why"; a term with no felt need in front of it gets memorised, not
   understood.
3. **A later use names where the term came from, in content terms**, never by
   position: "the image we built in concept 2", never "the image from slide 19"
   (rule 22).
4. **Explained once, used often.** A second explanation is a defect. A second
   *use*, in new surroundings, is the design — that is how a beginner deck is
   both slow and non-repetitive at the same time.

**The placement test.** *A concept's Situation must be writable using only terms
already introduced.* If it cannot be, the concept sits in the wrong place: move
it after its prerequisite, or introduce that one prerequisite inside this
concept's Situation. "The instructor will say it out loud" is not a third
option — a deck that only works when narrated is not the deck the next
instructor receives.

**Register, all four hard:**

- **One new named term per slide.** Two is one-idea-per-slide broken in
  vocabulary instead of in content.
- **The plain-words gloss comes before the formal name.** "A packaged copy of
  your app, ready to run anywhere. That package is called an **image**." Never
  "An image is an immutable filesystem snapshot".
- **No word in a gloss may itself need a gloss.**
- **No unexpanded acronym, ever** — CI/CD, WSGI, ORM, DNS.

**Why this rule exists.** Session 5 shipped a section titled `Makefile in CI/CD`
having never said what either letter stands for. The review comment was *"CI/CD
is new for students so we need to update flow and explanation"*, and the fix
cost six new slides. Every pacing re-cut in this repo has run the same way: the
mechanism arrived before the vocabulary needed to state its problem, so the
problem went unstated, so the mechanism arrived cold.

---

## 25. Nothing arrives assembled: one new element per slide

Full text: [`PEDAGOGY_GUIDELINES.md`](../../../slide-kit/workflow/PEDAGOGY_GUIDELINES.md)
section 3.

**An artefact with more than one part is never shown complete on its first
appearance.** It is built one element per slide, then shown whole with its
payoff line.

This is where STAR's **Action** expands: Action is one slide only when the
instruction is one line. A Dockerfile, a command chain, a compose file, a
pipeline or a diagram makes Action a build sequence, and the concept grows past
five slides. That growth is correct.

| Artefact | One element is |
|---|---|
| a file | one line, or one directive |
| a command chain | one command |
| a diagram | one node, one arrow, or one label |
| a table | one row |
| a config | one key |

**The test:** a learner pausing on any slide of the sequence can say what
changed since the previous one, in one sentence. If they cannot, two things
landed at once.

Previously shown content stays visible, unchanged, in the same position; elide
earlier blocks with `...` once the sequence runs long, never re-flow them. One
new line gets **one** new annotation, in the fixed format: `token` on one line,
`→ what it does` on the next.

---

## 26. Plain English: write literally, never figuratively

Full text, with the substitution tables and the measurements:
[`TEXT_GUIDELINES.md`](../../../slide-kit/workflow/TEXT_GUIDELINES.md) section 3d.

These decks reach **lakhs of students**, and for many of them English is a
second or third language. There is no instructor in the recording to rescue a
line they stall on.

**The first test on every rendered string: does every word mean what it says?**

A second-language reader can look up a long word. **They cannot look up an
idiom.** This outranks §3a's "short Anglo-Saxon over long Latinate" advice,
which is not wrong but is insufficient here: `under the hood` is short,
Anglo-Saxon, and banned.

**Banned: figurative verbs and idioms.** `under the hood` · `wired up` ·
`bake into` · `spin up` · `roll back` · `kick off` · `hit the endpoint` ·
`out of the box` · `figure out` · `run into` · `end up with` · `take care of` ·
`on the fly` · `up and running` · `ship` (as a verb) · `hand off`, plus every
cultural or sporting metaphor.

The generative rule for anything not listed: **a two-word verb whose meaning is
not the sum of its words is banned.** `set up` and `log in` stay, because they
are the learner's own words and the tools themselves use them.

**Banned: Latin abbreviations.** `e.g.` → *for example* · `i.e.` → *that is* ·
`etc.` → name the rest · `via` → *through*, *using* · `vs.` → *compared with* ·
`per` → *for each* · `N/A` → *not needed*.

**Hard limits**, measured against 2,416 shipped strings whose median is 4 words:

- **20 words maximum** in any rendered string. Past that it is a paragraph, and
  paragraphs are two slides (rule 24, and `PEDAGOGY_GUIDELINES.md` section 2b).
- **Two commas maximum.**
- One line is one sentence (`TEXT_GUIDELINES.md` §4b, already a rule).

**Four more, all hard:** write active not passive · never stack more than two
nouns (`container image build context` → `the build context for the image`) ·
never negate twice (`not uncommon`) · no conditional pile-up (`If you had not
set this, the build would have failed` → `Without this line, the build fails`).

**Why this rule exists.** Asked for directly: *"here we are catering lakhs of
students, not all would be able to understand difficult vocabulary, we must use
very simple and understandable English."* The audit that followed found
`under the hood` nine times in shipped decks, `wired up` four, `bake` six,
`e.g.` eleven, `via` five, and a Jenkins slide reading *"an automation server is
simply a program"*, which also broke §3b's existing ban on `simply`. Nothing had
ever flagged them, because there was no line to check them against.

**Delivered decks are frozen.** Those counts are evidence for the rule, not a
list of slides to go and fix. See the freeze clause at the top of `RULES.md`.

## 27. An illustration is researched before it is drawn

**Hard rule.** Before a concept gets a figure, find out how that KIND of idea is
conventionally drawn. Then either use the convention, or write down what you are
doing instead and why. Reaching for the nearest component that fits the data is
not a choice of representation, it is a choice of whatever came to mind first.

Asked for on 2026-09-09: *"whenever you're preparing an illustration for any
concept, research on what is the best way of representation, and add this in
rules or guidelines to follow every time."*

### Why, in three decks' worth of evidence

- **Session 7's CI/CD reach.** The signed-off plan guessed `NestedSpans`, three
  brackets above a chain, "because the actual relationship between the three
  terms is containment, and no other candidate draws that". The user overruled
  it: the convention is **stacked rows**, and the thing that had to be drawn was
  the **human approval marker** between delivery and deployment. A lab then built
  four candidates and `ThreeLanes` won, on the ground that Atlassian, Red Hat,
  AWS, CircleCI, IBM and Bitrise all publish that same picture, so a learner
  meets it again in the first article they read. **Local cleverness lost to a
  published convention**, and no amount of reasoning from the data would have
  found it.
- **Session 5's analogy rows.** `AnalogyMap` drew two bordered boxes and an arrow
  glyph per row. The review rejected the rendered slide outright, and the
  diagnosis that won was that the fault was the GRAMMAR, not the styling: two
  boxes and a glyph are three objects, so the eye counts three things and then
  has to be told they are one. `SwapRows` replaced it with one object cut in two.
- **Session 4's SVG figures.** Two shipped with `<text>` labels overlapping and
  all three harnesses passed them, because an `<svg>` is one rectangle to a
  harness (rule 17).

### What counts as research

One of these, and say which in the slide's own source:

1. **How the field draws it.** Vendor docs, the tools' own dashboards, the
   articles a learner will read next. A picture the room meets again elsewhere is
   worth more than a better picture they never see twice.
2. **A named representation for that shape of claim.** Containment, sequence,
   one-to-many, queue-and-servers, before-and-after, part-and-whole each have
   conventional forms. Name the shape of the claim first, and the form follows.
3. **The registry.** `slide-kit/slide-types/README.md` says what each figure is
   FOR and what it must not be used for. A figure whose contract does not match
   the claim is the wrong figure even when the data fits its props.

### The check

**The slide's source says why THIS representation and not the obvious
alternative.** One sentence is enough, and the absence of that sentence is the
defect: it is the difference between a chosen figure and a found one. Where the
answer is "no existing figure makes this argument", rule 14 takes over and it
becomes a lab with candidates.

**This is not a licence to build a component per slide.** Most concepts are
served by a figure already in the registry, and the research usually ENDS at the
registry. What the rule forbids is skipping the question.

## 28. The quiz frame says "Quiz Time!" and nothing else

**Hard rule.** The quiz announcement slide carries its two words and no subtitle,
no lead, no bullet, no list of what the quiz covers.

Asked for on 2026-09-09: *"remove any kind of sentences in the Quiz Time slide.
The only sentence present should be the two words Quiz Time, no other should be
used on that."*

`QuizTimeSlideProps` still declares an optional `subtitle`, because removing a
prop from the kit changes the type every delivered session compiles against. Do
not pass it. A session that does is the defect, not the type.

Two reasons, and the second is the one that matters:

- **The questions are not on the slide.** A quiz is delivered by an external
  component (`QuizSlide` is retired for this reason, see
  `slide-kit/slide-template/CLAUDE.md` section 2), so the frame's whole job is to
  say "stop, we are checking". A subtitle listing the topics **previews the
  questions and answers some of them**: session 7's mid-deck frame read "five
  stages, two rules, and the difference between delivery and deployment", which
  is three of the answers.
- **It is the one frame in the deck with nothing to read.** That is deliberate.
  The room's attention has to move off the screen and onto the tool, and every
  extra line on the slide holds it where it no longer belongs.

**Check:** `grep -n "QuizTimeSlide" -A 3 src/decks/*.tsx` shows `lesson` and
nothing else.
