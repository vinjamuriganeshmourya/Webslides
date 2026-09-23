import type { DeckMeta, SlideDef } from "@/deck/types";
import {
  BrandSlide,
  WelcomeSlide,
  AgendaSlide,
  SectionBreakerSlide,
  ContentSlide,
  ContentNoteSlide,
  QuestionSlide,
  QuizTimeSlide,
  KeyTakeawaysSlide,
  ThankYouSlide,
} from "@/slides";
import {
  Terminal,
  CodeBlock,
  DataTable,
  StatusList,
  Callout,
  CardGrid,
  Card,
  SpineFlow,
  StepLedger,
  GateFlow,
  Shot,
  ThreeLanes,
  /* THE KIT'S `Tech`, NOT THE DECK'S OWN.

     `deckShared.tsx` carried a local `Tech` built on `inline-flex`, which is the
     exact bug `slide-kit/slide-template/src/ui/Tech.tsx` exists to prevent: an
     inline-flex box aligns its BOTTOM edge to the surrounding baseline, so the
     logo and its label both ride below the words either side of them. That
     file's own header names sessions 3, 4, 6 and 7 as the four decks that did
     it, and session 6's review is where it was caught.

     The kit version keeps the label in ordinary inline flow and nudges only the
     image, so a logo mid-sentence sits on the x-height. Its API is `label`
     rather than children, which is why all nine call sites changed shape. */
  Tech,
  SwapRows,
} from "@/ui";
/* IMPORT BY PATH, not from the barrel. `isolation` is a promoted figure FAMILY,
   like `points`, `pseudocode`, `projectcode` and `features`, and the kit's
   barrel deliberately leaves those off: a family offers a CHOICE between designs
   for one contract, so choosing should be a deliberate act at the import line. */
import { LoneHost } from "@/ui/isolation/LoneHost";
/* BY PATH until the kit sync lands it in the barrel. Promoted out of
   `slide-kit/queue-lab` today; the kit's own `src/ui/index.ts` gains the export
   in the same PR as the figure, and this import can move to '@/ui' after the
   next `sync-kit.mjs --apply`. */
import { TillRow } from "@/ui/TillRow";
import {
  SESSION,
  COURSE,
  C1,
  C2,
  C3,
  C4,
  ROOT,
  Co,
  Code,
  PIPELINE,
  GATE,
  RITUAL,
  CHAIN,
  GITIGNORE,
} from "./deckShared";

/**
 * DEPLOYMENT SESSION 7 — "Introduction to Jenkins".
 *
 * 56 slides, four concepts, two quiz frames. Source TR:
 * `/home/nxtwave/docker_jenkins_aws/07_introduction_to_jenkins_and_cicd.md`
 * (437 lines, after the three patches this plan asked for).
 *
 * READ FIRST, IN THIS ORDER:
 *   1. `django_deployement_course/workflow/skills/session-7-deck/SKILL.md`
 *      — this deck's rules. R1 to R13 are session 6's, carried forward.
 *   2. `django_deployement_course/session_plans/deployement_session_7/plan.md`
 *      — the signed plan. Generate what it says, not what you remember of it.
 *   3. `.claude/skills/slide-content-rules/SKILL.md` — the hard rules.
 *
 * THE FOUR THINGS MOST LIKELY TO BE BROKEN BY AN EDIT HERE:
 *
 * 1. **`SpineFlow` takes five spine nodes. Not six.** It is a fixed 1100px stage
 *    with five 180px slots on 230px centres. A sixth node renders as a sliver off
 *    the right edge of the frame and every harness passes it, because all three
 *    measure DOM rectangles and a figure is one rectangle to them.
 * 2. **An `alt` branch needs a `decision` node in the same graph.** Without one,
 *    `gateIdx` is -1 and the branch is drawn at a negative x, off-canvas. This is
 *    why slide 30 has no failure branch and slide 32 does.
 * 3. **The agenda and the takeaways read `C1` to `C4` from `deckShared`.** Hard
 *    rule 20: those two slides carry identical strings. Never type them inline.
 * 4. **A backslash in a JSX attribute is literal.** `path={ROOT}` passes the JS
 *    string, which is right. Writing `path="C:\\nxttrendz"` renders both slashes.
 *
 * WHY THERE ARE NO SCREENSHOTS ANYWHERE IN THIS DECK. Docker Desktop cannot run
 * on the capture machine, and this session additionally needs a running Jenkins
 * container, a real GitHub account and a real push. Every command, output line,
 * password and timestamp is quoted from the TR verbatim. Six slides would like a
 * browser capture and get a table or a status list instead; slide 43 exists so
 * the deck never has to pretend it knows which Jenkins version the room is on.
 */

const NEXT_UP = "Setting Up Jenkins for Docker Builds";

