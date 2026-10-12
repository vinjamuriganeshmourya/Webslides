import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, SectionBreakerSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { ClassroomQuiz } from './figures/ClassroomQuiz'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { RecapTiles } from './figures/RecapTiles'
import { CanteenHook } from './figures/CanteenHook'
import { DataFamily, WhatItIs } from './figures/DataStructures'
import { CreateDict, EmptyDict, KeysOnce, WhatDict } from './figures/DictCards'
import { Bracket, GetOrError, InChecks } from './figures/Lookup'
import { AddChange, Delete } from './figures/Ops'
import { Bill } from './figures/Bill'
import { Task1, Task2 } from './figures/Tasks'
import { LookItUp } from './figures/LookItUp'
import { CheapHook } from './figures/CheapHook'
import { ExitSign } from './figures/Exit'
import { Takeaways } from './figures/Takeaways'
import { LoopRows, ThreeViews, WindowPhoto } from './figures/Views'
import { BeAnna } from './figures/BeAnna'
import { CanBeKey, FromPairs } from './figures/Convert'
import { NOTES, SPEC } from './figures/spec'
import { installGestures } from './figures/gestures'
import { installSpecKeys } from './figures/keys'

/**
 * PYTHON · "Dictionaries" (Programming Foundations, session 29)
 *
 * Built from `Outputs/python/session_plans/29_dictionaries/plan.md`.
 *
 * ONE SLIDE PER SPEC CARD. The source is the pedagogy team's session spec,
 * `Reference ppt's/29_dictionaries_session_spec.json` (the data) and its
 * reading page `…_spec.html`: 23 beats, 36 cards, 75 minutes. All 36 are
 * here, in the spec's order. Each card slide carries `data-spec` and
 * `data-presses` with the spec's press count.
 *
 * THE WORDS ARE THE SPEC'S EXACT WORDS (spec rule 5) with content rule 36 on
 * every line. THE CODE, EVERY WALK, ROUND AND OUTPUT ARE READ FROM THE JSON
 * (`figures/spec.ts`, generated; spec rule 6), and every program was run on
 * CPython 3.12.3 (course rule R3). The speaker notes are the spec's own say
 * lines (`NOTES`, generated from the same JSON).
 *
 * ONE PICTURE (spec note 5, `figures/board.tsx`): Anna's canteen board, one
 * row per key, the name tag on the left and its price card on the right,
 * in the order the rows were added, never a number. ONE WORLD (spec note
 * 2): the college canteen, Anna at the counter, Teja and his friends.
 *
 * THE SPEC'S PRESSES ARE THE KIT'S BUILD STEPS. Keys (build contract 3):
 * arrows one press, F full screen, A all cards, End the whole card, 1 to 4 a
 * vote (`figures/keys.ts`). The Autoplay switch is on every card and opens
 * off everywhere (the 2026-10-09 view fixes); movement inside one press
 * plays only when the press is reached going forward.
 *
 * THE AGENDA IS STATIC (content rule 44). THE QUIZ is `ClassroomQuiz`.
 * NAVIGATION: keyboard, trackpad swipe and touch swipe (`figures/gestures.ts`).
 */

installGestures()
installSpecKeys()

const SESSION = 'Dictionaries'

