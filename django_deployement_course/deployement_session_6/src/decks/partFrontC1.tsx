import type { SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentNoteSlide,
  ContentSlide,
  QuestionSlide,
  SectionBreakerSlide,
  WelcomeSlide,
} from '@/slides'
import { BoundaryBridge, CodeBlock, DataTable, LayerStack, Terminal } from '@/ui'
import {
  AT_ROOT,
  C1,
  C2,
  C3,
  C4,
  Code,
  DOCKER_ID,
  IMAGE,
  MK_TARGETS_ONLY,
  REPO,
  SESSION,
  Tech,
} from './deckShared'

/**
 * SESSION 6 · slides 1 to 20: the front frame and Concept 1.
 *
 * Generated from rows 1 to 20 of §4 of
 * `django_deployement_course/session_plans/deployement_session_6/plan.md`.
 * The ids below match the plan's `id` column so the two read side by side.
 *
 * Rules this segment is written against, each because of something that would
 * otherwise be rendered wrong:
 *
 *   R5  EVERY WIDE CHILD SLIDE CARRIES A `lead`. The lead is what pushes a
 *       `Terminal`, `CodeBlock`, `DataTable`, `LayerStack` or `BoundaryBridge` below
 *       y=220 and out of the instructor-video rectangle. Ten slides in session 4
 *       failed `video-safe.mjs` for want of one.
 *
 *   R3  MAKEFILE PANELS PASS `language="makefile"`. `CodeBlock` defaults the prop
 *       to `'python'` and the same prop is the chip label, so slide 3 would ship
 *       a `python` chip on a Makefile.
 *
 *   R8  EVERY TRANSCRIPT IS QUOTED FROM THE TR, NOT CAPTURED. Docker Desktop
 *       cannot run on the capture machine, and this session additionally needs a
 *       real Hub account and a real push.
 */

/* ══ FRONT FRAME (1 to 5) ═══════════════════════════════════════════════ */

