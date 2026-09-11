import type { SlideDef } from '@/deck/types'
import { ContentNoteSlide, ContentSlide, SectionBreakerSlide } from '@/slides'
import { BoundaryBridge, CodeBlock, DataTable, LayerStack, SyntaxBreakdown, Terminal } from '@/ui'
/* Promoted from `slide-kit/annotated-output-lab`. Imported by path like the
   other promoted lab families rather than through the `@/ui` barrel. */
import { CountBadge } from '@/ui/CountBadge'
import { BracedRun } from '@/ui/BracedRun'
/* Session-owned figure, imported from its own file rather than through `@/ui`.
   `src/ui/index.ts` is kit-owned, so `sync-kit.mjs` overwrites it and the
   re-export line that used to live at its tail vanished on sync — this file
   stopped compiling with "Module '@/ui' has no exported member 'ImageNameAnatomy'".
   Importing the file directly keeps it out of the kit's way permanently. */
import { ImageNameAnatomy } from '@/ui/ImageNameAnatomy'
import {
  AT_ROOT,
  C2,
  C3,
  Code,
  DOCKER_ID,
  FE_IMAGE,
  FE_REPO,
  IMAGE,
  ON_ANOTHER_MACHINE,
  REPO,
  S2,
  S3,
  S4,
  SESSION,
  Tech,
  pushDenied,
} from './deckShared'

