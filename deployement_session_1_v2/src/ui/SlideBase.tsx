import type { ReactNode } from 'react'
import { Logo } from './Logo'
import { DotGrid, Orb } from './Decor'
import { colors } from '@/design/tokens'

export type SlideVariant = 'light' | 'plain' | 'brand' | 'night'

/**
 * The light slides' background arcs: TWO EQUAL CIRCLES, measured off the
 * reference render rather than guessed.
 *
 * WHAT THEY ACTUALLY ARE
 *
 * Two complete rings of the SAME diameter, positioned so that only part of each
 * falls inside the 1280x720 frame:
 *
 *   - The upper one is centred well off the right edge, so the only visible piece
 *     is its lower-left flank: it enters at the top edge around x=1054, bulges
 *     left, and leaves by the right edge around y=405.
 *   - The lower one is centred INSIDE the frame, low and left of centre, so both
 *     of its flanks show: the right flank sweeps down the top-right, and the left
 *     flank comes back through the lower left. Its leftmost point is x=268.
 *
 * They CROSS, in the upper right at roughly (1058, 60). An earlier version of
 * this file asserted at length that they must never cross and built two
 * counter-rotated ellipses sharing one notional centre to guarantee it. That was
 * wrong about the design: the crossing is in the reference and it is the most
 * recognisable thing about the figure.
 *
 * HOW THE NUMBERS WERE OBTAINED
 *
 * Not by eye, which is how the earlier version went wrong twice. The reference
 * PNG was differenced against a horizontally-smoothed copy of itself to isolate
 * the hairlines, the per-row peaks were tracked into two curves, and a circle was
 * least-squares fitted to each. Both fits landed under 0.8px maximum residual,
 * and walking each fitted ring by angle found the line present on 99% of the
 * on-canvas degrees. That is what says "circles, not rotated ellipses": an
 * ellipse would not fit a circle to sub-pixel accuracy over 280 points.
 *
 * Then scaled by 1280/1183 from the reference capture's width to this canvas.
 *
 * Expressed as `left`/`top`/`size` because a rounded div is positioned by its
 * box, not by its centre. `size` is shared: the two circles measured 1051 and
 * 1054, which is one diameter plus measurement noise.
 *
 * The alphas are NOT from the reference. A 1px line at ~10% over a pale ground,
 * in a capture that had already been scaled down, cannot be recovered reliably —
 * the same ring measured anywhere from 0.04 to 0.29 depending on where it was
 * sampled. These are the deck's existing weights, which sit in that range.
 */
/**
 * The top-right glow.
 *
 * `WASH_CURVE` is the reference's measured falloff, kept as data: alpha as a
 * FRACTION of the peak against position along the gradient. `WASH_PEAK` is the
 * only strength knob, so the measured shape cannot drift when the strength is
 * retuned. See the note at the call site for how the curve was recovered.
 */
const WASH_CURVE: Array<[stop: number, fraction: number]> = [
  [0, 1], [8, 1], [15, 0.955], [22, 0.88], [30, 0.755], [38, 0.63],
  [46, 0.48], [55, 0.355], [65, 0.22], [75, 0.115], [85, 0.048], [100, 0],
]

/** Alpha at the corner, 0..1. The reference measures 1.0; this is a whisper of it. */
const WASH_PEAK = 0.13

const LIGHT_WASH = `radial-gradient(595px 545px at 100% 0%, ${WASH_CURVE.map(
  ([stop, fraction]) => `rgba(45,99,251,${(fraction * WASH_PEAK).toFixed(4)}) ${stop}%`,
).join(', ')})`

