import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, QuizTimeSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { RecapSort } from './figures/RecapSort'
import { PlaylistHook } from './figures/PlaylistHook'
import { ListRow } from './figures/ListRow'
import { MakeList } from './figures/MakeList'
import { NestedList } from './figures/NestedList'
import { LenCount } from './figures/LenCount'
import { IndexCursor } from './figures/IndexCursor'
import { LoopItems } from './figures/LoopItems'
import { Task1 } from './figures/Task1'
import { CASE_BEATS, MaggiCase } from './figures/MaggiCase'
import { JoinLists } from './figures/JoinLists'
import { GrowList } from './figures/GrowList'
import { RepeatList } from './figures/RepeatList'
import { Task2 } from './figures/Task2'
import { SliceIntro } from './figures/SliceIntro'
import { SliceWalker, WALKER_BEATS } from './figures/SliceWalker'
import { StepSlice } from './figures/StepSlice'
import { ListFrom } from './figures/ListFrom'
import { SpotError } from './figures/SpotError'
import { CanteenWeek } from './figures/CanteenWeek'
import { ExitVote } from './figures/ExitVote'
import { Takeaways } from './figures/Takeaways'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { installGestures } from './figures/gestures'

/**
 * PYTHON · "Lists" (Programming Foundations, session 19)
 *
 * Built from `Outputs/python/session_plans/19_lists/plan.md`. The short form:
 *
 * ONE SLIDE PER SPEC CARD. The source is the pedagogy team's session spec,
 * `Reference ppt's/19_lists_session_spec.json` (the data) and its reading page
 * `19_lists_session_spec.html`: 23 beats, 29 cards, 75 minutes. All 29 are
 * here, in the spec's order. Nothing added, nothing dropped. Each content
 * slide's body carries `data-spec` and `data-presses`.
 *
 * THE WORDS ARE THE SPEC'S EXACT WORDS (spec rule 5) with content rule 36 on
 * every line: no trailing full stop, one sentence per line. THE CODE AND EVERY
 * OUTPUT ARE THE SPEC'S, re-run on CPython 3.12.3 (course rule R3); the plan's
 * output table lists them. Every code panel says `Python` (content rule 31).
 *
 * ONLY TEMPLATE COLOURS (content rule 37): every box, bin, card and bar reads
 * `src/design/tokens.ts`. The Spotify screen's dark shell and green are the
 * drawn object's own colours and stay inside it, with the comment that says so.
 *
 * THE SPEC'S PRESSES ARE THE KIT'S BUILD STEPS, with session 18's `Next` /
 * `Replay`. Timers are the kit's `Countdown`, started by the instructor. The
 * game's A / B / C and the exit's options are clickable so the vote is locked
 * in; `Next` is never gated. Nothing self-advances (spec rule 1).
 *
 * NAVIGATION (user, 2026-10-05, every deck): keyboard, two-finger trackpad
 * swipe and touch swipe, from session 17's `figures/gestures.ts`.
 */

installGestures()

