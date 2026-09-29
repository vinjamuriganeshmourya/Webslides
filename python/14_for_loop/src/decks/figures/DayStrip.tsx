import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { useStepControls } from '@/motion/Stepper'
import { colors } from '@/design/tokens'
import { Coin } from './Coin'
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
  spread = false,
  className = '',
}: {
  /** One per day: the label, what that day contributed, and the running total. */
  days: { label: string; coin?: string; total: string }[]
  /** Which day each deck step is on. `-1` for a step that is not a day. */
  stepDay: number[]
  /**
   * Seven equal columns filling the width given, instead of seven fixed 64px
   * tiles. A strip that ends 280px short of the code panel under it reads as a
   * floating object; sharing the panel's right edge makes the week and the
   * program that walks it one block.
   */
  spread?: boolean
  className?: string
}) {
  const instant = useInstant()
  const { step, allRevealed } = useStepControls()
  const shown = allRevealed ? stepDay.length : step
  const at = shown > 0 ? (stepDay[shown - 1] ?? -1) : -1
  /* THE HIGHEST DAY REACHED, not the current one. The last few steps of the
     run are lines 6 and the end of the loop, which belong to no day and report
     `at = -1`; reading `done` off that wiped every running total off the strip
     exactly when the room had finished earning them. */
  const seen = stepDay.slice(0, shown).filter((d) => d >= 0)
  const furthest = seen.length ? Math.max(...seen) : -1
  const done = allRevealed ? days.length : at >= 0 ? at : furthest + 1

  return (
    <div
      className={
        spread ? `grid grid-cols-7 gap-2 ${className}` : `flex items-center justify-center gap-1 ${className}`
      }
    >
      {days.map((d, i) => {
        const here = i === at
        const past = i < done
        const saves = Boolean(d.coin)
        return (
          <motion.div
            key={d.label}
            /* EVERY TILE THE SAME SIZE. A coin is a 26px disc and "skip" is a
               line of text, so sizing to content made the saving days taller
               than the skipped ones and the row read as two rows. A fixed box
               with three fixed rows keeps the week a week. */
            className={`flex flex-col items-center justify-between rounded-card border-2 ${
              spread ? 'h-[84px] w-full px-2 py-1.5' : 'h-[80px] w-[64px] shrink-0 px-1 py-1'
            }`}
            style={{
              borderColor: here ? colors.brand : colors.line,
              background: here ? `${colors.brand}12` : colors.white,
              opacity: past && !here ? 0.55 : 1,
            }}
            animate={instant ? {} : { scale: here ? 1 : 0.985 }}
            transition={{ duration: T.label, ease: c4(E.out) }}
          >
            <span
              className={`font-heading font-bold leading-none ${spread ? 'text-body' : 'text-body-sm'}`}
              style={{ color: colors.ink }}
            >
              {d.label}
            </span>

            <span className={`grid place-items-center ${spread ? 'h-[30px]' : 'h-[26px]'}`}>
              {saves ? (
                <Coin size={spread ? 30 : 26} dim={!(past || here)}>
                  {d.coin}
                </Coin>
              ) : (
                <span
                  className={`leading-none ${spread ? 'text-body-sm' : 'text-[12px]'}`}
                  style={{ color: colors.muted }}
                >
                  skip
                </span>
              )}
            </span>

            {/* THE RUNNING TOTAL, under the day it belongs to. The bank shows
                where the money ended up; this shows the room that a skipped day
                does not reset it, which is the thing the if statement decides. */}
            <span
              className={`font-mono font-bold leading-none ${spread ? 'text-[17px]' : 'text-[13px]'}`}
              style={{ color: past || here ? colors.brandDark : colors.line }}
            >
              {past || here ? d.total : '\u2013'}
            </span>
          </motion.div>
        )
      })}
    </div>
  )
}
