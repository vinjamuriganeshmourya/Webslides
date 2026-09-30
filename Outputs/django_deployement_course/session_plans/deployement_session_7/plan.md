<!-- cSpell:ignore cicd nxttrendz deployement NxtWave colour colours behaviour dockerignore Makefile makefile Vite ravi Jenkinsfile freestyle SCM pgdata crossfade devicon -->
# Deployment · Session 7: "Introduction to Jenkins"

**STATUS: APPROVED 2026-08-31 · SCAFFOLDED · GENERATED · VERIFIED**

Approved on the five defaults in §7, with two instructions given during
generation: **two quiz frames**, and **every point readable by an absolute
beginner**. Both were recorded before they were applied, see §8.

The deck shipped at **59 slides**, not the 54 this plan asked for. §8.1 says where
the five went.

| | |
|---|---|
| `SESSION_NAME` | `Introduction to Jenkins` (kicker on every content slide, never "Session 7") |
| `COURSE` | `React + Django Integration · Deployment` |
| Source | `/home/nxtwave/docker_jenkins_aws/07_introduction_to_jenkins_and_cicd.md`, 419 lines, read in full |
| Project | `django_deployement_course/deployement_session_7/` (scaffolded from `slide-kit/slide-template`) |
| Deck file | `src/decks/jenkinsCicdDeck.tsx` |
| Slide count | **54** as planned, **59** as shipped (see §8.1) |
| `devPort` | `5218` (5211 to 5213, 5215 to 5217, 5220 to 5226 are taken) |
| `htmlName` | `deployment-session-7` |
| `NEXT_UP` | `Setting Up Jenkins for Docker Builds` (source doc `08_setting_up_jenkins_for_docker_builds.md`) |
| Build rules | `django_deployement_course/workflow/skills/session-7-deck/SKILL.md` (written, R14 to R20 are new) |

419 TR lines against session 6's 446, which shipped 53 slides. 54 here is the
same density, not a bigger deck: this TR runs to prose where session 6 ran to
tables, and prose expands onto more slides than a table does.

---

## 1. What the TR actually contains, and what changes

All six sections were read. The mapping is not one to one, and the four places it
diverges are the decisions worth your attention.

| Source | Becomes | Why |
|---|---|---|
| The `IndexList` names **6** sections | **4** agenda items | Hard rule 20 and `PEDAGOGY_GUIDELINES.md` §1: at most four, and the takeaways restate them word for word. §2 and §3 merge (the practice, then its stages); §4 and §5 merge (the tool, then getting it running). Both seams are where the TR itself already breaks |
| §1.2, the GitHub prerequisite, reads as a preamble before the real topic | **the whole of concept 1**, ten slides | It is not a preamble, it is a thing the room has to perform. A learner whose code is not on GitHub cannot do sessions 8 or 9 at all. Cutting it to a bullet is the one edit that would break the two sessions after this one |
| §1.2's `MultiLineWarning`, two bullets on one block | **three slides**: the check, why the order matters, and the recovery | Hard rule 5. The `.env` beat is the only irreversible action in the session, and "if you already committed it" is a different situation from "make sure you do not" |
| §4.3 and §3.1 are ASCII diagrams | `SpineFlow` for both, plus `GateFlow` for the gate. **The plan said `BoundaryBridge` for §4.3 and the lab rejected it**, see §8.2 fault 5 | The kit already owns every shape this TR draws, so this is the first plan in the course that needs no new component. Which existing figure was still got wrong on paper, and only a rendered picture caught it |

**Nothing in the TR is dropped.** Three places under-deliver against their own
headings and want a patch rather than an invention; they are listed in §5.1 under
"TR patches" and defaulted in §7.

---

## 2. Concept map

Four concepts. One divider each, and nothing else gets one.

| # | Concept (agenda wording, verbatim in the takeaways) | TR sections | Ends on the question that opens the next |
|---|---|---|---|
| 1 | Publishing the Code | 1.1 to 1.5 | Steps 3 to 6 need no human judgment. Can a machine do them? |
| 2 | What CI/CD Is | 2.1 to 2.4, 3.1 to 3.3 | The pipeline is defined and the trigger is named. What actually runs it? |
| 3 | Jenkins, the Automation Server | 4.1 to 4.3, 5.1 to 5.3 | Jenkins is up and unlocked. What is on the screen? |
| 4 | Inside the Jenkins Dashboard | 6.1 to 6.4 | It printed SUCCESS from a UI checkbox. Where should that definition live? |

Every divider is written as the question it answers, so the instructor can hand
over to it verbally.

**Naming, settled 2026-08-31.** The deck is called `Introduction to Jenkins`,
which is session 6's handover frame word for word. The TR's own title is longer
and the deck deliberately does not use it: a deck whose name differs from the
name the previous deck promised makes a 23-session course read as 23 unrelated
topics. Recorded as R21.

---

## 3. The narrative spine

1. Last session the *image* got a central home. Ask the matching question: where
   does the *code* live?
2. In `C:\nxttrendz\.git`, and nowhere else. Committed is not published, and a
   folder on your laptop has no network address.
