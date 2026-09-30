# Deployment · Session 2 — "Docker File Creation"

**STATUS: SIGNED OFF 2026-08-17 · REVISED (Rev 2) 2026-08-17 after a pedagogy
review · REVISED (Rev 3) 2026-08-18 after a review of the bridge into concept 1 ·
REVISED (Rev 4) 2026-08-18 after a review of concepts 1 to 3**

## Rev 4 — the four needs, and explain before you show

The user reviewed the bridge out of concept 1 and the whole of concept 3. The deck
went from 48 slides to **52**. Where this list disagrees with any earlier rev or
with section 3, this list wins.

**1. The bridge slide stopped handing over the answer.** The slide after the
definition used to be *Your Four Needs Become the File*, a three-column table that
printed `FROM`, `WORKDIR`, `COPY` and `CMD` before any of them had been taught.
That is R7 broken at the worst possible moment: five instruction slides followed
with nothing left to reveal. It is now `c1-four-needs-one-file`, **All Four Come
From the File**, lead *To define and run app.py, the image has to be given every
one of these*. Two columns, the need and the value, both of them the room's own
answers from *What Does Running It Need*, and a tip callout that asks the question
instead of answering it: *Let us see how each of these four is provided through the
Dockerfile*. Not one keyword appears.

**2. Create the file, then ask how to write it.** The order was definition →
bridge → anatomy → create the file, so the anatomy slide taught the shape of a line
in a file that did not exist yet. `c1-create-dockerfile` now comes first and the
anatomy slide follows it, retitled **How Do We Write It** with the lead *A
Dockerfile holds instructions, one per line, and every line has the same shape*.
The file is open and empty in front of the room when the question is asked, which
is the only order in which the question is real.

**3. Every instruction slide names the need it provides.** The five slides of
concept 2 each carry a lead that points back at the room's own list, so the keyword
arrives as an answer rather than as vocabulary:

| Slide | Lead |
|---|---|
| `FROM` | Need 1, a runtime to run on |
| `WORKDIR` | Need 2, a folder to work in |
| `COPY` | Need 3, the files and their content |
| `RUN` | Need 3 again, the packages those files ask for |
| `CMD` | Need 4, a command to start it |

Need 3 deliberately spans two slides: `COPY` puts the files in the image and `RUN`
installs what those files ask for, and splitting them across two need numbers would
invent a fifth need the room never listed. Each slide's speaker note opens on the
same link, so the instructor says it out loud even if the lead is skimmed.

**4. A handover slide between the finished file and the build.** The complete
Dockerfile is the slide the room photographs, which makes it feel like an ending.
New slide `c2-to-build`, **The File Is Done**, lead *Now we build an image from the
Dockerfile we just wrote*: two cards, what we have (six lines of plain text, and
Docker cannot run a text file) against what we need (an image), and an info callout
*The file is the recipe, not the meal*. No command appears on it; the divider that
follows now answers a question rather than announcing a topic.

**5. Concept 3 explains each command before showing it (R10).** Every command in
the section is two slides, what it does and then the transcript, so the room reads
output it has already been told how to read. The teaching cards moved off the
transcript slides onto the explain slides, where they are the content and take a
click each rather than having to land with the terminal.

| # | Slide | Shape |
|---|---|---|
| 26 | `c3-build-explain` **What Building Does** | three points, no command on screen |
| 27 | `c3-build` **docker build** | the one line, plus the `-t` and trailing-dot callouts |
| 28 | `c3-build-output` **Reading the Output** | the transcript, two callouts |
| 29 | `c3-images-explain` **Where Did the Image Go** | three cards |
| 30 | `c3-images` **docker images** | the transcript, one callout |
| 31 | `c3-run-explain` **What Running Does** | three cards |
| 32 | `c3-run` **docker run** | the transcript, one callout |
| 33 | `c3-ps-explain` **Where Did the Container Go** | three cards |
| 34 | `c3-ps` **docker ps** | both commands in one panel, one callout |

**6. There is no `docker pull` slide.** `FROM` pulls the base image as part of the
build, so the room never types `pull` in this session, and Rev 2's decision to
teach it cost a slide for a command they will not use. The slide is removed and the
fact it carried is taught where the room can see it happen: the build-output slide
gains a tip callout, *Step one was a download*, saying `FROM` fetched the base image
from Docker Hub once and the next build reuses the local copy. Downstream, the
command-summary table drops its `pull` row (four commands, not five), the practice
task reads *Run all four commands on it* / *build, then images, then run, then ps
-a, in that order*, the `docker images` slide no longer offers `pull` as the source
of its second row, and R9 in the deck header records why `pull` is absent rather
than taught.

**7. Speaker-note cross-references are now name-based, not numbered.** Rev 3
resolved nineteen stale "see slide N" references to the then-current order, and
this rev moved things again. Rather than renumber them a third time, every
cross-reference in `notes` and in the file's comments now names its target (*the
COPY slide*, *the Images Are Frozen slide*, *the full journey slide*), so the next
renumbering cannot break them. `grep -on "slides* [0-9]\+"` should return only the
one reference to slide 7, the folder-creation slide, whose position has not moved
across four revs.

Harness counts updated with the slide count: `deck.config.json` `slideCount` 50 →
**52** (one bridge slide added after concept 2, four explain slides added in
concept 3, the `docker pull` slide removed), and `src/export/revealSteps.ts` needs
regenerating.

## Rev 3 — the bridge into concept 1

