import { motion } from 'framer-motion'
import { SlideBase } from '@/ui'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import type { AgendaSlideProps } from './types'

/**
 * AGENDA — a navy orbit mark on the left, the session's sections strung along a
 * arc on the right.
 *
 * The previous version was a stack of bordered cards, which gave four equal
 * boxes and no sense of sequence. Here the numbers sit ON a single curve, so the
 * eye is carried down the list in order and the whole slide reads as one object
 * rather than as a list of containers.
 *
 * GEOMETRY
 * Every item and the curve itself come from the same function, so they cannot
 * drift apart: `x = X_BASE + BULGE * sin(pi * t)`, `y` spread evenly, with `t`
 * running 0..1 across the items. The drawn path samples the same function past
 * both ends, which is what lets the curve run off the top and bottom edges the
 * way the reference does.
 *
 * The first item starts low enough that nothing lands in the rectangle reserved
 * at the top right for the instructor video (x913..1280, y0..220).
 *
 * `Y_TOP` WAS 236 AND THAT WAS NOT LOW ENOUGH.
 *
 * The item's text block is positioned `top: y` with `y: '-50%'`, so it is
 * CENTRED on `Y_TOP`, not started at it. A 27px title's own box is ~34px tall,
 * which put its top edge at y=219, one pixel inside the rectangle; add the `sub`
 * every real deck passes and the block is ~60px tall, so the top edge lands at
 * y=204 and `video-safe.mjs` reports a 42px intrusion on any agenda whose first
 * item is wide enough to reach x=913. The first Python session's is: rule 20
 * fixes the agenda strings, so the title cannot be shortened to dodge it.
 *
 * 268 leaves the block's top edge at y≈238 with a sub, clear of the rectangle,
 * and `Y_BOTTOM` is unchanged so the items simply sit slightly closer together.
 */

/*
  THE CURVE
  One cubic Bézier, sweeping in from the top left, bulging right through the
  middle and returning left at the bottom — the shape of the reference. It is
  deliberately NOT symmetric: the entry is steeper than the exit, which is what
  makes it read as a sweep rather than as a bow.

  An earlier version placed the numbers with `sin(pi * t)` and drew the path from
  the same function. That is symmetric, and worse, it reverses direction just
  past each end, so the line kinked back on itself at the top and bottom instead
  of running off the frame.

  Numbers are positioned by SAMPLING this very path, so they sit exactly on the
  drawn line by construction rather than by two formulas being kept in step.
*/
const P0 = { x: 398, y: 4 }
const P1 = { x: 545, y: 170 }
const P2 = { x: 548, y: 505 }
const P3 = { x: 424, y: 706 }

/** Where the first and last item sit vertically. */
const Y_TOP = 268
const Y_BOTTOM = 612

const bezier = (t: number) => {
  const u = 1 - t
  const a = u * u * u
  const b = 3 * u * u * t
  const c = 3 * u * t * t
  const d = t * t * t
  return {
    x: a * P0.x + b * P1.x + c * P2.x + d * P3.x,
    y: a * P0.y + b * P1.y + c * P2.y + d * P3.y,
  }
}

/** The x on the curve at a given y, found by sampling — the curve is monotonic
 *  in y, so a linear scan is exact enough at this resolution. */
function xAt(y: number) {
  let best = bezier(0)
  let bestDy = Math.abs(best.y - y)
  for (let t = 0; t <= 1; t += 0.002) {
    const p = bezier(t)
    const dy = Math.abs(p.y - y)
    if (dy < bestDy) {
      best = p
      bestDy = dy
    }
  }
  return best.x
}

const CURVE_D = `M${P0.x} ${P0.y} C${P1.x} ${P1.y} ${P2.x} ${P2.y} ${P3.x} ${P3.y}`

/** How long the line takes to draw itself, in seconds. */
const DRAW = 1.9
/** The line is already moving before the first item lands. */
const FIRST_AT = 0.45

