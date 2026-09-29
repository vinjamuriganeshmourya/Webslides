import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'
import { useBeat, type Beat } from './walk'
import { BeatCaption } from './BeatCaption'

/**
 * PIGGY BANK — Riya's seven days drawn as a week of coins and a bank that
 * actually fills.
 *
 * WHY THIS AND NOT A ROW OF LABELLED TILES. Same reason as `PhonePlaylist`: the
 * story beat exists so the room wants the loop before it is given one, and a box
 * reading `Day 1 / ₹1` is already the loop written down. The source drew Riya, a
 * week of day cards with coins, and a piggy bank whose total climbs. The coin
 * going IN is the whole argument of an accumulator, and it is the one thing a
 * table of numbers cannot show.
 *
 * WHAT IS SVG AND WHAT IS NOT (content rule 17). The bank's BODY is an SVG,
 * because it is a shape and carries no text. Every label, every coin value and
 * the running total are DOM elements outside it, so `align-check.mjs` can
 * measure them and nothing can render on top of anything else. The failure this
 * rule exists for is `<text>` inside an `<svg>`, and there is none here.
 *
 * NO CHARACTER. The source drew Riya as a person. Course rule R1 says a figure
 * earns its place by making an argument a sentence cannot, and the person makes
 * none: her lines are the captions, which are already on the frame.
 *
 * SESSION-LOCAL, AND TEMPORARILY. See `PhonePlaylist`.
 */

export interface Day {
  label: string
  /** The coin that goes in, or nothing on a day she skips. */
  coin?: string
}

export interface PiggyBeat extends Beat {
  /** The total in the bank after this beat. */
  total: string
  /** True on the beat where the week runs out. */
  ended?: boolean
}

function DayCard({ day, state }: { day: Day; state: 'ahead' | 'here' | 'done' }) {
  const instant = useInstant()
  const saves = Boolean(day.coin)
  const lit = state !== 'ahead'
  return (
    <div className="flex w-[104px] flex-col items-center gap-2">
      <div
        className="flex h-[116px] w-full flex-col items-center justify-center gap-3 rounded-card border-2 bg-white shadow-card-soft"
        style={{
          borderColor: state === 'here' ? colors.brand : colors.line,
          background: state === 'here' ? `${colors.brand}0F` : colors.white,
        }}
      >
        <span
          className="font-heading text-body-sm font-bold leading-none"
          style={{ color: lit ? colors.ink : colors.muted }}
        >
          {day.label}
        </span>
        {saves ? (
          <motion.span
            className="grid h-11 w-11 place-items-center rounded-full font-heading text-[17px] font-bold leading-none"
            style={{
              background: lit ? colors.warning : colors.surface2,
              color: lit ? colors.ink : colors.muted,
            }}
            animate={instant ? {} : { scale: state === 'here' ? 1.1 : 1 }}
            transition={{ duration: T.accent, ease: c4(E.out) }}
          >
            {day.coin}
          </motion.span>
        ) : (
          <span
            className="font-heading text-body-sm font-semibold leading-none"
            style={{ color: colors.muted }}
          >
            skip
          </span>
        )}
      </div>
    </div>
  )
}

export function PiggyBank({
  days,
  beats,
  className = '',
}: {
  days: Day[]
  beats: PiggyBeat[]
  className?: string
}) {
  const instant = useInstant()
  const { beat, reached } = useBeat(beats)
  const at = beat?.at ?? -1
  const ended = beat?.ended ?? false

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      <div className="flex items-start justify-center gap-3">
        {days.map((d, i) => (
          <DayCard key={d.label} day={d} state={at === i ? 'here' : at > i ? 'done' : 'ahead'} />
        ))}
        <div className="flex w-[110px] flex-col items-center">
          <div
            className="flex h-[116px] w-full items-center justify-center rounded-card border-2 border-dashed px-2 text-center"
            style={{
              borderColor: ended ? colors.danger : colors.line,
              background: ended ? `${colors.danger}0F` : 'transparent',
            }}
          >
            <span
              className="font-heading text-body-sm font-bold leading-tight"
              style={{ color: ended ? colors.danger : colors.muted }}
            >
              no days left
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[300px_1fr] items-center gap-8">
        {/* THE BANK. Shape only: the total beside it is a DOM element. */}
        <div className="flex items-center gap-4">
          <svg width="196" height="156" viewBox="0 0 150 120" aria-label="A piggy bank" role="img">
            <ellipse cx="75" cy="112" rx="52" ry="6" fill={colors.ink} opacity="0.1" />
            <rect x="34" y="92" width="14" height="18" rx="5" fill={colors.brandDark} />
            <rect x="96" y="92" width="14" height="18" rx="5" fill={colors.brandDark} />
            <ellipse cx="72" cy="62" rx="52" ry="40" fill={colors.brand} />
            <path d="M118 44 q16 -6 20 -16 q4 16 -6 28 z" fill={colors.brandDark} />
            <ellipse cx="119" cy="66" rx="16" ry="14" fill={colors.brandDark} />
            <circle cx="115" cy="64" r="3" fill={colors.white} opacity="0.85" />
            <circle cx="124" cy="64" r="3" fill={colors.white} opacity="0.85" />
            <circle cx="104" cy="50" r="3.4" fill={colors.ink} opacity="0.75" />
            <rect x="56" y="24" width="34" height="7" rx="3.5" fill={colors.brandDeep} />
          </svg>
          {/* The coin that is going in, on the beat it goes in. */}
          <div className="h-10 w-10">
            {beat?.at !== undefined && at >= 0 && days[at]?.coin && (
              <motion.span
                key={at}
                className="grid h-10 w-10 place-items-center rounded-full font-heading text-[16px] font-bold"
                style={{ background: colors.warning, color: colors.ink }}
                initial={instant ? false : { opacity: 0, y: -26 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: T.travel, ease: c4(E.out) }}
              >
                {days[at].coin}
              </motion.span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="w-[240px] overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
            <div className="border-b border-line bg-surface px-4 py-1.5 text-center">
              <span className="font-heading text-body-sm font-bold leading-none" style={{ color: colors.body }}>
                In the piggy bank
              </span>
            </div>
            <div className="grid h-[58px] place-items-center">
              <motion.span
                key={beat?.total ?? 'none'}
                className="font-mono text-[30px] font-bold leading-none"
                style={{ color: colors.brandDark }}
                initial={instant ? false : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: T.label, ease: c4(E.out) }}
              >
                {beat?.total ?? '₹0'}
              </motion.span>
            </div>
          </div>
          <BeatCaption label={beat?.label} caption={beat?.caption} step={reached} className="flex-1" />
        </div>
      </div>
    </div>
  )
}
