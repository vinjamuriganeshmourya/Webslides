<!-- cSpell:ignore cicd travelled crossfade youve pullable nxttrendz deployement -->
<!-- cSpell:ignore nxttrendz deployement NxtWave colour colours behaviour dockerignore Makefile makefile PHONY runserver venv Vite ravi createsuperuser -->
# Deployment · Session 6: "Pushing Image to Docker Hub"

**STATUS: SIGNED OFF 2026-08-26 · NOT YET GENERATED**

Signed on sight, with two standing instructions carried in from session 5:
**no quiz frames anywhere in this deck**, and the closing frame is Key Takeaways
→ Next session → Thank you, with no separate Recap slide.

Three TR patches in §6 are the only things still needing a yes or no, because
they change the source doc rather than the deck.

| | |
|---|---|
| `SESSION_NAME` | `Pushing Image to Docker Hub` (footer mark only, kicker on every content slide, never "Session 6") |
| `COURSE` | `React + Django Integration · Deployment` |
| `TR_DOC` | `/home/nxtwave/docker_jenkins_aws/06_pushing_docker_images_to_docker_hub.md` (446 lines) |
| Project | `deployement_session_6/`, to be scaffolded from `slide-kit/slide-template` |
| Deck file | `src/decks/dockerHubDeck.tsx` |
| `htmlName` | `deployment-session-6` |
| Slide count | **53** |
| `devPort` | `5217` (5211 kit and sessions 1 to 3, 5215 session 4, 5216 session 5) |
| `NEXT_UP` | `Introduction to Jenkins` (source doc `07_introduction_to_jenkins_and_cicd.md`, whose own title is longer; the frame carries the short name) |
| Build rules | `workflow/skills/session-6-deck/SKILL.md`, created before generation |

446 TR lines is the longest source since session 4's 845. Session 5 was 362
lines and shipped 51 slides, so 53 here is the same density, not a bigger deck:
the extra TR length is tables and transcripts, which compress onto fewer slides
than prose does.

---

## 1. Concept map

**Four concepts, one per TR section.** The TR's own `IndexList` names exactly
four, and each is a self-contained beat, so nothing is merged and nothing is
split. Concept 1 is deliberately the longest: the TR spends seven subsections
establishing *why* an image should leave the laptop before it shows a single
push command, and that ordering is the session's whole argument.

| # | Concept (agenda wording) | TR sections | Ends on the question that opens the next |
|---|---|---|---|
| 1 | Images Trapped on One Machine | 1.1 to 1.7 | The image should go to Docker Hub. Why can't it be pushed under the name it already has? |
| 2 | Image Naming and Tagging | 2.1 to 2.3 | The name is right. What are the commands that actually move it? |
| 3 | Login, Push, Pull | 3.1 to 3.3 | It travelled. What happens when the next build reuses the same tag? |
| 4 | Versioning, and a push Target | 4.1 to 4.8 | Everything is automated except the human. Who replaces them? |

Every divider is written as the question it answers, so the instructor can hand
over to it verbally.

---

## 2. The narrative spine

One sentence per beat, the through-line the instructor speaks:

1. Five sessions in, `make build` produces a working image in one word. Ask the
   question the whole session hangs on: where does that image actually live?
2. On this laptop, and nowhere else. A teammate cannot run it, an automation
   server cannot test it, the AWS server this course ends on cannot deploy it.
3. So "runs identically on any machine" is true only for machines that **have**
   the image, and right now that is exactly one.
4. Before shipping it, know what it is. 156MB against a few hundred kilobytes of
   Python: the other 155MB is a complete Linux environment with the app already
   installed in it.
5. The proof is `node_modules`: `.dockerignore` blocked the laptop's copy, and
   `RUN npm install` built a fresh one inside. The image does not carry your
   machine, it carries an environment built correctly for itself.
6. Just as important is what is left out: no `.env`, no `SECRET_KEY`, no
   `db.sqlite3`. That omission is what makes a public push safe.
7. Which gives the image its defining property: everything needed to run the
   app, nothing that ties it to the machine that built it.
8. A fair objection: the code already has a home in Git. But a repository ships
   text and asks every machine to rebuild and hope; an image ships the result.
