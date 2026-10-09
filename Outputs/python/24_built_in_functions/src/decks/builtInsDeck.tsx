import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { ClassroomQuiz } from './figures/ClassroomQuiz'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { RecapTiles } from './figures/Recap'
import { NotebookHook } from './figures/NotebookHook'
import { DefaultList, NewList, PassList } from './figures/PassList'
import { Task1, Task2 } from './figures/Tasks'
import { Classify } from './figures/Classify'
import { ScreenTimeHook } from './figures/ScreenTime'
import { BuiltInList, MinMax, SortedCard, SumCard } from './figures/Builtins'
import { InsideBuiltin } from './figures/Inside'
import { ExitPlan } from './figures/Exit'
import { Takeaways } from './figures/Takeaways'
import { installGestures } from './figures/gestures'
import { installSpecKeys } from './figures/keys'

/**
 * PYTHON · "Built-in Functions" (Programming Foundations, session 24)
 *
 * Built from `Outputs/python/session_plans/24_built_in_functions/plan.md`.
 *
 * ONE SLIDE PER SPEC CARD. The source is the pedagogy team's session spec,
 * `Reference ppt's/24_built_in_functions_session_spec 1(new).json` (the data) and
 * its reading page `…_spec 1(new).html`: 23 beats, 23 cards, 75 minutes. All 23 are here,
 * in the spec's order; the spec has no divider cards and none are invented.
 * Each content slide carries `data-spec` and `data-presses` with the spec's
 * press count.
 *
 * THE WORDS ARE THE SPEC'S EXACT WORDS (spec rule 5) with content rule 36 on
 * every line. THE CODE, EVERY TRACE STEP, ROUND AND OUTPUT ARE READ FROM THE
 * JSON (`figures/spec.ts`, generated; spec rule 6), and every program was run
 * on CPython 3.12.3 (course rule R3; the plan's outputs section). Every code
 * panel says `Python` (content rule 31).
 *
 * ONE PICTURE FOR THE FIRST HALF (spec note 5): a name is a tag with an arrow
 * to a list; a call opens its own area; the lists sit in one shared column;
 * a default list sits on the def's own shelf (`figures/scope.tsx`).
 *
 * ONE WORLD (spec note 2): exam week for Ravi. Ravi's notebook and Priya's
 * xerox in the first half, his screen time that week in the second; his
 * uncle's bike's number plate in task 2. Those drawn things keep their own colours; everything else is the
 * template's (content rule 37).
 *
 * THE SPEC'S PRESSES ARE THE KIT'S BUILD STEPS. Keys (build contract 3):
 * arrows one press, F full screen, A all cards, End the whole card, 1 to 4 a
 * vote (`figures/keys.ts`). AUTOPLAY IS OFF ON EVERY SLIDE (spec rule 1: "No
 * autoplay"); the switch stays so the decks match. Movement inside one press
 * plays only when the press is reached going forward.
 *
 * THE AGENDA IS STATIC (content rule 44). THE QUIZ is `ClassroomQuiz`.
 * NAVIGATION: keyboard, trackpad swipe and touch swipe (`figures/gestures.ts`).
 */

installGestures()
installSpecKeys()

const SESSION = 'Built-in Functions'

