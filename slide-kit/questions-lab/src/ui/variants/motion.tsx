import type { CSSProperties, ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * SHARED MOTION FOR EVERY VARIANT IN THIS LAB.
 *
 * Trimmed from `definitions-lab/src/ui/variants/motion.tsx`, which came from
 * `points-lab`, which came from `flowchart-lab`. `beat` keeps its name, and the
 * entry primitive keeps the siblings' shape, so a variant promoted out of this
 * lab into the kit needs no rewiring.
 *
 * THE ONE LAB IN THE FAMILY WITH NO BUILD STEPS, AND THAT IS A FINDING
 *
 * Every sibling gates its figure on clicks. `points-lab` lands one point per
 * click because landing four together hands the room four claims to read while
 * the presenter is still on the first. `definitions-lab` lands one card per click
 * for a stronger version of the same reason: a definition cannot be checked
 * against anything the room already knows, so reading ahead is actively harmful.
 *
 * Neither argument survives contact with a question frame, and the reason is
 * worth keeping, because "click-gate it, the siblings do" is the obvious thing to
 * copy and it is wrong here.
 *
 * A question frame has three parts at most: the question, the constraint it has
 * to be answered under, and the artefact it is about. **There is no part of it
 * the room may be allowed to start without.** A question revealed before its
 * qualifier is a DIFFERENT question, and the room has begun answering it. A
 * question revealed before the code it is about is not a question at all. Hold
 * back either one and the room's first guess is against content the frame has
 * since changed, which is worse than showing everything, because now the
 * instructor has to talk them out of an answer the slide caused.
 *
 * So everything on a question frame arrives on entry, staggered only enough to
 * give the eye an order to read in, and the frame then claims ZERO build steps.
 * The next arrow press leaves for the answer, which is the next slide, which is
 * hard content rule 16's own mechanism.
 *
 * The knock-on is that this lab needs none of the click machinery: no
 * `useClaimedSteps`, no `useBeats`, no stable-count rule, no hook-before-early-
 * return rule. `beat()` is a delay again, the way it was in the first sibling lab
 * before any of them were stepped.
 *
 * THE TIER
 *
 * Explanatory, from `figureTiming.ts`: 520ms entrances on a 130ms stagger,
 * roughly double the `animate` skill's UI numbers, on that skill's own note that
 * explanatory motion may run longer. Nobody triggers a slide figure and nobody
 * repeats it.
 *
 * ONE DELIBERATE EXCEPTION, AND IT IS THE MARK. See `MarkIn`.
 *
 * REDUCED MOTION IS HANDLED HERE, AND THE CSS BLOCK DOES NOT COVER IT
 *
 * `src/index.css` clamps `animation-duration` and `transition-duration`, which is
 * right for CSS. framer-motion animates by writing inline styles frame by frame,
 * so that block does not touch any of this. Every primitive below reads
 * `useReducedMotion()` and mounts at its final state.
 */

/** Delay for the nth beat. Nothing in this lab computes its own. */
export const beat = (n: number) => T.lead + n * T.stagger

/**
 * A part of the frame arriving.
 *
 * Rises 12px and fades. No scale, which is the one place this departs from
 * `FcNodeIn` next door, and it is deliberate: a card scaling up from 0.96 reads
 * as an object being placed, which is right for a card. The question is not an
 * object, it is a sentence, and a sentence that scales reads as a notification
 * popping. At 46px the scale is also simply visible as a wobble in a way it never
 * is at 22px.
 */
export function AskIn({
  at,
  children,
  className,
  style,
}: {
  at: number
  children: ReactNode
  className?: string
  style?: CSSProperties
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, transform: 'translateY(12px)' }}
      animate={{ opacity: 1, transform: 'translateY(0px)' }}
      transition={{ duration: T.enter, delay: beat(at), ease: c4(E.out) }}
    >
      {children}
    </motion.div>
  )
}

/**
 * THE MARK ARRIVING, AND THE ONE TIMING EXCEPTION IN THE LAB.
 *
 * It runs at `T.travel` (780ms) rather than `T.enter` (520ms), and it starts
 * BEFORE everything else rather than after, at a negative offset from beat 0.
 *
 * Both are the same argument. The mark is ground, not content: it is the room
 * noticing that the frame has changed colour or shape, which has to happen before
 * they start reading, or the reading is interrupted by something large moving
 * behind it. A 520ms entrance on a 340px glyph is also simply too quick for
 * something that size; at that duration a shape covering a third of the canvas
 * arrives with a snap, and the room's eye goes to it instead of to the question,
 * which is the exact opposite of what a watermark is for.
 *
 * It scales from 0.92 where `AskIn` has no scale at all, for the same reason
 * reversed: a mark IS an object, and it is the only thing on these frames that
 * can afford to behave like one.
 */
export function MarkIn({
  children,
  className,
  style,
  from = 0.92,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  from?: number
}) {
  const reduce = useReducedMotion()
  return (
    <motion.div
      className={className}
      style={style}
      initial={reduce ? false : { opacity: 0, transform: `scale(${from})` }}
      animate={{ opacity: 1, transform: 'scale(1)' }}
      transition={{ duration: T.travel, delay: 0, ease: c4(E.out) }}
    >
      {children}
    </motion.div>
  )
}

/**
 * THERE IS NO DRAW PRIMITIVE IN THIS LAB, AND THAT IS A DECISION.
 *
 * Every sibling has one: `FcEdgeDraw` traces a connector, and `beforeafter-lab`
 * exists partly because it needed that primitive back after `comparison-lab`
 * deleted it. A drawn line is the right tool when there is a PATH, because the
 * direction it travels in is the content.
 *
 * A question frame has no path. The only line on any of these four is the short
 * rule under the question that separates the ask from its constraint, and a
 * separator that draws itself left to right is claiming a direction it does not
 * have: it says "and then", which is precisely the compound reading hard rule 16
 * exists to prevent. So the rule arrives with the constraint it belongs to, as
 * one thing, and `Qualifier` in `askChrome.tsx` keeps them inseparable.
 */
