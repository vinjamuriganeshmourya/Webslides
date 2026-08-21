import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentNoteSlide,
  ContentSlide,
  KeyTakeawaysSlide,
  PracticeSlide,
  QuizTimeSlide,
  RecapSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import {
  Callout,
  Card,
  Chip,
  CardGrid,
  CodeBlock,
  DataTable,
  FileTree,
  FlowChart,
  LayerStack,
  StatTile,
  StepList,
  Terminal,
} from '@/ui'
import { colors } from '@/design/tokens'

/**
 * Deployment · Session 2 "Docker File Creation"
 *
 * Content is the signed-off plan at
 *   `Web Slides/django_deployement_course/workflow/plans/deployement_session_2.md`
 * (STATUS: SIGNED OFF 2026-08-17), sourced from the TR doc at
 *   `Integration project/deployment/Docker_file_Creation_session_2.md`
 * after the five TR patches recorded in that plan's §6 were applied.
 *
 * The rendering layer is Session 1 v2's, unchanged apart from one addition:
 * `CodeBlock`'s highlighter learned the Dockerfile instructions, because eleven
 * slides here render a Dockerfile as their main exhibit.
 *
 * SIX RULES GOVERN THIS FILE. All six are easy to break by accident, so they
 * are restated where they bite:
 *
 *   R1 SCOPE DISCIPLINE. Still Problem 1 (runs anywhere). No slide shows a
 *      server, a globe, a public URL, a published port or inbound traffic. The
 *      application packaged here is a three-line script on purpose: nothing on
 *      any slide should pull the room toward hosting.
 *
 *   R2 WINDOWS-FIRST. Every command is PowerShell, in VS Code's integrated
 *      terminal, with its `PS C:\nxttrendz\docker-demo>` prompt. macOS and Linux
 *      forms live in `notes`, never instead.
 *
 *   R3 NO TOOL IS NAMED FOR A LATER SESSION. The TR points forward to "the
 *      Makefile session" and "the Jenkins sessions"; on a slide that is only
 *      ever "later in this course". The tool names stay in `notes`. The one
 *      exception is the next-session teaser frame, and at sign-off it was left
 *      deliberately blank.
 *
 *   R4 NO SPACED EM DASH in any rendered string. Comma, colon, full stop or
 *      parentheses. Applies to titles, leads, bullets, subs, table cells,
 *      captions and callout bodies. JSX comments are exempt.
 *
 *   R5 NO TRAILING FULL STOP on a rendered slide string. Mid-string stops are
 *      fine where a body genuinely runs to two sentences. Captured or quoted
 *      terminal output keeps its own punctuation, as does `notes`.
 *
 *   R6 VIDEO BOX RESERVATION. The top-right 367x220 of the 1280x720 canvas is
 *      kept clear for an instructor video. Assert with `node video-safe.mjs`.
 *
 *   R7 NO NAME BEFORE ITS OWN SLIDE. A term is introduced on the slide that
 *      teaches it, never earlier as a preview. The analogy slide describes what
 *      each kind of step DOES and names none of them; the anatomy slide teaches
 *      the shape of a line and lists no keywords; section 2 then names one
 *      instruction per slide. A word the room has already read has nothing left
 *      to reveal when its own slide arrives.
 *
 *   R8 CREATE BEFORE WRITE, AND ALWAYS WITH A PATH. No slide says "add this to
 *      app.py" or "create a .dockerignore" without a slide that first created
 *      the file and said which folder it goes in. Every file in this session
 *      lives in `C:\nxttrendz\docker-demo`, the `FileTree` figure shows it each
 *      time a file is added, and `CodeBlock` panels carry the folder in the name.
 *
 *   R9 A RECAP MAY ONLY CLAIM WHAT SESSION 1 TAUGHT. The TR's recap lists four
 *      docker commands as known; Session 1's deck contains `docker --version`
 *      and `docker run hello-world` and nothing else. `docker images` and
 *      `docker ps` are therefore TAUGHT in section 3 of this deck, each at the
 *      point the session first needs it. `docker pull` is not taught at all:
 *      `FROM` pulls the base image during the build, so the room never types it,
 *      and the fact lives on the build-output slide instead.
 *
 *  R10 EXPLAIN THE COMMAND BEFORE SHOWING IT. Every command in section 3 takes
 *      two slides, what it does and then the transcript, so the room reads
 *      output it has already been told how to read.
 *
 * ONE HONESTY NOTE, and it is load-bearing. Every transcript in this deck is
 * QUOTED FROM THE TR, not captured: Docker Desktop cannot run on the capture
 * machine (Hyper-V/HCS is unavailable inside VirtualBox), which is the same
 * blocker that left Session 1's `hello-world` output quoted. Timings and image
 * IDs are therefore illustrative, and the speaker notes say so on every slide
 * that shows one. Captures C1 to C6 are tracked in
 * `workflow/assets-manifest.md`; swapping a real transcript in later needs no
 * layout change, because `Terminal` takes the same lines either way.
 */

export const dockerFileCreationMeta: DeckMeta = {
  title: 'Docker File Creation',
  course: 'React + Django Integration · Deployment',
  lesson: 'Docker File Creation',
  presenter: 'NxtWave Instructor',
}

/** Footer text on every slide: the session name, never "Session 2". */
const SESSION = 'Docker File Creation'

/**
 * The folder every command in this session is run from.
 *
 * NOT `C:\nxttrendz` itself. The learner's real workspace is the project from
 * Session 1, `nxttrendz\backend` (Django) and `nxttrendz\frontend` (React), and
 * dropping a bare `app.py` into the root beside them would be a lie about where
 * their code lives. Worse, `COPY . .` from the root would sweep both real apps
 * into the image.
 *
 * So today's three-line demo gets a sibling folder of its own. It sits inside the
 * workspace they already have open, so nothing about their setup changes, and it
 * is unambiguously separate from the two apps. When the same Dockerfile is later
 * pointed at `backend`, only the folder in the prompt changes.
 */
const PROJECT = 'C:\\nxttrendz'
const CWD = `${PROJECT}\\docker-demo`

/* ------------------------------------------------------------------ */
/* Shared slide furniture                                              */
/* ------------------------------------------------------------------ */

/** Inline code, for the many `COPY . .` / `docker build` mentions. */
function Code({ children }: { children: ReactNode }) {
  return (
    <span
      className="rounded-md px-1.5 py-0.5 font-mono"
      style={{ fontSize: '0.9em', background: 'rgba(11,95,255,0.10)', color: colors.brandDark }}
    >
      {children}
    </span>
  )
}

/**
 * THE DECK'S SPINE.
 *
 * The complete Dockerfile, one entry per line. Slides 13 to 19 render
 * `dockerfile(n)` with the new line highlighted, so the room watches one file
 * grow rather than reading six unrelated snippets. Changing a line here changes
 * it on all seven slides at once, which is the entire reason it is an array and
 * not seven string literals.
 */
const DOCKERFILE = [
  'FROM python:3.14-slim',
  'WORKDIR /app',
  'COPY requirements.txt .',
  'RUN pip install -r requirements.txt',
  'COPY . .',
  'CMD ["python", "app.py"]',
] as const

/** The first `n` lines of the Dockerfile. */
const dockerfile = (n: number) => DOCKERFILE.slice(0, n).join('\n')

/**
 * The growing file, as slides 18 to 22 render it. One place for the props so a
 * later tweak (font size, line numbers, cap) cannot drift between the seven.
 */
/**
 * THE NEED THIS INSTRUCTION PROVIDES.
 *
 * Section 1 ends with four needs in the room's own words, and every instruction
 * slide answers one of them. That link used to be a lead reading "Need 1, a
 * runtime to run on". The ordinal was the problem: it made the room carry a
 * number that means nothing on its own, and it sat beside a code panel whose
 * lines are also numbered, so "Need 3" and line 3 read as the same claim when
 * they never are. The need text alone says everything the number stood in for,
 * and it is worded exactly as the table on `c1-four-needs-one-file` words it,
 * because that table is the room's own list handed back.
 *
 * It is a chip rather than a lead because it labels the instruction instead of
 * making a sentence about it, and because a lead-less header lets the bullets
 * and the file move up 48px (`ContentSlide` adds the video-box guard itself).
 * Same treatment as session 1's "Windows only" chip on the installer slide,
 * tone and markup included.
 */
function NeedChip({ children, logo }: { children: ReactNode; logo?: string }) {
  return (
    <Chip tone="nw" className="w-fit gap-2">
      {logo && (
        <img src={logo} alt="" draggable={false} className="h-4 w-4 object-contain" />
      )}
      {children}
    </Chip>
  )
}

