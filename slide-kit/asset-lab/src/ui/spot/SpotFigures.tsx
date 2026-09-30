import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { colors } from '@/design/tokens'
import { T, E, c4 } from '@/ui/figureTiming'
import { SpotIcon } from './SpotIcon'
import type { SpotName } from './spotAssets'

/**
 * THREE ARRANGEMENTS OF SPOT ICONS, WHICH ARE THE THREE THIS DECK IS DEMONSTRATING.
 *
 * `SpotCards`  an icon on a card, as the card's mark. Card scale, about 92px.
 * `SpotSteps`  icons as the nodes of a sequence, with the connector between them
 *              carrying the direction. Node scale, about 78px.
 * `SpotPoints` an icon in the gutter of a claim, as a bullet with a picture on
 *              it. Bullet scale, about 56px.
 *
 * The three sizes are the demonstration as much as the layouts are. The same
 * artwork reads as an ornament at 56, as a label at 92 and as a small figure at
 * 260, and which of those it is doing is the only thing that decides whether a
 * slide has too many pictures on it.
 *
 * WHY THE CARD IS NOT THE KIT'S `Card`
 *
 * It should be, and it is not yet. `Card` in `@/ui/content` takes `icon?:
 * IconName`, a key into the kit's line-icon registry, so it cannot hold a raster
 * asset at all. `SpotCard` below therefore repeats `Card`'s surface exactly
 * (`rounded-card border border-line bg-white p-6 shadow-card-soft`) and nothing
 * else about it, which is the smallest possible duplication and is still
 * duplication.
 *
 * **If this material is adopted, the fix is to widen `Card`'s `icon` prop to
 * `IconName | ReactNode` in the kit and delete `SpotCard`,** not to keep a second
 * card component in a second module. A deck with two cards that look identical
 * and take different props is how the padding starts drifting, which is the
 * lesson every lab in this folder has already paid for. That change is
 * backward-compatible: every existing call passes a string, and a string is still
 * a valid `IconName`.
 *
 * MOTION: EVERYTHING ARRIVES ON ENTRY, STAGGERED.
 *
 * Not click-gated. `CardGrid` in the kit wraps its children in `Step`, which
 * gates each card on a press, and that is right for a list of claims the
 * presenter talks through one at a time. These three figures are each ONE idea
 * with an internal structure, and hard content rule 6 wants a slide's text and
 * its supporting visual to arrive together. The stagger is reading order, not
 * sequence.
 */

const ease = c4(E.out)

/* ------------------------------------------------------------------ */
/* Cards                                                               */
/* ------------------------------------------------------------------ */

export interface SpotCardItem {
  icon: SpotName
  title: ReactNode
  body: ReactNode
}

/**
 * A ROW OF ICON-LED CARDS.
 *
 * The icon sits ABOVE the title rather than beside it, which is the opposite of
 * the kit's `Card`, and the reason is the artwork. A line icon in a 48px well
 * beside a heading is the same visual weight as the heading, so they read as one
 * line. A 92px modelled object beside a heading is three times its weight, and
 * the heading becomes its caption. Above it, the card reads top to bottom:
 * picture, name, sentence.
 *
 * FOUR IS THE CEILING AND IT IS ARITHMETIC. The content well is 1152px; four
 * cards on a 20px gap are 273 each, and a 92px icon plus `p-6` padding leaves
 * 133px for a title. Five cards are 214 each, at which point the icon is over
 * half the card's inner width and the title wraps to three lines.
 */
