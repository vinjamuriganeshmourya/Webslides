import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  FeedbackSlide,
  KeyTakeawaysSlide,
  QuizTimeSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import {
  AnalogyMap,
  BulletList,
  Callout,
  Card,
  CodeBlock,
  DataTable,
  ObjectState,
  ObjectStateRow,
  SlideBase,
  SlideHeader,
  StatTile,
  SyntaxBreakdown,
} from '@/ui'
import { ArrowRight } from '@/ui/icons'
import { Reveal, RevealGroup } from '@/motion/Reveal'
import { SLIDE_FAMILY } from '@/motion/continuity'

/**
 * INTRODUCTION TO OOPS, THE 20-SLIDE CUT.
 *
 * Plan: `Rules_beta/session_plans/introduction_to_oops/plan.md` (signed off
 * 2026-09-24). Source: `Reference ppt's/session1oops.pptx`.
 *
 * EVERY CONTENT SLIDE IS LAID OUT BY CONTENT RULE 22, through `ZonedSlide`
 * below: the header carries the kicker and the title only, and the lead is the
 * first block in Space-1. The kit's slide types still put the lead inside the
 * header, which is why the content slides do not use them.
 */

export const introductionToOopsMeta: DeckMeta = {
  title: 'Introduction to OOPS',
  course: 'OOPs Theory',
  lesson: 'Introduction to OOPS',
  presenter: 'NxtWave Instructor',
}

const SESSION = 'Introduction to OOPS'

const CONCEPTS = [
  'Object-Oriented Programming',
  'The Problem Without OOP',
  'Class - The Blueprint',
  'Object - The Real Thing',
] as const

/* ------------------------------------------------------------------ */
/* The zones, content rule 32                                          */
/* ------------------------------------------------------------------ */

/**
 * Header x 64..912 from y=48. Space-1 x 64..1159, y 251..709. Space-2 widens
 * Space-1 to x=1214. Normal content is centred between y=221 and y=647, on
 * y=434; heavy content pins to y=221 and may grow down to y=709.
 */
const ZONE = {
  header: { left: 64, top: 48, right: 912 },
  space1: { left: 64, right: 1159, bottom: 709 },
  space2Right: 1214,
  band: { top: 221, bottom: 647 },
} as const

/**
 * A content slide on the rule-22 zones.
 *
 * Two spacers do the vertical centring. The top one starts at 0, the bottom one
 * at the 62px between 647 and 709, and both grow equally: content that fits the
 * band centres on y=434, and content that does not can only shrink the bottom
 * spacer, so it stays pinned at y=221 and grows into 647..709.
 *
 * The spacers are siblings of the `RevealGroup`, never between it and its
 * `Reveal` children, because a plain element there breaks the stagger.
 */
function ZonedSlide({
  kicker,
  title,
  lead,
  children,
  wide = false,
}: {
  kicker: string
  title: string
  lead?: ReactNode
  children: ReactNode
  /** Take Space-2 as well: the body runs to x=1214 instead of 1159. */
  wide?: boolean
}) {
  const right = wide ? ZONE.space2Right : ZONE.space1.right
  return (
    <SlideBase variant="light" lesson={SESSION} padded={false}>
      <div
        data-zone="header"
        style={{
          position: 'absolute',
          left: ZONE.header.left,
          top: ZONE.header.top,
          width: ZONE.header.right - ZONE.header.left,
        }}
      >
        <SlideHeader kicker={kicker} title={title} tone="brand" />
      </div>

      <div
        data-zone="space1"
        className="flex flex-col"
        style={{
          position: 'absolute',
          left: ZONE.space1.left,
          top: ZONE.band.top,
          width: right - ZONE.space1.left,
          height: ZONE.space1.bottom - ZONE.band.top,
        }}
      >
        <div aria-hidden style={{ flex: '1 1 0px', minHeight: 0 }} />
        <RevealGroup className="flex shrink-0 flex-col gap-6" stagger={0.13} delayChildren={0.28}>
          {lead && (
            <Reveal dir="up">
              <p className="max-w-[900px] text-body-lg text-body">{lead}</p>
            </Reveal>
          )}
          {children}
        </RevealGroup>
        <div
          aria-hidden
          style={{ flex: `1 1 ${ZONE.space1.bottom - ZONE.band.bottom}px`, minHeight: 0 }}
        />
      </div>
    </SlideBase>
  )
}
ZonedSlide.family = SLIDE_FAMILY.content

