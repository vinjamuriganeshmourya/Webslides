import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  FeedbackSlide,
  QuizTimeSlide,
  RecapSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import {
  BeatStory,
  BulletList,
  CallChip,
  Callout,
  ChallengePanel,
  CodeBlock,
  Countdown,
  CrossList,
  DayTrack,
  ExamplesToShape,
  MatchPairs,
  OptionList,
  OutputPanel,
  PseudoShape,
  RangeArg,
  RangeCall,
  RangeCells,
  RangeDial,
  RangePunct,
  Row,
  Gap,
  RunCompare,
  SavingsStory,
  SeqBoxes,
  SlideBase,
  StoryArt,
  StringWalker,
  TakeawayTree,
  TraceCaption,
  TracePanel,
  VarTrail,
  ZonedFrame,
  type CodeLineState,
  type TraceBeat,
} from '@/ui'
import { colors } from '@/design/tokens'

/**
 * PYTHON PROGRAMMING · "For Loop"
 *
 * Plan: Outputs/python_programming/session_plans/for_loop/plan.md (signed off
 * 2026-09-29). The content is the PF 14 lesson-plan deck's, word for word; this
 * file only re-draws it in the kit. Do not reword a line here without the plan.
 *
 * Deck rules, beyond the repo's:
 *
 *   ONE CODE BOX. Every code box is x 64, y 221, 560 wide, 20px type, titled
 *   `Python` (rule 26), and a run of consecutive code slides shares one `rows`
 *   so the box never changes size as the deck advances (user, 2026-09-29):
 *       8 to 10: 6 rows · 12 to 14, 16 to 18: 4 (15 is 6, grows down only)
 *       23: 2 · 27: 6 · 29, 30: 3 · 33 to 35: 5
 *   A code slide's lead sits in Space-3 (`mode="top"`), which is what puts the
 *   box at y 221.
 *
 *   PANELS. Slides 3, 4, 5, 15, 25, 26, 27, 35, 36 are taught in beats (the
 *   kit's build steps, with Next / Replay). 14, 24 and 31 are played with, and
 *   keep their own controls.
 */
export const forLoopMeta: DeckMeta = {
  title: 'For Loop',
  course: 'Python Programming',
  lesson: 'For Loop',
  /* the source deck kept its counter and arrows on screen (user, 2026-09-30) */
  controls: 'always',
}

const SESSION = 'For Loop'

/* ------------------------------------------------------------------ helpers */

function zoned(
  kicker: string,
  title: ReactNode,
  body: ReactNode,
  { lead, mode = 'top', wide = true }: { lead?: ReactNode; mode?: 'top' | 'center'; wide?: boolean } = {},
) {
  return (
    <SlideBase lesson={SESSION}>
      <ZonedFrame kicker={kicker} title={title} lead={lead} mode={mode} wide={wide}>
        {body}
      </ZonedFrame>
    </SlideBase>
  )
}

/** The deck's one code box. */
function Code({
  code,
  rows,
  loop,
  lines,
  labels,
}: {
  code: string
  rows: number
  loop?: [number, number]
  lines?: Record<number, CodeLineState>
  labels?: Record<number, string>
}) {
  return (
    <CodeBlock
      code={code}
      filename="Python"
      chip={false}
      fontSize={20}
      rows={rows}
      loop={loop}
      lines={lines}
      labels={labels}
      maxHeight={600}
      className="w-[560px] shrink-0"
    />
  )
}

const mono = (t: ReactNode) => <span className="font-mono font-bold" style={{ color: colors.danger }}>{t}</span>
const b = (t: ReactNode) => <b className="text-ink">{t}</b>

/* ------------------------------------------------------------------ code */

const WHILE_BUG = `a = input()
counter = 0
length_of_a = len(a)
while counter < (length_of_a - 1):
    print(a[counter])
    counter = counter + 1`

const WHILE_FIX = `a = input()
counter = 0
length_of_a = len(a)
while counter < length_of_a:
    print(a[counter])
    counter = counter + 1`

const WHILE_SIMPLIFY = `a = "Python"
length_of_a = len(a)
counter = 0
while counter < length_of_a:
    print(a[counter])
    counter = counter + 1`

const FOR_WORD = `word = "Python"
for each_char in word:
    print(each_char)`

const TYPE_IT = (word: string) => `word = "${word}"
for ch in word:
    print(ch)
print("Done")`

const TRACE_HI = `word = "Hi"
n = 0
for ch in word:
    n = n + 1
    print(ch)
print(n)`

const RIYA = `n = int(input())
total = 0
for day in range(1, n + 1):
    if day % 2 == 1:
        total = total + day
print(total)`

const SEATS = `seats = int(input())
booked = int(input())
left = seats - booked
for i in range(1, left):
    print("Seat", i)`

const STARS = '*\n* *\n* * *\n* * * *'
const PY_COL = 'P\ny\nt\nh\no\nn'

/* ------------------------------------------------------------------ slide 15: the worksheet trace */

