import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, ThankYouSlide, WelcomeSlide } from '@/slides'
import { ClassroomQuiz } from './figures/ClassroomQuiz'
import { AgendaSlide } from './figures/Agenda'
import { Panel } from './figures/common'
import { RecapBrand } from './figures/RecapBrand'
import { FeedbackEmbedSlide } from './figures/FeedbackForm'
import { HistoryHook, ListTools, PartyHook, RecapBug } from './figures/Hooks'
import { AppendCard, ClearCard, CountCard, ExtendCard, IndexCard, InsertCard, PopCard, RemoveCard, SortCard, SortOrSortedCard } from './figures/Methods'
import { Task1, Task2 } from './figures/Tasks'
import { DjDesk, RamSees } from './figures/Games'
import { ExitQueue, Takeaways } from './figures/Close'
import { installGestures } from './figures/gestures'
import { installSpecKeys } from './figures/keys'

/**
 * PYTHON · "List Methods" (Programming Foundations, session 25)
 *
 * Built from `Outputs/python/session_plans/25_list_methods/plan.md`.
 *
 * ONE SLIDE PER SPEC CARD. The source is the pedagogy team's session spec,
 * `Reference ppt's/25_list_methods_session_spec.json` (the data) and its
 * reading page `…_spec.html`: 21 beats, 27 cards. All 27 are here, in the
 * spec's order; the spec has no divider cards and none are invented. Each
 * content slide carries `data-spec` and `data-presses` with the spec's press
 * count.
 *
 * THE WORDS ARE THE SPEC'S EXACT WORDS (spec rule 5) with content rule 36 on
 * every line. THE CODE, EVERY STEP, ROUND AND OUTPUT ARE READ FROM THE JSON
 * (`figures/spec.ts`, generated; spec rule 6), and every program was run on
 * CPython 3.12.3. Every code panel says `Python` (content rule 31).
 *
 * ONE PICTURE FOR LISTS (spec note 4): a row of cells with the index under
 * each; cells slide and their numbers change; a removed item vanishes
 * (`figures/cells.tsx`). ONE WORLD (spec note 2): Teja's music app party
 * queue (`figures/Music.tsx`).
 *
 * THE SPEC'S PRESSES ARE THE KIT'S BUILD STEPS. Keys (build contract 3):
 * arrows one press, F full screen, A all cards, End the whole card, 1 to 4 a
 * vote (`figures/keys.ts`). Autoplay: see `figures/autoplay.ts`.
 * THE AGENDA IS STATIC (content rule 44). THE QUIZ is `ClassroomQuiz`.
 * NAVIGATION: keyboard, trackpad swipe and touch swipe (`figures/gestures.ts`).
 */

installGestures()
installSpecKeys()

const SESSION = 'List Methods'

export const listMethodsMeta: DeckMeta = {
  title: SESSION,
  course: 'Python',
  lesson: SESSION,
  presenter: 'NxtWave Instructor',
  player: { autoHideControls: true },
}

/** The five agenda stops, word for word from the spec. */
const AGENDA = [
  { title: 'Add items', sub: 'at the end, or at a place' },
  { title: 'Take items out', sub: 'the last one, one value, or all' },
  { title: 'Ask the list', sub: 'where is it, and how many?' },
  { title: 'Sort it', sub: 'change the list, or make a new one' },
  { title: 'Code walkthrough', sub: 'the Fibonacci series' },
]

const card = (id: string, spec: string, presses: number, kicker: string, title: string, label: string, notes: string, body: ReactNode, section = kicker): SlideDef => ({
  id,
  section,
  label,
  notes,
  element: (
    <Panel kicker={kicker} title={title} lesson={SESSION} spec={spec} presses={presses}>
      {body}
    </Panel>
  ),
})

