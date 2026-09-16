---
name: slide-content-rules
description: Hard content, wording, animation and chrome rules for NxtWave/NIAT session slide decks. Use whenever writing, editing, or reviewing slide copy, deck source under a session project (src/decks/*.tsx), slide plans in <course>/session_plans/<session>/plan.md, slide components in src/ui or src/slides, or terminal/command/table/illustration content on a slide. Covers banned punctuation, banned words, terminal rendering, problem sequencing, one-idea-per-slide, parallel text-and-visual reveal, deck chrome colour, illustration honesty, technology logos, the central asset library, and registering approved slide types.
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

This beats the 2–4 content slides per concept guideline. Pacing and one-idea-per
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

## 31. Every code panel says exactly where the code lives or runs

**Hard rule.** A `Terminal` already carries its `PS C:\path>` prompt (rule 3).
This extends the same obligation to every other panel that shows code or text
the learner will see:

- A `CodeBlock` names the **file path** (`backend/Dockerfile`) or the **UI
  location** (`Jenkins → nxttrendz-build-test → Configure → Pipeline → Script`).
  Never a bare label like `Pipeline script`.
- **Program output the learner reads in a browser is never rendered as a
  shell.** Deployment session 8 put Jenkins Console Output inside a VS Code
  `Terminal` with a `PS C:\nxttrendz>` prompt on three slides. That tells the
  learner they typed those lines in PowerShell. They read them in the browser,
  on the build page. It is a `Shot` of the console (rule 30), or a `CodeBlock`
  labelled with where it is on screen.

The user's words: *"whenever a code is presented the path or place must be
mentioned clearly."* "Wrong folder" and "wrong window" are the first two
errors a beginner hits, and a panel with no location invites both.
