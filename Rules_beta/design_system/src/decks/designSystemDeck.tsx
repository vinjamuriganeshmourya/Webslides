import type { DeckMeta, SlideDef } from '@/deck/types'
import {
  AgendaSlide,
  BrandSlide,
  ContentNoteSlide,
  ContentSlide,
  KeyTakeawaysSlide,
  QuestionSlide,
  QuizTimeSlide,
  SectionBreakerSlide,
  ThankYouSlide,
  WelcomeSlide,
} from '@/slides'
import {
  Callout,
  Card,
  CardGrid,
  CodeBlock,
  DataTable,
  FileTree,
  StatusList,
  Terminal,
} from '@/ui'
import { colors } from '@/design/tokens'

/**
 * THE DESIGN SYSTEM — a design document that is itself a deck.
 *
 * Plan: `Rules_beta/session_plans/design_system/plan.md`, signed off 2026-09-23
 * on decisions D1 to D5 in its §2.
 *
 * WHY THIS IS A DECK AND NOT ANOTHER MARKDOWN FILE
 *
 * `RULES.md` already indexes every rule in this repo as text. A rule about type
 * size, chrome colour, reveal timing or figure choice is only checkable when you
 * are looking at it, so this deck states each rule on a frame that obeys it. Two
 * slides go further and demonstrate their rule by BEING it:
 *
 *   slide 36  hard rule 16, a question and nothing else. It is a `QuestionSlide`
 *             with no bullets, no figure and no answer, and the answer is 37.
 *   slide 48  hard rule 6, text and its visual arriving together. It is a
 *             `ContentSlide` with `points` AND `children`, which is the kit's own
 *             parallel path, so it is fully visible at step 0 without `?all`.
 *
 * EVERY NUMBER HERE IS COPIED FROM A FILE, NEVER WRITTEN FRESH
 *
 *   the 21 hard rules      `.claude/skills/slide-content-rules/SKILL.md`
 *   type scale, colours    `tailwind.config.ts`, `src/design/tokens.ts`
 *   the writing budget     `slide-kit/workflow/TEXT_GUIDELINES.md`
 *   form from the argument `slide-kit/workflow/STYLE_GUIDE.md` §8
 *   slide-type choice      `.claude/skills/generate-slides/SKILL.md` §2
 *   the motion tier        same, §4b
 *   canvas and video box   `video-safe.mjs`, `src/ui/SlideBase.tsx`
 *
 * If a number on a slide and a number in one of those files disagree, the file
 * is right and the slide is a bug.
 *
 * FOUR RULES GOVERN THIS FILE, and each is easy to break while writing ABOUT it.
 *
 *   R1 THE DECK OBEYS WHAT IT STATES. No spaced em dash in any rendered string,
 *      no banned word, no slide over the corpus p90, kicker and title through
 *      `SlideHeader` on every content slide. A deck that breaks its own rules on
 *      the slide stating them is worse than no deck.
 *
 *   R2 A RULE IS QUOTED, NOT PARAPHRASED. Where a rule has memorable wording it
 *      is reproduced. Paraphrase is how a rule drifts from its source.
 *
 *   R3 THE WRONG EXAMPLE IS ALWAYS LABELLED WRONG. Several slides print a string
 *      that violates a rule, because showing the violation is the teaching. Each
 *      one sits in a Don't column or a `StatusList` `error` row, so it can never
 *      be read as the deck's own voice. The repo's em-dash check is
 *      `grep -n "—" src/decks/*.tsx`; on THIS deck the hits on slides 30 and 31
 *      are the subject matter and are expected.
 *
 *   R4 NOTHING HERE IS A NEW RULE. The deck states what is already written down.
 *      It does not add, soften or extend anything, and the A.png / C.png zone
 *      work under test in `Rules_beta/beta_testing_slides` is deliberately absent
 *      (plan §2, decision D3): it is not a rule, and a deck of rules would make
 *      it look like one.
 */

/**
 * CANVAS MAP — the 1280x720 frame drawn to scale, with the regions that are not
 * yours marked on it.
 *
 * WHY THIS IS A NEW COMPONENT AND NOT AN EXISTING ONE
 *
 * Slides 5 and 7 argue about a COORDINATE SPACE: where the frame ends, which
 * rectangle is held for the instructor video, and where the header datum sits.
 * Nothing in the kit draws that. `LayerStack` draws depth, `MachineBoundary`
 * draws a boundary between two machines, `FlowChart` draws a process, and
 * `JourneyRoadmap` draws position along a path. Each would be a decoration here.
 *
 * DOM DIVS, NOT AN `<svg>`, AND THAT IS A HARD REQUIREMENT
 *
 * Content rule 17: `qa.mjs`, `video-safe.mjs` and `align-check.mjs` all measure
 * DOM rectangles, and an `<svg>` is ONE rectangle to all three, so a figure whose
 * internal labels sit on top of each other passes every sweep. Every label below
 * is a real DOM node in normal flow. The retired `SafeAreaFrame` in
 * `Rules_beta/beta_testing_slides` was six divs for the same reason and is the
 * working precedent.
 *
 * `pointer-events-none` is on the whole figure because `video-safe.mjs` skips a
 * decorative layer on exactly that class. Without it, a figure that DRAWS the
 * reserved rectangle would be reported as content sitting inside it, which is
 * the one false positive that sweep can produce.
 *
 * Everything is derived from `width`, so the drawing is the canvas at one scale
 * rather than a picture of it with numbers written on by hand.
 */
