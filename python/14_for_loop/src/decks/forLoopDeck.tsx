import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentSlide,
  FeedbackSlide,
  KeyTakeawaysSlide,
  QuizTimeSlide,
  RecapSlide,
  SectionBreakerSlide,
  ThankYouSlide,
} from '@/slides'
import { Card, CodeBlock, CodeOutput, VariableTrace, StepControls} from '@/ui'
import type { TraceStep } from '@/ui'
import { colors } from '@/design/tokens'
import { Step } from '@/motion/Stepper'
import { PhonePlaylist, ALBUM_ART } from './figures/PhonePlaylist'
import { PiggyBank } from './figures/PiggyBank'
import { MatchPairs } from './figures/MatchPairs'
import { EverydayLoops } from './figures/EverydayLoops'
import { EverydayShape } from './figures/EverydayShape'
import { StringWalkCard } from './figures/StringWalkCard'
import { PiggyMeter } from './figures/PiggyMeter'
import { FillableCode } from './figures/FillableCode'
import { DayStrip } from './figures/DayStrip'
import { dailyChallengeSlides as dc } from './dailyChallenge'
import { RangeDial } from './figures/RangeDial'
import { Task1Trace, type TraceBeat } from './figures/Task1Trace'
import { TaskStepCard } from './figures/TaskStepCard'
import { ChallengeCard } from './figures/ChallengeCard'
import { Em, Mono } from './figures/TaskCard'
import { Timer } from './figures/Timer'
import { StepCaption } from './figures/StepCaption'
import { SeatsAnswer } from './figures/SeatsAnswer'
import { RunThemBoth } from './figures/RunThemBoth'

/**
 * PYTHON · "For Loop"
 *
 * Built from `python/session_plans/14_for_loop/plan.md`, signed off on its §7
 * defaults: three new figures, the classroom quiz kept where the source puts it
 * (straight after worksheet task 2), both forms of `range` introduced on the
 * dial, Feedback and Thank you as two frames, and the fourteen portal slides
 * left on the portal.
 *
 * SOURCE. `prog_foundations_LP/14 - For Loop`, an instructor lesson plan rather
 * than a deck. Its 24 authored stages are here; its `data-anim-labels` are the
 * build steps below, in the same order and with the same names, so the room sees
 * the beats the pedagogy team wrote. Course rule R2: the source's own sentences
 * and analogies are the copy.
 *
 * EVERY CODE PANEL SAYS `Python`. Content rule 31a: the learner is typing into a
 * playground, so the tab names the language. The source invented twelve file
 * names (`main.py`, `riya.py`, `seats.py`, `pattern.py` and the rest) for files
 * that are not on anybody's screen, and none of them is carried across.
 *
 * EVERY OUTPUT IS A REAL RUN on CPython 3.12.3, checked before this file was
 * written. `print("* " * counter)` really does emit a trailing space on each
 * row; the strings below keep it.
 *
 * THE THREE NEW FIGURES are session-local first cuts under `./figures/`, because
 * `slide-kit/sequence-lab/` is choosing their final designs in parallel. Each
 * file's header says so and says what re-points where when the lab lands.
 */

export const forLoopMeta: DeckMeta = {
  title: 'For Loop',
  course: 'Python',
  lesson: 'For Loop',
  presenter: 'NxtWave Instructor',
}

const SESSION = 'For Loop'

/** The four agenda items. Key Takeaways restates them word for word (rule 20). */
const AGENDA = {
  forLoop: 'For Loop',
  range: 'Range',
  star: 'The Star Pattern',
  mistake: 'The One Mistake',
} as const

/** Content rule 31a. Never a file name in a foundations session. */
const PY = 'Python'

const box = (name: string, value: string) => ({ name, value })

/* ------------------------------------------------------------------ */
/* Worksheet task 1: `word = "Hi"`, traced. The source's 11 labels.     */
/* ------------------------------------------------------------------ */

const TASK1_CODE = 'word = "Hi"\nn = 0\nfor ch in word:\n    n = n + 1\n    print(ch)\nprint(n)'

const TASK1_STEPS: TraceStep[] = [
  { line: 1, boxes: [box('word', '"Hi"')], output: [] },
  { line: 2, boxes: [box('word', '"Hi"'), box('n', '0')], output: [] },
  { line: 3, boxes: [box('word', '"Hi"'), box('n', '0'), box('ch', 'H')], output: [] },
  { line: 4, boxes: [box('word', '"Hi"'), box('n', '1'), box('ch', 'H')], output: [] },
  { line: 5, boxes: [box('word', '"Hi"'), box('n', '1'), box('ch', 'H')], output: ['H'] },
  { line: 3, boxes: [box('word', '"Hi"'), box('n', '1'), box('ch', 'i')], output: ['H'] },
  { line: 4, boxes: [box('word', '"Hi"'), box('n', '2'), box('ch', 'i')], output: ['H'] },
  { line: 5, boxes: [box('word', '"Hi"'), box('n', '2'), box('ch', 'i')], output: ['H', 'i'] },
  { line: 3, boxes: [box('word', '"Hi"'), box('n', '2'), box('ch', 'i')], output: ['H', 'i'] },
  { line: 6, boxes: [box('word', '"Hi"'), box('n', '2'), box('ch', 'i')], output: ['H', 'i', '2'] },
]

/**
 * The source's eleven beats, LABEL AND SENTENCE KEPT APART.
 *
 * They used to be joined into one `notes` string, which put the whole narration
 * in the speaker view and nothing at all on the frame: the room watched boxes
 * change with no words anywhere near them. `Task1Trace` renders one of these
 * under the figure per press, which is what the reference does.
 *
 * Beat 1 is the worksheet task itself. The other ten are the executed lines, in
 * the order `TASK1_STEPS` runs them.
 */
