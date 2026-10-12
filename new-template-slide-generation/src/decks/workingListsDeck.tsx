import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, NextSessionSlide, QuizTimeSlide, SectionBreakerSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { RecapBug } from './figures/RecapBug'
import { ShareHook } from './figures/ShareHook'
import { Task1 } from './figures/Task1'
import { ObjectCast, IdCast } from './figures/ObjectCast'
import { IdTwice, NamePoints, NewObject } from './figures/Objects'
import { ListObject, SecondName, TwoLists } from './figures/ListObjects'
import { Task2 } from './figures/Task2'
import { FreezeFrame } from './figures/FreezeFrame'
import { MoveName, NestedRef, NumberRef } from './figures/Moves'
import { PlusWalk } from './figures/PlusWalk'
import { Task3 } from './figures/Task3'
import { ExitKeep } from './figures/ExitKeep'
import { Takeaways } from './figures/Takeaways'
import { installGestures } from './figures/gestures'
import { installSpecKeys } from './figures/keys'

/**
 * PYTHON · "Working with Lists" (Programming Foundations, session 20)
 *
 * Built from `Outputs/python/session_plans/20_working_with_lists/plan.md`.
 *
 * ONE SLIDE PER SPEC CARD. The source is the pedagogy team's session spec,
 * `Reference ppt's/20_working_with_lists_session_spec.json` (the data) and its
 * reading page `…_spec.html`: 20 beats, 28 cards, 75 minutes. All 28 are here,
 * in the spec's order. Each content slide carries `data-spec` and
 * `data-presses` with the spec's press count.
 *
 * THE WORDS ARE THE SPEC'S EXACT WORDS (spec rule 5) with content rule 36 on
 * every line. THE CODE, EVERY TRACE STEP AND EVERY OUTPUT ARE READ FROM THE
 * JSON (`figures/spec.ts`, generated; spec rule 6), and every program was run
 * on CPython 3.12.3 (course rule R3; the plan's output table). Every code
 * panel says `Python` (content rule 31).
 *
 * ONE PICTURE FOR THE WHOLE SESSION (spec note): a name is a tag with an
 * arrow, a list is a row of boxes, two names on one list are two arrows into
 * ONE row. `figures/memory.tsx` draws it on every card that needs it.
 *
 * ONLY TEMPLATE COLOURS (content rule 37). The Spotify phones' dark shell and
 * green are the drawn app's own colours and stay inside the phones.
 *
 * THE SPEC'S PRESSES ARE THE KIT'S BUILD STEPS, with session 18's `Next` /
 * `Replay`. The spec's keys (build contract 3) work through `figures/keys.ts`:
 * the arrows are one press each, F full screen, A all the cards, End the
 * whole card. Votes take a click or keys 1 to 4 and never gate the press.
 * Nothing self-advances (spec rule 1).
 *
 * THE AGENDA IS STATIC (content rule 44): the spec's "one stop lights per
 * press" is not carried, on the user's word (2026-10-06).
 *
 * NAVIGATION (user, 2026-10-05, every deck): keyboard, two-finger trackpad
 * swipe and touch swipe, from session 17's `figures/gestures.ts`.
 */

installGestures()
installSpecKeys()

const SESSION = 'Working with Lists'

