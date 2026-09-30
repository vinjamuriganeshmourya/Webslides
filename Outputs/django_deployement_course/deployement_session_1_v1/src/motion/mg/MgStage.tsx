/**
 * The dark inset panel that motion graphics play inside.
 *
 * WHY AN INSET RATHER THAN A FULL-BLEED DARK SLIDE
 * The appendix mandates a dark palette (`bg #0F172A`) for every motion graphic,
 * while the nw2027 content family is a near-white field. Rather than alternate
 * the deck light/dark ten times — which loses the slide title and progress bar
 * on exactly the slides carrying the heaviest teaching — each graphic renders
 * as a rounded dark panel sitting on the light slide, read as a *screen*. The
 * existing `TerminalSlide2027` already establishes this treatment, so it reads
 * as deliberate rather than as a palette clash. Signed off 2026-08-11.
 *
 * The graphic itself is authored at 1920×1080 and scaled into whatever box the
 * slide gives it, so asset code always uses the appendix's own coordinates.
 */

import type { ReactNode } from 'react'
import { MG_HEIGHT, MG_WIDTH, mgColors, mgFonts } from '@/design/mg'
import { useMgClock, type MgClock } from './clock'

/**
 * Props every motion graphic takes. Assets are pure functions of the clock —
 * they own no state — which is what lets the deck scrub, pause and replay them,
 * and what makes the final held frame reusable as a static diagram.
 */
export interface MgProps {
  clock: MgClock
}

/**
 * Wraps a graphic in its dark screen and drives its clock.
 *
 * `autoplay` is on by default: most graphics in this deck open a slide and are
 * meant to run as the presenter arrives. Graphics that land a point mid-slide
 * pass `autoplay={false}` and are started by the presenter.
 */
export function MgStage({
  duration,
  width,
  height,
  autoplay = true,
  children,
  label,
}: {
  /** Total run time in seconds — the asset's specified length. */
  duration: number
  /** Panel size in slide px (1920×1080 slide canvas). */
  width: number
  height: number
  autoplay?: boolean
  children: (clock: MgClock) => ReactNode
  /** Asset id shown in the corner chip, e.g. "mg-3b". */
  label?: string
}) {
  const clock = useMgClock(duration, autoplay)
  // The graphic is authored at 1920×1080; fit it into the panel by height, and
  // pillarbox if the panel is wider than 16:9.
  const scale = Math.min(width / MG_WIDTH, height / MG_HEIGHT)

  return (
    <div
      onClick={clock.restart}
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 24,
        overflow: 'hidden',
        background: mgColors.bg,
        boxShadow: '0 40px 90px -40px rgba(0, 20, 70, 0.65)',
        border: '1px solid rgba(148,163,184,0.18)',
        cursor: 'pointer',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: (width - MG_WIDTH * scale) / 2,
          top: (height - MG_HEIGHT * scale) / 2,
          width: MG_WIDTH,
          height: MG_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {children(clock)}
      </div>

      {label && (
        <span
          style={{
            position: 'absolute',
            right: 18,
            top: 16,
            fontFamily: mgFonts.mono,
            fontSize: 20,
            color: mgColors.inkMuted,
            opacity: 0.5,
          }}
        >
          {label}
        </span>
      )}

      {/* Playhead — doubles as the presenter's cue that the beat sheet is running. */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 4, background: 'rgba(148,163,184,0.16)' }}>
        <div
          style={{
            width: `${(clock.t / clock.duration) * 100}%`,
            height: '100%',
            background: mgColors.dockerBlue,
          }}
        />
      </div>

      {clock.done && (
        <span
          style={{
            position: 'absolute',
            left: 20,
            bottom: 18,
            fontFamily: mgFonts.sans,
            fontSize: 20,
            color: mgColors.inkMuted,
            opacity: 0.55,
          }}
        >
          click to replay
        </span>
      )}
    </div>
  )
}

/**
 * A sized, labelled stand-in for a graphic that hasn't been built yet.
 *
 * Deliberately shows the asset id, title and specified duration, so a skeleton
 * deck can be reviewed for flow and copy before any animation is written — and
 * so it is never mistaken for a finished frame in a screenshot.
 */
export function MgPlaceholder({
  id,
  title,
  seconds,
  width,
  height,
}: {
  id: string
  title: string
  seconds: number
  width: number
  height: number
}) {
  return (
    <div
      style={{
        position: 'relative',
        width,
        height,
        borderRadius: 24,
        background: mgColors.bg,
        border: `2px dashed ${mgColors.inkMuted}`,
        display: 'grid',
        placeContent: 'center',
        gap: 12,
        textAlign: 'center',
        boxShadow: '0 40px 90px -40px rgba(0, 20, 70, 0.65)',
      }}
    >
      <span style={{ fontFamily: mgFonts.mono, fontSize: 26, color: mgColors.dockerBlue }}>{id}</span>
      <span style={{ fontFamily: mgFonts.sans, fontSize: 40, fontWeight: 600, color: mgColors.ink }}>{title}</span>
      <span style={{ fontFamily: mgFonts.sans, fontSize: 24, color: mgColors.inkMuted }}>
        motion graphic · ~{seconds}s · not yet built
      </span>
    </div>
  )
}
