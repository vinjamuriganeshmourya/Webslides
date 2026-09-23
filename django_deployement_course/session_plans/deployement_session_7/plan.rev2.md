<!-- cSpell:ignore nxttrendz deployement NxtWave dockerignore Makefile runserver venv createsuperuser -->
<!-- cSpell:ignore cicd Cicd ravi behaviour colour signoff -->
# Deployment · Session 7 — pending divergence, and a prerequisite audit

**STATUS: NOT APPLIED. Session 7 is delivered and frozen.**

This file records two things found on 2026-09-09, neither of which has been
written into the deck:

1. **Part A** — where session 7 now disagrees with session 6, after session 6
   was re-cut on review. Six items, with replacement copy ready to paste.
2. **Part B** — a prerequisite and term-flow audit of session 7 against content
   rule 24, built by extracting every rendered string from all 60 slides in
   order and tracing the first use of each term.

Nothing here is a defect that shipped. Part A exists because the session it
depends on moved underneath it; Part B is a review of the deck on rules written
after it was signed off.

> **Read the freeze clause at the top of `RULES.md` before acting on any of
> this.** A delivered deck is re-opened only when the user asks for that deck by
> name. The quoted counts and line numbers below are evidence, not a work list.

---

## Part A — divergence from session 6

### What session 6 now is

Session 6 was re-cut on 2026-09-09. At the level session 7 depends on:

| # | Concept | What the learner does |
|---|---|---|
| 1 | Docker Hub and Images | image is stuck on one machine · what a registry is · what is inside an image · why ship the image and not the code · what is deliberately left out · **create the Docker Hub account** · **`docker login`** · **access token, if the password is refused** |
| 2 | Image Naming and Tagging | push refused · the name has three parts · `docker tag` · one image, two names |
| 3 | Pushing and Pulling Docker Images | `docker push` · layers travel · `Mounted from` · refused again · the repository page · `docker pull` · **the whole cycle, tagged `:v1`** · run it elsewhere · **the frontend image pushed too** · **`login` / `tag` / `push` / `pull` compared** |
| 4 | Image Versioning with Tags | a tag is a movable pointer · why `latest` is risky · one tag per build · rollback · the Makefile `push` target · overriding `VERSION` · **a command reference** |

Three changes matter to session 7:

- **`docker login` moved into concept 1**, immediately after account creation.
  It used to open concept 2. Session 6's setup slide had claimed "a free
  account, created before this session", which was never true, so the account is
  now created inside the session and signed into two slides later.
- **Both images are pushed.** The app is two services, so `nxttrendz-frontend`
  is tagged and pushed alongside `nxttrendz-backend`, and the Makefile `push`
  target publishes both.
- **The Makefile variable was renamed.** `IMAGE_NAME` became `BACKEND` and
  `FRONTEND`, the target is four commands rather than two, and the `:latest`
  pair was dropped because concept 4 spends three slides arguing that a server
  pulling `latest` cannot say which build it is running.

### A1 — `c2-your-makefile` quotes a Makefile the room does not have

**Severity: highest.** `jenkinsCicdDeck.tsx:1072`.

```
docker push $(DOCKER_ID)/$(IMAGE_NAME):$(VERSION)
```

`IMAGE_NAME` no longer exists in session 6's Makefile. This lands on the slide
whose own comment states its purpose — *"the slide whose whole job is to
reassure the room that they already own the pipeline"* — so a learner who opens
their own file finds different variable names on the one slide that told them
the file was already theirs. That slide was corrected once before for
over-claiming; this breaks it from the other side.

**Replacement:**

```
code={'build:\n\tdocker compose build\npush:\n\tdocker tag $(BACKEND) $(DOCKER_ID)/$(BACKEND):$(VERSION)\n\tdocker push $(DOCKER_ID)/$(BACKEND):$(VERSION)'}
```

Two lines of the `push` target rather than four: the slide's claim is *you wrote
this*, and showing the backend pair is enough to make it. Note in the source
that the real target has the frontend pair as well, so nobody later reads the
elision as the whole file.

### A2 — `recap-docker-hub` has four wrong rows

`jenkinsCicdDeck.tsx:112-115`. Four problems in four rows:

| Row today | Problem |
|---|---|
| `docker tag ravi123/nxttrendz-backend:v7` | **`v7` appears nowhere in session 6.** It teaches `:v1`, and `:v2` only as the override example |
| `docker login` | Right, but now the **second** thing the learner did, not the second row's worth of the story |
| `docker push ravi123/nxttrendz-backend:v7` | `v7` again, and the backend only |
| `make push VERSION=v7` | `v7` again |
| *(missing)* | **`docker pull` is absent**, though session 6 teaches it and this deck's whole premise is that images travel between machines |

**Replacement rows**, in session 6's actual order:

```
['Created the account and signed in', <Code>docker login</Code>],
['Gave the image a full name',        <Code>docker tag ravi123/nxttrendz-backend:v1</Code>],
['Sent both images to Docker Hub',    <Code>docker push ravi123/nxttrendz-backend:v1</Code>],
['Brought one down on another machine', <Code>docker pull ravi123/nxttrendz-backend:v1</Code>],
```

`make push` comes out. It is a wrapper rather than a step, `c2-your-makefile`
already shows it, and its removal makes room for the pull row that was missing.

### A3 — `c1-where-the-code-lives` shows one repository

`jenkinsCicdDeck.tsx:223`. The table contrasts *your image, which has a home*
with *your code, which has none*. There are two images now, so the image row
understates what the learner did.

The slide's argument survives either way, so this is copy rather than
structure: `hub.docker.com/r/ravi123/nxttrendz-backend` becomes *two
repositories on Docker Hub*, or the row's "Where it lives" cell names both.

