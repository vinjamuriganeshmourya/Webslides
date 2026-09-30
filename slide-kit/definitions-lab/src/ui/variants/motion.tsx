import type { CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { useClaimedSteps } from '@/motion/Stepper'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * SHARED MOTION FOR EVERY VARIANT IN THIS LAB.
 *
 * Trimmed from `points-lab/src/ui/variants/motion.tsx`, which was itself lifted
 * from `flowchart-lab`. The names are kept EXACTLY as the siblings have them
 * (`beat`, `useBeats`, `FcNodeIn`, `FcEdgeLabel`) even though `Fc` stands for
 * flow chart and there are no flow charts here, because a variant promoted out
 * of this lab into the kit should need no rewiring, and four labs already spell
 * it this way.
 *
 * WHAT IS NOT HERE, AND WHY
 *
 * `FcEdgeDraw`, `FcArrowDefs` and `perSegment` are gone. They draw connectors,
 * arrowheads and multi-keyframe travel, and a definition card has no path
 * between anything: it is a set of boxes, not a sequence with a route through
 * it. Copying them in "for consistency" is how a lab's shared module becomes
 * the union of every lab's needs.
 *
 * THE CHOREOGRAPHY RULE FOR THIS LAB
 *
 * A definition set is a SET, not a sequence, so there is no path to assemble
 * along. What there is instead is an order the instructor says the words in, and
 * that is the only ordering these variants claim: cards land in authored order,
 * one per click, and the `new` term is not promoted to first because the author
 * already decided the order by writing it.
 *
 * One card per click, and not all at once, for the reason the sibling labs give:
 * landing three definitions together hands the room three new words to read
 * while the presenter is still saying the first one. A definition is the one kind
 * of content where reading ahead is actively harmful, because the room cannot
 * check a definition against anything it already knows.
 *
 * THE TIER
 *
 * Explanatory, from `figureTiming.ts`: entrances 520ms on a 130ms stagger.
 * Roughly double the `animate` skill's UI numbers, on that skill's own
 * instruction that explanatory motion may run longer. Nobody triggers a slide
 * figure and nobody repeats it; it is read once from the back of a room while
 * someone talks over it.
 *
 * There is no UI-tier exception in this lab. The siblings each have one, a 0.18s
 * literal for the hover popover, and this lab has no hover at all: see the note
 * in `definitionChrome.tsx`.
 *
 * REDUCED MOTION IS HANDLED HERE, AND THE CSS BLOCK DOES NOT COVER IT
 *
 * `src/index.css` clamps `animation-duration` and `transition-duration`, which
 * is the right thing for CSS. framer-motion animates by writing inline styles
 * frame by frame, so that block does not touch any of this. Both primitives
 * below read `useReducedMotion()` and mount at their final state, keeping the
 * figure legible while removing the movement.
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
 * A variant must compute `count` from its own `terms` and never from state, so
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

    It is the slide's base content, on screen the moment the slide arrives, which
    here is the first card. Claiming it would open the slide on an empty stage
    that looks like a figure which failed to render, and would spend a click on
    the one card that needs no introduction.
  */
  const claimed = useClaimedSteps(Math.max(0, count - 1))
  return [true, ...claimed]
}

/**
 * A card arriving.
 *
 * `scale(0.96)` and not `scale(0)`: nothing in the real world appears out of
 * nothing, and a card popping from zero reads as a notification rather than as a
 * word being introduced. Rises 10px, so the motion has a direction.
 *
 * `h-full` is on the motion element itself, which matters more here than in the
 * sibling labs: those position their nodes absolutely on a computed stage, and
 * these sit in a CSS grid whose rows stretch. Without it the wrapper collapses
 * to its content and the equal-height row this lab depends on silently stops
 * being equal. See the height note in `definitionFigure.ts`.
 */
export function FcNodeIn({
  at,
  shown,
  children,
  className,
  style,
}: {
  /** Which beat this card lands on: a click index when `shown` is passed. */
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
        `fc-node-slot` carries a base `z-index: 1` in `index.css`, so a card that
        draws anything outside its own box is not clipped by the slot next door.
        The sibling labs also used it to raise a hovered slot to 60; this lab has
        no hover, so only the base rule applies.
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
 * The set's caption, landing after the last card.
 *
 * Same primitive the siblings use for an edge label, and the same rule: it
 * arrives after the thing it is about. A caption that says "three words that get
 * confused" while only the first card is on screen has told the room the shape
 * of the slide before it has met any of the words.
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