export const workingListsMeta: DeckMeta = {
  title: SESSION,
  course: 'Python',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/** The four agenda stops, word for word from the spec. */
const AGENDA = [
  { title: 'Change a list', sub: 'one item at a time' },
  { title: 'Objects and id', sub: 'every value has one' },
  { title: 'Two names, one list', sub: 'change it, both see it' },
  { title: 'Change or move?', sub: '=, + and +=' },
]

export const workingListsDeck: SlideDef[] = [
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
          { text: 'A list keeps many values under one name', sub: 'In order, and positions start at 0' },
          { text: '+ joins two lists, += adds the items of a list', sub: '[ ] around a list makes it one item' },
          { text: 'A slice takes a part of a list', sub: 'It stops just before the stop number' },
        ]}
      />
    ),
  },
  {
    id: 'recap-bug',
    section: 'Recap',
    label: 'Which line is to blame?',
    notes: 'Spec S-RECAP, three presses. Everyone picks a line number: line 1? Hands up. Line 2? Line 3? Line 4? Press 2 lights the culprit; ask for the fix before press 3.',
    element: (
      <Panel kicker="Recap" title="Which line is to blame?" lesson={SESSION} spec="S-RECAP" presses={3}>
        <RecapBug />
      </Panel>
    ),
  },

  /* ── 4 · H1 · the hook ───────────────────────────────────────────── */
  {
    id: 'share-hook',
    section: 'Hook',
    label: 'Kiran wants your Road Trip songs',
    notes: 'Spec H1, five presses. Remember these songs? Kiran wants them on his phone: how would you give them? Press 3: Way A first, hands up if it vanishes from your phone; then Way B. Press 5: hold this picture, do not name it.',
    element: (
      <Panel kicker="Programming Foundations" title="Kiran wants your Road Trip songs" lesson={SESSION} spec="H1" presses={5}>
        <ShareHook />
      </Panel>
    ),
  },

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  /* Static, exactly as session 19's agenda: no step-through, no selected point, no Next / Replay (content rule 44). */
  { id: 'agenda', section: 'Today', label: 'Agenda', notes: 'Spec S-AGENDA. Read each stop and its line, nothing more.', element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 · T1 · Change a list ──────────────────────────────────────── */
  {
    id: 'task-1',
    section: AGENDA[0].title,
    label: 'Change one item',
    notes: 'Spec T1, three presses, timer 3:00. Worksheet open: type it, predict line 4, run. Press 2, then: my mistake, I want to do the same to a word. Press 3: let them react first; line 2 printed, then Python stopped at line 3.',
    element: (
      <Panel kicker={AGENDA[0].title} title="Change one item" lesson={SESSION} spec="T1" presses={3}>
        <Task1 />
      </Panel>
    ),
  },

  /* ── 8 to 13 · Objects and id ────────────────────────────────────── */
  { id: 'divider-objects', section: AGENDA[1].title, label: 'Objects', transition: 'zoom', notes: 'Spec C1. Let us see what Python does with every value.', element: (
      <div className="relative h-full w-full" data-spec="C1" data-presses={1}>
        <SectionBreakerSlide index="01" kicker={SESSION} title="Objects" lesson={SESSION} />
      </div>
    ),
  },
  {
    id: 'every-value',
    section: AGENDA[1].title,
    label: 'Every value is an object',
    notes: 'Spec C2. What do these three have in common? Python calls each stored value an object. Anything you can put in a variable.',
    element: (
      <Panel kicker={AGENDA[1].title} title="Every value is an object" lesson={SESSION} spec="C2" presses={3}>
        <ObjectCast />
      </Panel>
    ),
  },
  {
    id: 'object-id',
    section: AGENDA[1].title,
    label: 'Each object gets an id',
    notes: 'Spec C3. One id per object; no two objects share one at the same time. We never learn an id by heart: we compare them.',
    element: (
      <Panel kicker={AGENDA[1].title} title="Each object gets an id" lesson={SESSION} spec="C3" presses={3}>
        <IdCast />
      </Panel>
    ),
  },
  {
    id: 'id-function',
    section: AGENDA[1].title,
    label: 'id() gives the id',
    notes: 'Spec C4. Laptops open, playground only. Type it, run it twice. Same number twice? Hands up. Then laptops closed.',
    element: (
      <Panel kicker={AGENDA[1].title} title="id() gives the id" lesson={SESSION} spec="C4" presses={2}>
        <IdTwice />
      </Panel>
    ),
  },
  {
    id: 'name-points',
    section: AGENDA[1].title,
    label: 'A name points at an object',
    notes: 'Spec C5. Python makes the object first. Until now we said a stores Hello; really, a points at it.',
    element: (
      <Panel kicker={AGENDA[1].title} title="A name points at an object" lesson={SESSION} spec="C5" presses={3}>
        <NamePoints />
      </Panel>
    ),
  },
  {
    id: 'new-object',
    section: AGENDA[1].title,
    label: 'Same id, or a new one?',
    notes: 'Spec C6. Same? Hands up. Different? A string cannot change, remember task 1, so + builds a new one. Who said different? That is why.',
    element: (
      <Panel kicker={AGENDA[1].title} title="Same id, or a new one?" lesson={SESSION} spec="C6" presses={5}>
        <NewObject />
      </Panel>
    ),
  },

  /* ── 14 to 18 · Two names, one list ──────────────────────────────── */
  {
    id: 'list-object',
    section: AGENDA[2].title,
    label: 'A list is an object too',
    notes: 'Spec C7. Each item is an object. The list holds an arrow to each item. From now on we draw it short.',
    element: (
      <Panel kicker={AGENDA[2].title} title="A list is an object too" lesson={SESSION} spec="C7" presses={4}>
        <ListObject />
      </Panel>
    ),
  },
  {
    id: 'two-lists',
    section: AGENDA[2].title,
    label: 'Same values. Same list?',
    notes: 'Spec C8. Same? Hands up. Different? Two sets of brackets, two lists. Like Way B in the hook.',
    element: (
      <Panel kicker={AGENDA[2].title} title="Same values. Same list?" lesson={SESSION} spec="C8" presses={3}>
        <TwoLists />
      </Panel>
    ),
  },
  {
    id: 'second-name',
    section: AGENDA[2].title,
    label: 'A second name',
    notes: 'Spec C9. Not a copy: the same list. Take answers before press 2. No brackets on the right, so no new list. Like Way A in the hook.',
    element: (
      <Panel kicker={AGENDA[2].title} title="A second name" lesson={SESSION} spec="C9" presses={3}>
        <SecondName />
      </Panel>
    ),
  },
  {
    id: 'task-2',
    section: AGENDA[2].title,
    label: 'Predict, then run',
    notes: 'Spec T2, eleven presses, timer 4:00. Worksheet open, type your four lines, then run both. Walk A, then B, one line per press. Who typed [1, 2, 3, 5] for list a in B? You were thinking Way B. Do not name anyone.',
    element: (
      <Panel kicker={AGENDA[2].title} title="Predict, then run" lesson={SESSION} spec="T2" presses={11}>
        <Task2 />
      </Panel>
    ),
  },
  {
    id: 'freeze-frame',
    section: AGENDA[2].title,
    label: 'Freeze frame',
    notes: 'Spec G1, thirteen presses. Read each option: how many think A? Hands up. Then B, then C. Keys 1 to 3 or a click mark the room\'s pick. Then one line per press; at the verdict, point at the boxes.',
    element: (
      <Panel kicker={AGENDA[2].title} title="Freeze frame" lesson={SESSION} spec="G1" presses={13}>
        <FreezeFrame />
      </Panel>
    ),
  },

  /* ── 19 · S-QUIZ ─────────────────────────────────────────────────── */
  { id: 'quiz', section: 'Quiz', label: 'Quiz Time!', transition: 'zoom', element: <QuizTimeSlide lesson={SESSION} /> },

  /* ── 20 to 24 · Change or move? ──────────────────────────────────── */
  {
    id: 'move-name',
    section: AGENDA[3].title,
    label: 'Change the list, or move the name?',
    notes: 'Spec C10, seven presses. Option A, hands up. Option B. Watch list_b\'s arrow. Line 3 did not touch the list: it moved list_a.',
    element: (
      <Panel kicker={AGENDA[3].title} title="Change the list, or move the name?" lesson={SESSION} spec="C10" presses={7}>
        <MoveName />
      </Panel>
    ),
  },
  {
    id: 'follow-arrows',
    section: AGENDA[3].title,
    label: 'Follow the arrows',
    notes: 'Spec E1, thirteen presses. Option by option: list b prints [1, 2]? Hands up. [1, 2, 6, 7]? Watch list_b\'s arrow. Last press: did the line change the list, or move a name?',
    element: (
      <Panel kicker={AGENDA[3].title} title="Follow the arrows" lesson={SESSION} spec="E1" presses={13}>
        <PlusWalk />
      </Panel>
    ),
  },
  {
    id: 'task-3',
    section: AGENDA[3].title,
    label: 'One list or two?',
    notes: 'Spec T3, eight presses, timer 4:00. Worksheet open: one list or two for lines 2 to 5, then type the prints; do not run it yet. Then check each line before the next press.',
    element: (
      <Panel kicker={AGENDA[3].title} title="One list or two?" lesson={SESSION} spec="T3" presses={8}>
        <Task3 />
      </Panel>
    ),
  },
  {
    id: 'list-in-list',
    section: AGENDA[3].title,
    label: 'A list inside a list',
    notes: 'Spec C11, six presses. Option A, hands up. Option B. list_b holds list_a\'s own list, not a copy.',
    element: (
      <Panel kicker={AGENDA[3].title} title="A list inside a list" lesson={SESSION} spec="C11" presses={6}>
        <NestedRef />
      </Panel>
    ),
  },
  {
    id: 'number-in-list',
    section: AGENDA[3].title,
    label: 'A number inside a list',
    notes: 'Spec C12, seven presses. Option A, hands up. Option B. Same rule as before: = moves one name.',
    element: (
      <Panel kicker={AGENDA[3].title} title="A number inside a list" lesson={SESSION} spec="C12" presses={7}>
        <NumberRef />
      </Panel>
    ),
  },

  /* ── 25 · X1 · Exit ──────────────────────────────────────────────── */
  {
    id: 'exit',
    section: 'Exit',
    label: "Keep Kiran's songs",
    notes: 'Spec X1, two presses, timer 2:30. Everyone answers alone. Then option A, hands up. B. C. D. Go through every option, not only the right one.',
    element: (
      <Panel kicker="Exit" title="Keep Kiran's songs" lesson={SESSION} spec="X1" presses={2}>
        <ExitKeep />
      </Panel>
    ),
  },

  /* ── 26 · K1 · Takeaways ─────────────────────────────────────────── */
  {
    id: 'takeaways',
    section: 'Close',
    label: 'Today, in six examples',
    notes: 'Spec K1, six presses. Read heading, code, result, sentence.',
    element: (
      <Panel kicker="Key takeaways" title="Today, in six examples" lesson={SESSION} spec="K1" presses={6}>
        <Takeaways />
      </Panel>
    ),
  },

  /* ── 27, 28 · Feedback, Thank you ────────────────────────────────── */
  /* ── 27 · Next session (user, 2026-10-12): the template's signpost, after the takeaways ── */
  { id: 'next-session', section: 'Close', label: 'Next session', transition: 'zoom', notes: 'Next session: Lists and Strings.', element: <NextSessionSlide title="Lists and Strings" lesson={SESSION} /> },
  /* 28 · Feedback */
  { id: 'feedback', section: 'Close', label: 'Feedback', transition: 'fade', element: <FeedbackEmbedSlide lesson={SESSION} /> },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
  /* 29 · All The Best, the deck's final slide (user, 2026-10-12): the template's send-off, the thank-you frame with different words. */
  { id: 'all-the-best', section: 'Close', label: 'All the best', transition: 'zoom', element: <ThankYouSlide title="All The Best" /> },
]