/**
 * Deployment · Session 6 "Pushing Image to Docker Hub" — slides 18 to 36.
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
 *      error for two different reasons, which is the whole point of
 *      `c2-the-reason`'s warning and of `c3-push-denied-again`. One string, so
 *      the two panels cannot drift.
 *
 *   C  `Terminal` HAS NO `err` KIND in this kit: its `TerminalLine.kind` is
 *      `cmd | out | ok`. The refusal on `c2-push-denied` is therefore an `out` line, and
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
        subtitle="Why the name has three parts, and how to add one"
        lesson={SESSION}
      />
    ),
    notes:
      'Hand over verbally: "the image should go to Docker Hub. Why can it not be pushed under the name it already has?" Log in first, then move straight to the attempt.',
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
    /*
      THE REFUSAL IS ON THIS FRAME, WITH LINE TWO ENCLOSED.

      This shipped as three bullets and a warning with NO OUTPUT ON THE SLIDE,
      under the lead "Line two names an owner you never chose" and speaker notes
      reading "point at line two of the previous panel". That is the same defect
      `c3-layers-travel` was rebuilt for earlier today: a slide telling the room
      to read a line that is not on it, with the instructor paging backwards to
      supply the evidence.

      `BracedRun`, not `CountBadge`: this argues about ONE line, and `CountBadge`
      derives a count from the run's members, so a single-line run would render
      a pill reading "1". `BracedRun` is the member of that family that names a
      run without counting it.

      NO `points`, for the reason recorded on `c3-layers-travel`: passing points
      alongside a child puts `ContentSlide` into its 463px two-column mode, and
      the refusal line is 67 characters — it wrapped mid-token there. The
      bullets' substance moves into the box label and the caption instead, which
      is what those affordances are for.
    */
    id: 'c2-the-reason',
    section: C2,
    label: 'Read line two',
    element: (
      <ContentNoteSlide
        kicker={C2}
        title="Read Line Two"
        /* SIMPLIFIED ON REVIEW: THE TAKEAWAY IS "USE YOUR DOCKER ID".

           This slide used to carry the two-causes warning as well, which is
           `c3-push-denied-again`'s whole job and is stated there in full. Here
           the room needs one thing: a name with no Docker ID resolves to
           Docker's own namespace, so include yours.

           The caption answers the question the enclosed line raises. You cannot
           push to `library/` at all — it holds Docker's Official Images and no
           ordinary account has rights to it — and the refusal text is vague
           about that ("repository does not exist OR may require
           authorization"), which is why the line is worth enclosing. */
        lead="A name with no Docker ID is not yours to push"
        note={{
          kind: 'success',
          title: 'Remember',
          body: 'Push with your own Docker ID in the name, and this refusal goes away.',
        }}
        lesson={SESSION}
      >
        <BracedRun
          path={AT_ROOT}
          caption={`library/ is Docker's own namespace, and no ordinary account can push there`}
          nodes={[
            { text: `docker push ${IMAGE}`, kind: 'cmd' },
            { text: 'Using default tag: latest', kind: 'out' },
            {
              label: 'An owner you never typed',
              lines: [{ text: `The push refers to repository [docker.io/library/${IMAGE}]` }],
            },
            { text: pushDenied(IMAGE), kind: 'out' },
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Read the enclosed line out loud and let the room find the word library. Nobody typed it, which is the whole point: Docker filled in an owner because the name had none.',
  },

  {
    id: 'c2-name-anatomy',
    section: C2,
    label: 'Name anatomy',
    element: (
      <ContentSlide
        kicker={C2}
        title="Full Image Name"
        lead="A full image name has three parts, and the first one was missing"
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
        lead="Same name as a reference table, worth a photo before you continue"
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
            <Tech name="python" label="python:3.14-slim" />
            {' has been at the top of every Dockerfile you wrote, in this exact format'}
          </>
        }
        lesson={SESSION}
      >
        {/* Same figure as `c2-name-anatomy`, different values: that is what makes the
            format feel already-known rather than newly taught. The id column
            stays, drawn absent, so the two slides hold one shape. */}
        <ImageNameAnatomy
          repository="python"
          tag="3.14-slim"
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
        {/* 1120px, NOT 980. THE SPECIMEN HAS TO BE ONE LINE.

            The three chips measure about 960px together — `docker tag`, the
            existing name, and the full `ravi123/nxttrendz-backend:v1` — and at
            980px the panel's inner width was 896, so the new name wrapped onto a
            second line. A command a learner retypes must read as one line: the
            wrap invents a line break that is not in the command.

            1120 sits inside the 1152px well with 16px either side, and the
            panel starts well below the instructor-video reserve. */}
        <div className="mx-auto w-full max-w-[1120px]">
          {/*
            `SyntaxBreakdown`, NOT A TERMINAL PLUS TWO HAND-ROLLED CARDS.

            The TR draws two ASCII arrows under this command to label its halves,
            and ASCII arrows do not survive a proportional layout. The first pass
            answered that with a `Terminal` and two `div`s carrying a border and
            a flat `bg-surface-card` fill: markup written into the deck, three
            parts of the STYLE_GUIDE section 9 recipe missing, and no cue joining
            a card to the token it labels.

            The kit already has the component for exactly this job. Session 4
            uses it on `docker compose exec`, it numbers each token and its
            caption card so the pairing survives a projector and greyscale, and
            `placeholder` says which token the learner substitutes — which is the
            first question this command raises, because the Docker ID is theirs
            and the rest is typed as shown.
          */}
          <SyntaxBreakdown
            /* `!max-w-` BECAUSE THE COMPONENT CAPS ITSELF AT 900px.

               `SyntaxBreakdown`'s root is `mx-auto w-full max-w-[900px]` and its
               specimen row is `flex flex-wrap`, so the three chips here — the
               command, the existing name, and the full
               `ravi123/nxttrendz-backend:v1` — total about 960px and the last
               one wrapped to a second line. A command a learner retypes has to
               read as one line; the wrap invents a break the command does not
               have.

               Widening the parent does nothing, because the cap is on the
               component itself. `className` is appended to its root, but two
               arbitrary `max-w-` utilities have equal specificity and the
               winner would depend on stylesheet order, so the important prefix
               makes it deterministic. The proper fix is a width prop on the
               component, which is a kit change. */
            className="!max-w-[1120px]"
            mode="command"
            parts={[
              {
                token: 'docker tag',
                label: 'Command',
                body: 'Adds a second name to an image that already exists, with no rebuild',
              },
              {
                token: IMAGE,
                label: 'Existing name',
                body: 'Image as it is named on this machine, from the build',
              },
              {
                token: `${REPO}:v1`,
                label: 'Additional new name',
                body: 'Docker ID, repository and tag, which is the only form Docker Hub accepts',
                fill: 'placeholder',
              },
            ]}
          />
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
              {'Same IMAGE ID on both rows: one image with two names, like two contacts saved for one phone number.'}
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
      `Read the IMAGE ID column out loud on both rows before you say anything else. ${S3} showed the same two names on one id, so name it and move on.`
  },

  /* ──────────────────────────────────────────────────────────────────────────
     CONCEPT 3 · Login, Push, Pull (29 to 38)

     The name is right, so now the two commands that move the image, then the
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
        subtitle="Two commands, and the image leaves the laptop"
        lesson={SESSION}
      />
    ),
    notes:
      'Hand over: "the name is right. What are the commands that actually move it?" Two, and you are already logged in.',
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
    /*
      THE PANEL THE LEAD TELLS THE ROOM TO READ.

      This shipped as three bullets on an empty frame under the lead "Read the
      panel again and count the lines between the first and the last" — and
      there was no panel on the slide. The room was told to read something that
      was not on screen, and to count lines it could not see. The nearest panel
      was two slides back.

      It could not be fixed by adding a `Terminal`, because `Terminal` has only
      four line COLOURS and no way to mark, number or bracket a line, so
      "between the first and the last" was unrenderable. `slide-kit/
      annotated-output-lab` built the missing capability and `CountBadge` won:
      the box says WHICH lines to count and the pill says what the count comes
      to, both inside the panel.

      The count is derived from the run's members and can never be passed in, so
      it cannot go stale if a line of real output is ever added. Three is true
      only because `Mounted from` is OUTSIDE the box — a box around all four
      under a pill reading three would be a figure arguing with itself.

      NO `exceptionNote` HERE, DELIBERATELY. The lab's fixture labels that line
      "Not uploaded, already on Hub", and `TwoEnclosures` draws it. Both are
      right for a recap and wrong here: `c3-mounted-from` is the NEXT slide and
      the whole of it is that one line. Explaining it here opens the next
      slide's problem early. `role: 'exception'` still keeps it out of the
      count, so the figure stays honest without saying why yet — and the gap it
      leaves is closed on the very next frame, which is what makes this
      candidate's known weakness harmless in this position.
    */
    id: 'c3-layers-travel',
    section: C3,
    label: 'Layers, not one file',
    element: (
      <ContentSlide
        kicker={C3}
        title="Layers, Not One File"
        /* NO `points`, AND THAT IS FORCED BY THE PANEL'S WIDTH.

           Passing `points` alongside a child puts `ContentSlide` into its
           `grid-cols-[1.4fr_1fr]` mode, which gives the figure 463px. At that
           width `Terminal` breaks the image name MID-TOKEN — it rendered
           `ravi123/nxttrendz-` then `backend:v1` — and a learner retyping a
           broken image name is a worse outcome than a slide with fewer bullets.
           `slide-kit/figure-side-lab` records the same failure for its
           `SplitWell` candidate at 546px.

           So the two claims move: the one the title asserts goes into the lead,
           and the layer attribution goes into the figure's own `caption`, which
           is the affordance `CountBadge` already has for exactly this. */
        lead="Each Pushed line is one layer, not one file for the whole image"
        lesson={SESSION}
      >
        <CountBadge
          caption={`Those are the layers from ${S2}, each with its own id`}
          path={AT_ROOT}
          nodes={[
            { text: `docker push ${REPO}:v1`, kind: 'cmd' },
            { text: `The push refers to repository [docker.io/${REPO}]`, kind: 'out' },
            {
              label: 'Pushed, once per layer',
              unit: 'layers',
              lines: [
                { text: '5f70bf18a086: Pushed' },
                { text: 'a3ed95caeb02: Pushed' },
                { text: '92a4b8a3e10c: Pushed' },
                { text: 'b7f7d2967507: Mounted from library/python', role: 'exception' },
              ],
            },
            { text: 'v1: digest: sha256:9b7e3a... size: 1573', kind: 'ok' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Ask the room for the number before the pill is on screen if you can, then let it confirm. Do not explain the fourth line yet: the next slide is entirely about it, and a learner who asks early is the perfect hand-over.',
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
        /* NO `points`. THE FIGURE IS SLIDE 12'S STACK WITH ONE LAYER RECOLOURED.

           Both bullets described a picture the slide did not draw: "Docker Hub
           already holds the base layers" and "only your own layers travel" are
           statements ABOUT the stack the room met on `c1-inside-the-image`.
           Drawing that same stack again, with the `FROM` layer switched from
           `ships` to `shared` and everything else byte-identical, states both
           of them without prose — and satisfies PEDAGOGY section 3's test
           literally: a learner pausing here can say what changed since they
           last saw this figure in one sentence, because exactly one thing did.

           The labels and the `note` annotations are deliberately UNCHANGED from
           slide 12. If a word moved as well as the colour, the comparison would
           be doing two things and the room would have to work out which of them
           carried the point.

           `shared` is the kit's own state for this and its teal is not used for
           anything else in this deck. Dropping the bullets also keeps the panel
           out of `ContentSlide`'s 463px two-column mode. */
        note={{
          kind: 'success',
          title: 'Remember',
          body: `Same idea as the build cache in ${S2}, working against the network instead of your disk.`,
        }}
        lesson={SESSION}
      >
        {/* Same four layers, same order, same annotations as `c1-inside-the-image`.
            Only the base layer's state differs, which is the whole argument. */}
        <div className="flex justify-center">
          <LayerStack
            title="backend image"
            width={820}
            caption="Only the three blue layers travelled"
            /* FOUR ROWS HERE, FIVE ON `c1-inside-the-image`, AND THE DIFFERENCE IS REAL.

               That slide reads the Dockerfile as five INSTRUCTIONS. This slide
               reads the push OUTPUT, which lists four layers: three `Pushed`
               and one `Mounted from`. They differ because `WORKDIR` and `CMD`
               write metadata rather than file content, so they do not appear as
               separate uploaded layers.

               This slide has to match the output, because the output is the
               evidence it is arguing from. Making it five to match slide 12
               would put a fifth row on screen that has no line in the panel the
               room just read, and the caption's count would stop being true. */
            layers={[
              { label: 'Your Django project code', note: 'COPY . .', state: 'ships' },
              {
                label: 'Django, DRF, and every package from requirements.txt',
                note: 'RUN pip install',
                state: 'ships',
              },
              { label: 'Working directory and start command', note: 'WORKDIR, CMD', state: 'ships' },
              {
                label: <Tech name="python" label="Python 3.14 and the Debian base files" />,
                note: 'FROM',
                state: 'shared',
              },
            ]}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Ask why one line differs before you read it. The answer is a Docker File Creation idea, so let someone in the room say "cache" out loud. Then spell the transfer out: the build cache stopped a rebuild redoing work on your disk, and this stops a push resending a layer the registry already holds.',
  },
  {
    /*
      `GateFlow` WAS TRIED HERE AND REVERTED, AND THE REASON IS THE COMPONENT.

      The content is a decision tree, so a gate figure is the right instinct and
      the registry's test is met: the CHECK is the point of the slide. Built with
      five spine slots it filled the width correctly. But `GateFlow` draws an
      arrowhead leaving the exception card even when that branch is an `end`, so
      a stray marker pointed into empty slide beside "It is the naming problem".
      Session 7's build notes record the same class of defect in this figure
      ("PASS and FAIL exits move clear of their cards, positional not
      editorial"), and all three copies of the file in this repo are identical,
      so it is a live bug rather than a stale component.

      Reverted rather than shipped with the artefact. The fix belongs in
      `GateFlow`: an exception node of kind `end` should terminate without an
      exit marker. Until then this slide states the branch in words.
    */
    id: 'c3-push-denied-again',
    section: C3,
    label: 'Denied again',
    element: (
      <ContentSlide
        kicker={C3}
        title="Denied Again"
        lead="On a fresh machine, or after credentials expire, the same refusal comes back for a different reason"
        points={[
          {
            text: 'If the name is not prefixed with your Docker ID, it is the naming problem from earlier',
            icon: 'warning',
          },
          {
            text: 'If the name is correctly prefixed and this still appears, it is authentication',
            icon: 'key',
          },
          { text: <>{'Fix: '}<Code>docker login</Code>{', then retry'}</>, icon: 'check' },
        ]}
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <Terminal
            path={ON_ANOTHER_MACHINE}
            fontSize={12}
            lines={[
              { text: `docker push ${REPO}:v1`, kind: 'cmd' },
              { text: pushDenied(REPO), kind: 'out' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Read the first two points as a pair of tests in order: the name costs nothing to check, so it is checked first. Authentication is the answer only once the name is right.',
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

  /*
    MOVED OUT OF CONCEPT 1, ON REVIEW.

    This drew `docker push` and `docker pull` as its two edge labels while
    sitting at slide 19 — ten and fifteen slides before either command was
    taught. Content rule 24 does not allow a figure label to name a command the
    room has not met, and the review caught it.

    It now follows `c3-pull`, which is the first moment both commands exist, and
    its hub caption carries `:v1` because `c2-docker-tag` introduced the tag
    form at slide 26. Neither was true where it used to sit.

    STILL TO SETTLE: `c3-the-cycle`, three slides later, is the same
    `BoundaryBridge` with five stations and four commands. Two drawings of one
    journey now sit close together, and the honest resolution is probably to
    merge them rather than show the map twice.
  */
  {
    /*
      ONE MAP, NOT TWO, AND IT SITS AFTER BOTH COMMANDS ARE TAUGHT.

      There used to be two drawings of the same journey. `c1-target-picture` sat
      at slide 19 as a preview with two commands, and `c3-the-cycle` repeated the
      figure later with four. The preview also broke content rule 24: it labelled
      its edges `docker push` and `docker pull` ten and fifteen slides before
      either was taught, and it could not carry a tag at all because
      `c2-docker-tag` had not happened yet.

      Merged on review into this single slide, positioned straight after
      `c3-pull`, which is the first moment both commands exist. It keeps the
      richer five-station geometry rather than the preview's three, because that
      is what carries the claim: `build` and `run` never cross a boundary, so
      they are drawn as short legs INSIDE a machine, and `push` and `pull` are
      the only spans on the bridge. The layout makes the argument, not the
      caption.

      The hub now carries `:v1`, which is honest here and was not at slide 19.
    */
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
        <BoundaryBridge
          stations={[
            { label: 'Your code', caption: 'plus a Dockerfile', icon: 'code', kind: 'source' },
            { label: 'Image', caption: 'built once', logo: 'docker', kind: 'source' },
            { label: 'Docker Hub', caption: `${REPO}:v1`, logo: 'docker', kind: 'hub', tone: 'accent' },
            { label: 'Image', caption: 'pulled down', logo: 'docker', kind: 'target', tone: 'teal' },
            { label: 'Container', caption: 'serving traffic', icon: 'server', kind: 'target', tone: 'teal' },
          ]}
          legs={[
            { label: 'docker build', issuedBy: 'left' },
            { label: 'docker push', sub: 'once per release', issuedBy: 'left' },
            { label: 'docker pull', sub: 'on every machine', issuedBy: 'right' },
            { label: 'docker run', issuedBy: 'left' },
          ]}
          hubBadge="Online"
          caption="build and run stay on one computer, push and pull are the two steps that leave it"
        />
      </ContentSlide>
    ),
    notes:
      'This picture is the map for the rest of the session and the two after it. Point at the middle box and say the automation server will push there, and the deployment server will pull from there.',
  },
  {
    id: 'c3-run-anywhere',
    section: C3,
    label: 'Then run it',
    element: (
      <ContentNoteSlide
        kicker={C3}
        /* THE PAYOFF MOVED TO THE LEAD AND THE CALLOUT TELLS THE TRUTH.

           This slide used to end on a success note reading "nothing was
           installed on that machine, so the promise is kept". The first half is
           true and is the point of the session. The second half over-claims: a
           bare `docker run` starts the container, and Django then needs its
           `SECRET_KEY` and a database to serve anything. Neither is in the
           image, deliberately, which `c1-not-inside` has already established.

           So the slide was promising a running application it cannot deliver,
           three slides after telling the room the image carries no `.env` and no
           database. A learner who noticed both would be right to ask which one
           was wrong.

           The payoff keeps its place in the lead. The callout names the gap, and
           `c3-what-the-machine-supplies` on the next frame closes it. */
        title="Then Run It"
        lead="Nothing was installed on that machine, and the container starts"
        note={{
          kind: 'warning',
          title: 'Not a running app yet',
          body: 'Django still needs its SECRET_KEY and a database, and neither is in the image.',
        }}
        lesson={SESSION}
      >
        {/*
          THE REAL FAILURE, QUOTED FROM A CAPTURE THE REVIEWER RAN.

          This was one `cmd` line and nothing else, under a callout ASSERTING
          that the container still needs a database. The transcript proves it
          instead, and proves both halves of the slide at once: Django boots,
          `StatReloader` starts, system checks pass with no issues — the image
          really did carry a working environment — and THEN it dies on the one
          thing the image deliberately does not carry.

          `django.db.utils.OperationalError` is the payoff of `c1-not-inside`
          arriving as a consequence rather than as a warning.

          THE TRACEBACK IS ELIDED TO ONE LINE. The capture runs eleven frames
          through `django/db/backends/base/base.py` and `sqlite3/base.py`, none
          of which a learner can act on. Content rule 11 crops a capture to its
          point; the point is the last line.

          `Exception in thread django-main-thread:` and the `...` elision row
          went for height, not for accuracy: at eight lines the panel plus its
          caption plus the callout overflowed the well and the callout rendered
          under the deck's own control bar. `Traceback (most recent call last):`
          on its own is enough to say a traceback followed.

          `err` KIND ON THAT LAST LINE, not `out`. The real console prints it
          red, and the kind exists because rendering an error in the same grey
          as ordinary output loses the one cue a learner scans for.

          THE DOCKER ID IS THE DECK'S, NOT THE CAPTURE'S. The capture was run
          under `priyaankit`; this deck writes one Docker ID everywhere and
          `c1-the-account` tells the room to substitute their own. Quoting the
          capture's ID here would put a second stranger's username on screen.
        */}
        <div className="mx-auto w-full max-w-[980px]">
          <Terminal
            path={ON_ANOTHER_MACHINE}
            fontSize={13}
            lines={[
              { text: `docker run ${REPO}:v1`, kind: 'cmd' },
              { text: 'Watching for file changes with StatReloader', kind: 'out' },
              { text: 'Performing system checks...', kind: 'out' },
              { text: 'System check identified no issues (0 silenced).', kind: 'ok' },
              { text: 'Traceback (most recent call last):', kind: 'out' },
              { text: 'django.db.utils.OperationalError: unable to open database file', kind: 'err' },
            ]}
            caption="The environment travelled. The database did not"
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Pause here. This is the moment the session pays for itself, so let the one command sit on screen before you read the note.',
  },
  {
    /*
      THE SLIDE THAT CLOSES THE GAP `c1-not-inside` OPENED.

      Asked for on review. `c1-not-inside` says the image carries no `.env`, no
      `SECRET_KEY` and no database, and frames that omission as what makes a
      public push SAFE. True, and it leaves a question the deck never answered:
      then how does it run anywhere? Concept 3 then spends nine slides moving the
      image between machines without saying what the receiving machine has to
      provide.

      A `DataTable` with two columns, not `SwapRows`. The registry is explicit
      that `SwapRows` recesses one side and raises the other to assert that one
      thing STANDS IN FOR another. These two are not substitutes: the image and
      the machine each supply a different half, and both halves are needed. A
      table states that without asserting a direction (content rule 8).

      `volume` is named with the session that taught it, per content rule 24
      part 3: it is a term from `Running the Real App with Docker` and a learner
      meeting it here needs to know where they met it.
    */
    id: 'c3-what-the-machine-supplies',
    section: C3,
    label: 'What the machine supplies',
    element: (
      <ContentNoteSlide
        kicker={C3}
        title="What the Image Leaves to the Machine"
        lead="The image carries what is the same everywhere, so the machine supplies what differs"
        note={{
          kind: 'info',
          title: 'Remember',
          body: 'An image that carried your secrets could only ever run in one place, and never in public.',
        }}
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[1060px]">
          <DataTable
            compact
            columns={[
              { label: 'Not in the image', weight: 1 },
              { label: 'Why it cannot be', weight: 1.3 },
              { label: 'Where it comes from', weight: 1.3 },
            ]}
            rows={[
              [
                <Code>SECRET_KEY</Code>,
                'A secret in a public image is a published secret',
                'Passed in when the container starts',
              ],
              [
                'The database',
                'Every machine holds different data',
                `A volume on that machine, as ${S4} set up`,
              ],
              [
                <Code>VITE_API_BASE_URL</Code>,
                "The backend's address differs per machine",
                'Set per environment, at run time',
              ],
            ]}
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Read the middle column first. Each of the three is missing for a reason, and the reason is always that it differs between machines or must never be published. Then say the same image runs in every environment BECAUSE it carries none of them.',
  },

  {
    /*
      THE SECOND IMAGE, APPLIED RATHER THAN EXPLAINED.

      Nothing on this slide is new: `docker tag` came from concept 2 and
      `docker push` from the head of this one. That is the point of its
      position. The room has just watched one image make the whole round trip,
      so the second one is a use of the pattern, not a second lesson, and it
      costs one slide instead of doubling every command in the session.

      It has to exist, though. The app is two services, and a learner who
      pushes only the backend has published half an application: the target
      picture promises any machine runs this, and one repository cannot keep
      that promise.

      `Mounted from library/node` is the deliberate echo. `c3-mounted-from`
      taught that line for `library/python` four slides ago, so seeing it again
      with a different base is the concept confirming itself.
    */
    id: 'c3-frontend-too',
    section: C3,
    label: 'Frontend too',
    element: (
      /* `ContentNoteSlide`, and NO `points`.

         The first version passed `points` AND a child, which makes
         `ContentSlide` split into two columns: the terminal got half the width
         and every command wrapped mid-token, which `align-check` caught. A
         full-width panel is the only way these two names fit on one line each,
         so the reason the slide exists moves into the callout instead. */
      <ContentNoteSlide
        kicker={C3}
        title="Frontend Too"
        lead="Same two commands, a different image name"
        note={{
          kind: 'success',
          title: 'Remember',
          body: 'The app is two services, so Hub needs two repositories. Both are there now.',
        }}
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <Terminal
            path={AT_ROOT}
            fontSize={13}
            lines={[
              { text: `docker tag ${FE_IMAGE} ${FE_REPO}:v1`, kind: 'cmd' },
              { text: `docker push ${FE_REPO}:v1`, kind: 'cmd' },
              { text: `The push refers to repository [docker.io/${FE_REPO}]`, kind: 'out' },
              { text: 'c1a2b3d4e5f6: Pushed', kind: 'out' },
              { text: '7a8b9c0d1e2f: Pushed', kind: 'out' },
              { text: '3f4e5d6c7b8a: Mounted from library/node', kind: 'out' },
              { text: 'v1: digest: sha256:4c1f8b... size: 1786', kind: 'ok' },
            ]}
            caption="Both repositories now hold a v1"
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'Say out loud that you are typing nothing new. Point at the Mounted from line and remind them where they met it, then say both images are now on Hub and the app can travel.',
  },
  {
    /*
      THE THREE COMMANDS SIDE BY SIDE, AND WHY IT IS A `DataTable`.

      Asked for on review as "docker Tag vs Push vs pull". Two decisions in
      that:

      `DataTable` and NOT `SwapRows`. The registry is explicit: `SwapRows`
      recesses one side and raises the other, which asserts that one thing
      STANDS IN FOR another. These three are peers doing different jobs, so
      that inversion would misrepresent them (content rule 8), and the
      registry's own guidance for peers is a table with identical row labels.
      The row labels here are identical across all three columns, which is what
      makes the comparison readable down a column as well as across a row.

      The title says "Tag, Push, Pull" rather than "vs". Content rule 26 bans
      `vs.` in rendered copy, and three commas would be worse than the comma
      list.

      It sits at the END of concept 3 because that is the first slide where all
      three commands have been taught: `docker tag` in concept 2, `push` and
      `pull` here. Placed any earlier it would name a command the room had not
      met (content rule 24).
    */
    id: 'c3-three-commands',
    section: C3,
    label: 'Tag, push, pull',
    element: (
      <ContentSlide
        kicker={C3}
        title="Login, Tag, Push, Pull"
        lead="Four commands, four different jobs, and one of them never touches the network"
        lesson={SESSION}
      >
        {/* `docker login` EARNED THE FOURTH COLUMN; `build` AND `run` DID NOT.

            Login is the one registry command the whole-cycle figure does not
            draw, it is taught two slides before this, and its cadence is the
            distinction the room most often gets wrong: once per MACHINE, where
            push is once per RELEASE. `c2-login`'s own lead makes that point in
            those words, so the column reinforces it rather than introducing
            anything.

            `docker build` and `docker run` were considered and left out: they
            would restate `c3-the-cycle`'s claim that build and run stay on one
            computer while push and pull leave it, and that figure makes the
            argument by geometry rather than by prose. `docker images` is a
            look-up rather than an action on the registry, so it belongs to a
            different axis.

            THE "NEEDS AN ACCOUNT" ROW IS THE USEFUL ONE. Pulling a PUBLIC
            image needs no sign-in at all, which learners routinely assume the
            opposite of, and it is the row that explains why the target picture
            can promise "any machine". */}
        <div className="mx-auto w-full max-w-[1120px]">
          <DataTable
            compact
            columns={[
              { label: '', weight: 0.62 },
              { label: 'docker login', weight: 1 },
              { label: 'docker tag', weight: 1 },
              { label: 'docker push', weight: 1 },
              { label: 'docker pull', weight: 1 },
            ]}
            rows={[
              [
                'What it does',
                'Signs this machine in to Docker Hub',
                'Adds a second name to an image you have',
                'Uploads the named image to Docker Hub',
                'Downloads the image from Docker Hub',
              ],
              ['Uses the network', 'Yes', 'No', 'Yes', 'Yes'],
              ['Needs an account', 'Yes', 'No', 'Yes', 'No, for public images'],
              [
                'How often',
                'Once per machine',
                'Once per release',
                'Once per release',
                'On every machine that runs it',
              ],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Read down the network row first: it is the one that explains why tag is instant and the other two are not. Then ask which of the three a deployment server ever runs, and the answer is only pull.',
  },
]