### A4 — `c2-cd-delivery` says "the image", singular

`jenkinsCicdDeck.tsx:823`. *"For this project that means the image is built and
pushed to Docker Hub."* Two images now. One word.

### A5 — `setup` is now correct, and could say more

`jenkinsCicdDeck.tsx:158`. *"You are signed in to Docker Hub from last
session."* This used to be a weak claim; session 6 now instructs signup and
login explicitly in concept 1, so it is properly earned. **No change needed.**

Worth one sub-line: session 6 introduces the **access token** path for a
password that gets refused, so a learner who signed in with a token will need it
again here rather than a password.

### A6 — the pipeline will have to push two images

Not a copy fix. Session 7's pipeline slides describe the pipeline building and
pushing *the image*. With two images, the pipeline that sessions 8 and 9 build
has to publish both, which is a design input for those sessions rather than a
wording change to this one. `c2-cd-delivery` and `c3-where-it-sits` are where
the singular assumption is visible.

### Not a problem, checked

- **`c1-same-two-steps`** (`615-627`) elides to `docker tag ravi123/...` and
  `docker push ravi123/...`, so the version never appears and the recognition
  still holds. Nothing to do. The elision is worth copying elsewhere.
- **Session names.** Session 7 refers to "the Docker Hub session" and "session
  6" in notes and comments. Session 6's four CONCEPT names all changed, but its
  SESSION name, `Pushing Image to Docker Hub`, did not. Every one of these
  references still resolves.
- **The `.gitignore` / `.dockerignore` callout** (`657-660`) credits sessions 4
  and 2. Both still hold.

---

## Part B — prerequisite and term-flow audit

Method: every rendered string was extracted from all 60 slides in file order,
with JSX comments and `notes:` removed, then each term's first appearance was
traced. Slide numbers below are positions in the deck, not ids.

### What the audit found in session 7's favour

- **`CI/CD` is expanded at first use**, slide 23: *"CI/CD is short for
  Continuous Integration and Continuous Delivery."* This is the exact defect
  session 5 shipped — a section titled `Makefile in CI/CD` with neither letter
  ever spelled out, which cost six slides on review. It was fixed in the next
  deck and stayed fixed.
- **`webhook` is glossed on the slide that introduces it**, slide 35, inside its
  own table row: *"GitHub tells the server the instant you push, without being
  asked."* Not in the speaker notes, where it would be invisible to the
  recording.
- **`origin` is glossed at first use**, slide 16: *"origin is a nickname for
  that long address, so you never type it twice."*
- **`token` at slide 12 has its prerequisite**, and now has it more firmly:
  session 6 teaches access tokens, and that slide moved earlier into concept 1.
- **`c1-committed-not-published` assumes nothing.** Its source comment records
  the fix: an earlier version told the room they had been committing all along,
  which for most of them was false.

### B1 — `SCM` is never expanded

**The clearest rule-26 hit in the deck.** Slide 35 (`c2-what-triggers-it`) has a
row labelled `Poll SCM`, and the string `Source Control` appears **nowhere in
all 60 slides**.

Partly mitigated: `Poll SCM` is Jenkins's own UI label, so the room will see
those letters on screen whatever the deck says. That argues for expanding it
once in the row's own cell, not for leaving it.

**Suggested:** the cell reads *"Server asks GitHub every few minutes whether
anything changed"*, which is a good gloss of the behaviour. Add the words to the
label: `Poll SCM` with *source control* in the same cell, once.

### B2 — the `.git` folder is assumed two slides before it is created

Slide 7 (`c1-where-the-code-lives`) states the learner's code lives in
`C:\nxttrendz\.git`. `git init` appears exactly once in the whole deck, on
slide 9 (`c1-git-status`), as a **detail line inside a troubleshooting row**:
*"There is no repository yet. Run git init, then git branch -M main."*

So a learner with no repository is told at slide 7 that their code is somewhere
it is not, and the remedy arrives two slides later as a sub-line rather than as
a step. The gap is narrow and the remedy is present, which is why this is a
flow remark rather than a defect.

**Options:** make `git init` a step in its own right before slide 7's claim, or
soften slide 7 to *"your code is on this laptop and nowhere else"*, which is
true whether or not a repository exists yet and is also the sentence the slide
actually needs.

### B3 — `Pipeline` carries two meanings

- Slide 29 (`c2-assembly-mapping`) — the CI concept, mapped from an assembly
  line.
- Slide 31 (`c2-our-pipeline`) — the same concept, made concrete.
- Slide 56 (`c4-freestyle-vs-pipeline`) — **Jenkins's job type**, one of the two
  choices in the New Item screen.

Two different things share one word, and the second is a proper noun in
Jenkins's UI. Nothing is wrong at any single slide, but a learner who has spent
concept 2 learning that a pipeline is *a sequence of automated stages* meets
`Pipeline` at slide 56 as *a radio button*.

**Suggested:** at slide 56, name it as Jenkins's own term explicitly — *"Jenkins
calls this job type Pipeline, which is the same word for a different thing"* —
rather than letting the collision pass unremarked.

### B4 — `plugin` is named two slides before it is explained

First use slide 46 (`c3-setup-wizard`), explained slide 48 (`c3-plugins`,
*"What Plugins Are"*). The setup wizard genuinely shows a plugin screen, so the
early use is unavoidable; a five-word gloss at slide 46 would close it.

### B5 — three Jenkins terms appear on the agenda, and that is fine

`build`, `queue` and `executor` first appear on **slide 4, the agenda**
(`sub: 'Job, build, queue and executor'`), 47 slides before `c4-vocabulary`
defines them.

