import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  CodeSyntaxSlide,
  ContentSlide,
  KeyTakeawaysSlide,
  PracticeSlide,
  QuizTimeSlide,
  RecapSlide,
  SectionBreakerSlide,
  StatusPointsSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import { DataTable, MonoBadge, ValueTypeMap } from '@/ui'
import { ApplicationForm, FILLED } from './figures/ApplicationForm'

/**
 * PYTHON · SESSION 3 · "Variables and Data Types"
 *
 * Converted from `Python_PPT_slide/3_Variables and Data Types.pptx` under
 * `python/session_plans/3_variables_and_data_types/plan.md` (signed off
 * 2026-09-22) and the course rules in `python/workflow/skills/python-course/`.
 * The source sentences are the copy; the analogy (a sports club announcement,
 * an application form, the four answers on it) is kept exactly, and the form is
 * the one figure this session draws.
 */

export const variablesAndDataTypesMeta: DeckMeta = {
  title: 'Variables and Data Types',
  course: 'Python',
  lesson: 'Variables and Data Types',
  presenter: 'NxtWave Instructor',
}

const SESSION = 'Variables and Data Types'

const AGENDA = {
  variables: 'Variables',
  types: 'Data Types',
  assign: 'Assignment Operator',
} as const

/** The source's Summary table, verbatim. Session 4 repeats it in its recap. */
export const SUMMARY_COLUMNS = [{ label: 'Data type' }, { label: 'Definition', weight: 2 }, { label: 'Additional Examples', weight: 1.4 }]
export const SUMMARY_ROWS = [
  ['String', 'Stream of characters (Including space, numerical digits & special characters)', '"Book", "423", etc..'],
  ['Integer', '…-3, -2, -1, 0, +1, +2, +3,...', '0, 124, -3333, 12131210, etc...'],
  ['Float', 'Numbers with a Decimal Point', '24.3, 345.210, -321.86, etc...'],
  ['Boolean', 'True/False options', 'True, False'],
]

const STRING_EXAMPLES = ['"Hello World!"', '"Book"', '"1234"', '"some@example.com"', '"sfgawqhk#$542"', '"Bread, Jam and Milk"']

/** The form with one answer tagged: the source's "Data Type" slides. */
const formSlide = (id: string, title: string, tags: Parameters<typeof ApplicationForm>[0]['tags']): SlideDef => ({
  id,
  section: AGENDA.types,
  label: title,
  element: (
    <ContentSlide kicker={AGENDA.types} title={title} lesson={SESSION}>
      <ApplicationForm values={FILLED} tags={tags} />
    </ContentSlide>
  ),
})

