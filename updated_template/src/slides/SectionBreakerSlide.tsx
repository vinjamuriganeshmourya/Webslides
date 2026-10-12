import { ClosingRings, CornerLogo, Stage } from '@/ui/shared'
import { colors, type } from '@/design/tokens'

export interface SectionBreakerSlideProps {
  /** The line above the title, set in tracked capitals. */
  kicker?: string
  title: string
}

/**
 * SECTION BREAKER — the divider between chapters.
 *
 * Reference: `slidestraining/sectionbreaker/`. The ground is the new one
 * (the closing gradient) and, by decision, it carries the closing frames'
 * two rings. The text keeps the OLD frame's positions and sizes: the kicker's
 * capitals 17px tall with their top at y=457, white at 72%; the title's ink
 * 78px tall with its top at y=509; both centred. The mark stays in the corner.
 */
export function SectionBreakerSlide({ kicker = 'Welcome to today’s session', title }: SectionBreakerSlideProps) {
  return (
    <Stage ground="gradient">
      <ClosingRings />

      {kicker && (
        <p
          style={{
            ...type.sectionKicker,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 454,
            margin: 0,
            textAlign: 'center',
            color: 'rgba(255,255,255,0.72)',
          }}
        >
          {kicker}
        </p>
      )}
      <h2
        style={{
          ...type.sectionTitle,
          position: 'absolute',
          left: 0,
          right: 0,
          top: 501,
          margin: 0,
          textAlign: 'center',
          color: colors.white,
        }}
      >
        {title}
      </h2>

      <CornerLogo onDark />
    </Stage>
  )
}
