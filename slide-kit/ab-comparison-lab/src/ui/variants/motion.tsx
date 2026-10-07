import type { CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useClaimedSteps } from '@/motion/Stepper'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * SHARED MOTION FOR EVERY VARIANT IN THIS LAB.
 *
 * Copied from `definitions-lab/src/ui/variants/motion.tsx`, which was trimmed
 * from `points-lab`, which took it from `flowchart-lab`. The names are kept
 * EXACTLY as the siblings have them (`beat`, `useBeats`, `FcNodeIn`,
 * `FcEdgeLabel`) even though `Fc` stands for flow chart and there is no flow
 * chart here, because a variant promoted out of this lab into the kit should
 * need no rewiring, and five labs already spell it this way.
 *
 * WHAT IS NOT HERE, AND WHY
 *
 * `FcEdgeDraw`, `FcArrowDefs` and `perSegment` are gone, same as next door. They
 * draw connectors, arrowheads and multi-keyframe travel, and an A-vs-B figure
 * has no route through it: it is two columns of answers to the same questions,
 * not a sequence with a path.
 *
 * **`beforeafter-lab` will need them back**, and that is the line between the two
 * labs rather than an oversight here. A before/after figure has a direction and
 * therefore an arrow; a comparison has a seam and must not have one, because an
 * arrow between two options claims one turns into the other.
 *
 * THE CHOREOGRAPHY RULE FOR THIS LAB
 *
 * A comparison is a set of QUESTIONS, and the unit that lands is the row, not
 * the column. Both answers to one question arrive together, on one click, and
 * that is the whole choreography.
 *
 * It is not a free choice. Landing column A and then column B would show the
 * room every one of A's answers before it had seen any of B's, which is exactly
 * the "hold one list in memory while you scan the other" failure the contract
 * exists to prevent, reintroduced in time instead of in space. Hard rule 6 says
 * text and its supporting visual reveal together; here the two halves of a row
 * are each other's support.
 *
 * One row per click rather than all at once, for the reason the sibling labs
 * give: a whole comparison landing at once hands the room six rows to read while
 * the presenter is still on the first.
 *
 * THE TIER
 *
 * Explanatory, from `figureTiming.ts`: entrances 520ms on a 130ms stagger.
 * Roughly double the `animate` skill's UI numbers, on that skill's own
 * instruction that explanatory motion may run longer. Nobody triggers a slide
 * figure and nobody repeats it; it is read once from the back of a room while
 * someone talks over it.
 *
 * No hover, and so no UI-tier exception to the scale. Same reason as next door:
 * a deck is projected into a room where nobody has a pointer, so every cell
 * carries what it has to say on its face.
 *
 * REDUCED MOTION IS HANDLED HERE, AND THE CSS BLOCK DOES NOT COVER IT
 *
 * `src/index.css` clamps `animation-duration` and `transition-duration`, which
 * is right for CSS. framer-motion animates by writing inline styles frame by
 * frame, so that block does not touch any of this. Both primitives below read
 * `useReducedMotion()` and mount at their final state, keeping the figure
 * legible while removing the movement.
 */

/** Delay for the nth beat. Nothing computes its own. */
export const beat = (n: number) => T.lead + n * T.stagger

/**
 * CLICK-GATED BEATS: the figure builds one step per click, in authored order.
 *
 * `useClaimedSteps` registers `count` build steps with the deck's `Stepper` and
 * returns which have been reached, so a part gates on `shown[at]` and the same
 * `at` that would have been a delay is now a click index.
 *
 * It exists because `useReveal()` called in a loop does NOT work: every beat
 * claims the same order, the whole figure appears on the first click, and the
 * slide reports one step, so the arrow key advances to the next slide instead of
 * building this one. `pseudocode-lab` shipped that.
 *
 * A variant must compute `count` from its own `rows` and never from state, so
 * the number of registered steps is stable while the slide is up, and it must
 * claim the hook BEFORE any early return: a hook behind a `ProblemPanel` return
 * appears and disappears with the props.
 *
 * Under `?all` every claimed step reads true, so all three harnesses measure the
 * finished figure.
 */
export function useBeats(count: number): boolean[] {
  /*
    BEAT 0 IS NOT A CLICK.

    It is the slide's base content, on screen the moment the slide arrives. In
    this lab that is the two side headers, so the slide opens having said what is
    being compared and then builds the rows. Claiming it would open on an empty
    stage that looks like a figure which failed to render, and would spend a
    click on the one part that needs no introduction.
  */
  const claimed = useClaimedSteps(Math.max(0, count - 1))
  return [true, ...claimed]
}

/**
 * A card, a header or a row arriving.
 *
 * `scale(0.96)` and not `scale(0)`: nothing in the real world appears out of
 * nothing, and a box popping from zero reads as a notification rather than as a
 * claim being made. Rises 10px, so the motion has a direction.
 *
 * `h-full` is on the motion element itself, which matters more here than in the
 * labs that position nodes absolutely on a computed stage: these sit in a CSS
 * grid whose rows stretch, and without it the wrapper collapses to its content
 * and the equal-height row silently stops being equal. See the height note in
 * `comparisonFigure.ts`.
 */
export function FcNodeIn({
  at,
  shown,
  children,
  className,
  style,
}: {
  /** Which beat this part lands on: a click index when `shown` is passed. */
  at: number
  /**
   * Click-gated mode. `undefined` keeps the auto-play behaviour, where the part
   * animates on entry after `beat(at)`. A boolean makes it a build step: it
   * holds hidden until the deck reaches its beat, then animates with no delay,
   * because the click IS the timing.
   */
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
        draws anything outside its own box is not clipped by the slot next door.
        The sibling labs also used it to raise a hovered slot to 60; this lab has
        no hover, so only the base rule applies.

        EVERY `FcNodeIn` IN THIS LAB IS PASSED `relative` OR `absolute` BY ITS
        CALLER. `.fc-node-slot`'s `z-index` is ignored on a statically positioned
        element, and `pseudocode-lab` shipped without it.
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
 * The set's caption, landing after the last row.
 *
 * Same primitive the siblings use for an edge label, and the same rule: it
 * arrives after the thing it is about. A caption that names the conclusion while
 * only the first row is on screen has given away the argument before the room
 * has seen the evidence.
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
