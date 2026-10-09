import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, SectionBreakerSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { ClassroomQuiz } from './figures/ClassroomQuiz'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { RecapSort } from './figures/Recap'
import { PaymentHook } from './figures/PaymentHook'
import { NoneDivider, NoneValue, NoReturn, PrintNone } from './figures/NoneCards'
import { CreateTuple, OneItem, ReadNever, ToTuple, TupleOps, WhatTuple } from './figures/TupleCards'
import { Membership } from './figures/Membership'
import { Task1, Task2 } from './figures/Tasks'
import { Impostor } from './figures/Impostor'
import { ReceiptHook } from './figures/ReceiptHook'
import { CountFirst, Unpacking } from './figures/Unpack'
import { FillBoxes } from './figures/FillBoxes'
import { Packing, ReturnTwo } from './figures/Pack'
import { ExitPlan } from './figures/Exit'
import { Takeaways } from './figures/Takeaways'
import { NOTES, SPEC } from './figures/spec'
import { installGestures } from './figures/gestures'
import { installSpecKeys } from './figures/keys'

/**
 * PYTHON · "Tuples and Sequences" (Programming Foundations, session 26)
 *
 * Built from `Outputs/python/session_plans/26_tuples_and_sequences/plan.md`.
 *
 * ONE SLIDE PER SPEC CARD. The source is the pedagogy team's session spec,
 * `Reference ppt's/26_tuples_and_sequences_session_spec.json` (the data) and
 * its reading page `…_spec.html`: 23 beats, 34 cards, 75 minutes. All 34 are
 * here, in the spec's order, the four dividers included. Each card slide
 * carries `data-spec` and `data-presses` with the spec's press count.
 *
 * THE WORDS ARE THE SPEC'S EXACT WORDS (spec rule 5) with content rule 36 on
 * every line. THE CODE, EVERY STEP, ROUND AND OUTPUT ARE READ FROM THE JSON
 * (`figures/spec.ts`, generated; spec rule 6), and every program was run on
 * CPython 3.12.3 (course rule R3). The speaker notes are the spec's own say
 * lines (`NOTES`, generated from the same JSON).
 *
 * ONE PICTURE (spec note 5, `figures/rows.tsx`): a row of cells with its index
 * under each; a list's row has handles, a tuple's row has a lock.
 *
 * ONE WORLD (spec note 2): Teja's UPI payments at the Sri Sai Canteen. The
 * drawn payment app keeps its own colours and carries no product name or
 * logo (content rules 12 and 37); everything else is the template's.
 *
 * THE SPEC'S PRESSES ARE THE KIT'S BUILD STEPS. Keys (build contract 3):
 * arrows one press, F full screen, A all cards, End the whole card, 1 to 4 a
 * vote (`figures/keys.ts`). The Autoplay switch is on every card
 * (generate-slides section 2); it opens on only where no vote or timer is
 * on the card (`figures/autoplay.ts`). Movement inside one press plays only
 * when the press is reached going forward.
 *
 * THE AGENDA IS STATIC (content rule 44). THE QUIZ is `ClassroomQuiz`.
 * NAVIGATION: keyboard, trackpad swipe and touch swipe (`figures/gestures.ts`).
 */

installGestures()
installSpecKeys()

const SESSION = 'Tuples and Sequences'