const HI_CAPTIONS: ReactNode[] = [
  <>{b('Worksheet task 1')} Fill the table by hand first. Nothing here moves until pens are down.</>,
  <>{b('Line 1')} word now holds the two characters H and i.</>,
  <>{b('Line 2')} n starts at 0.</>,
  <>{b('Line 3, first pass')} The loop takes the first item out of the sequence. ch is H.</>,
  <>{b('Line 4')} n goes from 0 to 1.</>,
  <>{b('Line 5')} It prints whatever ch is holding right now.</>,
  <>{b('Line 3, second pass')} Back to the loop. It takes the next item. ch is i.</>,
  <>{b('Line 4')} n goes from 1 to 2.</>,
  <>{b('Line 5')} It prints i.</>,
  <>{b('Line 3, third try')} The loop asks for the next item. There is none left, so the loop ends.</>,
  <>{b('Line 6')} It prints n, which is 2. Two characters, two passes.</>,
]
/* which line runs on each beat (0 = none), from the source's trace */
const HI_NOW = [0, 1, 2, 3, 4, 5, 3, 4, 5, 3, 6]
const HI_CH = [[], [], [], ['H'], ['H'], ['H'], ['H', 'i'], ['H', 'i'], ['H', 'i'], ['H', 'i'], ['H', 'i']]
const HI_N = [[], [], ['0'], ['0'], ['0', '1'], ['0', '1'], ['0', '1'], ['0', '1', '2'], ['0', '1', '2'], ['0', '1', '2'], ['0', '1', '2']]
const HI_OUT = ['', '', '', '', '', 'H', 'H', 'H', 'H\ni', 'H\ni', 'H\ni\n2']

/** Lines run before beat k are 'ran'; the one running on beat k is 'now'. */
function ranBefore(now: number[], k: number): Record<number, CodeLineState> {
  const out: Record<number, CodeLineState> = {}
  for (let j = 0; j < k; j++) if (now[j]) out[now[j]] = 'ran'
  if (now[k]) out[now[k]] = 'now'
  return out
}

const HI_BEATS: TraceBeat[] = HI_CAPTIONS.map((caption, k) => ({
  caption,
  lines: k === 0 ? {} : ranBefore(HI_NOW, k),
  aside:
    k === 0 ? (
      <div className="flex flex-col gap-3 text-[19px] leading-snug" style={{ color: colors.body }}>
        <p className="text-ink">Open {b('worksheet task 1')}. Fill the pass table by hand before you run anything.</p>
        <ul className="list-disc pl-6">
          <li>Write what {b('ch')} holds on each pass.</li>
          <li>Write what {b('n')} is after line 4.</li>
          <li>Write what line 5 prints.</li>
          <li>Then answer the two questions under the table.</li>
        </ul>
        <Countdown seconds={300} />
        <p>{b('Do not run it yet.')} The playground is where you check, not where you start.</p>
      </div>
    ) : (
      <>
        <div className="pt-7">
          <SeqBoxes
            items={['H', 'i']}
            taken={new Set(k >= 6 ? [0, 1] : k >= 3 ? [0] : [])}
            current={k >= 3 && k < 6 ? 1 : undefined}
            drained={k >= 6}
          />
        </div>
        <Row gap={28}>
          <VarTrail name="ch" values={HI_CH[k]} />
          <VarTrail name="n" values={HI_N[k]} />
        </Row>
        <OutputPanel output={HI_OUT[k]} fontSize={18} height={150} />
      </>
    ),
}))

/* ------------------------------------------------------------------ slide 27: Riya, day by day */

const RK_CAPTIONS: ReactNode[] = [
  <>{b('Lines 1 and 2')} n is 7. total starts at 0.</>,
  <>{b('Day 1')} 1 is odd. total goes from 0 to 1.</>,
  <>{b('Day 2')} 2 is even. The if is False, so total stays 1.</>,
  <>{b('Day 3')} 3 is odd. total goes from 1 to 4.</>,
  <>{b('Day 4')} 4 is even. The if is False, so total stays 4.</>,
  <>{b('Day 5')} 5 is odd. total goes from 4 to 9.</>,
  <>{b('Day 6')} 6 is even. The if is False, so total stays 9.</>,
  <>{b('Day 7')} 7 is odd. total goes from 9 to 16.</>,
  <>{b('No days left')} range stops before 8. The loop ends.</>,
  <>{b('Line 6')} It prints 16. That is Riya's money after 7 days.</>,
]
const RK_LINES: Record<number, CodeLineState>[] = [
  { 1: 'ran', 2: 'now' },
  { 3: 'ran', 4: 'ran', 5: 'now' },
  { 3: 'ran', 4: 'now', 5: 'dead' },
  { 3: 'ran', 4: 'ran', 5: 'now' },
  { 3: 'ran', 4: 'now', 5: 'dead' },
  { 3: 'ran', 4: 'ran', 5: 'now' },
  { 3: 'ran', 4: 'now', 5: 'dead' },
  { 3: 'ran', 4: 'ran', 5: 'now' },
  { 3: 'now' },
  { 1: 'ran', 2: 'ran', 3: 'ran', 4: 'ran', 5: 'ran', 6: 'now' },
]
const RK_TOTAL = [['0'], ['0', '1'], ['0', '1'], ['0', '1', '4'], ['0', '1', '4'], ['0', '1', '4', '9'], ['0', '1', '4', '9'], ['0', '1', '4', '9', '16'], ['0', '1', '4', '9', '16'], ['0', '1', '4', '9', '16']]
const RK_BANK = ['₹0', '₹1', '₹1', '₹4', '₹4', '₹9', '₹9', '₹16', '₹16', '₹16']
const RK_DAYS = [
  { n: 1, tag: '+1' },
  { n: 2, tag: 'skip', skip: true },
  { n: 3, tag: '+3' },
  { n: 4, tag: 'skip', skip: true },
  { n: 5, tag: '+5' },
  { n: 6, tag: 'skip', skip: true },
  { n: 7, tag: '+7' },
]

