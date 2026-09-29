import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { useStepControls } from '@/motion/Stepper'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * RIYA'S WEEK, ALL SEVEN DAYS AT ONCE.
 *
 * WHY THE WHOLE WEEK AND NOT JUST THE CURRENT DAY. The variable boxes beside
 * the trace show `day` as one number, so the odd/even pattern -- the rule the
 * whole program exists to express -- is never visible. Seven tiles with `+1`,
 * `skip`, `+3`, `skip` on them show it at a glance, and the room can see the
 * shape of the answer before the total gets there.
 *
 * It reads the DECK's step, like `PiggyMeter`, so it claims no build steps of
 * its own and cannot drift from the trace beside it. `allRevealed` is honoured
 * for the same reason: under `?all` the deck's counter never moves.
 */
export function DayStrip({
  days,
  stepDay,
  className = '',
}: {
  /** One per day: the label and what that day contributed, or nothing. */
  days: { label: string; coin?: string }[]
  /** Which day each deck step is on. `-1` for a step that is not a day. */
  stepDay: number[]
  className?: string
}) {
  const instant = useInstant()
  const { step, allRevealed } = useStepControls()
  const shown = allRevealed ? stepDay.length : step
  const at = shown > 0 ? (stepDay[shown - 1] ?? -1) : -1
  const done = allRevealed ? days.length : at

  return (
    <div className={`flex items-center justify-center gap-1.5 ${className}`}>
      {days.map((d, i) => {
        const here = i === at
        const past = i < done
        const saves = Boolean(d.coin)
        return (
          <motion.div
            key={d.label}
            /* THE TILE IS A ROW, NOT A COLUMN. Stacked, seven of these cost the
               frame sixty pixels, and this slide spends its height on the trace,
               the chain and the bank. Laid out across, a day still reads as one
               object and the strip is half as tall. */
            className="flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-card border px-2 py-0.5"
            style={{
              borderColor: here ? colors.brand : past ? colors.line : colors.line,
              background: here ? `${colors.brand}12` : colors.white,
              opacity: past && !here ? 0.55 : 1,
            }}
            animate={instant ? {} : { scale: here ? 1 : 0.985 }}
            transition={{ duration: T.label, ease: c4(E.out) }}
          >
            <span className="font-heading text-body-sm font-bold leading-none" style={{ color: colors.ink }}>
              {d.label}
            </span>
            {saves ? (
              <span
                className="grid h-[24px] w-[24px] place-items-center rounded-full font-heading text-[12px] font-bold leading-none"
                style={{ background: colors.warning, color: colors.ink }}
              >
                {d.coin}
              </span>
            ) : (
              <span className="text-[12px] leading-none" style={{ color: colors.muted }}>
                skip
              </span>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
