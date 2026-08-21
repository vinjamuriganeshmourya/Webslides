import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  CodeBuildSlide,
  ContentNoteSlide,
  ContentSlide,
  FeedbackSlide,
  KeyTakeawaysSlide,
  PracticeSlide,
  QuizTimeSlide,
  RecapSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import {
  AnalogyMap,
  Callout,
  Card,
  CardGrid,
  CodeBlock,
  ComposeNetwork,
  DataTable,
  FileTree,
  HandRitual,
  OneProcessRule,
  Orchestra,
  StackUp,
  Terminal,
  TwoRuntimes,
  VolumeSurvival,
  YamlNesting,
} from '@/ui'
import { colors } from '@/design/tokens'

/**
 * Deployment · Session 3 "Docker Compose for Multi-Container Apps"
 *
 * Content is the signed-off plan at
 *   `Web Slides/django_deployement_course/session_plans/deployement_session_3/plan.md`
 * (STATUS: SIGNED OFF 2026-08-20, concept 1 compressed to the comparison),
 * sourced from the TR doc at
 *   `/home/nxtwave/docker_jenkins_aws/03_docker_compose_multi_container.md`
 * after the eight TR patches recorded in that plan's §6.
 *
 * The build rules for this session, S1 to S13, live in
 *   `Web Slides/django_deployement_course/workflow/skills/session-3-deck/SKILL.md`
 * together with the running feedback log. Read that file before editing this
 * one. The five that bite hardest while transcribing:
 *
 *   S1  SCOPE. Still problem 1. No published port, no `ports:` key, no browser
 *       reaching a container, no server, no public URL. `docker compose up` runs
 *       two scripts that print and exit. Where the TR points at the next
 *       session, the slide says "later in this course" and the tool name lives
 *       in `notes`.
 *
 *   S5  THE YAML IS BUILT ONE KEY PER SLIDE, THEN SHOWN WHOLE. `COMPOSE` below
 *       is the single source for all six of those slides, which is why it is an
 *       array of blocks and not six string literals.
 *
 *   S6  NO KEY OR ADDRESS BEFORE ITS OWN SLIDE. `http://backend:8000` is
 *       written on the `environment:` slide and NOT explained there. Concept 4
 *       explains it. Explaining hostnames early costs the deck its ending.
 *
 *   S7  EXPLAIN THE COMMAND, THEN SHOW THE TRANSCRIPT. Carried over from
 *       Session 2's R10, because it worked.
 *
 *  S13  CONCEPT 1 IS A READING SECTION, NOT A TYPING SECTION. The room does not
 *       create the Node files one per slide. Slide 15 shows both files over the
 *       role mapping, 16 shows the finished Dockerfile whole, and 17's
 *       line-by-line table is the payoff. Compressed deliberately at sign-off.
 *
 * ONE HONESTY NOTE, and it is load-bearing. Every transcript in this deck is
 * QUOTED FROM THE TR, not captured: Docker Desktop cannot run on the capture
 * machine (Hyper-V/HCS is unavailable inside VirtualBox), the same blocker that
 * left Sessions 1 and 2 quoted. Image IDs, sizes and timings are illustrative,
 * and the speaker notes say so on every slide that shows one. Swapping a real
 * transcript in later needs no layout change, because `Terminal` takes the same
 * lines either way.
 */

export const dockerComposeMeta: DeckMeta = {
  title: 'Docker Compose for Multi-Container Apps',
  course: 'React + Django Integration · Deployment',
  lesson: 'Docker Compose for Multi-Container Apps',
  presenter: 'NxtWave Instructor',
}

/** Footer text on every slide: the session name, never "Session 3". */
const SESSION = 'Docker Compose for Multi-Container Apps'

/**
 * WHERE EVERY COMMAND IN THIS SESSION RUNS.
 *
 * Session 2 ran everything from `docker-demo`, which then held four loose files.
 * Today that folder holds two application folders and the compose file, so the
 * prompt path is doing real teaching work on three different slides:
 *
 *   BUILD_FE / BUILD_BE  the two `docker build` slides, one per app folder,
 *                        because a build must only ever see its own app's files
 *   CWD                  every `docker compose` command, because Compose reads
 *                        `docker-compose.yml` from the folder you stand in
 *
 * That last one is why slide 58 exists at all: run it one level up and Compose
 * says `no configuration file provided`. Never simplify these three to one path.
 */
const PROJECT = 'C:\\nxttrendz'
const CWD = `${PROJECT}\\docker-demo`
const BUILD_BE = `${CWD}\\backend`
const BUILD_FE = `${CWD}\\frontend`

/* ------------------------------------------------------------------ */
/* Shared slide furniture                                              */
/* ------------------------------------------------------------------ */

/** Inline code, for the many `docker compose up` / `depends_on` mentions. */
function Code({ children }: { children: ReactNode }) {
  return (
    <span
      /*
        `whitespace-nowrap` is load-bearing. Without it a command inside a
        sentence wraps at its spaces, so `python manage.py runserver` rendered as
        "python manage.py" on one line and "runserver" on the next, and a reader
        who scans for a command to type sees two fragments instead of one. An
        identifier is a single token; it wraps as a unit or not at all.
      */
      className="whitespace-nowrap rounded-md px-1.5 py-0.5 font-mono"
      style={{ fontSize: '0.9em', background: 'rgba(11,95,255,0.10)', color: colors.brandDark }}
    >
      {children}
    </span>
  )
}

/** A technology, always as a PNG (rule S9), at the size a card wants. */
function Tech({ name, label }: { name: string; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src={`/assets/tech/${name}.png`}
        alt=""
        draggable={false}
        className="h-5 w-5 object-contain"
      />
      {label && <span className="font-semibold">{label}</span>}
    </span>
  )
}

/**
 * THE DECK'S SPINE.
 *
 * `docker-compose.yml`, as six cumulative blocks. Slides 36 to 40 and 46 render
 * `compose(n)` with the new lines highlighted, so the room watches ONE file grow
 * rather than reading six unrelated snippets.
 *
 * Blocks, not lines, because a compose key is never one line: `environment:`
 * adds a key and its value under two different services. Each entry is the text
 * of the whole file at that step, and `HL` records which lines are new, so a
 * later edit to an early key cannot silently shift the highlight on a later
 * slide.
 *
 * Two-space indentation throughout, spaces only. The YAML slide says "never
 * tabs" and a deck that used one would be lying on the slide after.
 */
const COMPOSE_STEPS = [
  /* 0 services */ `services:
  backend:

  frontend:`,
  /* 1 build */ `services:
  backend:
    build: ./backend

  frontend:
    build: ./frontend`,
  /* 2 depends_on */ `services:
  backend:
    build: ./backend

  frontend:
    build: ./frontend
    depends_on:
      - backend`,
  /* 3 environment */ `services:
  backend:
    build: ./backend
    environment:
      APP_ENV: development

  frontend:
    build: ./frontend
    environment:
      API_URL: http://backend:8000
    depends_on:
      - backend`,
  /* 4 volumes */ `services:
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
  db_data:`,
] as const

/**
 * THE LINES ADDED AT EACH STEP, COMPUTED, NEVER TYPED.
 *
 * These were a hand-written array of line numbers, and two of the five entries
 * were wrong: inserting `environment:` into the backend block pushes every line
 * of the frontend block down by two, so `depends_on`'s numbers silently stopped
 * matching the slide that had already been written. The room would have watched
 * the wrong two lines light up.
 *
 * Since the steps are strictly additive (a key is only ever inserted, never
 * moved or removed), the longest-common-subsequence of consecutive steps gives
 * exactly the inserted lines. So the highlight is derived from the file, and a
 * later edit to an early key cannot desynchronise a later slide.
 */
function addedLines(prev: string, next: string): number[] {
  const a = prev.split('\n')
  const b = next.split('\n')
  // LCS table over the two line arrays.
  const L: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0))
  for (let i = a.length - 1; i >= 0; i--) {
    for (let j = b.length - 1; j >= 0; j--) {
      L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1])
    }
  }
  // Walk the table; every step that consumes a `b` line without an `a` match is
  // an insertion, and its 1-based index is what CodeBlock highlights.
  const added: number[] = []
  let i = 0
  let j = 0
  while (j < b.length) {
    if (i < a.length && a[i] === b[j]) {
      i++
      j++
    } else if (i < a.length && L[i + 1][j] >= L[i][j + 1]) {
      i++
    } else {
      added.push(j + 1)
      j++
    }
  }
  // A blank line inserted purely to separate two service blocks is not a key,
  // and lighting it up draws the eye to nothing.
  return added.filter((n) => b[n - 1].trim() !== '')
}

const COMPOSE_HL: readonly number[][] = COMPOSE_STEPS.map((step, i) =>
  addedLines(i === 0 ? '' : COMPOSE_STEPS[i - 1], step),
)

