import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentSlide,
  FeedbackSlide,
  QuizTimeSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import { colors } from '@/design/tokens'
import { SlideBase, ZonedFrame, BulletList, Illustration, type BulletItem } from '@/ui'
import { motion } from 'framer-motion'
import { Panel, Boxes, CenteredLead } from './figures/common'
import { SortDrop } from './figures/SortDrop'
import { ChatHook } from './figures/ChatHook'
import { SliceWalk } from './figures/SliceWalk'
import { ExtendedSlicing } from './figures/ExtendedSlicing'
import { SliceMachine } from './figures/SliceMachine'
import { TypeItTask, TraceTask, WriteItTask } from './figures/WorksheetTasks'
import { PinStory } from './figures/PinStory'
import { MethodCard, Tiles, WordSwap, FrontCheck } from './figures/MethodCard'
import { StripWalker } from './figures/StripWalker'
import { NotEqual, DotStays, StripSet, SpellingScenario } from './figures/PortalFrames'
import { ExitQuestion, SlicingTakeaways, MethodTakeaways } from './figures/Closing'

/**
 * PYTHON · "String Methods" (Programming Foundations, session 15)
 *
 * Built from `Outputs/python/session_plans/15_string_methods/plan.md`, which
 * records the four decisions the user made before generation. The short form:
 *
 * ONE SLIDE PER REFERENCE FRAME. The source is the pedagogy team's lesson plan,
 * `prog_foundations_LP/15 - String Methods`, whose presenter view is 31 frames.
 * All 31 are here, in its order, including the six portal frames it redraws
 * inside its cards. Nothing added, nothing dropped.
 *
 * THE COPY IS THE REFERENCE'S. Every sentence was captured from the rendered
 * page at every press, not retyped from memory (course rule R2). Two sentences
 * are changed, both for a hard content rule, and each says so where it sits.
 *
 * EVERY CODE PANEL SAYS `Python` (content rule 31, a playground course). The
 * reference's invented file names are not carried.
 *
 * EVERY OUTPUT IS A REAL RUN on CPython 3.12.3 (course rule R3), checked
 * against the reference before this file was written. They agree.
 *
 * THE REFERENCE'S CONTROLS STAY. Its `Next` beats are this deck's build steps,
 * so the arrow key and the on-slide Next press the same step. Its three played
 * panels (the slice machine, the strip walker, the exit answer) keep their own
 * buttons as local state, and the deck's arrows still change slide.
 */

export const stringMethodsMeta: DeckMeta = {
  title: 'String Methods',
  course: 'Python',
  lesson: 'String Methods',
  presenter: 'NxtWave Instructor',
}

const SESSION = 'String Methods'

/** The three agenda items, word for word from the reference. */
const AGENDA = [
  { title: 'String Slicing', sub: 'Take a part of a string' },
  { title: 'String Methods', sub: 'Jobs Python already knows' },
  { title: 'Where It Stops', sub: 'A slice stops before its last number' },
]

/* The programs the method cards run, shared by every beat of each card. */
const MOBILE = 'mobile = "  9876543210  "\nprint(mobile.strip())'
const NOTES = 'line = "teh cat and teh dog"\nprint(line.replace("teh", "the"))'
const WORDS = ['teh', 'cat', 'and', 'teh', 'dog']
const URL = 'url = "https://onthegomodel.com"\nprint(url.startswith("https://"))'
const NAME = 'name = "Ravi"\nprint(name.upper())\nprint(name.lower())'

/**
 * SLIDE 2: the kit's `RecapSlide`, with its header in the BRAND tone.
 *
 * `RecapSlide` hard-codes `tone="success"`, so its two header bars and its
 * kicker were green while every other content slide in this deck, slide 3
 * first, draws them in the brand blue: `accentByTone.brand`, which is
 * `ZonedFrame`'s default tone. The user asked for slide 2 to match slide 3
 * (2026-10-01). This is the kit slide's own composition and geometry with that
 * one prop changed; the checklist keeps its green ticks and the mascot its
 * place. Session-local because a kit change is a PR (generate-slides section
 * 6); when `RecapSlide` grows a `tone` prop, this goes back to one line.
 */