The user reviewed slides 5 and 6 and raised two problems. The deck went from 48
slides to **51**. Where this list disagrees with Rev 2 or with section 3, this
list wins.

**1. "Someone else" is the wrong answer to "where did that image come from".**
The room pulled `hello-world`; the honest, memorable answer is that the image
came with Docker, ready made. Slide 5 is retitled **That Image Came With
Docker**, its second point becomes `But that image came with Docker` / *It was
ready made, and none of it was your application*, and slide 3's recap pill drops
the same phrasing (`all built by someone else` → `all of them built already`) so
the deck does not plant the wording two slides before it is corrected. The
question in the note is unchanged: it is still the question of the session.

**2. The gap named no goal, and the analogy arrived before the need for it.**
Rev 2's order was gap → create the folder → file contents → divider → recipe
card. So the room typed a script with no stated destination, and then met a
recipe analogy for a problem it had not yet felt. Three slides fix that, all of
them before the divider, all of them in the "The Dockerfile" rail:

- **New, before "Create the Folder"** — `c1-goal`, *Let Us Run Our Own Script*.
  `ContentSlide` + a three-node `FlowChart`: `Write a script` → `Hand it to
  Docker` → `It runs in a container`, plus a tip callout, *Everything from here
  to the end of the session is these three boxes, one at a time*. It says "hand
  it to Docker" and not "build an image", because R7 holds: the need for an image
  is earned two slides later.
- **New, after "What Goes In Them"** — `c1-need-an-image`, *Now We Need an
  Image*. Two cards, past against present: last session the image already
  existed, so we pulled it and ran it; this session no image holds our `app.py`,
  so one has to be prepared. Info callout: *Docker never runs a file*, it runs an
  image, so `app.py` has to be inside one first. This is the hinge of the
  session, from consuming an image to producing one.
- **New, after that** — `c1-what-it-takes`, *What Does Running It Need*. No lead
  and no sub-lines: the title asks, and an ordered `StepList` reveals the four
  answers one click at a time, one line each, so the room can finish each line
  before it appears. `We require a Python runtime (Python)` · `A directory to
  store the files (/app)` · `Files and their content (app.py and
  requirements.txt)` · `Command to run (python app.py)`. The parenthesised half
  is set in mono, because each one is the argument of the instruction that
  carries it in concept 2. Order is the teaching beat, because each need is
  useless without the one above it.

Those four needs are the spine of concept 2, in the order the Dockerfile is
written, and **not one keyword is named on the slide** (R7): each collects its
name on the slide that teaches it. The recipe-card and recipe-to-Dockerfile
slides are unchanged, and now land on a room that has already worked out what an
image has to carry.

**3. The session 3 title is settled.** The next-session frame was left blank at
sign-off because the topic was not decided. It is now **Docker Compose
Multi-Container**, so the name is on the frame and its speaker note carries the
reason the room will feel it: one Dockerfile and one image stop being enough the
moment a project is a backend, a frontend and a database that have to come up
together. R3 still holds for the teaching slides; the handover frame is the one
place whose job is to name what comes next.

**4. Two Quiz Time beats, not three, and no feedback frame.** The quiz that sat
after the mistakes section (the layer-cache question) is gone, and a new one sits
immediately before the takeaways asking RUN against CMD, which is the pair the
room most often has backwards at the end of this session. The section-4 quiz is
untouched, so the deck now holds exactly two: one before the fourth divider, one
before the takeaways. The `FeedbackSlide` frame is removed with its import.

**5. Speaker-note cross-references were all stale.** Nineteen "see slide N"
references in `notes` and comments had been written against the Rev 1 42-slide
numbering and were never updated at Rev 2, so most of them pointed at the wrong
slide even before this revision moved things again. Every one is now resolved to
the current order. Anyone renumbering the deck again should re-check them:
`grep -on "slides* [0-9]\+" src/decks/dockerFileCreationDeck.tsx`.

Harness counts updated with the slide count: `deck.config.json` `slideCount` 48 →
**50** (three added before the divider, one quiz added, one quiz and the feedback
frame removed), and `src/export/revealSteps.ts` regenerated.

## Rev 2 — what the pedagogy review changed

The user reviewed the built deck and raised four problems. All four were real,
and the deck went from 42 slides to **48**. Sections 3 and 7 below are the Rev 1
plan and are kept for the record; where they disagree with this list, this list
wins.

**1. The four commands were never taught, and the recap lied about it.**
The TR's recap block lists `docker pull`, `docker run`, `docker ps` and
`docker images` as known. Session 1's deck contains exactly two commands,
`docker --version` and `docker run hello-world`. Three of those four had never
been explained to this room.

- The recap's fourth pill now says what actually happened last session.
- `docker pull`, `docker images`, `docker run` and `docker ps` are **taught in
  section 3, one per slide**, each placed where the session first needs it, so
  every command answers a question the room has just asked: the build output says
  it downloaded something (*pull*), it says it built something (*images*), an
  image does not run itself (*run*), and the container printed and vanished
  (*ps*). The old combined "Image, Then Container" slide is gone.
- A closing reference slide, "The Commands You Used", now pairs with the
  instruction table. The pairing is the point: beginners try to type `FROM` into
  a terminal and put `docker build` inside the Dockerfile, so the two tables sit
  next to each other with a "where you type it" split.

**2. Files were handed over as contents, with no create step and no location.**
"Add this to `app.py`" assumes a file that does not exist. Two new slides, and a
new `FileTree` figure that appears each time a file is added:

- **Create the Folder** before any file contents.
- **Create the Dockerfile** after the definition and anatomy, before section 2
  writes a single line into it.
- Every `CodeBlock` panel is now titled with its folder, and the `.dockerignore`
  slide names its folder too.

**3. The analogy slide named all the instructions before any were taught.**
"Start from a base image (`FROM`)" put four keywords on screen before the room
knew what an instruction was, so each instruction slide had nothing left to
reveal. The analogy's right column is now plain language ("Start from something
that already exists"), and the anatomy slide no longer enumerates the five
keywords either. Recorded as **R7** in the deck header.

**4. The workspace is `nxttrendz/frontend` and `nxttrendz/backend`.**
Rev 1 put a bare `app.py` at `C:\nxttrendz`, which collides with the real
project and, worse, would make `COPY . .` sweep both apps into the image. Today's
demo now lives in **`C:\nxttrendz\docker-demo`**, a sibling of the two apps, and
the `FileTree` shows it in that context. Every prompt reads
`PS C:\nxttrendz\docker-demo>`. The `COPY . .` slide is reframed honestly: it
costs nothing in the demo folder, and matters the moment the same Dockerfile is
pointed at `nxttrendz\backend`.

Four further TR patches (P6 to P9) were applied for these; see §6.

Decisions taken at the gate (see §5 for what was asked):

1. **NEXT_UP is left blank.** Slide 41 renders the next-session breaker with the
   kicker only and no title, to be filled in when session 3 is settled.
2. **One instruction per slide is kept.** 42 slides, concept 2 runs to seven.
3. **All five TR patches applied** to the TR doc on 2026-08-17, before generation.
4. **Slide 25 keeps the prediction quiz.** Documented as a deliberate exception to
   slide-content-rules §9: the room is asked to guess, and slide 35 is the answer.

| Input | Value |
|---|---|
| `SESSION_NAME` | `Docker File Creation` (footer + kicker on every content slide) |
| `COURSE` | `React + Django Integration · Deployment` |
| `TR_DOC` | `/home/nxtwave/django/Integration project/deployment/Docker_file_Creation_session_2.md` |
| `PROJECT` | `Web Slides/django_deployement_course/deployement_session_2` (copied from `deployement_session_1_v2`, same Evolve theme) |
| `NEXT_UP` | `Makefile` — **OPEN QUESTION, see §5** |
| Slide count | **42** |

Built on the signed-off Session 1 v2 rendering layer. No new slide *types* are
needed; one existing component gets a small extension (§4).

---

## 1. Concept map

Five concepts, one divider each, every TR section mapped. Per
`slide-plan-structure-preferences`, one divider per concept beats the
"≤4 concepts" guideline; the Dockerfile-instruction run beats the "2–4 slides"
guideline under slide-content-rules §5 (one item per slide for a series the
learner weighs individually).

| # | Concept (agenda wording) | TR sections | Content slides |
|---|---|---|---|
| 1 | The Dockerfile | §2 (2.1 recipe, 2.2 definition, 2.3 anatomy) | 4 (+2 bridge) |
| 2 | Writing the Dockerfile | §3 (FROM → CMD, RUN vs CMD, complete file) | 7 |
| 3 | Build and Run | §4 (build, output, images, run, journey) | 4 + quiz |
| 4 | Layers and the Build Cache | §5 (layers, cache, ordering rule) | 4 |
| 5 | .dockerignore and Mistakes | §6 (COPY . ., .dockerignore, error 1, error 2) | 4 + quiz |

TR §6.5 (instruction summary) lands in the closing frame as a reference slide,
because it summarises all five concepts rather than belonging to one.

**Scope discipline (R1, carried from Session 1).** This session is still
Problem 1 (runs anywhere). No slide shows a server, a public URL, a port
mapping or inbound traffic. The application packaged here is deliberately a
three-line Python script, exactly as the TR frames it, so nothing pulls the room
toward hosting.

**R3 still holds.** No tool is named for a later session in rendered copy. The
TR's forward references to "the Jenkins sessions" and "the Makefile session"
become "later in this course" on the slide; the tool names live in speaker notes
only. The one exception is the next-session teaser frame, which by convention
names the next topic (§5).

---

## 2. Fixed frame

| # | Slide | Component | Content |
|---|---|---|---|
| 1 | Brand | `BrandSlide` | `greeting="Welcome"`, lesson = session name |
| 2 | Welcome | `WelcomeSlide minimal` | Kicker + `Docker File Creation` |
| 3 | Recap | `RecapSlide` | The TR's own recap block, 4 pills: `Docker packages app plus dependencies into an image` · `A running instance of an image is a container` · `Ready-made images come from Docker Hub` · `docker pull · run · ps · images` |
| 4 | Agenda | `AgendaSlide` | The five concepts from §1, each with a one-line sub |

Closing frame: **39** Instruction summary → **40** Key takeaways → **41**
Practice → **42** Feedback → next-session breaker → Thank you. (Numbering in §3
is authoritative.)

---

## 3. Slide-wise plan

Every row records: purpose · component · exact content · visual and why it fits ·
animation · assets. `SESSION` = `Docker File Creation` in the footer of all 42.

### Bridge into concept 1 (section rail: "The Dockerfile", before the divider)

Session 1 set the precedent: the problem is felt before the section that answers
it is announced.