3. That matters now rather than in the abstract: the machine introduced today
   clones over the network, and it cannot clone your laptop.
4. So, four steps. Check what you have, check `.env` is ignored, commit, and
   create a genuinely empty repository on GitHub.
5. The `.env` check comes before the first push and not after, because the first
   push is irreversible in the one way that matters: history keeps what you
   delete.
6. Then two commands, and they are last session's two commands in a different
   costume: name where it goes, then send it.
7. Verify in the browser, and make the second check the habit: `backend/` and
   `frontend/` are there, and `.env` is nowhere on the page.
8. Now `git push` is a real command with a real destination, which lets us look
   honestly at what shipping a change costs today: six steps.
9. Two of the six are the developer's job. The other four are pure ritual, the
   same commands in the same order every single time.
10. Human ritual fails in four predictable ways: forgetting, skipping,
    inconsistency, delay. None is a character flaw, all four are structural.
11. And those four steps need zero judgment. A fixed sequence with a clear pass
    or fail at each step is the definition of a job for a machine.
12. That practice has a name. Continuous Integration: every push merged, built
    and tested on a neutral server, so breakage is found in minutes.
13. Continuous Delivery adds packaging and stops at a human pressing deploy.
    Continuous Deployment removes even that. This course builds to Delivery.
14. The shape is an assembly line: fixed stations, fixed order, and a part that
    fails at any station is pulled off the line and never reaches the showroom.
15. Everyone shipping serious software works this way, which is why CI/CD is in
    nearly every backend job description the room will read.
16. Our pipeline is five stages, and the room already knows the commands inside
    three of them. The pipeline is your Makefile, executed by a robot.
17. Two rules make it worth having: stages run in order, and a failed stage stops
    everything after it. The pipeline is not just automation, it is a gate.
18. Something has to notice the push. A webhook is the professional answer, and
    it arrives in session 9.
19. The thing that watches, and runs the stages, is an automation server. Jenkins
    is one: open source, self-hosted, the industry workhorse for a decade.
20. It is not the only one, and the honest comparison says so. What transfers is
    the concepts, not the syntax.
21. Jenkins sits in the middle of everything built so far: it clones from GitHub,
    it pushes to Docker Hub, and later it deploys to EC2.
22. Installing Java and Jenkins natively is fiddly, and this course owns a tool
    whose entire purpose is running software without installing it.
23. Every flag in that `docker run` is already known, including the volume, doing
    for Jenkins exactly what `pgdata` did for Postgres.
24. Jenkins locks itself and writes the key inside the container, to prove you
    control the machine. Reading a file inside a container is a session 1 skill.
25. Then plugins, which are the whole architecture: the core is deliberately
    small, and Git, Pipeline and Docker Pipeline are what this course adds.
26. Four words unlock the dashboard: job, build, queue, executor. One is a trap,
    because "build" here means a whole run, not `docker build`.
27. Prove it is alive with a job that prints a message, then read the console
    output like a story: workspace, echoed lines, verdict.
28. Console Output is where you will live when pipelines fail. It is this
    session's `docker compose logs`.
29. But that job was defined by clicking checkboxes, and the Makefile lesson was
    that operational knowledge belongs in versioned files. A Jenkinsfile is next.
30. Jenkins is alive and powerless: no GitHub access, no Docker Hub credentials,
    and it cannot run `docker` at all. Next session wires in all three.

---

## 4. New vocabulary, and where it is defined

| Term | First defined on | In one line |
|---|---|---|
| remote, `origin` | 15 | The network address a local repository pushes to, named once |
| upstream (`-u`) | 16 | The record that makes every later push a bare `git push` |
| Continuous Integration | 22 | Every push merged, built and tested on a neutral server |
| Continuous Delivery | 24 | Every passing change packaged and ready, with a human pressing deploy |
| Continuous Deployment | 25 | The same, with the button removed |
| pipeline | 30 | The concrete sequence of stages a change passes through |
| stage | 30 | One station in that sequence, with a pass or fail of its own |
| gate | 32 | What the pipeline becomes, once a failed stage stops everything after it |
| webhook | 33 | GitHub telling Jenkins about a push, instead of Jenkins asking |
| poll SCM | 33 | Jenkins asking on a schedule, the fallback when a webhook cannot reach it |
| automation server | 35 | A program that runs 24/7, watches for triggers, and executes pipelines |
| Jenkins | 35 | The open-source automation server this course uses |
| plugin | 44 | A capability added to a deliberately small core, like a VS Code extension |
| job, item | 46 | One automated task definition |
| build (Jenkins sense) | 46 | One execution of a job, numbered #1, #2, #3 |
| build queue | 46 | Runs waiting for a free executor |
| executor | 46 | A worker slot, default two, so two builds run at once |
| workspace | 49 | The folder Jenkins creates for a job to work in |
| Freestyle project | 48 | A job defined by clicking through the web UI |
| Pipeline job, Jenkinsfile | 51 | A job defined by a file in your Git repository |

