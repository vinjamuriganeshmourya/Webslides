# Deployment · Session 3: "Docker Compose for Multi-Container Apps"

**STATUS: SIGNED OFF 2026-08-20 · GENERATED AND VERIFIED 2026-08-20**

Concept 1 compressed to the comparison at sign-off. The deck is built at
**69 slides** in `deployement_session_3/`, and §8 below records what verification
actually found and what changed as a result.

| | |
|---|---|
| `SESSION_NAME` | `Docker Compose for Multi-Container Apps` (footer on every slide, never "Session 3") |
| `COURSE` | `React + Django Integration · Deployment` |
| `TR_DOC` | `/home/nxtwave/docker_jenkins_aws/03_docker_compose_multi_container.md` |
| Project | `deployement_session_3/` (scaffolded from `slide-template`, kit clean) |
| Deck file | `src/decks/dockerComposeDeck.tsx` |
| Slide count | **69** |
| `NEXT_UP` | The real `nxttrendz` project moves into this same file, with the same keys |
| Build rules | `workflow/skills/session-3-deck/SKILL.md` (rules S1 to S12, and the feedback log) |

---

## 1. Concept map

Four concepts. Every TR section maps under exactly one.

| # | Concept (agenda wording) | TR sections | Ends on the question that opens the next |
|---|---|---|---|
| 1 | A Second Container, on the Node Runtime | 1.1 to 1.8 | Two images exist. How do you run them **together**? |
| 2 | Running Both Containers By Hand | 2.1 to 2.3 | Six commands, all of it in your head. How do we write this down **once**? |
| 3 | Writing the docker-compose.yml File | 3.1 to 3.8 | The file is written. What happens when we **run** it? |
| 4 | Running the Stack, and How Containers Talk | 4.1 to 4.12 | One command runs both. How does one container **find** the other? |

The recap restates these four as outcomes. Nothing else gets a divider.

## 2. The narrative spine

The through-line the instructor speaks, one sentence per beat:

1. Last week you packaged **one** program. Your real application is **two**, and
   they do not even run on the same runtime.
2. So build the second one. It is the same five instructions, which is the point:
   the Dockerfile pattern does not change with the language.
3. Now you have two images, and starting your app means six commands in the right
   folders in the right order. That knowledge lives in your head, not in the
   project.
4. An orchestra cannot start itself either. It needs one score and one conductor.
   That is Docker Compose.
5. Write the score: one file, one key at a time, each key replacing something you
   were remembering.
6. Raise the baton. One command builds both, networks them, starts them in order
   and streams both logs.
7. One thing in that file was never explained: why the frontend was told
   `http://backend:8000` and not `localhost:8000`. Answering that is the last
   idea of the session, and it is the number one multi-container mistake.

Every divider is written as the question it answers, so the instructor can hand
over to it verbally.

## 3. New vocabulary, and where it is defined

Feedback item 1: nothing is used before it is defined. Room owns React, Django,
Python, JavaScript, and one Dockerfile from Session 2.

| Term | Defined on | Anchored in what they already own |
|---|---|---|
| runtime | 10 | `npm start` vs `manage.py runserver` |
| base image variant (`-slim`, `-alpine`) | 10 (callout) | Session 2's `python:3.14-slim` |
| one container one process | 13 | a crash that takes down both halves |
| `package.json` as a dependency list | 15 | their React project's own file |
| orchestration | 28 | the orchestra scene |
| Docker Compose | 29 | the conductor and the score |
| declarative vs imperative | 30 | a Django **model** vs writing the SQL |
| YAML | 35 | Python dicts and Python indentation |
| service | 36 | "our name for one container" |
| environment variable | 39 | `settings.py`, and their API base URL constant |
| container filesystem is temporary | 44 | Session 2's "images are frozen" |
| host | 45 | their own laptop, the thing Docker runs on |
| volume | 45 | a pen drive you plug into the container |
| project name | 51 | the folder the file sits in |
| detached mode | 53 | `runserver` holding the terminal |
| container network | 61 | a private street the two containers share |
| hostname | 61 | `localhost`, which they have typed a thousand times |

`localhost` gets a slide of its own **before** the answer, because the point
is that they already believe something false about it.

## 4. Slide-by-slide plan

Legend for **Assets**: `kit` = already in `src/ui`, `new` = built for this deck,
`png` = `public/assets/tech/*.png`, `TR` = transcript quoted from the TR doc.

### Front frame (1 to 7)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 1 | `brand` | (mark only) | `BrandSlide` | NxtWave mark + course | Brand fixture | fade | kit |
| 2 | `welcome` | Docker Compose for Multi-Container Apps | `WelcomeSlide minimal` | kicker `WELCOME TO TODAY'S SESSION` + session name | Bare hero; nothing competes with the title | fade | kit |
| 3 | `recap-dockerfile` | Where we Left Off | `ContentSlide` + `CodeBlock` | The six-line Dockerfile, plus `docker build -t nxttrendz-app .` and `docker run nxttrendz-app` | The exact artifact they wrote, so the session starts on their own file | code panel + bullets in parallel | kit |
| 4 | `recap-what-it-bought` | Where we Left Off | `RecapSlide` | Layers and cache (why `requirements.txt` is copied first) · `.dockerignore` keeps junk out · images are frozen at build time · the four commands so far | Same title as 3: a build sequence, per the corpus | stagger on entry | kit |
| 5 | `the-gap` | One Program, Two Programs | `ContentSlide` + `TwoRuntimes` | You packaged one script. `nxttrendz` is a React frontend **and** a Django backend, and neither is any use without the other. Closing question: how do you run two containers together? | `TwoRuntimes` draws the two apps with their logos and the two-way arrow, no ports and no browser (rule S1) | figure and bullets reveal together | **new** + png |
| 6 | `agenda` | Today's Agenda | `AgendaSlide` | The four concepts from §1, one gloss line each | Agenda fixture | curve draws, items cue off it | kit |
| 7 | `setup` | Initial Setup | `ContentSlide` + `Terminal` + `FileTree` | Open `C:\nxttrendz` in VS Code · start Docker Desktop · check `docker --version` · last session's four files are still in `docker-demo` | Two panels: the check command, and the tree it expects | parallel | kit, TR |

