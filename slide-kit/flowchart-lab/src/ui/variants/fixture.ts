import type { FlowchartFigureProps } from './flowchartFigure'

/**
 * ONE FIXTURE, RENDERED BY ALL SIX VARIANTS.
 *
 * The comparison is only worth anything if the content is identical, so this is
 * the only content in the lab. A variant that needs different words to look good
 * has told you something.
 *
 * WHY THIS PROCESS AND NOT A REAL SESSION'S
 *
 * Deliberately not Docker, not Django, not any concept in the corpus. A lab that
 * dresses its candidates in one session's content gets picked on how well it
 * renders that session, and the winner then goes into the kit for every other
 * one. `flow-lab` next door was scoped to two named session-6 slides on purpose,
 * because it was choosing a figure for those slides. This lab is choosing a
 * general flow chart, so its fixture is general.
 *
 * WHAT IT DELIBERATELY STRESSES
 *
 * Every hard case a flow chart has, and every one the kit's `FlowChart` fails:
 *
 *   - two terminals, which want a different shape from a step
 *   - a straight-through run of steps, the happy path
 *   - a decision written as a QUESTION, with BOTH exits labelled
 *   - an exception branch that leaves the spine
 *   - a LOOP back to an earlier step, which is the shape a flex row cannot draw
 *   - six nodes, one more than the kit's row comfortably fits
 *
 * The labels are short on purpose but not uniformly short: "Automated checks
 * run" against "Fix and resubmit" is the wrap case, and a variant that only
 * looks composed when every label is one word is not usable.
 */
export const reviewFlow: Pick<FlowchartFigureProps, 'nodes' | 'edges'> = {
  nodes: [
    { id: 'submit', kind: 'start', label: 'Work submitted', caption: 'the learner clicks send', icon: 'rocket', lane: 'Learner', detail: "Nothing is checked yet. The work is queued and the learner gets an id they can quote." },
    { id: 'checks', kind: 'step', label: 'Automated checks run', caption: 'format, tests, limits', icon: 'bolt', lane: 'Grading service', detail: "Formatting, the test suite, and the size limit. Minutes, not hours, and it runs unattended." },
    { id: 'gate', kind: 'decision', label: 'All checks pass?', icon: 'target', lane: 'Grading service', detail: "The only automatic decision in the process. Everything after it is a person." },
    { id: 'review', kind: 'step', label: 'A reviewer reads it', caption: 'judgement, not rules', icon: 'eye', lane: 'Reviewer', detail: "A human reads for judgement: is the approach sound, not merely does it run." },
    { id: 'fix', kind: 'step', label: 'Fix and resubmit', caption: 'as many times as needed', icon: 'pencil', lane: 'Learner', detail: "The loop with no counter. A submission can come back through here any number of times." },
    { id: 'done', kind: 'end', label: 'Marked complete', caption: 'feedback published', icon: 'check', lane: 'Reviewer', detail: "Feedback is published and the attempt is closed. The loop cannot be re-entered." },
  ],
  edges: [
    { from: 'submit', to: 'checks', kind: 'main' },
    { from: 'checks', to: 'gate', kind: 'main' },
    { from: 'gate', to: 'review', label: 'Yes', kind: 'main' },
    { from: 'gate', to: 'fix', label: 'No', kind: 'alt' },
    { from: 'fix', to: 'checks', label: 'run again', kind: 'loop' },
    { from: 'review', to: 'done', kind: 'main' },
  ],
}

export const FIXTURE_CAPTION = 'The straight run is four steps. Everything else is the loop.'