**5. The Question for Today** · `ContentNoteSlide`
- Purpose: turn last session's win into this session's gap.
- Title `Someone Else's App`. Points:
  - `hello-world proved Docker works` / sub `You pulled an image and ran a container from it`, icon `check`
  - `But it was not your application` / sub `Every image so far was built by somebody else`, icon `warning`
- Note (`tip`, "The question for this session"): **How do we package our own application into an image?**
- Visual: none. The question is the slide; a figure would dilute it.
- Animation: `points` immediate, note as the one `Step` (genuine teaching beat).
- Assets: none.

**6. The App We Will Package** · `ContentSlide` + two `CodeBlock`s
- Purpose: make the thing being packaged concrete and deliberately tiny.
- Title `The App We Package`, lead `A three line Python script, so nothing competes with Docker itself`
- Left `CodeBlock filename="app.py" language="python"` — the three `print` lines verbatim.
- Right `CodeBlock filename="requirements.txt"` — the comment line, plus a `Callout kind="info" asStep={false}`: `Empty today. Real projects always have one, and the Dockerfile treats both the same way`
- Visual: the files themselves. `CodeBlock` (not `Terminal`) is correct here: these are files, not commands (slide-content-rules §3).
- Animation: both blocks in one `RevealGroup`, parallel with the lead.
- Assets: none. **TR patch P3 applies** to the third print line (§5).

### Concept 1 — The Dockerfile

**7. Divider** · `SectionBreakerSlide index={1} title="The Dockerfile"`
- No illustration: no in-repo scene depicts a Dockerfile, and slide-content-rules §8 forbids filling with an unrelated one. Typographic, like Session 1's divider 1. Recorded as outstanding asset work.

**8. A Recipe Card** · `ContentSlide` + `StepList`
- Purpose: install the analogy before the technical term.
- Title `A Recipe Card`, lead `Anyone with the card produces the same dish, in any kitchen`
- `StepList` of the TR's four recipe steps: `Start with a base` / `Take a pan of boiling water` · `Add ingredients` / `Add rice, then vegetables` · `Perform steps in order` / `Simmer for ten minutes` · `Serve` / `Garnish and serve hot`
- Visual: the numbered rail *is* the ordering claim, which is the half of the analogy that matters (top to bottom, in order).
- Animation: `StepList` steps are click-gated by default; here the ordering is the beat, so that is kept.

**9. Recipe to Dockerfile** · `ContentSlide` + `AnalogyMap`
- Purpose: pay the analogy off, one row per instruction the room is about to meet.
- Title `Recipe to Dockerfile`. `AnalogyMap leftLabel="Recipe card" rightLabel="Dockerfile"`, rows verbatim from the TR table: `Pan of boiling water` → `Start from a base image (FROM)` · `Add rice and vegetables` → `Copy your code in (COPY)` · `Simmer for ten minutes` → `Install dependencies (RUN)` · `Garnish and serve` → `Command to start the app (CMD)` · `Same dish in any kitchen` → `Same image on any machine`
- Visual: `AnalogyMap` exists for exactly this shape and staggers on entry, no clicking.
- Note: this slide *previews* five instruction names without defining them, which is intentional. The row labels are the recipe's words; concept 2 defines the keywords.

**10. What Is a Dockerfile** · `ContentNoteSlide noteFirst`
- Purpose: the definition, once, in the deck's definition frame (same shape as Session 1's Docker definition).
- Note first (`note`, title `Dockerfile`): `A plain text file of step by step instructions that Docker reads top to bottom to build an image`
- Points: `Named exactly Dockerfile` / sub `Capital D, no extension, no .txt`, icon `warning` · `Lives in your project root` / sub `Next to your code, where docker build can see it`, icon `target`
- Visual: none; the callout is the exhibit.

**11. One Line, One Instruction** · `ContentSlide` + `CodeBlock`
- Purpose: the anatomy, so the next seven slides read as one pattern repeating.
- Title `One Line, One Instruction`
- `CodeBlock filename="Dockerfile" language="dockerfile"` showing `INSTRUCTION  arguments`
- Points (immediate): `INSTRUCTION is an uppercase keyword` / sub `FROM, WORKDIR, COPY, RUN, CMD`, icon `code` · `arguments are what it acts on` / sub `A file, a folder, a command`, icon `arrow` · `Five instructions containerise most Python apps` / sub `One per slide from here`, icon `bulb`, tone `accent`
- Assets: needs the `CodeBlock` keyword extension (§4).

### Concept 2 — Writing the Dockerfile

**12. Divider** · `SectionBreakerSlide index={2} title="Writing the Dockerfile"`

Slides 13–18 are **one instruction per slide** (slide-content-rules §5). They
share one shape, so the room learns the pattern rather than five layouts:

- kicker `Writing the Dockerfile`, title = the instruction word plus its job
- the **same growing `CodeBlock`** (`filename="Dockerfile"`), one line longer
  each slide, with `highlight` on the new line
- 2 points on the left, at most one `Callout`
- the code block and the points reveal together (`immediate`, `asStep={false}`)

The growing file is the deck's spine: by slide 18 the room has watched the
complete Dockerfile assemble line by line, which is why slide 19 can just show it.

