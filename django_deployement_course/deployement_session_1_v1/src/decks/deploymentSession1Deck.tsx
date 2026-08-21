import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide2027,
  BulletsSlide2027,
  CardsSlide2027,
  ContentSlide2027,
  FeedbackSlide2027,
  HeroWordmarkSlide,
  MgSlide2027,
  PracticeSlide2027,
  QuizQuestionSlide2027,
  SectionBreakerSlide2027,
  TableSlide2027,
  TerminalSlide2027,
  ThankYouSlide2027,
  WelcomeSlide2027,
  mgStageBox,
} from '@/slides/nw2027'
import { MgPlaceholder } from '@/motion/mg/MgStage'
import { nwColors, nwFonts, nwType } from '@/design/nw2027'

/**
 * Deployment · Session 1 — "From Localhost to Anywhere"
 *
 * Generated from the signed-off plan at
 *   `Web Slides/workflow/plans/deployement_session_1_v1.md` (SIGNED OFF 2026-08-11)
 * against the TR doc
 *   `Integration project/deployment/session-1.md`.
 *
 * TWO RULES FROM THE TR DOC GOVERN THIS FILE. Both are easy to break by
 * accident while editing, so they are restated where they bite:
 *
 *   R1 SPOILER DISCIPLINE — the word "Docker", Docker blue, the whale, and the
 *      words image/container must not appear before concept 5. The student
 *      derives the tool's job description from five failed attempts first.
 *      Two TR tables name Docker early; both are masked here as "?" and paid
 *      off on the concept-5 divider (signed off 2026-08-11).
 *
 *   R2 SCOPE DISCIPLINE — this session is Problem 1 (runs anywhere) only. No
 *      slide shows a server, a globe, a public URL, or inbound traffic, except
 *      the two roadmap graphics which show Problem 2 deliberately unbuilt.
 */

export const deploymentSession1Meta: DeckMeta = {
  title: 'From Localhost to Anywhere',
  course: 'React + Django Integration — Deployment',
  lesson: 'From Localhost to Anywhere',
  presenter: 'NxtWave Instructor',
}

/** Footer text on every slide — the session name, never "Session 1". */
const SESSION = 'From Localhost to Anywhere'

/**
 * The eight concepts. Note that 1–4 name no tool: the agenda itself must not
 * spoil the answer the student spends the first half deriving (R1).
 */
const AGENDA = [
  'Where Your App Lives Today',
  'The Shape of the Journey',
  'Why "It Works on My Machine"',
  'What Would Actually Fix It',
  'Meet Docker',
  'Images and Containers',
  'Containers vs Virtual Machines',
  'Getting Docker Running',
]

/** The progress bar has one division per agenda item. */
const progress = (current: number) => ({ total: AGENDA.length, current })

/* ------------------------------------------------------------------ */
/* Small shared bits of slide furniture                                 */
/* ------------------------------------------------------------------ */

/** Inline code, for the many `localhost:5173` / `runserver` mentions. */
function Code({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontFamily: nwFonts.mono,
        fontSize: '0.88em',
        background: 'rgba(45,99,251,0.10)',
        color: nwColors.secondaryBlue,
        borderRadius: 6,
        padding: '2px 10px',
      }}
    >
      {children}
    </span>
  )
}

/**
 * The masked cell standing in for a tool name the student hasn't derived yet.
 * Rendered as a visible question mark rather than a blank, so the class reads
 * it as "withheld" rather than "missing".
 */
function Masked() {
  return (
    <span style={{ color: nwColors.primaryBlue, opacity: 0.75, fontWeight: 700 }}>?</span>
  )
}

/** A dimmed cell — used for the Problem 2 rows this session deliberately parks. */
function Later({ children }: { children: ReactNode }) {
  return <span style={{ opacity: 0.45 }}>{children}</span>
}

/** A stand-in for a graphic, sized exactly as the finished stage will be. */
function Mg({
  id,
  title,
  seconds,
  aside,
}: {
  id: string
  title: string
  seconds: number
  aside?: boolean
}) {
  const geo = mgStageBox(!!aside)
  return <MgPlaceholder id={id} title={title} seconds={seconds} width={geo.width} height={geo.height} />
}

