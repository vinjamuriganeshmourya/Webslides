import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  CodeBuildSlide,
  ContentNoteSlide,
  ContentSlide,
  KeyTakeawaysSlide,
  ProceduralStepsSlide,
  QuestionSlide,
  QuizTimeSlide,
  RecapSlide,
  ScenarioSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import {
  BrowserOutsideDocker,
  CodeBlock,
  DataTable,
  ExecAnatomy,
  FileTree,
  PortPublish,
  Terminal,
  TwoRuntimes,
  VolumeShadow,
} from '@/ui'
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
 *   R1  THE PARADOX IS SET UP, HELD, AND ONLY THEN RESOLVED. Slide 44 writes
 *       `VITE_API_BASE_URL: http://localhost:8000` and slide 45 names it as a
 *       contradiction of last session's iron rule WITHOUT resolving it. The
 *       answer is slides 67 to 69. This is rule 4 of the content rules: name a
 *       later problem, never open it. Resolving it early costs the session its
 *       ending, which is the single best beat in this TR.
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
 *       below is the single source for slides 39, 42, 44, 49, 52 and 54, which
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
 *       slide 69's table on the slide that is supposed to prove it.
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
const AT_ROOT = 'C:\\nxttrendz'
const AT_BACKEND = 'C:\\nxttrendz\\backend'
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
  sqlite: '/assets/tech/sqlite.png',
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

const BACKEND_DOCKERFILE = `FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1

WORKDIR /app

COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]`

