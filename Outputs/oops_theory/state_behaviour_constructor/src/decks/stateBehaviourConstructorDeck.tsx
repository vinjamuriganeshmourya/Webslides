import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  CodeSyntaxSlide,
  ContentNoteSlide,
  ContentSlide,
  FeedbackSlide,
  KeyTakeawaysSlide,
  PracticeSlide,
  QuestionSlide,
  QuizTimeSlide,
  SectionBreakerImageSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import {
  CodeOutput,
  DataTable,
  ObjectState,
  ObjectStateRow,
  StateChange,
} from '@/ui'

/*
  THE FIGURE FAMILIES, IMPORTED BY PATH ON PURPOSE.

  `src/ui/points`, `src/ui/pseudocode`, `src/ui/features` and `src/ui/flowchart`
  are kit folders that are deliberately NOT on the `@/ui` barrel. Each offers a
  CHOICE between designs behind one contract, and the barrel's own comment says
  choosing should be a deliberate act at the import line rather than a name that
  arrives with everything else. So every import below is a decision, and §5 of the
  plan records why each one beat its siblings.
*/
import { LeadAndRest } from '@/ui/points/LeadAndRest'
import { PeerCards } from '@/ui/points/PeerCards'
import { RuleStack } from '@/ui/points/RuleStack'
import { LineAnnotated } from '@/ui/pseudocode/LineAnnotated'
import { TraceTable } from '@/ui/pseudocode/TraceTable'
import { EditorialList } from '@/ui/features/EditorialList'
import { LayerAnatomy } from '@/ui/features/LayerAnatomy'
import { GateFlow } from '@/ui/flowchart/GateFlow'

/*
  ON TRIAL, AND SESSION-OWNED.

  `TermGrid`, `TermLede` and `BandSplit` come from `slide-kit/definitions-lab`,
  where no winner has been picked yet. They live under `src/ui/trial/` rather
  than being imported from `@/ui` because they are not kit components:
  `sync-kit.mjs` never touches that folder, so nothing there can be silently
  overwritten and nothing there is claimed as approved. Same footing the
  points-lab variants had in `deployement_session_2_v2`.

  `ObjectState`, `StateChange` and `CodeOutput` started here too, and are now in
  the kit and imported from `@/ui` above. A promoted component keeps NO private
  copy in the session that built it, or the two drift. `ImageBreaker` is gone
  outright: the kit's `SectionBreakerImageSlide` no longer draws into the
  instructor-video rectangle, which is the only reason it existed.
*/
import { BandSplit } from '@/ui/trial/definitions/BandSplit'
import { TermGrid } from '@/ui/trial/definitions/TermGrid'
import { TermLede } from '@/ui/trial/definitions/TermLede'

/**
 * OOPs Theory · Session 2 "State, Behaviour & Constructor"
 *
 * Content is the signed-off plan at
 *   `oops_theory/session_plans/state_behaviour_constructor/plan.md`
 * (SIGNED OFF 2026-09-11, on decisions A and B in its §9), sourced from
 *   `Reference ppt's/2. State, Behaviour & Constructor.pdf` (59 slides)
 * and its identical `.pptx`.
 *
 * SEVEN RULES GOVERN THIS FILE. Each is easy to break by accident, so each is
 * restated where it bites.
 *
 *   R1 NO LANGUAGE IS NAMED. The source teaches OOP in pseudocode and that is
 *      the whole point: `NEW Book(...)` is not Python, Java or JavaScript. No
 *      slide shows a real language, a file path, a terminal or a tech logo, so
 *      hard rules 3, 11 and 12 have no work to do here and none of them is
 *      satisfied by accident. The room meets a language next term, not today.
 *
 *   R2 NO SPACED EM DASH in any rendered string. Comma, colon, full stop or
 *      parentheses. Applies to titles, leads, bullets, captions, table cells,
 *      definitions, notes and every label a figure draws. JSX comments are
 *      exempt.
 *
 *   R3 THE KICKER IS THE CONCEPT, ON EVERY CONTENT SLIDE, and it is one of the
 *      four the agenda promised plus the applied section. Hard rule 19: the
 *      kicker and title are the room's answer to "where am I", and an answer
 *      that moves between slides is not an answer.
 *
 *   R4 EIGHT PSEUDOCODE LINES IS THE CEILING for `LineAnnotated`, which is
 *      arithmetic and not taste: its stage is 400px, the frame around the rows
 *      costs 96px, and a row is 34px, so nine lines is 306px against 304px of
 *      room and the figure refuses to draw. The source's twelve and fourteen
 *      line listings are therefore split, one method per slide, which is hard
 *      rule 5 arriving by a different door.
 *
 *   R5 KEY TAKEAWAYS RESTATES THE AGENDA WORD FOR WORD. Hard rule 20. The four
 *      strings live in `CONCEPTS` below and both slides read from it, so they
 *      cannot drift.
 *
 *   R6 OUTPUT IS A DRY RUN, AND IT SAYS SO. Nothing here was executed, because
 *      pseudocode has no interpreter. Every printed line comes from a PRINT
 *      statement shown earlier in this deck, and the pane is labelled "What it
 *      prints". See the header of `src/ui/trial/CodeOutput.tsx`.
 *
 *   R7 THE OBJECT CARDS ARE DOM, NOT SVG. Content rule 17: all three harnesses
 *      measure DOM rectangles and an `<svg>` is one rectangle to every one of
 *      them, so a figure made of labels is made of real nodes. This is why
 *      `ObjectState` and `StateChange` are divs.
 */

export const stateBehaviourConstructorMeta: DeckMeta = {
  title: 'State, Behaviour & Constructor',
  course: 'NxtWave · OOPs Theory',
  lesson: 'State, Behaviour & Constructor',
  presenter: 'NxtWave Instructor',
}

/** Footer text on every slide: the session name, never "Session 2". */
const SESSION = 'State, Behaviour & Constructor'

/**
 * The four concepts, written once.
 *
 * R5: the agenda promises these and Key Takeaways repeats them verbatim. Two
 * slides reading one array is the only way that stays true through an edit.
 * "Building a Library Project" is deliberately NOT here: it is the four applied
 * rather than a fifth concept, and hard rule 20 caps the agenda at four. It
 * keeps its divider and gets no agenda line. Plan §9, decision A.
 */
const CONCEPTS = ['State', 'Behaviour', 'Constructor', 'this Keyword'] as const

/* The dividers' art. unDraw, open licence, fetched into `slide-kit/assets/
   illustrations/` first (hard rule 13) and copied here byte-identical. Literal
   paths, never built: `scripts/inline-assets.mjs` finds an asset by scanning the
   bundle for its path TEXT, so a path assembled at runtime is not in the bundle
   and cannot be inlined. The first pass of the Python session shipped that bug
   and reported "Inlined 10/10" with twenty-nine broken images. */