export const dictMeta: DeckMeta = {
  title: SESSION,
  course: 'Python',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/** The four agenda stops, word for word from the spec. */
const AG: string[] = SPEC['S-AGENDA'].show
const AGENDA = [0, 2, 4, 6].map((i) => ({ title: AG[i], sub: AG[i + 1] }))
const [S1, S2, S3, S4] = AGENDA.map((a) => a.title)

/** A card on the zoned frame, its title the spec's heading. */
function card(id: string, section: string, slideId: string, kicker: string, body: ReactNode, transition?: SlideDef['transition'], mode?: 'top' | 'center'): SlideDef {
  const c = SPEC[id]
  return {
    id: slideId,
    section,
    label: c.heading ?? c.title,
    notes: `Spec ${id}, ${c.press_count} press${c.press_count === 1 ? '' : 'es'}. ${NOTES[id] ?? ''}`,
    ...(transition ? { transition } : {}),
    element: (
      <Panel kicker={kicker} title={c.heading ?? c.title} lesson={SESSION} spec={id} presses={c.press_count} mode={mode}>
        {body}
      </Panel>
    ),
  }
}

/** A divider card: the kit's section breaker, carrying the spec marker. */
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

export const dictDeck: SlideDef[] = [
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
          { text: 'Union keeps everyone from both, each once', sub: 'Teja and Ravi in both groups count once' },
          { text: 'Minus keeps from the set before it', sub: 'cricket - cse: in cricket, not in cse' },
          { text: 'The operators need two sets', sub: 'with a list, use union()' },
        ]}
      />
    ),
  },
  card('S-RECAP', 'Recap', 'recap-tiles', 'Recap', <RecapTiles />),

  /* ── 4 · H1 · the hook ───────────────────────────────────────────── */
  card('H1', 'Hook', 'canteen-hook', 'Programming Foundations', <CanteenHook />),

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  /* Static, as sessions 19 to 28: no step-through, no selected point, no Next (content rule 44). */
  { id: 'agenda', section: 'Today', label: 'Agenda', notes: `Spec S-AGENDA. ${NOTES['S-AGENDA']}`, element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 to 12 · a name for every price ────────────────────────────── */
  card('DS2', S1, 'data-structures', S1, <DataFamily />),
  card('C1', S1, 'the-board-is-a-dictionary', S1, <WhatDict />),
  card('DS3', S1, 'what-a-dictionary-is', S1, <WhatItIs />),
  card('C2', S1, 'creating-a-dictionary', S1, <CreateDict />),
  card('C3', S1, 'empty-dictionary', S1, <EmptyDict />),
  card('C4', S1, 'keys-are-unique', S1, <KeysOnce />),

  /* ── 13 to 16 · look up a price ──────────────────────────────────── */
  divider('D1', '01', S2, 'divider-accessing'),
  card('C5', S2, 'bracket-takes-the-name', S2, <Bracket />),
  card('C6', S2, 'keyerror-or-none', S2, <GetOrError />),
  card('C7', S2, 'in-checks-the-names', S2, <InChecks />),

  /* ── 17 to 20 · change the board ─────────────────────────────────── */
  divider('D2', '02', S3, 'divider-operations'),
  card('C8', S3, 'add-or-change', S3, <AddChange />),
  card('C9', S3, 'del-wipes-a-row', S3, <Delete />),
  card('E1', S3, 'the-bill', S3, <Bill />),

  /* ── 21, 22 · Task 1 and the game ────────────────────────────────── */
  card('T1', S3, 'task-1', 'Task 1', <Task1 />),
  card('G1', S3, 'look-it-up', 'Game', <LookItUp />),

  /* ── 23 · S-QUIZ ─────────────────────────────────────────────────── */
  { id: 'quiz', section: 'Quiz', label: 'Classroom Quiz', transition: 'zoom', notes: 'Spec S-QUIZ. Open the quiz on your portal. Answer every question on your own. Then we go through the answers together.', element: <ClassroomQuiz lesson={SESSION} /> },

  /* ── 24, 25 · the second hook and the views divider ──────────────── */
  card('H2', S4, 'under-15-hook', 'Programming Foundations', <CheapHook />),
  divider('D3', '03', S4, 'divider-views'),

  /* ── 26 to 31 · the views, the game, dict() and keys ────────────── */
  card('C10', S4, 'three-views', S4, <ThreeViews />),
  card('C11', S4, 'loop-over-the-board', S4, <LoopRows />),
  card('C12', S4, 'window-not-photo', S4, <WindowPhoto />),
  card('G2', S4, 'be-anna', 'Game', <BeAnna />),
  card('C13', S4, 'dict-from-pairs', S4, <FromPairs />),
  card('C14', S4, 'can-it-be-a-key', S4, <CanBeKey />),

  /* ── 32 to 34 · Task 2, Exit, Takeaways ──────────────────────────── */
  card('T2', S4, 'task-2', 'Task 2', <Task2 />),
  card('X1', 'Exit', 'exit', 'Exit', <ExitSign />),
  card('K1', 'Close', 'takeaways', 'Key takeaways', <Takeaways />),

  /* ── 35, 36 · Feedback, Thank you ────────────────────────────────── */
  { id: 'feedback', section: 'Close', label: 'Feedback', transition: 'fade', element: <FeedbackEmbedSlide lesson={SESSION} /> },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