### Concept 1: A Second Container (8 to 22)

**Compressed at sign-off.** The room no longer writes `server.js`, `package.json`
and the Node Dockerfile one file per slide. It reads the finished Node side and
then the line-by-line table against Python, which is where the payoff lives.
Four slides removed: the base-image logo row folds into 10, the one-Dockerfile-per
-folder warning folds into 14, and the three file-creation slides become one.

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 8 | `c1-divider` | A Second Container | `SectionBreakerSlide` | index 1, subtitle *Same five instructions, a different runtime* | Divider fixture, navy stage | fade + mark | kit |
| 9 | `c1-a-choice` | That Line Was a Choice | `ContentNoteSlide` + `CodeBlock` | `FROM python:3.14-slim` with line 1 highlighted. Nothing about Docker is tied to Python | Their own file with one line lit: the smallest possible change of frame | highlight pulses once on entry | kit |
| 10 | `c1-runtime` | What is a Runtime | `ContentSlide` + `CardGrid` + logo row | One sentence: the program that runs your code. Python runs `.py`, Node runs `.js`. You have both installed already. Second beat: Docker Hub publishes an official base image per runtime, so `FROM` takes a different word and nothing else changes. Callout: `-slim` and `-alpine` are each runtime's minimal variant | Two cards carrying the vendor PNG, the file type and the command they have typed, over a row of further marks for the claim that there is one per runtime | cards stagger, logo row with them | **png** python, nodejs, java, go, php |
| 11 | `c1-two-programs` | Your App Is Two Programs | `ContentSlide` + `FileTree` + `DataTable` | `C:\nxttrendz\` with `backend\` (Django, Python) and `frontend\` (React, Node), and neither is any use without the other. Table: runtime · dependency file · start command | Tree names the folders they have; table makes the difference concrete in three rows | tree and table in one `RevealGroup` | kit, **png** react, django |
| 12 | `c1-one-container-q` | Could Both Fit in One Container? | `ContentSlide` | The question only, as the pause beat. No answer on this slide | Deliberately bare: the room answers out loud | question fades in, nothing else | kit |
| 13 | `c1-one-process` | One Container, One Process | `ContentNoteSlide` + `OneProcessRule` | Technically yes, and it would be a mess: two runtimes inside one image, two processes to babysit, one crash taking down both. Success callout carries the rule: Node gets a container, Python gets a container | `OneProcessRule` animates the cram-it-in attempt going red, then the two clean boxes | figure plays on entry, bullets alongside | **new** + png |
| 14 | `c1-workspace` | Today's Workspace | `ContentNoteSlide` + `FileTree` | Inside `docker-demo`: `backend\` holds last session's four files, moved in unchanged; `frontend\` is new. Named to match the real project, so everything learnt today transfers when the paths change. Warning callout: one folder, one Dockerfile. A single Dockerfile at the top of `docker-demo` with `COPY . .` would sweep **both** applications into **one** image, last session's warning in a new shape | `FileTree` with `state` per entry (`existing`, `new`) is exactly this slide, and the warning is about the level above it | entries stagger, warning as its own step (the trap is a beat) | kit |
| 15 | `c1-node-side-files` | The Node Side | `ContentSlide` + two `CodeBlock` panels + `AnalogyMap` | `server.js` prints two lines, `package.json` names the app with an empty `dependencies`. Mapping: `app.py` → `server.js` · `requirements.txt` → `package.json` · empty list → `"dependencies": {}`. One line: you already have a `package.json` in your React project, and an empty dependency list still matters because the install step treats empty and full the same | Two small panels over the role mapping: three slides of file creation compressed into the comparison that was the point of them | panels and mapping in one `RevealGroup` | kit |
| 16 | `c1-node-dockerfile` | The Node Dockerfile | `ContentSlide` + `CodeBlock` | The six lines, `node:22-alpine` first. Note: the dependency file is copied **before** the code for last session's cache reason, because `npm install` is the slow step and rarely needs to re-run | The whole artifact at once, because nothing on it is new | panel on entry | kit |
| 17 | `c1-line-by-line` | Line by Line Against Python | `ContentNoteSlide` + `DataTable` | Six rows, step · Python image · Node image · same idea. Success callout: the Dockerfile pattern does not change with the language. Only the base image, the dependency file and the start command change, and the same five instructions containerise a Java, Go or PHP application | Identical row labels down both columns is the corpus comparison shape, and this slide is now the section's payoff | rows stagger, callout not stepped | kit |
| 18 | `c1-dockerignore` | Its .dockerignore | `ContentNoteSlide` + `CodeBlock` + `FileTree` | `node_modules/`, `.vscode/`, `npm-debug.log`. Warning: if `node_modules/` were copied in, `COPY . .` would overwrite the packages `npm install` just built inside the image with yours, built for your OS rather than the container's. Tree shows both folders now holding the same four kinds of file | Code panel plus the completed tree: the section's closing state | parallel, warning as a step | kit |
| 19 | `c1-build` | docker build | `ContentSlide` + `Terminal` | From `C:\nxttrendz\docker-demo\frontend`, `docker build -t nxttrendz-frontend .` and the five numbered steps, one per instruction | One panel, path in the prompt (rule S3) | transcript on entry | TR |
| 20 | `c1-run` | docker run | `ContentNoteSlide` + `Terminal` | `docker run nxttrendz-frontend` → the two printed lines. Note: same "prints and exits" behaviour as last session, for a different language | Same panel, one command: the observable result | parallel | TR |
| 21 | `c1-rebuild-backend` | Rebuild the Python Side | `ContentSlide` + two `Terminal` panels | Panel 1 (`...\backend`): `docker build -t nxttrendz-backend .`. Panel 2 (`...\docker-demo`): `docker images` showing three rows | Two folders means two panels, side by side (rule S4) | panels reveal together | TR |
| 22 | `c1-two-images` | Two Images of Your Own | `ContentNoteSlide` + `DataTable` | The three image rows read as a table. Note: `nxttrendz-backend` and `nxttrendz-app` share an IMAGE ID, so Docker stored one image under two names, and `docker rmi nxttrendz-app` drops the old name. Closing line: two images exist, so how do we run them together? | Table because the point is one column, IMAGE ID | rows stagger | TR |

### Concept 2: Running Both By Hand (27 to 36)

| # | id | Title | Component | Content | Visual, and why | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 23 | `c2-divider` | Two Containers, By Hand | `SectionBreakerSlide` | index 2, subtitle *What does it actually take?* | Divider | fade | kit |
| 24 | `c2-by-hand` | What It Actually Takes | `ContentNoteSlide` + two `Terminal` panels | Backend panel: `cd`, build, run. Frontend panel: `cd`, build, run. Warning callout: six commands, and every one is a chance to be in the wrong folder. `ERROR: unable to prepare context: path "." not found` | Two panels make the two `cd`s visible as two places, which is the whole complaint | panels together, warning as a step | TR |
| 25 | `c2-remember` | What Must Be Remembered | `ContentSlide` + `DataTable` | Five rows, detail · if you get it wrong: which folder each build runs from · both images rebuilt after an edit · the image name for each app · start order · both containers stopped and removed | A comparison table with fragment cells; the corpus allows these to run long | rows stagger | kit |
| 26 | `c2-does-not-scale` | Add a Database and a Cache | `ContentSlide` + `HandRitual` | Six commands for two services. The normal shape of a real backend is four, and the ritual doubles. Nothing inside `docker-demo` says these containers belong together, so someone opening the folder cannot tell | `HandRitual` animates the command list growing from 6 to 12 and the risk tags multiplying | figure plays on entry | **new** |
| 27 | `c2-the-question` | The Question | `ContentSlide` | *How do we define a multi-container application once, in a file, and start or stop the whole thing with a single command?* | One sentence, centred. It is the session's thesis | fade | kit |
| 28 | `c2-orchestra` | Picture an Orchestra | `ContentSlide` + `Orchestra` | A single musician can start alone. An orchestra cannot: someone decides who plays, when they start and how they stay in sync. That is the conductor, reading one score | The session's signature scene. Baton rises, all players light up together | scene plays once on entry | **new** |
| 29 | `c2-what-is-compose` | What is Docker Compose | `ContentNoteSlide` + `AnalogyMap` | One sentence: a tool that reads a single file describing every container an application needs, and manages them as one unit. Mapping: musicians → containers · the score → `docker-compose.yml` · baton up → `docker compose up` · piece ends → `docker compose down` | The analogy is cashed out into the technical mapping on the slide after it is told, never left hanging | rows stagger | kit, **png** docker |
| 30 | `c2-declarative` | Commands to a File | `ContentSlide` + `CardGrid` | `docker run` is imperative: do this, then this. Compose is declarative: this is what my app looks like. You already made this shift once: you declared a Django **model** instead of writing the SQL to create the table | Two cards, and the third line is the bridge to something they built themselves | cards together | kit, **png** django |
| 31 | `c2-what-changes` | What Changes, and What Does Not | `ContentNoteSlide` + `DataTable` | The Dockerfiles do not change. The images do not change. What changes is who types the commands. Note: Compose runs `docker build` and `docker run` for you, it does not replace them | Prevents the commonest wrong model, that Compose is a different container system | rows stagger | kit |
| 32 | `c2-quiz` | Quiz Time! | `QuizTimeSlide` | Mid-deck checkpoint at the load-bearing concept boundary | Quiz fixture, hands over to the external quiz component | mascot enters | kit |

### Concept 3: Writing docker-compose.yml (37 to 51)

| # | id | Title | Component | Content | Visual, and why | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 33 | `c3-divider` | One File for the Whole App | `SectionBreakerSlide` | index 3, subtitle *Writing docker-compose.yml* | Divider | fade | kit |
| 34 | `c3-create` | Create the File | `ContentNoteSlide` + `FileTree` + `Terminal` | Named exactly `docker-compose.yml`, in `docker-demo` itself, above both app folders, because it is the one file that describes both. Note: from here on every command runs from `docker-demo`, not from inside either app folder | Tree with the file as `new`; terminal shows the prompt they will use for the rest of the session | parallel | kit |
| 35 | `c3-yaml` | What is YAML | `ContentSlide` + `YamlNesting` | A format built on two rules you already know from Python: `key: value` pairs like a dictionary, and indentation for nesting (spaces only, never tabs) | `YamlNesting` puts the YAML on the left and the equivalent Python dict on the right, drawing the indentation guides as they map | mapping draws on entry | **new** |
| 36 | `c3-services` | services | `CodeBuildSlide` | Step 1 of the build. `services:` is the top-level section, and every container is a "service". `backend:` and `frontend:` are **our** names for them | The file panel with only this key present, and one annotation card beside it | new line highlights, card fades in with it | **new slide type** |
| 37 | `c3-build-key` | build | `CodeBuildSlide` | Step 2. `build: ./backend` says do not look for a ready-made image, build one from the Dockerfile in that folder. Section 2's two `cd` and `docker build` pairs are now two lines, and the folder can no longer be wrong. Callout: `build:` is for your own code, `image:` is for ready-made software from Docker Hub like `hello-world` | Earlier lines stay in place; only the new key is lit | same | **new** |
| 38 | `c3-depends-on` | depends_on | `CodeBuildSlide` | Step 3. The backend has to be up before the frontend has anything to talk to. One line replaces "remember to start the backend first". Callout: it controls **start order** only, not whether the app inside is ready | same | same | **new** |
| 39 | `c3-env-var` | What is an Environment Variable | `ContentSlide` + `CardGrid` | A value handed to a program from outside it, so the same code can behave differently in two places. You have read one before: Django's `settings.py` pulls its secret and debug flag this way, and your React app has an API base URL constant | Two cards, Python and Node, each with the one line that reads it | cards together | kit, **png** python, nodejs |
| 40 | `c3-environment` | environment | `CodeBuildSlide` | Step 4. `APP_ENV: development` on the backend, `API_URL: http://backend:8000` on the frontend. Note callout: that value is deliberately not `localhost`, and the last section of today is entirely about why | Rule S6: the address is written, the reason is withheld | same | **new** |
| 41 | `c3-read-it` | Reading It In Code | `ContentNoteSlide` + two `CodeBlock` panels | One line added to each file: `os.environ.get("APP_ENV")` and `process.env.API_URL`. Note: the payoff is that the **same image** runs on your laptop and on a real server, and only these values change. No code edited, no rebuild | Two panels side by side, one per language, so the symmetry is visible | panels together | kit |
| 42 | `c3-secrets` | Never Put Secrets Here | `ContentNoteSlide` | Real secrets, like Django's `SECRET_KEY` or a database password, must never be typed into `docker-compose.yml`, because that file travels with the project. The standard practice is a separate file Compose reads automatically, kept out of the shared copy. That is set up later in this course | Warning callout is the whole slide. No tool named (rule S1) | callout on entry | kit |
| 43 | `c3-prediction` | A Prediction | `ContentSlide` | A container writes a file. The container is deleted, and a new one is created from the same image. Is the file still there? | The pause beat. Answered on the next slide, never on this one | question fades in | kit |
| 44 | `c3-answer-no` | No, and Here is Why | `ContentSlide` + `VolumeSurvival` act 1 | A container's filesystem lives and dies with the container. The image never changes, so nothing the container wrote is kept. Fine for a script that prints. A disaster for anything holding data | `VolumeSurvival` act 1: the container writes, the container is removed, the file goes with it | figure plays with the text | **new** |
| 45 | `c3-volume` | What is a Volume | `ContentNoteSlide` + `VolumeSurvival` act 2 | Storage Docker keeps on the **host**, your own machine, and plugs into a folder inside the container. Anything written into that folder is outside the container's own filesystem, so it survives. Note: the host is the machine Docker runs on, your laptop today | Act 2 of the same figure: the disk stays, a new container plugs into it and reads the file back | figure plays with the text | **new** |
| 46 | `c3-volumes` | volumes | `CodeBuildSlide` | Step 5. `- db_data:/app/data`, annotated in two halves: the named volume that lives on the host, and the folder inside the container whose contents must survive. Note callout: the bottom-level `volumes:` block declares the name so Docker creates the storage, and it sits at the far left, level with `services:`, not inside a service | The two-part anatomy is drawn under the line, the way the TR draws it | annotation arrows draw with the line | **new** |
| 47 | `c3-starts-txt` | Recording Each Start | `ContentSlide` + `CodeBlock` | `app.py` appends to `/app/data/starts.txt` and prints how many lines it has. Ordinary file handling, writing into the one folder that outlives the container | Their own Python, so the volume stops being abstract | panel on entry | kit |
| 48 | `c3-complete` | The Complete File | `ContentNoteSlide` + `CodeBlock` | The whole `docker-compose.yml`. Read as a sentence: my app is two services, `backend` built from `backend\Dockerfile`, told which mode it is in, keeping its data in a volume; and `frontend`, built from `frontend\Dockerfile`, told where the backend is, started after it. Success callout: two languages, two runtimes, one file, and the setup is no longer knowledge in your head | The assembled artifact closes the build sequence, per the corpus | panel on entry, callout as a step | kit |

