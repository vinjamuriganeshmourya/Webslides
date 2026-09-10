import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  CommandSyntaxSlide,
  ContentNoteSlide,
  ContentSlide,
  KeyTakeawaysSlide,
  ProceduralStepsSlide,
  QuizTimeSlide,
  SectionBreakerSlide,
  StatusPointsSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import {
  CodeBlock,
  DataTable,
  FileTree,
  MachineBoundary,
  SocketBridge,
  StatusList,
  Terminal,
  TunnelPath,
} from '@/ui'
import { C1, C2, C3, C4, CLOSING_KICKER, ROOT, SESSION } from './deckShared'

/**
 * DEPLOYMENT SESSION 8 — "Setting Up Jenkins for Docker Builds"
 *
 * Plan: `../../session_plans/deployement_session_8/plan.md`, SIGNED OFF
 * 2026-09-10. Tasks: `tasks.md` beside it. 58 slides.
 *
 * FOUR THINGS AN EDIT HERE IS MOST LIKELY TO BREAK
 *
 *   1. **The four concept strings are constants** (`C1` to `C4` in
 *      `deckShared`). The agenda and the takeaways both read them, which is the
 *      only way to guarantee hard rule 20's word-for-word match. Do not type a
 *      concept name as a literal on either slide.
 *
 *   2. **No spaced em dash in any rendered string** (hard rule 1). Comments are
 *      exempt, which is why this block has none. Check with
 *      `grep -n "—" src/decks/*.tsx` and confirm every hit is in a comment.
 *
 *   3. **Never name another session on a slide** (hard rule 2b). The TR says
 *      "a direct consequence of Session 6" and "Next session's pipeline"; both
 *      are rewritten here to name the THING rather than the week. Speaker notes
 *      are exempt and are the right home for it.
 *
 *   4. **Terminals are VS Code's integrated terminal, one panel each, with the
 *      folder path** (hard rule 3). Never a bare PowerShell window, including
 *      for Docker commands, so the deck and the learner's screen never diverge.
 *
 * ALSO: the word "stranger" is banned (hard rule 2). The TR's line about
 * Jenkins being "a stranger to every service" is rewritten on slide 5.
 */

export const jenkinsDockerMeta: DeckMeta = {
  title: 'Setting Up Jenkins for Docker Builds',
  course: 'React + Django Integration · Deployment',
  lesson: 'Setting Up Jenkins for Docker Builds',
  presenter: 'NxtWave Instructor',
}