const FRONTEND_DOCKERFILE = `FROM node:20-alpine

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
      <RecapSlide
        kicker="Recap"
        title="Where we Left Off"
        lesson={SESSION}
        points={[
          { text: 'One command builds, networks and starts everything', sub: 'docker compose up, and down removes it all' },
          { text: 'Volumes survive down, and only down -v deletes them', sub: 'db_data outlived every container that wrote to it' },
          { text: 'After a code edit, up --build', sub: 'Images are frozen at build time' },
          { text: 'Service names are hostnames', sub: 'One container reaches another at backend, never localhost', tone: 'brand' },
        ]}
      />
    ),
    notes:
      'The fourth point is the one today contradicts on purpose. Land it firmly now, because the paradox on slide 45 only bites if the room is sure of this rule.',
  },
  {
    id: 'excuse-used-up',
    section: 'Opening',
    label: 'The turn',
    element: (
      <ContentNoteSlide
        kicker="Recap"
        title="The Toy Apps Were on Purpose"
        lead="Both demo apps were a few printed lines, so every idea you learnt was about Docker and nothing else"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'That excuse is now used up',
          body: (
            <>
              Today the real <Code>nxttrendz</Code> project moves into containers: the Django backend and the React
              frontend from the integration course
            </>
          ),
        }}
      >
        <TwoRuntimes />
      </ContentNoteSlide>
    ),
    notes:
      'The hinge into today. They shipped this exact pair in the integration course, so do not explain what React and Django are. The figure carries no ports and no browser: that is slide 41 and slide 68, and showing it here spoils both.',
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
        items={[
          { title: 'The Real Project Moves In', sub: 'Two terminals become one command, and no app code changes' },
          { title: 'A Dockerfile for Each Half', sub: 'Django, then React, with the details a real project adds' },
          { title: 'The Compose File, and the ports Key', sub: 'The door from outside, the secret, and the database' },
          { title: 'First Run, and Who Talks to Whom', sub: 'Migrations inside the container, and the paradox resolved' },
        ]}
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
      <ContentSlide
        kicker="Before we start"
        title="Initial Setup"
        lead="Three things before the first command of the day"
        lesson={SESSION}
        points={[
          { text: 'Open C:\\nxttrendz in VS Code', sub: 'The real project, not docker-demo' },
          { text: 'Start Docker Desktop and wait for the whale to settle', sub: 'Every command today needs the engine running' },
          { text: 'Last session\u2019s docker-demo folder stays exactly where it is', sub: 'Nothing today touches it' },
        ]}
      >
        <Terminal
          path={AT_ROOT}
          lines={[
            { text: 'docker --version', kind: 'cmd' },
            { text: 'Docker version 27.3.1, build ce12230', kind: 'out' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Wait for the room to confirm the version prints before moving on. A stopped engine produces a confusing error twenty slides later, and it is worth thirty seconds here.',
  },

  /* ── CONCEPT 1: THE REAL PROJECT MOVES IN (8 to 15) ────────────────────── */
  {
    id: 'c1-divider',
    section: 'The Real Project Moves In',
    label: 'Divider',
    element: (
      <SectionBreakerSlide
        index={1}
        title="The Real Project Moves In"
        subtitle="Same app, new packaging"
        lesson={SESSION}
      />
    ),
    notes: 'Hand over verbally: "so what actually changes when the real project moves in?"',
  },
  {
    id: 'c1-before',
    section: 'The Real Project Moves In',
    label: 'The old ritual',
    element: (
      <ContentSlide
        kicker="Before and after"
        title="How Every Day Has Started"
        lead="Two terminals, each with its own ritual, since the integration course"
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
    section: 'The Real Project Moves In',
    label: 'The new ritual',
    element: (
      <ContentNoteSlide
        kicker="Before and after"
        title="How It Starts From Today"
        lead="One command, run from the project root, and the whole stack comes up"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'Same application, same two addresses',
          body: (
            <>
              <Code>localhost:8000</Code> and <Code>localhost:3000</Code>, exactly as always. No venv to activate, no
              Node version to worry about, and the whole environment travels with the code
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
    section: 'The Real Project Moves In',
    label: 'The workspace',
    element: (
      <ContentSlide
        kicker="The starting point"
        title="Exactly What the Course Left Behind"
        lead="Nothing has been added yet. This is the project as you last used it"
        lesson={SESSION}
      >
        <FileTree
          root="C:\nxttrendz"
          entries={[
            { name: 'backend', folder: true, state: 'existing' },
            { name: 'manage.py', depth: 1, state: 'existing' },
            { name: 'requirements.txt', depth: 1, state: 'existing', note: 'about to change' },
            { name: 'myproject', depth: 1, folder: true, state: 'existing', note: 'settings.py lives here' },
            { name: 'products  users  cart', depth: 1, folder: true, state: 'existing' },
            { name: 'env', depth: 1, folder: true, state: 'existing', note: 'the venv' },
            { name: 'frontend', folder: true, state: 'existing' },
            { name: 'package.json  package-lock.json  vite.config.js', depth: 1, state: 'existing' },
            { name: 'docker-demo', folder: true, state: 'existing', note: 'last session, untouched' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Point at requirements.txt and say it is the only existing file that changes today, apart from three lines in settings.py. Everything else on this tree is untouched.',
  },
  {
    id: 'c1-nothing-changes',
    section: 'The Real Project Moves In',
    label: 'No app code changes',
    element: (
      <ContentSlide
        kicker="A promise"
        title="Not One Line of App Code"
        lead="No model, no view, no serializer, no React component changes today"
        lesson={SESSION}
        points={[
          { text: 'The application is finished', sub: 'It was finished at the end of the integration course' },
          { text: 'Only its packaging is new', sub: 'Everything today is around the app, never inside it', tone: 'brand' },
        ]}
      />
    ),
    notes:
      'Deliberately typographic. This is reassurance, and reassurance does not need a picture. Some of the room is quietly afraid Docker means rewriting their project.',
  },
  {
    id: 'c1-already-own',
    section: 'The Real Project Moves In',
    label: 'What you already own',
    element: (
      <ContentSlide
        kicker="Set expectations"
        title="What You Already Own"
        lead="Everything from the last two sessions survives contact with the real project"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'You already own' }, { label: 'Today it is applied to' }]}
          rows={[
            ['The five Dockerfile instructions', 'Django, and then React, unchanged in shape'],
            [
              <>
                <Code>services</Code> <Code>build</Code> <Code>environment</Code> <Code>depends_on</Code>{' '}
                <Code>volumes</Code>
              </>,
              'The same keys, now pointing at the real apps',
            ],
            [
              <>
                <Code>up</Code> <Code>down</Code> <Code>--build</Code> <Code>logs</Code> <Code>ps</Code>
              </>,
              <>
                The same commands, run from <Code>C:\nxttrendz</Code>
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
    section: 'The Real Project Moves In',
    label: 'Two new keys',
    element: (
      <ContentNoteSlide
        kicker="What is actually new"
        title="Exactly Two Keys Are New"
        lead="Everything else in today's Compose file is a key you already know"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'Everything else is detail, not concept',
          body: 'Pinned versions, a server binding, a secret, a database file. The half-dozen things a real project adds',
        }}
      >
        <CodeBlock
          code={`    ports:
      - "8000:8000"

    env_file:
      - .env`}
          language="yaml"
          highlight={[1, 4]}
          showLineNumbers={false}
        />
      </ContentNoteSlide>
    ),
    notes:
      'ports is the key last session ended on: "not possible until the service opens a port". env_file keeps last session\u2019s promise about secrets. Name both now and move on; each gets its own slide later.',
  },
  {
    id: 'c1-the-claim',
    section: 'The Real Project Moves In',
    label: 'The claim',
    element: (
      <ContentNoteSlide
        kicker="The idea to leave with"
        title="What Real Deployment Work Is"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'success',
          title: 'Real deployment work is exactly this',
          body: 'A pattern you already know, plus the specific details of your own project',
        }}
        points={[
          {
            text: 'So what does that pattern look like for a real Django app?',
            sub: 'That is the next section',
            tone: 'brand',
          },
        ]}
      />
    ),
    notes:
      'The quotable line of the section. Pause after it. The closing question is the handover into concept 2, so say it as a question and let the divider answer it.',
  },

  /* ── CONCEPT 2: A DOCKERFILE FOR EACH HALF (16 to 37) ──────────────────── */
  {
    id: 'c2-divider',
    section: 'A Dockerfile for Each Half',
    label: 'Divider',
    element: (
      <SectionBreakerSlide
        index={2}
        title="A Dockerfile for Each Half"
        subtitle="Backend first, then frontend"
        lesson={SESSION}
      />
    ),
    notes: 'Two Dockerfiles, one per folder. The same rule as last session: one folder, one Dockerfile.',
  },
  {
    id: 'c2-requirements-as-is',
    section: 'A Dockerfile for Each Half',
    label: 'requirements.txt as-is',
    element: (
      <ContentSlide
        kicker="The backend"
        title="requirements.txt, as It Stands"
        lead="Open backend\requirements.txt. This is what the integration course put there"
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
    section: 'A Dockerfile for Each Half',
    label: 'Question: which version',
    element: (
      <QuestionSlide
        kicker="A question first"
        question={<>Which version of Django does this file install?</>}
        qualifier="The build runs pip install -r requirements.txt, and the file names Django with no version"
        lesson={SESSION}
      />
    ),
    notes:
      'First half of the pinning question, and the easier half. Someone will say "the latest one", which is the right answer and sets up the second question. Take hands; do not answer it yourself.',
  },
  {
    id: 'c2-question-next-month',
    section: 'A Dockerfile for Each Half',
    label: 'Question: next month',
    element: (
      <QuestionSlide
        kicker="And the one that matters"
        question={<>A teammate builds the same image next month. Do they get the same Django?</>}
        lesson={SESSION}
      />
    ),
    notes:
      'The pause beat of the section. Do not answer it. Someone will say yes, and the next slide is far more useful once the room has committed to an answer out loud. Split from the previous slide deliberately: asked together, the room answers the easy half and never considers this one.',
  },
  {
    id: 'c2-pip-freeze',
    section: 'A Dockerfile for Each Half',
    label: 'pip freeze',
    element: (
      <ContentNoteSlide
        kicker="The backend"
        title="Your venv Already Knows"
        lead="No. An unpinned name means whatever version is newest that day"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'This quietly breaks the promise',
          body: 'The whole point of an image is that it is reproducible, and this file breaks that before Docker even starts',
        }}
      >
        <Terminal
          path={AT_BACKEND}
          lines={[
            { text: 'pip freeze', kind: 'cmd' },
            { text: 'Django==5.2.17', kind: 'out' },
            { text: 'django-cors-headers==4.9.0', kind: 'out' },
            { text: 'django-filter==26.1', kind: 'out' },
            { text: 'djangorestframework==3.18.0', kind: 'out' },
            { text: 'djangorestframework-simplejwt==5.5.1', kind: 'out' },
            { text: '...', kind: 'out' },
          ]}
          caption="abridged: pip also lists dependencies of your dependencies"
        />
      </ContentNoteSlide>
    ),
    notes:
      'The versions they see here are the ones their own project actually runs on. Transcript is quoted from the TR (R3), so the numbers are illustrative.',
  },
  {
    id: 'c2-pinned',
    section: 'A Dockerfile for Each Half',
    label: 'Pinned',
    element: (
      <ContentNoteSlide
        kicker="The backend"
        title="Pinned"
        lead="The same file, with the versions arrived"
        lesson={SESSION}
        note={{
          kind: 'note',
          title: 'Pin the five you chose, not the whole freeze',
          body: (
            <>
              <Code>pip freeze</Code> also prints dependencies of your dependencies, such as <Code>asgiref</Code>,{' '}
              <Code>sqlparse</Code> and <Code>PyJWT</Code>. Pinning the five you asked for is enough, and pip resolves
              the rest
            </>
          ),
        }}
      >
        <CodeBlock
          code={`Django==5.2.17