### Concept 4: Running the Stack (53 to 67)

| # | id | Title | Component | Content | Visual, and why | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 49 | `c4-divider` | One Command, and How They Talk | `SectionBreakerSlide` | index 4, subtitle *Running the stack* | Divider | fade | kit |
| 50 | `c4-up-explain` | What up Will Do | `ContentSlide` + `CardGrid` | Before the command: build any image that is missing, create the network and the volume, start the services in dependency order, stream both logs. No command on screen yet (rule S7) | Four cards, which become the four ticks they are about to read | cards stagger | kit |
| 51 | `c4-up` | docker compose up | `ContentNoteSlide` + `Terminal` + `StackUp` | The transcript: network created, volume created, two containers created, then both services' labelled output, both exiting 0. Note: every name begins with `docker-demo`, the folder the file sits in. That is the **project name**, and it keeps this app's containers, network and volume separate from every other project's | `StackUp` ticks the four created things in the order the transcript prints them, so the eye pairs figure to output | transcript and figure together | TR, **new** |
| 52 | `c4-ps` | Where Did They Go | `ContentNoteSlide` + two `Terminal` panels | `docker compose ps` is empty, for the same reason `docker ps` was empty last session: both scripts finished. `docker compose ps -a` shows both, `Exited (0)`. Note: `compose ps` is `docker ps` narrowed to this project, and the same is true of `docker compose logs backend` | Two panels, because the difference between the two commands is the lesson | panels together | TR |
| 53 | `c4-detached` | What is Detached Mode | `ContentNoteSlide` + `Terminal` | Plain `up` holds your terminal until the containers finish, which is what you want for a script. `manage.py runserver` held it the same way. `-d` hands the terminal back and sends the output to the logs, so `docker compose logs backend` becomes how you read it | Anchored in a command they have run hundreds of times | parallel | TR |
| 54 | `c4-volume-works` | Watching the Volume Work | `ContentSlide` + `Terminal` + `VolumeSurvival` act 3 | Run `up` a second time: `Times started so far: 2`. A third time: 3. The containers were recreated from scratch each time, but `starts.txt` is not inside them | The payoff of slides 47 to 51, and the one line of output that proves it | counter animates 1 → 2 → 3 with the transcript | TR, **new** |
| 55 | `c4-down` | One Command Down | `ContentNoteSlide` + `Terminal` | `docker compose down`: containers and network removed, in the right order, every time. Note: the `db_data` volume survives, so the next `up` counts on from where it left off | The clean-up half of the one-command promise | parallel | TR |
| 56 | `c4-down-v` | down -v | `ContentNoteSlide` + `Terminal` | `docker compose down -v`, then `up`, and the count is back to 1. Warning: `-v` deletes the volumes and the data in them is gone permanently. Use it only for a deliberate factory reset | Same figure vocabulary as 58, now running backwards | transcript, warning as a step | TR |
| 57 | `c4-rebuild` | Code Changed? Rebuild | `ContentNoteSlide` + `Terminal` | Images are frozen at build time, and that has not changed. `docker compose up --build` rebuilds first. Without it Compose reuses the images it has and your change appears to do nothing: the two-container version of last session's "I edited the code and still see the old output" | Names the trap by name, in Session 2's own words | parallel | TR |
| 58 | `c4-wrong-folder` | The Error You Will Actually Hit | `ContentNoteSlide` + `Terminal` | Run it from `C:\nxttrendz` and you get `no configuration file provided: not found`. Why: `docker compose` reads `docker-compose.yml` from the folder you are standing in. Same lesson as last session's build context: read the path in your prompt before you blame the tool | The prompt path in the panel is the evidence (rule S3) | transcript, why as a step | TR |
| 59 | `c4-summary` | Command Summary | `ContentSlide` + `DataTable` | Seven rows: `up` · `up -d` · `up --build` · `ps -a` · `logs <service>` · `down` · `down -v` | The one slide the room photographs | rows stagger | kit |
| 60 | `c4-localhost` | localhost Is Not the Other Container | `ContentSlide` + `ComposeNetwork` act 1 | Why was it `http://backend:8000` and not `localhost:8000`, the address that worked all through the integration course? Because `localhost` means "this machine, right here", and inside a container, *here* is the container itself. The request would go straight back into its own container, where nothing is listening. This is the number one multi-container mistake | `ComposeNetwork` act 1: the arrow labelled `localhost:8000` leaves the frontend, curves back into it and turns red | figure and text together, the red beat last | **new** |
| 61 | `c4-service-name` | Service Names Are Hostnames | `ContentNoteSlide` + `ComposeNetwork` act 2 | Remember the network Compose created without being asked? Every service in the file is attached to it, and on that network each container reaches every other by its **service name** as the hostname. `backend:8000`. Not `localhost`, not an IP address. Note: rename the service to `api:` and the address becomes `api:8000`. Service names are not labels, they are addresses | Act 2: the same arrow relabelled `backend:8000`, crossing the network and turning green | figure and text together | **new** |
| 62 | `c4-who-uses-which` | Who Uses Which | `ContentNoteSlide` + `DataTable` | One container to another, inside Docker: the service name. Anything else to a container, from outside Docker: not possible until the service opens a port, which comes later in this course. Success callout: inside Docker, a service name is an address | Rule S1: the outside row is named and left unopened, not greyed out | rows stagger | kit |
| 63 | `c4-same-file-only` | Only Services in the Same File | `ContentNoteSlide` | Only services in the same Compose file share this network, which is why the name works with no setup on your part. A container started by a separate `docker run` is not on it and cannot resolve `backend` | Closes the boundary of the claim, so nobody over-generalises it | callout on entry | kit |