function CanvasMap({
  width = 440,
  /** Which claim this instance is making. Dims whatever the slide is not about. */
  focus = 'reserved',
}: {
  width?: number
  focus?: 'reserved' | 'datum'
}) {
  const k = width / 1280
  const height = 720 * k
  /* x 913..1280, y 0..220. From `video-safe.mjs`'s own RESERVED constant. */
  const box = { w: (1280 - 913) * k, h: 220 * k }
  /* x=64, y=48. From hard rule 19, and from `SlideBase`'s px-16 / pt-12. */
  const datum = { x: 64 * k, y: 48 * k }
  /*
    THE DIMMED STATE IS 0.45, NOT 0.35.

    The first version used 0.35 and the figure rendered as an empty box: at this
    scale the reserved rectangle is a pale tint over a pale ground, and a third of
    that is nothing. Caught by screenshotting it, which is the whole of content
    rule 17 and is the reason this note exists rather than a tidier number.
  */
  const lit = (on: boolean) => (on ? 1 : 0.45)
  const onDatum = focus === 'datum'
  const onBox = focus === 'reserved'

  return (
    <div className="pointer-events-none inline-block align-top" aria-hidden>
      <div
        className="relative overflow-hidden rounded-xl"
        style={{
          width,
          height,
          background: colors.white,
          border: `1px solid ${colors.line}`,
          boxShadow: '0 6px 24px -10px rgba(0, 37, 75, 0.16)',
        }}
      >
        {/* THE RESERVED RECTANGLE */}
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: 0,
            width: box.w,
            height: box.h,
            background: `${colors.accent}2E`,
            borderLeft: `2px solid ${colors.accent}`,
            borderBottom: `2px solid ${colors.accent}`,
            opacity: lit(onBox),
          }}
        />

        {/*
          THE HEADER, DRAWN AT SCALE RATHER THAN MARKED WITH A TICK.

          The first version put a 34x2 corner tick at the datum, and in the
          screenshot it read as a stray hairline. Two bars the size of the real
          kicker and title say the same thing and say it as a slide: this is where
          the header goes, and it starts at x=64, y=48.
        */}
        <div
          style={{
            position: 'absolute',
            left: datum.x,
            top: datum.y,
            width: 58 * k,
            height: Math.max(3, 15 * k),
            borderRadius: 2,
            background: colors.brand,
            opacity: lit(onDatum),
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: datum.x,
            top: datum.y + 30 * k,
            width: 420 * k,
            height: Math.max(6, 34 * k),
            borderRadius: 3,
            background: colors.ink,
            opacity: lit(onDatum) * 0.85,
          }}
        />
        {/* the datum itself: a crosshair on the corner the two bars start from */}
        <div
          style={{
            position: 'absolute',
            left: datum.x - 1,
            top: 0,
            width: 2,
            height: datum.y,
            background: colors.brand,
            opacity: lit(onDatum) * 0.5,
          }}
        />

        {/* a hint of body content, so the empty middle reads as a well */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: datum.x,
              top: (300 + i * 46) * k,
              width: (i === 2 ? 520 : 700) * k,
              height: Math.max(3, 14 * k),
              borderRadius: 2,
              background: colors.line,
            }}
          />
        ))}

        {/* the footer strip, so the frame reads as a slide and not as a box */}
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            height: Math.max(3, 8 * k),
            background: colors.brandDeep,
            opacity: 0.55,
          }}
        />
      </div>

      {/*
        THE LABELS SIT UNDER THE DRAWING, NOT INSIDE IT.

        Rule 17's specific hazard is a label placed on a boundary, which then
        overlaps that boundary with nothing to warn you. These have their own
        clear space and their own rows, so no font can render them into each
        other.
      */}
      <div style={{ width, marginTop: 12 }}>
        <p
          style={{
            margin: 0,
            fontSize: 13,
            lineHeight: '20px',
            color: onBox ? colors.accentDark : colors.muted,
            fontWeight: onBox ? 700 : 500,
          }}
        >
          Held for the instructor video: x 913 to 1280, y 0 to 220
        </p>
        <p
          style={{
            margin: '4px 0 0',
            fontSize: 13,
            lineHeight: '20px',
            color: onDatum ? colors.brandDark : colors.muted,
            fontWeight: onDatum ? 700 : 500,
          }}
        >
          The header datum: x 64, y 48, on every slide
        </p>
      </div>
    </div>
  )
}

/**
 * A colour swatch with its value printed beside it.
 *
 * THE HEX STRINGS ON SLIDES 18 AND 20 ARE CONTENT, NOT STYLE.
 *
 * "No hex literal in a deck file" (generate-slides §2) stops a deck inventing a
 * colour outside the token system. This deck's SUBJECT is the token system, so
 * the value has to appear on the frame as text. The paint always comes from a
 * Tailwind token class, never from the string: `token` is what colours the chip
 * and `value` is a label. A future reader tidying this file should not "fix" the
 * label into a token reference, because then the slide stops saying anything.
 */
function Swatch({
  token,
  name,
  value,
  onDark = false,
}: {
  token: string
  name: string
  value: string
  onDark?: boolean
}) {
  return (
    <div className="flex items-center gap-3">
      <span
        className={`h-9 w-9 shrink-0 rounded-lg ring-1 ring-black/[0.06] ${token}`}
      />
      <span className="leading-tight">
        <span className={`block font-heading text-body-sm font-bold ${onDark ? 'text-white' : 'text-ink'}`}>
          {name}
        </span>
        <span className="block font-mono text-[13px] text-muted">{value}</span>
      </span>
    </div>
  )
}

export const designSystemMeta: DeckMeta = {
  title: 'The Design System',
  course: 'NxtWave · Web Slides',
  lesson: 'The Design System',
  presenter: 'NxtWave Curriculum',
}

/** Footer and kicker text. Written once. */
const SESSION = 'The Design System'

/**
 * The four concepts, written once.
 *
 * Hard rule 20: Key Takeaways restates the agenda word for word, and its
 * corollary caps the agenda at four. Both slides read this array, so they cannot
 * drift.
 */
const CONCEPTS = ['The Canvas', 'Type and Colour', 'Writing a Slide', 'Choosing the Form'] as const

