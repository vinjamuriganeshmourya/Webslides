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
  ScenarioSlide,
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
  LayerGap,
  LayerStack,
  ContainerJourney,
  MachineBoundary,
  Shot,
  Terminal,
} from '@/ui'
import { colors } from '@/design/tokens'

/**
 * Deployment · Session 1 "Introduction to Docker"  ·  **v2**
 *
 * Content is the signed-off Session 1 deck; the rendering layer is the Evolve
 * theme that ships in `template-code.zip`. See the delta plan at
 *   `Web Slides/workflow/plans/deployement_session_1_v2.md`
 * for the v1 to v2 component mapping and the decisions behind it.
 *
 * FIVE RULES GOVERN THIS FILE. All five are easy to break by accident while
 * editing, so they are restated where they bite:
 *
 *   R1 SCOPE DISCIPLINE. This session is Problem 1 (runs anywhere) only. No
 *      slide shows a server, a globe, a public URL, or inbound traffic.
 *
 *   R2 WINDOWS-FIRST. Every command is PowerShell. macOS/Linux forms appear
 *      alongside, never instead.
 *
 *   R3 PROBLEM 2 IS NAMED, NEVER OPENED. Problem 2 is stated as a problem and
 *      nothing more: no tool names, and no breakdown into stages (in
 *      particular no "Automate" stage) until the hosting sessions introduce it.
 *      Problem 2 is also NOT greyed out on the two-problems slide: it is a real
 *      problem of equal weight, just not today's. Only the roadmap marks it
 *      unopened, because that is the figure whose job is "where are we".
 *
 *   R4 NO SPACED EM DASH in any rendered string. Use a comma, a colon, a full
 *      stop, or parentheses. This applies to slide text, table cells, captions
 *      and callouts, in this file and in every component it renders.
 *
 *   R5 NO TRAILING FULL STOP on a rendered slide string. Mid-string stops are
 *      fine where a body genuinely runs to two sentences. Speaker notes and
 *      captured terminal output keep their punctuation.
 *
 *   R6 VIDEO BOX RESERVATION. The top-right 367x220 of the 1280x720 canvas is
 *      kept clear for an instructor video. Assert with `node video-safe.mjs`.
 *
 * v2 also holds itself to `workflow/STYLE_GUIDE.md`: roughly 40 body words a
 * slide, 2 to 3 word titles, 3 to 6 word bullet fragments. Reasoning that does
 * not fit on the slide lives in `notes`.
 */

export const deploymentSession1Meta: DeckMeta = {
  title: 'Introduction to Docker',
  course: 'React + Django Integration · Deployment',
  lesson: 'Introduction to Docker',
  presenter: 'NxtWave Instructor',
}

/** Footer text on every slide: the session name, never "Session 1". */
const SESSION = 'Introduction to Docker'

/* ------------------------------------------------------------------ */
/* Shared slide furniture                                              */
/* ------------------------------------------------------------------ */

/**
 * A RUNTIME LAYER, WITH ITS OWN MARK.
 *
 * `Node` and `Python` are the two names this deck repeats most, across the two
 * stack figures and `ContainerJourney`, and as bare words they read as
 * interchangeable boxes. The marks make each one recognisable at a glance from
 * the back of a room, which is the whole job of these figures: the room is meant
 * to see that the SAME two things do or do not travel, not to read four labels.
 *
 * `LayerStack` types `label` as a `ReactNode`, so this needs no change to the
 * component. Vendor files, unrecoloured, per the asset rules: the mark stays
 * full colour even inside a red `breaks` box, because that box is about the
 * version being wrong, not about the runtime being a different product.
 */
function RuntimeLabel({ logo, children }: { logo: string; children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2">
      <img src={logo} alt="" draggable={false} className="h-4 w-4 object-contain" />
      {children}
    </span>
  )
}

const PY_LOGO = '/assets/tech/python.svg'
const NODE_LOGO = '/assets/tech/nodejs.svg'

/** Inline code, for the many `localhost:3000` / `runserver` mentions. */
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
 * One image, many containers. A slab on the left, three live instances on the
 * right. The grey slab never changes, which is the whole teaching.
 * Local to this deck: it is slide furniture, not a reusable kit component.
 */
