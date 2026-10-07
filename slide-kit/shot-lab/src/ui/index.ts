/** Barrel export for all shared slide building blocks. */
export { SlideBase, type SlideVariant } from './SlideBase'
export { SlideHeader } from './SlideHeader'
export { Logo } from './Logo'
export { DotGrid, Blob, Orb, WaveArc } from './Decor'
export { Kicker, Chip, NumberBadge } from './primitives'
export { BulletList, Card, CardGrid, StatTile, type BulletItem } from './content'
export { AnalogyMap } from './AnalogyMap'
export { Callout } from './Callout'
export { CodeBlock } from './CodeBlock'
export { Terminal, type TerminalLine } from './Terminal'
export { Shot, type ShotHighlight, type ShotProps, type ShotInsetOptions, type ShotLabelSide } from './Shot'
export { ContainerJourney } from './ContainerJourney'

/* Session 3 figures. Each one carries the argument of a slide that a table
   cannot make, and each reads its colours from `src/design/tokens.ts`. */
export { TwoRuntimes } from './TwoRuntimes'
export { OneProcessRule } from './OneProcessRule'
export { HandRitual } from './HandRitual'
export { Orchestra } from './Orchestra'
export { YamlNesting } from './YamlNesting'
export { VolumeSurvival } from './VolumeSurvival'
export { ComposeNetwork } from './ComposeNetwork'
export { StackUp } from './StackUp'
export { DataTable, type TableColumn, type TableRow } from './DataTable'
export { FileTree, type FileEntry, type FileState } from './FileTree'
export { LayerStack, LayerGap, type Layer, type LayerState } from './LayerStack'
export { MachineBoundary } from './MachineBoundary'
export { SocketBridge } from './SocketBridge'
export { TunnelPath } from './TunnelPath'
export { JourneyRoadmap } from './JourneyRoadmap'
export { StepList, FlowChart, type Step, type FlowNode } from './flow'

/*
  THE FLOW FIGURE, PROMOTED FROM `slide-kit/flow-lab`.

  `FlowChart` above is kept because sessions 1 to 5 render it, but it cannot
  label an edge, cannot tell a push from a pull, and gives a registry in the
  middle the same weight as the laptop beside it. Session 6 needed all three and
  worked around the first by rendering `docker push` as a NODE.

  `BoundaryBridge` is what four candidate designs were narrowed to. Prefer it for
  anything that moves an artifact between machines; `FlowChart` stays correct for
  a plain sequence of states.
*/
export { BoundaryBridge } from './BoundaryBridge'
export type { FlowFigureProps, FlowStation, FlowLeg, StationLogo } from './flowFigure'
export { T as figureTiming, E as figureEasing, perSegment, c4 } from './figureTiming'
export { ScenarioCard, type ScenarioBeat } from './ScenarioCard'

/* Figures behind the syntax, status and conversation slide types. Each is a
   FORM the kit did not previously have, not a variant of one it did:
   `SyntaxBreakdown` is a grammar diagram (neither a file nor a console),
   `StatusList` is a list whose rows carry verdicts, `ChatThread` is a two-voice
   exchange. See each file's header for what it must not be used for. */
export { SyntaxBreakdown, type SyntaxPart } from './SyntaxBreakdown'
export { StatusList, type StatusItem, type StatusKind } from './StatusList'
export { ChatThread, type ChatTurn } from './ChatThread'

/*
  FLOW CHART FIGURES. Six designs for one contract, chosen in
  `slide-kit/flowchart-lab`, which also records what each is WORST at. They all
  take the identical `FlowchartFigureProps`, so swapping one for another is a
  rename at the call site.

  These replace nothing: `FlowChart` in `flow.tsx` still draws a straight
  sequence and is the right choice for one. Reach for these when the process
  BRANCHES, labels an exit, or loops back, none of which `FlowChart` can do,
  because it takes `nodes` and no edges.
*/
export {
  type FlowchartFigureProps,
  type FcNode,
  type FcEdge,
  type FcNodeKind,
  resolveGraph,
} from './flowchart/flowchartFigure'
export { SpineFlow } from './flowchart/SpineFlow'
export { LaneFlow } from './flowchart/LaneFlow'
export { StepLedger } from './flowchart/StepLedger'
export { CircuitMap } from './flowchart/CircuitMap'
export { GateFlow } from './flowchart/GateFlow'
export { TrackSwitch } from './flowchart/TrackSwitch'
export { NodeShell, lookOf, NODE_MIN_H } from './flowchart/NodeShell'

/*
  ONE SOURCE, MANY COPIES.

  On the barrel, unlike the four promoted figure FAMILIES under `src/ui/points`,
  `pseudocode`, `projectcode` and `features`, which stay import-by-path. The
  difference is that a family offers a CHOICE between designs for one contract, and
  choosing should be a deliberate act at the import line; `FanOut` is a single
  figure with one shape, like `LayerStack` and `ContainerJourney` beside it.

  Promoted out of `deployement_session_1_v2`, where it was a deck-local
  `ImageFanout` hardcoded to one image and three containers. The contract carries
  no Docker in it: the same figure draws one build and many environments, or one
  template and many generated files.
*/
export {
  FanOut,
  type FanOutProps,
  type FanOutSource,
  type FanOutCopy,
} from './figures/FanOut'
export * as Icons from './icons'
export { iconByName, type IconName } from './icons'
export { Illustration, type IllustrationName } from './characters/Illustration'
export { Nova, type NovaPose } from './characters/Nova'

// Motion helpers re-exported for slide authors.
export { RevealGroup, Reveal } from '@/motion/Reveal'
