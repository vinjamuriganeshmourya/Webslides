import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, SectionBreakerSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { ClassroomQuiz } from './figures/ClassroomQuiz'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { RecapBug } from './figures/RecapBug'
import { SheetHook } from './figures/SheetHook'
import { CheckIt, MakeACopy, SameSheet } from './figures/DictCards'
import { Loop } from './figures/Loop'
import { Task1, Task2 } from './figures/Tasks'
import { ChangeOrMove } from './figures/ChangeOrMove'
import { DhabaHook } from './figures/DhabaHook'
import { OpensDict, OpensList, PacksDict, PacksTuple, RealDict } from './figures/ArgCards'
import { Lands } from './figures/Lands'
import { Bins } from './figures/Bins'
import { ExitPlan } from './figures/Exit'
import { Takeaways } from './figures/Takeaways'
import { NOTES, SPEC } from './figures/spec'
import { installGestures } from './figures/gestures'
import { installSpecKeys } from './figures/keys'

/**
 * PYTHON · "Working with Dictionaries" (Programming Foundations, session 30)
 *
 * Built from `Outputs/python/session_plans/30_working_with_dictionaries/plan.md`.
 *
 * ONE SLIDE PER SPEC CARD. The source is the pedagogy team's session spec,
 * `Reference ppt's/30_working_with_dictionaries_session_spec.json` (the
 * data) and its reading page `…_spec.html`: 24 beats, 27 cards, 75 minutes.
 * All 27 are here, in the spec's order. Each card slide carries `data-spec`
 * and `data-presses` with its press count (K1: seven, see its file).
 *
 * THE WORDS ARE THE SPEC'S EXACT WORDS (spec rule 5) with content rule 36 on
 * every line. THE CODE, EVERY STEP, ROUND AND OUTPUT ARE READ FROM THE JSON
 * (`figures/spec.ts`, generated; spec rule 6), and every program was run on
 * CPython 3.12.3. The speaker notes are the spec's own say lines (`NOTES`).
 *
 * TWO PICTURES (spec notes 5 and 6): `figures/sheet.tsx`, a dictionary as
 * Divya's Google Sheet with name tags over it; `figures/boxes.tsx`, a
 * function's parameters as boxes the call's arguments fly into.
 *
 * ONE WORLD (spec note 2): CR Divya's Ooty trip money sheet; Teja 1500, Ravi
 * 800, Kiran 0; the dhaba bill on the way; hostel room cards.
 *
 * THE SPEC'S PRESSES ARE THE KIT'S BUILD STEPS. Keys (build contract 3):
 * arrows one press, F full screen, A all cards, End the whole card, 1 to 4 a
 * vote (`figures/keys.ts`). The Autoplay switch is on every card and opens
 * off everywhere (the 2026-10-09 view fixes, kept; `figures/autoplay.ts`).
 *
 * THE AGENDA IS STATIC (content rule 44). THE QUIZ is `ClassroomQuiz`.
 * NAVIGATION: keyboard, trackpad swipe and touch swipe (`figures/gestures.ts`).
 */

installGestures()
installSpecKeys()

const SESSION = 'Working with Dictionaries'

