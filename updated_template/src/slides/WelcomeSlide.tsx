import { GlassPill, HeroLogo, MeshRings, Stage, heroSlab } from '@/ui/shared'
import { HERO_LOGO_WIDTH, colors, type } from '@/design/tokens'

export interface WelcomeSlideProps {
  /** The word in the pill. */
  greeting?: string
}

/** The reference pill's centre line (its 252px ran y 561..813). */
const SLAB_CENTER_Y = 687

/**
 * WELCOME — the deck opener.
 *
 * Reference: `slidestraining/welcomeslides/`. Measured: the mark 332px wide
 * with its top at y=266; the slab centred on y=687 with the word centred in
 * it. The slab is sized off the word (`heroSlab`), so it shrank with the
 * font when the word was reduced to the reference's width.
 */
export function WelcomeSlide({ greeting = 'Welcome' }: WelcomeSlideProps) {
  const slab = heroSlab(type.heroWelcome.fontSize)
  return (
    <Stage ground="mesh">
      <MeshRings />
      <HeroLogo top={266} width={HERO_LOGO_WIDTH} />
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
          <span style={{ ...type.heroWelcome, color: colors.white, whiteSpace: 'nowrap' }}>{greeting}</span>
        </GlassPill>
      </div>
    </Stage>
  )
}