**This is not a defect.** It is exactly the case the frame-slide carve-out
proposed for content rule 24 exists to cover: an agenda's job is to signpost
what is coming, and an agenda restricted to already-introduced terms is empty on
slide 4. Recorded here as evidence for that carve-out rather than as a finding
against this deck.

### B6 — `job` is used generically before it is a Jenkins noun

`job` first appears at slide 18 in the callout *"Same job, done by two files"* —
ordinary English. It becomes a Jenkins object at slide 51 (`c4-vocabulary`).
No slide is wrong; worth knowing that the Jenkins term inherits an earlier
generic use, so the definition at 51 has to displace a meaning rather than fill
a blank.

### Term ledger, first rendered use

| Term | First slide | Glossed there? |
|---|---|---|
| `git`, GitHub | 5 `setup` | Version check only, which is the right depth for a setup slide |
| `commit` | 8 `c1-committed-not-published` | Yes, as *saving on your laptop* |
| `repository`, `branch`, `main`, `staged` | 9 `c1-git-status` | In the `git status` output the slide reads aloud |
| `git init` | 9 `c1-git-status` | Detail line only — see **B2** |
| `.gitignore` | 10 `c1-env-check` | Yes |
| `token` | 12 `c1-already-committed` | Carried in from session 6 |
| `remote`, `origin` | 16 `c1-connect-and-push` | Yes |
| `CI/CD`, Continuous Integration, Continuous Delivery | 23 `c2-ci` | **Yes, expanded** |
| Continuous Deployment | 26 `c2-cd-deployment` | Yes |
| `Pipeline` (concept) | 29 `c2-assembly-mapping` | Via the assembly-line analogy — see **B3** |
| `gate` | 34 `c2-gate` | Yes, the slide is the definition |
| `webhook` | 35 `c2-what-triggers-it` | **Yes, on-slide** |
| `SCM` | 35 `c2-what-triggers-it` | **No — see B1** |
| Jenkins, `automation server` | 38 `c3-what-is-jenkins` | Yes, though with the banned word `simply` |
| `credentials` | 40 `c3-three-reasons` | Named; defined at 51 |
| `plugin` | 46 `c3-setup-wizard` | No — explained at 48, see **B4** |
| `job`, `build`, `queue`, `executor` | 51 `c4-vocabulary` | Yes. All four appear on the agenda at slide 4 — see **B5** |
| `Freestyle` | 53 `c4-smoke-test` | Yes |
| `workspace`, `console output` | 54 `c4-console-output` | Yes |

### Method limits, stated

The extractor reads string literals out of the deck source. It will miss text
assembled from variables, and it cannot tell a gloss from a mention — every
"glossed there?" verdict above was read by eye on the slide, not derived. Two
terms returned absent on a case-sensitive first pass (`plugin`, `credential`)
and were found on a second; treat any ABSENT result as *check by hand* rather
than as proof.

---

## What is NOT in this file

- **The 12 content rule 2b violations** in session 7 (`last session` ×5,
  `session 1/4/4/5/9` ×5, plus the legitimate `Next session` frame). Reported
  separately; mechanical to fix because the session-title constants already
  exist in this deck's own `deckShared.tsx`.
- **The 10 strings over rule 26's 20-word cap**, the one `painful`, and the
  `simply` in the definition of `automation server`.
- **Structural findings** from the flow review: `c1`'s last three slides being
  `c2`'s opening, `c3` opening What-before-Why, and `c4` opening on a UI tour
  with no felt need. Those are in the review write-up, not here.

---

## Part C — the CI/CD concept, redesigned for a first-time audience

Asked for on 2026-09-09: *"I want the CI/CD explanation to be more simple and
crystal clear with proper representation, and consider UI/UX"*, and
*"this is the first time they are learning these so we must be so damn clear."*

Concept 2 is 13 slides, 23 to 35. It is not badly written — the copy is careful
and the factory analogy is a good one. It is hard for a **first-time** audience
for six structural reasons, and five of the six are about representation rather
than words.

### C1 — What makes it hard now

**1. Four definition slides arrive before any picture.**

| 23 | `c2-ci` | Continuous Integration, defined |
| 25 | `c2-cd-delivery` | Continuous Delivery, defined |
| 26 | `c2-cd-deployment` | Continuous Deployment, defined |
| 27 | `c2-three-terms` | the three, compared in a table |

`PEDAGOGY_GUIDELINES.md` section 2 is explicit that no concept is introduced by
its definition. Four abstract definitions in a row is the hardest possible
opening for somebody meeting the idea for the first time, and the table at 27
exists because the three preceding slides did not make the distinction stick.

**2. `c2-assembly-line` is titled "Picture a Factory" and contains no picture.**

Three bullets and their sub-lines. The one slide in the concept whose entire job
is to put an image in the room's head is the one with no image on it. This is
the same defect session 6 shipped on `c3-layers-travel` — *"read the panel
again"* with no panel — and it was rebuilt for exactly that reason.

**3. The analogy mapping is a `DataTable`.**

`c2-assembly-mapping` maps five factory facts to five software facts as two
table columns. An analogy is spatial: *this part corresponds to that part*. As a
table the reader has to hold both columns in working memory and pair them by
row. The kit has `AnalogyMap` for precisely this job and the concept does not
use it.

**4. The gate slide has no gate.**

`c2-iron-rules` (33) draws `GateFlow`. `c2-gate` (34), whose title is
*"It Is a Gate"*, is bullets. The figure is on the slide before the one the
figure is about.

**5. Nine of the 13 slides are bullet lists**, and three of the 13 are
`DataTable`s (27, 29, 35). For a first-time audience that is a lot of prose and
a lot of grid.

**6. It explains one unfamiliar thing with a second unfamiliar thing.**