const TASK1_BEATS: TraceBeat[] = [
  { label: 'Worksheet task 1', text: 'Fill the table by hand first. Nothing here moves until pens are down.' },
  { label: 'Line 1', text: 'word now holds the two characters H and i.' },
  { label: 'Line 2', text: 'n starts at 0.' },
  { label: 'Line 3, first pass', text: 'The loop takes the first item out of the sequence. ch is H.' },
  { label: 'Line 4', text: 'n goes from 0 to 1.' },
  { label: 'Line 5', text: 'It prints whatever ch is holding right now.' },
  { label: 'Line 3, second pass', text: 'Back to the loop. It takes the next item. ch is i.' },
  { label: 'Line 4', text: 'n goes from 1 to 2.' },
  { label: 'Line 5', text: 'It prints i.' },
  { label: 'Line 3, third try', text: 'The loop asks for the next item. There is none left, so the loop ends.' },
  { label: 'Line 6', text: 'It prints n, which is 2. Two characters, two passes.' },
]

const TASK1_NOTES = TASK1_BEATS.map((b) => `${b.label}. ${b.text}`).join(' ')

/* ------------------------------------------------------------------ */
/* Riya's savings, traced. The source's 10 labels.                     */
/* ------------------------------------------------------------------ */

const RIYA_CODE =
  'n = int(input())\ntotal = 0\nfor day in range(1, n + 1):\n    if day % 2 == 1:\n        total = total + day\nprint(total)'

const riya = (day: string, total: string): { name: string; value: string }[] => [
  box('n', '7'),
  box('day', day),
  box('total', total),
]

const RIYA_STEPS: TraceStep[] = [
  { line: 2, boxes: [box('n', '7'), box('total', '0')], output: [] },
  { line: 5, boxes: riya('1', '1'), output: [] },
  { line: 4, boxes: riya('2', '1'), output: [] },
  { line: 5, boxes: riya('3', '4'), output: [] },
  { line: 4, boxes: riya('4', '4'), output: [] },
  { line: 5, boxes: riya('5', '9'), output: [] },
  { line: 4, boxes: riya('6', '9'), output: [] },
  { line: 5, boxes: riya('7', '16'), output: [] },
  { line: 3, boxes: riya('7', '16'), output: [] },
  { line: 6, boxes: riya('7', '16'), output: ['16'] },
]

/* The bank's contents after each of RIYA_STEPS, and the coin that went in.
   Derived from the same trace, one entry per step, so the two cannot disagree. */
const RIYA_TOTALS = ['\u20B90', '\u20B91', '\u20B91', '\u20B94', '\u20B94', '\u20B99', '\u20B99', '\u20B916', '\u20B916', '\u20B916']
const RIYA_COINS: (string | undefined)[] = [
  undefined,
  '\u20B91',
  undefined,
  '\u20B93',
  undefined,
  '\u20B95',
  undefined,
  '\u20B97',
  undefined,
  undefined,
]

/* Which day each RIYA_STEPS entry is on. -1 for the steps that are not a day:
   lines 1 and 2, the loop asking once more, and the print. */
const RIYA_STEP_DAY = [-1, 0, 1, 2, 3, 4, 5, 6, -1, -1]
const RIYA_DAYS = [
  { label: 'Day 1', coin: '\u20B91', total: '\u20B91' },
  { label: 'Day 2', total: '\u20B91' },
  { label: 'Day 3', coin: '\u20B93', total: '\u20B94' },
  { label: 'Day 4', total: '\u20B94' },
  { label: 'Day 5', coin: '\u20B95', total: '\u20B99' },
  { label: 'Day 6', total: '\u20B99' },
  { label: 'Day 7', coin: '\u20B97', total: '\u20B916' },
]

/**
 * THE TEN BEATS, AS THEY GO ON THE FRAME.
 *
 * They were joined into one `notes:` string, so the room watched the boxes
 * change with no narration on screen and the recording could not teach from it.
 * The reference puts the label and the sentence under the trace, one per press
 * (`Line 6  It prints 16. That is Riya's money after 7 days.`), and `StepCaption`
 * draws them from this array.
 */
const RIYA_BEATS = [
  { label: 'Lines 1 and 2', text: 'n is 7. total starts at 0.' },
  { label: 'Day 1', text: '1 is odd. total goes from 0 to 1.' },
  { label: 'Day 2', text: '2 is even. The if is False, so total stays 1.' },
  { label: 'Day 3', text: '3 is odd. total goes from 1 to 4.' },
  { label: 'Day 4', text: '4 is even. The if is False, so total stays 4.' },
  { label: 'Day 5', text: '5 is odd. total goes from 4 to 9.' },
  { label: 'Day 6', text: '6 is even. The if is False, so total stays 9.' },
  { label: 'Day 7', text: '7 is odd. total goes from 9 to 16.' },
  { label: 'No days left', text: 'range stops before 8. The loop ends.' },
  { label: 'Line 6', text: 'It prints 16. That is Riya\u2019s money after 7 days.' },
]

const RIYA_NOTES = RIYA_BEATS.map((b) => `${b.label}. ${b.text}`).join(' ')

/* ------------------------------------------------------------------ */
/* The exit question, traced. seats 4, booked 3.                       */
/* ------------------------------------------------------------------ */

const SEATS_CODE =
  'seats = int(input())\nbooked = int(input())\nleft = seats - booked\nfor i in range(1, left):\n    print("Seat", i)'

/**
 * THE REFERENCE'S FOUR BEATS, by their own names: the pair, line 3, line 4,
 * nothing. They were the slide's `lead`, all at once, which answered the exit
 * question before the frame had asked it.
 */
