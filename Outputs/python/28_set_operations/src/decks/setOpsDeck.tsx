import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, SectionBreakerSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { ClassroomQuiz } from './figures/ClassroomQuiz'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { RecapSort } from './figures/RecapSort'
import { GroupHook } from './figures/GroupHook'
import { Difference, Intersection, SymDiff, ThreePlaces, Union, UnionList } from './figures/OpCards'
import { Gate } from './figures/Gate'
import { Task1, Task2 } from './figures/Tasks'
import { Regions } from './figures/Regions'
import { PollHook } from './figures/PollHook'
import { Disjoint, Subset, Superset } from './figures/Compare'
import { Inside } from './figures/Inside'
import { ExitPlan } from './figures/Exit'
import { Takeaways } from './figures/Takeaways'
import { WhatItIs } from './figures/DataStructures'
import { NOTES, SPEC } from './figures/spec'
import { installGestures } from './figures/gestures'
import { installSpecKeys } from './figures/keys'

/**
 * PYTHON · "Set Operations" (Programming Foundations, session 28)
 *
 * Built from `Outputs/python/session_plans/28_set_operations/plan.md`.
 *
 * ONE SLIDE PER SPEC CARD. The source is the pedagogy team's session spec,
 * `Reference ppt's/28_set_operations_session_spec.json` (the data) and its
 * reading page `…_spec.html`: 23 beats, 27 cards, 75 minutes. All 27 are
 * here, in the spec's order, with DS3 from the change spec of 2026-10-09
 * (its own 2-minute beat after the agenda: 24 beats, 28 cards). Each card slide carries `data-spec` and
 * `data-presses` with the spec's press count.
 *
 * THE WORDS ARE THE SPEC'S EXACT WORDS (spec rule 5) with content rule 36 on
 * every line. THE CODE, EVERY STEP, ROUND AND OUTPUT ARE READ FROM THE JSON
 * (`figures/spec.ts`, generated; spec rule 6), and every program was run on
 * CPython 3.12.3. The speaker notes are the spec's own say lines (`NOTES`).
 *
 * ONE PICTURE (spec note 5, `figures/venn.tsx`): every group is a circle of
 * name chips with no numbers and no order; shared people sit in the middle;
 * an operation fills a new circle with copies, and never changes the two it
 * reads.
 *
 * ONE WORLD (spec note 2): Teja's chat groups, CSE-A gang (8) and Hostel
 * cricket (7), sharing Teja, Ravi and Kiran. The drawn chat app keeps its own
 * colours and carries no product name or logo (content rules 12 and 37).
 *
 * THE SPEC'S PRESSES ARE THE KIT'S BUILD STEPS. Keys (build contract 3):
 * arrows one press, F full screen, A all cards, End the whole card, 1 to 4 a
 * vote (`figures/keys.ts`). The Autoplay switch is on every card
 * (generate-slides section 2); it opens on only where no vote or timer is on
 * the card (`figures/autoplay.ts`).
 *
 * THE AGENDA IS STATIC (content rule 44). THE QUIZ is `ClassroomQuiz`.
 * NAVIGATION: keyboard, trackpad swipe and touch swipe (`figures/gestures.ts`).
 */

installGestures()
installSpecKeys()

const SESSION = 'Set Operations'

