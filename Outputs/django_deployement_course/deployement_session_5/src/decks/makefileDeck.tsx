import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentNoteSlide,
  ContentSlide,
  KeyTakeawaysSlide,
  QuestionSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import { AnalogyMap, AutomationLadder, CodeBlock, DataTable, FileTree, TargetAnatomy, Terminal } from '@/ui'
import { colors } from '@/design/tokens'

/**
 * Deployment · Session 5 "Automating Deployment with Makefile"
 *
 * Generated from the signed-off plan at
 * `django_deployement_course/session_plans/deployement_session_5/plan.md`.
 * The plan is the contract: slide ids here match the `id` column there, so a
 * reviewer can read the two side by side.
 *
 * BUILD RULES for this deck. Each exists because of something in the TR, the
 * guidelines, or a previous session that would otherwise be rendered wrong.
 *
 *   R1  TITLES ARE TOPIC-BARE AND TWO TO FOUR WORDS. The corpus median is two
 *       (`TEXT_GUIDELINES.md` §1). The first draft of the plan had seven-word
 *       editorial headlines on five slides and commas carrying second clauses on
 *       six; §9.1 of the plan records the rewrite. The section name is the
 *       kicker on every content slide, so a title never restates it.
 *
 *   R2  THE SAME ARTIFACT KEEPS THE SAME TITLE. Slides 21 and 23 are the same
 *       two lines of the same file, and 31, 32 and 41 are the same complete
 *       file. All are titled `Makefile`, because `TEXT_GUIDELINES.md` §4 says a
 *       build sequence repeats its title verbatim and never says "continued".
 *
 *   R3  EVERY MAKEFILE CODE BLOCK PASSES `language="makefile"`. `CodeBlock`'s
 *       `language` prop DEFAULTS TO `'python'` and the same prop is the chip
 *       label, so eight slides would otherwise ship with a `python` chip on a
 *       Makefile. Slide 50 is the exception that takes no filename at all: it is
 *       pseudocode for an automation server, not a file in the project, and
 *       labelling it as one would be a small lie.
 *
 *   R4  THE TAB IS A REAL TAB. Every indented command in every code string below
 *       uses `\t`, not spaces, because the entire point of slides 22 to 24 is
 *       that Make accepts exactly one indentation character. A deck that teaches
 *       the tab rule with spaces in its own panels is teaching the bug.
 *
 *   R5  WIDE OR TALL CHILDREN GET A `lead`. Carried from session 4's S5, where
 *       10 of 78 slides failed `video-safe.mjs` on the first sweep and every one
 *       was a lead-less slide with a full-width child reaching into the
 *       instructor-video rectangle (x 913..1280, y 0..220). Any slide here with a
 *       `CodeBlock`, `Terminal`, `DataTable`, `FileTree`, `AnalogyMap` or a
 *       figure carries a lead.
 *
 *   R6  THE `.PHONY` SURPRISE IS ASKED BEFORE IT IS ANSWERED. Slide 37 asks what
 *       `make build` does when a folder named `build` exists and resolves
 *       nothing; 38 is the answer and 39 is the mechanism. Content rule 16: the
 *       question slide carries the question and nothing else, and the answer is
 *       the next slide.
 *
 *   R7  LEVEL 3 OF THE LADDER NAMES NO TOOL. Content rule 4: a later problem is
 *       named, never opened, and its stages are never listed. `AutomationLadder`
 *       draws it as one dashed block reading "Later in this course". The TR
 *       itself writes "CI/CD" there; we do not, because a tool name means
 *       nothing to someone who has not felt the problem it solves.
 *
 *   R8  EVERY TRANSCRIPT IS QUOTED FROM THE TR, NOT CAPTURED. Docker Desktop
 *       cannot run on the capture machine, the same blocker that left sessions 1
 *       to 4 quoted. The ONE exception is slide 42 (`Test it`), whose outputs the
 *       TR never produces because it never runs the finished file; its three
 *       lines are composed from outputs the TR shows elsewhere. That is the
 *       weakest panel in the deck and the plan's §5.4 says so out loud.
 */

export const makefileMeta: DeckMeta = {
  title: 'Automating Deployment with Makefile',
  course: 'React + Django Integration · Deployment',
  lesson: 'Automating Deployment with Makefile',
  presenter: 'NxtWave Instructor',
}

/** Footer text on every slide: the session name, never "Session 5". */
const SESSION = 'Automating Deployment with Makefile'

/* Section names. These are the kickers, and the agenda, and the dividers, and
   the recap, all from one place, so the four cannot drift apart. */
const C1 = 'The Cost of Typing'
const C2 = 'Writing Targets'
const C3 = 'The Complete Makefile'
const C4 = 'Why This Matters for CI/CD'

/**
 * WHERE EVERY COMMAND IN THIS SESSION RUNS.
 *
 * `C:\nxttrendz` is the project root, and it is teaching content rather than
 * decoration: slide 43's whole diagnosis is that the prompt says `C:\Users\you`
 * instead. Content rule 15 applies to the difference between these two forms.
 * Doubled inside a JS string literal, single inside a JSX attribute.
 */
const AT_ROOT = 'C:\\nxttrendz'
const AT_HOME = 'C:\\Users\\you'

function Code({ children }: { children: ReactNode }) {
  return (
    <span
      className="whitespace-nowrap rounded-md px-1.5 py-0.5 font-mono"
      style={{ fontSize: '0.9em', background: 'rgba(45,99,251,0.10)', color: colors.brandDark }}
    >
      {children}
    </span>
  )
}