export const designSystemDeck: SlideDef[] = [
  /* ---------------------------------------------------------------- */
  /* Front frame                                                       */
  /* ---------------------------------------------------------------- */
  {
    id: 'brand',
    label: 'Brand',
    /* Hard rule 21: the welcome line is written ONCE, by `WelcomeSlide`. So this
       greeting is something else, and "Welcome!" is the default. */
    element: <BrandSlide greeting="Welcome!" lesson={SESSION} />,
    notes: 'The rules of this repo, on frames that obey them.',
  },
  {
    id: 'welcome',
    label: 'Welcome',
    element: <WelcomeSlide minimal title={SESSION} lesson={SESSION} />,
  },
  {
    id: 'agenda',
    label: 'Agenda',
    element: (
      <AgendaSlide
        title="Today's Agenda"
        lesson={SESSION}
        items={[
          { title: CONCEPTS[0], sub: 'The frame every slide sits in' },
          { title: CONCEPTS[1], sub: 'The two sets of tokens' },
          { title: CONCEPTS[2], sub: 'What the words have to do' },
          { title: CONCEPTS[3], sub: 'Which shape the content takes' },
        ]}
      />
    ),
  },

  /* ---------------------------------------------------------------- */
  /* Concept 1 — The Canvas                                            */
  /* ---------------------------------------------------------------- */
  {
    id: 'break-canvas',
    label: '01 The Canvas',
    section: CONCEPTS[0],
    /*
      PLAIN DIVIDERS, NO ART, ON ALL FOUR. Plan decision D5.

      `slide-kit/assets/illustrations/` holds five drawings: bookshelves, a
      location pin, switches, tasks and a setup scene. None of them depicts the
      canvas, the token system, writing, or choosing a form. Hard rule 8: never
      place an available-but-unrelated illustration to fill space, and a
      blank-but-honest divider beats a misleading picture. The four missing
      illustrations are recorded as outstanding work in this deck's CLAUDE.md.
    */
    element: (
      <SectionBreakerSlide
        index={1}
        title={CONCEPTS[0]}
        subtitle="The frame every slide sits in"
        lesson={SESSION}
      />
    ),
    notes: 'Start with the geometry, because every other rule is stated in its coordinates.',
  },
  {
    id: 'canvas-size',
    label: 'One Fixed Canvas',
    section: CONCEPTS[0],
    element: (
      <ContentSlide
        kicker={CONCEPTS[0]}
        title="One Fixed Canvas"
        lead="Every slide is authored at exactly 1280 by 720 pixels"
        lesson={SESSION}
        points={[
          { text: 'Fixed pixels everywhere, never rem' },
          { text: 'No responsive steps, and one viewport' },
          { text: 'The stage scales the whole canvas to fit the projector' },
          { text: 'A layout that is right here is right in the room' },
        ]}
      >
        <CanvasMap focus="datum" />
      </ContentSlide>
    ),
    notes:
      'The fixed canvas is what lets every rule in this deck be stated as a coordinate rather than as a preference.',
  },
  {
    id: 'canvas-zoom',
    label: 'Zoom, Not Scale',
    section: CONCEPTS[0],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[0]}
        title="Zoom, Not Scale"
        lead="The deck used to render soft, and sharpen when you pressed Ctrl and plus"
        lesson={SESSION}
        points={[
          { text: 'transform: scale() is paint. It stretches one rasterised texture' },
          { text: 'zoom is layout. The browser lays the slide out at the projected size' },
          { text: 'A GPU-composited browser showed it, a CPU one did not' },
        ]}
        note={{
          kind: 'info',
          title: 'The tell',
          body: 'If zooming fixes it, the content was rasterised smaller than it was displayed.',
        }}
      />
    ),
  },
  {
    id: 'reserved-box',
    label: 'The Reserved Rectangle',
    section: CONCEPTS[0],
    element: (
      <ContentSlide
        kicker={CONCEPTS[0]}
        title="The Reserved Rectangle"
        lead="The top right of the canvas is not yours to use"
        lesson={SESSION}
        points={[
          { text: 'x 913 to 1280, y 0 to 220' },
          { text: 'Held for the instructor video composited in later' },
          { text: 'Never drawn. It is an empty region held by convention' },
          { text: 'node video-safe.mjs asserts it, and must print CLEAN' },
        ]}
      >
        <CanvasMap focus="reserved" />
      </ContentSlide>
    ),
    notes:
      'Nothing in the repo draws this box. It is empty by agreement and checked after the fact, which is why the harness exists.',
  },
  {
    id: 'header-datum',
    label: 'The Header Datum',
    section: CONCEPTS[0],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[0]}
        title="The Header Datum"
        lead="The kicker and the title sit at x 64, starting at y 48, on every slide that carries them"
        lesson={SESSION}
        points={[
          { text: 'The kicker is the concept, the title is the sub-concept' },
          { text: 'Not beside the figure, not under it, not in whichever column the layout used' },
          { text: 'Any new slide type puts them through SlideHeader, first child' },
        ]}
        note={{
          kind: 'note',
          title: 'Hard rule 19',
          body: 'They are the room’s answer to "where am I in this session", and an answer that moves between slides is not an answer.',
        }}
      />
    ),
  },
  {
    id: 'datum-drift',
    label: 'When the Datum Moved',
    section: CONCEPTS[0],
    element: (
      <ContentSlide
        kicker={CONCEPTS[0]}
        title="When the Datum Moved"
        lead="SlideHeader used to live inside the text column of every image layout"
        lesson={SESSION}
      >
        <StatusList
          immediate
          items={[
            {
              status: 'error',
              text: 'ContentLeftImageSlide started its header at x 664',
              detail: 'Six hundred pixels right of the previous slide',
            },
            {
              status: 'error',
              text: 'ContentTopImageSlide drew the media above the header',
              detail: 'The concept name appeared after the picture, halfway down',
            },
            {
              status: 'success',
              text: 'The header is now hoisted out of the column layout',
              detail: 'left and right name where the media sits, relative to the points',
            },
            {
              status: 'info',
              text: 'It was reported, and nobody read it',
              detail: 'align-check.mjs had been flagging both as DRIFT for several sessions',
            },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'chrome-grey',
    label: 'Chrome is Grey',
    section: CONCEPTS[0],
    element: (
      <ContentSlide
        kicker={CONCEPTS[0]}
        title="Deck Chrome is Grey"
        lead="The slide counter, the nav arrows and the dot rail, on a near-opaque light chip"
        lesson={SESSION}
        points={[
          { text: 'Never white. White is invisible on the light stages, which are most of the deck' },
          { text: 'Mid-grey alone has too little contrast on the night stages' },
          { text: 'The chip gives one constant background, so one grey reads on both' },
          { text: 'Grey, not dark. Chrome must not compete with content' },
        ]}
      />
    ),
    notes: 'The controls are in the bottom left of this very frame. That is the reference.',
  },
  {
    id: 'footer-one-mark',
    label: 'One Mark in the Footer',
    section: CONCEPTS[0],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[0]}
        title="One Mark in the Footer"
        lead="The footer carries the NxtWave mark, and nothing else"
        lesson={SESSION}
        points={[
          { text: 'The session name is already in every slide’s kicker' },
          { text: 'In the footer it sits under the control cluster and collides with the counter' },
          { text: 'lesson is still accepted by every slide type, and is no longer rendered' },
        ]}
        note={{
          kind: 'warning',
          title: 'This one supersedes a document',
          body: 'SLIDE_WORKFLOW.md stage 6 still asks for the session name in the footer. Hard rule 7 wins: it records an explicit correction.',
        }}
      />
    ),
  },
  {
    id: 'welcome-once',
    label: 'The Welcome Line',
    section: CONCEPTS[0],
    element: (
      <ContentSlide
        kicker={CONCEPTS[0]}
        title="The Welcome Line is Written Once"
        lead="WelcomeSlide hardcodes it, so nothing else in the deck may say it again"
        lesson={SESSION}
      >
        <StatusList
          immediate
          items={[
            {
              status: 'error',
              text: 'BrandSlide saying the welcome line too',
              detail: 'The frames sit one or two slides apart, so the deck repeats itself inside ten seconds',
            },
            {
              status: 'success',
              text: 'BrandSlide greets differently',
              detail: '"Welcome!" is the default, and it is fine',
            },
            {
              status: 'info',
              text: 'minimal is the shipping form',
              detail: 'The kicker and the session name, centred, and nothing else in the body',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes: 'Slides 1 and 2 of this deck are the worked example. Flip back if the room wants to see it.',
  },

  /* ---------------------------------------------------------------- */
  /* Concept 2 — Type and Colour                                       */
  /* ---------------------------------------------------------------- */
  {
    id: 'break-type',
    label: '02 Type and Colour',
    section: CONCEPTS[1],
    element: (
      <SectionBreakerSlide
        index={2}
        title={CONCEPTS[1]}
        subtitle="The two sets of tokens"
        lesson={SESSION}
      />
    ),
    notes: 'Tailwind owns the CSS side, tokens.ts mirrors it for TypeScript. They have to agree.',
  },
  {
    id: 'three-families',
    label: 'Three Families',
    section: CONCEPTS[1],
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="Three Families"
        lead="One face for headings, one for body, one for anything the machine said"
        lesson={SESSION}
      >
        <CardGrid cols={3}>
          <Card title="Sora">
            <span className="font-heading text-body-lg font-bold text-ink">Headings</span>
            <span className="mt-1 block text-body-sm">Titles, kickers, card and callout headings</span>
          </Card>
          <Card title="Inter">
            <span className="font-body text-body-lg text-ink">Body</span>
            <span className="mt-1 block text-body-sm">Leads, bullets, captions, table cells</span>
          </Card>
          <Card title="JetBrains Mono">
            <span className="font-mono text-body-lg text-ink">code()</span>
            <span className="mt-1 block text-body-sm">Code, commands, values, file paths</span>
          </Card>
        </CardGrid>
      </ContentSlide>
    ),
  },
  {
    id: 'type-scale',
    label: 'The Type Scale',
    section: CONCEPTS[1],
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="The Type Scale"
        lead="Nine sizes, locked to the canvas, and these are all of them"
        lesson={SESSION}
      >
        <DataTable
          compact
          columns={[
            { label: 'Token', weight: 1.1 },
            { label: 'Size', weight: 0.6 },
            { label: 'Line height', weight: 0.7, dim: true },
            { label: 'What it carries', weight: 2 },
          ]}
          rows={[
            ['hero', '64px', '1.02', 'The brand frame, and nothing else'],
            ['slide-title-lg', '44px', '1.08', 'Centred titles, section dividers'],
            ['slide-title', '34px', '1.12', 'The standard content-slide title'],
            ['body-xl', '26px', '1.45', 'A lead that carries the slide alone'],
            ['body-lg', '22px', '1.5', 'Leads, bullets, callout bodies'],
            ['body', '19px', '1.6', 'Paragraph default'],
            ['code', '17px', '1.6', 'Code blocks'],
            ['body-sm', '16px', '1.55', 'Captions and notes'],
            ['kicker', '15px', '1.2', 'The eyebrow, uppercase, 0.14em tracking'],
          ]}
        />
      </ContentSlide>
    ),
    notes: 'If a size is not in this table it is not in the system, and a component setting its own is a bug worth chasing.',
  },
  {
    id: 'type-specimen',
    label: 'Type in Use',
    section: CONCEPTS[1],
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="Type in Use"
        lesson={SESSION}
      >
        {/* The scale rendered at its real size. A table of numbers cannot say
            what 44px against 22px looks like from the back of a room. */}
        <div className="space-y-3">
          <p className="font-heading text-slide-title-lg font-extrabold leading-tight text-ink">
            slide-title-lg, 44px
          </p>
          <p className="font-heading text-slide-title font-extrabold leading-tight text-ink">
            slide-title, 34px
          </p>
          <p className="text-body-lg text-body">body-lg, 22px. The size a lead and a bullet are set in</p>
          <p className="text-body text-body">body, 19px. The paragraph default</p>
          <p className="text-body-sm text-body">body-sm, 16px. Captions, notes and figure labels</p>
          <p className="font-mono text-code text-ink">code, 17px</p>
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'type-fixed',
    label: 'Fixed Pixels',
    section: CONCEPTS[1],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[1]}
        title="Fixed Pixels, and Why"
        lead="The scale is locked to the 1280 by 720 canvas, so a slide cannot reflow"
        lesson={SESSION}
        points={[
          { text: 'Re-laying out at a new size can break a line after a different word' },
          { text: 'A font engine rounds each glyph advance to the pixel grid' },
          { text: 'So 66px advances are not exactly 1.5 times the advances at 44px' },
          { text: 'geometricPrecision on the stage uses the unrounded advance instead' },
        ]}
        note={{
          kind: 'success',
          title: 'Measured, not argued',
          body: 'Without it, fit-check.mjs found wrap points moving by up to 73px at 1.5x. With it, the boxes are stable to a fraction of a pixel.',
        }}
      />
    ),
  },
  {
    id: 'brand-ramp',
    label: 'The Primary Ramp',
    section: CONCEPTS[1],
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="The Primary Ramp"
        lead="Ten stops. 500, 600 and 900 are exactly the style guide’s blue, deep and navy"
        lesson={SESSION}
      >
        <div className="grid grid-cols-5 gap-x-8 gap-y-4">
          <Swatch token="bg-brand-50" name="brand.50" value="#EEF3FF" />
          <Swatch token="bg-brand-100" name="brand.100" value="#D9E4FF" />
          <Swatch token="bg-brand-200" name="brand.200" value="#B4C8FF" />
          <Swatch token="bg-brand-300" name="brand.300" value="#86A5FF" />
          <Swatch token="bg-brand-400" name="brand.400" value="#5482FD" />
          <Swatch token="bg-brand-500" name="brand.500" value="#2D63FB" />
          <Swatch token="bg-brand-600" name="brand.600" value="#0146C7" />
          <Swatch token="bg-brand-700" name="brand.700" value="#013A9E" />
          <Swatch token="bg-brand-800" name="brand.800" value="#002E7A" />
          <Swatch token="bg-brand-900" name="brand.900" value="#00254B" />
        </div>
      </ContentSlide>
    ),
    notes: 'nw.blue, nw.deep and nw.navy are the style guide’s names for 500, 600 and 900. Both spellings resolve to one colour.',
  },
  {
    id: 'one-blue',
    label: 'One Blue, Not Two',
    section: CONCEPTS[1],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[1]}
        title="One Blue, Not Two"
        lead="The ramp was built on one blue while the chrome slides used another"
        lesson={SESSION}
        points={[
          { text: '#0B5FFF in the ramp, #2D63FB in the chrome' },
          { text: 'Close enough to look like a rendering error' },
          { text: 'Far enough apart to be obvious when a light slide follows a navy divider' },
          { text: 'The kicker, the icons and the chips all shifted hue at that boundary' },
        ]}
        note={{
          kind: 'success',
          title: 'The fix retargets the ramp, not the deck',
          body: 'Thirty-odd slides consume the ramp. One file changed instead of thirty, and both spellings now resolve to one colour.',
        }}
      />
    ),
  },
  {
    id: 'semantic-colour',
    label: 'Semantic Colour',
    section: CONCEPTS[1],
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="Semantic Colour"
        lead="Four verdicts, each a trio: the ground, the ink, and the mark"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'Verdict', weight: 0.9 },
            { label: 'DEFAULT', weight: 0.9 },
            { label: '100, the ground', weight: 1 },
            { label: '600, the ink', weight: 1 },
            { label: 'Means', weight: 1.4 },
          ]}
          rows={[
            ['success', '#16A34A', '#DCFCE7', '#15803D', 'Remember this'],
            ['warning', '#F59E0B', '#FEF3C7', '#B45309', 'This can bite you'],
            ['danger', '#EF4444', '#FEE2E2', '#B91C1C', 'This does not work'],
            ['info', '#0EA5E9', '#E0F2FE', '#0369A1', 'Good to know'],
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'callout-kinds',
    label: 'Six Callout Kinds',
    section: CONCEPTS[1],
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="Six Callout Kinds"
        lead="Rendered as themselves, because a name for a colour is not a colour"
        lesson={SESSION}
      >
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <Callout kind="note" asStep={false} title="note">
            The default. A remark the room should carry forward
          </Callout>
          <Callout kind="tip" asStep={false} title="tip">
            A shortcut, once the long way has been shown
          </Callout>
          <Callout kind="info" asStep={false} title="info">
            Context that is true but not on the critical path
          </Callout>
          <Callout kind="success" asStep={false} title="success">
            The thing to remember out of this slide
          </Callout>
          <Callout kind="warning" asStep={false} title="warning">
            This can bite you
          </Callout>
          <Callout kind="error" asStep={false} title="error">
            This does not work
          </Callout>
        </div>
      </ContentSlide>
    ),
    notes:
      'warning and error were one colour until a deck needed to say both on one slide, and the room could not tell them apart.',
  },
  {
    id: 'four-grounds',
    label: 'Four Grounds',
    section: CONCEPTS[1],
    element: (
      <ContentSlide
        kicker={CONCEPTS[1]}
        title="Four Grounds"
        lead="A slide picks one. It never overrides the background in className"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'Variant', weight: 0.8 },
            { label: 'What it is', weight: 1.8 },
            { label: 'Who sits on it', weight: 1.6 },
          ]}
          rows={[
            ['light', 'A soft blue field, #EEF3FF into #F5F8FF', 'Every content slide'],
            ['plain', 'Flat white', 'A slide whose figure needs no field'],
            ['night', 'The style guide navy carrying its deep blue', 'Every dark chrome slide'],
            ['brand', 'The bright brand gradient', 'Nameable, and no slide type uses it'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'brand is kept nameable and unused on purpose: the chrome all sits on night, so the deck opens and closes on one ground.',
  },
  {
    id: 'no-hex',
    label: 'Never a Hex in a Deck',
    section: CONCEPTS[1],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[1]}
        title="Never a Hex in a Deck"
        lead="Colour comes from the tokens. A missing colour is a tokens change, raised as one"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'Why an override is worse than it looks',
          body: 'It sets the same CSS property as the variant, so Tailwind output order picks the winner, not your code.',
        }}
      >
        <CodeBlock
          language="tsx"
          filename="src/decks/mySessionDeck.tsx"
          showLineNumbers={false}
          fontSize={16}
          code={`// right: the token, and the variant owns the ground
import { colors } from '@/design/tokens'
<SlideBase variant="night">

// wrong: a literal, and an override that fights the variant
<div style={{ background: '#2D63FB' }} />
<SlideBase variant="night" className="bg-nw-gradient">`}
        />
      </ContentNoteSlide>
    ),
  },

  /* ---------------------------------------------------------------- */
  /* Concept 3 — Writing a Slide                                       */
  /* ---------------------------------------------------------------- */
  {
    id: 'break-writing',
    label: '03 Writing a Slide',
    section: CONCEPTS[2],
    element: (
      <SectionBreakerSlide
        index={3}
        title={CONCEPTS[2]}
        subtitle="What the words have to do"
        lesson={SESSION}
      />
    ),
    notes:
      'Every number in this concept is measured from 23 reference decks: 1,274 slides and 14,131 body lines.',
  },
  {
    id: 'budget',
    label: 'Forty Words',
    section: CONCEPTS[2],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[2]}
        title="Forty Words"
        lead="The measured budget, from 1,274 slides of the reference corpus"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'Over 120 words is not a long slide',
          body: 'It is two ideas on one frame, and it gets split rather than trimmed.',
        }}
      >
        <DataTable
          columns={[
            { label: 'Measure', weight: 1.6 },
            { label: 'Median', weight: 0.8 },
            { label: 'Soft ceiling, corpus p90', weight: 1.2, dim: true },
          ]}
          rows={[
            ['Title', '2 words', '5 words'],
            ['Body words per slide', '40', '119'],
            ['Body lines per slide', '10', '24'],
            ['Words per line', '3', '10'],
          ]}
        />
      </ContentNoteSlide>
    ),
  },
  {
    id: 'fragment',
    label: 'The Fragment',
    section: CONCEPTS[2],
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="The Fragment"
        lead="A bullet is a noun phrase or a verb phrase, and it has no trailing stop"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'Do', weight: 1 },
            { label: 'Do not', weight: 1.3, dim: true },
          ]}
          rows={[
            ['Add the Filtering Tool', 'In this step we are going to add the filtering tool'],
            ['Store Data', 'Store Data.'],
            ['Click Send button', 'You should now click on the Send button'],
            ['Needs prior experience', 'This one needs prior experience to use'],
          ]}
        />
      </ContentSlide>
    ),
    notes: '79 percent of all corpus body lines are six words or fewer. That is the shape to aim at.',
  },
  {
    id: 'sentences',
    label: 'Sentences are Rationed',
    section: CONCEPTS[2],
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="Sentences are Rationed"
        lead="About one line in five, and spent on exactly three jobs"
        lesson={SESSION}
      >
        <StatusList
          immediate
          items={[
            {
              status: 'info',
              text: 'Stakes',
              detail:
                '"Without it, a website is a static poster: no login, no data, no logic"',
            },
            {
              status: 'info',
              text: 'Cause and effect',
              detail:
                '"The token is used everywhere, so it could get stolen. Making it expire in minutes means a stolen one is useless almost immediately."',
            },
            {
              status: 'info',
              text: 'A rule or a definition',
              detail:
                'One clause of what it is, one clause of what it buys you. Definitions get their own slide',
            },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'voice',
    label: 'Voice',
    section: CONCEPTS[2],
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="Voice"
        lead="A teacher talking, not a document"
        lesson={SESSION}
        points={[
          { text: 'Second person and first plural, always: you, your, we, our' },
          { text: 'Imperatives drive every doing-slide: Open, Run, Create, Add, Refresh' },
          { text: 'Anti-magic. Show the real code, never "it just handles it"' },
          { text: 'Name the trap by name, so the room recognises it later' },
          { text: 'Analogy openers are a fixed set: Picture, Imagine, Think of, like a' },
        ]}
      />
    ),
    notes:
      'An analogy is introduced, cashed out into the technical mapping, then dropped. Never leave one unmapped.',
  },
  {
    id: 'observable',
    label: 'Say What They Will See',
    section: CONCEPTS[2],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[2]}
        title="Say What They Will See"
        lead="An instruction that does not state its observable result is incomplete"
        lesson={SESSION}
        note={{
          kind: 'success',
          title: 'The most beginner-facing line in the guidelines',
          body: 'Without the result, a learner who is stuck has no way to tell whether the step worked.',
        }}
      >
        <StatusList
          immediate
          items={[
            { status: 'error', text: 'Refresh /admin/' },
            {
              status: 'success',
              text: 'Refresh /admin/. A new "CART" section appears in the sidebar',
            },
          ]}
        />
      </ContentNoteSlide>
    ),
  },
  {
    id: 'no-em-dash',
    label: 'Never a Spaced Em Dash',
    section: CONCEPTS[2],
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="Never a Spaced Em Dash"
        lead="Banned in every rendered string. Use a comma, a colon, a full stop or parentheses"
        lesson={SESSION}
      >
        {/*
          R3: the left column deliberately contains the banned character. It is
          the subject matter, and it is labelled "Do not" so it cannot be read as
          this deck's voice. `grep -n "—" src/decks/*.tsx` will hit here, and on
          this deck those hits are expected.
        */}
        <DataTable
          columns={[
            { label: 'Do not', weight: 1.2, dim: true },
            { label: 'Do', weight: 1.2 },
          ]}
          rows={[
            ['Heavy — RAM and CPU reserved up front', 'Heavy. RAM and CPU reserved up front'],
            ['Be lightweight — megabytes and seconds', 'Be lightweight: megabytes and seconds'],
            ['WSL 2 — every container shares it', 'WSL 2. Every container shares it'],
            [
              'all dependencies — runtime, libraries — into one unit',
              'all dependencies (runtime, libraries) into one unit',
            ],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'It applies to titles, leads, bullets, table cells, captions, chips and any string a component renders. JSX comments are exempt.',
  },
  {
    id: 'em-dash-corpus',
    label: 'The Corpus Uses One',
    section: CONCEPTS[2],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[2]}
        title="The Corpus Uses One"
        lead="487 corpus lines contain a dash. Ours contain none, and that is deliberate"
        lesson={SESSION}
        points={[
          { text: 'The reference decks reach for a dash to mark the reveal beat' },
          { text: 'The style guide used to recommend it, about once every three slides' },
          { text: 'That recommendation is struck through in the file, not deleted' },
          { text: 'Write the same beat with a full stop or a colon' },
        ]}
        note={{
          kind: 'info',
          title: 'A separator is still fine',
          body: 'The middle dot in "Install · start · verify" is fine, and so is an en dash in a numeric range like items 1–4. It is the spaced em dash connector that is out.',
        }}
      />
    ),
  },
  {
    id: 'banned-words',
    label: 'Words That Do Not Ship',
    section: CONCEPTS[2],
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="Words That Do Not Ship"
        lead="Two short lists, and both exist because of what the word does to the reader"
        lesson={SESSION}
      >
        <StatusList
          immediate
          items={[
            {
              status: 'error',
              text: '"stranger"',
              detail:
                'It reads as suspicious or threatening, which is not the meaning. Say others, anyone else, someone else',
            },
            {
              status: 'error',
              text: '"simply", "just", "obviously", "of course"',
              detail:
                'They tell a learner who is stuck that being stuck is unusual. The corpus does not use them',
            },
            {
              status: 'success',
              text: 'Can others open it?',
              detail: 'The replacement for the banned phrasing, and it is shorter',
            },
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'titles',
    label: 'Titles',
    section: CONCEPTS[2],
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="Titles"
        lead="Two or three words, topic-bare. The median across the corpus is two"
        lesson={SESSION}
        points={[
          { text: 'Testing · Update · Serializers · Virtual Environment · Seller Logic' },
          { text: 'A build sequence repeats its title verbatim across every slide' },
          { text: 'Never "part 2", "continued" or "(cont.)". The repeat is the signal' },
          { text: 'Question titles are 2 percent of the corpus, so they are an accent' },
          { text: 'Fixtures are used word for word: Quiz Time!, Test it, Recap' },
        ]}
      />
    ),
    notes: '"products/views.py" appears as a title on 92 consecutive-run slides. That is the pattern working.',
  },
  {
    id: 'one-idea',
    label: 'One Idea Per Slide',
    section: CONCEPTS[2],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[2]}
        title="One Idea Per Slide"
        lead="And one item per slide, when the items are weighed one at a time"
        lesson={SESSION}
        points={[
          { text: 'Attempts, options, approaches, failure modes: each gets its own frame' },
          { text: 'Not two on one slide and three on the next' },
          { text: 'Past four slides if the series runs that long' },
        ]}
        note={{
          kind: 'warning',
          title: 'This outranks the slide-count guideline',
          body: 'The workflow suggests 2 to 4 content slides per concept. Pacing and one idea per slide win.',
        }}
      />
    ),
  },
  {
    id: 'one-item-shape',
    label: 'The Shape That Works',
    section: CONCEPTS[2],
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="The Shape That Works"
        lead="The five-part frame for one item of a series, written down so it is not redesigned each time"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'Part', weight: 1 },
            { label: 'What goes in it', weight: 2.2 },
          ]}
          rows={[
            ['kicker', 'Attempt 3 of 5. The number is pacing, and the room can use it'],
            ['title', 'Two or three words'],
            ['lead', 'The claim being tried, in quotes'],
            ['points', 'Two bullets of what it is'],
            ['Callout', 'One, titled "Why it fails". This is a genuine teaching beat, so it is a Step'],
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'q-demo',
    label: 'Question: what else?',
    section: CONCEPTS[2],
    /*
      HARD RULE 16, DEMONSTRATED BY BEING IT.

      A `QuestionSlide` carries the question and nothing else: no bullets, no
      figure, no callout, and above all no answer. The answer is the next slide,
      which is the whole mechanism. The room commits out loud, then sees whether
      it was right.

      Do not add a figure here to "balance" the frame. Anything else on this
      slide is something to read instead of think, and that is the rule.
    */
    element: (
      <QuestionSlide
        kicker={CONCEPTS[2]}
        question="A slide poses a question to the room. What else belongs on that slide?"
        lesson={SESSION}
      />
    ),
    notes:
      'Take answers before advancing. Somebody will say "the options" or "a hint". Both are wrong, and the next slide says why.',
  },
  {
    id: 'q-answer',
    label: 'Nothing Else',
    section: CONCEPTS[2],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[2]}
        title="Nothing Else"
        lead="The previous slide was the rule, not an example of it"
        lesson={SESSION}
        points={[
          { text: 'No bullets, no figure, no callout, and no answer' },
          { text: 'The answer is always the next slide' },
          { text: 'One question per slide. Split a compound question' },
          { text: 'qualifier takes one short line, for a constraint needed to answer' },
        ]}
        note={{
          kind: 'warning',
          title: 'Why a compound question fails',
          body: 'Asked "does this install the same version today, and again next month?", a room answers the easy half and never considers the second.',
        }}
      />
    ),
  },
  {
    id: 'beginner',
    label: 'Write for Someone New',
    section: CONCEPTS[2],
    element: (
      <ContentSlide
        kicker={CONCEPTS[2]}
        title="Write for Someone New"
        lead="Every point must be readable by somebody who joined the course last week"
        lesson={SESSION}
        points={[
          { text: 'No unexplained jargon in a fragment. A fragment has no room to define' },
          { text: 'Define at first use, on the frame where the word first appears' },
          { text: 'A definition names three things: what, why here, where they met it' },
          { text: 'Concrete before abstract. An assembly line before a pipeline' },
          { text: 'Expand an acronym the first time, always' },
        ]}
      />
    ),
    notes: 'The test: if a fragment sends the reader to a search engine, it is not finished.',
  },

  /* ---------------------------------------------------------------- */
  /* Concept 4 — Choosing the Form                                     */
  /* ---------------------------------------------------------------- */
  {
    id: 'break-form',
    label: '04 Choosing the Form',
    section: CONCEPTS[3],
    element: (
      <SectionBreakerSlide
        index={4}
        title={CONCEPTS[3]}
        subtitle="Which shape the content takes"
        lesson={SESSION}
      />
    ),
    notes: 'The kit renders every shape a deck needs. The work is choosing, not building.',
  },
  {
    id: 'form-argument',
    label: 'The Form From the Argument',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="The Form Comes From the Argument"
        lead="Ask what the slide argues, then pick the form that draws that argument"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'The argument', weight: 2 },
            { label: 'The form', weight: 1.3 },
            { label: 'In the kit', weight: 1.1, dim: true },
          ]}
          rows={[
            ['An ordered procedure', 'numbered steps', 'StepList'],
            ['A process with branches', 'a flow', 'FlowChart'],
            ['Rows that each carry a verdict', 'a list with status rails', 'StatusList'],
            ['Things at different depths of one system', 'stacked layers', 'LayerStack'],
            ['Two or three items compared, where sameness is the point', 'a uniform row', 'CardGrid'],
            ['One thing reaching into many places', 'a hub with spokes', 'points-lab, no winner yet'],
            ['A set of answers whose names are the content', 'set as type, no boxes', 'features-lab, no winner yet'],
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The last two rows are lab components, not kit ones. STYLE_GUIDE names them as though they can be imported, and they cannot. Worth fixing in that file.',
  },
  {
    id: 'not-a-grid',
    label: 'Not Everything is a Grid',
    section: CONCEPTS[3],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[3]}
        title="Not Everything is a Grid"
        lead="A grid draws n things of equal weight, and nothing else"
        lesson={SESSION}
        points={[
          { text: 'Six cards, one size, one white, one tone, an icon and two lines each' },
          { text: 'It reads as a table somebody drew boxes around' },
          { text: 'Nothing leads, nothing has rhythm, the room takes it in as one grey mass' },
        ]}
        note={{
          kind: 'warning',
          title: 'Corrected twice on one slide, and the second one is the rule',
          body: 'First: "all cards having same design, it is not visually appealing." Then: "instead of cards you can use a different design altogether. Why should we be constrained to cards?"',
        }}
      />
    ),
  },
  {
    id: 'numbering',
    label: 'Numbering Makes a Claim',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Numbering Makes a Claim"
        lead="Number a set only when you can say what the number means"
        lesson={SESSION}
      >
        <StatusList
          immediate
          items={[
            {
              status: 'error',
              text: '01 through 06 on six job titles',
              detail: 'Claims a rank or a sequence those six do not have, and it slips review because it looks like tidiness',
            },
            {
              status: 'success',
              text: 'An agenda',
              detail: 'Numbered because the session runs in that order',
            },
            {
              status: 'success',
              text: 'Attempt 3 of 5',
              detail: 'Numbered because "two to go" is useful pacing for the room',
            },
            {
              status: 'error',
              text: 'Roles, fields, tools, benefits',
              detail: 'Not ordered, not ranked. A plain list is the honest form',
            },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'And do not invent structure the content does not have. A quadrant claims two axes, a segmented bar claims proportions, a flow claims an order.',
  },
  {
    id: 'confusable',
    label: 'Four Pairs That Get Confused',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Four Pairs That Get Confused"
        lead="Picking the wrong one of these is the commonest way content ships wrong"
        lesson={SESSION}
      >
        <DataTable
          columns={[
            { label: 'If the content is', weight: 2 },
            { label: 'Use', weight: 1.3 },
            { label: 'Not', weight: 1.2, dim: true },
          ]}
          rows={[
            ['The shape of a construct or a command', 'CodeSyntaxSlide, CommandSyntaxSlide', 'CodeBuildSlide, Terminal'],
            ['A real file built up, or a real command run', 'CodeBuildSlide, Terminal', 'the syntax types'],
            ['A list where rows carry verdicts', 'StatusPointsSlide', 'four stacked Callouts'],
            ['An exchange, up to four short turns', 'ChatSlide', 'ConversationSlide'],
            ['An exchange, five or more turns', 'ConversationSlide', 'ChatSlide'],
            ['A question whose answer is the next slide', 'QuestionSlide', 'QuestionPointsSlide'],
            ['A question answered by 2 to 3 points on one frame', 'QuestionPointsSlide', 'ContentSlide'],
          ]}
        />
      </ContentSlide>
    ),
  },
  {
    id: 'terminals',
    label: 'One Panel Per Terminal',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="One Panel Per Terminal"
        lead="Render VS Code’s terminal, and every command carries its prompt path"
        lesson={SESSION}
        points={[
          { text: 'The folder is teaching content, not decoration' },
          { text: '"Wrong folder" is the first error learners hit' },
          { text: 'Captures come from the integrated terminal, never a separate shell' },
          { text: 'Never invent output. If it was not run, do not print it' },
        ]}
      >
        <Terminal
          path={'C:\\ecommerce\\backend'}
          fontSize={12}
          lines={[
            { text: 'python manage.py runserver', kind: 'cmd' },
            { text: 'Watching for file changes', kind: 'out' },
            { text: 'Starting server at 127.0.0.1:8000', kind: 'ok' },
          ]}
          caption="The prompt path is part of the teaching"
        />
      </ContentSlide>
    ),
  },
  {
    id: 'two-terminals',
    label: 'Two Terminals, Two Panels',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Two Terminals, Two Panels"
        lead="Never stack two prompts in one panel, and never merge them into one command list"
        lesson={SESSION}
      >
        <div className="grid grid-cols-2 gap-6">
          <Terminal
            path={'C:\\ecommerce\\backend'}
            fontSize={13}
            lines={[{ text: 'python manage.py runserver', kind: 'cmd' }]}
            caption="Terminal 1 · the API"
          />
          <Terminal
            path={'C:\\ecommerce\\frontend'}
            fontSize={13}
            lines={[{ text: 'npm run dev', kind: 'cmd' }]}
            caption="Terminal 2 · the app"
          />
        </div>
      </ContentSlide>
    ),
    notes: 'Two paths, two captions, two panels. The learner has both open, so the slide should too.',
  },
  {
    id: 'code-not-terminal',
    label: 'A File is Not a Terminal',
    section: CONCEPTS[3],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[3]}
        title="A File is Not a Terminal"
        lead="CodeBlock is for files. Traffic lights, a filename, line numbers"
        lesson={SESSION}
        note={{
          kind: 'note',
          title: 'A backslash in a JSX attribute is literal',
          body: 'Doubled inside braces and quotes, single inside a plain attribute. 19 doubled paths went to review on one session.',
        }}
      >
        <CodeBlock
          language="python"
          filename="products/serializers.py"
          fontSize={16}
          highlight={[4]}
          code={`from rest_framework import serializers
from .models import Product

class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = ['id', 'name', 'price']`}
        />
      </ContentNoteSlide>
    ),
  },
  {
    id: 'figures-argue',
    label: 'A Figure Argues',
    section: CONCEPTS[3],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[3]}
        title="A Figure Argues"
        lead="It earns its place by making an argument a sentence cannot"
        lesson={SESSION}
        points={[
          { text: 'It must depict this slide’s own concept, not the topic in general' },
          { text: 'A container diagram on a networking slide is a decoration' },
          { text: 'Check what the asset draws, not what its name suggests' },
          { text: 'An asset built for another session encodes that session’s problem' },
        ]}
        note={{
          kind: 'success',
          title: 'When nothing fits',
          body: 'Leave the slide typographic and record the missing asset as outstanding work. A blank but honest divider beats a misleading picture, and the four dividers in this deck are exactly that.',
        }}
      />
    ),
  },
  {
    id: 'parallel-reveal',
    label: 'Text and Visual Together',
    section: CONCEPTS[3],
    /*
      HARD RULE 6, DEMONSTRATED BY BEING IT.

      `ContentSlide` with BOTH `points` and `children` takes the kit's parallel
      path: the bullets get `immediate` so they stagger on entry instead of
      gating on `Step`, and the figure is wrapped in `RevealGroup` + `Reveal`.

      THE CHECK FOR THIS SLIDE IS TO LOAD IT WITHOUT `?all`. Both columns must be
      fully visible at step 0 and the counter must show no leftover steps. If a
      later edit wraps the figure in a `Step`, this slide starts contradicting the
      rule it states.
    */
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Text and Visual Arrive Together"
        lead="They are one idea, so they are never sequenced"
        lesson={SESSION}
        points={[
          { text: 'BulletList beside a visual takes immediate' },
          { text: 'The visual is wrapped in Reveal, never in Step' },
          { text: 'A component with its own build takes stepped={false}' },
          { text: 'A supporting Callout takes asStep={false}' },
          { text: 'Step is kept for a genuine teaching beat, where the pause is the point' },
        ]}
      >
        <CanvasMap focus="reserved" width={400} />
      </ContentSlide>
    ),
    notes:
      'Load this slide without ?all. Both halves are already there, and the counter shows no steps. That is the rule passing its own check.',
  },
  {
    id: 'motion-tier',
    label: 'The Explanatory Tier',
    section: CONCEPTS[3],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[3]}
        title="The Explanatory Tier"
        lead="Roughly double the numbers a UI animation skill will give you, and that is correct here"
        lesson={SESSION}
        note={{
          kind: 'info',
          title: 'Why double',
          body: 'A UI animation sits between a person and what they came for. Nobody triggers a slide.',
        }}
      >
        <DataTable
          compact
          columns={[
            { label: 'Beat', weight: 1.4 },
            { label: 'Here', weight: 0.8 },
            { label: 'A UI would use', weight: 1.1, dim: true },
          ]}
          rows={[
            ['Entrance', '520ms', 'about 300ms'],
            ['Stagger between items', '130ms', '30 to 80ms'],
            ['A line drawing itself', '860ms', 'rarely used'],
            ['A whole figure assembled', 'about 2.4s', 'not a thing'],
            ['A section divider', 'a crossfade', 'a crossfade'],
          ]}
        />
      </ContentNoteSlide>
    ),
    notes:
      'Session 6 figures were first built at UI speed and rejected as too fast. Dividers stay a crossfade: a frame seen five times in one deck belongs in the near-imperceptible tier.',
  },
  {
    id: 'screenshots',
    label: 'Cropped to the Point',
    section: CONCEPTS[3],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[3]}
        title="Cropped to the Point"
        lead="A raw capture is evidence, not a slide asset"
        lesson={SESSION}
        points={[
          { text: 'Crop to the region that carries the claim. This part is mandatory' },
          { text: 'Highlight only when the crop is not enough, and never more than one box' },
          { text: 'A deck where every capture wears a box teaches the room to ignore boxes' },
          { text: 'Crop to remove noise, never to remove context that changes the meaning' },
          { text: 'Keep the full uncropped original beside the cropped asset' },
        ]}
        note={{
          kind: 'warning',
          title: 'Never retouch the output',
          body: 'If a transcript is wrong or dirty, run the command again and capture it again. Editing pixels to say what you wanted is the mockup this workflow forbids.',
        }}
      />
    ),
    notes:
      'This slide carries no example capture on purpose: there is no real screenshot in this project, and inventing one would break the rule the slide states.',
  },
  {
    id: 'logos',
    label: 'A Technology Carries its Logo',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="A Named Technology Carries its Logo"
        lead="A learner scanning a diagram finds the mark before they finish reading the label"
        lesson={SESSION}
        points={[
          { text: 'PNG into public/assets/tech/, named after the technology, lowercase' },
          { text: 'A light-on-dark variant takes the -white suffix' },
          { text: 'An existing SVG already on a slide satisfies this. Do not re-fetch it' },
          { text: 'The mark supports the label. It never replaces it' },
        ]}
      >
        {/* Real files, checked on disk. Rule 12's own worst case was four
            references to logos that were not there, shipped in every deck copied
            from the base template. */}
        <div className="flex flex-col gap-4">
          {[
            { src: '/assets/tech/django.png', name: 'Django' },
            { src: '/assets/tech/react.png', name: 'React' },
            { src: '/assets/tech/python.png', name: 'Python' },
          ].map((t) => (
            <span key={t.name} className="flex items-center gap-3">
              <img src={t.src} alt="" draggable={false} className="h-9 w-9 object-contain" />
              <span className="font-heading text-body-lg font-bold text-ink">{t.name}</span>
            </span>
          ))}
        </div>
      </ContentSlide>
    ),
  },
  {
    id: 'assets-library',
    label: 'The Library First',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="The Library First"
        lead="slide-kit/assets is the one place images are kept. Look there before fetching anything"
        lesson={SESSION}
        points={[
          { text: 'If it is there, copy it into the session’s public/assets' },
          { text: 'If it is not, fetch it into the library, then copy it across' },
          { text: 'Never fetch straight into a session' },
          { text: 'A deck cannot read the library at runtime, so the copy is a working copy' },
        ]}
      >
        <FileTree
          root="slide-kit/assets"
          width={420}
          entries={[
            { name: 'tech/', folder: true, note: 'technology logos' },
            { name: 'illustrations/', folder: true, note: 'dividers and scenes' },
            { name: 'brand/', folder: true, note: 'the NxtWave mark' },
            { name: 'quiz/', folder: true, note: 'quiz decorations' },
            { name: 'README.md', note: 'the inventory and the naming convention' },
          ]}
          caption="Each session's public/assets is byte-identical to what it copied"
        />
      </ContentSlide>
    ),
    notes:
      'This exists because the opposite happened: each session kept its own assets, they drifted, and the base template shipped references to files that lived in one session only.',
  },
  {
    id: 'verify',
    label: 'Verify by Rendering',
    section: CONCEPTS[3],
    element: (
      <ContentNoteSlide
        kicker={CONCEPTS[3]}
        title="Verify by Rendering"
        lead="Reading your own JSX is not verification. Four harnesses, and none of them is optional"
        lesson={SESSION}
        note={{
          kind: 'warning',
          title: 'The harnesses cannot see inside a figure',
          body: 'All three measure DOM rectangles, and an svg is one rectangle to every one of them. So screenshot every custom figure and look at the image.',
        }}
      >
        <Terminal
          path={'~/session'}
          fontSize={14}
          lines={[
            { text: 'node video-safe.mjs', kind: 'cmd' },
            { text: 'CLEAN: nothing is placed in the reserved video area.', kind: 'ok' },
            { text: 'node qa.mjs', kind: 'cmd' },
            { text: 'node align-check.mjs', kind: 'cmd' },
            { text: 'node fit-check.mjs', kind: 'cmd' },
          ]}
          caption="Run the first three in parallel. Sequentially they take three times as long for nothing"
        />
      </ContentNoteSlide>
    ),
    notes:
      'video-safe and qa pull in opposite directions: every pixel a fix adds at the top is a pixel lost at the bottom. Re-run them as a pair after any layout change.',
  },
  {
    id: 'dependents',
    label: 'Chase the Dependents',
    section: CONCEPTS[3],
    element: (
      <ContentSlide
        kicker={CONCEPTS[3]}
        title="Chase the Dependents"
        lead="Changing content changes more than one file, and the others do not complain"
        lesson={SESSION}
      >
        {/*
          CAPPED AT 840px, WHICH IS NOT A TASTE DECISION.

          `StatusList` prints its verdict chip on the RIGHT of each row. Run full
          width, that chip landed at x 1114..1196, y 205..229, inside the reserved
          video rectangle, and `video-safe.mjs` reported this slide as the only
          intrusion in the deck. The rectangle starts at x=913, so a block ending
          before it can be as tall as the well allows. That is the third lever in
          the skill's own table, and it is the right one here because this list is
          tall rather than wide.
        */}
        <StatusList
          className="max-w-[840px]"
          immediate
          items={[
            { status: 'warning', text: 'Quizzes that test material you removed', detail: 'A quiz may only test what the deck taught' },
            { status: 'warning', text: 'Figures whose labels cite it' },
            { status: 'warning', text: 'Agenda items, divider subtitles, key takeaways', detail: 'A five stage journey that is now three stages' },
            { status: 'warning', text: 'slideCount in deck.config.json', detail: 'A stale count makes every sweep skip the tail of the deck' },
            { status: 'info', text: 'Anything reusable goes back into the kit, and out as a PR' },
          ]}
        />
      </ContentSlide>
    ),
    notes:
      'The syntax-anatomy figure was hand-rolled three times before it became SyntaxBreakdown in the kit. That is the cost of not doing the last row.',
  },

  /* ---------------------------------------------------------------- */
  /* Back frame                                                        */
  /* ---------------------------------------------------------------- */
  {
    id: 'quiz',
    label: 'Quiz Time!',
    /*
      HARD RULE 18, AND PLAN DECISION D1.

      The rule is written for a session deck, where this frame marks the switch
      from listen to answer and the questions come from the quiz tool. A
      reference deck has neither. It is kept, in its mandated slot immediately
      before Key Takeaways, because including it demonstrates the type and
      satisfies the rule at the same time.

      The frame carries NO question, NO options and NO answer, by design. The
      subtitle names what is about to be examined without asking anything.
    */
    element: (
      <QuizTimeSlide
        subtitle="Four zones of a canvas, nine type sizes, one blue, and the two rules that pull in opposite directions"
        lesson={SESSION}
      />
    ),
  },
  {
    id: 'takeaways',
    label: 'Key Takeaways',
    /* Hard rule 20: the four strings are `CONCEPTS`, and the agenda reads the
       same array. Neither slide owns them, so they cannot drift. */
    element: (
      <KeyTakeawaysSlide
        lesson={SESSION}
        points={[
          { text: CONCEPTS[0], sub: 'The frame every slide sits in' },
          { text: CONCEPTS[1], sub: 'The two sets of tokens' },
          { text: CONCEPTS[2], sub: 'What the words have to do' },
          { text: CONCEPTS[3], sub: 'Which shape the content takes' },
        ]}
      />
    ),
    notes: 'The room was promised exactly these four at the start. This frame is the receipt.',
  },
  {
    id: 'thanks',
    label: 'Thank you',
    element: (
      <ThankYouSlide
        message="Every rule here is indexed in RULES.md, and each one names the deck that shipped wrong because of it"
        lesson={SESSION}
      />
    ),
  },
]
