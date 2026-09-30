import type { SlideDef } from '@/deck/types'
import {
  ContentNoteSlide,
  ContentSlide,
  KeyTakeawaysSlide,
  QuestionSlide,
  SectionBreakerSlide,
  ThankYouSlide,
} from '@/slides'
import { CodeBlock, DataTable, TagPointers, Terminal } from '@/ui'
import {
  AT_ROOT,
  C1,
  C2,
  C3,
  C4,
  Code,
  IMAGE,
  MK_WITH_PUSH,
  ON_ANOTHER_MACHINE,
  pushDenied,
  REPO,
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
 *       string for a different cause, and the whole point of slide 49 is that
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
        qualifier="The code changed, the tag did not"
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
          { text: 'The old build is unrecoverable from that tag' },
        ]}
        note={{
          kind: 'warning',
          title: 'Why this matters',
          body: (
            <>
              {'A tag is a label on a shelf, not the box on it. Moving the label moves what everyone else finds when they ask for '}
              <Code>v1</Code>
              {', including the server that is running your code right now.'}
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
    label: 'The latest trap',
    element: (
      <ContentSlide
        kicker={C4}
        title="The latest Trap"
        lead="The word sounds safe and automatic, which is exactly the problem"
        points={[
          {
            text: (
              <>
                <Code>latest</Code>
                {' is only the default tag name, it does not mean newest'}
              </>
            ),
            icon: 'warning',
          },
          {
            text: (
              <>
                {'A server pulling '}
                <Code>latest</Code>
                {' can never say which exact build is running'}
              </>
            ),
            icon: 'warning',
          },
          { text: 'When a bad build ships, there is no previous tag to roll back to', icon: 'warning' },
        ]}
        lesson={SESSION}
      />
    ),
    notes:
      'Ask who has typed latest without thinking about it. Then read the second bullet twice, because that is the one that ends an incident call badly.',
  },
  {
    id: 'c4-unique-tags',
    section: C4,
    label: 'One tag per build',
    element: (
      <ContentSlide
        kicker={C4}
        title="One Tag Per Build"
        lead={
          <>
            {'Professional teams give every build a unique tag, and move '}
            <Code>latest</Code>
            {' as a convenience on top of it'}
          </>
        }
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <Terminal
            path={AT_ROOT}
            lines={[
              { text: `docker tag ${IMAGE} ${REPO}:v2`, kind: 'cmd' },
              { text: `docker tag ${IMAGE} ${REPO}:latest`, kind: 'cmd' },
              { text: `docker push ${REPO}:v2`, kind: 'cmd' },
              { text: `docker push ${REPO}:latest`, kind: 'cmd' },
            ]}
            caption="Four commands: two names for one image, then both pushed"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Point out that all four lines act on one image. Two of them are names and two of them are uploads, and the room should be able to tell you which is which.',
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
        title="A History That Holds"
        lead="The repository on Docker Hub now holds a history that never loses a version"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <TagPointers
            repository={REPO}
            tags={[
              { tag: 'v1', note: "last week's build, still pullable" },
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
              {' does not need a rebuild, a revert or a redeploy. It needs the old tag, which is still on Hub because you never reused it. That is what unique tagging buys.'}
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
            {'Four commands to tag and push, which is what a '}
            <Tech name="makefile" label="Makefile" />
            {' is for. The seven targets from last session sit above this, unchanged'}
          </>
        }
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[860px]">
          <CodeBlock
            code={MK_WITH_PUSH}
            filename="Makefile"
            language="makefile"
            highlight={hl(MK_WITH_PUSH, '.PHONY:', 'DOCKER_ID =', 'VERSION =', 'push:', 'docker tag', 'docker push')}
            fontSize={15}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'The lit lines are the only new ones: the file is otherwise theirs from last session. Read the four commands inside push and match them to the previous terminal.',
  },
  {
    id: 'c4-release-ritual',
    section: C4,
    label: 'The release',
    element: (
      <ContentSlide
        kicker={C4}
        title="The Release"
        lead="The whole release is now two words each"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[860px]">
          <Terminal
            path={AT_ROOT}
            lines={[
              { text: 'make build', kind: 'cmd' },
              { text: 'make push', kind: 'cmd' },
            ]}
            caption="Build the image, then ship it"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Hold this slide longer than it deserves. Last session built the file and this is the session where it starts paying, so name that out loud.',
  },
  {
    id: 'c4-override-version',
    section: C4,
    label: 'Makefile, overriding VERSION',
    element: (
      <ContentSlide
        kicker={C4}
        title="Makefile"
        lead={
          <>
            <Code>VERSION = v1</Code>
            {' in the file is only a default, and the command line wins, so there is no file edit per release'}
          </>
        }
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[860px]">
          <Terminal
            path={AT_ROOT}
            lines={[{ text: 'make push VERSION=v2', kind: 'cmd' }]}
            caption="The variable is set for this run only"
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Point at VERSION=v2 and say that nothing in the file changed. Ask what they would type for v3, and let someone say it before you do.',
  },
  {
    id: 'c4-push-denied-again',
    section: C4,
    label: 'Denied again',
    element: (
      /* The same refusal shape as slide 22, from `pushDenied()`. One error text,
         two causes, and naming the ambiguity in the room is cheaper than every
         learner debugging it alone later. */
      <ContentSlide
        kicker={C4}
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
          {
            text: (
              <>
                {'Fix: '}
                <Code>docker login</Code>
                {', then retry'}
              </>
            ),
            icon: 'check',
          },
        ]}
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[860px]">
          {/* The fresh-machine prompt, not the project root: the slide's whole
              premise is a machine that has never logged in. Shared with slides
              36 and 37 so the three cannot disagree. */}
          <Terminal
            path={ON_ANOTHER_MACHINE}
            lines={[
              { text: 'make push', kind: 'cmd' },
              { text: pushDenied(REPO), kind: 'out' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Say that they have seen this exact text before, and ask what was wrong last time. The point of the slide is that the text does not tell them which of the two it is.',
  },
  {
    id: 'c4-full-picture',
    section: C4,
    label: 'Six sessions',
    element: (
      <ContentSlide
        kicker={C4}
        title="Six Sessions"
        lead="The course so far, as one table, and the last row is today"
        lesson={SESSION}
      >
        <div className="mx-auto w-full max-w-[980px]">
          <DataTable
            columns={[{ label: 'Capability', weight: 2 }, { label: 'Achieved with', weight: 1.4 }, { label: 'Session', weight: 0.7, align: 'center' }]}
            rows={[
              ['Package an app and its environment', <Tech key="d1" name="docker" label="Dockerfile" />, '2'],
              ['Run both runtimes together', <Tech key="d2" name="docker" label="Docker Compose" />, '3, 4'],
              ['One-word commands', <Tech key="m1" name="makefile" label="Makefile" />, '5'],
              ['Share images between machines', <Tech key="d3" name="docker" label="Docker Hub push and pull" />, 'this one'],
            ]}
            highlight={[4]}
          />
        </div>
      </ContentSlide>
    ),
    notes:
      'Read the four capabilities in order, not the tools. They should hear a ladder, and the last rung is the one they climbed this morning.',
  },

  /* ══ CLOSING FRAME (51 to 53) ═══════════════════════════════════════════ */
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
