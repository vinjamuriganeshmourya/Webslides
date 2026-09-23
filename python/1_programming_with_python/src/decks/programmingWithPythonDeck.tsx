import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  CodeSyntaxSlide,
  ContentSlide,
  KeyTakeawaysSlide,
  PracticeSlide,
  QuizTimeSlide,
  SectionBreakerSlide,
  StatusPointsSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import { Card, CardGrid, CodeBlock, CodeOutput, LogoWall, RadialSpread, Shot } from '@/ui'
import type { CodeOutputPane, IconName, WallMark } from '@/ui'

/**
 * PYTHON · SESSION 1 · "Programming with Python"
 *
 * Converted from `Python_PPT_slide/1_Programming with Python.pptx` under the
 * plan at `python/session_plans/1_programming_with_python/plan.md`, signed off
 * 2026-09-22, and the course rules at `python/workflow/skills/python-course/`.
 *
 * The source's sentences are the copy. A slide carries a figure only when the
 * content needs one (R1), and every program output below was produced by
 * running the snippet on CPython 3.12.3. Change a snippet, run it again.
 */

export const programmingWithPythonMeta: DeckMeta = {
  title: 'Programming with Python',
  course: 'Python',
  lesson: 'Programming with Python',
  presenter: 'NxtWave Instructor',
}

const SESSION = 'Programming with Python'

/** The four concepts. The agenda, the dividers and the takeaways all read this. */
const AGENDA = {
  intro: 'Introduction to Programming',
  why: 'Why Python?',
  first: 'Your First Program',
  calc: 'Using Python as a Calculator',
} as const

const PLAYGROUND = 'Code Playground · main.py'

/* ------------------------------------------------------------------ */
/* Data                                                                */
/* ------------------------------------------------------------------ */

const LANGUAGES: WallMark[] = [
  { src: '/assets/tech/python.png', name: 'Python' },
  { src: '/assets/tech/java.png', name: 'Java' },
  { src: '/assets/tech/javascript.png', name: 'JavaScript' },
  { src: '/assets/tech/c.png', name: 'C' },
  { src: '/assets/tech/cplusplus.png', name: 'C++' },
  { src: '/assets/tech/csharp.png', name: 'C#' },
  { src: '/assets/tech/go.png', name: 'Go' },
  { src: '/assets/tech/ruby.png', name: 'Ruby' },
  { src: '/assets/tech/swift.png', name: 'Swift' },
  { src: '/assets/tech/kotlin.png', name: 'Kotlin' },
  { src: '/assets/tech/dart.png', name: 'Dart' },
  { src: '/assets/tech/scala.png', name: 'Scala' },
  { src: '/assets/tech/r.png', name: 'R' },
]

const COMPANIES: WallMark[] = [
  { src: '/assets/companies/meta.png', name: 'Meta' },
  { src: '/assets/companies/google.png', name: 'Google' },
  { src: '/assets/companies/instagram.png', name: 'Instagram' },
  { src: '/assets/companies/uber.png', name: 'Uber' },
  { src: '/assets/companies/netflix.png', name: 'Netflix' },
  { src: '/assets/companies/spotify.png', name: 'Spotify' },
  { src: '/assets/companies/amazon.png', name: 'Amazon' },
  { src: '/assets/companies/microsoft.png', name: 'Microsoft' },
  { src: '/assets/companies/quora.png', name: 'Quora' },
  { src: '/assets/companies/reddit.png', name: 'Reddit' },
  { src: '/assets/companies/dropbox.png', name: 'Dropbox' },
  { src: '/assets/companies/paypal.png', name: 'PayPal' },
  { src: '/assets/companies/mozilla.png', name: 'Mozilla' },
]

