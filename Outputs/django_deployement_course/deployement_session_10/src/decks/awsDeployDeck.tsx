import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentSlide,
  FeedbackSlide,
  KeyTakeawaysSlide,
  PracticeSlide,
  QuestionSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import { Callout, CodeBlock, DataTable, SyntaxBreakdown } from '@/ui'
import { AnnotatedShot } from './figures/AnnotatedShot'
import { ShellPanel } from './figures/ShellPanel'
import { BrowserFrame } from './figures/BrowserFrame'
import { CloudArchitecture } from './figures/aws/CloudArchitecture'
import { Permissions } from './figures/Permissions'
import { TimeoutVsRefused } from './figures/TimeoutVsRefused'
import { ThreePlaces } from './figures/ThreePlaces'
import { MemoryBar } from './figures/MemoryBar'
import { WhoseLocalhost } from './figures/WhoseLocalhost'
import { InsideTheImage } from './figures/InsideTheImage'
import { BuildVsImage } from './figures/BuildVsImage'
import { CidrRuler } from './figures/CidrRuler'
import { GroupAsSource } from './figures/GroupAsSource'
import { NgrokDetour } from './figures/NgrokDetour'
import { DoorList } from './figures/DoorList'
import { LastMile } from './figures/LastMile'
import {
  SG_THREE_RULES,
  SG_PORT_COLUMN,
  SG_RULE_3000,
  SG_NEW_ROW_FORM,
  INSTANCES_ELASTIC_COLUMNS,
  WEBHOOK_NGROK_URL,
} from './shotBoxes'
import {
  SESSION,
  C1,
  C2,
  C3,
  C4,
  C5,
  C6,
  C7,
  APP_HOSTNAME,
  APP_PRIVATE_IP,
  ADDRESSES_IN_ORDER,
  ADDRESS_ON_START,
  KEY_FILE,
  SSH_USER,
  CLOSING_KICKER,
  T_8000_OK,
  T_3000_TIMEOUT,
} from './deckShared'

/**
 * Session 10, the last session of the deployment course.
 *
 * Built from `../session_plans/deployement_session_10/plan.md`, **revision 3**,
 * which is the TEACHING order. It differs in one place from the order the
 * hands-on ran in, and plan section 4a explains why.
 *
 * TWO RULES THIS DECK LIVES BY
 *
 * 1. **Every capture is real.** The whole session was run against a live AWS
 *    account before a slide existed. `MANIFEST.md` in
 *    `workflow/captures/session-10/` maps each file to the beat it serves. If a
 *    slide and a capture disagree, the capture wins.
 *
 * 2. **Nothing is created before the room has seen a picture of it.** The order
 *    on every hands-on beat is fixed: the requirement, the architecture state,
 *    the console, then the proof.
 */

/** The architecture figure at the size the content well actually gives it. */
const ARCH = 0.98

/** The prompt on the learner's own machine, and the one inside the instance. */
const LOCAL_PROMPT = 'PS C:\\nxttrendz>'
const REMOTE_PROMPT = `${SSH_USER}@${APP_HOSTNAME}:~$`

