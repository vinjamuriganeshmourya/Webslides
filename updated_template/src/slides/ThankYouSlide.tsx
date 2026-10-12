import { ClosingRings, GlassPill, HeroLogo, Stage, heroSlab } from '@/ui/shared'
import { HERO_LOGO_WIDTH, colors, type } from '@/design/tokens'

export interface ThankYouSlideProps {
  title?: string
}

/** The reference pill's centre line (its 206px ran y 564..770). */
const SLAB_CENTER_Y = 667

/**
 * THANK YOU — the closing stage.
 *
 * Reference: `slidestraining/thankyou/`. Measured: the mark 332px wide with
 * its top at y=307; the slab centred on y=667 with the words centred in it.
 * The slab is sized off the words (`heroSlab`), so it shrank with the font
 * when they were reduced to the reference's width.
 */
export function ThankYouSlide({ title = 'Thank You!' }: ThankYouSlideProps) {
  const slab = heroSlab(type.heroClosing.fontSize)
  return (
    <Stage ground="gradient">
      <ClosingRings />
      <HeroLogo top={307} width={HERO_LOGO_WIDTH} />
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: SLAB_CENTER_Y - Number(slab.height) / 2,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <GlassPill style={slab}>
          <span style={{ ...type.heroClosing, color: colors.white, whiteSpace: 'nowrap', marginTop: -3 }}>
            {title}
          </span>
        </GlassPill>
      </div>
    </Stage>
  )
}