9. And the place to put it has been in every build already. `python:3.13-slim`
   and `node:20-alpine` are pulled from Docker Hub. Today the direction reverses.
10. Try to push it as it is, and it is refused. A name with no username is
    assumed to be `library/`, Docker Hub's reserved namespace for official
    images, and nobody pushes there.
11. So the real name has three parts, `<docker-id>/<repository>:<tag>`, and
    `docker tag` adds one to an image that already exists. No rebuild.
12. Then the cycle, three commands: log in once per machine, push, and pull on a
    machine that has never seen the code. The environment travelled inside.
13. Read the push output: layers, not a blob, and the base layers say `Mounted
    from library/python` because Hub already has them. The layer system pays off
    a second time.
14. Now the trap. Push the same tag twice and the old build is gone: a tag is a
    movable pointer, not a snapshot. `latest` makes it worse by sounding safe.
15. So every build gets a unique tag, and `latest` moves as a convenience. What
    that buys is rollback, which is one command on the server.
16. Tag-and-push is four commands, which is exactly what a Makefile is for. Add
    a `push` target, and override `VERSION` from the command line per release.
17. Meet the push-without-login error on purpose, because its text is identical
    to the wrong-namespace one and the room will otherwise debug the wrong thing.
18. Six sessions in, every piece is automated except the human. Someone still
    has to notice the code changed. Next session replaces that someone.

---

## 3. New vocabulary, and where it is defined

| Term | First defined on | In one line |
|---|---|---|
| local image store | 7 | The place on your machine where built images live, and the only place until today |
| registry | 17 | A service that stores and distributes images, which every `FROM` line has been pulling from |
| Docker Hub | 18 | The default public registry, free for public repositories |
| Docker ID | 19 | Your Hub username, and the namespace your images must carry |
| repository | 20 | One per app, holding that app's versions, under your Docker ID |
| tag | 24 | The label after the colon that says which version, defaulting to `latest` |
| `library/` | 23 | Docker Hub's reserved namespace for official images, which you cannot push to |
| access token | 31 | A credential used instead of a password, and what a machine gets rather than your real password |
| movable pointer | 41 | What a tag actually is: pushing the same tag replaces what it points to |
| rollback | 45 | Running a previous tag, which unique tagging is what buys you |

Deliberately **not** redefined: image, layer, container, `FROM`, `COPY`, `CMD`,
`WORKDIR`, `.dockerignore`, volume, target, `.PHONY`, Make variable. All belong
to sessions 2 to 5, and slide 3 recaps the Makefile they arrive with.

---

## 4. Slide-by-slide plan

Legend for **Assets**: `kit` = already in `src/ui`, `new` = built for this deck,
`png` = from `slide-kit/assets/tech/`, `TR` = transcript quoted from the TR doc.

Titles are **topic-bare and two to four words**, per `TEXT_GUIDELINES.md` §1 and
§4. The section name is the kicker on every content slide, so a title never
restates which concept it is inside. Where the same artifact grows across
consecutive slides the title repeats verbatim (`Makefile` on 46 and 48).

