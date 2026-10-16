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

## 12b. Slide copy is professional, never casual

**Banned on a slide:** an evaluative aside about how a thing feels. "This is
annoying", "the fun part", "don't worry", "a bit of a pain", "sadly", "luckily",
"unfortunately". Also banned: addressing the room's mood rather than the
subject.

A slide states what is true and what it costs. The instructor supplies warmth,
emphasis and reassurance out loud, where it belongs and where it can read the
room. A slide that editorialises takes that job away from them and fixes one
reading of it into the deck, where it will be read by someone the tone does not
suit.

Rewrite by naming the mechanism instead of the feeling:

| Casual | Professional |
|---|---|
| "A changing address is annoying" | "A changing address costs nothing until it is written into a file" |
| "Now for the fun part" | (delete it, and let the divider do the work) |
| "Don't worry if this fails" | "If this fails, the cause is almost always the security group" |
| "Sadly the free tier only gives 750 hours" | "The free tier is 750 instance hours a month" |

### Never print a session number on a slide

**User, 2026-09-16:** *"No Session number should be mentioned."*

A deck refers to itself and to the course by NAME, never by number. Not in the
footer, not in a recap, not in a takeaway. "Session 8", "sessions 8 and 9",
"in session 4" are all banned in rendered copy.

| Banned | Write instead |
|---|---|
| "Jenkins built this in session 8" | "Jenkins built this for you" |
| "Session 9 launched the instance" | "You launched the instance last session" |
| "as we saw in session 4" | "as you saw when you wrote the compose file" |

Numbers date a deck and break the moment a session is inserted, split or
re-ordered, and a learner watching a recording has no idea which number they
are on. **"Last session" is fine. A number is not.** Where the reference needs
to be specific, name the thing rather than the slot: "when you wrote the
Jenkinsfile", "when you pushed your first image".

Instructor `notes` may still use numbers, because the instructor is the only
reader and they know the running order.

### Professional does not mean long words

Said in the same breath, **user, 2026-09-16:** *"also use very simple english
dont use high vocabulary."* These two pull in the same direction, and it is easy
to get one by breaking the other: dropping "annoying" and reaching for
"acquires a cost" trades a casual word for a hard one, which is worse. The room
reads English as a second language.

So: short, ordinary words, in short sentences. A term the course has taught is
fine, because it was taught. A long word chosen for tone is not.

| Reaching for tone | Plain |
|---|---|
| "it acquires a cost" | "it starts costing something" |
| "this is subsequently deployed" | "this is deployed after that" |
| "leverage the pipeline" | "use the pipeline" |
| "a myriad of services" | "over 240 services" |
| "ensure that the rule is present" | "check the rule is there" |

This is the second tone correction from the same user. Session 9 removed
classroom-management voice, "Everyone confirms", "All must". The three rules
share one root: **a slide carries the fact, the instructor carries the
delivery.** Hard rule 26 already asked for plain literal English; this says it
again because it was missed.

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
<!--
  Rules 29 to 31 were written on 2026-09-11 on a branch cut from main, while
  rules 22 to 28 existed only as uncommitted work in the author's tree. The
  numbers assume those land first. If they land differently, renumber these.
-->

## 29. No company-presentation voice: a title is the topic, a line is the fact

**Hard rule.** The full text is `TEXT_GUIDELINES.md` §3c (state the fact, do
not allude to it), §3d (literal, never figurative) and §4 (titles are two or
three words, topic-bare). This rule exists because all three were already
written when Deployment session 8 shipped 58 slides that broke them, and the
user's description of the result is the test to apply:

> "Our aim is to provide clear simple understandable content across lakhs of
> students, not fancy phrases... Your sentence phrasing is like for company
> presentations."

**The audience is absolute beginners**, many reading English as a second or
third language, with no instructor in the recording to rescue a line.

Two shapes of the failure, both from that deck, so they are recognisable:

| Shipped | Why it fails | Plain |
|---|---|---|
| `The Job That Cannot Do the Job` | Clever to someone who knows the point. Says nothing to someone who does not | `docker: not found` |
| `A Green Build That Only Echoes` | Names no build, no echo, no problem | `Where We Left Off` |
| `What a Machine Just Did That You Used to Do` | Ten words, and a riddle | `Before and After` |
| Lead: `Add one docker command to the job, and it stops dead` | Fact, comma, remark about the fact. The remark is the instructor's, spoken | `Add a docker command to the hello-jenkins job. It fails with this error` |

The second shape has a name now: **fact-comma-remark**. About 25 leads on that
deck were built this way (`...and neither of them is private`, `...and none of
them were yours`, `...and it is a habit`). The remark goes to `notes`. The line
keeps the fact.