### Back matter (68 to 73)

| # | id | Title | Component | Content | Assets |
|---|---|---|---|---|---|
| 64 | `quiz` | Quiz Time! | `QuizTimeSlide` | The late checkpoint, at ~93% of the deck | kit |
| 65 | `takeaways` | Key Takeaways | `KeyTakeawaysSlide` | The four agenda concepts as outcomes: you can containerise an app in any runtime with the same five instructions · you can say why running containers by hand does not scale · you can write a `docker-compose.yml` with services, build, start order, environment and volumes · you can start and stop a whole stack with one command, and address one container from another by its service name | kit |
| 66 | `practice` | Try it by yourself | `PracticeSlide` | Add a third service of your own on a third runtime, give it one environment variable, make the frontend depend on it, and prove the volume survives a `down` followed by an `up`. The shape, not the solution | kit |
| 67 | `feedback` | Feedback | `FeedbackSlide` | Fixture | kit |
| 68 | `next-up` | Next Session | `ContentSlide` | The two scripts step aside and the real `nxttrendz` project moves into this same file, with the same keys. No tool named for a later session (rule S1) | kit |
| 69 | `thankyou` | Thank You | `ThankYouSlide` | Fixture, mark on stage, `footerLogo={false}` | kit |

**Count: 69 slides**, inside the 55 to 70 corpus band. The compression of concept
1 agreed at sign-off removed four slides, which is why the three cuts the draft
offered are no longer needed: slide 11's logo row is folded into 10, the
one-Dockerfile-per-folder warning into 14, and the three file-creation slides into
one. `What Changes, and What Does Not` (31) and `Only Services in the Same File`
(63) are kept.