/**
 * A technology logo, always a PNG (content rule 12), at the size a row wants.
 *
 * THE PATHS ARE A STATIC MAP, AND THEY HAVE TO BE. The obvious version of this
 * helper is `src={`/assets/tech/${name}.png`}`, and it works in `npm run dev`
 * and in `npm run build`. It breaks in the only build that ships:
 * `scripts/inline-assets.mjs` finds assets by scanning the built HTML for
 * literal `/assets/...` paths, and a template literal is not one. The bundle
 * keeps `assets/tech/${i}.png` verbatim, nothing is inlined, and under `file://`
 * every icon is a broken image in the deck the instructor opens. Session 3
 * shipped with exactly that bug; session 4's S8 records it.
 *
 * Kept trimmed to what this deck renders: every entry is inlined whether a slide
 * uses it or not, and session 4 measured ten unused logos at 290 KB.
 */
const TECH_SRC = {
  docker: '/assets/tech/docker.png',
  makefile: '/assets/tech/makefile.png',
  python: '/assets/tech/python.png',
  windows: '/assets/tech/windows.png',
  macos: '/assets/tech/macos.png',
  linux: '/assets/tech/linux.png',
  git: '/assets/tech/git.png',
  vscode: '/assets/tech/vscode.png',
} as const

function Tech({ name, label, size = 20 }: { name: keyof typeof TECH_SRC; label?: string; size?: number }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src={TECH_SRC[name]}
        alt=""
        draggable={false}
        style={{ height: size, width: size }}
        className="object-contain"
      />
      {label ? <span>{label}</span> : null}
    </span>
  )
}

/* ────────────────────────────────────────────────────────────────────────────
   THE MAKEFILE, AS ONE SOURCE.

   Eight slides render this file at some stage of its growth. Each stage is a
   string here rather than a literal at the call site, because a hand-maintained
   copy per slide drifts, and the room reads the drift as a mistake in the file.
   Session 4's S10 records the same decision for its Compose file.

   Every indented line uses `\t`. See R4.
   ──────────────────────────────────────────────────────────────────────────── */

/** Slides 21 and 23: the first target, and nothing else. */
const MK_FIRST = `up:\n\tdocker compose up -d --build`

/** Slide 27: a target that holds two commands, in order. */
const MK_SETUP =
  `setup:\n` +
  `\tdocker compose up -d --build\n` +
  `\tdocker compose exec backend python manage.py migrate`

/** Slides 31 and 32: every operation the project supports, one target each. */
const MK_SEVEN =
  `build:\n\tdocker compose build\n` +
  `up:\n\tdocker compose up -d --build\n` +
  `down:\n\tdocker compose down\n` +
  `logs:\n\tdocker compose logs -f backend\n` +
  `migrate:\n\tdocker compose exec backend python manage.py migrate\n` +
  `superuser:\n\tdocker compose exec backend python manage.py createsuperuser\n` +
  `shell:\n\tdocker compose exec backend bash`

/**
 * Slide 32: the head of the same file, elided.
 *
 * The slide wants the `build` target read IN CONTEXT, as the first target of the
 * file from the slide before. Showing all fourteen lines plus a note is more
 * than the 1280x720 frame holds: `align-check.mjs` put the note under the
 * bottom-left control cluster (y 658..706) and `qa.mjs` had it past the floor,
 * and shrinking the type far enough to fix that made the file unreadable.
 *
 * So it is elided with `...`, which `PEDAGOGY_GUIDELINES.md` §3 names as the
 * move for exactly this: keep the earlier lines visible, never re-flow them,
 * and cut the tail once the sequence gets long. Context survives, the note fits,
 * and the room can still see that `build` is the first thing in the file.
 */
const MK_BUILD_IN_CONTEXT =
  `build:\n\tdocker compose build\n` + `up:\n\tdocker compose up -d --build\n` + `...`

/** Slide 36: the variable, on the two targets the next session will need. */
const MK_VARS =
  `IMAGE_NAME = nxttrendz-backend\n\n` +
  `build-image:\n\tdocker build -t $(IMAGE_NAME) ./backend\n\n` +
  `run-image:\n\tdocker run $(IMAGE_NAME)`

/** Slide 40: the line that declares the targets are commands, not files. */
const MK_PHONY = `.PHONY: build up down logs migrate superuser shell`

/** Slide 41: the finished file. `.PHONY` and the variable, then the targets. */
const MK_FINAL = `${MK_PHONY}\n\nIMAGE_NAME = nxttrendz-backend\n\n${MK_SEVEN}`

/**
 * Last session's finished `docker-compose.yml`, copied verbatim from
 * `deployement_session_4/src/decks/runningRealAppDeck.tsx` (its stage 4). The
 * session opens on the file the room wrote, so the two decks have to agree
 * character for character. If session 4's file changes, this changes with it.
 */
const COMPOSE_FINAL = `services:
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
  db_data:`

/** The 1-based line numbers in `code` whose text contains any of `needles`.
 *
 * `CodeBuildSlide.highlight` takes line NUMBERS, and hardcoding them is a bug
 * waiting for the file to gain a line: every highlight below the insertion moves
 * onto the wrong row, with no type error and no harness complaint. Session 4's
 * S10 records the day that happened. */
function hl(code: string, ...needles: string[]): number[] {
  return code
    .split('\n')
    .map((line, i) => (needles.some((n) => line.includes(n)) ? i + 1 : 0))
    .filter((n) => n > 0)
}

