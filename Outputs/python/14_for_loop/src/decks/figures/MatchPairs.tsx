import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { useClaimedSteps } from '@/motion/Stepper'
import { useInstant } from '@/motion/instant'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'

/**
 * MATCH PAIRS — parts on the left, jobs on the right, one join per click, and
 * the reason for the join underneath it.
 *
 * SESSION-LOCAL, ON PURPOSE, AND TEMPORARILY. A parallel lab in
 * `slide-kit/sequence-lab/` owns the promotion of this deck's three new figures
 * into the kit. Until that lands, this deck keeps its own first cut, and the
 * call site in `forLoopDeck.tsx` re-points at `@/ui` afterwards.
 *
 * WHAT IT IS FOR. A recap the room ANSWERS rather than reads. The room is asked
 * to call out which two go together before the join is made, so the frame is a
 * check on what they still hold, not a restatement of it.
 *
 * WHY THIS REPRESENTATION, AND NOT DRAWN LINES (content rule 27). The obvious
 * form is two columns with a line connecting the matched pair. That form is out
 * here for one reason: a line between two columns is an SVG overlay or an
 * absolutely-positioned layer, and content rule 17 says a figure made mostly of
 * labels is drawn in DOM so `align-check.mjs` can measure it. A drawn line also
 * has to be re-measured whenever a label wraps, which is the exact failure that
 * made session 4's SVG figures ship with overlapping text.
 *
 * So the join is carried by a SHARED NUMBER and a shared highlight: the matched
 * left tile and the matched right tile light at the same instant and wear the
 * same badge. The right column is deliberately out of order, so the badge is the
 * only thing that pairs them, and matching a number to a number is a form every
 * learner has met on paper.
 *
 * WHY THE `why` LINE IS A THIRD ELEMENT. The pairing is the question; the reason
 * is the teaching. Putting the reason inside the right tile would make it
 * readable before the room has committed to a pairing, which is the same defect
 * content rule 16 names on a question slide.
 *
 * NOT a comparison figure. `SwapRows` asserts that the right side STANDS IN FOR
 * the left, and draws the left recessed to say so. Here the two columns are one
 * thing described twice, with no direction between them.
 */

export interface MatchPair {
  /** The part, as the learner types it. */
  left: ReactNode
  /** The job it does, in the source's own words. */
  right: ReactNode
  /** The reason, revealed with the join. */
  why: ReactNode
  /** Render the left cell in the mono face. On by default: these are code lines. */
  code?: boolean
}

export interface MatchPairsProps {
  leftLabel: string
  rightLabel: string
  pairs: MatchPair[]
  /**
   * The order the right column is drawn in, as indexes into `pairs`.
   *
   * Out of order on purpose. In order, the rows pair by position and there is
   * nothing to work out.
   */
  rightOrder: number[]
  className?: string
}

function ColumnHead({ label }: { label: string }) {
  return (
    <div
      className="mb-3 font-heading text-body-sm font-bold uppercase tracking-wider"
      style={{ color: colors.body }}
    >
      {label}
    </div>
  )
}

/*
  ONE COLOUR PER PAIR, CARRIED BY BOTH SIDES.

  The right column is out of order on purpose, so something has to say which
  tile belongs with which. The number does it, and the colour does it faster:
  the room finds the partner by hue from the back of the room and confirms it by
  the digit. The reference deck uses three and no more, because a fourth pair
  would need a hue nobody can name.

  Course rule R5c: the numbering is part of the figure, and it arrives with the
  join rather than sitting there from the start.
*/
const PAIR_TONES = [colors.brand, colors.success, colors.warning] as const
const toneFor = (i: number) => PAIR_TONES[i % PAIR_TONES.length]

function Badge({ n, lit, tone }: { n: number; lit: boolean; tone: string }) {
  return (
    <span
      className="grid h-8 w-8 shrink-0 place-items-center rounded-full font-heading text-body-sm font-bold"
      style={{
        background: lit ? tone : colors.surface2,
        color: lit ? colors.white : colors.muted,
      }}
    >
      {/* THE NUMBER IS THE REVEAL. Before a pair is joined its tile carries an
          empty disc, not a grey digit: a digit that is already on screen has
          done the pairing for the room, which is the one thing this card asks
          them to do. Course rule R5c. */}
      {lit ? n : ''}
    </span>
  )
}

function Tile({
  n,
  lit,
  tone,
  code,
  children,
}: {
  n: number
  lit: boolean
  tone: string
  code?: boolean
  children: ReactNode
}) {
  const instant = useInstant()
  return (
    <motion.div
      className="flex min-h-[74px] items-center gap-3 rounded-card border-2 bg-white px-4 py-3 shadow-card-soft"
      style={{ borderColor: lit ? tone : colors.line, background: lit ? `${tone}12` : colors.white }}
      animate={instant ? {} : { scale: lit ? 1 : 0.995 }}
      transition={{ duration: T.enter, ease: c4(E.out) }}
    >
      <Badge n={n} lit={lit} tone={tone} />
      <span
        className={`${code ? 'font-mono text-[18px] font-semibold' : 'text-body'} leading-snug`}
        style={{ color: lit ? colors.ink : colors.body }}
      >
        {children}
      </span>
    </motion.div>
  )
}

export function MatchPairs({
  leftLabel,
  rightLabel,
  pairs,
  rightOrder,
  className = '',
}: MatchPairsProps) {
  const instant = useInstant()
  const shown = useClaimedSteps(pairs.length)
  const joined = shown.filter(Boolean).length

  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      <div className="grid grid-cols-2 gap-8">
        <div>
          <ColumnHead label={leftLabel} />
          <div className="flex flex-col gap-3">
            {pairs.map((p, i) => (
              <Tile key={`l-${i}`} n={i + 1} lit={joined > i} tone={toneFor(i)} code={p.code ?? true}>
                {p.left}
              </Tile>
            ))}
          </div>
        </div>
        <div>
          <ColumnHead label={rightLabel} />
          <div className="flex flex-col gap-3">
            {rightOrder.map((idx) => (
              <Tile key={`r-${idx}`} n={idx + 1} lit={joined > idx} tone={toneFor(idx)}>
                {pairs[idx].right}
              </Tile>
            ))}
          </div>
        </div>
      </div>

      {/* EVERY REASON STAYS ON SCREEN, each on its own pair's colour. Showing
          one at a time makes the room re-derive the earlier pairings from
          memory while the instructor is talking about the current one, and the
          three reasons together are the recap. Course rule R5c. */}
      <div className="flex flex-col gap-2">
        {pairs.map((p, i) => (
          <motion.p
            key={i}
            className="border-l-[3px] pl-3 text-body-sm leading-snug"
            style={{ borderColor: toneFor(i), color: colors.body }}
            initial={instant ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: joined > i ? 1 : 0, x: 0 }}
            transition={{ duration: T.enter, ease: c4(E.out) }}
          >
            {p.why}
          </motion.p>
        ))}
      </div>
    </div>
  )
}
