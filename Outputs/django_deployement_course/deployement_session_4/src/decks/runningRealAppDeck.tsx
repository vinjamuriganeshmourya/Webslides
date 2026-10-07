import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  CodeBuildSlide,
  CommandSyntaxSlide,
  ContentNoteSlide,
  ContentSlide,
  KeyTakeawaysSlide,
  ProceduralStepsSlide,
  QuestionSlide,
  StatusPointsSlide,
  RecapSlide,
  ScenarioSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import {
  CodeBlock,
  DataTable,
  FileTree,
  SyntaxBreakdown,
  Terminal,
} from '@/ui'
/*
  THE SESSION'S OWN FIGURES, IMPORTED BY PATH, NOT OFF THE BARREL.

  `src/ui/index.ts` is KIT-OWNED: `sync-kit.mjs --apply` overwrites it wholesale.
  These four exports were added to the session's copy of the barrel, so the first
  sync deleted all four export lines and the deck stopped compiling, with the
  figure files still sitting untouched beside it. Importing them by path is the
  fix the kit already uses for its own figure FAMILIES (`@/ui/points/...`,
  `@/ui/flowchart/...`): a path import names a file that no sync touches, so it
  survives every future kit update instead of breaking on it.
*/
import { BrowserOutsideDocker } from '@/ui/BrowserOutsideDocker'
import { PortPublish } from '@/ui/PortPublish'
import { VolumeShadow } from '@/ui/VolumeShadow'
import { colors } from '@/design/tokens'

/**
 * Deployment · Session 4 "Running the Real App with Docker"
 *
 * Generated from the signed-off plan at
 * `django_deployement_course/session_plans/deployement_session_4/plan.md`.
 * The plan is the contract: slide ids here match the `id` column there, so a
 * reviewer can read the two side by side.
 *
 * BUILD RULES for this deck. Each exists because of something in the TR that
 * would otherwise be rendered wrong.
 *
 *   R1  THE PARADOX IS SET UP, HELD, AND ONLY THEN RESOLVED. `c3-frontend-env`
 *       writes `VITE_API_BASE_URL: http://localhost:8000` and `c3-the-paradox`
 *       names it as a contradiction of last session's iron rule WITHOUT resolving
 *       it. The answer is `c4-paradox-resolved` through `c4-the-table`. This is
 *       rule 4 of the content rules: name a later problem, never open it.
 *       Resolving it early costs the session its ending, which is the single best
 *       beat in this TR.
 *
 *       REFERENCES IN THIS FILE ARE SLIDE IDS, NOT SLIDE NUMBERS. They used to be
 *       numbers, and the 2026-09-03 review moved eleven slides: every one of those
 *       references then pointed at the wrong frame, silently, in the notes an
 *       instructor reads live. An `id` is stable under insertion and it is
 *       greppable, so a renamed slide fails to be found rather than quietly
 *       meaning something else. Content rule 9, chase the dependents.
 *
 *   R2  TWO FOLDERS MEANS TWO TERMINAL PANELS. Slide 9's whole argument is that
 *       the old ritual happened in two places. One panel with two prompts in it
 *       would erase the argument. Carried from Session 3's S4.
 *
 *   R3  EVERY TRANSCRIPT IS QUOTED FROM THE TR, NOT CAPTURED. Docker Desktop
 *       cannot run on the capture machine, the same blocker that left Sessions 1
 *       to 3 quoted. Versions, timings and container names are the TR's.
 *       Swapping real captures in later needs no layout change: `Terminal` takes
 *       the same lines either way.
 *
 *   R4  THE COMPOSE FILE GROWS ONE KEY PER SLIDE, THEN IS SHOWN WHOLE. `COMPOSE`
 *       below is the single source for `c3-skeleton`, `c3-both-publish`,
 *       `c3-frontend-env`, `c3-env-step3`, `c3-database-moves` and
 *       `c3-complete-file`, which
 *       is why it is one array of blocks rather than six string literals. A
 *       hand-maintained copy per slide drifts, and the room reads the drift as
 *       a mistake in the file.
 *
 *   R5  `0.0.0.0` IS A DOOR POLICY, NEVER AN ADDRESS TO VISIT. Slide 27's table
 *       is the whole point: `localhost:8000` is what you type, `0.0.0.0` is what
 *       the server binds to. Any slide that lets those blur has to be rewritten.
 *
 *   R6  PINNING IS SHOWN AS A BEFORE AND AFTER OF THE SAME FILE. Slides 17 and
 *       20 are the identical `requirements.txt` with and without versions, so
 *       the change is visible rather than described.
 *
 *   R7  NOTHING IN THIS SESSION IS CONTAINER-TO-CONTAINER. Django never calls
 *       the frontend. `BrowserOutsideDocker` therefore draws no arrow across the
 *       Compose network, and the notes say why. Drawing one would contradict
 *       `c4-the-table` on the slide that is supposed to prove it.
 *
 *   R8  THE ASIDES LOOK LIKE ASIDES. Slides 28 and 34 (gunicorn, `npm ci`) point
 *       at things later in the course. They are typographic and short, and they
 *       name no session number.
 */

export const runningRealAppMeta: DeckMeta = {
  title: 'Running the Real App with Docker',
  course: 'React + Django Integration · Deployment',
  lesson: 'Running the Real App with Docker',
  presenter: 'NxtWave Instructor',
}

/** Footer text on every slide: the session name, never "Session 4". */
const SESSION = 'Running the Real App with Docker'

/**
 * WHERE EVERY COMMAND IN THIS SESSION RUNS.
 *
 * Sessions 2 and 3 ran everything from `docker-demo`. Today the project root is
 * `C:\nxttrendz`, and the prompt path is teaching content on three different
 * slides: the two old rituals happened INSIDE `backend\` and `frontend\`, and
 * every Compose command happens ABOVE both of them. Rule 3 of the content rules
 * requires the path on every terminal panel; here it also carries the argument.
 */
/**
 * THE SESSION'S FOUR PARTS, WRITTEN ONCE.
 *
 * The agenda states them at the top and the dividers repeat them as the session
 * reaches each one, so they have to be the SAME WORDS: a divider that paraphrases
 * its agenda item quietly renames the section halfway through.
 *
 * NO SUB-LINES. The agenda used to carry a second line under every item, which
 * asked the room to read eight things before the session had taught one. An
 * agenda is a list of where the session goes, not a summary of it, and every one
 * of those sub-lines used vocabulary the room does not have yet: "the ports key",
 * "the paradox resolved", "binds to 0.0.0.0". Four plain titles, in simple words.
 */
/*
  PLAIN WORDS, NOT FIGURATIVE ONES.

  The first cut read "The Real Project Moves In", "A Dockerfile for Each Part",
  "The Compose File" and "Running It, and Who Talks to Whom", and the review took
  the agenda apart item by item: *"Moves In? Each Part? Specify what? Compose file
  project. Running the application through Docker compose."*

  Every one of those is a phrase that means something to somebody who has already
  taught the session. "Moves in" is a metaphor, "each part" names nothing, and
  "the compose file" is a noun with no verb: the room cannot tell whether it is
  going to read one, write one, or run one. An agenda item has to survive being
  read cold by somebody who does not yet know the material, so each of these now
  says what the room will DO and to what.

  NO ARTICLES AND NO HELPING WORDS. The first rewrite read "Getting the Real
  Project Ready", "A Dockerfile for the Backend and the Frontend", "Writing the
  Compose File for the Project" and "Running the Application Through Docker
  Compose", and the user cut the scaffolding out of all four: *"remove a the
  helping words from the agenda"*.

  Every `a`, `the` and `getting` in there was carrying no meaning. An agenda item
  is read at a glance from the back of a room, and an article is a word the eye
  has to step over before it reaches the noun it came for. What is left is the
  content words in the order they matter, which is how the corpus writes an
  agenda: `Node Container Image`, not `A Container Image for Node`. Only the
  connectors that change the meaning survive -- the `and` joining two Dockerfiles,
  the `with` naming the tool.
*/
const AGENDA = [
  'Real Project Setup',
  'Dockerfile for Backend and Frontend',
  'Writing Compose File',
  'Running Application with Docker Compose',
]

const AT_ROOT = 'C:\\nxttrendz'
const AT_BACKEND = 'C:\\nxttrendz\\backend'
const ENV_AT_BACKEND = '(env) C:\\nxttrendz\\backend'
const AT_FRONTEND = 'C:\\nxttrendz\\frontend'

function Code({ children }: { children: ReactNode }) {
  return (
    <span
      className="whitespace-nowrap rounded-md px-1.5 py-0.5 font-mono"
      style={{ fontSize: '0.9em', background: 'rgba(11,95,255,0.10)', color: colors.brandDark }}
    >
      {children}
    </span>
  )
}

/**
 * A technology, always as a PNG (content rule 12), at the size a row wants.
 *
 * THE PATHS ARE A STATIC MAP, AND THEY HAVE TO BE.
 *
 * The obvious version of this helper is `src={`/assets/tech/${name}.png`}`, and
 * it works perfectly in `npm run dev` and in `npm run build`. It breaks in the
 * one build that ships: `scripts/inline-assets.mjs` finds asset references by
 * scanning the built HTML for literal `/assets/...` paths, and a template
 * literal is not one. The bundle keeps `assets/tech/${i}.png` verbatim, nothing
 * is inlined, and under `file://` every one of these icons is a broken image in
 * the deck an instructor actually opens.
 *
 * A literal per entry is what the inliner can see. Adding a technology here
 * means adding a line, which is the point: it fails at compile time rather than
 * silently in the deliverable.
 */
const TECH_SRC = {
  git: '/assets/tech/git.png',
  python: '/assets/tech/python.png',
  /* `sqlite` was dropped when the .dockerignore table lost its third row. Every
     entry here is inlined into the deliverable whether a slide renders it or not
     (S8), so an unused logo is dead weight in the file the instructor opens. */
} as const

