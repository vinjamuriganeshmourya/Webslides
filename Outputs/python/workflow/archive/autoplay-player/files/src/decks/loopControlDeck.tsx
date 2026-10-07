import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, FeedbackSlide, QuizTimeSlide, SectionBreakerSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { BugHunt } from './figures/BugHunt'
import { PinHook } from './figures/PinHook'
import { PinFix } from './figures/PinFix'
import { PinBreak } from './figures/PinBreak'
import { ControlCards } from './figures/ControlCards'
import { BreakWalk, FirstLineWalk, InnerBreakWalk } from './figures/Walk'
import { OutsideLoop } from './figures/OutsideLoop'
import { FirstWordTask, ThreeWordsTask } from './figures/Tasks'
import { ReelHook } from './figures/ReelHook'
import { ControlMachinePanel } from './figures/ControlMachine'
import { PassGamePanel } from './figures/PassGame'
import { ExitVote, Takeaways } from './figures/Closing'
import { BreakInIf, BreakNested, BreakShape, ContinueInIf, ContinueShape, PassInLoop, PassShape } from './figures/Syntax'
import { installGestures } from './figures/gestures'

/**
 * PYTHON · "Loop Control Statements" (Programming Foundations, session 17)
 *
 * Built from `Outputs/python/session_plans/17_loop_control_statements/plan.md`
 * under the user's brief of 2026-10-05. The short form:
 *
 * ONE SLIDE PER REFERENCE FRAME. The source is the pedagogy team's lesson plan,
 * `Reference ppt's/17_loop_control_statements_student_view_new_design.html`.
 * Its presenter walks 32 cards: 20 activity panels (`.pcard`) and 12 of the
 * original deck's own slides (`.slide`: three dividers, six syntax frames,
 * three pass frames). All 32 are here, in its order. Nothing added, nothing
 * dropped. The first cut carried the 20 panels only (user, 2026-10-05:
 * "don't miss any content or slide from the reference"); the lesson is in
 * the plan: enumerate the presenter's own list, never one card class.
 *
 * THEN THE PEDAGOGY FEEDBACK OF 2026-10-06 (`Reference ppt's/Loop Control
 * Statements FEEDBACK.pdf`, plan revision 1): 33 slides. The PIN hook shows
 * the app's code beside the phone (4); a new slide has the room fix the bug
 * with what it knows and ends on the plan (5); `break` is first seen fixing
 * that bug, same code, same phone, one new line (10); and the pass section
 * gets a six-round runs-or-crashes game (27) that absorbs the two old pass
 * frames. Every other slide is as it was.
 *
 * THE COPY IS THE REFERENCE'S (course rule R2), with content rule 36 on every
 * line (no trailing full stop, one sentence per line). Not a word changes.
 *
 * EVERY CODE PANEL SAYS `Python` (content rule 31). EVERY OUTPUT IS A REAL RUN
 * on CPython 3.12.3 (course rule R3); the plan's output table lists them.
 *
 * TEMPLATE COLOURS ONLY (user, 2026-10-05, every deck from now on): the recap
 * header takes the brand tone, the takeaway pills are tokens, and no hex from
 * the reference enters this file or its figures.
 *
 * THE REFERENCE'S CONTROLS STAY, press for press, and every interactive
 * element is carried: the walkers' `One step`, the recap's `Show me`, the
 * slider on slide 8, the timers, the vote-then-run machine, the exit vote.
 * The machine's and the exit question's options are clickable here (static
 * on the reference) so the confetti can fire; `Next` is not gated.
 *
 * NAVIGATION: the keyboard as the kit has it, plus two-finger trackpad swipe
 * and touch swipe, installed once below (`figures/gestures.ts`).
 */

installGestures()

export const loopControlMeta: DeckMeta = {
  title: 'Loop Control Statements',
  course: 'Python',
  lesson: 'Loop Control Statements',
  presenter: 'NxtWave Instructor',
}

const SESSION = 'Loop Control Statements'

/** The three agenda items, word for word from the reference. */
const AGENDA = [
  { title: 'Break', sub: 'Leave the loop now' },
  { title: 'Continue', sub: 'Skip the rest of this pass' },
  { title: 'Pass', sub: 'A block that does nothing' },
]

