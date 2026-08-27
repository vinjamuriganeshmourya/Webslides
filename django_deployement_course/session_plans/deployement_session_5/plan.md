<!-- cSpell:ignore nxttrendz deployement NxtWave colour colours behaviour neighbours parameterised createsuperuser dockerignore Makefile makefile PHONY winget choco GnuWin32 gunicorn runserver venv Vite -->
# Deployment · Session 5: "Automating Deployment with Makefile"

**STATUS: SIGNED OFF 2026-08-24 · GENERATION IN PROGRESS**

Approved with the defaults recorded in §7: 56 slides, both figures session-owned,
no Practice or Feedback slides, transcripts quoted from the TR, devPort 5216.
Revised once against the pedagogy and text guidelines before sign-off, see §9.

No slide is generated until this plan is approved. Section 7 is the gate.

| | |
|---|---|
| `SESSION_NAME` | `Automating Deployment with Makefile` (footer mark only, kicker on every content slide, never "Session 5") |
| `COURSE` | `React + Django Integration · Deployment` |
| `TR_DOC` | `/home/nxtwave/docker_jenkins_aws/05_automating_deployment_with_makefile.md` (362 lines) |
| Project | `deployement_session_5/`, to be scaffolded from `slide-kit/slide-template` |
| Deck file | `src/decks/makefileDeck.tsx` |
| `htmlName` | `deployment-session-5` |
| Slide count | **56** (planned 54, see §9) |
| `devPort` | `5216` (5211 is the kit and sessions 1 to 3, 5215 is session 4) |
| `NEXT_UP` | `Pushing Docker Images to Docker Hub` (source doc `06_...md`) |
| Build rules | `workflow/skills/session-5-deck/SKILL.md`, created on sign-off |

56 sits just inside the corpus band of 55 to 70 (`PEDAGOGY_GUIDELINES.md` §1),
against a 362-line TR. Session 4 was 80 slides from 845 lines, so this is the
same density.

---

## 1. Concept map

**Four concepts. The TR has exactly four sections and each one is a concept**,
so nothing is merged and nothing is split. That is unusual for this course and
worth saying out loud: sessions 3 and 4 both had to fold six TR sections into
four, and this one does not.

| # | Concept (agenda wording) | TR sections | Ends on the question that opens the next |
|---|---|---|---|
| 1 | Long Commands, Typed Daily | 1.1 to 1.5 | Make gives a command a name. So what does writing one actually look like? |
| 2 | Writing Targets, the Anatomy | 2.1 to 2.3 | One target works, and two commands under one target work. So what does the **whole** project's file look like? |
| 3 | The Complete Makefile | 3.1 to 3.7 | The file now holds every operation the project supports. Who else is that useful to? |
| 4 | Why This Matters for CI/CD | 4.1 to 4.3 | (closes the session) |

The agenda states these four as topics, the recap restates the same four as
things the learner can now do, in a different UI. Nothing else gets a divider.

## 2. The narrative spine

One sentence per beat, the through-line the instructor speaks:

1. Four sessions of Docker work left the project running from one command, and
   that command is 31 characters long. So are four of its neighbours.
2. Typing them daily has three separate costs: length, recall, and every
   teammate inventing their own variation.
3. So ask the room the question directly: can a long command be given a short
   name, saved **in the project**, shared by everyone? That is a Makefile.
4. Make is older than Python and installed nearly everywhere, which is exactly
   why it is the industry's convention for this job rather than a shell script.
5. Write one target. It is three things: a name, a colon, and a command
   indented by **one tab character** that you cannot see and that must be right.
6. Meet `missing separator` on purpose, in the room, before they meet it alone.
7. A target can hold several commands in order, so `make setup` becomes the
   whole "new machine, first run" procedure. That is automation at its simplest
   and most honest: a saved, ordered sequence of steps.
8. Write the project's real file: seven targets, every operation from sessions 3
   and 4 captured once. The Makefile is now the project's command menu.
9. Two refinements a real file carries: a variable, so a name is written once,
   and `.PHONY`, which exists because Make's original 1976 job was building
   files, not running commands.
10. Run the finished file and watch the stack come up, migrate and come down
    from three short words.
11. Then the idea underneath the tool: the project's operational knowledge moved
    out of people's memories and chat messages and **into a file, in the repo**.
12. Which is what makes the next half of this course possible. An automation
    server does not want to know your project. It wants a stable entry point,
    and today you built one.

Every divider is written as the question it answers, so the instructor can hand
over to it verbally.

## 3. New vocabulary, and where it is defined

| Term | First defined on | In one line |
|---|---|---|
| Make | 15 | A command-line tool from 1976 that reads a `Makefile` and runs the commands saved in it |
| `Makefile` | 20 | The file, capital M and no extension, in the folder the commands must run from |
| target | 15 | A short name mapped to one or more shell commands |
| tab (as separator) | 22 | The one indentation character Make accepts before a command |
| `missing separator` | 24 | Make's error when the indentation is spaces instead of a tab |
| echoing | 26 | Make prints each command before running it, so you see what executed |
| Make variable | 36 | `NAME = value` at the top of the file, used as `$(NAME)` |
| `.PHONY` | 40 | Declares that these targets are commands, not files, so they always run |
| entry point | 51 | The stable, simple command an automation server is told to run |

