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
export { ScenarioCard, type ScenarioBeat } from './ScenarioCard'
export * as Icons from './icons'
export { iconByName, type IconName } from './icons'
export { Illustration, type IllustrationName } from './characters/Illustration'
export { Nova, type NovaPose } from './characters/Nova'

// Motion helpers re-exported for slide authors.
export { RevealGroup, Reveal } from '@/motion/Reveal'

/* Session 5 figures. Session-owned, not kit: content rule 14 makes promotion
   the user's call, and `sync-kit.mjs` only overwrites the files it lists.
   Both are built from real elements rather than SVG text, so `align-check.mjs`
   can see their labels. See the header comment in each. */
export { TargetAnatomy } from './TargetAnatomy'
export { AutomationLadder } from './AutomationLadder'