export const setOpsMeta: DeckMeta = {
  title: SESSION,
  course: 'Python',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/** The four agenda stops, word for word from the spec. */
const AG: string[] = SPEC['S-AGENDA'].show
const AGENDA = [0, 2, 4, 6].map((i) => ({ title: AG[i], sub: AG[i + 1] }))

const OPS = 'Set Operations'
const CMP = 'Set Comparisons'

/** A card on the zoned frame, its title the spec's heading. */
function card(id: string, section: string, slideId: string, kicker: string, body: ReactNode, transition?: SlideDef['transition']): SlideDef {
  const c = SPEC[id]
  return {
    id: slideId,
    section,
    label: c.heading ?? c.title,
    notes: `Spec ${id}, ${c.press_count} press${c.press_count === 1 ? '' : 'es'}. ${NOTES[id] ?? ''}`,
    ...(transition ? { transition } : {}),
    element: (
      <Panel kicker={kicker} title={c.heading ?? c.title} lesson={SESSION} spec={id} presses={c.press_count}>
        {body}
      </Panel>
    ),
  }
}

export const setOpsDeck: SlideDef[] = [
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
          { text: 'A set keeps each value once, in no order', sub: 'you ask if a value is there, never where' },
          { text: 'add and update put values in', sub: 'update with a string adds its letters' },
          { text: 'remove complains, discard does not', sub: 'a missing name: KeyError, or nothing' },
        ]}
      />
    ),
  },
  card('S-RECAP', 'Recap', 'recap-sort', 'Recap', <RecapSort />),

  /* ── 4 · H1 · the hook ───────────────────────────────────────────── */
  card('H1', 'Hook', 'group-hook', 'Programming Foundations', <GroupHook />),

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  /* Static, as sessions 19 to 26: no step-through, no selected point, no Next (content rule 44). */
  { id: 'agenda', section: 'Today', label: 'Agenda', notes: `Spec S-AGENDA. ${NOTES['S-AGENDA']}`, element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 · DS3 · what a set is, from last class ───────────────────── */
  /* The change spec "28 Set Operations: recall what a set is" (2026-10-09):
     session 27's grid, said from memory, one set cell per press. */
  card('DS3', 'Recap', 'what-a-set-is', 'Recap', <WhatItIs />),

  /* ── 8 to 14 · the four operations ───────────────────────────────── */
  card('C1', AGENDA[0].title, 'three-places', OPS, <ThreePlaces />),
  card('C2', AGENDA[0].title, 'union', OPS, <Union />),
  card('C3', AGENDA[0].title, 'union-list', OPS, <UnionList />),
  card('C4', AGENDA[1].title, 'intersection', OPS, <Intersection />),
  card('C5', AGENDA[2].title, 'difference', OPS, <Difference />),
  card('C6', AGENDA[1].title, 'symmetric-difference', OPS, <SymDiff />),
  card('E1', AGENDA[1].title, 'four-rules', OPS, <Gate />),

  /* ── 15, 16 · Task 1 and the game ────────────────────────────────── */
  card('T1', AGENDA[2].title, 'task-1', 'Task 1', <Task1 />),
  card('G1', AGENDA[2].title, 'light-the-regions', 'Game', <Regions />),

  /* ── 17 · S-QUIZ ─────────────────────────────────────────────────── */
  { id: 'quiz', section: 'Quiz', label: 'Classroom Quiz', transition: 'zoom', notes: 'Spec S-QUIZ. Open the quiz on your portal. Answer every question on your own. Then we go through the answers together.', element: <ClassroomQuiz lesson={SESSION} /> },

  /* ── 18 to 22 · comparisons ──────────────────────────────────────── */
  card('H2', AGENDA[3].title, 'poll-hook', 'Programming Foundations', <PollHook />),
  {
    id: 'divider-comparisons',
    section: AGENDA[3].title,
    label: SPEC.D1.heading,
    transition: 'zoom',
    notes: `Spec D1. ${NOTES.D1}`,
    element: (
      <div className="relative h-full w-full" data-spec="D1" data-presses={SPEC.D1.press_count}>
        <SectionBreakerSlide index="02" kicker={SESSION} title={SPEC.D1.heading} lesson={SESSION} />
      </div>
    ),
  },
  card('C7', AGENDA[3].title, 'subset', CMP, <Subset />),
  card('C8', AGENDA[3].title, 'superset', CMP, <Superset />),
  card('C9', AGENDA[3].title, 'disjoint', CMP, <Disjoint />),

  /* ── 23, 24 · the game and Task 2 ────────────────────────────────── */
  card('G2', AGENDA[3].title, 'inside-around-apart', 'Game', <Inside />),
  card('T2', AGENDA[3].title, 'task-2', 'Task 2', <Task2 />),

  /* ── 25 · X1 · Exit ──────────────────────────────────────────────── */
  card('X1', 'Exit', 'exit', 'Exit', <ExitPlan />),

  /* ── 26 · K1 · Takeaways ─────────────────────────────────────────── */
  card('K1', 'Close', 'takeaways', 'Key takeaways', <Takeaways />),

  /* ── 27, 28 · Feedback, Thank you ────────────────────────────────── */
  { id: 'feedback', section: 'Close', label: 'Feedback', transition: 'fade', element: <FeedbackEmbedSlide lesson={SESSION} /> },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
