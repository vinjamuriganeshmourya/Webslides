import type { SlideDef } from '@/deck/types'
import { ContentNoteSlide, ContentSlide, SectionBreakerSlide } from '@/slides'
import { BoundaryBridge, CodeBlock, DataTable, Terminal } from '@/ui'
/* Session-owned figure, imported from its own file rather than through `@/ui`.
   `src/ui/index.ts` is kit-owned, so `sync-kit.mjs` overwrites it and the
   re-export line that used to live at its tail vanished on sync — this file
   stopped compiling with "Module '@/ui' has no exported member 'ImageNameAnatomy'".
   Importing the file directly keeps it out of the kit's way permanently. */
import { ImageNameAnatomy } from '@/ui/ImageNameAnatomy'
import { AT_ROOT, C2, C3, Code, DOCKER_ID, IMAGE, ON_ANOTHER_MACHINE, pushDenied, REPO, SESSION, Tech } from './deckShared'

/**
 * Deployment · Session 6 "Pushing Image to Docker Hub" — slides 21 to 38.
 *
 * Concept 2 (21 to 28) and Concept 3 (29 to 38) of the signed plan at
 * `django_deployement_course/session_plans/deployement_session_6/plan.md`. Slide
 * ids match the plan's `id` column so the two can be read side by side.
 *
 * SEGMENT NOTES, each one a decision a reviewer would otherwise have to ask
 * about:
 *
 *   A  EVERY TRANSCRIPT IS QUOTED FROM THE TR (§2.1 to §3.3), not captured and
 *      not composed. Docker Desktop cannot run on the capture machine, and this
 *      session additionally needs a real Docker Hub account and a real push, so
 *      a screenshot is impossible rather than merely inconvenient. Session 5's
 *      R8, unchanged.
 *
 *   B  THE REFUSAL TEXT COMES FROM `pushDenied()`. Slides 22 and 49 show the same
 *      error for two different reasons, which is the whole point of slide 23's
 *      warning and of slide 49. One string, so the two panels cannot drift.
 *
 *   C  `Terminal` HAS NO `err` KIND in this kit: its `TerminalLine.kind` is
 *      `cmd | out | ok`. The refusal on slide 22 is therefore an `out` line, and
 *      the slide leans on the lead and the following slide to mark it as a
 *      failure rather than on colour.
 *
 *   D  WIDE CHILDREN CARRY A `lead`. Session 4 shipped ten slides where a
 *      lead-less slide with a full-width child reached into the instructor-video
 *      rectangle (x 913..1280, y 0..220). Every `Terminal`, `CodeBlock`,
 *      `DataTable`, `BoundaryBridge` and figure below sits under a lead.
 *
 *   E  SLIDE 35 IS TEXT, NOT A SCREENSHOT, and it says only what the TR says.
 *      The plan's §6.1 patch (a Tags tab, a size, a push time, the pull command
 *      Hub offers for copying) was never applied to the TR, so none of that is
 *      on the slide: the TR states that the repository is visible in the browser
 *      at that address, and the slide states exactly that.
 */


/* ────────────────────────────────────────────────────────────────────────────
   CONCEPT 2 · Image Naming and Tagging (21 to 28)

   Opens on the failure, per `slide-content-rules` §4: the push is attempted and
   refused before the naming rule is taught, so the rule answers something the
   room has already watched happen.
   ──────────────────────────────────────────────────────────────────────────── */

