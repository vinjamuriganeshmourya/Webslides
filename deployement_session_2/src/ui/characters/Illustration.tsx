import { motion } from 'framer-motion'
import { Nova, type NovaPose, type Facing } from './Nova'
import { QuestionMark, Laptop, StarBubble, ChecklistCard } from './props'
import { ConceptApi, ConceptDatabase } from './concepts'
import { TwoAppsScene, CorsGate, EnvConfig, Toolchain, PortsDoors, OriginFlats } from './session1'
import { AI_CHARACTER_ASSETS } from './manifest'

export type IllustrationName =
  | 'nova-wave'
  | 'nova-point'
  | 'nova-idea'
  | 'nova-cheer'
  | 'nova-neutral'
  | 'quiz'
  | 'practice'
  | 'feedback'
  | 'recap'
  | 'concept-api'
  | 'concept-database'
  | 'two-apps'
  | 'cors-gate'
  | 'env-config'
  | 'toolchain'
  | 'ports-doors'
  | 'origin-flats'

const NOVA_POSES: Partial<Record<IllustrationName, NovaPose>> = {
  'nova-wave': 'wave',
  'nova-point': 'point',
  'nova-idea': 'idea',
  'nova-cheer': 'cheer',
  'nova-neutral': 'neutral',
}

/**
 * The single "character slot" used across all slides. Renders the built-in
 * vector character/scene for `name`, unless an AI-generated asset is
 * registered in the manifest (then that image is used instead).
 */
export function Illustration({
  name,
  className,
  float = true,
  facing = 'left',
}: {
  name: IllustrationName
  className?: string
  float?: boolean
  /** Which way the character gestures. Defaults to "left" (toward content). */
  facing?: Facing
}) {
  const asset = AI_CHARACTER_ASSETS[name]
  if (asset) {
    return (
      <motion.img
        src={asset}
        alt=""
        aria-hidden
        className={className}
        style={{ objectFit: 'contain', transform: facing === 'right' ? 'scaleX(-1)' : undefined }}
        animate={float ? { y: [0, -10, 0] } : undefined}
        transition={float ? { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } : undefined}
      />
    )
  }

  const pose = NOVA_POSES[name]
  if (pose) return <Nova pose={pose} facing={facing} className={className} float={float} />

  switch (name) {
    case 'quiz':
      return (
        <Scene className={className}>
          <QuestionMark className="absolute right-0 top-2 h-[74%]" />
          {/*
            Anchored from the BOTTOM, not centred with `-translate-y-1/2`. Nova's
            float animation writes an inline `transform` every frame, which
            replaces the utility translate outright, so a centred Nova silently
            rendered a half-height too low and hung out of the scene.
          */}
          <Nova pose="point" facing={facing} float={float} className="absolute bottom-[6%] left-0 h-[80%]" />
        </Scene>
      )
    case 'practice':
      return (
        <Scene className={className}>
          <Laptop className="absolute bottom-2 right-0 w-[64%]" />
          <Nova pose="idea" facing={facing} float={float} className="absolute left-0 bottom-0 h-[92%]" />
        </Scene>
      )
    case 'feedback':
      return (
        <Scene className={className}>
          <StarBubble className="absolute right-0 top-1 w-[62%]" />
          <Nova pose="wave" facing={facing} float={float} className="absolute bottom-0 left-0 h-[86%]" />
        </Scene>
      )
    case 'recap':
      return (
        <Scene className={className}>
          <ChecklistCard className="absolute right-0 top-1/2 h-[84%] -translate-y-1/2" />
          {/* Bottom anchored for the same reason as the quiz scene: the float
              animation's inline transform overrides a utility translate. */}
          <Nova pose="point" facing={facing} float={float} className="absolute bottom-[5%] left-0 h-[82%]" />
        </Scene>
      )
    case 'concept-api':
      return <ConceptApi className={className} />
    case 'concept-database':
      return <ConceptDatabase className={className} />
    case 'two-apps':
      return <TwoAppsScene className={className} />
    case 'cors-gate':
      return <CorsGate className={className} />
    case 'env-config':
      return <EnvConfig className={className} />
    case 'toolchain':
      return <Toolchain className={className} />
    case 'ports-doors':
      return <PortsDoors className={className} />
    case 'origin-flats':
      return <OriginFlats className={className} />
    default:
      return <Nova pose="neutral" facing={facing} className={className} float={float} />
  }
}

function Scene({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`relative ${className ?? ''}`}>{children}</div>
}
