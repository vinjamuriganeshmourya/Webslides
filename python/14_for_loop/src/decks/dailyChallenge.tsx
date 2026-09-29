import type { SlideDef } from '@/deck/types'
import { CodeSyntaxSlide, ContentSlide } from '@/slides'
import { BulletList, CodeBlock, CodeOutput, MonoBadge } from '@/ui'
import { colors } from '@/design/tokens'
import { AnnotatedCode } from './figures/AnnotatedCode'
import { IoPanels } from './figures/IoPanels'
import { LoopShape } from './figures/LoopShape'

/**
 * PYTHON · "For Loop" · THE DECK'S OWN FRAMES.
 *
 * The pedagogy team's lesson plan interleaves two kinds of slide: the stages
 * they authored, and the course's own portal slides, redrawn. The first cut of
 * this deck built only the first kind. Course rule R5c item 8 reverses that:
 * *"the deck's own slides are part of the flow. The Daily Challenge frames are
 * not optional context to be referred to; the room sees them, so the plan
 * carries them."*
 *
 * These are those fourteen frames. They are exported as a RECORD KEYED BY THE
 * PORTAL SLIDE NUMBER, not as an ordered array, because the lesson plan places
 * each one at a different point in its own sequence and the portal number is the
 * only name both documents share. `forLoopDeck.tsx` splices them; nothing here
 * decides an order.
 *
 * THE RENDERING IS OURS, THE CONTENT IS THE REFERENCE'S. The brief: *"blindly
 * follow the reference ppt and enhance the design placement and highlighting."*
 * So no capture is embedded. Every frame is rebuilt from kit components and the
 * three session figures beside this file, and it carries the reference's own
 * sentences, order and emphasis.
 *
 * TWO OF THEM CARRY SPECIFIC REVIEW FEEDBACK, and are built to it:
 *
 *   - `s15` names the three counting lines IN PLACE, on the lines they sit on
 *     (`AnnotatedCode`). Listing them in cards beside the panel was rejected:
 *     *"in the reference it was highlight line and represented as initialization
 *     termination logic and updation, where in yours it was given separately
 *     which is not helping in pure focus."*
 *   - `s16` and `s17` draw the construct with its block, its arrow and its
 *     indentation (`LoopShape`): *"the Repeating block of code block and arrow
 *     and indentation is not represented."*
 *
 * EVERY CODE PANEL SAYS `Python` (content rule 31a). The source invented
 * `mistake.py`, `while_loop.py`, `for_loop.py`, `range_loop.py`, `pattern.py`
 * and `seats.py` for files that are not on anybody's screen. None survives.
 *
 * EVERY OUTPUT IS A REAL RUN on CPython 3.12.3 (course rule R3), checked before
 * this file was written. The one panel that is NOT a run is `s8`'s, and it says
 * so in its own heading: see the note on that slide.
 */

/** Content rule 31a. Never a file name in a foundations session. */
const PY = 'Python'

const SESSION = 'For Loop'

/** The star pattern, as it really prints. The trailing space per row is real. */
const TRIANGLE_4 = '* \n* * \n* * * \n* * * * '

/** `"Python"`, one character per line. What five of these frames print. */
const PYTHON_DOWN = 'P\ny\nt\nh\no\nn'

/* The while loop that `Identify the Mistake` asks about, in both its states.
   The only difference is line 4, which is the whole exercise, so the two
   strings are built from one template and cannot drift apart. */
const mistakeCode = (condition: string) =>
  `a = input()\ncounter = 0\nlength_of_a = len(a)\nwhile counter < ${condition}:\n    print(a[counter])\n    counter = counter + 1`

/** The for loop over a word. Lines 2 and 3 are the loop-back run. */
const WORD_LOOP = 'word = "Python"\nfor each_char in word:\n    print(each_char)'