## 5. What has to be built

### 5.1 New figures in `src/ui`

| Component | Slides | What it draws | Animation |
|---|---|---|---|
| `TwoRuntimes` | 5 | Two app cards inside one machine outline, React and Django PNG marks, a two-way arrow between them, runtime chip on each. **No ports, no browser** (rule S1) | cards in, arrow draws both ways |
| `OneProcessRule` | 13 | Left: one container with two runtimes crammed in, which bulges and goes red. Right: two clean containers, one runtime each | the cram fails, then the split settles |
| `HandRitual` | 26 | A command checklist with a risk tag per line, growing from two services to four | list grows, tags multiply |
| `Orchestra` | 28 | The signature scene: a conductor with a baton, a score, four seated players | baton rises and every player lights up on the same beat |
| `YamlNesting` | 35 | YAML on the left, the equivalent Python dict on the right, indentation guides drawn between them | guides draw, pairs light in turn |
| `VolumeSurvival` | 44, 45, 54 | Three acts on one figure: write and lose · plug in the host disk and survive · the counter climbing 1, 2, 3 | `act` prop, same as `ContainerJourney` |
| `ComposeNetwork` | 60, 61 | Two containers inside a labelled network boundary. Act 1: `localhost:8000` loops back, red. Act 2: `backend:8000` crosses, green | `act` prop |
| `StackUp` | 51 | The four things `up` creates, ticked in transcript order | ticks in sequence |

