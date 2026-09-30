import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentSlide,
  QuestionSlide,
  SectionBreakerImageSlide,
  WelcomeSlide,
} from '@/slides'
import {
  Callout,
  ObjectState,
  ObjectStateRow,
  SlideBase,
  SlideHeader,
} from '@/ui'
import { Reveal, RevealGroup } from '@/motion/Reveal'
import { SLIDE_FAMILY } from '@/motion/continuity'

/*
  THE FIGURE FAMILIES, IMPORTED BY PATH ON PURPOSE.

  `src/ui/points`, `src/ui/pseudocode`, `src/ui/features` and `src/ui/flowchart`
  are kit folders that are deliberately NOT on the `@/ui` barrel. Each offers a
  CHOICE between designs behind one contract, and the barrel's own comment says
  choosing should be a deliberate act at the import line rather than a name that
  arrives with everything else. So every import below is a decision, and §5 of the
  plan records why each one beat its siblings.
*/
import { LineAnnotated } from '@/ui/pseudocode/LineAnnotated'

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
import { TermGrid } from '@/ui/trial/definitions/TermGrid'
import { TermLede } from '@/ui/trial/definitions/TermLede'

/**
 * THE A.PNG ZONES, ON SLIDE 9 ONLY.
 *
 * `../A.png` is a hand-annotated layout template drawn over this deck's own
 * header: a green box round the header, the grey speaker box, and three orange
 * boxes named Space-1, Space-2 and Space-3. This component is that annotation
 * turned into a layout, and NOTHING ELSE IN THE REPO USES IT. It is not a rule
 * and it is not in the kit: `ContentNoteSlide`, `SlideHeader` and `SlideBase`
 * are kit-owned and are left exactly as they were, so `sync-kit.mjs` has nothing
 * of this to overwrite and the other nine slides still render the old way.
 *
 * THE ZONES, AND WHAT EACH ONE IS FOR
 *
 *   HEADER   x 0..912, y 0..148. The kicker and the title, and nothing else.
 *            The lead used to live here as a third line under the title; it does
 *            not any more. It is now the first thing in Space-1.
 *   SPEAKER  x 913..1280, y 0..220. Held empty for the instructor video. Same
 *            rectangle `video-safe.mjs` asserts, which is why the annotation's
 *            green box stops at 912 and its grey box starts at 918.
 *   SPACE-1  x 64..1159, y 251..709. THE CONTENT AREA, and the default answer.
 *            A slide tries to fit everything here first, aligned within it.
 *   SPACE-2  x 1159..1214, y 251..658. 55px of extra width on the right, taken
 *            only when Space-1 will not hold the content. Empty otherwise. It
 *            stops 51px above Space-1's floor because the footer mark is there.
 *   SPACE-3  x 64..880, y 162..240. 78px of extra height above Space-1, taken
 *            last, and only when the layout needs more room than Space-2's width
 *            can give it. Its right edge is 880 because past that is the speaker
 *            box. Nothing ever goes above y=162.
 *
 * SLIDE 9 FITS IN SPACE-1, so Space-2 and Space-3 are both empty here.
 *
 * WHY 64 AND NOT THE MEASURED 61
 *
 * A.png is a 1561px capture of a 1280px canvas, so every number off it is an
 * image pixel divided by 1.2195 and carries about 3px of rounding. The left edge
 * it reports, 61, is the kit's own `px-16` gutter at 64, which is the number the
 * header's accent bars are built around (`-left-16` cancels exactly 64). The
 * header and the body have to share ONE left edge or the slide reads ragged down
 * its left side, so the zones use 64. Same argument on the right: 1214 measured
 * is `px-16`'s 1216.
 *
 * WHY IT POSITIONS ABSOLUTELY INSTEAD OF USING THE FRAME'S PADDING
 *
 * `SlideBase` is asked for `padded={false}`, so its content div is the bare
 * 1280x720 canvas and every offset below is a canvas coordinate, which is what
 * the zone table above is written in. Going through the kit's `px-16 pb-16 pt-12`
 * instead would put the floor at y=656, above both Space-1's own bottom and the
 * margin band's.
 */