function Tech({ name, label }: { name: keyof typeof TECH_SRC; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img src={TECH_SRC[name]} alt="" draggable={false} className="h-5 w-5 object-contain" />
      {label ? <span>{label}</span> : null}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   THE COMPOSE FILE, AS ONE SOURCE.

   Each block is a stage of the file. A slide renders `composeUpTo(n)` and lights
   the lines that stage added. See R4.
   ──────────────────────────────────────────────────────────────────────────── */

const COMPOSE_STAGES = [
  /* 0 — the skeleton, last session's file stripped to its frame */
  `services:
  backend:
    build: ./backend
  frontend:
    build: ./frontend
    depends_on:
      - backend
volumes:
  db_data:`,

  /* 1 — ports on both services */
  `services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
volumes:
  db_data:`,

  /* 2 — the frontend is told where the backend is */
  `services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_BASE_URL: http://localhost:8000
    depends_on:
      - backend
volumes:
  db_data:`,

  /* 3 — env_file carries the secret */
  `services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - .env
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_BASE_URL: http://localhost:8000
    depends_on:
      - backend
volumes:
  db_data:`,

  /* 4 — the volume finally holds a real database */
  `services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - db_data:/app/data
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      VITE_API_BASE_URL: http://localhost:8000
    depends_on:
      - backend
volumes:
  db_data:`,
]

/**
 * The 1-based line numbers in a stage whose text contains any of `needles`.
 *
 * `CodeBuildSlide.highlight` takes line NUMBERS, and hardcoding them is a bug
 * waiting to happen: removing one blank line from a stage silently moves every
 * highlight below it onto the wrong row, and nothing fails. That happened here
 * when the file was compacted to fit the panel.
 *
 * Deriving them from the content means the lit lines follow their own text.
 */
function hl(stage: string, ...needles: string[]): number[] {
  return stage
    .split('\n')
    .map((line, i) => (needles.some((n) => line.includes(n)) ? i + 1 : 0))
    .filter(Boolean)
}

const BACKEND_DOCKERFILE_INITIAL = `FROM python:3.14-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]`

const BACKEND_DOCKERFILE = `FROM python:3.14-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]`

/*
  THE BACKEND .dockerignore, IN ITS TWO STAGES.

  Written once and joined, for the same reason `COMPOSE_STAGES` is one array
  (R4): the "last session's file" slide and the "three new entries" slide are the
  same file twice, and a hand-maintained copy of each drifts. The room reads the
  drift as a mistake in the file.
*/
const DOCKERIGNORE_OLD = ['env/', '__pycache__/', '*.pyc', '.git/' ]
const DOCKERIGNORE_NEW = ['db.sqlite3', 'data/', '.env']
const BACKEND_DOCKERIGNORE = [...DOCKERIGNORE_OLD, ...DOCKERIGNORE_NEW].join('\n')

const FRONTEND_DOCKERFILE = `FROM node:22-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]`

export const runningRealAppDeck: SlideDef[] = [
  /* ── FRONT FRAME (1 to 7) ──────────────────────────────────────────────── */
  {
    id: 'brand',
    section: 'Opening',
    label: 'Brand',
    element: <BrandSlide greeting="Welcome" lesson={SESSION} />,
    notes: 'On screen while the room settles. Nothing but the mark.',
  },
  {
    id: 'welcome',
    section: 'Opening',
    label: 'Session name',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
    notes:
      'Say the name out loud. "The real app" is the promise of the session, and the room has been running this project by hand since the integration course.',
  },
  {
    id: 'recap-compose',
    section: 'Opening',
    label: 'Recap: the file',
    element: (
      <ContentSlide
        kicker="Recap"
        title="Where we Left Off"
        lead="One file described the whole two-container application"
        lesson={SESSION}
      >
        <CodeBlock
          code={`services:
  backend:
    build: ./backend
    environment:
      APP_ENV: development
    volumes:
      - db_data:/app/data
  frontend:
    build: ./frontend
    environment:
      API_URL: http://backend:8000
    depends_on:
      - backend
volumes:
  db_data:`}
          filename="docker-compose.yml"
          language="yaml"
          /* 15px, not the 17px default. At 17 this sixteen-line file is ~447px:
             it tops out at y=191 inside the instructor-video rectangle AND
             overflows the frame by 43px. `maxHeight` does not fix that, it only
             adds an inner scroll, and qa.mjs measures the un-clipped rect. */
          fontSize={15}
        />
      </ContentSlide>
    ),
    notes:
      'Their own file from last session. Open on what they wrote, not on a summary of it. Do not read it out; give the room ten seconds to recognise it.',
  },
  {
    id: 'recap-what-it-bought',
    section: 'Opening',
    label: 'Recap: what it bought',
    element: (
      /*
        LAST SESSION'S AGENDA, NOT A SUMMARY OF ITS CONTENT.

        This carried four consequences of session 3 -- volumes surviving `down`,
        `up --build` after an edit, service names as hostnames -- which is a recap
        of the material rather than of the session. The review asked for the other
        thing: *"Remove all these points and place only Agenda points from previous
        session."*

        It is the better slide, and for a reason worth keeping: the room saw those
        four agenda items at the start of last session and again in its recap, so
        they are the handles the session is already filed under. A fresh set of
        four sentences asks the room to re-derive where it has been before today
        has started.

        The words are session 3's `AGENDA` verbatim (`dockerComposeDeck.tsx`), and
        they must stay verbatim: a paraphrase quietly renames last session.
      */
      <RecapSlide
        kicker="Recap"
        title="Where we Left Off"
        lesson={SESSION}
        points={[
          { text: 'Node Container Image', sub: 'Same six instructions, a different runtime' },
          { text: 'Running Both Python and Node Containers', sub: 'Six commands by hand, and five details to remember' },
          { text: 'One File for the Whole App', sub: 'Writing docker-compose.yml, one key at a time' },
          { text: 'Running the Stack: Integrating the Containers', sub: 'One command, and how they find each other by name' },
        ]}
      />
    ),
    notes:
      'Last session\u2019s four agenda items, in its own words. Read them as a checklist: "we did this, this, this and this." The fourth one is the one today contradicts on purpose, so say the words "they find each other by name" firmly: the paradox later in the deck only bites if the room is sure of that rule.',
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        kicker="Agenda"
        title="Today's Agenda"
        lesson={SESSION}
        items={AGENDA.map((title) => ({ title }))}
      />
    ),
    notes:
      'These four wordings are the section dividers and the recap, verbatim. The TR lists six sections; two pairs merge, because a Dockerfile for each half is one idea told twice and the errors belong with the run that produces them.',
  },
  {
    id: 'setup',
    section: 'Opening',
    label: 'Setup',
    element: (
      /*
        ONE INSTRUCTION AND THE TREE. NOTHING ELSE.

        This slide carried three bullets and a `docker --version` transcript, and
        the review cut all of it: *"Remove all this and just keep Open Out
        Nxttrendz Workspace that we had worked on and show the folder tree, this is
        enough."*

        Right, and the reason is that an Initial Setup slide has one job: get every
        machine in the room to the same starting state. That state is "the
        nxttrendz workspace is open". "Start Docker Desktop" and "docker-demo stays
        where it is" are things the room has done at the start of the last two
        sessions, and re-teaching them here spends the room's attention before the
        session has taught anything.

        The tree replaces the version transcript because it says something the
        transcript cannot: this is the project you already built, and here is what
        is in it. It is also the same figure `c1-workspace` returns to, so the room meets
        the shape once and recognises it later.
      */
      <ContentSlide
        kicker="Before we start"
        title="Initial Setup"
        lead="Open the nxttrendz workspace you have been building all course"
        lesson={SESSION}
      >
        <FileTree
          root="C:\nxttrendz"
          entries={[
            { name: 'backend', folder: true, state: 'existing', note: 'the Django project' },
            { name: 'frontend', folder: true, state: 'existing', note: 'the React project' },
            { name: 'docker-demo', folder: true, state: 'existing', note: 'last session\u2019s practice folder' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Wait until every screen in the room shows these three folders. Nothing today touches docker-demo; it is on the tree so nobody wonders whether it should be gone.',
  },

  /* ── CONCEPT 1: THE REAL PROJECT MOVES IN (8 to 15) ────────────────────── */
  {
    id: 'c1-divider',
    section: AGENDA[0],
    label: 'Divider',
    element: (
      /* The title comes from AGENDA rather than being typed again. The four
         wordings have to match the agenda exactly, and the only reliable way to
         keep two copies identical is to have one copy. */
      <SectionBreakerSlide
        index={1}
        title={AGENDA[0]}
        subtitle="No application code changes today"
        lesson={SESSION}
      />
    ),
    notes: 'Hand over verbally: "so what actually changes when the real project moves in?"',
  },
  {
    id: 'c1-before',
    section: AGENDA[0],
    label: 'The old routine',
    element: (
      <ContentSlide
        kicker="Before and after"
        title="How Every Day Has Started"
        lead="Two terminals, each with its own steps, since the integration course"
        lesson={SESSION}
      >
        <div className="grid grid-cols-2 gap-4">
          <Terminal
            path={AT_BACKEND}
            lines={[
              { text: 'env\\Scripts\\activate', kind: 'cmd' },
              { text: 'python manage.py runserver', kind: 'cmd' },
              { text: 'Starting development server at http://127.0.0.1:8000/', kind: 'out' },
            ]}
            caption="Terminal 1"
          />
          <Terminal
            path={AT_FRONTEND}
            lines={[
              { text: 'npm run dev', kind: 'cmd' },
              { text: 'VITE v6.2.0  ready in 155 ms', kind: 'out' },
              { text: 'Local:   http://localhost:3000/', kind: 'out' },
            ]}
            caption="Terminal 2"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Two panels, not one, because the argument is that this happens in two places (R2). Ask the room how many times they have forgotten the activate line.',
  },
  {
    id: 'c1-after',
    section: AGENDA[0],
    label: 'The new routine',
    element: (
      <ContentNoteSlide
        kicker="Before and after"
        title="How It Starts From Today"
        /* "run from the project root, and the whole stack comes up" was three
           clauses and two pieces of jargon: the review asked for it in simple
           English. The folder and both apps are the whole content, so the line
           says those and stops. */
        lead="From today, one command in the nxttrendz folder starts both apps together"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'Two addresses do not change',
          body: (
            <>
              <Code>localhost:8000</Code> and <Code>localhost:3000</Code>, exactly as always. The{' '}
              <Code>-d</Code> runs both containers in the background and gives your prompt straight back.
              No venv to activate, and the whole environment comes with the code
            </>
          ),
        }}
      >
        <Terminal
          path={AT_ROOT}
          lines={[
            { text: 'docker compose up -d', kind: 'cmd' },
            { text: '[+] Running 4/4', kind: 'out' },
            { text: 'Container nxttrendz-backend-1    Started', kind: 'ok' },
            { text: 'Container nxttrendz-frontend-1   Started', kind: 'ok' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'One panel against the previous slide\u2019s two. The contrast is the argument, so let the room see both slides in quick succession rather than dwelling here.',
  },
  {
    id: 'c1-workspace',
    section: AGENDA[0],
    label: 'The workspace',
    element: (
      /*
        ONE FOLDER OPEN AT A TIME, AND THE CHILDREN DRAWN INSIDE IT.

        This was nine flat rows in one stack, with a child separated from its
        parent by 22px of indentation and nothing else, and the review read it as
        one list rather than as three folders:

          *"in file Tree make a new design to replicate to show the file inside
           the folder when those are expanded. initial state should have backend
           frontend and docker-demo, only we can expand one at a time."*

        `FileTree` now takes `open`, which names the ONE folder whose contents
        show. Its children are drawn inside a recessed well that belongs to it,
        so containment is a picture rather than an inference from whitespace, and
        the other two folders collapse to a single row each with a shut chevron.

        `backend` is the folder that opens, because `requirements.txt` is the one
        existing file today changes and this slide exists to point at it. The
        frontend's contents are not needed until the frontend Dockerfile, and
        `docker-demo` is on the tree only so nobody wonders whether it should be
        gone.
      */
      <ContentSlide
        kicker="The starting point"
        title="Project Before Any Changes"
        lead="Nothing has been added yet, this is the project as you last used it"
        lesson={SESSION}
      >
        <FileTree
          root="C:\nxttrendz"
          open="backend"
          entries={[
            { name: 'backend', folder: true, state: 'existing' },
            { name: 'manage.py', depth: 1, state: 'existing' },
            { name: 'requirements.txt', depth: 1, state: 'existing', note: 'about to change' },
            { name: 'myproject', depth: 1, folder: true, state: 'existing', note: 'settings.py lives here' },
            /* The app folders and the venv share a row. Two rows here put the
               tree's last line 5px under the control bar once the children moved
               into their well, and `align-check.mjs` caught it. Combining them
               costs nothing: neither is a file this session touches, and the row
               they share still names all four. */
            { name: 'products  users  cart  env', depth: 1, folder: true, state: 'existing', note: 'the apps, and the venv' },
            { name: 'frontend', folder: true, state: 'existing' },
            /* THREE ROWS, NOT THREE NAMES ON ONE ROW. A shut folder now prints a
               count of what is inside it, and with the three filenames crammed
               into a single entry the frontend advertised "1 inside", which is
               false. The count is only honest if a row is a file. There is no
               height cost either: the well reserves the tallest folder's rows,
               and backend has four. */
            { name: 'package.json', depth: 1, state: 'existing' },
            { name: 'package-lock.json', depth: 1, state: 'existing', note: 'about to matter' },
            { name: 'vite.config.js', depth: 1, state: 'existing', note: 'already has the host line' },
            { name: 'docker-demo', folder: true, state: 'existing', note: 'the practice folder, untouched' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Point at requirements.txt and say it is the only existing file that changes today, apart from three lines in settings.py. The two shut folders are shut on purpose: frontend opens when its Dockerfile comes up, and nothing today touches docker-demo.',
  },
  {
    id: 'c1-already-own',
    section: AGENDA[0],
    label: 'What you already own',
    element: (
      <ContentSlide
        kicker="Set expectations"
        title="What You Already Own"
        lead="Everything you have already learnt still works on the real project"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'You already own' }, { label: 'Today it is applied to' }]}
          rows={[
            ['Five Dockerfile instructions', 'Django, and then React, unchanged in shape'],
            [
              <>
                <Code>services</Code> <Code>build</Code> <Code>environment</Code> <Code>depends_on</Code>{' '}
                <Code>volumes</Code>
              </>,
              'Same keys, now pointing at the real apps',
            ],
            [
              <>
                <Code>up</Code> <Code>down</Code> <Code>--build</Code> <Code>logs</Code> <Code>ps</Code>
              </>,
              <>
                Same commands, run from <Code>C:\nxttrendz</Code>
              </>,
            ],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Identical row labels down both columns is the corpus comparison shape. Read the left column aloud and let the room finish the right.',
  },
  {
    id: 'c1-two-new-keys',
    section: AGENDA[0],
    label: 'Two new keys',
    element: (
      /*
        THE TWO NEW KEYS ARE NOT ANNOUNCED HERE ANY MORE.

        This slide used to open with `ports:` and `env_file:` on a code panel,
        forty slides before either one solves anything. The review rejected it:
        *"Lets not introduce these 2 in here, lets tell implement the dockerfile
        with the known commands and give problem, we then provide these as
        solution."*

        That is the four-beat rule (PEDAGOGY_GUIDELINES section 2). A key shown
        before the room has felt the problem it fixes is a fact to memorise; the
        same key shown after a failed run is an answer. `ports:` now arrives on
        the slide where the browser cannot reach the container, and `env_file:`
        on the slide where the secret is sitting in Git.

        What is left is beat 1: the room already has everything it needs to start.
        The shortfall is NAMED and not opened, which is content rule 4 -- "two
        places where five instructions are not enough" tells the room to expect
        something without spending it here.
      */
      <ContentSlide
        kicker="What today asks of you"
        title="You Already Know Enough to Start"
        lead="Both Dockerfiles today are written with the five instructions you have used since last session"
        lesson={SESSION}
        points={[
          { text: 'FROM, WORKDIR, COPY, RUN and CMD, in the order you already write them', sub: 'Same five, pointed at Django instead of a demo script' },
        ]}
      />
    ),
    notes:
      'Say the five out loud and let the room finish the list. Then be honest that the five are not the whole story today, without saying what is missing: the room meets the first gap when Django\u2019s logs come back empty, and the second when the secret key turns up in Git. Both are far better felt than announced.',
  },
  {
    id: 'c1-the-claim',
    section: AGENDA[0],
    label: 'The main idea',
    element: (
      /*
        THE SAME CLAIM, IN WORDS THAT SAY SOMETHING.

        The first version's callout read "Real work is a known pattern plus your
        project details", and its body said "A pattern you already know, plus the
        specific details of your own project" -- the same sentence twice, and
        neither time with an example. The review said so: *"Couldnt understand the
        points, simplify the english and explanation."*

        It was a definition of "deployment work" pretending to be an insight. The
        fix is to stop defining and start listing: name the pattern (the one the
        room has already run twice) and name the details (four concrete things
        this project has and the demo did not). A claim the room can check against
        the next twenty slides beats a claim it can only nod at.
      */
      <ContentNoteSlide
        kicker="The main idea"
        title="Docker Compose for Django + React Project"
        lead="Steps are the same as the demo apps, only the project details change"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'success',
          title: 'Pattern is the same every time',
          body: 'Write a Dockerfile for each part, describe both in one Compose file, run it with one command',
        }}
        points={[
          {
            text: 'Details are what a real project brings',
          },
          {
            text: 'So what goes in a real Django Dockerfile?',
            tone: 'brand',
          },
        ]}
      />
    ),
    notes:
      'The quotable line is "the steps are the same, only the details change", and the four details in the second bullet are exactly what concept 2 and 3 spend their slides on, in that order. Pause, then ask the closing question out loud and let the divider answer it.',
  },

  /* ── CONCEPT 2: A DOCKERFILE FOR EACH HALF (16 to 37) ──────────────────── */
  {
    id: 'c2-divider',
    section: AGENDA[1],
    label: 'Divider',
    element: (
      <SectionBreakerSlide
        index={2}
        title={AGENDA[1]}
        subtitle="Backend first, then frontend"
        lesson={SESSION}
      />
    ),
    notes: 'Two Dockerfiles, one per folder. The same rule as last session: one folder, one Dockerfile.',
  },
  {
    id: 'c2-requirements-as-is',
    section: AGENDA[1],
    label: 'requirements.txt as-is',
    element: (
      <ContentSlide
        kicker="The backend"
        title="requirements.txt, as It Is Today"
        lead="Open backend\requirements.txt"
        lesson={SESSION}
      >
        <CodeBlock
          code={`Django
djangorestframework
django-filter
djangorestframework-simplejwt
django-cors-headers`}
          filename="backend\requirements.txt"
          language="text"
        />
      </ContentSlide>
    ),
    notes:
      'Show it before naming the problem (R6). The room has never looked twice at this file, and that is exactly the point.',
  },
  {
    id: 'c2-question-which-version',
    section: AGENDA[1],
    label: 'Question: which version',
    element: (
      <QuestionSlide
        kicker="A question first"
        question={<>Which version of Django does this file install?</>}
        qualifier="Build runs pip install -r requirements.txt, and the file names Django with no version"
        lesson={SESSION}
      />
    ),
    notes:
      'First half of the pinning question, and the easier half. Someone will say "the latest one", which is the right answer and sets up the second question. Take hands; do not answer it yourself.',
  },
  {
    id: 'c2-question-next-month',
    section: AGENDA[1],
    label: 'Question: next month',
    element: (
      <QuestionSlide
        kicker="And the one that matters"
        /* "the same Django" narrowed the question to one package, and the room
           answers it about Django alone. The file names five, and `pip freeze`
           is about to show nine: the review asked for "the same versions?", which
           is the question the pinned file actually answers. */
        question={<>A teammate builds the same image next month. Do they get the same versions?</>}
        lesson={SESSION}
      />
    ),
    notes:
      'The pause beat of the section. Do not answer it. Someone will say yes, and the next slide is far more useful once the room has committed to an answer out loud. Split from the previous slide deliberately: asked together, the room answers the easy half and never considers this one.',
  },
  {
    /*
      THE ANSWER TO THE QUESTION, ON ITS OWN FRAME.

      This line used to be the lead of `c2-pip-freeze`, sitting on top of a
      ten-line `pip freeze` transcript, and the review cut that slide. The
      transcript was the disposable half; the answer was not. A question slide
      whose answer never arrives is worse than no question at all, and the
      four-beat rule wants the COST landed before the command that fixes it
      (PEDAGOGY_GUIDELINES section 2, beats 2 and 3).

      So: beat 2 is "no, and here is what that costs you", beat 3 is "the file has
      to name exact versions", and only then does the next slide reach for
      `pip freeze`. No panel, because the claim is the whole content.
    */
    id: 'c2-unpinned-cost',
    section: AGENDA[1],
    label: 'No, and why',
    element: (
      <ContentNoteSlide
        kicker="The backend"
        title="No. They Get Whatever Is Newest That Day"
        lead="A name with no version installs the latest release at the moment the image is built"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'Same file stops building the same image',
          body: 'Your image was built in March and theirs in June, so the two contain different versions of the same packages, and only one of them works',
        }}
        points={[
          { text: 'File has to name the exact version of every package', sub: 'Then every build, on every machine, in every month, installs the same set', tone: 'brand' },
        ]}
      />
    ),
    notes:
      'Take the show of hands from the previous slide first, then answer it. This is the moment the room stops seeing requirements.txt as a list of names and starts seeing it as a contract. Do not name the command yet; the next slide is what writes the versions down.',
  },
  {
    id: 'c2-pip-freeze-shape',
    section: AGENDA[1],
    label: 'pip freeze, explained',
    element: (
      /*
        EXPLAINED BEFORE IT IS TYPED.

        The deck used to run `pip freeze`, then show a pinned `requirements.txt`
        that had acquired its versions between two slides with no command in
        between. A beginner is left to infer both the redirect and what it did.

        `>` is also NEW VOCABULARY and the vocabulary contract says a term is
        defined on the frame where it first appears, not in the speaker notes: it
        is shell redirection, not part of pip, and a room that has only ever run
        commands that print to the screen has never met it. So the shape gets its
        own frame before the run, which is what `CommandSyntaxSlide` is for: it
        draws a command's GRAMMAR and runs nothing, so there is no prompt path
        claiming a working directory it never demonstrates.
      */
      <CommandSyntaxSlide
        kicker="The backend"
        title="Writing the Versions Down"
        lead="One command reads your virtual environment and writes what it finds into a file"
        lesson={SESSION}
        parts={[
          {
            token: 'pip freeze',
            /* The three labels were lower case, which read as fragments of one
               broken sentence rather than as three names. The review asked for
               them capitalised. */
            label: 'Command',
            body: 'Prints every package installed in this virtual environment, each with the exact version',
          },
          {
            token: '>',
            label: 'Send output to a file',
            body: 'Without it the list prints to the screen. With it, the same list goes into a file instead',
          },
          {
            token: 'requirements.txt',
            label: 'File to write',
            body: 'Overwritten, not appended. The old unpinned file is replaced by this one',
          },
        ]}
        note={{
          kind: 'warning',
          title: 'It overwrites the file',
          /* "expect the old contents to be gone" was doing two jobs badly: it
             restated the title and it read as a warning about losing something
             that matters. The review asked for it rephrased for clarity. What the
             room actually needs is WHERE to run it, and the reassurance that the
             replacement is the same list with versions on it. */
          body: 'Run it from backend\\, the folder that holds requirements.txt. The new file replaces the old one, with the same packages and a version on each',
        }}
      />
    ),
    notes:
      'Say the > out loud as "into". Read the line left to right: pip freeze, into, requirements.txt. Ask who has used > before; in most rooms almost nobody has, and it is worth ten seconds because it is a shell feature they will meet everywhere, not a pip one. Do not run anything on this slide.',
  },
  {
    id: 'c2-pip-freeze-run',
    section: AGENDA[1],
    label: 'Run it',
    element: (
      /*
        THE COMMAND THAT WRITES THE FILE, AND THE SILENCE IT RETURNS.

        The empty prompt is the teaching, not an omission. Every command this
        room has run so far printed something, so a command that prints NOTHING
        reads as a failure to a beginner.

        A `dir requirements.txt` line and its timestamp used to sit under the
        command as evidence that the file had just been written. The review cut it
        twice over, and it was right to: a second command on the panel makes the
        slide about two commands, the room reads the byte count as something it is
        supposed to match, and the proof it offers is not needed, because the very
        next slide opens the file and shows the versions in it. That is better
        evidence than a file size, and it costs no extra line here.
      */
      <ContentNoteSlide
        kicker="The backend"
        title="Run It"
        
        /* The lead was "The same list, sent into the file instead of onto the
           screen", which asks the room to hold two directions at once. The review
           asked for simple English: one thing happens, and it happens quietly. */
        lead="Run it in the backend folder, After Activating Virtual Environment packages and version that are present in the environmnet goes straight into the file"
        lesson={SESSION}
        
        note={{
          kind: 'info',
          title: 'It prints nothing, and that is success',
          body: 'Nothing appears on the screen because the list went into the file instead. An empty prompt is what a working run looks like here',
        }}
      >
         
        <Terminal
          path={ENV_AT_BACKEND}
          lines={[{ text: 'pip freeze > requirements.txt', kind: 'cmd' }]}
          caption="Terminal · the backend folder"
        />
      </ContentNoteSlide>
    ),
    
},
  {
    id: 'c2-pinned',
    section: AGENDA[1],
    label: 'Pinned',
    element: (
      <ContentNoteSlide
        kicker="The backend"
        title="requirements.txt, Now Pinned"
        lead="== fixes the exact version, so every build on every machine installs the same Django"
        lesson={SESSION}
        /* THE CALLOUT GOES ABOVE THE FILE. Below it, its last line sat 9px under
           the control bar even trimmed to one clause, because a nine-line panel
           plus any callout is simply more than the well holds bottom-up. Above
           the panel it also reads better: the room is told the file will be
           longer than expected BEFORE it counts the lines. */
        noteFirst
        note={{
          kind: 'note',
          /* "including the ones you did not ask for" made the extra packages sound
             like a problem, and it used "pinned" before the slide had defined it.
             The review asked for simple English: the file is longer than the room
             expects, and that is correct. */
          title: 'File is longer than the one you wrote, and that is correct',
          /* Two clauses, not three sentences. The first cut named the five
             packages, the nine, the three examples AND the reproducibility
             payoff, and `qa.mjs` measured the callout 15px past the bottom of the
             frame. The count and the examples are the content; "which is what
             makes the build repeatable" is the lead's job and the lead already
             says it. */
          /* The three example names went to the speaker notes. Even trimmed to
             two clauses this ran to a second line and stayed 15px past the bottom
             of the frame, and three inline code chips are what pushed it there:
             each one is wider than the words it replaces. The instructor can name
             asgiref out loud; the room only needs "five became nine". */
          body: 'Your five packages need others to work, so the list has nine, every one of them versioned',
        }}
      >
        <CodeBlock
          code={`asgiref==3.12.1
Django==6.1
django-cors-headers==4.9.0
django-filter==26.1
djangorestframework==3.18.0
djangorestframework_simplejwt==5.5.1
PyJWT==2.13.0
sqlparse==0.6.0
tzdata==2026.3`}
          filename="backend\requirements.txt"
          language="text"
          /* 12.5px, not 14. Nine pinned lines under a callout measured 29px past
             the bottom of the frame at 14 and 15px at 13. `maxHeight` is not the
             lever here: it only adds an inner scroll, and the harness measures the
             un-clipped rect either way. */
          fontSize={12.5}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Name the three you did not install out loud: asgiref, sqlparse and PyJWT, each pulled in by something you did install. Same file as `c2-requirements-as-is`, so flip back and forth once. == means exactly this version: from now on every build of this image, on any machine, in any month, installs the same Django.',
  },
  {
    id: 'c2-base-image',
    section: AGENDA[1],
    label: 'The base image',
    element: (
      <ContentNoteSlide
        kicker="The backend"
        title="Choosing the Python Version"
        /* "Any Python can print two lines" opened the slide on the demo rather
           than on this project, and the review cut it. The demo comparison is
           still worth making, so it moved into the speaker notes where it belongs:
           it is an aside the instructor says, not a line the room reads. */
        lead="A real project needs a Python version its Django actually supports"
        lesson={SESSION}
        note={{
          kind: 'tip',
          title: 'Pick the newest version this Django supports',
          body: (
            <>
              Django 6.1 supports Python 3.13 and 3.14, so the tag is <Code>python:3.14-slim</Code>. Read the
              support list for your own Django before choosing
            </>
          ),
        }}
      >
        {/* Three tiers, not three arbitrary tags. The review asked for
            "3.14, 3.13, 3.12 or older", which is the honest shape of a support
            range: the newest supported, a supported one that is older than it
            needs to be, and everything below the floor as one row. Listing 3.9 on
            its own invited the question "what about 3.11?", which the table then
            had no answer for. */}
        <DataTable
          columns={[{ label: 'Image tag' }, { label: 'Works with Django 6.1' }]}
          rows={[
            [<Tech name="python" label="python:3.14-slim" />, 'Supported, and the newest supported version'],
            [<Tech name="python" label="python:3.13-slim" />, 'Supported, but older than it needs to be'],
            [<Tech name="python" label="python:3.12-slim, or older" />, 'Below the supported range for Django 6.1'],
          ]}
          highlight={[1]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'The demo used this same tag and got away with it, because printing two lines works on any Python. Say plainly that it was luck, not a decision: here the tag has to be one Django 6.1 supports, and checking that list is the habit worth keeping. If their own project pins a different Django, the supported range moves with it.',
  },
  {
    id: 'c2-backend-dockerfile',
    section: AGENDA[1],
    label: 'The backend Dockerfile',
    element: (
      <ContentSlide
        kicker="The backend"
        title="Backend Dockerfile"
        lead="Written with the 5 familiar instructions you already know"
        lesson={SESSION}
      >
        <CodeBlock code={BACKEND_DOCKERFILE_INITIAL} filename="backend\Dockerfile" language="dockerfile" />
      </ContentSlide>
    ),
    notes:
      'Show the initial backend Dockerfile built using only the five familiar instructions. We will test running it first before adding environment configuration.',
  },
  {
    id: 'c2-five-of-seven',
    section: AGENDA[1],
    label: 'Five of seven',
    element: (
      <ContentSlide
        kicker="The backend"
        title="Lines You Have Written Before"
        lead="Base image, workdir, dependency file first for the cache rule, install, code, start command"
        lesson={SESSION}
        points={[
          { text: 'Only the server address on the CMD line is new', sub: 'It is there because Django is a server, and the demo script was not', tone: 'brand' },
        ]}
      >
        <CodeBlock
          code={BACKEND_DOCKERFILE_INITIAL}
          filename="backend\Dockerfile"
          language="dockerfile"
          highlight={hl(BACKEND_DOCKERFILE_INITIAL, 'CMD ')}
        />
      </ContentSlide>
    ),
    notes:
      'Same panel as the previous slide with the CMD line lit. Ask the room which line they have never written before. Every instruction used so far is one they already know.',
  },
  {
    id: 'c2-env-line',
    section: AGENDA[1],
    label: 'ENV, for the logs',
    element: (
      <ContentSlide
        kicker="The backend"
        title="Instruction for Capturing Logs"
        /* Was "It Ensures Python sends logs to the output stream immediately
           instead of buffering them, so they appear promptly in docker logs":
           35 words, two mid-sentence capitals, and it opened on "It" with no
           antecedent, since the line it refers to is not lit until the panel
           below renders. Named the subject and cut it to one clause. */
        lead="ENV PYTHONUNBUFFERED=1 makes Python print each line as it happens, instead of holding it in a buffer"
        lesson={SESSION}
      >
        <CodeBlock
          code={BACKEND_DOCKERFILE}
          filename="backend\Dockerfile"
          language="dockerfile"
          highlight={hl(BACKEND_DOCKERFILE, 'ENV ')}
        />
      </ContentSlide>
    ),
    notes:
      'Same file as the previous slide with the ENV line added and lit. Without it, docker compose logs backend can come back completely empty while Django is running perfectly well, which is the most disorienting thing that can happen to somebody debugging their first container.',
  },
  {
    id: 'c2-backend-dockerignore',
    section: AGENDA[1],
    label: 'Backend .dockerignore',
    element: (
      /*
        BEAT 1: THE FILE THE ROOM ALREADY WRITES.

        This slide used to show all eight lines at once and the next one explained
        the three new ones, which the review called out: *"Instead of introducing
        like this then what about our database? and .env? then explain clearly
        instead of directly putting."*

        So this is now only what last session wrote -- five lines the room can read
        and recognise -- and the three new entries arrive two slides later as the
        answer to a question about this project's own files.
      */
      <ContentSlide
        kicker="The backend"
        title="Its .dockerignore, From Last Session"
        lead="Same five lines you wrote for the demo, in the folder next to the Dockerfile"
        lesson={SESSION}
      >
        <CodeBlock
          code={DOCKERIGNORE_OLD.join('\n')}
          filename="backend\.dockerignore"
          language="text"
        />
      </ContentSlide>
    ),
    notes:
      'Read them out: the venv, the caches, the compiled files, Git, the editor. Nothing here is new, and that is the point of the slide. Then ask what this project has that the demo did not.',
  },
  {
    /*
      BEAT 2 AND 3: THE QUESTION THE NEW ENTRIES ANSWER.

      The review asked for this slide by name: *"what about our database? and
      .env?"* Both files exist in the room's own project right now, both would be
      swept into the image by `COPY . .`, and neither of them was a problem on the
      demo, because the demo had neither.

      Content rule 16: the question and nothing else.
    */
    id: 'c2-dockerignore-question',
    section: AGENDA[1],
    label: 'Question: what about our files',
    element: (
      <QuestionSlide
        kicker="What about this project"
        question={<>COPY . . copies the whole folder, should your database file and your .env go into the image with it?</>}
        lesson={SESSION}
      />
    ),
    notes:
      'Both answers are no, and for two different reasons: the database because it is data and not code, the .env because it is a secret. Take both out of the room before the next slide names them. Somebody usually asks where the container\u2019s database lives instead, which is the right question and is answered in the next section.',
  },
  {
    /*
      BEAT 4: THE THREE ENTRIES, AND WHAT EACH ONE KEEPS OUT.

      `.vscode/` used to be a third row here. The review cut it: *"Remove this
      .vscode/ -- Editor settings, already on the frontend list."* It was never a
      NEW entry at all, it is on the five lines from last session, so listing it
      under "new entries" was simply wrong. Two rows, two reasons, and both of
      them are about this project rather than about tidiness.
    */
    id: 'c2-dockerignore-earns',
    section: AGENDA[1],
    label: 'Why db.sqlite3 stays out',
    element: (
      <ContentNoteSlide
        kicker="The answer"
        title="Three New Lines Keep Them Out"
        lead="Same file, with your database and your secrets added to it"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'warning',
          title: 'db.sqlite3 is now your real dev database',
          body: 'Months of test data that must not be frozen into every image and shipped to every machine',
        }}
      >
        <CodeBlock
          code={BACKEND_DOCKERIGNORE}
          filename="backend\.dockerignore"
          language="text"
          highlight={hl(BACKEND_DOCKERIGNORE, ...DOCKERIGNORE_NEW)}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Point at the three lit lines. db.sqlite3 and data/ are the same answer twice, one for the file the room has now and one for the folder the container will use. The .env line blocks a stray copy inside the backend folder; the real .env lives at the project root, outside this build entirely. Where the container\u2019s data DOES live is the volume slide in the next section. Do not answer it here, just promise it.',
  },
  {
    id: 'c2-which-node',
    section: AGENDA[1],
    label: 'The Node version',
    element: (
      <ContentNoteSlide
        kicker="The frontend"
        title=".nvmrc Names the Node Version"
        lead=".nvmrc records the Node version this project has always run on, and the image tag is read from it"
        lesson={SESSION}
        /* TWO FILES, TWO AUDIENCES. The review asked for this distinction
           explicitly, and it is the thing the slide was missing: both files name
           the same version and neither one reads the other, so a learner is
           entitled to ask why both exist. */
        points={[
          { text: <><Code>.nvmrc</Code>{' tells developers and their tools which Node version to use'}</> },
          { text: <><Code>Dockerfile</Code>{' tells Docker which Node version to put in the container'}</> },
        ]}
        note={{
          kind: 'success',
          title: 'Project\u2019s own files decide the base image',
          body: (
            <>
              <Code>pip freeze</Code> decided the Python side, and <Code>.nvmrc</Code> decides the Node side. Same
              lesson twice in one session
            </>
          ),
        }}
      >
        <CodeBlock code={`v22.12.0`} filename="frontend\.nvmrc" language="text" showLineNumbers={false} />
      </ContentNoteSlide>
    ),
    notes:
      'That file has been telling every developer\u2019s nvm which Node this project runs on. The tag becomes node:22-alpine, read from the same source of truth.',
  },
  {
    id: 'c2-frontend-dockerfile',
    section: AGENDA[1],
    label: 'The frontend Dockerfile',
    element: (
      <ContentSlide
        kicker="The frontend"
        title="Frontend Dockerfile"
        lead="Node Dockerfile, with two upgrades"
        lesson={SESSION}
      >
        {/*
          HAND-COUNTED LINE NUMBERS, WRONG AGAIN.

          This was `highlight={[4, 9]}` and the review caught it: lines 4 and 9 of
          this file are both BLANK, so the slide lit two empty rows. The two lines
          it means are the lockfile copy and the CMD, which are 5 and 10.

          Same defect as `c2-five-of-seven`'s `[3, 11]` earlier in this deck, and
          the same fix. `hl()` derives the numbers from the text, so a highlight
          follows the line it belongs to when the file gains or loses a row.
          S10a records this: if you are counting rows in a code panel, you are
          writing the bug.
        */}
        <CodeBlock
          code={FRONTEND_DOCKERFILE}
          filename="frontend\Dockerfile"
          language="dockerfile"
          highlight={hl(FRONTEND_DOCKERFILE, 'package-lock.json', 'CMD ')}
        />
      </ContentSlide>
    ),
    notes:
      'The two lit lines are the two upgrades: the lockfile comes too, and the CMD starts the Vite dev server. Next slide takes the first one apart.',
  },
  {
    id: 'c2-lockfile',
    section: AGENDA[1],
    label: 'The lockfile',
    element: (
      <ContentNoteSlide
        kicker="The frontend"
        title="Why the Lockfile Is Copied Too"
        lead="package-lock.json pins the npm versions. A caret like ^1.19.0 means 1.19.0 or any compatible newer one"
        lesson={SESSION}
        note={{
          kind: 'tip',
          title: 'package-lock.json pins the npm versions',
          body: (
            <>
              <Code>package-lock.json</Code> is where npm records the exact version of every package it installed,
              including the packages those packages need
            </>
          ),
        }}
      >
        <CodeBlock
          code={`"dependencies": {
  "axios": "^1.19.0",
  "react": "^19.0.0"
}`}
          filename="frontend\package.json"
          language="json"
          highlight={[2]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'The caret is the whole argument. Point at it: it means "1.19.0 or any compatible newer one", which is the same reproducibility hole `c2-question-next-month` asked about.',
  },
  {
    id: 'c2-frontend-dockerignore',
    section: AGENDA[1],
    label: 'Frontend .dockerignore',
    element: (
      <ContentNoteSlide
        kicker="The frontend"
        title="Its .dockerignore"
        lead="Six lines, and the first one matters far more today than it did last week"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'node_modules must never enter the image',
          body: (
            <>
              Then <Code>node_modules/</Code> was an empty folder excluded as good practice. Today it is hundreds of
              megabytes, some of it compiled for your OS, and copying it in would overwrite the Linux packages{' '}
              <Code>npm install</Code> just built inside the image
            </>
          ),
        }}
      >
        <CodeBlock
          code={`node_modules/
build/
.env
.git/
.vscode/
npm-debug.log`}
          filename="frontend\.dockerignore"
          language="text"
        />
      </ContentNoteSlide>
    ),
    notes:
      'The two new entries are build/, the output of npm run build, and .env, which holds the backend address that is about to move into the Compose file.',
  },
  {
    id: 'c2-two-images',
    section: AGENDA[1],
    label: 'Two buildable images',
    element: (
      <ContentSlide
        kicker="Where we are"
        title="Two Buildable Images"
        lead="Both real folders now hold the same pair of files"
        lesson={SESSION}
        points={[
          { text: 'Compose file that runs both is missing', tone: 'brand' },
        ]}
      >
        <FileTree
          root="C:\nxttrendz"
          entries={[
            { name: 'backend', folder: true, state: 'existing' },
            { name: 'Dockerfile', depth: 1, state: 'new' },
            { name: '.dockerignore', depth: 1, state: 'new' },
            { name: 'requirements.txt', depth: 1, state: 'new', note: 'pinned' },
            { name: 'frontend', folder: true, state: 'existing' },
            { name: 'Dockerfile', depth: 1, state: 'new' },
            { name: '.dockerignore', depth: 1, state: 'new' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The closing state of the section, and the question that opens the next one.',
  },

  /* ── CONCEPT 3: THE COMPOSE FILE (38 to 54) ────────────────────────────── */
  {
    id: 'c2-build-both',
    section: AGENDA[1],
    label: 'Build both images',
    element: (
      /*
        THE FIRST EVIDENCE THAT ANY OF IT WORKS.

        Concept 2 writes five files across twenty-two slides and, before this
        slide existed, ran none of them: the first build output in the deck was
        forty-one slides after the first file was opened, inside `up --build`.
        `c2-two-images` then claimed "two buildable images" as an assertion the
        room had to take on trust. A concept is not finished until the learner has
        run it and seen output.

        TWO PANELS, NOT ONE (rule S4): two builds in two folders are two
        terminals, and the folder each runs from is the teaching, because a build
        only ever sees its own app's files.

        THE OUTPUT IS ABRIDGED TO THE TWO LINES THIS DECK ALREADY QUOTES from the
        TR. Nothing here is composed: a full `docker build` transcript would have
        to be invented, and rule S8 says a transcript is quoted or it is captured,
        never plausible. The capture is tracked as outstanding.
      */
      <ContentNoteSlide
        kicker="The backend and the frontend"
        title="Build Both Images"
        lead="Two Dockerfiles, two builds, each run from the folder it belongs to"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'Two images now exist on your machine',
          body: 'Neither has been started yet. Building an image and running a container are still two separate steps',
        }}
      >
        <div className="flex items-start gap-5">
          <Terminal
            className="flex-1"
            path={AT_BACKEND}
            fontSize={13}
            caption="Terminal · the backend build"
            lines={[
              { text: 'docker build -t nxttrendz-backend .', kind: 'cmd' },
              { text: ' => [backend 4/5] RUN pip install -r requirements.txt', kind: 'out' },
              { text: ' => naming to nxttrendz-backend', kind: 'ok' },
            ]}
          />
          <Terminal
            className="flex-1"
            path={AT_FRONTEND}
            fontSize={13}
            caption="Terminal · the frontend build"
            lines={[
              { text: 'docker build -t nxttrendz-frontend .', kind: 'cmd' },
              { text: ' => [frontend 4/5] RUN npm install', kind: 'out' },
              { text: ' => naming to nxttrendz-frontend', kind: 'ok' },
            ]}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Wait for both to finish before moving on. The slow step in each is the install line, and it is slow only the first time. Transcripts are ABRIDGED and quoted from the TR (R3), not captured: the full output of both builds is an outstanding capture, and the timings are illustrative.',
  },
  {
    id: 'c3-divider',
    section: AGENDA[2],
    label: 'Divider',
    element: (
      <SectionBreakerSlide index={3} title={AGENDA[2]} subtitle="One file, above both folders" lesson={SESSION} />
    ),
    notes: 'Hand over: "one file describes both, so where does it live?"',
  },
  /*
    BINDING NOW SITS AFTER PUBLISHING, AND THAT ORDER IS THE WHOLE FIX.

    These two slides used to run at 29 and 30, fifteen slides before `ports`. They
    argue that a request from the browser is REFUSED unless the server binds to
    0.0.0.0 -- an argument about a journey the room had been given no mechanism
    for. Nothing so far had said a browser could reach a container at all, so the
    failure mode attached to nothing. The deck knew: `c3-ports-note` opened with
    "Publishing needs a server bound to 0.0.0.0", a sentence that exists only to patch a gap.

    In this order the packet is taught in the order it travels: a door is opened
    on the laptop (`ports`), the request crosses the boundary, and then the server
    behind the door either accepts it or refuses it. The refusal is now the last
    step of a journey the room has just watched, not a rule arriving in advance of
    its reason.
  */
  {
    id: 'c3-skeleton',
    section: AGENDA[2],
    label: 'The skeleton',
    element: (
      <CodeBuildSlide
        kicker="The Compose file"
        title="Same File, One Level Up"
        lead="In C:\nxttrendz, above both folders, because it is the one file that describes both"
        lesson={SESSION}
        code={COMPOSE_STAGES[0]}
        filename="docker-compose.yml"
        highlight={hl(COMPOSE_STAGES[0], 'build: ./')}
        annotation={{
          key: 'build:',
          body: 'Same Compose file cut back to its basic shape, with the build paths pointing at the real Django and React folders',
        }}
      />
    ),
    notes:
      'From here on, every command runs from C:\\nxttrendz. Four additions turn this skeleton into the real stack, and two of them are promises last session made.',
  },
  {
    /*
      BEAT 2: THE RUN THAT FAILS, BEFORE THE KEY THAT FIXES IT.

      This slide used to sit BEFORE the skeleton and open with "The ports key
      opens a port on your laptop" -- the answer, delivered before the room had a
      Compose file to put it in, let alone a failure to explain. The review asked
      for `ports` to be introduced where the file gets it: *"Introduce ports
      here."*

      So the order is now the four beats (PEDAGOGY_GUIDELINES section 2). The
      skeleton above is beat 1: it builds, both containers start, `ps` says they
      are up. This is beat 2, and it is the whole reason `ports` exists: two
      containers running perfectly and a browser that cannot reach either of them.
      Beat 3 is the callout, which names what is needed without naming the key.
    */
    id: 'c3-locked-door',
    section: AGENDA[2],
    label: 'Nothing answers',
    element: (
      <ContentNoteSlide
        kicker="A problem first"
        /* The first cut of this title was "Both Containers Are Up, and the
           Browser Cannot Reach Them", which is 44 characters too many: at
           `slide-title` it wrapped to a second line and the first line's right
           edge reached 227px into the instructor-video rectangle. A title states
           the situation; the lead carries the evidence. */
        title="Running, and Unreachable"
        lead="docker compose ps says both services are running, and localhost:8000 in the browser does not answer"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'A container is closed to the outside by default',
          body: 'Django is listening on port 8000 inside its own container, and nothing on your laptop connects to it. We need a way to open a door from the laptop into the container',
        }}
      >
        <Terminal
          path={AT_ROOT}
          lines={[
            { text: 'docker compose ps', kind: 'cmd' },
            { text: 'NAME                   SERVICE    STATUS', kind: 'out' },
            { text: 'nxttrendz-backend-1    backend    running', kind: 'ok' },
            { text: 'nxttrendz-frontend-1   frontend   running', kind: 'ok' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Let the room try it and get nothing. This is also a direct callback to how last session ended: "not possible until the service opens a port". If nobody remembers that sentence, better still, because the next slide is the fix and it lands harder on a room that has just watched the failure.',
  },
  {
    id: 'c3-both-publish',
    section: AGENDA[2],
    label: 'Both publish',
    element: (
      <CodeBuildSlide
        kicker="The answer"
        title="The ports Key Opens the Door"
        /* Beat 4. The key arrives as the answer to the failed run two slides
           back, so the lead can say what it DOES rather than announcing what it
           is called. */
        lead="ports publishes a port on your laptop and connects it to the port inside the container"
        lesson={SESSION}
        code={COMPOSE_STAGES[1]}
        filename="docker-compose.yml"
        highlight={hl(COMPOSE_STAGES[1], 'ports:', '8000:8000', '3000:3000')}
        annotation={{
          key: 'ports:',
          body: 'Django listens on 8000 because the CMD said so, and Vite on 3000 because vite.config.js said so',
          replaces: 'reaching a container from your browser at all',
        }}
        note={{
          kind: 'success',
          title: 'Host and container ports are kept identical',
          body: 'Every address from the integration course keeps working unchanged, including the http://localhost:3000 already listed in CORS_ALLOWED_ORIGINS',
        }}
      />
    ),
    notes:
      'The CORS point is why the numbers match rather than being chosen freely. It is also the first hint of the paradox: CORS still matches, because the thing calling the API is still the browser.',
  },
  {
    id: 'c3-ports-anatomy',
    section: AGENDA[2],
    label: 'ports anatomy',
    element: (
      <ContentSlide
        kicker="The answer"
        title="What the Two Numbers Mean"
        /* The lead used to say what `ports` does, which is now the previous
           slide's job. This slide has one question to answer: why the same number
           appears twice with a colon between it. */
        lead="8000:8000 is two different places that happen to have the same number"
        lesson={SESSION}
      >
        <PortPublish />
      </ContentSlide>
    ),
    notes:
      'The figure of this concept. The left number is the address the outside world uses, the right is where the app actually listens inside. Two different places, and the room reads them as one thing repeated.',
  },
  {
    id: 'c2-binding',
    section: AGENDA[2],
    label: 'The binding',
    element: (
      <ContentNoteSlide
        kicker="Publishing and binding"
        title="Address in the CMD"
        lead="0.0.0.0 means accept connections arriving on any network interface. Plain runserver uses 127.0.0.1, which means inside this container only"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'Server runs, the browser is refused',
          body: 'Logs report the server started, and the request is still refused, because it arrived from outside the container',
        }}
      >
        <CodeBlock
          code={`CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]`}
          language="dockerfile"
          showLineNumbers={false}
          highlight={[1]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Your browser\u2019s request arrives from outside the container and gets refused. 0.0.0.0 means accept connections from any network interface.',
  },
  {
    id: 'c2-two-questions',
    section: AGENDA[2],
    label: 'Two questions',
    element: (
      <ContentNoteSlide
        kicker="Publishing and binding"
        title="Browser Address, Server Binding"
        lead="Nobody ever types 0.0.0.0 into a browser. These are two different questions"
        lesson={SESSION}
        note={{
          kind: 'success',
          /* ONE STATEMENT. The title and the body used to say the same thing in
             different word order -- "A server in a container binds to 0.0.0.0"
             over "Inside a container, a server always binds to 0.0.0.0" -- which
             reads as a callout that could not decide which half was the point.
             The rule is the title now, and the body carries the REASON, which is
             what makes it a rule rather than a fact to memorise. */
          title: 'Inside a container, a server always binds to 0.0.0.0',
          body: 'Every request arrives from outside the container, so 127.0.0.1 refuses all of them',
        }}
      >
        <DataTable
          columns={[{ label: 'Question' }, { label: 'Answer' }]}
          rows={[
            [
              'What do I type in the browser?',
              <>
                <Code>localhost:8000</Code>, the same as always
              </>,
            ],
            [
              'What must the server inside the container bind to?',
              <>
                <Code>0.0.0.0</Code>, or the request gets refused
              </>,
            ],
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'R5. This table is the defence against the single most common confusion of the session. 0.0.0.0 is a door policy, not an address to visit.',
  },
  {
    id: 'c2-vite-binding',
    section: AGENDA[2],
    label: 'Vite binding',
    element: (
      <ContentNoteSlide
        kicker="The frontend"
        title="Vite Binds to 0.0.0.0"
        lead="Every server in a container needs the same binding, the frontend sets it in vite.config.js"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'Django sets it in the CMD, Vite sets it in its config',
          /* Trimmed from "Django needed the address on the command line, and Vite
             carries it in its config file": at two lines the callout's last line
             sat 28px under the control bar. The title already carries the
             contrast, so the body only has to say the one thing the title does
             not. */
          body: 'Same setting, in whichever place each tool reads its own configuration from',
        }}
      >
        <CodeBlock
          code={`export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
    allowedHosts: true,
  },
})`}
          filename="frontend\vite.config.js"
          language="javascript"
          highlight={[4]}
          fontSize={15}
        />
      </ContentNoteSlide>
    ),
    notes:
      'This line has been sitting in their config all course. Say it: now you know what it was for. Small moment, and the room enjoys it.',
  },
  {
    id: 'c3-ports-note',
    section: AGENDA[2],
    label: 'Two notes on ports',
    element: (
      <ContentNoteSlide
        kicker="The new key"
        title="Two Notes on ports"
        lesson={SESSION}
        points={[
          {
            text: 'Host port and container port can differ',
            sub: '"8001:8000" publishes Django\u2019s 8000 as localhost:8001, useful when something else is already using 8000',
          },
        ]}
        note={{
          kind: 'info',
          title: 'Publishing needs a server bound to 0.0.0.0',
          body: 'Publishing opens the door on the host, and the server inside must also accept connections arriving through it. Both halves are needed',
        }}
      />
    ),
    notes:
      'The callout pays off `c2-two-questions` and is load-bearing, not an aside. Publishing without binding gives you the connection-reset error in the debugging section.',
  },
  {
    id: 'c3-frontend-env',
    section: AGENDA[2],
    label: 'Frontend environment',
    element: (
      <CodeBuildSlide
        kicker="The frontend's address"
        title="Backend Address for React"
        lead="src/api.js has read this since the integration course"
        lesson={SESSION}
        code={COMPOSE_STAGES[2]}
        filename="docker-compose.yml"
        highlight={hl(COMPOSE_STAGES[2], 'environment:', 'VITE_API_BASE_URL')}
        annotation={{
          key: 'environment:',
          body: (
            <>
              Vite hands every <Code>VITE_</Code> prefixed variable to the browser code, whether it comes from a{' '}
              <Code>.env</Code> file or from the environment Compose provides
            </>
          ),
          replaces: 'the frontend\u2019s own .env file',
        }}
      />
    ),
    notes:
      'Show src/api.js briefly if the room needs it: export const BASE_URL = import.meta.env.VITE_API_BASE_URL. Do not comment on the value yet (R1). The next slide does that.',
  },
  {
    id: 'c3-the-paradox',
    section: AGENDA[2],
    label: 'The odd address',
    element: (
      <ScenarioSlide
        kicker="Read that value again"
        title="This Address Breaks the Rule"
        situation="Compose file now says VITE_API_BASE_URL: http://localhost:8000"
        lesson={SESSION}
        beats={[
          {
            label: 'Container networking rule',
            detail: 'Service names are hostnames, one container reaches another at backend:8000, never localhost',
          },
          {
            label: 'Multi-container mistake',
            detail: 'Using localhost between containers is exactly that mistake',
          },
          {
            label: 'Compose file uses localhost anyway, and it is correct',
            detail: 'Why this address is correct is answered at the end of today',
          },
        ]}
      />
    ),
    notes:
      'R1, and content rule 4: name the problem, do not open it. Do NOT let a confident learner resolve this now. If someone gets it right, say "hold that thought, you are ahead of us" and move on. The payoff is `c4-paradox-resolved`.',
  },
  {
    id: 'c3-the-secret',
    section: AGENDA[2],
    label: 'The secret',
    element: (
      <ContentNoteSlide
        kicker="The secret"
        title="Secret Key in settings.py"
        lead="Look at what the integration course left in backend\myproject\settings.py"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'Committed to Git, where anyone can read it',
          body: (
            <>
              <Tech name="git" /> That file goes into Git with the project, and anyone who can see the repository can see
              the key
            </>
          ),
        }}
      >
        <CodeBlock
          code={`SECRET_KEY = 'django-insecure-uqka5q4b_rndv*1f@-bw^fg_r6tu$20wjm@yg7t^n)s@%mjpb@'`}
          filename="backend\myproject\settings.py"
          language="python"
          showLineNumbers={false}
          highlight={[1]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'The discomfort is the point. Last session promised a separate .env file "set up properly in the next session". This is that session.',
  },
  {
    id: 'c3-env-step1',
    section: AGENDA[2],
    label: 'Step 1',
    element: (
      <ContentSlide
        kicker="The secret · step 1 of 3"
        title="Move the Key to .env"
        lead="Create C:\nxttrendz\.env and move the value there"
        lesson={SESSION}
      >
        <CodeBlock
          code={`SECRET_KEY=django-insecure-uqka5q4b_rndv*1f@-bw^fg_r6tu$20wjm@yg7t^n)s@%mjpb@`}
          filename=".env"
          language="text"
          showLineNumbers={false}
        />
      </ContentSlide>
    ),
    notes: 'At the project root, next to docker-compose.yml, not inside backend\\.',
  },
  {
    id: 'c3-env-step2',
    section: AGENDA[2],
    label: 'Step 2',
    element: (
      <ContentSlide
        kicker="The secret · step 2 of 3"
        title="settings.py Reads It"
        lead="Edits one and two of the three lines this session changes in settings.py"
        lesson={SESSION}
      >
        <CodeBlock
          code={`import os

SECRET_KEY = os.environ.get('SECRET_KEY')`}
          filename="backend\myproject\settings.py"
          language="python"
          highlight={[1, 3]}
        />
      </ContentSlide>
    ),
    notes:
      'Two lines: the import at the top of the file, and the key read from the environment. The third settings line is the database, on `c3-database-settings`.',
  },
  {
    id: 'c3-env-step3',
    section: AGENDA[2],
    label: 'Step 3',
    element: (
      <CodeBuildSlide
        kicker="The secret · step 3 of 3"
        title="The env_file Key"
        lead="Second new key, and it loads the .env file"
        lesson={SESSION}
        code={COMPOSE_STAGES[3]}
        filename="docker-compose.yml"
        highlight={hl(COMPOSE_STAGES[3], 'env_file:', '- .env')}
        annotation={{
          key: 'env_file:',
          body: 'Hands every variable in the named file to this container',
          replaces: 'a secret written into a file that goes into Git',
        }}
      />
    ),
    notes: 'The second of the two new keys. Both are now on the file, and the rest of the session is detail.',
  },
  {
    id: 'c3-two-injectors',
    section: AGENDA[2],
    label: 'environment vs env_file',
    element: (
      /*
        THE SAME TWO ROWS, WITH THE COMPARISON MADE EXPLICIT.

        The review said the explanation was not clear, and the table was the
        reason. Its third column asked "Lives in a file that goes into Git?", a
        yes-or-no question whose answers were two sentences long, so the row read
        as three unrelated facts and the room had to assemble the comparison
        itself. The middle column made it worse by pairing a nine-word phrase
        against the single word "Secrets".

        Both keys do the same job -- they hand values to a container -- and differ
        in exactly one respect: where the value is WRITTEN, and therefore whether
        Git can see it. So the columns are now "where you write the value" and
        "who can read it", the two halves of the actual decision, and every cell
        is the same shape as the one beside it.
      */
      <ContentSlide
        kicker="The secret"
        title="Two Keys That Pass In Variables"
        lead="Both hand values to the container, they differ in where you write the value down"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Key' }, { label: 'Where you write the value' }, { label: 'Who can read it' }]}
          rows={[
            [
              <Code>environment:</Code>,
              <>
                In <Code>docker-compose.yml</Code> itself
              </>,
              'Anyone with the repository, so use it only for values that are safe to publish',
            ],
            [
              <Code>env_file:</Code>,
              <>
                In <Code>.env</Code>, which the file only points at
              </>,
              <>
                Only you, because <Code>.env</Code> never goes into Git
              </>,
            ],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Two rows, because the confusion is exactly two things. Read the second column across: written in the Compose file, or written in a file the Compose file names. Then the third: the frontend\u2019s address is safe to publish, and the Django secret key is not. That one difference is the whole rule.',
  },
  {
    /*
      BEATS 1 AND 2: THE DATABASE HAD NEVER BEEN MENTIONED BEFORE IT MOVED.

      The volume slide used to arrive straight after the secret, with the title
      "The Database Moves to /app/data" and no slide anywhere before it saying
      that the database was a problem. The review said so exactly:

        *"no connection or flow, this problem what mention in way before and in
         middle of nowhere this is introduced"*

      It was right. `db.sqlite3` appears once, twenty slides earlier, as a line in
      a `.dockerignore`, and the next thing the deck said about it was that it had
      moved somewhere. The room had no reason to want a volume, so the volume read
      as one more key to memorise.

      These two slides are beats 1 and 2. Beat 1 is the file the room has had all
      course, on a machine that stays put. Beat 2 is what happens to that
      arrangement the moment the app runs in a container, and it is a loss the
      room can feel: `docker compose down` and every product, user and order is
      gone.
    */
    id: 'c3-database-problem',
    section: AGENDA[2],
    label: 'Where does the data live',
    element: (
      <ContentNoteSlide
        kicker="A problem first"
        title="Your Data Would Vanish With the Container"
        lead="Until today the database has been one file on your laptop, and it survived because your laptop does"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'A file written inside a container dies with the container',
          body: 'Register a user, add ten products, run docker compose down, and the next up starts from an empty database. Nothing is corrupted and nothing is recoverable',
        }}
        points={[
          { text: 'Container needs a place to write that outlives it', sub: 'Last session built exactly that and put nothing real in it: the db_data volume', tone: 'brand' },
        ]}
      />
    ),
    notes:
      'Ask what happens to the data when the container is removed, and wait. Somebody will say the volume, which is the right answer and the reason last session ends where it does. If nobody does, that is fine: the loss is the point of the slide, not the fix.',
  },
  {
    /*
      BEAT 3 INTO 4: THE THIRD settings.py LINE, WHICH THE DECK HAD PROMISED
      TWICE AND NEVER SHOWN.

      `c3-env-step2` says "the third settings line is the database", and
      `c3-whats-changed` lists settings.py as "three lines changed". Only two were
      ever on a slide. A learner following along has changed two lines and is
      being told they changed three, which is the kind of gap that costs the room
      ten minutes at the wrong moment.

      It also belongs here on its own merits: pointing Django at `/app/data` is
      the half of the move that happens in the APPLICATION, and the volume key on
      the next slide is the half that happens in Compose. Split across two slides,
      each one is a single idea; together on one, they are the commonest way this
      material is taught badly.
    */
    id: 'c3-database-settings',
    section: AGENDA[2],
    label: 'settings.py points at /app/data',
    element: (
      <ContentSlide
        kicker="The database"
        title="Tell Django Where to Write"
        lead="Third and last line this session changes in settings.py"
        lesson={SESSION}
      >
        <CodeBlock
          code={`DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': '/app/data/db.sqlite3',
    }
}`}
          filename="backend\myproject\settings.py"
          language="python"
          highlight={[4]}
        />
      </ContentSlide>
    ),
    notes:
      'One line changed: the path. Django will now write its database into /app/data inside the container, and the next slide is what makes that folder survive. Say the two halves out loud in that order, because the room will meet the same pairing every time an app in a container needs to keep something.',
  },
  {
    id: 'c3-database-moves',
    section: AGENDA[2],
    label: 'The database moves',
    element: (
      <ContentSlide
        kicker="The database"
        title="Volume Makes That Folder Survive"
        /* Beat 4, and the second half of the move. The previous slide pointed
           Django at /app/data; this one is what stops that folder disappearing
           with the container. */
        lead="Mounting db_data at /app/data is what carries the database across every down and up"
        lesson={SESSION}
      >
        {/*
          NOT a CodeBuildSlide, and this is the one stage that cannot be.

          Its panel is 600x400 at 13.5px, which holds about 17 lines. The file
          reaches 19 here, so align-check reported it clipping 30px off its own
          bottom, and what fell off was the top-level `volumes: db_data:` block.

          That block is the whole point of this slide: the service-level
          `volumes:` key mounts a volume that the top-level one declares, and a
          learner who cannot see both at once cannot see the relationship. So
          the panel goes narrow and left instead: 760px keeps it clear of the
          instructor-video rectangle at x=913, which buys the height to show all
          19 lines at a readable size.
        */}
        <CodeBlock
          code={COMPOSE_STAGES[4]}
          filename="docker-compose.yml"
          language="yaml"
          highlight={hl(COMPOSE_STAGES[4], '    volumes:', 'db_data:/app/data', 'db_data:')}
          /* 12.5, down from 13. The full nineteen-line file at 13 put its last
             line numbers 7px under the control bar once the header floor dropped
             to 120px, and `align-check.mjs` flagged it on both slides that render
             this stage. Shortening the file is not an option: the whole argument
             is that the service-level `volumes:` key and the top-level block that
             declares it are visible AT ONCE. */
          fontSize={12.5}
          className="mr-auto w-[760px]"
        />
      </ContentSlide>
    ),
    notes:
      'The promise from last session, kept: "next session the real Django project\u2019s database file lives in exactly this folder". Say that the volume is the one place that outlives containers, and point at BOTH lit `volumes:` keys: the service mounts it, the block at the bottom declares it. The container\u2019s database starts empty, because your laptop\u2019s db.sqlite3 stays on your laptop; what an empty database needs first is the next section.',
  },
  {
    id: 'c3-why-not-app',
    section: AGENDA[2],
    label: 'Why /app/data',
    element: (
      <ContentNoteSlide
        kicker="The database"
        title="Why /app/data and Not /app"
        lead="A volume mounted at a folder takes that folder over"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'Mounted at /app, the volume captures your code',
          body: 'It would serve that first copy forever: every rebuilt image quietly hidden, and --build looking like it does nothing',
        }}
      >
        <VolumeShadow act={2} className="mx-auto max-w-[760px]" />
      </ContentNoteSlide>
    ),
    notes:
      'The database gets its own sub-folder so the code stays in the image, where rebuilds can replace it. This symptom looks identical to the frozen-image trap, which is why it needs a picture.',
  },
  {
    /*
      THE RULE, AS A VERDICT PER ROW.

      Asked for by the review, straight after the slide that explains why the
      volume goes on a sub-folder: *"Don't put the volume on the folder
      containing your code ... Put the volume on a separate data folder."*

      `StatusPointsSlide` is the right type and a `Callout` pair is the wrong one.
      The registry's line is that a list whose ROWS CARRY VERDICTS is a
      `StatusList`, and that two stacked callouts read as two things that must not
      be missed, which is neither of them. Here the two rows are one wrong and one
      right, and the whole slide is the difference between them.

      `code: true` puts both mount strings in the mono face, which matters more
      than usual here: they differ by five characters and the eye has to be able
      to land on exactly that difference. The verdict chips print "Fails" and
      "Works" from the component, so the slide needs no tick or cross of its own.
    */
    id: 'c3-volume-rule',
    section: AGENDA[2],
    label: 'Where the volume goes',
    element: (
      <StatusPointsSlide
        kicker="The database"
        title="Where the Volume Goes"
        lead="Remember which folder the volume is mounted on, because the wrong one hides your code"
        items={[
          {
            status: 'error',
            code: true,
            text: 'db_data:/app',
            detail: 'Do not mount the volume on the folder that holds your code',
          },
          {
            status: 'success',
            code: true,
            text: 'db_data:/app/data',
            detail: 'Mount it on a separate data folder, and the code stays in the image where rebuilds can replace it',
          },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'The one thing to carry out of this section. Read the two mount strings out loud and let the room hear how close they are: five characters between a working stack and one where --build silently does nothing. If anybody photographs one slide from this concept, it should be this one.',
  },
  {
    id: 'c3-complete-file',
    section: AGENDA[2],
    label: 'The complete file',
    element: (
      <ContentSlide
        kicker="The Compose file"
        title="Finished Compose File"
        lead="Six files created, two edited, one .gitignore line, and not a single line of application code touched"
        lesson={SESSION}
      >
        {/*
          A ContentNoteSlide here overflowed the frame by 170px: the finished
          file plus a callout is simply more than one slide holds. The callout's
          claim was the better half, so it became the lead, and the file gets the
          whole well. The next slide carries the inventory.
        */}
        <CodeBlock
          code={COMPOSE_STAGES[4]}
          filename="docker-compose.yml"
          language="yaml"
          /* 12.5, down from 13, for the same reason as the previous slide: at 13
             the last line numbers sat 7px under the control bar once the header
             floor dropped to 120px. */
          fontSize={12.5}
          /*
            LEFT-ALIGNED AND NARROW, AND THAT IS THE FIX.

            Full width, this panel is ~496px tall and its top lands at y=193,
            inside the instructor-video rectangle. Shrinking the font enough to
            clear it would take 11px, which nobody can read from the back.

            The rectangle starts at x=913, so a panel that ends before it can be
            as tall as the well allows. At 760px the longest line here
            (`VITE_API_BASE_URL: http://localhost:8000`, 46 characters) still
            fits comfortably.
          */
          className="mr-auto w-[760px]"
        />
      </ContentSlide>
    ),
    notes:
      'Read it aloud as a sentence: my app is two services, backend built from the real Django folder, reachable at localhost:8000, its secret from .env, its database in a volume, and frontend built from the real React folder, reachable at localhost:3000, told where the backend is, started after it.',
  },
  {
    id: 'c3-whats-changed',
    section: AGENDA[2],
    label: "What's on disk now",
    element: (
      <ContentSlide
        kicker="The Compose file"
        title="Everything Today Has Created"
        lead="Every file created today, before the first run"
        lesson={SESSION}
      >
        <FileTree
          root="C:\nxttrendz"
          entries={[
            { name: 'docker-compose.yml', state: 'new' },
            { name: '.env', state: 'new', note: 'never committed' },
            { name: 'backend', folder: true, state: 'existing' },
            { name: 'Dockerfile', depth: 1, state: 'new' },
            { name: '.dockerignore', depth: 1, state: 'new' },
            { name: 'requirements.txt', depth: 1, state: 'new', note: 'pinned' },
            { name: 'myproject\\settings.py', depth: 1, state: 'existing', note: 'three lines changed' },
            { name: 'frontend', folder: true, state: 'existing' },
            { name: 'Dockerfile  .dockerignore', depth: 1, state: 'new' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The full inventory before the first run. If anyone is behind, this is the slide to pause on.',
  },

  /* ── CONCEPT 4: FIRST RUN, AND WHO TALKS TO WHOM (55 to 72) ────────────── */
  {
    id: 'c4-divider',
    section: AGENDA[3],
    label: 'Divider',
    element: (
      <SectionBreakerSlide index={4} title={AGENDA[3]} subtitle="First run, and the address that broke the rule" lesson={SESSION} />
    ),
    notes: 'Hand over: "what happens the first time we run it?"',
  },
  {
    id: 'c4-up-build',
    section: AGENDA[3],
    label: 'up --build',
    element: (
      <ContentSlide kicker="First run" title="docker compose up --build"
        lead="First run builds both images, then creates the network, the volume and both containers"
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          lines={[
            { text: 'docker compose up --build', kind: 'cmd' },
            { text: '[+] Building 42.9s (24/24) FINISHED', kind: 'out' },
            { text: ' => [backend 4/5] RUN pip install -r requirements.txt', kind: 'out' },
            { text: ' => [frontend 4/5] RUN npm install', kind: 'out' },
            { text: '[+] Running 4/4', kind: 'out' },
            { text: ' Network nxttrendz_default        Created', kind: 'ok' },
            { text: ' Volume "nxttrendz_db_data"       Created', kind: 'ok' },
            { text: ' Container nxttrendz-backend-1    Started', kind: 'ok' },
            { text: ' Container nxttrendz-frontend-1   Started', kind: 'ok' },
          ]}
          caption="shortened: both servers' startup logs follow, and we read them next"
        />
      </ContentSlide>
    ),
    notes:
      'Network, volume and both containers, in that order, exactly as last session. Transcript quoted from the TR (R3). The build takes real minutes the first time, so this is a good moment for a question.',
  },
  {
    id: 'c4-it-stays-up',
    section: AGENDA[3],
    label: 'It stays up',
    element: (
      <ContentNoteSlide
        kicker="First run"
        title="Containers Keep Running"
        lead="Prompt does not come back"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'Every container in this course so far printed its lines and exited',
          body: 'These two are servers. They run until told to stop, exactly as runserver and npm run dev always held their terminals',
        }}
        points={[
          { text: 'Running in the background is now needed', tone: 'brand' },
        ]}
      />
    ),
    notes:
      'The absence is the observation, so a bare slide is honest here. Let the silence sit for a second before explaining it.',
  },
  {
    id: 'c4-detached',
    section: AGENDA[3],
    label: 'Detached',
    element: (
      <ContentSlide
        kicker="First run"
        title="Starting the Stack Detached"
        lead="Detached means the containers run in the background and your prompt comes straight back"
        lesson={SESSION}
      >
        <div className="grid grid-cols-2 gap-4">
          <Terminal path={AT_ROOT} lines={[{ text: 'docker compose up -d', kind: 'cmd' }]} />
          <Terminal
            path={AT_ROOT}
            lines={[
              { text: 'docker compose ps', kind: 'cmd' },
              { text: 'NAME                  STATUS         PORTS', kind: 'out' },
              { text: 'nxttrendz-backend-1   Up 21 seconds  0.0.0.0:8000->8000/tcp', kind: 'ok' },
              { text: 'nxttrendz-frontend-1  Up 21 seconds  0.0.0.0:3000->3000/tcp', kind: 'ok' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'ps is no longer empty after the run: Up, not Exited (0), and the PORTS column shows both published doors. That column is `c3-ports-anatomy`\u2019s figure, in text.',
  },
  {
    id: 'c4-read-logs-first',
    section: AGENDA[3],
    label: 'Read the logs',
    element: (
      <ContentNoteSlide
        kicker="Migrations"
        title="Read the Logs Before the Browser"
        lead="Django's log reports 39 unapplied migrations"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'Visit the API right now and it errors',
          body: (
            <>
              <Code>OperationalError</Code> at <Code>/api/products/</Code>, no such table
            </>
          ),
        }}
      >
        <Terminal
          path={AT_ROOT}
          lines={[
            { text: 'docker compose logs backend', kind: 'cmd' },
            { text: 'You have 39 unapplied migration(s). Your project may not work', kind: 'out' },
            { text: 'properly until you apply the migrations for app(s): admin, auth,', kind: 'out' },
            { text: 'cart, contenttypes, products, sessions, token_blacklist, users.', kind: 'out' },
            { text: "Run 'python manage.py migrate' to apply them.", kind: 'out' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Establish the habit out loud: when something is wrong, the logs have usually already said so. This is also where PYTHONUNBUFFERED pays off.',
  },
  {
    id: 'c4-why-empty',
    section: AGENDA[3],
    label: 'Why empty',
    element: (
      <ContentSlide
        kicker="Migrations"
        title="New Database Is Empty"
        lead="Volume is brand new, so the database has no tables, not even Django's own"
        lesson={SESSION}
        points={[
          { text: 'Your laptop\u2019s db.sqlite3 stayed on your laptop', sub: 'The .dockerignore kept it out of the image' },
          /* "day one of the Django course" named a course the room may not place,
             and the review asked for it in terms of what they did rather than
             where they were taught it. */
          { text: 'Models must be migrated, exactly as you did the first time you set this project up', tone: 'brand' },
        ]}
      />
    ),
    notes: 'Name it as correct behaviour, not data loss. Someone always thinks their data has been deleted.',
  },
  {
    id: 'c4-cant-run-here',
    section: AGENDA[3],
    label: 'Not on your laptop',
    element: (
      <ContentNoteSlide
        kicker="Migrations"
        title="migrate Fails on Your Laptop"
        lead="Running manage.py migrate in your own terminal fails"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'Django now lives inside the container',
          body: 'There is no venv active here, and no database here either. The command must run where Django is',
        }}
      >
        <Terminal
          path={AT_ROOT}
          lines={[
            { text: 'python manage.py migrate', kind: 'cmd' },
            { text: "ModuleNotFoundError: No module named 'django'", kind: 'out' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Let someone try it and fail. The error is worth seeing, because it is the same shape as forgetting to activate the venv, which the room knows well.',
  },
  {
    id: 'c4-exec-anatomy',
    section: AGENDA[3],
    label: 'exec anatomy',
    element: (
      /*
        THE KIT FIGURE, NOT THE SESSION'S FOURTH HAND-ROLLED ANATOMY.

        The review's verdict on `ExecAnatomy` was "design is not nyc", and the
        redesign is not a redesign: it is a deletion. This exact figure has been
        hand-rolled four times in this course -- `PortPublish` and `ExecAnatomy`
        here, `TargetAnatomy` in session 5 -- and the generalised version has been
        sitting in the kit as `SyntaxBreakdown` ever since. Section 6 of the
        generate-slides skill names this file as the reason that rule exists.

        The kit version is also the only one that is CORRECT. `ExecAnatomy` laid
        its tokens out by multiplying a character count by an assumed 10.2px per
        glyph and positioned every caption with an SVG transform, so its labels
        were one font-metric away from sitting on top of each other, and all three
        harnesses would have reported it clean regardless: an `<svg>` is one DOM
        rectangle to them (content rule 17, S9). `SyntaxBreakdown` is real
        elements in a real grid, so the browser keeps the labels apart and
        `align-check.mjs` can see them.

        `mode="command"` because this is typed at a prompt, not written in a file.
      */
      <ContentSlide
        kicker="Migrations"
        title="exec Runs It Inside"
        lead="docker compose exec is the one new command of the session"
        lesson={SESSION}
      >
        <SyntaxBreakdown
          mode="command"
          parts={[
            {
              token: 'docker compose exec',
              label: 'Command',
              body: 'Runs a command inside a container that is already running',
            },
            {
              token: 'backend',
              label: 'Which service',
              body: 'Service name from docker-compose.yml, so Compose knows which container to enter',
            },
            {
              token: 'python manage.py migrate',
              label: 'What to run in there',
              body: 'Exact command you have always run, unchanged',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Three parts, and the third is the command they have run since the first day of this project. That is the payoff: exec is not a new way to migrate, it is a way to reach the place where migrate already works. Click the captions one at a time so the room reads the whole line before it is taken apart.',
  },
  {
    id: 'c4-migrate',
    section: AGENDA[3],
    label: 'migrate',
    element: (
      <ContentNoteSlide
        kicker="Migrations"
        title="39 Migrations, Applied"
        lead="Same migrate output, now from inside the container"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'Every table landed inside the volume',
          body: (
            <>
              In <Code>/app/data/db.sqlite3</Code>, which is the one place that survives when containers are removed
            </>
          ),
        }}
      >
        <Terminal
          path={AT_ROOT}
          lines={[
            { text: 'docker compose exec backend python manage.py migrate', kind: 'cmd' },
            { text: 'Operations to perform:', kind: 'out' },
            { text: '  Apply all migrations: admin, auth, cart, contenttypes,', kind: 'out' },
            { text: '                        products, sessions, token_blacklist, users', kind: 'out' },
            { text: 'Running migrations:', kind: 'out' },
            { text: '  Applying contenttypes.0001_initial... OK', kind: 'ok' },
            { text: '  ...', kind: 'out' },
          ]}
          caption="shortened: 39 migrations apply, one line each"
        />
      </ContentNoteSlide>
    ),
    notes: 'The familiar output, in an unfamiliar place. That combination is the whole lesson of the slide.',
  },
  {
    id: 'c4-superuser',
    section: AGENDA[3],
    label: 'createsuperuser',
    element: (
      <ContentSlide
        kicker="Migrations"
        title="Create the Admin Account"
        lead="createsuperuser runs through exec as well"
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          lines={[
            { text: 'docker compose exec backend python manage.py createsuperuser', kind: 'cmd' },
            { text: 'Username: admin', kind: 'out' },
            { text: 'Email address: admin@example.com', kind: 'out' },
            { text: 'Password:', kind: 'out' },
            { text: 'Superuser created successfully.', kind: 'ok' },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'exec is already a pattern by now. Any manage.py command you have ever run goes after the service name.',
  },
  {
    id: 'c4-verify',
    section: AGENDA[3],
    label: 'Verify',
    element: (
      <ProceduralStepsSlide
        kicker="Verify"
        title="Whole App, Through Both Containers"
        lead="Everything below runs against the two containers, with no venv and no npm anywhere"
        lesson={SESSION}
        steps={[
          {
            title: 'Open localhost:8000/admin/',
            detail: 'Log in with the superuser you just created, and add a product or two',
          },
          { title: 'Open localhost:3000', detail: 'Login page appears. Register a user, then log in' },
          { title: 'Products page loads', detail: 'Straight from Django, through the API, into React' },
        ]}
      />
    ),
    notes:
      'The payoff moment of the session. Give the room time to actually do it. If a step fails, the errors section is four slides away and every failure here is in it.',
  },
  {
    id: 'c4-what-just-worked',
    section: AGENDA[3],
    label: 'What just worked',
    element: (
      <ContentSlide
        kicker="Verify"
        title="Stop and Notice What Worked"
        lead="Whole app ran with no code changes"
        lesson={SESSION}
        points={[
          { text: 'Frontend container served React', sub: 'Vite dev server, in a container' },
          { text: 'Login ran against the backend container', sub: 'Tokens in cookies, exactly as before' },
          { text: 'Products page loaded data from Django', sub: 'CORS_ALLOWED_ORIGINS still says http://localhost:3000, and still matches' },
          { text: 'The localhost address still needs explaining', tone: 'brand' },
        ]}
      />
    ),
    notes:
      'The CORS line is the clue. It still matches because the thing calling the API is the same thing it has always been. Let that hang for a beat before the next slide.',
  },
  {
    id: 'c4-paradox-resolved',
    section: AGENDA[3],
    label: 'The answer',
    element: (
      /*
        THE SENTENCE AND THE PICTURE LAND TOGETHER.

        This was a note on an otherwise empty frame, with `BrowserOutsideDocker`
        arriving on the NEXT slide. Hard rule 6 says text and its supporting
        visual are one idea and arrive together, and this is the deck's single
        most important beat: the room heard the resolution, then had to hold it
        unillustrated across a slide change before seeing the drawing that makes
        it true. The figure is the argument, so it belongs on the frame that makes
        the claim.

        The slide that followed keeps its place as the labelled walk-through of
        the same boundary, which is a second pass over one picture rather than a
        first look at a new one.
      */
      /*
        NO CALLOUT ON THIS SLIDE, AND THAT IS A SPACE DECISION AND A CONTENT ONE.

        Merging the resolution with its figure overflowed the frame by 225px:
        `BrowserOutsideDocker` is a tall two-zone drawing, and a lead plus a
        full-width note on top of it does not fit. The note was also saying the
        lead's sentence a second time, so cutting it costs the slide nothing and
        leaves one claim with one picture, which is what the frame is for.
      */
      <ContentSlide
        kicker="The odd address"
        title="Your Browser Is Outside Docker"
        lead="React code runs in your browser, and your browser was never inside a container"
        lesson={SESSION}
      >
        <BrowserOutsideDocker className="w-[840px]" />
      </ContentSlide>
    ),
    notes:
      'The resolution gets a slide to itself, with nothing else on it. Say the sentence, then stop talking. This is the single most important idea of the session.',
  },
  {
    id: 'c4-who-talks',
    section: AGENDA[3],
    label: 'Who talks to whom',
    element: (
      <ContentSlide
        kicker="The odd address"
        title="Who Talks to Whom"
        lead="Every fetch in api.js runs in the browser, outside Docker, where service names do not exist"
        lesson={SESSION}
      >
        <BrowserOutsideDocker className="mx-auto max-w-[800px]" />
      </ContentSlide>
    ),
    notes:
      'The figure of the session. Note that nothing crosses the Compose network today (R7): Django never calls the frontend. The service-name rule returns the moment a service needs another service, and the classic case, a database server, arrives later in this course.',
  },
  {
    id: 'c4-the-table',
    section: AGENDA[3],
    label: 'The rule holds',
    element: (
      <ContentNoteSlide
        kicker="The odd address"
        title="Where the Code Runs Decides the Address"
        lead="Address depends on where the calling code actually runs"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'Ask where the calling code runs',
          body: 'Never "which file is the address written in?" but "where does the code that uses this address actually run?"',
        }}
      >
        <DataTable
          columns={[{ label: 'Who is connecting' }, { label: 'Where that code runs' }, { label: 'Address to use' }]}
          rows={[
            [
              'One container to another',
              'Inside Docker, on the Compose network',
              <>
                Service name, <Code>backend:8000</Code>
              </>,
            ],
            [
              'Your browser to a container',
              'Outside Docker',
              <>
                <Code>localhost</Code> plus a published port
              </>,
            ],
          ]}
          highlight={[1]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Both rows are correct and always were. The room did not learn a wrong rule last session, they learnt half of a rule.',
  },
  {
    id: 'c4-proof',
    section: AGENDA[3],
    label: 'Proof',
    element: (
      <ContentNoteSlide
        kicker="Wrapping up"
        title="Proof the Data Is in the Volume"
        lead="Destroy both containers, create two brand new ones, and look again"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'Containers were removed, the volume was not',
          body: 'Refresh the products page and everything is still there',
        }}
      >
        <Terminal
          path={AT_ROOT}
          lines={[
            { text: 'docker compose down', kind: 'cmd' },
            { text: 'Container nxttrendz-backend-1  Removed', kind: 'out' },
            { text: 'Container nxttrendz-frontend-1 Removed', kind: 'out' },
            { text: 'docker compose up -d', kind: 'cmd' },
            { text: 'Container nxttrendz-backend-1  Started', kind: 'ok' },
            { text: 'Container nxttrendz-frontend-1 Started', kind: 'ok' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'The full-cycle proof. Brand new containers, same data. Worth doing live, because it is the claim the room is most likely to doubt.',
  },
  {
    id: 'c4-new-workflow',
    section: AGENDA[3],
    label: 'The new workflow',
    element: (
      <ContentSlide
        kicker="Wrapping up"
        title="New Daily Workflow"
        lead="One terminal instead of two"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Old habit, two terminals' }, { label: 'New habit, one' }]}
          rows={[
            [<Code>env\Scripts\activate</Code>, 'No longer needed'],
            [
              <>
                <Code>runserver</Code> and <Code>npm run dev</Code>
              </>,
              <Code>docker compose up -d</Code>,
            ],
            [<Code>python manage.py migrate</Code>, <Code>docker compose exec backend python manage.py migrate</Code>],
            [<Code>Ctrl+C</Code> , <Code>docker compose down</Code>],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'The table they will screenshot. Say that the right column is what they will type tomorrow morning.',
  },
  {
    id: 'c4-toolbox',
    section: AGENDA[3],
    label: 'Toolbox',
    element: (
      <ContentSlide
        kicker="Common errors"
        title="Debugging Toolbox"
        lead="Six commands answer most questions when something breaks"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Command' }, { label: 'What it answers' }]}
          rows={[
            [<Code>docker compose ps</Code>, 'Which services are running, and which ports are published?'],
            [<Code>docker compose logs backend</Code>, 'What is Django saying?'],
            [<Code>docker compose logs frontend</Code>, 'What is Vite saying?'],
            [<Code>docker compose exec backend env</Code>, 'Which variables did the container actually receive?'],
            [<Code>docker compose exec backend bash</Code>, 'A shell inside the backend, where ls /app/data shows the database'],
            [<Code>docker compose exec frontend sh</Code>, 'Same for the frontend, because alpine images include sh, not bash'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The reference slide. The env one is genuinely useful and under-used: it answers "did my SECRET_KEY actually arrive?" in one command.',
  },

  /* ── CLOSING FRAME (73 to 76) ──────────────────────────────────────────── */
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Takeaways',
    element: (
      <KeyTakeawaysSlide
        kicker="Key takeaways"
        title="What We Covered"
        lesson={SESSION}
         points={[
          { text: AGENDA[0], sub: 'Two terminals became one command, and no app code changed' },
          { text: AGENDA[1], sub: 'Pinned versions, a chosen base image, and a server binding' },
          { text: AGENDA[2], sub: 'Door from outside, the secret in .env, the database in a volume' },
          { text: AGENDA[3], sub: 'Migrations through exec, and why localhost is correct' },
        ]}
      />
    ),
    notes: 'Four takeaways, and the last one is the transferable idea. It will matter again at every stage of this course.',
  },
{
    id: 'next-up',
    section: 'Close',
    label: 'Next Session',
    element: (
      /*
        S1: THE NEXT SESSION IS NAMED BY WHAT IT DOES, NOT BY A TOOL. And on this
        slide it is named and NOTHING ELSE: no lead, no bullets, no preview of the
        keys. The promise lands harder as a bare title than as a list, and every
        detail that was here was already earned by the session behind it.
      */
      <SectionBreakerSlide
        kicker="Next Session"
        title="Automate Deployment using Makefile"
        lesson={SESSION}
      />
    ),
    notes:
      'Count today\u2019s keystrokes out loud: up -d --build, exec backend python manage.py migrate, exec backend python manage.py createsuperuser. Typed daily, these invite typos. Next session compresses each into make up and make migrate, with a Makefile. Title only, no subtitle and no index.',
  },
  {
    id: 'thankyou',
    section: 'Closing',
    label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
    notes: 'Closing fixture.',
  },
]
