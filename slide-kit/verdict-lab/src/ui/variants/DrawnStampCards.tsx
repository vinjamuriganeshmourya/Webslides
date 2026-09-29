import { motion } from 'framer-motion'
import { Step } from '@/motion/Stepper'
import { Reveal, RevealGroup } from '@/motion/Reveal'
import { useInstant } from '@/motion/instant'
import { colors, easing } from '@/design/tokens'
import { SHAPE_CLIP, VERDICT, type Verdict, type VerdictFigureProps } from './contract'

/**
 * VARIANT 6 — DRAWN STAMP CARDS. The glyph draws itself.
 *
 * `StampCards` with one thing added: the mark inside each silhouette is an
 * inline path that strokes on from nothing, and the silhouette springs to size
 * underneath it. A tick is drawn in the direction a person draws a tick, a cross
 * is drawn as two strokes, and the warning bar drops in before its dot.
 *
 * WHY MOTION IS NOT DECORATION HERE
 *
 * A verdict is the one thing on a row a learner must not misread, and a drawn
 * mark holds the eye on it for the second it takes to complete. That is the same
 * second an instructor spends saying the word out loud, so the motion is
 * carrying the instructor's own beat rather than competing with it. It also
 * makes the rows arrive as a sequence of judgements rather than as a block of
 * four, which is what the room is being asked to follow.
 *
 * WHAT IT IS NOT ALLOWED TO DO: nothing moves after it has arrived. There is no
 * loop, no pulse and no hover. A figure that keeps moving while an instructor
 * talks over it is a figure the room watches instead of listening.
 *
 * TIMING IS AT THIS REPO'S EXPLANATORY TIER, not the UI tier the animation
 * skills specify. A slide figure is read once, from the back of a room, by
 * somebody who did not trigger it: entrance 520ms, stagger 130ms, the stroke
 * 620ms. Session 6's figures were first built at UI speed and were rejected as
 * too fast.
 *
 * `useInstant()` IS READ, and when it is true every mark mounts finished. A
 * Ctrl+arrow jump must land on a still slide, and a hand-animated figure that
 * ignores this is the only thing moving on it.
 *
 * BEST AT: the four-row set a concept turns on, where the room is being asked to
 * weigh each judgement rather than skim the list.
 *
 * WORST AT: a slide the instructor intends to pass over quickly, and any slide
 * where this figure is not the main event. It costs about 1.2s to arrive fully.
 */

/** The mark inside each silhouette, as a path that can be stroked on. */
const MARK: Record<Verdict, { d: string; second?: string }> = {
  success: { d: 'M5 12.5 10 17.5 19 7' },
  error: { d: 'M6 6 18 18', second: 'M18 6 6 18' },
  warning: { d: 'M12 8.5 12 13.5', second: 'M12 17 12 17.2' },
  info: { d: 'M12 11 12 17', second: 'M12 7 12 7.2' },
}

const STROKE = 0.62
const SPRING = { type: 'spring', stiffness: 260, damping: 18, mass: 0.7 } as const

export function DrawnStampCards({ items, immediate = false, className = '' }: VerdictFigureProps) {
  const instant = useInstant()
  const Row = immediate ? Reveal : Step
  const Wrapper = immediate ? RevealGroup : 'div'
  return (
    <Wrapper
      {...(immediate ? ({ stagger: 0.13 } as const) : {})}
      className={`space-y-3 ${className}`}
    >
      {items.map((item, i) => {
        const v = VERDICT[item.verdict]
        const mark = MARK[item.verdict]
        const clip = SHAPE_CLIP[v.shape]
        /* Each row's mark waits for its own row to have arrived. With `immediate`
           the rows stagger, so the delay tracks the stagger; click-gated, each
           row arrives alone and the delay is the row's own entrance. */
        const delay = instant ? 0 : (immediate ? i * 0.13 : 0) + 0.18
        return (
          <Row
            key={i}
            dir="up"
            className="flex items-center gap-5 rounded-card bg-white px-5 py-4 shadow-card-soft ring-1 ring-line"
          >
            <motion.span
              className={`grid h-12 w-12 shrink-0 place-items-center text-white ${v.solid} ${
                v.shape === 'circle' ? 'rounded-full' : v.shape === 'square' ? 'rounded-lg' : ''
              }`}
              style={clip ? { clipPath: clip } : undefined}
              /* Never from scale 0: a shape that grows from nothing reads as an
                 object appearing, not as a stamp landing. */
              initial={instant ? false : { scale: 0.72, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={instant ? { duration: 0 } : { ...SPRING, delay }}
            >
              <motion.svg
                width={22} height={22} viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth={2.4}
                strokeLinecap="round" strokeLinejoin="round"
                aria-hidden
                className={v.shape === 'triangle' ? 'mt-2' : undefined}
              >
                <motion.path
                  d={mark.d}
                  initial={instant ? false : { pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={
                    instant ? { duration: 0 } : { duration: STROKE, ease: easing.soft, delay: delay + 0.1 }
                  }
                />
                {mark.second && (
                  <motion.path
                    d={mark.second}
                    initial={instant ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={
                      instant
                        ? { duration: 0 }
                        : { duration: STROKE * 0.7, ease: easing.soft, delay: delay + 0.1 + STROKE * 0.55 }
                    }
                  />
                )}
              </motion.svg>
            </motion.span>

            <span className="min-w-0 flex-1">
              <span className="block text-body-lg font-medium text-ink">{item.claim}</span>
              {item.reason && (
                <span className="mt-0.5 block text-body-sm" style={{ color: colors.body }}>
                  {item.reason}
                </span>
              )}
            </span>

            {/* The word arrives last, after the mark has finished drawing: the
                room sees the judgement, then reads its name. */}
            <motion.span
              className={`shrink-0 rounded-pill px-3 py-1 text-[13px] font-bold uppercase tracking-wide text-white ${v.solid}`}
              initial={instant ? false : { opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={
                instant ? { duration: 0 } : { duration: 0.34, ease: easing.soft, delay: delay + 0.52 }
              }
            >
              {item.label ?? v.word}
            </motion.span>
          </Row>
        )
      })}
    </Wrapper>
  )
}
