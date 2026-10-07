import type { DeckMeta, SlideDef } from '@/deck/types'
import { AgendaSlide, BrandSlide, ContentSlide, FeedbackSlide, QuizTimeSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { Callout, CodeBlock } from '@/ui'
import { StepControls } from './figures/controls'
import { CenteredLead, Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { FlipCards } from './figures/FlipCards'
import { CricketHook } from './figures/CricketHook'
import { TwoOversWalk } from './figures/TwoOversWalk'
import { NestedTrace } from './figures/NestedTrace'
import { LoopMachine, levelOf, reason, useMachineBeats, type Level } from './figures/LoopMachine'
import { IoPanels } from './figures/IoPanels'
import { SolveFirst } from './figures/Tasks'
import { PlaygroundStory } from './figures/PlaygroundStory'
import { LineByLine } from './figures/LineByLine'
import { TwoPrograms } from './figures/TwoPrograms'
import { ExitVote, Takeaways } from './figures/Closing'

/**
 * PYTHON · "Nested Loops" (Programming Foundations, session 16)
 *
 * Built from `Outputs/python/session_plans/16_nested_loops/plan.md`, signed off
 * 2026-10-01. The short form:
 *
 * ONE SLIDE PER REFERENCE FRAME. The source is the pedagogy team's lesson plan,
 * `prog_foundations_LP/16 - Nested Loops`, final cut, 23 frames and 109
 * presenter states. All 23 are here, in its order. Nothing added, nothing
 * dropped.
 *
 * THE COPY IS THE REFERENCE'S, captured from the rendered page at every press
 * (course rule R2). Content rule 36 is applied to every line (no trailing
 * full stop, one sentence per line). ONE sentence changes, for content rule
 * 2b, on slide 15 beat 2; it says so where it sits.
 *
 * EVERY CODE PANEL SAYS `Python` (content rule 31). The drawn Code Playground
 * on slide 15 keeps its own `main.py` tab, because the picture is of the portal.
 *
 * EVERY OUTPUT IS A REAL RUN on CPython 3.12.3 (course rule R3); the plan's
 * output table lists them.
 *
 * THE REFERENCE'S CONTROLS STAY. Its `Next` beats are the kit's build steps;
 * slide 8's is labelled `One step`. `Turn it over` on slide 3 flips one card
 * per press (local state). On slides 9, 19 and 20 the reference's options are
 * static text and `Next` runs regardless; here they are clickable so the vote
 * is locked in and the confetti can fire, and `Next` is still not gated.
 */

export const nestedLoopsMeta: DeckMeta = {
  title: 'Nested Loops',
  course: 'Python',
  lesson: 'Nested Loops',
  presenter: 'NxtWave Instructor',
}

const SESSION = 'Nested Loops'

/** The four agenda items, word for word from the reference. */
const AGENDA = [
  { title: 'A Loop Inside a Loop', sub: 'What a nested loop is' },
  { title: 'How It Runs', sub: 'Follow the code, line by line' },
  { title: 'The Number Triangle', sub: 'A question you solve' },
  { title: 'Common Mistakes', sub: 'Where a range goes wrong' },
]

/* ------------------------------------------------------------ machines */

const LEVELS: Level[] = [
  {
    tag: 'Level 1 of 4',
    code: 'for i in range(3):\n    for j in range(4):\n        print(i, j)',
    rows: 4,
    question: 'How many lines does it print?',
    options: ['7', '12', '3', '4'],
    right: 1,
    passes: [0, 1, 2].map((i) => ({ label: `i = ${i}`, marks: ['dot', 'dot', 'dot', 'dot'] })),
    total: '12 lines',
    reasons: [reason('7', '7 adds 3 and 4. The inner loop runs 4 times on every pass, so it is 3 times 4'), reason('3', '3 is only the outer loop'), reason('4', '4 is only one pass of the inner loop')],
  },
  {
    tag: 'Level 2 of 4',
    code: 'for i in range(2):\n    print("row")\n    for j in range(3):\n        print("*")',
    rows: 4,
    question: 'How many lines does it print?',
    options: ['6', '5', '8', '2'],
    right: 2,
    passes: [0, 1].map((i) => ({ label: `i = ${i}`, marks: ['row', 'dot', 'dot', 'dot'] })),
    total: '8 lines',
    legend: ['row', 'a star'],
    reasons: [reason('6', '6 counts the stars and forgets the two row lines'), reason('5', '5 adds 2 and 3'), reason('2', '2 is only the row lines')],
  },
  {
    tag: 'Level 3 of 4',
    code: 'for i in range(4):\n    for j in range(i, 3):\n        print(j)',
    rows: 4,
    question: 'How many lines does it print?',
    options: ['12', '9', '6', '4'],
    right: 2,
    passes: [
      { label: 'i = 0', marks: ['dot', 'dot', 'dot'] },
      { label: 'i = 1', marks: ['dot', 'dot'] },
      { label: 'i = 2', marks: ['dot'] },
      { label: 'i = 3', marks: ['nothing'] },
    ],
    total: '6 lines',
    reasons: [reason('12', '12 is 4 times 3, but the inner range gets shorter every pass'), reason('9', '9 forgets that range(3, 3) is empty'), reason('4', '4 is only the outer loop')],
  },
  {
    tag: 'Level 4 of 4',
    code: 'for i in range(3):\n    for j in range(2):\n        print("*")\n    print("done")',
    rows: 4,
    question: 'How many times does done print?',
    options: ['1', '6', '3', '2'],
    right: 2,
    passes: [0, 1, 2].map((i) => ({ label: `i = ${i}`, marks: ['dot', 'dot', 'done'] })),
    total: '3 times',
    legend: ['done', 'a star'],
    reasons: [reason('1', '1 would be right if done sat at the left edge, after both loops'), reason('6', '6 would be right if done sat under the inner loop'), reason('2', "2 is the inner loop's count")],
  },
]

const PROGRAMS: Level[] = [
  {
    tag: 'Program 1 of 3',
    title: 'A while loop inside a for loop',
    code: 'for i in range(3):\n    j = 0\n    while j < 2:\n        print("*")\n        j = j + 1',
    rows: 7,
    question: 'How many stars?',
    options: ['6', '3', '2', '5'],
    right: 0,
    passes: [0, 1, 2].map((i) => ({ label: `i = ${i}`, marks: ['dot', 'dot'] })),
    total: '6 stars',
    reasons: [reason('3', '3 is only the outer loop'), reason('2', '2 is only one pass of the while loop'), reason('5', '5 adds 3 and 2. The while loop runs twice on every pass: 3 times 2')],
  },
  {
    tag: 'Program 2 of 3',
    title: 'A for loop inside a while loop',
    code: 'i = 0\nwhile i < 2:\n    for j in range(3):\n        print("*")\n    i = i + 1',
    rows: 7,
    question: 'How many stars?',
    options: ['5', '6', '3', '2'],
    right: 1,
    passes: [0, 1].map((i) => ({ label: `i = ${i}`, marks: ['dot', 'dot', 'dot'] })),
    total: '6 stars',
    reasons: [reason('5', '5 adds 2 and 3'), reason('3', '3 is only one pass of the for loop'), reason('2', '2 is only the while loop')],
  },
  {
    tag: 'Program 3 of 3',
    title: 'A while loop inside a while loop',
    code: 'i = 0\nj = 0\nwhile i < 3:\n    while j < 2:\n        print("*")\n        j = j + 1\n    i = i + 1',
    rows: 7,
    question: 'How many stars?',
    options: ['6', '2', '3', '0'],
    right: 1,
    passes: [
      { label: 'i = 0', marks: ['dot', 'dot'] },
      { label: 'i = 1', marks: ['nothing'] },
      { label: 'i = 2', marks: ['nothing'] },
    ],
    total: '2 stars',
    reasons: [reason('6', '6 would be right if j = 0 sat inside the outer loop. Here j stays 2'), reason('3', '3 is only the outer loop'), reason('0', '0 forgets that j starts at 0, so the first pass does run')],
  },
]

/** Slide 9: the machine's beats are the slide's build steps. */
function HowManyTimes() {
  const at = useMachineBeats(LEVELS)
  return (
    <Panel kicker="Predict, then run" title="How many times does it run?" lesson={SESSION}>
      <LoopMachine levels={LEVELS} at={at} />
      <StepControls at={at} total={LEVELS.length * 2} />
    </Panel>
  )
}

/** Slide 19: the title changes with the program, so the slide owns the beat. */
function AnyLoop() {
  const at = useMachineBeats(PROGRAMS)
  const L = PROGRAMS[Math.min(levelOf(at), PROGRAMS.length - 1)]
  return (
    <Panel kicker="Any loop inside any loop" title={L.title ?? ''} lesson={SESSION}>
      <LoopMachine levels={PROGRAMS} at={at} />
      <StepControls at={at} total={PROGRAMS.length * 2} />
    </Panel>
  )
}

/* ------------------------------------------------------------------ deck */

const TRI_3 = '1 \n1 2 \n1 2 3 '
const TRI_4 = TRI_3 + '\n1 2 3 4 '
const TRI_5 = TRI_4 + '\n1 2 3 4 5 '

export const nestedLoopsDeck: SlideDef[] = [
  /* ── 1 ───────────────────────────────────────────────────────────── */
  { id: 'welcome', label: 'Welcome', transition: 'fade', element: <BrandSlide greeting="Welcome" lesson={SESSION} /> },

  /* ── 2, 3 · Recap ────────────────────────────────────────────────── */
  {
    id: 'recap',
    section: 'Recap',
    label: 'Where We Left Off',
    /* the kit's recap, with the brand header every other slide has (review, 2026-10-01) */
    element: (
      <RecapBrand
        lesson={SESSION}
        immediate
        title="Where We Left Off"
        points={[
          { text: 'Slicing takes a part of a string', sub: 'message[start:end:step] stops before end' },
          { text: 'String methods do ready made jobs', sub: 'isdigit, strip, replace, startswith and upper' },
          { text: 'strip only touches the two ends', sub: 'The characters in the middle stay' },
        ]}
      />
    ),
  },
  {
    id: 'recap-cards',
    section: 'Recap',
    label: 'Recap of string methods',
    notes: 'Say your answer first. Then we turn the card over. One press per card.',
    element: (
      <Panel kicker="Recap" title="Recap of string methods" lead={<>Say your answer first. Then we turn the card over.</>} lesson={SESSION}>
        <FlipCards
          cards={[
            { question: <>What does <code>"-R-a-v-i-"[1:8:2]</code> give?</>, answer: "'Ravi'", why: 'Start at 1, jump by 2, stop before 8' },
            { question: <>What does <code>"98.5".isdigit()</code> give?</>, answer: 'False', why: 'The dot is not a digit, so the answer is False' },
            { question: <>What does <code>"ravi".upper()</code> give?</>, answer: "'RAVI'", why: 'upper gives back a new string in capital letters' },
          ]}
        />
      </Panel>
    ),
  },

  /* ── 4 · Hook ────────────────────────────────────────────────────── */
  {
    id: 'every-ball-has-a-number',
    section: 'Hook',
    label: 'Every ball has a number',
    notes:
      'Twenty presses. Beat 12 and beat 18 are the two guesses: take answers from the room before pressing. The word nested is not on this frame; the shape arrives on beat 20.',
    element: (
      <Panel kicker="Programming Foundations" title="Every ball has a number" lesson={SESSION}>
        <CricketHook />
      </Panel>
    ),
  },

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: 'Nested Loops', transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  { id: 'agenda', section: 'Today', label: 'What We Will Cover', element: <AgendaSlide kicker="Agenda" title="What We Will Cover" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 to 9 · A loop inside a loop, and how it runs ─────────────── */
  {
    id: 'follow-the-code',
    section: AGENDA[0].title,
    label: 'Follow the code: two overs',
    notes: 'Each press runs one print line. Beat 11 is the one that matters: over moves on while ball still says 6, then line 3 starts ball again.',
    element: (
      <Panel kicker="Code walkthrough" title="Follow the code: two overs" lesson={SESSION}>
        <TwoOversWalk />
      </Panel>
    ),
  },
  {
    id: 'task-1',
    section: AGENDA[1].title,
    label: 'Trace it: the inner range uses i',
    notes: 'Worksheet task 1. Five minutes on the timer, keyboards off. Then One step per line: 6 prints, line 3 runs 6 times.',
    element: (
      <Panel kicker="Worksheet · Task 1" title="Trace it: the inner range uses i" lesson={SESSION}>
        <NestedTrace />
      </Panel>
    ),
  },
  {
    id: 'how-many-times',
    section: AGENDA[1].title,
    label: 'How many times does it run?',
    notes: 'Hands up for A, B, C, D before each run. Level 3 is the one that catches the room: range(3, 3) is empty.',
    element: <HowManyTimes />,
  },

  /* ── 10 · Quiz ───────────────────────────────────────────────────── */
  {
    id: 'classroom-quiz',
    section: 'Quiz',
    label: 'Classroom Quiz',
    transition: 'zoom',
    /* The reference's quiz frame, in its own design (course rules R2, R5d), as
       session 15 recorded: its sentence names no topic, so content rule 28's
       reason does not apply. */
    element: <QuizTimeSlide lesson={SESSION} kicker="Quiz time" title="Classroom Quiz" subtitle="Time to check what you have learned so far." steps={['Open the quiz on your portal', 'Answer every question on your own', 'We go through the answers together']} />,
  },

  /* ── 11 to 17 · The number triangle ──────────────────────────────── */
  {
    id: 'triangular-pattern',
    section: AGENDA[2].title,
    label: 'Triangular Pattern with Numbers',
    element: (
      <ContentSlide kicker="Question" title="Triangular Pattern with Numbers" lesson={SESSION}>
        <CenteredLead>Write a program to print a triangle of numbers in N rows. The number N is the input.</CenteredLead>
        <IoPanels row className="justify-center" panels={[{ label: 'Input', text: '4' }, { label: 'Output', text: TRI_4 }]} />
      </ContentSlide>
    ),
  },
  {
    id: 'input-format',
    section: AGENDA[2].title,
    label: 'Input Format',
    element: (
      <ContentSlide kicker="Question" title="Input Format" lesson={SESSION}>
        <CenteredLead>The first line has a positive integer.</CenteredLead>
        <IoPanels row className="justify-center" panels={[{ label: 'Input', text: '3' }, { label: 'Output', text: TRI_3 }]} />
      </ContentSlide>
    ),
  },
  {
    id: 'output-format',
    section: AGENDA[2].title,
    label: 'Output Format',
    element: (
      <ContentSlide kicker="Question" title="Output Format" lesson={SESSION}>
        <CenteredLead>Print a triangle of numbers. There is a space after every number.</CenteredLead>
        <div className="flex items-center justify-center gap-10">
          <IoPanels row panels={[{ label: 'Input', text: '5' }, { label: 'Output', text: TRI_5 }]} />
          <div className="w-[360px]">
            <Callout kind="info" title="Note" asStep={false}>
              Every number is followed by a space, <b>even the last one</b> in a row
            </Callout>
          </div>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'solve-it-yourself',
    section: AGENDA[2].title,
    label: 'Solve it yourself first',
    notes: 'Five minutes. The room writes the program before seeing any solution. Run with 3, then 4.',
    element: (
      <Panel kicker="Your turn" title="Solve it yourself first" lesson={SESSION} mode="center">
        <SolveFirst />
      </Panel>
    ),
  },
  {
    id: 'why-a-loop-inside-a-loop',
    section: AGENDA[2].title,
    label: 'Why a loop inside a loop?',
    notes: 'Five beats. Beat 4, what it costs, is the one that must not be skipped: 100 print lines and 5,050 numbers for N = 100.',
    element: (
      <Panel kicker="The solution" title="Why a loop inside a loop?" lesson={SESSION}>
        <PlaygroundStory />
      </Panel>
    ),
  },
  {
    id: 'writing-it',
    section: AGENDA[2].title,
    label: 'Writing it, one line at a time',
    element: (
      <Panel kicker="The solution" title="Writing it, one line at a time" lesson={SESSION}>
        <LineByLine />
      </Panel>
    ),
  },
  {
    id: 'task-2',
    section: AGENDA[3].title,
    label: 'Predict, then run',
    notes: 'Worksheet task 2. Four minutes. Both programs get 3. Program A loses a row; program B starts every row at 0.',
    /* Kicker "Worksheet Task-2", and the brief without its heading: review, 2026-10-01. */
    element: (
      <Panel kicker="Worksheet Task-2" title="Predict, then run" lesson={SESSION}>
        <TwoPrograms />
      </Panel>
    ),
  },

  /* ── 18 to 20 · Common mistakes ──────────────────────────────────── */
  {
    id: 'wrong-iteration',
    section: AGENDA[3].title,
    label: 'Wrong Iteration',
    element: (
      <ContentSlide kicker="Possible mistakes" title="Wrong Iteration" lesson={SESSION}>
        <CenteredLead>The input is 3, but only two rows come out.</CenteredLead>
        <div className="flex items-start justify-center gap-8">
          <div className="w-[640px]">
            <CodeBlock
              code={'num = int(input())\nfor row_num in range(1, num):\n    row_out = ""\n    for seq_num in range(1, row_num + 1):\n        row_out = row_out + str(seq_num) + " "\n    print(row_out)'}
              filename="Python"
              chip={false}
              fontSize={17}
              lines={{ 2: 'error' }}
            />
          </div>
          <IoPanels panels={[{ label: 'Input', text: '3' }, { label: 'Output', text: '1 \n1 2 ' }]} />
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'any-loop-inside-any-loop',
    section: AGENDA[3].title,
    label: 'Any loop inside any loop',
    notes: 'Three programs, hands up before each run. Program 3 is the catch: j is never reset, so the inner while runs only on the first pass.',
    element: <AnyLoop />,
  },
  {
    id: 'exit-question',
    section: AGENDA[3].title,
    label: 'Which input prints 12 lines?',
    notes: 'Two and a half minutes. Hands up for A to D, then press. B: range(1, 3) is two overs of six balls.',
    element: (
      <Panel kicker="Exit question" title="Which input prints 12 lines?" lead={<>A highlights app prints one line for every ball it shows.</>} lesson={SESSION}>
        <ExitVote />
      </Panel>
    ),
  },

  /* ── 21 · Key takeaways ──────────────────────────────────────────── */
  {
    id: 'takeaways',
    section: 'Key takeaways',
    label: 'Nested loops, in six examples',
    element: (
      <Panel kicker="Key takeaways" title="Nested loops, in six examples" lesson={SESSION}>
        <Takeaways />
      </Panel>
    ),
  },

  /* ── 22, 23 · Close ──────────────────────────────────────────────── */
  { id: 'feedback', section: 'Close', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} title="We’d love your feedback" /> },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
