import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useClaimedSteps } from '@/motion/Stepper'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * RANGE DIAL — two settings, a number line, and the numbers that actually come
 * out of them.
 *
 * SESSION-LOCAL, ON PURPOSE, AND TEMPORARILY. `slide-kit/sequence-lab/` owns
 * the promotion of this deck's three new figures into the kit; until it lands,
 * this deck keeps its own first cut and re-points at `@/ui` afterwards.
 *
 * WHY THIS REPRESENTATION (content rule 27). `CodeOutput` can show
 * `range(5)` beside `0 1 2 3 4`, and that is a static pair: it says what one
 * call printed, not that the output is a FUNCTION of the two settings. The claim
 * this figure has to make is "change the stop and watch which numbers survive",
 * and the conventional form for "a value read off a scale" is a number line with
 * the selected span marked, which is how every ruler, slider and timeline a
 * learner has already used draws itself.
 *
 * THE ONE LABEL THE WHOLE SESSION DEPENDS ON is `stops before`, and it is pinned
 * under the stop value rather than written in the lead. The missing star row on
 * the pattern slides is caused by exactly this, and a lead the eye has already
 * left cannot carry it.
 *
 * DOM, NOT SVG (content rule 17): every tick is a real element in a real flex
 * row, so `align-check.mjs` can see each one.
 */

export interface RangeBeat {
  /** The start value. Left out means the one-argument form, which starts at 0. */
  start?: number
  /** The stop value. Never produced: the point of the figure. */
  stop: number
  /** The beat's sentence. */
  caption: ReactNode
  /** The short name of the beat. */
  label?: string
  /** Light the `stops before` flag on the stop tick. */
  markStop?: boolean
}

export interface RangeDialProps {
  /** The highest number drawn on the line. */
  max: number
  beats: RangeBeat[]
  className?: string
}

function Dial({ name, value, implied }: { name: string; value: string; implied?: boolean }) {
  return (
    <div className="w-[164px] overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
      <div className="border-b border-line bg-surface px-3 py-1.5 text-center">
        <span className="font-heading text-body-sm font-bold leading-none" style={{ color: colors.body }}>
          {name}
        </span>
      </div>
      <div className="grid h-[58px] place-items-center">
        <span
          className="font-mono text-[28px] font-bold leading-none"
          style={{ color: implied ? colors.muted : colors.brandDark }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

export function RangeDial({ max, beats, className = '' }: RangeDialProps) {
  const instant = useInstant()
  const shown = useClaimedSteps(beats.length)
  const reached = shown.filter(Boolean).length
  const beat = reached > 0 ? beats[reached - 1] : undefined

  const start = beat?.start ?? 0
  const stop = beat?.stop
  const call = beat
    ? beat.start === undefined
      ? `range(${beat.stop})`
      : `range(${beat.start}, ${beat.stop})`
    : 'range( )'

  const ticks = Array.from({ length: max + 1 }, (_, i) => i)
  const produced = (n: number) => beat !== undefined && n >= start && n < (stop ?? 0)

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <div
        className="rounded-card border-2 px-8 py-3 font-mono text-[30px] font-bold leading-none"
        style={{ borderColor: colors.brand, background: `${colors.brand}0F`, color: colors.brandDark }}
      >
        {call}
      </div>

      <div className="flex items-start gap-6">
        <Dial
          name="start"
          value={beat?.start === undefined ? '0' : String(beat.start)}
          implied={beat?.start === undefined}
        />
        <Dial name="stop" value={stop === undefined ? '?' : String(stop)} />
      </div>

      <div className="flex items-start gap-2">
        {ticks.map((n) => {
          const lit = produced(n)
          const isStop = stop === n
          return (
            <div key={n} className="flex w-[66px] flex-col items-center gap-2">
              <motion.div
                className="grid h-[54px] w-full place-items-center rounded-card border-2 font-mono text-[22px] font-bold"
                style={{
                  borderColor: lit ? colors.brand : isStop ? colors.danger : colors.line,
                  background: lit ? `${colors.brand}1A` : colors.white,
                  color: lit ? colors.brandDark : isStop ? colors.danger : colors.muted,
                }}
                animate={instant ? {} : { scale: lit ? 1 : 0.97 }}
                transition={{ duration: T.enter, ease: c4(E.out) }}
              >
                {n}
              </motion.div>
              {/* THE LABEL THE SESSION TURNS ON. Its own element under its own
                  tick, so nothing can render on top of it. */}
              <div className="h-[34px] w-full">
                {isStop && beat?.markStop && (
                  <motion.div
                    className="rounded-pill px-1 py-1 text-center font-heading text-[11px] font-bold uppercase leading-tight tracking-wide"
                    style={{ background: colors.danger, color: colors.white }}
                    initial={instant ? false : { opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: T.label, ease: c4(E.out) }}
                  >
                    stops
                    <br />
                    before
                  </motion.div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <div className="min-h-[72px] w-[900px] rounded-card border border-line bg-surface px-7 py-4">
        {beat && (
          <motion.div
            key={reached}
            initial={instant ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: T.enter, ease: c4(E.out) }}
          >
            {beat.label && (
              <div
                className="mb-1 font-heading text-body-sm font-bold uppercase tracking-wider"
                style={{ color: colors.brand }}
              >
                {beat.label}
              </div>
            )}
            <p className="text-body-lg font-medium leading-snug" style={{ color: colors.ink }}>
              {beat.caption}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
