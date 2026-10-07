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
  QuestionSlide,
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
  Icons,
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
 * That last one is why the wrong-folder slide exists at all: run it one level up and Compose
 * says `no configuration file provided`. Never simplify these three to one path.
 */
const PROJECT = 'C:\\nxttrendz'
const CWD = `${PROJECT}\\docker-demo`
const BUILD_BE = `${CWD}\\backend`
const BUILD_FE = `${CWD}\\frontend`

/**
 * THE COMPOSE NETWORK'S EDGE, DRAWN AS AN EDGE.
 *
 * The closing slide of concept 4 used to be words only: a lead, one bullet and a
 * callout saying that a container from a separate `docker run` cannot resolve
 * `backend`. That is a claim about a BOUNDARY, and a boundary is the one kind of
 * claim a sentence is worst at: the room had just watched two containers talk to
 * each other by name, and nothing on the slide showed where that stops.
 *
 * WHY NOT AN EXISTING FIGURE. `ComposeNetwork` takes `act: 0 | 1` and both acts
 * draw the same two containers with only the arrow moving, which is its whole
 * contract on slides 64 and 65; it has no third container and no outside. And
 * `MachineBoundary` draws a different session's problem entirely (a browser,
 * `localhost`, a second person's computer), so reaching for it would be content
 * rule 8's exact failure: an available-but-unrelated illustration that
 * contradicts the slide it sits on.
 *
 * SAME FOOTPRINT AS `ComposeNetwork`, 620x268, deliberately. Concept 4 now ends
 * on three frames whose figure occupies the same rectangle, so the eye reads the
 * third as the same picture with something added rather than as a new diagram.
 *
 * NO SVG TEXT. Every label here is a real DOM node in a flex box, so it cannot
 * collide the way SVG labels have twice in this repo (content rule 17), and the
 * alignment harnesses can actually measure it. Nothing hand-animates either, so
 * there is no `useInstant` obligation: `ContentSlide` wraps children in one
 * `Reveal`, which lands the whole figure with its bullets in one beat.
 */
function ComposeBoundary() {
  const card =
    'flex items-center gap-2.5 whitespace-nowrap rounded-xl border-2 bg-white px-3 py-2.5 font-mono text-body-sm font-bold'
  return (
    <div className="relative" style={{ width: 620, height: 268 }}>
      {/* The project. Dashed, because Compose drew it without being asked and it
          is the ground the two services sit on, not a box added around them. */}
      <div
        className="absolute left-0 top-0 flex flex-col rounded-xl2 border-2 border-dashed px-4 pb-3 pt-3"
        style={{ width: 340, height: 268, borderColor: colors.brand, background: colors.surface }}
      >
        <div
          className="text-center font-mono text-xs font-bold uppercase tracking-wide"
          style={{ color: colors.brandDark }}
        >
          docker-compose.yml
        </div>
        <div className="mt-3 flex flex-1 flex-col justify-center gap-2.5">
          <div className={card} style={{ borderColor: colors.brand, color: colors.brandDark }}>
            <Tech name="python" />
            backend
          </div>
          {/* The link that works, stated as the address rather than an arrow, so
              the working case and the failing case are compared as strings. */}
          <div
            className="self-center whitespace-nowrap rounded-pill px-3 py-1 font-mono text-xs font-bold"
            style={{ background: `${colors.success}1A`, color: colors.success }}
          >
            backend:8000 resolves
          </div>
          <div className={card} style={{ borderColor: colors.brand, color: colors.brandDark }}>
            <Tech name="nodejs" />
            frontend
          </div>
        </div>
        <div className="text-center text-xs font-semibold" style={{ color: colors.muted }}>
          one project, one network
        </div>
      </div>

      {/*
        THE BLOCKED REQUEST, AS ONE CLUSTER IN THE GAP.

        Line, cross and caption were three separately positioned absolute boxes
        and the arithmetic put the caption straight across the `frontend` card
        while the cross floated below its own line. They are one centred flex
        column now, sitting in the 132px channel between the project and the
        outsider, so the three parts cannot drift apart from each other and the
        caption has clear space of its own (content rule 17).

        It stops AT the boundary rather than reaching the backend and failing
        there, because the container is never on the network in the first place.
      */}
      <div
        className="absolute flex flex-col items-center"
        style={{ left: 340, top: 104, width: 124 }}
      >
        <div className="relative flex h-6 w-full items-center">
          <div
            className="h-0 w-full border-t-2 border-dashed"
            style={{ borderColor: colors.danger }}
          />
          <div
            className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full font-bold text-white"
            style={{ width: 24, height: 24, background: colors.danger, fontSize: 14 }}
          >
            &#215;
          </div>
        </div>
        <div
          className="mt-1.5 text-center text-xs font-bold leading-tight"
          style={{ color: colors.danger }}
        >
          backend does not resolve
        </div>
      </div>

      {/* The outsider. Same card shape as the two services, so the ONLY
          difference the eye can find is which side of the dashes it is on. */}
      <div
        className="absolute flex flex-col items-center gap-2"
        style={{ left: 464, top: 90, width: 156 }}
      >
        <div className={card} style={{ borderColor: colors.muted, color: colors.body }}>
          docker run
        </div>
        <div className="text-center text-xs font-semibold" style={{ color: colors.muted }}>
          started on its own
        </div>
      </div>
    </div>
  )
}

/**
 * THE SESSION'S FOUR PROMISES, WRITTEN ONCE AND READ TWICE.
 *
 * These are the deck's four sections. The agenda slide states them at the top of
 * the session and the key takeaways slide states them again at the end, and the
 * two must be the SAME WORDS: the room is being handed back exactly what it was
 * promised, so a takeaway that paraphrases its agenda item quietly changes the
 * promise between the first frame and the last.
 *
 * They used to be two separate arrays. Both were correct on the day they were
 * written and neither was checked against the other afterwards, so all eight
 * strings had drifted apart: "A Second Container" was handed back as
 * "Containerise an app in any runtime", and takeaway 3's sub introduced five
 * YAML keys that appear nowhere on the agenda. The deck's own speaker note had
 * already written down the rule that catches this ("if a takeaway does not match
 * an agenda item, one of the two slides is wrong") and nothing enforced it.
 *
 * One array does enforce it. A wording change now lands on both slides or on
 * neither, and there is no version of this file where they disagree.
 */