The **Motion** column names a real effect from
`.agents/skills/animation-vocabulary`, not "fade in", and every entry obeys
`.agents/skills/animate`: entrances are `ease-out` on the kit's house curve
(`easing.soft`, which is that skill's strong `--ease-out`), transform and
opacity only, nothing over 300ms, and no `scale(0)` anywhere. §5.5 records the
three places that decision changes what the plan asks for.

### Front frame (1 to 5)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 1 | `brand` | (mark only) | `BrandSlide` | NxtWave mark + course | Brand fixture | crossfade | kit |
| 2 | `welcome` | Pushing Image to Docker Hub | `WelcomeSlide minimal` | kicker `WELCOME TO TODAY'S SESSION`, session name, nothing else | Bare hero | crossfade | kit |
| 3 | `recap-makefile` | Where we Left Off | `ContentNoteSlide` + `CodeBlock` | Last session's finished `Makefile`: `.PHONY`, `IMAGE_NAME = nxttrendz-backend`, and the seven targets. Note, `Remember`: every operation the project supports now has a one-word name | Their own file, so the session opens on what they wrote. `language="makefile"`, real tabs | code panel and note as one **orchestration**, panel first | kit |
| 4 | `agenda` | Today's Agenda | `AgendaSlide` | The four concepts from §1 as 2 to 4 word pills, one gloss line each | Agenda fixture | curve **line drawing**, items **stagger** off it | kit |
| 5 | `setup` | Initial Setup | `ContentSlide` + `Terminal` | `Run these terminal commands step by step :` then one panel at `C:\nxttrendz`: Docker Desktop running, `docker --version`, `make build` succeeds, `docker images` lists `nxttrendz-backend`. Third bullet: a free `hub.docker.com` account, created before the session | The four things the session depends on, in the folder they must run from. Each command states what it prints | panel **slide in** from below on entry | kit, TR |

The Hub account is on the setup slide on purpose. It needs an email
confirmation, and a room discovering that at slide 30 loses ten minutes.

### Concept 1: Images Trapped on One Machine (6 to 20)

Opens on the felt need, not a definition (`PEDAGOGY_GUIDELINES.md` §2): find the
image, find that it is stuck, then earn the registry. The TR's seven subsections
are the argument for pushing at all, and cutting them turns the session into
command-copying.

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 6 | `c1-divider` | Images Trapped on One Machine | `SectionBreakerSlide` | index 1, subtitle *And the registry that frees them* | Divider, navy stage | crossfade + mark | kit |
| 7 | `c1-where-does-it-live` | Where It Lives | `ContentSlide` + `Terminal` | `docker images` and its output: `nxttrendz-backend  latest  3f2a8b91c04d  156MB`. Lead names the question: the image exists, so where is it? | The answer is in a transcript, so the transcript is the slide | transcript **slide in**, then the size **pulse** once | kit, TR |
| 8 | `c1-and-nowhere-else` | And Nowhere Else | `ContentSlide` | Three bullets, each a machine that cannot have it: a teammate, an automation server, the AWS server this course ends on. Closing beat: *runs identically on any machine* is true only for machines that **have** it, and that is one | The promise from session 1, held against reality. Text only, because the three losses are the whole slide | **stagger**, closing beat last | kit |
| 9 | `c1-question` | (question) | `QuestionSlide` | *156MB, and your Python code is a few hundred kilobytes. What is the other 155MB?* Qualifier: the same build, every time, on any machine | The pause beat before the anatomy. One question, card style | card **scale in** from 0.97, mark parallel | kit |
| 10 | `c1-inside-the-image` | Inside the Image | `ContentSlide` + `LayerStack` | The backend image as four layers, bottom up: Python 3.13 + Debian (`FROM`), installed requirements (`RUN pip install`), your Django code (`COPY`), `WORKDIR` + `CMD`. Lead: read the Dockerfile as a list of ingredients | A stack, because the image is literally stacked and the room met layers in session 2 | layers **stagger** bottom to top, 60ms apart | kit, png `python` |
| 11 | `c1-what-it-saves` | What It Saves | `ContentSlide` + `DataTable` | Four rows: *Inside the image* → *Put there by* → *What the receiving machine no longer does*. Linux + runtime / `FROM` / install the right version, and so on | A table, because the eye has to run down the third column | header, then rows **stagger** | kit |
| 12 | `c1-the-proof` | The Proof | `ContentNoteSlide` + `CodeBlock` | `frontend\.dockerignore` excludes `node_modules/`, and `node_modules/` is inside the image. Both true: the laptop's copy was blocked, `RUN npm install` built a fresh one. Note, `Remember`: your local packages are compiled for your OS, the image's for its own Linux | The apparent contradiction is the best evidence in the session, so it gets its own slide | the two statements land together as one **orchestration**, note after | kit, png `nodejs` |
| 13 | `c1-not-inside` | Deliberately Left Out | `ContentSlide` + `DataTable` | Three rows: `.env` and `SECRET_KEY` / `db.sqlite3` and `data/` / `VITE_API_BASE_URL`, each with why. Lead names the stake: this list is what makes a public push safe | Same table shape as 11, inverted. The parallel is the teaching | rows **stagger** | kit |
| 14 | `c1-defining-property` | What an Image Is | `ContentNoteSlide` | Note, `Remember`, the thesis verbatim: the image holds everything needed to **run** the app, and nothing that ties it to the machine that built it. Two supporting lines: code, runtime and dependencies baked in; configuration arrives at start-up | One idea, stated once, in the frame the deck uses for a thesis | note **scale in** from 0.97, nothing else on screen | kit |
| 15 | `c1-why-not-the-code` | Why Not the Code | `ContentSlide` + `DataTable` | Two columns, *Ship the source repository* vs *Ship the image*, four rows: what the server receives, what it must then do, time, result. Verdict line under the table: a repository asks every machine to rebuild and hope, an image removes the hoping | The objection is fair and deserves a fair comparison, then a stated verdict | header, rows **stagger**, verdict last | kit, png `git` |
| 16 | `c1-both-travel` | Both Still Travel | `ContentNoteSlide` | Note, `note`: Git is not redundant. Later in this course the automation server **clones the source** to build the image, then **pushes the image** for the server to run. Source travels to the builder, images travel to the runners | Closes the objection honestly instead of leaving Git looking obsolete | note only, **fade in** | kit, png `git`, `docker` |
| 17 | `c1-already-pulling` | You Already Pull | `ContentSlide` + `CodeBlock` | Three lines the room has written: `FROM python:3.13-slim`, `FROM node:20-alpine`, `docker run hello-world`. Lead: every one of these came from somewhere. Registry defined: a service that stores and distributes images | The answer was in their own files, so the slide is their own files | lines **stagger**, then the definition | kit, TR |
| 18 | `c1-two-way-street` | A Two-Way Street | `ContentNoteSlide` | Note, `Remember`: anyone can pull public images down, and with a free account you can push your own up. Today the direction reverses | The hinge of the session, on its own slide | note **scale in**, arrow direction flips once (**continuity transition**) | kit, png `docker` |
| 19 | `c1-the-account` | The Account | `ContentSlide` | `hub.docker.com`, free, unlimited public repositories. A **Docker ID** is chosen at signup; this course writes `ravi123` and every learner substitutes their own. Warning note: a public repository is visible to the world, which is safe **because** of slide 13's exclusions | The one slide that carries an instruction to act, and the one place the safety argument pays off | text, then the warning last | kit, png `docker` |
| 20 | `c1-target-picture` | The Target Picture | `ContentSlide` + `FlowChart` | Three boxes: `nxttrendz-backend` on your laptop → `ravi123/nxttrendz-backend` on Docker Hub → runs on any machine. Edges labelled `docker push` and `docker pull` | The map for the rest of the session, and for the two sessions after it | boxes **stagger** left to right, edges **line drawing** between them | kit, png `docker` |

### Concept 2: Image Naming and Tagging (21 to 28)

The concept opens on the failure, per `slide-content-rules` §4: the push is
attempted and refused before the naming rule is taught, so the rule answers
something the room has already seen.

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 21 | `c2-divider` | Image Naming and Tagging | `SectionBreakerSlide` | index 2, subtitle *Why the name has three parts* | Divider, navy stage | crossfade + mark | kit |
| 22 | `c2-push-denied` | Push Denied | `ContentSlide` + `Terminal` | `docker push nxttrendz-backend` and the refusal: `Using default tag: latest`, `The push refers to repository [docker.io/library/nxttrendz-backend]`, `push access denied`. Lead: try it with the name it has | The error is the teaching, quoted exactly as it appears | transcript **slide in**, error line **pulse** once | kit, TR |
| 23 | `c2-the-reason` | Read Line Two | `ContentNoteSlide` | The diagnosis: a name with no username prefix is assumed to be `library/`, Docker Hub's reserved namespace for official images (`python`, `node`, `hello-world`). Nobody pushes there. Warning note: the same error text also means "not logged in", which slide 49 comes back to | Diagnosis on its own slide, because reading error output is a taught skill in this course | the `library/` fragment **highlights** in place, note after | kit |
| 24 | `c2-name-anatomy` | Full Image Name | `ContentSlide` + `ImageNameAnatomy` (**new**) | `ravi123 / nxttrendz-backend : v1` with three labelled parts: Docker ID (whose), repository (which app), tag (which version) | The exact figure shape that worked for `TargetAnatomy` in session 5, applied to the name | three parts **stagger**, labels **line drawing** down to each | new, kit |
| 25 | `c2-name-rules` | The Three Parts | `ContentSlide` + `DataTable` | Three rows: *Part* → *Rule* → *If omitted*. Docker ID / your Hub username / assumed `library/`, push denied. Repository / lowercase, hyphens / required. Tag / any label / defaults to `latest` | The reference form of slide 24, which is what a learner photographs | rows **stagger** | kit |
| 26 | `c2-youve-read-it` | You Already Read It | `ContentSlide` + `ImageNameAnatomy` | `python:3.13-slim` decoded with the same figure: repository `python`, tag `3.13-slim`, and no Docker ID **because it is official**. Lead: this format has been in every Dockerfile you wrote | Reuses 24's figure with new content, which is what makes the format feel already-known | figure **morphs** from 24's values to these (**continuity transition**) | new, kit, png `python` |
| 27 | `c2-docker-tag` | docker tag | `ContentSlide` + `Terminal` | `docker tag nxttrendz-backend ravi123/nxttrendz-backend:v1`, with the two halves labelled *existing name* and *additional new name*. Lead: no rebuild, the image already exists | One command, and the labelling is the whole point | command **slide in**, labels after | kit, TR |
| 28 | `c2-one-image-two-names` | One Image, Two Names | `ContentNoteSlide` + `Terminal` | `docker images` with both rows and the **same** `IMAGE ID` `3f2a8b91c04d`. Note, `Remember`: `docker tag` added a name, not a copy, like two contacts saved for one phone number. They saw this in session 3 | The identical ID is evidence, and evidence belongs in a transcript | rows appear, then both IDs **pulse** together | kit, TR |

### Concept 3: Login, Push, Pull (29 to 38)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 29 | `c3-divider` | Login, Push, Pull | `SectionBreakerSlide` | index 3, subtitle *Three commands, and the image leaves the laptop* | Divider, navy stage | crossfade + mark | kit |
| 30 | `c3-login` | docker login | `ContentSlide` + `Terminal` | `docker login`, then `Username: ravi123`, `Password:`, `Login Succeeded`. Lead: once per machine. Bullet: the password is invisible while typing, exactly like `createsuperuser` in session 4 | A transcript, because the invisible password is what makes learners think it failed | transcript **slide in** line by line (**stepped animation**) | kit, TR |
| 31 | `c3-access-token` | Use a Token | `ContentNoteSlide` | Hub increasingly requires an **access token** instead of the account password: Account Settings → Security on `hub.docker.com`, then paste it at the `Password:` prompt. Note, `note`: a token is also what automated systems get later in this course, because a machine never gets your real password | The most likely live failure in the room, and the forward link to Jenkins credentials | note **fade in** | kit |
| 32 | `c3-push` | docker push | `ContentSlide` + `Terminal` | `docker push ravi123/nxttrendz-backend:v1` and its output: three `Pushed` lines, `Mounted from library/python`, then `v1: digest: sha256:9b7e3a... size: 1573` | The output carries two teaching points, so it is quoted whole | transcript **slide in**, `Pushed` lines **stagger** | kit, TR |
| 33 | `c3-layers-travel` | Layers, Not a Blob | `ContentSlide` | Read the output again: multiple lines, because the image travels as the **layers** from session 2, not as one file. Lead points back at the panel on 32 | One idea per slide, and this is the first of the two the output teaches | **stagger** | kit |
| 34 | `c3-mounted-from` | Mounted From | `ContentNoteSlide` | `Mounted from library/python`: Hub already has the `python:3.13-slim` base layers, so they are not re-uploaded. Only **your** layers travel. Note, `Remember`: the layer system pays off twice, first as build cache in session 2, now as a cheap push | The second point from the same output, and the payoff of a session-2 idea | the line **highlights**, then the note | kit |
| 35 | `c3-on-the-hub` | On Docker Hub | `ContentSlide` + `CodeBlock` | The repository now exists at `hub.docker.com/r/ravi123/nxttrendz-backend`, holding one tag, `v1`, and offering the `docker pull` command for it. Lead: this is the middle box of slide 20, now real | **Text, not a screenshot.** A capture would need a real account and a real push on the capture machine, which R8 forbids inventing. See the §6.1 TR patch | URL **fade in**, then the tag line | kit, TR |
| 36 | `c3-pull` | docker pull | `ContentSlide` + `Terminal` | On **any other machine**: `docker pull ravi123/nxttrendz-backend:v1`, then `Pull complete` and `Status: Downloaded newer image`. Lead: a machine that has never seen your code | The other half of the cycle, in the same panel shape as 32 | transcript **slide in** | kit, TR |
| 37 | `c3-run-anywhere` | Then Run It | `ContentNoteSlide` + `Terminal` | `docker run ravi123/nxttrendz-backend:v1`. Note, `Remember`: no Python installed, no virtual environment, no `requirements.txt` fetched. The complete environment travelled inside the image | The moment the session's promise is cashed. Deserves its own frame | command, then note **scale in** | kit, TR |
| 38 | `c3-the-cycle` | The Whole Cycle | `ContentSlide` + `FlowChart` | `build` (once, anywhere) → `push` (to Hub) → `pull + run` (everywhere). Lead: five sessions of Docker, in one line | Slide 20's picture, now as a verb chain the room has run end to end | three stages **stagger**, arrows **line drawing** | kit |

### Concept 4: Versioning, and a push Target (39 to 50)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 39 | `c4-divider` | Versioning, and a push Target | `SectionBreakerSlide` | index 4, subtitle *Tags, rollback, and one more target* | Divider, navy stage | crossfade + mark | kit |
| 40 | `c4-question` | (question) | `QuestionSlide` | *You push a new build under the same tag, `v1`. What happens to the old `v1` on Docker Hub?* Qualifier: the code changed, the tag did not | Asked before it is answered, per the deck rule inherited from session 5's R6 | card **scale in**, mark parallel | kit |
| 41 | `c4-overwritten` | It Is Overwritten | `ContentNoteSlide` | The answer: a tag is a **movable pointer**, not a permanent snapshot. Pushing the same tag replaces what it points to, anyone pulling `v1` now gets the new build, and the old one is unrecoverable from that tag | The answer slide for 40, one idea, stated plainly | note **scale in** | kit |
| 42 | `c4-latest-lies` | The latest Trap | `ContentSlide` | Three bullets: `latest` is only the **default tag name**, not "newest"; a server pulling `latest` can never say which build is running; a bad build has no previous tag to roll back to | The word sounds safe, which is exactly why it gets a slide | **stagger** | kit |
| 43 | `c4-unique-tags` | One Tag Per Build | `ContentSlide` + `Terminal` | The rule, then the four commands: tag `v2`, tag `latest`, push `v2`, push `latest`. Lead: unique tag every build, and `latest` moved as a convenience | The rule and its exact commands in one frame | rule, then commands **stagger** | kit, TR |
| 44 | `c4-repo-history` | A History That Holds | `ContentSlide` + `TagPointers` (**new**) | The repository as three entries: `v1` last week's build, still pullable; `v2` today's; `latest` a pointer, currently at `v2`. The `latest` arrow visibly points at `v2` | A tree is how Hub shows it, and the arrow is the idea a bullet cannot carry | entries **stagger**, then the `latest` arrow **draws** to `v2` | new, kit |
| 45 | `c4-rollback` | Rollback | `ContentNoteSlide` + `Terminal` | `docker run ravi123/nxttrendz-backend:v1`. Note, `Remember`: bad `v2`? Run `v1` again. That is what unique tagging buys, and it is one command on the server | The killer feature, in one command, on its own slide | command **slide in**, note after | kit, TR |
| 46 | `c4-push-target` | Makefile | `ContentSlide` + `CodeBlock` | The extended file: `.PHONY: build up down logs migrate superuser shell push`, then `DOCKER_ID = ravi123`, `IMAGE_NAME = nxttrendz-backend`, `VERSION = v1`, then the four-line `push` target using `$(DOCKER_ID)`, `$(IMAGE_NAME)`, `$(VERSION)` | Their session-5 file, grown by one target. `language="makefile"`, real tabs, the new lines highlighted | new lines **highlight** after the file lands | kit, TR |
| 47 | `c4-release-ritual` | The Release | `ContentSlide` + `Terminal` | `make build`, then `make push`. Lead: the whole release, two words each | The payoff of session 5 inside session 6, and it is two lines long | two lines **stagger** | kit, TR |
| 48 | `c4-override-version` | Makefile | `ContentSlide` + `Terminal` | `make push VERSION=v2`. Lead: `VERSION = v1` in the file is only a **default**, and the command line wins, so no file edit per release | Same title as 46 because it is the same artifact, per §4's repeat rule | command **slide in**, `VERSION=v2` **highlights** | kit, TR |
| 49 | `c4-push-denied-again` | Denied Again | `ContentSlide` + `Terminal` | `make push` on a fresh machine, and the same `push access denied` text as slide 22. Diagnosis: if the name **is** prefixed with your Docker ID and this still appears, it is authentication. Fix: `docker login`, then retry | Two causes, one error text. Naming the ambiguity in the room is cheaper than debugging it alone | transcript, then the diagnosis, then the fix | kit, TR |
| 50 | `c4-full-picture` | Six Sessions | `ContentSlide` + `DataTable` | Four rows, *Capability* → *Achieved with* → *Session*: package an app / Dockerfile / 2; run both runtimes / Compose / 3 and 4; one-word commands / Makefile / 5; share images between machines / Docker Hub / **this one**, highlighted | The course so far as one table, and the last row is today | rows **stagger**, final row **pulses** | kit |

### Closing frame (51 to 53)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 51 | `takeaways` | Key Takeaways | `KeyTakeawaysSlide` | The four agenda concepts, verbatim, with icons. Nothing else | Session 5's rule: takeaways carry the agenda points and no fifth idea | items **stagger** | kit |
| 52 | `next-session` | Introduction to Jenkins | `SectionBreakerSlide` | `kicker="Next session"`, title only, **no index**. The reason stays in the presenter notes: every piece is automated except the human, and someone still has to notice the code changed | Session 5's rule: the kicker is what separates the handover from a fifth section divider | crossfade + mark | kit |
| 53 | `thankyou` | Thank you! | `ThankYouSlide` | Closing fixture, `footerLogo={false}` | Fixture | crossfade | kit |

No Practice or Feedback frames, matching sessions 4 and 5. No quiz frames, per
the standing instruction at the top of this plan.

---

## 5. Assets

### 5.1 Two new figures

**`ImageNameAnatomy`** (slides 24, 26) — `ravi123 / nxttrendz-backend : v1` set
in the mono face at display size, with the three parts separable and each
carrying a label below it. Built as DOM elements rather than SVG text, for the
reason session 5 recorded for `TargetAnatomy`: SVG text does not wrap, does not
inherit the type scale, and cannot be highlighted per part. Props: `dockerId`,
`repository`, `tag`, each optional, so slide 26 can render the same figure with
`dockerId` absent and the label reading *no Docker ID, because it is official*.

**`TagPointers`** (slide 44) — the repository as a short vertical list of tags
with one arrow from `latest` to the tag it currently points at. Props: a list of
`{ tag, note }` and a `pointsAt`. Deliberately not a `FileTree`: the arrow is
the whole idea and `FileTree` cannot draw one.

Both are **session-owned** at generation, in `deployement_session_6/src/ui/`,
exported from that session's barrel. `ImageNameAnatomy` is the candidate for
promotion to the kit later, since sessions 7 to 9 name images constantly, but
that is the user's call under content rule 14 and it has not been made.

### 5.2 Reused kit components

`LayerStack` (10), `DataTable` (11, 13, 15, 25, 50), `FlowChart` (20, 38),
`Terminal` (5, 7, 22, 27, 28, 30, 32, 36, 37, 43, 45, 47, 48, 49), `CodeBlock`
(3, 12, 17, 35, 46), `QuestionSlide` (9, 40) in its new card style from session
5. Nothing else is needed, and no new slide type is justified.

### 5.3 Logos

From `slide-kit/assets/tech/`, copied into `public/assets/tech/` and listed in
the deck's `TECH_SRC` map: `docker.png` (16, 18, 19, 20), `python.png` (10, 26),
`nodejs.png` (12), `git.png` (15, 16), `makefile.png` (3, 46, 47, 48). All five
are already in the library, `makefile.png` as of session 5. Nothing to fetch.

### 5.4 Terminal transcripts

Every panel is **quoted from the TR**, not captured. Docker Desktop cannot run
on the capture machine and this session additionally needs a real Docker Hub
account and a real push, so a capture is impossible rather than merely
inconvenient. That is session 5's R8, unchanged, and slide 35 is the slide it
constrains most.

### 5.5 What the motion skills changed

Applying `.agents/skills/animate` to the Motion column changed three things a
by-eye plan would have got wrong:

1. **Slides 9 and 40's cards enter at `scale(0.97)`, never `scale(0)`.** The
   skill's rule is that nothing in the real world appears from nothing, and the
   kit's `Reveal` already animates transform and opacity only.
2. **Nothing exceeds 300ms, and the dividers stay at a crossfade.** A section
   divider is seen five times in one deck, and the skill's frequency table puts
   anything seen that often at "near-imperceptible or nothing".
3. **The `stagger` steps are 60 to 80ms, not the eye-catching 150ms.** Eight
   table rows at 150ms is 1.2 seconds of the room waiting to read row eight,
   which the skill calls out directly: a perceptible wait is not orchestration.

`prefers-reduced-motion` is already handled in `src/index.css` and by
`useInstant()`, so the plan adds nothing there. The skill's remaining sections
are about interruption and gesture, which a deck has none of.

---

## 6. TR patches this plan asks for

Per the standing preference: when the TR under-delivers on its own headings,
patch the TR rather than invent content or cut the slide. All three are small
and none changes what the session teaches.

### 6.1 §3.2 promises a browser view and describes nothing

The TR says *"The image is now visible in the browser at
hub.docker.com/r/ravi123/nxttrendz-backend"* and stops. Slide 35 has to say what
is there, and a screenshot is impossible on the capture machine.

**Insert after that line:** what the page shows, so the slide can be faithful —
the repository name, a **Tags** tab listing `v1` with its size and push time,
and the `docker pull ravi123/nxttrendz-backend:v1` command Hub displays for
copying. Three lines is enough.

### 6.2 §1.1's `docker images` output shows one image, the room will see two

The project builds a backend **and** a frontend image through Compose, so the
real output has two rows. Slide 7 quoting one row will not match the screen in
front of the room.

**Patch the output block** to carry the `nxttrendz-frontend` row as well, and
let the prose keep using the backend as its example.

### 6.3 §4.4 shows the `push` target without the file around it

The block gives `.PHONY`, three variables and `push`, with the other seven
targets absent. Slide 46 renders the file the room actually has, so it needs the
whole file once.

**Patch the block** to show the complete `Makefile` with `push` appended and the
new lines marked, exactly as session 5's TR did for its own final file.

If you would rather not touch the TR, the fallbacks are: drop slide 35 and let
50 carry the Hub reference (deck goes to 52); quote one row on slide 7 and say
out loud that the frontend has one too; and render only the `push` target on 46
with a note that the rest of the file is unchanged.

---

## 7. Generation, on your word

The plan is signed, so unless you say otherwise the next steps are:

1. Scaffold `deployement_session_6/` from `slide-kit/slide-template`, on
   `devPort 5217`, `htmlName deployment-session-6`, `slideCount 53`.
2. Write `workflow/skills/session-6-deck/SKILL.md` with this deck's build rules,
   carrying session 5's R1 to R8 forward and adding the motion rules from §5.5.
3. Build the two figures in §5.1 and screenshot both before using them, per
   content rule 17.
4. Generate all 53 slides, then run `typecheck`, `build:html`, `video-safe`,
   `qa`, `align-check` and `preview`, and read the shots before reporting.

§8 (what generation changed) and §9 (the guidelines audit) get written during
and after generation, as in every previous session plan.
