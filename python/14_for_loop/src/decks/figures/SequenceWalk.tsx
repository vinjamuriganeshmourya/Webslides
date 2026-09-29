import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useClaimedSteps } from '@/motion/Stepper'
import { useInstant } from '@/motion/instant'
/*
 * ONE OF THREE SKINS. `PhonePlaylist` and `PiggyBank` beside it draw the same
 * walk as the real-world object the beat is about, because the hook and the
 * story exist to be recognised before they are abstracted. This skin is for the
 * one walk whose items really ARE abstract: the six characters of a string.
 */
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * SEQUENCE WALK — a row of items, a pointer that advances one item per click,
 * and an explicit beat where the pointer asks for the next item and is refused.
 *
 * SESSION-LOCAL, ON PURPOSE, AND TEMPORARILY.
 *
 * `slide-kit/sequence-lab/` is running candidate designs for this figure right
 * now, and the winner gets promoted into `slide-kit/slide-template/src/ui/`.
 * Until then this deck owns its own first cut, so that the lab and the deck do
 * not fight over one file. When the lab lands, delete this file and re-point the
 * three call sites in `forLoopDeck.tsx` at `@/ui`.
 *
 * WHY THIS REPRESENTATION (content rule 27). The claim is not "a variable
 * changed" — that is `VariableTrace`, and it is already in the kit. The claim is
 * "the sequence ran out, and that is what stopped the loop". A number line, a
 * counter or a flow chart all draw the wrong thing: they draw counting. The
 * conventional form for "one job, once per item, until the items are gone" is a
 * strip of items with a position marker, which is how every playlist, queue and
 * progress rail a learner has already used draws itself. So: a strip, a marker,
 * and a final frame where the marker is past the last tile with nothing under it.
 *
 * WHY IT IS DOM AND NOT SVG. Content rule 17. Every label here is a real element
 * in a real grid, so `align-check.mjs` can see it. Two SVG figures shipped in
 * session 4 with their labels overlapping and all three harnesses passed them.
 *
 * MOTION. Explanatory tier: `T.enter` (520ms) entrances, `T.stagger` (130ms)
 * between tiles, and `useInstant()` honoured so a Ctrl+arrow jump mounts the
 * figure at its final state instead of animating alone.
 */

export interface WalkItem {
  /** The big label on the tile: `Song 1`, `P`, `Day 1`. */
  label: string
  /** One short line under it: `₹1`, `skip`. */
  sub?: string
  /** Draws the tile as a pass that does nothing, for Riya's even days. */
  quiet?: boolean
}

export interface WalkBeat {
  /**
   * Where the pointer sits.
   *
   * `-1` is before the walk starts. Any index at or past the number of VISIBLE
   * items is the ran-out beat, and the strip draws the refusal explicitly.
   */
  at: number
  /** The beat's own sentence, from the source, verbatim. */
  caption: ReactNode
  /** The short name of the beat, shown above the sentence. */
  label?: string
  /** What the loop variable is holding after this beat. */
  holds?: string
  /** A running total, when the walk is accumulating one. */
  tally?: string
  /** How many items are on the strip at this beat. Defaults to all of them. */
  visible?: number
}

export interface SequenceWalkProps {
  items: WalkItem[]
  beats: WalkBeat[]
  /** Names the slot that holds one item at a time: `ch`, `Now playing`. */
  holdsLabel?: string
  /** Names the running total: `In the piggy bank`. */
  tallyLabel?: string
  /** What the strip says once the items are gone. */
  endLabel?: string
  className?: string
}

const NOT_YET = 'not set yet'

