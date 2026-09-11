import type { SlideDef } from '@/deck/types'
import {
  CommandSyntaxSlide,
  ContentNoteSlide,
  ContentSlide,
  KeyTakeawaysSlide,
  ProceduralStepsSlide,
  QuestionSlide,
  SectionBreakerSlide,
  StatusPointsSlide,
  ThankYouSlide,
} from '@/slides'
import { CodeBlock, DataTable, Terminal } from '@/ui'
/* Session-owned figure, imported from its own file rather than through `@/ui`.
   `src/ui/index.ts` is kit-owned, so `sync-kit.mjs` overwrites it and the
   re-export line that used to live at its tail vanished on sync — this file
   stopped compiling with "Module '@/ui' has no exported member 'TagPointers'".
   Importing the file directly keeps it out of the kit's way permanently. */
import { TagPointers } from '@/ui/TagPointers'
import {
  AT_ROOT,
  C1,
  C2,
  C3,
  C4,
  Code,
  IMAGE,
  MK_WITH_PUSH,
  REPO,
  S1,
  S2,
  S3,
  S4,
  S5,
  SESSION,
  Tech,
} from './deckShared'

/**
 * SESSION 6, SLIDES 39 TO 53 — Concept 4 and the closing frame.
 *
 * Concept 4 is "Versioning, and a push Target", TR sections 4.1 to 4.8. It is
 * the only concept in this deck whose spine is a consequence rather than a
 * procedure: the room already knows how to push, and this section shows what
 * pushing carelessly costs them a week later.
 *
 * Local rules, on top of the deck-wide ones in `deckShared.tsx`:
 *
 *   L1  SLIDE 40 IS ASKED BEFORE SLIDE 41 ANSWERS IT. TR 4.1 is written as a
 *       prediction question and the whole beat only works if the room commits to
 *       a guess first. `QuestionSlide` carries the question and the constraint,
 *       and nothing else: no hint, no bullets, no answer.
 *
 *   L2  SLIDES 46 AND 48 SHARE THE TITLE `Makefile`, VERBATIM. They are the same
 *       artifact at two stages, and `TEXT_GUIDELINES.md` §4 forbids "continued".
 *
 *   L3  THE REFUSAL TEXT COMES FROM `pushDenied()`. Slide 22 shows the same
 *       string for a different cause, and the whole point of `c3-push-denied-again` is that
 *       one error text has two causes. Two hand-typed copies could drift, and
 *       then the slide would be arguing with itself.
 *
 *   L4  KEY TAKEAWAYS CARRIES THE FOUR AGENDA CONCEPTS AND NOTHING ELSE. Session
 *       5's standing rule: no fifth idea, no reworded outcome. `C1` to `C4` are
 *       the same strings the agenda pills and the dividers use.
 */

/** The 1-based line numbers in `code` whose text contains any of `needles`.
 *
 * `CodeBlock.highlight` takes line NUMBERS, and hardcoding them is a bug waiting
 * for the file to gain a line: every highlight below an insertion moves onto the
 * wrong row, with no type error and no harness complaint. Session 5 carried the
 * same helper for the same reason. */
function hl(code: string, ...needles: string[]): number[] {
  return code
    .split('\n')
    .map((line, i) => (needles.some((n) => line.includes(n)) ? i + 1 : 0))
    .filter((n) => n > 0)
}

