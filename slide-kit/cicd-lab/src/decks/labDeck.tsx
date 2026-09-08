import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { SpineFlow, StepLedger, GateFlow, BoundaryBridge } from '@/ui'
import {
  pipelineHappy,
  pipelineWithFailure,
  PIPELINE_CAPTION,
  PIPELINE_FAIL_CAPTION,
  theGate,
  GATE_CAPTION,
  shippingRitual,
  RITUAL_CAPTION,
  jenkinsChainFlow,
  CHAIN_CAPTION,
  jenkinsChainBridge,
} from '@/ui/variants/fixture'

/**
 * CI/CD PROCESS FLOW — a lab, not a session.
 *
 * WHAT THIS LAB IS FOR, AND WHY IT IS NOT `flowchart-lab`
 *
 * `flowchart-lab` chose which flow-chart designs the kit should own, dressed in
 * a deliberately general fixture so the winner would not be picked on one
 * session's words. That question is closed and all six variants are in
 * `src/ui/flowchart/`.
 *
 * This lab asks the question that one could not: **do the chosen figures survive
 * Deployment session 7's real content**, before the deck is written on the
 * assumption that they do. Hard rule 17 is the reason it exists in this form. The
 * three harnesses measure DOM rectangles, an `<svg>` is one rectangle to all
 * three, and a figure whose internal labels sit on top of one another passes
 * every sweep. The only check that works is a person looking at a picture, and a
 * seven-slide lab is a much cheaper picture than a 54-slide deck.
 *
 * NOTHING BUT CANDIDATES IS IN HERE, following both labs next door: no brand
 * frame, no welcome, no agenda. A gallery whose first two slides are chrome makes
 * the reader page past furniture to reach the thing being judged.
 *
 * THREE DECISIONS ARE OPEN, one per pair:
 *
 *   1 vs 2   slide 30's pipeline, with the failure drawn or without it
 *   5 vs 6   slide 38's chain, as a spine or as a boundary bridge
 *   3, 4     slide 32's gate and slide 18's ritual, settled in round 2 and here
 *            to be looked at rather than chosen between
 *
 * ROUND 1 REJECTED TWO CANDIDATES OUTRIGHT and they are gone rather than kept:
 * `StepList` for slide 18, whose six rows printed over the slide title and left
 * the bottom of the frame, and the six-node pipeline, which was a geometry error
 * rather than a design choice. The `BoundaryBridge` chain stays as slide 6,
 * because it was rejected on what it CLAIMS and that is worth a reader's time.
 */