const SEATS_BEATS = [
  { label: 'The pair', text: 'Option B. seats is 4 and booked is 3.' },
  { label: 'Line 3', text: 'left is 4 minus 3, which is 1.' },
  {
    label: 'Line 4',
    text: 'range(1, 1) starts at 1 and stops before 1. It has no numbers in it.',
  },
  {
    label: 'Nothing printed',
    text: 'The loop body never runs, so the screen stays empty.',
  },
]

/** The star pattern, as it really prints. Trailing space per row is real. */
const WORD_LOOP = (w: string) => `word = "${w}"\nfor ch in word:\n    print(ch)\nprint("Done")`

/**
 * ONE STEP OF WORKSHEET TASK 2.
 *
 * The reference's card is two columns and a bottom strip: the program on the
 * left with the line this step edits lit, the instruction and a countdown on the
 * right, and the rule of the room across the bottom. The first cut was a lead
 * over a centred code panel, with the instruction, the highlight, the clock and
 * the rule all missing or in speaker notes.
 */
const task2Slide = (
  id: string,
  title: string,
  word: string,
  lines: ReactNode[],
  seconds: number,
  ruleTitle: string,
  rule: string,
  ruleKind: 'note' | 'warning',
  note: string,
): SlideDef => ({
  id,
  section: AGENDA.forLoop,
  label: title,
  notes: note,
  element: (
    <ContentSlide kicker="Worksheet task 2" title={title} lesson={SESSION}>
      <TaskStepCard
        py={PY}
        code={WORD_LOOP(word)}
        highlightLine={id === 'task2-step1' ? undefined : 1}
        lines={lines}
        seconds={seconds}
        ruleTitle={ruleTitle}
        rule={rule}
        ruleKind={ruleKind}
      />
    </ContentSlide>
  ),
})