export const builtInsMeta: DeckMeta = {
  title: SESSION,
  course: 'Python',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/** The three agenda stops, word for word from the spec. */
const AGENDA = [
  { title: 'Passing a list', sub: 'the function gets your list, not a copy' },
  { title: 'Built-in functions', sub: 'min, max, sum, sorted' },
  { title: 'Code walkthrough', sub: 'the lucky number plate' },
]

export const builtInsDeck: SlideDef[] = [
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
          { text: 'A default fills an argument we leave out', sub: 'def greet(arg_1="Hi", arg_2="Ram")' },
          { text: 'One value, by position, goes to arg_1', sub: 'a value by name goes to that parameter' },
          { text: 'A function gets its own a', sub: 'a += 1 inside never reaches the a outside' },
        ]}
      />
    ),
  },
  {
    id: 'recap-tiles',
    section: 'Recap',
    label: 'What will it print?',
    notes: 'Spec S-RECAP, seven presses. Three quick ones from last class. On each lit line: what does it print? Say it together. Then the tile turns: read the why line. On tile 3: hold on to this one. Today we hand in a list. No hands counted.',
    element: (
      <Panel kicker="Recap" title="What will it print?" lesson={SESSION} spec="S-RECAP" presses={7}>
        <RecapTiles />
      </Panel>
    ),
  },

  /* ── 4 · H1 · the hook ───────────────────────────────────────────── */
  {
    id: 'notebook-hook',
    section: 'Hook',
    label: 'The exam is on Monday',
    notes: "Spec H1, six presses. Ravi missed one class before the exam. What do you do when you miss a class? (Borrow notes, ask a friend. Take three or four answers. Correct nobody.) Press 2: how many of you think yes, Unit 3 is in it? Hands up. How many think no? Hands up. Press 3: of course it is there. She had his notebook itself, not a photo of it. Press 4: this time she copies it first and writes on the copy. Is Unit 4 in Ravi's notebook? Yes, hands up. No, hands up. Press 5: two books now. Writing on one does not show in the other. Ravi still has no Unit 4. Press 6: hold this picture: one book with two names on it, or two books. What do you think today is about?",
    element: (
      <Panel kicker="Programming Foundations" title="The exam is on Monday" lesson={SESSION} spec="H1" presses={6}>
        <NotebookHook />
      </Panel>
    ),
  },

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  /* Static, as sessions 19 to 22: no step-through, no selected point, no Next (content rule 44). */
  { id: 'agenda', section: 'Today', label: 'Agenda', notes: 'Spec S-AGENDA. Read each stop and its line, nothing more.', element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 to 11 · Passing a list ────────────────────────────────────── */
  {
    id: 'pass-list',
    section: AGENDA[0].title,
    label: 'Passing a list',
    notes: "Spec C1, nine presses. Press 1: like Ravi's notebook in Priya's hands. One list, two names. Press 2: how many think the first? Hands up. How many think the second? Hands up. Then before each press: which list does this name point at? Last press: last class a += 1 did not reach outside. A list is mutable: += changes it in place, and ravi sees it. (Say mutable once, as: a list can change in place.)",
    element: (
      <Panel kicker={AGENDA[0].title} title="Passing a list" lesson={SESSION} spec="C1" presses={9}>
        <PassList />
      </Panel>
    ),
  },
  {
    id: 'new-list',
    section: AGENDA[0].title,
    label: 'One change on line 2',
    notes: "Spec C2, eight presses. Only line 2 changed. How many think the first? Hands up. The second? Hands up. Then: watch line 2. Does list_x's arrow move? Last press: like Priya writing on the xerox. You saw this in session 20: + builds a new list.",
    element: (
      <Panel kicker={AGENDA[0].title} title="One change on line 2" lesson={SESSION} spec="C2" presses={8}>
        <NewList />
      </Panel>
    ),
  },
  {
    id: 'task-1',
    section: AGENDA[0].title,
    label: 'Priya writes Unit 4',
    notes: "Spec T1, six presses, timer 6:00. Worksheet tab and playground. Type it, type your prediction, then run. Press 2: only line 2. Predict before you run. Press 3: now print inside the function and outside. After the timer: press 4, += : his own notebook. Unit 4 is in it. Press 5, + : the xerox. Ravi's list is as it was. Press 6, inside, notes points at the new list with Unit 4. Outside, ravi never moved.",
    element: (
      <Panel kicker={AGENDA[0].title} title="Priya writes Unit 4" lesson={SESSION} spec="T1" presses={6}>
        <Task1 />
      </Panel>
    ),
  },
  {
    id: 'classify',
    section: AGENDA[0].title,
    label: "Does Ravi's notebook change?",
    notes: "Spec G1, nineteen presses. Read the intro: you answer first, then it runs. Each round: read the case. How many think it changes Ravi's notebook? Hands up. Stays the same? Hands up. Keys 1 or 2, or a click, mark the room's pick. Next press: tap it into the bin the room chose. Verdict: read the why line. Point at the arrows: did ravi's list change, or did notes move? The cases that bounced are worth the next two minutes.",
    element: (
      <Panel kicker={AGENDA[0].title} title="Does Ravi's notebook change?" lesson={SESSION} spec="G1" presses={19}>
        <Classify />
      </Panel>
    ),
  },
  {
    id: 'default-list',
    section: AGENDA[0].title,
    label: 'A list as a default value',
    notes: "Spec E1, fifteen presses. Last class: a default fills what we leave out. Think of one spare rough book on the teacher's desk. Option A, hands up. B. C. D. Before each call: which list will list_x point at? Last press: made once, when the def ran. Who voted A? The Unit 3 from line 5 was still in the rough book.",
    element: (
      <Panel kicker={AGENDA[0].title} title="A list as a default value" lesson={SESSION} spec="E1" presses={15}>
        <DefaultList />
      </Panel>
    ),
  },

  /* ── 12 · S-QUIZ ─────────────────────────────────────────────────── */
  { id: 'quiz', section: 'Quiz', label: 'Classroom Quiz', transition: 'zoom', notes: 'Spec S-QUIZ. Open the quiz on your portal. Answer every question on your own. Then we go through the answers together.', element: <ClassroomQuiz lesson={SESSION} /> },

  /* ── 13 · H2 · hook 2 ────────────────────────────────────────────── */
  {
    id: 'screen-time',
    section: AGENDA[1].title,
    label: "Ravi's screen time",
    notes: 'Spec H2, four presses. Everyone has seen this screen. Which day? (Thu, 210 minutes.) Press 2: you looked at each bar and kept the biggest so far. Press 3: this is what your eyes did. Now the least day, and the week\'s total. Two more loops. Press 4: same answer. One line. Python wrote the loop for us.',
    element: (
      <Panel kicker={AGENDA[1].title} title="Ravi's screen time" lesson={SESSION} spec="H2" presses={4}>
        <ScreenTimeHook />
      </Panel>
    ),
  },

  /* ── 14 to 17 · Built-in functions ───────────────────────────────── */
  {
    id: 'built-ins',
    section: AGENDA[1].title,
    label: 'Built-in functions',
    notes: 'Spec C3, three presses. Did you ever write the def for print? No. Python gives it. Press 2: you did not install Calculator. It came with the phone. Built in: already inside Python. Press 3: max we just met. Three more.',
    element: (
      <Panel kicker={AGENDA[1].title} title="Built-in functions" lesson={SESSION} spec="C3" presses={3}>
        <BuiltInList />
      </Panel>
    ),
  },
  {
    id: 'min-max',
    section: AGENDA[1].title,
    label: 'Finding the smallest',
    notes: "Spec C4, ten presses. Two ways to call it: one list, or separate values. Say each output before it shows. Then: now the whole week, as one list. Smallest, not the first one in the list. Python, hands up. Java, hands up. Session 18: ord. 74 is smaller than 80. priya, hands up. Ravi, hands up. Not the alphabet. Unicode. Then max: same calls, max this time. Say both. And Ravi's busiest day was max(minutes).",
    element: (
      <Panel kicker={AGENDA[1].title} title="Finding the smallest" lesson={SESSION} spec="C4" presses={10}>
        <MinMax />
      </Panel>
    ),
  },
  {
    id: 'sum',
    section: AGENDA[1].title,
    label: 'Finding the total',
    notes: 'Spec C5, five presses. 295, hands up. 3, hands up. 140, hands up. Press 2: 95 plus 140 plus 60. Not 3: that would be len. Press 3: min took separate values. Will sum? Press 4: put them in a list: sum([95, 140, 60]). Press 5: the two loops from the hook, gone. Three lines.',
    element: (
      <Panel kicker={AGENDA[1].title} title="Finding the total" lesson={SESSION} spec="C5" presses={5}>
        <SumCard />
      </Panel>
    ),
  },
  {
    id: 'sorted',
    section: AGENDA[1].title,
    label: 'Ordering list items',
    notes: 'Spec C6, five presses. Line 3 is easy. Line 4 is the question. Hands up per choice. Press 2: like the xerox this morning: a new list. Your list is safe. Press 3: last class: default arguments. sorted has one. What would True do? Press 4: say it. Careful: biggest first, or just backwards? Press 5: biggest first, not the list read backwards. That would be [210, 60, 140, 95].',
    element: (
      <Panel kicker={AGENDA[1].title} title="Ordering list items" lesson={SESSION} spec="C6" presses={5}>
        <SortedCard />
      </Panel>
    ),
  },

  /* ── 18 · G2 · Inside the built-in ─────────────────────────────── */
  {
    id: 'inside-builtin',
    section: AGENDA[1].title,
    label: 'Inside the built-in',
    notes: 'Spec G2, twenty-seven presses: four rounds. Each round: read the line. How many think A? Hands up. B? C? Keys 1 to 4, or a click, mark the room\'s pick. Then one press per step: what does it keep now? Verdict: read the line for the most popular wrong option.',
    element: (
      <Panel kicker={AGENDA[1].title} title="Inside the built-in" lesson={SESSION} spec="G2" presses={27}>
        <InsideBuiltin />
      </Panel>
    ),
  },

  /* ── 19 · T2 · Code walkthrough ──────────────────────────────────── */
  {
    id: 'task-2',
    section: AGENDA[2].title,
    label: 'The lucky number plate',
    notes: 'Spec T2, six presses, timer 7:00. Worksheet and playground. Type lines 1 to 5, write 6 to 8 yourself, predict, run. Press 2: this is how I wrote it in my notes. Change it and run. Let them react first. After the timer: three built-ins, no loops. Digits 0, 9, 4, 5, 2, 1. Smallest is 1 this time: no 0 on this plate. Last press: ch is the string \'0\', not the number 0. int(ch) turns it into a number. That is why line 5 has int. You saw strings in G2\'s last round.',
    element: (
      <Panel kicker={AGENDA[2].title} title="The lucky number plate" lesson={SESSION} spec="T2" presses={6}>
        <Task2 />
      </Panel>
    ),
  },

  /* ── 20 · X1 · Exit ──────────────────────────────────────────────── */
  {
    id: 'exit',
    section: 'Exit',
    label: 'Ravi plans a no-phone day',
    notes: 'Spec X1, two presses, timer 2:30. Everyone answers alone. Then option A, hands up. B. C. D. Go through every option, not only the right one.',
    element: (
      <Panel kicker="Exit" title="Ravi plans a no-phone day" lesson={SESSION} spec="X1" presses={2}>
        <ExitPlan />
      </Panel>
    ),
  },

  /* ── 21 · K1 · Takeaways ─────────────────────────────────────────── */
  {
    id: 'takeaways',
    section: 'Close',
    label: 'Today, in six examples',
    notes: 'Spec K1, twelve presses, two per example. First press: the code shows, the result empty: say it together. Second press: the result and sentence fill in: read the sentence. Homework from the guide: the practice set, and the daily challenge, the squares program, which needs sorted.',
    element: (
      <Panel kicker="Key takeaways" title="Today, in six examples" lesson={SESSION} spec="K1" presses={12}>
        <Takeaways />
      </Panel>
    ),
  },

  /* ── 22, 23 · Feedback, Thank you ────────────────────────────────── */
  { id: 'feedback', section: 'Close', label: 'Feedback', transition: 'fade', element: <FeedbackEmbedSlide lesson={SESSION} /> },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