djangorestframework==3.18.0
django-filter==26.1
djangorestframework-simplejwt==5.5.1
django-cors-headers==4.9.0`}
          filename="backend\requirements.txt"
          language="text"
          highlight={[1, 2, 3, 4, 5]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Same file as slide 17, so flip back and forth once. == means exactly this version: from now on every build of this image, on any machine, in any month, installs the same Django.',
  },
  {
    id: 'c2-base-image',
    section: 'A Dockerfile for Each Half',
    label: 'The base image',
    element: (
      <ContentNoteSlide
        kicker="The backend"
        title="The Tag Is a Decision"
        lead="For two lines of print, any Python works. For a real project the tag is a decision, not a habit"
        lesson={SESSION}
        note={{
          kind: 'tip',
          title: 'Newest Python this Django was tested against',
          body: (
            <>
              Django 5.2 was released with support for Python 3.10 to 3.13, so the tag is{' '}
              <Code>python:3.13-slim</Code>
            </>
          ),
        }}
      >
        <DataTable
          columns={[{ label: 'Image tag' }, { label: 'Django 5.2 support' }]}
          rows={[
            [<Tech name="python" label="python:3.14-slim" />, 'Beyond what this Django was tested against'],
            [<Tech name="python" label="python:3.13-slim" />, 'Supported, and the newest that is'],
            [<Tech name="python" label="python:3.9-slim" />, 'Too old for Django 5.2'],
          ]}
          highlight={[1]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'The demo used 3.14-slim and it was fine, because printing works on anything. Say plainly that the habit was harmless there and is not harmless here.',
  },
  {
    id: 'c2-backend-dockerfile',
    section: 'A Dockerfile for Each Half',
    label: 'The backend Dockerfile',
    element: (
      <ContentSlide
        kicker="The backend"
        title="The Backend Dockerfile"
        lead="The first new file of the day"
        lesson={SESSION}
      >
        <CodeBlock code={BACKEND_DOCKERFILE} filename="backend\Dockerfile" language="dockerfile" />
      </ContentSlide>
    ),
    notes:
      'Show it whole first, then take it apart. Most of the room will recognise most of it, and that recognition is the point of the next slide.',
  },
  {
    id: 'c2-five-of-seven',
    section: 'A Dockerfile for Each Half',
    label: 'Five of seven',
    element: (
      <ContentSlide
        kicker="The backend"
        title="Five Lines You Have Written Before"
        lead="Base image, workdir, dependency file first for the cache rule, install, code, start command"
        lesson={SESSION}
        points={[
          { text: 'Two lines are new', sub: 'And both exist only because this is a real server, not a script', tone: 'brand' },
        ]}
      >
        <CodeBlock
          code={BACKEND_DOCKERFILE}
          filename="backend\Dockerfile"
          language="dockerfile"
          highlight={[3, 11]}
        />
      </ContentSlide>
    ),
    notes:
      'Same panel as the previous slide with two lines lit. Ask the room to name the two before you reveal which they are.',
  },
  {
    id: 'c2-env-instruction',
    section: 'A Dockerfile for Each Half',
    label: 'ENV',
    element: (
      <ContentNoteSlide
        kicker="New line 1"
        title="ENV, a New Instruction"
        lead="It sets an environment variable inside the image, permanently"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'The same mechanism you already met',
          body: (
            <>
              Compose\u2019s <Code>environment:</Code> key injects a variable when the container starts.{' '}
              <Code>ENV</Code> bakes one in at build time
            </>
          ),
        }}
      >
        <CodeBlock code={`ENV PYTHONUNBUFFERED=1`} language="dockerfile" showLineNumbers={false} />
      </ContentNoteSlide>
    ),
    notes:
      'The sixth instruction they now know, after FROM, WORKDIR, COPY, RUN and CMD. Name it as such: the list is short and finite, and that is reassuring.',
  },
  {
    id: 'c2-unbuffered-why',
    section: 'A Dockerfile for Each Half',
    label: 'Why unbuffered',
    element: (
      <ContentNoteSlide
        kicker="New line 1"
        title="Why That Line Exists"
        lead="It tells Python to print immediately instead of collecting output in a buffer"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'A genuinely confusing hour, prevented by one line',
          body: (
            <>
              Without it, <Code>docker compose logs backend</Code> can show nothing at all while Django is running
              perfectly well
            </>
          ),
        }}
      >
        <Terminal
          path={AT_ROOT}
          lines={[
            { text: 'docker compose logs backend', kind: 'cmd' },
            { text: '', kind: 'out' },
          ]}
          caption="without PYTHONUNBUFFERED"
        />
      </ContentNoteSlide>
    ),
    notes:
      'An empty log panel is the honest picture of this symptom. The room will meet it again in the debugging section, where logs are the first tool reached for.',
  },
  {
    id: 'c2-binding',
    section: 'A Dockerfile for Each Half',
    label: 'The binding',
    element: (
      <ContentNoteSlide
        kicker="New line 2"
        title="The Address in the CMD"
        lead="Plain runserver listens on 127.0.0.1, which inside a container means accept connections only from inside this container"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'The symptom is maddening',
          body: 'The logs insist the server is running, and the browser says connection reset',
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
    section: 'A Dockerfile for Each Half',
    label: 'Two questions',
    element: (
      <ContentNoteSlide
        kicker="New line 2"
        title="Two Questions, Two Answers"
        lead="Nobody ever types 0.0.0.0 into a browser. These are two different questions"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'The rule to keep',
          body: 'Inside a container, a server always binds to 0.0.0.0',
        }}
      >
        <DataTable
          columns={[{ label: 'Question' }, { label: 'Answer' }]}
          rows={[
            [
              'What do I type in the browser?',
              <>
                <Code>localhost:8000</Code>, unchanged, all course
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
    id: 'c2-runserver-note',
    section: 'A Dockerfile for Each Half',
    label: 'Aside: gunicorn',
    element: (
      <ContentSlide
        kicker="An aside"
        title="A Note on runserver"
        lead="runserver is Django's development server, used throughout this course for learning"
        lesson={SESSION}
        points={[
          { text: 'Production swaps it for a production-grade server', sub: 'Commonly gunicorn' },
          { text: 'The CMD changes, and gunicorn joins requirements.txt', sub: 'Everything else in this session stays identical' },
        ]}
      />
    ),
    notes:
      'Keep this short. It exists so nobody leaves thinking runserver is a deployment answer. R8: no session number, just "later in this course".',
  },
  {
    id: 'c2-backend-dockerignore',
    section: 'A Dockerfile for Each Half',
    label: 'Backend .dockerignore',
    element: (
      <ContentSlide
        kicker="The backend"
        title="Its .dockerignore"
        lead="Next to the Dockerfile, in the same folder"
        lesson={SESSION}
      >
        <CodeBlock
          code={`env/