All eight read their colours from `src/design/tokens.ts`, are wrapped in
`RevealGroup`/`Reveal` (never `Step`), and honour `useInstant()`.

### 5.2 New slide type

`CodeBuildSlide` (`src/slides/CodeBuildSlide.tsx`, props in `types.ts`) for the
YAML build sequence, slides 36 to 40 and 46: a `CodeBlock` panel with the newly
added lines highlighted, one annotation card beside it, and an optional callout.
Six slides share it, which is what earns a type rather than six bespoke layouts.

### 5.3 Kit change

`CodeBlock` learns a **YAML mode**: `language="YAML"` colours `key:` tokens as
keywords and leaves values plain. This deck renders a YAML file as its main
exhibit on eight slides, the same argument that added the Dockerfile instructions
to the highlighter in Session 2.

### 5.4 Assets

`public/assets/tech/*.png` at 512px, rasterised from the vendor SVGs already in
the repo: `docker`, `docker-white`, `python`, `nodejs`, `react`, `django`, `npm`,
`vscode`, `vitejs`, `container-white`. **Done.**

Still to add, as PNG from the vendor's own SVG: `java`, `go`, `php` for slide 10.
Docker Compose has no separate official mark and uses `docker.png`. YAML gets an
in-house glyph in `src/ui/icons.tsx`, not an invented logo.

### 5.5 Captures

**None are possible.** Docker Desktop will not run on the capture machine
(Hyper-V/HCS unavailable inside VirtualBox), the same blocker as Sessions 1 and 2.
Every transcript on slides 7, 19 to 22, 24, 51 to 58 is **quoted from the TR doc**
and rendered through `Terminal`, and the speaker note on each says so. Image IDs,
sizes and timings are illustrative. Tracked as outstanding captures C1 to C12 in
`workflow/assets-manifest.md`; swapping real output in later needs no layout
change.

## 6. TR patches this plan applies

| # | The TR | The deck, and why |
|---|---|---|
| 1 | Section 2.3 introduces Compose immediately after the six-command list | Three slides sit between them: the growing ritual (26), the thesis question (27), and the orchestra (28). The room has to feel the problem before the tool is named, per `PEDAGOGY_GUIDELINES.md` §2 |
| 2 | Section 3.6 sets `API_URL: http://backend:8000` and defers the reason to 4.9 with a one-line aside | Kept, and made explicit as a note callout on slide 40 so the instructor plants it deliberately rather than reading past it |
| 3 | Section 4.9 to 4.11 explain hostnames in prose with an ASCII diagram | Becomes the two-act `ComposeNetwork` figure across slides 60 and 61, because the wrong mental model is spatial |
| 4 | "the next session earns it" appears in 4.11, and 3.6 names a `.env` file | Both become "later in this course" on the slide, tool names in `notes` only (rule S1) |
| 5 | Environment variables are used in 3.6 with no definition | New definition slide 39, anchored in `settings.py` and their API base URL |
| 6 | "runtime" is used throughout section 1 with no definition | New definition slide 10, anchored in `npm start` and `manage.py runserver` |
| 7 | The volume is explained once, in 3.7, and demonstrated once, in 4.4 | One figure spans both, in three acts, so the demonstration lands on the same picture as the explanation |
| 8 | Section 1.8's `docker images` output is the only place the duplicate IMAGE ID is mentioned | Promoted to its own slide (22), because "one image, two names" is a real question the room will ask |

## 7. Sign-off

- [ ] Four concepts, every TR section mapped
- [ ] One divider per concept, each written as the question it answers
- [ ] Every term in §3 defined before first use
- [ ] The YAML built one key per slide, then shown whole
- [ ] Every command explained before its transcript
- [ ] Two quizzes: mid-deck at the concept-2 boundary, and late
- [ ] Agenda and takeaways carry the same four items in different UI
- [ ] Nothing opens problem 2: no ports, no server, no public URL
- [ ] Every technology rendered as a PNG

**Decision:** SIGNED OFF 2026-08-20. Concept 1 compressed to the comparison
(4 slides removed, deck at 69). Generation may start.

---

## 8. What generation and verification changed

The plan survived generation intact. Everything below is a defect the harnesses or
a render review found, and the fix that shipped. Nothing here changed the teaching
sequence.

### 8.1 Layout, found by `video-safe.mjs`

Five slides placed content in the instructor-video rectangle (`x 913..1280,
y 0..220`). The cause was the same in four of them and worth recording, because it
will recur: **a `ContentNoteSlide` with no `lead`, or a `ContentSlide` whose body
is short, floats its content ABOVE the y=220 floor.** A lead-less header stops at
y=168 instead of y=216, and a centred body block taller than its region overflows
upward into the reserved box.

| Slide | Was | Now |
|---|---|---|
| 9 `c1-a-choice` | lead-less `noteFirst` callout at y=219 | `ContentSlide` with a lead, code panel plus a `Callout` in one column |
| 17 `c1-line-by-line` | lead-less table put its fourth header at y=201 | gained a lead; shorter fourth-column cells and a one-line callout |
| 19 `c1-build` | bullets forced a 9-line terminal into the 1fr column, overflowing it | full-width panel plus two callouts, the Session 2 transcript shape |
| 29 `c2-what-is-compose` | lead-less `noteFirst`, same as slide 9 | gained a lead |
| 54 `c4-volume-works` | terminal and figure stacked in the narrow column | side by side, terminal plus callout on the left |

### 8.2 Frame overflow, found by `qa.mjs`

Six slides ran past the bottom of the 1280x720 frame. Two causes:

- **`ContentNoteSlide` reserves 80px of bottom padding and a 64px gap above its
  callout**, so a figure or a six-row table plus a callout does not fit. Slides
  17, 45, 48 and 51 moved to `ContentSlide`, which reserves neither, with the
  callout's content in the lead or in a `Callout` inside the body.
- **A scrolling `CodeBlock` is reported as an overflow**, because the harness
  measures the un-clipped content rect. That is the right call: a panel that
  scrolls is a panel whose learner cannot see the whole file. Fixed by giving
  `CodeBlock` a `fontSize` prop (§8.5).

Slide 14's file tree also lost its four child file entries, which slide 18 already
lists as a folder note.

### 8.3 A real content bug, found by rendering slide 46

The six build slides' highlight line numbers were a hand-written array, and **two
of the five entries were wrong**. Inserting `environment:` into the backend block
pushes the whole frontend block down by two lines, so `depends_on`'s numbers
silently stopped matching the slide that had already been written, and the
`volumes` slide lit line 17 and a line 18 that does not exist. The room would have
watched the wrong lines light up.

The array is gone. `addedLines()` computes the inserted lines from the
longest-common-subsequence of consecutive steps, so the highlight is derived from
the file and a later edit to an early key cannot desynchronise a later slide.

### 8.4 Alignment and connection review

A new harness, `align-check.mjs`, measures every body block against the header's
left edge and the stage centre (session rule S14). First run: 18 of 69 slides.
After excluding decoration, SVG internals, the kit's right-aligned mascot slots
and centred slide types, and after the fixes below: **1 of 69**, and that one is
the Agenda slide's own decorative circle.

| Finding | Fix |
|---|---|
| `Orchestra`, `OneProcessRule`, `HandRitual` and `TwoRuntimes` sat hard left with a hole beside them | `justify-center` on each figure's own root. `mx-auto` does nothing here: an auto-width block is already full width, so the margins have nothing to distribute |
| `Orchestra`'s caption ran through the front-row players' labels | figure grew from 274px to 312px and the players moved apart |
| Slide 28 squeezed the signature scene into the 1fr column, 396px against its 560 | the scene gets the full stage; its two bullets said no more than the lead |
| `OneProcessRule`'s crash label wrapped out of its band | shorter label, taller band |
| The six build slides were six differently sized boxes: `services` left 296px of dead space, `volumes` left none | `CodeBlock` gained `minHeight` (§8.5). All six are now one fixed box the file grows inside |

Content connection, found by reading all 69 kickers, titles and leads as one script:

| Finding | Fix |
|---|---|
| Dividers 2 and 4 invented their own titles, so the agenda promised "Running Both By Hand" and the divider announced "Two Containers, By Hand" | all four divider titles are now the agenda's own four names, verbatim |
| Divider 2's subtitle repeated the NEXT slide's title word for word | subtitle is now *You have two images. Now start the application* |
| Slides 5 and 11 made the same claim six slides apart | slide 11 is retitled **Two Runtimes, Not One** and now answers the question slide 10 opens: you know what a runtime is, so how different are these two? |
| Slide 62 was the only content slide in concept 4 with no lead | gained one |

### 8.5 Kit changes, made in `slide-template` as well

| Change | Why |
|---|---|
| `CodeBlock` YAML mode: `language="YAML"` colours `key:` tokens | A compose file is the main exhibit on eight slides and the KEY is the lesson. Same argument that added the Dockerfile instructions in Session 2 |
| `CodeBlock` `fontSize` prop, as `Terminal` already had | The finished 18-line file scrolls at 17px, which hides the service-level `volumes:` from the bottom-level block that declares it |
| `CodeBlock` `minHeight` prop | So a build sequence is one fixed box the file grows inside, rather than a box that resizes on every slide |
| `StackUp`'s `flow.tsx` `value` prop promoted from Session 2 into the template | It was a genuine improvement sitting only in one session; `sync-kit --check` now reports all sessions up to date |
| `TwoApps.tsx` had a spaced em dash in a rendered string | Fixed. It is a kit file, so it was breaking content rule 1 for every session |
| New harness `align-check.mjs` | `qa.mjs` and `video-safe.mjs` have no opinion about content that is inside the frame and still misplaced |

### 8.6 Two slides exceed the 117-word corpus p90, deliberately

`c1-line-by-line` (145) and `c2-what-is-compose` (131). Both are comparison
tables whose cells are all fragments, which `TEXT_GUIDELINES.md` §1 exempts by
name. No prose slide in the deck exceeds the budget.

### 8.7 Verification state

```
npx tsc -b --noEmit          clean
npm run build                clean
npm run build:html           dist-single/deployment-session-3.html, 3.95 MB, 13/13 assets inlined
node video-safe.mjs          CLEAN
node qa.mjs                  2 of 69, both the documented baseline (slide 1, slide 69)
node align-check.mjs         1 of 69, the Agenda slide's decorative circle
```

### 8.8 A 14-agent review round, and what only agents found

Every harness was green on a deck that still had real defects, so the review was
fanned out: five agents by slide range, one on narrative flow, one on the
vocabulary contract, each reading the rendered PNGs, then a skeptic pass per
reviewer whose only job was to REFUTE. **27 findings refuted, 25 confirmed
(17 distinct), all fixed.**

Two whole classes of defect were invisible to `qa.mjs` and `video-safe.mjs`, and
both are now measured by `align-check.mjs` (session rules S15 and S16):

- **Text under the deck chrome.** The counter, the three nav buttons
  (x 111..247, y 664..704) and the footer mark (x 1173..1248, y 668..704) are
  painted OVER the stage. Slides 35, 53 and 61 had a callout's last line running
  under the buttons, rendering as `the a__r_ss becomes`. Inside the frame, inside
  the video-safe area, unreadable.
- **Panels clipping their own content.** No scrollbar appears at these sizes, just
  a line cut through the middle of a glyph. Slide 15 lost `.");` off `server.js`
  and `package.json`'s closing brace; slide 47 clipped the exact line its own
  bullet pointed at; slides 18, 21, 24 and 34 sheared commands and filenames.