export const jenkinsDockerDeck: SlideDef[] = [
  /* ── FRONT FRAME, 5 ───────────────────────────────────────────────── */
  {
    id: 'brand',
    section: 'Opening',
    label: 'Brand',
    element: <BrandSlide greeting="Welcome" lesson={SESSION} />,
    notes: 'On screen while the room settles. Nothing but the mark.',
  },
  {
    id: 'session-name',
    section: 'Opening',
    label: 'Session name',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
  },
  {
    id: 'where-things-stand',
    section: 'Opening',
    label: 'Where things stand',
    element: (
      <ContentSlide
        kicker="Where Things Stand"
        title="A Green Build That Only Echoes"
        lead="Jenkins works, and so far it has automated nothing that matters"
        lesson={SESSION}
      >
        <StatusList
          immediate
          items={[
            {
              status: 'success',
              text: 'The nxttrendz project is published on GitHub',
              detail: 'Pushed to a remote, with .env verified absent from the repository',
            },
            {
              status: 'success',
              text: 'Jenkins runs in a container, with a jenkins_home volume',
              detail: 'The admin user, the plugins and the jobs all survive a restart',
            },
            {
              status: 'success',
              text: 'One job exists, and it prints a line',
              detail: 'hello-jenkins builds green, which proves the server works and nothing else',
            },
            {
              status: 'error',
              text: 'It cannot fetch, test, build or push your project',
              detail: 'Four abilities are missing, and this session adds all four',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Rule 2b: do not say "last session" out loud on the slide. In the room you can absolutely say "you saw this last week". The point of the slide is the last row: a green build that echoes is not automation yet.',
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        kicker="Agenda"
        title="What We Will Cover"
        lesson={SESSION}
        items={[
          { title: C1, sub: 'Why a container can build images without its own engine' },
          { title: C2, sub: 'Secrets that never appear in a job, a file or a log' },
          { title: C3, sub: 'The repository, and what makes a build start by itself' },
          { title: C4, sub: 'A real image, built by a machine, and the five errors on the way' },
        ]}
      />
    ),
    notes:
      'Four concepts, read from the same constants the takeaways use. The AWS block at the end is deliberately NOT on this list: it is an errand with a deadline, not something we teach.',
  },
  {
    id: 'the-four-gaps',
    section: 'Opening',
    label: 'The four gaps',
    element: (
      <ContentSlide
        kicker="Where Things Stand"
        title="Four Abilities Jenkins Does Not Have"
        lead="Every stage of the pipeline needs something Jenkins has never been given"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'Pipeline stage' },
            { label: 'What Jenkins needs' },
            { label: 'Has it?' },
          ]}
          rows={[
            ['Fetch the code', 'Read access to the GitHub repository', 'No'],
            ['Test the code', 'The SECRET_KEY that .env keeps out of Git', 'No'],
            ['Build the images', 'The ability to run docker commands', 'No'],
            ['Push to Docker Hub', 'Docker Hub credentials', 'No'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Three of the four are secrets or access. Jenkins has no relationship with any service this project touches, and today is the introduction. We close them in order of difficulty: Docker access first, because it is the genuinely tricky one, then the two credentials, then GitHub.',
  },

  /* ── CONCEPT 1 · Giving Jenkins the Docker Command, 11 ────────────── */
  {
    id: 'c1-divider',
    section: C1,
    label: '01 Divider',
    element: <SectionBreakerSlide index={1} title={C1} lesson={SESSION} />,
  },
  {
    id: 'c1-cannot-do-the-job',
    section: C1,
    label: 'The job that cannot',
    element: (
      <ContentSlide
        kicker={C1}
        title="The Job That Cannot Do the Job"
        lead="Add one docker command to the job you already have, and it stops dead"
        lesson={SESSION}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: 'docker build -t nxttrendz-backend .', kind: 'cmd' },
            { text: '/var/jenkins_home/workspace/hello-jenkins@tmp/script.sh: 1:', kind: 'out' },
            { text: 'docker: not found', kind: 'out' },
            { text: 'Build step marked build as failure', kind: 'out' },
            { text: 'Finished: FAILURE', kind: 'out' },
          ]}
          caption="The server is fine. The command it was asked to run does not exist inside it"
        />
      </ContentSlide>
    ),
    notes:
      'Open on the gap, not on the fix. Ask the room what is missing before advancing. Almost everyone says "Docker is not installed", which is half right and sets up the next two slides.',
  },
  {
    id: 'c1-docker-in-docker',
    section: C1,
    label: 'Docker inside Docker?',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="So, Docker Inside Docker?"
        lead="The obvious fix, and why nobody does it"
        lesson={SESSION}
        points={[
          { text: 'Jenkins runs inside a container, and the pipeline needs to run docker build', icon: 'info' },
          { text: 'The obvious answer is a complete Docker Engine installed inside that container', icon: 'info' },
          { text: 'That means building images in a nested world, where the images are then trapped', icon: 'warning' },
        ]}
        note={{
          kind: 'warning',
          title: 'Heavy, awkward, and thankfully unnecessary',
          body: 'There is a lighter answer, and it comes from splitting a word you have been using as if it were one thing.',
        }}
      />
    ),
    notes:
      'Let the room sit with the nested-world problem for a beat. The image trapped inside the inner Docker is the detail that makes the alternative feel necessary rather than clever.',
  },
  {
    id: 'c1-two-programs',
    section: C1,
    label: 'Docker is two programs',
    element: (
      <ContentSlide
        kicker={C1}
        title="Docker Is Two Programs"
        lead="Every docker command you have typed was a client talking to an engine"
        lesson={SESSION}
      >
        <SocketBridge />
      </ContentSlide>
    ),
    notes:
      'This is the hinge of the whole concept. The client is tiny, the engine is the machinery, and the socket file is the wire between them. Say the path out loud: /var/run/docker.sock. The figure already draws both boundaries, so slides 10 and 11 build on this picture instead of replacing it.',
  },
  {
    id: 'c1-only-needs-the-client',
    section: C1,
    label: 'Only the client',
    element: (
      <ContentSlide
        kicker={C1}
        title="Jenkins Only Needs the Client"
        lead="Not its own engine. The one on your machine is already running"
        lesson={SESSION}
      >
        <StatusList
          items={[
            {
              status: 'error',
              text: 'A second Docker Engine inside the Jenkins container',
              detail: 'Nested, heavy, and the images it builds cannot be seen from outside',
              label: 'Not this',
            },
            {
              status: 'success',
              text: 'The docker client inside the container',
              detail: 'A small program that only knows how to send a request',
              label: 'This',
            },
            {
              status: 'success',
              text: 'Access to the host machine socket file',
              detail: 'Giving a container access to a host file is a mount, the -v flag pointed at a file',
              label: 'And this',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The -v flag is familiar from the Compose work: they have mounted named volumes with it. This is the same flag pointed at a single file instead of a volume, which is the only new idea here.',
  },
  {
    id: 'c1-share-the-socket',
    section: C1,
    label: 'Share the socket',
    element: (
      <ContentSlide
        kicker={C1}
        title="Recreate It, with the Socket Mounted"
        lead="Stop it, remove it, run it again with one extra mount"
        lesson={SESSION}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: 'docker stop jenkins && docker rm jenkins', kind: 'cmd' },
            { text: 'jenkins', kind: 'out' },
            { text: 'jenkins', kind: 'out' },
            { text: 'docker run -d --name jenkins -p 8080:8080 -p 50000:50000 \\', kind: 'cmd' },
            { text: '  -v jenkins_home:/var/jenkins_home \\', kind: 'cmd' },
            { text: '  -v /var/run/docker.sock:/var/run/docker.sock \\', kind: 'cmd' },
            { text: '  jenkins/jenkins:lts', kind: 'cmd' },
            { text: '9f2c4b8e1a7d3c5f6b0a2e4d8c1f3a5b7d9e0c2a4f6b8d1e3c5a7f9b0d2e4c6a', kind: 'ok' },
          ]}
          caption="Deleting the container is safe: every setting lives in the jenkins_home volume"
        />
      </ContentSlide>
    ),
    notes:
      'Say why deleting is safe before anyone panics: the admin user, the plugins and the hello-jenkins job all live in the volume, so the new container reattaches and Jenkins comes back exactly as it was. This is the volume lesson paying off.',
  },
  {
    id: 'c1-flag-by-flag',
    section: C1,
    label: 'The mount, flag by flag',
    element: (
      <CommandSyntaxSlide
        kicker={C1}
        title="The Mount That Does the Work"
        lead="One flag, and it is the same shape as every volume mount you have written"
        lesson={SESSION}
        parts={[
          { token: '-v', label: 'the mount flag', body: 'Make something on the host visible inside the container' },
          { token: 'HOST', label: 'on the host', body: 'The socket the engine listens on: /var/run/docker.sock', fill: 'placeholder', after: ':' },
          { token: 'CONTAINER', label: 'in the container', body: 'Where the client looks for it. The same path, so nothing needs configuring', fill: 'placeholder' },
        ]}
        note={{
          kind: 'info',
          title: 'Why both sides are identical',
          body: 'The docker client looks at /var/run/docker.sock by default. Mounting it to the same path inside means it finds the host engine with no extra setup.',
        }}
      />
    ),
    notes:
      'The two identical paths confuse people every time. Left of the colon is the host, right is the container, and they match here only because the default path is convenient.',
  },
  {
    id: 'c1-install-the-client',
    section: C1,
    label: 'Install the client',
    element: (
      <ContentSlide
        kicker={C1}
        title="Install the Docker Client Inside the Container"
        lead="The official Jenkins image does not ship it, so add it once"
        lesson={SESSION}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: 'docker exec -u root jenkins bash -c "apt-get update && apt-get install -y docker.io"', kind: 'cmd' },
            { text: 'Get:1 http://deb.debian.org/debian bookworm InRelease', kind: 'out' },
            { text: 'Setting up docker.io ...', kind: 'out' },
            { text: 'Processing triggers for libc-bin ...', kind: 'ok' },
          ]}
          caption="-u root runs the command as root inside the container, which package installation needs"
        />
      </ContentSlide>
    ),
    notes:
      'This installs the client only. The engine it will talk to is the one already running on the host, reached through the socket we just mounted.',
  },
  {
    id: 'c1-the-plugin',
    section: C1,
    label: 'The Docker plugin',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="Install the Docker Pipeline Plugin"
        lead="Manage Jenkins, then Plugins, then Available plugins"
        lesson={SESSION}
        points={[
          { text: 'Search for Docker Pipeline and install it', icon: 'check' },
          { text: 'The pipeline you will write drives Docker through ordinary sh commands', icon: 'info' },
          { text: 'That means the same docker build and docker push you already type', icon: 'info' },
        ]}
        note={{
          kind: 'tip',
          title: 'Install it anyway',
          body: 'It is not strictly required for what comes next, but it is the standard companion for Docker work in Jenkins and every team you join will have it.',
        }}
      />
    ),
    notes:
      'Rule 2b: the slide says "the pipeline you will write", not "next session\'s pipeline". Say the timing out loud instead.',
  },
  {
    id: 'c1-prove-it',
    section: C1,
    label: 'Prove the wiring',
    element: (
      <ContentSlide
        kicker={C1}
        title="Prove the Whole Chain Works"
        lead="One command, and the answer tells you the socket wiring is right"
        lesson={SESSION}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: 'docker exec jenkins docker ps', kind: 'cmd' },
            { text: 'CONTAINER ID   IMAGE                 STATUS         NAMES', kind: 'out' },
            { text: '9f2c4b8e1a7d   jenkins/jenkins:lts   Up 4 minutes   jenkins', kind: 'ok' },
          ]}
          caption="A container listing itself. The client inside reached the engine outside"
        />
      </ContentSlide>
    ),
    notes:
      'Point at the one row and let the room notice what it is: the Jenkins container appearing in its own output. If they see this, every remaining Docker error in the session is something other than the socket.',
  },
  {
    id: 'c1-the-risk',
    section: C1,
    label: 'What we handed over',
    element: (
      <ContentNoteSlide
        kicker={C1}
        title="What We Just Handed Over"
        lead="The socket is not a small permission"
        lesson={SESSION}
        points={[
          { text: 'Whoever controls the socket effectively controls the host Docker', icon: 'warning' },
          { text: 'That includes starting, stopping and deleting any container on the machine', icon: 'warning' },
          { text: 'On a learning machine this is fine, and it is why the setup is this simple', icon: 'info' },
        ]}
        note={{
          kind: 'warning',
          title: 'Why production teams lock this down',
          body: 'They restrict who can reach the Jenkins instance, for exactly this reason. Worth knowing now, so it is not a surprise the first time you see it enforced.',
        }}
      />
    ),
    notes:
      'One callout, not two slides. A room that is never told this deserves better, but making it the topic would be out of proportion to a learning setup.',
  },

  /* ── CONCEPT 2 · Secrets Jenkins Can Use Safely, 9 ────────────────── */
  {
    id: 'c2-divider',
    section: C2,
    label: '02 Divider',
    element: <SectionBreakerSlide index={2} title={C2} lesson={SESSION} />,
  },
  {
    id: 'c2-the-wrong-way',
    section: C2,
    label: 'The wrong way first',
    element: (
      <ContentSlide
        kicker={C2}
        title="The Tempting Shortcut"
        lead="The push stage needs a Docker Hub login, so put it in the shell step"
        lesson={SESSION}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: 'docker login -u ravi123 -p MySecret123', kind: 'cmd' },
            { text: 'WARNING! Using --password via the CLI is insecure.', kind: 'out' },
            { text: 'Login Succeeded', kind: 'out' },
          ]}
          caption="It works, which is exactly what makes it dangerous"
        />
      </ContentSlide>
    ),
    notes:
      'Show it working first. A rule the room has seen succeed is a rule they remember breaking; a rule that only ever fails is one they never tried.',
  },
  {
    id: 'c2-why-worse',
    section: C2,
    label: 'Why that is worse',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="Why That Is Worse Than It Looks"
        lead="Two places that password now lives, and neither of them is private"
        lesson={SESSION}
        points={[
          { text: 'In plain text in the job configuration, readable by anyone who can view the job', icon: 'warning' },
          { text: 'In every Console Output, readable by anyone who can view a build', icon: 'warning' },
          { text: 'And soon in a Jenkinsfile committed to GitHub, where Git history does not forget', icon: 'warning' },
        ]}
        note={{
          kind: 'warning',
          title: 'The same mistake as committing .env',
          body: 'And Jenkins has the same class of solution: put the secret somewhere encrypted and refer to it by name.',
        }}
      />
    ),
    notes:
      'The Git history line is the one that lands. A password removed in a later commit is still in the history, and a public repository means it is still readable.',
  },
  {
    id: 'c2-the-store',
    section: C2,
    label: 'The credentials store',
    element: (
      <ContentSlide
        kicker={C2}
        title="The Credentials Store"
        lead="Secrets go in once, get an ID, and pipelines refer to the ID only"
        lesson={SESSION}
      >
        <StatusList
          immediate
          items={[
            {
              status: 'success',
              text: 'The secret is stored encrypted, inside Jenkins',
              detail: 'It never appears in a job definition, a Jenkinsfile or a log',
            },
            {
              status: 'success',
              text: 'Everything else refers to it by ID',
              detail: 'A Jenkinsfile says "use the credential with ID dockerhub-credentials" and nothing more',
            },
            {
              status: 'success',
              text: 'If it would ever be printed, Jenkins masks it',
              detail: 'The Console Output shows **** in place of the value',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The ID is a public name for a private value. That sentence is worth saying exactly once, slowly.',
  },
  {
    id: 'c2-dockerhub-credential',
    section: C2,
    label: 'The Docker Hub credential',
    element: (
      <ContentSlide
        kicker={C2}
        title="Add the Docker Hub Credential"
        lead="Manage Jenkins, Credentials, System, Global credentials, Add Credentials"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Field' }, { label: 'Value' }]}
          rows={[
            ['Kind', 'Username with password'],
            ['Username', 'ravi123, your Docker ID'],
            ['Password', 'the access token, not your account password'],
            ['ID', 'dockerhub-credentials'],
            ['Description', 'Docker Hub token for image pushes'],
          ]}
          highlight={[4]}
        />
      </ContentSlide>
    ),
    notes:
      'Get the token first, on hub.docker.com: Account Settings, Security, New Access Token, name it jenkins, Read and Write. Machines get tokens, never your real password, because a leaked token can be revoked without changing your account. The ID is highlighted because pipelines will use it and changing it later means editing every Jenkinsfile that refers to it.',
  },
  {
    id: 'c2-secret-key-credential',
    section: C2,
    label: 'The SECRET_KEY credential',
    element: (
      <ContentSlide
        kicker={C2}
        title="Add the Django SECRET_KEY"
        lead="The test suite runs inside the backend image, where there is no .env"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Field' }, { label: 'Value' }]}
          rows={[
            ['Kind', 'Secret text, not Username with password'],
            ['Secret', 'any long random string, a throwaway value'],
            ['ID', 'django-secret-key'],
            ['Description', 'SECRET_KEY for pipeline test runs'],
          ]}
          highlight={[1]}
        />
      </ContentSlide>
    ),
    notes:
      'Rule 2b: do not say "a consequence of session 6" on the slide. The reasoning to say out loud: SECRET_KEY was moved out of settings.py into .env, and .env is deliberately kept out of both Git and the image. So on the Jenkins machine there is no key at all, and Django refuses to start without one. That is the design working, not a bug: configuration is supplied by whoever runs the container, and here that is Jenkins. Kind is Secret text because this secret has no username half.',
  },
  {
    id: 'c2-masking',
    section: C2,
    label: 'Masked in the log',
    element: (
      <ContentSlide
        kicker={C2}
        title="How a Job Uses One Without Printing It"
        lead="The value is there when the command runs, and gone from the log"
        lesson={SESSION}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: 'docker login -u ravi123 -p ****', kind: 'cmd' },
            { text: 'Login Succeeded', kind: 'ok' },
            { text: 'docker push ravi123/nxttrendz-backend:latest', kind: 'cmd' },
            { text: 'latest: digest: sha256:3f9a... size: 2841', kind: 'ok' },
          ]}
          caption="Jenkins substituted the real token, then masked it on the way to the log"
        />
      </ContentSlide>
    ),
    notes:
      'Compare this against the earlier slide deliberately. Same command, same result, and the password is no longer readable by anyone who can open the build.',
  },
  {
    id: 'c2-kinds',
    section: C2,
    label: 'Which kind to pick',
    element: (
      <ContentSlide
        kicker={C2}
        title="Which Kind to Pick"
        lead="Jenkins offers a kind per shape of secret. Pick the one that fits"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Kind' }, { label: 'Use it for' }, { label: 'In this project' }]}
          rows={[
            ['Username with password', 'A secret that has two halves', 'Docker Hub, and a private GitHub repository'],
            ['Secret text', 'A single value with no username', 'SECRET_KEY'],
            ['Secret file', 'A whole file the build needs', 'A service account key, later on'],
            ['SSH username with private key', 'Key based access to a server', 'Deploying to a remote machine'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The bottom two are not used today. They are here so that the store does not look like it holds only two shapes of thing.',
  },
  {
    id: 'c2-quiz',
    section: C2,
    label: 'Quiz Time',
    element: <QuizTimeSlide lesson={SESSION} />,
    notes:
      'The announcement frame. Questions are delivered by the external quiz component, not authored as slides.',
  },

  /* ── CONCEPT 3 · Pointing Jenkins at Your Code, 11 ────────────────── */
  {
    id: 'c3-divider',
    section: C3,
    label: '03 Divider',
    element: <SectionBreakerSlide index={3} title={C3} lesson={SESSION} />,
  },
  {
    id: 'c3-public-repo',
    section: C3,
    label: 'Public repository',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="A Public Repository Needs Nothing"
        lead="The repository already exists. The only question is whether Jenkins needs permission to read it"
        lesson={SESSION}
        points={[
          { text: 'If the repository is public, Jenkins clones it with no credentials at all', icon: 'check' },
          { text: 'A repository URL is all any pipeline needs', icon: 'link' },
          { text: 'https://github.com/ravi123/nxttrendz.git', icon: 'code' },
        ]}
        note={{
          kind: 'info',
          title: 'Most learning projects are public',
          body: 'If yours is, you can skip the next slide. It is here because private is the normal case at work.',
        }}
      />
    ),
  },
  {
    id: 'c3-private-repo',
    section: C3,
    label: 'Private repository',
    element: (
      <ContentSlide
        kicker={C3}
        title="A Private Repository Repeats the Same Pattern"
        lead="Credentials are one pattern, applied once per service"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Service' }, { label: 'Secret created on' }, { label: 'Kind' }, { label: 'Stored as' }]}
          rows={[
            ['Docker Hub', 'hub.docker.com, access token', 'Username with password', 'dockerhub-credentials'],
            ['GitHub', 'github.com, personal access token', 'Username with password', 'github-credentials'],
            ['Django', 'invented by you', 'Secret text', 'django-secret-key'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'On GitHub: Settings, Developer settings, Personal access tokens, generate one with repo scope. Then add it in Jenkins exactly the way the Docker Hub one was added. The point of the table is the repetition: three services, one pattern.',
  },
  {
    id: 'c3-point-the-job',
    section: C3,
    label: 'Point the job at it',
    element: (
      <ContentSlide
        kicker={C3}
        title="Point the Job at the Repository"
        lead="In the job configuration, the Git step takes a URL and, if needed, a credential"
        lesson={SESSION}
      >
        <StatusList
          immediate
          items={[
            {
              status: 'success',
              text: 'Repository URL',
              detail: 'https://github.com/ravi123/nxttrendz.git',
              code: true,
            },
            {
              status: 'success',
              text: 'Branch',
              detail: 'main, which is what the push created',
            },
            {
              status: 'info',
              text: 'Credentials',
              detail: 'Leave as none for a public repository, or select github-credentials for a private one',
            },
          ]}
        />
      </ContentSlide>
    ),
    /*
      PLAN DEVIATION, RECORDED. plan.md §5 asks for `ContentSlide` + `Shot` here.
      The capture needs a running Jenkins at a configured job screen, which is
      phase 3a of tasks.md and cannot be taken from this machine. The slide
      carries the same three facts without it; add the `Shot` when the capture
      exists rather than shipping a placeholder image.
    */
  },
  {
    id: 'c3-repository-contract',
    section: C3,
    label: 'The repository contract',
    element: (
      <ContentSlide
        kicker={C3}
        title="What Jenkins Expects to Find"
        lead="From here on, the repository is the single source everything flows from"
        lesson={SESSION}
      >
        <FileTree
          root="nxttrendz/  (on GitHub)"
          entries={[
            { name: 'backend/', folder: true },
            { name: 'manage.py, products/, requirements.txt', note: 'the Django code', depth: 1 },
            { name: 'Dockerfile', note: 'builds the backend image', depth: 1, state: 'existing' },
            { name: 'frontend/', folder: true },
            { name: 'package.json, src/', note: 'the React code', depth: 1 },
            { name: 'Dockerfile', note: 'builds the frontend image', depth: 1, state: 'existing' },
            { name: 'docker-compose.yml', note: 'how to run the stack' },
            { name: 'Makefile', note: 'the command menu' },
            { name: '.env', note: 'never in this list', state: 'later' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The warning worth saying out loud: the root has no Dockerfile, because this project keeps one per application folder so a build never sweeps both apps into one image. Every docker build from here on must name which folder it is building, ./backend or ./frontend. A bare docker build . at the root fails, and we will see exactly that error later.',
  },
  {
    id: 'c3-what-starts-a-run',
    section: C3,
    label: 'What starts a run',
    element: (
      <ContentSlide
        kicker={C3}
        title="What Starts a Run"
        lead="Three ways a build begins, and only one of them is automation"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Trigger' }, { label: 'What starts it' }, { label: 'Automatic?' }]}
          rows={[
            ['Build Now', 'A person clicks a button', 'No'],
            ['Poll SCM', 'Jenkins asks GitHub for changes on a timer', 'Nearly'],
            ['Webhook', 'GitHub tells Jenkins the moment you push', 'Yes'],
          ]}
          highlight={[3]}
        />
      </ContentSlide>
    ),
    notes:
      'Poll SCM works but it is Jenkins asking over and over, and a change waits until the next poll. The webhook inverts it: GitHub does the telling. That is what the rest of this concept sets up.',
  },
  {
    id: 'c3-cannot-reach-localhost',
    section: C3,
    label: 'The reachability problem',
    element: (
      <ContentSlide
        kicker={C3}
        title="GitHub Cannot Reach Your Laptop"
        lead="The webhook needs an address GitHub can post to, and localhost is not one"
        lesson={SESSION}
      >
        {/*
          The figure's defaults draw React and Django dev servers and a friend's
          browser, which is an honest picture of a claim this slide is not
          making. Slide 32's claim is that GitHub cannot reach Jenkins. Same
          argument, different pair, so the labels are passed in.
        */}
        <MachineBoundary
          inside={[
            { icon: 'devices', label: 'Your browser' },
            { icon: 'server', label: 'Jenkins', port: 'localhost:8080' },
            { icon: 'code', label: 'The ngrok agent, shortly', port: 'not running yet' },
          ]}
          insideNote="All reachable from this machine, and only this machine"
          outsider={{ icon: 'server', label: "GitHub's servers", port: 'somewhere on the internet' }}
          outsiderNote="They can only post to an address that exists on the internet"
          failure="could not connect"
        />
      </ContentSlide>
    ),
    notes:
      'GitHub servers must be able to REACH the payload URL, and localhost:8080 is only reachable from your own machine. This is not a flaw in the setup: it is the reason real Jenkins servers run on machines with public addresses. The next slide is the way around it for today.',
  },
  {
    id: 'c3-the-tunnel',
    section: C3,
    label: 'A tunnel',
    element: (
      <ContentSlide
        kicker={C3}
        title="A Tunnel Gives You a Public Address"
        lead="One command, and your laptop has an address GitHub can post to"
        lesson={SESSION}
      >
        <TunnelPath />
      </ContentSlide>
    ),
    notes:
      'This is the slowest beat in the session. Everyone signs up at ngrok.com, installs it, pastes their authtoken and reads their own dev domain off the terminal. The free plan is enough: it gives one stable dev domain that survives a restart, 20k requests and 1GB of transfer a month. Do not let anyone skip the authtoken step, it is the one that fails silently.',
  },
  {
    id: 'c3-run-the-tunnel',
    section: C3,
    label: 'Run it',
    element: (
      <ContentSlide
        kicker={C3}
        title="Run the Tunnel"
        lead="Your dev domain is printed in the Forwarding line. Copy it"
        lesson={SESSION}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: 'ngrok config add-authtoken <your token from the dashboard>', kind: 'cmd' },
            { text: 'Authtoken saved to configuration file', kind: 'ok' },
            { text: 'ngrok http 8080', kind: 'cmd' },
            { text: 'Session Status    online', kind: 'out' },
            { text: 'Forwarding        https://calm-owl-42.ngrok-free.app -> http://localhost:8080', kind: 'ok' },
          ]}
          caption="Leave this running. Close it and the tunnel closes with it"
        />
      </ContentSlide>
    ),
    notes:
      'The dev domain is stable across restarts on a free account, so the payload URL entered today keeps working. It is not stable across accounts, so everyone has their own and nobody can use the one on this slide.',
  },
  {
    id: 'c3-payload-url',
    section: C3,
    label: 'The Payload URL',
    element: (
      <CommandSyntaxSlide
        kicker={C3}
        title="The Payload URL, Field by Field"
        lead="GitHub needs one address, and the last part of it is not optional"
        lesson={SESSION}
        parts={[
          { token: 'https://', label: 'scheme', body: 'The tunnel serves HTTPS, which GitHub requires', after: '' },
          { token: 'DEV-DOMAIN', label: 'your dev domain', body: 'Yours will differ. Read it off the Forwarding line', fill: 'placeholder', after: '' },
          { token: '/github-webhook/', label: 'the endpoint', body: 'The trailing slash matters' },
        ]}
        note={{
          kind: 'warning',
          title: 'The trailing slash is the classic mistake',
          body: 'Leave it off and GitHub gets a 404 while everything else looks correct.',
        }}
      />
    ),
  },
  {
    id: 'c3-add-the-webhook',
    section: C3,
    label: 'Add the webhook',
    element: (
      <ContentSlide
        kicker={C3}
        title="Add the Webhook on GitHub"
        lead="Repository Settings, then Webhooks, then Add webhook"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Field' }, { label: 'Value' }]}
          rows={[
            ['Payload URL', 'https://calm-owl-42.ngrok-free.app/github-webhook/'],
            ['Content type', 'application/json'],
            ['Secret', 'leave empty for now'],
            ['Which events', 'Just the push event'],
            ['Active', 'ticked'],
          ]}
          highlight={[1]}
        />
      </ContentSlide>
    ),
    /*
      PLAN DEVIATION, RECORDED. plan.md §5 asks for a `Shot` of the GitHub
      webhook form. The capture needs a live tunnel and a real repository, which
      is phase 3b of tasks.md. The table carries every field the learner types.
    */
    notes:
      'In Jenkins, tick "GitHub hook trigger for GITScm polling" in the job configuration, or the hook arrives and nothing listens for it.',
  },
  {
    id: 'c3-it-fired',
    section: C3,
    label: 'It fired',
    element: (
      <ContentSlide
        kicker={C3}
        title="Push, and Watch It Fire"
        lead="GitHub keeps a delivery record, and it tells you exactly what happened"
        lesson={SESSION}
      >
        <StatusList
          items={[
            {
              status: 'success',
              text: 'GitHub shows a green tick against the delivery',
              detail: 'Recent Deliveries, on the webhook page. Response 200',
            },
            {
              status: 'success',
              text: 'Jenkins starts a build with nobody touching it',
              detail: 'The build page says "Started by GitHub push"',
            },
            {
              status: 'info',
              text: 'If the delivery is red, read its response body',
              detail: 'GitHub prints the reason, which is usually the trailing slash or a closed tunnel',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'This is the payoff of the whole concept. A git push, and a machine starts working. Have one person in the room push and let everyone watch their own Jenkins start.',
  },

  /* ── CONCEPT 4 · The First Build from Jenkins, 11 ─────────────────── */
  {
    id: 'c4-divider',
    section: C4,
    label: '04 Divider',
    element: <SectionBreakerSlide index={4} title={C4} lesson={SESSION} />,
  },
  {
    id: 'c4-the-build-step',
    section: C4,
    label: 'The build step',
    element: (
      <ContentSlide
        kicker={C4}
        title="A Minimal Pipeline, Two Stages"
        lead="New Item, name it nxttrendz-build-test, type Pipeline, then paste this"
        lesson={SESSION}
      >
        <CodeBlock
          language="groovy"
          filename="Pipeline script"
          fontSize={13}
          code={`pipeline {
    agent any

    stages {
        stage('Fetch') {
            steps {
                git branch: 'main', url: 'https://github.com/ravi123/nxttrendz.git'
            }
        }
        stage('Build') {
            steps {
                sh 'docker build -t nxttrendz-backend ./backend'
            }
        }
    }
}`}
          highlight={[13]}
        />
      </ContentSlide>
    ),
    notes:
      'Read it as plain English for now: two stages, fetch then build. The pipeline syntax gets its full introduction when the Jenkinsfile arrives. Two details are worth pausing on: ./backend rather than a dot, because the build context is the application folder; and no Docker ID and no version tag, because this is a throwaway proof that the socket works, not a release.',
  },
  {
    id: 'c4-build-now',
    section: C4,
    label: 'Build Now',
    element: (
      <ContentSlide
        kicker={C4}
        title="Build Now, and What to Watch"
        lead="The build page shows a Stage View: one green box per stage, with its duration"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Stage' }, { label: 'What it does' }, { label: 'Typical' }]}
          rows={[
            ['Fetch', 'Clones the repository into the job workspace', '3s'],
            ['Build', 'Runs docker build through the mounted socket', '14s'],
          ]}
        />
      </ContentSlide>
    ),
    /*
      PLAN DEVIATION, RECORDED. A `Shot` of the Stage View belongs here and needs
      a real build on a running Jenkins (phase 3a of tasks.md).
    */
  },
  {
    id: 'c4-reading-the-console',
    section: C4,
    label: 'Reading the console',
    element: (
      <ContentSlide
        kicker={C4}
        title="Reading the Console, Top to Bottom"
        lead="Every line is a step you would have typed yourself"
        lesson={SESSION}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: 'Cloning repository https://github.com/ravi123/nxttrendz.git', kind: 'out' },
            { text: 'Checking out Revision 4f8a2c1 (main)', kind: 'out' },
            { text: 'docker build -t nxttrendz-backend ./backend', kind: 'cmd' },
            { text: '#5 [2/5] WORKDIR /app', kind: 'out' },
            { text: '#8 [4/5] RUN pip install -r requirements.txt', kind: 'out' },
            { text: 'Successfully built nxttrendz-backend', kind: 'ok' },
            { text: 'Finished: SUCCESS', kind: 'ok' },
          ]}
          caption="A machine cloned your repository and built your image, end to end"
        />
      </ContentSlide>
    ),
    notes:
      'Pause here properly. You clicked one button and a machine did the whole thing. That button click is the last human step left, and it is the one the webhook already removed.',
  },
  {
    id: 'c4-verify-from-host',
    section: C4,
    label: 'Verify from the host',
    element: (
      <ContentSlide
        kicker={C4}
        title="The Image Exists, and the Host Can See It"
        lead="Built by Jenkins, through the shared socket, into your own image store"
        lesson={SESSION}
      >
        <Terminal
          path={ROOT}
          lines={[
            { text: 'docker images | grep nxttrendz', kind: 'cmd' },
            { text: 'nxttrendz-backend   latest   7c1f4b2e9a83   About a minute ago   214MB', kind: 'ok' },
          ]}
          caption="The same image store you have used all along"
        />
      </ContentSlide>
    ),
    notes:
      'This is the pleasant consequence of sharing the socket rather than nesting an engine: the image is not trapped anywhere. It is right where your own builds land.',
  },
  {
    id: 'c4-what-a-machine-did',
    section: C4,
    label: 'What a machine did',
    element: (
      <ContentSlide
        kicker={C4}
        title="What a Machine Just Did That You Used to Do"
        lead="The same four steps, and none of them were yours"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'You used to' }, { label: 'Now' }]}
          rows={[
            ['Open a terminal in the project folder', 'Jenkins clones the repository into a fresh workspace'],
            ['Remember which folder holds the Dockerfile', 'The pipeline names ./backend every time'],
            ['Type docker build and wait', 'The Build stage runs it through the socket'],
            ['Notice later that you forgot', 'A push starts it, so forgetting is not possible'],
          ]}
        />
      </ContentSlide>
    ),
    /*
      PLAN DEVIATION, RECORDED. plan.md §5 asks for `SwapRows` here, which draws
      a before and after as a swap rather than a table and is the better figure
      for this claim. `SwapRows` is committed on `kit/lit-surfaces` (d7de45a,
      e337a0d) and is NOT on main, so it is unavailable on this branch. Swap the
      `DataTable` for it once that branch merges. This is the only slide in the
      deck still waiting on that.
    */
  },
  {
    id: 'c4-error-1',
    section: C4,
    label: 'Error 1',
    element: (
      <StatusPointsSlide
        kicker={C4}
        title="Error 1: docker not found"
        lead="The client is missing inside the Jenkins container"
        lesson={SESSION}
        items={[
          { status: 'error', text: 'docker: not found', detail: 'Printed by the shell inside the container, then Finished: FAILURE', code: true },
          { status: 'info', text: 'The Docker client was never installed, or the container was recreated without redoing it' },
          { status: 'success', text: 'Re-run the apt-get install docker.io exec command', detail: 'Installing the client is a per-container step, not a per-machine one' },
        ]}
      />
    ),
  },
  {
    id: 'c4-error-2',
    section: C4,
    label: 'Error 2',
    element: (
      <StatusPointsSlide
        kicker={C4}
        title="Error 2: Permission Denied on the Socket"
        lead="The client is there and the socket is mounted, but the user cannot use it"
        lesson={SESSION}
        items={[
          { status: 'error', text: 'permission denied while trying to connect to the Docker daemon socket', detail: 'at unix:///var/run/docker.sock', code: true },
          { status: 'info', text: 'The jenkins user inside the container lacks permission on the mounted file' },
          { status: 'success', text: 'docker exec -u root jenkins bash -c "chmod 666 /var/run/docker.sock"', detail: 'Blunt but standard for a learning setup. Hardened setups use group membership instead', code: true },
        ]}
      />
    ),
  },
  {
    id: 'c4-error-3',
    section: C4,
    label: 'Error 3',
    element: (
      <StatusPointsSlide
        kicker={C4}
        title="Error 3: Repository Not Found"
        lead="Git could not read the repository at that URL"
        lesson={SESSION}
        items={[
          { status: 'error', text: "fatal: repository 'https://github.com/ravi123/nxttrendz.git/' not found", code: true },
          { status: 'info', text: 'Either the URL has a typo, or the repository is private and the job has no credential attached' },
          { status: 'success', text: 'Check the URL first, then select github-credentials in the job Git step' },
        ]}
      />
    ),
  },
  {
    id: 'c4-errors-4-and-5',
    section: C4,
    label: 'Errors 4 and 5',
    element: (
      <StatusPointsSlide
        kicker={C4}
        title="Errors 4 and 5: Daemon and Context"
        lead="One means the socket was never mounted. The other is a habit"
        lesson={SESSION}
        items={[
          { status: 'error', text: 'Cannot connect to the Docker daemon at unix:///var/run/docker.sock', detail: 'The container is running without the socket mount. Stop it, remove it, run it again with both -v flags', code: true },
          { status: 'error', text: 'failed to read dockerfile: open Dockerfile: no such file or directory', detail: 'A dot means the repository root, and the root has no Dockerfile', code: true },
          { status: 'success', text: 'Name the folder: docker build -t nxttrendz-backend ./backend', detail: 'If a build instead succeeds but produces a suspiciously huge image, check for a stray root Dockerfile sweeping both applications into one', code: true },
        ]}
      />
    ),
  },
  {
    id: 'c4-diagnostic-ladder',
    section: C4,
    label: 'The diagnostic ladder',
    element: (
      <ProceduralStepsSlide
        kicker={C4}
        title="The Diagnostic Ladder"
        lead="When a Jenkins Docker build fails, test each link of the chain in order"
        lesson={SESSION}
        steps={[
          { title: 'docker ps, on the host', detail: 'The Jenkins container is running', icon: 'terminal' },
          { title: 'docker exec jenkins docker --version', detail: 'The client is installed inside', icon: 'terminal' },
          { title: 'docker exec jenkins docker ps', detail: 'The socket is mounted and permitted', icon: 'terminal' },
          { title: 'Re-run the job and read Console Output', detail: 'The pipeline itself', icon: 'play' },
        ]}
      />
    ),
    notes:
      'Teach the ladder, not the five errors. Anyone who can walk these four rungs can diagnose an error that is not on our list.',
  },

  /* ── CLOSING BLOCK, 11 ────────────────────────────────────────────── */
  {
    id: 'quiz',
    section: 'Closing',
    label: 'Quiz Time',
    element: <QuizTimeSlide lesson={SESSION} />,
  },
  {
    id: 'key-takeaways',
    section: 'Closing',
    label: 'Key takeaways',
    element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={[C1, C2, C3, C4]} />,
    notes:
      'Hard rule 20: these are the agenda strings, read from the same constants. Do not reword them here.',
  },
  {
    id: 'aws-divider',
    section: 'Closing',
    label: 'Before we meet again',
    element: <SectionBreakerSlide title={CLOSING_KICKER} lesson={SESSION} />,
    notes:
      'No index number and no agenda row, deliberately. This is an errand with a deadline, not something the session teaches.',
  },
  {
    id: 'aws-why-now',
    section: 'Closing',
    label: 'Why now',
    element: (
      <ContentNoteSlide
        kicker={CLOSING_KICKER}
        title="Create Your AWS Account Today"
        lead="Not because we need it today, but because activation is not instant"
        lesson={SESSION}
        points={[
          { text: 'An account can activate in minutes, and it can take up to 24 hours', icon: 'info' },
          { text: 'Non card payment methods can take 48 to 72 hours', icon: 'warning' },
          { text: 'You will need it for the deployment work, and a room that cannot log in cannot do that work', icon: 'info' },
        ]}
        note={{
          kind: 'warning',
          title: 'This account exists to learn on',
          body: 'It is only for learning purposes, not for real time usage. Sign up on your own device with your own details. Nobody collects anybody card details, not the trainer, not the chat, not a shared sheet.',
        }}
      />
    ),
    notes:
      'Rule 2b: say "the deployment work", never "session 10". Say the two sentences in the callout out loud, do not just leave them on the slide.',
  },
  {
    id: 'aws-have-ready',
    section: 'Closing',
    label: 'Have these ready',
    element: (
      <ContentSlide
        kicker={CLOSING_KICKER}
        title="Have These Eight Things Ready"
        lead="So nobody is hunting for a detail halfway through the signup"
        lesson={SESSION}
      >
        <DataTable
          compact
          columns={[{ label: 'What AWS asks for' }, { label: 'What trips people' }]}
          rows={[
            ['Email address', 'It becomes the root user sign in name. Use one you will still have in two years'],
            ['AWS account name', 'Just a label, changeable later. Not the sign in'],
            ['Root password', '8 to 128 characters, and at least three of uppercase, lowercase, digits, symbols'],
            ['Account type', 'Personal, not Business'],
            ['Name, phone, country, full address', 'These must match the payment method own records'],
            ['Payment method', 'A card, or a UPI ID in India. AWS requires one even for the Free Tier'],
            ['Phone verification', 'An SMS or voice code, so the phone must be reachable'],
            ['Support plan', 'Choose Basic. It is free, and it is not the preselected one'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Say this before it happens: a small verification charge may appear on the instrument and AWS reverses it. Somebody will otherwise think they have been billed for the course. A mismatch between the address and the payment method records is the commonest cause of a stuck account.',
  },
  {
    id: 'aws-signup',
    section: 'Closing',
    label: 'The sign-up',
    element: (
      <ProceduralStepsSlide
        kicker={CLOSING_KICKER}
        title="The Sign Up, Screen by Screen"
        lead="Only two of these need a decision"
        lesson={SESSION}
        steps={[
          { title: 'Email, then verify it', icon: 'link' },
          { title: 'Root password', detail: 'Three of the four character types', icon: 'key' },
          { title: 'Contact information', detail: 'Personal, matching your payment method', icon: 'info' },
          { title: 'Payment and phone', detail: 'A small reversible charge', icon: 'shield' },
          { title: 'Support plan: Basic', detail: 'Free, not preselected', icon: 'check' },
        ]}
      />
    ),
    /*
      PLAN DEVIATION, RECORDED, and this one is deliberate rather than blocked.
      D3 allows at most two captures here, at screens with nothing personal on
      them. A real sign up shows a real name, address and payment instrument, so
      the steps are prose and the two permitted captures (the support plan
      chooser, and one earlier screen) get added only if someone runs a signup
      on an account whose details can be shown.
    */
  },
  {
    id: 'aws-autopay',
    section: 'Closing',
    label: 'Auto pay, and cancelling',
    element: (
      <ProceduralStepsSlide
        kicker={CLOSING_KICKER}
        title="Auto Pay, and Cancelling It After Activation"
        lead="Automatic recurring payment in India is an e-mandate. Cancel it in your bank app, not in AWS"
        lesson={SESSION}
        steps={[
          { title: 'Open your bank or UPI app', detail: 'Not the AWS console. The mandate lives with the bank', icon: 'info' },
          { title: 'Find active e-mandates or AutoPay', detail: 'The wording differs per bank', icon: 'target' },
          { title: 'Find Amazon Web Services and choose Cancel', detail: 'It will be listed by that name', icon: 'cross' },
          { title: 'Complete the bank second step', detail: 'Expect an OTP or another authentication step', icon: 'shield-check' },
        ]}
      />
    ),
    notes:
      'AWS supports the e-mandate on cards and on UPI AutoPay, enabled from the Billing Dashboard Payments page, and it currently automates bills up to fifteen thousand rupees each. The caveat on the next slide is the important half of this.',
  },
  {
    id: 'aws-keep-it-zero',
    section: 'Closing',
    label: 'Keeping it at zero',
    element: (
      <ContentSlide
        kicker={CLOSING_KICKER}
        title="Four Things That Keep It at Zero"
        lead="Cancelling the mandate stops the debit. It does not stop the charges"
        lesson={SESSION}
      >
        <DataTable
          columns={[{ label: 'Protection' }, { label: 'What it does' }]}
          rows={[
            ['Stay inside the Free Tier', 'One micro instance, 750 hours a month, twelve months'],
            ['Set a zero spend budget alert', 'An email the moment the forecast leaves zero. This is the one that catches mistakes while they are cheap'],
            ['Stop the instance when finished', 'A stopped instance bills nothing for compute'],
            ['Cancel the e-mandate', 'Stops the automatic debit, so nothing leaves your account without a decision'],
          ]}
          highlight={[2]}
        />
      </ContentSlide>
    ),
    notes:
      'Be straight about this. Cancelling the mandate means an unpaid invoice and a suspended account rather than a silent debit; it does not mean the charge never happened. The four together are one lesson: you are renting, and you are responsible for switching it off. The course can say it costs nothing if you stay inside the Free Tier. It cannot promise you will not be charged, because that depends on what you do next.',
  },
  {
    id: 'what-comes-next',
    section: 'Closing',
    label: 'What comes next',
    element: (
      <ContentNoteSlide
        kicker={CLOSING_KICKER}
        title="What Comes Next"
        lead="Jenkins can fetch and build. Three things still live in the wrong place"
        lesson={SESSION}
        points={[
          { text: 'The pipeline is a script pasted into the Jenkins UI, and it belongs in a Jenkinsfile in the repository', icon: 'info' },
          { text: 'There are no test and push stages yet, and both stored credentials are waiting to be used', icon: 'info' },
          { text: 'Only the backend image is built. The frontend is built the same way, from ./frontend', icon: 'info' },
        ]}
        note={{
          kind: 'success',
          title: 'One human action is already gone',
          body: 'The webhook removed the button. A git push is what starts the work now.',
        }}
      />
    ),
    notes:
      'Rule 2b: the title is "What Comes Next", not "Next session". The plan listed this slide as "Next session" and that title breaks the rule.',
  },
  {
    id: 'thank-you',
    section: 'Closing',
    label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
  },
]