| # | Title | New line (highlighted) | Points | Callout |
|---|---|---|---|---|
| 13 | `FROM: Choose the Base` | `FROM python:3.14-slim` | `Every Dockerfile starts here` / `The image you build on top of` · `Nobody builds from zero` / `A recipe starts with a pan, not with forging one` | `note` "Reading the name": `python` is the official image, `3.14` is the version this course uses, `-slim` is the minimal variant |
| 14 | `WORKDIR: Pick a Folder` | `WORKDIR /app` | `Creates /app inside the image` / `Not on your machine` · `Every later instruction runs from there` / `Like doing cd /app once, permanently` | none |
| 15 | `COPY: Bring the Code In` | `COPY requirements.txt .` | `Two arguments: source, then destination` / `From your project folder, into the image` · `The dot is the current folder` / `/app, because WORKDIR set it`  | `tip` "Why only this one file": copying requirements before the code is deliberate, and concept 4 is the reason |
| 16 | `RUN: Install Dependencies` | `RUN pip install -r requirements.txt` + `COPY . .` | `RUN executes while the image is built` / `Here it installs every package in requirements` · `COPY . . brings everything else` / `All your project files, into /app` | none |
| 17 | `CMD: What Runs on Start` | `CMD ["python", "app.py"]` | `Declares what a container runs when it starts` / `Nothing happens at build time` · `Written as a list, one string per word` / `python is the program, app.py is the argument` | none |
| 18 | `RUN vs CMD` | (no new line; the file is complete and unhighlighted) | see below | see below |

**18. RUN vs CMD** · `ContentSlide` + `DataTable`
- Purpose: the confusion the TR calls out by name, given its own slide.
- `DataTable columns=[" ", "RUN", "CMD"]`, rows verbatim from the TR: `Executes` / `While building the image` / `When a container starts` · `Used for` / `Installing packages, setup` / `Starting the application` · `How many` / `Many per Dockerfile` / `Only one, the last one wins` · `In the analogy` / `Cooking steps` / `Serve hot, done at the table`
- `Callout kind="success" title="A memory hook"`: **RUN builds the kitchen, CMD serves the dish**
- Visual: `DataTable`, because this slide teaches *by* the column alignment; `CardGrid` would break the comparison into tiles. Same reasoning as Session 1's tables.
- Animation: table staggers on entry; the memory hook is the one `Step`.

**19. The Complete Dockerfile** · `ContentSlide` + `CodeBlock`
- Title `The Complete Dockerfile`, lead `Six lines, read top to bottom`
- Full six-line `CodeBlock filename="Dockerfile"`, no highlight, `maxHeight` capped.
- One narration line beneath, as a `Callout kind="note" asStep={false}`: `Start from Python 3.14, work in /app, bring in the requirements list, install them, bring in the code, and run the app when started`
- Visual: the file, full size and centred. This is the slide the room photographs.

### Concept 3 — Build and Run

**20. Divider** · `SectionBreakerSlide index={3} title="Build and Run"` with `mark="/assets/tech/docker-white.svg"`

**21. docker build** · `ContentSlide` + `Terminal` + `Callout`
- Purpose: the command, and the trailing dot that breaks it.
- `Terminal path="C:\nxttrendz"` with one `cmd` line: `docker build -t nxttrendz-app .`
- Points (immediate): `-t names the image` / sub `The tag you will type in every later command`, icon `target` · `The dot is the build context` / sub `The folder Docker reads the Dockerfile and the COPY files from`, icon `arrow`
- `Callout kind="warning" title="The trailing dot is not optional"`: leaving it off gives `ERROR: "docker buildx build" requires exactly 1 argument`
- Visual: `Terminal` with the `PS C:\nxttrendz>` prompt (slide-content-rules §3). One panel, one command.
- Assets: **outstanding capture C1** (§6).

**22. Reading the Output** · `ContentSlide` + `Terminal`
- Purpose: connect the five Dockerfile lines to the five numbered build steps.
- `Terminal` with the TR's build transcript, `[1/5]`…`[5/5]` plus the naming line, `Building 12.4s (10/10) FINISHED` first.
- Lead: `Each instruction became a numbered step, in order`
- One `Callout kind="info" asStep={false}`: `Five instructions, five steps, exactly the order you wrote them in`
- Visual: the transcript itself. Nothing to draw; the numbering is the teaching.
- Assets: **outstanding capture C2**.

**23. Image, Then Container** · `ContentSlide` + `Terminal`
- Purpose: the two verification commands, in one terminal because they are typed in one terminal (§3 covers *different* terminals, not sequential commands).
- `Terminal` lines: `docker images` → the `REPOSITORY / TAG / IMAGE ID / CREATED / SIZE` header and the `nxttrendz-app latest … 156MB` row; blank; `docker run nxttrendz-app` → the three printed lines, last one `kind="ok"`.
- Points (immediate): `docker images proves the image exists` / sub `Built once, sitting on your machine`, icon `database` · `docker run creates a container from it` / sub `It prints, then exits`, icon `play`
- Assets: **outstanding captures C3, C4**.

**24. The Full Journey** · `ContentSlide` + `FlowChart`
- Purpose: one picture for the whole build-and-run loop, ready to be recalled in concept 5.
- `FlowChart` horizontal, 4 nodes: `Your files` / `app.py · requirements.txt · Dockerfile` · `docker build` / `reads the recipe` · `Image` / `nxttrendz-app` · `docker run` → `Container` / `prints, then exits`
- `Callout kind="tip" title="You have met this shape before"`: `makemigrations` writes the instructions and `migrate` executes them. The Dockerfile is the instructions, `docker build` executes them
- Visual: `FlowChart` is the kit's linear-sequence figure and this is a linear sequence. The Django parallel is the anchor the TR asks for.