Deliberately **not** redefined: image, container, volume, registry, Docker Hub,
tag, `docker push`, `docker pull`, `docker exec`, Makefile, target, `.PHONY`,
`.gitignore`, `.dockerignore`, commit, branch, port publishing. All belong to
sessions 1 to 6, and slide 3 recaps the six of them this session leans on.

---

## 5. Slide-by-slide plan

### Front frame (1 to 5)

| # | Type | Content |
|---|---|---|
| 1 | `BrandSlide` | `greeting="Welcome!"` (rule 21: the welcome line is written once, on slide 2) |
| 2 | `WelcomeSlide` `minimal` | `Introduction to Jenkins` |
| 3 | `ContentNoteSlide` + `DataTable` | **Where we Left Off** · session 6's four concepts as rows: images trapped on one machine, `<docker-id>/<repository>:<tag>`, login → push → pull, `make push VERSION=v7`. Note `Remember`: an image holds code, runtime and dependencies, never configuration. Ends on today's gap: the image has a home, a human still types every command |
| 4 | `AgendaSlide` | the four concepts of §2, in order |
| 5 | `ContentSlide` + `Terminal` | **Initial Setup** · "Run these terminal commands step by step :" then one panel at `C:\nxttrendz`: Docker Desktop running, `docker --version`, `make build`, `docker login` already done from session 6. Fourth bullet: a free `github.com` account, **created before the session** |

The GitHub account sits here for the reason session 6 put the Docker Hub account
here: it needs an email confirmation, and a room discovering that at slide 14
loses ten minutes.

### Concept 1: Publishing the Code (6 to 20)

Opens on the felt need, not the procedure (`PEDAGOGY_GUIDELINES.md` §2): find
that the code has no address, find who needs that address, and only then run the
four steps.

| # | Type | Title / lead | Figure |
|---|---|---|---|
| 6 | `SectionBreakerSlide` | Publishing the Code · index 1, subtitle *And the last manual step* | crossfade, no image |
| 7 | `ContentSlide` | **Where the Code Lives** · "Last session gave one of them a home" | `DataTable`, two rows with identical columns: the image at `hub.docker.com/r/ravi123/nxttrendz-backend`, reachable by any machine; the code at `C:\nxttrendz\.git`, reachable by one. The symmetry is the argument |
| 8 | `ContentNoteSlide` | **Committed, Not Published** · a repository living only on your laptop has no network address | Note `Remember`: the automation server introduced today clones over the network, and it cannot clone a folder on your machine |
| 9 | `ContentSlide` + `Terminal` | **git status** · from the project root | Two readings named: branch and file information means a repository exists, skip ahead; `fatal: not a git repository` means `git init` then `git branch -M main` |
| 10 | `ContentSlide` + `Terminal` + `CodeBlock` | **Before the First Push** · `git status --short`, and `.env` must **not** appear | `CodeBlock` carries the one `.gitignore` line to add if it does. The check runs before the commit, so it renders before the commit slide |
| 11 | `ContentSlide` | **Why This Order** · "the first push is irreversible in the one way that matters" | `Callout warning`: anyone watching a public repository can read what lands in it, and deleting a file later does not remove it from Git history |
| 12 | `ContentSlide` + `Terminal` | **If It Was Committed** · adding it to `.gitignore` does not help, because Git keeps tracking files it already tracks | `git rm --cached .env`, commit, then treat that `SECRET_KEY` as compromised and rotate it, exactly as you would a leaked Docker Hub token |
| 13 | `ContentSlide` + `Terminal` | **Commit Everything** · everything this course has produced so far, in one commit | `git add .`, `git commit -m "Add Docker, Compose and Makefile setup"` |
| 14 | `ContentSlide` | **An Empty Repository** · New repository → `nxttrendz` → Public | `StatusList`: add a README ✗, add a `.gitignore` ✗, add a licence ✗, each because it creates a commit inside the remote that collides with the history you already have. No browser capture, see §5.1 |
| 15 | `ContentSlide` + `Terminal` | **Connect and Push** | `git remote add origin https://github.com/ravi123/nxttrendz.git`, `git push -u origin main`, and the five output lines verbatim, ending on `branch 'main' set up to track 'origin/main'` |
| 16 | `ContentSlide` | **You Have Done This** · "same shape, because both are pushes to a central service" | `DataTable`, two rows: *name the remote destination* (`docker tag` / `git remote add`) and *send it* (`docker push` / `git push -u`). Then what `-u` buys: every future push is a bare `git push` |
| 17 | `ContentSlide` | **Check the Page** · "the second check is the one worth making a habit" | `StatusList`, two rows: `backend/` and `frontend/` present ✓, `.env` nowhere on the page ✓. Closing line from session 6: `.gitignore` keeps secrets out of Git, `.dockerignore` keeps them out of images, same job, two files. **Wants TR patch 1** |
| 18 | `ContentSlide` | **Shipping a Change** · what it costs today | `StepList`, six steps. 1 and 2 are the developer's job; 3 to 6 are bracketed and marked **pure ritual**: the same commands, in the same order, every single time. The bracket is the slide |
| 19 | `ContentSlide` | **Human Ritual Fails** | `StatusList`, four warning rows: forgetting, skipping, inconsistency, delay. Closing beat: steps 3 to 6 need zero judgment, and a fixed sequence with a clear pass or fail is a job for a machine |
| 20 | `QuestionSlide` | "Can a machine watch our repository, and every time code is pushed, run the tests, build the image and push it, the same way every time, without being asked?" | nothing else on the frame (rule 16). Qualifier: the same four commands the developer runs today |

