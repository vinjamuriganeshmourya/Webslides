import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'

import type { Beat } from './walk'

/**
 * EVERY BEAT, ALL THE TIME. The current one is lit, the ones already spent are
 * dimmed, the ones still to come are dimmer still.
 *
 * WHY THIS REPLACED A SINGLE CAPTION
 *
 * A walk figure is an argument about a SEQUENCE, and a frame that shows only
 * the current sentence has thrown the sequence away: the room sees a slideshow
 * of unrelated lines and cannot tell how many are left. The pedagogy team's
 * lesson plan lists all six beats beside the figure and greys them off one at a
 * time, so the shape of the run is on screen before the run starts and the room
 * always knows where it is.
 *
 * That is the structural half of the understanding (`pedagogy-to-components`
 * Part I, question 6b): stepping alone gives procedural understanding, and the
 * visible list is what makes it generalise. Course rule R5b.
 *
 * The caption of the CURRENT beat is shown in full under its label; the others
 * are labels only, so the list stays readable at the back of a room.
 */
export function BeatList({
  beats,
  at,
  className = '',
}: {
  beats: Beat[]
  /** Index of the current beat; -1 before the first. */
  at: number
  className?: string
}) {
  const instant = useInstant()
  return (
    <ol className={`flex flex-col gap-1.5 ${className}`}>
      {beats.map((b, i) => {
        const state = i < at ? 'spent' : i === at ? 'now' : 'ahead'
        return (
          <li key={b.label ?? i}>
            <motion.div
              initial={instant ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: state === 'ahead' ? 0.38 : state === 'spent' ? 0.55 : 1, x: 0 }}
              transition={{ duration: T.enter, ease: c4(E.out) }}
              /* EVERY BEAT IS A ROW WITH A BODY, not a dot and a line floating
                 in a column. Beside a 238px phone the beats had 600px of space
                 and used a third of it, so the right half of the frame read as
                 empty. A tinted row the width of its column is the cheapest
                 thing that gives the list weight without inventing content. */
              className="flex items-start gap-2.5 rounded-card border px-3.5 py-2"
              style={{
                borderColor: state === 'now' ? colors.brand : colors.line,
                background: state === 'now' ? `${colors.brand}0F` : colors.white,
              }}
            >
              <span
                className="mt-[6px] h-[8px] w-[8px] shrink-0 rounded-full"
                style={{
                  background: state === 'now' ? colors.brand : colors.line,
                  boxShadow: state === 'now' ? `0 0 0 4px ${colors.brand}22` : undefined,
                }}
              />
              <span className="min-w-0">
                <span
                  className="block font-heading text-body leading-snug"
                  style={{
                    color: state === 'now' ? colors.ink : colors.body,
                    fontWeight: state === 'now' ? 700 : 500,
                  }}
                >
                  {b.label}
                </span>
                {state === 'now' && b.caption && (
                  <motion.span
                    key={at}
                    className="mt-0.5 block text-body-sm leading-snug"
                    style={{ color: colors.body }}
                    initial={instant ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: T.enter, ease: c4(E.out) }}
                  >
                    {b.caption}
                  </motion.span>
                )}
              </span>
            </motion.div>
          </li>
        )
      })}
    </ol>
  )
}