export const makefileDeck: SlideDef[] = [
  /* ══ FRONT FRAME (1 to 6) ═══════════════════════════════════════════════ */
  {
    id: 'brand',
    section: 'Opening',
    label: 'Brand',
    element: <BrandSlide greeting="Welcome" lesson={SESSION} />,
    notes: 'On screen while the room settles. The mark and the welcome, nothing else.',
  },
  {
    id: 'welcome',
    section: 'Opening',
    label: 'Session name',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
    notes: 'The session name and only the session name.',
  },
  {
    id: 'recap-compose',
    section: 'Opening',
    label: 'Last session, the file',
    element: (
      <ContentSlide
        kicker="Recap"
        title="Where we Left Off"
        lead="The real project moved into Compose, and this is the file the room finished with"
        points={[
          { text: 'Two services, each built from its own Dockerfile' },
          { text: <>{'The doors are open: '}<Code>ports</Code>{' on both'}</> },
          { text: <>{'Secrets sit in the '}<Code>.env</Code>{' file, read automatically'}</> },
          { text: <>{'The database lives in the '}<Code>db_data</Code>{' volume'}</> },
        ]}
        lesson={SESSION}
      >
        <CodeBlock code={COMPOSE_FINAL} filename="docker-compose.yml" language="yaml" fontSize={11} />
      </ContentSlide>
    ),
    notes:
      'Their own file, unchanged. Open on what they wrote rather than on a summary of it. Same file as session 4 slide 54.',
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        title="Today's Agenda"
        items={[
          { title: C1, sub: 'Three costs, and the tool that removes them' },
          { title: C2, sub: 'A name, a colon, and one tab character' },
          { title: C3, sub: 'Every operation the project supports, in one file' },
          { title: C4, sub: 'What an automation server actually wants from you' },
        ]}
        lesson={SESSION}
      />
    ),
    notes: 'Four concepts, one per section of the doc. The recap at the end restates these same four as outcomes.',
  },
  {
    id: 'setup',
    section: 'Opening',
    label: 'Initial Setup',
    element: (
      <ContentSlide
        kicker="Setup"
        title="Initial Setup"
        lead="Run these terminal commands step by step :"
        points={[
          { text: <>{'Open '}<Code>C:\nxttrendz</Code>{' in VS Code'}</> },
          { text: 'Docker Desktop running, whale steady in the tray' },
          { text: <><Code>make --version</Code>{' errors instead? Slide 15 is the fix'}</> },
        ]}
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="Two checks before anything else"
          lines={[
            { text: 'docker --version', kind: 'cmd' },
            { text: 'Docker version 27.3.1, build ce12230', kind: 'out' },
            { text: 'make --version', kind: 'cmd' },
            { text: 'GNU Make 4.4.1', kind: 'ok' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'make --version is here on purpose, before Make is explained. A Windows machine without it has to fail at minute two, not at slide 25. Ask the room to call out if that second command errors.',
  },

  /* ══ CONCEPT 1 · Long Commands, Typed Daily (7 to 18) ═══════════════════ */
  {
    id: 'c1-divider',
    section: C1,
    label: 'Divider 1',
    element: <SectionBreakerSlide index={1} title={C1} subtitle="And what Make is" lesson={SESSION} />,
    notes: 'Hand over verbally: "so what does a day on this project actually cost you in keystrokes?"',
  },
  {
    id: 'c1-the-daily-five',
    section: C1,
    label: 'The daily five',
    element: (
      <ContentSlide
        kicker={C1}
        title="The Daily Five"
        lead="An ordinary development day on this project, in five commands"
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="All five run from the project root"
          lines={[
            { text: 'docker compose up -d --build', kind: 'cmd' },
            { text: 'docker compose exec backend python manage.py migrate', kind: 'cmd' },
            { text: 'docker compose exec backend python manage.py createsuperuser', kind: 'cmd' },
            { text: 'docker compose logs backend', kind: 'cmd' },
            { text: 'docker compose down', kind: 'cmd' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Do not explain them. They are all commands the room already knows. The only new information on this slide is how they look stacked on top of one another.',
  },
  {
    id: 'c1-cost-length',
    section: C1,
    label: 'Cost 1, length',
    element: (
      <ContentSlide
        kicker={C1}
        title="Command Length"
        lead="Every one of them is 40 or more characters, and one is 51"
        points={[
          { text: 'Long enough to mistype, and you do' },
          { text: 'A typo costs a re-read, not an error message' },
          { text: 'Nothing about the length teaches anyone anything' },
        ]}
        lesson={SESSION}
      >
        <div className="rounded-card border border-line bg-surface p-6 text-center shadow-card-soft">
          <p className="whitespace-nowrap font-mono text-[11.5px] font-semibold" style={{ color: colors.ink }}>
            docker compose exec backend python manage.py migrate
          </p>
          <p className="mt-4 font-heading text-[56px] font-extrabold leading-none" style={{ color: colors.accentDark }}>
            51
          </p>
          <p className="mt-1 font-heading text-body-sm font-bold uppercase tracking-wider" style={{ color: colors.muted }}>
            characters
          </p>
        </div>
      </ContentSlide>
    ),
    notes: 'The count against the command. A picture of a long string is the string.',
  },
  {
    id: 'c1-cost-recall',
    section: C1,
    label: 'Cost 2, recall',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="Exact Recall"
        lead="Two questions the room has genuinely stopped to think about"
        points={[
          { text: <>{'Which was it: '}<Code>-d --build</Code>{' or '}<Code>--build -d</Code></> },
          { text: <>{'Does migrate take '}<Code>exec backend</Code>{' or '}<Code>run backend</Code></> },
        ]}
        note={{
          kind: 'warning',
          title: 'The cost',
          body: 'The command has to be remembered character for character, every day, by everyone.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'Ask both out loud and wait. Someone will get the second one wrong, which is the point: run creates a new container, exec uses the running one.',
  },
  {
    id: 'c1-cost-variation',
    section: C1,
    label: 'Cost 3, variation',
    element: (
      <ContentSlide
        kicker={C1}
        title="Team Variation"
        lead="The cost that is not about keystrokes at all"
        points={[
          { text: 'Each teammate invents their own variation' },
          { text: 'Some add flags, some forget them' },
          { text: '"How do I run this project?" gets asked again and again' },
          { text: 'The answer lives in chat, and chat scrolls' },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'This is the cost that matters most on a real team, and the one a shortcut on your own machine does not fix. It has to be saved in the project.',
  },
  {
    id: 'c1-question',
    section: C1,
    label: 'The question',
    element: (
      <QuestionSlide
        kicker={C1}
        question="Can we give every long command a short name?"
        qualifier="Saved in the project itself, and shared by the whole team"
        lesson={SESSION}
      />
    ),
    notes: 'Ask the hero line and wait. Read the qualifier only if the room answers too fast, because those two conditions are what rules a shell alias out. Do not answer it here. The answer is the next slide.',
  },
  {
    id: 'c1-the-shortcut',
    section: C1,
    label: 'The shortcut',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="The Shortcut"
        lead="The same two commands, after today"
        note={{
          kind: 'success',
          title: 'Remember',
          body: (
            <>
              {'A file called a '}
              <strong>Makefile</strong>
              {' does exactly this: it lives in the project, and it gives every long command a short name.'}
            </>
          ),
        }}
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="Seven keystrokes, and twelve"
          lines={[
            { text: 'make up', kind: 'cmd' },
            { text: 'make migrate', kind: 'cmd' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Put this panel next to slide 8 in your head. Same terminal, same folder, same work. Two lines instead of five paragraphs.',
  },
  {
    id: 'c1-speed-dial',
    section: C1,
    label: 'Speed dial',
    element: (
      <ContentSlide
        kicker={C1}
        title="Speed Dial"
        lead="You do not dial a full number to call your mother. You saved it once under a name"
        lesson={SESSION}
      >
        <AnalogyMap
          leftLabel="Your phone"
          rightLabel="A Makefile"
          rows={[
            { from: 'The full phone number', to: 'docker compose up -d --build' },
            { from: 'The saved contact name', to: 'The target name, up' },
            { from: 'Tapping the name', to: 'make up' },
            { from: 'Contacts synced to a new phone', to: 'The Makefile ships with the project' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The last row is the one that matters and it lands last. A shortcut on your machine is an alias. A shortcut in the project is a Makefile. Then drop the analogy: it does not come back.',
  },
  {
    id: 'c1-what-is-make',
    section: C1,
    label: 'What is Make?',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="What is Make?"
        lead="One tool, one file, one short name per command"
        noteFirst
        note={{
          kind: 'info',
          title: 'Definition',
          body: (
            <>
              {'Make is a command-line tool from 1976. It reads a file named '}
              <Tech name="makefile" label="Makefile" />
              {' in the current folder, where each '}
              <strong>target</strong>
              {' maps a short name to one or more shell commands.'}
            </>
          ),
        }}
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[720px]">
          <CodeBlock
            code={'make <target>     # runs the commands saved under <target>'}
            language="bash"
            fontSize={17}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Read the definition off the card, then the usage line. Older than Python, which was 1991. Say "target" slowly: it is the word the next thirty slides use.',
  },
  {
    id: 'c1-make-on-windows',
    section: C1,
    label: 'Installing make',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="Installing Make"
        lead={<><>{'Two of the three machines here already have it. The proof on any of them is '}</><Code>make --version</Code>{' printing a version line'}</>}
        note={{
          kind: 'warning',
          title: 'Watch out',
          body: 'On Windows, reopen the terminal after installing, or make is not on the PATH yet and the next command still errors.',
        }}
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <DataTable
            columns={[
              { label: '', weight: 0.9 },
              { label: 'Already there?', weight: 1.2 },
              { label: 'If it is not', weight: 1.6 },
            ]}
            rows={[
              [
                <Tech name="linux" label="Linux" />,
                'Yes on most distributions',
                <Code>sudo apt install make</Code>,
              ],
              [
                <Tech name="macos" label="macOS" />,
                'Yes, once the developer tools are installed',
                <Code>xcode-select --install</Code>,
              ],
              [
                <Tech name="windows" label="Windows" />,
                'No, Windows does not ship it',
                <Code>winget install GnuWin32.Make</Code>,
              ],
            ]}
            highlight={[3]}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Ask for a show of hands by operating system first, then run the row that applies. choco install make works too on Windows if they already have Chocolatey, and older Ubuntu images may need build-essential. Wait for the room to confirm the version line before moving on.',
  },
  {
    id: 'c1-beyond-shortcuts',
    section: C1,
    label: 'Beyond shortcuts',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="Beyond Shortcuts"
        lead="It can do a great deal more than this course asks of it"
        noteFirst
        note={{
          kind: 'note',
          title: 'How we use it',
          body: (
            <>
              {'Make was built to compile C programs. We use it as a '}
              <strong>command shortcut runner</strong>
              {': one short name for one saved command. That is the most common use of Make in web projects today, and all this course needs.'}
            </>
          ),
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'An aside, so keep it short. If someone asks about dependency tracking and incremental builds, say it is real and it is not what we use it for. Do not open it.',
  },

  /* ══ CONCEPT 2 · Writing Targets (19 to 28) ═════════════════════════════ */
  {
    id: 'c2-divider',
    section: C2,
    label: 'Divider 2',
    element: <SectionBreakerSlide index={2} title={C2} subtitle="A name, a colon, and one tab" lesson={SESSION} />,
    notes: 'Hand over: "you know what a Makefile does. You have never written a line of one. What does a line look like?"',
  },
  {
    id: 'c2-where-it-lives',
    section: C2,
    label: 'Where it lives',
    element: (
      <ContentSlide
        kicker={C2}
        title="Where It Lives"
        lead={<><Tech name="makefile" label="Makefile" />{', capital M, no extension, in the project root beside docker-compose.yml'}</>}
        points={[
          { text: <>{'Named '}<Code>Makefile</Code>{' and never '}<Code>makefile.txt</Code></> },
          { text: 'The root, because its commands run from there' },
          { text: <>{'Same folder as '}<Code>docker-compose.yml</Code></> },
        ]}
        lesson={SESSION}
      >
        <FileTree
          root={AT_ROOT}
          entries={[
            { name: 'backend', folder: true, state: 'existing' },
            { name: 'frontend', folder: true, state: 'existing' },
            { name: 'docker-compose.yml', state: 'existing', note: 'last session' },
            { name: '.env', state: 'existing' },
            { name: 'Makefile', state: 'new', note: 'today' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The tree is the answer to "where does this go". Point at the position: beside the Compose file, not inside backend.',
  },
  {
    id: 'c2-first-target',
    section: C2,
    label: 'The first target',
    element: (
      <ContentSlide
        kicker={C2}
        title="Makefile"
        lead="The whole first target is two lines"
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[760px]">
          <CodeBlock code={MK_FIRST} filename="Makefile" language="makefile" fontSize={18} />
        </div>
      </ContentSlide>
    ),
    notes: 'Two lines. Nothing to build up to, so show it whole and then take it apart on the next slide.',
  },
  {
    id: 'c2-anatomy',
    section: C2,
    label: 'Target anatomy',
    element: (
      <ContentSlide
        kicker={C2}
        title="Target Anatomy"
        lead="Three parts, and the third one has no glyph in your editor"
        lesson={SESSION}
      >
        <TargetAnatomy />
      </ContentSlide>
    ),
    notes:
      'Walk the three boxes left to right. Land on the third and stay there: the arrow is drawn so you can talk about a character nobody can see.',
  },
  {
    id: 'c2-tab-rule',
    section: C2,
    label: 'The tab rule',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="Makefile"
        lead="That indentation must be a real TAB character. Spaces will not work"
        note={{
          kind: 'warning',
          title: 'Watch out',
          body: (
            <>
              {'Some editors silently convert tabs to spaces as you type. In '}
              <Tech name="vscode" label="VS Code" />
              {', a Makefile is exempt by default, but check the status bar if the next slide happens to you.'}
            </>
          ),
        }}
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[760px]">
          <CodeBlock
            code={MK_FIRST}
            filename="Makefile"
            language="makefile"
            fontSize={18}
            highlight={hl(MK_FIRST, 'docker compose')}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Same file as the previous slide, same title, one line lit. The repeated title is how the deck says "still the same file".',
  },
  {
    id: 'c2-missing-separator',
    section: C2,
    label: 'Missing separator',
    element: (
      <ContentSlide
        kicker={C2}
        title="Missing Separator"
        lead="Use spaces and you get the single most famous error in Make's history"
        points={[
          { text: 'It never mentions tabs, or spaces, or indentation' },
          { text: 'Check the indentation first, before anything else' },
          { text: 'Name it now, so you recognise it later' },
        ]}
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="The error, and the whole diagnosis"
          lines={[
            { text: 'make up', kind: 'cmd' },
            { text: 'Makefile:2: *** missing separator.  Stop.', kind: 'out' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Meeting this here is cheaper than meeting it alone at 11pm. Say the trap by name: "missing separator means check your indentation", and say it twice.',
  },
  {
    id: 'c2-first-run',
    section: C2,
    label: 'First run',
    element: (
      <ContentSlide
        kicker={C2}
        title="First Run"
        lead="Get the tab right and seven keystrokes bring the whole stack up"
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="Watch the first line of the output"
          lines={[
            { text: 'make up', kind: 'cmd' },
            { text: 'docker compose up -d --build', kind: 'out' },
            { text: '[+] Running 2/2', kind: 'out' },
            { text: ' Container nxttrendz-backend-1   Started', kind: 'ok' },
            { text: ' Container nxttrendz-frontend-1  Started', kind: 'ok' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Point at the second line before anything else. The room typed "make up" and the terminal printed the long command back at them. That is the next slide.',
  },
  {
    id: 'c2-make-echoes',
    section: C2,
    label: 'Make echoes',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="Make Echoes"
        lead="Make prints each command before it runs it"
        points={[
          { text: 'You always see what actually executed' },
          { text: 'A shortcut that hides the command teaches you nothing' },
          { text: 'Seven keystrokes, one 31-character command' },
        ]}
        note={{
          kind: 'tip',
          title: 'Why it matters',
          body: 'A Makefile is a shortcut, not a black box. The command it ran is on screen every time, so you can still learn it, debug it, or copy it out.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'This is the anti-magic beat for Make itself. Nothing is hidden: the tool types the long command for you and shows you what it typed.',
  },
  {
    id: 'c2-two-commands',
    section: C2,
    label: 'Two commands',
    element: (
      <ContentSlide
        kicker={C2}
        title="Two Commands"
        lead="A target can hold several commands, and it runs them in order, one per line"
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[860px]">
          <CodeBlock code={MK_SETUP} filename="Makefile" language="makefile" fontSize={16} />
        </div>
      </ContentSlide>
    ),
    notes:
      'In order matters. Migrate cannot run before the container is up, and the file encodes that ordering permanently.',
  },
  {
    id: 'c2-one-word-setup',
    section: C2,
    label: 'One word setup',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="One Word Setup"
        lead={<><Code>make setup</Code>{' now brings the stack up and migrates it'}</>}
        points={[
          { text: 'The whole "new machine, first day" procedure' },
          { text: 'Written once, by whoever knew the order' },
          { text: 'Nobody has to be told the order again' },
        ]}
        note={{
          kind: 'success',
          title: 'Remember',
          body: 'This is automation in its simplest honest form: a saved, ordered sequence of steps. Everything later in this course is a bigger version of exactly this.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'Pause here. A learner who understands this slide understands what CI/CD is going to be, three sessions early.',
  },

  /* ══ CONCEPT 3 · The Complete Makefile (30 to 45) ═══════════════════════ */
  {
    id: 'c3-divider',
    section: C3,
    label: 'Divider 3',
    element: <SectionBreakerSlide index={3} title={C3} subtitle="Every operation, captured once" lesson={SESSION} />,
    notes: 'Hand over: "one target works. What does the whole project\'s file look like?"',
  },
  {
    id: 'c3-the-file',
    section: C3,
    label: 'Seven targets',
    element: (
      <ContentSlide
        kicker={C3}
        title="Makefile"
        lead="Every operation from the last two sessions, captured once. Five of the seven you have typed for a fortnight"
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[900px]">
          <CodeBlock code={MK_SEVEN} filename="Makefile" language="makefile" fontSize={12} />
        </div>
      </ContentSlide>
    ),
    notes:
      'Show it whole, on purpose. There is no unknown to disclose here: build, up, down, logs, migrate and superuser are all theirs already. Only two lines need a word, and they get the next two slides.',
  },
  {
    id: 'c3-build-alone',
    section: C3,
    label: 'build',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="build"
        lead={<><Code>docker compose build</Code>{' is the build half of '}<Code>up --build</Code>{' on its own'}</>}
        note={{
          kind: 'note',
          title: 'When you reach for it',
          body: 'You changed a Dockerfile and want to know it compiles, before starting anything.',
        }}
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[760px]">
          <CodeBlock
            code={MK_BUILD_IN_CONTEXT}
            filename="Makefile"
            language="makefile"
            fontSize={16}
            highlight={hl(MK_BUILD_IN_CONTEXT, 'build:', 'docker compose build')}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes: 'Rebuild the images, start nothing. It is the only target here that leaves the stack exactly as it found it.',
  },
  {
    id: 'c3-shell-inside',
    section: C3,
    label: 'shell',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="shell"
        lead={<><Code>exec</Code>{' as in migrate, but running '}<Code>bash</Code>{' instead of a Django command'}</>}
        note={{
          kind: 'tip',
          title: 'Read the prompt',
          body: 'It stops being your folder and becomes the container. That is the confirmation you are inside. Type exit to come back.',
        }}
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="The prompt changes, and that is the whole point"
          lines={[
            { text: 'make shell', kind: 'cmd' },
            { text: 'docker compose exec backend bash', kind: 'out' },
            { text: 'root@3f9c1a2b4d5e:/app#', kind: 'ok' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'This is the one for looking around when something is wrong: ls, cat settings.py, check a file really got copied in. The container has its own filesystem and this is the door to it.',
  },
  {
    id: 'c3-command-menu',
    section: C3,
    label: 'Command menu',
    element: (
      <ContentSlide
        kicker={C3}
        title="Command Menu"
        lead="The project now documents its own operations. A new teammate reads this file and knows everything it supports"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[1050px]">
          <DataTable
            compact
            columns={[
              { label: 'You type', weight: 0.85 },
              { label: 'Runs', weight: 1.3 },
              { label: 'When you use it', weight: 1.35 },
            ]}
            rows={[
              ['make build', 'Build both images', 'After a Dockerfile or requirements change'],
              ['make up', 'Rebuild and start the stack', 'Start of every work session'],
              ['make down', 'Stop and remove the stack', 'End of work'],
              ['make logs', 'Follow Django logs live', 'Debugging. -f is follow, Ctrl+C exits'],
              ['make migrate', 'Apply migrations in the container', 'After a model change'],
              ['make superuser', 'Create an admin user', 'Once per fresh database'],
              ['make shell', 'Open a shell inside backend', 'Poking around when things break'],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Let them photograph this one. Then say the line that matters: this table was not written as documentation. It IS the Makefile, read out loud.',
  },
  {
    id: 'c3-repeated-strings',
    section: C3,
    label: 'Repeated strings',
    element: (
      <ContentSlide
        kicker={C3}
        title="Repeated Strings"
        lead="The image name is about to be needed in several targets at once"
        points={[
          { text: 'Building it, tagging it, pushing it' },
          { text: 'The same string written three times' },
          { text: 'Three places to update, and one you will miss' },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'Short and deliberately unresolved. It is the friction statement that earns the next slide. Do not name Docker Hub: that is next session.',
  },
  {
    id: 'c3-variables',
    section: C3,
    label: 'Variables',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="Variables"
        lead="Define the name once at the top, then use it wherever you need it"
        note={{
          kind: 'warning',
          title: 'Parentheses, not braces or bare',
          body: (
            <>
              {'Make wants '}
              <Code>$(IMAGE_NAME)</Code>
              {', unlike the shell\'s '}
              <Code>$VAR</Code>
              {'. One character of difference, and it is the one people get wrong.'}
            </>
          ),
        }}
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[820px]">
          <CodeBlock
            code={MK_VARS}
            filename="Makefile"
            language="makefile"
            fontSize={15}
            highlight={hl(MK_VARS, 'IMAGE_NAME')}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Uppercase by convention, at the top of the file by convention. Rename the image someday and exactly one line changes.',
  },
  {
    id: 'c3-phony-question',
    section: C3,
    label: 'The .PHONY question',
    element: (
      <QuestionSlide
        kicker={C3}
        question="A folder named build exists in the project. What does make build do?"
        qualifier="The target is written exactly as on the Makefile you just saw"
        lesson={SESSION}
      />
    ),
    notes:
      'Take a show of hands before revealing. Most rooms say "it builds the images". The answer surprises them, which is why it is worth asking rather than telling.',
  },
  {
    id: 'c3-phony-surprise',
    section: C3,
    label: 'Nothing runs',
    element: (
      <ContentSlide
        kicker={C3}
        title="Nothing Runs"
        lead="No error, no output, no images built. Make simply declines"
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="A folder named build is sitting in the project"
          lines={[
            { text: 'make build', kind: 'cmd' },
            { text: "make: 'build' is up to date.", kind: 'out' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The answer, and nothing else on the slide. Let it sit for a beat before explaining. Confusing is the correct reaction here.',
  },
  {
    id: 'c3-phony-why',
    section: C3,
    label: 'Targets are files',
    element: (
      <ContentSlide
        kicker={C3}
        title="Targets Are Files"
        lead="Make's original 1976 job was building files, and it has never stopped assuming that"
        points={[
          { text: 'A target name is assumed to be a file it should create' },
          { text: <>{'It looks for something named '}<Code>build</Code>{' and finds your folder'}</> },
          { text: 'Already there, so already built, so nothing to do' },
          { text: 'Folders named build are common, so this really happens' },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'This is the anti-magic slide: the surprise on the last slide is not a bug, it is Make doing its actual job. Open the box once, here, and .PHONY stops being a magic incantation.',
  },
  {
    id: 'c3-phony-line',
    section: C3,
    label: '.PHONY',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title=".PHONY"
        lead="One line at the top declares that these targets are commands, not files"
        note={{
          kind: 'success',
          title: 'Rule of thumb for this course',
          body: 'List every target. All of ours are commands, and none of them produce a file named after themselves.',
        }}
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[900px]">
          <CodeBlock code={MK_PHONY} filename="Makefile" language="makefile" fontSize={16} />
        </div>
      </ContentNoteSlide>
    ),
    notes: 'Read it as a sentence: these seven are commands, always run them, never go looking for a file.',
  },
  {
    id: 'c3-final-makefile',
    section: C3,
    label: 'The final file',
    element: (
      <ContentSlide
        kicker={C3}
        title="Makefile"
        lead="The finished file. The two lit lines are all this section added, and everything under them is the command menu, unchanged"
        lesson={SESSION}
      >
        {/*
          NOT `CodeBuildSlide`, which would be the natural choice for the last
          frame of a build sequence. It hardcodes `language="YAML"` on its inner
          `CodeBlock`, so a Makefile would ship with a YAML chip. Fixing that
          means adding a pass-through prop to `src/slides/`, which is kit-owned:
          content rule 14 makes that the user's call, and `sync-kit.mjs` would
          push it to every other session. Recorded in the plan's section 8.
        */}
        <div className="mx-auto max-w-[880px]">
          <CodeBlock
            code={MK_FINAL}
            filename="Makefile"
            language="makefile"
            fontSize={11}
            highlight={hl(MK_FINAL, '.PHONY:', 'IMAGE_NAME =')}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'The whole artifact, assembled. This is the file they commit. Say the payoff: seven operations, one file, thirty lines, and nobody has to remember any of it.',
  },
  {
    id: 'c3-test-it',
    section: C3,
    label: 'Test it',
    element: (
      <ContentSlide
        kicker={C3}
        title="Test it"
        lead="Run the finished file end to end, and check each expected result"
        points={[
          { text: <><Code>make down</Code>{' removes the stack'}</> },
          { text: <><Code>make up</Code>{' builds and starts both again'}</> },
          { text: <><Code>make migrate</Code>{' reaches the database inside'}</> },
        ]}
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          caption="Three words, the whole cycle"
          lines={[
            { text: 'make down', kind: 'cmd' },
            { text: ' Container nxttrendz-backend-1  Removed', kind: 'out' },
            { text: 'make up', kind: 'cmd' },
            { text: '[+] Running 2/2', kind: 'out' },
            { text: 'make migrate', kind: 'cmd' },
            { text: 'No migrations to apply.', kind: 'ok' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Do this live if Docker is up. "No migrations to apply" is the right answer, not a problem: the volume kept the database, so there is nothing left to migrate. That is last session proving itself.',
  },
  {
    id: 'c3-wrong-folder',
    section: C3,
    label: 'Wrong folder',
    element: (
      <ContentSlide
        kicker={C3}
        title="Wrong Folder"
        lead="The most common Make error after the tab, and the prompt gives it away"
        points={[
          { text: 'Make looks in the current folder only' },
          { text: 'No Makefile there, so no rule for anything' },
          { text: <>{'The fix is '}<Code>cd</Code>{' into the project root'}</> },
        ]}
        lesson={SESSION}
      >
        <Terminal
          path={AT_HOME}
          caption="Read the path in the prompt before reading the error"
          lines={[
            { text: 'make up', kind: 'cmd' },
            { text: "make: *** No rule to make target 'up'.  Stop.", kind: 'out' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Cover the error and ask them to diagnose it from the prompt alone. They can. That is the habit worth building.',
  },
  {
    id: 'c3-folder-relative',
    section: C3,
    label: 'Folder relative',
    element: (
      <ContentSlide
        kicker={C3}
        title="Folder Relative"
        lead="Every tool in this course so far behaves the same way"
        points={[
          { text: <><Tech name="docker" label="docker build" />{', from the folder with the Dockerfile'}</> },
          { text: <>{'Run '}<Code>docker compose</Code>{' from the folder with the Compose file'}</> },
          { text: <>{'Run '}<Code>make</Code>{' from the folder with the Makefile'}</> },
          { text: 'The path in your prompt is the first thing to check' },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'A habit, not a mechanism. When a command that worked yesterday does not work today, look at the prompt before you look at anything else.',
  },
  {
    id: 'c3-commands-as-code',
    section: C3,
    label: 'Commands as code',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="Commands as Code"
        lead="How to run this project, migrate it and inspect it used to live in people's memories and chat messages. It now lives in a file, in the project, beside the code"
        note={{
          kind: 'success',
          title: 'The idea under the tool',
          body: 'Operations become committed, versioned files. Change the command in one place and every teammate, and every automated system, picks it up with the next copy of the project.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'The session\'s central idea, and the only thing on the slide. Say it plainly and let it land. Everything in the second half of this course stands on it.',
  },

  /* ══ CONCEPT 4 · Why This Matters for CI/CD (46 to 51) ══════════════════ */
  {
    id: 'c4-divider',
    section: C4,
    label: 'Divider 4',
    element: <SectionBreakerSlide index={4} title={C4} subtitle="One thing is still manual" lesson={SESSION} />,
    notes: 'Hand over: "the file is done. Who else is it useful to?"',
  },
  {
    id: 'c4-ladder',
    section: C4,
    label: 'The ladder',
    element: (
      <ContentSlide
        kicker={C4}
        title="The Ladder"
        lead="Four sessions of work, and each level removed one kind of human effort"
        lesson={SESSION}
      >
        <AutomationLadder />
      </ContentSlide>
    ),
    notes:
      'Climb it out loud from the bottom. Do not name what sits at level 3. If someone guesses it, say they are right and that it is where we go next, then move on.',
  },
  {
    id: 'c4-still-manual',
    section: C4,
    label: 'Still manual',
    element: (
      <ContentSlide
        kicker={C4}
        title="Still Manual"
        lead="One kind of effort survives every level of that ladder"
        points={[
          { text: 'A person has to be at a keyboard' },
          { text: <>{'Somebody types '}<Code>make up</Code>{' after every code change'}</> },
          { text: 'They have to remember to, and be awake, and be there' },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'The commands are automated. The person is not. Sit on that sentence: it is the gap the rest of the course closes.',
  },
  {
    id: 'c4-entry-point',
    section: C4,
    label: 'Stable entry point',
    element: (
      <ContentSlide
        kicker={C4}
        title="Stable Entry Point"
        lead="Here is the payoff hiding inside today's very simple tool"
        points={[
          { text: 'An automation server does not want your project\'s details' },
          { text: 'It wants one command it can run, that does not change' },
          { text: 'You built one this morning' },
        ]}
        lesson={SESSION}
      />
    ),
    notes: 'Short, and it sets up the next slide. Let them wonder how dumb the instruction can be.',
  },
  {
    id: 'c4-the-instruction',
    section: C4,
    label: 'The instruction',
    element: (
      <ContentSlide
        kicker={C4}
        title="The Instruction"
        lead="Because the Makefile exists, the whole instruction to an automation server is three lines"
        lesson={SESSION}
      >
        <div className="mx-auto max-w-[720px]">
          {/* No `filename`. This is pseudocode describing what a server is told,
              not a file that exists in the project. Labelling it as one would be
              a small lie, and the room would go looking for it. */}
          <CodeBlock
            code={'whenever the code changes:\n    run: make build\n    run: make up'}
            language="text"
            fontSize={19}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Seeing how short it is IS the argument. Nothing here mentions Docker, Compose, Django, a service name or a port.',
  },
  {
    id: 'c4-the-interface',
    section: C4,
    label: 'The interface',
    element: (
      <ContentNoteSlide
        kicker={C4}
        title="The Interface"
        lead="The server never needs to know your project uses Compose, which service is called backend, or what the migrate command looks like"
        note={{
          kind: 'success',
          title: 'Remember',
          body: (
            <>
              {'The Makefile is the interface. The details stay encapsulated, exactly the way a '}
              <Tech name="python" label="Python" />
              {' function hides its implementation from whoever calls it.'}
            </>
          ),
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'Cash out the analogy: they have been writing functions all course. This is the same move, one level up, applied to operations instead of code.',
  },

  /* ══ CLOSING FRAME (52 to 56) ═══════════════════════════════════════════ */
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Key Takeaways',
    element: (
      <KeyTakeawaysSlide
        title="Key Takeaways"
        points={[
          { text: C1, icon: 'bolt' },
          { text: C2, icon: 'file' },
          { text: C3, icon: 'terminal' },
          { text: C4, icon: 'rocket' },
        ]}
        lesson={SESSION}
      />
    ),
    notes: 'The agenda, closed. Read the four concept names back in the order they were promised, and stop there.',
  },
  {
    id: 'next-session',
    section: 'Closing',
    label: 'Next session',
    element: (
      /*
        `kicker`, no `index`. The kicker is what sessions 2 and 3 pass on this
        frame and it is what keeps it in theme: without it the slide is an
        unlabelled navy title, which is exactly what a section divider looks
        like, and the room reads it as a sixth section rather than as the
        handover. There is no index for the same reason: this deck has four
        numbered concepts and this is not a fifth.
      */
      <SectionBreakerSlide kicker="Next session" title="Pushing Image to Docker Hub" lesson={SESSION} />
    ),
    notes:
      'Say the problem, do not put it on the slide: the image you built today exists only on your laptop, and your code has had a central place to push to since day one. Next session gives images one, on Docker Hub. Title only, no subtitle and no index.',
  },
  {
    id: 'thankyou',
    section: 'Closing',
    label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
    notes: 'Thank the room. The next session is already named on the slide before this one.',
  },
]