Deliberately **not** redefined: image, container, volume, service, `ports`,
`env_file`, `exec`, detached mode, migrations. All are sessions 3 and 4's, and
slides 3 and 4 recap them.

## 4. Slide-by-slide plan

Legend for **Assets**: `kit` = already in `src/ui`, `new` = built for this deck,
`png` = from `slide-kit/assets/tech/`, `TR` = transcript quoted from the TR doc.

Titles are **topic-bare and two to four words**, per `TEXT_GUIDELINES.md` §1 and
§4. The section name is the kicker on every content slide, so a title never has
to restate which concept it is inside. Where the same artifact grows across
consecutive slides the title is **repeated verbatim** (`Makefile` on 21, 23, 31
and 41), which is the corpus's way of signalling continuation.

### Front frame (1 to 6)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 1 | `brand` | (mark only) | `BrandSlide` | NxtWave mark + course | Brand fixture | fade | kit |
| 2 | `welcome` | Automating Deployment with Makefile | `WelcomeSlide minimal` | kicker `WELCOME TO TODAY'S SESSION`, session name, nothing else | Bare hero | fade | kit |
| 3 | `recap-compose` | Where we Left Off | `ContentSlide` + `CodeBlock` | Last session's finished `docker-compose.yml`: `backend` and `frontend`, each with `build`, `ports`, `env_file`, and the `db_data` volume | Their own file, so the session opens on what they wrote | code panel and bullets together | kit |
| 4 | `recap-the-gap` | Where we Left Off | `RecapSlide` | `ports` opened the doors, app on 3000 and APIs on 8000 · secrets moved into `.env`, which Compose reads on its own · the database lives in `db_data`, so it survives `down` · migrations run **inside** the container, with `exec`. Closing beat: **all four of those wins are reached by typing a command 40 or more characters long. That is what today fixes** | Same title as 3, a build sequence. The closing beat is the gap today closes, which is the recap slide's job | stagger, gap beat last | kit |
| 5 | `agenda` | Today's Agenda | `AgendaSlide` | The four concepts from §1 as 2 to 4 word pills, one gloss line each | Agenda fixture | curve draws, items cue off it | kit |
| 6 | `setup` | Initial Setup | `ContentSlide` + `Terminal` | `Run these terminal commands step by step :` then one panel at `C:\nxttrendz`: Docker Desktop running, `docker --version` prints the version, `make --version` prints `GNU Make 4.x`. If the last one errors instead, slide 17 is the fix | The two checks the session depends on, in the folder they must be run from. Each command states what it prints | panel on entry | kit, TR |

`make --version` is placed here deliberately, before it is explained, because a
missing `make` on Windows must surface at minute two rather than at slide 25.
Slide 17 is where it gets installed, so the setup slide points forward to it
without opening it.

### Concept 1: Long Commands, Typed Daily (7 to 18)

Opens on the felt need, not on a definition (`PEDAGOGY_GUIDELINES.md` §2): the
five real commands, then their three costs, then the question the room cannot yet
answer, then the answer named, and only then what Make is.

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 7 | `c1-divider` | Long Commands, Typed Daily | `SectionBreakerSlide` | index 1, subtitle *And what Make is* | Divider, navy stage | fade + mark | kit |
| 8 | `c1-the-daily-five` | The Daily Five | `ContentSlide` + `Terminal` | One panel at `C:\nxttrendz` with the five real commands: `up -d --build`, `exec backend python manage.py migrate`, `createsuperuser`, `logs backend`, `down` | One panel, path in the prompt, because these are all typed from the project root. The length **is** the argument and it has to be seen | transcript on entry | TR |
| 9 | `c1-cost-length` | Command Length | `ContentSlide` | 40 or more characters each, easy to mistype. `docker compose exec backend python manage.py migrate` is 51 | The count set against the command. A picture of a long string is the string | line, then the count | kit |
| 10 | `c1-cost-recall` | Exact Recall | `ContentNoteSlide` | Was it `-d --build` or `--build -d`? Does migrate take `exec backend` or `run backend`? Callout: the command has to be remembered character for character | The two real ambiguities as the callout, because these are the ones the room has hesitated over | questions, then callout | kit |
| 11 | `c1-cost-variation` | Team Variation | `ContentSlide` | Each teammate invents a variation, and "how do I run this project?" gets asked again and again | Typographic. This is the cost that is not about keystrokes at all | fade | kit |
| 12 | `c1-question` | (the question) | `QuestionSlide` | *Can we give each long command a short name, saved in the project itself, shared by the whole team?* | Question alone, nothing else on the slide, per content rule 16. The answer is slide 13 | question fades in | kit |
| 13 | `c1-the-shortcut` | The Shortcut | `ContentNoteSlide` + `Terminal` | `make up` instead of `docker compose up -d --build`. `make migrate` instead of the 51-character one. Callout: that is exactly what a **Makefile** does | The same panel as slide 8, two lines long. Before and after, in the same frame shape | panel, then callout | TR |
| 14 | `c1-speed-dial` | Speed Dial | `ContentSlide` + `AnalogyMap` | Scene in one line: you do not dial a full number to call your mother, you saved it once under a name. Then four rows: full phone number → full command · saved contact name → target name · tap the name → `make up` · contacts synced to a new phone → Makefile shipped with the project | `AnalogyMap` is built for exactly this mapping and staggers on entry. The analogy is cashed out into the technical mapping on the same slide and then dropped, per `TEXT_GUIDELINES.md` §3 | rows stagger | kit |
| 15 | `c1-what-is-make` | What is Make? | `ContentSlide` + `CodeBlock` | One sentence: a command-line tool from 1976, older than Python, that reads a file named `Makefile` in the current folder, where each **target** maps a short name to shell commands. Then `make <target>` | A definition slide, so a question title and a one-sentence answer, which is the corpus pattern. The usage line sits under it | definition, then the usage line | kit |
| 16 | `c1-make-vs-script` | Make vs a Script | `ContentSlide` + `DataTable` | Two columns, `Shell script` and `Makefile`, identical row labels: *Already installed* (yes / yes, on every Linux, macOS and CI machine) · *Convention* (yours alone / `make up`, `make test`, `make deploy` are near-universal) · *Reads as a menu* (you open it and read shell / every target is a named operation). Verdict, stated: a script would work, and this course uses Make because a CI server and a new teammate both already expect it | A comparison with identical row labels, closed by an explicit verdict, per `PEDAGOGY_GUIDELINES.md` §7. A comparison left unclosed makes the learner choose | rows stagger, verdict last | kit |
| 17 | `c1-make-on-windows` | Make on Windows | `ContentNoteSlide` + `Terminal` | Windows does not ship `make`. `winget install GnuWin32.Make` (or `choco install make`), reopen the terminal so it is on the PATH, then `make --version` prints `GNU Make 4.x` | The install and its confirmation in one panel, with the observable result stated | panel, then callout | TR, png `windows` |
| 18 | `c1-beyond-shortcuts` | Beyond Shortcuts | `ContentNoteSlide` | Make was built to compile C programs and does far more than this course uses. Used here as a **command shortcut runner**, its most common use in web projects today | Typographic. This is an aside and it should look like one | fade | kit |

