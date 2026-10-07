import type { ReactNode } from 'react'
import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, ContentSlide, ThankYouSlide } from '@/slides'
import { BulletList } from '@/ui/content'
import { colors } from '@/design/tokens'
import { RevealGroup, Reveal } from '@/motion/Reveal'
import { SealedBoundary, sealedBoundaryHeight } from '@/ui/isolation/SealedBoundary'
import { ReachTable, reachTableHeight } from '@/ui/isolation/ReachTable'
import { LoneHost, loneHostHeight } from '@/ui/isolation/LoneHost'
import { BlockedFan, blockedFanHeight } from '@/ui/isolation/BlockedFan'
import type { IsolationFigureProps } from '@/ui/isolation/isolationFigure'

/**
 * ISOLATION FIGURE LAB
 *
 * Four candidates for a figure the kit does not have: ONE artefact exists on
 * exactly ONE machine, and the machines that would want it cannot get it. Each
 * renders the SAME fixture beside the SAME points column, so the only variable
 * between slides is the drawing. `flow-lab` established the pattern and
 * `comparison-lab` repeated it, and it is what makes choosing cheap.
 *
 * THE FIXTURE IS SESSION 6 SLIDE 8 (`c1-and-nowhere-else`), VERBATIM, because
 * that is the slide a reviewer sent back: four full-width bullets with an empty
 * right half, and a fourth bullet that is a two-line paragraph sitting beside
 * three short ones. A fixture invented for the lab would be judged on how well
 * it suits the lab.
 */

export const isolationLabMeta: DeckMeta = {
  title: 'Isolation Figure Variants',
  course: 'Kit lab',
  lesson: 'Isolation Figure Variants',
  presenter: 'NxtWave',
}

const FOOTER = 'Isolation Figure Variants'

const TITLE = 'And Nowhere Else'
const LEAD = "It lives in this machine's local image store, and in no other place"

/*
  THE THREE SHORT POINTS, VERBATIM FROM THE SESSION.

  They stay in the points column on every candidate slide. That is deliberate and
  it produces the lab's sharpest question: THREE OF THE FOUR CANDIDATES REPEAT
  THEM. `SealedBoundary`, `LoneHost` and `BlockedFan` each print the machine and
  what it cannot do, so the slide says the same three things twice.

  It is left in rather than tuned away because a human is choosing, and the honest
  form of the choice includes what the figure costs the column. The two ways out
  are both real edits: drop the figure's own verb phrases and let the column carry
  them, or drop the column to the conclusion alone and let the figure carry the
  three. Which one is right depends on the candidate, so it is not the lab's call.
*/
const POINTS = [
  { text: 'A teammate cannot run it' },
  { text: 'An automation server cannot test it' },
  { text: 'A remote server cannot deploy it for real users' },
]

/*
  THE FOURTH BULLET, VERBATIM, INCLUDING ITS `<strong>` — AND IT IS NOT INSIDE
  ANY FIGURE.

  The first pass passed it to every candidate as a `caption`, where it rendered at
  13px: the concept's punchline became the smallest text on the frame. It is the
  reason the slide exists, so it is the slide's, at 19px, across the full width
  under both columns. `isolationFigure.ts` has no `caption` prop for exactly this,
  and the reason is written down there.
*/
const CONCLUSION = (
  <>
    {'"Runs identically on any machine" is true only for machines that '}
    <strong>have</strong>
    {' the image, and right now that is exactly one'}
  </>
)

