import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  CodeSyntaxSlide,
  ContentSlide,
  KeyTakeawaysSlide,
  PracticeSlide,
  QuestionSlide,
  QuizTimeSlide,
  RecapSlide,
  SectionBreakerSlide,
  StatusPointsSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import {
  CodeOutput,
  DataTable,
  EditorialList,
  InstructionFlow,
  LogoWall,
  RadialSpread,
  Shot,
  SyntaxSpecimens,
} from '@/ui'

/**
 * PYTHON PROGRAMMING · SESSION 1 · "Programming with Python"
 *
 * Built from `python_programming/session_plans/programming_with_python/plan.md`,
 * signed off 2026-08-26 on the four defaults in its §7. Converted from
 * `Python_PPT_slide/1_Programming with Python.pptx` (42 slides).
 *
 * THIS DECK'S OWN RULES, and where they came from
 *
 * 1. EVERY OUTPUT ON EVERY SLIDE WAS PRODUCED BY RUNNING THE SNIPPET.
 *    CPython 3.12, before a line of this file was written. That includes all four
 *    tracebacks in concept 3, down to the `Did you mean: 'print'?` suffix, which
 *    only exists on 3.11 and later. If a snippet changes, run it again and paste
 *    what came out. The generate-slides skill's §3 forbids composing output and
 *    this deck is nothing but output.
 *
 * 2. FOUR AGENDA ITEMS, AND THE TAKEAWAYS REPEAT THEM WORD FOR WORD (rule 20).
 *    The source PPTX listed seven, which double-counted itself twice. The four
 *    strings live in `AGENDA` below and are used on both frames, so they cannot
 *    drift apart.
 *
 * 3. ONE MISTAKE PER SLIDE (rule 5). The source put four broken programs on one
 *    slide. Each produces a DIFFERENT error and each is a thing the room has to
 *    weigh on its own, so each gets a frame, and the consolidation comes after.
 *
 * 4. NO KIT CHANGE WAS NEEDED FOR `print`, WHICH THE PLAN EXPECTED TO NEED ONE.
 *    `CodeBlock`'s tokenizer already colours any identifier followed by `(` as a
 *    call, so `print` lands in the function colour on all thirteen slides without
 *    being added to the keyword set. Checked before editing, not after.
 *
 * 5. THE LOGO WALLS USE THE CURRENT MARKS, NOT THE SOURCE'S. The PPTX still
 *    showed the pre-2021 Facebook mark and Uber's retired square. See
 *    `slide-kit/assets/README.md`.
 */

export const programmingWithPythonMeta: DeckMeta = {
  title: 'Programming with Python',
  course: 'Python Programming',
  lesson: 'Programming with Python',
  presenter: 'NxtWave Instructor',
}

/** Footer and kicker text on every slide: the session name, never "Session 1". */
const SESSION = 'Programming with Python'

/**
 * The four concepts, written once.
 *
 * Rule 20: the agenda promises these and the takeaways is the receipt, so the
 * two frames must carry identical strings. Sharing the constant is what makes
 * that structural rather than a thing to remember.
 */
const AGENDA = [
  'Introduction to Programming',
  'Why Python',
  'Your First Program',
  'Python as a Calculator',
] as const

/*
  EVERY ASSET PATH IN THIS FILE IS A LITERAL STRING, DELIBERATELY.

  The first pass of this deck built them with two helpers,
  `` TECH = name => `/assets/tech/${name}.png` ``, which is tidier to read and
  silently breaks the deliverable. `scripts/inline-assets.mjs` finds asset
  references by scanning the bundle for the path and rewriting it to a base64
  data URI; a path assembled at runtime is not in the bundle to be found. The
  build reported "Inlined 10/10 assets" and every one of the twenty-nine logos
  would have rendered as a broken image the moment the HTML was opened by
  double-click, which is the only way an instructor ever opens it.

  So: no interpolation, no helper, no join. The literal path, written out.
*/

/** The twelve on the source's own "popular languages" wall, plus Python. */
const LANGUAGES = [
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
  { src: '/assets/tech/r.png', name: 'R' },
  { src: '/assets/tech/scala.png', name: 'Scala' },
]