### Concept 2: Writing Targets, the Anatomy (19 to 28)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 19 | `c2-divider` | Writing Targets | `SectionBreakerSlide` | index 2, subtitle *A name, a colon, and one tab* | Divider | fade + mark | kit |
| 20 | `c2-where-it-lives` | Where It Lives | `ContentSlide` + `FileTree` | `Makefile`, capital M and no extension, in `C:\nxttrendz\` beside `docker-compose.yml`, because that is the folder its commands run from | The tree they have, with one new entry, next to the file that explains its position | entries stagger, new one last | kit |
| 21 | `c2-first-target` | Makefile | `ContentSlide` + `CodeBlock` | The two lines: `up:` and the indented `docker compose up -d --build` | The whole artifact at once. It is two lines; there is nothing to build up to | panel on entry | kit |
| 22 | `c2-anatomy` | Target Anatomy | `ContentSlide` + **`TargetAnatomy`** (new) | Target name (your choice, keep it short) · the required colon · the indented command, one per line. The indentation is **one tab character** | §5.1. The tab is the only part of a Makefile you cannot see, and a figure that renders it as a visible glyph makes an argument prose cannot | figure and labels together | new |
| 23 | `c2-tab-rule` | Makefile | `ContentNoteSlide` + `CodeBlock` | Spaces will not work. Warning callout: some editors silently convert tabs to spaces, so this is not a mistake you make once | The same two lines as slide 21 with the whitespace revealed, and the title repeated verbatim to signal continuation | panel, then warning | kit |
| 24 | `c2-missing-separator` | Missing Separator | `ContentSlide` + `Terminal` | `Makefile:2: *** missing separator.  Stop.` Fix: check the indentation first, before anything else. Named as the trap it is | The error in the panel it appears in. Meeting it here is cheaper than meeting it alone | transcript, then the fix | TR |
| 25 | `c2-first-run` | First Run | `ContentSlide` + `Terminal` | `make up` at `C:\nxttrendz`, and its output: the echoed command, then `[+] Running 2/2` with both containers started | One panel. The echoed first line is the teaching point and it is in the output | transcript on entry | TR |
| 26 | `c2-make-echoes` | Make Echoes | `ContentNoteSlide` | Make prints each command before running it, so you always see what actually executed. Seven keystrokes triggered a 31-character command | Typographic, pointing back at slide 25's first output line | line, then the count | kit |
| 27 | `c2-two-commands` | Two Commands | `ContentSlide` + `CodeBlock` | `setup:` with `up -d --build` and then `migrate`, in order, one per line | The file again, one target longer | second line types in | kit |
| 28 | `c2-one-word-setup` | One Word Setup | `ContentNoteSlide` | `make setup` brings the stack up **and** migrates: the entire "new machine, first day" procedure. Callout: automation in its simplest honest form, a saved and ordered sequence of steps | Typographic. It is a claim about what they just wrote, and it earns the plain frame | claim, then callout | kit |

### Mid-deck check (29)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 29 | `quiz-time-1` | Quiz Time! | `QuizTimeSlide` | subtitle: *The three parts of a target, and the one character that has to be a tab.* No question, no options, no answer | Quiz fixture, Nova | fade | kit |

This sits at 52% of the deck, at a concept boundary, immediately after the
concept the rest of the session depends on: every file in concept 3 is written
with tabs, so a misunderstanding here compounds through fifteen slides.
`PEDAGOGY_GUIDELINES.md` §8 places the mid-deck quiz exactly there.

### Concept 3: The Complete Makefile (30 to 45)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 30 | `c3-divider` | The Complete Makefile | `SectionBreakerSlide` | index 3, subtitle *Every operation, captured once* | Divider | fade + mark | kit |
| 31 | `c3-the-file` | Makefile | `ContentSlide` + `CodeBlock` | All seven targets: `build`, `up`, `down`, `logs`, `migrate`, `superuser`, `shell` | The whole artifact. Five of the seven are commands they have typed for two sessions, which is what earns showing it whole before taking it apart | panel on entry | kit |
| 32 | `c3-build-alone` | build | `ContentNoteSlide` + `CodeBlock` | `docker compose build` is the build half of `up --build` on its own: rebuild the images, start nothing. For checking a Dockerfile change compiles before bringing the stack up | One target lit inside the file from slide 31 | line highlights, note follows | kit |
| 33 | `c3-shell-inside` | shell | `ContentNoteSlide` + `Terminal` | `exec` as in migrate, but running `bash` opens an interactive shell **inside** the container, for looking around when something is wrong. The prompt changes to the container's. `exit` leaves | A terminal, because the whole point is that the prompt changes | panel, then note | TR |
| 34 | `c3-command-menu` | Command Menu | `ContentSlide` + `DataTable` | Seven rows, *You type* → *Runs* → *When you use it*, from the TR's table. The `logs` row carries `-f` = follow, Ctrl+C to exit | This is a reference the room will photograph, and a table is the honest shape for a reference | rows stagger | kit |
| 35 | `c3-repeated-strings` | Repeated Strings | `ContentSlide` | The image name is about to be needed in several targets: building, tagging, pushing. Repeating the string invites inconsistency | Typographic, and short. It is the friction statement that earns the next slide | fade | kit |
| 36 | `c3-variables` | Variables | `ContentNoteSlide` + `CodeBlock` | `IMAGE_NAME = nxttrendz-backend` at the top, then `$(IMAGE_NAME)` in two targets. **Parentheses**, unlike shell's `$VAR`. Callout: rename the image someday and one line changes | The file with the variable in it and both uses lit. The parenthesis difference is one character and has to be highlighted | definition, then the two uses | kit |
| 37 | `c3-phony-question` | (the question) | `QuestionSlide` | *A folder named `build` exists in the project. What does `make build` do?* qualifier: *the target is written exactly as on slide 31* | Question alone, per content rule 16. This one has a genuinely surprising answer and the room should commit to a guess first | question fades in | kit |
| 38 | `c3-phony-surprise` | Nothing Runs | `ContentSlide` + `Terminal` | `make: 'build' is up to date.` and no command runs | The output alone, in the panel it appears in. The answer to slide 37 and nothing else | transcript on entry | TR |
| 39 | `c3-phony-why` | Targets Are Files | `ContentSlide` | Make's original 1976 job was building **files**, so by default a target name is assumed to be a file it should create. `build` exists, so Make considers it already built. Folders named `build` are common in real projects, so this does happen | Typographic. A fact about history explaining a fact about today. This is the anti-magic slide for `.PHONY`: the mechanism is opened once, here | claim, then the consequence | kit |
| 40 | `c3-phony-line` | .PHONY | `ContentNoteSlide` + `CodeBlock` | `.PHONY: build up down logs migrate superuser shell` declares that these targets are commands, not files, so they always run. Note: for this course, list **every** target | The line, at the top of the file where it goes | line on entry, note follows | kit |
| 41 | `c3-final-makefile` | Makefile | `CodeBuildSlide` | `.PHONY`, then `IMAGE_NAME`, then the seven targets. The complete file, title repeated from 31 and 32 | `CodeBuildSlide` because the file gained two things across this concept, and the build sequence is the recap of them | three stages: `.PHONY`, variable, targets | kit |
| 42 | `c3-test-it` | Test it | `ContentSlide` + `Terminal` | `make down` → `Container nxttrendz-backend-1  Removed` · `make up` → `[+] Running 2/2`, both started · `make migrate` → `No migrations to apply` | The fixture that closes every build in the corpus. A concept is not finished until the room has run it and seen output, and every line states its expected result | rows reveal in order | TR |
| 43 | `c3-wrong-folder` | Wrong Folder | `ContentSlide` + `Terminal` | `cd ~` then `make up` gives `make: *** No rule to make target 'up'.  Stop.` Make looks for a `Makefile` in the current folder only. Fix: `cd` into the project root | The error in its panel, with the wrong path visible in the prompt, which is the whole diagnosis | transcript, then the fix | TR |
| 44 | `c3-folder-relative` | Folder Relative | `ContentSlide` | `docker build`, `docker compose`, and now `make`. The path in your prompt is the first thing to check when a command that worked yesterday does not | Typographic. It is a habit, not a mechanism | fade | kit |
| 45 | `c3-commands-as-code` | Commands as Code | `ContentNoteSlide` | How to run, migrate and inspect the project used to live in people's memories and chat messages. It now lives in a file, in the project, beside the code. Callout: operations as committed, versioned files, updated in one place and picked up by every teammate and every automated system with the next copy | Typographic and deliberately plain. This is the session's idea and it should be the only thing on the slide | claim, then callout | kit |

### Concept 4: Why This Matters for CI/CD (46 to 51)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 46 | `c4-divider` | Why This Matters for CI/CD | `SectionBreakerSlide` | index 4, subtitle *One thing is still manual* | Divider | fade + mark | kit |
| 47 | `c4-ladder` | The Ladder | `ContentSlide` + **`AutomationLadder`** (new) | Level 0 manual everything (venv, two terminals) · Level 1 Docker and Compose, the environment automated · Level 2 Makefile, the commands automated, **you are here** · Level 3 later in this course | §5.1. The figure's job is showing position on a climb, which content rule 4 names as the one place a later problem may be marked unopened. Level 3 is one block with no tool named inside it | levels build bottom-up, the pin lands with level 2 | new |
| 48 | `c4-still-manual` | Still Manual | `ContentSlide` | Each level removed one kind of human effort. One is left: a person must be at a keyboard to type `make up` after every code change | Typographic, following the figure it refers to | claim, then the consequence | kit |
| 49 | `c4-entry-point` | Stable Entry Point | `ContentSlide` | An automation server does not want to know your project's details. It wants a simple, stable entry point | Typographic and short. It is the setup for the payoff | fade | kit |
| 50 | `c4-the-instruction` | The Instruction | `ContentSlide` + `CodeBlock` | `whenever the code changes:` / `run: make build` / `run: make up`. No filename label: this is pseudocode, not a file in the project | The instruction as a panel, because seeing how short it is **is** the argument | panel on entry | kit |
| 51 | `c4-the-interface` | The Interface | `ContentNoteSlide` | The server never needs to know the project uses Compose, which service is `backend`, or what the migrate command looks like. Callout: the details stay encapsulated, the same principle as a Python function hiding its implementation | Typographic. The analogy is to something they know well and needs no drawing | claim, then callout | kit |

### Closing frame (52 to 56)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 52 | `recap` | Recap | `RecapSlide` | The four agenda concepts as things they can now do, in 4 to 8 word pills: give a long command a short name · write a target, tab and all · hold the project's whole command menu in one file · hand an automation server one stable entry point | Recap fixture, a build sequence. Same four items as the agenda, different UI | stagger | kit |
| 53 | `quiz-time-2` | Quiz Time! | `QuizTimeSlide` | subtitle: *One folder named build, and the reason a 1976 tool is still the convention.* No question, no options, no answer | Quiz fixture | fade | kit |
| 54 | `takeaways` | Key Takeaways | `KeyTakeawaysSlide` | The four concepts restated as outcomes, in a different UI than both the agenda and the recap | Takeaways fixture | stagger | kit |
| 55 | `next-session` | Next Session | `ContentSlide` + logos | Images need what the code already has with GitHub: a central place to push to and pull from. That place is **Docker Hub** | The two marks side by side, because the analogy is between two named technologies (content rule 12) | fade, marks together | png `docker`, `git` |
| 56 | `thankyou` | Thank You | `ThankYouSlide` | Fixture | Mark on stage | fade | kit |

Slide 53 sits immediately before 54, per content rule 18. `QuizTimeSlide`
defaults its title to `Quiz Time!`, which is the corpus fixture string, so
neither quiz slide passes a title.

**Note on Practice and Feedback slides.** `SLIDE_WORKFLOW.md` stage 2 and
`PEDAGOGY_GUIDELINES.md` §1 both list Practice → Feedback → Thank You. Session 4
shipped without them (`recap → quiz → takeaways → next-session → thankyou`) and
this plan mirrors it for consistency with the deck immediately before it. **Say
at sign-off if you want them added.** A `Try it by yourself` slide has real
content available here: extend the Makefile with the targets the room has not
been given, `restart` and `ps`, which is a symmetric extension of what was just
built rather than new material. That is 2 more slides, both fixtures, so it is
cheap now and a renumbering later.

## 5. Assets

### 5.1 Two new figures

Both are proposed as **session-owned** (`deployement_session_5/src/ui/`), not
kit, because content rule 14 makes promotion your call. Each one lists the
no-new-component fallback, so neither is a fait accompli.

**`TargetAnatomy`** (slide 22). Three labelled parts of a target, with the
indentation rendered as a **visible tab glyph** and a caret under it. The
argument it makes that a sentence cannot: the one character that breaks a
Makefile is the one character you cannot see in your editor. Everything else on
this slide is prose-able; the tab is not.
*Fallback:* `CodeBlock` plus the TR's own `Part | Rule` `DataTable`. Honest, but
it describes the tab instead of showing it.
*Promotion:* specific to Make. I would leave it session-owned.

**`AutomationLadder`** (slide 47). Four ascending levels, each labelled with what
it automated and what it left manual, with a pin on level 2 and level 3 drawn as
a single unopened block with no tool named inside it.
I checked the kit first: `JourneyRoadmap` hardcodes this course's
Package/Configure/Combine stages and is a different argument;
`LayerStack`'s states are `ships`/`host`/`breaks`/`shared`, which are about what
travels with a `git push`, so reusing it would contradict this slide (content
rule 8); `StepList` draws a horizontal sequence, not a climb with a position.
*Fallback:* a 4-row `DataTable` (*Level* / *What it automated* / *What stayed
manual*). It reads fine and loses the sense of a climb.
*Promotion:* **this one is worth promoting.** Sessions 6 to 11 are the rest of
this ladder, and each will want it with the pin moved, exactly as
`JourneyRoadmap` is parameterised. Your call, and I will ask again after you see
it rendered.

### 5.2 Logos

Every file below is already in `slide-kit/assets/tech/`, so nothing needs
fetching. Copied into `public/assets/tech/` per content rule 13, and referenced
through a static path map per session 4's S8 (a template literal is invisible to
`inline-assets.mjs` and breaks only in the shipped file).

| File | Slides | Why the technology is named there |
|---|---|---|
| `docker.png` | 3, 31, 47, 55 | Compose and Docker are named on all four |
| `django.png` | 8, 34 | The migrate and superuser commands are Django's |
| `react.png` | 3 | The `frontend` service |
| `windows.png` | 17 | The install step is Windows-specific |
| `git.png` | 55 | The Docker Hub analogy is to GitHub |
| `python.png` | 15 | "Older than Python itself" is a claim about Python |
| `vscode.png` | 6, 23 | The terminal and the tabs-to-spaces setting are both VS Code's |

Trimmed to what the deck renders: session 4 recorded that ten unused logos added
290 KB to the single-file build.

### 5.3 Code block labels and chips

Eight slides render the Makefile (21, 23, 27, 31, 32, 36, 40, 41). Every one
carries `filename="Makefile"`, per `TEXT_GUIDELINES.md` §5, which requires a code
slide to name its file.

**`CodeBlock`'s `language` prop defaults to `'python'`**, and the prop doubles as
the chip label, so every one of those eight needs `language="makefile"`
explicitly or the chip reads `python` on a Makefile. Slide 3 takes
`filename="docker-compose.yml"` and `language="yaml"`. Slide 50 takes **no
filename**: it is pseudocode for an automation server, not a file in the project,
and labelling it as one would be a small lie.

### 5.4 Terminal transcripts

**Every terminal panel is quoted from the TR**, and the TR's outputs are
illustrative. Docker Desktop does not run on the capture machine, which is the
same blocker that left sessions 1 to 4 quoted. No screenshots (`public/shots/`)
are planned. Swapping in real captures later needs no layout change.

Slide 42 (`Test it`) is the one panel whose output is **not** in the TR: the TR
never runs the finished file. Its three expected results are composed from
outputs the TR does show elsewhere (`[+] Running 2/2` from §2.2, and Docker's
standard `Removed` and `No migrations to apply` lines). **That is the weakest
transcript in the deck and it is flagged rather than hidden.** It is the one I
would most like a real capture of.

**Say so at sign-off if you want real captures.** The others worth capturing are
slide 24 (`missing separator`) and slide 38 (`'build' is up to date.`), because
both are surprising outputs and a real capture is stronger evidence than a quote.
Per content rule 11 they must be cropped to the point and taken from VS Code's
integrated terminal, which is work worth planning rather than retrofitting.

## 6. Where this compresses, if you want it shorter

**56 is one slide above the corpus floor of 55**, so this section is now a list
of things I would not do unless you ask. Any cut here takes the deck below the
band `PEDAGOGY_GUIDELINES.md` §1 measures.

1. **44** folds into 43 as a second beat. Saves 1, lands at 55.
2. **35** folds into 36's lead. Saves 1, lands at 54 and costs the friction
   statement that earns the variable.
3. **9, 10, 11** become one slide with three stepped bullets. Saves 2, and breaks
   content rule 5, which is why it is last rather than first.

## 7. Sign-off

**Nothing is generated until you approve this.** What I need from you:

- [ ] The **four concepts**, one per TR section, and the agenda wording
- [ ] The **56 slides**, including the mid-deck quiz at 29 and `Test it` at 42
- [ ] The **two new figures** in §5.1, and whether `AutomationLadder` goes into
      the kit now or stays session-owned until you have seen it
- [ ] Whether the closing frame gains **Practice and Feedback**, and whether the
      `Try it by yourself` extension in §4 is the right one
- [ ] Whether slides 24, 38 and especially **42** stay quoted or want real
      screenshots (§5.4)
- [ ] `deployement_session_5/` on **devPort 5216**, `htmlName`
      `deployment-session-5`

On approval I scaffold the project from `slide-kit/slide-template`, write
`workflow/skills/session-5-deck/SKILL.md`, generate the deck, run the four
harnesses (`video-safe`, `qa`, `align-check`, `preview`) and screenshot both new
figures before showing you anything.

## 8. What generation changed

The plan is the contract, and generation always finds things the plan could not.
Recorded here rather than quietly absorbed.

### 8.1 The count held at 56

No slide was added or removed. `deck.config.json` carries 56, counted from the
deck array rather than typed.

### 8.2 Concept 1 was renamed, by the video-rectangle harness

`video-safe.mjs` failed on slide 5, the agenda: the first item's title rendered
410px wide and reached x=954, inside the instructor-video rectangle
(x 913..1280, y 0..220). The concept was called `Long Commands, Typed Daily`,
which is 26 characters.

It is now **`The Cost of Typing`**. That is one const in the deck, so the kicker
on twelve slides, the agenda item, the divider and the recap all followed. It is
also better copy: it names the felt need instead of describing the commands,
which is what `PEDAGOGY_GUIDELINES.md` §2 asks a concept to open on.

### 8.3 Three slides could not hold what the plan gave them

All three were caught by the harnesses, and in every case the fix improved the
slide rather than distorting it.

| Slide | What failed | Fix |
|---|---|---|
| 3 | `video-safe`: the Compose panel's top edge sat at y=213, 7px inside the rectangle | smaller type, which shortens a centred panel and so lowers its top edge |
| 31 and 32 | `video-safe` and `qa`: the seven-target file was 25 lines and 450px tall, reaching into the rectangle on one slide and past the frame floor on the other | the blank line between each target is conventional but not load-bearing. Without them the same file is 14 lines, and it is used on every slide that renders it so 31, 32 and 41 are visibly the same file |
| 32 | still 7px over, and `align-check` put the note under the bottom-left control cluster (y 658..706) | the file is **elided with `...`** after the first two targets, which `PEDAGOGY_GUIDELINES.md` §3 names as the move for exactly this. `build` is still read in context, and the note fits |
| 41 | `qa`: the note ran 61px past the floor, and `align-check` found the code panel's line numbers under the controls | the note was restating the lead, so it went. The lead already says which two lines are new, which is the whole annotation, and the slide now carries one idea instead of the same idea twice |

### 8.4 `CodeBuildSlide` cannot render a Makefile

Slide 41 was planned as a `CodeBuildSlide`, the kit's build-sequence frame. It
**hardcodes `language="YAML"`** on its inner `CodeBlock`, so a Makefile would
ship with a YAML chip.

Slide 41 is a `ContentSlide` plus a `CodeBlock` instead. Fixing the component
means adding a pass-through prop to `src/slides/`, which is kit-owned: content
rule 14 makes that the user's call and `sync-kit.mjs` would push it to every
other session. **Raised, not fixed.** If you approve it, slide 41 goes back to
`CodeBuildSlide` and regains its annotation panel.

The same trap one layer down: `CodeBlock`'s own `language` prop **defaults to
`'python'`** and doubles as the chip label. §5.3 of this plan was written before
generation and caught it; all eight Makefile panels pass it explicitly.

### 8.5 Both figures were built from DOM elements, not SVG

The plan did not specify the technique. It should have, and this is the decision:
`TargetAnatomy` and `AutomationLadder` are flex and grid layouts of real
elements, not `<svg><text>`.

That is the direct answer to session 4's S9, where two SVG figures shipped with
overlapping labels while all three harnesses reported clean, because an `<svg>`
is one DOM rectangle to them. Here the browser's layout engine keeps the labels
apart and `align-check.mjs` can see each one. The rule worth carrying: **a figure
whose content is mostly labels is built from elements; SVG is for geometry.**

### 8.6 What looking at the screenshots found

Content rule 17 was done, and it earned its keep. None of the four harnesses had
anything to say about any of these.

- The tab glyph in `TargetAnatomy` rendered as a small dash at 15px inside a
  42px box. It is 22px now and reads as an arrow to a bar.
- `AutomationLadder` read as a **list, not a climb**: four rungs at equal width
  with numbers on them. Each rung now steps 14px in from the one below it, which
  is the shape the argument is making. `Docker and Compose` was also wrapping to
  two lines and making that rung taller than its neighbours.
- **Seven bullets rendered punctuation with a gap before it**, as
  `.env , read automatically`, because the `Code` chip carries horizontal
  padding. All seven were rephrased so a chip is followed by a word. Dropping two
  question marks in the process also satisfied `TEXT_GUIDELINES.md` §2, which
  wants no trailing punctuation on a bullet.
- Slide 16's verdict line wrapped to a second line carrying only the word "it".

### 8.7 Verification, as run

| Check | Result |
|---|---|
| `tsc -b --noEmit` | clean |
| `npm run build:html` | 3.73 MB self-contained, 13/13 assets inlined, fonts embedded |
| `video-safe.mjs` | **CLEAN** |
| `qa.mjs` | **2 slides**, the expected baseline: 1 (Welcome, `NO LOGO` + decorative blobs) and 56 (Thank you, `NO LOGO`) |
| `align-check.mjs` | **0 of 56** |
| `preview.mjs` | 56 slides, **0 broken images**, 0 console errors, loaded over `file://` with the network blocked |
| `build-reveal-steps.mjs` | regenerated for 56 slides |
| Figures | slides 22 and 47 screenshotted and inspected twice, before and after 8.6 |

