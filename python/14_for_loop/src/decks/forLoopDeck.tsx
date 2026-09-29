import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  CodeSyntaxSlide,
  ContentSlide,
  FeedbackSlide,
  KeyTakeawaysSlide,
  PracticeSlide,
  QuestionSlide,
  QuizTimeSlide,
  RecapSlide,
  SectionBreakerSlide,
  StatusPointsSlide,
  ThankYouSlide,
} from '@/slides'
import { Card, CardGrid, CodeBlock, CodeOutput, SwapRows, VariableTrace, StepControls} from '@/ui'
import type { TraceStep } from '@/ui'
import { colors } from '@/design/tokens'
import { Step } from '@/motion/Stepper'
import { SequenceWalk } from './figures/SequenceWalk'
import { PhonePlaylist } from './figures/PhonePlaylist'
import { PiggyBank } from './figures/PiggyBank'
import { MatchPairs } from './figures/MatchPairs'
import { EverydayLoops } from './figures/EverydayLoops'
import { RangeDial } from './figures/RangeDial'

/**
 * PYTHON · "For Loop"
 *
 * Built from `python/session_plans/14_for_loop/plan.md`, signed off on its §7
 * defaults: three new figures, the classroom quiz kept where the source puts it
 * (straight after worksheet task 2), both forms of `range` introduced on the
 * dial, Feedback and Thank you as two frames, and the fourteen portal slides
 * left on the portal.
 *
 * SOURCE. `prog_foundations_LP/14 - For Loop`, an instructor lesson plan rather
 * than a deck. Its 24 authored stages are here; its `data-anim-labels` are the
 * build steps below, in the same order and with the same names, so the room sees
 * the beats the pedagogy team wrote. Course rule R2: the source's own sentences
 * and analogies are the copy.
 *
 * EVERY CODE PANEL SAYS `Python`. Content rule 31a: the learner is typing into a
 * playground, so the tab names the language. The source invented twelve file
 * names (`main.py`, `riya.py`, `seats.py`, `pattern.py` and the rest) for files
 * that are not on anybody's screen, and none of them is carried across.
 *
 * EVERY OUTPUT IS A REAL RUN on CPython 3.12.3, checked before this file was
 * written. `print("* " * counter)` really does emit a trailing space on each
 * row; the strings below keep it.
 *
 * THE THREE NEW FIGURES are session-local first cuts under `./figures/`, because
 * `slide-kit/sequence-lab/` is choosing their final designs in parallel. Each
 * file's header says so and says what re-points where when the lab lands.
 */

export const forLoopMeta: DeckMeta = {
  title: 'For Loop',
  course: 'Python',
  lesson: 'For Loop',
  presenter: 'NxtWave Instructor',
}

const SESSION = 'For Loop'

/** The four agenda items. Key Takeaways restates them word for word (rule 20). */
const AGENDA = {
  forLoop: 'For Loop',
  range: 'Range',
  star: 'The Star Pattern',
  mistake: 'The One Mistake',
} as const

/** Content rule 31a. Never a file name in a foundations session. */
const PY = 'Python'

const box = (name: string, value: string) => ({ name, value })

/* ------------------------------------------------------------------ */
/* Worksheet task 1: `word = "Hi"`, traced. The source's 11 labels.     */
/* ------------------------------------------------------------------ */

const TASK1_CODE = 'word = "Hi"\nn = 0\nfor ch in word:\n    n = n + 1\n    print(ch)\nprint(n)'

const TASK1_STEPS: TraceStep[] = [
  { line: 1, boxes: [box('word', '"Hi"')], output: [] },
  { line: 2, boxes: [box('word', '"Hi"'), box('n', '0')], output: [] },
  { line: 3, boxes: [box('word', '"Hi"'), box('n', '0'), box('ch', 'H')], output: [] },
  { line: 4, boxes: [box('word', '"Hi"'), box('n', '1'), box('ch', 'H')], output: [] },
  { line: 5, boxes: [box('word', '"Hi"'), box('n', '1'), box('ch', 'H')], output: ['H'] },
  { line: 3, boxes: [box('word', '"Hi"'), box('n', '1'), box('ch', 'i')], output: ['H'] },
  { line: 4, boxes: [box('word', '"Hi"'), box('n', '2'), box('ch', 'i')], output: ['H'] },
  { line: 5, boxes: [box('word', '"Hi"'), box('n', '2'), box('ch', 'i')], output: ['H', 'i'] },
  { line: 3, boxes: [box('word', '"Hi"'), box('n', '2'), box('ch', 'i')], output: ['H', 'i'] },
  { line: 6, boxes: [box('word', '"Hi"'), box('n', '2'), box('ch', 'i')], output: ['H', 'i', '2'] },
]