const ARC_SIZE = 1052
const ARCS = [
  /* centre (1580, -19): off the right edge and above the top, lower-left flank
     visible. Entirely in the empty top-right, so it needs no mask. */
  { left: 1054, top: -545, alpha: '2E' },
  /*
    centre (794, 513): inside the frame, so BOTH flanks show — and the left one
    sweeps down through x≈371 at y=200, x≈280 at y=400 and back out at x≈310, which
    is straight through the bullet column.

    At a flat alpha that flank reads as a stray line drawn across the text rather
    than as background, which is exactly what it looked like before this mask. In
    the reference it is barely there: measured against the pale ground it sits at
    roughly 4% effective alpha, against 14% for the same ring where it crosses the
    blue wash in the top right. So the ring is not one flat weight in the reference
    either.

    The mask runs from the div's top-right corner to its bottom-left, which in
    slide terms is "full strength where the slide is empty, gone by the time it
    reaches the copy". A single lower alpha would have faded the top-right stretch
    too, where the line is meant to be seen.
  */
  {
    left: 268,
    top: -13,
    alpha: '24',
    mask: 'linear-gradient(to bottom left, #000 0%, rgba(0,0,0,0.85) 30%, rgba(0,0,0,0.32) 58%, transparent 80%)',
  },
]
/**
 * THE FOUR STAGES.
 *
 * `night` is the deck's ONE dark stage: the style guide's navy carrying its deep
 * blue. Every dark chrome slide (welcome, session name, section dividers,
 * practice, feedback, thank you) sits on it, so the deck opens and closes on one
 * ground instead of jumping between two.
 *
 * Two things were wrong here before, and they compounded:
 *
 *   1. `night` was the Evolve near-black (`bg-night-gradient`, #081026) and
 *      `brand` was the Evolve blue-into-teal (`bg-brand-gradient`) — neither is
 *      in the style guide. So every dark slide overrode this map by passing
 *      `className="bg-nw-gradient"` on top.
 *   2. That override sets the SAME CSS property as the class here, so which one
 *      won was decided by Tailwind's output order — the order of keys in
 *      `backgroundImage` in tailwind.config.ts — not by intent. Reordering that
 *      config object silently recoloured every dark slide in the deck.
 *
 * Both are fixed by naming the real grounds here and passing NO background in
 * `className` from a slide. If a slide needs a different ground, it gets a
 * variant, not an override.
 */
