import type { DeckMeta, SlideDef } from '@/deck/types'
import { BrandSlide, ContentSlide } from '@/slides'
import { DataTable } from '@/ui'
import { NestedSpans } from '@/ui/NestedSpans'
import { StopPoints } from '@/ui/StopPoints'
import { ThreeLanes } from '@/ui/ThreeLanes'
import { ReachBands } from '@/ui/ReachBands'
import type { CicdReachProps } from '@/ui/cicdReach'

/**
 * CI/CD REACH LAB
 *
 * Four candidates for ONE figure, each rendering the SAME fixture, so the only
 * variable between slides is the drawing. `flow-lab` established the pattern and
 * `comparison-lab` repeated it; it is what makes choosing cheap.
 *
 * THE DESIGN QUESTION. Continuous Integration, Continuous Delivery and
 * Continuous Deployment differ ONLY in how far the automation reaches along one
 * pipeline. Draw that.
 *
 * WHAT IT REPLACES. Session 7 currently teaches the three terms as four
 * consecutive slides: `c2-ci` defines the first, `c2-cd-delivery` the second,
 * `c2-cd-deployment` the third, and `c2-three-terms` then compares all three in
 * a `DataTable` because the three definitions did not make the distinction
 * stick. Four abstract definitions in a row, for a room meeting the idea for the
 * first time, before any picture exists. `PEDAGOGY_GUIDELINES.md` section 2
 * forbids introducing a concept by its definition.
 *
 * Slide 2 is that incumbent table, verbatim, so the comparison is honest.
 */

export const cicdReachLabMeta: DeckMeta = {
  title: 'CI/CD Reach Variants',
  course: 'Kit lab',
  lesson: 'CI/CD Reach Variants',
  presenter: 'NxtWave',
}

const FOOTER = 'CI/CD Reach Variants'

/*
  THE FIXTURE, WRITTEN ONCE, AND IT IS THE DECK'S OWN CONTENT.

  The five stages are `PIPELINE` from session 7's `deckShared.tsx`, already
  taught on `c2-our-pipeline`, so a candidate is judged on the drawing and not on
  invented material. The industry's canonical chain is source -> build -> test ->
  release -> production; these five are one project's instance of it, and content
  rule 24 forbids introducing a second name for a thing the room has already met.

  STAGE 2 IS A NAMED EMPTY SLOT, AND THAT WORDING IS DELIBERATE.

  `add tests here`, not `run the tests`. This course never teaches a test.
  Session 5's Makefile is build, up, down, logs, migrate, superuser and shell;
  session 6 adds push. `make test` was never written by any session, and session
  7 already carries a comment recording one caption corrected for exactly this
  reason. The stage stays, because a CI pipeline with no test stage is a poor
  example of one, but the room must not be credited with work they have not done.
  Do not "improve" this caption back into the over-claim.

  For the same reason the word `passing` appears nowhere. Without tests, a stage
  fails when its COMMAND fails, and `make build` genuinely can, so "a change that
  gets through" is honest where "every passing change" quietly asserts a suite
  that does not exist.
*/
const FIXTURE: Pick<CicdReachProps, 'stages' | 'terms'> = {
  stages: [
    { n: 1, label: 'FETCH', caption: 'get the code' },
    { n: 2, label: 'TEST', caption: 'add tests here' },
    { n: 3, label: 'BUILD', caption: 'build the image' },
    { n: 4, label: 'PUSH', caption: 'image to Hub' },
    { n: 5, label: 'DEPLOY', caption: 'run on server' },
  ],
  /*
    INNERMOST FIRST. The order IS the containment claim, and every candidate
    reads it as such. A caller who shuffles this array is asserting a different
    containment, which is a content error and not a layout one.
  */
  terms: [
    {
      name: 'Continuous Integration',
      reaches: 2,
      then: 'Every push is fetched and checked automatically, and tests go here when you add them',
      tone: 'inner',
    },
    {
      name: 'Continuous Delivery',
      reaches: 4,
      then: 'The image is built and pushed, then it waits for a person',
      approval: true,
      tone: 'middle',
    },
    {
      name: 'Continuous Deployment',
      reaches: 5,
      then: 'No button: a change that gets through reaches the live server on its own',
      tone: 'outer',
    },
  ],
}

const LEAD = 'Same chain of steps, automated a little further each time'