function DockerfileSoFar({ lines, highlight }: { lines: number; highlight?: number[] }) {
  return (
    <CodeBlock
      filename="Dockerfile"
      language="dockerfile"
      code={dockerfile(lines)}
      highlight={highlight}
      maxHeight={260}
    />
  )
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export const dockerFileCreationDeck: SlideDef[] = [
  /* --- Opening frame ------------------------------------------------ */
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
    id: 'recap',
    section: 'Opening',
    label: 'Recap',
    element: (
      /*
        THE RECAP IS SESSION 1'S KEY TAKEAWAYS, VERBATIM.

        These four lines are the exact points on session 1's Key Takeaways slide,
        in the same order, which are themselves session 1's agenda items in the
        same order. The room was promised those four words at the start of last
        session and handed them back at the end, so opening this one with anything
        else makes the two decks disagree about what was covered.

        It also fixes a claim this slide used to make. The TR's recap block ends
        with "Key commands: docker pull, docker run, docker ps, docker images",
        and session 1's deck contains exactly two commands, `docker --version` and
        `docker run hello-world`. Three of those four had never been explained to
        this room. Section 3 of this deck teaches the ones the session actually
        uses, each at the point where it is first needed.

        If a point here does not appear on session 1's Key Takeaways slide, it
        does not belong on this one.
      */
      <RecapSlide
        kicker="Recap"
        title="Last Session"
        lesson={SESSION}
        points={[
          'Where Your App Lives',
          'Containerization',
          'Docker',
          'Docker Installation',
        ]}
      />
    ),
    notes:
      'These are session 1\'s four key takeaways, word for word. Do not re-teach any of them, read them as settled facts and move. The one to linger on for a few seconds is Docker, because the whole of today is about producing an image with it. If the room is shaky on image versus container, spend thirty seconds on the class and object comparison from last time, then move on: the full journey slide comes back to it anyway.',
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        kicker={SESSION}
        title="Agenda"
        lesson={SESSION}
        /* Five items, and they are the deck's five sections. The key takeaways
           slide restates exactly these, so the room is told the same five things
           three times: here, as they happen, and at the close. */
        items={[
          { title: 'The Dockerfile', sub: 'A recipe card for an image' },
          { title: 'Writing the Dockerfile', sub: 'Five instructions, one at a time' },
          { title: 'Build and Run', sub: 'Build the image, then the four commands that work with it' },
          { title: 'Layers and the Build Cache', sub: 'Why a rebuild takes under a second' },
          { title: '.dockerignore and Mistakes', sub: 'What to leave out, and what breaks' },
        ]}
      />
    ),
    notes:
      'Five items, and item two is where most of the time goes. Say up front that by the end of item three they will have built their own image, which is the first time in this course they produce something Docker can run.',
  },

  /* --- 1. The Dockerfile -------------------------------------------- */
  /*
    THE GAP, BEFORE THE SECTION THAT FILLS IT.
    Session 1 established the pattern: the room feels the problem, and only then
    is the section announced. So every slide up to the divider sits BEFORE it:
    the gap, the goal, the script itself, and the four things running that script
    needs. They carry the section in the rail, because that is where they belong
    structurally, but on stage they are the reason the section exists.
  */
  {
    id: 'c1-question',
    section: 'The Dockerfile',
    label: 'The question',
    element: (
      <ContentNoteSlide
        kicker="Docker File Creation"
        title="That Image Came With Docker"
        lesson={SESSION}
        points={[
          {
            text: 'hello-world proved Docker works',
            sub: 'You ran a container from it and read its message',
            icon: 'check',
          },
          {
            text: 'But that image came with Docker',
            sub: 'It was ready made, and none of it was your application',
            icon: 'warning',
          },
        ]}
        note={{
          kind: 'tip',
          title: 'The question for this session',
          body: (
            <>
              How do we package <strong>our own application</strong> into an image?
            </>
          ),
        }}
      />
    ),
    notes:
      'Last session ended on a win, and this slide turns it into a gap. Ask the room where the hello-world image came from. It came with Docker, ready made, and it printed a message nobody in the room wrote. That is the whole setup: running an image that came with Docker is consuming Docker, and today they start producing.',
  },
  {
    id: 'c1-goal',
    section: 'The Dockerfile',
    label: 'The goal',
    element: (
      /*
        THE GOAL, IN ONE SENTENCE, BEFORE ANY TYPING.

        The previous slide leaves the room with a gap and no destination. This one
        names the destination and nothing else: write a small Python script, and
        get Docker to run it. Everything from here to the end of section 3 is that
        one sentence being carried out, and the room can check its own progress
        against it.

        The flow says "hand it to Docker" and not "build an image", because the
        room has not been told yet that an image has to be prepared (that is the
        slide after the script exists). R7: no name before its own slide.
      */
      <ContentSlide
        kicker="The Dockerfile"
        title="Let Us Run Our Own Script"
        lead="A small Python script of our own, run by Docker"
        lesson={SESSION}
      >
        <div className="grid gap-5">
          <FlowChart
            nodes={[
              { label: 'Write a script', caption: 'A few lines of Python', icon: 'code' },
              { label: 'Hand it to Docker', caption: 'Not to Python on your machine', icon: 'terminal' },
              { label: 'It runs in a container', caption: 'The same way anywhere', icon: 'play' },
            ]}
          />
          <Callout kind="tip" title="The whole session, in one line" asStep={false}>
            Everything from here to the end of the session is these three boxes, one at a time
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Say the sentence out loud and leave it on screen: we write a script, Docker runs it. The middle box is the one to press on, because "hand it to Docker" is exactly the part they cannot do yet, and it is the part the rest of the session buys them. Do not say the word image here, and do not say Dockerfile: both have their own slides, and the room has to want them first. If someone asks why not just run python app.py, agree that it works on their machine and ask what happens on the next machine, which is last session\u2019s promise.',
  },
  {
    id: 'c1-create-project',
    section: 'The Dockerfile',
    label: 'Create the project',
    element: (
      /*
        WHERE, BEFORE WHAT.

        This slide used to be the file contents, which told the room what to type
        and never told them what to create or where to put it. "Add this to
        app.py" assumes a file that does not exist yet. Every path in this session
        depends on this one folder: the prompt on every terminal is
        `PS C:\nxttrendz\docker-demo>`, WORKDIR maps onto it, `COPY . .` copies
        it, and the build context dot IS it. So the folder is created first, on its own slide,
        and the `FileTree` figure is the answer to "where does this go" that the
        room can point at for the rest of the session.
      */
      <ContentSlide
        kicker="The Dockerfile"
        title="Create the Folder"
        lead="A third folder in the workspace you already have open"
        lesson={SESSION}
        points={[
          {
            text: 'Inside nxttrendz, beside backend and frontend',
            sub: 'Named docker-demo, not inside either app',
            icon: 'folder',
          },
          {
            text: 'Create two files in it',
            sub: 'app.py and requirements.txt, both in docker-demo itself',
            icon: 'plus',
          },
          {
            text: 'Open a terminal in that folder',
            sub: 'Right-click docker-demo in VS Code, then Open in Integrated Terminal',
            icon: 'terminal',
            tone: 'accent',
          },
        ]}
      >
        <FileTree
          root="C:\nxttrendz"
          entries={[
            { name: 'backend\\', folder: true, note: 'Django' },
            { name: 'frontend\\', folder: true, note: 'React' },
            { name: 'docker-demo\\', folder: true, state: 'new' },
            { name: 'app.py', depth: 1, state: 'new' },
            { name: 'requirements.txt', depth: 1, state: 'new' },
          ]}
          caption="Your two apps stay untouched today"
        />
      </ContentSlide>
    ),
    notes:
      'Do this with them, do not describe it. Say why it is a separate folder and not the backend: today is about Docker, and the moment settings.py is on screen the room debugs Django instead. Also a real reason they will meet in the last section, COPY . . copies the whole folder, so a Dockerfile sitting in the project root would sweep both apps into one image. The prompt matters: every terminal in this deck reads PS C:\\nxttrendz\\docker-demo>, and "wrong folder" is the first error they will hit, exactly as it was last session. Their drive letter or path may differ, and that is fine as long as they read their own prompt. On macOS and Linux this is ~/nxttrendz/docker-demo.',
  },
  {
    id: 'c1-the-app',
    section: 'The Dockerfile',
    label: 'What goes in them',
    element: (
      /*
        Contents only, now that both files exist and the room knows where. A
        three-line script rather than their Django project, deliberately: the
        moment settings.py is on screen the room debugs Django instead of learning
        Docker. The real project comes back once the five instructions are second
        nature.

        `CodeBlock` rather than `Terminal` because these are FILES. The rule is
        about which chrome tells the truth: traffic lights and a filename for a
        file, a panel tab strip and a prompt for a command.
      */
      <ContentSlide
        kicker="The Dockerfile"
        title="What Goes In Them"
        lead="Type these into the two files you just created"
        lesson={SESSION}
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-[1.35fr_1fr] items-start gap-6">
            <CodeBlock
              filename="docker-demo\app.py"
              language="python"
              showLineNumbers={false}
              maxHeight={170}
              code={`print("nxttrendz backend starting...")
print("nxttrendz frontend starting...")
print("Connected successfully!")`}
            />
            <CodeBlock
              filename="docker-demo\requirements.txt"
              language="text"
              showLineNumbers={false}
              maxHeight={170}
              code={`# dependencies will be added later`}
            />
          </div>
          <Callout kind="info" title="An empty requirements file still matters" asStep={false}>
            Real projects always have one, and the Dockerfile treats an empty file and a full one
            exactly the same way
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Each panel is titled with its full path on purpose, so nobody has to guess which file they are looking at. Three prints and a comment, and that is the entire application: everything they learn today applies unchanged to their Django project, and they will point the same Dockerfile at it later. The requirements file is empty and that is fine, because the instruction that installs from it does not care.',
  },
  {
    id: 'c1-need-an-image',
    section: 'The Dockerfile',
    label: 'We need an image',
    element: (
      /*
        THE TURN, AND THE FIRST TIME "PREPARE AN IMAGE" IS SAID.

        The script now exists, so the question is finally concrete: Docker only
        ever runs an image, last session's image was already sitting there waiting
        to be pulled, and no image anywhere in the world contains this app.py. Two
        cards, past against present, because the contrast IS the content: nothing
        about Docker changed, only who has to produce the image.
      */
      <ContentSlide
        kicker="The Dockerfile"
        title="Now We Need an Image"
        lead="Docker runs images, and no image contains app.py yet"
        lesson={SESSION}
      >
        <div className="grid gap-5">
          <CardGrid cols={2}>
            <Card icon="download" title="Last session">
              The image already existed, so we pulled it and ran it. Nothing had to be prepared
            </Card>
            <Card icon="plus" title="This session" tone="brand">
              No image holds our app.py, so we have to prepare one before Docker can run anything
            </Card>
          </CardGrid>
          <Callout kind="info" title="Docker never runs a file" asStep={false}>
            It runs an image, so <Code>app.py</Code> has to be inside one first
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'This is the hinge of the whole session, so slow down. Ask the room to run app.py with Docker right now and let them find there is nothing to run: docker run needs an image name, and no image name in the world means their script. Last session they consumed an image; from this slide on they produce one. Do not answer how yet, the next slide gets the room to work it out from first principles.',
  },
  {
    id: 'c1-what-it-takes',
    section: 'The Dockerfile',
    label: 'What running it needs',
    element: (
      /*
        FIRST PRINCIPLES, AND THE SPINE OF SECTION 2.

        Before any analogy, the room derives the requirements itself from
        something it already knows: a bare machine and a Python script. Four
        answers come back every time, and in this order, because each one is
        useless without the one above it.

        These four ARE the Dockerfile, in the order the file is written: a runtime
        to run on, a folder to work in, the file itself, and the command that
        starts it. Section 2 then teaches one instruction per answer. R7 holds
        here too, so not one keyword is named: the room leaves this slide holding
        four needs, and each need collects its keyword on the slide that teaches
        it.
      */
      <ContentSlide kicker="The Dockerfile" title="What Does Running It Need" lesson={SESSION}>
        {/*
          ONE LINE PER STEP, NO SUB-LINE, AND THE VALUE ON A SECOND CLICK.

          The four needs are the answer the room gives out loud, so each one is a
          single line it can finish for you. A sub-line under each would explain an
          answer the room just produced, and the lead that used to sit above
          ("forget Docker for a moment") explained the question before it was
          asked. Both are gone: the instructor asks, the room answers, the line
          lands.

          Then the parenthesised value arrives on its own click, via `value`. That
          is the second half of the same beat: the need is the room's answer, the
          value is the confirmation, and putting both on one click would print the
          answer before anyone had been asked. Eight steps, four questions.

          The values are the arguments of the instructions concept 2 teaches, in
          the same order, which is why they are set in mono and why no keyword is
          named here.
        */}
        <StepList
          steps={[
            { title: 'We require a Python runtime', value: '(Python)' },
            {
              title: 'A directory to store the files',
              value: (
                <>
                  (<Code>/app</Code>)
                </>
              ),
            },
            {
              title: 'Files and their content',
              value: (
                <>
                  (<Code>app.py</Code> and <Code>requirements.txt</Code>)
                </>
              ),
            },
            {
              title: 'Command to run',
              value: (
                <>
                  (<Code>python app.py</Code>)
                </>
              ),
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Ask, do not tell. Give the room a machine with nothing on it and this script, and let them list what is missing; these four come back in almost this order every time, and a room that produced the list will follow section 2 far better than a room that was handed it. Press on order: the file is no use without Python, and the command is no use without the file. Then close the loop, the image has to carry all four, and everything after the divider is how those four get written down. Do not name a single instruction here, each one arrives on its own slide.',
  },
  {
    id: 'c1-divider',
    section: 'The Dockerfile',
    label: '01 Divider',
    element: (
      // Typographic, no illustration: nothing in `src/ui/characters` depicts a
      // Dockerfile, and placing an unrelated scene to fill space is forbidden.
      // Recorded as outstanding asset work in the plan.
      <SectionBreakerSlide index={1} title="The Dockerfile" lesson={SESSION} />
    ),
    notes:
      'The hinge. Everything before this is the gap, everything after is the answer. Say the word Dockerfile out loud here and then stop, because the next two slides earn it before defining it.',
  },
  {
    id: 'c1-definition',
    section: 'The Dockerfile',
    label: 'What a Dockerfile is',
    element: (
      /*
        The definition frame, the same shape Session 1 used for Docker itself:
        note first, evidence under it. The two points are the two rules a
        beginner breaks on day one, and both cost twenty minutes of confusion:
        `dockerfile.txt` is not read, and a Dockerfile the build context cannot
        see does not exist.
      */
      <ContentNoteSlide
        kicker="The Dockerfile"
        title="What Is a Dockerfile"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'note',
          title: 'Dockerfile',
          body: (
            <>
              A plain text file of step by step instructions that Docker reads{' '}
              <strong>top to bottom</strong> to build an image
            </>
          ),
        }}
        points={[
          {
            text: 'Named exactly Dockerfile',
            sub: 'Capital D, no extension. Not Dockerfile.txt, not dockerfile',
            icon: 'warning',
          },
          {
            text: 'Lives in your project root',
            sub: 'Next to your code, where the build command can see it',
            icon: 'target',
          },
        ]}
      />
    ),
    notes:
      'Both points are day-one mistakes that cost twenty minutes each. VS Code will happily save Dockerfile.txt and the build then says it cannot find a Dockerfile, which reads like Docker is broken. On the folder: put it beside app.py, not in a subfolder, and the docker build slide explains why in terms of the build context.',
  },
  {
    id: 'c1-four-needs-one-file',
    section: 'The Dockerfile',
    label: 'All four come from the file',
    element: (
      /*
        THE BRIDGE FROM "WHAT DOES RUNNING IT NEED".

        The room derived four needs a few slides ago, and it has just been told
        what a Dockerfile is. This slide joins the two and stops there: to define
        and run app.py, every one of those four has to be provided through the
        Dockerfile, and the question the section then answers is HOW.

        R7 HOLDS HERE. An earlier version of this slide printed FROM, WORKDIR,
        COPY and CMD in a middle column, which handed the room every keyword
        before a single one had been taught and left the five instruction slides
        with nothing to reveal. The needs and their values are the room's own
        answers, so repeating them costs nothing; the keywords are not repeated
        because they have not been said yet. Each instruction slide names its own
        keyword and says which of these four rows it is for.
      */
      <ContentSlide
        kicker="The Dockerfile"
        title="All Four Come From the File"
        lead="To define and run app.py, the image has to be given every one of these"
        lesson={SESSION}
      >
        <div className="grid gap-5">
          <DataTable
            compact
            columns={[
              { label: 'What running it needs', weight: 1.4 },
              { label: 'What has to be provided', weight: 1.4 },
            ]}
            rows={[
              [
                'A runtime to run on',
                <span className="inline-flex items-center gap-2">
                  <img
                    src="/assets/tech/python.svg"
                    alt=""
                    draggable={false}
                    className="h-4 w-4 object-contain"
                  />
                  Python
                </span>,
              ],
              ['A folder to work in', '/app'],
              ['The files and their content', 'app.py, requirements.txt'],
              ['A command to start it', 'python app.py'],
            ]}
          />
          <Callout kind="tip" title="So the only question left is how">
            Let us see how each of these four is provided through the Dockerfile
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'These are their four answers, in their order, so read them as a recap and not as new material. Then land the one new sentence: the Dockerfile is where all four get provided, and nothing else in the project provides any of them. Click the callout and stop there. Do not name an instruction yet, and if someone in the room names one, say yes and that it is coming, because each keyword arrives on its own slide with one of these four rows beside it.',
  },
  {
    id: 'c1-create-dockerfile',
    section: 'The Dockerfile',
    label: 'Create the Dockerfile',
    element: (
      /*
        THE FILE HAS TO EXIST BEFORE ANYTHING IS WRITTEN INTO IT.

        The definition slide says the file is named exactly `Dockerfile` and lives
        in the project root; this is where the room actually makes one, in the
        folder they created on slide 7, before the next section starts writing
        lines into it. Without this slide the FROM slide is asking them to type
        into a file that does not exist.

        The tree shows all three files at once so the naming rule is enforced by
        the picture: `app.py` and `requirements.txt` have extensions and
        `Dockerfile` does not, sitting side by side where the difference is
        impossible to miss.
      */
      <ContentSlide
        kicker="The Dockerfile"
        title="Create the Dockerfile"
        lead="An empty file for now. The next section fills it in"
        lesson={SESSION}
        points={[
          {
            text: 'In the same folder, docker-demo',
            sub: 'Beside app.py, never in a subfolder of its own',
            icon: 'folder',
          },
          {
            text: 'Named exactly Dockerfile',
            sub: 'Capital D, and no extension at all',
            icon: 'warning',
          },
          {
            text: 'Watch VS Code when you save',
            sub: 'It shows the whale icon once the name is right, which is your confirmation',
            icon: 'check',
            tone: 'accent',
          },
        ]}
      >
        <FileTree
          root="C:\nxttrendz\docker-demo"
          entries={[
            { name: 'app.py', note: 'the app' },
            { name: 'requirements.txt', note: 'its dependencies' },
            { name: 'Dockerfile', state: 'new' },
          ]}
          caption="Three files, side by side"
        />
      </ContentSlide>
    ),
    notes:
      'Make them do it now, and walk the room. This is the single most common day-one failure: VS Code saves Dockerfile.txt, docker build then reports it cannot find a Dockerfile, and it reads like Docker is broken rather than like a filename typo. The whale icon in the VS Code explorer is the cheapest possible check, so point at it. If someone is on Notepad, tell them to choose All Files in the save dialog or it will silently append .txt. Leave the file empty: the next section writes it one line at a time.',
  },
  {
    id: 'c1-anatomy',
    section: 'The Dockerfile',
    label: 'One line, one instruction',
    element: (
      /*
        HOW DO WE WRITE IT, ASKED AND ANSWERED IN ONE SHAPE.

        The file now exists and is empty, so this is the slide that says what goes
        into it: a Dockerfile holds instructions, one per line, and every line has
        the same two-part shape. The pattern is taught once here so the writing
        section reads as one thing repeating rather than five new things.

        The first bullet used to list all five keywords as its sub, which is the
        same answer-too-early mistake as the analogy slide, just smaller: the
        room would have read every instruction name before a single one had been
        explained. The shape is what this slide teaches. The names are what the
        next five teach, each one beside the need it provides.
      */
      <ContentSlide
        kicker="The Dockerfile"
        title="How Do We Write It"
        lead="Instructions, one per line, and every line has the same shape"
        lesson={SESSION}
        points={[
          {
            text: 'INSTRUCTION is an uppercase keyword',
            sub: 'It says what kind of step this line is',
            icon: 'code',
          },
          {
            text: 'arguments are what it acts on',
            sub: 'A base image, a folder, a file, a command',
            icon: 'arrow',
          },
          {
            text: 'Five instructions containerise most applications',
            sub: 'The same five whether the app is Python or React',
            icon: 'bulb',
            tone: 'accent',
          },
        ]}
      >
        <CodeBlock
          filename="Dockerfile"
          language="dockerfile"
          showLineNumbers={false}
          maxHeight={120}
          code={`INSTRUCTION  arguments`}
        />
      </ContentSlide>
    ),
    notes:
      'The file is open and empty in front of them, so ask the question the title asks: what do we type. The answer is instructions, one per line, and this shape is all of them. Uppercase is a convention, not a requirement, and it is worth saying so: Docker accepts lowercase, and every Dockerfile in the world still uses uppercase because it separates the instruction from its argument at a glance. Five instructions is the whole vocabulary for today, and they arrive one at a time, each one answering one of the four needs the room listed, so do not list them here even if someone asks.',
  },

  /* --- 2. Writing the Dockerfile ------------------------------------ */
  /*
    ONE INSTRUCTION PER SLIDE. Seven slides, signed off deliberately over the
    "2 to 4 slides per concept" guideline, because this is a series the learner
    weighs individually and the growing file is the deck's spine. All seven share
    one shape: same kicker, the instruction plus its job as the title, two points,
    at most one callout, and `DockerfileSoFar` with the new line highlighted.
    Each one also names which of the room's four needs it provides, so the
    keyword lands as an answer rather than as vocabulary. By the end of the
    section the room has watched the complete file assemble, which is why the
    last slide of the section can simply show it.
  */
  {
    id: 'c2-divider',
    section: 'Writing the Dockerfile',
    label: '02 Divider',
    element: (
      <SectionBreakerSlide index={2} title="Writing the Dockerfile" lesson={SESSION} />
    ),
    notes:
      'Seven slides, one instruction at a time, and the same file grows on the right each time. Tell the room not to copy it down yet: the complete file arrives on its own slide at the end of this section.',
  },
  {
    id: 'c2-from',
    section: 'Writing the Dockerfile',
    label: 'FROM',
    element: (
      /*
        `ContentSlide`, like the other four instruction slides, and not
        `ContentNoteSlide`. A note stacks UNDER the code block on that layout, and
        with a header, three bullets, a file and a callout the slide ran 47px past
        the frame. The note's content works better as a third bullet anyway, since
        it is more of the same kind of thing rather than a claim about the others.
      */
      <ContentSlide
        kicker="Writing the Dockerfile"
        title="FROM: Choose the Base"
        lesson={SESSION}
        points={[
          {
            text: 'Every Dockerfile starts with FROM',
            sub: 'The image you build on top of',
            icon: 'play',
          },
          {
            text: 'Nobody builds from absolute zero',
            sub: 'A recipe starts with a pan of water, not with forging the pan',
            icon: 'bulb',
          },
          {
            text: 'Read the name in three parts',
            sub: 'python is the official image, 3.14 is the version this course uses, and slim is the minimal variant at about 150 MB',
            icon: 'code',
            tone: 'accent',
          },
        ]}
      >
        <div className="grid gap-3">
          <NeedChip logo="/assets/tech/python.svg">A runtime to run on</NeedChip>
          <DockerfileSoFar lines={1} highlight={[1]} />
        </div>
      </ContentSlide>
    ),
    notes:
      'Read the lead first and point back at their own list: need one was a Python runtime, and FROM is how the image gets one. The base already contains Linux and Python, which is why the file is six lines and not six hundred. Two things to say out loud. Slim drops rarely-needed OS tools and contains the same Python, so it is the default choice, not a compromise. And pinning 3.14 rather than latest is what keeps last session\u2019s promise: latest changes under you, and then the image that worked yesterday does not build today.',
  },
  {
    id: 'c2-workdir',
    section: 'Writing the Dockerfile',
    label: 'WORKDIR',
    element: (
      <ContentSlide
        kicker="Writing the Dockerfile"
        title="WORKDIR: Pick a Folder"
        lesson={SESSION}
        points={[
          {
            text: 'Creates /app inside the image',
            sub: 'Inside the image, not anywhere on your machine',
            icon: 'database',
          },
          {
            text: 'Every later instruction runs from there',
            sub: 'Like doing cd /app once, permanently',
            icon: 'route',
          },
        ]}
      >
        <div className="grid gap-3">
          <NeedChip>A folder to work in</NeedChip>
          <DockerfileSoFar lines={2} highlight={[2]} />
        </div>
      </ContentSlide>
    ),
    notes:
      'Need two was a folder to work in, and this is the line that provides it. The word "inside" is the whole slide. Nothing appears on their own machine, and no folder called app is created anywhere they can browse to. /app is a convention, not a rule: any path works, and every project you will ever read uses /app or /code, so use one of those. It also matters for the Nothing to Run error in the last section, where the container looks for /app/app.py.',
  },
  {
    id: 'c2-copy',
    section: 'Writing the Dockerfile',
    label: 'COPY',
    element: (
      // Same shape as the other four instruction slides. See the FROM slide for
      // why the third point is a bullet rather than a callout.
      <ContentSlide
        kicker="Writing the Dockerfile"
        title="COPY: Bring the Code In"
        lesson={SESSION}
        points={[
          {
            text: 'Two arguments: source, then destination',
            sub: 'From your project folder, into the image',
            icon: 'arrow',
          },
          {
            text: 'The dot is the current folder',
            sub: '/app, because WORKDIR set it on the line above',
            icon: 'target',
          },
          {
            text: 'Why only this file, and not the code',
            sub: 'The order is deliberate: section four says why',
            icon: 'bulb',
            tone: 'accent',
          },
        ]}
      >
        <div className="grid gap-3">
          <NeedChip>The files and their content</NeedChip>
          <DockerfileSoFar lines={3} highlight={[3]} />
        </div>
      </ContentSlide>
    ),
    notes:
      'Need three was the files and their content, and COPY is the only instruction that puts a file in the image. Read the line as a sentence: copy requirements.txt from my folder into the image\u2019s current folder. Do not explain the cache yet, just plant that the order is deliberate. Someone always asks why not copy everything now, and the honest answer is "hold that question, it is a whole section". Come back and point at this slide when you get to the copy order slide.',
  },
  {
    id: 'c2-run',
    section: 'Writing the Dockerfile',
    label: 'RUN',
    element: (
      <ContentSlide
        kicker="Writing the Dockerfile"
        title="RUN: Install Dependencies"
        lesson={SESSION}
        points={[
          {
            text: 'RUN executes while the image is built',
            sub: 'Here it installs every package listed in requirements',
            icon: 'settings',
          },
          {
            text: 'Then COPY . . brings everything else',
            sub: 'All your project files, from your folder into /app',
            icon: 'code',
          },
        ]}
      >
        <div className="grid gap-3">
          <NeedChip>The packages those files ask for</NeedChip>
          <DockerfileSoFar lines={5} highlight={[4, 5]} />
        </div>
      </ContentSlide>
    ),
    notes:
      'Still need three, because a file that lists packages is no use until they are installed. Two lines arrive together here on purpose: install first, then copy the code, and that pairing is the cache lesson in miniature. Say what RUN means precisely, because it is the word students get wrong: the command executes once, while the image is being built, and whatever it produced is baked in. The packages are installed inside the image, not on their machine, so pip list in their own terminal will not show them.',
  },
  {
    id: 'c2-cmd',
    section: 'Writing the Dockerfile',
    label: 'CMD',
    element: (
      <ContentSlide
        kicker="Writing the Dockerfile"
        title="CMD: What Runs on Start"
        lesson={SESSION}
        points={[
          {
            text: 'Declares what a container runs when it starts',
            sub: 'Nothing at all happens at build time',
            icon: 'play',
          },
          {
            text: 'Written as a list, one string per word',
            sub: 'python is the program, app.py is the argument',
            icon: 'terminal',
          },
        ]}
      >
        <div className="grid gap-3">
          <NeedChip>A command to start it</NeedChip>
          <DockerfileSoFar lines={6} highlight={[6]} />
        </div>
      </ContentSlide>
    ),
    notes:
      'Need four, the command to start it, and it is the last of the four. The list form is where the typos live: CMD ["python app.py"] as one string looks right and fails, because Docker then looks for a program literally named "python app.py". One word, one string. And say "declares", not "runs": the build does not execute this line, which is exactly why the Nothing to Run mistake gets through the build unnoticed.',
  },
  {
    id: 'c2-run-vs-cmd',
    section: 'Writing the Dockerfile',
    label: 'RUN vs CMD',
    element: (
      /*
        The confusion the TR names outright, given its own slide. `DataTable`,
        not `CardGrid`: this teaches BY the column alignment, and the eye has to
        run down a column to see that one of them is build time and the other is
        not. Tiles would break exactly the comparison being made.
      */
      <ContentSlide
        kicker="Writing the Dockerfile"
        title="RUN vs CMD"
        lead="Both run commands, so which one runs when"
        lesson={SESSION}
      >
        <div className="grid gap-5">
          <DataTable
            compact
            columns={[
              { label: '', weight: 0.8 },
              { label: 'RUN', weight: 1.1 },
              { label: 'CMD', weight: 1.1 },
            ]}
            rows={[
              ['Executes', 'While building the image', 'When a container starts'],
              ['Used for', 'Installing packages, setup', 'Starting the application'],
              ['How many', 'Many per Dockerfile', 'Only one, the last one wins'],
              ['In the analogy', 'The cooking steps', 'Serve hot, done at the table'],
            ]}
          />
          <Callout kind="success" title="A memory hook">
            <strong>RUN builds the kitchen, CMD serves the dish</strong>
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Let the table land, then click the memory hook and make the room say it back. Almost every "my container exits immediately" question traces to this row or the next: RUN happens once in the kitchen, CMD happens at the table, every single time a container starts. The "only one wins" row is worth a sentence, because a Dockerfile with two CMDs does not error, it silently ignores the first.',
  },
  {
    id: 'c2-complete',
    section: 'Writing the Dockerfile',
    label: 'The complete Dockerfile',
    element: (
      /*
        No highlight, nothing new: this is the slide the room photographs. The
        narration line is a Callout rather than a lead so it sits UNDER the file,
        which is the order it should be read in.
      */
      <ContentSlide
        kicker="Writing the Dockerfile"
        title="The Complete Dockerfile"
        lead="Six lines, read top to bottom"
        lesson={SESSION}
      >
        <div className="grid gap-4">
          <CodeBlock
            filename="Dockerfile"
            language="dockerfile"
            code={dockerfile(6)}
            maxHeight={250}
          />
          <Callout kind="note" title="Read it as one sentence" asStep={false}>
            Start from Python 3.14, work in <Code>/app</Code>, bring in the requirements list,
            install them, bring in the code, and run the app when a container starts
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Pause here and let the room photograph it. Then read the callout out loud as one sentence, because that is the test of whether they understood the section: a Dockerfile they can narrate is a Dockerfile they can write. Six lines, and it will containerise their Django project almost unchanged.',
  },

  {
    id: 'c2-to-build',
    section: 'Writing the Dockerfile',
    label: 'The file is done, now what',
    element: (
      /*
        THE HANDOVER INTO SECTION 3.

        The previous slide is the finished file and the room photographs it, which
        makes it feel like an ending. It is not: a Dockerfile is still a text file,
        and Docker runs images. This slide names the gap in one beat so the divider
        that follows arrives as the answer to a question rather than as a new
        topic.

        Two cards, have against need, the same shape "Now We Need an Image" used
        earlier in the deck. No command appears here: the build command is taught
        on its own slides in the next section.
      */
      <ContentSlide
        kicker="Writing the Dockerfile"
        title="The File Is Done"
        lead="Now we build an image from the Dockerfile we just wrote"
        lesson={SESSION}
      >
        <div className="grid gap-5">
          <CardGrid cols={2}>
            <Card icon="code" title="What we have">
              A Dockerfile, six lines of plain text. Docker cannot run a text file
            </Card>
            <Card icon="database" title="What we need" tone="brand">
              An image built from those instructions, because an image is the only thing Docker
              runs
            </Card>
          </CardGrid>
          <Callout kind="info" title="The file is the recipe, not the meal" asStep={false}>
            Nothing has been built yet. The next section reads this file and produces the image
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Do not let the finished file feel like the end of the session. Ask the room what happens if they run docker run nxttrendz-app right now: nothing, because no image of that name exists, only a text file describing one. That is the gap this slide names and the next section closes. Point back at the definition slide as you say it, a Dockerfile is instructions for building an image, and instructions are not the image.',
  },

  /* --- 3. Build and Run --------------------------------------------- */
  {
    id: 'c3-divider',
    section: 'Build and Run',
    label: '03 Divider',
    element: (
      <SectionBreakerSlide
        index={3}
        title="Build and Run"
        mark="/assets/tech/docker-white.svg"
        markAlt="Docker"
        lesson={SESSION}
      />
    ),
    notes:
      'A Dockerfile is a text file and nothing more, so far. This section is where it becomes an image and then a running container, which is the first time in this course they produce something Docker can run.',
  },
  /*
    EXPLAIN THE COMMAND, THEN SHOW IT.

    Every command in this section gets two slides. The first says what the command
    does and what its output will mean; the second shows the command itself with
    the transcript. The room therefore reads a transcript it has already been told
    how to read, instead of being shown a wall of output and then talked through it.

    That split is also why the teaching cards moved off the transcript slides. They
    were the text half of a text-and-visual pair there and had to land with the
    terminal; on an explain slide they ARE the content, so they take a click each
    and arrive one at a time.

    THERE IS NO `docker pull` SLIDE. `FROM` pulls the base image as part of the
    build, so the room never types `pull` in this session, and teaching a command
    they will not use costs a slide that the build output needs more. The fact
    behind it survives: the build output slide names its first step as a download
    from Docker Hub, and says it is cached.
  */
  {
    id: 'c3-build-explain',
    section: 'Build and Run',
    label: 'What building does',
    element: (
      /*
        No command on this slide, deliberately. It answers "what happens when I
        build" so that the next slide can be one line the room copies, and so the
        transcript two slides later is read rather than explained.
      */
      <ContentSlide
        kicker="Build and Run"
        title="What Building Does"
        lead="It reads your Dockerfile top to bottom and produces an image"
        lesson={SESSION}
      >
        {/* Three cards, the same shape the other three explain slides use, so the
            section reads as one pattern repeating. Bullets alone left the right
            half of the frame empty against a full-width terminal on the slide
            that follows. */}
        <CardGrid cols={3}>
          <Card icon="route" title="Every instruction becomes a step">
            Docker carries them out in the order you wrote them, first line first
          </Card>
          <Card icon="database" title="The result is one image" tone="teal">
            With a name you choose, and that name is what every later command refers to
          </Card>
          <Card icon="folder" title="You say which folder to read" tone="accent">
            It takes the Dockerfile and the files your COPY lines ask for from there
          </Card>
        </CardGrid>
      </ContentSlide>
    ),
    notes:
      'Ask before you tell: they have a file and they want an image, so what has to happen. Three things to land here, and none of them needs the command on screen. The build works down the file, so order matters. It produces exactly one image and that image needs a name or they cannot refer to it. And it reads from a folder they nominate, which is the reason the wrong-folder error exists at all. Next slide is the command, and it will be one line.',
  },
  {
    id: 'c3-build',
    section: 'Build and Run',
    label: 'docker build',
    element: (
      /*
        `Terminal`, with the real prompt path, because this is a command the
        learner types (slide-content-rules rule 3). One panel, one command: the
        two callouts under it carry the anatomy, so the command itself stays a
        single unbroken line the room can copy.
      */
      <ContentSlide
        kicker="Build and Run"
        title="docker build"
        lead="Run it from the folder that holds the Dockerfile"
        lesson={SESSION}
      >
        <div className="grid gap-4">
          <Terminal
            path={CWD}
            fontSize={16}
            lines={[{ text: 'docker build -t nxttrendz-app .', kind: 'cmd' }]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Callout kind="info" title="-t names the image" asStep={false}>
              The tag you will type in every command after this one
            </Callout>
            <Callout kind="warning" title="The dot is not optional" asStep={false}>
              It is the build context: the folder Docker reads the Dockerfile and the COPY files
              from
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'The previous slide said what it does, so this one is just the line and its two parts. Point at the prompt path first. Run this from the wrong folder and nothing works, which is the same lesson as last session. The trailing dot is the single most common typo here, and the error it produces is unhelpful: ERROR: "docker buildx build" requires exactly 1 argument. Say that error out loud so they recognise it. Without -t the image gets no name and shows up as <none> in docker images, which is recoverable but confusing. NOT CAPTURED: this transcript is quoted from the TR, capture C1.',
  },
  {
    id: 'c3-build-output',
    section: 'Build and Run',
    label: 'Reading the output',
    element: (
      <ContentSlide
        kicker="Build and Run"
        title="Reading the Output"
        lead="Each instruction became a numbered step, in the order you wrote it"
        lesson={SESSION}
      >
        <div className="grid gap-4">
          <Terminal
            path={CWD}
            fontSize={14}
            lines={[
              { text: 'docker build -t nxttrendz-app .', kind: 'cmd' },
              { text: '[+] Building 12.4s (10/10) FINISHED' },
              { text: ' => [1/5] FROM docker.io/library/python:3.14-slim      4.2s' },
              { text: ' => [2/5] WORKDIR /app                                 0.1s' },
              { text: ' => [3/5] COPY requirements.txt .                      0.1s' },
              { text: ' => [4/5] RUN pip install -r requirements.txt          6.8s' },
              { text: ' => [5/5] COPY . .                                     0.2s' },
              { text: ' => naming to docker.io/library/nxttrendz-app          0.0s' },
            ]}
          />
          {/*
            Two callouts, and the second one is where the old `docker pull` slide's
            content went. FROM downloads the base image from Docker Hub as part of
            the build, so the fact is taught at the line that shows it happening
            rather than as a command the room will never type.
          */}
          <div className="grid grid-cols-2 gap-4">
            <Callout kind="info" title="Five instructions, five steps" asStep={false}>
              Compare the step list with your file. Same lines, same order, and the slow one is the
              install
            </Callout>
            <Callout kind="tip" title="Step one was a download" asStep={false}>
              FROM fetched the base image from Docker Hub. It is cached, so the next build reuses
              it
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Read down the steps and back up to the Dockerfile: the room should see them as the same list twice. Three things to point at. There are five steps and six lines, because CMD declares rather than executes, so it never becomes a build step. Step one took 4.2 seconds because it was a 150 MB download from Docker Hub, and it is cached, so the second build of the day does not repeat it; that is also why they will almost never fetch a base image by hand. And the timings are lopsided: the install took 6.8 of the 12.4 seconds, which is the fact the fourth section is built on. Their numbers will differ. NOT CAPTURED: quoted from the TR, capture C2.',
  },
  /*
    THREE COMMANDS, TWO SLIDES EACH.

    `docker images`, `docker run` and `docker ps` are listed in the TR's recap as
    things the room already knows. They do not: Session 1's deck contains
    `docker --version` and `docker run hello-world` and nothing else. So they are
    taught here, properly, and the recap slide no longer claims otherwise.

    They are NOT a reference table dropped in front of the build. Each one is
    placed at the first moment the session actually needs it, so every command
    answers a question the room has just asked:

      images  the build says it built something. Where did that something go?
      run     an image is not running anything. How do I start it?
      ps      it printed and vanished. Where is my container?

    LAYOUT NOTE FOR ALL SIX SLIDES.

    The explain slide carries the teaching as three cards through `CardGrid`, one
    click each. The transcript slide carries the `Terminal` at full width and
    nothing else, rather than the deck's usual bullets-left/visual-right split:
    these are slides ABOUT terminal output, and in the narrow right-hand column
    the prompt alone (`PS C:\nxttrendz-docker-demo> `) ate half the line, so
    `python:3.14-slim` wrapped mid-token and the `docker ps -a` table wrapped its
    last column onto its own line. A wrapped table is not a table.
  */
  {
    id: 'c3-images-explain',
    section: 'Build and Run',
    label: 'Where the image went',
    element: (
      <ContentSlide
        kicker="Build and Run"
        title="Where Did the Image Go"
        lead="The build finished, and nothing about your folder changed"
        lesson={SESSION}
      >
        <CardGrid cols={3}>
          <Card icon="database" title="Docker keeps it, not your folder">
            Images live in Docker's own storage, which is why no new file appeared beside your code
          </Card>
          <Card icon="eye" title="One command lists them" tone="teal">
            Every image on the machine, the ones you built and the base images your builds
            downloaded
          </Card>
          <Card icon="lock" title="Built once, never changes" tone="accent">
            It sits there until you delete it, and the next section is built on exactly that
          </Card>
        </CardGrid>
      </ContentSlide>
    ),
    notes:
      'Let them look for the image in their own folder first, because that is where a beginner looks and it is not there. Then the three cards: Docker stores it itself, one command lists what it is storing, and an image never changes once built. That last card is the layer and cache story arriving early, so plant it in one sentence and move on. The command is on the next slide.',
  },
  {
    id: 'c3-images',
    section: 'Build and Run',
    label: 'docker images',
    element: (
      <ContentSlide
        kicker="Build and Run"
        title="docker images"
        lead="The build said it finished. This is the proof"
        lesson={SESSION}
      >
        <div className="grid gap-4">
          <Terminal
            path={CWD}
            fontSize={14}
            lines={[
              { text: 'docker images', kind: 'cmd' },
              { text: 'REPOSITORY      TAG         IMAGE ID       CREATED          SIZE' },
              { text: 'nxttrendz-app   latest      3f2a8b91c04d   30 seconds ago   156MB' },
              { text: 'python          3.14-slim   a91b7c2d4e05   2 weeks ago      151MB' },
            ]}
          />
          <Callout kind="info" title="REPOSITORY is the name you chose" asStep={false}>
            nxttrendz-app, the tag the <Code>-t</Code> flag gave it, and the row under it is the
            base image FROM downloaded
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Two rows, and the second one is worth a sentence: the base image is sitting there too, and their own image is only about 5 MB bigger than it. The TAG column says latest because they did not ask for a version; that is a default, not a claim about being up to date. Their IMAGE ID and timings will differ. NOT CAPTURED: quoted from the TR, capture C3.',
  },
  {
    id: 'c3-run-explain',
    section: 'Build and Run',
    label: 'What running does',
    element: (
      <ContentSlide
        kicker="Build and Run"
        title="What Running Does"
        lead="An image sits there doing nothing until you start a container from it"
        lesson={SESSION}
      >
        <CardGrid cols={3}>
          <Card icon="play" title="Creates, then starts">
            A container is made from the image, and the image itself is left untouched
          </Card>
          <Card icon="terminal" title="It runs what CMD declared" tone="teal">
            Here that is python app.py, so you should expect your three lines
          </Card>
          <Card icon="bolt" title="Run it again, get another" tone="accent">
            One image, many containers, exactly as last session promised
          </Card>
        </CardGrid>
      </ContentSlide>
    ),
    notes:
      'Point back at the CMD line of their Dockerfile while you say the second card, because this is the slide where that instruction finally does something. Ask the room to predict the output before the next slide: they wrote app.py, so they already know what three lines should appear. The third card is the class-and-object idea from last session, said once, so keep it short.',
  },
  {
    id: 'c3-run',
    section: 'Build and Run',
    label: 'docker run',
    element: (
      <ContentSlide
        kicker="Build and Run"
        title="docker run"
        lead="Your own app.py, printing from inside a container"
        lesson={SESSION}
      >
        <div className="grid gap-4">
          <Terminal
            path={CWD}
            fontSize={14}
            lines={[
              { text: 'docker run nxttrendz-app', kind: 'cmd' },
              { text: 'nxttrendz backend starting...' },
              { text: 'nxttrendz frontend starting...' },
              { text: 'Connected successfully!', kind: 'ok' },
            ]}
          />
          <Callout kind="success" title="This is the whole session in one output" asStep={false}>
            Three lines from an environment you described in six lines of text
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Stop on this one. Those are the three lines from their own app.py, printed from inside a container, in an environment they described in six lines of text. Then have them run it twice and note that nothing breaks: the second run is a second container from the same untouched image. NOT CAPTURED: quoted from the TR, capture C4.',
  },
  {
    id: 'c3-ps-explain',
    section: 'Build and Run',
    label: 'Where the container went',
    element: (
      /*
        This slide exists because the previous one raises a question the deck used
        to answer with a callout: the container printed and vanished. It also
        inoculates against the "my container is not running" panic, which is
        otherwise the first thing they hit alone.
      */
      <ContentSlide
        kicker="Build and Run"
        title="Where Did the Container Go"
        lead="It printed three lines and disappeared, and that is correct behaviour"
        lesson={SESSION}
      >
        <CardGrid cols={3}>
          <Card icon="bulb" title="It lives as long as its command">
            Three prints, then nothing left to do, so the container stopped
          </Card>
          <Card icon="eye" title="Stopped is not the same as gone" tone="teal">
            It is still on the machine, finished, and you can still list it
          </Card>
          <Card icon="check" title="Finishing is not failing" tone="accent">
            A container that completed its work exits with a success code
          </Card>
        </CardGrid>
      </ContentSlide>
    ),
    notes:
      'Ask the question out loud before you answer it, because every room asks it: where did it go. This is the single most common beginner panic, "my container is not running", and it is usually correct behaviour for a container whose command has finished. Say the third card carefully, since the next slide shows Exited (0) and a zero looks like an error to someone who has never seen an exit code. The command that shows all of this is on the next slide.',
  },
  {
    id: 'c3-ps',
    section: 'Build and Run',
    label: 'docker ps',
    element: (
      /*
        Two commands in ONE panel: same terminal, typed one after the other, which
        is not the two-terminals case the rule is about. The empty first table is
        the teaching, so both have to be visible together.
      */
      <ContentSlide
        kicker="Build and Run"
        title="docker ps"
        lead="Nothing is running, and adding -a finds the one that finished"
        lesson={SESSION}
      >
        <div className="grid gap-4">
          <Terminal
            path={CWD}
            fontSize={14}
            lines={[
              { text: 'docker ps', kind: 'cmd' },
              { text: 'CONTAINER ID   IMAGE   STATUS   NAMES' },
              { text: '' },
              { text: 'docker ps -a', kind: 'cmd' },
              { text: 'CONTAINER ID   IMAGE           STATUS       NAMES' },
              { text: '9c4f1a7b2e83   nxttrendz-app   Exited (0)   bold_hopper' },
            ]}
          />
          <Callout kind="info" title="Exited (0) is a success code" asStep={false}>
            The same zero every program returns when it finishes cleanly, so it is not an error
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'The empty first table is the teaching, so do not skip past it: ps shows running containers only, and theirs is correctly absent. Then -a finds it, Exited (0). Worth naming: the container got a random name, bold_hopper here, because they did not pass --name. Their id and name will differ. NOT CAPTURED: quoted from the TR, capture C4.',
  },
  {
    id: 'c3-journey',
    section: 'Build and Run',
    label: 'The full journey',
    element: (
      <ContentSlide
        kicker="Build and Run"
        title="The Full Journey"
        lesson={SESSION}
      >
        <div className="grid gap-6">
          <FlowChart
            nodes={[
              {
                label: 'Your files',
                caption: 'app.py · requirements.txt · Dockerfile',
                icon: 'code',
              },
              { label: 'docker build', caption: 'reads the recipe', icon: 'settings' },
              { label: 'Image', caption: 'nxttrendz-app', icon: 'database' },
              { label: 'Container', caption: 'prints, then exits', icon: 'play' },
            ]}
          />
          <Callout kind="tip" title="You have met this shape before">
            <Code>makemigrations</Code> writes the instructions and <Code>migrate</Code> executes
            them. The Dockerfile is the instructions, and <Code>docker build</Code> executes them
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'This is the shape to keep coming back to for the rest of the course, so make them say it back: files, build, image, run, container. The Django parallel is worth the time, because they already trust it: nobody expects makemigrations to change the database, and for the same reason nobody should expect an edited app.py to change an existing image. That is the Images Are Frozen slide.',
  },
  {
    id: 'c3-quiz',
    section: 'Build and Run',
    label: 'Quiz Time',
    element: <QuizTimeSlide lesson={SESSION} />,
    notes:
      'Ask from the quiz tool and hold this slide while the room answers. The question for this beat: you change one line in app.py, save it, and run docker run nxttrendz-app again. What do you see? Answer: the OLD output, unchanged, because the image was built from the old code and docker run uses the image. This is deliberately a PREDICTION, signed off as an exception to the quiz rule: the deck teaches the answer on the Images Are Frozen slide, and asking first is what makes that slide land. Take a show of hands before revealing anything, and do not confirm the answer yet, just say "hold that" and move on.',
  },

  /* --- 4. Layers and the Build Cache -------------------------------- */
  {
    id: 'c4-divider',
    section: 'Layers and the Build Cache',
    label: '04 Divider',
    element: (
      <SectionBreakerSlide index={4} title="Layers and the Build Cache" lesson={SESSION} />
    ),
    notes:
      'This section answers the question parked on the COPY slide: why copy requirements before the code. It is also the section that pays off every time they rebuild for the rest of the course.',
  },
  {
    id: 'c4-layers',
    section: 'Layers and the Build Cache',
    label: 'Every instruction is a layer',
    element: (
      /*
        `LayerStack` again, the figure Session 1 used for OS, runtime and code,
        now labelled with the instructions. `stepped={false}` so the stack lands
        WITH the bullets rather than after them: the text and its visual are one
        idea. Layers are listed top-first, so the array reads the way the figure
        looks, which is why FROM is last here.
      */
      <ContentSlide
        kicker="Layers and the Build Cache"
        title="Every Instruction Is a Layer"
        lesson={SESSION}
        points={[
          {
            text: 'An image is not one solid block',
            sub: 'Each instruction saves a snapshot stacked on the one below it',
            icon: 'database',
          },
          {
            text: 'The stack is built bottom up',
            sub: 'FROM at the base, CMD on top, in file order',
            icon: 'arrow',
          },
        ]}
      >
        <div className="flex justify-center">
          <LayerStack
            width={330}
            stepped={false}
            layers={[
              { label: 'CMD ["python", "app.py"]', state: 'ships' },
              { label: 'COPY . .', note: 'your code', state: 'ships' },
              { label: 'RUN pip install', note: 'packages', state: 'ships' },
              { label: 'COPY requirements.txt .', state: 'ships' },
              { label: 'WORKDIR /app', state: 'ships' },
              { label: 'FROM python:3.14-slim', note: 'base', state: 'ships' },
            ]}
            caption="Six instructions, six stacked snapshots"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Same figure as last session, different labels, and that is worth pointing out: the layers they argued about then (OS, runtime, code) are these layers, described in a file. The one to point at is the pip install layer, because it is the expensive one and the whole next slide is about not paying for it twice.',
  },
  {
    id: 'c4-cached',
    section: 'Layers and the Build Cache',
    label: 'Rebuild is instant',
    element: (
      <ContentSlide
        kicker="Layers and the Build Cache"
        title="Rebuild Is Instant"
        lead="The same command again, with nothing changed"
        lesson={SESSION}
      >
        <div className="grid grid-cols-[1.55fr_1fr] items-center gap-6">
          <Terminal
            path={CWD}
            fontSize={13}
            lines={[
              { text: 'docker build -t nxttrendz-app .', kind: 'cmd' },
              { text: '[+] Building 0.8s (10/10) FINISHED' },
              { text: ' => CACHED [2/5] WORKDIR /app', kind: 'ok' },
              { text: ' => CACHED [3/5] COPY requirements.txt .', kind: 'ok' },
              { text: ' => CACHED [4/5] RUN pip install -r requirements.txt', kind: 'ok' },
              { text: ' => CACHED [5/5] COPY . .', kind: 'ok' },
            ]}
          />
          <div className="grid gap-4">
            <StatTile value="12.4s" label="First build" />
            <StatTile value="0.8s" label="Nothing changed" tone="teal" />
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Every step says CACHED, and the install that took 6.8 seconds took none at all. Docker did not redo the work, it reused the saved layers. Say what CACHED actually means: the inputs to that layer are identical to last time, so the snapshot from last time is still valid. Their numbers will differ, and on a real project with fifty packages the gap is minutes rather than seconds. NOT CAPTURED: quoted from the TR, capture C5.',
  },
  {
    id: 'c4-rule',
    section: 'Layers and the Build Cache',
    label: 'When a layer changes',
    element: (
      /*
        One rule, alone on a slide, note first. Everything else in this section
        is a consequence of it, so it gets stated before the consequences rather
        than derived at the end.
      */
      <ContentNoteSlide
        kicker="Layers and the Build Cache"
        title="When a Layer Changes"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'warning',
          title: 'One rule governs the cache',
          body: (
            <>
              When a layer changes, that layer and <strong>every layer after it</strong> must be
              rebuilt
            </>
          ),
        }}
        points={[
          {
            text: 'Docker reuses a layer whose inputs did not change',
            sub: 'That is exactly what CACHED means',
            icon: 'check',
          },
          {
            text: 'A changed layer invalidates everything below it in the file',
            sub: 'So the order you write the instructions in decides what stays cached',
            icon: 'warning',
          },
        ]}
      />
    ),
    notes:
      'Say the rule twice and make it concrete: a layer cannot be reused if the thing it was built on top of has changed, because it might have come out differently. Then set up the next slide by asking which single instruction changes most often on a real project. The answer is the one that copies their code, and where that line sits is the entire lesson.',
  },
  {
    id: 'c4-copy-order',
    section: 'Layers and the Build Cache',
    label: 'Why COPY order matters',
    element: (
      /*
        The payoff for the tease on the COPY slide. `DataTable` because the teaching IS
        the column comparison: the eye has to run down the two orderings and see
        that the expensive middle row survives in one and not the other.
      */
      <ContentSlide
        kicker="Layers and the Build Cache"
        title="Why COPY Order Matters"
        lead="You edit one line of app code, then rebuild"
        lesson={SESSION}
      >
        <div className="grid gap-5">
          <DataTable
            compact
            highlight={[2]}
            columns={[
              { label: 'Instruction', weight: 1.3 },
              { label: 'Requirements first', weight: 1 },
              { label: 'Everything first', weight: 1.2 },
            ]}
            rows={[
              ['COPY requirements.txt .', 'CACHED', 'REBUILT, the code changed'],
              ['RUN pip install', 'CACHED', 'REBUILT, reinstalls every package'],
              ['COPY . .', 'REBUILT', 'REBUILT'],
            ]}
          />
          <Callout kind="success" title="Rule of thumb">
            Order your instructions from <strong>least changing at the top</strong> to most changing
            at the bottom
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Point back at the COPY slide and pay off the question they parked. Code changes daily, requirements change rarely, so putting the requirements copy above the install keeps the slow layer cached almost always. The highlighted row is the one that costs money. This is not a micro-optimisation: later in this course the image is rebuilt automatically on every code push, and cache friendly ordering is the difference between a ten second and a ten minute build. Tool name for that stage stays off the slide by R3, but for your own reference it is the Jenkins sessions.',
  },

  /* --- 5. .dockerignore and Mistakes -------------------------------- */
  {
    id: 'c5-divider',
    section: '.dockerignore and Mistakes',
    label: '05 Divider',
    element: (
      <SectionBreakerSlide index={5} title=".dockerignore and Mistakes" lesson={SESSION} />
    ),
    notes:
      'Two halves. First what to leave out of the image, then the two errors every beginner makes at least once. Both errors are demonstrated as predictions, so keep the room guessing before you explain.',
  },
  {
    id: 'c5-copy-everything',
    section: '.dockerignore and Mistakes',
    label: 'COPY . . copies everything',
    element: (
      /*
        Framed against `nxttrendz\backend`, not against today's demo folder,
        because the demo has none of these files and pretending otherwise would
        be inventing evidence. The demo folder holds three files and `COPY . .`
        is harmless there; the moment they point the same Dockerfile at the real
        backend it is not, and that is the moment this slide is preparing them
        for.
      */
      <ContentSlide
        kicker=".dockerignore and Mistakes"
        title="COPY . . Means Everything"
        lead="Harmless in docker-demo. Point it at nxttrendz/backend and it sweeps up all of this"
        lesson={SESSION}
      >
        <CardGrid cols={2}>
          <Card icon="database" title="env/" tone="accent" className="!p-5 !text-body-sm">
            The virtual environment. Huge, and pointless inside an image, because the image is the
            environment
          </Card>
          {/* WAS `.git/`, AND IT CANNOT BE. Version control has not been taught
              at any point in this course, so the card asked the room to exclude
              a folder it has never been told about, and the .dockerignore slide
              then leaned on .gitignore twice to explain itself. Both were
              borrowing authority from a tool nobody here has met.

              `.vscode/` costs nothing to introduce: they have been inside VS
              Code all session, right-clicking this very folder to open its
              terminal. */}
          <Card icon="settings" title=".vscode/" className="!p-5 !text-body-sm">
            Your editor settings, which belong to you and not to the image
          </Card>
          <Card icon="code" title="__pycache__/" tone="teal" className="!p-5 !text-body-sm">
            Compiled Python cache, rebuilt automatically and never worth shipping
          </Card>
          <Card icon="server" title="db.sqlite3" tone="accent" className="!p-5 !text-body-sm">
            Your local development database, with your local test data inside it
          </Card>
        </CardGrid>
      </ContentSlide>
    ),
    notes:
      'Say the framing first: today’s docker-demo folder has three files in it, so COPY . . costs nothing there. Then have them picture nxttrendz/backend, which is the folder this Dockerfile is really aimed at, and these four are all sitting in it right now. The env folder is the one to dwell on, because it is the most common and the most illogical once you see it: they would be copying a Python environment into an image that already is one. Bigger image, slower build, and on a real project env can be larger than everything else combined. The database one is worth a warning too: ship db.sqlite3 and your local test data travels to every machine that runs the image.',
  },
  {
    id: 'c5-dockerignore',
    section: '.dockerignore and Mistakes',
    label: '.dockerignore',
    element: (
      <ContentSlide
        kicker=".dockerignore and Mistakes"
        title=".dockerignore"
        lesson={SESSION}
        points={[
          {
            text: 'Create it in docker-demo',
            sub: 'Beside the Dockerfile, in the same folder the build reads from',
            icon: 'folder',
          },
          {
            text: 'Listed paths are excluded from COPY',
            sub: 'Smaller images, faster builds, no junk baked in',
            icon: 'check',
          },
          {
            /* This bullet used to be "You already know this file", resting the
               whole explanation on .gitignore. Nothing in this course has
               introduced it, so the bullet now teaches the syntax instead,
               which the slide never did and needs to. */
            text: 'One path per line',
            sub: 'A trailing slash means a folder, and * matches any name',
            icon: 'code',
            tone: 'accent',
          },
        ]}
      >
        <CodeBlock
          filename="docker-demo\.dockerignore"
          language="text"
          showLineNumbers={false}
          maxHeight={220}
          code={`env/
.vscode/
__pycache__/
*.pyc
db.sqlite3`}
        />
      </ContentSlide>
    ),
    notes:
      'Five lines, and each one is a folder or a pattern they saw on the slide before. Two practical notes. It has to sit beside the Dockerfile, in the build context root, or Docker never reads it. And it is worth having them run docker images before and after adding it on a real project, because the size difference is the argument.',
  },
  {
    id: 'c5-mistake-1',
    section: '.dockerignore and Mistakes',
    label: 'Mistake one',
    element: (
      /*
        Asked as a prediction. The Dockerfile and the failing terminal land
        together on entry; only the explanation is click-gated, so the room gets
        a real chance to guess before it is told. That gate is a genuine teaching
        beat, which is the one case the parallel-reveal rule keeps `Step` for.
      */
      <ContentSlide
        kicker=".dockerignore and Mistakes"
        title="Nothing to Run"
        lead="This builds successfully. Predict what happens when you run it"
        lesson={SESSION}
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-2 items-start gap-6">
            <CodeBlock
              filename="Dockerfile"
              language="dockerfile"
              maxHeight={170}
              code={`FROM python:3.14-slim
WORKDIR /app
CMD ["python", "app.py"]`}
            />
            <Terminal
              path={CWD}
              fontSize={13}
              lines={[
                { text: 'docker run nxttrendz-app', kind: 'cmd' },
                {
                  text: "python: can't open file '/app/app.py': [Errno 2] No such file or directory",
                },
              ]}
            />
          </div>
          <Callout kind="warning" title="Why the build did not catch it">
            <Code>CMD</Code> is not executed at build time, so the build has no way to notice the
            missing file. The fix is the <Code>COPY . .</Code> line: the code has to be in the image
            before <Code>CMD</Code> can run it
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Ask for the prediction before you click. Most rooms expect the build to fail, and that expectation is the useful mistake: a build that succeeds is not a promise that the container works. Trace the error with them: WORKDIR set /app, CMD asked for app.py inside /app, and nothing ever copied it there. This is also why the COPY slide mattered, since COPY is the only instruction that puts their code in the image.',
  },
  {
    id: 'c5-mistake-2',
    section: '.dockerignore and Mistakes',
    label: 'Mistake two',
    element: (
      /*
        The answer to the section 3 quiz. Two panels here is correct and is not
        the two-terminals case: the left is what they get, the right is the fix,
        and putting them side by side is what makes the missing rebuild visible.
      */
      <ContentSlide
        kicker=".dockerignore and Mistakes"
        title="Images Are Frozen"
        lead="You edit app.py, save it, and run the container again"
        lesson={SESSION}
      >
        <div className="grid gap-4">
          <div className="grid grid-cols-2 items-start gap-6">
            <Terminal
              path={CWD}
              fontSize={13}
              caption="What you get"
              lines={[
                { text: 'docker run nxttrendz-app', kind: 'cmd' },
                { text: 'nxttrendz backend starting...' },
                { text: 'nxttrendz frontend starting...' },
                { text: 'Connected successfully!' },
              ]}
            />
            <Terminal
              path={CWD}
              fontSize={13}
              caption="The fix: rebuild, then run"
              /* All three output lines, not just the changed one. Showing only
                 the new line would imply the other two disappeared, and this is
                 the slide about output being trustworthy. */
              lines={[
                { text: 'docker build -t nxttrendz-app .', kind: 'cmd' },
                { text: 'docker run nxttrendz-app', kind: 'cmd' },
                { text: 'nxttrendz backend starting...' },
                { text: 'nxttrendz frontend is now live!', kind: 'ok' },
                { text: 'Connected successfully!' },
              ]}
            />
          </div>
          <Callout kind="warning" title="Every line is the old one">
            <Code>docker run</Code> uses the <strong>image</strong>, and the image was built from
            the old code. Editing files on your machine changes nothing inside an image that already
            exists
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'This is the answer to the quiz. Take the show of hands again first, then reveal. The sentence to make them repeat: images are frozen at build time. Then name the rhythm, edit, rebuild, run, and be honest that typing it every time gets tedious, which is why automating exactly this comes later in the course. Tool name stays off the slide by R3; for your own reference it is the Makefile session.',
  },

  /* --- Closing frame ------------------------------------------------ */
  {
    id: 'command-summary',
    section: 'Closing',
    label: 'The commands you used',
    element: (
      /*
        The session's OTHER vocabulary, and the pairing with the instruction table
        before it is deliberate. Beginners blur the two: they try to type FROM into
        a terminal, or to put `docker build` inside the Dockerfile. Two tables, side
        by side in the deck, make the split explicit. The "Where you type it" column
        is the whole point of the slide.
      */
      <ContentSlide
        kicker="Docker File Creation"
        title="The Commands You Used"
        lead="Instructions go in the file. These go in the terminal"
        lesson={SESSION}
      >
        <DataTable
          compact
          tone="teal"
          highlight={[1]}
          columns={[
            { label: 'Command', weight: 1.15 },
            { label: 'What it does', weight: 1.9 },
            { label: 'When you need it', weight: 1.2 },
          ]}
          rows={[
            ['docker build -t name .', 'Reads the Dockerfile and produces an image', 'Every time you change the code'],
            ['docker images', 'Lists the images on your machine', 'To check a build worked'],
            ['docker run name', 'Creates a container from an image and starts it', 'To actually run your app'],
            ['docker ps -a', 'Lists containers, running and stopped', 'To find out where one went'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The highlighted row is the only command they met for the first time today, and it is the one this whole session was about. Read the last column down: it is a workflow, not a list. If you have time for one question, ask which of these four goes inside the Dockerfile. The answer is none, and that confusion is the reason this table sits next to the instruction table rather than being merged with it.',
  },
  {
    id: 'closing-quiz',
    section: 'Closing',
    label: 'Quiz Time',
    element: <QuizTimeSlide lesson={SESSION} />,
    notes:
      'The second and last quiz beat, and the only one that spans the whole session. Ask it before the takeaways, not after, so the takeaways confirm what the room just worked out instead of announcing it. The question for this beat: one of RUN and CMD happens while the image is being built, and the other happens when a container starts. Which is which, and what breaks if you swap them? Answer: RUN runs at build time and its result is baked into the image, CMD runs at container start and is the default command; swap them and pip install runs on every container start while the app never starts at all. Take a show of hands on RUN first, then CMD, and only then confirm. If the room is quick, follow up with the naming rule: the build says it cannot find a Dockerfile, and the folder holds a file called Dockerfile.txt, so what happened.',
  },
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Key takeaways',
    element: (
      <KeyTakeawaysSlide
        kicker="Key Takeaways"
        title={SESSION}
        lesson={SESSION}
        /* The agenda's five items, verbatim and in order. Not a paraphrase: the
           room was promised these five words at the start, so these five words
           are what the close hands back. */
        points={[
          'The Dockerfile',
          'Writing the Dockerfile',
          'Build and Run',
          'Layers and the Build Cache',
          '.dockerignore and Mistakes',
        ]}
      />
    ),
    notes:
      'The same five items as the agenda, in the same order, in a different UI. Restate each as something they can now do rather than something they have seen: they can write a Dockerfile, build an image from it, run a container, and explain why the second build is instant.',
  },
  {
    id: 'practice',
    section: 'Closing',
    label: 'Practice',
    element: (
      <PracticeSlide
        kicker="Practice"
        title="Before the Next Session"
        prompt="Do the whole loop yourself, at least twice"
        lesson={SESSION}
        tasks={[
          {
            text: 'Build the project folder again from scratch',
            sub: 'A new folder, the two files, then the Dockerfile from memory',
          },
          {
            text: 'Run all four commands on it',
            sub: 'build, then images, then run, then ps -a, in that order',
          },
          {
            text: 'Change one print line and run without rebuilding',
            sub: 'Watch the old output appear, then rebuild and watch it change',
          },
        ]}
      />
    ),
    notes:
      'The second task is the important one, because it is the edit, rebuild, run rhythm and it is the habit that stops the frozen image confusion from ever coming back. Ask them to note down the two build times, since the cache lesson is more convincing on their own machine than on a slide.',
  },
  {
    id: 'next-session',
    section: 'Closing',
    label: 'Next session',
    element: (
      /*
        NO index: the deck has exactly five numbered sections and this is not a
        sixth.

        The title sat empty until the session 3 topic was settled. It now is, so
        the name is on the slide: this is the handover frame, and R3's ban on
        naming a later tool covers the teaching slides, not the frame whose entire
        job is to say what comes next.
      */
      <SectionBreakerSlide
        kicker="Next session"
        title="Docker Compose Multi-Container"
        lesson={SESSION}
      />
    ),
    notes:
      'Land the handover: today they wrote one Dockerfile and built one image, and next session that stops being enough, because a real project is a backend and a frontend and a database that have to come up together. Do not teach anything here and do not open a compose file, just leave the name on screen and the reason for it in one sentence. Nothing to do between now and then except the practice tasks.',
  },
  {
    id: 'thank-you',
    section: 'Closing',
    label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
  },
]