Slide 20 is this deck's **only** `QuestionSlide`. `PEDAGOGY_GUIDELINES.md` §8
allows one or two, and a second would spend the beat that makes this one land.

### Concept 2: What CI/CD Is (21 to 33)

The practice before the tool, which is the TR's ordering and the right one:
naming Jenkins first makes CI/CD sound like a Jenkins feature rather than a
practice Jenkins implements.

| # | Type | Title / lead | Figure |
|---|---|---|---|
| 21 | `SectionBreakerSlide` | What CI/CD Is · index 2, subtitle *The practice, before the tool* | crossfade |
| 22 | `ContentNoteSlide` | **Continuous Integration** · "every time any developer pushes code, it is automatically merged with the team's code, built and tested on a neutral server" | then why the name says it: integrating everyone's changes continuously, instead of working separately for weeks and suffering a merge week |
| 23 | `ContentNoteSlide` | **Minutes, Not Days** | Note `Remember`, the TR's blockquote: broken code is discovered minutes after it is written, by a machine, instead of days later by an angry teammate |
| 24 | `ContentSlide` | **Continuous Delivery** · every change that passes CI is packaged and made ready to deploy | for this project: image built and pushed to Docker Hub. A human presses the final deploy button |
| 25 | `ContentSlide` | **Continuous Deployment** · even that button is automated | every passing change goes all the way to the live server, with no human in the loop after `git push`. Its own slide, because the room conflates the two CDs |
| 26 | `ContentSlide` | **The Three Terms** · verdict under the table | `DataTable`: *Term* → *Automated up to* → *Human involvement*, three rows. Verdict: this course builds to Continuous Delivery, and completes Deployment in the AWS sessions |
| 27 | `ContentSlide` | **Picture a Factory** · a hand-built car depends on which craftsman built it that day; an assembly line produces identical cars, and a car that fails at any station is pulled off the line and never reaches the showroom | typographic on purpose. There is no assembly-line asset in the library, and hard rule 8 forbids reaching for a near-miss. The scene is two sentences |
| 28 | `ContentSlide` | **The Mapping** | `AnalogyMap`, five pairs: raw materials → developer pushes; fixed stations in fixed order → pipeline stages; failed part pulled off the line → failed stage stops the pipeline; identical cars out → identical tested releases; the line runs all day → the pipeline runs on every push. Cashed out here and then dropped |
| 29 | `ContentSlide` | **Everyone Shipping** · Amazon deploys to production every few seconds; Netflix, Google and Meta thousands of times a day | `CardGrid` with four marks. Closing line: none of it is possible with a human typing `make build`, which is why CI/CD is in nearly every backend job description |
| 30 | `ContentSlide` | **Our Pipeline** · trigger `git push` | `SpineFlow`, five stages: 1 FETCH, 2 TEST, 3 BUILD, 4 PUSH, 5 DEPLOY, with one exception hanging off the spine: any stage fails → pipeline stops → team notified. `SpineFlow`'s exact design point; `FlowChart` cannot draw the exit at all |
| 31 | `ContentNoteSlide` + `CodeBlock` | **It Is Your Makefile** · stages 2, 3 and 4 are `make test`, `make build`, `make push`, quoted from the file they wrote last session | Note `Remember`: the pipeline is your Makefile, executed by a robot. Nothing new needs inventing |
| 32 | `ContentSlide` | **Two Iron Rules** · stages run in order, and a failed stage stops everything after it | `GateFlow`, one check drawn large with both exits labelled. Not redundant with 30: that draws five stages small, this draws one check. Verdict: broken code physically cannot reach users, so the pipeline is a **gate** |
| 33 | `ContentSlide` | **What Starts a Run** | `DataTable`, three rows: webhook (the professional standard, **set up in session 9**), poll SCM (fallback when a webhook cannot reach Jenkins), manual Build Now (testing the pipeline itself). Rule 4: the later tool is named and dated, never decomposed here |

### Concept 3: Jenkins, the Automation Server (34 to 44)