**25. Quiz Time** · `QuizTimeSlide`
- The deck announces only; the question is asked from the quiz tool, as in Session 1.
- Notes carry the question: *you change one line in `app.py` and run `docker run nxttrendz-app`. What do you see?* Answer: the old output, because the image was built from the old code. (Concept 5 slide 37 is where the deck teaches this, so this quiz is a *prediction*, deliberately asked before the answer. If that reads as testing untaught material under slide-content-rules §9, swap in: *which instruction runs when the container starts, and how many of them may a Dockerfile have?*)

### Concept 4 — Layers and the Build Cache

**26. Divider** · `SectionBreakerSlide index={4} title="Layers and the Build Cache"`

**27. Every Instruction Is a Layer** · `ContentSlide` + `LayerStack`
- Purpose: the mental model the cache depends on.
- `LayerStack stepped={false} width={330}` — top layer first, exactly the TR's stack: `CMD ["python", "app.py"]` · `COPY . .` (note `your code`) · `RUN pip install` (note `packages`) · `COPY requirements.txt .` · `WORKDIR /app` · `FROM python:3.14-slim` (note `base`), caption `Six instructions, six stacked snapshots`
- Points (immediate): `An image is not one solid block` / sub `Each instruction saves a snapshot on top of the last`, icon `database` · `The stack is built bottom up` / sub `FROM at the base, CMD at the top`, icon `arrow`
- Visual: `LayerStack` already exists for this exact figure (Session 1 used it for OS/runtime/code). Reused with instruction labels, `stepped={false}` so it lands with the text (slide-content-rules §6).

**28. Rebuild Is Instant** · `ContentSlide` + `Terminal` + two `StatTile`s
- Purpose: the payoff, measured.
- `Terminal`: `docker build -t nxttrendz-app .` then the `CACHED [2/5]`…`CACHED [5/5]` lines, each `kind="ok"`, and `Building 0.8s (10/10) FINISHED`
- Two `StatTile`s beside it: `12.4s` / `first build` and `0.8s` / `nothing changed`
- Visual: the transcript plus the two numbers. The numbers are the claim; the transcript is the evidence.
- Assets: **outstanding capture C5**.

**29. When a Layer Changes** · `ContentNoteSlide noteFirst`
- Purpose: state the single rule the whole concept turns on, alone on a slide.
- Note first (`warning`, title `One rule governs the cache`): `When a layer changes, that layer and every layer after it must be rebuilt`
- Points: `Docker reuses a layer whose inputs did not change` / sub `That is what CACHED means`, icon `check` · `A changed layer invalidates everything below it in the file` / sub `Order therefore decides what stays cached`, icon `warning`

**30. Why COPY Order Matters** · `ContentSlide` + `DataTable`
- Purpose: resolve the tease from slide 15.
- `DataTable columns=["Instruction", "Requirements first", "Copy everything first"]`, rows: `COPY requirements.txt .` / `CACHED` / `REBUILT, code changed` · `RUN pip install` / `CACHED` / `REBUILT, reinstalls every package` · `COPY . .` / `REBUILT` / `REBUILT`
- `Callout kind="success" title="Rule of thumb"`: `Order instructions from least changing at the top to most changing at the bottom`
- Second, immediate `Callout kind="info" asStep={false}`: `Code changes daily, requirements change rarely. Later in this course this image is rebuilt on every code push, and cache friendly ordering is the difference between a ten second and a ten minute build`
- Visual: `DataTable` — the teaching is the column comparison. Tool names for that later stage stay in notes (R3).

### Concept 5 — .dockerignore and Mistakes

**31. Divider** · `SectionBreakerSlide index={5} title=".dockerignore and Mistakes"`

**32. COPY . . Copies Everything** · `ContentSlide` + `CardGrid cols={2}`
- Purpose: name the cost of the convenience instruction from slide 16.
- Four cards, one per unwanted path: `env/` / `The virtual environment. Huge, and pointless: the image is the environment` · `.git/` / `Your entire version history` · `__pycache__/` / `Compiled Python cache` · `db.sqlite3` / `Your local development database`
- Lead: `COPY . . means everything, including what should never enter the image`

**33. .dockerignore** · `ContentSlide` + `CodeBlock` + `Callout`
- `CodeBlock filename=".dockerignore"` with the TR's five lines.
- Points (immediate): `Sits next to the Dockerfile` / sub `Same folder, same as .gitignore does`, icon `target` · `Listed paths are excluded from COPY` / sub `Smaller images, faster builds, no junk baked in`, icon `check`
- `Callout kind="tip" asStep={false}`: `You already use .gitignore. This is the same file, for docker build`

**34. Mistake One: Nothing to Run** · `ContentSlide` + `CodeBlock` + `Terminal`
- Purpose: the deliberate error, asked as a prediction.
- Title `Nothing to Run`, lead `The build succeeds. Predict what happens when you run it`
- `CodeBlock filename="Dockerfile"` with only `FROM` / `WORKDIR` / `CMD`.
- `Terminal`: `docker run nxttrendz-app` → `python: can't open file '/app/app.py': [Errno 2] No such file or directory`
- `Callout kind="warning" title="Why the build did not catch it"` as the one `Step`: `CMD is not executed at build time, so the build has no way to notice the missing file. The COPY line is the fix: the code must be in the image before CMD can run it`
- Animation: the code and the terminal land together; only the explanation is gated, so the room gets to predict.

