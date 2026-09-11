import type { SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentNoteSlide,
  ContentSlide,
  SectionBreakerSlide,
  WelcomeSlide,
} from '@/slides'
import { CodeBlock, DataTable, LayerStack, Terminal } from '@/ui'
/* Promoted from `slide-kit/isolation-lab`. Imported by path, the way the other
   promoted lab families are, rather than through the kit-owned `@/ui` barrel. */
import { LoneHost } from '@/ui/isolation/LoneHost'
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
  S1,
  S4,
  SESSION,
  Tech,
} from './deckShared'

/**
 * SESSION 6 · slides 1 to 17: the front frame and Concept 1.
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
        title="Where We Left Off"
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
          { title: C1, sub: 'Where the image lives, and the registry that moves it' },
          { title: C2, sub: 'Log in first, then why the name has three parts' },
          { title: C3, sub: 'Two commands, and the image leaves the laptop' },
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
      confirmation, and a room discovering that at `c2-login` loses ten minutes.
    */
    id: 'setup',
    section: 'Opening',
    label: 'Initial Setup',
    element: (
      <ContentSlide
        kicker="Setup"
        title="Initial Setup"
        lead="Run these terminal commands step by step"
        points={[
          { text: <><Code>docker --version</Code>{' prints a version, so the engine is installed'}</> },
          { text: <><Code>make build</Code>{' finishes without an error'}</> },
          { text: <><Code>docker images</Code>{' lists '}<Code>nxttrendz-backend</Code></> },
        ]}
        lesson={SESSION}
      >
        {/*
          THE PANEL DREW TWO COMMANDS PRODUCING NOTHING WHILE THE TEXT CLAIMED
          THEY PRODUCED SOMETHING, AND ITS CAPTION ASSERTED A TRAY.

          Three separate honesty faults, all in one figure:

          1. The caption read "Docker Desktop running, its icon showing in the
             tray". This is VS Code's integrated panel. There is no tray in it,
             no icon and no desktop, so the caption asserted evidence the
             drawing cannot contain (content rule 8).
          2. `make build` and `docker images` were drawn as `cmd` lines with NO
             output, directly under bullets claiming `make build` "finishes
             without an error" and `docker images` "lists nxttrendz-backend".
             The panel contradicted the text above it.
          3. Only `docker --version` ever had its output quoted.

          The panel now shows the one command whose output this deck actually
          has, and the caption says what the drawing shows. The other three
          bullets stay as bullets, which is what they are: checks the learner
          performs before the session, not output to read off a screen.
          `docker images` output belongs to `c1-where-does-it-live`, which is
          where the room reads it properly.
        */}
        <Terminal
          path={AT_ROOT}
          caption="The engine answers, so Docker is installed"
          lines={[
            { text: 'docker --version', kind: 'cmd' },
            { text: 'Docker version 27.3.1, build ce12230', kind: 'ok' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Ask the room to call out if the first command errors, and ask who has not made the Hub account yet. Wait for hands, because the signup confirmation email is the thing that stalls a room at the login slide.',
  },

  /* ══ CONCEPT 1 · Image on One Machine (6 to 20) ═════════════════════════ */

  {
    id: 'c1-divider',
    section: C1,
    label: 'Divider 1',
    element: (
      <SectionBreakerSlide
        index={1}
        title={C1}
        subtitle="And the registry that moves them"
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
        lead="This image exists, so ask Docker where it is"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <Terminal
            path={AT_ROOT}
            caption="Local image store on this machine"
            lines={[
              { text: 'docker images', kind: 'cmd' },
              { text: 'REPOSITORY           TAG       IMAGE ID       CREATED       SIZE', kind: 'out' },
              { text: 'nxttrendz-backend    latest    3f2a8b91c04d   2 hours ago   156MB', kind: 'out' },
              { text: 'nxttrendz-frontend   latest    8c41d7e2b9a3   2 hours ago   48MB', kind: 'out' },
            ]}
            fontSize={13}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Read the repository column: TWO images, because the app is two services. The backend is the example we follow, and the frontend comes back at the end of the push concept. Say that a frontend row sits under this one on their screen and that the backend is the example we follow.',
  },
  {
    /*
      THE FIGURE REPLACES THE BULLETS. IT DOES NOT SIT BESIDE THEM.

      This shipped as four full-width bullets with an empty right half, and the
      fourth was a two-line paragraph reading oddly beside three short ones.
      The obvious repair was a figure in the right half, and `slide-kit/
      isolation-lab` built four candidates for it. Judging them showed the
      repair was wrong: with a points column the slide states the same three
      machines TWICE, once as prose and once as tiles, and no arrangement of
      the two fixes that.

      `LoneHost` won on content rule 8. Four identical frames with a slot in
      the same place, and the only difference is that one slot has something in
      it: no dimming, no crossing out, no connectors. A severed connector still
      draws a relationship where an empty slot draws none, and none is the
      literal truth of a build that has run once on one laptop. `FanOut` was
      rejected outright, because it argues "one thing becomes many" which is
      the opposite of this slide, and the lab's `BlockedFan` candidate proved
      that inverting `FanOut`'s connectors does not invert its composition:
      three curves leaving one box still read as distribution.

      The fourth line is the concept's punchline, so it is the callout rather
      than a bullet or a caption. The lab's first pass buried it inside the
      figure at 7px, which made the most important sentence on the slide the
      smallest text on it.

      `LoneHost`'s ceiling is THREE recipients: a fourth leaves the frames too
      short for a machine name at the 16px floor. This slide has three.
    */
    id: 'c1-and-nowhere-else',
    section: C1,
    label: 'And nowhere else',
    element: (
      <ContentSlide
        kicker={C1}
        title="And Nowhere Else"
        lead="It lives in this machine's local image store, and in no other place"
        lesson={SESSION}
      >
        {/*
          THE CONCLUSION IS A RULED LINE, NOT A CALLOUT, AND THAT IS FORCED.

          `ContentNoteSlide` was the obvious home for it and it does not fit:
          the figure is 292px and the note's box 99px in a 439px well, and the
          note lands at the well's FOOT rather than under the figure, so its
          left half rendered under the deck's own control bar. Dropping the
          note's `title` does not shrink it either, because `Callout` falls back
          to the kind's own label (`{title ?? k.label}`), so a titleless
          callout is not expressible.

          `ContentSlide` has no `caption`, and `SlideLead` is the opening
          sentence rather than a closing one, so the kit has no affordance for a
          trailing line under a figure. This is the third gap of the same shape
          the four labs found, and it is why this is hand-drawn rather than
          composed. The treatment is `isolation-lab`'s own, copied exactly: a
          top rule, body type, its own reveal group so it arrives after the
          figure instead of with it.
        */}
        <div className="mx-auto w-full max-w-[980px]">
          <LoneHost
            width={900}
            /* `IMAGE` ALONE, NOT `${IMAGE}:latest`.

               The lab's fixture wrote `nxttrendz-backend:latest` and copying it
               verbatim broke content rule 24: the `repository:tag` colon form is
               not taught until `c2-name-anatomy` and `c2-docker-tag`, fifteen
               slides later. Slide 7 does show the word `latest`, but as a value
               in the real `docker images` TAG column, which is not the same
               thing as the composed name a learner has never seen assembled. */
            artefact={{ label: 'The image', ref: IMAGE, icon: 'file' }}
            holder={{ label: 'This machine', note: 'Local image store', icon: 'devices' }}
            recipients={[
              { id: 'teammate', label: 'A teammate', cannot: 'run it' },
              { id: 'ci', label: 'An automation server', cannot: 'test it' },
              { id: 'prod', label: 'A remote server', cannot: 'deploy it for real users' },
            ]}
          />
          <p className="mt-6 border-t-2 border-line pt-3 text-body leading-[1.5] text-ink">
            {'"Runs identically on any machine" is true only for machines that '}
            <strong>have</strong>
            {' the image, and right now that is exactly one'}
          </p>
        </div>
      </ContentSlide>
    ),
    notes:
      'Point at the one filled slot, then at the three empty ones, and let the room say why before you read the callout. Nothing is dimmed or crossed out here: the slot is simply empty, which is the whole claim.',
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
        lead="Three lines you have already written, and every one of them came from somewhere"
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
              {` line since ${S1} has been pulling from it.`}
            </>
          ),
        }}
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[760px]">
          <CodeBlock
            code={
              'FROM python:3.14-slim      # backend\\Dockerfile\n' +
              'FROM node:22-alpine        # frontend\\Dockerfile\n' +
              'docker run hello-world     # Introduction to Docker'
            }
            language="text"
            showLineNumbers={false}
            fontSize={15}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Ask where hello-world came from in Introduction to Docker and wait for someone to say "it downloaded". That is the answer, and they have had it since day one.',
  },
  {
    id: 'c1-two-way-street',
    section: C1,
    label: 'Both directions',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="Both Directions"
        noteFirst
        note={{
          kind: 'success',
          title: 'Remember',
          body: (
            <>
              <Tech name="docker" label="Docker Hub" />
              {' works both ways: anyone can pull public images, and a free account lets you push your own.'}
            </>
          ),
        }}
        points={[
          { text: 'Pull is every build you have run so far' },
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
        lead="Read the Dockerfile as a list of ingredients, where each instruction adds something"
        lesson={SESSION}
      >
        {/*
          `flex justify-center`, NOT `mx-auto`, AND THE WIDTH IS UP FROM 620.

          `mx-auto` did nothing here. `LayerStack`'s root carries its own
          `style={{ width }}`, and the wrapper around it was a plain block div,
          which already fills the well — so auto margins had no free space to
          share and the 620px stack sat hard against the well's left edge at
          x=64 with 596px of empty slide to its right. Centring a fixed-width
          child needs the PARENT to be a flex row that centres it.

          This one escaped the deck's own centring sweep because that sweep
          matched wrappers with a `max-w-[...]` class and this wrapper has none.

          620 was also small for a figure that is the whole argument of the
          slide. At 820 the stack reads as the subject rather than as a block
          parked in a large empty frame.

          THE FOUR LAYERS STAY ONE COLOUR ON PURPOSE. `LayerStack`'s states are
          verdicts — `ships`, `host`, `breaks`, `shared` — and all four of these
          genuinely ship, so tinting them differently would assert a distinction
          that does not exist (content rule 8). Marking the base layer `shared`
          would be true but would open `c3-mounted-from`'s concept nineteen
          slides early.
        */}
        <div className="flex justify-center">
          <LayerStack
            title="backend image"
            width={820}
            caption="A complete Linux environment with the app already installed in it"
            layers={[
              { label: 'What command runs when the container starts', note: 'CMD', state: 'ships' },
              { label: 'The folder the application runs in', note: 'WORKDIR', state: 'ships' },
              { label: 'Your Django project code', note: 'COPY . .', state: 'ships' },
              {
                label: 'Django, DRF, and every package from requirements.txt',
                note: 'RUN pip install',
                state: 'ships',
              },
              {
                label: <Tech name="python" label="Python 3.14 and the Debian base files" />,
                note: 'FROM',
                state: 'ships',
              },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Build it from the bottom as you talk, and name the instruction that put each layer there. The room wrote all four lines in Running the Real App with Docker.',
  },
  {
    id: 'c1-what-it-saves',
    section: C1,
    label: 'What it saves',
    element: (
      /* THE DEFINITION MOVED HERE WHEN `c1-why-not-the-code` WAS REMOVED.

         That slide carried the session's thesis sentence as a bold line under
         its table, and the review asked for its wording to be updated one pass
         before the slide itself was cut. The sentence has no other home: it is
         what an image IS, and every later concept leans on it. So it becomes
         this slide's callout, which is also the better place for it — this
         slide is now the last word on what the image contains.

         What went with `c1-why-not-the-code` and is NOT preserved: its five-row
         "ship the source code / ship the Docker image" comparison. Recorded
         here so the loss is visible rather than discovered later. */
      <ContentSlide
        kicker={C1}
        title="What It Saves"
        lead="Every layer answers a question the machine would otherwise have to solve"
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
              ['Linux, and Python or Node', <Code>FROM</Code>, 'Install the required runtime'],
              ['Installed dependencies', <Code>RUN pip install</Code>, 'Install the required packages'],
              ['Your application code', <Code>COPY . .</Code>, 'Get the application source code'],
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
          {/* A RULED LINE, NOT A CALLOUT, AND THE HARNESS DECIDED IT.

              As a `success` callout this sentence rendered at y=654, under the
              deck's own control bar, and `align-check` flagged it: the table is
              four rows and a callout box needs about a hundred pixels the well
              does not have. A titleless callout is not expressible either,
              because `Callout` falls back to the kind's own label.

              This is the treatment the removed `c1-why-not-the-code` used for
              this same sentence, and the one `c1-and-nowhere-else` uses for its
              conclusion: a top rule, body type, its own reveal so it arrives
              after the table rather than with it. */}
          <p className="mt-4 border-t-2 border-line pt-3 font-heading text-body-lg font-bold text-ink">
            The image contains everything the app needs to run, and does not depend on the machine that built it
          </p>
        </div>
      </ContentSlide>
    ),
    notes:
      'Run your finger down the third column, not across the rows. That column is the whole argument for sending an image instead of source.',
  },
  {
    /*
      SIMPLIFIED ON REVIEW, NOT REMOVED.

      The review said "remove it or explain in the easiest way, but I think it
      is not needed to explain here". Removing it was the tempting half and it
      takes something with it: `c1-the-account`'s warning says a public
      repository is visible to everyone AND that this image carries no `.env`,
      no `SECRET_KEY` and no database. That claim needs this slide to have
      happened, or it is an assertion with nothing behind it.

      So it stays and gets lighter. It was a two-column table whose second
      column carried a sentence of reasoning per row — three reasons the room
      does not need in order to believe the list. Three short lines say the same
      thing: what is left out, and one clause on why it matters.
    */
    id: 'c1-not-inside',
    section: C1,
    label: 'Deliberately left out',
    element: (
      <ContentSlide
        kicker={C1}
        title="Deliberately Left Out"
        lead="This short list is what makes a public push safe"
        points={[
          {
            text: (
              <>
                <Code>.env</Code>
                {' and the '}
                <Code>SECRET_KEY</Code>
                {': never in the image, so no secret reaches a public repository'}
              </>
            ),
          },
          {
            text: (
              <>
                <Code>db.sqlite3</Code>
                {': months of local test data, and it stays on your machine'}
              </>
            ),
          },
          {
            text: (
              <>
                <Code>VITE_API_BASE_URL</Code>
                {': the address differs per machine, so it arrives at run time'}
              </>
            ),
          },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'Read the three names, then the reason for the first one only. The other two follow from it, and the point of the slide is the shortness of the list rather than the detail behind each entry.',
  },
  {
    /*
      The one slide in this concept that asks the room to DO something, and the
      one place the exclusion list on `c1-not-inside` pays off.
    */
    id: 'c1-the-account',
    section: C1,
    label: 'The account',
    element: (
      <ContentNoteSlide
        kicker={C1}
        /* THE ACCOUNT IS CREATED HERE, NOT ASSUMED.

           The setup slide used to carry "a free account at hub.docker.com,
           created before this session" as a pre-flight check. It was removed on
           review because it was not true — nobody had been asked to make one —
           which left the deck using a Docker ID it had never told anyone to get.
           So this slide gives the instruction rather than describing the state,
           and `c2-login` now follows it instead of opening the next concept. */
        title="Create Your Account"
        lead="Pushing needs a free account, and the username you choose becomes part of every image name"
        points={[
          {
            text: (
              <>
                {'Open '}
                <Tech name="docker" label="hub.docker.com" />
                {' and sign up now, free, with unlimited public repositories'}
              </>
            ),
          },
          { text: <>{'The username you pick at signup is your '}<strong>Docker ID</strong></> },
          {
            text: (
              <>
                <Code>{DOCKER_ID}</Code>
                {' is only an example in this course, so replace it with your own Docker ID'}
              </>
            ),
          },
        ]}
        note={{
          kind: 'warning',
          title: 'Public means public',
          body: 'A public repository is visible to everyone, and this image carries no .env, no SECRET_KEY and no database.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'Ask everyone to type their own Docker ID into the chat now, so nobody is inventing one at the push. Read the warning as a rule, not as a caution.',
  },
  /*
    LOGGING IN MOVED HERE FROM CONCEPT 2, ON REVIEW.

    Both slides used to open concept 2, which meant the deck asked the learner
    to sign in before it had ever told them to create an account: the setup
    slide's "a free account, created before this session" check was removed on
    the same review because it was not true. So the order was account assumed,
    then account used, then account explained.

    Now concept 1 runs: the account is created, the learner signs in, and only
    then does concept 2 ask what an image is called. `c2-push-denied` still
    opens concept 2 on a real attempt, so that concept keeps its try-then-fail
    shape and loses only the login step it was borrowing.
  */
  {
    id: 'c2-login',
    section: C1,
    label: 'docker login',
    element: (
      <ContentSlide
        kicker={C1}
        title="docker login"
        lead="Once per machine, not once per push"
        points={[
          {
            text: (
              <>
                {'Password is invisible while typing, the same behaviour as '}
                <Code>createsuperuser</Code>
                {` in ${S4}`}
              </>
            ),
          },
          { text: 'Nothing is echoed, so the prompt looks frozen when it is working' },
        ]}
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          fontSize={14}
          lines={[
            { text: 'docker login', kind: 'cmd' },
            { text: `Username: ${DOCKER_ID}`, kind: 'out' },
            { text: 'Password:', kind: 'out' },
            { text: 'Login Succeeded', kind: 'ok' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Warn about the invisible password before you type it, or half the room will assume the terminal has hung. Wait for the green line before moving on.',
  },
  {
    id: 'c2-access-token',
    section: C1,
    label: 'Use a token',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="Use a Token"
        lead="If the account password is rejected, Docker Hub is asking for a token instead"
        points={[
          {
            text: (
              <>
                {'Create one under Account Settings, then Security, on '}
                <Code>hub.docker.com</Code>
              </>
            ),
          },
          {
            text: (
              <>
                {'Paste it at the '}
                <Code>Password:</Code>
                {' prompt, and nothing else about the login changes'}
              </>
            ),
          },
          { text: 'Later in this course, the automation server gets a token, never your real password' },
        ]}
        note={{
          kind: 'note',
          title: 'Note',
          body: 'A token stands in for your password, and you can cancel it on its own.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'This is the most likely thing to fail live in the room, so say it before anyone tries. Ask who has two-factor turned on: those learners need the token, not the password.',
  },
]