const COMPANIES = [
  { src: '/assets/companies/google.png', name: 'Google' },
  { src: '/assets/companies/meta.png', name: 'Meta' },
  { src: '/assets/companies/netflix.png', name: 'Netflix' },
  { src: '/assets/companies/amazon.png', name: 'Amazon' },
  { src: '/assets/companies/microsoft.png', name: 'Microsoft' },
  { src: '/assets/companies/uber.png', name: 'Uber' },
  { src: '/assets/companies/spotify.png', name: 'Spotify' },
  { src: '/assets/companies/instagram.png', name: 'Instagram' },
  { src: '/assets/companies/dropbox.png', name: 'Dropbox' },
  { src: '/assets/companies/reddit.png', name: 'Reddit' },
  { src: '/assets/companies/paypal.png', name: 'PayPal' },
  { src: '/assets/companies/nvidia.png', name: 'NVIDIA' },
]

/* The Java side of slide 19. Six lines to print one greeting. */
const JAVA_HELLO = `class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello World!");
    }
}`

export const programmingWithPythonDeck: SlideDef[] = [
  /* ── FRONT FRAME ──────────────────────────────────────────────────────── */
  {
    id: 'brand',
    section: 'Opening',
    label: 'Brand',
    element: <BrandSlide greeting="Welcome!" lesson={SESSION} />,
    notes:
      'On screen while the room settles. `greeting` is deliberately NOT "Welcome to today\'s session": WelcomeSlide hardcodes that line and the two frames are ten seconds apart (rule 21).',
  },
  {
    id: 'session-name',
    section: 'Opening',
    label: 'Session name',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
    notes: 'The session name and nothing else. `minimal` is the shipping form.',
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        kicker="Today"
        title="Agenda for Today's Session"
        /* NO `lead` HERE. `AgendaSlide` destructures only kicker, title, items
           and lesson, so a lead passed to it is silently dropped: it is on
           `AgendaSlideProps` and unread by the component. The agenda's
           video-rectangle intrusion was fixed in the slide type's geometry
           instead. See `src/slides/AgendaSlide.tsx`. */
        lesson={SESSION}
        items={[
          { title: AGENDA[0], sub: 'Software, code, and the word syntax' },
          { title: AGENDA[1], sub: 'Out of roughly 700 languages, why this one' },
          { title: AGENDA[2], sub: 'One line that displays a message' },
          { title: AGENDA[3], sub: 'Four operators, and one surprise' },
        ]}
      />
    ),
    notes:
      'Four items, from the AGENDA constant. The source PPTX listed seven and double-counted itself; rule 20 caps it at four and the takeaways slide repeats these strings verbatim.',
  },

  /* ── CONCEPT 1 · INTRODUCTION TO PROGRAMMING ──────────────────────────── */
  {
    id: 'break-intro',
    section: AGENDA[0],
    label: 'Divider',
    element: <SectionBreakerSlide index={1} title={AGENDA[0]} lesson={SESSION} />,
    transition: 'fade',
    notes: 'Concept 1 of 4. Dividers crossfade: the room sees this frame five times in one deck.',
  },
  {
    id: 'software',
    section: AGENDA[0],
    label: 'Software',
    element: (
      <ContentSlide
        kicker={AGENDA[0]}
        title="Software"
        lead="Software is a set of instructions given to the hardware."
        lesson={SESSION}
        points={[
          { text: 'The hardware does nothing on its own', sub: 'It waits to be told what to do' },
          { text: 'Every app is a list of instructions', sub: 'Ordered, and followed one at a time' },
        ]}
      >
        <InstructionFlow />
      </ContentSlide>
    ),
    notes:
      'The session starts one step before Python. Nobody here has written code, so "software" is defined before "programming" is.',
  },
  {
    id: 'programming',
    section: AGENDA[0],
    label: 'Programming',
    element: (
      <ContentSlide
        kicker={AGENDA[0]}
        title="Programming"
        lead="Programming means writing those instructions. What you write is called Code."
        lesson={SESSION}
        points={[
          { text: 'Same picture as the last slide', sub: 'Only now the stack has a name' },
          { text: 'Code is the instructions, written down', sub: 'The word the rest of this course uses daily' },
        ]}
      >
        <InstructionFlow showCodeLabel />
      </ContentSlide>
    ),
    notes:
      'The figure is unchanged from the previous slide except for the Code chip. That continuity is the teaching device: the room is not shown a new picture, it is shown a name for the one it already has.',
  },
  {
    id: 'q-english',
    section: AGENDA[0],
    label: 'Question · English',
    element: (
      <QuestionSlide
        kicker={AGENDA[0]}
        question="Will a computer follow instructions written in plain English?"
        lesson={SESSION}
      />
    ),
    notes: 'The answer is the next slide. Nothing else on this frame (rule 16).',
  },
  {
    id: 'programming-language',
    section: AGENDA[0],
    label: 'Programming language',
    element: (
      <ContentSlide
        kicker={AGENDA[0]}
        title="Programming Language"
        lead="The instructions have to go in a language the computer understands."
        lesson={SESSION}
        points={[
          { text: 'Those languages are called programming languages', sub: 'English is not one of them' },
          { text: 'Python is one of them', sub: 'And it is the one this course starts with' },
        ]}
      />
    ),
  },
  {
    id: 'syntax',
    section: AGENDA[0],
    label: 'Syntax',
    element: (
      <ContentSlide
        kicker={AGENDA[0]}
        title="Syntax"
        lead="English has grammar rules. Every programming language has its own set of rules, called its syntax."
        lesson={SESSION}
      >
        <SyntaxSpecimens
          specimens={[
            {
              logo: '/assets/tech/python.png',
              language: 'Python',
              code: 'print("Hello World!")',
              rule: 'No semicolon',
              primary: true,
            },
            {
              logo: '/assets/tech/javascript.png',
              language: 'JavaScript',
              code: 'console.log("Hello World!");',
              rule: 'Semicolon',
            },
            {
              logo: '/assets/tech/java.png',
              language: 'Java',
              code: 'System.out.println("Hello World!");',
              rule: 'Needs a class around it',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Three real lines that all print the same thing. The room does not need to be TOLD the languages differ, it can see three shapes doing one job, and that is what syntax is. Say plainly that nobody is expected to remember the Java line. This is NOT the length comparison: that is its own slide later, with Java\'s whole six-line program.',
  },
  {
    id: 'many-languages',
    section: AGENDA[0],
    label: '700 languages',
    element: (
      <ContentSlide
        kicker={AGENDA[0]}
        title="Around 700 Languages"
        lead="There are roughly 700 programming languages. These are the ones you will hear named most often."
        lesson={SESSION}
      >
        <LogoWall marks={LANGUAGES} cols={6} />
      </ContentSlide>
    ),
    notes:
      'The wall is the argument, not decoration: the room recognises half of these before reading a single label, which is what makes the next question land.',
  },
  {
    id: 'q-why-python',
    section: AGENDA[0],
    label: 'Question · Why Python',
    element: (
      <QuestionSlide
        kicker={AGENDA[0]}
        question="Out of roughly 700 languages, why start with Python?"
        lesson={SESSION}
      />
    ),
    notes: 'Hands the room straight into concept 2. The divider answers it.',
  },

  /* ── CONCEPT 2 · WHY PYTHON ───────────────────────────────────────────── */
  {
    id: 'break-why-python',
    section: AGENDA[1],
    label: 'Divider',
    element: <SectionBreakerSlide index={2} title={AGENDA[1]} lesson={SESSION} />,
    transition: 'fade',
  },
  {
    id: 'versatile',
    section: AGENDA[1],
    label: 'Versatile',
    element: (
      <ContentSlide
        kicker={AGENDA[1]}
        title="Versatile Language"
        lead="Python has applications in almost every field."
        lesson={SESSION}
      >
        <RadialSpread
          hub="Python"
          hubLogo="/assets/tech/python.png"
          spokes={[
            { icon: 'network', label: 'AI and Machine Learning' },
            { icon: 'database', label: 'Big Data' },
            { icon: 'devices', label: 'Smart Devices and IoT' },
            { icon: 'play', label: 'Game Development' },
            { icon: 'server', label: 'Backend Development' },
          ]}
        />
      </ContentSlide>
    ),
    notes: "The source's own five fields, kept as it had them.",
  },
  {
    id: 'top-companies',
    section: AGENDA[1],
    label: 'Top companies',
    element: (
      <ContentSlide
        kicker={AGENDA[1]}
        title="Popular at Top Tech Companies"
        lead="Major tech companies use Python extensively."
        lesson={SESSION}
      >
        <LogoWall marks={COMPANIES} cols={6} />
      </ContentSlide>
    ),
    notes:
      'Current marks, not the source deck\'s. It still showed the pre-2021 Facebook mark and Uber\'s retired square, and a room that spots a dead logo stops trusting the slide.',
  },
  {
    id: 'opportunities',
    section: AGENDA[1],
    label: 'Opportunities',
    element: (
      <ContentSlide
        kicker={AGENDA[1]}
        title="Plenty of Opportunities"
        lead="One language, and these are the roles it opens."
        lesson={SESSION}
      >
        <EditorialList
          cols={2}
          rows={[
            { label: 'Python Developer', body: 'Building the software itself' },
            { label: 'Data Scientist', body: 'Finding what the data says' },
            { label: 'ML Engineer', body: 'Putting models into production' },
            { label: 'Data Analyst', body: 'Turning numbers into decisions' },
            { label: 'DevOps Engineer', body: 'Automating how software ships' },
            { label: 'Software Developer', body: 'The general craft, in any domain' },
          ]}
        />
      </ContentSlide>
    ),
    notes: "The source's own six roles.",
  },
  {
    id: 'salaries',
    section: AGENDA[1],
    label: 'Salaries',
    element: (
      <ContentSlide
        kicker={AGENDA[1]}
        title="Competitive Salaries"
        lead="Oracle, Amazon, Google and Microsoft all pay competitively for Python roles, in India and in the US (source: PayScale)."
        lesson={SESSION}
      >
        <LogoWall
          marks={[
            { src: '/assets/companies/oracle.png', name: 'Oracle' },
            { src: '/assets/companies/amazon.png', name: 'Amazon' },
            { src: '/assets/companies/google.png', name: 'Google' },
            { src: '/assets/companies/microsoft.png', name: 'Microsoft' },
          ]}
          cols={4}
        />
      </ContentSlide>
    ),
    notes:
      'NO NUMBERS ON THIS SLIDE, DELIBERATELY. The source put its PayScale figures inside chart images that cannot be read back, and a plausible-looking salary is exactly the kind of composed content this workflow forbids. If the figures arrive, they go here and the lead gets rewritten around them.',
  },
  {
    id: 'demand',
    section: AGENDA[1],
    label: 'Demand',
    element: (
      <ContentSlide
        kicker={AGENDA[1]}
        title="Demand for Python"
        lead="Python leads every other language in hiring posts, and has done since 2011."
        lesson={SESSION}
        points={[
          { text: 'The blue line is Python', sub: 'It has not been overtaken in thirteen years' },
          { text: 'This is job posts, not opinion', sub: 'What companies actually advertised for' },
        ]}
      >
        <Shot
          src="/shots/hiring-trends.png"
          alt="Hacker News hiring trends, May 2024. Python leads C, C++ and Java in percentage of posts every year from 2011 to 2024."
          caption="May 2024 · Hacker News hiring trends"
        />
      </ContentSlide>
    ),
    notes:
      'A real capture, cropped to the chart and nothing else (rule 11). No highlight box: the legend and the gap between the lines already put the point in the middle of the frame.',
  },
  {
    id: 'easy-to-learn',
    section: AGENDA[1],
    label: 'Easy to learn',
    element: (
      <ContentSlide
        kicker={AGENDA[1]}
        title="Easy to Learn"
        lead="Simple syntax, and far less code for the same result."
        lesson={SESSION}
        points={[
          { text: 'Python reads close to English', sub: 'Fewer symbols to memorise before you start' },
          { text: 'Less code means fewer places to go wrong', sub: 'Which matters most on your first day' },
        ]}
      />
    ),
  },
  {
    id: 'six-lines-or-one',
    section: AGENDA[1],
    label: 'Java or Python',
    element: (
      <ContentSlide
        kicker={AGENDA[1]}
        title="Six Lines, or One"
        lead="The same program, displaying the same greeting, in two languages."
        lesson={SESSION}
      >
        <CodeOutput
          panes={[
            {
              label: 'Java',
              logo: '/assets/tech/java.png',
              code: JAVA_HELLO,
              output: 'Hello World!',
              language: 'java',
              showLineNumbers: true,
            },
            {
              label: 'Python',
              logo: '/assets/tech/python.png',
              code: 'print("Hello World!")',
              output: 'Hello World!',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The hinge of the session. This is the claim the room can check for itself, and the next concept is spent on the right-hand line.',
  },

  /* ── CONCEPT 3 · YOUR FIRST PROGRAM ───────────────────────────────────── */
  {
    id: 'break-first-program',
    section: AGENDA[2],
    label: 'Divider',
    element: <SectionBreakerSlide index={3} title={AGENDA[2]} lesson={SESSION} />,
    transition: 'fade',
  },
  {
    id: 'displaying-a-message',
    section: AGENDA[2],
    label: 'Hello World',
    element: (
      <ContentSlide
        kicker={AGENDA[2]}
        title="Displaying a Message"
        lead="A whole program, in one line."
        lesson={SESSION}
      >
        <CodeOutput
          panes={[{ code: 'print("Hello World!")', output: 'Hello World!' }]}
        />
      </ContentSlide>
    ),
    notes:
      'Their first program. Say the whole line out loud, including the punctuation, because the next four slides are about that punctuation.',
  },
  {
    id: 'print-syntax',
    section: AGENDA[2],
    label: 'Shape of print',
    element: (
      <CodeSyntaxSlide
        kicker={AGENDA[2]}
        title="The Shape of print"
        lead="Four parts, and three of them are punctuation."
        lesson={SESSION}
        language="python"
        parts={[
          {
            token: 'print',
            label: 'the instruction',
            body: 'Displays whatever it is given. Lowercase, always.',
            after: '',
          },
          {
            token: '(',
            label: 'open the brackets',
            body: 'What to display goes inside them.',
            after: '',
          },
          {
            token: '"Hello World!"',
            label: 'the message',
            body: 'In quotes, so Python treats it as text.',
            fill: 'placeholder',
            after: '',
          },
          {
            token: ')',
            label: 'close the brackets',
            body: 'Every bracket you open has to be closed.',
            after: '',
          },
        ]}
        note={{
          kind: 'warning',
          title: 'Every one of these four is a mistake waiting to happen',
          body: 'The next four slides are that same line, broken four different ways.',
        }}
      />
    ),
  },
  {
    id: 'code-playground',
    section: AGENDA[2],
    label: 'Playground',
    element: (
      <ContentSlide
        kicker={AGENDA[2]}
        title="Code Playground"
        lead="Where you write the line and run it."
        lesson={SESSION}
        points={[
          { text: 'The editor is on the left', sub: 'Type the program on line 1' },
          { text: 'Run Code is at the bottom', sub: 'What the program prints appears under OUTPUT' },
        ]}
      >
        <Shot
          src="/shots/code-playground.png"
          alt="The NxtWave code playground: a Python 3.10 editor on the left holding one print line, INPUT and OUTPUT panels on the right, and a Run Code button at the bottom."
          caption="The playground, before Run Code is pressed. The snippet shown is not this session's program"
          highlight={{ left: 45.7, top: 88, width: 10.6, height: 6.2 }}
        />
      </ContentSlide>
    ),
    notes:
      "The capture's own snippet is a different line, and the caption says so rather than pretending otherwise. One highlight box, on Run Code, because that is the one control the room has to find.",
  },
  {
    id: 'q-typo',
    section: AGENDA[2],
    label: 'Question · typo',
    element: (
      <QuestionSlide
        kicker={AGENDA[2]}
        question={'What does Python do with prnt("Hello World!")?'}
        qualifier="Everything else about the line is correct"
        lesson={SESSION}
      />
    ),
    notes: 'Opens the run of four mistakes. Let the room answer before the next slide.',
  },
  {
    id: 'mistake-spelling',
    section: AGENDA[2],
    label: 'Mistake 1 · spelling',
    element: (
      <ContentSlide
        kicker="Mistake 1 of 4"
        title="A Misspelled Name"
        lead="Python does not guess. It looks for exactly the name you typed."
        lesson={SESSION}
      >
        <CodeOutput
          panes={[
            {
              code: 'prnt("Hello World!")',
              kind: 'error',
              output: `Traceback (most recent call last):
  File "main.py", line 1, in <module>
    prnt("Hello World!")
    ^^^^
NameError: name 'prnt' is not defined. Did you mean: 'print'?`,
            },
          ]}
          layout="stack"
          outputFontSize={15}
        />
      </ContentSlide>
    ),
    notes:
      'Real output from CPython 3.12. The "Did you mean" suffix is the point worth dwelling on: the error message is trying to help, and reading it is a skill.',
  },
  {
    id: 'mistake-capital',
    section: AGENDA[2],
    label: 'Mistake 2 · capital P',
    element: (
      <ContentSlide
        kicker="Mistake 2 of 4"
        title="A Capital P"
        lead="Python is case sensitive. Print and print are two different names."
        lesson={SESSION}
      >
        <CodeOutput
          panes={[
            {
              code: 'Print("Hello World!")',
              kind: 'error',
              output: `Traceback (most recent call last):
  File "main.py", line 1, in <module>
    Print("Hello World!")
    ^^^^^
NameError: name 'Print' is not defined. Did you mean: 'print'?`,
            },
          ]}
          layout="stack"
          outputFontSize={15}
        />
      </ContentSlide>
    ),
    notes:
      'Same error type as the previous slide, from a mistake that looks nothing like a typo. That is the lesson: to Python, a capital letter IS a different letter.',
  },
  {
    id: 'mistake-quotes',
    section: AGENDA[2],
    label: 'Mistake 3 · no quotes',
    element: (
      <ContentSlide
        kicker="Mistake 3 of 4"
        title="No Quotes"
        lead="Without quotes, Python reads the message as code rather than as text."
        lesson={SESSION}
      >
        <CodeOutput
          panes={[
            {
              code: 'print(Hello World!)',
              kind: 'error',
              output: `  File "main.py", line 1
    print(Hello World!)
          ^^^^^^^^^^^
SyntaxError: invalid syntax. Perhaps you forgot a comma?`,
            },
          ]}
          layout="stack"
          outputFontSize={15}
        />
      </ContentSlide>
    ),
    notes:
      'A different error type, and the first one that is NOT a NameError. Worth naming out loud: a SyntaxError means the line broke the language\'s rules, so Python never even started running it.',
  },
  {
    id: 'mistake-bracket',
    section: AGENDA[2],
    label: 'Mistake 4 · bracket',
    element: (
      <ContentSlide
        kicker="Mistake 4 of 4"
        title="An Unclosed Bracket"
        lead="Every bracket you open has to be closed, and Python says exactly which one is missing."
        lesson={SESSION}
      >
        <CodeOutput
          panes={[
            {
              code: 'print("Hello World!"',
              kind: 'error',
              output: `  File "main.py", line 1
    print("Hello World!"
         ^
SyntaxError: '(' was never closed`,
            },
          ]}
          layout="stack"
          outputFontSize={15}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'four-mistakes',
    section: AGENDA[2],
    label: 'All four mistakes',
    element: (
      <StatusPointsSlide
        kicker={AGENDA[2]}
        title="Four Ways to Break One Line"
        lead="Same program, four small changes, two different kinds of error."
        lesson={SESSION}
        items={[
          {
            status: 'error',
            text: 'prnt("Hello World!")',
            code: true,
            detail: 'NameError. Python has no idea what prnt is',
          },
          {
            status: 'error',
            text: 'Print("Hello World!")',
            code: true,
            detail: 'NameError. A capital P is a different name',
          },
          {
            status: 'error',
            text: 'print(Hello World!)',
            code: true,
            detail: 'SyntaxError. Without quotes it is not text',
          },
          {
            status: 'error',
            text: 'print("Hello World!"',
            code: true,
            detail: 'SyntaxError. The bracket was never closed',
          },
        ]}
      />
    ),
    notes:
      'The consolidation, and it only works because the room met all four one at a time first. Point at the split: two NameErrors, two SyntaxErrors.',
  },

  /* ── CONCEPT 4 · PYTHON AS A CALCULATOR ───────────────────────────────── */
  {
    id: 'break-calculator',
    section: AGENDA[3],
    label: 'Divider',
    element: <SectionBreakerSlide index={4} title={AGENDA[3]} lesson={SESSION} />,
    transition: 'fade',
  },
  {
    id: 'addition-first',
    section: AGENDA[3],
    label: 'A calculation',
    element: (
      <ContentSlide
        kicker={AGENDA[3]}
        title="Give print a Calculation"
        lead="The same instruction, handed a sum instead of a message."
        lesson={SESSION}
      >
        <CodeOutput panes={[{ code: 'print(2 + 5)', output: '7' }]} />
      </ContentSlide>
    ),
    notes: 'Python did the arithmetic. Nothing new was learned except what went inside the brackets.',
  },
  {
    id: 'q-quotes',
    section: AGENDA[3],
    label: 'Question · quotes',
    element: (
      <QuestionSlide
        kicker={AGENDA[3]}
        question={'What does print("2 + 5") display?'}
        qualifier="Note the quotes"
        lesson={SESSION}
      />
    ),
    notes:
      'The pause the whole concept turns on. Most of the room will say 7. Let them say it before the next slide.',
  },
  {
    id: 'quotes-decide',
    section: AGENDA[3],
    label: 'Quotes decide',
    element: (
      <ContentSlide
        kicker={AGENDA[3]}
        title="The Quotes Decide"
        lead="In quotes it is text and Python prints it straight back. Without quotes it is a calculation and Python does it."
        lesson={SESSION}
      >
        <CodeOutput
          panes={[
            { label: 'In quotes', code: 'print("2 + 5")', output: '2 + 5' },
            { label: 'No quotes', code: 'print(2 + 5)', output: '7' },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'calculation-syntax',
    section: AGENDA[3],
    label: 'Shape of a calculation',
    element: (
      <CodeSyntaxSlide
        kicker={AGENDA[3]}
        title="The Shape of a Calculation"
        lead="Two numbers, and a symbol saying what to do with them."
        lesson={SESSION}
        language="python"
        parts={[
          { token: '2', label: 'a number', body: 'The value on the left', fill: 'placeholder' },
          {
            token: '+',
            label: 'the operator',
            body: 'The symbol that says which calculation to do',
          },
          { token: '5', label: 'a number', body: 'The value on the right', fill: 'placeholder' },
        ]}
        note={{
          kind: 'note',
          title: 'Operator',
          body: 'The word for that middle symbol. There are four of them in this session.',
        }}
      />
    ),
  },
  {
    id: 'op-add',
    section: AGENDA[3],
    label: 'Addition',
    element: (
      <ContentSlide
        kicker={AGENDA[3]}
        title="Addition Operator"
        lead="Whole numbers, or numbers with a decimal point. The operator does not care."
        lesson={SESSION}
      >
        <CodeOutput
          panes={[
            { label: 'Whole numbers', code: 'print(2 + 5)', output: '7' },
            { label: 'With a decimal', code: 'print(1 + 1.5)', output: '2.5' },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'op-subtract',
    section: AGENDA[3],
    label: 'Subtraction',
    element: (
      <ContentSlide
        kicker={AGENDA[3]}
        title="Subtraction Operator"
        lead="A single minus sign, and the order matters."
        lesson={SESSION}
      >
        <CodeOutput panes={[{ code: 'print(5 - 2)', output: '3' }]} />
      </ContentSlide>
    ),
  },
  {
    id: 'op-multiply',
    section: AGENDA[3],
    label: 'Multiplication',
    element: (
      <ContentSlide
        kicker={AGENDA[3]}
        title="Multiplication Operator"
        lead="An asterisk, not the times sign you wrote at school."
        lesson={SESSION}
      >
        <CodeOutput
          panes={[
            { label: 'Whole numbers', code: 'print(5 * 4)', output: '20' },
            { label: 'With a decimal', code: 'print(5 * 0.5)', output: '2.5' },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'q-division',
    section: AGENDA[3],
    label: 'Question · division',
    element: (
      <QuestionSlide
        kicker={AGENDA[3]}
        question={'6 / 3 is 2. What does print(6 / 3) display?'}
        lesson={SESSION}
      />
    ),
    notes:
      'The one real surprise in the session. The room will say 2, and it is wrong. Do not spoil it before they commit.',
  },
  {
    id: 'op-divide',
    section: AGENDA[3],
    label: 'Division',
    element: (
      <ContentSlide
        kicker={AGENDA[3]}
        title="Division Operator"
        lead="Division always gives a decimal, even when the answer is a whole number."
        lesson={SESSION}
      >
        <CodeOutput panes={[{ code: 'print(6 / 3)', output: '2.0' }]} />
      </ContentSlide>
    ),
    notes:
      '2.0, not 2. This is the seed of the next session: Python is telling you something about the KIND of number it produced, and that has a name.',
  },
  {
    id: 'division-always',
    section: AGENDA[3],
    label: 'Division, always',
    element: (
      <ContentSlide
        kicker={AGENDA[3]}
        title="Every Division, Every Time"
        lead="It is not about whether the division was exact. It is what the operator always does."
        lesson={SESSION}
      >
        <CodeOutput
          panes={[
            { label: 'Not exact', code: 'print(5 / 2)', output: '2.5' },
            { label: 'Exact', code: 'print(4 / 2)', output: '2.0' },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'four-operators',
    section: AGENDA[3],
    label: 'Four operators',
    element: (
      <ContentSlide
        kicker={AGENDA[3]}
        title="The Four Operators"
        lead="One table, and one row that behaves unlike the other three."
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'Operator', weight: 0.7, align: 'center' },
            { label: 'Does', weight: 1.2 },
            { label: 'Example', weight: 1.4 },
            { label: 'Output', weight: 0.9 },
          ]}
          rows={[
            ['+', 'Addition', 'print(2 + 5)', '7'],
            ['-', 'Subtraction', 'print(5 - 2)', '3'],
            ['*', 'Multiplication', 'print(2 * 5)', '10'],
            ['/', 'Division', 'print(6 / 3)', '2.0'],
          ]}
          highlight={[4]}
        />
      </ContentSlide>
    ),
    notes:
      'Row 4 is lit because it is the one that surprises. Every output in this table was produced by running the example.',
  },

  /* ── CLOSING FRAME ────────────────────────────────────────────────────── */
  {
    id: 'recap',
    section: 'Closing',
    label: 'Recap',
    element: (
      <RecapSlide
        kicker="Recap"
        title="What Today Covered"
        lesson={SESSION}
        points={[
          { text: AGENDA[0], sub: 'Software is instructions, code is written instructions, syntax is the rules' },
          { text: AGENDA[1], sub: 'Every field, the top companies, the roles, and one line against six' },
          { text: AGENDA[2], sub: 'print("Hello World!"), and the four ways to break it' },
          { text: AGENDA[3], sub: 'Four operators, and division always giving a decimal' },
        ]}
      />
    ),
  },
  {
    id: 'how-sessions-run',
    section: 'Closing',
    label: 'How sessions run',
    element: (
      <ContentSlide
        kicker="Structured Learning"
        title="How Every Session Runs"
        lead="Four kinds of session, and you get all four."
        lesson={SESSION}
      >
        <EditorialList
          rows={[
            { label: 'Conceptual', body: 'In-depth conceptual knowledge' },
            { label: 'Code Walkthrough', body: 'Writing the implementation from scratch' },
            { label: 'Problem Solving', body: 'Several approaches to the same problem' },
            { label: 'Debugging', body: 'Techniques for finding what went wrong' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      "Course chrome, told AFTER the content and deliberately not on the agenda: how a course runs is not a concept the session taught (rule 20's corollary).",
  },
  {
    id: 'practice-ahead',
    section: 'Closing',
    label: 'Extensive practice',
    element: (
      <ContentSlide
        kicker="Structured Learning"
        title="Extensive Practice"
        lead="Reading code is not learning to write it."
        lesson={SESSION}
        points={[
          { text: 'Programming assignments', sub: 'Short, frequent, and graded' },
          { text: 'Mini projects', sub: 'Something that runs, end to end' },
        ]}
      />
    ),
  },
  {
    id: 'practice',
    section: 'Closing',
    label: 'Practice',
    element: (
      <PracticeSlide
        kicker="Your turn"
        title="Coding Practice Walkthrough"
        prompt="Open the playground and run today's four operators yourself."
        lesson={SESSION}
        tasks={[
          'Display your own name with print',
          'Print the result of 12 * 12',
          'Print 7 / 2, and look at what comes out',
        ]}
      />
    ),
  },
  {
    id: 'quiz-time',
    section: 'Closing',
    label: 'Quiz',
    element: (
      <QuizTimeSlide
        subtitle="One line of Python, four ways to break it, and the operator that never gives a whole number"
        lesson={SESSION}
      />
    ),
    notes:
      'Rule 18: the lone quiz frame sits immediately before the takeaways, so the room finds out what it actually believes before being told what to remember. The frame carries no question: that comes from the quiz tool.',
  },
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Key takeaways',
    element: (
      <KeyTakeawaysSlide
        kicker="Key Takeaways"
        title="What to Remember"
        lesson={SESSION}
        points={[
          { text: AGENDA[0], sub: 'Programming, code, syntax' },
          { text: AGENDA[1], sub: 'Versatile, in demand, and one line instead of six' },
          { text: AGENDA[2], sub: 'print("Hello World!")' },
          { text: AGENDA[3], sub: 'The four arithmetic operators' },
        ]}
      />
    ),
    notes:
      'The four strings are the agenda\'s, from the same constant (rule 20). The subs may summarise; the promised items themselves may not be reworded.',
  },
  {
    id: 'thank-you',
    section: 'Closing',
    label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
    notes:
      'No next-session frame: NEXT_UP was not named at sign-off. Add one before this slide when the next session has a confirmed name.',
  },
]
