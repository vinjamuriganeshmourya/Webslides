import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { ClassroomQuiz } from './figures/ClassroomQuiz'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { RecapMatch } from './figures/RecapMatch'
import { StoryHook } from './figures/StoryHook'
import { CreateSet, EmptySet, Immutable, NoOrder, NoPosition, NoRepeats, WhatSet } from './figures/SetCards'
import { Converter } from './figures/Converter'
import { Task1, Task2 } from './figures/Tasks'
import { Classify } from './figures/Classify'
import { SeenByHook } from './figures/SeenByHook'
import { AddItem, Discard, RemoveComplains, UpdateMany } from './figures/Changing'
import { WhoGetsIn } from './figures/WhoGetsIn'
import { SetOps } from './figures/SetOps'
import { ExitTrending } from './figures/Exit'
import { Takeaways } from './figures/Takeaways'
import { NOTES, SPEC } from './figures/spec'
import { installGestures } from './figures/gestures'
import { installSpecKeys } from './figures/keys'

/**
 * PYTHON · "Sets" (Programming Foundations, session 27)
 *
 * Built from `Outputs/python/session_plans/27_sets/plan.md`.
 *
 * ONE SLIDE PER SPEC CARD. The source is the pedagogy team's session spec,
 * `Reference ppt's/27_sets_session_spec.json` (the data) and its reading page
 * `…_spec.html`: 23 beats, 29 cards, 75 minutes. All 29 are here, in the
 * spec's order. Each card slide carries `data-spec` and `data-presses` with
 * the spec's press count.
 *
 * THE WORDS ARE THE SPEC'S EXACT WORDS (spec rule 5) with content rule 36 on
 * every line. THE CODE, EVERY WALK, ROUND AND OUTPUT ARE READ FROM THE JSON
 * (`figures/spec.ts`, generated; spec rule 6), and every program was run on
 * CPython 3.12.3 (course rule R3). The speaker notes are the spec's own say
 * lines (`NOTES`, generated from the same JSON).
 *
 * ONE PICTURE (spec note 5, `figures/bag.tsx`): a set is a round bag of chips
 * with no numbers, no first and no last; a list or a tuple stays a row of
 * cells with 0, 1, 2 under them (`figures/rows.tsx`).
 *
 * ONE WORLD (spec note 2): Teja's Instagram story and his Close Friends list.
 * The drawn app keeps its own colours and carries no product name or logo
 * (content rules 12 and 37); every person is a character-lab face.
 *
 * THE SPEC'S PRESSES ARE THE KIT'S BUILD STEPS. Keys (build contract 3):
 * arrows one press, F full screen, A all cards, End the whole card, 1 to 4 a
 * vote (`figures/keys.ts`). The Autoplay switch is on every card
 * (generate-slides section 2); it opens on only where no vote or timer is on
 * the card (`figures/autoplay.ts`). Movement inside one press plays only when
 * the press is reached going forward.
 *
 * THE AGENDA IS STATIC (content rule 44). THE QUIZ is `ClassroomQuiz`.
 * NAVIGATION: keyboard, trackpad swipe and touch swipe (`figures/gestures.ts`).
 */

installGestures()
installSpecKeys()

const SESSION = 'Sets'

export const setsMeta: DeckMeta = {
  title: SESSION,
  course: 'Python',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/** The three agenda stops, word for word from the spec. */
const AG: string[] = SPEC['S-AGENDA'].show
const AGENDA = [0, 2, 4].map((i) => ({ title: AG[i], sub: AG[i + 1] }))

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

const [S1, S2, S3] = AGENDA.map((a) => a.title)

export const setsDeck: SlideDef[] = [
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
          { text: 'A tuple needs the comma', sub: '(10) is just 10, an int' },
          { text: 'A tuple cannot change', sub: 'order[1] = 35 stops with a TypeError' },
          { text: 'Unpacking puts one value in one name', sub: 'item, price = ("Tea", 20)' },
        ]}
      />
    ),
  },
  card('S-RECAP', 'Recap', 'recap-match', 'Recap', <RecapMatch />),

  /* ── 4 · H1 · the hook ───────────────────────────────────────────── */
  card('H1', 'Hook', 'story-hook', 'Programming Foundations', <StoryHook />),

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  /* Static, as sessions 19 to 26: no step-through, no selected point, no Next (content rule 44). */
  { id: 'agenda', section: 'Today', label: 'Agenda', notes: `Spec S-AGENDA. ${NOTES['S-AGENDA']}`, element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 to 14 · Sets ──────────────────────────────────────────────── */
  card('C1', S1, 'a-set', S1, <WhatSet />),
  card('C2', S1, 'create-set', S1, <CreateSet />),
  card('C3', S1, 'no-order', S1, <NoOrder />),
  card('C4', S1, 'no-repeats', S1, <NoRepeats />),
  card('C5', S1, 'immutable', S1, <Immutable />),
  card('C6', S1, 'empty-set', S1, <EmptySet />),
  card('E1', S1, 'converting', S1, <Converter />),
  card('C7', S1, 'no-position', S1, <NoPosition />),

  /* ── 15, 16 · Task 1 and the game ────────────────────────────────── */
  card('T1', S1, 'task-1', 'Task 1', <Task1 />),
  card('G1', S1, 'classify', 'Game', <Classify />),

  /* ── 17 · S-QUIZ ─────────────────────────────────────────────────── */
  { id: 'quiz', section: 'Quiz', label: 'Classroom Quiz', transition: 'zoom', notes: 'Spec S-QUIZ. Open the quiz on your portal. Answer every question on your own. Then we go through the answers together.', element: <ClassroomQuiz lesson={SESSION} /> },

  /* ── 18 to 23 · Changing a set ───────────────────────────────────── */
  card('H2', S2, 'seen-by-hook', S2, <SeenByHook />),
  card('C8', S2, 'add', S2, <AddItem />),
  card('C9', S2, 'update', S2, <UpdateMany />),
  card('C10', S2, 'discard', S2, <Discard />),
  card('C11', S2, 'remove', S2, <RemoveComplains />),
  /* centred in the body, both ways (user, 2026-10-08) */
  card('G2', S2, 'who-gets-in', 'Game', <WhoGetsIn />, undefined, 'center'),

  /* ── 24, 25 · Operations on sets ─────────────────────────────────── */
  card('C12', S3, 'set-ops', S3, <SetOps />),
  card('T2', S3, 'task-2', 'Task 2', <Task2 />),

  /* ── 26 · X1 · Exit ──────────────────────────────────────────────── */
  card('X1', 'Exit', 'exit', 'Exit', <ExitTrending />),

  /* ── 27 · K1 · Takeaways ─────────────────────────────────────────── */
  card('K1', 'Close', 'takeaways', 'Key takeaways', <Takeaways />),

  /* ── 28, 29 · Feedback, Thank you ────────────────────────────────── */
  { id: 'feedback', section: 'Close', label: 'Feedback', transition: 'fade', element: <FeedbackEmbedSlide lesson={SESSION} /> },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