const RK_BEATS: TraceBeat[] = RK_CAPTIONS.map((caption, k) => ({
  caption,
  lines: RK_LINES[k],
  aside: (
    <>
      <DayTrack label="day" days={RK_DAYS} reached={Math.min(k, 7)} current={k >= 1 && k <= 7 ? k - 1 : undefined} />
      <VarTrail name="total" values={RK_TOTAL[k]} />
      {/* the bank sits beside the output at a fixed size, where nothing grows: the
          total trail above lengthens every beat and must not move it (user, 2026-09-30) */}
      <div className="flex items-center gap-4">
        <div className="min-w-0 flex-1">
          <OutputPanel output={k === 9 ? '16' : ''} fontSize={18} height={96} />
        </div>
        <div className="flex w-[170px] shrink-0 items-center gap-2">
          <StoryArt name="piggy-bank" className="h-[70px] w-[84px] shrink-0" />
          <b className="w-[70px] font-heading text-[26px]" style={{ color: colors.accentDark }}>{RK_BANK[k]}</b>
        </div>
      </div>
    </>
  ),
}))

/* ------------------------------------------------------------------ slide 35: why it prints nothing */

const XA_STEPS: { caption: ReactNode; lines: Record<number, CodeLineState> }[] = [
  { caption: <>{b('Option B.')} seats is 4 and booked is 3.</>, lines: { 1: 'now', 2: 'now' } },
  { caption: <>{b('Line 3.')} left is 4 minus 3, which is 1.</>, lines: { 1: 'ran', 2: 'ran', 3: 'now' } },
  { caption: <>{b('Line 4.')} range(1, 1) starts at 1 and stops before 1. It has no numbers in it.</>, lines: { 1: 'ran', 2: 'ran', 3: 'ran', 4: 'now' } },
  { caption: <>{b('Nothing is printed.')} The loop body never runs, so the screen stays empty.</>, lines: { 1: 'ran', 2: 'ran', 3: 'ran', 4: 'ran', 5: 'dead' } },
]
const XA_BEATS: TraceBeat[] = XA_STEPS.map((beat, k) => ({
  ...beat,
  aside: (
    <>
      <div className="flex flex-wrap items-center gap-x-6">
        <VarTrail name="seats" values={['4']} />
        <VarTrail name="booked" values={['3']} />
        <div style={{ opacity: k >= 1 ? 1 : 0, transition: 'opacity 300ms' }}>
          <VarTrail name="left" values={['1']} />
        </div>
      </div>
      <div style={{ opacity: k >= 2 ? 1 : 0, transition: 'opacity 300ms' }}>
        <CallChip call="range(1, 1)" note="no numbers" />
      </div>
      <OutputPanel output="" fontSize={18} height={110} />
      <p className="text-[17px] font-bold" style={{ color: colors.danger, opacity: k >= 3 ? 1 : 0, transition: 'opacity 300ms' }}>
        nothing printed
      </p>
    </>
  ),
}))

/* ------------------------------------------------------------------ the deck */