export const partFrontC1: SlideDef[] = [
  {
    id: 'brand',
    section: 'Opening',
    label: 'Brand',
    element: <BrandSlide greeting="Welcome" lesson={SESSION} />,
    notes: 'Leave it up while the room settles. Say nothing over it.',
  },
  {
    id: 'welcome',
    section: 'Opening',
    label: 'Session name',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
    notes: 'Read the session name once, then move on.',
  },
  {
    /*
      Opens on the file the room wrote, not on a summary of it. `MK_SESSION_5`
      is the shared string, so this panel and any later render of the same file
      cannot drift.

      THE PANEL SHOWS THE SEVEN TARGETS, AND THERE IS NO CALLOUT. Two harness
      runs settled this: the full nineteen-line file plus a `Remember` note put
      the note 111px below the frame, and trimming the panel to the seven
      targets still left 86px over and the note title under the nav controls.
      A fourteen-line panel and a callout do not fit on one slide, so the
      callout's claim became the lead, where it is the first thing read instead
      of the last. `.PHONY` and `IMAGE_NAME` are not on screen and are not
      claimed to be.
    */
    id: 'recap-makefile',
    section: 'Opening',
    label: 'Last session, the file',
    element: (
      <ContentSlide
        kicker="Recap"
        title="Where we Left Off"
        lead={
          <>
            {'Every operation this project supports has a one-word name in the '}
            <Tech name="makefile" label="Makefile" />
            {", and that file ships with the project"}
          </>
        }
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[880px]">
          <CodeBlock code={MK_TARGETS_ONLY} filename="Makefile" language="makefile" fontSize={13} />
        </div>
      </ContentSlide>
    ),
    notes:
      'Point at the tab on the first indented line and ask what happens if it is spaces. Do not re-teach the file, it is one slide of orientation.',
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        title="Today's Agenda"
        items={[
          { title: C1, sub: 'Where the image lives, and the registry that frees it' },
          { title: C2, sub: 'Why the name has three parts' },
          { title: C3, sub: 'Three commands, and the image leaves the laptop' },
          { title: C4, sub: 'Unique tags, rollback, and one more target' },
        ]}
        lesson={SESSION}
      />
    ),
    notes: 'Four concepts, one per section of the doc. Read the first gloss and hand over to the divider.',
  },
  {
    /*
      The Hub account is on the setup slide on purpose: signup needs an email
      confirmation, and a room discovering that at slide 30 loses ten minutes.
    */
    id: 'setup',
    section: 'Opening',
    label: 'Initial Setup',
    element: (
      <ContentSlide
        kicker="Setup"
        title="Initial Setup"
        lead="Run these terminal commands step by step :"
        points={[
          { text: <><Code>docker --version</Code>{' prints a version, so the engine is installed'}</> },
          { text: <><Code>make build</Code>{' finishes without an error'}</> },
          { text: <><Code>docker images</Code>{' lists '}<Code>nxttrendz-backend</Code></> },
          { text: <>{'A free account at '}<Code>hub.docker.com</Code>{', created before this session'}</> },
        ]}
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="Docker Desktop running, whale steady in the tray"
          lines={[
            { text: 'docker --version', kind: 'cmd' },
            { text: 'Docker version 27.3.1, build ce12230', kind: 'out' },
            { text: 'make build', kind: 'cmd' },
            { text: 'docker images', kind: 'cmd' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Ask the room to call out if the first command errors, and ask who has not made the Hub account yet. Wait for hands, because the signup confirmation email is the thing that stalls a room at slide 30.',
  },

  /* ══ CONCEPT 1 · Images Trapped on One Machine (6 to 20) ════════════════ */

  {
    id: 'c1-divider',
    section: C1,
    label: 'Divider 1',
    element: (
      <SectionBreakerSlide
        index={1}
        title={C1}
        subtitle="And the registry that frees them"
        lesson={SESSION}
      />
    ),
    notes:
      'Hand over verbally: "make build gave us an image in one word, so where does that image actually live?"',
  },
  {
    id: 'c1-where-does-it-live',
    section: C1,
    label: 'Where it lives',
    element: (
      <ContentSlide
        kicker={C1}
        title="Where It Lives"
        lead="The image exists, so put the promise to the test and ask where it is"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <Terminal
            path={AT_ROOT}
            caption="The local image store on this machine"
            lines={[
              { text: 'docker images', kind: 'cmd' },
              { text: 'REPOSITORY           TAG       IMAGE ID       CREATED       SIZE', kind: 'out' },
              { text: 'nxttrendz-backend    latest    3f2a8b91c04d   2 hours ago   156MB', kind: 'out' },
            ]}
            fontSize={13}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Point at the size column and say the number out loud, because slide 9 comes back to it. Say that a frontend row sits under this one on their screen and that the backend is the example we follow.',
  },
  {
    id: 'c1-and-nowhere-else',
    section: C1,
    label: 'And nowhere else',
    element: (
      <ContentSlide
        kicker={C1}
        title="And Nowhere Else"
        lead="It lives in this machine's local image store, and in no other place"
        points={[
          { text: 'A teammate cannot run it' },
          { text: 'An automation server cannot test it' },
          { text: 'The AWS server this course ends on cannot deploy it' },
          {
            text: (
              <>
                {'"Runs identically on any machine" is true only for machines that '}
                <strong>have</strong>
                {' the image, and right now that is exactly one'}
              </>
            ),
          },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'Read the first three flat, then pause before the last line: it is the promise from session 1 held against reality. Ask who they would send the image to first.',
  },
  {
    id: 'c1-question',
    section: C1,
    label: 'The question',
    element: (
      <QuestionSlide
        kicker={C1}
        question="156MB, and your Python code is a few hundred kilobytes. What is the other 155MB?"
        qualifier="The same build, every time, on any machine"
        lesson={SESSION}
      />
    ),
    notes:
      'Ask it and wait. Take two or three answers out loud and write none of them down. Do not answer it here, the next slide is the answer.',
  },
  {
    /*
      Layers are listed TOP FIRST, which is the order `LayerStack` renders and
      the order the figure has to read in: Python at the bottom, the start
      command at the top. The plan's "bottom up" describes the picture, not the
      array.
    */
    id: 'c1-inside-the-image',
    section: C1,
    label: 'Inside the image',
    element: (
      <ContentSlide
        kicker={C1}
        title="Inside the Image"
        lead="Read the Dockerfile as a list of ingredients: each instruction adds one layer"
        lesson={SESSION}
      >
        <div className="mx-auto">
          <LayerStack
            title="backend image, 156MB"
            width={620}
            caption="A complete Linux environment with the app already installed in it"
            layers={[
              { label: 'Working directory, and the start command', note: 'WORKDIR, CMD', state: 'ships' },
              { label: 'Your Django code', note: 'COPY . .', state: 'ships' },
              {
                label: 'Django, DRF, every package from requirements.txt',
                note: 'RUN pip install',
                state: 'ships',
              },
              {
                label: <Tech name="python" label="Python 3.13 and the Debian libraries" />,
                note: 'FROM',
                state: 'ships',
              },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Build it from the bottom as you talk, and name the instruction that put each layer there. The room wrote all four lines in session 4.',
  },
  {
    id: 'c1-what-it-saves',
    section: C1,
    label: 'What it saves',
    element: (
      <ContentSlide
        kicker={C1}
        title="What It Saves"
        lead="Every layer answers a question the receiving machine would otherwise answer for itself"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <DataTable
            compact
            columns={[
              { label: 'Inside the image', weight: 1 },
              { label: 'Put there by', weight: 0.9 },
              { label: 'What the machine no longer does', weight: 1.3 },
            ]}
            rows={[
              ['Linux and the language runtime', <Code>FROM</Code>, 'Install the right Python or Node version'],
              ['Installed dependencies', <Code>RUN pip install</Code>, 'Run an install that can fail or drift'],
              ['Your application code', <Code>COPY . .</Code>, 'Fetch the source from anywhere'],
              [
                'Working directory, start command',
                <>
                  <Code>WORKDIR</Code>
                  {', '}
                  <Code>CMD</Code>
                </>,
                'Know how to launch the app',
              ],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Run your finger down the third column, not across the rows. That column is the whole argument for sending an image instead of source.',
  },
  {
    /*
      The apparent contradiction is the best evidence in the session, so it gets
      a slide of its own. The panel is one line because that is the only line of
      the file the TR quotes.
    */
    id: 'c1-the-proof',
    section: C1,
    label: 'The proof',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="The Proof"
        lead="Two statements that look like a contradiction, and both are true"
        points={[
          { text: <>{"Your machine's "}<Tech name="nodejs" label="node_modules/" />{' was blocked from entering'}</> },
          { text: <><Code>RUN npm install</Code>{' then created a fresh one inside the image'}</> },
        ]}
        note={{
          kind: 'note',
          title: 'Remember',
          /* Two sentences, not three: at three lines the last one sat under the
             nav controls, which `align-check.mjs` reports as a CHROME hit. */
          body: 'Your packages are compiled for your OS, the image\'s for its own Linux. The image does not carry a copy of your machine, it carries an environment built correctly for itself.',
        }}
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[640px]">
          <CodeBlock
            code={'node_modules/'}
            filename="frontend\.dockerignore"
            language="dockerignore"
            showLineNumbers={false}
            fontSize={16}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'State the contradiction and let it sit for a beat before you resolve it. Ask which of the two node_modules folders is in the image.',
  },
  {
    id: 'c1-not-inside',
    section: C1,
    label: 'Deliberately left out',
    element: (
      <ContentSlide
        kicker={C1}
        title="Deliberately Left Out"
        lead="This short list is what makes a public push safe"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <DataTable
            compact
            columns={[
              { label: 'Left out', weight: 0.8 },
              { label: 'Why', weight: 1.7 },
            ]}
            rows={[
              [
                <>
                  <Code>.env</Code>
                  {' and the '}
                  <Code>SECRET_KEY</Code>
                </>,
                'The project-root .env sits outside both build contexts, and .dockerignore guards against a stray copy. A secret must never be frozen into an image bound for a public registry',
              ],
              [
                <>
                  <Code>db.sqlite3</Code>
                  {' and '}
                  <Code>data/</Code>
                </>,
                'Months of local test data. The server keeps its own database in its own volume, as session 4 set up',
              ],
              [
                <Code>VITE_API_BASE_URL</Code>,
                "The backend's address differs per environment, so Compose supplies it at run time",
              ],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Read the same table shape as the last one, inverted. Say the stake out loud: this is why we can push to a public repository in twenty minutes.',
  },
  {
    id: 'c1-defining-property',
    section: C1,
    label: 'What an image is',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="What an Image Is"
        noteFirst
        note={{
          kind: 'success',
          title: 'Remember',
          body: (
            <>
              {'The image holds everything needed to '}
              <strong>run</strong>
              {' the app, and nothing that ties it to the machine that built it.'}
            </>
          ),
        }}
        points={[
          { text: 'Code, runtime and dependencies are baked in' },
          { text: 'Configuration arrives from outside, at start-up' },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'Read the note once, slowly, and let the two lines under it stand as the evidence. This sentence is the thesis of the session, so say it in the same words later.',
  },
  {
    id: 'c1-why-not-the-code',
    section: C1,
    label: 'Why not the code',
    element: (
      <ContentSlide
        kicker={C1}
        title="Why Not the Code"
        lead="The objection is fair, so compare what a server has to do with each"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <DataTable
            compact
            columns={[
              { label: '', weight: 0.65 },
              { label: <Tech name="git" label="Ship the source repository" />, weight: 1.5 },
              { label: 'Ship the image', weight: 1 },
            ]}
            rows={[
              ['Server receives', 'Text files', 'A ready-built environment'],
              [
                'Server must then',
                'Install Python 3.13, create a venv, pip install -r requirements.txt, install Node 20, npm install',
                <Code>docker run</Code>,
              ],
              ['Time', 'Minutes, and it can fail', 'Seconds'],
              [
                'Result',
                'Similar to your setup, never provably identical',
                <>
                  <strong>Byte-for-byte</strong>
                  {' what you built and tested'}
                </>,
              ],
            ]}
          />
          {/* The verdict is stated, not left to the reader. Session 5 shipped a
              comparison with no verdict line and it was logged as a defect. */}
          <p className="mt-4 font-heading text-body-lg font-bold text-ink">
            A repository asks every machine to rebuild and hope, an image removes the hoping
          </p>
        </div>
      </ContentSlide>
    ),
    notes:
      'Read the second row aloud in full, because its length is the argument. Then read the verdict line and stop, it is the answer to the objection.',
  },
  {
    id: 'c1-both-travel',
    section: C1,
    label: 'Both still travel',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="Both Still Travel"
        note={{
          kind: 'note',
          title: 'Note',
          body: 'Git is not made redundant by any of this. Later in this course the automation server clones the source to build the image, and then pushes the image for the server to run.',
        }}
        points={[
          { text: <Tech name="git" label="Source travels to the builder" /> },
          { text: <Tech name="docker" label="Images travel to the runners" /> },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'Say this before anyone asks whether they should stop pushing to Git. The two sit at different points in the same chain.',
  },
  {
    /*
      ContentNoteSlide rather than the plan's ContentSlide: the registry is
      defined here, and content rule 7 wants a definition to carry what it is,
      why it exists and where the room already met it. A callout holds all three
      and a bullet does not.
    */
    id: 'c1-already-pulling',
    section: C1,
    label: 'You already pull',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="You Already Pull"
        lead="Three lines the room has already written, and every one of them came from somewhere"
        note={{
          kind: 'info',
          title: 'Definition',
          body: (
            <>
              {'A '}
              <strong>registry</strong>
              {' is a central service on the internet that stores and distributes images. '}
              <Tech name="docker" label="Docker Hub" />
              {' is the default one, and every '}
              <Code>FROM</Code>
              {' line since session 1 has been pulling from it.'}
            </>
          ),
        }}
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[760px]">
          <CodeBlock
            code={
              'FROM python:3.13-slim      # backend\\Dockerfile\n' +
              'FROM node:20-alpine        # frontend\\Dockerfile\n' +
              'docker run hello-world     # session 1'
            }
            language="text"
            showLineNumbers={false}
            fontSize={15}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Ask where hello-world came from in session 1 and wait for someone to say "it downloaded". That is the answer, and they have had it since day one.',
  },
  {
    id: 'c1-two-way-street',
    section: C1,
    label: 'A two-way street',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="A Two-Way Street"
        noteFirst
        note={{
          kind: 'success',
          title: 'Remember',
          body: (
            <>
              <Tech name="docker" label="Docker Hub" />
              {' is a two-way street. Anyone can pull public images down, and with a free account you can push your own images up.'}
            </>
          ),
        }}
        points={[
          { text: 'Pull is every build the room has run so far' },
          { text: 'Push is what today adds' },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'This is the hinge of the session. Say that the direction reverses today, and that nothing else about the tool changes.',
  },
  {
    /*
      The one slide in this concept that asks the room to DO something, and the
      one place the exclusion list on slide 13 pays off.
    */
    id: 'c1-the-account',
    section: C1,
    label: 'The account',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="The Account"
        lead="Pushing needs a free account, and the username you choose becomes part of every image name"
        points={[
          {
            text: (
              <>
                <Tech name="docker" label="hub.docker.com" />
                {', free, with unlimited public repositories'}
              </>
            ),
          },
          { text: <>{'A '}<strong>Docker ID</strong>{' is chosen at signup, and it is your username there'}</> },
          {
            text: (
              <>
                {'This course writes '}
                <Code>{DOCKER_ID}</Code>
                {' everywhere, and every learner substitutes their own'}
              </>
            ),
          },
        ]}
        note={{
          kind: 'warning',
          title: 'Public means public',
          body: 'Anything in a public repository is visible to the whole world. That is safe here only because the image carries no .env, no SECRET_KEY and no database file, for the reasons the last few slides listed.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'Ask everyone to type their own Docker ID into the chat now, so nobody is inventing one at the push. Read the warning as a rule, not as a caution.',
  },
  {
    id: 'c1-target-picture',
    section: C1,
    label: 'The target picture',
    element: (
      <ContentSlide
        kicker={C1}
        title="The Target Picture"
        lead="Where the image is going by the end of this session, and what moves it there"
        lesson={SESSION}
      >
        {/*
          `BoundaryBridge`, not `FlowChart`. The old version had to render
          `docker push` and `docker pull` as pill-shaped NODES, because
          `FlowChart` cannot label an edge: a command became a box in a row of
          boxes. This figure draws each machine inside its own boundary and the
          commands as the spans that cross them, which is this concept's whole
          argument. `issuedBy` says who typed the command without turning the
          payload arrow around.
        */}
        <BoundaryBridge
          stations={[
            { label: IMAGE, caption: 'built on your laptop', logo: 'docker', kind: 'source' },
            { label: 'Docker Hub', caption: REPO, logo: 'docker', kind: 'hub', tone: 'accent' },
            { label: 'Any machine', caption: 'runs the same image', icon: 'server', kind: 'target', tone: 'teal' },
          ]}
          legs={[
            { label: 'docker push', sub: 'once per release', issuedBy: 'left' },
            { label: 'docker pull', sub: 'on every machine', issuedBy: 'right' },
          ]}
          caption="The image only moves when a command crosses a machine boundary"
        />
      </ContentSlide>
    ),
    notes:
      'This picture is the map for the rest of the session and the two after it. Point at the middle box and say the automation server will push there, and the AWS server will pull from there.',
  },
]
