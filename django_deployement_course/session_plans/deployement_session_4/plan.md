<!-- cSpell:ignore nxttrendz deployement NxtWave colour colours behaviour djangorestframework simplejwt dockerignore nvmrc PYTHONUNBUFFERED runserver gunicorn createsuperuser sqlite Vite vitejs nodejs venv hostnames myproject asgiref sqlparse travelling realisation containerised -->
# Deployment · Session 4: "Running the Real App with Docker"

**STATUS: SIGNED OFF 2026-08-21 · GENERATION IN PROGRESS**

No slide is generated until this plan is approved. Section 7 is the gate.

| | |
|---|---|
| `SESSION_NAME` | `Running the Real App with Docker` (footer on every slide, never "Session 4") |
| `COURSE` | `React + Django Integration · Deployment` |
| `TR_DOC` | `/home/nxtwave/docker_jenkins_aws/04_running_django_app_with_docker.md` (845 lines) |
| Project | `deployement_session_4/` — to be scaffolded from `slide-kit/slide-template` |
| Deck file | `src/decks/runningRealAppDeck.tsx` |
| Proposed slide count | **72** (see §6 for where it compresses if you want it shorter) |
| `devPort` | `5215`. Note: the kit and **all three** existing sessions are on `5211` — the scaffold never changed it, so two decks cannot run at once today. 5215 keeps session 4 out of that collision; renumbering the others is a separate call |
| `NEXT_UP` | `Automate Deployment using Makefile` (the next session's confirmed name) |
| Build rules | to be created at `workflow/skills/session-4-deck/SKILL.md` on sign-off |

---

## 1. Concept map

**Four concepts. Every one of the TR's six sections maps under exactly one.**
The TR's own agenda lists six items; six dividers would break the one-divider-
per-concept rule and, more importantly, sections 2 and 3 are the same idea told
twice (a Dockerfile for each half of the app), and section 6 is section 5's
failures. Merging them is what makes four.

| # | Concept (agenda wording) | TR sections | Ends on the question that opens the next |
|---|---|---|---|
| 1 | The Real Project Moves In | 1.1 to 1.3 | Nothing in the app changes, only its packaging. So what does the packaging look like for a **real** Django app? |
| 2 | A Dockerfile for Each Half | 2.1 to 3.4 | Two buildable images exist. What is missing is the file that runs them **together**. |
| 3 | The Compose File, and the ports Key | 4.1 to 4.6 | The file is complete. What happens the first time you **run** it? |
| 4 | First Run, and Who Talks to Whom | 5.1 to 6.7 | (closes the session) |

The recap restates these four as outcomes. Nothing else gets a divider.

## 2. The narrative spine

One sentence per beat, the through-line the instructor speaks:

1. For three sessions the apps were deliberately toy scripts, so every idea was
   about Docker and nothing else. **That excuse is used up today.**
2. The real `nxttrendz` project moves in. Two terminals and a venv become one
   command, and not one line of application code changes.
3. Everything you own survives contact with it: the same five instructions, the
   same Compose keys, the same commands. Exactly **two** keys are new.
4. Write the backend Dockerfile. It is last session's recipe plus two lines that
   exist only because this is a real server: unbuffered logs, and a binding.
5. Write the frontend Dockerfile. Same lesson twice: **the project's own files
   decide the base image** — `pip freeze` chose the Python, `.nvmrc` chose the Node.
6. Write the Compose file. One new key opens the door from outside (`ports`), one
   keeps last session's promise about secrets (`env_file`), and the volume from
   last session finally holds a real database.
7. Run it. For the first time the containers **stay up**, because these are
   servers. The logs immediately ask for migrations, and the command to run them
   has to go **inside** the container: `exec`.
8. Then the paradox. The frontend was told `http://localhost:8000`, flatly
   contradicting last session's iron rule — and it is correct. Resolving that is
   the most important idea of the session.
9. Finally the five errors this setup actually produces, each one an idea from
   today met in the wild.

Every divider is written as the question it answers, so the instructor can hand
over to it verbally.

## 3. New vocabulary, and where it is defined

| Term | First defined on | In one line |
|---|---|---|
| pinning | 19 | `==` fixes the exact version, so every build installs the same package |
| `ENV` (instruction) | 25 | Sets an environment variable inside the image, permanently, at build time |
| `PYTHONUNBUFFERED` | 25 | Makes Python print immediately instead of buffering, so `logs` is not empty |
| binding / `0.0.0.0` | 26 | The server's door policy inside the container, not an address anyone types |
| lockfile | 33 | Where npm records the exact version of every package, sub-dependencies included |
| `ports` (key) | 39 | Publishes a container port on the host — the door from outside Docker |
| publishing | 39 | What `ports` does; distinct from the container-to-container network |
| `env_file` (key) | 48 | Hands every variable in a file to the container, for values that must not travel |
| `exec` | 62 | Runs a command inside an already-running container |
| detached mode | 57 | `-d` returns the prompt; mandatory once containers are servers |

Deliberately **not** redefined: image, container, volume, service, `depends_on`,
service-names-are-hostnames. All are last session's, and the recap restates them.

## 4. Slide-by-slide plan

Legend for **Assets**: `kit` = already in `src/ui`, `new` = built for this deck,
`png` = from `slide-kit/assets/tech/`, `TR` = transcript quoted from the TR doc.

### Front frame (1 to 7)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 1 | `brand` | (mark only) | `BrandSlide` | NxtWave mark + course | Brand fixture | fade | kit |
| 2 | `welcome` | Running the Real App with Docker | `WelcomeSlide minimal` | kicker `WELCOME TO TODAY'S SESSION` | Bare hero | fade | kit |
| 3 | `recap-compose` | Where we Left Off | `ContentSlide` + `CodeBlock` | Last session's finished `docker-compose.yml`, the two-service version with `db_data` | Their own file, so the session opens on what they wrote | code panel + bullets in parallel | kit |
| 4 | `recap-what-it-bought` | Where we Left Off | `RecapSlide` | `up` builds and networks and starts · `down` removes, volumes survive, `down -v` deletes · after an edit, `--build`, because images are frozen · **service names are hostnames** | Same title as 3, a build sequence | stagger | kit |
| 5 | `excuse-used-up` | The Toy Apps Were on Purpose | `ContentNoteSlide` + `TwoRuntimes` | Both demo apps were a few printed lines, so every idea learnt was about Docker and nothing else. Callout carries the turn: today the real `nxttrendz` project moves into containers | `TwoRuntimes` already draws exactly this pair with their marks | figure and text together | kit + png `react`, `django` |
| 6 | `agenda` | Today's Agenda | `AgendaSlide` | The four concepts from §1, one gloss line each | Agenda fixture | curve draws, items cue off it | kit |
| 7 | `setup` | Initial Setup | `ContentSlide` + `Terminal` + `FileTree` | Open `C:\nxttrendz` in VS Code · Docker Desktop running · `docker --version` · `docker-demo\` stays where it is, untouched | The check command and the tree it expects | parallel | kit, TR |

### Concept 1: The Real Project Moves In (8 to 15)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 8 | `c1-divider` | The Real Project Moves In | `SectionBreakerSlide` | index 1, subtitle *Same app, new packaging* | Divider, navy stage | fade + mark | kit |
| 9 | `c1-before` | How Every Day Has Started | `ContentSlide` + two `Terminal` panels | Panel 1 `...\backend`: `env\Scripts\activate`, `runserver`. Panel 2 `...\frontend`: `npm run dev` | Two folders means two panels; the two rituals must be visibly two | panels reveal together | TR |
| 10 | `c1-after` | How It Starts From Today | `ContentNoteSlide` + `Terminal` | One panel at `C:\nxttrendz`: `docker compose up -d`. Callout: same app, same two addresses, no venv, no Node version | One panel against the previous slide's two: the contrast **is** the argument | single panel, callout as its own step | TR |
| 11 | `c1-workspace` | The Starting Point | `ContentSlide` + `FileTree` | `C:\nxttrendz\` exactly as the integration course left it: `backend\` with `manage.py`, `requirements.txt`, `myproject\`, the apps, `env\`; `frontend\` with `package.json`, `src\`, `node_modules\`; `docker-demo\` | The tree they actually have, before anything is added | entries stagger | kit |
| 12 | `c1-nothing-changes` | Not One Line of App Code | `ContentSlide` | No model, view, serializer or React component changes today. The application is done; only its packaging is new | Deliberately typographic. This is a promise, and a promise does not need a picture | single line, then the supporting one | kit |
| 13 | `c1-already-own` | What You Already Own | `ContentSlide` + `DataTable` | Three rows, *You already own* → *Today it is applied to*: five Dockerfile instructions → Django then React · `services`/`build`/`environment`/`depends_on`/`volumes` → the real apps · `up`/`down`/`--build`/`logs`/`ps` → run from `C:\nxttrendz` | Identical row labels down both columns is the corpus comparison shape | rows stagger | kit |
| 14 | `c1-two-new-keys` | Exactly Two Keys Are New | `ContentNoteSlide` + `CodeBlock` | `ports` — the one last session ended on — and `env_file`, which keeps last session's `.env` promise. Everything else today is the half-dozen details a real project adds | Two lines of YAML lit inside an otherwise familiar file | the two keys highlight, nothing else moves | kit |
| 15 | `c1-the-claim` | What Real Deployment Work Is | `ContentNoteSlide` | The quotable line: *real deployment work is a pattern you already know, plus the specific details of your own project*. Closing question: so what does that pattern look like for a real Django app? | Bare, because it is the sentence the room should leave with | quote fades in alone | kit |

### Concept 2: A Dockerfile for Each Half (16 to 37)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 16 | `c2-divider` | A Dockerfile for Each Half | `SectionBreakerSlide` | index 2, subtitle *Backend first, then frontend* | Divider | fade + mark | kit |
| 17 | `c2-requirements-as-is` | What the Course Left Behind | `ContentSlide` + `CodeBlock` | `backend\requirements.txt`: five unpinned names | Their own file, unchanged, before the problem is named | panel on entry | kit |
| 18 | `c2-the-question` | Same Django Next Month? | `ContentSlide` | The question only: if `pip install -r requirements.txt` runs today, and on a teammate's machine next month, does it install the same Django? No answer on this slide | The pause beat; the room answers out loud | question fades in, nothing else | kit |
| 19 | `c2-pip-freeze` | Your venv Already Knows | `ContentSlide` + `Terminal` | `pip freeze` and the abridged output with real versions | One panel, path in the prompt | transcript on entry | TR |
| 20 | `c2-pinned` | Pinned | `ContentNoteSlide` + `CodeBlock` | The five lines with `==`. Note: `pip freeze` also lists dependencies of your dependencies (`asgiref`, `sqlparse`, `PyJWT`); pinning the five you chose is enough, pip resolves the rest | The same file as slide 17 with the versions arrived: a before/after the room can see | versions type in per line | kit |
| 21 | `c2-base-image` | The Tag Is a Decision | `ContentNoteSlide` + `DataTable` | For two lines of `print`, any Python works. Django 5.2 supports Python 3.10 to 3.13, so the tag is the newest Python this Django was tested against: `python:3.13-slim` | A short support-matrix table makes "decision, not habit" concrete | rows stagger, chosen row lights last | kit + png `python`, `django` |
| 22 | `c2-backend-dockerfile` | The Backend Dockerfile | `ContentSlide` + `CodeBlock` | All seven lines of `backend\Dockerfile` | The whole artifact at once; the room has written five of these lines before | panel on entry | kit |
| 23 | `c2-five-of-seven` | Five Lines You Have Written Before | `ContentSlide` + `CodeBlock` annotated | The same panel with the five familiar lines dimmed and the two new ones lit: base image, workdir, dependency file first (the cache rule), install, code, start | Dimming is the cheapest possible way to say "look here" | dim settles, two lines pulse once | kit |
| 24 | `c2-env-instruction` | ENV, a New Instruction | `ContentSlide` + `CodeBlock` | `ENV PYTHONUNBUFFERED=1` sets a variable **inside the image**, permanently — the same mechanism as Compose's `environment:`, baked in at build time | One line, its own slide, because `ENV` is the sixth instruction they now know | line highlights | kit |
| 25 | `c2-unbuffered-why` | Why That Line Exists | `ContentNoteSlide` + `Terminal` | Without it, `docker compose logs backend` can show **nothing** while Django runs fine. Warning callout: a genuinely confusing hour, prevented by one line | An empty log panel is the honest picture of the symptom | empty panel, then the callout | kit |
| 26 | `c2-binding` | The Address in the CMD | `ContentNoteSlide` + `CodeBlock` | Plain `runserver` binds `127.0.0.1`, which inside a container means *accept connections only from inside this container*. The browser's request arrives from outside and is refused. `0.0.0.0` accepts from any interface | The CMD with the address called out, per the TR's own arrow | address highlights, explanation follows | kit |
| 27 | `c2-two-questions` | Two Questions, Two Answers | `ContentNoteSlide` + `DataTable` | *What do I type in the browser?* → `localhost:8000`, unchanged all course. *What must the server bind to?* → `0.0.0.0`. Success callout: **inside a container, a server always binds to `0.0.0.0`** | Two rows, because the confusion is exactly two things being conflated | rows stagger, callout not stepped | kit |
| 28 | `c2-runserver-note` | A Note on runserver | `ContentNoteSlide` | `runserver` is Django's development server, used all course for learning. Production swaps it for gunicorn: the CMD changes, gunicorn joins `requirements.txt`, everything else stays identical | Typographic; this is an aside, and it should look like one | fade | kit |
| 29 | `c2-backend-dockerignore` | Its .dockerignore | `ContentSlide` + `CodeBlock` | The eight lines of `backend\.dockerignore` | The artifact first, the reasoning next | panel on entry | kit |
| 30 | `c2-dockerignore-earns` | One Line Earns Its Keep | `ContentNoteSlide` + `DataTable` | `db.sqlite3` now excludes your laptop's **real dev database**, months of test data. Three new entries table: `data/` (the folder it is about to move into) · `.env` (secrets, guards a stray copy) · `.vscode/` | Table for the three new entries; the callout carries the database point | callout, then rows | kit + png `sqlite` |
| 31 | `c2-which-node` | The Project Already Answered | `ContentNoteSlide` + `CodeBlock` | `frontend\.nvmrc` says `v20.9.0`, so the tag is `node:20-alpine`. Success callout: **the project's own files decide the base image** — `pip freeze` chose the Python, `.nvmrc` chooses the Node | Same lesson twice in one session; the callout names it as a rule | file panel, then callout | kit + png `nodejs` |
| 32 | `c2-frontend-dockerfile` | The Frontend Dockerfile | `ContentSlide` + `CodeBlock` | The seven lines of `frontend\Dockerfile` | Whole artifact; it is last session's Node file with two upgrades | panel on entry | kit |
| 33 | `c2-lockfile` | Why the Lockfile Comes Too | `ContentNoteSlide` + `CodeBlock` | `package.json` says `"axios": "^1.19.0"` — a range, npm's unpinned requirement. `package-lock.json` records the **exact** version of every package, sub-dependencies included. The Node twin of pinning | The `^` is the whole argument; light that character | range highlights, lockfile line follows | kit + png `npm` |
| 34 | `c2-npm-ci-note` | A Note on npm ci | `ContentNoteSlide` | Automation servers use `npm ci`: installs exactly the lockfile, fails loudly if `package.json` disagrees. It returns when this course reaches CI/CD | Aside, typographic | fade | kit |
| 35 | `c2-vite-binding` | The Same Rule, Already Solved | `ContentNoteSlide` + `CodeBlock` | `frontend\vite.config.js` has carried `host: '0.0.0.0'` all course. Django needed it on the command line; Vite carries it in config. Same rule, two homes | Their own config file with the line lit: *now you know what that was for* | line highlights | kit + png `vitejs` |
| 36 | `c2-frontend-dockerignore` | Its .dockerignore | `ContentNoteSlide` + `CodeBlock` | The six lines. Warning callout: last session `node_modules/` was an empty folder excluded on principle; today it is hundreds of megabytes with binaries compiled **for your OS**, which would overwrite the Linux packages `npm install` just built | The warning from last session, now with teeth | panel, warning as its own step | kit |
| 37 | `c2-two-images` | Two Buildable Images | `ContentSlide` + `FileTree` | Both folders now hold the same pair. Closing line: what is missing is the file that runs them together | The completed tree is the section's closing state | entries stagger | kit |

### Concept 3: The Compose File, and the ports Key (38 to 54)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 38 | `c3-divider` | The Compose File | `SectionBreakerSlide` | index 3, subtitle *One file, one level up* | Divider | fade + mark | kit |
| 39 | `c3-skeleton` | The Same File, One Level Up | `CodeBuildSlide` | `docker-compose.yml` in `C:\nxttrendz`, above both folders because it describes both. Last session's file stripped to its frame | Build slide: this file grows for the next six slides | frame appears, `build:` paths light | kit |
| 40 | `c3-locked-door` | Last Session's Locked Door | `ContentSlide` | The quote: from outside Docker, a container is *not possible to reach until the service opens a port*. This is the key | Bare callback; the room should remember the sentence | quote fades in | kit |
| 41 | `c3-ports-anatomy` | ports: Host Side, Container Side | `ContentSlide` + **`PortPublish`** | `"8000:8000"` — left is the address the outside world uses, right is where the app listens inside | **The figure of this concept.** A door on the laptop wired to a door in the container, request travelling left to right | doors draw, then the request travels | **new** |
| 42 | `c3-both-publish` | Both Services Publish | `CodeBuildSlide` | `8000:8000` and `3000:3000` added. Deliberately identical on both sides, so **every address from the integration course keeps working** — including the `http://localhost:3000` already in `CORS_ALLOWED_ORIGINS` | The file grows; the CORS line is why the numbers match | lines insert, CORS note alongside | kit |
| 43 | `c3-ports-note` | Two Notes on ports | `ContentNoteSlide` | The numbers may differ: `"8001:8000"` publishes Django's 8000 as `localhost:8001`. And `ports` is **why** `0.0.0.0` mattered: publishing opens the host door, the server inside must still accept what arrives through it | Aside, but the second half is load-bearing and pays off slide 27 | two notes, stepped | kit |
| 44 | `c3-frontend-env` | Telling the Frontend Where | `CodeBuildSlide` | `src/api.js` has read `import.meta.env.VITE_API_BASE_URL` since the integration course, so Compose supplies it: `VITE_API_BASE_URL: http://localhost:8000` | The file grows again; the source line above it shows why the name is that name | source line, then the YAML | kit |
| 45 | `c3-the-paradox` | Read That Value Again | `ScenarioSlide` | An entire session was spent on why that address must be `http://backend:8000`. Here it is anyway, on purpose, and it is correct. **Hold that paradox** — it resolves in concept 4 | A named open question, deliberately unresolved. Rule 4: the problem is named, not opened | the value pulses, then the hold line | kit |
| 46 | `c3-the-secret` | The Secret in Plain Sight | `ContentNoteSlide` + `CodeBlock` | `backend\myproject\settings.py`, committed to Git: `SECRET_KEY = 'django-insecure-...'`. Warning callout: this travels with the project | Their own settings file. The discomfort is the point | line highlights, warning follows | kit + png `git` |
| 47 | `c3-env-step1` | Step 1 — Move It Out | `ContentSlide` + `CodeBlock` | Create `C:\nxttrendz\.env` and move the value there | One step per slide; three slides, three steps | panel on entry | kit |
| 48 | `c3-env-step2` | Step 2 — settings.py Reads It | `ContentSlide` + `CodeBlock` | `import os` and `SECRET_KEY = os.environ.get('SECRET_KEY')` — edits 1 and 2 of the promised three lines | The diff is two lines; show only those | lines type in | kit |
| 49 | `c3-env-step3` | Step 3 — env_file | `CodeBuildSlide` | The `env_file: - .env` key hands every variable in the file to the backend container | The file grows; second of the two new keys | key inserts | kit |
| 50 | `c3-two-injectors` | environment: vs env_file: | `ContentNoteSlide` + `DataTable` | `environment:` carries values safe to publish (addresses, modes) and lives in a file that travels. `env_file:` carries secrets and points at a file that travels **nowhere** | Two rows, because the split **is** the lesson | rows stagger | kit |
| 51 | `c3-gitignore-warning` | The .env Must Never Travel | `ContentNoteSlide` | Warning callout: add `.env` to `C:\nxttrendz\.gitignore`, creating the file if the root has none. The frontend's own `.gitignore` guards only `frontend\.env`. Committing it exposes the secret to anyone who can see the repo — one of the most common real-world leaks | Warning-led, no code; this is a habit, not a snippet | callout alone | kit |
| 52 | `c3-database-moves` | The Database Moves Into the Volume | `ContentSlide` + `CodeBlock` + `CodeBuildSlide` | Third settings line: `'NAME': BASE_DIR / 'data' / 'db.sqlite3'`. And the service mounts `db_data:/app/data` — last session's line, doing real work | The promise from last session, kept. Two small panels: the setting and the mount | setting, then mount | kit + png `sqlite` |
| 53 | `c3-why-not-app` | Why /app/data and Not /app | `ContentNoteSlide` + **`VolumeShadow`** | A volume mounted at a folder **takes that folder over**. Mounted at `/app`, it would capture the code on its first run and serve that stale copy forever — every rebuild silently shadowed, `--build` apparently doing nothing. Note: the container's database starts **empty** | **New figure.** The trap needs to be seen: the volume swallowing `/app`, the rebuilt image bouncing off | the mount lands, the code greys out | **new** |
| 54 | `c3-complete-file` | The Complete File | `ContentNoteSlide` + `CodeBlock` + `FileTree` | The whole `docker-compose.yml`, read as a sentence. Then: six files created, two edited, one `.gitignore` line, **not a single line of application code touched** | The finished artifact plus the tree of what changed, with `created`/`edited` states | file panel, then tree | kit |

### Concept 4: First Run, and Who Talks to Whom (55 to 72)

| # | id | Title | Component | Content | Visual, and why it fits | Motion | Assets |
|---|---|---|---|---|---|---|---|
| 55 | `c4-divider` | First Run | `SectionBreakerSlide` | index 4, subtitle *And the paradox, resolved* | Divider | fade + mark | kit |
| 56 | `c4-up-build` | docker compose up --build | `ContentSlide` + `Terminal` | From `C:\nxttrendz`: the build, network, volume and both containers created, then both servers' startup logs | One panel, the real transcript | transcript streams | TR |
| 57 | `c4-it-stays-up` | Then, Nothing | `ContentNoteSlide` | The prompt does not come back. **Every container in this course so far printed its lines and exited.** These are servers: they run until told to stop, exactly as `runserver` and `npm run dev` always held their terminals | The absence is the observation; a bare slide is the honest picture | the line, then the explanation | kit |
| 58 | `c4-detached` | Detached Stops Being Optional | `ContentSlide` + two `Terminal` panels | `docker compose up -d`, then `docker compose ps` showing `Up`, not `Exited (0)`, and the PORTS column with both published doors | The `ps` output is the proof; two panels because two commands | panels in sequence | TR |
| 59 | `c4-read-logs-first` | Read the Logs Before the Browser | `ContentNoteSlide` + `Terminal` | Django's startup already announced the next step: **39 unapplied migrations**. Warning callout: visit `/api/products/` now and you get `OperationalError — no such table` | The log panel with the warning lines lit | panel, warning as a step | TR |
| 60 | `c4-why-empty` | Of Course It Is Empty | `ContentSlide` | The volume is brand new, so the database has no tables — not even Django's own. Your laptop's `db.sqlite3` stayed on your laptop, and slide 30 made sure of it | Callback, typographic | fade | kit |
| 61 | `c4-cant-run-here` | You Cannot Run It Here | `ContentNoteSlide` + `Terminal` | `python manage.py migrate` in your own terminal fails: no venv active, and no database here anyway. Django now lives **inside the container**, so the command must run there too | The failing attempt, then the realisation | attempt, then the line | kit |
| 62 | `c4-exec-anatomy` | exec — Inside a Running Container | `ContentSlide` + **`ExecAnatomy`** | `docker compose exec backend python manage.py migrate`, split three ways: run inside a **running** container · in this service · the exact command you have always used | **New figure.** The TR draws this as a labelled anatomy and it earns the space: `exec` is the session's new command | the three parts label in turn | **new** |
| 63 | `c4-migrate` | 39 Migrations, Applied | `ContentSlide` + `Terminal` | The familiar migration output — but every table landed in `/app/data/db.sqlite3`, inside the volume | The output they know, in a place they do not | transcript streams | TR |
| 64 | `c4-superuser` | And the Admin Account | `ContentSlide` + `Terminal` | `docker compose exec backend python manage.py createsuperuser` | Same shape, one command: `exec` is already a pattern | panel on entry | TR |
| 65 | `c4-verify` | The Whole App, Through Both Containers | `ProceduralStepsSlide` | 1. `localhost:8000/admin/` — log in, add a product · 2. `localhost:3000` — register, log in · 3. the products page loads, straight from Django | Three numbered steps the room performs; this is the payoff moment | steps in sequence | kit |
| 66 | `c4-what-just-worked` | What Just Worked | `ContentNoteSlide` | React served from one container, JWT login against the other, tokens in cookies, products over CORS — without one line of app code changing. `CORS_ALLOWED_ORIGINS` still says `http://localhost:3000`, and still matches | Typographic; a list of things that did **not** break | stagger | kit |
| 67 | `c4-paradox-resolved` | The Frontend Container Only Delivers | `ContentNoteSlide` | The one sentence: **the frontend container only *delivers* the React code. The code *runs* in your browser — and your browser is not inside Docker** | The resolution gets a slide to itself. Nothing else on it | the sentence alone | kit |
| 68 | `c4-who-talks` | Who Talks to Whom | `ContentSlide` + **`BrowserOutsideDocker`** | The machine boundary: browser outside Docker, both arrows going to published ports; nothing crossing the Compose network today | **The figure of the session.** Session 3's `ComposeNetwork` shows the inside view; this is the outside one, and the contrast is the whole idea | boundary draws, then each arrow with its label | **new** |
| 69 | `c4-the-table` | The Rule Was Never Broken | `ContentNoteSlide` + `DataTable` | Container → container: inside Docker, use the **service name**. Browser → container: outside Docker, use `localhost` + a **published port**. The question is never "which file is the address in?" but **"where does the code that uses it actually run?"** | Last session's table with its second row finally filled in | rows stagger, question as callout | kit |
| 70 | `c4-proof` | Proof, and the New Daily Habit | `ContentSlide` + `Terminal` + `DataTable` | `down` then `up -d`, refresh, everything still there — containers died, the volume did not. Then old habit → new habit, five rows | The proof cycle plus the workflow they leave with | terminal, then rows | TR |
| 71 | `c4-errors` | Five Errors, and How to Read Them | `ContentSlide` + `DataTable` | Port already in use → an old `runserver` still holding it · `no such table` → migrations not run · logs fine but connection reset → missing `0.0.0.0` · `ERR_NAME_NOT_RESOLVED` on `http://backend:8000` → slide 69's table met in the wild · edited code, nothing changed → `--build` | Symptom → cause → fix, five rows. **Every one is an idea from today, failing** | rows stagger | kit |
| 72 | `c4-toolbox` | The Debugging Toolbox | `ContentSlide` + `DataTable` | `ps` · `logs backend` · `logs frontend` · `exec backend env` (did `SECRET_KEY` arrive?) · `exec backend bash` · `exec frontend sh` (alpine ships `sh`, not `bash`) | Command → what it answers. The reference they screenshot | rows stagger | kit |

### Closing frame (73 to 76)

| # | id | Title | Component | Content | Motion | Assets |
|---|---|---|---|---|---|---|
| 73 | `recap` | What We Covered | `RecapSlide` | The four concepts restated as outcomes | stagger | kit |
| 74 | `takeaways` | Key Takeaways | `KeyTakeawaysSlide` | Inside a container, a server binds to `0.0.0.0` · `ports` opens the door from outside; service names work only inside · secrets go in `.env`, never in a file that travels · the question is always *where does this code run?* | stagger, light chrome | kit |
| 75 | `next-session` | Next Session | `SectionBreakerSlide` title-only | `Automate Deployment using Makefile` | fade | kit |
| 76 | `thankyou` | (fixture) | `ThankYouSlide` | Fixture | fade | kit |

**Total: 76.** The count in the header says 72 for the content slides; the four
closing frames take it to 76. `deck.config.json` gets **76**.

## 5. What has to be built

### 5.1 New figures in `src/ui`

| Component | Slides | What it draws | Animation |
|---|---|---|---|
| `PortPublish` | 41 | A door on the laptop wired to a door inside the container, `8000:8000` labelling each side, a request travelling host → container | doors draw, then the request travels once |
| `VolumeShadow` | 53 | The `/app` trap: a volume mounted over the code folder, the code greying out, a rebuilt image bouncing off | mount lands, code greys, rebuild deflects |
| `ExecAnatomy` | 62 | The command split three ways with a label under each part, per the TR's own diagram | parts label in turn |
| `BrowserOutsideDocker` | 68 | The machine boundary with the browser **outside** the Docker box, two arrows to two containers through published ports | boundary draws, arrows in sequence with labels |

All four read their colours from `src/design/tokens.ts`, are wrapped in
`RevealGroup`/`Reveal` (never `Step`), and honour `useInstant()`.

Per rule 14, if you approve any of these as generally useful they go into the
kit, `sampleDeck.tsx` and `slide-kit/slide-types/README.md`. My read:
`BrowserOutsideDocker` and `PortPublish` are general — every containerised web
app has this shape. `VolumeShadow` and `ExecAnatomy` are closer to one-offs.

### 5.2 New slide type

**None proposed.** Everything here fits an existing type, and `CodeBuildSlide`
(added in session 3) is exactly right for the Compose file growing across slides
39, 42, 44, 49 and 52.

### 5.3 Kit changes

**None proposed.** `CodeBlock` already has the YAML mode from session 3, and
Dockerfile and Python highlighting from session 2.

### 5.4 Assets

Per rule 12, every technology named needs its mark. Already in
`slide-kit/assets/tech/`: `python`, `django`, `react`, `nodejs`, `npm`,
`vitejs`, `docker`, `docker-white`, `vscode`, `container-white`.

**To fetch into the library first** (rule 13), then copy into the session:

| Asset | Needed on | Note |
|---|---|---|
| `sqlite.png` | 30, 52 | The database is a named technology on both slides |
| `git.png` | 46 | The secret is "committed to Git in plain sight" |

No screenshots (`public/shots/`) are planned. Slide 65's verification is written
as steps the room performs, not as captures. **If you want captures there, say
so at sign-off** — they have to be taken from a real run, and per rule 11 they
must be cropped to the point, which is work worth planning rather than
retrofitting.

## 6. Where this compresses, if you want it shorter

76 is close to session 3's 69, and this TR is slightly longer. If you want it
tighter, in the order I would cut:

1. **28 and 34** (the `gunicorn` and `npm ci` asides) fold into notes on 27 and
   33. Saves 2.
2. **47, 48, 49** (the three `.env` steps) become one slide with three stepped
   panels. Saves 2, at the cost of the one-step-per-slide rhythm.
3. **60** folds into 59 as a second beat. Saves 1.
4. **17 and 18** merge: the unpinned file with the question beneath it. Saves 1,
   but loses the pause beat, which I would keep.

Cuts 1 to 3 land it at **71**.

## 7. Sign-off

**Nothing is generated until you approve this.** What I need from you:

- [ ] The **four concepts** and their merge of the TR's six sections
- [ ] The **76 slides**, or a compression from §6
- [ ] The **four new figures** in §5.1, and which of them are kit-general
- [ ] Fetching **`sqlite.png`** and **`git.png`** into the central library
- [ ] Whether slide 65 stays as steps or wants **real screenshots**
- [ ] `deployement_session_4/` on **devPort 5215**

On approval I scaffold the project from `slide-kit/slide-template`, generate the
deck, and run the full verification sweep before showing you anything.

---

## 8. What generation changed

Recorded because the plan is the contract, and generation always finds things
the plan could not.

### 8.1 The count went 76 → 78

Two slides were added while writing, both because a slide was carrying two ideas
(content rule 5):

| Added | Why |
|---|---|
| `c3-whats-changed` | Slide 54 was going to show the complete Compose file **and** the inventory of everything created today. Two exhibits, two ideas. The inventory is now its own slide, and it is the natural place to pause if anyone is behind |
| `c4-new-workflow` | The proof cycle and the old-habit/new-habit table were one slide in the plan. The proof is a live demo beat, the table is a reference the room screenshots. They do not belong on one frame |

`deck.config.json` carries **78**, counted from the deck array rather than typed.

### 8.2 Layout, found by `video-safe.mjs`

The first sweep failed: **10 of 78 slides** placed content in the instructor
video rectangle (`x 913..1280, y 0..220`).

Every one of them was a **lead-less slide carrying a full-width child**. A
lead-less header stops short, the body well starts higher, and a tall centred
child reaches up into the rectangle. This is exactly the class of failure
session 3's §8.1 recorded, and the fix is the same: a `lead`.

Confirmed rather than assumed. Session 3 was re-run under the same harness and
printed CLEAN with six `CodeBuildSlide` slides, and all five of its
`CodeBuildSlide` usages carry a lead while both of mine did not. That ruled out
a kit regression and pointed at the deck.

Eleven slides gained a lead: 7, 10, 14, 30, 36, 42, 49, 54, 57, 64, 71. Each one
is better copy for it, so nothing was distorted to satisfy the harness.

One slide needed more. `c4-who-talks` carries `BrowserOutsideDocker`, which at
full width is 1152x534 and too tall to centre clear of the rectangle even with a
lead. It is capped at `max-w-[800px]`, which drops its top edge below y=220.

### 8.3 A kit bug this surfaced, not fixed

`vite.config.ts` hardcodes `server.port: 5173`. Every harness reads `devPort`
from `deck.config.json`. **They have never agreed in any session**, which is why
the kit and all three earlier sessions carry `devPort: 5211` while Vite serves
5173.

Nothing was broken by it before because the harnesses were passed an explicit
URL. It is left unfixed here deliberately: `vite.config.ts` is kit-owned, and a
kit change is the user's call under content rule 14. The workaround is in this
session's `CLAUDE.md` and in `workflow/skills/session-4-deck/SKILL.md`:

```bash
npx vite --port 5215 --strictPort
```

### 8.4 Assets

`sqlite.png` and `git.png` were fetched into `slide-kit/assets/tech/` at 512px
and copied into the session, per rules 12 and 13. The library is now 25 files.

### 8.5 Still outstanding

- `qa.mjs` and `preview.mjs` have not been run yet at the time of writing.
- The four figures are session-owned pending the promotion decision in §5.1.
- No screenshots. Slide 65 remains the steps the room performs, per sign-off.