export const forLoopDeck: SlideDef[] = [
  /* ── Front frame and recap ───────────────────────────────────────── */
  {
    id: 'brand',
    section: 'Opening',
    label: 'Welcome',
    element: <BrandSlide greeting="Welcome" lesson={SESSION} />,
  },
  {
    id: 'recap',
    section: 'Recap',
    label: 'Where We Left Off',
    element: (
      <RecapSlide
        kicker="Recap"
        title="Where We Left Off"
        lesson={SESSION}
        /* ONE MARK, THREE TIMES. These carried a green play, a blue gear and
           an amber warning, which is a hierarchy the recap does not have: three
           things the room already knows, of equal weight. The amber also
           pre-announced the third line as a danger before it had been read, and
           the danger is the point of the line, not its frame. The reference
           gives all three the same tick, and `RecapSlide`'s own default is that
           tick, so the fix is to stop overriding it. */
        points={[
          { text: 'A while loop repeats a block of code', sub: 'As long as its condition is True' },
          { text: 'It needs three lines to work', sub: 'A start value, a condition, and an update' },
          { text: 'Miss the update and it never stops', sub: 'The condition stays True for ever' },
        ]}
      />
    ),
  },
  {
    id: 'recap-match',
    section: 'Recap',
    label: 'The while loop, in three parts',
    notes:
      'Ask the room to call out which two go together before you press the key. One join per press, and the reason lands with the join.',
    element: (
      <ContentSlide
        kicker="Recap"
        title="The while loop, in three parts"
        lesson={SESSION}
        lead="Three parts on the left, three jobs on the right. Call out which two go together, then we join them."
      >
        <MatchPairs
          leftLabel="The three lines"
          rightLabel="What each one does"
          rightOrder={[0, 2, 1]}
          className="mx-auto w-[1060px]"
          pairs={[
            {
              left: 'counter = 0',
              right: 'Sets the starting value. Runs once, before the loop.',
              why: 'Initialization. Miss it and the name does not exist yet, so line 2 cannot even be asked.',
            },
            {
              left: 'while counter < 3:',
              right: 'The question asked before every pass.',
              why: 'The condition. For this program it is asked 4 times, not 3: once before each pass, and once more at the end when the answer is finally no.',
            },
            {
              left: 'counter = counter + 1',
              right: 'Moves the counter on, so the question can turn false.',
              why: 'Updation. Take this line out and the answer stays yes for ever, and the program never stops.',
            },
          ]}
        />
        <StepControls className="mt-4 w-full justify-center" showCount={false} nextLabel="Join them" />
      </ContentSlide>
    ),
  },

  /* ── Hook ────────────────────────────────────────────────────────── */
  {
    id: 'hook-playlist',
    section: 'Hook',
    label: 'One tap, and it keeps going',
    notes: 'Six beats, the source\u2019s own: the list, one tap, it moves on, to the end and it stops, one more song, your turn.',
    element: (
      <ContentSlide kicker="Before we start" title="One tap, and it keeps going" lesson={SESSION}>
        <PhonePlaylist
          appMark="/assets/companies/spotify.png"
          appName="Spotify"
          /* THE SIX ROWS ARE THE REFERENCE'S OWN, verbatim, down to the
             durations. The sixth matters most: it is called `One More Song`,
             which is the name of the beat that adds it, so the row the room is
             asked to look at says what just happened. Ours had drifted to
             `One More Time` by `Ravi Menon` and re-cast three of the other
             artists, which costs the beat its own word for no gain.

             The cover tints come from `ALBUM_ART`, an object-colour set in the
             figure, not from `tokens.ts`: see its comment there. */
          tracks={[
            { title: 'Morning Raag', artist: 'Ananya Rao', length: '3:58', art: ALBUM_ART.plum },
            { title: 'City Lights', artist: 'The Verandah', length: '4:12', art: ALBUM_ART.sea },
            { title: 'Old Road', artist: 'Kabir Sen', length: '3:21', art: ALBUM_ART.clay },
            { title: 'Paper Boats', artist: 'Meera', length: '5:04', art: ALBUM_ART.moss },
            { title: 'Last Bus Home', artist: 'Nikhil D', length: '3:47', art: ALBUM_ART.rust },
            { title: 'One More Song', artist: 'Ananya Rao', length: '4:30', art: ALBUM_ART.dusk },
          ]}
          beats={[
            { at: -1, visible: 5, label: 'The list', caption: 'A Spotify playlist you made. Five songs.' },
            { at: 0, visible: 5, label: 'One tap', caption: 'You tap play once. Song one starts.' },
            {
              at: 1,
              visible: 5,
              label: 'It moves on its own',
              caption: 'Song one ends. Song two starts. You did not touch the phone.',
            },
            {
              at: 5,
              visible: 5,
              stopped: true,
              label: 'Right to the end, then it stops',
              caption: 'The last song ends and it stops. Nothing says five. So what told it to stop?',
            },
            /* THE SIXTH SONG PLAYS, AND THE STOP BANNER GOES.

               `Now there are six. It plays six.` is the whole hook: a song
               nobody counted starts on its own. The frame used to say the
               opposite of its own caption — the new row sat inert, the tray read
               `Nothing playing` and the previous beat's red `No songs left. It
               stops.` was still under it — because `at` was past the end of the
               list on both of the last two beats. `at: 5` over six tracks puts
               the pointer ON the new row, so it is highlighted, its equaliser
               runs and the now-playing tray names it. The banner belongs to the
               beat before, where the list really had run out, and it retires the
               moment the sixth song arrives.

               `Your turn` holds the same phone rather than stopping it again:
               the reference's last frame does, and the question it asks is about
               the room, not about the player. */
            {
              at: 5,
              visible: 6,
              label: 'Add one song',
              caption: 'Now there are six. It plays six. You never typed a number.',
            },
            {
              at: 5,
              visible: 6,
              label: 'Your turn',
              caption: 'Where else does one tap keep going till a list runs out?',
            },
          ]}
        />
              </ContentSlide>
    ),
  },
  {
    id: 'hook-where-else',
    section: 'Hook',
    label: 'Where else does this happen?',
    element: (
      <ContentSlide
        kicker="Your turn"
        title="Where else does this happen?"
        lesson={SESSION}
        /* THE QUESTION COMES FIRST. The reference's lead is two sentences and
           ours kept only the second, which turns an invitation into a
           statement: the slide's whole job on this beat is to ASK the room for
           three places, and the three machines behind it are dashed and unnamed
           until somebody answers. Without the question the frame describes the
           shape it is supposed to be fishing for. */
        lead="Where else have you seen this? One action, and it keeps going by itself until a list runs out."
      >
        {/* THREE REAL INTERFACES, NOT THREE TEXT CARDS. Course rule R5c: three
            Cards with a sentence each is the same content with the argument
            removed. Each screen runs its own idle loop at its own period, so
            the three never beat in unison and the room sees three different
            things doing one shape. */}
        {/* mt-7: the third card's top-right corner sat 21px inside the
            instructor-video rectangle (x913..1280, y0..220). The three cards
            are as wide as the well allows, so the fix is vertical, not a
            narrower figure. */}
        <EverydayLoops
          className="mt-4"
          cards={[
            {
              title: 'The attendance register',
              caption: 'One name, one tick. It stops when the names run out.',
              scene: { kind: 'register', names: ['Aarav', 'Diya', 'Ishan', 'Riya', 'Zoya'] },
            },
            {
              /* The mark, not an icon: content rule 12. The file is the
                 library's own `companies/instagram.png`. */
              title: (
                <span className="flex items-center gap-2">
                  <img src="/assets/companies/instagram.png" alt="" width={22} height={22} draggable={false} />
                  Instagram stories
                </span>
              ),
              caption: 'One story, then the next. Nobody types how many there are.',
              scene: { kind: 'stories', stories: 5 },
            },
            {
              title: 'The billing counter',
              caption: 'One item over the scanner, one beep, until the basket is empty.',
              scene: { kind: 'counter', items: 4, beep: 'beep' },
            },
          ]}
        />
        <StepControls className="mt-4 w-full justify-center" showCount={false} />
      </ContentSlide>
    ),
  },
  {
    id: 'hook-the-shape',
    section: 'Hook',
    label: 'The shape behind it',
    notes:
      'The abstraction beat. Five presses: the list, take the next one, do one job, when it ends go back, and then the red line that answers the hook. Ask the room to look for a number in it BEFORE pressing the last one.',
    element: (
      <ContentSlide
        kicker="The shape behind it"
        title="Take a list. Do one job."
        lesson={SESSION}
        lead="The register, the stories and the scanner, with the product taken off. What is left is the same three times."
      >
        <EverydayShape className="mt-2" />
        {/* A PANEL, AND ONLY THE LEAD-IN IS BOLD.

            The reference draws this as a bordered, left-aligned band with a
            rail down its left edge, and bolds the first sentence alone:
            `Same shape all three times.` is the verdict, and the three
            sentences after it are what the verdict is made of. Ours set the
            whole line bold and centred with no panel, so the lead-in stopped
            reading as a lead-in and the band stopped reading as a conclusion
            drawn from the figure above it.

            NOT `Callout`, although `Callout` is the kit's bordered band and was
            tried first. It is 95px tall with its icon holder and its title on a
            line of its own, and this well has about 70px under the figure: the
            callout squeezed `EverydayShape` out of the frame entirely. The
            reference's own band is 11px of padding round one line of 15px text,
            which is a styled paragraph and not a component. Every colour here is
            a token; nothing is a hex.

            NOT a build step, on purpose: `EverydayShape` owns this slide's five
            presses and the band is the frame's standing summary, not a sixth. */}
        <p
          className="mt-3 rounded-xl2 border-l-4 px-4 py-2.5 text-body-sm"
          style={{ background: colors.surface, borderColor: colors.brand, color: colors.ink }}
        >
          <strong className="font-bold" style={{ color: colors.brandDark }}>
            Same shape all three times.
          </strong>{' '}
          Take a list. Do one job. Once for each item in it. You never say how many.
        </p>
        <StepControls className="mt-4 w-full justify-center" showCount={false} />
      </ContentSlide>
    ),
  },
  {
    id: 'todays-topic',
    section: 'Hook',
    label: "Today's Session",
    transition: 'fade',
    element: <SectionBreakerSlide kicker="Today's Session" title={SESSION} lesson={SESSION} />,
  },
  {
    id: 'agenda',
    section: 'Hook',
    label: 'What We Will Cover',
    /* The circle reads the session name over the word Agenda: the small line
       says WHICH session, the big one says what this frame is. */
    element: (
      <AgendaSlide
        kicker={SESSION}
        title="Agenda"
        lesson={SESSION}
        items={[
          { title: AGENDA.forLoop, sub: 'Walk through a sequence, one item at a time' },
          { title: AGENDA.range, sub: 'Make a sequence of numbers' },
          { title: AGENDA.star, sub: 'Write it yourself' },
          { title: AGENDA.mistake, sub: 'The one everybody makes' },
        ]}
      />
    ),
  },

  /* ── Concept 1 · The for loop (SCQA) ─────────────────────────────── */
  {
    id: 'divider-for-loop',
    section: AGENDA.forLoop,
    label: 'For Loop',
    transition: 'fade',
    element: (
      <SectionBreakerSlide
        index={1}
        title={AGENDA.forLoop}
        subtitle="Walk through a sequence, one item at a time"
        lesson={SESSION}
      />
    ),
  },
  dc.s8,
  dc.s11,
  dc.s15,
  dc.s16,
  dc.s17,
  /* 16, 17 and 18 are ONE block in the lesson plan, "the for loop, and the
     three lines it drops". Splitting them with our own two frames broke the
     argument in half: 18 is the payoff of 16 and 17 and has to arrive while
     they are still on the room's screen. */
  dc.s18,
  {
    id: 'string-is-a-sequence',
    section: AGENDA.forLoop,
    label: '"Python", one character at a time',
    notes:
      'A MACHINE, not a slideshow. The room picks the word first and commits to how many characters it is, THEN presses Split it. Take the vote before every word, not only the first: choosing a new word resets the walk on purpose. The empty string is the one that matters.',
    element: <StringWalkCard session={SESSION} py={PY} />,
  },
  {
    id: 'same-job-two-lines',
    section: AGENDA.forLoop,
    label: 'The same job, in two lines',
    notes:
      'Both print the same six lines. One of them needs six lines to do it. No lead on this frame: the two panes need the whole well.',
    element: (
      <ContentSlide
        title="The same job, in two lines"
        lesson={SESSION}
        kicker={AGENDA.forLoop}
      >
        {/* THE WIDTH IS THE FIX, NOT THE HEIGHT. The instructor-video rectangle
            starts at x=913, so a two-pane block capped at 845px ends at x=909
            and can be as tall as the well allows. `outputFontSize` rather than
            `maxHeight`, because a capped panel only scrolls and every harness
            measures the un-clipped rect.

            THE FOR LOOP IS THE LEFT PANE, and the order is a layout constraint
            as much as a reading one: the while pane is 514px tall and the deck's
            control cluster owns x18..409 below y=660, so the tall pane has to be
            the right-hand one. The short answer first, with the six lines it
            replaces beside it, is also the better read. */}
        {/* MIDDLE ALIGNED. The two panes are the whole content of this frame,
            so they sit in the middle of the well rather than at the top of it. */}
        <div className="flex h-full w-full items-center justify-center">
        <CodeOutput
          className="w-[845px]"
          outputFontSize={12}
          codeFontSize={15}
          panes={[
            {
              label: 'The for loop',
              location: PY,
              code: 'word = "Python"\nfor each_char in word:\n    print(each_char)',
              output: 'P\ny\nt\nh\no\nn',
            },
            {
              label: 'The while loop',
              location: PY,
              code: 'a = "Python"\nlength_of_a = len(a)\ncounter = 0\nwhile counter < length_of_a:\n    print(a[counter])\n    counter = counter + 1',
              output: 'P\ny\nt\nh\no\nn',
            },
          ]}
        />
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'task1-trace',
    section: AGENDA.forLoop,
    label: 'Trace it before you run it',
    notes: TASK1_NOTES,
    element: (
      <ContentSlide kicker="Worksheet task 1" title="Trace it before you run it" lesson={SESSION}>
        {/* THE BEATS ARE ON THE FRAME. No lead: the first beat IS the lead, and
            it is the worksheet task, which the card opens on. */}
        <Task1Trace code={TASK1_CODE} steps={TASK1_STEPS} beats={TASK1_BEATS} py={PY} seconds={120} />
      </ContentSlide>
    ),
  },
  task2Slide(
    'task2-step1',
    'Step 1: type it, run it',
    'Rain',
    [
      <>
        Type this program into the <Em>playground</Em>.
      </>,
      <>
        Run it as it is. Then tick <Em>step 1</Em> on the worksheet.
      </>,
    ],
    60,
    'Worksheet tab and the playground only.',
    'Nothing else open.',
    'note',
    'It prints R, a, i, n, then Done.',
  ),
  task2Slide(
    'task2-step2',
    'Step 2: change the word',
    'Delhi',
    [
      <>
        Change line 1 to <Mono>word = "Delhi"</Mono>.
      </>,
      <>
        On the worksheet, write <Em>how many lines</Em> it will print. Then run it.
      </>,
    ],
    90,
    'Write first, run second.',
    'A guess after the run is not a guess.',
    'warning',
    'Five characters, so five lines, then Done.',
  ),
  task2Slide(
    'task2-step3',
    'Step 3: an empty word',
    '',
    [
      <>
        Change line 1 to <Mono>word = ""</Mono>. Two quote marks, nothing between.
      </>,
      <>On the worksheet, write what it will print. Run it. Then write what it really printed.</>,
    ],
    90,
    'Write first, run second.',
    'Does it give an error? Decide before you run.',
    'warning',
    'It prints Done and nothing else: an empty sequence means zero passes.',
  ),

  /* ── The classroom quiz, where the source puts it ────────────────── */
  {
    id: 'quiz',
    section: AGENDA.forLoop,
    label: 'Quiz Time!',
    transition: 'zoom',
    notes:
      'The source runs the classroom quiz here, straight after worksheet task 2, and course rule R2 keeps quiz positions where the source put them. Open the quiz on the portal, everyone answers alone, then go through the answers together.',
    element: <QuizTimeSlide lesson={SESSION} />,
  },

  /* ── Concept 2 · range (Merrill) ─────────────────────────────────── */
  {
    id: 'divider-range',
    section: AGENDA.range,
    label: 'Range',
    transition: 'fade',
    element: (
      <SectionBreakerSlide
        index={2}
        title={AGENDA.range}
        subtitle="Make a sequence of numbers"
        lesson={SESSION}
      />
    ),
  },
  dc.s33,
  dc.s34,
  dc.s35,
  dc.s36,
  {
    id: 'range-dial',
    section: AGENDA.range,
    label: 'The range dial',
    notes:
      'A MACHINE, not a slideshow. Set the two numbers, take the count of hands, THEN press Show the numbers. Do it again with a different stop, and again with start at 0: the numbers hide the moment either bound moves, so every setting is predicted. The one that has to land is that the stop value never comes out.',
    element: (
      <ContentSlide
        kicker="Predict, then look"
        title="The range dial"
        lesson={SESSION}
        lead="Say the two numbers out loud first. Which numbers come out, and how many? Then press the button."
      >
        <RangeDial max={10} initialStart={1} initialStop={5} />
      </ContentSlide>
    ),
  },
  {
    id: 'riya-piggy-bank',
    section: AGENDA.range,
    label: "Riya's piggy bank",
    notes:
      'Riya\u2019s rule: on an odd day d, she saves \u20b9d. On an even day, she saves nothing. Close on the last beat and hand the problem over.',
    element: (
      <ContentSlide
        kicker="A story"
        title="Riya's piggy bank"
        lesson={SESSION}
        lead={"Riya's rule: on an odd day d, she saves \u20b9d. On an even day, she saves nothing."}
      >
        {/* SHE SAYS EACH DAY HERSELF. Course rule R5b: the same sentence in a
            caption is the deck narrating, and wanting the loop is what this
            beat exists to produce. The six bubbles are the reference's own
            `.rs-bub` lines, in its order, one per press. */}
        <PiggyBank
          narrated
          days={[
            { label: 'Day 1', coin: '\u20b91' },
            { label: 'Day 2' },
            { label: 'Day 3', coin: '\u20b93' },
            { label: 'Day 4' },
            { label: 'Day 5', coin: '\u20b95' },
            { label: 'Day 6' },
            { label: 'Day 7', coin: '\u20b97' },
          ]}
          beats={[
            {
              at: -1,
              total: '\u20b90',
              label: 'The plan',
              caption: 'I want to save money. But I will save only on odd days.',
            },
            { at: 0, total: '\u20b91', label: 'Day 1', caption: 'Day 1 is odd. I put in \u20b91.' },
            {
              at: 1,
              total: '\u20b91',
              label: 'Day 2',
              voice: 'pig',
              caption: 'Day 2 is even. Nothing for me today!',
            },
            { at: 2, total: '\u20b94', label: 'Day 3', caption: 'Day 3 is odd. I put in \u20b93.' },
            {
              at: 6,
              total: '\u20b916',
              label: 'Up to day 7',
              voice: 'pig',
              caption: 'Day 5 gives \u20b95. Day 7 gives \u20b97. Now I have \u20b916!',
            },
            {
              at: 7,
              total: '\u20b916',
              ended: true,
              label: 'Your turn',
              caption: 'What about 30 days? Or a whole year? I cannot add all that by hand!',
            },
          ]}
        />
        {/* The hand-off waits for her last bubble. Showing it from the start
            answers the question the story is still asking. */}
        <Step>
          <p className="mt-3 text-center font-heading text-body font-semibold" style={{ color: colors.body }}>
            Your turn. Write a program that works out Riya’s money for any number of days.
          </p>
        </Step>
        <StepControls className="mt-4 w-full justify-center" showCount={false} />
      </ContentSlide>
    ),
  },
  {
    id: 'riya-challenge',
    section: AGENDA.range,
    label: "Riya's savings",
    notes:
      'Read the problem and the rule out, then the two runs. The SECOND run is the one to collect: everybody should have 25 for 10 days before the next frame.',
    element: (
      <ContentSlide kicker="Coding challenge" title="Riya's savings" lesson={SESSION}>
        {/* THE SUB-TEXTS WERE CROSS-WIRED. `Input 7, output 16` carried the
            odd/even rule and `Input 4, output 4` carried "Run it with 7 first",
            so the rule that decides every answer was filed under a worked
            example and the second run was nowhere on the frame. The rule now
            sits with the problem, the examples say only what goes in and what
            comes out, and both runs are numbered in the order they happen. */}
        <ChallengeCard
          title="Riya's savings"
          statement={
            <>
              Read a number <Em>n</Em>. Print the total money Riya saves from <Em>day 1 to day n</Em>,
              both days included.
            </>
          }
          rule={
            <>
              On an odd day <Em>d</Em>, she saves {'\u20B9'}d. On an even day, she saves nothing.
            </>
          }
          examples={[
            { input: '7', output: '16' },
            { input: '4', output: '4' },
          ]}
          lead={
            <>
              Open the <Em>playground</Em>. Write Riya's program.
            </>
          }
          runs={[
            <>
              Run it with <Em>7</Em>. It must print <Em>16</Em>.
            </>,
            <>
              Then run it with <Em>10</Em>. Keep that answer ready.
            </>,
          ]}
          seconds={240}
          hint={
            <>
              <Mono>day % 2 == 1</Mono> is True only when <Em>day</Em> is odd.
            </>
          }
        />
      </ContentSlide>
    ),
  },
  {
    id: 'riya-trace',
    section: AGENDA.range,
    label: "Riya's savings, day by day",
    notes: RIYA_NOTES,
    /* THE LEAD IS LOAD-BEARING, not decoration. Without one `ContentSlide`
       adds a 52px guard to keep the well clear of the instructor-video
       rectangle, and this frame opened with a 90px hole under its title. Its
       right column is already padded down past that rectangle on its own. */
    element: (
      <ContentSlide
        kicker="Check it together"
        title="Riya's savings, day by day"
        lesson={SESSION}
        lead="Run it with 7, one line at a time."
      >
        {/* THE WEEK SPANS THE WHOLE FRAME, not the left column.

            It is the one thing on this slide that is about all seven days at
            once, and boxed into the left column it ended 370px short of the
            right edge while the column beside it went hungry. Full width it is
            also wide enough for each tile to carry three readable rows: the
            day, what that day put in, and the running total under it.

            `pt-[4px]` is not decoration. The instructor's video holds
            x913..1280, y0..220, a slide with a lead starts its body at y=217,
            and this is the first block on the frame wide enough to reach that
            rectangle. Four pixels is what clears it. */}
        <div className="flex flex-col gap-2 pt-[8px]">
          <DayStrip spread days={RIYA_DAYS} stepDay={RIYA_STEP_DAY} />

          {/* LEFT the program, RIGHT one grouped readout: the variables it is
              holding, what it has printed, and where the money ended up. Three
              separate cards on the slide background read as three unrelated
              widgets; they are one answer to "what is true right now". */}
          <VariableTrace
            code={RIYA_CODE}
            steps={RIYA_STEPS}
            location={PY}
            stacked
            threeUp
            groupRight
            codeFontSize={19}
            rightExtra={<PiggyMeter row totals={RIYA_TOTALS} coins={RIYA_COINS} />}
          />

          {/* THE BEAT RUNS THE FULL WIDTH. Inside the code column it had 560px
              for a sentence that needs 800, so the last beat wrapped to two
              lines and broke out of its own bar. It is also the one thing here
              that is about all three columns at once. Fixed height: it is empty
              until the first press, and a row that grows when it fills shifts
              everything above it. */}
          <div className="flex h-[44px] items-center gap-4 rounded-card border border-line bg-white/60 px-4">
            <span className="shrink-0 font-heading text-body-sm font-bold" style={{ color: colors.muted }}>
              input
            </span>
            <span
              className="grid h-7 w-9 shrink-0 place-items-center rounded-card font-mono text-body font-bold"
              style={{ background: colors.surface, color: colors.ink }}
            >
              7
            </span>
            <span className="h-6 w-px shrink-0" style={{ background: colors.line }} />
            <StepCaption beats={RIYA_BEATS} className="flex-1" />
          </div>

          <StepControls className="justify-center" showCount={false} mode="code" />
        </div>
      </ContentSlide>
    ),
  },

  /* ── Concept 3 · The row that goes missing (STAR) ────────────────── */
  {
    id: 'divider-star',
    section: AGENDA.star,
    label: 'The Star Pattern',
    transition: 'fade',
    element: (
      <SectionBreakerSlide
        index={3}
        title={AGENDA.star}
        subtitle="Write it yourself"
        lesson={SESSION}
      />
    ),
  },
  dc.s37,
  {
    id: 'task3-write-the-loop',
    section: AGENDA.star,
    label: 'Write the loop line',
    notes:
      'For n = 4 it prints 4 rows, and the last row is four stars. Start the clock when you have read the task out. Type an answer the room calls out into the blanks so the two can be seen to agree.',
    element: (
      <ContentSlide
        kicker="Worksheet task 3"
        title="Write the loop line"
        lesson={SESSION}
        lead="Line 1 is given. Line 2 and the blank on line 3 are yours. The two blanks must agree."
      >
        <div className="grid grid-cols-[1fr_0.8fr] items-center gap-10">
          {/* Real blanks, not a picture of one: an answer called out by the
              room gets typed in, and the two blanks can be seen to agree. The
              two lines that are the learner's are tinted, so the eye lands on
              the task rather than reading all three to find it. */}
          <FillableCode
            filename={PY}
            highlight={[2, 3]}
            lines={[
              { before: 'n = int(input())' },
              { before: '', blank: 26, placeholder: 'the loop line, with the colon' },
              { before: 'print("* " * ', blank: 8, after: ')' },
            ]}
          />
          <div className="flex flex-col items-start gap-4">
            <Card icon="target" title="For n = 4">
              It prints 4 rows. The last row is * * * *
            </Card>
            {/* THE TASK'S OWN INSTRUCTION, ON THE FRAME. It was in `notes:`, so
                the room had nothing on screen saying what to write or where to
                run it, and the clock that keeps a four-minute task to four
                minutes was missing entirely. */}
            <p className="text-body-lg font-medium leading-snug" style={{ color: colors.ink }}>
              Write line 2 in full, with the colon. Then try it in the playground.
            </p>
            <p className="text-body" style={{ color: colors.body }}>
              More than one pair works.
            </p>
            <Timer seconds={240} />
          </div>
        </div>
      </ContentSlide>
    ),
  },
  dc.s40,
  {
    id: 'which-one-is-right',
    section: AGENDA.mistake,
    label: 'Which one is right?',
    notes:
      'The line is on the frame now. Move n with the stepper if the room wants another number, take both shows of hands, and only then press Run them both. A drops the last row; B prints all n.',
    element: (
      <ContentSlide
        kicker="Predict, then run"
        title="Which one is right?"
        lesson={SESSION}
        lead="Both of these start at 1. Which one prints all n rows?"
      >
        {/* VOTE, THEN RUN. `n` is a number the room can move, both range
            expressions re-read themselves from it, both output panes stay empty,
            and nothing resolves until `Run them both` is pressed. The first cut
            was a single `SwapRows` reveal, which is the one thing that destroys
            this device: the room reads the answer instead of committing to a
            guess. */}
        <RunThemBoth filename={PY} />
      </ContentSlide>
    ),
  },
  dc.s42,
  dc.s45,
  {
    id: 'exit-question',
    section: AGENDA.mistake,
    label: 'Which one prints nothing?',
    notes:
      'Do not answer it here. Take a show of hands on each of the four pairs. The answer is the frame after this one.',
    element: (
      <ContentSlide
        kicker="Exit question"
        title="Which one prints nothing?"
        lesson={SESSION}
        lead="Read the code. For which pair does the screen show nothing at all?"
      >
        <div className="grid grid-cols-[1.1fr_1fr] items-center gap-10">
          <CodeBlock filename={PY} code={SEATS_CODE} />
          {/* ONE COLUMN, NOT A 2x2 GRID OF CARDS. Four alternatives to one
              question read DOWN, and a column is what a show of hands is counted
              against: the eye goes A, B, C, D once instead of tracking across two
              rows. The letters are small and grey because they are addresses, not
              content; the pairs are the thing to read. No bordered cards, which
              made four options look like four separate ideas. */}
          <div className="flex flex-col gap-4">
            {[
              ['A', 'seats = 5, booked = 3'],
              ['B', 'seats = 4, booked = 3'],
              ['C', 'seats = 3, booked = 0'],
              ['D', 'seats = 6, booked = 2'],
            ].map(([letter, pair]) => (
              <div key={letter} className="flex items-baseline gap-4">
                <span
                  className="w-5 font-heading text-body font-bold"
                  style={{ color: colors.muted }}
                >
                  {letter}
                </span>
                <span className="text-body-lg font-medium" style={{ color: colors.ink }}>
                  {pair}
                </span>
              </div>
            ))}
            {/* The room is being asked to read five lines and pick one. The
                clock is what keeps that to two and a half minutes. */}
            <Timer seconds={150} className="mt-2 self-start" />
          </div>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'exit-answer',
    section: AGENDA.mistake,
    label: 'Why it prints nothing',
    notes:
      SEATS_BEATS.map((b) => `${b.label}. ${b.text}`).join(' '),
    element: (
      <ContentSlide
        kicker="Exit question"
        title="Why it prints nothing"
        lesson={SESSION}
        lead="Take it one line at a time."
      >
        {/* THE ANSWER IS NOT IN THE LEAD. It was: the lead named option B and
            gave `range(1, 1)` away at step 0, so the four beats the reference
            builds it over had nothing left to reveal. The reasoning now arrives
            one press at a time, in the caption bar, and the frame carries the
            three payloads that say WHY the output box is empty. */}
        <SeatsAnswer code={SEATS_CODE} filename={PY} />
        <StepCaption beats={SEATS_BEATS} className="mt-4" />
        <StepControls className="mt-3 w-full justify-center" showCount={false} mode="code" />
      </ContentSlide>
    ),
  },

  /* ── Closing frame ───────────────────────────────────────────────── */
  {
    id: 'key-takeaways',
    section: 'Closing',
    label: 'Key Takeaways',
    element: (
      /* THE REFERENCE'S OWN HEADING. It reads `For loop` over `What we did
         today`; ours read `Key Takeaways` over `For Loop`, which is the same two
         words in the other two slots and made the frame look like a different
         card from the one the room was promised. */
      <KeyTakeawaysSlide
        kicker={SESSION}
        title="What we did today"
        lesson={SESSION}
        points={[
          /* The four agenda strings, word for word (content rule 20). The subs
             are free, so they carry the three facts the reference's own takeaway
             map carries and this frame had lost: what range(1, 5) actually
             gives, what an empty sequence does, and that the sequence is what
             decides how many passes happen. */
          {
            text: AGENDA.forLoop,
            sub: 'Walk a sequence one item at a time. The sequence decides how many passes happen',
          },
          { text: AGENDA.range, sub: 'Makes a sequence of numbers. range(1, 5) gives 1 2 3 4, not 5' },
          { text: AGENDA.star, sub: 'Write it yourself: one row per pass, and counter stars on each' },
          {
            text: AGENDA.mistake,
            sub: 'range stops before its end value, and an empty sequence means the body never runs',
          },
        ]}
      />
    ),
  },
  {
    id: 'next-session',
    section: 'Closing',
    label: 'Next Session',
    transition: 'fade',
    element: <SectionBreakerSlide kicker="Next Session" title="String Methods" lesson={SESSION} />,
  },
  { id: 'feedback', section: 'Closing', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} /> },
  {
    id: 'thank-you',
    section: 'Closing',
    label: 'Thank you',
    transition: 'zoom',
    element: <ThankYouSlide title="Thank you!" lesson={SESSION} />,
  },
]
