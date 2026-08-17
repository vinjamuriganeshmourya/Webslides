import type { ReactNode } from 'react'
import { Logo } from './Logo'
import { DotGrid, Blob, Orb } from './Decor'
import { colors } from '@/design/tokens'

export type SlideVariant = 'light' | 'plain' | 'brand' | 'night'

/**
 * The light slides' background arcs.
 *
 * TWO arcs, not a family: one curving down-right, and its mirror image curving
 * down-left, crossing each other near the top right. That crossing is the whole
 * shape — a nested set of concentric arcs, which is what this was before, reads
 * as a ripple and looks nothing like the template.
 *
 * The pair is defined as one circle reflected about the canvas's horizontal
 * centre line, so they are exact mirrors by construction: same radius, centres
 * at y = -60 and y = 720 + 60. Change one number and both arcs stay symmetric.
 */
const ARC_R = 820
const ARC_X = 1500
const ARC_INSET = 60
const ARCS = [
  { cx: ARC_X, cy: -ARC_INSET, alpha: '2E' },
  { cx: ARC_X, cy: 720 + ARC_INSET, alpha: '24' },
]

const BG: Record<SlideVariant, string> = {
  light: 'bg-brand-soft text-ink',
  plain: 'bg-white text-ink',
  brand: 'bg-brand-gradient text-white',
  night: 'bg-night-gradient text-white',
}

/**
 * The frame every slide sits in: a 1280×720 canvas with a background
 * variant, optional decorative furniture, and an optional footer carrying
 * the NxtWave mark. Content slides use `light`/`plain`; section & hero
 * slides use `brand`/`night`.
 */
export function SlideBase({
  variant = 'light',
  children,
  className = '',
  decor = true,
  footer = true,
  footerLogo = true,
  /**
   * Session name. Accepted for API compatibility (every slide type forwards it)
   * but no longer rendered: see the footer note below.
   */
  lesson: _lesson,
  padded = true,
}: {
  variant?: SlideVariant
  children: ReactNode
  className?: string
  decor?: boolean
  footer?: boolean
  /** Hide the footer logo while keeping the lesson text (brand slide: logo hero already on stage). */
  footerLogo?: boolean
  lesson?: string
  padded?: boolean
}) {
  const dark = variant === 'brand' || variant === 'night'
  return (
    <section
      className={`absolute inset-0 overflow-hidden font-body ${BG[variant]} ${className}`}
      style={{ width: 1280, height: 720 }}
    >
      {/* Decorative furniture per family */}
      {/*
        VIDEO BOX RESERVATION
        The top-right 367x220 of this 1280x720 canvas (equivalently 550x330 on a
        1920x1080 canvas) is kept clear for an instructor video composited in
        later. The box is deliberately NOT drawn here: slides simply do not place
        anything in x 913..1280, y 0..220. Run `node video-safe.mjs <url> <count>`
        to assert that.

        The light family used to carry a DotGrid at `right-10 top-9`, which sat
        inside that rectangle on roughly 35 slides. It is removed rather than
        moved: decorating a region that will be covered by video is wasted ink,
        and every other candidate position either collided with the kicker or
        showed through the right-hand content column.
      */}
      {/*
        The light family carries the same soft blue field as the agenda: a wash
        in the top right and one bottom left. Flat #F4F8FF over 30-odd slides
        read as a blank sheet, and the wash gives every content slide the same
        quiet depth the opening frames have, without putting anything behind the
        text. Both are pointer-events-none decor, and the top-right wash is
        blurred well outside the reserved video rectangle.
      */}
      {decor && (variant === 'light' || variant === 'plain') && (
        <>
          <div
            className="pointer-events-none absolute right-0 top-0 h-[26rem] w-[30rem] blur-2xl"
            style={{
              /* Anchored to the corner the arcs converge on, so the wash and the
                 arcs read as one thing rather than two separate decorations. */
              background:
                'radial-gradient(58% 58% at 92% 6%, rgba(45,99,251,0.26) 0%, transparent 100%)',
            }}
          />

          {/*
            ORBIT ARCS
            Two arcs that CROSS in the top right, as the template draws them:
            one sweeping down to the right, the other its mirror sweeping down to
            the left. See ARCS above for why they are defined as one circle and
            its reflection.

            Both centres sit outside the canvas, so only the flanks cross the
            frame — the crossing sits over the instructor video box and the text
            column stays clear.

            Circles rather than an <svg>: a decorative svg spanning the canvas
            trips the video-box sweep, because on an SVG element `className` is
            an SVGAnimatedString and the harness cannot see `pointer-events-none`
            on it. Divs are skipped correctly.

            Kept at 1px and under 18% alpha. Anything heavier competes with the
            body text, which is the one thing these must never do.
          */}
          {ARCS.map((arc) => (
            <div
              key={arc.cy}
              aria-hidden
              className="pointer-events-none absolute rounded-full"
              style={{
                width: ARC_R * 2,
                height: ARC_R * 2,
                left: arc.cx - ARC_R,
                top: arc.cy - ARC_R,
                border: `1px solid ${colors.nwBlue}${arc.alpha}`,
              }}
            />
          ))}

          <Blob className="-bottom-24 -left-24 h-72 w-72" opacity={0.1} />
        </>
      )}
      {decor && variant === 'brand' && (
        <>
          <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full border-[40px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 rounded-full bg-white/5" />
          <DotGrid className="right-16 bottom-16" color="#FFFFFF" opacity={0.22} rows={4} cols={6} />
        </>
      )}
      {/* The night family is the style guide's stage, so its orbs carry the
          guide's blues. They used to be the Evolve blue and teal, which put a
          green cast in the bottom-left corner of every dark slide. */}
      {decor && variant === 'night' && (
        <>
          <Orb className="-right-24 -top-24" color="#2D63FB" size={460} />
          <Orb className="-bottom-32 -left-24" color="#0146C7" size={420} />
          <DotGrid className="right-16 top-1/2" color="#FFFFFF" opacity={0.14} />
        </>
      )}

      {/* Content region */}
      <div className={`relative z-10 flex h-full flex-col ${padded ? 'px-16 pb-16 pt-12' : ''}`}>
        {children}
      </div>

      {/*
        Footer: the NxtWave mark only.

        The session name is deliberately NOT repeated here. It sat bottom-right,
        directly under the deck's control cluster, so it collided with the slide
        counter. The session name is already on stage via each slide's kicker, so
        the footer copy was duplication as well as a collision.

        `lesson` is still accepted (it is part of the kit's API and `sampleDeck`
        passes it) but is no longer rendered.
      */}
      {footer && (
        <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center px-8 pb-4">
          {footerLogo && <Logo className="h-9" onDark={dark} />}
        </footer>
      )}
      {footer && !dark && <div className="slide-footer-bar" />}
    </section>
  )
}