const compose = (step: number) => COMPOSE_STEPS[step]

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export const dockerComposeDeck: SlideDef[] = [
  /* --- Front frame, slides 1 to 7 ----------------------------------- */
  {
    id: 'brand',
    section: 'Opening',
    label: 'Brand',
    element: <BrandSlide greeting="Welcome" lesson={SESSION} />,
    notes: 'Brand only. No session content. The next slide names the session.',
  },
  {
    id: 'welcome',
    section: 'Opening',
    label: 'Welcome',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
    notes: 'Kicker plus the session name. Nothing else competes with it.',
  },
  {
    id: 'recap-dockerfile',
    section: 'Opening',
    label: 'Recap: the Dockerfile',
    element: (
      /*
        THE RECAP OPENS ON THEIR OWN FILE.

        Six lines they typed last week, and the two commands they ran. Starting on
        the artifact rather than on a list of claims means the room recognises the
        session before it has to remember anything about it.
      */
      <ContentSlide
        kicker="Recap"
        title="Where we Left Off"
        lead="Last session you packaged a three-line Python script into an image of your own"
        lesson={SESSION}
        points={[
          { text: 'Six instructions, one per line', sub: 'Each one became a layer of the image' },
          { text: 'docker build turned the file into an image', sub: 'docker run started a container from it' },
        ]}
      >
        <CodeBlock
          filename="docker-demo\Dockerfile"
          language="dockerfile"
          code={`FROM python:3.14-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]`}
          maxHeight={260}
        />
      </ContentSlide>
    ),
    notes:
      'Read the file out loud once, fast. They wrote it, so this is recognition, not teaching. The next slide is the four things it bought them.',
  },
  {
    id: 'recap-what-it-bought',
    section: 'Opening',
    label: 'Recap: what it bought',
    element: (
      /*
        SAME TITLE AS THE SLIDE BEFORE IT, deliberately. The corpus signals a
        continuation with a repeated title, never with "part 2".

        These four points are Session 2's key takeaways. If a point here is not on
        that slide, it does not belong on this one: the room was promised those
        four things and handed them back, so opening today with a fifth claim
        makes the two decks disagree about what was covered.
      */
      <RecapSlide
        kicker="Recap"
        title="Where we Left Off"
        lesson={SESSION}
        points={[
          'The Dockerfile',
          'Writing the Dockerfile',
          'Build and Run',
          'Layers and the Build Cache',
        ]}
      />
    ),
    notes:
      'Session 2 key takeaways, verbatim and in order. Land on the last one: unchanged layers come from the cache, which is why the dependency file is copied before the code. That fact returns on slide 16.',
  },
  {
    id: 'the-gap',
    section: 'Opening',
    label: 'The gap today closes',
    element: (
      <ContentSlide
        kicker="Recap"
        title="One Program, Two Programs"
        lead="You packaged one script. Your real application is two, and they do not even run on the same thing"
        lesson={SESSION}
        points={[
          { text: 'React is the UI', sub: 'Components, and the fetch calls that ask for data' },
          { text: 'Django is the API', sub: 'Models, business logic, and the data itself' },
          { text: 'So how do you run two containers together?', tone: 'brand' },
        ]}
      >
        <TwoRuntimes />
      </ContentSlide>
    ),
    notes:
      'The hinge into today. They have shipped this exact pair in the integration course, so do not explain what React and Django are. The question at the bottom is the session, and it stays unanswered until slide 29.',
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        kicker={SESSION}
        title="Today's Agenda"
        lesson={SESSION}
        /* Four items, and they are the deck's four sections. The key takeaways
           slide restates exactly these, so the room hears the same four things
           three times: here, as they happen, and at the close. */
        items={[
          { title: 'A Second Container', sub: 'The same six instructions, on the Node runtime' },
          { title: 'Running Both By Hand', sub: 'Six commands, and why that does not scale' },
          { title: 'One File for the Whole App', sub: 'Writing docker-compose.yml, one key at a time' },
          { title: 'Running the Stack', sub: 'One command, and how containers find each other' },
        ]}
      />
    ),
    notes:
      'Four items. Point out that items 1 and 2 are the problem and items 3 and 4 are the answer, so nobody spends the first half wondering when Compose arrives.',
  },
  {
    id: 'setup',
    section: 'Opening',
    label: 'Initial Setup',
    element: (
      <ContentSlide
        kicker={SESSION}
        title="Initial Setup"
        lead="Everyone starts from the same running state. Run these two checks step by step :"
        lesson={SESSION}
        points={[
          { text: 'Open C:\\nxttrendz in VS Code', sub: 'Same workspace as last session' },
          { text: 'Start Docker Desktop and wait for it to say running', sub: 'Nothing today works before it does' },
        ]}
      >
        <Terminal
          path={CWD}
          caption="Terminal · VS Code integrated terminal"
          lines={[
            { text: 'docker --version', kind: 'cmd' },
            { text: 'Docker version 27.3.1, build ce12230', kind: 'out' },
            { text: 'dir', kind: 'cmd' },
            { text: 'Dockerfile   requirements.txt', kind: 'out' },
            { text: '.dockerignore   app.py', kind: 'out' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Wait for hands. Anyone whose Docker Desktop is not running loses the whole session. The four files listed are last session\'s, still where they left them. Transcript quoted from the TR, not captured.',
  },

  /* --- Concept 1: A Second Container, slides 8 to 22 ---------------- */
  {
    id: 'c1-divider',
    section: 'A Second Container',
    label: 'Divider 1',
    element: (
      <SectionBreakerSlide
        index={1}
        title="A Second Container"
        subtitle="Same six instructions, a different runtime"
        lesson={SESSION}
      />
    ),
    notes:
      'Say the section out loud as a question: your app is two programs, so let us build the second one. The room expects something new and hard; the payoff on slide 17 is that there was nothing new at all.',
  },
  {
    id: 'c1-a-choice',
    section: 'A Second Container',
    label: 'That line was a choice',
    element: (
      <ContentSlide
        kicker="A Second Container"
        title="That Line Was a Choice"
        lead="Line one picked the program that runs your code. Every other line in the file stayed the same"
        lesson={SESSION}
      >
        <div className="mx-auto grid w-[880px] gap-4">
          <CodeBlock
            filename="docker-demo\Dockerfile"
            language="dockerfile"
            code={`FROM python:3.14-slim
WORKDIR /app
COPY requirements.txt .`}
            highlight={[1]}
            maxHeight={150}
          />
          <Callout kind="info" title="Nothing about Docker is tied to Python" asStep={false}>
            Your image carries Python because line one said so. Change that one word and the image
            carries something else
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Point at line one and nowhere else. This is the smallest possible change of frame: they thought they learnt "how to containerise a Python app" and they actually learnt "how to containerise an app".',
  },
  {
    id: 'c1-runtime',
    section: 'A Second Container',
    label: 'What is a runtime',
    element: (
      /*
        FIRST NEW WORD OF THE SESSION, and the room has never been given a
        definition of it. They have USED two runtimes daily without the word.

        The two cards are deliberately the two commands they have typed hundreds
        of times, because the definition then confirms something they already
        know rather than adding something they do not.
      */
      <ContentNoteSlide
        kicker="A Second Container"
        title="What is a Runtime"
        lead="The program that runs your code. It is not your code, and your code cannot run without it"
        lesson={SESSION}
        note={{
          kind: 'tip',
          title: 'Docker Hub has one base image per runtime',
          body: (
            <>
              <Code>node:22-alpine</Code>, <Code>openjdk:21</Code>, <Code>golang:1.23</Code>,{' '}
              <Code>php:8.3</Code>. Same <Code>FROM</Code>, a different word.{' '}
              <Code>-slim</Code> and <Code>-alpine</Code> are each runtime's minimal variant
            </>
          ),
        }}
      >
        <CardGrid cols={2}>
          <Card title={<Tech name="python" label="Python" />} tone="brand">
            Runs <Code>.py</Code> files. You start Django with{' '}
            <Code>python manage.py runserver</Code>
          </Card>
          <Card title={<Tech name="nodejs" label="Node.js" />} tone="brand">
            Runs <Code>.js</Code> files. You start React with <Code>npm start</Code>
          </Card>
        </CardGrid>
      </ContentNoteSlide>
    ),
    notes:
      'Ask which of the two they have installed. Almost everyone says both, which is the answer: they have been using two runtimes all along without a word for it. The callout names four base images and no logos, because they will type the name, not the logo.',
  },
  {
    id: 'c1-two-programs',
    section: 'A Second Container',
    label: 'Two runtimes, not one',
    element: (
      /*
        THE TREE AND THE TABLE ARE ONE IDEA, so they share a slide (plan slide 11).

        The tree says "these two folders are already on your disk". The table says
        "and everything about how they run differs". Split across two slides the
        second one arrives as trivia; together they are the argument for the
        one-process rule three slides later.
      */
      <ContentSlide
        kicker="A Second Container"
        title="Two Runtimes, Not One"
        lead="Both are already on your disk. Three rows describe how each one runs, and every row differs"
        lesson={SESSION}
      >
        <div className="flex items-start gap-6">
          <FileTree
            root={PROJECT}
            width={386}
            entries={[
              { name: 'backend', folder: true, note: 'Django, the APIs (Python)', state: 'existing' },
              { name: 'frontend', folder: true, note: 'React, the UI (Node)', state: 'existing' },
              { name: 'docker-demo', folder: true, note: "last session's practice folder", state: 'existing' },
            ]}
          />
          <DataTable
            className="flex-1"
            compact
            columns={[
              { label: '', weight: 1 },
              { label: 'Frontend', weight: 1, align: 'center' },
              { label: 'Backend', weight: 1, align: 'center' },
            ]}
            rows={[
              ['Runtime', <Tech key="n" name="nodejs" label="Node.js" />, <Tech key="p" name="python" label="Python" />],
              ['Dependency file', <Code key="a">package.json</Code>, <Code key="b">requirements.txt</Code>],
              ['Start command', <Code key="c">npm start</Code>, <Code key="d">python manage.py runserver</Code>],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Slide 5 already said the app is two programs, so do not re-argue it. This slide answers the question slide 10 opens: you now know what a runtime is, so how different are these two? Have them open the folder, then read the table down the middle column and down the right. Three rows, three differences, and no single image is right for both.',
  },
  {
    id: 'c1-one-container-q',
    section: 'A Second Container',
    label: 'The pause beat',
    element: (
      /*
        A PAUSE BEAT, ON ITS OWN SLIDE, WITH NO ANSWER.

        The room's instinct is "put both in one container", and it has to be said
        out loud by them before it is answered. Anything else on this slide gives
        the answer away, so the slide carries the question and one prompt.
      */
      <ContentSlide
        kicker="A Second Container"
        title="Could Both Fit in One Container?"
        lead="Two runtimes, two dependency files, two start commands, inside one image. Would that work?"
        lesson={SESSION}
        points={[{ text: 'Say what you think before the next slide', tone: 'brand' }]}
      />
    ),
    notes:
      'Do not click through. Ask for hands and take two answers. The honest answer is "technically yes", which is why the next slide leads with it rather than with a rule.',
  },
  {
    id: 'c1-one-process',
    section: 'A Second Container',
    label: 'One container, one process',
    element: (
      <ContentNoteSlide
        kicker="A Second Container"
        title="One Container, One Process"
        lead="Technically yes, and it would be a mess"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'The golden rule of containers',
          body: (
            <>
              One container, one process. Node gets a container, Python gets a container
            </>
          ),
        }}
      >
        <OneProcessRule />
      </ContentNoteSlide>
    ),
    notes:
      'The left half is the answer to their instinct: it fits, and then one crash takes both halves down. Let the red frame land before reading the rule. This rule is the reason the compose file has two services rather than one.',
  },
  {
    id: 'c1-workspace',
    section: 'A Second Container',
    label: "Today's workspace",
    element: (
      <ContentNoteSlide
        kicker="A Second Container"
        title="Today's Workspace"
        lead="Two applications, so two folders inside docker-demo, each with its own Dockerfile"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'One folder, one Dockerfile',
          body: (
            <>
              A single Dockerfile at the top of <Code>docker-demo</Code> with <Code>COPY . .</Code>{' '}
              would sweep <strong>both</strong> applications into <strong>one</strong> image. Last
              session's warning, in a new shape
            </>
          ),
        }}
      >
        <FileTree
          root={CWD}
          width={620}
          caption="Named to match the real project, so everything learnt today transfers when only the paths change"
          entries={[
            {
              name: 'backend',
              folder: true,
              note: "last session's four files, moved in here unchanged",
              state: 'existing',
            },
            { name: 'frontend', folder: true, note: 'new, and empty for now', state: 'new' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Have them create the folders and move the four files now. Nothing inside those files changes, not the script and not the Dockerfile. The warning is about the level ABOVE these folders, so point at docker-demo itself while reading it.',
  },
  {
    id: 'c1-node-side-files',
    section: 'A Second Container',
    label: 'The Node side',
    element: (
      /*
        THREE SLIDES COMPRESSED INTO ONE (rule S13, agreed at sign-off).

        This was `server.js`, then `package.json`, then the role mapping. The room
        does not type these files, so creating them one per slide spent three
        slides on a point the mapping makes by itself: the Node side has the same
        shape as the Python side, and only the filenames changed.
      */
      <ContentSlide
        kicker="A Second Container"
        title="The Node Side"
        lead="A script, and a file listing its dependencies. Every line has a counterpart you already have"
        lesson={SESSION}
      >
        <div className="flex items-start gap-5">
          <div className="w-[524px] space-y-2.5">
            <CodeBlock
              filename="docker-demo\frontend\server.js"
              language="javascript"
              code={`console.log("nxttrendz frontend starting...");
console.log("Frontend ready");`}
              showLineNumbers={false}
              maxHeight={96}
            />
            <CodeBlock
              filename="docker-demo\frontend\package.json"
              language="json"
              code={`{
  "name": "nxttrendz-frontend",
  "dependencies": {}
}`}
              showLineNumbers={false}
              maxHeight={150}
            />
          </div>
          <AnalogyMap
            className="flex-1"
            leftLabel="Python side"
            rightLabel="Node side"
            rows={[
              { from: 'app.py', to: 'server.js' },
              { from: 'requirements.txt', to: 'package.json' },
              { from: 'pip install', to: 'npm install' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Read the mapping left to right three times. You already own a package.json: your React project has one doing this same job. An empty dependency list still matters, because the install step treats empty and full exactly the same way. Keep both scripts tiny: the moment a React component is on screen the room debugs React instead of learning Compose.',
  },
  {
    id: 'c1-node-dockerfile',
    section: 'A Second Container',
    label: 'The Node Dockerfile',
    element: (
      <ContentNoteSlide
        kicker="A Second Container"
        title="The Node Dockerfile"
        lead="The same recipe, with the Python words swapped for Node words"
        lesson={SESSION}
        note={{
          kind: 'note',
          title: 'Why the dependency file is copied first',
          body: (
            <>
              Last session's cache reason, unchanged. <Code>npm install</Code> is the slow step and
              rarely needs to re-run, so its layer has to sit above the code layer
            </>
          ),
        }}
      >
        <CodeBlock
          filename="docker-demo\frontend\Dockerfile"
          language="dockerfile"
          code={`FROM node:22-alpine
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
CMD ["node", "server.js"]`}
          maxHeight={230}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Let them read it in silence for ten seconds and ask what is new. The answer is nothing. That reaction is the section, and the next slide makes it explicit.',
  },
  {
    id: 'c1-line-by-line',
    section: 'A Second Container',
    label: 'Line by line against Python',
    element: (
      /*
        THE SECTION'S PAYOFF SLIDE.

        Identical row labels down both columns is the corpus comparison shape, and
        it is what makes "the pattern does not change" a thing the room can SEE
        rather than a claim they have to accept.
      */
      <ContentSlide
        kicker="A Second Container"
        title="Line by Line Against Python"
        lead="Six rows, and the answer in the last column is yes every time"
        lesson={SESSION}
      >
        <div className="grid gap-4">
        <DataTable
          compact
          columns={[
            { label: 'Step', weight: 0.8 },
            { label: 'Python image', weight: 1.3 },
            { label: 'Node image', weight: 1.2 },
            { label: 'Same idea?', weight: 1.3, dim: true },
          ]}
          rows={[
            [<Code key="a">FROM</Code>, 'python:3.14-slim', 'node:22-alpine', 'Base image with the runtime'],
            [<Code key="b">WORKDIR</Code>, '/app', '/app', 'Identical'],
            [<Code key="c">COPY</Code>, 'requirements.txt .', 'package.json .', 'Dependency list, copied first'],
            [<Code key="d">RUN</Code>, 'pip install -r ...', 'npm install', 'Install at build time'],
            [<Code key="e">COPY . .</Code>, 'all code', 'all code', 'Code copied after'],
            [<Code key="f">CMD</Code>, '["python", "app.py"]', '["node", "server.js"]', 'Start command'],
          ]}
        />
          <Callout kind="success" title="The pattern does not change with the language" asStep={false}>
            Only the base image, the dependency file and the start command change
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Read the last column down, not across. Six rows and every answer is yes. Then land the callout: this is the slide that says they can containerise anything, and it cost them one new word, alpine.',
  },
  {
    id: 'c1-dockerignore',
    section: 'A Second Container',
    label: 'Its .dockerignore',
    element: (
      <ContentNoteSlide
        kicker="A Second Container"
        title="Its .dockerignore"
        lead="node_modules is the Node equivalent of env, and excluding it is not optional tidying"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'What happens if you skip it',
          body: (
            <>
              <Code>COPY . .</Code> would overwrite the packages <Code>npm install</Code> had just
              installed <strong>inside</strong> the image with the ones from your machine, built for
              your OS rather than the container's. Confusing to debug, trivial to prevent
            </>
          ),
        }}
      >
        <div className="flex items-start gap-5">
          <CodeBlock
            className="w-[404px]"
            filename="frontend\.dockerignore"
            language="text"
            code={`node_modules/
.vscode/
npm-debug.log`}
            showLineNumbers={false}
            maxHeight={120}
          />
          <FileTree
            root={CWD}
            width={546}
            caption="Both folders now hold the same four kinds of file"
            entries={[
              { name: 'backend', folder: true, note: 'Dockerfile · requirements.txt · .dockerignore · app.py', state: 'existing' },
              { name: 'frontend', folder: true, note: 'Dockerfile · package.json · .dockerignore · server.js', state: 'new' },
            ]}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'The overwrite failure is worth thirty seconds: packages compiled for Windows landing inside a Linux container is the kind of bug that eats an evening. The tree on the right is the section\'s finished state.',
  },
  {
    id: 'c1-build',
    section: 'A Second Container',
    label: 'docker build',
    element: (
      <ContentSlide
        kicker="A Second Container"
        title="docker build"
        lead="From inside the frontend folder, because a build must only ever see its own app's files"
        lesson={SESSION}
      >
        <div className="mx-auto grid w-[900px] gap-4">
        <Terminal
          path={BUILD_FE}
          caption="Terminal · the frontend build"
          fontSize={13}
          lines={[
            { text: 'docker build -t nxttrendz-frontend .', kind: 'cmd' },
            { text: '[+] Building 9.7s (10/10) FINISHED', kind: 'out' },
            { text: ' => [1/5] FROM docker.io/library/node:22-alpine       3.1s', kind: 'out' },
            { text: ' => [2/5] WORKDIR /app                                0.1s', kind: 'out' },
            { text: ' => [3/5] COPY package.json .                         0.1s', kind: 'out' },
            { text: ' => [4/5] RUN npm install                             5.4s', kind: 'out' },
            { text: ' => [5/5] COPY . .                                    0.2s', kind: 'out' },
            { text: ' => naming to docker.io/library/nxttrendz-frontend    0.0s', kind: 'ok' },
          ]}
        />
          <div className="grid grid-cols-2 gap-4">
            <Callout kind="info" title="Five steps for six lines" asStep={false}>
              <Code>CMD</Code> is not a build step: it only runs when a container starts
            </Callout>
            <Callout kind="tip" title="Step 4 is the slow one" asStep={false}>
              <Code>npm install</Code>, exactly as the cache reason predicted
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Check the prompt path with them before running it: the wrong folder is the error that cost the room twenty minutes last session. Timings are illustrative, quoted from the TR rather than captured.',
  },
  {
    id: 'c1-run',
    section: 'A Second Container',
    label: 'docker run',
    element: (
      <ContentNoteSlide
        kicker="A Second Container"
        title="docker run"
        lead="One image, one container, two printed lines"
        lesson={SESSION}
        note={{
          kind: 'note',
          title: 'Same behaviour, different language',
          body: (
            <>
              It printed its message and finished, exactly as the Python container did. A container
              lives as long as its process does
            </>
          ),
        }}
      >
        <Terminal
          path={BUILD_FE}
          caption="Terminal · the frontend container"
          lines={[
            { text: 'docker run nxttrendz-frontend', kind: 'cmd' },
            { text: 'nxttrendz frontend starting...', kind: 'out' },
            { text: 'Frontend ready', kind: 'ok' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Their first container that is not Python. Nothing about Docker noticed the difference, which is the whole point of the section.',
  },
  {
    id: 'c1-rebuild-backend',
    section: 'A Second Container',
    label: 'Rebuild the Python side',
    element: (
      /*
        TWO FOLDERS MEANS TWO PANELS (rule S4).

        The build runs in `backend`, `docker images` runs in `docker-demo`, and
        stacking both prompts inside one panel would hide the one detail this
        slide is teaching: which folder each command belongs to.
      */
      <ContentSlide
        kicker="A Second Container"
        title="Rebuild the Python Side"
        lead="The Python files moved into their own folder, and the image gets a clearer name"
        lesson={SESSION}
      >
        <div className="flex items-start gap-4">
          <Terminal
            className="flex-1"
            path={BUILD_BE}
            caption="Terminal 1 · the backend build"
            fontSize={12}
            lines={[
              { text: 'docker build -t nxttrendz-backend .', kind: 'cmd' },
              { text: '[+] Building 1.2s (10/10) FINISHED', kind: 'out' },
              { text: ' => CACHED [2/5] WORKDIR /app', kind: 'out' },
              { text: ' => naming to .../nxttrendz-backend', kind: 'ok' },
            ]}
          />
          <Terminal
            className="flex-1"
            path={CWD}
            caption="Terminal 2 · the image list"
            fontSize={12}
            lines={[
              { text: 'docker images', kind: 'cmd' },
              { text: 'REPOSITORY          TAG      IMAGE ID', kind: 'out' },
              { text: 'nxttrendz-frontend  latest   7c1e4f90ab23', kind: 'out' },
              { text: 'nxttrendz-backend   latest   3f2a8b91c04d', kind: 'out' },
              { text: 'nxttrendz-app       latest   3f2a8b91c04d', kind: 'out' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Two panels because there are two folders. The backend build is fast because every layer came from the cache: nothing in that folder changed, only its location. Transcripts quoted from the TR.',
  },
  {
    id: 'c1-two-images',
    section: 'A Second Container',
    label: 'Two images of your own',
    element: (
      <ContentNoteSlide
        kicker="A Second Container"
        title="Two Images of Your Own"
        lead="Two applications, two runtimes, two images. So how do we run them together?"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'One image, two names',
          body: (
            <>
              <Code>nxttrendz-backend</Code> and <Code>nxttrendz-app</Code> show the{' '}
              <strong>same IMAGE ID</strong>: the code is identical, so Docker stored one image and
              gave it two names. <Code>docker rmi nxttrendz-app</Code> removes the old name and
              leaves the image in place
            </>
          ),
        }}
      >
        <DataTable
          columns={[
            { label: 'REPOSITORY', weight: 1.3 },
            { label: 'IMAGE ID', weight: 1 },
            { label: 'SIZE', weight: 0.7, align: 'center' },
          ]}
          rows={[
            ['nxttrendz-frontend', '7c1e4f90ab23', '182MB'],
            ['nxttrendz-backend', '3f2a8b91c04d', '156MB'],
            ['nxttrendz-app', '3f2a8b91c04d', '156MB'],
          ]}
          highlight={[2, 3]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Somebody always asks why two rows share an ID, so answer it before they do. Then land the question in the lead: two images exist, and starting the app now means running both. That is the next section.',
  },

  /* --- Concept 2: Running Both By Hand, slides 23 to 32 ------------- */
  {
    id: 'c2-divider',
    section: 'Running Both By Hand',
    label: 'Divider 2',
    element: (
      <SectionBreakerSlide
        index={2}
        title="Running Both By Hand"
        subtitle="You have two images. Now start the application"
        lesson={SESSION}
      />
    ),
    notes:
      'Ask the question in the subtitle out loud and let them answer it. Most rooms guess two commands. The real number is six, and that gap is the section.',
  },
  {
    id: 'c2-by-hand',
    section: 'Running Both By Hand',
    label: 'What it actually takes',
    element: (
      /*
        TWO PANELS, BECAUSE THERE ARE TWO FOLDERS (rule S4).

        Merging these six commands into one panel would hide the exact thing the
        slide is complaining about: that you have to be standing in a different
        place for each half.
      */
      <ContentNoteSlide
        kicker="Running Both By Hand"
        title="What It Actually Takes"
        lead="Two images, two folders. Starting the application by hand means all of this"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'Six commands, six chances to be in the wrong folder',
          body: (
            <>
              The error that cost the room twenty minutes last session:{' '}
              <Code>path "." not found</Code>
            </>
          ),
        }}
      >
        <div className="flex items-start gap-4">
          <Terminal
            className="flex-1"
            path={BUILD_BE}
            caption="Terminal 1 · the backend"
            fontSize={11}
            lines={[
              { text: 'cd C:\\nxttrendz\\docker-demo\\backend', kind: 'cmd' },
              { text: 'docker build -t nxttrendz-backend .', kind: 'cmd' },
              { text: 'docker run nxttrendz-backend', kind: 'cmd' },
            ]}
          />
          <Terminal
            className="flex-1"
            path={BUILD_FE}
            caption="Terminal 2 · the frontend"
            fontSize={11}
            lines={[
              { text: 'cd C:\\nxttrendz\\docker-demo\\frontend', kind: 'cmd' },
              { text: 'docker build -t nxttrendz-frontend .', kind: 'cmd' },
              { text: 'docker run nxttrendz-frontend', kind: 'cmd' },
            ]}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Count the commands with the room, out loud, to six. Two of the six are nothing but cd: pure overhead that exists only because the builds live in different folders.',
  },
  {
    id: 'c2-remember',
    section: 'Running Both By Hand',
    label: 'What must be remembered',
    element: (
      <ContentSlide
        kicker="Running Both By Hand"
        title="What Must Be Remembered"
        lead="Correctly, every single time, with nothing to check it against"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'Detail', weight: 1.2 },
            { label: 'If you get it wrong', weight: 1.5, dim: true },
          ]}
          rows={[
            ['Which folder each build runs from', 'The build fails, or builds the wrong app'],
            ['Both images rebuilt after an edit', 'One container runs new code, the other old code'],
            ['The image name for each app', 'docker run starts yesterday\u2019s image'],
            ['Start order, backend before frontend', 'The frontend has nothing to talk to'],
            ['Both containers stopped and removed after', 'Leftovers pile up in docker ps -a'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Read the right column only. Five ways to get it wrong, and not one of them announces itself: each looks like a different bug. This is the argument for writing it down, and it is stronger than "six is a lot".',
  },
  {
    id: 'c2-does-not-scale',
    section: 'Running Both By Hand',
    label: 'Why it does not scale',
    element: (
      <ContentSlide
        kicker="Running Both By Hand"
        title="Add a Database and a Cache"
        lead="Six commands run two containers. Four containers is the normal shape of a real application"
        lesson={SESSION}
        points={[
          { text: 'The ritual doubles, and so does every risk', tone: 'brand' },
          {
            text: 'Nothing in the folder says these belong together',
            sub: 'Someone opening docker-demo cannot tell it is one application',
          },
          { text: 'It lives in your head and your terminal history', sub: 'Nobody else can reproduce it' },
        ]}
      >
        <HandRitual />
      </ContentSlide>
    ),
    notes:
      'The database and cache rows are dashed because we are not building them: they are the shape of a real project, named and left alone. The third bullet is the one that matters most and is the one rooms miss: this is not just tedious, it is undocumented.',
  },
  {
    id: 'c2-the-question',
    section: 'Running Both By Hand',
    label: 'The question',
    element: (
      /*
        THE SESSION'S THESIS, ON A SLIDE OF ITS OWN.

        Everything before this is the problem, everything after is the answer. It
        carries one sentence because a second line would give the room somewhere
        else to look while the question is landing.
      */
      <ContentSlide
        kicker="Running Both By Hand"
        title="The Question"
        lead="How do we define a multi-container application ONCE, in a file, and start or stop it with one command?"
        lesson={SESSION}
      />
    ),
    notes:
      'Read it slowly and stop. Three words carry it: once, file, single. Do not name the tool yet. The next slide answers the question with an orchestra, not with a product.',
  },
  {
    id: 'c2-orchestra',
    section: 'Running Both By Hand',
    label: 'Picture an orchestra',
    element: (
      /*
        THE SCENE GETS THE WHOLE STAGE.

        With bullets beside it the figure landed in ContentSlide's 1fr column,
        about 396px against its own 560, and the caption ran through the front-row
        players' labels. The two bullets said no more than the lead does, and this
        is the one slide in the deck whose entire content is a picture, so it gets
        the full width and the room gets to just watch it.
      */
      <ContentSlide
        kicker="Running Both By Hand"
        title="Picture an Orchestra"
        lead="A single musician can start playing on their own. An orchestra cannot"
        lesson={SESSION}
      >
        <div className="flex justify-center">
          <Orchestra />
        </div>
      </ContentSlide>
    ),
    notes:
      'Let the baton fall before you say anything. The teaching is the timing: all four players start on one beat. Do not map the analogy here, the next slide does that properly.',
  },
  {
    id: 'c2-what-is-compose',
    section: 'Running Both By Hand',
    label: 'What is Docker Compose',
    element: (
      /*
        THE DEFINITION, AND THE ANALOGY CASHED OUT IN THE SAME BREATH.

        An analogy that is never mapped is decoration. Each row of this map takes
        one thing from the previous slide and names its technical counterpart, so
        the orchestra is spent here and then dropped.
      */
      <ContentNoteSlide
        kicker="Running Both By Hand"
        title="What is Docker Compose"
        lead="The answer to the question, and it is a tool whose whole job is that file"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'success',
          title: 'Docker Compose',
          icon: (
            <img src="/assets/tech/docker.png" alt="" draggable={false} className="h-6 w-6 object-contain" />
          ),
          body: (
            <>
              A tool that reads one file describing every container an application needs, and
              manages them all as one unit
            </>
          ),
        }}
      >
        <AnalogyMap
          leftLabel="Orchestra"
          rightLabel="Docker Compose"
          rows={[
            { from: 'Musicians', to: 'Containers (backend, frontend)' },
            { from: 'The score, one document', to: 'docker-compose.yml' },
            { from: 'Conductor raises the baton', to: 'docker compose up' },
            { from: 'Conductor ends the piece', to: 'docker compose down' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Read the definition once, then walk the four rows. The two commands in rows three and four are the only two they need for the rest of the session, and they are already on screen in a form the room can remember.',
  },
  {
    id: 'c2-declarative',
    section: 'Running Both By Hand',
    label: 'Commands to a file',
    element: (
      <ContentNoteSlide
        kicker="Running Both By Hand"
        title="Commands to a File"
        lead="The shift in thinking, and you have made this exact shift once before"
        lesson={SESSION}
        note={{
          kind: 'tip',
          title: 'You already did this with Django',
          body: (
            <>
              Instead of writing SQL statements to create a table, you declared a{' '}
              <strong>model</strong> and let the framework work out the steps. Compose is the same
              idea applied to containers
            </>
          ),
        }}
      >
        <CardGrid cols={2}>
          <Card title="docker run" tone="accent">
            <strong>Imperative</strong>: do this, then this, then this. A list of commands, in your
            head
          </Card>
          <Card title="docker compose" tone="brand">
            <strong>Declarative</strong>: this is what my app looks like. A file, in the project
          </Card>
        </CardGrid>
      </ContentNoteSlide>
    ),
    notes:
      'Two new words, imperative and declarative, and the Django model is what makes them stick. Ask who has written a migration by hand: almost nobody, and that is the point.',
  },
  {
    id: 'c2-what-changes',
    section: 'Running Both By Hand',
    label: 'What changes, what does not',
    element: (
      /*
        HEADS OFF THE COMMONEST WRONG MODEL, which is that Compose is a different
        container system that replaces what they learnt last session. It is not:
        it runs the same builds and the same containers, and the only thing that
        changes is who types the commands.
      */
      <ContentNoteSlide
        kicker="Running Both By Hand"
        title="What Changes, What Does Not"
        lead="Compose is not a new way to build images. It is a way to stop typing"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'It runs the same commands you would have',
          body: (
            <>
              Compose calls <Code>docker build</Code> and <Code>docker run</Code> for you. It does
              not replace them, and everything you learnt last session still applies
            </>
          ),
        }}
      >
        <DataTable
          columns={[
            { label: 'Stays exactly the same', weight: 1 },
            { label: 'Changes', weight: 1, dim: true },
          ]}
          rows={[
            ['Both Dockerfiles, untouched', 'Who types the six commands'],
            ['The images they build', 'Where the start order is written down'],
            ['The containers that run', 'Whether the next person can reproduce it'],
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Say the callout twice. Rooms leave this section believing Compose replaced Docker, and then cannot explain why the Dockerfile still matters. It matters because Compose reads it.',
  },
  {
    id: 'c2-quiz',
    section: 'Running Both By Hand',
    label: 'Quiz Time!',
    element: (
      <QuizTimeSlide
        subtitle="Two containers, six commands, and one file that has not been written yet"
        lesson={SESSION}
      />
    ),
    notes:
      'The mid-deck checkpoint, at the concept boundary the rest of the session depends on. If the room cannot say why running two containers by hand does not scale, the whole compose file lands as syntax. Hand over to the quiz component.',
  },

  /* --- Concept 3: Writing docker-compose.yml, slides 33 to 48 ------- */
  {
    id: 'c3-divider',
    section: 'One File for the Whole App',
    label: 'Divider 3',
    element: (
      <SectionBreakerSlide
        index={3}
        title="One File for the Whole App"
        subtitle="Writing docker-compose.yml"
        lesson={SESSION}
      />
    ),
    notes:
      'Sixteen slides, one key at a time, and the same file grows on the left each time. Tell the room not to copy it down yet: the complete file arrives on its own slide at the end of this section.',
  },
  {
    id: 'c3-create',
    section: 'One File for the Whole App',
    label: 'Create the file',
    element: (
      <ContentNoteSlide
        kicker="One File for the Whole App"
        title="Create the File"
        lead="Named exactly docker-compose.yml, and it goes in docker-demo itself, above both app folders"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'Every command from here runs from docker-demo',
          body: (
            <>
              Not from inside <Code>backend</Code> or <Code>frontend</Code>. Compose reads the file
              from the folder you are standing in, and this is the folder it is in
            </>
          ),
        }}
      >
        <div className="flex items-start gap-5">
          <FileTree
            root={CWD}
            width={470}
            entries={[
              /* No note on this row. The lead already says "new, and empty for
                 now", and the note was squeezing the name column until
                 `docker-compose.yml`, the one string this slide teaches, wrapped. */
              { name: 'docker-compose.yml', state: 'new' },
              { name: 'backend', folder: true, state: 'existing' },
              { name: 'frontend', folder: true, state: 'existing' },
            ]}
          />
          <Terminal
            className="flex-1"
            path={CWD}
            caption="Terminal · the prompt for the rest of the session"
            fontSize={13}
            lines={[
              { text: 'cd C:\\nxttrendz\\docker-demo', kind: 'cmd' },
              { text: 'type nul > docker-compose.yml', kind: 'cmd' },
            ]}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'It sits above both folders because it is the one file that describes both. Have everyone cd into docker-demo now and stay there: slide 58 is the error they get if they drift out of it.',
  },
  {
    id: 'c3-yaml',
    section: 'One File for the Whole App',
    label: 'What is YAML',
    element: (
      /*
        NEW FORMAT, EXPLAINED IN TERMS THEY ALREADY OWN.

        The TR's claim is that YAML is two rules they know from Python, so the
        figure shows the YAML beside the Python it means rather than describing
        YAML on its own terms. Nothing here is compose-specific on purpose: this
        is the last slide before the file starts filling up.
      */
      <ContentNoteSlide
        kicker="One File for the Whole App"
        title="What is YAML"
        lead="The format compose files are written in, built on two rules you already know from Python"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'Spaces only, never tabs',
          body: (
            <>
              Indentation defines the nesting, so a tab where spaces are expected breaks the file
            </>
          ),
        }}
      >
        <YamlNesting />
      </ContentNoteSlide>
    ),
    notes:
      'Sixty seconds, no more. They write Python: key and value is a dict, indentation is a block. That is all the YAML this course needs. Land the tab warning hard, because VS Code will hide it from them.',
  },
  {
    id: 'c3-services',
    section: 'One File for the Whole App',
    label: 'services',
    element: (
      <CodeBuildSlide
        kicker="One File for the Whole App"
        title="services"
        lead="The top-level section. Every container an application needs is one service"
        lesson={SESSION}
        filename="docker-demo\docker-compose.yml"
        code={compose(0)}
        highlight={COMPOSE_HL[0]}
        annotation={{
          key: 'services:',
          body: (
            <>
              Under it, one entry per container. <Code>backend</Code> and <Code>frontend</Code> are{' '}
              <strong>our</strong> names for them, not Docker's. Keep them short and meaningful,
              because they earn a second job in the last section of today
            </>
          ),
          replaces: 'nothing yet, this is the skeleton',
        }}
      />
    ),
    notes:
      'A service is one container. Say that sentence and no more: the word service is doing a lot of work later and it starts as a synonym. Do not hint at the second job yet, that is slide 61.',
  },
  {
    id: 'c3-build-key',
    section: 'One File for the Whole App',
    label: 'build',
    element: (
      <CodeBuildSlide
        kicker="One File for the Whole App"
        title="build"
        lead="Where each image comes from"
        lesson={SESSION}
        filename="docker-demo\docker-compose.yml"
        code={compose(1)}
        highlight={COMPOSE_HL[1]}
        annotation={{
          key: 'build: ./backend',
          body: (
            <>
              Do not look for a ready-made image, <strong>build one</strong> from the Dockerfile in
              that folder. The folder can no longer be the wrong one, because it is written down
            </>
          ),
          replaces: 'two cd commands and two docker build commands',
        }}
        note={{
          kind: 'note',
          title: 'build or image',
          body: (
            <>
              <Code>build:</Code> is for <strong>your own code</strong>. <Code>image:</Code> is for
              ready-made software from Docker Hub, like the <Code>hello-world</Code> image from
              session 1. Both services here are ours. Compose paths use forward slashes on Windows
              too
            </>
          ),
        }}
      />
    ),
    notes:
      'Four of the six manual commands are now gone, and this is the first slide where the room can feel the file paying for itself. The forward-slash detail saves a support question every single cohort.',
  },
  {
    id: 'c3-depends-on',
    section: 'One File for the Whole App',
    label: 'depends_on',
    element: (
      <CodeBuildSlide
        kicker="One File for the Whole App"
        title="depends_on"
        lead="Start order, written down instead of remembered"
        lesson={SESSION}
        filename="docker-demo\docker-compose.yml"
        code={compose(2)}
        highlight={COMPOSE_HL[2]}
        annotation={{
          key: 'depends_on: - backend',
          body: (
            <>
              The backend has to be up before the frontend has anything to talk to. One line replaces
              "remember to start the backend first"
            </>
          ),
          replaces: 'the start-order row from the remember-this table',
        }}
        note={{
          kind: 'warning',
          title: 'Start order only',
          body: (
            <>
              It starts the backend container first. It does <strong>not</strong> wait for the
              application inside it to be ready
            </>
          ),
        }}
      />
    ),
    notes:
      'The warning is the whole subtlety: container started is not app ready. Nothing today depends on the difference because both scripts just print, but it is the source of real bugs later, so plant it now.',
  },
  {
    id: 'c3-env-var',
    section: 'One File for the Whole App',
    label: 'What is an environment variable',
    element: (
      /*
        DEFINED BEFORE IT IS USED. The TR uses `environment:` with no definition,
        and this room has read env vars without the word: Django's settings.py
        pulls its secret and debug flag this way.
      */
      <ContentNoteSlide
        kicker="One File for the Whole App"
        title="What is an Environment Variable"
        lead="A value handed to a program from outside it, so the same code can behave differently in two places"
        lesson={SESSION}
        note={{
          kind: 'tip',
          title: 'You have read one before',
          body: (
            <>
              Django's <Code>settings.py</Code> pulls its secret key and debug flag out of the
              environment rather than hard-coding them. Same idea, same reason
            </>
          ),
        }}
      >
        <CardGrid cols={2}>
          <Card title={<Tech name="python" label="Python reads it" />} tone="brand">
            <Code>os.environ.get("APP_ENV")</Code>
          </Card>
          <Card title={<Tech name="nodejs" label="Node reads it" />} tone="brand">
            <Code>process.env.API_URL</Code>
          </Card>
        </CardGrid>
      </ContentNoteSlide>
    ),
    notes:
      'Each runtime reads it with the tool its language already has, and neither needs a library. Ask where they have seen os.environ before: settings.py, in almost every case.',
  },
  {
    id: 'c3-environment',
    section: 'One File for the Whole App',
    label: 'environment',
    element: (
      /*
        S6 LIVES OR DIES HERE.

        `API_URL: http://backend:8000` goes on screen and is NOT explained. The
        note says only that it is deliberately not localhost and that today's last
        section is about why. Explaining it here costs the deck its ending, which
        is the number one multi-container mistake.
      */
      <CodeBuildSlide
        kicker="One File for the Whole App"
        title="environment"
        lead="Configuration without editing code"
        lesson={SESSION}
        filename="docker-demo\docker-compose.yml"
        code={compose(3)}
        highlight={COMPOSE_HL[3]}
        annotation={{
          key: 'environment:',
          body: (
            <>
              One key and value per setting, per service. The backend is told which mode it is in,
              the frontend is told where the backend is
            </>
          ),
          replaces: 'editing a file and rebuilding for every setting',
        }}
        note={{
          kind: 'note',
          title: 'That address is not localhost, on purpose',
          body: (
            <>
              <Code>http://backend:8000</Code> is deliberately not <Code>localhost:8000</Code>, the
              address that worked all through the integration course. The last section of today is
              entirely about why
            </>
          ),
        }}
      />
    ),
    notes:
      'Plant the address deliberately: read it out, say it is not localhost, say you will come back to it, and move on. Someone will ask now. Tell them it is the last thing today, and that it is worth the wait.',
  },
  {
    id: 'c3-read-it',
    section: 'One File for the Whole App',
    label: 'Reading it in code',
    element: (
      <ContentNoteSlide
        kicker="One File for the Whole App"
        title="Reading It In Code"
        lead="One line added to each script, with the tool its language already has"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'The payoff',
          body: (
            <>
              The <strong>same image</strong> runs on your laptop and on a real server, and only
              these values change. No code edited, no rebuild
            </>
          ),
        }}
      >
        <div className="flex items-start gap-4">
          <CodeBlock
            className="flex-1"
            filename="docker-demo\backend\app.py"
            language="python"
            code={`import os

print("nxttrendz backend starting...")
print("Mode:", os.environ.get("APP_ENV"))`}
            showLineNumbers={false}
            fontSize={14}
            maxHeight={150}
          />
          <CodeBlock
            className="flex-1"
            filename="docker-demo\frontend\server.js"
            language="javascript"
            code={`console.log("nxttrendz frontend starting...");
console.log("Backend address:", process.env.API_URL);`}
            showLineNumbers={false}
            fontSize={14}
            maxHeight={150}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Two panels, one per language, so the symmetry is visible. The payoff line is the reason environment variables exist at all, and it is worth saying twice: one image, many places.',
  },
  {
    id: 'c3-secrets',
    section: 'One File for the Whole App',
    label: 'Never put secrets here',
    element: (
      <ContentNoteSlide
        kicker="One File for the Whole App"
        title="Never Put Secrets Here"
        lead="Not every setting belongs in this file"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'The file travels with the project',
          body: (
            <>
              Real secrets, like Django's <Code>SECRET_KEY</Code> or a database password, must never
              be typed directly into <Code>docker-compose.yml</Code>. Anyone who gets the project
              gets them
            </>
          ),
        }}
        points={[
          {
            text: 'Keep them in a separate file',
            sub: 'Compose reads it automatically, and it stays out of the shared copy',
          },
        ]}
      />
    ),
    notes:
      'Thirty seconds, and do not name the tooling: that is a later session. The point they must leave with is the reason, which is that this file is committed and shared.',
  },
  {
    id: 'c3-prediction',
    section: 'One File for the Whole App',
    label: 'A prediction',
    element: (
      /*
        PAUSE BEAT. No answer on this slide.
      */
      <ContentSlide
        kicker="One File for the Whole App"
        title="A Prediction"
        lead="A container writes a file. The container is deleted and recreated. Is the file still there?"
        lesson={SESSION}
        points={[{ text: 'Say yes or no before the next slide', tone: 'brand' }]}
      />
    ),
    notes:
      'Take a show of hands both ways. Most rooms split, which is exactly the right state to be in: the answer follows from something they already know, and they have not connected it yet.',
  },
  {
    id: 'c3-answer-no',
    section: 'One File for the Whole App',
    label: 'No, and here is why',
    element: (
      <ContentSlide
        kicker="One File for the Whole App"
        title="No, and Here is Why"
        lead="A container's filesystem lives and dies with the container"
        lesson={SESSION}
        points={[
          {
            text: 'The frozen image rule, from the other side',
            sub: 'The image never changes, so nothing the container wrote is kept',
          },
          { text: 'For a script that only prints, fine', sub: 'For anything holding data, a disaster' },
        ]}
      >
        <VolumeSurvival act={0} />
      </ContentSlide>
    ),
    notes:
      'This is last session\u2019s frozen-image rule seen from the other direction, so name the connection out loud. Let the container fade before reading the second bullet: the picture makes the argument and the words only confirm it.',
  },
  {
    id: 'c3-volume',
    section: 'One File for the Whole App',
    label: 'What is a volume',
    element: (
      <ContentSlide
        kicker="One File for the Whole App"
        title="What is a Volume"
        lead="Storage Docker keeps on the host, and plugs into a folder inside the container"
        lesson={SESSION}
        points={[
          {
            text: 'The host is your own machine',
            sub: 'The machine Docker itself runs on, your laptop today',
          },
          {
            text: 'The plugged in folder is outside the container',
            sub: "So what is written there survives the container's own filesystem",
          },
          { text: 'Like a pen drive you plug in', sub: 'Unplug the machine, the files stay on the drive' },
        ]}
      >
        <VolumeSurvival act={1} />
      </ContentSlide>
    ),
    notes:
      'A pen drive is the analogy that lands: you plug it into the machine, you can unplug the machine, the files stay on the drive. Host is a new word, so define it before using it in the next sentence.',
  },
  {
    id: 'c3-volumes',
    section: 'One File for the Whole App',
    label: 'volumes',
    element: (
      <CodeBuildSlide
        kicker="One File for the Whole App"
        title="volumes"
        lead="Two halves, separated by a colon. Read them right to left"
        lesson={SESSION}
        filename="docker-demo\docker-compose.yml"
        code={compose(4)}
        highlight={COMPOSE_HL[4]}
        annotation={{
          key: 'db_data : /app/data',
          body: (
            <>
              <Code>/app/data</Code> is the folder <strong>inside the container</strong> whose
              contents must survive. <Code>db_data</Code> is the named volume that holds them, and it
              lives on the host
            </>
          ),
          replaces: 'losing your data every time a container is recreated',
        }}
        note={{
          kind: 'note',
          title: 'The bottom block declares the name',
          body: (
            <>
              The <Code>volumes:</Code> block at the far left sits level with <Code>services:</Code>,
              not inside a service, and it is what tells Docker to create the storage
            </>
          ),
        }}
      />
    ),
    notes:
      'Read the line right to left: the folder inside the container first, then where its contents actually live. The indentation of the bottom block is the thing people get wrong, so point at the left margin.',
  },
  {
    id: 'c3-starts-txt',
    section: 'One File for the Whole App',
    label: 'Recording each start',
    element: (
      <ContentSlide
        kicker="One File for the Whole App"
        title="Recording Each Start"
        lead="Ordinary file handling, writing into the one folder that outlives the container"
        lesson={SESSION}
        points={[
          { text: 'Appends one line every time the container starts', sub: 'Then prints how many lines it has' },
          { text: 'The path matters, not the code', sub: '/app/data is the folder the volume is plugged into' },
        ]}
      >
        <CodeBlock
          filename="docker-demo\backend\app.py"
          language="python"
          code={`import os

print("nxttrendz backend starting...")
print("Mode:", os.environ.get("APP_ENV"))

with open("/app/data/starts.txt", "a") as f:
    f.write("started\\n")

with open("/app/data/starts.txt") as f:
    print("Times started so far:", len(f.readlines()))`}
          showLineNumbers={false}
          fontSize={15}
          maxHeight={340}
        />
      </ContentSlide>
    ),
    notes:
      'Nothing here is Docker: it is the file handling they wrote in their first Python month. That is deliberate, because it means the count surviving is about the volume and nothing else. Slide 54 runs it twice.',
  },
  {
    id: 'c3-complete',
    section: 'One File for the Whole App',
    label: 'The complete file',
    element: (
      /*
        THE BUILD SEQUENCE CLOSES ON THE WHOLE ARTIFACT, per the corpus. This is
        the slide the room photographs, so it carries no new key and no new word.
      */
      <ContentSlide
        kicker="One File for the Whole App"
        title="The Complete File"
        lead="Two languages, two runtimes, one file. Six commands and a rule about start order, all collapsed into this"
        lesson={SESSION}
      >
        <div className="mx-auto w-[520px]">
          <CodeBlock
            filename="docker-demo\docker-compose.yml"
            language="YAML"
            code={compose(4)}
            fontSize={13.5}
            maxHeight={430}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Read it as a sentence: my app is two services, backend built from backend\\Dockerfile, told which mode it is in, keeping its data in a volume; and frontend, built from frontend\\Dockerfile, told where the backend is, started after it. Now let them photograph it.',
  },

  /* --- Concept 4: Running the Stack, slides 49 to 63 ---------------- */
  {
    id: 'c4-divider',
    section: 'Running the Stack',
    label: 'Divider 4',
    element: (
      <SectionBreakerSlide
        index={4}
        title="Running the Stack"
        subtitle="One command, and how containers find each other"
        lesson={SESSION}
      />
    ),
    notes:
      'Two halves. The first eleven slides are the commands, and they go quickly because the file already explained itself. The last four are the networking idea, and they are the most important slides in the session.',
  },
  {
    id: 'c4-up-explain',
    section: 'Running the Stack',
    label: 'What up will do',
    element: (
      /*
        EXPLAIN THE COMMAND BEFORE SHOWING IT (rule S7). These four cards become
        the four ticks in the transcript on the next slide, in the same order, so
        the room reads output it has already been told how to read.
      */
      <ContentSlide
        kicker="Running the Stack"
        title="What up Will Do"
        lead="Before we run anything, here is everything one command is about to do for us"
        lesson={SESSION}
      >
        <CardGrid cols={2}>
          <Card icon="bolt" title="Build both images" tone="brand">
            From the two Dockerfiles, on this first run
          </Card>
          <Card icon="link" title="Create a network and a volume" tone="brand">
            One private network for the app, and the storage the file asked for
          </Card>
          <Card icon="play" title="Start them in order" tone="brand">
            Backend first, then frontend, because of <Code>depends_on</Code>
          </Card>
          <Card icon="terminal" title="Stream both logs" tone="brand">
            Every line labelled with the service that printed it
          </Card>
        </CardGrid>
      </ContentSlide>
    ),
    notes:
      'Four things, and only the first was ever a command they typed. The other three are work they were doing in their head. Read all four before moving on: the transcript is dense and this is what makes it readable.',
  },
  {
    id: 'c4-up',
    section: 'Running the Stack',
    label: 'docker compose up',
    element: (
      /*
        THE PROJECT NAME IS IN THE LEAD, NOT IN A CALLOUT.

        A terminal panel, the StackUp figure and a callout together run 43px past
        the frame. The project name is a naming fact rather than a rule, so it
        reads perfectly well as the second sentence of the lead, and the slide
        keeps both things the room actually has to pair up.
      */
      <ContentSlide
        kicker="Running the Stack"
        title="docker compose up"
        lead="One command, from docker-demo. The docker-demo prefix on every name is the project name"
        lesson={SESSION}
      >
        <div className="flex items-start gap-4">
          <Terminal
            className="w-[560px]"
            path={CWD}
            caption="Terminal · the whole application, from one command"
            fontSize={12.5}
            lines={[
              { text: 'docker compose up', kind: 'cmd' },
              { text: '[+] Running 4/4', kind: 'out' },
              { text: ' \u2714 Network docker-demo_default        Created', kind: 'ok' },
              { text: ' \u2714 Volume  docker-demo_db_data        Created', kind: 'ok' },
              { text: ' \u2714 Container docker-demo-backend-1    Created', kind: 'ok' },
              { text: ' \u2714 Container docker-demo-frontend-1   Created', kind: 'ok' },
              { text: 'backend-1   | nxttrendz backend starting...', kind: 'out' },
              { text: 'backend-1   | Mode: development', kind: 'out' },
              { text: 'backend-1   | Times started so far: 1', kind: 'out' },
              { text: 'frontend-1  | nxttrendz frontend starting...', kind: 'out' },
              { text: 'frontend-1  | Backend address: http://backend:8000', kind: 'out' },
            ]}
          />
          <StackUp className="flex-1" />
        </div>
      </ContentSlide>
    ),
    notes:
      'Pair the ticks on the right with the lines on the left, one at a time. Then point at the labelled log lines: two applications, two languages, one terminal. Transcript quoted from the TR, not captured.',
  },
  {
    id: 'c4-ps',
    section: 'Running the Stack',
    label: 'Where did they go',
    element: (
      <ContentNoteSlide
        kicker="Running the Stack"
        title="Where Did They Go"
        lead="Both scripts printed their lines and finished, so nothing is running"
        lesson={SESSION}
        note={{
          kind: 'note',
          title: 'compose ps is docker ps, narrowed to this project',
          body: (
            <>
              The same is true of the logs: <Code>docker compose logs backend</Code> shows one
              service's output. Everything you learnt last session still works, scoped to this app
            </>
          ),
        }}
      >
        <div className="flex items-start gap-4">
          <Terminal
            className="flex-1"
            path={CWD}
            caption="Terminal · running containers only"
            fontSize={13}
            lines={[
              { text: 'docker compose ps', kind: 'cmd' },
              { text: 'NAME   IMAGE   COMMAND   SERVICE   STATUS', kind: 'out' },
            ]}
          />
          <Terminal
            className="flex-1"
            path={CWD}
            caption="Terminal · stopped ones too"
            fontSize={13}
            lines={[
              { text: 'docker compose ps -a', kind: 'cmd' },
              { text: 'NAME                     SERVICE    STATUS', kind: 'out' },
              { text: 'docker-demo-backend-1    backend    Exited (0)', kind: 'out' },
              { text: 'docker-demo-frontend-1   frontend   Exited (0)', kind: 'out' },
            ]}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'The empty table is the same surprise as last session\u2019s empty docker ps, so name the connection: a container lives as long as its process. Exited (0) means finished cleanly, not crashed.',
  },
  {
    id: 'c4-detached',
    section: 'Running the Stack',
    label: 'What is detached mode',
    element: (
      <ContentNoteSlide
        kicker="Running the Stack"
        title="What is Detached Mode"
        lead="Plain up holds your terminal until the containers finish. With -d, Compose hands it back"
        lesson={SESSION}
        note={{
          kind: 'tip',
          title: 'You have met this before',
          body: (
            <>
              <Code>python manage.py runserver</Code> holds your terminal the same way. The output
              goes to the logs, so <Code>docker compose logs backend</Code> is how you read it
            </>
          ),
        }}
      >
        <Terminal
          path={CWD}
          caption="Terminal · detached"
          fontSize={13}
          lines={[
            { text: 'docker compose up -d', kind: 'cmd' },
            { text: '[+] Running 2/2', kind: 'out' },
            { text: ' \u2714 Container docker-demo-backend-1   Started', kind: 'ok' },
            { text: ' \u2714 Container docker-demo-frontend-1  Started', kind: 'ok' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Once the real Django and React apps are in here they keep running, and then -d is not optional. For today\u2019s two scripts plain up is better, because you can see the output.',
  },
  {
    id: 'c4-volume-works',
    section: 'Running the Stack',
    label: 'Watching the volume work',
    element: (
      <ContentSlide
        kicker="Running the Stack"
        title="Watching the Volume Work"
        lead="Run the stack a second time, and a third. The containers are new every time and the count is not"
        lesson={SESSION}
      >
        <div className="flex items-start gap-6">
          <div className="w-[470px] space-y-3">
            <Terminal
              path={CWD}
              caption="Terminal · the second run"
              fontSize={13}
              lines={[
                { text: 'docker compose up', kind: 'cmd' },
                { text: 'backend-1   | Times started so far: 2', kind: 'ok' },
              ]}
            />
            <Callout kind="success" title="starts.txt is not inside them" asStep={false}>
              It is in the <Code>db_data</Code> volume, on the host
            </Callout>
          </div>
          <VolumeSurvival act={2} runs={3} />
        </div>
      </ContentSlide>
    ),
    notes:
      'Run it a third time in front of them and let them call out the number. One line of output proves the whole volume idea, which is why the script was written to print it.',
  },
  {
    id: 'c4-down',
    section: 'Running the Stack',
    label: 'One command down',
    element: (
      <ContentNoteSlide
        kicker="Running the Stack"
        title="One Command Down"
        lead="Containers and network cleaned up, in the right order, every time"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'The volume survives',
          body: (
            <>
              <Code>db_data</Code> is not removed, so the next <Code>up</Code> still counts on from
              where it left off. Your data is not tied to the containers any more
            </>
          ),
        }}
      >
        <Terminal
          path={CWD}
          caption="Terminal · stopping the whole application"
          fontSize={13}
          lines={[
            { text: 'docker compose down', kind: 'cmd' },
            { text: '[+] Running 3/3', kind: 'out' },
            { text: ' \u2714 Container docker-demo-frontend-1  Removed', kind: 'ok' },
            { text: ' \u2714 Container docker-demo-backend-1   Removed', kind: 'ok' },
            { text: ' \u2714 Network docker-demo_default       Removed', kind: 'ok' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Note the order: frontend removed before backend, the reverse of the start order. That is depends_on working on the way down too, and nobody had to think about it.',
  },
  {
    id: 'c4-down-v',
    section: 'Running the Stack',
    label: 'down -v',
    element: (
      <ContentNoteSlide
        kicker="Running the Stack"
        title="down -v"
        lead="The same command, plus one flag, and the count is back to 1"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'The data is gone permanently',
          body: (
            <>
              <Code>-v</Code> deletes the volumes. Use it only when you deliberately want a factory
              reset of the stack, and never on anything you would miss
            </>
          ),
        }}
      >
        <Terminal
          path={CWD}
          caption="Terminal · the factory reset"
          fontSize={13}
          lines={[
            { text: 'docker compose down -v', kind: 'cmd' },
            { text: 'docker compose up', kind: 'cmd' },
            { text: 'backend-1   | Times started so far: 1', kind: 'out' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Show it, because a room that has never seen the count reset does not believe the volume was doing anything. Then say plainly that this is the one flag in the session that destroys something.',
  },
  {
    id: 'c4-rebuild',
    section: 'Running the Stack',
    label: 'Code changed? Rebuild',
    element: (
      <ContentNoteSlide
        kicker="Running the Stack"
        title="Code Changed? Rebuild"
        lead="Images are frozen at build time, and that has not changed"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'The trap, in its two-container form',
          body: (
            <>
              Without <Code>--build</Code>, Compose reuses the images it already has and your change
              appears to do nothing. This is last session's "I edited the code and still see the old
              output", twice over
            </>
          ),
        }}
      >
        <Terminal
          path={CWD}
          caption="Terminal · after editing app.py or server.js"
          fontSize={13}
          lines={[
            { text: 'docker compose up --build', kind: 'cmd' },
            { text: '[+] Building 2/2', kind: 'out' },
            { text: ' \u2714 backend   Built', kind: 'ok' },
            { text: ' \u2714 frontend  Built', kind: 'ok' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Name the trap by name and in their own words from last session. Twice over is the new part: with two services, one can be rebuilt and the other stale, and the symptoms are baffling.',
  },
  {
    id: 'c4-wrong-folder',
    section: 'Running the Stack',
    label: 'The error you will hit',
    element: (
      <ContentNoteSlide
        kicker="Running the Stack"
        title="The Error You Will Hit"
        lead="Run it one level up, from C:\nxttrendz, and Compose stops before it starts"
        lesson={SESSION}
        note={{
          kind: 'note',
          title: 'Why',
          body: (
            <>
              <Code>docker compose</Code> reads <Code>docker-compose.yml</Code> from the folder you
              are standing in. One level up, there is no such file. Same lesson as last session's
              build context: read the path in your prompt before you blame the tool
            </>
          ),
        }}
      >
        <Terminal
          path={PROJECT}
          caption="Terminal · the wrong folder"
          fontSize={13}
          lines={[
            { text: 'docker compose up', kind: 'cmd' },
            { text: 'no configuration file provided: not found', kind: 'out' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Point at the prompt path in the panel, not at the error. Every folder mistake this course has produced is visible in the prompt before the command runs, and that habit is worth more than the error message.',
  },
  {
    id: 'c4-summary',
    section: 'Running the Stack',
    label: 'Command summary',
    element: (
      <ContentSlide
        kicker="Running the Stack"
        title="Command Summary"
        lead="Every command in this session, in one place"
        lesson={SESSION}
      >
        <DataTable
          compact
          columns={[
            { label: 'Command', weight: 1.1 },
            { label: 'Purpose', weight: 1.7, dim: true },
          ]}
          rows={[
            ['docker compose up', 'Build if needed, then start all services, output in the terminal'],
            ['docker compose up -d', 'Same, in the background'],
            ['docker compose up --build', 'Force a rebuild of the images first'],
            ['docker compose ps -a', "List this app's containers, running and stopped"],
            ['docker compose logs <service>', "View one service's output"],
            ['docker compose down', 'Remove the containers and network, volumes survive'],
            ['docker compose down -v', 'Same, plus DELETE the volumes. Data loss, deliberate use only'],
          ]}
          highlight={[7]}
        />
      </ContentSlide>
    ),
    notes:
      'The slide the room photographs. Seven commands for a whole application, against six per pair of services by hand. Then close the laptops for the last four slides, because they are the important ones.',
  },
  {
    id: 'c4-localhost',
    section: 'Running the Stack',
    label: 'localhost is not the other container',
    element: (
      /*
        THE SESSION'S LAST IDEA, AND ITS MOST IMPORTANT.

        Act 0 only. The frontend's request leaves and comes straight back to
        itself. The backend is drawn identically to act 1 and is never reached:
        dimming it would suggest the backend is the problem, when the problem is
        the address.
      */
      <ContentSlide
        kicker="Running the Stack"
        title="localhost Is Not the Other Container"
        lead="Why http://backend:8000, and not localhost:8000, the address that worked all through the integration course?"
        lesson={SESSION}
        points={[
          {
            text: 'localhost means "this machine, right here"',
            sub: 'And inside a container, here is the container itself',
          },
          {
            text: 'The request never leaves',
            sub: 'It goes back into its own container, where nothing is listening',
          },
          { text: 'This is the number one multi-container mistake', tone: 'brand' },
        ]}
      >
        <ComposeNetwork act={0} />
      </ContentSlide>
    ),
    notes:
      'Their whole experience of localhost is on one machine where it always worked, so this is unlearning, not learning. Our two scripts only print, so neither actually calls the other today. It is much cheaper to understand now, with two scripts, than to debug later.',
  },
  {
    id: 'c4-service-name',
    section: 'Running the Stack',
    label: 'Service names are hostnames',
    element: (
      /*
        SLIDE 60'S FRAME, EXACTLY. This is the pair the whole session builds to,
        and `ComposeNetwork`'s own contract is that both acts draw the same two
        containers in the same positions so that THE ONLY THING THAT CHANGES IS
        WHERE THE ARROW GOES.

        The figure honoured that internally and the two SLIDES broke it: 60 is a
        two-column `ContentSlide`, so the 620px figure sat in the right column,
        and 61 was a `ContentNoteSlide` with no points, so the same figure sat at
        the body's left edge, 530px left and 60px up. The room saw two diagrams,
        which is precisely the reading the figure was built to prevent.

        So 61 is now the same layout as 60: bullets left, figure right, at the
        same x and y. It also fixes two things at once, because the full-width
        note this replaced ran its last line under the nav arrows, and the
        bullets have room to define `hostname`, which the deck used in this
        title and never explained.
      */
      <ContentSlide
        kicker="Running the Stack"
        title="Service Names Are Hostnames"
        lead="Remember the network Compose created without being asked? Every service in the file is attached to it"
        lesson={SESSION}
        points={[
          {
            text: 'A hostname names a machine in an address',
            sub: 'localhost is one you already know',
          },
          {
            text: 'On this network, that name is the service name',
            sub: "So the backend's address is backend:8000",
          },
          { text: 'Not localhost, and not an IP address', tone: 'brand' },
        ]}
      >
        <ComposeNetwork act={1} />
      </ContentSlide>
    ),
    notes:
      'The word hostname is new: it is the name you put in an address where a machine belongs, and localhost is one they already know. Point out that the picture has not changed at all from the last slide, only the arrow, because that is the whole teaching. Then land the rename: change the service to api: and the address becomes api:8000, which is why choosing service names carefully was worth mentioning back on slide 36. Service names are not labels, they are addresses.',
  },
  {
    id: 'c4-who-uses-which',
    section: 'Running the Stack',
    label: 'Who uses which',
    element: (
      /*
        S1 IS ENFORCED HERE. Row two names the outside world and leaves it
        unopened: no port, no ports: key, no browser. It is a real problem of
        equal weight, and it is not today's, so it is stated plainly rather than
        greyed out.
      */
      <ContentNoteSlide
        kicker="Running the Stack"
        title="Who Uses Which"
        lead="Two cases, and only one of them is open to you today"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'One line to remember',
          body: <>Inside Docker, a service name is an address</>,
        }}
      >
        <DataTable
          columns={[
            { label: 'Who is connecting', weight: 1.2 },
            { label: 'Where the code runs', weight: 1.2 },
            { label: 'Address to use', weight: 1.1 },
          ]}
          rows={[
            ['One container to another', 'Inside Docker, on the Compose network', 'backend, the service name'],
            ['Anything else to a container', 'Outside Docker', 'Not possible until the service opens a port'],
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Row two will get a question. Answer it in one sentence: opening a container to the world outside Docker is a separate key, and it comes later in this course. Do not name the key and do not draw it.',
  },
  {
    id: 'c4-same-file-only',
    section: 'Running the Stack',
    label: 'Same file, same network',
    element: (
      <ContentNoteSlide
        kicker="Running the Stack"
        title="Same File, Same Network"
        lead="The boundary of the claim, so nobody over-generalises it"
        lesson={SESSION}
        note={{
          kind: 'note',
          title: 'Which is why it needed no setup from you',
          body: (
            <>
              Only services in the same Compose file share this network. A container started by a
              separate <Code>docker run</Code> is not on it and cannot resolve <Code>backend</Code>
            </>
          ),
        }}
        points={[
          {
            text: 'One file, one network, one project',
            sub: 'The project name on every created thing is what keeps them apart',
          },
        ]}
      />
    ),
    notes:
      'Short, and it closes a loop: the project name from slide 51 is the mechanism behind the boundary. Somebody always tries to reach a compose service from a stray docker run container, and this is the slide that told them why it fails.',
  },

  /* --- Back matter, slides 64 to 69 --------------------------------- */
  {
    id: 'quiz',
    section: 'Close',
    label: 'Quiz Time!',
    element: (
      <QuizTimeSlide
        subtitle="One file, one command, and the address that is not localhost"
        lesson={SESSION}
      />
    ),
    notes:
      'The late checkpoint. The question worth asking is the networking one, because it is the only idea today that contradicts something they already believed. Hand over to the quiz component.',
  },
  {
    id: 'takeaways',
    section: 'Close',
    label: 'Key Takeaways',
    element: (
      /*
        THE AGENDA'S FOUR ITEMS, RESTATED AS OUTCOMES, in a different UI. Same
        four things the room was promised on slide 6, in the same order, now
        phrased as things they can do.
      */
      <KeyTakeawaysSlide
        kicker={SESSION}
        title="Key Takeaways"
        lesson={SESSION}
        points={[
          {
            text: 'Containerise an app in any runtime',
            sub: 'Swap the base image, the dependency file and the start command',
          },
          {
            text: 'Say why running containers by hand does not scale',
            sub: 'Six commands per two services, and none of it written down',
          },
          {
            text: 'Write a docker-compose.yml',
            sub: 'services, build, depends_on, environment and volumes',
          },
          {
            text: 'Start and stop a whole stack with one command',
            sub: 'And address one container from another by its service name',
          },
        ]}
      />
    ),
    notes:
      'Point back at the agenda as you read: same four items, now in the past tense. If a takeaway does not match an agenda item, one of the two slides is wrong.',
  },
  {
    id: 'practice',
    section: 'Close',
    label: 'Try it by yourself',
    element: (
      <PracticeSlide
        kicker={SESSION}
        title="Try it by yourself"
        prompt="Add a third service to your compose file, on a third runtime, and prove to yourself that the volume survives"
        lesson={SESSION}
        tasks={[
          { text: 'Create a third folder with its own Dockerfile', sub: 'Pick any base image you like from Docker Hub' },
          { text: 'Give it one environment variable and print it', sub: 'The same shape as APP_ENV' },
          { text: 'Make the frontend depend on it too', sub: 'Then watch the start order in the output' },
          { text: 'Run down, then up, and check the count', sub: 'Then down -v, and check it again' },
        ]}
      />
    ),
    notes:
      'The shape, not the solution. A third service is a symmetric extension of everything they just did, so nobody needs a new idea to finish it. The last task is the one that proves they understood volumes.',
  },
  {
    id: 'feedback',
    section: 'Close',
    label: 'Feedback',
    element: <FeedbackSlide lesson={SESSION} />,
    notes:
      'Ask specifically whether the networking section landed, because it is the one idea in this session that has to overwrite something they already believed.',
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
        title="Running Project on Docker"
        lesson={SESSION}
      />
    ),
    notes:
      'Say the name and stop: Running Project on Docker. The slide carries nothing else on purpose, so anything about what moves in next time is spoken, not read. Naming the session is required; naming any TOOL it introduces is not.',
  },
  {
    id: 'thankyou',
    section: 'Close',
    label: 'Thank You',
    element: (
      /*
        NO MESSAGE. The deck already ends on slide 68's teaser, and a line here as
        well gave it two endings, which is the same reason `ThankYouSlideProps`
        carries no `nextUp`. The mark on stage is the whole slide.
      */
      <ThankYouSlide lesson={SESSION} />
    ),
    notes: 'Close. The mark is on stage here, so the footer does not print a second one.',
  },
]
