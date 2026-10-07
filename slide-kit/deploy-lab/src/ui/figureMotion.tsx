import { motion, useReducedMotion } from 'framer-motion'
import type { CSSProperties, ReactNode } from 'react'
import { useInstant } from '@/motion/instant'
import { T, E, c4 } from './figureTiming'

/**
 * figureMotion — the three moves every session 9 figure is built from.
 *
 * `CloudPicture`, `RegionMap` and `ShareBar` each carry a private copy of these
 * helpers. The nine figures that followed them (`Meter`, `PlaceLadder`,
 * `ServiceField`, `SizeChart`, `LockAndKey`, `OwnVsRented`, `TwoDoors`,
 * `MachineCard`) share this one file instead, so a change to how a block
 * arrives is made once.
 *
 *   Rise   a DOM block arriving: opacity 0 to 1, translateY 10px to 0, scale
 *          0.97 to 1, over `T.enter`. Never from scale 0.
 *   FadeG  an SVG group fading up in place.
 *   drawAnim  props for an SVG shape tracing itself with `pathLength`.
 *
 * Every helper reads `useFigureAnim()`: under `useInstant()` it mounts at rest,
 * and under reduced motion it keeps the fades and drops the travel.
 */

export type FigureAnim = { instant: boolean; reduce: boolean }

export const useFigureAnim = (): FigureAnim => ({ instant: useInstant(), reduce: !!useReducedMotion() })

/** Beat `k` of a stagger, in seconds. */
export const at = (k: number) => T.lead + k * T.stagger

export const ease = c4(E.out)

export function Rise({
  a, x, y, w, delay, children, className = '', dx = 0, dy = 10, duration = T.enter,
}: {
  a: FigureAnim
  x: number
  y: number
  w: number
  delay: number
  children: ReactNode
  className?: string
  /** Direction of travel, in px. Defaults to rising 10px. */
  dx?: number
  dy?: number
  duration?: number
}) {
  const rest = 'translate(0px, 0px) scale(1)'
  if (a.instant) {
    return (
      <div className={`absolute ${className}`} style={{ left: x, top: y, width: w }}>
        {children}
      </div>
    )
  }
  const from = a.reduce ? rest : `translate(${dx}px, ${dy}px) scale(0.97)`
  return (
    <motion.div
      className={`absolute ${className}`}
      style={{ left: x, top: y, width: w }}
      initial={{ opacity: 0, transform: from }}
      animate={{ opacity: 1, transform: rest }}
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.div>
  )
}

export function FadeG({
  a, delay, children, duration = T.enter, to = 1,
}: { a: FigureAnim; delay: number; children: ReactNode; duration?: number; to?: number }) {
  return (
    <motion.g
      initial={a.instant ? false : { opacity: 0 }}
      animate={{ opacity: to }}
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.g>
  )
}

/**
 * Props for an SVG shape tracing itself. Spread onto `motion.line`,
 * `motion.path` or `motion.rect` DIRECTLY: `pathLength` has to land on the
 * shape, because a `<g>` has no length to normalise against.
 */
export const drawAnim = (a: FigureAnim, delay: number, duration: number = T.draw) => ({
  initial: a.instant ? false : { pathLength: 0, opacity: 0 },
  animate: { pathLength: 1, opacity: 1 },
  transition: {
    pathLength: { duration, delay, ease },
    opacity: { duration: 0.01, delay },
  },
})

/** A DOM element fading up in place, for labels and chips. */
export function FadeIn({
  a, delay, children, className = '', style, duration = T.label,
}: { a: FigureAnim; delay: number; children: ReactNode; className?: string; style?: CSSProperties; duration?: number }) {
  return (
    <motion.div
      className={className}
      style={style}
      initial={a.instant ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay, ease }}
    >
      {children}
    </motion.div>
  )
}
