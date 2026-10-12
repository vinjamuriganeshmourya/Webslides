import { ClosingRings, GlassPill, HeroLogo, Stage, heroSlab } from '@/ui/shared'
import { HERO_LOGO_WIDTH, colors, type } from '@/design/tokens'

export interface AllTheBestSlideProps {
  title?: string
}

/** The reference pill's centre line (its 206px ran y 564..770). */
const SLAB_CENTER_Y = 667

/**
 * ALL THE BEST — the send-off before a test or a practice set.
 *
 * Reference: `slidestraining/allthebest/`: the thank-you frame with different
 * words. Same ground, same rings, same mark at y=307, same slab centre; the
 * slab is sized off the words (`heroSlab`).
 */
export function AllTheBestSlide({ title = 'All The Best' }: AllTheBestSlideProps) {
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