const ART = {
  state: '/assets/illustrations/divider-switches_atb7.svg',
  behaviour: '/assets/illustrations/divider-tasks_l9ct.svg',
  constructor: '/assets/illustrations/divider-setup_fzje.svg',
  thisKeyword: '/assets/illustrations/divider-my-location_dcug.svg',
  library: '/assets/illustrations/divider-bookshelves_vhu6.svg',
} as const

/* The book every example uses, so the values cannot drift between slides. */
const HARRY = '"Harry Potter"'
const ROWLING = '"Rowling"'
const ATOMIC = '"Atomic Habits"'
const CLEAR = '"Clear"'

export const stateBehaviourConstructorDeck: SlideDef[] = [
  /* ---------------------------------------------------------------- */
  /* Front frame                                                       */
  /* ---------------------------------------------------------------- */
  {
    id: 'brand',
    label: 'Brand',
    /* Hard rule 21: the welcome line is written ONCE, on the next slide.
       `BrandSlide` says something else or the deck opens by repeating itself. */
    element: <BrandSlide greeting="Welcome!" lesson={SESSION} />,
    notes: 'Welcome to the session.',
  },
  {
    id: 'welcome',
    label: 'Welcome',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
  },
  {
    id: 'recap',
    label: 'Where we Left Off',
    section: 'Recap',
    element: (
      <ContentSlide
        kicker="Recap"
        title="Where we Left Off"
        lead="Six words from last session. Today builds directly on all six"
        lesson={SESSION}
      >
        {/*
          `TermGrid` and nothing else in the definitions lab, and the lab's own
          doc comment says why: it is the only variant that survives six terms,
          and it is RIGHT for a recap of words the room has already met and WRONG
          for introducing anything. Every term here is 16 characters or fewer
          because the variant's term gutter is 170px, and a term that wraps makes
          one row half again as tall as the two under it.
        */}
        <TermGrid
          width={1100}
          terms={[
            {
              id: 'oop',
              term: 'OOP',
              definition:
                'Object-Oriented Programming. Organising code around objects that hold data and do work',
            },
            {
              id: 'without',
              term: 'The Problem',
              definition:
                'Data sits apart from the code that uses it, so one change means edits in many places',
            },
            {
              id: 'class',
              term: 'Class',
              definition:
                'The blueprint. It names what every object of its kind will know and be able to do',
            },
            {
              id: 'object',
              term: 'Object',
              definition: 'The real thing built from a class. It exists, holds values, and can be used',
            },
            {
              id: 'many',
              term: 'Many Objects',
              definition: 'One class builds as many objects as you need, and each one is independent',
            },
            {
              id: 'realworld',
              term: 'OOP Around You',
              definition: 'Banking, games and shopping apps: the systems people use are built this way',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Six words, one line each. Do not re-teach them. The only one to dwell on is Object, because today is entirely about what an object holds and what it can do.',
  },
  {
    id: 'agenda',
    label: 'Agenda',
    element: (
      <AgendaSlide
        title="Today's Agenda"
        lesson={SESSION}
        /* R5: these strings are `CONCEPTS`, and Key Takeaways reads the same
           array. Hard rule 20 wants them identical, so neither slide owns them. */
        items={[
          { title: CONCEPTS[0], sub: 'What an object knows right now' },
          { title: CONCEPTS[1], sub: 'What an object can do' },
          { title: CONCEPTS[2], sub: 'The method that sets the first values' },
          { title: CONCEPTS[3], sub: 'Which object am I talking about' },
        ]}
      />
    ),
  },

  /* ---------------------------------------------------------------- */
  /* Concept 1 — State                                                 */
  /* ---------------------------------------------------------------- */
  {
    id: 'break-state',
    label: '01 State',
    section: CONCEPTS[0],
    element: (
      <SectionBreakerImageSlide
        index={1}
        title={CONCEPTS[0]}
        subtitle="What an object knows right now"
        lesson={SESSION}
        media={{ src: ART.state, alt: 'Toggle switches, each showing its current position' }}
      />
    ),
    notes: 'First we will start with State.',
  },
  {
    id: 'fan-state',
    label: 'Fan, right now',
    section: CONCEPTS[0],
    element: (
      <ContentSlide
        kicker={CONCEPTS[0]}
        title="Real-world Example"
        lead="Think about a fan in a room. At any moment it has some current information"
        lesson={SESSION}
        points={[
          { text: 'A brand it was made by' },
          { text: 'A speed it is running at' },
          { text: 'A switch that is on or off' },
        ]}
      >
        <ObjectState
          name="Fan Right Now"
          width={300}
          rows={[
            { name: 'brand', value: '"Havells"' },
            { name: 'speed', value: '3' },
            { name: 'switchedOn', value: 'true' },
          ]}
          caption="Three values, and together they are everything the fan is at this moment"
        />
      </ContentSlide>
    ),
    notes:
      'Point at the fan in the room if there is one. The values are true of it right now and would be different an hour ago.',
  },
  {
    id: 'q-state',
    label: 'Question: what is this?',
    section: CONCEPTS[0],
    /* Hard rule 16: the question and nothing else, and the answer is the next
       slide. The room says the word out loud before it is given to them. */
    element: (
      <QuestionSlide
        kicker={CONCEPTS[0]}
        question="Everything the fan is right now, in three values. What do we call that?"
        lesson={SESSION}
      />
    ),
    notes: 'Take answers. Somebody will say "settings" or "status". Both are close enough to build on.',
  },
  {
    id: 'state-def',
    label: 'State',
    section: CONCEPTS[0],
    element: (
      <ContentSlide
        kicker={CONCEPTS[0]}
        title="What is State?"
        lead="The word for everything the fan was holding on the last slide"
        lesson={SESSION}
      >
        {/*
          `TermLede` and not `GlyphAnchor` or `BandSplit`: one term alone on the
          frame, no example to place and no sibling to be told apart from. This is
          the variant with no card at all, so the definition gets the widest
          measure in the lab and the term gets display size rather than heading
          size. 820px rather than the default 1152 because a single column of
          prose at full well width is a newspaper column read from twelve metres.
        */}
        <TermLede
          width={760}
          terms={[
            {
              id: 'state',
              term: 'State',
              gloss: 'what it knows',
              tone: 'new',
              definition:
                'The current information an object holds right now. It can change over time as actions happen, which is what the rest of this session is about.',
            },
          ]}
          caption="Every object has one, and no two objects have to agree about it"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'state-examples',
    label: 'Examples of state',
    section: CONCEPTS[0],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[0]}
        title="Real-world Examples of State"
        lead="Three everyday objects, and what each of them knows about itself"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'The word for it',
          body: 'In OOP, state is stored in attributes. You will also hear them called data, or fields. Three names, one thing.',
        }}
      >
        {/* Three cards of one shape, because the claim is that these are three
            objects of one kind. `ObjectStateRow` staggers them so the room reads
            one, then the next, rather than meeting nine values at once. */}
        <ObjectStateRow
          objects={[
            {
              name: 'Book',
              width: 268,
              rows: [
                { name: 'title', value: HARRY },
                { name: 'author', value: ROWLING },
                { name: 'available', value: 'true' },
              ],
            },
            {
              name: 'Phone',
              width: 268,
              rows: [
                { name: 'brand', value: '"Samsung"' },
                { name: 'battery', value: '80' },
                { name: 'switchedOn', value: 'true' },
              ],
            },
            {
              name: 'BankAccount',
              width: 268,
              rows: [
                { name: 'holder', value: '"Ali"' },
                { name: 'balance', value: '50000' },
              ],
            },
          ]}
        />
      </ContentNoteSlide>
    ),
  },
  {
    id: 'state-pseudocode',
    label: 'Pseudocode: attributes',
    section: CONCEPTS[0],
    element: (
      <ContentSlide
        kicker={CONCEPTS[0]}
        title="Pseudocode"
        lead="Here is the Book class, written down. Nothing it can DO yet, only what it knows"
        lesson={SESSION}
      >
        {/*
          `LineAnnotated` and not `TraceTable`: the question on this slide is what
          each line MEANS, not what the values are, and there is nothing running
          yet to have values. `CodeBlock` cannot hold a per-line note at all,
          which is the gap this variant exists to fill.
        */}
        <LineAnnotated
          title="The Book class"
          lines={[
            { n: 1, text: 'CLASS Book:', kind: 'plain' },
            {
              n: 2,
              text: 'ATTRIBUTES:',
              indent: 1,
              kind: 'assign',
              note: 'This is the STATE. Everything below is something a book knows about itself',
            },
            { n: 3, text: 'title', indent: 2, note: 'The name on the cover' },
            { n: 4, text: 'author', indent: 2, note: 'Who wrote it' },
            {
              n: 5,
              text: 'available',
              indent: 2,
              note: 'Whether it is on the shelf. This is the one that will move later',
            },
            { n: 6, text: 'END CLASS', kind: 'plain' },
          ]}
          caption="The class names the attributes. It does not give them values: that comes later"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'state-per-object',
    label: 'Each object, its own state',
    section: CONCEPTS[0],
    element: (
      <ContentSlide
        kicker={CONCEPTS[0]}
        title="Pseudocode"
        lead="Each object created from this class carries its own state"
        lesson={SESSION}
      >
        <ObjectStateRow
          objects={[
            {
              name: 'book1',
              width: 330,
              rows: [
                { name: 'title', value: HARRY },
                { name: 'author', value: ROWLING },
                { name: 'available', value: 'true' },
              ],
            },
            {
              name: 'book2',
              width: 330,
              rows: [
                { name: 'title', value: ATOMIC },
                { name: 'author', value: CLEAR },
                { name: 'available', value: 'true' },
              ],
              caption: 'One class, two objects, two separate sets of values',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The sentence to say out loud: the state of book1 is different from the state of book2. Each object is independent.',
  },

  /* ---------------------------------------------------------------- */
  /* Concept 2 — Behaviour                                             */
  /* ---------------------------------------------------------------- */
  {
    id: 'break-behaviour',
    label: '02 Behaviour',
    section: CONCEPTS[1],
    element: (
      <SectionBreakerImageSlide
        index={2}
        title={CONCEPTS[1]}
        subtitle="What an object can do"
        lesson={SESSION}
        media={{ src: ART.behaviour, alt: 'A list of things that can be done' }}
      />
    ),
    notes: 'Back to the same fan, and this time what it can do rather than what it is.',
  },
  {
    id: 'fan-actions',
    label: 'Fan, what it can do',
    section: CONCEPTS[1],
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="Real-world Example"
        lead="The same fan also has actions it can perform"
        lesson={SESSION}
      >
        {/*
          `EditorialList` from the features lab, `numbered` off by default.
          STYLE_GUIDE §8: when the NAMES are the content, a card around each costs
          the name its size, and these four actions have no order, so numbering
          them would claim a sequence the fan does not have.
        */}
        <EditorialList
          items={[
            { id: 'on', label: 'Switch On', body: 'The fan starts running' },
            { id: 'off', label: 'Switch Off', body: 'The fan stops' },
            { id: 'up', label: 'Increase Speed', body: 'Speed goes up by one' },
            { id: 'down', label: 'Decrease Speed', body: 'Speed goes down by one' },
          ]}
          caption="Here is the part that matters: perform one of these and the fan's information changes"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'behaviour-def',
    label: 'Behaviour',
    section: CONCEPTS[1],
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="What is Behaviour?"
        lead="The word for the four things that fan could do"
        lesson={SESSION}
      >
        <TermLede
          width={760}
          terms={[
            {
              id: 'behaviour',
              term: 'Behaviour',
              gloss: 'what it can do',
              tone: 'new',
              definition:
                'What an object can do: the actions it can perform. When one of them runs, it usually reads or changes the object’s own state.',
            },
          ]}
          caption="State is a noun, behaviour is a verb, and the verb moves the noun"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'behaviour-examples',
    label: 'Examples of behaviour',
    section: CONCEPTS[1],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[1]}
        title="Real-world Examples of Behaviour"
        lead="The same three objects, and what each of them can do"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'The word for it',
          body: 'In OOP, behaviour is written as methods: functions that live inside a class.',
        }}
      >
        {/*
          `PeerCards` and not `RuleStack`: these three are things of one kind with
          no leader and no order, and boxes of one size are the honest claim when
          that is true. `RuleStack` would state a sequence that is not there,
          which is the weakness its own doc names.
        */}
        <PeerCards
          width={920}
          points={[
            { id: 'book', label: 'Book', icon: 'book', body: 'borrow(), returnBook(), display()' },
            {
              id: 'phone',
              label: 'Phone',
              icon: 'devices',
              body: 'makeCall(), takePhoto(), chargeBattery()',
            },
            {
              id: 'bank',
              label: 'Bank Account',
              icon: 'lock',
              body: 'deposit(), withdraw(), checkBalance()',
            },
          ]}
        />
      </ContentNoteSlide>
    ),
  },
  {
    id: 'behaviour-pseudocode',
    label: 'Pseudocode: methods',
    section: CONCEPTS[1],
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="Pseudocode"
        lead="The same Book class, now with the things it can do"
        lesson={SESSION}
      >
        <LineAnnotated
          title="The Book class"
          lines={[
            { n: 1, text: 'CLASS Book:', kind: 'plain' },
            { n: 2, text: 'ATTRIBUTES:', indent: 1, kind: 'assign' },
            {
              n: 3,
              text: 'title, author, available',
              indent: 2,
              note: 'The state, unchanged from the last three slides',
            },
            {
              n: 4,
              text: 'METHODS:',
              indent: 1,
              kind: 'call',
              note: 'This is the BEHAVIOUR. Everything below is something a book can do',
            },
            { n: 5, text: 'borrow()', indent: 2, note: 'Somebody takes it off the shelf' },
            { n: 6, text: 'returnBook()', indent: 2, note: 'Somebody brings it back' },
            { n: 7, text: 'display()', indent: 2, note: 'Print what we know about it' },
            { n: 8, text: 'END CLASS', kind: 'plain' },
          ]}
          caption="One class holds both halves: what a book knows, and what a book can do"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'change-borrow',
    label: 'borrow() changes state',
    section: CONCEPTS[1],
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="State Changes As Behaviour Happens"
        lead="Example: borrowing a book"
        lesson={SESSION}
      >
        {/*
          The figure that carries this concept's whole argument. Which rows moved
          is COMPUTED from the two sides rather than authored, so the mark cannot
          disagree with the values printed under it.
        */}
        <StateChange
          before={{
            name: 'book1',
            rows: [
              { name: 'title', value: HARRY },
              { name: 'author', value: ROWLING },
              { name: 'available', value: 'true' },
            ],
          }}
          action="borrow()"
          after={{
            name: 'book1',
            rows: [
              { name: 'title', value: HARRY },
              { name: 'author', value: ROWLING },
              { name: 'available', value: 'false' },
            ],
          }}
          caption="One method ran and one value moved. The title and the author are exactly as they were"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'change-deposit',
    label: 'deposit() changes state',
    section: CONCEPTS[1],
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="State Changes As Behaviour Happens"
        lead="Example: a bank account"
        lesson={SESSION}
      >
        <StateChange
          before={{
            name: 'account1',
            rows: [
              { name: 'holder', value: '"Ali"' },
              { name: 'balance', value: '50000' },
            ],
          }}
          action="deposit(5000)"
          after={{
            name: 'account1',
            rows: [
              { name: 'holder', value: '"Ali"' },
              { name: 'balance', value: '55000' },
            ],
          }}
          caption="A different object, a different method, and the same rule underneath"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'the-rule-state-behaviour',
    label: 'State vs behaviour',
    section: CONCEPTS[1],
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="The Rule"
        lead="Two halves of one class, and only one of them moves"
        lesson={SESSION}
      >
        {/*
          `DataTable`, and this is the one slide in the deck where it is right.
          Three identical row labels across two columns with fragment cells is a
          comparison, which is what a table is FOR. Every other set in this deck
          went to a figure instead.
        */}
        <DataTable
          columns={[
            { label: '', weight: 0.7 },
            { label: 'State (Attributes)' },
            { label: 'Behaviour (Methods)' },
          ]}
          rows={[
            [
              'What it is',
              'The data an object holds right now',
              'The actions an object can perform',
            ],
            ['Does it change?', 'Yes, whenever a method runs', 'No, the methods stay the same'],
            ['Example', 'available: true becomes false', 'borrow() always does the same job'],
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'starting-state',
    label: 'Who sets the first values?',
    section: CONCEPTS[1],
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="Setting Up the Starting State"
        lead="Methods move the values. But something has to put the first ones there"
        lesson={SESSION}
      >
        {/*
          `RuleStack` and not `PeerCards`: these three rows ARE a sequence, and
          the third is the answer the other two build to. That is the one case
          where ordered full-width rows are honest rather than invented.
        */}
        <RuleStack
          width={900}
          points={[
            {
              id: 'need',
              label: 'A new book needs values',
              body: 'A title, an author, and available set to true, from the moment it exists',
            },
            {
              id: 'auto',
              label: 'One method runs on its own',
              body: 'It fires the instant the object is created, without anybody calling it',
            },
            {
              id: 'name',
              label: 'That method has a name',
              tone: 'lead',
              tag: 'the answer',
              body: 'It is called a constructor, and it is the whole of the next section',
            },
          ]}
        />
      </ContentSlide>
    ),
  },

  /* ---------------------------------------------------------------- */
  /* Concept 3 — Constructor                                           */
  /* ---------------------------------------------------------------- */
  {
    id: 'break-constructor',
    label: '03 Constructor',
    section: CONCEPTS[2],
    element: (
      <SectionBreakerImageSlide
        index={3}
        title={CONCEPTS[2]}
        subtitle="The method that sets the first values"
        lesson={SESSION}
        media={{ src: ART.constructor, alt: 'A setup completing' }}
      />
    ),
  },
  {
    id: 'constructor-def',
    label: 'Constructor',
    section: CONCEPTS[2],
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="Constructor"
        lead="A special method, and three things are true of it"
        lesson={SESSION}
      >
        <RuleStack
          width={900}
          points={[
            {
              id: 'auto',
              label: 'It runs automatically',
              body: 'The moment a new object is created, and not a moment before',
            },
            {
              id: 'sets',
              label: 'It sets the starting state',
              body: 'The first value of every attribute the object will carry',
            },
            {
              id: 'never',
              label: 'We never call it ourselves',
              body: 'There is no line anywhere that says run the constructor now',
            },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'constructor-call',
    label: 'The call',
    section: CONCEPTS[2],
    element: (
      <CodeSyntaxSlide
        kicker={CONCEPTS[2]}
        title="How the Constructor Works"
        lead="This is the line we write. Every part of it does a job"
        lesson={SESSION}
        language="Pseudocode"
        stepped
        /*
          `CodeSyntaxSlide` and not `CodeBuildSlide`: this is the SHAPE of a
          construct, slot by slot, and nothing is being run or built into a file.
          The registry's own table calls picking the wrong quadrant here the
          commonest way this content ships wrong.
        */
        parts={[
          {
            token: 'book1 =',
            label: 'The new object',
            body: 'The name we use to reach it afterwards',
          },
          { token: 'NEW', label: 'The trigger', body: 'This word is what calls the constructor' },
          { token: 'Book', label: 'Which class', body: 'The blueprint to build from' },
          {
            token: '("Harry Potter", "Rowling", true)',
            label: 'The starting values',
            body: 'Handed straight to the constructor, in this order',
          },
        ]}
        note={{
          kind: 'tip',
          title: 'Nobody calls the constructor',
          body: 'NEW triggers it automatically. There is no line in this deck that names it and runs it.',
        }}
      />
    ),
  },
  {
    id: 'constructor-body',
    label: 'Inside the constructor',
    section: CONCEPTS[2],
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="How the Constructor Works"
        lead="Inside the class, the constructor receives those three values"
        lesson={SESSION}
      >
        <LineAnnotated
          title="The constructor"
          lines={[
            {
              n: 1,
              text: 'CONSTRUCTOR(title, author, available):',
              kind: 'call',
              note: 'The three values arrive here, in the order they were written',
            },
            { n: 2, text: 'set this.title = title', indent: 1, kind: 'assign', note: HARRY },
            { n: 3, text: 'set this.author = author', indent: 1, kind: 'assign', note: ROWLING },
            { n: 4, text: 'set this.available = available', indent: 1, kind: 'assign', note: 'true' },
          ]}
          caption="This runs on its own. We do not call it ourselves"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'constructor-result',
    label: 'book1 is ready',
    section: CONCEPTS[2],
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="How the Constructor Works"
        lead="The constructor has finished. book1 is ready to use"
        lesson={SESSION}
      >
        <ObjectState
          name="book1"
          width={360}
          rows={[
            { name: 'title', value: HARRY },
            { name: 'author', value: ROWLING },
            { name: 'available', value: 'true' },
          ]}
          caption="Three attributes, three values, set by a method nobody called"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'constructor-writing',
    label: 'Writing the Constructor',
    section: CONCEPTS[2],
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="Writing the Constructor"
        lead="In the real Book class, one of the three values is not passed in at all"
        lesson={SESSION}
      >
        <LineAnnotated
          title="The Book constructor"
          lines={[
            {
              n: 1,
              text: 'CONSTRUCTOR(title, author):',
              kind: 'call',
              note: 'Two parameters now, not three. available is missing on purpose',
            },
            { n: 2, text: 'this.title = title', indent: 1, kind: 'assign' },
            { n: 3, text: 'this.author = author', indent: 1, kind: 'assign' },
            {
              n: 4,
              text: 'this.available = true',
              indent: 1,
              kind: 'assign',
              note: 'Every new book starts on the shelf, so the constructor sets this itself rather than asking',
            },
          ]}
          caption="A constructor can decide a value as well as receive one"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'quiz-1',
    label: 'Quiz Time!',
    section: CONCEPTS[2],
    element: (
      <QuizTimeSlide
        lesson={SESSION}
        subtitle="What an object knows, what it can do, and the method that sets its first values"
      />
    ),
  },

  /* ---------------------------------------------------------------- */
  /* Concept 4 — the this keyword                                      */
  /* ---------------------------------------------------------------- */
  {
    id: 'break-this',
    label: '04 this Keyword',
    section: CONCEPTS[3],
    element: (
      <SectionBreakerImageSlide
        index={4}
        title={CONCEPTS[3]}
        subtitle="Which object am I talking about"
        lesson={SESSION}
        media={{ src: ART.thisKeyword, alt: 'A map pin marking where you are' }}
      />
    ),
  },
  {
    id: 'this-problem',
    label: 'The problem',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="The Problem"
        lead="Take this out of the constructor and look at what is left"
        lesson={SESSION}
      >
        <LineAnnotated
          title="The constructor, without this"
          lines={[
            { n: 1, text: 'CONSTRUCTOR(title, author):', kind: 'call' },
            {
              n: 2,
              text: 'title = title',
              indent: 1,
              kind: 'assign',
              note: 'Which title is which? Both sides are spelled exactly the same',
            },
            { n: 3, text: 'author = author', indent: 1, kind: 'assign', note: 'And the same problem again' },
          ]}
          caption="Written this way the line says nothing, because both names point at the same thing"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'q-this',
    label: 'Question: which title?',
    section: CONCEPTS[3],
    element: (
      <QuestionSlide
        kicker={CONCEPTS[3]}
        question="How does the code know which title we mean?"
        qualifier="The value coming in and the value being stored have the same name"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'two-names',
    label: 'Two things, one name',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Two Things, One Name"
        lead="There are two different things here and both are called title"
        lesson={SESSION}
      >
        {/*
          `BandSplit` with both terms at `tone: 'contrast'`, which is the tone
          written for exactly this case: a pair that exists to be told APART, read
          as two things rather than as two weights of one thing. This is the slide
          the definitions lab's contrast stop was made for.
        */}
        <BandSplit
          width={960}
          terms={[
            {
              id: 'parameter',
              term: 'Parameter',
              gloss: 'the value coming in',
              tone: 'contrast',
              definition:
                'The value handed to the constructor from outside when the object is created. It exists only while the method runs.',
            },
            {
              id: 'attribute',
              term: 'Attribute',
              gloss: 'the value staying put',
              tone: 'contrast',
              definition:
                'The data that belongs to the object itself. It stays with the object long after the constructor has finished.',
            },
          ]}
          caption="One is a visitor and one is a resident, and the code needs to tell them apart"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'this-solution',
    label: 'The solution',
    section: CONCEPTS[3],
    element: (
      <CodeSyntaxSlide
        kicker={CONCEPTS[3]}
        title="The Solution"
        lead="this means: the object I belong to"
        lesson={SESSION}
        language="Pseudocode"
        stepped
        parts={[
          {
            token: 'this.title',
            label: 'The attribute',
            body: 'The title belonging to THIS object, the one being created right now',
          },
          { token: '=', label: 'Assignment', body: 'Copy the right side into the left' },
          {
            token: 'title',
            label: 'The parameter',
            body: 'The plain name, so it is the value that came from outside',
          },
        ]}
        note={{
          kind: 'tip',
          title: 'Read it out loud',
          body: 'Set this object’s title to the title I was given.',
        }}
      />
    ),
  },
  {
    id: 'this-book1',
    label: 'this is book1',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="this"
        lead="Create book1, and for the whole of the constructor this means book1"
        lesson={SESSION}
      >
        {/*
          `TraceTable` and not `LineAnnotated`: the question here is what the
          VALUES are, one click at a time, which is the canonical dry run and the
          device this lab exists for. Two variables only, because the trace
          column is 314px shared between them and a third would leave 104px each,
          which does not hold a 14-character string.
        */}
        <TraceTable
          title="Creating book1"
          lines={[
            { n: 1, text: 'book1 = NEW Book("Harry Potter", "Rowling")', kind: 'call' },
            { n: 2, text: 'CONSTRUCTOR(title, author):', kind: 'call' },
            { n: 3, text: 'this.title = title', indent: 1, kind: 'assign' },
            { n: 4, text: 'this.author = author', indent: 1, kind: 'assign' },
          ]}
          vars={['this', "book1's title"]}
          trace={[
            { line: 1, vars: { this: 'book1', "book1's title": 'not set' } },
            { line: 3, vars: { this: 'book1', "book1's title": HARRY } },
            { line: 4, vars: { this: 'book1', "book1's title": HARRY } },
          ]}
          caption="this points at book1 from the first line of the constructor to the last"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'this-book2',
    label: 'this is book2',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="this"
        lead="Create book2 with the same class, and this means something else entirely"
        lesson={SESSION}
      >
        <TraceTable
          title="Creating book2"
          lines={[
            { n: 1, text: 'book2 = NEW Book("Atomic Habits", "Clear")', kind: 'call' },
            { n: 2, text: 'CONSTRUCTOR(title, author):', kind: 'call' },
            { n: 3, text: 'this.title = title', indent: 1, kind: 'assign' },
            { n: 4, text: 'this.author = author', indent: 1, kind: 'assign' },
          ]}
          vars={['this', "book2's title"]}
          trace={[
            { line: 1, vars: { this: 'book2', "book2's title": 'not set' } },
            { line: 3, vars: { this: 'book2', "book2's title": ATOMIC } },
            { line: 4, vars: { this: 'book2', "book2's title": ATOMIC } },
          ]}
          caption="Same three lines of code, a different object, and this followed the object"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'this-rule',
    label: 'The rule',
    section: CONCEPTS[3],
    element: (
      <ContentSlide kicker={CONCEPTS[3]} title="The Rule" lesson={SESSION}>
        {/*
          `LeadAndRest` and not `PeerCards`: this set HAS a lead, and it is read
          off `tone: 'lead'` rather than being promoted by position. The two rows
          under it are the same claim twice with different nouns, which is exactly
          what a support row is for.
        */}
        <LeadAndRest
          points={[
            {
              id: 'rule',
              label: 'this points at the object in use right now',
              tone: 'lead',
              tag: 'the rule',
              icon: 'target',
              body: 'Not the class, not the last object you made. The one this line is running inside',
            },
            {
              id: 'book1',
              label: 'Creating book1',
              icon: 'book',
              body: 'For the whole of that constructor, this means book1',
            },
            {
              id: 'methods',
              label: 'Not only in constructors',
              icon: 'code',
              body: 'this works inside any method, which is the next three slides',
            },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'method-borrow',
    label: 'borrow()',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="borrow()"
        lead="A method that both reads the object's state and changes it"
        lesson={SESSION}
      >
        <LineAnnotated
          title="Inside the Book class"
          lines={[
            { n: 1, text: 'METHOD borrow():', kind: 'call' },
            {
              n: 2,
              text: 'IF this.available == true:',
              indent: 1,
              kind: 'branch',
              note: 'Reads THIS object’s state, and no other object’s',
            },
            {
              n: 3,
              text: 'this.available = false',
              indent: 2,
              kind: 'assign',
              note: 'Changes THIS object’s state. The book is off the shelf now',
            },
            { n: 4, text: 'PRINT this.title + " borrowed"', indent: 2, kind: 'io' },
            { n: 5, text: 'ELSE:', indent: 1, kind: 'branch' },
            {
              n: 6,
              text: 'PRINT this.title + " is not available"',
              indent: 2,
              kind: 'io',
              note: 'Somebody already has it',
            },
            { n: 7, text: 'END IF', indent: 1, kind: 'plain' },
            { n: 8, text: 'END METHOD', kind: 'plain' },
          ]}
          caption="Eight lines, and this appears on four of them"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'borrow-flow',
    label: 'Inside borrow()',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Inside borrow()"
        lead="The same method as a picture. Everything turns on one question"
        lesson={SESSION}
      >
        {/*
          `GateFlow` and not `CircuitMap` or `SpineFlow`: borrow() has exactly one
          decision, and this variant gives it physical extent, a bar the work has
          to pass through with the failing path ejected out of its underside. Its
          named weakness is a SECOND decision, which this method does not have.
          The question is five words, inside the six the gate label holds.
        */}
        <GateFlow
          nodes={[
            { id: 'call', kind: 'start', label: 'book1.borrow()', caption: 'somebody asks for the book' },
            { id: 'check', kind: 'decision', label: 'Is it available?' },
            { id: 'take', kind: 'step', label: 'available = false', caption: 'the shelf is now empty' },
            { id: 'ok', kind: 'end', label: '"Harry Potter borrowed"' },
            { id: 'no', kind: 'end', label: '"Harry Potter is not available"' },
          ]}
          edges={[
            { from: 'call', to: 'check' },
            { from: 'check', to: 'take', label: 'Yes' },
            { from: 'take', to: 'ok' },
            { from: 'check', to: 'no', label: 'No', kind: 'alt' },
          ]}
          caption="Nothing gets past the question without being let through"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'method-return',
    label: 'returnBook()',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="returnBook()"
        lead="The shortest method in the class, and it only changes"
        lesson={SESSION}
      >
        <LineAnnotated
          title="Inside the Book class"
          lines={[
            { n: 1, text: 'METHOD returnBook():', kind: 'call' },
            {
              n: 2,
              text: 'this.available = true',
              indent: 1,
              kind: 'assign',
              note: 'Changes THIS object’s state, straight back to where it started',
            },
            { n: 3, text: 'PRINT this.title + " returned"', indent: 1, kind: 'io' },
            { n: 4, text: 'END METHOD', kind: 'plain' },
          ]}
          caption="No question to ask: a returned book is available again either way"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'method-display',
    label: 'display()',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="display()"
        lead="The opposite: a method that only reads, and changes nothing"
        lesson={SESSION}
      >
        <LineAnnotated
          title="Inside the Book class"
          lines={[
            { n: 1, text: 'METHOD display():', kind: 'call' },
            {
              n: 2,
              text: 'PRINT "Title: " + this.title',
              indent: 1,
              kind: 'io',
              note: 'Reads THIS object’s state',
            },
            { n: 3, text: 'PRINT "Author: " + this.author', indent: 1, kind: 'io' },
            { n: 4, text: 'PRINT "Available: " + this.available', indent: 1, kind: 'io' },
            { n: 5, text: 'END METHOD', kind: 'plain' },
          ]}
          caption="Three values out, nothing moved. The object is exactly as it was"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'q-run',
    label: 'Question: what about book2?',
    section: CONCEPTS[3],
    element: (
      <QuestionSlide
        kicker={CONCEPTS[3]}
        question="book1.borrow() runs. What happens to book2?"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'run-trace',
    label: 'Running It Step by Step',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Running It Step by Step"
        lead="Two books, one borrow, and one display. Watch the two available values"
        lesson={SESSION}
      >
        <TraceTable
          title="Two objects, four lines"
          lines={[
            { n: 1, text: 'book1 = NEW Book("Harry Potter", "Rowling")', kind: 'call' },
            { n: 2, text: 'book2 = NEW Book("Atomic Habits", "Clear")', kind: 'call' },
            { n: 3, text: 'book1.borrow()', kind: 'call' },
            { n: 4, text: 'book2.display()', kind: 'call' },
          ]}
          vars={['book1.available', 'book2.available']}
          trace={[
            { line: 1, vars: { 'book1.available': 'true', 'book2.available': 'no book2 yet' } },
            { line: 2, vars: { 'book1.available': 'true', 'book2.available': 'true' } },
            { line: 3, vars: { 'book1.available': 'false', 'book2.available': 'true' } },
            { line: 4, vars: { 'book1.available': 'false', 'book2.available': 'true' } },
          ]}
          caption="Only book1 moved. book2 is still available, because this pointed at book1"
        />
      </ContentSlide>
    ),
    notes:
      'Hold on row three. The room should be able to say why book2 did not change before you say it.',
  },
  {
    id: 'run-output',
    label: 'What it prints',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Running It Step by Step"
        lead="The same four lines, and everything they put on the screen"
        lesson={SESSION}
      >
        {/*
          R6: nothing here was executed, because pseudocode has no interpreter.
          Every line below comes from a PRINT statement shown on an earlier slide,
          read in order, and the pane says "What it prints" rather than "Output"
          so the slide does not claim a run that did not happen.
        */}
        <CodeOutput
          outputFontSize={15}
          panes={[
            {
              label: 'What it prints',
              language: 'Pseudocode',
              code: [
                'book1 = NEW Book("Harry Potter", "Rowling")',
                'book2 = NEW Book("Atomic Habits", "Clear")',
                'book1.borrow()',
                'book2.display()',
              ].join('\n'),
              output: [
                'Harry Potter borrowed',
                'Title: Atomic Habits',
                'Author: Clear',
                'Available: true',
              ].join('\n'),
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'display() read Atomic Habits, not Harry Potter. this pointed at book2, so it read book2’s data.',
  },
  {
    id: 'all-together-figure',
    label: 'All Together',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="All Together"
        lead="One class, three parts, and each part has one job"
        lesson={SESSION}
      >
        {/*
          `LayerAnatomy` and not `BentoGrid` or `PeerCards`: a class is ONE thing
          with parts, and a grid of equal tiles would draw state, constructor and
          behaviour as three unrelated peers. Its named weakness is a set with no
          real ordering, and these three have one: nothing can run before the
          constructor has set the values it reads.
        */}
        <LayerAnatomy
          items={[
            {
              id: 'state',
              label: 'State',
              body: 'title, author, available',
              outcome: 'What a book knows about itself',
            },
            {
              id: 'constructor',
              label: 'Constructor',
              body: 'Book(title, author)',
              outcome: 'Sets all three the moment the book exists',
              weight: 'hero',
            },
            {
              id: 'behaviour',
              label: 'Behaviour',
              body: 'borrow(), returnBook(), display()',
              outcome: 'Reads and changes what the book knows',
            },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'all-together-rules',
    label: 'The three sentences',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="All Together"
        lead="If you carry three sentences out of this session, carry these"
        lesson={SESSION}
      >
        <RuleStack
          width={900}
          points={[
            {
              id: 'ctor',
              label: 'The constructor sets up the starting state',
              body: 'It runs once, automatically, the moment the object is created',
            },
            {
              id: 'methods',
              label: 'Methods read or change that state',
              body: 'borrow() changed one value, display() changed none of them',
            },
            {
              id: 'this',
              label: 'this connects a method to the right object',
              tone: 'lead',
              tag: 'the hinge',
              body: 'Without it, one class could not serve two books at the same time',
            },
          ]}
        />
      </ContentSlide>
    ),
  },

  /* ---------------------------------------------------------------- */
  /* Applied — building a library project                              */
  /* ---------------------------------------------------------------- */
  {
    id: 'break-library',
    label: '05 Library Project',
    section: 'Building a Library Project',
    element: (
      <SectionBreakerImageSlide
        index={5}
        title="Building a Library Project"
        subtitle="The four ideas, applied to a second class"
        lesson={SESSION}
        media={{ src: ART.library, alt: 'Library shelves, and a person choosing a book' }}
      />
    ),
    notes:
      'Nothing new is taught from here. This is the four concepts used once more, on a class the room has not seen.',
  },
  {
    id: 'member-intro',
    label: 'The Member class',
    section: 'Building a Library Project',
    element: (
      <ContentSlide
        kicker="Building a Library Project"
        title="The Member Class"
        lead="A library is not only books. Somebody has to borrow them"
        lesson={SESSION}
      >
        <LeadAndRest
          points={[
            {
              id: 'grow',
              label: 'One more class grows the project',
              tone: 'lead',
              tag: 'today, once more',
              icon: 'plus',
              body: 'Book was the first. Member is the second, and the two will work together',
            },
            {
              id: 'state',
              label: 'Start with what a member knows',
              icon: 'info',
              body: 'The same first question we asked about a book',
            },
            {
              id: 'behaviour',
              label: 'Then what a member can do',
              icon: 'play',
              body: 'And the constructor that gives them their first values',
            },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'member-shape',
    label: 'Library Member',
    section: 'Building a Library Project',
    element: (
      <ContentSlide
        kicker="Building a Library Project"
        title="Library Member"
        lead="Two halves, exactly as the Book class had"
        lesson={SESSION}
      >
        {/*
          `PeerCards` rather than `LayerAnatomy` again: the anatomy figure was used
          four slides ago, and STYLE_GUIDE §8 says two slides that both argue "many
          things" must not use one figure or the second reads as the first with
          different words. These two halves are peers here, which PeerCards states
          honestly.
        */}
        <PeerCards
          width={780}
          points={[
            {
              id: 'state',
              label: 'What a member knows',
              icon: 'info',
              body: 'name, memberId, and borrowedBooks which starts empty',
            },
            {
              id: 'behaviour',
              label: 'What a member can do',
              icon: 'play',
              body: 'borrowBook(book), returnBook(book), displayInfo()',
            },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'member-class',
    label: 'Writing the Member Class',
    section: 'Building a Library Project',
    element: (
      <ContentSlide
        kicker="Building a Library Project"
        title="Writing the Member Class"
        lead="The attributes, and the constructor that fills them"
        lesson={SESSION}
      >
        <LineAnnotated
          title="The Member class"
          lines={[
            { n: 1, text: 'CLASS Member:', kind: 'plain' },
            { n: 2, text: 'ATTRIBUTES:', indent: 1, kind: 'assign' },
            { n: 3, text: 'name, memberId, borrowedBooks', indent: 2 },
            { n: 4, text: 'CONSTRUCTOR(name, memberId):', indent: 1, kind: 'call', note: 'Two parameters' },
            { n: 5, text: 'this.name = name', indent: 2, kind: 'assign' },
            { n: 6, text: 'this.memberId = memberId', indent: 2, kind: 'assign' },
            {
              n: 7,
              text: 'this.borrowedBooks = []',
              indent: 2,
              kind: 'assign',
              note: 'Starts with no books, the same way a new Book starts available',
            },
          ]}
          caption="The same shape as Book: name the state, then set it in the constructor"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'member-methods',
    label: 'Writing the Member Class',
    section: 'Building a Library Project',
    element: (
      <ContentSlide
        kicker="Building a Library Project"
        title="Writing the Member Class"
        lead="Two methods, and both of them move the same list"
        lesson={SESSION}
      >
        <LineAnnotated
          title="Member methods"
          lines={[
            { n: 1, text: 'METHOD borrowBook(book):', kind: 'call' },
            {
              n: 2,
              text: 'ADD book TO this.borrowedBooks',
              indent: 1,
              kind: 'assign',
              note: 'Changes THIS member’s list, not anybody else’s',
            },
            { n: 3, text: 'PRINT this.name + " borrowed " + book', indent: 1, kind: 'io' },
            { n: 4, text: 'END METHOD', kind: 'plain' },
            { n: 5, text: 'METHOD returnBook(book):', kind: 'call' },
            { n: 6, text: 'REMOVE book FROM this.borrowedBooks', indent: 1, kind: 'assign' },
            { n: 7, text: 'PRINT this.name + " returned " + book', indent: 1, kind: 'io' },
            { n: 8, text: 'END METHOD', kind: 'plain' },
          ]}
          caption="Two members can borrow at the same time, and neither list touches the other"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'member-display',
    label: 'Writing the Member Class',
    section: 'Building a Library Project',
    element: (
      <ContentSlide
        kicker="Building a Library Project"
        title="Writing the Member Class"
        lead="And the method that only reads"
        lesson={SESSION}
      >
        <LineAnnotated
          title="Member methods"
          lines={[
            { n: 1, text: 'METHOD displayInfo():', kind: 'call' },
            {
              n: 2,
              text: 'PRINT "Name: " + this.name',
              indent: 1,
              kind: 'io',
              note: 'Reads THIS member’s state',
            },
            { n: 3, text: 'PRINT "Member ID: " + this.memberId', indent: 1, kind: 'io' },
            /* Split across two lines because the code column is 384px and this
               statement needs 486px on one. The source deck wraps it here too. */
            { n: 4, text: 'PRINT "Books borrowed: " +', indent: 1, kind: 'io' },
            { n: 5, text: 'this.borrowedBooks.length', indent: 2 },
            { n: 6, text: 'END METHOD', kind: 'plain' },
          ]}
          caption="Three lines out, and the member is exactly as it was"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'member-run',
    label: 'Creating Member Objects',
    section: 'Building a Library Project',
    element: (
      <ContentSlide
        kicker="Building a Library Project"
        title="Creating Member Objects"
        lead="Two members, two books borrowed, one member describing itself"
        lesson={SESSION}
      >
        <CodeOutput
          outputFontSize={15}
          panes={[
            {
              label: 'What it prints',
              language: 'Pseudocode',
              code: [
                'member1 = NEW Member("Ali", "M001")',
                'member2 = NEW Member("Sara", "M002")',
                'member1.borrowBook("Harry Potter")',
                'member1.borrowBook("Clean Code")',
                'member1.displayInfo()',
              ].join('\n'),
              output: [
                'Ali borrowed Harry Potter',
                'Ali borrowed Clean Code',
                'Name: Ali',
                'Member ID: M001',
                'Books borrowed: 2',
              ].join('\n'),
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'Sara was created and never used, on purpose. Ask what Sara’s borrowedBooks holds: it is still empty, and that is this doing its job.',
  },

  /* ---------------------------------------------------------------- */
  /* Close                                                             */
  /* ---------------------------------------------------------------- */
  {
    id: 'quiz-2',
    label: 'Quiz Time!',
    element: (
      <QuizTimeSlide
        lesson={SESSION}
        subtitle="One class, two objects, and the keyword that keeps them apart"
      />
    ),
  },
  {
    id: 'takeaways',
    label: 'Key Takeaways',
    element: (
      /* R5 and hard rule 20: the agenda's four items, word for word, in a
         different UI. `CONCEPTS` is the single source, so an edit to the agenda
         cannot leave this slide behind. */
      <KeyTakeawaysSlide
        lesson={SESSION}
        lead="Four ideas, and every one of them showed up in the Member class as well"
        points={[
          { text: CONCEPTS[0], sub: 'What an object knows right now, held in its attributes' },
          { text: CONCEPTS[1], sub: 'What an object can do, written as methods' },
          { text: CONCEPTS[2], sub: 'Runs automatically and sets the starting state' },
          { text: CONCEPTS[3], sub: 'The object I belong to, which is how one class serves many objects' },
        ]}
      />
    ),
  },
  {
    id: 'practice',
    label: 'Practice',
    element: (
      <PracticeSlide
        lesson={SESSION}
        prompt="Write a Student class in pseudocode, using everything from today"
        tasks={[
          { text: 'State', sub: 'name, rollNo and marks' },
          { text: 'Constructor', sub: 'Takes name and rollNo, and starts marks at 0' },
          { text: 'Behaviour', sub: 'updateMarks(newMarks) and display()' },
          { text: 'Then create two students', sub: 'Update one, and check the other did not move' },
        ]}
      />
    ),
  },
  {
    id: 'next-session',
    label: 'Next session',
    element: (
      <SectionBreakerSlide
        kicker="Next Session"
        title="Encapsulation"
        subtitle="Today every attribute was open to anybody. Next time we decide who is allowed to touch what"
        lesson={SESSION}
      />
    ),
  },
  { id: 'feedback', label: 'Feedback', element: <FeedbackSlide lesson={SESSION} /> },
  { id: 'thank-you', label: 'Thank you', element: <ThankYouSlide lesson={SESSION} /> },
]