function Tile({
  item,
  state,
  index,
}: {
  item: WalkItem
  state: 'ahead' | 'here' | 'done'
  index: number
}) {
  const instant = useInstant()
  const border =
    state === 'here' ? colors.brand : state === 'done' ? colors.line : colors.line
  const bg = state === 'here' ? `${colors.brand}14` : colors.white
  const ink = state === 'ahead' ? colors.muted : colors.ink

  return (
    <motion.div
      className="flex w-[104px] flex-col items-center gap-2"
      initial={instant ? false : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: T.enter, ease: c4(E.out), delay: instant ? 0 : index * T.stagger }}
    >
      <div
        className="flex h-[84px] w-full flex-col items-center justify-center rounded-card border-2 shadow-card-soft"
        style={{ borderColor: border, background: bg }}
      >
        <span className="font-mono text-[24px] font-bold leading-none" style={{ color: ink }}>
          {item.label}
        </span>
        {item.sub && (
          <span
            className="mt-1.5 font-heading text-body-sm font-semibold leading-none"
            style={{ color: item.quiet ? colors.muted : colors.tealDark }}
          >
            {item.sub}
          </span>
        )}
      </div>
      {/* The marker is a real element under the tile, never an absolute layer:
          that is what keeps it measurable and keeps it from landing on a label. */}
      <div className="h-[22px]">
        {state === 'here' && (
          <motion.div
            className="rounded-pill px-3 py-1 font-heading text-[12px] font-bold uppercase leading-none tracking-wider"
            style={{ background: colors.brand, color: colors.white }}
            initial={instant ? false : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: T.label, ease: c4(E.out) }}
          >
            here
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

function SlotBox({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-[196px] overflow-hidden rounded-card border border-line bg-white shadow-card-soft">
      <div className="border-b border-line bg-surface px-3 py-1.5 text-center">
        <span className="font-heading text-body-sm font-bold leading-none" style={{ color: colors.body }}>
          {label}
        </span>
      </div>
      <div className="grid h-[52px] place-items-center px-3">
        <span
          className="font-mono text-[22px] font-semibold leading-none"
          style={{ color: value === NOT_YET ? colors.muted : colors.brandDark }}
        >
          {value}
        </span>
      </div>
    </div>
  )
}

export function SequenceWalk({
  items,
  beats,
  holdsLabel,
  tallyLabel,
  endLabel = 'nothing left',
  className = '',
}: SequenceWalkProps) {
  const instant = useInstant()
  const shown = useClaimedSteps(beats.length)
  const reached = shown.filter(Boolean).length
  const beat: WalkBeat = reached > 0 ? beats[reached - 1] : { at: -1, caption: '' }

  const visible = beat.visible ?? items.length
  const strip = items.slice(0, visible)
  const ranOut = beat.at >= visible

  return (
    <div className={`flex flex-col items-center gap-6 ${className}`}>
      <div className="flex items-end gap-3">
        {strip.map((item, i) => (
          <Tile
            key={`${item.label}-${i}`}
            item={item}
            index={i}
            state={beat.at === i ? 'here' : beat.at > i ? 'done' : 'ahead'}
          />
        ))}
        {/* THE RAN-OUT BEAT IS A DRAWN THING, not the absence of one. The whole
            session turns on "what told it to stop?", so the strip has to show
            the pointer asking for a next item and finding none. */}
        <div className="flex w-[124px] flex-col items-center gap-2">
          <div
            className="flex h-[84px] w-full items-center justify-center rounded-card border-2 border-dashed px-2 text-center"
            style={{
              borderColor: ranOut ? colors.danger : colors.line,
              background: ranOut ? `${colors.danger}0F` : 'transparent',
            }}
          >
            <span
              className="font-heading text-body-sm font-bold leading-tight"
              style={{ color: ranOut ? colors.danger : colors.muted }}
            >
              {endLabel}
            </span>
          </div>
          <div className="h-[22px]">
            {ranOut && (
              <motion.div
                className="rounded-pill px-3 py-1 font-heading text-[12px] font-bold uppercase leading-none tracking-wider"
                style={{ background: colors.danger, color: colors.white }}
                initial={instant ? false : { opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: T.label, ease: c4(E.out) }}
              >
                stops
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {(holdsLabel || tallyLabel) && (
        <div className="flex items-start gap-6">
          {holdsLabel && <SlotBox label={holdsLabel} value={beat.holds ?? NOT_YET} />}
          {tallyLabel && <SlotBox label={tallyLabel} value={beat.tally ?? NOT_YET} />}
        </div>
      )}

      <div className="min-h-[76px] w-[900px] rounded-card border border-line bg-surface px-7 py-4">
        {reached > 0 && (
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