**Three tests before a string is kept:**

- Is the title the topic, in two or three words? Not a phrase about the topic.
- Does the lead state the fact, or comment on it?
- Would a reader who has never met this subject learn the thing from this line
  alone?

## 30. Every process is shown with a real screenshot

**Hard rule.** A slide that walks the learner through a UI (a sign-up, a
dashboard, a settings page, a form, a token page) carries a real capture of that
screen, cropped per rule 11. A table of field names or a list of steps does not
stand in for it.

Deployment session 8 shipped the ngrok sign-up, the authtoken step, the GitHub
webhook form and the AWS sign-up as steps and tables, and recorded each as a
"plan deviation". The user's correction: *"for every process you must add
screenshots, for ngrok setup or getting the auth code you haven't added any
screenshot, same for AWS as well."* A beginner following a table cannot find
the button. A beginner following a picture can.

**Privacy is handled by choosing the screen state, never by skipping the
capture and never by retouching it (rule 11).** A token page is captured with a
real token that is then revoked. A sign-up form is captured before personal
fields are filled. A payment screen is not captured at all, and the slide says
where the learner is and what they will see.

## 31. Every code panel says where the code lives or runs

**Hard rule.** A `Terminal` already carries its `PS C:\path>` prompt (rule 3).
This extends the same obligation to every other panel that shows code or text
the learner will see. What "where" means depends on the course:

- **A project course** (deployment, Django, anything the learner builds on
  disk): a `CodeBlock` names the **file path** (`backend/Dockerfile`) or the
  **UI location** (`Jenkins → nxttrendz-build-test → Configure → Pipeline →
  Script`). Never a bare label like `Pipeline script`.
- **A playground course** (a first programming course, where the learner types
  into a code playground and never creates a file): the panel names the
  **language**, and nothing else: `Python`, `Java`, `JavaScript`, `SQL`. Never an
  invented file name (`mistake.py`, `main.py`, `riya.py`), and never the file
  name and the language together. Pass the language as `filename` and leave the
  chip empty, or the reverse, so the word appears **once**. A pseudocode panel
  is titled `Pseudocode`.
- **The exception in a playground course** is a slide whose lesson IS the
  file: a `Dockerfile`, a `docker-compose.yml`, a `settings.py` the learner has
  to find on disk. There the file name is the content, and it stays.
- **An output panel** is titled by what it shows (`Output`, `Input`,
  `Expected output`), never by a file.
- **Program output the learner reads in a browser is never rendered as a
  shell.** Deployment session 8 put Jenkins Console Output inside a VS Code
  `Terminal` with a `PS C:\nxttrendz>` prompt on three slides. That tells the
  learner they typed those lines in PowerShell. They read them in the browser,
  on the build page. It is a `Shot` of the console (rule 30), or a `CodeBlock`
  labelled with where it is on screen.

The reasons, both kept because they are the same rule seen from two courses:

- Deployment. The user's words: *"whenever a code is presented the path or
  place must be mentioned clearly."* "Wrong folder" and "wrong window" are the
  first two errors a beginner hits, and a panel with no location invites both.
- Playground. The user reviewed PF 14 "For Loop" (2026-09-29), where every code
  box carried an invented file name (`mistake.py`, `while_loop.py`, `riya.py`,
  `seats.py`). The learner never creates those files; they type into a
  playground, so the language IS where the code runs. A name that changes from
  slide to slide reads as seven different programs, and it tells the room
  nothing the language would not.

## 32. The slide is laid out in zones: header, Space-1, Space-2, Space-3

Every content slide on the 1280x720 canvas is divided into fixed zones, and each
has one job:

| Zone | Coords | Job |
|---|---|---|
| Header | x 0..912, y 0..148 | the kicker and the title, **and nothing else** |
| Speaker box | x 913..1280, y 0..220 | held empty for the instructor video |
| Space-1 | x 64..1159, y 251..709 | the content area, and the default answer |
| Space-2 | x 1159..1214, y 251..658 | a little extra width, taken SECOND |
| Space-3 | x 64..880, y 162..240 | extra height above, taken LAST |

1. **The header carries the kicker and title only.** The lead moves out of the
   header and becomes the first block inside Space-1.
2. **Space-1 is the default.** Fit everything there first, centred within it,
   not dumped at the top-left.
3. **Overflow goes Space-1, then Space-2, then Space-3.** Space-2 when the
   layout needs a little more width; Space-3 only when it needs more room than
   that gives.
4. **Space-3 is a hard ceiling.** Nothing above y=162, and nothing in that band
   past x=880.
