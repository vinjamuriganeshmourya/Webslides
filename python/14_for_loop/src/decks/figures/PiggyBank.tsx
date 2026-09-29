import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'
import { useBeat, type Beat } from './walk'
import { BeatCaption } from './BeatCaption'
import { Riya, SpeechBubble } from './Riya'

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
 * RIYA IS DRAWN, AND SHE SPEAKS. The first cut left her out, on the reading
 * that a person makes no argument a sentence cannot. That was overruled twice
 * (course rule R5b): the line *"I can't add all that by hand!"* in a callout is
 * the deck narrating, and the same line in her speech bubble is somebody stuck.
 * The room needs to want the loop, and wanting is something a person does. This
 * is the case content rule 8 allows and R1 does not cut: she states the
 * constraint, so she is content.
 *
 * SESSION-LOCAL, AND TEMPORARILY. See `PhonePlaylist`.
 */

/*
  THE PIG IS PINK, AND PINK IS NOT A THEME COLOUR.

  These are OBJECT colours, the same category as `PhonePlaylist`'s Spotify
  greens: they describe a real thing the room has to recognise, not the deck's
  palette, so they do not belong in `tokens.ts` and they are not a style choice a
  future deck should reuse. A blue piggy bank reads as a blue blob; the pink is
  what makes it a piggy bank at ten metres.

  Drawn rather than photographed, because the bank changes expression: it smiles
  on a day money goes in and sulks on a day Riya skips. A PNG cannot do that
  without one file per mood, and two files drift.
*/
const PIG = '#F2789F'
const PIG_DARK = '#D95C86'
const PIG_SNOUT = '#ED6A94'

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
  /** Who says the caption. The bank answers on the days she skips. */
  voice?: 'riya' | 'pig'
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


/**
 * THE BANK ITSELF, exported so a second slide draws the SAME object.
 *
 * Riya's story card and the trace card both show money going into a piggy bank.
 * Drawn twice they would be two near misses of one thing, and the room would
 * read them as two different banks. Course rule R5b: match the reference's
 * fidelity, and a redrawing is always a near miss.
 */
export function PiggyJar({ happy, width = 196 }: { happy: boolean; width?: number }) {
  return (
    <svg
      width={width}
      height={Math.round((width * 156) / 196)}
      viewBox="0 0 150 120"
      aria-label="A piggy bank"
      role="img"
    >

            <ellipse cx="75" cy="112" rx="52" ry="6" fill={colors.ink} opacity="0.1" />
            <rect x="36" y="90" width="15" height="20" rx="6" fill={PIG_DARK} />
            <rect x="94" y="90" width="15" height="20" rx="6" fill={PIG_DARK} />
            <path
              d="M24 58 q-10 -2 -9 -10 q1 -7 8 -5 q6 2 3 8"
              fill="none"
              stroke={PIG_DARK}
              strokeWidth="5"
              strokeLinecap="round"
            />
            <ellipse cx="72" cy="62" rx="52" ry="40" fill={PIG} />
            <path d="M104 30 q14 -10 20 -2 q4 7 -6 16 z" fill={PIG_DARK} />
            <ellipse cx="120" cy="66" rx="17" ry="15" fill={PIG_SNOUT} />
            <ellipse cx="115" cy="66" rx="3.2" ry="4.4" fill={PIG_DARK} />
            <ellipse cx="125" cy="66" rx="3.2" ry="4.4" fill={PIG_DARK} />
            {/* THE FACE IS THE STATE. Money in, it smiles; a skipped day, it
                sulks. The mouth and the eye both change, so the mood survives
                greyscale and a projector. */}
            {happy ? (
              <>
                <path
                  d="M96 44 q4 -5 8 0"
                  fill="none"
                  stroke={colors.ink}
                  strokeWidth="3"
                  strokeLinecap="round"
                  opacity="0.8"
                />
                <path
                  d="M84 74 q10 9 19 2"
                  fill="none"
                  stroke={PIG_DARK}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </>
            ) : (
              <>
                <circle cx="100" cy="46" r="3.4" fill={colors.ink} opacity="0.7" />
                <path
                  d="M84 80 q10 -8 19 -2"
                  fill="none"
                  stroke={PIG_DARK}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                />
              </>
            )}
            <rect x="54" y="23" width="36" height="8" rx="4" fill={colors.ink} opacity="0.5" />
              </svg>
  )
}

export function PiggyBank({
  days,
  beats,
  narrated = false,
  className = '',
}: {
  days: Day[]
  beats: PiggyBeat[]
  /** Riya says the beat herself, in a bubble, instead of a caption line. */
  narrated?: boolean
  className?: string
}) {
  const instant = useInstant()
  const { beat, reached } = useBeat(beats)
  const at = beat?.at ?? -1
  const ended = beat?.ended ?? false
  /* Happy on a day a coin goes in, sulking on a day she skips, and worried on
     the last beat, where the week is over and the sum has outgrown doing it by
     hand. That worry is the reason the next slide exists. */
  const happy = !ended && (at < 0 || Boolean(days[at]?.coin))

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
          <PiggyJar happy={happy} />
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
          <div className="w-[220px] shrink-0 overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
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
          {narrated ? (
            /* Day by day, in her own words. The bank takes the line on the days
               she saves nothing, so a skipped day still has a voice. */
            <div className="flex flex-1 items-start gap-3">
              <Riya width={86} mood={happy ? 'happy' : 'worried'} />
              {beat?.caption && (
                <SpeechBubble key={reached} from={beat.voice ?? 'riya'} className="flex-1">
                  {beat.caption}
                </SpeechBubble>
              )}
            </div>
          ) : (
            <BeatCaption label={beat?.label} caption={beat?.caption} step={reached} className="flex-1" />
          )}
        </div>
      </div>
    </div>
  )
}