export const tuplesMeta: DeckMeta = {
  title: SESSION,
  course: 'Python',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/** The four agenda stops, word for word from the spec. */
const AG: string[] = SPEC['S-AGENDA'].show
const AGENDA = [0, 2, 4, 6].map((i) => ({ title: AG[i], sub: AG[i + 1] }))

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

/** A divider card: the deck's one-word divider, on the kit's breaker. */
function divider(id: string, n: string, section: string, slideId: string): SlideDef {
  const c = SPEC[id]
  return {
    id: slideId,
    section,
    label: c.heading,
    transition: 'zoom',
    notes: `Spec ${id}. ${NOTES[id] ?? ''}`,
    element: (
      <div className="relative h-full w-full" data-spec={id} data-presses={c.press_count}>
        <SectionBreakerSlide index={n} kicker={SESSION} title={c.heading} lesson={SESSION} />
      </div>
    ),
  }
}

export const tuplesDeck: SlideDef[] = [
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
          { text: 'append, insert and sort change the same list', sub: 'queue itself is different afterwards' },
          { text: 'count, index and sorted give back an answer', sub: 'queue stays as it was' },
          { text: 'sort gives back None', sub: 'x = queue.sort() puts None in x' },
        ]}
      />
    ),
  },
  card('S-RECAP', 'Recap', 'recap-sort', 'Recap', <RecapSort />),

  /* ── 4 · H1 · the hook ───────────────────────────────────────────── */
  card('H1', 'Hook', 'payment-hook', 'Programming Foundations', <PaymentHook />),

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  /* Static, as sessions 19 to 24: no step-through, no selected point, no Next (content rule 44). */
  { id: 'agenda', section: 'Today', label: 'Agenda', notes: `Spec S-AGENDA. ${NOTES['S-AGENDA']}`, element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 to 10 · None ──────────────────────────────────────────────── */
  {
    id: 'divider-none',
    section: AGENDA[0].title,
    label: SPEC.C1.heading,
    transition: 'zoom',
    notes: `Spec C1. ${NOTES.C1}`,
    element: (
      <div className="relative h-full w-full" data-spec="C1" data-presses={1}>
        <NoneDivider lesson={SESSION} kicker={SESSION} />
      </div>
    ),
  },
  card('C2', AGENDA[0].title, 'none-value', AGENDA[0].title, <NoneValue />),
  card('C3', AGENDA[0].title, 'no-return', AGENDA[0].title, <NoReturn />),
  card('C4', AGENDA[0].title, 'print-none', AGENDA[0].title, <PrintNone />),

  /* ── 11 to 17 · Tuples ───────────────────────────────────────────── */
  divider('C5', '02', AGENDA[1].title, 'divider-tuples'),
  card('C6', AGENDA[1].title, 'what-tuple', AGENDA[1].title, <WhatTuple />),
  card('C7', AGENDA[1].title, 'create-tuple', AGENDA[1].title, <CreateTuple />),
  card('C8', AGENDA[1].title, 'one-item', AGENDA[1].title, <OneItem />),
  card('C9', AGENDA[1].title, 'read-never', AGENDA[1].title, <ReadNever />),
  card('C10', AGENDA[1].title, 'tuple-ops', AGENDA[1].title, <TupleOps />),
  card('C11', AGENDA[1].title, 'to-tuple', AGENDA[1].title, <ToTuple />),

  /* ── 18 to 21 · Membership check ─────────────────────────────────── */
  divider('C12', '03', AGENDA[2].title, 'divider-membership'),
  card('C13', AGENDA[2].title, 'membership', AGENDA[2].title, <Membership />),
  card('T1', AGENDA[2].title, 'task-1', 'Task 1', <Task1 />),
  card('G1', AGENDA[2].title, 'impostor', 'Game', <Impostor />),

  /* ── 22 · S-QUIZ ─────────────────────────────────────────────────── */
  { id: 'quiz', section: 'Quiz', label: 'Classroom Quiz', transition: 'zoom', notes: 'Spec S-QUIZ. Open the quiz on your portal. Answer every question on your own. Then we go through the answers together.', element: <ClassroomQuiz lesson={SESSION} /> },

  /* ── 23 to 29 · Packing and unpacking ────────────────────────────── */
  card('H2', AGENDA[3].title, 'receipt-hook', AGENDA[3].title, <ReceiptHook />),
  divider('C14', '04', AGENDA[3].title, 'divider-packing'),
  card('C15', AGENDA[3].title, 'unpacking', AGENDA[3].title, <Unpacking />),
  card('E1', AGENDA[3].title, 'count-first', AGENDA[3].title, <CountFirst />),
  card('G2', AGENDA[3].title, 'fill-boxes', 'Game', <FillBoxes />),
  card('C16', AGENDA[3].title, 'packing', AGENDA[3].title, <Packing />),
  card('C17', AGENDA[3].title, 'return-two', AGENDA[3].title, <ReturnTwo />),

  /* ── 30 · T2 ─────────────────────────────────────────────────────── */
  card('T2', AGENDA[3].title, 'task-2', 'Task 2', <Task2 />),

  /* ── 31 · X1 · Exit ──────────────────────────────────────────────── */
  card('X1', 'Exit', 'exit', 'Exit', <ExitPlan />),

  /* ── 32 · K1 · Takeaways ─────────────────────────────────────────── */
  card('K1', 'Close', 'takeaways', 'Key takeaways', <Takeaways />),

  /* ── 33, 34 · Feedback, Thank you ────────────────────────────────── */
  { id: 'feedback', section: 'Close', label: 'Feedback', transition: 'fade', element: <FeedbackEmbedSlide lesson={SESSION} /> },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