export const variablesAndDataTypesDeck: SlideDef[] = [
  /* ── Front frame ─────────────────────────────────────────────────── */
  { id: 'brand', section: 'Opening', label: 'Welcome', element: <BrandSlide greeting="Welcome!" lesson={SESSION} /> },
  { id: 'session-name', section: 'Opening', label: 'Session name', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  {
    id: 'recap',
    section: 'Opening',
    label: 'Recap',
    element: (
      <RecapSlide
        kicker="Recap"
        title="Leveraging Gen AI for Accelerated learning"
        lesson={SESSION}
        points={[
          { text: 'AI-powered Learning', sub: 'Maximize your learning with AI' },
          { text: 'Code Explanation' },
          { text: 'Generation', sub: 'Generating Code · Quiz Generation · Coding Problem Generation' },
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
          { title: AGENDA.variables, sub: 'Containers' },
          { title: AGENDA.types, sub: 'int, float, string, boolean' },
          { title: AGENDA.assign, sub: 'Putting a value into a name' },
        ]}
      />
    ),
  },

  /* ── Concept 1: Variables ────────────────────────────────────────── */
  { id: 'variables-divider', section: AGENDA.variables, label: 'Divider', element: <SectionBreakerSlide index={1} title={AGENDA.variables} subtitle="Containers" lesson={SESSION} /> },
  {
    id: 'scenario',
    section: AGENDA.variables,
    label: 'Announcement from Sports Club',
    element: (
      <ContentSlide
        kicker="Scenario"
        title="Announcement from Sports Club"
        lesson={SESSION}
        points={[
          {
            text: "'We are conducting a sports meet on the eve of New Year's day. Those who want to participate, please fill in the application form provided'",
            icon: 'chat',
          },
        ]}
      />
    ),
  },
  {
    id: 'form-empty',
    section: AGENDA.variables,
    label: 'Application Form',
    element: (
      <ContentSlide kicker="Announcement" title="Application Form" lesson={SESSION}>
        <ApplicationForm />
      </ContentSlide>
    ),
  },
  {
    id: 'form-filled',
    section: AGENDA.variables,
    label: 'Application Form, filled',
    element: (
      <ContentSlide kicker="Announcement" title="Application Form" lesson={SESSION}>
        <ApplicationForm values={FILLED} />
      </ContentSlide>
    ),
  },
  {
    id: 'variable-names',
    section: AGENDA.variables,
    label: 'Names and Values',
    element: (
      <ContentSlide kicker="Announcement" title="Names and Values" lesson={SESSION}>
        <ApplicationForm values={FILLED} columnLabels={{ names: 'Variable Names' }} />
      </ContentSlide>
    ),
  },
  {
    id: 'variable-values',
    section: AGENDA.variables,
    label: 'Names and Values',
    element: (
      <ContentSlide kicker="Announcement" title="Names and Values" lesson={SESSION}>
        <ApplicationForm values={FILLED} columnLabels={{ names: 'Variable Names', values: 'Values stored in variables' }} />
      </ContentSlide>
    ),
  },
  {
    id: 'variable',
    section: AGENDA.variables,
    label: 'Variable',
    element: (
      <ContentSlide
        kicker={AGENDA.variables}
        title="Variable"
        lesson={SESSION}
        points={[{ text: 'Variables are like containers for storing values', icon: 'database' }]}
      />
    ),
  },
  {
    id: 'values-change',
    section: AGENDA.variables,
    label: 'Values can be changed',
    element: (
      <ContentSlide
        kicker={AGENDA.variables}
        title="Variable"
        lesson={SESSION}
        points={[{ text: 'Values in the variables can be changed', icon: 'arrow' }]}
      />
    ),
  },

  /* ── Concept 2: Data Types ───────────────────────────────────────── */
  { id: 'types-divider', section: AGENDA.types, label: 'Divider', element: <SectionBreakerSlide index={2} title={AGENDA.types} subtitle="int, float, string, boolean" lesson={SESSION} /> },
  {
    id: 'value-data',
    section: AGENDA.types,
    label: 'Value - Data',
    element: <ContentSlide kicker={AGENDA.types} title="Value - Data" lesson={SESSION} points={[{ text: 'Every value is a type of data', icon: 'info' }]} />,
  },
  {
    id: 'data-types',
    section: AGENDA.types,
    label: 'Data Types',
    element: (
      <ContentSlide
        kicker={AGENDA.types}
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
  formSlide('form-string', 'Data Types', { sport: 'String' }),
  {
    id: 'string-syntax',
    section: AGENDA.types,
    label: 'String Syntax',
    element: (
      <CodeSyntaxSlide
        kicker={AGENDA.types}
        title="String Syntax"
        lesson={SESSION}
        lead="Stream of characters enclosed within quotes"
        language="python"
        parts={[
          { token: '"', label: 'Opening quote' },
          { token: 'Cricket', label: 'The characters', fill: 'placeholder' },
          { token: '"', label: 'Closing quote' },
        ]}
      />
    ),
  },
  {
    id: 'string-characters',
    section: AGENDA.types,
    label: 'String',
    element: (
      <CodeSyntaxSlide
        kicker={AGENDA.types}
        title="String"
        lesson={SESSION}
        lead="Stream of characters: Capital Letters ( A – Z ), Small Letters ( a – z ), Digits ( 0 – 9 ), Special Characters (~ ! @ # $ % ^ . ?,), Space"
        language="python"
        parts={[
          { token: '"Hello', label: 'Capital and small letters' },
          { token: ' ', label: 'Space', body: 'A space is a character too' },
          { token: 'World', label: 'Letters' },
          { token: '!"', label: 'Special Character', body: '! is a special character' },
        ]}
      />
    ),
  },
  {
    id: 'string-examples',
    section: AGENDA.types,
    label: 'String Examples',
    element: (
      <ContentSlide kicker={AGENDA.types} title="String Examples" lesson={SESSION}>
        <div className="mx-auto grid w-[820px] grid-cols-2 gap-5">
          {STRING_EXAMPLES.map((s) => (
            <MonoBadge key={s} className="justify-center">
              {s}
            </MonoBadge>
          ))}
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'quiz-1',
    section: AGENDA.types,
    label: 'Quiz Time!',
    transition: 'zoom',
    element: <QuizTimeSlide lesson={SESSION} subtitle="Variables, containers, and what makes a value a string" />,
  },
  formSlide('form-integer', 'Data Type', { age: 'Integer' }),
  {
    id: 'integer',
    section: AGENDA.types,
    label: 'Integer',
    element: (
      <ContentSlide
        kicker={AGENDA.types}
        title="Integer"
        lesson={SESSION}
        points={[{ text: 'All numbers (positive and negative) without any fractional part', icon: 'target' }]}
      >
        <MonoBadge>...-3, -2, -1, 0, 1, 2, 3,...</MonoBadge>
      </ContentSlide>
    ),
  },
  {
    id: 'two-vs-two',
    section: AGENDA.types,
    label: '2 vs "2"',
    element: (
      <ContentSlide kicker={AGENDA.types} title={'2 vs "2"'} lesson={SESSION} lead="Mathematical Value vs Character">
        <ValueTypeMap pairs={[{ value: '2', type: 'Integer' }, { value: '"2"', type: 'String' }]} className="mx-auto w-[640px]" />
      </ContentSlide>
    ),
  },
  formSlide('form-float', 'Data Type', { height: 'Float' }),
  {
    id: 'float',
    section: AGENDA.types,
    label: 'Float',
    element: (
      <CodeSyntaxSlide
        kicker={AGENDA.types}
        title="Float"
        lesson={SESSION}
        lead="Any number with a decimal point: 24.3, 345.210, -321.86"
        language="python"
        parts={[
          { token: '4', label: 'Whole part' },
          { token: '.', label: 'Decimal Point' },
          { token: '2', label: 'Fractional Part' },
        ]}
      />
    ),
  },
  {
    id: 'two-vs-two-point-zero',
    section: AGENDA.types,
    label: '2 vs 2.0 vs "2.0"',
    element: (
      <ContentSlide kicker={AGENDA.types} title={'2 vs 2.0 vs "2.0"'} lesson={SESSION} lead="Mathematical Value vs Character">
        <ValueTypeMap
          pairs={[{ value: '2', type: 'Integer' }, { value: '2.0', type: 'Float' }, { value: '"2.0"', type: 'String' }]}
          className="mx-auto w-[640px]"
        />
      </ContentSlide>
    ),
  },
  formSlide('form-boolean', 'Data Type', { participated: 'Boolean' }),
  {
    id: 'boolean',
    section: AGENDA.types,
    label: 'Boolean',
    element: (
      <ContentSlide
        kicker={AGENDA.types}
        title="Boolean"
        lesson={SESSION}
        lead="Data that has one of two possible values. Values that are either"
        points={[
          { text: 'True or False', icon: 'check' },
          { text: 'Yes or No', icon: 'check' },
          { text: '0 or 1', icon: 'check' },
          { text: 'On or Off, etc.', icon: 'check' },
        ]}
      />
    ),
  },
  {
    id: 'boolean-syntax',
    section: AGENDA.types,
    label: 'Boolean Syntax',
    element: (
      <StatusPointsSlide
        kicker="Python"
        title="Boolean Syntax"
        lesson={SESSION}
        items={[
          { status: 'success', code: true, text: 'True', detail: 'Capital T' },
          { status: 'success', code: true, text: 'False', detail: 'Capital F' },
          { status: 'error', code: true, text: 'true', detail: 'Small letters are not a Boolean in Python' },
          { status: 'error', code: true, text: 'false', detail: 'Small letters are not a Boolean in Python' },
        ]}
      />
    ),
  },
  {
    id: 'true-vs-true',
    section: AGENDA.types,
    label: 'True Vs "True"',
    element: (
      <ContentSlide kicker={AGENDA.types} title={'True Vs "True"'} lesson={SESSION}>
        <ValueTypeMap pairs={[{ value: 'True', type: 'Boolean' }, { value: '"True"', type: 'String' }]} className="mx-auto w-[640px]" />
      </ContentSlide>
    ),
  },
  formSlide('form-all', 'Data Type', { sport: 'String', age: 'Integer', height: 'Float', participated: 'Boolean' }),

  /* ── Concept 3: Assignment Operator ──────────────────────────────── */
  { id: 'assign-divider', section: AGENDA.assign, label: 'Divider', element: <SectionBreakerSlide index={3} title={AGENDA.assign} lesson={SESSION} /> },
  {
    id: 'assigning',
    section: AGENDA.assign,
    label: 'Assigning Value to a Variable',
    element: (
      <CodeSyntaxSlide
        kicker="Python Syntax"
        title="Assigning Value to a Variable"
        lesson={SESSION}
        lead="Assigning an integer value 10 to a variable age"
        language="python"
        parts={[
          { token: 'age', label: 'Variable Name', fill: 'placeholder', after: ' ' },
          { token: '=', label: 'Assignment Operator', body: 'Puts the value on the right into the name on the left', after: ' ' },
          { token: '10', label: 'Value', fill: 'placeholder' },
        ]}
      />
    ),
  },
  {
    id: 'summary',
    section: AGENDA.assign,
    label: 'Summary',
    element: (
      <ContentSlide kicker={AGENDA.types} title="Summary" lesson={SESSION}>
        <DataTable columns={SUMMARY_COLUMNS} rows={SUMMARY_ROWS} className="mx-auto w-[1080px]" />
      </ContentSlide>
    ),
  },

  /* ── Closing frame ───────────────────────────────────────────────── */
  {
    id: 'quiz-2',
    section: 'Closing',
    label: 'Quiz Time!',
    transition: 'zoom',
    element: <QuizTimeSlide lesson={SESSION} subtitle="Four data types, one form, and the operator that puts a value in a name" />,
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
          { text: AGENDA.variables, sub: 'Containers' },
          { text: AGENDA.types, sub: 'Integer, Float, String, Boolean' },
          { text: AGENDA.assign, sub: 'Assigning Value to Variable' },
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
        prompt="Fill the application form for yourself"
        lesson={SESSION}
        tasks={[
          { text: 'Write your four answers as Python values', sub: 'Quotes around the string, none around the numbers' },
          { text: 'Name the data type of each answer', sub: 'String, Integer, Float or Boolean' },
          { text: 'Assign each one to a variable in the Code Playground', sub: 'sport = "Cricket", and the other three' },
        ]}
      />
    ),
  },
  { id: 'next-session', section: 'Closing', label: 'Next Session', element: <SectionBreakerSlide kicker="Next Session" title="Sequence of Instructions" lesson={SESSION} /> },
  { id: 'thank-you', section: 'Closing', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" message="All the best" lesson={SESSION} /> },
]