/** The source's own beat names, used as the slide's speaker script. */
const TASK1_NOTES = [
  'Line 1. word now holds the two characters H and i.',
  'Line 2. n starts at 0.',
  'Line 3, first pass. The loop takes the first item out of the sequence. ch is H.',
  'Line 4. n goes from 0 to 1.',
  'Line 5. It prints whatever ch is holding right now.',
  'Line 3, second pass. Back to the loop. It takes the next item. ch is i.',
  'Line 4. n goes from 1 to 2.',
  'Line 5. It prints i.',
  'Line 3, third try. The loop asks for the next item. There is none left, so the loop ends.',
  'Line 6. It prints n, which is 2. Two characters, two passes.',
].join(' ')

/* ------------------------------------------------------------------ */
/* Riya's savings, traced. The source's 10 labels.                     */
/* ------------------------------------------------------------------ */

const RIYA_CODE =
  'n = int(input())\ntotal = 0\nfor day in range(1, n + 1):\n    if day % 2 == 1:\n        total = total + day\nprint(total)'

const riya = (day: string, total: string): { name: string; value: string }[] => [
  box('n', '7'),
  box('day', day),
  box('total', total),
]

const RIYA_STEPS: TraceStep[] = [
  { line: 2, boxes: [box('n', '7'), box('total', '0')], output: [] },
  { line: 5, boxes: riya('1', '1'), output: [] },
  { line: 4, boxes: riya('2', '1'), output: [] },
  { line: 5, boxes: riya('3', '4'), output: [] },
  { line: 4, boxes: riya('4', '4'), output: [] },
  { line: 5, boxes: riya('5', '9'), output: [] },
  { line: 4, boxes: riya('6', '9'), output: [] },
  { line: 5, boxes: riya('7', '16'), output: [] },
  { line: 3, boxes: riya('7', '16'), output: [] },
  { line: 6, boxes: riya('7', '16'), output: ['16'] },
]

const RIYA_NOTES = [
  'Lines 1 and 2. n is 7. total starts at 0.',
  'Day 1. 1 is odd. total goes from 0 to 1.',
  'Day 2. 2 is even. The if is False, so total stays 1.',
  'Day 3. 3 is odd. total goes from 1 to 4.',
  'Day 4. 4 is even. The if is False, so total stays 4.',
  'Day 5. 5 is odd. total goes from 4 to 9.',
  'Day 6. 6 is even. The if is False, so total stays 9.',
  'Day 7. 7 is odd. total goes from 9 to 16.',
  'No days left. range stops before 8. The loop ends.',
  'Line 6. It prints 16. That is Riya\u2019s money after 7 days.',
].join(' ')

/* ------------------------------------------------------------------ */
/* The exit question, traced. seats 4, booked 3.                       */
/* ------------------------------------------------------------------ */

const SEATS_CODE =
  'seats = int(input())\nbooked = int(input())\nleft = seats - booked\nfor i in range(1, left):\n    print("Seat", i)'

const SEATS_STEPS: TraceStep[] = [
  { line: 2, boxes: [box('seats', '4'), box('booked', '3')], output: [] },
  { line: 3, boxes: [box('seats', '4'), box('booked', '3'), box('left', '1')], output: [] },
  { line: 4, boxes: [box('seats', '4'), box('booked', '3'), box('left', '1')], output: [] },
  { line: 4, boxes: [box('seats', '4'), box('booked', '3'), box('left', '1')], output: [] },
]

/** The star pattern, as it really prints. Trailing space per row is real. */
const TRIANGLE_4 = '* \n* * \n* * * \n* * * * '

const WORD_LOOP = (w: string) => `word = "${w}"\nfor ch in word:\n    print(ch)\nprint("Done")`

const task2Slide = (
  id: string,
  title: string,
  word: string,
  lead: string,
  note: string,
): SlideDef => ({
  id,
  section: AGENDA.forLoop,
  label: title,
  notes: note,
  element: (
    <ContentSlide kicker="Worksheet task 2" title={title} lesson={SESSION} lead={lead}>
      <CodeBlock filename={PY} code={WORD_LOOP(word)} className="mx-auto w-[620px]" />
    </ContentSlide>
  ),
})

