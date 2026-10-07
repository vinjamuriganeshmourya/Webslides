import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, QuizTimeSlide, SectionBreakerSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { RecapCards } from './figures/RecapCards'
import { PasswordHook } from './figures/PasswordHook'
import { UnicodeIntro } from './figures/UnicodeIntro'
import { ChrFrame, OrdFrame } from './figures/OrdChr'
import { Ranges } from './figures/Ranges'
import { PrintLoop } from './figures/PrintLoop'
import { Task1 } from './figures/Task1'
import { CompareIntro } from './figures/CompareIntro'
import { Pointer } from './figures/Pointer'
import { CompareMachine } from './figures/CompareMachine'
import { NamesHook } from './figures/NamesHook'
import { Rules } from './figures/Rules'
import { Keywords } from './figures/Keywords'
import { ValidOrNot } from './figures/ValidOrNot'
import { CaseStyles } from './figures/CaseStyles'
import { BestName } from './figures/BestName'
import { Task4 } from './figures/Task4'
import { ExitVote, Takeaways } from './figures/Closing'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { installGestures } from './figures/gestures'

/**
 * PYTHON · "Comparing Strings & Naming Variables" (Programming Foundations, session 18)
 *
 * Built from `Outputs/python/session_plans/18_comparing_strings_naming_variables/plan.md`.
 * The short form:
 *
 * ONE SLIDE PER REFERENCE FRAME. The source is the pedagogy team's deck,
 * `Reference ppt's/18_comparing_strings_naming_variables_student_view_new_design.html`:
 * 27 cards and one divider the presenter walks, 28 frames and 121 states. All
 * 28 are here, in its order. Nothing added, nothing dropped.
 *
 * THE COPY IS THE REFERENCE'S, captured from the rendered page at every press
 * (course rule R2), with content rule 36 on every line (no trailing full stop,
 * one sentence per line). The takeaways title is shortened so it sits on one
 * line (content rule 35), as session 15's was; it says so where it sits.
 *
 * EVERY CODE PANEL SAYS `Python` (content rule 31). EVERY OUTPUT IS A REAL RUN
 * on CPython 3.12.3 (course rule R3); the plan's output table lists them.
 *
 * ONLY TEMPLATE COLOURS (plan decision 4): every tile, bubble, card header and
 * header bar reads `src/design/tokens.ts`. The recap header is the brand tone
 * through the session-local `RecapBrand`.
 *
 * THE REFERENCE'S CONTROLS STAY: `Next` beats are the kit's build steps, slide
 * 14's is labelled `One step` and carries the reference's slider, the timers
 * start only when pressed. True / False, A to D and the four names are
 * clickable so the vote is locked in and the confetti can fire; `Next` is not
 * gated (plan decision 6).
 *
 * NAVIGATION (user, 2026-10-05): the keyboard as the kit has it, plus the
 * two-finger trackpad swipe and the touch swipe, installed once below from
 * session 17's `figures/gestures.ts`, the same file. On a phone the control
 * bar auto-hides (`player.autoHideControls`, this session only for now).
 */

installGestures()