const ZONE = {
  header: { left: 64, top: 48, right: 912 },
  space1: { left: 64, top: 251, right: 1159, bottom: 709 },
  /* Declared because the zones are a set and a reader should see all three.
     Slide 9 uses neither. */
  space2: { left: 1159, top: 251, right: 1214, bottom: 658 },
  space3: { left: 64, top: 162, right: 880, bottom: 240 },
} as const

/**
 * THE VERTICAL MARGINS, FROM `../C.png`. Slide 9 only, like everything else here.
 *
 * C.png is the same 1561x884 capture of the same 1280x720 canvas as A.png, with
 * three horizontal lines drawn on it and NO vertical ones. Measured off the file
 * rather than read off the picture, by thresholding the annotation colour and
 * taking the row runs:
 *
 *     img y 3..5     x 0..1112     ->  slide y 3,    x 0..912
 *     img y 270..271 x 0..1560     ->  slide y 221,  full width
 *     img y 788..789 x 0..1560     ->  slide y 647,  full width
 *
 * (a fourth dark band at img y 872..883 is the deck's own `slide-footer-bar`,
 * not a marking.)
 *
 * WHAT THEY MEAN
 *
 * They are MARGINS, and the body is centred between them. The first line marks
 * the canvas edge and nothing more: the header is NOT centred against it and does
 * not move. The other two bound the body:
 *
 *     y 221  the ceiling. It is the instructor-video rectangle's floor, which
 *            `video-safe.mjs` already holds at 220, drawn as a line.
 *     y 647  the CENTRING floor, NOT a limit. Content that fits in 221..647 is
 *            centred on y=434, the band's midpoint, instead of on Space-1's own
 *            midpoint of 480.
 *
 * Heavy content or a heavy layout is NOT held to 647. It may use the whole of
 * Space-1, down to 709: once the group is taller than the band it pins to y=221
 * and grows into 647..709. (It was first built as a fixed 221..647 box, which
 * made 647 a hard floor. The user corrected that on 2026-09-24.)
 *
 * IT DOES NOT APPLY TO SPACE-3, and the geometry is the reason rather than a
 * preference. Space-3 is y 162..240, which sits ABOVE this band's ceiling. A
 * layout that reaches up into it has crossed y=221 and is growing upward from a
 * fixed floor, so there is no band left to be centred in.
 *
 * Slide 9 does not use Space-3, so the band applies here in full.
 */
const BAND = { top: 221, bottom: 647 } as const

/**
 * Slide 9's layout: header in the header zone, everything else inside Space-1,
 * centred in C.png's margin band.
 *
 * The lead is the first block in Space-1 rather than a header line.
 */
