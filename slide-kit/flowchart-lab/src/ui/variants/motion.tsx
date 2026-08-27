import type { CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * SHARED MOTION FOR EVERY FLOW-CHART VARIANT.
 *
 * THE CHOREOGRAPHY RULE, WHICH IS THE WHOLE POINT
 *
 * A flow chart's content IS its order, so the figure assembles **along the
 * path**: a node arrives, the edge leaving it draws, the next node arrives. It
 * never fades in as a finished picture, and it never staggers by source order,
 * because either one throws away the one thing the figure is for.
 *
 * At the fork, the exits are deliberately not simultaneous:
 *
 *   1. the happy path draws first, at full weight
 *   2. the exception branch draws next, quieter
 *   3. the loop back draws last
 *
 * That ordering is the established practice ("the main process flow should be
 * visually dominant, with alternative outcomes easy to compare") expressed in
 * time rather than only in colour. The room follows the straight-through story
 * once, then sees what happens when it fails.
 *
 * `beat()` turns a step index into a delay so a variant never writes its own
 * arithmetic and all six keep one tempo.
 *
 * THE TIER
 *
 * Explanatory, from `figureTiming.ts`: entrances 520ms, staggers 130ms, draws
 * 860ms, whole figure assembled in about 2.4s. These are roughly double the
 * `animate` skill's UI numbers, on that skill's own instruction that explanatory
 * motion can run longer. Nobody triggers a slide figure and nobody repeats it;
 * it is read once from the back of a room while someone talks over it.
 *
 * REDUCED MOTION IS HANDLED HERE, AND THE CSS BLOCK DOES NOT COVER IT
 *
 * `src/index.css` clamps `animation-duration` and `transition-duration`, which
 * is the right thing for CSS. framer-motion animates by writing inline styles
 * frame by frame, so that block does not touch any of this. Every primitive
 * below reads `useReducedMotion()` and mounts at its final state, keeping the
 * figure legible while removing the movement.
 */

/** Delay for the nth beat along the path. Nothing computes its own. */
export const beat = (n: number) => T.lead + n * T.stagger

/**
 * A node arriving.
 *
 * `scale(0.96)` and not `scale(0)`: nothing in the real world appears out of
 * nothing, and a node popping from zero reads as a notification rather than as a
 * step in a process. Rises 10px, so the motion has a direction that agrees with
 * the path being drawn.
 */
export function FcNodeIn({
  at,
  children,
  className,
  style,
}: {
  /** Which beat this node lands on. */
  at: number
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      /*
        `fc-node-slot` is what lets a hover popover paint above its neighbours.

        This element animates `transform`, and a transformed element CREATES A
        STACKING CONTEXT. So a `z-index` on the popover inside it only competes
        with that node's own children: every slot rendered later in the DOM paints
        on top of it regardless, and the detail panel came out sliced by the next
        two cards along.

        The fix has to raise the SLOT, not the popover, and `index.css` does it
        with `:has()` so no state has to be threaded from `NodeShell` back up to
        here.
      */
      className={`fc-node-slot ${className ?? ''}`}
      style={style}
      initial={reduce ? false : { opacity: 0, transform: 'translateY(10px) scale(0.96)' }}
      animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
      transition={{ duration: T.enter, delay: beat(at), ease: c4(E.out) }}
    >
      {children}
    </motion.div>
  )
}

/**
 * An edge drawing itself.
 *
 * `pathLength` is framer's handle on `stroke-dasharray` / `stroke-dashoffset`,
 * which is the canonical line-draw: set the dash to the path's own length and
 * animate the offset from hidden to shown. It is the right primitive here
 * because the drawing IS the explanation, unlike a fade, which would just make
 * a finished line appear.
 *
 * `linear` rather than the house ease-out, and this is the one deliberate
 * departure in the file. An eased draw arrives at the arrowhead already slowing
 * down, which reads as the line running out of energy before it connects. A
 * constant-speed draw reads as something travelling, which is what an edge in a
 * process diagram means. The `animate` skill lists `linear` for exactly this:
 * constant motion rather than an entrance.
 */
export function FcEdgeDraw({
  d,
  at,
  stroke,
  width = 2,
  dashed = false,
  markerEnd,
  duration = T.draw,
}: {
  d: string
  at: number
  stroke: string
  width?: number
  dashed?: boolean
  markerEnd?: string
  duration?: number
}) {
  const reduce = useReducedMotion()
  return (
    <>
      <motion.path
        d={d}
        fill="none"
        stroke={stroke}
        strokeWidth={width}
        strokeLinecap="round"
        strokeLinejoin="round"
        /* A dashed edge cannot also be drawn by pathLength: both want the dash
           array. The dashed exception paths therefore fade instead, which is the
           honest trade and part of why they read as subordinate. */
        strokeDasharray={dashed ? '7 7' : undefined}
        initial={reduce ? false : dashed ? { opacity: 0 } : { pathLength: 0, opacity: 0 }}
        animate={dashed ? { opacity: 1 } : { pathLength: 1, opacity: 1 }}
        transition={{
          duration: dashed ? T.label : duration,
          delay: beat(at),
          ease: dashed ? c4(E.out) : 'linear',
          opacity: { duration: T.label, delay: beat(at), ease: c4(E.out) },
        }}
      />
      {/*
        THE ARROWHEAD IS A SECOND PATH, AND IT ARRIVES WHEN THE LINE DOES.

        An SVG marker is painted at the path's end VERTEX, and `pathLength` does
        not move that vertex: it only changes how much of the stroke is dashed
        in. So a marker on the drawing path itself pops up at its final position
        immediately, and the figure shows an arrowhead floating in empty space
        with no line reaching it yet. That was visible on every edge at 700ms.

        This path is identical but stroked transparent, so it contributes nothing
        but its marker, and it fades in once the draw has actually finished.
        `stroke` must stay a real paint value rather than `none`, because a path
        with no stroke is not stroked and therefore renders no markers at all.
      */}
      {markerEnd && (
        <motion.path
          d={d}
          fill="none"
          stroke="transparent"
          strokeWidth={width}
          markerEnd={markerEnd}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: T.label,
            delay: beat(at) + (dashed ? T.label : duration) * 0.82,
            ease: c4(E.out),
          }}
        />
      )}
    </>
  )
}