This is the finding worth arguing about. By slide 22 the room already owns a
concrete "before" picture: `c1-day-in-the-life` (19) walks what shipping one
small change costs them by hand, and `c1-what-goes-wrong` (20) names four ways
it fails. That is **their own experience**, and it is the best analogy available.

The factory then asks them to hold assembly lines, stations, craftsmen and
showrooms as well, and to map that back. `PEDAGOGY_GUIDELINES.md` section 9 says
to anchor abstractions in **named real products the learner already uses**. A
car plant is not one of those.

### C2 — Proposed shape: 13 slides to 8, picture first

The concept's single idea, stated for a first-timer: **a robot does what you do
by hand, on every push, and it stops the moment something fails.** Every term in
the concept is vocabulary hung on that one sentence, so the sentence gets a
picture before any term gets a definition.

| # | Slide | Type | What it does |
|---|---|---|---|
| — | *(keep 19-21 as they are)* | — | The manual cost, the four failures, and the question. Concept 2's opening already lives at the end of concept 1 and works |
| 1 | **A Robot That Watches** — NEW | `SpineFlow` | ONE picture, NO vocabulary: `you git push` → a machine runs *your* four commands → it stops if one fails. Uses the commands from slide 19, so nothing new appears |
| 2 | **That Routine Has a Name** | `ContentNoteSlide` | `pipeline`, attached to the picture just seen. One term, one slide |
| 3 | **How Far It Goes** — NEW FIGURE | *(see C3)* | CI, Continuous Delivery and Continuous Deployment as **three stop-points on one chain**, revealed one per click. Replaces slides 23, 25, 26 and 27 |
| 4 | **Two Iron Rules** | `GateFlow` | Merges 33 and 34. The gate is the figure and the two rules are its points, so the slide about the gate has the gate |
| 5 | **It Is Your Makefile** | `CodeBlock` | Keep, with the Part A1 correction |
| 6 | **Everyone Ships This Way** | `ContentSlide` | Keep. One slide of social proof, unchanged |
| 7 | **What Starts a Run** | `DataTable` | Keep, with `SCM` expanded per Part B1 |

Cut: `c2-ci`, `c2-ci-promise`, `c2-cd-delivery`, `c2-cd-deployment`,
`c2-three-terms`, `c2-assembly-line`, `c2-assembly-mapping`, `c2-gate` — eight
slides, replaced by three.

**`c2-ci-promise` ("Minutes, Not Days") is the one cut worth regretting.** It
carries the payoff number. Fold its line into slide 1's caption rather than
losing it.

### C3 — The one new figure this needs

Nothing in the registry draws *one chain with three stop-points*. `SpineFlow` is
the closest and has no notion of a variant that stops early; `TrackSwitch` is
for a loop rejoining; `GateFlow` is for a single check.

What is needed: a left-to-right chain of the pipeline's stages, with **three
labelled markers** showing how far the automation reaches under each of the
three terms. The teaching value is that the three differ **only** in where the
automation stops, which a diagram states in one glance and three definition
slides can only assert.

Per content rule 14 this is a lab: build candidates, pick one, register it, and
raise it as a PR. Suggested candidates —

- **StopPoints** — one chain, three vertical markers with the term on each.
- **NestedSpans** — three brackets ABOVE the chain, each spanning further right,
  so containment is drawn rather than stated (CI ⊂ Delivery ⊂ Deployment).
- **ThreeLanes** — the same chain three times, each lane greying out after its
  own stop-point. Most explicit, costs the most height.

`NestedSpans` is the strongest guess, because the actual relationship between
the three terms is containment, and no other candidate draws that.

### C4 — Reveal discipline is what makes 4 slides into 1

Content rule 25 requires one new element per slide, so collapsing four slides
into one only works if the figure **builds**. Slide 3 must reveal one stop-point
per click: the chain, then CI, then Delivery, then Deployment. Four beats, one
frame, rule intact.

This is the mechanism that makes the whole proposal legal rather than a
shortcut, and it is worth stating in the slide's own source when it is built.

### C5 — What this does NOT change

- Concept 2's **name**, `What CI/CD Is`, still describes it.
- The **`CI/CD` expansion at first use** survives: whichever slide first prints
  the letters spells them out. That fix cost session 5 six slides and must not
  be lost in a re-cut.
- Concept 2 still **opens on a felt need**, because slides 19 to 21 already
  provide it from concept 1's tail. The re-cut removes definitions, not the
  motivation.

### C6 — APPLIED on 2026-09-09

Concept 2 ran 14 entries (divider, 12 content slides, the mid-deck quiz). It now
runs 9: divider, 7 content slides, quiz. Deck total 62 → **56**.

| # | Slide | Status |
|---|---|---|
| 1 | `c2-a-robot-that-watches` | **NEW.** `SpineFlow` on `PIPELINE`, no vocabulary in the copy. `c2-ci-promise`'s payoff line folded into the caption and the notes |
| 2 | `c2-our-pipeline` → *"That Routine Has a Name"* | Rewritten. Was picture-and-definition on one frame; now the name only, attached to the picture just seen |
| 3 | `c2-how-far-it-goes` | **NEW.** `ThreeLanes`. Replaces four slides |
| 4 | `c2-iron-rules` | Merged with `c2-gate`: the gate's definition is now the caption of the figure that draws it |
| 5 | `c2-your-makefile` | Kept, with the A1 correction already applied |
| 6 | `c2-who-works-this-way` | Kept, moved after the Makefile slide per the C2 order |
| 7 | `c2-what-triggers-it` | Kept, with the B1 `SCM` expansion already applied |

**Cut:** `c2-ci`, `c2-ci-promise`, `c2-cd-delivery`, `c2-cd-deployment`,
`c2-three-terms`, `c2-assembly-line`, `c2-assembly-mapping`, `c2-gate`. Eight
slides for three.