export const dictsMeta: DeckMeta = {
  title: SESSION,
  course: 'Python',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/** The four agenda stops, word for word from the spec. */
const AG: string[] = SPEC['S-AGENDA'].show
const AGENDA = [0, 2, 4, 6].map((i) => ({ title: AG[i], sub: AG[i + 1] }))

/* the original deck's own kickers, both after the title card (spec rule 4) */
const DM = 'Dictionary Methods'
const VL = 'Variable Length Arguments'

/** A card on the zoned frame, its title the spec's heading. `presses` overrides the spec's count (K1). */
function card(id: string, section: string, slideId: string, kicker: string, body: ReactNode, presses?: number): SlideDef {
  const c = SPEC[id]
  const n = presses ?? c.press_count
  return {
    id: slideId,
    section,
    label: c.heading ?? c.title,
    notes: `Spec ${id}, ${n} press${n === 1 ? '' : 'es'}. ${NOTES[id] ?? ''}`,
    element: (
      <Panel kicker={kicker} title={c.heading ?? c.title} lesson={SESSION} spec={id} presses={n}>
        {body}
      </Panel>
    ),
  }
}

export const dictsDeck: SlideDef[] = [
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
          { text: 'A dictionary holds key and value rows', sub: 'in the order they were added' },
          { text: 'A key is found by its exact name', sub: 'a capital letter makes a different key' },
          { text: 'menu[key] = value changes a row, or adds one', sub: 'print(menu[key]) reads it back' },
        ]}
      />
    ),
  },
  card('S-RECAP', 'Recap', 'recap-bug', 'Recap', <RecapBug />),

  /* ── 4 · H1 · the hook ───────────────────────────────────────────── */
  card('H1', 'Hook', 'sheet-hook', 'Programming Foundations', <SheetHook />),

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  /* Static, as sessions 19 to 28: no step-through, no selected point, no Next (content rule 44). */
  { id: 'agenda', section: 'Today', label: 'Agenda', notes: `Spec S-AGENDA. ${NOTES['S-AGENDA']}`, element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 to 10 · two names, a copy, clear and the loop ─────────────── */
  card('C1', AGENDA[0].title, 'same-sheet', DM, <SameSheet />),
  card('C2', AGENDA[0].title, 'make-a-copy', DM, <MakeACopy />),
  card('C3', AGENDA[1].title, 'check-it', DM, <CheckIt />),
  card('E1', AGENDA[1].title, 'remove-the-unpaid', DM, <Loop />),

  /* ── 11, 12 · Task 1 and the game ────────────────────────────────── */
  card('T1', AGENDA[0].title, 'task-1', 'Task 1', <Task1 />),
  card('G1', AGENDA[0].title, 'change-or-move', 'Game', <ChangeOrMove />),

  /* ── 13 · S-QUIZ ─────────────────────────────────────────────────── */
  { id: 'quiz', section: 'Quiz', label: 'Classroom Quiz', transition: 'zoom', notes: 'Spec S-QUIZ. Open the quiz on your portal. Answer every question on your own. Then we go through the answers together.', element: <ClassroomQuiz lesson={SESSION} /> },

  /* ── 14, 15 · the second hook and the divider ────────────────────── */
  card('H2', AGENDA[2].title, 'dhaba-hook', 'Programming Foundations', <DhabaHook />),
  {
    id: 'divider-arguments',
    section: AGENDA[2].title,
    label: SPEC.D1.heading,
    transition: 'zoom',
    notes: `Spec D1. ${NOTES.D1}`,
    element: (
      <div className="relative h-full w-full" data-spec="D1" data-presses={SPEC.D1.press_count}>
        <SectionBreakerSlide index="02" kicker={SESSION} title={SPEC.D1.heading} lesson={SESSION} />
      </div>
    ),
  },

  /* ── 16 to 20 · *args and **kwargs ───────────────────────────────── */
  card('C4', AGENDA[2].title, 'packs-a-tuple', VL, <PacksTuple />),
  card('C5', AGENDA[2].title, 'opens-a-list', VL, <OpensList />),
  card('C6', AGENDA[3].title, 'packs-a-dictionary', VL, <PacksDict />),
  card('C7', AGENDA[3].title, 'a-real-dictionary', VL, <RealDict />),
  card('C8', AGENDA[3].title, 'opens-a-dictionary', VL, <OpensDict />),

  /* ── 21 to 23 · the game, the sort, Task 2 ───────────────────────── */
  card('G2', AGENDA[3].title, 'where-does-it-land', 'Game', <Lands />),
  card('C9', AGENDA[3].title, 'when-to-use-them', VL, <Bins />),
  card('T2', AGENDA[3].title, 'task-2', 'Task 2', <Task2 />),

  /* ── 24 · X1 · Exit ──────────────────────────────────────────────── */
  card('X1', 'Exit', 'exit', 'Exit', <ExitPlan />),

  /* ── 25 · K1 · Takeaways (seven presses, see Takeaways.tsx) ──────── */
  card('K1', 'Close', 'takeaways', 'Key takeaways', <Takeaways />, 7),

  /* ── 26, 27 · Feedback, Thank you ────────────────────────────────── */
  { id: 'feedback', section: 'Close', label: 'Feedback', transition: 'fade', element: <FeedbackEmbedSlide lesson={SESSION} /> },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