5. **A slide that fits in Space-1 leaves Space-2 and Space-3 empty.**
6. **Vertical centring.** Normal content is centred between y=221 and y=647, on
   y=434. Those two lines are a centring guide, not a limit: heavy content or a
   heavy layout may use the whole of Space-1 down to y=709, plus Space-2 and
   Space-3 by the order above.
7. **The left edge is 64**, shared by the header and the body, and the right
   edge of the padded frame is 1216.

The zones are the user's own annotated templates (`Rules_beta/A.png` for the
zones, `Rules_beta/C.png` for the centring lines), first applied and judged on
slide 9 of `Rules_beta/beta_testing_slides` (`ZonedNoteSlide` in its deck file).
The reason: with the lead inside the header, the header's height changed from
slide to slide, so the body started at a different height on every slide and
content was pushed down or packed top-left by whatever the header happened to
be. Fixed zones give every slide the same body area.

## 33. The header: the kicker, a gradient divider, the title

1. **No accent line before the kicker.** The kicker is the label on its own: no
   3px x 24px tick in front of it, and no gap left where it was.
2. **The kicker is 22px, Title Case as typed, navy on a light slide.** DM Sans
   Medium, 0.02em tracking, `#002A4B` (`colors.ink`); white on a dark slide.
   Never capitals, never the slide's tone colour. Title Case follows the
   user's seven rules: first and last word capitalised; nouns, verbs,
   adjectives, adverbs and pronouns capitalised; `a an the and but or nor in
   on at of to for by as` lowercase unless first or last; prepositions of four
   or more letters capitalised; the first word after a colon capitalised;
   every part of a hyphenated term capitalised; a technical name in its own
   form (`id`, `id()` stay lowercase even as the last word).