The factory went with them, finding 6: `c2-assembly-line` was titled "Picture a
Factory" and had no picture, `c2-assembly-mapping` was the analogy as a
`DataTable`, and both asked the room to hold assembly lines and craftsmen on top
of the thing being explained. What replaces the analogy is the room's own
experience, which `c1-day-in-the-life` and `c1-what-goes-wrong` already put on
screen two slides earlier.

### C7 — the figure: `ThreeLanes`, not `NestedSpans`

This file guessed `NestedSpans`, "because the actual relationship between the
three terms is containment, and no other candidate draws that". That guess was
**overruled by the user**: stacked rows are the convention, not brackets, and
the differentiator that had to be drawn was the **human approval marker**
between delivery and deployment.

`slide-kit/cicd-reach-lab` built four candidates against one contract
(`cicdReach.ts`): `StopPoints`, `NestedSpans`, `ReachBands` and `ThreeLanes`.
`ThreeLanes` won on two arguments the others do not have:

1. **It is the published convention.** Atlassian, Red Hat, AWS Prescriptive
   Guidance, CircleCI, IBM and Bitrise all draw one chain with the three
   practices as rows reaching successively further right. A learner who reads
   any article after this session meets the same diagram.
2. **It asks no lookup of the viewer.** The other three draw reach as an
   abstraction OVER a single chain, so a reader carries a bar or bracket's right
   end back up to the stage above it. Here every lane states its own outcome for
   every stage in place.

It costs height, and the height is the reason slide 3 carries no `points`: 394px
measured, against the 425px ceiling where a composite's top edge starts centring
into the instructor-video reserve. `ReachBands` is the same convention in 276px
and stays in the lab, worth promoting if a future deck needs the height back.

Promoted to the kit (`src/ui/ThreeLanes.tsx` plus `ReachChain`, `ApprovalMark`
and the `cicdReach` contract), exported from the barrel, added to
`sampleDeck.tsx` and registered in `slide-kit/slide-types/README.md`. **A PR,
not a direct merge**, because `sync-kit.mjs --apply` pushes it into every
session including signed-off ones.

### C8 — rule 25 is satisfied by the build, and that is not a formality

`ThreeLanes` reveals one lane per click: chain, CI, Delivery, Deployment. Four
beats on one frame. That is the mechanism that makes four slides into one
legally rather than by compression, and it is stated in the slide's own source
so a later reader cannot mistake it for a shortcut.

### C9 — one defect found while doing this

`RITUAL`, the six-step manual ritual on `c1-day-in-the-life`, labelled a step
**`make test`**. `c2-our-pipeline`'s own comment already recorded that no
session ever wrote a `test` target, and that finding had been applied to the
pipeline slide's caption and nowhere else, leaving the slide that introduces the
ritual FIRST claiming a command the room does not have.

The step is now `Run the tests`, naming no command, which matches the review
instruction that tests go no further in this session than "we can add tests to
check before deploying". `c1-day-in-the-life`'s caption changed with it, from
"Steps 3 to 6 are the same commands" to "the same routine".
---

## Part E — applied on 2026-09-09, the only edits made to the deck

Two removals, asked for by name, so the freeze clause's condition was met.

### E1 — the setup slide's GitHub line

`jenkinsCicdDeck.tsx`, the `setup` slide. Removed:

- **"created BEFORE the session"** from *"A free GitHub account, created BEFORE
  the session"*. Same fault session 6's setup slide carried and had corrected on
  the same review: a pre-flight check claiming the room did something they were
  never asked to do.
- the sub-line **"It needs an email confirmation, so making it now costs the
  room ten minutes"**. That is stage direction for the instructor rather than a
  check the learner performs, and `notes:` is where it belongs.

The point now reads `A free GitHub account` and nothing else.

### E2 — THE GAP THIS LEFT, closed on 2026-09-09

**Nothing in this deck instructs GitHub signup.** A search for "sign up",
"create an account" and `github.com/signup` across all 60 slides returns
nothing. `c1-empty-repository` opens on *"On github.com: New repository, name it
nxttrendz, choose Public"*, which assumes the account already exists.

This is precisely the gap session 6 had with Docker Hub, and it was closed there
by turning `c1-the-account` into an instruction — *"Open hub.docker.com and sign
up now"* — with the account created inside the session and signed into two
slides later. Session 7 has no equivalent slide.

So after E1 the deck asks for a GitHub account in its setup checklist and never
tells the room how to get one. The honest options, both content decisions:

1. **Add a signup step**, mirroring session 6's `c1-the-account`: one slide, or
   two points on `c1-empty-repository`, before the repository is created.
2. **Keep it as a stated prerequisite** the instructor announces beforehand, and
   say so in `notes:` rather than on the slide.

Option 1 is what session 6 chose, for the reason that a deck read from a
recording has no instructor to announce anything.