`build-reveal-steps.mjs` needed `npx playwright install chromium-headless-shell`
first: unlike the other four harnesses it ignores `CHROME_PATH` and launches
Playwright's own browser. Noted in the session's `CLAUDE.md`.

### 8.8 Still outstanding

- **Slide 42's transcript.** The TR never runs the finished file, so its three
  expected results are composed from outputs the TR shows elsewhere. Flagged in
  §5.4 before sign-off and still the panel most worth a real capture.
- **`AutomationLadder`'s promotion** to the kit, recommended in §5.1 and not yet
  decided. Sessions 6 to 11 are the rest of the same ladder.
- **The `CodeBuildSlide` language prop**, from §8.4.
- **Practice and Feedback slides**, declined at sign-off by default rather than
  by decision. §4's closing-frame note has the `Try it by yourself` content ready
  if you want them.

## 9. Review against the guidelines

The first draft was audited against `PEDAGOGY_GUIDELINES.md` and
`TEXT_GUIDELINES.md`. Nine things changed. Recorded because the audit is worth
more than the fixes: the same defects will show up in the next plan.

### 9.1 Titles were headlines, not titles

The worst finding, and systematic. The corpus title median is **2 words** with a
soft ceiling of 5, and titles are **topic-bare** (`Testing`, `Serializers`,
`Virtual Environment`). The draft's median was 4, five titles were over the
ceiling (`A Note on What Make Can Do` at 7, `The Whole First Run, in One Word` at
7, `Every Tool Today Is Folder Relative` at 6), and six used a comma to carry a
second clause. They read as magazine headlines.