**35. Mistake Two: Images Are Frozen** · `ContentSlide` + `Terminal` + `Callout`
- Purpose: the single most common beginner loop error.
- Title `Images Are Frozen`, lead `You edit app.py, then run the container again`
- `Terminal`: `docker run nxttrendz-app` → the **old** three lines.
- `Callout kind="warning" title="Still the old message"` (immediate): `docker run uses the image, and the image was built from the old code. Editing files on your machine changes nothing inside an image that already exists`
- Second `Terminal` beneath, or a two-line `cmd` block in the same panel: `docker build -t nxttrendz-app .` then `docker run nxttrendz-app`, captioned `The fix: rebuild, then run`
- `Callout kind="success" title="The rhythm of working with Docker" asStep`: `edit → rebuild → run`. Typing it repeatedly gets tedious, and automating exactly this comes later in the course
- Assets: **outstanding capture C6**.

**36. Quiz Time** · `QuizTimeSlide`
- Notes carry the question: *you add one package to `requirements.txt` and rebuild. Which layers come back CACHED?* Answer: `FROM` and `WORKDIR` only. `COPY requirements.txt .` changed, so it and everything after it rebuilds, including `pip install`.

### Closing frame

**37. The Five Instructions** · `ContentSlide` + `DataTable`
- Purpose: one reference slide, TR §6.5 verbatim. The slide the room screenshots.
- `DataTable columns=["Instruction", "Purpose", "Executes"]`, five rows: `FROM` / `Choose the base image, must be the first line` / `Build time` · `WORKDIR` / `Set the working folder inside the image` / `Build time` · `COPY <src> <dest>` / `Copy files from your machine into the image` / `Build time` · `RUN <command>` / `Execute a command, for example install packages` / `Build time` · `CMD ["prog", "arg"]` / `Declare the container's start command, one per file` / `Container start`
- Highlight the `CMD` row: it is the only one that is not build time, which is the distinction slide 18 spent a whole slide on.

**38. Key Takeaways** · `KeyTakeawaysSlide`
- The five agenda concepts, verbatim and in order: `The Dockerfile` · `Writing the Dockerfile` · `Build and Run` · `Layers and the Build Cache` · `.dockerignore and Mistakes`
- Different UI from the agenda, same five items (SLIDE_WORKFLOW stage 2.5).

**39. Practice** · `PracticeSlide`
- Session-agnostic frame, lifted from Session 1 unchanged except the tasks:
  `Write the Dockerfile from memory` / `Six lines, no notes` · `Build and run it` / `Then change one print line and do it again` · `Add a .dockerignore` / `Check the image size before and after`

**40. Feedback** · `FeedbackSlide`

**41. Next session** · `SectionBreakerSlide` with **no index** (five numbered
sections, and this is not a sixth), `kicker="Next session"`, `title` = the
NEXT_UP topic (§5).

**42. Thank you** · `ThankYouSlide`

---

## 4. Code changes

**As built (2026-08-17), five changes rather than the one predicted.** Four were
found by rendering, which is why the workflow verifies that way:

1. **`src/ui/CodeBlock.tsx`** — Dockerfile instructions added to `KEYWORDS`
   (predicted, see the reasoning below).
2. **`src/slides/RecapSlide.tsx`** — the mascot now sits bottom-aligned at 66%
   instead of centred at 78%. Its column straddles x=913 and at the old size the
   figure reached y≈115, so `video-safe.mjs` reported it 372px inside the
   reserved instructor-video rectangle. Session 1 had no recap slide, so this
   kit component had never been checked against that rule.
3. **`qa.mjs`** — the per-slide settle wait went from 700ms to 1800ms.
   `DataTable` times its rows off the header, so the last row of a four-row table
   arrives at about 1.5s; every table slide was being screenshotted with a header
   and one row over an empty panel. The overflow numbers were unaffected.
4. **`workflow/export/build-reveal-steps.mjs`** — new. `src/export/revealSteps.ts`
   said to regenerate it with `build-slide-module.mjs`, and that script does not
   exist in the repo, so the host's per-slide build-step counts had no way to be
   refreshed and were still Session 1's 35 entries. The new generator drives the
   real player with **Ctrl+ArrowRight** (a plain arrow cuts to the next slide and
   reports 0 steps for everything) and special-cases the final slide, which
   cannot advance and otherwise reports the press ceiling.
5. **Slides 13 and 15** moved from `ContentNoteSlide` to `ContentSlide`. With a
   header, bullets, a code block *and* a note, slide 15 ran 47px past the frame.
   The note content works better as a third bullet, and it makes all five
   instruction slides one component instead of two.

The predicted change, and why it was needed:

1. **`src/ui/CodeBlock.tsx`** — add the Dockerfile instruction keywords to
   `KEYWORDS` (`FROM`, `WORKDIR`, `COPY`, `RUN`, `CMD`, plus `ENV`, `EXPOSE`,
   `ENTRYPOINT` for completeness). Eleven slides render a Dockerfile as their
   main exhibit; with no dockerfile keywords in the highlighter every instruction
   renders as plain text, and the instruction word is the thing being taught.
   Uppercase keywords only, so no Python or JS token changes behaviour.

Everything else is content in a new `src/decks/dockerFileCreationDeck.tsx` plus a
three-line `src/App.tsx` swap. Session 1's deck file stays untouched in its own
project.