| # | Type | Title / lead | Figure |
|---|---|---|---|
| 34 | `SectionBreakerSlide` | Jenkins, the Automation Server · index 3, subtitle *The factory that runs the line* | crossfade |
| 35 | `ContentNoteSlide` | **What is Jenkins?** · "an open-source automation server: a program that runs on a machine 24/7, watches for triggers like a GitHub push, and executes pipelines in response" | then the tie-back: if CI/CD is the assembly line concept, Jenkins is the factory that runs it. The one question-title in this deck, which `TEXT_GUIDELINES.md` §6 reserves for definition slides |
| 36 | `ContentSlide` | **Why Jenkins** | `DataTable`, three rows with identical columns: Jenkins (self-hosted, open source, 1800+ plugins), GitHub Actions (built into GitHub, cloud-hosted), GitLab CI (built into GitLab) |
| 37 | `ContentSlide` | **Three Reasons** · the verdict `PEDAGOGY_GUIDELINES.md` §7 requires | dominant for over a decade so you will meet it; free and self-hosted so you learn what happens under the hood; its concepts (jobs, pipelines, stages, credentials) transfer to every other tool. `Callout note`: a Jenkins pipeline takes minutes to re-express in GitHub Actions, because only the syntax differs |
| 38 | `ContentSlide` | **Where It Sits** · Jenkins is the robot operator of the tools from sessions 1 to 6 | `BoundaryBridge`, five stations: Developer → GitHub → Jenkins → Docker Hub → AWS EC2. Legs `git push`, webhook, `docker push` (issued by Jenkins), `docker pull` (issued by EC2). **Wants the kit change in §5.1** |
| 39 | `ContentSlide` + `Terminal` | **Run It in Docker** · Jenkins is a Java application and installing Java natively is fiddly, and this course owns a tool whose entire purpose is running software without installing it | `docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts`. **Wants TR patch 3** |
| 40 | `ContentSlide` | **Every Flag, Known** | `DataTable`, six rows, every one a session 1 to 3 concept. The `-v jenkins_home:/var/jenkins_home` row carries the callback inline: all configuration and job history survives restarts, exactly like `pgdata` did for Postgres |
| 41 | `ContentSlide` + `Terminal` | **Unlock Jenkins** · Jenkins generated a one-time password at first startup and wrote it inside the container, to prove you control this machine | `docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword` and its output. Reading a file inside a container is a session 1 skill, used here for a real reason |
| 42 | `ProceduralStepsSlide` | **Finish Setup** · three steps, each with its observable result | Install suggested plugins (includes Git integration and the Pipeline system, expect a few minutes of progress bars) → Create First Admin User (replaces the one-time password) → Instance Configuration (accept `http://localhost:8080/`) |
| 43 | `ContentNoteSlide` | **If Your Screen Differs** | Note `note`: wizard details and layouts drift between Jenkins versions; follow the on-screen flow. The sequence unlock → plugins → admin user is stable. The slide this deck can make because it never shows a screenshot |
| 44 | `ContentSlide` | **What Plugins Are** · the core is deliberately small and almost every capability is a plugin, the same architecture as VS Code extensions or Django packages | `DataTable`, three rows and only the three this course uses: Git (clone repositories), Pipeline (run a Jenkinsfile, session 9), Docker Pipeline (build and push images, session 8) |

### Concept 4: Inside the Jenkins Dashboard (45 to 51)