The other confirmed findings:

| Slide | Defect | Fix |
|---|---|---|
| 28 | The `One score` card was off-axis by half its width | `-translate-x-1/2` on an element that animates `y`: framer-motion writes an inline transform every frame and discards the class. This is the pitfall `CLAUDE.md` §6 says has caused three bugs in this repo, and it caused a fourth. Centred through the animation with `x: '-50%'` |
| 5 | The Django card's runtime chip hung below its border | A hard `h: 148` on a card whose role line wraps to two. Width only now, with `items-stretch` on the row |
| 6, 8, 65, 19 | The deck could not decide whether the Dockerfile is five instructions or six | Both counts are real and count different things. The **file** has six instructions; the **build** has five steps, because `CMD` declares rather than executes. The file is now always six, and slide 19 says *Five steps for six lines* and explains why |
| 9 | Labelled `docker-demo\backend\Dockerfile`, a path that does not exist until slide 14 | `docker-demo\Dockerfile`, matching slides 3 and 7 |
| 11 | Start commands were `node server.js` / `python app.py`, contradicting slide 10 | `npm start` / `python manage.py runserver`, matching slide 10 and the real project the tree beside it shows |
| 26 | `service` used nine slides before slide 36 defines it, and the lead said "a real backend" while the figure's four boxes include the frontend | One reword fixes both: *Six commands run two containers. Four containers is the normal shape of a real application* |
| 44 | The figure printed `db_data` and "the host, your machine" in act 0, pre-answering slides 45 and 46 | Act 0 says *storage* and *outside the container*. The real names arrive from act 1, after 45 defines host and 46 names the volume |
| 61 | Slides 60 and 61 did not draw the same picture: the figure jumped 530px left and 60px up between them, breaking the figure's own stated contract | Slide 61 is now slide 60's exact frame, bullets left and figure right at the same x and y, so only the arrow, its colour and its label change |
| 61 | `hostname` was in the title and defined nowhere | The reframe made room: *A hostname names a machine in an address*, with *localhost is one you already know* |
| 9 | `runtime` was load-bearing on slide 9, one slide before slide 10 defines it | Slide 9's lead says *the program that runs your code*. The agenda item and divider subtitle keep the word: both are section labels for the section whose second slide defines it |

### 8.9 Final round of user feedback

| Ask | What changed |
|---|---|
| Name the next session, **Running Project on Docker** | Slide 68 is retitled to it. This does not breach S1, which bars naming a later session's *tools*; `PEDAGOGY_GUIDELINES.md` §1 requires closing by naming the next session by title |
| Remove the text under Thank You | `ThankYouSlide` renders with no `message`. Slide 68 is the ending; a line here gave the deck two |
| Apply the text guidelines, make the copy concise | Rule S17. Every rendered string measured against `TEXT_GUIDELINES.md` §1 |

The measured result, against the corpus:

| | This deck | Guideline |
|---|---|---|
| Title words | median 4, p90 5 | median 2, p90 5 |
| Lead words | median 13, p90 18 | rule S17 ceiling 20 |
| Bullet words | median 4, p90 8 | median 3, p90 10 |
| Over any ceiling | **0 slides** | |

Four leads had been over the ceiling for a specific reason worth recording: when a
callout overflowed the frame earlier in the build, the cheap fix was to move its
sentence into the lead. That clears the overflow and breaks the text budget, and
it happened four times (slides 27, 28, 43, 51, and slide 53 reached 35 words).
Cutting the words is the fix; moving them is not.

### 8.10 Final verification

```
npx tsc -b --noEmit          clean
npm run build                clean
npm run build:html           dist-single/deployment-session-3.html, 3.95 MB, self-contained
node video-safe.mjs          CLEAN
node qa.mjs                  2 of 69, both the documented baseline (slide 1, slide 69)
node align-check.mjs         1 of 69: the Agenda slide's own decorative circle
build-reveal-steps.mjs       69 slides; 44 carry 0 or 1 build step, so text and
                             visual arrive together and the single step is the
                             deliberate teaching beat (content rule 6)
text budget                  0 slides over any ceiling
```

### 8.11 Session name, made consistent everywhere

The name was already `Docker Compose for Multi-Container Apps` in all eleven
deck-content places. What still named the *template* was the project around it:

| Place | Was | Now |
|---|---|---|
| Browser tab, dev and the standalone HTML | `NIAT · Web Slides` | the session name, read from `deck.config.json` |
| `package.json` name and description | `nxtwave-slide-template`, "Base template for NxtWave session slide decks" | `deployement-session-3`, and the session name |
| `package-lock.json` | `nxtwave-slide-template` | `deployement-session-3` |
| `CLAUDE.md` heading and preamble | "Design system rules — slide-template", describing itself as the base template | the session name, and what this directory actually is |
| `README.md` heading | "NxtWave Evolve — Web Slides Template" | the session name, slide count and deck path |

The tab title is the one worth recording as a kit fix rather than a session fix.
`index.html` is a **kit file**, so any session name written into it would be
overwritten by the next `sync-kit` in every other session, which is exactly why it
still said `NIAT · Web Slides`: the tab of a finished deck, and of the
self-contained HTML people are handed, named the template. It now carries a
`%DECK_TITLE%` placeholder that a small `deck-title` vite plugin fills from
`deck.config.json`, in both the normal and the single-file build. Every session
gets its own tab title from the one file it owns, and no session needs to touch
`index.html` again.

`src/decks/baseDeck.tsx` deliberately keeps the name "Base Template". It is the
kit's content-free theme-check deck, not this session, and `activeDeck.ts` points
at `dockerComposeDeck`.

Also registered `align-check.mjs` in `sync-kit.mjs`'s file list, so the new
harness reaches every session instead of living only here.

Final count: **18 occurrences of the session name, 0 variants** anywhere in the
project, the plan, the skill or the manifest.
