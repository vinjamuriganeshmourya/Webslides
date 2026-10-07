import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { ClassroomQuiz } from './figures/ClassroomQuiz'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { ExitWish, RecapBug, Takeaways, Task1, Task2 } from './figures/Tasks'
import { Bakery, OneSongHook, SongHook } from './figures/Hooks'
import { BuiltIns, DefineFirst, NoHello, WriteOnce } from './figures/Basics'
import { Arguments, CallIt, DefShape } from './figures/Shapes'
import { AfterReturn, FollowCall, MsgInside, ReturnMsg, TejaRahul } from './figures/Traces'
import { PartyMachine } from './figures/Game'
import { installGestures } from './figures/gestures'
import { installSpecKeys } from './figures/keys'

/**
 * PYTHON · "Functions" (Programming Foundations, session 22)
 *
 * Built from `Outputs/python/session_plans/22_functions/plan.md`.
 *
 * ONE SLIDE PER SPEC CARD. The source is the pedagogy team's session spec,
 * `Reference ppt's/22_functions_session_spec.json` (the data) and its reading
 * page `…_spec.html`: 24 beats, 28 cards, 75 minutes. All 28 are here, in the
 * spec's order. Each content slide carries `data-spec` and `data-presses`
 * with the spec's press count.
 *
 * THE WORDS ARE THE SPEC'S EXACT WORDS (spec rule 5) with content rule 36 on
 * every line. THE CODE, EVERY TRACE STEP, ROUND AND OUTPUT ARE READ FROM THE
 * JSON (`figures/spec.ts`, generated; spec rule 6), and every program was run
 * on CPython 3.12.3 (`scripts/run-spec-programs.py`, 36 of 36 match). Every
 * code panel says `Python` (content rule 31).
 *
 * ONE PICTURE (spec note 5, `figures/call.tsx`): a call is a jump, an arrow
 * from the call line up to the def header and one back from the block to the
 * call line; the call line waits in amber while the block runs; the call's
 * own area holds the boxes it made and vanishes with them when it ends.
 *
 * ONE WORLD (spec note 2): Teja's birthday. The hostel room, the video call,
 * the party TV, the bakery are drawn (`figures/Hooks.tsx`, `People.tsx`,
 * `Game.tsx`), with template colours only (content rule 37).
 *
 * THE SPEC'S PRESSES ARE THE BUILD STEPS, with `Next`. The spec's keys
 * (build contract 3) work through `figures/keys.ts`. Votes take a click or
 * keys 1 to 4 and never gate the press. Nothing self-advances (spec rule 1):
 * the Autoplay switch beside Next is session 21's control, OFF on every slide.
 *
 * THE QUIZ SLIDE is `figures/ClassroomQuiz.tsx`, session 21's rebuild of the
 * lesson plan's card 17 ("Classroom Quiz"), unchanged.
 *
 * THE AGENDA IS STATIC (content rule 44).
 *
 * NAVIGATION (user, 2026-10-05, every deck): keyboard, two-finger trackpad
 * swipe and touch swipe, from session 17's `figures/gestures.ts`.
 */

installGestures()
installSpecKeys()

const SESSION = 'Functions'