export const forLoopDeck: SlideDef[] = [
  /* ── OPENING ─────────────────────────────────────────────────────────── */
  {
    id: 'welcome',
    section: 'Opening',
    label: 'Welcome',
    element: <BrandSlide lesson={SESSION} />,
  },
  {
    id: 'recap',
    section: 'Opening',
    label: 'Recap',
    element: (
      <RecapSlide
        kicker="Recap"
        title="Where We Left Off"
        immediate
        lesson={SESSION}
        points={[
          { text: 'A while loop repeats a block of code', sub: 'As long as its condition is True' },
          { text: 'It needs three lines to work', sub: 'A start value, a condition, and an update' },
          { text: 'Miss the update and it never stops', sub: 'The condition stays True for ever' },
        ]}
      />
    ),
  },
  {
    id: 'recap-three-parts',
    section: 'Opening',
    label: 'Recap: the while loop in three parts',
    element: zoned(
      'Recap',
      'The while loop, in three parts',
      <MatchPairs
        left={[
          { pair: 1, text: 'counter = 0' },
          { pair: 2, text: 'while counter < 3:' },
          { pair: 3, text: 'counter = counter + 1' },
        ]}
        right={[
          { pair: 1, text: 'Sets the starting value. Runs once, before the loop.' },
          { pair: 3, text: 'Moves the counter on, so the question can turn false.' },
          { pair: 2, text: 'The question asked before every pass.' },
        ]}
        notes={[
          'Initialization. Miss it and the name does not exist yet, so line 2 cannot even be asked.',
          'The condition. For this program it is asked 4 times, not 3: once before each pass, and once more at the end when the answer is finally no.',
          'Updation. Take this line out and the answer stays yes for ever, and the program never stops.',
        ]}
      />,
      { lead: 'Three parts on the left, three jobs on the right. Call out which two go together, then we join them.' },
    ),
    notes: 'Opens with nothing joined. Each Join them press numbers one pair and adds its line.',
  },
  {
    id: 'hook',
    section: 'Opening',
    label: 'Hook: one tap, and it keeps going',
    element: zoned(
      'Before we start',
      'One tap, and it keeps going',
      <BeatStory
        figureWidth={236}
        figure={(beat) => <StoryArt name="playlist-phone" beat={beat} className="h-[410px] w-[236px]" />}
        lines={[
          { title: 'The list', text: 'A Spotify playlist you made. Five songs.' },
          { title: 'One tap', text: 'You tap play once. Song one starts.' },
          { title: 'It moves on its own', text: 'Song one ends. Song two starts. You did not touch the phone.' },
          { title: 'Right to the end, then it stops', text: 'The last song ends and it stops. Nothing says five. So what told it to stop?' },
          { title: 'Add one song', text: 'Now there are six. It plays six. You never typed a number.' },
          { title: 'Your turn', text: 'Where else does one tap keep going till a list runs out?' },
        ]}
      />,
    ),
  },
  {
    id: 'where-else',
    section: 'Opening',
    label: 'Where else does this happen?',
    element: zoned(
      'Your turn',
      'Where else does this happen?',
      <ExamplesToShape
        ask={{ title: 'Where else have you seen this?', text: 'One action, and it keeps going by itself until a list runs out.' }}
        examples={[
          { art: 'attendance-register', title: 'The attendance register', text: 'One name, one tick. It stops when the names run out.' },
          { art: 'stories-phone', title: 'Instagram stories', text: 'One story, then the next. Nobody types how many there are.' },
          { art: 'billing-scanner', title: 'The billing counter', text: 'One item over the scanner, one beep, until the basket is empty.' },
        ]}
        shape="loop-shape"
        caption={<>{b('Same shape all three times.')} Take a list. Do one job. Once for each item in it. You never say how many.</>}
      />,
    ),
  },
  {
    id: 'session',
    section: 'Opening',
    label: 'Today',
    element: <WelcomeSlide minimal title="For Loop" lesson={SESSION} />,
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'The plan',
    element: (
      <AgendaSlide
        kicker="Agenda"
        title="What We Will Cover"
        lesson={SESSION}
        items={[
          { title: 'For Loop', sub: 'Walk through a sequence, one item at a time' },
          { title: 'Range', sub: 'Make a sequence of numbers' },
          { title: 'The Star Pattern', sub: 'Write it yourself' },
          { title: 'The One Mistake', sub: 'The one everybody makes' },
        ]}
      />
    ),
  },

  /* ── FOR LOOP ─────────────────────────────────────────────────────────── */
  {
    id: 'mistake',
    section: 'For Loop',
    label: 'Identify the mistake',
    element: zoned(
      'Daily Challenge',
      'Identify the Mistake',
      <Row>
        <Code code={WHILE_BUG} rows={6} loop={[4, 6]} />
        <div className="flex w-[230px] flex-col gap-4">
          <OutputPanel kind="input" output="Python" fontSize={22} />
          <OutputPanel title="Expected output" output={PY_COL} fontSize={22} />
        </div>
      </Row>,
      { lead: 'The input is Python. Every letter should print on its own line.' },
    ),
  },
  {
    id: 'mistake-fixed',
    section: 'For Loop',
    label: 'One character, and the last letter comes back',
    element: zoned(
      'Daily Challenge',
      'Identify the Mistake',
      <Row>
        <Code code={WHILE_FIX} rows={6} loop={[4, 6]} lines={{ 4: 'warn' }} />
        <div className="flex w-[190px] flex-col gap-4">
          <OutputPanel kind="input" output="Python" fontSize={22} />
          <OutputPanel output={PY_COL} fontSize={22} />
        </div>
      </Row>,
      { lead: 'One character, and the last letter comes back.' },
    ),
  },
  {
    id: 'simplify',
    section: 'For Loop',
    label: 'Can we simplify this?',
    element: zoned(
      'While Loop',
      'Can We Simplify This?',
      <Row>
        <Code
          code={WHILE_SIMPLIFY}
          rows={6}
          loop={[4, 6]}
          lines={{ 3: 'mark', 4: 'mark', 6: 'mark' }}
          labels={{ 3: 'Initialization', 4: 'Termination condition', 6: 'Updation' }}
        />
      </Row>,
      { lead: 'Three lines in this loop only keep count. None of them prints anything.' },
    ),
  },
  {
    id: 'for-syntax',
    section: 'For Loop',
    label: 'For Loop: the syntax',
    element: zoned(
      'Loops',
      'For Loop',
      <Row gap={56} align="center">
        <div className="flex w-[470px] flex-col gap-6">
          <p className="text-[24px] leading-normal" style={{ color: colors.body }}>
            {mono('for')} goes through each item of a sequence, one at a time
          </p>
          <BulletList
            immediate
            marker="dot"
            items={[
              { text: 'A string is a sequence', sub: 'A sequence of characters' },
              { text: 'Numbers can be a sequence too', sub: 'And many more kinds' },
            ]}
          />
        </div>
        <PseudoShape
          head={[{ t: 'for', k: 'control' }, { t: ' each_item ' }, { t: 'in', k: 'control' }, { t: ' sequence', k: 'ident' }, { t: ':' }]}
          block="Repeating block of code"
        />
      </Row>,
      { lead: 'A new loop that walks through a sequence by itself.', mode: 'center' },
    ),
  },
  {
    id: 'for-characters',
    section: 'For Loop',
    label: 'For Loop: over the characters of a word',
    element: zoned(
      'Iterate Over Characters',
      'For Loop',
      <Row>
        <Code code={FOR_WORD} rows={4} loop={[2, 3]} />
        <PseudoShape
          head={[{ t: 'for', k: 'control' }, { t: ' each_item ' }, { t: 'in', k: 'control' }, { t: ' sequence', k: 'ident' }, { t: ':' }]}
          block="Repeating block of code"
        />
      </Row>,
      { lead: 'The sequence here is a word. The loop takes its characters one by one.' },
    ),
  },
  {
    id: 'for-not-needed',
    section: 'For Loop',
    label: 'No initialization, no condition, no updation',
    element: zoned(
      'Iterate Over Characters',
      'For Loop',
      <Row>
        <Code code={FOR_WORD} rows={4} loop={[2, 3]} />
        <CrossList heading="Not needed any more:" items={['Initialization', 'Termination condition', 'Updation']} />
      </Row>,
      { lead: 'The same job as the while loop, in two lines.' },
    ),
  },
  {
    id: 'string-walk',
    section: 'For Loop',
    label: '"Python", one character at a time',
    element: zoned('A string is a sequence', '"Python", one character at a time', <StringWalker rows={4} />),
    notes: 'Played with, not stepped: Split it, then Play or One step. Pick Go or nothing to walk another word.',
  },
  {
    id: 'task-1',
    section: 'For Loop',
    label: 'Worksheet task 1: trace it, then check it',
    element: zoned('Worksheet task 1', 'Trace it before you run it', <TracePanel code={TRACE_HI} rows={6} beats={HI_BEATS} />),
  },
  {
    id: 'task-2-1',
    section: 'For Loop',
    label: 'Task 2, step 1: type it and run it',
    element: zoned(
      'Worksheet task 2',
      'Step 1: type it, run it',
      <div className="flex flex-col gap-5">
        <Row>
          <Code code={TYPE_IT('Rain')} rows={4} />
          <div className="flex flex-col gap-3 text-body-lg text-ink">
            <p>Type this program into the {b('playground')}.</p>
            <p>Run it as it is. Then tick {b('step 1')} on the worksheet.</p>
            <Countdown seconds={60} />
          </div>
        </Row>
        <TraceCaption>{b('Worksheet tab and the playground only.')} Nothing else open.</TraceCaption>
      </div>,
    ),
  },
  {
    id: 'task-2-2',
    section: 'For Loop',
    label: 'Task 2, step 2: change the word',
    element: zoned(
      'Worksheet task 2',
      'Step 2: change the word',
      <div className="flex flex-col gap-5">
        <Row>
          <Code code={TYPE_IT('Delhi')} rows={4} lines={{ 1: 'mark' }} />
          <div className="flex flex-col gap-3 text-body-lg text-ink">
            <p>Change line 1 to <code className="font-mono">word = "Delhi"</code>.</p>
            <p>On the worksheet, write {b('how many lines')} it will print. Then run it.</p>
            <Countdown seconds={90} />
          </div>
        </Row>
        <TraceCaption tone="warn">{b('Write first, run second.')} A guess after the run is not a guess.</TraceCaption>
      </div>,
    ),
  },
  {
    id: 'task-2-3',
    section: 'For Loop',
    label: 'Task 2, step 3: an empty word',
    element: zoned(
      'Worksheet task 2',
      'Step 3: an empty word',
      <div className="flex flex-col gap-5">
        <Row>
          <Code code={TYPE_IT('')} rows={4} lines={{ 1: 'mark' }} />
          <div className="flex flex-col gap-3 text-body-lg text-ink">
            <p>Change line 1 to <code className="font-mono">word = ""</code>. Two quote marks, nothing between.</p>
            <p>On the worksheet, write {b('what it will print')}. Run it. Then write what it really printed.</p>
            <Countdown seconds={120} />
          </div>
        </Row>
        <TraceCaption tone="warn">{b('Write first, run second.')} Does it give an error? Decide before you run.</TraceCaption>
      </div>,
    ),
  },
  {
    id: 'quiz',
    section: 'For Loop',
    label: 'Classroom quiz',
    element: (
      <QuizTimeSlide
        kicker="Quiz time"
        title="Classroom Quiz"
        subtitle="Time to check what you have learned so far."
        steps={['Open the quiz on your portal', 'Answer every question on your own', 'We go through the answers together']}
        lesson={SESSION}
      />
    ),
  },

  /* ── RANGE ────────────────────────────────────────────────────────────── */
  {
    id: 'numbers',
    section: 'Range',
    label: 'How do we make a sequence of numbers?',
    element: zoned(
      'For Loop',
      'Iterate Over Numbers',
      <Row gap={56} align="center">
        <p className="w-[320px] text-[24px] leading-normal" style={{ color: colors.body }}>
          How do we make a {b('sequence of numbers')}?
        </p>
        <PseudoShape
          head={[
            { t: 'for', k: 'control' },
            { t: ' each_number ' },
            { t: 'in', k: 'control' },
            { t: ' sequence_of_numbers', k: 'ident' },
            { t: ':' },
          ]}
          block="Repeating block of code"
        />
      </Row>,
      { lead: 'A for loop needs a sequence. What if we want numbers, like 0, 1, 2, 3?', mode: 'center' },
    ),
  },
  {
    id: 'range-n',
    section: 'Range',
    label: 'Range: starts at 0, stops before n',
    element: zoned(
      'Iterate Over Numbers',
      'Range',
      <Row gap={56} align="center" justify="center">
        <RangeCall
          call={<>range<RangePunct>(</RangePunct><RangeArg>n</RangeArg><RangePunct>)</RangePunct></>}
          below={<>Stops before <RangeArg>n</RangeArg><br />(<RangeArg>n</RangeArg> is not included)</>}
        />
        <Callout kind="success" title="What it gives" asStep={false} className="w-[400px]">
          A sequence of integers, starting from {b('0')}
        </Callout>
      </Row>,
      { lead: 'range gives us a sequence of whole numbers.', mode: 'center' },
    ),
  },
  {
    id: 'range-5',
    section: 'Range',
    label: 'range(5) gives 0 1 2 3 4',
    element: zoned(
      'Range',
      'Sequence of Integers',
      <RangeCells
        call={<>range<RangePunct>(</RangePunct><RangeArg tone={colors.accentDark}>5</RangeArg><RangePunct>)</RangePunct></>}
        values={[0, 1, 2, 3, 4]}
      />,
      { lead: 'range(5) gives five numbers. The count starts at 0.', mode: 'center' },
    ),
  },
  {
    id: 'range-loop',
    section: 'Range',
    label: 'for number in range(3)',
    element: zoned(
      'Iterate Over Numbers',
      'Range',
      <Row>
        <Code code={`for number in range(3):\n    print(number)`} rows={2} loop={[1, 2]} />
        <div className="w-[220px]">
          <OutputPanel output={'0\n1\n2'} fontSize={22} />
        </div>
      </Row>,
      { lead: 'The loop runs once for each number that range gives.', mode: 'center' },
    ),
  },
  {
    id: 'range-dial',
    section: 'Range',
    label: 'The range dial',
    element: zoned(
      'Predict, then look',
      'The range dial',
      <RangeDial caption={<>{b('Say the two numbers out loud first.')} Which numbers come out, and how many? Then press the button.</>} />,
    ),
    notes: 'Played with: set start and stop, let the room say which numbers, then Show the numbers.',
  },
  {
    id: 'piggy-bank',
    section: 'Range',
    label: "Riya's piggy bank",
    element: zoned(
      'A story',
      "Riya's piggy bank",
      <SavingsStory
        name="Riya"
        days={[
          { label: 'Day 1', coin: '₹1', at: 2 },
          { label: 'Day 2', skip: 'skip', at: 3 },
          { label: 'Day 3', coin: '₹3', at: 4 },
          { label: 'Day 4', skip: 'skip', at: 5 },
          { label: 'Day 5', coin: '₹5', at: 5 },
          { label: 'Day 6', skip: 'skip', at: 5 },
          { label: 'Day 7', coin: '₹7', at: 5 },
        ]}
        beats={[
          { who: 'girl', says: <>I want to save money. But I will save only on <b>odd days</b>.</>, total: '₹0', caption: <>{b("Riya's rule:")} on an odd day d, she saves ₹d. On an even day, she saves nothing.</> },
          { who: 'girl', says: <>Day 1 is odd. I put in <b>₹1</b>.</>, total: '₹1', drops: [0], caption: <>{b("Riya's rule:")} on an odd day d, she saves ₹d. On an even day, she saves nothing.</> },
          { who: 'pig', says: <>Day 2 is even. <b>Nothing</b> for me today!</>, total: '₹1', pigSad: true, caption: <>{b("Riya's rule:")} on an odd day d, she saves ₹d. On an even day, she saves nothing.</> },
          { who: 'girl', says: <>Day 3 is odd. I put in <b>₹3</b>.</>, total: '₹4', drops: [2], caption: <>{b("Riya's rule:")} on an odd day d, she saves ₹d. On an even day, she saves nothing.</> },
          { who: 'pig', says: <>Day 5 gives ₹5. Day 7 gives ₹7. Now I have <b>₹16</b>!</>, total: '₹16', drops: [4, 6], success: true, caption: <>{b("Riya's rule:")} on an odd day d, she saves ₹d. On an even day, she saves nothing.</> },
          { who: 'girl', says: <>What about 30 days? Or a whole year? I can't add all that by hand!</>, total: '₹16', girlWorried: true, caption: <>{b('Your turn.')} Write a program that works out Riya's money for any number of days.</> },
        ]}
      />,
    ),
  },
  {
    id: 'challenge',
    section: 'Range',
    label: "Coding challenge: Riya's savings",
    element: zoned(
      'Coding challenge',
      "Riya's savings",
      <ChallengePanel
        title="Riya's savings"
        statement={[
          <>Read a number <b>n</b>. Print the total money Riya saves from <b>day 1 to day n</b>, both days included.</>,
          <>On an odd day <b>d</b>, she saves ₹d. On an even day, she saves nothing.</>,
        ]}
        examples={[
          { input: '7', output: '16' },
          { input: '4', output: '4' },
        ]}
        lead={<>Open the <b>playground</b>. Write Riya's program.</>}
        steps={[<>Run it with <b>7</b>. It must print <b>16</b>.</>, <>Then run it with <b>10</b>. Keep that answer ready.</>]}
        seconds={240}
        hint={<><code>day % 2 == 1</code> is True only when <b>day</b> is odd.</>}
      />,
    ),
  },
  {
    id: 'riya-trace',
    section: 'Range',
    label: "Riya's savings, day by day",
    element: zoned(
      'Check it together',
      "Riya's savings, day by day",
      <TracePanel
        code={RIYA}
        rows={6}
        beats={RK_BEATS}
        below={<p className="text-[17px]" style={{ color: colors.muted }}>input: <code className="font-mono font-bold text-ink">7</code></p>}
      />,
    ),
  },

  /* ── THE STAR PATTERN ─────────────────────────────────────────────────── */
  {
    id: 'pattern',
    section: 'The Star Pattern',
    label: 'Right angle triangular pattern',
    element: zoned(
      'Example',
      'Right Angle Triangular Pattern',
      <Row gap={28}>
        <div className="w-[240px]">
          <OutputPanel kind="input" output="4" fontSize={24} />
        </div>
        <div className="w-[260px]">
          <OutputPanel output={STARS} fontSize={24} />
        </div>
      </Row>,
      { lead: 'Write a program to print a right angle triangle pattern. The number N is the input.', mode: 'center' },
    ),
  },
  {
    id: 'task-3',
    section: 'The Star Pattern',
    label: 'Worksheet task 3: write the loop line',
    element: zoned(
      'Worksheet task 3',
      'Write the loop line',
      <div className="flex flex-col gap-5">
        {/* 29 and 30 centre the same group, so the code box does not move between
            them: 29 reserves the lead it does not have, 30 the caption slot */}
        <Gap h={39} />
        <Row minHeight={222}>
          <Code code={`n = int(input())\n___________________________\n    print("* " * ______)`} rows={3} lines={{ 2: 'mark', 3: 'mark' }} />
          <div className="flex flex-col gap-3 text-body-lg text-ink">
            <p>Line 1 is given. {b('Line 2 and the blank on line 3 are yours.')}</p>
            <p>For n = 4 it prints 4 rows. The last row is <code className="font-mono">* * * *</code></p>
            <p className="text-[18px]" style={{ color: colors.muted }}>The two blanks must agree. More than one pair works.</p>
            <Countdown seconds={240} />
          </div>
        </Row>
        <TraceCaption>{b('Worksheet task 3.')} Write line 2 in full, with the colon. Then try it in the playground.</TraceCaption>
      </div>,
      { mode: 'center' },
    ),
  },
  {
    id: 'solution',
    section: 'The Star Pattern',
    label: 'Solution',
    element: zoned(
      'For Loop',
      'Solution',
      <div className="flex flex-col">
        <Row minHeight={222}>
          <Code code={`n = int(input())\nfor counter in range(n):\n    print("* " * (counter + 1))`} rows={3} loop={[2, 3]} />
          <div className="w-[170px]">
            <OutputPanel kind="input" output="4" fontSize={22} />
          </div>
          <div className="w-[180px]">
            <OutputPanel output={STARS} fontSize={22} />
          </div>
        </Row>
        <Gap h={72} />
      </div>,
      { lead: 'counter goes 0, 1, 2, 3. Each line prints counter + 1 stars.', mode: 'center' },
    ),
  },

  /* ── THE ONE MISTAKE ──────────────────────────────────────────────────── */
  {
    id: 'which-one',
    section: 'The One Mistake',
    label: 'Which one is right?',
    element: zoned(
      'Predict, then run',
      'Which one is right?',
      <RunCompare
        sides={[
          {
            mark: 'A',
            heading: 'range(1, n)',
            code: 'n = int(input())\nfor counter in range(1, n):\n    print("* " * counter)',
            rows: (n) => Array.from({ length: n - 1 }, (_, c) => '* '.repeat(c + 1).trim()),
            missing: (n) => '* '.repeat(n).trim(),
            wrong: true,
          },
          {
            mark: 'B',
            heading: 'range(1, n + 1)',
            code: 'n = int(input())\nfor counter in range(1, n + 1):\n    print("* " * counter)',
            rows: (n) => Array.from({ length: n }, (_, c) => '* '.repeat(c + 1).trim()),
          },
        ]}
        hint="Count the hands for A, then for B. Then press."
        verdict="B is the one. A stops before n, so the last row never happens."
        caption={<>{b('Hands up for A. Now hands up for B.')} Count both before you press Run.</>}
      />,
      { lead: <>Both of these start at 1. Which one prints all {b('n')} rows?</> },
    ),
    notes: 'Played with: votes first, then Run them both. − and + change n from 2 to 6.',
  },
  {
    id: 'range-start-end',
    section: 'The One Mistake',
    label: 'range(start, end)',
    element: zoned(
      'Iterate Over Numbers',
      'Range',
      <RangeCall
        align="start"
        above={<>Makes a sequence of numbers<br />starting from <RangeArg>start</RangeArg></>}
        call={<>range<RangePunct>(</RangePunct>start, <RangeArg>end</RangeArg><RangePunct>)</RangePunct></>}
        below={<>Stops before <RangeArg>end</RangeArg><br />(<RangeArg>end</RangeArg> is not included)</>}
      />,
      { lead: 'range can also start at a number you choose.', mode: 'center' },
    ),
  },
  {
    id: 'simplified',
    section: 'The One Mistake',
    label: 'Simplified with range(1, n+1)',
    element: zoned(
      'Iterate Over Numbers',
      'For Loop',
      <Row>
        <Code code={`n = int(input())\nfor counter in range(1, n + 1):\n    print("* " * counter)`} rows={5} loop={[2, 3]} lines={{ 2: 'mark' }} />
        <div className="flex w-[180px] flex-col gap-4">
          <OutputPanel kind="input" output="4" fontSize={22} />
          <OutputPanel output={STARS} fontSize={22} />
        </div>
      </Row>,
      { lead: 'Simpler with range(1, n + 1). counter is already the number of stars.' },
    ),
  },

  /* ── CLOSE ────────────────────────────────────────────────────────────── */
  {
    id: 'exit',
    section: 'Close',
    label: 'Exit: one question',
    element: zoned(
      'Exit question',
      'Which one prints nothing?',
      <Row>
        <Code code={SEATS} rows={5} />
        <div className="flex flex-col gap-5">
          <OptionList options={['seats = 5, booked = 3', 'seats = 4, booked = 3', 'seats = 3, booked = 0', 'seats = 6, booked = 2']} />
          <Countdown seconds={150} />
        </div>
      </Row>,
      { lead: <>Read the code. For which pair does the screen show {b('nothing at all')}?</> },
    ),
  },
  {
    id: 'exit-answer',
    section: 'Close',
    label: 'Exit: the answer',
    element: zoned('Exit question', 'Why it prints nothing', <TracePanel code={SEATS} rows={5} beats={XA_BEATS} />),
  },
  {
    id: 'takeaways',
    section: 'Close',
    label: 'Key takeaways',
    element: zoned(
      'For loop',
      'What we did today',
      <TakeawayTree
        nodes={[
          { chip: 'for loop', text: 'walks a sequence, one item at a time', tone: colors.brandDark },
          { chip: 'string', text: '"Python" is a sequence of 6 characters', tone: colors.success },
          { chip: 'range', text: 'range makes a sequence of numbers', tone: colors.brand },
          { chip: 'ch', text: 'holds one item. It changes every pass', tone: colors.accentDark },
          { chip: 'stop', text: 'range(1, 5) gives 1 2 3 4, not 5', tone: colors.danger },
          { chip: 'how many', text: 'the sequence decides how many passes happen', tone: colors.brandDark },
          { chip: 'empty', text: 'an empty sequence means the body never runs', tone: colors.danger },
        ]}
      />,
    ),
  },
  {
    id: 'feedback',
    section: 'Close',
    label: 'Feedback',
    element: <FeedbackSlide lesson={SESSION} />,
  },
  {
    id: 'thanks',
    section: 'Close',
    label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
  },
]