export function AgendaSlide({
  kicker = 'Agenda',
  title = 'Agenda',
  items,
  lesson,
}: AgendaSlideProps) {
  const n = items.length
  const instant = useInstant()

  return (
    <SlideBase variant="light" lesson={lesson} padded={false}>
      {/* the soft blue field behind the curve, top right */}
      <div
        className="pointer-events-none absolute right-1 top-0 h-[30rem] w-[33rem] blur-3xl"
        style={{
          background: `radial-gradient(60% 60% at 80% 20%, ${colors.nwBlue}33 0%, transparent 100%)`,
        }}
      />

      {/* the orbit mark */}
      <div className="absolute left-[292px] top-[366px] -translate-x-1/2 -translate-y-1/2">
        <motion.span
          aria-hidden
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{ width: 338, height: 338, border: `1px solid ${colors.nwNavy}1F` }}
          initial={{ opacity: 0, scale: 0.9, x: '-50%', y: '-50%' }}
          animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        />
        <motion.div
          className="relative grid place-items-center rounded-full text-center"
          style={{ width: 268, height: 268, background: colors.nwNavy }}
          initial={{ opacity: 0, scale: 0.86 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="px-10">
            <p className="text-body-sm font-semibold leading-snug text-white/70">{kicker}</p>
            <p className="mt-1 font-heading text-[46px] font-extrabold leading-none text-white">
              {title}
            </p>
          </div>
        </motion.div>
      </div>

      {/*
        The curve's canvas is a narrow band, not the whole slide. A full-bleed
        <svg> would overlap the reserved video rectangle, and the video-box sweep
        cannot skip it the way it skips decorative divs: on an SVG element
        `className` is an SVGAnimatedString rather than a string, so its
        `pointer-events-none` is invisible to that check.
      */}
      <svg
        className="pointer-events-none absolute"
        style={{ left: 360, top: 0 }}
        width={240}
        height={710}
        viewBox="360 0 240 710"
        aria-hidden
      >
        <motion.path
          d={CURVE_D}
          fill="none"
          stroke={colors.nwBlue}
          strokeOpacity={0.45}
          strokeWidth={1.5}
          initial={instant ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: instant ? 0 : DRAW, ease: 'easeInOut' }}
        />
      </svg>

      {/*
        Each item lands as the line reaches it, rather than the whole list
        appearing at once. The delay is the item's own position along the curve
        scaled by the draw time, so the timing follows the drawing by
        construction: move an item and its cue moves with it.

        These are plain entrances rather than click-driven `Step`s. The deck's
        plain arrows now jump whole slides, so a click-built agenda would never
        get built at all; this plays itself as soon as the slide is on screen.
      */}
      {items.map((item, i) => {
        const t = n === 1 ? 0.5 : i / (n - 1)
        const y = n === 1 ? (Y_TOP + Y_BOTTOM) / 2 : Y_TOP + t * (Y_BOTTOM - Y_TOP)
        const x = xAt(y)
        const delay = instant ? 0 : FIRST_AT + t * (DRAW - FIRST_AT - 0.15)
        const rise = { duration: instant ? 0 : 0.55, delay, ease: [0.16, 1, 0.3, 1] as const }
        return (
          <div key={i}>
            <motion.div
              className="absolute"
              style={{ left: x, top: y }}
              initial={instant ? false : { opacity: 0, scale: 0.5, x: '-50%', y: '-50%' }}
              animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
              transition={rise}
            >
              <span
                className="grid h-9 w-9 place-items-center rounded-full font-heading text-body-sm font-bold"
                style={{ background: '#DCE7FB', color: colors.nwNavy }}
              >
                {i + 1}
              </span>
            </motion.div>
            <motion.div
              className="absolute"
              style={{ left: x + 42, top: y }}
              initial={instant ? false : { opacity: 0, x: -14, y: '-50%' }}
              animate={{ opacity: 1, x: 0, y: '-50%' }}
              transition={{ ...rise, delay: delay + 0.08 }}
            >
              <p
                className="font-heading text-[27px] font-bold leading-tight"
                style={{ color: colors.nwBlue }}
              >
                {item.title}
              </p>
              {item.sub && <p className="mt-1 text-body-sm text-body">{item.sub}</p>}
            </motion.div>
          </div>
        )
      })}
    </SlideBase>
  )
}