export const functionsMeta: DeckMeta = {
  title: SESSION,
  course: 'Python',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/** The four agenda stops, word for word from the spec. */
const AGENDA = [
  { title: 'Define', sub: 'write the block once, give it a name' },
  { title: 'Call', sub: 'run it by its name' },
  { title: 'Pass a value', sub: 'send a value in' },
  { title: 'Return a value', sub: 'get a value back' },
]

export const functionsDeck: SlideDef[] = [
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
          { text: 'split() cuts one string into a list of pieces', sub: '"1,2,3".split(",") gives [\'1\', \'2\', \'3\']' },
          { text: 'join() glues a list of strings back into one', sub: '"-".join(list) puts - between every two items' },
          { text: 'A negative index counts from the end', sub: 'list_a[-1] is always the last item' },
        ]}
      />
    ),
  },
  {
    id: 'recap-bug',
    section: 'Recap',
    label: 'Which line is to blame?',
    notes: 'Spec S-RECAP, three presses. This was your daily challenge. Pick a line number. Line 6? Hands up. Line 7? Line 8? Press 2: what should line 7 say? Take answers before the next press. Press 3: n minus i: 2, then 1, then 0. The second list walks backwards.',
    element: (
      <Panel kicker="Recap" title="Which line is to blame?" lesson={SESSION} spec="S-RECAP" presses={3}>
        <RecapBug />
      </Panel>
    ),
  },

  /* ── 4 · H1 · the hook ───────────────────────────────────────────── */
  {
    id: 'song-hook',
    section: 'Hook',
    label: "It is Teja's birthday",
    notes: "Spec H1, six presses. Midnight in the hostel. It is Teja's birthday. What happens right now? Press 2: everyone sings. Cake, photos. Done? Press 3: Amma calls on video. What does everyone do? Press 4: C block friends arrive late. Same song, third time. Press 5: did anyone write the lyrics before singing? Did anyone sing it at 11:59, before the cake? Everyone knew it at 11:59. Press 6: hold this picture, a name and a block under it. Do not name it yet. What do you think today is about?",
    element: (
      <Panel kicker="Programming Foundations" title="It is Teja's birthday" lesson={SESSION} spec="H1" presses={6}>
        <SongHook />
      </Panel>
    ),
  },

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  /* Static, exactly as session 19's agenda: no step-through, no selected point, no Next (content rule 44). */
  { id: 'agenda', section: 'Today', label: 'Agenda', notes: 'Spec S-AGENDA. Read each stop and its line, nothing more.', element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 to 9 · Define ─────────────────────────────────────────────── */
  {
    id: 'write-once',
    section: AGENDA[0].title,
    label: 'Write it once?',
    notes: "Spec C1, four presses. This is the night from the hook. Count the lines that repeat. Press 2: Teja's name was spelled wrong. How many lines do you fix? (Three.) Press 3: take ideas, do not answer yet. Press 4: like the song, learn it once, sing it any time.",
    element: (
      <Panel kicker={AGENDA[0].title} title="Write it once?" lesson={SESSION} spec="C1" presses={4}>
        <WriteOnce />
      </Panel>
    ),
  },
  {
    id: 'def-shape',
    section: AGENDA[0].title,
    label: 'Defining a function',
    notes: 'Spec C2, five presses. def is short for define. Then a space and the name. Press 2: def, a space, the name, brackets, a colon. Press 3: indented by 4 spaces, the same as an if block. Press 4: same rules as a variable name. Each function gets its own name. Press 5: that is the card from the hook, in Python.',
    element: (
      <Panel kicker={AGENDA[0].title} title="Defining a function" lesson={SESSION} spec="C2" presses={5}>
        <DefShape />
      </Panel>
    ),
  },
  {
    id: 'no-hello',
    section: AGENDA[0].title,
    label: 'Why did Hello not print?',
    notes: 'Spec C3, three presses. Option A, hands up. Option B. Press 2: take reasons, do not answer yet. Press 3: like the song at 11:59. Everyone knew it. Nobody sang it.',
    element: (
      <Panel kicker={AGENDA[0].title} title="Defining a function" lesson={SESSION} spec="C3" presses={3}>
        <NoHello />
      </Panel>
    ),
  },

  /* ── 10 to 14 · Call ─────────────────────────────────────────────── */
  {
    id: 'call-it',
    section: AGENDA[1].title,
    label: 'Calling a function',
    notes: "Spec C4, three presses. In the hook, how did the song start? Someone said its name. Take ideas before press 2. Press 2: the name and brackets. Call it as many times as you need. Press 3: same screen as C1. Fix Teja's name now: one line.",
    element: (
      <Panel kicker={AGENDA[1].title} title="Calling a function" lesson={SESSION} spec="C4" presses={3}>
        <CallIt />
      </Panel>
    ),
  },
  {
    id: 'follow-call',
    section: AGENDA[1].title,
    label: 'Follow the call',
    notes: 'Spec E1, nine presses. Option A, hands up. B. C. Then one move per press: read the caption. Where is Python now? Say the next line before each press. Last press: who said B? Python finished the block before it came back to line 6.',
    element: (
      <Panel kicker={AGENDA[1].title} title="Follow the call" lesson={SESSION} spec="E1" presses={9}>
        <FollowCall />
      </Panel>
    ),
  },
  {
    id: 'task-1',
    section: AGENDA[1].title,
    label: 'The party screen',
    notes: 'Spec T1, four presses, timer 5:00. Worksheet tab and playground open. Type it. Type your prediction. Then run. Press 2: one more line. Predict, then run. Press 3: this is how I wrote it in my notes. Move it and run. Let them react first. Press 4: line 1 ran. Line 2 called a name Python had not met yet.',
    element: (
      <Panel kicker={AGENDA[1].title} title="The party screen" lesson={SESSION} spec="T1" presses={4}>
        <Task1 />
      </Panel>
    ),
  },
  {
    id: 'define-first',
    section: AGENDA[1].title,
    label: 'Defining and calling',
    notes: 'Spec C5, three presses. You just saw this in Task 1. What do you expect? Press 2: at line 2, greet does not exist yet. Press 3: define first. Then call.',
    element: (
      <Panel kicker={AGENDA[1].title} title="Defining and calling" lesson={SESSION} spec="C5" presses={3}>
        <DefineFirst />
      </Panel>
    ),
  },
  {
    id: 'party-machine',
    section: AGENDA[1].title,
    label: 'What does the party screen show?',
    notes: 'Spec G1, 35 presses over five rounds (9 + 13 + 4 + 5 + 4). Read each option. How many think option A? Hands up. Then B, then C, then D. Keys 1 to 4 or a click mark the room\'s pick. Each step: read the caption. Where is the marker? At the verdict: read the line for the most popular wrong option.',
    element: (
      <Panel kicker={AGENDA[1].title} title="What does the party screen show?" lesson={SESSION} spec="G1" presses={35}>
        <PartyMachine />
      </Panel>
    ),
  },

  /* ── 15 · S-QUIZ ─────────────────────────────────────────────────── */
  /* The standard quiz slide: the lesson plan's own "Classroom Quiz" card (the
     slide 17 reference), as session 21 rebuilt it. */
  { id: 'quiz', section: 'Quiz', label: 'Classroom Quiz', transition: 'zoom', notes: 'Spec S-QUIZ. Open the quiz on your portal. Answer every question on your own. Then we go through the answers together.', element: <ClassroomQuiz lesson={SESSION} /> },

  /* ── 16 to 19 · Pass a value ─────────────────────────────────────── */
  {
    id: 'one-song-hook',
    section: AGENDA[2].title,
    label: "Next week: Rahul's birthday",
    notes: "Spec H2, five presses. We run the same program at Rahul's party. What will it sing? Press 2: wrong name. How would you fix it with what we know? Press 3: three friends, three functions. They differ by one word. Press 4: our class has sixty birthdays. Press 5: same screen, one function. The name of that slot: argument.",
    element: (
      <Panel kicker={AGENDA[2].title} title="Next week: Rahul's birthday" lesson={SESSION} spec="H2" presses={5}>
        <OneSongHook />
      </Panel>
    ),
  },
  {
    id: 'arguments',
    section: AGENDA[2].title,
    label: 'Function with arguments',
    notes: 'Spec C7, three presses. name is down on line 5. How does Teja get into greet? Press 2: like friend in the hook. Press 3: word=name, the value in name goes into word.',
    element: (
      <Panel kicker={AGENDA[2].title} title="Function with arguments" lesson={SESSION} spec="C7" presses={3}>
        <Arguments />
      </Panel>
    ),
  },
  {
    id: 'teja-rahul',
    section: AGENDA[2].title,
    label: 'Hello Teja, then Hello Rahul',
    notes: 'Spec C8, three presses. Say it out loud. Press 2: word lives only while greet runs. Press 3: same block, new value. That is the hook\'s short way.',
    element: (
      <Panel kicker={AGENDA[2].title} title="Function with arguments" lesson={SESSION} spec="C8" presses={3}>
        <TejaRahul />
      </Panel>
    ),
  },
  {
    id: 'msg-inside',
    section: AGENDA[2].title,
    label: 'Variables inside a function',
    notes: 'Spec C9, nine presses. Option A, hands up. B. Then one move per press: where is msg when line 6 runs? Last press: like a note the baker writes in the kitchen. It stays in the kitchen.',
    element: (
      <Panel kicker={AGENDA[2].title} title="Variables inside a function" lesson={SESSION} spec="C9" presses={9}>
        <MsgInside />
      </Panel>
    ),
  },

  /* ── 20 to 24 · Return a value ───────────────────────────────────── */
  {
    id: 'bakery',
    section: AGENDA[3].title,
    label: 'Shout it, or hand it over?',
    notes: 'Spec C10, four presses. msg is stuck inside greet. Think of the baker. Press 2: that is print. The words were said. Nothing came back. Press 3: that is return. Press 4: which one? (Hand it back.)',
    element: (
      <Panel kicker={AGENDA[3].title} title="Shout it, or hand it over?" lesson={SESSION} spec="C10" presses={4}>
        <Bakery />
      </Panel>
    ),
  },
  {
    id: 'return-msg',
    section: AGENDA[3].title,
    label: 'Returning a value',
    notes: 'Spec C11, ten presses. return, a space, the value. Press 2: the call line now has a box on its left: greeting. Then one move per press: the cake comes back to the counter.',
    element: (
      <Panel kicker={AGENDA[3].title} title="Returning a value" lesson={SESSION} spec="C11" presses={10}>
        <ReturnMsg />
      </Panel>
    ),
  },
  {
    id: 'after-return',
    section: AGENDA[3].title,
    label: 'A line after return',
    notes: 'Spec C12, nine presses. Option A, hands up. B. Then one move per press: did Python reach line 4? Last press: and greeting holds the value, but nobody printed it.',
    element: (
      <Panel kicker={AGENDA[3].title} title="Returning a value" lesson={SESSION} spec="C12" presses={9}>
        <AfterReturn />
      </Panel>
    ),
  },
  {
    id: 'task-2',
    section: AGENDA[3].title,
    label: 'The icing bill',
    notes: 'Spec T2, five presses, timer 6:00. Worksheet tab and playground. Fill the gap, add three lines for cake 2, type your prediction, then run. Press 2: who wrote print instead of return? Then cost_1 has nothing to hold. No names. Press 3: 17 letters, times 5. Press 4: same block, second call. Press 5: without a function, you would change it in two places. Sixty cakes, sixty places.',
    element: (
      <Panel kicker={AGENDA[3].title} title="The icing bill" lesson={SESSION} spec="T2" presses={5}>
        <Task2 />
      </Panel>
    ),
  },
  {
    id: 'built-ins',
    section: AGENDA[3].title,
    label: 'Built-in functions',
    notes: 'Spec C13, three presses. Since the first week. Which ones? Press 2: built-in functions, ready to reuse. Press 3: n = len("Teja") stores what len returns.',
    element: (
      <Panel kicker={AGENDA[3].title} title="Built-in functions" lesson={SESSION} spec="C13" presses={3}>
        <BuiltIns />
      </Panel>
    ),
  },

  /* ── 25 · X1 · Exit ──────────────────────────────────────────────── */
  {
    id: 'exit',
    section: 'Exit',
    label: 'The empty party screen',
    notes: 'Spec X1, two presses, timer 2:30. Everyone answers alone. Then option A, hands up. B. C. Go through every option, not only the right one.',
    element: (
      <Panel kicker="Exit" title="The empty party screen" lesson={SESSION} spec="X1" presses={2}>
        <ExitWish />
      </Panel>
    ),
  },

  /* ── 26 · K1 · Takeaways ─────────────────────────────────────────── */
  {
    id: 'takeaways',
    section: 'Close',
    label: 'Today, in six examples',
    notes: 'Spec K1, six presses. Read heading, code, result, sentence. Say once: arguments and return are optional. Practice in the playground; next session, the plain call form.',
    element: (
      <Panel kicker="Key takeaways" title="Today, in six examples" lesson={SESSION} spec="K1" presses={6}>
        <Takeaways />
      </Panel>
    ),
  },

  /* ── 27, 28 · Feedback, Thank you ────────────────────────────────── */
  { id: 'feedback', section: 'Close', label: 'Feedback', transition: 'fade', element: <FeedbackEmbedSlide lesson={SESSION} /> },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
