import { motion } from 'framer-motion'
import type { ReactNode } from 'react'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * EVERY BEAT, ALL THE TIME. The current one is lit, the ones already spent are
 * dimmed, the ones still to come are dimmer still.
 *
 * Session 14's `BeatList`, carried over (its `Beat` type inlined so this file
 * has no session-14 dependency). The pedagogy team's lesson plan lists all the
 * beats beside a figure and greys them off one at a time, so the shape of the
 * run is on screen before the run starts and the room always knows where it
 * is: course rule R5b, and `pedagogy-to-components` Part I, question 6b.
 *
 * Numbered, because PF 16 slide 15 numbers its five lines on the frame.
 */
export interface Beat {
  label: ReactNode
  caption?: ReactNode
}

export function BeatList({ beats, at, className = '', numbered = false }: { beats: Beat[]; at: number; className?: string; numbered?: boolean }) {
  const instant = useInstant()
  return (
    <ol className={`flex flex-col gap-1.5 ${className}`}>
      {beats.map((b, i) => {
        const state = i < at ? 'spent' : i === at ? 'now' : 'ahead'
        return (
          <li key={i}>
            <motion.div
              initial={instant ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: state === 'ahead' ? 0.38 : state === 'spent' ? 0.55 : 1, x: 0 }}
              transition={{ duration: T.enter, ease: c4(E.out) }}
              className="flex items-start gap-2.5 rounded-card border px-3.5 py-2"
              style={{
                borderColor: state === 'now' ? colors.brand : colors.line,
                background: state === 'now' ? `${colors.brand}0F` : colors.white,
              }}
            >
              {numbered ? (
                <span
                  className="mt-px grid h-6 w-6 shrink-0 place-items-center rounded-full font-mono text-[13px] font-bold"
                  style={{ background: state === 'now' ? colors.brand : colors.surface2, color: state === 'now' ? colors.white : colors.body }}
                >
                  {i + 1}
                </span>
              ) : (
                <span
                  className="mt-[6px] h-[8px] w-[8px] shrink-0 rounded-full"
                  style={{ background: state === 'now' ? colors.brand : colors.line, boxShadow: state === 'now' ? `0 0 0 4px ${colors.brand}22` : undefined }}
                />
              )}
              <span className="min-w-0">
                <span
                  className="block text-[17px] leading-snug"
                  style={{ color: state === 'now' ? colors.ink : colors.body, fontWeight: state === 'now' ? 700 : 500 }}
                >
                  {b.label}
                </span>
                {state === 'now' && b.caption && (
                  <motion.span
                    key={at}
                    className="mt-0.5 block text-[15px] leading-snug"
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