export const partC4Closing: SlideDef[] = [
  /* ══ CONCEPT 4: VERSIONING, AND A push TARGET (39 to 50) ═════════════════ */
  {
    id: 'c4-divider',
    section: C4,
    label: 'Divider 4',
    element: (
      <SectionBreakerSlide index={4} title={C4} subtitle="Tags, rollback, and one more target" lesson={SESSION} />
    ),
    notes:
      'Hand over with a warning, not a summary: they can push now, and the next four slides are about what pushing badly costs them next week.',
  },
  {
    id: 'c4-question',
    section: C4,
    label: 'Prediction question',
    element: (
      /* TR 4.1 is a prediction question, so it is asked as one. The qualifier
         carries the constraint the room needs in order to answer, and no more:
         without "the code changed, the tag did not" the question has two
         readings and half the room answers the other one. */
      <QuestionSlide
        kicker={C4}
        question={
          <>
            {'You push a new build under the same tag, '}
            <Code>v1</Code>
            {'. What happens to the old '}
            <Code>v1</Code>
            {' on Docker Hub?'}
          </>
        }
        qualifier="Code changed, the tag did not"
        lesson={SESSION}
      />
    ),
    notes:
      'Read it, then wait. Take two answers out loud before you advance, and do not correct either one yet. The next slide is the answer.',
  },
  {
    id: 'c4-overwritten',
    section: C4,
    label: 'It is overwritten',
    element: (
      <ContentNoteSlide
        kicker={C4}
        title="It Is Overwritten"
        lead="A tag is a movable pointer, not a permanent snapshot"
        points={[
          { text: 'Pushing the same tag replaces what that tag points to' },
          {
            text: (
              <>
                {'Anyone who pulls '}
                <Code>v1</Code>
                {' from now on gets the new build'}
              </>
            ),
          },
          { text: 'That old build is unrecoverable from that tag' },
        ]}
        note={{
          kind: 'warning',
          title: 'Why this matters',
          body: (
            <>
              {'A tag is a label on a shelf, not the box, so moving it changes what the server gets for '}
              <Code>v1</Code>
              {'.'}
            </>
          ),
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'Say "overwritten" before you show the bullets, so the room hears the answer to their own guess. Point at the third bullet and let it land.',
  },
  {
    id: 'c4-latest-lies',
    section: C4,
    label: 'Why latest is risky',
    element: (
      /*
        `StatusPointsSlide`, NOT `ContentSlide` WITH THREE BULLETS.

        Every line on this slide is a VERDICT on one word, which is what this
        type exists for and what a plain bullet cannot show: the rows carry a
        Careful or a Fails chip, and each gets its one line of consequence
        underneath. As three unmarked bullets the room had to infer which of the
        three was the one that ends an incident badly, and the deck was drawing
        three identical grey ticks over a mostly empty frame.

        The kit had this type from session 4 and this deck used it nowhere.
      */
      <StatusPointsSlide
        kicker={C4}
        title="Why latest Is Risky"
        lead="This word sounds safe and automatic, and that is the problem"
        items={[
          {
            status: 'warning',
            text: (
              <>
                <Code>latest</Code>
                {' is only the default tag name, it does not mean newest'}
              </>
            ),
            detail: 'Docker adds it whenever you leave the tag off',
          },
          {
            status: 'error',
            text: (
              <>
                {'A server pulling '}
                <Code>latest</Code>
                {' can never say which exact build is running'}
              </>
            ),
            detail: 'Nobody can tell which build is live',
          },
          {
            status: 'error',
            text: 'When a bad build reaches the server, no earlier tag exists to return to',
            detail: 'Nothing earlier to go back to',
          },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'Ask who has typed latest without thinking about it. Then read the second bullet twice, because that is the one that ends an incident call badly.',
  },
  {
    /*
      FOUR STEPS, NOT FOUR COMMANDS IN ONE PANEL.

      This shipped as a `Terminal` holding four `cmd` lines and NO OUTPUT.
      Two faults at once:

      - Content rule 25 says one element per slide and names the unit for a
        command chain: one command. Four arriving assembled is the rule's
        stated failure, and the caption ("Four commands: two names for one
        image, then both pushed") was doing the work the drawing should.
      - A `Terminal` of pure `cmd` lines asserts four commands that printed
        nothing. The slide-types registry calls this the commonest way this
        content ships wrong.

      This is also the one procedure in the session a learner repeats on every
      release, which is exactly what `ProceduralStepsSlide` exists for: each
      command gets its own row and its own one-line reason, and the rows arrive
      one click at a time instead of all four at once.
    */
    id: 'c4-unique-tags',
    section: C4,
    label: 'One tag per build',
    element: (
      <ProceduralStepsSlide
        kicker={C4}
        title="One Tag Per Build"
        lead={
          <>
            {'Professional teams give every build a unique tag, and move '}
            <Code>latest</Code>
            {' as a convenience on top of it'}
          </>
        }
        steps={[
          {
            title: <Code>{`docker tag ${IMAGE} ${REPO}:v2`}</Code>,
            detail: 'Name this build, and the name is never reused',
            icon: 'file',
          },
          {
            title: <Code>{`docker tag ${IMAGE} ${REPO}:latest`}</Code>,
            detail: 'Point the convenience name at the same build',
            icon: 'file',
          },
          {
            title: <Code>{`docker push ${REPO}:v2`}</Code>,
            detail: 'Publish the version a server can pin to',
            icon: 'rocket',
          },
          {
            title: <Code>{`docker push ${REPO}:latest`}</Code>,
            detail: 'Publish the convenience name beside it',
            icon: 'rocket',
          },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'Advance one step at a time and say the reason before the command. The two tag commands look identical apart from the last word, which is the point: one image, two names, and only one of them is safe to deploy from.',
  },
  {
    id: 'c4-repo-history',
    section: C4,
    label: 'Repository history',
    element: (
      /* `TagPointers` rather than a `FileTree`: the arrow from `latest` to the
         tag it currently resolves to IS the idea on this slide, and a tree can
         list the three entries but cannot draw the pointer between two of them. */
      <ContentSlide
        kicker={C4}
        title="Every Version Kept"
        lead="Your repository on Docker Hub now keeps every version"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <TagPointers
            repository={REPO}
            tags={[
              { tag: 'v1', note: 'the earlier build, still pullable' },
              { tag: 'v2', note: "today's build" },
              { tag: 'latest', note: 'convenience pointer' },
            ]}
            pointsAt="v2"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Trace the arrow with your hand: latest is not a build, it is a pointer at one. Then ask what happens to v1 when the arrow moves, and let them answer "nothing".',
  },
  {
    id: 'c4-rollback',
    section: C4,
    label: 'Rollback',
    element: (
      <ContentNoteSlide
        kicker={C4}
        title="Rollback"
        lead="Because v1 was never overwritten, going back to it is one command on the server"
        note={{
          kind: 'success',
          title: 'Remember',
          body: (
            <>
              {'A bad '}
              <Code>v2</Code>
              {' needs no rebuild, only the old tag, still on Hub because you never reused it.'}
            </>
          ),
        }}
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[860px]">
          <Terminal
            path={AT_ROOT}
            lines={[{ text: `docker run ${REPO}:v1`, kind: 'cmd' }]}
            caption="Run on the server, no rebuild involved"
          />
        </div>
      </ContentNoteSlide>
    ),
    notes:
      'One line on the screen, and it is the payoff of the whole concept. Say out loud how long a rollback takes when the old image is already built.',
  },
  {
    id: 'c4-push-target',
    section: C4,
    label: 'Makefile, with push',
    element: (
      /* Their session 5 file, grown by one target. `language="makefile"` because
         `CodeBlock` defaults the prop to `python` and the prop is also the chip
         label, and every indented line in `MK_WITH_PUSH` is a real tab. */
      <ContentSlide
        kicker={C4}
        title="Makefile"
        lead={
          <>
            {/* THE LEAD IS ONE LINE BECAUSE THE PANEL GREW.

                MEASURED, because the first two attempts at this lead were both
                wrong and neither was obviously wrong. `push` went from four
                recipe lines to eight, so the composite is 427px. The well is NOT
                a constant 439px: `SlideLead` is `max-w-3xl`, so a lead that
                wraps to two lines is 66px instead of 33px and takes the extra
                33px out of the well below it, leaving 406px. At two lines the
                panel's last rows sat under the control bar, y=658 against a
                floor of 656; at three lines, y=684.

                So this lead has to fit ONE line at `text-body-lg`, which is what
                buys the panel its full 439px well and the blank separator line
                inside the recipe.

                It was also 26 words across two sentences, over rule 26's 20-word
                cap. The clause about the seven targets being unchanged moved to
                `notes:`, which is where "you have seen the rest of this file"
                belongs anyway.

                CONTENT RULE 12: a technology named on a slide carries its logo,
                and `Tech` is the baseline-safe way to set one mid-sentence. The
                hand edit that corrected this lead wrote "the Makefile" as plain
                text and dropped the mark with it. */}
            {'Both names, both pushed, by the '}
            <Tech name="makefile" label="Makefile" />
            {' you already have'}
          </>
        }
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[860px]">
          <CodeBlock
            code={MK_WITH_PUSH}
            filename="Makefile"
            language="makefile"
            highlight={hl(MK_WITH_PUSH, '.PHONY:', 'DOCKER_ID =', 'BACKEND =', 'FRONTEND =', 'LATEST =','VERSION =', 'push:', 'docker tag', 'docker push')}
            fontSize={12.5}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'The seven targets above this sit unchanged, so say that first: the lit lines are the only new ones and the rest of the file is theirs from last session. Then read the eight commands inside push and match them to the four they typed by hand: same two tags, same two pushes, once per image. Close on which name a server should pin to, and it is the version, never latest.',
  },
  {
    id: 'c4-release-ritual',
    section: C4,
    label: 'The release',
    element: (
      <ContentSlide
        kicker={C4}
        title="Release"
        lead="Each release step is two words, and one of them publishes both images"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[860px]">
          <Terminal
            path={AT_ROOT}
            lines={[
              { text: 'make build', kind: 'cmd' },
              { text: 'make push', kind: 'cmd' },
            ]}
            caption="Build both images, then publish each one as its version and as latest"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Hold this slide longer than it deserves. Last session built the file and this is the session where it starts paying, so name that out loud.',
  },
  {
    /*
      A GRAMMAR, NOT A RUN, SO `CommandSyntaxSlide` AND NOT `Terminal`.

      This shipped as a `Terminal` holding one `cmd` line and no output. The
      slide-types registry names that quadrant error as the commonest way this
      content ships wrong, and names the symptom exactly: "a one-line `Terminal`
      reads as a command that printed nothing".

      What this slide teaches is that `VERSION` is a SLOT with a default the
      command line overrides — the shape of the command, not one execution of
      it. `CommandSyntaxSlide` draws that shape, builds the specimen line FROM
      the parts so the diagram and legend cannot drift, and marks the one token
      the learner substitutes with a dashed chip, which is the first question a
      learner asks of any syntax line.

      It deliberately takes no `path`: hard rule 3's prompt-and-folder
      requirement governs a command being RUN, and this one runs nothing. The
      run is the previous slide's job.
    */
    id: 'c4-override-version',
    section: C4,
    label: 'Makefile, overriding VERSION',
    element: (
      <CommandSyntaxSlide
        kicker={C4}
        title="Overriding a Default"
        lead={
          <>
            <Code>VERSION = v1</Code>
            {' in the file is only a default, and the command line wins'}
          </>
        }
        parts={[
          { token: 'make', label: 'Command', body: 'Reads the Makefile in this folder' },
          { token: 'push', label: 'Target', body: 'The target whose eight lines publish both images' },
          {
            token: 'VERSION=v2',
            label: 'Variable override',
            body: 'Replaces the default for this run only, with no file edit',
            fill: 'placeholder',
          },
        ]}
        note={{
          kind: 'note',
          body: 'Nothing in the file changes, so the next release is a different word on the same command.',
        }}
        lesson={SESSION}
      />
    ),
    notes:
      'Point at the dashed chip and say it is the only part that changes per release. Ask what would happen if you left it off, and let someone answer v1 from the file.',
  },
  {
    id: 'c4-full-picture',
    section: C4,
    label: 'Six sessions',
    element: (
      <ContentSlide
        kicker={C4}
        title="Six Sessions"
        lead="Every session by name, and the last row is today"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[1010px]">
          {/* NAMED, NOT NUMBERED, and one row per session rather than four rows
              with "3, 4" squeezed into a numeral column. A learner recognises
              "Docker Compose for Multi-Container Apps"; they do not reliably
              recognise "3". `compact` because six rows is two more than this
              table used to carry. */}
          <DataTable
            compact
            columns={[
              { label: 'Session', weight: 1.5 },
              { label: 'What it added', weight: 1.6 },
              { label: 'Achieved with', weight: 1.2 },
            ]}
            rows={[
              [S1, 'Images and containers', <Tech key="t1" name="docker" label="Docker" />],
              [S2, 'Package an app and its environment', <Tech key="t2" name="docker" label="Dockerfile" />],
              [S3, 'Run both runtimes together', <Tech key="t3" name="docker" label="Docker Compose" />],
              [S4, 'The real app, with volumes and env', <Tech key="t4" name="docker" label="Compose, with volumes" />],
              [S5, 'One-word commands', <Tech key="t5" name="makefile" label="Makefile" />],
              [SESSION, 'Share images between machines', <Tech key="t6" name="docker" label="Docker Hub" />],
            ]}
            highlight={[6]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Read the four capabilities in order, not the tools. They should hear a ladder, and the last rung is the one they climbed this morning.',
  },

  /* ══ CLOSING FRAME (51 to 53) ═══════════════════════════════════════════ */
  {
    /*
      THE COMMAND REFERENCE, AND IT IS THE LAST CONTENT SLIDE ON PURPOSE.

      `c3-three-commands` compares four commands across four axes and answers
      "how do these differ". This answers a different question — "what did we
      type today, and where" — so it is a reference rather than a comparison,
      and it belongs at the end where the room can photograph it.

      Every command here has been run earlier in the session: `docker --version`
      on `setup`, `docker images` on `c1-where-does-it-live`, `docker login` in
      concept 1, `tag` in concept 2, `push` and `pull` in concept 3, and `run`
      on `c3-run-anywhere`. Nothing in this table is new, which is what makes it
      a recap and not a ninth idea (content rule 24).

      `make build` and `make push` are deliberately absent. They are wrappers
      around these commands rather than commands of their own, and
      `c4-release-ritual` already shows the pair. A row for each here would
      claim they belong to the same family as `docker push`.
    */
    id: 'c4-command-reference',
    section: C4,
    label: 'Command reference',
    element: (
      <ContentSlide
        kicker={C4}
        title="Commands We Ran"
        lead="Every command from today, and the machine each one belongs on"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[1120px]">
          {/* `compact`, AND A NOTE ABOUT THE TYPE FLOOR.

              The new `qa.mjs` type-floor sweep flags the `Code` chips in this
              table at 15px against a 16px floor. Dropping `compact` was tried
              and changed nothing, which is the useful finding: `Code` is
              `text-[0.94em]` BY DESIGN, deliberately a shade smaller than its
              surroundings, so in any 16px context it computes to 15px. It is
              not this table being cramped.

              That makes it a question about the floor rather than about this
              slide: either 15px is acceptable for an inline chip, or `Code`
              should be 1em. Left as `compact` because the alternative bought
              nothing and cost height. */}
          <DataTable
            compact
            columns={[
              { label: 'Command', weight: 1 },
              { label: 'What it does', weight: 1.6 },
              { label: 'Where you run it', weight: 1.1 },
            ]}
            rows={[
              [
                <Code>docker --version</Code>,
                'Prints the version, so you know the engine is installed',
                'Any machine with Docker',
              ],
              [
                <Code>docker images</Code>,
                'Lists the images this machine already holds',
                'Any machine with Docker',
              ],
              [
                <Code>docker login</Code>,
                'Signs this machine in to Docker Hub',
                'Once per machine, before the first push',
              ],
              [
                <Code>docker tag</Code>,
                'Adds a second name to an image you already have',
                'The machine that built the image',
              ],
              [
                <Code>docker push</Code>,
                'Uploads the named image to Docker Hub',
                'The machine that built the image',
              ],
              [
                <Code>docker pull</Code>,
                'Downloads the image from Docker Hub',
                'Every machine that runs it',
              ],
              [
                <Code>docker run</Code>,
                'Starts a container from the image',
                'Every machine that serves traffic',
              ],
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Tell the room to photograph this one. Then read the third column down and point out that only two of the seven ever run on a server: pull and run.',
  },
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Key Takeaways',
    element: (
      /* The four agenda concepts, verbatim from `deckShared`, and nothing else.
         A fifth item here would be an idea the agenda never promised. */
      <KeyTakeawaysSlide
        title="Key Takeaways"
        points={[
          { text: C1, icon: 'devices' },
          { text: C2, icon: 'file' },
          { text: C3, icon: 'terminal' },
          { text: C4, icon: 'rocket' },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'The agenda, closed. Read the four concept names back in the order they were promised, and stop there.',
  },
  {
    id: 'next-session',
    section: 'Closing',
    label: 'Next session',
    element: (
      /*
        `kicker`, no `index`. Without the kicker this frame is an unlabelled navy
        title, which is what a section divider looks like, and the room reads it
        as a fifth concept. There is no index for the same reason: this deck has
        four numbered concepts and this is the handover, not a fifth.
      */
      <SectionBreakerSlide kicker="Next session" title="Introduction to Jenkins" lesson={SESSION} />
    ),
    notes:
      'Say the reason, do not put it on the slide: every piece is automated now except the human, and someone still has to notice the code changed and type the two commands. Next session introduces the machine that replaces that someone.',
  },
  {
    id: 'thankyou',
    section: 'Closing',
    label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
    notes: 'Thank the room. The next session is already named on the slide before this one.',
  },
]