function ZonedNoteSlide({
  kicker,
  title,
  lead,
  note,
  children,
  lesson,
}: {
  kicker: string
  title: string
  lead: string
  note: { kind: 'info' | 'note' | 'tip' | 'warning' | 'success' | 'error'; title: string; body: string }
  children: ReactNode
  lesson: string
}) {
  const S1 = ZONE.space1
  return (
    <SlideBase variant="light" lesson={lesson} padded={false}>
      {/*
        EACH ZONE IS ITS OWN BOX, AND NOT ONE FULL-CANVAS WRAPPER.

        The obvious build is a single `RevealGroup` at `h-full w-full` with the
        zones absolutely placed inside it. It renders identically and it blinds
        `qa.mjs`: that harness walks the slide reporting the OUTERMOST element
        whose box passes `sr.right - 4` or `sr.bottom - 8`, and then stops
        descending. A 1280x720 wrapper fails that test by construction, so the
        wrapper would be reported and everything inside it would go unchecked.
        Two boxes the size of their own zones keep the sweep able to see the
        content, and they are the honest shape of the layout anyway.

        The cost is that the header and the body are now two entrance groups
        rather than one chain, which is why the band carries a `delayChildren`:
        it is what used to be its place in the single stagger.
      */}

      {/* HEADER ZONE, x 64..912, y 48..~130. `lead` is deliberately NOT passed:
          the third element belongs in Space-1 now. Without it `SlideHeader`
          drops to its no-lead floor, which is what keeps the kicker and the
          title inside y 0..148. It is its own `RevealGroup` internally, so it
          self-animates with no group around it. */}
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

      {/* SPACE-1'S CONTENT, IN C.PNG'S BAND.

          Horizontally this is Space-1: x 64..1159, straight off A.png.
          Vertically the box runs y 221..709: C.png's ceiling down to Space-1's
          real bottom. Content that fits is centred on y=434 (the 221..647
          band); heavy content may run past 647 down to 709. See `BAND` above. */}
      <div
        data-zone="space1"
        className="flex flex-col"
        style={{
          position: 'absolute',
          left: S1.left,
          top: BAND.top,
          width: S1.right - S1.left,
          height: S1.bottom - BAND.top,
        }}
      >
      {/* Two spacers do the centring. The top one starts at 0, the bottom one at
          the 62px between 647 and 709, and both grow equally. So while the group
          fits the band, the free space splits evenly and it centres on y=434.
          When it does not, only the bottom spacer can shrink, so the group stays
          pinned at 221 and grows down into 647..709. */}
      <div aria-hidden style={{ flex: '1 1 0px', minHeight: 0 }} />
      <RevealGroup
        className="flex shrink-0 flex-col"
        stagger={0.1}
        delayChildren={0.28}
      >
        <Reveal dir="up">
          {/* The old header lead, now the first block in Space-1. Capped below
              the zone's 1095px because a line of prose run edge to edge across
              the frame is a newspaper column read from twelve metres. The kit's
              header lead carried `max-w-3xl` for the same reason; this is that
              measure plus a little, since the zone is wider than the header. */}
          <p className="max-w-[860px] text-body-lg text-body">{lead}</p>
        </Reveal>

        <Reveal dir="up" style={{ marginTop: 26 }}>
          {children}
        </Reveal>

        <Reveal dir="up" style={{ marginTop: 34 }}>
          <Callout
            kind={note.kind}
            title={note.title}
            className="max-w-none text-body-lg shadow-card ring-1 ring-black/[0.04]"
          >
            {note.body}
          </Callout>
        </Reveal>
      </RevealGroup>
      <div aria-hidden style={{ flex: `1 1 ${S1.bottom - BAND.bottom}px`, minHeight: 0 }} />
      </div>
    </SlideBase>
  )
}

/* Slide 8 is a `ContentSlide` in the same section, so the kicker "State" is
   unchanged across the boundary. Declaring the family is what lets
   `computeContinuity` see that and hold the kicker still instead of flying it in
   again. See `src/motion/continuity.ts`. */
ZonedNoteSlide.family = SLIDE_FAMILY.content

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

export const betaTestingMeta: DeckMeta = {
  title: 'Beta Testing Slides',
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

export const betaTestingDeck: SlideDef[] = [
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
    /* SLIDE 9 ONLY: laid out to the A.png zones. See `ZonedNoteSlide` above.
       Every other slide in this deck still uses the kit's layouts unchanged. */
    element: (
      <ZonedNoteSlide
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
              width: 346,
              rows: [
                { name: 'title', value: HARRY },
                { name: 'author', value: ROWLING },
                { name: 'available', value: 'true' },
              ],
            },
            {
              name: 'Phone',
              width: 346,
              rows: [
                { name: 'brand', value: '"Samsung"' },
                { name: 'battery', value: '80' },
                { name: 'switchedOn', value: 'true' },
              ],
            },
            {
              name: 'BankAccount',
              width: 346,
              rows: [
                { name: 'holder', value: '"Ali"' },
                { name: 'balance', value: '50000' },
              ],
            },
          ]}
        />
      </ZonedNoteSlide>
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
]
