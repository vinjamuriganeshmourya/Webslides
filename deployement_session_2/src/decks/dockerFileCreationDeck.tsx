import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
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
 *   `Web Slides/workflow/plans/deployement_session_2.md`
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
 *      and `docker run hello-world` and nothing else. `docker pull`, `docker
 *      images` and `docker ps` are therefore TAUGHT in section 3 of this deck,
 *      one per slide, each at the point the session first needs it.
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
 * The growing file, as slides 13 to 19 render it. One place for the props so a
 * later tweak (font size, line numbers, cap) cannot drift between the seven.
 */
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
        THE RECAP MAY ONLY CLAIM WHAT SESSION 1 ACTUALLY TAUGHT.

        The TR's recap block ends with "Key commands: docker pull, docker run,
        docker ps, docker images". Session 1's deck contains exactly two commands,
        `docker --version` and `docker run hello-world`. Three of those four have
        never been explained to this room, so a pill saying "four commands you
        already ran" is false, and it also quietly removes the reason to teach
        them. They are taught in section 3 of this deck instead, each at the point
        where it is first needed, and the fourth pill now says what really
        happened last session.
      */
      <RecapSlide
        kicker="Recap"
        title="Last Session"
        lesson={SESSION}
        points={[
          {
            text: 'Docker packages an app with all its dependencies into an image',
            sub: 'One sealed unit that runs the same way anywhere',
          },
          {
            text: 'A running instance of an image is a container',
            sub: 'One image, many containers, just like a class and its objects',
          },
          {
            text: 'Ready-made images come from Docker Hub',
            sub: 'hello-world, python, node, nginx, all built by someone else',
          },
          {
            text: 'You installed Docker and ran your first container',
            sub: 'docker --version to check the install, then docker run hello-world',
          },
        ]}
      />
    ),
    notes:
      'Do not re-teach any of these, read them as settled facts. The one word to say twice is image, because the whole session is about producing one. If the room is shaky on image versus container, spend thirty seconds on the class and object comparison from last time, then move on: slide 27 comes back to it anyway.',
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
    is the section announced. So these two slides sit BEFORE the divider. They
    carry the section in the rail, because that is where they belong
    structurally, but on stage they are the reason the section exists.
  */
  {
    id: 'c1-question',
    section: 'The Dockerfile',
    label: 'The question',
    element: (
      <ContentNoteSlide
        kicker="Docker File Creation"
        title="Someone Else's App"
        lesson={SESSION}
        points={[
          {
            text: 'hello-world proved Docker works',
            sub: 'You pulled an image and ran a container from it',
            icon: 'check',
          },
          {
            text: 'But it was not your application',
            sub: 'Every image you have run so far was built by somebody else',
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
      'Last session ended on a win, and this slide turns it into a gap. Ask the room who built the hello-world image. Nobody in the room did. That is the whole setup: pulling somebody else\u2019s image is consuming Docker, and today they start producing.',
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
            sub: 'A new folder named docker-demo, a sibling of the two apps and not inside either',
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
      'Do this with them, do not describe it. Say why it is a separate folder and not the backend: today is about Docker, and the moment settings.py is on screen the room debugs Django instead. Also a real reason they will meet on slide 37, COPY . . copies the whole folder, so a Dockerfile sitting in the project root would sweep both apps into one image. The prompt matters: every terminal in this deck reads PS C:\\nxttrendz\\docker-demo>, and "wrong folder" is the first error they will hit, exactly as it was last session. Their drive letter or path may differ, and that is fine as long as they read their own prompt. On macOS and Linux this is ~/nxttrendz/docker-demo.',
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
    id: 'c1-recipe-card',
    section: 'The Dockerfile',
    label: 'A recipe card',
    element: (
      /*
        The analogy is installed before the term. `StepList` and not a card grid,
        because the ordering is the half of the analogy that carries the lesson:
        a recipe read out of order produces something else. Its steps stay
        click-gated, since that ordering IS the teaching beat here.
      */
      <ContentSlide
        kicker="The Dockerfile"
        title="A Recipe Card"
        lead="Anyone holding the card produces the same dish, in any kitchen"
        lesson={SESSION}
      >
        <StepList
          steps={[
            { title: 'Start with a base', detail: 'Take a pan of boiling water', icon: 'play' },
            { title: 'Add ingredients', detail: 'Add rice, then vegetables', icon: 'arrow' },
            { title: 'Perform steps in order', detail: 'Simmer for ten minutes', icon: 'route' },
            { title: 'Serve', detail: 'Garnish and serve hot', icon: 'check' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Walk down the rail and land on the last line of the lead: the same card, in any kitchen, gives the same dish. Then ask what happens if you serve before you simmer. Order is not decoration, and that is the point the next slide cashes in.',
  },
  {
    id: 'c1-recipe-to-dockerfile',
    section: 'The Dockerfile',
    label: 'Recipe to Dockerfile',
    element: (
      /*
        NO KEYWORDS ON THIS SLIDE.

        The right column used to read "Start from a base image (FROM)", which put
        all four instruction names on screen before the room had been told what an
        instruction even is (next slide but one) and before any of them had been
        taught (section 2). That is the answer arriving before the question: by
        the time the FROM slide came around, the word was already old news and the
        slide had nothing left to reveal.

        So the right column stays in plain language. The room leaves this slide
        knowing a Dockerfile has a step that picks a base and a step that copies
        the code in, and section 2 gives each of those steps its name at the
        moment it teaches it. Same mapping, one layer of vocabulary later.
      */
      <ContentSlide kicker="The Dockerfile" title="Recipe to Dockerfile" lesson={SESSION}>
        <AnalogyMap
          leftLabel="Recipe card"
          rightLabel="Dockerfile"
          rows={[
            { from: 'Pan of boiling water', to: 'Start from something that already exists' },
            { from: 'Add rice and vegetables', to: 'Bring your code in' },
            { from: 'Simmer for ten minutes', to: 'Install what the app depends on' },
            { from: 'Garnish and serve', to: 'Say how the app is started' },
            { from: 'Same dish in any kitchen', to: 'Same image on any machine' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Read across each row and stop. There are deliberately no keywords on this slide: the room should leave it knowing a Dockerfile has four kinds of step, not knowing four new words. Each word arrives in the next section, on the slide that teaches what it does. If someone already knows the keywords and calls one out, take it and say "that is exactly the one, and it has a slide". The bottom row is the row that matters: same dish in any kitchen is last session’s promise, and the Dockerfile is how it gets kept.',
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
      'Both points are day-one mistakes that cost twenty minutes each. VS Code will happily save Dockerfile.txt and the build then says it cannot find a Dockerfile, which reads like Docker is broken. On the folder: put it beside app.py, not in a subfolder, and slide 21 explains why in terms of the build context.',
  },
  {
    id: 'c1-anatomy',
    section: 'The Dockerfile',
    label: 'One line, one instruction',
    element: (
      /*
        The pattern, once, so the writing section reads as one thing repeating
        rather than five new things.

        The first bullet used to list all five keywords as its sub, which is the
        same answer-too-early mistake as the analogy slide, just smaller: the
        room would have read every instruction name before a single one had been
        explained. The shape is what this slide teaches. The names are what the
        next five teach.
      */
      <ContentSlide
        kicker="The Dockerfile"
        title="One Line, One Instruction"
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
            text: 'Five instructions containerise most Python apps',
            sub: 'One per slide from here, and the file grows by a line each time',
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
      'Uppercase is a convention, not a requirement, and it is worth saying so: Docker accepts lowercase, and every Dockerfile in the world still uses uppercase because it separates the instruction from its argument at a glance. Five instructions is the whole vocabulary for today, and they arrive one at a time so do not list them here even if someone asks.',
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
        folder they created on slide 6, before the next section starts writing
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

  /* --- 2. Writing the Dockerfile ------------------------------------ */
  /*
    ONE INSTRUCTION PER SLIDE. Seven slides, signed off deliberately over the
    "2 to 4 slides per concept" guideline, because this is a series the learner
    weighs individually and the growing file is the deck's spine. All seven share
    one shape: same kicker, the instruction plus its job as the title, two points,
    at most one callout, and `DockerfileSoFar` with the new line highlighted.
    By slide 19 the room has watched the complete file assemble, which is why
    slide 19 can simply show it.
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
        <DockerfileSoFar lines={1} highlight={[1]} />
      </ContentSlide>
    ),
    notes:
      'The base already contains Linux and Python, which is why the file is six lines and not six hundred. Two things to say out loud. Slim drops rarely-needed OS tools and contains the same Python, so it is the default choice, not a compromise. And pinning 3.14 rather than latest is what keeps last session\u2019s promise: latest changes under you, and then the image that worked yesterday does not build today.',
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
        <DockerfileSoFar lines={2} highlight={[2]} />
      </ContentSlide>
    ),
    notes:
      'The word "inside" is the whole slide. Nothing appears on their own machine, and no folder called app is created anywhere they can browse to. /app is a convention, not a rule: any path works, and every project you will ever read uses /app or /code, so use one of those. It also matters for the error on slide 34, where the container looks for /app/app.py.',
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
            sub: 'Copying the requirements list first is deliberate, and the reason is the build cache in section four',
            icon: 'bulb',
            tone: 'accent',
          },
        ]}
      >
        <DockerfileSoFar lines={3} highlight={[3]} />
      </ContentSlide>
    ),
    notes:
      'Read the line as a sentence: copy requirements.txt from my folder into the image\u2019s current folder. Do not explain the cache yet, just plant that the order is deliberate. Someone always asks why not copy everything now, and the honest answer is "hold that question, it is a whole section". Come back and point at this slide when you get to slide 30.',
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
        <DockerfileSoFar lines={5} highlight={[4, 5]} />
      </ContentSlide>
    ),
    notes:
      'Two lines arrive together here on purpose: install first, then copy the code, and that pairing is the cache lesson in miniature. Say what RUN means precisely, because it is the word students get wrong: the command executes once, while the image is being built, and whatever it produced is baked in. The packages are installed inside the image, not on their machine, so pip list in their own terminal will not show them.',
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
        <DockerfileSoFar lines={6} highlight={[6]} />
      </ContentSlide>
    ),
    notes:
      'The list form is where the typos live: CMD ["python app.py"] as one string looks right and fails, because Docker then looks for a program literally named "python app.py". One word, one string. And say "declares", not "runs": the build does not execute this line, which is exactly why the mistake on slide 34 gets through the build unnoticed.',
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
      'Point at the prompt path first. Run this from the wrong folder and nothing works, which is the same lesson as last session. The trailing dot is the single most common typo here, and the error it produces is unhelpful: ERROR: "docker buildx build" requires exactly 1 argument. Say that error out loud so they recognise it. Without -t the image gets no name and shows up as <none> in docker images, which is recoverable but confusing. NOT CAPTURED: this transcript is quoted from the TR, capture C1.',
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
          <Callout kind="info" title="Five instructions, five steps" asStep={false}>
            Compare the step list with your file. Same lines, same order, and the slow one is the
            install
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Read down the steps and back up to the Dockerfile: the room should see them as the same list twice. Two things to point at. There are five steps and six lines, because CMD declares rather than executes, so it never becomes a build step. And the timings are lopsided: the install took 6.8 of the 12.4 seconds, which is the fact the fourth section is built on. Their numbers will differ. NOT CAPTURED: quoted from the TR, capture C2.',
  },
  /*
    THE FOUR COMMANDS, ONE PER SLIDE.

    `docker pull`, `docker images`, `docker run` and `docker ps` are listed in the
    TR's recap as things the room already knows. They do not: Session 1's deck
    contains `docker --version` and `docker run hello-world` and nothing else. So
    they are taught here, properly, and the recap slide no longer claims otherwise.

    They are NOT a reference table dropped in front of the build. Each one is
    placed at the first moment the session actually needs it, so every command
    answers a question the room has just asked:

      pull    the build output's first line says it downloaded the base. From where?
      images  it says it built something. Where did that something go?
      run     an image is not running anything. How do I start it?
      ps      it printed and vanished. Where is my container?

    One command per slide, the same discipline the five instructions get, and for
    the same reason: these are a series the learner weighs individually.
  */
  /*
    LAYOUT NOTE FOR ALL FOUR.

    Terminal at full width, teaching points as three cards beneath it, rather
    than the deck's usual bullets-left/visual-right split. These slides are ABOUT
    terminal output, and in the narrow right-hand column the prompt alone
    (`PS C:\nxttrendz\docker-demo> `) ate half the line: `python:3.14-slim`
    wrapped mid-token and the `docker ps -a` table wrapped its last column onto
    its own line, which destroys the column alignment that is the entire point of
    reading a table. A wrapped table is not a table.

    Plain `Card`s in a grid rather than `CardGrid`, because `CardGrid` wraps each
    child in a `Step` and would click-gate them; here they are the text half of a
    text-and-visual pair and must land with the terminal.
  */
  {
    id: 'c3-pull',
    section: 'Build and Run',
    label: 'docker pull',
    element: (
      <ContentSlide
        kicker="Build and Run"
        title="docker pull"
        lead="Step one of your build downloaded something. This is where it came from"
        lesson={SESSION}
      >
        <div className="grid gap-5">
          <Terminal
            path={CWD}
            fontSize={14}
            lines={[
              { text: 'docker pull python:3.14-slim', kind: 'cmd' },
              { text: '3.14-slim: Pulling from library/python' },
              { text: 'Status: Downloaded newer image for python:3.14-slim', kind: 'ok' },
            ]}
          />
          <div className="grid grid-cols-3 gap-4">
            <Card icon="database" title="Docker Hub" className="!p-5 !text-body-sm">
              The public library of images: python, node, nginx, postgres
            </Card>
            <Card icon="download" title="Downloads it once" tone="teal" className="!p-5 !text-body-sm">
              The next build reuses the copy already on your machine
            </Card>
            <Card icon="bulb" title="FROM does this for you" tone="accent" className="!p-5 !text-body-sm">
              You will rarely type pull, and now you can read that build line
            </Card>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Point back at the build output they just read: [1/5] FROM docker.io/library/python:3.14-slim took 4.2 seconds, and that was a download. This slide names it. Two things worth saying. It is cached, so the second build of the day does not re-download 150 MB, which is part of why the rebuild later is instant. And they will almost never type pull by hand, because FROM triggers it, so the value of knowing the command is being able to read that build line and being able to fetch an image before they need it. NOT CAPTURED: quoted from the TR, capture C2.',
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
        <div className="grid gap-5">
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
          <div className="grid grid-cols-3 gap-4">
            <Card icon="database" title="Every image you have" className="!p-5 !text-body-sm">
              The ones you built and the ones you pulled, in one table
            </Card>
            <Card icon="target" title="REPOSITORY is your tag" tone="teal" className="!p-5 !text-body-sm">
              nxttrendz-app, the name the -t flag gave it
            </Card>
            <Card icon="lock" title="Built once, never changes" tone="accent" className="!p-5 !text-body-sm">
              It sits there until you delete it, and the last section turns on exactly this
            </Card>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Two rows, and the second one is worth a sentence: the base image they pulled is sitting there too, and their own image is only about 5 MB bigger than it. That is the layer story from the next section arriving early, so plant it and move on. The TAG column says latest because they did not ask for a version; that is a default, not a claim about being up to date. Their IMAGE ID and timings will differ. NOT CAPTURED: quoted from the TR, capture C3.',
  },
  {
    id: 'c3-run',
    section: 'Build and Run',
    label: 'docker run',
    element: (
      <ContentSlide
        kicker="Build and Run"
        title="docker run"
        lead="An image does not do anything on its own. This is what starts it"
        lesson={SESSION}
      >
        <div className="grid gap-5">
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
          <div className="grid grid-cols-3 gap-4">
            <Card icon="play" title="Creates, then starts" className="!p-5 !text-body-sm">
              A container is made from the image, and the image is left untouched
            </Card>
            <Card icon="terminal" title="It runs what CMD declared" tone="teal" className="!p-5 !text-body-sm">
              Here that is python app.py, so you get your three lines
            </Card>
            <Card icon="bolt" title="Run it again, get another" tone="accent" className="!p-5 !text-body-sm">
              One image, many containers, exactly as last session promised
            </Card>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Stop on this one. Those are the three lines from their own app.py, printed from inside a container, in an environment they described in six lines of text. That is the whole session in one output. Point at the CMD line of the Dockerfile while the output is on screen, because this is where that instruction finally does something. Then have them run it twice and note that nothing breaks: the second run is a second container from the same untouched image. NOT CAPTURED: quoted from the TR, capture C4.',
  },
  {
    id: 'c3-ps',
    section: 'Build and Run',
    label: 'docker ps',
    element: (
      /*
        This slide exists because the previous one raises a question the deck used
        to answer with a callout: the container printed and vanished. An assertion
        is weaker than a command that shows it, and `docker ps` is that command. It
        also inoculates against the "my container is not running" panic, which is
        otherwise the first thing they hit alone.

        Two commands in ONE panel: same terminal, typed one after the other, which
        is not the two-terminals case the rule is about.
      */
      <ContentSlide
        kicker="Build and Run"
        title="docker ps"
        lead="Your container printed and vanished. Here is where it went"
        lesson={SESSION}
      >
        <div className="grid gap-5">
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
          <div className="grid grid-cols-3 gap-4">
            <Card icon="eye" title="ps shows running only" className="!p-5 !text-body-sm">
              Yours is not in the first table, and that is correct
            </Card>
            <Card icon="check" title="Add -a for stopped ones" tone="teal" className="!p-5 !text-body-sm">
              Exited (0) means it finished cleanly, not that it crashed
            </Card>
            <Card icon="bulb" title="It lives as long as its command" tone="accent" className="!p-5 !text-body-sm">
              Three prints, then nothing left to do, so it stopped
            </Card>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'The empty first table is the teaching, so do not skip past it. Exited (0) is a success code, the same zero every program returns when it finishes cleanly, so it is not an error. This is the single most common beginner panic, "my container is not running", and it is usually correct behaviour for a container whose command has finished. Worth naming: the container got a random name, bold_hopper here, because they did not pass --name. Their id and name will differ. NOT CAPTURED: quoted from the TR, capture C4.',
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
      'This is the shape to keep coming back to for the rest of the course, so make them say it back: files, build, image, run, container. The Django parallel is worth the time, because they already trust it: nobody expects makemigrations to change the database, and for the same reason nobody should expect an edited app.py to change an existing image. That is slide 35.',
  },
  {
    id: 'c3-quiz',
    section: 'Build and Run',
    label: 'Quiz Time',
    element: <QuizTimeSlide lesson={SESSION} />,
    notes:
      'Ask from the quiz tool and hold this slide while the room answers. The question for this beat: you change one line in app.py, save it, and run docker run nxttrendz-app again. What do you see? Answer: the OLD output, unchanged, because the image was built from the old code and docker run uses the image. This is deliberately a PREDICTION, signed off as an exception to the quiz rule: the deck teaches the answer on slide 35, and asking first is what makes that slide land. Take a show of hands before revealing anything, and do not confirm the answer yet, just say "hold that" and move on.',
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
      'This section answers the question parked on slide 15: why copy requirements before the code. It is also the section that pays off every time they rebuild for the rest of the course.',
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
        The payoff for the tease on slide 15. `DataTable` because the teaching IS
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
      'Point back at slide 15 and pay off the question they parked. Code changes daily, requirements change rarely, so putting the requirements copy above the install keeps the slow layer cached almost always. The highlighted row is the one that costs money. This is not a micro-optimisation: later in this course the image is rebuilt automatically on every code push, and cache friendly ordering is the difference between a ten second and a ten minute build. Tool name for that stage stays off the slide by R3, but for your own reference it is the Jenkins sessions.',
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
          {/* `route` and not `book`: lucide's Book renders as a near-empty
              rounded square at 24px on this grid, which reads as a missing icon.
              A branching route also happens to be what .git holds. */}
          <Card icon="route" title=".git/" className="!p-5 !text-body-sm">
            Your entire version history, every branch and every old commit
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
            sub: 'Beside the Dockerfile, exactly where .gitignore would sit in a repo',
            icon: 'folder',
          },
          {
            text: 'Listed paths are excluded from COPY',
            sub: 'Smaller images, faster builds, no junk baked in',
            icon: 'check',
          },
          {
            text: 'You already know this file',
            sub: 'It works exactly like .gitignore, for docker build',
            icon: 'bulb',
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
.git/
__pycache__/
*.pyc
db.sqlite3`}
        />
      </ContentSlide>
    ),
    notes:
      'Five lines, and they already understand four of them from .gitignore. Two practical notes. It has to sit beside the Dockerfile, in the build context root, or Docker never reads it. And it is worth having them run docker images before and after adding it on a real project, because the size difference is the argument.',
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
      'Ask for the prediction before you click. Most rooms expect the build to fail, and that expectation is the useful mistake: a build that succeeds is not a promise that the container works. Trace the error with them: WORKDIR set /app, CMD asked for app.py inside /app, and nothing ever copied it there. This is also why slide 15 mattered, since COPY is the only instruction that puts their code in the image.',
  },
  {
    id: 'c5-mistake-2',
    section: '.dockerignore and Mistakes',
    label: 'Mistake two',
    element: (
      /*
        The answer to the quiz on slide 25. Two panels here is correct and is not
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
  {
    id: 'c5-quiz',
    section: '.dockerignore and Mistakes',
    label: 'Quiz Time',
    element: <QuizTimeSlide lesson={SESSION} />,
    notes:
      'Ask from the quiz tool. The question for this beat: you add one package to requirements.txt and rebuild. Which layers come back CACHED? Answer: FROM and WORKDIR only. The COPY requirements.txt line changed, so it and everything after it rebuilds, including pip install. Follow up by asking what would have been cached if the change had been in app.py instead, which is the opposite answer and the whole point of the ordering rule.',
  },

  /* --- Closing frame ------------------------------------------------ */
  {
    id: 'instruction-summary',
    section: 'Closing',
    label: 'The five instructions',
    element: (
      /*
        The reference slide, and the one the room screenshots. The CMD row is
        highlighted because it is the only one that is not build time, which is
        the distinction slide 18 spent a whole slide on.
      */
      <ContentSlide
        kicker="Docker File Creation"
        title="The Five Instructions"
        lead="Everything you need to containerise a Python application"
        lesson={SESSION}
      >
        <DataTable
          compact
          highlight={[5]}
          columns={[
            { label: 'Instruction', weight: 1.15 },
            { label: 'Purpose', weight: 1.9 },
            { label: 'Executes', weight: 0.8 },
          ]}
          rows={[
            ['FROM', 'Choose the base image, and it must be the first line', 'Build time'],
            ['WORKDIR', 'Set the working folder inside the image', 'Build time'],
            ['COPY <src> <dest>', 'Copy files from your machine into the image', 'Build time'],
            ['RUN <command>', 'Execute a command, for example installing packages', 'Build time'],
            ['CMD ["prog", "arg"]', 'Declare the container start command, one per file', 'Container start'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Let them photograph this one too. The highlighted row is the only one that is not build time, and that single difference is behind both mistakes from the last section. If they remember one thing from the table, it is that four of the five happen in the kitchen and one happens at the table.',
  },
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
            ['docker pull image', 'Downloads a ready-made image from Docker Hub', 'Rarely, because FROM does it'],
            ['docker images', 'Lists the images on your machine', 'To check a build worked'],
            ['docker run name', 'Creates a container from an image and starts it', 'To actually run your app'],
            ['docker ps -a', 'Lists containers, running and stopped', 'To find out where one went'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The highlighted row is the only command they met for the first time today, and it is the one this whole session was about. Read the last column down: it is a workflow, not a list. If you have time for one question, ask which of these five goes inside the Dockerfile. The answer is none, and that confusion is the reason this table sits next to the instruction table rather than being merged with it.',
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
            text: 'Run all five commands on it',
            sub: 'build, images, run, ps -a, and pull an image of your own choosing',
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
    id: 'feedback',
    section: 'Closing',
    label: 'Feedback',
    element: <FeedbackSlide lesson={SESSION} />,
  },
  {
    id: 'next-session',
    section: 'Closing',
    label: 'Next session',
    element: (
      /*
        NO index: the deck has exactly five numbered sections and this is not a
        sixth. The title is deliberately EMPTY, decided at the sign-off gate: the
        session 3 topic is not settled, and naming a tool the room has no problem
        for would break R3. Filling in the title is the only edit this slide
        needs.
      */
      <SectionBreakerSlide
        kicker="Next session"
        title="Coming up next"
        lesson={SESSION}
      />
    ),
    notes:
      'Land the handover without naming a tool: today they wrote the recipe and built the image, and next time they build on top of it. The session 3 title is deliberately not on this slide yet, decided at plan sign-off. Fill in the title once it is settled. Nothing to do between now and then except the practice tasks.',
  },
  {
    id: 'thank-you',
    section: 'Closing',
    label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
  },
]