export const loopControlDeck: SlideDef[] = [
  /* ── 1 ───────────────────────────────────────────────────────────── */
  { id: 'welcome', label: 'Welcome', transition: 'fade', element: <BrandSlide greeting="Welcome" lesson={SESSION} /> },

  /* ── 2, 3 · Recap ────────────────────────────────────────────────── */
  {
    id: 'recap',
    section: 'Recap',
    label: 'Where We Left Off',
    /* the kit's recap, with the brand header every other slide has (template colours only) */
    element: (
      <RecapBrand
        lesson={SESSION}
        immediate
        title="Where We Left Off"
        points={[
          { text: 'A nested loop is a loop inside a loop', sub: 'The inner loop runs fully for every outer pass' },
          { text: 'The outer loop moves first', sub: 'Then the inner loop starts again from the top' },
          { text: 'The end of a range decides the rows', sub: 'A wrong end value gives a missing row' },
        ]}
      />
    ),
  },
  {
    id: 'recap-bug',
    section: 'Recap',
    label: 'Recap of nested loops',
    notes: 'The room writes the line number down before any press. Three presses: what it prints, the line and why, what it should print.',
    element: (
      <Panel kicker="Recap" title="Recap of nested loops" lead={<>One line is wrong<br />Write down its number before we look</>} lesson={SESSION}>
        <BugHunt />
      </Panel>
    ),
  },

  /* ── 4, 5 · Hook ─────────────────────────────────────────────────── */
  {
    id: 'pin-that-keeps-asking',
    section: 'Hook',
    label: 'The PIN that keeps asking',
    notes:
      'Set the story up before click 1: "A junior developer built a new payment app. It gives you three tries at your UPI PIN. Let us pay for lunch with it." The junior developer is why the app is allowed to do something odd, and it stops "PhonePe does not do that". Five clicks. Laptops shut. Click 1: ask which line asks for the PIN, and how many times it can ask. Click 4: take answers before the next click. Click 5: the app charges twice; ask which line should have stopped the loop, and what they would write right after line 5. Do not say break.',
    element: (
      <Panel kicker="Programming Foundations" title="The PIN that keeps asking" lesson={SESSION}>
        <PinHook />
      </Panel>
    ),
  },
  {
    id: 'pin-fix-it',
    /* an assignment: pairs work on paper for two minutes before any fix is shown, so under Auto Play this slide starts paused and plays after the first press (user, 2026-10-06) */
    autoPlay: false,
    section: 'Hook',
    label: 'Fix it with what you know',
    notes:
      'Two minutes, pairs, paper. Accept any fix that works. Do not say they are wrong. Say: it works, and look what it cost. If nobody gets there, show A and B as other students\' fixes. Click 2: "It works. What did we have to add?" A second condition, and pin set before the loop. Click 3: "It works. Does the loop stop after paying?" No, it still goes round, it just does nothing. Click 4: "We want one line that says leave now, right here." Never claim it cannot be done without break: someone will prove you wrong.',
    element: (
      <Panel kicker="Hook" title="Fix it with what you know" lesson={SESSION}>
        <PinFix />
      </Panel>
    ),
  },

  /* ── 6, 7 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: 'Loop Control Statements', transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  { id: 'agenda', section: 'Today', label: 'Agenda', element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 8 to 16 · Break ─────────────────────────────────────────────── */
  {
    id: 'control-statements',
    section: AGENDA[0].title,
    label: 'Control Statements',
    notes: 'Four presses, one card each. The fourth card is today: break and continue change the loop from inside.',
    element: (
      <Panel kicker="Loops" title="Control Statements" lead={<>Control statements change <b className="font-bold text-ink">the order</b> your lines run in</>} lesson={SESSION}>
        <ControlCards />
      </Panel>
    ),
  },
  { id: 'divider-break', section: AGENDA[0].title, label: 'Break', transition: 'zoom', element: <SectionBreakerSlide index={1} kicker="Loop Control Statements" title="Break" lesson={SESSION} /> },
  {
    id: 'break-pin-replay',
    section: AGENDA[0].title,
    label: 'The PIN, with break',
    notes:
      'Four clicks. Click 1: let them see the new line before it runs. "One new line, right where you said." Click 3: "break: leave the loop now." Click 4: ask if try 3 happens. If someone says it happens but nothing is typed, go back to click 3 and trace the arrow leaving before try 3 starts.',
    element: (
      <Panel kicker="Loop Control Statements" title="The PIN, with break" lesson={SESSION}>
        <PinBreak />
      </Panel>
    ),
  },
  {
    id: 'break-shape',
    section: AGENDA[0].title,
    label: 'Break',
    notes: 'This is the shape of what we just did. Line 6 of the PIN code is the break here. Trace the green arrow with your hand.',
    element: (
      <Panel kicker="Loop Control Statements" title="Break" lead={<><b className="font-bold text-ink">break</b> makes the program leave a loop early</>} lesson={SESSION} mode="center">
        <BreakShape />
      </Panel>
    ),
  },
  {
    id: 'break-in-if',
    section: AGENDA[0].title,
    label: 'Break, when a condition is true',
    element: (
      <Panel kicker="Loop Control Statements" title="Break" lead={<>Most of the time, <b className="font-bold text-ink">break</b> sits inside an <b className="font-bold text-ink">if</b><br />It runs when the condition is True</>} lesson={SESSION} mode="center">
        <BreakInIf />
      </Panel>
    ),
  },
  {
    id: 'follow-the-break',
    section: AGENDA[0].title,
    label: 'Follow the break',
    notes: 'Ask for the output before the first press. One step per line. The slider changes where the break fires and starts the walk again.',
    element: (
      <Panel kicker="Code walkthrough" title="Follow the break" lesson={SESSION}>
        <BreakWalk />
      </Panel>
    ),
  },
  {
    id: 'break-first-line',
    section: AGENDA[0].title,
    label: 'Break as the very first line',
    notes: 'Four steps. Lines 4 and 5 go grey at the end: they never ran.',
    element: (
      <Panel kicker="Code walkthrough" title="Break as the very first line" lesson={SESSION}>
        <FirstLineWalk />
      </Panel>
    ),
  },
  {
    id: 'break-outside-a-loop',
    section: AGENDA[0].title,
    label: 'Break outside a loop',
    notes: 'Predict first. Beat 2 labels the lines, beat 3 is the error, beat 4 shows continue does the same.',
    element: (
      <Panel kicker="Loop Control Statements" title="Break outside a loop" lesson={SESSION}>
        <OutsideLoop />
      </Panel>
    ),
  },

  {
    id: 'break-nested',
    section: AGENDA[0].title,
    label: 'Break in Nested Loop',
    element: (
      <Panel kicker="Loop Control Statements" title="Break in Nested Loop" lead={<><b className="font-bold text-ink">break</b> in the inner loop stops only the inner loop<br />The outer loop goes on</>} lesson={SESSION} mode="center">
        <BreakNested />
      </Panel>
    ),
  },

  /* ── 17, 18 · Worksheet ──────────────────────────────────────────── */
  {
    id: 'task-1',
    /* a worksheet task: the room works first, so under Auto Play this slide starts paused and plays after the first press (user, 2026-10-06) */
    autoPlay: false,
    section: 'Worksheet',
    label: 'Trace it: break inside the inner loop',
    notes: 'Worksheet task 1. Five minutes on the timer, keyboards off. Then one step per line, 17 steps.',
    element: (
      <Panel kicker="Worksheet · Task 1" title="Trace it: break inside the inner loop" lesson={SESSION}>
        <InnerBreakWalk />
      </Panel>
    ),
  },
  {
    id: 'task-2',
    /* a worksheet task: the room works first, so under Auto Play this slide starts paused and plays after the first press (user, 2026-10-06) */
    autoPlay: false,
    section: 'Worksheet',
    label: 'First word in uppercase',
    notes: 'Worksheet task 2. Six minutes. Then three presses, one run each.',
    element: (
      <Panel kicker="Worksheet · Task 2" title="First word in uppercase" lesson={SESSION}>
        <FirstWordTask />
      </Panel>
    ),
  },

  /* ── 19 · Quiz ───────────────────────────────────────────────────── */
  {
    id: 'classroom-quiz',
    section: 'Quiz',
    label: 'Classroom Quiz',
    transition: 'zoom',
    /* The reference's quiz frame, in its own design (course rules R2, R5d), as
       sessions 15 and 16 recorded: its sentence names no topic, so content
       rule 28's reason does not apply. */
    element: <QuizTimeSlide lesson={SESSION} kicker="Quiz time" title="Classroom Quiz" subtitle="Time to check what you have learned so far." steps={['Open the quiz on your portal', 'Answer every question on your own', 'We go through the answers together']} />,
  },

  /* ── 20 to 29 · Continue and pass ────────────────────────────────── */
  {
    id: 'reel-you-swipe-away',
    section: AGENDA[1].title,
    label: 'A reel you swipe away',
    notes: 'Five presses. Beat 4 is the question: did the feed stop? Take answers before pressing.',
    element: (
      <Panel kicker="Before the next word" title="A reel you swipe away" lesson={SESSION}>
        <ReelHook />
      </Panel>
    ),
  },
  { id: 'divider-continue', section: AGENDA[1].title, label: 'Continue', transition: 'zoom', element: <SectionBreakerSlide index={2} kicker="Loop Control Statements" title="Continue" lesson={SESSION} /> },
  {
    id: 'continue-shape',
    section: AGENDA[1].title,
    label: 'Continue',
    element: (
      <Panel kicker="Loop Control Statements" title="Continue" lead={<><b className="font-bold text-ink">continue</b> skips the rest of this pass<br />The loop starts its next pass</>} lesson={SESSION} mode="center">
        <ContinueShape />
      </Panel>
    ),
  },
  {
    id: 'continue-in-if',
    section: AGENDA[1].title,
    label: 'Continue, when a condition is true',
    element: (
      <Panel kicker="Loop Control Statements" title="Continue" lead={<>Most of the time, <b className="font-bold text-ink">continue</b> sits inside an <b className="font-bold text-ink">if</b><br />It runs when the condition is True</>} lesson={SESSION} mode="center">
        <ContinueInIf />
      </Panel>
    ),
  },
  {
    id: 'break-or-continue-machine',
    /* a vote-then-run machine: the room votes before the first run, so under Auto Play this slide starts paused and plays after the first press (user, 2026-10-06) */
    autoPlay: false,
    section: AGENDA[1].title,
    label: 'Break or continue: what prints?',
    notes: 'Hands up for A, B, C, D before each run. Level 5 is the one that catches the room: continue before the update never stops.',
    element: (
      <Panel kicker="Predict, then run" title="Break or continue: what prints?" lesson={SESSION}>
        <ControlMachinePanel />
      </Panel>
    ),
  },
  { id: 'divider-pass', section: AGENDA[2].title, label: 'Pass', transition: 'zoom', element: <SectionBreakerSlide index={3} kicker="Loop Control Statements" title="Pass" lesson={SESSION} /> },
  {
    id: 'pass-shape',
    section: AGENDA[2].title,
    label: 'Pass: a block that does nothing',
    element: (
      <Panel kicker="Empty blocks" title="Pass" lead={<><b className="font-bold text-ink">pass</b> holds the place of a block<br />When it runs, nothing happens</>} lesson={SESSION} mode="center">
        <PassShape />
      </Panel>
    ),
  },
  {
    id: 'pass-runs-or-crashes',
    /* a vote-then-run game: thumbs before the first run, so under Auto Play this slide starts paused and plays after the first press (user, 2026-10-06) */
    autoPlay: false,
    section: AGENDA[2].title,
    label: 'Runs or crashes?',
    notes: 'Six rounds, about 30 seconds each. Thumbs before every click: up for Runs, down for Crashes. Round 3 catches the room: most think a comment fills the block. Round 5: link back to Break outside a loop.',
    element: (
      <Panel kicker="Predict, then run" title="Runs or crashes?" lesson={SESSION}>
        <PassGamePanel />
      </Panel>
    ),
  },
  {
    id: 'pass-in-loop',
    section: AGENDA[2].title,
    label: 'Pass inside a loop',
    element: (
      <Panel kicker="Loop Control Statements" title="Pass" lead={<><b className="font-bold text-ink">pass</b> does nothing, so 3 is still printed</>} lesson={SESSION} mode="center">
        <PassInLoop />
      </Panel>
    ),
  },
  {
    id: 'task-3',
    /* a worksheet task: the room works first, so under Auto Play this slide starts paused and plays after the first press (user, 2026-10-06) */
    autoPlay: false,
    section: AGENDA[2].title,
    label: 'One line, three words',
    notes: 'Worksheet task 3. Five minutes. Then three presses: pass, continue, break.',
    element: (
      <Panel kicker="Worksheet · Task 3" title="One line, three words" lesson={SESSION}>
        <ThreeWordsTask />
      </Panel>
    ),
  },

  /* ── 30 · Exit ───────────────────────────────────────────────────── */
  {
    id: 'exit-question',
    /* the exit question: a vote with a timer before the answer, so under Auto Play this slide starts paused and plays after the first press (user, 2026-10-06) */
    autoPlay: false,
    section: 'Exit',
    label: 'Which list shows nothing?',
    notes: 'Two and a half minutes. Hands up for A to D, then press. C: 20 is skipped, -1 breaks, 50 is never read.',
    element: (
      <Panel kicker="Exit question" title="Which list shows nothing?" lead={<>A results app reads marks until it meets a minus number<br />It shows only the pass marks</>} lesson={SESSION}>
        <ExitVote />
      </Panel>
    ),
  },

  /* ── 31 · Key takeaways ──────────────────────────────────────────── */
  {
    id: 'takeaways',
    section: 'Key takeaways',
    label: 'break, continue and pass, in five examples',
    element: (
      <Panel kicker="Key takeaways" title="break, continue and pass, in five examples" lesson={SESSION}>
        <Takeaways />
      </Panel>
    ),
  },

  /* ── 32, 33 · Close ──────────────────────────────────────────────── */
  { id: 'feedback', section: 'Close', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} title="We’d love your feedback" /> },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
