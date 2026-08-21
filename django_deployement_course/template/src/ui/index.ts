/** Barrel export for all shared slide building blocks. */
export { SlideBase, type SlideVariant } from './SlideBase'
export { SlideHeader } from './SlideHeader'
export { Logo } from './Logo'
export { DotGrid, Blob, Orb, WaveArc } from './Decor'
export { Kicker, Chip, NumberBadge } from './primitives'
export { BulletList, Card, CardGrid, StatTile, type BulletItem } from './content'
export { Callout } from './Callout'
export { CodeBlock } from './CodeBlock'
export { StepList, FlowChart, type Step, type FlowNode } from './flow'
export { ScenarioCard, type ScenarioBeat } from './ScenarioCard'
export * as Icons from './icons'
export { iconByName, type IconName } from './icons'
export { Illustration, type IllustrationName } from './characters/Illustration'
export { Nova, type NovaPose } from './characters/Nova'

// Motion helpers re-exported for slide authors.
export { RevealGroup, Reveal } from '@/motion/Reveal'
