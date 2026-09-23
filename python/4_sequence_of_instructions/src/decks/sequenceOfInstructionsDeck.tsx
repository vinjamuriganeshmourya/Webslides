import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  CodeSyntaxSlide,
  ContentNoteSlide,
  ContentSlide,
  FeedbackSlide,
  KeyTakeawaysSlide,
  PracticeSlide,
  QuestionSlide,
  QuizTimeSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import { CodeBlock, CodeOutput, DataTable, EvalSteps, MonoBadge, VariableTrace } from '@/ui'
import type { CodeOutputPane, TraceStep } from '@/ui'
import { BodmasStrip } from './figures/BodmasStrip'

/**
 * PYTHON · SESSION 4 · "Sequence of Instructions"
 *
 * Converted from `Python_PPT_slide/4_Sequence of Instructions [CQ-Upd.].pptx`
 * under `python/session_plans/4_sequence_of_instructions/plan.md` (signed off
 * 2026-09-22) and the course rules in `python/workflow/skills/python-course/`.
 *
 * The source drew five program traces as 27 consecutive slides. Each program is
 * one `VariableTrace` slide here and its lines are the build steps, in the
 * source's order with the source's values. Every output below came from running
 * the snippet on CPython 3.12.3, except the IndentationError on the Spacing
 * slide, which is the Code Playground's own text as the source shows it.
 */

export const sequenceOfInstructionsMeta: DeckMeta = {
  title: 'Sequence of Instructions',
  course: 'Python',
  lesson: 'Sequence of Instructions',
  presenter: 'NxtWave Instructor',
}

const SESSION = 'Sequence of Instructions'

const AGENDA = {
  variables: 'Variables',
  expressions: 'Expressions',
  order: 'Order of Evaluation',
} as const

const PLAYGROUND = 'Code Playground · main.py'
const run = (code: string, output: string, extra: Partial<CodeOutputPane> = {}): CodeOutputPane => ({ location: PLAYGROUND, code, output, ...extra })

/* ------------------------------------------------------------------ */
/* The traces. `boxes` is the whole state after the line ran.          */
/* ------------------------------------------------------------------ */

const box = (name: string, value: string) => ({ name, value })

const TRACES: { id: string; title: string; code: string; steps: TraceStep[]; question?: boolean }[] = [
  {
    id: 'trace-reassign',
    title: 'Variable Assignment',
    code: 'a = 1\nprint(a)\na = 2\nprint(a)',
    steps: [
      { line: 1, boxes: [box('a', '1')], output: [] },
      { line: 2, boxes: [box('a', '1')], output: ['1'] },
      { line: 3, boxes: [box('a', '2')], output: ['1'] },
      { line: 4, boxes: [box('a', '2')], output: ['1', '2'] },
    ],
  },
  {
    id: 'trace-reassign-first',
    title: 'Variable Assignment',
    code: 'a = 1\na = 2\nprint(a)\nprint(a)',
    question: true,
    steps: [
      { line: 1, boxes: [box('a', '1')], output: [] },
      { line: 2, boxes: [box('a', '2')], output: [] },
      { line: 3, boxes: [box('a', '2')], output: ['2'] },
      { line: 4, boxes: [box('a', '2')], output: ['2', '2'] },
    ],
  },
  {
    id: 'trace-copy',
    title: 'Value in Variable',
    code: 'a = 1\nb = 2\na = b\nprint(a)\nprint(b)',
    steps: [
      { line: 1, boxes: [box('a', '1')], output: [] },
      { line: 2, boxes: [box('a', '1'), box('b', '2')], output: [] },
      { line: 3, boxes: [box('a', '2'), box('b', '2')], output: [] },
      { line: 4, boxes: [box('a', '2'), box('b', '2')], output: ['2'] },
      { line: 5, boxes: [box('a', '2'), box('b', '2')], output: ['2', '2'] },
    ],
  },
  {
    id: 'trace-plus-one',
    title: 'Value in Variable',
    code: 'a = 1\nb = 2\na = b + 1\nprint(a)\nprint(b)',
    steps: [
      { line: 1, boxes: [box('a', '1')], output: [] },
      { line: 2, boxes: [box('a', '1'), box('b', '2')], output: [] },
      { line: 3, boxes: [box('a', '3'), box('b', '2')], output: [] },
      { line: 4, boxes: [box('a', '3'), box('b', '2')], output: ['3'] },
      { line: 5, boxes: [box('a', '3'), box('b', '2')], output: ['3', '2'] },
    ],
  },
  {
    id: 'trace-self',
    title: 'Value in Variable',
    code: 'a = 2\nprint(a)\na = a + 1\nprint(a)',
    steps: [
      { line: 1, boxes: [box('a', '2')], output: [] },
      { line: 2, boxes: [box('a', '2')], output: ['2'] },
      { line: 3, boxes: [box('a', '3')], output: ['2'] },
      { line: 4, boxes: [box('a', '3')], output: ['2', '3'] },
    ],
  },
]