export const partC2C3: SlideDef[] = [
  {
    id: 'c2-divider',
    section: C2,
    label: 'Divider 2',
    element: (
      <SectionBreakerSlide
        index={2}
        title={C2}
        subtitle="Why the name has three parts"
        lesson={SESSION}
      />
    ),
    notes:
      'Hand over verbally: "the image should go to Docker Hub. Why can it not be pushed under the name it already has?" Then move straight to the attempt.',
  },

  {
    id: 'c2-push-denied',
    section: C2,
    label: 'Push denied',
    element: (
      <ContentSlide
        kicker={C2}
        title="Push Denied"
        lead="Try it with the name the image already has"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <Terminal
            path={AT_ROOT}
            caption="Three lines of output, and none of them is a success"
            lines={[
              { text: `docker push ${IMAGE}`, kind: 'cmd' },
              { text: 'Using default tag: latest', kind: 'out' },
              { text: `The push refers to repository [docker.io/library/${IMAGE}]`, kind: 'out' },
              { text: pushDenied(IMAGE), kind: 'out' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Run it and let the room read the refusal before you say anything. Ask what "library" is doing in a name nobody typed, and hold the pause.',
  },

  {
    id: 'c2-the-reason',
    section: C2,
    label: 'Read line two',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="Read Line Two"
        lead="Second line names a namespace nobody chose"
        points={[
          {
            text: (
              <>
                {'An image name with no username prefix is assumed to belong to '}
                <Code>library/</Code>
              </>
            ),
          },
          {
            text: (
              <>
                <Code>library/</Code>
                {' is Docker Hub\u2019s reserved namespace for official images: '}
                <Code>python</Code>
                {', '}
                <Code>node</Code>
                {', '}
                <Code>hello-world</Code>
              </>
            ),
          },
          { text: 'Nobody pushes there, so the refusal is about the name, not about the image' },
        ]}
        note={{
          kind: 'warning',
          title: 'Watch out',
          body: (
            <>
              {'This same error text also appears when the name is correct and nobody has logged in. Two causes, one wording, so read the name first and check the login second. The last concept of this session meets the login case on purpose.'}
            </>
          ),
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'Point at line two of the previous panel, then read it out. Say the warning out loud twice: the room will otherwise spend an evening debugging the wrong cause.',
  },

  {
    id: 'c2-name-anatomy',
    section: C2,
    label: 'Name anatomy',
    element: (
      <ContentSlide
        kicker={C2}
        title="Full Image Name"
        lead="Real name has three parts, and the first one is the part that was missing"
        lesson={SESSION}
      >
        <ImageNameAnatomy
          dockerId={DOCKER_ID}
          repository={IMAGE}
          tag="v1"
          note="Every image you push carries all three parts, in this order"
        />
      </ContentSlide>
    ),
    notes:
      'Walk the three blocks left to right and name what each one answers: whose, which app, which version. Land on the first one and connect it back to the refusal.',
  },

  {
    id: 'c2-name-rules',
    section: C2,
    label: 'The three parts',
    element: (
      <ContentSlide
        kicker={C2}
        title="Three Parts"
        lead="Same name as a reference table, which is the version worth photographing"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <DataTable
            columns={[
              { label: 'Part', weight: 0.8 },
              { label: 'Rule', weight: 1.2 },
              { label: 'If omitted', weight: 1.2 },
            ]}
            rows={[
              [
                'Docker ID',
                'Your Hub username',
                <>
                  {'Assumed '}
                  <Code>library/</Code>
                  {', which is officials only, so the push is denied'}
                </>,
              ],
              ['Repository', 'Lowercase, hyphens allowed', 'Required, there is no default'],
              [
                'Tag',
                <>
                  {'Any label: '}
                  <Code>v1</Code>
                  {', '}
                  <Code>v2</Code>
                  {', '}
                  <Code>latest</Code>
                </>,
                <>
                  {'Defaults to '}
                  <Code>latest</Code>
                </>,
              ],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Read down the third column only. That column is the one that explains the error they just saw, and it is the one they will need again next session.',
  },

  {
    id: 'c2-youve-read-it',
    section: C2,
    label: 'You already read it',
    element: (
      <ContentSlide
        kicker={C2}
        title="You Already Read It"
        lead={
          <>
            <Tech name="python" label="python:3.13-slim" />
            {' has been at the top of every Dockerfile you wrote, in this exact format'}
          </>
        }
        lesson={SESSION}
      >
        {/* Same figure as slide 24, different values: that is what makes the
            format feel already-known rather than newly taught. The id column
            stays, drawn absent, so the two slides hold one shape. */}
        <ImageNameAnatomy
          repository="python"
          tag="3.13-slim"
          labels={{ id: 'no Docker ID, because it is official' }}
          note="An official image lives in the reserved namespace, which is why its name is two parts and yours is three"
        />
      </ContentSlide>
    ),
    notes:
      'Ask the room to decode it before you reveal the captions. Then point at the empty first column and connect it to the previous slide.',
  },

  {
    id: 'c2-docker-tag',
    section: C2,
    label: 'docker tag',
    element: (
      <ContentSlide
        kicker={C2}
        title="docker tag"
        lead="No rebuild, because the image already exists. This adds a name to it"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <Terminal
            path={AT_ROOT}
            lines={[{ text: `docker tag ${IMAGE} ${REPO}:v1`, kind: 'cmd' }]}
          />
          {/* The TR draws two arrows under this command to label its halves.
              Arrows made of ASCII do not survive a proportional layout, so the
              two halves are labelled as a pair of cards instead. */}
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="rounded-card border border-line bg-surface-card px-4 py-3">
              <p className="font-mono text-body-sm font-bold text-ink">{IMAGE}</p>
              <p className="mt-1 font-heading text-body-sm font-semibold text-body">existing name</p>
            </div>
            <div className="rounded-card border border-line bg-surface-card px-4 py-3">
              <p className="font-mono text-body-sm font-bold text-ink">{`${REPO}:v1`}</p>
              <p className="mt-1 font-heading text-body-sm font-semibold text-body">
                additional new name
              </p>
            </div>
          </div>
        </div>
      </ContentSlide>
    ),
    notes:
      'Say "additional" and stress it. The next slide is the evidence, so do not explain what happened yet. Run the command and stop.',
  },

  {
    id: 'c2-one-image-two-names',
    section: C2,
    label: 'One image, two names',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="One Image, Two Names"
        lead="Two rows now, and the column that matters is the third one"
        note={{
          kind: 'success',
          title: 'Remember',
          body: (
            <>
              {'Both rows carry the same IMAGE ID, '}
              <Code>3f2a8b91c04d</Code>
              {', so there is still exactly one image on disk. '}
              <Code>docker tag</Code>
              {' added a name, not a copy, like two contacts saved for one phone number. Session 3 showed the same two names on one id.'}
            </>
          ),
        }}
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <Terminal
            path={AT_ROOT}
            lines={[
              { text: 'docker images', kind: 'cmd' },
              { text: 'REPOSITORY                   TAG      IMAGE ID       CREATED       SIZE', kind: 'out' },
              { text: `${IMAGE}            latest   3f2a8b91c04d   2 hours ago   156MB`, kind: 'out' },
              { text: `${REPO}    v1       3f2a8b91c04d   2 hours ago   156MB`, kind: 'out' },
            ]}
            fontSize={14}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Put a finger on each IMAGE ID in turn and read the twelve characters out. The identical id is the evidence, so make the room see it before you read the note.',
  },

  /* ──────────────────────────────────────────────────────────────────────────
     CONCEPT 3 · Login, Push, Pull (29 to 38)

     The name is right, so now the three commands that move the image, then the
     two teaching points buried in the push output, one per slide.
     ────────────────────────────────────────────────────────────────────────── */

  {
    id: 'c3-divider',
    section: C3,
    label: 'Divider 3',
    element: (
      <SectionBreakerSlide
        index={3}
        title={C3}
        subtitle="Three commands, and the image leaves the laptop"
        lesson={SESSION}
      />
    ),
    notes:
      'Hand over: "the name is right. What are the commands that actually move it?" Three, and the first one runs once per machine.',
  },

  {
    id: 'c3-login',
    section: C3,
    label: 'docker login',
    element: (
      <ContentSlide
        kicker={C3}
        title="docker login"
        lead="Once per machine, not once per push"
        points={[
          {
            text: (
              <>
                {'Password is invisible while typing, the same behaviour as '}
                <Code>createsuperuser</Code>
                {' in session 4'}
              </>
            ),
          },
          { text: 'Nothing is echoed, so the prompt looks frozen when it is working' },
        ]}
        lesson={SESSION}
      >
        <Terminal
          path={AT_ROOT}
          fontSize={14}
          lines={[
            { text: 'docker login', kind: 'cmd' },
            { text: `Username: ${DOCKER_ID}`, kind: 'out' },
            { text: 'Password:', kind: 'out' },
            { text: 'Login Succeeded', kind: 'ok' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Warn about the invisible password before you type it, or half the room will assume the terminal has hung. Wait for the green line before moving on.',
  },

  {
    id: 'c3-access-token',
    section: C3,
    label: 'Use a token',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="Use a Token"
        lead="If the account password is rejected, Docker Hub is asking for a token instead"
        points={[
          {
            text: (
              <>
                {'Create one under Account Settings, then Security, on '}
                <Code>hub.docker.com</Code>
              </>
            ),
          },
          {
            text: (
              <>
                {'Paste it at the '}
                <Code>Password:</Code>
                {' prompt, and nothing else about the login changes'}
              </>
            ),
          },
        ]}
        note={{
          kind: 'note',
          title: 'Note',
          body: 'An access token is a credential used in place of your account password, and it can be revoked on its own without changing the password. It exists here because Docker Hub increasingly requires one, and it matters beyond today: a token is what the automation server later in this course will be given, because a machine never gets your real password.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'This is the most likely thing to fail live in the room, so say it before anyone tries. Ask who has two-factor turned on: those learners need the token, not the password.',
  },

  {
    id: 'c3-push',
    section: C3,
    label: 'docker push',
    element: (
      <ContentSlide
        kicker={C3}
        title="docker push"
        lead="One command, and an output worth reading whole"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <Terminal
            path={AT_ROOT}
            fontSize={14}
            lines={[
              { text: `docker push ${REPO}:v1`, kind: 'cmd' },
              { text: `The push refers to repository [docker.io/${REPO}]`, kind: 'out' },
              { text: '5f70bf18a086: Pushed', kind: 'out' },
              { text: 'a3ed95caeb02: Pushed', kind: 'out' },
              { text: '92a4b8a3e10c: Pushed', kind: 'out' },
              { text: 'b7f7d2967507: Mounted from library/python', kind: 'out' },
              { text: 'v1: digest: sha256:9b7e3a... size: 1573', kind: 'ok' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Leave this panel up. The next two slides each read one thing out of it, so do not explain either of them here.',
  },

  {
    id: 'c3-layers-travel',
    section: C3,
    label: 'Layers, not a blob',
    element: (
      <ContentSlide
        kicker={C3}
        title="Layers, Not a Blob"
        lead="Read the panel again and count the lines between the first and the last"
        points={[
          {
            text: (
              <>
                <Code>Pushed</Code>
                {' appears once per layer, not once for the image'}
              </>
            ),
          },
          { text: 'Those are the layers from session 2, each with its own id' },
          { text: 'Nothing here is one file being copied to a server' },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'Point back at the four middle lines of the previous panel and count them out loud. Ask what a single-file upload would have printed instead.',
  },

  {
    id: 'c3-mounted-from',
    section: C3,
    label: 'Mounted from',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="Mounted From"
        lead={
          <>
            {'One line in that output does not say '}
            <Code>Pushed</Code>
          </>
        }
        points={[
          {
            text: (
              <>
                <Code>Mounted from library/python</Code>
                {': Docker Hub already holds the '}
                <Code>python:3.13-slim</Code>
                {' base layers'}
              </>
            ),
          },
          { text: 'They are not uploaded again, so only your own layers travel' },
        ]}
        note={{
          kind: 'success',
          title: 'Remember',
          body: 'Layer system pays off a second time here. In session 2 it was the build cache, which stopped a rebuild from redoing work. On a push it is the same idea against the network: a layer the registry already has is claimed, not sent.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'Ask why one line differs before you read it. The answer is a session 2 idea, so let someone in the room say "cache" out loud.',
  },

  {
    id: 'c3-on-the-hub',
    section: C3,
    label: 'On Docker Hub',
    element: (
      <ContentSlide
        kicker={C3}
        title="On Docker Hub"
        lead="Middle box of the target picture, now real and visible in a browser"
        lesson={SESSION}
      >
        {/*
          TEXT, NOT A SCREENSHOT, and deliberately thin. A capture needs a real
          Hub account and a real push on the capture machine, which this deck
          cannot do. The TR says only that the repository is visible in the
          browser at this address, so the slide says only that: the tag listing
          and pull button the plan's §6.1 asked for are not in the TR and are
          not invented here.
        */}
        <div className="mx-auto w-full max-w-[760px]">
          <CodeBlock
            code={`hub.docker.com/r/${REPO}`}
            language="url"
            showLineNumbers={false}
            fontSize={20}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Open the address live if the room has a pushed image, and say out loud that the repository is public. Otherwise read it and move on, because the next slide is the one that matters.',
  },

  {
    id: 'c3-pull',
    section: C3,
    label: 'docker pull',
    element: (
      <ContentSlide
        kicker={C3}
        title="docker pull"
        lead="On a machine that has never seen your code, your virtual environment or your requirements file"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <Terminal
            path={ON_ANOTHER_MACHINE}
            caption="Any other machine with Docker installed"
            fontSize={14}
            lines={[
              { text: `docker pull ${REPO}:v1`, kind: 'cmd' },
              { text: `v1: Pulling from ${REPO}`, kind: 'out' },
              { text: 'c9c5fd25a1bd: Pull complete', kind: 'out' },
              { text: '...', kind: 'out' },
              { text: `Status: Downloaded newer image for ${REPO}:v1`, kind: 'ok' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Say the prompt path out loud: this is not the project folder, because there is no project on this machine. That is the whole point of the slide.',
  },

  {
    id: 'c3-run-anywhere',
    section: C3,
    label: 'Then run it',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="Then Run It"
        lead="Same machine, one command later"
        note={{
          kind: 'success',
          title: 'Remember',
          body: 'No Python was installed on that machine, no virtual environment was created, and no requirements file was fetched. The complete environment travelled inside the image, which is the promise from session 1 finally cashed across two machines.',
        }}
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <Terminal
            path={ON_ANOTHER_MACHINE}
            lines={[{ text: `docker run ${REPO}:v1`, kind: 'cmd' }]}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Pause here. This is the moment the session pays for itself, so let the one command sit on screen before you read the note.',
  },

  {
    id: 'c3-the-cycle',
    section: C3,
    label: 'The whole cycle',
    element: (
      <ContentSlide
        kicker={C3}
        title="Whole Cycle"
        lead="Two steps run on the machine you build on, two on every machine that serves it"
        lesson={SESSION}
      >
        {/*
          The same figure as slide 20, carrying four commands instead of two.
          `build` and `run` never cross a boundary, so this geometry draws them
          INSIDE a machine as short vertical legs, and `push` and `pull` are the
          only spans on the bridge. That is the slide's claim made by the layout
          rather than by the caption: two steps stay home, two leave.
        */}
        <BoundaryBridge
          stations={[
            { label: 'Your code', caption: 'plus a Dockerfile', icon: 'code', kind: 'source' },
            { label: 'Image', caption: 'built once', logo: 'docker', kind: 'source' },
            { label: 'Docker Hub', caption: REPO, logo: 'docker', kind: 'hub', tone: 'accent' },
            { label: 'Image', caption: 'pulled down', logo: 'docker', kind: 'target', tone: 'teal' },
            { label: 'Container', caption: 'serving traffic', icon: 'server', kind: 'target', tone: 'teal' },
          ]}
          legs={[
            { label: 'docker build', issuedBy: 'left' },
            { label: 'docker push', sub: 'once per release', issuedBy: 'left' },
            { label: 'docker pull', sub: 'on every machine', issuedBy: 'right' },
            { label: 'docker run', issuedBy: 'left' },
          ]}
          caption="build and run stay on one computer, push and pull are the two steps that leave it"
        />
      </ContentSlide>
    ),
    notes:
      'Four commands, two computers. Point at the two blue legs inside the boundaries and say those never leave the machine they run on, then at the two spans and say those are the only steps that cross. Ask which two they would run on a brand new server, and let them read the right box. Then ask what happens when the next build reuses the same tag.',
  },
]
