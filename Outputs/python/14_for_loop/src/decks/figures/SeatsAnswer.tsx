import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { useClaimedSteps } from '@/motion/Stepper'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'
import { AnnotatedCode } from './AnnotatedCode'

/**
 * WHY AN EMPTY RANGE PRINTS NOTHING, BUILT IN FOUR BEATS.
 *
 * WHY IT IS NOT `VariableTrace`. Three of the four things the reference puts on
 * this frame are not variables and cannot be drawn as variable boxes: the
 * DERIVED expression `range(1, 1)`, the `no numbers` verdict on it, and the
 * empty output panel labelled `nothing printed`. The fourth is the one that
 * actually teaches the point: line 5 stays GREY for the whole run, because the
 * loop body is never entered. `VariableTrace` lights the line that ran and has
 * no way to say "this line never ran", so the frame it produced was a blank
 * output box that never said why it was blank.
 *
 * THE FOUR BEATS ARE THE REFERENCE'S OWN: the pair, line 3, line 4, nothing.
 * Each one adds exactly one thing, and the sentence for it is drawn by
 * `StepCaption` under the figure rather than sitting in the slide's lead, where
 * it gave the answer away before the room had been asked.
 *
 * It claims four build steps, which is what this slide had before, so the deck's
 * step count does not move. DOM, never SVG (content rule 17); colours from
 * tokens; timing from `figureTiming`.
 */

const BEATS = 4

export function SeatsAnswer({
  code,
  filename,
  className = '',
}: {
  code: string
  /** Content rule 31a: the language, never an invented file name. */
  filename: string
  className?: string
}) {
  const instant = useInstant()
  const shown = useClaimedSteps(BEATS)
  const n = shown.filter(Boolean).length

  /* WHAT THE INTERPRETER HAS DONE TO EACH LINE. Line 5 is `unreached` from the
     moment the loop is reached and stays that way, which is the single image
     that teaches "an empty range runs the body zero times". */
  const lineStates: Record<number, 'ran' | 'running' | 'unreached'> = {}
  if (n >= 1) {
    lineStates[1] = 'ran'
    lineStates[2] = 'ran'
  }
  if (n === 2) lineStates[3] = 'running'
  if (n >= 3) {
    lineStates[3] = 'ran'
    lineStates[4] = n === 3 ? 'running' : 'ran'
    lineStates[5] = 'unreached'
  }

  const rise = (delay = 0) =>
    instant
      ? {}
      : {
          initial: { opacity: 0, y: 10 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: T.enter, ease: c4(E.out), delay },
        }

  return (
    <div className={`grid grid-cols-[1.1fr_1fr] items-start gap-9 ${className}`}>
      {/* ONLY THE CODE BOX IS CENTRED. The row stays top-aligned so the beats
          and the output beside it keep their own top edge; `self-center` lifts
          the short code panel to the middle of the taller column. */}
      <AnnotatedCode
        className="self-center"
        code={code}
        filename={filename}
        fontSize={16}
        lineStates={lineStates}
      />

      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <ValueBox label="seats" value="4" show={n >= 1} />
          <ValueBox label="booked" value="3" show={n >= 1} />
          <ValueBox label="left" value="1" show={n >= 2} />
        </div>

        {/* The derived sequence. It is not a variable, so it is not a variable
            box: it is the expression line 4 actually asks for, with the room's
            verdict on it beside it. */}
        <div className="flex min-h-[44px] items-center gap-3">
          {n >= 3 && (
            <motion.span
              key="range"
              className="font-mono text-[26px] font-bold leading-none"
              style={{ color: colors.brandDark }}
              {...rise()}
            >
              range(1, 1)
            </motion.span>
          )}
          {n >= 3 && (
            <motion.span
              key="chip"
              className="inline-flex items-center rounded-card border-2 border-dashed px-3 py-1.5"
              style={{ borderColor: colors.danger }}
              {...rise(T.stagger)}
            >
              <span
                className="font-heading text-body-sm font-bold leading-none"
                style={{ color: colors.danger }}
              >
                no numbers
              </span>
            </motion.span>
          )}
        </div>

        <div className="overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
          <div className="flex items-center gap-2 border-b border-line bg-surface px-4 py-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: n >= 4 ? colors.danger : colors.success }}
            />
            <span className="font-heading text-body-sm font-bold uppercase tracking-wider text-body">
              Output
            </span>
          </div>
          <div className="min-h-[92px] px-4 py-3" />
        </div>

        <div className="min-h-[28px]">
          {n >= 4 && (
            <motion.span
              key="nothing"
              className="font-heading text-body-lg font-bold leading-none"
              style={{ color: colors.danger }}
              {...rise()}
            >
              nothing printed
            </motion.span>
          )}
        </div>
      </div>
    </div>
  )
}

function ValueBox({ label, value, show }: { label: string; value: string; show: boolean }) {
  const instant = useInstant()
  return (
    <div className="flex items-center gap-2" style={{ opacity: show ? 1 : 0 }}>
      <span className="font-mono text-body-sm font-bold" style={{ color: colors.body }}>
        {label}
      </span>
      <motion.span
        className="inline-flex h-[46px] w-[58px] items-center justify-center rounded-card border bg-white font-mono text-[24px] font-bold leading-none"
        style={{ borderColor: colors.line, color: colors.brandDark }}
        initial={instant || !show ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: T.enter, ease: c4(E.out) }}
      >
        {value}
      </motion.span>
    </div>
  )
}