export const listsMeta: DeckMeta = {
  title: 'Lists',
  course: 'Python',
  lesson: 'Lists',
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

const SESSION = 'Lists'

/** The four agenda stops, word for word from the spec. */
const AGENDA = [
  { title: 'Make a list', sub: 'many values, one name' },
  { title: 'Reach one item', sub: 'len and the position number' },
  { title: 'Join and repeat', sub: '+, += and *' },
  { title: 'Take a part', sub: 'a slice, and the step' },
]

export const listsDeck: SlideDef[] = [
  /* ── 1 · S-WELCOME ───────────────────────────────────────────────── */
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
          { text: 'Every character is stored as a number', sub: 'ord gives the number, chr goes back' },
          { text: 'Strings compare one pair of letters at a time', sub: 'The first different pair decides' },
          { text: 'A variable name uses letters, digits and _', sub: 'Never a digit first, never a keyword' },
        ]}
      />
    ),
  },
  {
    id: 'recap-sort',
    section: 'Recap',
    label: 'True or False?',
    notes: 'Spec S-RECAP, six presses. Read chip 1 out loud; everyone says True or False at once; then press. Chip 2 is the one to slow down on: most rooms say True for "98" <= "123".',
    element: (
      <Panel kicker="Recap" title="True or False?" lead="Say True or False before the chip moves" lesson={SESSION} spec="S-RECAP" presses={6}>
        <RecapSort />
      </Panel>
    ),
  },

  /* ── 4 · H1 · the hook ───────────────────────────────────────────── */
  {
    id: 'road-trip-hook',
    section: 'Hook',
    label: 'Your Road Trip songs',
    notes: 'Spec H1, seven presses. Who has made one of these? Take song1, song2 answers before press 3. Do not name it: the title card does. Press 7 asks what number Python gives song 1; C1 answers.',
    element: (
      <Panel kicker="Programming Foundations" title="Your Road Trip songs" lesson={SESSION} spec="H1" presses={7}>
        <PlaylistHook />
      </Panel>
    ),
  },

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  { id: 'agenda', section: 'Today', label: 'Agenda', element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 to 9 · Make a list ────────────────────────────────────────── */
  {
    id: 'a-list',
    section: AGENDA[0].title,
    label: 'A list',
    notes: 'Spec C1. This is the row from the hook; Python calls it a list. Press 2: who guessed 0?',
    element: (
      <Panel kicker={AGENDA[0].title} title="A list" lesson={SESSION} spec="C1" presses={2}>
        <ListRow />
      </Panel>
    ),
  },
  {
    id: 'making-a-list',
    section: AGENDA[0].title,
    label: 'Making a list',
    notes: 'Spec C2. Line 2 has a in it: a or 2? Output one line per press, only after the room has said it.',
    element: (
      <Panel kicker={AGENDA[0].title} title="Making a list" lesson={SESSION} spec="C2" presses={3}>
        <MakeList />
      </Panel>
    ),
  },
  {
    id: 'list-inside-a-list',
    section: AGENDA[0].title,
    label: 'A list inside a list',
    notes: 'Spec C3. Everyone says the output. Do not count the items yet; C4 asks that.',
    element: (
      <Panel kicker={AGENDA[0].title} title="A list inside a list" lesson={SESSION} spec="C3" presses={2}>
        <NestedList />
      </Panel>
    ),
  },

  /* ── 10 to 14 · Reach one item ───────────────────────────────────── */
  {
    id: 'how-many-items',
    section: AGENDA[1].title,
    label: 'How many items?',
    notes: 'Spec C4. Say a number before each press. The list inside counts as one item.',
    element: (
      <Panel kicker={AGENDA[1].title} title="How many items?" lesson={SESSION} spec="C4" presses={4}>
        <LenCount />
      </Panel>
    ),
  },
  {
    id: 'reaching-one-item',
    section: AGENDA[1].title,
    label: 'Reaching one item',
    notes: 'Spec C5. Ask before each one. Do not show list_a[4]: task 1 lets the room find that out.',
    element: (
      <Panel kicker={AGENDA[1].title} title="Reaching one item" lesson={SESSION} spec="C5" presses={5}>
        <IndexCursor />
      </Panel>
    ),
  },
  {
    id: 'every-item',
    section: AGENDA[1].title,
    label: 'Going through every item',
    notes: 'Spec C6. Everyone says a number of lines; then one pass per press.',
    element: (
      <Panel kicker={AGENDA[1].title} title="Going through every item" lesson={SESSION} spec="C6" presses={5}>
        <LoopItems />
      </Panel>
    ),
  },
  {
    id: 'task-1',
    section: AGENDA[1].title,
    label: 'Predict, then run',
    notes: 'Spec T1, worksheet task 1. Worksheet open, type first, then run; start the timer. Nothing shows until the timer has ended; then one line per press. Who typed something else on line 6? Do not name anyone.',
    element: (
      <Panel kicker="Worksheet" title="Predict, then run" lesson={SESSION} spec="T1" presses={6}>
        <Task1 />
      </Panel>
    ),
  },
  {
    id: 'maggi-case',
    section: AGENDA[1].title,
    label: 'Who took the Maggi?',
    notes: 'Spec G1, fourteen presses. Per clue: hands up for A, B or C, then one run line per press, then the verdict. Round 4 crashes and rules nobody out. Case closed on the last press: the room says the name together.',
    element: (
      <Panel kicker="Game" title="Who took the Maggi?" lesson={SESSION} spec="G1" presses={CASE_BEATS}>
        <MaggiCase />
      </Panel>
    ),
  },

  /* ── 15 · S-QUIZ ─────────────────────────────────────────────────── */
  {
    id: 'quiz',
    section: 'Quiz',
    label: 'Quiz Time!',
    transition: 'zoom',
    notes: 'Spec S-QUIZ. The quiz runs on the portal; five to seven minutes; no question on the slide.',
    element: <QuizTimeSlide lesson={SESSION} kicker="Quiz time" title="Classroom Quiz" subtitle="Time to check what you have learned so far" steps={['Open the quiz on your portal', 'Answer every question on your own', 'We go through the answers together']} />,
  },

  /* ── 16 to 19 · Join and repeat ──────────────────────────────────── */
  {
    id: 'joining-two-lists',
    section: AGENDA[2].title,
    label: 'Joining two lists',
    notes: 'Spec C7. Same as strings: + joins. Say it, then press.',
    element: (
      <Panel kicker={AGENDA[2].title} title="Joining two lists" lesson={SESSION} spec="C7" presses={2}>
        <JoinLists />
      </Panel>
    ),
  },
  {
    id: 'adding-items',
    section: AGENDA[2].title,
    label: 'Adding items to a list',
    notes: 'Spec C8, seven presses. Everyone says what line 5 prints; then one step per press. Point at the new box each time.',
    element: (
      <Panel kicker={AGENDA[2].title} title="Adding items to a list" lesson={SESSION} spec="C8" presses={7}>
        <GrowList />
      </Panel>
    ),
  },
  {
    id: 'repeating-a-list',
    section: AGENDA[2].title,
    label: 'Repeating a list',
    notes: 'Spec C9. Some will say [3, 6]. Take it, do not correct it yet. Not times each number: the whole list, three times.',
    element: (
      <Panel kicker={AGENDA[2].title} title="Repeating a list" lesson={SESSION} spec="C9" presses={2}>
        <RepeatList />
      </Panel>
    ),
  },
  {
    id: 'task-2',
    section: AGENDA[2].title,
    label: 'Type it, change it, run it',
    notes: 'Spec T2, worksheet task 2. Type it, predict, run. Then: I forgot the brackets on line 3. Let them react first; += goes through what is on its right, item by item, and day * 5 is one number. Keep the brackets.',
    element: (
      <Panel kicker="Worksheet" title="Type it, change it, run it" lesson={SESSION} spec="T2" presses={4}>
        <Task2 />
      </Panel>
    ),
  },

  /* ── 20 to 27 · Take a part ──────────────────────────────────────── */
  {
    id: 'taking-part',
    section: AGENDA[3].title,
    label: 'Taking part of a list',
    notes: 'Spec C10. Take answers on press 2; someone may say list_a[0, 1]. Stop before 2, so position 2 is not taken. A slice gives back a list.',
    element: (
      <Panel kicker={AGENDA[3].title} title="Taking part of a list" lesson={SESSION} spec="C10" presses={5}>
        <SliceIntro />
      </Panel>
    ),
  },
  {
    id: 'slice-walker',
    section: AGENDA[3].title,
    label: 'Follow the slice',
    notes: 'Spec E1, eighteen presses. Read the expression out loud, everyone decides, take three answers, then one cursor move per press. The sliders are live between runs; moving one restarts that run.',
    element: (
      <Panel kicker={AGENDA[3].title} title="Follow the slice" lesson={SESSION} spec="E1" presses={WALKER_BEATS}>
        <SliceWalker />
      </Panel>
    ),
  },
  {
    id: 'slicing-with-a-step',
    section: AGENDA[3].title,
    label: 'Slicing with a step',
    notes: 'Spec C11. Use the walker in your head. 0, then 3. 6 is past the end.',
    element: (
      <Panel kicker={AGENDA[3].title} title="Slicing with a step" lesson={SESSION} spec="C11" presses={2}>
        <StepSlice />
      </Panel>
    ),
  },
  {
    id: 'list-function',
    section: AGENDA[3].title,
    label: 'Making a list with list()',
    notes: 'Spec C12. A for loop over Red gives R, e, d; so does list(). Remember where range stops.',
    element: (
      <Panel kicker={AGENDA[3].title} title="Making a list with list()" lesson={SESSION} spec="C12" presses={4}>
        <ListFrom />
      </Panel>
    ),
  },
  {
    id: 'find-the-mistake',
    section: AGENDA[2].title,
    label: 'Find the mistake',
    notes: 'Spec A1. Everyone says what it really prints. Which line? What do you add? Brackets around it: one item, a whole list, like C3.',
    element: (
      <Panel kicker={AGENDA[2].title} title="Find the mistake" lesson={SESSION} spec="A1" presses={4}>
        <SpotError />
      </Panel>
    ),
  },
  {
    id: 'canteen-week',
    section: 'Your turn',
    label: "Ravi's canteen week",
    notes: 'Spec P1, worksheet task 3. Say the hint once: which positions are Monday to Friday? Start the timer. Show the solution only after the timer; point at spend[0:5] and spend[5:7]. Do not mention sum().',
    element: (
      <Panel kicker="Your turn" title="Ravi's canteen week" lesson={SESSION} spec="P1" presses={2}>
        <CanteenWeek />
      </Panel>
    ),
  },
  {
    id: 'exit',
    section: 'Exit',
    label: 'Which one prints no song?',
    notes: 'Spec X1. Everyone answers; count hands for every option. Go through every option, not only the right one.',
    element: (
      <Panel kicker="Exit" title="Which one prints no song?" lesson={SESSION} spec="X1" presses={2}>
        <ExitVote />
      </Panel>
    ),
  },
  {
    id: 'takeaways',
    section: 'Key takeaways',
    label: 'Lists, in six examples',
    notes: 'Spec K1, six presses. Read heading, code, result, sentence.',
    element: (
      <Panel kicker="Key takeaways" title="Lists, in six examples" lesson={SESSION} spec="K1" presses={6}>
        <Takeaways />
      </Panel>
    ),
  },

  /* ── 28, 29 · Close ──────────────────────────────────────────────── */
  /* the standard feedback slide, content rule 41: Python session 18's, copied unchanged (user, 2026-10-06) */
  {
    id: 'feedback',
    section: 'Close',
    label: 'Feedback',
    notes: 'The Google Form itself, in a frame beside the QR code; it scrolls inside the frame. Needs the network. The QR and the link open the same form.',
    element: <FeedbackEmbedSlide lesson={SESSION} />,
  },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
