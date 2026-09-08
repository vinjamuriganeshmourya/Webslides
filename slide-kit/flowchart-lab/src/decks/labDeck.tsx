import type { DeckMeta, SlideDef } from '@/deck/types'
import { ContentSlide } from '@/slides'
import { reviewFlow, FIXTURE_CAPTION } from '@/ui/variants/fixture'
import { SpineFlow } from '@/ui/variants/SpineFlow'
import { LaneFlow } from '@/ui/variants/LaneFlow'
import { StepLedger } from '@/ui/variants/StepLedger'
import { CircuitMap } from '@/ui/variants/CircuitMap'
import { GateFlow } from '@/ui/variants/GateFlow'
import { TrackSwitch } from '@/ui/variants/TrackSwitch'

/**
 * FLOW CHART DESIGNS — a lab, not a session.
 *
 * WHY THIS LAB EXISTS
 *
 * The kit's `FlowChart` lays its nodes out with one flex row or column. That is
 * not a styling limitation, it is the data model: it takes `nodes` and no edges.
 * So it cannot branch, cannot label an exit, and cannot loop back, while the
 * registry describes `FlowChartSlide` as "a process with branches". Its
 * `shape: 'diamond'` rotates a node 45 degrees and then carries on in a straight
 * line, which makes the figure look like it is asking a question and showing
 * only one answer.
 *
 * NOTHING BUT VARIANTS IS IN HERE. No brand frame, no welcome, no agenda, no
 * thank you, following `flow-lab` next door: a gallery whose first two slides are
 * chrome makes the reader page past the deck's own furniture to reach the thing
 * being judged.
 *
 * EVERY VARIANT RENDERS THE IDENTICAL FIXTURE, from `src/ui/variants/fixture.ts`,
 * and takes the identical `FlowchartFigureProps`. Picking a winner is renaming
 * one component at the call site. A variant that needed different words to look
 * good would have told you something.
 *
 * The fixture is deliberately not from any session in the corpus. `flow-lab` was
 * scoped to two named session-6 slides because it was choosing a figure for
 * those slides; this lab is choosing a general flow chart, so a general process
 * is what it has to survive.
 */

const FIG = { ...reviewFlow, caption: FIXTURE_CAPTION }

export const labDeck: SlideDef[] = [
  {
    id: 'v1-spine',
    label: '1 · SpineFlow',
    section: 'Variants',
    notes:
      'THE STRAIGHT STORY WITH EXCEPTIONS HANGING OFF IT. The happy path is an unbroken horizontal line at full weight; the failure drops out of the gate vertically in amber and the loop returns underneath, so it can never be confused with progress. Decision is a tinted chip with the question set level, not a diamond. Best all-rounder for a four-to-five step process. Worst at: more than one decision, because there is only one row of "below" to drop into.',
    element: (
      <ContentSlide
        kicker="Variant 1"
        title="SpineFlow"
        lead="The happy path is a straight line, and everything else hangs off it."
      >
        <SpineFlow {...FIG} />
      </ContentSlide>
    ),
  },
  {
    id: 'v2-lane',
    label: '2 · LaneFlow',
    section: 'Variants',
    notes:
      'THE VERTICAL AXIS IS WHO, NOT WHEN. The only variant that answers "whose job is that", so handoffs become visible as vertical moves and every crossing is a place the work can stall. Reads the `lane` field, which no other variant does. Worst at: a process where every step has the same owner, which is a spine flow that has thrown away a third of its height. Needs three lanes to earn its keep.',
    element: (
      <ContentSlide
        kicker="Variant 2"
        title="LaneFlow"
        lead="Same process, but the vertical axis is who owns each step."
      >
        <LaneFlow {...FIG} />
      </ContentSlide>
    ),
  },
  {
    id: 'v3-ledger',
    label: '3 · StepLedger',
    section: 'Variants',
    notes:
      'NO BOXES AT ALL. STYLE_GUIDE section 8 applied to a flow chart: boxes and arrows draw "discrete units connected by transitions", and if every transition is just "and then", the boxes are decoration. A number in the gutter, a rule between rows, the words at full width. Wins on long labels, which every other variant wraps inside a fixed slot. Worst at: shape. A loop back to step two is a line of text saying so, not a line you can point at.',
    element: (
      <ContentSlide
        kicker="Variant 3"
        title="StepLedger"
        lead="The same process with no boxes, no arrows and no diagram at all."
      >
        <StepLedger {...FIG} />
      </ContentSlide>
    ),
  },
  {
    id: 'v4-circuit',
    label: '4 · CircuitMap',
    section: 'Variants',
    notes:
      'THE CONTROL. The classic notation every learner has already met: stadium terminals, rectangles, a real diamond, orthogonal connectors. If a departure from this is not clearly better, it is not worth teaching the room a second dialect. Worst at: the diamond constrains the copy. Only its middle third is usable, so "All checks pass?" fits and anything longer does not, and the copy is the teaching.',
    element: (
      <ContentSlide
        kicker="Variant 4"
        title="CircuitMap"
        lead="The textbook notation, drawn properly. The control the others must beat."
      >
        <CircuitMap {...FIG} />
      </ContentSlide>
    ),
  },
  {
    id: 'v5-gate',
    label: '5 · GateFlow',
    section: 'Variants',
    notes:
      'THE DECISION AS A PLACE WITH PHYSICAL EXTENT. Steps are a card row; the decision is a tall bar standing across the line, with the happy path drawn UNDER it so the line visibly passes through and emerges on the far side. The failure is ejected out of the bar\'s underside onto a lower track. It makes the check a thing the work must get past, not one more equal box. Worst at: a second decision, which has no third vertical level to occupy, and a question past about six words, which starts reading as a title for the whole figure.',
    element: (
      <ContentSlide
        kicker="Variant 5"
        title="GateFlow"
        lead="The decision is not a step. It is a barrier the work has to get past."
      >
        <GateFlow {...FIG} />
      </ContentSlide>
    ),
  },
  {
    id: 'v6-track',
    label: '6 · TrackSwitch',
    section: 'Variants',
    notes:
      'THE ONLY VARIANT WHERE THE LOOP IS THE HERO. A railway: the happy path is one continuous straight rail with stations sitting on it, and at the decision the track SWITCHES, peeling away on a curve down to a lower return track that merges back in on a mirrored curve. Straight main line against curved detour is the whole design, and it makes rework feel like a detour that rejoins the journey rather than an arrow pointing backwards. Worst at: it buys one idea with the entire stage, and its geometry assumes exactly one loop with room to the right of the gate.',
    element: (
      <ContentSlide
        kicker="Variant 6"
        title="TrackSwitch"
        lead="A railway. The main line runs straight and rework peels off, then merges back."
      >
        <TrackSwitch {...FIG} />
      </ContentSlide>
    ),
  },
]

export const labDeckMeta: DeckMeta = {
  title: 'Flow Chart Designs',
  course: 'Slide kit · figure lab',
  lesson: 'Flow chart designs',
}
