import type { FlowchartFigureProps } from '@/ui/flowchart/flowchartFigure'
import type { FlowFigureProps } from '@/ui/flowFigure'

/**
 * THE FIXTURES FOR DEPLOYMENT SESSION 7.
 *
 * WHY THIS LAB IS SESSION-SCOPED, WHEN `flowchart-lab` WAS NOT
 *
 * `flowchart-lab` was choosing a general flow chart for the kit, so it had to be
 * dressed in a general process: a variant picked on how well it renders one
 * session goes into the kit for every other one. That decision is made and the
 * six variants are in `src/ui/flowchart/`.
 *
 * This lab is not choosing anything for the kit. It answers the narrower question
 * that one could not: **do session 7's actual figures survive session 7's actual
 * words**, before 54 slides are written on the assumption that they do. Hard rule
 * 17 says a figure passes all three harnesses with its labels on top of one
 * another, so the only check is a person looking at a picture.
 *
 * ROUND 1 FOUND FOUR FAULTS, ALL OF WHICH WOULD HAVE SHIPPED. They are recorded
 * beside the fixture each one belongs to, because the reason a number is what it
 * is matters more than the number.
 */

/* ------------------------------------------------------------------ */
/* Slide 30: the pipeline                                              */
/* ------------------------------------------------------------------ */

/**
 * FAULT 1, ROUND 1: SIX NODES DO NOT FIT, AND NOTHING SAID SO.
 *
 * The first pass made `git push` a sixth node at the head of the spine. On
 * screen, `5 DEPLOY` was a green sliver hanging off the right edge of the frame
 * and the exception label bled off the left. `SpineFlow.tsx` says it plainly in
 * its own header, which is the part that should have been read first:
 *
 *   "A fixed 1100x360 stage. FIVE spine slots of 180px on 230px centres"
 *
 * Five is not a guideline, it is the geometry. So `git push` is not a node.
 *
 * That turns out to be the more accurate figure anyway, and the TR agrees: its
 * own ASCII draws `git push` ABOVE the row with an arrow coming down into stage
 * 1, not as one of the five numbered boxes. A trigger is not a stage. It moves
 * into the slide's lead, where it was always a sentence rather than a box.
 */
export const pipelineHappy: Pick<FlowchartFigureProps, 'nodes' | 'edges'> = {
  nodes: [
    { id: 'fetch', kind: 'start', label: '1 FETCH', caption: 'get the code', icon: 'download' },
    { id: 'test', kind: 'step', label: '2 TEST', caption: 'run the tests', icon: 'check' },
    { id: 'build', kind: 'step', label: '3 BUILD', caption: 'build the image', icon: 'bolt' },
    { id: 'pushimg', kind: 'step', label: '4 PUSH', caption: 'image to Hub', icon: 'globe' },
    { id: 'deploy', kind: 'end', label: '5 DEPLOY', caption: 'run on server', icon: 'server' },
  ],
  edges: [
    { from: 'fetch', to: 'test', kind: 'main' },
    { from: 'test', to: 'build', kind: 'main' },
    { from: 'build', to: 'pushimg', kind: 'main' },
    { from: 'pushimg', to: 'deploy', kind: 'main' },
  ],
}

/**
 * THE SAME FIVE, WITH THE FAILURE DRAWN.
 *
 * The exception hangs off `test` and is labelled `tests fail`, not the TR's
 * "any stage fails". A branch drawn from one stage that claims to be about every
 * stage is a figure and a caption disagreeing on the same frame; the general rule
 * moves to the caption, where it is a sentence and not an arrow.
 */
export const pipelineWithFailure: Pick<FlowchartFigureProps, 'nodes' | 'edges'> = {
  nodes: [
    ...pipelineHappy.nodes,
    { id: 'stopped', kind: 'step', label: 'Pipeline stops', caption: 'team notified', icon: 'cross' },
  ],
  edges: [
    ...pipelineHappy.edges,
    { from: 'test', to: 'stopped', label: 'tests fail', kind: 'alt' },
  ],
}