const traceSlide = (t: (typeof TRACES)[number]): SlideDef => ({
  id: t.id,
  section: AGENDA.variables,
  label: t.title,
  element: (
    <ContentSlide kicker={AGENDA.variables} title={t.title} lesson={SESSION}>
      <VariableTrace code={t.code} steps={t.steps} />
    </ContentSlide>
  ),
})

/** The pause before a trace: the source's "What would be the output of the following code?" */
const questionSlide = (t: (typeof TRACES)[number]): SlideDef => ({
  id: `${t.id}-question`,
  section: AGENDA.variables,
  label: `${t.title}, the question`,
  element: (
    <ContentSlide kicker={AGENDA.variables} title={t.title} lesson={SESSION} lead="What would be the output of the following code?">
      <CodeBlock filename={PLAYGROUND} code={t.code} className="mx-auto w-[560px]" />
    </ContentSlide>
  ),
})

/** A BODMAS example: the run beside its rewrite. */
const bodmasSlide = (id: string, code: string, output: string, steps: string[]): SlideDef => ({
  id,
  section: AGENDA.order,
  label: `Order of Operations (BODMAS): ${code}`,
  element: (
    <ContentSlide kicker={AGENDA.order} title="Order of Operations (BODMAS)" lesson={SESSION}>
      <div className="grid grid-cols-[1.3fr_1fr] items-center gap-10">
        <CodeOutput layout="stack" panes={[run(code, output)]} />
        <EvalSteps steps={steps} />
      </div>
    </ContentSlide>
  ),
})

const approachSlide = (n: number, steps: string[]): SlideDef => ({
  id: `approach-${n}`,
  section: AGENDA.order,
  label: `Approach - ${n}`,
  element: (
    <ContentSlide kicker="Order of Operations" title={`Approach - ${n}`} lesson={SESSION}>
      <EvalSteps steps={steps} />
    </ContentSlide>
  ),
})

/* From session 3, verbatim: the recap repeats the summary table. */
const SUMMARY_COLUMNS = [{ label: 'Data type' }, { label: 'Definition', weight: 2 }, { label: 'Additional Examples', weight: 1.4 }]
const SUMMARY_ROWS = [
  ['String', 'Stream of characters (Including space, numerical digits and special characters)', '"Book", "423", etc..'],
  ['Integer', '…-3, -2, -1, 0, +1, +2, +3,...', '0, 124, -3333, 12131210, etc...'],
  ['Float', 'Numbers with a Decimal Point', '24.3, 345.210, -321.86, etc...'],
  ['Boolean', 'True/False options', 'True, False'],
]

const EXPRESSIONS_CODE = 'a = 2 + 3\nb = 3 * 2\nc = a + b\nprint(a)\nprint(b)\nprint(c)'