| # | Type | Title / lead | Figure |
|---|---|---|---|
| 45 | `SectionBreakerSlide` | Inside the Jenkins Dashboard · index 4, subtitle *Job, build, queue, executor* | crossfade |
| 46 | `ContentSlide` | **Four Words** · the dashboard is empty but for a menu, and four terms unlock all of it | `DataTable`: Job (one task definition), Build (one execution, numbered #1, #2), Build Queue (runs waiting for a free executor), Executor (a worker slot, default 2). **Wants TR patch 2** |
| 47 | `ContentNoteSlide` | **Build Means a Run** | Note `warning`: in Jenkins "build" means one run of a job, which may include testing, pushing and deploying, not just `docker build`. Second line: the numbered builds are where automatic image tags come from later in this course |
| 48 | `ProceduralStepsSlide` + `CodeBlock` | **hello-jenkins** · proof of life before the real pipelines | New Item → `hello-jenkins` → Freestyle project → OK. Build Steps → Add build step → Execute shell. `CodeBlock`: `echo "Jenkins is alive!"` and `date`. Save → Build Now. Observable result: a build appears as **#1** with a green tick |
| 49 | `ContentSlide` + `Terminal` | **Console Output** · read it like a story | the eight lines verbatim, from `Started by user ravi` to `Finished: SUCCESS`. Jenkins created a **workspace**, ran each shell line (echoed with `+`, exactly like Make echoes commands), and recorded the verdict |
| 50 | `ContentNoteSlide` | **Where You Will Live** | Note `Remember`: Console Output is where you will live when pipelines fail. It is the pipeline's version of `docker compose logs`. One line, one frame, because the room needs it in session 9 |
| 51 | `ContentSlide` | **A Fork in the Road** · recall the Makefile lesson: operational knowledge belongs in versioned files, and not in UI checkboxes either | `DataTable`, four rows: *defined by* clicks vs a `Jenkinsfile` in your repo; *version-controlled* ✗ vs ✓; *survives Jenkins loss* ✗ vs ✓; *used in this course* smoke test only vs everything real, sessions 8 and 9 |

### Closing frame (52 to 54)

| # | Type | Content |
|---|---|---|
| 52 | `KeyTakeawaysSlide` | the four agenda strings, **verbatim** (rule 20): Publishing the Code · What CI/CD Is · Jenkins, the Automation Server · Inside the Jenkins Dashboard |
| 53 | `SectionBreakerSlide` | `kicker="Next session"`, **no `index`** (session 6 R9), title `Setting Up Jenkins for Docker Builds` |
| 54 | `ThankYouSlide` | fixture |

Slide 53's reason goes in the notes and not on the slide: Jenkins is alive but
powerless. It cannot reach your GitHub repository, has no Docker Hub credentials,
and cannot run `docker` at all. Next session wires in all three.

**No quiz frame, no practice, no feedback and no recap slide**, carrying your
standing instruction from sessions 5 and 6. This is now the third deck in a row
that contradicts hard rule 18 in silence; §7 item 1 asks you to settle it.

---

## 5.1 What has to be built

### New figures in `src/ui`

**None.** This is the first plan in the course that needs no new component, and
that is a result rather than a coincidence: three of the figures it leans on
exist *because* sessions 5 and 6 built them and pushed them back into the kit.

| Figure | Slides | Already in the kit because |
|---|---|---|
| `SpineFlow` | 30 | chosen in `slide-kit/flowchart-lab`, promoted with the flow-chart family |
| `GateFlow` | 32 | same family, and it is the variant for "the check is the point" |
| `BoundaryBridge` | 38 | promoted after session 6 picked it out of four candidates |
| `AnalogyMap`, `StatusList`, `StepList`, `DataTable`, `Terminal`, `CodeBlock`, `CardGrid`, `Callout` | throughout | kit since sessions 1 to 4 |

If slide 18's ritual bracket turns out to be undrawable with `StepList`, the
fallback is `StepLedger`: same flow-chart contract, one rename at the call site,
still not a new component.

### New slide type

**None proposed.** Every slide above is an existing type.

### Kit changes

One, and it is the only thing that can block generation. `StationLogo` in
`slide-kit/slide-template/src/ui/flowFigure.ts` is a closed union:

```ts
export type StationLogo = 'docker' | 'git' | 'python' | 'nodejs' | 'makefile'
```

Slide 38's chain is Developer → GitHub → Jenkins → Docker Hub → AWS EC2, so
`BoundaryBridge` needs `'github'` and `'jenkins'` in that union. The comment
above it reads "only these five PNGs exist in the asset library", so widening the
type and fetching the marks are one change and not two.

That file is kit-owned, so per §6 of the generate-slides skill it goes out as a
PR on `kit/station-logos-jenkins-github`, not as a local edit: `sync-kit.mjs
--apply` carries it to every other session including signed-off ones. It is
additive to a union, so no existing call site changes. Defaulted in §7.

### Assets

**To fetch into `slide-kit/assets/tech/` (rule 13, PNG at 512px), 2 new:**
`jenkins` · `github`. Neither exists anywhere in the library, and this deck names
Jenkins on nine slides and GitHub on seven, so hard rule 12 requires both.
Sessions 8 and 9 need them too.

**Already present, nothing to fetch:** `tech/docker.png` (3, 7, 16, 38, 44),
`tech/git.png` (7, 16, 44), `tech/makefile.png` (31), `tech/vscode.png` (44), and
`companies/` `amazon` · `netflix` · `google` · `meta` for slide 29.

`slide-kit/assets/README.md` needs its `tech/` inventory updated with the two new
marks. That edit is part of generation.

**No captures, and this is stronger than session 6's R6.** Docker Desktop cannot
run on the capture machine, and this session additionally needs a running Jenkins
container, a real GitHub account and a real push. Every command, output line,
password and timestamp is quoted from the TR verbatim. Six slides would like a
screenshot and get something else instead:

| Slide | Would show | Renders instead |
|---|---|---|
| 14 | the GitHub New repository form | `StatusList` of the three boxes not to tick |
| 17 | the repository page after the push | `StatusList` of the two checks |
| 41 | the Unlock Jenkins screen | the reason in text, then the `docker exec` transcript |
| 42 | the three wizard screens | `ProceduralStepsSlide`, plus slide 43's drift note |
| 46 | the empty dashboard | `DataTable` of the four terms |
| 48 | the job configuration form | `ProceduralStepsSlide` + a `CodeBlock` |

Never a drawn approximation of a browser window. That is the mockup this workflow
forbids, and slide 43 exists precisely so the deck never has to pretend it knows
which version the room is running.

### TR patches

Three places under-deliver against their own headings. Patching the TR beats
inventing content or cutting the slide, and none changes what the session teaches.

| # | Where | What is missing, and the insert |
|---|---|---|
| 1 | §1.2 Step 5 | Promises a browser check and never says what is on the page. Insert the repository name and Public badge, the file list (`backend/`, `frontend/`, `docker-compose.yml`, `Makefile`, `.gitignore`) and the commit message on every row. Three lines. Slide 17 |
| 2 | §6.1 | Calls itself a tour, then defines four words and never names what is on screen. Insert the left-hand menu (`New Item`, `People`, `Build History`, `Manage Jenkins`) and the two lower-left panels (`Build Queue`, `Build Executor Status`, where the two default executors are visible). It also earns the two rows that currently define things the room has not been shown. Slide 46 |
| 3 | §5.1 | Goes straight from `docker run -d` to "open `http://localhost:8080`". `-d` means the room sees a container ID and nothing else, and first startup takes about a minute, so the likely event in the room is a browser error and a learner who thinks the command failed. Insert `docker ps` with the `jenkins` row at `Up 30 seconds`, and one line on startup time. Slide 39, deck count unchanged |

### Motion

Everything runs at the **explanatory tier** recorded in session 6's R12, which is
`.agents/skills/animate`'s own name for it: entrances 520ms, staggers 130ms, line
draws 860ms, a whole figure assembled in about 2.4s. Three consequences the plan
would otherwise have got wrong:

1. **Slide 20's card enters at `scale(0.97)`, never `scale(0)`.** Nothing in the
   real world appears from nothing, and the kit's `Reveal` animates transform and
   opacity only.
2. **Slides 30 and 32 assemble along the path, and the exception leaves the fork
   only once the happy path is complete.** That is `@/ui/figures/motion`'s rule,
   and it is also the teaching: drawing the failure exit while the spine is still
   building says a stage can fail before the earlier ones ran.
3. **Staggers are 130ms and the four dividers stay a crossfade.** Ten `DataTable`
   rows at a showier 260ms is 2.6 seconds of the room waiting to read row ten,
   and a divider seen four times in one deck belongs in the near-imperceptible
   tier.

Every figure wraps in `RevealGroup`/`Reveal` and never `Step` (rule 6), and mounts
at its final state under `useInstant()`. `prefers-reduced-motion` is already
handled by `src/index.css`, so the plan adds nothing there.

---

## 6. Where this compresses, if you want it shorter

- Slides 24 and 25 (Delivery, then Deployment) could be one slide, since 26
  tabulates all three terms anyway. I would push back gently: the room conflates
  the two CDs precisely because they are always taught on one frame. **54 → 53.**
- Slides 22 and 23 are the definition and its payoff line. Folding the payoff
  into the definition costs the deck its most quotable sentence. **54 → 53.**
- Slide 43 (versions drift) is insurance, not content. Cut it and the first
  learner whose wizard looks different derails five minutes. **54 → 53.**
- Slide 12 (recovering a committed `.env`) applies to a minority of the room.
  Cutting it is the one compression I would actually refuse: the minority it
  applies to has a leaked secret. **Not recommended.**
- The largest honest cut is concept 1. Slides 9 to 13 are a procedure, and a
  procedure compresses into one `ProceduralStepsSlide` plus the two warning
  frames. **54 → 50**, at the cost of the room being able to follow along live.

---

## 7. Sign-off

Say **approved** and generation starts. Five things I need with it, or I will
proceed on the answer written beside each:

1. **The quiz.** Hard rule 18 says every deck carries a `QuizTimeSlide`
   immediately before Key Takeaways; your standing instruction from sessions 5
   and 6 says no quiz frames at all. Third deck running.
   *Default: follow your instruction, no quiz, and record it as a named exception
   in `.claude/skills/slide-content-rules/SKILL.md` so the two stop contradicting
   each other silently.*
2. **`jenkins.png` and `github.png`**, fetched into `slide-kit/assets/tech/`.
   *Default: fetch both, as PNG at 512px from devicon, same source as the twelve
   language marks added for the Python course.*
3. **The `StationLogo` union**, widened for slide 38.
   *Default: widen it, on a `kit/station-logos-jenkins-github` PR. The
   alternatives are drawing two of five stations with a generic `icon` while the
   other three keep their marks, or dropping slide 38 and the session's map.*
4. **The three TR patches** in §5.1.
   *Default: apply all three to the TR doc before generating the slides that
   depend on them. If you would rather not touch the TR: slide 17 carries only
   the two checks, slide 46 drops to two terms rather than four, and slide 39's
   `docker ps` output is marked in the notes as not TR-sourced.*
5. **`ravi123`** as the GitHub username on slides 15 and 16, matching the Docker
   ID session 6 used.
   *Default: keep it, and say once out loud that every learner substitutes their
   own.*

On approval: scaffold `deployement_session_7/` at `devPort 5218`, write
`workflow/skills/session-7-deck/SKILL.md` carrying session 6's R1 to R13 forward,
generate all 54 slides, then `typecheck`, `build:html`, and `video-safe`, `qa`
and `align-check` **in parallel**, then `preview` and the contact sheet. Slides
18, 28, 30, 32 and 38 get looked at as images specifically: they carry figures,
and hard rule 17 says the three harnesses cannot see inside one.

---

## 8. What generation changed

### 8.1 Five slides more than planned, and two rules recorded

Two instructions arrived mid-generation and both were recorded in a named file
before being applied, per §8 of the generate-slides skill.

| Instruction | Recorded in | Effect |
|---|---|---|
| Two quiz frames | Hard rule 18 in `.claude/skills/slide-content-rules/SKILL.md`, rewritten rather than given an exception | +2 slides (35 and 56). The sessions 5 and 6 "no quiz anywhere" instruction is retired, so session 8 does not ask again |
| Every point readable by an absolute beginner | `TEXT_GUIDELINES.md` §3b, a new section | +3 slides, below |

The three slides the beginner rule added, each one a term that was going to be
used in a bullet before it was defined anywhere:

- **33 `c2-gate`.** "Gate" was a verdict line under a figure. It is a new word and
  the whole safety argument for CI/CD, so it gets a frame.
- **43 `c3-is-it-running`.** TR patch 3's `docker ps` beat. `-d` prints only a
  container id and first startup takes a minute, so the likeliest event in the
  room is a browser error that looks like a failed command.
- **49 `c4-the-screen`.** TR patch 2's dashboard tour. The vocabulary slide defined
  Build Queue and Executor before the room had been shown either.

### 8.2 The lab found five faults that every harness passes

`slide-kit/cicd-lab` (devPort 5227, seven candidate slides) was built before any
deck slide. Hard rule 17 is why: all three harnesses measure DOM rectangles and a
figure is one rectangle to them.

| # | Fault | Cause |
|---|---|---|
| 1 | `5 DEPLOY` rendered as a sliver off the right edge | `SpineFlow` has FIVE slots and the pipeline was given six nodes. `git push` is a trigger, not a stage, and the TR draws it that way too |
| 2 | The failure branch drew off the left edge at negative x | `SpineFlow` positions an `alt` branch at the `decision` node's index, which is -1 when the graph has no decision |
| 3 | `PASS` rendered as `PAS`, `FAIL` half covered | `GateFlow` parks its exit pills in a 46px gap and a four-letter pill is 50px. Positional, not editorial: shortening the node labels did not move it |
| 4 | Six `StepList` rows printed over the slide title | It is a three or four step component. This plan should not have offered it as slide 18's fallback |
| 5 | `BoundaryBridge` captioned Developer and GitHub ONE COMPUTER | Its subject is a machine boundary. Slide 38 is a sequence of five services, and the figure contradicted the ten slides of concept 1 that exist to say GitHub is not on your computer |

Faults 1, 2 and 5 changed what the deck draws. Faults 3 and 4 changed the kit.

### 8.3 Six kit files changed, on one PR

Additive, on `kit/station-logos-and-flow-labels`. Every other session needs
`sync-kit.mjs --apply` to pick them up, and the branch exists because that reaches
signed-off decks.

| Change | Where |
|---|---|
| `StationLogo` gains `github` and `jenkins` | `src/ui/flowFigure.ts`, `src/ui/BoundaryBridge.tsx` |
| `FcNode` gains `logo`, rendered by `NodeShell` on a white tile | `src/ui/flowchart/flowchartFigure.ts`, `NodeShell.tsx` |
| `SpineFlow` edge labels lift above the card row | `src/ui/flowchart/SpineFlow.tsx` |
| `GateFlow` PASS and FAIL move clear of their cards | `src/ui/flowchart/GateFlow.tsx` |

The last two are the same defect in two variants: an edge pill parked in a gap
narrower than the pill. `LaneFlow`, `CircuitMap` and `TrackSwitch` are untested
against it.

### 8.4 Two assets fetched

`jenkins.png` and `github.png`, from devicon at 512px, into
`slide-kit/assets/tech/` and then copied into `public/assets/tech/`. Hard rule 13.
`slide-kit/assets/README.md` inventory updated. `git` and `github` are kept
separate: one is the tool and one is the service, and slide 33 names both.

### 8.5 Seven slides fixed after the harnesses ran

`align-check.mjs` reported six on the first sweep and one more after the fixes.
All seven were a mono string breaking mid-token or a note sitting under the
bottom-left control cluster. The interesting one is slide 44: `docker exec jenkins
cat /var/jenkins_home/secrets/initialAdminPassword` wrapped at 13px, 11px and
10px, because a single bullet in `points` had put the panel in a half-width
column. Shrinking the type was the wrong lever three times running. The bullet was
the problem, its sentence moved into the lead, and the panel got full width.

Slide 29 was fixed from a screenshot rather than a harness: every card carried a
house icon AND the company mark, and three cards repeated one sentence verbatim.

### 8.6 Verification, as run

| Check | Result |
|---|---|
| `npx tsc -b --noEmit` | clean |
| `npm run build:html` | 4.23 MB self-contained, 20/20 assets inlined |
| `node video-safe.mjs` | CLEAN |
| `node align-check.mjs` | 0 of 59 |
| `node qa.mjs` | slides 1 and 59, the expected baseline |
| `node preview.mjs` | 59 slides captured, `"errors": []` |
| Figures read as images | 7, 18, 29, 30, 32, 40, 44 |

### 8.7 Still outstanding

- The plan's §6 compressions were not applied. The deck is 59 slides against a
  corpus median of 59, so nothing was cut.
- `npm run dev` ignores `devPort` in `deck.config.json` and falls through to
  5173, while every harness hardcodes 5218. Kit-wide, not session-specific, and
  it cost a full harness run to notice. Worth a separate fix.
- The `LaneFlow`, `CircuitMap` and `TrackSwitch` variants have not been checked
  for the edge-label defect fixed in `SpineFlow` and `GateFlow`.