export const jenkinsCicdDeck: SlideDef[] = [
  /* ---------------------------------------------------------------- */
  /* Front frame (1 to 5)                                              */
  /* ---------------------------------------------------------------- */
  {
    id: "brand",
    section: "Opening",
    label: "Brand",
    element: <BrandSlide greeting="Welcome!" lesson={SESSION} />,
    notes: "Welcome to the session.",
  },
  {
    id: "welcome",
    section: "Opening",
    label: "Welcome",
    /* `minimal` is the shipping form (hard rule 21). The kicker "Welcome to
       today's session" is hardcoded inside the component, which is why the brand
       slide above says "Welcome!" and not the same sentence twice. */
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
    notes:
      "Read the session name out loud and stop. The recap is the next frame.",
  },
  {
    id: "recap-docker-hub",
    section: "Opening",
    label: "Where we Left Off",
    element: (
      <ContentNoteSlide
        kicker="Where we Left Off"
        title="Where we Left Off"
        lead="Your images have a home on Docker Hub that any machine can reach"
        lesson={SESSION}
        note={{
          kind: "note",
          title: "Remember",
          body: (
            <>
              An image carries the code, the runtime and the dependencies. It
              never carries configuration, so <Code>.env</Code> stays out and
              Compose supplies it at run time.
            </>
          ),
        }}
      >
        <DataTable
          columns={[
            { label: "What we did", weight: 1.1 },
            { label: "Command", weight: 1.4 },
          ]}
          /* FOUR ROWS RE-CUT AFTER SESSION 6 WAS REVISED.

              Every row was wrong in some way. `:v7` appears NOWHERE in session
              6 — it teaches `:v1`, with `:v2` only as the override example — so
              three of the four rows quoted a tag the room never typed. The
              order was tag-then-login, and session 6 now signs in during
              concept 1 before naming anything. `docker pull` was absent
              entirely, from the recap of a session that teaches it, on the deck
              whose whole premise is that images travel between machines.

              `make push` came out. It is a wrapper rather than a step,
              `c2-your-makefile` shows it in full later, and dropping it makes
              room for the pull row. */
          rows={[
            [
              "Created the account and signed in",
              <Code key="a">docker login</Code>,
            ],
            [
              "Gave the image a full name",
              <Code key="b">docker tag ravi123/nxttrendz-backend:v1</Code>,
            ],
            [
              "Sent both images to Docker Hub",
              <Code key="c">docker push ravi123/nxttrendz-backend:v1</Code>,
            ],
            [
              "Brought one down elsewhere",
              <Code key="d">docker pull ravi123/nxttrendz-backend:v1</Code>,
            ],
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      "Their own last session, in four rows. Then name the gap today closes, out loud and not on the slide: the image has a home, and a human still types every one of those commands.",
  },
  {
    id: "agenda",
    section: "Opening",
    label: "Agenda",
    element: (
      <AgendaSlide
        title="Today's Agenda"
        lesson={SESSION}
        items={[
          { title: C1, sub: "Give your code a home on the internet" },
          { title: C2, sub: "Practice that automates the boring part" },
          { title: C3, sub: "Program that does the work for you" },
          { title: C4, sub: "Job, build, queue and executor" },
        ]}
      />
    ),
    notes:
      "Four concepts. Read them and move on; each one gets its own divider.",
  },
  {
    id: "setup",
    section: "Opening",
    label: "Initial Setup",
    element: (
      <ContentSlide
        kicker="Initial Setup"
        title="Initial Setup"
        lead="Run these terminal commands step by step :"
        lesson={SESSION}
        points={[
          { text: "Docker Desktop is open and running", icon: "devices" },
          {
            text: "Git installed, and the version line prints",
            sub: "If it does not, install Git for Windows before anything else in this session",
            icon: "code",
          },
          {
            text: "You are signed in to Docker Hub",
            sub: "If the sign-in has expired, run docker login before we start",
            icon: "lock",
          },
          /* "created BEFORE the session" AND ITS SUB-LINE BOTH REMOVED ON REVIEW.

             Same fault session 6's setup slide carried and had corrected: a
             pre-flight check claiming the room did something they were never
             asked to do. The sub-line went with it — "making it now costs the
             room ten minutes" is stage direction for the instructor, not a
             check the learner performs, and `notes:` is where that belongs.

             THE GAP THIS LEFT IS NOW CLOSED by `c1-the-github-account`, which
             gives the instruction where the repository is created. This row
             stays as a check rather than a claim: it tells the room what to do
             if they have no account, and points at the slide that will ask. */
          {
            text: "A GitHub account, if you already have one",
            sub: "No account yet is fine, and we create one together before the first push",
            icon: "globe",
          },
        ]}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: "docker --version", kind: "cmd" },
            { text: "Docker version 27.3.1, build ce12230", kind: "out" },
            /* GIT GETS A VERSION CHECK, LIKE EVERY OTHER TOOL IN THIS COURSE.
               Docker and Make both got one on the session that first needed
               them, and Git never did, on the assumption that the room had been
               using it since the integration course. They have not. Without this
               line the first git command of the session is where a machine with
               no Git installed finds out, and there is nothing on the slide to
               fall back on. */
            { text: "git --version", kind: "cmd" },
            { text: "git version 2.43.0", kind: "ok" },
            { text: "make build", kind: "cmd" },
            {
              text: "Successfully tagged nxttrendz-backend:latest",
              kind: "ok",
            },
          ]}
          caption="Project root. Every command in this session runs from here"
        />
      </ContentSlide>
    ),
    notes:
      "The GitHub account is the one that bites. It needs an email confirmation, and a room discovering that at slide 14 loses ten minutes.",
  },

  /* ---------------------------------------------------------------- */
  /* Concept 1: Publishing the Code (6 to 20)                          */
  /* ---------------------------------------------------------------- */
  {
    id: "c1-divider",
    section: C1,
    label: "01 Divider",
    element: (
      <SectionBreakerSlide
        index={1}
        title={C1}
        subtitle="And the last manual step"
        lesson={SESSION}
      />
    ),
    notes:
      "Hand over verbally: last session the image got a home. Where does the code live?",
  },
  {
    id: "c1-where-the-code-lives",
    section: C1,
    label: "Where the Code Lives",
    element: (
      <ContentSlide
        kicker={C1}
        title="Where the Code Lives"
        /* "TWO IMAGES" AND NO CLAIM ABOUT `.git`.

           A3: session 6 now pushes both the backend and the frontend, so the
           image row understated what the room did.

           B2: this used to name `C:\nxttrendz\.git` as where the code lives,
           which asserts a repository exists. `git init` appears in this deck
           exactly once, two slides later, as a detail line inside a
           troubleshooting row — so a learner with no repository was told their
           code was somewhere it is not. "On this laptop, and nowhere else" is
           true whether or not a repository exists yet, and it is the sentence
           the slide actually needs: the contrast is HOME versus NO HOME. */
        lead="Your images have a home on Docker Hub. Your code still has none"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: "What", weight: 0.7 },
            { label: "Where it lives", weight: 1.5 },
            { label: "Who can get it", weight: 1 },
          ]}
          rows={[
            [
              <Tech key="a" name="docker" label="Your images" />,
              <Code key="b">hub.docker.com/r/ravi123/…</Code>,
              "Any machine, anywhere",
            ],
            [
              <Tech key="c" name="git" label="Your code" />,
              "On this laptop, and nowhere else",
              "Only you",
            ],
          ]}
          highlight={[2]}
        />
      </ContentSlide>
    ),
    notes:
      "The two rows have identical columns on purpose. The symmetry is the argument: one of these travelled last session and the other one cannot.",
  },
  {
    id: "c1-committed-not-published",
    section: C1,
    label: "Committed, Not Published",
    element: (
      <ContentSlide
        kicker={C1}
        title="Committed, Not Published"
        /*
          NO LONGER ASSUMES THE ROOM HAS USED GIT.

          This said "Your project has had a .git folder since the integration
          course", and a point below it said "Every git commit you have ever
          run". For most of the room neither is true: they have never committed
          anything, which is the whole reason this section exists. A slide that
          opens by telling a learner they have been doing something they have not
          loses them on the first line.

          The distinction it teaches is the same and does not need the
          assumption: a save on your laptop is not an address on the internet.

          NOW A FIGURE, AND THE ARGUMENT IS WHY.

          It was two bullets and a note. The claim they were making is spatial —
          the commit is HERE and it is nowhere else — and `LoneHost` is the kit
          figure for exactly that: one machine holds the artefact, the machines
          that want it are drawn as empty frames in the same shape, and nothing
          is dimmed or crossed out, because a severed connector still draws a
          relationship where an empty slot draws none. `isolationFigure.ts` names
          session 6's equivalent slide as the case it was built for, and this is
          the same case one artefact earlier.

          BOTH HALVES OF THE DISTINCTION SURVIVE THE CHANGE. "Committed" is the
          holder's own note, so it is read off the machine it happens on;
          "published" is the ruled line under the figure, which is where session 6
          puts the conclusion of a `LoneHost` frame too. Neither is a bullet any
          more and neither is lost.

          NO `points`, DELIBERATELY. `ContentSlide` lays points and children out
          as two columns, and `LoneHost`'s height is a constant, so a narrower
          width buys no vertical room. The registry says so in its own words.
        */
        lead="Saving your work on your laptop and putting it on the internet are two different things"
        lesson={SESSION}
      >
        <div className="w-full">
          <LoneHost
            width={900}
            artefact={{
              label: "Your latest commit",
              ref: ".git",
              icon: "folder",
            }}
            holder={{
              label: "Your laptop",
              note: "Committed: saved into your own history",
              icon: "devices",
            }}
            recipients={[
              { id: "ci", label: "An automation server", cannot: "copy it" },
              { id: "mate", label: "A teammate", cannot: "read it" },
              { id: "server", label: "A remote server", cannot: "run it" },
            ]}
          />
          <p className="mt-6 border-t-2 border-line pt-3 text-body leading-[1.5] text-ink">
            {"Published means it has a web address, like "}
            <Code>github.com/ravi123/nxttrendz</Code>
            {", that another computer can open"}
          </p>
        </div>
      </ContentSlide>
    ),
    notes:
      "This distinction is the whole prerequisite. Say it plainly: committed is a save, published is an address. Then point at the three empty frames and name the one that matters today, the automation server, which copies your code over the network and cannot copy a folder that exists only on your laptop.",
  },
  {
    /*
      `git init` IS THE FIRST STEP, NOT A TROUBLESHOOTING BRANCH.

      Asked for on review: "in publishing code first we need to do git init."

      `c1-git-status` used to carry it as one arm of a two-way check — run
      `git status`, and if you see `fatal: not a git repository` then run
      `git init`. That asks a first-time learner to diagnose which of two states
      they are in before they have done anything, and the deck's own comment on
      `c1-committed-not-published` records that MOST of the room has never
      committed anything, so the "no repository" arm was the common case dressed
      as the exception.

      Everyone runs it now. `git init` on a folder that is already a repository
      reinitialises it and changes nothing, so the unconditional instruction is
      safe for the few who arrive with one.

      `git branch -M main` comes with it because the name `main` is what every
      later slide assumes: `c1-git-status` reads "On branch main" out of the
      output, and `c1-connect-and-push` pushes `-u origin main`.
    */
    id: "c1-git-init",
    section: C1,
    label: "git init",
    element: (
      <ContentSlide
        kicker={C1}
        title="git init"
        lead="Git watches a folder only after you ask it to, and you ask once per project"
        lesson={SESSION}
      >
        {/* NO `points`, SO THE TERMINAL GETS THE WHOLE WELL.

            `ContentSlide` lays points and children out as two columns, and in
            half a stage git's own success line wraps: `align-check` flagged
            "Initialized empty Git repository in C:/nxttrendz/.git/" as one
            token over two lines. The output is real git output and cannot be
            shortened, so the two teaching points move into the lead and the
            caption instead. Same call, same reason, as `c3-unlock`. */}
        <Terminal
          path={ROOT}
          lines={[
            { text: "git init", kind: "cmd" },
            {
              text: "Initialized empty Git repository in C:/nxttrendz/.git/",
              kind: "ok",
            },
            { text: "git branch -M main", kind: "cmd" },
          ]}
          caption="A .git folder now exists, and the branch is named main, which every later step assumes"
        />
      </ContentSlide>
    ),
    notes:
      "Say that this is the only time in the project they run it. If somebody already has a repository the command reinitialises it and nothing is lost, so nobody has to work out which case they are in.",
  },
  {
    id: "c1-git-status",
    section: C1,
    label: "git status",
    element: (
      <ContentSlide
        kicker={C1}
        title="git status"
        lead="First find out what you already have. Run this from the project root"
        lesson={SESSION}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: "git status", kind: "cmd" },
            { text: "On branch main", kind: "out" },
            { text: "Changes not staged for commit:", kind: "out" },
            { text: "        modified:   backend/settings.py", kind: "out" },
          ]}
          caption="Branch and file names mean a repository already exists here"
        />
        <StatusList
          immediate
          items={[
            {
              status: "success",
              text: "You see a branch name and file names",
              detail: "A repository exists. Skip ahead to the .env check",
              label: "Ready",
            },
            {
              status: "warning",
              text: "fatal: not a git repository",
              code: true,
              /* WAS "there is no repository yet, run git init". `c1-git-init` now
                 runs before this slide, so that arm cannot happen any more. The
                 wrong folder is the cause that remains, and it is the one a
                 learner actually hits. */
              detail:
                "You are not in the project root, so change directory and run it again",
              label: "Wrong folder",
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      "Two readings, and which one the room sees decides their next command. Wait here until everyone has run it.",
  },
  {
    id: "c1-env-check",
    section: C1,
    label: "Before the First Push",
    element: (
      <ContentSlide
        kicker={C1}
        title="Before the First Push"
        lead="This check comes before the commit, not after it"
        lesson={SESSION}
        points={[
          {
            text: ".env must NOT appear in that list",
            sub: "It holds your SECRET_KEY, and a public repository is readable by everyone",
            icon: "shield",
          },
          {
            text: "If it does appear, .gitignore is missing its .env line",
            sub: "Add the line below to .gitignore, then run git status --short again",
            icon: "pencil",
          },
        ]}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: "git status --short", kind: "cmd" },
            { text: " M backend/settings.py", kind: "out" },
            { text: "?? docker-compose.yml", kind: "out" },
          ]}
          caption="Short form: one line per file. No .env line here, which is correct"
        />
        <CodeBlock
          code=".env"
          filename=".gitignore"
          language="text"
          showLineNumbers={false}
        />
      </ContentSlide>
    ),
    notes:
      "Run it and read the list out loud. The absence of .env is the thing being checked, and an absence is easy to skim past.",
  },
  {
    /*
      THE WHOLE FILE, AND THE GRAMMAR OF ITS LINES, ON ONE FRAME.

      Asked for on 2026-09-10: "we must include the content that need to be kept
      under .gitignore, also teach the pattern of a folder ignore, a file ignore
      and a file type ignore, all in one slide."

      THE GAP THIS CLOSES. `c1-env-check` shows a `.gitignore` holding exactly one
      line, `.env`, because that is the line the check is about. So the deck
      asserts a file the room has never seen the shape of, and then asks them to
      edit it. A learner who has only seen one line in it does not know whether
      `env/` means a file or a folder, or whether `*.pyc` is even allowed.

      FOUR KINDS OF LINE, AND FOUR IS THE WHOLE GRAMMAR THEY NEED. An exact file,
      a file TYPE, a folder, and a folder at one exact path. Everything else in
      the syntax, negation with `!`, `**` for any depth, is real and is not
      needed to write this project's file, so it stays off the slide (rule 4).

      THE PATTERNS ARE PRECISE, because a wrong one here is worse than no slide:
        `.env`           any file with that name, at any depth
        `*.pyc`          any file with that extension, at any depth
        `env/`           any DIRECTORY with that name, and all of its contents
        `backend/data/`  that one directory, at that one path
      A trailing slash is what makes a line mean "directory", and it is the part
      people leave off.

      IT IS NOT A NEW LIST, AND SAYING SO IS THE TEACHING. Session 4 had them
      write `.dockerignore` with `env/`, `__pycache__/`, `*.pyc`, `db.sqlite3`
      and `.env` in it. This is the same instinct pointed at a different tool, so
      the lead says so and the room recognises the file instead of learning it.
    */
    id: "c1-gitignore-patterns",
    section: C1,
    label: "What Goes in .gitignore",
    element: (
      <ContentSlide
        kicker={C1}
        title="What Goes in .gitignore"
        lead="You wrote almost this list already, as .dockerignore. Four kinds of line"
        lesson={SESSION}
        points={[
          {
            text: (
              <>
                <Code>.env</Code>
                {" is one exact file"}
              </>
            ),
            sub: "Ignored wherever a file of that name appears",
            icon: "file",
          },
          {
            text: (
              <>
                <Code>*.pyc</Code>
                {" is every file of a type"}
              </>
            ),
            sub: "The star stands for any name, so this is one line for thousands of files",
            icon: "json",
          },
          {
            text: (
              <>
                <Code>env/</Code>
                {" is a whole folder"}
              </>
            ),
            sub: "The trailing slash is what means folder, and it is the part people leave off",
            icon: "folder",
          },
          {
            text: (
              <>
                <Code>backend/data/</Code>
                {" is one folder at one path"}
              </>
            ),
            sub: "Give a path when you mean that one, and a bare name when you mean any of them",
            icon: "route",
          },
        ]}
      >
        <CodeBlock
          code={GITIGNORE}
          filename=".gitignore"
          language="text"
          showLineNumbers={false}
        />
      </ContentSlide>
    ),
    notes:
      "Read the file first, then the four rules beside it, then ask which rule each line is. Two of them are folders and the slash is the only thing saying so. Then the connection: this is the .dockerignore instinct pointed at Git, and the reason both exist is that neither tool should carry your secrets or your dependencies. Nobody needs to memorise it, they need to recognise it.",
  },
  {
    id: "c1-irreversible",
    section: C1,
    label: "Why This Order",
    element: (
      <ContentSlide
        kicker={C1}
        title="Why This Order"
        lead="First push is the one step in this session you cannot take back"
        lesson={SESSION}
      >
        {/* THE CALLOUT BECAME A COMPARISON, ON A DESIGN REVIEW.

            It was one `warning` callout holding two sentences, alone on the
            frame, and the frame read as unfinished: the callout takes about 60%
            of the width and the well is 439px tall, so most of the slide was
            empty. The notes called that "a frame with nothing competing on it",
            which is a real device and the wrong one here, because the content is
            not one statement, it is two ASSUMPTIONS being corrected.

            Two assumptions and two corrections is a same-shape comparison, which
            section 7 of the style guide asks to be closed by an explicit verdict,
            so the ruled line under the table is that verdict and is also this
            slide's whole reason for existing: the check comes first. */}
        <div className="w-full">
          <DataTable
            columns={[
              { label: "What people assume", weight: 1 },
              { label: "What actually happens", weight: 1.5 },
            ]}
            rows={[
              [
                "Only the people I tell can see it",
                "Anyone can read a public repository the moment something lands in it",
              ],
              [
                "Deleting the file later removes it",
                "Git keeps every version, so the secret stays in the history",
              ],
            ]}
          />
          <p className="mt-6 border-t-2 border-line pt-3 font-heading text-body-lg font-bold text-ink">
            So the .env check happens before the first push, never after it
          </p>
        </div>
      </ContentSlide>
    ),
    notes:
      "Read the left column as the room's own assumptions, because they are. Then the right, then the line under it, which is the only thing on this slide they have to act on: the check comes before the push. This is why the previous slide is not optional.",
  },
  {
    id: "c1-already-committed",
    section: C1,
    label: "If It Was Committed",
    element: (
      <ContentSlide
        kicker={C1}
        title="If It Was Committed"
        lead="Adding .env to .gitignore does not help, because Git keeps tracking files it is already tracking"
        lesson={SESSION}
        points={[
          {
            text: "Stop tracking it, then commit that change",
            sub: "File stays on your disk. Only Git forgets about it",
            icon: "unlink",
          },
          {
            text: "Then treat that SECRET_KEY as leaked",
            sub: "Generate a new one, exactly as you would rotate a leaked Docker Hub token",
            icon: "key",
          },
        ]}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: "git rm --cached .env", kind: "cmd" },
            { text: "rm '.env'", kind: "out" },
            { text: 'git commit -m "Stop tracking .env"', kind: "cmd" },
            { text: " 1 file changed, 3 deletions(-)", kind: "ok" },
          ]}
          caption="--cached means remove it from Git, not from your folder"
          fontSize={13}
        />
      </ContentSlide>
    ),
    notes:
      "A minority of the room needs this, and that minority has a leaked secret. Give it the full thirty seconds.",
  },
  {
    /*
      THE SLIDE THE WHOLE ROOM WOULD OTHERWISE STALL ON.

      `git config user.name` and `user.email` appeared NOWHERE in this deck, on
      the same assumption the section used to open with: that the room had been
      committing since the integration course. They have not, and on a machine
      that has never committed, `git commit` does not warn -- it FAILS, with an
      error that then tells them to run two commands they have never seen.

      The transcript is real, captured by making a throwaway repository with the
      global and system config suppressed and attempting a commit. That is the
      exact text, including the last line, which is the one that makes it read as
      a failure rather than a hint.

      IT SITS BEFORE THE COMMIT, NOT AFTER IT. Everything else in this section is
      ordered by what breaks if you do it late (the .env check before the push,
      because the push cannot be taken back). This is the same argument one step
      earlier: the identity has to exist before the commit, or the commit is not
      made at all and the room is debugging instead of shipping.
    */
    id: "c1-git-identity",
    section: C1,
    label: "Tell Git who you are",
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="Tell Git Who You Are"
        lead="First commit on a machine fails until Git knows a name and an email"
        lesson={SESSION}
        note={{
          kind: "info",
          title: "Once per machine, not once per project",
          /* Trimmed: the ten-line transcript plus a three-line callout put this
             46px under the control bar. The `--global` explanation is the half
             that earns its place, and the GitHub-email point moved to the notes,
             where the instructor says it anyway. */
          body: "--global sets it for every repository you will ever make on this computer",
        }}
      >
        <Terminal
          path={ROOT}
          fontSize={13}
          /* SIX LINES, NOT TEN. Git's real output has blank lines between every
             part and a closing sentence about --global; the blanks are formatting
             rather than content, and the closing sentence is what the callout
             says. What is left is the error and the two commands, which is the
             whole payload. Nothing was reworded. */
          lines={[
            {
              text: 'git commit -m "Add Docker, Compose and Makefile setup"',
              kind: "cmd",
            },
            { text: "Author identity unknown", kind: "err" },
            { text: "*** Please tell me who you are.", kind: "err" },
            { text: "Run", kind: "out" },
            {
              text: '  git config --global user.email "you@example.com"',
              kind: "out",
            },
            {
              text: '  git config --global user.name "Your Name"',
              kind: "out",
            },
          ]}
          caption="Git tells you the fix. Run those two, then commit again"
        />
      </ContentNoteSlide>
    ),
    notes:
      "Nearly every machine in the room lands here, because nobody has committed on it before. Read the error out loud and point out that Git prints the fix itself, which is worth saying: an error that tells you what to do is a kindness and most will not. USE THE GITHUB EMAIL, because a commit stamped with a different address is not linked to their account on the site, and that is not on the slide. Then have them run the commit again before moving on.",
  },
  {
    id: "c1-commit",
    section: C1,
    label: "Commit Everything",
    element: (
      <ContentSlide
        kicker={C1}
        title="Commit Everything"
        lead="Everything this course has produced so far, saved in one commit"
        lesson={SESSION}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: "git add .", kind: "cmd" },
            {
              text: 'git commit -m "Add Docker, Compose and Makefile setup"',
              kind: "cmd",
            },
            { text: " 12 files changed, 348 insertions(+)", kind: "ok" },
            { text: " create mode 100644 docker-compose.yml", kind: "out" },
            { text: " create mode 100644 Makefile", kind: "out" },
          ]}
          caption="git add . stages every changed file. The dot means this folder and everything under it"
        />
      </ContentSlide>
    ),
    notes:
      "Two commands. Point at the file count and note that .env is not among them.",
  },
  {
    /*
      E2: THE ACCOUNT IS CREATED HERE, NOT ASSUMED.

      The gap the setup slide's own comment records: `c1-empty-repository` opens
      "On github.com: New repository", which assumes an account exists, and
      nothing in these 61 slides ever asked anyone to make one. The pre-flight
      check "A free GitHub account" describes a state instead of giving an
      instruction, which is the same fault session 6's setup slide carried and
      had corrected on review.

      Placed immediately before the repository is created, for the same reason
      session 6 put signup immediately before its first push: the instruction
      lands where the need is felt, not forty slides earlier where it is noise.

      `ravi123` appears hardcoded in `c1-connect-and-push`'s remote URL, so the
      example-username line is not optional here. A learner who copies that
      command verbatim pushes at somebody else's account.
    */
    id: "c1-the-github-account",
    section: C1,
    label: "The account",
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="Create Your Account"
        lead="Your code needs a home, and the username you choose becomes part of its address"
        points={[
          {
            text: (
              <>
                {"Open "}
                <Tech name="github" label="github.com" />
                {" and sign up now, free, with unlimited public repositories"}
              </>
            ),
          },
          {
            text: (
              <>
                {"The username you pick becomes your "}
                <strong>GitHub username</strong>
              </>
            ),
          },
          {
            text: (
              <>
                <Code>ravi123</Code>
                {
                  " is only an example in this course, so replace it with your own"
                }
              </>
            ),
          },
        ]}
        note={{
          kind: "warning",
          title: "Confirm the email now",
          body: "GitHub sends a confirmation mail, and nothing can be pushed until you click it",
        }}
        lesson={SESSION}
      />
    ),
    notes:
      "This is the one that bites: the email confirmation. Ask everyone to type their own GitHub username into the chat now, so nobody is inventing one at the push. Anyone who already has an account can sit this one out.",
  },
  {
    id: "c1-empty-repository",
    section: C1,
    label: "An Empty Repository",
    element: (
      <ContentSlide
        kicker={C1}
        title="An Empty Repository"
        lead="On github.com: New repository, name it nxttrendz, choose Public"
        lesson={SESSION}
      >
        <StatusList
          items={[
            {
              status: "error",
              text: "Add a README file",
              detail:
                "Leave it unticked. It creates a commit inside the new repository",
              label: "Untick",
            },
            {
              status: "error",
              text: "Add .gitignore",
              detail:
                "Leave it unticked. Your project already has a .gitignore",
              label: "Untick",
            },
            {
              status: "error",
              text: "Choose a license",
              detail: "Leave it unticked, for the same reason as the other two",
              label: "Untick",
            },
            {
              status: "success",
              text: "A genuinely empty repository",
              detail:
                "Nothing inside it, so nothing can clash with the history on your laptop",
              label: "What you want",
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      "Say why, once: each of those three tick boxes puts a commit in the remote, and your laptop has a different history, so the two collide the moment you push.",
  },
  {
    id: "c1-connect-and-push",
    section: C1,
    label: "Connect and Push",
    element: (
      <ContentSlide
        kicker={C1}
        title="Connect and Push"
        lead="Two commands: name where it goes, then send it"
        lesson={SESSION}
      >
        <Terminal
          path={ROOT}
          lines={[
            {
              text: "git remote add origin https://github.com/ravi123/nxttrendz.git",
              kind: "cmd",
            },
            { text: "git push -u origin main", kind: "cmd" },
            { text: "Enumerating objects: 47, done.", kind: "out" },
            {
              text: "Writing objects: 100% (47/47), 12.31 KiB | 2.05 MiB/s, done.",
              kind: "out",
            },
            { text: " * [new branch]      main -> main", kind: "ok" },
            {
              text: "branch 'main' set up to track 'origin/main'.",
              kind: "ok",
            },
          ]}
          caption="origin is just a nickname for that long address, so you never type it twice"
        />
      </ContentSlide>
    ),
    notes:
      "Read the last line out loud and leave it on screen. The next slide is about what it means.",
  },
  {
    id: "c1-same-two-steps",
    section: C1,
    label: "You Have Done This",
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="You Have Done This"
        lead="Pushing code takes the same two steps that pushing an image took"
        lesson={SESSION}
        note={{
          kind: "tip",
          title: "What the -u bought you",
          body: (
            <>
              It recorded <Code>origin/main</Code> as this branch's usual
              destination, so from now on the whole command is{" "}
              <Code>git push</Code>.
            </>
          ),
        }}
      >
        {/* A `SwapRows`, NOT A TABLE, AND THE GRAMMAR IS THE REASON.

            This slide's whole argument is "you have done this": the two commands
            they typed for images STAND IN FOR the two they just typed for code.
            That claim has a DIRECTION, from the familiar thing to the new one,
            and `compareFigure.ts` says a figure that asserts direction is what
            this is for while a table asserts none.

            As three table columns the pairing was three cells the eye had to
            collect and pair by row, which is the same fault `comparison-lab`
            recorded against `AnalogyMap`: two boxes and a glyph are three
            objects, so the reader counts three things and then has to be told
            they are one. A `SwapRows` row is ONE object cut in two, the familiar
            side recessed as a well and the new side raised as a lid on top of
            it, so no arrow is needed and no pairing has to be assembled.

            `code` on both pairs, because every cell here is something typed.
            `caption` carries the claim, so it survives a reader whose eye has
            already left the lead. */}
        <SwapRows
          leftLabel="Images, to Docker Hub"
          rightLabel="Code, to GitHub"
          pairs={[
            {
              from: "docker tag ravi123/...",
              to: "git remote add origin https://...",
              code: true,
              note: "Name where it goes",
            },
            {
              from: "docker push ravi123/...",
              to: "git push -u origin main",
              code: true,
              note: "Send it",
            },
          ]}
          caption="Both are pushes to a central service, so both take the same two steps"
        />
      </ContentNoteSlide>
    ),
    notes:
      "The recognition is the teaching. Both are pushes to a central service, so both have the same two steps.",
  },
  {
    id: "c1-verify",
    section: C1,
    label: "Check the Page",
    element: (
      <ContentSlide
        kicker={C1}
        title="Check the Page"
        lead="Open the repository in your browser. Two checks, and the second one is the habit"
        lesson={SESSION}
      >
        <StatusList
          immediate
          items={[
            {
              status: "success",
              text: "backend/ and frontend/ are both listed",
              detail:
                "Along with docker-compose.yml, Makefile and .gitignore, all on one commit",
              label: "Present",
            },
            {
              status: "success",
              text: ".env is nowhere on the page",
              detail: "Make this the check you always run after a first push",
              label: "Absent",
            },
          ]}
        />
        <Callout kind="note" title="Same job, done by two files" asStep={false}>
          <Code>.gitignore</Code> keeps secrets out of Git.{" "}
          <Code>.dockerignore</Code> keeps them out of images. Your project
          already has both files.
        </Callout>
      </ContentSlide>
    ),
    notes:
      "Session 6 said anything pushed to a public repository is visible to the whole world. It was about Docker Hub, and it is equally true here.",
  },
  {
    id: "c1-day-in-the-life",
    section: C1,
    label: "Shipping a Change",
    element: (
      <ContentSlide
        kicker={C1}
        title="Shipping a Change"
        /* ONE SENTENCE, AND "today" AT THE END OF IT.

           It read "Your code is online. So what does it cost, today, to ship one
           small change?" Two faults, both raised on review. The commas around
           "today" are a parenthetical dropped between the verb and its
           complement, so the reader holds "what does it cost" open across an
           aside before reaching "to ship", which is exactly the conditional
           pile-up TEXT_GUIDELINES section 3d's last hazard names. And the two
           halves are one thought, not two: the first is the premise of the
           question, so a comma after "online" carries it and a full stop does
           not.

           14 words, one comma, one sentence, which is inside rule 26 on all
           three counts. */
        lead="Your code is online, so what does it cost to ship one small change today?"
        lesson={SESSION}
      >
        <StepLedger
          {...RITUAL}
          caption="Steps 1 and 2 are your job. Steps 3 to 6 are the same routine, every single time"
        />
      </ContentSlide>
    ),
    notes:
      "Walk down it once. Then say the split out loud: two of these are the work, four are a routine you repeat without thinking. On step 3, say the question it answers: did I break anything? It is the only optional step in the row, and this project has no test target yet, so do not let it read as one more thing they were supposed to have done.",
  },
  {
    id: "c1-what-goes-wrong",
    section: C1,
    label: "Human Ritual Fails",
    element: (
      <ContentSlide
        kicker={C1}
        title="Doing It By Hand Fails"
        lead="Not because anyone is careless. These four happen to everybody"
        lesson={SESSION}
      >
        {/* FOUR CARDS, FOUR ICONS, ASKED FOR ON REVIEW 2026-09-10.

            It was a `StatusList` of four `warning` rows, and `StatusList`
            derives its glyph FROM the status: `KIND` maps `warning` to the
            warning triangle and there is no per-item override. So four different
            failures printed the same triangle and the same amber four times, and
            the row of repeated glyphs said "four cautions" where the slide means
            "four DIFFERENT ways this breaks". A mark that is identical across
            every item carries no information, which is the same reason
            `c2-who-works-this-way` passes no `icon` to its company cards.

            `Card` takes its own `icon` and `tone`, so each failure now carries a
            glyph that means the failure: something forgotten, something skipped
            past, two machines disagreeing, and a wait. Two by two rather than a
            list of four, because these are peers and none of them comes first.

            The amber is gone with the triangle. These are not warnings the room
            has to act on, they are the things that happen to everybody, which is
            what the lead says: "not because anyone is careless". */}
        {/* `mt-2`, AND IT IS NOT COSMETIC.

            `video-safe.mjs` reserves x 913..1280, y 0..220 for the instructor's
            talking head, and this grid's first row opened at y=219, so the
            top-right card crossed that line by a single pixel and the check
            reported a 303px intrusion. Two rows of cards start higher than the
            one-row grids elsewhere in this deck, which is why this slide hit it
            and `c2-who-works-this-way` does not. Eight pixels clears it. */}
        <div className="mt-2">
          <CardGrid cols={2}>
            <Card icon="eye" tone="brand" title="Forgetting">
              You pushed the code and forgot the tests, so broken code reaches
              the team
            </Card>
            <Card icon="route" tone="brand" title="Skipping">
              "It is a tiny change, no need to test it." Famous last words in
              software
            </Card>
            <Card icon="devices" tone="brand" title="Inconsistency">
              Tests passed on YOUR machine, and were never run anywhere else
            </Card>
            <Card icon="chat" tone="brand" title="Delay">
              Person who deploys is in a meeting, so the release waits for them
            </Card>
          </CardGrid>
        </div>
      </ContentSlide>
    ),
    notes:
      "Close on the observation that sets up the question: steps 3 to 6 need no judgment at all. They are a fixed list with a clear pass or fail at each step.",
  },
  {
    id: "c1-the-question",
    section: C1,
    label: "(question)",
    element: (
      <QuestionSlide
        kicker={C1}
        question="Could a machine do all of this for us, the same way, every single time?"
        qualifier="Same four commands you run by hand today"
        lesson={SESSION}
      />
    ),
    notes:
      "Let them answer out loud before you move. The answer is yes, it has a name, and the name is the next concept.",
  },

  /* ---------------------------------------------------------------- */
  /* Concept 2: What CI/CD Is (21 to 33)                               */
  /* ---------------------------------------------------------------- */
  {
    id: "c2-divider",
    section: C2,
    label: "02 Divider",
    element: (
      <SectionBreakerSlide
        index={2}
        title={C2}
        subtitle="Practice, before the tool"
        lesson={SESSION}
      />
    ),
    notes:
      "The practice first. Naming Jenkins now would make CI/CD sound like a Jenkins feature.",
  },
  {
    /*
      PART C, SLIDE 1: THE PICTURE COMES BEFORE ANY VOCABULARY.

      This concept used to open with four definitions in a row: Continuous
      Integration, Continuous Delivery, Continuous Deployment, then a table
      comparing the three. `PEDAGOGY_GUIDELINES.md` section 2 forbids opening a
      concept on its definition, and four in a row is the hardest possible
      opening for a room meeting the idea for the first time. Asked for on
      review: "this is the first time they are learning these so we must be so
      damn clear."

      So the concept now opens on the one sentence the whole thing hangs on, and
      it opens on it as a PICTURE: a machine does what you just did by hand, on
      every push, and it stops when something fails. No term is named. The
      figure is the same chain the room will see named on the next slide, so
      nothing new arrives with the vocabulary.

      The caption carries the payoff line that `c2-ci-promise` used to hold on a
      frame of its own ("broken code is found minutes after it is written").
      That slide was the one cut worth regretting, and this is where its
      sentence lands.
    */
    id: "c2-a-robot-that-watches",
    section: C2,
    label: "A Robot That Watches",
    element: (
      <ContentSlide
        kicker={C2}
        title="A Robot That Watches"
        lead="Everything you just did by hand, a machine can do for you, on every push"
        lesson={SESSION}
      >
        <SpineFlow
          {...PIPELINE}
          caption="It runs the moment you push, and it stops the moment one step fails"
        />
      </ContentSlide>
    ),
    notes:
      "Point at the ritual they just walked through and then at this. Same steps, different typist. Say the payoff out loud: broken code is found minutes after it is written, by a machine, instead of days later by an annoyed teammate. Name nothing yet. The words pipeline and stage arrive on the next slide, and CI/CD two slides after that.",
  },
  {
    /*
      PART C, SLIDE 2: THE NAME, ATTACHED TO THE PICTURE JUST SEEN.

      This was `c2-our-pipeline`, and it did two jobs: it defined the word
      pipeline in its lead AND showed the figure. Split, so the room meets the
      picture first and the word second, which is the order section 2 asks for.
      The figure is not repeated: they saw it a click ago and it has not changed.

      THE `make test` CORRECTION, KEPT. The caption that used to say "make test,
      make build and make push" credited the room with a target no session ever
      wrote. Session 5's Makefile is build, up, down, logs, migrate, superuser
      and shell; session 6 adds push. The honest version of that fact now lives
      in this slide's third point, and `RITUAL` on `c1-day-in-the-life` was
      corrected with it.
    */
    id: "c2-our-pipeline",
    section: C2,
    label: "That Routine Has a Name",
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="That Routine Has a Name"
        lead="One word for the whole line, and one for a single box on it"
        lesson={SESSION}
        noteFirst
        note={{
          kind: "info",
          title: "Pipeline",
          body: "A pipeline is the list of steps a change goes through, and every push starts one run of it",
        }}
        points={[
          {
            text: "Each box on that line is called a stage",
            sub: "One station, one job, and the next one only starts if this one passed",
            icon: "route",
          },
          {
            text: "You already own the commands for two of the five",
            sub: "Stages 3 and 4 are make build and make push, both already in your Makefile",
            icon: "check",
          },
          {
            text: "Stage 2 runs Django's own test command",
            sub: "Nobody has written a make test target, so the pipeline calls Django directly",
            icon: "info",
          },
        ]}
      />
    ),
    notes:
      "Two words, both pointing at the picture still fresh in the room: a pipeline is the whole line, a stage is one station on it. Then the honesty note: they own two of the five commands, and stage 2 is the Django test command they have used since the integration course. Do not imply a make test target exists.",
  },
  {
    /*
      PART C, SLIDE 3: FOUR DEFINITION SLIDES, REPLACED BY ONE FIGURE.

      Cut and replaced by this frame: `c2-ci`, `c2-cd-delivery`,
      `c2-cd-deployment` and `c2-three-terms`. The three terms differ in exactly
      one way, how far along this chain the automation reaches, and a diagram
      states that in one glance where three definition slides can only assert it.

      WHY THIS IS LEGAL UNDER CONTENT RULE 25. One new element per slide, so
      four slides collapse into one only if the figure BUILDS. `ThreeLanes`
      reveals one lane per click: the chain, then Continuous Integration, then
      Continuous Delivery, then Continuous Deployment. Four beats on one frame,
      rule intact. That mechanism is what makes this a re-cut rather than a
      shortcut.

      WHY THIS FIGURE. Built in `slide-kit/cicd-reach-lab` against three other
      candidates, on the brief "research the best ways to represent CI/CD and use
      those". It won on two arguments neither `StopPoints` nor `NestedSpans` nor
      `ReachBands` has: it is the shape Atlassian, Red Hat, AWS, CircleCI, IBM
      and Bitrise all publish, so the room meets it again in the first article
      they read, and it asks no lookup of the viewer, because every lane states
      its own outcome for every stage in place.

      NO `points`, AND THAT IS A CONSTRAINT OF THE FIGURE. It stands 394px
      against the 425px ceiling where a composite's top edge starts centring
      into the instructor-video reserve, so it takes the whole well and a
      one-line lead. `slide-kit/slide-types/README.md` carries that limit.

      THE EXPANSION OF THE LETTERS LIVES HERE, in the lead. It used to be
      `c2-ci`'s opening line, and losing it in a re-cut is a regression that cost
      session 5 six slides to fix.

      `approval` on Continuous Delivery, and its ABSENCE on Continuous
      Deployment, is the whole difference between the two: a person presses
      deploy, or nobody does. Span length alone states the difference and hides
      the reason.
    */
    id: "c2-how-far-it-goes",
    section: C2,
    label: "How Far It Goes",
    element: (
      <ContentSlide
        kicker={C2}
        title="How Far It Goes"
        lead="The letters stand for Continuous Integration and Continuous Delivery, and there is a third name too"
        lesson={SESSION}
      >
        <ThreeLanes
          stages={[
            { n: 1, label: "FETCH", caption: "get the code" },
            { n: 2, label: "TEST", caption: "run the tests" },
            { n: 3, label: "BUILD", caption: "build the image" },
            { n: 4, label: "PUSH", caption: "image to Hub" },
            { n: 5, label: "DEPLOY", caption: "run on server" },
          ]}
          terms={[
            {
              name: "Continuous Integration",
              reaches: 2,
              then: "You are told at once if it broke",
              tone: "inner",
            },
            {
              name: "Continuous Delivery",
              reaches: 4,
              then: "Ready to go live, and it waits",
              approval: true,
              tone: "middle",
            },
            {
              /* THE VERDICT RIDES ON THIS LINE, because the figure has no caption
                 slot (see the note on `ThreeLanes`). `c2-three-terms` carried
                 "we build up to Continuous Delivery, and Continuous Deployment
                 comes in the AWS sessions" as a tip callout, and cutting that
                 slide would have lost the course's own scope with it. */
              name: "Continuous Deployment",
              reaches: 5,
              then: "It goes live on its own, later in this course",
              tone: "outer",
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      "One click per lane, and say the same sentence three times with one word changed: how far does the machine go? Lane 1, as far as testing, and it tells you. Lane 2, all the way to a packaged image that waits. Lane 3, all the way onto the live server. Then point at the one mark that separates the last two: a person presses deploy, or nobody does. Close on where this course stops: we build up to Continuous Delivery, and Continuous Deployment is completed in the AWS sessions at the end of the course.",
  },
  {
    id: "c2-iron-rules",
    section: C2,
    label: "Two Iron Rules",
    element: (
      <ContentSlide
        kicker={C2}
        title="Two Iron Rules"
        lead="Rule 1, stages run in order. Rule 2, a failed stage stops everything after it"
        lesson={SESSION}
      >
        {/* THE GATE IS DEFINED ON THE SLIDE THAT DRAWS IT.

            `c2-gate` used to carry this sentence as a note on a frame of its
            own, one slide after this one: the slide titled "It Is a Gate" was
            bullets, and the figure of the gate was here. Merged on the Part C
            re-cut, so the definition sits on the picture it is about. */}
        <GateFlow
          {...GATE}
          caption="A gate is a place work has to get past, so broken code cannot reach users"
        />
      </ContentSlide>
    ),
    notes:
      "Rule 1 first, with the reason: building an image out of broken code is pointless, so TEST runs before BUILD. Then rule 2, and the new word under the figure: a gate. Say the contrast out loud, because it is the whole safety argument for CI/CD: the pipeline is not only automation that saves you typing, it is what makes shipping broken code impossible.",
  },
  {
    id: "c2-your-makefile",
    section: C2,
    label: "It Is Your Makefile",
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="It Is Your Makefile"
        /*
          "You wrote all three, last session" was wrong twice over.

          `test` was never written by any session, so the room was being credited
          with a target they do not have. And `build` came from the Makefile
          session, which is TWO sessions back, not last session: every other
          "last session" in this deck means Docker Hub, and this was the only one
          that did not.

          Two targets now, each attributed to the session that actually wrote it.
          The claim is smaller and it is true, which is the trade worth making on
          the slide whose whole job is to reassure the room that they already own
          the pipeline.
        */
        lead="Look at stages 3 and 4 again. You wrote both, in the Makefile session and the Docker Hub session"
        lesson={SESSION}
        note={{
          kind: "success",
          title: "Remember",
          body: "Pipeline is your Makefile, run by a robot. Two of its five stages are commands you already wrote.",
        }}
      >
        {/* Two targets, no blank lines between them, at 15px. Every indented line
            is a real tab: the Makefile session spent three slides teaching that
            Make accepts exactly one indentation character. */}
        <CodeBlock
          language="makefile"
          filename="Makefile"
          fontSize={15}
          /* `$(BACKEND)`, NOT `$(IMAGE_NAME)`, AND A TAG LINE ABOVE THE PUSH.

              Session 6 renamed the variable when its `push` target grew to
              publish both images: `IMAGE_NAME` became `BACKEND` and `FRONTEND`,
              and the target is four commands rather than one. So this slide
              quoted a Makefile the room does not have — on the slide whose
              whole job is to reassure them the pipeline is already theirs.

              Two of the four lines are shown, not all four. The claim here is
              "you wrote this", and the backend pair makes it; the frontend pair
              is the same two commands with one word changed. The real target
              has both. */
          code={
            "build:\n\tdocker compose build\npush:\n\tdocker tag $(BACKEND) $(DOCKER_ID)/$(BACKEND):$(VERSION)\n\tdocker push $(DOCKER_ID)/$(BACKEND):$(VERSION)"
          }
        />
      </ContentNoteSlide>
    ),
    notes:
      "The most reassuring slide in the session, and it is true. They are not learning new commands, they are learning who types them.",
  },
  {
    id: "c2-who-works-this-way",
    section: C2,
    label: "Everyone Shipping",
    element: (
      <ContentSlide
        kicker={C2}
        title="Everyone Shipping"
        lead="This is how software is normally made, and this is how often the biggest teams ship"
        lesson={SESSION}
      >
        {/*
          NO `icon` ON THESE CARDS. Each one already carries the company's own
          mark, and passing an icon as well put a house glyph above it: a
          paintbrush over Amazon, a play triangle over Netflix. Two marks on one
          card is one more than the card is asking a reader to recognise, and the
          house one carried no meaning here.

          The bodies are frequencies and nothing else. The first pass wrote
          "Thousands of deployments a day" as a full sentence in three consecutive
          cards, which reads as a stutter rather than as one shared fact. Cut to
          three words, the repetition reads as the point: they are all the same,
          and Amazon is the outlier.
        */}
        <CardGrid cols={4}>
          <Card title={<Co name="amazon" />}>Every few seconds</Card>
          <Card title={<Co name="netflix" />}>Thousands a day</Card>
          <Card title={<Co name="google" />}>Thousands a day</Card>
          <Card title={<Co name="meta" />}>Thousands a day</Card>
        </CardGrid>
        {/* THE GAP IS EXPLICIT, BECAUSE THERE WAS NONE.

            Reported on review: the callout and the cards "are nearly
            overlapped". Measured: the card row's bottom edge sat at y=449 and
            the callout's top edge at y=452, so three pixels of air between two
            filled surfaces, which reads as one block that has gone wrong rather
            than as two elements. `ContentSlide` stacks its children with no
            spacing of its own, so a slide with two block children has to say
            what the gap between them is. */}
        <div className="mt-6">
          <Callout
            kind="note"
            title="Why this matters for your next interview"
            asStep={false}
          >
            None of that is possible with a person typing{" "}
            <Code>make build</Code>. It is why CI/CD appears in nearly every
            backend and DevOps job description you will read.
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      "Named products they already use. Keep it to fifteen seconds and land the job-description line.",
  },
  {
    id: "c2-what-triggers-it",
    section: C2,
    label: "What Starts a Run",
    element: (
      <ContentSlide
        kicker={C2}
        title="What Starts a Run"
        lead="Something has to notice that you pushed. There are three ways"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: "How", weight: 1 },
            { label: "What happens", weight: 1.8 },
            { label: "When it is used", weight: 1.3 },
          ]}
          rows={[
            [
              <Tech key="a" name="github" label="Webhook" />,
              "GitHub tells the server the instant you push, without being asked",
              "Professional standard, and we set one up once the pipeline lives in a file",
            ],
            [
              "Poll SCM",
              "SCM is source control: the server asks GitHub every few minutes whether anything changed",
              "When a webhook cannot reach your server",
            ],
            [
              "Build Now",
              "A person clicks a button",
              "Testing the pipeline itself, which is what we do today",
            ],
          ]}
          highlight={[1]}
        />
      </ContentSlide>
    ),
    notes:
      "Webhook is a new word: GitHub knocking on the door rather than the server asking. Name session 9 and leave it there.",
  },

  /* ---------------------------------------------------------------- */
  /* Quiz 1 (34)                                                        */
  /* ---------------------------------------------------------------- */
  {
    id: "quiz-mid",
    section: C2,
    label: "Quiz Time!",
    element: (
      /* NO `subtitle`. Content rule 28: the quiz frame carries "Quiz Time!" and
         nothing else. The questions come from the quiz tool, so a subtitle here
         previews them on the slide and answers some of them.

         A `{ / * * / }` container is legal only in JSX CHILDREN position; in an
         expression position like this one it is a second expression and a syntax
         error, which is what the first attempt at this comment produced. */
      <QuizTimeSlide lesson={SESSION} />
    ),
    notes:
      "The mid-deck check, at the concept boundary. Everything after this assumes the room can read pipeline, stage and gate, so a misunderstanding caught here does not compound. Ask from the quiz tool.",
  },

  /* ---------------------------------------------------------------- */
  /* Concept 3: Jenkins, the Automation Server (35 to 45)              */
  /* ---------------------------------------------------------------- */
  {
    id: "c3-divider",
    section: C3,
    label: "03 Divider",
    element: (
      <SectionBreakerSlide
        index={3}
        title={C3}
        subtitle="Factory that runs the line"
        lesson={SESSION}
      />
    ),
    notes:
      "We have described the assembly line. Now meet the factory that runs it.",
  },
  {
    id: "c3-what-is-jenkins",
    section: C3,
    label: "What is Jenkins?",
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="What is Jenkins?"
        lesson={SESSION}
        noteFirst
        note={{
          kind: "info",
          /* THE MARK GOES IN THE ICON HOLDER, NOT BESIDE THE TITLE.

             Asked for on 2026-09-09: the callout that introduces Jenkins was
             printing a generic info glyph in its holder and the Jenkins mark
             again in its title, so the one slide in the deck whose whole job is
             "this is Jenkins" carried the mark twice and led with a glyph that
             says nothing. `Callout` takes `icon` as a ReactNode for exactly
             this, and the holder is a 40px tile, so the logo travels on its own
             white plate: a vendor mark is never recoloured and never sits on a
             tinted ground (rule 12). The title stays the plain WORD, because a
             logo supports a name and never replaces it. */
          title: "Jenkins",
          icon: (
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-white">
              <img
                src="/assets/tech/jenkins.png"
                alt=""
                draggable={false}
                className="object-contain"
                style={{ width: 26, height: 26 }}
              />
            </span>
          ),
          body: "A free, open-source automation server: a program that keeps running and starts a pipeline when something happens",
        }}
        points={[
          {
            text: "It never sleeps, so it never forgets",
            sub: "That was failure number one on the by-hand list",
            icon: "eye",
          },
          {
            text: "If CI/CD is the assembly line idea, Jenkins is the factory",
            sub: "Idea needs something to actually run it",
            icon: "settings",
          },
        ]}
      />
    ),
    notes:
      "Two new words in one sentence: automation server, and Jenkins. Define the general thing first, then say Jenkins is one of them.",
  },
  {
    id: "c3-why-jenkins",
    section: C3,
    label: "Why Jenkins",
    element: (
      <ContentSlide
        kicker={C3}
        title="Why Jenkins"
        lead="It is not the only choice, and here are the others honestly"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: "Tool", weight: 1 },
            { label: "What it is", weight: 1.6 },
            { label: "Best when", weight: 1.5 },
          ]}
          rows={[
            [
              <Tech key="a" name="jenkins" label="Jenkins" />,
              "You run it yourself, free, with over 1800 add-ons",
              "You want full control and no licence cost",
            ],
            [
              <Tech key="b" name="github" label="GitHub Actions" />,
              "Built into GitHub, runs on their machines",
              "Your code is on GitHub and you want no server to look after",
            ],
            [
              "GitLab CI",
              "Built into GitLab, the same idea",
              "Your team already lives in GitLab",
            ],
          ]}
          highlight={[1]}
        />
      </ContentSlide>
    ),
    notes:
      "A fair comparison, and the verdict is the next slide. Never leave a comparison open.",
  },
  {
    id: "c3-three-reasons",
    section: C3,
    label: "Three Reasons",
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="Three Reasons"
        lead="Why this course teaches Jenkins and not one of the other two"
        lesson={SESSION}
        note={{
          kind: "note",
          body: "The stages and the rules are identical, so a Jenkins pipeline takes minutes to rewrite in GitHub Actions",
        }}
        points={[
          {
            text: "It has been the most used CI/CD server for over a decade",
            sub: "So you will meet it in real companies",
            icon: "star",
          },
          {
            text: "You run it yourself, so you see what actually happens",
            sub: "Rather than a cloud website doing the interesting parts out of sight",
            icon: "eye",
          },
          {
            text: "Its ideas carry over to every other tool",
            sub: "Jobs, pipelines, stages and credentials mean the same thing everywhere",
            icon: "link",
          },
        ]}
      />
    ),
    notes:
      "The concepts are the durable skill. The syntax is not, and saying so keeps the room honest about tools.",
  },
  {
    id: "c3-where-it-sits",
    section: C3,
    label: "Where It Sits",
    element: (
      <ContentSlide
        kicker={C3}
        title="Where It Sits"
        lead="Jenkins in the middle of every tool this course has already built"
        lesson={SESSION}
      >
        <SpineFlow
          {...CHAIN}
          caption="Jenkins is the robot operator of the tools from sessions 1 to 6"
        />
      </ContentSlide>
    ),
    notes:
      "The map for the next three sessions. Trace it left to right with a finger and name each command as you pass it. The GitHub to Jenkins arrow is the only one that is not a command they type: GitHub tells Jenkins a push happened. The word for that is webhook, from the trigger table earlier, and it is set up in session 9. Name it only if somebody asks.",
  },
  {
    id: "c3-run-in-docker",
    section: C3,
    label: "Run It in Docker",
    element: (
      <ContentSlide
        kicker={C3}
        title="Run It in Docker"
        lead="Jenkins is a Java program, and installing Java by hand is fiddly. We own a tool for exactly this"
        lesson={SESSION}
      >
        <Terminal
          path={ROOT}
          lines={[
            {
              text: "docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts",
              kind: "cmd",
            },
            {
              text: "7b31c0a94e12f3d5a8b2c1e9d4f6a0b3c7e2d1f8a9b4c6e0d3f5a7b1c9e2d4f6",
              kind: "out",
            },
          ]}
          caption="-d means it runs in the background, so the only thing printed is the container's id"
        />
      </ContentSlide>
    ),
    notes:
      "Say the joke out loud: we are installing the tool that installs tools, using the tool whose whole purpose is not installing tools.",
  },
  {
    id: "c3-every-flag-known",
    section: C3,
    label: "Every Flag, Known",
    element: (
      <ContentSlide
        kicker={C3}
        title="Every Flag, Known"
        lead="There is nothing new in that command. You have met all six"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: "Flag", weight: 1.5 },
            { label: "What it does", weight: 2.4 },
          ]}
          rows={[
            [
              <Code key="a">-d</Code>,
              "Runs in the background, so your terminal is free again",
            ],
            [
              <Code key="b">--name jenkins</Code>,
              "A fixed name, instead of the random one Docker would pick",
            ],
            [
              <Code key="c">-p 8080:8080</Code>,
              "Web dashboard, which you open at localhost:8080",
            ],
            [
              <Code key="d">-p 50000:50000</Code>,
              "For extra Jenkins workers later. Standard to open it now",
            ],
            [
              <Code key="e">-v jenkins_home:/var/jenkins_home</Code>,
              "A volume. Every setting and every past run survives a restart, exactly like the pgdata volume does for the database",
            ],
            [
              <Code key="f">jenkins/jenkins:lts</Code>,
              "Official image. lts means Long Term Support, the stable one",
            ],
          ]}
          highlight={[5]}
        />
      </ContentSlide>
    ),
    notes:
      "The volume row is the one they must not skim. Without it, everything they configure today is gone the first time the container restarts.",
  },
  {
    id: "c3-is-it-running",
    section: C3,
    label: "Is It Running?",
    element: (
      <ContentSlide
        kicker={C3}
        title="Is It Running?"
        lead="Because -d printed only an id, check before you open the browser"
        lesson={SESSION}
        points={[
          {
            text: "First start takes about a minute",
            sub: "Jenkins is unpacking itself. Until it finishes, the browser says the connection was refused",
            icon: "info",
          },
          {
            text: "That refusal is not a failed command",
            sub: "It is the most common false alarm in this session. Wait, then reload",
            icon: "warning",
          },
        ]}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: "docker ps", kind: "cmd" },
            {
              text: "CONTAINER ID   IMAGE                 STATUS          NAMES",
              kind: "out",
            },
            {
              text: "7b31c0a94e12   jenkins/jenkins:lts   Up 30 seconds   jenkins",
              kind: "ok",
            },
          ]}
          caption="Up 30 seconds is the words you are looking for"
          /* 11px, because the `docker ps` row is the widest line in the deck and
             `align-check.mjs` reports a mono line that breaks mid-token. Lowering
             the size is the lever here: `maxHeight` only adds an inner scroll and
             the harness measures the un-clipped rect. */
          fontSize={11}
        />
      </ContentSlide>
    ),
    notes:
      "Do not skip this. A room that opens localhost:8080 too early spends five minutes debugging a command that worked.",
  },
  {
    id: "c3-unlock",
    section: C3,
    label: "Unlock Jenkins",
    element: (
      <ContentSlide
        kicker={C3}
        title="Unlock Jenkins"
        lead="Open localhost:8080, and Jenkins asks for a password it hid inside the container"
        lesson={SESSION}
      >
        {/*
          NO `points` ON THIS SLIDE, DELIBERATELY.

          `ContentSlide` lays points and children out as two columns, so a single
          bullet here cut the panel to roughly half the stage. The command is 70
          characters ending in `/var/jenkins_home/secrets/initialAdminPassword`,
          one 46-character token with nowhere to break, so in half a stage it wraps
          at any size worth reading: 13px, 11px and 10px all wrapped, and 10px was
          merely small as well as wrapped.

          Shrinking the type was the wrong lever. The bullet was, so its sentence
          moved into the lead and the panel got the full width it needed.
        */}
        <Terminal
          path={ROOT}
          lines={[
            {
              text: "docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword",
              kind: "cmd",
            },
            { text: "f3a9c1d24b8e4f7a9c0d1e2f3a4b5c6d", kind: "ok" },
          ]}
          /* Line 2 is the password. It is the one string in this deck the room
             has to copy character for character, and `kind: "ok"` alone only
             makes it green among grey. */
          highlight={[2]}
          caption="This is the string to copy. The next screen is where it goes"
        />
      </ContentSlide>
    ),
    notes:
      "Say why the password is hidden in there: only someone who controls the machine can read a file inside a container, so nobody on the network can claim this Jenkins. Reading a file inside a container is a session 1 skill, and this is the first time it has had a real reason. Copy the string into the browser.",
  },
  {
    /*
      WHERE THE STRING FROM THE SLIDE BEFORE ACTUALLY GOES.

      Asked for on 2026-09-21: the deck printed the password and then jumped to
      the plugins screen, so the one action joining them was never shown.

      `wiz-1-unlock.png` was captured in the same wizard run as the three screens
      below and then never placed. It is the screen as you land on it, with the
      field empty, which is what the room sees at the moment they have the string
      on their clipboard and nowhere obvious to put it.

      NO HIGHLIGHT BOX, matching the three wizard slides: the screen has one
      input and one button, so a box would be the noise hard rule 11 warns about.
    */
    id: "c3-paste-password",
    section: C3,
    label: "Paste the Password",
    element: (
      <ContentSlide
        kicker={C3}
        title="Paste the Password"
        lead="One box, and the string you just printed goes in it. The field masks what you paste, so a row of dots is the only confirmation you get"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[540px]">
          <Shot
            src="/shots/wiz-1-unlock.png"
            alt="The Unlock Jenkins screen, with the Administrator password field and a Continue button"
            chrome={{ url: "http://localhost:8080/" }}
            caption="Jenkins names the same file you just read, then asks for what was in it"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      "Point at the file path on the screen first: it is the very file the previous slide read, so the two slides are one action. Warn them the box masks the paste. Somebody always thinks nothing happened and pastes a second time, which gives them the string twice and a rejected password, so say it now: if it is rejected, clear the box completely before pasting again. Then Continue.",
  },
  {
    /*
      THE WIZARD IS SHOWN, NOT DESCRIBED.

      Asked for on 2026-09-09: "instead of this slide lets add direct
      screenshots", listing the three screens. What was here was one
      `ProceduralStepsSlide` with the three as numbered prose, which is the right
      shape for commands a room types and the wrong one for a wizard they click
      through: the thing they need is to recognise the screen in front of them.

      CAPTURED FROM A WIZARD RUN ON PURPOSE. These screens exist only once, on a
      first boot, and they are gone the moment setup finishes. Getting them meant
      wiping the container AND its volume and walking the wizard again, which is
      also why `wiz-1-unlock` and the two after these exist. Do not expect to
      re-take one without doing that: `docker volume rm jenkins_home` is what
      resets it, and nothing less does.

      IN BROWSER CHROME, DRAWN BY THE DECK. Asked for in the same pass: "while
      inserting, insert the screenshot in a browser component to show the url",
      then "we can use a UI browser component and add externally, not required
      inside the screenshot". `Shot`'s `chrome` prop draws a plain, unbranded
      frame carrying the real address. A headless capture cannot include the
      browser's own furniture, and cropping a real window in would drag in the
      operating system, so the frame is drawn and the capture sits inside it.

      NO HIGHLIGHT BOX ON ANY OF THE THREE. `Shot`'s own header says cropping is
      mandatory and boxing is not, because a deck where every capture wears a box
      teaches the room to ignore boxes. Three boxed captures in a row would be
      exactly that, and each screen here has one obvious control.
    */
    id: "c3-wizard-plugins",
    section: C3,
    label: "Install Suggested Plugins",
    element: (
      <ContentSlide
        kicker={C3}
        title="Install Suggested Plugins"
        lead="Two choices, and the left one is the one to click"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[540px]">
          <Shot
            src="/shots/wiz-2-plugins.png"
            alt="The Customize Jenkins screen, offering Install suggested plugins or Select plugins to install"
            chrome={{ url: "http://localhost:8080/" }}
            caption="Plugins are add-ons, and this set includes the Git and Pipeline ones this course needs"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      "Everybody clicks the left card. It takes a few minutes and the progress list is normal, so do not let anyone reload the page while it runs. The right card is how you would pick plugins by hand, and nobody needs that today.",
  },
  {
    /*
      THE WIZARD IS SHOWN, NOT DESCRIBED.

      Asked for on 2026-09-09: "instead of this slide lets add direct
      screenshots", listing the three screens. What was here was one
      `ProceduralStepsSlide` with the three as numbered prose, which is the right
      shape for commands a room types and the wrong one for a wizard they click
      through: the thing they need is to recognise the screen in front of them.

      CAPTURED FROM A WIZARD RUN ON PURPOSE. These screens exist only once, on a
      first boot, and they are gone the moment setup finishes. Getting them meant
      wiping the container AND its volume and walking the wizard again, which is
      also why `wiz-1-unlock` and the two after these exist. Do not expect to
      re-take one without doing that: `docker volume rm jenkins_home` is what
      resets it, and nothing less does.

      IN BROWSER CHROME, DRAWN BY THE DECK. Asked for in the same pass: "while
      inserting, insert the screenshot in a browser component to show the url",
      then "we can use a UI browser component and add externally, not required
      inside the screenshot". `Shot`'s `chrome` prop draws a plain, unbranded
      frame carrying the real address. A headless capture cannot include the
      browser's own furniture, and cropping a real window in would drag in the
      operating system, so the frame is drawn and the capture sits inside it.

      NO HIGHLIGHT BOX ON ANY OF THE THREE. `Shot`'s own header says cropping is
      mandatory and boxing is not, because a deck where every capture wears a box
      teaches the room to ignore boxes. Three boxed captures in a row would be
      exactly that, and each screen here has one obvious control.
    */
    id: "c3-wizard-admin-user",
    section: C3,
    label: "Create First Admin User",
    element: (
      <ContentSlide
        kicker={C3}
        title="Create First Admin User"
        lead="Your own username and password, and this is the account you keep"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[540px]">
          <Shot
            src="/shots/wiz-4-admin-user.png"
            alt="The Create First Admin User form, with username, password, confirm password, full name and email"
            chrome={{ url: "http://localhost:8080/" }}
            caption="This replaces the one-time password you just pasted in"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      "Tell them to write it down. This is the account they sign in with from here on, and the one-time password stops working the moment this form is saved. Then Save and Continue, at the bottom right of the panel.",
  },
  {
    /*
      THE WIZARD IS SHOWN, NOT DESCRIBED.

      Asked for on 2026-09-09: "instead of this slide lets add direct
      screenshots", listing the three screens. What was here was one
      `ProceduralStepsSlide` with the three as numbered prose, which is the right
      shape for commands a room types and the wrong one for a wizard they click
      through: the thing they need is to recognise the screen in front of them.

      CAPTURED FROM A WIZARD RUN ON PURPOSE. These screens exist only once, on a
      first boot, and they are gone the moment setup finishes. Getting them meant
      wiping the container AND its volume and walking the wizard again, which is
      also why `wiz-1-unlock` and the two after these exist. Do not expect to
      re-take one without doing that: `docker volume rm jenkins_home` is what
      resets it, and nothing less does.

      IN BROWSER CHROME, DRAWN BY THE DECK. Asked for in the same pass: "while
      inserting, insert the screenshot in a browser component to show the url",
      then "we can use a UI browser component and add externally, not required
      inside the screenshot". `Shot`'s `chrome` prop draws a plain, unbranded
      frame carrying the real address. A headless capture cannot include the
      browser's own furniture, and cropping a real window in would drag in the
      operating system, so the frame is drawn and the capture sits inside it.

      NO HIGHLIGHT BOX ON ANY OF THE THREE. `Shot`'s own header says cropping is
      mandatory and boxing is not, because a deck where every capture wears a box
      teaches the room to ignore boxes. Three boxed captures in a row would be
      exactly that, and each screen here has one obvious control.
    */
    id: "c3-wizard-instance-config",
    section: C3,
    label: "Instance Configuration",
    element: (
      /* NO `note` ON THIS ONE, AND THE WELL DECIDED IT.

         As a `ContentNoteSlide` the callout landed below the capture and off the
         bottom of the stage, and `align-check` did NOT catch it: the text was
         clipped out of the frame entirely rather than left under the control bar,
         and a string that is not in the visible area is not a collision. Making
         room by shrinking the capture took it to 520px, where the screen's own
         body text stops being readable at the back of a room, which is a worse
         trade than losing the callout.

         So the caution is the caption, where it costs one line instead of a
         hundred pixels, and the capture matches the two before it at 540px. */
      <ContentSlide
        kicker={C3}
        title="Accept the Address"
        lead="Keep the address it offers, then Save and Finish"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[540px]">
          <Shot
            src="/shots/wiz-5-instance-config.png"
            alt="The Instance Configuration screen, with the Jenkins URL field showing http://localhost:8080/"
            chrome={{ url: "http://localhost:8080/" }}
            caption="The wording moves between Jenkins versions, so follow your own screen"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      "The dashboard opens after this. This is the address Jenkins puts in the links it sends out. Say what the field is for, because it is the one screen people stall on: Jenkins is asking what address people reach it at, and it cannot work that out for itself. localhost is right today and stops being right the moment something outside this machine has to reach in, which is session 9 and the webhook. The callout carried its own frame before this pass and is now here, where the screens it warns about actually are.",
  },
  {
    id: "c3-plugins",
    section: C3,
    label: "What Plugins Are",
    element: (
      /* THE ANALOGY MOVED OFF `points`, ON A DESIGN REVIEW.

          One point plus a table put both in `ContentSlide`'s two-column mode, so
          a single bullet held the left half and a three-row table was squeezed
          into the right, wrapping two of its three cells, with the whole top of
          the slide empty. The analogy is one sentence and belongs in a note; the
         table is the content and wants the full width. */
      <ContentNoteSlide
        kicker={C3}
        title="What Plugins Are"
        lead="Jenkins on its own does almost nothing. Nearly every ability is an add-on you install"
        lesson={SESSION}
        noteFirst
        note={{
          kind: "info",
          title: "Same idea as VS Code extensions",
          body: "A small core, plus the pieces you actually need. You have done this before",
        }}
      >
        <DataTable
          columns={[
            { label: "Plugin", weight: 1 },
            { label: "What it lets Jenkins do", weight: 2 },
          ]}
          rows={[
            [
              <Tech key="a" name="git" label="Git" />,
              "Copy a repository from GitHub",
            ],
            [
              "Pipeline",
              "Run a pipeline written in a file, called a Jenkinsfile",
            ],
            [
              <Tech key="b" name="docker" label="Docker Pipeline" />,
              "Build and push Docker images from a pipeline",
            ],
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      "Only the three this course uses. Naming the sessions makes them promises rather than trivia.",
  },

  /* ---------------------------------------------------------------- */
  /* Concept 4: Inside the Jenkins Dashboard (46 to 52)                */
  /* ---------------------------------------------------------------- */
  {
    id: "c4-divider",
    section: C4,
    label: "04 Divider",
    element: (
      <SectionBreakerSlide
        index={4}
        title={C4}
        subtitle="Job, build, queue, executor"
        lesson={SESSION}
      />
    ),
    notes: "Jenkins is running. Now learn to read the screen it just gave you.",
  },
  {
    id: "c4-the-screen",
    section: C4,
    label: "The Screen",
    element: (
      /* FOUR MENU NAMES ARE A TABLE, NOT BULLETS, ON A DESIGN REVIEW.

          As `points` with no children they filled the left 55% and left the
          right half of the slide empty, which is the fault this deck was already
          corrected for once. They are also not four ideas, they are four ROWS of
          the same idea, name and purpose, which is what a table is for. The next
          slide is the real capture of this menu, so this frame is the index and
         that one is the picture. */
      <ContentSlide
        kicker={C4}
        title="Screen"
        lead="Dashboard is empty except for a menu. Here is what is on it"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: "On the menu", weight: 1 },
            { label: "What it is for", weight: 1.9 },
          ]}
          rows={[
            ["New Item", "Where you create a job. We use it in a moment"],
            ["Build History", "Every run Jenkins has ever done, newest first"],
            [
              "Manage Jenkins",
              "Every setting, including the credentials we add next session",
            ],
            [
              "Build Queue, Build Executor Status",
              "Two small panels at the bottom left. The second lists two idle workers, numbered 1 and 2",
            ],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      "Point at each one on your own screen as you say it. Four names, and the next slide defines the words behind them.",
  },
  {
    /*
      REAL CAPTURES, FROM A REAL RUN ON A REAL INSTANCE.

      Jenkins 2.568.3 from `jenkins/jenkins:lts`, set up through the wizard, job
      created by clicking, `Build Now`, all five screens captured at 2x device
      scale and cropped to the region the slide is about. Hard rule 11: crop
      before it reaches a slide, keep the context that carries meaning, never
      retouch a pixel.

      ONE HIGHLIGHT PER CAPTURE, and every box below was MEASURED rather than
      eyeballed: a script read the target element's own bounding box and
      converted it to a percentage of the crop, so the box cannot drift from the
      thing it points at. `Shot`'s own header says a deck where every capture
      wears a box teaches the learner to ignore boxes.

      `c3-screens-drift` still stands and is not contradicted by these: Jenkins
      moves its screens between versions, so these show what the room should
      look for, not what it will match pixel for pixel.
    */
    id: "c4-dashboard-tour",
    section: C4,
    label: "The Menu",
    element: (
      <ContentSlide
        kicker={C4}
        title="The Menu"
        /* THE COPY DESCRIBES THIS CAPTURE, and getting there took two goes.

           The first pass read "everything starts from the four items on the
           left" over a box around TWO of them, and captioned it "an empty
           dashboard is the correct dashboard on day one" over a capture that had
           a job in the table, because both lines were carried over from the
           slide this replaced instead of read off the picture. Content rule 8,
           broken twice on one frame.

           Asked for on review: the capture was retaken with no job present, so
           the dashboard is genuinely the one a room sees before it has built
           anything. The job was deleted, this and `c4-new-item-shot` were taken,
           and the job was then recreated from its own saved `config.xml` and
           rebuilt, which is why the console transcript's script name and
           timestamp changed with it. */
        lead="Two menu items do everything today, and both are at the top left"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[1120px]">
          <Shot
            src="/shots/jenkins-dashboard.png"
            chrome={{ url: "http://localhost:8080/" }}
            alt="The Jenkins dashboard before any job exists, with New Item and Build History in the left menu"
            highlight={{
              left: 2.3,
              top: 20,
              width: 27.1,
              height: 23.6,
              label: "start here",
            }}
            caption="No jobs yet, which is the correct dashboard on day one"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      "New Item creates a job, Build History lists every run across every job. This is exactly what their screen should look like right now, so use it to check that everybody finished the wizard. Build Queue and Build Executor Status are the two panels underneath. Do not name the four words yet: they are named after the room has built something, once the words have a run to point at.",
  },
  {
    /*
      REAL CAPTURES, FROM A REAL RUN ON A REAL INSTANCE.

      Jenkins 2.568.3 from `jenkins/jenkins:lts`, set up through the wizard, job
      created by clicking, `Build Now`, all five screens captured at 2x device
      scale and cropped to the region the slide is about. Hard rule 11: crop
      before it reaches a slide, keep the context that carries meaning, never
      retouch a pixel.

      ONE HIGHLIGHT PER CAPTURE, and every box below was MEASURED rather than
      eyeballed: a script read the target element's own bounding box and
      converted it to a percentage of the crop, so the box cannot drift from the
      thing it points at. `Shot`'s own header says a deck where every capture
      wears a box teaches the learner to ignore boxes.

      `c3-screens-drift` still stands and is not contradicted by these: Jenkins
      moves its screens between versions, so these show what the room should
      look for, not what it will match pixel for pixel.
    */
    /*
      THIS SEQUENCE REPLACED `c4-smoke-test`, THE FOUR-STEP PROCEDURAL SLIDE.

      Asked for on 2026-09-09: "if screenshots are provided, slide 49 can be
      removed right?" Right. Its four steps were New Item and pick Freestyle,
      Add build step and Execute shell, type two lines then Save then Build Now,
      and watch the history, which is exactly what the next three captures show.
      Two slides saying the same four things is one slide too many, and the same
      call was made for `c3-setup-wizard` in the concept before this.

      WHAT MOVED RATHER THAN VANISHED, because a capture shows a screen and does
      not say what to do to it:

        the Freestyle gloss        this slide's caption
        Add build step, Execute shell   `c4-execute-shell-shot`'s lead
        Save, then Build Now       `c4-build-green-shot`'s lead

      Nothing else in it was load-bearing: the fourth step was "watch the
      history", which is the capture on `c4-build-green-shot`.
    */
    id: "c4-new-item-shot",
    section: C4,
    label: "Pick Freestyle",
    element: (
      <ContentSlide
        kicker={C4}
        title="Pick Freestyle"
        lead="Type the name, then choose the second option, then OK"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[640px]">
          <Shot
            src="/shots/jenkins-new-item.png"
            chrome={{ url: "http://localhost:8080/view/all/newJob" }}
            alt="The New Item screen with hello-jenkins typed and Freestyle project highlighted"
            highlight={{ left: 2, top: 71.4, width: 94.7, height: 23.6 }}
            caption="Freestyle means a job you set up by clicking, rather than by writing a file"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'The name in this capture is the real one. An earlier version was taken on an instance that already had the job, and Jenkins answered with "a job already exists with the name hello-jenkins" right under the field: a capture carrying an error the lesson never mentions teaches the error, so the job was removed and the screen retaken clean.',
  },
  {
    /*
      REAL CAPTURES, FROM A REAL RUN ON A REAL INSTANCE.

      Jenkins 2.568.3 from `jenkins/jenkins:lts`, set up through the wizard, job
      created by clicking, `Build Now`, all five screens captured at 2x device
      scale and cropped to the region the slide is about. Hard rule 11: crop
      before it reaches a slide, keep the context that carries meaning, never
      retouch a pixel.

      ONE HIGHLIGHT PER CAPTURE, and every box below was MEASURED rather than
      eyeballed: a script read the target element's own bounding box and
      converted it to a percentage of the crop, so the box cannot drift from the
      thing it points at. `Shot`'s own header says a deck where every capture
      wears a box teaches the learner to ignore boxes.

      `c3-screens-drift` still stands and is not contradicted by these: Jenkins
      moves its screens between versions, so these show what the room should
      look for, not what it will match pixel for pixel.
    */
    id: "c4-execute-shell-shot",
    section: C4,
    label: "Execute Shell",
    element: (
      <ContentSlide
        kicker={C4}
        title="Execute Shell"
        lead="Add build step, then Execute shell, then type two lines and nothing else"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[1060px]">
          <Shot
            src="/shots/jenkins-execute-shell.png"
            chrome={{
              url: "http://localhost:8080/job/hello-jenkins/configure",
            }}
            alt="The Execute shell build step, with echo and date typed into the Command box"
            highlight={{ left: 1.3, top: 29, width: 97.4, height: 55.5 }}
            caption="Build Steps is a menu item on the left, not a heading you scroll to"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      "This version puts Build Steps in the left menu, so nobody needs to scroll. The red cross on the right removes the step, and somebody always finds it by accident.",
  },
  {
    /*
      REAL CAPTURES, FROM A REAL RUN ON A REAL INSTANCE.

      Jenkins 2.568.3 from `jenkins/jenkins:lts`, set up through the wizard, job
      created by clicking, `Build Now`, all five screens captured at 2x device
      scale and cropped to the region the slide is about. Hard rule 11: crop
      before it reaches a slide, keep the context that carries meaning, never
      retouch a pixel.

      ONE HIGHLIGHT PER CAPTURE, and every box below was MEASURED rather than
      eyeballed: a script read the target element's own bounding box and
      converted it to a percentage of the crop, so the box cannot drift from the
      thing it points at. `Shot`'s own header says a deck where every capture
      wears a box teaches the learner to ignore boxes.

      `c3-screens-drift` still stands and is not contradicted by these: Jenkins
      moves its screens between versions, so these show what the room should
      look for, not what it will match pixel for pixel.
    */
    id: "c4-build-green-shot",
    section: C4,
    label: "Build #1",
    element: (
      <ContentSlide
        kicker={C4}
        title="Build #1"
        lead="Save, then Build Now, and the run appears in the history with a tick"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[640px]">
          <Shot
            src="/shots/jenkins-build-1-green.png"
            chrome={{ url: "http://localhost:8080/job/hello-jenkins/" }}
            alt="The job page after one build, showing permalinks and build number 1 with a green tick"
            highlight={{ left: 4.7, top: 88, width: 23.1, height: 7.3 }}
            caption="The four permalinks all point at the same run, because there is only one"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      "That tick is the whole exercise. Everything after this session changes what runs, not whether it ran.",
  },
  {
    /*
      REAL CAPTURES, FROM A REAL RUN ON A REAL INSTANCE.

      Jenkins 2.568.3 from `jenkins/jenkins:lts`, set up through the wizard, job
      created by clicking, `Build Now`, all five screens captured at 2x device
      scale and cropped to the region the slide is about. Hard rule 11: crop
      before it reaches a slide, keep the context that carries meaning, never
      retouch a pixel.

      ONE HIGHLIGHT PER CAPTURE, and every box below was MEASURED rather than
      eyeballed: a script read the target element's own bounding box and
      converted it to a percentage of the crop, so the box cannot drift from the
      thing it points at. `Shot`'s own header says a deck where every capture
      wears a box teaches the learner to ignore boxes.

      `c3-screens-drift` still stands and is not contradicted by these: Jenkins
      moves its screens between versions, so these show what the room should
      look for, not what it will match pixel for pixel.
    */
    /*
      THE CONSOLE WAS A `Terminal` PANEL AND SHOULD NEVER HAVE BEEN.

      Asked on review: "why is VS Code's console used?" It was, and it was wrong.
      `Terminal` draws VS Code's own panel tab strip, `PROBLEMS · OUTPUT ·
      TERMINAL`, and hard rule 3 scopes that component to COMMANDS THE LEARNER
      TYPES. Jenkins' Console Output is a page in a browser that nobody types
      into, so the panel put a room's console behind chrome it will never see and
      claimed a place the output does not come from (content rule 8).

      It existed because there was no capture of the real page. There is one now,
      so the two slides merged: this frame keeps the transcript's teaching and
      shows the page the room is actually looking at. The nine lines are
      unchanged, because they were read out of
      `/var/jenkins_home/jobs/hello-jenkins/builds/1/log` in the first place.
    */
    id: "c4-console-output",
    section: C4,
    label: "Console Output",
    element: (
      <ContentSlide
        kicker={C4}
        title="Console Output"
        lead="Click build #1, then Console Output, and read it top to bottom"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[1100px]">
          <Shot
            src="/shots/jenkins-console-output.png"
            chrome={{
              url: "http://localhost:8080/job/hello-jenkins/1/console",
            }}
            alt="The Console Output page for build 1, showing all nine lines of the log"
            highlight={{ left: 1.7, top: 35.3, width: 96.6, height: 10.6 }}
            caption="Every plus sign below that line comes from the -x in sh -xe"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      "Four things to point at, in order: the workspace Jenkins made for this job, the boxed line, the plus signs, and the verdict. The boxed line is the one worth slowing down on, because Jenkins does not run your commands directly: it writes them into a temporary script and runs that with sh -xe. The -x is what echoes each line, which is where the plus signs come from, and the -e is what stops the run at the first command that fails. The username on the first line is their own, not yours, and the script number is different every run.",
  },
  {
    /*
      THE WHOLE FLOW, IN ONE FIGURE, AND IT TOOK A LAB TO GET HERE.

      Asked for on 2026-09-09: *"I want a clear illustration of arriving of job
      into the build queue, build, executor, all these must be represented,
      consider actual flow."*

      WHAT THIS REPLACED, AND WHY THAT WAS NOT ENOUGH. The first pass drew job
      versus build with `FanOut`, and argued that queue and executor should stay
      off the figure because Jenkins already draws them on the dashboard. That
      was half an answer: it covered one of the two claims in the vocabulary and
      left the other to a table. The four words are one flow to a learner, and a
      figure that stops at "one job, many runs" makes them assemble the rest.

      THE RESEARCH, PER CONTENT RULE 27. Queue-and-servers is the conventional
      form, and it is what queueing diagrams have drawn for a century: one
      waiting line, N servers, items leaving the line as a server frees. Jenkins'
      own docs model capacity as EXECUTOR SLOTS, where "a machine either has a
      free slot or it doesn't", call agents "the workers that perform
      operations", and gloss the pair as being "as different as a todo list is
      from the person actually doing the tasks". Jenkins also draws it itself, as
      the dashboard's `Build Queue` and `Build Executor Status` panels, which is
      why this figure keeps those two titles verbatim: rule 27's first test is
      that a picture the room meets again elsewhere beats a better one they see
      once, and `c4-dashboard-tour` two slides back is a real capture of them.

      NOTHING IN THE KIT DREW IT, so it became a lab: `slide-kit/queue-lab`,
      three candidates against one contract. `TillRow` won because it is the only
      one that DRAWS THE MECHANISM: a connector leaves the front of the line,
      runs under both desks and rises into each, so "either desk can take the
      next ticket" is geometry rather than a caption. `QueueBelt` lost on a
      detail that would have shipped a defect, its tickets running right to left
      inside the queue so a reader meets #4 before #3; `DashboardPanels` lost
      because its two panels have no connector between them, which is the exact
      thing this slide was asked to show. The lab's `CLAUDE.md` holds the full
      record.

      RULE 25 IS SATISFIED BY THE BUILD, not by the frame. Four words on one
      slide is only legal because the figure arrives in beats: the job, then the
      trigger, then the line, then the two desks, then the fan between them.

      WHERE IT SITS, AND IT MOVED. Asked for on 2026-09-09: *"the flow of job run
      should be after successfully executing the hello-jenkins"*. It used to
      stand before the vocabulary table and before the room had run anything, so
      every number on it was hypothetical and #1 finished green was a promise.
      It now stands AFTER `c4-console-output`, which means the room has just
      made #1, watched it go green and read its log. So the figure explains a run
      they own rather than one they have been told about, and the only part still
      hypothetical is the pile-up, which is exactly the part they cannot produce
      with one click.

      AND THE VOCABULARY NOW FOLLOWS IT, asked for on 2026-09-09: "slide 48
      should be shifted after the illustration", and "49 as well".

      That reverses the argument written here a pass earlier, which was that
      `c4-vocabulary` and `c4-the-trap` had to come first because a room cannot
      create a JOB and read a BUILD number without those two words. What is
      actually true is that they cannot create a job without the WORD, and the
      hands-on hands it to them: `c4-smoke-test` glosses it in place, "Freestyle
      means a job you set up by clicking". So the deck now does what it does in
      concept 2, where `c2-a-robot-that-watches` draws the picture and
      `c2-our-pipeline` names it a click later: do the thing, see the thing, then
      take the words.

      The order is therefore picture, then table, then trap. The table is the
      reference form and the thing a learner photographs, so it lands last, when
      every word in it points at something the room has already watched happen.
      `c4-the-trap` stays welded to the table because its lead reads "one of
      those four words", which is a sentence that cannot precede the four.
    */
    id: "c4-the-whole-flow",
    section: C4,
    label: "From Click to Run",
    element: (
      <ContentSlide
        kicker={C4}
        title="From Click to Run"
        lead="One click makes a run, the run waits in line, and a free slot takes it"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[1120px]">
          <TillRow
            job={{
              label: "hello-jenkins",
              caption: "the job you saved",
              icon: "settings",
            }}
            trigger="You click Build Now"
            queue={[
              { id: "q3", label: "#3", note: "next in line" },
              { id: "q4", label: "#4", note: "waiting behind #3" },
            ]}
            executors={[
              {
                id: "e1",
                label: "Executor 1",
                running: { label: "#2", note: "running now" },
              },
              { id: "e2", label: "Executor 2" },
            ]}
            done={[{ label: "#1", verdict: "success", note: "finished" }]}
            caption="Whichever slot frees up first takes the front of the line"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      "Start from their own screen: they have one run, #1, and it is green. Then walk the figure in the order it builds. You click, and that click does not run anything: it creates a run and puts it in the line. The line is the Build Queue. Two slots exist because Jenkins ships with two, and the free one is why #3 goes next rather than waiting all day. Then say the sentence the caption makes: the queue is a todo list, an executor is the one doing the task. The numbers tie it together, #1 done, #2 running, #3 and #4 still waiting.",
  },
  {
    id: "c4-vocabulary",
    section: C4,
    label: "Four Words",
    element: (
      <ContentSlide
        kicker={C4}
        title="Four Words"
        lead="Learn these four and the whole dashboard makes sense"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: "Word", weight: 1 },
            { label: "What it means", weight: 2.2 },
          ]}
          rows={[
            [
              "Job",
              'One automated task you have set up, for example "the nxttrendz pipeline"',
            ],
            [
              "Build",
              "One run of a job. They are numbered as you go: #1, #2, #3",
            ],
            [
              "Build Queue",
              "Runs that are waiting because no worker is free right now",
            ],
            [
              "Executor",
              "A worker slot. Jenkins starts with two, so two runs can happen at once",
            ],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      "Four definitions, no verdicts, so a table and not a status list. Read each one aloud once.",
  },
  {
    id: "c4-the-trap",
    section: C4,
    label: "Build Means a Run",
    element: (
      <ContentNoteSlide
        kicker={C4}
        title="Build Means a Run"
        lead="One of those four words already means something else to you, and that is the trap"
        lesson={SESSION}
        note={{
          kind: "warning",
          title: "Careful",
          body: (
            <>
              In Jenkins, <strong>build</strong> means one whole run of a job,
              which may include testing, pushing and deploying. It does not mean{" "}
              <Code>docker build</Code>.
            </>
          ),
        }}
      >
        {/* THE ONE POINT BECAME THE COMPARISON IT WAS DESCRIBING.

            A single bullet beside a callout left the right half of the slide
            empty, and the bullet was not the slide's claim anyway. The claim is
            that one word means two different things in two different places,
            which is a same-shape comparison and nothing else. The run numbers
            survive inside the Jenkins row, where they are a property of the
            thing being defined rather than a separate idea. */}
        <DataTable
          columns={[
            { label: "Where you see it", weight: 1 },
            { label: "What build means there", weight: 1.6 },
          ]}
          rows={[
            [
              <Code key="a">docker build</Code>,
              "One image, made from a Dockerfile",
            ],
            [
              "A build in Jenkins",
              "One whole run of a job, numbered #1, #2, #3",
            ],
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      "A word they already own, redefined. Name the trap explicitly, because nobody notices a word they think they know. Then the row they will need in two sessions: those run numbers are where automatic image tags come from once a pipeline builds the image.",
  },
  {
    /*
      IT WAS A NOTE ON AN OTHERWISE EMPTY FRAME, AND THAT READ AS MISSING.

      Asked for on 2026-09-09 about this slide and about `c3-screens-drift`:
      the frame "is feeling blank or content is missing". Both were built as
      deliberate one-sentence frames, which is a device this deck uses, and the
      device was wrong here: a lone `tip` callout in the middle of a 1280x720
      stage does not read as emphasis, it reads as a slide somebody did not
      finish.

      What it gains is the thing the sentence was standing in for. Every run they
      have seen today was green, so nobody has needed the console yet. The three
      points are what to do the first time one is RED, and they are all readable
      off the capture on `c4-console-output` two slides back: read from the
      bottom, the verdict is the last line, and the `+` lines are the commands,
      so the failure is under the last one. The callout stays, because the
      comparison to a command they already own is the sentence worth
      remembering.
    */
    id: "c4-where-you-will-live",
    section: C4,
    label: "Where You Will Live",
    element: (
      <ContentNoteSlide
        kicker={C4}
        title="Where You Will Live"
        lead="Every run today was green. Here is what to do with the first red one"
        lesson={SESSION}
        points={[
          {
            text: "Open the run from Build History, then Console Output",
            sub: "Same two clicks whether it passed or failed",
            icon: "book",
          },
          {
            text: "Read it from the bottom",
            sub: "The verdict is always the last line, so start there and work upwards",
            icon: "target",
          },
          {
            text: (
              <>
                {"The failure sits under the last "}
                <Code>+</Code>
                {" line"}
              </>
            ),
            sub: "Each plus is a command, so the last one is the command that broke",
            icon: "warning",
          },
        ]}
        note={{
          kind: "tip",
          title: "Remember",
          body: (
            <>
              Console Output is where you will spend your time when a pipeline
              fails. It is this session's version of{" "}
              <Code>docker compose logs</Code>.
            </>
          ),
        }}
      />
    ),
    notes:
      "Nobody has needed this yet, because every run today went green, so say that out loud: this is the slide they come back to. Read the three in order and point at the console capture from two slides ago as you do. Then the callout, which is the one sentence to remember, because docker compose logs is a command they already reach for without thinking.",
  },
  {
    id: "c4-freestyle-vs-pipeline",
    section: C4,
    label: "A Fork in the Road",
    element: (
      <ContentNoteSlide
        kicker={C4}
        title="A Fork in the Road"
        lead="That job was set up by clicking boxes, and the Makefile session taught us why that is a problem"
        lesson={SESSION}
        /* The note goes ABOVE the table. Underneath it, the four rows pushed it to
           y=611, which `align-check.mjs` reports as sitting under the bottom-left
           control cluster. It also reads better here: the principle first, then
           the table that applies it. */
        noteFirst
        note={{
          kind: "note",
          body: "How you operate a project belongs in a versioned file, not in tick boxes on a web page.",
        }}
      >
        <DataTable
          /* `compact` because the kit sync that moved `lead` out of `SlideHeader`
             into `SlideLead` also grew `DataTable`'s row padding, and the two
             together pushed the last row's text to y=662 — 2px under the bottom-
             left control bar, which `align-check.mjs` reports as a CHROME
             collision. `noteFirst` above had already bought this slide the room
             it needed once; the tighter row padding buys it back without
             touching a word of the table. */
          compact
          columns={[
            { label: "", weight: 1.2 },
            { label: "Freestyle job", weight: 1.2 },
            { label: "Pipeline job", weight: 1.8 },
          ]}
          rows={[
            [
              "Set up by",
              "Clicking in the web page",
              "A Jenkinsfile in your repository",
            ],
            ["Reviewed and undone", "No", "Yes, like any other code"],
            [
              "Survives losing Jenkins",
              "No",
              "Yes, the file is in the repository",
            ],
            [
              "Used in this course",
              "Today's smoke test only",
              "Everything real, from here on",
            ],
          ]}
          highlight={[4]}
        />
      </ContentNoteSlide>
    ),
    notes:
      "The comparison that sets up the next two sessions, closed with a verdict the room already believes because session 5 taught it.",
  },
  {
    /*
      DOES ANY OF THIS SURVIVE THE CONTAINER GOING AWAY?

      Asked for on 2026-09-09: "at the end we must explain what happens when the
      Jenkins run is stopped and rerun, will the data persist", and "the slide on
      the Jenkins image data persistence must be added after slide 57".

      It is the question the room WILL ask, because they have just spent a
      session setting up an account, installing plugins and building a job inside
      a container, and every container they have met so far was disposable. The
      answer was already asserted on `c3-run-in-docker`, whose flag list says the
      volume means "every setting and every past run survives a restart", but
      asserted is not shown, and this is the one claim in the session a learner
      has real reason to doubt.

      RUN FOR REAL, NOT WRITTEN. The transcript below is a real run on a real
      instance: `hello-jenkins` and one user existed, the container was stopped
      and REMOVED, a new one was started against the same volume, and both were
      still there. `initialAdminPassword` was gone, which is the strongest single
      piece of evidence on the slide, because its absence is Jenkins saying it
      already remembers being set up.

      STOPPED IS NOT THE INTERESTING CASE, so the slide does not spend a line on
      it. `docker stop` keeps the container itself, so of course nothing is lost.
      Removing the container is the case that looks frightening and is not, and
      it is also the case they will actually hit, because that is what changing a
      flag on `docker run` requires.

      THE ONE COMMAND THAT DOES DESTROY IT is named, for the same reason session 6
      names what a public push exposes: a learner who does not know where the
      edge is cannot avoid it. `docker volume rm jenkins_home` is the line that
      wipes the setup, and it had to be run twice today to re-capture the wizard
      screens, which is the honest reason it is on the slide.
    */
    id: "c4-does-it-survive",
    section: C4,
    label: "Does It Survive?",
    element: (
      <ContentNoteSlide
        kicker={C4}
        title="Does It Survive?"
        lead="Remove the container, start a new one, and everything is still there"
        lesson={SESSION}
        note={{
          kind: "warning",
          title: "The one command that does wipe it",
          body: "docker volume rm jenkins_home deletes the account, the plugins and every build",
        }}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <Terminal
            path={ROOT}
            lines={[
              /* The two echoed container names that `stop` and `rm` print are
                 dropped: they repeat the name and cost the callout its room. */
              { text: "docker stop jenkins", kind: "cmd" },
              { text: "docker rm jenkins", kind: "cmd" },
              {
                text: "docker run -d --name jenkins -p 8080:8080 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts",
                kind: "cmd",
              },
              {
                text: "docker exec jenkins ls /var/jenkins_home/jobs",
                kind: "cmd",
              },
              { text: "hello-jenkins", kind: "ok" },
            ]}
            caption="The container was removed, not just stopped, and the job came back with it"
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      "Ask the question before you answer it: we built all of this inside a container, so what happens when the container goes? Then walk the transcript. Removed, not stopped, which is the case they will hit whenever they want to change a flag. The job is still there because it never lived in the container: it lives in the volume, at /var/jenkins_home, exactly as pgdata holds the database. One more proof if they want it: the one-time unlock password is gone from the new container, which is Jenkins saying it already remembers being set up. Then read the warning as a rule, not a caution.",
  },

  /* ---------------------------------------------------------------- */
  /* Closing frame (53 to 56)                                          */
  /* ---------------------------------------------------------------- */
  {
    id: "quiz-final",
    section: "Closing",
    label: "Quiz Time!",
    element: (
      /* NO `subtitle`. Content rule 28: the quiz frame carries "Quiz Time!" and
         nothing else. The questions come from the quiz tool, so a subtitle here
         previews them on the slide and answers some of them.

         A `{ / * * / }` container is legal only in JSX CHILDREN position; in an
         expression position like this one it is a second expression and a syntax
         error, which is what the first attempt at this comment produced. */
      <QuizTimeSlide lesson={SESSION} />
    ),
    notes:
      "The last chance to find out what the room actually believes, while they are still in it. Hard rule 18 puts this immediately before the takeaways for exactly that reason.",
  },
  {
    id: "takeaways",
    section: "Closing",
    label: "Key Takeaways",
    element: (
      /* The four agenda concepts, verbatim from `deckShared`. A fifth item here
         would be an idea the agenda never promised. Hard rule 20. */
      <KeyTakeawaysSlide
        title="Key Takeaways"
        lesson={SESSION}
        points={[
          { text: C1, icon: "globe" },
          { text: C2, icon: "route" },
          { text: C3, icon: "settings" },
          { text: C4, icon: "devices" },
        ]}
      />
    ),
    notes:
      "The agenda, closed. Read the four names back in the order they were promised, and stop.",
  },
  {
    id: "next-session",
    section: "Closing",
    label: "Next session",
    element: (
      /* `kicker`, no `index`. Without the kicker this frame is an unlabelled navy
         title, which is what a section divider looks like, and the room reads it
         as a fifth concept. Session 6's R9. */
      <SectionBreakerSlide
        kicker="Next session"
        title={NEXT_UP}
        lesson={SESSION}
      />
    ),
    notes:
      "Say the reason, do not put it on the slide: Jenkins is alive and completely powerless. It cannot reach your GitHub repository, it has no Docker Hub credentials, and it cannot run docker at all. Next session wires in all three.",
  },
  {
    id: "thank-you",
    section: "Closing",
    label: "Thank you",
    element: <ThankYouSlide lesson={SESSION} />,
    notes: "Thank you.",
  },
];

export const jenkinsCicdMeta: DeckMeta = {
  title: SESSION,
  course: COURSE,
  lesson: SESSION,
};