export function SpotCards({
  items,
  iconSize = 92,
  className = '',
}: {
  items: SpotCardItem[]
  iconSize?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <div
      className={`grid items-stretch gap-5 ${className}`}
      style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}
    >
      {items.map((it, i) => (
        <motion.div
          key={String(it.title)}
          /* `h-full` on the motion element, not just the card: a grid row
             stretches its items, and a wrapper that collapses to its content
             takes the card down with it. Same note the kit's `CardGrid` carries. */
          className="h-full rounded-card border border-line bg-white p-6 shadow-card-soft"
          initial={reduce ? false : { opacity: 0, transform: 'translateY(10px) scale(0.97)' }}
          animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
          transition={{ duration: T.enter, delay: T.lead + i * T.stagger, ease }}
        >
          <SpotIcon name={it.icon} size={iconSize} className="mb-4" />
          <h3 className="mb-1.5 font-heading text-xl font-bold" style={{ color: colors.ink }}>
            {it.title}
          </h3>
          <p className="text-body-sm" style={{ color: colors.body, lineHeight: 1.55 }}>
            {it.body}
          </p>
        </motion.div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Steps                                                               */
/* ------------------------------------------------------------------ */

export interface SpotStepItem {
  icon: SpotName
  label: ReactNode
  note: ReactNode
}

/**
 * ICONS AS THE NODES OF A SEQUENCE.
 *
 * The difference from `SpotCards` is not the size, it is the CONNECTOR. Four
 * cards are a set and their order is the author's; four nodes joined by a line
 * are a sequence and their order is the content. Nothing else on a slide states
 * that as cheaply.
 *
 * NO CARD AROUND EACH NODE. A box round each one turns the sequence back into a
 * set of cards with a line drawn between them, and the eye then reads four boxes
 * rather than one path. The icon is the node.
 *
 * THE CONNECTOR DRAWS ITSELF, one segment at a time, interleaved with the nodes,
 * so the figure assembles along the path rather than appearing and then being
 * joined up. `scaleX` from the left rather than an animated width, because width
 * is a layout property and would re-lay-out the row every frame.
 *
 * It is a plain rule and NOT an arrowhead. An arrowhead at 78px scale is four or
 * five pixels of ink that reads as a smudge on a projector, and the direction is
 * already carried by the order the segments draw in and by the numbered labels.
 */
export function SpotSteps({
  steps,
  iconSize = 78,
  className = '',
}: {
  steps: SpotStepItem[]
  iconSize?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  return (
    <div className={`flex items-start ${className}`}>
      {steps.map((s, i) => (
        <div key={String(s.label)} className="flex min-w-0 flex-1 items-start">
          <motion.div
            className="flex min-w-0 flex-1 flex-col items-center px-3 text-center"
            initial={reduce ? false : { opacity: 0, transform: 'translateY(10px) scale(0.97)' }}
            animate={{ opacity: 1, transform: 'translateY(0px) scale(1)' }}
            transition={{ duration: T.enter, delay: T.lead + i * 2 * T.stagger, ease }}
          >
            <SpotIcon name={s.icon} size={iconSize} ground="glow" />
            <span
              className="mt-4 font-heading text-lg font-bold"
              style={{ color: colors.ink }}
            >
              {s.label}
            </span>
            <span
              className="mt-1 text-body-sm"
              style={{ color: colors.body, lineHeight: 1.5 }}
            >
              {s.note}
            </span>
          </motion.div>

          {i < steps.length - 1 && (
            <motion.span
              aria-hidden
              className="mt-[38px] h-[3px] w-10 shrink-0 rounded-pill"
              style={{ background: colors.line, transformOrigin: 'left' }}
              initial={reduce ? false : { transform: 'scaleX(0)', opacity: 0 }}
              animate={{ transform: 'scaleX(1)', opacity: 1 }}
              transition={{
                duration: T.draw,
                delay: T.lead + (i * 2 + 1) * T.stagger,
                ease,
              }}
            />
          )}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Points                                                              */
/* ------------------------------------------------------------------ */

export interface SpotPointItem {
  icon: SpotName
  body: ReactNode
}

/**
 * AN ICON IN THE GUTTER OF A CLAIM: a bullet with a picture on it.
 *
 * The smallest use in the set, at 56px, and the one with the strictest rule
 * attached. At this size the icon is read as a MARKER rather than as a picture,
 * which means the room takes it in without looking at it, which means an icon
 * that does not depict its own claim is never caught. Hard content rule 8 is
 * hardest to keep here and easiest to break.
 *
 * The gutter is fixed at 56 plus a 20px gap, so every claim starts at the same x
 * and the prose is a column. That is what lets the eye run down the sentences
 * without the icons pulling it sideways, and it is the reason the icons are
 * top-aligned to the first line rather than centred on the row: a two-line claim
 * with a centred icon puts the icon halfway down its own sentence.
 *
 * `aside` is for a cast figure standing beside the list. It takes a third of the
 * width, and the list keeps two thirds, because the claims are the content and
 * the figure is the company.
 */
export function SpotPoints({
  items,
  aside,
  iconSize = 56,
  className = '',
}: {
  items: SpotPointItem[]
  aside?: ReactNode
  iconSize?: number
  className?: string
}) {
  const reduce = useReducedMotion()
  const list = (
    <ul className="space-y-6">
      {items.map((it, i) => (
        <motion.li
          key={String(it.body)}
          className="flex items-start gap-5"
          initial={reduce ? false : { opacity: 0, transform: 'translateY(10px)' }}
          animate={{ opacity: 1, transform: 'translateY(0px)' }}
          transition={{ duration: T.enter, delay: T.lead + i * T.stagger, ease }}
        >
          <SpotIcon name={it.icon} size={iconSize} className="mt-0.5" />
          <span className="text-body-lg" style={{ color: colors.ink, lineHeight: 1.5 }}>
            {it.body}
          </span>
        </motion.li>
      ))}
    </ul>
  )

  if (!aside) return <div className={className}>{list}</div>

  return (
    <div className={`grid grid-cols-[1.9fr_1fr] items-center gap-10 ${className}`}>
      {list}
      <div className="flex justify-center">{aside}</div>
    </div>
  )
}