export const listMethodsDeck: SlideDef[] = [
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
          { text: 'min and max give back the smallest and the largest item', sub: 'min(minutes), max(minutes)' },
          { text: 'sum adds every item of a list', sub: 'sum([95, 140, 60]) is 295' },
          { text: 'sorted gives back a new list', sub: 'the list you passed stays as it was' },
        ]}
      />
    ),
  },
  card('recap-bug', 'S-RECAP', 3, 'Recap', 'Which line is to blame?', 'Find the line', 'Spec S-RECAP, three presses. From last class. Line 1, hands up. Line 2. Line 3. Press 2: how do we fix line 2? Take two answers before the next press. Press 3: keep the new list in a name. Hold on to this. Today there is another way.', <RecapBug />),

  /* ── 4 · H1 · the hook ───────────────────────────────────────────── */
  card('party-hook', 'H1', 6, 'Programming Foundations', 'Who controls the music?', 'Play next or Add to queue', "Spec H1, six presses. Everyone has been the one holding the phone at a party. Ram wants his song. Press 2: where does the song land? After this one, or somewhere else? Press 3: two songs before Ram's. He is not happy. Press 4: which button? Press 5: same song, a different button, a different place. And the other songs had to move. Press 6: this row has a name in Python. You know it. The menu? That is today. Guess what today is about.", <PartyHook />, 'Hook'),

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  { id: 'todays-session', section: 'Today', label: SESSION, transition: 'zoom', element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} /> },
  { id: 'agenda', section: 'Today', label: 'Agenda', notes: 'Spec S-AGENDA. Read each stop and its line, nothing more.', element: <AgendaSlide kicker={SESSION} title="Agenda" lesson={SESSION} items={AGENDA} /> },

  /* ── 7 to 12 · Add items ─────────────────────────────────────────── */
  card('list-tools', 'C1', 2, AGENDA[0].title, 'List methods', "A list's own tools", "Spec C1, two presses. Session 15. A string has its own tools, after a dot. What does upper do? Press 2: like the queue's own menu in the hook. The dot opens the list's menu. One method at a time now. (The app shows its buttons; Python shows nothing until you type the method's name.)", <ListTools />),
  card('append', 'C2', 4, AGENDA[0].title, 'Adding items to list', 'append', 'Spec C2, four presses. Two songs are added. What is in queue at the end? Say it. Presses 2 and 3: each one goes at the end. Press 4: like Add to queue.', <AppendCard />),
  card('extend', 'C3', 3, AGENDA[0].title, 'Adding items to list', 'extend', "Spec C3, three presses. Ram has two songs. What does queue hold after line 3? And ram? Say both. Press 2: extend takes each of Ram's songs and adds it. Press 3: append adds one item. extend adds every item of a list. Remember extend: Task 1 needs it.", <ExtendCard />),
  card('insert', 'C4', 5, AGENDA[0].title, 'Insert', 'insert', 'Spec C4, five presses. Hands up per choice. Press 2: like Play next. The items after it moved. Press 3: index first, then the value. Press 4: now index 0. Say it. Press 5: index 0 is the front. That was Play next.', <InsertCard />),
  card('task-1', 'T1', 6, AGENDA[0].title, 'The party queue', 'Task 1: the party queue', 'Spec T1, six presses, timer 7:00. Worksheet tab and playground. Type it, type your prediction, then run. Press 2: this is how I wrote it in my notes. Predict the length before you run. Press 3: one word changes. After the timer: press 4, insert(0, ...) put Naatu Naatu at the front. Press 5: who predicted 6? Fair guess. append adds one item. Here the one item is Kiran\'s whole list. Press 6: extend adds each song. Six songs.', <Task1 />),
  card('dj-desk', 'G1', 25, AGENDA[0].title, 'What does the queue look like?', "The DJ's desk", 'Spec G1, twenty-five presses: four rounds. Read the intro. Say how a round works: you answer first, then it runs. Each round: read the code. Option A, hands up. B. C. D. Keys 1 to 4, or a click, mark the room\'s pick. Before each step: say where this song goes before I press. Verdict: read the why line. Which line in the code decided it?', <DjDesk />),

  /* ── 13 to 15 · Take items out ───────────────────────────────────── */
  card('pop', 'C5', 3, AGENDA[1].title, 'Pop', 'pop', 'Spec C5, three presses. Say it. Press 2: the last one goes. Naatu Naatu and Kissik do not move. Press 3: pop: the last item, gone.', <PopCard />),
  card('remove', 'E1', 9, AGENDA[1].title, 'Remove', 'remove, watched', 'Spec E1, nine presses. There are two Peelings. Which one goes? Option A, hands up. B. C. Presses 2 to 6, before each: does the finger stop here? Press 7: remove looks from the left and takes the first match only. Who voted B? It never looked at the last Peelings. Press 8: say what you think happens. Press 9: no Chuttamalle, no remove. Python stops with an error, and line 3 never prints.', <RemoveCard />),
  card('clear', 'C6', 3, AGENDA[1].title, 'Clear', 'clear', 'Spec C6, three presses. Say it. Press 2: empty, but still a list. Press 3: pop: the last. remove: one value. clear: all of them.', <ClearCard />),

  /* ── 16 · S-QUIZ ─────────────────────────────────────────────────── */
  { id: 'quiz', section: 'Quiz', label: 'Classroom Quiz', transition: 'zoom', notes: 'Spec S-QUIZ. Open the quiz on your portal. Answer every question on your own. Then we go through the answers together.', element: <ClassroomQuiz lesson={SESSION} /> },

  /* ── 17 to 19 · Ask the list ─────────────────────────────────────── */
  card('history', 'H2', 4, AGENDA[2].title, "Teja's listening history", 'Counting plays, the long way', 'Spec H2, four presses. Count with your eyes. Say the number. Press 2: you looked at each row and added one when it matched. Press 3: this is what your eyes did, as a loop. You have written loops like this. Press 4: same answer. One line. The list counts for us.', <HistoryHook />),
  card('index', 'C7', 3, AGENDA[2].title, 'Finding index', 'index', 'Spec C7, three presses. Two Peelings again. Hands up per choice. Press 2: like remove: from the left, first match, stop. But nothing is taken out. Press 3: index gives back a number.', <IndexCard />),
  card('count', 'C8', 5, AGENDA[2].title, 'Count', 'count', "Spec C8, five presses. Say it. Press 2: Teja's history.count gave 4. Press 3: count gives back a number. The list does not change. Press 4: say both. Press 5: count can say zero. index has no place to give, so it stops with an error.", <CountCard />),

  /* ── 20 to 22 · Sort it ──────────────────────────────────────────── */
  card('sort', 'C9', 3, AGENDA[3].title, 'Sort', 'sort', 'Spec C9, three presses. Say it. Press 2: the same list, now in order. Press 3: sort changes the list itself.', <SortCard />),
  card('sort-sorted', 'C10', 4, AGENDA[3].title, 'Sort and sorted', 'sort or sorted', "Spec C10, four presses. This is the recap's line 2. Say it. Press 2: so the recap had two fixes: minutes = sorted(minutes), or minutes.sort(). Press 3: new_plays is what sort gives back. Hands up per choice. Press 4: None is Python's word for nothing. sort did its job on plays and handed back nothing.", <SortOrSortedCard />),
  card('ram-sees', 'G2', 21, AGENDA[3].title, 'Does Ram see it?', 'Does Ram see it?', 'Spec G2, twenty-one presses: four rounds. Read the intro. Say how a round works: you answer first, then it runs. Each round: does Ram see the change? Option A, hands up. B. Keys 1 and 2, or a click, mark the pick. Each step: did that line change the list, or move a name? Verdict: which line decided it? Change or move?', <RamSees />),

  /* ── 23 · T2 · Code walkthrough ──────────────────────────────────── */
  card('task-2', 'T2', 13, AGENDA[4].title, 'Nth term in the Fibonacci series', 'Task 2: the Fibonacci series', 'Spec T2, thirteen presses, timer 8:00. What comes after 8? Say it. Press 2: our list is the series. Each new term goes at the end. Which method adds at the end? Press 3: worksheet and playground. Type lines 1 to 3 and 5, write line 4 yourself, predict for 7, run. Press 4: this is how I wrote it in my notes. Change it and run. Let them react first. After the timer, press 5: the two before it, added, at the end. Presses 6 to 11: say the next term before I press. Press 12: 3 and 9 match the deck\'s examples. Press 13: range(2, n) stops one pass early. The list has no index 5 yet. That is why it is n + 1.', <Task2 />),

  /* ── 24 · X1 · Exit ──────────────────────────────────────────────── */
  card('exit', 'X1', 2, 'Exit', 'Teja fixes the queue', 'Exit: keep Kissik at 2', 'Spec X1, two presses, timer 2:30. Everyone answers alone. Then option A, hands up. B. C. D. Press 2: go through every option, not only the right one.', <ExitQueue />),

  /* ── 25 · K1 · Takeaways ─────────────────────────────────────────── */
  card('takeaways', 'K1', 6, 'Key takeaways', 'Today, in six examples', 'Today, in six examples', 'Spec K1, six presses. Each press opens one example: read the code. Everyone, shout what it prints. Then press: its result and sentence fill as the next example opens. The last result fills on a tap of its box, or End.', <Takeaways />, 'Close'),

  /* ── 26, 27 · Feedback, Thank you ────────────────────────────────── */
  { id: 'feedback', section: 'Close', label: 'Feedback', transition: 'fade', element: <FeedbackEmbedSlide lesson={SESSION} /> },
  { id: 'thank-you', section: 'Close', label: 'Thank you', transition: 'zoom', element: <ThankYouSlide title="Thank you!" /> },
]
