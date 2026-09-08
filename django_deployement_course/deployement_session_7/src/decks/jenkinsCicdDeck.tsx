import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  BrandSlide,
  WelcomeSlide,
  AgendaSlide,
  SectionBreakerSlide,
  ContentSlide,
  ContentNoteSlide,
  ProceduralStepsSlide,
  QuestionSlide,
  QuizTimeSlide,
  KeyTakeawaysSlide,
  ThankYouSlide,
} from '@/slides'
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
} from '@/ui'
import { SESSION, COURSE, C1, C2, C3, C4, ROOT, Tech, Co, Code, PIPELINE, GATE, RITUAL, CHAIN } from './deckShared'

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

const NEXT_UP = 'Setting Up Jenkins for Docker Builds'

export const jenkinsCicdDeck: SlideDef[] = [
  /* ---------------------------------------------------------------- */
  /* Front frame (1 to 5)                                              */
  /* ---------------------------------------------------------------- */
  {
    id: 'brand',
    section: 'Opening',
    label: 'Brand',
    element: <BrandSlide greeting="Welcome!" lesson={SESSION} />,
    notes: 'Welcome to the session.',
  },
  {
    id: 'welcome',
    section: 'Opening',
    label: 'Welcome',
    /* `minimal` is the shipping form (hard rule 21). The kicker "Welcome to
       today's session" is hardcoded inside the component, which is why the brand
       slide above says "Welcome!" and not the same sentence twice. */
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
    notes: 'Read the session name out loud and stop. The recap is the next frame.',
  },
  {
    id: 'recap-docker-hub',
    section: 'Opening',
    label: 'Where we Left Off',
    element: (
      <ContentNoteSlide
        kicker="Where we Left Off"
        title="Where we Left Off"
        lead="Last session the image got a home that any machine can reach"
        lesson={SESSION}
        note={{
          kind: 'note',
          title: 'Remember',
          body: (
            <>
              An image carries the code, the runtime and the dependencies. It never carries
              configuration, so <Code>.env</Code> stays out and Compose supplies it at run time.
            </>
          ),
        }}
      >
        <DataTable
          columns={[{ label: 'What we did', weight: 1.1 }, { label: 'Command', weight: 1.4 }]}
          rows={[
            ['Gave the image a full name', <Code key="a">docker tag ravi123/nxttrendz-backend:v7</Code>],
            ['Signed in to the registry', <Code key="b">docker login</Code>],
            ['Sent it to Docker Hub', <Code key="c">docker push ravi123/nxttrendz-backend:v7</Code>],
            ['Wrapped all of it in one word', <Code key="d">make push VERSION=v7</Code>],
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Their own last session, in four rows. Then name the gap today closes, out loud and not on the slide: the image has a home, and a human still types every one of those commands.',
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        title="Today's Agenda"
        lesson={SESSION}
        items={[
          { title: C1, sub: 'Give your code a home on the internet' },
          { title: C2, sub: 'Practice that automates the boring part' },
          { title: C3, sub: 'Program that does the work for you' },
          { title: C4, sub: 'Job, build, queue and executor' },
        ]}
      />
    ),
    notes: 'Four concepts. Read them and move on; each one gets its own divider.',
  },
  {
    id: 'setup',
    section: 'Opening',
    label: 'Initial Setup',
    element: (
      <ContentSlide
        kicker="Initial Setup"
        title="Initial Setup"
        lead="Run these terminal commands step by step :"
        lesson={SESSION}
        points={[
          { text: 'Docker Desktop is open and running', icon: 'devices' },
          { text: 'You are signed in to Docker Hub from last session', icon: 'lock' },
          {
            text: 'A free GitHub account, created BEFORE the session',
            sub: 'It needs an email confirmation, so making it now costs the room ten minutes',
            icon: 'globe',
          },
        ]}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: 'docker --version', kind: 'cmd' },
            { text: 'Docker version 27.3.1, build ce12230', kind: 'out' },
            { text: 'make build', kind: 'cmd' },
            { text: 'Successfully tagged nxttrendz-backend:latest', kind: 'ok' },
          ]}
          caption="Project root. Every command in this session runs from here"
        />
      </ContentSlide>
    ),
    notes:
      'The GitHub account is the one that bites. It needs an email confirmation, and a room discovering that at slide 14 loses ten minutes.',
  },

  /* ---------------------------------------------------------------- */
  /* Concept 1: Publishing the Code (6 to 20)                          */
  /* ---------------------------------------------------------------- */
  {
    id: 'c1-divider',
    section: C1,
    label: '01 Divider',
    element: (
      <SectionBreakerSlide index={1} title={C1} subtitle="And the last manual step" lesson={SESSION} />
    ),
    notes: 'Hand over verbally: last session the image got a home. Where does the code live?',
  },
  {
    id: 'c1-where-the-code-lives',
    section: C1,
    label: 'Where the Code Lives',
    element: (
      <ContentSlide
        kicker={C1}
        title="Where the Code Lives"
        lead="Last session gave one of these two a home. The other still has none"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'What', weight: 0.7 },
            { label: 'Where it lives', weight: 1.5 },
            { label: 'Who can get it', weight: 1 },
          ]}
          rows={[
            [
              <Tech key="a" name="docker">Your image</Tech>,
              <Code key="b">hub.docker.com/r/ravi123/nxttrendz-backend</Code>,
              'Any machine, anywhere',
            ],
            [
              <Tech key="c" name="git">Your code</Tech>,
              <Code key="d">C:\nxttrendz\.git</Code>,
              'Only this laptop',
            ],
          ]}
          highlight={[2]}
        />
      </ContentSlide>
    ),
    notes:
      'The two rows have identical columns on purpose. The symmetry is the argument: one of these travelled last session and the other one cannot.',
  },
  {
    id: 'c1-committed-not-published',
    section: C1,
    label: 'Committed, Not Published',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="Committed, Not Published"
        lead="Your project has had a .git folder since the integration course, and that is not the same as being online"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'note',
          title: 'Remember',
          body: (
            <>
              Automation server we meet today copies your code <strong>over the network</strong>.
              It cannot copy a folder that only exists on your laptop.
            </>
          ),
        }}
        points={[
          {
            text: 'Committed means saved into your own history',
            sub: 'Every git commit you have ever run wrote to that folder and nowhere else',
            icon: 'folder',
          },
          {
            text: 'Published means it has a web address',
            sub: 'Something like github.com/ravi123/nxttrendz, that another computer can open',
            icon: 'globe',
          },
        ]}
      />
    ),
    notes:
      'This distinction is the whole prerequisite. Say it plainly: committed is a save, published is an address.',
  },
  {
    id: 'c1-git-status',
    section: C1,
    label: 'git status',
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
            { text: 'git status', kind: 'cmd' },
            { text: 'On branch main', kind: 'out' },
            { text: 'Changes not staged for commit:', kind: 'out' },
            { text: '        modified:   backend/settings.py', kind: 'out' },
          ]}
          caption="Branch and file names mean a repository already exists here"
        />
        <StatusList
          immediate
          items={[
            {
              status: 'success',
              text: 'You see a branch name and file names',
              detail: 'A repository exists. Skip ahead to the .env check',
              label: 'Ready',
            },
            {
              status: 'warning',
              text: 'fatal: not a git repository',
              code: true,
              detail: 'There is no repository yet. Run git init, then git branch -M main',
              label: 'Two commands',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Two readings, and which one the room sees decides their next command. Wait here until everyone has run it.',
  },
  {
    id: 'c1-env-check',
    section: C1,
    label: 'Before the First Push',
    element: (
      <ContentSlide
        kicker={C1}
        title="Before the First Push"
        lead="This check comes before the commit, not after it"
        lesson={SESSION}
        points={[
          {
            text: '.env must NOT appear in that list',
            sub: 'It holds your SECRET_KEY, and a public repository is readable by everyone',
            icon: 'shield',
          },
          {
            text: 'If it does appear, the .gitignore line from session 4 is missing',
            sub: 'Add the line below to .gitignore, then run git status --short again',
            icon: 'pencil',
          },
        ]}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: 'git status --short', kind: 'cmd' },
            { text: ' M backend/settings.py', kind: 'out' },
            { text: '?? docker-compose.yml', kind: 'out' },
          ]}
          caption="Short form: one line per file. No .env line here, which is correct"
        />
        <CodeBlock code=".env" filename=".gitignore" language="text" showLineNumbers={false} />
      </ContentSlide>
    ),
    notes:
      'Run it and read the list out loud. The absence of .env is the thing being checked, and an absence is easy to skim past.',
  },
  {
    id: 'c1-irreversible',
    section: C1,
    label: 'Why This Order',
    element: (
      <ContentSlide
        kicker={C1}
        title="Why This Order"
        lead="First push is the one step in this session you cannot take back"
        lesson={SESSION}
      >
        <Callout kind="warning" title="Two things that surprise people" asStep={false}>
          Anyone can read a public repository the moment something lands in it, including
          people you never told about it. And deleting a file later does not remove it:
          Git keeps every version of everything, so the secret stays in the history.
        </Callout>
      </ContentSlide>
    ),
    notes:
      'One callout, no bullets. This is the reason the previous slide is not optional, and it deserves a frame with nothing competing on it.',
  },
  {
    id: 'c1-already-committed',
    section: C1,
    label: 'If It Was Committed',
    element: (
      <ContentSlide
        kicker={C1}
        title="If It Was Committed"
        lead="Adding .env to .gitignore does not help, because Git keeps tracking files it is already tracking"
        lesson={SESSION}
        points={[
          {
            text: 'Stop tracking it, then commit that change',
            sub: 'File stays on your disk. Only Git forgets about it',
            icon: 'unlink',
          },
          {
            text: 'Then treat that SECRET_KEY as leaked',
            sub: 'Generate a new one, exactly as you would rotate a leaked Docker Hub token',
            icon: 'key',
          },
        ]}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: 'git rm --cached .env', kind: 'cmd' },
            { text: "rm '.env'", kind: 'out' },
            { text: 'git commit -m "Stop tracking .env"', kind: 'cmd' },
            { text: ' 1 file changed, 3 deletions(-)', kind: 'ok' },
          ]}
          caption="--cached means remove it from Git, not from your folder"
          fontSize={13}
        />
      </ContentSlide>
    ),
    notes:
      'A minority of the room needs this, and that minority has a leaked secret. Give it the full thirty seconds.',
  },
  {
    id: 'c1-commit',
    section: C1,
    label: 'Commit Everything',
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
            { text: 'git add .', kind: 'cmd' },
            { text: 'git commit -m "Add Docker, Compose and Makefile setup"', kind: 'cmd' },
            { text: ' 12 files changed, 348 insertions(+)', kind: 'ok' },
            { text: ' create mode 100644 docker-compose.yml', kind: 'out' },
            { text: ' create mode 100644 Makefile', kind: 'out' },
          ]}
          caption="git add . stages every changed file. The dot means this folder and everything under it"
        />
      </ContentSlide>
    ),
    notes: 'Two commands. Point at the file count and note that .env is not among them.',
  },
  {
    id: 'c1-empty-repository',
    section: C1,
    label: 'An Empty Repository',
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
              status: 'error',
              text: 'Add a README file',
              detail: 'Leave it unticked. It creates a commit inside the new repository',
              label: 'Untick',
            },
            {
              status: 'error',
              text: 'Add .gitignore',
              detail: 'Leave it unticked. You already have one, written in session 4',
              label: 'Untick',
            },
            {
              status: 'error',
              text: 'Choose a license',
              detail: 'Leave it unticked, for the same reason as the other two',
              label: 'Untick',
            },
            {
              status: 'success',
              text: 'A genuinely empty repository',
              detail: 'Nothing inside it, so nothing can clash with the history on your laptop',
              label: 'What you want',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Say why, once: each of those three tick boxes puts a commit in the remote, and your laptop has a different history, so the two collide the moment you push.',
  },
  {
    id: 'c1-connect-and-push',
    section: C1,
    label: 'Connect and Push',
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
            { text: 'git remote add origin https://github.com/ravi123/nxttrendz.git', kind: 'cmd' },
            { text: 'git push -u origin main', kind: 'cmd' },
            { text: 'Enumerating objects: 47, done.', kind: 'out' },
            { text: 'Writing objects: 100% (47/47), 12.31 KiB | 2.05 MiB/s, done.', kind: 'out' },
            { text: ' * [new branch]      main -> main', kind: 'ok' },
            { text: "branch 'main' set up to track 'origin/main'.", kind: 'ok' },
          ]}
          caption="origin is just a nickname for that long address, so you never type it twice"
        />
      </ContentSlide>
    ),
    notes:
      'Read the last line out loud and leave it on screen. The next slide is about what it means.',
  },
  {
    id: 'c1-same-two-steps',
    section: C1,
    label: 'You Have Done This',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="You Have Done This"
        lead="Those two commands are last session's two commands wearing different clothes"
        lesson={SESSION}
        note={{
          kind: 'tip',
          title: 'What the -u bought you',
          body: (
            <>
              It recorded <Code>origin/main</Code> as this branch's usual destination, so from now on
              the whole command is <Code>git push</Code>.
            </>
          ),
        }}
      >
        <DataTable
          columns={[
            { label: 'Step', weight: 1 },
            { label: 'Images, last session', weight: 1.4 },
            { label: 'Code, today', weight: 1.4 },
          ]}
          rows={[
            [
              'Name where it goes',
              <Code key="a">docker tag ravi123/...</Code>,
              <Code key="b">git remote add origin https://...</Code>,
            ],
            ['Send it', <Code key="c">docker push ravi123/...</Code>, <Code key="d">git push -u origin main</Code>],
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'The recognition is the teaching. Both are pushes to a central service, so both have the same two steps.',
  },
  {
    id: 'c1-verify',
    section: C1,
    label: 'Check the Page',
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
              status: 'success',
              text: 'backend/ and frontend/ are both listed',
              detail: 'Along with docker-compose.yml, Makefile and .gitignore, all on one commit',
              label: 'Present',
            },
            {
              status: 'success',
              text: '.env is nowhere on the page',
              detail: 'Make this the check you always run after a first push',
              label: 'Absent',
            },
          ]}
        />
        <Callout kind="note" title="Same job, done by two files" asStep={false}>
          <Code>.gitignore</Code> keeps secrets out of Git. <Code>.dockerignore</Code> keeps them out
          of images. You wrote both, in session 4 and session 2.
        </Callout>
      </ContentSlide>
    ),
    notes:
      'Session 6 said anything pushed to a public repository is visible to the whole world. It was about Docker Hub, and it is equally true here.',
  },
  {
    id: 'c1-day-in-the-life',
    section: C1,
    label: 'Shipping a Change',
    element: (
      <ContentSlide
        kicker={C1}
        title="Shipping a Change"
        lead="Your code is online. So what does it cost, today, to ship one small change?"
        lesson={SESSION}
      >
        <StepLedger
          {...RITUAL}
          caption="Steps 1 and 2 are your job. Steps 3 to 6 are the same commands, every single time"
        />
      </ContentSlide>
    ),
    notes:
      'Walk down it once. Then say the split out loud: two of these are the work, four are a routine you repeat without thinking.',
  },
  {
    id: 'c1-what-goes-wrong',
    section: C1,
    label: 'Human Ritual Fails',
    element: (
      <ContentSlide
        kicker={C1}
        title="Doing It By Hand Fails"
        lead="Not because anyone is careless. These four happen to everybody"
        lesson={SESSION}
      >
        <StatusList
          items={[
            {
              status: 'warning',
              text: 'Forgetting',
              detail: 'You pushed the code and forgot the tests, so broken code reaches the team',
            },
            {
              status: 'warning',
              text: 'Skipping',
              detail: '"It is a tiny change, no need to test it." Famous last words in software',
            },
            {
              status: 'warning',
              text: 'Inconsistency',
              detail: 'Tests passed on YOUR machine, and were never run anywhere else',
            },
            {
              status: 'warning',
              text: 'Delay',
              detail: 'Person who deploys is in a meeting, so the release waits for them',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Close on the observation that sets up the question: steps 3 to 6 need no judgment at all. They are a fixed list with a clear pass or fail at each step.',
  },
  {
    id: 'c1-the-question',
    section: C1,
    label: '(question)',
    element: (
      <QuestionSlide
        kicker={C1}
        question="Could a machine watch our repository, and every time code is pushed, run the tests, build the image and push it, the same way every time, without being asked?"
        qualifier="Same four commands you run by hand today"
        lesson={SESSION}
      />
    ),
    notes:
      'Let them answer out loud before you move. The answer is yes, it has a name, and the name is the next concept.',
  },

  /* ---------------------------------------------------------------- */
  /* Concept 2: What CI/CD Is (21 to 33)                               */
  /* ---------------------------------------------------------------- */
  {
    id: 'c2-divider',
    section: C2,
    label: '02 Divider',
    element: (
      <SectionBreakerSlide index={2} title={C2} subtitle="Practice, before the tool" lesson={SESSION} />
    ),
    notes: 'The practice first. Naming Jenkins now would make CI/CD sound like a Jenkins feature.',
  },
  {
    id: 'c2-ci',
    section: C2,
    label: 'Continuous Integration',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="Continuous Integration"
        lead="CI/CD is short for Continuous Integration and Continuous Delivery. Here is the first half"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'info',
          title: 'Continuous Integration',
          body: 'Every time any developer pushes code, it is automatically combined with the team\'s code, built, and tested on a shared server that belongs to nobody in particular.',
        }}
        points={[
          {
            text: 'Integrating means combining everyone\'s changes',
            sub: 'Yours, and every teammate\'s, into one version of the project',
            icon: 'link',
          },
          {
            text: 'Continuously means on every single push',
            sub: 'Instead of the old way: working apart for weeks, then a painful week of combining',
            icon: 'route',
          },
        ]}
      />
    ),
    notes:
      'Expand the acronym once, here, then use the letters. Then unpack the two words in the name: integrating, and continuously.',
  },
  {
    id: 'c2-ci-promise',
    section: C2,
    label: 'Minutes, Not Days',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="Minutes, Not Days"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'Remember',
          body: 'Broken code is found minutes after it is written, by a machine, instead of days later by an annoyed teammate.',
        }}
      />
    ),
    notes: 'One line, one frame. This is the sentence the room should leave with.',
  },
  {
    id: 'c2-cd-delivery',
    section: C2,
    label: 'Continuous Delivery',
    element: (
      <ContentSlide
        kicker={C2}
        title="Continuous Delivery"
        lead="Second half of CI/CD, and the one this course builds up to"
        lesson={SESSION}
        points={[
          {
            text: 'Every change that passes the tests is packaged automatically',
            sub: 'For this project that means the image is built and pushed to Docker Hub',
            icon: 'file',
          },
          {
            text: 'It is then ready to go live, and it waits',
            sub: 'A person presses the final deploy button when they decide the time is right',
            icon: 'play',
          },
        ]}
      />
    ),
    notes: 'One of the two CDs, alone on the frame. The room conflates them, so they are split.',
  },
  {
    id: 'c2-cd-deployment',
    section: C2,
    label: 'Continuous Deployment',
    element: (
      <ContentSlide
        kicker={C2}
        title="Continuous Deployment"
        lead="Same words, different last one, and one button fewer"
        lesson={SESSION}
        points={[
          {
            text: 'Even the deploy button is automated',
            sub: 'Nobody presses anything. Passing the tests IS the decision to go live',
            icon: 'bolt',
          },
          {
            text: 'Every passing change reaches the live server on its own',
            sub: 'Last human action in the whole chain is your git push',
            icon: 'rocket',
          },
        ]}
      />
    ),
    notes:
      'The other CD. The difference between the two is exactly one button, and saying it that plainly is what makes it stick.',
  },
  {
    id: 'c2-three-terms',
    section: C2,
    label: 'The Three Terms',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="Three Terms"
        lead="Same chain of steps, automated a little further each time"
        lesson={SESSION}
        note={{
          kind: 'tip',
          title: 'Where this course stops',
          body: 'We build up to Continuous Delivery. Continuous Deployment is completed in the AWS sessions at the end of the course.',
        }}
      >
        <DataTable
          columns={[
            { label: 'Term', weight: 1.1 },
            { label: 'Automated up to', weight: 1.6 },
            { label: 'What the human still does', weight: 1.3 },
          ]}
          rows={[
            ['Continuous Integration', 'Combine, build, test', 'Writes the code and pushes it'],
            ['Continuous Delivery', 'and packages it, ready to go', 'Presses deploy'],
            ['Continuous Deployment', 'and puts it on the live server', 'Nothing, after git push'],
          ]}
          highlight={[2]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'The reference form of the last three slides, and the one a learner photographs. State the verdict: we go as far as Delivery.',
  },
  {
    id: 'c2-assembly-line',
    section: C2,
    label: 'Picture a Factory',
    element: (
      <ContentSlide
        kicker={C2}
        title="Picture a Factory"
        lead="Two ways to build a car, and only one of them gives you the same car every time"
        lesson={SESSION}
        points={[
          {
            text: 'A hand-built car depends on who built it that day',
            sub: 'A different craftsman, in a different mood, gives you a different car',
            icon: 'pencil',
          },
          {
            text: 'An assembly line has fixed stations in a fixed order',
            sub: 'Every car passes the same checks, so every car comes out the same',
            icon: 'route',
          },
          {
            text: 'A car that fails a station is pulled off the line at once',
            sub: 'It never reaches the showroom, because it never gets to the next station',
            icon: 'cross',
          },
        ]}
      />
    ),
    notes:
      'Deliberately no picture. There is no assembly-line asset in the library and a near-miss illustration would contradict the slide. The scene is three sentences.',
  },
  {
    id: 'c2-assembly-mapping',
    section: C2,
    label: 'The Mapping',
    element: (
      <ContentSlide
        kicker={C2}
        title="Mapping"
        lead="Every part of that factory has a name in software"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'In the factory', weight: 1.3 },
            { label: 'In CI/CD', weight: 1.5 },
          ]}
          rows={[
            ['Raw materials arrive', 'A developer pushes code'],
            ['Fixed stations, in a fixed order', 'Pipeline stages: test, then build, then push'],
            ['A failed part is pulled off the line', 'A failed stage stops the run, and the team is told'],
            ['Identical cars come out', 'Identical, tested releases come out'],
            ['Line runs all day, every day', 'Pipeline runs on every push'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Cash the analogy out here and then drop it. An analogy left unmapped is worse than none, and one kept alive too long starts to mislead.',
  },
  {
    id: 'c2-who-works-this-way',
    section: C2,
    label: 'Everyone Shipping',
    element: (
      <ContentSlide
        kicker={C2}
        title="Everyone Shipping"
        lead="This is not an advanced technique. It is how software is normally made, and this is how often the biggest teams put new code in front of users"
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
        <Callout kind="note" title="Why this matters for your next interview" asStep={false}>
          None of that is possible with a person typing <Code>make build</Code>. It is why CI/CD
          appears in nearly every backend and DevOps job description you will read.
        </Callout>
      </ContentSlide>
    ),
    notes: 'Named products they already use. Keep it to fifteen seconds and land the job-description line.',
  },
  {
    id: 'c2-our-pipeline',
    section: C2,
    label: 'Our Pipeline',
    element: (
      <ContentSlide
        kicker={C2}
        title="Our Pipeline"
        lead="A pipeline is the list of stages a change goes through. Every git push starts one run"
        lesson={SESSION}
      >
        <SpineFlow
          {...PIPELINE}
          caption="Stages 2, 3 and 4 are make test, make build and make push"
        />
      </ContentSlide>
    ),
    notes:
      'Define the two words as you point: a pipeline is the whole line, a stage is one station on it. Then note that they already know the commands in three of the five.',
  },
  {
    id: 'c2-your-makefile',
    section: C2,
    label: 'It Is Your Makefile',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="It Is Your Makefile"
        lead="Look at stages 2, 3 and 4 again. You wrote all three, last session"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'Remember',
          body: 'Pipeline is your Makefile, run by a robot. Nothing new has to be invented for it.',
        }}
      >
        {/* Three targets, no blank lines between them, at 14px. The eight-line
            version pushed the note down to y=651, which `align-check.mjs` reports
            as sitting under the bottom-left control cluster. Every indented line
            is a real tab: session 5 spent three slides teaching that Make accepts
            exactly one indentation character (R4). */}
        <CodeBlock
          language="makefile"
          filename="Makefile"
          fontSize={14}
          code={'test:\n\tdocker compose run --rm backend python manage.py test\nbuild:\n\tdocker compose build\npush:\n\tdocker push $(DOCKER_ID)/$(IMAGE_NAME):$(VERSION)'}
        />
      </ContentNoteSlide>
    ),
    notes:
      'The most reassuring slide in the session, and it is true. They are not learning new commands, they are learning who types them.',
  },
  {
    id: 'c2-iron-rules',
    section: C2,
    label: 'Two Iron Rules',
    element: (
      <ContentSlide
        kicker={C2}
        title="Two Iron Rules"
        lead="Rule 1, stages run in order. Rule 2, a failed stage stops everything after it"
        lesson={SESSION}
      >
        <GateFlow {...GATE} caption="Broken code cannot reach users through the pipeline" />
      </ContentSlide>
    ),
    notes:
      'Rule 1 first, with the reason: building an image out of broken code is pointless, so TEST runs before BUILD. Then rule 2, and the new word: a gate.',
  },
  {
    id: 'c2-gate',
    section: C2,
    label: 'It Is a Gate',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="It Is a Gate"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'Remember',
          body: 'A gate is a place work has to get past. The pipeline is not only automation that saves you typing. It is the thing that makes it impossible for broken code to reach users.',
        }}
      />
    ),
    notes:
      'The word gate is new, so it gets its own frame. It is the whole safety argument for CI/CD in one sentence.',
  },
  {
    id: 'c2-what-triggers-it',
    section: C2,
    label: 'What Starts a Run',
    element: (
      <ContentSlide
        kicker={C2}
        title="What Starts a Run"
        lead="Something has to notice that you pushed. There are three ways"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'How', weight: 1 },
            { label: 'What happens', weight: 1.8 },
            { label: 'When it is used', weight: 1.3 },
          ]}
          rows={[
            [
              <Tech key="a" name="github">Webhook</Tech>,
              'GitHub tells the server the instant you push, without being asked',
              'Professional standard. We set one up in session 9',
            ],
            ['Poll SCM', 'Server asks GitHub every few minutes whether anything changed', 'When a webhook cannot reach your server'],
            ['Build Now', 'A person clicks a button', 'Testing the pipeline itself, which is what we do today'],
          ]}
          highlight={[1]}
        />
      </ContentSlide>
    ),
    notes:
      'Webhook is a new word: GitHub knocking on the door rather than the server asking. Name session 9 and leave it there.',
  },

  /* ---------------------------------------------------------------- */
  /* Quiz 1 (34)                                                        */
  /* ---------------------------------------------------------------- */
  {
    id: 'quiz-mid',
    section: C2,
    label: 'Quiz Time!',
    element: (
      <QuizTimeSlide
        subtitle="Five stages, two rules, and the difference between delivery and deployment"
        lesson={SESSION}
      />
    ),
    notes:
      'The mid-deck check, at the concept boundary. Everything after this assumes the room can read pipeline, stage and gate, so a misunderstanding caught here does not compound. Ask from the quiz tool.',
  },

  /* ---------------------------------------------------------------- */
  /* Concept 3: Jenkins, the Automation Server (35 to 45)              */
  /* ---------------------------------------------------------------- */
  {
    id: 'c3-divider',
    section: C3,
    label: '03 Divider',
    element: (
      <SectionBreakerSlide index={3} title={C3} subtitle="Factory that runs the line" lesson={SESSION} />
    ),
    notes: 'We have described the assembly line. Now meet the factory that runs it.',
  },
  {
    id: 'c3-what-is-jenkins',
    section: C3,
    label: 'What is Jenkins?',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="What is Jenkins?"
        lesson={SESSION}
        noteFirst
        note={{
          kind: 'info',
          title: <Tech name="jenkins">Jenkins</Tech>,
          body: 'A free, open-source automation server. An automation server is simply a program that stays running on a machine all day, watches for things happening, and runs a pipeline when one does.',
        }}
        points={[
          { text: 'It never sleeps, so it never forgets', sub: 'That was failure number one on the by-hand list', icon: 'eye' },
          { text: 'If CI/CD is the assembly line idea, Jenkins is the factory', sub: 'Idea needs something to actually run it', icon: 'settings' },
        ]}
      />
    ),
    notes:
      'Two new words in one sentence: automation server, and Jenkins. Define the general thing first, then say Jenkins is one of them.',
  },
  {
    id: 'c3-why-jenkins',
    section: C3,
    label: 'Why Jenkins',
    element: (
      <ContentSlide
        kicker={C3}
        title="Why Jenkins"
        lead="It is not the only choice, and here are the others honestly"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'Tool', weight: 1 },
            { label: 'What it is', weight: 1.6 },
            { label: 'Best when', weight: 1.5 },
          ]}
          rows={[
            [
              <Tech key="a" name="jenkins">Jenkins</Tech>,
              'You run it yourself, free, with over 1800 add-ons',
              'You want full control and no licence cost',
            ],
            [
              <Tech key="b" name="github">GitHub Actions</Tech>,
              'Built into GitHub, runs on their machines',
              'Your code is on GitHub and you want no server to look after',
            ],
            ['GitLab CI', 'Built into GitLab, the same idea', 'Your team already lives in GitLab'],
          ]}
          highlight={[1]}
        />
      </ContentSlide>
    ),
    notes: 'A fair comparison, and the verdict is the next slide. Never leave a comparison open.',
  },
  {
    id: 'c3-three-reasons',
    section: C3,
    label: 'Three Reasons',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="Three Reasons"
        lead="Why this course teaches Jenkins and not one of the other two"
        lesson={SESSION}
        note={{
          kind: 'note',
          body: 'A pipeline you can design in Jenkins takes minutes to rewrite in GitHub Actions. The stages and the rules are identical, and only the way you type them changes.',
        }}
        points={[
          {
            text: 'It has been the most used CI/CD server for over a decade',
            sub: 'So you will meet it in real companies',
            icon: 'star',
          },
          {
            text: 'You run it yourself, so you see what actually happens',
            sub: 'Rather than a cloud website doing the interesting parts out of sight',
            icon: 'eye',
          },
          {
            text: 'Its ideas carry over to every other tool',
            sub: 'Jobs, pipelines, stages and credentials mean the same thing everywhere',
            icon: 'link',
          },
        ]}
      />
    ),
    notes: 'The concepts are the durable skill. The syntax is not, and saying so keeps the room honest about tools.',
  },
  {
    id: 'c3-where-it-sits',
    section: C3,
    label: 'Where It Sits',
    element: (
      <ContentSlide
        kicker={C3}
        title="Where It Sits"
        lead="Jenkins in the middle of every tool this course has already built"
        lesson={SESSION}
      >
        <SpineFlow {...CHAIN} caption="Jenkins is the robot operator of the tools from sessions 1 to 6" />
      </ContentSlide>
    ),
    notes:
      'The map for the next three sessions. Trace it left to right with a finger and name each command as you pass it.',
  },
  {
    id: 'c3-run-in-docker',
    section: C3,
    label: 'Run It in Docker',
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
              text: 'docker run -d --name jenkins -p 8080:8080 -p 50000:50000 -v jenkins_home:/var/jenkins_home jenkins/jenkins:lts',
              kind: 'cmd',
            },
            { text: '7b31c0a94e12f3d5a8b2c1e9d4f6a0b3c7e2d1f8a9b4c6e0d3f5a7b1c9e2d4f6', kind: 'out' },
          ]}
          caption="-d means it runs in the background, so the only thing printed is the container's id"
        />
      </ContentSlide>
    ),
    notes:
      'Say the joke out loud: we are installing the tool that installs tools, using the tool whose whole purpose is not installing tools.',
  },
  {
    id: 'c3-every-flag-known',
    section: C3,
    label: 'Every Flag, Known',
    element: (
      <ContentSlide
        kicker={C3}
        title="Every Flag, Known"
        lead="There is nothing new in that command. You have met all six"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'Flag', weight: 1.5 },
            { label: 'What it does', weight: 2.4 },
          ]}
          rows={[
            [<Code key="a">-d</Code>, 'Runs in the background, so your terminal is free again'],
            [<Code key="b">--name jenkins</Code>, 'A fixed name, instead of the random one Docker would pick'],
            [<Code key="c">-p 8080:8080</Code>, 'Web dashboard, which you open at localhost:8080'],
            [<Code key="d">-p 50000:50000</Code>, 'For extra Jenkins workers later. Standard to open it now'],
            [
              <Code key="e">-v jenkins_home:/var/jenkins_home</Code>,
              'A volume. Every setting and every past run survives a restart, exactly like pgdata did for the database in session 3',
            ],
            [<Code key="f">jenkins/jenkins:lts</Code>, 'Official image. lts means Long Term Support, the stable one'],
          ]}
          highlight={[5]}
        />
      </ContentSlide>
    ),
    notes:
      'The volume row is the one they must not skim. Without it, everything they configure today is gone the first time the container restarts.',
  },
  {
    id: 'c3-is-it-running',
    section: C3,
    label: 'Is It Running?',
    element: (
      <ContentSlide
        kicker={C3}
        title="Is It Running?"
        lead="Because -d printed only an id, check before you open the browser"
        lesson={SESSION}
        points={[
          {
            text: 'First start takes about a minute',
            sub: 'Jenkins is unpacking itself. Until it finishes, the browser says the connection was refused',
            icon: 'info',
          },
          {
            text: 'That refusal is not a failed command',
            sub: 'It is the most common false alarm in this session. Wait, then reload',
            icon: 'warning',
          },
        ]}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: 'docker ps', kind: 'cmd' },
            { text: 'CONTAINER ID   IMAGE                 STATUS          NAMES', kind: 'out' },
            { text: '7b31c0a94e12   jenkins/jenkins:lts   Up 30 seconds   jenkins', kind: 'ok' },
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
      'Do not skip this. A room that opens localhost:8080 too early spends five minutes debugging a command that worked.',
  },
  {
    id: 'c3-unlock',
    section: C3,
    label: 'Unlock Jenkins',
    element: (
      <ContentSlide
        kicker={C3}
        title="Unlock Jenkins"
        lead="Open localhost:8080. Jenkins asks for a password, and it hid that password inside the container on purpose: only someone who controls the machine can read a file inside it"
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
            { text: 'docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword', kind: 'cmd' },
            { text: 'f3a9c1d24b8e4f7a9c0d1e2f3a4b5c6d', kind: 'ok' },
          ]}
          caption="docker exec runs a command inside a running container. You met it in session 1"
        />
      </ContentSlide>
    ),
    notes:
      'Reading a file inside a container is a session 1 skill, and this is the first time it has had a real reason. Copy the string into the browser.',
  },
  {
    id: 'c3-setup-wizard',
    section: C3,
    label: 'Finish Setup',
    element: (
      <ProceduralStepsSlide
        kicker={C3}
        title="Finish Setup"
        lead="Three screens, once, and then never again"
        lesson={SESSION}
        steps={[
          {
            title: 'Click Install suggested plugins',
            detail: 'Choose this one, not the other option. It includes Git and the Pipeline system, which this course needs. Expect a few minutes of progress bars',
            icon: 'download',
          },
          {
            title: 'Create First Admin User',
            detail: 'Your own username and password. This replaces the one-time password you just pasted in',
            icon: 'key',
          },
          {
            title: 'Accept the Instance Configuration',
            detail: 'Keep the address it offers, http://localhost:8080/, and click Save and Finish. The dashboard opens',
            icon: 'check',
          },
        ]}
      />
    ),
    notes: 'Walk the room through it together. Nobody should be on a different screen from anyone else.',
  },
  {
    id: 'c3-screens-drift',
    section: C3,
    label: 'If Your Screen Differs',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="If Your Screen Differs"
        lesson={SESSION}
        note={{
          kind: 'warning',
          body: 'Jenkins changes its setup screens between versions, so the wording and the layout may not match exactly. Follow what is on your screen. The order never changes: unlock, then plugins, then admin user.',
        }}
      />
    ),
    notes:
      'The honest slide that saves ten minutes. It is also why this deck shows no screenshots of these screens.',
  },
  {
    id: 'c3-plugins',
    section: C3,
    label: 'What Plugins Are',
    element: (
      <ContentSlide
        kicker={C3}
        title="What Plugins Are"
        lead="Jenkins on its own does almost nothing. Nearly every ability is an add-on you install"
        lesson={SESSION}
        points={[
          {
            text: 'Same idea as VS Code extensions',
            sub: 'A small core, plus the pieces you actually need. You have done this before',
            icon: 'plug',
          },
        ]}
      >
        <DataTable
          columns={[
            { label: 'Plugin', weight: 1 },
            { label: 'What it lets Jenkins do', weight: 1.8 },
            { label: 'Used in', weight: 0.8 },
          ]}
          rows={[
            [<Tech key="a" name="git">Git</Tech>, 'Copy a repository from GitHub', 'Session 8'],
            ['Pipeline', 'Run a pipeline written in a file, called a Jenkinsfile', 'Session 9'],
            [<Tech key="b" name="docker">Docker Pipeline</Tech>, 'Build and push Docker images from a pipeline', 'Session 8'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Only the three this course uses. Naming the sessions makes them promises rather than trivia.',
  },

  /* ---------------------------------------------------------------- */
  /* Concept 4: Inside the Jenkins Dashboard (46 to 52)                */
  /* ---------------------------------------------------------------- */
  {
    id: 'c4-divider',
    section: C4,
    label: '04 Divider',
    element: (
      <SectionBreakerSlide index={4} title={C4} subtitle="Job, build, queue, executor" lesson={SESSION} />
    ),
    notes: 'Jenkins is running. Now learn to read the screen it just gave you.',
  },
  {
    id: 'c4-the-screen',
    section: C4,
    label: 'The Screen',
    element: (
      <ContentSlide
        kicker={C4}
        title="Screen"
        lead="Dashboard is empty except for a menu. Here is what is on it"
        lesson={SESSION}
        points={[
          { text: 'New Item', sub: 'Where you create a job. We use it in a moment', icon: 'plus' },
          { text: 'Build History', sub: 'Every run Jenkins has ever done, newest first', icon: 'book' },
          { text: 'Manage Jenkins', sub: 'Every setting, including the credentials we add next session', icon: 'settings' },
          {
            text: 'Build Queue and Build Executor Status',
            sub: 'Two small panels at the bottom left. The second lists two idle workers, numbered 1 and 2',
            icon: 'devices',
          },
        ]}
      />
    ),
    notes:
      'Point at each one on your own screen as you say it. Four names, and the next slide defines the words behind them.',
  },
  {
    id: 'c4-vocabulary',
    section: C4,
    label: 'Four Words',
    element: (
      <ContentSlide
        kicker={C4}
        title="Four Words"
        lead="Learn these four and the whole dashboard makes sense"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'Word', weight: 1 },
            { label: 'What it means', weight: 2.2 },
          ]}
          rows={[
            ['Job', 'One automated task you have set up, for example "the nxttrendz pipeline"'],
            ['Build', 'One run of a job. They are numbered as you go: #1, #2, #3'],
            ['Build Queue', 'Runs that are waiting because no worker is free right now'],
            ['Executor', 'A worker slot. Jenkins starts with two, so two runs can happen at once'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Four definitions, no verdicts, so a table and not a status list. Read each one aloud once.',
  },
  {
    id: 'c4-the-trap',
    section: C4,
    label: 'Build Means a Run',
    element: (
      <ContentNoteSlide
        kicker={C4}
        title="Build Means a Run"
        lead="One of those four words already means something else to you, and that is the trap"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'Careful',
          body: (
            <>
              In Jenkins, <strong>build</strong> means one whole run of a job, which may include
              testing, pushing and deploying. It does not mean <Code>docker build</Code>.
            </>
          ),
        }}
        points={[
          {
            text: 'Numbers matter later',
            sub: 'Those run numbers, #1, #2, #3, are where automatic image tags come from in session 9',
            icon: 'target',
          },
        ]}
      />
    ),
    notes:
      'A word they already own, redefined. Name the trap explicitly, because nobody notices a word they think they know.',
  },
  {
    id: 'c4-smoke-test',
    section: C4,
    label: 'hello-jenkins',
    element: (
      <ProceduralStepsSlide
        kicker={C4}
        title="hello-jenkins"
        lead="Before any real pipeline, prove it is alive with a job that just prints a message"
        lesson={SESSION}
        /*
          DENSE, ASKED FOR EXPLICITLY.

          `ProceduralStepsSlide` decides this from the step count by default, and
          four steps is under its threshold. Height comes from LINES though, not
          from steps: all four details here wrap to two lines, so this slide is
          taller than the five one-line-step slides the threshold was tuned on.
          Once the kit moved the lead out of the header, the last detail's second
          line ended 4px inside the control bar and `align-check.mjs` caught it.

          Dropping the lead is not the alternative: without it the step column
          starts higher and reaches x=960, which puts it inside the
          `x913..1280 y0..220` instructor-video rectangle and fails
          `video-safe.mjs` instead. The two harnesses pull in opposite directions
          on this slide, and tighter spacing is the only lever that satisfies
          both without touching the copy.
        */
        dense
        steps={[
          {
            title: 'New Item, name it hello-jenkins, pick Freestyle project, click OK',
            detail: 'Freestyle means a job you set up by clicking, rather than by writing a file',
            icon: 'plus',
          },
          {
            title: 'Scroll to Build Steps, then Add build step, then Execute shell',
            detail: 'A box appears where you can type commands for Jenkins to run',
            icon: 'terminal',
          },
          {
            title: 'Type two lines, then Save, then Build Now',
            detail: 'echo "Jenkins is alive!" on the first line and date on the second',
            icon: 'play',
          },
          {
            title: 'Watch the history',
            detail: 'A build appears as #1 with a green tick beside it. That tick is the whole point of the exercise',
            icon: 'check',
          },
        ]}
      />
    ),
    notes:
      'Every step says what they will see. The green tick is the observable result and it is what proves the install worked.',
  },
  {
    id: 'c4-console-output',
    section: C4,
    label: 'Console Output',
    element: (
      <ContentSlide
        kicker={C4}
        title="Console Output"
        lead="Click build #1, then Console Output. Read it like a story, top to bottom"
        lesson={SESSION}
      >
        <Terminal
          path="jenkins · hello-jenkins #1"
          lines={[
            { text: 'Started by user ravi', kind: 'out' },
            { text: 'Running as SYSTEM', kind: 'out' },
            { text: 'Building in workspace /var/jenkins_home/workspace/hello-jenkins', kind: 'out' },
            { text: "+ echo 'Jenkins is alive!'", kind: 'out' },
            { text: 'Jenkins is alive!', kind: 'out' },
            { text: '+ date', kind: 'out' },
            { text: 'Tue Jul 14 10:42:07 UTC 2026', kind: 'out' },
            { text: 'Finished: SUCCESS', kind: 'ok' },
          ]}
          caption="A workspace is the folder Jenkins made for this job to work in"
        />
      </ContentSlide>
    ),
    notes:
      'Three things to point at: the workspace it created, the + before each command, which is Jenkins echoing what it ran exactly like Make did in session 5, and the verdict on the last line.',
  },
  {
    id: 'c4-where-you-will-live',
    section: C4,
    label: 'Where You Will Live',
    element: (
      <ContentNoteSlide
        kicker={C4}
        title="Where You Will Live"
        lesson={SESSION}
        note={{
          kind: 'tip',
          title: 'Remember',
          body: (
            <>
              Console Output is where you will spend your time when a pipeline fails. It is this
              session's version of <Code>docker compose logs</Code>.
            </>
          ),
        }}
      />
    ),
    notes: 'One line, one frame. They will need it in session 9 and they will not remember a bullet.',
  },
  {
    id: 'c4-freestyle-vs-pipeline',
    section: C4,
    label: 'A Fork in the Road',
    element: (
      <ContentNoteSlide
        kicker={C4}
        title="A Fork in the Road"
        lead="That job was set up by clicking boxes, and session 5 taught us why that is a problem"
        lesson={SESSION}
        /* The note goes ABOVE the table. Underneath it, the four rows pushed it to
           y=611, which `align-check.mjs` reports as sitting under the bottom-left
           control cluster. It also reads better here: the principle first, then
           the table that applies it. */
        noteFirst
        note={{
          kind: 'note',
          body: 'Makefile lesson: how you operate a project belongs in a versioned file, not in somebody\'s memory. Tick boxes in a web page are somebody\'s memory.',
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
            { label: '', weight: 1.2 },
            { label: 'Freestyle job', weight: 1.2 },
            { label: 'Pipeline job', weight: 1.8 },
          ]}
          rows={[
            ['Set up by', 'Clicking in the web page', 'A Jenkinsfile in your repository'],
            ['Reviewed and undone', 'No', 'Yes, like any other code'],
            ['Survives losing Jenkins', 'No', 'Yes, the file is in the repository'],
            ['Used in this course', 'Today\'s smoke test only', 'Everything real, sessions 8 and 9'],
          ]}
          highlight={[4]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'The comparison that sets up the next two sessions, closed with a verdict the room already believes because session 5 taught it.',
  },

  /* ---------------------------------------------------------------- */
  /* Closing frame (53 to 56)                                          */
  /* ---------------------------------------------------------------- */
  {
    id: 'quiz-final',
    section: 'Closing',
    label: 'Quiz Time!',
    element: (
      <QuizTimeSlide
        subtitle="One prerequisite on GitHub, one server in a container, and four words that run a dashboard"
        lesson={SESSION}
      />
    ),
    notes:
      'The last chance to find out what the room actually believes, while they are still in it. Hard rule 18 puts this immediately before the takeaways for exactly that reason.',
  },
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Key Takeaways',
    element: (
      /* The four agenda concepts, verbatim from `deckShared`. A fifth item here
         would be an idea the agenda never promised. Hard rule 20. */
      <KeyTakeawaysSlide
        title="Key Takeaways"
        lesson={SESSION}
        points={[
          { text: C1, icon: 'globe' },
          { text: C2, icon: 'route' },
          { text: C3, icon: 'settings' },
          { text: C4, icon: 'devices' },
        ]}
      />
    ),
    notes: 'The agenda, closed. Read the four names back in the order they were promised, and stop.',
  },
  {
    id: 'next-session',
    section: 'Closing',
    label: 'Next session',
    element: (
      /* `kicker`, no `index`. Without the kicker this frame is an unlabelled navy
         title, which is what a section divider looks like, and the room reads it
         as a fifth concept. Session 6's R9. */
      <SectionBreakerSlide kicker="Next session" title={NEXT_UP} lesson={SESSION} />
    ),
    notes:
      'Say the reason, do not put it on the slide: Jenkins is alive and completely powerless. It cannot reach your GitHub repository, it has no Docker Hub credentials, and it cannot run docker at all. Next session wires in all three.',
  },
  {
    id: 'thank-you',
    section: 'Closing',
    label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
    notes: 'Thank you.',
  },
]

export const jenkinsCicdMeta: DeckMeta = {
  title: SESSION,
  course: COURSE,
  lesson: SESSION,
}