__pycache__/
*.pyc
db.sqlite3
data/
.env
.git/
.vscode/`}
          filename="backend\.dockerignore"
          language="text"
        />
      </ContentSlide>
    ),
    notes: 'The first five lines are last session\u2019s file, unchanged. Three are new, and one of the old ones earns its keep today.',
  },
  {
    id: 'c2-dockerignore-earns',
    section: 'A Dockerfile for Each Half',
    label: 'One line earns its keep',
    element: (
      <ContentNoteSlide
        kicker="The backend"
        title="One Line Earns Its Keep"
        lead="Five of these lines are last session's file, and three are new"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'warning',
          title: 'db.sqlite3 is now your real dev database',
          body: 'Months of test data that must not be frozen into every image and shipped to every machine',
        }}
      >
        <DataTable
          columns={[{ label: 'New entry' }, { label: 'Why it must not enter the image' }]}
          rows={[
            [
              <Tech name="sqlite" label="data/" />,
              'The folder that database is about to move into, and the same rule applies',
            ],
            [
              <Code>.env</Code>,
              'Secrets. The real .env lives at the project root, outside this build entirely, and this guards a stray copy',
            ],
            [<Code>.vscode/</Code>, 'Editor settings, the entry last session\u2019s frontend list already carried'],
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Where the container\u2019s data does live is slide 52. Do not answer it here, just promise it.',
  },
  {
    id: 'c2-which-node',
    section: 'A Dockerfile for Each Half',
    label: 'Which Node',
    element: (
      <ContentNoteSlide
        kicker="The frontend"
        title="The Project Already Answered"
        lead="The demo picked node:22-alpine because any Node prints two lines. The real project is pickier, and it already wrote its answer down"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'The project\u2019s own files decide the base image',
          body: (
            <>
              <Code>pip freeze</Code> decided the Python side, and <Code>.nvmrc</Code> decides the Node side. Same
              lesson twice in one session
            </>
          ),
        }}
      >
        <CodeBlock code={`v20.9.0`} filename="frontend\.nvmrc" language="text" showLineNumbers={false} />
      </ContentNoteSlide>
    ),
    notes:
      'That file has been telling every developer\u2019s nvm which Node this project runs on. The tag becomes node:20-alpine, read from the same source of truth.',
  },
  {
    id: 'c2-frontend-dockerfile',
    section: 'A Dockerfile for Each Half',
    label: 'The frontend Dockerfile',
    element: (
      <ContentSlide
        kicker="The frontend"
        title="The Frontend Dockerfile"
        lead="Last session's Node Dockerfile with two upgrades"
        lesson={SESSION}
      >
        <CodeBlock code={FRONTEND_DOCKERFILE} filename="frontend\Dockerfile" language="dockerfile" highlight={[4, 9]} />
      </ContentSlide>
    ),
    notes:
      'The two lit lines are the two upgrades: the lockfile comes too, and the CMD starts the Vite dev server. Next slide takes the first one apart.',
  },
  {
    id: 'c2-lockfile',
    section: 'A Dockerfile for Each Half',
    label: 'The lockfile',
    element: (
      <ContentNoteSlide
        kicker="The frontend"
        title="Why the Lockfile Comes Too"
        lead="package.json says a range, which is npm's version of an unpinned requirement"
        lesson={SESSION}
        note={{
          kind: 'tip',
          title: 'The Node twin of pinning',
          body: (
            <>
              <Code>package-lock.json</Code> is where npm records the exact version of every package it installed,
              sub-dependencies included
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
      'The caret is the whole argument. Point at it: it means "1.19.0 or any compatible newer one", which is the same reproducibility hole slide 18 asked about.',
  },
  {
    id: 'c2-npm-ci-note',
    section: 'A Dockerfile for Each Half',
    label: 'Aside: npm ci',
    element: (
      <ContentSlide
        kicker="An aside"
        title="A Note on npm ci"
        lead="Automation servers use npm ci instead of npm install"
        lesson={SESSION}
        points={[
          { text: 'It installs exactly the lockfile', sub: 'And fails loudly if package.json disagrees with it' },
          { text: 'It appears again when this course reaches CI and CD', sub: 'The same reproducibility argument, one level up' },
        ]}
      />
    ),
    notes: 'Short, and no session number (R8). Also mention that the Vite dev server is for development, like runserver.',
  },
  {
    id: 'c2-vite-binding',
    section: 'A Dockerfile for Each Half',
    label: 'Vite binding',
    element: (
      <ContentNoteSlide
        kicker="The frontend"
        title="The Same Rule, Already Solved"
        lead="The binding rule applies to every server in a container, so where is the frontend's 0.0.0.0?"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'Same rule, two homes',
          body: 'Django needed the address on the command line, and Vite carries it in its config file',
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
        />
      </ContentNoteSlide>
    ),
    notes:
      'This line has been sitting in their config all course. Say it: now you know what it was for. Small moment, and the room enjoys it.',
  },
  {
    id: 'c2-frontend-dockerignore',
    section: 'A Dockerfile for Each Half',
    label: 'Frontend .dockerignore',
    element: (
      <ContentNoteSlide
        kicker="The frontend"
        title="Its .dockerignore"
        lead="Six lines, and the first one matters far more today than it did last week"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'Last session\u2019s warning, now with teeth',
          body: (
            <>
              Then <Code>node_modules/</Code> was an empty folder excluded on principle. Today it is hundreds of
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
    section: 'A Dockerfile for Each Half',
    label: 'Two buildable images',
    element: (
      <ContentSlide
        kicker="Where we are"
        title="Two Buildable Images"
        lead="Both real folders now hold the same pair the demo folders held last session"
        lesson={SESSION}
        points={[
          { text: 'What is missing is the file that runs them together', tone: 'brand' },
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
    id: 'c3-divider',
    section: 'The Compose File',
    label: 'Divider',
    element: (
      <SectionBreakerSlide index={3} title="The Compose File" subtitle="One file, one level up" lesson={SESSION} />
    ),
    notes: 'Hand over: "one file describes both, so where does it live?"',
  },
  {
    id: 'c3-skeleton',
    section: 'The Compose File',
    label: 'The skeleton',
    element: (
      <CodeBuildSlide
        kicker="The Compose file"
        title="The Same File, One Level Up"
        lead="In C:\nxttrendz, above both folders, because it is the one file that describes both"
        lesson={SESSION}
        code={COMPOSE_STAGES[0]}
        filename="docker-compose.yml"
        highlight={hl(COMPOSE_STAGES[0], 'build: ./')}
        annotation={{
          key: 'build:',
          body: 'Last session\u2019s file stripped back to its frame, with the build paths pointing at the real Django and React folders',
        }}
      />
    ),
    notes:
      'From here on, every command runs from C:\\nxttrendz. Four additions turn this skeleton into the real stack, and two of them are promises last session made.',
  },
  {
    id: 'c3-locked-door',
    section: 'The Compose File',
    label: 'The locked door',
    element: (
      <ContentNoteSlide
        kicker="The new key"
        title="Last Session's Locked Door"
        lead="This is how the last session ended, and today's new key is what opens it"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'info',
          title: 'From outside Docker',
          body: 'A container is not possible to reach until the service opens a port',
        }}
        points={[{ text: 'ports is that key', tone: 'brand' }]}
      />
    ),
    notes:
      'A direct callback to how last session ended. If the room does not remember the sentence, that is fine: the next slide draws it.',
  },
  {
    id: 'c3-ports-anatomy',
    section: 'The Compose File',
    label: 'ports anatomy',
    element: (
      <ContentSlide
        kicker="The new key"
        title="ports: Host Side, Container Side"
        lead="It publishes a container's port on the host machine"
        lesson={SESSION}
      >
        <PortPublish />
      </ContentSlide>
    ),
    notes:
      'The figure of this concept. The left number is the address the outside world uses, the right is where the app actually listens inside. Two different places, and the room reads them as one thing repeated.',
  },
  {
    id: 'c3-both-publish',
    section: 'The Compose File',
    label: 'Both publish',
    element: (
      <CodeBuildSlide
        kicker="The new key"
        title="Both Services Publish"
        lead="Each service opens the port its own server already listens on"
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
          title: 'Deliberately identical on both sides',
          body: 'So every address from the integration course keeps working unchanged, including the http://localhost:3000 already sitting in CORS_ALLOWED_ORIGINS',
        }}
      />
    ),
    notes:
      'The CORS point is why the numbers match rather than being chosen freely. It is also the first hint of the paradox: CORS still matches, because the thing calling the API is still the browser.',
  },
  {
    id: 'c3-ports-note',
    section: 'The Compose File',
    label: 'Two notes on ports',
    element: (
      <ContentNoteSlide
        kicker="The new key"
        title="Two Notes on ports"
        lesson={SESSION}
        points={[
          {
            text: 'The two numbers may differ',
            sub: '"8001:8000" publishes Django\u2019s 8000 as localhost:8001, useful when something already occupies 8000',
          },
        ]}
        note={{
          kind: 'info',
          title: 'This is why 0.0.0.0 mattered',
          body: 'Publishing opens the door on the host, and the server inside must also accept connections arriving through it. Two halves of one journey',
        }}
      />
    ),
    notes:
      'The callout pays off slide 27 and is load-bearing, not an aside. Publishing without binding gives you the connection-reset error in the debugging section.',
  },
  {
    id: 'c3-frontend-env',
    section: 'The Compose File',
    label: 'Frontend environment',
    element: (
      <CodeBuildSlide
        kicker="The frontend's address"
        title="Telling the Frontend Where"
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
    section: 'The Compose File',
    label: 'The paradox',
    element: (
      <ScenarioSlide
        kicker="Read that value again"
        title="An Entire Session Said Otherwise"
        situation="The Compose file now says VITE_API_BASE_URL: http://localhost:8000"
        lesson={SESSION}
        beats={[
          {
            label: 'Last session\u2019s iron rule',
            detail: 'Service names are hostnames. One container reaches another at backend:8000, never localhost',
          },
          {
            label: 'The number one multi-container mistake',
            detail: 'Using localhost between containers was named as exactly that, at length',
          },
          {
            label: 'And here it is anyway, on purpose, and it is correct',
            detail: 'Hold that paradox. It resolves at the end of the session, and the answer is the most important idea today',
          },
        ]}
      />
    ),
    notes:
      'R1, and content rule 4: name the problem, do not open it. Do NOT let a confident learner resolve this now. If someone gets it right, say "hold that thought, you are ahead of us" and move on. The payoff is slide 67.',
  },
  {
    id: 'c3-the-secret',
    section: 'The Compose File',
    label: 'The secret',
    element: (
      <ContentNoteSlide
        kicker="The secret"
        title="In Plain Sight"
        lead="Look at what the integration course left in backend\myproject\settings.py"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'Committed to Git, in plain sight',
          body: (
            <>
              <Tech name="git" /> That file travels with the project, and anyone who can see the repository can see
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
    section: 'The Compose File',
    label: 'Step 1',
    element: (
      <ContentSlide
        kicker="The secret · step 1 of 3"
        title="Move It Out"
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
    section: 'The Compose File',
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
      'Two lines: the import at the top of the file, and the key read from the environment. The third settings line is the database, on slide 52.',
  },
  {
    id: 'c3-env-step3',
    section: 'The Compose File',
    label: 'Step 3',
    element: (
      <CodeBuildSlide
        kicker="The secret · step 3 of 3"
        title="The env_file Key"
        lead="The second of the two new keys, and the one that keeps last session's promise"
        lesson={SESSION}
        code={COMPOSE_STAGES[3]}
        filename="docker-compose.yml"
        highlight={hl(COMPOSE_STAGES[3], 'env_file:', '- .env')}
        annotation={{
          key: 'env_file:',
          body: 'Hands every variable in the named file to this container',
          replaces: 'a secret written into a file that travels',
        }}
      />
    ),
    notes: 'The second of the two new keys. Both are now on the file, and the rest of the session is detail.',
  },
  {
    id: 'c3-two-injectors',
    section: 'The Compose File',
    label: 'environment vs env_file',
    element: (
      <ContentSlide
        kicker="The secret"
        title="Two Keys Inject Variables"
        lead="The split between them is the lesson"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Key' }, { label: 'Carries' }, { label: 'Lives in a file that travels?' }]}
          rows={[
            [<Code>environment:</Code>, 'Values safe to publish, such as addresses and modes', 'Yes, written in docker-compose.yml'],
            [<Code>env_file:</Code>, 'Secrets', 'No, it points at .env, which travels nowhere'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Two rows, because the confusion is exactly two things. The frontend\u2019s address is safe to publish, and the Django secret key is not.',
  },
  {
    id: 'c3-gitignore-warning',
    section: 'The Compose File',
    label: 'gitignore the .env',
    element: (
      <ContentNoteSlide
        kicker="The secret"
        title="The .env Must Never Travel"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'warning',
          title: 'Add .env to C:\\nxttrendz\\.gitignore',
          body: 'Create that file if the project root does not have one yet. The frontend\u2019s own .gitignore guards only frontend\\.env, not this new file',
        }}
        points={[
          {
            text: 'Committing .env exposes the secret to anyone who can see the repository',
            sub: 'One of the most common real-world leaks',
          },
          {
            text: 'No image build can sweep the root .env in',
            sub: 'It sits outside both build contexts, and the .dockerignore line guards a stray copy inside backend\\',
          },
        ]}
      />
    ),
    notes:
      'A habit, not a snippet, so no code panel. Also worth saying: DEBUG and ALLOWED_HOSTS get the same treatment when the app heads to a real server, later in this course.',
  },
  {
    id: 'c3-database-moves',
    section: 'The Compose File',
    label: 'The database moves',
    element: (
      <ContentSlide
        kicker="The database"
        title="Into the Volume"
        lead="Last session's line, doing real work. The third settings edit points Django at it: BASE_DIR / 'data' / 'db.sqlite3'"
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
          fontSize={13}
          className="mr-auto w-[760px]"
        />
      </ContentSlide>
    ),
    notes:
      'The promise from last session, kept: "next session the real Django project\u2019s database file lives in exactly this folder". Say that the volume is the one place that outlives containers, and point at BOTH lit `volumes:` keys: the service mounts it, the block at the bottom declares it. The container\u2019s database starts empty, because your laptop\u2019s db.sqlite3 stays on your laptop; what an empty database needs first is the next section.',
  },
  {
    id: 'c3-why-not-app',
    section: 'The Compose File',
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
          body: 'It would serve that first copy forever: every rebuilt image silently shadowed, and --build apparently doing nothing',
        }}
      >
        <VolumeShadow act={2} className="mx-auto max-w-[760px]" />
      </ContentNoteSlide>
    ),
    notes:
      'The database gets its own sub-folder so the code stays in the image, where rebuilds can replace it. This symptom looks identical to the frozen-image trap, which is why it needs a picture.',
  },
  {
    id: 'c3-complete-file',
    section: 'The Compose File',
    label: 'The complete file',
    element: (
      <ContentSlide
        kicker="The Compose file"
        title="Read It as a Sentence"
        lead="Six files created, two edited, one .gitignore line, and not a single line of application code touched"
        lesson={SESSION}
      >
        {/*
          A ContentNoteSlide here overflowed the frame by 170px: the finished
          file plus a callout is simply more than one slide holds. The callout's
          claim was the better half, so it became the lead, and the file gets the
          whole well at 14px. The next slide carries the inventory.
        */}
        <CodeBlock
          code={COMPOSE_STAGES[4]}
          filename="docker-compose.yml"
          language="yaml"
          fontSize={13}
          /*
            LEFT-ALIGNED AND NARROW, AND THAT IS THE FIX.

            Full width, this panel is ~496px tall and its top lands at y=193,
            inside the instructor-video rectangle. Shrinking the font enough to
            clear it would take 11px, which nobody can read from the back.

            The rectangle starts at x=913, so a panel that ends before it can be
            as tall as the well allows. At 760px the longest line here
            (`VITE_API_BASE_URL: http://localhost:8000`, 46 characters) still
            fits comfortably at 14px.
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
    section: 'The Compose File',
    label: "What's on disk now",
    element: (
      <ContentSlide
        kicker="The Compose file"
        title="Everything Today Has Created"
        lead="Time to run it"
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
    section: 'First Run',
    label: 'Divider',
    element: (
      <SectionBreakerSlide index={4} title="First Run" subtitle="And the paradox, resolved" lesson={SESSION} />
    ),
    notes: 'Hand over: "what happens the first time we run it?"',
  },
  {
    id: 'c4-up-build',
    section: 'First Run',
    label: 'up --build',
    element: (
      <ContentSlide kicker="First run" title="docker compose up --build"
        lead="The first run builds both images, then creates the network, the volume and both containers"
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
          caption="abridged: both servers' startup logs follow, and we read them next"
        />
      </ContentSlide>
    ),
    notes:
      'Network, volume and both containers, in that order, exactly as last session. Transcript quoted from the TR (R3). The build takes real minutes the first time, so this is a good moment for a question.',
  },
  {
    id: 'c4-it-stays-up',
    section: 'First Run',
    label: 'It stays up',
    element: (
      <ContentNoteSlide
        kicker="First run"
        title="Then, Nothing"
        lead="The prompt does not come back"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'Every container in this course so far printed its lines and exited',
          body: 'These two are servers. They run until told to stop, exactly as runserver and npm run dev always held their terminals',
        }}
        points={[
          { text: 'Which is why detached mode stops being optional today', tone: 'brand' },
        ]}
      />
    ),
    notes:
      'The absence is the observation, so a bare slide is honest here. Let the silence sit for a second before explaining it.',
  },
  {
    id: 'c4-detached',
    section: 'First Run',
    label: 'Detached',
    element: (
      <ContentSlide
        kicker="First run"
        title="The Daily Habit"
        lead="Ctrl+C to stop, then start it detached"
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
      'ps is no longer empty after the run: Up, not Exited (0), and the PORTS column shows both published doors. That column is slide 41\u2019s figure, in text.',
  },
  {
    id: 'c4-read-logs-first',
    section: 'First Run',
    label: 'Read the logs',
    element: (
      <ContentNoteSlide
        kicker="Migrations"
        title="Read the Logs Before the Browser"
        lead="Django's startup log already announced the next step"
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
    section: 'First Run',
    label: 'Why empty',
    element: (
      <ContentSlide
        kicker="Migrations"
        title="Of Course It Is Empty"
        lead="The volume is brand new, so the database has no tables, not even Django's own"
        lesson={SESSION}
        points={[
          { text: 'Your laptop\u2019s db.sqlite3 stayed on your laptop', sub: 'The .dockerignore made sure of it, and that is correct behaviour' },
          { text: 'The models must be migrated, exactly like day one of the Django course', tone: 'brand' },
        ]}
      />
    ),
    notes: 'Name it as correct behaviour, not data loss. Someone always thinks their data has been deleted.',
  },
  {
    id: 'c4-cant-run-here',
    section: 'First Run',
    label: 'Not on your laptop',
    element: (
      <ContentNoteSlide
        kicker="Migrations"
        title="You Cannot Run It Here"
        lead="Typing the familiar command in your own terminal fails"
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
    section: 'First Run',
    label: 'exec anatomy',
    element: (
      <ContentSlide
        kicker="Migrations"
        title="exec Runs It Inside"
        lead="The one new command of the session"
        lesson={SESSION}
      >
        <ExecAnatomy />
      </ContentSlide>
    ),
    notes:
      'Three parts, and the third is the command they have typed since the Django course. That is the payoff: exec is not a new way to migrate, it is a way to reach the place where migrate already works.',
  },
  {
    id: 'c4-migrate',
    section: 'First Run',
    label: 'migrate',
    element: (
      <ContentNoteSlide
        kicker="Migrations"
        title="39 Migrations, Applied"
        lead="The familiar output, in a place it has never run before"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'Every table landed inside the volume',
          body: (
            <>
              In <Code>/app/data/db.sqlite3</Code>, which is the one place that outlives containers
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
          caption="abridged: 39 migrations apply, one line each"
        />
      </ContentNoteSlide>
    ),
    notes: 'The familiar output, in an unfamiliar place. That combination is the whole lesson of the slide.',
  },
  {
    id: 'c4-superuser',
    section: 'First Run',
    label: 'createsuperuser',
    element: (
      <ContentSlide
        kicker="Migrations"
        title="And the Admin Account"
        lead="The same shape, one command"
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
    section: 'First Run',
    label: 'Verify',
    element: (
      <ProceduralStepsSlide
        kicker="Verify"
        title="The Whole App, Through Both Containers"
        lead="Everything below runs against the two containers, with no venv and no npm anywhere"
        lesson={SESSION}
        steps={[
          {
            title: 'Open localhost:8000/admin/',
            detail: 'Log in with the superuser you just created, and add a product or two',
          },
          { title: 'Open localhost:3000', detail: 'The login page appears. Register a user, then log in' },
          { title: 'The products page loads', detail: 'Straight from Django, through the API, into React' },
        ]}
      />
    ),
    notes:
      'The payoff moment of the session. Give the room time to actually do it. If a step fails, the errors section is four slides away and every failure here is in it.',
  },
  {
    id: 'c4-what-just-worked',
    section: 'First Run',
    label: 'What just worked',
    element: (
      <ContentSlide
        kicker="Verify"
        title="Stop and Notice What Worked"
        lead="Without one line of application code changing"
        lesson={SESSION}
        points={[
          { text: 'React served from one container', sub: 'The Vite dev server, in a container' },
          { text: 'JWT login against the other', sub: 'Tokens in cookies, exactly as before' },
          { text: 'Products fetched over CORS', sub: 'CORS_ALLOWED_ORIGINS still says http://localhost:3000, and still matches' },
          { text: 'Which is the paradox, and it is time to resolve it', tone: 'brand' },
        ]}
      />
    ),
    notes:
      'The CORS line is the clue. It still matches because the thing calling the API is the same thing it has always been. Let that hang for a beat before the next slide.',
  },
  {
    id: 'c4-paradox-resolved',
    section: 'First Run',
    label: 'The resolution',
    element: (
      <ContentNoteSlide
        kicker="The paradox"
        title="The Frontend Container Only Delivers"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'success',
          title: 'The code runs in your browser, and your browser is not inside Docker',
          body: 'The frontend container only delivers the React code to it',
        }}
      />
    ),
    notes:
      'The resolution gets a slide to itself, with nothing else on it. Say the sentence, then stop talking. This is the single most important idea of the session.',
  },
  {
    id: 'c4-who-talks',
    section: 'First Run',
    label: 'Who talks to whom',
    element: (
      <ContentSlide
        kicker="The paradox"
        title="Who Talks to Whom"
        lead="Every fetch in api.js executes in the browser, outside Docker, where service names do not exist"
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
    section: 'First Run',
    label: 'The rule holds',
    element: (
      <ContentNoteSlide
        kicker="The paradox"
        title="The Rule Was Never Broken"
        lead="Last session's table had a locked second row. Today it gets its real answer"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'The question to ask',
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
                The service name, <Code>backend:8000</Code>
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
    section: 'First Run',
    label: 'Proof',
    element: (
      <ContentNoteSlide
        kicker="Wrapping up"
        title="Proof the Data Is in the Volume"
        lead="Destroy both containers, create two brand new ones, and look again"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'Containers died, the volume did not',
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
    section: 'First Run',
    label: 'The new workflow',
    element: (
      <ContentSlide
        kicker="Wrapping up"
        title="The New Daily Workflow"
        lead="One terminal instead of two"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Old habit, two terminals' }, { label: 'New habit, one' }]}
          rows={[
            [<Code>env\Scripts\activate</Code>, 'gone'],
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
    id: 'c4-errors',
    section: 'First Run',
    label: 'Five errors',
    element: (
      <ContentSlide
        kicker="Common errors"
        title="Five Errors, and How to Read Them"
        lead="Every one of these is an idea from today, failing"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Symptom' }, { label: 'Cause' }, { label: 'Fix' }]}
          rows={[
            ['address already in use', 'An old runserver or npm run dev still holding the port', 'Close the old terminals, or publish as "8001:8000"'],
            ['no such table', 'Migrations have not run against the new empty volume', 'exec backend python manage.py migrate'],
            ['Logs fine, connection reset', 'The CMD is missing 0.0.0.0:8000', 'Fix the Dockerfile, then up -d --build'],
            ['ERR_NAME_NOT_RESOLVED on backend:8000', 'The browser is outside Docker and cannot resolve a service name', 'Set VITE_API_BASE_URL to http://localhost:8000'],
            ['Edited code, nothing changed', 'Images are frozen at build time', 'up -d --build'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Row four is slide 69\u2019s table met in the wild, and the error names itself. Row five is the third session in a row this trap has appeared, so call that out.',
  },
  {
    id: 'c4-toolbox',
    section: 'First Run',
    label: 'Toolbox',
    element: (
      <ContentSlide
        kicker="Common errors"
        title="The Debugging Toolbox"
        lead="When something is wrong, these six answer almost everything"
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
            [<Code>docker compose exec frontend sh</Code>, 'The same for the frontend, because alpine images ship sh, not bash'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The reference slide. The env one is genuinely useful and under-used: it answers "did my SECRET_KEY actually arrive?" in one command.',
  },

  /* ── CLOSING FRAME (73 to 76) ──────────────────────────────────────────── */
  {
    id: 'recap',
    section: 'Closing',
    label: 'Recap',
    element: (
      <RecapSlide
        kicker="Recap"
        title="What We Covered"
        lesson={SESSION}
        points={[
          { text: 'The real project moved in', sub: 'Two terminals became one command, and no app code changed' },
          { text: 'A Dockerfile for each half', sub: 'Pinned versions, a chosen base image, and a server binding' },
          { text: 'The Compose file, and the ports key', sub: 'The door from outside, the secret in .env, the database in a volume' },
          { text: 'First run, and who talks to whom', sub: 'Migrations through exec, and the paradox resolved' },
        ]}
      />
    ),
    notes: 'The same four wordings as the agenda and the dividers, restated as outcomes.',
  },
  {
    id: 'quiz-time',
    section: 'Closing',
    label: 'Quiz time',
    element: (
      <QuizTimeSlide
        subtitle="Two Dockerfiles, one Compose file, and one address that broke the rule on purpose"
        lesson={SESSION}
      />
    ),
    notes:
      'The checkpoint, immediately before the takeaways. The subtitle names the three things the session built, and the last clause is the paradox: if the room cannot say why the frontend is told localhost:8000 rather than backend:8000, the most important idea of the session did not land, and the takeaways will paper over it. Hand over to the quiz component; this frame carries no question by design.',
  },
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Takeaways',
    element: (
      <KeyTakeawaysSlide
        kicker="Key takeaways"
        title="What to Remember"
        lesson={SESSION}
        points={[
          { text: 'Inside a container, a server always binds to 0.0.0.0', sub: 'It is a door policy, never an address you visit' },
          { text: 'ports opens the door from outside; service names work only inside', sub: 'Two answers to two different questions' },
          { text: 'Secrets go in .env, never in a file that travels', sub: 'environment: for what is safe to publish, env_file: for what is not' },
          { text: 'Always ask where the code that uses an address actually runs', sub: 'That question answers both halves of today', tone: 'brand' },
        ]}
      />
    ),
    notes: 'Four takeaways, and the last one is the transferable idea. It will matter again at every stage of this course.',
  },
  {
    id: 'next-session',
    section: 'Closing',
    label: 'Next session',
    element: <SectionBreakerSlide title="Automate Deployment using Makefile" lesson={SESSION} />,
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