function Recap({ title, points, lesson }: { title: string; points: BulletItem[]; lesson: string }) {
  return (
    <SlideBase variant="light" lesson={lesson} padded={false}>
      <ZonedFrame kicker="Recap" title={title} bodyWidth={628}>
        <div className="grid grid-cols-1 gap-x-10 gap-y-0">
          <BulletList items={points} marker="check" tone="success" />
        </div>
      </ZonedFrame>
      {/* The mascot, exactly where `RecapSlide` pins it: bottom-aligned and capped
          at 66% so its head stays under the video rectangle (y 0..220). */}
      <motion.div
        className="absolute grid place-items-end justify-items-center"
        style={{ left: 732, top: 48, width: 484, height: 608 }}
        initial={{ opacity: 0, scale: 0.88 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.25, duration: 0.65, ease: [0.34, 1.56, 0.64, 1] }}
      >
        <div className="pointer-events-none absolute bottom-8 h-56 w-56 rounded-full bg-success/15 blur-2xl" />
        <Illustration name="recap" className="relative h-[66%] w-auto" />
      </motion.div>
    </SlideBase>
  )
}

export const stringMethodsDeck: SlideDef[] = [
  /* ── 1 ───────────────────────────────────────────────────────────── */
  {
    id: 'welcome',
    label: 'Welcome',
    transition: 'fade',
    element: <BrandSlide greeting="Welcome" lesson={SESSION} />,
  },

  /* ── 2, 3 · Recap ────────────────────────────────────────────────── */
  {
    id: 'recap',
    section: 'Recap',
    label: 'Where We Left Off',
    element: (
      <Recap
        lesson={SESSION}
        title="Where We Left Off"
        points={[
          { text: 'A for loop walks through a sequence', sub: 'One item at a time, with no counter to update' },
          { text: 'range(n) gives 0, 1, 2 and so on', sub: 'It stops before n' },
          { text: 'range(start, end) starts where you choose', sub: 'It still stops before end' },
        ]}
      />
    ),
  },
  {
    id: 'recap-range-2-6',
    section: 'Recap',
    label: 'What range(2, 6) hands you',
    notes:
      'The room calls where each number goes BEFORE each press of Drop it. range(2, 6) gives 2, 3, 4, 5: the start is in, the stop is not.',
    element: (
      <Panel
        kicker="Recap"
        title="What range(2, 6) hands you"
        lead="Say where each number goes before we drop it. In the sequence, or not in it."
        lesson={SESSION}
      >
        <SortDrop
          bins={{ in: 'In the sequence', out: 'Not in it' }}
          items={[
            { value: '2', side: 'in', why: 'The start is included, so the sequence begins at 2.' },
            { value: '1', side: 'out', why: 'The sequence starts at 2. Nothing before it comes out.' },
            { value: '5', side: 'in', why: '5 is the last number it gives.' },
            { value: '6', side: 'out', why: 'The stop value is never reached. It stops before 6.' },
            { value: '4', side: 'in', why: 'It sits between the start and the stop, so it comes out.' },
          ]}
        />
      </Panel>
    ),
  },

  /* ── 4 · Hook ────────────────────────────────────────────────────── */
  {
    id: 'hook-sorry',
    section: 'Hook',
    label: 'Why can it not find it?',
    notes:
      'Six presses. Let the room argue on beat 3 (who is lying?) before pressing on. The answer is neither: he typed S O R R Y with spaces, and the search looks for five letters side by side.',
    element: (
      <Panel kicker="Before we start" title="Why can it not find it?" lesson={SESSION}>
        <ChatHook />
      </Panel>
    ),
  },

  /* ── 5, 6 · Today ────────────────────────────────────────────────── */
  {
    id: 'todays-session',
    section: 'Today',
    label: 'String Methods',
    transition: 'zoom',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
  },
  {
    id: 'agenda',
    section: 'Today',
    label: 'What We Will Cover',
    element: <AgendaSlide kicker="Agenda" title="What We Will Cover" lesson={SESSION} items={AGENDA} />,
  },

  /* ── 7 to 12 · String Slicing ────────────────────────────────────── */
  /* Content rule 36: no line ends in a full stop, and a line that held two
     sentences is now two lines. Not a word is changed. */
  {
    id: 'one-number-then-two',
    section: AGENDA[0].title,
    label: 'One number, then two',
    element: (
      <Panel kicker="Obtain part of a string" title="One number, then two" lesson={SESSION}>
        <SliceWalk
          name="message"
          value="Hi Ravi"
          beats={[
            {
              got: '',
              lines: ['Seven characters, seven boxes', 'The numbering starts at 0', 'Read the numbers out loud with me'],
            },
            {
              expr: <>message[0] <span className="text-[30px]" style={{ color: colors.muted }}>→</span> "H"</>,
              states: { 0: 'one' },
              got: '',
              lines: ['One number in the brackets gives one character back', 'So message[1] would give me the i'],
            },
            {
              frame: [3, 6],
              got: '',
              lines: ['Now I want the name', 'It sits in four boxes side by side', 'Say their four numbers, then tell me what I should write'],
            },
            {
              expr: 'message[3:7]',
              frame: [3, 6],
              stop: 7,
              got: '',
              lines: ['Start at 3, and stop before 7', 'Box 7 is drawn there, and it is never reached'],
            },
            {
              expr: 'message[3:7]',
              frame: [3, 6],
              stop: 7,
              states: { 3: 'hit', 4: 'hit', 5: 'hit', 6: 'hit' },
              got: 'Ravi',
              lines: ['Those four are copied out', 'message still holds all seven', 'Nothing was taken away from it'],
            },
          ]}
        />
      </Panel>
    ),
  },
  {
    id: 'accessing-parts',
    section: AGENDA[0].title,
    label: 'Accessing Parts of a String',
    element: (
      <ContentSlide kicker="String Slicing" title="Accessing Parts of a String" lesson={SESSION}>
        <CenteredLead>Can we take out the name "Ravi" from this string?</CenteredLead>
        <div className="mx-auto flex w-fit flex-col items-start gap-3">
          <p className="font-mono text-[26px]" style={{ color: colors.body }}>secret_message</p>
          <Boxes chars={[...'-R-a-v-i-']} size="xl" states={{ 1: 'hit', 3: 'hit', 5: 'hit', 7: 'hit' }} />
          <p className="mt-6 self-center text-body-lg" style={{ color: colors.body }}>
            The dashes should go. Only <b className="text-ink">R</b>, <b className="text-ink">a</b>, <b className="text-ink">v</b> and{' '}
            <b className="text-ink">i</b> should stay.
          </p>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'extended-slicing',
    section: AGENDA[0].title,
    label: 'Extended Slicing',
    element: (
      <ContentSlide
        kicker="Strings"
        title="Extended Slicing"
        lead="A third number, the step, says how far each jump goes."
        lesson={SESSION}
      >
        <ExtendedSlicing />
      </ContentSlide>
    ),
  },
  {
    id: 'slice-with-a-step',
    section: AGENDA[0].title,
    label: 'A slice with a step',
    element: (
      <Panel kicker="Strings" title="A slice with a step" lesson={SESSION}>
        <SliceWalk
          name="secret_message"
          value="-R-a-v-i-"
          beats={[
            {
              expr: 'secret_message[1:8:2]',
              got: '',
              lines: ['Same string, and the letters are not side by side.', 'The line is up there. We are going to walk it together.'],
            },
            {
              expr: 'secret_message[1:8:2]',
              states: { 1: 'hit' },
              at: 1,
              got: 'R',
              lines: ['The start is 1. That letter comes out.'],
            },
            {
              expr: 'secret_message[1:8:2]',
              states: { 1: 'hit', 3: 'hit' },
              at: 3,
              got: 'Ra',
              lines: ['1 plus the step 2 is 3.'],
            },
            {
              expr: 'secret_message[1:8:2]',
              states: { 1: 'hit', 3: 'hit', 5: 'hit' },
              at: 5,
              got: 'Rav',
              lines: ['3 plus the step 2 is 5.'],
            },
            {
              expr: 'secret_message[1:8:2]',
              states: { 1: 'hit', 3: 'hit', 5: 'hit', 7: 'hit' },
              at: 7,
              got: 'Ravi',
              lines: ['5 plus the step 2 is 7.', 'The next one would be 9, and we stop before 8.'],
            },
            {
              expr: 'secret_message[1:8:2]',
              states: { 0: 'skip', 1: 'hit', 2: 'skip', 3: 'hit', 4: 'skip', 5: 'hit', 6: 'skip', 7: 'hit', 8: 'skip' },
              at: 7,
              got: 'Ravi',
              lines: ['It never looked at the hyphens at all.'],
            },
          ]}
        />
      </Panel>
    ),
  },

  {
    id: 'slice-machine',
    section: AGENDA[0].title,
    label: 'The slice machine',
    notes:
      'Worksheet task 1 first: the room writes code[0:8:2], code[1:8:2] and code[1:6:3] on the handout. Levels one to three are those three. Take a show of hands, click the option the room chose, THEN Run it. Levels four and five are new.',
    element: (
      <Panel kicker="Predict, then run" title="The slice machine" lesson={SESSION}>
        <SliceMachine />
      </Panel>
    ),
  },
  {
    id: 'task-2',
    section: AGENDA[0].title,
    label: 'Type it, then change the step',
    notes: 'Worksheet task 2. Start the timer when hands are on keyboards. Step 2 is code[0:8:2]; step 3, code[1:8:-2], prints an empty line.',
    element: (
      <Panel kicker="Worksheet task 2" title="Type it, then change the step" lesson={SESSION} mode="center">
        <TypeItTask />
      </Panel>
    ),
  },

  /* ── 13 · Quiz ───────────────────────────────────────────────────── */
  {
    id: 'classroom-quiz',
    section: 'Quiz',
    label: 'Classroom Quiz',
    transition: 'zoom',
    /* THE REFERENCE'S QUIZ FRAME, KEPT WHERE IT SITS (course rule R2) and in its
       own design (course rule R5d): kicker, title, one sentence, three steps.
       `QuizTimeSlide`'s `steps` variant exists for exactly this frame. Content
       rule 28 would strip it to two words; its reason is that a subtitle naming
       the topics previews the answers, and this sentence names none. */
    element: (
      <QuizTimeSlide
        lesson={SESSION}
        kicker="Quiz time"
        title="Classroom Quiz"
        subtitle="Time to check what you have learned so far."
        steps={['Open the quiz on your portal', 'Answer every question on your own', 'We go through the answers together']}
      />
    ),
  },

  /* ── 14 to 26 · String Methods ───────────────────────────────────── */
  {
    id: 'why-a-string-method',
    section: AGENDA[1].title,
    label: 'Why a string method at all?',
    notes: 'Beat 2: take two answers before pressing. Somebody will say check each one; the next press is what that costs.',
    element: (
      <Panel kicker="String methods" title="How does an app know a PIN is all digits?" lesson={SESSION}>
        <PinStory />
      </Panel>
    ),
  },
  {
    id: 'isdigit',
    section: AGENDA[1].title,
    label: 'isdigit',
    element: (
      <Panel kicker="String methods" title="isdigit" lesson={SESSION}>
        <MethodCard
          beats={[
            {
              code: 'pin = "4748"\nprint(pin.isdigit())',
              lines: { 2: 'mark' },
              out: '',
              figure: <Tiles chars={[...'4748']} />,
              ask: 'It is the one from the phone. What does line 2 print?',
              hint: <><b>Do not explain it yet.</b> Take two answers, then press.</>,
            },
            {
              code: 'pin = "4748"\nprint(pin.isdigit())',
              lines: { 2: 'mark' },
              out: 'True',
              figure: <Tiles chars={[...'4748']} look="ok" marks={['✓', '✓', '✓', '✓']} />,
              hint: <><b>It looked at every single one.</b> Four characters, four digits, so it is True.</>,
            },
            {
              code: 'pin = "4748"\nprint(pin.isdigit())',
              lines: { 2: 'mark' },
              out: 'True',
              figure: <Tiles chars={[...'4748']} look="ok" marks={['✓', '✓', '✓', '✓']} />,
              def: ['str_var.isdigit()', <>Gives <b>True</b> when every single character is a digit. One character that is not, and it is <b>False</b>.</>],
              hint: <><b>Now the name for it.</b> Say it back in your own words before you move.</>,
            },
            {
              code: 'pin = "984a"\nprint(pin.isdigit())',
              lines: { 2: 'mark' },
              out: 'False',
              figure: <Tiles chars={[...'984a']} look={(i) => (i === 3 ? 'bad' : 'ok')} marks={['✓', '✓', '✓', '✗']} />,
              def: ['str_var.isdigit()', <>Gives <b>True</b> when every single character is a digit. One character that is not, and it is <b>False</b>.</>],
              hint: <><b>One character, and the answer changes.</b> 'a' is not a digit, so the whole thing is False.</>,
            },
          ]}
        />
      </Panel>
    ),
  },
  {
    id: 'not-equal',
    section: AGENDA[1].title,
    label: 'Two numbers that are not equal',
    element: (
      <ContentSlide kicker="String Methods" title="Strip" lesson={SESSION}>
        <CenteredLead>Both strings hold the same mobile number. Python still says False.</CenteredLead>
        <NotEqual />
      </ContentSlide>
    ),
  },
  {
    id: 'strip',
    section: AGENDA[1].title,
    label: 'strip',
    element: (
      <Panel kicker="String methods" title="strip" lesson={SESSION}>
        <MethodCard
          beats={[
            {
              code: MOBILE,
              lines: { 2: 'mark' },
              out: '',
              figure: <Tiles chars={[...'  9876543210  ']} />,
              ask: 'Fourteen characters go in. How many come out?',
              hint: <><b>Take a number from the room.</b> Then press, and count them together.</>,
            },
            {
              code: MOBILE,
              lines: { 2: 'mark' },
              out: '9876543210',
              figure: <Tiles chars={[...'  9876543210  ']} gone={[0, 1, 12, 13]} />,
              hint: <><b>14 in, 10 out.</b> All four spaces were at the two ends.</>,
            },
            {
              code: MOBILE,
              lines: { 2: 'mark' },
              out: '9876543210',
              figure: <Tiles chars={[...'  9876543210  ']} gone={[0, 1, 12, 13]} />,
              def: ['str_var.strip()', <>Takes the spaces off the <b>front</b> and off the <b>back</b>. It never touches the middle.</>],
              hint: <><b>It did not change mobile.</b> It handed back a new string, and print showed you that one.</>,
            },
          ]}
        />
      </Panel>
    ),
  },
  {
    id: 'follow-the-strip',
    section: AGENDA[1].title,
    label: 'Where does strip stop?',
    notes: 'A machine, not a slideshow. Pick the set first, have the room write what line 3 prints, then Play. strip("-i") is the one that matters: the dash in the middle is in the set and survives.',
    element: (
      <Panel kicker="One character at a time" title="Where does strip stop?" lesson={SESSION}>
        <StripWalker />
      </Panel>
    ),
  },
  {
    id: 'dot-stays',
    section: AGENDA[1].title,
    label: 'The dot in the middle stays',
    element: (
      <ContentSlide kicker="String Methods" title="Strip" lead='strip(".") removes dots at the two ends only.' lesson={SESSION}>
        <DotStays />
      </ContentSlide>
    ),
  },
  {
    id: 'strip-a-set',
    section: AGENDA[1].title,
    label: 'A set of characters, not a word',
    element: (
      <ContentSlide kicker="String Methods" title="Strip" lead="Give strip a few characters. It removes any of them from the two ends." lesson={SESSION}>
        <StripSet />
      </ContentSlide>
    ),
  },
  {
    id: 'task-3',
    section: AGENDA[1].title,
    label: 'Trace it before you run it',
    notes: 'Worksheet task 3. Nothing moves until hands are off keyboards. Then one press per line: 92 is the output, and lines 6 and 7 never run.',
    element: (
      <Panel kicker="Worksheet task 3" title="Trace it before you run it" lesson={SESSION}>
        <TraceTask />
      </Panel>
    ),
  },
  {
    id: 'spelling-scenario',
    section: AGENDA[1].title,
    label: 'The same mistake in a long document',
    element: (
      <ContentSlide kicker="Scenario" title="String Methods" lesson={SESSION}>
        <CenteredLead>There is a spelling mistake in a document. We have to replace "teh" with the correct spelling.</CenteredLead>
        <SpellingScenario />
      </ContentSlide>
    ),
  },
  {
    id: 'replace',
    section: AGENDA[1].title,
    label: 'replace',
    element: (
      <Panel kicker="String methods" title="replace" lesson={SESSION}>
        <MethodCard
          beats={[
            {
              code: NOTES,
              lines: { 2: 'mark' },
              out: '',
              figure: <WordSwap words={WORDS} swapped={false} />,
              ask: 'The word teh is in there twice. Does it fix one of them, or both?',
              hint: <><b>Ask for a show of hands: one, or both.</b> Do not say which. Then press.</>,
            },
            {
              code: NOTES,
              lines: { 2: 'mark' },
              out: 'the cat and the dog',
              figure: <WordSwap words={WORDS} swapped />,
              hint: <><b>Both of them.</b> 2 changed, three words untouched. It goes all the way to the end of the line.</>,
            },
            {
              code: NOTES,
              lines: { 2: 'mark' },
              out: 'the cat and the dog',
              figure: <WordSwap words={WORDS} swapped />,
              def: ['str_var.replace(old, new)', <>Swaps <b>every</b> one it finds, not only the first. Nothing else in the line is touched.</>],
              hint: <><b>Two things in the brackets now.</b> The one to look for first, the one to put there second.</>,
            },
          ]}
        />
      </Panel>
    ),
  },
  {
    id: 'startswith',
    section: AGENDA[1].title,
    label: 'startswith',
    element: (
      <Panel kicker="String methods" title="startswith" lesson={SESSION}>
        <MethodCard
          beats={[
            {
              code: URL,
              lines: { 2: 'mark' },
              out: '',
              figure: <FrontCheck front="https://" rest="onthegomodel.com" same />,
              ask: 'Look at what it prints, not at the address. Is it a string, or is it a yes or no?',
              hint: <><b>This is the padlock in your browser bar.</b> Ask what it prints before you press.</>,
            },
            {
              code: URL,
              lines: { 2: 'mark' },
              out: 'True',
              figure: <FrontCheck front="https://" rest="onthegomodel.com" same />,
              hint: <><b>It read the first 8 characters and stopped.</b> They match, so it is True.</>,
            },
            {
              code: URL,
              lines: { 2: 'mark' },
              out: 'True',
              figure: <FrontCheck front="https://" rest="onthegomodel.com" same />,
              def: [
                'str_var.startswith(text)',
                <>Answers one question: does the string <b>begin</b> with that text? You get <b>True</b> or <b>False</b>, never a string.</>,
              ],
              hint: <><b>This one answers a question.</b> With http://onthegomodel.com it would be False.</>,
            },
          ]}
        />
      </Panel>
    ),
  },
  {
    id: 'task-4',
    section: AGENDA[1].title,
    label: 'Your turn: check the other end',
    notes: 'Worksheet task 4. Two minutes. The answer changes one word: startswith becomes endswith.',
    element: (
      <Panel kicker="Worksheet task 4" title="You write this one" lesson={SESSION} mode="center">
        <WriteItTask />
      </Panel>
    ),
  },
  {
    id: 'upper-lower',
    section: AGENDA[1].title,
    label: 'upper, and lower is its mirror',
    element: (
      <Panel kicker="String methods" title="upper and lower" lesson={SESSION}>
        <MethodCard
          beats={[
            {
              code: NAME,
              lines: { 2: 'mark' },
              out: '',
              figure: <Tiles chars={[...'Ravi']} />,
              ask: 'Every letter, in place. What does line 2 print?',
              hint: <><b>The easiest one today.</b> Take it fast and keep moving.</>,
            },
            {
              code: NAME,
              lines: { 2: 'mark' },
              out: 'RAVI',
              figure: <Tiles chars={[...'RAVI']} look="hit" />,
              hint: <><b>Ravi went in, RAVI came out.</b> name still holds the one you typed.</>,
            },
            {
              code: NAME,
              lines: { 2: 'mark' },
              out: 'RAVI',
              figure: <Tiles chars={[...'RAVI']} look="hit" />,
              def: ['str_var.upper()', <>Hands back a new string with every letter capital. <b>lower</b> is the same method the other way round.</>],
              hint: <><b>One job, two directions.</b> Ask what line 3 will print before you press.</>,
            },
            {
              /* The program prints BOTH lines, so the output panel shows both:
                 the reference showed only "ravi" here, which is not what running
                 this program prints (course rule R3). */
              code: NAME,
              lines: { 2: 'ran', 3: 'mark' },
              out: 'RAVI\nravi',
              figure: <Tiles chars={[...'ravi']} look="ok" />,
              def: ['str_var.upper()', <>Hands back a new string with every letter capital. <b>lower</b> is the same method the other way round.</>],
              hint: <><b>Line 3 prints ravi.</b> Same method, the other way round.</>,
            },
          ]}
        />
      </Panel>
    ),
  },

  /* ── 27 to 29 · Where It Stops, and the close ────────────────────── */
  {
    id: 'exit-question',
    section: AGENDA[2].title,
    label: 'Which one prints nothing?',
    notes: 'Two and a half minutes. Hands up for A to D before Reveal answer. B strips to 4-748: the middle dash is never reached, isdigit is False, nothing prints.',
    /* A content frame that asks, not a QuestionSlide: the question needs the
       program in front of the room to be answerable, and QuestionSlide carries
       the question and nothing else (content rule 16 names this fallback). */
    element: (
      <Panel
        kicker="Exit question"
        title="Which one prints nothing?"
        lead={<>An app asks for a 4 digit PIN. For which one of these does the screen show <b className="text-ink">nothing at all</b>?</>}
        lesson={SESSION}
      >
        <ExitQuestion />
      </Panel>
    ),
  },
  {
    id: 'takeaways-slicing',
    section: 'Key takeaways',
    label: 'Slicing, in four lines',
    element: (
      <Panel kicker="Key takeaways" title="Slicing, in four lines" lesson={SESSION}>
        {/* The reference reads "range did this last session. A slice does it
            today." Content rule 2b bans "last session" on a slide, so the
            sentence says what range did instead of when. */}
        <SlicingTakeaways lastLine="range stops before its end number. A slice does too." />
      </Panel>
    ),
  },
  {
    id: 'takeaways-methods',
    section: 'Key takeaways',
    label: 'Five methods, five lines',
    /* The reference's title, "The five methods, and what each one hands back",
       wraps onto two lines at the kit's heading size. Content rule 35: shorten
       the words, never shrink the type. */
    element: (
      <Panel kicker="Key takeaways" title="Five methods, and what each hands back" lesson={SESSION}>
        <MethodTakeaways />
      </Panel>
    ),
  },

  /* ── 30, 31 · Close ──────────────────────────────────────────────── */
  {
    id: 'feedback',
    section: 'Close',
    label: 'Feedback',
    element: <FeedbackSlide lesson={SESSION} title="We’d love your feedback" />,
  },
  {
    id: 'thank-you',
    section: 'Close',
    label: 'Thank you',
    transition: 'zoom',
    element: <ThankYouSlide title="Thank you!" />,
  },
]

