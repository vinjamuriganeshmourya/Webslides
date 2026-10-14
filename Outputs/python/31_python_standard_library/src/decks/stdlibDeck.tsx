import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { QuizRef } from './figures/QuizRef'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { RecapSort } from './figures/RecapSort'
import { CalcHook } from './figures/CalcHook'
import { Library, Modules } from './figures/LibraryCards'
import { AsCard, FromAsCard, FromCard, ImportOn, Syntax } from './figures/ImportCards'
import { MapBreaker, MathBreaker, RandomBreaker } from './figures/Breakers'
import { Task1, Task2 } from './figures/Tasks'
import { FixImport } from './figures/FixImport'
import { Choice11, Dice10 } from './figures/RandomCards'
import { FoodHook } from './figures/FoodHook'
import { InputLine, MapCard } from './figures/MapCards'
import { FilterCard } from './figures/FilterCards'
import { WhoCalls } from './figures/WhoCalls'
import { ReduceCard } from './figures/Reduce'
import { InsideBuiltin } from './figures/InsideBuiltin'
import { ExitPlan } from './figures/Exit'
import { Takeaways } from './figures/Takeaways'
import { NOTES, SPEC } from './figures/spec'
import { installGestures } from './figures/gestures'
import { installSpecKeys } from './figures/keys'

/**
 * PYTHON · "Python Standard Library" (Programming Foundations, session 31)
 *
 * Built from `Outputs/python/session_plans/31_python_standard_library/plan.md`.
 *
 * ONE SLIDE PER SPEC CARD. The source is the pedagogy team's session spec,
 * `Reference ppt's/31_python_standard_library_session_spec.json` (the data)
 * and its reading page `…_spec.html`: 24 beats, 33 cards, 75 minutes. All
 * 33 are here, in the spec's order. Each card slide carries `data-spec` and
 * `data-presses` with its press count (C10 eight, C11 five, K1 seven: the
 * plan's decision 8).
 *
 * THE WORDS ARE THE SPEC'S EXACT WORDS (spec rule 5) with content rule 36 on
 * every line. THE CODE, EVERY STEP, ROUND AND OUTPUT ARE READ FROM THE JSON
 * (`figures/spec.ts`, generated; spec rule 6), and every program was run on
 * CPython 3.12.3. The speaker notes are the spec's own say lines (`NOTES`).
 *
 * TWO WORLDS (spec note 2): Ravi's phone calculator, upright and sideways
 * (`figures/Calculator.tsx`), Ludo on Teja's phone (`figures/RandomCards.tsx`);
 * the food app near campus (`figures/FoodHook.tsx`). ONE PICTURE for the
 * import cards (spec note 5): the names underlined in `figures/Code.tsx`,
 * the growing table in `figures/imports.tsx`.
 *
 * THE SPEC'S PRESSES ARE THE KIT'S BUILD STEPS. Keys (build contract 3):
 * arrows one press, F full screen, A all cards, End the whole card, 1 to 4 a
 * vote (`figures/keys.ts`). Autoplay: the slide menu's deck-wide setting and
 * this deck's own list (`figures/autoplay.ts`).
 *
 * THE AGENDA IS STATIC (content rule 44). THE QUIZ is `QuizRef` (the reference
 * deck's quiz slide, user 2026-10-13).
 * NAVIGATION: keyboard, trackpad swipe and touch swipe (`figures/gestures.ts`).
 */

installGestures()
installSpecKeys()

const SESSION = 'Python Standard Library'