Also to update in the new project: `qa.mjs`, `video-safe.mjs` and `preview.mjs`
slide-count arguments (37 → 42), the `build:html` output filename
(`deployment-session-2.html`), `package.json` name, `CLAUDE.md` header, and
`README.md`.

**Not needed:** no new slide type, no new `src/ui` component, no new
illustration. Session 1's `ContainerJourney`, `MachineBoundary`, `LayerStack`,
`AnalogyMap`, `DataTable`, `Terminal`, `CodeBlock`, `FlowChart` and `StatTile`
cover every figure above. `ContainerJourney` and `MachineBoundary` are **not**
reused: they encode Session 1's problem, and slide-content-rules §8 forbids
placing an asset that depicts a different concept.

---

## 5. Decisions I need from you

1. **NEXT_UP.** The TR twice points forward ("the Makefile session automates
   exactly this", "the Jenkins sessions later"), so slide 41 is drafted as
   `Makefile`. Confirm, or give me the real session 3 title.
2. **Slide 25's quiz question.** As drafted it asks the room to *predict* the
   frozen-image behaviour that slide 35 later teaches. That is good pedagogy but
   it does test untaught material, which slide-content-rules §9 warns against.
   Keep the prediction, or use the RUN-vs-CMD fallback recorded in the row?
3. **Slide count.** 42 against Session 1's 37, driven by the seven
   one-instruction-per-slide frames. Happy with that, or should slides 13–17
   collapse to three (FROM+WORKDIR, COPY+RUN, CMD)?

---

## 6. TR patches proposed

Per `slide-plan-structure-preferences`, the TR gets healed rather than worked
around. Each is a small edit to
`Docker_file_Creation_session_2.md`; say the word and I will apply them.

| ID | Where | Problem | Patch |
|---|---|---|---|
| P1 | 10 code fences across §3–§5 | Base image is `python:3.14-slim` in four places and `python:3.10-slim` in six, in the *same* growing file | Standardise on **`python:3.14-slim`** everywhere. Session 1 already told the room "you are on Python 3.14", and §3.1's own table says `3.14` "matches the version our course uses" |
| P2 | §4 onward | Image is tagged `ecommerce-app` while the app prints `nxttrendz…` and Session 1's terminals use `C:\nxttrendz` | Retag to **`nxttrendz-app`** throughout, so the deck, the prompt path and the output all name one project |
| P3 | §1 `app.py` | Source says `print("nxttrendz frontend Starting..")` (capital S, two dots) but §4's `docker run` output shows `nxttrendz frontend starting...` | Make the source line `print("nxttrendz frontend starting...")`. A transcript that does not match its source undermines every other transcript in the session |
| P4 | §6.4 | The "still the old message" output drops the middle line, so it looks like *two* things changed rather than none | Show all three original lines, unchanged, and state in prose which line was edited |
| P5 | headings | Numbering is broken: `## 2` → `## Writing the Dockerfile` → `### 3.2`, and `##.dockerignore` has no space | Renumber §2–§6 consecutively and add the missing space. Cosmetic, but the deck's section rail is generated by reading these |

### Rev 2 patches, applied 2026-08-17

| ID | Where | Problem | Patch |
|---|---|---|---|
| P6 | Recap block | Lists four docker commands as known. Session 1 taught `docker --version` and `docker run hello-world` and nothing else | Recap now states what Session 1 actually covered, plus an explicit note that `pull`, `images` and `ps` are **new** and must not be presented as revision |
| P7 | §1 | Gives file contents with no create step and no location, and assumes a project root that does not exist | New §1.1 "Create the folder" (`C:\nxttrendz\docker-demo`, a sibling of `backend` and `frontend`, with the folder tree) and §1.2 "Create the two files", both paths fully qualified |
| P8 | §2 | The Dockerfile is defined and then written into, but never created | New §2.3 "Create it now, before writing anything into it", with the tree, the whale-icon check and the `Dockerfile.txt` trap |
| P9 | §4 | The four commands appear only as recap bullets and as bare usage inside §4.2 and §4.3 | New §4.3 "The Four Commands" teaching `pull`, `images`, `run` and `ps` in order with real output, plus §6.6 "Command Summary". §2.1 and §2.4 also stop naming the instruction keywords early |

Nothing in the TR is now missing for this plan.

---

## 7. Assets

No screenshots go on any slide in this deck. Every command and every transcript
renders through `src/ui/Terminal.tsx`, per slide-content-rules §3.

The transcripts above are **quoted from the TR, not captured**, and are recorded
as outstanding capture work in `workflow/assets-manifest.md`:

| ID | Slide | Command to capture |
|---|---|---|
| C1 | 21 | `docker build -t nxttrendz-app .` (first run, full timing) |
| C2 | 22 | the same build's `[1/5]`…`[5/5]` transcript |
| C3 | 23 | `docker images` |
| C4 | 23 | `docker run nxttrendz-app` |
| C5 | 28 | the no-change rebuild, showing `CACHED` on every step |
| C6 | 34, 35 | the two deliberate errors |

**Blocker, carried from Session 1:** Docker Desktop cannot run on the capture
machine (Hyper-V/HCS is unavailable inside VirtualBox), which is why Session 1's
`hello-world` output is still TR-quoted too. Until that is resolved these six
stay quoted. The version strings and timings are therefore illustrative, and the
speaker notes say so on each slide.

If a machine that can run Docker becomes available, capturing C1–C6 in one
sitting replaces every quoted transcript in the deck with a real one, and
nothing else has to change: `Terminal` takes the same lines either way.