function ImageFanout() {
  return (
    <div className="flex items-center justify-center gap-4">
      <div
        className="flex h-24 w-32 flex-col items-center justify-center rounded-xl border-2 border-dashed text-center"
        style={{ borderColor: colors.muted, background: '#F1F5F9' }}
      >
        <span className="font-heading text-base font-bold" style={{ color: colors.body }}>
          Image
        </span>
        <span className="text-xs" style={{ color: colors.muted }}>
          read-only
        </span>
      </div>
      <LayerGap />
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((n) => (
          <div
            key={n}
            className="flex w-40 items-center gap-2 rounded-xl border-2 bg-white px-3 py-2"
            style={{ borderColor: colors.brand }}
          >
            <span className="h-2 w-2 shrink-0 animate-pulse rounded-full" style={{ background: colors.brand }} />
            <span className="text-body-sm font-semibold text-ink">Container {n}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export const deploymentSession1Deck: SlideDef[] = [
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
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        /* The orbit mark carries both lines: the session name small, the word
           Agenda large. There is no separate slide header on this layout. */
        kicker={SESSION}
        title="Agenda"
        lesson={SESSION}
        /* Four items, and they are the deck's four sections. The key takeaways
           slide at the end restates exactly these, so the room is told the same
           four things three times: here, as they happen, and at the close. */
        items={[
          { title: 'Where Your App Lives', sub: 'One application, one machine' },
          { title: 'Containerization', sub: 'Ship the environment, not just the code' },
          { title: 'Docker', sub: 'The tool that does it' },
          { title: 'Docker Installation', sub: 'Install · start · verify' },
        ]}
      />
    ),
    notes:
      'Four items, and item two is the answer. Naming containerization up front is fine: item one is what makes you want it.',
  },

  /* --- 1. Where Your App Lives -------------------------------- */
  {
    id: 'c1-divider',
    section: 'Where Your App Lives',
    label: '01 Divider',
    element: (
      // No illustration: the kit's scenes all belong to the Client and Server
      // session and none depicts this concept. Placing an unrelated one to fill
      // space is forbidden by the style guide, so this divider stays typographic
      // until a topic-specific illustration is built.
      <SectionBreakerSlide
        index={1}
        title="Where Your App Lives"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'c1-two-terminals',
    section: 'Where Your App Lives',
    label: 'Two terminals',
    element: (
      <ContentSlide
        kicker="Where Your App Lives"
        title="One App, Two Terminals"
        lead="One application, two processes, one machine"
        lesson={SESSION}
      >
        {/* A real capture of the student's own VS Code, split into two terminals,
            rather than a recreation (SLIDE_WORKFLOW Stage 3). This still satisfies
            R3: it *is* the VS Code terminal, with the panel tab strip and a
            `PS <path>>` prompt on every command, and it is two panels rather than
            two prompts in one. Cropped to the panel per R11, and NOT retouched,
            which is why the prompt shows the real long path. */}
        {/* The capture is the whole slide now: centred, with no callout competing
            with it. The `.\` prefix and execution-policy warnings moved into
            `notes` rather than being dropped, since both still bite on a fresh
            Windows and the presenter needs them to hand. */}
        <Shot
          src="/shots/t1-t2-terminals.png"
          alt="VS Code split into two terminals: Django runserver on the left, Vite dev server on the right"
          caption="One application: the left terminal runs its API, the right runs its pages"
          className="mx-auto w-full"
        />
      </ContentSlide>
    ),
    notes:
      'Two separate terminals, never one. Point at the prompt path on each: the commands only work from the right folder, and "wrong folder" is the first error they will hit. This session is written for Windows; every command runs in the VS Code integrated terminal (R3). This is a working full-stack app and every piece of it is correct. Exactly two things are wrong: it runs on one machine, and nobody else can open it. TWO SETUP TRAPS, moved here off the slide, mention them only if someone is stuck: the .\\ prefix on .\\env\\Scripts\\activate is required, because PowerShell will not run a script from the current folder without it and the error reads like a missing file; and on a fresh Windows the activate script is blocked outright until they run Set-ExecutionPolicy -Scope CurrentUser RemoteSigned once, which fails as UnauthorizedAccess and is not a problem with their project.',
  },
  {
    id: 'c1-it-works',
    section: 'Where Your App Lives',
    label: 'It works',
    element: (
      <ContentSlide
        kicker="Where Your App Lives"
        title="It Works"
        lead="One application answering on two ports"
        lesson={SESSION}
      >
        {/* Real captures, not mockups (SLIDE_WORKFLOW Stage 3). Cropped to the
            address bar plus the result, per R11. Each carries exactly one
            highlight, on the port, because the two captures differ by four
            characters and that difference is the entire point of the slide. */}
        <div className="grid grid-cols-2 gap-6">
          <Shot
            src="/shots/s1-app-products.png"
            alt="The React app at localhost:3000 showing the product list, signed in"
            caption="The pages you see"
            highlight={{ left: 5, top: 0.5, width: 13.7, height: 4.5, label: ':3000' }}
          />
          <Shot
            src="/shots/s2-django-api.png"
            alt="Django REST Framework at localhost:8000/api/products/ returning HTTP 200 OK"
            caption="The data behind them"
            highlight={{ left: 5, top: 0.5, width: 13.7, height: 4.5, label: ':8000' }}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Real captures from a running project, not mockups. The point is not that it looks nice, it is that both halves are correct and both live on this one machine. Read the two highlighted ports out loud: 3000 serves the pages, 8000 serves the data. Then ask what happens if you send either URL to someone else. That question is the next slide.',
  },
  {
    id: 'c1-two-problems',
    section: 'Where Your App Lives',
    label: 'Two questions',
    element: (
      /*
        This used to be a four-row comparison table. The table answered both
        problems before the room had felt either one, which is the wrong order:
        a question the audience answers in their head lands harder than a cell
        they read. Each card asks one question and stops. The callout underneath
        is the only claim on the slide, and it is the one that matters here.
      */
      <ContentSlide
        kicker="Where Your App Lives"
        title="Two Questions"
        lesson={SESSION}
      >
        <CardGrid cols={2}>
          <Card icon="devices" title="Will it run on any machine?" tone="brand">
            It runs on yours, and it was built on yours
          </Card>
          <Card icon="globe" title="Will everyone be able to open it?" tone="teal">
            Right now the only person who can reach it is you
          </Card>
        </CardGrid>

        <Callout kind="note" title="These are two different problems" className="mt-8 max-w-none">
          Different causes, different fixes, and solving one does nothing for the other
        </Callout>
      </ContentSlide>
    ),
    notes:
      'Ask both out loud and wait. Most rooms answer no to the first and are not sure about the second. Give both equal weight: problem 2 is not a lesser problem, it is a later one. Do not name any tool yet, they mean nothing until the problem is felt.',
  },
  {
    id: 'c1-localhost',
    section: 'Where Your App Lives',
    label: 'The word “localhost”',
    element: (
      /*
        Copy supplied verbatim by the author. Full sentences rather than the usual
        3 to 6 word fragments, because this is the slide that defines a word
        students have typed a hundred times without picturing it, and
        "Deployment" on its own was a label rather than a statement.
      */
      <ContentSlide
        kicker="Where Your App Lives"
        title="“localhost”"
        lesson={SESSION}
        points={[
          {
            text: 'localhost = your own machine',
            sub: 'Browser + servers are running on the same computer',
            icon: 'devices',
          },
          {
            text: 'Sharing localhost with someone else won’t work',
            sub: 'Their browser looks for the app on their own machine',
            icon: 'unlink',
          },
        ]}
      >
        <MachineBoundary />
      </ContentSlide>
    ),
    notes:
      'They have typed this word a hundred times without picturing it. Let the severed request land before you say that localhost is not reachable from outside.',
  },


  /* --- 2. Why "It Works on My Machine" ------------------------------ */
  /*
    THE PROBLEM, BEFORE THE ANSWER
    These three slides used to sit AFTER the definition of containerization,
    which meant the deck handed over the fix and then went back to explain what
    was broken. The room needs to want the answer before it is given one, so the
    scenario is relocated here and the version mismatch that causes it is stated
    outright. "What could go wrong" is answered concretely, in versions, not in
    the abstract.
  */
  {
    id: 'c3-conversation',
    section: 'Containerization',
    label: 'What is the problem',
    element: (
      <ScenarioSlide
        kicker="The Problem"
        title="What Is the Problem We Have?"
        persona="A teammate sets up your project"
        situation="You did everything right. They install and run it"
        beats={[
          { label: 'Teammate', detail: '“The products API crashes the moment I hit it.”', icon: 'chat' },
          { label: 'You', detail: '“That’s strange, it works on my machine.”', icon: 'chat' },
          {
            label: 'Both true',
            detail: 'Nobody is lying. So what is different?',
            icon: 'bulb',
            tone: 'accent',
          },
        ]}
        lesson={SESSION}
      />
    ),
    notes: 'Let the last beat sit. Ask the room before advancing.',
  },
  {
    id: 'c3-what-goes-wrong',
    section: 'Containerization',
    label: 'Run on any machine',
    element: (
      /*
        The version mismatch used to be a table. Same content, asked instead of
        stated: every point here is something the room can check against its own
        laptop, which is what makes the answer land.
      */
      <ContentNoteSlide
        kicker="Containerization"
        title="Will It Run on Any Machine?"
        lesson={SESSION}
        points={[
          {
            text: 'Not everyone runs the operating system you do',
            sub: 'Windows, macOS and Linux do not keep files, paths or permissions the same way',
            icon: 'devices',
          },
          {
            text: 'Not every machine has the versions you built with',
            sub: 'Python 3.14 and Node 20 here, whatever they installed there',
            icon: 'warning',
          },
        ]}
        note={{
          kind: 'warning',
          title: 'Either one is enough',
          body: (
            <>
              A single mismatch and the application <strong>will not start</strong>, and a real
              machine usually differs on both
            </>
          ),
        }}
      />
    ),
    notes:
      'Ask the room what Python version they have. The spread in the answers is the slide. The point is not that any one version is wrong, it is that you cannot know, and cannot control, what the other machine has.',
  },
  /*
    THE ANSWER TO THE QUESTION ON THE SLIDE BEFORE.
    These two used to sit after the definition, as illustrations of a thing
    already explained. They work far better as the answer: the room has just
    been asked whether the app will run on any machine, and these two frames
    show it failing and then working, with the only difference being how much of
    the stack travelled. The definition then names what they just watched.
  */
  {
    id: 'c3-code-alone',
    section: 'Containerization',
    label: 'Code alone',
    element: (
      /*
        Act 1 of a two slide motion graphic. Plays once and settles, rather than
        looping: a loop pulls the eye back while the presenter is still talking
        and never gives you a frame to point at. See `src/ui/ContainerJourney.tsx`.
      */
      <ContentSlide
        kicker="Containerization"
        title="Sending Only the Code"
        lead="The receiving machine fills in everything underneath, at its own versions"
        lesson={SESSION}
      >
        <ContainerJourney act={0} />
      </ContentSlide>
    ),
    notes:
      'Let it play before you talk over it. One chip crosses. Everything underneath is supplied by the machine it lands on, and those versions are not yours. That is the whole of it works on my machine, in one picture.',
  },
  {
    id: 'c3-every-machine',
    section: 'Containerization',
    label: 'How do we resolve this',
    element: (
      <ContentNoteSlide
        kicker="Containerization"
        title="How Do We Resolve This?"
        lesson={SESSION}
        points={[
          {
            text: 'We cannot control the other machine',
            sub: 'It is someone else\u2019s laptop, or a server you have never seen',
            icon: 'lock',
          },
          {
            text: 'A setup guide does not fix it either',
            sub: 'Instructions still depend on what that machine already has',
            icon: 'warning',
          },
          {
            text: 'So we stop depending on it',
            sub: 'Send the operating system files, the runtime and the packages along with the code',
            icon: 'bulb',
            tone: 'accent',
          },
        ]}
        note={{
          kind: 'tip',
          title: 'That has a name',
          body: (
            <>
              Packaging an application with its <strong>entire environment</strong> so it stops
              depending on the machine underneath is called{' '}
              <strong>containerization</strong>
            </>
          ),
        }}
      />
    ),
    notes:
      'Walk down the three points and let the third one be the answer the room arrives at, not the one you announce. Then say the word. The next slide defines it properly.',
  },
  {
    id: 'c3-whole-unit',
    section: 'Containerization',
    label: 'The whole unit',
    element: (
      /*
        Act 2. Identical machines, identical lane, identical chips. The only
        variable that changed between this slide and the last is how much of the
        stack made the journey, which is exactly the point being taught.
      */
      <ContentSlide
        kicker="Containerization"
        title="Sending the Whole Unit"
        lead="The code and its environment travel together, sealed"
        lesson={SESSION}
      >
        <ContainerJourney act={1} />
      </ContentSlide>
    ),
    notes:
      'Same two machines, same OS underneath, same code. The one thing that changed is that Node and Python came along inside the sealed unit, so there is nothing left for the receiving machine to get wrong. Point at the dashed border: that boundary is what the word container names.',
  },
  {
    id: 'c3-divider',
    section: 'Containerization',
    label: '02 Divider',
    element: (
      /*
        The section is announced AFTER the problem has been felt, not before it.
        Everything up to here is the failure and the question it raises; from
        here on the deck is answering. The divider is the hinge, so it carries
        the answer's name and nothing else.
      */
      <SectionBreakerSlide
        index={2}
        title="Containerization"
        mark="/assets/tech/container-white.svg"
        markAlt="A sealed container"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'c3-containerization',
    section: 'Containerization',
    label: 'What containerization is',
    element: (
      /*
        The definition now carries a figure. Three abstract statements with no
        picture asked the room to hold "one sealed unit" as words; the stack on
        the right is that unit, drawn: the same four layers the previous slides
        argued about, this time all travelling and all inside one boundary. The
        one-sentence summary moved into the lead, so the note is no longer needed
        and the figure has room.
      */
      <ContentSlide
        kicker="Containerization"
        title="What Is Containerization"
        lead="Packaging an application with its entire environment into one unit that runs the same way on any machine"
        lesson={SESSION}
        points={[
          {
            text: 'One sealed unit',
            sub: 'Your code, its packages and the runtimes it needs, sealed together',
            icon: 'lock',
          },
          {
            text: 'Built once, then copied',
            sub: 'Nothing is reinstalled on the machine that receives it, so nothing can drift',
            icon: 'target',
          },
          {
            text: 'That unit is called a container',
            sub: 'Building one is called containerization',
            icon: 'bulb',
            tone: 'accent',
          },
        ]}
      >
        <div className="flex justify-center">
          {/* the dashed boundary IS the teaching: everything inside it travels */}
          <div
            className="rounded-card border-2 border-dashed p-4"
            style={{ borderColor: colors.brand, background: '#F5F8FF' }}
          >
            <div
              className="mb-3 text-center text-body-sm font-bold uppercase tracking-wide"
              style={{ color: colors.brand }}
            >
              one container
            </div>
            <LayerStack
              width={210}
              stepped={false}
              /* No OS layer: a container does not carry an operating system,
                 it borrows the kernel of the machine it runs on. That is the
                 whole reason it is MB rather than GB, and it is
                 the point the virtual machine comparison later turns on. The
                 runtimes are the ones this application actually needs. */
              layers={[
                /*
                  YOUR versions, not theirs. This figure is your environment
                  sealed and travelling, so the numbers have to be the ones on
                  the "Your machine" stack two slides on: Node 22, Python 3.14.
                  It said Node 20 here, which is the RECEIVING machine's version,
                  so the picture of the fix was quietly carrying the bug.
                */
                { label: 'Your code', state: 'ships' },
                { label: <RuntimeLabel logo={PY_LOGO}>Python</RuntimeLabel>, note: '3.14', state: 'ships' },
                { label: <RuntimeLabel logo={NODE_LOGO}>Node</RuntimeLabel>, note: '22', state: 'ships' },
              ]}
              caption="All three travel together"
            />
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Point at the dashed boundary and say it plainly: everything inside it travels, so there is nothing left for the receiving machine to get wrong. Compare it with the two stacks from a moment ago, where only the top box crossed. Do not name Docker yet, that is two slides away. If someone asks whether this is a virtual machine, say no: a virtual machine carries a whole second operating system, and this carries only the layers the application needs.',
  },
  {
    id: 'c3-layers',
    section: 'Containerization',
    label: 'Different ground',
    element: (
      <ContentSlide
        kicker="Containerization"
        title="Different Ground"
        lesson={SESSION}
        points={[
          { text: 'Only your code crosses the gap', icon: 'arrow' },
          {
            text: 'The three layers below stay behind',
            sub: 'The receiving machine re-supplies them, at whatever versions it has',
            icon: 'warning',
          },
          {
            text: 'Containerization sends the environment, not just the code',
            icon: 'bulb',
            tone: 'accent',
          },
        ]}
      >
        <div className="flex items-start justify-center">
          <LayerStack
            width={190}
            stepped={false}
            title="Your machine"
            layers={[
              { label: 'Your code', state: 'ships' },
              { label: <RuntimeLabel logo={NODE_LOGO}>Node</RuntimeLabel>, note: '22', state: 'host' },
              { label: <RuntimeLabel logo={PY_LOGO}>Python</RuntimeLabel>, note: '3.14', state: 'host' },
              { label: 'OS', state: 'host' },
            ]}
            caption="Works"
          />
          <LayerGap label="you share the code" className="mt-24" />
          <LayerStack
            width={190}
            stepped={false}
            title="Their machine"
            layers={[
              { label: 'Your code', state: 'ships' },
              // The two RUNTIMES this project actually needs, not a runtime and a
              // framework: the Django backend runs on Python and the Vite/React
              // frontend runs on Node, which is exactly the pair the room saw in
              // the two terminals earlier in this deck.
              //
              // `ContainerJourney` names the same two things at the same versions,
              // on purpose. The two figures share a visual language one slide
              // apart, so if a version moves here it has to move there too.
              { label: <RuntimeLabel logo={NODE_LOGO}>Node</RuntimeLabel>, note: '20', state: 'breaks' },
              { label: <RuntimeLabel logo={PY_LOGO}>Python</RuntimeLabel>, note: '3.10', state: 'breaks' },
              { label: 'OS', state: 'breaks' },
            ]}
            caption="Same code. Different ground"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'The figure deliberately ends on the question, not the answer. Let the room try to answer it. The next section is that answer, and the same layers come back there with all four travelling together.',
  },

  /* --- 3. Containerization ------------------------------------------ */
  {
    id: 'c3-where-we-are',
    section: 'Containerization',
    label: 'Where we are',
    element: (
      /*
        The handoff into the Docker section. This replaced a benefits table whose
        every row leaned on context the restructure had cut. A recap that ends on
        an open question does the job better: it states only what the previous six
        slides actually established, then hands the next section something to
        answer, which is the role the deleted five-attempts sequence used to play.
      */
      <ContentNoteSlide
        kicker="Containerization"
        title="Where We Are"
        lesson={SESSION}
        points={[
          {
            text: 'Sending just the code is not enough',
            sub: 'The machine it lands on fills in the rest, at its own versions',
            icon: 'warning',
          },
          {
            text: 'The environment has to travel with it',
            sub: 'Packaging both into one unit is what containerization means',
            icon: 'target',
          },
        ]}
        note={{
          kind: 'tip',
          title: 'Which leaves one question',
          body: <>So how do we actually do it?</>,
        }}
      />
    ),
    notes:
      'Say both lines as settled facts, not as new information, because the room has just watched both happen. Then stop on the question and let it sit. The next section is the answer, and the answer is a tool: containerization is what you want, Docker is what does it.',
  },
  {
    id: 'c5-divider',
    section: 'Docker',
    label: '03 Divider',
    element: (
      <SectionBreakerSlide
        index={3}
        title="Docker"
        mark="/assets/tech/docker-white.svg"
        markAlt="Docker"
        lesson={SESSION}
      />
    ),
    notes:
      'This is the answer to the question the layers figure ended on: what if all four layers travelled together? Slide 8 already put Containerization in the Tool cell for Problem 1, so point back at it and pay the word off here.',
  },
  {
    id: 'c4-idea-and-tool',
    section: 'Docker',
    label: 'Idea and tool',
    element: (
      /*
        The bridge the restructure left missing. The original deck earned Docker by
        elimination: five attempts failed, five requirements emerged, Docker was
        the only thing meeting all five. Cutting the attempts removed that
        connective tissue, so this slide replaces it by separating the IDEA from
        the TOOL and handing over the three words section 5 goes on to teach.
      */
      <ContentNoteSlide
        kicker="Docker"
        title="Idea and Tool"
        lead="You now know what containerization does, Docker is what actually does it"
        lesson={SESSION}
        points={[
          {
            text: 'Containerization is the idea',
            sub: 'Package an application with its environment, then move the whole unit',
            icon: 'bulb',
          },
          {
            text: 'Docker is the tool',
            sub: 'It builds those units, stores them, and runs them on any machine',
            icon: 'settings',
            tone: 'accent',
          },
        ]}
        note={{
          kind: 'note',
          title: 'Three words from here on',
          body: (
            <>
              The sealed unit you send is an <strong>image</strong>, the running copy on the far
              machine is a <strong>container</strong>, and <strong>Docker</strong> is what builds and
              runs them
            </>
          ),
        }}
      />
    ),
    notes:
      'Separate the idea from the tool out loud. Containerization is what you would want even if Docker had never been written; Docker is the implementation that won. The three words in the note are the vocabulary for the rest of the session, so say each one while pointing at the picture on the next slide.',
  },
  {
    id: 'c4-docker-words',
    section: 'Docker',
    label: 'In Docker words',
    element: (
      /*
        The same figure as the whole-unit slide, annotated with the two new words.
        Attaching image and container to a picture the room watched ten slides ago
        is cheaper than defining them cold, and it is why section 5 can open on the
        class/object analogy rather than on a definition.
      */
      <ContentSlide
        kicker="Docker"
        title="The Same Picture, Named"
        lead="Nothing new is happening here, only the words have arrived"
        lesson={SESSION}
      >
        <ContainerJourney act={1} docker />
      </ContentSlide>
    ),
    notes:
      'Deliberately the same animation they already understand. Point at the dashed box as it travels and say image, point at what settles on the far machine and say container. One image can produce many containers, which is the next section. Do not define either word formally yet.',
  },
  {
    id: 'c5-definition',
    section: 'Docker',
    label: 'The definition',
    element: (
      <ContentNoteSlide
        kicker="Docker"
        title="The Definition"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'note',
          // The white mark sits inside the callout's coloured icon holder, which
          // is more informative than the generic info glyph on the one slide that
          // defines the product. White variant because the holder is brand blue,
          // and Docker's guidelines forbid recolouring their mark.
          icon: (
            <img
              src="/assets/tech/docker-white.svg"
              alt=""
              draggable={false}
              className="h-5 w-auto select-none"
            />
          ),
          title: 'Docker',
          body: (
            <>
              A platform that packages an application with all of its dependencies (runtime,
              libraries, OS packages and configuration) into one standardised unit called a{' '}
              <strong>container</strong>, which runs identically on any machine that has Docker
              installed
            </>
          ),
        }}
        points={[
          { text: 'Netflix, Spotify and PayPal run on containers', icon: 'star' },
          {
            text: 'Most used and most admired developer tool',
            sub: 'Stack Overflow Developer Survey 2024, over half of professional developers',
            icon: 'star',
          },
        ]}
      />
    ),
    notes:
      'Read the definition again with their own project in mind: Django code, Python 3.10, DRF, simplejwt, cors-headers and the OS libraries they need, all sealed into one unit. For a backend role, Docker shows up in job descriptions about as often as the framework itself.',
  },

  /* --- 4. Images and Containers ------------------------------------- */
  {
    id: 'c5-os',
    section: 'Docker',
    label: 'What about the OS',
    element: (
      /*
        This closes the loop opened on "Will it run on any machine?", where the
        first thing the room could not know about the receiving machine was its
        operating system. The distinction that makes it work, and the one worth
        being precise about: a container packages the OS FILES it needs and
        borrows the KERNEL from the machine it runs on. That is why the figure on
        the containerization slide has no OS layer, and why a container is
        MB rather than GB.
      */
      <ContentNoteSlide
        kicker="Docker"
        title="What About the Operating System?"
        lesson={SESSION}
        /*
          TWO points, not three.

          The third one ("so the operating system stops being a variable") and the
          old second sub, which listed WSL 2, the macOS VM and the Linux host
          kernel, both had to go: the first restated the definition slide one
          before this, and the second is now the whole of the next slide, drawn
          rather than asserted. What is left is the one thing neither neighbour
          says, which is the split between what a container CARRIES and what it
          BORROWS.
        */
        points={[
          {
            text: 'A container packs the OS files it needs',
            sub: 'A slim Linux userland travels inside it, always the same OS',
            icon: 'database',
          },
          {
            text: 'It borrows the kernel from the machine it runs on',
            sub: 'The one piece it does not carry, hence MB not GB',
            icon: 'server',
            tone: 'accent',
          },
        ]}
        note={{
          kind: 'tip',
          title: 'One of the two unknowns is gone',
          body: (
            <>
              &ldquo;Not everyone runs the operating system you do&rdquo; was half the problem, and
              Docker has just <strong>removed it</strong>
            </>
          ),
        }}
      />
    ),
    notes:
      'Be precise here if asked: the container carries the operating system FILES, not a kernel. It borrows the kernel of the machine it runs on, which is exactly why it is MB and a virtual machine is GB. That is the comparison two sections from here.',
  },
  /* --- 4a. One kernel, three hosts ---------------------------------- */
  {
    id: 'c5-three-hosts',
    section: 'Docker',
    label: 'Three hosts, one kernel',
    element: (
      /*
        The figure for the second point on the previous slide, which until now was
        a sentence the room had to take on trust.

        Read every column BOTTOM-UP: the host operating system differs, the middle
        row is how Docker gets a Linux kernel on that host, and the top box is
        byte-identical in all three. The kernel row is `shared` in every column on
        purpose: it is the same borrowed Linux kernel each time, only obtained
        differently, which is exactly the claim the slide is making.

        Each column is titled with its OS mark (`public/assets/tech/*.png`) so the
        room can find its own machine at a glance before reading a word.
      */
      <ContentSlide
        kicker="Docker"
        title="Three Hosts, One Linux Kernel"
        lesson={SESSION}
      >
        <div className="flex flex-col items-center gap-7">
          <div className="flex items-start justify-center gap-8">
            <LayerStack
              width={300}
              stepped={false}
              title={<img src="/assets/tech/windows.png" alt="Windows" draggable={false} className="mb-3 h-12 w-auto select-none" />}
              layers={[
                { label: 'Your container', note: 'identical', state: 'ships' },
                { label: 'Linux kernel, via WSL 2', state: 'shared' },
                { label: 'Windows', state: 'host' },
              ]}
              caption="Docker installs WSL 2 for you"
            />
            <LayerStack
              width={300}
              stepped={false}
              title={<img src="/assets/tech/macos.png" alt="macOS" draggable={false} className="mb-3 h-12 w-auto select-none" />}
              layers={[
                { label: 'Your container', note: 'identical', state: 'ships' },
                { label: 'Linux kernel, in a built-in VM', state: 'shared' },
                { label: 'macOS', state: 'host' },
              ]}
              caption="Docker ships that Linux VM with it"
            />
            <LayerStack
              width={300}
              stepped={false}
              title={<img src="/assets/tech/linux.png" alt="Linux" draggable={false} className="mb-3 h-12 w-auto select-none" />}
              layers={[
                { label: 'Your container', note: 'identical', state: 'ships' },
                { label: 'Linux kernel, the host one itself', state: 'shared' },
                { label: 'Linux', state: 'host' },
              ]}
              caption="Nothing extra. It is already Linux"
            />
          </div>
          <Callout kind="tip" title="Your container always lands on Linux" asStep={false}>
            Whichever operating system you use, your container only ever runs on{' '}
            <strong>Linux</strong>. Docker installs whatever that machine needs to supply the Linux
            kernel, so the same container runs on all three
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Point at the three bottom boxes first, then the three middle boxes, then the top row. The bottom row is the only thing that differs between the columns, and the top row is identical in all three: that is the whole slide. Two questions come up here. First, "so is it a virtual machine on macOS?" Yes, one small Linux VM, shared by every container on that machine, not one per container. Second, "why does Windows need WSL 2?" Because containers borrow a Linux kernel and Windows does not have one, so Docker brings it. Linux hosts install the least, because they already are the target. This slide is why every docker command later is identical in PowerShell, macOS zsh and Linux bash.',
  },
  {
    id: 'c6-class-object',
    section: 'Docker',
    label: 'Image and container',
    element: (
      <ContentSlide
        kicker="Docker"
        title="Image and Container"
        lead="Settle both words with something you already know"
        lesson={SESSION}
      >
        <div className="grid grid-cols-2 items-center gap-10">
          <CodeBlock
            language="python"
            showLineNumbers={false}
            maxHeight={230}
            code={`class Product:      # blueprint, does not run
    ...

p1 = Product()      # a live instance
p2 = Product()      # another, independent`}
          />
          <div className="grid gap-4">
            <Card title="Class → Image" className="!p-5 !text-body-sm">
              A frozen, read-only package of app plus dependencies
            </Card>
            <Card title="Object → Container" className="!p-5 !text-body-sm">
              A live, running instance created from an image
            </Card>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Almost every Docker error a beginner hits comes from confusing these two words. Anchor it here and keep coming back to it.',
  },
  {
    id: 'c6-fanout',
    section: 'Docker',
    label: 'One image, many containers',
    element: (
      <ContentSlide
        kicker="Docker"
        title="One Image, Many Containers"
        lesson={SESSION}
        points={[
          {
            text: 'One image → many containers',
            sub: 'Just as one class produces many objects',
            icon: 'arrow',
          },
          {
            text: 'Three containers, three times the traffic',
            sub: 'That is how a real deployment scales',
            icon: 'bolt',
          },
          {
            text: 'Docker Hub, ready-made images',
            sub: 'python, node, nginx, ubuntu, ready to pull',
            icon: 'database',
          },
          {
            text: 'Or build your own, with a Dockerfile',
            sub: 'That is the next session',
            icon: 'code',
          },
        ]}
      >
        <ImageFanout />
      </ContentSlide>
    ),
    notes:
      'Students who only see a static diagram keep saying "run the image" and "delete the container\'s image" for weeks. Say it explicitly: the grey slab never changes.',
  },


  /* --- 6. Getting Docker Running ------------------------------------ */
  {
    id: 'c8-divider',
    section: 'Docker Installation',
    label: '04 Divider',
    element: (
      <SectionBreakerSlide
        index={4}
        title="Docker Installation"
        lesson={SESSION}
      />
    ),
    notes:
      'Deliberately small. Nothing installed here goes near the internet, so this is still Problem 1. Doing it now means the next session starts with Dockerfile on line 1 instead of forty minutes of setup.',
  },
  {
    id: 'c8-install-link',
    section: 'Docker Installation',
    label: 'Get Docker',
    element: (
      /*
        THE LINK COMES FIRST, and it is the OFFICIAL one.

        The steps that follow this slide are Windows-only, which used to leave
        mac and Linux students with nothing to follow and a verbal aside to
        remember. Docker's own install pages are per-OS, maintained, and change
        under us; sending the room there is both kinder and more honest than
        transcribing a version of the steps that will rot.

        All four URLs were checked live before they were put on the slide. If a
        future edit adds one, check it too: a dead link on a projector is worse
        than no link.
      */
      <ContentSlide
        kicker="Docker Installation"
        title="Get Docker"
        lead="Install Docker by following the official instructions for your operating system"
        lesson={SESSION}
      >
        <div className="grid gap-5">
          <div className="grid grid-cols-3 gap-5">
            {[
              {
                os: 'Windows',
                logo: '/assets/tech/windows.png',
                what: 'Docker Desktop',
                href: 'https://docs.docker.com/desktop/setup/install/windows-install/',
              },
              {
                os: 'macOS',
                logo: '/assets/tech/macos.png',
                what: 'Docker Desktop',
                href: 'https://docs.docker.com/desktop/setup/install/mac-install/',
              },
              {
                os: 'Linux',
                logo: '/assets/tech/linux.png',
                what: 'Docker Engine',
                href: 'https://docs.docker.com/desktop/setup/install/linux/',
              },
            ].map((o) => (
              /*
                THE WHOLE CARD IS THE LINK, not just the URL text. On a projected
                1280x720 canvas a line of 12px monospace is a hopeless click
                target, and the presenter is usually clicking it live in front of
                the room. `target="_blank"` matters more than usual here: the deck
                holds its position in the URL hash, so navigating away in the same
                tab loses the presenter's place in the deck.
              */
              <a
                key={o.os}
                href={o.href}
                target="_blank"
                rel="noreferrer"
                className="flex flex-col items-center gap-3 rounded-card bg-white p-5 text-center shadow-card-soft ring-1 ring-line transition-transform hover:scale-[1.02] hover:ring-brand/40"
              >
                <img src={o.logo} alt="" draggable={false} className="h-12 w-auto object-contain" />
                <div>
                  <div className="font-heading text-body-lg font-bold text-ink">{o.os}</div>
                  <div className="text-body-sm text-body">{o.what}</div>
                </div>
                <code className="break-all font-mono text-[12px] leading-snug text-brand underline decoration-brand/30 underline-offset-2">
                  {o.href.replace(/^https:\/\//, '').replace(/\/$/, '')}
                </code>
              </a>
            ))}
          </div>

          <Callout kind="info" title="Start from one page" asStep={false}>
            <a
              href="https://docs.docker.com/get-started/get-docker/"
              target="_blank"
              rel="noreferrer"
              className="font-mono text-brand underline decoration-brand/30 underline-offset-2"
            >
              docs.docker.com/get-started/get-docker
            </a>{' '}
            picks the right installer for your machine
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Put the link on screen and let the room type it before you say anything else. The three cards are there so nobody has to ask which one applies to them, and the get-docker page is the single URL to fall back on if someone loses the thread. The steps on the next slides are Windows, because that is what most of this room runs; mac and Linux students follow their own page and rejoin at the verify step, which is identical on all three.',
  },
  {
    id: 'c8-installer',
    section: 'Docker Installation',
    label: 'The installer screen',
    element: (
      <ContentSlide
        kicker="Docker Installation"
        title="One Screen To Get Right"
        lead="Keep the default. It already uses WSL 2"
        lesson={SESSION}
      >
        {/* Real capture of Docker Desktop 4.86.0. Older guides describe a
            checkbox called "Use WSL 2 instead of Hyper-V"; it no longer exists,
            and a student hunting for it will stall. Cropped to the dialog only
            (R11), with one highlight on the option that matters.

            The crop is TIGHT to the dialog border: the original capture carried
            a strip of desktop wallpaper down the left and right edges, which
            read as a blue seam once the shot sat inside the `Shot` frame. Bounds
            were found by scanning for the light dialog against the dark desktop,
            not by eye, so the highlight percentages below still line up. */}
        {/*
          MARKED AS WINDOWS. This screen exists only in the Windows installer:
          the macOS installer has no configuration page at all, and Linux has no
          installer. Without the marker a mac student spends the slide looking
          for a dialog that will never appear on their machine.
        */}
        <div className="grid gap-4">
          <Chip tone="nw" className="w-fit gap-2">
            <img
              src="/assets/tech/windows.png"
              alt=""
              draggable={false}
              className="h-4 w-4 object-contain"
            />
            Windows only
          </Chip>
          <div className="grid grid-cols-[1fr_1.1fr] items-center gap-8">
          <Shot
            src="/shots/s4-installer-config.png"
            alt="Docker Desktop installer Configuration page with Per-user installation selected"
            caption="Docker Desktop 4.86.0"
            highlight={{ left: 5.5, top: 24.4, width: 49.6, height: 6.2 }}
          />
          <div className="grid gap-3">
            <Callout kind="success" title="Per-user installation" asStep={false}>
              Needs no administrator password, and its own description says it uses the WSL 2
              backend. This is the one you want
            </Callout>
            <Callout kind="warning" title="Not all-users" asStep={false}>
              That one asks for a password and exists for Windows Containers, which this course
              does not use
            </Callout>
            </div>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Show this so nobody hunts for a checkbox that was removed. On Windows Home there is no Hyper-V at all, so the per-user WSL 2 route is not merely recommended, it is the only one available. That is the same point as step 1: a container needs a Linux kernel to borrow, and on Windows the way to get one is WSL 2.',
  },
  {
    id: 'c8-engine-running',
    section: 'Docker Installation',
    label: 'Engine running',
    element: (
      /*
        THE CHECK THAT INSTALLING IS NOT THE SAME AS RUNNING.

        Docker Desktop can be installed, present in the Start menu and still have
        a stopped engine, in which case every command in the next session fails
        with a connection error that says nothing about the real cause. The whole
        slide exists for the two words in the bottom-left corner, so that is
        where the highlight goes.

        A REAL capture (R11), not a mock: this is the actual Docker Desktop
        window on a machine where the install worked.
      */
      <ContentSlide
        kicker="Docker Installation"
        title="Engine Running"
        lead="Open Docker Desktop. Check the status in the bottom-left corner"
        lesson={SESSION}
      >
        <div className="grid grid-cols-[1.35fr_1fr] items-center gap-8">
          {/*
            OVERVIEW THEN DETAIL, and both are crops of ONE real capture.

            The raw screenshot is 1919x1020 with roughly 300px of empty white
            between the last card and the status bar. Cutting that band out would
            be a splice, not a crop, and the rule here is that a shot is real. So
            the window is cropped at the end of its own content, and the status
            bar is shown again underneath at its own scale — where the two words
            this whole slide is about are actually readable from the back of a
            room.
          */}
          <div className="grid gap-3">
            <Shot
              src="/shots/s4-engine-running.png"
              alt="Docker Desktop with the Containers screen open and no containers yet"
              caption="Docker Desktop, first launch"
            />
            <Shot
              src="/shots/s4-engine-status.png"
              alt="The Docker Desktop status bar reading Engine running"
              highlight={{ left: 3, top: 42, width: 38, height: 44 }}
            />
          </div>
          <div className="grid gap-3">
            <Callout kind="success" title="Engine running" asStep={false}>
              This is the only confirmation that matters. Until it says this, no docker command
              will work
            </Callout>
            <Callout kind="info" title="An empty Containers list is correct" asStep={false}>
              Nothing has been built or run yet, so there is nothing to show here
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Installed and running are two different states, and this is the slide that separates them. Have everyone open Docker Desktop now and look at the bottom-left corner: until it reads Engine running, every docker command fails with a connection error that says nothing about the real cause. The empty Containers list is expected, because nothing has been built yet. On a first launch the engine can take a minute to come up, so tell them to wait for the words rather than assuming it failed.',
  },
  {
    id: 'c8-steps-34',
    section: 'Docker Installation',
    label: 'Start and verify',
    element: (
      <ContentSlide
        kicker="Docker Installation"
        title="Start and Verify"
        lead="Skip the sign in, then verify from the VS Code terminal"
        lesson={SESSION}
      >
        <div className="grid gap-3">
          <Terminal
            path="C:\nxttrendz"
            fontSize={14}
            lines={[
              // Captured from a real install, 2026-08-12 (T6a). Version strings
              // age fast, so say out loud that theirs will differ.
              { text: 'docker --version', kind: 'cmd' },
              { text: 'Docker version 29.7.2, build a7dcaa6', kind: 'out' },
              { text: '', kind: 'out' },
              // NOT yet captured. Docker Desktop cannot run under VirtualBox
              // (Hyper-V/HCS unsupported in guest), so the hello-world pull is
              // still the canonical output quoted from the TR doc. Recorded as
              // an outstanding capture in workflow/assets-manifest.md.
              { text: 'docker run hello-world', kind: 'cmd' },
              { text: "Unable to find image 'hello-world:latest' locally", kind: 'out' },
              { text: 'latest: Pulling from library/hello-world', kind: 'out' },
              { text: 'Status: Downloaded newer image for hello-world:latest', kind: 'out' },
              { text: 'Hello from Docker!', kind: 'ok' },
            ]}
          />
          {/*
            TWO CALLOUTS SIDE BY SIDE, not stacked.

            Stacked, this slide overflowed its own frame by 300px. The terminal
            is the tallest thing here and it cannot shrink much further without
            the commands becoming unreadable from the back of the room, so the
            two notes go next to each other instead.

            The sign-in note earns its place: Docker Desktop opens on a Sign in
            screen, and on the capture machine that dialog sat in front of the
            engine so `docker --version` answered while `docker info` returned a
            500. The CLI is just a binary on PATH; only the real commands have to
            reach the engine.
          */}
          <div className="grid grid-cols-2 gap-3">
            <Callout kind="info" title="Skip the sign in" asStep={false}>
              Docker Desktop asks you to sign in. Choose skip, nothing here needs an account
            </Callout>
            <Callout kind="success" title="Hello from Docker!" asStep={false}>
              That line is the whole check. Your machine pulled an image and ran a container
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Skip the sign-in dialog first: an account is not needed for anything in this course. If you see Hello from Docker!, you are done. Your machine can now run containers. Say out loud that their version number will differ from the one on screen. Worth knowing why this slide matters more than it looks: docker --version answers even when the engine is completely dead, because the CLI is just a binary on PATH, while every real command has to cross a named pipe to the engine. On the capture machine docker --version succeeded while docker info returned a 500, purely because a sign-in dialog was still gating Docker Desktop and the engine had never started. That is the sharper version of "installed and running are not the same thing". OUTSTANDING: the hello-world pull output is still quoted from the TR doc, not captured, because Docker Desktop cannot run under VirtualBox. See workflow/assets-manifest.md.',
  },
  {
    id: 'c8-what-installed',
    section: 'Docker Installation',
    label: 'What you installed',
    element: (
      <ContentSlide
        kicker="Docker Installation"
        title="What You Installed"
        lesson={SESSION}
        points={[
          {
            text: 'Docker Engine',
            sub: 'The background service that builds images and runs containers',
            icon: 'settings',
          },
          {
            text: 'The docker command',
            sub: 'The CLI you type into PowerShell, how you talk to the engine',
            icon: 'terminal',
          },
          {
            text: 'WSL 2 Linux kernel',
            sub: 'One small kernel, shared by every container',
            icon: 'server',
          },
        ]}
      >
        <div className="grid gap-4">
          <Callout kind="info" title="Read your own output" asStep={false}>
            Docker looked for an <strong>image</strong>, did not find it, pulled it from Docker Hub,
            then created a <strong>container</strong> from it. It printed one line and exited
          </Callout>
          <Callout kind="warning" title="The common Windows error" asStep={false}>
            <Code>error during connect</Code> means one thing: Docker Desktop is not running.
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'Docker Engine IS "Docker"; everything else is packaging around it. Containers need a Linux kernel to borrow and Windows does not have one. And the first thing Docker already bought them: every docker command is identical in PowerShell, CMD, macOS zsh and Linux bash. Every shell command they have typed so far forks per OS, and this one does not. On Linux a "permission denied" instead means sudo, or adding the user to the docker group.',
  },
  {
    id: 'c8-quiz',
    section: 'Docker Installation',
    label: 'Quiz Time',
    element: (
      /*
        The deck announces the quiz and stops there. The question is asked from
        the quiz tool, not from the slide, so there is one copy of it rather than
        two that can drift apart, and no answer is ever sitting on a slide the
        room has already seen.
      */
      <QuizTimeSlide lesson={SESSION} />
    ),
    notes:
      'Ask the question from the quiz tool and hold this slide while the room answers. The question for this beat: you run docker rm on a container, what happens to its image? The answer is nothing, the image is untouched, and you can create a fresh container from it immediately.',
  },

  /* --- Closing frame ------------------------------------------------ */
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Key takeaways',
    element: (
      <KeyTakeawaysSlide
        kicker="Key Takeaways"
        title={SESSION}
        lesson={SESSION}
        /* The agenda's four items, verbatim and in order. Not a paraphrase:
           the room was promised these four words at the start, so these four
           words are what the close should hand back. */
        points={[
          'Where Your App Lives',
          'Containerization',
          'Docker',
          'Docker Installation',
        ]}
      />
    ),
    notes:
      'Deliberately a different UI from the agenda, but the same four items in the same order, restated as things they can now do. If a point here does not map to an agenda item, it should not be on this slide.',
  },
  {
    id: 'practice',
    section: 'Closing',
    label: 'Practice',
    element: (
      /* Kept free of session-specific content on purpose: this frame is the same
         in every deck, so it can be lifted between sessions without editing. */
      <PracticeSlide
        kicker="Practice"
        title="Before the Next Session"
        prompt="Spend a little time with what you saw today"
        lesson={SESSION}
        tasks={[
          { text: 'Revisit today’s concepts', sub: 'Say each one back in your own words' },
          { text: 'Try the steps yourself', sub: 'On your own machine, start to finish' },
        ]}
      />
    ),
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
        A section breaker with NO index: the deck has exactly four numbered
        sections and this is not a fifth. Dropping the numeral is what keeps the
        numbering honest while still using the frame the room already reads as
        "a new chapter starts here".
      */
      <SectionBreakerSlide
        kicker="Next session"
        title="Docker File Creation"
        lesson={SESSION}
      />
    ),
    notes:
      'Land the handover: today was understanding and installing, next time they write the recipe for their own project. Nothing to do between now and then except finish the install.',
  },
  {
    id: 'thank-you',
    section: 'Closing',
    label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
  },
]