Every content-slide title was rewritten. The median is now 2. Six slides are
titled by the thing they are about, which is the corpus's own move: 32 is
`build`, 33 is `shell`, 40 is `.PHONY`.

The related fix: `TEXT_GUIDELINES.md` §4 says a build sequence **repeats its
title verbatim** and never says "continued". Slides 21 and 23 are the same two
lines of the same file, and 31, 32 and 41 are the same complete file. All are now
titled `Makefile`, and continuation is signalled by the repetition.

### 9.2 The recap did not name the gap

`PEDAGOGY_GUIDELINES.md` §1 is specific: the previous-session recap **ends by
naming the gap today closes**. The draft's slide 4 listed last session's four
wins and stopped, leaving the motivation to arrive at slide 8. Slide 4 now closes
on the gap: all four of those wins are reached by typing 40 or more characters.

### 9.3 A comparison with no comparison in it, and no verdict

The draft's slide 16 was titled `Why Not a Shell Script?` and then gave three
reasons for Make without ever putting a script beside it or saying anything about
the script. §7 forbids exactly this: a comparison is a same-shape table with
identical row labels, closed by a stated verdict and its reason.

It is now a two-column `DataTable` with three shared row labels and a verdict
that commits: a script would work, and the course uses Make because a CI server
and a new teammate both already expect it.

