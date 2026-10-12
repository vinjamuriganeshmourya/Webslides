import type { CSSProperties, ReactNode } from 'react'
import { Arc, CornerLogo, Stage } from '@/ui/shared'
import { colors, fonts } from '@/design/tokens'

export interface ContentSlideProps {
  /** The concept's name, small caps above the divider. */
  kicker: string
  /** The slide's heading, under the divider. */
  title: ReactNode
  /** The body, placed on the 1920x1080 stage by the caller. */
  children?: ReactNode
}

/**
 * CONTENT SLIDE — the standard content header in the new design, on the
 * agenda ground. Added 2026-10-12 on the user's word.
 *
 * THE HEADER, OLD AND NEW. The Python course's content slides
 * (`Reference ppt's/image copy.png`, a 28 Set Operations frame) carry an
 * accent rail at the frame's edge: a 36px edge bar at x 0..36 and a 9px rail
 * at x 48..57, y 78..198, brand blue fading down to the ground (the kit's
 * content rule 23, two bars). The new design has no rail; it puts the style
 * guide's GRADIENT DIVIDER (`slidestraining/NxtWave PPT Template/05 - Design
 * Elements.png`, "visual separation between headings, sections and content
 * blocks") BETWEEN the kicker and the heading, the way the agenda reference
 * does under its own kicker. That is the one change: the bars go, the
 * divider comes in between.
 *
 * THE KICKER AND HEADING STAY WHERE THEY ARE (user: same positions and
 * sizes as now, not exact). Measured off the reference, 1920 frame:
 *   - kicker ink x 97..329, y 82..98: 16px caps, tracked, brand blue
 *     (the kit's 15px x 1.5, 0.14em, weight 700);
 *   - heading ink x 98..484, caps top y 135, descender to 189: the kit's
 *     34px x 1.5 = 51px, weight 700, on the same left edge, x=96.
 * Both are kept at those boxes. The divider sits in the 37px between them:
 * 4px tall at y 115, the agenda rule's own thickness, run and fade (600px
 * from x=96, solid deep blue to nothing).
 *
 * FACES (rule 2 of this folder): the heading is Sora SemiBold where the kit
 * sets Poppins Bold; the kicker is DM Sans, as the kit's Inter was. Colours
 * are the style guide's: kicker brand blue, heading black.
 */

/** The content gutter: the kit's 64px x 1.5. The kicker, divider and heading all start here. */
export const CONTENT_LEFT = 96

export const contentType = {
  /** 16px caps in the reference, DM Sans 700 at 22.5px, tracked 0.14em. */
  kicker: {
    fontFamily: fonts.body,
    fontWeight: 700,
    fontSize: 22.5,
    lineHeight: 1,
    letterSpacing: '0.14em',
    textTransform: 'uppercase' as const,
  },
  /** The kit's 34px title at x1.5, in Sora SemiBold. */
  title: { fontFamily: fonts.title, fontWeight: 600, fontSize: 51, lineHeight: 1.12 },
} as const

/** Where the header's three parts sit, in px on the 1920x1080 stage. */
export const HEADER = {
  kickerTop: 79,
  dividerTop: 115,
  dividerWidth: 600,
  dividerHeight: 4,
  titleTop: 127,
} as const

/** The divider: the agenda rule's gradient, solid deep blue for 13%, then away. */
const DIVIDER: CSSProperties = {
  position: 'absolute',
  left: CONTENT_LEFT,
  top: HEADER.dividerTop,
  width: HEADER.dividerWidth,
  height: HEADER.dividerHeight,
  background: `linear-gradient(90deg, ${colors.deep} 0%, ${colors.deep} 13%, rgba(45,99,251,0.55) 68%, rgba(45,99,251,0) 100%)`,
}

export function ContentSlide({ kicker, title, children }: ContentSlideProps) {
  return (
    <Stage ground="paper" style={{ color: colors.black }}>
      {/* the agenda ground's chrome: two rings, the mark, the bar */}
      <Arc
        cx={1159}
        cy={753}
        color={colors.deep}
        opacity={0.26}
        mask="linear-gradient(90deg, transparent 0%, transparent 52%, #000 72%)"
      />
      <Arc cx={2428} cy={36} color={colors.deep} opacity={0.27} />

      {/* header: kicker, divider, heading */}
      <p
        style={{
          ...contentType.kicker,
          position: 'absolute',
          left: CONTENT_LEFT,
          top: HEADER.kickerTop,
          margin: 0,
          color: colors.blue,
        }}
      >
        {kicker}
      </p>
      <div aria-hidden style={DIVIDER} />
      <h2
        style={{
          ...contentType.title,
          position: 'absolute',
          left: CONTENT_LEFT,
          top: HEADER.titleTop,
          margin: 0,
          color: colors.black,
        }}
      >
        {title}
      </h2>

      {children}

      <CornerLogo />
      <div aria-hidden style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 12, background: colors.blue }} />
    </Stage>
  )
}