/*
  THE FIGURE FIXTURE, WRITTEN ONCE.

  `ref` is `nxttrendz-backend:latest` and not an invented tag: it is the exact
  repository and tag the PREVIOUS slide's `docker images` output prints, so the
  figure names the thing the room has just been shown rather than a stand-in.

  `cannot` carries the verb phrase WITHOUT the negation, because the figure owns
  that word. See `isolationFigure.ts`.
*/
const FIXTURE: Pick<IsolationFigureProps, 'artefact' | 'holder' | 'recipients'> = {
  artefact: { label: 'The image', ref: 'nxttrendz-backend:latest', icon: 'file' },
  holder: { label: 'This machine', note: 'Local image store', icon: 'devices' },
  recipients: [
    { id: 'teammate', label: 'A teammate', cannot: 'run it' },
    { id: 'ci', label: 'An automation server', cannot: 'test it' },
    { id: 'prod', label: 'A remote server', cannot: 'deploy it for real users' },
  ],
}

/**
 * A FOURTH RECIPIENT THAT BELONGS TO NO SESSION, for the clamp-proof slide only.
 * Session 6 slide 8 has three, and three is the ceiling every candidate here
 * states. This exists to push one candidate past it on purpose.
 */
const LAB_ONLY_FOURTH = {
  id: 'joiner',
  label: 'A new joiner',
  cannot: 'start on their first day',
}

/**
 * THE SHARED TOP DATUM, AND WHY THE LAB LAYS OUT ITS OWN GRID.
 *
 * `ContentSlide` handed both `points` and `children` puts them in a
 * `grid-cols-[1.4fr_1fr] items-center`, so each column is centred in the row
 * INDEPENDENTLY. Every candidate is taller than three bullets, so the figure ran
 * 87 to 100px above the first point and the same distance below the last, and the
 * two halves read as two unrelated blocks. The review caught it on all three of
 * the candidate slides.
 *
 * So the lab builds the row itself: an even split, one 40px gutter, and
 * `items-start`. The figure's first row and the first point now sit on ONE
 * horizontal line and stay there whatever either column does, which is what a
 * datum means. Slides 7 and 8 stress it with a one-point and a five-point
 * fixture, because a datum that only holds at the length it was designed at is a
 * coincidence.
 *
 * `PT` is the optical correction and it is small on purpose: `BulletList`'s first
 * row is a 22px line inside a 40px marker chip, so its text baseline sits about
 * 9px below the top of its own box, while a figure's first card starts at its
 * border. Aligning the BOXES leaves the type looking 9px high; aligning the TYPE
 * is what the eye reads as level.
 *
 * An even split rather than the kit's 1.4fr / 1fr is the other half of the fix.
 * At 460px every candidate had to wrap its verb phrase, and the first pass
 * answered that by shrinking type to 11px. The type floor is fixed, so the width
 * moved instead: 552px a side. See `HALF_WIDTH`.
 */
const PT = 9

/**
 * VERTICAL CENTRING, AND THE CLAMP THAT KEEPS IT OUT OF THE VIDEO RESERVE.
 *
 * The block is centred, and it always was: `ContentSlide`'s well is a
 * `flex-1 justify-center` column, so the two-column row plus the conclusion line
 * sits with equal gaps above and below. Measured, every candidate: skew 0px.
 * **Centring the BLOCK is not the same as `items-center` on the GRID**, which is
 * what put the figures 87 to 100px above the first bullet on the first pass. The
 * grid stays `items-start`; the unit it forms is what centres.
 *
 * THE PROBLEM CENTRING CREATES. The well runs y=217..656, and 217 IS ALREADY
 * THREE PIXELS INSIDE the instructor-video reserve (x 913..1280, y 0..220). A
 * block taller than the well's 439px does not clip, it overflows BOTH ends
 * equally, so the taller a figure gets the further its top rises past y=220. That
 * is exactly how `SealedBoundary` came to sit at y=217 on the first pass, and
 * shrinking the figure fixed that instance without fixing the class.
 *
 * So the block is centred UNLESS centring would carry the figure above the
 * reserve's floor, and clamped to the floor when it would:
 *
 *   figure top = WELL_TOP + (WELL_H - blockH) / 2 + PT
 *   clamp      = max(0, VIDEO_FLOOR - that)
 *   paddingTop = clamp * 2
 *
 * **The doubling is not a fudge.** Padding grows the centred box, so the box
 * re-centres and the content inside it only moves down by half of what was
 * added. `2 * clamp` moves the content down by exactly `clamp`.
 *
 * IT IS ARITHMETIC FROM CONSTANTS AND NEVER A MEASUREMENT. Every candidate
 * exports its own height (`sealedBoundaryHeight` and friends), because a
 * measure-then-render pass risks the dev server and the single-file build
 * disagreeing, which is the trap `points-lab` records. A figure's stated height
 * is its worst case, so the clamp can be too cautious by a rounding and never
 * too late.
 *
 * WHAT THE CLAMP CANNOT DO is make room. On slide 9, four recipients, it holds
 * the figure at exactly y=220 and the conclusion line then runs past the well's
 * floor. That is the honest report of a figure past its ceiling, and it is why
 * `SealedBoundary`'s "worst at" says three.
 */