const SALARY_COMPANIES: WallMark[] = [
  { src: '/assets/companies/oracle.png', name: 'Oracle' },
  { src: '/assets/companies/amazon.png', name: 'Amazon' },
  { src: '/assets/companies/google.png', name: 'Google' },
  { src: '/assets/companies/microsoft.png', name: 'Microsoft' },
  { src: '/assets/companies/netflix.png', name: 'Netflix' },
  { src: '/assets/companies/flipkart.png', name: 'Flipkart' },
  { src: '/assets/companies/instagram.png', name: 'Instagram' },
]

/** A program and what it printed. Every `output` here came from a real run. */
const run = (code: string, output: string, extra: Partial<CodeOutputPane> = {}): CodeOutputPane => ({
  location: PLAYGROUND,
  code,
  output,
  ...extra,
})

const MISTAKES = [
  {
    id: 'mistake-spelling',
    title: 'Spelling Mistake in print',
    code: 'prnt("Hello World!")',
    output:
      'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\n    prnt("Hello World!")\n    ^^^^\nNameError: name \'prnt\' is not defined. Did you mean: \'print\'?',
  },
  {
    id: 'mistake-uppercase',
    title: "Uppercase 'P' in Print",
    code: 'Print("Hello World!")',
    output:
      'Traceback (most recent call last):\n  File "main.py", line 1, in <module>\n    Print("Hello World!")\n    ^^^^^\nNameError: name \'Print\' is not defined. Did you mean: \'print\'?',
  },
  {
    id: 'mistake-quotes',
    title: 'Missing quotes',
    code: 'print(Hello World!)',
    output:
      '  File "main.py", line 1\n    print(Hello World!)\n          ^^^^^^^^^^^\nSyntaxError: invalid syntax. Perhaps you forgot a comma?',
  },
  {
    id: 'mistake-parentheses',
    title: 'Missing parentheses',
    code: 'print("Hello World!"',
    output: '  File "main.py", line 1\n    print("Hello World!"\n         ^\nSyntaxError: \'(\' was never closed',
  },
]

/** The source's Structured Learning pairs, with house icons. */
const STRUCTURED: { title: string; cards: { icon: IconName; title: string; body?: string }[] }[] = [
  {
    title: 'Wide Range of Sessions',
    cards: [
      { icon: 'book', title: 'Conceptual', body: 'Get in-depth conceptual knowledge' },
      { icon: 'code', title: 'Code Walkthrough', body: 'Writing actual implementation of code from scratch' },
    ],
  },
  {
    title: 'Wide Range of Sessions',
    cards: [
      { icon: 'bulb', title: 'Problem Solving', body: 'Various Approaches to solve a problem' },
      { icon: 'settings', title: 'Debugging', body: 'Learn Different Debugging Techniques' },
    ],
  },
  {
    title: 'Extensive Practice',
    cards: [
      { icon: 'pencil', title: 'Programming Assignments' },
      { icon: 'rocket', title: 'Mini Projects' },
    ],
  },
]

/* ------------------------------------------------------------------ */
/* Small compositions used more than once                              */
/* ------------------------------------------------------------------ */