export const forLoopDeck: SlideDef[] = [
  /* ── Front frame and recap ───────────────────────────────────────── */
  {
    id: 'brand',
    section: 'Opening',
    label: 'Welcome',
    element: <BrandSlide greeting="Welcome!" lesson={SESSION} />,
  },
  {
    id: 'recap',
    section: 'Recap',
    label: 'Where We Left Off',
    element: (
      <RecapSlide
        kicker="Recap"
        title="Where We Left Off"
        lesson={SESSION}
        points={[
          { text: 'A while loop repeats a block of code', sub: 'As long as its condition is True', icon: 'play' },
          { text: 'It needs three lines to work', sub: 'A start value, a condition, and an update', icon: 'settings' },
          { text: 'Miss the update and it never stops', sub: 'The condition stays True for ever', icon: 'warning' },
        ]}
      />
    ),
  },
  {
    id: 'recap-match',
    section: 'Recap',
    label: 'The while loop, in three parts',
    notes:
      'Ask the room to call out which two go together before you press the key. One join per press, and the reason lands with the join.',
    element: (
      <ContentSlide
        kicker="Recap"
        title="The while loop, in three parts"
        lesson={SESSION}
        lead="Three parts on the left, three jobs on the right. Call out which two go together, then we join them."
      >
        <MatchPairs
          leftLabel="The three lines"
          rightLabel="What each one does"
          rightOrder={[0, 2, 1]}
          className="mx-auto w-[1060px]"
          pairs={[
            {
              left: 'counter = 0',
              right: 'Sets the starting value. Runs once, before the loop.',
              why: 'Initialization. Miss it and the name does not exist yet, so line 2 cannot even be asked.',
            },
            {
              left: 'while counter < 3:',
              right: 'The question asked before every pass.',
              why: 'The condition. For this program it is asked 4 times, not 3: once before each pass, and once more at the end when the answer is finally no.',
            },
            {
              left: 'counter = counter + 1',
              right: 'Moves the counter on, so the question can turn false.',
              why: 'Updation. Take this line out and the answer stays yes for ever, and the program never stops.',
            },
          ]}
        />
        <StepControls className="mt-4 w-full justify-center" showCount={false} nextLabel="Join them" />
      </ContentSlide>
    ),
  },

  /* ── Hook ────────────────────────────────────────────────────────── */
  {
    id: 'hook-playlist',
    section: 'Hook',
    label: 'One tap, and it keeps going',
    notes: 'Six beats, the source\u2019s own: the list, one tap, it moves on, to the end and it stops, one more song, your turn.',
    element: (
      <ContentSlide kicker="Before we start" title="One tap, and it keeps going" lesson={SESSION}>
        <PhonePlaylist
          appMark="/assets/companies/spotify.png"
          appName="Spotify"
          tracks={[
            { title: 'Morning Raag', artist: 'Ananya Rao', length: '3:58', art: colors.brand },
            { title: 'City Lights', artist: 'Kabir Sen', length: '4:12', art: colors.teal },
            { title: 'Slow Train', artist: 'Meera Iyer', length: '3:21', art: colors.accent },
            { title: 'Paper Boats', artist: 'Nikhil Das', length: '2:47', art: colors.info },
            { title: 'Long Way Home', artist: 'Sara Qureshi', length: '5:03', art: colors.brandDeep },
            { title: 'One More Time', artist: 'Ravi Menon', length: '3:35', art: colors.warning },
          ]}
          beats={[
            { at: -1, visible: 5, label: 'The list', caption: 'A Spotify playlist you made. Five songs.' },
            { at: 0, visible: 5, label: 'One tap', caption: 'You tap play once. Song one starts.' },
            {
              at: 1,
              visible: 5,
              label: 'It moves on its own',
              caption: 'Song one ends. Song two starts. You did not touch the phone.',
            },
            {
              at: 5,
              visible: 5,
              stopped: true,
              label: 'Right to the end, then it stops',
              caption: 'The last song ends and it stops. Nothing says five. So what told it to stop?',
            },
            {
              at: 5,
              visible: 6,
              label: 'Add one song',
              caption: 'Now there are six. It plays six. You never typed a number.',
            },
            {
              at: 6,
              visible: 6,
              stopped: true,
              label: 'Your turn',
              caption: 'Where else does one tap keep going till a list runs out?',
            },
          ]}
        />
              </ContentSlide>
    ),
  },
  {
    id: 'hook-where-else',
    section: 'Hook',
    label: 'Where else does this happen?',
    element: (
      <ContentSlide
        kicker="Your turn"
        title="Where else does this happen?"
        lesson={SESSION}
        lead="One action, and it keeps going by itself until a list runs out."
      >
        {/* THREE REAL INTERFACES, NOT THREE TEXT CARDS. Course rule R5c: three
            Cards with a sentence each is the same content with the argument
            removed. Each screen runs its own idle loop at its own period, so
            the three never beat in unison and the room sees three different
            things doing one shape. */}
        {/* mt-7: the third card's top-right corner sat 21px inside the
            instructor-video rectangle (x913..1280, y0..220). The three cards
            are as wide as the well allows, so the fix is vertical, not a
            narrower figure. */}
        <EverydayLoops
          className="mt-4"
          cards={[
            {
              title: 'The attendance register',
              caption: 'One name, one tick. It stops when the names run out.',
              scene: { kind: 'register', names: ['Aarav', 'Diya', 'Ishan', 'Riya', 'Zoya'] },
            },
            {
              /* The mark, not an icon: content rule 12. The file is the
                 library's own `companies/instagram.png`. */
              title: (
                <span className="flex items-center gap-2">
                  <img src="/assets/companies/instagram.png" alt="" width={22} height={22} draggable={false} />
                  Instagram stories
                </span>
              ),
              caption: 'One story, then the next. Nobody types how many there are.',
              scene: { kind: 'stories', stories: 5 },
            },
            {
              title: 'The billing counter',
              caption: 'One item over the scanner, one beep, until the basket is empty.',
              scene: { kind: 'counter', items: 4, beep: 'beep' },
            },
          ]}
        />
        <p className="mt-5 text-center text-body-lg font-semibold text-ink">
          Same shape all three times. Take a list. Do one job. Once for each item in it. You never say
          how many.
        </p>
        <StepControls className="mt-4 w-full justify-center" showCount={false} />
      </ContentSlide>
    ),
  },
  {
    id: 'todays-topic',
    section: 'Hook',
    label: "Today's topic",
    transition: 'fade',
    element: <SectionBreakerSlide kicker="Today's topic" title={SESSION} lesson={SESSION} />,
  },
  {
    id: 'agenda',
    section: 'Hook',
    label: 'What We Will Cover',
    element: (
      <AgendaSlide
        title="What We Will Cover"
        lesson={SESSION}
        items={[
          { title: AGENDA.forLoop, sub: 'Walk through a sequence, one item at a time' },
          { title: AGENDA.range, sub: 'Make a sequence of numbers' },
          { title: AGENDA.star, sub: 'Write it yourself' },
          { title: AGENDA.mistake, sub: 'The one everybody makes' },
        ]}
      />
    ),
  },

  /* ── Concept 1 · The for loop (SCQA) ─────────────────────────────── */
  {
    id: 'divider-for-loop',
    section: AGENDA.forLoop,
    label: 'For Loop',
    transition: 'fade',
    element: (
      <SectionBreakerSlide
        index={1}
        title={AGENDA.forLoop}
        subtitle="Walk through a sequence, one item at a time"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'can-we-simplify',
    section: AGENDA.forLoop,
    label: 'Can We Simplify This?',
    notes:
      'Ask it out loud and wait. Three of the six lines only keep count. Content rule 16 keeps this a content slide rather than a question slide, because the room needs the code in front of it to answer.',
    element: (
      <ContentSlide
        kicker="While Loop"
        title="Can We Simplify This?"
        lesson={SESSION}
        lead="Three lines in this loop only keep count. None of them prints anything."
      >
        {/* The cards sit UNDER the code, not beside it. Beside it they run from
            x=699 to x=1216 starting at y=154, which is straight through the
            instructor-video rectangle; `video-safe.mjs` reported 303px in. */}
        <CodeBlock
          filename={PY}
          className="mx-auto w-[680px]"
          fontSize={15}
          code={'a = "Python"\nlength_of_a = len(a)\ncounter = 0\nwhile counter < length_of_a:\n    print(a[counter])\n    counter = counter + 1'}
          highlight={[2, 3, 4, 6]}
        />
        {/* The code is on screen from step 0; the three names are the teaching
            beats, one per press, so the room reads one line at a time. */}
        <CardGrid cols={3} className="mt-5">
          <Card icon="settings" title="Initialization">
            counter = 0
          </Card>
          <Card icon="target" title="Termination condition">
            while counter &lt; length_of_a:
          </Card>
          <Card icon="arrow" title="Updation">
            counter = counter + 1
          </Card>
        </CardGrid>
      </ContentSlide>
    ),
  },
  {
    id: 'for-loop-syntax',
    section: AGENDA.forLoop,
    label: 'For Loop syntax',
    element: (
      <CodeSyntaxSlide
        kicker={AGENDA.forLoop}
        title="For Loop"
        lesson={SESSION}
        lead="for goes through each item of a sequence, one at a time"
        language="python"
        parts={[
          { token: 'for', label: 'The keyword', body: 'It starts the loop.', after: ' ' },
          {
            token: 'each_item',
            label: 'The loop variable',
            body: 'It holds one item at a time. You choose this name.',
            fill: 'placeholder',
            after: ' ',
          },
          { token: 'in', label: 'The keyword', body: 'It reads as "in", and it means it.', after: ' ' },
          {
            token: 'sequence',
            label: 'The sequence',
            body: 'The items to walk. A string is a sequence of characters.',
            fill: 'placeholder',
            after: ':',
          },
        ]}
        note={{ kind: 'note', title: 'The body', body: 'The indented lines under it run once for each item.' }}
      />
    ),
  },
  {
    id: 'string-is-a-sequence',
    section: AGENDA.forLoop,
    label: '"Python", one character at a time',
    notes:
      'Ask "one string, or six characters?" and take the vote before you press the key. The fourth beat is the one that matters: print("Done") is reached only after the sequence runs out.',
    element: (
      <ContentSlide
        kicker="A string is a sequence"
        title={'"Python", one character at a time'}
        lesson={SESSION}
        lead="One string, or six characters? Say which, then we split it."
      >
        <SequenceWalk
          holdsLabel="ch"
          endLabel="nothing left"
          items={[
            { label: 'P' },
            { label: 'y' },
            { label: 't' },
            { label: 'h' },
            { label: 'o' },
            { label: 'n' },
          ]}
          beats={[
            { at: -1, visible: 0, label: 'One string', caption: 'word holds "Python". Say it: is that one thing, or six?' },
            { at: -1, label: 'Split it', caption: 'Six characters. A string is a sequence of characters.' },
            {
              at: 5,
              holds: 'n',
              label: 'One at a time',
              caption: 'The loop hands ch one character per pass: P, then y, then t, then h, then o, then n.',
            },
            {
              at: 6,
              holds: 'n',
              label: 'It runs out',
              caption: 'The loop asks for the next character. There is none, so the loop ends and print("Done") runs.',
            },
          ]}
        />
        <StepControls className="mt-4 w-full justify-center" showCount={false} mode="code" />
      </ContentSlide>
    ),
  },
  {
    id: 'same-job-two-lines',
    section: AGENDA.forLoop,
    label: 'The same job, in two lines',
    notes:
      'Both print the same six lines. One of them needs six lines to do it. No lead on this frame: the two panes need the whole well.',
    element: (
      <ContentSlide
        title="The same job, in two lines"
        lesson={SESSION}
        kicker={AGENDA.forLoop}
      >
        {/* THE WIDTH IS THE FIX, NOT THE HEIGHT. The instructor-video rectangle
            starts at x=913, so a two-pane block capped at 845px ends at x=909
            and can be as tall as the well allows. `outputFontSize` rather than
            `maxHeight`, because a capped panel only scrolls and every harness
            measures the un-clipped rect.

            THE FOR LOOP IS THE LEFT PANE, and the order is a layout constraint
            as much as a reading one: the while pane is 514px tall and the deck's
            control cluster owns x18..409 below y=660, so the tall pane has to be
            the right-hand one. The short answer first, with the six lines it
            replaces beside it, is also the better read. */}
        <CodeOutput
          className="w-[845px]"
          outputFontSize={14}
          panes={[
            {
              label: 'The for loop',
              location: PY,
              code: 'word = "Python"\nfor each_char in word:\n    print(each_char)',
              output: 'P\ny\nt\nh\no\nn',
            },
            {
              label: 'The while loop',
              location: PY,
              code: 'a = "Python"\nlength_of_a = len(a)\ncounter = 0\nwhile counter < length_of_a:\n    print(a[counter])\n    counter = counter + 1',
              output: 'P\ny\nt\nh\no\nn',
            },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'not-needed',
    section: AGENDA.forLoop,
    label: 'Not needed any more',
    element: (
      <StatusPointsSlide
        kicker={AGENDA.forLoop}
        title="Not needed any more"
        lesson={SESSION}
        lead="The for loop walks the sequence itself, so three of the while loop's lines have no job left."
        items={[
          { status: 'error', text: 'Initialization', detail: 'No counter to start at 0.' },
          { status: 'error', text: 'Termination condition', detail: 'The sequence running out is the stop.' },
          { status: 'error', text: 'Updation', detail: 'The loop moves to the next item on its own.' },
        ]}
      />
    ),
  },
  {
    id: 'task1-trace',
    section: AGENDA.forLoop,
    label: 'Trace it before you run it',
    notes: TASK1_NOTES,
    element: (
      <ContentSlide
        kicker="Worksheet task 1"
        title="Trace it before you run it"
        lesson={SESSION}
        lead="Fill the pass table by hand first. Nothing here moves until pens are down."
      >
        <VariableTrace code={TASK1_CODE} steps={TASK1_STEPS} location={PY} />
        <StepControls className="mt-4 w-full justify-center" showCount={false} mode="code" />
      </ContentSlide>
    ),
  },
  task2Slide(
    'task2-step1',
    'Step 1: type it, run it',
    'Rain',
    'Type this program into the playground. Run it as it is, then tick step 1 on the worksheet.',
    'It prints R, a, i, n, then Done. Worksheet tab and the playground only.',
  ),
  task2Slide(
    'task2-step2',
    'Step 2: change the word',
    'Delhi',
    'On the worksheet, write how many lines it will print. Then run it.',
    'Write first, run second. A guess after the run is not a guess. Five characters, so five lines, then Done.',
  ),
  task2Slide(
    'task2-step3',
    'Step 3: an empty word',
    '',
    'Two quote marks, nothing between. Write what it will print, run it, then write what it really printed.',
    'Does it give an error? Decide before you run. It prints Done and nothing else: an empty sequence means zero passes.',
  ),

  /* ── The classroom quiz, where the source puts it ────────────────── */
  {
    id: 'quiz',
    section: AGENDA.forLoop,
    label: 'Quiz Time!',
    transition: 'zoom',
    notes:
      'The source runs the classroom quiz here, straight after worksheet task 2, and course rule R2 keeps quiz positions where the source put them. Open the quiz on the portal, everyone answers alone, then go through the answers together.',
    element: <QuizTimeSlide lesson={SESSION} />,
  },

  /* ── Concept 2 · range (Merrill) ─────────────────────────────────── */
  {
    id: 'divider-range',
    section: AGENDA.range,
    label: 'Range',
    transition: 'fade',
    element: (
      <SectionBreakerSlide
        index={2}
        title={AGENDA.range}
        subtitle="Make a sequence of numbers"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'question-sequence-of-numbers',
    section: AGENDA.range,
    label: 'How do we make a sequence of numbers?',
    notes: 'Take the answers out loud. Do not answer it here.',
    element: (
      <QuestionSlide
        kicker={AGENDA.range}
        question="How do we make a sequence of numbers?"
        qualifier="A for loop needs a sequence. What if we want numbers, like 0, 1, 2, 3?"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'range-dial',
    section: AGENDA.range,
    label: 'The range dial',
    notes:
      'Say the two numbers out loud first, and count hands, before each press. Beat 2 is the one the rest of the session depends on: it stops before the end value.',
    element: (
      <ContentSlide
        kicker="Predict, then look"
        title="The range dial"
        lesson={SESSION}
        lead="Say the two numbers out loud first. Which numbers come out, and how many?"
      >
        <RangeDial
          max={10}
          beats={[
            {
              stop: 5,
              label: 'range(n)',
              caption: 'range(5) gives five numbers. The count starts at 0.',
            },
            {
              stop: 5,
              markStop: true,
              label: 'Stops before',
              caption: '5 is not included. range stops before its end value.',
            },
            {
              start: 1,
              stop: 5,
              markStop: true,
              label: 'range(start, end)',
              caption: 'range can also start at a number you choose. It still stops before the end.',
            },
          ]}
        />
        <StepControls className="mt-4 w-full justify-center" showCount={false} />
      </ContentSlide>
    ),
  },
  {
    id: 'for-number-in-range',
    section: AGENDA.range,
    label: 'for number in range(3)',
    element: (
      <ContentSlide
        kicker={AGENDA.range}
        title="for number in range(3)"
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
  {
    id: 'riya-piggy-bank',
    section: AGENDA.range,
    label: "Riya's piggy bank",
    notes:
      'Riya\u2019s rule: on an odd day d, she saves \u20b9d. On an even day, she saves nothing. Close on the last beat and hand the problem over.',
    element: (
      <ContentSlide kicker="A story" title="Riya's piggy bank" lesson={SESSION}>
        <PiggyBank
          days={[
            { label: 'Day 1', coin: '\u20b91' },
            { label: 'Day 2' },
            { label: 'Day 3', coin: '\u20b93' },
            { label: 'Day 4' },
            { label: 'Day 5', coin: '\u20b95' },
            { label: 'Day 6' },
            { label: 'Day 7', coin: '\u20b97' },
          ]}
          beats={[
            {
              at: -1,
              total: '\u20b90',
              label: 'The plan',
              caption: 'I want to save money. But I will save only on odd days.',
            },
            { at: 0, total: '\u20b91', label: 'Day 1', caption: 'Day 1 is odd. I put in \u20b91.' },
            { at: 1, total: '\u20b91', label: 'Day 2', caption: 'Day 2 is even. Nothing for me today!' },
            { at: 2, total: '\u20b94', label: 'Day 3', caption: 'Day 3 is odd. I put in \u20b93.' },
            {
              at: 6,
              total: '\u20b916',
              label: 'Up to day 7',
              caption: 'Day 5 gives \u20b95. Day 7 gives \u20b97. Now I have \u20b916!',
            },
            {
              at: 7,
              total: '\u20b916',
              ended: true,
              label: 'Your turn',
              caption: 'What about 30 days? Or a whole year? I cannot add all that by hand!',
            },
          ]}
        />
        <StepControls className="mt-4 w-full justify-center" showCount={false} />
      </ContentSlide>
    ),
  },
  {
    id: 'riya-challenge',
    section: AGENDA.range,
    label: "Riya's savings",
    element: (
      <PracticeSlide
        kicker="Coding challenge"
        title="Riya's savings"
        lesson={SESSION}
        prompt="Read a number n. Print the total money Riya saves from day 1 to day n, both days included."
        tasks={[
          { text: 'Input 7, output 16', sub: 'On an odd day d, she saves \u20b9d. On an even day, she saves nothing' },
          { text: 'Input 4, output 4', sub: 'Run it with 7 first. It must print 16' },
          { text: 'Hint: day % 2 == 1', sub: 'It is True only when day is odd' },
        ]}
      />
    ),
  },
  {
    id: 'riya-trace',
    section: AGENDA.range,
    label: "Riya's savings, day by day",
    notes: RIYA_NOTES,
    element: (
      <ContentSlide kicker="Check it together" title="Riya's savings, day by day" lesson={SESSION} lead="Input 7.">
        <VariableTrace code={RIYA_CODE} steps={RIYA_STEPS} location={PY} />
        <StepControls className="mt-4 w-full justify-center" showCount={false} mode="code" />
      </ContentSlide>
    ),
  },

  /* ── Concept 3 · The row that goes missing (STAR) ────────────────── */
  {
    id: 'divider-star',
    section: AGENDA.star,
    label: 'The Star Pattern',
    transition: 'fade',
    element: (
      <SectionBreakerSlide
        index={3}
        title={AGENDA.star}
        subtitle="Write it yourself"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'task3-write-the-loop',
    section: AGENDA.star,
    label: 'Write the loop line',
    notes:
      'For n = 4 it prints 4 rows, and the last row is four stars. Write line 2 in full, with the colon. More than one pair of answers works.',
    element: (
      <ContentSlide
        kicker="Worksheet task 3"
        title="Write the loop line"
        lesson={SESSION}
        lead="Line 1 is given. Line 2 and the blank on line 3 are yours. The two blanks must agree."
      >
        <div className="grid grid-cols-[1fr_0.8fr] items-center gap-10">
          <CodeBlock
            filename={PY}
            code={'n = int(input())\n___________________________\nprint("* " * ______)'}
          />
          <Card icon="target" title="For n = 4">
            It prints 4 rows. The last row is * * * *
          </Card>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'star-solution',
    section: AGENDA.star,
    label: 'Solution',
    element: (
      <ContentSlide
        kicker={AGENDA.star}
        title="Solution"
        lesson={SESSION}
        lead="counter goes 0, 1, 2, 3. Each line prints counter + 1 stars."
      >
        <CodeOutput
          className="mx-auto w-[1000px]"
          panes={[
            {
              label: 'Input 4',
              location: PY,
              code: 'n = int(input())\nfor counter in range(n):\n    print("* " * (counter + 1))',
              output: TRIANGLE_4,
              showLineNumbers: true,
            },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'which-one-is-right',
    section: AGENDA.mistake,
    label: 'Which one is right?',
    notes:
      'Hands up for A. Now hands up for B. Count both before you reveal. A drops the last row; B prints all n.',
    element: (
      <ContentSlide
        kicker="Predict, then run"
        title="Which one is right?"
        lesson={SESSION}
        lead="Both of these start at 1. Which one prints all n rows, for n = 4?"
      >
        {/* VOTE, THEN RUN. The two candidates are on screen at step 0 and the
            verdict is a build step, so the room commits before it sees which
            one is right. Collapsing the pair into one reveal is the one thing
            that destroys this device. */}
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="mb-2 font-heading text-body-lg font-bold text-ink">A</div>
            <CodeBlock
              filename={PY}
              showLineNumbers={false}
              code={'n = int(input())\nfor counter in range(1, n):\n    print("* " * counter)'}
            />
          </div>
          <div>
            <div className="mb-2 font-heading text-body-lg font-bold text-ink">B</div>
            <CodeBlock
              filename={PY}
              showLineNumbers={false}
              code={'n = int(input())\nfor counter in range(1, n + 1):\n    print("* " * counter)'}
            />
          </div>
        </div>
        <Step dir="up" className="mt-6">
          <SwapRows
            leftLabel="A · range(1, n)"
            rightLabel="B · range(1, n + 1)"
            caption="B is right. A stops before n, so the last row never prints."
            pairs={[
              { from: 'counter goes 1, 2, 3', to: 'counter goes 1, 2, 3, 4' },
              { from: '3 rows printed', to: '4 rows printed' },
            ]}
          />
        </Step>
      </ContentSlide>
    ),
  },
  {
    id: 'simpler-with-range-1-n-1',
    section: AGENDA.mistake,
    label: 'Simpler with range(1, n + 1)',
    element: (
      <ContentSlide
        kicker={AGENDA.mistake}
        title="Simpler with range(1, n + 1)"
        lesson={SESSION}
        lead="counter is already the number of stars, so there is nothing to add."
      >
        <CodeOutput
          className="mx-auto w-[1000px]"
          panes={[
            {
              label: 'Input 4',
              location: PY,
              code: 'n = int(input())\nfor counter in range(1, n + 1):\n    print("* " * counter)',
              output: TRIANGLE_4,
              showLineNumbers: true,
            },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'exit-question',
    section: AGENDA.mistake,
    label: 'Which one prints nothing?',
    notes:
      'Do not answer it here. Take a show of hands on each of the four pairs. The answer is the frame after this one.',
    element: (
      <ContentSlide
        kicker="Exit question"
        title="Which one prints nothing?"
        lesson={SESSION}
        lead="Read the code. For which pair does the screen show nothing at all?"
      >
        <div className="grid grid-cols-[1.1fr_1fr] items-center gap-10">
          <CodeBlock filename={PY} code={SEATS_CODE} />
          {/* A plain grid, not `CardGrid`: that one wraps each child in a build
              step, and all four pairs have to be on screen together for the
              room to choose between them. */}
          <div className="grid grid-cols-2 gap-5">
            <Card title="A">seats = 5, booked = 3</Card>
            <Card title="B">seats = 4, booked = 3</Card>
            <Card title="C">seats = 3, booked = 0</Card>
            <Card title="D">seats = 6, booked = 2</Card>
          </div>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'exit-answer',
    section: AGENDA.mistake,
    label: 'Why it prints nothing',
    notes:
      'Option B. seats is 4 and booked is 3. Line 3, left is 1. Line 4, range(1, 1) starts at 1 and stops before 1, so it has no numbers in it. Nothing is printed: the loop body never runs.',
    element: (
      <ContentSlide
        kicker="Exit question"
        title="Why it prints nothing"
        lesson={SESSION}
        lead="Option B. seats is 4 and booked is 3, so range(1, 1) has no numbers in it."
      >
        <VariableTrace code={SEATS_CODE} steps={SEATS_STEPS} location={PY} />
        <StepControls className="mt-4 w-full justify-center" showCount={false} mode="code" />
      </ContentSlide>
    ),
  },

  /* ── Closing frame ───────────────────────────────────────────────── */
  {
    id: 'key-takeaways',
    section: 'Closing',
    label: 'Key Takeaways',
    element: (
      <KeyTakeawaysSlide
        title={SESSION}
        lesson={SESSION}
        points={[
          { text: AGENDA.forLoop, sub: 'Walk through a sequence, one item at a time' },
          { text: AGENDA.range, sub: 'Make a sequence of numbers' },
          { text: AGENDA.star, sub: 'Write it yourself' },
          { text: AGENDA.mistake, sub: 'range stops before its end value' },
        ]}
      />
    ),
  },
  {
    id: 'next-session',
    section: 'Closing',
    label: 'Next Session',
    transition: 'fade',
    element: <SectionBreakerSlide kicker="Next Session" title="String Methods" lesson={SESSION} />,
  },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} /> },
  {
    id: 'thank-you',
    section: 'Closing',
    label: 'Thank you',
    transition: 'zoom',
    element: <ThankYouSlide title="Thank you!" lesson={SESSION} />,
  },
]
