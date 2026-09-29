import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * A COUNTDOWN THE INSTRUCTOR STARTS, on a card that gives the room work to do.
 *
 * WHY IT IS ON THE SLIDE. Every task card in the reference carries one, from
 * 1:00 on a type-it-and-run step to 4:00 on the coding challenge, because the
 * number is what stops a two-minute task eating eight. A task with no visible
 * clock is a task the room paces itself through, and fifty people pace
 * differently.
 *
 * IT STARTS ON A PRESS, never on arrival. A timer that runs the moment a slide
 * appears is counting while the instructor is still reading the task out.
 *
 * NOT ON THE QUIZ CARD. The classroom quiz runs on the portal and the portal
 * keeps its own clock; a second clock on the wall is noise.
 */
export function Timer({
  seconds,
  className = '',
}: {
  /** The reference's own budget for this task: 60, 90, 120, 240. */
  seconds: number
  className?: string
}) {
  const instant = useInstant()
  const [left, setLeft] = useState(seconds)
  const [running, setRunning] = useState(false)
  const tick = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => setLeft(seconds), [seconds])
  useEffect(() => {
    if (!running) return
    tick.current = setInterval(() => {
      setLeft((s) => {
        if (s <= 1) {
          setRunning(false)
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => {
      if (tick.current) clearInterval(tick.current)
    }
  }, [running])

  const mm = Math.floor(left / 60)
  const ss = String(left % 60).padStart(2, '0')
  const done = left === 0

  return (
    <motion.div
      className={`inline-flex items-center gap-3 rounded-pill border-2 px-4 py-2 ${className}`}
      style={{
        borderColor: done ? colors.danger : running ? colors.brand : colors.line,
        background: colors.white,
      }}
      animate={instant ? {} : { scale: running ? 1 : 0.99 }}
      transition={{ duration: T.label, ease: c4(E.out) }}
    >
      <button
        type="button"
        aria-label={running ? 'Pause the timer' : 'Start the timer'}
        onClick={() => (done ? (setLeft(seconds), setRunning(true)) : setRunning((r) => !r))}
        className="grid h-7 w-7 place-items-center rounded-full"
        style={{ background: done ? colors.danger : colors.brand }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" aria-hidden fill={colors.white}>
          {running ? (
            <>
              <rect x="6" y="5" width="4" height="14" rx="1.2" />
              <rect x="14" y="5" width="4" height="14" rx="1.2" />
            </>
          ) : (
            <path d="M7 4.5 19 12 7 19.5Z" />
          )}
        </svg>
      </button>
      <span
        className="font-mono text-[22px] font-bold leading-none tabular-nums"
        style={{ color: done ? colors.danger : colors.ink }}
      >
        {mm}:{ss}
      </span>
    </motion.div>
  )
}
