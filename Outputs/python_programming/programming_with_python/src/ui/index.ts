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
export { Shot, type ShotHighlight } from './Shot'
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

/* Python course, session 1. `CodeOutput` is the pairing the kit never had: a
   snippet and what running it printed. `LogoWall` is a recognition argument.
   `InstructionFlow` is a one-off definition figure and stays with its deck. */
export { CodeOutput, type CodeOutputPane } from './CodeOutput'
export { LogoWall, type WallMark } from './LogoWall'
export { RadialSpread, type Spoke } from './RadialSpread'
export { EditorialList, type EditorialRow } from './EditorialList'
export { SyntaxSpecimens, type Specimen } from './SyntaxSpecimens'
export { InstructionFlow } from './InstructionFlow'

/* Figures behind the syntax, status and conversation slide types. Each is a
   FORM the kit did not previously have, not a variant of one it did:
   `SyntaxBreakdown` is a grammar diagram (neither a file nor a console),
   `StatusList` is a list whose rows carry verdicts, `ChatThread` is a two-voice
   exchange. See each file's header for what it must not be used for. */
export { SyntaxBreakdown, type SyntaxPart } from './SyntaxBreakdown'
export { StatusList, type StatusItem, type StatusKind } from './StatusList'
export { ChatThread, type ChatTurn } from './ChatThread'
export * as Icons from './icons'
export { iconByName, type IconName } from './icons'
export { Illustration, type IllustrationName } from './characters/Illustration'
export { Nova, type NovaPose } from './characters/Nova'

// Motion helpers re-exported for slide authors.
export { RevealGroup, Reveal } from '@/motion/Reveal'