export const PIPELINE_CAPTION = 'Stages 2, 3 and 4 are make test, make build and make push'
export const PIPELINE_FAIL_CAPTION = 'Any stage can do this, not only TEST. A failure stops everything after it'

/* ------------------------------------------------------------------ */
/* Slide 32: the gate                                                  */
/* ------------------------------------------------------------------ */

/**
 * FAULT 2, ROUND 1: BOTH EXIT LABELS WERE OVERPRINTED BY A NODE.
 *
 * `PASS` was clipped to `PAS` by the `3 BUILD` card and `FAIL` was half covered
 * by the card below it. The cause was not the figure, it was the words: a two
 * line `label` grows the card in both directions from the spine, and `GateFlow`
 * parks its exit pills in the space a one-line card leaves.
 *
 * So every node here is a SHORT label with the detail in `caption`, which is set
 * smaller and does not push the card out. This is the same finding session 4
 * recorded for its SVG figures, arriving through a different door: the arithmetic
 * looks right in source until a font renders wider than assumed.
 */
export const theGate: Pick<FlowchartFigureProps, 'nodes' | 'edges'> = {
  nodes: [
    { id: 'test', kind: 'start', label: '2 TEST', caption: 'on a neutral machine', icon: 'check' },
    { id: 'gate', kind: 'decision', label: 'Every test passed?', icon: 'target' },
    { id: 'build', kind: 'step', label: '3 BUILD', caption: 'then 4 and 5', icon: 'bolt' },
    { id: 'stopped', kind: 'end', label: 'Stop', caption: 'no image, no push', icon: 'cross' },
  ],
  edges: [
    { from: 'test', to: 'gate', kind: 'main' },
    { from: 'gate', to: 'build', label: 'Pass', kind: 'main' },
    { from: 'gate', to: 'stopped', label: 'Fail', kind: 'alt' },
  ],
}

export const GATE_CAPTION = 'Broken code cannot reach users through the pipeline'

/* ------------------------------------------------------------------ */
/* Slide 18: the manual ritual                                         */
/* ------------------------------------------------------------------ */

/**
 * FAULT 3, ROUND 1: `StepList` IS NOT A SIX ROW COMPONENT.
 *
 * The plan named `StepList` plus a `Callout` as the fallback for this slide.
 * Rendered, six of its rows are so tall that row 1 sits ON TOP of the slide
 * title, rows 5 and 6 leave the bottom of the frame, and the callout is not on
 * screen at all. It is a three or four step component and the plan should not
 * have offered it. `StepLedger` is the answer and there is no contest.
 *
 * FAULT 4, ROUND 1: THE WORD "ritual" FOUR TIMES IS NOT A FIGURE DRAWING A SPLIT.
 *
 * `StepLedger` fits and reads cleanly, but the first pass put "ritual" in four
 * consecutive captions and "your actual job" in two, so the split was carried by
 * repetition rather than by anything visual. Repetition at that density reads as
 * a stutter, and the room's eye has nothing to land on.
 *
 * The fix keeps `StepLedger` and stops repeating: each ritual step's caption says
 * what that step is FOR, the two job steps say what they are, and the split is
 * stated once in the caption under the figure, where a sentence belongs.
 */
export const shippingRitual: Pick<FlowchartFigureProps, 'nodes' | 'edges'> = {
  nodes: [
    { id: 'edit', kind: 'start', label: 'Edit code', caption: 'the work you were hired to do', icon: 'pencil' },
    { id: 'push', kind: 'step', label: 'git push', caption: 'share the code', icon: 'rocket' },
    { id: 'test', kind: 'step', label: 'make test', caption: 'did I break anything?', icon: 'check' },
    { id: 'build', kind: 'step', label: 'make build', caption: 'build the image', icon: 'bolt' },
    { id: 'pushimg', kind: 'step', label: 'make push VERSION=v7', caption: 'share the image', icon: 'globe' },
    { id: 'deploy', kind: 'end', label: 'Deploy it somewhere', caption: 'coming in the AWS sessions', icon: 'server' },
  ],
  edges: [
    { from: 'edit', to: 'push', kind: 'main' },
    { from: 'push', to: 'test', kind: 'main' },
    { from: 'test', to: 'build', kind: 'main' },
    { from: 'build', to: 'pushimg', kind: 'main' },
    { from: 'pushimg', to: 'deploy', kind: 'main' },
  ],
}