**Option 1 was taken.** New slide `c1-the-github-account` ("Create Your
Account"), placed immediately before `c1-empty-repository`, mirroring session
6's `c1-the-account` point for point: sign up at `github.com`, the username you
pick is your GitHub username, and `ravi123` is only an example. The warning
callout carries the email confirmation, which is the part that actually costs a
room ten minutes.

The setup slide's row was rewritten with it, from a claim to a check:
*"A GitHub account, if you already have one"*, sub *"No account yet is fine, and
we create one together before the first push"*. It no longer asserts a state
nobody was asked to reach.

---

## Part F — everything else applied on 2026-09-09

### F1 — `git init` is a first-class step

Asked for by name: *"in publishing code first we need to do git init."* This is
plan finding **B2**, confirmed.

`git init` appeared exactly once in all 60 slides, as a detail line inside a
troubleshooting row on `c1-git-status`. So the deck's treatment of the very
first step of publishing code was one arm of a two-way diagnosis, offered to a
room the deck's own comment says has mostly never committed anything.

New slide **`c1-git-init`**, after `c1-committed-not-published`: `git init` and
`git branch -M main` with git's real output, run by everyone, unconditionally.
Reinitialising an existing repository changes nothing, so nobody has to work out
which case they are in.

`c1-git-status`'s warning row narrowed with it. The "no repository yet" arm
cannot happen after this slide, so the row now names the cause that can: the
wrong folder.

**One layout note.** The slide carries no `points`. `ContentSlide` lays points
and children out as two columns, and in half a stage git's own success line
wraps: `align-check` flagged *"Initialized empty Git repository in
C:/nxttrendz/.git/"* as one token over two lines. The output is real and cannot
be shortened, so the two teaching points live in the lead and the caption. Same
call and same reason as `c3-unlock`.

### F2 — the content rule 2b sweep, done

All 13 rendered strings naming another session are gone. Comments and `notes:`
keep theirs, which rule 2b explicitly permits.

| Was | Now |
|---|---|
| `Last session the image got a home that any machine can reach` | `Your images have a home on Docker Hub that any machine can reach` |
| `You are signed in to Docker Hub from last session` | `You are signed in to Docker Hub`, sub `If the sign-in has expired, run docker login before we start` |
| `Last session gave your images a home. Your code still has none` | `Your images have a home on Docker Hub. Your code still has none` |
| `the .gitignore line from session 4 is missing` | `.gitignore is missing its .env line` |
| `You already have one, written in session 4` | `Your project already has a .gitignore` |
| `last session's two commands wearing different clothes` | `Pushing code takes the same two steps that pushing an image took` |
| columns `Images, last session` / `Code, today` | `Images, to Docker Hub` / `Code, to GitHub` |
| `You wrote both, in session 4 and session 2` | `Your project already has both files` |
| `We set one up in session 9` | `we set one up once the pipeline lives in a file` |
| `exactly like pgdata did for the database in session 3` | `exactly like the pgdata volume does for the database` |
| `You met it in session 1` | clause dropped from the caption |
| plugin table's `Used in` column: `Session 8` / `Session 9` / `Session 8` | **column removed** |
| `where automatic image tags come from in session 9` | `where automatic image tags come from once a pipeline builds the image` |

The plugin table's third column is the one that could not be reworded: every
content-terms version of it repeated column two verbatim, because the column
carried nothing but session numbers. Two columns now.

### F3 — the rule 26 sweep, done

Eleven rendered strings recut to the 20-word and two-comma caps, including the
`painful` and the `simply` the audit named. Two of them moved an argument into
`notes:` rather than dropping it: `c2-gate`'s "not only automation that saves
you typing", and `c3-unlock`'s reason for hiding the password in the container.

**Three strings are over the comma cap and are staying.** All three are
enumerations rather than sentences: `Job, build, queue, executor`; `New Item,
name it hello-jenkins, pick Freestyle project, click OK`; and the appositive
`#1, #2, #3` inside the run-numbers sub-line. The cap exists because "past
that, the reader is holding too much before the sentence resolves", and a list
resolves item by item. Recorded here so the next audit does not re-open them.

### F4 — the kit's own defects, found by building on it

Two figures were sized for the widest graph they can draw rather than the graph
in front of them, and no harness could see either, because both faults live
INSIDE a box the harness measures as correctly placed.

| Figure | Fault | Fix |
|---|---|---|
| `SpineFlow` | A flat 372px stage, sized for a graph with an off-spine exception row at y=232. A purely linear graph draws nothing in that band and still paid for it, so `c2-a-robot-that-watches` rendered with a 190px hole between the chain and its own caption | Height derived per render: 372px branched, 208px linear, caption at `H - 22`. Only graphs with no off-spine node change |
| `GateFlow` | A flat 1100px stage sized for five spine slots, and an exception arrow that always aimed at the retry card's RIGHT edge. Session 7's gate has three slots measuring 504px, so the figure sat 260px left of centre; and with no loop edge the retry card parks under the gate, so the arrow ran rightward past it and left an arrowhead pointing at nothing | Width derived from the `slots()` walk with the left margin repeated right, so `mx-auto` centres any spine length. The exception path now has three cases: card left of the gate, directly below, or right of it. Directly below drops straight into the card's top edge |

`ThreeLanes` had a third fault of the same family: it accepted `caption` through
the shared `CicdReachProps` and never rendered it, so the verdict line passed to
it from `c2-how-far-it-goes` was silently dropped and every harness passed,
because a string that is never in the DOM cannot overflow, wrap or drift. Its
props are now `Omit<CicdReachProps, 'caption'>`, which makes passing one a
typecheck error — and it immediately caught a second call site in
`sampleDeck.tsx`. The verdict moved onto the `then` line of the term it is about.

**All three are kit changes and belong in the PR**, because `sync-kit.mjs
--apply` pushes them into every session including signed-off ones. Only the kit
and session 7 carry them today.

---

## Part G — the design pass, 2026-09-09

Asked for: *"redesign the slide design elements with latest and best
representation."*

### G1 — session 7 is now on the current kit

It was **15 kit files behind**, so "latest" started there rather than with any
slide. `sync-kit.mjs --apply` brought `ContentSlide`, `StatusPointsSlide`,
`QuestionSlide`, `BoundaryBridge`, `sampleDeck`, the barrel and `qa.mjs` up to
date, and added `Tech`, `BracedRun`, `CountBadge`, the `annotated*` pair and the
`isolation/` family, none of which this deck could reach before.

**One consequence to expect:** the kit's `qa.mjs` carries the 16px font-floor
check, so this session's `qa` baseline gains the same `Code`-chip findings
session 6 reports. That check is still uncalibrated (`Code` is `0.94em`, which
lands at 15px in body contexts) and is on the held kit queue.

### G2 — the deck's own `Tech` was the logo-alignment bug, on nine slides

`deckShared.tsx` carried a local `Tech` built on `inline-flex`. That is the exact
fault `slide-kit/slide-template/src/ui/Tech.tsx` exists to prevent: an
inline-flex box aligns its BOTTOM edge to the surrounding baseline, so the logo
AND its label both ride below the words either side of them. The kit file's own
header names sessions 3, 4, 6 and 7 as the four decks that did it, and session
6's review is where it was caught — *"the alignment of the sentence when a logo
is used like docker is missing"*.

All nine call sites now use the kit component, which keeps the label in ordinary
inline flow and nudges only the image. The API is `label` rather than children,
so every call site changed shape. The local version is replaced by a tombstone
comment so it does not come back.

### G3 — two slides where the argument was spatial and the slide was prose

| Slide | Was | Now | Why |
|---|---|---|---|
| 8 `c1-committed-not-published` | Note + two bullets | `LoneHost` at 900px, with a ruled conclusion line | The claim is *the commit is HERE and nowhere else*, which is a spatial claim. `isolationFigure.ts` names session 6's equivalent slide as the case it was built for. Empty frames rather than dimmed ones, because a severed connector draws a relationship where an empty slot draws none. Both halves of the distinction survive: "committed" is the holder's own note, "published" is the ruled line |
| 19 `c1-same-two-steps` | Three-column `DataTable` | `SwapRows` | The claim is *the image commands STAND IN FOR the code commands*, which has a direction, and `compareFigure.ts` says a directional claim is what this figure is for while a table asserts none. As three columns the pairing was three cells the reader had to collect and pair by row, the same fault `comparison-lab` recorded against `AnalogyMap` |

### G4 — slides deliberately left as prose

Recorded so the next pass does not re-open them.

- **46 `c4-the-screen`** is a four-item menu tour. There is no Jenkins dashboard
  figure and there are no shots in this deck at all; `c3-screens-drift` says why,
  and a drawn near-miss of a real UI would break illustration honesty. Bullets
  with icons are the honest representation of four names on a menu.
- **34 `c3-what-is-jenkins`**, **36 `c3-three-reasons`**, **48 `c4-the-trap`** are
  a definition, three reasons and a redefined word. Each already carries its
  claim in a note with the consequences as points; a figure would restate prose.
- **43 `c3-screens-drift`** and **51 `c4-where-you-will-live`** are one-sentence
  frames on purpose, which is a device this deck uses deliberately.
- **7 `c1-where-the-code-lives`** keeps its `DataTable`: two rows with identical
  columns IS the same-shape comparison section 7 asks for, and the symmetry is
  the argument.
- **16 `c1-the-github-account`** and **26 `c2-our-pipeline`** carry no figure by
  design: the first mirrors session 6's account slide, and the second names the
  picture the room saw one click earlier.

### G5 — `align-check` was wrong about a wrap, and the harness got the fix

The `SwapRows` slide was reported as `WRAPPED  one token over 2 lines: "docker
tag ravi123/..."`, and the screenshot showed it on one line. Measured: one client
rect, and a content box two lines tall.

The cause is `SwapRows` itself, legitimately. Both halves of a pairing sit in one
grid row, and the right half carries a command AND a gloss under it, so the grid
stretches the one-line left half to match. The check divided the content box by
the line height, so a stretched cell read as a wrap.

The file already carried the same class of bug once, from padding, with four
session 3 false positives recorded in its own comment. Subtracting padding fixed
that cause and not this one, because **a box is the wrong thing to measure**. It
now asks the TEXT: a `Range` over the text node returns one rect per line box,
which no amount of padding, stretch or alignment can inflate. The box arithmetic
stays as the fallback for the case a Range cannot answer.

The slide was not changed. That matters: the first two remedies I reached for
were shortening the command and dropping the gloss, and both would have damaged
a correct slide to satisfy a broken check.

**A kit change, so it belongs in the PR.** Session 6 will pick it up on its next
sync; it currently reports 0 of 51 either way.

### G6 — the preview contact sheet was showing three slides that do not exist

`preview.mjs` created its frame directories and never cleared them, so a frame
from a run with a higher slide number survived. `build-preview-page.mjs` derives
its headline count from the files on disk, which is the fix for it having once
hardcoded "35 slides" above a grid of 48 — but a derived count is only honest if
the directory is.

This deck went 59 slides → 56, and the contact sheet reported **59**: the newest
56 frames written at 14:56, three ghosts left behind at 14:14. A stale frame is
worse than a wrong number, because it is a picture of a slide the deck does not
have and it is indistinguishable from a real one.

`preview.mjs` now `rmSync`s `slides/`, `motion/` and `thumbs/` before capturing.
Re-run: **56 slides, 56 files.** A kit change, so it is in the PR.

### Slide count

60 → **56**. `deck.config.json` updated, and every harness reads it.

---

## Part H — the Jenkins captures and two new rules, 2026-09-09

Part G recorded that this deck had **no shots at all** and that slide 46 was
left as a menu tour for exactly that reason. That is no longer true. A real
Jenkins was run, five screens were captured from it, and the invented console
transcript was replaced by the build log the instance actually wrote.

### H1 — a real Jenkins, so the deck stops guessing

Jenkins **2.568.3** was run locally from the `jenkins/jenkins:lts` image:

```
docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home
```

The setup wizard was completed with admin user `admin`, and the `hello-jenkins`
freestyle job was created **through the UI** rather than through config, with an
Execute shell step containing `echo "Jenkins is alive!"` and `date`, then run
with Build Now. Creating it through the UI is the point: the New Item and
Execute shell captures have to be the screens the learner will actually meet.

### H2 — the console transcript was wrong in three ways

Found by reading the real log at
`/var/jenkins_home/jobs/hello-jenkins/builds/1/log` and diffing it against what
the slide claimed.

| Was | Really | Why it matters |
|---|---|---|
| No `[hello-jenkins] $ /bin/sh -xe /tmp/jenkins<random>.sh` line | Every freestyle shell step prints it | It is the line that **explains the `+` prefixes underneath it**. Jenkins writes the commands into a temp script and runs it with `sh -xe`; the `-x` echoes each line as it runs. Without it the `+` marks are unexplained noise |
| `+ echo 'Jenkins is alive!'` | `+ echo Jenkins is alive!` | `sh -x` reprints the command **after** the shell has already removed the quotes, so the quotes are not there |
| `Started by user ravi` | `Started by user admin` | That name is the learner's own admin username, and `admin` is what the wizard in H1 creates |

### H3 — that slide was a `Terminal` panel and should not have been

Asked on review: *"why is VS Code's console used?"*

`Terminal` draws VS Code's `PROBLEMS · OUTPUT · TERMINAL` tab strip, and hard
rule 3 scopes that component to commands the learner **types**. Jenkins' Console
Output is a browser page nobody types into, so the chrome was asserting a
terminal the room is not in.

The `Terminal` slide was merged into the screenshot slide, which now carries id
`c4-console-output`. Deck went **62 → 61**.

### H4 — five real captures, with measured highlights

Added under `public/shots/`, all PNG at **2x device scale**, each cropped to the
region its slide is about:

| Shot | Slide it serves |
|---|---|
| `jenkins-dashboard` | the dashboard tour |
| `jenkins-new-item` | creating the job |
| `jenkins-execute-shell` | the Execute shell step |
| `jenkins-build-1-green` | the first green build |
| `jenkins-console-output` | `c4-console-output` |

Every `Shot` highlight box was **measured** from the target element's own
bounding rect by script and converted to a percentage of the crop. None was
eyeballed, because an eyeballed box on a 2x crop is off by more than the element
is wide.

**Four of the five highlight labels were removed.** `Shot` places a label
directly below the box, and at these crops that position either clipped at the
image edge or covered the very lines the box is pointing at.

### H5 — two captures had to be retaken

Both first attempts were pictures of a *used* instance, which is not what the
learner is looking at.

- **New Item** showed Jenkins' error *"a job already exists with the name
  hello-jenkins"*, because by then the job existed.
- **Dashboard** showed the job sitting in the table while the caption claimed an
  empty dashboard. That is **content rule 8** broken: the caption asserted
  something the image contradicts.

Fix: the job was deleted, dashboard and New Item were captured clean, then the
job was recreated from its own saved `config.xml` and rebuilt. That rebuild is
why the console transcript's temp-script number and timestamp changed with it,
and why H2's transcript is read from build 1 of the recreated job.

### H6 — a new illustration slide, `c4-job-vs-build`

Asked on review: *"for explaining slide 48 a proper illustration should be
present not just a table, an illustration follows next with a table slide would
work."*

Inserted **before** the `c4-vocabulary` table. It uses `FanOut`: the source is
the job drawn quiet and dashed, and the copies are Build #1, #2, #3 with `live`
on the third.

### H7 — content rule 27: an illustration is researched before it is drawn

Added to `.claude/skills/slide-content-rules/SKILL.md`, indexed in `RULES.md`.
The rule is that the form is researched first, and **the slide source says why
that form and not the obvious alternative**.

Evidence cited in the rule, all of it from decks that shipped or nearly shipped
wrong:

- **Session 7's own plan** guessed `NestedSpans` for the CI/CD reach and was
  overruled by the user in favour of stacked rows plus a human approval marker,
  which a lab then confirmed as `ThreeLanes`.
- **Session 5's** `AnalogyMap` rejection.
- **Session 4's** overlapping SVG labels.

### H8 — rule 27 applied to `c4-job-vs-build`

The research found the four words in the vocabulary table are **two claims, not
one**:

| Claim | Shape |
|---|---|
| job vs build | one-to-many |
| queue vs executor | a queue and a set of servers |

Jenkins' own docs model capacity as executor **slots**, where *"a machine either
has a free slot or it doesn't"*, and call agents *"the workers that perform
operations"*. The clearest published gloss is that queue and executor are *"as
different as a todo list is from the person actually doing the tasks"*.

Crucially, **Jenkins already draws the second claim on the dashboard the room is
looking at**, as the two panels `Build Queue` and `Build Executor Status 0/2`,
both visible in the `c4-dashboard-tour` capture from H4. So queue and executor
are taught on the real dashboard and in the table, and are **deliberately left
out of the figure**. The one-to-many half uses the registry's existing `FanOut`.

**No new component was justified.** `SpineFlow` was rejected because it reads as
a sequence, and `ThreeLanes` because it asserts containment.

### H9 — content rule 28: the quiz frame says "Quiz Time!" and nothing else

Both session 7 quiz frames had their subtitles removed. The mid-deck one read
*"five stages, two rules, and the difference between delivery and deployment"*,
which **previewed three of the answers** on the frame immediately before the
questions.

`QuizTimeSlideProps.subtitle` **stays in the kit type**. Removing it would break
every delivered session that compiles against it; the rule governs what is
passed, not what exists.

### Slide count

56 → **61** with the five capture slides and `c4-job-vs-build`, after the
`Terminal` merge in H3 took it 62 → 61. `deck.config.json` updated, and every
harness reads it.
