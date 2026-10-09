import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { ClassroomQuiz } from './figures/ClassroomQuiz'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { SortRecap } from './figures/Recap'
import { LocationHook, SwapHook } from './figures/Hooks'
import { AnyOrder, ByPosition, DefaultsLast, FillSlots, FourCalls, LeaveOneOut, SwapThem, TwoArgs, TwoBoxes, TwoWays } from './figures/Cards'
import { FareTask, RightTrip, Takeaways, TripTask } from './figures/Tasks'
import { AppBroken, G1_PRESSES } from './figures/Game'
import { SPEC } from './figures/spec'
import { installGestures } from './figures/gestures'
import { installSpecKeys } from './figures/keys'

/**
 * PYTHON · "Function Arguments" (Programming Foundations, session 23)
 *
 * Built from `Outputs/python/session_plans/23_function_arguments/plan.md`.
 *
 * ONE SLIDE PER SPEC CARD. The source is the pedagogy team's session spec,
 * `Reference ppt's/23_function_arguments_session_spec.json` (the data) and its
 * reading page `…_spec(1).html`: 23 beats, 25 cards, 75 minutes. All 25 are
 * here, in the spec's order. Each content slide carries `data-spec` and
 * `data-presses` with the spec's press count.
 *
 * THE WORDS ARE THE SPEC'S EXACT WORDS (spec rule 5) with content rule 36 on
 * every line. THE CODE, EVERY STEP, ROUND AND OUTPUT ARE READ FROM THE JSON
 * (`figures/spec.ts`, generated; spec rule 6), and every program was run on
 * CPython 3.12.3 (`scripts/run-spec-programs.py`). Every code panel says
 * `Python` (content rule 31).
 *
 * ONE PICTURE (spec note 5, `figures/slots.tsx`): an argument is a slot in the
 * def's header; a value flies from its word in the call line into its slot,
 * wearing its label (by name) or its number (by position), or `default`.
 *
 * ONE WORLD (spec note 2): Teja's phone, a maps app on directions from the
 * college Main Gate to Ameerpet (`figures/Maps.tsx`), in H1, G1 and H2.
 *
 * THE SPEC'S PRESSES ARE THE BUILD STEPS, with `Next`. The spec's keys work
 * through `figures/keys.ts`. Votes take a click or keys 1 to 4 and never gate
 * the press. Nothing self-advances (spec rule 1): the Autoplay switch is OFF
 * on every slide.
 *
 * THE AGENDA IS STATIC (content rule 44). THE QUIZ SLIDE is session 22's
 * `ClassroomQuiz`, unchanged. NAVIGATION: keyboard, trackpad and touch swipe.
 */

installGestures()
installSpecKeys()

const SESSION = 'Function Arguments'

