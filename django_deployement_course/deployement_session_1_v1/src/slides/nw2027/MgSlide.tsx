/**
 * The motion-graphic slide layout.
 *
 * A normal nw2027 content slide gives its title block ~330px of headroom, which
 * is right for tables and cards but wastes the slide when the payload is a
 * 16:9 animation — the graphic ends up under 60% of the slide width. This
 * layout runs a compact single-line header instead, so the dark stage can take
 * the full remaining height and the graphic reads at the size it was designed
 * for on a 1920 grid.
 *
 * Two shapes:
 *   - no `aside` — the stage is centred and as large as the slide allows
 *   - with `aside` — the stage sits left, supporting copy runs down the right
 */

import type { ReactNode } from 'react'
import { Slide2027 } from '@/ui/nw2027/Frame'
import { nwColors, nwGradients, nwLayout, nwType } from '@/design/nw2027'

/** Top of the stage, below the compact header. */
const STAGE_TOP = 208
/** Bottom of the stage, above the progress bar. */
const STAGE_BOTTOM = 1080 - nwLayout.marginBottom - 20
const ASIDE_W = 476
const GUTTER = 48

export interface MgSlideGeometry {
  width: number
  height: number
}

/**
 * The stage box this layout will hand a graphic, for the given `aside` choice.
 * Exported so deck code can size an `MgPlaceholder` identically to the real
 * stage — a placeholder that isn't the finished size is a misleading review.
 */
export function mgStageBox(hasAside: boolean): MgSlideGeometry {
  const height = STAGE_BOTTOM - STAGE_TOP
  const available = hasAside
    ? 1920 - nwLayout.marginX * 2 - ASIDE_W - GUTTER
    : 1920 - nwLayout.marginX * 2
  // 16:9, fitted by whichever dimension binds.
  const width = Math.min(available, (height * 16) / 9)
  return { width, height: Math.min(height, (width * 9) / 16) }
}

export function MgSlide2027({
  kicker,
  index,
  title,
  aside,
  progress,
  children,
}: {
  kicker?: ReactNode
  index?: number | string
  title: ReactNode
  /** Supporting copy to the right of the stage. */
  aside?: ReactNode
  progress?: { total: number; current: number }
  /** The stage — size it with `mgStageBox(!!aside)`. */
  children: ReactNode
}) {
  const geo = mgStageBox(!!aside)
  const stageLeft = aside ? nwLayout.marginX : (1920 - geo.width) / 2

  return (
    <Slide2027 variant="light" progress={progress}>
      <header style={{ position: 'absolute', left: nwLayout.marginX, top: 56, right: nwLayout.marginX }}>
        {kicker && (
          <div style={{ ...nwType('subHeadXs'), color: nwColors.primaryBlue, letterSpacing: '0.08em' }}>
            {kicker}
          </div>
        )}
        <h2 style={{ ...nwType('subHeadXl'), color: nwColors.primaryDarkBlue, margin: '10px 0 0' }}>
          {index != null && <span style={{ marginRight: 18, color: nwColors.primaryBlue }}>{index}.</span>}
          {title}
        </h2>
        <div style={{ width: 380, height: 3, marginTop: 16, background: nwGradients.kickerRule }} />
      </header>

      <div style={{ position: 'absolute', left: stageLeft, top: STAGE_TOP }}>{children}</div>

      {aside && (
        <div
          style={{
            position: 'absolute',
            left: nwLayout.marginX + geo.width + GUTTER,
            top: STAGE_TOP,
            width: ASIDE_W,
            bottom: nwLayout.marginBottom + 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 28,
            ...nwType('bodyS'),
            color: nwColors.ink,
          }}
        >
          {aside}
        </div>
      )}
    </Slide2027>
  )
}