export const RITUAL_CAPTION = 'Steps 1 and 2 are your job. Steps 3 to 6 are the same commands, every single time'

/* ------------------------------------------------------------------ */
/* Slide 38: where Jenkins sits                                        */
/* ------------------------------------------------------------------ */

/**
 * FAULT 5, ROUND 1: `BoundaryBridge` MADE TWO CLAIMS THE SESSION DENIES.
 *
 * It groups every `source` station inside one dashed machine boundary and every
 * `target` inside another, because its entire subject is a machine boundary with
 * a registry bridging two computers. That is exactly right for session 6, which
 * is what it was designed against, and wrong here in two specific ways:
 *
 *   - Developer and GitHub landed inside one box captioned ONE COMPUTER. The
 *     whole of this session's concept 1 is that GitHub is NOT on your computer.
 *     The figure contradicted ten slides that come before it.
 *   - Docker Hub and AWS EC2 landed inside one box captioned A DIFFERENT
 *     COMPUTER. A registry is not the server that pulls from it.
 *
 * And `issuedBy` printed "the sender types it" under the webhook leg, when a
 * webhook is the one thing on the slide that nobody types.
 *
 * The shape of slide 38 is a SEQUENCE of five services, not a boundary crossing,
 * so the figure is `SpineFlow` with the four commands as edge labels. Five
 * stations is exactly its five slots. `BoundaryBridge` stays in the lab as slide
 * 7, the record of what was tried and why it lost.
 */
export const jenkinsChainFlow: Pick<FlowchartFigureProps, 'nodes' | 'edges'> = {
  nodes: [
    { id: 'dev', kind: 'start', label: 'Developer', caption: 'your machine', icon: 'devices' },
    { id: 'github', kind: 'step', label: 'GitHub', caption: 'the code', logo: 'github' },
    { id: 'jenkins', kind: 'step', label: 'Jenkins', caption: 'runs the pipeline', logo: 'jenkins' },
    { id: 'hub', kind: 'step', label: 'Docker Hub', caption: 'the image', logo: 'docker' },
    { id: 'ec2', kind: 'end', label: 'AWS EC2', caption: 'coming soon', icon: 'server' },
  ],
  edges: [
    { from: 'dev', to: 'github', label: 'git push', kind: 'main' },
    { from: 'github', to: 'jenkins', label: 'webhook', kind: 'main' },
    { from: 'jenkins', to: 'hub', label: 'docker push', kind: 'main' },
    { from: 'hub', to: 'ec2', label: 'docker pull', kind: 'main' },
  ],
}

export const CHAIN_CAPTION = 'Jenkins is the robot operator of the tools from sessions 1 to 6'

/** Kept only as the rejected candidate on lab slide 7. See FAULT 5 above. */
export const jenkinsChainBridge: FlowFigureProps = {
  stations: [
    { label: 'Developer', caption: 'your machine', kind: 'source', icon: 'devices' },
    { label: 'GitHub', caption: 'the code', logo: 'github', kind: 'source' },
    { label: 'Jenkins', caption: 'runs the pipeline', logo: 'jenkins', kind: 'hub' },
    { label: 'Docker Hub', caption: 'the image', logo: 'docker', kind: 'target' },
    { label: 'AWS EC2', caption: 'coming soon', kind: 'target', icon: 'server' },
  ],
  legs: [
    { label: 'git push', sub: 'you, once', issuedBy: 'left' },
    { label: 'webhook', sub: 'new code', issuedBy: 'left' },
    { label: 'docker push', sub: 'the image Jenkins built', issuedBy: 'left' },
    { label: 'docker pull', sub: 'and run it', issuedBy: 'right' },
  ],
  caption: 'Rejected: the dashed boxes claim Developer and GitHub are one computer',
}