export const stdlibMeta: DeckMeta = {
  title: SESSION,
  course: 'Python',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/** The four agenda stops, word for word from the spec. */
const AG: string[] = SPEC['S-AGENDA'].show
const AGENDA = [0, 2, 4, 6].map((i) => ({ title: AG[i], sub: AG[i + 1] }))

/* the original deck's own kickers, all after the title card (spec rule 4) */
const PSL = 'Python Standard Library'
const RM = 'Random Module'
const MFR = 'Map, Filter & Reduce'

/** A card on the zoned frame, its title the spec's heading. `presses` overrides the spec's count (C10, C11, K1). */
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

export const stdlibDeck: SlideDef[] = [
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
          { text: '= gives a dictionary a second name', sub: 'one sheet, two names: a change through either is seen by both' },
          { text: 'copy() makes a second dictionary', sub: 'its own sheet, so a change on one leaves the other alone' },
          { text: 'clear() empties the one both names share', sub: 'name = {} gives that name a new empty one' },
        ]}
      />
    ),
  },
  card('S-RECAP', 'Recap', 'recap-sort', 'Recap', <RecapSort />),

  /* ── 4 · H1 · the hook ───────────────────────────────────────────── */
  card('H1', 'Hook', 'calc-hook', 'Programming Foundations', <CalcHook />),

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  /* Static, as sessions 19 to 30: no step-through, no selected point, no Next (content rule 44). */
  { id: 'agenda', section: 'Today', label: 'Agenda', notes: `Spec S-AGENDA. ${NOTES['S-AGENDA']}`, element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7, 8 · the library, modules, packages ───────────────────────── */
  card('C1', AGENDA[0].title, 'the-library', AGENDA[0].title, <Library />),
  card('C2', AGENDA[0].title, 'modules-and-packages', AGENDA[0].title, <Modules />),

  /* ── 9 to 14 · import, the dot, as, from ─────────────────────────── */
  card('C3', AGENDA[1].title, 'import-switches-on', PSL, <ImportOn />),
  { id: 'math-module', section: AGENDA[1].title, label: SPEC.C4.heading, transition: 'zoom', notes: `Spec C4, 1 press. ${NOTES.C4 ?? ''}`, element: <MathBreaker lesson={SESSION} /> },
  card('C5', AGENDA[1].title, 'the-dot', PSL, <Syntax />),
  card('C6', AGENDA[1].title, 'as-a-new-name', PSL, <AsCard />),
  card('C7', AGENDA[1].title, 'from-import', PSL, <FromCard />),
  card('C8', AGENDA[1].title, 'from-import-as', PSL, <FromAsCard />),

  /* ── 15, 16 · Task 1 and the game ────────────────────────────────── */
  card('T1', AGENDA[1].title, 'task-1', 'Task 1', <Task1 />),
  card('G1', AGENDA[1].title, 'fix-the-import', 'Game', <FixImport />),

  /* ── 17 · S-QUIZ ─────────────────────────────────────────────────── */
  /* the reference deck's quiz slide (new-template-working-with-lists, slide 19), on the user's word (2026-10-13) */
  { id: 'quiz', section: 'Quiz', label: 'Quiz Time!', transition: 'zoom', notes: 'Spec S-QUIZ. Open the quiz on your portal. Answer every question on your own. Then we go through the answers together.', element: <QuizRef lesson={SESSION} /> },

  /* ── 18 to 20 · random ───────────────────────────────────────────── */
  { id: 'random-module', section: AGENDA[2].title, label: SPEC.C9.heading, transition: 'zoom', notes: `Spec C9, 1 press. ${NOTES.C9 ?? ''}`, element: <RandomBreaker lesson={SESSION} /> },
  card('C10', AGENDA[2].title, 'who-decides-the-dice', RM, <Dice10 />, 8),
  card('C11', AGENDA[2].title, 'who-plays-first', RM, <Choice11 />, 5),

  /* ── 21, 22 · the second hook and the marker ─────────────────────── */
  card('H2', AGENDA[3].title, 'rating-hook', 'Programming Foundations', <FoodHook />),
  { id: 'map-filter-reduce', section: AGENDA[3].title, label: SPEC.C12.heading, transition: 'zoom', notes: `Spec C12, 2 presses. ${NOTES.C12 ?? ''}`, element: <MapBreaker lesson={SESSION} /> },

  /* ── 23 to 27 · map, the input line, filter, the explainer, reduce ── */
  card('C13', AGENDA[3].title, 'map', MFR, <MapCard />),
  card('C14', AGENDA[3].title, 'the-input-line', MFR, <InputLine />),
  card('C15', AGENDA[3].title, 'filter', MFR, <FilterCard />),
  card('E1', AGENDA[3].title, 'who-calls', MFR, <WhoCalls />),
  card('C16', AGENDA[3].title, 'reduce', MFR, <ReduceCard />),

  /* ── 28, 29 · the game and Task 2 ────────────────────────────────── */
  card('G2', AGENDA[3].title, 'inside-the-built-in', 'Game', <InsideBuiltin />),
  card('T2', AGENDA[3].title, 'task-2', 'Task 2', <Task2 />),

  /* ── 30 · X1 · Exit ──────────────────────────────────────────────── */
  card('X1', 'Exit', 'exit', 'Exit', <ExitPlan />),

  /* ── 31 · K1 · Takeaways (seven presses, see Takeaways.tsx) ──────── */
  card('K1', 'Close', 'takeaways', 'Key takeaways', <Takeaways />, 7),

  /* ── 32, 33 · Feedback, Thank you ────────────────────────────────── */
  { id: 'feedback', section: 'Close', label: 'Feedback', transition: 'fade', element: <FeedbackEmbedSlide lesson={SESSION} /> },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