/* ------------------------------------------------------------------ */
/* Small compositions of kit blocks, used by more than one slide       */
/* ------------------------------------------------------------------ */

/** A card listing named groups of items: "Information: ...", "Actions: ...". */
function GroupsCard({
  title,
  groups,
  mono = false,
}: {
  title: string
  groups: { label: string; items: string[] }[]
  mono?: boolean
}) {
  return (
    <Card title={title} className="h-full">
      <div className="mt-3 flex flex-col gap-4">
        {groups.map((g) => (
          <div key={g.label}>
            <p className="font-heading text-body-sm font-bold uppercase tracking-wider text-muted">
              {g.label}
            </p>
            <ul className="mt-1.5 flex flex-col gap-1">
              {g.items.map((it) => (
                <li key={it} className={mono ? 'font-mono text-lg text-ink' : 'text-lg text-ink'}>
                  {it}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Card>
  )
}

/** A language mark with its name beside it (hard rule 12). */
function LogoTile({ src, name }: { src: string; name: string }) {
  return (
    <div className="flex items-center gap-4 rounded-card border border-line bg-white px-6 py-5 shadow-card-soft">
      <img src={src} alt="" draggable={false} className="h-12 w-12 object-contain" />
      <span className="font-heading text-xl font-bold text-ink">{name}</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Pseudocode, copied from the source                                  */
/* ------------------------------------------------------------------ */

const LOOSE_VARS = `bookTitle1 = "Harry Potter"
bookAuthor1 = "J.K. Rowling"
bookAvailable1 = true
bookTitle2 = "Atomic Habits"
bookAuthor2 = "James Clear"
bookAvailable2 = true`

const BORROW_FN = `FUNCTION borrowBook(title):
  IF title == bookTitle1 AND bookAvailable1 == true:
      bookAvailable1 = false
      PRINT title + " borrowed successfully"
  ELSE IF title == bookTitle2 AND bookAvailable2 == true:
      bookAvailable2 = false
      PRINT title + " borrowed successfully"
  ELSE:
      PRINT "Book not available"
END FUNCTION`

const HUNDRED_BOOKS = `bookTitle1, bookAuthor1, bookAvailable1
bookTitle2, bookAuthor2, bookAvailable2
bookTitle3, bookAuthor3, bookAvailable3 ...
bookTitle100, bookAuthor100, bookAvailable100`

const FIRST_CLASS = `CLASS Book:
  ATTRIBUTES:
      title
      author
      available
  METHODS:
      borrow()
      returnBook()
      display()
END CLASS`

const THREE_BOOKS = `book1 = NEW Book("Harry Potter", "J.K. Rowling", true)
book2 = NEW Book("Atomic Habits", "James Clear", true)
book3 = NEW Book("Clean Code", "Robert Martin", true)`

const AFTER_CLASS = `CLASS Book:
  ATTRIBUTES:
      title
      author
      available
  METHOD borrow():
      IF this.available == true:
          this.available = false
          PRINT this.title + " borrowed successfully"
      ELSE:
          PRINT this.title + " is not available"
      END IF
  END METHOD
END CLASS`

const AFTER_USE = `book1 = NEW Book("Harry Potter", "J.K. Rowling", true)
book2 = NEW Book("Atomic Habits", "James Clear", true)
book1.borrow()
book2.borrow()`

/* ------------------------------------------------------------------ */
/* The deck                                                            */
/* ------------------------------------------------------------------ */

export const introductionToOopsDeck: SlideDef[] = [
  /* ── FRONT ───────────────────────────────────────────────────────── */
  {
    id: 'brand',
    section: 'Opening',
    label: 'Welcome',
    element: <BrandSlide greeting="Welcome!" lesson={SESSION} />,
  },
  {
    id: 'session-name',
    section: 'Opening',
    label: 'Session name',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
  },
  {
    id: 'agenda',
    section: 'Opening',
    label: 'Agenda',
    element: (
      <AgendaSlide
        kicker="Agenda"
        title="What We Will Cover"
        lesson={SESSION}
        items={[
          {
            /* Two lines on the agenda only: on one line the agenda curve puts its
               right end at x=977, 64px into the instructor-video rectangle. Same
               words as the divider and the takeaways. */
            title: (
              <>
                Object-Oriented
                <br />
                Programming
              </>
            ),
            sub: 'Things with information and actions',
          },
          { title: CONCEPTS[1], sub: 'Loose variables and disconnected functions' },
          { title: CONCEPTS[2], sub: 'Describing the structure of a thing' },
          { title: CONCEPTS[3], sub: 'Creating multiple objects from one class' },
        ]}
      />
    ),
  },

  /* ── CONCEPT 1 ───────────────────────────────────────────────────── */
  {
    id: 'c1-divider',
    section: CONCEPTS[0],
    label: 'Divider',
    element: <SectionBreakerSlide index={1} title={CONCEPTS[0]} lesson={SESSION} />,
  },
  {
    id: 'c1-library',
    section: CONCEPTS[0],
    label: 'A book in a library',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[0]}
        title="Let Us Think About a Library"
        lead="A library has many things: Books, Members, Shelves, Librarians. Let us pick one thing, a Book"
      >
        <Reveal dir="up">
          <div className="grid grid-cols-2 items-stretch gap-6">
            <ObjectState
              name="A Book: its information"
              rows={[
                { name: 'Title', value: 'Harry Potter' },
                { name: 'Author', value: 'J.K. Rowling' },
                { name: 'Available', value: 'Yes' },
              ]}
            />
            <GroupsCard
              title="A Book: its actions"
              groups={[{ label: 'Things that can happen to it', items: ['Borrow', 'Return', 'Display details'] }]}
            />
          </div>
        </Reveal>
        <Reveal dir="up">
          <Callout kind="success" title="One thing" asStep={false} className="max-w-none">
            The information and the actions both belong to the same thing (Book)
          </Callout>
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c1-pattern',
    section: CONCEPTS[0],
    label: 'The pattern',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[0]}
        title="The Pattern"
        lead="It is not just books. Every real-world thing has information and actions"
      >
        <Reveal dir="up">
          <div className="grid grid-cols-3 items-stretch gap-5">
            <GroupsCard
              title="Car"
              groups={[
                { label: 'Information', items: ['Color', 'Speed', 'Fuel Level'] },
                { label: 'Actions', items: ['Accelerate', 'Brake', 'Refuel'] },
              ]}
            />
            <GroupsCard
              title="Student"
              groups={[
                { label: 'Information', items: ['Name', 'Roll Number', 'Marks'] },
                { label: 'Actions', items: ['Attend class', 'Give exam', 'View result'] },
              ]}
            />
            <GroupsCard
              title="Phone"
              groups={[
                { label: 'Information', items: ['Brand', 'Model', 'Battery %'] },
                { label: 'Actions', items: ['Make a call', 'Send message', 'Take photo'] },
              ]}
            />
          </div>
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c1-two-parts',
    section: CONCEPTS[0],
    label: 'Two parts',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[0]}
        title="Every Real-world Thing Has Two Parts"
        lead="Every real-world thing has:"
      >
        <Reveal dir="up">
          <DataTable
            columns={[{ label: 'Part' }, { label: 'What it means', weight: 1.3 }, { label: 'Examples', weight: 1.3 }]}
            rows={[
              ['Information (Data)', 'What the thing knows about itself', 'Title, Color, Name, Battery %'],
              ['Actions (Behaviour)', 'What the thing can do', 'Borrow, Accelerate, Send message'],
            ]}
          />
        </Reveal>
        <Reveal dir="up">
          <Callout kind="success" title="Both parts belong together" asStep={false} className="max-w-none">
            A car&apos;s speed belongs to that car and a phone&apos;s battery belongs to that phone.
            They are not floating around separately
          </Callout>
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c1-oop',
    section: CONCEPTS[0],
    label: 'What OOP means',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[0]}
        title="What OOP Means"
        lead="OOP (Object-Oriented Programming) is a way of writing code that copies this real-world pattern"
      >
        <Reveal dir="up">
          <BulletList
            immediate
            items={[
              { text: 'In OOP, we organise our code around "things"', sub: 'Just like the real world', icon: 'target' },
              { text: 'Each thing keeps its own information (data)', icon: 'database' },
              { text: 'Each thing keeps its own actions (behaviour)', icon: 'bolt' },
            ]}
          />
        </Reveal>
        <Reveal dir="up">
          <Callout kind="note" title="Together in one box" asStep={false} className="max-w-none">
            A thing&apos;s data and its actions are kept together, in one box
          </Callout>
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c1-real-to-code',
    section: CONCEPTS[0],
    label: 'Real world to code',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[0]}
        title="Real World to Code"
        lead="A real-world thing with info and actions becomes a code thing (Object) with data and methods"
      >
        <Reveal dir="up">
          <div className="grid grid-cols-[1fr_auto_1fr] items-stretch gap-6">
            <GroupsCard
              title="Book, in the real world"
              groups={[
                { label: 'Information', items: ['Title', 'Author', 'Available'] },
                { label: 'Actions', items: ['Borrow it', 'Return it', 'Display it'] },
              ]}
            />
            <div className="flex flex-col items-center justify-center gap-2 text-brand">
              <ArrowRight width={36} height={36} />
              <span className="font-heading text-body-sm font-bold uppercase tracking-wider">becomes</span>
            </div>
            <GroupsCard
              title="Book, in our code (OOP)"
              mono
              groups={[
                { label: 'Data (Attributes)', items: ['title', 'author', 'available'] },
                { label: 'Methods (Functions)', items: ['borrow()', 'returnBook()', 'display()'] },
              ]}
            />
          </div>
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c1-style',
    section: CONCEPTS[0],
    label: 'A style, not a language',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[0]}
        title="OOP Is a Style, Not a Language"
        lead="OOP is not JavaScript or Python or Java. It is a style of writing code, a way of thinking"
      >
        <Reveal dir="up">
          <p className="mb-3 font-heading text-body-sm font-bold uppercase tracking-wider text-muted">
            Many languages support this style, and more
          </p>
          <div className="grid grid-cols-3 gap-5">
            <LogoTile src="/assets/tech/javascript.png" name="JavaScript" />
            <LogoTile src="/assets/tech/python.png" name="Python" />
            <LogoTile src="/assets/tech/java.png" name="Java" />
          </div>
        </Reveal>
        <Reveal dir="up">
          <Callout kind="tip" title="How we will learn it" asStep={false} className="max-w-none">
            We will learn the idea in pseudocode first, then write it in JavaScript later
          </Callout>
        </Reveal>
      </ZonedSlide>
    ),
  },

  /* ── CONCEPT 2 ───────────────────────────────────────────────────── */
  {
    id: 'c2-divider',
    section: CONCEPTS[1],
    label: 'Divider',
    element: <SectionBreakerSlide index={2} title={CONCEPTS[1]} lesson={SESSION} />,
  },
  {
    id: 'c2-loose-vars',
    section: CONCEPTS[1],
    label: 'Loose variables',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[1]}
        title="Loose Variables for Every Book"
        lead='Let us write our Library program without the "things in boxes" approach'
      >
        <Reveal dir="up">
          <div className="grid grid-cols-[1.3fr_1fr] items-center gap-6">
            <CodeBlock language="pseudocode" code={LOOSE_VARS} />
            <Callout kind="warning" title="Three variables per book" asStep={false} className="max-w-none">
              Each book is spread across its own title, author and available variables
            </Callout>
          </div>
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c2-borrow',
    section: CONCEPTS[1],
    label: 'borrowBook()',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[1]}
        title="A Function to Borrow a Book"
        lead="Now let us write a function to borrow a book"
      >
        <Reveal dir="up">
          <CodeBlock language="pseudocode" code={BORROW_FN} highlight={[2, 5]} />
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c2-hundred',
    section: CONCEPTS[1],
    label: '100 books',
    element: (
      <ZonedSlide kicker={CONCEPTS[1]} title="What If We Add 100 Books?">
        <Reveal dir="up">
          <div className="grid grid-cols-[2.3fr_1fr_1fr] items-center gap-5">
            <CodeBlock language="pseudocode" code={HUNDRED_BOOKS} fontSize={15} />
            <StatTile value="300" label="variables" tone="accent" />
            <StatTile value="100" label="IF-ELSE conditions in borrowBook()" tone="accent" />
          </div>
        </Reveal>
        <Reveal dir="up">
          <Callout kind="error" title="No connection between them" asStep={false} className="max-w-none">
            The variables and the functions sit apart. Which variable belongs to which function?
          </Callout>
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c2-two-problems',
    section: CONCEPTS[1],
    label: 'Two big problems',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[1]}
        title="The Two Big Problems"
        lead="This way of writing step-by-step instructions with loose variables and functions is called Procedural Programming"
      >
        <Reveal dir="up">
          <DataTable
            columns={[{ label: 'Problem' }, { label: 'What happens', weight: 2.4 }]}
            rows={[
              ['Data is scattered', 'bookTitle1 and bookAuthor1 are separate variables, nothing tells us they belong to the same book'],
              ['Functions are disconnected', 'borrowBook() does not know which group of variables is "one book", we manually connect them using IF-ELSE'],
            ]}
          />
        </Reveal>
        <Reveal dir="up">
          <Callout kind="warning" title="Small programs only" asStep={false} className="max-w-none">
            It works for small programs. It breaks when the program grows
          </Callout>
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c2-one-box',
    section: CONCEPTS[1],
    label: 'One box per thing',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[1]}
        title="One Box per Thing"
        lead="The solution: instead of loose pieces, OOP keeps one box per thing"
      >
        <Reveal dir="up">
          <div className="grid grid-cols-2 items-stretch gap-6">
            <Card title="Procedural (loose pieces)" className="h-full">
              <BulletList
                immediate
                marker="cross"
                tone="accent"
                className="mt-4"
                items={['100 books = 300 variables', 'Every function checks every variable']}
              />
            </Card>
            <Card title="OOP (one box per thing)" className="h-full">
              <BulletList
                immediate
                marker="check"
                tone="success"
                className="mt-4"
                items={[
                  'One box = one book',
                  'Data and actions live together',
                  { text: '100 books = 100 boxes', sub: 'No extra variables needed' },
                ]}
              />
            </Card>
          </div>
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c2-names',
    section: CONCEPTS[1],
    label: 'Class and object',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[1]}
        title="Class and Object"
        lead="To create this box, we need two things. In OOP, we have specific names for them"
      >
        <Reveal dir="up">
          <DataTable
            columns={[{ label: 'Thing' }, { label: 'OOP Name', weight: 0.7 }, { label: 'Meaning', weight: 2 }]}
            rows={[
              ['The blueprint', 'Class', 'Describes what data and actions a thing will have'],
              ['The real thing', 'Object', 'A real instance created from the blueprint'],
            ]}
          />
        </Reveal>
      </ZonedSlide>
    ),
  },

  /* ── CONCEPT 3 ───────────────────────────────────────────────────── */
  {
    id: 'c3-divider',
    section: CONCEPTS[2],
    label: 'Divider',
    element: <SectionBreakerSlide index={3} title={CONCEPTS[2]} lesson={SESSION} />,
  },
  {
    id: 'c3-class',
    section: CONCEPTS[2],
    label: 'What a class is',
    element: (
      <ZonedSlide kicker={CONCEPTS[2]} title="What a Class Is" lead="A Class is a blueprint. It describes:">
        <Reveal dir="up">
          <BulletList
            immediate
            items={[
              { text: 'What data (attributes) the thing will hold', icon: 'database' },
              { text: 'What actions (methods) the thing can do', icon: 'bolt' },
            ]}
          />
        </Reveal>
        <Reveal dir="up">
          <Callout kind="note" title="No actual values" asStep={false} className="max-w-none">
            A class does not hold actual values, it only describes the structure
          </Callout>
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c3-floor-plan',
    section: CONCEPTS[2],
    label: 'Floor plan analogy',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[2]}
        title="A Floor Plan Is a Class"
        lead="Real-life analogy: an architect's floor plan"
      >
        <Reveal dir="up">
          <div className="grid grid-cols-[1fr_1.2fr] items-center gap-8">
            <GroupsCard
              title="Floor plan (blueprint)"
              groups={[
                { label: 'Rooms', items: ['3 Bedrooms, 1 Kitchen, 2 Bathrooms'] },
                { label: 'Features', items: ['Balcony, Parking'] },
                { label: 'But', items: ['We cannot live in a floor plan', 'We can build many houses from it'] },
              ]}
            />
            <AnalogyMap
              leftLabel="Real life"
              rightLabel="OOP"
              rows={[
                { from: 'Floor Plan', to: 'Class (the blueprint)' },
                { from: 'Real House', to: 'Object (the real thing built from it)' },
              ]}
            />
          </div>
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c3-first-class',
    section: CONCEPTS[2],
    label: 'First class',
    element: (
      <ZonedSlide kicker={CONCEPTS[2]} title="Writing Our First Class" lead="The Book class, written in pseudocode">
        <Reveal dir="up">
          <div className="grid grid-cols-[1.1fr_1fr] items-center gap-8">
            <CodeBlock language="pseudocode" code={FIRST_CLASS} />
            <BulletList
              immediate
              items={[
                { text: 'ATTRIBUTES', sub: 'The data every book will hold', icon: 'database' },
                { text: 'METHODS', sub: 'The actions every book can do', icon: 'bolt' },
                { text: 'No values yet', sub: 'It only describes the structure', icon: 'info' },
              ]}
            />
          </div>
        </Reveal>
      </ZonedSlide>
    ),
  },

  /* ── CONCEPT 4 ───────────────────────────────────────────────────── */
  {
    id: 'c4-divider',
    section: CONCEPTS[3],
    label: 'Divider',
    element: <SectionBreakerSlide index={4} title={CONCEPTS[3]} lesson={SESSION} />,
  },
  {
    id: 'c4-object',
    section: CONCEPTS[3],
    label: 'What an object is',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[3]}
        title="What an Object Is"
        lead="An Object is a real thing created from a class. When we create an object from a class, the object gets:"
      >
        <Reveal dir="up">
          <BulletList
            immediate
            items={[
              { text: 'Its own copy of the data (attributes)', icon: 'database' },
              { text: 'Access to the actions (methods) described in the class', icon: 'bolt' },
            ]}
          />
        </Reveal>
        <Reveal dir="up">
          <Callout kind="info" title="Ali's house and Sam's house" asStep={false} className="max-w-none">
            Both houses were built from the same plan, but they are independent. Painting Ali&apos;s
            house blue does not make Sam&apos;s house blue
          </Callout>
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c4-three-objects',
    section: CONCEPTS[3],
    label: 'Three objects',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[3]}
        title="One Class, Three Objects"
        lead="Each object has its own copy of the data. Changing book1 does not affect book2 or book3"
      >
        <Reveal dir="up">
          <CodeBlock language="pseudocode" code={THREE_BOOKS} />
        </Reveal>
        <Reveal dir="up">
          <ObjectStateRow
            gap={28}
            objects={[
              {
                name: 'book1',
                width: 346,
                rows: [
                  { name: 'title', value: '"Harry Potter"' },
                  { name: 'author', value: '"J.K. Rowling"' },
                  { name: 'available', value: 'true' },
                ],
              },
              {
                name: 'book2',
                width: 346,
                rows: [
                  { name: 'title', value: '"Atomic Habits"' },
                  { name: 'author', value: '"James Clear"' },
                  { name: 'available', value: 'true' },
                ],
              },
              {
                name: 'book3',
                width: 346,
                rows: [
                  { name: 'title', value: '"Clean Code"' },
                  { name: 'author', value: '"Robert Martin"' },
                  { name: 'available', value: 'true' },
                ],
              },
            ]}
          />
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c4-class-vs-object',
    section: CONCEPTS[3],
    label: 'Class vs object',
    element: (
      <ZonedSlide kicker={CONCEPTS[3]} title="Class vs Object" lead="The key difference">
        <Reveal dir="up">
          <DataTable
            compact
            columns={[{ label: 'Class' }, { label: 'Object' }]}
            rows={[
              ['A blueprint / template', 'A real thing created from the class'],
              ['Describes the structure', 'Holds actual values'],
              ['Created once', 'Can be created many times'],
              ['Cannot be used directly', 'Can be used: we interact with objects'],
              ['Example: the idea of a "Book"', 'Example: "Harry Potter" sitting on the shelf'],
            ]}
          />
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c4-instantiation',
    section: CONCEPTS[3],
    label: 'Instantiation',
    element: (
      <ZonedSlide
        kicker={CONCEPTS[3]}
        title="Instantiation"
        lead="Creating an object from a class is called Instantiation. The object is called an Instance of the class"
      >
        <Reveal dir="up">
          <SyntaxBreakdown
            language="pseudocode"
            stepped={false}
            className="max-w-none"
            parts={[
              { token: 'book1', label: 'the instance', body: 'book1 is an INSTANCE of Book', after: ' = ' },
              { token: 'NEW', label: 'instantiation', body: 'This is INSTANTIATION' },
              { token: 'Book', label: 'class name', body: 'The blueprint', after: '' },
              { token: '(title, author, available)', label: 'the values', body: 'This object\'s own data, like "Harry Potter"', fill: 'placeholder' },
            ]}
          />
        </Reveal>
      </ZonedSlide>
    ),
  },
  {
    id: 'c4-after-oop',
    section: CONCEPTS[3],
    label: 'After OOP',
    element: (
      <ZonedSlide kicker={CONCEPTS[3]} title="After OOP" lead="The borrow action now lives inside the class, and each book uses its own data" wide>
        <Reveal dir="up">
          <div className="grid grid-cols-[1.2fr_1fr] items-start gap-5">
            <CodeBlock language="pseudocode" code={AFTER_CLASS} fontSize={14} />
            <div className="flex flex-col gap-5">
              <CodeBlock language="pseudocode" code={AFTER_USE} fontSize={13} />
              <Callout kind="success" title="No IF-ELSE per book" asStep={false} className="max-w-none">
                book1.borrow() checks book1&apos;s own available, through this
              </Callout>
            </div>
          </div>
        </Reveal>
      </ZonedSlide>
    ),
  },

  /* ── CLOSE ───────────────────────────────────────────────────────── */
  {
    id: 'quiz',
    section: 'Closing',
    label: 'Quiz time',
    element: <QuizTimeSlide lesson={SESSION} />,
  },
  {
    id: 'takeaways',
    section: 'Closing',
    label: 'Key takeaways',
    element: <KeyTakeawaysSlide title={SESSION} lesson={SESSION} points={[...CONCEPTS]} />,
  },
  {
    id: 'next-session',
    section: 'Closing',
    label: 'Next session',
    element: (
      <SectionBreakerSlide kicker="Next session" title="State, Behaviour & Constructor" lesson={SESSION} />
    ),
  },
  {
    id: 'feedback',
    section: 'Closing',
    label: 'Feedback',
    element: <FeedbackSlide lesson={SESSION} />,
  },
  {
    id: 'thank-you',
    section: 'Closing',
    label: 'Thank you',
    element: <ThankYouSlide lesson={SESSION} />,
  },
]
