import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  CommandSyntaxSlide,
  ContentNoteSlide,
  ContentSlide,
  KeyTakeawaysSlide,
  ProceduralStepsSlide,
  SectionBreakerSlide,
  StatusPointsSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import {
  CodeBlock,
  DataTable,
  FileTree,
  GateFlow,
  MachineBoundary,
  Shot,
  SocketBridge,
  StatusList,
  Terminal,
  TunnelPath,
} from '@/ui'
import {
  C1, C2, C3, C4, CLOSING_KICKER, DEV_DOMAIN, DOCKER_ID, PendingShot, ROOT, SESSION,
} from './deckShared'

/**
 * DEPLOYMENT SESSION 8 — "Setting Up Jenkins for Docker Builds", rev2
 *
 * Plan: `../../session_plans/deployement_session_8/plan.md`, rev2 2026-09-11.
 * 88 slides. The whole Jenkins flow: Docker access, credentials, GitHub and the
 * webhook through a tunnel, then the full Jenkinsfile with Checkout, Test,
 * Build and Push, and a failure stopping the line. The sessions after this one
 * start AWS.
 *
 * FIVE THINGS AN EDIT HERE IS MOST LIKELY TO BREAK
 *
 *   1. Rule 29. A title is the topic in two or three words. A lead states the
 *      fact and never ends in a remark about the fact. The first cut of this
 *      deck shipped "The Job That Cannot Do the Job"; the user called it company
 *      presentation voice. Every title below is the plan's title, verbatim.
 *
 *   2. Rule 30. Every UI walk-through carries a screenshot. Nineteen are not
 *      captured yet and render `PendingShot`, a dashed frame that cannot pass
 *      for finished. The deck is not done while one of them shows.
 *
 *   3. Rule 31. Every `CodeBlock` names its file path or its place in the UI.
 *      Console Output is never a shell: it is a `CodeBlock` located at
 *      `Jenkins → job → #n → Console Output` until its `Shot` lands.
 *
 *   4. Rule 2b. No other session is named in a rendered string. TR 9 says
 *      "last session" and "next session" freely; every one is rewritten to
 *      name the thing. Notes are exempt.
 *
 *   5. Rule 18 is overridden here on instruction. No quiz frames.
 *
 * ALSO: no spaced em dash (rule 1), and never the word "stranger" (rule 2).
 */

export const jenkinsDockerMeta: DeckMeta = {
  title: SESSION,
  course: 'React + Django Integration · Deployment',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
}

const JF = 'nxttrendz/Jenkinsfile'
const REPO = `https://github.com/${DOCKER_ID}/nxttrendz.git`

