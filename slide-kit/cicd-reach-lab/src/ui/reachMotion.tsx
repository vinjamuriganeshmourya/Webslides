import type { CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * THE ONE THING EVERY CANDIDATE IN THIS LAB HAS TO ANIMATE, AND IT IS NOT AN
 * ENTRANCE.
 *
 * `FcNodeIn` in `@/ui/figures/motion` covers a card ARRIVING, and the pills and
 * badges here use it unchanged. A span does not arrive: it EXTENDS, from the
 * start of the chain to wherever this term's automation stops, and the
 * extending is the claim. A bar that fades in at full length has already told
 * the room the answer before it has watched the reach happen, which is the same
 * fault `FcEdgeLabel`'s header records about a "Yes" landing with its own line.
 *
 * So `GrowRight` animates `scaleX` from a left origin. `scaleX` and not `width`
 * because width is a layout property and this runs on every span of every
 * candidate on one frame; transform is the compositor's, per
 * `fixing-motion-performance`.
 *
 * TEMPO: `T.drawStep` (600ms), which is the CLICK-GATED draw tier, not the
 * 860ms auto-play one. These are build steps a presenter presses and waits on.
 * `linear`, for `FcEdgeDraw`'s own stated reason: an eased extension arrives at
 * its stop already slowing down, which reads as the automation running out of
 * energy rather than as reaching a boundary.
 */
export function GrowRight({
  shown,
  children,
  className,
  style,
  duration = T.drawStep,
}: {
  shown: boolean
  children?: ReactNode
  className?: string
  style?: CSSProperties
  duration?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={{ ...style, transformOrigin: 'left center' }}
      initial={reduce ? false : { scaleX: 0, opacity: 0 }}
      animate={shown ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
      transition={{
        duration,
        ease: 'linear',
        opacity: { duration: T.label, ease: c4(E.out) },
      }}
    >
      {children}
    </motion.div>
  )
}

/**
 * The same for a vertical arm or leader, growing DOWNWARD from the rail or the
 * chain it hangs off. Top origin, because that is the end that is anchored.
 */
export function GrowDown({
  shown,
  className,
  style,
  delay = 0,
  duration = T.drawStep * 0.6,
}: {
  shown: boolean
  className?: string
  style?: CSSProperties
  delay?: number
  duration?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={{ ...style, transformOrigin: 'center top' }}
      initial={reduce ? false : { scaleY: 0, opacity: 0 }}
      animate={shown ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
      transition={{
        duration,
        delay: shown ? delay : 0,
        ease: 'linear',
        opacity: { duration: T.label, delay: shown ? delay : 0, ease: c4(E.out) },
      }}
    />
  )
}