/**
 * An edge's condition label, and the arrival of the arrowhead it belongs to.
 *
 * Lands AFTER its edge has finished drawing, never with it. A "Yes" that is
 * already on screen while the line is still travelling towards it tells the room
 * the answer before it has watched the question being asked.
 *
 * DOM, not `<text>`. Content rule 17: an `<svg>` is one rectangle to every
 * harness in this repo, so two `<text>` labels can overlap and pass all three
 * sweeps. Session 4 shipped that twice.
 */
export function FcEdgeLabel({
  at,
  children,
  className = '',
  style,
}: {
  at: number
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  return (
    <motion.span
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, transform: 'scale(0.92)' }}
      animate={{ opacity: 1, transform: 'scale(1)' }}
      transition={{ duration: T.label, delay: beat(at) + 0.24, ease: c4(E.out) }}
    >
      {children}
    </motion.span>
  )
}

/**
 * The arrowhead marker set, defined once per figure.
 *
 * Markers cannot inherit `currentColor` through a `<use>` in every engine, so
 * each colour gets its own marker id, namespaced per figure to stop two figures
 * on one slide colliding in the document-wide id space.
 */
export function FcArrowDefs({ id, colors }: { id: string; colors: Record<string, string> }) {
  return (
    <defs>
      {Object.entries(colors).map(([key, color]) => (
        <marker
          key={key}
          id={`${id}-${key}`}
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill={color} />
        </marker>
      ))}
    </defs>
  )
}
