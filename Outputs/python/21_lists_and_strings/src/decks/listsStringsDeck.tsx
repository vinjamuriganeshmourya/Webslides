import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, SectionBreakerSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { ClassroomQuiz } from './figures/ClassroomQuiz'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { RecapLine3 } from './figures/RecapLine3'
import { KeepHook } from './figures/KeepHook'
import { SplitBasic, SplitComma, SplitMachine, SplitSpaces } from './figures/Split'
import { Task1 } from './figures/Task1'
import { JoinGlue, JoinNumbers } from './figures/Join'
import { MakeItPrint } from './figures/MakeItPrint'
import { ChatHook } from './figures/ChatHook'
import { ReadEnd, Reverse, SliceEnd, StringEnd, TwoRows } from './figures/Ends'
import { WalkLeft } from './figures/WalkLeft'
import { Task2 } from './figures/Task2'
import { ExitChat } from './figures/ExitChat'
import { Takeaways } from './figures/Takeaways'
import { installGestures } from './figures/gestures'
import { installSpecKeys } from './figures/keys'

/**
 * PYTHON · "Lists and Strings" (Programming Foundations, session 21)
 *
 * Built from `Outputs/python/session_plans/21_lists_and_strings/plan.md`.
 *
 * ONE SLIDE PER SPEC CARD. The source is the pedagogy team's session spec,
 * `Reference ppt's/21_lists_and_strings_session_spec.json` (the data) and its
 * reading page `…_spec.html`: 22 beats, 31 cards, 75 minutes. All 31 are here,
 * in the spec's order. Each content slide carries `data-spec` and
 * `data-presses` with the spec's press count.
 *
 * THE WORDS ARE THE SPEC'S EXACT WORDS (spec rule 5) with content rule 36 on
 * every line. THE CODE, EVERY CUT, WALK STEP AND OUTPUT ARE READ FROM THE
 * JSON (`figures/spec.ts`, generated; spec rule 6), and every program was run
 * on CPython 3.12.3 (course rule R3; the plan's output table). Every code
 * panel says `Python` (content rule 31).
 *
 * TWO PICTURES (spec notes 3 and 4): a string is a row of letter tiles that
 * split() cuts into list boxes (`figures/tiles21.tsx`); a list is a row of
 * boxes with two position rows, 0 to 4 and -5 to -1, and a cursor
 * (`figures/pieces.tsx` `ListBoxes`, with its `neg` row).
 *
 * ONLY TEMPLATE COLOURS (content rule 37). The note app's yellow and the chat
 * app's green and wallpaper are the drawn apps' own colours and stay inside
 * the phones.
 *
 * THE SPEC'S PRESSES ARE THE KIT'S BUILD STEPS, with `Next` / `Replay`. The
 * spec's keys (build contract 3) work through `figures/keys.ts`: the arrows
 * are one press each, F full screen, A all the cards, End the whole card.
 * Votes take a click or keys 1 to 4 and never gate the press. Nothing
 * self-advances (spec rule 1); movement inside one press plays only when the
 * press is reached going forward.
 *
 * AUTOPLAY (user, 2026-10-07): each built card's Next is paired with an
 * Autoplay switch in Replay's old slot, on by default on slides 3, 4, 14, 18,
 * 20, 21, 22, 23, 24, 26 and 29 only (`figures/autoplay.ts`).
 *
 * THE QUIZ SLIDE is `figures/ClassroomQuiz.tsx`, the lesson plan's own card,
 * and the standard for every quiz slide in this deck.
 *
 * THE AGENDA IS STATIC (content rule 44).
 *
 * NAVIGATION (user, 2026-10-05, every deck): keyboard, two-finger trackpad
 * swipe and touch swipe, from session 17's `figures/gestures.ts`.
 */

installGestures()
installSpecKeys()

const SESSION = 'Lists and Strings'