const AGENDA: { title: string; sub: string }[] = [
  { title: 'Node Container Image', sub: 'The same six instructions, a different runtime' },
  { title: 'Running Both Python and Node Containers', sub: 'Six commands by hand, and five details to remember' },
  { title: 'One File for the Whole App', sub: 'Writing docker-compose.yml, one key at a time' },
  { title: 'Running the Stack: Integrating the Containers', sub: 'One command, and how they find each other by name' },
]

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
      /*
        THE BACKGROUND IS A TOKEN WITH AN ALPHA SUFFIX, NOT A LITERAL.

        This was `rgba(11,95,255,0.10)`, copied forward from v2 of session 1 and
        still sitting in four other decks. `rgb(11,95,255)` is `#0B5FFF`, the OLD
        brand blue: after the palette moved to `#2D63FB` the chip was tinted with
        a colour from no theme at all, one shade off every other blue on the
        slide, on every one of the ~120 inline code mentions in this deck. It is
        also a colour literal inside a deck file, which hard rule 5 forbids
        outright. `${colors.brand}1a` is the same 10% tint of the CURRENT brand,
        and it moves automatically the next time the palette does.
      */
      style={{ fontSize: '0.9em', background: `${colors.brand}1a`, color: colors.brandDark }}
    >
      {children}
    </span>
  )
}

/** A technology, always as a PNG (rule S9), at the size a card wants. */
/*
  THE PATHS ARE LITERALS, AND THAT IS THE WHOLE POINT OF THIS MAP.

  This helper used to build its src as `/assets/tech/${name}.png`. That works in
  dev, where a server resolves the path, and it BREAKS IN THE DELIVERABLE:
  `scripts/inline-assets.mjs` rewrites literal `/assets/...` strings to data
  URIs, and a template literal is not one, so the two logos survived into the
  single-file build as root-absolute paths. Under `file://` those resolve to the
  filesystem root and the images render blank, on slides 10, 11 and 39.

  Every other logo in this session is written as a literal string and inlines
  fine. A name-to-path map keeps the call sites reading `name="python"` while
  giving the inliner the literals it needs.
*/
const TECH_LOGO: Record<string, string> = {
  python: '/assets/tech/python.png',
  nodejs: '/assets/tech/nodejs.png',
}