export const dailyChallengeSlides: Record<string, SlideDef> = {
  /* ── Portal 8 · Daily Challenge · Identify the Mistake ───────────── */
  s8: {
    id: 'portal-8-identify-the-mistake',
    label: 'Identify the Mistake',
    notes:
      'Do not answer it. Read the input, read the expected output, and take a show of hands on which line is wrong. The program really prints P y t h o and stops: the minus one on line 4 costs the last letter. The panel on the right is what it SHOULD print, which is why it is headed Expected output.',
    element: (
      <ContentSlide
        kicker="Daily Challenge"
        title="Identify the Mistake"
        lesson={SESSION}
        lead="The input is Python. Every letter should print on its own line."
      >
        <div className="mx-auto grid w-[1060px] grid-cols-[1fr_300px] items-center gap-10">
          <CodeBlock filename={PY} fontSize={16} code={mistakeCode('(length_of_a - 1)')} />
          {/*
            EXPECTED, NOT PRINTED. The program does not produce this, and saying
            so in the panel's own heading is what keeps course rule R3 true on a
            frame whose entire job is that the output is wrong.
          */}
          <IoPanels
            panels={[
              { label: 'Input', text: 'Python', tone: 'in' },
              { label: 'Expected output', text: PYTHON_DOWN, tone: 'out' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
  },

  /* ── Portal 11 · Daily Challenge · Identify the Mistake ──────────── */
  s11: {
    id: 'portal-11-the-last-letter-comes-back',
    label: 'Identify the Mistake',
    notes:
      'Line 4 is the only line that changed. Read it out loud: counter < length_of_a. The last letter comes back. This output is a real run on CPython 3.12.3.',
    element: (
      <ContentSlide
        kicker="Daily Challenge"
        title="Identify the Mistake"
        lesson={SESSION}
        lead="One character, and the last letter comes back."
      >
        <div className="mx-auto grid w-[1060px] grid-cols-[1fr_300px] items-center gap-10">
          {/* The band on line 4 is the answer to the frame before this one, so
              it is the one thing the eye must find first. */}
          <CodeBlock filename={PY} fontSize={16} code={mistakeCode('length_of_a')} highlight={[4]} />
          <IoPanels
            panels={[
              { label: 'Input', text: 'Python', tone: 'in' },
              { label: 'Output', text: PYTHON_DOWN, tone: 'out' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
  },

  /* ── Portal 15 · While Loop · Can We Simplify This? ──────────────── */
  s15: {
    id: 'portal-15-can-we-simplify-this',
    label: 'Can We Simplify This?',
    notes:
      'Ask it out loud and wait. Three of the six lines only keep count and none of them prints anything. The names sit on the lines they name, so point at the band, not at a card. Content rule 16 keeps this a content slide rather than a question slide: the room needs the code in front of it to answer.',
    element: (
      <ContentSlide
        kicker="While Loop"
        title="Can We Simplify This?"
        lesson={SESSION}
        lead="Three lines in this loop only keep count. None of them prints anything."
      >
        {/*
          R5c item 6. The three names are drawn ON their lines, and the dashed
          run down the left is the loop going back up. The rejected version put
          the same three names in a card grid under the panel, which split the
          room's attention between two places and neither of them was the code.
        */}
        <AnnotatedCode
          className="mx-auto w-[900px]"
          filename={PY}
          fontSize={16}
          code={
            'a = "Python"\nlength_of_a = len(a)\ncounter = 0\nwhile counter < length_of_a:\n    print(a[counter])\n    counter = counter + 1'
          }
          annotations={[
            { line: 3, label: 'Initialization' },
            { line: 4, label: 'Termination condition' },
            { line: 6, label: 'Updation' },
          ]}
          loopBack={{ from: 6, to: 4 }}
        />
      </ContentSlide>
    ),
  },

  /* ── Portal 16 · Loops · For Loop ────────────────────────────────── */
  s16: {
    id: 'portal-16-for-loop',
    label: 'For Loop',
    notes:
      'The shape is the lesson. Point at the indent: everything set in from the for line runs once per item, and the arrow is what goes back up for the next one.',
    element: (
      <ContentSlide
        kicker="Loops"
        title="For Loop"
        lesson={SESSION}
        lead="A new loop that walks through a sequence by itself."
        points={[
          { text: 'for goes through each item of a sequence, one at a time', icon: 'play' },
          { text: 'A string is a sequence', sub: 'A sequence of characters', icon: 'check' },
          { text: 'Numbers can be a sequence too', sub: 'And many more kinds', icon: 'check' },
        ]}
      >
        <LoopShape variable="each_item" sequence="sequence" />
      </ContentSlide>
    ),
  },

  /* ── Portal 17 · Iterate Over Characters · For Loop ──────────────── */
  s17: {
    id: 'portal-17-for-loop-over-a-word',
    label: 'For Loop',
    notes:
      'The shape on the left, the same shape filled in on the right. each_item became each_char and sequence became word. Nothing else moved.',
    element: (
      <ContentSlide
        kicker="Iterate Over Characters"
        title="For Loop"
        lesson={SESSION}
        lead="The sequence here is a word. The loop takes its characters one by one."
      >
        {/* The shape and its instance, side by side and the same width, so the
            two lines sit at the same height and the substitution is readable as
            a substitution. */}
        <div className="mx-auto grid w-[1080px] grid-cols-2 items-center gap-10">
          <LoopShape variable="each_item" sequence="sequence" />
          <AnnotatedCode filename={PY} fontSize={16} code={WORD_LOOP} loopBack={{ from: 3, to: 2 }} />
        </div>
      </ContentSlide>
    ),
  },

  /* ── Portal 18 · Iterate Over Characters · For Loop ──────────────── */
  s18: {
    id: 'portal-18-no-init-no-condition-no-update',
    label: 'For Loop',
    notes:
      'Put this beside the while loop from the Can We Simplify This? frame. Same six letters printed, three fewer lines to write and three fewer ways to get it wrong.',
    element: (
      <ContentSlide
        kicker="Iterate Over Characters"
        title="For Loop"
        lesson={SESSION}
        lead="The same job as the while loop, in two lines."
      >
        <div className="mx-auto grid w-[1080px] grid-cols-[1fr_420px] items-center gap-10">
          <AnnotatedCode filename={PY} fontSize={16} code={WORD_LOOP} loopBack={{ from: 3, to: 2 }} />
          {/* THE HEADING IS WHAT MAKES THESE READ AS RETIRED.

              The reference heads the three with `Not needed any more:` and then
              lists them quietly, one x each. Ours dropped the heading and put a
              `NOT NEEDED` badge on three full-width red alert cards, which put
              more ink on the three lines the for loop DELETES than on the
              two-line for loop beside them. The room's eye went to the cards,
              and the cards are the old code.

              So: the sentence above, and a plain x-list under it. No rail, no
              tint, no badge — the x is the verdict and it is said once per row.

              `immediate`, because the list sits beside a visual and content rule
              6 says the two arrive together.

              NOT `code: true`. These are the NAMES of the three parts, not the
              lines themselves, and the mono face set `Termination condition`
              two lines deep in this column: `align-check.mjs` reported it
              wrapped. The lines they name are on the panel to the left. */}
          <div>
            <p className="mb-4 text-body-lg font-bold" style={{ color: colors.ink }}>
              Not needed any more:
            </p>
            <BulletList
              immediate
              marker="cross"
              tone="accent"
              items={['Initialization', 'Termination condition', 'Updation']}
            />
          </div>
        </div>
      </ContentSlide>
    ),
  },

  /* ── Portal 33 · For Loop · Iterate Over Numbers ─────────────────── */
  s33: {
    id: 'portal-33-iterate-over-numbers',
    label: 'Iterate Over Numbers',
    notes:
      'The shape has not changed. Only the sequence has. So the question is the one on the slide: where does a sequence of numbers come from?',
    element: (
      <ContentSlide
        kicker="For Loop"
        title="Iterate Over Numbers"
        lesson={SESSION}
        lead="A for loop needs a sequence. How do we make a sequence of numbers, like 0, 1, 2, 3?"
      >
        <LoopShape
          className="mx-auto w-[820px]"
          variable="each_number"
          sequence="sequence_of_numbers"
        />
      </ContentSlide>
    ),
  },

  /* ── Portal 34 · Iterate Over Numbers · Range ────────────────────── */
  s34: {
    id: 'portal-34-range-n',
    label: 'Range',
    notes:
      'Say "stops before n" and then say it again. It is the one fact this session comes back to, on the star pattern and on the exit question.',
    element: (
      <CodeSyntaxSlide
        kicker="Iterate Over Numbers"
        title="Range"
        lesson={SESSION}
        lead="range gives us a sequence of whole numbers."
        language="python"
        parts={[
          {
            token: 'range',
            label: 'The name',
            body: 'It builds the sequence. It does not print anything.',
            after: '(',
          },
          {
            token: 'n',
            label: 'The stop',
            body: 'It stops before n, so n is not in the sequence.',
            fill: 'placeholder',
            after: ')',
          },
        ]}
        note={{ kind: 'note', title: 'What it gives', body: 'A sequence of integers, starting from 0.' }}
      />
    ),
  },

  /* ── Portal 35 · Range · Sequence of Integers ────────────────────── */
  s35: {
    id: 'portal-35-range-5',
    label: 'Sequence of Integers',
    notes:
      'Count them out loud with the room: 0, 1, 2, 3, 4. Five numbers, and 5 is not one of them.',
    element: (
      <ContentSlide
        kicker="Range"
        title="Sequence of Integers"
        lesson={SESSION}
        lead="range(5) gives five numbers. The count starts at 0."
      >
        {/* The numbers really are numbers, so tiles are the honest drawing here
            (course rule R5: abstract tiles stay where the items are abstract).
            One `MonoBadge` each rather than one badge holding five, so every
            number is its own DOM rectangle and `align-check.mjs` can see it. */}
        <div className="flex items-center justify-center gap-6">
          <MonoBadge size="lg">range(5)</MonoBadge>
          <span className="font-body text-[28px] leading-none" style={{ color: colors.danger }}>
            {'\u27f6'}
          </span>
          <span className="flex items-center gap-3">
            {['0', '1', '2', '3', '4'].map((n) => (
              <MonoBadge key={n} size="lg">
                {n}
              </MonoBadge>
            ))}
          </span>
        </div>
      </ContentSlide>
    ),
  },

  /* ── Portal 36 · Iterate Over Numbers · Range ────────────────────── */
  s36: {
    id: 'portal-36-for-number-in-range-3',
    label: 'Range',
    notes: 'Three numbers in the sequence, three passes, three lines printed. A real run on CPython 3.12.3.',
    element: (
      <ContentSlide
        kicker="Iterate Over Numbers"
        title="Range"
        lesson={SESSION}
        lead="The loop runs once for each number that range gives."
      >
        <CodeOutput
          layout="stack"
          className="mx-auto w-[760px]"
          panes={[
            {
              location: PY,
              code: 'for number in range(3):\n    print(number)',
              output: '0\n1\n2',
              showLineNumbers: true,
            },
          ]}
        />
      </ContentSlide>
    ),
  },

  /* ── Portal 37 · Example · Right Angle Triangular Pattern ────────── */
  s37: {
    id: 'portal-37-right-angle-triangular-pattern',
    label: 'Right Angle Triangular Pattern',
    notes:
      'Read the input and the output before anybody opens the playground. Four rows for an input of 4, and row three has three stars. Ask what row N has.',
    element: (
      <ContentSlide
        kicker="Example"
        title="Right Angle Triangular Pattern"
        lesson={SESSION}
        lead="Write a program to print a right angle triangle pattern. The number N is the input."
        points={[
          { text: 'The input is one number', sub: 'Read it with int(input())', icon: 'play' },
          { text: 'It prints N rows', sub: 'Row 1 has one star, row N has N of them', icon: 'check' },
        ]}
      >
        <IoPanels
          panels={[
            { label: 'Input', text: '4', tone: 'in' },
            { label: 'Output', text: TRIANGLE_4, tone: 'out' },
          ]}
        />
      </ContentSlide>
    ),
  },

  /* ── Portal 40 · For Loop · Solution ─────────────────────────────── */
  s40: {
    id: 'portal-40-solution',
    label: 'Solution',
    notes:
      'counter goes 0, 1, 2, 3. range(n) stops before n, so four passes. counter + 1 is what turns a count that starts at 0 into a row that starts at one star.',
    element: (
      <ContentSlide
        kicker="For Loop"
        title="Solution"
        lesson={SESSION}
        lead="counter goes 0, 1, 2, 3. Each line prints counter + 1 stars."
      >
        {/* THE ROW IS TOP-ALIGNED AND THE PANEL HUGS ITS CODE. A `1fr` column
            stretched a three-line panel to 740px, so the code sat in the left
            third of a wide dark box with the INPUT/OUTPUT column stranded far to
            its right; and centring the short panel inside a tall row opened
            roughly 160px of nothing between the lead and the first line of
            code. The panel is now its own width, centred in the space it is
            given, and it starts level with INPUT. */}
        {/* SIZED FOR THE BACK OF THE ROOM, not to fill the frame. The block was
            centred and its margins were even, so nothing here was misaligned --
            it was just small: a three-line solution set at 16px using 45% of a
            projected canvas. The code is what the room came to read, so it
            takes the type size it deserves and the panels beside it match.
            The panel still hugs its own code; a 1fr column stretched it to
            740px and stranded the INPUT column far to its right. */}
        <div className="mx-auto flex w-[1090px] items-start justify-center gap-12">
          <AnnotatedCode
            filename={PY}
            fontSize={20}
            code={'n = int(input())\nfor counter in range(n):\n    print("* " * (counter + 1))'}
            loopBack={{ from: 3, to: 2 }}
            className="shrink-0"
          />
          <IoPanels
            panels={[
              { label: 'Input', text: '4', tone: 'in' },
              { label: 'Output', text: TRIANGLE_4, tone: 'out' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
  },

  /* ── Portal 42 · Iterate Over Numbers · Range ────────────────────── */
  s42: {
    id: 'portal-42-range-start-end',
    label: 'Range',
    notes:
      'Two numbers now. The first one is included and the second one is not, which is the asymmetry every learner trips over. Say both halves.',
    element: (
      <CodeSyntaxSlide
        kicker="Iterate Over Numbers"
        title="Range"
        lesson={SESSION}
        lead="range can also start at a number you choose."
        language="python"
        parts={[
          {
            token: 'range',
            label: 'The name',
            body: 'It builds the sequence. It does not print anything.',
            after: '(',
          },
          {
            token: 'start',
            label: 'The first number',
            body: 'The sequence starts here, and start is in it.',
            fill: 'placeholder',
            after: ', ',
          },
          {
            token: 'end',
            label: 'The stop',
            body: 'It stops before end, so end is not in the sequence.',
            fill: 'placeholder',
            after: ')',
          },
        ]}
        note={{
          kind: 'note',
          title: 'Read it as a pair',
          body: 'start is included. end is not.',
        }}
      />
    ),
  },

  /* ── Portal 45 · Iterate Over Numbers · For Loop ─────────────────── */
  s45: {
    id: 'portal-45-simplified-with-range-1-n-1',
    label: 'For Loop',
    notes:
      'Same four rows, same output, and no arithmetic inside print. counter is already the number of stars, because the sequence starts at 1.',
    element: (
      <ContentSlide
        kicker="Iterate Over Numbers"
        title="For Loop"
        lesson={SESSION}
        lead="Simpler with range(1, n + 1). counter is already the number of stars."
      >
        {/* THE ROW IS TOP-ALIGNED AND THE PANEL HUGS ITS CODE. A `1fr` column
            stretched a three-line panel to 740px, so the code sat in the left
            third of a wide dark box with the INPUT/OUTPUT column stranded far to
            its right; and centring the short panel inside a tall row opened
            roughly 160px of nothing between the lead and the first line of
            code. The panel is now its own width, centred in the space it is
            given, and it starts level with INPUT. */}
        {/* SIZED FOR THE BACK OF THE ROOM, not to fill the frame. The block was
            centred and its margins were even, so nothing here was misaligned --
            it was just small: a three-line solution set at 16px using 45% of a
            projected canvas. The code is what the room came to read, so it
            takes the type size it deserves and the panels beside it match.
            The panel still hugs its own code; a 1fr column stretched it to
            740px and stranded the INPUT column far to its right. */}
        <div className="mx-auto flex w-[1090px] items-start justify-center gap-12">
          <AnnotatedCode
            filename={PY}
            fontSize={20}
            code={'n = int(input())\nfor counter in range(1, n + 1):\n    print("* " * counter)'}
            loopBack={{ from: 3, to: 2 }}
            className="shrink-0"
          />
          <IoPanels
            panels={[
              { label: 'Input', text: '4', tone: 'in' },
              { label: 'Output', text: TRIANGLE_4, tone: 'out' },
            ]}
          />
        </div>
      </ContentSlide>
    ),
  },
}

/**
 * The portal numbers, in the order the lesson plan meets them. Exported so the
 * deck can splice a run of them without repeating the literals, and so a
 * misspelled key fails to compile rather than silently rendering nothing.
 */
export const DAILY_CHALLENGE_ORDER = [
  's8',
  's11',
  's15',
  's16',
  's17',
  's18',
  's33',
  's34',
  's35',
  's36',
  's37',
  's40',
  's42',
  's45',
] as const satisfies readonly (keyof typeof dailyChallengeSlides)[]