/** A language name with its mark, over a code panel. */
function LabelledCode({ logo, name, filename, language, code }: { logo: string; name: string; filename: string; language: string; code: string }) {
  return (
    <div>
      <div className="mb-2 flex items-center gap-2">
        <img src={logo} alt="" aria-hidden className="h-6 w-6 object-contain" />
        <span className="font-heading text-body-sm font-bold uppercase tracking-wider text-body">{name}</span>
      </div>
      <CodeBlock language={language} filename={filename} code={code} />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export const programmingWithPythonDeck: SlideDef[] = [
  /* ── Front frame ─────────────────────────────────────────────────── */
  {
    id: 'brand',
    section: 'Opening',
    label: 'Welcome',
    element: <BrandSlide greeting="Welcome!" lesson={SESSION} />,
  },
  {
    id: 'session-name',
    section: 'Opening',
    label: 'Session name',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
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
          { title: AGENDA.intro, sub: 'Software, programming, code and syntax' },
          { title: AGENDA.why, sub: 'Where Python is used, and who uses it' },
          { title: AGENDA.first, sub: 'Displaying a message, and the mistakes to watch for' },
          { title: AGENDA.calc, sub: 'Arithmetic operators' },
        ]}
      />
    ),
  },

  /* ── Concept 1: Introduction to Programming ──────────────────────── */
  {
    id: 'intro-divider',
    section: AGENDA.intro,
    label: 'Divider',
    element: <SectionBreakerSlide index={1} title={AGENDA.intro} lesson={SESSION} />,
  },
  {
    id: 'software',
    section: AGENDA.intro,
    label: 'Software',
    element: (
      <ContentSlide
        kicker={AGENDA.intro}
        title="Software"
        lesson={SESSION}
        points={[{ text: 'Software is a set of instructions to the hardware', icon: 'devices' }]}
      />
    ),
  },
  {
    id: 'programming',
    section: AGENDA.intro,
    label: 'Programming',
    element: (
      <ContentSlide
        kicker={AGENDA.intro}
        title="Programming"
        lesson={SESSION}
        points={[
          { text: 'Programming means writing the instructions', icon: 'pencil' },
          { text: 'These instructions are called as Code', icon: 'code' },
        ]}
      />
    ),
  },
  {
    id: 'programming-language',
    section: AGENDA.intro,
    label: 'Programming Language',
    element: (
      <ContentSlide
        kicker={AGENDA.intro}
        title="Programming Language"
        lesson={SESSION}
        points={[
          { text: 'We should give instructions in a language that the computer understands', icon: 'chat' },
          { text: 'These languages are called Programming Languages', icon: 'code' },
        ]}
      />
    ),
  },
  {
    id: 'syntax',
    section: AGENDA.intro,
    label: 'Syntax',
    element: (
      <ContentSlide
        kicker={AGENDA.intro}
        title="Syntax"
        lesson={SESSION}
        points={[
          {
            text: 'Similar to Grammar rules in English, Hindi, etc. each programming language has a unique set of rules',
            icon: 'book',
          },
          { text: 'These rules are called its Syntax', icon: 'check' },
        ]}
      />
    ),
  },
  {
    id: 'popular-languages',
    section: AGENDA.intro,
    label: 'Popular languages',
    element: (
      <ContentSlide
        kicker={AGENDA.intro}
        title="Popular Programming Languages"
        lesson={SESSION}
        lead="Around ~ 700 Programming Languages"
      >
        <LogoWall marks={LANGUAGES} cols={5} size="sm" className="mx-auto w-[860px]" />
      </ContentSlide>
    ),
  },

  /* ── Concept 2: Why Python? ──────────────────────────────────────── */
  {
    id: 'why-divider',
    section: AGENDA.why,
    label: 'Divider',
    element: <SectionBreakerSlide index={2} title={AGENDA.why} lesson={SESSION} />,
  },
  {
    id: 'versatile',
    section: AGENDA.why,
    label: 'Versatile Language',
    element: (
      <ContentSlide
        kicker={AGENDA.why}
        title="Versatile Language"
        lesson={SESSION}
        lead="Has applications in almost every field."
      >
        <RadialSpread
          hub="Python"
          hubLogo="/assets/tech/python.png"
          spokes={[
            { icon: 'bulb', label: 'AI/Machine Learning' },
            { icon: 'database', label: 'Big Data' },
            { icon: 'devices', label: 'Smart Device/IOT' },
            { icon: 'play', label: 'Game Development' },
            { icon: 'server', label: 'Backend Development' },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'top-companies',
    section: AGENDA.why,
    label: 'Top tech companies',
    element: (
      <ContentSlide
        kicker={AGENDA.why}
        title="Popular at Top Tech Companies"
        lesson={SESSION}
        lead="Major Tech Companies use Python extensively"
      >
        <LogoWall marks={COMPANIES} cols={5} size="sm" className="mx-auto w-[860px]" />
      </ContentSlide>
    ),
  },
  {
    id: 'opportunities',
    section: AGENDA.why,
    label: 'Plenty of Opportunities',
    element: (
      <ContentSlide
        kicker={AGENDA.why}
        title="Plenty of Opportunities"
        lesson={SESSION}
        points={[
          { text: 'Python Developer', icon: 'code' },
          { text: 'Data Scientist', icon: 'database' },
          { text: 'ML Engineer', icon: 'bulb' },
          { text: 'Data Analyst', icon: 'target' },
          { text: 'DevOps Engineer', icon: 'settings' },
          { text: 'Software Developer', icon: 'devices' },
        ]}
      />
    ),
  },
  {
    id: 'salaries',
    section: AGENDA.why,
    label: 'Huge Salaries',
    notes:
      'No figures on purpose. The source put its PayScale bars inside an image nobody can read back, and a plausible salary is composed content. Numbers go here when someone supplies them.',
    element: (
      <ContentSlide
        kicker={AGENDA.why}
        title="Huge Salaries"
        lesson={SESSION}
        lead="Tech companies like Oracle, Amazon, Google, Microsoft offer competitive salaries in both India and the US"
      >
        <div className="mx-auto w-[720px]">
          <LogoWall marks={SALARY_COMPANIES} cols={4} size="sm" />
          <p className="mt-8 text-center text-body-sm text-body">Source: PayScale</p>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'demand',
    section: AGENDA.why,
    label: 'Demand for Python',
    element: (
      <ContentSlide kicker={AGENDA.why} title="Demand for Python" lesson={SESSION}>
        <Shot
          src="/shots/hiring-trends.png"
          alt="Hacker News hiring trends chart, Python above Java, C and C++ every year since 2011"
          caption="May 2024 Hacker News Hiring Trends"
          className="mx-auto w-[820px]"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'easy-to-learn',
    section: AGENDA.why,
    label: 'Easy to Learn',
    element: (
      <ContentSlide
        kicker={AGENDA.why}
        title="Easy to Learn"
        lesson={SESSION}
        points={[
          { text: 'Simple Syntax', icon: 'check' },
          { text: 'Minimal Code', icon: 'check' },
        ]}
      />
    ),
  },
  {
    id: 'java-vs-python',
    section: AGENDA.why,
    label: 'Java beside Python',
    element: (
      <ContentSlide kicker={AGENDA.why} title="Easy to Learn" lesson={SESSION}>
        <div className="grid grid-cols-2 items-start gap-8">
          <LabelledCode
            logo="/assets/tech/java.png"
            name="Java"
            filename="HelloWorld.java"
            language="java"
            code={
              'class HelloWorld\n{\n    public static void main(String[] args)\n    {\n        System.out.println("Hello World!");\n    }\n}'
            }
          />
          <LabelledCode
            logo="/assets/tech/python.png"
            name="Python"
            filename="main.py"
            language="python"
            code={'print("Hello World!")'}
          />
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'quiz-1',
    section: AGENDA.why,
    label: 'Quiz Time!',
    transition: 'zoom',
    element: (
      <QuizTimeSlide
        lesson={SESSION}
        subtitle="Programming, code, syntax, and why Python out of around 700 languages"
      />
    ),
  },

  /* ── Concept 3: Your First Program ───────────────────────────────── */
  {
    id: 'first-divider',
    section: AGENDA.first,
    label: 'Divider',
    element: <SectionBreakerSlide index={3} title={AGENDA.first} lesson={SESSION} />,
  },
  {
    id: 'displaying-a-message',
    section: AGENDA.first,
    label: 'Displaying a Message',
    element: (
      <ContentSlide
        kicker={AGENDA.first}
        title="Displaying a Message"
        lesson={SESSION}
        lead='Writing a program to display "Hello World!"'
      >
        <CodeOutput panes={[run('print("Hello World!")', 'Hello World!')]} />
      </ContentSlide>
    ),
  },
  {
    id: 'code-playground',
    section: AGENDA.first,
    label: 'Code Playground',
    element: (
      <ContentSlide
        kicker={AGENDA.first}
        title="Code Playground"
        lesson={SESSION}
        lead="Write the program in the editor and click Run Code"
      >
        <Shot
          src="/shots/code-playground.png"
          alt="The Code Playground editor with one print line and the Run Code button"
          caption="The playground as captured, running a different message. Type print(&quot;Hello World!&quot;) on line 1"
          className="mx-auto w-[480px]"
        />
      </ContentSlide>
    ),
  },
  ...MISTAKES.map(
    (m): SlideDef => ({
      id: m.id,
      section: AGENDA.first,
      label: m.title,
      element: (
        <ContentSlide kicker="Possible Mistakes" title={m.title} lesson={SESSION}>
          <CodeOutput layout="stack" panes={[run(m.code, m.output, { kind: 'error' })]} outputFontSize={15} />
        </ContentSlide>
      ),
    }),
  ),
  {
    id: 'possible-mistakes',
    section: AGENDA.first,
    label: 'Possible Mistakes',
    element: (
      <StatusPointsSlide
        kicker="Hello World Program"
        title="Possible Mistakes"
        lesson={SESSION}
        items={MISTAKES.map((m) => ({ status: 'error' as const, code: true, text: m.code, detail: m.title }))}
      />
    ),
  },

  /* ── Concept 4: Using Python as a Calculator ─────────────────────── */
  {
    id: 'calc-divider',
    section: AGENDA.calc,
    label: 'Divider',
    element: <SectionBreakerSlide index={4} title={AGENDA.calc} lesson={SESSION} />,
  },
  {
    id: 'addition-syntax',
    section: AGENDA.calc,
    label: 'Addition',
    element: (
      <CodeSyntaxSlide
        kicker={AGENDA.calc}
        title="Addition"
        lesson={SESSION}
        language="python"
        parts={[
          { token: '2', label: 'A number', fill: 'placeholder', after: ' ' },
          { token: '+', label: 'Addition Operator', body: 'The symbol that says which calculation to do', after: ' ' },
          { token: '5', label: 'A number', fill: 'placeholder' },
        ]}
      />
    ),
  },
  {
    id: 'printing-the-result',
    section: AGENDA.calc,
    label: 'Printing the Result',
    element: (
      <ContentSlide kicker={AGENDA.calc} title="Printing the Result" lesson={SESSION}>
        <CodeOutput panes={[run('print(2 + 5)', '7'), run('print("2 + 5")', '2 + 5')]} />
      </ContentSlide>
    ),
  },
  {
    id: 'printing-a-number',
    section: AGENDA.calc,
    label: 'Printing a Number',
    element: (
      <ContentSlide kicker={AGENDA.calc} title="Printing a Number" lesson={SESSION}>
        <CodeOutput
          panes={[
            run('print(2 + 5)', '7', { label: 'No Quotes' }),
            run('print("Hello World!")', 'Hello World!', { label: 'Quotes' }),
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'addition',
    section: AGENDA.calc,
    label: 'Addition',
    element: (
      <ContentSlide kicker={AGENDA.calc} title="Addition" lesson={SESSION}>
        <CodeOutput panes={[run('print(2 + 5)', '7'), run('print(1 + 1.5)', '2.5')]} />
      </ContentSlide>
    ),
  },
  {
    id: 'addition-operator',
    section: AGENDA.calc,
    label: 'Addition Operator',
    element: (
      <ContentSlide kicker={AGENDA.calc} title="Addition Operator" lesson={SESSION} lead="2 + 5">
        <CodeOutput panes={[run('print(2 + 5)', '7')]} />
      </ContentSlide>
    ),
  },
  {
    id: 'subtraction-operator',
    section: AGENDA.calc,
    label: 'Subtraction Operator',
    element: (
      <ContentSlide kicker={AGENDA.calc} title="Subtraction Operator" lesson={SESSION} lead="5 - 2">
        <CodeOutput panes={[run('print(5 - 2)', '3')]} />
      </ContentSlide>
    ),
  },
  {
    id: 'multiplication-operator',
    section: AGENDA.calc,
    label: 'Multiplication Operator',
    element: (
      <ContentSlide kicker={AGENDA.calc} title="Multiplication Operator" lesson={SESSION} lead="2 * 5">
        <CodeOutput panes={[run('print(2 * 5)', '10')]} />
      </ContentSlide>
    ),
  },
  {
    id: 'multiplication',
    section: AGENDA.calc,
    label: 'Multiplication',
    element: (
      <ContentSlide kicker={AGENDA.calc} title="Multiplication" lesson={SESSION}>
        <CodeOutput panes={[run('print(5 * 4)', '20'), run('print(5 * 0.5)', '2.5')]} />
      </ContentSlide>
    ),
  },
  {
    id: 'division-operator',
    section: AGENDA.calc,
    label: 'Division Operator',
    element: (
      <ContentSlide kicker={AGENDA.calc} title="Division Operator" lesson={SESSION} lead="6 / 3">
        <CodeOutput panes={[run('print(6 / 3)', '2.0')]} />
      </ContentSlide>
    ),
  },
  {
    id: 'division',
    section: AGENDA.calc,
    label: 'Division',
    element: (
      <ContentSlide kicker={AGENDA.calc} title="Division" lesson={SESSION}>
        <CodeOutput panes={[run('print(5 / 2)', '2.5'), run('print(4 / 2)', '2.0')]} />
      </ContentSlide>
    ),
  },

  /* ── Closing frame ───────────────────────────────────────────────── */
  ...STRUCTURED.map(
    (s, i): SlideDef => ({
      id: `structured-${i + 1}`,
      section: 'Structured Learning',
      label: s.title,
      element: (
        <ContentSlide kicker="Structured Learning" title={s.title} lesson={SESSION}>
          <CardGrid cols={2} className="mx-auto w-[760px]">
            {s.cards.map((c) => (
              <Card key={c.title} icon={c.icon} title={c.title}>
                {c.body}
              </Card>
            ))}
          </CardGrid>
        </ContentSlide>
      ),
    }),
  ),
  {
    id: 'quiz-2',
    section: 'Closing',
    label: 'Quiz Time!',
    transition: 'zoom',
    element: (
      <QuizTimeSlide
        lesson={SESSION}
        subtitle="One line of Python, four ways to break it, and the operator that never gives a whole number"
      />
    ),
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
          { text: AGENDA.intro, sub: 'Programming, Code, Syntax' },
          { text: AGENDA.why },
          { text: AGENDA.first, sub: 'Displaying a Message: Hello World!' },
          { text: AGENDA.calc, sub: 'Calculations with Python: Arithmetic Operators' },
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
        prompt="Open the Code Playground and run every program from today's session"
        lesson={SESSION}
        tasks={[
          { text: 'Display Hello World!', sub: 'Then make each of the four mistakes on purpose and read the error' },
          { text: 'Print 2 + 5 with quotes and without', sub: 'Say before you run which one prints 7' },
          { text: 'Divide two numbers that divide exactly', sub: 'Look at what Python prints after the decimal point' },
        ]}
      />
    ),
  },
  {
    id: 'next-session',
    section: 'Closing',
    label: 'Next Session',
    element: <SectionBreakerSlide kicker="Next Session" title="Coding Practice Walkthrough Part 1" lesson={SESSION} />,
  },
  {
    id: 'thank-you',
    section: 'Closing',
    label: 'Thank you',
    transition: 'zoom',
    element: <ThankYouSlide title="Thank you!" message="All the best" lesson={SESSION} />,
  },
]