export const awsDeployDeck: SlideDef[] = [
  /* ── OPENING ─────────────────────────────────────────────────────────── */
  {
    id: 'welcome',
    section: 'Opening',
    label: 'Welcome',
    element: <BrandSlide greeting="Welcome" lesson={SESSION} />,
    notes: 'On screen while the room settles. Nothing but the mark.',
  },
  {
    id: 'session-name',
    section: 'Opening',
    label: 'Session name',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
    notes: 'The session name, and nothing else on the slide.',
  },
  {
    id: 'recap',
    section: 'Opening',
    label: 'Where we left off',
    element: (
      <ContentSlide
        kicker="Recap"
        title="Where We Left Off"
        lead="Three things are already true before today starts"
        lesson={SESSION}
        points={[
          { text: 'Two images sit on Docker Hub, built and pushed for you by Jenkins', icon: 'check' },
          { text: 'An EC2 instance sits in Mumbai, launched last session and then stopped', icon: 'server' },
          { text: 'Nothing connects the two, and that is the whole of today', icon: 'target' },
        ]}
      />
    ),
    notes:
      'Three lines and no more. Everything else from the last two sessions is either still true or not needed today.',
  },
  {
    id: 'the-gap',
    section: 'Opening',
    label: 'The gap',
    element: (
      <ContentSlide
        kicker="Where We Are"
        title="The Gap"
        lead="Everything outside AWS already works. None of it reaches the server"
        lesson={SESSION}
      >
        <div className="mt-8"><CloudArchitecture state="gap" scale={ARCH} /></div>
      </ContentSlide>
    ),
    notes:
      'Hold on this one. The empty Region is the session in a single picture, and every later frame grows from it.',
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
        items={[
          {
            title: 'Make the app live',
            sub: 'Log in to the server, install Docker, run your two images, and open the right doors',
          },
          {
            title: 'Make the build server live',
            sub: 'Jenkins moves onto its own EC2 instance, with an address that never changes',
          },
          {
            title: 'Make a code change deploy itself',
            sub: 'One push, four stages, and the fix reaches users with nobody touching the server',
          },
        ]}
      />
    ),
    notes:
      'THREE OUTCOMES, NOT SEVEN CONCEPTS. This is a long session, and an agenda listing seven ' +
      'concepts reads as a syllabus rather than a promise. Each line here is a thing that is true ' +
      'at the end and is not true now. The seven concept dividers still carry their own names, and ' +
      'Key Takeaways restates those, so hard rule 20 still holds across dividers and takeaways.',
  },

  /* ── CONCEPT 1 · LOGGING IN ──────────────────────────────────────────── */
  {
    id: 'c1-divider',
    section: C1,
    label: '01',
    element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} />,
  },
  {
    id: 'c1-question',
    section: C1,
    label: 'How do you get back in',
    element: (
      <QuestionSlide
        kicker={C1}
        question="The console tab is closed. How do you reach the server now?"
        qualifier="Last session used a button in the AWS console. That is one way in. It is not the way servers are normally run"
        lesson={SESSION}
      />
    ),
    notes: 'Let them answer. Somebody will say the console again, and they are right that it works.',
  },
  {
    id: 'c1-stopped',
    section: C1,
    label: 'It is stopped',
    element: (
      <ContentSlide
        kicker={C1}
        title="Step 1. Find It Stopped"
        lead="Your instance is exactly where you left it, and it is costing nothing"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-01-instance-stopped.png"
          alt="The EC2 instances list showing nxttrendz-server in the Stopped state with no public address"
          frameWidth={760}
          caption="EC2 → Instances. Note the empty Public IPv4 column"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c1-start-instance',
    section: C1,
    label: 'Start the instance',
    element: (
      <ContentSlide
        kicker={C1}
        title="Start the Instance"
        lead="It has been stopped since last session, so the first job is to wake it up"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-02-instance-state-menu.png"
          alt="The EC2 Instances list with nxttrendz-server selected and the Instance state menu open, showing Start instance available and Stop instance greyed out"
          frameWidth={760}
          caption="EC2 → Instances → select the instance → Instance state → Start instance"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'Stop instance is greyed out, which is how you know it really is stopped.',
  },
  {
    id: 'c1-running',
    section: C1,
    label: 'Running again',
    element: (
      <ContentSlide
        kicker={C1}
        title="Step 3. Running Again"
        lead="It takes about a minute, and the status checks keep initialising for a while after that"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-04-running-new-address.png"
          alt="The instances list with the instance now Running and a public address in the Public IPv4 column"
          frameWidth={760}
          caption="A public address has appeared, and it is not the one you had before"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c1-address-changed',
    section: C1,
    label: 'The address changed',
    element: (
      <ContentSlide
        kicker={C1}
        title="The Address Changed"
        lead="It came back on a different public address. That is the fourth one this instance has had"
        lesson={SESSION}
        points={[
          { text: `Last session it was ${ADDRESSES_IN_ORDER[0]}, then ${ADDRESSES_IN_ORDER[1]}, then ${ADDRESSES_IN_ORDER[2]}`, icon: 'info' },
          { text: `Today it is ${ADDRESS_ON_START}`, icon: 'target' },
          { text: `The private address, ${APP_PRIVATE_IP}, has not moved once`, icon: 'check' },
        ]}
      >
        <Callout kind="note" title="Not fixed yet">
          A changing address costs nothing while you only type it into a browser. It starts costing
          something once it is written into a file. That happens later today, and we fix it then
        </Callout>
      </ContentSlide>
    ),
    notes:
      'Hard rule 4: name the problem, do not open it. Concept 5 opens it, and by then they will have ' +
      'seen the address written into two files, which is what makes it matter.',
  },

  {
    id: 'c1-ssh-what',
    section: C1,
    label: 'What SSH is',
    element: (
      <ContentSlide
        kicker={C1}
        title="SSH"
        lead="Secure Shell. You type on your own machine, and the commands run on the server"
        lesson={SESSION}
        points={[
          { text: 'It is how every Linux server in the world is run', icon: 'globe' },
          { text: 'The console button works too, but only from a browser', icon: 'info' },
          { text: 'A script can use SSH. A button is not something a script can press', icon: 'target' },
        ]}
      />
    ),
    notes:
      'The third point is the one that matters later. The Deploy stage at the end of the session is a script, ' +
      'and it uses exactly this.',
  },
  {
    id: 'c1-key-file',
    section: C1,
    label: 'The key file',
    element: (
      <ContentSlide
        kicker={C1}
        title="The Key File"
        lead={`AWS gave you ${KEY_FILE} when you created the key pair. It is the only way in`}
        lesson={SESSION}
      >
        <Permissions mode={644} />
      </ContentSlide>
    ),
    notes:
      'It is in the Downloads folder. AWS keeps no copy: if the file is lost, the instance cannot be reached ' +
      'again and a new key pair means a new instance.',
  },
  {
    id: 'c1-failure-permissions',
    section: C1,
    label: 'SSH refuses the key',
    element: (
      <ContentSlide
        kicker={C1}
        title="SSH Refuses the Key"
        lead="The first attempt fails, and the message says exactly why"
        lesson={SESSION}
      >
        <ShellPanel
          title="Your machine"
          prompt={LOCAL_PROMPT}
          fontSize={14}
          lines={[
            { text: `ssh -i ${KEY_FILE} ${SSH_USER}@${ADDRESS_ON_START}`, kind: 'cmd' },
            { text: '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', kind: 'out' },
            { text: '@         WARNING: UNPROTECTED PRIVATE KEY FILE!          @', kind: 'out' },
            { text: '@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', kind: 'out' },
            { text: `Permissions 0644 for '${KEY_FILE}' are too open.`, kind: 'out' },
            { text: 'It is required that your private key files are NOT accessible by others.', kind: 'out' },
            { text: 'This private key will be ignored.', kind: 'out' },
            { text: `${SSH_USER}@${ADDRESS_ON_START}: Permission denied (publickey).`, kind: 'out' },
          ]}
          caption="Read the message before changing anything. It names the file, the permissions and the reason"
        />
      </ContentSlide>
    ),
    notes:
      'Real output from the capture run. Point at the line that says 0644: the number is the whole problem ' +
      'and the next slide is the fix.',
  },
  {
    id: 'c1-chmod',
    section: C1,
    label: 'chmod 400',
    element: (
      <ContentSlide
        kicker={C1}
        title="chmod 400"
        lead="Make the file readable by you and by nobody else"
        lesson={SESSION}
      >
        <Permissions mode={400} />
      </ContentSlide>
    ),
    notes:
      'The picture does the explaining. Two of the three lines are cut. Do not put a table of read, write ' +
      'and execute bits on this slide: they only need the idea today.',
  },
  {
    id: 'c1-connected',
    section: C1,
    label: 'Inside the server',
    element: (
      <ContentSlide
        kicker={C1}
        title="Inside the Server"
        lead="The prompt changed, and that is the proof"
        lesson={SESSION}
      >
        <ShellPanel
          title={`The instance, in Mumbai`}
          prompt={LOCAL_PROMPT}
          fontSize={14}
          lines={[
            { text: `chmod 400 ${KEY_FILE}`, kind: 'cmd' },
            { text: `ssh -i ${KEY_FILE} ${SSH_USER}@${ADDRESS_ON_START}`, kind: 'cmd' },
            { text: 'Welcome to Ubuntu 26.04 LTS (GNU/Linux 7.0.0-1006-aws x86_64)', kind: 'out' },
            { text: '', kind: 'out' },
            { text: `  Usage of /:   30.7% of 6.61GB   IPv4 address for ens5: ${APP_PRIVATE_IP}`, kind: 'out' },
            { text: '', kind: 'out' },
            { text: `${SSH_USER}@${APP_HOSTNAME}:~$`, kind: 'out' },
          ]}
          caption={`The prompt now reads ${SSH_USER}@${APP_HOSTNAME}, which is the private address of a machine in a Mumbai data centre`}
        />
      </ContentSlide>
    ),
    notes:
      'Ask them to read the prompt out loud. Every command from here runs on the server, not on the laptop. ' +
      'exit brings them home.',
  },
  {
    id: 'c1-command-parts',
    section: C1,
    label: 'The command',
    element: (
      <ContentSlide
        kicker={C1}
        title="Three Parts"
        lead="Every SSH command names a key, a user and a machine"
        lesson={SESSION}
      >
        <SyntaxBreakdown
          mode="command"
          parts={[
            { token: 'ssh', label: 'the command', body: 'Opens a shell on another machine' },
            {
              token: `-i ${KEY_FILE}`,
              label: 'the key',
              body: 'Your half of the key pair. Without it the server refuses you',
            },
            {
              token: SSH_USER,
              label: 'the user',
              body: 'Ubuntu images always use this name. It is not root and it is not your own name',
            },
            { token: '@', label: 'at', after: '', body: 'Separates the user from the machine' },
            {
              token: '<your-address>',
              label: 'the machine',
              fill: 'placeholder',
              body: 'The public address of your instance. This is the part that keeps changing',
            },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c1-recap',
    section: C1,
    label: 'Recap',
    element: (
      <ContentSlide
        kicker={C1}
        title="What You Just Did"
        lead="Three things to take out of this part"
        lesson={SESSION}
        points={[
          { text: 'SSH runs your commands on a machine somewhere else. You type here, it runs there' },
          { text: 'The key file must be readable only by you. chmod 400, or SSH will not use it' },
          { text: 'The prompt tells you which machine you are on. Check it before you run anything' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 2 · DOCKER ON THE SERVER ───────────────────────────────── */
  {
    id: 'c2-divider',
    section: C2,
    label: '02',
    element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} />,
  },
  {
    id: 'c2-question',
    section: C2,
    label: 'What is missing',
    element: (
      <QuestionSlide
        kicker={C2}
        question="Your images are on Docker Hub and you are on the server. What is missing?"
        qualifier="Both halves exist. Nothing joins them yet"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'c2-no-docker',
    section: C2,
    label: 'No Docker',
    element: (
      <ContentSlide
        kicker={C2}
        title="A New Server Has Nothing"
        lead="It is a clean Ubuntu. Docker is not on it"
        lesson={SESSION}
      >
        <ShellPanel
          title="The instance"
          prompt={REMOTE_PROMPT}
          fontSize={15}
          lines={[
            { text: 'docker --version', kind: 'cmd' },
            { text: 'bash: docker: command not found', kind: 'out' },
          ]}
          caption="Your laptop has Docker because you installed it. This machine is new"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c2-install',
    section: C2,
    label: 'Install Docker',
    element: (
      <ContentSlide
        kicker={C2}
        title="Install Docker"
        lead="Three commands, and the third one needs you to log out afterwards"
        lesson={SESSION}
      >
        <ShellPanel
          title="The instance"
          prompt={REMOTE_PROMPT}
          fontSize={14}
          lines={[
            { text: 'sudo apt-get update', kind: 'cmd' },
            { text: 'sudo apt-get install -y docker.io docker-compose-v2', kind: 'cmd' },
            { text: `sudo usermod -aG docker ${SSH_USER}`, kind: 'cmd' },
          ]}
          caption="The first refreshes the package list, the second installs Docker and Compose, the third lets you run Docker without sudo"
        />
      </ContentSlide>
    ),
    notes:
      'Do not let them skip the log out. Group membership is read when a session starts, so the third ' +
      'command does nothing until they exit and connect again.',
  },
  {
    id: 'c2-reconnect',
    section: C2,
    label: 'Log out and back in',
    element: (
      <ContentSlide
        kicker={C2}
        title="Log Out and Back In"
        lead="Your groups are read when the session starts, so the new one is not active yet"
        lesson={SESSION}
      >
        <ShellPanel
          title="The instance"
          prompt={REMOTE_PROMPT}
          fontSize={15}
          lines={[
            { text: 'exit', kind: 'cmd' },
            { text: `ssh -i ${KEY_FILE} ${SSH_USER}@${ADDRESS_ON_START}`, kind: 'cmd' },
            { text: 'docker --version', kind: 'cmd' },
            { text: 'Docker version 29.1.3, build 29.1.3-0ubuntu4.1', kind: 'out' },
            { text: 'docker compose version', kind: 'cmd' },
            { text: 'Docker Compose version 2.40.3+ds1-0ubuntu1', kind: 'out' },
          ]}
          caption="Now Docker answers without sudo"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c2-pull',
    section: C2,
    label: 'Pull the images',
    element: (
      <ContentSlide
        kicker={C2}
        title="Pull Your Images"
        lead="This is what Docker Hub was for"
        lesson={SESSION}
      >
        <ShellPanel
          title="The instance"
          prompt={REMOTE_PROMPT}
          fontSize={14}
          lines={[
            { text: 'docker pull <your-docker-id>/nxttrendz-backend:6', kind: 'cmd' },
            { text: 'Status: Downloaded newer image for nxttrendz-backend:6', kind: 'out' },
            { text: 'docker pull <your-docker-id>/nxttrendz-frontend:6', kind: 'cmd' },
            { text: 'Status: Downloaded newer image for nxttrendz-frontend:6', kind: 'out' },
          ]}
          caption="Use your own Docker Hub ID and the tag of your last green build"
        />
      </ContentSlide>
    ),
    notes:
      'Every learner has their own Docker Hub ID and their own tag numbers. Say so here rather than letting ' +
      'them copy the one on the slide.',
  },
  {
    id: 'c2-never-saw-code',
    section: C2,
    label: 'No source code',
    element: (
      <ContentSlide
        kicker={C2}
        title="This Server Has Never Seen Your Code"
        lead="No clone, no build, no Dockerfile. It downloaded two finished images by name"
        lesson={SESSION}
        points={[
          { text: 'Your machine built the images', icon: 'code' },
          { text: 'Docker Hub kept them', icon: 'server' },
          { text: 'The server only runs them', icon: 'play' },
        ]}
      >
        <Callout kind="success" title="Two things happened quietly">
          No docker login was needed, because the repositories are public. And no firewall rule was needed,
          because traffic going out of a server is allowed by default. The second one comes back later
        </Callout>
      </ContentSlide>
    ),
    notes: 'Plant the outbound point here. Concept 4 collects it when they ask why the pull worked.',
  },
  {
    id: 'c2-recap',
    section: C2,
    label: 'Recap',
    element: (
      <ContentSlide
        kicker={C2}
        title="What You Just Did"
        lead="Three things to take out of this part"
        lesson={SESSION}
        points={[
          { text: 'A new server starts with nothing on it. You install Docker once, per server' },
          { text: 'Group changes need a fresh login. exit, then connect again' },
          { text: 'The server pulls images by name. It never sees your source code' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 3 · RUNNING THE STACK ──────────────────────────────────── */
  {
    id: 'c3-divider',
    section: C3,
    label: '03',
    element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} />,
  },
  {
    id: 'c3-question',
    section: C3,
    label: 'What starts them',
    element: (
      <QuestionSlide
        kicker={C3}
        question="The images are on the server now. What starts them?"
        qualifier="You have answered this before, on your own machine"
        lesson={SESSION}
      />
    ),
    notes: 'They wrote the answer themselves when they wrote the compose file. Let them say it.',
  },
  {
    id: 'c3-arch',
    section: C3,
    label: 'What we are building',
    element: (
      <ContentSlide
        kicker={C3}
        title="What We Are Building"
        lead="Two containers and a volume, inside the instance"
        lesson={SESSION}
      >
        <div className="mt-8"><CloudArchitecture state="containers" scale={ARCH} /></div>
      </ContentSlide>
    ),
  },
  {
    id: 'c3-nano',
    section: C3,
    label: 'Creating a file',
    element: (
      <ContentSlide
        kicker={C3}
        title="Creating a File on the Server"
        lead="There is no editor window here. You open a file, type in it, then save and close"
        lesson={SESSION}
      >
        <SyntaxBreakdown
          mode="command"
          parts={[
            { token: 'nano', label: 'the editor', body: 'A text editor that runs inside the terminal' },
            { token: 'docker-compose.yml', label: 'the file', body: 'If it does not exist, nano creates it when you save' },
          ]}
        />
        <DataTable
          compact
          columns={[{ label: 'To do this' }, { label: 'Press' }]}
          rows={[
            ['Save the file', 'Ctrl and O, then Enter'],
            ['Close the editor', 'Ctrl and X'],
            ['Leave without saving', 'Ctrl and X, then N'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Nobody guesses Ctrl and O. nano prints its shortcuts along the bottom but writes Ctrl as a caret, ' +
      'so ^O looks like nothing in particular. Say it out loud.',
  },
  {
    id: 'c3-one-word',
    section: C3,
    label: 'One word per service',
    element: (
      <ContentSlide
        kicker={C3}
        title="One Word Changes"
        lead="Open it with the command you just saw. It is your own file, with build swapped for image"
        lesson={SESSION}
      >
        <CodeBlock
          className="max-w-[840px]"
          fontSize={13}
          filename="docker-compose.yml, on the server"
          language="yaml"
          code={`services:
  backend:
    image: <your-docker-id>/nxttrendz-backend:6
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - db_data:/app/data
  frontend:
    image: <your-docker-id>/nxttrendz-frontend:6
    ports:
      - "3000:3000"
    environment:
      VITE_API_BASE_URL: http://localhost:8000
    depends_on:
      - backend
volumes:
  db_data:`}
        />
      </ContentSlide>
    ),
    notes:
      'Do not explain VITE_API_BASE_URL yet. It is wrong, they will find out later, and finding out is the ' +
      'lesson. Hard rule 4: it is on the slide because it is in the file, not because it is being taught.',
  },
  {
    id: 'c3-why-image',
    section: C3,
    label: 'Why image and not build',
    element: (
      <ContentSlide
        kicker={C3}
        title="Why image, Not build"
        lead="The server runs what the pipeline built. It does not build its own copy"
        lesson={SESSION}
      >
        <BuildVsImage />
      </ContentSlide>
    ),
  },
  {
    id: 'c3-env',
    section: C3,
    label: 'The env file',
    element: (
      <ContentSlide
        kicker={C3}
        title="The .env File"
        lead="Same editor, same two keys to save. On this server it holds one line"
        lesson={SESSION}
      >
        <ShellPanel
          title="The instance"
          prompt={REMOTE_PROMPT}
          fontSize={15}
          lines={[{ text: 'nano .env', kind: 'cmd' }]}
          caption="Type the line below, then Ctrl and O, Enter, Ctrl and X"
        />
        <CodeBlock filename=".env, on the server" language="text" code={`SECRET_KEY=<a long random value>`} />
        <Callout kind="note" title="There are no database settings here">
          This app keeps its data in a file inside the db_data volume, so there is no database host, no
          database user and no database password to set
        </Callout>
      </ContentSlide>
    ),
    notes:
      'Say this plainly or somebody will spend ten minutes looking for DB_HOST because they saw it in a ' +
      'tutorial.',
  },
  {
    id: 'c3-up',
    section: C3,
    label: 'Start it',
    element: (
      <ContentSlide
        kicker={C3}
        title="Start It"
        lead="The same command you have run all course, on a machine in Mumbai"
        lesson={SESSION}
      >
        <ShellPanel
          title="The instance"
          prompt={REMOTE_PROMPT}
          fontSize={14}
          lines={[
            { text: 'docker compose up -d', kind: 'cmd' },
            { text: ' Container nxttrendz-backend-1   Started', kind: 'out' },
            { text: ' Container nxttrendz-frontend-1  Started', kind: 'out' },
            { text: 'docker compose exec backend python manage.py migrate', kind: 'cmd' },
            { text: ' Applying contenttypes.0001_initial... OK', kind: 'out' },
          ]}
          caption="A fresh volume means an empty database, so the tables have to be created once"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c3-open-it',
    section: C3,
    label: 'Open it',
    element: (
      <ContentSlide
        kicker={C3}
        title="Open It"
        lead="Both containers are up. Put the address in a browser"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-05-closed-port-times-out.png"
          alt="Chrome showing This site cannot be reached, the address took too long to respond, ERR_CONNECTION_TIMED_OUT"
          frameWidth={640}
          caption="Nothing. It waits about fifteen seconds and gives up"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
    notes:
      'Let the silence sit. The containers are running and the page will not load, and that contradiction is ' +
      'the door into the next concept.',
  },
  {
    id: 'c3-two-ports',
    section: C3,
    label: 'One port answers',
    element: (
      <ContentSlide
        kicker={C3}
        title="One Port Answers, One Does Not"
        lead="Measured from the same machine, one second apart"
        lesson={SESSION}
      >
        <ShellPanel
          title="Your machine"
          prompt={LOCAL_PROMPT}
          fontSize={14}
          lines={[
            { text: 'curl http://<your-address>:8000/api/products/', kind: 'cmd' },
            { text: `HTTP 200, in ${T_8000_OK}`, kind: 'out' },
            { text: '', kind: 'out' },
            { text: 'curl http://<your-address>:3000/', kind: 'cmd' },
            { text: `curl: (28) Connection timed out after ${T_3000_TIMEOUT}`, kind: 'out' },
          ]}
          caption="Same server, same moment. The difference is not the app"
        />
      </ContentSlide>
    ),
    notes:
      'This is the strongest evidence in the session. Both containers are up, and one port answers in less ' +
      'than a tenth of a second while the other never answers at all.',
  },
  {
    id: 'c3-what-is-curl',
    section: C3,
    label: 'What curl is',
    element: (
      <ContentSlide
        kicker={C3}
        title="curl"
        lead="A browser without the browser. It asks a server for something and prints the answer"
        lesson={SESSION}
      >
        <SyntaxBreakdown
          mode="command"
          parts={[
            { token: 'curl', label: 'the command', body: 'Makes one request and prints what comes back' },
            { token: 'http://', label: 'the protocol', after: '', body: 'Plain web traffic, because this server has no certificate' },
            { token: '<your-address>', label: 'which machine', after: '', fill: 'placeholder', body: 'Your own public address' },
            { token: ':3000', label: 'which port', after: '', body: 'Which door on that machine to knock at' },
            { token: '/', label: 'which page', body: 'The path, exactly as it would be in a browser' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Beginners have often never used curl. Two minutes here stops the next slide being about the tool ' +
      'instead of about the result. A browser retries and caches; curl says plainly what happened.',
  },
  {
    id: 'c3-recap',
    section: C3,
    label: 'Recap',
    element: (
      <ContentSlide
        kicker={C3}
        title="What You Just Did"
        lead="Three things to take out of this part"
        lesson={SESSION}
        points={[
          { text: 'The server runs images, it does not build them. image: instead of build:' },
          { text: 'A new volume starts empty. Run migrate once' },
          { text: 'It is running, and it is not reachable. Those are two different things' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 4 · SECURITY GROUPS ────────────────────────────────────── */
  {
    id: 'c4-divider',
    section: C4,
    label: '04',
    element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} />,
  },
  {
    id: 'c4-question',
    section: C4,
    label: 'Who is saying no',
    element: (
      <QuestionSlide
        kicker={C4}
        question="The containers are up and the page will not load. Who is saying no?"
        qualifier="It is not the app, because the app never sees the request"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'c4-what-it-is',
    section: C4,
    label: 'The door list',
    element: (
      <ContentSlide
        kicker={C4}
        title="The Security Group"
        lead="A firewall in front of your instance. Nothing is open until you open it"
        lesson={SESSION}
      >
        <DoorList state="closed" />
        <Callout kind="note" title="You can only allow, never block">
          There is no rule that shuts a port. Everything you do not list is already shut, which is why a
          new instance is safe before you have written a single rule
        </Callout>
      </ContentSlide>
    ),
    notes:
      'The third point is the one they have already seen without noticing: docker pull worked, and nobody ' +
      'opened anything for it.',
  },
  {
    id: 'c4-outbound',
    section: C4,
    label: 'Why the pull worked',
    element: (
      <ContentSlide
        kicker={C4}
        title="This Is Why the Pull Worked"
        lead="You never opened a port for Docker Hub, and you did not need to"
        lesson={SESSION}
      >
        <DoorList state="outbound" />
        <Callout kind="success" title="Out is open, in is closed">
          Doors only face one way. Serving a page needs a rule, and fetching an image does not
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: 'c4-anatomy',
    section: C4,
    label: 'What a rule says',
    element: (
      <ContentSlide
        kicker={C4}
        title="What a Rule Says"
        lead="Every rule answers three questions, and no more"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Type' }, { label: 'Port' }, { label: 'Source', weight: 2 }]}
          rows={[
            ['which protocol', 'which door', 'who may knock'],
            ['SSH', '22', 'just your own address'],
            ['Custom TCP', '3000', 'everyone'],
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-cidr',
    section: C4,
    label: 'Reading the source',
    element: (
      <ContentSlide
        kicker={C4}
        title="Reading the Source"
        lead="Two values cover everything you need today"
        lesson={SESSION}
      >
        <CidrRuler />
        <Callout kind="warning" title="My IP is different for every one of you">
          The console fills in whatever address you are connecting from right now. Nobody in the room
          gets the same value, so do not copy the one on any screen. Choose My IP and let it fill itself in
        </Callout>
      </ContentSlide>
    ),
    notes:
      'Do not teach subnet masks. They need to read two values today and that is all this slide is for.',
  },
  {
    id: 'c4-three-rules',
    section: C4,
    label: 'The rules you have',
    element: (
      <ContentSlide
        kicker={C4}
        title="The Rules You Have"
        lead="Three of them, all created when you launched the instance"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-06-sg-three-rules.png"
          alt="The nxttrendz-sg security group showing three inbound rules: SSH on 22 from one address, SSH on 22 from an AWS range, and Custom TCP on 8000 from anywhere"
          highlights={[{ ...SG_THREE_RULES, step: 1, label: 'three rules', labelAt: 'below' }]}
          spotlight
          inset="auto"
          frameWidth={760}
          caption="EC2 → Security Groups → your group → Inbound rules"
          className="mr-auto w-fit"
        />
        <Callout kind="note" title="Your rules will show a different address">
          The SSH rule holds whoever set it up. Yours holds you, and it will not match the screen
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: 'c4-missing-3000',
    section: C4,
    label: 'No rule for 3000',
    element: (
      <ContentSlide
        kicker={C4}
        title="Look at the Ports"
        lead="Twenty two, twenty two, eight thousand. Three thousand is not there"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-06-sg-three-rules.png"
          alt="The same three rules, with the Port range column highlighted showing 22, 22 and 8000"
          highlights={[{ ...SG_PORT_COLUMN, step: 1, label: 'no 3000', labelAt: 'below' }]}
          spotlight
          inset="auto"
          frameWidth={760}
          caption="The frontend listens on 3000, and nothing is allowed to reach it"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
    notes:
      'The highlight is the column, not a rule, because the failure is about what is MISSING from it. That ' +
      'is also why 8000 answered: it has a rule and 3000 does not.',
  },
  {
    id: 'c4-edit-form',
    section: C4,
    label: 'Open the edit form',
    element: (
      <ContentSlide
        kicker={C4}
        title="Open Edit Inbound Rules"
        lead="Every existing rule is listed, and Add rule is under them"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-07-edit-inbound-rules.png"
          alt="The Edit inbound rules form showing the three existing rules with an Add rule button below them"
          frameWidth={760}
          caption="EC2 → Security Groups → your group → Edit inbound rules"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-add-rule',
    section: C4,
    label: 'Add the rule',
    element: (
      <ContentSlide
        kicker={C4}
        title="Add One Rule"
        lead="Custom TCP, port 3000, source Anywhere"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-08-new-rule-3000.png"
          alt="The Edit inbound rules form with a fourth row added: Custom TCP, port 3000, described as the React frontend"
          highlights={[{ ...SG_NEW_ROW_FORM, step: 1, label: 'the row you add', labelAt: 'below' }]}
          spotlight
          inset="auto"
          frameWidth={760}
          caption="EC2 → Security Groups → your group → Edit inbound rules → Add rule"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-source-snag',
    section: C4,
    label: 'A snag when saving',
    element: (
      <ContentSlide
        kicker={C4}
        title="If Save Refuses"
        lead="Choosing Anywhere does not always fill the source box in"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-09-source-required-error.png"
          alt="The form refusing to save, with the message CIDR block, a security group ID or a prefix list has to be specified"
          frameWidth={700}
          caption="Type 0.0.0.0/0 into the source box and pick it from the list that appears"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'This happened during capture. It costs a minute if you know, and ten if you do not.',
  },
  {
    id: 'c4-four-rules',
    section: C4,
    label: 'Four rules',
    element: (
      <ContentSlide
        kicker={C4}
        title="Saved"
        lead="Rules apply straight away. Nothing restarts and nothing redeploys"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-11-sg-four-rules.png"
          alt="The security group now showing four inbound rules, including Custom TCP on port 3000 from anywhere"
          highlights={[{ ...SG_RULE_3000, step: 1, label: 'the new rule', labelAt: 'below' }]}
          spotlight
          inset="auto"
          frameWidth={760}
          caption="The browser tab that had been waiting loaded while this banner was still on screen"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-site-loads',
    section: C4,
    label: 'The site loads',
    element: (
      <ContentSlide
        kicker={C4}
        title="The Site Loads"
        lead="Your app, on the public internet, from any device"
        lesson={SESSION}
      >
        <BrowserFrame
          className="mx-auto"
          src="/shots/dep-12-site-loads-empty.png"
          alt="The NxtTrendz login page loading in a browser over the public address"
          url="http://<your-address>:3000/"
          width={620}
          caption="Reload the tab that was waiting. No restart was needed"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-arch',
    section: C4,
    label: 'The doors now',
    element: (
      <ContentSlide
        kicker={C4}
        title="The Doors Now"
        lead="Three open, and one that was never there"
        lesson={SESSION}
      >
        <div className="mt-8"><CloudArchitecture state="doors" scale={ARCH} /></div>
      </ContentSlide>
    ),
  },
  {
    id: 'c4-justify',
    section: C4,
    label: 'Justify every door',
    element: (
      <ContentSlide
        kicker={C4}
        title="Justify Every Door"
        lead="If you cannot say out loud why a port is open, close it"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Port' }, { label: 'Open to' }, { label: 'Why', weight: 3 }]}
          rows={[
            ['22', 'your address only', 'only you administer this server'],
            ['3000', 'everyone', 'the app. Users are the point'],
            ['8000', 'everyone', 'the API, which the browser calls directly'],
            ['5432', 'no rule at all', 'there is no database server to reach'],
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-no-db-port',
    section: C4,
    label: 'The database has no door',
    element: (
      <ContentSlide
        kicker={C4}
        title="The Database Has No Door"
        lead="It is a file inside the volume, and only the backend container can open it"
        lesson={SESSION}
      >
        <Callout kind="warning" title="The day this becomes a real database server">
          A database port never belongs in a security group that faces the internet. Do not publish it in
          the compose file, and do not allow it in the group. Two layers, both closed
        </Callout>
      </ContentSlide>
    ),
    notes:
      'Exposed databases are found by scanners within hours. They do not need the statistic today, they ' +
      'need the rule.',
  },
  {
    id: 'c4-ip-moved',
    section: C4,
    label: 'When your own IP moves',
    element: (
      <ContentSlide
        kicker={C4}
        title="When Your Own Address Moves"
        lead="You allowed SSH from My IP at home, then opened the laptop somewhere else"
        lesson={SESSION}
        points={[
          { text: 'SSH starts timing out, and nothing on the server changed', icon: 'warning' },
          { text: 'Your address changed, and the rule still names the old one', icon: 'info' },
          { text: 'Edit the rule and choose My IP again', icon: 'check' },
        ]}
      />
    ),
  },
  {
    id: 'c4-recap',
    section: C4,
    label: 'Recap',
    element: (
      <ContentSlide
        kicker={C4}
        title="What You Just Did"
        lead="Three things to take out of this part"
        lesson={SESSION}
        points={[
          { text: 'Nothing is open until you open it. And you can only allow, never block' },
          { text: 'Every open port needs a reason you can say out loud. The database needs no port at all' },
          { text: 'Timeout is the firewall, refused is the app. Two symptoms, two places to look' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 5 · A PERMANENT ADDRESS ────────────────────────────────── */
  {
    id: 'c5-divider',
    section: C5,
    label: '05',
    element: <SectionBreakerSlide index={5} title={C5} lesson={SESSION} />,
  },
  {
    id: 'c5-question',
    section: C5,
    label: 'What happens on stop',
    element: (
      <QuestionSlide
        kicker={C5}
        question="What happens to the address the next time you stop the instance?"
        qualifier="You have already seen the answer, more than once"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'c5-four-addresses',
    section: C5,
    label: 'Four addresses',
    element: (
      <ContentSlide
        kicker={C5}
        title="Four Addresses, One Machine"
        lead="Every stop and start hands the old one back and takes a new one"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'When' }, { label: 'Public address', weight: 2 }, { label: 'Private address', weight: 2 }]}
          rows={[
            ['at launch', ADDRESSES_IN_ORDER[0], APP_PRIVATE_IP],
            ['after a restart', ADDRESSES_IN_ORDER[1], APP_PRIVATE_IP],
            ['later that session', ADDRESSES_IN_ORDER[2], APP_PRIVATE_IP],
            ['when you started it today', ADDRESSES_IN_ORDER[3], APP_PRIVATE_IP],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The right column never changes. Point at it. The private address is stable and the public one is not, ' +
      'and that difference is the whole concept.',
  },
  {
    id: 'c5-why-not-free',
    section: C5,
    label: 'Why not use the free one',
    element: (
      <QuestionSlide
        kicker={C5}
        question="Why not just use the free address AWS keeps giving you?"
        qualifier="It works. You have been using it all session"
        lesson={SESSION}
      />
    ),
    notes:
      'This is the question the room actually has, so ask it before answering it. "Because it changes" is ' +
      'not an answer on its own: changing only matters if something depends on it.',
  },
  {
    id: 'c5-three-places',
    section: C5,
    label: 'Written in three places',
    element: (
      <ContentSlide
        kicker={C5}
        title="The Address Is Written Down"
        lead="Not just typed into a browser. By the end of today it sits in three files"
        lesson={SESSION}
      >
        <ThreePlaces />
      </ContentSlide>
    ),
  },
  {
    id: 'c5-sealed',
    section: C5,
    label: 'The one in the image',
    element: (
      <ContentSlide
        kicker={C5}
        title="One of Them Is Sealed In"
        lead="The middle card decides it. That address is inside a built image"
        lesson={SESSION}
        points={[
          { text: 'You cannot edit a file inside an image', icon: 'lock' },
          { text: 'Changing it means a commit, a build, a push and a redeploy', icon: 'warning' },
          { text: 'A free address that moves would make a full release the price of every restart', icon: 'bolt' },
        ]}
      />
    ),
  },
  {
    id: 'c5-arch',
    section: C5,
    label: 'What we are adding',
    element: (
      <ContentSlide
        kicker={C5}
        title="What We Are Adding"
        lead="One address, reserved to your account and pinned to the instance"
        lesson={SESSION}
      >
        <div className="mt-8"><CloudArchitecture state="elastic" scale={ARCH} /></div>
      </ContentSlide>
    ),
  },
  {
    id: 'c5-find-page',
    section: C5,
    label: 'Find Elastic IPs',
    element: (
      <ContentSlide
        kicker={C5}
        title="Step 1. Find the Page"
        lead="It is in the left menu of EC2, under Network and Security"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-14-elastic-ips-empty.png"
          alt="The Elastic IP addresses page in the EC2 console, empty, with the Allocate Elastic IP address button in the top right"
          frameWidth={760}
          caption="EC2 → Elastic IPs. You have none yet, so the list is empty"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c5-allocate-form',
    section: C5,
    label: 'Allocate the address',
    element: (
      <ContentSlide
        kicker={C5}
        title="Step 2. Allocate One"
        lead="Take the defaults. Amazon's pool, and your own Region"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-15-allocate-form.png"
          alt="The Allocate Elastic IP address form with Amazon's pool of IPv4 addresses selected and the network border group set to the Region"
          frameWidth={760}
          caption="Click Allocate Elastic IP address, then Allocate. There is nothing to fill in"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
    notes:
      'Nobody needs to change anything on this form. Say so, or half the room will read every option ' +
      'looking for the one they are supposed to pick.',
  },
  {
    id: 'c5-allocated',
    section: C5,
    label: 'It is yours now',
    element: (
      <ContentSlide
        kicker={C5}
        title="Step 3. It Is Yours Now"
        lead="The address is reserved to your account, and it is attached to nothing"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-16-allocated.png"
          alt="The Elastic IP addresses list showing one allocated address, with the Associated instance ID column empty"
          frameWidth={760}
          caption="Reserved, and not yet in use"
          className="mr-auto w-fit"
        />
        <Callout kind="warning" title="Look at the Associated instance column">
          It is empty, and that is the one state AWS charges for. Do not stop here
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: 'c5-associate-form',
    section: C5,
    label: 'Start associating',
    element: (
      <ContentSlide
        kicker={C5}
        title="Step 4. Attach It"
        lead="Select the address, then Actions, then Associate Elastic IP address"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-17-associate-form.png"
          alt="The Associate Elastic IP address form, with Instance selected as the resource type and an empty instance field"
          frameWidth={760}
          caption="Resource type stays on Instance. The private IP field can be left blank"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c5-choose-instance',
    section: C5,
    label: 'Choose the instance',
    element: (
      <ContentSlide
        kicker={C5}
        title="Step 5. Choose the Instance"
        lead="Click the box and your running instances appear. Pick the app server"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-18-associate-instance-chosen.png"
          alt="The associate form with the app server instance chosen in the instance field"
          frameWidth={760}
          caption="Then Associate. If you have two instances by now, read the name carefully"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c5-associated',
    section: C5,
    label: 'Attached',
    element: (
      <ContentSlide
        kicker={C5}
        title="Step 6. Attached"
        lead="The same row now names an instance, and the instance's private address beside it"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-19-associated.png"
          alt="The Elastic IP now showing an associated instance ID and the instance's private address beside it"
          frameWidth={760}
          caption="From here the address survives every stop and start"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c5-old-dies',
    section: C5,
    label: 'The old one dies',
    element: (
      <ContentSlide
        kicker={C5}
        title="The Old Address Stops Answering"
        lead="Straight away. The same command, a minute apart"
        lesson={SESSION}
      >
        <ShellPanel
          title="Your machine"
          prompt={LOCAL_PROMPT}
          fontSize={14}
          lines={[
            { text: 'curl http://<the-old-address>:3000/', kind: 'cmd' },
            { text: 'HTTP 200', kind: 'out' },
            { text: '', kind: 'out' },
            { text: 'curl http://<the-old-address>:3000/', kind: 'cmd' },
            { text: 'HTTP 000', kind: 'out' },
          ]}
          caption="Anything holding the old address is now pointing at nothing"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c5-proof-console',
    section: C5,
    label: 'The console agrees',
    element: (
      <ContentSlide
        kicker={C5}
        title="Check It in the Console"
        lead="The Public IPv4 column and the Elastic IP column now hold the same value"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-31-instances-with-elastic-ip.png"
          alt="The EC2 instances list with both instances running, the Public IPv4 and Elastic IP columns holding the same address for each"
          highlights={[{ ...INSTANCES_ELASTIC_COLUMNS, step: 1, label: 'the same address twice', labelAt: 'below' }]}
          spotlight
          inset="auto"
          frameWidth={700}
          caption="EC2 → Instances. The Elastic IP did not sit beside the public address, it became it"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
    notes:
      'The two columns matching is the proof. Before this, Elastic IP was empty and Public IPv4 held a ' +
      'borrowed address that AWS could take back.',
  },
  {
    id: 'c5-proof-browser',
    section: C5,
    label: 'And the browser agrees',
    element: (
      <ContentSlide
        kicker={C5}
        title="And in the Browser"
        lead="The app answers on the new address, and will keep answering on it after a restart"
        lesson={SESSION}
      >
        <BrowserFrame
          className="mx-auto"
          src="/shots/dep-12-site-loads-empty.png"
          alt="The application loading in a browser on the Elastic IP"
          url="http://<your-elastic-ip>:3000/"
          width={620}
          caption="Same app, permanent address"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c5-pricing',
    section: C5,
    label: 'What it costs',
    element: (
      <ContentSlide
        kicker={C5}
        title="What It Costs"
        lead="Attached is free. Held and unused is billed"
        lesson={SESSION}
        points={[
          { text: 'Attached to a running instance, you pay nothing', icon: 'check' },
          { text: 'Allocated and attached to nothing, you pay', icon: 'warning' },
          { text: 'So release it when you release the instance', icon: 'target' },
        ]}
      >
        <Callout kind="note" title="Why AWS prices it that way">
          Addresses are limited. The charge exists to stop people holding ones they are not using
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: 'c5-point-frontend',
    section: C5,
    label: 'Point the frontend at it',
    element: (
      <ContentSlide
        kicker={C5}
        title="Point the Frontend at It"
        lead="The compose file on the server still says localhost. Change it and bring the stack back up"
        lesson={SESSION}
      >
        <CodeBlock
          className="max-w-[840px]"
          filename="docker-compose.yml, on the server"
          language="yaml"
          code={`    environment:
      VITE_API_BASE_URL: http://<your-elastic-ip>:8000`}
        />
        <ShellPanel
          title="The instance"
          prompt={REMOTE_PROMPT}
          fontSize={14}
          lines={[{ text: 'docker compose up -d', kind: 'cmd' }]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c5-still-empty',
    section: C5,
    label: 'Still empty',
    element: (
      <ContentSlide
        kicker={C5}
        title="The Product List Is Still Empty"
        lead="Log in and nothing arrives. The page gives no error"
        lesson={SESSION}
      >
        <Callout kind="error" title="Something else is refusing it">
          The address is right now, and the request does reach the server. We come back to this, and the
          browser will tell us exactly what is wrong
        </Callout>
      </ContentSlide>
    ),
    notes:
      'Name it and move on. The room now has an open question they can hold, and the answer needs a working ' +
      'pipeline, which is the next concept.',
  },
  {
    id: 'c5-recap',
    section: C5,
    label: 'Recap',
    element: (
      <ContentSlide
        kicker={C5}
        title="What You Just Did"
        lead="Three things to take out of this part"
        lesson={SESSION}
        points={[
          { text: 'A free public address changes on every stop. The private one never does' },
          { text: 'It matters because the address gets written into files. One of them is inside an image' },
          { text: 'An Elastic IP is free while attached. Release it when you are done' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 6 · JENKINS ON AWS ─────────────────────────────────────── */
  {
    id: 'c6-divider',
    section: C6,
    label: '06',
    element: <SectionBreakerSlide index={6} title={C6} lesson={SESSION} />,
  },
  {
    id: 'c6-question',
    section: C6,
    label: 'Where is Jenkins',
    element: (
      <QuestionSlide
        kicker={C6}
        question="Where is Jenkins running right now?"
        qualifier="Not where your app is"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'c6-on-a-laptop',
    section: C6,
    label: 'On a laptop',
    element: (
      <ContentSlide
        kicker={C6}
        title="On Your Laptop"
        lead="GitHub cannot reach a laptop, so you put ngrok in front of it"
        lesson={SESSION}
      >
        <NgrokDetour state="tunnel" />
      </ContentSlide>
    ),
  },
  {
    id: 'c6-check-tunnel',
    section: C6,
    label: 'Check your webhook',
    element: (
      <ContentSlide
        kicker={C6}
        title="Check Your Webhook Now"
        lead="Open your repository settings and look at the payload URL"
        lesson={SESSION}
      >
        <Callout kind="error" title="For most of you it is already dead">
          A free ngrok tunnel gets a new address every time it restarts. The URL saved in GitHub is the
          one from the day you set it up, and it almost certainly no longer exists
        </Callout>
      </ContentSlide>
    ),
    notes:
      'Have them actually look. This is not a hypothetical, and a room that has just seen its own broken ' +
      'webhook does not need persuading about what comes next.',
  },
  {
    id: 'c6-current-payload',
    section: C6,
    label: 'The payload URL today',
    element: (
      <ContentSlide
        kicker={C6}
        title="What Your Webhook Points At Today"
        lead="An ngrok address, which is a public door opened in front of your own laptop"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/jen-18-webhook-ngrok-url.png"
          alt="The GitHub webhook settings page with the Payload URL field holding an ngrok address ending in github-webhook"
          highlights={[{ ...WEBHOOK_NGROK_URL, step: 1, label: 'an ngrok address', labelAt: 'below' }]}
          spotlight
          inset="auto"
          frameWidth={700}
          caption="GitHub → your repository → Settings → Webhooks"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c6-why-ngrok-helped',
    section: C6,
    label: 'What ngrok was doing',
    element: (
      <ContentSlide
        kicker={C6}
        title="What ngrok Was Doing for You"
        lead="It gave your laptop a public address it does not have, and forwarded whatever arrived"
        lesson={SESSION}
        points={[
          { text: 'GitHub posts to the ngrok address, because it is on the public internet', icon: 'globe' },
          { text: 'ngrok forwards that request down a tunnel your laptop opened from the inside', icon: 'link' },
          { text: 'Your laptop never needed a public address, which is exactly why it worked', icon: 'check' },
        ]}
      >
        <Callout kind="warning" title="And exactly why it keeps breaking">
          The tunnel is opened from your side, so the address is only yours while it is open. Close the
          laptop or restart ngrok and a different address is handed out
        </Callout>
      </ContentSlide>
    ),
    notes:
      'This is worth the two minutes. A room that understands ngrok forwarded from the outside in will ' +
      'understand immediately why a server with its own address does not need it.',
  },
  {
    id: 'c6-requirement',
    section: C6,
    label: 'What we require',
    element: (
      <ContentSlide
        kicker={C6}
        title="What We Require"
        lead="A second instance, and it is not the same size as the first"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Setting' }, { label: 'The app server' }, { label: 'The build server' }, { label: 'Why', weight: 2 }]}
          rows={[
            ['Instance type', 't3.micro', 't3.micro', 'both free tier eligible'],
            ['Disk', '8 GiB', '20 GiB', 'builds pile up images and layers'],
            ['Swap', 'none', '4 GiB', 'a build needs more memory than it has'],
            ['Open to', 'everyone, on 3000 and 8000', 'you and GitHub, on 8080', 'nobody else needs Jenkins'],
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c6-cost',
    section: C6,
    label: 'What it costs',
    element: (
      <ContentSlide
        kicker={C6}
        title="Two Instances, Twice the Burn"
        lead="The free tier is 750 instance hours a month, counted across all of them"
        lesson={SESSION}
        points={[
          { text: 'One instance running all month uses about 730 hours', icon: 'info' },
          { text: 'Two running together use it twice as fast', icon: 'warning' },
          { text: 'Stop both when you finish for the day', icon: 'check' },
        ]}
      />
    ),
  },
  {
    id: 'c6-arch',
    section: C6,
    label: 'What we are adding',
    element: (
      <ContentSlide
        kicker={C6}
        title="What We Are Adding"
        lead="A second machine in the same network as the first"
        lesson={SESSION}
      >
        <div className="mt-8"><CloudArchitecture state="jenkins" scale={ARCH} /></div>
      </ContentSlide>
    ),
  },
  {
    id: 'c6-launch',
    section: C6,
    label: 'Launch it',
    element: (
      <ContentSlide
        kicker={C6}
        title="Launch It"
        lead="Same steps you already know, same Ubuntu image, same key pair"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/jen-01-launch-name-ubuntu.png"
          alt="The EC2 launch form, named nxttrendz-jenkins, with Ubuntu selected"
          frameWidth={760}
          caption="EC2 → Instances → Launch instances. Name it so you can tell the two apart"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c6-sg',
    section: C6,
    label: 'Its own security group',
    element: (
      <ContentSlide
        kicker={C6}
        title="Its Own Security Group"
        lead="Both rules point at your own address, and nothing else yet"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/jen-02-jenkins-sg-rules.png"
          alt="A new security group named jenkins-sg with two rules, SSH on 22 and Custom TCP on 8080, both sourced from My IP"
          frameWidth={760}
          caption="Port 22 to administer it, port 8080 to open the Jenkins page"
          className="mr-auto w-fit"
        />
        <Callout kind="note" title="Choose My IP rather than typing an address">
          It fills in your own, which is different from everyone else's and changes when you move network
        </Callout>
      </ContentSlide>
    ),
    notes:
      'GitHub is not allowed in yet, on purpose. That rule comes later in this concept, once there is ' +
      'something for GitHub to talk to.',
  },
  {
    id: 'c6-disk',
    section: C6,
    label: 'More disk',
    element: (
      <ContentSlide
        kicker={C6}
        title="Give It More Disk"
        lead="Eight is enough to run two images. It is not enough to keep building them"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/jen-03-storage-20gib.png"
          alt="The storage section of the launch form, changed from 8 GiB to 20 GiB"
          frameWidth={760}
          caption="Every build leaves layers behind, and they add up faster than anyone expects"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c6-two-instances',
    section: C6,
    label: 'Two instances',
    element: (
      <ContentSlide
        kicker={C6}
        title="Two Machines Now"
        lead="One runs your app. One builds it"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/jen-05-two-instances.png"
          alt="The EC2 instances list showing both nxttrendz-server and nxttrendz-jenkins running"
          frameWidth={760}
          caption="Different jobs, different sizes, same network"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c6-memory',
    section: C6,
    label: 'It needs swap',
    element: (
      <ContentSlide
        kicker={C6}
        title="It Needs Swap"
        lead="Measured on this machine, before a single build started"
        lesson={SESSION}
      >
        <MemoryBar />
      </ContentSlide>
    ),
    notes:
      'These are real numbers from the build server. 133 MiB free with nothing happening is why the swap ' +
      'file is not optional. Builds will be slow, and they will finish.',
  },
  {
    id: 'c6-install',
    section: C6,
    label: 'Set it up',
    element: (
      <ContentSlide
        kicker={C6}
        title="Swap, Docker, Jenkins"
        lead="In that order, because each one needs the last"
        lesson={SESSION}
      >
        <ShellPanel
          title="The build server"
          prompt="ubuntu@ip-172-31-15-67:~$"
          fontSize={13}
          lines={[
            { text: 'sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile', kind: 'cmd' },
            { text: 'sudo mkswap /swapfile && sudo swapon /swapfile', kind: 'cmd' },
            { text: 'sudo apt-get update && sudo apt-get install -y docker.io docker-compose-v2', kind: 'cmd' },
            { text: 'sudo docker run -d --name jenkins --restart unless-stopped \\', kind: 'cmd' },
            /* continuation lines of the command above, so they take no prompt */
            { text: '  -p 8080:8080 -v jenkins_home:/var/jenkins_home \\', kind: 'out' },
            { text: '  -v /var/run/docker.sock:/var/run/docker.sock jenkins/jenkins:lts', kind: 'out' },
          ]}
          caption="The socket mount is what lets Jenkins build images, exactly as it did on your laptop"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c6-unlock',
    section: C6,
    label: 'Unlock it',
    element: (
      <ContentSlide
        kicker={C6}
        title="Unlock It"
        lead="Same first screen you saw when you installed Jenkins the first time"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/jen-08-unlock-jenkins.png"
          alt="The Unlock Jenkins screen asking for the administrator password"
          frameWidth={700}
          caption="Read the password from the server, then install the suggested plugins"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c6-nothing-transfers',
    section: C6,
    label: 'Nothing transfers',
    element: (
      <ContentSlide
        kicker={C6}
        title="Nothing Comes With It"
        lead="Your plugins, credentials and jobs live in the old Jenkins, and they stay there"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'What to create again' }, { label: 'It must be called', weight: 2 }]}
          rows={[
            ['The Docker Hub credential', 'dockerhub-credentials'],
            ['The SSH key credential', 'ec2-ssh-key'],
            ['The SSH Agent plugin', 'not installed by default'],
            ['The pipeline job', 'any name you like'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'This is the only time they do this. The old Jenkins is finished with after today, and the deploy ' +
      'stage is added here rather than there for exactly this reason.',
  },
  {
    id: 'c6-plugin',
    section: C6,
    label: 'The SSH Agent plugin',
    element: (
      <ContentSlide
        kicker={C6}
        title="Install the SSH Agent Plugin"
        lead="It is not one of the suggested plugins, and the Deploy stage will not work without it"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-23-ssh-agent-plugin.png"
          alt="The Jenkins plugin manager with SSH Agent found in the available plugins list"
          frameWidth={640}
          caption="Manage Jenkins → Plugins → Available plugins, then search for SSH Agent"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
    notes:
      'No restart is needed. Jenkins says so on the next screen.',
  },
  {
    id: 'c6-new-token',
    section: C6,
    label: 'A new Docker Hub token',
    element: (
      <ContentSlide
        kicker={C6}
        title="You Need a New Docker Hub Token"
        lead="You were told to delete the old one after you used it, and you should have"
        lesson={SESSION}
        points={[
          { text: 'Create a fresh token with read and write access', icon: 'key' },
          { text: 'Add it as a Username with password credential', icon: 'shield' },
          { text: 'Your Docker Hub ID is the username, the token is the password', icon: 'info' },
        ]}
      />
    ),
  },
  {
    id: 'c6-cred-store',
    section: C6,
    label: 'The credential store',
    element: (
      <ContentSlide
        kicker={C6}
        title="Where Credentials Live"
        lead="One drawer, shared by every job on this Jenkins"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-25-credentials-store.png"
          alt="The Jenkins global credentials store listing the stored credentials with an Add Credentials button"
          frameWidth={640}
          caption="Manage Jenkins → Credentials → System → Global → Add Credentials"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c6-credential-id',
    section: C6,
    label: 'The ID matters',
    element: (
      <ContentSlide
        kicker={C6}
        title="The ID Is Not a Label"
        lead="It is the name your Jenkinsfile calls. Get it wrong and the build cannot find it"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-26-credential-kinds.png"
          alt="The Add Credentials dialog showing the six kinds, including SSH Username with private key"
          frameWidth={520}
          caption="Leave the ID blank and Jenkins invents a random one. It cannot be changed later, so you would delete the credential and add it again"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'This happened during capture and cost a failed build with a confusing message.',
  },
  {
    id: 'c6-elastic-too',
    section: C6,
    label: 'This one needs an address too',
    element: (
      <ContentSlide
        kicker={C6}
        title="This Machine Needs a Permanent Address Too"
        lead="And for a sharper reason than the app server had"
        lesson={SESSION}
        points={[
          { text: 'GitHub stores this address in your webhook settings', icon: 'link' },
          { text: 'If it moves, GitHub keeps posting to an address that answers nothing', icon: 'warning' },
          { text: 'No error appears anywhere you are looking. Pushes just stop building', icon: 'cross' },
        ]}
      >
        <Callout kind="note" title="A silent break is worse than a loud one">
          The app server told you it was broken by not loading. This one will not tell you anything
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: 'c6-three-places-again',
    section: C6,
    label: 'Three places again',
    element: (
      <ContentSlide
        kicker={C6}
        title="Three Places, Again"
        lead="Allocate and attach a second Elastic IP, then change all three"
        lesson={SESSION}
        points={[
          { text: 'The webhook payload URL, in your GitHub repository settings', icon: 'link' },
          { text: "Jenkins's own record of its address, under Manage Jenkins then System", icon: 'settings' },
          { text: 'The host the Deploy stage connects to, later in this session', icon: 'terminal' },
        ]}
      >
        <Callout kind="warning" title="The middle one is the easy one to miss">
          Jenkins uses it for every link it puts in an email or a build page
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: 'c6-github-ranges',
    section: C6,
    label: 'Let GitHub in',
    element: (
      <ContentSlide
        kicker={C6}
        title="Let GitHub In"
        lead="Your group allows only your own address, so GitHub is still shut out"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/jen-09-github-webhook-ranges.png"
          alt="The jenkins-sg inbound rules with four additional rules on port 8080, one for each GitHub webhook range"
          frameWidth={760}
          caption="GitHub publishes the addresses its webhooks come from. Add one rule per range, all on 8080"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
    notes:
      'Four rules rather than opening 8080 to the world. Jenkins can start builds and read your code, so ' +
      'it is not a page you leave open to everyone.',
  },
  {
    id: 'c6-six-rules',
    section: C6,
    label: 'Six rules now',
    element: (
      <ContentSlide
        kicker={C6}
        title="Six Rules on the Build Server"
        lead="Two for you, and four so GitHub can knock"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/jen-10-jenkins-sg-six-rules.png"
          alt="The jenkins-sg security group showing six inbound rules, two from the developer address and four GitHub ranges on port 8080"
          frameWidth={760}
          caption="Your address on 22 and 8080, and the four published GitHub ranges on 8080"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c6-repoint',
    section: C6,
    label: 'Repoint the webhook',
    element: (
      <ContentSlide
        kicker={C6}
        title="Repoint the Webhook"
        lead="From the tunnel that no longer exists, to an address that will not move"
        lesson={SESSION}
      >
        <CodeBlock
          className="max-w-[840px]"
          filename="GitHub → your repository → Settings → Webhooks → Payload URL"
          language="text"
          code={`http://<your-jenkins-elastic-ip>:8080/github-webhook/`}
        />
        <Callout kind="warning" title="Both ends of that path matter">
          It is github-webhook, and it ends with a slash. Without either, GitHub gets an error and nothing
          builds
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: 'c6-direct',
    section: C6,
    label: 'A straight line now',
    element: (
      <ContentSlide
        kicker={C6}
        title="A Straight Line Now"
        lead="The same webhook, with the detour deleted"
        lesson={SESSION}
      >
        <NgrokDetour state="direct" />
      </ContentSlide>
    ),
    notes:
      'Put this next to the earlier frame if you can. The two pictures make the argument for moving ' +
      'Jenkins better than any sentence does.',
  },
  {
    id: 'c6-it-builds',
    section: C6,
    label: 'It builds',
    element: (
      <ContentSlide
        kicker={C6}
        title="Push Anything"
        lead="The build runs, and no laptop is involved at any point"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/jen-11-build-1-on-aws.png"
          alt="A Jenkins build on the EC2 server showing all stages green, started by a GitHub push"
          frameWidth={640}
          caption="Started by GitHub push. The tunnel is gone and nothing misses it"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c6-hook-log',
    section: C6,
    label: 'Proof it arrived',
    element: (
      <ContentSlide
        kicker={C6}
        title="Proof It Arrived"
        lead="Jenkins records the address the webhook came from"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/jen-17-github-hook-log.png"
          alt="The Jenkins GitHub hook log showing the delivery, the source address it came from and the URL it was posted to"
          frameWidth={640}
          caption="That address sits inside one of the four ranges you allowed a moment ago"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
    notes:
      'Worth pausing on. The rule they wrote and the traffic it allowed are on the same screen, so they can ' +
      'check the claim rather than take it.',
  },
  {
    id: 'c6-recap',
    section: C6,
    label: 'Recap',
    element: (
      <ContentSlide
        kicker={C6}
        title="What You Just Did"
        lead="Three things to take out of this part"
        lesson={SESSION}
        points={[
          { text: 'A build server needs a public address of its own. Then GitHub reaches it directly' },
          { text: 'Nothing transfers from the old Jenkins. Plugins, credentials and jobs are created once, here' },
          { text: 'It needs more disk and more memory than the app. Different job, different size' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 7 · SHIPPING A FIX ─────────────────────────────────────── */
  {
    id: 'c7-divider',
    section: C7,
    label: '07',
    element: <SectionBreakerSlide index={7} title={C7} lesson={SESSION} />,
  },
  {
    id: 'c7-back-to-empty',
    section: C7,
    label: 'Back to the empty list',
    element: (
      <ContentSlide
        kicker={C7}
        title="Back to the Empty List"
        lead="You have a pipeline you can trust now. Time to use it"
        lesson={SESSION}
      >
        <BrowserFrame
          className="mx-auto"
          src="/shots/dep-20-login-blocked-cors.png"
          alt="The application login page loaded over the public address, with nothing having arrived after signing in"
          url="http://<your-elastic-ip>:3000/"
          width={620}
          caption="The page loads. The data does not"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c7-open-console',
    section: C7,
    label: 'Ask the browser',
    element: (
      <ContentSlide
        kicker={C7}
        title="Ask the Browser"
        lead="The page says nothing. The console says exactly what is wrong"
        lesson={SESSION}
      >
        <ShellPanel
          title="Browser console"
          prompt=">"
          fontSize={13}
          lines={[
            { text: "Access to fetch at 'http://<your-address>:8000/api/users/login/'", kind: 'out' },
            { text: "from origin 'http://<your-address>:3000' has been blocked by", kind: 'out' },
            { text: 'CORS policy: No Access-Control-Allow-Origin header is present', kind: 'out' },
            { text: 'on the requested resource.', kind: 'out' },
          ]}
          caption="A word you already know, from the very first session of this course"
        />
      </ContentSlide>
    ),
    notes:
      'Let them name it. CORS was taught at the start of the course as the guard at the gate, and here it ' +
      'is guarding a gate they now own.',
  },
  {
    id: 'c7-two-bugs',
    section: C7,
    label: 'Two bugs, not one',
    element: (
      <ContentSlide
        kicker={C7}
        title="There Were Two Bugs"
        lead="You fixed one of them earlier without seeing this message"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'What the browser said' }, { label: 'What it meant', weight: 2 }, { label: 'Fixed by', weight: 2 }]}
          rows={[
            ['Connection refused', 'the request went to the visitor own machine', 'pointing the frontend at the real address'],
            ['Blocked by CORS policy', 'it reached the API, and the API refused to answer', 'still to do'],
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c7-whose-localhost',
    section: C7,
    label: 'Whose localhost',
    element: (
      <ContentSlide
        kicker={C7}
        title="Whose localhost?"
        lead="The first bug, drawn. The frontend runs in the visitor browser, not on your server"
        lesson={SESSION}
      >
        <WhoseLocalhost />
      </ContentSlide>
    ),
    notes:
      'This catches almost everyone once. The page comes FROM the server, and then it runs on the visitor ' +
      'machine, so localhost is theirs.',
  },
  {
    id: 'c7-refused-shot',
    section: C7,
    label: 'The refused error',
    element: (
      <ContentSlide
        kicker={C7}
        title="What the First Bug Looked Like"
        lead="Before the address was fixed, the console said something different"
        lesson={SESSION}
      >
        <BrowserFrame
          className="mx-auto"
          src="/shots/dep-13-login-fails-localhost.png"
          alt="The application login page with the browser console showing a connection refused error against localhost port 8000"
          url="http://<your-address>:3000/"
          width={620}
          caption="Refused, and instantly. The request reached a machine, and nothing was listening on it"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c7-refused-decoder',
    section: C7,
    label: 'Refused, not timed out',
    element: (
      <ContentSlide
        kicker={C7}
        title="Refused, Not Timed Out"
        lead="Your decoder from earlier, on a real failure"
        lesson={SESSION}
      >
        <TimeoutVsRefused show="refused" />
      </ContentSlide>
    ),
  },
  {
    id: 'c7-cannot-fix-here',
    section: C7,
    label: 'This one is sealed in',
    element: (
      <ContentSlide
        kicker={C7}
        title="This One Cannot Be Fixed on the Server"
        lead="The allowed origin list lives in settings.py, and settings.py is inside the image"
        lesson={SESSION}
      >
        <InsideTheImage />
      </ContentSlide>
    ),
  },
  {
    id: 'c7-the-fix',
    section: C7,
    label: 'One line of source',
    element: (
      <ContentSlide
        kicker={C7}
        title="One Line, in the Source"
        lead="Add the address the browser is actually coming from"
        lesson={SESSION}
      >
        <CodeBlock
          className="max-w-[840px]"
          filename="backend/myproject/settings.py, on your machine"
          language="python"
          code={`CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://<your-elastic-ip>:3000",
]`}
        />
        <Callout kind="note" title="Keep the localhost line">
          You still run this app on your own machine. Both origins are allowed, and neither breaks the other
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: 'c7-push-it',
    section: C7,
    label: 'Push it',
    element: (
      <ContentSlide
        kicker={C7}
        title="Push It"
        lead="The same three commands you have used since the Git session"
        lesson={SESSION}
      >
        <ShellPanel
          title="Your machine"
          prompt={LOCAL_PROMPT}
          fontSize={15}
          lines={[
            { text: 'git add backend/myproject/settings.py', kind: 'cmd' },
            { text: 'git commit -m "Allow the deployed frontend origin through CORS"', kind: 'cmd' },
            { text: 'git push origin main', kind: 'cmd' },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c7-hub-fast',
    section: C7,
    label: 'Docker Hub, in seconds',
    element: (
      <ContentSlide
        kicker={C7}
        title="Docker Hub Has It Already"
        lead="The webhook fired, the stages ran, and a new tag appeared in well under a minute"
        lesson={SESSION}
        points={[
          { text: 'Checkout, Build and Push all went green', icon: 'check' },
          { text: 'A new image tag is waiting, named after the build number', icon: 'rocket' },
          { text: 'Nobody typed anything after git push', icon: 'bolt' },
        ]}
      />
    ),
  },
  {
    id: 'c7-server-unchanged',
    section: C7,
    label: 'The server did not change',
    element: (
      <ContentSlide
        kicker={C7}
        title="And the Server Did Not Change"
        lead="It is still running the old image, and the product list is still empty"
        lesson={SESSION}
      >
        <ShellPanel
          title="The instance"
          prompt={REMOTE_PROMPT}
          fontSize={14}
          lines={[
            { text: "docker compose ps --format '{{.Service}} {{.Image}}'", kind: 'cmd' },
            { text: 'backend   <your-docker-id>/nxttrendz-backend:6', kind: 'out' },
            { text: 'frontend  <your-docker-id>/nxttrendz-frontend:6', kind: 'out' },
          ]}
          caption="Docker Hub has the new build. This machine has never heard of it"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c7-last-mile',
    section: C7,
    label: 'The last mile',
    element: (
      <ContentSlide
        kicker={C7}
        title="The Last Mile"
        lead="Your pipeline stops at Docker Hub. Somebody has to carry it the rest of the way"
        lesson={SESSION}
      >
        <LastMile />
      </ContentSlide>
    ),
  },
  {
    id: 'c7-by-hand',
    section: C7,
    label: 'Do it by hand, once',
    element: (
      <ContentSlide
        kicker={C7}
        title="Do It by Hand, Once"
        lead="So that you know exactly what you are about to automate"
        lesson={SESSION}
      >
        <ShellPanel
          title="The instance"
          prompt={REMOTE_PROMPT}
          fontSize={14}
          lines={[
            { text: 'nano docker-compose.yml', kind: 'cmd' },
            { text: 'docker compose pull', kind: 'cmd' },
            { text: 'docker compose up -d', kind: 'cmd' },
            { text: ' Container nxttrendz-backend-1   Started', kind: 'out' },
            { text: ' Container nxttrendz-frontend-1  Started', kind: 'out' },
          ]}
          caption="Change the tag, pull the new images, recreate the containers"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c7-it-works',
    section: C7,
    label: 'It works',
    element: (
      <ContentSlide
        kicker={C7}
        title="It Works"
        lead="Your app, with your data, on the public internet"
        lesson={SESSION}
      >
        <BrowserFrame
          className="mx-auto"
          src="/shots/dep-22-products-live.png"
          alt="The application product list loaded over the public address, showing real products with prices and ratings"
          url="http://<your-elastic-ip>:3000/"
          width={620}
          caption="Open it on a phone. Send the address to somebody"
        />
      </ContentSlide>
    ),
    notes: 'Let them enjoy this one. It is the moment the course has been building to since the first session.',
  },
  {
    id: 'c7-tag-variable',
    section: C7,
    label: 'Make the tag a variable',
    element: (
      <ContentSlide
        kicker={C7}
        title="Make the Tag a Variable"
        lead="A script cannot edit a YAML file easily. It can change one line in a text file"
        lesson={SESSION}
      >
        <CodeBlock
          className="max-w-[840px]"
          filename="docker-compose.yml and .env, on the server"
          language="yaml"
          code={`    image: <your-docker-id>/nxttrendz-backend:\${IMAGE_TAG}
    image: <your-docker-id>/nxttrendz-frontend:\${IMAGE_TAG}

# and in .env beside it
IMAGE_TAG=6`}
        />
      </ContentSlide>
    ),
    notes:
      'This is why the Deploy stage ends up being four short commands rather than a YAML editing exercise. ' +
      'The file was written to make the deploy easy.',
  },
  {
    id: 'c7-deploy-stage',
    section: C7,
    label: 'The Deploy stage',
    element: (
      <ContentSlide
        kicker={C7}
        title="A Fourth Stage"
        lead="It does exactly what you just did, in the same order"
        lesson={SESSION}
      >
        <CodeBlock
          className="max-w-[840px]"
          filename="Jenkinsfile, after the Push stage"
          language="groovy"
          code={`stage('Deploy') {
    steps {
        sshagent(['ec2-ssh-key']) {
            sh '''
                ssh -o StrictHostKeyChecking=no ubuntu@$EC2_HOST "
                    cd ~/nxttrendz &&
                    sed -i 's/^IMAGE_TAG=.*/IMAGE_TAG=$BUILD_NUMBER/' .env &&
                    docker compose pull &&
                    docker compose up -d
                "
            '''
        }
    }
}`}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c7-private-address',
    section: C7,
    label: 'Over the private network',
    element: (
      <ContentSlide
        kicker={C7}
        title="It Uses the Private Address"
        lead="Both machines are in the same network, so this traffic never touches the internet"
        lesson={SESSION}
        points={[
          { text: 'The Elastic IP is for the outside world, not for your own machines', icon: 'globe' },
          { text: 'The private address never changes, so nothing has to be updated', icon: 'check' },
          { text: 'StrictHostKeyChecking=no stops SSH asking a question no script can answer', icon: 'terminal' },
        ]}
      />
    ),
  },
  {
    id: 'c7-group-as-source',
    section: C7,
    label: 'A rule with no address',
    element: (
      <ContentSlide
        kicker={C7}
        title="A Rule With No Address in It"
        lead="Allow port 22 from the build server's security group, rather than from an address"
        lesson={SESSION}
      >
        <GroupAsSource />
      </ContentSlide>
    ),
  },
  {
    id: 'c7-group-as-source-shot',
    section: C7,
    label: 'The rule in the console',
    element: (
      <ContentSlide
        kicker={C7}
        title="What That Looks Like"
        lead="The Source column holds a group name where every other row holds an address"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/jen-06-sg-source-is-jenkins-sg.png"
          alt="The app server's inbound rules gaining a new SSH rule whose source is the jenkins-sg security group rather than a CIDR block"
          frameWidth={760}
          caption="Any machine in that group may connect, and no address is written down anywhere"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
    notes:
      'This is the best idea in the session. Replace the build server tomorrow and this rule still works, ' +
      'because it never named a machine.',
  },
  {
    id: 'c7-five-rules',
    section: C7,
    label: 'Five rules now',
    element: (
      <ContentSlide
        kicker={C7}
        title="The App Server Now Has Five"
        lead="And the new one names a group where every other rule names an address"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/jen-07-app-sg-five-rules.png"
          alt="The app server security group with five inbound rules, the new one showing a security group as its source instead of a CIDR block"
          frameWidth={760}
          caption="Look at the Source column. One of these is not an address"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c7-four-stages',
    section: C7,
    label: 'Four stages',
    element: (
      <ContentSlide
        kicker={C7}
        title="Push Again"
        lead="Four stages, and nobody logs in to anything"
        lesson={SESSION}
      >
        <LastMile bridged />
      </ContentSlide>
    ),
  },
  {
    id: 'c7-deploy-log',
    section: C7,
    label: 'The deploy log',
    element: (
      <ContentSlide
        kicker={C7}
        title="The Deploy Log"
        lead="The last stage, doing by itself what you did by hand ten minutes ago"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-29-five-stages-deploy-log.png"
          alt="The Jenkins stages view with every stage green, and the Deploy stage log showing the ssh command, the pull and both containers being recreated"
          frameWidth={640}
          caption="Read the log. It is the same four commands, in the same order"
          className="mr-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c7-arch',
    section: C7,
    label: 'The whole system',
    element: (
      <ContentSlide
        kicker={C7}
        title="The Whole System"
        lead="One push, four stages, and an app on an address that never moves"
        lesson={SESSION}
      >
        <div className="mt-8"><CloudArchitecture state="finished" scale={ARCH} /></div>
      </ContentSlide>
    ),
  },
  {
    id: 'c7-cd',
    section: C7,
    label: 'Continuous Deployment',
    element: (
      <ContentSlide
        kicker={C7}
        title="Continuous Deployment"
        lead="You have been saying the words since the Jenkins session. Now you have built it"
        lesson={SESSION}
        points={[
          { text: 'A code change becomes a live release', icon: 'rocket' },
          { text: 'With no human action after git push', icon: 'check' },
          { text: 'And any release can be rolled back, because every build has its own tag', icon: 'shield' },
        ]}
      />
    ),
  },
  {
    id: 'c7-recap',
    section: C7,
    label: 'Recap',
    element: (
      <ContentSlide
        kicker={C7}
        title="What You Just Did"
        lead="Three things to take out of this part"
        lesson={SESSION}
        points={[
          { text: 'Some things can be fixed on the server, some cannot. Anything inside an image needs a new image' },
          { text: 'A pipeline that stops at the registry is not finished. Somebody is still carrying the last mile' },
          { text: 'Server to server rules can name a group, not an address. Then nothing needs re-pinning' },
        ]}
      />
    ),
  },

  /* ── CLOSING ────────────────────────────────────────────────────────── */
  {
    id: 'close-rename-form',
    section: 'Closing',
    label: 'The rename form',
    element: (
      <ContentSlide
        kicker={'Closing'}
        title="Rename It"
        lead="Jenkins refuses a name that is the same as the current one, which is a useful check"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/jen-14-rename-form.png"
          alt="The Jenkins rename form with the current job name in the field and a warning that the new name is the same as the current name"
          frameWidth={460}
          caption="The job page → Rename"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'close-rename',
    section: 'Closing',
    label: 'Rename the job',
    element: (
      <ContentSlide
        kicker={CLOSING_KICKER}
        title="Give the Job an Honest Name"
        lead="It has been called build-test since the Jenkins session, and there is no test stage in it"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/jen-16-renamed.png"
          alt="The Jenkins job after renaming, with its build history intact"
          frameWidth={460}
          caption="The build history survives, and so does the webhook, because GitHub matches on the repository"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'close-live',
    section: 'Closing',
    label: 'Live, deployed by itself',
    element: (
      <ContentSlide
        kicker={'Closing'}
        title="Live, and Nobody Deployed It"
        lead="This build reached your users without anyone opening a terminal"
        lesson={SESSION}
      >
        <BrowserFrame
          className="mx-auto"
          src="/shots/jen-12-live-after-aws-deploy.png"
          alt="The application product list loaded over the public address after an automatic deployment"
          url="http://<your-elastic-ip>:3000/"
          width={620}
          caption="The last change you made arrived here on its own"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'close-layers',
    section: 'Closing',
    label: 'What each layer removed',
    element: (
      <ContentSlide
        kicker={CLOSING_KICKER}
        title="What Each Layer Removed"
        lead="Every one of these was a real problem before you solved it"
        lesson={SESSION}
      >
        <DataTable
          compact
          columns={[{ label: 'What you built' }, { label: 'The problem it removed', weight: 2 }]}
          rows={[
            ['A Docker image', 'it works on my machine'],
            ['A compose file', 'remembering the start up order'],
            ['Docker Hub', 'images trapped on one computer'],
            ['A Jenkins pipeline', 'forgetting a step under pressure'],
            ['A webhook', 'even having to press the button'],
            ['EC2 and a security group', 'no public machine, and the wrong people reaching it'],
            ['An Elastic IP', 'an address that moved under you'],
            ['Jenkins on EC2', 'a laptop being part of production'],
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'close-hardening',
    section: 'Closing',
    label: 'Hardening checklist',
    element: (
      <ContentSlide
        kicker={CLOSING_KICKER}
        title="Nine Things You Already Did Right"
        lead="Most security is ordinary discipline applied every time, not a separate tool"
        lesson={SESSION}
      >
        <DataTable
          compact
          columns={[{ label: '' }, { label: 'What you did', weight: 3 }]}
          rows={[
            ['1', 'SSH open to your address only, never to everyone'],
            ['2', 'The database has no port and no rule'],
            ['3', 'Key based login only, with the key readable by you alone'],
            ['4', 'Secrets in .env and the credential store, and .dockerignore keeps them out of images'],
            ['5', 'Machines authenticate with tokens you can revoke, not passwords'],
            ['6', 'A unique tag per build, so any release can be rolled back'],
            ['7', 'The server runs image, never build'],
            ['8', 'Server to server access named a group, not an address'],
            ['9', 'Elastic IPs attached, and instances stopped when idle'],
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'close-shut-down',
    section: 'Closing',
    label: 'Before you leave',
    element: (
      <ContentSlide
        kicker={CLOSING_KICKER}
        title="Before You Close the Laptop"
        lead="Both instances and both addresses cost money while they exist"
        lesson={SESSION}
        points={[
          { text: 'Stop both instances, the app server and the build server', icon: 'target' },
          { text: 'Release both Elastic IPs, because a detached one is billed', icon: 'warning' },
          { text: 'Your images stay on Docker Hub, and cost nothing', icon: 'check' },
        ]}
      />
    ),
    notes:
      'Do this together, on screen, before anyone leaves. Releasing the addresses is the step people forget ' +
      'and it is the one that shows up on a bill.',
  },
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Key takeaways',
    element: (
      <KeyTakeawaysSlide
        lesson={SESSION}
        points={[
          { text: C1, sub: 'Your commands, run on a machine elsewhere' },
          { text: C2, sub: 'A new server starts empty' },
          { text: C3, sub: 'It runs what the pipeline built' },
          { text: C4, sub: 'Nothing is open until you open it' },
          { text: C5, sub: 'An address in a file must stop moving' },
          { text: C6, sub: 'It needs an address of its own' },
          { text: C7, sub: 'Stopping at the registry is not finished' },
        ]}
      />
    ),
    notes: 'Hard rule 20: these are the seven divider names, in order, and nothing else.',
  },
  {
    id: 'practice',
    section: 'Closing',
    label: 'Practice',
    element: (
      <PracticeSlide
        lesson={SESSION}
        title="Practice"
        prompt="Three things to try before the next session"
        tasks={[
          { text: 'Stop your instance, start it again, and check the site still loads. The Elastic IP should make this uneventful' },
          { text: 'Break something on purpose and read the symptom. Remove the 3000 rule, and confirm you get a timeout rather than a refusal' },
          { text: 'Change one word in the app and push it. Watch four stages and then reload the site' },
        ]}
      />
    ),
  },
  {
    id: 'whats-next',
    section: 'Closing',
    label: 'Where this leads',
    element: (
      <ContentSlide
        kicker={CLOSING_KICKER}
        title="Where This Leads"
        lead="You started this course with an app on localhost. You are ending it with a service on the internet"
        lesson={SESSION}
        points={[
          { text: 'A domain name and HTTPS in front of the address you now own', icon: 'globe' },
          { text: 'A managed database instead of a file, when the data matters more', icon: 'database' },
          { text: 'More servers, and something to coordinate them, when one is not enough', icon: 'network' },
        ]}
      >
        <Callout kind="success" title="None of that replaces what you built">
          Every one of those tools assumes you already understand images, registries, pipelines, gates and
          firewalls. You do
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: 'feedback',
    section: 'Closing',
    label: 'Feedback',
    element: (
      <FeedbackSlide
        lesson={SESSION}
        title="How did this session land?"
        prompt="Two minutes of feedback makes the next one sharper."
      />
    ),
  },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide lesson={SESSION} /> },
]

export const awsDeployMeta: DeckMeta = {
  title: SESSION,
  course: 'React + Django Integration · Deployment',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
}