export const sequenceOfInstructionsDeck: SlideDef[] = [
  /* ── Front frame and recap ───────────────────────────────────────── */
  { id: 'brand', section: 'Opening', label: 'Welcome', element: <BrandSlide greeting="Welcome!" lesson={SESSION} /> },
  { id: 'session-name', section: 'Opening', label: 'Session name', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  {
    id: 'recap-variable',
    section: 'Recap',
    label: 'Recap: Variable',
    element: <ContentSlide kicker="Recap" title="Variable" lesson={SESSION} points={[{ text: 'Variables are like containers for storing values', icon: 'database' }]} />,
  },
  {
    id: 'recap-value-data',
    section: 'Recap',
    label: 'Recap: Value - Data',
    element: <ContentSlide kicker="Recap" title="Value - Data" lesson={SESSION} points={[{ text: 'Every value is a type of data', icon: 'info' }]} />,
  },
  {
    id: 'recap-data-types',
    section: 'Recap',
    label: 'Recap: Data Types',
    element: (
      <ContentSlide
        kicker="Recap"
        title="Data Types"
        lesson={SESSION}
        lead="Some commonly used data types"
        points={[
          { text: 'String', icon: 'chat' },
          { text: 'Integer', icon: 'target' },
          { text: 'Float', icon: 'bolt' },
          { text: 'Boolean', icon: 'check' },
        ]}
      />
    ),
  },
  {
    id: 'recap-summary',
    section: 'Recap',
    label: 'Recap: Variables and Data types',
    element: (
      <ContentSlide kicker="Recap" title="Variables and Data types" lesson={SESSION}>
        <DataTable columns={SUMMARY_COLUMNS} rows={SUMMARY_ROWS} className="mx-auto w-[1080px]" />
      </ContentSlide>
    ),
  },
  {
    id: 'recap-assigning',
    section: 'Recap',
    label: 'Recap: Assigning Value to a Variable',
    element: (
      <CodeSyntaxSlide
        kicker="Recap"
        title="Assigning Value to a Variable"
        lesson={SESSION}
        lead="Assigning an integer value 10 to a variable age"
        language="python"
        parts={[
          { token: 'age', label: 'Variable Name', fill: 'placeholder', after: ' ' },
          { token: '=', label: 'Assignment Operator', after: ' ' },
          { token: '10', label: 'Value', fill: 'placeholder' },
        ]}
      />
    ),
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        kicker="Agenda"
        title="Agenda for Today's Session"
        lesson={SESSION}
        items={[
          { title: AGENDA.variables, sub: 'Printing and Assignment' },
          { title: AGENDA.expressions, sub: 'Values, variables and operators together' },
          { title: AGENDA.order, sub: 'BODMAS' },
        ]}
      />
    ),
  },

  /* ── Concept 1: Variables ────────────────────────────────────────── */
  { id: 'variables-divider', section: AGENDA.variables, label: 'Divider', element: <SectionBreakerSlide index={1} title={AGENDA.variables} subtitle="Printing and Assignment" lesson={SESSION} /> },
  {
    id: 'program',
    section: AGENDA.variables,
    label: 'Sequence of Instructions',
    element: <ContentSlide kicker="Program" title="Sequence of Instructions" lesson={SESSION} points={[{ text: 'A program is a sequence of instructions to a computer', icon: 'route' }]} />,
  },
  {
    id: 'defining-a-variable',
    section: AGENDA.variables,
    label: 'Defining a variable',
    element: (
      <ContentSlide
        kicker={AGENDA.variables}
        title="Defining a variable"
        lesson={SESSION}
        lead="A variable gets created when you assign a value to it for the first time"
      >
        <VariableTrace code={'age = 10\nprint(age)'} steps={[{ line: 1, boxes: [box('age', '10')], output: [] }]} />
      </ContentSlide>
    ),
  },
  {
    id: 'printing-a-variable',
    section: AGENDA.variables,
    label: 'Printing Value in a Variable',
    element: (
      <ContentSlide kicker={AGENDA.variables} title="Printing Value in a Variable" lesson={SESSION}>
        <VariableTrace
          code={'age = 10\nprint(age)'}
          steps={[
            { line: 1, boxes: [box('age', '10')], output: [] },
            { line: 2, boxes: [box('age', '10')], output: ['10'] },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'common-mistakes',
    section: AGENDA.variables,
    label: 'Common Mistakes & Errors',
    element: (
      <ContentSlide
        kicker="Common Mistakes"
        title="Common Mistakes & Errors"
        lesson={SESSION}
        points={[{ text: "Let's look into common mistakes and errors we face while programming", icon: 'warning' }]}
      />
    ),
  },
  {
    id: 'printing-values',
    section: AGENDA.variables,
    label: 'Printing Values in Variables',
    element: (
      <ContentSlide kicker="Common Mistakes" title="Printing Values in Variables" lesson={SESSION}>
        <CodeOutput panes={[run('age = 10\nprint(age)', '10'), run('age = 10\nprint("age")', 'age')]} />
      </ContentSlide>
    ),
  },
  {
    id: 'order-question',
    section: AGENDA.variables,
    label: 'Order of Instructions',
    element: (
      <ContentSlide kicker="Common Mistakes" title="Order of Instructions" lesson={SESSION} lead="What happens when print comes before the assignment?">
        <CodeBlock filename={PLAYGROUND} code={'print(age)\nage = 10'} className="mx-auto w-[560px]" />
      </ContentSlide>
    ),
  },
  {
    id: 'order-error',
    section: AGENDA.variables,
    label: 'Order of Instructions, the error',
    element: (
      <ContentSlide
        kicker="Common Mistakes"
        title="Order of Instructions"
        lesson={SESSION}
        points={[
          { text: 'Python executes the code line-by-line', icon: 'route' },
          { text: "Variable 'age' is not created by the time we tried to print", icon: 'warning' },
        ]}
      >
        <CodeOutput
          layout="stack"
          outputFontSize={14}
          panes={[
            run(
              'print(age)\nage = 10',
              'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\n    print(age)\n          ^^^\nNameError: name \'age\' is not defined',
              { kind: 'error' },
            ),
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'spacing',
    section: AGENDA.variables,
    label: 'Spacing in Python',
    element: (
      <ContentSlide
        kicker="Common Mistakes"
        title="Spacing in Python"
        lesson={SESSION}
        points={[{ text: 'Having spaces at the beginning of line causes errors', icon: 'warning' }]}
      >
        <CodeBlock filename={PLAYGROUND} code={'age = 10\n print(age)'} highlight={[2]} />
      </ContentSlide>
    ),
  },
  {
    id: 'spacing-error',
    section: AGENDA.variables,
    label: 'Spacing in Python, the error',
    notes:
      'The output is the Code Playground\'s own text as the source shows it, caret line included. CPython 3.12 prints the same error without the caret line.',
    element: (
      <ContentSlide kicker="Common Mistakes" title="Spacing in Python" lesson={SESSION} lead="Error displayed in our code playground">
        <CodeOutput
          layout="stack"
          panes={[run('age = 10\n print(age)', '  File "main.py", line 2\n    print(age)\n    ^\nIndentationError: unexpected indent', { kind: 'error' })]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'values-change',
    section: AGENDA.variables,
    label: 'Values can be changed',
    element: <ContentSlide kicker="Variables and Data types" title="Variable" lesson={SESSION} points={[{ text: 'Values in the variables can be changed', icon: 'arrow' }]} />,
  },
  ...TRACES.flatMap((t) => (t.question ? [questionSlide(t), traceSlide(t)] : [traceSlide(t)])),
  {
    id: 'quiz-1',
    section: AGENDA.variables,
    label: 'Quiz Time!',
    transition: 'zoom',
    element: <QuizTimeSlide lesson={SESSION} subtitle="Five short programs, one variable box, and the line that ran before its variable existed" />,
  },

  /* ── Concept 2: Expressions ──────────────────────────────────────── */
  { id: 'expressions-divider', section: AGENDA.expressions, label: 'Divider', element: <SectionBreakerSlide index={2} title={AGENDA.expressions} lesson={SESSION} /> },
  {
    id: 'expressions',
    section: AGENDA.expressions,
    label: 'Expressions in Python',
    element: (
      <ContentSlide
        kicker={AGENDA.expressions}
        title="Expressions in Python"
        lesson={SESSION}
        points={[{ text: 'Expression is a valid combination of values, variables and operators', icon: 'code' }]}
      >
        <div className="flex flex-col items-start gap-4">
          {['a * b', 'a + 2', '5 * 2 + 3 * 4'].map((e) => (
            <span key={e} className="flex items-center gap-4">
              <MonoBadge>{e}</MonoBadge>
              <span className="text-body-sm font-semibold uppercase tracking-wider text-body">Expression</span>
            </span>
          ))}
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'expressions-code',
    section: AGENDA.expressions,
    label: 'Expressions',
    element: (
      <ContentSlide
        kicker={AGENDA.expressions}
        title="Expressions"
        lesson={SESSION}
        points={[{ text: 'The right-hand side of each assignment is an Expression', icon: 'code' }]}
      >
        <CodeBlock filename={PLAYGROUND} code={EXPRESSIONS_CODE} highlight={[1, 2, 3]} />
      </ContentSlide>
    ),
  },
  {
    id: 'expressions-output',
    section: AGENDA.expressions,
    label: 'Expressions, the output',
    element: (
      <ContentSlide kicker={AGENDA.expressions} title="Expressions" lesson={SESSION}>
        <CodeOutput panes={[run(EXPRESSIONS_CODE, '5\n6\n11', { showLineNumbers: true })]} />
      </ContentSlide>
    ),
  },

  /* ── Concept 3: Order of Evaluation ──────────────────────────────── */
  { id: 'order-divider', section: AGENDA.order, label: 'Divider', element: <SectionBreakerSlide index={3} title={AGENDA.order} subtitle="BODMAS" lesson={SESSION} /> },
  {
    id: 'ways-to-evaluate',
    section: AGENDA.order,
    label: 'Different ways to evaluate',
    element: <QuestionSlide kicker="Order of Operations" question="What are the different possible ways to evaluate this expression?" qualifier="5 * 2 + 3 * 4" lesson={SESSION} />,
  },
  approachSlide(1, ['5 * 2 + 3 * 4', '10 + 12', '22']),
  approachSlide(2, ['5 * 2 + 3 * 4', '5 * 5 * 4', '25 * 4', '100']),
  approachSlide(3, ['5 * 2 + 3 * 4', '5 * 2 + 12', '5 * 14', '70']),
  {
    id: 'standard-order',
    section: AGENDA.order,
    label: 'Is there a standard order?',
    element: <QuestionSlide kicker="Order of Operations" question="Is there any standard order for evaluating this?" qualifier="5 * 2 + 3 * 4" lesson={SESSION} />,
  },
  {
    id: 'bodmas',
    section: AGENDA.order,
    label: 'Ordering Mathematical Operations',
    element: (
      <ContentSlide kicker="Order of Operations" title="Ordering Mathematical Operations" lesson={SESSION}>
        <BodmasStrip />
      </ContentSlide>
    ),
  },
  {
    id: 'bodmas-applied',
    section: AGENDA.order,
    label: 'Order of Operations',
    element: (
      <ContentSlide kicker={AGENDA.order} title="Order of Operations" lesson={SESSION}>
        <div className="grid grid-cols-[1fr_1fr] items-center gap-10">
          <EvalSteps steps={['5 * 2 + 3 * 4', '10 + 12', '22']} />
          <BodmasStrip size="sm" lit={['M', 'A']} />
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'best-practice',
    section: AGENDA.order,
    label: 'Best Practice',
    element: (
      <ContentNoteSlide
        kicker={AGENDA.order}
        title="Best Practice"
        lesson={SESSION}
        noteFirst
        note={{ kind: 'tip', body: 'Use braces for better readability' }}
      >
        <MonoBadge size="lg">(5 * 2) + (3 * 4)</MonoBadge>
      </ContentNoteSlide>
    ),
  },
  bodmasSlide('bodmas-1', 'print(10 / 2 + 3)', '8.0', ['10 / 2 + 3', '5.0 + 3', '8.0']),
  bodmasSlide('bodmas-2', 'print(10 / (2 + 3))', '2.0', ['10 / (2 + 3)', '10 / 5', '2.0']),

  /* ── Closing frame ───────────────────────────────────────────────── */
  {
    id: 'quiz-2',
    section: 'Closing',
    label: 'Quiz Time!',
    transition: 'zoom',
    element: <QuizTimeSlide lesson={SESSION} subtitle="Printing and assigning, two common mistakes, expressions, and BODMAS" />,
  },
  {
    id: 'key-takeaways',
    section: 'Closing',
    label: 'Key Takeaways',
    element: (
      <KeyTakeawaysSlide
        title={SESSION}
        lesson={SESSION}
        points={[
          { text: AGENDA.variables, sub: 'Printing, Assigning · Common Mistakes · Spacing in Python' },
          { text: AGENDA.expressions },
          { text: AGENDA.order, sub: 'BODMAS' },
        ]}
      />
    ),
  },
  {
    id: 'practice',
    section: 'Closing',
    label: 'Practice',
    transition: 'rise',
    element: (
      <PracticeSlide
        title="Practice"
        prompt="Trace this program on paper, then run it in the Code Playground"
        lesson={SESSION}
        tasks={[
          { text: 'a = 5, then b = a + 2, then a = b * 2', sub: 'Write the value in each box after every line' },
          { text: 'print(a) and print(b)', sub: 'Say the two numbers before you click Run Code' },
          { text: 'Add brackets to 10 / 2 + 3 to make it print 2.0', sub: 'BODMAS tells you where they go' },
        ]}
      />
    ),
  },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} /> },
  { id: 'next-session', section: 'Closing', label: 'Next Session', element: <SectionBreakerSlide kicker="Next Session" title="Input and Output Basics" lesson={SESSION} /> },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" message="All the best" lesson={SESSION} /> },
]