export const jenkinsDockerDeck: SlideDef[] = [
  /* ═══ FRONT, 5 ═══════════════════════════════════════════════════════ */
  {
    id: 'brand', section: 'Opening', label: 'Brand',
    element: <BrandSlide greeting="Welcome" lesson={SESSION} />,
  },
  {
    id: 'session-name', section: 'Opening', label: 'Session name',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
  },
  {
    id: 'where-we-left-off', section: 'Opening', label: 'Where we left off',
    element: (
      <ContentSlide kicker="Where We Left Off" title="Where We Left Off" lead="Jenkins runs. It has one job, and that job prints one line" lesson={SESSION}>
        <StatusList immediate items={[
          { status: 'success', text: 'The nxttrendz project is on GitHub', detail: 'Pushed to a remote. The .env file is not in the repository' },
          { status: 'success', text: 'Jenkins runs in a container', detail: 'Its settings live in the jenkins_home volume and survive a restart' },
          { status: 'success', text: 'The hello-jenkins job builds green', detail: 'It prints one line. It proves the server works and nothing more' },
          { status: 'error', text: 'Jenkins cannot fetch, test, build or push your project', detail: 'Four things are missing. This session adds all four' },
        ]} />
      </ContentSlide>
    ),
    notes: 'Rule 2b: the slide does not say "last session". You can say it out loud.',
  },
  {
    id: 'agenda', section: 'Opening', label: 'Agenda',
    element: (
      <AgendaSlide kicker="Agenda" title="Agenda" lesson={SESSION} items={[
        { title: C1, sub: 'Let Jenkins run docker commands' },
        { title: C2, sub: 'Passwords that never appear in a log' },
        { title: C3, sub: 'The repository, and a push that starts a build' },
        { title: C4, sub: 'Checkout, Test, Build, Push, in one file' },
      ]} />
    ),
  },
  {
    id: 'what-jenkins-needs', section: 'Opening', label: 'What Jenkins needs',
    element: (
      <ContentSlide kicker="Where We Left Off" title="What Jenkins Needs" lead="Each stage of the pipeline needs one thing Jenkins does not have yet" lesson={SESSION}>
        <DataTable columns={[{ label: 'Stage' }, { label: 'Jenkins needs' }, { label: 'Has it?' }]} rows={[
          ['Fetch the code', 'Permission to read the GitHub repository', 'No'],
          ['Test the code', 'The SECRET_KEY that lives in .env', 'No'],
          ['Build the images', 'The ability to run docker commands', 'No'],
          ['Push to Docker Hub', 'A Docker Hub login', 'No'],
        ]} />
      </ContentSlide>
    ),
    notes: 'Three of the four are passwords or permissions. We close them in order of difficulty: Docker access first, then the two secrets, then GitHub.',
  },

  /* ═══ CONCEPT 1 · Docker Access, 11 ═════════════════════════════════ */
  { id: 'c1-divider', section: C1, label: '01', element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} /> },
  {
    id: 'c1-not-found', section: C1, label: 'docker: not found',
    element: (
      <ContentSlide kicker={C1} title="docker: not found" lead="Add a docker command to the hello-jenkins job. The build fails with this error" lesson={SESSION}>
        <CodeBlock filename="Jenkins → hello-jenkins → #2 → Console Output" language="text" showLineNumbers={false} code={`+ docker build -t nxttrendz-backend .
/var/jenkins_home/workspace/hello-jenkins@tmp/script.sh: 1:
docker: not found
Build step 'Execute shell' marked build as failure
Finished: FAILURE`} />
      </ContentSlide>
    ),
    notes: 'CAPTURE pending, slide 7: the real Console Output page. Rule 31: this is browser output, so it is a located code panel and never a shell. Ask the room what is missing before the next slide.',
  },
  {
    id: 'c1-docker-inside-docker', section: C1, label: 'Docker inside Docker?',
    element: (
      <ContentNoteSlide kicker={C1} title="Docker Inside Docker?" lead="The first idea is to install a full Docker Engine inside the Jenkins container" lesson={SESSION} points={[
        { text: 'Jenkins runs inside a container', icon: 'info' },
        { text: 'The pipeline needs to run docker build', icon: 'info' },
        { text: 'A second engine inside the container builds images that are trapped inside it', icon: 'warning' },
      ]} note={{ kind: 'warning', title: 'Heavy, and not needed', body: 'There is a lighter way. It starts with one fact about what the word docker means.' }} />
    ),
  },
  {
    id: 'c1-client-and-daemon', section: C1, label: 'Client and daemon',
    element: (
      <ContentSlide kicker={C1} title="Client and Daemon" lead="The docker command is a small client. A separate program, the daemon, does the work" lesson={SESSION}>
        <SocketBridge />
      </ContentSlide>
    ),
    notes: 'Every docker command they have ever typed was the client sending a message through /var/run/docker.sock to the engine. Say the path out loud.',
  },
  {
    id: 'c1-only-the-client', section: C1, label: 'Only the client',
    element: (
      <ContentSlide kicker={C1} title="Only the Client" lead="Jenkins needs the docker client, and a way to reach the daemon already running on your machine" lesson={SESSION}>
        <StatusList items={[
          { status: 'error', text: 'A second Docker Engine inside Jenkins', detail: 'Heavy, and its images are stuck inside', label: 'No' },
          { status: 'success', text: 'The docker client inside Jenkins', detail: 'A small program that sends requests', label: 'Yes' },
          { status: 'success', text: 'The socket file from your machine, mounted in', detail: 'The -v flag, pointed at a file instead of a volume', label: 'Yes' },
        ]} />
      </ContentSlide>
    ),
  },
  {
    id: 'c1-restart-jenkins', section: C1, label: 'Restart Jenkins',
    element: (
      <ContentSlide kicker={C1} title="Restart Jenkins" lead="Stop the container, remove it, and run it again with the socket mounted" lesson={SESSION}>
        <Terminal path={ROOT} lines={[
          { text: 'docker stop jenkins && docker rm jenkins', kind: 'cmd' },
          { text: 'jenkins', kind: 'out' },
          { text: 'jenkins', kind: 'out' },
          { text: 'docker run -d --name jenkins -p 8080:8080 -p 50000:50000 \\', kind: 'cmd' },
          { text: '  -v jenkins_home:/var/jenkins_home \\', kind: 'cmd' },
          { text: '  -v /var/run/docker.sock:/var/run/docker.sock \\', kind: 'cmd' },
          { text: '  jenkins/jenkins:lts', kind: 'cmd' },
          { text: '9f2c4b8e1a7d3c5f6b0a2e4d8c1f3a5b7d9e0c2a4f6b8d1e3c5a7f9b0d2e4c6a', kind: 'ok' },
        ]} caption="Removing the container is safe. Every setting is in the jenkins_home volume" />
      </ContentSlide>
    ),
    notes: 'Say why removing it is safe before anyone panics: admin user, plugins and the job all live in the volume, and the new container attaches to it.',
  },
  {
    id: 'c1-socket-mount', section: C1, label: 'The socket mount',
    element: (
      <CommandSyntaxSlide kicker={C1} title="The Socket Mount" lead="One flag. It has the same shape as every volume mount you have written" lesson={SESSION} parts={[
        { token: '-v', label: 'mount flag', body: 'Make a file or folder on your machine visible inside the container' },
        { token: 'HOST', label: 'on your machine', body: 'The socket file the daemon listens on: /var/run/docker.sock', fill: 'placeholder', after: ':' },
        { token: 'CONTAINER', label: 'inside the container', body: 'Where the client looks. The same path, so nothing needs configuring', fill: 'placeholder' },
      ]} note={{ kind: 'info', title: 'Both paths are the same on purpose', body: 'The docker client looks at /var/run/docker.sock by default. Mount it to the same path and the client finds the daemon with no extra setup.' }} />
    ),
    notes: 'Kit defect: this panel is a fixed 900px block and reaches 177px into the instructor rectangle. Recorded in the plan. Not fixed here.',
  },
  {
    id: 'c1-install-the-client', section: C1, label: 'Install the client',
    element: (
      <ContentSlide kicker={C1} title="Install the Client" lead="The Jenkins image does not include the docker command. Install it once" lesson={SESSION}>
        <Terminal path={ROOT} lines={[
          { text: 'docker exec -u root jenkins bash -c "apt-get update && apt-get install -y docker.io"', kind: 'cmd' },
          { text: 'Get:1 http://deb.debian.org/debian bookworm InRelease', kind: 'out' },
          { text: 'Setting up docker.io ...', kind: 'out' },
          { text: 'Processing triggers for libc-bin ...', kind: 'ok' },
        ]} caption="-u root runs the command as root inside the container. Installing packages needs it" />
      </ContentSlide>
    ),
  },
  {
    id: 'c1-plugin', section: C1, label: 'Docker Pipeline plugin',
    element: (
      <ContentSlide kicker={C1} title="Docker Pipeline Plugin" lead="Manage Jenkins, then Plugins, then Available plugins. Search for Docker Pipeline and install it" lesson={SESSION}>
        <Shot
          src="/shots/jenkins-plugin-docker-pipeline.png"
          alt="The Available plugins page with Docker Pipeline typed in the search box and the one matching plugin row with its Install checkbox"
          highlight={{ left: 0.5, top: 40, width: 9, height: 26, label: 'tick, then Install' }}
          caption="Manage Jenkins, Plugins, Available plugins. Tick the box, then the Install button at the top right"
        />
      </ContentSlide>
    ),
    notes: 'The pipeline we write later uses plain sh commands, so this plugin is not strictly needed for it. Install it anyway: every team you join has it.',
  },
  {
    id: 'c1-prove-it', section: C1, label: 'Prove it',
    element: (
      <ContentSlide kicker={C1} title="Prove It" lead="One command from your machine, run inside Jenkins, lists the containers on your machine" lesson={SESSION}>
        <Terminal path={ROOT} lines={[
          { text: 'docker exec jenkins docker ps', kind: 'cmd' },
          { text: 'CONTAINER ID   IMAGE                 STATUS         NAMES', kind: 'out' },
          { text: '9f2c4b8e1a7d   jenkins/jenkins:lts   Up 4 minutes   jenkins', kind: 'ok' },
        ]} caption="Jenkins is in its own list. The client inside reached the daemon outside" />
      </ContentSlide>
    ),
  },
  {
    id: 'c1-root', section: C1, label: 'Socket access is root',
    element: (
      <ContentNoteSlide kicker={C1} title="Socket Access Is Root" lead="Whoever controls the socket controls every container on your machine" lesson={SESSION} points={[
        { text: 'They can start, stop and delete any container', icon: 'warning' },
        { text: 'On a learning machine this is fine', icon: 'info' },
        { text: 'Companies limit who can reach their Jenkins for this reason', icon: 'shield' },
      ]} note={{ kind: 'warning', title: 'Worth knowing now', body: 'So it is not a surprise the first time you see it enforced at work.' }} />
    ),
  },

  /* ═══ CONCEPT 2 · Storing Secrets, 9 ════════════════════════════════ */
  { id: 'c2-divider', section: C2, label: '02', element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} /> },
  {
    id: 'c2-wrong-way', section: C2, label: 'The wrong way',
    element: (
      <ContentSlide kicker={C2} title="The Wrong Way" lead="Pushing to Docker Hub needs a login. The quick way is to type the password into the job" lesson={SESSION}>
        <CodeBlock filename="Jenkins → hello-jenkins → Configure → Build Steps → Execute shell" language="bash" showLineNumbers={false} code={`docker login -u ${DOCKER_ID} -p MySecret123
docker push ${DOCKER_ID}/nxttrendz-backend`} />
      </ContentSlide>
    ),
    notes: 'It works. That is what makes it dangerous. Rule 31: this is the shell step text box in the job configuration, so it is a located code panel, not a terminal.',
  },
  {
    id: 'c2-where-it-ends-up', section: C2, label: 'Where the password ends up',
    element: (
      <ContentNoteSlide kicker={C2} title="Three Copies" lead="The password is now stored in three places. None of them is private" lesson={SESSION} points={[
        { text: 'In the job configuration, in plain text', icon: 'warning' },
        { text: 'In every Console Output, for anyone who can open a build', icon: 'warning' },
        { text: 'Soon in a Jenkinsfile on GitHub, where Git history keeps it forever', icon: 'warning' },
      ]} note={{ kind: 'warning', title: 'The same mistake as committing .env', body: 'Jenkins has the same kind of fix: store the secret in one safe place and refer to it by name.' }} />
    ),
  },
  {
    id: 'c2-the-store', section: C2, label: 'The credentials store',
    element: (
      <ContentSlide kicker={C2} title="The Credentials Store" lead="Jenkins keeps secrets encrypted. Each one gets an ID, and jobs use the ID" lesson={SESSION}>
        <Shot
          src="/shots/jenkins-credentials-empty.png"
          alt="The Global credentials page, empty, with an Add Credentials button"
          caption="Manage Jenkins, Credentials, System, Global. Empty until the next two slides"
        />
      </ContentSlide>
    ),
    notes: 'The secret never appears in a job, a Jenkinsfile or a log. If it would be printed, Jenkins shows **** instead.',
  },
  {
    id: 'c2-docker-hub-token', section: C2, label: 'A Docker Hub token',
    element: (
      <ContentSlide kicker={C2} title="A Docker Hub Token" lead="Machines get a token, not your real password. A leaked token can be deleted without changing your account" lesson={SESSION}>
        <Shot
          src="/shots/dockerhub-token-created.png"
          alt="Docker Hub's Copy access token page after generating a token: the warning that it is displayed only once, then its description, expiry and access permissions"
          caption="hub.docker.com, Account settings, Personal access tokens, Generate new token. Copy it now, it is shown once. This one was made Read-only. Yours needs Read and Write, because the pipeline pushes"
          className="mt-3"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c2-add-docker-hub', section: C2, label: 'Add the Docker Hub credential',
    element: (
      <ContentSlide kicker={C2} title="Docker Hub Credential" lead="Fill five fields. The ID is the name every pipeline will use" lesson={SESSION}>
        <DataTable columns={[{ label: 'Field' }, { label: 'Value' }]} rows={[
          ['Kind', 'Username with password'],
          ['Username', `${DOCKER_ID}, your Docker ID`],
          ['Password', 'the access token, not your account password'],
          ['ID', 'dockerhub-credentials'],
          ['Description', 'Docker Hub token for image pushes'],
        ]} highlight={[4]} />
      </ContentSlide>
    ),
    notes: 'CAPTURE pending, slide 22: the Add Credentials form filled in. Keep the ID stable. Changing it later means editing every Jenkinsfile that uses it.',
  },
  {
    id: 'c2-add-secret-key', section: C2, label: 'Add the SECRET_KEY credential',
    element: (
      <ContentSlide kicker={C2} title="Add the SECRET_KEY Credential" lead="The tests will run inside the backend image, and the image has no .env file" lesson={SESSION}>
        <DataTable columns={[{ label: 'Field' }, { label: 'Value' }]} rows={[
          ['Kind', 'Secret text'],
          ['Secret', 'any long random string, not the key from your .env'],
          ['ID', 'django-secret-key'],
          ['Description', 'SECRET_KEY for pipeline test runs'],
        ]} highlight={[1]} />
      </ContentSlide>
    ),
    notes: 'CAPTURE pending, slide 23. Kind is Secret text because this secret has no username half. Use a throwaway value: tests only need a valid key.',
  },
  {
    id: 'c2-masked', section: C2, label: 'Masked in the log',
    element: (
      <ContentSlide kicker={C2} title="Masked in the Log" lead="The real value reaches the command. The log shows four stars" lesson={SESSION}>
        <CodeBlock filename="Jenkins → nxttrendz-build-test → #3 → Console Output" language="text" showLineNumbers={false} code={`+ docker login -u ${DOCKER_ID} -p ****
Login Succeeded
+ docker push ${DOCKER_ID}/nxttrendz-backend:latest
latest: digest: sha256:3f9a... size: 2841`} />
      </ContentSlide>
    ),
    notes: 'CAPTURE pending, slide 24. Compare with the wrong-way slide: same command, same result, and nobody who opens the build can read the password.',
  },
  {
    id: 'c2-kinds', section: C2, label: 'Kinds of credential',
    element: (
      <ContentSlide kicker={C2} title="Kinds of Credential" lead="Jenkins has one kind for each shape of secret. Pick the one that matches" lesson={SESSION}>
        <DataTable columns={[{ label: 'Kind' }, { label: 'Shape' }, { label: 'In this project' }]} rows={[
          ['Username with password', 'Two parts', 'Docker Hub. A private GitHub repository'],
          ['Secret text', 'One value', 'SECRET_KEY'],
          ['Secret file', 'A whole file', 'Not used here'],
          ['SSH username with private key', 'A key pair', 'Not used here'],
        ]} />
      </ContentSlide>
    ),
  },

  /* ═══ CONCEPT 3 · Connecting to GitHub, 17 ══════════════════════════ */
  { id: 'c3-divider', section: C3, label: '03', element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} /> },
  {
    id: 'c3-public', section: C3, label: 'Public repository',
    element: (
      <ContentNoteSlide kicker={C3} title="Public Repository" lead="A public repository needs no login. The URL is enough" lesson={SESSION} points={[
        { text: REPO, icon: 'link' },
        { text: 'Jenkins clones it the same way you did', icon: 'check' },
      ]} note={{ kind: 'info', title: 'Most learning projects are public', body: 'If yours is, skip the next slide.' }} />
    ),
  },
  {
    id: 'c3-private', section: C3, label: 'Private repository',
    element: (
      <ContentSlide kicker={C3} title="Private Repository" lead="A private repository needs a token, stored the same way as the Docker Hub one" lesson={SESSION}>
        <DataTable columns={[{ label: 'Service' }, { label: 'Make the secret on' }, { label: 'Kind' }, { label: 'ID in Jenkins' }]} rows={[
          ['Docker Hub', 'hub.docker.com, access token', 'Username with password', 'dockerhub-credentials'],
          ['GitHub', 'github.com, personal access token', 'Username with password', 'github-credentials'],
          ['Django', 'you invent it', 'Secret text', 'django-secret-key'],
        ]} />
      </ContentSlide>
    ),
    notes: 'GitHub: Settings, Developer settings, Personal access tokens, repo scope. Three services, one pattern.',
  },
  {
    id: 'c3-point-the-job', section: C3, label: 'Point the job at the repo',
    element: (
      <ContentSlide kicker={C3} title="The Repository URL" lead="In the job settings, give Git the repository URL and the branch" lesson={SESSION}>
        <PendingShot of="The Source Code Management section" at="Jenkins → nxttrendz-build-test → Configure → Source Code Management → Git" shows={<>Repository URL <span className="font-mono">{REPO}</span>, branch <span className="font-mono">main</span>, Credentials left as none</>} />
      </ContentSlide>
    ),
  },
  {
    id: 'c3-contract', section: C3, label: 'The repository contract',
    element: (
      <ContentSlide kicker={C3} title="The Repository Contract" lead="From now on everything Jenkins builds comes from this repository" lesson={SESSION}>
        <FileTree root="nxttrendz/  (on GitHub)" entries={[
          { name: 'backend/', folder: true },
          { name: 'manage.py, products/, requirements.txt', note: 'the Django code', depth: 1 },
          { name: 'Dockerfile', note: 'builds the backend image', depth: 1, state: 'existing' },
          { name: 'frontend/', folder: true },
          { name: 'package.json, src/', note: 'the React code', depth: 1 },
          { name: 'Dockerfile', note: 'builds the frontend image', depth: 1, state: 'existing' },
          { name: 'docker-compose.yml', note: 'runs the stack' },
          { name: 'Makefile', note: 'the command menu' },
          { name: '.env', note: 'never in this list', state: 'later' },
        ]} />
      </ContentSlide>
    ),
    notes: 'Two Dockerfiles, one per app folder, and none at the root. Every docker build must name the folder: ./backend or ./frontend. A bare docker build . at the root fails, and we will see that error later.',
  },
  {
    id: 'c3-what-starts-a-build', section: C3, label: 'What starts a build',
    element: (
      <ContentSlide kicker={C3} title="What Starts a Build" lead="Three ways a build can start. Only one of them needs nobody" lesson={SESSION}>
        <DataTable columns={[{ label: 'Trigger' }, { label: 'What happens' }, { label: 'Automatic?' }]} rows={[
          ['Build Now', 'A person clicks a button', 'No'],
          ['Poll SCM', 'Jenkins asks GitHub for changes every few minutes', 'Slow'],
          ['Webhook', 'GitHub tells Jenkins the moment you push', 'Yes'],
        ]} highlight={[3]} />
      </ContentSlide>
    ),
  },
  {
    id: 'c3-cannot-reach', section: C3, label: 'GitHub cannot reach your laptop',
    element: (
      <ContentSlide kicker={C3} title="GitHub Cannot Reach Your Laptop" lead="A webhook needs an address GitHub can send to. localhost is not one" lesson={SESSION}>
        <MachineBoundary
          inside={[
            { icon: 'devices', label: 'Your browser' },
            { icon: 'server', label: 'Jenkins', port: 'localhost:8080' },
            { icon: 'code', label: 'The ngrok program, in a moment', port: 'not running yet' },
          ]}
          insideNote="Reachable from this machine, and only this machine"
          outsider={{ icon: 'server', label: "GitHub's servers", port: 'on the internet' }}
          outsiderNote="They can only send to an address that exists on the internet"
          failure="could not connect"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c3-where-jenkins-runs', section: C3, label: 'Where Jenkins runs',
    element: (
      <ContentNoteSlide kicker={C3} title="Where Jenkins Runs" lead="Jenkins stays on your laptop, in the container you already have" lesson={SESSION} points={[
        { text: 'Jenkins runs in the jenkins container on your laptop, at localhost:8080', icon: 'server' },
        { text: 'ngrok is a second small program. It does not run Jenkins', icon: 'info' },
        { text: 'ngrok never sees your Jenkins settings, credentials or builds', icon: 'shield' },
      ]} note={{ kind: 'info', title: 'What ngrok does', body: 'It carries network traffic from a public address to your laptop. Nothing else.' }} />
    ),
    notes: 'Asked for directly: "where would the Jenkins be running?" The answer is: exactly where it is now.',
  },
  {
    id: 'c3-how-a-tunnel-works', section: C3, label: 'How a tunnel works',
    element: (
      <ContentSlide kicker={C3} title="How a Tunnel Works" lead="Your laptop connects out to ngrok first. GitHub's message travels back down that connection" lesson={SESSION}>
        <TunnelPath />
      </ContentSlide>
    ),
    notes: 'Outgoing connections through home Wi-Fi always work, which is how a browser loads a page. The laptop opens the pipe. The webhook rides back on it. No public address on the laptop is needed.',
  },
  {
    id: 'c3-ngrok-account', section: C3, label: 'Create an ngrok account',
    element: (
      <ContentSlide kicker={C3} title="Create an ngrok Account" lead="Go to ngrok.com and sign up. The free plan is enough for this course" lesson={SESSION}>
        <Shot
          src="/shots/ngrok-signup.png"
          alt="The ngrok sign-up card: Sign up with GitHub, Sign up with Google, or name, email and password"
          caption="ngrok.com, Sign up. Signing up with GitHub is one click, since you already have that account. Below these fields: a password and the Sign up button"
          className="mx-auto max-w-[470px]"
        />
      </ContentSlide>
    ),
    notes: 'This is the slowest beat in the session. Every learner signs up. Budget time for it.',
  },
  {
    id: 'c3-authtoken', section: C3, label: 'Copy your authtoken',
    element: (
      <ContentSlide kicker={C3} title="Copy Your Authtoken" lead="After signing in, the dashboard shows one long token. Copy it" lesson={SESSION}>
        <Shot
          src="/shots/ngrok-authtoken.png"
          alt="ngrok dashboard, Your Authtoken: the token shown as dots with a Copy button, and the command ngrok config add-authtoken below it"
          highlight={{ left: 27, top: 40, width: 46, height: 11, label: 'Copy. It stays hidden on screen' }}
          caption="dashboard.ngrok.com, Getting Started, Your Authtoken. The page keeps it as dots. Copy it and paste it into the command on the next slide"
          className="mx-auto max-w-[940px]"
        />
      </ContentSlide>
    ),
    notes: 'This token is a password. Do not share it. The one in the screenshot was deleted right after the picture was taken.',
  },
  {
    id: 'c3-install-ngrok', section: C3, label: 'Install ngrok',
    element: (
      <ContentSlide kicker={C3} title="Install ngrok" lead="One command on Windows. The other two systems have their own" lesson={SESSION}>
        <Terminal path={ROOT} lines={[
          { text: 'winget install ngrok -s msstore', kind: 'cmd' },
          { text: 'Found ngrok [9NLR1Q3B4RZ2]', kind: 'out' },
          { text: 'Successfully installed', kind: 'ok' },
          { text: 'ngrok version', kind: 'cmd' },
          { text: 'ngrok version 3.x', kind: 'ok' },
        ]} caption="Close and reopen the terminal after installing, so the ngrok command is found" />
        <DataTable compact className="mt-4" columns={[{ label: 'System' }, { label: 'Command' }]} rows={[
          ['macOS', 'brew install ngrok'],
          ['Linux', 'snap install ngrok'],
        ]} />
      </ContentSlide>
    ),
    notes: 'Commands read off ngrok.com/download on 2026-09-15. Windows also offers the Microsoft Store page and scoop install ngrok. Linux also has an apt repository route, longer; snap is one line. If winget is missing on an older Windows, install App Installer from the Microsoft Store first.',
  },
  {
    id: 'c3-start-the-tunnel', section: C3, label: 'Start the tunnel',
    element: (
      <ContentSlide kicker={C3} title="Start the Tunnel" lead="Two commands. The second prints your public address on the Forwarding line" lesson={SESSION}>
        <Terminal path={ROOT} lines={[
          { text: 'ngrok config add-authtoken <paste your token here>', kind: 'cmd' },
          { text: 'Authtoken saved to configuration file', kind: 'ok' },
          { text: 'ngrok http 8080', kind: 'cmd' },
          { text: 'Session Status    online', kind: 'out' },
          { text: `Forwarding        https://${DEV_DOMAIN} -> http://localhost:8080`, kind: 'ok' },
        ]} caption="Leave this window open. Closing it closes the tunnel" />
      </ContentSlide>
    ),
    notes: 'Your address will be different from the one on the slide. Everyone has their own.',
  },
  {
    id: 'c3-what-ngrok-costs', section: C3, label: 'What ngrok costs',
    element: (
      <ContentSlide kicker={C3} title="What ngrok Costs" lead="Nothing. The free plan has everything this course needs" lesson={SESSION}>
        <DataTable columns={[{ label: 'Free plan gives you' }, { label: 'What it means here' }]} rows={[
          ['One dev domain that does not change', 'The address you give GitHub keeps working after a restart'],
          ['20,000 requests a month', 'One push is one request. You will not reach this'],
          ['1 GB of data a month', 'A webhook is a few kilobytes'],
          ['A warning page for browsers', 'Only for people visiting in a browser. GitHub is not affected'],
        ]} />
      </ContentSlide>
    ),
    notes: 'Checked against ngrok.com/pricing on 2026-09-10. The stable dev domain is what makes this work across sessions.',
  },
  {
    id: 'c3-payload-url', section: C3, label: 'The Payload URL',
    element: (
      <CommandSyntaxSlide kicker={C3} title="The Payload URL" lead="GitHub needs one address. It has three parts, and the last part is easy to forget" lesson={SESSION} parts={[
        { token: 'https://', label: 'scheme', body: 'The tunnel uses HTTPS, which GitHub requires', after: '' },
        { token: 'DEV-DOMAIN', label: 'your dev domain', body: 'From the Forwarding line. Yours is different', fill: 'placeholder', after: '' },
        { token: '/github-webhook/', label: 'the endpoint', body: 'Where Jenkins listens. Keep the slash at the end' },
      ]} note={{ kind: 'warning', title: 'The last slash matters', body: 'Without it GitHub gets a 404 error and the build never starts.' }} />
    ),
  },
  {
    id: 'c3-add-the-webhook', section: C3, label: 'Add the webhook',
    element: (
      <ContentSlide kicker={C3} title="Add the Webhook" lead="In your repository: Settings, Webhooks, Add webhook. Fill the form" lesson={SESSION}>
        <Shot
          src="/shots/github-add-webhook.png"
          alt="GitHub's Add webhook form: Payload URL, Content type, Secret, SSL verification, the event choice with Just the push event selected, Active ticked, and the Add webhook button"
          highlight={{ left: 1.5, top: 38, width: 97, height: 36, label: 'type your URL, then set content type to application/json' }}
          caption="Settings, Webhooks, Add webhook. Paste your Payload URL, change Content type to application/json. Lower down, keep Just the push event, then Add webhook"
          className="mx-auto mt-3 max-w-[900px]"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'c3-tell-jenkins', section: C3, label: 'Tell Jenkins to listen',
    element: (
      <ContentSlide kicker={C3} title="Tell Jenkins to Listen" lead="One tick box in the job settings. Without it the webhook arrives and nothing happens" lesson={SESSION}>
        <PendingShot of="The Build Triggers section with the GitHub hook trigger ticked" at="Jenkins → nxttrendz-build-test → Configure → Build Triggers" shows="The box: GitHub hook trigger for GITScm polling" />
      </ContentSlide>
    ),
  },
  {
    id: 'c3-push-once', section: C3, label: 'Push once',
    element: (
      <ContentSlide kicker={C3} title="Push Once" lead="Make a small change, push it, and watch a build start with nobody clicking" lesson={SESSION}>
        <PendingShot of="GitHub Recent Deliveries with a green tick, and the Jenkins build page" at="github.com → nxttrendz → Settings → Webhooks → Recent Deliveries, and Jenkins → nxttrendz-build-test → #4" shows="Response 200 on GitHub. Started by GitHub push on Jenkins" />
      </ContentSlide>
    ),
    notes: 'Have one person push and let the room watch their own Jenkins start. If the delivery is red, read its response: it is almost always the missing slash or a closed tunnel.',
  },

  /* ═══ CONCEPT 4 · Full Pipeline, 35 ═════════════════════════════════ */
  { id: 'c4-divider', section: C4, label: '04', element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} /> },
  {
    id: 'c4-two-stages', section: C4, label: 'Two stages',
    element: (
      <ContentSlide kicker={C4} title="Two Stages" lead="Make a new Pipeline job named nxttrendz-build-test and paste this script" lesson={SESSION}>
        <CodeBlock filename="Jenkins → nxttrendz-build-test → Configure → Pipeline → Script" language="groovy" fontSize={13} code={`pipeline {
    agent any
    stages {
        stage('Fetch') {
            steps {
                git branch: 'main', url: '${REPO}'
            }
        }
        stage('Build') {
            steps {
                sh 'docker build -t nxttrendz-backend ./backend'
            }
        }
    }
}`} highlight={[11]} />
      </ContentSlide>
    ),
    notes: 'Read it as plain English for now: two stages, fetch then build. ./backend, not a dot, because the Dockerfile is in the app folder. No Docker ID and no tag yet. This is a test that the wiring works.',
  },
  {
    id: 'c4-build-now', section: C4, label: 'Build Now',
    element: (
      <ContentSlide kicker={C4} title="Build Now" lead="Click Build Now. The Stage View shows one box per stage, green when it passes" lesson={SESSION}>
        <PendingShot of="The Stage View with Fetch and Build both green" at="Jenkins → nxttrendz-build-test" shows="Fetch 3s, Build 14s, both with a tick" />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-console', section: C4, label: 'Console Output',
    element: (
      <ContentSlide kicker={C4} title="Console Output" lead="Every line here is a step you used to type yourself" lesson={SESSION}>
        <CodeBlock filename="Jenkins → nxttrendz-build-test → #1 → Console Output" language="text" showLineNumbers={false} code={`Cloning repository ${REPO}
Checking out Revision 4f8a2c1 (main)
+ docker build -t nxttrendz-backend ./backend
#5 [2/5] WORKDIR /app
#8 [4/5] RUN pip install -r requirements.txt
Successfully built nxttrendz-backend
Finished: SUCCESS`} />
      </ContentSlide>
    ),
    notes: 'CAPTURE pending, slide 46. Pause here. A machine cloned the repository and built the image. You clicked one button.',
  },
  {
    id: 'c4-image-on-your-machine', section: C4, label: 'The image on your machine',
    element: (
      <ContentSlide kicker={C4} title="Your Image List" lead="Jenkins built it through the shared socket, so it is in your own image list" lesson={SESSION}>
        <Terminal path={ROOT} lines={[
          { text: 'docker images | grep nxttrendz', kind: 'cmd' },
          { text: 'nxttrendz-backend   latest   7c1f4b2e9a83   About a minute ago   214MB', kind: 'ok' },
        ]} caption="The same list your own builds go to" />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-before-and-after', section: C4, label: 'Before and after',
    element: (
      <ContentSlide kicker={C4} title="Before and After" lead="The same four steps. None of them were yours" lesson={SESSION}>
        <DataTable columns={[{ label: 'Before' }, { label: 'Now' }]} rows={[
          ['Open a terminal in the project folder', 'Jenkins clones the repository into a fresh folder'],
          ['Remember which folder has the Dockerfile', 'The pipeline says ./backend every time'],
          ['Type docker build and wait', 'The Build stage runs it'],
          ['Forget to do it', 'A push starts it. Forgetting is not possible'],
        ]} />
      </ContentSlide>
    ),
    notes: 'Plan asks for SwapRows here. It is on the kit/lit-surfaces branch and not on main yet. Swap this DataTable when it merges.',
  },
  {
    id: 'c4-pipeline-as-code', section: C4, label: 'Pipeline as code',
    element: (
      <ContentSlide kicker={C4} title="Pipeline as Code" lead="Every step of this course moved knowledge out of memory and into a file. The pipeline is the last one" lesson={SESSION}>
        <DataTable columns={[{ label: 'Knowledge' }, { label: 'Used to live in' }, { label: 'Now lives in' }]} rows={[
          ['How to set up the app', 'Instructions people follow', 'Dockerfile'],
          ['How the containers fit together', 'docker run commands people remember', 'docker-compose.yml'],
          ['The daily commands', 'Shell history', 'Makefile'],
          ['The pipeline', 'A text box in Jenkins', 'Jenkinsfile'],
        ]} highlight={[4]} />
      </ContentSlide>
    ),
    notes: 'A Jenkinsfile is a text file with exactly that name, at the repository root. Reviewed in pull requests, diffed, rolled back, and it survives any Jenkins disaster.',
  },
  {
    id: 'c4-the-jenkinsfile', section: C4, label: 'The Jenkinsfile',
    element: (
      <ContentSlide kicker={C4} title="The Jenkinsfile" lead="Create this file at the root of the repository. This is the skeleton every pipeline shares" lesson={SESSION}>
        <CodeBlock filename={JF} language="groovy" code={`pipeline {
    agent any

    stages {
        stage('...') {
            steps {
                ...
            }
        }
    }
}`} />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-six-keywords', section: C4, label: 'Six keywords',
    element: (
      <ContentSlide kicker={C4} title="Six Keywords" lead="The whole file is these six words plus shell commands you already know" lesson={SESSION}>
        <DataTable compact columns={[{ label: 'Keyword' }, { label: 'Meaning' }]} rows={[
          ['pipeline { }', 'The whole definition'],
          ['agent any', 'Run on any available worker'],
          ['stages { }', 'The list of stages, in order'],
          ["stage('Name') { }", 'One box in the Stage View'],
          ['steps { }', 'The commands inside a stage'],
          ["sh '...'", 'Run one shell command'],
        ]} />
      </ContentSlide>
    ),
    notes: 'The language is Groovy. Nobody needs to learn Groovy. Six keywords and shell commands are the whole thing.',
  },
  {
    id: 'c4-build-number', section: C4, label: 'BUILD_NUMBER',
    element: (
      <ContentNoteSlide kicker={C4} title="BUILD_NUMBER" lead="Jenkins gives every pipeline a variable holding the build number. Build #42 gets 42" lesson={SESSION} points={[
        { text: 'Every build gets a unique tag, automatically', icon: 'check' },
        { text: 'The number always goes up, so newer is always higher', icon: 'check' },
        { text: 'Any image traces back to the exact build and the exact commit', icon: 'target' },
      ]} note={{ kind: 'success', title: 'The tag makes itself', body: 'Image ravi123/nxttrendz-backend:42 came from build #42. No one typed 42.' }} />
    ),
  },
  {
    id: 'c4-environment-block', section: C4, label: 'The environment block',
    element: (
      <ContentSlide kicker={C4} title="The environment Block" lead="Name a value once at the top. Every stage below uses the name" lesson={SESSION}>
        <CodeBlock filename={JF} language="groovy" code={`environment {
    DOCKER_ID  = '${DOCKER_ID}'
    BACKEND    = "\${DOCKER_ID}/nxttrendz-backend"
    FRONTEND   = "\${DOCKER_ID}/nxttrendz-frontend"
    SECRET_KEY = credentials('django-secret-key')
}`} highlight={[5]} />
      </ContentSlide>
    ),
    notes: 'Line 5 pulls the stored secret into a variable. credentials() is the short form for a Secret text credential. Jenkins masks it as **** anywhere it would print. Change your Docker ID here and every docker command follows.',
  },
  {
    id: 'c4-stage-checkout', section: C4, label: 'Stage 1: Checkout',
    element: (
      <ContentSlide kicker={C4} title="Stage 1: Checkout" lead="The same Git step as the two-stage test. It clones the repository" lesson={SESSION}>
        <CodeBlock filename={JF} language="groovy" code={`stage('Checkout') {
    steps {
        git branch: 'main', url: '${REPO}'
    }
}`} />
      </ContentSlide>
    ),
    notes: "Private repository? Add credentialsId: 'github-credentials' to the git step.",
  },
  {
    id: 'c4-stage-test', section: C4, label: 'Stage 2: Test',
    element: (
      <ContentSlide kicker={C4} title="Stage 2: Test" lead="Build the backend image, then run the Django tests inside a container made from it" lesson={SESSION}>
        <CodeBlock filename={JF} language="groovy" code={`stage('Test') {
    steps {
        sh 'docker build -t nxttrendz-backend-test ./backend'
        sh 'docker run --rm -e SECRET_KEY=$SECRET_KEY nxttrendz-backend-test python manage.py test'
    }
}`} highlight={[4]} />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-tests-inside-the-image', section: C4, label: 'Tests run inside the image',
    element: (
      <ContentNoteSlide kicker={C4} title="Tests in the Image" lead="The tests run in the exact environment that will ship, not in whatever Python the Jenkins machine has" lesson={SESSION} points={[
        { text: './backend is the build context, because the Dockerfile is in that folder', icon: 'info' },
        { text: '--rm deletes the container when it exits, so builds do not pile up dead containers', icon: 'info' },
        { text: 'A command after the image name replaces the CMD. This run executes the tests, not the server', icon: 'info' },
      ]} note={{ kind: 'info', title: 'CI and Docker, together', body: 'The test runs in the same image that will be shipped, so a pass means something.' }} />
    ),
  },
  {
    id: 'c4-why-secret-key', section: C4, label: 'Why the test needs SECRET_KEY',
    element: (
      <ContentNoteSlide kicker={C4} title="SECRET_KEY in Tests" lead="The image has no .env file, on purpose. Without a key, Django stops before the first test" lesson={SESSION} points={[
        { text: 'django.core.exceptions.ImproperlyConfigured: The SECRET_KEY setting must not be empty', icon: 'cross' },
        { text: '-e SECRET_KEY=$SECRET_KEY passes the value in from the environment block', icon: 'key' },
        { text: 'On your laptop, Compose reads .env. In Jenkins, the credentials store supplies it', icon: 'check' },
      ]} note={{ kind: 'success', title: 'Same image, same mechanism, different supplier', body: 'This is why configuration was kept out of the image in the first place.' }} />
    ),
  },
  {
    id: 'c4-exit-codes', section: C4, label: 'Exit codes are the gate',
    element: (
      <ContentNoteSlide kicker={C4} title="Exit Codes" lead="manage.py test exits with 0 when every test passes and a non-zero number when any fails" lesson={SESSION} points={[
        { text: 'A non-zero exit from sh fails the stage', icon: 'cross' },
        { text: 'A failed stage stops the pipeline. Nothing after it runs', icon: 'warning' },
        { text: 'This is the same Exited (0) you saw with hello-world on the first day', icon: 'info' },
      ]} note={{ kind: 'info', title: 'One convention does all the enforcing', body: 'Exit codes are the entire machinery of CI/CD.' }} />
    ),
  },
  {
    id: 'c4-stage-build', section: C4, label: 'Stage 3: Build',
    element: (
      <ContentSlide kicker={C4} title="Stage 3: Build" lead="Two images, each named for Docker Hub, each tagged with the build number" lesson={SESSION}>
        <CodeBlock filename={JF} language="groovy" code={`stage('Build') {
    steps {
        sh 'docker build -t $BACKEND:$BUILD_NUMBER ./backend'
        sh 'docker build -t $FRONTEND:$BUILD_NUMBER ./frontend'
    }
}`} />
      </ContentSlide>
    ),
    notes: 'Build #42 produces ravi123/nxttrendz-backend:42 and ravi123/nxttrendz-frontend:42. The backend build is near instant: the Test stage just built the same layers and the cache reuses them.',
  },
  {
    id: 'c4-only-backend-has-tests', section: C4, label: 'Only the backend has tests',
    element: (
      <ContentNoteSlide kicker={C4} title="One Test Suite" lead="The frontend has no test suite in this project. It is still protected" lesson={SESSION} points={[
        { text: 'If the backend tests fail, the pipeline stops before Build', icon: 'warning' },
        { text: 'Neither image is built. Neither image is pushed', icon: 'cross' },
        { text: 'A gate protects everything after it, not only the thing it tested', icon: 'shield-check' },
      ]} note={{ kind: 'info', title: 'One test suite, two images protected', body: 'The frontend is never built from a commit whose backend tests failed.' }} />
    ),
  },
  {
    id: 'c4-stage-push', section: C4, label: 'Stage 4: Push',
    element: (
      <ContentSlide kicker={C4} title="Stage 4: Push" lead="Log in with the stored Docker Hub credential, then push both images" lesson={SESSION}>
        <CodeBlock filename={JF} language="groovy" fontSize={13} code={`stage('Push') {
    steps {
        withCredentials([usernamePassword(
            credentialsId: 'dockerhub-credentials',
            usernameVariable: 'DOCKER_USER',
            passwordVariable: 'DOCKER_PASS'
        )]) {
            sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
            sh 'docker push $BACKEND:$BUILD_NUMBER'
            sh 'docker push $FRONTEND:$BUILD_NUMBER'
        }
    }
}`} highlight={[3, 8]} />
      </ContentSlide>
    ),
    notes: 'withCredentials fetches the two-part credential and exposes it as two variables, only inside the block. --password-stdin sends the password through standard input so it never appears in a process list.',
  },
  {
    id: 'c4-single-quotes', section: C4, label: 'Single quotes only',
    element: (
      <ContentNoteSlide kicker={C4} title="Single Quotes Only" lead="Every sh line that touches a secret uses single quotes. This is not a style choice" lesson={SESSION} points={[
        { text: "Single quotes: the shell reads $DOCKER_PASS and Jenkins masks it", icon: 'check' },
        { text: 'Double quotes: Groovy pastes the real secret into the script text first', icon: 'cross' },
        { text: 'Then it can appear in logs and error messages', icon: 'warning' },
      ]} note={{ kind: 'warning', title: 'Jenkins warns about exactly this', body: 'Rule: any sh line with a credential gets single quotes.' }} />
    ),
  },
  {
    id: 'c4-complete-jenkinsfile', section: C4, label: 'The complete Jenkinsfile',
    element: (
      <ContentSlide kicker={C4} title="The Complete Jenkinsfile" lead="All four stages in one file, at the root of the repository" lesson={SESSION}>
        <CodeBlock filename={JF} language="groovy" fontSize={9} code={`pipeline {
    agent any
    environment {
        DOCKER_ID  = '${DOCKER_ID}'
        BACKEND    = "\${DOCKER_ID}/nxttrendz-backend"
        FRONTEND   = "\${DOCKER_ID}/nxttrendz-frontend"
        SECRET_KEY = credentials('django-secret-key')
    }
    stages {
        stage('Checkout') { steps { git branch: 'main', url: '${REPO}' } }
        stage('Test') { steps {
            sh 'docker build -t nxttrendz-backend-test ./backend'
            sh 'docker run --rm -e SECRET_KEY=$SECRET_KEY nxttrendz-backend-test python manage.py test'
        } }
        stage('Build') { steps {
            sh 'docker build -t $BACKEND:$BUILD_NUMBER ./backend'
            sh 'docker build -t $FRONTEND:$BUILD_NUMBER ./frontend'
        } }
        stage('Push') { steps {
            withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials',
                usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
                sh 'docker push $BACKEND:$BUILD_NUMBER'
                sh 'docker push $FRONTEND:$BUILD_NUMBER'
            }
        } }
    }
}`} />
      </ContentSlide>
    ),
    notes: 'Written in compact Groovy so the whole file fits one slide. The file you built stage by stage has the same code in the expanded layout; both are valid. Read the environment block top to bottom: your Docker ID once, two image names built from it, the test secret from the store.',
  },
  {
    id: 'c4-commit-the-jenkinsfile', section: C4, label: 'Commit the Jenkinsfile',
    element: (
      <ContentSlide kicker={C4} title="Commit the Jenkinsfile" lead="Save the file, commit it, push it. It is now part of the project" lesson={SESSION}>
        <Terminal path={ROOT} lines={[
          { text: 'git add Jenkinsfile', kind: 'cmd' },
          { text: 'git commit -m "Add Jenkinsfile"', kind: 'cmd' },
          { text: '[main 7a1b2c3] Add Jenkinsfile', kind: 'out' },
          { text: ' 1 file changed, 34 insertions(+)', kind: 'out' },
          { text: 'git push', kind: 'cmd' },
          { text: '   4f8a2c1..7a1b2c3  main -> main', kind: 'ok' },
        ]} caption="The webhook fires on this push, but the job still reads the old pasted script. Next: point it at the file" />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-script-from-scm', section: C4, label: 'Pipeline script from SCM',
    element: (
      <ContentSlide kicker={C4} title="Pipeline Script from SCM" lead="Change the job to read its pipeline from the repository instead of the text box" lesson={SESSION}>
        <PendingShot of="The Pipeline section with Definition set to Pipeline script from SCM" at="Jenkins → nxttrendz-build-test → Configure → Pipeline" shows={<>Definition: Pipeline script from SCM. SCM: Git. Repository URL <span className="font-mono">{REPO}</span>. Branch <span className="font-mono">main</span>. Script Path <span className="font-mono">Jenkinsfile</span></>} />
      </ContentSlide>
    ),
    notes: 'Jenkins now clones the repository first, reads the pipeline from the repository itself, and runs it. The UI holds only a pointer.',
  },
  {
    id: 'c4-four-green-stages', section: C4, label: 'Four green stages',
    element: (
      <ContentSlide kicker={C4} title="Four Green Stages" lead="Push a small change. All four stages go green without anyone clicking" lesson={SESSION}>
        <PendingShot of="The Stage View with four green stages" at="Jenkins → nxttrendz-build-test" shows="Checkout, Test, Build, Push, each with a tick and a duration" />
      </ContentSlide>
    ),
    notes: 'Nobody clicked Build Now. The push did it.',
  },
  {
    id: 'c4-two-images-on-docker-hub', section: C4, label: 'Two images on Docker Hub',
    element: (
      <ContentSlide kicker={C4} title="On Docker Hub" lead="Both images are on Docker Hub, tagged with the build number" lesson={SESSION}>
        <PendingShot of="The two repositories on Docker Hub with the new tag" at={`hub.docker.com → ${DOCKER_ID} → Repositories`} shows="nxttrendz-backend and nxttrendz-frontend, each showing tag 43" />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-break-a-test', section: C4, label: 'Break a test on purpose',
    element: (
      <ContentSlide kicker={C4} title="Break a Test on Purpose" lead="The pipeline's value is what it stops. Prove it by pushing a change that fails a test" lesson={SESSION}>
        <CodeBlock filename="backend/products/views.py" language="python" code={`class ProductListView(APIView):
    def get(self, request):
        products = Product.objects.all()
        serializer = ProductSerializer(products, many=True)
        return Response(serializer.data, status=500)   # was status=200`} highlight={[5]} />
      </ContentSlide>
    ),
    notes: 'Any change that fails a test will do. Commit and push it.',
  },
  {
    id: 'c4-the-gate-closes', section: C4, label: 'The gate closes',
    element: (
      <ContentSlide kicker={C4} title="The Gate Closes" lead="Checkout passes. Test fails. Build and Push never run" lesson={SESSION}>
        <PendingShot of="The Stage View with Test red and the last two stages empty" at="Jenkins → nxttrendz-build-test → #44" shows="Checkout green, Test red with FAILED, Build and Push grey with no time" />
      </ContentSlide>
    ),
  },
  {
    id: 'c4-read-the-failure', section: C4, label: 'Read the failure',
    element: (
      <ContentSlide kicker={C4} title="Read the Failure" lead="The log names the test, shows the secret as four stars, and ends with the exit code" lesson={SESSION}>
        <CodeBlock filename="Jenkins → nxttrendz-build-test → #44 → Console Output" language="text" showLineNumbers={false} code={`+ docker run --rm -e SECRET_KEY=**** nxttrendz-backend-test python manage.py test
FAIL: test_product_list (products.tests.ProductAPITestCase)
AssertionError: 500 != 200
----------------------------------------------------------------------
Ran 8 tests in 1.243s
FAILED (failures=1)
ERROR: script returned exit code 1
Finished: FAILURE`} />
      </ContentSlide>
    ),
    notes: 'CAPTURE pending, slide 70. First line: the secret is ****. It was there, the container got the real value, and Jenkins masked it on the way to the log.',
  },
  {
    id: 'c4-what-did-not-happen', section: C4, label: 'What did not happen',
    element: (
      <ContentSlide kicker={C4} title="What Did Not Happen" lead="Read a red build as a list of problems that were prevented" lesson={SESSION}>
        <StatusList items={[
          { status: 'success', text: 'No image was built from the broken code', detail: 'Not the backend, and not the frontend either' },
          { status: 'success', text: 'Nothing was pushed to Docker Hub', detail: 'The last good images, tag 43, are untouched' },
          { status: 'success', text: 'You know within a minute', detail: 'While the change is still fresh in your mind' },
        ]} />
      </ContentSlide>
    ),
    notes: 'Fix the bug, push again, build #45 goes green end to end. This catch and block loop is the point of Jenkins.',
  },
  {
    id: 'c4-bottom-up', section: C4, label: 'Read from the bottom up',
    element: (
      <ContentNoteSlide kicker={C4} title="Read From the Bottom Up" lead="One habit finds almost every red build" lesson={SESSION} points={[
        { text: 'Find the first stage that is red', icon: 'target' },
        { text: 'Open its Console Output', icon: 'terminal' },
        { text: 'Read the last 20 lines first. The real error is almost always there', icon: 'check' },
      ]} note={{ kind: 'tip', title: 'Everything above is usually fine', body: 'A failing test name, a missing file, a refused login: they are at the bottom.' }} />
    ),
  },
  {
    id: 'c4-error-not-found', section: C4, label: 'Error: docker not found',
    element: (
      <StatusPointsSlide kicker={C4} title="Error: docker not found" lead="The docker client is missing inside the Jenkins container" lesson={SESSION} items={[
        { status: 'error', text: 'docker: not found', code: true },
        { status: 'info', text: 'The client was never installed, or the container was recreated without it' },
        { status: 'success', text: 'Run the apt-get install docker.io command again', detail: 'Installing the client is per container, not per machine' },
      ]} />
    ),
  },
  {
    id: 'c4-error-permission', section: C4, label: 'Error: permission denied',
    element: (
      <StatusPointsSlide kicker={C4} title="Error: Permission Denied" lead="The client exists and the socket is mounted. The jenkins user may not use it" lesson={SESSION} items={[
        { status: 'error', text: 'permission denied while trying to connect to the Docker daemon socket', code: true },
        { status: 'success', text: 'docker exec -u root jenkins bash -c "chmod 666 /var/run/docker.sock"', detail: 'A blunt fix that is normal for a learning machine', code: true },
      ]} />
    ),
  },
  {
    id: 'c4-error-repo', section: C4, label: 'Error: repository not found',
    element: (
      <StatusPointsSlide kicker={C4} title="Error: Repository Not Found" lead="Git could not read the repository at that address" lesson={SESSION} items={[
        { status: 'error', text: `fatal: repository '${REPO}/' not found`, code: true },
        { status: 'info', text: 'The URL has a typo, or the repository is private and the job has no credential' },
        { status: 'success', text: 'Check the URL first. If private, select github-credentials in the Git step' },
      ]} />
    ),
  },
  {
    id: 'c4-errors-daemon-context', section: C4, label: 'Errors: daemon and context',
    element: (
      <StatusPointsSlide kicker={C4} title="Errors: Daemon and Context" lead="One means the socket was never mounted. The other means the wrong folder" lesson={SESSION} items={[
        { status: 'error', text: 'Cannot connect to the Docker daemon at unix:///var/run/docker.sock', detail: 'The container is running without the socket mount. Remove it and run it again with both -v flags', code: true },
        { status: 'error', text: 'failed to read dockerfile: open Dockerfile: no such file or directory', detail: 'A dot means the repository root, and the root has no Dockerfile', code: true },
        { status: 'success', text: 'docker build -t nxttrendz-backend ./backend', detail: 'Name the folder', code: true },
      ]} />
    ),
  },
  {
    id: 'c4-ladder', section: C4, label: 'The diagnostic ladder',
    element: (
      <ProceduralStepsSlide kicker={C4} title="The Diagnostic Ladder" lead="When a build fails, check each link in this order" lesson={SESSION} steps={[
        { title: 'docker ps, on your machine', detail: 'The Jenkins container is running', icon: 'terminal' },
        { title: 'docker exec jenkins docker --version', detail: 'The client is installed inside', icon: 'terminal' },
        { title: 'docker exec jenkins docker ps', detail: 'The socket is mounted and allowed', icon: 'terminal' },
        { title: 'Run the job again and read Console Output', detail: 'The pipeline itself', icon: 'play' },
      ]} />
    ),
  },
  {
    id: 'c4-the-whole-flow', section: C4, label: 'The whole flow',
    element: (
      <ContentSlide kicker={C4} title="The Whole Flow" lead="You push. Everything after that is a machine" lesson={SESSION}>
        <GateFlow
          nodes={[
            { id: 'push', kind: 'start', label: 'git push', caption: 'the only human step', icon: 'play' },
            { id: 'checkout', kind: 'step', label: 'Checkout', caption: 'clone the repository', icon: 'link' },
            { id: 'test', kind: 'decision', label: 'All tests pass?', icon: 'target' },
            { id: 'build', kind: 'step', label: 'Build', caption: 'both images, tagged', icon: 'bolt' },
            { id: 'publish', kind: 'step', label: 'Push', caption: 'to Docker Hub', icon: 'rocket' },
            { id: 'stop', kind: 'end', label: 'Stop', caption: 'no image, no push', icon: 'cross' },
          ]}
          edges={[
            { from: 'push', to: 'checkout', kind: 'main', label: 'webhook' },
            { from: 'checkout', to: 'test', kind: 'main' },
            { from: 'test', to: 'build', kind: 'main', label: 'Yes' },
            { from: 'build', to: 'publish', kind: 'main' },
            { from: 'test', to: 'stop', kind: 'alt', label: 'No' },
          ]}
          caption="Two tested images on Docker Hub after every push, with a number that traces back to the commit"
        />
      </ContentSlide>
    ),
    notes: 'Hard rule 17: this is a custom figure. Look at the rendered slide, not only the harness output.',
  },

  /* ═══ CLOSING, 10 ═══════════════════════════════════════════════════ */
  {
    id: 'key-takeaways', section: 'Closing', label: 'Key takeaways',
    element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={[C1, C2, C3, C4]} />,
  },
  {
    id: 'aws-divider', section: 'Closing', label: 'Before we meet again',
    element: <SectionBreakerSlide title={CLOSING_KICKER} lesson={SESSION} />,
    notes: 'No number and no agenda row. This is an errand with a deadline, not a concept.',
  },
  {
    id: 'aws-why-now', section: 'Closing', label: 'Create your AWS account today',
    element: (
      <ContentNoteSlide kicker={CLOSING_KICKER} title="Create Your AWS Account Today" lead="You will need it for deploying. Activation can take up to three days, so start now" lesson={SESSION} points={[
        { text: 'An account can activate in minutes, or take up to 24 hours. UPI can take 48 to 72', icon: 'info' },
        { text: 'A new account gets USD 100 in credits, and up to 200. Nothing is charged unless you upgrade', icon: 'check' },
        { text: 'The account closes itself after 6 months. Finish the deploying sessions inside that', icon: 'warning' },
      ]} note={{ kind: 'warning', title: 'Nobody collects your card details', body: 'Sign up on your own device with your own details. Not the trainer, not the chat, not a shared sheet.' }} />
    ),
    notes: 'Rule 2b: "deploying", not "session 10". Say both sentences in the callout out loud.',
  },
  {
    id: 'aws-have-ready', section: 'Closing', label: 'Have these ready',
    element: (
      <ContentSlide kicker={CLOSING_KICKER} title="Have These Ready" lead="Eight things AWS asks for. Have them before you start" lesson={SESSION}>
        <DataTable compact columns={[{ label: 'AWS asks for' }, { label: 'Watch out for' }]} rows={[
          ['Email address', 'It becomes your login name. Use one you will keep'],
          ['Account name', 'Just a label. You can change it later'],
          ['Root password', '8 to 128 characters, three of: capitals, small letters, digits, symbols'],
          ['Account type', 'Personal, not Business'],
          ['Name, phone, address', 'Must match your bank or card records exactly'],
          ['Payment method', 'A card, or a UPI ID. Required even for the free tier'],
          ['Phone verification', 'A code by SMS or call. Keep the phone with you'],
          ['Support plan', 'Choose Basic. It is free. It is not the one selected by default'],
        ]} />
      </ContentSlide>
    ),
    notes: 'Say it before it happens: a small charge may appear and AWS reverses it. An address that does not match the bank records is the commonest reason an account gets stuck.',
  },
  {
    id: 'aws-sign-up', section: 'Closing', label: 'The sign up',
    element: (
      <ContentSlide kicker={CLOSING_KICKER} title="The Sign Up" lead="Five screens. Only the last one has a choice to make" lesson={SESSION}>
        <Shot
          src="/shots/aws-signup.png"
          alt="The AWS sign-up form with empty Root user email address and AWS account name fields, next to the offer of USD 100 in credits for up to 6 months"
          caption="signin.aws.amazon.com/signup. Only the email and account name on this screen. Later screens ask for address and payment and are not shown"
          className="mx-auto mt-3 max-w-[570px]"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'aws-basic-support', section: 'Closing', label: 'Choose Basic support',
    element: (
      <ContentSlide kicker={CLOSING_KICKER} title="Choose Basic Support" lead="The last screen offers three plans. Two cost money. Pick Basic" lesson={SESSION}>
        <PendingShot of="The support plan chooser" at="AWS sign-up → Select a support plan" shows="Basic support, free. Developer and Business are paid" />
      </ContentSlide>
    ),
  },
  {
    id: 'aws-autopay', section: 'Closing', label: 'Auto pay, and cancelling it',
    element: (
      <ProceduralStepsSlide kicker={CLOSING_KICKER} title="Auto Pay, and Cancelling It" lead="On the Free plan AWS does not charge you. Cancelling auto pay in your bank app is one extra lock" lesson={SESSION} steps={[
        { title: 'Open your bank or UPI app', detail: 'Not the AWS website', icon: 'info' },
        { title: 'Find AutoPay or e-mandates', detail: 'The name differs by bank', icon: 'target' },
        { title: 'Find Amazon Web Services and choose Cancel', icon: 'cross' },
        { title: 'Confirm with the OTP the bank sends', icon: 'shield-check' },
      ]} />
    ),
  },
  {
    id: 'aws-keep-it-zero', section: 'Closing', label: 'Keep it at zero',
    element: (
      <ContentSlide kicker={CLOSING_KICKER} title="Keep It at Zero" lead="Four habits. The first one is the one that matters" lesson={SESSION}>
        <DataTable columns={[{ label: 'Do this' }, { label: 'Why' }]} rows={[
          ['Stay on the Free plan. Never click Upgrade', 'AWS does not charge the Free plan. Only a Paid plan can bill you'],
          ['Stop the server when you finish', 'A running server uses credits. A stopped one does not'],
          ['Set a budget alert', 'AWS emails you before the credits run out'],
          ['Cancel the auto pay in your bank app', 'One extra lock, so nothing can leave your account by mistake'],
        ]} highlight={[1]} />
      </ContentSlide>
    ),
    notes: 'Checked on aws.amazon.com/free on 2026-09-15. The old twelve month, 750 hour tier is gone for new accounts. Free plan: USD 100 credits on sign up, up to 200, EC2 included, a payment method required for identity only, no charge unless you upgrade, account closes at six months with data kept 90 days. The course fits inside that. The one thing that can cost money is clicking Upgrade.',
  },
  {
    id: 'what-comes-next', section: 'Closing', label: 'What comes next',
    element: (
      <ContentNoteSlide kicker={CLOSING_KICKER} title="What Comes Next" lead="Every push now tests, builds and publishes two images. They have nowhere to run yet" lesson={SESSION} points={[
        { text: 'Both images are on Docker Hub, tagged with a build number', icon: 'check' },
        { text: 'Your laptop is not a server. It sleeps, and it has no public address', icon: 'warning' },
        { text: 'The next step is a computer on the internet that runs them', icon: 'rocket' },
      ]} note={{ kind: 'success', title: 'Jenkins is complete', body: 'From here the work moves to AWS. That is why your account needs to exist by then.' }} />
    ),
  },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', element: <ThankYouSlide lesson={SESSION} /> },
]
