import type { CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useClaimedSteps } from '@/motion/Stepper'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * SHARED MOTION FOR EVERY VARIANT IN THIS LAB.
 *
 * Copied from `comparison-lab`, which took it from `definitions-lab`, which
 * trimmed it from `points-lab`. The names are kept EXACTLY as the siblings have
 * them (`beat`, `useBeats`, `FcNodeIn`, `FcEdgeLabel`, `FcEdgeDraw`) even though
 * `Fc` stands for flow chart and there is no flow chart here, because a variant
 * promoted out of this lab into the kit should need no rewiring, and six labs
 * now spell it this way.
 *
 * WHAT CAME BACK, AND WHY IT IS THE POINT
 *
 * `comparison-lab` deleted `FcEdgeDraw` and said in its own comment that this
 * lab would need it back. **`FcEdgeDraw` is restored here, and the line between
 * the two labs is exactly this primitive.**
 *
 * An A-vs-B figure has a seam and must never have an arrow: an arrow between two
 * options claims one turns into the other, which is false of `docker run` and
 * `docker compose up`. A before-and-after figure has a direction, and the arrow
 * is the contract rather than decoration. If you find yourself wanting one in
 * `comparison-lab`, the figure belongs here.
 *
 * THE CHOREOGRAPHY RULE FOR THIS LAB
 *
 * **Before, then the arrow, then after.** In that order, always, one click each.
 *
 * It is the only ordering the content permits. Landing both states together and
 * then drawing the arrow shows the room the destination before it has understood
 * where it is leaving, and the arrow then explains a change it has already read.
 * Landing after first is simply backwards. The arrow in the middle is not
 * padding: it is the beat where the instructor says "and then we did this", and
 * the figure should be holding still for it.
 *
 * `DeltaRows` has no single arrow, so its rows land one per click, each row
 * carrying its own before, arrow and after together. Same rule at row scale:
 * hard rule 6 wants text and its supporting visual in parallel, and a row's
 * three parts are each other's support.
 *
 * THE TIER
 *
 * Explanatory, from `figureTiming.ts`: entrances 520ms on a 130ms stagger, draws
 * 600ms. Roughly double the `animate` skill's UI numbers, on that skill's own
 * instruction that explanatory motion may run longer.
 *
 * No hover, so no UI-tier exception to the scale. A deck is projected into a
 * room where nobody has a pointer.
 *
 * REDUCED MOTION IS HANDLED HERE, AND THE CSS BLOCK DOES NOT COVER IT
 *
 * `src/index.css` clamps `animation-duration` and `transition-duration`, which
 * is right for CSS. framer-motion animates by writing inline styles frame by
 * frame, so that block does not touch any of this. Every primitive below reads
 * `useReducedMotion()` and mounts at its final state.
 */

/** Delay for the nth beat. Nothing computes its own. */
export const beat = (n: number) => T.lead + n * T.stagger

/**
 * CLICK-GATED BEATS: the figure builds one step per click, in authored order.
 *
 * `useClaimedSteps` registers `count` build steps with the deck's `Stepper` and
 * returns which have been reached, so a part gates on `shown[at]`.
 *
 * It exists because `useReveal()` called in a loop does NOT work: every beat
 * claims the same order, the whole figure appears on the first click, and the
 * slide reports one step, so the arrow key advances to the next slide instead of
 * building this one. `pseudocode-lab` shipped that.
 *
 * A variant must compute `count` from its own props and never from state, and it
 * must claim the hook BEFORE any early return: a hook behind a `ProblemPanel`
 * return appears and disappears with the props.
 */
export function useBeats(count: number): boolean[] {
  /*
    BEAT 0 IS NOT A CLICK. It is the slide's base content, on screen the moment
    the slide arrives, which in this lab is the BEFORE state. That is the right
    thing to give away for free: the room already lives in the before state, so
    opening on it costs nothing and opening on an empty stage looks like a figure
    that failed to render.
  */
  const claimed = useClaimedSteps(Math.max(0, count - 1))
  return [true, ...claimed]
}