const BUILD_NOTE =
  'FOUR BEATS, and they are what makes one slide legal in place of four. Beat 0, on entry: the chain, which the room already met on c2-our-pipeline. Click one: Continuous Integration. Click two: Continuous Delivery, and the person standing at its boundary. Click three: Continuous Deployment, the same row with the person gone. Content rule 25 wants one new element per slide, and a figure that can only appear all at once has failed the requirement that justifies collapsing the four slides.'

export const cicdReachLabDeck: SlideDef[] = [
  {
    id: 'brand',
    label: 'Brand',
    transition: 'fade',
    element: <BrandSlide greeting="CI/CD reach lab" lesson={FOOTER} />,
    notes:
      'Four candidates for one figure, all on the identical fixture. Slide 2 is the incumbent, so judge every other slide against what session 7 ships today rather than against an idea of what good looks like. Two scored criteria: does a viewer see the CONTAINMENT without being told, and does a viewer see that Delivery and Deployment differ by ONE human step.',
  },
  {
    id: 'incumbent',
    section: 'The incumbent',
    label: '0 · DataTable',
    element: (
      <ContentSlide
        lesson={FOOTER}
        kicker="The incumbent"
        title="Three Terms"
        lead="What session 7 ships today, after three definition slides"
      >
        {/* Session 7's `c2-three-terms`, verbatim. Its columns are the tell: the
            containment lives in the word "and" at the start of two cells, and a
            table cell is the weakest place in the kit to put the one idea the
            slide exists to carry. */}
        <DataTable
          columns={[
            { label: 'Term', weight: 1.1 },
            { label: 'Automated up to', weight: 1.6 },
            { label: 'What the human still does', weight: 1.3 },
          ]}
          rows={[
            ['Continuous Integration', 'Fetch and check', 'Writes the code and pushes it'],
            ['Continuous Delivery', 'and builds and pushes the image', 'Presses deploy'],
            ['Continuous Deployment', 'and puts it on the live server', 'Nothing, after git push'],
          ]}
          highlight={[2]}
        />
      </ContentSlide>
    ),
    notes:
      'THREE FAULTS, and they are the brief for everything after this slide. ONE: the containment is carried by the word "and" at the start of two cells, which is the smallest and least emphatic thing on the frame. TWO: it arrives whole, so there is no beat on which the room learns that Delivery includes CI. THREE: it is a reference form, and it is being asked to do the introducing, which PEDAGOGY section 2 forbids. It also comes fourth, after three slides of definitions that it exists to rescue.',
  },
  {
    id: 'nested',
    section: 'Candidates',
    label: '1 · NestedSpans',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Candidate 1" title="NestedSpans" lead={LEAD}>
        <NestedSpans {...FIXTURE} />
      </ContentSlide>
    ),
    notes:
      'Three brackets above the chain, drawn one inside another, so containment is drawn rather than stated. ' +
      BUILD_NOTE,
  },
  {
    id: 'stops',
    label: '2 · StopPoints',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Candidate 2" title="StopPoints" lead={LEAD}>
        <StopPoints {...FIXTURE} />
      </ContentSlide>
    ),
    notes:
      'The control in the experiment: no spans at all, only a fence planted where each term stops. Every one of the three starts at the beginning, always, so a figure that redraws that constant three times is spending ink on the part carrying no information. The question this slide answers is whether containment survives being left to inference. ' +
      BUILD_NOTE,
  },
  {
    id: 'lanes',
    label: '3 · ThreeLanes',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Candidate 3" title="ThreeLanes" lead={LEAD}>
        <ThreeLanes {...FIXTURE} />
      </ContentSlide>
    ),
    notes:
      'The conventional answer. Atlassian, Red Hat, AWS, CircleCI and IBM all publish this picture: one chain, three stacked rows, each reaching further right. A learner who reads any article on CI/CD after this session meets it again. It asks nothing of the viewer either, because every lane states its own outcome for every stage in place. The price is fifteen cards and no headroom. ' +
      BUILD_NOTE,
  },
  {
    id: 'bands',
    label: '4 · ReachBands',
    element: (
      <ContentSlide lesson={FOOTER} kicker="Candidate 4" title="ReachBands" lead={LEAD}>
        <ReachBands {...FIXTURE} />
      </ContentSlide>
    ),
    notes:
      'The convention with the cost removed: the chain once, and three bands from a shared left edge. Three lengths against a common datum is the one visual judgement people make accurately. Its risk is the lookup, because a band is an abstraction on top of the chain and the eye has to carry a bar\'s right end back up to the stage above it; the leaders exist to pay that. ' +
      BUILD_NOTE,
  },
]
