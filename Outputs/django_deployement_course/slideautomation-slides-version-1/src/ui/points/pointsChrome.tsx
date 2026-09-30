import type { CSSProperties, ReactNode } from 'react'
import { colors } from '@/design/tokens'
import type { PointTone } from './pointsFigure'

/* `framer-motion` and `figureTiming` used to be imported here for the hover
   popover's 180ms open. Both went with it: this module is paint and type now. */

/**
 * ONE TONE RAMP, ONE TERM CHIP, ONE HOVER, FOR EVERY VARIANT IN THIS LAB.
 *
 * The sibling labs each grew three private copies of their card chrome, and by
 * the second variant the padding had already drifted. Three figures that differ in
 * GEOMETRY must not also differ in how much air is inside a box or which orange a
 * risk is, or the comparison measures the drift instead of the design.
 *
 * THE TONE RAMP, AND WHY `risk` IS NOT RED
 *
 * `danger` on a slide reads as an error in the deck: the room looks for what
 * broke. A risk in a points set is a trap the learner is about to walk into, which
 * is a warning and not a failure, so it takes the amber-orange the style guide
 * already uses for attention. Red stays available for the day a figure genuinely
 * needs to say "this is wrong".
 *
 * `lead` is the deepest brand blue rather than a fifth hue: the lead point is not
 * a different KIND of point, it is the same point carrying more weight, and weight
 * is what a variant's geometry is for.
 */
export const TONE_PAINT: Record<PointTone, string> = {
  neutral: colors.brand,
  good: colors.success,
  risk: colors.accentDark,
  lead: colors.brandDark,
}

export const toneOf = (tone: PointTone | undefined) => TONE_PAINT[tone ?? 'neutral']

/**
 * What a tone SAYS, spelled out.
 *
 * Colour alone carries on a good projector and nothing on a bad one, and a room
 * that cannot tell the amber point from the blue ones has lost the only part of
 * the set that was a warning. So a non-neutral tone gets a word as well as a hue,
 * and `neutral` gets nothing at all: a chip on every point is a chip the eye stops
 * reading.
 */
/**
 * Defaults only. A point's own `tag` wins, because these words were written against
 * one fixture and a deck that means something else by `risk` should say so.
 */
export const TONE_WORD: Record<PointTone, string | null> = {
  neutral: null,
  good: 'this one is free',
  risk: 'the usual trap',
  lead: 'start here',
}

export function ToneChip({
  tone,
  /** The author's own word for this tone. Wins over the default. */
  tag,
  style,
}: {
  tone: PointTone | undefined
  tag?: string
  style?: CSSProperties
}) {
  const word = tag ?? TONE_WORD[tone ?? 'neutral']
  if (!word) return null
  const paint = toneOf(tone)
  return (
    <span
      className="inline-block shrink-0 rounded-pill px-2 py-0.5 text-[10.5px] font-bold uppercase tracking-wider"
      style={{ background: `${paint}1a`, color: paint, ...style }}
    >
      {word}
    </span>
  )
}

/**
 * The term, when the point has one.
 *
 * Mono, because a term is a word the learner will type, and setting it in the body
 * face makes it look like part of the sentence rather than the name of a thing.
 */
export function TermChip({
  term,
  paint,
  size = 'md',
}: {
  term: string
  paint: string
  size?: 'sm' | 'md'
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center rounded-pill font-mono font-bold ${
        size === 'sm' ? 'px-2 py-0.5 text-[10.5px]' : 'px-2.5 py-1 text-[12.5px]'
      }`}
      style={{ background: `${paint}14`, color: paint, border: `1px solid ${paint}2e` }}
    >
      {/*
        ITS OWN TIGHT-LEADING SPAN, AND THAT IS A HARNESS FIX RATHER THAN A STYLE
        CHOICE. The pill is 23px tall from its own padding around a 15px line, and
        `align-check.mjs` infers a wrapped token by comparing an element's height
        against its line-height: every one of the four terms was reported as "one
        token over 2 lines". The padding stays on the pill, the text gets
        `leading-none`, and the measurement matches what the eye sees. Same false
        positive the flow-chart lab hit on its own token chips.
      */}
      <span className="leading-none">{term}</span>
    </span>
  )
}

/**
 * THE ASIDE IS GONE. THIS IS A PASS-THROUGH, AND IT IS DELIBERATE.
 *
 * `HoverAside` used to lift a card on `:hover` and open a 300px popover holding
 * the point's `detail`. Both are removed deck-wide: **a deck has no hover.** It
 * is projected in a room where nobody has a pointer, so anything reachable only
 * by hovering is content that will never be seen by the people the slide is for,
 * and the presenter is the one person who does not need it.
 *
 * The consequence is not "the detail is hidden", it is "the detail has to go
 * somewhere real". Two places, and the figure's own doc says which:
 *
 *   - into the card, as visible copy, where there is room for it. `PeerCards`
 *     now renders `detail` as a paragraph.
 *   - into the slide's `notes`, where there is not. That is where presenter-only
 *     material belongs, and it is where this deck already keeps the setup traps
 *     on slide 5.
 *
 * The signature is unchanged so no call site had to be edited, and the wrapper
 * stays in the tree so the figures' geometry, which counts on a full-size
 * relative box around each node, is untouched.
 */
export function HoverAside({
  children,
  className = '',
}: {
  detail?: ReactNode
  label?: string
  paint?: string
  side?: 'top' | 'bottom'
  dx?: number
  className?: string
  children: ReactNode
}) {
  return <div className={`relative h-full w-full ${className}`}>{children}</div>
}

/**
 * The hover affordance, also gone: with nothing to reveal there is nothing to
 * hint at. Kept as a no-op so the call sites that render it conditionally on
 * `p.detail` do not have to be edited one by one.
 */
export function MoreDot(_props: { paint?: string; className?: string }) {
  return null
}

/** Input this lab cannot draw, said out loud rather than drawn badly. */
export function ProblemPanel({
  problems,
  width,
  height,
}: {
  problems: string[]
  width: number
  height: number
}) {
  return (
    <figure className="relative mx-auto" style={{ width, height }}>
      <div
        className="h-full w-full rounded-card bg-white px-6 py-5"
        style={{ border: `2px solid ${colors.danger}` }}
      >
        <span
          className="mb-3 block font-heading text-[13px] font-bold uppercase tracking-wide"
          style={{ color: colors.danger }}
        >
          This set cannot be stated as authored
        </span>
        <ul className="space-y-1.5">
          {problems.map((p) => (
            <li key={p} className="text-body-sm" style={{ color: colors.ink }}>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </figure>
  )
}