/** A panel, a row or a card arriving. */
export function FcNodeIn({
  at,
  shown,
  children,
  className,
  style,
}: {
  at: number
  shown?: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  const stepped = shown !== undefined
  return (
    <motion.div
      /*
        `fc-node-slot` carries a base `z-index: 1` in `index.css`, so a part that
        draws outside its own box is not clipped by the slot next door. EVERY
        `FcNodeIn` IN THIS LAB IS PASSED `relative` OR `absolute` BY ITS CALLER:
        the z-index is ignored on a static element, and `pseudocode-lab` shipped
        without it.

        `h-full` is here because `StateArrow`'s two panels sit in a stretching
        grid. `comparison-lab` recorded what that costs in a flex column, where
        the first `h-full` child silently absorbs the leftover space and the two
        sides stop lining up. Anything stacking these slots passes
        `style={{ height: 'auto' }}`.
      */
      className={`fc-node-slot h-full ${className ?? ''}`}
      style={style}
      initial={reduce ? false : { opacity: 0, transform: 'translateY(10px) scale(0.96)' }}
      animate={
        stepped && !shown
          ? { opacity: 0, transform: 'translateY(10px) scale(0.96)' }
          : { opacity: 1, transform: 'translateY(0px) scale(1)' }
      }
      transition={{ duration: T.enter, delay: stepped ? 0 : beat(at), ease: c4(E.out) }}
    >
      {children}
    </motion.div>
  )
}

/**
 * THE ARROW, DRAWING ITSELF FROM THE BEFORE STATE TOWARD THE AFTER STATE.
 *
 * It draws rather than fades because the direction IS the content, and a fade
 * gives the room an arrow that was always there. A stroke that travels left to
 * right over 600ms is the figure performing the sentence the instructor is
 * saying.
 *
 * `pathLength` rather than a hand-computed `strokeDasharray`: framer-motion
 * normalises it to 0..1 whatever the path's real length is, so the same
 * component draws a 96px connector and a 40px one at the same apparent speed.
 *
 * THE HEAD FOLLOWS THE LINE, AND ITS DELAY IS A FRACTION OF THE DRAW.
 *
 * Derived from `T.draw` rather than written as a number, so the two stay in step
 * if the scale changes. `figureTiming.ts` records that `T.draw` came down from
 * 860ms to 600 when these figures became click-gated: an edge drawing in direct
 * response to a keypress is the `animate` skill's UI case, and 860ms of waiting
 * after a deliberate press reads as lag.
 *
 * `aria-hidden` and no text: the arrow carries direction, and the direction is
 * already stated by the two labels either side of it. An `<svg>` is one
 * rectangle to all three harnesses, so nothing readable may live inside it.
 * Content rule 17.
 */
export function FcEdgeDraw({
  at,
  shown,
  width,
  height = 24,
  paint,
  className = '',
}: {
  at: number
  shown?: boolean
  /** The span the arrow crosses, in px. */
  width: number
  height?: number
  paint: string
  className?: string
}) {
  const reduce = useReducedMotion()
  const stepped = shown !== undefined
  const on = stepped ? shown : true
  const mid = height / 2
  const shaft = width - 12

  return (
    <svg
      aria-hidden
      className={className}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      fill="none"
    >
      <motion.line
        x1={0}
        y1={mid}
        x2={shaft}
        y2={mid}
        stroke={paint}
        strokeWidth={2}
        strokeLinecap="round"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: on ? 1 : 0 }}
        transition={{ duration: T.draw, delay: stepped ? 0 : beat(at), ease: c4(E.inOut) }}
      />
      <motion.path
        d={`M ${shaft - 7} ${mid - 6} L ${shaft + 2} ${mid} L ${shaft - 7} ${mid + 6}`}
        stroke={paint}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={reduce ? false : { opacity: 0 }}
        animate={{ opacity: on ? 1 : 0 }}
        transition={{
          duration: T.label,
          delay: (stepped ? 0 : beat(at)) + T.draw * 0.7,
          ease: c4(E.out),
        }}
      />
    </svg>
  )
}

/**
 * The set's caption, landing after the last part.
 *
 * Same primitive the siblings use, same rule: it arrives after the thing it is
 * about. A caption naming the outcome while only the before state is on screen
 * has given away the change before the room has seen it.
 */
export function FcEdgeLabel({
  at,
  shown,
  children,
  className = '',
  style,
}: {
  at: number
  shown?: boolean
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  const stepped = shown !== undefined
  return (
    <motion.span
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, transform: 'scale(0.92)' }}
      animate={
        stepped && !shown
          ? { opacity: 0, transform: 'scale(0.92)' }
          : { opacity: 1, transform: 'scale(1)' }
      }
      transition={{ duration: T.label, delay: stepped ? 0 : beat(at) + 0.24, ease: c4(E.out) }}
    >
      {children}
    </motion.span>
  )
}
