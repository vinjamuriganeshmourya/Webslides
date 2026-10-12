import { CornerLogo, GlassPill, MeshRings, Stage } from '@/ui/shared'
import { colors, type } from '@/design/tokens'

export interface NextSessionSlideProps {
  /** The chip label. */
  label?: string
  /** The next session's name. */
  title: string
}

/** The double chevron in the chip: 54x46, two 9px strokes, measured. */
function Chevrons() {
  return (
    <svg width={54} height={46} viewBox="0 0 54 46" fill="none" aria-hidden>
      <path d="M5 5 L23 23 L5 41" stroke={colors.white} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M31 5 L49 23 L31 41" stroke={colors.white} strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/**
 * NEXT SESSION — the signpost before the close.
 *
 * Reference: `slidestraining/nextsession/`. Measured: the chip is 119px tall
 * with its top at y=307, 67px of chip before the label and 53px after the
 * chevron, 38px between them; the name's first line of ink starts at y=479
 * with a 163px line pitch; the mark is in the corner.
 */
export function NextSessionSlide({ label = 'Next Session', title }: NextSessionSlideProps) {
  return (
    <Stage ground="mesh">
      <MeshRings />

      <div style={{ position: 'absolute', left: 0, right: 0, top: 307, display: 'flex', justifyContent: 'center' }}>
        <GlassPill style={{ height: 119, padding: '0 53px 0 67px', gap: 38 }}>
          <span style={{ ...type.chip, color: colors.white, whiteSpace: 'nowrap' }}>{label}</span>
          <Chevrons />
        </GlassPill>
      </div>

      <h1
        style={{
          ...type.sessionTitle,
          position: 'absolute',
          /* 1380px of measure: wide enough for the reference's first line
             ("How To Supercharge", 1324px in Sora) and no wider, so the name
             breaks where the reference breaks it */
          left: 270,
          right: 270,
          top: 447,
          margin: 0,
          textAlign: 'center',
          color: colors.white,
        }}
      >
        {title}
      </h1>

      <CornerLogo onDark />
    </Stage>
  )
}