### 9.4 No concept landed in something runnable

§6 requires each build to be followed by a `Test it` slide stating the expected
result, a fixture with 39 occurrences in the corpus. Concept 2 had one by
accident (slide 25's output). Concept 3 assembled a complete seven-target file
across twelve slides and **never ran it**.

New slide 42, `Test it`: `make down`, `make up`, `make migrate`, each with its
`→ expected` line. It also honestly flags the one weak transcript in the deck
(§5.4), because the TR never runs the finished file.

### 9.5 One quiz, where the corpus has two

Content rule 18 requires one quiz frame before Key Takeaways and the draft had
it. But §8 also places a **mid-deck quiz at the 50 to 60% mark, at a concept
boundary, after the concept the rest of the session depends on**, in 9 of 23
decks. Concept 2 is exactly that concept here: every file in concept 3 is written
with tabs.

New slide 29, at 52% of the deck, on the concept-2/concept-3 boundary. Both quiz
slides carry a subtitle naming what is tested and no question, per rule 18.

### 9.6 The thesis slide carried two ideas

Draft slide 43 held the session's central claim (operational knowledge now lives
in a file) **and** its consequence (change it once, everyone picks it up) **and**
a callout naming the industry practice. Over the 40-word budget and over the
one-idea line. The consequence folded into the callout; the claim now has the
slide to itself.