export const comparingStringsMeta: DeckMeta = {
  title: 'Comparing Strings & Naming Variables',
  course: 'Python',
  lesson: 'Comparing Strings & Naming Variables',
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

const SESSION = 'Comparing Strings & Naming Variables'

/** The two agenda items, word for word from the reference. */
const AGENDA = [
  { title: 'Comparing Strings', sub: 'Every letter is a number' },
  { title: 'Naming Variables', sub: 'The rules, and the style' },
]

export const comparingStringsDeck: SlideDef[] = [
  /* ── 1 ───────────────────────────────────────────────────────────── */
  { id: 'welcome', label: 'Welcome', transition: 'fade', element: <BrandSlide greeting="Welcome" lesson={SESSION} /> },

  /* ── 2, 3 · Recap ────────────────────────────────────────────────── */
  {
    id: 'recap',
    section: 'Recap',
    label: 'Where We Left Off',
    element: (
      <RecapBrand
        lesson={SESSION}
        immediate
        title="Where We Left Off"
        points={[
          { text: 'break leaves the loop now', sub: 'The lines after it in the loop do not run' },
          { text: 'continue skips the rest of this pass', sub: 'The loop goes on with its next pass' },
          { text: 'pass does nothing', sub: 'It holds the place of a block you have not written yet' },
        ]}
      />
    ),
  },
  {
    id: 'recap-program',
    section: 'Recap',
    label: 'What does it print?',
    notes: 'Seven presses. Line 3 changes three times; take the output from the room before each second press.',
    element: (
      <Panel kicker="Recap" title="What does it print?" lesson={SESSION}>
        <RecapCards />
      </Panel>
    ),
  },

  /* ── 4 · Hook ────────────────────────────────────────────────────── */
  {
    id: 'password-hook',
    section: 'Hook',
    label: 'The password that says wrong',
    notes: 'Five presses. Beat 4 is the question to the room: which letters are different? Unicode is not named on this frame.',
    element: (
      <Panel kicker="Programming Foundations" title="The password that says wrong" lesson={SESSION}>
        <PasswordHook />
      </Panel>
    ),
  },

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  { id: 'agenda', section: 'Today', label: 'Agenda', element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 to 15 · Comparing Strings ─────────────────────────────────── */
  {
    id: 'unicode',
    section: AGENDA[0].title,
    label: 'Unicode',
    element: (
      <Panel kicker="Python" title="Unicode" lesson={SESSION}>
        <UnicodeIntro />
      </Panel>
    ),
  },
  {
    id: 'ord',
    section: AGENDA[0].title,
    label: 'Finding Unicode Value',
    notes: 'Beat 4 is a guess: ord("a") before the press.',
    element: (
      <Panel kicker="Unicode" title="Finding Unicode Value" lesson={SESSION}>
        <OrdFrame />
      </Panel>
    ),
  },
  {
    id: 'chr',
    section: AGENDA[0].title,
    label: 'Character at Unicode',
    notes: 'Beat 3 is a guess: chr(100) before the press.',
    element: (
      <Panel kicker="Unicode" title="Character at Unicode" lesson={SESSION}>
        <ChrFrame />
      </Panel>
    ),
  },
  {
    id: 'ranges',
    section: AGENDA[0].title,
    label: 'Unicode Ranges',
    element: (
      <Panel kicker="Unicode" title="Unicode Ranges" lesson={SESSION}>
        <Ranges />
      </Panel>
    ),
  },
  {
    id: 'print-loop',
    section: AGENDA[0].title,
    label: 'Printing Characters',
    element: (
      <Panel kicker="Finding Char" title="Printing Characters" lesson={SESSION}>
        <PrintLoop />
      </Panel>
    ),
  },
  {
    id: 'task-1',
    section: AGENDA[0].title,
    label: 'Predict it, then run it',
    notes: 'Worksheet task 1. Five minutes on the timer. Then one press per program.',
    element: (
      <Panel kicker="Worksheet · Task 1" title="Predict it, then run it" lesson={SESSION}>
        <Task1 />
      </Panel>
    ),
  },
  {
    id: 'compare-intro',
    section: AGENDA[0].title,
    label: 'Comparing Strings',
    element: (
      <Panel kicker="Relational Operators" title="Comparing Strings" lesson={SESSION}>
        <CompareIntro />
      </Panel>
    ),
  },
  {
    id: 'pointer',
    section: AGENDA[0].title,
    label: 'Follow the pointer: letter by letter',
    notes: 'The slider picks the second word and restarts the walk. Take True or False from the room before the first One step.',
    element: (
      <Panel kicker="Comparing Strings" title="Follow the pointer: letter by letter" lesson={SESSION}>
        <Pointer />
      </Panel>
    ),
  },
  {
    id: 'compare-machine',
    section: AGENDA[0].title,
    label: 'True or False?',
    notes: 'Worksheet task 2. Hands up for True or False before each run. Level 4 and level 5 are the ones that catch the room.',
    element: (
      <Panel kicker="Predict, then run" title="True or False?" lesson={SESSION}>
        <CompareMachine />
      </Panel>
    ),
  },

  /* ── 16 · Quiz ───────────────────────────────────────────────────── */
  {
    id: 'classroom-quiz',
    section: 'Quiz',
    label: 'Classroom Quiz',
    transition: 'zoom',
    /* The reference's quiz frame, in its own design (course rules R2, R5d), as
       sessions 15 and 16 recorded: its sentence names no topic, so content rule
       28's reason does not apply. */
    element: <QuizTimeSlide lesson={SESSION} kicker="Quiz time" title="Classroom Quiz" subtitle="Time to check what you have learned so far." steps={['Open the quiz on your portal', 'Answer every question on your own', 'We go through the answers together']} />,
  },

  /* ── 17, 18 · Hook and divider for Naming Variables ──────────────── */
  {
    id: 'names-hook',
    section: AGENDA[1].title,
    label: 'The username Instagram refuses',
    notes: 'Five presses. Beat 2 asks the room what is allowed. The app is named in the captions only; the screen carries no mark.',
    element: (
      <Panel kicker="Before the next part" title="The username Instagram refuses" lesson={SESSION}>
        <NamesHook />
      </Panel>
    ),
  },
  { id: 'divider-naming', section: AGENDA[1].title, label: 'Naming Variables', transition: 'zoom', element: <SectionBreakerSlide index="02" kicker={SESSION} title="Naming Variables" lesson={SESSION} /> },

  /* ── 19 to 24 · Naming Variables ─────────────────────────────────── */
  {
    id: 'rules',
    section: AGENDA[1].title,
    label: 'Rules for Naming Variables',
    notes: 'Eight presses: a rule, then its four names marked. Ask the room before each marking press.',
    element: (
      <Panel kicker="Naming Variables" title="Rules for Naming Variables" lesson={SESSION}>
        <Rules />
      </Panel>
    ),
  },
  {
    id: 'keywords',
    section: AGENDA[1].title,
    label: 'Keywords',
    element: (
      <Panel kicker="Naming Variables" title="Keywords" lesson={SESSION}>
        <Keywords />
      </Panel>
    ),
  },
  {
    id: 'task-3',
    section: AGENDA[1].title,
    label: 'Does Python accept this name?',
    notes: 'Worksheet task 3. The room sorts the eight names first; then one press per name.',
    element: (
      <Panel kicker="Worksheet · Task 3" title="Does Python accept this name?" lesson={SESSION}>
        <ValidOrNot />
      </Panel>
    ),
  },
  {
    id: 'case-styles',
    section: AGENDA[1].title,
    label: 'Case Styles',
    element: (
      <Panel kicker="Naming Conventions" title="Case Styles" lesson={SESSION}>
        <CaseStyles />
      </Panel>
    ),
  },
  {
    id: 'best-name',
    section: AGENDA[1].title,
    label: 'Question',
    notes: 'Hands up for A to D before the press. All four are allowed; only C says what is inside.',
    element: (
      <Panel kicker="Naming Variables" title="Question" lesson={SESSION}>
        <BestName />
      </Panel>
    ),
  },
  {
    id: 'task-4',
    section: AGENDA[1].title,
    label: 'Fix the names',
    notes: 'Worksheet task 4. Four minutes. Python reports only the first bad line; the room finds all three.',
    element: (
      <Panel kicker="Worksheet · Task 4" title="Fix the names" lesson={SESSION}>
        <Task4 />
      </Panel>
    ),
  },

  /* ── 25 · Exit question ──────────────────────────────────────────── */
  {
    id: 'exit-question',
    section: AGENDA[1].title,
    label: 'Which name gets no hall?',
    notes: 'Two and a half minutes. Hands up for A to D, then press. D: "Zoya" > "Z" because the shorter one is smaller.',
    element: (
      <Panel kicker="Exit question" title="Which name gets no hall?" lesson={SESSION}>
        <ExitVote />
      </Panel>
    ),
  },

  /* ── 26 · Key takeaways ──────────────────────────────────────────── */
  {
    id: 'takeaways',
    section: 'Key takeaways',
    label: 'Strings and names, in six examples',
    /* The reference's title, "Comparing strings and naming variables, in six
       examples", wraps at 34px Poppins in the 848px header. Content rule 35:
       shorten the words, never the type. */
    element: (
      <Panel kicker="Key takeaways" title="Strings and names, in six examples" lesson={SESSION}>
        <Takeaways />
      </Panel>
    ),
  },

  /* ── 27 · Feedback ───────────────────────────────────────────────── */
  /*
    Session-local (user, 2026-10-06): the supplied QR code, a separator and
    the Google Form in a frame, in one white box. A second variation with a
    native styled form was built beside it and removed the same day on the
    user's word; `figures/FeedbackForm.tsx` has the note.
  */
  {
    id: 'feedback',
    section: 'Close',
    label: 'Feedback',
    notes: 'The Google Form itself, in a frame beside the QR code; it scrolls inside the frame. Needs the network. The QR and the link open the same form.',
    element: <FeedbackEmbedSlide lesson={SESSION} />,
  },

  /* ── 28 · Thank you ──────────────────────────────────────────────── */
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