/** A short supporting paragraph in an `MgSlide2027` aside. */
function Note({ title, children }: { title?: ReactNode; children: ReactNode }) {
  return (
    <div>
      {title && (
        <div style={{ ...nwType('subHeadS'), color: nwColors.primaryDarkBlue, marginBottom: 10 }}>
          {title}
        </div>
      )}
      <div style={{ ...nwType('bodyS'), color: nwColors.ink }}>{children}</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* The deck                                                             */
/* ------------------------------------------------------------------ */

export const deploymentSession1Deck: SlideDef[] = [
  /* --- Opening frame ------------------------------------------------ */
  {
    id: 'brand',
    section: 'Opening',
    label: 'Brand',
    element: (
      <HeroWordmarkSlide title="NxtWave" subtitle="React + Django Integration — Deployment" />
    ),
    notes:
      'Brand slide only. No session content — the welcome slide names the session.',
  },
  {
    id: 'welcome',
    section: 'Opening',
    label: 'Welcome',
    element: <WelcomeSlide2027 title={SESSION} />,
    notes: 'Kicker: welcome to today\'s session. Nothing else in the body.',
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: <AgendaSlide2027 kicker={SESSION} title="Agenda" items={AGENDA} progress={progress(1)} />,
    notes:
      'Read items 1-4 without naming any tool. If a student asks "is this Docker?", say the answer is exactly what we are going to derive.',
  },

  /* --- 1. Where Your App Lives Today -------------------------------- */
  {
    id: 'c1-divider',
    section: AGENDA[0],
    label: '01 Divider',
    element: <SectionBreakerSlide2027 title="Where Your App Lives Today" subtitle="Two terminals, one machine" />,
  },
  {
    id: 'c1-two-terminals',
    section: AGENDA[0],
    label: 'Your two terminals',
    element: (
      <TerminalSlide2027
        kicker={SESSION}
        index={1}
        title="Your Two Terminals"
        progress={progress(1)}
        lead="The way you run your project today"
        label="PowerShell"
        fontSize={30}
        lines={[
          { text: 'venv\\Scripts\\activate', kind: 'cmd' },
          { text: 'python manage.py runserver', kind: 'cmd' },
          { text: 'Starting development server at http://127.0.0.1:8000/', kind: 'out' },
          { text: '', kind: 'out' },
          { text: 'npm run dev', kind: 'cmd' },
          { text: 'VITE ready in 412 ms', kind: 'out' },
          { text: '➜  Local: http://localhost:5173/', kind: 'out' },
          { text: '', kind: 'out' },
          { text: 'macOS / Linux: source venv/bin/activate · python3 manage.py runserver', kind: 'note' },
        ]}
      />
    ),
    notes:
      'This session is written for Windows; every command is PowerShell. Flag the macOS/Linux fork on the last line. This is a working full-stack app — every piece is correct. Exactly two things are wrong: it runs on one machine, and nobody else can open it.',
  },
  {
    id: 'c1-localhost',
    section: AGENDA[0],
    label: 'The word "localhost"',
    element: (
      <MgSlide2027
        kicker={SESSION}
        index={2}
        title='The Word "localhost"'
        progress={progress(1)}
        aside={
          <>
            <Note>
              <Code>localhost</Code> means <strong>this machine, and only this machine</strong>. Your
              browser and your servers are neighbours inside one computer, talking over a wire that
              never leaves the box.
            </Note>
            <Note>
              Send <Code>http://localhost:5173</Code> to a friend and their browser looks for a React
              app on <em>their</em> computer, finds nothing, and shows a connection error.
            </Note>
            <Note title="So the goal of this course is one sentence">
              Move this exact application from <Code>localhost</Code> to a public address on the
              internet — and make that move repeatable. That process is called{' '}
              <strong>deployment</strong>.
            </Note>
          </>
        }
      >
        <Mg id="mg-1" title="localhost vs. the Internet" seconds={26} aside />
      </MgSlide2027>
    ),
    notes:
      'Let the animation reach the dissolving request before you say "localhost is not reachable from outside". The point is that they have typed this word a hundred times without picturing it.',
  },
  {
    id: 'c1-two-problems',
    section: AGENDA[0],
    label: 'Two separate problems',
    element: (
      <TableSlide2027
        kicker={SESSION}
        index={3}
        title="Deployment Is Actually Two Separate Problems"
        progress={progress(1)}
        align="left"
        columns={[{ label: '', weight: 0.7 }, { label: '1 — Runs anywhere' }, { label: '2 — Reachable' }]}
        rows={[
          [
            'Question',
            "Will this app start on a machine that isn't mine?",
            <Later key="q">Can a stranger's browser reach it?</Later>,
          ],
          [
            'Enemy',
            'Different OS, versions, libraries',
            <Later key="e">No public address, closed ports, no always-on host</Later>,
          ],
          [
            'Tools',
            // R1: the TR names Docker here. Masked until concept 5.
            <Masked key="t1" />,
            <Later key="t2">AWS EC2, Nginx, ports, domains, CI/CD</Later>,
          ],
          ['Needs internet?', <strong key="n1">No</strong>, <Later key="n2">Yes, by definition</Later>],
        ]}
      />
    ),
    notes:
      'They are solved in that order and you cannot swap them: a public address pointing at an app that will not start is worth nothing. Today is Problem 1 only — we will not touch servers, hosting, addresses or ports, not once. The masked Tools cell is the answer we are about to derive.',
  },

  /* --- 2. The Shape of the Journey ---------------------------------- */
  {
    id: 'c2-divider',
    section: AGENDA[1],
    label: '02 Divider',
    element: <SectionBreakerSlide2027 title="The Shape of the Journey" subtitle="Five stages, two problems" />,
  },
  {
    id: 'c2-truths',
    section: AGENDA[1],
    label: 'Three uncomfortable truths',
    element: (
      <CardsSlide2027
        kicker={SESSION}
        index={4}
        title="Three Uncomfortable Truths"
        progress={progress(2)}
        columns={3}
        cards={[
          {
            title: <><Code>runserver</Code> is not a real server</>,
            body: (
              <>
                Django tells you this every time, and you have probably scrolled past it:{' '}
                <em>“This is a development server. Do not use it in a production setting.”</em> One
                developer, one request at a time.
                <br />
                <br />
                <strong>Problem 1.</strong>
              </>
            ),
          },
          {
            title: <><Code>npm run dev</Code> never ships</>,
            body: (
              <>
                Vite's dev server is a development tool too. What gets deployed is the{' '}
                <strong>build output</strong> from <Code>npm run build</Code> — plain HTML, CSS and
                JS. No Node process, no dev server.
                <br />
                <br />
                <strong>Problem 1.</strong>
              </>
            ),
          },
          {
            title: 'Your laptop is not a server',
            body: (
              <>
                You close the lid. Wi-Fi drops. You reboot. Your IP changes at a café. A real
                application stays up while you sleep.
                <br />
                <br />
                <Later>
                  <strong>Problem 2 — parked until the hosting sessions.</strong>
                </Later>
              </>
            ),
          },
        ]}
      />
    ),
    notes:
      'This is not a criticism of their project — every first full-stack app looks exactly like this. Card 3 is deliberately styled as parked: it belongs to Problem 2.',
  },
  {
    id: 'c2-journey',
    section: AGENDA[1],
    label: 'The shape of the journey',
    element: (
      <TableSlide2027
        kicker={SESSION}
        index={5}
        title="The Shape of the Journey"
        progress={progress(2)}
        align="left"
        columns={[{ label: 'Problem', weight: 0.8 }, { label: 'Stage', weight: 0.6 }, { label: 'Question it answers', weight: 1.6 }, { label: 'Tool', weight: 0.9 }]}
        rows={[
          ['1. Runs anywhere', <strong key="s">Package</strong>, 'How do I bundle my app with everything it needs?', <Masked key="t" />],
          ['1. Runs anywhere', 'Configure', 'How do I run it the production way?', <Masked key="t" />],
          ['1. Runs anywhere', 'Combine', 'How do the frontend, backend and database run together?', <Masked key="t" />],
          [<Later key="p">2. Reachable</Later>, <Later key="s">Host</Later>, <Later key="q">Which always-on machine, at what address?</Later>, <Later key="t">AWS EC2, Nginx</Later>],
          [<Later key="p">2. Reachable</Later>, <Later key="s">Automate</Later>, <Later key="q">How does a git push deploy it by itself?</Later>, <Later key="t">CI/CD</Later>],
        ]}
      />
    ),
    notes:
      'Look at where the line falls. The first three rows never mention the internet. This session is the very first box: packaging. The masked Tool column is what the next two concepts derive.',
  },
  {
    id: 'c2-roadmap',
    section: AGENDA[1],
    label: 'You are here',
    element: (
      <MgSlide2027 kicker={SESSION} index={6} title="You Are Here" progress={progress(2)}>
        <Mg id="mg-2" title="The Deployment Roadmap" seconds={22} />
      </MgSlide2027>
    ),
    notes:
      'This same graphic opens every session in the module with the pin moved. Problem 2 stays visibly dimmed and unbuilt — that is deliberate, so they know it is coming and know it is not today.',
  },

  /* --- 3. Why "It Works on My Machine" ------------------------------ */
  {
    id: 'c3-divider',
    section: AGENDA[2],
    label: '03 Divider',
    element: (
      <SectionBreakerSlide2027
        title={'Why “It Works on My Machine”'}
        subtitle="Git shares your code, not your environment"
      />
    ),
  },
  {
    id: 'c3-conversation',
    section: AGENDA[2],
    label: 'A conversation everywhere',
    element: (
      <ContentSlide2027
        kicker={SESSION}
        index={7}
        title="A Conversation That Happens Everywhere"
        progress={progress(3)}
      >
        <div style={{ display: 'grid', gap: 44, maxWidth: 1380 }}>
          <p style={{ ...nwType('bodyM'), color: nwColors.ink, margin: 0 }}>
            You share the GitHub repo with a teammate. You did everything right — the code is
            pushed, <Code>requirements.txt</Code> is committed, <Code>package.json</Code> is
            committed. They clone it, install, run it, and message you:
          </p>
          <div style={{ display: 'grid', gap: 26 }}>
            <div
              style={{
                ...nwType('subHeadM'),
                color: nwColors.primaryDarkBlue,
                background: '#E9EEF8',
                borderRadius: 28,
                borderBottomLeftRadius: 8,
                padding: '28px 40px',
                justifySelf: 'start',
                maxWidth: 1000,
              }}
            >
              <span style={{ ...nwType('bodyS'), display: 'block', opacity: 0.6, marginBottom: 8 }}>
                Teammate
              </span>
              “The products API crashes the moment I hit it.”
            </div>
            <div
              style={{
                ...nwType('subHeadM'),
                color: nwColors.white,
                background: nwColors.primaryBlue,
                borderRadius: 28,
                borderBottomRightRadius: 8,
                padding: '28px 40px',
                justifySelf: 'end',
                maxWidth: 1000,
              }}
            >
              <span style={{ ...nwType('bodyS'), display: 'block', opacity: 0.8, marginBottom: 8 }}>
                You
              </span>
              “That's strange — it works on my machine.”
            </div>
          </div>
          <p style={{ ...nwType('subHeadL'), color: nwColors.primaryBlue, margin: 0 }}>
            Nobody is lying. Both statements are true at the same time. So what is different?
          </p>
        </div>
      </ContentSlide2027>
    ),
    notes: 'Let the last line sit. Ask the room before advancing.',
  },
  {
    id: 'c3-git-table',
    section: AGENDA[2],
    label: 'Git shares code, not env',
    element: (
      <TableSlide2027
        kicker={SESSION}
        index={8}
        title="Git Shares Your Code, Not Your Environment"
        progress={progress(3)}
        align="left"
        columns={[{ label: 'Dependency', weight: 0.9 }, { label: 'In your project', weight: 1.2 }, { label: 'What can differ', weight: 1.5 }]}
        rows={[
          ['Language runtime', 'Python 3.10', 'Teammate has 3.8 — your match syntax breaks'],
          ['Framework version', 'Django 5.0', "Their pip install grabbed 4.2 — settings differ"],
          ['Python packages', 'DRF, simplejwt, cors-headers', 'A package resolves to a newer, incompatible version'],
          ['Node version', 'Node 20', 'Teammate has Node 16 — the Vite build fails'],
          ['OS libraries', 'What Pillow compiles against', 'Windows got a prebuilt wheel; Linux needs libjpeg-dev first'],
          ['Environment settings', 'SECRET_KEY, DEBUG, CORS_ALLOWED_ORIGINS', "Their .env doesn't exist — it was never committed"],
          [
            'The database itself',
            <Code key="db">db.sqlite3</Code>,
            <strong key="w">It is in .gitignore — they have no file at all</strong>,
          ],
        ]}
      />
    ),
    notes:
      'If any single row differs, the same code behaves differently or refuses to start. The last row is the one nobody thinks about. And a server on AWS is just another machine with its own version of every row — so this is not only a teammate problem, it is THE deployment problem.',
  },
  {
    id: 'c3-mg3',
    section: AGENDA[2],
    label: 'Same code, different ground',
    element: (
      <MgSlide2027
        kicker={SESSION}
        index={9}
        title="The Same Code, Different Ground"
        progress={progress(3)}
        aside={
          <>
            <Note title="Watch what actually moves">
              Only the <strong>Your Code</strong> block crosses the gap. The three layers underneath
              it stay behind.
            </Note>
            <Note title="The part Git never sent">
              The OS, the runtime and the framework are re-supplied by the receiving machine — at
              whatever versions it happens to have.
            </Note>
            <Note>
              The graphic ends on a question, not an answer:{' '}
              <em>what if all four layers travelled together?</em>
            </Note>
          </>
        }
      >
        <Mg id="mg-3" title="Why the Same Code Breaks Elsewhere" seconds={28} aside />
      </MgSlide2027>
    ),
    notes:
      'Do not name a tool here. The asset deliberately ends unlabelled — the elimination in concept 4 supplies the answer.',
  },
  {
    id: 'c3-six-things',
    section: AGENDA[2],
    label: 'Six things below your code',
    element: (
      <CardsSlide2027
        kicker={SESSION}
        index={10}
        title="Six Things That Break Below Your Code"
        progress={progress(3)}
        columns={3}
        dense
        cards={[
          {
            title: 'Path separators',
            body: (
              <>
                Windows <Code>\</Code>, Linux <Code>/</Code>. No <Code>C:</Code> drive on Linux, and{' '}
                <Code>\</Code> is an escape character there — the file “exists” and Python still
                can't find it.
              </>
            ),
          },
          {
            title: 'Case-sensitive filesystems',
            body: (
              <>
                Windows says <Code>Product.jsx</Code> is <Code>product.jsx</Code>. Linux disagrees.
                <br />
                <Code>Module not found</Code>
              </>
            ),
          },
          {
            title: 'Line endings',
            body: (
              <>
                <Code>\r\n</Code> vs <Code>\n</Code>. Your script arrives on the server carrying
                invisible <Code>\r</Code> characters.
                <br />
                <Code>bad interpreter</Code>
              </>
            ),
          },
          {
            title: 'Packages that compile',
            body: (
              <>
                <Code>Pillow</Code> is C code. Ubuntu needs <Code>libjpeg-dev</Code> installed first,
                with <Code>apt</Code> — which <Code>requirements.txt</Code> cannot say.
                <br />
                <Code>gcc failed</Code>
              </>
            ),
          },
          {
            title: 'Processor architecture',
            body: (
              <>
                An M1/M2/M3 Mac is <Code>arm64</Code>; standard EC2 is <Code>x86_64</Code>. Machine
                code for one does not run on the other.
                <br />
                <Code>exec format error</Code>
              </>
            ),
          },
          {
            title: 'Commands and shells',
            body: (
              <>
                <Code>venv\Scripts\activate</Code> vs <Code>source venv/bin/activate</Code>.
                <br />
                <strong>Not one command you have typed runs there as typed.</strong>
              </>
            ),
          },
        ]}
      />
    ),
    notes:
      'Every one of these is a Windows-developer-to-Linux-server problem — not hypothetical, this is what their first deployment will hit. The pattern in all six: these differences live BELOW their code. No amount of care in Django or React removes them.',
  },
  {
    id: 'c3-mg3b',
    section: AGENDA[2],
    label: 'Three machines, one codebase',
    element: (
      <MgSlide2027 kicker={SESSION} index={11} title="Three Machines, One Codebase" progress={progress(3)}>
        <Mg id="mg-3b" title="Three Machines, One Codebase" seconds={34} />
      </MgSlide2027>
    ),
    notes:
      'The identical line runs on three systems and fails two of them at different points. This is why a README full of setup instructions is not a solution — it silently assumes the reader has the same OS, filesystem, shell and processor as the author. Ends on the open question: so what would we have to ship instead?',
  },
  {
    id: 'c3-quiz',
    section: AGENDA[2],
    label: 'Quiz — case sensitivity',
    element: (
      <QuizQuestionSlide2027
        kicker="Quiz"
        progress={progress(3)}
        question={
          <>
            Your React build passes on your Windows laptop and fails on the Linux server with{' '}
            <Code>Module not found: ./components/productcard</Code>. What changed?
          </>
        }
        options={[
          { label: 'The code — someone edited the import' },
          { label: 'The Node version on the server' },
          { label: "The filesystem's case sensitivity", correct: true },
          { label: 'The network between build and server' },
        ]}
        because="Windows treats Product.jsx and product.jsx as the same file; Linux treats them as two. The build has been passing for weeks on a filesystem that was quietly forgiving the typo."
      />
    ),
  },

  /* --- 4. What Would Actually Fix It -------------------------------- */
  {
    id: 'c4-divider',
    section: AGENDA[3],
    label: '04 Divider',
    element: (
      <SectionBreakerSlide2027
        title="What Would Actually Fix It"
        subtitle="How do we share the code together with its entire environment, as one sealed unit?"
      />
    ),
    notes:
      'The real question is not "how do we share code?" — Git answers that. Read the subtitle out in full; it is the question the next four slides answer by elimination.',
  },
  {
    id: 'c4-attempts-12',
    section: AGENDA[3],
    label: 'Attempts 1–2',
    element: (
      <CardsSlide2027
        kicker={SESSION}
        index={12}
        title="Attempts 1 and 2"
        progress={progress(4)}
        columns={2}
        cards={[
          {
            title: '“Write better setup instructions.”',
            body: (
              <>
                Put every step in the README — Python version, Node version,{' '}
                <Code>pip install -r requirements.txt</Code>, <Code>migrate</Code>,{' '}
                <Code>.env.example</Code>.
                <br />
                <br />
                <strong>Why it fails:</strong> instructions are executed by a human on an unknown
                machine. Every line needs a fork per OS, and no README can say “your filesystem must
                start behaving as case-sensitive”. A server can't read a README anyway.
              </>
            ),
          },
          {
            title: '“Pin every version exactly.”',
            body: (
              <>
                Freeze it all: <Code>Django==5.0.1</Code>, <Code>Pillow==10.2.0</Code>, an exact{' '}
                <Code>package-lock.json</Code>.
                <br />
                <br />
                <strong>Why it fails:</strong> genuinely worth doing — but it only fixes the upper
                rows. Pinning Pillow does not install the C libraries it compiles against, nothing
                can pin the SQLite your Python was built with, and pinning does not make Windows
                case-sensitive.
              </>
            ),
          },
        ]}
      />
    ),
    notes:
      'Each attempt fails for a DIFFERENT reason, and those reasons are exactly the requirements the real solution has to meet. Worth ten minutes.',
  },
  {
    id: 'c4-attempts-345',
    section: AGENDA[3],
    label: 'Attempts 3–5',
    element: (
      <CardsSlide2027
        kicker={SESSION}
        index={13}
        title="Attempts 3, 4 and 5"
        progress={progress(4)}
        columns={3}
        cards={[
          {
            title: '“Use a virtual environment.”',
            body: (
              <>
                <Code>python -m venv venv</Code> gives each project its own isolated packages.
                <br />
                <br />
                <strong>Why it fails:</strong> a venv isolates <em>Python packages only</em>. It
                shares the host's interpreter, OS, system libraries and processor. It isn't even
                portable — <Code>venv\Scripts\</Code> does not exist in a Linux venv. The right
                idea, applied at too shallow a depth.
              </>
            ),
          },
          {
            title: '“Give everyone an identical machine.”',
            body: (
              <>
                Standardise the team on one laptop model and one OS, and use that OS on the server.
                <br />
                <br />
                <strong>Why it fails:</strong> organisationally impossible, and it doesn't survive
                contact with reality — a new hire arrives with a different chip, an OS update lands.
                You've replaced a technical problem with a permanent administrative one.
              </>
            ),
          },
          {
            title: '“Ship a whole simulated computer.”',
            body: (
              <>
                Package a complete virtual machine image, OS included. Everyone boots the identical
                system.
                <br />
                <br />
                <strong>Why it fails:</strong> this actually <em>works</em>, and was the industry's
                answer for years. But: several GB per copy, minutes to boot, a full duplicate OS in
                RAM per app. Correct — and far too heavy.
              </>
            ),
          },
        ]}
      />
    ),
    notes:
      'Attempt 5 got the IDEA right and the COST wrong. Everything else got the cost right and the idea wrong. That framing is the hinge of the whole session.',
  },
  {
    id: 'c4-mg3c',
    section: AGENDA[3],
    label: 'Five attempts, five failures',
    element: (
      <MgSlide2027 kicker={SESSION} index={14} title="Five Attempts, Five Failures" progress={progress(4)}>
        <Mg id="mg-3c" title="Five Attempts, Five Failures" seconds={36} />
      </MgSlide2027>
    ),
    notes:
      'The problem column never moves. Watch the coverage grow and the gap shrink. Ends on a short unlabelled block that covers all five bars — the setup for concept 5.',
  },
  {
    id: 'c4-requirements',
    section: AGENDA[3],
    label: 'The five requirements',
    element: (
      <TableSlide2027
        kicker={SESSION}
        index={15}
        title="The Five Requirements You Just Derived"
        progress={progress(4)}
        align="left"
        columns={[{ label: '#', weight: 0.25 }, { label: 'Requirement', weight: 2.4 }, { label: 'Proved by', weight: 0.7 }]}
        rows={[
          ['1', <>Include the <strong>operating system and its libraries</strong>, not just packages</>, '1, 2, 3'],
          ['2', <>Be <strong>executed, not read</strong> — a machine runs it, so no human can skip a step</>, '1'],
          ['3', <>Work <strong>on top of any host OS</strong>, without dictating what the host is</>, '4'],
          ['4', <>Be <strong>lightweight</strong> — megabytes and seconds, not gigabytes and minutes</>, '5'],
          ['5', <>Be <strong>identical every time it runs</strong>, on a laptop and on a server alike</>, 'all'],
        ]}
      />
    ),
    notes:
      'Keep this list. When the tool is introduced, check it against these five rows rather than taking anyone\'s word for it. Nothing they have used so far ticks all five.',
  },

  /* --- 5. Meet Docker ----------------------------------------------- */
  {
    id: 'c5-divider',
    section: AGENDA[4],
    label: '05 Divider',
    element: (
      <SectionBreakerSlide2027
        title="Meet Docker"
        subtitle="The thing you just described already exists"
      />
    ),
    notes:
      'R1 ends here. Point back at the two masked "?" cells from concepts 1 and 2 and fill them in out loud. They did not need Docker introduced as a new topic — they derived its job description from five honest failures.',
  },
  {
    id: 'c5-meets-five',
    section: AGENDA[4],
    label: 'It meets all five',
    element: (
      <TableSlide2027
        kicker={SESSION}
        index={16}
        title="It Meets All Five"
        progress={progress(5)}
        align="left"
        columns={[{ label: 'Requirement you derived', weight: 1 }, { label: 'How Docker meets it', weight: 1.6 }]}
        rows={[
          ['1. Include the OS and its libraries', 'The package ships its own minimal Linux, with the system libraries installed inside it'],
          ['2. Executed, not read', 'The setup steps live in a file Docker runs — nobody can skip a step'],
          ['3. Works on any host OS', 'Runs on Windows, macOS and Linux, and behaves the same on all three'],
          ['4. Lightweight', "It borrows the host's OS kernel instead of duplicating one — megabytes, seconds"],
          ['5. Identical every run', "The package is read-only and versioned, so today's build and next year's are the same"],
        ]}
      />
    ),
    notes:
      'Same five rows, same order as the slide they derived. Requirement 4 is the clever part and is what separates Docker from the VM in attempt 5 — concept 7 comes back to exactly how it pulls that off.',
  },
  {
    id: 'c5-mg4',
    section: AGENDA[4],
    label: 'The shipping container story',
    element: (
      <MgSlide2027 kicker={SESSION} index={17} title="The Shipping Container Story" progress={progress(5)}>
        <Mg id="mg-4" title="Loose Cargo → Standard Container" seconds={30} />
      </MgSlide2027>
    ),
    notes:
      'Before the 1950s cargo shipped loose; loading took days and goods broke at every transfer. Then the industry agreed on one standard steel container: packed once, moved truck→train→ship without ever being reopened. Shipping time collapsed from days to hours. Nothing about the goods changed — only the packaging standard. Have the class count the repacks.',
  },
  {
    id: 'c5-mapping',
    section: AGENDA[4],
    label: 'Shipping ↔ Docker',
    element: (
      <TableSlide2027
        kicker={SESSION}
        index={18}
        title="Shipping World ↔ Docker World"
        progress={progress(5)}
        align="left"
        columns={[{ label: 'Shipping world' }, { label: 'Docker world' }]}
        rows={[
          ['Goods of every shape', 'Your Django app + Python + DRF + OS libraries'],
          ['Standard steel container', <>A Docker <strong>container</strong></>],
          ['Truck / train / ship', "Your laptop / teammate's laptop / AWS server"],
          ['Standardised port cranes', <><strong>Docker Engine</strong>, installed on each machine</>],
          ['“Packed once, opened at destination”', 'Built once, runs identically everywhere'],
        ]}
      />
    ),
  },
  {
    id: 'c5-definition',
    section: AGENDA[4],
    label: 'The definition',
    element: (
      <ContentSlide2027 kicker={SESSION} index={19} title="The Definition" progress={progress(5)}>
        <div style={{ display: 'grid', gap: 40, maxWidth: 1500 }}>
          <p
            style={{
              ...nwType('subHeadXl'),
              color: nwColors.primaryDarkBlue,
              margin: 0,
              borderLeft: `8px solid ${nwColors.primaryBlue}`,
              paddingLeft: 40,
            }}
          >
            <strong>Docker</strong> is a platform that packages an application together with all of
            its dependencies — language runtime, libraries, OS-level packages and configuration —
            into a single standardised unit called a <strong>container</strong>, which runs
            identically on any machine that has Docker installed.
          </p>
          <p style={{ ...nwType('bodyM'), color: nwColors.ink, margin: 0 }}>
            Read that again with your own project in mind: your Django code, Python 3.10, DRF,{' '}
            <Code>simplejwt</Code>, <Code>cors-headers</Code>, and the OS libraries they need — all
            sealed into one unit you can hand to any machine.
          </p>
          <div
            style={{
              ...nwType('bodyS'),
              color: nwColors.ink,
              display: 'grid',
              gap: 12,
              borderTop: '2px solid rgba(45,99,251,0.25)',
              paddingTop: 28,
            }}
          >
            <div>
              <strong>Is this what the industry uses?</strong> Netflix, Spotify and PayPal run their
              services in containers. AWS, Google Cloud and Azure all offer container hosting as a
              first-class service.
            </div>
            <div>
              In Stack Overflow's 2024 Developer Survey, Docker was both the <strong>most used</strong>{' '}
              and <strong>most admired</strong> developer tool, used by more than half of
              professional developers.{' '}
              <span style={{ opacity: 0.6 }}>(Source: Stack Overflow Developer Survey 2024)</span>
            </div>
          </div>
        </div>
      </ContentSlide2027>
    ),
    notes:
      'For a backend or full-stack role, Docker shows up in job descriptions about as often as the framework itself.',
  },

  /* --- 6. Images and Containers ------------------------------------- */
  {
    id: 'c6-divider',
    section: AGENDA[5],
    label: '06 Divider',
    element: (
      <SectionBreakerSlide2027
        title="Images and Containers"
        subtitle="The two words you must not mix up"
      />
    ),
  },
  {
    id: 'c6-class-object',
    section: AGENDA[5],
    label: 'Class and object',
    element: (
      <ContentSlide2027
        kicker={SESSION}
        index={20}
        title="The Two Words You Must Not Mix Up"
        progress={progress(5 + 1)}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'start' }}>
          <div>
            <p style={{ ...nwType('bodyS'), color: nwColors.ink, margin: '0 0 22px' }}>
              Almost every Docker error a beginner hits comes from confusing these two words. Let's
              settle it with something you already know — in Python:
            </p>
            <pre
              style={{
                margin: 0,
                background: '#0E1A2B',
                color: '#EAF1FF',
                borderRadius: 20,
                padding: '32px 34px',
                fontFamily: nwFonts.mono,
                fontSize: 28,
                lineHeight: 1.7,
              }}
            >
{`class Product:      # the blueprint —
    ...             # written once, does not run

p1 = Product()      # a live instance
p2 = Product()      # another, independent one`}
            </pre>
          </div>
          <div style={{ display: 'grid', gap: 20 }}>
            {[
              ['Class', 'Image', 'The blueprint — a frozen, read-only package of app + dependencies'],
              ['Object', 'Container', 'A live, running instance created from an image'],
            ].map(([py, dk, meaning]) => (
              <div
                key={dk}
                style={{
                  background: nwColors.white,
                  borderRadius: 24,
                  padding: '32px 38px',
                  boxShadow: '0 10px 30px -16px rgba(0,42,75,0.20)',
                }}
              >
                <div style={{ ...nwType('subHeadM'), color: nwColors.primaryDarkBlue }}>
                  {py} <span style={{ color: nwColors.primaryBlue }}>→ {dk}</span>
                </div>
                <div style={{ ...nwType('bodyS'), color: nwColors.ink, marginTop: 12 }}>{meaning}</div>
              </div>
            ))}
          </div>
        </div>
      </ContentSlide2027>
    ),
  },
  {
    id: 'c6-image-container',
    section: AGENDA[5],
    label: 'Image vs container',
    element: (
      <CardsSlide2027
        kicker={SESSION}
        index={21}
        title="Image and Container"
        progress={progress(6)}
        columns={2}
        cards={[
          {
            title: 'Image — a read-only template',
            body: (
              <>
                A minimal operating system layer (a slim Linux) · the language runtime (Python 3.10)
                · your application code · every dependency installed and ready.
                <br />
                <br />
                That first bullet is the answer to the six system incompatibilities: the image
                carries its <strong>own</strong> Linux — its own filesystem rules, path separators
                and system libraries. Your code no longer sees the host's Windows at all.
                <br />
                <br />
                <strong>An image does not run.</strong> It sits on disk, like a class definition in a
                file. Nothing is cooking.
              </>
            ),
          },
          {
            title: 'Container — a running instance',
            body: (
              <>
                Created <strong>from</strong> an image · has its own isolated filesystem, processes
                and network · can be started, stopped and deleted without affecting the image it came
                from.
                <br />
                <br />
                Deleting a container does <strong>not</strong> delete its image.
                <br />
                Changes made inside a running container do <strong>not</strong> modify the original
                image.
              </>
            ),
          },
        ]}
      />
    ),
    notes:
      'Point at the visual contrast deliberately: the image is inert, the container is alive. That contrast is the teaching.',
  },
  {
    id: 'c6-mg5',
    section: AGENDA[5],
    label: 'One image, many containers',
    element: (
      <MgSlide2027
        kicker={SESSION}
        index={22}
        title="One Image, Many Containers"
        progress={progress(6)}
        aside={
          <>
            <Note title="One image → many containers">
              Just as one class produces many objects. This is exactly how a real deployment scales:
              the same image, run as three containers, handling three times the traffic.
            </Note>
            <Note title="Where do images come from?">
              <strong>Docker Hub</strong> — a public registry of ready-made official images:{' '}
              <Code>python</Code>, <Code>node</Code>, <Code>nginx</Code>, <Code>ubuntu</Code>. Think
              GitHub, but for images.
              <br />
              <br />
              <strong>Built by you</strong> — with a file called a <Code>Dockerfile</Code>. That is
              the next session.
            </Note>
          </>
        }
      >
        <Mg id="mg-5" title="One Image, Many Containers" seconds={26} aside />
      </MgSlide2027>
    ),
    notes:
      'Students who only see a static diagram keep saying "run the image" and "delete the container\'s image" for weeks. Let the animation land: the grey slab never changes.',
  },

  /* --- 7. Containers vs Virtual Machines ---------------------------- */
  {
    id: 'c7-divider',
    section: AGENDA[6],
    label: '07 Divider',
    element: (
      <SectionBreakerSlide2027
        title="Containers vs Virtual Machines"
        subtitle="Back to attempt 5 — and how the weight disappeared"
      />
    ),
  },
  {
    id: 'c7-structural',
    section: AGENDA[6],
    label: 'The structural difference',
    element: (
      <MgSlide2027
        kicker={SESSION}
        index={23}
        title="The Structural Difference"
        progress={progress(7)}
        aside={
          <>
            <Note title="Read it in one line">
              <strong>VMs duplicate the operating system; containers share it.</strong> Containers
              use the host's OS kernel and package only the app plus its dependencies.
            </Note>
            <Note title="Attempt 5, revisited">
              The VM met four of your five requirements and failed only on weight. Requirement 4 is
              satisfied here by <em>sharing</em> — not by cutting anything the app needs.
            </Note>
            <Note>
              In practice they are combined: an AWS EC2 instance <em>is</em> a VM, and you run
              containers inside it. That is exactly the setup this course builds towards.
            </Note>
          </>
        }
      >
        <Mg id="mg-6" title="Duplicated OS vs Shared Kernel" seconds={30} aside />
      </MgSlide2027>
    ),
    notes:
      'Containers did not replace VMs — they solve a related but different problem. The EC2 beat at the end is a machine, not a public address: still Problem 1.',
  },
  {
    id: 'c7-comparison',
    section: AGENDA[6],
    label: 'Comparison',
    element: (
      <TableSlide2027
        kicker={SESSION}
        index={24}
        title="Comparison"
        progress={progress(7)}
        align="left"
        columns={[{ label: 'Aspect', weight: 0.8 }, { label: 'Virtual Machine' }, { label: 'Docker Container' }]}
        rows={[
          ['Contains', 'App + full guest OS', 'App + dependencies only'],
          ['Typical size', <strong key="a">Gigabytes</strong>, <strong key="b">Megabytes</strong>],
          ['Startup time', <strong key="a">Minutes</strong>, <strong key="b">Seconds</strong>],
          ['Resource usage', 'Heavy — RAM/CPU reserved up front', 'Light — shared kernel'],
          ['Isolation', 'Complete (hardware-level)', 'Process-level'],
        ]}
      />
    ),
    notes:
      'The size and startup rows ARE requirement 4 from the list they derived, finally satisfied. Call back to that slide explicitly.',
  },
  {
    id: 'c7-kernel',
    section: AGENDA[6],
    label: 'Kernel vs userland',
    element: (
      <MgSlide2027
        kicker={SESSION}
        index={25}
        title="Kernel vs Userland — and Windows"
        progress={progress(7)}
        aside={
          <>
            <Note title="If this feels contradictory…">
              “The image ships its own Linux, but the container shares the host's kernel.” An OS has
              two parts: the <strong>kernel</strong> (which talks to hardware) and the{' '}
              <strong>userland</strong> (libraries, file layout, tools). A container brings its own
              userland and borrows the host's kernel.
            </Note>
            <Note title="On Windows there is one extra layer">
              Linux containers need a Linux kernel to borrow, and Windows has none. So Docker
              Desktop runs a single, very small Linux VM using <strong>WSL 2</strong>, and every
              container shares that one kernel.
            </Note>
            <Note>
              You pay for one lightweight kernel <em>once</em>, at install time — not one guest OS
              per app, which is exactly the cost attempt 5 could not avoid.
            </Note>
          </>
        }
      >
        <Mg id="mg-6b" title="The WSL 2 Kernel Slab" seconds={8} aside />
      </MgSlide2027>
    ),
    notes:
      'This is why Docker Desktop asks you to enable WSL 2, and why it must be running before any docker command works — which is exactly the error they will hit in the next concept.',
  },

  /* --- 8. Getting Docker Running ------------------------------------ */
  {
    id: 'c8-divider',
    section: AGENDA[7],
    label: '08 Divider',
    element: (
      <SectionBreakerSlide2027
        title="Getting Docker Running"
        subtitle="Install · start · verify — the only hands-on part of today"
      />
    ),
    notes:
      'Deliberately small. Nothing installed here goes anywhere near the internet — still Problem 1. Doing it now means the next session starts with Dockerfile on line 1 instead of forty minutes of setup.',
  },
  {
    id: 'c8-what-installing',
    section: AGENDA[7],
    label: 'What you are installing',
    element: (
      <TableSlide2027
        kicker={SESSION}
        index={26}
        title="What You Are Installing"
        progress={progress(8)}
        align="left"
        columns={[{ label: 'Piece', weight: 0.9 }, { label: 'What it is', weight: 1.3 }, { label: 'Why you need it', weight: 1.4 }]}
        rows={[
          ['Docker Engine', 'The background service that builds images and runs containers', 'This is “Docker” — everything else is packaging around it'],
          ['The docker command', 'The CLI you type into PowerShell', 'How you talk to the engine'],
          ['WSL 2 Linux kernel', 'A single small Linux kernel, shared by every container', 'Containers need a Linux kernel to borrow, and Windows does not have one'],
        ]}
      />
    ),
    notes:
      'macOS: the same installer with a built-in Linux VM in place of WSL 2. Linux: no Desktop at all — you install the engine directly with sudo apt install docker.io, which is exactly what you will do on the EC2 server much later.',
  },
  {
    id: 'c8-steps-12',
    section: AGENDA[7],
    label: 'Steps 1–2',
    element: (
      <TerminalSlide2027
        kicker={SESSION}
        index={27}
        title="Step 1 — Enable WSL 2 · Step 2 — Install Docker Desktop"
        progress={progress(8)}
        lead="Open PowerShell as Administrator (right-click → Run as administrator)"
        label="PowerShell (Administrator)"
        fontSize={28}
        lines={[
          { text: 'wsl --install', kind: 'cmd' },
          { text: 'Reboot when it asks. If WSL is already installed, wsl --update is enough.', kind: 'note' },
          { text: '', kind: 'out' },
          { text: 'If this fails with a virtualisation error, enable Intel VT-x or AMD-V in BIOS/UEFI.', kind: 'note' },
          { text: 'You do NOT need a Linux distro or any Linux commands. Docker uses the kernel only.', kind: 'note' },
          { text: '', kind: 'out' },
          { text: 'Then: docker.com/products/docker-desktop → Docker Desktop for Windows', kind: 'out' },
          { text: 'Leave "Use WSL 2 instead of Hyper-V" ticked — it matches what you just enabled.', kind: 'out' },
          { text: 'Log out or restart when it finishes.', kind: 'out' },
        ]}
      />
    ),
    notes:
      'Docker Desktop is a large download (several hundred MB) and takes a few minutes. Start it NOW rather than at the beginning of the next session.',
  },
  {
    id: 'c8-steps-34',
    section: AGENDA[7],
    label: 'Steps 3–4',
    element: (
      <TerminalSlide2027
        kicker={SESSION}
        index={28}
        title="Step 3 — Start It and Wait · Step 4 — Verify"
        progress={progress(8)}
        lead="Wait for the status indicator to turn green and read “Engine running”"
        label="PowerShell"
        fontSize={26}
        lines={[
          { text: 'Installed and running are not the same thing. This is the step people skip.', kind: 'note' },
          { text: '', kind: 'out' },
          { text: 'docker --version', kind: 'cmd' },
          { text: 'Docker version 27.0.3, build 7d4bcd8', kind: 'out' },
          { text: '', kind: 'out' },
          { text: 'docker run hello-world', kind: 'cmd' },
          { text: "Unable to find image 'hello-world:latest' locally", kind: 'out' },
          { text: 'latest: Pulling from library/hello-world', kind: 'out' },
          { text: 'c9c5fd25a1bd: Pull complete', kind: 'out' },
          { text: 'Status: Downloaded newer image for hello-world:latest', kind: 'out' },
          { text: '', kind: 'out' },
          { text: 'Hello from Docker!', kind: 'out', tone: 'success' },
          { text: 'This message shows that your installation appears to be working correctly.', kind: 'out', tone: 'success' },
        ]}
      />
    ),
    notes:
      'If you see Hello from Docker!, you are done — your machine can now run containers. Verify these two outputs against a real run before presenting.',
  },
  {
    id: 'c8-mg7',
    section: AGENDA[7],
    label: 'Read your own output',
    element: (
      <MgSlide2027
        kicker={SESSION}
        index={29}
        title="Read Your Own Output"
        progress={progress(8)}
        aside={
          <>
            <Note title="You can already read that output">
              Docker looked for an <strong>image</strong> called <Code>hello-world</Code>, did not
              find one, pulled it from <strong>Docker Hub</strong>, then created a{' '}
              <strong>container</strong> from it. The container printed one line and exited.
            </Note>
            <Note title="The most common Windows error">
              <Code>error during connect … cannot find the file specified</Code> means exactly one
              thing: Docker Desktop is not running. Go back to step 3.
            </Note>
            <Note title="The first thing Docker buys you">
              Every <Code>docker</Code> command is <strong>the same everywhere</strong> — PowerShell,
              CMD, macOS zsh, Linux bash. Look back at the shell table from earlier, where every
              single row had to fork per OS. And you have not even written a Dockerfile yet.
            </Note>
          </>
        }
      >
        <Mg id="mg-7" title="What Docker Desktop Put on Your Machine" seconds={18} aside />
      </MgSlide2027>
    ),
    notes:
      'On Linux — which is what their EC2 server will be — a "permission denied" error instead means the command needs sudo, or the user must be added to the docker group. That comes up again in the EC2 session.',
  },
  {
    id: 'c8-quiz',
    section: AGENDA[7],
    label: 'Quiz — rm and images',
    element: (
      <QuizQuestionSlide2027
        kicker="Quiz"
        progress={progress(8)}
        question={
          <>
            You run <Code>docker rm</Code> on a container built from the <Code>python:3.10</Code>{' '}
            image. What happens to the image?
          </>
        }
        options={[
          { label: 'It is deleted along with the container' },
          { label: 'It is deleted once no containers remain' },
          { label: 'Nothing — the image is untouched', correct: true },
          { label: 'It becomes read-write' },
        ]}
        because="An image is the read-only blueprint. Deleting an object never deletes its class — and you can create a fresh container from the same image immediately."
      />
    ),
  },

  /* --- Closing frame ------------------------------------------------ */
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Key takeaways',
    element: (
      <BulletsSlide2027
        kicker={SESSION}
        title="Key Takeaways"
        progress={progress(8)}
        points={[
          'You can name the two problems deployment actually is — runs anywhere, then reachable — and say which one today solved.',
          'You can place any deployment tool on the five-stage journey, and say which of the two problems it belongs to.',
          'You can explain why the same code behaves differently elsewhere: Git shares code, not environment — and six of those differences live below your code entirely.',
          'You can state the five requirements a real fix must meet, and why each of five honest attempts fails a different one.',
          'You can define Docker against those five requirements rather than by slogan.',
          'You can tell an image from a container, and predict what docker rm does to each.',
          'You can explain why a container is megabytes and seconds where a VM is gigabytes and minutes — sharing a kernel, not duplicating an OS.',
          'Docker Desktop is installed and verified on your machine, and you ran one real container end to end.',
        ]}
      />
    ),
    notes:
      'Deliberately a different UI from the agenda arc — the same eight concepts, restated as things they can now do.',
  },
  {
    id: 'gap',
    section: 'Closing',
    label: 'The gap that remains',
    element: (
      <ContentSlide2027 kicker={SESSION} title="The Gap That Remains" progress={progress(8)}>
        <div style={{ display: 'grid', gap: 36, maxWidth: 1480 }}>
          <p style={{ ...nwType('subHeadXl'), color: nwColors.primaryDarkBlue, margin: 0 }}>
            <Code>hello-world</Code> is somebody else's image. Nothing about your Django project has
            been packaged yet — Problem 1 is understood, not yet solved.
          </p>
          <p style={{ ...nwType('bodyM'), color: nwColors.ink, margin: 0 }}>
            To package <strong>your</strong> e-commerce backend, you have to write the recipe that
            tells Docker what to install, what to copy in, and what command to run — a file called
            the <strong>Dockerfile</strong>.
          </p>
          <p style={{ ...nwType('bodyM'), color: nwColors.ink, margin: 0 }}>
            That is the next session: the <Code>docker</Code> commands in full, then turning the
            exact Django + DRF project you already have into an image of your own, running it as a
            container, and hitting your APIs on <Code>localhost:8000</Code> — served by Docker
            instead of <Code>runserver</Code>.
          </p>
          <p style={{ ...nwType('subHeadM'), color: nwColors.primaryBlue, margin: 0 }}>
            Still no internet. Problem 2 does not begin until your app runs anywhere.
          </p>
        </div>
      </ContentSlide2027>
    ),
  },
  {
    id: 'practice',
    section: 'Closing',
    label: 'Practice',
    element: <PracticeSlide2027 title="Before The Next Session" />,
  },
  {
    id: 'practice-tasks',
    section: 'Closing',
    label: 'Practice tasks',
    element: (
      <ContentSlide2027 kicker={SESSION} title="Before the Next Session" progress={progress(8)}>
        <div style={{ display: 'grid', gap: 30, maxWidth: 1560 }}>
          {[
            <>
              <strong>Finish the install</strong> if you did not finish it in class: Docker Desktop
              reaching <strong>Engine running</strong>, <Code>docker --version</Code> responding, and{' '}
              <Code>docker run hello-world</Code> printing its message.{' '}
              <em>The next session cannot start without this.</em>
            </>,
            <>
              <strong>In your own words</strong>, write down the difference between an image and a
              container. If you reach for “class and object”, you have it.
            </>,
            <>
              <strong>Refresh your requirements file</strong> — the next session depends on it:
              <pre
                style={{
                  margin: '16px 0 0',
                  background: '#0E1A2B',
                  color: '#EAF1FF',
                  borderRadius: 16,
                  padding: '22px 26px',
                  fontFamily: nwFonts.mono,
                  fontSize: 24,
                  lineHeight: 1.6,
                }}
              >
{`venv\\Scripts\\activate
python -m pip freeze | Out-File -Encoding utf8 requirements.txt`}
              </pre>
            </>,
          ].map((task, i) => (
            <div key={i} style={{ display: 'flex', gap: 28, alignItems: 'flex-start' }}>
              <span
                className="grid shrink-0 place-items-center"
                style={{
                  ...nwType('subHeadS'),
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  color: nwColors.white,
                  background: nwColors.primaryBlue,
                }}
              >
                {i + 1}
              </span>
              <div style={{ ...nwType('bodyS'), color: nwColors.ink }}>{task}</div>
            </div>
          ))}
          <p style={{ ...nwType('bodyS'), color: nwColors.ink, opacity: 0.75, margin: 0 }}>
            Why <Code>Out-File -Encoding utf8</Code> rather than plain <Code>&gt;</Code>? Older
            PowerShell writes <Code>&gt;</Code> output as UTF-16, and{' '}
            <Code>pip install -r requirements.txt</Code> inside a Linux container cannot read it —
            you get a cryptic parse error on line 1 of a file that looks perfectly fine in your
            editor. That is the encoding problem from earlier, arriving before you even reach the
            server.
          </p>
        </div>
      </ContentSlide2027>
    ),
  },
  {
    id: 'feedback',
    section: 'Closing',
    label: 'Feedback',
    element: <FeedbackSlide2027 />,
  },
  {
    id: 'thank-you',
    section: 'Closing',
    label: 'Thank you',
    element: (
      <ThankYouSlide2027
        title="Thank You!"
        subtitle="Next: the docker commands in full — then your own Django project as an image"
      />
    ),
  },
]