### 9.7 Two commands never said what they print

`TEXT_GUIDELINES.md` §3: an instruction that does not say what the learner will
see is incomplete. `make --version` on slide 6 and again on slide 17 were both
bare. Both now state the output. Slide 6 also picks up the corpus's verbatim
setup line, `Run these terminal commands step by step :`, which appears 21 times.

### 9.8 The code chips would have read "python"

Not a guideline finding but a generation trap found while checking §5 against the
component: `CodeBlock`'s `language` prop **defaults to `'python'`** and the same
prop is the chip label. Eight Makefile slides would have shipped with a `python`
chip. §5.3 is new and records the required props per slide, including the one
slide (50) that must **not** get a filename, because it is pseudocode rather than
a file.

### 9.9 The deck was below the corpus floor

54 slides against a measured band of 55 to 70. The two additions above land it at
**56**, and §6 was rewritten from "here is how to make it shorter" to "any cut
takes it under the floor".

### What the audit did not change

- **Concept 3 shows the whole file first (31), then its parts, then the whole
  again (41).** §3's progressive disclosure wants parts before whole. Kept
  deliberately, because five of the seven targets are commands the room has typed
  for two sessions, so there is no unknown to disclose. Session 4 made the same
  call on the backend Dockerfile. Flagged here so it is a decision on the record
  rather than an oversight.
- **Concepts run 12, 10, 16 and 6 slides**, well past §1's "2 to 4 content
  slides". The precedence note at the top of `PEDAGOGY_GUIDELINES.md` settles it:
  content rule 5's one-item-per-slide overrides the count, and both documents say
  so explicitly.
- **Concept 2 opens on mechanism** (where the file lives) rather than on a felt
  need. Concept 1 ends on "that is what a Makefile does" and the divider is
  written as the question the concept answers, so the motivation is carried
  across the boundary rather than restated.