const WELL_TOP = 217
const WELL_H = 439
const VIDEO_FLOOR = 220
/** `mt-6` + the 2px rule + `pt-3` + one 19px line on 1.5. Measured. */
const CONCLUSION_H = 67

function Split({
  points,
  figureH,
  children,
}: {
  points: { text: ReactNode }[]
  /** The figure's own stated height. Every candidate exports one. */
  figureH: number
  children: ReactNode
}) {
  const blockH = figureH + PT + CONCLUSION_H
  const naturalFigureTop = WELL_TOP + (WELL_H - blockH) / 2 + PT
  const clamp = Math.max(0, Math.round(VIDEO_FLOOR - naturalFigureTop))

  return (
    <div data-block className="w-full" style={{ paddingTop: clamp * 2 }}>
      <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] items-start gap-x-10">
        <BulletList items={points} tone="brand" immediate />
        {/*
          `data-figure-col` is what `centre-check.mjs` measures: it reads this
          column's rect and its single element child's rect and prints the left
          and right gap. Centring a figure in a column is not something an eye
          judges reliably at a 4px skew, and the review asked for the numbers.
        */}
        <div data-figure-col style={{ paddingTop: PT }}>
          {children}
        </div>
      </div>
      {/*
        THE CONCLUSION IS THE SLIDE'S, FULL WIDTH, AT 19px.

        Its own group so it lands after both columns rather than with the first
        bullet: it is the sentence the instructor arrives at, not the one they
        open on.
      */}
      <RevealGroup delayChildren={0.42}>
        <Reveal dir="up">
          <p
            className="mt-6 border-t-2 pt-3 text-body leading-[1.5]"
            style={{ borderColor: colors.line, color: colors.ink }}
          >
            {CONCLUSION}
          </p>
        </Reveal>
      </RevealGroup>
    </div>
  )
}