function Tech({ name, label }: { name: string; label?: string }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img
        src={TECH_LOGO[name]}
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
    id: 'recap-what-it-bought',
    section: 'Opening',
    label: 'Recap: what it bought',
    element: (
      /*
        THE WHOLE RECAP, ON ONE FRAME (review zolbq2).

        There used to be a `recap-dockerfile` slide ahead of this one, reprinting
        the six-line Dockerfile they wrote. It was cut as recognised-but-not-taught
        material: the room reads its own file again on the very next concept, where
        line one is being changed, so showing it twice in four slides spent a frame
        on nothing new. The recap now opens straight on what that work bought them.

        These four points are the previous deck's key takeaways. If a point here is
        not on that slide, it does not belong on this one: the room was promised
        those four things and handed them back, so opening today with a fifth claim
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
      'The previous deck’s key takeaways, verbatim and in order. Land on the last one: unchanged layers come from the cache, which is why the dependency file is copied before the code. That fact returns on the Node Dockerfile slide.',
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
        /* Four items, and they are the deck's four sections. `AGENDA` is shared
           with the key takeaways slide, so the room hears the same four things
           in the same words three times: here, as they happen, and at the close. */
        items={AGENDA}
      />
    ),
    notes:
      'Four items. Point out that items 1 and 2 are the problem and items 3 and 4 are the answer, so nobody spends the first half wondering when Compose arrives.',
  },
  {
    id: 'the-gap',
    section: 'Opening',
    label: 'One program so far',
    element: (
      /*
        MOVED OUT OF THE RECAP RUN AND SPLIT IN TWO (review 0s2j10).

        It used to sit between the recap and the agenda, carrying both
        "you packaged one script" and "your real application is two programs" in a
        single lead. Two claims, and only the first is recap: the second is the
        reason today's session exists. So the pair now sits AFTER the agenda, where
        the room already knows what is coming, and each claim gets its own slide.

        This half is the one that looks backwards, so it carries no figure. The
        picture belongs to the slide that makes the new claim.
      */
      <ContentSlide
        kicker={SESSION}
        title="One Program"
        lead="The image you have built so far holds exactly one thing: a single Python script"
        lesson={SESSION}
        points={[
          { text: 'One script inside the image', sub: 'app.py, and the packages it needs to run' },
          { text: 'One runtime inside the image', sub: 'Python, chosen by the first line of the Dockerfile' },
          { text: 'One image, one container', sub: 'docker build made the image, docker run started the container' },
        ]}
      />
    ),
    notes:
      'Ten seconds. This is the ceiling of what they can do today, stated plainly, so the next slide can show what their real application actually looks like.',
  },
  {
    id: 'the-gap-two-programs',
    section: 'Opening',
    label: 'Two programs',
    element: (
      /*
        THE OTHER HALF, and the hinge into today.

        The figure gets the full width of the well rather than a third of it beside
        a bullet column. Squeezed into the narrow column the two cards wrapped their
        role lines onto extra lines, grew taller, and left the arrow pair stranded
        near the top of the gap between them (review 0s2j10, arrow placement). At
        full width the cards sit at their natural size and the arrows read as
        joining them.
      */
      <ContentNoteSlide
        kicker={SESSION}
        title="Two Programs"
        lead="Your real application is two programs, and they do not even run on the same runtime"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: "Today's question",
          body: <>So how do you run two containers together?</>,
        }}
      >
        <TwoRuntimes />
      </ContentNoteSlide>
    ),
    notes:
      'They have shipped this exact pair in the integration course, so do not explain what React and Django are. The question in the note is the session, and it stays unanswered until Compose arrives in concept 2.',
  },
  {
    id: 'setup',
    section: 'Opening',
    label: 'Initial Setup',
    element: (
      <ContentSlide
        kicker={SESSION}
        title="Initial Setup"
        lead="Check your setup before you start. Run these two checks step by step"
        lesson={SESSION}
        points={[
          { text: 'Open C:\\nxttrendz in VS Code', sub: 'The same workspace you have been working in' },
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
      'Wait for hands. Anyone whose Docker Desktop is not running loses the whole session. The four files listed are the ones they already built, still where they left them. Transcript quoted from the TR, not captured.',
  },

  /* --- Concept 1: Node Container Image, slides 8 to 22 ---------------- */
  {
    id: 'c1-divider',
    section: 'Node Container Image',
    label: 'Divider 1',
    element: (
      <SectionBreakerSlide
        index={1}
        title="Node Container Image"
        subtitle="Same six instructions, a different runtime"
        lesson={SESSION}
      />
    ),
    notes:
      'Say the section out loud as a question: your app is two programs, so let us build the second one. The room expects something new and hard; the payoff on the line-by-line slide is that there was nothing new at all.',
  },
  {
    id: 'c1-a-choice',
    section: 'Node Container Image',
    label: 'That line was a choice',
    element: (
      <ContentSlide
        kicker="Node Container Image"
        title="Line One Names Python"
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
            Your image carries Python only because line one names it. Change that name and the
            image carries a different program
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Point at line one and nowhere else. This is the smallest possible change of frame: they thought they learnt "how to containerise a Python app" and they actually learnt "how to containerise an app".',
  },
  {
    id: 'c1-runtime',
    section: 'Node Container Image',
    label: 'What is a runtime',
    element: (
      /*
        FIRST NEW WORD OF THE SESSION, and the room has never been given a
        definition of it. They have USED two runtimes daily without the word.

        The two cards are deliberately the two commands they have typed hundreds
        of times, because the definition then confirms something they already
        know rather than adding something they do not.
      */
      <ContentSlide
        kicker="Node Container Image"
        title="What is a Runtime"
        lead="A runtime is the software that reads your code file and actually runs it. You have two of them installed already"
        lesson={SESSION}
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
      </ContentSlide>
    ),
    notes:
      'Ask which of the two they have installed. Almost everyone says both, which is the answer: they have been using two runtimes all along without a word for it. The image-tag detail used to be squeezed into a callout here and now has the slide after this one to itself.',
  },
  {
    id: 'c1-image-tags',
    section: 'Node Container Image',
    label: 'The tag after the colon',
    element: (
      /*
        PULLED OUT OF A CALLOUT ON THE SLIDE BEFORE (review jqhw6h).

        The four base-image names used to be crammed into the runtime slide's note,
        which is the wrong place twice over: it is a second idea on a definition
        slide, and a callout has no room to say what the half after the colon
        actually means. The room types this string on line one of every Dockerfile
        they will ever write, so it gets a frame of its own.
      */
      <ContentNoteSlide
        kicker="Node Container Image"
        title="The Tag After the Colon"
        lead="A base image name has two halves: the runtime before the colon, and which build of it you want after the colon"
        lesson={SESSION}
        points={[
          {
            /* The two tag strings ARE the slide, so they carry the deck's inline
               token emphasis rather than sitting in plain bullet text (review
               4z0d1w). `Code` is the same span every command mention uses. */
            text: <Code>python:3.14-slim</Code>,
            sub: 'The Python runtime, version 3.14, in the build named slim',
          },
          {
            text: <Code>node:22-alpine</Code>,
            sub: 'The Node runtime, version 22, in the build named alpine',
          },
          {
            text: 'slim and alpine are the small builds',
            sub: 'The same runtime with fewer extra programs packed around it, so the image is smaller',
          },
        ]}
        note={{
          kind: 'tip',
          title: 'Docker Hub has one base image per runtime',
          body: (
            <>
              <Code>openjdk:21</Code> for Java, <Code>golang:1.23</Code> for Go,{' '}
              <Code>php:8.3</Code> for PHP. The same <Code>FROM</Code> line, a different word
            </>
          ),
        }}
      />
    ),
    notes:
      'Write one name on the board and split it with a slash: runtime, then colon, then version and build. Say out loud that leaving the tag off is allowed and is a bad habit, because you then get whatever Docker Hub calls latest today. Do not go further into image sizes; the point is only that the word after the colon is a choice.',
  },
  {
    id: 'c1-two-programs',
    section: 'Node Container Image',
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
        kicker="Node Container Image"
        title="Two Runtimes, Not One"
        lead="Your React frontend and Django backend are already on your disk"
        lesson={SESSION}
      >
        <div className="flex items-start gap-6">
          <FileTree
            root={PROJECT}
            width={386}
            entries={[
              { name: 'backend', folder: true, note: 'Django, the APIs (Python)', state: 'existing' },
              { name: 'frontend', folder: true, note: 'React, the UI (Node)', state: 'existing' },
              { name: 'docker-demo', folder: true, note: 'the practice folder you already made', state: 'existing' },
            ]}
          />
          <DataTable
            className="flex-1"
            compact
            columns={[
              { label: '', weight: 1 },
              { label: 'Frontend', weight: 1 },
              { label: 'Backend', weight: 1 },
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
      'The opening already said the app is two programs, so do not re-argue it. This slide answers the question the runtime definition opens: you now know what a runtime is, so how different are these two? Have them open the folder, then read the table down the middle column and down the right. Three rows, three differences, and no single image is right for both.',
  },
  {
    id: 'c1-one-container-q',
    section: 'Node Container Image',
    label: 'The pause beat',
    element: (
      /*
        A PAUSE BEAT, ON ITS OWN SLIDE, WITH NO ANSWER.

        The room's instinct is "put both in one container", and it has to be said
        out loud by them before it is answered. Anything else on this slide gives
        the answer away, so the slide carries the question and one prompt.
      */
      <QuestionSlide
        kicker="Node Container Image"
        question="Could both programs fit inside one container?"
        qualifier="Two runtimes, two dependency files, two start commands"
        lesson={SESSION}
      />
    ),
    notes:
      'Do not click through. Ask for hands and take two answers. The honest answer is "technically yes", which is why the next slide leads with it rather than with a rule.',
  },
  {
    id: 'c1-one-process',
    section: 'Node Container Image',
    label: 'One container, one process',
    element: (
      <ContentNoteSlide
        kicker="Node Container Image"
        title="One Container, One Process"
        lead="Both programs fit, and one crash takes down both"
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
    section: 'Node Container Image',
    label: "Today's workspace",
    element: (
      <ContentNoteSlide
        kicker="Node Container Image"
        title="Today's Workspace"
        lead="Two applications, so two folders inside docker-demo, each with its own Dockerfile"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'One folder, one Dockerfile',
          body: (
            <>
              A single Dockerfile at the top of <Code>docker-demo</Code> with <Code>COPY . .</Code>{' '}
              would sweep <strong>both</strong> applications into <strong>one</strong> image. One
              Dockerfile can only ever build one application
            </>
          ),
        }}
      >
        {/*
          THE INSTRUCTION SITS OUTSIDE THE TREE AND POINTS AT IT (review 52lyv9).

          It used to be an entry note reading "last session's four files, moved in
          here unchanged", set in the tree's small annotation type. That put the
          only thing the room has to DO on this slide inside a picture of the
          result, in the smallest text on the frame. It is now a callout to the
          left of the tree, carrying the arrow glyph so it reads as pointing at the
          folders it is describing.

          There is no dedicated pointer or annotation component in `src/ui`, so the
          arrow is the callout's own icon slot rather than new markup.

          SIDES SWAPPED (review onu1vc): the tree leads and the instruction follows
          it. The room now reads the folders first and the thing to do second,
          which is the order they act in. Done by reordering these two children,
          not by touching `ContentNoteSlide`. The arrow is rotated so it still
          points AT the tree, which is now on its left; `Icons.ArrowRight` spreads
          its props onto the `svg`, so a class is enough and no second glyph is
          needed.
        */}
        <div className="flex items-center gap-5">
          <FileTree
            root={CWD}
            width={470}
            entries={[
              /*
                SHORT NOTES, BECAUSE THE ROW ALSO CARRIES THE "CREATE THIS" TAG
                (review ib0npk).

                `FileTree` tags every top-level `new` entry automatically, and the
                tag shares one right-aligned wrapper with the note. At 470px wide,
                "the Node application, empty for now" plus the tag left the two
                fighting for the same half of the row. The Callout beside the tree
                already carries the instruction and the detail, so the note here is
                back to naming the folder and nothing else.
              */
              { name: 'backend', folder: true, note: 'the Python app', state: 'new' },
              { name: 'frontend', folder: true, note: 'the Node app', state: 'new' },
            ]}
          />
          <Callout
            kind="info"
            title="Create these two folders"
            icon={<Icons.ArrowRight width={20} height={20} className="rotate-180" />}
            className="w-[500px]"
            asStep={false}
          >
            Then move your four existing files into <Code>backend</Code>. Their content does not
            change, only the folder they sit in
          </Callout>
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Have them create the folders and move the four files now. Nothing inside those files changes, not the script and not the Dockerfile. The warning is about the level ABOVE these folders, so point at docker-demo itself while reading it.',
  },
  {
    id: 'c1-node-side-files',
    section: 'Node Container Image',
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
        kicker="Node Container Image"
        title="The Node Side"
        lead="server.js is the frontend script, package.json lists its dependencies"
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
    section: 'Node Container Image',
    label: 'The Node Dockerfile',
    element: (
      <ContentNoteSlide
        kicker="Node Container Image"
        title="The Node Dockerfile"
        lead="The same six instructions as the Python Dockerfile, written for the Node runtime"
        lesson={SESSION}
        note={{
          kind: 'note',
          title: 'Why the dependency file is copied first',
          body: (
            <>
              <Code>npm install</Code> is the slow step, and it only has to run again when{' '}
              <Code>package.json</Code> changes. Copying <Code>package.json</Code> before the code
              keeps that step above the code layer, so editing your code does not download every
              package again
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
    section: 'Node Container Image',
    label: 'Line by line against Python',
    element: (
      /*
        THE SECTION'S PAYOFF SLIDE.

        Identical row labels down both columns is the corpus comparison shape, and
        it is what makes "the pattern does not change" a thing the room can SEE
        rather than a claim they have to accept.
      */
      <ContentSlide
        kicker="Node Container Image"
        title="Line by Line Against Python"
        lead="The Python Dockerfile and the Node Dockerfile, one instruction at a time"
        lesson={SESSION}
      >
        <div className="grid gap-4">
        <DataTable
          compact
          columns={[
            { label: 'Step', weight: 0.8 },
            { label: 'Python image', weight: 1.3 },
            { label: 'Node image', weight: 1.2 },
            { label: 'Same idea?', weight: 1.3 },
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
    section: 'Node Container Image',
    label: 'Its .dockerignore',
    element: (
      <ContentNoteSlide
        kicker="Node Container Image"
        title="Its .dockerignore"
        lead="npm install saves every downloaded package into a folder called node_modules. That folder must be left out of the image"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'What happens if you skip it',
          body: (
            <>
              <Code>COPY . .</Code> would overwrite the packages <Code>npm install</Code> had just
              installed <strong>inside</strong> the image with the ones from your machine, built for
              your OS rather than the container's. One line in <Code>.dockerignore</Code> keeps
              <Code>node_modules</Code> out
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
              /*
                `existing`, NOT `new` (review espvd3). Two slides ago `frontend`
                was the folder being created; by this slide it exists and the tree
                is making a symmetry argument, which the caption states: both
                folders now hold the same four kinds of file. Leaving it `new` both
                said something untrue and printed the automatic CREATE THIS tag
                into the same right-aligned wrapper as a fifty-character note, at
                which point neither one was readable.
              */
              { name: 'frontend', folder: true, note: 'Dockerfile · package.json · .dockerignore · server.js', state: 'existing' },
            ]}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'The overwrite failure is worth thirty seconds: packages compiled for Windows landing inside a Linux container is the kind of bug that eats an evening. The tree on the right is the section\'s finished state.',
  },
  {
    id: 'c1-build-where',
    section: 'Node Container Image',
    label: 'Where the build runs from',
    element: (
      /*
        THE FIRST OF TWO `docker build` SLIDES (review 93g162 and 3arrpt).

        "From inside the frontend folder, because a build must only ever see its
        own app's files" used to be one clause of the build slide's lead, and a
        clause is not an explanation of the thing that goes wrong most often. The
        room now sees the claim instead of reading it: the folder in the tree on
        the left, and the same folder in the prompt on the right. `dir` is there so
        the two halves list the same four names.

        Both slides keep the title `docker build`, which is how the corpus signals a
        continuation.
      */
      <ContentSlide
        kicker="Node Container Image"
        title="docker build"
        lead="Run the build from inside the frontend folder. A build only sees the files in the folder it runs from"
        lesson={SESSION}
      >
        <div className="flex items-start gap-5">
          <FileTree
            root={CWD}
            width={430}
            caption="Run from frontend, the build cannot see backend at all"
            entries={[
              { name: 'backend', folder: true, note: 'not part of this build', state: 'existing' },
              { name: 'frontend', folder: true, note: 'you are here', state: 'existing' },
              { name: 'Dockerfile', depth: 1, state: 'existing' },
              { name: 'package.json', depth: 1, state: 'existing' },
              { name: '.dockerignore', depth: 1, state: 'existing' },
              { name: 'server.js', depth: 1, state: 'existing' },
            ]}
          />
          <Terminal
            className="flex-1"
            path={BUILD_FE}
            caption="Terminal · inside the frontend folder"
            fontSize={13}
            lines={[
              { text: 'dir', kind: 'cmd' },
              { text: 'Dockerfile      package.json', kind: 'out' },
              { text: '.dockerignore   server.js', kind: 'out' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Read the prompt path out loud and then read the tree, in that order, so the room checks their own prompt against the picture. The wrong folder is the single commonest error in this section. Have them cd into frontend first, then run dir and match the four names against the tree.',
  },
  {
    id: 'c1-build',
    section: 'Node Container Image',
    label: 'docker build',
    element: (
      <ContentSlide
        kicker="Node Container Image"
        title="docker build"
        lead="One command reads the Dockerfile in this folder and turns it into an image"
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
            <Callout kind="info" title="Six instructions, five build steps" asStep={false}>
              <Code>CMD</Code> is not a build step: it only runs when a container starts
            </Callout>
            <Callout kind="tip" title="Step 4 is the slow one" asStep={false}>
              <Code>npm install</Code> downloads every package, which is why <Code>package.json</Code> is copied first
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'The previous slide settled the folder, so go straight to the command. The trailing dot is the folder being handed to the build. Timings are illustrative, quoted from the TR rather than captured.',
  },
  {
    id: 'c1-run',
    section: 'Node Container Image',
    label: 'docker run',
    element: (
      /*
        THE ONE NOTE BECAME TWO CALLOUTS (review 7w9uhl).

        "It printed its message and finished, exactly as the Python container did.
        A container lives as long as its process does" packed two separate lessons
        into one sentence: what just happened on screen, and the rule that explains
        it. Split, the first says what the room is looking at and the second says
        why it stopped, which is the question they actually ask here.

        Same shape as the build slide above: transcript, then a pair of callouts,
        both `asStep={false}` so the whole slide arrives at once.
      */
      <ContentSlide
        kicker="Node Container Image"
        title="docker run"
        lead="One image, one container, two printed lines"
        lesson={SESSION}
      >
        <div className="mx-auto grid w-[900px] gap-4">
          <Terminal
            path={BUILD_FE}
            caption="Terminal · the frontend container"
            lines={[
              { text: 'docker run nxttrendz-frontend', kind: 'cmd' },
              { text: 'nxttrendz frontend starting...', kind: 'out' },
              { text: 'Frontend ready', kind: 'ok' },
            ]}
          />
          <div className="grid grid-cols-2 gap-4">
            <Callout kind="note" title="Where the two lines came from" asStep={false}>
              Docker ran <Code>server.js</Code> inside the container. The two lines are its two{' '}
              <Code>console.log</Code> calls
            </Callout>
            <Callout kind="success" title="Why it stopped on its own" asStep={false}>
              A container lives as long as the program inside it. The script hit its last line, so
              the container ended too, exactly as the Python one did
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Their first container that is not Python. Nothing about Docker noticed the difference, which is the whole point of the section.',
  },
  {
    id: 'c1-rebuild-backend',
    section: 'Node Container Image',
    label: 'Rebuild the Python side',
    element: (
      /*
        TWO FOLDERS MEANS TWO PANELS (rule S4).

        The build runs in `backend`, `docker images` runs in `docker-demo`, and
        stacking both prompts inside one panel would hide the one detail this
        slide is teaching: which folder each command belongs to.
      */
      <ContentSlide
        kicker="Node Container Image"
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
              { text: 'nxttrendz-app       latest   l6fdagb93c2d', kind: 'out' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Two panels because there are two folders. The backend build is fast because every layer came from the cache: nothing in that folder changed, only its location. Transcripts quoted from the TR.',
  },
  
  {
    id: 'c1-run-them-together-q',
    section: 'Node Container Image',
    label: 'The question this raises',
    element: (
      /*
        THE QUESTION GETS ITS OWN BEAT.

        It used to be the second half of the previous slide's lead, tucked in
        behind a table and a callout, so the room read it as a caption rather
        than as something it was being asked. On its own frame it is the only
        thing on screen, and the whole of concept 2 is the answer.
      */
      <QuestionSlide
        kicker="Node Container Image"
        question="So how do we run them together?"
        qualifier="The application needs both containers running at the same time"
        lesson={SESSION}
      />
    ),
    notes:
      'Ask it and wait. Most rooms answer "run both commands", which is exactly right and is exactly what the next section makes them count. Do not name Compose here.',
  },

  /* --- Concept 2: Running Both Python and Node Containers, slides 23 to 32 ------------- */
  {
    id: 'c2-divider',
    section: 'Running Both Python and Node Containers',
    label: 'Divider 2',
    element: (
      <SectionBreakerSlide
        index={2}
        title="Running Both Python and Node Containers"
        subtitle="You have two images. Now start the application"
        lesson={SESSION}
      />
    ),
    notes:
      'Ask the question in the subtitle out loud and let them answer it. Most rooms guess two commands. The real number is six, and that gap is the section.',
  },
  {
    id: 'c2-by-hand',
    section: 'Running Both Python and Node Containers',
    label: 'What it actually takes',
    element: (
      /*
        TWO PANELS, BECAUSE THERE ARE TWO FOLDERS (rule S4).

        Merging these six commands into one panel would hide the exact thing the
        slide is complaining about: that you have to be standing in a different
        place for each half.
      */
      <ContentNoteSlide
        kicker="Running Both Python and Node Containers"
        title="What It Actually Takes"
        lead="Two images in two folders take six commands to start"
        lesson={SESSION}
        note={{
          kind: 'warning',
          body: 'Six commands, six chances to be in the wrong folder',
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
    section: 'Running Both Python and Node Containers',
    label: 'What must be remembered',
    element: (
      <ContentSlide
        kicker="Running Both Python and Node Containers"
        title="What Must Be Remembered"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'Detail', weight: 1.2 },
            { label: 'If you get it wrong', weight: 1.5 },
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
    section: 'Running Both Python and Node Containers',
    label: 'A real app is bigger',
    element: (
      /*
        SPLIT OUT OF ONE SLIDE (review c:2xtbx0).

        It used to read "Six commands run two containers. Four containers is the
        normal shape of a real application" and leave the room to join the two
        halves themselves. This slide does the first half only: what a real
        application actually runs. The arithmetic is the next slide.
      */
      <ContentSlide
        kicker="Running Both Python and Node Containers"
        title="A Real Application Is Bigger"
        lead="Our app is two containers. A real application usually runs four"
        lesson={SESSION}
      >
        <CardGrid cols={2}>
          <Card title="What we have today" tone="brand">
            A <strong>backend</strong> and a <strong>frontend</strong>. Two containers, and you
            start both of them yourself
          </Card>
          {/*
            SQLITE IS NAMED, BECAUSE IT IS WHAT THEY ACTUALLY HAVE (review ne3645).

            This card used to assert that a real project adds "a database to store
            the data", which reads as news to a room whose project has stored its
            data since day one. Their database is SQLite: a file sitting next to
            the code, inside the backend, with no container of its own. So the
            card no longer introduces a database, it moves one: the container
            arrives when the file stops being enough, which is the honest reason a
            fourth container shows up and the only version of this claim the room
            can check against their own repository.
          */}
          <Card title="What a bigger project adds" tone="accent">
            Your data lives in a <strong>SQLite</strong> file today. Projects that outgrow it run
            the <strong>database</strong> in its own container, and often a <strong>cache</strong>{' '}
            beside it
          </Card>
        </CardGrid>
      </ContentSlide>
    ),
    notes:
      'Do not build the database or the cache: they are named so the room knows what a normal project looks like, and left alone (rule S1). Say out loud that SQLite is already their database, so this is not a new component, it is the same one moving out of the backend folder. Ask how many containers their own project would need. Four is the usual answer.',
  },
  {
    id: 'c2-ritual-doubles',
    section: 'Running Both Python and Node Containers',
    label: 'The ritual doubles',
    element: (
      <ContentSlide
        kicker="Running Both Python and Node Containers"
        title="The Ritual Doubles"
        lead="Each container costs three commands, so four containers cost twelve"
        lesson={SESSION}
        points={[
          { text: 'Twelve commands to start the app', sub: 'And more again to stop and clean up' },
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
      'Count it out loud: cd, build, run, for each of the four. The number rolling from 6 to 12 is the whole figure. The third bullet is the one rooms miss: this is not just tedious, it is undocumented.',
  },
  {
    id: 'c2-the-question',
    section: 'Running Both Python and Node Containers',
    label: 'The question',
    element: (
      /*
        THE SESSION'S THESIS, ON A SLIDE OF ITS OWN.

        Everything before this is the problem, everything after is the answer. It
        carries one sentence because a second line would give the room somewhere
        else to look while the question is landing.
      */
      <QuestionSlide
        kicker="Running Both Python and Node Containers"
        question="Could the whole application be written down in one file?"
        qualifier="Every container it needs, started and stopped by one command"
        lesson={SESSION}
      />
    ),
    notes:
      'Read it out and stop. Two things are being asked for: one file, and one command. Do not name the tool yet. The next slide answers with an orchestra, not with a product.',
  },
  {
    id: 'c2-orchestra',
    section: 'Running Both Python and Node Containers',
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
        kicker="Running Both Python and Node Containers"
        title="Picture an Orchestra"
        lead="One musician can start alone. An orchestra needs a written score and one conductor to start together"
        lesson={SESSION}
      >
        <div className="flex flex-col items-center gap-4">
          <Orchestra />
          <Callout kind="info" asStep={false} className="max-w-[1040px]">
            One score says what to play, one baton says when. Two containers need one file and one command
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Let the baton fall before you say anything. The teaching is the timing: all four players start on one beat. The callout names what made that possible, and nothing more. The full mapping is the next slide.',
  },
  {
    id: 'c2-what-is-compose',
    section: 'Running Both Python and Node Containers',
    label: 'What is Docker Compose',
    element: (
      /*
        THE DEFINITION, AND THE ANALOGY CASHED OUT IN THE SAME BREATH.

        An analogy that is never mapped is decoration. Each row of this map takes
        one thing from the previous slide and names its technical counterpart, so
        the orchestra is spent here and then dropped. The previous slide names only
        what the score and the baton do; every row below is new.
      */
      <ContentNoteSlide
        kicker="Running Both Python and Node Containers"
        title="What is Docker Compose"
        lead="One tool reads one file and runs every container the application needs"
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
    section: 'Running Both Python and Node Containers',
    label: 'Commands to a file',
    element: (
      <ContentNoteSlide
        kicker="Running Both Python and Node Containers"
        title="Commands to a File"
        lead="Compose describes what you want. docker run tells Docker each step"
        lesson={SESSION}
        note={{
          kind: 'tip',
          title: 'Django models declare the schema, migrations perform the steps',
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
    section: 'Running Both Python and Node Containers',
    label: 'What changes, what does not',
    element: (
      /*
        HEADS OFF THE COMMONEST WRONG MODEL, which is that Compose is a different
        container system that replaces what they learnt last session. It is not:
        it runs the same builds and the same containers, and the only thing that
        changes is who types the commands.
      */
      <ContentNoteSlide
        kicker="Running Both Python and Node Containers"
        title="What Changes, What Does Not"
        lead="Compose is not a new way to build images. It is a way to stop typing"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'It runs the same commands you would have',
          body: (
            <>
              Compose calls <Code>docker build</Code> and <Code>docker run</Code> for you. It does
              not replace them, and everything you have already learnt still applies
            </>
          ),
        }}
      >
        <DataTable
          columns={[
            { label: 'Stays exactly the same', weight: 1 },
            { label: 'Changes', weight: 1 },
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
          {/*
            CREATED IN THE EDITOR, NOT FROM A SHELL (review vnglmz).

            This used to be a two-command Terminal: `cd`, then `type nul >
            docker-compose.yml`. Both were noise. `type nul` is a Windows-only
            trick for making an empty file, so it taught a shell idiom on the one
            slide whose subject is a filename, and the room then had to switch to
            the editor anyway to type a single character into it. The instruction
            that replaced it carries the thing the slide is actually for: what the
            file must be called, and which other names Compose will answer to.
          */}
          <Callout
            kind="info"
            title="Create it in VS Code"
            icon={<Icons.ArrowRight width={20} height={20} className="rotate-180" />}
            className="w-[500px]"
            asStep={false}
          >
            New File inside <Code>docker-demo</Code>. All lower case, one hyphen, and the{' '}
            <Code>.yml</Code> ending. Compose answers to <Code>compose.yml</Code> as well, and{' '}
            <Code>docker-compose.yml</Code> is the name you will meet everywhere
          </Callout>
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'It sits above both folders because it is the one file that describes both. Have everyone cd into docker-demo now and stay there: the wrong-folder slide is the error they get if they drift out of it.',
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
        {/*
          THE FIGURE IS INTRINSICALLY 568px WIDE, SO IT IS CENTRED EXPLICITLY
          (review jesoyt).

          `YamlNesting`'s two panels are a fixed `w-[248px]` each, but the two
          rule chips under them are `flex-1`. Dropped into the slide's full-width
          body that made the bottom of the figure stretch to ~1150px while the top
          stayed at 568px and hung off the left edge: the "totally misaligned"
          the review is pointing at. Capping the wrapper at the panels' own width
          makes the chips line up under the panels, and rule S14 wants a
          fixed-width figure centred on the stage rather than stranded left.
        */}
        <YamlNesting className="mx-auto w-[632px]" />
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
        lead="A service is one container. This section lists every container the application needs"
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
              because the names appear on every container Compose creates
            </>
          ),
          replaces: 'nothing yet, this is the skeleton',
        }}
      />
    ),
    notes:
      'A service is one container. Say that sentence and no more: the word service is doing a lot of work later and it starts as a synonym. Do not hint at the second job yet, that is the service-name slide in concept 4.',
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
              Build the image from the Dockerfile in that folder. The folder is written in the
              file, so the build can never run from the wrong one again
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
              ready-made software from Docker Hub, like the <Code>hello-world</Code> image you have
              already pulled. Both services here are ours. Compose paths use forward slashes on Windows
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
          replaces: 'remembering to start the backend before the frontend',
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
          title: 'Django settings.py reads the environment',
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
          title: 'The same image runs on any machine',
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
        lead="Passwords and API keys never go in docker-compose.yml"
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
        A REAL QUESTION SLIDE, NOT A CONTENT SLIDE WITH ONE BULLET (review uwey9a).

        It used to be a `ContentSlide` whose lead was the question and whose only
        point was "Say yes or no before the next slide". Both halves were wrong.
        Hard rule 16: a posed question goes on `QuestionSlide`, or it renders
        top-left at lead size with an empty well under it and the one thing the
        room is meant to think about is neither the largest thing on screen nor
        centred on it. And the instruction to answer was stage direction printed
        on the slide: the pause is the instructor's to hold, and the next slide
        being the answer is the mechanism, so writing it down says nothing the
        frame does not already say.

        The `qualifier` is the constraint needed in order to answer, not a hint.
      */
      <QuestionSlide
        kicker="One File for the Whole App"
        question="A container writes a file. The container is deleted and recreated. Is the file still there?"
        qualifier="Nothing else about the setup changes"
        choices={['Yes', 'No']}
        lesson={SESSION}
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
            text: 'Every container starts from the image',
            sub: 'The image never changes, so nothing the container wrote is kept',
          },
          { text: 'A script that only prints loses nothing', sub: 'Anything storing data loses every row' },
        ]}
      >
        <VolumeSurvival act={0} />
      </ContentSlide>
    ),
    notes:
      'This is the frozen-image rule they already know, seen from the other direction, so name the connection out loud. Let the container fade before reading the second bullet: the picture makes the argument and the words only confirm it.',
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
        lead="The volume name on the left, the container folder on the right"
        lesson={SESSION}
        filename="docker-demo\docker-compose.yml"
        code={compose(4)}
        highlight={COMPOSE_HL[4]}
        annotation={{
          key: 'db_data:/app/data',
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
              not inside a service, and it is what tells Docker to create the storage. Nothing
              follows the name because Docker fills in every setting itself
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
          { text: 'The script writes to /app/data', sub: '/app/data is the folder the volume is plugged into' },
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

  /* --- Concept 4: Running the Stack: Integrating the Containers, slides 49 to 63 ---------------- */
  {
    id: 'c4-divider',
    section: 'Running the Stack: Integrating the Containers',
    label: 'Divider 4',
    element: (
      <SectionBreakerSlide
        index={4}
        title="Running the Stack: Integrating the Containers"
        subtitle="One command, and how containers find each other"
        lesson={SESSION}
      />
    ),
    notes:
      'Two halves. The first eleven slides are the commands, and they go quickly because the file already explained itself. The last four are the networking idea, and they are the most important slides in the session.',
  },
  {
    id: 'c4-up-explain',
    section: 'Running the Stack: Integrating the Containers',
    label: 'What up will do',
    element: (
      /*
        EXPLAIN THE COMMAND BEFORE SHOWING IT (rule S7). These four cards become
        the four ticks in the transcript on the next slide, in the same order, so
        the room reads output it has already been told how to read.
      */
      <ContentSlide
        kicker="Running the Stack: Integrating the Containers"
        title="What up Will Do"
        lead="One command builds both images, creates the network and volume, and starts both"
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
    section: 'Running the Stack: Integrating the Containers',
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
        kicker="Running the Stack: Integrating the Containers"
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
    section: 'Running the Stack: Integrating the Containers',
    label: 'Where did they go',
    element: (
      <ContentNoteSlide
        kicker="Running the Stack: Integrating the Containers"
        title="Where Did They Go"
        lead="Both scripts printed their lines and finished, so nothing is running"
        lesson={SESSION}
        note={{
          kind: 'note',
          title: 'compose ps is docker ps, narrowed to this project',
          body: (
            <>
              The same is true of the logs: <Code>docker compose logs backend</Code> shows one
              service's output. Everything you have already learnt still works, scoped to this app
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
      'The empty table is the same surprise as the empty docker ps they already saw, so name the connection: a container lives as long as its process. Exited (0) means finished cleanly, not crashed.',
  },
  {
    id: 'c4-detached',
    section: 'Running the Stack: Integrating the Containers',
    label: 'What is detached mode',
    element: (
      <ContentNoteSlide
        kicker="Running the Stack: Integrating the Containers"
        title="What is Detached Mode"
        lead="Plain up holds your terminal until the containers finish. With -d, Compose hands it back"
        lesson={SESSION}
        note={{
          kind: 'tip',
          title: 'Django runserver holds the terminal in the same way',
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
    section: 'Running the Stack: Integrating the Containers',
    label: 'Watching the volume work',
    element: (
      <ContentSlide
        kicker="Running the Stack: Integrating the Containers"
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
    section: 'Running the Stack: Integrating the Containers',
    label: 'One command down',
    element: (
      <ContentNoteSlide
        kicker="Running the Stack: Integrating the Containers"
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
    section: 'Running the Stack: Integrating the Containers',
    label: 'down -v',
    element: (
      <ContentNoteSlide
        kicker="Running the Stack: Integrating the Containers"
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
    section: 'Running the Stack: Integrating the Containers',
    label: 'Code changed? Rebuild',
    element: (
      <ContentNoteSlide
        kicker="Running the Stack: Integrating the Containers"
        title="Code Changed? Rebuild"
        lead="Images are frozen at build time, and that has not changed"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'Compose reuses an existing image unless you ask it to rebuild',
          body: (
            <>
              Without <Code>--build</Code>, Compose reuses the images it already has and your change
              appears to do nothing. This is the familiar "I edited the code and still see the old
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
      'Name the trap by name and in the words they already have for it. Twice over is the new part: with two services, one can be rebuilt and the other stale, and the symptoms are baffling.',
  },
  {
    id: 'c4-wrong-folder',
    section: 'Running the Stack: Integrating the Containers',
    label: 'The error you will hit',
    element: (
      <ContentNoteSlide
        kicker="Running the Stack: Integrating the Containers"
        title="The Error You Will Hit"
        lead="Run it one level up, from C:\nxttrendz, and Compose stops before it starts"
        lesson={SESSION}
        note={{
          kind: 'note',
          title: 'No compose file exists one level up',
          body: (
            <>
              <Code>docker compose</Code> reads <Code>docker-compose.yml</Code> from the folder you
              are standing in. One level up, there is no such file. Same lesson as the build context you
              already met: read the path in your prompt before you blame the tool
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
    section: 'Running the Stack: Integrating the Containers',
    label: 'Command summary',
    element: (
      <ContentSlide
        kicker="Running the Stack: Integrating the Containers"
        title="Command Summary"
        lead="Every command in this session, in one place"
        lesson={SESSION}
      >
        <DataTable
          compact
          columns={[
            { label: 'Command', weight: 1.1 },
            { label: 'Purpose', weight: 1.7 },
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
    section: 'Running the Stack: Integrating the Containers',
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
        kicker="Running the Stack: Integrating the Containers"
        title="localhost Is Not the Other Container"
        lead="Your run printed Backend address: http://backend:8000. Until now every address you used was localhost, so why not here?"
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
          { text: 'localhost is the most common multi-container mistake', tone: 'brand' },
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
    section: 'Running the Stack: Integrating the Containers',
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
        kicker="Running the Stack: Integrating the Containers"
        title="Service Names Are Hostnames"
        lead="Compose created a private network, and every service in the file is attached to it"
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
      'The word hostname is new: it is the name you put in an address where a machine belongs, and localhost is one they already know. Point out that the picture has not changed at all from the last slide, only the arrow, because that is the whole teaching. Then land the rename: change the service to api: and the address becomes api:8000, which is why choosing service names carefully was worth mentioning back on the services slide. Service names are not labels, they are addresses.',
  },
  {
    id: 'c4-same-file-only',
    section: 'Running the Stack: Integrating the Containers',
    label: 'Same file, same network',
    element: (
      /*
        BULLETS LEFT, FIGURE RIGHT, MATCHING THE TWO SLIDES BEFORE IT.

        This was a `ContentNoteSlide` carrying one bullet and a callout, and the
        callout was doing the teaching. Two problems with that. The claim is about
        a boundary, which is the one thing a sentence draws worst, and the slide
        broke the layout continuity the comment on the previous slide exists to
        protect: concept 4's last three frames now put their figure in the same
        rectangle, so the room reads an addition rather than a new diagram.

        The lead is gone on purpose. "The boundary of the claim, so nobody
        over-generalises it" described the slide's job to the room instead of
        teaching anything, and with no lead `ContentSlide` applies its
        `visualGuard` padding, which keeps the figure clear of the video box.
      */
      <ContentSlide
        kicker="Running the Stack: Integrating the Containers"
        title="Same File, Same Network"
        lesson={SESSION}
        points={[
          {
            text: 'One file, one network, one project',
            sub: 'The project name on every created thing is what keeps them apart',
          },
          {
            text: 'Only services in this file are on it',
            sub: 'They reach each other by service name, with no setup from you',
          },
          {
            text: 'A separate docker run stays outside',
            sub: 'It never joins the network, so the name backend means nothing to it',
            tone: 'brand',
          },
        ]}
      >
        <ComposeBoundary />
      </ContentSlide>
    ),
    notes:
      'Short, and it closes a loop: the project name from the detached-mode slide is the mechanism behind the boundary. Somebody always tries to reach a compose service from a stray docker run container, and this is the slide that told them why it fails. If anyone asks how something OUTSIDE Docker reaches a container at all, answer in one sentence and move on: that needs a separate key, and it comes later in this course. Do not name the key and do not draw it.',
  },

  /* --- Back matter, slides 64 to 69 --------------------------------- */
 
  {
    id: 'takeaways',
    section: 'Close',
    label: 'Key Takeaways',
    element: (
      /*
        THE AGENDA'S FOUR ITEMS, IN THE AGENDA'S OWN WORDS.

        Read straight off `AGENDA`, never retyped. The takeaways slide is the
        agenda handed back, so the difference between the two frames is the UI
        and the tense the instructor reads them in, not the wording.
      */
      <KeyTakeawaysSlide
        kicker={SESSION}
        title="Key Takeaways"
        lesson={SESSION}
        points={AGENDA.map((item) => ({ text: item.title, sub: item.sub }))}
      />
    ),
    notes:
      'Point back at the agenda as you read: the same four items in the same words, now in the past tense. Both slides render from one list, so they cannot disagree.',
  },
  {
    id: 'practice',
    section: 'Close',
    label: 'Try it by yourself',
    element: (
      <PracticeSlide
        kicker={SESSION}
        title="Try it by yourself"
        prompt="Build today's two service stack again, from an empty folder, without looking at the finished file"
        lesson={SESSION}
        /*
          THE SAME WORK AGAIN, NOT AN EXTENSION OF IT.

          This used to ask for a THIRD service on a THIRD runtime, with any base
          image they liked from Docker Hub. Read as practice that is a new task
          wearing practice's clothes: it adds a runtime the session never showed,
          a base image nobody has chosen before, and a fourth service block to a
          file the room has written exactly once. Anyone who had not followed the
          session cleanly was now stuck on something harder than the lesson, on
          their own, with no instructor in the room.

          Repetition is what a practice slide is for. These four tasks are the
          session's own four sections, done again from an empty folder, so the
          only thing being tested is whether they can reproduce today unaided.
        */
        tasks={[
          { text: 'Recreate backend and frontend with their Dockerfiles', sub: 'The same six instructions in each, one runtime per folder' },
          { text: 'Write docker-compose.yml from an empty file', sub: 'services, build, depends_on, environment and volumes' },
          { text: 'Run docker compose up and read both logs', sub: 'Check the start order, and the address the frontend prints' },
          { text: 'Run down, then up, and check the count', sub: 'Then down -v, and check it again' },
        ]}
      />
    ),
    notes:
      'Repetition, not extension. Every task here is something the session already did in front of them, so nobody needs a new idea to finish it and nobody gets stuck alone on something harder than the lesson. Doing it from an empty folder is the whole point: following along is not the same as being able to reproduce it. The last task is the one that proves they understood volumes.',
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
        NO MESSAGE. The deck already ends on the next-up teaser, and a line here as
        well gave it two endings, which is the same reason `ThankYouSlideProps`
        carries no `nextUp`. The mark on stage is the whole slide.
      */
      <ThankYouSlide lesson={SESSION} />
    ),
    notes: 'Close. The mark is on stage here, so the footer does not print a second one.',
  },
]