export const listsStringsMeta: DeckMeta = {
  title: SESSION,
  course: 'Python',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/** The four agenda stops, word for word from the spec. */
const AGENDA = [
  { title: 'Split a string', sub: 'cut one text into pieces' },
  { title: 'Join a list', sub: 'glue the pieces back' },
  { title: 'Count from the end', sub: 'a negative index' },
  { title: 'Walk backwards', sub: 'a negative step' },
]

export const listsStringsDeck: SlideDef[] = [
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
          { text: 'A name points at a list', sub: 'list_b = list_a gives the same list a second name' },
          { text: 'A change through one name shows through both', sub: 'list_b[0] = 9 changes the one shared list' },
          { text: '+ builds a new list, += grows the same list', sub: '= with a new value moves only that one name' },
        ]}
      />
    ),
  },
  {
    id: 'recap-line3',
    section: 'Recap',
    label: 'What does list_b print?',
    notes: 'Spec S-RECAP, seven presses. Three line 3s, one at a time. Say the output out loud before I show it. After each answer: who said that? Good. Next line. Nobody is named.',
    element: (
      <Panel kicker="Recap" title="What does list_b print?" lesson={SESSION} spec="S-RECAP" presses={7}>
        <RecapLine3 />
      </Panel>
    ),
  },

  /* ── 4 · H1 · the hook ───────────────────────────────────────────── */
  {
    id: 'keep-hook',
    section: 'Hook',
    label: 'You are packing for a trip',
    notes: 'Spec H1, six presses. Who keeps a list like this on the phone? Press 2: take three or four ideas, correct nobody. Press 3: where did the app cut the note? At each new line, where you pressed Enter. Press 4: four separate things now. Press 5: and it can glue them back. Press 6: hold this picture, today\'s first code does both. Do not name it yet.',
    element: (
      <Panel kicker="Programming Foundations" title="You are packing for a trip" lesson={SESSION} spec="H1" presses={6}>
        <KeepHook />
      </Panel>
    ),
  },

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  /* Static, exactly as session 19's agenda: no step-through, no selected point, no Next / Replay (content rule 44). */
  { id: 'agenda', section: 'Today', label: 'Agenda', notes: 'Spec S-AGENDA. Read each stop and its line, nothing more.', element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 to 12 · Split a string ────────────────────────────────────── */
  {
    id: 'divider-split',
    section: AGENDA[0].title,
    label: 'Splitting a String',
    transition: 'zoom',
    notes: 'Spec C1. Back to the note. Here is how Python cuts a string.',
    element: (
      <div className="relative h-full w-full" data-spec="C1" data-presses={1}>
        <SectionBreakerSlide index="01" kicker={SESSION} title="Splitting a String" lesson={SESSION} />
      </div>
    ),
  },
  {
    id: 'split-basic',
    section: AGENDA[0].title,
    label: 'Cut a string into a list',
    notes: 'Spec C2, three presses. What does line 3 print? Take two answers. Press 2: quotes round each one, they are strings, not numbers. Press 3: with nothing in the brackets, it cuts at whitespace.',
    element: (
      <Panel kicker={AGENDA[0].title} title="Cut a string into a list" lesson={SESSION} spec="C2" presses={3}>
        <SplitBasic />
      </Panel>
    ),
  },
  {
    id: 'split-spaces',
    section: AGENDA[0].title,
    label: 'More spaces. Same list?',
    notes: 'Spec C3, four presses. Option A, hands up. Option B. Press 2: many spaces in a row count as one. Press 3: remember \\n is a new line and \\t a tab. What will it print? Press 4: same four pieces.',
    element: (
      <Panel kicker={AGENDA[0].title} title="More spaces. Same list?" lesson={SESSION} spec="C3" presses={4}>
        <SplitSpaces />
      </Panel>
    ),
  },
  {
    id: 'split-comma',
    section: AGENDA[0].title,
    label: 'Cut at a comma',
    notes: 'Spec C4, two presses. split() cuts at spaces. There are none. How do we cut at the commas? Take ideas before press 2. The comma goes in the brackets, in quotes.',
    element: (
      <Panel kicker={AGENDA[0].title} title="Cut at a comma" lesson={SESSION} spec="C4" presses={2}>
        <SplitComma />
      </Panel>
    ),
  },
  {
    id: 'split-machine',
    section: AGENDA[0].title,
    label: 'The split machine',
    notes: 'Spec E1, eighteen presses. Option by option: 4 items? 6 items? Hands up for each. Then read each caption and count the boxes. Run 1 ends: who said more than four? Where did the empty ones come from? Run 2: 4 items? 8 items? At the end: same string, two different lists. Which brackets made the difference?',
    element: (
      <Panel kicker={AGENDA[0].title} title="The split machine" lesson={SESSION} spec="E1" presses={18}>
        <SplitMachine />
      </Panel>
    ),
  },
  {
    id: 'task-1',
    section: AGENDA[0].title,
    label: 'Count the canteen orders',
    notes: 'Spec T1, four presses, timer 5:00. Worksheet tab open. Type your predictions first, then run both in the playground. Press 2: three dishes, but len says 4. Why? Do not show the fix before the room has said why. Press 3: who typed this fix? Press 4: the space after each comma stayed in the piece. Look at your own typing.',
    element: (
      <Panel kicker={AGENDA[0].title} title="Count the canteen orders" lesson={SESSION} spec="T1" presses={4}>
        <Task1 />
      </Panel>
    ),
  },

  /* ── 13 to 16 · Join a list ──────────────────────────────────────── */
  {
    id: 'divider-join',
    section: AGENDA[1].title,
    label: 'Joining Strings',
    transition: 'zoom',
    notes: 'Spec C5. We can cut. Can we glue back?',
    element: (
      <div className="relative h-full w-full" data-spec="C5" data-presses={1}>
        <SectionBreakerSlide index="02" kicker={SESSION} title="Joining Strings" lesson={SESSION} />
      </div>
    ),
  },
  {
    id: 'join-glue',
    section: AGENDA[1].title,
    label: 'Glue the pieces back',
    notes: 'Spec C6, four presses. We cut at every a. What do the pieces look like? Press 2: take ideas, no line yet. Press 3: the glue goes before the dot, the list goes in the brackets. Press 4: five pieces, four a\'s. Glue only goes between.',
    element: (
      <Panel kicker={AGENDA[1].title} title="Glue the pieces back" lesson={SESSION} spec="C6" presses={4}>
        <JoinGlue />
      </Panel>
    ),
  },
  {
    id: 'join-numbers',
    section: AGENDA[1].title,
    label: 'Can join glue numbers?',
    notes: 'Spec C7, two presses. Option A, hands up. Option B. Item 0 is the number 0, not the string \'0\'.',
    element: (
      <Panel kicker={AGENDA[1].title} title="Can join glue numbers?" lesson={SESSION} spec="C7" presses={2}>
        <JoinNumbers />
      </Panel>
    ),
  },
  {
    id: 'make-it-print',
    section: AGENDA[1].title,
    label: 'Make it print this',
    notes: 'Spec G1, eighteen presses. Read each option. How many think option A? Hands up. Then B, C and D. Keys 1 to 4 or a click mark the room\'s pick. Each try: hit or miss? At the verdict: why did that one hit?',
    element: (
      <Panel kicker={AGENDA[1].title} title="Make it print this" lesson={SESSION} spec="G1" presses={18}>
        <MakeItPrint />
      </Panel>
    ),
  },

  /* ── 17 · S-QUIZ ─────────────────────────────────────────────────── */
  /* The deck's standard quiz slide (user, 2026-10-07): the lesson plan's own
     "Classroom quiz on the portal" card, its words and layout only. Every quiz
     slide in this deck is a `ClassroomQuiz`. */
  { id: 'quiz', section: 'Quiz', label: 'Classroom Quiz', transition: 'zoom', notes: 'Spec S-QUIZ. Open the quiz on your portal. Answer every question on your own. Then we go through the answers together.', element: <ClassroomQuiz lesson={SESSION} /> },

  /* ── 18 · H2 · hook 2 ────────────────────────────────────────────── */
  {
    id: 'chat-hook',
    section: AGENDA[2].title,
    label: 'Which message is the latest?',
    notes: 'Spec H2, five presses. Point at the latest. Its position? (3.) Press 2: every new message moves the latest one down. (4.) Press 3: len, a minus, a 1, brackets. Every time. Press 4: what if Python could count from the end too? Press 5: this is a negative index. -1 is always the last one.',
    element: (
      <Panel kicker={AGENDA[2].title} title="Which message is the latest?" lesson={SESSION} spec="H2" presses={5}>
        <ChatHook />
      </Panel>
    ),
  },

  /* ── 19 to 22 · Count from the end ───────────────────────────────── */
  {
    id: 'divider-negative',
    section: AGENDA[2].title,
    label: 'Negative Indexing',
    transition: 'zoom',
    notes: 'Spec C8. Now in Python.',
    element: (
      <div className="relative h-full w-full" data-spec="C8" data-presses={1}>
        <SectionBreakerSlide index="03" kicker={SESSION} title="Negative Indexing" lesson={SESSION} />
      </div>
    ),
  },
  {
    id: 'two-rows',
    section: AGENDA[2].title,
    label: 'Every box has two positions',
    notes: 'Spec C9, three presses. This we know. Press 2: take answers. Not 0, because 0 is taken. Press 3: the first box is -5. Five boxes, so -5.',
    element: (
      <Panel kicker={AGENDA[2].title} title="Every box has two positions" lesson={SESSION} spec="C9" presses={3}>
        <TwoRows />
      </Panel>
    ),
  },
  {
    id: 'read-end',
    section: AGENDA[2].title,
    label: 'Read from the end',
    notes: 'Spec C10, four presses. Say it. Press 2: like the chat. Press 3: option A, hands up. Option B. Press 4: find -4 on the bottom row, then read the box above it.',
    element: (
      <Panel kicker={AGENDA[2].title} title="Read from the end" lesson={SESSION} spec="C10" presses={4}>
        <ReadEnd />
      </Panel>
    ),
  },
  {
    id: 'slice-end',
    section: AGENDA[2].title,
    label: 'A slice from the end',
    notes: 'Spec C11, two presses. Option A, hands up. Option B. Who said B? The stop is never taken, the same rule as every slice in session 19. Then say (original slide 37): a slice can run past either end with no error, list_a[2:10] gives [3, 2, 1]. Indexing cannot: list_a[-6] on these five items stops with IndexError: list index out of range.',
    element: (
      <Panel kicker={AGENDA[2].title} title="A slice from the end" lesson={SESSION} spec="C11" presses={2}>
        <SliceEnd />
      </Panel>
    ),
  },

  /* ── 23 to 27 · Walk backwards ───────────────────────────────────── */
  {
    id: 'walk-left',
    section: AGENDA[3].title,
    label: 'Walk left',
    notes: 'Spec E2, fifteen presses. Say what it gives, take two answers, before each run. Then read each caption; check your answer. At each output: who said that? Point at the grey. Run 3: careful. Start 2, stop 4, step -1. At the end: walking left from 2 never reaches 4. Empty list, no error.',
    element: (
      <Panel kicker={AGENDA[3].title} title="Walk left" lesson={SESSION} spec="E2" presses={15}>
        <WalkLeft />
      </Panel>
    ),
  },
  {
    id: 'reverse',
    section: AGENDA[3].title,
    label: 'Leave the start and stop out',
    notes: 'Spec C12, four presses. Say it. Press 2: nothing left out. Press 3: the step is -1 now. Say it. Press 4: like a chat read from the newest message back.',
    element: (
      <Panel kicker={AGENDA[3].title} title="Leave the start and stop out" lesson={SESSION} spec="C12" presses={4}>
        <Reverse />
      </Panel>
    ),
  },
  {
    id: 'divider-strings',
    section: AGENDA[3].title,
    label: 'Indexing & Slicing Strings',
    transition: 'zoom',
    notes: 'Spec C13. Does all of this work on a string?',
    element: (
      <div className="relative h-full w-full" data-spec="C13" data-presses={1}>
        <SectionBreakerSlide index="04" kicker={SESSION} title="Indexing & Slicing Strings" lesson={SESSION} />
      </div>
    ),
  },
  {
    id: 'string-end',
    section: AGENDA[3].title,
    label: 'The same rules on a string',
    notes: 'Spec C14, four presses. Say it. Press 2: the last letter. Press 4: same as the list. Then say (original slides 50 and 51): a negative slice and a negative step work on a string the same way: string_1[-4:-1] gives gra, string_1[-1:-4:-1] gives mar.',
    element: (
      <Panel kicker={AGENDA[3].title} title="The same rules on a string" lesson={SESSION} spec="C14" presses={4}>
        <StringEnd />
      </Panel>
    ),
  },
  {
    id: 'task-2',
    section: AGENDA[3].title,
    label: "Ravi's last three days",
    notes: 'Spec T2, four presses, timer 6:00. Worksheet tab open. Predict first, type it, run it. Then do the two changes. Press 2: who got it right first time? -3 to the end. Press 3: last two days. Press 4: which day went missing? The stop is never taken.',
    element: (
      <Panel kicker={AGENDA[3].title} title="Ravi's last three days" lesson={SESSION} spec="T2" presses={4}>
        <Task2 />
      </Panel>
    ),
  },

  /* ── 28 · X1 · Exit ──────────────────────────────────────────────── */
  {
    id: 'exit',
    section: 'Exit',
    label: 'Which one prints []?',
    notes: 'Spec X1, two presses, timer 2:30. Everyone answers alone. Then option A, hands up. B. C. D. Go through every option, not only the right one.',
    element: (
      <Panel kicker="Exit" title="Which one prints []?" lesson={SESSION} spec="X1" presses={2}>
        <ExitChat />
      </Panel>
    ),
  },

  /* ── 29 · K1 · Takeaways ─────────────────────────────────────────── */
  {
    id: 'takeaways',
    section: 'Close',
    label: 'Today, in six examples',
    notes: 'Spec K1, six presses. Read heading, code, result, sentence. Homework from the guide: the daily challenge.',
    element: (
      <Panel kicker="Key takeaways" title="Today, in six examples" lesson={SESSION} spec="K1" presses={6}>
        <Takeaways />
      </Panel>
    ),
  },

  /* ── 30, 31 · Feedback, Thank you ────────────────────────────────── */
  { id: 'feedback', section: 'Close', label: 'Feedback', transition: 'fade', element: <FeedbackEmbedSlide lesson={SESSION} /> },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