export const labDeck: SlideDef[] = [
  {
    id: 'v1-pipeline-happy',
    label: '1 · Pipeline, happy path',
    section: 'Slide 30',
    notes:
      'CANDIDATE A, round 2. Five stages and nothing else. Round 1 made git push a sixth node and 5 DEPLOY fell off the right edge of the frame: SpineFlow is a fixed 1100px stage with FIVE slots, which its own header says. git push is now in the lead, which is also what the TR draws, an arrow coming down into stage 1 rather than a box in the row. Cost of this candidate: slide 30 promises five stages and never says what a red one does, so the room waits two slides to find out.',
    element: (
      <ContentSlide
        kicker="Slide 30 · candidate A"
        title="Our Pipeline"
        lead="Every git push starts a run, and the run is these five stages in this order"
      >
        <SpineFlow {...pipelineHappy} caption={PIPELINE_CAPTION} />
      </ContentSlide>
    ),
  },
  {
    id: 'v2-pipeline-failure',
    label: '2 · Pipeline, with the exception',
    section: 'Slide 30',
    notes:
      'CANDIDATE B, round 2. The same five, with the exception drawn. The label now reads "tests fail" rather than the TR\'s "any stage fails": a branch drawn from one stage cannot claim to be about every stage, so the general rule moved to the caption where it is a sentence and not an arrow. The room sees on one frame both what runs and what interrupts it.',
    element: (
      <ContentSlide
        kicker="Slide 30 · candidate B"
        title="Our Pipeline"
        lead="Every git push starts a run, and any stage can end it"
      >
        <SpineFlow {...pipelineWithFailure} caption={PIPELINE_FAIL_CAPTION} />
      </ContentSlide>
    ),
  },
  {
    id: 'v3-gate',
    label: '3 · The gate',
    section: 'Slide 32',
    notes:
      'ROUND 2. GateFlow is the variant for the slide where the check IS the point and the steps either side are context. Round 1 clipped PASS to PAS behind the 3 BUILD card and half covered FAIL, because a two-line node label grows the card into the space GateFlow parks its exit pills in. Every label here is now short with the detail in caption, which is set smaller and does not push the card out.',
    element: (
      <ContentSlide
        kicker="Slide 32"
        title="Two Iron Rules"
        lead="A failed stage stops everything after it, which is what makes this a gate"
      >
        <GateFlow {...theGate} caption={GATE_CAPTION} />
      </ContentSlide>
    ),
  },
  {
    id: 'v4-ritual-ledger',
    label: '4 · Ritual, as a ledger',
    section: 'Slide 18',
    notes:
      'THE WINNER, round 2, and it no longer has a rival: candidate B is gone. StepLedger numbers rows in a gutter and sets the words at full width. Round 1 put the word "ritual" in four consecutive captions and "your actual job" in two, so the split was carried by repetition and the eye had nothing to land on. Each caption now says what its own step is for, and the split is stated once underneath, where a sentence belongs.',
    element: (
      <ContentSlide
        kicker="Slide 18 · candidate A"
        title="Shipping a Change"
        lead="Six steps, and only the first two are the work you were hired to do"
      >
        <StepLedger {...shippingRitual} caption={RITUAL_CAPTION} />
      </ContentSlide>
    ),
  },
  {
    id: 'v5-chain-spine',
    label: '5 · Where Jenkins sits',
    section: 'Slide 38',
    notes:
      'THE REPLACEMENT FOR BoundaryBridge, which is on slide 6 as the rejected candidate. Slide 38 is a SEQUENCE of five services, not a boundary crossing, so it is a spine with the four commands as edge labels. Five stations is exactly SpineFlow\'s five slots. Check that all four edge labels are legible and that none has collided with a card.',
    element: (
      <ContentSlide
        kicker="Slide 38"
        title="Where It Sits"
        lead="Jenkins in the middle of every tool this course has already built"
      >
        <SpineFlow {...jenkinsChainFlow} caption={CHAIN_CAPTION} />
      </ContentSlide>
    ),
  },
  {
    id: 'v6-chain-bridge-rejected',
    label: '6 · The chain as a bridge (rejected)',
    section: 'Slide 38',
    notes:
      'REJECTED, KEPT AS THE RECORD. BoundaryBridge groups every source station inside one dashed machine boundary and every target inside another, because its subject is a registry bridging two computers. That is right for session 6 and wrong here twice: Developer and GitHub land inside a box captioned ONE COMPUTER, which contradicts the ten slides of concept 1 that exist to say GitHub is not on your computer; and Docker Hub and AWS EC2 land inside A DIFFERENT COMPUTER, when a registry is not the server that pulls from it. issuedBy also prints "the sender types it" under the webhook, which is the one leg nobody types. The layout is fine. The claims are not.',
    element: (
      <ContentSlide
        kicker="Slide 38 · rejected"
        title="Where It Sits"
        lead="The same five services drawn as a machine boundary, which they are not"
      >
        <BoundaryBridge {...jenkinsChainBridge} />
      </ContentSlide>
    ),
  },
]

export const labDeckMeta: DeckMeta = {
  title: 'CI/CD Process Flow Designs',
  course: 'Slide kit · figure lab',
  lesson: 'CI/CD process flow',
}
