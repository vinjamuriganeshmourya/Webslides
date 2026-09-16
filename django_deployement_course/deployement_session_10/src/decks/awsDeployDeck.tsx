import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
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
import { Callout, CodeBlock, DataTable } from '@/ui'
import { AnnotatedShot } from './figures/AnnotatedShot'
import { ShellPanel } from './figures/ShellPanel'
import { CloudArchitecture } from './figures/aws/CloudArchitecture'
import { Permissions } from './figures/Permissions'
import { TimeoutVsRefused } from './figures/TimeoutVsRefused'
import { ThreePlaces } from './figures/ThreePlaces'
import { SG_THREE_RULES, SG_PORT_COLUMN, SG_RULE_3000, SG_NEW_ROW_FORM } from './shotBoxes'
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
      <RecapSlide
        kicker="Recap"
        title="Where We Left Off"
        lesson={SESSION}
        points={[
          { text: 'Two images sit on Docker Hub', sub: 'Jenkins built them and pushed them for you' },
          { text: 'An EC2 instance sits in Mumbai', sub: 'Launched last session, then stopped' },
          { text: 'Nothing connects the two', sub: 'That is the whole of today' },
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
        <CloudArchitecture state="gap" scale={ARCH} />
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
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes: 'Stop instance is greyed out, which is how you know it really is stopped.',
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
        points={[
          { text: `-i ${KEY_FILE} is the key, your half of the pair`, icon: 'key' },
          { text: `${SSH_USER}@ is the user. Ubuntu images always use this name, and it is not root`, icon: 'lock' },
          { text: 'The address is the machine. It is the one that keeps changing', icon: 'globe' },
        ]}
      />
    ),
  },
  {
    id: 'c1-recap',
    section: C1,
    label: 'Recap',
    element: (
      <RecapSlide
        kicker={C1}
        title={C1}
        lesson={SESSION}
        points={[
          { text: 'SSH runs your commands on a machine somewhere else', sub: 'You type here, it runs there' },
          { text: 'The key file must be readable only by you', sub: 'chmod 400, or SSH will not use it' },
          { text: 'The prompt tells you which machine you are on', sub: 'Check it before you run anything' },
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
      <RecapSlide
        kicker={C2}
        title={C2}
        lesson={SESSION}
        points={[
          { text: 'A new server starts with nothing on it', sub: 'You install Docker once, per server' },
          { text: 'Group changes need a fresh login', sub: 'exit, then connect again' },
          { text: 'The server pulls images by name', sub: 'It never sees your source code' },
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
        <CloudArchitecture state="containers" scale={ARCH} />
      </ContentSlide>
    ),
  },
  {
    id: 'c3-one-word',
    section: C3,
    label: 'One word per service',
    element: (
      <ContentSlide
        kicker={C3}
        title="One Word Changes"
        lead="It is your own compose file, with build swapped for image on each service"
        lesson={SESSION}
      >
        <CodeBlock
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
        title="Why image and Not build"
        lead="The server runs what the pipeline built. It does not build its own copy"
        lesson={SESSION}
        points={[
          { text: 'build: would make the server compile its own version', icon: 'warning' },
          { text: 'Nothing has tested that version, because it did not exist until now', icon: 'cross' },
          { text: 'image: runs the exact thing that passed', icon: 'check' },
        ]}
      />
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
        lead="On this server it holds one line"
        lesson={SESSION}
      >
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
          frameWidth={700}
          caption="Nothing. It waits about fifteen seconds and gives up"
          className="mx-auto w-fit"
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
    id: 'c3-recap',
    section: C3,
    label: 'Recap',
    element: (
      <RecapSlide
        kicker={C3}
        title={C3}
        lesson={SESSION}
        points={[
          { text: 'The server runs images, it does not build them', sub: 'image: instead of build:' },
          { text: 'A new volume starts empty', sub: 'Run migrate once' },
          { text: 'It is running, and it is not reachable', sub: 'Those are two different things' },
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
        lead="A firewall in front of your instance. You met it as the door list when you launched"
        lesson={SESSION}
        points={[
          { text: 'Nothing is open until you open it', icon: 'lock' },
          { text: 'You can only allow. There is no rule that blocks', icon: 'shield' },
          { text: 'Traffic going out is already allowed', icon: 'arrow' },
        ]}
      />
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
        <Callout kind="success" title="Out is open, in is closed">
          A server reaching out to the internet is allowed by default. The internet reaching in is not.
          That is why pulling an image needed nothing, and serving a page needs a rule
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
        points={[
          { text: '0.0.0.0/0 means every address on the internet', icon: 'globe' },
          { text: '49.200.108.250/32 means exactly one address, and that one is yours', icon: 'target' },
          { text: 'The console fills in your own address when you pick My IP', icon: 'info' },
        ]}
      />
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
          frameWidth={760}
          caption="EC2 → Security Groups → your group → Inbound rules"
          className="mx-auto w-fit"
        />
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
          frameWidth={760}
          caption="The frontend listens on 3000, and nothing is allowed to reach it"
          className="mx-auto w-fit"
        />
      </ContentSlide>
    ),
    notes:
      'The highlight is the column, not a rule, because the failure is about what is MISSING from it. That ' +
      'is also why 8000 answered: it has a rule and 3000 does not.',
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
          frameWidth={780}
          caption="EC2 → Security Groups → your group → Edit inbound rules → Add rule"
          className="mx-auto w-fit"
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
          className="mx-auto w-fit"
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
          frameWidth={760}
          caption="The browser tab that had been waiting loaded while this banner was still on screen"
          className="mx-auto w-fit"
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
        <AnnotatedShot
          src="/shots/dep-12-site-loads-empty.png"
          alt="The NxtTrendz login page loading in a browser over the public address"
          frameWidth={700}
          caption="Reload the tab that was waiting. No restart was needed"
          className="mx-auto w-fit"
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
        <CloudArchitecture state="doors" scale={ARCH} />
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
    id: 'c4-decoder',
    section: C4,
    label: 'Timeout against refused',
    element: (
      <ContentSlide
        kicker={C4}
        title="Timeout Against Refused"
        lead="Two failures that look alike and mean opposite things"
        lesson={SESSION}
      >
        <TimeoutVsRefused />
      </ContentSlide>
    ),
    notes:
      'They have already seen the top row today. They will see the bottom row later in the session, on the ' +
      'login request. Point back to this slide when it happens.',
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
      <RecapSlide
        kicker={C4}
        title={C4}
        lesson={SESSION}
        points={[
          { text: 'Nothing is open until you open it', sub: 'And you can only allow, never block' },
          { text: 'Every open port needs a reason you can say out loud', sub: 'The database needs no port at all' },
          { text: 'Timeout is the firewall, refused is the app', sub: 'Two symptoms, two places to look' },
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
        <CloudArchitecture state="elastic" scale={ARCH} />
      </ContentSlide>
    ),
  },
  {
    id: 'c5-allocate',
    section: C5,
    label: 'Allocate it',
    element: (
      <ContentSlide
        kicker={C5}
        title="Allocate It"
        lead="Reserve an address from Amazon's pool. It belongs to your account now"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-16-allocated.png"
          alt="The Elastic IP addresses list showing one allocated address, with the Associated instance ID column empty"
          frameWidth={760}
          caption="EC2 → Elastic IPs → Allocate Elastic IP address"
          className="mx-auto w-fit"
        />
        <Callout kind="warning" title="Look at the Associated instance column">
          It is empty. An address you hold and do not use is the one state AWS charges for
        </Callout>
      </ContentSlide>
    ),
  },
  {
    id: 'c5-associate',
    section: C5,
    label: 'Associate it',
    element: (
      <ContentSlide
        kicker={C5}
        title="Attach It to the Instance"
        lead="Now it is the instance's address, and it stays that way through a stop and start"
        lesson={SESSION}
      >
        <AnnotatedShot
          src="/shots/dep-19-associated.png"
          alt="The Elastic IP now showing an associated instance ID and the instance's private address beside it"
          frameWidth={760}
          caption="Actions → Associate Elastic IP address → choose the instance"
          className="mx-auto w-fit"
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
      <RecapSlide
        kicker={C5}
        title={C5}
        lesson={SESSION}
        points={[
          { text: 'A free public address changes on every stop', sub: 'The private one never does' },
          { text: 'It matters because the address gets written into files', sub: 'One of them is inside an image' },
          { text: 'An Elastic IP is free while attached', sub: 'Release it when you are done' },
        ]}
      />
    ),
  },
]

export const awsDeployMeta: DeckMeta = {
  title: SESSION,
  course: 'React + Django Integration · Deployment',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
}