export const isolationLabDeck: SlideDef[] = [
  {
    id: 'brand',
    label: 'Brand',
    transition: 'fade',
    element: <BrandSlide greeting="Isolation lab" lesson={FOOTER} />,
    notes:
      'Four candidates for a figure the kit does not have. Slide 2 is what session 6 shipped, so judge every other slide against it rather than against an idea of what good looks like. The one question every candidate is judged on: does it assert that the three machines DO NOT HAVE the image, or could a viewer read it as "they have it, dimly"? The second question is legibility, and the floor is 16px.',
  },
  {
    id: 'shipped',
    section: 'What shipped',
    label: '0 · Four bullets',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="What shipped"
        title={TITLE}
        lead={LEAD}
        points={[...POINTS, { text: CONCLUSION }]}
      />
    ),
    notes:
      'SESSION 6 SLIDE 8, UNCHANGED. Two faults, and they are the brief for everything after this slide. ONE: the right half of the canvas is empty, and the reviewer asked for a content-related element there. TWO: the fourth bullet is a two-line paragraph beside three short ones, so it reads as a bullet that does not match its siblings when what it actually is is the conclusion drawn from them. Note also what the slide does NOT have: any picture of the boundary the whole concept turns on. The word "local" is carried entirely by the lead.',
  },
  {
    id: 'sealed',
    section: 'Candidates',
    label: '1 · SealedBoundary',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Candidate 1" title={TITLE} lead={LEAD}>
        <Split points={POINTS} figureH={sealedBoundaryHeight(FIXTURE.recipients.length)}>
          <SealedBoundary {...FIXTURE} />
        </Split>
      </ContentSlide>
    ),
    notes:
      'THE ONLY ONE THAT DRAWS THE CAUSE. The image sits inside a dashed machine boundary, the three machines sit outside it, and the single route out is cut once, at the boundary edge. One cut and not three on purpose: three failures invite the question of whether a fourth attempt might work, while one cut at the exit says the boundary is the reason and the three rows are consequences of it. The line past the cut stays dashed and reaches every row, which is the delivery that was wanted and never happened. WORST AT: repeating the negation, once per row, on a slide whose column already says "cannot" three times. It is also the tallest of the four at about 341px, and four recipients would not fit the well.',
  },
  {
    id: 'reach',
    section: 'Candidates',
    label: '2 · ReachTable',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Candidate 2" title={TITLE} lead={LEAD}>
        <Split points={POINTS} figureH={reachTableHeight(FIXTURE.recipients.length)}>
          <ReachTable {...FIXTURE} />
        </Split>
      </ContentSlide>
    ),
    notes:
      'THE RESTRAINED ANSWER, and the only one that prints the negation once, as a column heading over the three rows it governs. One occupied slot and three empty ones, and the slot difference is a PRESENCE difference rather than a colour difference, so it survives greyscale and a bad projector. The count under it is derived from the fixture and never typed. WORST AT: it draws no cause. Nothing here says why the three slots are empty, so the figure is evidence for a sentence rather than an argument of its own. It also looks like DataTable and is not one: three of its four rows are the same fact, and a room trained on this deck will scan it for differences that are not there.',
  },
  {
    id: 'lone',
    section: 'Candidates',
    label: '3 · LoneHost',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Candidate 3" title={TITLE} lead={LEAD}>
        <Split points={POINTS} figureH={loneHostHeight()}>
          <LoneHost {...FIXTURE} />
        </Split>
      </ContentSlide>
    ),
    notes:
      'THE STRICTEST READING OF CONTENT RULE 8. Four identical frames with a slot in the same place, and the only difference is that one slot has something in it. No dimming, no crossing out, no connectors at all: a severed connector still draws a relationship, where an empty slot draws none, which is the literal truth of a build that has run once on one laptop. WORST AT: three equal frames in a row claim the three machines are peers, and a teammate laptop, an automation server and a production host are three different kinds of thing at three different stakes. It is also the family worst fit for the 16px floor, because a 177px frame takes two lines for a machine name and three for a verb phrase.',
  },
  {
    id: 'blocked',
    section: 'Candidates',
    label: '4 · BlockedFan',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Candidate 4" title={TITLE} lead={LEAD}>
        <Split points={POINTS} figureH={blockedFanHeight(FIXTURE.recipients.length)}>
          <BlockedFan {...FIXTURE} />
        </Split>
      </ContentSlide>
    ),
    notes:
      'THE CONTROL, AND IT IS HERE TO BE TESTED RATHER THAN TO WIN. FanOut is the figure an author reaches for on this slide because the nouns match, and it argues the exact opposite of the slide. This is the tempting fix built properly: keep the fan, break the connectors. The question the lab asks is whether inverting a figure inverts what a room reads off it, or whether the SHAPE keeps saying "one becomes many" whatever is drawn on the lines. One thing it does that FanOut cannot: the source is the LOUD box here, where FanOut draws its source quiet on purpose. WORST AT: its own shape. A fan is a picture of distribution, and a 28px cut mark is asked to reverse a reading the whole composition has already made.',
  },
  {
    /*
      THE DATUM STRESS TESTS. Same candidate, same slide, two fixture lengths.

      `SealedBoundary` is the one under test because it is the tallest candidate
      and therefore the one whose overhang was worst before the datum was fixed.
      If the figure's first row moves relative to the first point between slide 7
      and slide 8, the datum is a coincidence and not a datum.
    */
    id: 'stress-one',
    section: 'Datum stress',
    label: '5 · One point',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Datum stress" title={TITLE} lead={LEAD}>
        <Split points={[POINTS[0]]} figureH={sealedBoundaryHeight(1)}>
          <SealedBoundary {...FIXTURE} recipients={[FIXTURE.recipients[0]]} />
        </Split>
      </ContentSlide>
    ),
    notes:
      'ONE POINT, ONE RECIPIENT. The figure is now SHORTER than it is on slide 3 and the column is one line. The check: the top of the boundary and the first bullet still share a line. Under the kit ContentSlide grid, with items-center, this is the case where the short column would float to the middle of a tall figure.',
  },
  {
    id: 'stress-five',
    section: 'Datum stress',
    label: '6 · Five points',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Datum stress" title={TITLE} lead={LEAD}>
        <Split
          points={[
            ...POINTS,
            { text: 'A laptop with no Docker installed cannot open it' },
            { text: 'A phone cannot do anything with it at all' },
          ]}
          figureH={sealedBoundaryHeight(FIXTURE.recipients.length)}
        >
          <SealedBoundary {...FIXTURE} />
        </Split>
      </ContentSlide>
    ),
    notes:
      'FIVE POINTS, THREE RECIPIENTS. Now the COLUMN is the taller half, which is the opposite imbalance to slide 3. The two extra points are lab-only stress copy and belong to no session. The check is the same one: the top of the boundary and the first bullet share a line, and the conclusion still clears the footer. It does not: five points plus this figure plus the conclusion is past the well, and that is the honest answer to "how many points can sit beside this family" rather than a defect in the datum.',
  },
  {
    /*
      THE CLAMP FIRING. Four recipients, which is one past `SealedBoundary`'s
      stated ceiling, so the block is 497px in a 439px well.

      Centred and unclamped the figure's top would land at y=197, twenty-three
      pixels inside the instructor-video reserve. The clamp adds 46px of top
      padding, the content moves down by 23, and the figure's top lands on
      exactly y=220.

      IT DOES NOT MAKE ROOM, and it is not supposed to: the conclusion line now
      runs past the well's floor. A figure past its ceiling should look past its
      ceiling. This slide is the proof the guard fires AND the reason the
      candidate's "worst at" entry says three recipients.
    */
    id: 'clamp-proof',
    section: 'Datum stress',
    label: '7 · Clamp fires',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Datum stress" title={TITLE} lead={LEAD}>
        <Split points={POINTS} figureH={sealedBoundaryHeight(4)}>
          <SealedBoundary
            {...FIXTURE}
            recipients={[...FIXTURE.recipients, LAB_ONLY_FOURTH]}
          />
        </Split>
      </ContentSlide>
    ),
    notes:
      'THE VIDEO-RESERVE CLAMP, FIRING. Four recipients puts the block at 497px in a 439px well, so centring alone would overflow upward and print the boundary at y=197, inside the reserve at x 913..1280 y 0..220. The clamp holds the figure at exactly y=220 instead. Note what it cannot do: the conclusion line now runs past the well floor, because a clamp moves a block and does not shrink it. The fourth recipient is lab-only stress copy and belongs to no session.',
  },
  {
    id: 'thankyou',
    label: 'Thank you',
    element: <ThankYouSlide lesson={FOOTER} />,
    notes:
      'The decision goes in this lab CLAUDE.md, with what each runner-up was worse at. It is OPEN: a human picks.',
  },
]