const BG: Record<SlideVariant, string> = {
  light: 'bg-brand-soft text-ink',
  plain: 'bg-white text-ink',
  /* The bright style-guide gradient. Kept nameable, but no slide type uses it:
     the chrome all sits on `night` so the deck reads as one theme. */
  brand: 'bg-nw-gradient text-white',
  night: 'bg-nw-night text-white',
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
          {/*
            THE TOP-RIGHT WASH — the light slides' only source of depth.

            MEASURED off the reference render, not chosen. The alpha field was
            recovered per pixel as (base - pixel) / (base - blue) on the red
            channel, sampling the flat ground at (240,243,252) as the base, then
            read along the top and right edges by distance from the corner:

                t = d / radius   0.07  0.15  0.22  0.30  0.38  0.46  0.55  0.65  0.75  0.85  1.0
                alpha            1.00  0.96  0.88  0.76  0.63  0.48  0.36  0.22  0.12  0.05    0

            It is an ELLIPSE, not a circle: normalising by one radius left the top
            edge reading systematically low and the right edge high, and the two
            profiles only collapse onto one curve at 595x545.

            SHAPE FROM THE REFERENCE, STRENGTH DIALLED WAY DOWN. At the measured
            alpha the corner goes solid blue. That suits the reference frame, which
            carries a header and nothing else, and is far too loud on a slide with a
            code panel or a table in the right-hand column. `WASH_PEAK` scales the
            whole curve, so the broad soft falloff that makes the frame feel deep
            survives while the colour itself stays barely visible.

            Turn WASH_PEAK to change the strength. Do NOT edit individual stops: the
            breadth of the falloff is the part doing the work, and a stop out of
            order (0.115 at 9%, say) makes the gradient double back on itself.

            This replaced a 26x30rem blurred box at a flat 0.26 peak, which
            measured 0.12 at the corner and nothing at all below y≈200: the slides
            read as a flat sheet with a faint smudge, and the arcs had no field to
            sit in. The difference between the two is the "depth" this frame was
            missing.

            THE COLOUR IS OURS, NOT THE REFERENCE'S. At full strength the reference
            wash resolves to about (43,137,253), a brighter azure than the style
            guide's #2D63FB (45,99,251) — measurable because the green channel
            back-solves to 138 at three different alphas. Matching that hue would
            mean adding a blue the palette does not have, so the DEPTH and EXTENT
            are reproduced and the hue stays on-theme. The corner therefore reads a
            touch deeper and less cyan than the reference.

            No blur: the gradient is already smooth, and blurring it pulled the
            strongest point back off the corner, which is where it belongs.
          */}
          <div className="pointer-events-none absolute inset-0" style={{ background: LIGHT_WASH }} />

          {/*
            ORBIT ARCS
            Two equal circles, positioned so each shows only partly. See the ARCS
            constant above for the geometry, how it was measured, and why they do
            cross.

            Divs rather than an <svg>: a decorative svg spanning the canvas trips
            the video-box sweep, because on an SVG element `className` is an
            SVGAnimatedString and the harness cannot see `pointer-events-none` on
            it. Divs are skipped correctly.

            Kept at 1px and under 18% alpha. Anything heavier competes with the
            body text, which is the one thing these must never do — and the lower
            circle's left flank passes through the bullet column, so it has to
            stay a hairline rather than being nudged out of the way.
          */}
{ARCS.map((arc, index) => (
  <div
    key={index}
    aria-hidden
    className="pointer-events-none absolute rounded-[50%]"
    style={{
      width: ARC_SIZE,
      height: ARC_SIZE,
      left: arc.left,
      top: arc.top,
      border: `1px solid ${colors.nwBlue}${arc.alpha}`,
      /* `WebkitMaskImage` as well: the export harnesses drive Chrome, which only
         dropped the prefix requirement recently, and a deck built today is opened
         on whatever browser the presenter has. */
      ...(arc.mask ? { maskImage: arc.mask, WebkitMaskImage: arc.mask } : {}),
    }}
  />
))}

          {/*
            NO BOTTOM-LEFT BLOB.

            There used to be a 0.1-opacity teal-to-blue blob here. Amplifying the
            reference ground 18x shows that corner is CLEAN: the only thing in the
            lower left is the lower arc's flank. The blob also sat directly behind
            the footer mark, so the one place the brand is signed had a smudge under
            it. The depth on these slides comes from the top-right glow, and one
            source of light is what makes it read as light.
          */}
        </>
      )}
      {/*
        ONE FURNITURE SET FOR BOTH DARK STAGES.

        `brand` used to carry a 40px white ring, a white disc and a 22%-opacity
        dot grid, while `night` carried two blue orbs and a 14% dot grid. Since
        every dark slide had already overridden its background to the same blue,
        the two sets sat on an IDENTICAL ground and were the visible mismatch:
        the session-name frame and the section dividers were the same colour but
        had completely different decoration.

        The orbs win because they are the style guide's own blues and they read
        as depth on the navy rather than as drawn shapes. On the old bright-blue
        ground they were invisible (same hue as the background), which is why the
        session-name frame looked like a bare gradient with a stray dot grid.
      */}
      {decor && dark && (
        <>
          <Orb className="-right-24 -top-24" color={colors.nwBlue} size={460} />
          <Orb className="-bottom-32 -left-24" color={colors.nwDeep} size={420} />
          <DotGrid className="right-16 top-1/2" color="#FFFFFF" opacity={0.14} />
        </>
      )}

      {/* Content region */}
      <div className={`relative z-10 flex h-full flex-col ${padded ? 'px-16 pb-16 pt-12' : ''}`}>
        {children}
      </div>

      {/*
        Footer: the NxtWave mark only, bottom-RIGHT.

        The mark and the deck's control cluster swapped corners: the mark is the
        signature and belongs where the eye finishes, and the controls are the
        presenter's tools rather than the room's. See `DeckControls`, which now
        pins itself bottom-left; the two must stay on opposite sides or they
        collide.

        The session name is deliberately NOT repeated here. It used to sit in
        this corner, under what was then the control cluster, so it collided with
        the slide counter. The session name is already on stage via each slide's kicker, so
        the footer copy was duplication as well as a collision.

        `lesson` is still accepted (it is part of the kit's API and `sampleDeck`
        passes it) but is no longer rendered.
      */}
      {footer && (
        <footer className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-end px-8 pb-4">
          {footerLogo && <Logo className="h-9" onDark={dark} />}
        </footer>
      )}
      {footer && !dark && <div className="slide-footer-bar" />}
    </section>
  )
}