export const argumentsMeta: DeckMeta = {
  title: SESSION,
  course: 'Python',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/** The four agenda stops and their lines, word for word from the spec. */
const STOPS: string[] = SPEC['S-AGENDA'].show
const AGENDA = [0, 2, 4, 6].map((i) => ({ title: STOPS[i], sub: STOPS[i + 1] }))
const [BY_NAME, BY_POS, DEFAULTS, TWO_BOXES] = AGENDA.map((a) => a.title)

/** A content card: the kit's panel with the spec's id and press count on it. */
const card = (id: string, kicker: string, title: string, body: React.ReactNode) => (
  <Panel kicker={kicker} title={title} lesson={SESSION} spec={id} presses={SPEC[id].press_count}>
    {body}
  </Panel>
)

export const argumentsDeck: SlideDef[] = [
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
          { text: 'def stores a block under a name', sub: 'the block runs only when it is called' },
          { text: 'A call runs the block and comes back', sub: 'greet() jumps to the def, then back to the call' },
          { text: 'return hands a value back to the call', sub: 'print shows it; return alone prints nothing' },
        ]}
      />
    ),
  },
  {
    id: 'recap-sort',
    section: 'Recap',
    label: 'Prints something, or nothing?',
    notes: 'Spec S-RECAP, six presses. Five programs from last class. Decide each one in your head first. For each chip: how many think prints something? Hands down. Prints nothing? Then press. Nobody is named.',
    element: card('S-RECAP', 'Recap', SPEC['S-RECAP'].heading, <SortRecap />),
  },

  /* ── 4 · H1 · the hook ───────────────────────────────────────────── */
  {
    id: 'swap-hook',
    section: 'Hook',
    label: 'The swap button',
    notes: 'Spec H1, six presses. Everyone has used this. Two places typed in. Which way does the route go? Press 2: she filled the bottom box first. Does the order she typed change the trip? Press 3: Teja taps this by mistake. Take three answers. Correct nobody. Press 4: nothing was deleted, nothing new was typed, the app did not warn her, yet the trip is wrong. Press 5: not by the name of the place. Then by what? Press 6: hold this picture, two slots, filled in order. What do you think today is about?',
    element: card('H1', 'Programming Foundations', SPEC.H1.heading, <SwapHook />),
  },

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  /* Static, as sessions 19 to 22 (content rule 44). */
  { id: 'agenda', section: 'Today', label: 'Agenda', notes: 'Spec S-AGENDA. Read each stop and its line, nothing more.', element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7, 8 · By name ──────────────────────────────────────────────── */
  {
    id: 'two-args',
    section: BY_NAME,
    label: 'More than one argument',
    notes: 'Spec C1, three presses. Last class: greet(word). Today: two slots. Press 2: say the output out loud. Press 3: arg_1=greeting, the value of greeting goes into arg_1.',
    element: card('C1', BY_NAME, SPEC.C1.heading, <TwoArgs />),
  },
  {
    id: 'any-order',
    section: BY_NAME,
    label: 'By name, any order',
    notes: 'Spec C2, two presses. Same? Hands up. Different? Hands up. Press 2: like Teja typing Ameerpet first in the hook. The box has a label.',
    element: card('C2', BY_NAME, SPEC.C2.heading, <AnyOrder />),
  },

  /* ── 9 to 15 · By position ───────────────────────────────────────── */
  {
    id: 'by-position',
    section: BY_POS,
    label: 'No names: by position',
    notes: 'Spec C3, two presses. No labels this time. How does Python know? Take ideas. Press 2: like the two slots at the end of the hook.',
    element: card('C3', BY_POS, SPEC.C3.heading, <ByPosition />),
  },
  {
    id: 'two-ways',
    section: BY_POS,
    label: 'Two names for two ways',
    notes: 'Spec C4, three presses. Two calls you have seen. What is different? Press 2: by position. Press 3: by name. The name is the keyword.',
    element: card('C4', BY_POS, SPEC.C4.heading, <TwoWays />),
  },
  {
    id: 'swap-them',
    section: BY_POS,
    label: 'Swap them',
    notes: 'Spec C5, two presses. Option A, hands up. B. C. Press 2: the swap button from the hook. Python did what we wrote, not what we meant.',
    element: card('C5', BY_POS, SPEC.C5.heading, <SwapThem />),
  },
  {
    id: 'fill-slots',
    section: BY_POS,
    label: 'Fill the slots',
    notes: 'Spec E1, eighteen presses. Yes, hands up. No, hands up. Then one move per press. Before each value moves: which slot will it land in? Last press: who said yes? Three lines match. Line 9 is the swap.',
    element: card('E1', BY_POS, SPEC.E1.heading, <FillSlots />),
  },
  {
    id: 'leave-one-out',
    section: BY_POS,
    label: 'Leave one out',
    notes: 'Spec C6, five presses. Will it print Good Morning? Or something else? Press 2: read the end of the error, it names the empty slot, arg_2. Press 3: two empty slots, two names in the error. Press 4: arg_2 has a value now. Is that enough? Press 5: it says positional even though we used a name. That is Python\'s word for an argument with no default.',
    element: card('C6', BY_POS, SPEC.C6.heading, <LeaveOneOut />),
  },
  {
    id: 'trip-task',
    section: BY_POS,
    label: 'Task 1: the trip program',
    notes: 'Spec T1, six presses, timer 5:00. Worksheet tab and playground. Type it, type your four predictions, then run. Presses 2 to 5: one line each. Line 9: three lines printed, then Python stopped. end is empty. Press 6: names, so the order we write does not matter.',
    element: card('T1', BY_POS, SPEC.T1.heading, <TripTask />),
  },
  {
    id: 'app-broken',
    section: BY_POS,
    label: 'The app is broken',
    notes: `Spec G1, ${G1_PRESSES} presses over three rounds. Read each option. How many think Line 1? Hands up. Then the next. Keys 1 to 4 or a click mark the room's pick. Each step: read the caption. What does the app show now? At the verdict: read the line for the most popular wrong option, then the fix.`,
    element: card('G1', BY_POS, SPEC.G1.heading, <AppBroken />),
  },

  /* ── 16 · S-QUIZ ─────────────────────────────────────────────────── */
  { id: 'quiz', section: 'Quiz', label: 'Classroom Quiz', transition: 'zoom', notes: 'Spec S-QUIZ. Open the quiz on your portal. Answer every question on your own. Then we go through the answers together.', element: <ClassroomQuiz lesson={SESSION} /> },

  /* ── 17 to 20 · Default values ───────────────────────────────────── */
  {
    id: 'location-hook',
    section: DEFAULTS,
    label: 'Your location, every time?',
    notes: 'Spec H2, four presses. Who fills the top box? Press 2: three trips, the same start typed three times. Press 3: any idea how? Press 4: leave it out, and the def fills it. Like Maps.',
    element: card('H2', DEFAULTS, SPEC.H2.heading, <LocationHook />),
  },
  {
    id: 'four-calls',
    section: DEFAULTS,
    label: 'Default values, four calls',
    notes: 'Spec C7, nine presses. Hi and Ram are written in the def. Then each call: ask it, take answers, press, read the slots, then the output. Call 3, greet(name), prints Teja Ram: leave the surprise to the press.',
    element: card('C7', DEFAULTS, SPEC.C7.heading, <FourCalls />),
  },
  {
    id: 'fare-task',
    section: DEFAULTS,
    label: 'Task 2: Rapido fares',
    notes: 'Spec T2, six presses, timer 6:00. Worksheet tab and playground. Type, predict, run. Press 2: change line 2, remove 12 from the day trips. Press 3: this is how I wrote it in my notes. Change it and run. Let them react first. Press 6: line 1 is a plain print and it still did not run. Python checks the whole file before it runs any line. On Python 3.12 and newer the same error reads: parameter without a default follows parameter with a default.',
    element: card('T2', DEFAULTS, SPEC.T2.heading, <FareTask />),
  },
  {
    id: 'defaults-last',
    section: DEFAULTS,
    label: 'Defaults go last',
    notes: 'Spec C8, two presses. The error you got in Task 2. Press 2: and the fare: def fare(km, rate=12):',
    element: card('C8', DEFAULTS, SPEC.C8.heading, <DefaultsLast />),
  },

  /* ── 21 · Same name, two boxes ───────────────────────────────────── */
  {
    id: 'two-boxes',
    section: TWO_BOXES,
    label: 'Same name, two boxes',
    notes: 'Spec E2, ten presses. 5, hands up. 6, hands up. Then one move per press: which a is Python looking at now? Press 9: numbers and strings are immutable, a += 1 makes a new 6 for the inside box. The outside 5 is untouched. Press 10: last class\'s return. The function hands the 6 back and we store it.',
    element: card('E2', TWO_BOXES, SPEC.E2.heading, <TwoBoxes />),
  },

  /* ── 22 · X1 · Exit ──────────────────────────────────────────────── */
  {
    id: 'exit',
    section: 'Exit',
    label: 'Exit: the right trip',
    notes: 'Spec X1, two presses, timer 2:30. Everyone answers alone. Then option A, hands up. B. C. D. Go through every option, not only the right one.',
    element: card('X1', 'Exit', SPEC.X1.heading, <RightTrip />),
  },

  /* ── 23 · K1 · Takeaways ─────────────────────────────────────────── */
  {
    id: 'takeaways',
    section: 'Close',
    label: 'Today, in six examples',
    notes: 'Spec K1, six presses. Read heading, code, result, sentence.',
    element: card('K1', 'Key takeaways', SPEC.K1.heading, <Takeaways />),
  },

  /* ── 24, 25 · Feedback, Thank you ────────────────────────────────── */
  { id: 'feedback', section: 'Close', label: 'Feedback', transition: 'fade', element: <FeedbackEmbedSlide lesson={SESSION} /> },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