3. **One gradient divider between the kicker and the title, ALWAYS** (user,
   2026-10-16: "that is part of the template, don't remove it in any case;
   the gradient line below the kicker is a must"; rule 49 never covers it), 3px tall and
   400px long from the text's left edge, solid in the slide's tone for 13% of
   its run and faded to nothing by the end, 33px below the header's top. No
   bars at the left edge: the pair of 2026-09-24 went with the old design.

The design is the user's updated template (`updated_template/`), first proved
on `new-template-slide-generation/` (Python session 20 re-dressed,
2026-10-12 and 13) and made the base template on 2026-10-14. **The kit carries
it** (`src/ui/primitives.tsx`, `src/ui/SlideHeader.tsx`, the `kicker` token in
`tailwind.config.ts`). An existing session gets it the next time
`sync-kit.mjs --apply` is run on it; delivered decks stay as they are.

## 34. Typefaces: the updated template's sheet, four faces, two weights

| Role | Typeface |
|---|---|
| Session and section titles, the hero words (Welcome, Thank You, All the Best, the agenda's `Agenda`, `Quiz Time!`), the next session's name | Sora SemiBold (`font-tpl-title`) |
| Slide titles and every heading inside a figure (question lines, task names, agenda point titles, chip, button and vote labels, badge numbers) | DM Sans SemiBold (`font-heading`) |
| Kicker and all body (leads, bullets, subs, captions, worksheet steps, speech bubbles, the phone mock, timer digits) | DM Sans Medium (`font-body`) |
| Code, output, the ids, names and values in memory pictures, the player's own counter and picker | Fira Code (`font-mono`) |
| The title bar of a code or terminal window (`Python`, `OUTPUT`, the tabs) | Ubuntu Mono (`font-term`) |

Only Medium (500) and SemiBold (600) exist. The `fontWeight` remap in
`tailwind.config.ts` folds every lighter class onto Medium and every heavier
one onto SemiBold, and `font-synthesis-weight: none` stops the browser faking
a weight. Never set another family on a slide, and never hardcode a
`font-family` in a deck: headings use `font-heading`, hero words
`font-tpl-title`, everything else inherits `font-body` from `SlideBase`.

The sheet is the user's (2026-10-12, on the Python session 20 re-dress), made
the base template on 2026-10-14; it replaced Poppins, Inter and JetBrains
Mono, which had replaced Sora on 2026-09-25. **The kit carries it**
(`index.html`, `tailwind.config.ts`, `src/design/tokens.ts`, `src/index.css`).
An existing session keeps its old faces until `sync-kit.mjs --apply` is run on
it. DM Sans measures linear under zoom to 0.01px, but a line can still sit at a
wrap boundary, so re-run `fit-check.mjs` on a session after syncing it.

## 35. A heading never wraps: shorten the words

Every heading sits on one line: the slide title, and every card, step or panel
title set in `font-heading`. When a heading wraps onto a second line, **rewrite
it shorter**. Keep its meaning, drop words, pick a shorter synonym.

Never fix a wrapping heading any other way:

- not a smaller font size
- not a wider box, a narrower margin or a changed layout
- not a manual line break, and not letting it wrap

Check it on the rendered slide, not in the source. Poppins sets wider than
Sora, so a heading's length in characters no longer tells you whether it fits.

The user set this on 2026-09-25, when Poppins replaced Sora for headings (rule
34). Poppins is wider, so headings that fitted in Sora can now wrap, in older
decks after `sync-kit.mjs --apply` and in every new deck.

## 36. No full stop at the end of a line of slide copy

No line of rendered slide copy ends in a full stop: a narration line, a
caption, a callout, a bullet, a lead, a hint, a card's sentence. Questions keep
their question mark, because that mark is part of what the line asks.

When one line holds two sentences, **split it onto two lines**, each without a
full stop. Do not delete the mid-line full stop and leave the sentences joined:
that is a run-on, and it reads as a changed sentence.

```
WRONG   Seven characters, seven boxes. The numbering starts at 0.
RIGHT   Seven characters, seven boxes
        The numbering starts at 0
```

This is a layout change, not a wording change: not a word is added, removed
or reordered. It sits beside the index rule "one line on a slide is one
sentence" (`TEXT_GUIDELINES.md` section 4b), which says how to join clauses;
this rule says how the line ends.

Code, output and quoted program text are not slide copy: `print("Valid.")`
keeps whatever the program really holds (course rule R3 in the Python course).

Why: the user had already asked for this and it was never written down, so
Python session 15 (`Outputs/python/15_string_methods`) shipped slide 7 with a
full stop on every narration line. Raised in review on 2026-10-01.

## 37. Template colours only: never a colour from the reference deck

**Hard rule.** Every colour on a slide comes from `src/design/tokens.ts` (or
the Tailwind tokens that mirror it). A deck built from a reference (a PPT, a
pedagogy-team lesson-plan HTML, a Figma board) takes the reference's
**content, beats and controls**, never its **palette**: no hex copied from
its CSS, no tint chosen "to match it", and no kit component left in a tone
that happens to echo it.

Three places this bites:

- **The recap header.** The kit's `RecapSlide` used to paint its kicker and
  the bars beside it in the success tone. On a deck whose every other header
  is brand blue that reads as a stray colour, so the recap header takes the
  **brand tone** like every other content slide. The kit's `RecapSlide` does
  so since 2026-10-14; sessions 16 to 31 carried the same thing as the
  `RecapBrand` override. The checklist's green ticks stay: a tick is a verdict.
- **Text is the template's navy.** Headings and body on a light slide are both
  `#002A4B` (`ink` and `body` in the tokens); white on a dark slide. Never a
  grey body colour from a reference.
- **Pills, chips and category bars** (takeaways, legends, option letters) are
  tokens: `brand`, `brandDark`, `success`, `warning`, `danger`, `muted`,
  `accent`, `teal`. Never the reference's purple, pink or grey.
- **Drawn product screens.** The object's OWN colours are allowed inside the
  object (a phone's shell, a chat app's green bar, a reel's ground) with a
  comment saying so; the slide around the object stays on tokens.

**Check:** `grep -nE "#[0-9A-Fa-f]{3,6}\b" src/decks/*.tsx src/decks/figures/*.tsx`
and every hit is a comment, a token-derived constant, or an object's own colour
with the comment that says so.

Why: user, 2026-10-05, on Python session 17 (`Outputs/python/17_loop_control_statements`):
*"one of the recap slides refers to the colours of the reference ppt for the
gradient bars beside the kicker … change it to our template colours, from now
on all ppts must follow this."* Sessions 15 and 16 had each fixed the same
green recap bar in review (session 16, review 3) without a rule being written,
which is how it reached a third deck.

## 38. One alignment per slide

**Hard rule.** Within a slide, every content block (the lead, the text, the
code boxes, their captions, the figure) shares one horizontal alignment. A
left-aligned lead over a centred code box is the defect.

Pick the alignment from the content, once per slide:

- **Left** for anything text-heavy, a list, or a code explanation: the lead at
  x 64 and every block under it starting at x 64. This is the kit's default:
  `ZonedFrame` draws the lead on the left edge, so a figure under it starts
  there too.
- **Centre** for a diagram, a single statement, or a visual-first frame: then
  the first line is centred as well (`CenteredLead` in the Python sessions'
  `common.tsx`, or the kit's centred slide types), never left.

Never fix it per slide. A figure that centres itself with `mx-auto` or
`justify-center` under the kit's left lead is the component's fault, so the
fix goes in the component, and a component that is centred by design is used
only with a centred lead.

**Check, on every deck before it is delivered:** `node mixed-align-check.mjs`
walks every slide's body box and reports any slide that holds both a block on
the left edge and a block centred in the box. It is the half of
`align-check.mjs` that was missing: that harness measures blocks against the
header's edge and tolerates anything that merely sits inside the frame.

Why: user, 2026-10-05, on Python session 17 (`Outputs/python/17_loop_control_statements`),
slides 9, 10, 21, 24 to 27: *"the first line of content is left-aligned in the
content area, but the code boxes and everything below the first line are
centre-aligned."* One session-local component (`Syntax.tsx`) centred its
figure under the kit's left lead on nine slides, and all three harnesses
passed them.

## 39. The agenda mark says Agenda, large, over the session name, small

**Hard rule.** On the agenda slide the large word in the mark is `Agenda`,
always. The small line above it is the session's name. A long session name
shrinks to fit the mark; it is never clipped, never wrapped out of the mark,
and never truncated. In the deck file:

```tsx
<AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} />
```

and nothing else as the title. "What We Will Cover", "Today's Agenda" and
"Agenda for Today's Session" are the three ways it shipped wrong.

The fitting is the component's job, not the deck's. The kit's `AgendaSlide`
(`title` defaults to `Agenda` and `kicker` to `lesson`) steps the name down
from 16px towards 11px until it sits in two lines inside the mark. Sessions 17
to 31 carried this file as `src/decks/figures/Agenda.tsx`; it is the kit's own
since 2026-10-14. Never shorten the session name to make it fit, and never
pass it as the title.

**The points, too, are the component's job**, and the rule is the same for
every count (user, 2026-10-05, first on Python 18, then 17, then for every
deck): the points sit on the arc, their number badges on the curve, and the
GROUP is centred on the mark's centre line, y 366, the midpoint of the orbit
ring (y 197 to 535). The gap between neighbours is the ring's height over the
count and never under 96px, so a short list spreads evenly across the band
with no empty stretch and a long one extends past the band equally above and
below; past the canvas margins the gaps shrink evenly, so nothing runs off the
slide. No point enters the speaker box (x 913 to 1280, y 0 to 220): a point
within 100px below the box has its text capped short of x 913, every point is
capped at the frame's right edge, and a long title or sub wraps inside that
width. Never a straight vertical list, never a fixed first and last y, never
a title shortened to fit.

**Check, on the built file:** `node agenda-check.mjs` at the session root (in
the kit since 2026-10-14; `AGENDA_SLIDE` names the slide): the large word is `Agenda`, the
small line is `deck.config.json`'s title, both sit inside the mark, the name in
at most two lines with no sideways overflow; the group of points centred on
y 366 with equal gaps, every badge within 2px of the arc, no point reaching
the speaker box or leaving the frame; then it stresses the fit with 64- and
71-character names and an unbreakable word.

Why: user, 2026-10-05, on Python sessions 17 and 18, as a rule for every deck
from then on: *"The larger, primary text must read 'Agenda'. The smaller,
secondary text must be the session name. If the session name is too long,
reduce its font size to fit. It must never overflow, wrap outside its
container, or be truncated."* Sixteen decks across the three courses had the
mark the other way round, with the word Agenda as the small kicker over a
title that changed from deck to deck. The points: the same day, on Python 18's
agenda, with two black lines drawn at the ring's top and bottom: *"The points
are not positioned relative to the band. Point 1 sits near the top line, and
point 2 falls below the bottom line."* The kit had spread them from a fixed
y 268 to a fixed y 612 whatever their number.

## 40. Code never shows a ligature: `==` and `>=` are two characters

**Hard rule.** In code, `==`, `===`, `>=`, `<=` and `!=` are drawn as the
separate characters the learner types, never as one joined glyph. Fira Code,
the kit's code face since 2026-10-14 (JetBrains Mono before it), ships
ligatures that join exactly these, so every code surface has them switched off:

```css
.font-mono, pre, code, kbd, samp {
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0, "calt" 0;
}
```

That block lives in the kit's `src/index.css` (since 2026-10-14; Python 17 to
31 carried it in their own copies), so a deck gets it without doing anything: the fix is the template's, never a slide's. A session figure
that draws code with an inline `fontFamily` instead of the `font-mono` class
must set the same two properties beside it. The advance widths do not change,
so nothing on the slide moves.

**Check, on the built file:** `node ligature-check.mjs` at the session root
(in the kit since 2026-10-14) walks every slide, finds every
text node carrying one of the five operators, and fails if the element drawing
it in the monospace face still has ligatures on. It prints the slides and the
operators it found.

Why: user, 2026-10-05, on Python sessions 17 and 18: *"In code, == and >=
render as one joined glyph. Each must appear as separate, clearly readable
characters … In every deck, the operators ==, ===, >=, <=, and != must never
render as merged glyphs in code. Build this into the template."* Nine slides
of 17 and five of 18 showed a joined `==` or `>=`; the whole course had been
teaching comparison with a glyph no keyboard has.

## 41. Every deck closes with the kit's feedback slide, then Thank You, then All the Best

**Hard rule.** Every session ends with the standard feedback slide, the kit's
`FeedbackSlide`, used as `<FeedbackSlide lesson={SESSION} />` with the id
`feedback`, then `ThankYouSlide`, then `ThankYouSlide title="All the Best"`
as the last frame, with the Next Session signpost before the feedback slide.
The feedback slide is never recreated, redesigned, re-laid out or restyled.
The **source of truth is the kit's built gallery**:

```
slide-kit/slide-template/dist-single/base-template.html
```

It was built and chosen in Python session 18 and carried by every deck since
as `src/decks/figures/FeedbackForm.tsx`; the kit holds it since 2026-10-14.

What that slide is: the night stage, the kicker `Feedback`, the title `We’d
love your feedback` and the line `Your thoughts help us improve this course`;
under them one white box holding the supplied QR code with `Scan to open the
feedback form`, the form's link (`forms.gle/5d1Ru8geTKdC4Bcr7`, opening in a
new tab) and `Scan the code, click the link, or fill out the form right
here`, a hairline separator, then the Google Form itself in a frame. The
kit's earlier `FeedbackSlide`, a heading with a link and no way to reach the
form, is gone; the name now IS this slide.

**Where it sits.** It is the deck's closing content slide, with id
`feedback`, after the Next Session signpost and followed only by Thank You and
then All the Best.

**How a deck uses it.** Nothing is copied: the kit's `src/slides/FeedbackSlide.tsx`
and `public/assets/feedback-qr.png` (byte for byte `slide-kit/assets/brand/
feedback-qr.png`, rule 13) come with the template. A deck passes the session
name and nothing else. Never regenerate the QR, recolour it or retype it.

The frame needs the network, and it is the only thing in a deck that does.
The QR code and the link reach the same form when the frame cannot load.

**Check, on the built file, before a deck is delivered:** `node
feedback-check.mjs` (in the kit since 2026-10-14). It opens the deck and the
kit's built gallery, finds the slide with id `feedback` in each, and compares
the rendered slide markup character for character. It also checks that the QR
image loads, the link text, the form frame's `src`, and that only Thank You
and All the Best follow. A redrawn or restyled slide fails it. The frame never lets the network go
quiet, so `video-safe`, `qa`, `align-check` and `mixed-align-check`, which
wait for that, may time out on this slide; run them with outside requests
blocked rather than changing the slide.

Why: user, 2026-10-06, on Python sessions 17 and 18: *"Use Session 18's
feedback slide (the form slide) as the standard feedback slide. Add it to the
project rules so every session and project created from now on includes this
same feedback slide."* Session 18 built two versions, a framed Google Form and
a native styled form, and the user chose the framed form. Earlier decks carried
the kit's `FeedbackSlide`, a heading with no way to reach the form. Delivered
decks are frozen (`RULES.md`): this applies from session 17 onwards, where the
user applied it first. On the same day, Python session 19 shipped the kit's plain
`FeedbackSlide`, and the user repeated it: *"The feedback slide in the
current deck does not match Session 18's … every session created from now on
must end with the feedback slide copied exactly from the source file, with
only session-specific text changed. Do not recreate or redesign it."* That
is why the built file is named as the source of truth and the check compares
markup rather than trusting a description.

## 48. Every slide sits on one of the kit's three grounds, and a slide never paints its own

**Hard rule.** The frame paints the ground, from `src/design/ground.tsx`: the
paper ground (off-white, the azure wash in the top-right corner, two thin
deep-blue rings) under every light slide; the closing gradient (with its grain
and two rings) under every dark slide; the welcome mesh under the opener and
the Next Session signpost. A slide, a figure or a session file never draws a
wash, a blur, an orb, a dot grid or a background of its own behind content,
and never passes a `bg-*` class to `SlideBase`. The footer bar on a light slide
is flat brand blue. The hero frames (Welcome, Thank You, All the Best, Next
Session) put the white mark on stage and the words in a glass pill, static
except the greeting's letters.

Why: the user's updated template (2026-10-12), made the base template on
2026-10-14. The kit's old wash, hairline arcs, orbs and dot grid were deleted
rather than switched off, and the agenda's own blue blur went with them: a
frame that carries two grounds is a frame whose look depends on stacking
order, which `SlideBase` records happening once already.

## 42. An arrow or connector never overlaps a box, at any step

**Hard rule.** An arrow, a cursor, a pointer or a connector line starts at the
edge of one box and ends at the edge of another, or sits in a lane of its own
beside the boxes it points at. It never crosses into a box, at any build step
and in any state: before the first press, mid-run and fully revealed. Its two
ends stay attached to the right boxes.

Two places this bites:

- **A cursor that drops onto a row.** The arrow lands in a lane above the
  boxes and stops short of their top edge. A cursor that carries a label
  (`item`, `i`) needs a taller lane, and that lane is reserved on every step,
  so the row does not jump when the label first appears.
- **An arrow drawn between two boxes that move.** Route it from the edge of
  one to the edge of the other after the move, never between their old
  positions, and re-check it on the step after the move.

Fix the component that draws the arrow, never one slide's coordinates, so
every slide that uses it is fixed at once.

**Check, on the built file, before a deck is delivered:** `node
overlap-check.mjs` (in the kit since 2026-10-14) steps
every slide through every build and reports any small arrow-like `<svg>`
that overlaps a bordered box other than its own container. It must print no
findings. The other harnesses cannot see this: an arrow and a box are both
inside the frame and inside their zone.

Why: user, 2026-10-06, on Python session 19 (`Outputs/python/19_lists`),
slide 12: *"After the Next step, the arrow overlaps the boxes."* The cursor
and its `item` label dropped 16px into the box it pointed at on every pass of
the loop, and `video-safe`, `qa`, `align-check` and `mixed-align-check` all
passed the slide.

## 43. A highlight matches the bounds of the element it highlights

**Hard rule.** A glow, a ring, a tint or an outline that marks one element
takes that element's exact width and height. It never takes the width of the
column, the row or the container the element sits in. An output box 300px
wide in a 670px column glows as a 300px box.

The usual cause is a wrapper that draws the highlight around a child with a
fixed width: the wrapper stretches to its parent while the child does not.
Put the width on the wrapper (or let the wrapper shrink to the child), never
on the child alone, and do it in the component, so every call site is fixed.

**Check:** `node overlap-check.mjs` (rule 42) also measures every glow
wrapper on every step against the one element it wraps and reports any that
is more than 2px wider or taller.

Why: user, 2026-10-06, on Python session 19 (`Outputs/python/19_lists`),
slides 17 and 18: *"The green highlight currently covers the full width of
the output area instead of only the output box."* The output panel's glow
wrapper filled its column, so the same defect sat on slides 11, 16, 22 and 23
as well; one change to the shared output panel fixed all six.

## 44. The agenda is static: no step-through, no selected point, no buttons

**Hard rule.** The agenda slide shows every point at once, in its normal
style, exactly as Python session 19's agenda does
(`Outputs/python/19_lists`, `<AgendaSlide kicker={SESSION} title="Agenda"
lesson={SESSION} items={AGENDA} />` and nothing around it). On an agenda
slide there is:

- **no step-through**: no build steps, no point that appears or lights on a
  press, whatever a source spec says ("stop n lights up per press" is not
  carried);
- **no active or selected state**: no highlight box, band, panel or tint
  behind a point, no ring, fill or circle on its badge;
- **no Next or Replay buttons**: the slide advances with the deck's own
  navigation only.

The points' text, spacing and arc are the kit's (content rule 39). Never
wrap the agenda in a figure that adds any of the above.

**Check:** the agenda slide's build-step count is 0 (`revealSteps.ts`), it
holds no button, and its screenshot matches session 19's agenda in point
styling and controls. `agenda-check.mjs` passes.

Why: user, 2026-10-06, on Python session 20 (`Outputs/python/20_working_with_lists`),
slide 6, twice. First: *"Remove the blue highlight box behind the agenda
points. Match the Session 19 agenda slide."* Then, when a lit badge and the
step behaviour remained: *"Remove this behaviour completely: no active or
selected state, no highlight box, no highlight circle, and no step
animation … Remove the Next and Replay buttons."* The deck had wrapped the
kit agenda in `AgendaStops.tsx` to carry the spec's per-press agenda.

## 45. Arrow heads stay small and proportionate to the line

**Hard rule.** An arrow head is about three to four times its line's width:
a 9px head on a 2.5 to 3px connector. Never larger, on any slide. Size a
head in absolute units (`markerUnits="userSpaceOnUse"` on an SVG `<marker>`),
because the SVG default (`strokeWidth`) multiplies the marker by the line
width and silently draws heads several times too big. Fix it in the
component that draws the arrows, so every slide is fixed at once.

**Check:** on the screenshots, at a zoom, every arrow head on every slide.

Why: user, 2026-10-06, on Python session 20 (`Outputs/python/20_working_with_lists`),
every slide with an arrow: *"The arrow heads are too big. Reduce their size
across the whole deck."* The deck's one arrow engine (`figures/memory.tsx`)
used a 7-unit marker in stroke units on a 2.75px line, about 19px long.

## 46. A connector line meets its arrow head on the head's own axis

**Hard rule.** The last stretch of a connector, at least the length of its
head plus a few pixels, is straight and runs along the head's centre line,
so the line enters the head at its tip's axis. A curve that is still bending
under the head enters it off-centre. Keep the head where it is (its tip on
the box edge it points at, rule 42) and straighten the line's end, never
the other way round. Build it into the path every arrow uses (in PF 20,
`M · C · L`: the curve, then a straight `L` into the tip), not slide by slide.

**The joint, exactly** (user, 2026-10-08, Python session 27, "apply to every
slide, and add as a permanent rule"): the line ends at the centre of the
head's base. No gap between them, and no overlap: the line's end is a butt
cap at the base, never a round cap or a stretch of line running on under the
head. The head is a separate small triangle (about 9px long and 9px wide on a
3px line) whose base centre is the line's last point, so line and head share
one axis. A head that draws itself in appears once the line has reached it.

**Check:** zoom into every arrow at every build step: converging arrows, a
re-pointed arrow after it moves, and arrows that come in at an angle.

Why (the joint): user, 2026-10-08, on Python session 27
(`Outputs/python/27_sets`), slide 3's join lines and every other arrow:
*"Arrowheads must be smaller than the current size. The base of each
arrowhead must connect to the end of its connecting line with no gap and no
overlap. The line must meet the arrowhead at the center of the arrowhead's
base."* The recap drew its heads as SVG markers in stroke units (too big),
with round line caps running into the head.

Why: user, 2026-10-06, on Python session 20 (`Outputs/python/20_working_with_lists`),
slide 22: *"The arrow head is already centred on the box. The problem is
that the orange connecting line is not centred on the arrow head."* Two
arrows converging on one row landed 12px apart, and with only 26px of run
the curve was still turning under the head.

## 47. A label, annotation or callout never sits on a code box or any other box

**Hard rule.** Text placed on a slide to point at something (a callout, an
annotation, the label of a ring or highlight, a tag joined by a line) has
space of its own. It never sits on top of a code block, a terminal, a card, a
panel or any other element, at any build step. Its connector line may reach
into the box to the thing it names; the words stay outside, with a visible
gap.

When space is tight, change the layout: move the label to clear space, grow
the lane it sits in, shift or resize the box. Never let the two overlap, and
never shrink the label's type to squeeze it in.

Fix it where the label is placed (for a ring label, the `lift` that sets how
far above the ring it sits), and check the step where the label first
appears, because that is often the step where the box also moves.

**Check, on the built file, before a deck is delivered:** `node
overlap-check.mjs` (Python 22 carries the version that tests this; copy it to
the session root). It tests every absolutely placed piece of text against
every box it is not inside (bordered, ringed, a code block, any opaque
panel) at every build step, and reports any overlap above 2px. Text set
wholly inside an empty shape, such as the agenda mark, is that shape's own
label and is not flagged.

Why: user, 2026-10-07, on Python session 22 (`Outputs/python/22_functions`),
slide 16: the sentence *"This slot is called an argument"* sat on the top
edge of the code box (12px into the title bar). It was the label of a
`TokenRing` lifted 44px above `friend`, which is less than the distance to
the box's top edge. Fixed by lifting it to 74px, an 18px gap. Rule 42's check
covered arrows only, so no harness saw it.

## 49. No underlines, anywhere (the kicker's gradient divider is not an underline)

**Hard rule, every deck.** Nothing on a slide is underlined: not a word in a
sentence, not a highlighted phrase in a definition, not a heading, not a link,
and no extra decorative line under a title. Emphasis is colour and weight: a
key phrase in a definition is the brand colour, semibold. A link is told apart
by its colour and its icon, never by an underline.

**The exception that is not optional:** the template's gradient divider between
the kicker and the title (rule 33, point 3) is part of the template and is
drawn on every slide with a kicker. Never remove it, whatever a review's "no
underlines" wording seems to say.

Check: `.text-audit.mjs` (Cloud Computing Fundamentals session root) reports
any text whose computed `text-decoration-line` includes `underline`.

Why: user, 2026-10-16, review of Cloud Computing Fundamentals
(`Outputs/cloudcomputing/cloud_computing_fundamentals`): the definition
slides underlined their key phrases; "No underlines anywhere in any deck: text,
headings, links, decorative lines under titles. Treat this as a permanent
global rule for all future decks." The first pass also removed the kicker's
gradient divider; the user, the same day: "that is part of the template, don't
remove it in any case; from now on the gradient line below the kicker is a
must."
