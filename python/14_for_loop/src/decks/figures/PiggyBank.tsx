import { useId } from 'react'
import { motion } from 'framer-motion'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'
import { useBeat, type Beat } from './walk'
import { BeatCaption } from './BeatCaption'
import { Riya, SpeechBubble } from './Riya'
import { Coin } from './Coin'
import { CeramicLight, CastShadow } from './lighting'

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
            animate={instant ? {} : { scale: state === 'here' ? 1.1 : 1 }}
            transition={{ duration: T.accent, ease: c4(E.out) }}
          >
            <Coin size={44} dim={!lit}>
              {day.coin}
            </Coin>
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
  /* Gradient ids must be unique: this jar is drawn twice on some frames, and a
     duplicate id makes the second one inherit the first's paint. */
  const u = useId().replace(/:/g, '')
  const g = (n: string) => `pj-${n}-${u}`

  return (
    <svg
      width={width}
      height={Math.round((width * 156) / 196)}
      viewBox="0 0 150 120"
      aria-label="A piggy bank"
      role="img"
    >
      {/* VOLUME, NOT OUTLINE. Flat fills made the bank read as a sticker beside
          a shaded character. Four things give it a body, in the order light
          actually works: a diagonal body gradient, a soft occlusion under the
          belly, a rim light along the lit edge, and one specular highlight. The
          ground shadow is elliptical and soft rather than a hard disc. */}
      <defs>
        <linearGradient id={g('body')} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor="#FFA8C6" />
          <stop offset="45%" stopColor={PIG} />
          <stop offset="100%" stopColor="#D4527C" />
        </linearGradient>
        <radialGradient id={g('occ')} cx="0.5" cy="0.34" r="0.72">
          <stop offset="55%" stopColor="#8E2F53" stopOpacity="0" />
          <stop offset="100%" stopColor="#8E2F53" stopOpacity="0.45" />
        </radialGradient>
        <radialGradient id={g('spec')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={g('snout')} x1="0.3" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor="#FF9FBE" />
          <stop offset="100%" stopColor="#DE5C87" />
        </linearGradient>
        <linearGradient id={g('leg')} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#E0658E" />
          <stop offset="100%" stopColor="#B84167" />
        </linearGradient>
        <radialGradient id={g('ground')} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor={colors.ink} stopOpacity="0.22" />
          <stop offset="100%" stopColor={colors.ink} stopOpacity="0" />
        </radialGradient>
        {/* Glazed ceramic, and the shadows the parts throw on each other. */}
        <CeramicLight id={g('glaze')} />
        <CastShadow id={g('drop')} dy={2.5} blur={2.5} opacity={0.3} />
      </defs>

      <ellipse cx="75" cy="112" rx="56" ry="8" fill={`url(#${g('ground')})`} />

      {/* Back legs first, darker, so the body sits in front of them. */}
      <g filter={`url(#${g('drop')})`}>
        <rect x="36" y="88" width="15" height="22" rx="7" fill={`url(#${g('leg')})`} />
        <rect x="94" y="88" width="15" height="22" rx="7" fill={`url(#${g('leg')})`} />
      </g>

      <path
        d="M24 58 q-10 -2 -9 -10 q1 -7 8 -5 q6 2 3 8"
        fill="none"
        stroke="#C9507A"
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* Ear behind the head, so the body edge cuts across it. */}
      <g filter={`url(#${g('drop')})`}>
        <path d="M104 30 q14 -10 20 -2 q4 7 -6 16 z" fill="#C9507A" />
      </g>

      <g filter={`url(#${g('glaze')})`}>
        <ellipse cx="72" cy="62" rx="52" ry="40" fill={`url(#${g('body')})`} />
      </g>
      <ellipse cx="72" cy="62" rx="52" ry="40" fill={`url(#${g('occ')})`} />
      {/* The belly turns away from the lamp, so it darkens before the edge. */}
      <path d="M26 78 q46 30 92 -6 q-12 30 -46 30 q-34 0 -46 -24 z" fill="#A83F63" opacity="0.16" />
      {/* No painted rim light or highlight here: `CeramicLight` computes both
          from the form itself, and a hand-drawn streak on top of a computed one
          reads as a scratch in the glaze. */}

      {/* The snout sticks OUT, so it drops a shadow on the cheek behind it and
          takes its own glaze. This is the layer separation a gradient cannot do. */}
      <g filter={`url(#${g('drop')})`}>
        <g filter={`url(#${g('glaze')})`}>
          <ellipse cx="120" cy="66" rx="17" ry="15" fill={`url(#${g('snout')})`} />
        </g>
      </g>

      <ellipse cx="115" cy="66" rx="3.2" ry="4.4" fill="#A83F63" />
      <ellipse cx="125" cy="66" rx="3.2" ry="4.4" fill="#A83F63" />

      {/* THE FACE IS THE STATE. Money in, it smiles; a skipped day, it sulks.
          The mouth and the eye both change, so the mood survives greyscale and
          a projector. */}
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
          <path d="M84 74 q10 9 19 2" fill="none" stroke="#A83F63" strokeWidth="3.2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <circle cx="100" cy="46" r="3.4" fill={colors.ink} opacity="0.7" />
          <path d="M84 80 q10 -8 19 -2" fill="none" stroke="#A83F63" strokeWidth="3.2" strokeLinecap="round" />
        </>
      )}

      {/* The coin slot is a hole, so it gets an inner shadow and a lit lower lip
          rather than a flat grey bar. */}
      <rect x="54" y="23" width="36" height="8" rx="4" fill="#7E2E4C" />
      <rect x="56" y="28.5" width="32" height="2.4" rx="1.2" fill="#FFB9D2" opacity="0.55" />
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

      {narrated ? (
        /* SHE STANDS ON THE LEFT AND TALKS ACROSS AT THE BANK. Facing each
           other is what makes the two of them a conversation rather than two
           figures on one slide. The bank answers on the days she skips, so a
           skipped day still has a voice. */
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-5">
          <Riya width={108} mood={happy ? 'happy' : 'worried'} />
          <div className="flex flex-col gap-3">
            {beat?.caption && (
              <SpeechBubble key={reached} from={beat.voice ?? 'riya'}>
                {beat.caption}
              </SpeechBubble>
            )}
          </div>
          <div className="flex items-center gap-3">
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
            {/* THE COIN GOES IN, it does not stand next to the bank. It used to
                sit in a box beside the jar, which says a coin exists; dropping
                it through the slot and letting it disappear inside says the
                money went in, which is the whole sentence the beat is making.
                The slot is at x72,y27 in the jar's 150x120 viewBox, so at 196px
                wide it is 94px across and 35px down. */}
            <span className="relative inline-block">
              <PiggyJar happy={happy} />
              {beat?.at !== undefined && at >= 0 && days[at]?.coin && (
                <motion.span
                  key={at}
                  className="pointer-events-none absolute"
                  style={{ left: 74, top: 0 }}
                  initial={instant ? false : { opacity: 0, y: -34, scale: 1 }}
                  animate={{ opacity: [0, 1, 1, 0], y: [-34, -6, 18, 30], scale: [1, 1, 0.92, 0.72] }}
                  transition={{ duration: T.travel * 2.2, ease: c4(E.inOut), times: [0, 0.3, 0.75, 1] }}
                >
                  <Coin size={40}>{days[at].coin}</Coin>
                </motion.span>
              )}
            </span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-[300px_1fr] items-center gap-8">
        {/* THE BANK. Shape only: the total beside it is a DOM element. */}
        <div className="flex items-center gap-4">
          {/* The coin drops through the slot, see the note on the narrated row. */}
          <span className="relative inline-block">
            <PiggyJar happy={happy} />
            {beat?.at !== undefined && at >= 0 && days[at]?.coin && (
              <motion.span
                key={at}
                className="pointer-events-none absolute"
                style={{ left: 74, top: 0 }}
                initial={instant ? false : { opacity: 0, y: -34 }}
                animate={{ opacity: [0, 1, 1, 0], y: [-34, -6, 18, 30], scale: [1, 1, 0.92, 0.72] }}
                transition={{ duration: T.travel * 2.2, ease: c4(E.inOut), times: [0, 0.3, 0.75, 1] }}
              >
                <Coin size={40}>{days[at].coin}</Coin>
              </motion.span>
            )}
          </span>
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
            <BeatCaption label={beat?.label} caption={beat?.caption} step={reached} className="flex-1" />
          </div>
        </div>
      )}
  </div>
  )
}
